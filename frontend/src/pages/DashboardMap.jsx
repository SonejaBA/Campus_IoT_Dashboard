import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, ChevronDown } from "lucide-react";

const fullColor = "bg-red-500";
const mediumColor = "bg-amber-500";
const lowColor = "bg-emerald-500";

const defaultCenter = [38.559677, -121.423202];
const mapBounds = [
  [38.54839610772975, -121.43695538673354], //south west
  [38.57178820331364, -121.40755894841233], //north east
];

const createBinIcon = (fillLevel) => {
  const colorClass =
    fillLevel >= 80 ? fullColor : fillLevel >= 50 ? mediumColor : lowColor;

  return L.divIcon({
    className: "bg-transparent",
    html: `<div
                class= "h-4 w-4 ${colorClass} rounded-full border-2 border-slate-700 shadow-md transition-transform  hover:scale-250"
                >
               </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const filterOptions = [
  { value: "all", label: "All bins" },
  { value: "green", label: "Green (0–49%)" },
  { value: "yellow", label: "Yellow (50–79%)" },
  { value: "red", label: "Red (80–100%)" },
];

function FilterButton({ activeFilter, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLabel = filterOptions.find((o) => o.value === activeFilter).label;

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1E1E1E] text-white px-4 py-2 rounded-lg cursor-pointer shadow-md"
      >
        <Filter size={16} />
        {activeLabel}
        <ChevronDown
          size={14}
          className={
            isOpen ? "rotate-180 transition-transform" : "transition-transform"
          }
        />
      </button>

      {isOpen && (
        <div className="mt-2 bg-[#1E1E1E] text-white rounded-lg shadow-md overflow-hidden p-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="
                block 
                w-full 
                text-left 
                px-4 
                py-2
                rounded-lg
                hover:bg-gradient-to-l
                hover:from-emerald-900/80
                hover:to-emerald-900/20 cursor-pointer
              "
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardMap({ bins }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredBins = bins.filter((bin) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "green") return bin.fill_level <= 49;
    if (activeFilter === "yellow")
      return bin.fill_level >= 50 && bin.fill_level <= 79;
    if (activeFilter === "red") return bin.fill_level >= 80;
    return true;
  });

  return (
    <div className="flex-1 relative">
      <FilterButton activeFilter={activeFilter} onSelect={setActiveFilter} />
      <MapContainer
        center={defaultCenter}
        zoom={17}
        minZoom={16}
        maxBounds={mapBounds}
        maxBoundsViscosity={0.6}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className="map-tiles-dark"
        />

        {filteredBins.map((bin) => (
          <Marker
            key={bin.id}
            position={[bin.lat, bin.long]}
            icon={createBinIcon(bin.fill_level)}
          >
            <Popup>
              Bin ID: {bin.id} <br />
              Fill Level: {bin.fill_level}%
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export default DashboardMap;
