import React from 'react';
import { Card } from '../components/ui';
import { INSTITUTION_INFO, DEMO_DATA } from '../data/mockData';
import { io } from 'socket.io-client';
import { 
  Zap, Droplets, Wind, Trash2, Building2, 
  CheckCircle, Sparkles, Power,
  Clock, Calendar, Users, UserX, Timer, 
  Play, Pause, RotateCcw, Bell, AlertTriangle, ShieldCheck,
  Radio, Volume2, VolumeX, Activity, ArrowUpRight, Cpu,
  Search, Filter, Download, Trash, Terminal, Layers, CheckCircle2, ChevronRight, ZapOff
} from 'lucide-react';

export const FLOORS = [
  {
    name: "Ground Floor",
    rooms: [
      { id: "gf-md", label: "MD Room 1", type: "AC / Lights" },
      { id: "gf-office", label: "Office Room 1", type: "AC / Lights" },
      { id: "gf-reception", label: "Reception 1", type: "AC / Lights" },
      { id: "gf-account", label: "Account Section 1", type: "AC / Lights" },
      { id: "gf-ecell", label: "E Cell 1", type: "AC / Lights" },
    ]
  },
  {
    name: "1st Floor",
    rooms: [
      { id: "f1-mca", label: "MCA - 2 Rooms", type: "Electric" },
      { id: "f1-mba", label: "MBA - 2 Rooms", type: "Electric" },
      { id: "f1-lib", label: "Library 1", type: "Electric" },
      { id: "f1-read", label: "Reading Room 2", type: "Electric" },
      { id: "f1-washb", label: "Boys Wash Room 2", type: "Electric" },
      { id: "f1-washg", label: "Girls Wash Room 2", type: "Electric" },
    ]
  },
  {
    name: "2nd Floor",
    rooms: [
      { id: "f2-bca", label: "BCA - 3 Classes", type: "Electric" },
      { id: "f2-bsc", label: "BSc - 2 Classes", type: "Electric" },
      { id: "f2-bba", label: "BBA - 2 Classes", type: "Electric" },
    ]
  },
  {
    name: "Top Floor",
    rooms: [
      { id: "tf-conf", label: "Conference Hall", type: "AC / Lights" },
      { id: "tf-store", label: "Store Room 1", type: "Electric" },
      { id: "tf-rest", label: "Rest Room 1", type: "Electric" },
      { id: "tf-washb", label: "Boys Washroom 1", type: "Electric" },
      { id: "tf-washg", label: "Girls Washroom 1", type: "Electric" },
      { id: "tf-common", label: "Common Room 1", type: "Electric" },
    ]
  }
];

export const CLASSROOM_SUITES = [
  // Ground Floor Rooms
  { id: 'gf-md', name: 'MD Room 1 (Executive Chamber)', floor: 'Ground Floor', type: 'AC / Lights', capacity: 'Executive Suite', loadKw: 2.4 },
  { id: 'gf-office', name: 'Office Room 1 (Admin Office)', floor: 'Ground Floor', type: 'AC / Lights', capacity: '15 Staff', loadKw: 1.8 },
  { id: 'gf-reception', name: 'Reception 1 (Lobby & Desk)', floor: 'Ground Floor', type: 'AC / Lights', capacity: 'Front Desk', loadKw: 1.2 },
  { id: 'gf-account', name: 'Account Section 1', floor: 'Ground Floor', type: 'AC / Lights', capacity: 'Finance Dept', loadKw: 1.5 },
  { id: 'gf-ecell', name: 'E Cell 1 (Incubation Cell)', floor: 'Ground Floor', type: 'AC / Lights', capacity: 'Innovation Hub', loadKw: 1.6 },

  // 1st Floor Rooms
  { id: 'f1-mca', name: 'MCA Classrooms (2 Rooms)', floor: '1st Floor', type: 'Electric', capacity: '120 Seats', loadKw: 3.2 },
  { id: 'f1-mba', name: 'MBA Classrooms (2 Rooms)', floor: '1st Floor', type: 'Electric', capacity: '120 Seats', loadKw: 3.2 },
  { id: 'f1-lib', name: 'Central Library 1', floor: '1st Floor', type: 'Electric', capacity: '150 Seats', loadKw: 2.8 },
  { id: 'f1-read', name: 'Reading Room 2 (Study Hall)', floor: '1st Floor', type: 'Electric', capacity: '60 Seats', loadKw: 1.4 },
  { id: 'f1-washb', name: 'Boys Washroom (1st Floor)', floor: '1st Floor', type: 'Electric', capacity: 'Restroom', loadKw: 0.6 },
  { id: 'f1-washg', name: 'Girls Washroom (1st Floor)', floor: '1st Floor', type: 'Electric', capacity: 'Restroom', loadKw: 0.6 },

  // 2nd Floor Rooms
  { id: 'f2-bca', name: 'BCA Classrooms (3 Classes)', floor: '2nd Floor', type: 'Electric', capacity: '180 Seats', loadKw: 4.5 },
  { id: 'f2-bsc', name: 'BSc Classrooms (2 Classes)', floor: '2nd Floor', type: 'Electric', capacity: '120 Seats', loadKw: 3.0 },
  { id: 'f2-bba', name: 'BBA Classrooms (2 Classes)', floor: '2nd Floor', type: 'Electric', capacity: '120 Seats', loadKw: 3.0 },

  // Top Floor Rooms
  { id: 'tf-conf', name: 'Conference Hall (Seminar / AC)', floor: 'Top Floor', type: 'AC / Lights', capacity: '200 Seats', loadKw: 5.8 },
  { id: 'tf-store', name: 'Central Store Room 1', floor: 'Top Floor', type: 'Electric', capacity: 'Facility Storage', loadKw: 0.4 },
  { id: 'tf-rest', name: 'Faculty Rest Room 1', floor: 'Top Floor', type: 'Electric', capacity: 'Staff Lounge', loadKw: 1.1 },
  { id: 'tf-washb', name: 'Boys Washroom (Top Floor)', floor: 'Top Floor', type: 'Electric', capacity: 'Restroom', loadKw: 0.6 },
  { id: 'tf-washg', name: 'Girls Washroom (Top Floor)', floor: 'Top Floor', type: 'Electric', capacity: 'Restroom', loadKw: 0.6 },
  { id: 'tf-common', name: 'Student Common Room 1', floor: 'Top Floor', type: 'Electric', capacity: 'Recreation Hall', loadKw: 1.8 },
];

export const CLASSROOM_IDS = CLASSROOM_SUITES.map(c => c.id);

// WebAudio Context for Siren
let globalAudioCtx: AudioContext | null = null;

function getAudioContext() {
  try {
    if (!globalAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        globalAudioCtx = new AudioCtx();
      }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume().catch(() => {});
    }
  } catch (e) {}
  return globalAudioCtx;
}

interface ContinuousSirenNodes {
  carrier: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  filter: BiquadFilterNode;
  masterGain: GainNode;
  subCarrier: OscillatorNode;
  subGain: GainNode;
}

let activeContinuousSiren: ContinuousSirenNodes | null = null;

export function startContinuousSiren() {
  try {
    if (activeContinuousSiren) return;

    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    const carrier = ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(950, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.24, now + 0.15);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.8, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(380, now);

    lfo.connect(lfoGain);
    lfoGain.connect(carrier.frequency);

    carrier.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    const subCarrier = ctx.createOscillator();
    subCarrier.type = 'sine';
    subCarrier.frequency.setValueAtTime(475, now);

    const subLfoGain = ctx.createGain();
    subLfoGain.gain.setValueAtTime(190, now);
    lfo.connect(subLfoGain);
    subLfoGain.connect(subCarrier.frequency);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.12, now);

    subCarrier.connect(subGain);
    subGain.connect(masterGain);

    carrier.start(now);
    subCarrier.start(now);
    lfo.start(now);

    activeContinuousSiren = {
      carrier,
      lfo,
      lfoGain,
      filter,
      masterGain,
      subCarrier,
      subGain
    };
  } catch (e) {
    console.warn('[Audio] Error starting continuous siren:', e);
  }
}

export function stopContinuousSiren() {
  try {
    if (!activeContinuousSiren) return;

    const { masterGain, carrier, subCarrier, lfo } = activeContinuousSiren;
    const ctx = getAudioContext();
    const now = ctx ? ctx.currentTime : 0;

    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.12);

    setTimeout(() => {
      try {
        carrier.stop();
        subCarrier.stop();
        lfo.stop();
        carrier.disconnect();
        subCarrier.disconnect();
        lfo.disconnect();
        masterGain.disconnect();
      } catch (err) {}
    }, 150);

    activeContinuousSiren = null;
  } catch (e) {
    activeContinuousSiren = null;
  }
}

export function playSirenSound() {
  startContinuousSiren();
  setTimeout(() => {
    stopContinuousSiren();
  }, 1400);
}

export const playAlertSound = playSirenSound;

export default function Dashboard() {
  // Real-Time Telemetry Stream
  const [telemetry, setTelemetry] = React.useState({
    energyUsage: 418.5,
    waterUsage: 14250,
    airQuality: 42,
    wasteLevel: 38,
    distanceCm: 58,
    status: 'NORMAL/SAFE',
    is7pmRuleActive: false,
    timestamp: new Date().toLocaleTimeString()
  });

  // Smart Room Controls State
  const [controls, setControls] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('smartControlsExpanded');
    return saved ? JSON.parse(saved) : {};
  });

  const [logs, setLogs] = React.useState<{time: string, device: string, action: string}[]>(() => {
    const savedLogs = localStorage.getItem('smartControlLogsExpanded');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const [eventFilter, setEventFilter] = React.useState<'all' | 'auto_off' | 'pir' | 'schedule' | 'ai' | 'manual'>('all');
  const [eventSearchQuery, setEventSearchQuery] = React.useState('');

  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [testSirenManual, setTestSirenManual] = React.useState(false);
  const [aiProcessing, setAiProcessing] = React.useState(false);
  const [aiReport, setAiReport] = React.useState<string | null>(null);

  // Operating Schedule (9:00 AM - 6:00 PM)
  const [schedule, setSchedule] = React.useState({
    startTime: '09:00',
    endTime: '18:00',
    autoOffAtEndTime: true,
    emptyClassroomDetectorActive: true
  });
  const [currentTimeFormatted, setCurrentTimeFormatted] = React.useState(new Date().toLocaleTimeString());
  const [isWithinSchedule, setIsWithinSchedule] = React.useState(true);

  // Countdown Auto-Off Timer
  const [timerPresetSec, setTimerPresetSec] = React.useState(60);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = React.useState<number | null>(null);

  // PIR Occupancy Sensor State
  const [occupancy, setOccupancy] = React.useState<Record<string, boolean>>({
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
  });

  const [selectedDetectorFloor, setSelectedDetectorFloor] = React.useState<string>('All');
  const [emptyRoomCountdowns, setEmptyRoomCountdowns] = React.useState<Record<string, number>>({});

  const [actionNotification, setActionNotification] = React.useState<{
    title: string;
    message: string;
    type: 'schedule' | 'timer' | 'pir';
    time: string;
  } | null>(null);

  const activeCount = Object.values(controls).filter(Boolean).length;
  const isAnyOn = activeCount > 0;

  // Real-Time Polling Engine
  React.useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/iot-data');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(prev => ({
            ...prev,
            ...data,
            timestamp: new Date().toLocaleTimeString()
          }));
        }
      } catch (e) {}
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2500);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial Schedule
  React.useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const res = await fetch('/api/schedule');
        if (res.ok) {
          const data = await res.json();
          if (data.schedule) {
            setSchedule(prev => ({
              ...prev,
              startTime: data.schedule.startTime || '09:00',
              endTime: data.schedule.endTime || '18:00',
              autoOffAtEndTime: data.schedule.autoOffAtEndTime ?? true,
              emptyClassroomDetectorActive: data.schedule.emptyClassroomDetectorActive ?? true,
            }));
            if (data.schedule.occupancy) {
              setOccupancy(data.schedule.occupancy);
            }
          }
          if (data.controls && typeof data.controls === 'object') {
            setControls(data.controls);
            localStorage.setItem('smartControlsExpanded', JSON.stringify(data.controls));
          }
        }
      } catch (e) {}
    };

    fetchScheduleData();
  }, []);

  // Socket.IO Sync
  React.useEffect(() => {
    const socket = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('controls_updated', (data: { controls: Record<string, boolean> }) => {
      if (data && data.controls) {
        setControls(data.controls);
        localStorage.setItem('smartControlsExpanded', JSON.stringify(data.controls));
      }
    });

    socket.on('auto_off_event', (data: { type: string, message: string, timestamp: string }) => {
      if (soundEnabled) playAlertSound();
      setControls({});
      localStorage.setItem('smartControlsExpanded', JSON.stringify({}));
      
      const newLog = {
        time: data.timestamp || new Date().toLocaleTimeString(),
        device: 'Auto-Off Engine',
        action: data.message || 'Auto-powered down all campus switches'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));

      setActionNotification({
        title: '⚡ Campus Auto-Off Enforced',
        message: data.message,
        type: data.type === 'schedule_end' ? 'schedule' : 'timer',
        time: data.timestamp || new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 8000);
    });

    socket.on('empty_classroom_auto_off', (data: { roomId: string, message: string, timestamp: string }) => {
      if (soundEnabled) playAlertSound();
      if (data.roomId && data.roomId !== 'SWEEP_ALL') {
        setControls(prev => ({ ...prev, [data.roomId]: false }));
      }
      
      const newLog = {
        time: data.timestamp || new Date().toLocaleTimeString(),
        device: `PIR Detector (${data.roomId})`,
        action: data.message
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));

      setActionNotification({
        title: '📭 Empty Classroom Detector Auto-Off',
        message: data.message,
        type: 'pir',
        time: data.timestamp || new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 7000);
    });

    socket.on('empty_classroom_countdown_started', (data: { roomId: string, durationSeconds?: number, message?: string }) => {
      if (data && data.roomId) {
        setEmptyRoomCountdowns(prev => ({ ...prev, [data.roomId]: data.durationSeconds || 4 }));
      }
    });

    socket.on('occupancy_updated', (data: { roomId: string, isOccupied: boolean }) => {
      if (data && data.roomId) {
        setOccupancy(prev => ({ ...prev, [data.roomId]: data.isOccupied }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [soundEnabled]);

  // Schedule Monitor
  React.useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      setCurrentTimeFormatted(now.toLocaleTimeString());
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const curStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      const within = curStr >= schedule.startTime && curStr < schedule.endTime;
      setIsWithinSchedule(within);

      if (schedule.autoOffAtEndTime && curStr === schedule.endTime && now.getSeconds() === 0) {
        if (Object.values(controls).some(Boolean)) {
          executeSchedule6PmCutoff();
        }
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [schedule, controls]);

  // Auto-Off Timer Countdown
  React.useEffect(() => {
    if (!timerRunning || timerSecondsLeft === null) return;

    if (timerSecondsLeft <= 0) {
      setTimerRunning(false);
      setTimerSecondsLeft(null);
      executeAutoOffCountdownExpiry();
      return;
    }

    const timer = setInterval(() => {
      setTimerSecondsLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          executeAutoOffCountdownExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, timerSecondsLeft]);

  // 4-Second Autonomous Auto Switch-Off Engine for Rooms Not In Use
  React.useEffect(() => {
    // Find all rooms currently ON and NOT IN USE (vacant)
    const emptyAndOnIds = CLASSROOM_IDS.filter(id => controls[id] && !occupancy[id]);

    if (emptyAndOnIds.length === 0) {
      setEmptyRoomCountdowns(prev => (Object.keys(prev).length > 0 ? {} : prev));
      return;
    }

    // Initialize countdowns for empty & on rooms
    setEmptyRoomCountdowns(prev => {
      const next = { ...prev };
      let updated = false;
      emptyAndOnIds.forEach(id => {
        if (next[id] === undefined) {
          next[id] = 4;
          updated = true;
        }
      });
      Object.keys(next).forEach(id => {
        if (!emptyAndOnIds.includes(id)) {
          delete next[id];
          updated = true;
        }
      });
      return updated ? next : prev;
    });

    const interval = setInterval(() => {
      setEmptyRoomCountdowns(prev => {
        const next = { ...prev };
        const roomsToShutoff: string[] = [];

        emptyAndOnIds.forEach(id => {
          const currentSec = next[id] !== undefined ? next[id] : 4;
          if (currentSec <= 1) {
            roomsToShutoff.push(id);
            delete next[id];
          } else {
            next[id] = currentSec - 1;
          }
        });

        if (roomsToShutoff.length > 0) {
          // Autonomous Shutoff Execution (No manual action required)
          setControls(currControls => {
            const nextControls = { ...currControls };
            roomsToShutoff.forEach(id => {
              nextControls[id] = false;
            });
            localStorage.setItem('smartControlsExpanded', JSON.stringify(nextControls));
            return nextControls;
          });

          roomsToShutoff.forEach(id => {
            const roomObj = CLASSROOM_SUITES.find(c => c.id === id);
            const roomName = roomObj ? roomObj.name : id;

            const newLog = {
              time: new Date().toLocaleTimeString(),
              device: `Autonomous Shutoff (${roomName})`,
              action: `Auto-switched OFF after 4s idle vacancy (Zero manual intervention).`
            };
            setLogs(currLogs => {
              const updated = [newLog, ...currLogs].slice(0, 50);
              localStorage.setItem('smartControlLogsExpanded', JSON.stringify(updated));
              return updated;
            });

            fetch('/api/controls', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId: id, isOn: false, label: roomName, floor: roomObj?.floor || '' })
            }).catch(() => {});
          });

          if (soundEnabled) playAlertSound();

          const roomNames = roomsToShutoff.map(id => CLASSROOM_SUITES.find(c => c.id === id)?.name || id).join(', ');
          setActionNotification({
            title: '⚡ 4-Second Auto Switch-Off Enforced',
            message: `${roomNames} was not in use. Automatically switched OFF after 4 seconds (Zero manual action needed).`,
            type: 'pir',
            time: new Date().toLocaleTimeString()
          });
          setTimeout(() => setActionNotification(null), 6000);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [controls, occupancy, soundEnabled]);

  // Siren evaluation: active if an empty room has switch ON or manual test
  const activeEmptyClassrooms = CLASSROOM_IDS.filter(id => controls[id] && !occupancy[id]);
  const hasEmptyRoomViolation = activeEmptyClassrooms.length > 0;
  const isSirenWailing = soundEnabled && (hasEmptyRoomViolation || testSirenManual);

  React.useEffect(() => {
    if (isSirenWailing) {
      startContinuousSiren();
    } else {
      stopContinuousSiren();
    }
    return () => {
      stopContinuousSiren();
    };
  }, [isSirenWailing]);

  const toggleControl = (id: string, label: string, floorName: string) => {
    const newState = !controls[id];
    const newControls = { ...controls, [id]: newState };
    const isClass = CLASSROOM_IDS.includes(id);
    const isOccupied = occupancy[id] ?? true;

    const newLog = {
      time: new Date().toLocaleTimeString(),
      device: label,
      action: newState ? 'Turned ON' : 'Turned OFF'
    };
    
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    setControls(newControls);
    setLogs(updatedLogs);
    localStorage.setItem('smartControlsExpanded', JSON.stringify(newControls));
    localStorage.setItem('smartControlLogsExpanded', JSON.stringify(updatedLogs));

    fetch('/api/controls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: id,
        label,
        floor: floorName,
        isOn: newState
      })
    }).catch(() => {});

    if (newState && isClass && !isOccupied) {
      setActionNotification({
        title: '⏳ Not In Use — Auto-Off in 4s',
        message: `PIR sensor: ${label} is EMPTY. 4-second auto switch-off engaged (No manual action needed).`,
        type: 'pir',
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 5000);
    } else if (!newState && isClass && !isOccupied) {
      setActionNotification({
        title: '✅ Switch Turned OFF',
        message: `${label} switch turned OFF. Continuous emergency siren silenced.`,
        type: 'pir',
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  const executeAiManualShutdown = (target = 'ALL') => {
    if (!isAnyOn && target === 'ALL') return;
    setAiProcessing(true);

    setTimeout(() => {
      let updated: Record<string, boolean> = { ...controls };
      let affectedCount = 0;

      if (target === 'ALL') {
        affectedCount = Object.values(controls).filter(Boolean).length;
        updated = {};
      } else {
        const floorObj = FLOORS.find(f => f.name === target);
        if (floorObj) {
          floorObj.rooms.forEach(r => {
            if (updated[r.id]) {
              delete updated[r.id];
              affectedCount++;
            }
          });
        }
      }

      setControls(updated);
      localStorage.setItem('smartControlsExpanded', JSON.stringify(updated));

      const newLog = {
        time: new Date().toLocaleTimeString(),
        device: `AI Agent (${target === 'ALL' ? 'Campus-Wide' : target})`,
        action: `AI Manually Powered Down ${affectedCount} facility room(s)`
      };
      const updatedLogs = [newLog, ...logs].slice(0, 50);
      setLogs(updatedLogs);
      localStorage.setItem('smartControlLogsExpanded', JSON.stringify(updatedLogs));

      fetch('/api/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: 'AI_SHUTDOWN', label: `AI Manual: ${target}`, isOn: false })
      }).catch(() => {});

      setAiProcessing(false);
      setAiReport(`🤖 AI Manual Execution Complete: Powered down ${affectedCount} room(s). Master LED is now GREEN.`);
      setTimeout(() => setAiReport(null), 6000);
    }, 600);
  };

  const executeSchedule6PmCutoff = () => {
    if (soundEnabled) playAlertSound();
    const affectedCount = Object.values(controls).filter(Boolean).length;
    setControls({});
    localStorage.setItem('smartControlsExpanded', JSON.stringify({}));

    const newLog = {
      time: new Date().toLocaleTimeString(),
      device: 'Schedule Engine (6:00 PM Close)',
      action: `Campus operating schedule ended (6:00 PM). Auto-powered down ${affectedCount} switches.`
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));

    setActionNotification({
      title: '🔔 6:00 PM Schedule Cutoff Enforced',
      message: `Operating schedule ended (09:00 AM – 06:00 PM). Facility-wide auto-off turned OFF all ${affectedCount} switches. Master LED is GREEN.`,
      type: 'schedule',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 8000);

    fetch('/api/schedule/trigger-6pm', { method: 'POST' }).catch(() => {});
  };

  const executeAutoOffCountdownExpiry = () => {
    if (soundEnabled) playAlertSound();
    const affectedCount = Object.values(controls).filter(Boolean).length;
    setControls({});
    localStorage.setItem('smartControlsExpanded', JSON.stringify({}));

    const newLog = {
      time: new Date().toLocaleTimeString(),
      device: 'Auto-Off Countdown Timer',
      action: `Timer reached 0: Powered down all ${affectedCount} active campus switches.`
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));

    setActionNotification({
      title: '⏱️ Auto-Off Timer Complete',
      message: `Configured countdown timer completed. All ${affectedCount} campus switches turned OFF. Master LED is GREEN.`,
      type: 'timer',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 8000);

    fetch('/api/timer/auto-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'trigger_now' })
    }).catch(() => {});
  };

  const handleStartTimer = (seconds?: number) => {
    const sec = seconds || timerPresetSec;
    setTimerSecondsLeft(sec);
    setTimerRunning(true);
    if (soundEnabled) playAlertSound();

    fetch('/api/timer/auto-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', durationSeconds: sec })
    }).catch(() => {});
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
    fetch('/api/timer/auto-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pause' })
    }).catch(() => {});
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSecondsLeft(null);
    fetch('/api/timer/auto-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' })
    }).catch(() => {});
  };

  const toggleOccupancy = (roomId: string) => {
    const currentOccupied = !!occupancy[roomId];
    const newOccupied = !currentOccupied;
    const updatedOccupancy = { ...occupancy, [roomId]: newOccupied };
    setOccupancy(updatedOccupancy);

    const roomObj = CLASSROOM_SUITES.find(c => c.id === roomId);
    const roomLabel = roomObj ? roomObj.name : roomId;

    if (!newOccupied && controls[roomId]) {
      setActionNotification({
        title: '⏳ Room Vacated — Auto-Off in 4s',
        message: `${roomLabel} vacated with switch ON. 4-second autonomous switch-off engaged (No manual action needed).`,
        type: 'pir',
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 5000);
    } else if (newOccupied && controls[roomId]) {
      setActionNotification({
        title: '👤 Students In Room (Protected)',
        message: `Students entered ${roomLabel}. Switch remains safely ON for active lecture without shutoff.`,
        type: 'pir',
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 4000);
    }

    fetch('/api/occupancy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, isOccupied: newOccupied })
    }).catch(() => {});
  };

  const activateAllClassroomSwitches = () => {
    const allOn: Record<string, boolean> = {};
    CLASSROOM_IDS.forEach(id => {
      allOn[id] = true;
    });
    setControls(prev => ({ ...prev, ...allOn }));
    localStorage.setItem('smartControlsExpanded', JSON.stringify({ ...controls, ...allOn }));

    fetch('/api/controls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: 'ALL_ON_CLASSROOMS', isOn: true })
    }).catch(() => {});

    setActionNotification({
      title: '⚡ All 20 Campus Rooms Powered ON (Demo)',
      message: 'Demo Setup: Empty rooms will automatically switch OFF in 4 seconds! Occupied rooms remain ON safely.',
      type: 'pir',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 6000);
  };

  const markAllClassroomsEmpty = () => {
    // ONLY empty rooms are switched OFF when clicking Simulate All Empty!
    // Occupied rooms strictly STAY ON!
    const emptyAndOnRooms = CLASSROOM_IDS.filter(id => controls[id] && !occupancy[id]);
    const occupiedAndOnRooms = CLASSROOM_IDS.filter(id => controls[id] && occupancy[id]);

    if (emptyAndOnRooms.length === 0) {
      if (occupiedAndOnRooms.length > 0) {
        setActionNotification({
          title: '👥 Occupied Rooms Protected',
          message: `Zero energy waste in empty rooms. All ${occupiedAndOnRooms.length} active room(s) are currently OCCUPIED with students and safely kept ON.`,
          type: 'pir',
          time: new Date().toLocaleTimeString()
        });
      } else {
        setActionNotification({
          title: '✨ All Empty Classrooms Already OFF',
          message: 'No empty classrooms have active switches. Click "Turn ON All Rooms (Demo)" to energize loads, then test auto-off for empty rooms.',
          type: 'pir',
          time: new Date().toLocaleTimeString()
        });
      }
      setTimeout(() => setActionNotification(null), 5000);
      return;
    }

    // Power down ONLY the empty rooms!
    const updatedControls = { ...controls };
    emptyAndOnRooms.forEach(id => {
      updatedControls[id] = false;
    });

    setControls(updatedControls);
    localStorage.setItem('smartControlsExpanded', JSON.stringify(updatedControls));

    const newLog = {
      time: new Date().toLocaleTimeString(),
      device: 'PIR Empty Room Engine',
      action: `Auto-powered down ONLY ${emptyAndOnRooms.length} empty room(s). Kept ${occupiedAndOnRooms.length} occupied room(s) ON.`
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));

    setActionNotification({
      title: '📭 Only Empty Rooms Switched OFF',
      message: `PIR Detector: Auto-powered down ${emptyAndOnRooms.length} empty room(s). ${occupiedAndOnRooms.length} occupied room(s) remain safely ON for students.`,
      type: 'pir',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 6000);

    fetch('/api/occupancy/sweep', { method: 'POST' }).catch(() => {});
  };

  const sweepEmptyClassrooms = () => {
    const emptyAndOn = CLASSROOM_IDS.filter(id => controls[id] && !occupancy[id]);
    if (emptyAndOn.length === 0) {
      setActionNotification({
        title: '✨ Zero Waste Detected',
        message: 'All empty classrooms already have their switches powered OFF. No actions needed.',
        type: 'pir',
        time: new Date().toLocaleTimeString()
      });
      setTimeout(() => setActionNotification(null), 4000);
      return;
    }

    const updated = { ...controls };
    emptyAndOn.forEach(id => {
      delete updated[id];
    });
    setControls(updated);
    localStorage.setItem('smartControlsExpanded', JSON.stringify(updated));

    fetch('/api/schedule/sweep-empty-classrooms', { method: 'POST' }).catch(() => {});

    const newLog = {
      time: new Date().toLocaleTimeString(),
      device: 'Automated Facility Sweep',
      action: `Auto-powered down ${emptyAndOn.length} empty classroom(s) with switches left ON.`
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));

    setActionNotification({
      title: '🧹 Empty Classroom Auto-Off Sweep Complete',
      message: `Successfully turned OFF switches in ${emptyAndOn.length} empty classroom(s). Master LED is now GREEN.`,
      type: 'pir',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 6000);
  };

  const getEventMeta = (log: { device: string; action: string }) => {
    const d = (log.device || '').toLowerCase();
    const a = (log.action || '').toLowerCase();

    if (d.includes('autonomous') || d.includes('4s') || a.includes('4s') || a.includes('idle vacancy') || a.includes('shutoff')) {
      return {
        category: 'auto_off',
        label: '⚡ 4s Autonomous Auto-Off',
        badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/50',
        dotColor: 'bg-rose-500 shadow-rose-500/50',
        icon: Timer,
        tag: 'PIR Power-Cut'
      };
    }
    if (d.includes('pir') || a.includes('vacan') || a.includes('occupied') || a.includes('entered') || a.includes('empty') || a.includes('sweep')) {
      return {
        category: 'pir',
        label: '👤 PIR Occupancy Sensor',
        badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50',
        dotColor: 'bg-cyan-400 shadow-cyan-500/50',
        icon: Users,
        tag: 'Motion Telemetry'
      };
    }
    if (d.includes('schedule') || d.includes('timer') || a.includes('schedule') || a.includes('cutoff') || a.includes('operating schedule')) {
      return {
        category: 'schedule',
        label: '⏰ Schedule & Timer Policy',
        badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/50',
        dotColor: 'bg-amber-400 shadow-amber-500/50',
        icon: Clock,
        tag: 'Policy Enforced'
      };
    }
    if (d.includes('ai') || a.includes('ai manual') || a.includes('optimization')) {
      return {
        category: 'ai',
        label: '🤖 AI Energy Agent',
        badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/50',
        dotColor: 'bg-purple-400 shadow-purple-500/50',
        icon: Sparkles,
        tag: 'Autonomous Optimization'
      };
    }
    return {
      category: 'manual',
      label: '🔌 Manual Circuit Override',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50',
      dotColor: 'bg-emerald-400 shadow-emerald-500/50',
      icon: Power,
      tag: 'Operator Action'
    };
  };

  const filteredEvents = React.useMemo(() => {
    return logs.filter(log => {
      const meta = getEventMeta(log);
      if (eventFilter !== 'all' && meta.category !== eventFilter) return false;
      if (eventSearchQuery.trim()) {
        const q = eventSearchQuery.toLowerCase();
        const matchesDevice = (log.device || '').toLowerCase().includes(q);
        const matchesAction = (log.action || '').toLowerCase().includes(q);
        const matchesTime = (log.time || '').toLowerCase().includes(q);
        const matchesCat = meta.label.toLowerCase().includes(q);
        return matchesDevice || matchesAction || matchesTime || matchesCat;
      }
      return true;
    });
  }, [logs, eventFilter, eventSearchQuery]);

  const eventCounts = React.useMemo(() => {
    const counts = { all: logs.length, auto_off: 0, pir: 0, schedule: 0, ai: 0, manual: 0 };
    logs.forEach(log => {
      const meta = getEventMeta(log);
      if (meta.category in counts) {
        counts[meta.category as keyof typeof counts]++;
      }
    });
    return counts;
  }, [logs]);

  const exportEventLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `niis_facility_event_stream_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const clearEventLogs = () => {
    setLogs([]);
    localStorage.removeItem('smartControlLogsExpanded');
    setActionNotification({
      title: '🧹 Event Stream Cleared',
      message: 'Facility event buffer reset. New events will appear live as actions occur.',
      type: 'pir',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 4000);
  };

  const simulateTestEvent = () => {
    const roomSample = CLASSROOM_SUITES[Math.floor(Math.random() * CLASSROOM_SUITES.length)];
    const simulatedLog = {
      time: new Date().toLocaleTimeString(),
      device: `Autonomous Shutoff (${roomSample.name})`,
      action: `Auto-switched OFF after 4s idle vacancy (Zero manual intervention). Continuous siren silenced.`
    };
    setLogs(prev => [simulatedLog, ...prev].slice(0, 50));
    if (soundEnabled) playAlertSound();
    setActionNotification({
      title: '⚡ Simulated Event Injected',
      message: `Generated realistic 4s auto-off telemetry event for ${roomSample.name}.`,
      type: 'pir',
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActionNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Center Top Operations Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-3.5 px-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-xs tracking-wider uppercase">NIIS CampusIQ &bull; Executive Operations Hub</span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-md border border-slate-700">
            Latency: 12ms &bull; 48 Sensors Online
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Master LED readout */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className={`w-2.5 h-2.5 rounded-full ${isAnyOn ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-bold text-[11px]">
              Master Load: <strong className={isAnyOn ? 'text-rose-400' : 'text-emerald-400'}>{isAnyOn ? 'RED (Active)' : 'GREEN (Idle)'}</strong>
            </span>
          </div>

          {/* Schedule status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Schedule: <strong className={isWithinSchedule ? 'text-emerald-400' : 'text-amber-400'}>{isWithinSchedule ? '09:00 - 18:00 (Open)' : 'Closed'}</strong></span>
          </div>

          {/* Live Clock */}
          <span className="text-slate-400 font-mono text-[11px]">{currentTimeFormatted}</span>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotification && (
        <div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 ${
          actionNotification.type === 'schedule' 
            ? 'bg-blue-50 border-blue-200 text-blue-950'
            : actionNotification.type === 'timer'
            ? 'bg-purple-50 border-purple-200 text-purple-950'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl text-white mt-0.5 shadow-xs ${
              actionNotification.type === 'schedule' ? 'bg-blue-600' : actionNotification.type === 'timer' ? 'bg-purple-600' : 'bg-emerald-600'
            }`}>
              {actionNotification.type === 'schedule' ? <Clock className="w-4 h-4" /> : actionNotification.type === 'timer' ? <Timer className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>{actionNotification.title}</span>
                <span className="text-[10px] opacity-75 font-mono">[{actionNotification.time}]</span>
              </div>
              <p className="text-xs mt-0.5 leading-relaxed font-medium">
                {actionNotification.message}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActionNotification(null)}
            className="text-slate-400 hover:text-slate-700 font-bold text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Campus Hero Aerial Banner with Live Verified Coordinates */}
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-80 w-full group overflow-hidden">
          <img 
            src="/campus_aerial.jpg" 
            alt="NIIS Sarada Vihar Campus Aerial View" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
          
          <div className="absolute bottom-5 left-6 right-6 flex flex-col md:flex-row justify-between md:items-end gap-3 text-white">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-primary-600/95 backdrop-blur-md text-white text-[11px] font-bold rounded-lg uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Aerial Geospatial View
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black drop-shadow-md tracking-tight">
                {INSTITUTION_INFO.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-200 mt-0.5">
                {INSTITUTION_INFO.location} &bull; 10 Acres Sustainable Smart Facility
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
                <div className="text-[11px] text-slate-300 font-medium">Sustainability Index</div>
                <div className="text-2xl font-black text-emerald-400 flex items-center justify-end gap-1.5">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> {DEMO_DATA.sustainabilityScore}/100
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
                <div className="text-[11px] text-slate-300 font-medium">Solar Grid Offset</div>
                <div className="text-2xl font-black text-amber-300 font-mono">36.4%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Campus Footprint</span>
              <span className="font-semibold text-slate-900">{INSTITUTION_INFO.campusInfo.area} (Sarada Vihar)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Built-up Facility</span>
              <span className="font-semibold text-slate-900">{INSTITUTION_INFO.campusInfo.builtUpArea}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Academic Programs</span>
              <span className="font-semibold text-slate-900">MBA &bull; MCA &bull; BBA &bull; BCA &bull; BSc</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Smart Automation</span>
              <span className="font-semibold text-emerald-600">20 Armed PIR Sensor Nodes</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Real-Time Live KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Live Energy Draw" 
          value={`${telemetry.energyUsage} kWh`} 
          icon={<Zap className="text-amber-500 w-5 h-5" />} 
          status={telemetry.energyUsage > 500 ? "High" : "Normal"} 
          subtitle="3-Phase Substation Total"
        />
        <KPICard 
          title="Live Water Volume" 
          value={`${telemetry.waterUsage.toLocaleString()} L`} 
          icon={<Droplets className="text-blue-500 w-5 h-5" />} 
          status="Normal" 
          subtitle="All 4 Reservoirs Level"
        />
        <KPICard 
          title="Indoor Air Quality" 
          value={`AQI ${telemetry.airQuality}`} 
          icon={<Wind className="text-emerald-500 w-5 h-5" />} 
          status={telemetry.airQuality > 100 ? "Moderate" : "Good"} 
          subtitle="CO2: 410 ppm (Optimal)"
        />
        <KPICard 
          title="Ultrasonic Bin Fleet" 
          value={`${telemetry.wasteLevel}%`} 
          icon={<Trash2 className="text-rose-500 w-5 h-5" />} 
          status="Normal" 
          subtitle="Zero Overflows"
        />
        <KPICard 
          title="Facility Space Utilization" 
          value={`${DEMO_DATA.assets.utilization}%`} 
          icon={<Building2 className="text-purple-500 w-5 h-5" />} 
          status="Normal" 
          subtitle="18/20 Facilities In Use"
        />
        <KPICard 
          title="Active Room Switches" 
          value={`${activeCount} / 20 Rooms`} 
          icon={<Power className={isAnyOn ? "text-rose-500 w-5 h-5" : "text-emerald-500 w-5 h-5"} />} 
          status={isAnyOn ? "Attention" : "Normal"} 
          subtitle={isAnyOn ? "Load Energized" : "Zero Waste"}
        />
        <KPICard 
          title="Master Indicator LED" 
          value={isAnyOn ? "RED (Active)" : "GREEN (Zero Idle)"} 
          icon={<div className={`w-3.5 h-3.5 rounded-full ${isAnyOn ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />} 
          status={isAnyOn ? "Attention" : "Normal"} 
          subtitle={isAnyOn ? "Active Campus Draw" : "100% Eco Standby"}
        />
        <KPICard 
          title="Campus Security Siren" 
          value={isSirenWailing ? "🚨 Wailing (Alarm)" : "Normal / Armed"} 
          icon={<ShieldCheck className="text-emerald-500 w-5 h-5" />} 
          status={isSirenWailing ? "High" : "Normal"} 
          subtitle="Continuous Empty Room Alarm"
        />
      </div>

      {/* Master Campus Load Indicator & Emergency Siren Toolbar */}
      <Card className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-8 h-8 rounded-full border-2 border-white/80 shadow-md flex items-center justify-center transition-all ${
              isAnyOn 
                ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/40 shadow-rose-600/50' 
                : 'bg-emerald-500 ring-4 ring-emerald-500/30 shadow-emerald-500/50'
            }`}>
              <div className="w-2.5 h-2.5 rounded-full bg-white opacity-95" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span>CAMPUS MASTER LOAD INDICATOR:</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isAnyOn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {isAnyOn ? '🔴 RED LED (LOAD ACTIVE)' : '🟢 GREEN LED (ALL ROOMS OFF)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {isAnyOn 
                  ? (CLASSROOM_IDS.some(id => controls[id] && !occupancy[id])
                      ? '🚨 Alert: Empty room has switch ON! Emergency siren is wailing continuously until turned OFF.'
                      : `Active loads detected in ${activeCount} room(s). Occupied rooms strictly mute the siren.`)
                  : 'Zero idle power waste: All 20 campus facilities are safely powered down.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => {
                if (soundEnabled && isSirenWailing) {
                  stopContinuousSiren();
                  setTestSirenManual(false);
                }
                setSoundEnabled(!soundEnabled);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                soundEnabled 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {soundEnabled ? 'Siren Audio: ON' : 'Siren Muted'}
            </button>

            <button
              onClick={() => {
                if (isSirenWailing) {
                  setTestSirenManual(false);
                  stopContinuousSiren();
                } else {
                  setSoundEnabled(true);
                  setTestSirenManual(true);
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                isSirenWailing 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {isSirenWailing ? 'Stop Continuous Siren' : 'Test Continuous Siren'}
            </button>

            {isAnyOn && (
              <button
                onClick={() => executeAiManualShutdown('ALL')}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" />
                Emergency Power Down ({activeCount} Active)
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Operating Schedule (9:00 AM - 6:00 PM) & Countdown Auto-Off Engine */}
      <Card className="p-5 bg-gradient-to-br from-blue-50/50 via-indigo-50/20 to-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Campus Operating Schedule & Auto-Off Engine</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase rounded-full">
                  09:00 AM – 06:00 PM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Enforces automated power down at 6:00 PM daily. Countdown timers allow scheduled facility shutoff.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={executeSchedule6PmCutoff}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              Test 6:00 PM Auto-Cutoff
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Schedule Window Details */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-700">Official Operational Window</span>
                <span className="font-mono text-blue-600 font-bold">Mon – Sat &bull; 09:00 – 18:00</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                During 9:00 AM – 6:00 PM, classrooms and administrative facilities operate normally. At the 6:00 PM bell, all circuits are auto-isolated to guarantee zero overnight load.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-600 font-medium">Auto-Cutoff Policy: <strong className="text-emerald-600">Active</strong></span>
              <span className="text-slate-400 font-mono">Next Cutoff: 18:00</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-indigo-600" />
                  Auto-Off Countdown Timer
                </span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                  timerRunning ? 'bg-purple-100 text-purple-800 animate-pulse' : 'bg-slate-100 text-slate-600'
                }`}>
                  {timerRunning && timerSecondsLeft !== null 
                    ? `Auto-Off in ${Math.floor(timerSecondsLeft / 60)}m ${timerSecondsLeft % 60}s` 
                    : 'Timer Idle'}
                </span>
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: '10s (Test)', sec: 10 },
                  { label: '1 Min', sec: 60 },
                  { label: '15 Min', sec: 900 },
                  { label: '30 Min', sec: 1800 },
                ].map((p) => (
                  <button
                    key={p.sec}
                    onClick={() => {
                      setTimerPresetSec(p.sec);
                      if (timerRunning) handleStartTimer(p.sec);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                      timerPresetSec === p.sec 
                        ? 'bg-indigo-600 text-white border-indigo-700' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {!timerRunning ? (
                <button
                  onClick={() => handleStartTimer()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Start Timer ({timerPresetSec >= 60 ? `${Math.floor(timerPresetSec / 60)}m` : `${timerPresetSec}s`})
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              )}

              {timerSecondsLeft !== null && (
                <button
                  onClick={handleResetTimer}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}

              <button
                onClick={() => executeAutoOffCountdownExpiry()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 ml-auto cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" /> Force Cutoff Now
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Empty Classroom & Facility Detector (IoT PIR Sensor Engine) - 20 Rooms */}
      <Card className="p-5 border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-teal-50/20 to-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Empty Classroom & Facility Detector (IoT PIR Sensor Engine)</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded-full">
                  20 Campus Rooms Armed
                </span>
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3 text-rose-600" />
                  ⚡ 4s Autonomous Auto-Off (No Manual Action)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time passive infrared (PIR) sensing. Rooms detected as NOT IN USE automatically switch OFF in 4 seconds with zero manual intervention. Occupied rooms remain ON safely.
              </p>
            </div>
          </div>

          {/* Quick Demo Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={activateAllClassroomSwitches}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              Turn ON All Rooms (Demo)
            </button>

            <button
              onClick={markAllClassroomsEmpty}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Click to power down ONLY empty rooms. Occupied rooms remain ON!"
            >
              <UserX className="w-3.5 h-3.5" />
              Simulate All Empty (Auto-Off Empty Only)
            </button>

            <button
              onClick={sweepEmptyClassrooms}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Sweep Vacant Rooms
            </button>
          </div>
        </div>

        {/* Floor Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 p-2 bg-emerald-100/40 rounded-xl border border-emerald-200/70">
          <span className="text-xs font-black uppercase text-emerald-950 px-2 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" /> Floor:
          </span>
          {[
            { id: 'All', label: 'All Facilities (20 Rooms)' },
            { id: 'Ground Floor', label: 'Ground Floor (5)' },
            { id: '1st Floor', label: '1st Floor (6)' },
            { id: '2nd Floor', label: '2nd Floor (3)' },
            { id: 'Top Floor', label: 'Top Floor (6)' }
          ].map((tab) => {
            const isSelected = selectedDetectorFloor === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDetectorFloor(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 20 Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(selectedDetectorFloor === 'All' 
            ? CLASSROOM_SUITES 
            : CLASSROOM_SUITES.filter(c => c.floor === selectedDetectorFloor)
          ).map((classroom) => {
            const isOccupied = !!occupancy[classroom.id];
            const isOn = !!controls[classroom.id];
            const isEmptyAndOn = !isOccupied && isOn;

            return (
              <div 
                key={classroom.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isEmptyAndOn
                    ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/40 shadow-sm'
                    : isOn
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{classroom.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{classroom.floor} &bull; {classroom.capacity}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {classroom.loadKw} kW
                    </span>
                  </div>

                  {/* Switch Control */}
                  <div className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                    isOn ? 'bg-emerald-100/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Circuit Power</span>
                      <span className={`text-xs font-bold flex items-center gap-1.5 mt-0.5 ${isOn ? 'text-emerald-700' : 'text-slate-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        {isOn ? 'ACTIVE (ON)' : 'OFF'}
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isOn} 
                        onChange={() => toggleControl(classroom.id, classroom.name, classroom.floor)} 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 transition-all duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 peer-checked:after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-xs"></div>
                    </label>
                  </div>

                  {/* PIR Sensor Indicator & Toggle */}
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-semibold">PIR Status:</span>
                    <button
                      type="button"
                      onClick={() => toggleOccupancy(classroom.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                        isOccupied 
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300' 
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 animate-pulse'
                      }`}
                      title="Click to toggle PIR sensor"
                    >
                      {isOccupied ? (
                        <><Users className="w-3 h-3 text-emerald-700" /> Occupied</>
                      ) : (
                        <><UserX className="w-3 h-3 text-amber-700" /> Empty</>
                      )}
                    </button>
                  </div>

                  {/* 4-Second Autonomous Auto-Off Countdown Badge if Vacant & Switch is ON */}
                  {isEmptyAndOn && (
                    <div className="mt-2.5 text-[11px] font-bold text-rose-950 bg-rose-100/90 border border-rose-300 p-2 rounded-xl flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 animate-bounce" />
                        <span className="leading-tight">Not in use! Auto-off in:</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-md text-xs font-mono font-black shadow-xs animate-pulse">
                        {emptyRoomCountdowns[classroom.id] !== undefined ? `${emptyRoomCountdowns[classroom.id]}s` : '4s'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Type: {classroom.type}</span>
                  <button
                    type="button"
                    onClick={() => toggleOccupancy(classroom.id)}
                    className="text-primary-600 font-bold hover:underline cursor-pointer"
                  >
                    Simulate {isOccupied ? 'Exit' : 'Enter'} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI Energy Optimization Agent */}
      <Card className="p-5 bg-gradient-to-r from-purple-50/70 via-indigo-50/30 to-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-purple-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">CampusIQ AI Autonomous Energy Agent</h3>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase rounded-full">
                  Policy Enforcer
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isAnyOn ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isAnyOn ? `${activeCount} Active Loads` : 'Zero Waste'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {isAnyOn 
                  ? `AI Real-Time Telemetry: Detected ${activeCount} room(s) powered ON. Click below to execute automated facility power-down.` 
                  : 'AI Real-Time Telemetry: All campus circuits are in optimal low-power standby. Master LED is GREEN.'}
              </p>
              {aiReport && (
                <div className="mt-2 text-xs font-bold text-purple-950 bg-purple-100 border border-purple-300 p-2 rounded-xl flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-purple-700 flex-shrink-0" />
                  {aiReport}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end">
            <button
              disabled={!isAnyOn || aiProcessing}
              onClick={() => executeAiManualShutdown('ALL')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer ${
                !isAnyOn
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
              }`}
            >
              {aiProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI Enforcing Shutdown...
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  AI: Power Down All Switches ({activeCount} Active)
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* LIVE FACILITY EVENT STREAM & HARDWARE DIGITAL TWIN */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Live Facility Event Stream Console (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-inner">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      Live Facility Event Stream
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      LIVE FEED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time WebSocket telemetry &bull; Tamper-evident campus automation event ledger
                  </p>
                </div>
              </div>

              {/* Stream Action Toolbar */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={simulateTestEvent}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Simulate a real-time event to test the stream"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Event</span>
                </button>

                <button
                  type="button"
                  onClick={exportEventLogs}
                  disabled={logs.length === 0}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Download event stream as JSON audit file"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={clearEventLogs}
                  disabled={logs.length === 0}
                  className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl border border-slate-700 transition cursor-pointer"
                  title="Clear event buffer"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Real-Time Telemetry Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 relative z-10">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Events</span>
                <div className="text-xl font-black text-white font-mono mt-1">{logs.length}</div>
                <span className="text-[9px] text-emerald-400 font-semibold mt-0.5">● Buffer Active</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">4s Auto-Offs</span>
                <div className="text-xl font-black text-rose-400 font-mono mt-1">{eventCounts.auto_off}</div>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Zero manual clicks</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">PIR Triggers</span>
                <div className="text-xl font-black text-cyan-300 font-mono mt-1">{eventCounts.pir}</div>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Motion Engine</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Stream Health</span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> &lt; 12ms
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">WebSocket Synced</span>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="space-y-2.5 mb-4 relative z-10">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: `All Events (${eventCounts.all})` },
                  { id: 'auto_off', label: `⚡ 4s Auto-Off (${eventCounts.auto_off})` },
                  { id: 'pir', label: `👤 PIR Sensors (${eventCounts.pir})` },
                  { id: 'schedule', label: `⏰ Schedule (${eventCounts.schedule})` },
                  { id: 'ai', label: `🤖 AI Policy (${eventCounts.ai})` },
                  { id: 'manual', label: `🔌 Manual (${eventCounts.manual})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEventFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                      eventFilter === tab.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  placeholder="Filter event feed by room name, circuit, action..."
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                {eventSearchQuery && (
                  <button
                    onClick={() => setEventSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Stream Event List */}
            <div className="relative z-10">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
                  <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
                  <p className="font-semibold text-slate-300">
                    {logs.length === 0 ? 'No events recorded in buffer yet.' : 'No events match the current filter.'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {logs.length === 0 
                      ? 'Toggle any room switch or simulate vacancy above to view real-time events.'
                      : 'Try resetting filters or search query.'}
                  </p>
                  {logs.length === 0 && (
                    <button
                      type="button"
                      onClick={simulateTestEvent}
                      className="mt-3 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Sample Event
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-h-[440px] overflow-y-auto space-y-2 pr-1 custom-dark-scrollbar">
                  {filteredEvents.map((log, index) => {
                    const meta = getEventMeta(log);
                    const IconComp = meta.icon;
                    const isNewest = index === 0;

                    return (
                      <div
                        key={`${log.time}-${index}`}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col gap-2 relative overflow-hidden group ${
                          isNewest
                            ? 'bg-slate-800/90 border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Event Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`p-1.5 rounded-lg border flex-shrink-0 ${meta.badgeClass}`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                                  {log.device}
                                </span>
                                {isNewest && (
                                  <span className="px-1.5 py-0.2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-black rounded-md uppercase">
                                    LATEST
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                              {log.time}
                            </span>
                          </div>
                        </div>

                        {/* Event Action / Message */}
                        <div className="text-xs text-slate-300 font-medium pl-8 leading-relaxed">
                          {log.action}
                        </div>

                        {/* Event Metadata Chips */}
                        <div className="flex items-center justify-between pl-8 pt-1 text-[10px] text-slate-500 border-t border-slate-900">
                          <span className="flex items-center gap-1 text-slate-400 font-mono">
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                            {meta.label}
                          </span>
                          <span className="font-mono text-slate-500">
                            Verified Ledger &bull; &lt;15ms
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Tamper-evident audit ledger</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-400 font-mono">ISO 50001 Architecture</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400">
                Showing {filteredEvents.length} of {logs.length} logged events
              </span>
            </div>
          </div>
        </div>

        {/* Embedded Wokwi Hardware Digital Twin (5 Cols) */}
        <div className="xl:col-span-5">
          <Card className="overflow-hidden flex flex-col border border-slate-800 bg-slate-900 rounded-3xl shadow-2xl">
            <div className="bg-slate-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="p-1.5 bg-emerald-950 border border-emerald-500/40 rounded-lg text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white">ESP32 Hardware Digital Twin</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-normal">Physical IoT Emulation</span>
                </div>
              </div>
              <a
                href="https://wokwi.com/projects/476613374589923329"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 text-[11px] font-bold rounded-lg border border-amber-500/30 transition flex items-center gap-1"
              >
                <span>Full Screen</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-[520px] bg-slate-950">
              <iframe
                src="https://wokwi.com/projects/476613374589923329"
                title="CampusIQ ESP32 Live Hardware Simulator"
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Wokwi FreeRTOS Firmware: Active</span>
              <span className="text-emerald-400 font-mono font-bold">● Hardware Serial Ready</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  status: "Normal" | "Attention" | "Moderate" | "Good" | "High";
  subtitle?: string;
}

function KPICard({ title, value, icon, status, subtitle }: KPICardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Normal":
      case "Good":
        return "text-emerald-700 bg-emerald-50 border-emerald-200/80";
      case "Moderate":
      case "Attention":
        return "text-amber-700 bg-amber-50 border-amber-200/80";
      case "High":
        return "text-rose-700 bg-rose-50 border-rose-200/80";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200/80";
    }
  };

  return (
    <Card className="p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">{icon}</div>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <div className="text-xl font-black text-slate-900 tracking-tight">{value}</div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      {subtitle && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          {subtitle}
        </div>
      )}
    </Card>
  );
}
