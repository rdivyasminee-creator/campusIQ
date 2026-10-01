import React from 'react';
import { Card } from '../components/ui';
import { INSTITUTION_INFO } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function CampusMap() {
  const { lat, lng, dms } = INSTITUTION_INFO.coordinates;

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">NIIS Campus Location</h1>
        <p className="text-gray-500">Interactive map and campus details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex-1 min-h-[400px]">
            <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  <strong>{INSTITUTION_INFO.name}</strong><br/>
                  <span className="text-xs font-semibold text-primary-700">📍 {dms}</span><br/>
                  {INSTITUTION_INFO.location.split(', ').slice(0,2).join(', ')}<br/>
                  {INSTITUTION_INFO.location.split(', ').slice(2).join(', ')}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
            <button className="px-4 py-2 bg-white border rounded shadow-sm text-sm hover:bg-gray-50" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')}>
              View on Map
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded shadow-sm text-sm hover:bg-primary-700" onClick={openDirections}>
              Get Directions
            </button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-lg mb-2">Location Information</h3>
            <p className="font-medium text-gray-900">{INSTITUTION_INFO.name}</p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {INSTITUTION_INFO.location}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-1">
              <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                <span className="text-red-500">📍</span> Live GPS: <span className="font-mono text-primary-700">{dms}</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Decimal: {lat.toFixed(6)}° N, {lng.toFixed(6)}° E
              </div>
            </div>
          </Card>
          
          <Card className="p-5 bg-gradient-to-br from-primary-50 to-white">
            <h3 className="font-semibold text-lg mb-4 text-primary-900">Campus Snapshot</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> 10-acre campus</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> 2.5 lakh+ sq. ft. built-up area</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> MBA & MCA Programs</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> State-of-the-art Labs</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> Hostel Facilities</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> Auditorium & Classrooms</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span> Playing Field & Leisure Grounds</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Aerial Drone Showcase with Smart Zoning */}
      <Card className="overflow-hidden border-2 border-gray-200 shadow-md">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-gray-50">
          <div>
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></span>
              NIIS Sarada Vihar &bull; High-Resolution Aerial Facility Layout
            </h3>
            <p className="text-xs text-gray-500">Live aerial drone view showing Academic blocks, Hostels, Temple complex, and Green zones</p>
          </div>
          <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-lg self-start sm:self-auto">
            10 Acres &bull; Madanpur
          </span>
        </div>
        <div className="relative h-[480px] w-full overflow-hidden group">
          <img
            src="/campus_aerial.jpg"
            alt="NIIS Sarada Vihar Aerial Drone Layout"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              🏢 Central Administrative & Academic Block
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              🏫 Science, BCA & MBA Wings
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              🛏️ Residential Hostels
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              🛕 Campus Shrine & Assembly Ground
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
