import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';



function Analytics(){
    return (
        //flex 1 since its going to be under a flex parent
        <div className="flex-1 bg-[#262626] text-white p-10 h-full">
            <h1 className="text-4xl font-bold text-[#F2F2F3] mb-6">
                Analytics Dashboard
            </h1>

            <div className="
                grid
                grid-cols-3
                gap-4">
                <div className="
                    bg-[#1E1E1E]
                    rounded-xl
                    ">
                    <h2 className="
                        text-[#F2F2F3]
                        text-2xl
                        font-bold
                        p-4">
                        Empty Bins
                    </h2>
                </div>
            </div>
        </div>
    )    
}

export default Analytics;