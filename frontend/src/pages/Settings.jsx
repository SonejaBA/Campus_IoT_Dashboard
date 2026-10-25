import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BatteryMedium,
  Lock,
  LogOut,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Unlock,
  Bell,
} from "lucide-react";
import { useAuth } from "../components/context/AuthContext.jsx";
import { useSettings } from "../components/context/SettingsContext.jsx";
import { supabase } from "../services/supabaseClient.js";
import ThemeSelector from "../components/ThemeSelector.jsx";
import ZoneSelector from "../components/ZoneSelector.jsx";
import DisplayNameSelector from "../components/DisplayNameSelector.jsx"

// Reusable status summary for the fill-level thresholds.
function StatusSummaryRow({ label, value, color }) {
  return (
    <div className="flex min-h-24 items-center justify-between gap-3 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)] px-5 py-4 shadow-[var(--shadow-card-subtle)]">
      <div className="flex items-center gap-4">
        <Trash2
          size={28}
          className={`status-summary-icon ${color}`}
          aria-hidden="true"
        />
        <span className="font-medium text-[var(--text-primary)]">{label}</span>
      </div>

      <span className="text-right font-semibold text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}

function Settings() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { logOut, user } = useAuth();
  const navigate = useNavigate();
  const [thresholdsLocked, setThresholdsLocked] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function fetchDisplayName() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching display name:", error.message);
      } else if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    }

    fetchDisplayName();
  }, [user]);

  const handleSaveDisplayName = async (newName) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: newName })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating display name:", error.message);
      throw error;
    }

    setDisplayName(newName);
  };

  // Warning must stay at least one percentage point below critical.
  const handleWarningChange = (event) => {
    const value = Number(event.target.value);
    updateSetting("fillWarning", Math.min(value, settings.fillCritical - 1));
  };

  // Critical must stay at least one percentage point above warning.
  const handleCriticalChange = (event) => {
    const value = Number(event.target.value);
    updateSetting("fillCritical", Math.max(value, settings.fillWarning + 1));
  };

  const handleBrowserNotificationsChange = async (event) => {
    const enabled = event.target.checked;

    if (!enabled) {
      updateSetting("browserNotifications", false);
      return;
    }

    if (!("Notification" in window)) {
      alert("Browser notifications are not supported on this device.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      updateSetting("browserNotifications", true);
    } else {
      updateSetting("browserNotifications", false);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <main className="min-h-full flex-1 overflow-auto px-5 py-8 text-[var(--text-primary)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[var(--bg-card)] [border:var(--border-card)] p-5 shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)] sm:p-7">
        {/* Page heading and account action */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Operations Control Center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Settings
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogOut}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--btn-logout-border)] bg-[var(--btn-logout-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-logout-text)] transition hover:bg-[var(--btn-logout-hover)]"
          >
            <LogOut size={17} />
            Log out
          </button>
        </header>

        {/* Two-column control center */}
        <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
          <section className="min-w-0 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-3 text-xl font-semibold">
                  <SlidersHorizontal size={21} />
                  Fill-level thresholds
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Configure bin capacity alerts
                </p>
              </div>

              <button
                type="button"
                onClick={() => setThresholdsLocked(!thresholdsLocked)}
                aria-pressed={!thresholdsLocked}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  thresholdsLocked
                    ? "border-[color:var(--btn-unlock-border)] bg-[var(--btn-unlock-bg)] text-[var(--btn-unlock-text)] hover:bg-[var(--btn-unlock-hover)]"
                    : "border-[color:var(--btn-reset-border)] bg-[var(--btn-reset-bg)] text-[var(--btn-reset-text)] hover:bg-[var(--btn-reset-hover)]"
                }`}
              >
                {thresholdsLocked ? <Lock size={15} /> : <Unlock size={15} />}
                {thresholdsLocked ? "Unlock" : "Lock"}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-3 text-sm font-medium">
              <span className="text-[var(--status-warning)]">
                Warning {settings.fillWarning}%
              </span>
              <span className="text-[var(--status-critical)]">
                Critical {settings.fillCritical}%
              </span>
            </div>

            {/* Dynamic widths only; slider colors and styling are in CSS */}
            <div className="relative mx-3 mt-8 h-12">
              <div className="threshold-track">
                <div
                  className="threshold-track-normal"
                  style={{ width: `${settings.fillWarning}%` }}
                />
                <div
                  className="threshold-track-warning"
                  style={{
                    width: `${settings.fillCritical - settings.fillWarning}%`,
                  }}
                />
                <div className="threshold-track-critical" />
              </div>

              <input
                id="fillWarning"
                type="range"
                min="0"
                max="100"
                value={settings.fillWarning}
                onChange={handleWarningChange}
                disabled={thresholdsLocked}
                aria-label="Fill warning threshold"
                className="threshold-slider warning-slider"
              />

              <input
                id="fillCritical"
                type="range"
                min="0"
                max="100"
                value={settings.fillCritical}
                onChange={handleCriticalChange}
                disabled={thresholdsLocked}
                aria-label="Fill critical threshold"
                className="threshold-slider critical-slider"
              />
            </div>

            <div className="mt-4 flex justify-between text-xs font-medium">
              <span className="text-[var(--status-normal)]">Normal</span>
              <span className="text-[var(--status-warning)]">Warning</span>
              <span className="text-[var(--status-critical)]">Critical</span>
            </div>
          </section>

          {/* Compact status summaries on the right */}
          <section
            aria-label="Fill-level status summary"
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
          >
            <StatusSummaryRow
              color="status-marker-normal"
              label="Normal"
              value={`Below ${settings.fillWarning}%`}
            />
            <StatusSummaryRow
              color="status-marker-warning"
              label="Warning"
              value={`${settings.fillWarning}% to ${settings.fillCritical}%`}
            />
            <StatusSummaryRow
              color="status-marker-critical"
              label="Critical"
              value={`${settings.fillCritical}% to 100%`}
            />
          </section>
        </div>

        {/* Battery warning */}
        <section className="mt-4 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)] px-5 py-4 shadow-[var(--shadow-card-subtle)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BatteryMedium size={19} className="battery-accent shrink-0" />
              <div>
                <h2 className="font-semibold">Battery warning</h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Alert when sensor battery needs attention.
                </p>
              </div>
            </div>

            <span className="battery-accent font-semibold">
              {settings.batteryWarning}%
            </span>
          </div>

          <input
            id="batteryWarning"
            type="range"
            min="0"
            max="100"
            value={settings.batteryWarning}
            onChange={(event) =>
              updateSetting("batteryWarning", Number(event.target.value))
            }
            aria-label="Battery warning threshold"
            className="mt-4 w-full cursor-pointer"
          />
        </section>

        {/*Zone viewing selection*/}
        <ZoneSelector/>
        
        <ThemeSelector/>
        <section className="mt-4 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)]">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={21} className="shrink-0" />
            <div>
              <h2 className="text-lg font-semibold">
                Notification preferences
              </h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Choose how you want to receive bin alerts on this device.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-xl bg-[var(--bg-card)] [border:var(--border-subtle)] p-4">
              <div>
                <p className="font-semibold text-sm">Email Notifications</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Enable email notification preferences.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(event) =>
                  updateSetting("emailNotifications", event.target.checked)
                }
                className="h-5 w-5 cursor-pointer accent-emerald-400"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl bg-[var(--bg-card)] [border:var(--border-subtle)] p-4">
              <div>
                <p className="font-semibold text-sm">Browser Notifications</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Receive desktop alerts when browser notifications are enabled.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.browserNotifications}
                onChange={handleBrowserNotificationsChange}
                className="h-5 w-5 cursor-pointer accent-emerald-400"
              />
            </label>
          </div>
        </section>
        
        <DisplayNameSelector 
          displayName={displayName} 
          onSetDisplayName={handleSaveDisplayName}
        />

        <footer className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-secondary)]">
            Preferences are saved locally on this device.
          </p>

          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--btn-reset-border)] bg-[var(--btn-reset-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-reset-text)] transition hover:bg-[var(--btn-reset-hover)]"
          >
            <RotateCcw size={16} />
            Reset all defaults
          </button>
        </footer>
      </div>
    </main>
  );
}

export default Settings;
