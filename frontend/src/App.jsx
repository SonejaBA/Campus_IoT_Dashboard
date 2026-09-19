import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav.jsx';
import DashboardMap from './pages/DashboardMap.jsx';
import { useBins } from './hooks/useBins.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import Maintenance from './pages/Maintenance.jsx';


function App() {
  const bins = useBins();
  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-row font-sans">
        <Sidebar/>
        <MobileNav/>
        
        <Routes>
          <Route path="/" element={<DashboardMap bins={bins} />}/>
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/maintenance" element={<Maintenance/>} />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;