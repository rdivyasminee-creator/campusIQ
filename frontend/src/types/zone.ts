export interface IZoneRecord {
  _id: string;
  zoneName: string;
  electricityKwh: number;
  waterLitres: number;
  wasteKg: number;
  airQuality?: number | null;
  utilization: number;
  readingDateTime: string;
  status: 'Normal' | 'Warning' | 'Critical';
  notes?: string;
  source?: string;
  updatedAt?: string;
}

export interface IZoneSummary {
  totalElectricityKwh: number;
  totalWaterLitres: number;
  totalWasteKg: number;
  averageAirQuality: number | null;
  averageUtilization: number;
  overallStatus: 'Normal' | 'Warning' | 'Critical';
  activeAlertsCount: number;
  zoneCount: number;
  lastUpdated: string;
}

export interface IZonesApiResponse {
  success: boolean;
  source: string;
  databaseStatus: string;
  summary: IZoneSummary;
  zones: IZoneRecord[];
  error?: string;
}
