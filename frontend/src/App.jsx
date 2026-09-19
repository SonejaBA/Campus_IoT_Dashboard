import Sidebar from './components/Sidebar';
import DashboardMap from './pages/DashboardMap.jsx';
import { useBins } from './hooks/useBins.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics.jsx';


function App() {
  const bins = useBins();
  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-row font-sans">
        <Sidebar/>

        <Routes>
          <Route path="/" element={<DashboardMap bins={bins} />}/>
          <Route path="/analytics" element={<Analytics/>} />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;