import { useAuth } from "../components/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";



function Settings(){
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
        await logOut(); 
        navigate("/login");
        } catch (error) {
        console.error("Logout failed:", error.message);
        }
    };

    return (
        //flex 1 since its going to be under a flex parent
        <div className="flex-1 bg-slate-800 text-white p-10 h-full">
            <button
                onClick={handleLogOut} 
                className="flex items-center gap-2 bg-[#1E1E1E]/90 text-white px-4 py-2 rounded-lg cursor-pointer shadow-md justify-end border-2 border-[#adadad]"> 
                <LogOut/>
                Log Out
            </button>
        </div>
    )    
}

export default Settings;