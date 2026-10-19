function StatusDot({ color }) {
  return (
    <span
      className="
            relative
            flex
            h-3
            w-3"
    >
      <span
        className={`
                relative
                h-3
                w-3
                rounded-full
                opacity-80
                ${color}
                `}
      />
    </span>
  );
}

function KPICard({
  title,
  count,
  color,
  sum_card = false,
  bin_count = 1,
  percent_card = false,
}) {
  return (
    <div className="p-4 rounded-xl flex flex-col gap-5 min-h-40 bg-[var(--bg-card)] md:h-50 [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)]">
      <div className="flex items-center mb-2">
        <span className="font-medium text-normal md:text-xl flex-1 ">
          {title}
        </span>
        <StatusDot color={color} />
      </div>
      <p className="text-xl md:text-6xl font-bold flex-1 overflow-x-hidden">
        {count}
        {percent_card && "%"}
      </p>
      {sum_card && (
        <p className="text-sm font-thin">
          {((count / bin_count) * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
}

export default KPICard;
