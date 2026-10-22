import React, { useState, useEffect, useMemo } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  Pencil, 
  Plus, 
  Search, 
  Trash2, 
  Wrench, 
  X 
} from "lucide-react";

// Supabase client import (uncomment if configured in your project)
// import { supabase } from "../components/context/AuthContext";

function getBinStatus(fillLevel) {
  const fill = Number(fillLevel ?? 0);

  if (fill >= 80) {
    return {
      label: "Critical",
      className: "text-[var(--status-critical)] bg-rose-50 text-rose-700",
    };
  }

  if (fill >= 50) {
    return {
      label: "Warning",
      className: "text-[var(--status-warning)] bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Normal",
    className: "text-[var(--status-normal)] bg-emerald-50 text-emerald-700",
  };
}

export default function Maintenance() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // 1. Fetch bins directly from Supabase (or mock fallback if supabase is commented out)
  const fetchBins = async () => {
    setLoading(true);
    try {
      // If using supabase:
      /*
      const { data, error } = await supabase
        .from("bins")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setBins(data || []);
      */

      // API fallback if using backend endpoints
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/bins`);
      if (response.ok) {
        const data = await response.json();
        setBins(data || []);
      }
    } catch (error) {
      console.error("Error fetching bins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  // 2. Deactivate / Mark as Emptied handler
  const handleDeactivate = async (binId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/bins/${binId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Inactive" }),
      });

      if (!response.ok) throw new Error("Failed to update bin status.");

      setBins((prevBins) =>
        prevBins.map((bin) =>
          bin.id === binId ? { ...bin, status: "Inactive" } : bin
        )
      );
    } catch (error) {
      console.error("Error deactivating bin:", error);
      alert("Failed to deactivate bin.");
    }
  };

  // 3. Export active bins data to a downloadable CSV spreadsheet
  const handleGetSpreadsheet = () => {
    const activeBins = bins.filter((bin) => bin.status !== "Inactive");

    if (activeBins.length === 0) {
      alert("No active bins available to export.");
      return;
    }

    const headers = ["Bin ID", "Location", "Zone", "Fill Level (%)", "Battery (%)", "Status"];
    
    const rows = activeBins.map((bin) => [
      bin.id,
      `"${bin.location_name || bin.location || "Unassigned"}"`,
      bin.zone || "Unassigned",
      bin.fill_level ?? 0,
      bin.battery_level ?? bin.battery ?? 100,
      bin.status || "Active",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Active_Bins_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewBinChange = (event) => {
    const { name, value } = event.target;
    setNewBin((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBin = async () => {
    if (!newBin.id || !newBin.location.trim() || !newBin.lat || !newBin.long) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/bins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(newBin.id),
          lat: Number(newBin.lat),
          long: Number(newBin.long),
          location: newBin.location.trim(),
          zone: newBin.zone || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to add bin.");
      }

      setNewBin({ id: "", location: "", lat: "", long: "", zone: "" });
      setShowAddModal(false);
      fetchBins();
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
    setEditingBin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingBin || !editingBin.location.trim() || !editingBin.lat || !editingBin.long) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/bins/${editingBin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: Number(editingBin.lat),
          long: Number(editingBin.long),
          location: editingBin.location.trim(),
          zone: editingBin.zone || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update bin.");
      }

      setShowEditModal(false);
      setEditingBin(null);
      fetchBins();
    } catch (error) {
      console.error("Error updating bin:", error);
      alert(error.message || "Failed to update bin.");
    }
  };

  const handleRemoveBin = async (binId) => {
    const confirmed = window.confirm(`Are you sure you want to remove Bin ${binId}?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/bins/${binId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to remove bin.");
      }

      alert(`Bin ${binId} was removed successfully.`);
      fetchBins();
    } catch (error) {
      console.error("Error removing bin:", error);
      alert(error.message || "Failed to remove bin.");
    }
  };

  const criticalCount = bins.filter((bin) => Number(bin.fill_level ?? 0) >= 80).length;
  const warningCount = bins.filter((bin) => Number(bin.fill_level ?? 0) >= 50 && Number(bin.fill_level ?? 0) < 80).length;
  const assignedCount = bins.filter((bin) => bin.zone === "A" || bin.zone === "B" || bin.zone === "Zone A" || bin.zone === "Zone B").length;

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
    <main className="min-h-full flex-1 overflow-auto px-5 py-8 text-[var(--text-primary)] sm:px-8 lg:px-10 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Operations Control Center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Maintenance & Diagnostics
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Manage campus bins, locations, zones, and maintenance activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGetSpreadsheet}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Get Spreadsheet
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 shadow-sm"
            >
              <Plus size={17} />
              Add bin
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Wrench size={20} className="text-slate-600" />
              <span className="text-sm text-slate-500">Total bins</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{bins.length}</p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-rose-600" />
              <span className="text-sm text-slate-500">Critical</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{criticalCount}</p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-amber-600" />
              <span className="text-sm text-slate-500">Warning</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{warningCount}</p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-600" />
              <span className="text-sm text-slate-500">Assigned to zone</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{assignedCount}</p>
          </div>
        </section>

        {/* Bin directory */}
        <section className="mt-6 rounded-xl bg-white border border-slate-200 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Bin directory</h2>
              <p className="mt-1 text-sm text-slate-500">View and manage campus hardware.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search bins..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 sm:w-56"
                />
              </div>

              {/* Zone filter */}
              <select
                value={zoneFilter}
                onChange={(event) => setZoneFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
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
                <tr className="border-b border-slate-200 text-slate-500 font-medium">
                  <th className="px-4 py-3">Bin</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Fill level</th>
                  <th className="px-4 py-3">Battery</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-400">
                      Loading bins...
                    </td>
                  </tr>
                ) : filteredBins.length > 0 ? (
                  filteredBins.map((bin) => {
                    const status = getBinStatus(bin.fill_level);

                    return (
                      <tr key={bin.id} className="transition hover:bg-slate-50">
                        <td className="px-4 py-4 font-semibold font-mono text-slate-900">
                          BIN-{String(bin.id).padStart(3, "0")}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {bin.location_name || bin.location || "Unassigned"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {bin.zone || "Unassigned"}
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-900">
                          {bin.fill_level ?? 0}%
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {bin.battery_level ?? bin.battery ?? 100}%
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.className}`}>
                            {bin.status || status.label}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            {bin.status !== "Inactive" && (
                              <button
                                type="button"
                                title="Deactivate / Mark as Emptied"
                                onClick={() => handleDeactivate(bin.id)}
                                className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
                              >
                                Deactivate
                              </button>
                            )}

                            <button
                              type="button"
                              title="Edit bin"
                              onClick={() => handleEditBin(bin)}
                              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              title="Remove bin"
                              onClick={() => handleRemoveBin(bin.id)}
                              className="rounded-lg border border-slate-300 bg-white p-2 text-rose-600 transition hover:bg-rose-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-400">
                      No bins match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredBins.length} of {bins.length} bins</span>
            <span>Maintenance directory</span>
          </div>
        </section>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Add bin</h2>
                  <p className="mt-1 text-sm text-slate-500">Add a new bin to the campus directory.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Bin ID</label>
                  <input
                    type="number"
                    name="id"
                    value={newBin.id}
                    onChange={handleNewBinChange}
                    placeholder="Example: 204"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Location / Description</label>
                  <input
                    type="text"
                    name="location"
                    value={newBin.location}
                    onChange={handleNewBinChange}
                    placeholder="Example: Library entrance"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Latitude</label>
                    <input
                      type="number"
                      name="lat"
                      value={newBin.lat}
                      onChange={handleNewBinChange}
                      step="any"
                      placeholder="38.55..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Longitude</label>
                    <input
                      type="number"
                      name="long"
                      value={newBin.long}
                      onChange={handleNewBinChange}
                      step="any"
                      placeholder="-121.42..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Zone</label>
                  <select
                    name="zone"
                    value={newBin.zone}
                    onChange={handleNewBinChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
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
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBin}
                  className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-sm font-medium transition"
                >
                  Add bin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingBin && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Edit Bin {editingBin.id}</h2>
                  <p className="mt-1 text-sm text-slate-500">Update the bin location, coordinates, or zone.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBin(null);
                  }}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Location / Description</label>
                  <input
                    type="text"
                    name="location"
                    value={editingBin.location}
                    onChange={handleEditBinChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Latitude</label>
                    <input
                      type="number"
                      name="lat"
                      value={editingBin.lat}
                      onChange={handleEditBinChange}
                      step="any"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Longitude</label>
                    <input
                      type="number"
                      name="long"
                      value={editingBin.long}
                      onChange={handleEditBinChange}
                      step="any"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Zone</label>
                  <select
                    name="zone"
                    value={editingBin.zone}
                    onChange={handleEditBinChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
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
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBin(null);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-sm font-medium transition"
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