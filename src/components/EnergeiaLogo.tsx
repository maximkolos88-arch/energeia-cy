import React from 'react';

interface EnergeiaLogoProps {
  className?: string;
  color?: string;
  showText?: boolean;
  textSize?: string;
}

export const EnergeiaLogo: React.FC<EnergeiaLogoProps> = ({ 
  className = "w-8 h-auto", 
  color = "currentColor",
  showText = false,
  textSize = "text-xl"
}) => {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg 
        viewBox="0 0 100 42" 
        fill={color} 
        className={className} 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Energeia Logo Symbol"
      >
        {/* Top continuous solid bar */}
        <rect x="0" y="4" width="100" height="13" rx="1.5" />
        
        {/* Bottom segmented bar (3 equal blocks separated by 2 equal gaps) */}
        <rect x="0" y="25" width="28" height="13" rx="1.5" />
        <rect x="36" y="25" width="28" height="13" rx="1.5" />
        <rect x="72" y="25" width="28" height="13" rx="1.5" />
      </svg>
      {showText && (
        <span className={`font-extrabold tracking-tight ${textSize} text-[#202124] dark:text-white`}>
          Energeia
        </span>
      )}
    </div>
  );
};
