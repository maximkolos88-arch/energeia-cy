import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Database, 
  Handshake, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Wind, 
  BatteryCharging, 
  Zap, 
  Info, 
  X,
  Activity
} from 'lucide-react';

export const TerminalScreen: React.FC = () => {
  const { t } = useTranslation();
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      try {
        if (iframe.contentDocument && (iframe.contentDocument.readyState === 'complete' || iframe.contentDocument.readyState === 'interactive')) {
          setIframeLoaded(true);
        }
      } catch {
        // Fallback for cross-origin or security restrictions
      }

      const handleLoad = () => setIframeLoaded(true);
      iframe.addEventListener('load', handleLoad);

      // Failsafe timer: ensure overlay always dismisses once the page is interactive
      const timer = setTimeout(() => {
        setIframeLoaded(true);
      }, 500);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        clearTimeout(timer);
      };
    }
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div className={`w-full relative flex flex-col bg-[#0b1120] overflow-hidden ${
      isFullscreen 
        ? 'fixed inset-0 z-50 h-screen w-screen' 
        : 'h-[calc(100dvh-4rem)]'
    }`}>
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none flex items-center justify-end gap-2">
        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Info & Registry Stats Drawer Button */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#111827]/90 text-neutral-200 border border-neutral-700/80 hover:bg-neutral-800 hover:text-white transition-all shadow-md backdrop-blur-md cursor-pointer"
            title="View Cyprus Grid Infrastructure Metrics"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Grid Overview</span>
          </button>

          {/* Standalone Window Mode */}
          <a
            href="/helios/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#111827]/90 text-neutral-200 border border-neutral-700/80 hover:bg-neutral-800 hover:text-white transition-all shadow-md backdrop-blur-md"
            title="Open Standalone HUD in New Window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{t('terminal.openStandalone', 'Standalone Mode')}</span>
          </a>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Full View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('terminal.fullscreen', 'Full View')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading state indicator */}
      {!iframeLoaded && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120] text-emerald-400 gap-3 z-20 pointer-events-none transition-opacity duration-300"
          aria-hidden={iframeLoaded}
        >
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-wider text-neutral-400">CONNECTING TO HELIOS 3D GRID TERMINAL...</p>
        </div>
      )}

      {/* Embedded Terminal Frame */}
      <iframe
        ref={iframeRef}
        src="/helios/"
        title="Helios Eye Cyprus Grid Terminal"
        className="w-full h-full border-0 relative z-10"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setIframeLoaded(true)}
      />

      {/* Grid Overview Modal / Overlay */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-[#111827] border border-neutral-700/80 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Cyprus Energy Grid Telemetry & Registry</h2>
                  <p className="text-xs text-neutral-400">Helios Eye National Asset Overview • CERA & TSOC Coordinated</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close Overview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-[#1f2937]/60 border border-neutral-700/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Solar PV</span>
                </div>
                <div className="text-xl font-extrabold text-white">~780 MW</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">450+ Licensed Arrays</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f2937]/60 border border-neutral-700/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <Wind className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Wind Farms</span>
                </div>
                <div className="text-xl font-extrabold text-white">~157 MW</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Mountain Basins</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f2937]/60 border border-neutral-700/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <BatteryCharging className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">BESS Storage</span>
                </div>
                <div className="text-xl font-extrabold text-white">Pipelines</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Fast Reserve Units</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f2937]/60 border border-neutral-700/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="w-4 h-4 text-rose-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Substations</span>
                </div>
                <div className="text-xl font-extrabold text-white">66 / 132 kV</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">TSOC Backbone</div>
              </div>
            </div>

            {/* Capability Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-[#1f2937]/40 border border-neutral-700/50">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Photorealistic 3D GIS</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Google Maps 3D vector and tilt rendering displaying geospatial positioning of utility-scale solar parks, wind turbines, and substations across Cyprus.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f2937]/40 border border-neutral-700/50">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">OpenInfraMap National Registry</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Over 520 power generation facilities cataloged with real-world capacities, geographic coordinates, voltage levels, and CERA regulatory metadata.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f2937]/40 border border-neutral-700/50">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">B2B PPA & EPC Integration</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Directly connect with project developers, licensed energy suppliers, and certified EPC contractors through Energeia verified member channels.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <a
                href="/helios/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Standalone HUD</span>
              </a>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
