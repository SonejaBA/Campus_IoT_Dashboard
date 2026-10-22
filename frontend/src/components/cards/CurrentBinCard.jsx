import CurrentCapacityChart from "../charts/CurrentCapacityChart";

function CurrentBinCard({ bin }) {
  if (!bin) return null;
  return (
    <div className=" p-4 rounded-xl flex flex-1 flex-col bg-[var(--bg-card)] [border:var(--border-card)]  shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)]">
      <span className="font-medium text-xl flex-1 mb-2">
        BIN-{String(bin["id"]).padStart(3, "0")}
      </span>
      <CurrentCapacityChart bin={bin} />
    </div>
  );
}

export default CurrentBinCard;
