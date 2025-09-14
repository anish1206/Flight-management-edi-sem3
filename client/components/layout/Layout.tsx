import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex bg-[#0b1c39]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 text-white/90">{children}</main>
      </div>
    </div>
  );
}
