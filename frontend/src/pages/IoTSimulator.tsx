import React from 'react';
import { Card, DemoBadge } from '../components/ui';
import { Cpu, ExternalLink, PlayCircle, Clock, Volume2, ShieldAlert } from 'lucide-react';

export default function IoTSimulator() {
  const simulationUrl = "https://wokwi.com/projects/476613374589923329";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-7 h-7 text-amber-500" />
            CampusIQ Live IoT Hardware Simulator
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Integrated Wokwi ESP32 digital twin running live firmware with ultrasonic sensing, 7 PM automated power scheduling, and acoustic alert system.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={simulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all"
          >
            Open Full Screen on Wokwi
            <ExternalLink className="w-4 h-4" />
          </a>
          <DemoBadge />
        </div>
      </div>

      {/* Feature Guide Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-red-500">
          <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">1+ Device ON &rarr; RED LED</div>
            <div className="text-xs text-gray-500">Any light/fan/AC active keeps LED permanently RED</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-green-500">
          <div className="p-2.5 bg-green-100 text-green-700 rounded-xl">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">All Devices OFF &rarr; GREEN LED</div>
            <div className="text-xs text-gray-500">Only turns green when all facilities are powered down</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-amber-500">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">7 PM Night Cutoff & Buzzer</div>
            <div className="text-xs text-gray-500">Acoustic alarm sounds if devices remain ON past 19:00</div>
          </div>
        </Card>
      </div>

      {/* Embedded Wokwi Simulator */}
      <Card className="overflow-hidden border-2 border-gray-200 shadow-md">
        <div className="bg-gray-900 text-gray-200 px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            ESP32 Virtual Microcontroller Node &bull; Live Canvas
          </div>
          <span className="text-xs text-gray-400">Click Play (▶) below to start simulation</span>
        </div>
        <div className="w-full h-[650px] bg-gray-950">
          <iframe
            src={simulationUrl}
            title="Wokwi ESP32 CampusIQ Simulation"
            className="w-full h-full border-0"
            allow="fullscreen; clipboard-read; clipboard-write"
          />
        </div>
      </Card>
    </div>
  );
}
