import React, { useState, useRef } from 'react';
import {
  GeneralInfo,
  ExtractedPatientDossier,
  MajorDomainId,
  SymptomAssessmentItem,
  MedicalHistory,
} from '../types';
import { ClinicalReportDocument } from './ReportsUploadSection';
import { BiomarkerItem } from './MedicalRecordsDirectoryAndViewer';
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  Search,
  Plus,
  Trash2,
  Folder,
  Eye,
  Activity,
  Heart,
  Dna,
  FileSpreadsheet,
  Layers,
  FlaskConical,
  Download,
  FileDown,
  Printer,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  downloadPatientDetailsFile,
  generateMnPrescriptionPdf,
  PatientExportData,
  MnPrescriptionPdfData,
} from '../utils/pdfGenerator';
import { DomainSelectorSection } from './DomainSelectorSection';
import { SymptomsAssessmentSection } from './SymptomsAssessmentSection';
import { MedicalHistorySection } from './MedicalHistorySection';
import { majorDomainsData } from '../data/initialData';
import { ParentMedicalHistorySection } from './ParentMedicalHistorySection';
import { ReportsUploadSection } from './ReportsUploadSection';
import { UploadFolderSection } from './UploadFolderSection';
import { ReportPreviewModal } from './ReportPreviewModal';
import { ZiathlonEmblemLogo } from './ZiathlonEmblemLogo';

export interface PrescriptionLabTest {
  id: string;
  testName: string;
  category: 'Blood Test' | 'Lipid Profile' | 'Urine Test' | 'Endocrine' | 'Metabolic';
  fastingRequired: boolean;
  frequency: string;
  clinicalInstructions: string;
  status: 'Ordered' | 'Pending Lab' | 'Completed';
}

const DEFAULT_PRESCRIPTION_TESTS: PrescriptionLabTest[] = [
  {
    id: 'test-1',
    testName: 'Complete Blood Count (CBC) with ESR',
    category: 'Blood Test',
    fastingRequired: false,
    frequency: 'Baseline',
    clinicalInstructions: 'Rule out latent anemia, subclinical inflammation, and leukocyte shift.',
    status: 'Ordered',
  },
  {
    id: 'test-2',
    testName: 'Lipid Profile (Total Cholesterol, Triglycerides, HDL, LDL, VLDL)',
    category: 'Lipid Profile',
    fastingRequired: true,
    frequency: 'Every 8 Weeks',
    clinicalInstructions: '12-hour strict overnight fast. Evaluate Atherogenic Index of Plasma (AIP).',
    status: 'Ordered',
  },
  {
    id: 'test-3',
    testName: 'Complete Urine Analysis (Urine Routine & Microscopy)',
    category: 'Urine Test',
    fastingRequired: false,
    frequency: 'Baseline',
    clinicalInstructions: 'First morning mid-stream clean catch. Screen for microalbuminuria, proteinuria & ketone bodies.',
    status: 'Ordered',
  },
  {
    id: 'test-4',
    testName: 'Glycated Hemoglobin (HbA1c) & Fasting Plasma Glucose',
    category: 'Metabolic',
    fastingRequired: true,
    frequency: 'Every 90 Days',
    clinicalInstructions: 'Evaluate long-term 90-day mean glucose control & glycation rate.',
    status: 'Ordered',
  },
  {
    id: 'test-5',
    testName: 'Comprehensive Thyroid Profile (FT3, FT4, Sensitive TSH)',
    category: 'Endocrine',
    fastingRequired: true,
    frequency: 'Baseline',
    clinicalInstructions: 'Morning sample before 9:00 AM before any thyroid hormone ingestion.',
    status: 'Ordered',
  },
];

interface ProfileSectionProps {
  generalInfo: GeneralInfo;
  onChange: (updated: Partial<GeneralInfo>) => void;
  selectedDomain: MajorDomainId;
  onSelectDomain: (domain: MajorDomainId) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  symptoms: SymptomAssessmentItem[];
  onUpdateSymptom: (id: string, updated: Partial<SymptomAssessmentItem>) => void;
  onAddSymptom: () => void;
  onDeleteSymptom: (id: string) => void;
  onUpdateAllSymptoms?: (symptoms: SymptomAssessmentItem[]) => void;
  medicalHistory: MedicalHistory;
  onUpdateMedicalHistory: (field: keyof MedicalHistory, value: any) => void;
  onBackToMainFolders?: () => void;
  onNavigateToClientFolder?: () => void;
  onLoadExtractedDossier?: (dossier: ExtractedPatientDossier) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  generalInfo,
  onChange,
  selectedDomain,
  onSelectDomain,
  selectedCategory,
  onSelectCategory,
  symptoms,
  onUpdateSymptom,
  onAddSymptom,
  onDeleteSymptom,
  onUpdateAllSymptoms,
  medicalHistory,
  onUpdateMedicalHistory,
  onBackToMainFolders,
  onNavigateToClientFolder,
  onLoadExtractedDossier,
}) => {
  // 7 Sub-folders of Profile as requested:
  // 1. DEMOGRAPHICS FOLDER
  // 2. DISEASE DOMAIN FOLDER
  // 3. SYMPTOMS FOLDER
  // 4. MEDICAL HISTORY FOLDER
  // 5. PARENT HISTORY FOLDER
  // 6. UPLOAD FOLDER
  // 7. PRESCRIPTION (Blood Test, Lipid Profile Test, Urine Test, etc.)
  const subfolderOrder = ['demographics', 'disease-domain', 'symptoms', 'medical-history', 'parent-history', 'upload', 'prescription'] as const;
  const [activeProfileSubfolder, setActiveProfileSubfolder] = useState<
    typeof subfolderOrder[number]
  >('demographics');

  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [showTagOptions, setShowTagOptions] = useState(false);

  // Upload files state in Demographics with permanent storage references
  const [demographicsUploads, setDemographicsUploads] = useState<ClinicalReportDocument[]>(() => {
    try {
      const stored = localStorage.getItem('ziathlon_uploaded_reports');
      if (stored) {
        const parsed: any[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => {
            const permanentId = item.id;
            const fileUrl = (!item.fileUrl || item.fileUrl.startsWith('blob:'))
              ? `/api/documents/${permanentId}/preview`
              : item.fileUrl;
            const downloadUrl = (!item.downloadUrl || item.downloadUrl.startsWith('blob:'))
              ? `/api/documents/${permanentId}/download`
              : item.downloadUrl;
            return {
              ...item,
              fileUrl,
              downloadUrl,
            };
          });
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [previewReport, setPreviewReport] = useState<ClinicalReportDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prescription Lab Tests State
  const [labTests, setLabTests] = useState<PrescriptionLabTest[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_PRESCRIPTION_LAB_TESTS');
      if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_PRESCRIPTION_TESTS;
  });

  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState<PrescriptionLabTest['category']>('Blood Test');

  // Handle DOB Change & Automatic Age calculation
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    const updates: Partial<GeneralInfo> = { dateOfBirth: dobValue };

    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      if (!isNaN(birthDate.getTime())) {
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge >= 0 && calculatedAge < 125) {
          updates.age = calculatedAge;
        }
      }
    }
    onChange(updates);
  };

  // Upload file handler - robust against network failures with local object URL fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const isImg = ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'].includes(ext) || file.type.startsWith('image/');
    const tempId = `DOC-${Date.now()}`;
    let finalDocId = tempId;

    // Read file as persistent base64 data URL
    let dataUrl = '';
    try {
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve((event.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    } catch {}

    let finalFileUrl = dataUrl || URL.createObjectURL(file);
    let finalDownloadUrl = finalFileUrl;
    let detectedMime = file.type || (isImg ? 'image/jpeg' : (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'));
    let pageCount = 1;
    let sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    let extractedBiomarkers: any[] = [];
    let reportAnalysisSummary = '';

    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.document) {
            finalDocId = data.document.id;
            if (!dataUrl) {
              finalFileUrl = `/api/documents/${data.document.id}/preview`;
              finalDownloadUrl = `/api/documents/${data.document.id}/download`;
            }
            detectedMime = data.document.mimetype || detectedMime;
            pageCount = data.document.pageCount || 1;
            sizeFormatted = data.document.sizeFormatted || sizeFormatted;
          }
        }
      }
    } catch (err) {
      console.warn('Server upload fetch failed, using robust local data URL fallback:', err);
    }

    // Trigger Dynamic Blood Report & Pathology Analysis
    try {
      const analyzeRes = await fetch('/api/analyze-blood-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: finalDocId,
          fileBase64: dataUrl,
          mimeType: detectedMime,
          fileName: file.name,
        })
      });
      if (analyzeRes.ok) {
        const analyzeData = await analyzeRes.json();
        if (analyzeData.success && Array.isArray(analyzeData.biomarkers) && analyzeData.biomarkers.length > 0) {
          extractedBiomarkers = analyzeData.biomarkers;
          reportAnalysisSummary = analyzeData.criticalFindingsSummary || '';
        }
      }
    } catch (e) {
      console.warn('Dynamic blood report analysis deferred to view time:', e);
    }

    const newUpload: any = {
      id: finalDocId,
      name: file.name,
      type: `${ext} Document`,
      mimetype: detectedMime,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: sizeFormatted,
      keyBiomarkers: extractedBiomarkers,
      biomarkers: extractedBiomarkers,
      clinicalSummary: reportAnalysisSummary || 'Uploaded original patient document.',
      fileUrl: finalFileUrl,
      downloadUrl: finalDownloadUrl,
      thumbnailUrl: dataUrl || finalFileUrl,
      pageCount,
      rawFile: file,
    };

    setDemographicsUploads((prev) => {
      const updated = [newUpload, ...prev.filter(p => p.id !== finalDocId)];
      try {
        // Persist without non-serializable object handles
        const cleanToSave = updated.map(({ rawFile, ...rest }: any) => rest);
        localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(cleanToSave));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      return updated;
    });

    // Automatically sync into Medical Folder (ZIATHLON_MEDICAL_RECORDS)
    try {
      const existingMedicalRecordsRaw = localStorage.getItem('ZIATHLON_MEDICAL_RECORDS');
      let currentGroups: any[] = existingMedicalRecordsRaw ? JSON.parse(existingMedicalRecordsRaw) : [];
      if (!Array.isArray(currentGroups)) {
        currentGroups = [];
      }
      
      const currentMonthGroup = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
      let targetGroup = currentGroups.find(g => g.group.toUpperCase() === currentMonthGroup);
      if (!targetGroup) {
        targetGroup = { group: currentMonthGroup, items: [] };
        currentGroups.unshift(targetGroup);
      }

      const formattedDateStr =
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
        " '" +
        new Date().getFullYear().toString().slice(-2);

      const medicalRecordItem = {
        id: finalDocId,
        dateStr: formattedDateStr,
        title: 'Lab Report',
        smartBadge: 'Smart',
        tag: 'No Tag added',
        category: isImg ? 'Clinical Photo / Document Scan' : `Patient Medical Record (${sizeFormatted})`,
        thumbnailType: isImg ? 'image' : 'doc',
        thumbnailSvgType: ext === 'PDF' ? 'blood' : 'metabolic',
        thumbnailUrl: dataUrl || finalFileUrl,
        fileUrl: finalFileUrl,
        downloadUrl: finalDownloadUrl,
        fileName: file.name,
        biomarkers: extractedBiomarkers,
      };

      targetGroup.items = [medicalRecordItem, ...targetGroup.items.filter((it: any) => it.id !== finalDocId)];
      localStorage.setItem('ZIATHLON_MEDICAL_RECORDS', JSON.stringify(currentGroups));

      // Also set as active uploaded report URL in Medical Folder Specimen View
      localStorage.setItem('ELSHA_UPLOADED_REPORT_URL', finalFileUrl);
      localStorage.setItem('ELSHA_UPLOADED_FILE_NAME', file.name);

      // Dispatch cross-component event so Medical Folder immediately updates
      window.dispatchEvent(new CustomEvent('ziathlon-medical-record-added', { detail: medicalRecordItem }));
      window.dispatchEvent(new Event('storage'));
    } catch (syncErr) {
      console.warn('Failed to auto-sync document to medical records:', syncErr);
    }

    setSavedNotification(`✓ Saved & attached to Medical Folder: ${file.name}`);
    setTimeout(() => setSavedNotification(null), 4000);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save to History / Client Dossier Folder
  const handleSaveToClientHistory = () => {
    const code = `ZIA-2026-${(generalInfo.name || 'PAT').slice(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newClientFolder = {
      id: `folder-${Date.now()}`,
      clientCode: code,
      name: generalInfo.name || 'New Patient',
      age: generalInfo.age || 35,
      gender: generalInfo.sex || 'Female',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      primaryCondition: generalInfo.tag || generalInfo.customTag || 'Metabolic Health',
      status: 'Active Consultation',
      folderNotes: `Phone: ${generalInfo.phone || 'N/A'} | Email: ${generalInfo.email || 'N/A'} | Referral: ${generalInfo.referralSource || 'Direct'} | Address: ${generalInfo.place || 'N/A'}, Pincode: ${generalInfo.pincode || 'N/A'}.`,
    };

    try {
      const existing = localStorage.getItem('ziathlon_client_folders');
      const folders = existing ? JSON.parse(existing) : [];
      localStorage.setItem('ziathlon_client_folders', JSON.stringify([newClientFolder, ...folders]));
    } catch (e) {
      console.error(e);
    }

    setSavedNotification(`Saved ${generalInfo.name || 'Client'} to History & Client Dossier Folder [${code}]!`);
    setTimeout(() => setSavedNotification(null), 3500);
  };

  // Add Prescription Test
  const handleAddLabTest = () => {
    if (!newTestName.trim()) return;
    const newTest: PrescriptionLabTest = {
      id: `test-${Date.now()}`,
      testName: newTestName.trim(),
      category: newTestCategory,
      fastingRequired: newTestCategory === 'Blood Test' || newTestCategory === 'Lipid Profile',
      frequency: 'Baseline',
      clinicalInstructions: 'Fasting or random as per protocol specification.',
      status: 'Ordered',
    };
    const updated = [...labTests, newTest];
    setLabTests(updated);
    try {
      localStorage.setItem('ELSHA_PRESCRIPTION_LAB_TESTS', JSON.stringify(updated));
    } catch {}
    setNewTestName('');
  };

  const handleDeleteLabTest = (id: string) => {
    const updated = labTests.filter((t) => t.id !== id);
    setLabTests(updated);
    try {
      localStorage.setItem('ELSHA_PRESCRIPTION_LAB_TESTS', JSON.stringify(updated));
    } catch {}
  };

  const [showPatientDownloadMenu, setShowPatientDownloadMenu] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Download Patient Details (JSON / CSV / PDF)
  const handleDownloadPatientDetails = (format: 'json' | 'csv' | 'pdf') => {
    setShowPatientDownloadMenu(false);
    setSavedNotification(`Exporting Patient Details (${format.toUpperCase()})...`);
    try {
      const height = Number(generalInfo.height) || 162;
      const weight = Number(generalInfo.weight) || 66;
      const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
      const bmr = Math.round(10 * weight + 6.25 * height - 5 * (Number(generalInfo.age) || 30) + (generalInfo.sex === 'Male' ? 5 : -161));
      const tdee = Math.round(bmr * 1.55);

      const exportData: PatientExportData = {
        generalInfo,
        calculations: {
          bmi,
          bmiCategory: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese',
          bmr,
          tdee,
          targetCalories: Math.round(tdee - 500),
          dailyDeficit: 500,
          macros: {
            protein: { grams: 110, calories: 440, percentage: 30 },
            carbs: { grams: 140, calories: 560, percentage: 40 },
            fat: { grams: 50, calories: 450, percentage: 30 },
          },
          waterRequirement: 2.8,
          idealWeight: 58,
          leanMass: 48,
          fatMass: 18,
        },
        medicalHistory,
        selectedDomain,
        selectedCategory,
      };
      const downloadedFilename = downloadPatientDetailsFile(exportData, format);
      setSavedNotification(`✓ Patient Details Downloaded: ${downloadedFilename}`);
      setTimeout(() => setSavedNotification(null), 4000);
    } catch (e) {
      console.error('Error downloading patient details:', e);
      setSavedNotification('Error downloading patient details.');
      setTimeout(() => setSavedNotification(null), 3500);
    }
  };

  // Export MN Prescription directly to 2-Page PDF
  const handleExportMnPrescriptionPdf = () => {
    setIsExportingPdf(true);
    setSavedNotification('Generating Official 2-Page MN Prescription PDF...');
    try {
      const height = Number(generalInfo.height) || 162;
      const weight = Number(generalInfo.weight) || 66;
      const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
      const bmr = Math.round(10 * weight + 6.25 * height - 5 * (Number(generalInfo.age) || 30) + (generalInfo.sex === 'Male' ? 5 : -161));
      const tdee = Math.round(bmr * 1.55);

      const pdfData: MnPrescriptionPdfData = {
        patient: {
          name: generalInfo.name || 'Kiruthika',
          age: generalInfo.age || 38,
          gender: generalInfo.sex || 'Female',
          dateOfBirth: generalInfo.dateOfBirth || '14-May-1988',
          phone: generalInfo.phone || '+91 98765 43210',
          email: generalInfo.email || 'patient@ziathlon.clinic',
          address: generalInfo.address || generalInfo.place || 'Chennai, Tamil Nadu',
          pincode: generalInfo.pincode || '600001',
          tag: generalInfo.tag || generalInfo.customTag || selectedCategory || 'Metabolic Health (T2D)',
          referral: generalInfo.referralSource || 'Instagram',
          patientId: `ZIA-MN-RX-${String(generalInfo.name || 'PAT').slice(0, 4).toUpperCase()}-2026`,
        },
        anthropometrics: {
          height,
          weight,
          bmi,
          bmiCategory: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese',
          visceralFat: generalInfo.visceralFat || 11,
          bmr,
          tdee,
          muscleMass: generalInfo.muscleMass,
          fatPercentage: generalInfo.fatPercentage,
        },
        laboratoryTests: labTests.map((t) => ({ testName: t.testName, description: `${t.category} • ${t.clinicalInstructions}` })),
      };

      const filename = generateMnPrescriptionPdf(pdfData);
      setSavedNotification(`✓ Successfully Exported: ${filename}`);
      setTimeout(() => setSavedNotification(null), 4000);
    } catch (e) {
      console.error(e);
      setSavedNotification('Error exporting MN Prescription PDF.');
      setTimeout(() => setSavedNotification(null), 3500);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const subfolders = [
    { id: 'demographics', number: '1', title: 'Demographics', label: 'DEMOGRAPHICS', desc: 'Name, DOB, Tag, Referral, Uploads', icon: User },
    { id: 'disease-domain', number: '2', title: 'Disease Domain', label: 'DISEASE DOMAIN', desc: 'Clinical Domain & Category', icon: Layers },
    { id: 'symptoms', number: '3', title: 'Symptoms', label: 'SYMPTOMS', desc: 'Symptom Checklist & Severity', icon: Activity },
    { id: 'medical-history', number: '4', title: 'Medical History', label: 'MEDICAL HISTORY', desc: 'Past Illnesses & Medications', icon: Heart },
    { id: 'parent-history', number: '5', title: 'Parent History', label: 'PARENT HISTORY', desc: 'Familial Genetics & Lineage', icon: Dna },
    { id: 'upload', number: '6', title: 'Upload Folder', label: 'UPLOAD FOLDER', desc: 'Medical Scans & Lab Reports', icon: UploadCloud },
    { id: 'prescription', number: '7', title: 'Prescription', label: 'PRESCRIPTION', desc: 'Blood, Lipid & Urine Tests', icon: FlaskConical },
  ];

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-2 space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e071c] border-2 border-[#7E22CE] shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-0.5">
                Patient Clinical Profile Suite
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export MN Prescription PDF */}
          <button
            type="button"
            onClick={handleExportMnPrescriptionPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 rounded-xl bg-purple-900/60 border border-purple-500 hover:bg-purple-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
            title="Export MN Prescription directly to PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-purple-300" />
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Export MN Prescription (PDF)'}</span>
          </button>

          {/* Download Patient Details Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPatientDownloadMenu(!showPatientDownloadMenu)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.4)] cursor-pointer transition-all"
              title="Download all patient demographics, vitals and records"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Patient Details</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>

            {showPatientDownloadMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#130924] border-2 border-purple-600 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-purple-300 tracking-wider border-b border-purple-800/60">
                  Select Download Format
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadPatientDetails('json')}
                  className="w-full text-left px-3 py-2 hover:bg-purple-900/60 text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <span className="font-bold block">Patient Details (JSON)</span>
                    <span className="text-[10px] text-gray-400 block">Complete raw profile, vitals & history</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPatientDetails('csv')}
                  className="w-full text-left px-3 py-2 hover:bg-purple-900/60 text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <span className="font-bold block">Patient Summary (CSV)</span>
                    <span className="text-[10px] text-gray-400 block">Spreadsheet matrix of demographics</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPatientDetails('pdf')}
                  className="w-full text-left px-3 py-2 hover:bg-purple-900/60 text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-purple-300" />
                  <div>
                    <span className="font-bold block">Patient Record (PDF)</span>
                    <span className="text-[10px] text-gray-400 block">Official clinical record document</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Full-Screen Workspace: Corner Navigation + Large Opposite Canvas */}
      <div className="flex flex-col lg:flex-row items-start gap-5 w-full">
        {/* Corner Subfolders Navigation List (Corner of Full Screen) */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0 flex flex-col gap-2 no-print lg:sticky lg:top-14">
          <div className="px-3.5 py-2.5 rounded-xl bg-[#120824] text-[11px] font-mono font-black uppercase tracking-widest text-[#C084FC] border border-purple-800/80 flex items-center justify-between shadow-md">
            <span>PROFILE FOLDER</span>
            <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-900/80 text-purple-200 font-bold">CORNER</span>
          </div>
          {subfolders.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProfileSubfolder === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveProfileSubfolder(tab.id as any)}
                className={`w-full px-4 py-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between font-black tracking-wider text-xs ${
                  isActive
                    ? 'bg-[#7E22CE] text-white border-white shadow-[0_0_18px_rgba(126,34,206,0.6)] scale-[1.02]'
                    : 'bg-[#0f0722] hover:bg-[#1f0d38] text-gray-300 border-purple-900/60 hover:border-[#7E22CE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C084FC]'}`} />
                  <span className="flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    {tab.id === 'parent-history' && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/40 text-white text-[10px] font-black border border-purple-400/50">
                        + ADD
                      </span>
                    )}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white translate-x-1' : 'text-purple-400 opacity-60'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Opposite Segment: Expansive Large Workspace Area */}
        <div className="flex-1 min-w-0 w-full space-y-4 relative">
          {/* Medical Record Corner Badge */}
          <div className="absolute top-3 right-4 z-20 hidden sm:flex items-center gap-2 bg-[#130727]/90 px-3 py-1.5 rounded-xl border border-purple-500/50 shadow-md pointer-events-none select-none">
            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 block font-sans">
                ZIATHLON MEDICAL RECORD
              </span>
              <span className="text-[8px] font-mono text-purple-400 block uppercase">
                {activeProfileSubfolder.replace('-', ' ')}
              </span>
            </div>
            <ZiathlonEmblemLogo size={28} />
          </div>

      {/* ========================================================================= */}
      {/* 1. DEMOGRAPHICS FOLDER (Exact specification with Tag, Referral, Uploads)  */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'demographics' && (
        <div className="p-6 rounded-2xl bg-[#0d0617] border-2 border-[#7E22CE] shadow-2xl space-y-6">
          <div className="border-b border-purple-900/60 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mt-0.5">
                Patient Demographics & Identification
              </h3>
            </div>
            <button
              type="button"
              onClick={handleSaveToClientHistory}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save to Client Folder / History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* NAME */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Name <span className="text-purple-400">*</span>:
              </label>
              <input
                type="text"
                value={generalInfo.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Full Name"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* AGE */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Age:
              </label>
              <input
                type="number"
                value={generalInfo.age || ''}
                onChange={(e) => onChange({ age: Number(e.target.value) || 0 })}
                placeholder="Age in Years"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* SEX */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Sex:
              </label>
              <select
                value={generalInfo.sex || 'Female'}
                onChange={(e) => onChange({ sex: e.target.value as any })}
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-[#7E22CE]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DOB (Auto Calculates Age) */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Date of Birth (DOB):
              </label>
              <input
                type="date"
                value={generalInfo.dateOfBirth || ''}
                onChange={handleDobChange}
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* TAG_BOX */}
            <div className="lg:col-span-2 relative">
              <label className="text-xs font-black uppercase tracking-wider text-purple-300 block mb-1">
                TAG_BOX:
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="patient-tag-input"
                  value={generalInfo.tag || generalInfo.customTag || ''}
                  onChange={(e) => onChange({ tag: e.target.value, customTag: e.target.value })}
                  onFocus={() => setShowTagOptions(true)}
                  onClick={() => setShowTagOptions(true)}
                  placeholder="TAG_BOX (Type or touch to select options)"
                  className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                />
                <button
                  type="button"
                  onClick={() => setShowTagOptions(!showTagOptions)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xs font-mono px-2 py-1 bg-purple-950/60 rounded border border-purple-800 cursor-pointer"
                >
                  {showTagOptions ? '▲ Close' : '▼ Options'}
                </button>
              </div>

              {/* Options shown when touched or clicked */}
              {showTagOptions && (
                <div className="mt-2 p-2.5 bg-[#0f0722] border border-[#7E22CE] rounded-xl shadow-2xl flex flex-wrap items-center gap-2 z-20">
                  <span className="text-[10px] font-mono uppercase text-purple-300 mr-1">Select Tag:</span>
                  {[
                    'Metabolic Health',
                    'Gut Health',
                    'Musculoskeletal Health',
                    'Endocrine Health',
                    'Sports Medicine',
                    'Cardiovascular Health',
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange({ tag: option, customTag: option });
                        setShowTagOptions(false);
                      }}
                      className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#1e0e38] text-purple-200 border border-purple-700 hover:bg-[#7E22CE] hover:text-white transition-colors cursor-pointer"
                    >
                      {option}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowTagOptions(false)}
                    className="ml-auto text-[10px] text-gray-400 hover:text-white cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* REFERAL _ _______ */}
            <div className="lg:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-purple-300 block mb-1">
                REFERAL _ _______
              </label>
              <input
                type="text"
                id="patient-referral-input"
                value={generalInfo.referralSource || generalInfo.referral || ''}
                onChange={(e) => onChange({ referralSource: e.target.value, referral: e.target.value })}
                placeholder="REFERAL _ _______ (Type lines here)"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white text-xs font-mono focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* ADDRESS */}
            <div className="lg:col-span-2">
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Address / City / Place:
              </label>
              <input
                type="text"
                value={generalInfo.place || ''}
                onChange={(e) => onChange({ place: e.target.value })}
                placeholder="Residential Address & City"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Phone:
              </label>
              <input
                type="tel"
                value={generalInfo.phone || ''}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+91 98400 12345"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* PINCODE */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Pincode:
              </label>
              <input
                type="text"
                value={generalInfo.pincode || ''}
                onChange={(e) => onChange({ pincode: e.target.value })}
                placeholder="600001"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* EMAIL */}
            <div className="lg:col-span-2">
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Email Address:
              </label>
              <input
                type="email"
                value={generalInfo.email || ''}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* MARITAL STATUS */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Marital Status:
              </label>
              <input
                type="text"
                value={generalInfo.maritalStatus || ''}
                onChange={(e) => onChange({ maritalStatus: e.target.value })}
                placeholder="Married / Single"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* INFORMANT */}
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Name of Informant:
              </label>
              <input
                type="text"
                value={generalInfo.informantName || ''}
                onChange={(e) => onChange({ informantName: e.target.value })}
                placeholder="Informant Name"
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#7E22CE]"
              />
            </div>

            {/* VITALS SECTION */}
            <div className="lg:col-span-4 pt-4 border-t border-purple-900/60 mt-2">
              <h4 className="text-[11px] font-black text-purple-300 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                <span>Vital Signs Assessment</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Body Temp:</label>
                  <input
                    type="text"
                    value={generalInfo.bodyTemperature || ''}
                    onChange={(e) => onChange({ bodyTemperature: e.target.value })}
                    placeholder="98.6°F"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Pulse Rate:</label>
                  <input
                    type="text"
                    value={generalInfo.pulseRate || ''}
                    onChange={(e) => onChange({ pulseRate: e.target.value })}
                    placeholder="72 bpm"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Blood Pressure:</label>
                  <input
                    type="text"
                    value={generalInfo.bloodPressure || ''}
                    onChange={(e) => onChange({ bloodPressure: e.target.value })}
                    placeholder="120/80 mmHg"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">SpO2 %:</label>
                  <input
                    type="text"
                    value={generalInfo.spo2 || ''}
                    onChange={(e) => onChange({ spo2: e.target.value })}
                    placeholder="98%"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Waist Circ:</label>
                  <input
                    type="number"
                    value={generalInfo.waistCircumference || ''}
                    onChange={(e) => onChange({ waistCircumference: Number(e.target.value) })}
                    placeholder="cm"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Hip Circ:</label>
                  <input
                    type="number"
                    value={generalInfo.hipCircumference || ''}
                    onChange={(e) => onChange({ hipCircumference: Number(e.target.value) })}
                    placeholder="cm"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Weight (kg):</label>
                  <input
                    type="number"
                    value={generalInfo.weight || ''}
                    onChange={(e) => onChange({ weight: Number(e.target.value) })}
                    placeholder="kg"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Height (cm):</label>
                  <input
                    type="number"
                    value={generalInfo.height || ''}
                    onChange={(e) => onChange({ height: Number(e.target.value) })}
                    placeholder="cm"
                    className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* UPLOAD THE FILES (PREVIOUS REPORT LA UPLOAD PANNANUM)                      */}
          {/* ========================================================================= */}
          <div className="pt-4 border-t border-purple-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Upload the Files (Previous Reports & Medical Records)
                </h4>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#7E22CE] text-white hover:bg-[#9333EA] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <UploadCloud className="w-4 h-4" />
                <span>+ Upload Previous Report</span>
              </button>
            </div>

            {/* Uploaded files listing (Full Document Cards with File Icon, Name, Type, Size, Date, VIEW, DOWNLOAD, DELETE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {demographicsUploads.map((file) => {
                const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                const isPdf = ext === 'PDF';
                const isImg = ['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext);
                const isSheet = ['CSV', 'XLS', 'XLSX'].includes(ext);

                return (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-xl bg-black/70 border border-purple-800/60 flex flex-col justify-between gap-3 text-xs shadow-md hover:border-[#7E22CE] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-700/60 shrink-0">
                        {isPdf ? (
                          <FileText className="w-5 h-5 text-rose-400" />
                        ) : isImg ? (
                          <Layers className="w-5 h-5 text-indigo-400" />
                        ) : isSheet ? (
                          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-[#C084FC]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white block truncate text-xs" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-purple-900/60 text-purple-200 border border-purple-700/50">
                            {file.type || `${ext} Document`}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {file.fileSize}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            • {file.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
                      <button
                        type="button"
                        onClick={() => setPreviewReport(file)}
                        className="px-2.5 py-1 bg-purple-900/50 hover:bg-[#7E22CE] text-purple-200 hover:text-white rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>VIEW</span>
                      </button>

                      <a
                        href={(file as any).downloadUrl || (file as any).fileUrl || `/api/documents/${file.id}/download`}
                        download={file.name}
                        className="px-2.5 py-1 bg-black/60 hover:bg-purple-950 text-purple-300 hover:text-white border border-purple-800/60 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = demographicsUploads.filter((f) => f.id !== file.id);
                          setDemographicsUploads(updated);
                          try {
                            localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(updated));
                            // Also remove from ZIATHLON_MEDICAL_RECORDS
                            const rawMed = localStorage.getItem('ZIATHLON_MEDICAL_RECORDS');
                            if (rawMed) {
                              const medGroups = JSON.parse(rawMed);
                              const cleanedMed = medGroups.map((g: any) => ({
                                ...g,
                                items: (g.items || []).filter((it: any) => it.id !== file.id)
                              })).filter((g: any) => g.items.length > 0);
                              localStorage.setItem('ZIATHLON_MEDICAL_RECORDS', JSON.stringify(cleanedMed));
                            }
                            window.dispatchEvent(new Event('storage'));
                          } catch {}
                        }}
                        className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-all cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {previewReport && (
            <ReportPreviewModal
              report={previewReport}
              onClose={() => setPreviewReport(null)}
            />
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-purple-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToClientHistory}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to History & Client Dossier</span>
              </button>

              <button
                type="button"
                onClick={handleExportMnPrescriptionPdf}
                disabled={isExportingPdf}
                className="px-4 py-2.5 rounded-xl bg-purple-900/70 border border-purple-500 hover:bg-purple-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <FileDown className="w-4 h-4 text-purple-300" />
                <span>Export MN Prescription (PDF)</span>
              </button>
            </div>

            {onNavigateToClientFolder && (
              <button
                type="button"
                onClick={onNavigateToClientFolder}
                className="px-4 py-2.5 rounded-xl bg-black border border-purple-800 text-purple-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in Client Folder (Search & Re-Edit)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DISEASE DOMAIN FOLDER                                                  */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'disease-domain' && (
        <DomainSelectorSection
          domains={majorDomainsData}
          selectedDomain={selectedDomain}
          onSelectDomain={onSelectDomain}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. SYMPTOMS FOLDER                                                        */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'symptoms' && (
        <SymptomsAssessmentSection
          symptoms={symptoms}
          domainName={selectedDomain}
          categoryName={selectedCategory}
          onUpdateSymptom={onUpdateSymptom}
          onAddSymptom={onAddSymptom}
          onDeleteSymptom={onDeleteSymptom}
          onUpdateAllSymptoms={onUpdateAllSymptoms}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. MEDICAL HISTORY FOLDER                                                 */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'medical-history' && (
        <MedicalHistorySection
          medicalHistory={medicalHistory}
          onUpdateMedicalHistory={onUpdateMedicalHistory}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. PARENT HISTORY FOLDER                                                  */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'parent-history' && (
        <ParentMedicalHistorySection
          familyHistory={medicalHistory.familyHistory}
          onUpdateFamilyHistory={(items) => onUpdateMedicalHistory('familyHistory', items)}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. UPLOAD FOLDER                                                          */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'upload' && (
        <UploadFolderSection
          generalInfo={generalInfo}
          medicalHistory={medicalHistory}
          onBackToMainFolders={onBackToMainFolders}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. PRESCRIPTION FOLDER (Blood Test, Lipid Profile Test, Urine Test, etc.) */}
      {/* ========================================================================= */}
      {activeProfileSubfolder === 'prescription' && (
        <div className="p-6 rounded-2xl bg-[#0d0617] border-2 border-[#7E22CE] shadow-2xl space-y-6">
          <div className="border-b border-purple-900/60 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mt-0.5">
                Lab Diagnostic Orders & Test Prescriptions
              </h3>
              <p className="text-xs text-gray-400">
                Ordered laboratory investigations including Blood Tests, Lipid Profile, and Urine Analysis.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-mono font-bold">
                {labTests.length} Tests Ordered
              </span>
            </div>
          </div>

          {/* Add New Lab Test */}
          <div className="p-4 rounded-xl bg-black/60 border border-purple-900/60 flex flex-wrap items-end gap-3 text-xs">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                New Lab Test Name:
              </label>
              <input
                type="text"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="e.g. Fasting Serum Insulin, hs-CRP, Vitamin D3..."
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
              />
            </div>
            <div className="w-40">
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Test Category:
              </label>
              <select
                value={newTestCategory}
                onChange={(e) => setNewTestCategory(e.target.value as any)}
                className="w-full bg-black border border-purple-900/80 rounded-lg p-2 text-white focus:outline-none focus:border-[#7E22CE]"
              >
                <option value="Blood Test">Blood Test</option>
                <option value="Lipid Profile">Lipid Profile</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Endocrine">Endocrine</option>
                <option value="Metabolic">Metabolic</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddLabTest}
              className="px-4 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Order</span>
            </button>
          </div>

          {/* Lab Tests Table */}
          <div className="overflow-x-auto rounded-xl border border-purple-900/60 bg-black/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1f0d38] text-[#C084FC] uppercase font-black tracking-wider">
                <tr>
                  <th className="p-3.5">Investigation / Test Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Fasting</th>
                  <th className="p-3.5">Frequency</th>
                  <th className="p-3.5">Clinical Instructions</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/60">
                {labTests.map((t) => (
                  <tr key={t.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-[#C084FC] shrink-0" />
                      <span>{t.testName}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-800 text-[11px] font-bold">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {t.fastingRequired ? (
                        <span className="text-amber-400 font-bold">12-Hr Fast</span>
                      ) : (
                        <span className="text-gray-400">Random / None</span>
                      )}
                    </td>
                    <td className="p-3 text-purple-200">{t.frequency}</td>
                    <td className="p-3 text-gray-300 max-w-xs">{t.clinicalInstructions}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteLabTest(t.id)}
                        className="text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        </div>
      </div>

      {/* Bottom Subfolder Navigation Bar */}
      <div className="pt-6 border-t-2 border-[#7E22CE] flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            const idx = subfolderOrder.indexOf(activeProfileSubfolder);
            if (idx > 0) {
              setActiveProfileSubfolder(subfolderOrder[idx - 1]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (onBackToMainFolders) {
              onBackToMainFolders();
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-purple-50 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-mono font-bold text-gray-500 uppercase">
          Subfolder {subfolderOrder.indexOf(activeProfileSubfolder) + 1} of {subfolderOrder.length}
        </span>

        <button
          type="button"
          onClick={() => {
            const idx = subfolderOrder.indexOf(activeProfileSubfolder);
            if (idx < subfolderOrder.length - 1) {
              setActiveProfileSubfolder(subfolderOrder[idx + 1]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (onNavigateToClientFolder) {
              onNavigateToClientFolder();
            }
          }}
          className="px-6 py-2.5 rounded-xl bg-[#7E22CE] border-2 border-[#7E22CE] text-white hover:bg-[#9333EA] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
