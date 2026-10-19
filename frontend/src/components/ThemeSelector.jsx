import { useSettings } from "./context/SettingsContext";

function ThemeSelector() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="flex items-center justify-between rounded-xl [border:var(--border-card)] bg-[var(--bg-card-strong)] p-4">
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">Visual Theme</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Choose your interface appearance.
        </p>
      </div>

      <select
        value={settings.theme}
        onChange={(e) => updateSetting("theme", e.target.value)}
        className="rounded-lg bg-[var(--bg-card-strong)] [border:var(--border-card)] px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none cursor-pointer"
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="sunny">Sunny</option>
        <option value="glass">Botanical</option>
        <option value="glass-blue-gradient">Blue Gradient</option>
        <option value="hills">Hills</option>
      </select>
    </div>
  );
}

export default ThemeSelector;
