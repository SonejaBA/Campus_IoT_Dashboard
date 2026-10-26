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

function App() {
  const bins = useBins();

  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Base wrapper requiring login */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout bins={bins} />
                </ProtectedRoute>
              }
            >
              {/* Accessible to all logged in users */}
              <Route path="/" element={<DashboardMap bins={bins} />} />

              {/* Restricted routes */}
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Analytics bins={bins} />
                  </ProtectedRoute>
                }
              />

              <Route path="/settings" element={<Settings />} />

              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Maintenance bins={bins} />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
