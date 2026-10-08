function KPICard({ title, count, sum_card = false, bin_count = 1 }) {
  return (
    <div className="p-4 bg-[#1E1E1E] rounded-xl md:h-50 border-[#adadad] border-2 flex flex-col gap-5">
      <span className="font-medium text-normal md:text-xl flex-1 mb-2">{title}</span>
      <p className="text-xl md:text-6xl font-bold flex-1">{count}</p>
      {sum_card && (
        <p className="text-sm font-thin flex-1">
          {((count / bin_count) * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
}

export default KPICard;
