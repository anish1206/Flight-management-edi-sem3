import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DefectLog, EngineRecord, MaintenanceAlert, EngineComponent } from "@shared/api";

const STORAGE_KEYS = {
  engines: "pm_engines_v1",
  defects: "pm_defects_v1",
};

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

function makeEngine(id: number): EngineRecord {
  const rnd = seededRandom(id + 1);
  const baseRul = Math.floor(40 + rnd() * 200);
  const qLow = Math.max(10, baseRul - 20 - Math.floor(rnd() * 10));
  const qHigh = Math.min(300, baseRul + 20 + Math.floor(rnd() * 10));
  const comps: EngineComponent[] = ["Fan", "LPC", "HPC", "HPT", "LPT"];
  const comp = comps[Math.floor(rnd() * comps.length)];
  const historyLen = 12;
  const history = Array.from({ length: historyLen }, (_, i) => {
    const cycle = i * 10;
    const noise = (rnd() - 0.5) * 10;
    const predicted = Math.max(5, baseRul + (i - historyLen / 2) * 3 + noise);
    const spread = 15 + rnd() * 20;
    return {
      cycle,
      predicted,
      qLow: Math.max(5, predicted - spread),
      qHigh: Math.min(320, predicted + spread),
      actual: i % 3 === 0 ? Math.max(5, predicted + (rnd() - 0.5) * 8) : undefined,
    };
  });
  const contributors = [
    { sensor: "T24 (HPC temp)", weight: +(0.2 + rnd() * 0.5).toFixed(2) },
    { sensor: "P30 (HPC pressure)", weight: +(0.2 + rnd() * 0.5).toFixed(2) },
    { sensor: "N2 (core speed)", weight: +(0.1 + rnd() * 0.3).toFixed(2) },
  ];
  return {
    id: String(id + 1),
    currentRUL: baseRul,
    predictedFailureComponent: comp,
    confidenceLow: qLow,
    confidenceHigh: qHigh,
    lastUpdated: new Date(Date.now() - Math.floor(rnd() * 86400000)).toISOString(),
    history,
    contributors,
  };
}

function generateInitialEngines(count = 30): EngineRecord[] {
  return Array.from({ length: count }, (_, i) => makeEngine(i));
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export interface DataContextValue {
  engines: EngineRecord[];
  defects: DefectLog[];
  alerts: MaintenanceAlert[];
  addDefect: (d: Omit<DefectLog, "id" | "createdAt">) => void;
  refreshTimestamps: () => void;
}

const Ctx = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [engines, setEngines] = useState<EngineRecord[]>(() => load(STORAGE_KEYS.engines, generateInitialEngines()));
  const [defects, setDefects] = useState<DefectLog[]>(() => load(STORAGE_KEYS.defects, [] as DefectLog[]));
  const channelRef = useRef<BroadcastChannel | null>(null);

  // derive alerts from engines RUL
  const alerts = useMemo<MaintenanceAlert[]>(() => {
    const arr: MaintenanceAlert[] = [];
    for (const e of engines) {
      const level = e.currentRUL > 100 ? "Healthy" : e.currentRUL >= 50 ? "Caution" : "Critical";
      const message =
        level === "Healthy"
          ? `Engine #${e.id} is healthy (>100 cycles left).`
          : level === "Caution"
          ? `Engine #${e.id} needs attention within ${Math.max(10, Math.floor(e.currentRUL / 2))} cycles.`
          : `Engine #${e.id} needs inspection within ${Math.max(5, Math.floor(e.currentRUL / 3))} cycles.`;
      arr.push({
        id: `${e.id}-${level}`,
        engineId: e.id,
        level,
        message,
        cyclesLeft: e.currentRUL,
        createdAt: e.lastUpdated,
      });
    }
    return arr.sort((a, b) => a.cyclesLeft - b.cyclesLeft);
  }, [engines]);

  useEffect(() => {
    save(STORAGE_KEYS.engines, engines);
  }, [engines]);
  useEffect(() => {
    save(STORAGE_KEYS.defects, defects);
  }, [defects]);

  useEffect(() => {
    const ch = new BroadcastChannel("pm-data-sync");
    channelRef.current = ch;
    ch.onmessage = (ev) => {
      const { type, payload } = ev.data || {};
      if (type === "defect:add") {
        setDefects((d) => {
          const next = [...d, payload as DefectLog];
          return next;
        });
      }
      if (type === "engines:set") {
        setEngines(payload as EngineRecord[]);
      }
    };
    return () => ch.close();
  }, []);

  const addDefect = useCallback((d: Omit<DefectLog, "id" | "createdAt">) => {
    const entry: DefectLog = { ...d, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setDefects((prev) => [...prev, entry]);
    channelRef.current?.postMessage({ type: "defect:add", payload: entry });
  }, []);

  const refreshTimestamps = useCallback(() => {
    // touch lastUpdated to now (simulate new prediction tick)
    setEngines((prev) => prev.map((e) => ({ ...e, lastUpdated: new Date().toISOString() })));
  }, []);

  const value: DataContextValue = {
    engines,
    defects,
    alerts,
    addDefect,
    refreshTimestamps,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
