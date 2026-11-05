import { useSettings } from "./context/SettingsContext";
import { Trash } from "lucide-react";

function EnableGreeting() {
  const { settings, updateSetting } = useSettings();

  return (
    <label className="my-4 flex items-center justify-between gap-4 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)] p-4">
      <div className="flex flex-row items-center gap-3">
        <Trash size={21} className="shrink-0" />
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Enable Mark Empty</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Enable manual setting of bin fill level to zero on dashboard.
          </p>
        </div>
      </div>

      <input
        type="checkbox"
        checked={settings.enabledMarkEmpty}
        onChange={(event) =>
          updateSetting("enabledMarkEmpty", event.target.checked)
        }
        className="h-5 w-5 cursor-pointer accent-emerald-400"
      />
    </label>
  );
}

export default EnableGreeting;
