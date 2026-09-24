import { useBinAnalytics } from "../hooks/useBinAnalytics";
import { useBins } from "../hooks/useBins";
import BinCard from "../components/BinCard";

function Analytics() {
  return (
    //flex 1 since its going to be under a flex parent
    <div className="flex-1 bg-[#262626] text-white p-10 h-full">
      <h1 className="text-4xl font-bold text-[#F2F2F3] mb-6 hidden md:block">
        Analytics
      </h1>

      <div
        className="
                grid
                grid-cols-1
                gap-4"
      >
        <div
          className="
                    bg-[#1E1E1E]
                    rounded-xl
                    "
        >
          <BinCard binID="200" />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
