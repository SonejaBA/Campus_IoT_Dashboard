import { useState, useEffect, useRef } from "react";

function BinSearchSelect({ bins, selectedBin, onSelectBin }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedBin === "" && bins.length > 0) {
      onSelectBin(bins[0].id);
      setSearchQuery("");
    }
  }, [bins, selectedBin]);

  const filteredBins = bins
    .filter((bin) =>
      bin.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase().replace(/\bb(?:in?)?\b\s*/g, "")),
    )
    .sort((a, b) => a.id - b.id);

  const handleSubmit = (e) => {

    
    e.preventDefault();
    if (filteredBins.length > 0) {
      onSelectBin(filteredBins[0].id);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-40 h-10 bg-[#1E1E1E] rounded-xl border-2 border-[#adadad] ml-auto">
      <form onSubmit={handleSubmit}>
        <input
          onFocus={() => setIsOpen(true)}
          onBlur={() =>
            setTimeout(() => {
              setIsOpen(false);
            }, 150)
          }
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          type="text"
          placeholder="Search bin..."
          className="w-[90%] focus:outline-none absolute left-2 top-1/6"
        />
      </form>
      {/*Drop down selection of bins*/}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-2 rounded-lg border-2 border-[#adadad] bg-[#1E1E1E] max-h-30 md:max-h-60 overflow-y-auto shadow-xl flex flex-col z-[100]">
          {filteredBins.length > 0 ? (
            filteredBins.map((bin) => (
              <button
                key={bin.id}
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                  onSelectBin(bin.id);
                }}
                className="hover:bg-[#333232] rounded-sm m-1 cursor-pointer"
              >
                Bin {bin.id}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">No bins found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default BinSearchSelect;
