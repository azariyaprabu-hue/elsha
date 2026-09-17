import React from 'react';

export interface ZiathlonLogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'original' | 'auto';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ZiathlonLogo: React.FC<ZiathlonLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'dark',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  // Brand color constants
  const PURPLE_MAIN = '#781CA8';
  const PURPLE_DARK = '#601188';
  const PURPLE_LIGHT = '#9228C9';

  // Size specifications
  const sizeConfig = {
    xs: {
      iconBox: 'w-6 h-6',
      iconWidth: 26,
      iconHeight: 26,
      titleText: 'text-xs',
      subText: 'text-[7px]',
      gap: 'gap-1.5',
    },
    sm: {
      iconBox: 'w-9 h-9',
      iconWidth: 38,
      iconHeight: 38,
      titleText: 'text-base sm:text-lg',
      subText: 'text-[8px] sm:text-[9px]',
      gap: 'gap-2.5',
    },
    md: {
      iconBox: 'w-12 h-12',
      iconWidth: 50,
      iconHeight: 50,
      titleText: 'text-xl sm:text-2xl',
      subText: 'text-[9px] sm:text-[10px]',
      gap: 'gap-3',
    },
    lg: {
      iconBox: 'w-16 h-16',
      iconWidth: 68,
      iconHeight: 68,
      titleText: 'text-2xl sm:text-3xl',
      subText: 'text-[11px] sm:text-xs',
      gap: 'gap-3.5',
    },
    xl: {
      iconBox: 'w-24 h-24',
      iconWidth: 96,
      iconHeight: 96,
      titleText: 'text-3xl sm:text-4xl',
      subText: 'text-xs sm:text-sm',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeConfig[size];

  // Theme text styling
  const isLight = theme === 'light' || theme === 'original';
  const textColor = isLight ? 'text-black' : 'text-white';
  const crossFill = isLight ? '#000000' : '#ffffff';

  // SVG Shield Emblem
  const ShieldEmblem = (
    <svg
      className={`${currentSize.iconBox} shrink-0 select-none overflow-visible`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PURPLE_LIGHT} />
          <stop offset="50%" stopColor={PURPLE_MAIN} />
          <stop offset="100%" stopColor={PURPLE_DARK} />
        </linearGradient>

        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={PURPLE_MAIN} floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#subtleGlow)">
        {/* Top Shield Segment */}
        <path
          d="M 12,23 
             L 76,23 
             L 74,30 
             L 13,50 
             C 12.5,41 12.2,32 12,23 Z"
          fill="url(#shieldGrad)"
        />

        {/* Middle Shield Segment (Dynamic Athletic Z-Slash) */}
        <path
          d="M 14.5,58 
             L 72,36 
             L 67,61 
             L 18.5,82 
             C 17,74 15.5,66 14.5,58 Z"
          fill="url(#shieldGrad)"
        />

        {/* Bottom Shield Segment (Pointed Tip) */}
        <path
          d="M 21,89 
             L 63,68 
             C 57,87 48,100 42,106 
             C 36,99 26,92 21,89 Z"
          fill="url(#shieldGrad)"
        />
      </g>
    </svg>
  );

  // Wordmark typography
  const Wordmark = (
    <div className="flex flex-col justify-center select-none">
      {/* Primary Brand Name: ŽIΛTHLON */}
      <div className="flex items-baseline leading-none tracking-[0.14em]">
        {/* Ž with distinctive Purple Caron/Chevron accent */}
        <span className={`relative font-serif font-black ${textColor} ${currentSize.titleText}`}>
          <span
            className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 text-[0.6em] leading-none"
            style={{ color: PURPLE_MAIN }}
            aria-hidden="true"
          >
            ˇ
          </span>
          Z
        </span>

        {/* I */}
        <span className={`font-serif font-black ${textColor} ${currentSize.titleText}`}>
          I
        </span>

        {/* Stylized Lambda (Λ) uncrossed A */}
        <span
          className={`font-serif font-black ${textColor} ${currentSize.titleText} inline-block -mx-[0.03em]`}
          style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          Λ
        </span>

        {/* THLON */}
        <span className={`font-serif font-black ${textColor} ${currentSize.titleText}`}>
          THLON
        </span>
      </div>

      {/* Subtitle: SPORTS MEDICINE CLINIC */}
      {showSubtitle && (
        <span
          className={`font-sans font-bold tracking-[0.32em] uppercase mt-1 leading-tight ${currentSize.subText}`}
          style={{ color: isLight ? PURPLE_MAIN : '#B357EA' }}
        >
          SPORTS MEDICINE CLINIC
        </span>
      )}
    </div>
  );

  // Badge layout (original white card style as uploaded by user)
  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 ${
          onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
        } ${className}`}
      >
        <div className="mb-2">{ShieldEmblem}</div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-baseline leading-none tracking-[0.16em]">
            <span className="relative font-serif font-black text-black text-xl">
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[0.65em] font-bold"
                style={{ color: PURPLE_MAIN }}
              >
                ˇ
              </span>
              Z
            </span>
            <span className="font-serif font-black text-black text-xl">I</span>
            <span className="font-serif font-black text-black text-xl inline-block -mx-[0.03em]">
              Λ
            </span>
            <span className="font-serif font-black text-black text-xl">THLON</span>
          </div>
          {showSubtitle && (
            <span
              className="font-sans font-bold tracking-[0.32em] text-[8px] uppercase mt-1"
              style={{ color: PURPLE_MAIN }}
            >
              SPORTS MEDICINE CLINIC
            </span>
          )}
        </div>
      </div>
    );
  }

  // Vertical stacked variant
  if (variant === 'vertical') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center ${currentSize.gap} ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        {ShieldEmblem}
        {Wordmark}
      </div>
    );
  }

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="ŽIATHLON SPORTS MEDICINE CLINIC"
      >
        {ShieldEmblem}
      </div>
    );
  }

  // Horizontal variant (default for headers, bars, modals)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {ShieldEmblem}
      {Wordmark}
    </div>
  );
};
