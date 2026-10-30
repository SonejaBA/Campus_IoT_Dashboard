import { useBinAnalytics } from "../hooks/useBinAnalytics";

// each can has its own sensor readings and fill rate.
// each can has its own identification color.
// CSS classes identify each waste stream.
const cans = [
  { key: "compost", label: "Compost", className: "can-compost" },
  { key: "recycle", label: "Recycling", className: "can-recycle" },
  { key: "landfill", label: "Landfill", className: "can-landfill" },
];

// calculate the time until ONE can reaches 100%.
function predictCan(history, canType) {
  // keep readings with a valid timestamp and fill percentage.
  const validReadings = history
    .filter(
      (log) =>
        log.time &&
        Number.isFinite(new Date(log.time).getTime()) &&
        log[canType] !== null &&
        log[canType] !== undefined &&
        Number.isFinite(Number(log[canType])),
    )
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  // Temporarily separate readings after a possible collection.
  // This affects predictions only, NOT the bin's status.
  let startIndex = 0;

  for (let i = 1; i < validReadings.length; i++) {
    const previous = Number(validReadings[i - 1][canType]);
    const current = Number(validReadings[i][canType]);

    if (previous - current > 20) {
      startIndex = i;
    }
  }

  const readings = validReadings.slice(startIndex).slice(-20);
  // we need at least two readings to calculate slope.
  if (readings.length < 2) {
    return null;
  }

  // use all available readings (up to 20) to calculate
  // the best-fit straight line using linear regression.

  const first = readings[0];
  const last = readings[readings.length - 1];

  // the latest sensor reading is our current fill percentage.
  const currentFill = Number(last[canType]);

  // convert each timestamp into hours since the first reading.
  // x = elapsed hours, y = fill percentage.
  const points = readings.map((reading) => ({
    x: (new Date(reading.time) - new Date(first.time)) / 3600000,
    y: Number(reading[canType]),
  }));

  const n = points.length;

  // calculate the sums needed for linear regression.
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumX2 = points.reduce((sum, point) => sum + point.x * point.x, 0);

  // denominator of the least-squares slope formula.
  const denominator = n * sumX2 - sumX * sumX;

  // avoid division by zero when timestamps are identical.
  if (Math.abs(denominator) < 1e-10) {
    return null;
  }

  // best-fit slope: average increase in fill percentage per hour.
  const slope = (n * sumXY - sumX * sumY) / denominator;

  // A full can requires immediate collection.
  if (currentFill >= 100) {
    return { currentFill, slope, hoursRemaining: 0 };
  }

  // no positive trend means no reliable fill prediction.
  if (slope <= 0) {
    return { currentFill, slope, hoursRemaining: null };
  }

  // estimate hours until full from the last sensor reading.
  // slope is calculated using up to 20 telemetry readings.
  const hoursRemaining = (100 - currentFill) / slope;

  return { currentFill, slope, hoursRemaining };
} // end of predictCan()
function FillLevelPredictor({ binId }) {
  // retrieve telemetry history for this bin station.
  const history = useBinAnalytics(binId, "7d");

  // calculate predictions independently for all three cans.
  const predictions = cans.map((can) => ({
    ...can,
    result: predictCan(history, can.key),
  }));

  // find which can is predicted to fill first.
  const firstToFill = predictions
    .filter((can) => can.result && can.result.hoursRemaining !== null)
    .sort((a, b) => a.result.hoursRemaining - b.result.hoursRemaining)[0];

  return (
    <div className="text-xs w-35 -mt-1.5">
      {/*dDisplay all three cans using their CSS colors */}
      <div className="flex flex-col gap-1">
        {predictions.map((can) => (
          <div
            key={can.key}
            className={`${can.className} py-2.5 first:pt-0 last:pb-0 flex  justify-between`}
          >
            {/* Can name and colored indicator */}
            <span className="can-indicator" />


            {/* Fill rate and estimated time until full */}
            <div className="flex flex-col items-end text-xs">
              <span className="font-semibold text-[var(--text-primary)]">
                {can.result?.hoursRemaining == null
                  ? "No prediction"
                  : `${can.result.hoursRemaining.toFixed(1)} hrs until full`}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {can.result
                  ? `${can.result.slope.toFixed(2)}%/hr`
                  : "Not enough data"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FillLevelPredictor;
