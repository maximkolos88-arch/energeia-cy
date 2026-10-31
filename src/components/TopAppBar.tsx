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
  const [menuOpen, setMenuOpen] = useState(false);
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
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (menuOpen) setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, menuOpen]);

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
    <header className="top-app-header sticky top-0 z-50 bg-white/95 dark:bg-[#131314]/95 backdrop-blur-md border-b border-[#F1F3F4] dark:border-[#282A2C] transition-colors select-none">
      
      {/* Mobile Top Header (md:hidden) */}
      <div className="md:hidden px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Open Navigation Menu"
            aria-expanded={menuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 text-[#1F1F1F] dark:text-[#E3E3E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange('news');
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
              }
            }}
            className="flex items-center gap-1.5 text-[20px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight cursor-pointer"
          >
            <span>Energeia</span>
            <span className="text-[#5F6368] dark:text-[#9AA0A6] font-normal text-sm">Research</span>
          </a>
        </div>

        <button 
          type="button"
          onClick={() => {
            setIsSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          aria-label="Search"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-[#5F6368] dark:text-[#9AA0A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </div>

      {/* Mobile Search Overlay Bar (md:hidden) */}
      {isSearchOpen && (
        <div className="md:hidden absolute inset-0 z-50 bg-white/98 dark:bg-[#131314]/98 backdrop-blur-md px-4 flex items-center gap-2 border-b border-[#F1F3F4] dark:border-[#282A2C] animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#5F6368] dark:text-[#9AA0A6] shrink-0" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder', 'Search intelligence, assets...')}
              className="w-full h-10 bg-transparent text-sm text-[#1F1F1F] dark:text-[#E3E3E3] placeholder-[#5F6368] dark:placeholder-[#9AA0A6] focus:outline-none"
              autoFocus
            />
          </form>
          <button
            type="button"
            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            aria-label="Close search"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Mobile Navigation Drawer Overlay (md:hidden) */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="w-4/5 max-w-sm h-full bg-white dark:bg-[#1E1F20] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#F1F3F4] dark:border-[#282A2C]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Brand */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F4] dark:border-[#282A2C] mb-5">
                <div className="flex items-center gap-2 text-xl font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight">
                  <div className="p-1 rounded-lg bg-[var(--md-sys-color-primary,#1A73E8)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] text-white dark:text-[#062E6F] flex items-center justify-center">
                    <EnergeiaLogo className="w-4 h-auto" />
                  </div>
                  <span>Energeia</span>
                  <span className="text-[#5F6368] dark:text-[#9AA0A6] font-normal text-sm">Research</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close Navigation Menu"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav aria-label="Mobile Drawer Navigation" className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onTabChange(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors text-left cursor-pointer ${
                        isActive
                          ? 'bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] font-semibold'
                          : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Drawer Actions: Language, Theme, Subscribe */}
            <div className="pt-6 border-t border-[#F1F3F4] dark:border-[#282A2C] flex flex-col gap-4">
              {/* Language Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider">Language</span>
                <div 
                  role="group" 
                  aria-label="Language selector"
                  className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#E0E2E0] dark:border-[#444746]"
                >
                  {(['en', 'el', 'ru', 'he'] as const).map((lang) => {
                    const isActive = language === lang;
                    const labelMap: Record<string, string> = { en: 'EN', el: 'ΕΛ', ru: 'РУ', he: 'עב' };
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          onLanguageChange(lang);
                        }}
                        aria-pressed={isActive}
                        className={`py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                          isActive
                            ? 'bg-[var(--md-sys-color-primary,#1A73E8)] dark:bg-[var(--md-sys-color-primary,#8AB4F8)] text-white dark:text-[#062E6F] shadow-xs'
                            : 'text-[#5F6368] dark:text-[#9AA0A6] hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {labelMap[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme & Subscribe Controls */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to Light Theme" : "Switch to Antigravity Dark Theme"}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E0E2E0] dark:border-[#444746] bg-[#F8F9FA] dark:bg-[#131314] text-xs font-medium text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#5F6368]" aria-hidden="true" />
                      <span>Dark</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSubscribeClick}
                  className="py-2.5 px-4 text-xs font-medium text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Alerts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Top Header Layout (hidden md:flex) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 md:px-6 h-16 items-center justify-between gap-4">
        
        {/* Left Section: research.google Product Lockup & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          
          {/* Google Product Lockup: Energeia | Cyprus Energy Intelligence */}
          <button 
            type="button"
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
          <nav aria-label="Primary Navigation" className="flex items-center gap-1 h-16">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
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
            type="button"
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
