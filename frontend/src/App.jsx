import Sidebar from './components/Sidebar';
import DashboardMap from './pages/DashboardMap.jsx';
import { useBins } from './hooks/useBins.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Header from './components/Header.jsx';


function App() {
  const bins = useBins();
  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-row font-sans bg-[#262626]">
        <Sidebar/>

        <div className='flex-1 flex flex-col h-full w-full'>
          <Header/>
          <main className='flex-1 flex flex-col overflow-y-auto'>
          <Routes>
            <Route path="/" element={<DashboardMap bins={bins} />}/>
            <Route path="/analytics" element={<Analytics bins={bins}/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="/maintenance" element={<Maintenance/>} />
          </Routes>
          </main>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;