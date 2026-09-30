import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, ChevronDown } from "lucide-react";
import FillDistribution from "../components/dashboard/FillDistribution";
import BatteryHealth from "../components/dashboard/BatteryHealth";
import CollectionActivity from "../components/dashboard/CollectionActivity";
const defaultCenter = [38.559677, -121.423202];

const mapBounds = [
  [38.54839610772975, -121.43695538673354],
  [38.57178820331364, -121.40755894841233],
];
// Sets the bin status based on fill level.
function getStatus(fillLevel) {
  if (fillLevel >= 80) return "critical";
  if (fillLevel >= 50) return "warning";
  return "normal";
}
// Creates color-coded map markers and highlights the selected bin
function createBinIcon(fillLevel, selected = false) {
  const status = getStatus(fillLevel);

  const color =
    status === "critical"
      ? "#ef4444"
      : status === "warning"
      ? "#f59e0b"
      : "#4ade80";

  return L.divIcon({
    className: "bin-marker-wrapper",
    html: `
      <div
        style="
          width:${selected ? "22px" : "16px"};
          height:${selected ? "22px" : "16px"};
          background:${color};
          border:3px solid ${selected ? "#ffffff" : "#101917"};
          box-shadow:0 0 0 2px ${color}55, 0 3px 10px #000000aa;
          border-radius:50%;
        "
      ></div>
    `,
    iconSize: selected ? [34, 34] : [28, 28],
    iconAnchor: selected ? [17, 17] : [14, 14],
  });
}
// Filter choices for showing bins by fill level
const filterOptions = [
  { value: "all", label: "All bins" },
  { value: "green", label: "Green (0–49%)" },
  { value: "yellow", label: "Yellow (50–79%)" },
  { value: "red", label: "Red (80–100%)" },
];
// Dropdown used to filter bins displayed on the map
function FilterButton({ activeFilter, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const activeLabel =
    filterOptions.find((option) => option.value === activeFilter)?.label ||
    "All bins";

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#091310]/95 border border-white/10 text-slate-200 px-4 py-2 shadow-xl"
      >
        <Filter size={16} />
        {activeLabel}
        <ChevronDown
          size={14}
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-full bg-[#091310]/95 border border-white/10 shadow-xl p-2 whitespace-nowrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-emerald-400"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// Moves the map to the selected bin 
function MapFlyToBin({ bin }) {
  const map = useMap();

  if (bin?.lat && bin?.long) {
    map.flyTo([bin.lat, bin.long], 18);
  }

  return null;
}

function DashboardMap({ bins = [] }) {
  const [selectedBinId, setSelectedBinId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  // Filters which bins are displayed on the map
  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "green") return bin.fill_level < 50;

      if (activeFilter === "yellow")
        return bin.fill_level >= 50 && bin.fill_level < 80;

      if (activeFilter === "red") return bin.fill_level >= 80;

      return true;
    });
  }, [bins, activeFilter]);
  // Calculates totals for normal, warning, and critical bins
  const stats = useMemo(() => {
  const critical = bins.filter((bin) => bin.fill_level >= 80).length;

  const warning = bins.filter(
    (bin) => bin.fill_level >= 50 && bin.fill_level < 80
  ).length;

  const healthy = bins.filter((bin) => bin.fill_level < 50).length;

  return {
    total: bins.length,
    critical,
    warning,
    healthy,
  };
}, [bins]);
// Finds critical bins and sorts the fullest bins first
const attentionBins = useMemo(() => {
  return [...bins]
    .filter((bin) => bin.fill_level >= 80)
    .sort((a, b) => b.fill_level - a.fill_level)
    .slice(0, 100);
}, [bins]);
// Tracks the bin selected from the map or attention list
const selectedBin =
  bins.find((bin) => bin.id === selectedBinId) ||
  attentionBins[0] ||
  null;
  return (
    <main className="flex-1 min-w-0 h-full bg-[#08110f] text-slate-100 overflow-hidden">
      <div className="h-full flex flex-col">

        {/* TOP HEADER */}
        <header className="h-[76px] shrink-0 border-b border-white/10 bg-[#0b1513] px-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-400 font-semibold">
              Sacramento State
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Campus Waste Operations
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              Live campus bin monitoring
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Monitored
              </p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Need Attention
              </p>
              <p className="text-xl font-semibold text-red-400">
                {stats.critical}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Warning
              </p>
              <p className="text-xl font-semibold text-amber-400">
                {stats.warning}
              </p>
            </div>

            <div className="border-l border-white/10 pl-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
              <span className="text-xs font-semibold tracking-wider text-emerald-300">
                LIVE
              </span>
            </div>
          </div>
        </header>

        {/* MAIN OPERATIONS AREA */}
        <section className="flex-1 min-h-0 grid grid-cols-[minmax(0,1fr)_330px]">

        {/* MAP + ANALYTICS */}
        <div className="min-w-0 min-h-0 border-r border-white/10 flex flex-col">

          {/* MAP */}
          <div className="relative flex-1 min-h-0">
            <FilterButton
              activeFilter={activeFilter}
              onSelect={setActiveFilter}
            />
            <MapContainer
              center={defaultCenter}
              zoom={17}
              minZoom={16}
              maxBounds={mapBounds}
              maxBoundsViscosity={0.6}
              zoomControl={true}
              attributionControl={false}
              className="h-full w-full map-tiles-vibrant"
            >
              {/* Moves the map to the selected bin. */}
              <MapFlyToBin bin={selectedBin} />
              
              {/* Uses satellite imagery for the campus map. */}
              <TileLayer
                attribution="Tiles © Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={20}
              />
              {/*<TileLayer
                  attribution="© Mapbox"
                  url="https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=YOUR_MAPBOX_ACCESS_TOKEN"
                />
                <TileLayer
                  attribution="© MapTiler © OpenStreetMap contributors"
                  url="https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.png?key=YOUR_MAPTILER_API_KEY"
                />*/}
              {/* Displays each filtered bin as a color-coded map marker. */}
              {filteredBins.map((bin) => (
                <Marker
                  key={bin.id}
                  position={[bin.lat, bin.long]}
                  icon={createBinIcon(
                    bin.fill_level,
                    selectedBin?.id === bin.id
                  )}
                  eventHandlers={{
                    click: () => setSelectedBinId(bin.id),
                  }}
                >
        <Popup className="bin-popup">
        <div className="w-[160px]">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
            <div>
              <p className="text-[8px] font-bold tracking-[0.18em] uppercase text-amber-400">
                🐝 Stinger Sensor
              </p>

              <h3 className="mt-0.5 text-base font-bold text-white">
                Bin {bin.id}
              </h3>
            </div>

            <span
              className={`px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                getStatus(bin.fill_level) === "critical"
                  ? "bg-red-500/15 text-red-400"
                  : getStatus(bin.fill_level) === "warning"
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-emerald-400/15 text-emerald-300"
              }`}
            >
              {getStatus(bin.fill_level)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-[8px] uppercase tracking-wider text-slate-500">
                Fill
              </p>

              <p
                className={`text-lg font-bold ${
                  bin.fill_level >= 80
                    ? "text-red-400"
                    : bin.fill_level >= 50
                    ? "text-amber-300"
                    : "text-emerald-400"
                }`}
              >
                {bin.fill_level}%
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-wider text-slate-500">
                Battery
              </p>

              <p className="text-lg font-bold text-cyan-300">
                {bin.battery_level}%
              </p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-[8px] uppercase tracking-wider text-slate-500">
              Last Reading
            </p>

            <p className="mt-0.5 text-[10px] text-slate-200">
              {bin.time
                ? new Date(bin.time).toLocaleString()
                : "No reading available"}
            </p>
          </div>
        </div>
      </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* MAP LEGEND */}
            <div className="absolute z-[500] top-4 left-4 bg-[#091310]/95 border border-white/10 shadow-xl px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-3">
                Fill Status
              </p>

              <div className="space-y-2 text-xs">

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Normal</span>
                  <span className="ml-auto text-slate-500">&lt; 50%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Warning</span>
                  <span className="ml-auto text-slate-500">50–79%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Critical</span>
                  <span className="ml-auto text-slate-500">80%+</span>
                </div>

              </div>
            </div>

            </div>

        {/* BOTTOM ANALYTICS */}
        <div className="h-[180px] shrink-0 bg-[#08110f] pb-3">
          <div className="h-full grid grid-cols-3 border-b border-white/40">
            <FillDistribution bins={bins} />
            <BatteryHealth bins={bins} />
            <CollectionActivity bins={bins} />
          </div>
        </div>
      </div>

      {/* RIGHT OPERATIONS PANEL */}
      <aside className="min-h-0 bg-[#0b1513] flex flex-col">

            <div className="h-12 shrink-0 border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-red-500" />
                <h2 className="text-sm font-semibold">Needs Attention</h2>
              </div>

              <span className="text-xs text-red-400">
                {stats.critical} bins
              </span>
            </div>

            <div className="shrink-0 max-h-[310px] overflow-y-auto">
              {attentionBins.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => setSelectedBinId(bin.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors ${
                    selectedBin?.id === bin.id
                      ? "bg-emerald-400/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_7px_#ef4444]" />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <span className="text-sm font-medium">
                          Bin {bin.id}
                        </span>

                        <span className="text-sm font-bold text-red-400">
                          {bin.fill_level}%
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500 truncate">
                        {bin.location || "Location unavailable"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* SELECTED BIN */}
            <div className="flex-1 min-h-0 border-t border-white/10 p-4 overflow-y-auto">
              {selectedBin ? (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                    Selected Bin
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Bin {selectedBin.id}
                      </h2>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {selectedBin.location || "Location unavailable"}
                      </p>
                    </div>

                    <span
                      className={`text-2xl font-bold ${
                        selectedBin.fill_level >= 80
                          ? "text-red-400"
                          : selectedBin.fill_level >= 50
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {selectedBin.fill_level}%
                    </span>
                  </div>

                  <div className="mt-5 border-t border-white/10">
                    <div className="grid grid-cols-2 border-b border-white/10">
                      <div className="py-4 pr-3 border-r border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Battery
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {selectedBin.battery_level}%
                        </p>
                      </div>

                      <div className="py-4 pl-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize">
                          {getStatus(selectedBin.fill_level)}
                        </p>
                      </div>
                    </div>

                    <div className="py-4">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Last Reading
                      </p>

                      <p className="mt-1 text-xs text-slate-300">
                        {new Date(selectedBin.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <p className="text-sm text-slate-400">
                      Select a bin
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Choose a marker or an alert to inspect it.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default DashboardMap;
