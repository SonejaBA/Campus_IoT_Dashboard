import { useState } from "react";
import HistoricalBinCard from "../components/cards/HistoricalBinCard";
import CurrentBinCard from "../components/cards/CurrentBinCard";
import BinSearchSelect from "../components/BinSearchSelect";

function Analytics({ bins }) {
  const [selectedBin, setSelectedBin] = useState("");

  const activeBin = bins.find((bin) => bin.id === selectedBin);

  return (
    //flex 1 since its going to be under a flex parent
    <div className="flex-1 bg-[#262626] text-white p-10 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-[#F2F2F3] mb-3 hidden md:block">
        Analytics
      </h1>
      {/*Universal Search Bar*/}
      <BinSearchSelect
        bins={bins}
        selectedBin={selectedBin}
        onSelectBin={setSelectedBin}
      />

      <div className=" grid grid-cols-2 grid-rows-2 gap-8 items-center">
        {/*Historical Bin Data*/}
        <div className="col-start-1 row-start-1 shadow-md">
          <h2 className="font-semibold text-lg mb-2 ml-1 ">
            Historical Bin Data
          </h2>
          <HistoricalBinCard binID={selectedBin} />
        </div>
        {/*Current Bin Data*/}
        <div className="col-start-2 row-start-1 shadow-md">
          <h2 className="font-semibold text-lg mb-2 ml-1 ">Current Bin Data</h2>
          <div className="h-50 md:h-100 flex">
            <CurrentBinCard bin={activeBin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
