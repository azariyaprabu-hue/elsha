import React from 'react';
import { ZiathlonEmblemLogo } from './ZiathlonEmblemLogo';

export interface ZiathlonLetterheadHeaderProps {
  pageNumber?: string; // e.g. "PAGE 1 OF 2" or "Rx Prescription"
  rxNumber?: string;   // e.g. "Rx ID: ZIA-RX-2026-01"
  date?: string;
  className?: string;
  showVentureBadge?: boolean;
}

export const ZiathlonLetterheadHeader: React.FC<ZiathlonLetterheadHeaderProps> = ({
  pageNumber,
  rxNumber,
  date,
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-white relative pb-3 flex flex-col select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-3 w-full">
        {/* LEFT: Official Clinic Logo & Title */}
        <div className="flex items-center gap-3">
          <ZiathlonEmblemLogo size={46} />
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black tracking-[0.16em] text-black uppercase font-sans leading-none">
              ZIATHLON
            </h1>
            <h2 className="text-[10px] sm:text-[11px] font-black tracking-[0.26em] text-[#7E22CE] uppercase font-sans mt-1">
              SPORTS MEDICINE CLINIC
            </h2>
          </div>
        </div>

        {/* RIGHT: Document Meta */}
        <div className="flex flex-col items-end gap-1">
          {(pageNumber || rxNumber || date) && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#0F172A] font-bold">
              {pageNumber && (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[#7E22CE] uppercase font-black">
                  {pageNumber}
                </span>
              )}
              {rxNumber && <span>{rxNumber}</span>}
              {date && <span className="text-gray-500">• {date}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Dual Purple & Black Accent Line */}
      <div className="w-full flex flex-col items-center mt-3">
        <div className="w-full h-[2px] bg-[#7E22CE]" />
        <div className="w-full h-[1px] bg-black mt-[1.5px]" />
      </div>
    </div>
  );
};
