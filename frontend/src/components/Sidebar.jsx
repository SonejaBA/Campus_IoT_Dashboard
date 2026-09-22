import { useState } from "react";
import treeLogo from "../assets/treeLogo.png";
import wordLogo from "../assets/wordLogo.png";
import { Link } from "react-router-dom";
import {
  PanelLeftClose,
  MapPin,
  BarChart3,
  Settings,
  Wrench,
} from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const handleLogoClick = () => {
    if (isOpen) return;
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`
        hidden 
        md:flex
        flex-col
        h-full
        bg-[#1E1E1E] 
        text-white 
        p-4
        gap-4
        ${isOpen ? "w-60" : "w-20"}
        transition-all
        duration-200
        border-r-2
        border-[#adadad]
        `}
    >
      {/*Logo and sidebar colapase button */}
      <div
        className={`flex flex-row  mb-6 ${isOpen ? "justify-between" : "justify-center px-0"} items-center`}
      >
        <img
          onClick={handleLogoClick}
          src={isOpen ? wordLogo : treeLogo}
          alt="Sacramento State Sustainability"
          title="Open sidebar"
          className={`
                        w-auto
                        object-contain
                        cursor-pointer
                        hover:bg-white/10
                        ${isOpen ? "h-20 cursor-default pointer-events-none" : "h-10 justify-center rounded-full"}`}
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Close sidebar"
          className={`${isOpen ? "block" : "hidden"} 
                        flex
                        items-center
                        justify-center
                        w-10 
                        h-10 
                        cursor-pointer
                        text-[#F2F2F3] 
                        aria-label="Collapse Sidebar" 
                        rounded-full 
                        hover:bg-white/10
                        `}
        >
          <PanelLeftClose className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <nav className="flex-1 flex-col gap-2 px-1">
        <Link
          to="/"
          title={isOpen ? "" : "Dashboard"}
          className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        ${
                          isOpen
                            ? "hover:bg-gradient-to-r hover:from-emerald-900/80 hover:to-emerald-900/20"
                            : "hover:bg-emerald-900/80"
                        }
                        transition-colors 
                        text-white
                        ${
                          isOpen
                            ? "justify-start gap-4 "
                            : "justify-center px-0"
                        }`}
        >
          <MapPin className="shrink-0 text-gray-300" />
          <span
            className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap text-gray-300`}
          >
            Dashboard
          </span>
        </Link>

        <Link
          to="/analytics"
          title={isOpen ? "" : "Analytics"}
          className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        ${
                          isOpen
                            ? "hover:bg-gradient-to-r hover:from-emerald-900/80 hover:to-emerald-900/20"
                            : "hover:bg-emerald-900/80"
                        }
                        transition-colors 
                        text-white 
                        ${
                          isOpen
                            ? "justify-start gap-4 "
                            : "justify-center px-0"
                        }`}
        >
          <BarChart3 className="shrink-0 text-gray-300" />
          <span
            className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap text-gray-300`}
          >
            Analytics
          </span>
        </Link>

        <Link
          to="/maintenance"
          title={isOpen ? "" : "Maintenance"}
          className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        ${
                          isOpen
                            ? "hover:bg-gradient-to-r hover:from-emerald-900/80 hover:to-emerald-900/20"
                            : "hover:bg-emerald-900/80"
                        }
                        transition-colors 
                        text-white 
                        ${
                          isOpen
                            ? "justify-start gap-4 "
                            : "justify-center px-0"
                        }`}
        >
          <Wrench className="shrink-0 text-gray-300" />
          <span
            className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap text-gray-300`}
          >
            Maintenance
          </span>
        </Link>

        <Link
          to="/settings"
          title={isOpen ? "" : "Settings"}
          className={`  flex 
                        items-center 
                        py-2 
                        rounded-lg 
                        ${
                          isOpen
                            ? "hover:bg-gradient-to-r hover:from-emerald-900/80 hover:to-emerald-900/20"
                            : "hover:bg-emerald-900/80"
                        }
                        transition-colors 
                        text-white 
                        ${
                          isOpen
                            ? "justify-start gap-4 "
                            : "justify-center px-0"
                        }`}
        >
          <Settings className="shrink-0 text-gray-300" />
          <span
            className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap text-gray-300`}
          >
            Settings
          </span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
