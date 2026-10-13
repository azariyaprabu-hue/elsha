import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Upload,
  Camera,
  CameraOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Calendar,
  Clock,
  User,
  RefreshCw,
  Trash2,
  Download,
  Maximize2,
  X,
  FileCheck,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Scale,
  Scan,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

export interface ExtractedBiometricScan {
  id: string;
  patientName: string;
  scanDate: string;
  scanTime?: string;
  uploadDateTime: string;
  scanType: string; // e.g. "Tanita PRO", "InBody 770", "DEXA"
  documentId: string;
  originalFileName: string;
  originalFileUrl?: string; // Base64 picture or document link
  originalFileMime?: string;
  
  // Extracted values
  age?: number | string | null;
  sex?: string | null;
  height?: string | number | null;
  weight?: number | null;
  weightUnit?: string;
  bmi?: number | null;
  bodyFatPct?: number | null;
  fatMass?: number | null;
  ffm?: number | null; // Fat-Free Mass
  muscleMass?: number | null;
  skeletalMuscleMass?: number | null; // SMM
  boneMass?: number | null;
  protein?: number | null;
  tbw?: number | null; // Total Body Water
  ecw?: number | null; // Extracellular Water
  icw?: number | null; // Intracellular Water
  ecwOverTbw?: number | null;
  visceralFat?: number | null; // Rating
  bmr?: number | null; // kcal
  metabolicAge?: number | null;
  sarcopenicIndex?: string | null;
  bodyProfile?: string | null;
  segmentalMuscle?: {
    rightArm?: string | null;
    leftArm?: string | null;
    trunk?: string | null;
    rightLeg?: string | null;
    leftLeg?: string | null;
  } | null;
  segmentalFat?: {
    rightArm?: string | null;
    leftArm?: string | null;
    trunk?: string | null;
    rightLeg?: string | null;
    leftLeg?: string | null;
  } | null;
  otherParameters?: Array<{ name: string; value: string; unit?: string }>;
}

// Baseline Clinical Historical Scans
export const INITIAL_BIOMETRIC_SCANS: ExtractedBiometricScan[] = [
  {
    id: 'scan-2026-0826-01',
    patientName: 'Kiruthika',
    scanDate: '26/08/2026',
    scanTime: '09:15 AM',
    uploadDateTime: '26/08/2026 09:18 AM',
    scanType: 'Tanita PRO',
    documentId: 'DOC-TANITA-0826',
    originalFileName: 'Tanita_PRO_Kiruthika_26Aug2026.pdf',
    originalFileUrl: '',
    originalFileMime: 'application/pdf',
    age: 38,
    sex: 'Female',
    height: '162 cm',
    weight: 79.8,
    weightUnit: 'kg',
    bmi: 30.4,
    bodyFatPct: 44.9,
    fatMass: 35.8,
    ffm: 44.0,
    muscleMass: 41.3,
    skeletalMuscleMass: 22.4,
    boneMass: 2.7,
    protein: 8.2,
    tbw: 33.4,
    ecw: 16.0,
    icw: 17.4,
    ecwOverTbw: 0.479,
    visceralFat: 13,
    bmr: 1387,
    metabolicAge: 46,
    sarcopenicIndex: '6.4 kg/m²',
    bodyProfile: 'High Adiposity / Metabolic Risk (Baseline)',
    segmentalMuscle: {
      rightArm: '2.1 kg',
      leftArm: '2.0 kg',
      trunk: '20.8 kg',
      rightLeg: '6.3 kg',
      leftLeg: '6.2 kg',
    },
    segmentalFat: {
      rightArm: '2.8 kg',
      leftArm: '2.9 kg',
      trunk: '18.4 kg',
      rightLeg: '5.9 kg',
      leftLeg: '5.8 kg',
    },
    otherParameters: [
      { name: 'Phase Angle (50kHz)', value: '5.2', unit: '°' },
      { name: 'Target Weight', value: '62.0', unit: 'kg' },
    ],
  },
  {
    id: 'scan-2026-0915-02',
    patientName: 'Kiruthika',
    scanDate: '15/09/2026',
    scanTime: '10:30 AM',
    uploadDateTime: '15/09/2026 10:35 AM',
    scanType: 'Tanita PRO',
    documentId: 'DOC-TANITA-0915',
    originalFileName: 'Tanita_PRO_Kiruthika_15Sep2026.pdf',
    originalFileUrl: '',
    originalFileMime: 'application/pdf',
    age: 38,
    sex: 'Female',
    height: '162 cm',
    weight: 78.2,
    weightUnit: 'kg',
    bmi: 29.8,
    bodyFatPct: 42.8,
    fatMass: 33.5,
    ffm: 44.7,
    muscleMass: 42.1,
    skeletalMuscleMass: 23.1,
    boneMass: 2.7,
    protein: 8.5,
    tbw: 33.9,
    ecw: 15.8,
    icw: 18.1,
    ecwOverTbw: 0.466,
    visceralFat: 12,
    bmr: 1395,
    metabolicAge: 44,
    sarcopenicIndex: '6.6 kg/m²',
    bodyProfile: 'Progressive Adiposity Reduction / GLUT4 Activation',
    segmentalMuscle: {
      rightArm: '2.2 kg',
      leftArm: '2.1 kg',
      trunk: '21.2 kg',
      rightLeg: '6.5 kg',
      leftLeg: '6.4 kg',
    },
    segmentalFat: {
      rightArm: '2.6 kg',
      leftArm: '2.7 kg',
      trunk: '17.1 kg',
      rightLeg: '5.6 kg',
      leftLeg: '5.5 kg',
    },
    otherParameters: [
      { name: 'Phase Angle (50kHz)', value: '5.5', unit: '°' },
      { name: 'Target Weight', value: '62.0', unit: 'kg' },
    ],
  },
];

interface BodyCompositionTrackerSectionProps {
  patientName?: string;
  onSyncCurrentStatsToProfile?: (stats: any) => void;
  onBackToMainFolders?: () => void;
  initialSubfolder?: 'scanner' | 'progress';
}

export const BodyCompositionTrackerSection: React.FC<BodyCompositionTrackerSectionProps> = ({
  patientName = 'Kiruthika',
  onSyncCurrentStatsToProfile,
  onBackToMainFolders,
  initialSubfolder = 'scanner',
}) => {
  // Subfolders in Biometric: 1. SCANNER, 2. PROGRESS
  const [activeSubfolder, setActiveSubfolder] = useState<'scanner' | 'progress'>(initialSubfolder);

  useEffect(() => {
    if (initialSubfolder) {
      setActiveSubfolder(initialSubfolder);
    }
  }, [initialSubfolder]);

  // Stored Scans
  const [scans, setScans] = useState<ExtractedBiometricScan[]>(() => {
    try {
      const saved = localStorage.getItem('ZIATHLON_BIOMETRIC_PROGRESS_SCANS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BIOMETRIC_SCANS;
  });

  // Save Scans to LocalStorage permanently
  useEffect(() => {
    try {
      localStorage.setItem('ZIATHLON_BIOMETRIC_PROGRESS_SCANS', JSON.stringify(scans));
    } catch (e) {
      console.error('Failed to save biometric scans to storage', e);
    }
  }, [scans]);

  // Scanner State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraCaptureInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [customScanDate, setCustomScanDate] = useState<string>(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });

  const [lastExtractedScan, setLastExtractedScan] = useState<ExtractedBiometricScan | null>(null);
  const [nameMismatchWarning, setNameMismatchWarning] = useState<{
    detectedName: string;
    scanCandidate: ExtractedBiometricScan;
  } | null>(null);

  // Date-wise opened scan modal (for viewing the uploaded picture alongside extracted data date-wise)
  const [openedDateScan, setOpenedDateScan] = useState<ExtractedBiometricScan | null>(null);
  const [imageZoomLevel, setImageZoomLevel] = useState<number>(1);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Activate Live Camera Scanner
  const startLiveCameraScanner = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Direct camera streaming is unavailable in this environment. Falling back to device capture.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.warn('Video play error:', err);
          });
        }
      }, 150);
    } catch (err: any) {
      console.warn('Camera stream could not start, triggering capture input fallback:', err);
      setCameraError(err?.message || 'Camera permission required.');
      // Auto-trigger mobile capture input fallback
      if (cameraCaptureInputRef.current) {
        cameraCaptureInputRef.current.click();
      }
    }
  };

  // Stop Live Camera Scanner
  const stopLiveCameraScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture Frame from Live Camera Stream
  const captureFrameFromScanner = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64DataUrl = canvas.toDataURL('image/jpeg', 0.95);

      stopLiveCameraScanner();
      const generatedName = `Biometric_Scan_${Date.now()}.jpg`;
      processBase64Report(base64DataUrl, generatedName, 'image/jpeg');
    } catch (err: any) {
      console.error('Failed to capture frame from video:', err);
      setUploadStatus('Could not capture photo. Please try uploading a file.');
    }
  };

  // Core Processor: Process Base64 image/document and extract parameters
  const processBase64Report = async (
    base64DataUrl: string,
    fileName: string,
    mimeType: string,
    overrideDate?: string
  ) => {
    setIsAnalyzing(true);
    setUploadStatus('Analyzing uploaded picture of biometric data with OCR extraction...');

    try {
      const scanDateToUse = overrideDate || customScanDate || new Date().toLocaleDateString('en-GB');

      // Call backend extraction endpoint
      let extractedResult: any = null;
      try {
        const res = await fetch('/api/biometrics/extract-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64DataUrl,
            mimeType,
            fileName,
            patientName,
            scanDate: scanDateToUse,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.extractedData) {
            extractedResult = json.extractedData;
          } else {
            setUploadStatus(json.error || 'No physical biometric values detected on this image or document. Random values are strictly prevented.');
            setIsAnalyzing(false);
            return;
          }
        } else {
          setUploadStatus('Biometric extraction server error. Please try uploading the image or document again.');
          setIsAnalyzing(false);
          return;
        }
      } catch (networkErr: any) {
        console.warn('Backend extraction network error:', networkErr);
        setUploadStatus('Could not communicate with extraction server. Please check your connection.');
        setIsAnalyzing(false);
        return;
      }

      // If no valid biometric result was extracted from the image/document, do NOT fabricate random values
      if (!extractedResult) {
        setUploadStatus('No biometric values detected in this image. Please upload a clear photo or document of the body composition analyzer report.');
        setIsAnalyzing(false);
        return;
      }

      const uniqueDocId = `DOC-${Date.now().toString(36).toUpperCase()}`;
      const newScanRecord: ExtractedBiometricScan = {
        id: `scan-${Date.now()}`,
        patientName: extractedResult.patientName || patientName,
        scanDate: extractedResult.scanDate || scanDateToUse,
        scanTime: extractedResult.scanTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uploadDateTime: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        scanType: extractedResult.scanType || extractedResult.deviceModel || 'Body Composition Analyzer',
        documentId: uniqueDocId,
        originalFileName: fileName,
        originalFileUrl: base64DataUrl,
        originalFileMime: mimeType,
        age: extractedResult.age ?? null,
        sex: extractedResult.sex ?? null,
        height: extractedResult.height ?? null,
        weight: extractedResult.weight ?? extractedResult.parameters?.weightKg ?? null,
        weightUnit: extractedResult.weightUnit || 'kg',
        bmi: extractedResult.bmi ?? null,
        bodyFatPct: extractedResult.bodyFatPct ?? extractedResult.parameters?.bodyFatPercentage ?? null,
        fatMass: extractedResult.fatMass ?? extractedResult.parameters?.fatMassKg ?? null,
        ffm: extractedResult.ffm ?? null,
        muscleMass: extractedResult.muscleMass ?? null,
        skeletalMuscleMass: extractedResult.skeletalMuscleMass ?? extractedResult.parameters?.skeletalMuscleMassKg ?? null,
        boneMass: extractedResult.boneMass ?? extractedResult.parameters?.boneMassKg ?? null,
        protein: extractedResult.protein ?? null,
        tbw: extractedResult.tbw ?? extractedResult.parameters?.bodyWaterPercentage ?? null,
        ecw: extractedResult.ecw ?? null,
        icw: extractedResult.icw ?? null,
        ecwOverTbw: extractedResult.ecwOverTbw ?? null,
        visceralFat: extractedResult.visceralFat ?? extractedResult.parameters?.visceralFatLevel ?? null,
        bmr: extractedResult.bmr ?? extractedResult.parameters?.bmrKcal ?? null,
        metabolicAge: extractedResult.metabolicAge ?? extractedResult.parameters?.metabolicAge ?? null,
        sarcopenicIndex: extractedResult.sarcopenicIndex ?? null,
        bodyProfile: extractedResult.bodyProfile ?? null,
        segmentalMuscle: extractedResult.segmentalMuscle ?? null,
        segmentalFat: extractedResult.segmentalFat ?? null,
        otherParameters: extractedResult.otherParameters ?? [],
      };

      setLastExtractedScan(newScanRecord);

      // Name check
      if (
        extractedResult.patientName &&
        patientName &&
        !extractedResult.patientName.toLowerCase().includes(patientName.toLowerCase()) &&
        !patientName.toLowerCase().includes(extractedResult.patientName.toLowerCase())
      ) {
        setNameMismatchWarning({
          detectedName: extractedResult.patientName,
          scanCandidate: newScanRecord,
        });
        setIsAnalyzing(false);
        setUploadStatus(null);
        return;
      }

      commitScanToProgress(newScanRecord);
    } catch (err: any) {
      console.error('Scan processing error:', err);
      setUploadStatus(`Error processing report: ${err?.message || 'Please try again'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle file input upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string) || '';
      processBase64Report(base64, file.name, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  // Commit scan permanently to progress history and auto-open in progress
  const commitScanToProgress = (scan: ExtractedBiometricScan) => {
    setScans((prev) => {
      // Avoid duplicate by id
      const existsIndex = prev.findIndex((s) => s.id === scan.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = scan;
        return copy;
      }
      return [...prev, scan];
    });

    if (onSyncCurrentStatsToProfile && scan.weight) {
      onSyncCurrentStatsToProfile(scan);
    }

    setUploadStatus(`✓ Verified biometric parameters extracted from document & automatically saved into PROGRESS! (Date: ${scan.scanDate})`);
    // Automatically switch to PROGRESS subfolder & open this date's report!
    setActiveSubfolder('progress');
    setOpenedDateScan(scan);
  };

  // Delete a scan from progress
  const handleDeleteScan = (scanId: string) => {
    if (window.confirm('Are you sure you want to delete this biometric scan record from progress?')) {
      setScans((prev) => prev.filter((s) => s.id !== scanId));
      if (openedDateScan?.id === scanId) {
        setOpenedDateScan(null);
      }
      if (lastExtractedScan?.id === scanId) {
        setLastExtractedScan(null);
      }
      setUploadStatus('Biometric scan record removed from progress timeline.');
    }
  };

  // Reset progress scans to baseline
  const handleResetScansToBaseline = () => {
    if (window.confirm('Reset all progress scans back to clinical baseline records? This will clear any uploaded records.')) {
      setScans(INITIAL_BIOMETRIC_SCANS);
      setOpenedDateScan(null);
      setLastExtractedScan(null);
      setUploadStatus('Progress scans reset to initial baseline.');
    }
  };

  // Chronologically sorted scans helper with robust format parsing (DD/MM/YYYY or YYYY-MM-DD)
  const parseDateToMs = (dStr: string) => {
    if (!dStr) return 0;
    const parts = dStr.trim().split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return new Date(y, m, d).getTime() || 0;
      }
      // DD/MM/YYYY
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      return new Date(y, m, d).getTime() || 0;
    }
    return new Date(dStr).getTime() || 0;
  };

  // Sort scans strictly date-wise (oldest to newest for delta calculations)
  const sortedScansAsc = [...scans].sort((a, b) => parseDateToMs(a.scanDate) - parseDateToMs(b.scanDate));
  
  // Date-wise latest and baseline
  const baselineScan = sortedScansAsc[0] || null;
  const latestScan = sortedScansAsc[sortedScansAsc.length - 1] || null;
  const previousScan = sortedScansAsc.length >= 2 ? sortedScansAsc[sortedScansAsc.length - 2] : null;

  // Change calculator helper
  const calculateChange = (current?: number | null, prev?: number | null, unit: string = '') => {
    if (current === undefined || current === null || prev === undefined || prev === null) {
      return null;
    }
    const diff = current - prev;
    const formattedDiff = (diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)) + (unit ? ` ${unit}` : '');
    return {
      prev,
      current,
      diff,
      formattedDiff,
      isPositive: diff > 0,
      isNeutral: Math.abs(diff) < 0.05,
    };
  };

  // Find scan index in sorted list for next/prev navigation in modal
  const currentModalIndex = openedDateScan ? sortedScansAsc.findIndex((s) => s.id === openedDateScan.id) : -1;
  const prevDateScan = currentModalIndex > 0 ? sortedScansAsc[currentModalIndex - 1] : null;
  const nextDateScan = currentModalIndex >= 0 && currentModalIndex < sortedScansAsc.length - 1 ? sortedScansAsc[currentModalIndex + 1] : null;

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* MAJOR FOLDER BANNER: 02 BIOMETRIC (Ziathlon Sports Medicine Clinic)      */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-purple-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {onBackToMainFolders && (
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="p-2.5 rounded-xl border border-purple-200 hover:border-[#7E22CE] bg-purple-50/50 hover:bg-purple-100 text-[#7E22CE] transition-all cursor-pointer shadow-2xs"
              title="Back to 7 Main Folders"
            >
              <Activity className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded bg-purple-100 text-[#7E22CE] font-mono text-[10px] font-black uppercase tracking-wider">
                FOLDER 02
              </span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                ZIATHLON SPORTS MEDICINE CLINIC
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] uppercase tracking-tight">
              BIOMETRIC FOLDER
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Body Composition Analyzer, Tanita PRO & InBody Automatic Scanner → Date-Wise Progress System • Patient: <strong className="text-gray-900">{patientName}</strong>
            </p>
          </div>
        </div>

        {/* Compact Navigation: 1. SCANNER, 2. PROGRESS */}
        <div className="flex items-center gap-1.5 p-1 bg-purple-50/80 border border-purple-200 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveSubfolder('scanner');
              stopLiveCameraScanner();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeSubfolder === 'scanner'
                ? 'bg-[#7E22CE] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#7E22CE] hover:bg-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>1. SCANNER</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubfolder('progress');
              stopLiveCameraScanner();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeSubfolder === 'progress'
                ? 'bg-[#7E22CE] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#7E22CE] hover:bg-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>2. PROGRESS</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeSubfolder === 'progress' ? 'bg-white text-[#7E22CE]' : 'bg-purple-200 text-purple-900'
              }`}
            >
              {scans.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2 SUBFOLDERS SELECTOR CARDS                                                */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-purple-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7E22CE]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#7E22CE]">
              BIOMETRIC SUBFOLDERS (SCANNER & DATE-WISE PROGRESS)
            </h2>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            Click any subfolder below to switch workspace
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 1. SCANNER SUBFOLDER CARD */}
          <button
            type="button"
            id="subfolder-btn-scanner"
            onClick={() => {
              setActiveSubfolder('scanner');
              stopLiveCameraScanner();
            }}
            className={`p-4 sm:p-5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-4 group ${
              activeSubfolder === 'scanner'
                ? 'border-[#7E22CE] bg-purple-50/50 shadow-sm ring-2 ring-[#7E22CE]/20'
                : 'border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                  activeSubfolder === 'scanner'
                    ? 'bg-[#7E22CE] text-white shadow-xs'
                    : 'bg-purple-100 text-[#7E22CE] group-hover:bg-[#7E22CE] group-hover:text-white'
                }`}
              >
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-[#7E22CE] font-mono text-[9px] font-black uppercase">
                    SUBFOLDER 01
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Camera Activated
                  </span>
                </div>
                <h3 className="text-base font-black text-[#0F172A] uppercase tracking-wide mt-0.5">
                  [ SCANNER ]
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Active camera scanner & picture report upload
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                  activeSubfolder === 'scanner'
                    ? 'bg-[#7E22CE] text-white shadow-xs'
                    : 'bg-purple-50 text-[#7E22CE] group-hover:bg-purple-100'
                }`}
              >
                {activeSubfolder === 'scanner' ? 'Active Workspace' : 'Open Workspace →'}
              </span>
            </div>
          </button>

          {/* 2. PROGRESS SUBFOLDER CARD */}
          <button
            type="button"
            id="subfolder-btn-progress"
            onClick={() => {
              setActiveSubfolder('progress');
              stopLiveCameraScanner();
            }}
            className={`p-4 sm:p-5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-4 group ${
              activeSubfolder === 'progress'
                ? 'border-[#7E22CE] bg-purple-50/50 shadow-sm ring-2 ring-[#7E22CE]/20'
                : 'border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                  activeSubfolder === 'progress'
                    ? 'bg-[#7E22CE] text-white shadow-xs'
                    : 'bg-purple-100 text-[#7E22CE] group-hover:bg-[#7E22CE] group-hover:text-white'
                }`}
              >
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-[#7E22CE] font-mono text-[9px] font-black uppercase">
                    SUBFOLDER 02
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-200 text-purple-900">
                    {scans.length} Saved Dates
                  </span>
                </div>
                <h3 className="text-base font-black text-[#0F172A] uppercase tracking-wide mt-0.5">
                  [ PROGRESS ]
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Open patient's biometric data & pictures date-wise
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                  activeSubfolder === 'progress'
                    ? 'bg-[#7E22CE] text-white shadow-xs'
                    : 'bg-purple-50 text-[#7E22CE] group-hover:bg-purple-100'
                }`}
              >
                {activeSubfolder === 'progress' ? 'Active Workspace' : 'Open Date-Wise →'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Notification / Status Banner */}
      {uploadStatus && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-[#7E22CE] text-xs font-bold text-[#7E22CE] flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#7E22CE]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{uploadStatus}</span>
          </div>
          {lastExtractedScan && (
            <button
              type="button"
              onClick={() => {
                setActiveSubfolder('progress');
                setOpenedDateScan(lastExtractedScan);
              }}
              className="px-3 py-1 rounded bg-[#7E22CE] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#6b1dae] cursor-pointer ml-3 shrink-0 shadow-2xs"
            >
              Open Date-Wise in Progress →
            </button>
          )}
        </div>
      )}

      {/* Patient Name Mismatch Confirmation Warning Modal */}
      {nameMismatchWarning && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border-2 border-amber-400 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-black text-sm uppercase tracking-wide text-gray-900">
                  Patient Name Mismatch Warning
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">Verification required before saving</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-gray-800 space-y-1.5 leading-relaxed">
              <p>
                The uploaded report indicates patient name: <strong className="text-amber-900 font-black">"{nameMismatchWarning.detectedName}"</strong>.
              </p>
              <p>
                The currently active patient dossier in Ziathlon is: <strong className="text-purple-900 font-black">"{patientName}"</strong>.
              </p>
              <p className="text-[11px] text-gray-600 pt-1 border-t border-amber-200">
                Do you wish to confirm and assign this body composition scan to <strong>{patientName}</strong>'s permanent progress history?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setNameMismatchWarning(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Cancel / Do Not Save
              </button>
              <button
                type="button"
                onClick={() => {
                  commitScanToProgress(nameMismatchWarning.scanCandidate);
                  setNameMismatchWarning(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Confirm & Assign Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUBFOLDER: SCANNER WORKSPACE                                           */}
      {/* ========================================================================= */}
      {activeSubfolder === 'scanner' && (
        <div className="w-full space-y-5">
          {/* Header & Controls Strip */}
          <div className="w-full bg-white border border-purple-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#7E22CE]">
                  BIOMETRIC → SCANNER ACTIVATION
                </span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <span>Activate Scanner & Upload Biometric Reports</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Live Ready
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Use the active camera scanner or upload pictures/PDFs of Tanita PRO, InBody, DEXA, or BCA sheets. Scanned records are auto-saved to Progress date-wise.
                </p>
              </div>

              {/* Date Input for Report Record */}
              <div className="flex items-center gap-2 bg-purple-50/70 border border-purple-200 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-[#7E22CE]" />
                <span className="text-[11px] font-black uppercase text-gray-600">Report Date:</span>
                <input
                  type="text"
                  value={customScanDate}
                  onChange={(e) => setCustomScanDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-28 bg-white border border-purple-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#7E22CE]"
                />
              </div>
            </div>

            {/* SCANNER CONTROLS: 1) Activate Live Camera Scanner, 2) Snap Photo, 3) Upload Picture */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Button A: Live Camera Scanner */}
              <button
                type="button"
                onClick={() => {
                  if (isCameraActive) {
                    stopLiveCameraScanner();
                  } else {
                    startLiveCameraScanner();
                  }
                }}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  isCameraActive
                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-[#7E22CE] bg-purple-50/60 hover:bg-purple-100 text-[#7E22CE] shadow-2xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isCameraActive ? 'bg-rose-600 text-white' : 'bg-[#7E22CE] text-white'
                  }`}
                >
                  {isCameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-wider">
                    {isCameraActive ? 'Deactivate Camera' : 'Activate Live Camera Scanner'}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {isCameraActive ? 'Click to stop viewfinder' : 'Real-time webcam / device sensor'}
                  </div>
                </div>
              </button>

              {/* Button B: Direct Device Camera Snapshot (Mobile Friendly) */}
              <button
                type="button"
                onClick={() => cameraCaptureInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-purple-200 hover:border-[#7E22CE] bg-white hover:bg-purple-50/40 text-gray-800 flex items-center gap-3 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#7E22CE] flex items-center justify-center shrink-0">
                  <Scan className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Snap Photo of Report
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Take photo directly with phone / tablet
                  </div>
                </div>
              </button>

              {/* Button C: Choose Picture or PDF File */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-purple-200 hover:border-[#7E22CE] bg-white hover:bg-purple-50/40 text-gray-800 flex items-center gap-3 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#7E22CE] flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Upload Picture / PDF
                  </div>
                  <div className="text-[10px] text-gray-500">
                    JPG, PNG, WEBP, or scanned PDF
                  </div>
                </div>
              </button>
            </div>

            {/* Hidden Input Elements */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <input
              ref={cameraCaptureInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {/* LIVE CAMERA VIEWFINDER OVERLAY WHEN ACTIVE */}
            {isCameraActive && (
              <div className="w-full bg-black rounded-2xl p-4 sm:p-6 text-white space-y-4 border-2 border-[#7E22CE] shadow-xl animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                      LIVE BIOMETRIC SCANNER VIEWFINDER • ALIGN DOCUMENT
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={stopLiveCameraScanner}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Viewfinder Window */}
                <div className="relative w-full max-w-2xl mx-auto h-[320px] sm:h-[400px] bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border border-purple-500/40">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* High-tech Viewfinder Alignment Rectangles */}
                  <div className="absolute inset-6 border-2 border-dashed border-[#A855F7]/80 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between text-[10px] font-mono text-[#A855F7] uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded self-start">
                      [ + ALIGN REPORT HERE + ]
                    </div>
                    {/* Animated Scanning Bar */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse shadow-[0_0_15px_#C084FC]" />
                    <div className="text-[10px] font-mono text-gray-400 text-center bg-black/60 px-2 py-0.5 rounded">
                      Hold still for sharp text extraction
                    </div>
                  </div>
                </div>

                {/* Capture Trigger Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={captureFrameFromScanner}
                    disabled={isAnalyzing}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6b1dae] hover:to-[#7E22CE] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>CAPTURE & EXTRACT BIOMETRIC DATA</span>
                  </button>

                  <button
                    type="button"
                    onClick={stopLiveCameraScanner}
                    className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {cameraError && !isCameraActive && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>{cameraError} You can take a snapshot directly with the button above or upload any image.</span>
                <button
                  type="button"
                  onClick={() => cameraCaptureInputRef.current?.click()}
                  className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold uppercase"
                >
                  Snap Photo
                </button>
              </div>
            )}

            {/* Drag & Drop Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                isAnalyzing
                  ? 'border-[#7E22CE] bg-purple-50/40 pointer-events-none'
                  : 'border-purple-300 hover:border-[#7E22CE] bg-purple-50/20 hover:bg-purple-50/50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#7E22CE] flex items-center justify-center shadow-xs">
                {isAnalyzing ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  {isAnalyzing
                    ? 'Extracting Body Composition Parameters...'
                    : 'Drag & Drop Picture of Biometric Data or Click to Browse'}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-0.5">
                  Accepts Tanita PRO, InBody, DEXA, BCA printouts (PNG, JPG, JPEG, WEBP, PDF). Automatically extracted and linked date-wise.
                </p>
              </div>

              {/* Verification & Anti-Random Data Guarantee Banner */}
              <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-[#7E22CE] text-[11px] font-bold border border-purple-200 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real Biometric OCR Engine Active • Physical Values Only (No Random Numbers)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Recently Extracted Scan Card */}
          {lastExtractedScan && (
            <div className="w-full bg-white border-2 border-purple-300 rounded-2xl p-6 shadow-md space-y-4 animate-in slide-in-from-bottom-2">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[9px] font-black uppercase">
                        ✓ SAVED TO PATIENT PROGRESS (DATE-WISE)
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-500">
                        Date: {lastExtractedScan.scanDate}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 uppercase">
                      {lastExtractedScan.scanType} • {lastExtractedScan.patientName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubfolder('progress');
                      setOpenedDateScan(lastExtractedScan);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open in Progress Date-Wise →</span>
                  </button>
                </div>
              </div>

              {/* Thumbnail of Uploaded Picture & Extracted Values Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Uploaded picture thumbnail */}
                <div className="p-2 border border-purple-200 rounded-xl bg-purple-50/30 flex flex-col items-center justify-center text-center">
                  {lastExtractedScan.originalFileUrl ? (
                    <img
                      src={lastExtractedScan.originalFileUrl}
                      alt={lastExtractedScan.originalFileName}
                      className="max-h-28 rounded-lg object-contain border"
                    />
                  ) : (
                    <div className="p-4 text-purple-700">
                      <FileText className="w-8 h-8 mx-auto mb-1 opacity-70" />
                      <span className="text-[10px] font-mono font-bold">{lastExtractedScan.originalFileName}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-mono text-gray-500 mt-1">Uploaded Biometric Picture</span>
                </div>

                {/* Key Metrics Quick Summary */}
                <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Weight</span>
                    <span className="font-black text-base text-gray-900">{lastExtractedScan.weight !== null ? `${lastExtractedScan.weight} kg` : '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Body Fat %</span>
                    <span className="font-black text-base text-[#7E22CE]">{lastExtractedScan.bodyFatPct !== null ? `${lastExtractedScan.bodyFatPct}%` : '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Muscle Mass</span>
                    <span className="font-black text-base text-emerald-700">{lastExtractedScan.muscleMass !== null ? `${lastExtractedScan.muscleMass} kg` : '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Fat Mass</span>
                    <span className="font-black text-base text-gray-900">{lastExtractedScan.fatMass !== null ? `${lastExtractedScan.fatMass} kg` : '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">BMI</span>
                    <span className="font-black text-base text-gray-900">{lastExtractedScan.bmi ?? '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Visceral Fat</span>
                    <span className="font-black text-base text-amber-700">{lastExtractedScan.visceralFat ?? '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Total Water (TBW)</span>
                    <span className="font-black text-base text-blue-700">{lastExtractedScan.tbw !== null ? `${lastExtractedScan.tbw} kg` : '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">BMR</span>
                    <span className="font-black text-base text-gray-900">{lastExtractedScan.bmr !== null ? `${lastExtractedScan.bmr} kcal` : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUBFOLDER: PROGRESS WORKSPACE (OPEN DATE-WISE BIOMETRIC DATA & PICTURES) */}
      {/* ========================================================================= */}
      {activeSubfolder === 'progress' && (
        <div className="w-full space-y-5">
          {/* Progress Header Strip */}
          <div className="w-full bg-white border border-purple-200 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#7E22CE]">
                  BIOMETRIC → DATE-WISE PROGRESS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-[#7E22CE]">
                  {scans.length} Recorded Dates
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
                Patient Biometric Records (Date-Wise Progression)
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Click any date card to open the patient's uploaded picture of biometric data and full clinical analysis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetScansToBaseline}
                className="px-3 py-2 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Reset progress records to initial baseline"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                <span>Reset Baseline</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubfolder('scanner')}
                className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Scan className="w-4 h-4" />
                <span>+ Scan / Upload Another Date</span>
              </button>
            </div>
          </div>

          {/* AUTOMATIC PROGRESS COMPARISON (Across Dates) */}
          {previousScan && latestScan && (
            <div className="w-full bg-white border border-purple-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#7E22CE]">
                      DATE-WISE BIOMETRIC PROGRESS COMPARISON
                    </span>
                  </div>
                  <h3 className="text-base font-black text-gray-900 uppercase">
                    Changes from {previousScan.scanDate} → {latestScan.scanDate}
                  </h3>
                </div>

                <div className="text-[11px] font-mono text-gray-500">
                  Baseline: <strong className="text-gray-900">{baselineScan?.scanDate}</strong> | Latest: <strong className="text-purple-900">{latestScan.scanDate}</strong>
                </div>
              </div>

              {/* Delta Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {[
                  { label: 'Weight', cur: latestScan.weight, prev: previousScan.weight, unit: 'kg', lowerIsBetter: true },
                  { label: 'Body Fat %', cur: latestScan.bodyFatPct, prev: previousScan.bodyFatPct, unit: '%', lowerIsBetter: true },
                  { label: 'Fat Mass', cur: latestScan.fatMass, prev: previousScan.fatMass, unit: 'kg', lowerIsBetter: true },
                  { label: 'Muscle Mass', cur: latestScan.muscleMass, prev: previousScan.muscleMass, unit: 'kg', lowerIsBetter: false },
                  { label: 'BMI', cur: latestScan.bmi, prev: previousScan.bmi, unit: '', lowerIsBetter: true },
                  { label: 'Visceral Fat', cur: latestScan.visceralFat, prev: previousScan.visceralFat, unit: '', lowerIsBetter: true },
                  { label: 'BMR', cur: latestScan.bmr, prev: previousScan.bmr, unit: 'kcal', lowerIsBetter: false },
                  { label: 'TBW', cur: latestScan.tbw, prev: previousScan.tbw, unit: 'kg', lowerIsBetter: false },
                ].map((item, idx) => {
                  const comp = calculateChange(item.cur, item.prev, item.unit);
                  if (!comp) return null;
                  const isGood = item.lowerIsBetter ? comp.diff <= 0 : comp.diff >= 0;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between space-y-1.5"
                    >
                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                        {item.label}
                      </span>

                      <div className="space-y-0.5">
                        <div className="text-[10px] text-gray-500 font-mono">
                          {comp.prev} → <strong className="text-gray-900">{comp.current}</strong>
                        </div>
                        <div
                          className={`text-xs font-black flex items-center gap-0.5 ${
                            comp.isNeutral
                              ? 'text-gray-500'
                              : isGood
                              ? 'text-emerald-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {!comp.isNeutral && (
                            comp.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{comp.formattedDiff}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PROPER ALIGNMENT: MULTI-DATE BIOMETRIC PROGRESSION MATRIX                 */}
          {/* ========================================================================= */}
          <div className="w-full bg-white border border-purple-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#7E22CE] flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                    Chronological Biometric Progression Table
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Strict clinical alignment across all recorded dates • Click any date header to open original picture & data
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#7E22CE] bg-purple-50 px-2.5 py-1 rounded-full font-bold">
                {sortedScansAsc.length} Dates Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#1e1b4b] text-white font-mono text-[11px]">
                    <th className="p-3 border border-purple-900 uppercase font-black tracking-wider min-w-[170px]">
                      Biometric Parameter
                    </th>
                    {sortedScansAsc.map((scan) => (
                      <th
                        key={scan.id}
                        onClick={() => setOpenedDateScan(scan)}
                        className="p-3 border border-purple-900 text-center uppercase tracking-wider min-w-[125px] cursor-pointer hover:bg-purple-900 transition-colors"
                        title="Click to inspect this date's report and picture"
                      >
                        <div className="font-bold text-amber-300">📅 {scan.scanDate}</div>
                        <div className="text-[9px] text-purple-200 font-normal truncate max-w-[115px] mx-auto">
                          {scan.scanType}
                        </div>
                      </th>
                    ))}
                    {sortedScansAsc.length >= 2 && (
                      <th className="p-3 border border-purple-900 text-center uppercase font-black tracking-wider min-w-[130px] bg-[#0f0c36] text-purple-200">
                        Total Net Delta
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-gray-800">
                  {[
                    { label: 'Weight', key: 'weight', unit: 'kg', lowerIsBetter: true },
                    { label: 'BMI (Body Mass Index)', key: 'bmi', unit: '', lowerIsBetter: true },
                    { label: 'Body Fat %', key: 'bodyFatPct', unit: '%', lowerIsBetter: true },
                    { label: 'Fat Mass', key: 'fatMass', unit: 'kg', lowerIsBetter: true },
                    { label: 'Muscle Mass', key: 'muscleMass', unit: 'kg', lowerIsBetter: false },
                    { label: 'Skeletal Muscle Mass (SMM)', key: 'skeletalMuscleMass', unit: 'kg', lowerIsBetter: false },
                    { label: 'Fat-Free Mass (FFM)', key: 'ffm', unit: 'kg', lowerIsBetter: false },
                    { label: 'Visceral Fat Rating', key: 'visceralFat', unit: '', lowerIsBetter: true },
                    { label: 'Total Body Water (TBW)', key: 'tbw', unit: 'kg', lowerIsBetter: false },
                    { label: 'BMR (Basal Metabolism)', key: 'bmr', unit: 'kcal', lowerIsBetter: false },
                    { label: 'Metabolic Age', key: 'metabolicAge', unit: 'yrs', lowerIsBetter: true },
                  ].map((param, rowIdx) => {
                    const baselineVal = (baselineScan as any)?.[param.key];
                    const latestVal = (latestScan as any)?.[param.key];
                    const netComp = calculateChange(latestVal, baselineVal, param.unit);

                    return (
                      <tr key={param.key} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-purple-50/20 hover:bg-purple-50/40'}>
                        <td className="p-2.5 font-bold text-gray-900 border border-gray-200">
                          {param.label}
                        </td>
                        {sortedScansAsc.map((scan) => {
                          const val = (scan as any)?.[param.key];
                          return (
                            <td key={scan.id} className="p-2.5 text-center border border-gray-200">
                              {val !== null && val !== undefined ? (
                                <span className="font-black text-gray-900">
                                  {val} {param.unit}
                                </span>
                              ) : (
                                <span className="text-gray-400 font-normal">—</span>
                              )}
                            </td>
                          );
                        })}
                        {sortedScansAsc.length >= 2 && (
                          <td className="p-2.5 text-center font-bold border border-gray-200 bg-purple-50/50">
                            {netComp ? (
                              <span
                                className={`inline-flex items-center gap-1 ${
                                  netComp.isNeutral
                                    ? 'text-gray-500'
                                    : (param.lowerIsBetter ? netComp.diff <= 0 : netComp.diff >= 0)
                                    ? 'text-emerald-700'
                                    : 'text-rose-600'
                                }`}
                              >
                                {netComp.formattedDiff}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-normal">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DATE-WISE RECORD CARDS (Click to Open Full Picture & Biometrics) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#7E22CE] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Patient Biometric Timeline (Date-Wise Records)</span>
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">
                Click any date card to open full uploaded picture & parameters
              </span>
            </div>

            {/* List of Date Cards in Reverse Chronological Order (Newest Date First) */}
            <div className="grid grid-cols-1 gap-4">
              {sortedScansAsc
                .slice()
                .reverse()
                .map((scan, index) => {
                  const isLatest = index === 0;
                  const isBaseline = scan.id === baselineScan?.id;

                  return (
                    <div
                      key={scan.id}
                      onClick={() => setOpenedDateScan(scan)}
                      className={`w-full bg-white border-2 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-4 ${
                        isLatest
                          ? 'border-[#7E22CE] ring-1 ring-[#7E22CE]/20'
                          : 'border-purple-100 hover:border-[#7E22CE]'
                      }`}
                    >
                      {/* Top Date Header Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#7E22CE] flex flex-col items-center justify-center font-black text-xs font-mono">
                            <span className="text-[9px] uppercase text-purple-700">DATE</span>
                            <span className="text-sm">{scan.scanDate.split('/')[0]}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-black text-gray-900 uppercase">
                                📅 {scan.scanDate}
                              </h4>
                              {isLatest && (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                                  Latest Recorded Date
                                </span>
                              )}
                              {isBaseline && !isLatest && (
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                                  Baseline Audit
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded bg-purple-50 text-[#7E22CE] font-mono text-[10px] font-bold">
                                {scan.scanType}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 mt-0.5">
                              Patient: <strong className="text-gray-900">{scan.patientName}</strong> • Recorded Time: {scan.scanTime || 'Standard Intake'} • Document ID: <span className="font-mono">{scan.documentId}</span>
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons: Open & Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenedDateScan(scan);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Open Biometric Data ({scan.scanDate}) →</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScan(scan.id);
                            }}
                            className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                            title="Delete this scan record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Grid: Uploaded Picture Thumbnail + Extracted Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Picture Thumbnail */}
                        <div className="p-2 rounded-xl bg-purple-50/50 border border-purple-200 flex flex-col items-center justify-center text-center h-32 relative overflow-hidden group-hover:border-[#7E22CE] transition-all">
                          {scan.originalFileUrl ? (
                            <img
                              src={scan.originalFileUrl}
                              alt={scan.originalFileName}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-purple-700 space-y-1">
                              <ImageIcon className="w-7 h-7 opacity-60" />
                              <span className="text-[9px] font-mono font-bold truncate max-w-[120px]">{scan.originalFileName}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                            <ZoomIn className="w-4 h-4 mr-1" /> Click to Expand
                          </div>
                        </div>

                        {/* Extracted Biometric Parameters for this date (8-metric clean clinical grid) */}
                        <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Weight</span>
                            <span className="font-black text-sm text-gray-900">{scan.weight !== null ? `${scan.weight} kg` : '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Body Fat %</span>
                            <span className="font-black text-sm text-[#7E22CE]">{scan.bodyFatPct !== null ? `${scan.bodyFatPct}%` : '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Muscle Mass</span>
                            <span className="font-black text-sm text-emerald-700">{scan.muscleMass !== null ? `${scan.muscleMass} kg` : '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Fat Mass</span>
                            <span className="font-black text-sm text-gray-900">{scan.fatMass !== null ? `${scan.fatMass} kg` : '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">BMI</span>
                            <span className="font-black text-sm text-gray-900">{scan.bmi ?? '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Visceral Fat</span>
                            <span className="font-black text-sm text-amber-700">{scan.visceralFat ?? '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Total Water (TBW)</span>
                            <span className="font-black text-sm text-blue-700">{scan.tbw !== null ? `${scan.tbw} kg` : '—'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block">BMR</span>
                            <span className="font-black text-sm text-gray-900">{scan.bmr !== null ? `${scan.bmr} kcal` : (scan.skeletalMuscleMass !== null ? `${scan.skeletalMuscleMass} kg (SMM)` : '—')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DATE-WISE FULL BIOMETRIC DATA & PICTURE INSPECTION MODAL                   */}
      {/* ========================================================================= */}
      {openedDateScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="w-full max-w-5xl bg-white rounded-2xl border-2 border-[#7E22CE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#601188] via-[#781CA8] to-[#9228C9] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-[#781CA8] text-xs font-black uppercase tracking-wider">
                      📅 DATE: {openedDateScan.scanDate}
                    </span>
                    <span className="text-xs text-purple-200 font-mono font-bold">
                      {openedDateScan.scanType}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                    Biometric Record • Patient: {openedDateScan.patientName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpenedDateScan(null)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                  title="Close inspection view"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split Screen (Left: Uploaded Picture, Right: Date-wise Parameters) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT: Uploaded Picture of Biometric Data */}
                <div className="lg:col-span-5 bg-gray-50 border border-purple-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#7E22CE] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Uploaded Biometric Picture
                    </span>
                    <div className="flex items-center gap-1.5">
                      {openedDateScan.originalFileUrl && (
                        <a
                          href={openedDateScan.originalFileUrl}
                          download={openedDateScan.originalFileName || `Biometric_${openedDateScan.scanDate.replace(/\//g, '-')}.jpg`}
                          className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="Download original uploaded file"
                        >
                          <Download className="w-3 h-3 text-[#7E22CE]" />
                          <span>Download</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setImageZoomLevel((prev) => (prev >= 2 ? 1 : prev + 0.5))}
                        className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                        title="Toggle zoom"
                      >
                        {imageZoomLevel > 1 ? 'Reset' : 'Zoom +'}
                      </button>
                    </div>
                  </div>

                  <div className="w-full min-h-[260px] max-h-[380px] bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border p-2">
                    {openedDateScan.originalFileUrl ? (
                      openedDateScan.originalFileMime?.startsWith('image/') || openedDateScan.originalFileUrl.startsWith('data:image') ? (
                        <img
                          src={openedDateScan.originalFileUrl}
                          alt={openedDateScan.originalFileName}
                          style={{ transform: `scale(${imageZoomLevel})`, transformOrigin: 'center center' }}
                          className="max-h-[360px] object-contain rounded-lg transition-transform duration-200"
                        />
                      ) : (
                        <iframe
                          src={openedDateScan.originalFileUrl}
                          className="w-full h-[340px] rounded-lg"
                          title="Biometric Document"
                        />
                      )
                    ) : (
                      <div className="p-8 text-center text-gray-400 space-y-2">
                        <FileText className="w-12 h-12 mx-auto text-purple-400 opacity-70" />
                        <h4 className="text-xs font-black text-white uppercase">
                          Standard Biometric Document
                        </h4>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {openedDateScan.originalFileName}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between pt-1">
                    <span>Document: {openedDateScan.documentId}</span>
                    <span>Format: {openedDateScan.originalFileMime || 'Image/Data'}</span>
                  </div>
                </div>

                {/* RIGHT: Complete Extracted Biometric Parameters Table for this Date */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#7E22CE]" /> Extracted Biometrics ({openedDateScan.scanDate})
                    </span>
                    <span className="text-[11px] font-mono text-[#7E22CE] font-bold">
                      {openedDateScan.scanType}
                    </span>
                  </div>

                  {/* Primary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Weight</span>
                      <span className="text-lg font-black text-gray-900">
                        {openedDateScan.weight ? `${openedDateScan.weight} kg` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Body Fat %</span>
                      <span className="text-lg font-black text-[#7E22CE]">
                        {openedDateScan.bodyFatPct ? `${openedDateScan.bodyFatPct}%` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Muscle Mass</span>
                      <span className="text-lg font-black text-emerald-700">
                        {openedDateScan.muscleMass ? `${openedDateScan.muscleMass} kg` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Fat Mass</span>
                      <span className="text-lg font-black text-gray-900">
                        {openedDateScan.fatMass ? `${openedDateScan.fatMass} kg` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">FFM (Fat-Free)</span>
                      <span className="text-lg font-black text-gray-900">
                        {openedDateScan.ffm ? `${openedDateScan.ffm} kg` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">BMI</span>
                      <span className="text-lg font-black text-gray-900">
                        {openedDateScan.bmi ?? '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Visceral Fat Level</span>
                      <span className="text-lg font-black text-amber-700">
                        {openedDateScan.visceralFat ?? '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">BMR</span>
                      <span className="text-lg font-black text-gray-900">
                        {openedDateScan.bmr ? `${openedDateScan.bmr} kcal` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">TBW (Total Water)</span>
                      <span className="text-lg font-black text-blue-700">
                        {openedDateScan.tbw ? `${openedDateScan.tbw} kg` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">ECW / ICW</span>
                      <span className="text-base font-black text-gray-900">
                        {openedDateScan.ecw ? `${openedDateScan.ecw}` : '—'} / {openedDateScan.icw ? `${openedDateScan.icw}` : '—'} kg
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">SMM (Skeletal Muscle)</span>
                      <span className="text-lg font-black text-emerald-800">
                        {openedDateScan.skeletalMuscleMass ? `${openedDateScan.skeletalMuscleMass} kg` : '—'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Metabolic Age</span>
                      <span className="text-lg font-black text-gray-900">
                        {openedDateScan.metabolicAge ? `${openedDateScan.metabolicAge} yrs` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Segmental Muscle Partitioning if present */}
                  {openedDateScan.segmentalMuscle && (
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                        Segmental Muscle Distribution ({openedDateScan.scanDate}):
                      </span>
                      <div className="grid grid-cols-5 gap-2 text-center text-xs">
                        {Object.entries(openedDateScan.segmentalMuscle).map(([k, v]) => (
                          <div key={k} className="p-2 rounded-lg bg-white border border-gray-200">
                            <span className="text-[9px] text-gray-400 uppercase font-mono block">{k}</span>
                            <span className="font-black text-emerald-800">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clinical Profile Evaluation */}
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 font-medium">
                    <span className="font-black uppercase tracking-wide text-[#7E22CE] block text-[10px]">
                      Clinical Interpretation:
                    </span>
                    <span>{openedDateScan.bodyProfile || 'Validated Body Composition Record stored in patient vault.'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer: Date switcher & Close */}
            <div className="p-4 border-t bg-gray-50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {prevDateScan && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenedDateScan(prevDateScan);
                      setImageZoomLevel(1);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Date ({prevDateScan.scanDate})</span>
                  </button>
                )}

                {nextDateScan && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenedDateScan(nextDateScan);
                      setImageZoomLevel(1);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Date ({nextDateScan.scanDate})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openedDateScan) {
                      handleDeleteScan(openedDateScan.id);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Delete this date record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpenedDateScan(null)}
                  className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Close Date View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
