import React, { useState, useEffect, useRef } from 'react';
import { EnergeiaLogo } from './EnergeiaLogo';
import { AppLauncher } from './navigation/AppLauncher';
import { 
  ECOSYSTEM_SURFACES, 
  EcosystemSurface, 
  detectCurrentSurface,
  getSurfaceUrl 
} from '../utils/ecosystemRouting';
import { 
  Building2, 
  Compass, 
  Zap, 
  Users, 
  GraduationCap 
} from 'lucide-react';

export interface TopAppBarProps {
  currentLang?: string;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  unreadCount?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  currentSurface?: EcosystemSurface;
  onSelectSurface?: (surface: EcosystemSurface) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentLang,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  activeTab = 'cluster',
  onTabChange,
  currentSurface,
  onSelectSurface,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = currentLang || language || 'en';

  // Determine active surface
  const effectiveSurface: EcosystemSurface = currentSurface || detectCurrentSurface();
  const surfaceDef = ECOSYSTEM_SURFACES[effectiveSurface] || ECOSYSTEM_SURFACES.cluster;

  const [internalDark, setInternalDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energeia_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const effectiveDarkMode = isDarkMode !== undefined ? isDarkMode : internalDark;

  const toggleTheme = () => {
    const next = !effectiveDarkMode;
    setInternalDark(next);
    if (typeof document !== 'undefined') {
      const themeStr = next ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', themeStr);
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('energeia_theme', themeStr);
    }
    if (onToggleTheme) {
      onToggleTheme();
    }
  };

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'el', label: 'Ελληνικά', short: 'ΕΛ' },
    { code: 'ru', label: 'Русский', short: 'РУ' },
    { code: 'he', label: 'עברית', short: 'עב' },
  ];

  const handleSelectLanguage = (langCode: string) => {
    if (typeof document !== 'undefined') {
      if (langCode === 'he') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'he');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', langCode);
      }
    }
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    setLangDropdownOpen(false);
  };

  // Keyboard shortcut listener: Cmd+K / / to open search, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => {
          if (!prev) setTimeout(() => searchInputRef.current?.focus(), 50);
          return !prev;
        });
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (drawerOpen) setDrawerOpen(false);
        if (langDropdownOpen) setLangDropdownOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen, drawerOpen, langDropdownOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const trimmed = searchQuery.trim();
      const targetUrl = trimmed ? `/research?q=${encodeURIComponent(trimmed)}` : '/research';
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new Event('popstate'));
    }
    setSearchOpen(false);
  };

  const handleSurfaceClick = (e: React.MouseEvent, surface: EcosystemSurface, href: string) => {
    setDrawerOpen(false);
    if (onSelectSurface) {
      e.preventDefault();
      onSelectSurface(surface);
      if (typeof window !== 'undefined' && window.location.pathname !== href) {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
      }
    }
  };

  const currentLangObj = languages.find((l) => l.code === activeLang) || languages[0];

  return (
    <>
      {/* 64px FIXED HEADER BAR */}
      <header role="banner" className="google-header sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-[#131314]/95 backdrop-blur-md border-b border-[#F1F3F4] dark:border-[#282A2C] px-4 sm:px-8 flex items-center justify-between transition-colors">
        
        {/* Left: Mobile ☰ + Energeia Wordmark / Desktop Logo Lockup with Surface Descriptor */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors cursor-pointer md:hidden"
          >
            <svg className="w-5 h-5 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a 
            href={surfaceDef.path}
            onClick={(e) => handleSurfaceClick(e, effectiveSurface, surfaceDef.path)}
            className="flex items-center cursor-pointer"
            aria-label={`Energeia ${surfaceDef.name} Home`}
          >
            <EnergeiaLogo descriptor={surfaceDef.descriptor} variant="gradient" />
          </a>
        </div>

        {/* Center: Desktop Clean Text Links across the 5 Federated Surfaces */}
        <nav className="hidden md:flex items-center gap-6 h-full" aria-label="Desktop Navigation">
          <a
            href="/"
            onClick={(e) => handleSurfaceClick(e, 'cluster', '/')}
            className={`h-full flex items-center px-1 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              effectiveSurface === 'cluster' && activeTab !== 'about'
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8] font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] border-transparent'
            }`}
          >
            Cluster
          </a>
          <a
            href="/research"
            onClick={(e) => handleSurfaceClick(e, 'research', '/research')}
            className={`h-full flex items-center px-1 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              effectiveSurface === 'research'
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8] font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] border-transparent'
            }`}
          >
            Research
          </a>
          <a
            href="/helios"
            onClick={(e) => handleSurfaceClick(e, 'helios', '/helios')}
            className={`h-full flex items-center px-1 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              effectiveSurface === 'helios'
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8] font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] border-transparent'
            }`}
          >
            Helios Terminal
          </a>
          <a
            href="/members"
            onClick={(e) => handleSurfaceClick(e, 'members', '/members')}
            className={`h-full flex items-center px-1 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              effectiveSurface === 'members'
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8] font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] border-transparent'
            }`}
          >
            Directory
          </a>
          <a
            href="/academy"
            onClick={(e) => handleSurfaceClick(e, 'academy', '/academy')}
            className={`h-full flex items-center px-1 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
              effectiveSurface === 'academy'
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8] font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] border-transparent'
            }`}
          >
            Academy
          </a>
        </nav>

        {/* Right: Google 9-Dots App Launcher, Search, Language Pill, Theme Switcher */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Google-Style 9-Dots App Launcher (Waffle) */}
          <AppLauncher 
            currentSurface={effectiveSurface} 
            onSelectSurface={onSelectSurface} 
          />

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            aria-label="Search energy intelligence"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Desktop Language Dropdown Pill (EN ⌄) */}
          <div className="relative hidden md:block" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-9 px-3 rounded-full border border-[#DADCE0] dark:border-[#444746] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-xs font-medium text-[#444746] dark:text-[#C4C7C5] flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="Select language"
              aria-expanded={langDropdownOpen}
            >
              <span>{currentLangObj.short}</span>
              <svg className="w-3.5 h-3.5 text-[#5F6368] dark:text-[#9AA0A6] fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1E1F20] rounded-xl shadow-lg border border-[#F1F3F4] dark:border-[#282A2C] py-1.5 z-50 animate-scale-up">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelectLanguage(l.code)}
                    className={`w-full px-4 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeLang === l.code
                        ? 'bg-[#E8F0FE] dark:bg-[#0842A0]/40 text-[#1A73E8] dark:text-[#8AB4F8] font-semibold'
                        : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] uppercase">{l.short}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Antigravity Dark Mode Toggle (☀/☾) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={effectiveDarkMode ? "Switch to Light Mode" : "Switch to Antigravity Dark Mode"}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
          >
            {effectiveDarkMode ? (
              <svg className="w-5 h-5 text-amber-400 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="5" strokeWidth="2"/>
                <path strokeLinecap="round" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#5F6368] fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER (MATERIAL 3) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[310px] max-w-[85vw] h-full bg-white dark:bg-[#1E1F20] flex flex-col justify-between p-6 shadow-2xl border-r border-[#F1F3F4] dark:border-[#282A2C] overflow-y-auto">
            {/* Top: Brand Header & Close */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F4] dark:border-[#282A2C] mb-6">
                <EnergeiaLogo descriptor={surfaceDef.descriptor} variant="gradient" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close Menu"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Federated Ecosystem Surfaces Group */}
              <div className="mb-6">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-3">
                  Ecosystem Surfaces
                </span>
                <nav className="flex flex-col gap-1.5" aria-label="Mobile Ecosystem Surfaces">
                  <a
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      effectiveSurface === 'cluster' && activeTab !== 'about'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'cluster', '/')}
                  >
                    <Building2 className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                    <span>Energeia Cluster</span>
                  </a>

                  <a
                    href="/research"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      effectiveSurface === 'research'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'research', '/research')}
                  >
                    <Compass className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                    <span>Research &amp; Intelligence</span>
                  </a>

                  <a
                    href="/helios"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      effectiveSurface === 'helios'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'helios', '/helios')}
                  >
                    <Zap className="w-4 h-4 text-[#D46200] dark:text-[#FFA726]" />
                    <span>Helios Terminal</span>
                  </a>

                  <a
                    href="/members"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      effectiveSurface === 'members'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'members', '/members')}
                  >
                    <Users className="w-4 h-4 text-[#137333] dark:text-[#81C995]" />
                    <span>Ecosystem Directory</span>
                  </a>

                  <a
                    href="/academy"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      effectiveSurface === 'academy'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'academy', '/academy')}
                  >
                    <GraduationCap className="w-4 h-4 text-[#7B1FA2] dark:text-[#D7AEFB]" />
                    <span>Energeia Academy</span>
                  </a>
                </nav>
              </div>

              {/* Institutional Links */}
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-3">
                  Institutional
                </span>
                <nav className="flex flex-col gap-1" aria-label="Mobile Institutional Links">
                  <a
                    href="/about"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === 'about'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'cluster', '/about')}
                  >
                    About Energeia
                  </a>
                  <a
                    href="/register"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === 'register'
                        ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                        : 'text-[#1F1F1F] dark:text-[#E3E3E3] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                    }`}
                    onClick={(e) => handleSurfaceClick(e, 'cluster', '/register')}
                  >
                    Join the Network
                  </a>
                </nav>
              </div>
            </div>

            {/* Bottom: Language Matrix, Theme Switcher, and Statutory Details */}
            <div className="pt-6 border-t border-[#F1F3F4] dark:border-[#282A2C] flex flex-col gap-5">
              {/* Language Matrix: 2x2 Grid */}
              <div>
                <label className="block text-[11px] font-medium tracking-[0.08em] text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-2.5">
                  Language Matrix
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectLanguage(l.code)}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors text-center cursor-pointer border ${
                        activeLang === l.code
                          ? 'bg-[#E8F0FE] dark:bg-[#0842A0] text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8] font-semibold'
                          : 'bg-[#F8F9FA] dark:bg-[#131314] text-[#444746] dark:text-[#C4C7C5] border-[#DADCE0] dark:border-[#444746] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Switcher Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-[#444746] dark:text-[#C4C7C5]">Appearance</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-full border border-[#DADCE0] dark:border-[#444746] bg-[#F8F9FA] dark:bg-[#131314] text-xs font-medium text-[#1F1F1F] dark:text-[#E3E3E3] flex items-center gap-1.5 cursor-pointer hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]"
                >
                  {effectiveDarkMode ? 'Antigravity Dark' : 'Light Mode'}
                </button>
              </div>

              {/* Statutory Details */}
              <div className="pt-2 text-[11px] text-[#5F6368] dark:text-[#9AA0A6] tracking-tight">
                M3J2 LTD • Reg. HE 438859
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY MODAL */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#1E1F20] rounded-2xl shadow-2xl border border-[#F1F3F4] dark:border-[#282A2C] overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-[#F1F3F4] dark:border-[#282A2C]">
              <svg className="w-5 h-5 text-[#5F6368] dark:text-[#9AA0A6] shrink-0 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search energy intelligence, assets, companies..."
                className="w-full bg-transparent text-sm text-[#1F1F1F] dark:text-[#E3E3E3] placeholder-[#5F6368] dark:placeholder-[#9AA0A6] focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                aria-label="Close search"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TopAppBar;
