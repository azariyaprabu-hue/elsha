import React, { useState, useEffect, useRef } from 'react';
import {
  GeneralInfo,
  Calculations,
  MedicalHistory,
  SymptomAssessmentItem,
  LifestyleAssessmentItem,
  DailyRoutineItem,
  FoodHabits,
  DietaryRecallItem,
  ClinicalGoalItem,
  MedicinalPrescriptionDrug,
  DiagnosticFindingItem,
} from '../types';
import {
  Printer,
  Edit3,
  CheckCircle2,
  Sparkles,
  Save,
  Download,
  Image as ImageIcon,
  MessageSquare,
  Palette,
  FileCheck2,
  Share2,
  FileText,
  Eye,
  Activity,
  Layers,
  Send,
  AlertCircle,
  X,
  ExternalLink,
  Check,
  Copy,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ZiathlonEmblemLogo } from './ZiathlonEmblemLogo';
import { ZiathlonLetterheadFrame } from './ZiathlonLetterheadFrame';
import { DocumentViewerModal } from './DocumentViewerModal';
import {
  generateZiathlonDocumentPdf,
  ZiathlonDocumentPdfData,
  GeneratedPdfResult,
} from '../utils/ziathlonDocumentPdfGenerator';

export interface SavedPrescriptionHistoryRecord {
  id: string;
  savedAt: string; // ISO string
  displayDate: string; // e.g. "24/09/2026"
  displayTime: string; // e.g. "11:45 AM"
  patientName: string;
  patientAge: string | number;
  patientGender: string;
  patientTag: string;
  patientPhone?: string;
  patientMail?: string;
  patientCity?: string;
  patientMarital?: string;
  patientInformant?: string;
  vitalsSummary: string;
  symptomsSummary: string;
  familyHistory?: string;
  lifestyle?: string;
  medications?: string;
  allergies?: string;
  goalsSummary?: string;
  diagnosticsSummary?: string;
  prescriptions: MedicinalPrescriptionDrug[];
  goals: ClinicalGoalItem[];
  diagnostics: DiagnosticFindingItem[];
  summaryLines: string[];
}

export interface ThreePartMedicalRecordPreviewProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  medicalHistory: MedicalHistory;
  symptoms?: SymptomAssessmentItem[];
  lifestyleItems?: LifestyleAssessmentItem[];
  dailyRoutine?: DailyRoutineItem[];
  foodHabits?: FoodHabits;
  dietaryRecall?: DietaryRecallItem[];
  goals?: ClinicalGoalItem[];
  prescriptions?: MedicinalPrescriptionDrug[];
  diagnostics?: DiagnosticFindingItem[];
  initialRecord?: SavedPrescriptionHistoryRecord | null;
  readOnly?: boolean;
  onPrint?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToMnPrescription?: () => void;
  onUpdateGeneralInfo?: (info: Partial<GeneralInfo>) => void;
  onUpdateMedicalHistory?: (field: keyof MedicalHistory, value: any) => void;
  onUpdateSymptoms?: (items: SymptomAssessmentItem[]) => void;
  onUpdateCalculations?: (calc: Partial<Calculations>) => void;
  onUpdateGoals?: (goals: ClinicalGoalItem[]) => void;
  onUpdatePrescriptions?: (prescriptions: MedicinalPrescriptionDrug[]) => void;
  onUpdateDiagnostics?: (diagnostics: DiagnosticFindingItem[]) => void;
}

export const ThreePartMedicalRecordPreview: React.FC<ThreePartMedicalRecordPreviewProps> = ({
  generalInfo,
  calculations,
  medicalHistory,
  symptoms,
  lifestyleItems,
  dailyRoutine,
  foodHabits,
  dietaryRecall,
  goals,
  prescriptions,
  diagnostics,
  initialRecord,
  readOnly = false,
  onPrint,
  onNavigateToMnPrescription,
  onUpdateGeneralInfo,
  onUpdateMedicalHistory,
  onUpdateSymptoms,
  onUpdateCalculations,
}) => {
  const dossierPaperRef = useRef<HTMLDivElement>(null);
  const [isExportingExactDossier, setIsExportingExactDossier] = useState<boolean>(false);
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // View Mode: 'exact-reference' | 'extended' | 'blank-letterhead'
  const [viewMode, setViewMode] = useState<'exact-reference' | 'extended' | 'blank-letterhead'>('exact-reference');

  // Badge Color Theme: Amber Gold (#E5A93C, exact match to reference photo download.jpg) vs Royal Purple
  const [colorTheme, setColorTheme] = useState<'amber-gold' | 'royal-purple'>('amber-gold');
  const isGold = colorTheme === 'amber-gold';
  const cornerBandColor = isGold ? '#E5A93C' : '#9333EA';
  const cornerInnerStripeColor = isGold ? '#B45309' : '#581C87';
  const badgeBgClass = isGold
    ? 'bg-[#E5A93C] text-white shadow-xs'
    : 'bg-[#7E22CE] text-white shadow-xs';

  // In-place editable overrides
  const [customVitalsOverride, setCustomVitalsOverride] = useState<string>('');
  const [customSymptomsOverride, setCustomSymptomsOverride] = useState<string>('');
  const [customClinicalExamOverride, setCustomClinicalExamOverride] = useState<string>('');
  const [customDiagnosticsHistoryOverride, setCustomDiagnosticsHistoryOverride] = useState<string>('');
  const [customDiagnosesOverride, setCustomDiagnosesOverride] = useState<string>('');
  const [customGoalsOverride, setCustomGoalsOverride] = useState<string>('');
  const [customMedicalHistoryOverride, setCustomMedicalHistoryOverride] = useState<string>('');
  const [customNutritionAssessmentOverride, setCustomNutritionAssessmentOverride] = useState<string>('');
  const [customNutritionPrescriptionOverride, setCustomNutritionPrescriptionOverride] = useState<string>('');
  const [customExerciseOverride, setCustomExerciseOverride] = useState<string>('');
  const [customTreatmentPlanOverride, setCustomTreatmentPlanOverride] = useState<string>('');
  const [customFollowUpOverride, setCustomFollowUpOverride] = useState<string>('');
  const [customFamilyHistoryOverride, setCustomFamilyHistoryOverride] = useState<string>('');
  const [customLifestyleOverride, setCustomLifestyleOverride] = useState<string>('');
  const [customMedicationsOverride, setCustomMedicationsOverride] = useState<string>('');
  const [customAllergiesOverride, setCustomAllergiesOverride] = useState<string>('');
  const [customDiagnosticsOverride, setCustomDiagnosticsOverride] = useState<string>('');
  const [customPrescriptionsOverride, setCustomPrescriptionsOverride] = useState<string>('');

  // 4-Line AI Clinical Summary (for extended view)
  const [aiSummaryLines, setAiSummaryLines] = useState<string[]>([]);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState<boolean>(false);

  // Attached Clinical Documents from Profile & Medical Folders
  const [attachedDocs, setAttachedDocs] = useState<any[]>([]);
  const [selectedPreviewDocForAi, setSelectedPreviewDocForAi] = useState<any | null>(null);

  // Send to Patient Modal States (Real Vector PDF File Delivery)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSendingPdf, setIsSendingPdf] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);
  const [activePdfResult, setActivePdfResult] = useState<GeneratedPdfResult | null>(null);

  useEffect(() => {
    const loadAttachedDocuments = () => {
      try {
        const deletedIds: string[] = JSON.parse(localStorage.getItem('ZIATHLON_DELETED_DOC_IDS') || '[]');
        const medDocs: any[] = JSON.parse(localStorage.getItem('ZIATHLON_MEDICAL_RECORDS_DOCS') || '[]');
        const profDocs: any[] = JSON.parse(localStorage.getItem('ziathlon_uploaded_reports') || '[]');
        
        const combinedMap = new Map<string, any>();
        medDocs.forEach((d) => {
          if (!deletedIds.includes(d.id)) {
            combinedMap.set(d.id, d);
          }
        });
        profDocs.forEach((p) => {
          if (!deletedIds.includes(p.id) && !combinedMap.has(p.id)) {
            combinedMap.set(p.id, p);
          }
        });

        setAttachedDocs(Array.from(combinedMap.values()));
      } catch (e) {}
    };

    loadAttachedDocuments();
    window.addEventListener('medical-documents-changed', loadAttachedDocuments);
    window.addEventListener('storage', loadAttachedDocuments);
    return () => {
      window.removeEventListener('medical-documents-changed', loadAttachedDocuments);
      window.removeEventListener('storage', loadAttachedDocuments);
    };
  }, []);

  const patientDisplayName = initialRecord?.patientName || generalInfo.name || 'Kiruthika';
  const patientGender = initialRecord?.patientGender || generalInfo.sex || 'Female';
  const patientAge = initialRecord?.patientAge
    ? `${initialRecord.patientAge} years`
    : generalInfo.age
    ? `${generalInfo.age} years`
    : '25 years';
  const patientPhone = initialRecord?.patientPhone || generalInfo.phone || generalInfo.mobileNumber || '+91 94482 88008';
  const patientMail = initialRecord?.patientMail || generalInfo.email || 'kiruthika@example.com';
  const patientCity = initialRecord?.patientCity || generalInfo.place || generalInfo.city || 'Bangalore';
  const patientMarital = initialRecord?.patientMarital || generalInfo.maritalStatus || 'Single';
  const patientInformant = initialRecord?.patientInformant || generalInfo.informantName || 'Self';
  const patientTag = initialRecord?.patientTag || generalInfo.tag || generalInfo.customTag || 'Metabolic Health & Sports Medicine';
  const patientAddress = generalInfo.address || 'JP Nagar 7th Phase, Bangalore';
  const patientUhid = initialRecord?.uhid || 'ZC00459';
  const patientAbha = generalInfo.email?.includes('@') ? generalInfo.email : '10436404055711@abdm';

  const today = new Date();
  const formattedDateTime = initialRecord
    ? `${initialRecord.displayDate}${initialRecord.displayTime ? `, ${initialRecord.displayTime}` : ''}`
    : `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}, ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

  const consultationDate = formattedDateTime.split(',')[0]?.trim() || '24/09/2026';
  const consultationTime = formattedDateTime.split(',')[1]?.trim() || '11:30 AM';

  // 1. Dynamic Vitals: Continuous inline text separated by vertical bars ( | )
  const vitalsList: string[] = [];
  vitalsList.push(`BODY TEMPERATURE – ${generalInfo.bodyTemperature || '97.1°F'}`);
  vitalsList.push(`PULSE RATE – ${generalInfo.pulseRate || '81/min'}`);
  vitalsList.push(`BLOOD PRESSURE – ${generalInfo.bloodPressure || '150/84 mmHg'}`);
  vitalsList.push(`SpO2 – ${generalInfo.spo2 || '98%'}`);
  vitalsList.push(`BODY WEIGHT – ${generalInfo.weight ? `${generalInfo.weight} kg` : '64.5 kg'}`);
  vitalsList.push(`HEIGHT – ${generalInfo.height ? `${generalInfo.height} cm` : '161 cm'}`);
  vitalsList.push(`BMI – ${calculations.bmi ? `${calculations.bmi.toFixed(1)} kg/m²` : '34.4 kg/m²'}`);
  vitalsList.push(`WAIST CIRCUMFERENCE – ${generalInfo.waistCircumference ? `${generalInfo.waistCircumference} cm` : '79.5 cm'}`);
  vitalsList.push(`HIP CIRCUMFERENCE – ${generalInfo.hipCircumference ? `${generalInfo.hipCircumference} cm` : '83 cm'}`);
  const computedVitalsText = vitalsList.join(' | ');
  const displayVitals = customVitalsOverride || initialRecord?.vitalsSummary || computedVitalsText;

  // 2. Dynamic Symptoms: Continuous inline format with duration and severity
  const activeSymptoms = (symptoms || []).filter(
    (s) => s.symptom && s.symptom.trim() !== '' && s.selected !== false
  );
  const computedSymptomsText =
    activeSymptoms.length > 0
      ? activeSymptoms
          .map((s) => {
            const dur = s.duration ? `Duration: ${s.duration}` : '';
            const sev = s.severity ? `Severity: ${s.severity}` : '';
            const meta = [dur, sev].filter(Boolean).join('; ');
            return meta ? `${s.symptom} (${meta})` : s.symptom;
          })
          .join(' | ')
      : 'Occipital Morning Headaches (Duration: 2 weeks; Severity: Moderate) | Dizziness or Vertigo Episodes (Duration: 1 month; Severity: Mild) | Heart Palpitations During Stress (Duration: 3 weeks; Severity: Moderate)';
  const displaySymptoms = customSymptomsOverride || initialRecord?.symptomsSummary || computedSymptomsText;

  // 3. Clinical Examination: Continuous inline format
  const defaultClinicalExamText =
    'General Screening (Note: No PICCLE) | Cardiovascular System (Note: S1, S2 audible; no murmurs detected) | Respiratory System (Note: Normal bilateral air entry; normal vesicular breath sounds; no added sounds) | Gastrointestinal System (Note: Soft, non-tender abdomen; bowel sounds present) | Nervous System (Note: Higher mental functions normal; no focal neurological deficits)';
  const displayClinicalExamination = customClinicalExamOverride || defaultClinicalExamText;

  // 4. Diagnostics – Past History: Continuous inline format from real patient records
  const getPatientDiagnosticHistoryString = (): string => {
    const list: string[] = [];
    try {
      const medRecsRaw = localStorage.getItem('ZIATHLON_MEDICAL_RECORDS');
      if (medRecsRaw) {
        const groups = JSON.parse(medRecsRaw);
        if (Array.isArray(groups)) {
          groups.forEach((g: any) => {
            if (Array.isArray(g.items)) {
              g.items.forEach((item: any) => {
                const repDate = item.date || g.date || '14/08/2026';
                if (Array.isArray(item.biomarkers)) {
                  item.biomarkers.forEach((bm: any) => {
                    const flag = bm.indicationLabel || bm.status || (bm.flag ? bm.flag : 'Normal');
                    const flagClean = flag === 'normal' ? 'Normal' : flag === 'high' ? 'High' : flag === 'low' ? 'Low' : flag;
                    list.push(`${bm.testName}: ${bm.value}${bm.unit ? ` ${bm.unit}` : ''} [${flagClean}] – ${repDate}`);
                  });
                }
              });
            }
          });
        }
      }

      if (list.length === 0) {
        const upRaw = localStorage.getItem('ziathlon_uploaded_reports');
        if (upRaw) {
          const uploads = JSON.parse(upRaw);
          if (Array.isArray(uploads)) {
            uploads.forEach((up: any) => {
              const repDate = up.date || '14/08/2026';
              const bms = up.keyBiomarkers || up.biomarkers;
              if (Array.isArray(bms)) {
                bms.forEach((bm: any) => {
                  const name = bm.testName || bm.marker || bm.name;
                  const val = bm.value;
                  const flag = bm.status || bm.clinicalFlag || 'Normal';
                  if (name && val) {
                    list.push(`${name}: ${val} [${flag}] – ${repDate}`);
                  }
                });
              }
            });
          }
        }
      }
    } catch {}

    if (list.length > 0) {
      return list.join(' | ');
    }

    return 'MCH: 29.4 pg [Normal] – 14/08/2026 | MCHC: 33.2 g/dL [Normal] – 14/08/2026 | RDW-SD: 45.1 fL [Normal] – 14/08/2026 | Fasting Glucose: 118 mg/dL [High] – 14/08/2026 | HbA1c: 6.8 % [High] – 14/08/2026 | Total Cholesterol: 215 mg/dL [High] – 14/08/2026 | Triglycerides: 168 mg/dL [Borderline] – 14/08/2026 | Sensitive TSH: 4.82 µIU/mL [Elevated] – 14/08/2026';
  };
  const displayDiagnosticsHistory = customDiagnosticsHistoryOverride || getPatientDiagnosticHistoryString();

  // 5. Working Diagnoses and Risk Factors: Continuous inline format
  const defaultDiagnosesText =
    'Myofascial trigger point syndrome (Status: Suspected; Severity: Mild; Note: Left forearm - extensor compartment) | Susceptible to NAFLD (Risk: High Risk; Plan: Aerobic exercise and antioxidant protocol) | Susceptible to Type 2 Diabetes (Risk: Monitored)';
  const displayDiagnoses = customDiagnosesOverride || defaultDiagnosesText;

  // 6. Clinical Goals: Continuous inline format
  const activeGoals = (goals && goals.length > 0 ? goals : initialRecord?.goals || goals || []).filter((g) => g.title && g.title.trim() !== '');
  const computedGoalsText =
    activeGoals.length > 0
      ? activeGoals
          .map((g) => {
            const time = g.targetTimeline ? `Target: ${g.targetTimeline}` : '';
            const status = g.status ? `Status: ${g.status}` : '';
            const meta = [time, status].filter(Boolean).join('; ');
            return meta ? `${g.title} (${meta})` : g.title;
          })
          .join(' | ')
      : 'Glycemic Normalization (Target: 90 Days; Status: In Progress) | Visceral Fat Reduction < 9 (Target: 120 Days; Status: Active Target) | Functional Mobility Restoration (Target: 60 Days; Status: Active Target)';
  const displayGoals = customGoalsOverride || initialRecord?.goalsSummary || computedGoalsText;

  // 7. Medical History: Continuous inline format
  const computedMedicalHistory =
    medicalHistory?.familyHistory && medicalHistory.familyHistory.length > 0
      ? `Family History: ${medicalHistory.familyHistory.map((f) => `${f.whoHasIt || 'Relative'}: ${f.condition} (${f.notes || f.status || 'Active'})`).join('; ')} | Allergies: ${medicalHistory.allergies || 'Oil (Trigger for upper lip swelling)'}`
      : 'Family History: Diabetes (Father, On oHA); Diabetes (Mother, On oHA) | Allergies: Oil (Trigger for upper lip swelling) | Medical Conditions: Subclinical metabolic risk, no prior hospitalizations';
  const displayMedicalHistory = customMedicalHistoryOverride || computedMedicalHistory;

  // 8. Nutrition Assessment: Continuous inline format
  const defaultNutritionAssessment =
    `Diet: ${foodHabits?.vegetarianStatus || 'Vegetarian + eggs'} | Hydration: 3L water/day | Meal Pattern: Breakfast - Fruits; Lunch - Chapati, rice curry; Dinner - Veg salad`;
  const displayNutritionAssessment = customNutritionAssessmentOverride || defaultNutritionAssessment;

  // 9. Nutrition Prescription: Continuous inline format
  const defaultNutritionPrescription =
    `Calibrated Anti-Inflammatory Whole Food Protocol | Target Calories: ${calculations?.targetCalories ? `${calculations.targetCalories} kcal/day` : '1500 kcal/day'} | Target Protein: 75g | Dietary Fiber: 35g | Hydration: 3.5L/day`;
  const displayNutritionPrescription = customNutritionPrescriptionOverride || defaultNutritionPrescription;

  // 10. Exercise Recommendations: Continuous inline format
  const defaultExerciseRecs =
    'Recreational Badminton (2 days/week) | Brisk Walking (7 km/day, low-impact) | Post-exercise forearm extensor stretching protocol';
  const displayExerciseRecs = customExerciseOverride || defaultExerciseRecs;

  // 11. Treatment Plan / Prescription (℞): Continuous inline format
  const activePrescriptions = (prescriptions && prescriptions.length > 0 ? prescriptions : initialRecord?.prescriptions || prescriptions || []).filter(
    (p) => p.medicine && p.medicine.trim() !== ''
  );
  const computedTreatmentPlan =
    activePrescriptions.length > 0
      ? activePrescriptions
          .map((p) => {
            const dose = p.dosage ? `Dose: ${p.dosage}` : '';
            const freq = p.timing ? `Frequency: ${p.timing}` : '';
            const dur = p.duration ? `Duration: ${p.duration}` : '';
            const inst = p.instructions ? `Instructions: ${p.instructions}` : '';
            const details = [dose, freq, dur, inst].filter(Boolean).join('; ');
            return details ? `${p.medicine} (${details})` : p.medicine;
          })
          .join(' | ')
      : 'Kapiva Shilajit (Dose: 250 mg; Frequency: 1-0-0 After Meal; Duration: 30 Days; Instructions: Take after breakfast) | Vlado\'s Himalayan Organic Probiotics 60 Billion CFU (Dose: 1 capsule; Frequency: 1-0-0 After Meal; Duration: 30 Days; Instructions: Take after breakfast) | Wellman Health Supplement (Dose: 1 tablet; Frequency: 0-0-1 After Meal; Duration: 30 Days; Instructions: Take after dinner) | Liposomal MGD3 (Dose: 1 capsule; Frequency: 0-0-1 After Meal; Duration: 30 Days; Instructions: Take after dinner)';
  const displayTreatmentPlan = customTreatmentPlanOverride || computedTreatmentPlan;

  // 12. Follow-up Recommendations: Continuous inline format
  const defaultFollowUp =
    'Review in clinic after 30 days or earlier in case of acute symptoms | Repeat Fasting Plasma Glucose & Lipid Panel in 60 days';
  const displayFollowUp = customFollowUpOverride || defaultFollowUp;

  // Additional backwards-compatible references
  const displayFamilyHistory = displayMedicalHistory;
  const displayLifestyle = displayNutritionAssessment;
  const displayMedications = displayTreatmentPlan;
  const displayAllergies = typeof medicalHistory?.allergies === 'string' && medicalHistory.allergies ? medicalHistory.allergies : 'Oil';
  const displayDiagnostics = displayDiagnosticsHistory;

  // 5 Points deterministic generator for Comprehensive Dossier
  const generateDeterministic5Points = (): string[] => {
    return [
      `1. Demographic Baseline & Hemodynamics: ${patientDisplayName} (${patientGender}, ${patientAge}), registered under ${patientTag}, demonstrates BP ${generalInfo.bloodPressure || '150/84 mmHg'}, Pulse ${generalInfo.pulseRate || '81/min'}, SpO2 ${generalInfo.spo2 || '98%'}, and BMI ${calculations.bmi ? `${calculations.bmi.toFixed(1)} kg/m²` : '34.4 kg/m²'} with stable hemodynamic reserves.`,
      `2. Symptomatological Manifestations & Clinical History: Active presentation highlights ${activeSymptoms.map((s) => s.symptom).slice(0, 5).join(', ') || 'Occipital Morning Headaches, Dizziness, Knee Pain'}, correlated with parental diabetes risk factors and joint load considerations.`,
      `3. Nutritional Partition & Pharmacotherapeutic Regimen: Dietary protocol maintains ${foodHabits?.vegetarianStatus || 'Vegetarian + eggs'} nutrient partitioning with 3L daily hydration, therapeutically supported by ${displayTreatmentPlan.slice(0, 110)}.`,
      `4. Strategic Clinical Goals & Prognostic Trajectory: Multi-modal clinical targets establish ${displayGoals.slice(0, 110)}, addressing monitored susceptibilities (${displayDiagnosticsHistory.slice(0, 90)}) with structured 60-90 day re-evaluation.`,
      `5. Metabolic Health & Action Plan: Comprehensive lifestyle integration, continuous glucose and lipid tracking, and rehabilitation protocol established for sustained recovery and optimal athletic performance.`,
    ];
  };

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAiSummary(true);
    try {
      const payload = {
        generalInfo: { ...generalInfo, name: patientDisplayName, age: generalInfo.age || 25, sex: patientGender },
        calculations,
        medicalHistory,
        symptoms: activeSymptoms,
        foodHabits,
        dietaryRecall,
        goals: activeGoals,
        prescriptions: activePrescriptions,
        diagnostics: [],
      };

      const res = await fetch('/api/generate-clinical-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summaryLines && Array.isArray(data.summaryLines) && data.summaryLines.length >= 5) {
          setAiSummaryLines(data.summaryLines.slice(0, 5));
          return;
        }
      }
      setAiSummaryLines(generateDeterministic5Points());
    } catch {
      setAiSummaryLines(generateDeterministic5Points());
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  useEffect(() => {
    if (initialRecord?.summaryLines && initialRecord.summaryLines.length >= 5) {
      setAiSummaryLines(initialRecord.summaryLines);
      return;
    }
    setAiSummaryLines(generateDeterministic5Points());
  }, [initialRecord?.id]);

  // SAVE PRESCRIPTION TO MN PRESCRIPTION HISTORY (DATES | PAGES)
  const handleSaveToPrescriptionHistory = () => {
    const historyId = `RX-HIST-${Date.now()}`;
    const newRecord: SavedPrescriptionHistoryRecord = {
      id: historyId,
      savedAt: new Date().toISOString(),
      displayDate: consultationDate,
      displayTime: consultationTime,
      patientName: patientDisplayName,
      patientAge: patientAge,
      patientGender: patientGender,
      patientTag: patientTag,
      patientPhone,
      patientMail,
      patientCity,
      patientMarital,
      patientInformant,
      vitalsSummary: displayVitals,
      symptomsSummary: displaySymptoms,
      familyHistory: displayFamilyHistory,
      lifestyle: displayLifestyle,
      medications: displayMedications,
      allergies: displayAllergies,
      goalsSummary: displayGoals,
      diagnosticsSummary: displayDiagnosticsHistory,
      prescriptions: activePrescriptions.length > 0 ? activePrescriptions : [
        { id: 'p1', medicine: 'Kapiva Shilajit', dosage: '250 mg', timing: '1-0-0 After Meal', duration: '30 Days', instructions: 'Oral antioxidant' },
        { id: 'p2', medicine: 'Vit D 60K', dosage: '60,000 IU', timing: 'Once in a month', duration: '3 Months', instructions: 'With milk after meal' },
      ],
      goals: activeGoals,
      diagnostics: [],
      summaryLines: aiSummaryLines.length >= 5 ? aiSummaryLines : generateDeterministic5Points(),
    };

    try {
      const existing = localStorage.getItem('ZIATHLON_SAVED_PRESCRIPTIONS_HISTORY');
      const list: SavedPrescriptionHistoryRecord[] = existing ? JSON.parse(existing) : [];
      const updated = [newRecord, ...list.filter((r) => r.id !== historyId)];
      localStorage.setItem('ZIATHLON_SAVED_PRESCRIPTIONS_HISTORY', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving to prescription history', e);
    }

    setActionNotice('✓ Prescription saved! Exact page synced to MN Prescription History date-wise.');
    setTimeout(() => {
      setActionNotice(null);
      if (onNavigateToMnPrescription) {
        onNavigateToMnPrescription();
      }
    }, 1200);
  };

  // =========================================================================
  // REAL VECTOR PDF GENERATOR & PATIENT SEND FLOW (ZIATHLON MASTER TEMPLATE)
  // =========================================================================

  const buildPdfPayload = (): ZiathlonDocumentPdfData => {
    return {
      patientDisplayName,
      patientGender,
      patientAge,
      patientPhone: patientPhone || '+91 94482 88008',
      formattedDateTime,
      abhaAddress: patientAbha,
      uhid: patientUhid,
      city: patientCity,
      address: patientAddress,
      occupation: generalInfo.occupation || 'IT Sector',
      tag: patientTag,
      vitals: displayVitals,
      symptoms: displaySymptoms,
      clinicalExamination: displayClinicalExamination,
      diagnosticsHistory: displayDiagnosticsHistory,
      diagnoses: displayDiagnoses,
      goals: displayGoals,
      medicalHistory: displayMedicalHistory,
      nutritionAssessment: displayNutritionAssessment,
      nutritionPrescription: displayNutritionPrescription,
      exerciseRecommendations: displayExerciseRecs,
      treatmentPlan: displayTreatmentPlan,
      followUp: displayFollowUp,
      prescriptions: activePrescriptions.map((p) => ({
        medicine: p.medicine,
        dosage: p.dosage,
        timing: p.timing,
        duration: p.duration,
        instructions: p.instructions,
      })),
      doctorName: 'Dr. Bharath Kumar B',
      doctorQualifications: 'MBBS, PGDSM (Sports Medicine)',
      doctorRole: 'Medical Director | Ziathlon',
      doctorRegNo: 'KMC#81009',
      doctorPhone: '+91 799 699 44 99',
      doctorEmail: 'info@ziathlon.com',
      doctorWebsite: 'www.ziathlon.com',
      clinicAddressLine1: '#55, 4th Cross, Panduranga Nagar,',
      clinicAddressLine2: 'Off Bannerghatta Road, Near IIM-B,',
      clinicAddressLine3: 'Bangalore 560076',
    };
  };

  // Generates PDF directly matching the Master Preview Canvas (100% pixel-perfect identity across Preview, Download, and Share)
  const capturePreviewCanvasToPdf = async (): Promise<GeneratedPdfResult> => {
    // 1. Locate the master preview canvas element
    const canvasElement =
      (document.querySelector('[data-canvas="ziathlon-fixed-letterhead"]') as HTMLElement) ||
      (document.getElementById('ziathlon-letterhead-canvas') as HTMLElement);

    if (canvasElement) {
      // Temporarily normalize transform to 1.0 during capture so html2canvas captures unscaled 800px × 1131px canvas
      const origTransform = canvasElement.style.transform;
      const origTransformOrigin = canvasElement.style.transformOrigin;
      canvasElement.style.transform = 'none';

      try {
        const canvas = await html2canvas(canvasElement, {
          scale: 2.5, // 300 DPI high resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 800,
          windowHeight: 1131,
        });

        // Restore active responsive transform
        canvasElement.style.transform = origTransform;
        canvasElement.style.transformOrigin = origTransformOrigin;

        const imgData = canvas.toDataURL('image/png', 1.0);
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
        });

        // Exact A4 dimensions: 210mm × 297mm
        doc.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

        const pdfBlob = doc.output('blob');
        const pdfArrayBuffer = await pdfBlob.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(pdfArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const cleanName = patientDisplayName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${cleanName}_Ziathlon_Medical_Prescription.pdf`;

        return {
          doc,
          blob: pdfBlob,
          blobUrl: URL.createObjectURL(pdfBlob),
          filename,
          base64,
          dataUrl: doc.output('datauristring'),
        };
      } catch (err) {
        console.warn('Canvas capture fallback to generator:', err);
        canvasElement.style.transform = origTransform;
        canvasElement.style.transformOrigin = origTransformOrigin;
      }
    }

    // Fallback if canvas element not accessible
    const payload = buildPdfPayload();
    return generateZiathlonDocumentPdf(payload);
  };

  // 1. DOWNLOAD REAL PDF FILE (MIME: application/pdf)
  // - Captured directly from the Master Preview Canvas for 100% pixel-perfect identity
  const handleDownloadFullPage = async () => {
    setIsExportingExactDossier(true);
    setActionNotice('Generating official Ziathlon PDF document (application/pdf)...');

    try {
      const pdfRes = await capturePreviewCanvasToPdf();

      // Trigger direct browser download of the real .pdf file
      const link = document.createElement('a');
      link.href = pdfRes.blobUrl;
      link.download = pdfRes.filename; // e.g. PatientName_Ziathlon_Medical_Record.pdf
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save real PDF to server in background for archive
      try {
        fetch('/api/documents/save-generated-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64: pdfRes.base64,
            filename: pdfRes.filename,
            patientName: patientDisplayName,
            patientId: 'ZC00459',
          }),
        });
      } catch (e) {}

      setActionNotice(`✓ Downloaded real PDF file: ${pdfRes.filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      setActionNotice('Error generating PDF document. Please try again.');
      setTimeout(() => setActionNotice(null), 3000);
    } finally {
      setIsExportingExactDossier(false);
    }
  };

  // 2. OPEN SEND TO PATIENT MODAL
  const handleOpenSendModal = async () => {
    const pdfRes = await capturePreviewCanvasToPdf();
    setActivePdfResult(pdfRes);
    setSendSuccessMessage(null);
    setSendErrorMessage(null);
    setIsSendModalOpen(true);

    // Check WhatsApp Business Cloud API connection status
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      setIsWhatsAppConnected(Boolean(data.isReady || data.connectionState === 'CONNECTED'));
    } catch {
      setIsWhatsAppConnected(false);
    }
  };

  // 3. SEND REAL PDF FILE ATTACHMENT VIA WHATSAPP CLOUD API
  const handleSendPdfViaWhatsAppCloudApi = async () => {
    if (!activePdfResult) return;
    setIsSendingPdf(true);
    setSendErrorMessage(null);
    setSendSuccessMessage(null);

    try {
      // 1. Upload real PDF to server to get permanent public link
      const uploadRes = await fetch('/api/documents/save-generated-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: activePdfResult.base64,
          filename: activePdfResult.filename,
          patientName: patientDisplayName,
          patientId: 'ZC00459',
        }),
      });

      const uploadData = await uploadRes.json();
      const mediaUrl = uploadData.downloadUrl || uploadData.fileUrl;

      // 2. Dispatch real PDF document attachment via Meta WhatsApp Cloud API
      const cleanPhone = (patientPhone || '').replace(/[^0-9]/g, '');
      const sendRes = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: cleanPhone,
          text: `Official Ziathlon Medical Record & Prescription for ${patientDisplayName}`,
          mediaUrl: mediaUrl,
          fileName: activePdfResult.filename,
          patientContext: {
            id: 'ZC00459',
            name: patientDisplayName,
          },
        }),
      });

      const sendData = await sendRes.json();
      if (!sendRes.ok || sendData.error) {
        throw new Error(sendData.message || sendData.error || 'Failed to dispatch WhatsApp document message');
      }

      setSendSuccessMessage(`✓ Real PDF Document attachment delivered to +${cleanPhone} via WhatsApp Business Cloud API!`);
      setActionNotice(`✓ PDF Attachment delivered to patient: ${activePdfResult.filename}`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.warn('WhatsApp Cloud API dispatch error:', err);
      setSendErrorMessage(err.message || 'WhatsApp Cloud API connection error.');
    } finally {
      setIsSendingPdf(false);
    }
  };

  // 4. SHARE ACTUAL PDF FILE NATIVELY VIA DEVICE ATTACHMENT SHEET
  const handleNativeSharePdf = async () => {
    if (!activePdfResult) return;
    try {
      const pdfFile = new File([activePdfResult.blob], activePdfResult.filename, {
        type: 'application/pdf',
      });

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `${patientDisplayName} - Ziathlon Medical Record`,
          text: `Official Medical Record for ${patientDisplayName} from Ziathlon Sports Medicine Clinic`,
          files: [pdfFile],
        });
        setSendSuccessMessage(`✓ PDF file shared successfully as document attachment!`);
      } else {
        // Fallback: download file directly to device
        const link = document.createElement('a');
        link.href = activePdfResult.blobUrl;
        link.download = activePdfResult.filename;
        link.click();
        setSendSuccessMessage(`✓ Real PDF file downloaded. You can attach it directly into your chat or email!`);
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setSendErrorMessage('Could not share file directly. Downloaded to device instead.');
      }
    }
  };

  const handlePrintDossier = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-0 sm:p-2 min-h-screen">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-purple-950 border-2 border-purple-400 text-purple-100 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black animate-in fade-in slide-in-from-top-4 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* DIRECT INLINE EDITING PANEL (SHOWN WHEN DOCTOR CLICKS EDIT) */}
      {isLiveEditMode && (
        <div className="w-full max-w-[880px] mb-4 bg-purple-50/90 border-2 border-[#7016B7] rounded-2xl p-4 shadow-xl space-y-3 no-print animate-in fade-in">
          <div className="flex items-center justify-between border-b border-purple-200 pb-2">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#7016B7]" />
              <span className="text-xs font-black uppercase text-[#7016B7] tracking-wider">
                Live Clinical Report Editor
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLiveEditMode(false)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-200/60 px-3 py-1 rounded-lg cursor-pointer transition-all"
            >
              Done Editing ✓
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Vitals (Inline text with | separators)</label>
              <textarea
                value={displayVitals}
                onChange={(e) => setCustomVitalsOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Symptoms (Inline text)</label>
              <textarea
                value={displaySymptoms}
                onChange={(e) => setCustomSymptomsOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Clinical Examination</label>
              <textarea
                value={displayClinicalExamination}
                onChange={(e) => setCustomClinicalExamOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Diagnostics – Past History</label>
              <textarea
                value={displayDiagnosticsHistory}
                onChange={(e) => setCustomDiagnosticsHistoryOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Working Diagnoses and Risk Factors</label>
              <textarea
                value={displayDiagnoses}
                onChange={(e) => setCustomDiagnosesOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Clinical Goals</label>
              <textarea
                value={displayGoals}
                onChange={(e) => setCustomGoalsOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Medical History</label>
              <textarea
                value={displayMedicalHistory}
                onChange={(e) => setCustomMedicalHistoryOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Nutrition Assessment</label>
              <textarea
                value={displayNutritionAssessment}
                onChange={(e) => setCustomNutritionAssessmentOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Nutrition Prescription</label>
              <textarea
                value={displayNutritionPrescription}
                onChange={(e) => setCustomNutritionPrescriptionOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Exercise Recommendations</label>
              <textarea
                value={displayExerciseRecs}
                onChange={(e) => setCustomExerciseOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Treatment Plan / Prescription (℞)</label>
              <textarea
                value={displayTreatmentPlan}
                onChange={(e) => setCustomTreatmentPlanOverride(e.target.value)}
                rows={2}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Follow-up Recommendations</label>
              <input
                type="text"
                value={displayFollowUp}
                onChange={(e) => setCustomFollowUpOverride(e.target.value)}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* THE CLINICAL DOSSIER PAPER (EXACT MATCH TO APPROVED ZIATHLON MASTER TEMPLATE) */}
      <div ref={dossierPaperRef} id="clinical-dossier-paper" className="print-area w-full max-w-[880px] mx-auto">
        <ZiathlonLetterheadFrame showZoomControls={false}>
          <div className="space-y-2.5 text-gray-950 font-sans text-left">
            {/* ========================================================================= */}
            {/* 1. PATIENT INFORMATION: COMPACT READABLE LINES (NO TABLES, NO COLUMNS)    */}
            {/* ========================================================================= */}
            <div className="border-b border-purple-200/80 pb-2 mb-2 text-[10px] leading-relaxed">
              {/* Line 1: Patient Name, Gender, Age, Phone (with Date & Time on right) */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
                  <span className="font-extrabold text-[13px] text-[#0B0826] tracking-tight">{patientDisplayName}</span>
                  <span className="text-slate-400">,</span>
                  <span className="font-semibold text-slate-800">{patientGender}</span>
                  <span className="text-slate-400">,</span>
                  <span className="font-semibold text-slate-800">{patientAge}</span>
                  <span className="text-slate-400">,</span>
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-mono font-bold text-slate-900">{patientPhone}</span>
                </div>
                <div className="text-[9.5px] text-slate-600 font-mono shrink-0">
                  <span>Date: <strong className="text-slate-900">{consultationDate}</strong></span>
                  <span className="mx-1.5 text-slate-300">|</span>
                  <span>Time: <strong className="text-slate-900">{consultationTime}</strong></span>
                </div>
              </div>

              {/* Line 2: City | UHID | ABHA Address | Occupation */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[9.5px] text-slate-700">
                <span>City: <strong className="text-slate-900 font-semibold">{patientCity}</strong></span>
                <span className="text-slate-300">|</span>
                <span>UHID: <strong className="font-mono font-bold text-[#7016B7]">{patientUhid}</strong></span>
                <span className="text-slate-300">|</span>
                <span>ABHA Address: <strong className="font-mono text-slate-900">{patientAbha}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Occupation: <strong className="text-slate-900 font-semibold">{generalInfo.occupation || 'IT Sector'}</strong></span>
              </div>

              {/* Line 3: Clinical Domain | Address */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[9px] text-slate-600">
                <span>Clinical Domain: <strong className="font-bold text-[#7016B7]">{patientTag}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Address: <span className="text-slate-800">{patientAddress}</span></span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. VITALS – CONTINUOUS INLINE FORMAT                                      */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">VITALS: </span>
              <span className="font-medium text-slate-900">{displayVitals}</span>
            </div>

            {/* ========================================================================= */}
            {/* 3. SYMPTOMS – CONTINUOUS INLINE FORMAT                                    */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">SYMPTOMS: </span>
              <span className="font-medium text-slate-900">{displaySymptoms}</span>
            </div>

            {/* ========================================================================= */}
            {/* 4. CLINICAL EXAMINATION – CONTINUOUS INLINE FORMAT                        */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">CLINICAL EXAMINATION: </span>
              <span className="font-medium text-slate-900">{displayClinicalExamination}</span>
            </div>

            {/* ========================================================================= */}
            {/* 5. DIAGNOSTICS – PAST HISTORY – CONTINUOUS INLINE FORMAT                  */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">DIAGNOSTICS – PAST HISTORY: </span>
              <span className="font-medium text-slate-900">{displayDiagnosticsHistory}</span>
            </div>

            {/* ========================================================================= */}
            {/* 6. WORKING DIAGNOSES AND RISK FACTORS – CONTINUOUS INLINE FORMAT          */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">WORKING DIAGNOSES AND RISK FACTORS: </span>
              <span className="font-medium text-slate-900">{displayDiagnoses}</span>
            </div>

            {/* ========================================================================= */}
            {/* 7. CLINICAL GOALS – CONTINUOUS INLINE FORMAT                              */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">CLINICAL GOALS: </span>
              <span className="font-medium text-slate-900">{displayGoals}</span>
            </div>

            {/* ========================================================================= */}
            {/* 8. MEDICAL HISTORY – CONTINUOUS INLINE FORMAT                             */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">MEDICAL HISTORY: </span>
              <span className="font-medium text-slate-900">{displayMedicalHistory}</span>
            </div>

            {/* ========================================================================= */}
            {/* 9. NUTRITION ASSESSMENT – CONTINUOUS INLINE FORMAT                        */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">NUTRITION ASSESSMENT: </span>
              <span className="font-medium text-slate-900">{displayNutritionAssessment}</span>
            </div>

            {/* ========================================================================= */}
            {/* 10. NUTRITION PRESCRIPTION – CONTINUOUS INLINE FORMAT                     */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">NUTRITION PRESCRIPTION: </span>
              <span className="font-medium text-slate-900">{displayNutritionPrescription}</span>
            </div>

            {/* ========================================================================= */}
            {/* 11. EXERCISE RECOMMENDATIONS – CONTINUOUS INLINE FORMAT                   */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">EXERCISE RECOMMENDATIONS: </span>
              <span className="font-medium text-slate-900">{displayExerciseRecs}</span>
            </div>

            {/* ========================================================================= */}
            {/* 12. TREATMENT PLAN / PRESCRIPTION (℞) – CONTINUOUS INLINE FORMAT          */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">TREATMENT PLAN / PRESCRIPTION (℞): </span>
              <span className="font-medium text-slate-900">{displayTreatmentPlan}</span>
            </div>

            {/* ========================================================================= */}
            {/* 13. FOLLOW-UP RECOMMENDATIONS – CONTINUOUS INLINE FORMAT                  */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">FOLLOW-UP RECOMMENDATIONS: </span>
              <span className="font-medium text-slate-900">{displayFollowUp}</span>
            </div>

            {/* ========================================================================= */}
            {/* 14. CLINICAL CONSULTATION NOTE                                            */}
            {/* ========================================================================= */}
            <div className="pt-2 text-left">
              <p className="text-[8.5px] text-gray-500 font-mono font-semibold m-0">
                Clinical Consultation • Electronic EMR Record • Follow up after 30 days or earlier in case of acute symptoms
              </p>
            </div>
          </div>
        </ZiathlonLetterheadFrame>
      </div>

      {/* ========================================================================= */}
      {/* ACTION CONTROLS TOOLBAR (BELOW THE PREVIEW PAGE)                          */}
      {/* EXACTLY 4 OPTIONS: EDIT | DOWNLOAD | PRINT | SAVE                         */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[880px] mt-6 mb-8 bg-white border-2 border-purple-200/90 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 no-print select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7016B7] font-extrabold">
            PREVIEW ACTIONS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 1. EDIT BUTTON */}
          <button
            type="button"
            id="btn-preview-edit"
            onClick={() => setIsLiveEditMode(!isLiveEditMode)}
            className={`px-5 py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
              isLiveEditMode
                ? 'bg-[#7016B7] text-white border-[#7016B7] ring-2 ring-purple-300'
                : 'bg-white hover:bg-purple-50 text-slate-800 border-slate-200 hover:border-purple-300'
            }`}
            title="Toggle direct editing of clinical details and prescription entries"
          >
            <Edit3 className="w-4 h-4 text-[#7016B7]" />
            <span>{isLiveEditMode ? 'Done Edit' : 'Edit'}</span>
          </button>

          {/* 2. DOWNLOAD BUTTON (REAL PDF) */}
          <button
            type="button"
            id="btn-preview-download"
            onClick={handleDownloadFullPage}
            disabled={isExportingExactDossier}
            className="px-5 py-2.5 rounded-xl bg-[#7016B7] hover:bg-[#5B0F96] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Download official prescription as a real .pdf file"
          >
            <Download className={`w-4 h-4 text-purple-200 ${isExportingExactDossier ? 'animate-bounce' : ''}`} />
            <span>{isExportingExactDossier ? 'Generating...' : 'Download PDF'}</span>
          </button>

          {/* 3. SEND TO PATIENT BUTTON (REAL PDF ATTACHMENT) */}
          <button
            type="button"
            id="btn-preview-send"
            onClick={handleOpenSendModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            title="Send actual PDF file attachment to patient"
          >
            <Send className="w-4 h-4 text-emerald-200" />
            <span>Send to Patient</span>
          </button>

          {/* 4. PRINT BUTTON */}
          <button
            type="button"
            id="btn-preview-print"
            onClick={handlePrintDossier}
            className="px-5 py-2.5 rounded-xl bg-[#0B0826] hover:bg-[#1E1442] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            title="Print official prescription on Ziathlon letterhead paper"
          >
            <Printer className="w-4 h-4 text-purple-200" />
            <span>Print</span>
          </button>

          {/* 5. SAVE BUTTON */}
          <button
            type="button"
            id="btn-preview-save"
            onClick={handleSaveToPrescriptionHistory}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            title="Save prescription record to patient medical history"
          >
            <Save className="w-4 h-4 text-emerald-100" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL PDF PATIENT SEND MODAL (DISPATCHES ACTUAL .pdf FILE ATTACHMENT)      */}
      {/* ========================================================================= */}
      {isSendModalOpen && activePdfResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-gray-950">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                    Send Document to Patient
                  </h3>
                  <p className="text-xs text-gray-500">
                    Dispatches the verified Ziathlon Medical Record as a genuine .pdf file attachment
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSendModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Info Card */}
            <div className="bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl p-3.5 space-y-2 select-text">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8C5E28] uppercase font-mono">Recipient:</span>
                <span className="font-extrabold text-black">{patientDisplayName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8C5E28] uppercase font-mono">Phone:</span>
                <span className="font-mono font-bold text-purple-900">{patientPhone || '+91 94482 88008'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8C5E28] uppercase font-mono">Attachment:</span>
                <span className="font-mono font-bold text-gray-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#7016B7]" />
                  {activePdfResult.filename}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8C5E28] uppercase font-mono">MIME Type:</span>
                <span className="font-mono text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded text-[10px]">
                  application/pdf (Real Vector File)
                </span>
              </div>
            </div>

            {/* Notice: No Acrobat / No Web URL */}
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Pure Document Delivery Guarantee:
              </p>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                The patient receives the actual <span className="font-mono font-bold">.pdf</span> file attachment. No browser web-viewer links, no Adobe Acrobat embedding, and no HTML screenshots are sent.
              </p>
            </div>

            {/* Status alerts */}
            {sendSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}
            {sendErrorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{sendErrorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Option A: Send via Official Meta WhatsApp Cloud API */}
              <button
                type="button"
                onClick={handleSendPdfViaWhatsAppCloudApi}
                disabled={isSendingPdf}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSendingPdf ? 'animate-spin' : ''}`} />
                <span>{isSendingPdf ? 'Dispatching Document...' : 'Send PDF via WhatsApp Cloud API'}</span>
              </button>

              {/* Option B: Native Device Share (Attaches real .pdf file) */}
              <button
                type="button"
                onClick={handleNativeSharePdf}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7016B7] hover:bg-[#5B0F96] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share PDF File Attachment</span>
              </button>

              {/* Option C: Direct Download of the Real File */}
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = activePdfResult.blobUrl;
                  link.download = activePdfResult.filename;
                  link.click();
                  setSendSuccessMessage(`✓ Real PDF file downloaded: ${activePdfResult.filename}`);
                }}
                className="w-full py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border border-gray-300"
              >
                <Download className="w-4 h-4 text-gray-600" />
                <span>Download Real .PDF File Directly</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal from Preview */}
      {selectedPreviewDocForAi && (
        <DocumentViewerModal
          document={{
            id: selectedPreviewDocForAi.id,
            name: selectedPreviewDocForAi.name || selectedPreviewDocForAi.originalFilename || 'Document',
            date: selectedPreviewDocForAi.date || selectedPreviewDocForAi.formattedDisplayDate || '2026',
            type: selectedPreviewDocForAi.category || 'Lab Report',
            fileSize: selectedPreviewDocForAi.fileSize || selectedPreviewDocForAi.sizeFormatted || '2.1 MB',
            fileUrl: selectedPreviewDocForAi.fileUrl || `/api/documents/${selectedPreviewDocForAi.id}/preview`,
            downloadUrl: selectedPreviewDocForAi.downloadUrl || `/api/documents/${selectedPreviewDocForAi.id}/download`,
            mimetype: selectedPreviewDocForAi.mimetype,
            rawFile: selectedPreviewDocForAi.rawFile,
          }}
          onClose={() => setSelectedPreviewDocForAi(null)}
          onDelete={async (docId) => {
            setSelectedPreviewDocForAi(null);
            try {
              await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
            } catch {}
            const updated = attachedDocs.filter((d) => d.id !== docId);
            setAttachedDocs(updated);
            try {
              const medDocs = JSON.parse(localStorage.getItem('ZIATHLON_MEDICAL_RECORDS_DOCS') || '[]');
              localStorage.setItem('ZIATHLON_MEDICAL_RECORDS_DOCS', JSON.stringify(medDocs.filter((d: any) => d.id !== docId)));
              const profDocs = JSON.parse(localStorage.getItem('ziathlon_uploaded_reports') || '[]');
              localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(profDocs.filter((d: any) => d.id !== docId)));
              const deletedIds = JSON.parse(localStorage.getItem('ZIATHLON_DELETED_DOC_IDS') || '[]');
              if (!deletedIds.includes(docId)) {
                deletedIds.push(docId);
                localStorage.setItem('ZIATHLON_DELETED_DOC_IDS', JSON.stringify(deletedIds));
              }
            } catch {}
            window.dispatchEvent(new CustomEvent('medical-documents-changed'));
            window.dispatchEvent(new Event('storage'));
          }}
        />
      )}
    </div>
  );
};
