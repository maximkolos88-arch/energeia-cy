import React, { useState, useMemo, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Radio, 
  Layers, 
  SlidersHorizontal, 
  MapPin, 
  Activity, 
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { EnergeiaLogo } from '../components/EnergeiaLogo';
import { AppLauncher } from '../components/navigation/AppLauncher';
import { HeliosMapCanvas } from '../modules/helios/components/HeliosMapCanvas';
import { HeliosTelemetryHUD, PRESET_CONFIGS } from '../modules/helios/components/HeliosTelemetryHUD';
import { HeliosLayerControls } from '../modules/helios/components/HeliosLayerControls';
import { HeliosAssetInspector } from '../modules/helios/components/HeliosAssetInspector';
import { getAllHeliosAssets } from '../modules/helios/data';
import { HeliosAsset, LayerVisibilityState, SimulationPreset, TelemetryState } from '../modules/helios/types/helios';

export const HeliosTerminalLayout: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(true); // Left rail on desktop
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // Mobile drawer
  const [selectedAsset, setSelectedAsset] = useState<HeliosAsset | null>(null);
  const [focusedAsset, setFocusedAsset] = useState<HeliosAsset | null>(null);

  // Authoritative Assets list
  const allAssets = useMemo(() => getAllHeliosAssets(), []);

  // Layer Visibility State
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>({
    transmission132: true,
    subTransmission66: true,
    thermalPlants: true,
    solarClusters: true,
    windFarms: true,
    bessStorage: true,
    greatSeaInterconnector: true,
  });

  // Telemetry Simulation State
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    ...PRESET_CONFIGS.live,
    frequencyHz: 50.02,
    timestamp: new Date().toISOString(),
    preset: 'live',
  });

  const handleToggleLayer = (layer: keyof LayerVisibilityState) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleSetAllLayers = (visible: boolean) => {
    setLayerVisibility({
      transmission132: visible,
      subTransmission66: visible,
      thermalPlants: visible,
      solarClusters: visible,
      windFarms: visible,
      bessStorage: visible,
      greatSeaInterconnector: visible,
    });
  };

  const handleSelectPreset = (preset: SimulationPreset) => {
    setTelemetry(prev => ({
      ...prev,
      ...PRESET_CONFIGS[preset],
      preset,
      timestamp: new Date().toISOString(),
    }));
  };

  const handleSelectAsset = (asset: HeliosAsset) => {
    setSelectedAsset(asset);
    setFocusedAsset(asset);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div 
      className={`w-full bg-[#0E0F10] text-[#E3E3E3] flex flex-col font-mono select-none overflow-hidden ${
        isFullscreen 
          ? 'fixed inset-0 z-50 h-screen' 
          : 'relative h-[calc(100vh-64px)] min-h-[600px]'
      }`}
    >
      
      {/* 1. TOP TERMINAL HUD BAR (64px) */}
      <header className="h-14 sm:h-16 bg-[#121315]/98 backdrop-blur-md border-b border-[#23272A] px-4 sm:px-6 flex items-center justify-between shrink-0 z-40">
        
        {/* Left: Brand + Live Grid Pulse */}
        <div className="flex items-center gap-3 sm:gap-5">
          <a href="/" className="cursor-pointer" aria-label="Energeia Home">
            <EnergeiaLogo descriptor="Helios" variant="gradient" className="h-7 sm:h-8" />
          </a>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#181A1C] border border-[#282B30] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[#9AA0A6] font-medium text-[11px]">TSOC Synchronous:</span>
            <span className="text-white font-bold text-[11px]">50.02 Hz · Stable</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#9AA0A6]">
            <span>•</span>
            <span className="text-[11px] font-medium text-slate-300">
              National Energy GIS Terminal (132/66 kV)
            </span>
          </div>
        </div>

        {/* Right: Quick Controls + 9-Dots App Launcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(prev => !prev)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181A1C] border border-[#282B30] text-xs text-[#00E5FF] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Telemetry &amp; Layers</span>
          </button>

          {/* Desktop Left Rail Toggle */}
          <button
            type="button"
            onClick={() => setIsControlsOpen(prev => !prev)}
            aria-label="Toggle Layers Panel"
            title={isControlsOpen ? 'Collapse Layers' : 'Expand Layers'}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl bg-[#181A1C] hover:bg-[#23272A] border border-[#282B30] text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            {isControlsOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#181A1C] hover:bg-[#23272A] border border-[#282B30] text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* 9-Dots App Launcher */}
          <AppLauncher currentSurface="helios" />
        </div>
      </header>

      {/* 2. MAIN TERMINAL WORKSPACE */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        
        {/* CENTER: Interactive MapLibre GL Canvas */}
        <HeliosMapCanvas
          layerVisibility={layerVisibility}
          onSelectAsset={handleSelectAsset}
          focusedAsset={focusedAsset}
          className="absolute inset-0 w-full h-full"
        />

        {/* TOP FLOATING TELEMETRY HUD (Floating on Desktop) */}
        <div className="hidden md:block absolute top-4 left-4 right-4 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto pointer-events-auto">
            <HeliosTelemetryHUD
              telemetry={telemetry}
              onSelectPreset={handleSelectPreset}
            />
          </div>
        </div>

        {/* LEFT RAIL: Layer Controls & Search (Floating on Desktop) */}
        {isControlsOpen && (
          <div className="hidden md:block absolute top-36 left-4 bottom-4 w-80 z-20 pointer-events-auto">
            <HeliosLayerControls
              layerVisibility={layerVisibility}
              onToggleLayer={handleToggleLayer}
              onSetAllLayers={handleSetAllLayers}
              allAssets={allAssets}
              onSelectAsset={handleSelectAsset}
              className="h-full"
            />
          </div>
        )}

        {/* RIGHT DRAWER: Asset Inspector */}
        {selectedAsset && (
          <HeliosAssetInspector
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onFocusAsset={(asset) => setFocusedAsset(asset)}
          />
        )}

        {/* MOBILE DRAWER: Bottom Sheet for Mobile Controls */}
        {isMobileDrawerOpen && (
          <div 
            className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            <div 
              className="w-full bg-[#121315] border-t border-[#23272A] rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 space-y-4 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#23272A] pb-3">
                <span className="text-xs font-bold uppercase text-[#00E5FF]">
                  Telemetry &amp; Layers
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#9AA0A6] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Telemetry */}
              <HeliosTelemetryHUD
                telemetry={telemetry}
                onSelectPreset={handleSelectPreset}
              />

              {/* Mobile Layer Controls */}
              <HeliosLayerControls
                layerVisibility={layerVisibility}
                onToggleLayer={handleToggleLayer}
                onSetAllLayers={handleSetAllLayers}
                allAssets={allAssets}
                onSelectAsset={(a) => {
                  handleSelectAsset(a);
                  setIsMobileDrawerOpen(false);
                }}
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
