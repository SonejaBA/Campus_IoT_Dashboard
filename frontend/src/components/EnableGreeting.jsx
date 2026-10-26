import { useSettings } from "./context/SettingsContext";

function EnableGreeting(){
    const {settings, updateSetting} = useSettings();

    return (
        <label className="my-4 flex items-center justify-between gap-4 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)] p-4">
              <div>
                <p className="font-semibold text-sm">Enable Greeting</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Enable greeting on header. Not visible on smaller devices.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.enabledGreeting}
                onChange={(event) =>
                  updateSetting("enabledGreeting", event.target.checked)
                }
                className="h-5 w-5 cursor-pointer accent-emerald-400"
              />
            </label>
    );
}

export default EnableGreeting;