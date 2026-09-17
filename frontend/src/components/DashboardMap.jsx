import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css'; 

const fullColor = '#ff4f34'
const mediumColor = '#f59e0b'
const lowColor = '#10b981'

const getBinColor = (fill_level) =>{
    if (fill_level >= 80) return fullColor;
    if (fill_level >= 50) return mediumColor; 
    return lowColor;
}

const defaultCenter = [38.559677, -121.423202]; 
const mapBounds = [
    [38.550113, -121.436225],   //south west
    [38.567932, -121.413505]    //north east
]

function DashboardMap({ bins }){
    
    return (
        <div className='flex-1'>
            <MapContainer 
            center={defaultCenter} 
            zoom={17}
            minZoom={16}
            maxBounds={mapBounds}
            maxBoundsViscosity={0.6}
            className='h-full w-full'
            zoomControl={false}
            attributionControl={false}
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
    )
}
export default DashboardMap;