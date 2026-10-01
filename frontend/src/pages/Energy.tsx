import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import { io, Socket } from 'socket.io-client';
import { 
  Zap, AlertTriangle, CheckCircle, RefreshCw, 
  Settings2, Activity, Wifi, WifiOff, Clock, ShieldAlert,
  Layers, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

export interface IEnergyZone {
  id: string;
  name: string;
  powerKw: number;
  energyTodayKwh: number;
  voltageV: number;
  currentA: number;
  powerFactor: number;
  status: 'Normal' | 'High' | 'Critical';
  thresholdKw: number;
  lastUpdated: string;
  isSimulated: boolean;
}

export interface IEnergyHistoryPoint {
  timestamp: string;
  timeLabel: string;
  totalKw: number;
  academicKw: number;
  adminKw: number;
  libraryKw: number;
  labKw: number;
  cafeteriaKw: number;
}

export interface IEnergyAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  powerKw: number;
  thresholdKw: number;
  status: 'High' | 'Critical';
  message: string;
  timestamp: string;
}

export interface IEnergyTelemetry {
  zones: IEnergyZone[];
  total: {
    totalPowerKw: number;
    totalEnergyTodayKwh: number;
    avgVoltageV: number;
    totalCurrentA: number;
    avgPowerFactor: number;
    overallStatus: 'Normal' | 'High' | 'Critical';
  };
  alerts: IEnergyAlert[];
  history: IEnergyHistoryPoint[];
  isSimulated: boolean;
  label: string;
  lastUpdated: string;
}

export default function Energy() {
  const [energyData, setEnergyData] = useState<IEnergyTelemetry | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastReceived, setLastReceived] = useState<Date>(new Date());
  const [editingThresholdZone, setEditingThresholdZone] = useState<string | null>(null);
  const [thresholdInput, setThresholdInput] = useState<string>('');
  const [thresholdSaving, setThresholdSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Initialize Socket.IO connection with polling fallback
  useEffect(() => {
    let socket: Socket | null = null;
    let isMounted = true;

    try {
      socket = io('/', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 20,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        if (isMounted) setIsConnected(true);
      });

      socket.on('disconnect', () => {
        if (isMounted) setIsConnected(false);
      });

      socket.on('connect_error', () => {
        if (isMounted) setIsConnected(false);
      });

      socket.on('energy_telemetry', (payload: IEnergyTelemetry) => {
        if (isMounted && payload) {
          setEnergyData(payload);
          setIsConnected(true);
          setLastReceived(new Date());
        }
      });
    } catch (e) {
      if (isMounted) setIsConnected(false);
    }

    // Direct HTTP fetch and fallback periodic polling
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/energy/zones');
        if (res.ok) {
          const data: IEnergyTelemetry = await res.json();
          if (isMounted) {
            setEnergyData(data);
            setIsConnected(true);
            setLastReceived(new Date());
          }
        } else {
          if (isMounted && !socket?.connected) {
            setIsConnected(false);
          }
        }
      } catch (err) {
        if (isMounted && !socket?.connected) {
          setIsConnected(false);
        }
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (socket) socket.disconnect();
    };
  }, []);

  // Handle Admin Energy Threshold Update
  const handleSaveThreshold = async (zoneId: string) => {
    const val = parseFloat(thresholdInput);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid positive number for threshold (kW).");
      return;
    }

    setThresholdSaving(true);
    try {
      const res = await fetch('/api/energy/thresholds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId, thresholdKw: val })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage(`Updated threshold to ${val} kW`);
        setEditingThresholdZone(null);
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (e) {
      alert("Failed to save threshold to backend.");
    } finally {
      setThresholdSaving(false);
    }
  };

  const zones = energyData?.zones || [];
  const total = energyData?.total;
  const history = energyData?.history || [];
  const alerts = energyData?.alerts || [];

  return (
    <div className="space-y-6">
      {/* Real-Time Live Status Bar & Connection Indicator */}
      <div className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-all ${
        isConnected 
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
          : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'
          }`}>
            {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <h2 className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                {isConnected ? 'LIVE SOCKET STREAM ACTIVE &bull; REAL-TIME ENERGY TELEMETRY' : 'CONNECTION LOST &bull; RECONNECTING TO BACKEND...'}
              </h2>
            </div>
            <div className="text-xs opacity-80 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-amber-300">⚡ Live Prototype Data – Simulated</span>
              <span>&bull;</span>
              <span>Backend: <strong>http://localhost:5000</strong></span>
              <span>&bull;</span>
              <span>Refreshes every 2–3s</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 opacity-70" />
          <span>Last Updated: <strong>{lastReceived.toLocaleTimeString()}</strong></span>
        </div>
      </div>

      {/* Disconnection Warning Banner if Backend Goes Offline */}
      {!isConnected && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in-up">
          <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div className="text-xs">
            <strong className="block text-sm">Connection Lost to Express Backend</strong>
            The live energy telemetry stream was interrupted. Waiting for backend on <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono">http://localhost:5000</code> to restore connection. Prototype values are paused.
          </div>
        </div>
      )}

      {/* Header Title & Information */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Campus Energy Monitoring</h1>
            <span className="px-2.5 py-0.5 text-[11px] font-black uppercase rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Simulated Prototype
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Real-time sub-metering across campus blocks &bull; Socket.IO push updates without page refresh
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-xs">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>5 Monitored Campus Zones</span>
        </div>
      </div>

      {/* Dynamic Threshold Alert Notification Bar */}
      {alerts.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-red-900 font-black text-sm">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Active Energy Consumption Alerts ({alerts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  alert.status === 'Critical' 
                    ? 'bg-red-100/80 border-red-300 text-red-900' 
                    : 'bg-amber-100/80 border-amber-300 text-amber-900'
                }`}
              >
                <div>
                  <span className="font-extrabold">{alert.zoneName}:</span> {alert.powerKw} kW (Threshold: {alert.thresholdKw} kW)
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white ${
                  alert.status === 'Critical' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {saveMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* TOTAL CAMPUS ENERGY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Campus Power Draw */}
        <Card className="p-5 border-2 border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5 text-amber-600">
              <Zap className="w-4 h-4" /> Total Power Draw
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              total?.overallStatus === 'Critical' 
                ? 'bg-red-100 text-red-700' 
                : total?.overallStatus === 'High' 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {total?.overallStatus === 'Critical' ? '🔴 Critical' : total?.overallStatus === 'High' ? '🟡 High' : '🟢 Normal'}
            </span>
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {total?.totalPowerKw ?? 0} <span className="text-base font-semibold text-gray-500">kW</span>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-medium flex justify-between items-center">
            <span>Aggregated from 5 campus zones</span>
            <span className="font-bold text-gray-700">{total?.totalCurrentA ?? 0} A Total</span>
          </div>
        </Card>

        {/* Total Energy Used Today */}
        <Card className="p-5 border-2 border-gray-200">
          <div className="text-gray-500 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-600">
            <Activity className="w-4 h-4" /> Energy Used Today
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {total?.totalEnergyTodayKwh ?? 0} <span className="text-base font-semibold text-gray-500">kWh</span>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-medium flex justify-between items-center">
            <span>Accumulating live</span>
            <span className="font-bold text-blue-600">Daily Metric</span>
          </div>
        </Card>

        {/* Average Campus Voltage */}
        <Card className="p-5 border-2 border-gray-200">
          <div className="text-gray-500 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-purple-600">
            <Layers className="w-4 h-4" /> Supply Voltage
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {total?.avgVoltageV ?? 228} <span className="text-base font-semibold text-gray-500">V (AC)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-medium flex justify-between items-center">
            <span>Nominal 230V &plusmn;5%</span>
            <span className="font-bold text-emerald-600">Phase Stable</span>
          </div>
        </Card>

        {/* Average Power Factor */}
        <Card className="p-5 border-2 border-gray-200">
          <div className="text-gray-500 text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-600">
            <Activity className="w-4 h-4" /> Power Factor
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {total?.avgPowerFactor ?? 0.92} <span className="text-base font-semibold text-gray-500">PF</span>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-medium flex justify-between items-center">
            <span>Campus Grid Efficiency</span>
            <span className="font-bold text-emerald-600">Optimal (&gt;0.90)</span>
          </div>
        </Card>
      </div>

      {/* REAL-TIME ENERGY CONSUMPTION CHART (POWER OVER TIME) */}
      <Card className="p-6 border-2 border-gray-200 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-gray-900">
                Real-Time Energy Consumption (Power kW Over Time)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Live Stream
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Live power telemetry updating every 3 seconds &bull; Displays historical curve for campus load &amp; blocks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5 text-gray-500 animate-spin" />
              Auto-updating
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAcademic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="timeLabel" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" kW" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val: any, name: any) => [`${val} kW`, name]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="totalKw" name="Total Campus (kW)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="labKw" name="Laboratory (kW)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorLab)" />
              <Area type="monotone" dataKey="academicKw" name="Academic Block (kW)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAcademic)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* TRACKED CAMPUS ZONES ENERGY CARDS (Academic, Admin, Library, Lab, Cafeteria) */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-xl font-black text-gray-900">Campus Facility Zones Energy Telemetry</h3>
            <p className="text-xs text-gray-500 font-medium">
              Detailed electrical parameters per block &bull; Configurable power thresholds with alert trigger
            </p>
          </div>
          <div className="text-xs text-gray-400 font-semibold">
            Status: 🟢 Normal &bull; 🟡 High (&ge;85% threshold) &bull; 🔴 Critical (&gt;threshold)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {zones.map((zone) => {
            const isEditing = editingThresholdZone === zone.id;
            const percentOfThreshold = Math.min(100, Math.round((zone.powerKw / zone.thresholdKw) * 100));

            return (
              <Card 
                key={zone.id}
                className={`p-5 border-2 transition-all ${
                  zone.status === 'Critical' 
                    ? 'border-red-400 bg-red-50/40 shadow-red-200' 
                    : zone.status === 'High' 
                    ? 'border-amber-400 bg-amber-50/40 shadow-amber-200' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Zone Header with Status Indicator */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-gray-900 text-base flex items-center gap-2">
                      {zone.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Meter Node &bull; {zone.isSimulated ? 'Simulated Prototype' : 'IoT Hardware'}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1.5 shadow-xs ${
                    zone.status === 'Critical' 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : zone.status === 'High' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {zone.status === 'Critical' ? '🔴 Critical' : zone.status === 'High' ? '🟡 High' : '🟢 Normal'}
                  </span>
                </div>

                {/* Primary Metric: Current Power Consumption (kW) */}
                <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider block">
                        Current Power
                      </span>
                      <div className="text-3xl font-black text-gray-900">
                        {zone.powerKw} <span className="text-sm font-semibold text-gray-500">kW</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Threshold</span>
                      <span className="text-sm font-extrabold text-gray-800">{zone.thresholdKw} kW</span>
                    </div>
                  </div>

                  {/* Visual Power Gauge Bar */}
                  <div className="mt-2.5 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        zone.status === 'Critical' 
                          ? 'bg-red-600' 
                          : zone.status === 'High' 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentOfThreshold}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-bold text-gray-500">
                    <span>{percentOfThreshold}% of threshold limit</span>
                    <span>{zone.status === 'Critical' ? 'Over Limit!' : 'Within Safe Range'}</span>
                  </div>
                </div>

                {/* Secondary Parameters Grid (kWh, V, A, PF) */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                  <div className="p-2 bg-gray-50/80 rounded-lg">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Energy Used Today</span>
                    <span className="font-extrabold text-gray-900 text-sm">{zone.energyTodayKwh} kWh</span>
                  </div>
                  <div className="p-2 bg-gray-50/80 rounded-lg">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Voltage (V)</span>
                    <span className="font-extrabold text-gray-900 text-sm">{zone.voltageV} V</span>
                  </div>
                  <div className="p-2 bg-gray-50/80 rounded-lg">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Current (A)</span>
                    <span className="font-extrabold text-gray-900 text-sm">{zone.currentA} A</span>
                  </div>
                  <div className="p-2 bg-gray-50/80 rounded-lg">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Power Factor</span>
                    <span className="font-extrabold text-gray-900 text-sm">{zone.powerFactor} PF</span>
                  </div>
                </div>

                {/* Admin Threshold Configuration Section */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {isEditing ? (
                    <div className="flex items-center gap-2 animate-fade-in-up">
                      <input 
                        type="number" 
                        step="0.5"
                        value={thresholdInput}
                        onChange={(e) => setThresholdInput(e.target.value)}
                        placeholder={`e.g. ${zone.thresholdKw}`}
                        className="w-24 px-2 py-1 text-xs border-2 border-primary-500 rounded-lg font-bold text-gray-900 focus:outline-none"
                      />
                      <span className="text-xs font-bold text-gray-500">kW</span>
                      <button
                        disabled={thresholdSaving}
                        onClick={() => handleSaveThreshold(zone.id)}
                        className="px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                      >
                        {thresholdSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingThresholdZone(null)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 font-medium">
                        Alert Threshold: <strong className="text-gray-800">{zone.thresholdKw} kW</strong>
                      </span>
                      <button
                        onClick={() => {
                          setEditingThresholdZone(zone.id);
                          setThresholdInput(String(zone.thresholdKw));
                        }}
                        className="px-2 py-1 text-[11px] font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition flex items-center gap-1"
                        title="Configure Alert Threshold for this zone"
                      >
                        <Settings2 className="w-3 h-3" />
                        Set Threshold
                      </button>
                    </div>
                  )}
                </div>

                {/* Zone Last Updated */}
                <div className="mt-2 text-[10px] text-gray-400 font-medium flex items-center justify-between">
                  <span>Reading: {new Date(zone.lastUpdated).toLocaleTimeString()}</span>
                  <span className="text-emerald-600 font-bold">&bull; Active</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* IoT Architecture Specification Box */}
      <Card className="p-5 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-indigo-950">
                IoT Hardware &amp; Sensor Ingestion Architecture (ESP32 Ready)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 uppercase">
                Sensorless Prototype Mode
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 max-w-3xl">
              All displayed values are currently driven by the backend simulator for live demonstration purposes. Physical ESP32 microcontrollers or Modbus energy meters can directly transmit real sensor packets to <code className="bg-indigo-100/80 px-1 py-0.5 rounded text-indigo-900 font-mono text-[11px]">POST /api/energy/reading</code> to immediately replace the simulated telemetry with physical hardware readings without modifying this dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              REST &amp; WebSocket Ingestion Ready
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
