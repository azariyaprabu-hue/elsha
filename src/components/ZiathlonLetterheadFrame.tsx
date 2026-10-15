import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, FileText, Check } from 'lucide-react';
import { OrnateBorderSvg } from './OrnateBorderSvg';

export interface ZiathlonLetterheadFrameProps {
  children: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
  hideHeader?: boolean;
  doctorName?: string;
  doctorQualifications?: string;
  doctorRole?: string;
  doctorRegNo?: string;
  doctorPhone?: string;
  doctorEmail?: string;
  doctorWebsite?: string;
  clinicAddressLine1?: string;
  clinicAddressLine2?: string;
  clinicAddressLine3?: string;
  // Canvas scale props
  scale?: number;
  autoScale?: boolean;
  showZoomControls?: boolean;
  canvasId?: string;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  pageNumber?: number;
  totalPages?: number;
  documentTitle?: string;
  layoutStyle?: 'ornate-frame' | 'classic';
}

/**
 * OFFICIAL ZIATHLON SPORTS MEDICINE CLINIC LETTERHEAD MASTER TEMPLATE
 *
 * EXACT 1:1 REPLICATION OF OFFICIAL CLINIC LETTERHEAD SPECIFICATION:
 * 1. Clean White A4 Portrait Canvas (800px × 1131px):
 *    - Zero surrounding border frames (no outer border, no inner hairline, no corner triangles).
 *    - Pure, pristine white medical letterhead paper.
 *
 * 2. Top-Left Logo Lockup:
 *    - Official Ziathlon winged purple ribbon logo with black cross (+).
 *    - Wordmark: ŽIATHLON in bold dark navy.
 *    - Subtitle: SPORTS MEDICINE CLINIC in tracked uppercase.
 *
 * 3. Top-Right Geometric Graphic:
 *    - Layered diagonal royal purple (#7016B7) & dark navy (#0B0826) angled chevrons/stripes.
 *    - Clean white negative space grooves.
 *    - Horizontal purple baseline rule extending to the right edge.
 *    - Zero tagline text (pure clean corporate geometry).
 *
 * 4. Content Area:
 *    - Positioned safely inside margins (top: 112px, bottom: 125px, left: 36px, right: 36px).
 *    - Preserves all medical details, vitals, symptoms, diagnoses, and prescription table.
 *
 * 5. Bottom-Left Graphic & Clinic Address:
 *    - Dark navy angled block with clean white address typography (#55, 4th Cross, Panduranga Nagar...).
 *    - Vibrant royal purple angled parallelogram and geometric wedge accents.
 *
 * 6. Bottom-Right Doctor Credentials & Contact:
 *    - Dr. Bharath Kumar B, MBBS, PGDSM (Sports Medicine), Medical Director | Ziathlon, KMC#81009.
 *    - Contact information with distinctive vertical purple accent bar on the right.
 */
export const ZiathlonLetterheadFrame: React.FC<ZiathlonLetterheadFrameProps> = ({
  children,
  className = '',
  hideFooter = false,
  hideHeader = false,
  doctorName = 'Dr. Bharath Kumar B',
  doctorQualifications = 'MBBS, PGDSM (Sports Medicine)',
  doctorRole = 'Medical Director | Ziathlon',
  doctorRegNo = 'KMC#81009',
  doctorPhone = '+91 799 699 44 99',
  doctorEmail = 'info@ziathlon.com',
  doctorWebsite = 'www.ziathlon.com',
  clinicAddressLine1 = '#55, 4th Cross, Panduranga Nagar,',
  clinicAddressLine2 = 'Off Bannerghatta Road, Near IIM-B,',
  clinicAddressLine3 = 'Bangalore 560076',
  scale: externalScale,
  autoScale = true,
  showZoomControls = true,
  canvasId = 'ziathlon-letterhead-canvas',
  canvasRef,
  pageNumber,
  totalPages,
  documentTitle,
  layoutStyle = 'ornate-frame',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalCanvasRef = useRef<HTMLDivElement>(null);
  const activeCanvasRef = canvasRef || internalCanvasRef;

  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [zoomMode, setZoomMode] = useState<'fit' | '100%' | 'custom'>('fit');
  const [customZoom, setCustomZoom] = useState<number>(1.0);
  const [activeLayoutStyle, setActiveLayoutStyle] = useState<'ornate-frame' | 'classic'>(layoutStyle);

  // Measure container width and compute responsive scale
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setContainerWidth(width);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Compute active scale: Base canvas is exactly 800px wide.
  const fitScale = Math.min(1.0, Math.max(0.3, (containerWidth - 8) / 800));
  const activeScale =
    externalScale !== undefined
      ? externalScale
      : !autoScale
      ? 1.0
      : zoomMode === '100%'
      ? 1.0
      : zoomMode === 'custom'
      ? customZoom
      : fitScale;

  const canvasHeight = 1131; // Exact A4 aspect ratio at 800px width (1 : 1.414)
  const scaledWrapperHeight = Math.round(canvasHeight * activeScale);

  return (
    <div
      ref={containerRef}
      className={`ziathlon-letterhead-root w-full flex flex-col items-center select-none ${className}`}
    >
      {/* In-App Zoom & Layout Controls Toolbar */}
      {showZoomControls && (
        <div className="no-print flex items-center justify-between w-full max-w-[800px] mb-2.5 px-3 py-1.5 bg-gray-100/90 border border-gray-300/80 rounded-lg text-xs text-gray-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-purple-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ziathlon A4 Dossier • {activeLayoutStyle === 'ornate-frame' ? 'Ornate Frame Layout' : 'Classic Letterhead'}
            </span>
            {pageNumber && totalPages && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono font-bold text-[10px] border border-purple-200">
                Page {pageNumber} of {totalPages}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            {/* Layout Switcher */}
            <div className="flex items-center bg-white border border-gray-300 rounded-md p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveLayoutStyle('ornate-frame')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                  activeLayoutStyle === 'ornate-frame'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-black'
                }`}
                title="Ornate Certificate Frame Layout (Matching Reference)"
              >
                Ornate Frame
              </button>
              <button
                type="button"
                onClick={() => setActiveLayoutStyle('classic')}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                  activeLayoutStyle === 'classic'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-black'
                }`}
                title="Classic Clean Letterhead"
              >
                Classic
              </button>
            </div>

            <div className="h-4 w-px bg-gray-300" />

            <button
              type="button"
              onClick={() => {
                setZoomMode('custom');
                setCustomZoom((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(2))));
              }}
              className="p-1 rounded hover:bg-gray-200 text-gray-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-bold min-w-[42px] text-center">
              {Math.round(activeScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => {
                setZoomMode('custom');
                setCustomZoom((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(2))));
              }}
              className="p-1 rounded hover:bg-gray-200 text-gray-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomMode('fit')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                zoomMode === 'fit'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
              title="Fit to Screen"
            >
              <Maximize2 className="w-3 h-3 inline mr-1" />
              Fit
            </button>
            <button
              type="button"
              onClick={() => setZoomMode('100%')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                zoomMode === '100%'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
              title="Actual 100% Size"
            >
              100%
            </button>
          </div>
        </div>
      )}

      {/* FIXED CANVAS VIEWPORT WRAPPER */}
      <div
        className="ziathlon-scale-wrapper w-full flex justify-center relative overflow-hidden print:overflow-visible print:h-auto"
        style={{
          height: `${scaledWrapperHeight}px`,
          minHeight: `${scaledWrapperHeight}px`,
        }}
      >
        {/* ========================================================================= */}
        {/* THE MASTER CANVAS: FIXED 800px x 1131px LETTERHEAD COORDINATES             */}
        {/* ========================================================================= */}
        <div
          ref={activeCanvasRef}
          id={canvasId}
          data-canvas="ziathlon-fixed-letterhead"
          className="ziathlon-master-canvas bg-[#FAF8F5] text-gray-950 font-sans relative select-text shadow-[0_6px_35px_rgba(0,0,0,0.15)] rounded-xs print:shadow-none print:border-none print:m-0 print:p-0 overflow-hidden"
          style={{
            width: '800px',
            minWidth: '800px',
            maxWidth: '800px',
            height: '1131px',
            minHeight: '1131px',
            maxHeight: '1131px',
            transform: `scale(${activeScale})`,
            transformOrigin: 'top center',
            boxSizing: 'border-box',
            backgroundColor: '#FAF8F5',
          }}
        >
          {/* ======================================================================= */}
          {/* 1. BACKGROUND BORDER SYSTEM                                             */}
          {/* ======================================================================= */}
          {activeLayoutStyle === 'ornate-frame' ? (
            /* Ornate Victorian / Classical Filigree Certificate Frame from User Image */
            <div className="absolute inset-0 pointer-events-none z-10">
              <OrnateBorderSvg width={800} height={1131} borderColor="#111111" fillColor="#FAF8F5" />
            </div>
          ) : (
            /* Classic Dual Border */
            <>
              <div
                className="pointer-events-none absolute z-30"
                style={{
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  bottom: '10px',
                  border: '2px solid #000000',
                  boxSizing: 'border-box',
                }}
              />
              <div
                className="pointer-events-none absolute z-30"
                style={{
                  top: '14px',
                  left: '14px',
                  right: '14px',
                  bottom: '14px',
                  border: '2px solid #7016B7',
                  boxSizing: 'border-box',
                }}
              />
            </>
          )}

          {/* ======================================================================= */}
          {/* 2. TOP HEADER (ZIATHLON LOGO LOCKUP & OFFICIAL CLINICAL RECORD)         */}
          {/* ======================================================================= */}
          {!hideHeader && (
            <>
              <div
                className="absolute top-[24px] left-[38px] z-20 select-none pointer-events-none flex items-center gap-3.5"
                style={{ position: 'absolute', top: '24px', left: '38px' }}
              >
                {/* Ziathlon Winged Purple Ribbon Emblem with Black Medical Cross (+) */}
                <div className="shrink-0 flex items-center justify-center">
                  <svg
                    width="44"
                    height="42"
                    viewBox="0 0 130 115"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="geometricPrecision"
                    className="overflow-visible"
                  >
                    <g id="ziathlon-official-emblem">
                      <path d="M 16,32 L 84,32 L 20,53 Z" fill="#7016B7" />
                      <path d="M 22,62 L 84,38 L 78,60 L 28,78 Z" fill="#7016B7" />
                      <path d="M 34,85 L 71,73 L 49,103 Z" fill="#7016B7" />
                      <g transform="translate(86, 12)">
                        <rect x="0" y="6.5" width="20" height="7" rx="2" fill="#0B0826" />
                        <rect x="6.5" y="0" width="7" height="20" rx="2" fill="#0B0826" />
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Wordmark and Subtitle */}
                <div className="flex flex-col justify-center">
                  <h1 className="text-[22px] font-black tracking-[0.14em] text-[#0B0826] uppercase font-sans leading-none m-0 p-0">
                    ZIATHLON
                  </h1>
                  <h2 className="text-[9.5px] font-extrabold tracking-[0.24em] text-[#7016B7] uppercase font-sans mt-1 m-0 p-0 leading-none">
                    SPORTS MEDICINE CLINIC
                  </h2>
                </div>
              </div>

              {/* ================================================================= */}
              {/* TOP-RIGHT CORNER: PROFESSIONAL EXECUTIVE CLINICAL LAYOUT          */}
              {/* ================================================================= */}
              <div
                className="absolute top-[20px] right-[36px] text-right z-20 pointer-events-none select-none flex flex-col items-end"
                style={{ position: 'absolute', top: '20px', right: '36px', maxWidth: '360px' }}
              >
                {/* 1. Header Badges: Document Title & Page Counter */}
                <div className="flex items-center gap-2 flex-nowrap">
                  <span className="font-mono text-[10.5px] font-black text-[#7016B7] uppercase tracking-[0.16em] bg-purple-50/90 border border-purple-200/80 px-2.5 py-0.5 rounded-sm shadow-2xs">
                    {documentTitle || 'OFFICIAL CLINICAL RECORD'}
                  </span>
                  {pageNumber && totalPages && (
                    <span className="font-mono text-[9px] font-black bg-[#0B0826] text-[#FAF8F5] border border-purple-900/60 px-2 py-0.5 rounded-sm tracking-wider shadow-2xs">
                      PAGE {pageNumber}/{totalPages}
                    </span>
                  )}
                </div>

                {/* 2. Centre Classification Line (No word collision, clean line-height) */}
                <div className="text-[10px] font-black text-[#0B0826] font-sans tracking-wide uppercase mt-1 leading-tight">
                  Centre for Sports Medicine & Metabolic Health
                </div>

                {/* 3. Accreditation & Compliance Tag with Geometric Accents */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span className="font-mono text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">
                    ISO 15189 • NABH CLINICAL COMPLIANCE
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono text-[8px] font-extrabold text-[#7016B7] uppercase tracking-wider">
                    EHR ENCRYPTED
                  </span>
                </div>
              </div>

              {/* Header Divider: Crisp Double Rule (Clean separation, zero text merge) */}
              <div
                className="absolute left-[36px] right-[36px] top-[86px] z-20 pointer-events-none flex flex-col gap-[1.5px]"
                style={{ position: 'absolute', left: '36px', right: '36px', top: '86px' }}
              >
                <div className="w-full h-[1.5px] bg-[#0B0826]" />
                <div className="w-full h-[1.5px] bg-[#7016B7]" />
              </div>
            </>
          )}

          {/* ======================================================================= */}
          {/* 3. DESIGNATED CONTENT AREA (SAFELY INSET INSIDE ORNATE BORDER)          */}
          {/* ======================================================================= */}
          <div
            className="ziathlon-content-container absolute z-20 overflow-y-auto overflow-x-hidden"
            style={{
              position: 'absolute',
              top: hideHeader ? '36px' : '98px',
              left: '38px',
              right: '38px',
              bottom: hideFooter ? '36px' : '94px',
              width: '724px',
              height: hideHeader ? (hideFooter ? '1059px' : '999px') : (hideFooter ? '999px' : '939px'),
              boxSizing: 'border-box',
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E1 transparent',
            }}
          >
            {children}
          </div>

          {/* ======================================================================= */}
          {/* 4. LOCKED FOOTER (CLINIC ADDRESS + DOCTOR CREDENTIALS)                  */}
          {/* ======================================================================= */}
          {!hideFooter && (
            <div className="ziathlon-locked-footer pointer-events-none select-none">
              {/* Footer Divider: Crisp Double Rule */}
              <div
                className="absolute left-[36px] right-[36px] bottom-[86px] z-20 pointer-events-none flex flex-col gap-[1.5px]"
                style={{ position: 'absolute', left: '36px', right: '36px', bottom: '86px' }}
              >
                <div className="w-full h-[1.5px] bg-[#7016B7]" />
                <div className="w-full h-[1.5px] bg-[#0B0826]" />
              </div>

              {/* Notice text above address - isolated with clean padding to prevent any word merge */}
              <div
                className="absolute z-20 text-[8.5px] font-sans font-semibold text-slate-500 tracking-wider uppercase"
                style={{ position: 'absolute', left: '38px', bottom: '66px' }}
              >
                Not valid for Medico Legal Purpose • Computer Generated Clinical Dossier • Electronic Verification
              </div>

              {/* ================================================================= */}
              {/* BOTTOM-LEFT CORNER: PROFESSIONAL CLINICAL FACILITY LAYOUT         */}
              {/* ================================================================= */}
              <div
                className="absolute left-[38px] bottom-[12px] z-20 text-left select-text pointer-events-auto leading-tight flex items-start gap-2.5"
                style={{ position: 'absolute', left: '38px', bottom: '12px', maxWidth: '360px' }}
              >
                {/* Vertical Geometric Dual Bar: Royal Purple & Dark Obsidian */}
                <div className="w-[3.5px] h-[46px] rounded-full bg-gradient-to-b from-[#7016B7] via-[#9333EA] to-[#0B0826] shrink-0 mt-0.5" />

                {/* Structured Clinic Typography (Strict line-height & margin discipline, NO word collision) */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] font-black uppercase text-[#7016B7] tracking-wider bg-purple-50 px-1.5 py-0.2 rounded-xs border border-purple-200">
                      CLINICAL HQ
                    </span>
                    <span className="font-extrabold text-[#0B0826] text-[10.5px] uppercase tracking-tight">
                      Ziathlon Sports Medicine
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 text-[10px] m-0 leading-tight">
                    {clinicAddressLine1}
                  </p>
                  <p className="text-slate-600 text-[9.5px] m-0 leading-tight">
                    {clinicAddressLine2} {clinicAddressLine3}
                  </p>
                  <p className="font-mono font-bold text-[8.5px] text-slate-500 m-0 leading-tight">
                    Bangalore, Karnataka • Reg: KMC#81009
                  </p>
                </div>
              </div>

              {/* B. BOTTOM-RIGHT: DOCTOR CREDENTIALS & CONTACT */}
              <div
                className="absolute z-20 text-right select-text pointer-events-auto flex flex-col items-end space-y-1"
                style={{
                  position: 'absolute',
                  right: '42px',
                  bottom: '16px',
                  width: '320px',
                }}
              >
                {/* Doctor Credentials */}
                <div className="leading-tight">
                  <div className="font-black text-[#0B0826] text-[13px] leading-tight tracking-tight">
                    {doctorName}
                  </div>
                  <div className="font-bold text-slate-800 text-[10px] leading-tight mt-0.5">
                    {doctorQualifications}
                  </div>
                  <div className="font-semibold text-slate-600 text-[9.5px] leading-tight mt-0.5">
                    {doctorRole}
                  </div>
                  <div className="font-bold text-[#0B0826] text-[9.5px] font-mono leading-tight mt-0.5">
                    {doctorRegNo}
                  </div>
                </div>

                {/* Contact Information with Vertical Purple Bar on Right */}
                <div className="border-r-[3.5px] border-[#7016B7] pr-2.5 leading-tight space-y-0.5">
                  <p className="font-extrabold text-[#0B0826] text-[10px] tracking-wider m-0">
                    {doctorPhone}
                  </p>
                  <p className="text-slate-600 font-semibold text-[9px] m-0">
                    {doctorEmail}
                  </p>
                  <p className="text-[#0B0826] font-bold text-[9px] m-0">
                    {doctorWebsite}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
