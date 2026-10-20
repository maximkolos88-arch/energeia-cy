import React from 'react';
import { useTranslation } from 'react-i18next';
import { EnergeiaLogo } from './EnergeiaLogo';
import { FEATURES } from '../config/features';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-white dark:bg-[#151618] border-t border-neutral-200 dark:border-neutral-800 pt-10 pb-20 md:pb-12 px-4 md:px-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand & Slogan */}
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <EnergeiaLogo className="w-5 h-auto" />
            </div>
            <span className="font-extrabold text-lg text-neutral-900 dark:text-white tracking-tight">
              Energeia
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Cyprus Energy News, Renewable Market Intelligence, Regulatory Policy Updates, and Clean Energy Analytics.
          </p>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Official Domain: <a href="https://www.energeia.cy" className="underline hover:text-primary">www.energeia.cy</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-8 text-xs font-semibold">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Platform Navigation
            </div>
            <ul className="space-y-1.5">
              <li><a href="/" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">Home & News</a></li>
              {FEATURES.enableMembers && (
                <li><a href="/directory" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">Directory</a></li>
              )}
              {FEATURES.enableMagazine && (
                <li><a href="/magazine" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">Magazine</a></li>
              )}
              {FEATURES.enableAcademy && (
                <li><a href="/academy" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">Academy</a></li>
              )}
              {FEATURES.enableAbout && (
                <li><a href="/about" className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">About</a></li>
              )}
            </ul>
          </div>

          <div className="space-y-2 max-w-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Cyprus Energy Ecosystem
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
              Monitoring regulatory frameworks from CERA, grid telemetry by TSOC, and energy transition initiatives across Cyprus.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-850 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 gap-4">
        <p>© {new Date().getFullYear()} Energeia Cyprus. All rights reserved.</p>
        <p>https://www.energeia.cy</p>
      </div>
    </footer>
  );
};
