function Sidebar(){
    return (
        //flex and flex-col required for vertical gaps
        <div className="
        flex
        flex-col 
        w-80 
        h-full 
        bg-slate-800 
        text-white 
        p-6
        gap-4">
            <h1 className="font-bold text-4xl">
                Sustainability Bin Tracker
            </h1>

            <p className="text-emerald-400 text-xl">
                Coming soon.
            </p>
        </div>
    )
}

export default Sidebar