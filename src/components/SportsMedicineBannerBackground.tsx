import React, { useEffect, useState } from 'react';
import { getFrontPageImage } from '../utils/frontPageImageStore';

// Athletes images matching the sports theme in Ultra-HD Quality (2560p+, 95% quality)
const ATHLETE_IMAGES = {
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2560&auto=format&fit=crop&q=95',
  runnerOrange: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=2560&auto=format&fit=crop&q=95',
  cricket: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=2560&auto=format&fit=crop&q=95',
  swimmer: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=2560&auto=format&fit=crop&q=95',
  tennis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=2560&auto=format&fit=crop&q=95',
  boxer: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=2560&auto=format&fit=crop&q=95',
  martialArts: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=2560&auto=format&fit=crop&q=95',
  cyclist: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=2560&auto=format&fit=crop&q=95',
};

interface SportsMedicineBannerBackgroundProps {
  className?: string;
  subtleOpacity?: boolean;
}

export const SportsMedicineBannerBackground: React.FC<SportsMedicineBannerBackgroundProps> = ({
  className = '',
  subtleOpacity = false,
}) => {
  const [customBg, setCustomBg] = useState<string | null>(null);

  useEffect(() => {
    const updateBg = () => {
      getFrontPageImage().then((img) => {
        setCustomBg(img);
      });
    };
    updateBg();
    window.addEventListener('ziathlon-front-bg-changed', updateBg);
    window.addEventListener('storage', updateBg);
    return () => {
      window.removeEventListener('ziathlon-front-bg-changed', updateBg);
      window.removeEventListener('storage', updateBg);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF5FF] select-none ${className}`}
      aria-hidden="true"
    >
      {customBg ? (
        // Custom user-uploaded picture set as fixed background with HD crisp filter
        <div className={`w-full h-full ${subtleOpacity ? 'opacity-35' : 'opacity-95'} transition-opacity duration-300`}>
          <img
            src={customBg}
            alt=""
            style={{ imageRendering: '-webkit-optimize-contrast' }}
            className="w-full h-full object-cover object-top contrast-[1.06] saturate-[1.08]"
          />
        </div>
      ) : (
        // High-Definition Light Purple blended with Dark Purple Accents & Corner Sports Athletes
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-[#F5EDFD] to-[#EDE9FE] ${subtleOpacity ? 'opacity-40' : 'opacity-100'}`}>
          {/* Top-Left Flowing Curved Light & Dark Purple Swoosh Waves */}
          <div className="absolute -top-4 -left-4 w-[36rem] h-64 pointer-events-none opacity-85 z-10">
            <svg viewBox="0 0 600 300" className="w-full h-full fill-none">
              <defs>
                <linearGradient id="bgWaveLavenderLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#A855F7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="bgWaveLavenderDeep" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <path
                d="M -20,-20 C 120,60 220,110 380,45 C 460,10 520,-5 580,-10 L 580,-40 L -20,-40 Z"
                fill="url(#bgWaveLavenderDeep)"
              />
              <path
                d="M -20,20 C 140,120 280,130 440,55 C 500,25 550,5 600,-5 L -20,-20 Z"
                fill="url(#bgWaveLavenderLight)"
              />
            </svg>
          </div>

          {/* Bottom Flowing Curved Light & Dark Purple Swoosh Waves */}
          <div className="absolute -bottom-2 left-0 right-0 h-48 pointer-events-none opacity-90 z-10">
            <svg viewBox="0 0 1440 220" className="w-full h-full fill-none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bgWaveBottomPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.7" />
                  <stop offset="35%" stopColor="#8B5CF6" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#A855F7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#2E1065" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <path
                d="M 0,140 C 340,70 600,180 940,90 C 1180,20 1320,120 1460,70 L 1460,240 L 0,240 Z"
                fill="url(#bgWaveBottomPurple)"
              />
            </svg>
          </div>

          {/* Left Side Corner Athletes */}
          <div className="absolute left-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden z-0">
            {/* Top-Left: Basketball Player Corner Watermark */}
            <div
              className="absolute top-4 left-6 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 rounded-full overflow-hidden opacity-95 drop-shadow-[0_12px_24px_rgba(139,92,246,0.25)]"
              style={{
                maskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
              }}
            >
              <img
                src={ATHLETE_IMAGES.basketball}
                alt=""
                className="w-full h-full object-cover object-top contrast-110 saturate-110 brightness-105"
              />
            </div>

            {/* Mid-Left: Runner */}
            <div
              className="absolute top-32 left-28 sm:left-40 md:left-48 w-48 sm:w-60 md:w-68 h-48 sm:h-60 md:h-68 rounded-full overflow-hidden opacity-95 drop-shadow-[0_12px_24px_rgba(124,58,237,0.25)]"
              style={{
                maskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
              }}
            >
              <img
                src={ATHLETE_IMAGES.runnerOrange}
                alt=""
                className="w-full h-full object-cover object-center contrast-110 saturate-110 brightness-105"
              />
            </div>

            {/* Bottom-Left: Swimmer with Corner Splash */}
            <div
              className="absolute -bottom-2 left-0 w-72 sm:w-96 md:w-[32rem] h-56 sm:h-72 md:h-84 overflow-hidden opacity-95 drop-shadow-[0_14px_32px_rgba(139,92,246,0.3)]"
              style={{
                maskImage: 'linear-gradient(to top right, black 68%, transparent 92%)',
                WebkitMaskImage: 'linear-gradient(to top right, black 68%, transparent 92%)',
              }}
            >
              <img
                src={ATHLETE_IMAGES.swimmer}
                alt=""
                className="w-full h-full object-cover object-center contrast-110 saturate-115 brightness-105"
              />
            </div>
          </div>

          {/* Right Side Corner Athletes */}
          <div className="absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden z-0">
            {/* Top-Right: Tennis Player Corner Watermark */}
            <div
              className="absolute top-4 right-6 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 rounded-full overflow-hidden opacity-95 drop-shadow-[0_12px_24px_rgba(139,92,246,0.25)]"
              style={{
                maskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
              }}
            >
              <img
                src={ATHLETE_IMAGES.tennis}
                alt=""
                className="w-full h-full object-cover object-top contrast-110 saturate-115 brightness-105"
              />
            </div>

            {/* Mid-Right: Boxer */}
            <div
              className="absolute top-32 right-28 sm:right-40 md:right-48 w-48 sm:w-60 md:w-68 h-48 sm:h-60 md:h-68 rounded-full overflow-hidden opacity-95 drop-shadow-[0_12px_24px_rgba(124,58,237,0.25)]"
              style={{
                maskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 85%)',
              }}
            >
              <img
                src={ATHLETE_IMAGES.boxer}
                alt=""
                className="w-full h-full object-cover object-center contrast-110 saturate-110 brightness-105"
              />
            </div>

            {/* Bottom-Right: Cyclist Corner Sprint */}
            <div
              className="absolute -bottom-2 right-10 sm:right-20 md:right-28 w-64 sm:w-88 md:w-[30rem] h-56 sm:h-72 md:h-84 overflow-hidden opacity-95 drop-shadow-[0_14px_32px_rgba(139,92,246,0.3)]"
              style={{
                maskImage: 'linear-gradient(to top left, black 68%, transparent 92%)',
                WebkitMaskImage: 'linear-gradient(to top left, black 68%, transparent 92%)',
              }}
            >
              <img
                src={ATHLETE_IMAGES.cyclist}
                alt=""
                className="w-full h-full object-cover object-center contrast-110 saturate-115 brightness-105"
              />
            </div>
          </div>

          {/* Central Bright Clean Vignette to guarantee absolute crisp readability for all clinical forms */}
          <div className="absolute inset-0 bg-radial-[circle_at_center] from-white/95 via-white/80 to-transparent pointer-events-none z-0" />
        </div>
      )}
    </div>
  );
};

