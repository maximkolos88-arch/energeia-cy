import React from 'react';
import { AcademyScreen } from '../components/AcademyScreen';

export const AcademyLayout: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors">
      <AcademyScreen />
    </div>
  );
};
