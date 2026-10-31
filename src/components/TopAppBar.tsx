import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Search, Sun, Moon, X, Command } from 'lucide-react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energeia_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle Dark Theme
  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeStr = nextDark ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeStr);
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('energeia_theme', themeStr);
    }
  };

  // Keyboard shortcut listener: Cmd+K / / to open search, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => {
          if (!prev) setTimeout(() => searchInputRef.current?.focus(), 50);
          return !prev;
        });
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const trimmed = searchQuery.trim();
      const targetUrl = trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/';
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new Event('popstate'));
    }
    setIsSearchOpen(false);
  };

  const handleSubscribeClick = () => {
    if (typeof window !== 'undefined') {
      const windowObj = window as any;
      windowObj.OneSignalDeferred = windowObj.OneSignalDeferred || [];

      if (!document.getElementById('onesignal-sdk-script')) {
        const script = document.createElement('script');
        script.id = 'onesignal-sdk-script';
        script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
        script.defer = true;
        document.head.appendChild(script);

        windowObj.OneSignalDeferred.push(async function(OneSignal: any) {
          await OneSignal.init({
            appId: 'e4d374ff-f1ad-495f-a839-b2f52efb05fc',
            safari_web_id: 'web.onesignal.auto.02093de6-f6ab-427c-bf3a-c7ddb76bfc75',
            serviceWorkerPath: 'sw.js',
            notifyButton: { enable: false },
          });
          await OneSignal.Slidedown.promptPush();
        });
      } else {
        windowObj.OneSignalDeferred.push(async function(OneSignal: any) {
          await OneSignal.Slidedown.promptPush();
        });
      }
    }
  };

  const allNavItems = [
    { id: 'news', label: t('nav.news', 'News'), enabled: true },
    { id: 'terminal', label: t('nav.terminal', 'Terminal'), enabled: FEATURES.enableTerminal },
    { id: 'members', label: t('nav.members', 'Members'), enabled: FEATURES.enableMembers },
    { id: 'about', label: t('nav.about', 'About'), enabled: FEATURES.enableAbout },
  ];

  const navItems = allNavItems.filter(item => item.enabled);

  return (
    <header className="top-app-header w-full transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: research.google Product Lockup & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          
          {/* Google Product Lockup: Energeia | Cyprus Energy Intelligence */}
          <button 
            onClick={() => onTabChange('news')}
            aria-label="Energeia Home"
            className="flex items-center gap-3 shrink-0 cursor-pointer bg-transparent border-0 p-0 text-start group rounded-xl focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary,#1A73E8)]"
          >
            <div className="p-1.5 rounded-xl bg-[var(--md-sys-color-primary,#1A73E8)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] text-white dark:text-[#062E6F] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <EnergeiaLogo className="w-5 h-auto" />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-medium text-[22px] tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-[var(--md-sys-color-on-surface,#E3E3E3)] leading-none">
                Energeia
              </span>
              <span className="hidden sm:inline-block h-4 w-[1px] bg-[var(--md-sys-color-outline,#DADCE0)] dark:bg-[var(--md-sys-color-outline,#444746)]" aria-hidden="true" />
              <span className="hidden lg:inline-block text-[15px] font-normal text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] tracking-normal">
                Cyprus Energy Intelligence
              </span>
            </div>
          </button>

          {/* Desktop Navigation with 3px Google Blue Bottom Indicator */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-1 h-16">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative h-16 px-3.5 flex items-center text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] font-semibold'
                      : 'text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-on-surface-variant,#C4C7C5)] hover:text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span 
                      className="absolute bottom-0 inset-x-2 h-[3px] bg-[var(--md-sys-color-primary,#1A73E8)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] rounded-t-full transition-all"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Expandable Global Search, Subscribe, Theme Toggle & Language */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Instant Search Control (research.google style expandable pill) */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center animate-fade-in">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder', 'Search intelligence, assets...')}
                  className="w-48 sm:w-64 md:w-80 h-9 pl-9 pr-8 text-xs bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:bg-[var(--md-sys-color-surface-container,#282A2C)] text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white rounded-full border border-transparent focus:border-[var(--md-sys-color-primary,#1A73E8)] focus:bg-white dark:focus:bg-[#1E1F20] outline-none transition-all shadow-inner"
                />
                <Search className="w-3.5 h-3.5 text-[var(--md-sys-color-secondary-text,#5F6368)] absolute left-3 pointer-events-none" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  aria-label="Close search"
                  className="absolute right-2.5 p-0.5 text-[var(--md-sys-color-secondary-text,#5F6368)] hover:text-black dark:hover:text-white rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                aria-label="Open search (Cmd+K)"
                title="Search (Cmd+K or /)"
                className="flex items-center gap-2 h-9 px-3 rounded-full bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] hover:bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:hover:bg-[var(--md-sys-color-surface-container,#282A2C)] text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] transition-all cursor-pointer text-xs"
              >
                <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="hidden xl:inline text-xs text-[var(--md-sys-color-secondary-text,#5F6368)]">Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--md-sys-color-secondary-text,#5F6368)] bg-white dark:bg-[#131314] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-md shadow-2xs">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>
            )}
          </div>

          {/* Subscribe to News Button */}
          <button
            id="subscribe-news-btn"
            onClick={handleSubscribeClick}
            aria-label={t('nav.subscribeNews', 'Subscribe to Alerts')}
            title={t('nav.subscribeNews', 'Subscribe to Alerts')}
            className="h-9 px-3 text-xs font-medium text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] hover:bg-[#C2D7FB] dark:hover:bg-[#0c50be] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Bell className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden lg:inline">{t('nav.subscribeNews', 'Subscribe')}</span>
          </button>

          {/* Theme Switcher Toggle (Light / Antigravity Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Theme" : "Switch to Antigravity Dark Theme"}
            title={isDark ? "Switch to Light Theme" : "Switch to Antigravity Dark Theme"}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] hover:bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:hover:bg-[var(--md-sys-color-surface-container,#282A2C)] text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-on-surface-variant,#C4C7C5)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] transition-all cursor-pointer shrink-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--md-sys-color-secondary-text,#5F6368)]" aria-hidden="true" />
            )}
          </button>

          {/* Material 3 Segmented Language Pill */}
          <div 
            role="group" 
            aria-label="Language selector"
            className="flex items-center gap-0.5 border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-full p-0.5 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] shrink-0"
          >
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
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  aria-pressed={isActive}
                  title={`Switch language to ${fullNameMap[lang]}`}
                  className={`px-2 py-1 text-[11px] font-semibold transition-all rounded-full cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-[var(--md-sys-color-primary,#1A73E8)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] text-white dark:text-[#062E6F] shadow-xs'
                      : 'text-[var(--md-sys-color-secondary-text,#5F6368)] hover:text-black dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] dark:hover:text-white'
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

export default TopAppBar;
