import React, { useState } from 'react';
import { Card, StatusBadge } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Settings, Clock, Zap, Droplets, Wind, Bell, 
  ShieldCheck, Cpu, Database, Save, CheckCircle2, Volume2, MapPin
} from 'lucide-react';

export default function AdminSettings() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Schedule settings
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [autoOffEnabled, setAutoOffEnabled] = useState(true);
  const [pirSensitivitySec, setPirSensitivitySec] = useState(60);

  // Thresholds
  const [energyMaxKw, setEnergyMaxKw] = useState(500);
  const [waterThresholdL, setWaterThresholdL] = useState(20000);
  const [aqiThreshold, setAqiThreshold] = useState(100);

  // Sound settings
  const [continuousSirenActive, setContinuousSirenActive] = useState(true);
  const [muteDuringLectures, setMuteDuringLectures] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Configuration & Automation Policy</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-900 text-white rounded-md uppercase">Admin Level 1</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Configure campus operating schedule (9AM - 6PM), PIR occupancy parameters & utility alert limits
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved & Deployed to IoT Gateway</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operating Schedule & Auto-Off Rules */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="font-bold text-base text-slate-900">Campus Operating Schedule & Auto-Off</h2>
                  <p className="text-xs text-slate-500">Automated switch shutdown policy at end of academic hours</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-1">
                      Campus Opening Time
                    </label>
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-1">
                      Operating Cutoff Time
                    </label>
                    <input 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block font-bold">Auto-Off at 6:00 PM Protocol</strong>
                    <span className="text-slate-500 text-[11px]">Automatically power down all active switches when schedule ends</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={autoOffEnabled}
                    onChange={(e) => setAutoOffEnabled(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    <span>Empty Classroom PIR Timeout</span>
                    <span className="text-primary-700 font-mono">{pirSensitivitySec} seconds</span>
                  </label>
                  <input 
                    type="range" 
                    min="30" 
                    max="300" 
                    step="15"
                    value={pirSensitivitySec}
                    onChange={(e) => setPirSensitivitySec(Number(e.target.value))}
                    className="w-full cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>30s (Instant Demo)</span>
                    <span>60s (Recommended)</span>
                    <span>300s (5 Minutes)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: <strong className="text-emerald-600">Active (09:00 - 18:00)</strong></span>
              <span className="text-slate-400 font-mono">Auto-Shutdown Armed</span>
            </div>
          </Card>

          {/* Alarm, Siren & Sound Policy */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Volume2 className="w-5 h-5 text-rose-600" />
                <div>
                  <h2 className="font-bold text-base text-slate-900">Security Siren & Acoustic Alarm Policy</h2>
                  <p className="text-xs text-slate-500">WebAudio emergency siren behavioral configuration</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-rose-900 block font-bold">Continuous Emergency Siren</strong>
                    <span className="text-rose-700 text-[11px]">Wails continuously when an empty classroom switch is turned ON</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={continuousSirenActive}
                    onChange={(e) => setContinuousSirenActive(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-emerald-900 block font-bold">Strict Classroom Lecture Mute</strong>
                    <span className="text-emerald-700 text-[11px]">Strictly mute all buzzer/siren sound when room is occupied</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={muteDuringLectures}
                    onChange={(e) => setMuteDuringLectures(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                    Campus Location
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Sarada Vihar, Madanpur, Bhubaneswar, Odisha
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Synthesizer: <strong className="text-slate-800">HTML5 WebAudio API</strong></span>
              <span className="text-emerald-600 font-semibold">Pitch: 950 Hz w/ LFO</span>
            </div>
          </Card>

          {/* Utility Thresholds */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="font-bold text-base text-slate-900">Utility Alert Threshold Limits</h2>
                <p className="text-xs text-slate-500">Automated warning triggers for campus operations</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="flex justify-between font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  <span>Campus Peak Power Threshold</span>
                  <span className="font-mono text-amber-600">{energyMaxKw} kW</span>
                </label>
                <input 
                  type="range" 
                  min="300" 
                  max="800" 
                  step="25"
                  value={energyMaxKw}
                  onChange={(e) => setEnergyMaxKw(Number(e.target.value))}
                  className="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  <span>Daily Water Consumption Alert Limit</span>
                  <span className="font-mono text-blue-600">{waterThresholdL.toLocaleString()} Litres</span>
                </label>
                <input 
                  type="range" 
                  min="10000" 
                  max="35000" 
                  step="1000"
                  value={waterThresholdL}
                  onChange={(e) => setWaterThresholdL(Number(e.target.value))}
                  className="w-full cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  <span>Indoor Air Quality (AQI) Warning Level</span>
                  <span className="font-mono text-emerald-600">AQI {aqiThreshold}</span>
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="200" 
                  step="10"
                  value={aqiThreshold}
                  onChange={(e) => setAqiThreshold(Number(e.target.value))}
                  className="w-full cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </Card>

          {/* Quick Actions & Zone Data Management Link */}
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Database className="w-5 h-5 text-purple-600" />
                <div>
                  <h2 className="font-bold text-base text-slate-900">Database & System Utilities</h2>
                  <p className="text-xs text-slate-500">Institutional record administration and export tools</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  type="button"
                  onClick={() => window.location.href = '/admin-data'}
                  className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl flex justify-between items-center transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-purple-600" />
                    <div>
                      <strong className="block text-xs text-purple-950 font-bold">Zone Facility Data Manager</strong>
                      <span className="text-[11px] text-purple-700">Add, edit, or remove live facility records</span>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-600 text-white font-bold px-2 py-1 rounded-lg">Open ↗</span>
                </button>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 block font-bold">Theme Appearance</strong>
                    <span className="text-slate-500 text-[11px]">Toggle dark mode across the platform</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isDarkMode} 
                    onChange={toggleDarkMode} 
                    className="w-4 h-4 rounded cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button 
                type="submit"
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save & Deploy System Configuration
              </button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
