import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip
} from "recharts";
import { useBinAnalytics } from "../../hooks/useBinAnalytics";

function capitalizeFirstLetter(str) {
  if (!str) return ""; // Check for empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDateTime(utcString) {
  if (!utcString) return "N/A";
  return new Date(utcString).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateNoTime(utcString) {
  if (!utcString) return "N/A";
  return new Date(utcString).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur-strong)]">
        <p className="font-medium text-lg mb-2">{formatDateTime(label)}</p>
        
        {payload.map((item, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: item.color }}>
            <span>{capitalizeFirstLetter(item.dataKey)}: {item.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  
  return null;
}

function AreaChartComponent({binID}) {

  const binData = useBinAnalytics(binID);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={binData} margin={{right: 50}}>
        <YAxis
          stroke="var(--text-primary)"
          tick={{ fill: "var(--text-primary)", fontSize: 12 }}
        />
        <XAxis
          dataKey="time"
          stroke="var(--text-primary)"
          tick={{ fill: "var(--text-primary)", fontSize: 12 }}
          tickFormatter={(rawTime) => formatDateNoTime(rawTime)}
          minTickGap={40}
          interval="preserveEnd"
        />
        <Legend itemSorter={null}/>
        <Tooltip content={<CustomTooltip/>}/>
        <CartesianGrid strokeDasharray="7 7" opacity={0.5}/>
        <Area
            type="monotone"
            stroke="#7ae26c"
            fill="#55BA47"
            fillOpacity={0.2}
            dataKey="compost"/>
        <Area
            type="monotone"
            stroke="#5a9fab"
            fill="#116573"
            fillOpacity={0.2}
            dataKey="recycle"/>
        <Area 
            type="monotone"
            stroke="#a58a6f"
            fill="#5E4E3F"
            fillOpacity={0.2}
            dataKey="landfill"/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaChartComponent;
