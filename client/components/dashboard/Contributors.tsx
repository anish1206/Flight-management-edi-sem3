import type { ExplainContributor } from "@shared/api";

export default function Contributors({ items }: { items: ExplainContributor[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-1 text-xs text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          <span>{c.sensor}</span>
          <span className="text-white/60">{Math.round(c.weight * 100)}%</span>
        </span>
      ))}
    </div>
  );
}
