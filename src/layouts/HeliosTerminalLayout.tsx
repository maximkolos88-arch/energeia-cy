import React from 'react';
import { TerminalScreen } from '../components/TerminalScreen';

export const HeliosTerminalLayout: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#0B1120] text-slate-100 flex flex-col">
      <TerminalScreen />
    </div>
  );
};
