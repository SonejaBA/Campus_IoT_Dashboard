import AreaChartComponent from "../charts/AreaChart";

function HistoricalBinCard({binID}){
    if (!binID) return null;
    return(
        <div className="p-4 bg-[#1E1E1E] rounded-xl h-50 md:h-100 border-[#adadad] border-2 flex flex-col">
            <span className="font-medium text-xl flex-1 mb-2">    
                Bin {binID}
            </span>
            <AreaChartComponent binID={binID}/>
        </div>
    )
}

export default HistoricalBinCard;
