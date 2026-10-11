import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function AppLayout({ bins }) {
  return (
    <div 
      className="theme-glass h-screen w-screen flex flex-row font-sans overflow-hidden text-[var(--text-primary)]"
      style={{ background: "var(--bg-page)" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <Header bins={bins} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;