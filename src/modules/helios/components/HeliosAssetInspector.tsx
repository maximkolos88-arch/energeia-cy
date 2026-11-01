import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Sun, 
  Wind, 
  Flame, 
  BatteryCharging, 
  Network, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Layers, 
  Compass,
  Building2,
  FileText
} from 'lucide-react';
import { HeliosAsset } from '../types/helios';

export interface HeliosAssetInspectorProps {
  asset: HeliosAsset | null;
  onClose: () => void;
  onFocusAsset?: (asset: HeliosAsset) => void;
}

export const HeliosAssetInspector: React.FC<HeliosAssetInspectorProps> = ({
  asset,
  onClose,
  onFocusAsset
}) => {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const handleCopyCoords = () => {
    if (!asset.coordinates) return;
    const coordsStr = Array.isArray(asset.coordinates[0]) 
      ? JSON.stringify(asset.coordinates)
      : `${(asset.coordinates as [number, number])[1].toFixed(4)}, ${(asset.coordinates as [number, number])[0].toFixed(4)}`;
    navigator.clipboard.writeText(coordsStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeIcon = () => {
    switch (asset.type) {
      case 'substation':
        return <Network className="w-5 h-5 text-[#00E5FF]" />;
      case 'thermal':
        return <Flame className="w-5 h-5 text-[#FF5252]" />;
      case 'solar':
        return <Sun className="w-5 h-5 text-[#FDD835]" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-[#00E5FF]" />;
      case 'storage':
        return <BatteryCharging className="w-5 h-5 text-[#00E676]" />;
      case 'interconnector':
        return <Compass className="w-5 h-5 text-[#2979FF]" />;
      default:
        return <Zap className="w-5 h-5 text-[#00E5FF]" />;
    }
  };

  const getTypeLabel = () => {
    switch (asset.type) {
      case 'substation':
        return 'High Voltage Substation';
      case 'thermal':
        return 'Thermal Power Station';
      case 'solar':
        return 'Utility Photovoltaic Park';
      case 'wind':
        return 'Utility Wind Farm';
      case 'storage':
        return 'Battery Energy Storage (BESS)';
      case 'interconnector':
        return 'Subsea HVDC Interconnector';
      case 'transmission_line':
        return 'Transmission Line Circuit';
      default:
        return 'Energy Asset';
    }
  };

  const getStatusBadge = () => {
    switch (asset.status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            Operational
          </span>
        );
      case 'construction':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#2979FF]/15 text-[#2979FF] border border-[#2979FF]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2979FF] animate-pulse" />
            Under Execution
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#FFB300]/15 text-[#FFB300] border border-[#FFB300]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300]" />
            Planned / Tendered
          </span>
        );
      case 'standby':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#9AA0A6]/15 text-[#9AA0A6] border border-[#9AA0A6]/30">
            Standby Reserve
          </span>
        );
      default:
        return null;
    }
  };

  const isPoint = !Array.isArray(asset.coordinates[0]);
  const lat = isPoint ? (asset.coordinates as [number, number])[1].toFixed(4) : '';
  const lng = isPoint ? (asset.coordinates as [number, number])[0].toFixed(4) : '';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#121315]/98 backdrop-blur-xl border-l border-[#23272A] shadow-2xl flex flex-col text-slate-200 select-none animate-scale-up">
      
      {/* Top Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00E5FF] via-[#FDD835] to-[#00E676]" />

      {/* Header */}
      <div className="p-5 border-b border-[#23272A] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#181A1C] border border-[#282B30] shrink-0">
            {getTypeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA0A6]">
                {getTypeLabel()}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {asset.name}
            </h3>
            <span className="text-xs text-[#9AA0A6] flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {asset.operator}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close asset inspector"
          className="p-1.5 rounded-lg text-[#9AA0A6] hover:text-white hover:bg-[#23272A] transition-colors cursor-pointer shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Details Body */}
      <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
        
        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {asset.capacityMw !== undefined && (
            <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A]">
              <span className="text-[10px] font-mono text-[#9AA0A6] block">Installed Peak</span>
              <span className="text-base font-bold font-mono text-[#00E5FF]">
                {asset.capacityMw} MW
              </span>
            </div>
          )}

          {asset.capacityMwh !== undefined && (
            <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A]">
              <span className="text-[10px] font-mono text-[#9AA0A6] block">Storage Capacity</span>
              <span className="text-base font-bold font-mono text-[#00E676]">
                {asset.capacityMwh} MWh
              </span>
            </div>
          )}

          {asset.voltageKv !== undefined && (
            <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A]">
              <span className="text-[10px] font-mono text-[#9AA0A6] block">Voltage Rating</span>
              <span className="text-base font-bold font-mono text-white">
                {asset.voltageKv} kV
              </span>
            </div>
          )}

          {asset.transformerMva !== undefined && (
            <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A]">
              <span className="text-[10px] font-mono text-[#9AA0A6] block">Transformer Size</span>
              <span className="text-base font-bold font-mono text-white">
                {asset.transformerMva} MVA
              </span>
            </div>
          )}

          {asset.feedersCount !== undefined && (
            <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A]">
              <span className="text-[10px] font-mono text-[#9AA0A6] block">Feeder Bays</span>
              <span className="text-base font-bold font-mono text-white">
                {asset.feedersCount} circuits
              </span>
            </div>
          )}

          {asset.commissioningYear && (
            <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A]">
              <span className="text-[10px] font-mono text-[#9AA0A6] block">Commissioning</span>
              <span className="text-base font-bold font-mono text-white">
                {asset.commissioningYear}
              </span>
            </div>
          )}
        </div>

        {/* Narrative Description */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono font-semibold text-[#9AA0A6] block">
            Operational Dossier &amp; Grid Function
          </span>
          <p className="text-xs text-slate-300 leading-relaxed bg-[#181A1C] p-3.5 rounded-xl border border-[#23272A]">
            {asset.description}
          </p>
        </div>

        {/* Point of Common Coupling (PCC) */}
        {asset.pccSubstation && (
          <div className="p-3.5 rounded-xl bg-[#181A1C] border border-[#23272A] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#9AA0A6] block">PCC Substation</span>
              <span className="font-semibold text-white">{asset.pccSubstation}</span>
            </div>
            <Network className="w-4 h-4 text-[#00E5FF]" />
          </div>
        )}

        {/* Technical Specification Key-Values */}
        {asset.technicalDetails && Object.keys(asset.technicalDetails).length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-semibold text-[#9AA0A6] block">
              Engineering Parameters
            </span>
            <div className="rounded-xl bg-[#181A1C] border border-[#23272A] divide-y divide-[#23272A]">
              {Object.entries(asset.technicalDetails).map(([key, value]) => (
                <div key={key} className="px-3.5 py-2 flex items-center justify-between">
                  <span className="text-[#9AA0A6] text-[11px]">{key}</span>
                  <span className="font-mono font-medium text-white text-[11px] text-right truncate max-w-[200px]">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geospatial Coordinates */}
        {isPoint && (
          <div className="p-3 rounded-xl bg-[#181A1C] border border-[#23272A] flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="font-mono text-[11px]">
                {lat}° N, {lng}° E
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCoords}
              className="text-[10px] font-mono text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#00E676]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-[#181A1C] border-t border-[#23272A] flex items-center justify-between gap-3">
        {onFocusAsset && (
          <button
            type="button"
            onClick={() => onFocusAsset(asset)}
            className="flex-1 py-2 px-3 rounded-xl bg-[#00E5FF] hover:bg-[#00B4D8] text-[#0E0F10] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Center on Map</span>
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 rounded-xl bg-[#23272A] hover:bg-[#2C3236] text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>

    </div>
  );
};
