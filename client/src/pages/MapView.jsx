import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A custom icon for safe zones
const safeZoneIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A custom icon for hospitals
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultCenter = [20.5937, 78.9629]; // India Coordinates

const MapView = () => {
  // Mock data for demo purposes since we don't have a real Google Places API key
  const safeZones = [
    { id: 1, name: 'Delhi Safdarjung Relief Camp', lat: 28.5639, lng: 77.2090, capacity: 500 },
    { id: 2, name: 'Mumbai Disaster Center', lat: 19.0760, lng: 72.8777, capacity: 1200 },
    { id: 3, name: 'Chennai Coastal Safe House', lat: 13.0827, lng: 80.2707, capacity: 800 }
  ];

  const hospitals = [
    { id: 1, name: 'AIIMS New Delhi', lat: 28.5659, lng: 77.2111 },
    { id: 2, name: 'KEM Hospital Mumbai', lat: 19.0031, lng: 72.8397 },
    { id: 3, name: 'Apollo Main Hospital Chennai', lat: 13.0618, lng: 80.2520 }
  ];

  const mapStyle = { height: '600px', width: '100%', borderRadius: '1rem' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Safe Zones & Hospitals</h1>
          <p className="mt-2 text-slate-600">Locate resources in your immediate vicinity</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-slate-700">Safe Zones</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-slate-700">Hospitals</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200" style={{ zIndex: 0 }}>
        <MapContainer center={defaultCenter} zoom={5} style={mapStyle}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User simulated location */}
          <Circle center={defaultCenter} radius={400} pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue' }}>
             <Popup>You are somewhere in this area</Popup>
          </Circle>

          {safeZones.map(zone => (
            <Marker key={`sz-${zone.id}`} position={[zone.lat, zone.lng]} icon={safeZoneIcon}>
              <Popup>
                <strong>{zone.name}</strong><br/>
                Capacity: {zone.capacity} people<br/>
                Status: <span className="text-green-600 font-bold">Open</span>
              </Popup>
            </Marker>
          ))}

          {hospitals.map(hospital => (
            <Marker key={`h-${hospital.id}`} position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
              <Popup>
                <strong>{hospital.name}</strong><br/>
                Emergency Room: Available<br/>
                Operating Status: Normal
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
