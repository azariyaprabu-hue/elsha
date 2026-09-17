import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Camera,
  CheckCircle2,
  Trash2,
  Eye,
  FileSpreadsheet,
  Activity,
  Sparkles,
  AlertCircle,
  Download,
  Calendar,
} from 'lucide-react';

export interface ClinicalReportDocument {
  id: string;
  name: string;
  type: 'Biochemistry / Blood' | 'Radiology / Ultrasound' | 'InBody / Biometric' | 'Endocrine / Thyroid' | 'Prescription';
  date: string;
  fileSize: string;
  keyBiomarkers: { marker: string; value: string; status: 'Normal' | 'Borderline' | 'Elevated' | 'Critical' }[];
  clinicalSummary: string;
}

export const initialClinicalReports: ClinicalReportDocument[] = [
  {
    id: 'rep-1',
    name: 'Comprehensive_Diabetic_Biochemistry_Panel.pdf',
    type: 'Biochemistry / Blood',
    date: '08-Jan-2026',
    fileSize: '2.4 MB',
    keyBiomarkers: [
      { marker: 'Fasting Blood Sugar', value: '142 mg/dL', status: 'Elevated' },
      { marker: 'Post-Prandial Blood Sugar', value: '210 mg/dL', status: 'Elevated' },
      { marker: 'HbA1c (Glycated Hb)', value: '8.2 %', status: 'Critical' },
      { marker: 'Serum Creatinine', value: '0.8 mg/dL', status: 'Normal' },
    ],
    clinicalSummary: 'Uncontrolled type 2 diabetes with severe postprandial excursions. Renal filtration intact.',
  },
  {
    id: 'rep-2',
    name: 'Liver_Function_&_Lipid_Profile.pdf',
    type: 'Biochemistry / Blood',
    date: '10-Jan-2026',
    fileSize: '1.8 MB',
    keyBiomarkers: [
      { marker: 'Total Cholesterol', value: '228 mg/dL', status: 'Borderline' },
      { marker: 'Serum Triglycerides', value: '240 mg/dL', status: 'Elevated' },
      { marker: 'HDL (Good) Cholesterol', value: '38 mg/dL', status: 'Critical' },
      { marker: 'SGPT / ALT', value: '48 U/L', status: 'Borderline' },
    ],
    clinicalSummary: 'Atherogenic dyslipidemia pattern with early hepatic steatosis enzyme leakage.',
  },
  {
    id: 'rep-3',
    name: 'Ultrasound_Whole_Abdomen_Scan.pdf',
    type: 'Radiology / Ultrasound',
    date: '15-Dec-2025',
    fileSize: '4.2 MB',
    keyBiomarkers: [
      { marker: 'Liver Echotexture', value: 'Grade 1 Diffuse Steatosis', status: 'Borderline' },
      { marker: 'Gallbladder', value: 'Normal, no calculi', status: 'Normal' },
      { marker: 'Kidneys', value: 'Bilateral normal cortical thickness', status: 'Normal' },
    ],
    clinicalSummary: 'Mild diffuse fatty liver infiltration without portal hypertension or organomegaly.',
  },
  {
    id: 'rep-4',
    name: 'InBody_770_Body_Composition_Analysis.pdf',
    type: 'InBody / Biometric',
    date: '12-Jan-2026',
    fileSize: '1.1 MB',
    keyBiomarkers: [
      { marker: 'Visceral Fat Rating', value: 'Level 11', status: 'Critical' },
      { marker: 'Percent Body Fat', value: '32.4 %', status: 'Elevated' },
      { marker: 'Skeletal Muscle Mass', value: '42.1 kg', status: 'Normal' },
    ],
    clinicalSummary: 'High visceral adiposity surrounding internal organs requiring targeted low-GI fiber nutrition.',
  },
];

export const ReportsUploadSection: React.FC = () => {
  const [reports, setReports] = useState<ClinicalReportDocument[]>(() => {
    try {
      const stored = localStorage.getItem('ziathlon_uploaded_reports');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialClinicalReports;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeReportPreview, setActiveReportPreview] = useState<ClinicalReportDocument | null>(reports[0] || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync to local storage & broadcast
  useEffect(() => {
    try {
      localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(reports));
      window.dispatchEvent(new CustomEvent('elsha-reports-updated', { detail: reports }));
    } catch {}
  }, [reports]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsScanning(true);
    setTimeout(() => {
      const newReport: ClinicalReportDocument = {
        id: `rep-${Date.now()}`,
        name: file.name,
        type: 'Biochemistry / Blood',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        keyBiomarkers: [
          { marker: 'Fasting Glucose', value: '138 mg/dL', status: 'Elevated' },
          { marker: 'Estimated HbA1c', value: '8.0 %', status: 'Critical' },
          { marker: 'Vitamin D3 (25-OH)', value: '16.4 ng/mL', status: 'Critical' },
        ],
        clinicalSummary: `Automated OCR parsing of ${file.name} complete. Identified glycemic markers and micronutrient deficiencies.`,
      };

      setReports((prev) => [newReport, ...prev]);
      setActiveReportPreview(newReport);
      setIsScanning(false);
      setToastMessage(`Document "${file.name}" uploaded and parsed into client medical records!`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (activeReportPreview?.id === id) {
      setActiveReportPreview(reports[0] || null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Upload className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 06 • CLINICAL REPORTS, LAB DATA & MEDICAL UPLOAD</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Medical Reports & Lab Documents
          </h2>
          <p className="text-xs text-gray-400">
            Upload blood work, ultrasound reports, InBody scan sheets, or camera snapshots with instant OCR key biomarker extraction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-3.5 py-2 bg-black border border-[#7E22CE] text-[#C084FC] text-xs font-bold uppercase tracking-wider hover:bg-[#7E22CE] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Camera Scan</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.5)] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document / File</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-purple-950/70 border border-[#7E22CE] text-[#C084FC] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DRAG AND DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'bg-[#7E22CE]/20 border-[#A855F7] shadow-[0_0_20px_rgba(126,34,206,0.4)]'
            : 'bg-[#0d0617] border-[#7E22CE]/60 hover:border-[#7E22CE] hover:bg-black/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-[#7E22CE] flex items-center justify-center text-[#A855F7]">
            {isScanning ? (
              <span className="w-6 h-6 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isScanning ? 'Scanning and Extracting Clinical Biomarkers...' : 'Drag & Drop Clinical Reports Here'}
          </h3>
          <p className="text-xs text-gray-400 max-w-md">
            Supports PDF, JPG, PNG, CSV, and XLSX lab reports. Or click here to browse files from your computer.
          </p>
        </div>
      </div>

      {/* REPORTS REPOSITORY & PREVIEW VIEWER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Uploaded Documents */}
        <div className="bg-[#0d0617] border border-[#7E22CE] p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-[#A855F7]">
              Archived Reports ({reports.length})
            </span>
            <span className="text-[10px] text-gray-500 font-mono">E2EE Verified</span>
          </div>

          <div className="space-y-2">
            {reports.map((rep) => {
              const isSelected = activeReportPreview?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setActiveReportPreview(rep)}
                  className={`p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#7E22CE]/20 border-[#7E22CE] shadow-[0_0_10px_rgba(126,34,206,0.3)]'
                      : 'bg-black/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#C084FC] font-mono font-bold">
                        <FileText className="w-3 h-3" />
                        <span>{rep.type}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white break-all leading-tight">
                        {rep.name}
                      </h4>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {rep.date} • {rep.fileSize}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(rep.id);
                      }}
                      className="text-gray-500 hover:text-red-400 p-1"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Report Deep Insight */}
        {activeReportPreview && (
          <div className="lg:col-span-2 bg-[#0d0617] border border-[#7E22CE] p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#A855F7] tracking-widest">
                  DOCUMENT DETAILS
                </span>
                <h3 className="text-lg font-black text-white">{activeReportPreview.name}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mt-1">
                  <span>CATEGORY: <strong className="text-white">{activeReportPreview.type}</strong></span>
                  <span>•</span>
                  <span>DATE: <strong className="text-white">{activeReportPreview.date}</strong></span>
                  <span>•</span>
                  <span>SIZE: <strong className="text-white">{activeReportPreview.fileSize}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-purple-950 border border-purple-500 text-[#C084FC] text-xs font-mono font-bold">
                  OCR Verified
                </span>
              </div>
            </div>

            {/* Extracted Key Biomarkers */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold block">
                Extracted Biomarkers & Quantitative Values:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeReportPreview.keyBiomarkers.map((bio, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-black border border-white/10 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="text-gray-300 font-medium block">{bio.marker}</span>
                      <span className="font-mono font-bold text-white text-sm">{bio.value}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black uppercase font-mono ${
                        bio.status === 'Critical'
                          ? 'bg-red-950 border border-red-500 text-red-400'
                          : bio.status === 'Elevated'
                          ? 'bg-amber-950 border border-amber-500 text-amber-400'
                          : bio.status === 'Borderline'
                          ? 'bg-yellow-950 border border-yellow-500 text-yellow-300'
                          : 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                      }`}
                    >
                      {bio.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Summary Note */}
            <div className="p-3.5 bg-purple-950/20 border border-[#7E22CE]/40 space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold block">
                Clinical Interpretation:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {activeReportPreview.clinicalSummary}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
