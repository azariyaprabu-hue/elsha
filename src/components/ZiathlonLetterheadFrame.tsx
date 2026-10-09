import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export interface ZiathlonLetterheadFrameProps {
  children: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalCanvasRef = useRef<HTMLDivElement>(null);
  const activeCanvasRef = canvasRef || internalCanvasRef;

  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [zoomMode, setZoomMode] = useState<'fit' | '100%' | 'custom'>('fit');
  const [customZoom, setCustomZoom] = useState<number>(1.0);

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

  // Compute active scale:
  // Base canvas is exactly 800px wide.
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
      {/* In-App Zoom Controls Toolbar */}
      {showZoomControls && (
        <div className="no-print flex items-center justify-between w-full max-w-[800px] mb-2.5 px-3 py-1.5 bg-gray-100/90 border border-gray-300/80 rounded-lg text-xs text-gray-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-purple-900">
              Ziathlon Official Letterhead: A4 Portrait (800 × 1131 px)
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
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
              onClick={() => {
                setZoomMode('fit');
              }}
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
              onClick={() => {
                setZoomMode('100%');
              }}
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
          className="ziathlon-master-canvas bg-white text-gray-950 font-sans relative select-text shadow-[0_6px_35px_rgba(0,0,0,0.15)] rounded-xs print:shadow-none print:border-none print:m-0 print:p-0"
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
          }}
        >
          {/* ======================================================================= */}
          {/* 1. TOP-LEFT: OFFICIAL ZIATHLON EMBLEM & WORDMARK                       */}
          {/* ======================================================================= */}
          <div
            className="absolute top-[18px] left-[32px] w-[280px] z-10 select-none pointer-events-none flex flex-col items-start"
            style={{ position: 'absolute', top: '18px', left: '32px' }}
          >
            {/* Ziathlon Winged Purple Ribbon Emblem with Black Medical Cross (+) */}
            <div className="mb-1">
              <svg
                width="48"
                height="38"
                viewBox="0 0 130 115"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="geometricPrecision"
                className="overflow-visible"
              >
                <g id="ziathlon-official-emblem">
                  {/* Top Ribbon Segment */}
                  <path d="M 16,32 L 84,32 L 20,53 Z" fill="#7016B7" />

                  {/* Middle Slanted Ribbon Stripe */}
                  <path d="M 22,62 L 84,38 L 78,60 L 28,78 Z" fill="#7016B7" />

                  {/* Bottom Apex Tip */}
                  <path d="M 34,85 L 71,73 L 49,103 Z" fill="#7016B7" />

                  {/* Top-Right Medical Cross (+) */}
                  <g transform="translate(86, 12)">
                    <rect x="0" y="6.5" width="20" height="7" rx="2" fill="#0B0826" />
                    <rect x="6.5" y="0" width="7" height="20" rx="2" fill="#0B0826" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Wordmark: ZIATHLON */}
            <h1 className="text-[22px] font-black tracking-[0.12em] text-[#0B0826] uppercase font-sans leading-none m-0 p-0">
              ZIATHLON
            </h1>

            {/* Subtitle: SPORTS MEDICINE CLINIC */}
            <h2 className="text-[9px] font-extrabold tracking-[0.26em] text-[#7016B7] uppercase font-sans mt-1 m-0 p-0">
              SPORTS MEDICINE CLINIC
            </h2>
          </div>

          {/* ======================================================================= */}
          {/* 2. TOP-RIGHT: ANGLED GEOMETRIC HEADER ARTWORK                          */}
          {/* ======================================================================= */}
          <div
            className="absolute top-0 right-0 w-[350px] h-[95px] pointer-events-none select-none overflow-hidden z-0"
            style={{ position: 'absolute', top: 0, right: 0 }}
          >
            <svg
              viewBox="0 0 380 112"
              className="w-full h-full"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Primary Royal Purple Slanted Parallelogram */}
              <polygon points="35,0 165,0 238,104 108,104" fill="#7016B7" />

              {/* Medium Purple Layered Stripe */}
              <polygon points="155,0 205,0 270,104 220,104" fill="#9333EA" />

              {/* Dark Navy Slanted Wedge */}
              <polygon points="195,0 270,0 325,86 250,86" fill="#0B0826" />

              {/* White separator hairline grooves */}
              <line x1="162" y1="0" x2="235" y2="104" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="202" y1="0" x2="267" y2="104" stroke="#FFFFFF" strokeWidth="2" />

              {/* Horizontal Purple Baseline Rule extending right to edge */}
              <line x1="225" y1="100" x2="380" y2="100" stroke="#7016B7" strokeWidth="4.5" />
              <line x1="225" y1="104" x2="380" y2="104" stroke="#0B0826" strokeWidth="1.5" />
            </svg>
          </div>

          {/* ======================================================================= */}
          {/* 3. DESIGNATED CONTENT AREA (BOUNDED & LOCKED COORDINATES)               */}
          {/* ======================================================================= */}
          <div
            className="ziathlon-content-container absolute z-20 overflow-y-auto overflow-x-hidden"
            style={{
              position: 'absolute',
              top: '116px',
              left: '32px',
              right: '32px',
              bottom: '106px',
              width: '736px',
              height: '909px',
              boxSizing: 'border-box',
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E1 transparent',
            }}
          >
            {children}
          </div>

          {/* ======================================================================= */}
          {/* 4. LOCKED FOOTER (BOTTOM-LEFT BANNER + BOTTOM-RIGHT DOCTOR CREDENTIALS) */}
          {/* ======================================================================= */}
          {!hideFooter && (
            <div className="ziathlon-locked-footer pointer-events-none select-none">
              {/* Notice text above address banner */}
              <div
                className="absolute z-20 text-[9px] text-gray-400 font-sans tracking-wide"
                style={{ position: 'absolute', left: '32px', bottom: '88px' }}
              >
                Not valid for Medico Legal Purpose
              </div>

              {/* A. BOTTOM-LEFT: GEOMETRIC GRAPHIC & CLINIC ADDRESS */}
              <div
                className="absolute left-0 bottom-0 w-[440px] h-[82px] z-10 overflow-hidden"
                style={{ position: 'absolute', left: 0, bottom: 0, width: '440px', height: '82px' }}
              >
                {/* SVG Background for Bottom Angled Polygons */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <svg
                    viewBox="0 0 440 82"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Dark Navy Angled Block (holds clinic address in white) */}
                    <polygon points="0,0 285,0 330,82 0,82" fill="#0B0826" />

                    {/* Top purple accent stripe running along the top of the block */}
                    <polygon points="0,0 325,0 338,8 0,8" fill="#7016B7" />

                    {/* Middle Royal Purple Angled Parallelogram Stripe */}
                    <polygon points="280,0 360,0 405,82 325,82" fill="#7016B7" />

                    {/* Dark Navy Angled Wedge */}
                    <polygon points="355,0 395,0 440,82 400,82" fill="#0B0826" />

                    {/* White separator hairline lines */}
                    <line x1="278" y1="0" x2="323" y2="82" stroke="#FFFFFF" strokeWidth="2.5" />
                    <line x1="358" y1="0" x2="403" y2="82" stroke="#FFFFFF" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Address inside Dark Navy Block */}
                <div
                  className="relative z-10 w-full h-full flex flex-col justify-center px-8 py-2 select-text pointer-events-auto text-left text-white leading-tight font-medium"
                  style={{ maxWidth: '280px' }}
                >
                  <p className="font-bold text-white text-[10px] m-0">{clinicAddressLine1}</p>
                  <p className="text-gray-200 text-[10px] m-0">{clinicAddressLine2}</p>
                  <p className="text-gray-200 text-[10px] m-0">{clinicAddressLine3}</p>
                </div>
              </div>

              {/* B. BOTTOM-RIGHT: DOCTOR CREDENTIALS & CONTACT (ON CLEAN WHITE CANVAS) */}
              <div
                className="absolute z-15 text-right select-text pointer-events-auto flex flex-col items-end space-y-2"
                style={{
                  position: 'absolute',
                  right: '36px',
                  bottom: '12px',
                  width: '320px',
                }}
              >
                {/* Doctor Credentials */}
                <div className="leading-tight">
                  <div className="font-black text-[#0B0826] text-[13.5px] leading-tight tracking-tight">
                    {doctorName}
                  </div>
                  <div className="font-bold text-slate-800 text-[10.5px] leading-tight mt-0.5">
                    {doctorQualifications}
                  </div>
                  <div className="font-medium text-slate-600 text-[10px] leading-tight mt-0.5">
                    {doctorRole}
                  </div>
                  <div className="font-bold text-[#0B0826] text-[10px] font-mono leading-tight mt-0.5">
                    {doctorRegNo}
                  </div>
                </div>

                {/* Contact Information with Vertical Purple Bar on Right */}
                <div className="border-r-[3.5px] border-[#7016B7] pr-2.5 leading-tight space-y-0.5">
                  <p className="font-extrabold text-[#0B0826] text-[10.5px] tracking-wider m-0">
                    {doctorPhone}
                  </p>
                  <p className="text-slate-600 font-medium text-[9.5px] m-0">
                    {doctorEmail}
                  </p>
                  <p className="text-[#0B0826] font-bold text-[9.5px] m-0">
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
