import React from 'react';
import { useTranslation } from 'react-i18next';
import { EnergeiaLogo } from './EnergeiaLogo';

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

  const navItems = [
    { id: 'news', label: t('nav.news') },
    { id: 'members', label: t('nav.members') },
    { id: 'magazine', label: t('nav.magazine') },
    { id: 'academy', label: t('nav.academy') },
    { id: 'about', label: t('nav.about') },
    { id: 'register', label: t('nav.register') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1b1c1e] border-b border-neutral-200 dark:border-neutral-800 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Left & Center-Left: Logo & Inline Navigation Tabs */}
        <div className="flex items-center gap-8 flex-1">
          
          {/* Logo (Static, Black & White) */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
            onClick={() => onTabChange('news')}
          >
            <div className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <EnergeiaLogo className="w-6 h-auto" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center font-bold text-lg tracking-tight text-neutral-900 dark:text-white leading-none">
                <span className="font-extrabold">Energeia</span>
              </div>
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">Cyprus All-Energy Network</span>
            </div>
          </div>

          {/* Navigation Tabs (Relocated inline next to logo - desktop only) */}
          <nav className="hidden md:flex items-center gap-1.5 h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all rounded-lg ${
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

        {/* Right Section: Language Switcher */}
        <div className="flex items-center gap-0.5 border border-neutral-200 dark:border-neutral-850 rounded-lg p-0.5 bg-neutral-50 dark:bg-neutral-900 shrink-0">
          {(['en', 'el', 'ru', 'he'] as const).map((lang) => {
            const isActive = language === lang;
            const labelMap: Record<string, string> = {
              en: 'EN',
              el: 'ΕΛ',
              ru: 'РУ',
              he: 'עב'
            };
            return (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 text-[10px] font-bold transition-all rounded-md cursor-pointer ${
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
    </header>
  );
};
