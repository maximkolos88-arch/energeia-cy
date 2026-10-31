import React, { useState, useEffect, useRef } from 'react';

export interface TopAppBarProps {
  currentLang?: string;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  unreadCount?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentLang,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  unreadCount = 0,
  activeTab = 'news',
  onTabChange,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeLang = currentLang || language || 'en';

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
    { code: 'en', label: 'English' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'ru', label: 'Русский' },
    { code: 'he', label: 'עברית' },
  ];

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, drawerOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const trimmed = searchQuery.trim();
      const targetUrl = trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/';
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new Event('popstate'));
    }
    setSearchOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent, href: string, tabId: string) => {
    setDrawerOpen(false);
    if (onTabChange) {
      e.preventDefault();
      onTabChange(tabId);
      if (typeof window !== 'undefined' && window.location.pathname !== href) {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
      }
    }
  };

  const isNewsActive = activeTab === 'news' || (!activeTab && (typeof window === 'undefined' || window.location.pathname === '/'));
  const isTerminalActive = activeTab === 'terminal' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/terminal'));
  const isMembersActive = activeTab === 'members' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/members'));
  const isAboutActive = activeTab === 'about' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/about'));

  return (
    <>
      {/* MINIMAL TOP BAR */}
      <header className="sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-[#131314]/95 backdrop-blur-md border-b border-[#F1F3F4] dark:border-[#282A2C] px-4 sm:px-8 flex items-center justify-between transition-colors">
        {/* Left: Hamburger + Google-style Logo Lockup */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-none stroke-currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a 
            href="/" 
            onClick={(e) => handleNavClick(e, '/', 'news')}
            className="flex items-center gap-1.5 text-[20px] font-medium text-[#1F1F1F] dark:text-[#E3E3E3] tracking-tight cursor-pointer"
          >
            <span>Energeia</span>
            <span className="text-[#5F6368] dark:text-[#9AA0A6] font-normal text-sm hidden sm:inline">| Research</span>
          </a>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Desktop Navigation">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/', 'news')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isNewsActive
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
            }`}
          >
            News & Intelligence
          </a>
          <a
            href="/terminal"
            onClick={(e) => handleNavClick(e, '/terminal', 'terminal')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isTerminalActive
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
            }`}
          >
            Helios Terminal
          </a>
          <a
            href="/members"
            onClick={(e) => handleNavClick(e, '/members', 'members')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isMembersActive
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
            }`}
          >
            Ecosystem Directory
          </a>
          <a
            href="/about"
            onClick={(e) => handleNavClick(e, '/about', 'about')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isAboutActive
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
            }`}
          >
            About Energeia
          </a>
        </nav>

        {/* Right: Search Trigger */}
        <div className="flex items-center gap-2">
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
        </div>
      </header>

      {/* SLIDE-OVER DRAWER (BACKDROP + CONTENT) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[280px] max-w-[80vw] h-full bg-white dark:bg-[#1E1F20] flex flex-col justify-between p-6 shadow-xl border-r border-[#F1F3F4] dark:border-[#282A2C]">
            {/* Top section: Header & Navigation Links */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F4] dark:border-[#282A2C] mb-6">
                <span className="text-lg font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">Energeia</span>
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

              <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
                <a
                  href="/"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isNewsActive
                      ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                      : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                  }`}
                  onClick={(e) => handleNavClick(e, '/', 'news')}
                >
                  News & Intelligence
                </a>
                <a
                  href="/terminal"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isTerminalActive
                      ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                      : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                  }`}
                  onClick={(e) => handleNavClick(e, '/terminal', 'terminal')}
                >
                  Helios Terminal
                </a>
                <a
                  href="/members"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isMembersActive
                      ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                      : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                  }`}
                  onClick={(e) => handleNavClick(e, '/members', 'members')}
                >
                  Ecosystem Directory
                </a>
                <a
                  href="/about"
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isAboutActive
                      ? 'text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#0842A0]/40 font-semibold'
                      : 'text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]'
                  }`}
                  onClick={(e) => handleNavClick(e, '/about', 'about')}
                >
                  About Energeia
                </a>
              </nav>
            </div>

            {/* Bottom section: Language Selector & Theme Toggle */}
            <div className="pt-6 border-t border-[#F1F3F4] dark:border-[#282A2C] flex flex-col gap-4">
              {/* Language Selector */}
              <div>
                <label className="block text-[11px] font-medium tracking-wider text-[#5F6368] dark:text-[#9AA0A6] uppercase mb-2">
                  Language
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onLanguageChange && onLanguageChange(lang.code)}
                      className={`px-2.5 py-1.5 text-xs rounded-md transition-colors text-center cursor-pointer ${
                        activeLang === lang.code
                          ? 'bg-[#E8F0FE] dark:bg-[#0842A0] text-[#1A73E8] dark:text-[#8AB4F8] font-medium'
                          : 'bg-[#F8F9FA] dark:bg-[#131314] text-[#444746] dark:text-[#C4C7C5] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle & Alerts */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-xs text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] cursor-pointer"
                >
                  <span>{effectiveDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {unreadCount > 0 && (
                  <span className="text-[11px] bg-[#E8F0FE] dark:bg-[#0842A0] text-[#1A73E8] dark:text-[#8AB4F8] px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} Alerts
                  </span>
                )}
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
