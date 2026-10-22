import { useState, useEffect } from "react";

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
    <div className="relative w-40 h-10 rounded-xl ml-auto bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)] z-[50]">
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
        <div className="absolute top-full right-0 left-0 mt-2 rounded-lg [border:var(--border-card)] bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur)] max-h-30 md:max-h-60 overflow-y-auto shadow-[var(--shadow-card)] flex flex-col z-[100]">
          {filteredBins.length > 0 ? (
            filteredBins.map((bin) => (
              <button
                key={bin.id}
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                  onSelectBin(bin.id);
                }}
                className="hover:bg-white/10 rounded-sm m-1 cursor-pointer text-left px-2 py-1"
              >
                BIN-{String(bin.id).padStart(3, '0')}
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
