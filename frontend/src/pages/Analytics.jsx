import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';



function Analytics(){
    return (
        //flex 1 since its going to be under a flex parent
        <div className="flex-1 bg-slate-800 text-white p-10 h-full">
            <h1 className="text-4xl font-bold text-emerald-400 mb-6">
                Analytics Dashboard
            </h1>
            <p className="text-xl">
                Assigned to: <br/>
                Build possible useful data based on bins.
                Could be: Battery health, average full percentage, etc.
            </p>
        </div>
    )    
}

export default Analytics;