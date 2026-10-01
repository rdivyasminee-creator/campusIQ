import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusBadge } from '../components/ui';
import { useZonesData } from '../hooks/useZonesData';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Droplets, Database, ArrowUpRight, Gauge, 
  Activity, ShieldCheck, Waves, CheckCircle2, RotateCcw
} from 'lucide-react';

interface WaterTank {
  id: string;
  name: string;
  location: string;
  capacityLitres: number;
  currentLitres: number;
  type: string;
  pumpStatus: 'RUNNING' | 'IDLE' | 'STANDBY';
  autoFill: boolean;
}

const INITIAL_TANKS: WaterTank[] = [
  {
    id: 'tank-sump',
    name: 'Central Ground Water Reservoir',
    location: 'Sarada Vihar Main Utility Yard',
    capacityLitres: 50000,
    currentLitres: 42350,
    type: 'Borewell Sump',
    pumpStatus: 'IDLE',
    autoFill: true
  },
  {
    id: 'tank-acad',
    name: 'Academic & MCA/MBA Block Overhead Tank',
    location: 'Academic Wing Rooftop (Level 4)',
    capacityLitres: 20000,
    currentLitres: 16900,
    type: 'Overhead Gravity Feed',
    pumpStatus: 'STANDBY',
    autoFill: true
  },
  {
    id: 'tank-hostel',
    name: 'Hostel Complex Storage Tank',
    location: 'Residential Hostel Terrace',
    capacityLitres: 30000,
    currentLitres: 24200,
    type: 'Potable Water Tank',
    pumpStatus: 'RUNNING',
    autoFill: true
  },
  {
    id: 'tank-rain',
    name: 'Rainwater Harvesting & Recharge Well',
    location: 'South Campus Eco-Retention Basin',
    capacityLitres: 25000,
    currentLitres: 19800,
    type: 'Eco Recharge & Landscaping',
    pumpStatus: 'IDLE',
    autoFill: true
  }
];

export default function Water() {
  const navigate = useNavigate();
  const { zones, summary, loading, lastRefreshed } = useZonesData(2500);
  const [tanks, setTanks] = useState<WaterTank[]>(INITIAL_TANKS);
  const [pumpToggling, setPumpToggling] = useState<string | null>(null);

  const zoneWaterData = zones.map(z => ({
    name: z.zoneName.length > 12 ? z.zoneName.slice(0, 10) + '...' : z.zoneName,
    fullName: z.zoneName,
    value: z.waterLitres,
    status: z.status
  }));

  const totalCapacity = tanks.reduce((acc, t) => acc + t.capacityLitres, 0);
  const totalStored = tanks.reduce((acc, t) => acc + t.currentLitres, 0);
  const storedPercentage = Math.round((totalStored / totalCapacity) * 100);

  const togglePump = (tankId: string) => {
    setPumpToggling(tankId);
    setTimeout(() => {
      setTanks(prev => prev.map(t => {
        if (t.id === tankId) {
          const newStatus = t.pumpStatus === 'RUNNING' ? 'IDLE' : 'RUNNING';
          return { ...t, pumpStatus: newStatus };
        }
        return t;
      }));
      setPumpToggling(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Smart Campus Water Infrastructure</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-800 rounded-md uppercase">Telemetry Active</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Automated reservoir level monitoring, flow rate diagnostics & conservation metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin-data')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Manage Water Records
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Core KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Campus Water Draw</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">
              {loading ? "..." : (summary?.totalWaterLitres ?? 14250).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">Litres / Today</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Normal Flow Rate
            </span>
            <span className="text-slate-400 font-mono">Synced: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overhead Reserves Stored</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">
              {totalStored.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ {totalCapacity.toLocaleString()} L</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium">Tank Reserve: <strong>{storedPercentage}% Full</strong></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Greywater Recycling</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">8,450</span>
            <span className="text-xs font-semibold text-slate-400">L / Recycled</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">59.3% Campus Landscape Offset</span>
            <span className="text-emerald-600 font-bold font-mono">₹ 1,260 Saved</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plumbing Network Integrity</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">0 Leaks</span>
            <span className="text-xs font-semibold text-slate-400">/ 4.2 km Network</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">Dry-Run Protection Active</span>
            <span className="text-slate-400">Pressure: 2.8 Bar</span>
          </div>
        </Card>
      </div>

      {/* Campus Reservoirs & Tanks Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-600" />
            Live Campus Water Reservoir Levels & Pump Automation
          </h2>
          <span className="text-xs text-slate-500 font-medium">Automatic float switch synchronization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tanks.map((tank) => {
            const fillPct = Math.round((tank.currentLitres / tank.capacityLitres) * 100);
            const isRunning = tank.pumpStatus === 'RUNNING';

            return (
              <Card key={tank.id} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{tank.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tank.location}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                      {tank.type}
                    </span>
                  </div>

                  {/* Level Gauge Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-700">Fill Level: <strong className="text-blue-600 font-bold">{fillPct}%</strong></span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {tank.currentLitres.toLocaleString()} / {tank.capacityLitres.toLocaleString()} L
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          fillPct > 80 ? 'bg-gradient-to-r from-blue-500 to-sky-400' :
                          fillPct > 40 ? 'bg-gradient-to-r from-sky-500 to-cyan-400' :
                          'bg-gradient-to-r from-amber-500 to-rose-400'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[11px] font-bold text-slate-700">
                      Pump: <span className={isRunning ? 'text-emerald-600' : 'text-slate-500'}>{tank.pumpStatus}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => togglePump(tank.id)}
                    disabled={pumpToggling === tank.id}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition shadow-xs cursor-pointer ${
                      isRunning 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {pumpToggling === tank.id ? 'Updating...' : isRunning ? 'Stop Pump' : 'Start Pump'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Consumption Breakdown by Zone Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Zone Water Consumption (Litres)</h3>
              <p className="text-xs text-slate-500">Live database reading per institutional facility block</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneWaterData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toLocaleString()} Litres`, 'Water Consumption']}
                  labelFormatter={(name: any, items: any) => items?.[0]?.payload?.fullName || name}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Rainwater Harvesting & Conservation Summary */}
        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-blue-50/60 to-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Rainwater Harvesting Capacity</h3>
                <p className="text-[11px] text-slate-500">10-Acre Sarada Vihar Campus Catchment</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                <span>Annual Recharge Target</span>
                <strong className="font-mono text-slate-900">1.25 Lakh L</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                <span>Percolation Well Depth</span>
                <strong className="font-mono text-slate-900">45 Metres</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                <span>Borewell Static Water Table</span>
                <strong className="font-mono text-emerald-600">+1.4 m Recharge</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                <span>Water Quality Index (TDS)</span>
                <strong className="font-mono text-slate-900">112 ppm (Safe)</strong>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200">
            <span className="text-[11px] text-slate-500">
              Integrated with Bhubaneswar municipal green rating standards.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
