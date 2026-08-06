import React from 'react';
import { Newspaper, Users, GraduationCap, BookOpen, Info, UserPlus } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'magazine', label: 'Magazine', icon: BookOpen },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1f1f1f] border-t border-[#dadce0] dark:border-[#3c4043] flex justify-around items-center py-2 px-1 shadow-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-full text-[11px] font-medium transition-all ${
              isActive
                ? 'text-[#1CA350] dark:text-[#8ab4f8] font-bold'
                : 'text-[#5f6368] dark:text-gray-400 hover:text-[#202124]'
            }`}
          >
            <div className={`px-3 py-1 rounded-full ${isActive ? 'bg-[#e8f5e9] dark:bg-[#1CA350]/20' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            </div>
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

