import React, { useId } from 'react';

export type LogoVariant = 'gradient' | 'monochrome' | 'white';

interface EnergeiaLogoProps {
  className?: string;
  variant?: LogoVariant;
  showDescriptor?: boolean;
  descriptor?: string;
  descriptorClassName?: string;
  hideDescriptorOnMobile?: boolean;
  onClick?: () => void;
}

export const EnergeiaLogo: React.FC<EnergeiaLogoProps> = ({
  className = "h-8",
  variant = "gradient",
  showDescriptor = true,
  descriptor = "Research",
  descriptorClassName = "",
  hideDescriptorOnMobile = false,
  onClick,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const gradientId = `ag-spectrum-${uniqueId}`;
  const sheenId = `ag-sheen-${uniqueId}`;

  // Определение заливки знака
  const getGlyphFill = () => {
    switch (variant) {
      case 'white':
        return '#FFFFFF';
      case 'monochrome':
        return 'currentColor';
      case 'gradient':
      default:
        return `url(#${gradientId})`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Power Input Glyph */}
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {variant === 'gradient' && (
          <defs>
            {/* Непрерывный спектр Antigravity от левого края (2px) до правого (30px) */}
            <linearGradient
              id={gradientId}
              x1="2"
              y1="16"
              x2="30"
              y2="16"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#2B66FF" />    {/* Electric Blue */}
              <stop offset="16%" stopColor="#00D4FF" />   {/* Cyan */}
              <stop offset="34%" stopColor="#00E676" />   {/* Neon Green */}
              <stop offset="52%" stopColor="#FFD600" />   {/* Solar Yellow */}
              <stop offset="68%" stopColor="#FF5722" />   {/* Warm Orange */}
              <stop offset="82%" stopColor="#FF1744" />   {/* Deep Red */}
              <stop offset="93%" stopColor="#A828FF" />   {/* Magenta */}
              <stop offset="100%" stopColor="#3875FF" />  {/* Electric Blue Edge */}
            </linearGradient>

            <linearGradient
              id={sheenId}
              x1="16"
              y1="6"
              x2="16"
              y2="26"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
            </linearGradient>
          </defs>
        )}

        {/* Геометрия power_input */}
        <g fill={getGlyphFill()}>
          {/* Верхняя непрерывная шина */}
          <rect x="2" y="7" width="28" height="5" rx="2.5" />

          {/* 3 импульсных сегмента */}
          <rect x="2" y="17" width="7" height="5" rx="2.5" />
          <rect x="12.5" y="17" width="7" height="5" rx="2.5" />
          <rect x="23" y="17" width="7" height="5" rx="2.5" />
        </g>

        {/* Объемный полупрозрачный слой (только для градиентной версии) */}
        {variant === 'gradient' && (
          <g fill={`url(#${sheenId})`} style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}>
            <rect x="2" y="7" width="28" height="5" rx="2.5" />
            <rect x="2" y="17" width="7" height="5" rx="2.5" />
            <rect x="12.5" y="17" width="7" height="5" rx="2.5" />
            <rect x="23" y="17" width="7" height="5" rx="2.5" />
          </g>
        )}
      </svg>

      {/* Google-Style Typography Lockup */}
      <div className="flex items-center gap-2 tracking-tight">
        <span className={`text-[19px] sm:text-[21px] font-medium leading-none ${
          variant === 'white' 
            ? 'text-white' 
            : 'text-[#1F1F1F] dark:text-[#E3E3E3]'
        }`}>
          Energeia
        </span>

        {showDescriptor && (
          <>
            <span
              className={`h-4 w-[1px] ${hideDescriptorOnMobile ? 'hidden sm:inline-block' : ''} ${
                variant === 'white'
                  ? 'bg-white/30'
                  : 'bg-[#DADCE0] dark:bg-[#444746]'
              }`}
              aria-hidden="true"
            />
            <span className={`text-[13px] sm:text-[14px] font-normal leading-none ${hideDescriptorOnMobile ? 'hidden sm:inline-block' : ''} ${descriptorClassName} ${
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
