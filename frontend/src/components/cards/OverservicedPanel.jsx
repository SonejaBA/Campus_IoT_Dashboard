import { useState } from "react";
import { Search } from "lucide-react";

const DEFAULTS = { days: 7, minDrop: 20, maxFillBefore: 50, minEvents: 4 };

// Allowed ranges, matching the limits in the backend endpoint
const LIMITS = {
  days: { min: 1, max: 30 },
  minDrop: { min: 1, max: 100 },
  maxFillBefore: { min: 1, max: 100 },
  minEvents: { min: 1, max: 50 },
};

// Turns what the user typed into a valid number.
// Empty or invalid input falls back to the default; out-of-range input is clamped.
function cleanValue(name, typed) {
  const number = Number(typed);
  if (typed === "" || Number.isNaN(number)) return DEFAULTS[name];

  const { min, max } = LIMITS[name];
  return Math.min(Math.max(Math.round(number), min), max);
}

// Shows "…" in the description sentence while a field is empty
const shown = (value) => (value === "" ? "…" : value);

function formatTime(timeString) {
  return new Date(timeString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function NumberField({ label, value, onChange, min, max }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}

        // Keep the raw input as a string so users can clear the field
        // without an empty value being converted to 0.
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-28 rounded-lg px-3 py-2 bg-[var(--bg-card-strong)] [border:var(--border-card)] text-[var(--text-primary)] focus:outline-none"
      />
      <span className="text-xs">
        {min} to {max}
      </span>
    </label>
  );
}

function OverservicedPanel() {
  // These hold exactly what the user typed (so a field can be empty)
  const [params, setParams] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setParam = (name) => (value) =>
    setParams((prev) => ({ ...prev, [name]: value }));

  const handleRun = async () => {
    // Validate and normalize values only when the user runs the analysis.
    const cleaned = {
      days: cleanValue("days", params.days),
      minDrop: cleanValue("minDrop", params.minDrop),
      maxFillBefore: cleanValue("maxFillBefore", params.maxFillBefore),
      minEvents: cleanValue("minEvents", params.minEvents),
    };
    setParams(cleaned);

    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        days: cleaned.days,
        min_drop: cleaned.minDrop,
        max_fill_before: cleaned.maxFillBefore,
        min_events: cleaned.minEvents,
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/overserviced?${query}`
      );
      if (!response.ok) {
        throw new Error("Check failed. Is the backend running?");
      }
      setResult(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl flex flex-col gap-4 bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)]">
      <div>
        <h2 className="font-medium text-xl">Overserviced bins</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Flags a bin if it was emptied (fill dropped by at least{" "}
          {shown(params.minDrop)}%) while under {shown(params.maxFillBefore)}%
          full, at least {shown(params.minEvents)} times in the last{" "}
          {shown(params.days)} days.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <NumberField label="Days" value={params.days} onChange={setParam("days")} min={LIMITS.days.min} max={LIMITS.days.max} />
        <NumberField label="Min drop (%)" value={params.minDrop} onChange={setParam("minDrop")} min={LIMITS.minDrop.min} max={LIMITS.minDrop.max} />
        <NumberField label="Under (%)" value={params.maxFillBefore} onChange={setParam("maxFillBefore")} min={LIMITS.maxFillBefore.min} max={LIMITS.maxFillBefore.max} />
        <NumberField label="Pickups" value={params.minEvents} onChange={setParam("minEvents")} min={LIMITS.minEvents.min} max={LIMITS.minEvents.max} />

        <div className="pb-5">
          <button
            onClick={handleRun}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm cursor-pointer bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={16} />
            {loading ? "Checking..." : "Find overserviced bins"}
          </button>
        </div>
      </div>

      {error && <span className="text-sm text-red-400">{error}</span>}

      {result && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            {result.bins.length === 0
              ? "No bins match this definition."
              : `${result.bins.length} bin(s) flagged.`}
          </p>

          {result.bins.map((bin) => (
            <div key={bin.bin_id} className="rounded-lg p-3 bg-[var(--bg-card-strong)] [border:var(--border-card)]">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">
                  BIN-{String(bin.bin_id).padStart(3, "0")}
                </span>
                <span className="text-sm font-medium">
                  {bin.event_count} early pickups
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {bin.location || "Location unavailable"}
              </p>
              <ul className="mt-2 text-xs text-[var(--text-secondary)] flex flex-col gap-0.5">
                {bin.events.map((event, index) => (
                  <li key={index}>
                    {formatTime(event.time)}: {event.before}% to {event.after}%
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OverservicedPanel;