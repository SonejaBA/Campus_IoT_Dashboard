function BatteryHealth({ bins = [] }) {
  // Battery level that triggers a replacement warning.
  const REPLACE_THRESHOLD = 25;

  // Collects valid battery readings from all bins.
  const batteries = bins
    .map((bin) => Number(bin.battery_level))
    .filter((battery) => Number.isFinite(battery));

  // Counts batteries that need to be replaced.
  const replaceCount = batteries.filter(
    (battery) => battery < REPLACE_THRESHOLD
  ).length;

  const okCount = batteries.length - replaceCount;
  const allOkay = replaceCount === 0;

  return (
    <section className="h-full min-h-0 bg-[#0b1513] border border-white/10 px-4 py-3 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-100">
            Battery Health
          </h3>

          <p className="text-[9px] text-slate-600 mt-0.5">
            Sensor power status
          </p>
        </div>

        <span
          className={`text-[10px] font-semibold ${
            allOkay ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {allOkay ? "ALL OK" : "ATTENTION"}
        </span>
      </div>

      {/* BATTERY STATUS */}
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${
              allOkay
                ? "bg-emerald-400"
                : "bg-red-500"
            }`}
          />

          <span
            className={`text-2xl font-semibold ${
              allOkay
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {allOkay ? "Battery OK" : "Replace Battery"}
          </span>
        </div>

        <p className="text-[10px] text-slate-500 mt-2">
          {allOkay
            ? "All sensor batteries operating normally"
            : `${replaceCount} sensor battery ${
                replaceCount === 1 ? "needs" : "need"
              } replacement`}
        </p>
      </div>

      {/* SENSOR STATS */}
      <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-white/10">
        <div>
          <p className="text-sm font-semibold text-emerald-400">
            {okCount}
          </p>

          <p className="text-[9px] uppercase tracking-wider text-slate-600">
            Battery OK
          </p>
        </div>

        <div>
          <p
            className={`text-sm font-semibold ${
              replaceCount > 0
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {replaceCount}
          </p>

          <p className="text-[9px] uppercase tracking-wider text-slate-600">
            Replace
          </p>
        </div>
      </div>
    </section>
  );
}

export default BatteryHealth;