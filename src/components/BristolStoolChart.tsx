import React from 'react';
import { bristolStoolScaleData, BristolStoolType } from '../data/gutHealth40QuestionsData';
import { Check, Info } from 'lucide-react';

interface BristolStoolChartProps {
  selectedTypeNumber: number;
  onSelectType: (type: BristolStoolType) => void;
}

export const BristolStoolChart: React.FC<BristolStoolChartProps> = ({
  selectedTypeNumber,
  onSelectType,
}) => {
  return (
    <div className="bg-[#0b0f0d] border-2 border-[#C5A028] p-4 sm:p-6 rounded-none space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A028]/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C5A028] animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A028]">
              CLINICAL VISUAL DIAGNOSTIC
            </span>
          </div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">
            Bristol Stool Form Scale (Picture-Based Assessment)
          </h4>
          <p className="text-xs text-gray-400">
            Select the visual appearance that most closely represents your bowel movements.
          </p>
        </div>
        <div className="text-[11px] font-mono text-[#C5A028] bg-black/80 px-3 py-1.5 border border-[#C5A028]/50">
          Target Gold Standard: <span className="font-bold text-emerald-400">Type 4 (Smooth Snake)</span>
        </div>
      </div>

      {/* Grid of 7 Visual Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {bristolStoolScaleData.map((item) => {
          const isSelected = selectedTypeNumber === item.typeNumber;
          const isIdeal = item.typeNumber === 4 || item.typeNumber === 3;
          const isConstipated = item.typeNumber === 1 || item.typeNumber === 2;
          const isDiarrhea = item.typeNumber === 6 || item.typeNumber === 7;

          return (
            <button
              key={item.typeNumber}
              type="button"
              onClick={() => onSelectType(item)}
              className={`text-left p-3.5 border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#181814] border-[#C5A028] shadow-[0_0_20px_rgba(197,160,40,0.35)] ring-1 ring-[#C5A028]'
                  : 'bg-[#111] border-white/15 hover:border-[#C5A028]/60 hover:bg-[#141715]'
              }`}
            >
              {/* Type Badge & Header */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-black uppercase px-2 py-0.5 ${
                      isIdeal
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isConstipated
                        ? 'bg-amber-900/30 text-amber-300 border border-amber-500/40'
                        : isDiarrhea
                        ? 'bg-red-900/30 text-red-300 border border-red-500/40'
                        : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/40'
                    }`}
                  >
                    Type {item.typeNumber}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-gray-400">
                    {item.badge}
                  </span>
                </div>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#C5A028] text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Visual Diagram Representation (Custom SVG Drawing) */}
              <div className="my-2 p-2 bg-black/60 border border-white/10 flex items-center justify-center min-h-[70px]">
                {item.typeNumber === 1 && (
                  // Separate hard lumps (nuts)
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <circle cx="25" cy="25" r="9" fill="#6d3910" stroke="#a2571c" strokeWidth="2" />
                    <circle cx="55" cy="22" r="11" fill="#582d0c" stroke="#904c18" strokeWidth="2" />
                    <circle cx="85" cy="28" r="8" fill="#753d12" stroke="#b05f20" strokeWidth="2" />
                    <circle cx="115" cy="21" r="10" fill="#5e310d" stroke="#99511a" strokeWidth="2" />
                    <circle cx="140" cy="27" r="7" fill="#6d3910" stroke="#a2571c" strokeWidth="2" />
                  </svg>
                )}
                {item.typeNumber === 2 && (
                  // Sausage shaped lumpy
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <path
                      d="M 15 25 Q 35 15 55 25 Q 75 14 95 24 Q 115 15 135 25 Q 148 25 148 30 Q 148 38 135 37 Q 115 45 95 36 Q 75 46 55 35 Q 35 44 15 35 Z"
                      fill="#7a4214"
                      stroke="#9e561a"
                      strokeWidth="2"
                    />
                    <circle cx="35" cy="25" r="7" fill="#5c300d" opacity="0.6" />
                    <circle cx="75" cy="27" r="8" fill="#5c300d" opacity="0.6" />
                    <circle cx="115" cy="26" r="7" fill="#5c300d" opacity="0.6" />
                  </svg>
                )}
                {item.typeNumber === 3 && (
                  // Sausage with cracks
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <rect x="15" y="16" width="130" height="20" rx="10" fill="#8c531b" stroke="#ba752d" strokeWidth="2" />
                    <path d="M 40 18 L 45 28 L 42 34" stroke="#4a2a0c" strokeWidth="2" fill="none" />
                    <path d="M 75 17 L 80 26 L 76 34" stroke="#4a2a0c" strokeWidth="2" fill="none" />
                    <path d="M 110 18 L 114 27 L 111 34" stroke="#4a2a0c" strokeWidth="2" fill="none" />
                  </svg>
                )}
                {item.typeNumber === 4 && (
                  // Smooth supple snake (Gold standard)
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <path
                      d="M 15 25 C 40 12, 60 38, 90 25 C 115 14, 135 34, 145 25"
                      stroke="#C5A028"
                      strokeWidth="14"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 15 25 C 40 12, 60 38, 90 25 C 115 14, 135 34, 145 25"
                      stroke="#7d5813"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                {item.typeNumber === 5 && (
                  // Soft blobs with clear cut edges
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <path d="M 15 25 Q 25 15 35 25 Q 40 35 30 35 Q 20 35 15 25 Z" fill="#9e6628" stroke="#bd823f" strokeWidth="1.5" />
                    <path d="M 50 22 Q 65 14 75 24 Q 78 34 65 35 Q 52 34 50 22 Z" fill="#9e6628" stroke="#bd823f" strokeWidth="1.5" />
                    <path d="M 90 25 Q 105 16 115 26 Q 116 36 102 36 Q 90 35 90 25 Z" fill="#9e6628" stroke="#bd823f" strokeWidth="1.5" />
                    <path d="M 130 23 Q 140 16 148 24 Q 150 33 140 34 Q 130 33 130 23 Z" fill="#9e6628" stroke="#bd823f" strokeWidth="1.5" />
                  </svg>
                )}
                {item.typeNumber === 6 && (
                  // Fluffy pieces with ragged edges
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <path
                      d="M 15 28 Q 22 18 32 24 Q 40 16 48 26 Q 58 18 68 25 Q 60 36 48 34 Q 38 38 28 34 Q 18 36 15 28 Z"
                      fill="#ab6b29"
                      stroke="#cb8a45"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 85 27 Q 95 16 108 23 Q 118 17 128 25 Q 138 20 148 27 Q 142 36 130 35 Q 118 39 106 35 Q 92 37 85 27 Z"
                      fill="#ab6b29"
                      stroke="#cb8a45"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
                {item.typeNumber === 7 && (
                  // Watery, entirely liquid
                  <svg viewBox="0 0 160 50" className="w-full h-12">
                    <ellipse cx="80" cy="30" rx="65" ry="12" fill="#9c5f21" opacity="0.4" />
                    <ellipse cx="80" cy="30" rx="50" ry="8" fill="#b06f2a" opacity="0.6" />
                    <circle cx="45" cy="18" r="3" fill="#cf8d43" />
                    <circle cx="80" cy="14" r="4" fill="#cf8d43" />
                    <circle cx="115" cy="19" r="3" fill="#cf8d43" />
                  </svg>
                )}
              </div>

              {/* Title & Tamil Translation */}
              <div className="space-y-1">
                <div className="text-xs font-black text-white">{item.title}</div>
                <div className="text-[10px] text-[#C5A028] font-medium leading-tight line-clamp-2">
                  {item.tamilTitle}
                </div>
              </div>

              {/* Description & Clinical Meaning */}
              <p className="text-[11px] text-gray-300 mt-2 leading-relaxed font-sans">
                {item.description}
              </p>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                <span className="text-gray-400 font-mono">Transit:</span>
                <span className="font-bold text-white font-mono">{item.transitTime}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Type Diagnostic Rationale */}
      {selectedTypeNumber > 0 && (
        <div className="p-3.5 bg-black border border-[#C5A028]/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#C5A028]">
              Clinical Stool Transit Assessment: Type {selectedTypeNumber}
            </span>
            <p className="text-gray-200">
              {bristolStoolScaleData.find((b) => b.typeNumber === selectedTypeNumber)?.clinicalMeaning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
