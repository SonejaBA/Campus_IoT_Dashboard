import { useState } from "react";
import HistoricalBinCard from "../components/cards/HistoricalBinCard";
import CurrentBinCard from "../components/cards/CurrentBinCard";
import BinSearchSelect from "../components/BinSearchSelect";
import KPICard from "../components/cards/KPICard";

function Analytics({ bins }) {
  const [selectedBin, setSelectedBin] = useState("");
  const binsCount = bins.length;
  const activeBin = bins.find((bin) => bin.id === selectedBin);
  
  const averageFill = binsCount > 0 
  ? bins.reduce((acc, curr) => acc + curr.fill_level, 0) / binsCount 
  : 0;

  let critical = 0;
  let warning = 0;
  let ok = 0;

  for (let i = 0; i < binsCount; i++) {
    if (bins[i].fill_level >= 80) {
      critical++;
    } else if (bins[i].fill_level < 80 && bins[i].fill_level >= 50) {
      warning++;
    } else {
      ok++;
    }
  }

  return (
    //flex 1 since its going to be under a flex parent
    <div className="flex-1 bg-[#262626] text-white p-10 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-[#F2F2F3] mb-3 hidden md:block">
        Analytics
      </h1>
      <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-8 items-center mb-3">
        <KPICard title={"Average Fill"} 
        count={averageFill.toFixed(2)}/>
        <KPICard
          title={"Critical"}
          count={critical}
          sum_card={true}
          bin_count={binsCount}
        />
        <KPICard
          title={"Warning"}
          count={warning}
          sum_card={true}
          bin_count={binsCount}
        />
        <KPICard
          title={"OK"}
          count={ok}
          sum_card={true}
          bin_count={binsCount}
        />
      </div>

      <div>
        {/*Universal Search Bar*/}
        <BinSearchSelect
          bins={bins}
          selectedBin={selectedBin}
          onSelectBin={setSelectedBin}
        />

        <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-8 items-center">
          {/*Historical Bin Data*/}
          <div className="col-start-1 row-start-1 shadow-md">
            <h2 className="font-semibold text-lg mb-2 ml-1 ">
              Historical Bin Data
            </h2>
            <HistoricalBinCard binID={selectedBin} />
          </div>
          {/*Current Bin Data*/}
          <div className="col-start-2 row-start-1 shadow-md">
            <h2 className="font-semibold text-lg mb-2 ml-1 ">
              Current Bin Data
            </h2>
            <div className="h-50 md:h-100 flex">
              <CurrentBinCard bin={activeBin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
