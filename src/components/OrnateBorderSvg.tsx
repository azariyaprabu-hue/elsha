import React from 'react';

interface OrnateBorderSvgProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  borderColor?: string;
  fillColor?: string;
}

/**
 * High-Precision Victorian / Classical Certificate & Dossier Ornate Border SVG
 * Exactly replicates the layout from the user reference image (image.png):
 * - Outer solid rectangular border line
 * - Inner parallel border line with corner breaks and terminal decorative dots
 * - Four ornate Victorian scrollwork and filigree corner ornaments with leaf & spiral tendrils
 * - Subtle ivory/parchment paper background
 */
export const OrnateBorderSvg: React.FC<OrnateBorderSvgProps> = ({
  className = '',
  width = 800,
  height = 1131,
  borderColor = '#111111',
  fillColor = '#FAF8F5',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 1131"
      width={width}
      height={height}
      className={`ornate-document-border-svg pointer-events-none select-none ${className}`}
      style={{ display: 'block' }}
    >
      <defs>
        {/* Ornate Victorian / Classical Filigree Corner Motif */}
        <g id="ornate-corner-filigree">
          {/* Main Corner Floral Node & Core Concentric Rings */}
          <circle cx="28" cy="28" r="3.4" fill={borderColor} />
          <circle cx="28" cy="28" r="6.2" fill="none" stroke={borderColor} strokeWidth="1.3" />
          <circle cx="28" cy="28" r="8.5" fill="none" stroke={borderColor} strokeWidth="0.7" strokeDasharray="1.5,1.5" />

          {/* Corner Outer Scrollwork Ribbon */}
          <path
            d="M 14,64 C 14,38 38,14 64,14 C 44,16 22,28 18,48 C 16,54 15,58 14,64 Z"
            fill={borderColor}
          />
          <path
            d="M 64,14 C 38,14 14,38 14,64 C 16,44 28,22 48,18 C 54,16 58,15 64,14 Z"
            fill={borderColor}
          />

          {/* Corner Inner Curving Leaves & Tendrils */}
          <path
            d="M 28,28 C 35,19 50,18 60,20 C 49,24 39,31 34,40 C 30,35 28,30 28,28 Z"
            fill={borderColor}
          />
          <path
            d="M 28,28 C 19,35 18,50 20,60 C 24,49 31,39 40,34 C 35,30 30,28 28,28 Z"
            fill={borderColor}
          />

          {/* Acanthus Leaf Flourishes Along Horizontal Border */}
          <path
            d="M 52,14 C 61,14 70,11 76,7 C 72,11 70,17 63,20 C 59,17 55,15 52,14 Z"
            fill={borderColor}
          />
          <path
            d="M 72,14 C 80,14 88,10 92,6 C 89,10 85,15 78,16 C 75,15 73,14 72,14 Z"
            fill={borderColor}
          />
          <circle cx="95" cy="6" r="2.0" fill={borderColor} />

          {/* Acanthus Leaf Flourishes Along Vertical Border */}
          <path
            d="M 14,52 C 14,61 11,70 7,76 C 11,72 17,70 20,63 C 17,59 15,55 14,52 Z"
            fill={borderColor}
          />
          <path
            d="M 14,72 C 14,80 10,88 6,92 C 10,89 15,85 16,78 C 15,75 14,73 14,72 Z"
            fill={borderColor}
          />
          <circle cx="6" cy="95" r="2.0" fill={borderColor} />

          {/* Central Inward Heart & Lyre Tendril (Pointing into Document) */}
          <path
            d="M 36,36 C 43,43 48,52 46,58 C 44,62 37,61 35,55 C 33,48 40,42 44,40 C 47,38 51,38 53,41 C 57,46 51,52 46,50"
            fill="none"
            stroke={borderColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 36,36 C 43,43 52,48 58,46 C 62,44 61,37 55,35 C 48,33 42,40 40,44 C 38,47 38,51 41,53 C 46,57 52,51 50,46"
            fill="none"
            stroke={borderColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="45" cy="45" r="2.4" fill={borderColor} />

          {/* Satellite Flower Buds / Dots */}
          <circle cx="22" cy="48" r="1.8" fill={borderColor} />
          <circle cx="48" cy="22" r="1.8" fill={borderColor} />
          <circle cx="33" cy="18" r="1.5" fill={borderColor} />
          <circle cx="18" cy="33" r="1.5" fill={borderColor} />
          <circle cx="58" cy="30" r="1.4" fill={borderColor} />
          <circle cx="30" cy="58" r="1.4" fill={borderColor} />
        </g>
      </defs>

      {/* Parchment Background */}
      <rect width="800" height="1131" fill={fillColor} />

      {/* ================= 1. PRIMARY OUTER BORDER ================= */}
      <rect
        x="13"
        y="13"
        width="774"
        height="1105"
        rx="0"
        fill="none"
        stroke={borderColor}
        strokeWidth="2.8"
      />

      {/* ================= 2. SECONDARY INNER PARALLEL LINE WITH TERMINALS ================= */}
      {/* Top Inner Rail */}
      <line x1="98" y1="20" x2="702" y2="20" stroke={borderColor} strokeWidth="1.4" />
      <circle cx="98" cy="20" r="1.8" fill={borderColor} />
      <circle cx="702" cy="20" r="1.8" fill={borderColor} />

      {/* Bottom Inner Rail */}
      <line x1="98" y1="1111" x2="702" y2="1111" stroke={borderColor} strokeWidth="1.4" />
      <circle cx="98" cy="1111" r="1.8" fill={borderColor} />
      <circle cx="702" cy="1111" r="1.8" fill={borderColor} />

      {/* Left Inner Rail */}
      <line x1="20" y1="98" x2="20" y2="1033" stroke={borderColor} strokeWidth="1.4" />
      <circle cx="20" cy="98" r="1.8" fill={borderColor} />
      <circle cx="20" cy="1033" r="1.8" fill={borderColor} />

      {/* Right Inner Rail */}
      <line x1="780" y1="98" x2="780" y2="1033" stroke={borderColor} strokeWidth="1.4" />
      <circle cx="780" cy="98" r="1.8" fill={borderColor} />
      <circle cx="780" cy="1033" r="1.8" fill={borderColor} />

      {/* ================= 3. FOUR ORNATE CORNERS ================= */}
      {/* Top-Left Corner */}
      <g transform="translate(13, 13)">
        <use href="#ornate-corner-filigree" />
      </g>

      {/* Top-Right Corner (Flipped Horizontally) */}
      <g transform="translate(787, 13) scale(-1, 1)">
        <use href="#ornate-corner-filigree" />
      </g>

      {/* Bottom-Left Corner (Flipped Vertically) */}
      <g transform="translate(13, 1118) scale(1, -1)">
        <use href="#ornate-corner-filigree" />
      </g>

      {/* Bottom-Right Corner (Flipped Both) */}
      <g transform="translate(787, 1118) scale(-1, -1)">
        <use href="#ornate-corner-filigree" />
      </g>
    </svg>
  );
};
