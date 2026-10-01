import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusBadge } from '../components/ui';
import { useZonesData } from '../hooks/useZonesData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Trash2, Database, ArrowUpRight, Recycle, 
  Leaf, AlertTriangle, CheckCircle2, Truck, Bell
} from 'lucide-react';

interface SmartBin {
  id: string;
  name: string;
  location: string;
  category: 'Wet / Organic' | 'Dry Paper' | 'Plastic & Metal' | 'E-Waste';
  fillPercentage: number;
  batteryPct: number;
  lastEmptied: string;
}

const SMART_BINS: SmartBin[] = [
  {
    id: 'bin-cafe',
    name: 'Cafeteria Courtyard Bio-Bin',
    location: 'Campus Dining Hall (Ground)',
    category: 'Wet / Organic',
    fillPercentage: 74,
    batteryPct: 92,
    lastEmptied: '3 hours ago'
  },
  {
    id: 'bin-acad',
    name: 'Academic Block Central Receptacle',
    location: 'Academic Corridor 1st Floor',
    category: 'Dry Paper',
    fillPercentage: 42,
    batteryPct: 88,
    lastEmptied: '5 hours ago'
  },
  {
    id: 'bin-hostel',
    name: 'Hostel Quad Recycling Station',
    location: 'Residential Hostel Entry',
    category: 'Plastic & Metal',
    fillPercentage: 58,
    batteryPct: 95,
    lastEmptied: '2 hours ago'
  },
  {
    id: 'bin-itlab',
    name: 'IT Lab Electronic Waste Bin',
    location: 'MCA IT Center 2nd Floor',
    category: 'E-Waste',
    fillPercentage: 28,
    batteryPct: 90,
    lastEmptied: 'Yesterday'
  },
  {
    id: 'bin-lib',
    name: 'Central Library Shredded Paper Hub',
    location: 'Reading Room Entrance',
    category: 'Dry Paper',
    fillPercentage: 35,
    batteryPct: 94,
    lastEmptied: '4 hours ago'
  }
];

const STREAM_DATA = [
  { name: 'Organic Compostable', value: 48, color: '#10b981' },
  { name: 'Dry Paper & Books', value: 28, color: '#3b82f6' },
  { name: 'Recyclable Plastics', value: 18, color: '#f59e0b' },
  { name: 'E-Waste & Batteries', value: 6, color: '#8b5cf6' }
];

export default function Waste() {
  const navigate = useNavigate();
  const { zones, summary, loading, lastRefreshed } = useZonesData(2500);
  const [bins, setBins] = useState<SmartBin[]>(SMART_BINS);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const totalWaste = summary?.totalWasteKg ?? 42;

  const zoneWasteData = zones.map(z => ({
    name: z.zoneName.length > 12 ? z.zoneName.slice(0, 10) + '...' : z.zoneName,
    fullName: z.zoneName,
    value: z.wasteKg,
    status: z.status
  }));

  const handleDispatchCustodial = (binName: string) => {
    setDispatchAlert(`Custodial dispatch order sent for ${binName}. Janitorial team notified via SMS.`);
    setTimeout(() => setDispatchAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Solid Waste & Circular Economy Management</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-800 rounded-md uppercase">Zero Landfill</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Ultrasonic bin fill telemetry, on-site vermicomposting & sustainable segregation auditing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin-data')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-rose-400" />
            Update Custodial Logs
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {dispatchAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>{dispatchAlert}</span>
          </div>
          <button onClick={() => setDispatchAlert(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Campus Waste Logged</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{loading ? "..." : totalWaste}</span>
            <span className="text-xs font-semibold text-slate-400">kg / Logged Today</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Normal Collection Load
            </span>
            <span className="text-slate-400 font-mono">Updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Segregation Efficiency</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">92.4%</span>
            <span className="text-xs font-semibold text-slate-400">Source Segregated</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">4-Stream Campus System</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Site Vermicomposting</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">18.5</span>
            <span className="text-xs font-semibold text-slate-400">kg Organic Compost Yield</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">100% Reused in Campus Gardens</span>
            <span className="text-slate-400">Zero Chemical Fertilizer</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Ultrasonic Bin Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">0 Overflows</span>
            <span className="text-xs font-semibold text-slate-400">/ 5 Sensor Bins</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">Automated Threshold Alert: 80%</span>
            <span className="text-slate-400">Solar-Powered</span>
          </div>
        </Card>
      </div>

      {/* Ultrasonic Smart Bin Telemetry Fleet */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            Live Ultrasonic Bin Fill Level Network (IoT HC-SR04 Nodes)
          </h2>
          <span className="text-xs text-slate-500 font-medium">Automatic threshold alerts dispatch custodial crews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bins.map((bin) => {
            const isHigh = bin.fillPercentage >= 75;

            return (
              <Card key={bin.id} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{bin.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{bin.location}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                      {bin.category}
                    </span>
                  </div>

                  {/* Level Gauge */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-700">
                        Fill Status: <strong className={isHigh ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold'}>{bin.fillPercentage}%</strong>
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">Emptied: {bin.lastEmptied}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          isHigh 
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{ width: `${bin.fillPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Battery: {bin.batteryPct}%</span>
                  <button
                    onClick={() => handleDispatchCustodial(bin.name)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    Dispatch Custodial Crew
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stream Distribution & Zone Waste Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Waste Mass by Campus Facility Block (kg)</h3>
              <p className="text-xs text-slate-500">Real-time database records per collection zone</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Database Synced</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneWasteData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val: any) => [`${val} kg`, 'Waste Logged']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Circular Economy Breakdown */}
        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-rose-50/40 to-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Campus Waste Stream Share</h3>
                <p className="text-[11px] text-slate-500">Circular sustainability audit breakdown</p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4 text-xs">
              {STREAM_DATA.map((stream) => (
                <div key={stream.name} className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stream.color }} />
                    <span className="text-slate-700 font-medium">{stream.name}</span>
                  </div>
                  <strong className="font-mono text-slate-900">{stream.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">
              Zero Landfill Policy Certified &bull; State Pollution Board Compliant
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
