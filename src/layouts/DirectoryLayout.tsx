import React from 'react';
import { DirectoryScreen } from '../components/DirectoryScreen';

export const DirectoryLayout: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors">
      <DirectoryScreen />
    </div>
  );
};
