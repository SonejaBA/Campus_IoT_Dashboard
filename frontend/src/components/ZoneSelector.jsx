import { useSettings } from "./context/SettingsContext";

function ThemeSelector() {
  const { settings, updateSetting } = useSettings();
    console.log(settings.selectedZone);
  return (
    <section className="mt-4 flex items-center justify-between rounded-xl [border:var(--border-card)] bg-[var(--bg-card-strong)] p-4">
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">
          Visible Zone
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Choose which zone will be visible to you on the dashboard.
        </p>
      </div>
      <select
        value={settings.selectedZone}
        onChange={(e) => updateSetting("selectedZone", e.target.value)}
        className="rounded-lg bg-[var(--bg-card-strong)] [border:var(--border-card)] px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none cursor-pointer"
      >
        <option value="all">All Bins</option>
        <option value="A">Zone A</option>
        <option value="B">Zone B</option>
      </select>
    </section>
  );
}

export default ThemeSelector;
