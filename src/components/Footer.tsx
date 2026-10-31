import React from 'react';
import { useTranslation } from 'react-i18next';
import { EnergeiaLogo } from './EnergeiaLogo';
import { FEATURES } from '../config/features';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const handleOpenCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_cookie_preferences'));
    }
  };

  return (
    <footer className="w-full bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[#131314] border-t border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] pt-12 pb-24 md:pb-12 px-4 md:px-6 mt-16 transition-colors">
      
      {/* Top Bar: Statutory Corporate Identification */}
      <div className="max-w-7xl mx-auto pb-8 mb-8 border-b border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[var(--md-sys-color-primary,#1A73E8)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] text-white dark:text-[#062E6F] flex items-center justify-center shadow-xs">
            <EnergeiaLogo className="w-4 h-auto" />
          </div>
          <div>
            <span className="font-medium text-base text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white tracking-tight">
              Energeia
            </span>
            <span className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] ml-2 font-normal">
              Cyprus Energy Intelligence
            </span>
          </div>
        </div>

        <div className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] font-mono">
          <span>M3J2 LTD • HE 438859 • VAT CY10438859X</span>
        </div>
      </div>

      {/* Main 4-Column Sitemap */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
        
        {/* Column 1: About Energeia */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            About Energeia
          </div>
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] leading-relaxed">
            {t('footer.description', 'Independent intelligence and research portal tracking the Cyprus renewable transition, regulatory frameworks from CERA, and live Mediterranean interconnectivity.')}
          </p>
          <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] pt-1">
            <p>Leoforos Panioti, 20, Germasogeia</p>
            <p>4044, Lemesos, Cyprus</p>
            <p className="pt-1">
              Contact: <a href="mailto:admin@energeia.cy" className="underline hover:text-[var(--md-sys-color-primary,#1A73E8)]">admin@energeia.cy</a>
            </p>
          </div>
        </div>

        {/* Column 2: Platform Navigation */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            Navigation
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                {t('nav.news', 'Publications & News')}
              </a>
            </li>
            {FEATURES.enableTerminal && (
              <li>
                <a href="/terminal" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                  {t('nav.terminal', 'Helios Grid Terminal')}
                </a>
              </li>
            )}
            {FEATURES.enableMembers && (
              <li>
                <a href="/directory" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                  {t('nav.members', 'Verified Directory')}
                </a>
              </li>
            )}
            {FEATURES.enableAbout && (
              <li>
                <a href="/about" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                  {t('nav.about', 'About the Network')}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Column 3: Statutory Legal & Disclosures */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            Statutory Legal
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/terms" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                {t('terms.title', 'Terms & Conditions')}
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                {t('privacy.title', 'Privacy Policy')}
              </a>
            </li>
            <li>
              <a href="/cookies" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                {t('cookies.title', 'Cookie Policy')}
              </a>
            </li>
            <li>
              <a href="/disclosures" className="text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] hover:text-[var(--md-sys-color-primary,#1A73E8)] dark:hover:text-[var(--md-sys-color-primary,#8AB4F8)] transition-colors">
                {t('disclosures.title', 'Corporate Disclosures')}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Regulatory Transparency */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            Cyprus Energy Ecosystem
          </div>
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] leading-relaxed">
            Data aggregated from the Cyprus Energy Regulatory Authority (CERA), the Transmission System Operator of Cyprus (TSOC), and the European Network of Transmission System Operators (ENTSO-E).
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenCookiePreferences}
              className="text-xs text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] hover:underline cursor-pointer bg-transparent border-0 p-0 text-start"
            >
              Manage Cookie Preferences
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Utility Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] gap-4">
        <p>© {new Date().getFullYear()} Energeia Cyprus (M3J2 LTD). All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="https://www.energeia.cy" className="hover:underline">www.energeia.cy</a>
          <span>•</span>
          <button
            type="button"
            onClick={handleOpenCookiePreferences}
            className="hover:underline bg-transparent border-0 p-0 cursor-pointer text-inherit"
          >
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
