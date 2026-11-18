import { useState, useEffect } from "react";
import { authFetch } from "../services/supabaseClient.js";

function useBinAnalytics(bin_id, timeRange = "7d") {
  const [binHistory, setBinHistory] = useState([]);

  useEffect(() => {
    let ignore = false; // stops a slow old response from overwriting a newer one

    authFetch(
      `${import.meta.env.VITE_API_URL}/api/analytics/${bin_id}?time_range=${timeRange}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load analytics.");
        return response.json();
      })
      .then((data) => {
        if (!ignore) setBinHistory(data);
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setBinHistory([]);
      });

    return () => {
      ignore = true;
    };
  }, [bin_id, timeRange]);

  return binHistory;
}

export { useBinAnalytics };