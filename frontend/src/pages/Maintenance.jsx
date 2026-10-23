import { useMemo, useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

function getBinStatus(fillLevel) {
  const fill = Number(fillLevel ?? 0);

  if (fill >= 80) {
    return {
      label: "Critical",
      className: "text-[var(--status-critical)]",
    };
  }

  if (fill >= 50) {
    return {
      label: "Warning",
      className: "text-[var(--status-warning)]",
    };
  }

  return {
    label: "Normal",
    className: "text-[var(--status-normal)]",
  };
}

function Maintenance({ bins = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [newBin, setNewBin] = useState({
  id: "",
  location: "",
  lat: "",
  long: "",
  zone: "",
});
  const handleNewBinChange = (event) => {
  const { name, value } = event.target;

  setNewBin((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleAddBin = async () => {
  if (
    !newBin.id ||
    !newBin.location.trim() ||
    !newBin.lat ||
    !newBin.long
  ) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(newBin.id),
          lat: Number(newBin.lat),
          long: Number(newBin.long),
          location: newBin.location.trim(),
          zone: newBin.zone || null,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to add bin.");
    }

    setNewBin({
      id: "",
      location: "",
      lat: "",
      long: "",
      zone: "",
    });

    setShowAddModal(false);
    alert("Bin added successfully.");
  } catch (error) {
    console.error("Error adding bin:", error);
    alert(error.message || "Failed to add bin.");
  }
};


const handleEditBin = (bin) => {
  setEditingBin({
    id: bin.id,
    location: bin.location ?? "",
    lat: bin.lat ?? "",
    long: bin.long ?? "",
    zone: bin.zone ?? "",
  });

  setShowEditModal(true);
};

const handleEditBinChange = (event) => {
  const { name, value } = event.target;

  setEditingBin((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSaveEdit = async () => {
  if (
    !editingBin ||
    !editingBin.location.trim() ||
    !editingBin.lat ||
    !editingBin.long
  ) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bins/${editingBin.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: Number(editingBin.lat),
          long: Number(editingBin.long),
          location: editingBin.location.trim(),
          zone: editingBin.zone || null,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update bin.");
    }

    setShowEditModal(false);
    setEditingBin(null);
  } catch (error) {
    console.error("Error updating bin:", error);
    alert(error.message || "Failed to update bin.");
  }
};


const handleRemoveBin = async (binId) => {
  const confirmed = window.confirm(
    `Are you sure you want to remove Bin ${binId}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bins/${binId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to remove bin.");
    }

    alert(`Bin ${binId} was removed successfully.`);
    window.location.reload();
  } catch (error) {
    console.error("Error removing bin:", error);
    alert(error.message || "Failed to remove bin.");
  }
};




  const criticalCount = bins.filter(
    (bin) => Number(bin.fill_level ?? 0) >= 80
  ).length;

  const warningCount = bins.filter(
    (bin) =>
      Number(bin.fill_level ?? 0) >= 50 &&
      Number(bin.fill_level ?? 0) < 80
  ).length;

  const assignedCount = bins.filter(
    (bin) => bin.zone === "Zone A" || bin.zone === "Zone B"
  ).length;

  const filteredBins = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return bins.filter((bin) => {
      const matchesSearch =
        search === "" ||
        String(bin.id).toLowerCase().includes(search) ||
        String(bin.location ?? "").toLowerCase().includes(search);

      const matchesZone =
        zoneFilter === "all" || (bin.zone ?? "Unassigned") === zoneFilter;

      return matchesSearch && matchesZone;
    });
  }, [bins, searchTerm, zoneFilter]);

  return (
    <main className="min-h-full flex-1 overflow-auto px-5 py-8 text-[var(--text-primary)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Operations Control Center
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Maintenance
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              Manage campus bins, locations, zones, and maintenance activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--control-border)] backdrop-blur-[var(--backdrop-blur)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
          >
            <Plus size={17} />
            Add bin
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)]">
            <div className="flex items-center gap-3">
              <Wrench size={20} />
              <span className="text-sm text-[var(--text-secondary)]">
                Total bins
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{bins.length}</p>
          </div>

          <div className="rounded-xl bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)]">
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={20}
                className="text-[var(--status-critical)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Critical
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{criticalCount}</p>
          </div>

          <div className="rounded-xl bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)]">
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={20}
                className="text-[var(--status-warning)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Warning
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{warningCount}</p>
          </div>

          <div className="rounded-xl bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)]">
            <div className="flex items-center gap-3">
              <MapPin size={20} />
              <span className="text-sm text-[var(--text-secondary)]">
                Assigned to zone
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{assignedCount}</p>
          </div>
        </section>

        {/* Bin directory */}
        <section className="mt-4 rounded-xl bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur-strong)] [border:var(--border-subtle)] p-5 shadow-[var(--shadow-card-subtle)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Bin directory</h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                View and manage campus hardware.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search bins..."
                  className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] py-2.5 pl-9 pr-3 text-sm text-[var(--control-text)] outline-none transition focus:border-[color:var(--border-hover)] sm:w-56"
                />
              </div>

              {/* Zone filter */}
              <select
                value={zoneFilter}
                onChange={(event) => setZoneFilter(event.target.value)}
                className="rounded-lg border border-[color:var(--control-border)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--dropdown-text))] outline-none"
              >
                <option value="all">All zones</option>
                <option value="A">Zone A</option>
                <option value="B">Zone B</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--border-subtle)] text-[var(--text-secondary)]">
                  <th className="px-4 py-3 font-medium">Bin</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Zone</th>
                  <th className="px-4 py-3 font-medium">Fill level</th>
                  <th className="px-4 py-3 font-medium">Battery</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBins.map((bin) => {
                  const status = getBinStatus(bin.fill_level);

                  return (
                    <tr
                      key={bin.id}
                      className="border-b border-[color:var(--border-subtle)] transition hover:bg-[var(--bg-hover)]"
                    >
                      <td className="px-4 py-4 font-semibold">
                        BIN-{String(bin.id).padStart(3, "0")}
                      </td>

                      <td className="px-4 py-4 text-[var(--text-secondary)]">
                        {bin.location || "Unassigned"}
                      </td>

                      <td className="px-4 py-4">
                        {bin.zone || "Unassigned"}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {bin.fill_level ?? 0}%
                      </td>

                      <td className="px-4 py-4">
                        {bin.battery_level ?? 0}%
                      </td>

                      <td className={`px-4 py-4 font-semibold ${status.className}`}>
                        {status.label}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Edit bin"
                            onClick={() => handleEditBin(bin)}
                            className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] p-2 text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title="Remove bin"
                            onClick={() => handleRemoveBin(bin.id)}
                            className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] p-2 text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredBins.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
                    >
                      No bins match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>
              Showing {filteredBins.length} of {bins.length} bins
            </span>

            <span>Maintenance directory</span>
          </div>
        </section>

        {showAddModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card-strong)] [border:var(--border-card)] p-6 shadow-[var(--shadow-card)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Add bin</h2>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Add a new bin to the campus directory.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Bin ID
                  </label>

                  <input
                  type="number"
                  name="id"
                  value={newBin.id}
                  onChange={handleNewBinChange}
                  placeholder="Example: 204"
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Location / Description
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={newBin.location}
                    onChange={handleNewBinChange}
                    placeholder="Example: Library entrance"
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Latitude
                    </label>

                    <input
                      type="number"
                      name="lat"
                      value={newBin.lat}
                      onChange={handleNewBinChange}
                      step="any"
                      placeholder="38.55..."
                      className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Longitude
                    </label>

                    <input
                      type="number"
                      name="long"
                      value={newBin.long}
                      onChange={handleNewBinChange}
                      step="any"
                      placeholder="-121.42..."
                      className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Zone
                  </label>

                  <select
                    name="zone"
                    value={newBin.zone}
                     onChange={handleNewBinChange}
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  > 
                    <option value="">Unassigned</option>
                    <option value="A">Zone A</option>
                    <option value="B">Zone B</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddBin}
                  className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
                >
                  Add bin
                </button>
              </div>
            </div>
          </div>
        )}
                {showEditModal && editingBin && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card-strong)] [border:var(--border-card)] p-6 shadow-[var(--shadow-card)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Edit Bin {editingBin.id}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Update the bin location, coordinates, or zone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBin(null);
                  }}
                  className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Location / Description
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={editingBin.location}
                    onChange={handleEditBinChange}
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Latitude
                    </label>

                    <input
                      type="number"
                      name="lat"
                      value={editingBin.lat}
                      onChange={handleEditBinChange}
                      step="any"
                      className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Longitude
                    </label>

                    <input
                      type="number"
                      name="long"
                      value={editingBin.long}
                      onChange={handleEditBinChange}
                      step="any"
                      className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Zone
                  </label>

                  <select
                    name="zone"
                    value={editingBin.zone}
                    onChange={handleEditBinChange}
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  >
                    <option value="">Unassigned</option>
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBin(null);
                  }}
                  className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Maintenance;
