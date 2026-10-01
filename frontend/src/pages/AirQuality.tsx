import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusBadge } from '../components/ui';
import { useZonesData } from '../hooks/useZonesData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar 
} from 'recharts';
import { 
  Wind, Thermometer, Droplets, Database, ArrowUpRight, 
  ShieldCheck, AlertCircle, Sparkles, Fan, Volume2, CloudRain
} from 'lucide-react';

interface IAQSensor {
  id: string;
  location: string;
  aqi: number;
  pm25: number;
  pm10: number;
  co2: number;
  temp: number;
  humidity: number;
  noiseDb: number;
  ventilation: 'ACTIVE' | 'STANDBY' | 'ECO';
  status: 'Optimal' | 'Good' | 'Moderate';
}

const INDOOR_SENSORS: IAQSensor[] = [
  {
    id: 'iaq-acad',
    location: 'Academic Block (MCA/MBA Classrooms)',
    aqi: 38,
    pm25: 11,
    pm10: 24,
    co2: 420,
    temp: 24.5,
    humidity: 58,
    noiseDb: 44,
    ventilation: 'ECO',
    status: 'Optimal'
  },
  {
    id: 'iaq-lib',
    location: 'Central Library & Reading Hall',
    aqi: 29,
    pm25: 8,
    pm10: 18,
    co2: 395,
    temp: 23.8,
    humidity: 55,
    noiseDb: 36,
    ventilation: 'ACTIVE',
    status: 'Optimal'
  },
  {
    id: 'iaq-itlab',
    location: 'IT Computer Labs & Server Hub',
    aqi: 32,
    pm25: 9,
    pm10: 20,
    co2: 410,
    temp: 21.5,
    humidity: 52,
    noiseDb: 48,
    ventilation: 'ACTIVE',
    status: 'Optimal'
  },
  {
    id: 'iaq-cafeteria',
    location: 'Campus Dining & Cafeteria Hall',
    aqi: 54,
    pm25: 18,
    pm10: 38,
    co2: 560,
    temp: 26.2,
    humidity: 64,
    noiseDb: 62,
    ventilation: 'ACTIVE',
    status: 'Good'
  },
  {
    id: 'iaq-conf',
    location: 'Top Floor Executive Conference Hall',
    aqi: 35,
    pm25: 10,
    pm10: 22,
    co2: 405,
    temp: 23.0,
    humidity: 56,
    noiseDb: 38,
    ventilation: 'STANDBY',
    status: 'Optimal'
  }
];

export default function AirQuality() {
  const navigate = useNavigate();
  const { zones, summary, loading, lastRefreshed } = useZonesData(2500);
  const [sensors, setSensors] = useState<IAQSensor[]>(INDOOR_SENSORS);

  const avgAqi = summary?.averageAirQuality ?? 38;

  const aqiChartData = sensors.map(s => ({
    name: s.location.split(' (')[0],
    fullName: s.location,
    aqi: s.aqi,
    co2: s.co2,
    temp: s.temp
  }));

  const getAqiCategory = (val: number) => {
    if (val <= 50) return { label: 'Good (Optimal)', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (val <= 100) return { label: 'Satisfactory', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (val <= 200) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Poor', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const currentCategory = getAqiCategory(avgAqi);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Indoor Air Quality & Microclimate Intelligence</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md uppercase">CPCB Compliant</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Continuous particulate matter, CO2, thermal comfort & automated HVAC airflow monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin-data')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Update Environmental Logs
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Environmental KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Composite AQI</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">AQI {avgAqi}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentCategory.bg} ${currentCategory.color}`}>
              {currentCategory.label}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Madanpur Ambient Station</span>
            <span className="text-slate-400 font-mono">Synced {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PM2.5 & PM10 Particulates</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-black text-slate-900">12</span>
              <span className="text-[10px] text-slate-400 font-medium ml-1">µg/m³ (PM2.5)</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">26</span>
              <span className="text-[10px] text-slate-400 font-medium ml-1">µg/m³ (PM10)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">Well below 60 µg/m³ standard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indoor Carbon Dioxide (CO2)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Fan className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">415</span>
            <span className="text-xs font-semibold text-slate-400">ppm (Normal: &lt;1000)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">Fresh Air Induction Active</span>
            <span className="text-slate-400">Ventilation 100%</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thermal Comfort (Temp & RH)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-black text-slate-900">24.5</span>
              <span className="text-xs text-slate-400 ml-0.5">°C</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">58%</span>
              <span className="text-xs text-slate-400 ml-0.5">RH</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">ASHRAE Standard Comfort</span>
            <span className="text-slate-400">Noise: 42 dB</span>
          </div>
        </Card>
      </div>

      {/* Indoor Zones IAQ Sensor Telemetry */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Live Indoor IAQ Node Telemetry by Facility Zone
          </h2>
          <span className="text-xs text-slate-500 font-medium">Calibrated Laser Scattering & NDIR CO2 Sensors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <Card key={sensor.id} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{sensor.location}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                        AQI {sensor.aqi}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">CO2: {sensor.co2} ppm</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 uppercase">
                    {sensor.ventilation}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">PM2.5</span>
                    <strong className="text-xs text-slate-800 font-mono">{sensor.pm25} µg</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Temp</span>
                    <strong className="text-xs text-slate-800 font-mono">{sensor.temp}°C</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Humidity</span>
                    <strong className="text-xs text-slate-800 font-mono">{sensor.humidity}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-slate-400" /> {sensor.noiseDb} dB Acoustic
                </span>
                <span className="text-emerald-600 font-semibold">Ventilation Normal</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparative Chart and Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">AQI Index Comparison Across Campus Blocks</h3>
              <p className="text-xs text-slate-500">Real-time laser sensor particulate indices</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">CPCB Air Standard</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aqiChartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  formatter={(val: any) => [`AQI ${val}`, 'Air Quality Index']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="aqi" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Environmental Advisory */}
        <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-50/60 to-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Health & Comfort Advisory</h3>
                <p className="text-[11px] text-slate-500">Sarada Vihar Campus Ecology</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <strong className="block text-emerald-700 font-bold mb-0.5">Optimal Study Conditions</strong>
                Air quality is ideal for classroom concentration and athletic activities across all 10 campus acres.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <strong className="block text-slate-900 font-bold mb-0.5">Natural Tree Canopy Effect</strong>
                Surrounding green belts contribute to a 2.4°C thermal cooling buffer relative to downtown Bhubaneswar.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <strong className="block text-slate-900 font-bold mb-0.5">Smart HVAC Economizer</strong>
                Fresh outdoor air damper automatically opens when ambient air is &lt;25°C to save chiller electricity.
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">
              Sensor Node Firmware: v1.8.4 &bull; Calibration: Verified
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
