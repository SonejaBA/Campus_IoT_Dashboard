import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

import 'leaflet/dist/leaflet.css'; 

const getBinColor = (fill_level) =>{
    if (fill_level >= 80) return '#ff4f34';
    if (fill_level >= 50) return '#f59e0b'; 
    return '#10b981';
}
const supabaseClient = import.meta.env.VITE_SUPABASE_CLIENT;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseClient,supabaseKey);

function App() {
  const defaultCenter = [38.559677, -121.423202]; 
  const mapBounds = [
    [38.550113, -121.436225],//south west
    [38.567932, -121.413505]//north east
  ]

  const [bins, setBins] = useState([]);

  useEffect(() =>{
    fetch('http://127.0.0.1:8000/api/bins')
    .then(response => response.json())
    .then(data => setBins(data))

    const channel = supabase
      .channel('realtime_bins')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bins' },
        (payload) => {
          setBins((prevBins) =>
            prevBins.map((bin) =>
              bin.id === payload.new.id ? { ...bin, ...payload.new } : bin
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  return (
    // We force the map's container to take up the full screen
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={17}
        minZoom={17}
        maxBounds={mapBounds}
        maxBoundsViscosity={0.6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {bins.map((bin) => (
          <CircleMarker 
          key={bin.id} 
          center={[bin.lat, bin.long]}
          radius={15}
          pathOptions={{
            color: getBinColor(bin.fill_level),
            fillColor: getBinColor(bin.fill_level),
            fillOpacity: 1,
            weight: 2
          }}>
            <Popup>
              Bin ID: {bin.id} <br />
              Fill Level: {bin.fill_level}%
            </Popup>
          </CircleMarker>
        ))}

      </MapContainer>
    </div>
  );
}

export default App;