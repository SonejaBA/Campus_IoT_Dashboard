function BatteryHealth({ bins = [] }) {
  const batteries = bins
    .map((bin) => Number(bin.battery_level))
    .filter((battery) => Number.isFinite(battery));

  const averageBattery =
    batteries.length > 0
      ? Math.round(
          batteries.reduce((sum, battery) => sum + battery, 0) /
            batteries.length
        )
      : 0;

  const lowestBattery =
    batteries.length > 0 ? Math.min(...batteries) : 0;

  const lowBatteryCount = batteries.filter(
    (battery) => battery < 25
  ).length;

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

        <span className="text-[10px] text-emerald-400 font-semibold">
          {averageBattery}% AVG
        </span>
      </div>

      {/* BATTERY SUMMARY */}
      <div className="mt-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-semibold text-slate-100">
              {averageBattery}%
            </span>

            <span className="text-[10px] text-slate-500 ml-2">
              average
            </span>
          </div>

          <span className="text-[10px] text-slate-400">
            Lowest {lowestBattery}%
          </span>
        </div>

        <div className="h-2 bg-white/5 mt-2 overflow-hidden">
          <div
            className="h-full bg-emerald-400"
            style={{ width: `${averageBattery}%` }}
          />
        </div>
      </div>

      {/* SENSOR STATS */}
      <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-white/10">
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {batteries.length}
          </p>

          <p className="text-[9px] uppercase tracking-wider text-slate-600">
            Sensors
          </p>
        </div>

        <div>
          <p
            className={`text-sm font-semibold ${
              lowBatteryCount > 0
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {lowBatteryCount}
          </p>

          <p className="text-[9px] uppercase tracking-wider text-slate-600">
            Below 25%
          </p>
        </div>
      </div>
    </section>
  );
}

export default BatteryHealth;