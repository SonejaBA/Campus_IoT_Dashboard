import { NavLink } from "react-router-dom";
import {
  Map,
  BarChart3,
  Wrench,
  Settings,
  Leaf,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  // Tracks whether the sidebar is expanded or collapsed
  const [collapsed, setCollapsed] = useState(false);
  // Defines the sidebar navigation links and icons
  const navItems = [
    {
      name: "Overview",
      path: "/",
      icon: Map,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: Wrench,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        hidden md:flex
        h-screen shrink-0
        bg-[#0a1211]
        border-r border-white/10
        flex-col
        relative
        transition-[width] duration-200
        ${collapsed ? "w-[72px]" : "w-[210px]"}
      `}
    >
      {/* BRAND */}
      <div className="h-[92px] border-b border-white/10 flex items-center px-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 border border-emerald-400/30 flex items-center justify-center bg-emerald-400/5">
            <Leaf size={21} className="text-emerald-400" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.22em] uppercase text-emerald-400 font-semibold">
                Sac State
              </p>

              <p className="text-[13px] font-semibold text-slate-100 leading-tight mt-0.5">
                Waste Operations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION LABEL */}
      {!collapsed && (
        <div className="px-5 pt-7 pb-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-slate-600 font-semibold">
            Operations
          </p>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className={`flex flex-col ${collapsed ? "pt-6" : ""}`}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `
                  relative
                  h-[52px]
                  flex items-center
                  transition-colors
                  ${
                    collapsed
                      ? "justify-center px-0"
                      : "gap-3 px-5"
                  }
                  ${
                    isActive
                      ? "bg-emerald-400/[0.07] text-white"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.025]"
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className={
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }
                  />

                  {!collapsed && (
                    <span className="text-[13px] font-medium tracking-wide">
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM SYSTEM AREA */}
      <div className="mt-auto">
        {!collapsed && (
          <div className="mx-5 mb-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>

              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                System Online
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-relaxed text-slate-700">
              Sacramento State
              <br />
              Campus Waste Network
            </p>
          </div>
        )}

        {/* COLLAPSE CONTROL */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            h-12 w-full
            border-t border-white/10
            flex items-center justify-center
            text-slate-600
            hover:text-emerald-400
            hover:bg-white/[0.025]
            transition-colors
          "
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={17}
            className={`transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
