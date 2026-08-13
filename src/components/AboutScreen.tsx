import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from './PageHeader';

export const AboutScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader 
        description={t('about.subtitle')} 
        iconName="energy_savings_leaf" 
        title={t('about.title')}
      />

      {/* Manifesto & CTA Section */}
      <div className="mt-8 bg-white dark:bg-[#1b1c1e] border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-50/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          {/* Mission Text */}
          <div className="lg:col-span-3 space-y-6 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">{t('about.title')}</h2>
            <p>
              {t('about.text1')}
            </p>
            <p>
              {t('about.text2')}
            </p>
          </div>

          {/* CTA Box */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-850 text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">how_to_reg</span>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">{t('about.action')}</h3>
            <p className="text-sm text-neutral-500 mb-8">
              {t('about.subtitle')}
            </p>
            
            {/* Action Button linking to /register */}
            <a 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-3 w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-200 shadow-md cursor-pointer"
            >
              {t('nav.register')}
              <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
