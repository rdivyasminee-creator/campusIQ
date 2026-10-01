import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Zap, Droplets, Wind, Trash2, 
  Building2, Wrench, Bell, Map, BarChart3, Settings, Cpu, LogOut,
  Radio, ShieldCheck, ChevronRight
} from 'lucide-react';
import { cn } from './ui';

interface NavGroup {
  title: string;
  items: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: string;
    badgeColor?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'CORE OPERATIONS',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Executive Command' },
      { to: '/map', icon: Map, label: 'Campus Geospatial Map', badge: 'GPS', badgeColor: 'bg-emerald-100 text-emerald-800' },
    ]
  },
  {
    title: 'CAMPUS UTILITIES',
    items: [
      { to: '/energy', icon: Zap, label: 'Energy Monitoring', badge: 'Live', badgeColor: 'bg-amber-100 text-amber-800' },
      { to: '/water', icon: Droplets, label: 'Water Management' },
      { to: '/air-quality', icon: Wind, label: 'Air & Environment' },
      { to: '/waste', icon: Trash2, label: 'Waste Management' },
    ]
  },
  {
    title: 'SMART AUTOMATION',
    items: [
      { to: '/simulator', icon: Cpu, label: 'IoT Sensors & ESP32', badge: '20 Nodes', badgeColor: 'bg-purple-100 text-purple-800' },
    ]
  },
  {
    title: 'MANAGEMENT & AUDIT',
    items: [
      { to: '/assets', icon: Building2, label: 'Facility Assets' },
      { to: '/maintenance', icon: Wrench, label: 'Preventive Tickets' },
      { to: '/alerts', icon: Bell, label: 'Incident Alerts' },
      { to: '/reports', icon: BarChart3, label: 'ESG & Audit Reports', badge: 'CSV/PDF', badgeColor: 'bg-blue-100 text-blue-800' },
      { to: '/settings', icon: Settings, label: 'System Configuration' },
    ]
  }
];

export const Sidebar = ({ 
  isOpen, 
  onClose,
  onLogout
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogout?: () => void;
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden" onClick={onClose} />
      )}
      
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800/80 transform transition-transform duration-200 ease-in-out flex flex-col shadow-xl lg:shadow-none select-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="relative">
            <img 
              src="/logo.jpg" 
              alt="NIIS Logo" 
              className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white border border-slate-700 shadow-sm" 
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white tracking-wide">NIIS CampusIQ</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-primary-600/90 text-white rounded">v2.5</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium truncate">Smart Facility Management</span>
          </div>
        </div>

        {/* Live Connectivity Strip */}
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry Online</span>
          </div>
          <span className="text-slate-400 font-mono text-[10px]">3.0s Poll</span>
        </div>
        
        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {group.title}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className={({ isActive }) => cn(
                        "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150",
                        isActive 
                          ? "bg-primary-600 text-white shadow-sm shadow-primary-600/30" 
                          : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-tight flex-shrink-0",
                          item.badgeColor || "bg-slate-700 text-slate-200"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* System Health / Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2.5">
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                IoT Grid Health
              </span>
              <span className="text-emerald-400 font-bold font-mono">100% OK</span>
            </div>
            <div className="text-[10px] text-slate-400">
              20/20 Rooms Armed &bull; 6PM Auto-Off
            </div>
          </div>

          {onLogout ? (
            <button
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-700 rounded-xl border border-rose-800/50 transition-all shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out &bull; Login
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => window.innerWidth < 1024 && onClose()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Director Login
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};
