import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const barData = payload[0].payload; 
    
    return (
      <div className="p-4 bg-[#1E1E1E] border border-[#adadad] rounded-xl shadow-lg">
        <p className="font-bold text-lg text-white mb-1">{label}</p>
        <p className="text-sm font-semibold" style={{ color: barData.color }}>
          Fill Level: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
}

function CurrentCapacityChart({ bin }) {
  if (!bin) return null;

  const data = [
    { name: "Compost", value: bin.compost, color: "#55BA47" },
    { name: "Recycle", value: bin.recycle, color: "#116573" },
    { name: "Landfill", value: bin.landfill, color: "#5E4E3F" },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 15, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="7 7" opacity={0.5} horizontal={false}/>
        
        <XAxis type="number" domain={[0, 100]} stroke="#adadad" />
        <YAxis dataKey="name" type="category" stroke="#F2F2F3" opacity={0.6} />
        <Tooltip content={<CustomTooltip />} cursor={false}/>
        
        <Bar dataKey="value" fill="#55BA47" radius={[0, 15, 15, 0]} opacity={0.4} stroke="#97e88c" fillOpacity={0.5}/>
        
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CurrentCapacityChart;