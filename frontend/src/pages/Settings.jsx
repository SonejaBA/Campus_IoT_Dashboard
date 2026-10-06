import { useState, useEffect } from "react";
import { useAuth } from "../components/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function Settings() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // Load saved values from localStorage, or fall back to defaults (50 and 80, matching your existing color thresholds)
  const [warningThreshold, setWarningThreshold] = useState(() => {
    return Number(localStorage.getItem("warningThreshold")) || 50;
  });
  const [criticalThreshold, setCriticalThreshold] = useState(() => {
    return Number(localStorage.getItem("criticalThreshold")) || 80;
  });

  // Whenever either value changes, save it to localStorage automatically
  useEffect(() => {
    localStorage.setItem("warningThreshold", warningThreshold);
  }, [warningThreshold]);

  useEffect(() => {
    localStorage.setItem("criticalThreshold", criticalThreshold);
  }, [criticalThreshold]);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="flex-1 bg-[#262626] text-white p-10 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="bg-[#1E1E1E] border-2 border-[#adadad] rounded-xl p-6 max-w-md flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Notification thresholds</h2>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-300">Warning threshold</label>
            <span className="text-sm text-amber-400 font-medium">{warningThreshold}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="99"
            value={warningThreshold}
            onChange={(e) => setWarningThreshold(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-300">Critical threshold</label>
            <span className="text-sm text-red-400 font-medium">{criticalThreshold}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={criticalThreshold}
            onChange={(e) => setCriticalThreshold(Number(e.target.value))}
            className="w-full accent-red-400"
          />
        </div>
      </div>

      <button
        onClick={handleLogOut}
        className="flex items-center gap-2 bg-[#1E1E1E]/90 text-white px-4 py-2 rounded-lg cursor-pointer shadow-md justify-end border-2 border-[#adadad] w-fit"
      >
        <LogOut />
        Log Out
      </button>
    </div>
  );
}

export default Settings;