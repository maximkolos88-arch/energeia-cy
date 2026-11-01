import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Sun, 
  Wind, 
  Flame, 
  BatteryCharging, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  ChevronDown, 
  Radio,
  TrendingDown,
  Layers
} from 'lucide-react';
import { SimulationPreset, TelemetryState } from '../types/helios';

export interface HeliosTelemetryHUDProps {
  telemetry: TelemetryState;
  onSelectPreset: (preset: SimulationPreset) => void;
  className?: string;
}

export const PRESET_CONFIGS: Record<SimulationPreset, Omit<TelemetryState, 'frequencyHz' | 'timestamp' | 'preset'>> = {
  live: {
    totalDemandMw: 685,
    solarGenerationMw: 440,
    windGenerationMw: 40,
    thermalGenerationMw: 205,
    storageDischargeMw: 0,
    curtailedMw: 110,
    curtailmentPct: 18.2
  },
  midday: {
    totalDemandMw: 620,
    solarGenerationMw: 580,
    windGenerationMw: 35,
    thermalGenerationMw: 160,
    storageDischargeMw: 0,
    curtailedMw: 195,
    curtailmentPct: 24.8
  },
  evening: {
    totalDemandMw: 890,
    solarGenerationMw: 0,
    windGenerationMw: 45,
    thermalGenerationMw: 785,
    storageDischargeMw: 60,
    curtailedMw: 0,
    curtailmentPct: 0
  },
  night: {
    totalDemandMw: 380,
    solarGenerationMw: 0,
    windGenerationMw: 55,
    thermalGenerationMw: 325,
    storageDischargeMw: 0,
    curtailedMw: 0,
    curtailmentPct: 0
  }
};

export const HeliosTelemetryHUD: React.FC<HeliosTelemetryHUDProps> = ({
  telemetry,
  onSelectPreset,
  className = ''
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  // Micro-fluctuate frequency around 50.00 Hz
  const [liveFreq, setLiveFreq] = useState(telemetry.frequencyHz || 50.02);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 0.03;
      setLiveFreq(prev => +(Math.max(49.92, Math.min(50.08, prev + delta))).toFixed(2));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const totalGen = telemetry.solarGenerationMw + telemetry.windGenerationMw + telemetry.thermalGenerationMw + telemetry.storageDischargeMw;
  const resGen = telemetry.solarGenerationMw + telemetry.windGenerationMw;
  const resSharePct = totalGen > 0 ? ((resGen / totalGen) * 100).toFixed(1) : '0.0';

  const solarPct = totalGen > 0 ? (telemetry.solarGenerationMw / totalGen) * 100 : 0;
  const windPct = totalGen > 0 ? (telemetry.windGenerationMw / totalGen) * 100 : 0;
  const thermalPct = totalGen > 0 ? (telemetry.thermalGenerationMw / totalGen) * 100 : 0;
  const storagePct = totalGen > 0 ? (telemetry.storageDischargeMw / totalGen) * 100 : 0;

  const isFreqStable = liveFreq >= 49.95 && liveFreq <= 50.05;

  return (
    <div className={`bg-[#121315]/95 backdrop-blur-md border border-[#23272A] rounded-2xl p-3 sm:p-4 text-slate-200 select-none shadow-2xl ${className}`}>
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 items-center">
        
        {/* Metric 1: Grid Frequency */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181A1C] border border-[#282B30]">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#23272A] shrink-0">
            <Radio className={`w-4 h-4 ${isFreqStable ? 'text-[#00E676]' : 'text-[#FFB300]'}`} />
            <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${isFreqStable ? 'bg-[#00E676] animate-ping' : 'bg-[#FFB300]'}`} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA0A6] block truncate">
              TSOC Grid Freq
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">
                {liveFreq.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-[#9AA0A6]">Hz</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Island Demand */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181A1C] border border-[#282B30]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA0A6] block truncate">
              Island Demand
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">
                {telemetry.totalDemandMw}
              </span>
              <span className="text-[10px] font-mono text-[#9AA0A6]">MW</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Renewable Generation */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181A1C] border border-[#282B30]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FDD835]/10 text-[#FDD835] shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA0A6] block truncate">
              RES Generation
            </span>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-base sm:text-lg font-mono font-bold text-[#FDD835] tracking-tight">
                {resGen}
              </span>
              <span className="text-[10px] font-mono text-[#9AA0A6]">MW</span>
              <span className="text-[11px] font-mono font-bold text-[#00E676] bg-[#00E676]/10 px-1 rounded">
                {resSharePct}%
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Curtailment Alert Meter */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181A1C] border border-[#282B30]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF9100]/10 text-[#FF9100] shrink-0">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA0A6] block truncate">
              RES Curtailment
            </span>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-base sm:text-lg font-mono font-bold text-[#FF9100] tracking-tight">
                {telemetry.curtailedMw}
              </span>
              <span className="text-[10px] font-mono text-[#9AA0A6]">MW</span>
              {telemetry.curtailmentPct > 0 && (
                <span className="text-[10px] font-mono text-[#FF9100] bg-[#FF9100]/10 px-1 rounded">
                  {telemetry.curtailmentPct}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 5: Simulation Presets / Scrubber */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between lg:justify-end gap-2 p-2 rounded-xl bg-[#181A1C] border border-[#282B30]">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA0A6]">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-medium font-mono capitalize">
              {telemetry.preset === 'live' ? 'Live Telemetry' : `${telemetry.preset} Scenario`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {(['live', 'midday', 'evening', 'night'] as SimulationPreset[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSelectPreset(p)}
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold uppercase transition-all cursor-pointer ${
                  telemetry.preset === p
                    ? 'bg-[#00E5FF] text-[#0E0F10] shadow-xs'
                    : 'text-[#9AA0A6] hover:text-white hover:bg-[#23272A]'
                }`}
                title={`Simulate ${p} conditions`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Fuel & Energy Source Breakdown Stacked Bar */}
      <div className="mt-3 pt-3 border-t border-[#23272A] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA0A6]">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
            Instantaneous Generation Mix
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FDD835]" /> Solar: {telemetry.solarGenerationMw} MW
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" /> Wind: {telemetry.windGenerationMw} MW
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5252]" /> Thermal: {telemetry.thermalGenerationMw} MW
            </span>
            {telemetry.storageDischargeMw > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00E676]" /> BESS: {telemetry.storageDischargeMw} MW
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Stacked Percentage Bar */}
        <div className="w-full h-2 rounded-full bg-[#23272A] overflow-hidden flex">
          <div 
            style={{ width: `${solarPct}%` }} 
            className="h-full bg-[#FDD835] transition-all duration-500" 
            title={`Solar PV: ${telemetry.solarGenerationMw} MW (${solarPct.toFixed(1)}%)`} 
          />
          <div 
            style={{ width: `${windPct}%` }} 
            className="h-full bg-[#00E5FF] transition-all duration-500" 
            title={`Wind: ${telemetry.windGenerationMw} MW (${windPct.toFixed(1)}%)`} 
          />
          <div 
            style={{ width: `${thermalPct}%` }} 
            className="h-full bg-[#FF5252] transition-all duration-500" 
            title={`Thermal HFO/Diesel: ${telemetry.thermalGenerationMw} MW (${thermalPct.toFixed(1)}%)`} 
          />
          <div 
            style={{ width: `${storagePct}%` }} 
            className="h-full bg-[#00E676] transition-all duration-500" 
            title={`BESS Discharge: ${telemetry.storageDischargeMw} MW (${storagePct.toFixed(1)}%)`} 
          />
        </div>
      </div>

    </div>
  );
};
