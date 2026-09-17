import React from 'react';

export interface ElshaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const ElshaLogo: React.FC<ElshaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const sizeConfig = {
    sm: {
      icon: 'w-6 h-6',
      title: 'text-base font-black tracking-wider',
      sub: 'text-[9px] tracking-tight font-medium',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-8 h-8',
      title: 'text-xl font-black tracking-widest',
      sub: 'text-[10px] tracking-normal font-medium',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-10 h-10',
      title: 'text-2xl font-black tracking-widest',
      sub: 'text-xs tracking-normal font-medium',
      gap: 'gap-3',
    },
  };

  const current = sizeConfig[size];

  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      {/* Cyan / Royal Blue Lotus Emblem matching ELSHADA.jpeg */}
      <div className={`relative flex items-center justify-center ${current.icon} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central Petal */}
          <path
            d="M50 8 C42 35 44 65 50 82 C56 65 58 35 50 8 Z"
            fill="url(#elshaGradCenter)"
          />
          {/* Left Inner Petal */}
          <path
            d="M48 24 C32 38 28 62 46 80 C40 64 42 42 48 24 Z"
            fill="url(#elshaGradLeftInner)"
          />
          {/* Right Inner Petal */}
          <path
            d="M52 24 C68 38 72 62 54 80 C60 64 58 42 52 24 Z"
            fill="url(#elshaGradRightInner)"
          />
          {/* Left Outer Petal */}
          <path
            d="M44 42 C20 50 14 74 38 82 C28 72 32 54 44 42 Z"
            fill="url(#elshaGradLeftOuter)"
          />
          {/* Right Outer Petal */}
          <path
            d="M56 42 C80 50 86 74 62 82 C72 72 68 54 56 42 Z"
            fill="url(#elshaGradRightOuter)"
          />
          {/* Base Calyx Foundation */}
          <path
            d="M34 82 C44 87 56 87 66 82 C60 88 40 88 34 82 Z"
            fill="#38BDF8"
          />

          <defs>
            <linearGradient id="elshaGradCenter" x1="50" y1="8" x2="50" y2="82" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="elshaGradLeftInner" x1="28" y1="24" x2="48" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="elshaGradRightInner" x1="72" y1="24" x2="52" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="elshaGradLeftOuter" x1="14" y1="42" x2="44" y2="82" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <linearGradient id="elshaGradRightOuter" x1="86" y1="42" x2="56" y2="82" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className={`text-white uppercase leading-none font-sans ${current.title}`}>
          ELSHA
        </span>
        {showSubtitle && (
          <span className={`text-sky-300 font-sans leading-tight mt-0.5 ${current.sub}`}>
            Your Nutrition, Our Priority
          </span>
        )}
      </div>
    </div>
  );
};
