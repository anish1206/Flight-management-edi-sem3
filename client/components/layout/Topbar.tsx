import { Bell, Search, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <header className="flex items-center gap-3 h-16 px-4 md:px-6 border-b border-white/10 bg-[#0e2a55] text-white/90">
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
          <input
            placeholder="Search components, engines, maintenance..."
            className="w-full rounded-md bg-white/10 pl-10 pr-3 py-2 text-sm placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-500/60 border border-white/10"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" className="text-white/80 hover:bg-white/10">
          <CircleHelp className="size-4" />
        </Button>
        <Button variant="ghost" className="relative text-white/80 hover:bg-white/10">
          <Bell className="size-4" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-rose-500 text-[10px] font-semibold">3</span>
        </Button>
        <div className="ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 ring-2 ring-white/20" />
      </div>
    </header>
  );
}
