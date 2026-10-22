const TIME_RANGES = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

function TimeRangeSelect({ timeRange, onChange }) {
  return (
    <div
      role="group"
      aria-label="Time range"
      className="flex h-10 items-center gap-1 rounded-xl p-1 bg-[var(--bg-card)] [border:var(--border-card)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)]"
    >
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => onChange(range.value)}
          aria-pressed={timeRange === range.value}
          className={`h-full cursor-pointer rounded-lg px-3 text-sm transition ${
            timeRange === range.value
              ? "bg-[var(--bg-active)] text-[var(--text-primary)] font-medium"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

export default TimeRangeSelect;