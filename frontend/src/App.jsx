import DashboardMap from "./pages/DashboardMap.jsx";
import { useBins } from "./hooks/useBins.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthProvider from "./components/context/AuthContext.jsx";
import AppLayout from "./pages/AppLayout.jsx";

function App() {
  const bins = useBins();
  return (
    <AuthProvider>
      <BrowserRouter>
              <Routes>
                <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
                  <Route path="/" element={<DashboardMap bins={bins} />} />
                  <Route path="/analytics" element={<Analytics bins={bins} />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
