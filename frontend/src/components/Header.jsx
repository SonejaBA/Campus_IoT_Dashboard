import { useCheckHealth } from "../hooks/useCheckHealth";
import { useLocation } from "react-router-dom";
import { Bell, Tally1, BatteryLow, Trash, Filter } from "lucide-react";
import MobileNav from "../components/MobileNav.jsx";
import { useMemo, useState } from "react";
import { useSettings } from "../components/context/SettingsContext.jsx";
const connected = "bg-emerald-500";
const disconnected = "bg-red-500";

const pageTitles = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/maintenance": "Maintenance",
};

const filterOptions = [
  { value: "all", label: "All bins" },
  { value: "green", label: "Green (0–49%)" },
  { value: "yellow", label: "Yellow (50–79%)" },
  { value: "red", label: "Red (80–100%)" },
];

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

function NotificationDot({ numOfNotifications }) {
  const moreThanNine = numOfNotifications > 9;
  numOfNotifications = moreThanNine ? "9+" : numOfNotifications;

  if (!numOfNotifications || numOfNotifications <= 0) return null;

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
      top-1
      text-white"
    >
      {numOfNotifications}
    </span>
  );
}

function Header({ bins }) {
  const { settings } = useSettings();
  const FILL_THRESHOLD = settings.fillCritical;
  const BATTERY_THRESHOLD = settings.batteryWarning;

  const isHealthy = useCheckHealth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const attentionBins = useMemo(() => {
    return [...(bins ?? [])]
      .filter((bin) => bin.fill_level >= FILL_THRESHOLD)
      .sort((a, b) => b.fill_level - a.fill_level);
  }, [bins, FILL_THRESHOLD]);
  const lowBatteryBins = useMemo(() => {
    return (bins ?? []).filter(
      (bin) =>
        bin.battery_level != null && bin.battery_level < BATTERY_THRESHOLD,
    );
  }, [bins, BATTERY_THRESHOLD]);
  const notificationCount = attentionBins.length + lowBatteryBins.length;
  return (
    <div
      className="
    bg-[var(--bg-header)] 
    text-[var(--text-primary)]
    p-4 
    h-14 
    items-center 
    justify-between 
    flex 
    flex-row 
    [border:var(--border-subtle)]
    backdrop-blur-[var(--backdrop-blur-strong)]
    z-[2000]
    "
    >
      <div className="gap-2 items-center flex ">
        <MobileNav />
        <h1 className="font-medium md:hidden"> {pageTitles[currentPath]} </h1>
      </div>
      <div className="gap-2 items-center flex ">
        <div className="relative top-1">
          <button
            className="px-4 relative cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <NotificationDot numOfNotifications={notificationCount} />
            <div className="rounded-full hover:bg-white/10 p-2 text-[var(--button-color)]">
              <Bell size={20} />
            </div>
          </button>

          {isOpen && (
            <div
              className="absolute 
            right-0 
            top-12 
            z-[2000] 
            w-72 
            max-h-64 
            overflow-y-auto 
            overscroll-contain 
            flex 
            flex-col 
            gap-1 
            p-2 
            text-sm 
            text-[var(--text-secondary)]
            rounded-lg 
            bg-[var(--bg-card-strong)]
            [border:var(--border-card)]
            shadow-[var(--shadow-card-subtle)]"
            >
              {attentionBins.map((bin) => (
                <p key={bin.id} className="flex items-center gap-2">
                  <Trash size={16} className="shrink-0 text-[var(--status-critical)]" />
                  Bin {bin.id}: {bin.fill_level}%
                </p>
              ))}

              {lowBatteryBins.map((bin) => (
                <p
                  key={`${bin.id}-battery`}
                  className="flex items-center gap-2"
                >
                  <BatteryLow size={16} className="shrink-0 text-[var(--status-warning)]" />
                  Battery level critical: Bin {bin.id} ({bin.battery_level}%)
                </p>
              ))}

              {!notificationCount && "No Notifications"}
            </div>
          )}
        </div>

        <Tally1 className="text-[var(--button-color)]"/>
        <StatusDot serverHealthy={isHealthy} />
        <h1 className="font-medium hidden md:block text-[var(--button-color)]">
          {isHealthy ? "System online" : "System offline"}
        </h1>
      </div>
    </div>
  );
}

export default Header;
