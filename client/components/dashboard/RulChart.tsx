import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, Area } from "recharts";
import type { EngineRecord } from "@shared/api";

export default function RulChart({ engine, height = 240 }: { engine: EngineRecord; height?: number }) {
  const data = engine.history.map((p) => ({
    cycle: p.cycle,
    predicted: p.predicted,
    qLow: p.qLow,
    qHigh: p.qHigh,
    actual: p.actual,
  }));
  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="cycle" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
          <Tooltip contentStyle={{ background: "#0b1c39", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
          <Area type="monotone" dataKey="qHigh" stroke="transparent" fill="#38bdf8" fillOpacity={0.15} />
          <Area type="monotone" dataKey="qLow" stroke="transparent" fill="#0b1c39" fillOpacity={1} />
          <Line type="monotone" dataKey="predicted" stroke="#60a5fa" strokeWidth={3} dot={{ r: 2 }} name="Predicted RUL" />
          <Line type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={2} dot={{ r: 2 }} name="Actual" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
