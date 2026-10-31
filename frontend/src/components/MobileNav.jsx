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

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

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
          <div
            className="
        fixed 
        inset-0 
        z-[3000] 
        flex
        bg-black/70
        items-start 
        justify-left 
        p-2
        md:hidden"
          >
            <div
              className="
          relative 
          bg-[var(--bg-card)] 
          backdrop-blur-md 
          border-[var(--border-subtle)]
          p-6 
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

              <nav className="flex-1 flex-col gap-2 px-1">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/"
                  className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        text-[var(--text-good)]
                        gap-2 
`}
                > 
                  <MapPin size={20}/>
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
`}
                >
                  <BarChart3 size={20}/>
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
`}
                >
                  <Wrench size={20}/>
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
`}
                >
                  <UsersRound size={20}/>
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
`}
                >
                  <Settings size={20}/>
                  <span
                    className={`font-medium whitespace-nowrap text-[var(--text-primary)] pl-2`}
                  >
                    Settings
                  </span>
                </Link>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default MobileNav;
