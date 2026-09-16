import Sidebar from './components/Sidebar';
import DashboardMap from './components/DashboardMap.jsx';
import { useBins } from './hooks/useBins.js';


function App() {
  const bins = useBins();
  return (
    // We force the map's container to take up the full screen
    <div className="flex h-screen w-screen">
      <Sidebar/>
      <DashboardMap bins={bins}/>
    </div> 
  );
}

export default App;