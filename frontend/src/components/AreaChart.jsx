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
import { useBinAnalytics } from "../hooks/useBinAnalytics";

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

function CustomTooltip({active, payload, label}){
    if (active && payload && payload.length){
        return (
            <div className="p-4 bg-[#1E1E1E] rounded-xl">
                <p className="font-medium text-lg">{formatDateTime(label)}</p>
                <p className="text-sm text-[#55BA47]">
                    <span>{capitalizeFirstLetter(payload[0].dataKey)}: {payload[0].value}%</span>
                </p>
                <p className="text-sm text-[#5a9fab]">
                    <span>{capitalizeFirstLetter(payload[1].dataKey)}: {payload[1].value}%</span>
                </p>
                <p className="text-sm text-[#a58a6f]">
                    <span>{capitalizeFirstLetter(payload[2].dataKey)}: {payload[2].value}%</span>
                </p>
            </div>
        )
    }
    else{
        return null;
    }
}

function AreaChartComponent({binID = 203}) {

  const binData = useBinAnalytics(binID);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={binData} margin={{right: 50}}>
        <YAxis/>
        <XAxis 
      dataKey="time" 
      tickFormatter={(rawTime) => formatDateNoTime(rawTime)
      }
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
