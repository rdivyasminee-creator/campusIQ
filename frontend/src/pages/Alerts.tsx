import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusBadge } from '../components/ui';
import { useZonesData } from '../hooks/useZonesData';
import { AlertCircle, CheckCircle, Database, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const { zones, summary, loading, lastRefreshed } = useZonesData(2500);

  // Derive dynamic alerts directly from real database zone statuses
  const warningOrCriticalZones = zones.filter(z => z.status === 'Critical' || z.status === 'Warning');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Campus Facility Alerts</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Real-time notifications generated from zone operational statuses &bull; Admin-managed database
          </p>
        </div>
        <button
          onClick={() => navigate('/admin-data')}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
        >
          <Database className="w-3.5 h-3.5" />
          Manage Facility Statuses
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-2 border-gray-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Active Alerts</div>
          <div className="text-3xl font-black text-rose-600">{loading ? "..." : warningOrCriticalZones.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">Requiring administrative attention</div>
        </Card>
        <Card className="p-4 border-2 border-gray-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Overall Campus Status</div>
          <div className="mt-1"><StatusBadge status={summary?.overallStatus ?? 'Normal'} /></div>
          <div className="text-[11px] text-gray-400 mt-2">Worst-case zone status</div>
        </Card>
        <Card className="p-4 border-2 border-gray-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Last Database Scan</div>
          <div className="text-base font-bold text-gray-800">{lastRefreshed.toLocaleTimeString()}</div>
          <div className="text-[11px] text-gray-400 mt-1">Synchronized every 2.5 seconds</div>
        </Card>
      </div>

      <div className="space-y-4">
        {warningOrCriticalZones.length === 0 ? (
          <Card className="p-8 text-center bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-emerald-950">All Campus Zones Operating Normally</h3>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
              No active warnings or critical alerts. All monitored zones are within standard parameters.
            </p>
          </Card>
        ) : (
          warningOrCriticalZones.map((zone) => (
            <Card 
              key={zone._id} 
              className={`p-5 border-l-4 ${
                zone.status === 'Critical' ? 'border-l-rose-500 bg-rose-50/30' : 'border-l-amber-500 bg-amber-50/30'
              } border-2 border-gray-200 rounded-2xl shadow-sm`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                    zone.status === 'Critical' ? 'text-rose-600' : 'text-amber-600'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">{zone.zoneName}</h3>
                      <StatusBadge status={zone.status} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 font-medium">
                      {zone.notes || `Facility flagged as ${zone.status}. Electricity: ${zone.electricityKwh} kWh, Water: ${zone.waterLitres} L, Utilization: ${zone.utilization}%.`}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-gray-500">
                      <span>Recorded: {zone.readingDateTime ? new Date(zone.readingDateTime).toLocaleString() : 'Recent'}</span>
                      <span>&bull;</span>
                      <span>Source: {zone.source || 'Admin Log'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/admin-data')}
                  className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 shadow-sm transition flex items-center gap-1.5 self-start"
                >
                  Inspect & Update Zone ↗
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
