import { checkHealth } from "../hooks/useCheckHealth";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { Tally1 } from "lucide-react";
import MobileNav from "../components/MobileNav.jsx";

const connected = "bg-emerald-500";
const disconnected = "bg-red-500";

const pageTitles = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/maintenance": "Maintenance",
};

function StatusDot({ serverHealthy }) {
  const isDisconnected = serverHealthy === false;
  return (
    <span
      className="
            relative
            flex
            h-3
            w-3"
    >
      <span
        className={`
                animate-ping
                absolute
                h-full
                w-full
                rounded-full
                opacity-75 
                ${isDisconnected ? disconnected : connected}`}
      />

      <span
        className={`
                relative
                h-3
                w-3
                rounded-full
                ${isDisconnected ? disconnected : connected}`}
      />
    </span>
  );
}

function NotificationDot({ numOfNotifications = 10 }) {
  const moreThanNine = numOfNotifications > 9;
  numOfNotifications = moreThanNine ? "9+" : numOfNotifications;

  return (
    <span
      className="
      absolute 
      bg-red-700
      rounded-full 
      h-4
      w-4
      items-center 
      justify-center
      text-[10px] 
      font-bold 
      -top-1"
    >
      {numOfNotifications}
    </span>
  );
}

function Header() {
  const isHealthy = checkHealth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-[#1E1E1E] text-white p-4 h-15 items-center justify-between flex flex-row border-b-2 border-[#adadad]">
      <div className="gap-2 items-center flex ">
        <MobileNav />
        <h1 className="font-medium md:hidden"> {pageTitles[currentPath]} </h1>
      </div>
      <div className="gap-2 items-center flex ">
        <button
          className="px-5 relative cursor-pointer">
          <NotificationDot numOfNotifications={10} />
          <Bell size={18} />
        </button>
        <Tally1/>
        <StatusDot serverHealthy={isHealthy} />
        <h1 className="font-medium hidden sm:block">
          {isHealthy ? "System online" : "System offline"}
        </h1>
      </div>
    </div>
  );
}

export default Header;
