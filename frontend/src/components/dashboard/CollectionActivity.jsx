function CollectionActivity({ bins = [] }) {
  const validBins = bins.filter(
    (bin) => bin.fill_level !== null && bin.fill_level !== undefined
  );

  const averageFill =
    validBins.length > 0
      ? Math.round(
          validBins.reduce(
            (sum, bin) => sum + Number(bin.fill_level),
            0
          ) / validBins.length
        )
      : 0;

  return (
    <section className="h-full bg-[#0b1513] border border-white/10 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Average Fill Level
          </h3>

          <p className="text-[10px] text-slate-600 mt-0.5">
            Campus-wide current average
          </p>
        </div>

        <span className="text-[10px] text-emerald-400 uppercase tracking-wider">
          Live
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-semibold text-slate-100">
            {averageFill}%
          </p>

          <p className="text-[10px] text-slate-500 mb-1">
            average fill
          </p>
        </div>

        <div className="mt-3 h-2 bg-white/5">
          <div
            className="h-full bg-emerald-400"
            style={{
              width: `${Math.min(averageFill, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-white/10">
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {validBins.length}
          </p>

          <p className="text-[10px] text-slate-600 mt-1">
            Monitored bins
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">
            {averageFill}%
          </p>

          <p className="text-[10px] text-slate-600 mt-1">
            Campus average
          </p>
        </div>
      </div>
    </section>
  );
}

export default CollectionActivity;