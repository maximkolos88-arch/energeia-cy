import React from 'react';
import { Shield } from 'lucide-react';
import { EnergeiaLogo } from './EnergeiaLogo';

interface TopAppBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ 
  activeTab, 
  onTabChange
}) => {
  const navItems = [
    { id: 'news', label: 'News' },
    { id: 'members', label: 'Members' },
    { id: 'magazine', label: 'Magazine' },
    { id: 'academy', label: 'Academy' },
    { id: 'about', label: 'About' },
    { id: 'register', label: 'Join Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1f1f1f] border-b border-[#dadce0] dark:border-[#3c4043] transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Left & Center-Left: Logo & Inline Navigation Tabs */}
        <div className="flex items-center gap-8 flex-1 overflow-x-auto hide-scrollbar">
          
          {/* Logo (Static, Black & White) */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
            onClick={() => onTabChange('news')}
          >
            <div className="p-2 rounded-xl bg-[#202124] dark:bg-white text-white dark:text-[#202124] flex items-center justify-center shadow-xs">
              <EnergeiaLogo className="w-6 h-auto" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center font-bold text-lg tracking-tight text-[#202124] dark:text-white leading-none">
                <span className="font-extrabold">Energeia</span>
              </div>
              <span className="text-[9px] text-[#5f6368] dark:text-gray-400 font-medium tracking-wide">Cyprus All-Energy Network</span>
            </div>
          </div>

          {/* Navigation Tabs (Relocated inline next to logo) */}
          <nav className="flex items-center gap-1.5 h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all rounded-lg ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                      : 'text-[#5f6368] dark:text-gray-400 hover:text-[#202124] dark:hover:text-white hover:bg-[#f8f9fa] dark:hover:bg-[#2d2e30]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

        </div>

      </div>
    </header>
  );
};
