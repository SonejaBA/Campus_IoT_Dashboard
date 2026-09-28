import { useEffect, useMemo, useState } from "react";

function CollectionActivity({ bins = [] }) {
  const [telemetry, setTelemetry] = useState([]);

  useEffect(() => {
    const fetchFillActivity = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/analytics/fill-activity"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch fill activity");
        }

        const data = await response.json();
        setTelemetry(data);
      } catch (error) {
        console.error("Fill activity error:", error);
      }
    };

    fetchFillActivity();
  }, []);

  // Sort telemetry from oldest -> newest.
  const sortedTelemetry = useMemo(() => {
    return [...telemetry].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
  }, [telemetry]);

  // Split the readings into 12 chronological groups and calculate
  // the average fill level for each group.
  const fillTrend = useMemo(() => {
    if (sortedTelemetry.length === 0) return [];

    const bucketCount = 12;
    const bucketSize = Math.ceil(
      sortedTelemetry.length / bucketCount
    );

    const buckets = [];

    for (let i = 0; i < sortedTelemetry.length; i += bucketSize) {
      const group = sortedTelemetry.slice(i, i + bucketSize);

      const average =
        group.reduce(
          (sum, reading) => sum + Number(reading.fill_level || 0),
          0
        ) / group.length;

      buckets.push(Math.round(average));
    }

    return buckets.slice(0, bucketCount);
  }, [sortedTelemetry]);

  const latestTelemetry =
    sortedTelemetry.length > 0
      ? sortedTelemetry[sortedTelemetry.length - 1]
      : null;

  const latestReading = latestTelemetry
    ? new Date(latestTelemetry.time)
    : null;

  const formatTime = (date) => {
    if (!date) return "—";

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="h-full bg-[#0b1513] border border-white/10 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Fill Activity
          </h3>

          <p className="text-[10px] text-slate-600 mt-0.5">
            Campus-wide fill trend
          </p>
        </div>

        <span className="text-[10px] text-emerald-400 uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* REAL TELEMETRY */}
      <div className="mt-5 flex items-end gap-2 h-12">
        {fillTrend.map((fillLevel, index) => (
          <div
            key={index}
            title={`${fillLevel}% average fill`}
            className="flex-1 bg-emerald-400/70"
            style={{
              height: `${Math.max(fillLevel, 4)}%`,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 pt-1 border-t border-white/10">
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {formatTime(latestReading)}
          </p>

          <p className="text-[10px] text-slate-600 mt-1">
            Latest reading · {formatDate(latestReading)}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">
            {bins.length}
          </p>

          <p className="text-[10px] text-slate-600 mt-1">
            Monitored bins
          </p>
        </div>
      </div>
    </section>
  );
}

export default CollectionActivity;