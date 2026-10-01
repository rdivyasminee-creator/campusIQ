import React, { useState } from 'react';
import { Card, StatusBadge } from '../components/ui';
import { 
  Wrench, Plus, Trash2, CheckCircle2, Clock, 
  AlertTriangle, Filter, User, Calendar, MapPin
} from 'lucide-react';

interface MaintenanceTicket {
  id: string;
  issue: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  category: 'Electrical' | 'HVAC' | 'Plumbing' | 'General';
  date: string;
  slaHoursLeft: number;
}

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'WO-1042',
    issue: 'Sub-panel breaker temperature calibration check',
    location: 'Sarada Vihar Substation Yard',
    priority: 'High',
    assignedTo: 'Er. Rajesh Panda (Lead Electrical)',
    status: 'In Progress',
    category: 'Electrical',
    date: '2026-10-01',
    slaHoursLeft: 6
  },
  {
    id: 'WO-1041',
    issue: 'Overhead water tank float switch sensitivity tuning',
    location: 'Academic Wing Rooftop (Level 4)',
    priority: 'Medium',
    assignedTo: 'Manoj Kumar (Plumbing Lead)',
    status: 'In Progress',
    category: 'Plumbing',
    date: '2026-09-30',
    slaHoursLeft: 18
  },
  {
    id: 'WO-1040',
    issue: 'IT Lab 2 AC air filter wash & refrigerant check',
    location: 'MCA IT Center 2nd Floor',
    priority: 'Medium',
    assignedTo: 'S. N. Mohanty (HVAC Tech)',
    status: 'Completed',
    category: 'HVAC',
    date: '2026-09-29',
    slaHoursLeft: 0
  },
  {
    id: 'WO-1039',
    issue: 'Ultrasonic bin sensor optical calibration',
    location: 'Cafeteria Courtyard',
    priority: 'Low',
    assignedTo: 'B. Rout (IoT Field Tech)',
    status: 'Completed',
    category: 'General',
    date: '2026-09-28',
    slaHoursLeft: 0
  },
  {
    id: 'WO-1038',
    issue: 'PIR motion sensor replacement in BCA Classroom 3',
    location: '2nd Floor BCA Wing',
    priority: 'High',
    assignedTo: 'Er. Rajesh Panda (Lead Electrical)',
    status: 'Pending',
    category: 'Electrical',
    date: '2026-10-01',
    slaHoursLeft: 12
  }
];

export default function Maintenance() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form state
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [category, setCategory] = useState<'Electrical' | 'HVAC' | 'Plumbing' | 'General'>('Electrical');
  const [assignedTo, setAssignedTo] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim() || !location.trim()) return;

    const newTicket: MaintenanceTicket = {
      id: `WO-${1043 + tickets.length}`,
      issue,
      location,
      priority,
      category,
      assignedTo: assignedTo.trim() || 'Facility Duty Engineer',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      slaHoursLeft: priority === 'High' ? 12 : 36
    };

    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setIssue('');
    setLocation('');
    setAssignedTo('');
  };

  const handleDelete = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const filteredTickets = filterPriority === 'All' 
    ? tickets 
    : tickets.filter(t => t.priority === filterPriority || t.status === filterPriority);

  const pendingCount = tickets.filter(t => t.status === 'Pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const completedCount = tickets.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Maintenance & Work Orders</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-md uppercase">SLA Active</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Preventive service schedules, automated ticket dispatch & facility maintenance logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Maintenance Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Work Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{pendingCount + inProgressCount}</span>
            <span className="text-xs font-semibold text-slate-400">Open Tickets</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-600 font-semibold">{pendingCount} Pending Dispatch</span>
            <span className="text-slate-400">{inProgressCount} Under Repair</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Resolution Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">97.4%</span>
            <span className="text-xs font-semibold text-slate-400">Within Standard</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">Average MTTR: <strong>3.2 hrs</strong></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">High-Priority Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">
              {tickets.filter(t => t.priority === 'High' && t.status !== 'Completed').length}
            </span>
            <span className="text-xs font-semibold text-slate-400">Critical Dispatch</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-rose-600 font-semibold">Immediate Action Required</span>
            <span className="text-slate-400">Escalated</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved This Cycle</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{completedCount}</span>
            <span className="text-xs font-semibold text-slate-400">Completed Audits</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">Verified by Facility Head</span>
            <span className="text-slate-400">Archived</span>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'High', 'In Progress', 'Pending', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterPriority(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                filterPriority === filter 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredTickets.length} of {tickets.length} Maintenance Work Orders
        </span>
      </div>

      {/* Tickets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="p-3.5 pl-4">Work Order</th>
                <th className="p-3.5">Issue Description</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Assigned Technician</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="p-3.5 font-medium text-slate-800 max-w-xs">{t.issue}</td>
                  <td className="p-3.5 text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{t.location}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      t.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{t.assignedTo}</td>
                  <td className="p-3.5">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value as any)}
                      className="px-2 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">Log New Facility Maintenance Ticket</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Issue Description</label>
                <input 
                  type="text" 
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g. Submersible pump contactor noise"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Facility Location</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Substation Yard"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">System Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC & Climate</option>
                    <option value="Plumbing">Plumbing & Water</option>
                    <option value="General">General Facility</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Priority Level</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low (Routine)</option>
                    <option value="Medium">Medium (48-hr SLA)</option>
                    <option value="High">High (Immediate SLA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Assigned Engineer</label>
                  <input 
                    type="text" 
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Er. Rajesh Panda"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
