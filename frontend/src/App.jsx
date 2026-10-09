import DashboardMap from "./pages/DashboardMap.jsx";
import { useBins } from "./hooks/useBins.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthProvider from "./components/context/AuthContext.jsx";
import SettingsProvider from "./components/context/SettingsContext.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import Home from "./pages/Home.jsx"; // Import the Home component

function App() {
  const bins = useBins();
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} /> // Set the Home component as the default route
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout bins={bins} />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardMap bins={bins} />} /> // Set the DashboardMap component as the default route for authenticated users
              <Route path="/analytics" element={<Analytics bins={bins} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/maintenance" element={<Maintenance />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
