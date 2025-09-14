import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EngineRecord } from "@shared/api";

function badgeColor(rul: number) {
  return rul > 100 ? "bg-emerald-500/20 text-emerald-300" : rul >= 50 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300";
}

export default function EngineTable({ engines, onSelect }: { engines: EngineRecord[]; onSelect?: (e: EngineRecord) => void }) {
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <Table className="text-white/90">
        <TableHeader>
          <TableRow className="bg-white/5">
            <TableHead className="text-white/70">Engine ID</TableHead>
            <TableHead className="text-white/70">Current RUL (cycles)</TableHead>
            <TableHead className="text-white/70">Predicted Failure Component</TableHead>
            <TableHead className="text-white/70">Confidence Interval</TableHead>
            <TableHead className="text-white/70">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {engines.map((e) => (
            <TableRow key={e.id} className="hover:bg-white/5 cursor-pointer" onClick={() => onSelect?.(e)}>
              <TableCell className="font-semibold">#{e.id}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded ${badgeColor(e.currentRUL)}`}>{e.currentRUL}</span>
              </TableCell>
              <TableCell>{e.predictedFailureComponent}</TableCell>
              <TableCell>
                {Math.round(e.confidenceLow)} - {Math.round(e.confidenceHigh)}
              </TableCell>
              <TableCell>{new Date(e.lastUpdated).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
