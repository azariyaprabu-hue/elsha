import React, { useState, useEffect, useRef } from 'react';
import {
  GeneralInfo,
  Calculations,
  MedicalHistory,
  MedicinalPrescriptionDrug,
  ClinicalGoalItem,
  DiagnosticFindingItem,
  BloodReportRangeItem,
  SymptomAssessmentItem,
  LifestyleAssessmentItem,
  DailyRoutineItem,
  FoodHabits,
  DietaryRecallItem,
} from '../types';
import { ZiathlonLogo } from './ZiathlonLogo';
import {
  generateMnPrescriptionPdf,
  downloadPatientDetailsFile,
  MnPrescriptionPdfData,
  PatientExportData,
} from '../utils/pdfGenerator';
import { ZiathlonLetterheadHeader } from './ZiathlonLetterheadHeader';
import { OfficialClinicalPrescriptionTable, PrescriptionMedicineItem } from './OfficialClinicalPrescriptionTable';
import { ThreePartMedicalRecordPreview } from './ThreePartMedicalRecordPreview';
import { MedicalRecordsDirectoryAndViewer } from './MedicalRecordsDirectoryAndViewer';
import {
  ArrowLeft,
  FileText,
  Activity,
  Pill,
  Target,
  Stethoscope,
  Download,
  Printer,
  Sparkles,
  Search,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldCheck,
  Calendar,
  User,
  MessageSquare,
  Eye,
  Layers,
  ZoomIn,
  FileDown,
  ChevronDown,
  Check,
  FileSpreadsheet,
  UploadCloud,
  X,
  Save,
  RotateCw,
  MoreVertical,
  Filter,
  Clock,
} from 'lucide-react';

interface MedicinalSectionProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  medicalHistory: MedicalHistory;
  symptoms?: SymptomAssessmentItem[];
  lifestyleItems?: LifestyleAssessmentItem[];
  dailyRoutine?: DailyRoutineItem[];
  foodHabits?: FoodHabits;
  dietaryRecall?: DietaryRecallItem[];
  selectedCategory?: string;
  selectedDomain?: string;
  onBackToMainFolders: () => void;
  themeMode?: string;
  onUpdateGeneralInfo?: (info: Partial<GeneralInfo>) => void;
  onUpdateMedicalHistory?: (field: keyof MedicalHistory, value: any) => void;
  onUpdateSymptoms?: (items: SymptomAssessmentItem[]) => void;
  onUpdateCalculations?: (calc: Partial<Calculations>) => void;
}

const DEFAULT_MEDICINES: MedicinalPrescriptionDrug[] = [
  {
    id: 'med-1',
    medicine: 'Tab. Metformin Hydrochloride (Glycomet-SR)',
    dosage: '500 mg',
    duration: '90 Days (Ongoing)',
    timing: 'Twice daily with meals (Breakfast & Dinner)',
    instructions: 'Take immediately with first bite of meal to avoid gastric irritation. Enhances hepatic insulin sensitivity.',
  },
  {
    id: 'med-2',
    medicine: 'Cap. Berberine Complex (with Piperine)',
    dosage: '500 mg',
    duration: '60 Days',
    timing: 'Once daily before Lunch',
    instructions: 'Activates muscular AMPK pathway and suppresses gluconeogenesis naturally.',
  },
  {
    id: 'med-3',
    medicine: 'Tab. Methylcobalamin + Alpha Lipoic Acid',
    dosage: '1500 mcg + 100 mg',
    duration: '60 Days',
    timing: 'Once daily at Bedtime',
    instructions: 'Protects peripheral nerve conduction and counters metformin-induced B12 depletion.',
  },
];

const DEFAULT_GOALS: ClinicalGoalItem[] = [
  {
    id: 'goal-1',
    type: 'Primary',
    title: 'HbA1c & Fasting Glycemic Control',
    targetDescription: 'Reduce HbA1c from baseline 7.2% to <6.3%; reduce fasting blood sugar from 138 mg/dL to <105 mg/dL without hypoglycemic episodes.',
    targetTimeline: '90 Days (Target: 15-Dec-2026)',
    status: 'In Progress',
  },
  {
    id: 'goal-2',
    type: 'Secondary',
    title: 'Visceral Adiposity & Liver De-steatosis',
    targetDescription: 'Reduce Visceral Fat rating from 11 to ≤8; eliminate subclinical hepatic steatosis through 1,500 kcal deficit & Zone 2 cardio.',
    targetTimeline: '60 Days',
    status: 'Active Target',
  },
  {
    id: 'goal-3',
    type: 'Tertiary',
    title: 'Cardio-Metabolic Lipid Ratio Normalization',
    targetDescription: 'Bring Serum Triglycerides <150 mg/dL (from 195 mg/dL) and normalize atherogenic TG/HDL ratio to <2.5.',
    targetTimeline: '120 Days',
    status: 'In Progress',
  },
];

const DEFAULT_DIAGNOSTICS: DiagnosticFindingItem[] = [
  {
    id: 'diag-1',
    susceptibilityCondition: 'Susceptible to Non-Alcoholic Fatty Liver Disease (NAFLD / MASLD Grade 1)',
    riskLevel: 'High Risk',
    supportingBiomarkers: 'Visceral Fat Rating 11, Serum ALT/SGPT 52 U/L, Fasting Triglycerides 195 mg/dL, Hypertriglyceridemic Waist.',
    clinicalIntervention: 'Hepatoprotective antioxidant protocol, milk thistle extract, dietary choline, and Mediterranean-adapted 1,500 kcal plan.',
    diagnosedDate: '10-Sep-2026',
  },
  {
    id: 'diag-2',
    susceptibilityCondition: 'Susceptible to Type 2 Diabetes Mellitus with Peripheral Insulin Resistance',
    riskLevel: 'High Risk',
    supportingBiomarkers: 'HbA1c 7.2%, Fasting Blood Glucose 138 mg/dL, Postprandial lethargy, Acanthosis Nigricans trace signs.',
    clinicalIntervention: 'Strict glycemic load restriction, sequential fiber pre-loading, post-meal GLUT4 brisk walking, Metformin 500mg SR.',
    diagnosedDate: '10-Sep-2026',
  },
  {
    id: 'diag-3',
    susceptibilityCondition: 'Susceptible to Metabolic Dyslipidemia & Endothelial Shear Stress',
    riskLevel: 'Moderate Risk',
    supportingBiomarkers: 'Total Cholesterol 224 mg/dL, High LDL-C, Mild resting diastolic tension (132/86 mmHg).',
    clinicalIntervention: 'Omega-3 EPA/DHA 1000mg, crushed flaxseed 15g daily, restriction of reheated seed oils.',
    diagnosedDate: '10-Sep-2026',
  },
];

const DEFAULT_BLOOD_RANGES: BloodReportRangeItem[] = [
  {
    id: 'br-rbc',
    testName: 'Total RBC Count (Red Blood Cells)',
    value: '2.0',
    unit: 'million/µL (2,000 / µL)',
    normalRange: '4.2 – 5.4 million/µL',
    status: 'abnormal', // Critically low marked red
    reason: 'RBC 2000 is critically low. En avangaluku intha value kammiya irukalam: May be Anemia (Iron deficiency anemia / Vitamin B12 or folate malabsorption / chronic occult micro-loss). Diminished oxygen transport capacity causes chronic fatigue, low stamina, and pallor.',
  },
  {
    id: 'br-hb',
    testName: 'Hemoglobin (Hb)',
    value: '8.4',
    unit: 'g/dL',
    normalRange: '12.0 – 15.5 g/dL',
    status: 'abnormal', // Low marked red
    reason: 'LOW (8.4 g/dL): Severe reduction in circulating oxygen-binding pigment. Direct companion finding to RBC 2000, confirming clinical hypochromic microcytic anemia.',
  },
  {
    id: 'br-ferritin',
    testName: 'Serum Ferritin',
    value: '14',
    unit: 'ng/mL',
    normalRange: '20 – 200 ng/mL',
    status: 'abnormal', // Low marked red
    reason: 'LOW (14 ng/mL): Severely depleted bone marrow iron stores. En avangaluku intha value kammiya irukalam: Conclusively identifies Iron Deficiency Anemia as the driver of RBC 2000.',
  },
  {
    id: 'br-glucose',
    testName: 'Fasting Plasma Glucose',
    value: '138',
    unit: 'mg/dL',
    normalRange: '70 – 99 mg/dL',
    status: 'abnormal', // High marked red
    reason: 'HIGH (138 mg/dL): Overt fasting hyperglycemia. En avangaluku intha value adhigama irukalam: Unsuppressed nocturnal hepatic gluconeogenesis and baseline peripheral insulin resistance.',
  },
  {
    id: 'br-hba1c',
    testName: 'Glycated Hemoglobin (HbA1c)',
    value: '7.2',
    unit: '%',
    normalRange: '< 5.7 % (Normal)',
    status: 'abnormal', // High marked red
    reason: 'HIGH (7.2%): Diagnostic of Type 2 Diabetes mellitus. Reflects sustained mean blood glucose of ~160 mg/dL over past 90–120 days.',
  },
  {
    id: 'br-urea',
    testName: 'Serum Urea (BUN Equivalent)',
    value: '2.8',
    unit: 'mmol/L',
    normalRange: '3.2 – 7.1 mmol/L',
    status: 'abnormal', // Low is marked red/orange as requested
    reason: 'LOW (2.8 mmol/L): En avangaluku intha value kammiya irukalam: Suboptimal dietary protein turnover, excessive hydration, or hepatic glycogen overload. Preserved creatinine (1.1) confirms renal filtration intact.',
  },
  {
    id: 'br-creatinine',
    testName: 'Serum Creatinine',
    value: '1.1',
    unit: 'mg/dL',
    normalRange: '0.6 – 1.2 mg/dL',
    status: 'normal', // Normal OK green
    reason: 'NORMAL (1.1 mg/dL): Stable glomerular filtration rate. No indication of diabetic nephropathy at baseline.',
  },
  {
    id: 'br-alt',
    testName: 'ALT / SGPT (Alanine Transaminase)',
    value: '52',
    unit: 'U/L',
    normalRange: '7 – 35 U/L',
    status: 'abnormal', // High red
    reason: 'HIGH (52 U/L): Hepatocellular enzyme leakage. En avangaluku intha value adhigama irukalam: Strongly tied to Visceral Adiposity (Level 11) and grade-1 hepatic steatosis (NAFLD).',
  },
  {
    id: 'br-chol',
    testName: 'Total Serum Cholesterol',
    value: '224',
    unit: 'mg/dL',
    normalRange: '< 200 mg/dL',
    status: 'borderline', // Borderline orange
    reason: 'SLIGHTLY ABNORMAL (224 mg/dL): Mild hypercholesterolemia. Elevated circulating atherogenic apoB lipoprotein fraction.',
  },
  {
    id: 'br-trig',
    testName: 'Serum Triglycerides',
    value: '195',
    unit: 'mg/dL',
    normalRange: '< 150 mg/dL',
    status: 'abnormal', // High red
    reason: 'HIGH (195 mg/dL): Hypertriglyceridemia driven by high-glycemic carbohydrate conversion in liver (de novo lipogenesis).',
  },
];

interface DateWiseRecordItem {
  id: string;
  dateStr: string;
  title: string;
  smartBadge: string;
  tag: string;
  category: string;
  thumbnailSvgType: 'blood' | 'metabolic' | 'lipid' | 'renal';
  fileUrl?: string;
  downloadUrl?: string;
  fileName?: string;
}

interface DateWiseGroup {
  group: string;
  items: DateWiseRecordItem[];
}

const DEFAULT_DATE_WISE_LAB_RECORDS: DateWiseGroup[] = [
  {
    group: 'AUG 2026',
    items: [
      {
        id: 'rec-aug-26-1',
        dateStr: "26 Aug '26",
        title: 'Lab Report',
        smartBadge: 'Smart',
        tag: 'No Tag added',
        category: 'Comprehensive Blood & Liver Function',
        thumbnailSvgType: 'blood',
      },
      {
        id: 'rec-aug-26-2',
        dateStr: "26 Aug '26",
        title: 'Lab Report',
        smartBadge: 'Smart',
        tag: 'No Tag added',
        category: 'Metabolic & Glycation Panel',
        thumbnailSvgType: 'metabolic',
      },
    ],
  },
  {
    group: 'MAY 2026',
    items: [
      {
        id: 'rec-may-21',
        dateStr: "21 May '26",
        title: 'Lab Report',
        smartBadge: 'Smart',
        tag: 'No Tag added',
        category: 'Lipid Fractions & Atherogenic Profile',
        thumbnailSvgType: 'lipid',
      },
      {
        id: 'rec-may-20',
        dateStr: "20 May '26",
        title: 'Lab Report',
        smartBadge: 'Smart',
        tag: 'No Tag added',
        category: 'Renal Function & Electrolyte Baseline',
        thumbnailSvgType: 'renal',
      },
    ],
  },
];

export const MedicinalSection: React.FC<MedicinalSectionProps> = ({
  generalInfo,
  calculations,
  medicalHistory,
  symptoms,
  lifestyleItems,
  dailyRoutine,
  foodHabits,
  dietaryRecall,
  selectedCategory,
  selectedDomain,
  onBackToMainFolders,
  themeMode = 'purple-white',
  onUpdateGeneralInfo,
  onUpdateMedicalHistory,
  onUpdateSymptoms,
  onUpdateCalculations,
}) => {
  // Active subfolder inside Medicinal (1. Preview, 2. Medical Records, 3. Prescription, 4. Goals, 5. Diagnostics, 6. Mn Prescription)
  const [activeMedicinalSubfolder, setActiveMedicinalSubfolder] = useState<
    'preview' | 'medical-records' | 'prescription' | 'goals' | 'diagnostics' | 'mn-prescription'
  >('preview');

  // Medical Records sub-view: 'blood' | 'bca'
  const [medicalRecordType, setMedicalRecordType] = useState<'blood' | 'bca'>('blood');

  // Uploaded Pathology Report state (opens in Report Picture)
  const [uploadedReportUrl, setUploadedReportUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ELSHA_UPLOADED_REPORT_URL') || null;
    } catch {
      return null;
    }
  });
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ELSHA_UPLOADED_FILE_NAME') || null;
    } catch {
      return null;
    }
  });
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  // Prescriptions Table State
  const [prescriptions, setPrescriptions] = useState<MedicinalPrescriptionDrug[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_MEDICINAL_PRESCRIPTIONS');
      if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_MEDICINES;
  });

  // Goals Table State
  const [goals, setGoals] = useState<ClinicalGoalItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_MEDICINAL_GOALS');
      if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_GOALS;
  });

  // Diagnostics Table State
  const [diagnostics, setDiagnostics] = useState<DiagnosticFindingItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_MEDICINAL_DIAGNOSTICS');
      if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_DIAGNOSTICS;
  });

  // Blood Ranges State
  const [bloodRanges, setBloodRanges] = useState<BloodReportRangeItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_BLOOD_RANGES');
      if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_BLOOD_RANGES;
  });

  // Date-Wise Medical Records State (Matching WhatsApp Image 2026-09-24 at 11.33.08 AM.jpeg)
  const [medicalRecordsTab, setMedicalRecordsTab] = useState<'my-records' | 'abha'>('my-records');
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState<string | null>(null);
  const [recordsSearchQuery, setRecordsSearchQuery] = useState('');
  const [isRecordsEditing, setIsRecordsEditing] = useState(false);
  const addReportFileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Date-Wise Medical Records State with Persistent LocalStorage
  const [dateWiseLabRecords, setDateWiseLabRecords] = useState<DateWiseGroup[]>(() => {
    try {
      const s = localStorage.getItem('ZIATHLON_MEDICAL_RECORDS');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_DATE_WISE_LAB_RECORDS;
  });

  // Cross-component sync: Automatically sync newly uploaded documents from Profile folder
  useEffect(() => {
    const handleSync = () => {
      try {
        const s = localStorage.getItem('ZIATHLON_MEDICAL_RECORDS');
        if (s) {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDateWiseLabRecords(parsed);
          }
        }
        const activeUrl = localStorage.getItem('ELSHA_UPLOADED_REPORT_URL');
        if (activeUrl) setUploadedReportUrl(activeUrl);
        const activeName = localStorage.getItem('ELSHA_UPLOADED_FILE_NAME');
        if (activeName) setUploadedFileName(activeName);
      } catch {}
    };

    window.addEventListener('ziathlon-medical-record-added', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('ziathlon-medical-record-added', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Upload handler inside Medical Folder (+ Add Report)
  const handleAddMedicalReportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const fileUrl = URL.createObjectURL(file);
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + " '" + new Date().getFullYear().toString().slice(-2);
    const currentMonthGroup = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    const newId = `rec-med-${Date.now()}`;

    const newRecordItem: DateWiseRecordItem = {
      id: newId,
      dateStr,
      title: file.name,
      smartBadge: 'Active File',
      tag: `${ext} Lab File`,
      category: `Clinical Laboratory Report (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      thumbnailSvgType: ext === 'PDF' ? 'blood' : 'metabolic',
      fileUrl,
      downloadUrl: fileUrl,
      fileName: file.name,
    };

    setDateWiseLabRecords((prev) => {
      let updated = [...prev];
      let group = updated.find((g) => g.group.toUpperCase() === currentMonthGroup);
      if (!group) {
        group = { group: currentMonthGroup, items: [] };
        updated = [group, ...updated];
      }
      group.items = [newRecordItem, ...group.items.filter((it) => it.id !== newId)];
      try {
        localStorage.setItem('ZIATHLON_MEDICAL_RECORDS', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setUploadedReportUrl(fileUrl);
    setUploadedFileName(file.name);
    try {
      localStorage.setItem('ELSHA_UPLOADED_REPORT_URL', fileUrl);
      localStorage.setItem('ELSHA_UPLOADED_FILE_NAME', file.name);
    } catch {}

    // Auto-sync into Profile folder demographics uploads
    try {
      const rawExisting = localStorage.getItem('ziathlon_uploaded_reports');
      const existing = rawExisting ? JSON.parse(rawExisting) : [];
      const newDocForProfile = {
        id: newId,
        name: file.name,
        type: `${ext} Document`,
        mimetype: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        keyBiomarkers: [],
        clinicalSummary: 'Uploaded from Medical Folder.',
        fileUrl,
        downloadUrl: fileUrl,
        pageCount: 1,
        rawFile: file,
      };
      const updatedDocs = [newDocForProfile, ...existing.filter((d: any) => d.id !== newId)];
      localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(updatedDocs));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    setSelectedMedicalRecordId(newId);
    setExportNotification(`✓ Successfully uploaded & saved report: ${file.name}`);
    setTimeout(() => setExportNotification(null), 3500);

    if (e.target) e.target.value = '';
  };

  // Delete handler for records inside Medical Folder (No blocking window.confirm)
  const handleDeleteLabRecord = (recordId: string, groupName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDateWiseLabRecords((prev) => {
      const updated = prev
        .map((g) => {
          if (g.group === groupName) {
            return { ...g, items: g.items.filter((item) => item.id !== recordId) };
          }
          return g;
        })
        .filter((g) => g.items.length > 0);

      try {
        localStorage.setItem('ZIATHLON_MEDICAL_RECORDS', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch {}
      return updated;
    });

    // Also remove from Profile folder uploads if present
    try {
      const rawReports = localStorage.getItem('ziathlon_uploaded_reports');
      if (rawReports) {
        const reports = JSON.parse(rawReports);
        const filtered = reports.filter((r: any) => r.id !== recordId);
        localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(filtered));
        window.dispatchEvent(new Event('storage'));
      }
    } catch {}

    if (selectedMedicalRecordId === recordId) {
      setSelectedMedicalRecordId(null);
    }
    setExportNotification('✓ Medical record deleted successfully.');
    setTimeout(() => setExportNotification(null), 3000);
  };

  // MN Prescription History State (Dates | Pages { Prescription Page })
  const [savedPrescriptionsHistory, setSavedPrescriptionsHistory] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('ZIATHLON_SAVED_PRESCRIPTIONS_HISTORY');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 'rx-hist-1',
        displayDate: '24 Sep 2026',
        displayTime: '11:45 AM',
        patientName: generalInfo.name || 'Santosh Radhakrishna',
        patientTag: 'Metabolic Health - Weight Loss',
        prescriptions: DEFAULT_MEDICINES,
      },
      {
        id: 'rx-hist-2',
        displayDate: '26 Aug 2026',
        displayTime: '10:15 AM',
        patientName: generalInfo.name || 'Santosh Radhakrishna',
        patientTag: 'Metabolic Health - Weight Loss',
        prescriptions: DEFAULT_MEDICINES,
      },
      {
        id: 'rx-hist-3',
        displayDate: '21 May 2026',
        displayTime: '04:30 PM',
        patientName: generalInfo.name || 'Santosh Radhakrishna',
        patientTag: 'Metabolic Health - Weight Loss',
        prescriptions: DEFAULT_MEDICINES.slice(0, 2),
      },
      {
        id: 'rx-hist-4',
        displayDate: '20 May 2026',
        displayTime: '11:00 AM',
        patientName: generalInfo.name || 'Santosh Radhakrishna',
        patientTag: 'Metabolic Health - Weight Loss',
        prescriptions: DEFAULT_MEDICINES.slice(0, 2),
      },
    ];
  });
  const [selectedPrescriptionHistoryId, setSelectedPrescriptionHistoryId] = useState<string>(
    'rx-hist-1'
  );
  const [mnPrescriptionActivePage, setMnPrescriptionActivePage] = useState<'dossier' | 'page1' | 'page2'>('dossier');

  // Reload history whenever localStorage changes or when activeMedicinalSubfolder changes to mn-prescription
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ZIATHLON_SAVED_PRESCRIPTIONS_HISTORY');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPrescriptionsHistory(parsed);
          setSelectedPrescriptionHistoryId(parsed[0].id);
        }
      }
    } catch {}
  }, [activeMedicinalSubfolder]);

  const handleDeletePrescriptionHistoryItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = savedPrescriptionsHistory.filter((item) => item.id !== id);
    setSavedPrescriptionsHistory(updated);
    try {
      localStorage.setItem('ZIATHLON_SAVED_PRESCRIPTIONS_HISTORY', JSON.stringify(updated));
    } catch {}
    if (selectedPrescriptionHistoryId === id && updated.length > 0) {
      setSelectedPrescriptionHistoryId(updated[0].id);
    }
    setExportNotification('✓ Prescription record removed from history.');
    setTimeout(() => setExportNotification(null), 2500);
  };

  // AI Research Chat State
  const [researchChatOpen, setResearchChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'doctor' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Hello Doctor. I am the **ŽIATHLON Clinical Laboratory Research AI**. I have cross-analyzed **${generalInfo.name || 'Kiruthika'}**'s blood biochemistry and BCA parameters.\n\n• Key Finding 1: **Total RBC is 2.0 million/µL (2,000 / µL: Critically Low)** with **Hb 8.4 g/dL** and **Ferritin 14 ng/mL** — indicative of Microcytic Hypochromic Anemia.\n• Key Finding 2: **Serum Urea is 2.8 mmol/L (Low)** with normal Creatinine (1.1) and elevated **ALT 52 U/L**.\n\nYou can ask any research question below to explore etiology, susceptible physiological reasons, or evidence-based sports medicine nutrition interventions.`,
      timestamp: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // File Upload Handlers for Report Picture Activation
  const handleReportFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedReportUrl(result);
        try {
          localStorage.setItem('ELSHA_UPLOADED_REPORT_URL', result);
          localStorage.setItem('ELSHA_UPLOADED_FILE_NAME', file.name);
        } catch {}
      };
      reader.readAsDataURL(file);
      setExportNotification(`✓ Activated Lab Report File: ${file.name}`);
      setTimeout(() => setExportNotification(null), 3500);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedReportUrl(null);
    setUploadedFileName(null);
    try {
      localStorage.removeItem('ELSHA_UPLOADED_REPORT_URL');
      localStorage.removeItem('ELSHA_UPLOADED_FILE_NAME');
    } catch {}
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_MEDICINAL_PRESCRIPTIONS', JSON.stringify(prescriptions));
      localStorage.setItem('ELSHA_MEDICINAL_GOALS', JSON.stringify(goals));
      localStorage.setItem('ELSHA_MEDICINAL_DIAGNOSTICS', JSON.stringify(diagnostics));
      localStorage.setItem('ELSHA_BLOOD_RANGES', JSON.stringify(bloodRanges));
    } catch (e) {
      console.error(e);
    }
  }, [prescriptions, goals, diagnostics, bloodRanges]);

  // Handlers for Prescriptions Table
  const handleAddPrescription = () => {
    const newDrug: MedicinalPrescriptionDrug = {
      id: `med-${Date.now()}`,
      medicine: '',
      dosage: '',
      duration: '',
      timing: 'With meals',
      instructions: '',
    };
    setPrescriptions([...prescriptions, newDrug]);
  };

  const handleUpdatePrescription = (id: string, field: keyof MedicinalPrescriptionDrug, val: string) => {
    setPrescriptions(prescriptions.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((m) => m.id !== id));
  };

  const handlePrescriptionTableUpdate = (meds: PrescriptionMedicineItem[]) => {
    const converted: MedicinalPrescriptionDrug[] = meds.map((m) => ({
      id: m.id,
      medicine: m.name + (m.genericName ? ` (${m.genericName})` : ''),
      dosage: m.dose || '1 dose',
      duration: m.duration || '30 Days',
      timing: m.frequency || 'As directed',
      instructions: m.remarks || '',
    }));
    setPrescriptions(converted);
  };

  // Explicit Save Handlers for User Requests
  const handleSavePrescription = () => {
    try {
      localStorage.setItem('ELSHA_MEDICINAL_PRESCRIPTIONS', JSON.stringify(prescriptions));
      const convertedMeds = prescriptions.map((p) => ({
        id: p.id,
        name: p.medicine,
        dose: p.dosage,
        frequency: p.timing,
        duration: p.duration,
        remarks: p.instructions,
      }));
      localStorage.setItem('ZIATHLON_RX_TABLE_MEDS', JSON.stringify(convertedMeds));
    } catch {}
    setExportNotification('✓ Prescription Saved! Automated real-time sync to Preview Report updated.');
    setTimeout(() => setExportNotification(null), 3500);
  };

  const handleSaveGoals = () => {
    try {
      localStorage.setItem('ELSHA_MEDICINAL_GOALS', JSON.stringify(goals));
    } catch {}
    setExportNotification('✓ Clinical Goals Saved! Automated real-time sync to Preview Report updated.');
    setTimeout(() => setExportNotification(null), 3500);
  };

  const handleSaveDiagnostics = () => {
    try {
      localStorage.setItem('ELSHA_MEDICINAL_DIAGNOSTICS', JSON.stringify(diagnostics));
    } catch {}
    setExportNotification('✓ Diagnostics Saved! Automated real-time sync to Preview Report updated.');
    setTimeout(() => setExportNotification(null), 3500);
  };

  // Handlers for Goals Table
  const handleAddGoal = () => {
    const newG: ClinicalGoalItem = {
      id: `goal-${Date.now()}`,
      type: 'Secondary',
      title: 'New Clinical Objective',
      targetDescription: '',
      targetTimeline: '60 Days',
      status: 'Active Target',
    };
    setGoals([...goals, newG]);
  };

  const handleUpdateGoal = (id: string, field: keyof ClinicalGoalItem, val: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, [field]: val } : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  // Handlers for Diagnostics Table
  const handleAddDiagnostic = () => {
    const newDiag: DiagnosticFindingItem = {
      id: `diag-${Date.now()}`,
      susceptibilityCondition: '',
      riskLevel: 'Moderate Risk',
      supportingBiomarkers: '',
      clinicalIntervention: '',
      diagnosedDate: new Date().toLocaleDateString('en-GB'),
    };
    setDiagnostics([...diagnostics, newDiag]);
  };

  const handleUpdateDiagnostic = (id: string, field: keyof DiagnosticFindingItem, val: string) => {
    setDiagnostics(diagnostics.map((d) => (d.id === id ? { ...d, [field]: val } : d)));
  };

  const handleDeleteDiagnostic = (id: string) => {
    setDiagnostics(diagnostics.filter((d) => d.id !== id));
  };

  // Research Chat Send
  const handleSendResearchChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userQ = chatInput.trim();
    setChatInput('');
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'doctor', text: userQ, timestamp: timeNow }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/medical-research-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQ,
          patientName: generalInfo.name || 'Kiruthika',
          condition: generalInfo.tag || 'Type 2 Diabetes & Metabolic Health',
          reportContext: {
            bloodRanges,
            bca: {
              visceralFat: generalInfo.visceralFat || 11,
              weight: generalInfo.weight || 66,
              bmi: calculations.bmi || 25.1,
            },
          },
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Clinical research data analyzed.';
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply, timestamp: timeNow }]);
    } catch (e) {
      let fallback = '';
      const qLower = userQ.toLowerCase();
      if (qLower.includes('rbc') || qLower.includes('anemia') || qLower.includes('2000')) {
        fallback = `**Clinical Pathology Evaluation — RBC 2.0 ×10⁶/µL (2,000 / µL: Critically Low)**\n\n` +
          `• **Etiology (En Avangaluku Intha Value Kammiya Irukalam)**: The patient demonstrates severe Hypochromic Microcytic Anemia driven by iron exhaustion (Ferritin 14 ng/mL) and low Hemoglobin (8.4 g/dL). Potential triggers include chronic occult blood loss, reduced intestinal iron absorption, or suboptimal bioavailable heme intake.\n` +
          `• **Susceptible Physiological Impacts**: Drastic reduction in tissue VO2 peak, chronic muscular fatigue, exercise-induced breathlessness, and compensatory tachycardia.\n` +
          `• **Sports Medicine Clinical Interventions**:\n` +
          `  1. Iron Therapy: Liposomal Ferrous Bisglycinate (60 mg elemental iron) with 250 mg Ascorbic Acid (Vitamin C) on an empty stomach.\n` +
          `  2. Erythropoiesis Co-factors: Active Methylfolate 400 mcg + Methylcobalamin 1500 mcg.\n` +
          `  3. Nutrition Strategy: Sprouted lentils, drumstick leaf broth, soaked black raisins; avoid tea/coffee within 2 hours of meals.`;
      } else if (qLower.includes('urea') || qLower.includes('2.8')) {
        fallback = `**Clinical Research Note — Serum Urea 2.8 mmol/L (Low)**\n\n` +
          `• **Etiology (En Avangaluku Intha Value Kammiya Irukalam)**: Serum urea 2.8 mmol/L is below normal (3.2–7.1 mmol/L). With normal Serum Creatinine (1.1 mg/dL), this completely rules out intrinsic renal failure. It typically points to low dietary protein intake, excessive fluid hydration, or early hepatic glycogen overload.\n` +
          `• **Clinical Strategy**: Calibrate daily protein to 1.2–1.4 g/kg body weight (~78 g daily target). Renal status is well preserved.`;
      } else {
        fallback = `**Clinical Research Assessment for "${userQ}"**:\nCross-referenced against patient profile (${generalInfo.name || 'Kiruthika'}, HbA1c 7.2%, ALT 52 U/L, Visceral Fat Level 11). Prioritize low-glycemic nutrition, post-prandial GLUT4 activation, and iron repletion to normalize hepatic transaminases and erythrocyte count safely.`;
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: fallback, timestamp: timeNow }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // States for PDF Export & Patient Details Download
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);
  const [showPatientDownloadMenu, setShowPatientDownloadMenu] = useState(false);

  // Print Mn Prescription
  const handlePrintMnPrescription = () => {
    setActiveMedicinalSubfolder('mn-prescription');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Export MN Prescription as 2-Page Vector PDF
  const handleExportMnPrescriptionPdf = (theme: 'clinical-white' | 'gold-dark' = 'clinical-white') => {
    setIsExportingPdf(true);
    setExportNotification('Generating Official 2-Page MN Prescription PDF...');
    try {
      const pdfData: MnPrescriptionPdfData = {
        patient: {
          name: generalInfo.name || 'Kiruthika',
          age: generalInfo.age || 38,
          gender: generalInfo.sex || 'Female',
          dateOfBirth: generalInfo.dateOfBirth || '14-May-1988',
          phone: generalInfo.phone || '+91 98765 43210',
          email: generalInfo.email || 'patient@ziathlon.clinic',
          address: generalInfo.address || 'Chennai, Tamil Nadu',
          pincode: generalInfo.pincode || '600001',
          tag: generalInfo.tag || generalInfo.customTag || 'Metabolic Health (T2D)',
          referral: generalInfo.referral || generalInfo.referralSource || 'Instagram',
          patientId: `ZIA-MN-RX-${String(generalInfo.name || 'PAT').slice(0, 4).toUpperCase()}-2026`,
        },
        anthropometrics: {
          height: generalInfo.height || 162,
          weight: generalInfo.weight || 66,
          bmi: calculations.bmi || 22.5,
          bmiCategory: calculations.bmiCategory || 'Normal',
          visceralFat: generalInfo.visceralFat || 11,
          bmr: calculations.bmr || 1418,
          tdee: calculations.tdee || 2198,
          muscleMass: generalInfo.muscleMass,
          fatPercentage: generalInfo.fatPercentage,
        },
        diagnostics: diagnostics.map((d) => ({
          susceptibilityCondition: d.susceptibilityCondition,
          riskLevel: d.riskLevel,
          supportingBiomarkers: d.supportingBiomarkers,
        })),
        goals: goals.map((g) => ({
          type: g.type,
          title: g.title,
          targetDescription: g.targetDescription,
          targetTimeline: g.targetTimeline,
        })),
        prescriptions: prescriptions.map((p) => ({
          medicine: p.medicine,
          dosage: p.dosage,
          duration: p.duration,
          timing: p.timing,
          instructions: p.instructions,
        })),
        laboratoryTests: [
          { testName: 'Complete Lipid Profile (12-Hour Fasting)', description: 'Total Chol, Triglycerides, HDL, LDL, VLDL' },
          { testName: 'Glycemic Panel & Glycation Index', description: 'Fasting Plasma Glucose, Post-prandial Glucose, HbA1c' },
          { testName: 'Comprehensive Hepatic & Renal Function', description: 'Serum Urea, Creatinine, eGFR, AST/ALT' },
          { testName: 'Spot Urine Routine & Microalbuminuria', description: 'Spot urinary albumin-to-creatinine ratio (ACR)' },
        ],
      };

      const filename = generateMnPrescriptionPdf(pdfData, undefined, { theme });
      setExportNotification(`✓ Successfully Exported: ${filename}`);
      setTimeout(() => setExportNotification(null), 4000);
    } catch (err) {
      console.error('Error generating MN Prescription PDF:', err);
      setExportNotification('Error exporting MN Prescription PDF. Please retry.');
      setTimeout(() => setExportNotification(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-[1780px] mx-auto space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Export Notification Toast */}
      {exportNotification && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* Vertical Navigation & Active Subfolder Content Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Vertical Subfolders Navigation List (Always visible as per user request) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2 no-print">
          {[
            { id: 'preview', label: 'PREVIEW', icon: Eye },
            { id: 'medical-records', label: 'MEDICAL RECORDS', icon: Activity },
            { id: 'prescription', label: 'PRESCRIPTION', icon: Pill },
            { id: 'goals', label: 'GOALS', icon: Target },
            { id: 'diagnostics', label: 'DIAGNOSTICS', icon: Stethoscope },
            { id: 'mn-prescription', label: 'MN PRESCRIPTION', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMedicinalSubfolder === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMedicinalSubfolder(tab.id as any)}
                className={`w-full px-4 py-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between font-black tracking-wider text-xs shadow-xs ${
                  isActive
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-md ring-2 ring-purple-300'
                    : 'bg-purple-50/80 hover:bg-purple-100 text-gray-900 border-purple-200 hover:border-[#7E22CE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#7E22CE]'}`} />
                  <span>{tab.label}</span>
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

        {/* Right Active Subfolder Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">

      {/* ========================================================================= */}
      {/* 1. PREVIEW: 3-PART CLINICAL EMR (PREVIEW | DATES | PAGES OF PREVIEW)     */}
      {/* ========================================================================= */}
      {activeMedicinalSubfolder === 'preview' && (
        <div className="space-y-6 animate-in fade-in">
          <ThreePartMedicalRecordPreview
            generalInfo={generalInfo}
            calculations={calculations}
            medicalHistory={medicalHistory}
            symptoms={symptoms}
            lifestyleItems={lifestyleItems}
            dailyRoutine={dailyRoutine}
            foodHabits={foodHabits}
            dietaryRecall={dietaryRecall}
            goals={goals}
            prescriptions={prescriptions}
            diagnostics={diagnostics}
            onPrint={() => window.print()}
            onUpdateGeneralInfo={onUpdateGeneralInfo}
            onUpdateMedicalHistory={onUpdateMedicalHistory}
            onUpdateSymptoms={onUpdateSymptoms}
            onUpdateCalculations={onUpdateCalculations}
            onUpdateGoals={(newGoals) => {
              setGoals(newGoals);
              try {
                localStorage.setItem('ELSHA_MEDICINAL_GOALS', JSON.stringify(newGoals));
              } catch {}
            }}
            onUpdatePrescriptions={(newPrescriptions) => {
              setPrescriptions(newPrescriptions);
              try {
                localStorage.setItem('ELSHA_MEDICINAL_PRESCRIPTIONS', JSON.stringify(newPrescriptions));
              } catch {}
            }}
            onUpdateDiagnostics={(newDiagnostics) => {
              setDiagnostics(newDiagnostics);
              try {
                localStorage.setItem('ELSHA_MEDICINAL_DIAGNOSTICS', JSON.stringify(newDiagnostics));
              } catch {}
            }}
            onNavigateToMnPrescription={() => setActiveMedicinalSubfolder('mn-prescription')}
          />

          {/* Bottom Complete & Back Button */}
          <div className="pt-2 flex items-center justify-between no-print">
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Complete & Back to 7 Main Folders</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMedicinalSubfolder('medical-records')}
              className="px-5 py-2.5 rounded-xl bg-[#7E22CE] text-white hover:bg-[#6b1dae] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Next: 2. Medical Records</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

         {/* ========================================================================= */}
      {/* 2. MEDICAL RECORDS: DATE-WISE DIRECTORY & 3-SEGMENT CLINICAL WORKSPACE    */}
      {/* ========================================================================= */}
      {activeMedicinalSubfolder === 'medical-records' && (
        <MedicalRecordsDirectoryAndViewer
          generalInfo={generalInfo}
          calculations={calculations}
          medicalHistory={medicalHistory}
          onBackToMainFolders={onBackToMainFolders}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. PRESCRIPTION TABLE                                                    */}
      {/* ========================================================================= */}
      {activeMedicinalSubfolder === 'prescription' && (
        <div className="p-6 rounded-2xl bg-white border-2 border-[#7E22CE] shadow-xl space-y-6 animate-in fade-in">
          {/* Branded Letterhead Header */}
          <ZiathlonLetterheadHeader
            pageNumber="Rx PRESCRIPTION"
            rxNumber={`Rx ID: ZIA-RX-${String(generalInfo.name || 'PAT').slice(0, 4).toUpperCase()}-2026`}
            date={new Date().toLocaleDateString('en-GB')}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DECE] pb-3">
            <div>
              <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">
                Clinical Prescription Table
              </h3>
              <p className="text-xs text-gray-600">
                Official clinical formulary calibrated to {generalInfo.name || 'Patient'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveMedicinalSubfolder('preview')}
              className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#7E22CE] border border-purple-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View in 3-Part Preview Paper</span>
            </button>
          </div>

          <OfficialClinicalPrescriptionTable
            patientName={generalInfo.name || 'Patient'}
            onUpdateMedicines={handlePrescriptionTableUpdate}
            onPrint={handlePrintMnPrescription}
          />

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-[#E5DECE] flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to 7 Main Folders</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSavePrescription}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                title="Save prescription and immediately update in 3-part preview"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Prescription</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('preview')}
                className="px-4 py-2.5 rounded-xl bg-purple-100 text-[#7E22CE] border border-purple-300 hover:bg-purple-200 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>View in Preview (Shown at Last)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('goals')}
                className="px-5 py-2.5 rounded-xl bg-[#7E22CE] text-white hover:bg-[#6b1dae] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next: Goals</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GOALS TABLE                                                            */}
      {/* ========================================================================= */}
      {activeMedicinalSubfolder === 'goals' && (
        <div className="p-6 rounded-2xl bg-white border-2 border-[#7E22CE] shadow-md space-y-6 animate-in fade-in text-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-purple-200 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-950 uppercase tracking-wider">
                Clinical Goals Table
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveGoals}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                title="Save goals and immediately update preview"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Goals</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('preview')}
                className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#7E22CE] border border-purple-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View in 3-Part Preview</span>
              </button>
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal Row</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-purple-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-100 text-purple-950 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-3.5 w-1/6">Priority</th>
                  <th className="p-3.5 w-1/4">Milestone Title</th>
                  <th className="p-3.5 w-1/3">Target Description & Clinical Metrics</th>
                  <th className="p-3.5 w-1/6">Timeline</th>
                  <th className="p-3.5 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {goals.map((g) => (
                  <tr key={g.id} className="hover:bg-purple-50/50">
                    <td className="p-3">
                      <select
                        value={g.type}
                        onChange={(e) => handleUpdateGoal(g.id, 'type', e.target.value as any)}
                        className="w-full bg-purple-50/80 border border-purple-200 rounded-lg px-2 py-2 text-[#7E22CE] font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                      >
                        <option value="Primary">Priority 1</option>
                        <option value="Secondary">Priority 2</option>
                        <option value="Tertiary">Priority 3</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={g.title}
                        onChange={(e) => handleUpdateGoal(g.id, 'title', e.target.value)}
                        placeholder="Goal title"
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-gray-950 font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                      />
                    </td>
                    <td className="p-3">
                      <textarea
                        value={g.targetDescription}
                        onChange={(e) => handleUpdateGoal(g.id, 'targetDescription', e.target.value)}
                        rows={2}
                        placeholder="Detailed clinical target"
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-1.5 text-gray-800 text-xs focus:outline-none focus:border-[#7E22CE] resize-none"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={g.targetTimeline}
                        onChange={(e) => handleUpdateGoal(g.id, 'targetTimeline', e.target.value)}
                        placeholder="e.g. 90 Days"
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-[#7E22CE] font-mono font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(g.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t-2 border-purple-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to 7 Main Folders</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveGoals}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                title="Save goals and immediately update preview"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Goals</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('preview')}
                className="px-4 py-2.5 rounded-xl bg-purple-100 text-[#7E22CE] border border-purple-300 hover:bg-purple-200 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>View in Preview (Shown at Last)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('diagnostics')}
                className="px-5 py-2.5 rounded-xl bg-[#7E22CE] text-white hover:bg-[#6b1dae] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next: 5. Diagnostics Table</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DIAGNOSTICS: TABLE FOR SUSCEPTIBILITIES (e.g. Susceptible to Liver, T2D) */}
      {/* ========================================================================= */}
      {activeMedicinalSubfolder === 'diagnostics' && (
        <div className="p-6 rounded-2xl bg-white border-2 border-[#7E22CE] shadow-md space-y-6 animate-in fade-in text-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-purple-200 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7E22CE] font-bold tracking-widest block">
                DISEASE SUSCEPTIBILITIES & CLINICAL ASSESSMENT
              </span>
              <h3 className="text-lg sm:text-xl font-black text-gray-950 uppercase tracking-wider mt-0.5">
                Diagnostics & Susceptibility Table
              </h3>
              <p className="text-xs text-gray-600">
                Type suspected clinical conditions (e.g. Susceptible to Liver Diseases, Susceptible to Diabetes 2) with supporting biomarkers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDiagnostics}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                title="Save diagnostics and immediately update preview"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Diagnostics</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('preview')}
                className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#7E22CE] border border-purple-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View in 3-Part Preview</span>
              </button>
              <button
                type="button"
                onClick={handleAddDiagnostic}
                className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Diagnostic Finding</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-purple-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-100 text-purple-950 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-3.5 w-1/3">Susceptibility / Diagnostic Finding</th>
                  <th className="p-3.5 w-1/6">Risk Level</th>
                  <th className="p-3.5 w-1/4">Supporting Lab / BCA Biomarkers</th>
                  <th className="p-3.5 w-1/4">Clinical Intervention Protocol</th>
                  <th className="p-3.5 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {diagnostics.map((diag) => (
                  <tr key={diag.id} className="hover:bg-purple-50/50">
                    <td className="p-3">
                      <input
                        type="text"
                        value={diag.susceptibilityCondition}
                        onChange={(e) => handleUpdateDiagnostic(diag.id, 'susceptibilityCondition', e.target.value)}
                        placeholder="e.g. Susceptible to Liver Diseases or Diabetes 2"
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-gray-950 font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={diag.riskLevel}
                        onChange={(e) => handleUpdateDiagnostic(diag.id, 'riskLevel', e.target.value as any)}
                        className="w-full bg-purple-50 border border-purple-200 rounded-lg px-2 py-2 text-rose-700 font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                      >
                        <option value="High Risk">High Risk</option>
                        <option value="Moderate Risk">Moderate Risk</option>
                        <option value="Mild Susceptibility">Mild Susceptibility</option>
                        <option value="Elevated">Elevated</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <textarea
                        value={diag.supportingBiomarkers}
                        onChange={(e) => handleUpdateDiagnostic(diag.id, 'supportingBiomarkers', e.target.value)}
                        rows={2}
                        placeholder="e.g. Visceral fat 11, ALT 52 U/L, HbA1c 7.2%"
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-1.5 text-gray-800 text-xs focus:outline-none focus:border-[#7E22CE] resize-none"
                      />
                    </td>
                    <td className="p-3">
                      <textarea
                        value={diag.clinicalIntervention}
                        onChange={(e) => handleUpdateDiagnostic(diag.id, 'clinicalIntervention', e.target.value)}
                        rows={2}
                        placeholder="Actionable clinical plan"
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-1.5 text-[#7E22CE] font-medium text-xs focus:outline-none focus:border-[#7E22CE] resize-none"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteDiagnostic(diag.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete diagnostic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t-2 border-purple-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to 7 Main Folders</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDiagnostics}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                title="Save diagnostics and immediately update preview"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Diagnostics</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('preview')}
                className="px-4 py-2.5 rounded-xl bg-purple-100 text-[#7E22CE] border border-purple-300 hover:bg-purple-200 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>View in Preview (Shown at Last)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedicinalSubfolder('mn-prescription')}
                className="px-5 py-2.5 rounded-xl bg-[#7E22CE] text-white hover:bg-[#6b1dae] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next: Open MN Prescription</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MN PRESCRIPTION: DATES | PAGES { PRESCRIPTION PAGE } ARCHIVE               */}
      {/* ========================================================================= */}
      {activeMedicinalSubfolder === 'mn-prescription' && (() => {
        const selectedHistItem =
          savedPrescriptionsHistory.find((item) => item.id === selectedPrescriptionHistoryId) ||
          savedPrescriptionsHistory[0] ||
          null;

        return (
          <div className="space-y-5 animate-in fade-in">
            {/* Top Action Bar */}
            <div className="p-4 rounded-xl bg-purple-50 border-2 border-[#7E22CE] flex flex-wrap items-center justify-between gap-3 no-print shadow-sm text-gray-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-purple-300">
                  <FileText className="w-5 h-5 text-[#7E22CE]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-950">
                      DATES | PAGES {'{ PRESCRIPTION PAGE }'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#7E22CE] text-white text-[10px] font-bold">
                      History Archive
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-600 block">
                    Date-wise clinical consultation archives • Select a date on the left to view its official prescription page
                  </span>
                </div>
              </div>

              {/* Quick Action Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newEntry = {
                      id: `rx-hist-${Date.now()}`,
                      displayDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                      displayTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                      patientName: generalInfo.name || 'Santosh Radhakrishna',
                      patientTag: generalInfo.tag || 'Metabolic Health',
                      medicineCount: prescriptions.length || 3,
                      prescriptions: [...prescriptions],
                    };
                    const updated = [newEntry, ...savedPrescriptionsHistory];
                    setSavedPrescriptionsHistory(updated);
                    setSelectedPrescriptionHistoryId(newEntry.id);
                    try {
                      localStorage.setItem('ZIATHLON_SAVED_PRESCRIPTIONS_HISTORY', JSON.stringify(updated));
                    } catch {}
                    setExportNotification('Saved current prescription to MN Prescription History!');
                    setTimeout(() => setExportNotification(null), 3000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border-2 border-[#7E22CE] hover:bg-purple-100 text-[#7E22CE] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  title="Save current active preview prescription as a new dated history entry"
                >
                  <Plus className="w-3.5 h-3.5 text-[#7E22CE]" />
                  <span>+ Save Current as New Date</span>
                </button>

                {/* Direct Vector PDF Export */}
                <button
                  type="button"
                  onClick={() => handleExportMnPrescriptionPdf('clinical-white')}
                  disabled={isExportingPdf}
                  className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  title="Export official PDF"
                >
                  <FileDown className="w-4 h-4 text-purple-200" />
                  <span>{isExportingPdf ? 'Generating PDF...' : 'Export MN Prescription (PDF)'}</span>
                </button>

                {/* Print Option */}
                <button
                  type="button"
                  onClick={handlePrintMnPrescription}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-purple-300 hover:bg-purple-100 text-[#7E22CE] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-2xs transition-all font-bold"
                  title="Print Prescription"
                >
                  <Printer className="w-4 h-4 text-[#7E22CE]" />
                  <span>Print Prescription</span>
                </button>
              </div>
            </div>

            {/* Split Layout: DATES | PAGES { PRESCRIPTION PAGE } */}
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              {/* LEFT COLUMN: DATES LIST */}
              <div className="w-full lg:w-80 shrink-0 space-y-3 no-print">
                <div className="p-4 rounded-xl bg-white border-2 border-[#7E22CE] shadow-sm">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2.5 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#7E22CE]" />
                      DATES ({savedPrescriptionsHistory.length})
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Select to Open</span>
                  </div>

                  <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                    {savedPrescriptionsHistory.map((item) => {
                      const isSelected = selectedHistItem?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedPrescriptionHistoryId(item.id)}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative group ${
                            isSelected
                              ? 'bg-purple-50/90 border-[#7E22CE] ring-2 ring-purple-300 shadow-sm'
                              : 'bg-white border-purple-150 hover:border-purple-300 hover:bg-purple-50/40 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-gray-950 group-hover:text-[#7E22CE] transition-colors">
                                  {item.displayDate}
                                </span>
                                {item.displayTime && (
                                  <span className="text-[10px] font-mono text-gray-400">
                                    {item.displayTime}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-bold text-gray-700 truncate">
                                {item.patientName || generalInfo.name || 'Santosh Radhakrishna'}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#7E22CE] text-[9px] font-bold border border-purple-200">
                                  {item.prescriptions?.length || item.medicineCount || 3} Meds
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                                  Prescription Page
                                </span>
                              </div>
                            </div>

                            {/* Delete history entry */}
                            <button
                              type="button"
                              onClick={(e) => handleDeletePrescriptionHistoryItem(item.id, e)}
                              className="p-1 text-gray-300 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                              title="Delete this history record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PAGES { PRESCRIPTION PAGE } */}
              <div className="flex-1 min-w-0 space-y-4">
                {/* Page Switcher Toolbar */}
                <div className="p-3 rounded-xl bg-white border-2 border-[#7E22CE] flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-gray-900 tracking-wider">
                      {'{ PRESCRIPTION PAGE }'}:
                    </span>
                    <span className="text-xs font-mono font-bold text-[#7E22CE]">
                      {selectedHistItem?.displayDate || '24 Sep 2026'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMnPrescriptionActivePage('dossier')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                        mnPrescriptionActivePage === 'dossier'
                          ? 'bg-[#7E22CE] text-white shadow-xs'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      Dossier Preview (Exact Paper)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMnPrescriptionActivePage('page1')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                        mnPrescriptionActivePage === 'page1'
                          ? 'bg-[#7E22CE] text-white shadow-xs'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      Page 1: Identity & Goals
                    </button>
                    <button
                      type="button"
                      onClick={() => setMnPrescriptionActivePage('page2')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                        mnPrescriptionActivePage === 'page2'
                          ? 'bg-[#7E22CE] text-white shadow-xs'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      Page 2: Rx Formulary & Orders
                    </button>
                  </div>
                </div>

                {/* Printable Prescription Area */}
                <div className="print-area space-y-6">
                  {/* EXACT CLINICAL DOSSIER PAPER (EXACT PREVIEW MATCH SAVED BY DATE) */}
                  {mnPrescriptionActivePage === 'dossier' && (
                    <div className="w-full flex justify-center pb-2">
                      <ThreePartMedicalRecordPreview
                        generalInfo={generalInfo}
                        calculations={calculations}
                        medicalHistory={medicalHistory}
                        symptoms={symptoms}
                        goals={goals}
                        prescriptions={prescriptions}
                        diagnostics={diagnostics}
                        initialRecord={selectedHistItem}
                      />
                    </div>
                  )}

                  {/* PAGE 1: CLINICAL IDENTITY, VITALS, DIAGNOSTICS & GOALS */}
                  {mnPrescriptionActivePage === 'page1' && (
                    <div className="prescription-page page-1 p-6 sm:p-10 rounded-2xl bg-white text-gray-900 shadow-xl border-2 border-purple-200 space-y-6 min-h-[850px] block">
                      {/* Header with Official Letterhead Stationery */}
                      <ZiathlonLetterheadHeader
                        pageNumber="PAGE 1 OF 2"
                        rxNumber={`Rx ID: ZIA-RX-${String(selectedHistItem?.patientName || generalInfo.name || 'PAT').slice(0, 3).toUpperCase()}-2026`}
                        date={selectedHistItem?.displayDate || new Date().toLocaleDateString('en-GB')}
                      />

                      {/* Patient Header Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                        <div>
                          <span className="font-bold text-purple-900 block">Patient Name:</span>
                          <span className="font-black text-sm text-gray-900">{selectedHistItem?.patientName || generalInfo.name || 'Santosh Radhakrishna'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-purple-900 block">Age / Gender / Consultation Date:</span>
                          <span className="font-semibold text-gray-800">
                            {generalInfo.age || 38} Yrs • {generalInfo.sex || 'Female'} • {selectedHistItem?.displayDate || '24 Sep 2026'}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-purple-900 block">Clinical Domain / Tag:</span>
                          <span className="font-bold text-[#7E22CE]">{selectedHistItem?.patientTag || generalInfo.tag || 'Metabolic Health (T2D)'}</span>
                        </div>
                      </div>

                      {/* Anthropometry & Body Composition Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#7E22CE] border-b border-purple-200 pb-1">
                          1. Anthropometric & Body Composition Profile (BCA)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="text-gray-500 text-[10px] block">Height / Weight</span>
                            <span className="font-bold">{generalInfo.height || 162} cm • {generalInfo.weight || 66} kg</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="text-gray-500 text-[10px] block">BMI & Classification</span>
                            <span className="font-bold">{calculations.bmi.toFixed(1)} ({calculations.bmiCategory})</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="text-gray-500 text-[10px] block">Visceral Fat Level</span>
                            <span className="font-bold text-rose-600">{generalInfo.visceralFat || 11} / 20 (High Risk)</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="text-gray-500 text-[10px] block">Metabolic Energy Rate</span>
                            <span className="font-bold">{calculations.bmr} kcal BMR</span>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Diagnostics & Susceptibility Findings */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#7E22CE] border-b border-purple-200 pb-1">
                          2. Diagnosed Clinical Susceptibilities & Pathology
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-purple-100/70 text-purple-950 font-black">
                              <tr>
                                <th className="p-2 w-1/3">Suspected Condition</th>
                                <th className="p-2 w-1/6">Risk Tier</th>
                                <th className="p-2">Key Diagnostic Biomarkers</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {diagnostics.map((d) => (
                                <tr key={d.id}>
                                  <td className="p-2 font-bold text-gray-900">{d.susceptibilityCondition}</td>
                                  <td className="p-2 text-rose-600 font-black">{d.riskLevel}</td>
                                  <td className="p-2 text-gray-700">{d.supportingBiomarkers}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Clinical Milestones / Goals */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#7E22CE] border-b border-purple-200 pb-1">
                          3. Tri-Tier Clinical Recovery Goals
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-purple-100/70 text-purple-950 font-black">
                              <tr>
                                <th className="p-2 w-1/6">Tier</th>
                                <th className="p-2 w-1/4">Objective</th>
                                <th className="p-2 w-1/2">Target Description & Metrics</th>
                                <th className="p-2">Timeline</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {goals.map((g) => (
                                <tr key={g.id}>
                                  <td className="p-2 font-bold text-[#7E22CE]">{g.type}</td>
                                  <td className="p-2 font-semibold text-gray-900">{g.title}</td>
                                  <td className="p-2 text-gray-700">{g.targetDescription}</td>
                                  <td className="p-2 font-mono text-gray-600">{g.targetTimeline}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 flex justify-between text-[10px] text-gray-500 font-mono">
                        <span>ŽIATHLON SPORTS MEDICINE CLINIC • MEDICAL DOSSIER</span>
                        <span>Page 1 of 2 • Continued on Page 2 →</span>
                      </div>
                    </div>
                  )}

                  {/* PAGE 2: PHARMACOTHERAPY PRESCRIPTION, LAB ORDERS, DOCTOR SIGNATURE */}
                  {mnPrescriptionActivePage === 'page2' && (
                    <div className="prescription-page page-2 p-6 sm:p-10 rounded-2xl bg-white text-gray-900 shadow-xl border-2 border-purple-200 space-y-6 min-h-[850px] block">
                      {/* Header */}
                      <ZiathlonLetterheadHeader
                        pageNumber="PAGE 2 OF 2"
                        rxNumber={`Rx ID: ZIA-RX-${String(selectedHistItem?.patientName || generalInfo.name || 'PAT').slice(0, 3).toUpperCase()}-2026`}
                        date={selectedHistItem?.displayDate || new Date().toLocaleDateString('en-GB')}
                      />

                      {/* Official Clinical Prescription Table (Matching Image Style Guide) */}
                      <div className="space-y-3">
                        <OfficialClinicalPrescriptionTable
                          patientName={selectedHistItem?.patientName || generalInfo.name || 'Santosh Radhakrishna'}
                        />
                      </div>

                      {/* Laboratory Tests Ordered */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#7E22CE] border-b border-purple-200 pb-1">
                          5. Diagnostic Laboratory Tests Advised (Follow-up Review)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="font-bold text-gray-900 block">• Complete Lipid Profile (Fasting 12h)</span>
                            <span className="text-[11px] text-gray-600">Total Chol, Triglycerides, HDL, LDL, VLDL</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="font-bold text-gray-900 block">• Glycemic Panel & Glycation Index</span>
                            <span className="text-[11px] text-gray-600">Fasting Plasma Glucose, Post-prandial Glucose, HbA1c</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="font-bold text-gray-900 block">• Hepatic & Renal Function Battery</span>
                            <span className="text-[11px] text-gray-600">Serum Urea, Creatinine, eGFR, AST/SGOT, ALT/SGPT</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="font-bold text-gray-900 block">• Urine Routine & Microalbumin</span>
                            <span className="text-[11px] text-gray-600">Spot urinary albumin-to-creatinine ratio (ACR)</span>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Lifestyle Directives */}
                      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5 text-xs text-gray-800">
                        <h5 className="font-black text-purple-950 uppercase text-[11px]">
                          Essential Clinical Compliance Directives:
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                          <li>Adhere strictly to 1,500 kcal prescribed meal timings. Consume high-fiber salad 10 minutes prior to complex carbohydrates.</li>
                          <li>Hydrate with minimum 2.8 Liters room-temperature water daily to maintain renal nitrogen balance.</li>
                          <li>Perform Shatapadi (100-step light walk) for 15 minutes immediately post-lunch and post-dinner.</li>
                          <li>Repeat BCA Body Composition Analysis on Day 30 and venous blood laboratory draw on Day 90.</li>
                        </ul>
                      </div>

                      {/* Clinician Signature Block */}
                      <div className="pt-8 flex items-end justify-between text-xs">
                        <div className="font-mono text-[11px] text-gray-500">
                          <span>E-Prescription Security Hash: </span>
                          <span className="text-gray-800 font-bold">#ZIA-AES256-CLINICAL-VALIDATED</span>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="w-48 border-b-2 border-gray-900 mx-auto pb-1">
                            <span className="font-serif italic font-bold text-purple-900 text-sm">Dr. Bharathkumar</span>
                          </div>
                          <span className="font-bold text-gray-900 block">Consulting Sports Medicine Physician</span>
                          <span className="text-[10px] text-gray-500 block">ŽIATHLON SPORTS MEDICINE CLINIC</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Back Button */}
            <div className="pt-4 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={onBackToMainFolders}
                className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Complete & Back to 7 Main Folders</span>
              </button>
            </div>
          </div>
        );
      })()}
        </div>
      </div>

      {/* Zoom Modal for Full Size Report Inspection */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white border-2 border-[#7E22CE] rounded-2xl p-6 overflow-auto shadow-2xl text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-purple-200 mb-4">
              <span className="text-sm font-black uppercase text-gray-950">Full Size Report Inspection</span>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1.5 rounded-lg bg-purple-100 text-purple-900 hover:bg-purple-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {uploadedReportUrl ? (
              <img src={uploadedReportUrl} alt="Report Scan" className="w-full h-auto rounded object-contain border border-purple-200" />
            ) : (
              <div className="p-8 text-center text-gray-600 font-mono text-sm">
                Default Venous Blood Specimen Scan (REF: LAB-2026-99)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MedicalSection = MedicinalSection;
export type MedicalSectionProps = MedicinalSectionProps;

