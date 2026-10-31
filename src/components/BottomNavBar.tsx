import React from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, Users, Info, Radar } from 'lucide-react';
import { FEATURES } from '../config/features';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const allTabs = [
    { id: 'news', label: t('nav.news', 'News'), icon: Newspaper, enabled: true },
    { id: 'terminal', label: t('nav.terminal', 'Terminal'), icon: Radar, enabled: FEATURES.enableTerminal },
    { id: 'members', label: t('nav.members', 'Members'), icon: Users, enabled: FEATURES.enableMembers },
    { id: 'about', label: t('nav.about', 'About'), icon: Info, enabled: FEATURES.enableAbout },
  ];

  const tabs = allTabs.filter(tab => tab.enabled);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#131314]/95 backdrop-blur-md border-t border-[#F1F3F4] dark:border-[#282A2C] flex justify-around items-center px-2"
      style={{
        paddingTop: '6px',
        paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
        boxSizing: 'border-box'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 transition-colors active:scale-95 touch-manipulation cursor-pointer ${
              isActive
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] font-medium'
                : 'text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center">
              <Icon className="w-5 h-5" aria-hidden="true" focusable="false" />
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
