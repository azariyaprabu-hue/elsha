import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { getOrGenerateThumbnail } from '../utils/documentThumbnailGenerator';

interface DocumentCardThumbnailProps {
  id: string;
  title: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  downloadUrl?: string;
  category?: string;
  presetVisual?: 'aiims-biochemistry' | 'handwritten-prescription' | 'bhatt-diagnostics';
}

/**
 * High-Fidelity First-Page Document Thumbnail Component
 * Displays the real first page of uploaded PDFs and image files,
 * matching the authentic medical record cards in the reference screenshot.
 */
export const DocumentCardThumbnail: React.FC<DocumentCardThumbnailProps> = ({
  id,
  title,
  thumbnailUrl,
  fileUrl,
  downloadUrl,
  category,
  presetVisual,
}) => {
  const [currentThumb, setCurrentThumb] = useState<string | null>(thumbnailUrl || null);
  const [isLoading, setIsLoading] = useState<boolean>(!thumbnailUrl);

  useEffect(() => {
    let isMounted = true;

    // If explicit image thumbnail already provided
    if (thumbnailUrl && (thumbnailUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(thumbnailUrl))) {
      setCurrentThumb(thumbnailUrl);
      setIsLoading(false);
      return;
    }

    // Try extracting real first-page thumbnail
    const loadThumbnail = async () => {
      try {
        const thumb = await getOrGenerateThumbnail(id, fileUrl, downloadUrl);
        if (isMounted && thumb) {
          setCurrentThumb(thumb);
          setIsLoading(false);
        } else if (isMounted) {
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };

    loadThumbnail();

    return () => {
      isMounted = false;
    };
  }, [id, fileUrl, downloadUrl, thumbnailUrl]);

  // If a real extracted thumbnail is ready
  if (currentThumb && currentThumb.startsWith('data:image')) {
    return (
      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shadow-2xs select-none">
        <img
          src={currentThumb}
          alt={title}
          className="max-h-full max-w-full object-contain rounded transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
    );
  }

  // If an external image URL is available
  if (fileUrl && (fileUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileUrl))) {
    return (
      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shadow-2xs select-none">
        <img
          src={fileUrl}
          alt={title}
          className="max-h-full max-w-full object-contain rounded transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
    );
  }

  // Loading indicator while extracting PDF page 1
  if (isLoading) {
    return (
      <div className="w-full h-full bg-white rounded-lg p-3 flex flex-col items-center justify-center space-y-2 border border-gray-100 select-none">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="text-[10px] text-gray-500 font-mono">Generating thumbnail...</span>
      </div>
    );
  }

  // Preset visuals matching the exact reference screenshot when demo/default records are displayed
  if (presetVisual === 'aiims-biochemistry') {
    return (
      <div className="w-full h-full bg-white rounded-lg border border-gray-200 p-2.5 flex flex-col justify-between font-sans text-[7.5px] leading-tight select-none shadow-2xs overflow-hidden">
        {/* AIIMS Header matching screenshot */}
        <div className="border-b border-gray-300 pb-1.5 flex items-center gap-2">
          {/* Circular emblem */}
          <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black">⚕</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[8px] text-gray-900 leading-none truncate">
              અખિલ ભારતીય આયુર્વિજ્ઞાન સંસ્થા, રાજકોટ, ગુજરાત
            </div>
            <div className="font-extrabold text-[7.5px] text-gray-800 tracking-tight leading-none mt-0.5 truncate">
              ALL INDIA INSTITUTE OF MEDICAL SCIENCES, RAJKOT, GUJARAT
            </div>
            <div className="text-[6.5px] text-gray-500 font-semibold mt-0.5">
              Department of Biochemistry • Clinical Biochemistry Service Laboratory
            </div>
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="grid grid-cols-3 gap-1 py-1 text-[6.5px] border-b border-gray-200 font-mono text-gray-700">
          <div>UHID: <strong>ZC00459</strong></div>
          <div>Patient: <strong>Kiruthika</strong></div>
          <div>Date: <strong>23-Sep-2026</strong></div>
        </div>

        {/* Test rows */}
        <div className="space-y-0.5 text-[6.5px] text-gray-800 font-mono py-0.5">
          <div className="flex justify-between font-bold text-gray-900 border-b border-gray-100 pb-0.5">
            <span>Investigation</span>
            <span>Observed Value</span>
            <span>Reference</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Serum Glucose (Fasting)</span>
            <span className="font-bold text-gray-900">92 mg/dL</span>
            <span>70 - 99</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>HbA1c Glycated Hemoglobin</span>
            <span className="font-bold text-gray-900">5.4 %</span>
            <span>&lt; 5.7</span>
          </div>
        </div>

        {/* Footer verification badge */}
        <div className="pt-1 flex items-center justify-between text-[6.5px] text-gray-500 border-t border-gray-100">
          <span>Dr. Consultant Biochemist</span>
          <span className="text-emerald-700 font-bold">✓ Verified Report</span>
        </div>
      </div>
    );
  }

  if (presetVisual === 'handwritten-prescription') {
    return (
      <div className="w-full h-full bg-[#FAF9F5] rounded-lg border border-gray-200 p-3 flex flex-col justify-between font-serif select-none shadow-2xs overflow-hidden">
        <div className="text-[11px] text-blue-900 font-medium italic space-y-1 leading-snug">
          <div className="font-bold text-slate-900 text-xs not-italic font-sans">
            ℞ Clinical Consultation Notes
          </div>
          <div className="text-[9px] text-slate-600 font-mono">
            Date: 09 Jun '26 • Dr. Bharath Kumar B
          </div>
          <div className="pt-1 border-t border-gray-200 text-blue-950 font-serif">
            Estrogen — 164.0 pg/mL (Normal Range: 30 - 400)
          </div>
          <div className="text-blue-950">
            Tab. Metformin 500mg — 1-0-1 post meals
          </div>
          <div className="text-blue-950">
            Tab. Vitamin D3 60k IU — once weekly for 8 weeks
          </div>
          <div className="text-blue-900 text-[8.5px]">
            Follow up with repeat lipid panel after 30 days
          </div>
        </div>
        <div className="pt-1 border-t border-blue-200/60 flex justify-between items-center text-[7.5px] font-mono text-gray-500">
          <span>Attending Physician Signature</span>
          <span className="font-serif italic font-bold text-blue-900">Dr. Bharath Kumar</span>
        </div>
      </div>
    );
  }

  if (presetVisual === 'bhatt-diagnostics') {
    return (
      <div className="w-full h-full bg-white rounded-lg border border-gray-200 p-2.5 flex flex-col justify-between font-sans text-[7.5px] select-none shadow-2xs overflow-hidden">
        {/* Header with Red Blood Drop Logo */}
        <div className="border-b border-gray-300 pb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-purple-900 text-white flex items-center justify-center text-[7px] font-black">
              ✦
            </div>
            <div className="text-[7.5px] font-bold text-gray-800">Diagnostic Services</div>
          </div>
          <div className="flex items-center gap-1">
            {/* Red blood droplet symbol */}
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px] font-bold">
              💧
            </div>
            <div className="font-black text-gray-900 text-[9px] tracking-tight">
              DR. BHATT
            </div>
          </div>
        </div>

        {/* Patient header */}
        <div className="grid grid-cols-2 gap-1 py-1 text-[7px] text-gray-700 font-mono border-b border-gray-100">
          <div>Patient: <strong>Kiruthika</strong></div>
          <div>Ref: <strong>Dr. Sports Med</strong></div>
          <div>Collected: <strong>06 Jun '26</strong></div>
          <div>Reported: <strong>06 Jun '26</strong></div>
        </div>

        {/* Parameter rows */}
        <div className="space-y-0.5 text-[7px] font-mono py-1">
          <div className="flex justify-between font-bold text-gray-900 border-b border-gray-100 pb-0.5">
            <span>Lipid Parameter</span>
            <span>Result</span>
            <span>Range</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Total Cholesterol</span>
            <span className="font-bold text-gray-900">178 mg/dL</span>
            <span>&lt; 200</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>HDL Cholesterol</span>
            <span className="font-bold text-emerald-800">54 mg/dL</span>
            <span>&gt; 50</span>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-1 border-t border-gray-200 flex justify-between items-center text-[7px] text-gray-500 font-mono">
          <span>Accredited Diagnostics Lab</span>
          <span className="text-red-700 font-bold">Verified Final</span>
        </div>
      </div>
    );
  }

  // Fallback generic high-resolution clinical document paper
  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 p-3 flex flex-col justify-between font-mono text-[8px] text-gray-700 shadow-2xs select-none">
      <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[9px]">
          <FileText className="w-4 h-4 text-purple-700" />
          <span className="truncate max-w-[150px]">{title}</span>
        </div>
        <span className="text-[7.5px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          Document
        </span>
      </div>

      <div className="space-y-1 py-1.5 text-gray-600 text-[7.5px]">
        <div className="flex justify-between">
          <span>Type:</span>
          <strong className="text-gray-900">{category || 'Clinical Record'}</strong>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <strong className="text-emerald-700 font-bold">Verified Archival</strong>
        </div>
      </div>

      <div className="pt-1.5 border-t border-gray-200 text-center text-purple-900 font-bold text-[8px]">
        Click to open full document
      </div>
    </div>
  );
};
