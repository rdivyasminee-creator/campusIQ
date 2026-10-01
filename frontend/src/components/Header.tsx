import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Bell, BellRing, User, LogOut, AlertTriangle, AlertCircle, 
  ShieldCheck, CheckCircle2, X, Volume2, VolumeX, Power, 
  ArrowRight, ExternalLink, Zap, Clock, RefreshCw, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

interface HeaderAlert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'classroom' | 'energy' | 'schedule' | 'system';
  timestamp: string;
  roomId?: string;
  zoneId?: string;
  actionLabel?: string;
  isRead?: boolean;
}

const CLASSROOM_NAMES: Record<string, string> = {
  // Ground Floor
  'gf-md': 'MD Room 1 (Ground Floor)',
  'gf-office': 'Office Room 1 (Ground Floor)',
  'gf-reception': 'Reception 1 (Ground Floor)',
  'gf-account': 'Account Section 1 (Ground Floor)',
  'gf-ecell': 'E Cell 1 (Ground Floor)',
  // 1st Floor
  'f1-mca': 'MCA Classrooms (Floor 1)',
  'f1-mba': 'MBA Classrooms (Floor 1)',
  'f1-lib': 'Central Library 1 (Floor 1)',
  'f1-read': 'Reading Room 2 (Floor 1)',
  'f1-washb': 'Boys Washroom (Floor 1)',
  'f1-washg': 'Girls Washroom (Floor 1)',
  // 2nd Floor
  'f2-bca': 'BCA Classrooms (Floor 2)',
  'f2-bsc': 'BSc Classrooms (Floor 2)',
  'f2-bba': 'BBA Classrooms (Floor 2)',
  // Top Floor
  'tf-conf': 'Conference Hall (Floor 3)',
  'tf-store': 'Store Room 1 (Floor 3)',
  'tf-rest': 'Faculty Rest Room (Floor 3)',
  'tf-washb': 'Boys Washroom (Floor 3)',
  'tf-washg': 'Girls Washroom (Floor 3)',
  'tf-common': 'Common Room 1 (Floor 3)'
};

const CLASSROOM_IDS = Object.keys(CLASSROOM_NAMES);

export const Header = ({ onMenuClick, onLogout }: { onMenuClick: () => void; onLogout?: () => void }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Interactive alert modal dropdown state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'energy' | 'classroom'>('all');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  
  // Live Data State
  const [controls, setControls] = useState<Record<string, boolean>>({});
  const [occupancy, setOccupancy] = useState<Record<string, boolean>>({});
  const [energyAlerts, setEnergyAlerts] = useState<any[]>([]);
  const [manualAlerts, setManualAlerts] = useState<HeaderAlert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [isActionPending, setIsActionPending] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAlertOpen(false);
      }
    }
    if (isAlertOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAlertOpen]);

  // Fetch real-time schedule, controls, and energy telemetry
  const syncAlertData = async () => {
    try {
      // 1. Fetch Schedule & Controls
      const schedRes = await fetch('/api/schedule');
      if (schedRes.ok) {
        const schedData = await schedRes.json();
        if (schedData.controls) setControls(schedData.controls);
        if (schedData.schedule && schedData.schedule.occupancy) {
          setOccupancy(schedData.schedule.occupancy);
        }
      }

      // 2. Fetch Real-Time Energy Telemetry
      const energyRes = await fetch('/api/energy/zones');
      if (energyRes.ok) {
        const energyData = await energyRes.json();
        if (energyData.alerts && Array.isArray(energyData.alerts)) {
          setEnergyAlerts(energyData.alerts);
        }
      }

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      // Silently fail network hiccups
    }
  };

  useEffect(() => {
    syncAlertData();
    const interval = setInterval(syncAlertData, 3000);

    // Socket.io Real-Time Synchronization
    const socket = io('/', { transports: ['websocket', 'polling'] });

    socket.on('controls_updated', (data: { controls: Record<string, boolean> }) => {
      if (data && data.controls) setControls(data.controls);
    });

    socket.on('occupancy_updated', (data: { roomId: string, isOccupied: boolean }) => {
      if (data && data.roomId) {
        setOccupancy(prev => ({ ...prev, [data.roomId]: data.isOccupied }));
      }
    });

    socket.on('energy_telemetry', (data: any) => {
      if (data && data.alerts && Array.isArray(data.alerts)) {
        setEnergyAlerts(data.alerts);
      }
    });

    socket.on('empty_classroom_siren_alert', (data: { roomId: string, message: string, timestamp: string }) => {
      const roomName = CLASSROOM_NAMES[data.roomId] || data.roomId;
      const newAlert: HeaderAlert = {
        id: `siren-${data.roomId}-${Date.now()}`,
        title: `🚨 Empty Classroom Siren Active: ${roomName}`,
        message: data.message || `Motion sensor verified zero occupancy while lights/AC switch is ON. Emergency siren wailing!`,
        severity: 'critical',
        category: 'classroom',
        timestamp: data.timestamp || new Date().toLocaleTimeString(),
        roomId: data.roomId,
        actionLabel: 'Turn OFF Switch'
      };
      setManualAlerts(prev => [newAlert, ...prev.filter(a => a.roomId !== data.roomId)].slice(0, 15));
    });

    socket.on('auto_off_event', (data: { type: string, message: string, timestamp: string }) => {
      const newAlert: HeaderAlert = {
        id: `auto-off-${Date.now()}`,
        title: data.type === 'schedule_end' ? '⚡ 6:00 PM Operating Schedule Cutoff' : '⏱️ Auto-Off Timer Executed',
        message: data.message,
        severity: 'info',
        category: 'schedule',
        timestamp: data.timestamp || new Date().toLocaleTimeString()
      };
      setManualAlerts(prev => [newAlert, ...prev].slice(0, 15));
    });

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Compute live active alerts
  const computedAlerts: HeaderAlert[] = [];

  // 1. Check for Active Loads in EMPTY Classrooms
  CLASSROOM_IDS.forEach(id => {
    const isOccupied = occupancy[id] ?? true;
    const isOn = controls[id] ?? false;
    if (isOn && !isOccupied) {
      const alertId = `empty-room-${id}`;
      if (!dismissedIds.has(alertId)) {
        const roomName = CLASSROOM_NAMES[id] || id;
        computedAlerts.push({
          id: alertId,
          title: `Empty Room Violation: ${roomName}`,
          message: `PIR sensor detects ${roomName} is NOT IN USE with switch ON. 4-second auto switch-off engaging automatically (No manual off needed)!`,
          severity: 'critical',
          category: 'classroom',
          timestamp: 'Active Now',
          roomId: id,
          actionLabel: 'Auto-Off in 4s'
        });
      }
    }
  });

  // 2. Add Real-Time Energy Threshold Alerts
  energyAlerts.forEach((ea, idx) => {
    const alertId = `energy-alert-${ea.zoneId || idx}`;
    if (!dismissedIds.has(alertId)) {
      computedAlerts.push({
        id: alertId,
        title: `${ea.zoneName || 'Campus Zone'}: High Energy Exceeded`,
        message: ea.message || `Consuming ${ea.powerKw} kW (Exceeds ${ea.thresholdKw} kW configured limit)`,
        severity: ea.severity === 'critical' ? 'critical' : 'warning',
        category: 'energy',
        timestamp: ea.timestamp ? new Date(ea.timestamp).toLocaleTimeString() : 'Live',
        zoneId: ea.zoneId,
        actionLabel: 'Inspect Zone'
      });
    }
  });

  // 3. Merge with manual alerts
  const allAlerts = [
    ...computedAlerts,
    ...manualAlerts.filter(a => !dismissedIds.has(a.id))
  ];

  // Filtering
  const filteredAlerts = allAlerts.filter(a => {
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'energy') return a.category === 'energy';
    if (filter === 'classroom') return a.category === 'classroom';
    return true;
  });

  const criticalCount = allAlerts.filter(a => a.severity === 'critical').length;
  const unreadCount = allAlerts.length;

  // Actions
  const handleTurnOffRoomSwitch = async (roomId: string) => {
    setIsActionPending(true);
    try {
      const updated = { ...controls, [roomId]: false };
      setControls(updated);
      await fetch('/api/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, isOn: false })
      });
      // Mark alert dismissed
      setDismissedIds(prev => new Set(prev).add(`empty-room-${roomId}`));
    } catch (e) {} finally {
      setIsActionPending(false);
    }
  };

  const handleSweepEmptyClassrooms = async () => {
    setIsActionPending(true);
    try {
      await fetch('/api/occupancy/sweep', { method: 'POST' });
      await syncAlertData();
    } catch (e) {} finally {
      setIsActionPending(false);
    }
  };

  const handleDismissAlert = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  const handleClearAllAlerts = () => {
    const allIds = allAlerts.map(a => a.id);
    setDismissedIds(new Set([...Array.from(dismissedIds), ...allIds]));
  };

  const handleAddDemoAlert = () => {
    const demoId = `demo-${Date.now()}`;
    const sample: HeaderAlert = {
      id: demoId,
      title: '🚨 Demo Alert: Science Lab Power Surge',
      message: 'Simulated IoT telemetry alert: Laboratory electrical sub-panel detected high inductive spike (26.8 kW).',
      severity: 'critical',
      category: 'energy',
      timestamp: new Date().toLocaleTimeString(),
      actionLabel: 'Inspect Zone'
    };
    setManualAlerts(prev => [sample, ...prev]);
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-md"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-900">NIIS Campus Intelligence Dashboard</h1>
          <p className="text-xs text-gray-500">Sustainable Campus & Facilities Management</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-gray-900">NIIS Institute of Business Administration</div>
          <div className="text-xs text-gray-500">Madanpur, Bhubaneswar</div>
        </div>
        
        {/* AI Autopilot Toggle */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-md">
          <span className="text-sm font-semibold text-purple-700">AI Autopilot</span>
          <label className="relative inline-flex items-center cursor-pointer" title="Toggle AI Autonomous Energy Optimization">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              onChange={(e) => alert(e.target.checked ? "AI Autopilot Enabled: System will now autonomously optimize energy and auto-resolve minor alerts." : "AI Autopilot Disabled.")} 
            />
            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Quick Action Button */}
        <button 
          className="hidden md:flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md text-sm font-medium transition shadow-sm"
          onClick={() => {
            setIsAlertOpen(true);
          }}
          title="Open Campus Live Alerts Center"
        >
          <span className="mr-1">⚡</span> Quick Alerts
        </button>
        
        {/* ========================================================= */}
        {/* WORKABLE ALERT SYMBOL IN TOP (WITH INTERACTIVE DROPDOWN) */}
        {/* ========================================================= */}
        <div className="relative" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setIsAlertOpen(prev => !prev)}
            className={`relative p-2.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isAlertOpen 
                ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-400' 
                : unreadCount > 0 
                ? 'text-gray-700 hover:bg-rose-50 hover:text-rose-600' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            title={`Campus Facility Alerts: ${unreadCount} active notification(s). Click to view.`}
            aria-expanded={isAlertOpen}
          >
            {unreadCount > 0 ? (
              <BellRing className={`w-5 h-5 ${criticalCount > 0 ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
            ) : (
              <Bell className="w-5 h-5" />
            )}

            {/* Glowing Badge Counter */}
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-md ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-rose-400 opacity-60 animate-ping pointer-events-none"></span>
              </>
            )}
          </button>

          {/* INTERACTIVE WORKABLE ALERT DROPDOWN MODAL */}
          {isAlertOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 md:w-[440px] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
              
              {/* Dropdown Header */}
              <div className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-500/30 text-rose-300 ring-1 ring-rose-400/50' : 'bg-primary-500/30 text-primary-300'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm flex items-center gap-2">
                      <span>Campus Facility Alerts</span>
                      {criticalCount > 0 ? (
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">
                          {criticalCount} Critical
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                          Normal
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-300 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Real-time IoT Feed &bull; Updated {lastRefreshed}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsSoundMuted(!isSoundMuted)}
                    className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-lg transition"
                    title={isSoundMuted ? 'Unmute Audio Alert Chime' : 'Mute Audio Alert Chime'}
                  >
                    {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAlertOpen(false)}
                    className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-lg transition"
                    title="Close alerts menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Test Action */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                      filter === 'all' 
                        ? 'bg-gray-900 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-200/70'
                    }`}
                  >
                    All ({allAlerts.length})
                  </button>
                  <button
                    onClick={() => setFilter('critical')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] flex items-center gap-1 ${
                      filter === 'critical' 
                        ? 'bg-rose-600 text-white shadow-sm' 
                        : 'text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    Critical ({allAlerts.filter(a => a.severity === 'critical').length})
                  </button>
                  <button
                    onClick={() => setFilter('classroom')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                      filter === 'classroom' 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Classrooms
                  </button>
                  <button
                    onClick={() => setFilter('energy')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                      filter === 'energy' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    Energy
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddDemoAlert}
                  className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-[10px] font-bold shadow-xs transition flex items-center gap-1 flex-shrink-0"
                  title="Click to generate an interactive test alert for demonstration"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  + Test Alert
                </button>
              </div>

              {/* Alert Items List */}
              <div className="max-h-[340px] overflow-y-auto p-3 space-y-2.5 divide-y divide-gray-100">
                {filteredAlerts.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
                    <div className="text-sm font-bold text-gray-900">Zero Active Facility Alerts</div>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                      All 23 campus rooms, 5 energy blocks, and occupancy sensors are within safe thresholds.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddDemoAlert}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Generate Test Alert for Presentation
                    </button>
                  </div>
                ) : (
                  filteredAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`pt-2.5 first:pt-0 p-3 rounded-xl border transition-all ${
                        alert.severity === 'critical'
                          ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                          : alert.severity === 'warning'
                          ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                          : 'bg-blue-50/60 border-blue-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          {alert.severity === 'critical' ? (
                            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          ) : alert.severity === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="text-xs font-black text-gray-900 leading-snug">
                              {alert.title}
                            </div>
                            <p className="text-[11px] text-gray-600 font-medium mt-0.5 leading-relaxed">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400 font-semibold">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" /> {alert.timestamp}
                              </span>
                              <span>&bull;</span>
                              <span className="capitalize">{alert.category}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDismissAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200/50 rounded-md transition"
                          title="Dismiss this notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* WORKABLE ALERT ACTION BUTTON */}
                      {alert.roomId && (
                        <div className="mt-2.5 pt-2 border-t border-rose-200/70 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-rose-800 font-bold">Action Needed:</span>
                          <button
                            type="button"
                            disabled={isActionPending}
                            onClick={() => handleTurnOffRoomSwitch(alert.roomId!)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-lg text-[11px] font-extrabold shadow-sm transition flex items-center gap-1.5"
                            title="Turn off switch directly from this notification and stop siren"
                          >
                            <Power className="w-3 h-3" />
                            Turn OFF Switch (Silence Siren)
                          </button>
                        </div>
                      )}

                      {alert.category === 'energy' && alert.zoneId && (
                        <div className="mt-2.5 pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-amber-800 font-bold">Zone Threshold Breach:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAlertOpen(false);
                              navigate('/energy');
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-lg text-[11px] font-extrabold shadow-sm transition flex items-center gap-1.5"
                          >
                            <Zap className="w-3 h-3" />
                            Inspect Energy Monitor ↗
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Quick Action Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSweepEmptyClassrooms}
                    disabled={isActionPending}
                    className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[11px] shadow-sm transition flex items-center gap-1"
                    title="Auto-turn off all empty classrooms across campus"
                  >
                    <Power className="w-3 h-3" />
                    🧹 Sweep Empty Rooms
                  </button>
                  {allAlerts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllAlerts}
                      className="px-2 py-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg text-[11px] font-semibold transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAlertOpen(false);
                    navigate('/alerts');
                  }}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-[11px] font-bold shadow-sm transition flex items-center gap-1"
                >
                  Full Alerts Page
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">Admin</div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="ml-2 px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg border border-rose-200 transition-all flex items-center gap-1 shadow-sm"
              title="Sign Out / Back to Login"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
