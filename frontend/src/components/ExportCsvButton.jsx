import { useState } from "react";
import { Download } from "lucide-react";
import { rowsToCsv, downloadCsv } from "../utils/exportCsv";

function ExportCsvButton({ binId = null, label = "Export CSV" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/export/telemetry`;
      const url = binId ? `${baseUrl}?bin_id=${binId}` : baseUrl;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Export failed. Is the backend running?");

      const rows = await response.json();
      downloadCsv(rowsToCsv(rows), "campus_bin_telemetry.csv");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleExport}
        disabled={loading}
        className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm cursor-pointer bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        {loading ? "Exporting..." : label}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export default ExportCsvButton;