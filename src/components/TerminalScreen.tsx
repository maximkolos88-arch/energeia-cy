import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Wind, 
  BatteryCharging, 
  Zap, 
  Globe, 
  Database, 
  Handshake,
  Radio
} from 'lucide-react';
import PageHeader from './PageHeader';

export const TerminalScreen: React.FC = () => {
  const { t } = useTranslation();
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
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

      // Failsafe timer: ensure overlay always dismisses once interactive
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
    <div className={`w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in ${
      isFullscreen ? 'fixed inset-0 z-50 max-w-none p-0 bg-[#0b1120] overflow-hidden' : ''
    }`}>
      {!isFullscreen && (
        <>
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <PageHeader
              title={t('terminal.title', 'Helios Eye — Cyprus Energy Terminal')}
              description={t('terminal.subtitle', 'Interactive 3D GIS platform monitoring 520+ power plants, transmission substations, and live ENTSO-E market telemetry.')}
              iconName="radar"
            />
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 mb-4 md:mb-8">
              <a
                href="/helios/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] hover:bg-[var(--md-sys-color-surface-container-high,#E8EAED)] dark:hover:bg-[#282A2C] transition-colors shadow-2xs"
                title="Open Standalone Helios Terminal in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('terminal.openStandalone', 'Standalone Mode')}</span>
              </a>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-[#1F1F1F] text-white dark:bg-[#E3E3E3] dark:text-[#1F1F1F] hover:bg-[#333537] dark:hover:bg-white transition-colors shadow-2xs cursor-pointer"
                title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
                aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('terminal.fullscreen', 'Full View')}</span>
              </button>
            </div>
          </div>

          {/* Infrastructure Quick Metric Cards (Material 3 Tonal Containers) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
            <div className="p-4 rounded-[20px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs">
              <div className="flex items-center gap-2 text-amber-500 mb-1.5">
                <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">Solar PV</span>
              </div>
              <div className="text-lg md:text-xl font-medium tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">~780 MW</div>
              <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">450+ Licensed Arrays</div>
            </div>

            <div className="p-4 rounded-[20px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs">
              <div className="flex items-center gap-2 text-sky-500 mb-1.5">
                <Wind className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">Wind Farms</span>
              </div>
              <div className="text-lg md:text-xl font-medium tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">~157 MW</div>
              <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">Major Mountain Basins</div>
            </div>

            <div className="p-4 rounded-[20px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs">
              <div className="flex items-center gap-2 text-purple-500 mb-1.5">
                <BatteryCharging className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">BESS Storage</span>
              </div>
              <div className="text-lg md:text-xl font-medium tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">Pipelines</div>
              <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">Fast Reserve Assets</div>
            </div>

            <div className="p-4 rounded-[20px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs">
              <div className="flex items-center gap-2 text-rose-500 mb-1.5">
                <Zap className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">Grid Substation</span>
              </div>
              <div className="text-lg md:text-xl font-medium tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">66 / 132 kV</div>
              <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6]">TSOC Backbone Nodes</div>
            </div>
          </div>
        </>
      )}

      {/* Terminal 3D GIS Viewport */}
      <div className={`relative w-full rounded-[24px] md:rounded-[28px] overflow-hidden border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[#333537] bg-[#0b1120] shadow-xl ${
        isFullscreen ? 'h-screen rounded-none border-none' : 'h-[68vh] md:h-[78vh]'
      }`}>
        {/* Fullscreen Floating Controls */}
        <aside aria-label="Terminal Controls" className="absolute top-3 right-4 z-30 pointer-events-none flex items-center justify-end gap-2">
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-[#131314]/85 backdrop-blur-md border border-[#333537] shadow-lg">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-[#8AB4F8] border-r border-[#333537]">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" aria-hidden="true" />
              <span>EARTH AI GIS</span>
            </div>

            <a
              href="/helios/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#C4C7C5] hover:text-white hover:bg-[#282A2C] transition-colors"
              title="Open Standalone Helios Terminal in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8AB4F8]" aria-hidden="true" />
              <span className="hidden sm:inline">Standalone</span>
            </a>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#C4C7C5] hover:text-white hover:bg-[#282A2C] transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen' : 'Full View'}
              aria-label={isFullscreen ? 'Exit Full Screen' : 'Full View'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Full View</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Loading placeholder */}
        {!iframeLoaded && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120] text-emerald-400 gap-3 z-20 pointer-events-none transition-opacity duration-300"
            aria-hidden={iframeLoaded}
          >
            <div className="w-8 h-8 border-2 border-[#8AB4F8] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono tracking-wider text-neutral-400">CONNECTING TO HELIOS EARTH AI 3D GIS...</p>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          ref={iframeRef}
          src="/helios/"
          title="Helios Eye Cyprus Grid Terminal"
          className="w-full h-full border-0 relative z-10"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>

      {/* 3 Google Research Feature Cards (Bottom Section) */}
      {!isFullscreen && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[24px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs hover:border-[var(--md-sys-color-primary-container,#D3E3FD)] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5">
              <Globe className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white mb-1.5">
              Photorealistic 3D GIS
            </h2>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] leading-relaxed">
              Google Maps 3D vector and tilt rendering displaying geospatial positioning of utility-scale solar parks, wind turbines, and substations across Cyprus.
            </p>
          </div>

          <div className="p-6 rounded-[24px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs hover:border-[var(--md-sys-color-primary-container,#D3E3FD)] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3.5">
              <Database className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white mb-1.5">
              OpenInfraMap National Registry
            </h2>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] leading-relaxed">
              Over 520 power generation facilities cataloged with real-world capacities, geographic coordinates, voltage levels, and CERA regulatory metadata.
            </p>
          </div>

          <div className="p-6 rounded-[24px] bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] shadow-2xs hover:border-[var(--md-sys-color-primary-container,#D3E3FD)] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3.5">
              <Handshake className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white mb-1.5">
              B2B PPA &amp; EPC Integration
            </h2>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] leading-relaxed">
              Directly connect with project developers, licensed energy suppliers, and certified EPC contractors through Energeia verified member channels.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
