import { useState, useEffect } from "react";
import HistoricalBinCard from "../components/HistoricalBinCard";
import CurrentBinCard from "../components/CurrentBinCard";

function Analytics({ bins }) {
  const [selectedBin, setSelectedBin] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedBin === "" && bins.length > 0) {
      setSelectedBin(bins[0].id);
      setSearchQuery("");
    }
  }, [bins, selectedBin]);

  const filteredBins = bins.filter((bin) =>
    bin.id
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase().replace(/[^\d]/g, "")),
  ).sort((a, b) => a.id - b.id);

  const activeBin = bins.find((bin) => bin.id === selectedBin);

  return (
    //flex 1 since its going to be under a flex parent
    <div className="flex-1 bg-[#262626] text-white p-10 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-[#F2F2F3] mb-3 hidden md:block">
        Analytics
      </h1>
      {/*Universal Search Bar*/}
      <div className="relative w-40 h-10 bg-[#1E1E1E] rounded-xl border-2 border-[#adadad] ml-auto">
        <input
          onFocus={() => setIsOpen(true)}
          onBlur={() =>
            setTimeout(() => {
              setIsOpen(false);
            }, 300)
          }
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          type="text"
          placeholder="Search bin..."
          className="w-[90%] focus:outline-none absolute left-2 top-1/6"
        ></input>

        {isOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 rounded-lg border-2 border-[#adadad] bg-[#1E1E1E] max-h-30 md:max-h-60 overflow-y-auto shadow-xl flex flex-col z-[100]">
            {filteredBins.length > 0 ? (
              filteredBins.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchQuery("");
                    setSelectedBin(bin.id);
                  }}
                  className="hover:bg-[#333232] rounded-sm m-1 cursor-pointer"
                >
                  Bin {bin.id}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-sm">
                No bins found
              </div>
            )}
          </div>
        )}
      </div>

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
          <h2 className="font-semibold text-lg mb-2 ml-1 ">
            Current Bin Data
          </h2>
          <div className="h-50 md:h-100 flex">
            <CurrentBinCard bin={activeBin} />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Analytics;
