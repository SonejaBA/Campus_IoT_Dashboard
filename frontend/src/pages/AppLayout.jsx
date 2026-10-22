import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useSettings } from "../components/context/SettingsContext";
import { useAuth } from "../components/context/AuthContext";

function AppLayout({ bins }) {
  const { settings } = useSettings();
  const {role} = useAuth();

  return (
    <div 
      className={`theme-${settings.theme} h-screen w-screen flex flex-row font-sans overflow-clip text-[var(--text-primary)]`}
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