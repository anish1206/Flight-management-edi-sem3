import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MaintenanceAlert } from "@shared/api";

function dotColor(level: MaintenanceAlert["level"]) {
  if (level === "Healthy") return "bg-emerald-400";
  if (level === "Caution") return "bg-amber-400";
  return "bg-rose-500";
}

export default function AlertsPanel({ alerts, max }: { alerts: MaintenanceAlert[]; max?: number }) {
  const list = max ? alerts.slice(0, max) : alerts;
  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardHeader className="p-4">
        <CardTitle className="text-sm text-white/70">Maintenance Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <span className={`mt-1 h-2 w-2 rounded-full ${dotColor(a.level)}`} />
            <div className="flex-1">
              <div className="text-sm">{a.message}</div>
              <div className="text-xs text-white/60">Engine #{a.engineId} • {a.cyclesLeft} cycles left • {new Date(a.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
