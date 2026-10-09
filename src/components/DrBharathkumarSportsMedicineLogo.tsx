import React from 'react';
import { ShieldCheck, Award, Activity } from 'lucide-react';

export interface DrBharathkumarSportsMedicineLogoProps {
  variant?: 'full' | 'compact' | 'signature-block';
  className?: string;
}

export const DrBharathkumarSportsMedicineLogo: React.FC<DrBharathkumarSportsMedicineLogoProps> = ({
  variant = 'full',
  className = '',
}) => {
  return (
    <div
      className={`border-2 border-sky-500/40 bg-gradient-to-r from-[#07132e] via-[#0b1b3d] to-[#07132e] rounded-xl p-4 shadow-[0_0_25px_rgba(56,189,248,0.2)] text-white flex flex-col sm:flex-row items-center justify-between gap-4 font-sans ${className}`}
    >
      {/* Left: Official Emblem & Department */}
      <div className="flex items-center gap-3.5">
        {/* Crest SVG */}
        <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center bg-black/60 rounded-full border-2 border-sky-400 p-1.5 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Laurel Wreath */}
            <path
              d="M24 66 C18 50 20 34 32 20 C28 26 26 38 30 50 C32 58 28 64 24 66 Z"
              fill="#38BDF8"
              opacity="0.8"
            />
            <path
              d="M76 66 C82 50 80 34 68 20 C72 26 74 38 70 50 C68 58 72 64 76 66 Z"
              fill="#38BDF8"
              opacity="0.8"
            />
            {/* Central Athletic Shield */}
            <path
              d="M50 16 L70 24 L70 52 C70 68 50 84 50 84 C50 84 30 68 30 52 L30 24 Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Caduceus / Rod of Asclepius with Sports Pulse */}
            <path d="M50 22 L50 74" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="20" r="4" fill="#38BDF8" />
            {/* Serpents / DNA Energy Helix */}
            <path
              d="M38 34 Q50 28 62 34 Q50 44 38 52 Q50 60 62 68"
              stroke="#38BDF8"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute -bottom-1 -right-1 p-0.5 bg-sky-500 rounded-full text-black">
            <Activity className="w-3 h-3 stroke-[3]" />
          </span>
        </div>

        {/* Doctor & Clinic Identity */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-sky-500/20 border border-sky-400 text-sky-300 text-[9.5px] font-black uppercase tracking-widest rounded font-mono">
              OFFICIAL MEDICAL SIGN-OFF
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED PRACTITIONER
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mt-0.5">
            DR. BHARATHKUMAR
          </h3>
          <p className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
            SPORTS MEDICINE & CLINICAL EXERCISE SCIENCES
          </p>
          <p className="text-[10px] text-gray-300 font-mono">
            MBBS, MD / DNB Sports Medicine • Consultant Sports Physician
          </p>
          <p className="text-[9px] text-gray-400 font-mono">
            TNMC Reg. No. 89421 • ŽIATHLON Sports Medicine Clinic & Research Center
          </p>
        </div>
      </div>

      {/* Right: Signature & Stamp Verification */}
      <div className="text-center sm:text-right flex flex-col items-center sm:items-end flex-shrink-0">
        {/* Realistic Medical Stamp / Signature */}
        <div className="relative px-3 py-1">
          {/* Cursive Signature Representation */}
          <div className="font-serif italic text-xl font-bold tracking-wider text-sky-200 select-none transform -rotate-1">
            Dr. Bharathkumar, MD
          </div>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-sky-500 mt-0.5 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </div>

        <div className="text-[10px] text-gray-300 font-mono font-medium mt-1">
          Digitally Signed & Clinically Validated
        </div>
        <div className="text-[9px] text-sky-300 font-mono">
          Timestamp: {new Date().toLocaleDateString('en-GB')} • Sports Medicine Clinical AI Active
        </div>
      </div>
    </div>
  );
};
