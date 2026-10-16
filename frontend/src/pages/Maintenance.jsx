import React, { useState, useEffect } from "react";

// Supabase client import (not too sure if this is right uncomment if it complies with this)
//import { supabase } from "../components/context/AuthContext";

// Components imports
import HistoricalBinCard from "../components/cards/HistoricalBinCard";
import CurrentBinCard from "../components/cards/CurrentBinCard";
import BinSearchSelect from "../components/BinSearchSelect";
import KPICard from "../components/cards/KPICard";

export default function Maintenance() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch bins directly from Supabase
  const fetchBins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bins")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching bins:", error.message);
    } else {
      setBins(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBins();
  }, []);

  // 2. Deactivate a bin (updates status in Supabase and local state)
  const handleDeactivate = async (binId) => {
    const { error } = await supabase
      .from("bins")
      .update({ status: "Inactive" })
      .eq("id", binId);

    if (error) {
      console.error("Error deactivating bin:", error.message);
      alert("Failed to deactivate bin.");
    } else {
      setBins((prevBins) =>
        prevBins.map((bin) =>
          bin.id === binId ? { ...bin, status: "Inactive" } : bin
        )
      );
    }
  };

  // 3. Export active bins data to a downloadable CSV spreadsheet
  const handleGetSpreadsheet = () => {
    const activeBins = bins.filter((bin) => bin.status !== "Inactive");

    if (activeBins.length === 0) {
      alert("No active bins available to export.");
      return;
    }

    // CSV Headers
    const headers = ["Bin ID", "Location", "Battery (%)", "Fill Frequency (Times Full)", "Status"];
    
    // Map rows
    const rows = activeBins.map((bin) => [
      bin.id,
      `"${bin.location_name || bin.location || "Unassigned"}"`,
      bin.battery ?? 100,
      bin.fill_count ?? bin.times_full ?? 0,
      bin.status || "Active",
    ]);

    // Build CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Create download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Active_Bins_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bin Maintenance & Diagnostics
          </h1>
          <p className="text-sm text-slate-500">
            Manage bin statuses, track fill frequencies, and export telemetry data.
          </p>
        </div>

        {/* Get Spreadsheet Button */}
        <button
          onClick={handleGetSpreadsheet}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Get Spreadsheet
        </button>
      </div>

      {/* Hardware Status Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Active Bins & Fill History
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Total Bins: {bins.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4">Bin ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Times Full</th>
                <th className="py-3 px-4">Battery Level</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Loading bins from Supabase...
                  </td>
                </tr>
              ) : bins.length > 0 ? (
                bins.map((bin) => (
                  <tr
                    key={bin.id}
                    className={`hover:bg-slate-50/80 transition ${
                      bin.status === "Inactive" ? "opacity-50 bg-slate-50" : ""
                    }`}
                  >
                    {/* Deactivate Button on Left */}
                    <td className="py-3 px-4 text-center">
                      {bin.status !== "Inactive" ? (
                        <button
                          onClick={() => handleDeactivate(bin.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Deactivated
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      #{bin.id}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {bin.location_name || bin.location || "Unassigned"}
                    </td>

                    {/* Fill Frequency Column */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                        {bin.fill_count ?? bin.times_full ?? 0} times
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              (bin.battery ?? 100) < 20
                                ? "bg-rose-500"
                                : (bin.battery ?? 100) < 50
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${bin.battery ?? 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">
                          {bin.battery ?? 100}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bin.status === "Inactive"
                            ? "bg-slate-200 text-slate-600"
                            : bin.status === "Needs Service"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {bin.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No bins found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}