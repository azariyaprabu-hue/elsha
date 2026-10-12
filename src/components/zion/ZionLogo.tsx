import React from 'react';

interface ZionLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'gradient';
}

export const ZionLogo: React.FC<ZionLogoProps> = ({
  size = 36,
  className = '',
  showText = true,
  variant = 'gradient',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* High-fidelity Vector ZION Emblem */}
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="zionGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <linearGradient id="zionGradAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <filter id="zionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7C3AED" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Background Rounded Shield */}
          <rect width="100" height="100" rx="22" fill="#0B0826" />

          {/* Subtle Outer Neon Rim */}
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="20"
            stroke="url(#zionGradPrimary)"
            strokeWidth="3"
            strokeOpacity="0.8"
          />

          {/* Futuristic "Z" Neural Waveform Geometry */}
          <g filter="url(#zionGlow)">
            {/* Top Bar of Z */}
            <path
              d="M 24 28 L 76 28 C 78.5 28 80 30.5 78.8 32.8 L 62 50 L 52 50 L 68 36 L 24 36 C 22 36 21 34 22 32 L 24 28 Z"
              fill="url(#zionGradAccent)"
            />

            {/* Dynamic Center Slash */}
            <path
              d="M 76 32 L 32 72 L 22 72 L 66 32 Z"
              fill="url(#zionGradPrimary)"
            />

            {/* Bottom Bar of Z */}
            <path
              d="M 24 72 L 76 72 C 78 72 79 70 78 68 L 76 64 L 32 64 L 48 50 L 38 50 L 21.2 67.2 C 20 69.5 21.5 72 24 72 Z"
              fill="url(#zionGradAccent)"
            />

            {/* AI Communication Pulse Node */}
            <circle cx="72" cy="52" r="5.5" fill="#FFFFFF" />
            <circle cx="72" cy="52" r="3" fill="#7C3AED" />
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-[0.16em] uppercase text-xl font-sans ${
                variant === 'light'
                  ? 'text-white'
                  : 'text-[#0B0826] dark:text-white'
              }`}
            >
              ZION
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-100 text-[#7C3AED] dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              AI
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.22em] text-purple-600 dark:text-purple-400 uppercase mt-0.5">
            Communication Suite
          </span>
        </div>
      )}
    </div>
  );
};
