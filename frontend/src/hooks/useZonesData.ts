import { useState, useEffect, useCallback } from 'react';
import { IZoneRecord, IZoneSummary, IZonesApiResponse } from '../types/zone';

export function useZonesData(pollingIntervalMs: number = 3000) {
  const [zones, setZones] = useState<IZoneRecord[]>([]);
  const [summary, setSummary] = useState<IZoneSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseSource, setDatabaseSource] = useState<string>('connecting');
  const [databaseStatus, setDatabaseStatus] = useState<string>('Initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch('/api/zones');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data: IZonesApiResponse = await res.json();
      if (data.success) {
        setZones(data.zones || []);
        setSummary(data.summary || null);
        setDatabaseSource(data.source);
        setDatabaseStatus(data.databaseStatus);
        setError(null);
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to retrieve zone data');
      }
    } catch (err: any) {
      console.error('[useZonesData] Fetch failed:', err);
      setError(err.message || 'Error communicating with backend API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchZones, pollingIntervalMs]);

  // Create or Upsert Zone
  const saveZone = async (zoneData: Partial<IZoneRecord>) => {
    try {
      const res = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoneData)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, errors: result.errors || [result.message || 'Validation error'] };
      }
      await fetchZones();
      return { success: true, record: result.record };
    } catch (err: any) {
      return { success: false, errors: [err.message || 'Network error'] };
    }
  };

  // Update existing zone
  const updateZone = async (id: string, zoneData: Partial<IZoneRecord>) => {
    try {
      const res = await fetch(`/api/zones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoneData)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, errors: result.errors || [result.message || 'Validation error'] };
      }
      await fetchZones();
      return { success: true, record: result.record };
    } catch (err: any) {
      return { success: false, errors: [err.message || 'Network error'] };
    }
  };

  // Delete zone
  const deleteZone = async (id: string) => {
    try {
      const res = await fetch(`/api/zones/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.message || 'Failed to delete' };
      }
      await fetchZones();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Seed / Reset sample records
  const seedSampleZones = async () => {
    try {
      const res = await fetch('/api/zones/seed', { method: 'POST' });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.message };
      }
      await fetchZones();
      return { success: true, count: result.count };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Clear all zones for production manual entry
  const clearAllZones = async () => {
    try {
      const res = await fetch('/api/zones', { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.message };
      }
      await fetchZones();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    zones,
    summary,
    loading,
    error,
    databaseSource,
    databaseStatus,
    lastRefreshed,
    refetch: fetchZones,
    saveZone,
    updateZone,
    deleteZone,
    seedSampleZones,
    clearAllZones
  };
}
