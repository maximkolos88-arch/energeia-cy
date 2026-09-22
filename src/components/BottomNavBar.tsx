import React from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, Users, GraduationCap, BookOpen, Info } from 'lucide-react';

import { FEATURES } from '../config/features';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const allTabs = [
    { id: 'news', label: t('nav.news'), icon: Newspaper, enabled: true },
    { id: 'members', label: t('nav.members'), icon: Users, enabled: FEATURES.enableMembers },
    { id: 'magazine', label: t('nav.magazine'), icon: BookOpen, enabled: FEATURES.enableMagazine },
    { id: 'academy', label: t('nav.academy'), icon: GraduationCap, enabled: FEATURES.enableAcademy },
    { id: 'about', label: t('nav.about'), icon: Info, enabled: FEATURES.enableAbout },
  ];

  const tabs = allTabs.filter(tab => tab.enabled);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1f1f1f] border-t border-[#dadce0] dark:border-[#3c4043] flex justify-around items-center px-1 shadow-md"
      style={{
        paddingTop: '8px',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
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
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full text-[11px] font-medium transition-all active:scale-[0.94] touch-manipulation cursor-pointer ${
              isActive
                ? 'text-primary dark:text-emerald-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className={`px-4 py-1 rounded-full transition-all ${isActive ? 'bg-primary/10 dark:bg-primary/20' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            </div>
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

