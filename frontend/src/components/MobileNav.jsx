import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

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
            bg-[#1E1E1E]/40 
            text-white 
            rounded-lg 
            cursor-pointer
            ${isOpen ? "hidden" : "flex"}`}
      >
        <Menu />
      </button>

      {isOpen && createPortal(
        <div
          className="
        fixed 
        inset-0 
        z-[3000] 
        flex
        bg-black/70
        items-start 
        justify-left 
        p-2"
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
          shadow-2xl"
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
                        hover:bg-gradient-to-r
                        hover:from-emerald-900/80
                        hover:to-emerald-900/20
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
                        hover:bg-gradient-to-r
                        hover:from-emerald-900/80
                        hover:to-emerald-900/20
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
                        hover:bg-gradient-to-r
                        hover:from-emerald-900/80
                        hover:to-emerald-900/20
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
                        hover:bg-gradient-to-r
                        hover:from-emerald-900/80
                        hover:to-emerald-900/20
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
        </div>, document.body
      )}
    </div>
  );
}

export default MobileNav;
