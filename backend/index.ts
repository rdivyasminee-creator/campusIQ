import 'dotenv/config';
import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { INITIAL_SAMPLE_ZONES } from './seeds/initialZones';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- LOCAL DATA PERSISTENCE ENGINE (NO MONGODB ATLAS) ---
const DATA_DIR = path.join(__dirname, 'data');
const ZONES_FILE = path.join(DATA_DIR, 'zones.json');
const CONTROLS_FILE = path.join(DATA_DIR, 'controls.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interface for Zone Record
export interface IZoneRecord {
  _id: string;
  zoneName: string;
  electricityKwh: number;
  waterLitres: number;
  wasteKg: number;
  airQuality?: number | null;
  utilization: number;
  readingDateTime: string | Date;
  status: 'Normal' | 'Warning' | 'Critical';
  notes?: string;
  source?: string;
  updatedAt: string | Date;
}

// Load Zones from Local File or Initialize with Sample Zones
let localZones: IZoneRecord[] = [];

function loadZones(): IZoneRecord[] {
  try {
    if (fs.existsSync(ZONES_FILE)) {
      const content = fs.readFileSync(ZONES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Storage] Error reading zones.json, re-initializing sample records.');
  }

  // Initial demonstration sample records
  const initial = INITIAL_SAMPLE_ZONES.map((z, idx) => ({
    _id: `zone-${idx + 1}`,
    ...z,
    readingDateTime: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  saveZones(initial);
  return initial;
}

function saveZones(zonesToSave: IZoneRecord[]) {
  try {
    fs.writeFileSync(ZONES_FILE, JSON.stringify(zonesToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error persisting to zones.json:', err);
  }
}

localZones = loadZones();

// Load Controls
let localControls: Record<string, boolean> = {};
try {
  if (fs.existsSync(CONTROLS_FILE)) {
    localControls = JSON.parse(fs.readFileSync(CONTROLS_FILE, 'utf-8'));
  }
} catch (e) {
  localControls = {};
}

function saveControls(controlsToSave: Record<string, boolean>) {
  try {
    fs.writeFileSync(CONTROLS_FILE, JSON.stringify(controlsToSave, null, 2), 'utf-8');
  } catch (e) {}
}

// --- FACILITY OPERATING SCHEDULE & EMPTY CLASSROOM DETECTOR CONFIG ---
const SCHEDULE_FILE = path.join(DATA_DIR, 'schedule_config.json');

export interface IScheduleConfig {
  startTime: string; // e.g. "09:00" (9:00 AM)
  endTime: string;   // e.g. "16:00" (4:00 PM)
  autoOffAtEndTime: boolean;
  emptyClassroomDetectorActive: boolean;
  autoOffTimerActive: boolean;
  autoOffTimerEndsAt: number | null; // ms timestamp
  autoOffTimerDurationSec: number;
  occupancy: Record<string, boolean>; // roomId -> isOccupied
}

const DEFAULT_SCHEDULE_CONFIG: IScheduleConfig = {
  startTime: '09:00',
  endTime: '18:00',
  autoOffAtEndTime: true,
  emptyClassroomDetectorActive: true,
  autoOffTimerActive: false,
  autoOffTimerEndsAt: null,
  autoOffTimerDurationSec: 0,
  occupancy: {
    'gf-md': true,
    'gf-office': true,
    'gf-reception': true,
    'gf-account': false,
    'gf-ecell': false,
    'f1-mca': false,
    'f1-mba': true,
    'f1-lib': true,
    'f1-read': false,
    'f1-washb': false,
    'f1-washg': false,
    'f2-bca': false,
    'f2-bsc': true,
    'f2-bba': true,
    'tf-conf': false,
    'tf-store': false,
    'tf-rest': false,
    'tf-washb': false,
    'tf-washg': false,
    'tf-common': false
  }
};

let scheduleConfig: IScheduleConfig = { ...DEFAULT_SCHEDULE_CONFIG };

function loadSchedule(): IScheduleConfig {
  try {
    if (fs.existsSync(SCHEDULE_FILE)) {
      const data = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8'));
      return { ...DEFAULT_SCHEDULE_CONFIG, ...data };
    }
  } catch (e) {
    console.warn('[Schedule] Error reading schedule_config.json, using defaults.');
  }
  saveSchedule(DEFAULT_SCHEDULE_CONFIG);
  return DEFAULT_SCHEDULE_CONFIG;
}

function saveSchedule(cfg: IScheduleConfig) {
  try {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Schedule] Error persisting schedule_config.json:', e);
  }
}

scheduleConfig = loadSchedule();

function isWithinOperatingHours(): boolean {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
  return currentStr >= scheduleConfig.startTime && currentStr < scheduleConfig.endTime;
}

// --- 4-SECOND AUTONOMOUS AUTO-OFF ENGINE FOR UNOCCUPIED ROOMS ---
const emptyRoomShutoffTimers: Record<string, NodeJS.Timeout> = {};

function clearEmptyRoomShutoff(roomId: string) {
  if (emptyRoomShutoffTimers[roomId]) {
    clearTimeout(emptyRoomShutoffTimers[roomId]);
    delete emptyRoomShutoffTimers[roomId];
  }
}

function scheduleEmptyRoomShutoff(roomId: string) {
  if (emptyRoomShutoffTimers[roomId]) return;

  const startTimestamp = new Date().toLocaleTimeString();
  io.emit('empty_classroom_countdown_started', {
    roomId,
    durationSeconds: 4,
    message: `PIR sensor: Room (${roomId}) is not in use. 4-second auto switch-off initiated.`,
    timestamp: startTimestamp
  });

  // 4-second autonomous power cutoff (no manual action needed)
  emptyRoomShutoffTimers[roomId] = setTimeout(() => {
    delete emptyRoomShutoffTimers[roomId];
    if (!scheduleConfig.occupancy[roomId] && localControls[roomId]) {
      localControls[roomId] = false;
      saveControls(localControls);
      const shutoffTimestamp = new Date().toLocaleTimeString();
      io.emit('controls_updated', { controls: localControls });
      io.emit('empty_classroom_auto_off', {
        roomId,
        message: `4-Second Autonomous Auto-Off: Room (${roomId}) was not in use. Automatically switched OFF after 4 seconds (No manual off needed).`,
        timestamp: shutoffTimestamp
      });
      console.log(`[PIR Auto-Off 4s] Room (${roomId}) automatically switched OFF after 4s idle vacancy.`);
    }
  }, 4100);
}

// Background Automation Engine: Checks Timer, Schedule Cutoff (6 PM), and Empty Classroom 4s Auto-Off
setInterval(() => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

  // 1. Auto-Off Countdown Timer Check
  if (scheduleConfig.autoOffTimerActive && scheduleConfig.autoOffTimerEndsAt) {
    if (Date.now() >= scheduleConfig.autoOffTimerEndsAt) {
      scheduleConfig.autoOffTimerActive = false;
      scheduleConfig.autoOffTimerEndsAt = null;
      localControls = {};
      Object.keys(emptyRoomShutoffTimers).forEach(clearEmptyRoomShutoff);
      saveControls(localControls);
      saveSchedule(scheduleConfig);
      io.emit('auto_off_event', {
        type: 'countdown_timer',
        message: 'Auto-off countdown timer completed. All campus switches powered OFF.',
        timestamp: now.toLocaleTimeString()
      });
      io.emit('controls_updated', { controls: localControls });
    }
  }

  // 2. Schedule Cutoff (6:00 PM / 18:00) Enforcement Check
  if (scheduleConfig.autoOffAtEndTime && currentTimeStr === scheduleConfig.endTime && currentSeconds === 0) {
    const hasActiveDevices = Object.values(localControls).some(Boolean);
    if (hasActiveDevices) {
      localControls = {};
      Object.keys(emptyRoomShutoffTimers).forEach(clearEmptyRoomShutoff);
      saveControls(localControls);
      io.emit('auto_off_event', {
        type: 'schedule_end',
        message: `6:00 PM Campus Operating Schedule Ended (${scheduleConfig.endTime}). Facility-wide auto-off executed.`,
        timestamp: now.toLocaleTimeString()
      });
      io.emit('controls_updated', { controls: localControls });
    }
  }

  // 3. Empty Classroom Detector Check:
  // Autonomous 4-Second Auto Switch-Off for rooms not in use (Zero manual action needed)
  if (scheduleConfig.emptyClassroomDetectorActive) {
    const isWithinHours = isWithinOperatingHours();

    Object.entries(scheduleConfig.occupancy).forEach(([roomId, isOccupied]) => {
      if (!isOccupied && localControls[roomId]) {
        if (!isWithinHours) {
          // After-hours strict policy (Outside 9AM-6PM): immediate power down
          clearEmptyRoomShutoff(roomId);
          localControls[roomId] = false;
          saveControls(localControls);
          io.emit('empty_classroom_auto_off', {
            roomId,
            message: `After-Hours Policy (Outside 9AM-6PM): Unoccupied room (${roomId}) auto-powered down.`,
            timestamp: now.toLocaleTimeString()
          });
          io.emit('controls_updated', { controls: localControls });
        } else {
          // During schedule: 4-second autonomous auto switch-off engages
          scheduleEmptyRoomShutoff(roomId);
        }
      } else {
        // Room is occupied or switch is already OFF
        clearEmptyRoomShutoff(roomId);
      }
    });
  } else {
    Object.keys(emptyRoomShutoffTimers).forEach(clearEmptyRoomShutoff);
  }
}, 1000);

// --- HELPER TO CALCULATE AGGREGATED METRICS ACROSS ZONES ---
function calculateSummary(zones: IZoneRecord[]) {
  if (!zones || zones.length === 0) {
    return {
      totalElectricityKwh: 0,
      totalWaterLitres: 0,
      totalWasteKg: 0,
      averageAirQuality: null,
      averageUtilization: 0,
      overallStatus: 'Normal',
      activeAlertsCount: 0,
      zoneCount: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  let totalElec = 0;
  let totalWater = 0;
  let totalWaste = 0;
  let aqiSum = 0;
  let aqiCount = 0;
  let utilSum = 0;
  let activeAlerts = 0;
  let hasCritical = false;
  let hasWarning = false;
  let latestUpdate = new Date(0);

  zones.forEach((z) => {
    totalElec += Number(z.electricityKwh) || 0;
    totalWater += Number(z.waterLitres) || 0;
    totalWaste += Number(z.wasteKg) || 0;
    utilSum += Number(z.utilization) || 0;

    if (z.airQuality !== null && z.airQuality !== undefined && !isNaN(Number(z.airQuality))) {
      aqiSum += Number(z.airQuality);
      aqiCount++;
    }

    if (z.status === 'Critical') {
      hasCritical = true;
      activeAlerts++;
    } else if (z.status === 'Warning') {
      hasWarning = true;
      activeAlerts++;
    }

    const recDate = new Date(z.updatedAt || z.readingDateTime || 0);
    if (recDate > latestUpdate) {
      latestUpdate = recDate;
    }
  });

  return {
    totalElectricityKwh: Number(totalElec.toFixed(1)),
    totalWaterLitres: Math.round(totalWater),
    totalWasteKg: Number(totalWaste.toFixed(1)),
    averageAirQuality: aqiCount > 0 ? Math.round(aqiSum / aqiCount) : null,
    averageUtilization: Math.round(utilSum / zones.length),
    overallStatus: hasCritical ? 'Critical' : hasWarning ? 'Warning' : 'Normal',
    activeAlertsCount: activeAlerts,
    zoneCount: zones.length,
    lastUpdated: latestUpdate.getTime() === 0 ? new Date().toISOString() : latestUpdate.toISOString()
  };
}

// --- VALIDATION HELPER ---
function validateZonePayload(body: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body.zoneName || typeof body.zoneName !== 'string' || body.zoneName.trim() === '') {
    errors.push('Zone name is required and cannot be empty.');
  }

  if (body.electricityKwh === undefined || body.electricityKwh === null || isNaN(Number(body.electricityKwh))) {
    errors.push('Electricity consumption (kWh) must be a valid number.');
  } else if (Number(body.electricityKwh) < 0) {
    errors.push('Electricity consumption cannot be negative.');
  }

  if (body.waterLitres === undefined || body.waterLitres === null || isNaN(Number(body.waterLitres))) {
    errors.push('Water consumption (litres) must be a valid number.');
  } else if (Number(body.waterLitres) < 0) {
    errors.push('Water consumption cannot be negative.');
  }

  if (body.wasteKg === undefined || body.wasteKg === null || isNaN(Number(body.wasteKg))) {
    errors.push('Waste quantity (kg) must be a valid number.');
  } else if (Number(body.wasteKg) < 0) {
    errors.push('Waste quantity cannot be negative.');
  }

  if (body.airQuality !== undefined && body.airQuality !== null && body.airQuality !== '') {
    if (isNaN(Number(body.airQuality)) || Number(body.airQuality) < 0) {
      errors.push('Air quality value must be a positive number if provided.');
    }
  }

  if (body.utilization === undefined || body.utilization === null || isNaN(Number(body.utilization))) {
    errors.push('Asset/room utilization percentage must be a valid number.');
  } else if (Number(body.utilization) < 0 || Number(body.utilization) > 100) {
    errors.push('Utilization percentage must be between 0% and 100%.');
  }

  if (!body.status || !['Normal', 'Warning', 'Critical'].includes(body.status)) {
    errors.push('Status must be either Normal, Warning, or Critical.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ==========================================
// --- REAL-TIME ENERGY SIMULATOR (SOCKET.IO) ---
// ==========================================
const ENERGY_CONFIG_FILE = path.join(DATA_DIR, 'energy_config.json');

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

const DEFAULT_THRESHOLDS: Record<string, number> = {
  academic: 18.0,
  admin: 12.0,
  library: 8.0,
  lab: 25.0,
  cafeteria: 15.0
};

function loadEnergyThresholds(): Record<string, number> {
  try {
    if (fs.existsSync(ENERGY_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(ENERGY_CONFIG_FILE, 'utf-8'));
      return { ...DEFAULT_THRESHOLDS, ...data };
    }
  } catch (e) {}
  try {
    fs.writeFileSync(ENERGY_CONFIG_FILE, JSON.stringify(DEFAULT_THRESHOLDS, null, 2), 'utf-8');
  } catch (e) {}
  return { ...DEFAULT_THRESHOLDS };
}

function saveEnergyThresholds(thresh: Record<string, number>) {
  try {
    fs.writeFileSync(ENERGY_CONFIG_FILE, JSON.stringify(thresh, null, 2), 'utf-8');
  } catch (e) {}
}

let energyThresholds = loadEnergyThresholds();

let energyZones: IEnergyZone[] = [
  {
    id: 'academic',
    name: 'Academic Block',
    powerKw: 15.4,
    energyTodayKwh: 124.6,
    voltageV: 228,
    currentA: 74.2,
    powerFactor: 0.91,
    status: 'Normal',
    thresholdKw: energyThresholds['academic'] || 18.0,
    lastUpdated: new Date().toISOString(),
    isSimulated: true
  },
  {
    id: 'admin',
    name: 'Administration Block',
    powerKw: 9.8,
    energyTodayKwh: 78.4,
    voltageV: 230,
    currentA: 45.8,
    powerFactor: 0.93,
    status: 'Normal',
    thresholdKw: energyThresholds['admin'] || 12.0,
    lastUpdated: new Date().toISOString(),
    isSimulated: true
  },
  {
    id: 'library',
    name: 'Library',
    powerKw: 5.6,
    energyTodayKwh: 44.9,
    voltageV: 231,
    currentA: 25.7,
    powerFactor: 0.94,
    status: 'Normal',
    thresholdKw: energyThresholds['library'] || 8.0,
    lastUpdated: new Date().toISOString(),
    isSimulated: true
  },
  {
    id: 'lab',
    name: 'Laboratory',
    powerKw: 21.8,
    energyTodayKwh: 176.2,
    voltageV: 227,
    currentA: 106.5,
    powerFactor: 0.90,
    status: 'Normal',
    thresholdKw: energyThresholds['lab'] || 25.0,
    lastUpdated: new Date().toISOString(),
    isSimulated: true
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    powerKw: 11.4,
    energyTodayKwh: 91.3,
    voltageV: 229,
    currentA: 54.1,
    powerFactor: 0.92,
    status: 'Normal',
    thresholdKw: energyThresholds['cafeteria'] || 15.0,
    lastUpdated: new Date().toISOString(),
    isSimulated: true
  }
];

let energyHistory: IEnergyHistoryPoint[] = [];

// Pre-fill history points for instant initial chart visualization
const historyBaseTime = Date.now();
for (let i = 14; i >= 0; i--) {
  const ptTime = new Date(historyBaseTime - i * 3000);
  const ac = Number((15.4 + Math.sin(i * 0.7) * 1.6).toFixed(2));
  const ad = Number((9.8 + Math.cos(i * 0.8) * 0.9).toFixed(2));
  const li = Number((5.6 + Math.sin(i * 0.5) * 0.5).toFixed(2));
  const la = Number((21.8 + Math.sin(i * 0.9) * 2.1).toFixed(2));
  const ca = Number((11.4 + Math.cos(i * 0.6) * 1.3).toFixed(2));
  energyHistory.push({
    timestamp: ptTime.toISOString(),
    timeLabel: ptTime.toLocaleTimeString(),
    totalKw: Number((ac + ad + li + la + ca).toFixed(2)),
    academicKw: ac,
    adminKw: ad,
    libraryKw: li,
    labKw: la,
    cafeteriaKw: ca
  });
}

function calculateEnergyState() {
  let totalKw = 0;
  let totalEnergyTodayKwh = 0;
  let totalCurrentA = 0;
  let voltageSum = 0;
  let pfSum = 0;
  const alerts: IEnergyAlert[] = [];

  energyZones.forEach(z => {
    // Dynamic status determination based on current threshold
    if (z.powerKw > z.thresholdKw) {
      z.status = 'Critical';
      alerts.push({
        id: `alert-${z.id}-${Date.now()}`,
        zoneId: z.id,
        zoneName: z.name,
        powerKw: z.powerKw,
        thresholdKw: z.thresholdKw,
        status: 'Critical',
        message: `🔴 ${z.name} power consumption (${z.powerKw} kW) exceeds threshold of ${z.thresholdKw} kW!`,
        timestamp: new Date().toLocaleTimeString()
      });
    } else if (z.powerKw >= z.thresholdKw * 0.85) {
      z.status = 'High';
      alerts.push({
        id: `alert-${z.id}-${Date.now()}`,
        zoneId: z.id,
        zoneName: z.name,
        powerKw: z.powerKw,
        thresholdKw: z.thresholdKw,
        status: 'High',
        message: `🟡 ${z.name} power consumption (${z.powerKw} kW) is nearing peak threshold (${z.thresholdKw} kW).`,
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      z.status = 'Normal';
    }

    totalKw += z.powerKw;
    totalEnergyTodayKwh += z.energyTodayKwh;
    totalCurrentA += z.currentA;
    voltageSum += z.voltageV;
    pfSum += z.powerFactor;
  });

  const overallStatus = alerts.some(a => a.status === 'Critical')
    ? 'Critical'
    : alerts.some(a => a.status === 'High')
    ? 'High'
    : 'Normal';

  return {
    zones: energyZones,
    total: {
      totalPowerKw: Number(totalKw.toFixed(2)),
      totalEnergyTodayKwh: Number(totalEnergyTodayKwh.toFixed(2)),
      avgVoltageV: Number((voltageSum / energyZones.length).toFixed(1)),
      totalCurrentA: Number(totalCurrentA.toFixed(1)),
      avgPowerFactor: Number((pfSum / energyZones.length).toFixed(2)),
      overallStatus
    },
    alerts,
    history: energyHistory.slice(-20),
    isSimulated: true,
    label: "Live Prototype Data – Simulated",
    lastUpdated: new Date().toISOString()
  };
}

// Real-time energy simulator timer (runs every 3 seconds)
setInterval(() => {
  energyZones.forEach(z => {
    // Continuous subtle oscillation simulating real electrical fluctuations
    const delta = (Math.random() - 0.49) * 0.85;
    z.powerKw = Math.max(1.0, Number((z.powerKw + delta).toFixed(2)));
    
    // Accumulate energy used today (kWh = kW * hours)
    z.energyTodayKwh = Number((z.energyTodayKwh + (z.powerKw * (3 / 3600))).toFixed(3));
    
    // Realistic AC voltage fluctuation (225V - 233V)
    z.voltageV = 226 + Math.round((Math.random() - 0.5) * 8);
    
    // Power factor (0.88 - 0.98)
    z.powerFactor = Number((0.90 + Math.random() * 0.06).toFixed(2));
    
    // Calculated Current: I = (P * 1000) / (V * PF)
    z.currentA = Number(((z.powerKw * 1000) / (z.voltageV * z.powerFactor)).toFixed(1));
    z.lastUpdated = new Date().toISOString();
  });

  const now = new Date();
  const ac = energyZones.find(z => z.id === 'academic')?.powerKw || 0;
  const ad = energyZones.find(z => z.id === 'admin')?.powerKw || 0;
  const li = energyZones.find(z => z.id === 'library')?.powerKw || 0;
  const la = energyZones.find(z => z.id === 'lab')?.powerKw || 0;
  const ca = energyZones.find(z => z.id === 'cafeteria')?.powerKw || 0;
  const tot = ac + ad + li + la + ca;

  energyHistory.push({
    timestamp: now.toISOString(),
    timeLabel: now.toLocaleTimeString(),
    totalKw: Number(tot.toFixed(2)),
    academicKw: ac,
    adminKw: ad,
    libraryKw: li,
    labKw: la,
    cafeteriaKw: ca
  });

  if (energyHistory.length > 25) {
    energyHistory.shift();
  }

  const payload = calculateEnergyState();
  io.emit('energy_telemetry', payload);
}, 3000);

// Socket.IO Handshake
io.on('connection', (socket) => {
  socket.emit('energy_telemetry', calculateEnergyState());
});

// --- ENERGY API ENDPOINTS ---
// 1. GET Current Real-Time Energy Telemetry
app.get('/api/energy/zones', (req: Request, res: Response) => {
  res.json(calculateEnergyState());
});

// 2. PUT Update Zone Energy Threshold (Admin Control)
app.put('/api/energy/thresholds', (req: Request, res: Response) => {
  const { zoneId, thresholdKw } = req.body;
  if (!zoneId || thresholdKw === undefined || isNaN(Number(thresholdKw)) || Number(thresholdKw) <= 0) {
    return res.status(400).json({ success: false, message: 'Valid zoneId and positive thresholdKw are required.' });
  }

  energyThresholds[zoneId] = Number(thresholdKw);
  saveEnergyThresholds(energyThresholds);

  const z = energyZones.find(zone => zone.id === zoneId);
  if (z) {
    z.thresholdKw = Number(thresholdKw);
  }

  const payload = calculateEnergyState();
  io.emit('energy_telemetry', payload);

  return res.json({ success: true, message: `Threshold updated for ${z ? z.name : zoneId}`, thresholdKw: Number(thresholdKw) });
});

// 3. POST IoT Sensor Reading Ingestion (ESP32 / Energy Meter Ready)
app.post('/api/energy/reading', (req: Request, res: Response) => {
  const { zoneId, powerKw, voltageV, currentA, powerFactor } = req.body;
  if (!zoneId || powerKw === undefined || isNaN(Number(powerKw))) {
    return res.status(400).json({ success: false, message: 'Valid zoneId and powerKw are required.' });
  }

  const z = energyZones.find(zone => zone.id === zoneId);
  if (z) {
    z.powerKw = Number(powerKw);
    if (voltageV) z.voltageV = Number(voltageV);
    if (currentA) z.currentA = Number(currentA);
    if (powerFactor) z.powerFactor = Number(powerFactor);
    z.isSimulated = false; // Flag that this reading is hardware-fed
    z.lastUpdated = new Date().toISOString();
  }

  const payload = calculateEnergyState();
  io.emit('energy_telemetry', payload);

  return res.json({ success: true, message: 'IoT reading ingested successfully', zone: z });
});

// ==========================================
// --- ZONE-BASED ADMIN API ENDPOINTS ---
// ==========================================

// Backend Home / API Overview Console
app.get(['/api', '/backend-api'], (req: Request, res: Response) => {
  const summary = calculateSummary(localZones);
  
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Campus Facilities Backend Engine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
          .card { background: #1e293b; border-radius: 16px; padding: 24px; margin-bottom: 20px; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
          h1 { color: #38bdf8; margin: 0 0 8px 0; font-size: 26px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #10b981; color: #fff; font-weight: bold; font-size: 12px; }
          a { color: #38bdf8; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
          .btn { background: #0284c7; color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-right: 10px; font-weight: bold; font-size: 13px; }
          .btn:hover { background: #0369a1; text-decoration: none; transform: translateY(-1px); }
          .btn-green { background: #10b981; }
          .btn-green:hover { background: #059669; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
          .stat { background: #0f172a; padding: 16px; border-radius: 12px; border: 1px solid #334155; }
          .stat-label { color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .stat-val { font-size: 24px; font-weight: 900; color: #f8fafc; margin-top: 4px; }
          code { background: #090d16; padding: 3px 8px; border-radius: 6px; color: #a5f3fc; font-family: monospace; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { text-align: left; padding: 10px; background: #0f172a; color: #94a3b8; border-bottom: 2px solid #334155; }
          td { padding: 10px; border-bottom: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <h1>⚡ Campus Facilities Backend Engine &amp; API</h1>
              <p style="color: #94a3b8; margin: 0;">Real-Time Local Data Storage &bull; Single-Port Unified Architecture</p>
            </div>
            <span class="badge">● SERVER ONLINE (PORT ${PORT})</span>
          </div>
          
          <div style="margin-top: 20px;">
            <a href="/admin-data" class="btn btn-green">📊 Open Admin Data Management ↗</a>
            <a href="/dashboard" class="btn">🖥️ Open Live Dashboard ↗</a>
            <a href="/api/zones" class="btn" style="background: #475569;">🔗 View Raw Zones API JSON ↗</a>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-top: 0;">Real-Time System Aggregates</h3>
          <div class="grid">
            <div class="stat"><div class="stat-label">Total Zones</div><div class="stat-val">${summary.zoneCount} Zones</div></div>
            <div class="stat"><div class="stat-label">Electricity</div><div class="stat-val" style="color: #f59e0b;">${summary.totalElectricityKwh} kWh</div></div>
            <div class="stat"><div class="stat-label">Water Usage</div><div class="stat-val" style="color: #38bdf8;">${summary.totalWaterLitres.toLocaleString()} L</div></div>
            <div class="stat"><div class="stat-label">Total Waste</div><div class="stat-val" style="color: #f43f5e;">${summary.totalWasteKg} kg</div></div>
            <div class="stat"><div class="stat-label">Campus Status</div><div class="stat-val" style="color: ${summary.overallStatus === 'Critical' ? '#ef4444' : '#10b981'};">${summary.overallStatus}</div></div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-top: 0;">Active Monitored Zones</h3>
          <table>
            <thead>
              <tr><th>Zone Name</th><th>Electricity</th><th>Water</th><th>Waste</th><th>Utilization</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${localZones.map(z => `
                <tr>
                  <td><b>${z.zoneName}</b></td>
                  <td style="color: #f59e0b;">${z.electricityKwh} kWh</td>
                  <td style="color: #38bdf8;">${z.waterLitres.toLocaleString()} L</td>
                  <td style="color: #f43f5e;">${z.wasteKg} kg</td>
                  <td>${z.utilization}%</td>
                  <td><span style="color: ${z.status === 'Critical' ? '#ef4444' : z.status === 'Warning' ? '#f59e0b' : '#10b981'}; font-weight: bold;">${z.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    status: 'online',
    message: 'Campus Facilities Backend Engine is running',
    version: '1.0.0',
    summary,
    endpoints: {
      zones: '/api/zones',
      controls: '/api/controls',
      iotData: '/api/iot-data',
      iotIngestion: '/api/iot/zone-reading'
    }
  });
});

// 1. GET ALL ZONES & AGGREGATED SUMMARY (Real-Time Source for Dashboard)
app.get('/api/zones', (req: Request, res: Response) => {
  const summary = calculateSummary(localZones);
  return res.json({
    success: true,
    source: 'local-database',
    databaseStatus: 'Local Storage Active',
    summary,
    zones: localZones
  });
});

// 2. CREATE OR ADD NEW ZONE READING
app.post('/api/zones', (req: Request, res: Response) => {
  const validation = validateZonePayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  const payload: IZoneRecord = {
    _id: `zone-${Date.now()}`,
    zoneName: req.body.zoneName.trim(),
    electricityKwh: Number(req.body.electricityKwh),
    waterLitres: Number(req.body.waterLitres),
    wasteKg: Number(req.body.wasteKg),
    airQuality: req.body.airQuality ? Number(req.body.airQuality) : null,
    utilization: Number(req.body.utilization),
    readingDateTime: req.body.readingDateTime ? new Date(req.body.readingDateTime).toISOString() : new Date().toISOString(),
    status: req.body.status,
    notes: req.body.notes ? req.body.notes.trim() : '',
    source: req.body.source || 'admin',
    updatedAt: new Date().toISOString()
  };

  const existingIndex = localZones.findIndex(z => z.zoneName.toLowerCase() === payload.zoneName.toLowerCase());
  if (existingIndex >= 0) {
    payload._id = localZones[existingIndex]._id;
    localZones[existingIndex] = payload;
  } else {
    localZones.push(payload);
  }

  saveZones(localZones);
  return res.status(201).json({ success: true, record: payload, source: 'local-database' });
});

// 3. UPDATE AN EXISTING ZONE RECORD BY ID
app.put('/api/zones/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const validation = validateZonePayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  const idx = localZones.findIndex(z => z._id === id || z.zoneName.toLowerCase() === req.body.zoneName.trim().toLowerCase());
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Zone record not found' });
  }

  const updatedRecord: IZoneRecord = {
    ...localZones[idx],
    zoneName: req.body.zoneName.trim(),
    electricityKwh: Number(req.body.electricityKwh),
    waterLitres: Number(req.body.waterLitres),
    wasteKg: Number(req.body.wasteKg),
    airQuality: req.body.airQuality ? Number(req.body.airQuality) : null,
    utilization: Number(req.body.utilization),
    readingDateTime: req.body.readingDateTime ? new Date(req.body.readingDateTime).toISOString() : new Date().toISOString(),
    status: req.body.status,
    notes: req.body.notes ? req.body.notes.trim() : '',
    updatedAt: new Date().toISOString()
  };

  localZones[idx] = updatedRecord;
  saveZones(localZones);
  return res.json({ success: true, record: updatedRecord, source: 'local-database' });
});

// 4. DELETE A ZONE RECORD
app.delete('/api/zones/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  localZones = localZones.filter(z => z._id !== id);
  saveZones(localZones);
  res.json({ success: true, message: 'Zone record deleted successfully' });
});

// 5. RESET / RE-SEED INITIAL SAMPLE DEMO RECORDS
app.post('/api/zones/seed', (req: Request, res: Response) => {
  localZones = INITIAL_SAMPLE_ZONES.map((z, idx) => ({
    _id: `zone-${idx + 1}`,
    ...z,
    readingDateTime: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  saveZones(localZones);
  res.json({ success: true, message: 'Sample records restored', count: localZones.length });
});

// 6. CLEAR ALL ZONE RECORDS (For clean fresh manual facility entry)
app.delete('/api/zones', (req: Request, res: Response) => {
  localZones = [];
  saveZones(localZones);
  res.json({ success: true, message: 'All zone records cleared. Ready for fresh manual data entry.' });
});

// ==========================================
// --- IOT-READY SENSOR INGESTION API ---
// ==========================================
app.post('/api/iot/zone-reading', (req: Request, res: Response) => {
  const validation = validateZonePayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, message: 'IoT telemetry validation failed', errors: validation.errors });
  }

  const payload: IZoneRecord = {
    _id: `iot-${Date.now()}`,
    zoneName: req.body.zoneName.trim(),
    electricityKwh: Number(req.body.electricityKwh),
    waterLitres: Number(req.body.waterLitres),
    wasteKg: Number(req.body.wasteKg),
    airQuality: req.body.airQuality ? Number(req.body.airQuality) : null,
    utilization: Number(req.body.utilization),
    readingDateTime: new Date().toISOString(),
    status: req.body.status,
    source: 'iot-device',
    notes: req.body.notes || 'Ingested via ESP32 / IoT Sensor Endpoint',
    updatedAt: new Date().toISOString()
  };

  const idx = localZones.findIndex(z => z.zoneName.toLowerCase() === payload.zoneName.toLowerCase());
  if (idx >= 0) {
    payload._id = localZones[idx]._id;
    localZones[idx] = payload;
  } else {
    localZones.push(payload);
  }

  saveZones(localZones);
  res.status(200).json({ success: true, source: 'local-database', message: 'IoT reading ingested successfully', record: payload });
});

// Legacy support for Wokwi ESP32 simulator prototype
app.post('/api/iot-data', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'IoT prototype ping acknowledged' });
});

app.get('/api/iot-data', (req: Request, res: Response) => {
  const summary = calculateSummary(localZones);
  res.json({
    energyUsage: summary.totalElectricityKwh,
    waterUsage: summary.totalWaterLitres,
    airQuality: summary.averageAirQuality || 65,
    wasteLevel: summary.totalWasteKg,
    status: summary.overallStatus,
    timestamp: summary.lastUpdated
  });
});

// Institutional Information
app.get('/api/campus-info', (req: Request, res: Response) => {
  res.json({
    name: "NIIS Institute of Business Administration",
    location: "Sarada Vihar, Madanpur, Bhubaneswar, Khordha, Odisha, India – 752054",
    coordinates: {
      lat: 20.142389,
      lng: 85.433000,
      dms: `20°08'32.6"N 85°25'58.8"E`
    },
    area: "10 acres",
    builtUpArea: "2.5 lakh+ sq. ft.",
    programs: ["MBA", "MCA", "BBA", "BCA", "BSc"]
  });
});

// Controls API (Classroom Switches)
app.get('/api/controls', (req: Request, res: Response) => {
  res.json({ source: 'local-database', controls: localControls });
});

app.post('/api/controls', (req: Request, res: Response) => {
  const { roomId, isOn } = req.body;
  if (roomId) {
    if (roomId === 'ALL_OFF' || roomId === 'AI_SHUTDOWN') {
      localControls = {};
      Object.keys(emptyRoomShutoffTimers).forEach(clearEmptyRoomShutoff);
    } else if (roomId === 'ALL_ON_CLASSROOMS') {
      Object.keys(scheduleConfig.occupancy).forEach(id => {
        localControls[id] = true;
        if (!scheduleConfig.occupancy[id] && scheduleConfig.emptyClassroomDetectorActive) {
          scheduleEmptyRoomShutoff(id);
        }
      });
    } else {
      localControls[roomId] = !!isOn;
      if (localControls[roomId] && !scheduleConfig.occupancy[roomId] && scheduleConfig.emptyClassroomDetectorActive) {
        scheduleEmptyRoomShutoff(roomId);
      } else {
        clearEmptyRoomShutoff(roomId);
      }
    }
    saveControls(localControls);
    io.emit('controls_updated', { controls: localControls });
  }
  res.json({ success: true, roomId, isOn, controls: localControls });
});

// --- SCHEDULE & AUTO-OFF TIMING ENDPOINTS ---
// 1. GET Schedule, Timer, and Occupancy Status
app.get('/api/schedule', (req: Request, res: Response) => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
  const isWithin = isWithinOperatingHours();

  res.json({
    success: true,
    schedule: scheduleConfig,
    isWithinOperatingHours: isWithin,
    currentTimeStr,
    currentFormattedTime: now.toLocaleTimeString(),
    activeSwitchesCount: Object.values(localControls).filter(Boolean).length,
    controls: localControls
  });
});

// 2. POST Update Schedule Configuration
app.post('/api/schedule', (req: Request, res: Response) => {
  const { startTime, endTime, autoOffAtEndTime, emptyClassroomDetectorActive } = req.body;
  if (startTime) scheduleConfig.startTime = startTime;
  if (endTime) scheduleConfig.endTime = endTime;
  if (autoOffAtEndTime !== undefined) scheduleConfig.autoOffAtEndTime = !!autoOffAtEndTime;
  if (emptyClassroomDetectorActive !== undefined) scheduleConfig.emptyClassroomDetectorActive = !!emptyClassroomDetectorActive;

  saveSchedule(scheduleConfig);
  io.emit('schedule_updated', scheduleConfig);
  res.json({ success: true, message: 'Schedule configuration updated', schedule: scheduleConfig });
});

// 3. POST Simulate 6:00 PM Operating Schedule Cutoff (Instant Auto-Off All Switches)
const handleScheduleCutoffSimulation = (req: Request, res: Response) => {
  const affectedCount = Object.values(localControls).filter(Boolean).length;
  localControls = {};
  saveControls(localControls);

  io.emit('auto_off_event', {
    type: 'schedule_end_manual',
    message: `6:00 PM Operating Schedule Cutoff Simulated. Powered down ${affectedCount} active room switch(es). Campus Master LED set to GREEN.`,
    timestamp: new Date().toLocaleTimeString()
  });
  io.emit('controls_updated', { controls: localControls });

  res.json({
    success: true,
    message: `6:00 PM Schedule Cutoff Triggered. Turned OFF ${affectedCount} active switch(es).`,
    affectedCount,
    controls: localControls
  });
};

app.post('/api/schedule/trigger-6pm', handleScheduleCutoffSimulation);
app.post('/api/schedule/trigger-4pm', handleScheduleCutoffSimulation); // Backward-compatible alias

// 4. POST Auto-Off Countdown Timer Control
app.post('/api/timer/auto-off', (req: Request, res: Response) => {
  const { action, durationSeconds } = req.body;

  if (action === 'start') {
    const sec = Number(durationSeconds) || 60;
    scheduleConfig.autoOffTimerActive = true;
    scheduleConfig.autoOffTimerDurationSec = sec;
    scheduleConfig.autoOffTimerEndsAt = Date.now() + sec * 1000;
    saveSchedule(scheduleConfig);

    io.emit('timer_updated', {
      active: true,
      durationSeconds: sec,
      endsAt: scheduleConfig.autoOffTimerEndsAt
    });

    return res.json({
      success: true,
      message: `Auto-off timer set for ${sec} seconds (${Math.ceil(sec / 60)} min).`,
      timer: {
        active: true,
        durationSeconds: sec,
        endsAt: scheduleConfig.autoOffTimerEndsAt
      }
    });
  }

  if (action === 'pause' || action === 'cancel') {
    scheduleConfig.autoOffTimerActive = false;
    scheduleConfig.autoOffTimerEndsAt = null;
    saveSchedule(scheduleConfig);

    io.emit('timer_updated', { active: false, endsAt: null });
    return res.json({ success: true, message: 'Auto-off timer paused/cancelled' });
  }

  if (action === 'trigger_now') {
    const affectedCount = Object.values(localControls).filter(Boolean).length;
    localControls = {};
    scheduleConfig.autoOffTimerActive = false;
    scheduleConfig.autoOffTimerEndsAt = null;
    saveControls(localControls);
    saveSchedule(scheduleConfig);

    io.emit('auto_off_event', {
      type: 'timer_instant',
      message: `Auto-off executed immediately. Powered down ${affectedCount} active room switch(es).`,
      timestamp: new Date().toLocaleTimeString()
    });
    io.emit('controls_updated', { controls: localControls });

    return res.json({ success: true, message: 'Immediate auto-off completed', affectedCount });
  }

  res.status(400).json({ success: false, message: 'Invalid action. Supported: start, pause, cancel, trigger_now' });
});

// --- EMPTY CLASSROOM DETECTOR ENDPOINTS ---
// 5. GET Occupancy Status
app.get('/api/occupancy', (req: Request, res: Response) => {
  res.json({
    success: true,
    occupancy: scheduleConfig.occupancy,
    detectorActive: scheduleConfig.emptyClassroomDetectorActive,
    isWithinOperatingHours: isWithinOperatingHours()
  });
});

// 6. POST Update Classroom Occupancy (Simulates PIR motion sensor detection)
app.post('/api/occupancy', (req: Request, res: Response) => {
  const { roomId, isOccupied } = req.body;
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'roomId is required' });
  }

  scheduleConfig.occupancy[roomId] = !!isOccupied;

  // If room is now empty AND detector is active AND room switch was ON -> engage 4-second auto shutoff
  if (!isOccupied && scheduleConfig.emptyClassroomDetectorActive && localControls[roomId]) {
    scheduleEmptyRoomShutoff(roomId);
  } else {
    clearEmptyRoomShutoff(roomId);
  }

  saveSchedule(scheduleConfig);
  io.emit('occupancy_updated', { roomId, isOccupied: !!isOccupied, autoShutoff: false });

  res.json({
    success: true,
    roomId,
    isOccupied: !!isOccupied,
    switchState: !!localControls[roomId]
  });
});

// 7. POST Sweep All Empty Classrooms (Powers down ONLY empty rooms; preserves occupied rooms)
app.post(['/api/occupancy/sweep', '/api/schedule/empty-all-classrooms', '/api/schedule/sweep-empty-classrooms'], (req: Request, res: Response) => {
  const sweptRooms: string[] = [];
  const keptOnRooms: string[] = [];

  Object.entries(localControls).forEach(([roomId, isOn]) => {
    if (isOn) {
      const isOccupied = !!scheduleConfig.occupancy[roomId];
      if (!isOccupied) {
        // ONLY empty rooms are switched OFF
        localControls[roomId] = false;
        sweptRooms.push(roomId);
      } else {
        // Occupied rooms REMAIN ON
        keptOnRooms.push(roomId);
      }
    }
  });

  if (sweptRooms.length > 0) {
    saveControls(localControls);
    io.emit('controls_updated', { controls: localControls });
    io.emit('empty_classroom_auto_off', {
      roomId: 'SWEEP_ALL',
      message: `PIR Detector: Auto-powered down ${sweptRooms.length} empty room(s). Kept ${keptOnRooms.length} occupied room(s) ON.`,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  res.json({
    success: true,
    message: `PIR Detector: Powered down ${sweptRooms.length} empty room(s). Kept ${keptOnRooms.length} occupied room(s) ON.`,
    sweptRooms,
    keptOnRooms,
    controls: localControls
  });
});

// --- SERVE PRODUCTION REACT FRONTEND ---
const staticPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticPath));

// Single Page Application (SPA) routing fallback
app.use((req: Request, res: Response, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(staticPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`[CampusIQ Facility Server] Real-Time Server & WebSocket active on http://localhost:${PORT}`);
});
