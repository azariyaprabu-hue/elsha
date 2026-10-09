import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Maximize2,
  Minimize2,
  Check,
  Upload,
  Sparkles,
} from 'lucide-react';
import { ZiathlonEmblemLogo } from './ZiathlonEmblemLogo';
import {
  saveFrontPageImage,
  getFrontPageImage,
  clearFrontPageImage,
} from '../utils/frontPageImageStore';

interface FrontPageZiathlonProps {
  onEnterWorkspace: () => void;
  onSelectFolder?: (folderId: string) => void;
  themeMode?: string;
}

// Sports athletes photos with dynamic action poses matching the official clinic artwork in Ultra-HD Quality (2560p+, 100% quality, 2x Retina DPR)
const ATHLETE_IMAGES = {
  // Left Side Cluster - Ultra-HD Sharp Action Photography
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2560&auto=format&fit=crop&q=100&dpr=2',
  runnerOrange: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=2560&auto=format&fit=crop&q=100&dpr=2',
  cricket: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=2560&auto=format&fit=crop&q=100&dpr=2',
  swimmer: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=2560&auto=format&fit=crop&q=100&dpr=2',
  // Right Side Cluster - Ultra-HD Sharp Action Photography
  tennis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=2560&auto=format&fit=crop&q=100&dpr=2',
  boxer: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=2560&auto=format&fit=crop&q=100&dpr=2',
  martialArts: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=2560&auto=format&fit=crop&q=100&dpr=2',
  cyclist: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=2560&auto=format&fit=crop&q=100&dpr=2',
};

export const FrontPageZiathlon: React.FC<FrontPageZiathlonProps> = ({
  onEnterWorkspace,
}) => {
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted picture from IndexedDB / localStorage on mount
  useEffect(() => {
    getFrontPageImage().then((img) => {
      if (img) setCustomBg(img);
    });
  }, []);

  // Monitor fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Clipboard Paste support (Press Ctrl+V anywhere on Front Page to paste the picture directly)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFileUpload(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCustomBg(result);
        await saveFrontPageImage(result);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full h-screen min-h-screen overflow-hidden bg-white text-gray-900 select-none flex flex-col justify-between transition-colors [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] subpixel-antialiased ${
        isDragging ? 'ring-4 ring-purple-500 ring-inset' : ''
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LAYER: LIGHT PURPLE HARMONIZED WITH DARK PURPLE              */}
      {/* ========================================================================= */}
      {customBg ? (
        // When user has uploaded their exact JPEG: True 100% full-bleed edge-to-edge
        <div className="absolute inset-0 z-0 bg-[#FAF5FF] flex items-center justify-center">
          <img
            src={customBg}
            alt="Ziathlon Sports Medicine Clinic Front Page"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        // High-Fidelity HD Light Purple with Crisp Dark Purple Accents & High-Definition Action Athletes
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-[#F5EDFD] to-[#EDE9FE]">
          {/* Top-Left Crisp Flowing Curved Waves */}
          <div className="absolute -top-4 -left-4 w-[28rem] sm:w-[36rem] md:w-[44rem] h-56 sm:h-72 pointer-events-none opacity-90 z-10">
            <svg viewBox="0 0 600 300" className="w-full h-full fill-none" shapeRendering="geometricPrecision">
              <defs>
                <linearGradient id="waveLavenderLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="waveLavenderDeep" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path
                d="M -20,-20 C 120,60 220,110 380,45 C 460,10 520,-5 580,-10 L 580,-40 L -20,-40 Z"
                fill="url(#waveLavenderDeep)"
              />
              <path
                d="M -20,20 C 140,120 280,130 440,55 C 500,25 550,5 600,-5 L -20,-20 Z"
                fill="url(#waveLavenderLight)"
              />
            </svg>
          </div>

          {/* Bottom Crisp Flowing Curved Waves */}
          <div className="absolute -bottom-2 left-0 right-0 h-44 sm:h-56 pointer-events-none opacity-95 z-10">
            <svg viewBox="0 0 1440 220" className="w-full h-full fill-none" preserveAspectRatio="none" shapeRendering="geometricPrecision">
              <defs>
                <linearGradient id="waveBottomPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#8B5CF6" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#A855F7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2E1065" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path
                d="M 0,140 C 340,70 600,180 940,90 C 1180,20 1320,120 1460,70 L 1460,240 L 0,240 Z"
                fill="url(#waveBottomPurple)"
              />
            </svg>
          </div>

          {/* ================= LEFT SIDE ATHLETES CLUSTER (ULTRA-HD CRISP QUALITY, SUBTLE BACKGROUND) ================= */}
          <div className="absolute left-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden z-0 opacity-80 sm:opacity-85 transition-opacity duration-300">
            {/* 1. Top-Left: Basketball Player */}
            <div className="absolute top-6 left-6 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-[0_16px_36px_rgba(126,34,206,0.25)] border-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.basketball}
                alt="Basketball Athlete"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top scale-105 contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>

            {/* 2. Mid-Left: Female Athlete / Runner */}
            <div className="absolute top-40 left-28 sm:left-40 md:left-48 w-48 sm:w-60 md:w-68 h-48 sm:h-60 md:h-68 rounded-3xl overflow-hidden shadow-[0_16px_36px_rgba(107,33,168,0.25)] border-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.runnerOrange}
                alt="Track Runner"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center scale-105 contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>

            {/* 3. Center-Left: Cricket Batsman */}
            <div className="absolute bottom-28 left-16 sm:left-32 md:left-40 w-60 sm:w-76 md:w-88 h-60 sm:h-76 md:h-88 rounded-3xl overflow-hidden shadow-[0_18px_40px_rgba(88,28,135,0.25)] border-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.cricket}
                alt="Cricket Athlete"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center scale-105 contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>

            {/* 4. Bottom-Left: Swimmer */}
            <div className="absolute -bottom-2 left-0 w-72 sm:w-96 md:w-[30rem] h-52 sm:h-68 md:h-76 rounded-tr-3xl overflow-hidden shadow-[0_18px_40px_rgba(126,34,206,0.25)] border-t-2 border-r-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.swimmer}
                alt="Swimmer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>
          </div>

          {/* ================= RIGHT SIDE ATHLETES CLUSTER (ULTRA-HD CRISP QUALITY, SUBTLE BACKGROUND) ================= */}
          <div className="absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden z-0 opacity-80 sm:opacity-85 transition-opacity duration-300">
            {/* 1. Top-Right: Tennis Player */}
            <div className="absolute top-6 right-6 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-[0_16px_36px_rgba(126,34,206,0.25)] border-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.tennis}
                alt="Tennis Champion"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top scale-105 contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>

            {/* 2. Mid-Right: Boxer */}
            <div className="absolute top-40 right-28 sm:right-40 md:right-48 w-48 sm:w-60 md:w-68 h-48 sm:h-60 md:h-68 rounded-3xl overflow-hidden shadow-[0_16px_36px_rgba(107,33,168,0.25)] border-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.boxer}
                alt="Boxer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center scale-105 contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>

            {/* 3. Lower-Mid-Right: Martial Artist */}
            <div className="absolute bottom-28 right-8 sm:right-16 md:right-24 w-52 sm:w-72 md:w-80 h-52 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-[0_18px_40px_rgba(88,28,135,0.25)] border-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.martialArts}
                alt="Martial Arts"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center scale-105 contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>

            {/* 4. Bottom-Right: Cyclist */}
            <div className="absolute -bottom-2 right-6 sm:right-16 md:right-24 w-64 sm:w-84 md:w-[28rem] h-52 sm:h-68 md:h-76 rounded-tl-3xl overflow-hidden shadow-[0_18px_40px_rgba(126,34,206,0.25)] border-t-2 border-l-2 border-white/90 ring-1 ring-purple-200/50 [transform:translateZ(0)] [backface-visibility:hidden]">
              <img
                src={ATHLETE_IMAGES.cyclist}
                alt="Cyclist Sprint"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center contrast-110 saturate-110 brightness-105"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#8B5CF6] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in border border-violet-300">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>HD Background Updated</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOP FLOATING NAVIGATION HEADER                                        */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full px-4 sm:px-8 pt-4 flex items-center justify-between">
        {/* Left: @ Action to Change Background */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-violet-700 border border-violet-200 flex items-center justify-center shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 font-bold text-lg"
            title="Change Background"
          >
            @
          </button>
        </div>

        {/* Right: Quick Action Controls (Clean Icons Only) */}
        <div className="flex items-center gap-2.5">
          {/* Full Screen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-violet-800 border border-violet-200 flex items-center justify-center shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* 7 Folders Button */}
          <button
            type="button"
            onClick={onEnterWorkspace}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white text-xl flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.4)] cursor-pointer transition-all hover:scale-105 active:scale-95 border-2 border-violet-100"
            title="Folders"
          >
            <span>📁</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input for uploading local picture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* ========================================================================= */}
      {/* 3. CENTER STAGE BRANDING: ULTRA-HD LOGO & CRISP CLINICAL TYPOGRAPHY        */}
      {/* ========================================================================= */}
      {!customBg && (
        <div className="relative z-20 flex flex-col items-center justify-center my-auto max-w-2xl mx-auto px-4 py-3 text-center animate-in fade-in zoom-in-95 duration-300">
          {/* PURPLE ANGULAR WINGED SHIELD WITH BLACK CROSS (OFFICIAL USER LOGO) */}
          <div className="mb-3 transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_16px_36px_rgba(126,34,206,0.4)]">
            <ZiathlonEmblemLogo size={145} />
          </div>

          {/* High-Definition Crisp Clinic Typography */}
          <div className="space-y-1.5 backdrop-blur-md bg-white/90 px-6 py-4 rounded-3xl border-2 border-purple-300/90 shadow-[0_16px_40px_rgba(126,34,206,0.18)] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] subpixel-antialiased">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase font-sans text-gray-950">
              <span className="bg-gradient-to-r from-[#4C1D95] via-[#7E22CE] to-[#4C1D95] bg-clip-text text-transparent">
                ŽIATHLON
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#7E22CE]">
              Sports Medicine & Clinical Nutrition
            </p>
            <p className="text-[11px] sm:text-xs text-gray-800 font-bold max-w-md mx-auto">
              Metabolic Reversal • Athletic Performance Conditioning • ICMR 2024
            </p>

            {/* Crisp HD Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-purple-100/90 border border-purple-300 text-purple-950 text-[10px] font-mono font-black shadow-xs">
                ✓ 7 Clinical Folders
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-[10px] font-mono font-black shadow-xs">
                ✓ Ultra-HD 4K Display
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100/90 border border-blue-300 text-blue-950 text-[10px] font-mono font-black shadow-xs">
                ✓ E2EE Protected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Center Spacer when custom picture is active */}
      {customBg && <div className="my-auto" />}

      {/* ========================================================================= */}
      {/* 4. BOTTOM FLOATING ACTION ENTER BUTTON (📁)                               */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full px-6 sm:px-10 pb-6 sm:pb-8 flex items-center justify-end">
        <div>
          <button
            type="button"
            id="btn-enter-workspace"
            onClick={onEnterWorkspace}
            className="group px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#7E22CE] via-[#8B5CF6] to-[#A855F7] hover:from-[#6b1dae] hover:to-[#7E22CE] text-white text-sm sm:text-base font-black uppercase tracking-widest flex items-center gap-3 cursor-pointer shadow-[0_12px_36px_rgba(126,34,206,0.45)] border-2 border-white/80 hover:scale-105 active:scale-95 transition-all ring-2 ring-purple-300/40"
            title="Enter Workspace"
          >
            <span className="font-black tracking-widest">ENTER CLINICAL WORKSPACE</span>
            <ArrowRight className="w-5 h-5 text-purple-100 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
