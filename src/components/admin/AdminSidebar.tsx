import React from 'react';
import {
  BarChart2, Newspaper, FileText, Users, BookOpen, GraduationCap, Inbox, Bot, ChevronLeft, ChevronRight, ShieldCheck, X
} from 'lucide-react';

export type AdminModule = 'dashboard' | 'news' | 'articles' | 'directory' | 'magazine' | 'academy' | 'applications' | 'scraper';

interface AdminSidebarProps {
  activeModule: AdminModule;
  onSelectModule: (module: AdminModule) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  counts: {
    news: number;
    articles: number;
    directory: number;
    magazine: number;
    academy: number;
    applications: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  counts
}) => {
  const navItems: { id: AdminModule; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'news', label: 'News Feed', icon: <Newspaper className="w-4 h-4" />, badge: counts.news },
    { id: 'articles', label: 'Articles', icon: <FileText className="w-4 h-4" />, badge: counts.articles },
    { id: 'directory', label: 'Directory', icon: <Users className="w-4 h-4" />, badge: counts.directory },
    { id: 'magazine', label: 'Magazines', icon: <BookOpen className="w-4 h-4" />, badge: counts.magazine },
    { id: 'academy', label: 'Academy', icon: <GraduationCap className="w-4 h-4" />, badge: counts.academy },
    { id: 'applications', label: 'Lead Inquiries', icon: <Inbox className="w-4 h-4" />, badge: counts.applications },
    { id: 'scraper', label: 'Auto Scraper', icon: <Bot className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-300 select-none border-r border-zinc-800">

      {/* Sidebar Header Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-zinc-950 font-black tracking-wider text-base shadow-sm shrink-0">
            EC
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-zinc-100 tracking-tight whitespace-nowrap">Energeia Panel</span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase whitespace-nowrap flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> System Admin
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-emerald-400'
                }`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate tracking-tight">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                  isActive
                    ? 'bg-zinc-950/20 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Health */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 space-y-2 text-[11px]">
          <div className="flex items-center justify-between text-zinc-300 font-semibold">
            <span>Platform Region</span>
            <span className="text-emerald-400 font-mono">eu-north-1</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-tight">
            Operated for energeia.cy. Cyprus Energy Authority & Directory Admin.
          </p>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Mobile Overlay Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-20 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
};
