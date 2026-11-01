import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Eye, 
  EyeOff, 
  Network, 
  Sun, 
  Wind, 
  Flame, 
  BatteryCharging, 
  Compass, 
  SlidersHorizontal,
  ChevronDown,
  X,
  Zap,
  MapPin,
  Check
} from 'lucide-react';
import { HeliosAsset, LayerVisibilityState } from '../types/helios';

export interface HeliosLayerControlsProps {
  layerVisibility: LayerVisibilityState;
  onToggleLayer: (layer: keyof LayerVisibilityState) => void;
  onSetAllLayers: (visible: boolean) => void;
  allAssets: HeliosAsset[];
  onSelectAsset: (asset: HeliosAsset) => void;
  className?: string;
}

export const HeliosLayerControls: React.FC<HeliosLayerControlsProps> = ({
  layerVisibility,
  onToggleLayer,
  onSetAllLayers,
  allAssets,
  onSelectAsset,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredAssets = searchQuery.trim()
    ? allAssets.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.pccSubstation && a.pccSubstation.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const handleSelectSearchResult = (asset: HeliosAsset) => {
    onSelectAsset(asset);
    setSearchQuery('');
    setIsSearching(false);
  };

  const layersList: {
    key: keyof LayerVisibilityState;
    label: string;
    sublabel: string;
    color: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      key: 'transmission132',
      label: '132 kV Transmission Grid',
      sublabel: 'TSOC Core Ring & Substations',
      color: '#00E5FF',
      icon: <Network className="w-3.5 h-3.5 text-[#00E5FF]" />,
      count: allAssets.filter(a => a.type === 'substation' && (a.voltageKv === 132 || !a.voltageKv)).length
    },
    {
      key: 'subTransmission66',
      label: '66 kV Sub-Transmission',
      sublabel: 'Rural & Regional Feeders',
      color: '#FFB300',
      icon: <Network className="w-3.5 h-3.5 text-[#FFB300]" />,
      count: allAssets.filter(a => a.type === 'substation' && a.voltageKv === 66).length + 2
    },
    {
      key: 'solarClusters',
      label: 'Utility Solar PV Clusters',
      sublabel: 'Utility Farms & Tracking Plants',
      color: '#FDD835',
      icon: <Sun className="w-3.5 h-3.5 text-[#FDD835]" />,
      count: allAssets.filter(a => a.type === 'solar').length
    },
    {
      key: 'windFarms',
      label: 'Utility Wind Farms',
      sublabel: 'Orites, Alexigros & Agia Anna',
      color: '#00E5FF',
      icon: <Wind className="w-3.5 h-3.5 text-[#00E5FF]" />,
      count: allAssets.filter(a => a.type === 'wind').length
    },
    {
      key: 'bessStorage',
      label: 'Battery Storage (BESS)',
      sublabel: 'Fast-Track Storage Pipeline',
      color: '#00E676',
      icon: <BatteryCharging className="w-3.5 h-3.5 text-[#00E676]" />,
      count: allAssets.filter(a => a.type === 'storage').length
    },
    {
      key: 'thermalPlants',
      label: 'Thermal Generation Stations',
      sublabel: 'Vasilikos, Dhekelia & Moni',
      color: '#FF5252',
      icon: <Flame className="w-3.5 h-3.5 text-[#FF5252]" />,
      count: allAssets.filter(a => a.type === 'thermal').length
    },
    {
      key: 'greatSeaInterconnector',
      label: 'Great Sea Interconnector (GSI)',
      sublabel: '525 kV HVDC Crete–Cyprus Cable',
      color: '#2979FF',
      icon: <Compass className="w-3.5 h-3.5 text-[#2979FF]" />,
      count: 1
    }
  ];

  return (
    <div className={`flex flex-col bg-[#121315]/95 backdrop-blur-md border border-[#23272A] rounded-2xl p-4 text-slate-200 select-none shadow-2xl space-y-4 ${className}`}>
      
      {/* Search Header */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(Boolean(e.target.value.trim()));
            }}
            placeholder="Search substations, solar parks, plants..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#181A1C] border border-[#282B30] text-xs text-white placeholder-[#9AA0A6] focus:border-[#00E5FF] focus:outline-none transition-all font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA0A6] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isSearching && filteredAssets.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#181A1C] border border-[#282B30] rounded-xl shadow-2xl overflow-hidden divide-y divide-[#23272A] max-h-60 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleSelectSearchResult(asset)}
                className="w-full p-2.5 text-left hover:bg-[#23272A] transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-[#9AA0A6] truncate">
                    {asset.operator} • {asset.type.toUpperCase()}
                  </div>
                </div>
                <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Layers Manager Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            GIS Layer Manager
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => onSetAllLayers(true)}
            className="text-[#9AA0A6] hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            All On
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onSetAllLayers(false)}
            className="text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Layers List Toggles */}
      <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
        {layersList.map((layer) => {
          const isVisible = layerVisibility[layer.key];

          return (
            <button
              key={layer.key}
              type="button"
              onClick={() => onToggleLayer(layer.key)}
              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isVisible
                  ? 'bg-[#181A1C] border-[#282B30] hover:border-[#383C42]'
                  : 'bg-[#121315]/50 border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: layer.color }} 
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-100 truncate">
                    {layer.label}
                  </div>
                  <div className="text-[10px] text-[#9AA0A6] truncate">
                    {layer.sublabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-[#9AA0A6] bg-[#23272A] px-1.5 py-0.2 rounded">
                  {layer.count}
                </span>
                {isVisible ? (
                  <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#9AA0A6]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Statutory Grid Status Card */}
      <div className="p-3 rounded-xl bg-[#181A1C] border border-[#282B30] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#9AA0A6]">
          <span>Grid Intertie Status</span>
          <span className="text-[#00E676] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            Isolated Island Grid
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Operating synchronously as an islanded system. Frequency stability maintained via TSOC dispatch and synthetic inverter reserves.
        </p>
      </div>

    </div>
  );
};
