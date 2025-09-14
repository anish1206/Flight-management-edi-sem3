import { NavLink } from "react-router-dom";
import { Plane, LayoutDashboard, Wrench, BarChart3, Settings, ChevronRight, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fleet", label: "Fleet Overview", icon: Plane },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/cabin", label: "Cabin Defects", icon: ClipboardList },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-[#0c2244] text-white/90 border-r border-white/10">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <Plane className="size-5 text-sky-400" />
        <span className="font-semibold tracking-wide">Aircraft Dashboard</span>
      </div>
      <nav className="p-3 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="size-4 opacity-0 group-hover:opacity-60 transition-opacity" />
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4 text-xs text-white/50">
        v1.0 • Status: Stable
      </div>
    </aside>
  );
}
