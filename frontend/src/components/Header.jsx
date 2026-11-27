import { useCheckHealth } from "../hooks/useCheckHealth";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Tally1,
  BatteryLow,
  Trash,
  CloudSun,
  Sun,
  Moon,
} from "lucide-react";
import MobileNav from "../components/MobileNav.jsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "../components/context/SettingsContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
const connected = "bg-emerald-500";
const disconnected = "bg-red-500";

const pageTitles = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/maintenance": "Maintenance",
  "/users": "Users",
};

const getGreeting = () => {
  const size = 20;
  const hour = new Date().getHours();
  if (hour < 12)
    return { text: "Good morning", icon: <CloudSun size={size} /> };
  if (hour < 18) return { text: "Good afternoon", icon: <Sun size={size} /> };
  return { text: "Good evening", icon: <Moon size={size} /> };
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

function NotificationDot({ numOfNotifications }) {
  const moreThanNine = numOfNotifications > 9;
  numOfNotifications = moreThanNine ? "9+" : numOfNotifications;

  if (!numOfNotifications || numOfNotifications <= 0) return null;

  return (
    
    <span
      className="
        absolute
        -right-1
        -top-1
        flex
        min-h-4
        min-w-4
        items-center
        justify-center
        rounded-full
        bg-red-700
        px-1
        text-[10px]
        font-bold
        leading-none
        text-white
      "
    >
      {numOfNotifications}
    </span>
  );
}

function Header({ bins }) {
  const { settings } = useSettings();
  const { displayName } = useAuth();
  const FILL_THRESHOLD = settings.fillCritical;
  const BATTERY_THRESHOLD = settings.batteryWarning;
  const navigate = useNavigate();
  const isHealthy = useCheckHealth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
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
  const notifiedAlerts = useRef(new Set());
  const notificationQueue = useRef([]);
  const notificationTimer = useRef(null);

  const { text, icon } = getGreeting();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (
      !settings.browserNotifications ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      notificationQueue.current = [];

      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
        notificationTimer.current = null;
      }

      notifiedAlerts.current.clear();
      return;
    }

    const activeAlertKeys = new Set();
    const newAlerts = [];

    (bins ?? []).forEach((bin) => {
      if (bin.fill_level >= FILL_THRESHOLD) {
        const alertKey = `fill-${bin.id}`;
        activeAlertKeys.add(alertKey);

        if (!notifiedAlerts.current.has(alertKey)) {
          newAlerts.push({
            key: alertKey,
            title: `Bin ${bin.id} needs attention`,
            body: `Fill level is ${bin.fill_level}%.`,
          });

          notifiedAlerts.current.add(alertKey);
        }
      }

      if (bin.battery_level != null && bin.battery_level < BATTERY_THRESHOLD) {
        const alertKey = `battery-${bin.id}`;
        activeAlertKeys.add(alertKey);

        if (!notifiedAlerts.current.has(alertKey)) {
          newAlerts.push({
            key: alertKey,
            title: `Bin ${bin.id} has low battery`,
            body: `Battery level is ${bin.battery_level}%.`,
          });

          notifiedAlerts.current.add(alertKey);
        }
      }
    });

    notifiedAlerts.current.forEach((alertKey) => {
      if (!activeAlertKeys.has(alertKey)) {
        notifiedAlerts.current.delete(alertKey);
      }
    });

    notificationQueue.current.push(...newAlerts);

    const sendNextNotification = () => {
      if (notificationQueue.current.length === 0) {
        notificationTimer.current = null;
        return;
      }

      const alert = notificationQueue.current.shift();

      try {
        new Notification(alert.title, {
          body: alert.body,
        });
      } catch (error) {
        console.error("Unable to show browser notification:", error);
      }

      notificationTimer.current = setTimeout(sendNextNotification, 500);
    };

    if (
      notificationQueue.current.length > 0 &&
      notificationTimer.current === null
    ) {
      sendNextNotification();
    }
  }, [bins, settings.browserNotifications, FILL_THRESHOLD, BATTERY_THRESHOLD]);

  const notificationCount = attentionBins.length + lowBatteryBins.length;

  const handleNotificationClick = (binId) => {
    navigate(`/?binId=${binId}`);
    setIsOpen(false);
  };
  return (
    <div
      className={`
    bg-[var(--bg-header)] 
    text-[var(--text-primary)]
    p-4 
    h-14 
    items-center 
    ${settings.enabledGreeting ? "justify-between md:justify-between" : "justify-between md:justify-end"}
    flex 
    flex-row 
    [border:var(--border-subtle)]
    backdrop-blur-[var(--backdrop-blur-strong)]
    z-[2000]
    `}
    >
      <div className="gap-2 items-center flex md:hidden">
        <MobileNav />
        <h1 className="font-medium md:hidden"> {pageTitles[currentPath]} </h1>
      </div>

      {settings.enabledGreeting && (
        <div className="gap-2 items-center hidden md:flex text-[var(--button-color)]">
          <div>{icon}</div>
          <h1 className="font-medium tracking-tight">
            {text}, {displayName?.split(" ")[0] ?? "User"}!
          </h1>
        </div>
      )}

      <div className="gap-2 items-center flex ">
        <div className="relative top-1 " ref={dropdownRef}>

          {/* Notification Bell + dropdown */}
          <button
            type="button"
            aria-label={`Notifications (${notificationCount})`}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="
              relative
              cursor-pointer
              rounded-full
              p-2
              text-[var(--button-color)]
              transition
              hover:bg-white/10
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-400
            "
          >
            <NotificationDot numOfNotifications={notificationCount} />
            <Bell size={20} />
          </button>

          {/* Notification dropdown */}

          {isOpen && (
            <div
  
              className="
                absolute
                right-0
                top-12
                z-[2000]
                flex
                w-80
                max-w-[calc(100vw-2rem)]
                max-h-72
                flex-col
                gap-1
                overflow-y-auto
                rounded-xl
                bg-[var(--bg-card-strong)]
                p-2
                text-sm
                text-[var(--text-secondary)]
                shadow-[var(--shadow-card-subtle)]
                [border:var(--border-card)]
              "
            >
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Notifications
            </p>

            {attentionBins.map((bin) => (
              <button
                type="button"
                key={bin.id}
                onClick={() => handleNotificationClick(bin.id)}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  transition
                  hover:bg-[var(--bg-hover)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-400
                "
              >
              <span className="rounded-full bg-red-500/15 p-2">
                <Trash
                  size={16}
                  className="text-[var(--status-critical)]"
                  aria-hidden="true"
                />
              </span>

              <span className="flex flex-col">
                <span className="font-medium text-[var(--text-primary)]">
                  Bin {bin.id} needs attention
                </span>
                <span className="text-xs">
                  Fill level: {bin.fill_level}%
                </span>
              </span>
            </button>
            ))}

            {lowBatteryBins.map((bin) => (
              <button
                type="button"
                key={`${bin.id}-battery`}
                onClick={() => handleNotificationClick(bin.id)}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  transition
                  hover:bg-[var(--bg-hover)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-400
                "
              >
                <span className="rounded-full bg-amber-500/15 p-2">
                  <BatteryLow
                    size={16}
                    className="text-[var(--status-warning)]"
                    aria-hidden="true"
                  />
                </span>

                <span className="flex flex-col">
                  <span className="font-medium text-[var(--text-primary)]">
                    Low battery: Bin {bin.id}
                  </span>
                  <span className="text-xs">
                    Battery level: {bin.battery_level}%
                  </span>
                </span>
              </button>
              ))}

              {!notificationCount && (
                <p className="px-3 py-4 text-center text-sm text-[var(--text-secondary)]">
                  No active notifications
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tally icon + system status */}
        <Tally1 className="text-[var(--button-color)]" />
        <StatusDot serverHealthy={isHealthy} />
        <h1 className="font-medium hidden md:block text-[var(--button-color)]">
          {isHealthy ? "System online" : "System offline"}
        </h1>
      </div>
    </div>
  );
}

export default Header;
