import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'; 

const fullColor = "bg-red-500"
const mediumColor = "bg-amber-500"
const lowColor = "bg-emerald-500"



const defaultCenter = [38.559677, -121.423202]; 
const mapBounds = [
    [38.54839610772975, -121.43695538673354],   //south west
    [38.57178820331364, -121.40755894841233]    //north east
]

const createBinIcon = (fillLevel) => {
    const colorClass = 
        fillLevel > 80 ? fullColor : 
        fillLevel > 50 ? mediumColor : lowColor;

    return L.divIcon({
        className: 'bg-transparent',
        html: `<div
                class= "h-4 w-4 ${colorClass} rounded-full border-2 border-slate-700 shadow-md transition-transform  hover:scale-250"
                >
               </div>`,
        iconSize: [16,16],
        iconAnchor: [8,8]
    })
}

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
                className='map-tiles-dark'
            />

            {bins.map((bin) => (
                <Marker 
                key={bin.id} 
                position={[bin.lat, bin.long]}
                icon={createBinIcon(bin.fill_level)}
                >
                    <Popup>
                        Bin ID: {bin.id} <br />
                        Fill Level: {bin.fill_level}%
                    </Popup>
                </Marker>
            ))}
            </MapContainer>
        </div>
    )
}
export default DashboardMap;