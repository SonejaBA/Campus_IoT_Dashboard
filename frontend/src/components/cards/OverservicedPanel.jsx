import { useState } from "react";
import { Search } from "lucide-react";

const DEFAULTS = { days: 7, minDrop: 20, maxFillBefore: 50, minEvents: 4 };

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
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28 rounded-lg px-3 py-2 bg-[var(--bg-card-strong)] [border:var(--border-card)] text-[var(--text-primary)] focus:outline-none"
      />
    </label>
  );
}

function OverservicedPanel() {
  const [params, setParams] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setParam = (name) => (value) =>
    setParams((prev) => ({ ...prev, [name]: value }));

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        days: params.days,
        min_drop: params.minDrop,
        max_fill_before: params.maxFillBefore,
        min_events: params.minEvents,
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/overserviced?${query}`
      );
      if (!response.ok) {
        throw new Error("Check failed. Is the backend running, and are the values in range?");
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
          Flags a bin if it was emptied (fill dropped by at least {params.minDrop}%)
          while under {params.maxFillBefore}% full, at least {params.minEvents} times
          in the last {params.days} days.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <NumberField label="Days" value={params.days} onChange={setParam("days")} min={1} max={30} />
        <NumberField label="Min drop (%)" value={params.minDrop} onChange={setParam("minDrop")} min={1} max={100} />
        <NumberField label="Under (%)" value={params.maxFillBefore} onChange={setParam("maxFillBefore")} min={1} max={100} />
        <NumberField label="Pickups" value={params.minEvents} onChange={setParam("minEvents")} min={1} max={50} />

        <button
          onClick={handleRun}
          disabled={loading}
          className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm cursor-pointer bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={16} />
          {loading ? "Checking..." : "Find overserviced bins"}
        </button>
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