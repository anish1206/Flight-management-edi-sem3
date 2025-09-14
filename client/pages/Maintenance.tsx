import Layout from "@/components/layout/Layout";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "../context/DataContext";

export default function Maintenance() {
  const { alerts, defects } = useData();
  return (
    <Layout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <AlertsPanel alerts={alerts} />
        </div>
        <Card className="bg-white/10 border-white/10 text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-white/70">Cabin Defects (Live)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {defects.length === 0 && <div className="text-white/60 text-sm">No defects logged yet.</div>}
            {defects.map((d) => (
              <div key={d.id} className="border border-white/10 rounded p-3">
                <div className="text-sm font-medium">{d.category} • {d.severity}</div>
                <div className="text-sm mt-1">{d.description}</div>
                <div className="text-xs text-white/60 mt-1">{d.flight ? `${d.flight} • ` : ""}{new Date(d.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
