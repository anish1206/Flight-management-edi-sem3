import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useData } from "../context/DataContext";

export default function Analytics() {
  const { engines } = useData();
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/10 text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-white/70">Top Recurring Faults</CardTitle>
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

        <Card className="bg-white/10 border-white/10 text-white xl:col-span-2">
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-white/70">RUL Distribution Across Fleet</CardTitle>
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
    </Layout>
  );
}
