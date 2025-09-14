import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useData } from "../context/DataContext";
import RulChart from "@/components/dashboard/RulChart";
import EngineTable from "@/components/dashboard/EngineTable";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import Contributors from "@/components/dashboard/Contributors";

const summaryLabels = {
  fleet: "Fleet Status Summary",
  critical: "Critical Alerts",
  upcoming: "Upcoming Maintenance",
  avg: "Average RUL",
} as const;


const pieData = [
  { name: "Recurring Faults", value: 35, color: "#60a5fa" },
  { name: "Compressor", value: 35, color: "#f43f5e" },
  { name: "Turbine", value: 28, color: "#22c55e" },
  { name: "Other", value: 2, color: "#a78bfa" },
];

const barData = [
  { range: "0-50", r1: 5, r2: 3 },
  { range: "51-100", r1: 8, r2: 6 },
  { range: "101-150", r1: 6, r2: 7 },
  { range: "151-200", r1: 4, r2: 5 },
];

const heatmapRows = 7;
const heatmapCols = 12;
const heatmap: number[][] = Array.from({ length: heatmapRows }, (_, r) =>
  Array.from({ length: heatmapCols }, (_, c) => (r * 13 + c * 7) % 100),
);

const heatColor = (v: number) => {
  const t = v / 100; // 0..1
  const r = Math.round(255 * t);
  const b = Math.round(200 * (1 - t));
  return `rgb(${r},80,${b})`;
};

export default function Index() {
  const { engines, alerts, defects } = useData();
  const active = engines.length;
  const criticalCount = alerts.filter((a) => a.level === "Critical").length;
  const avgRul = Math.round(engines.reduce((s, e) => s + e.currentRUL, 0) / Math.max(1, engines.length));
  const topEngine = engines[0];
  const componentCounts = engines.reduce<Record<string, number>>((acc, e) => {
    acc[e.predictedFailureComponent] = (acc[e.predictedFailureComponent] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(componentCounts).map(([name, value]) => ({ name, value, color: name === "HPC" ? "#f43f5e" : name === "HPT" ? "#fb7185" : name === "LPT" ? "#22c55e" : name === "LPC" ? "#a78bfa" : "#60a5fa" }));

  const buckets = ["0-50", "51-100", "101-150", "151-200", ">200"];
  const barData = buckets.map((b) => ({ range: b, count: 0 }));
  for (const e of engines) {
    const i = e.currentRUL <= 50 ? 0 : e.currentRUL <= 100 ? 1 : e.currentRUL <= 150 ? 2 : e.currentRUL <= 200 ? 3 : 4;
    barData[i].count++;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">{summaryLabels.fleet}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-semibold">{active}</div>
              <div className="text-xs text-white/60">Active Engines</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">{summaryLabels.critical}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-semibold">{criticalCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">Upcoming Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-semibold">{alerts.filter((a) => a.level !== "Healthy").length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">{summaryLabels.avg}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-2xl font-semibold">{avgRul} Cycles</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/10 text-white xl:col-span-2">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">RUL Prediction (Cycles)</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {topEngine && <RulChart engine={topEngine} height={240} />}
              {topEngine && (
                <div className="mt-3 text-xs text-white/70">
                  Confidence interval: {Math.round(topEngine.confidenceLow)}–{Math.round(topEngine.confidenceHigh)} cycles
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">Fleet Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                {pieData.map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-white/70">{p.name}</span>
                    <span className="ml-auto font-semibold">{p.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">Component Health Status (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {Object.entries(componentCounts).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3">
                    <span className="w-20 text-white/70">{k}</span>
                    <div className="flex-1 h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-rose-500/60" style={{ width: `${Math.min(100, (v / active) * 100)}%` }} />
                    </div>
                    <span className="w-10 text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-white/60">Higher bar indicates higher failure probability share across fleet.</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 text-white xl:col-span-2">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">RUL Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <Tooltip contentStyle={{ background: "#0b1c39", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                  <Bar dataKey="count" fill="#60a5fa" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/10 text-white xl:col-span-2">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">Fleet Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <EngineTable engines={[...engines].sort((a,b)=>a.currentRUL-b.currentRUL).slice(0,6)} />
            </CardContent>
          </Card>
          <AlertsPanel alerts={alerts} max={6} />
        </div>

        {topEngine && (
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader className="p-4">
              <CardTitle className="text-sm text-white/70">Top Contributors (Explainability)</CardTitle>
            </CardHeader>
            <CardContent>
              <Contributors items={topEngine.contributors} />
              <div className="text-xs text-white/60 mt-2">Sensors most influencing the latest RUL prediction.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
