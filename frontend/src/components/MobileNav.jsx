import { useState } from "react";
import {
  Menu,
  X,
  MapPin,
  BarChart3,
  Settings,
  Wrench,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSettings } from "../components/context/SettingsContext.jsx";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={`
            md:hidden 
            z-[2000] 
            p-2
            text-white 
            rounded-lg 
            cursor-pointer
            ${isOpen ? "hidden" : "flex"}`}
      >
        <Menu />
      </button>

      {isOpen &&
        createPortal(
          <div className={` fixed inset-0 z-[3000] flex bg-black/70 items-start justify-left p-2 md:hidden theme-${settings.theme}`}>
            <div
              className="
          relative 
          overflow-hidden
          bg-[var(--bg-card)] 
          backdrop-blur-md 
          [border:var(--border-subtle)]
          p-6 
          pb-12
          rounded-2xl 
          flex 
          flex-col 
          gap-6 
          w-3/4 
          max-w-xs 
          shadow-2xl
          md:hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 cursor-pointer"
              >
                <X />
              </button>

              <nav className="relative z-10 flex-1 flex-col gap-2 px-1">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/"
                  className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        text-[var(--text-good)]
                        gap-2
                        w-60
`}
                >
                  <MapPin size={20} />
                  <span
                    className={`font-medium whitespace-nowrap text-[var(--text-primary)] pl-2`}
                  >
                    Dashboard
                  </span>
                </Link>

                <Link
                  onClick={() => setIsOpen(false)}
                  to="/analytics"
                  className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        text-[var(--text-good)]
                        gap-2 
                        w-60
`}
                >
                  <BarChart3 size={20} />
                  <span
                    className={`font-medium whitespace-nowrap text-[var(--text-primary)] pl-2`}
                  >
                    Analytics
                  </span>
                </Link>

                <Link
                  onClick={() => setIsOpen(false)}
                  to="/maintenance"
                  className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg            
                        text-[var(--text-good)]
                        gap-2 
                        w-60
`}
                >
                  <Wrench size={20} />
                  <span
                    className={`font-medium whitespace-nowrap text-[var(--text-primary)] pl-2`}
                  >
                    Maintenance
                  </span>
                </Link>

                <Link
                  onClick={() => setIsOpen(false)}
                  to="/users"
                  className={`flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        text-[var(--text-good)]
                        gap-2 
                        w-60
`}
                >
                  <UsersRound size={20} />
                  <span
                    className={`font-medium whitespace-nowrap text-[var(--text-primary)] pl-2`}
                  >
                    Users
                  </span>
                </Link>

                <Link
                  onClick={() => setIsOpen(false)}
                  to="/settings"
                  className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        text-[var(--text-good)]
                        gap-2
                        w-60
`}
                >
                  <Settings size={20} />
                  <span
                    className={`font-medium whitespace-nowrap text-[var(--text-primary)] pl-2`}
                  >
                    Settings
                  </span>
                </Link>
              </nav>
              <svg
                className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
                viewBox="0 0 375 55"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="nav-wave-gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--text-good)"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--text-good)"
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0,40 C90,70 210,10 375,50 L375,90 L0,90 Z"
                  fill="var(--text-good)"
                  fillOpacity="0.05"
                />
                <path
                  d="M0,35 C110,85 240,5 375,45 L375,90 L0,90 Z"
                  fill="url(#nav-wave-gradient)"
                />
              </svg>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default MobileNav;
