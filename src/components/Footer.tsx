import React from 'react';
import { useTranslation } from 'react-i18next';
import { EnergeiaLogo } from './EnergeiaLogo';
import { FEATURES } from '../config/features';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-white dark:bg-[#151618] border-t border-neutral-200 dark:border-neutral-800 pt-10 pb-20 md:pb-12 px-4 md:px-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand, Slogan & Corporate Identification */}
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
            {t('footer.description', 'Cyprus Energy News, Renewable Market Intelligence, Regulatory Policy Updates, and Clean Energy Analytics.')}
          </p>

          {/* Statutory Corporate Registration Details */}
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1 pt-1 border-t border-neutral-100 dark:border-neutral-800">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              M3J2 LTD • HE 438859
            </p>
            <p>VAT ID: CY10438859X</p>
            <p>{t('footer.address', 'Leoforos Panioti, 20, Germasogeia 4044, Lemesos, Cyprus')}</p>
            <p>
              Contact: <a href="mailto:admin@energeia.cy" className="underline hover:text-primary transition-colors">admin@energeia.cy</a>
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 pt-1">
              Official Domain: <a href="https://www.energeia.cy" className="underline hover:text-primary">www.energeia.cy</a>
            </p>
          </div>
        </div>

        {/* Navigation & Statutory Legal Links */}
        <div className="flex flex-wrap gap-8 text-xs font-semibold">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Platform Navigation
            </div>
            <ul className="space-y-2">
              <li><a href="/" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('nav.news', 'Home & News')}</a></li>
              {FEATURES.enableMembers && (
                <li><a href="/directory" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('nav.members', 'Directory')}</a></li>
              )}
              {FEATURES.enableMagazine && (
                <li><a href="/magazine" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('nav.magazine', 'Magazine')}</a></li>
              )}
              {FEATURES.enableAcademy && (
                <li><a href="/academy" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('nav.academy', 'Academy')}</a></li>
              )}
              {FEATURES.enableAbout && (
                <li><a href="/about" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('nav.about', 'About')}</a></li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Statutory Legal Disclosures
            </div>
            <ul className="space-y-2">
              <li><a href="/terms" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('terms.title', 'Terms & Conditions')}</a></li>
              <li><a href="/privacy" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('privacy.title', 'Privacy Policy')}</a></li>
              <li><a href="/cookies" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('cookies.title', 'Cookie Policy')}</a></li>
              <li><a href="/disclosures" className="inline-flex items-center min-h-[28px] py-1 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">{t('disclosures.title', 'Corporate Disclosures')}</a></li>
            </ul>
          </div>

          <div className="space-y-2 max-w-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Cyprus Energy Ecosystem
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
              Monitoring regulatory frameworks from CERA, grid telemetry by TSOC, and energy transition initiatives across Cyprus in compliance with Cyprus Law 156(I)/2004 & EU GDPR.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-850 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 gap-4">
        <p>© {new Date().getFullYear()} Energeia Cyprus (M3J2 LTD). {t('footer.rights', 'All rights reserved.')}</p>
        <p>https://www.energeia.cy</p>
      </div>
    </footer>
  );
};
