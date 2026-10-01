import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusBadge } from '../components/ui';
import { useZonesData } from '../hooks/useZonesData';
import { 
  Building2, Database, ArrowUpRight, Zap, 
  Cpu, Wrench, ShieldCheck, Sun, CheckCircle2, AlertTriangle, Filter
} from 'lucide-react';

interface CampusAsset {
  id: string;
  name: string;
  category: 'Electrical' | 'Renewable Solar' | 'HVAC & Climate' | 'Water Utility' | 'Mobility';
  location: string;
  status: 'Operational' | 'Optimal' | 'Maintenance Due' | 'Standby';
  healthScore: number;
  capacity: string;
  uptime: string;
  lastInspected: string;
  nextService: string;
}

const CRITICAL_ASSETS: CampusAsset[] = [
  {
    id: 'asset-trans',
    name: '500 kVA 11kV/415V Substation Transformer',
    category: 'Electrical',
    location: 'Sarada Vihar Substation Yard',
    status: 'Operational',
    healthScore: 96,
    capacity: '500 kVA / 3-Phase',
    uptime: '99.9%',
    lastInspected: '15 Sep 2026',
    nextService: '15 Dec 2026'
  },
  {
    id: 'asset-solar',
    name: '150 kW On-Grid Rooftop Solar PV Inverter Plant',
    category: 'Renewable Solar',
    location: 'Academic Block Terrace (10,000 sq ft)',
    status: 'Optimal',
    healthScore: 98,
    capacity: '150 kWp / 540 kWh/day',
    uptime: '99.7%',
    lastInspected: '20 Sep 2026',
    nextService: '20 Oct 2026'
  },
  {
    id: 'asset-hvac',
    name: 'Central Multi-Split VRV HVAC Chiller System',
    category: 'HVAC & Climate',
    location: 'Auditorium & Computer Lab Wing',
    status: 'Operational',
    healthScore: 92,
    capacity: '80 TR Cooling Capacity',
    uptime: '98.5%',
    lastInspected: '10 Sep 2026',
    nextService: '10 Nov 2026'
  },
  {
    id: 'asset-ro',
    name: 'Commercial Campus RO & UV Water Plant',
    category: 'Water Utility',
    location: 'Ground Floor Utility Annex',
    status: 'Optimal',
    healthScore: 94,
    capacity: '2,000 LPH Purification',
    uptime: '99.2%',
    lastInspected: '18 Sep 2026',
    nextService: '18 Oct 2026'
  },
  {
    id: 'asset-dg',
    name: '125 kVA Silent Backup Diesel Generator (AMF Auto)',
    category: 'Electrical',
    location: 'Utility Service Yard',
    status: 'Standby',
    healthScore: 97,
    capacity: '125 kVA / 88% Fuel',
    uptime: '100% Ready',
    lastInspected: '22 Sep 2026',
    nextService: '22 Nov 2026'
  },
  {
    id: 'asset-lift',
    name: 'High-Speed 13-Passenger Campus Elevators (2 Units)',
    category: 'Mobility',
    location: 'Academic & Administration Blocks',
    status: 'Operational',
    healthScore: 95,
    capacity: '884 kg / G+4 Levels',
    uptime: '99.4%',
    lastInspected: '05 Sep 2026',
    nextService: '05 Oct 2026'
  }
];

export default function Assets() {
  const navigate = useNavigate();
  const { zones, summary, loading, lastRefreshed } = useZonesData(2500);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [assets, setAssets] = useState<CampusAsset[]>(CRITICAL_ASSETS);

  const avgUtil = summary?.averageUtilization ?? 78;

  const filteredAssets = selectedCategory === 'All' 
    ? assets 
    : assets.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Facility Assets & Space Utilization</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-purple-100 text-purple-800 rounded-md uppercase">Asset Registry</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Continuous health telemetry, preventive maintenance lifecycle & space efficiency auditing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin-data')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            Update Utilization Database
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Space Utilization</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{loading ? "..." : `${avgUtil}%`}</span>
            <span className="text-xs font-semibold text-slate-400">Average Capacity</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">18/20 Facilities Active</span>
            <span className="text-slate-400 font-mono">Synced {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Infrastructure Health</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">96.2%</span>
            <span className="text-xs font-semibold text-slate-400">Health Index</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">6 Major Capital Assets</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solar Energy Generation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">540 kWh</span>
            <span className="text-xs font-semibold text-slate-400">/ Today Produced</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">36.4% Campus Grid Offset</span>
            <span className="text-slate-400">₹ 4,320 Saved</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Built-Up Area</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">2.5 Lakh+</span>
            <span className="text-xs font-semibold text-slate-400">sq. ft. / 10 Acres</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">Sarada Vihar Campus</span>
            <span className="text-emerald-600 font-semibold">A+ Green Rated</span>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Electrical', 'Renewable Solar', 'HVAC & Climate', 'Water Utility', 'Mobility'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-purple-600 text-white shadow-purple-600/30' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredAssets.length} of {assets.length} Registered Infrastructure Assets
        </span>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">{asset.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{asset.location}</p>
                </div>
                <StatusBadge status={asset.status} />
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-medium">Capacity / Rating</span>
                  <strong className="text-slate-800 font-mono text-[11px]">{asset.capacity}</strong>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-medium">Operational Uptime</span>
                  <strong className="text-emerald-600 font-mono text-[11px]">{asset.uptime}</strong>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-medium">Health Rating</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${asset.healthScore}%` }} />
                    </div>
                    <strong className="font-mono text-slate-800 text-[11px]">{asset.healthScore}%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Next Audit: <strong className="text-slate-700">{asset.nextService}</strong></span>
              <button 
                onClick={() => navigate('/maintenance')}
                className="font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
              >
                Log Ticket →
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Campus Space Utilization Breakdown */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-600" />
          Live Campus Space Occupancy & Utilization by Block
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <Card key={zone._id} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{zone.zoneName}</h4>
                  <StatusBadge status={zone.status} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Space Utilization</span>
                    <strong className="text-purple-600 font-mono">{zone.utilization}%</strong>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${zone.utilization}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 flex justify-between text-[11px] text-slate-400">
                <span>Power: {zone.electricityKwh} kWh</span>
                <span>Water: {zone.waterLitres} L</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
