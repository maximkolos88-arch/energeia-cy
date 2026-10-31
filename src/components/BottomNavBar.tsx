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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--md-sys-color-background,#FFFFFF)]/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border-t border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] flex justify-around items-center px-2 shadow-lg"
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
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 touch-manipulation cursor-pointer ${
              isActive
                ? 'text-[var(--md-sys-color-primary,#1A73E8)] dark:text-[var(--md-sys-color-primary,#8AB4F8)] font-semibold'
                : 'text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] hover:text-black dark:hover:text-white'
            }`}
          >
            <div className={`px-4 py-1 rounded-full transition-all ${
              isActive 
                ? 'bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)]' 
                : 'bg-transparent'
            }`}>
              <Icon className="w-5 h-5" aria-hidden="true" focusable="false" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
