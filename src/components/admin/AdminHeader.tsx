import React from 'react';
import {
  Search, Sun, Moon, Database, RefreshCw, X, Menu, LogOut, ShieldCheck, Sparkles, CheckCircle
} from 'lucide-react';

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  dbStatus: 'connected' | 'connecting' | 'error';
  lastSyncTime: string | null;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  activeModuleName: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  dbStatus,
  lastSyncTime,
  onRefreshData,
  isRefreshing,
  onLogout,
  onToggleMobileMenu,
  isMobileMenuOpen,
  activeModuleName
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 gap-4">

        {/* Left: Mobile Toggle & Section Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              E
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                {activeModuleName}
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40">
                  Live Admin
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Quick search records, titles, members..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Real-time Status Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Supabase Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                dbStatus === 'connected' ? 'bg-emerald-400' : dbStatus === 'connecting' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                dbStatus === 'connected' ? 'bg-emerald-500' : dbStatus === 'connecting' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
            </span>
            <Database className="w-3 h-3 text-zinc-400" />
            <span className="hidden md:inline">Supabase</span>
          </div>



          {/* Refresh Action */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Refresh database records"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title="Toggle theme mode"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Admin User Info & Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">Admin User</span>
              <span className="text-[10px] text-zinc-400 leading-tight">admin@energeia.cy</span>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
