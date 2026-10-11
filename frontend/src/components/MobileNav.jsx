import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
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

      {isOpen && (
        <div
          className="fixed 
        inset-0 
        z-[3000] 
        flex 
        items-start
        justify-left 
        bg-[var(--bg-card)]
        backdrop-blur-[var(--backdrop-blur-light)] 
        p-2"
        >
          <div className="relative bg-[#1E1E1E]/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-6 w-3/4 max-w-xs shadow-2xl">
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
                        hover:bg-[var(--bg-hover)]
                        transition-colors 
                        text-white 
`}
              >
                <span
                  className={`font-medium whitespace-nowrap text-gray-300 pl-2`}
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
                        hover:bg-[var(--bg-hover)]
                        transition-colors 
                        text-white 
`}
              >
                <span
                  className={`font-medium whitespace-nowrap text-gray-300 pl-2`}
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
                        hover:bg-[var(--bg-hover)]
                        transition-colors 
                        text-white 
`}
              >
                <span
                  className={`font-medium whitespace-nowrap text-gray-300 pl-2`}
                >
                  Maintenance
                </span>
              </Link>

              <Link
                onClick={() => setIsOpen(false)}
                to="/settings"
                className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        hover:bg-[var(--bg-hover)]
                        transition-colors 
                        text-white 
`}
              >
                <span
                  className={`font-medium whitespace-nowrap text-gray-300 pl-2`}
                >
                  Settings
                </span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;
