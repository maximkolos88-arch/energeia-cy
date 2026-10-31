import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, ArrowRight, ShieldCheck, Zap, Globe, Target } from 'lucide-react';
import PageHeader from './PageHeader';

export const AboutScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader 
        description={t('about.subtitle', 'Central information hub and intelligence platform for the Cyprus clean energy transition.')} 
        iconName="leaf" 
        title={t('about.title', 'About Energeia Cyprus')}
      />

      {/* Manifesto & Mission Bento Card */}
      <div className="mt-8 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-[var(--radius-card,24px)] p-8 md:p-12 relative overflow-hidden transition-colors">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          {/* Mission Text */}
          <div className="lg:col-span-3 space-y-6 text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] text-base leading-relaxed">
            <h2 className="text-2xl md:text-3xl font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-[var(--md-sys-color-on-surface,#E3E3E3)] tracking-tight">
              {t('about.title', 'About Energeia')}
            </h2>
            <p className="leading-relaxed">
              {t('about.text1', 'Energeia is the independent intelligence platform cataloging the Cyprus energy transition, utility-scale renewables, electricity market liberalization, and Mediterranean grid interconnectivity.')}
            </p>
            <p className="leading-relaxed">
              {t('about.text2', 'Through verified registry data, live ENTSO-E transmission telemetry, and high-frequency regulatory journalism, Energeia provides market clarity to project developers, institutional investors, and policymakers.')}
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]">
                <Zap className="w-5 h-5 text-[var(--md-sys-color-primary,#1A73E8)] mb-2" aria-hidden="true" focusable="false" />
                <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">Real-Time Telemetry</div>
                <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mt-1">Direct TSOC & ENTSO-E market data</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]">
                <Globe className="w-5 h-5 text-[var(--md-sys-color-primary,#1A73E8)] mb-2" aria-hidden="true" focusable="false" />
                <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">3D GIS Infrastructure</div>
                <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mt-1">520+ cataloged generation facilities</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]">
                <ShieldCheck className="w-5 h-5 text-[var(--md-sys-color-primary,#1A73E8)] mb-2" aria-hidden="true" focusable="false" />
                <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">Regulatory Transparency</div>
                <div className="text-[11px] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mt-1">CERA decisions & EU directives</div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-white dark:bg-[#131314] rounded-[var(--radius-card,24px)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] flex items-center justify-center mb-4">
              <UserCheck className="w-7 h-7" aria-hidden="true" focusable="false" />
            </div>
            <h3 className="text-xl font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white mb-2 tracking-tight">
              {t('about.action', 'Join the All-Energy Network')}
            </h3>
            <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] mb-6 leading-relaxed max-w-xs">
              {t('about.subtitle', 'Connect directly with certified solar developers, EPC contractors, and grid specialists.')}
            </p>
            
            {/* Action Button linking to /register */}
            <a 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 w-full bg-[var(--md-sys-color-primary,#1A73E8)] hover:bg-[var(--md-sys-color-primary-hover,#1557B0)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium rounded-full transition-all duration-200 shadow-xs cursor-pointer text-sm"
            >
              <span>{t('nav.register', 'Register Organization')}</span>
              <ArrowRight className="w-4 h-4 directional-icon" aria-hidden="true" focusable="false" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
