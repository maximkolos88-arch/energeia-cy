import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { EnergeiaLogo } from './EnergeiaLogo';
import { FEATURES } from '../config/features';

interface TopAppBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ 
  activeTab, 
  onTabChange,
  language,
  onLanguageChange
}) => {
  const { t } = useTranslation();

  const handleSubscribeClick = () => {
    if (typeof window !== 'undefined') {
      const windowObj = window as any;
      windowObj.OneSignalDeferred = windowObj.OneSignalDeferred || [];
      windowObj.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.Slidedown.promptPush();
      });
    }
  };

  const allNavItems = [
    { id: 'news', label: t('nav.news'), enabled: true },
    { id: 'terminal', label: t('nav.terminal') || 'Terminal', enabled: FEATURES.enableTerminal },
    { id: 'members', label: t('nav.members'), enabled: FEATURES.enableMembers },
    { id: 'magazine', label: t('nav.magazine'), enabled: FEATURES.enableMagazine },
    { id: 'academy', label: t('nav.academy'), enabled: FEATURES.enableAcademy },
    { id: 'about', label: t('nav.about'), enabled: FEATURES.enableAbout },
    { id: 'register', label: t('nav.register'), enabled: FEATURES.enableRegister },
  ];

  const navItems = allNavItems.filter(item => item.enabled);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-[#1b1c1e] border-b border-neutral-200 dark:border-neutral-800 transition-colors shadow-2xs top-app-header">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Left & Center-Left: Logo & Inline Navigation Tabs */}
        <div className="flex items-center gap-8 flex-1">
          
          {/* Logo (Accessible Button control) */}
          <button 
            onClick={() => onTabChange('news')}
            aria-label="Energeia Cyprus Home"
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none text-start bg-transparent border-0 p-0 focus-visible:outline-2 focus-visible:outline-primary rounded-xl"
          >
            <div className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <EnergeiaLogo className="w-6 h-auto" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center font-bold text-lg tracking-tight text-neutral-900 dark:text-white leading-none">
                <span className="font-extrabold">Energeia</span>
              </div>
              <span className="hidden sm:block text-[9px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">Cyprus All-Energy Network</span>
            </div>
          </button>

          {/* Navigation Tabs (Relocated inline next to logo - desktop only) */}
          <nav className="hidden md:flex items-center gap-1.5 h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all rounded-lg cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Notification Subscribe Button & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Custom OneSignal Subscribe Button */}
          <button
            id="subscribe-news-btn"
            onClick={handleSubscribeClick}
            aria-label={t('nav.subscribeNews') || 'Subscribe to News'}
            title={t('nav.subscribeNews') || 'Subscribe to News'}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-500/30 shadow-2xs touch-manipulation active:scale-[0.96]"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline-block">{t('nav.subscribeNews') || 'Subscribe to News'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 border border-neutral-200 dark:border-neutral-850 rounded-lg p-0.5 bg-neutral-50 dark:bg-neutral-900 shrink-0">
            {(['en', 'el', 'ru', 'he'] as const).map((lang) => {
              const isActive = language === lang;
              const labelMap: Record<string, string> = {
                en: 'EN',
                el: 'ΕΛ',
                ru: 'РУ',
                he: 'עב'
              };
              const fullNameMap: Record<string, string> = {
                en: 'English',
                el: 'Greek',
                ru: 'Russian',
                he: 'Hebrew'
              };
              return (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  aria-label={`Switch language to ${fullNameMap[lang]}`}
                  className={`px-2 py-1 sm:px-2.5 min-h-[32px] text-[10px] font-bold transition-all rounded-md cursor-pointer touch-manipulation flex items-center justify-center ${
                    isActive
                      ? 'bg-primary text-white shadow-3xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {labelMap[lang]}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
};
