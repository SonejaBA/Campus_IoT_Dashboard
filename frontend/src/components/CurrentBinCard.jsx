import CurrentCapacityChart from "./CurrentCapacityChart";

function CurrentBinCard({bin}){
    if (!bin) return null;
    return(
        <div className="p-4 bg-[#1E1E1E] rounded-xl  border-[#adadad] border-2 flex flex-1 flex-col">
            <span className="font-medium text-xl flex-1 mb-2">    
                Bin {bin["id"]}
            </span>
            <CurrentCapacityChart bin={bin}/>
        </div>
    )
}

export default CurrentBinCard;
