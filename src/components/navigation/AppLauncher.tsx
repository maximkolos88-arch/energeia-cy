import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Compass, 
  Zap, 
  Users, 
  GraduationCap, 
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  ECOSYSTEM_SURFACES, 
  EcosystemSurface, 
  getSurfaceUrl 
} from '../../utils/ecosystemRouting';

export interface AppLauncherProps {
  currentSurface?: EcosystemSurface;
  onSelectSurface?: (surface: EcosystemSurface) => void;
  className?: string;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  currentSurface = 'cluster',
  onSelectSurface,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const surfaces: EcosystemSurface[] = ['cluster', 'research', 'helios', 'members', 'academy'];

  const getSurfaceIcon = (surface: EcosystemSurface) => {
    switch (surface) {
      case 'cluster':
        return <Building2 className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />;
      case 'research':
        return <Compass className="w-5 h-5 text-[#1A73E8] dark:text-[#8AB4F8]" />;
      case 'helios':
        return <Zap className="w-5 h-5 text-[#D46200] dark:text-[#FFA726]" />;
      case 'members':
        return <Users className="w-5 h-5 text-[#137333] dark:text-[#81C995]" />;
      case 'academy':
        return <GraduationCap className="w-5 h-5 text-[#7B1FA2] dark:text-[#D7AEFB]" />;
    }
  };

  const handleSurfaceClick = (e: React.MouseEvent, surface: EcosystemSurface) => {
    setIsOpen(false);
    if (onSelectSurface) {
      e.preventDefault();
      onSelectSurface(surface);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* 9-Dots Google-Style Waffle Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Energeia Ecosystem Applications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Energeia Ecosystem Surfaces"
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
          isOpen
            ? 'bg-[#E8F0FE] dark:bg-[#0842A0]/30 text-[#1A73E8] dark:text-[#8AB4F8]'
            : 'text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C]'
        }`}
      >
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* 3x3 Dots Grid */}
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Floating 9-Dots App Launcher Modal */}
      {isOpen && (
        <div 
          role="dialog"
          aria-label="Energeia Ecosystem Launcher"
          className="absolute right-0 top-12 mt-2 w-[340px] sm:w-[380px] bg-white dark:bg-[#1E1F20] rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] overflow-hidden z-50 animate-scale-in"
        >
          {/* Cyprus Gradient Flow Header Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />

          {/* Launcher Header */}
          <div className="px-5 pt-4 pb-3 border-b border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] block">
                Cyprus All-Energy Network
              </span>
              <h3 className="text-base font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">
                Federated Ecosystem
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#E8F0FE] dark:bg-[#0842A0]/40 text-[#1A73E8] dark:text-[#8AB4F8]">
              5 Surfaces
            </span>
          </div>

          {/* Surface Grid List */}
          <div className="p-3 space-y-1.5 max-h-[420px] overflow-y-auto">
            {surfaces.map((surfaceKey) => {
              const def = ECOSYSTEM_SURFACES[surfaceKey];
              const isActive = currentSurface === surfaceKey;
              const targetUrl = getSurfaceUrl(surfaceKey);

              return (
                <a
                  key={surfaceKey}
                  href={targetUrl}
                  onClick={(e) => handleSurfaceClick(e, surfaceKey)}
                  className={`group flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#E8F0FE]/70 dark:bg-[#0842A0]/25 ring-1 ring-[#1A73E8]/30 dark:ring-[#8AB4F8]/40'
                      : 'hover:bg-[#F8F9FA] dark:hover:bg-[#282A2C]/70'
                  }`}
                >
                  {/* Icon Squircle */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-white dark:bg-[#131314] shadow-xs'
                      : 'bg-[#F1F3F4] dark:bg-[#2D2E30]'
                  }`}>
                    {getSurfaceIcon(surfaceKey)}
                  </div>

                  {/* Surface Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1F1F1F] dark:text-[#E3E3E3] truncate">
                          {def.name}
                        </span>
                        {def.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-[#F1F3F4] dark:bg-[#2A2B2E] text-[#5F6368] dark:text-[#9AA0A6]">
                            {def.badge}
                          </span>
                        )}
                      </div>
                      {isActive ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#1A73E8] dark:text-[#8AB4F8]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#80868B] dark:text-[#5F6368] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-0.5 line-clamp-1">
                      {def.tagline}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Launcher Footer Strip */}
          <div className="px-5 py-3 bg-[#F8F9FA] dark:bg-[#18191A] border-t border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between text-xs">
            <a
              href="/about"
              onClick={(e) => {
                setIsOpen(false);
                if (onSelectSurface) {
                  e.preventDefault();
                  onSelectSurface('cluster');
                  window.history.pushState({}, '', '/about');
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              className="text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition-colors"
            >
              Cluster Manifesto
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/register"
                onClick={(e) => {
                  setIsOpen(false);
                  if (onSelectSurface) {
                    e.preventDefault();
                    onSelectSurface('cluster');
                    window.history.pushState({}, '', '/register');
                    window.dispatchEvent(new Event('popstate'));
                  }
                }}
                className="font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline"
              >
                Join Cluster →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
