function FillDistribution({ bins = [] }) {
  const total = bins.length;

  const normal = bins.filter((bin) => bin.fill_level < 50).length;

  const warning = bins.filter(
    (bin) => bin.fill_level >= 50 && bin.fill_level < 80
  ).length;

  const critical = bins.filter((bin) => bin.fill_level >= 80).length;

  const groups = [
    {
      label: "< 50%",
      name: "Normal",
      value: normal,
      bar: "bg-emerald-400",
    },
    {
      label: "50–79%",
      name: "Warning",
      value: warning,
      bar: "bg-amber-400",
    },
    {
      label: "80%+",
      name: "Critical",
      value: critical,
      bar: "bg-red-500",
    },
  ];

  const maxValue = Math.max(...groups.map((group) => group.value), 1);

  return (
    <section className="h-full min-h-0 bg-[#0b1513] border border-white/10 px-4 py-3 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-100">
            Fill Level Distribution
          </h3>

          <p className="text-[9px] text-slate-600 mt-0.5">
            Current campus-wide status
          </p>
        </div>

        <span className="text-[9px] text-slate-500">
          {total} bins
        </span>
      </div>

      {/* CHART */}
      <div className="mt-2 h-[92px] flex items-end gap-4 border-b border-white/10">
        {groups.map((group) => {
          const height = Math.max(
            (group.value / maxValue) * 58,
            group.value > 0 ? 6 : 0
          );

          return (
            <div
              key={group.name}
              className="flex-1 h-full flex flex-col justify-end items-center"
            >
              <span className="text-[11px] font-semibold text-slate-200 mb-1">
                {group.value}
              </span>

              <div
                className={`w-8 ${group.bar}`}
                style={{ height: `${height}px` }}
              />
            </div>
          );
        })}
      </div>

      {/* LABELS */}
      <div className="grid grid-cols-3 gap-4 mt-1.5">
        {groups.map((group) => (
          <div key={group.name} className="text-center">
            <p className="text-[9px] text-slate-400">
              {group.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FillDistribution;