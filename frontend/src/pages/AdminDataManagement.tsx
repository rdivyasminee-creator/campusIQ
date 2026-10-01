import React, { useState } from 'react';
import { Card, StatusBadge } from '../components/ui';
import { useZonesData } from '../hooks/useZonesData';
import { IZoneRecord } from '../types/zone';
import { 
  Database, PlusCircle, Edit3, Trash2, RefreshCw, CheckCircle2, 
  AlertCircle, Building2, Zap, Droplets, Trash, Wind, Percent, 
  Calendar, Info, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function AdminDataManagement() {
  const { 
    zones, 
    summary, 
    loading, 
    error, 
    databaseSource, 
    databaseStatus, 
    lastRefreshed, 
    refetch, 
    saveZone, 
    updateZone, 
    deleteZone, 
    seedSampleZones, 
    clearAllZones 
  } = useZonesData(2500);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    zoneName: '',
    electricityKwh: '',
    waterLitres: '',
    wasteKg: '',
    airQuality: '',
    utilization: '',
    readingDateTime: new Date().toISOString().slice(0, 16),
    status: 'Normal' as 'Normal' | 'Warning' | 'Critical',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      zoneName: '',
      electricityKwh: '',
      waterLitres: '',
      wasteKg: '',
      airQuality: '',
      utilization: '',
      readingDateTime: new Date().toISOString().slice(0, 16),
      status: 'Normal',
      notes: ''
    });
    setFormErrors([]);
  };

  // Populate form for editing
  const handleEdit = (zone: IZoneRecord) => {
    setEditingId(zone._id);
    setFormData({
      zoneName: zone.zoneName,
      electricityKwh: String(zone.electricityKwh),
      waterLitres: String(zone.waterLitres),
      wasteKg: String(zone.wasteKg),
      airQuality: zone.airQuality !== null && zone.airQuality !== undefined ? String(zone.airQuality) : '',
      utilization: String(zone.utilization),
      readingDateTime: zone.readingDateTime ? new Date(zone.readingDateTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      status: zone.status,
      notes: zone.notes || ''
    });
    setFormErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-Side Validation
  const validateInputs = () => {
    const errors: string[] = [];

    if (!formData.zoneName.trim()) {
      errors.push('Zone Name is required.');
    }

    if (formData.electricityKwh.trim() === '' || isNaN(Number(formData.electricityKwh))) {
      errors.push('Electricity consumption must be a valid number.');
    } else if (Number(formData.electricityKwh) < 0) {
      errors.push('Electricity consumption cannot be negative.');
    }

    if (formData.waterLitres.trim() === '' || isNaN(Number(formData.waterLitres))) {
      errors.push('Water consumption must be a valid number.');
    } else if (Number(formData.waterLitres) < 0) {
      errors.push('Water consumption cannot be negative.');
    }

    if (formData.wasteKg.trim() === '' || isNaN(Number(formData.wasteKg))) {
      errors.push('Waste quantity must be a valid number.');
    } else if (Number(formData.wasteKg) < 0) {
      errors.push('Waste quantity cannot be negative.');
    }

    if (formData.airQuality.trim() !== '') {
      if (isNaN(Number(formData.airQuality)) || Number(formData.airQuality) < 0) {
        errors.push('Air quality (AQI) must be a non-negative number if specified.');
      }
    }

    if (formData.utilization.trim() === '' || isNaN(Number(formData.utilization))) {
      errors.push('Asset/Room utilization percentage is required.');
    } else {
      const util = Number(formData.utilization);
      if (util < 0 || util > 100) {
        errors.push('Utilization must be between 0% and 100%.');
      }
    }

    return errors;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    const errors = validateInputs();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]);
    setSubmitting(true);

    const payload = {
      zoneName: formData.zoneName.trim(),
      electricityKwh: Number(formData.electricityKwh),
      waterLitres: Number(formData.waterLitres),
      wasteKg: Number(formData.wasteKg),
      airQuality: formData.airQuality.trim() !== '' ? Number(formData.airQuality) : null,
      utilization: Number(formData.utilization),
      readingDateTime: new Date(formData.readingDateTime).toISOString(),
      status: formData.status,
      notes: formData.notes.trim()
    };

    let result;
    if (editingId) {
      result = await updateZone(editingId, payload);
    } else {
      result = await saveZone(payload);
    }

    setSubmitting(false);

    if (result.success) {
      setSuccessMessage(editingId ? `Zone "${payload.zoneName}" updated successfully!` : `Zone "${payload.zoneName}" recorded into database!`);
      resetForm();
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setFormErrors(result.errors || ['Failed to save zone record.']);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete zone "${name}"? This will immediately recalculate dashboard figures.`)) {
      const res = await deleteZone(id);
      if (res.success) {
        setSuccessMessage(`Zone "${name}" deleted.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    }
  };

  // Reset to Sample Demo Data
  const handleSeed = async () => {
    if (window.confirm('Restore realistic campus sample zones? This will reset the zone records to verified initial demonstration values.')) {
      setSubmitting(true);
      const res = await seedSampleZones();
      setSubmitting(false);
      if (res.success) {
        setSuccessMessage('Initial realistic campus records restored in database.');
        resetForm();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    }
  };

  // Clear all
  const handleClear = async () => {
    if (window.confirm('Are you sure you want to delete ALL zone records? This clears all campus records for fresh manual data entry.')) {
      setSubmitting(true);
      const res = await clearAllZones();
      setSubmitting(false);
      if (res.success) {
        setSuccessMessage('All zone records cleared. Database is empty and ready for fresh input.');
        resetForm();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context Note */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border-2 border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 text-primary-700 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Facility Data Manager</h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Direct Zone-Based Facility Log &bull; Sensorless Prototype &bull; Real-Time Database Sync
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Database Connection Pill */}
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border bg-emerald-50 text-emerald-800 border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Local Facility Database Active
          </div>

          <button
            onClick={() => refetch()}
            className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            title="Refresh from Database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sensorless Prototype Notice Card */}
      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950 text-sm">
            Operational Note: Manual Administrative Facility Entry
          </p>
          <p className="text-amber-800 leading-relaxed">
            This deployment functions as a <strong>sensorless prototype</strong>. Data shown across the dashboard is strictly driven by the real records entered below by campus administrators. No fake or randomly simulated data is generated. All updates entered here immediately propagate to the live dashboard KPI cards, facility charts, and zone health indicators.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-2xl text-sm font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {successMessage}
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs uppercase font-black">
            Dismiss
          </button>
        </div>
      )}

      {/* Form Error Notification */}
      {formErrors.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 text-rose-900 p-4 rounded-2xl text-xs space-y-1 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-950">
            <AlertCircle className="w-5 h-5 text-rose-600" /> Please correct the following inputs:
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2 font-medium">
            {formErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid: Form (Left) & Real-Time Aggregates (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADD / EDIT ZONE FORM */}
        <Card className="lg:col-span-2 p-6 border-2 border-gray-200 shadow-md">
          <div className="flex justify-between items-center pb-4 mb-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                {editingId ? <Edit3 className="w-5 h-5 text-primary-600" /> : <PlusCircle className="w-5 h-5 text-primary-600" />}
                {editingId ? 'Edit Facility Zone Reading' : 'Log New Facility Zone Reading'}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {editingId ? `Editing existing record (ID: ${editingId})` : 'Enter verified campus meter and inspection metrics'}
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Zone Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Zone / Facility Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Academic Block A, IT Lab & Innovation Wing, Student Hostel B"
                  value={formData.zoneName}
                  onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Consumption Inputs 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Electricity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Electricity (kWh) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="e.g. 420.5"
                  value={formData.electricityKwh}
                  onChange={(e) => setFormData({ ...formData, electricityKwh: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
                />
                <span className="text-[11px] text-gray-400 font-medium">Submeter reading in kilowatt-hours</span>
              </div>

              {/* Water */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" /> Water Consumption (Litres) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  placeholder="e.g. 2400"
                  value={formData.waterLitres}
                  onChange={(e) => setFormData({ ...formData, waterLitres: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
                />
                <span className="text-[11px] text-gray-400 font-medium">Flow meter reading in litres</span>
              </div>

              {/* Waste */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Trash className="w-3.5 h-3.5 text-rose-500" /> Waste Quantity (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="e.g. 45.0"
                  value={formData.wasteKg}
                  onChange={(e) => setFormData({ ...formData, wasteKg: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
                />
                <span className="text-[11px] text-gray-400 font-medium">Custodial log in kilograms</span>
              </div>

              {/* Air Quality (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-emerald-500" /> Air Quality (AQI)</span>
                  <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Leave empty if no air sensor"
                  value={formData.airQuality}
                  onChange={(e) => setFormData({ ...formData, airQuality: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
                />
                <span className="text-[11px] text-gray-400 font-medium">Sensorless default: leave blank</span>
              </div>
            </div>

            {/* Utilization & Status & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Utilization */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-purple-500" /> Asset Utilization (%) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  required
                  placeholder="0 - 100%"
                  value={formData.utilization}
                  onChange={(e) => setFormData({ ...formData, utilization: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Operational Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-bold"
                >
                  <option value="Normal">🟢 Normal (Eco / Standard)</option>
                  <option value="Warning">🟡 Warning (Elevated Draw)</option>
                  <option value="Critical">🔴 Critical (Immediate Action)</option>
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" /> Reading Timestamp
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.readingDateTime}
                  onChange={(e) => setFormData({ ...formData, readingDateTime: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Facility Notes / Maintenance Context (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Scheduled lab exams ongoing; high computer usage expected."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition font-medium"
              />
            </div>

            {/* Submit & Reset Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                {editingId ? 'Save Zone Updates' : 'Commit Zone Record to Database'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Clear Form
              </button>
            </div>
          </form>
        </Card>

        {/* REAL-TIME AGGREGATE SUMMARY & CONTROLS */}
        <div className="space-y-6">
          <Card className="p-5 border-2 border-gray-200 shadow-md bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Live Database Aggregates
            </h3>
            
            {summary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Total Zones Monitored</span>
                  <span className="font-black text-gray-900 text-sm">{summary.zoneCount} Zones</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Campus Total Electricity</span>
                  <span className="font-black text-amber-600 text-sm">{summary.totalElectricityKwh} kWh</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Campus Total Water</span>
                  <span className="font-black text-blue-600 text-sm">{summary.totalWaterLitres.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Campus Total Waste</span>
                  <span className="font-black text-rose-600 text-sm">{summary.totalWasteKg} kg</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Average Air Quality</span>
                  <span className="font-black text-emerald-600 text-sm">
                    {summary.averageAirQuality !== null ? `AQI ${summary.averageAirQuality}` : 'Sensorless / N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Average Room Utilization</span>
                  <span className="font-black text-purple-600 text-sm">{summary.averageUtilization}%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-xs">
                  <span className="text-gray-600 font-medium">Campus Health Status</span>
                  <StatusBadge status={summary.overallStatus} />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">Connecting to database...</div>
            )}
          </Card>

          {/* Quick Initial Database Controls */}
          <Card className="p-5 border-2 border-gray-200 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Demonstration Database Tools
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Use these tools to toggle between demonstration sample zones and a clean, empty state ready for manual facility auditing.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleSeed}
                disabled={submitting}
                className="w-full py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-800 border border-primary-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary-600" />
                Reset Realistic Sample Zones
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={submitting}
                className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Clear All Records (Empty State)
              </button>
            </div>
          </Card>

          {/* IoT-Ready Notice */}
          <Card className="p-4 bg-gray-900 text-gray-200 border-2 border-gray-800 rounded-xl text-xs space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>IoT Sensor Integration Ready</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Future ESP32 microcontrollers or hardware gateways can POST telemetry readings directly to <code className="text-amber-300 bg-gray-800 px-1 py-0.5 rounded">/api/iot/zone-reading</code>. The dashboard will automatically reflect sensor readings without code changes.
            </p>
          </Card>
        </div>
      </div>

      {/* ZONE RECORDS DIRECTORY TABLE */}
      <Card className="p-6 border-2 border-gray-200 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 mb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-black text-gray-900">Campus Facility Zone Records</h2>
            <p className="text-xs text-gray-500 font-medium">
              Showing {zones.length} zone(s) saved in database &bull; Auto-syncing in real time
            </p>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Last polled: {lastRefreshed.toLocaleTimeString()}
          </div>
        </div>

        {zones.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No Zone Facility Records Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto mb-4">
              The database is currently clean and empty. Log your first facility reading above, or load the realistic sample demo records.
            </p>
            <button
              onClick={handleSeed}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-700 transition"
            >
              Load Realistic Sample Zones
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Zone / Facility</th>
                  <th className="py-3 px-3">Electricity</th>
                  <th className="py-3 px-3">Water</th>
                  <th className="py-3 px-3">Waste</th>
                  <th className="py-3 px-3">Air Quality</th>
                  <th className="py-3 px-3">Utilization</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reading Time</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {zones.map((zone) => (
                  <tr key={zone._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-gray-900 text-sm">{zone.zoneName}</div>
                      {zone.notes && (
                        <div className="text-[11px] text-gray-500 truncate max-w-xs">{zone.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-amber-700">
                      {zone.electricityKwh} <span className="text-[10px] text-gray-400 font-normal">kWh</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-blue-700">
                      {zone.waterLitres.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">L</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-rose-700">
                      {zone.wasteKg} <span className="text-[10px] text-gray-400 font-normal">kg</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-700">
                      {zone.airQuality !== null && zone.airQuality !== undefined ? `AQI ${zone.airQuality}` : '—'}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-purple-700">
                      {zone.utilization}%
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={zone.status} />
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 text-[11px]">
                      {zone.readingDateTime ? new Date(zone.readingDateTime).toLocaleDateString() + ' ' + new Date(zone.readingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(zone)}
                          className="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition"
                          title="Edit Zone Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(zone._id, zone.zoneName)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Zone Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
