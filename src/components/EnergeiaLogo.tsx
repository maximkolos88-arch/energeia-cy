import React, { useId } from 'react';

export type EnergeiaDescriptor = 'Research' | 'Helios' | 'Network' | 'Cyprus' | 'Academy' | 'Console';

interface EnergeiaLogoProps {
  className?: string;
  showDescriptor?: boolean;
  descriptor?: EnergeiaDescriptor;
  variant?: 'gradient' | 'monochrome' | 'white';
  onClick?: () => void;
}

export const EnergeiaLogo: React.FC<EnergeiaLogoProps> = ({
  className = "h-8",
  showDescriptor = true,
  descriptor = "Research",
  variant = "gradient",
  onClick,
}) => {
  const rawId = useId();
  const gradId = `cyprus-flag-flow-${rawId.replace(/:/g, '')}`;

  const getFill = () => {
    if (variant === 'monochrome') return 'currentColor';
    if (variant === 'white') return '#FFFFFF';
    return `url(#${gradId})`;
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Power Input Glyph */}
      <svg
        viewBox="0 0 46 34"
        className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {variant === 'gradient' && (
          <defs>
            <linearGradient
              id={gradId}
              x1="2"
              y1="17"
              x2="44"
              y2="17"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="18%" stopColor="#FFF8EE" />
              <stop offset="38%" stopColor="#FFA726" />
              <stop offset="54%" stopColor="#D46200" />
              <stop offset="70%" stopColor="#B85100" />
              <stop offset="85%" stopColor="#6B882A" />
              <stop offset="100%" stopColor="#3C4E1C" />
            </linearGradient>
          </defs>
        )}

        <g
          fill={getFill()}
          className={variant === 'gradient' ? "stroke-black/[0.12] dark:stroke-white/[0.18]" : undefined}
          strokeWidth={variant === 'gradient' ? 0.75 : 0}
        >
          {/* Top continuous busbar */}
          <rect x="2" y="5" width="42" height="6.5" rx="3.25" />

          {/* Three pulses: White -> Copper -> Olive */}
          <rect x="2" y="19.5" width="10" height="6.5" rx="3.25" />
          <rect x="18" y="19.5" width="10" height="6.5" rx="3.25" />
          <rect x="34" y="19.5" width="10" height="6.5" rx="3.25" />
        </g>
      </svg>

      {/* Google Sans Typography Lockup */}
      <div className="flex items-center gap-2 tracking-tight">
        <span className={`text-[20px] sm:text-[22px] font-medium leading-none ${
          variant === 'white' 
            ? 'text-white' 
            : 'text-[#1F1F1F] dark:text-[#E3E3E3]'
        }`}>
          Energeia
        </span>
        {showDescriptor && (
          <>
            <span
              className={`hidden sm:inline-block h-4 w-[1px] ${
                variant === 'white'
                  ? 'bg-white/30'
                  : 'bg-[#DADCE0] dark:bg-[#444746]'
              }`}
              aria-hidden="true"
            />
            <span className={`hidden sm:inline-block text-[13px] sm:text-[14px] font-normal leading-none ${
              variant === 'white'
                ? 'text-white/70'
                : 'text-[#5F6368] dark:text-[#9AA0A6]'
            }`}>
              {descriptor}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default EnergeiaLogo;
