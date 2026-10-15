// This file contains utility functions for exporting data to CSV format.

// Define the columns for the CSV export
const COLUMNS = [
  { header: "timestamp", key: "time" },
  { header: "bin_id", key: "bin_id" },
  { header: "location", key: "location" },
  { header: "compost", key: "compost" },
  { header: "recycle", key: "recycle" },
  { header: "landfill", key: "landfill" },
  { header: "fill_level", key: "fill_level" },
  { header: "battery_level", key: "battery_level" },
];

// Wraps a value in quotes if it contains a comma, quote, or newline
function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

// Converts an array of row objects into a CSV string
export function rowsToCsv(rows) {
  const headerLine = COLUMNS.map((c) => c.header).join(",");
  const lines = rows.map((row) =>
    COLUMNS.map((c) => escapeCell(row[c.key])).join(",")
  );
  return [headerLine, ...lines].join("\n");
}

export function downloadCsv(csvText, filename) {
  // The \uFEFF at the start helps Excel read special characters correctly
  const blob = new Blob(["\uFEFF" + csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}