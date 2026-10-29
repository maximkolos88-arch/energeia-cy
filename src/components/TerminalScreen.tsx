import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from './PageHeader';

export const TerminalScreen: React.FC = () => {
  const { t } = useTranslation();
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 max-w-none p-0 bg-[#0b1120]' : ''}`}>
      {!isFullscreen && (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <PageHeader
              title={t('terminal.title', 'Helios Eye — Cyprus Energy Terminal')}
              description={t('terminal.subtitle', 'Interactive 3D GIS platform monitoring 520+ power plants, transmission substations, and live ENTSO-E market telemetry.')}
              iconName="radar"
            />
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <a
                href="/helios/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>{t('terminal.openStandalone', 'Standalone Mode')}</span>
              </a>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">fullscreen</span>
                <span>{t('terminal.fullscreen', 'Full View')}</span>
              </button>
            </div>
          </div>

          {/* Infrastructure Quick Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <span className="material-symbols-outlined text-base">solar_power</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Solar PV</span>
              </div>
              <div className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">~780 MW</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">450+ Licensed Arrays</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center gap-2 text-sky-500 mb-1">
                <span className="material-symbols-outlined text-base">wind_power</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Wind Farms</span>
              </div>
              <div className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">~157 MW</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Major Mountain Basins</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <span className="material-symbols-outlined text-base">battery_charging_full</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">BESS Storage</span>
              </div>
              <div className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">Pipelines</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Fast Reserve Assets</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center gap-2 text-rose-500 mb-1">
                <span className="material-symbols-outlined text-base">bolt</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Grid Substation</span>
              </div>
              <div className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">66 / 132 kV</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">TSOC Backbone Nodes</div>
            </div>
          </div>
        </>
      )}

      {/* Terminal Viewport */}
      <div className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#0b1120] shadow-xl ${isFullscreen ? 'h-screen rounded-none border-none' : 'h-[68vh] md:h-[78vh]'}`}>
        {/* Fullscreen Exit Control */}
        {isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900/90 text-white border border-neutral-700/60 hover:bg-neutral-800 backdrop-blur-md shadow-lg"
          >
            <span className="material-symbols-outlined text-sm">fullscreen_exit</span>
            <span>Exit Full View</span>
          </button>
        )}

        {/* Loading placeholder */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120] text-emerald-400 gap-3 z-10">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono tracking-wider text-neutral-400">CONNECTING TO HELIOS CYPRUS GRID ENGINE...</p>
          </div>
        )}

        <iframe
          src="/helios/"
          title="Helios Eye Cyprus Grid Terminal"
          className="w-full h-full border-0 relative z-20"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>

      {!isFullscreen && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">satellite_alt</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Photorealistic 3D GIS</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Google Maps 3D vector and tilt rendering displaying geospatial positioning of utility-scale solar parks, wind turbines, and substations across Cyprus.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">database</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">OpenInfraMap National Registry</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Over 520 power generation facilities cataloged with real-world capacities, geographic coordinates, voltage levels, and CERA regulatory metadata.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#18191c] border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">B2B PPA & EPC Integration</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Directly connect with project developers, licensed energy suppliers, and certified EPC contractors through Energeia verified member channels.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
