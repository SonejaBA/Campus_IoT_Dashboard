import AreaChartComponent from "../charts/AreaChart";

function HistoricalBinCard({binID, timeRange}){
    if (!binID) return null;
    return(
        <div className="p-4 rounded-xl flex flex-1 flex-col bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)]">
            <span className="font-medium text-xl flex-1 mb-2">    
                BIN-{String(binID).padStart(3, '0')}
            </span>
            <AreaChartComponent binID={binID} timeRange={timeRange} />
        </div>
    )
}

export default HistoricalBinCard;
