import React from 'react';

interface ZiathlonEmblemLogoProps {
  className?: string;
  size?: number | string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  subtitleClassName?: string;
  inverted?: boolean;
}

/**
 * Official Ziathlon Sports Medicine Clinic Logo Emblem
 * - Exact shield geometry with 3 purple diagonal segments separated by dual white speed rays
 * - Top-right floating dark charcoal medical cross (+)
 */
export const ZiathlonEmblemLogo: React.FC<ZiathlonEmblemLogoProps> = ({
  className = '',
  size = 56,
  showWordmark = false,
  wordmarkClassName = 'text-2xl font-black tracking-[0.16em] text-gray-950 uppercase',
  subtitleClassName = 'text-[9px] font-bold tracking-[0.26em] text-[#7016B7] uppercase',
  inverted = false,
}) => {
  // Brand vibrant purple from official logo
  const purpleColor = '#7016B7';
  const crossColor = inverted ? '#FFFFFF' : '#191826';

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 130 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        className="overflow-visible select-none drop-shadow-sm"
      >
        <g id="ziathlon-official-emblem">
          {/* 1. Top Shield Segment (Horizontal top, slanted left, tapered diagonal base) */}
          <path
            d="M 18,34 L 81,34 L 20,53 Z"
            fill={purpleColor}
          />

          {/* 2. Middle Dynamic Diagonal Segment (Z-speed stripe) */}
          <path
            d="M 22,62 L 81,38 L 76,60 L 28,78 Z"
            fill={purpleColor}
          />

          {/* 3. Bottom Shield Apex Tip Segment */}
          <path
            d="M 34,85 L 69,73 L 49,103 Z"
            fill={purpleColor}
          />

          {/* 4. Top-Right Floating Medical Cross (+) with Rounded Ends */}
          <g transform="translate(84, 15)">
            {/* Horizontal Bar */}
            <rect
              x="0"
              y="6.2"
              width="19"
              height="6.6"
              rx="1.8"
              fill={crossColor}
            />
            {/* Vertical Bar */}
            <rect
              x="6.2"
              y="0"
              width="6.6"
              height="19"
              rx="1.8"
              fill={crossColor}
            />
          </g>
        </g>
      </svg>

      {/* Wordmark (Optional) */}
      {showWordmark && (
        <div className="mt-1.5 text-center select-none">
          <h1 className={wordmarkClassName}>ŽIATHLON</h1>
          <p className={subtitleClassName}>SPORTS MEDICINE CLINIC</p>
        </div>
      )}
    </div>
  );
};
