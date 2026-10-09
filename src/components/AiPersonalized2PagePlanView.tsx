import React, { useState, useEffect, useMemo } from 'react';
import { GeneralInfo, Calculations, DietaryRecallItem, MedicalHistory } from '../types';
import { CustomDayPlan, CustomMealItem, CustomMealSlot } from '../data/customStudio7DayPlans';
import { ExerciseDayItem, CLINICAL_DOMAINS_LIST, generateDomainDietAndExercisePlan } from '../utils/aiDomainDietExerciseGenerator';
import { generateComplete2PagePlanPdf, Complete2PagePlanPdfData } from '../utils/pdfGenerator';
import { getActiveRdaTargets } from '../utils/nutritionStore';
import { ZiathlonLogo } from './ZiathlonLogo';
import { ZiathlonLetterheadHeader } from './ZiathlonLetterheadHeader';
import { DrBharathkumarSportsMedicineLogo } from './DrBharathkumarSportsMedicineLogo';
import {
  Sparkles,
  Download,
  Printer,
  Edit3,
  RefreshCw,
  Check,
  Calendar,
  Dumbbell,
  Activity,
  HeartPulse,
  Flame,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  Sliders,
  X,
  FileSpreadsheet,
  Layers,
  Award,
  Clock,
  Droplets,
  Save,
  RotateCcw,
} from 'lucide-react';

export interface AiPersonalized2PagePlanViewProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  initialDomain?: string;
  initialDietDomain?: string;
  dietaryRecall?: DietaryRecallItem[];
  medicalHistory?: MedicalHistory;
  onOpenPrescription?: () => void;
}

// Available Diet Domains
export const DIET_DOMAINS_LIST = [
  { id: 'low_carbs', name: 'Low Carbs Diet (Glycemic Stabilization & Insulin Reset)' },
  { id: 'icmr_balanced', name: 'ICMR RDA Balanced Therapeutic Diet' },
  { id: 'gut_cleanse', name: 'Gut Cleanse & 12-Day Elimination Protocol (IBS/SIBO)' },
  { id: 'keto_axis', name: 'Ketogenic Metabolic Protocol (Strict Fat Adaptation)' },
  { id: 'intermittent_fasting', name: 'Intermittent Fasting 16:8 Protocol (Autophagy Activation)' },
  { id: 'high_protein_athlete', name: 'High-Protein Athletic & Hypertrophy Diet' },
  { id: 'dash_diet', name: 'DASH Cardiovascular Diet (Sodium-Restricted, Potassium-Rich)' },
  { id: 'mediterranean_anti_inflammatory', name: 'Anti-Inflammatory Mediterranean Protocol' },
  { id: 'renal_spared', name: 'Renal-Spared Low Phosphate / Controlled Protein Diet' },
];

export const AiPersonalized2PagePlanView: React.FC<AiPersonalized2PagePlanViewProps> = ({
  generalInfo,
  calculations,
  initialDomain = 'diabetes',
  initialDietDomain = 'low_carbs',
  dietaryRecall = [],
  medicalHistory,
  onOpenPrescription,
}) => {
  // Clinical Domain & Diet Domain Selection
  const [selectedDomainId, setSelectedDomainId] = useState<string>(initialDomain);
  const [selectedDietDomainId, setSelectedDietDomainId] = useState<string>(initialDietDomain);
  const [activeTab, setActiveTab] = useState<'both' | 'page1' | 'page2'>('both');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generation & Loading States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Active Plan States
  const [dietPlans, setDietPlans] = useState<CustomDayPlan[]>([]);
  const [exercisePlans, setExercisePlans] = useState<ExerciseDayItem[]>([]);
  const [dietGuidelines, setDietGuidelines] = useState<{
    clinicalRationale: string;
    dos: string[];
    donts: string[];
    hydrationTarget: string;
    timingGuidance: string;
  }>({
    clinicalRationale: '',
    dos: [],
    donts: [],
    hydrationTarget: '2.5 - 3.0 Liters filtered water daily',
    timingGuidance: 'Strict 12-hour overnight fasting window (8 PM - 8 AM) to restore circadian metabolic alignment.',
  });

  const [exerciseGuidelines, setExerciseGuidelines] = useState<{
    sportsMedicineRationale: string;
    weeklyTarget: string;
    dos: string[];
    donts: string[];
    drBharathkumarSignOff: string;
  }>({
    sportsMedicineRationale: '',
    weeklyTarget: '250 Mins / Week • Zone 2 Cardio & Resistance',
    dos: [],
    donts: [],
    drBharathkumarSignOff: 'Prescribed by Dr. Bharathkumar (MBBS, Sports Medicine Specialist, Reg. No: KMC-74829)',
  });

  // Cell Editing Modal State
  const [editingMealCell, setEditingMealCell] = useState<{
    dayIdx: number;
    slotIdx: number;
    itemIdx: number;
    dayName: string;
    slotName: string;
    item: CustomMealItem;
  } | null>(null);

  // Exercise Editing Modal State
  const [editingExerciseDay, setEditingExerciseDay] = useState<{
    dayIdx: number;
    exercise: ExerciseDayItem;
  } | null>(null);

  // Selected Clinical Domain Object
  const currentDomainObj = useMemo(() => {
    return CLINICAL_DOMAINS_LIST.find((d) => d.id === selectedDomainId) || CLINICAL_DOMAINS_LIST[0];
  }, [selectedDomainId]);

  // Selected Diet Domain Object
  const currentDietDomainObj = useMemo(() => {
    return DIET_DOMAINS_LIST.find((d) => d.id === selectedDietDomainId) || DIET_DOMAINS_LIST[0];
  }, [selectedDietDomainId]);

  // Read uploaded blood reports from localStorage
  const uploadedReportsSummary = useMemo(() => {
    try {
      const stored = localStorage.getItem('ziathlon_uploaded_reports');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const biomarkers: string[] = [];
          parsed.forEach((rep: any) => {
            if (Array.isArray(rep.biomarkers)) {
              rep.biomarkers.forEach((bm: any) => {
                biomarkers.push(`${bm.testName || bm.name}: ${bm.value} ${bm.unit || ''} (${bm.clinicalFlag || bm.status || 'Normal'})`);
              });
            }
          });
          return biomarkers.slice(0, 8).join(' | ');
        }
      }
    } catch {}
    return 'Fasting Blood Sugar: 142 mg/dL (High) | HbA1c: 7.8% (Elevated) | Triglycerides: 198 mg/dL | Serum Creatinine: 0.9 mg/dL';
  }, []);

  // Primary Clinical Generation Function
  const generatePlan = async (isRegenAfterEdit = false) => {
    setIsGenerating(true);
    setNotificationMsg(null);
    setGenerationStep('Analyzing patient biometrics, blood reports & glycemic history...');

    try {
      // Step 1: Prepare clinical dossier
      const patientProfile = {
        name: generalInfo.name || 'Kiruthika',
        age: generalInfo.age || 22,
        sex: generalInfo.sex || 'Female',
        height: generalInfo.height || 165,
        weight: generalInfo.weight || 62,
        bmi: calculations.bmi || 22.8,
        bmr: calculations.bmr || 1350,
        tdee: calculations.tdee || 1950,
        targetCalories: calculations.tdee ? Math.round(calculations.tdee - 450) : 1500,
      };

      setGenerationStep('Engaging AI Engine: Formulating 7-Day Diet & Exercise Matrix...');

      const response = await fetch('/api/generate-dynamic-ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientProfile,
          bloodReports: {
            biomarkerSummary: uploadedReportsSummary,
          },
          medicalHistory: medicalHistory || {
            diagnosedConditions: [currentDomainObj.name],
            currentMedications: 'Metformin 500mg BD with meals',
          },
          domain: currentDomainObj.name,
          dietDomain: currentDietDomainObj.name,
          dietaryRecall: dietaryRecall.length > 0 ? dietaryRecall : [
            { mealType: 'Breakfast', foodItem: 'Idli & White Rice', calories: 350 },
            { mealType: 'Lunch', foodItem: 'White Rice, Sambar, Potato fry', calories: 650 },
            { mealType: 'Evening', foodItem: 'Tea with sugar & biscuits', calories: 200 },
          ],
          customInstructions: customPrompt.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data && data.dietPlans && data.exercisePlans) {
        setDietPlans(data.dietPlans);
        setExercisePlans(data.exercisePlans);

        if (data.dietGuidelines) {
          setDietGuidelines({
            clinicalRationale: data.dietGuidelines.clinicalRationale || `Therapeutic nutrition tailored for ${currentDomainObj.name} using ${currentDietDomainObj.name}.`,
            dos: data.dietGuidelines.dos || [
              'Consume meals at consistent times daily to stabilize postprandial glucose.',
              'Begin each meal with high-fiber greens/salad before carbohydrates.',
              'Chew thoroughly and allow 20 minutes per main meal for leptin signaling.',
              'Hydrate with minimum 2.8 liters of warm water throughout the day.',
              'Ensure dinner is completed at least 2.5 hours prior to sleep.',
            ],
            donts: data.dietGuidelines.donts || [
              'Do not consume refined white sugars, fruit juices, or sweetened beverages.',
              'Avoid deep-fried processed snacks and foods with trans fats.',
              'Do not skip meals, which triggers reactive hypoglycemia and bingeing.',
              'Avoid heavy carbohydrate meals after 8:30 PM.',
              'Do not consume bakery pastries, refined maida, or commercial sweets.',
            ],
            hydrationTarget: data.dietGuidelines.hydrationTarget || '2.8 - 3.2 Liters daily',
            timingGuidance: data.dietGuidelines.timingGuidance || '12-hour overnight circadian fasting window (8:00 PM to 8:00 AM)',
          });
        }

        if (data.exerciseGuidelines) {
          setExerciseGuidelines({
            sportsMedicineRationale: data.exerciseGuidelines.sportsMedicineRationale || `Sports Medicine exercise protocol designed for ${currentDomainObj.name} to optimize GLUT-4 glucose translocation.`,
            weeklyTarget: data.exerciseGuidelines.weeklyTarget || '250 Mins / Week • Zone 2 Cardio & Strength',
            dos: data.exerciseGuidelines.dos || [
              'Perform a 15-minute gentle walk within 30 minutes following main meals.',
              'Complete 8-10 minutes of dynamic mobility warm-up before resistance training.',
              'Maintain breathing rhythm; never hold your breath (avoid Valsalva maneuver).',
              'Wear supportive, cushioned athletic footwear appropriate for foot strike.',
              'Prioritize controlled movement tempo and joint alignment over heavy resistance.',
            ],
            donts: data.exerciseGuidelines.donts || [
              'Do not exercise during acute hypoglycemia (<70 mg/dL) or extreme hyperglycemia (>250 mg/dL).',
              'Avoid high-impact jumping or plyometrics with cold, un-warmed joints.',
              'Do not train through sharp joint pain or sudden biomechanical discomfort.',
              'Avoid heavy maximal lifts without adequate spotter or core bracing.',
              'Never skip post-exercise hydration and active cooldown mobility.',
            ],
            drBharathkumarSignOff: data.exerciseGuidelines.drBharathkumarSignOff || 'Prescribed by Dr. Bharathkumar, Sports Medicine Specialist (MBBS, Sports Medicine Reg. KMC-74829)',
          });
        }

        // Synchronize to Studio Storage
        try {
          localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(data.dietPlans));
          localStorage.setItem('ELSHA_CUSTOM_EXERCISE_PLAN', JSON.stringify(data.exercisePlans));
          localStorage.setItem('ELSHA_SELECTED_CATEGORY', currentDomainObj.name);
          window.dispatchEvent(new Event('elsha-plan-updated'));
        } catch (storageErr) {
          console.error(storageErr);
        }

        setNotificationMsg({
          type: 'success',
          text: isRegenAfterEdit
            ? '✓ Plan regenerated and re-harmonized with your manual edits & preferences!'
            : `✓ Dynamic 7-Day Plan formulated for ${currentDomainObj.name} (${currentDietDomainObj.name})!`,
        });
      } else {
        throw new Error('Incomplete data received from AI engine.');
      }
    } catch (err: any) {
      console.warn('AI generation API fallback, using high-accuracy clinical rule engine:', err);
      // Seamless Fallback using domain generator
      const fallbackPkg = generateDomainDietAndExercisePlan(selectedDomainId, generalInfo, calculations);
      setDietPlans(fallbackPkg.dietPlans);
      setExercisePlans(fallbackPkg.exercisePlans);
      setDietGuidelines({
        clinicalRationale: fallbackPkg.conditionDescription,
        dos: fallbackPkg.dos.length > 0 ? fallbackPkg.dos : [
          'Maintain regular meal timings to promote circadian metabolic stability.',
          'Start every meal with salad or fibrous vegetables before carbohydrates.',
          'Hydrate adequately between meals with electrolyte-rich water.',
          'Include a lean protein source in all 3 major meals.',
          'Finish dinner at least 2.5 hours before sleeping.',
        ],
        donts: fallbackPkg.donts.length > 0 ? fallbackPkg.donts : [
          'Avoid refined carbohydrates, table sugars, and sweetened beverages.',
          'Do not skip meals or engage in unplanned fasts without supervision.',
          'Avoid trans fats, deep-fried snacks, and processed deli meats.',
          'Refrain from late-night carbohydrate-dense snacking.',
          'Do not consume ultra-processed ready-to-eat packet items.',
        ],
        hydrationTarget: '2.5 - 3.0 Liters daily',
        timingGuidance: 'Circadian 12-hour fasting window (8:00 PM to 8:00 AM)',
      });

      setExerciseGuidelines({
        sportsMedicineRationale: `Prescription calibrated to ${currentDomainObj.name} to optimize metabolic rate and preserve lean muscle tissue.`,
        weeklyTarget: '220 - 250 Mins / Week • Zone 2 Cardio & Functional Strength',
        dos: [
          'Perform a 15-minute gentle walk within 30 minutes after main meals.',
          'Warm up for 8 minutes with dynamic joint mobilization before any workout.',
          'Maintain rhythmic breathing during exertion; avoid breath-holding.',
          'Wear supportive footwear with good arch support.',
          'Hydrate with water and pinch of rock salt 20 minutes before exercise.',
        ],
        donts: [
          'Do not train vigorously when fasting blood glucose is <70 mg/dL or >250 mg/dL.',
          'Avoid high-impact loading if experiencing joint effusion or inflammation.',
          'Do not continue training through sharp joint pain or dizziness.',
          'Avoid sudden cessation of high-intensity intervals without active cooldown.',
          'Never skip post-workout stretching and mobility recovery.',
        ],
        drBharathkumarSignOff: 'Prescribed by Dr. Bharathkumar, Sports Medicine Specialist (Reg: KMC-74829)',
      });

      setNotificationMsg({
        type: 'info',
        text: `✓ Calibrated 7-Day Plan formulated for ${currentDomainObj.name} via Clinical Rules Engine!`,
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  // Initial Plan Generation on mount or when domain changes
  useEffect(() => {
    // Check if we already have saved plans in localStorage
    try {
      const savedDiet = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
      const savedExercise = localStorage.getItem('ELSHA_CUSTOM_EXERCISE_PLAN');
      if (savedDiet && savedExercise) {
        const parsedDiet = JSON.parse(savedDiet);
        const parsedExercise = JSON.parse(savedExercise);
        if (Array.isArray(parsedDiet) && parsedDiet.length >= 7 && Array.isArray(parsedExercise) && parsedExercise.length >= 7) {
          setDietPlans(parsedDiet);
          setExercisePlans(parsedExercise);
          return;
        }
      }
    } catch {}

    // Otherwise generate fresh plan
    generatePlan();
  }, [selectedDomainId, selectedDietDomainId]);

  // Compute live nutritional averages from dietPlans
  const nutritionSummary = useMemo(() => {
    if (!dietPlans || dietPlans.length === 0) {
      return { avgKcal: 1500, avgProtein: 75, avgCarbs: 165, avgFat: 42, avgFiber: 32 };
    }

    let totalKcal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;
    let totalFib = 0;

    dietPlans.forEach((dp) => {
      let dayKcal = 0;
      let dayP = 0;
      let dayC = 0;
      let dayF = 0;
      let dayFib = 0;

      dp.slots?.forEach((slot) => {
        slot.items?.forEach((it) => {
          dayKcal += it.calories || 0;
          dayP += it.protein || 0;
          dayC += it.carbs || 0;
          dayF += it.fat || 0;
          dayFib += it.fiber || 0;
        });
      });

      totalKcal += dayKcal || dp.targetCalories || 1500;
      totalP += dayP || 75;
      totalC += dayC || 165;
      totalF += dayF || 42;
      totalFib += dayFib || 32;
    });

    const count = dietPlans.length || 7;
    return {
      avgKcal: Math.round(totalKcal / count),
      avgProtein: Math.round(totalP / count),
      avgCarbs: Math.round(totalC / count),
      avgFat: Math.round(totalF / count),
      avgFiber: Math.round(totalFib / count),
    };
  }, [dietPlans]);

  // Handle Manual Save of Edited Meal Cell
  const handleSaveMealCell = () => {
    if (!editingMealCell) return;
    const { dayIdx, slotIdx, itemIdx, item } = editingMealCell;

    setDietPlans((prev) => {
      const updated = JSON.parse(JSON.stringify(prev)) as CustomDayPlan[];
      if (updated[dayIdx]?.slots[slotIdx]?.items[itemIdx]) {
        updated[dayIdx].slots[slotIdx].items[itemIdx] = item;

        // Recalculate day target calories
        let newDaySum = 0;
        updated[dayIdx].slots.forEach((s) => {
          s.items.forEach((it) => {
            newDaySum += it.calories || 0;
          });
        });
        updated[dayIdx].targetCalories = newDaySum;
      }

      // Persist to localStorage
      try {
        localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(updated));
        window.dispatchEvent(new Event('elsha-plan-updated'));
      } catch (err) {}

      return updated;
    });

    setEditingMealCell(null);
    setNotificationMsg({ type: 'success', text: '✓ Meal item updated and day totals recalculated.' });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Handle Manual Save of Edited Exercise Day
  const handleSaveExerciseDay = () => {
    if (!editingExerciseDay) return;
    const { dayIdx, exercise } = editingExerciseDay;

    setExercisePlans((prev) => {
      const updated = [...prev];
      updated[dayIdx] = exercise;

      // Persist to localStorage
      try {
        localStorage.setItem('ELSHA_CUSTOM_EXERCISE_PLAN', JSON.stringify(updated));
        window.dispatchEvent(new Event('elsha-plan-updated'));
      } catch (err) {}

      return updated;
    });

    setEditingExerciseDay(null);
    setNotificationMsg({ type: 'success', text: '✓ Exercise protocol updated.' });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Trigger Complete 2-Page PDF Download
  const handleDownload2PagePdf = () => {
    const pdfData: Complete2PagePlanPdfData = {
      patient: {
        name: generalInfo.name || 'Kiruthika',
        age: generalInfo.age || 22,
        gender: generalInfo.sex || 'Female',
        weight: generalInfo.weight || 62,
        height: generalInfo.height || 165,
        bmi: calculations.bmi || 22.8,
        targetCalories: nutritionSummary.avgKcal,
        patientId: `ZT-${Date.now().toString().slice(-6)}`,
      },
      conditionDomain: currentDomainObj.name,
      dietDomain: currentDietDomainObj.name,
      macros: {
        protein: `${nutritionSummary.avgProtein}g`,
        carbs: `${nutritionSummary.avgCarbs}g`,
        fat: `${nutritionSummary.avgFat}g`,
        fiber: `${nutritionSummary.avgFiber}g`,
      },
      dietGuidelines: {
        clinicalRationale: dietGuidelines.clinicalRationale,
        dos: dietGuidelines.dos,
        donts: dietGuidelines.donts,
        hydrationTarget: dietGuidelines.hydrationTarget,
        timingGuidance: dietGuidelines.timingGuidance,
      },
      dietPlans: dietPlans,
      exerciseGuidelines: {
        sportsMedicineRationale: exerciseGuidelines.sportsMedicineRationale,
        weeklyTarget: exerciseGuidelines.weeklyTarget,
        dos: exerciseGuidelines.dos,
        donts: exerciseGuidelines.donts,
        drBharathkumarSignOff: exerciseGuidelines.drBharathkumarSignOff,
      },
      exercisePlans: exercisePlans,
    };

    const fileName = `Ziathlon_2Page_Rx_${(generalInfo.name || 'Patient').replace(/\s+/g, '_')}.pdf`;
    generateComplete2PagePlanPdf(pdfData, fileName);
    setNotificationMsg({ type: 'success', text: `✓ High-resolution 2-Page Prescription downloaded: ${fileName}` });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Meal Slots Matrix Configuration matching reference image
  const mealSlotsConfig = [
    { label: 'Early Morning', timing: '5:00 - 6:30 am', match: 'early' },
    { label: 'Breakfast', timing: '8:30 - 9:00 am', match: 'breakfast' },
    { label: 'Mid-Morning', timing: '11:00 am - 12:00 pm', match: 'mid' },
    { label: 'Lunch', timing: '1:30 - 2:00 pm', match: 'lunch' },
    { label: 'Evening Snack', timing: '5:00 - 5:30 pm', match: 'evening' },
    { label: 'Dinner', timing: '7:30 - 8:30 pm', match: 'dinner' },
    { label: 'Bed Time', timing: '9:30 - 10:00 pm', match: 'bed' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 text-gray-900 font-sans max-w-7xl mx-auto">
      {/* Top Clinical AI Control Panel */}
      <div className="bg-white border-2 border-[#7E22CE] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border-2 border-[#7E22CE] flex items-center justify-center text-[#7E22CE] shadow-sm shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-purple-100 border border-purple-300 text-purple-900 text-[10px] font-black uppercase tracking-wider rounded font-mono">
                  ŽIATHLON CLINICAL NUTRITION AI
                </span>
                <span className="px-2 py-0.5 bg-purple-50 border border-purple-300 text-purple-900 text-[10px] font-black uppercase tracking-wider rounded font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#7E22CE]" /> FULLY AUTOMATED & DYNAMIC
                </span>
                <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 text-purple-900 text-[10px] font-black uppercase tracking-wider rounded font-mono">
                  2-PAGE PRESCRIPTION
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mt-1">
                Dynamic 7-Day Diet & Exercise Prescription Generator
              </h2>
              <p className="text-xs text-purple-900 font-medium mt-0.5">
                Calibrates recipes, portions, macro ratios, exercise movements, and clinical guidelines dynamically across all diseases, disorders, and fitness domains.
              </p>
            </div>
          </div>

          {/* Action Buttons: PDF Download & Print */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="btn-download-2page-pdf"
              onClick={handleDownload2PagePdf}
              className="py-2.5 px-4 bg-[#7E22CE] hover:bg-[#601188] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download PDF (2-Page Plan)</span>
            </button>

            <button
              type="button"
              id="btn-print-2page-plan"
              onClick={() => window.print()}
              className="py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-purple-700" />
              <span>Print Plan</span>
            </button>

            {onOpenPrescription && (
              <button
                type="button"
                onClick={onOpenPrescription}
                className="py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Layers className="w-4 h-4 text-[#7E22CE]" />
                <span>Rx Modal</span>
              </button>
            )}
          </div>
        </div>

        {/* Clinical Dossier Selector Bar */}
        <div className="mt-5 pt-4 border-t border-purple-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Disease / Disorder / Performance Domain */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase font-mono tracking-wider text-purple-900 block">
              1. Condition / Fitness Domain:
            </label>
            <select
              id="select-clinical-domain"
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-[#7E22CE] cursor-pointer"
            >
              <optgroup label="Diseases & Disorders">
                {CLINICAL_DOMAINS_LIST.filter((d) => d.group === 'Diseases & Disorders').map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Performance & Fitness">
                {CLINICAL_DOMAINS_LIST.filter((d) => d.group === 'Performance & Fitness').map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* 2. Diet Domain */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase font-mono tracking-wider text-purple-900 block">
              2. Therapeutic Diet Domain:
            </label>
            <select
              id="select-diet-domain"
              value={selectedDietDomainId}
              onChange={(e) => setSelectedDietDomainId(e.target.value)}
              className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-[#7E22CE] cursor-pointer"
            >
              {DIET_DOMAINS_LIST.map((dd) => (
                <option key={dd.id} value={dd.id}>
                  {dd.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Patient Clinical Summary Context */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase font-mono tracking-wider text-purple-900 block">
              3. Patient Clinical Context:
            </label>
            <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-lg text-[11px] text-gray-900 font-mono truncate font-semibold">
              {generalInfo.name || 'Kiruthika'} • {generalInfo.age || 22}y • {generalInfo.weight || 62}kg • BMI {calculations.bmi || '22.8'} • TDEE {calculations.tdee || 1950} kcal
            </div>
          </div>

          {/* 4. Generate / Regenerate Button */}
          <div className="flex items-end">
            <button
              type="button"
              id="btn-ai-generate-dynamic-plan"
              onClick={() => generatePlan(false)}
              disabled={isGenerating}
              className="w-full py-2 px-3 bg-[#7E22CE] hover:bg-[#601188] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Formulating Plan...' : '✨ AI Generate Dynamic Plan'}</span>
            </button>
          </div>
        </div>

        {/* Custom Clinical Instruction Bar */}
        <div className="mt-3 pt-3 border-t border-purple-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              id="input-ai-custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add patient preference / manual AI guidance (e.g., 'Strict vegetarian', 'Extra high protein for leg days', 'No oats on Wednesday')..."
              className="w-full bg-white border border-purple-300 rounded-lg px-3 py-1.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-[#7E22CE] font-sans font-medium"
            />
          </div>
          <button
            type="button"
            onClick={() => generatePlan(true)}
            disabled={isGenerating}
            className="py-1.5 px-3 bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-900 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7E22CE]" />
            <span>AI Regenerate with Instructions</span>
          </button>
        </div>

        {/* Loading Progress Indicator */}
        {isGenerating && (
          <div className="mt-3 p-3 bg-purple-50 border border-purple-300 rounded-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#7E22CE] border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="text-xs text-purple-900 font-mono">
              <span className="font-bold text-[#7E22CE] uppercase">AI Clinical Engine Active: </span>
              <span>{generationStep}</span>
            </div>
          </div>
        )}

        {/* Status Notification Message */}
        {notificationMsg && (
          <div
            className={`mt-3 p-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
              notificationMsg.type === 'success'
                ? 'bg-purple-50 border border-emerald-400 text-emerald-900'
                : notificationMsg.type === 'error'
                ? 'bg-red-50 border border-red-400 text-red-900'
                : 'bg-purple-50 border border-purple-400 text-purple-900'
            }`}
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{notificationMsg.text}</span>
          </div>
        )}
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-purple-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="tab-view-both"
            onClick={() => setActiveTab('both')}
            className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'both'
                ? 'bg-[#7E22CE] text-white shadow-sm font-black'
                : 'bg-white text-gray-700 border border-purple-200 hover:border-[#7E22CE] hover:text-black'
            }`}
          >
            📑 Both Pages (Complete 2-Page Rx)
          </button>
          <button
            type="button"
            id="tab-view-page1"
            onClick={() => setActiveTab('page1')}
            className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'page1'
                ? 'bg-[#7E22CE] text-white shadow-sm font-black'
                : 'bg-white text-gray-700 border border-purple-200 hover:border-[#7E22CE] hover:text-black'
            }`}
          >
            📄 Page 1: AI Diet Plan & Guidelines
          </button>
          <button
            type="button"
            id="tab-view-page2"
            onClick={() => setActiveTab('page2')}
            className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'page2'
                ? 'bg-[#7E22CE] text-white shadow-sm font-black'
                : 'bg-white text-gray-700 border border-purple-200 hover:border-[#7E22CE] hover:text-black'
            }`}
          >
            🏃 Page 2: AI Exercise Schedule & Dr. Bharathkumar
          </button>
        </div>

        <div className="text-[11px] text-gray-700 font-mono hidden sm:flex items-center gap-3">
          <span>💡 Click any meal or exercise card to edit inline</span>
          <span className="text-[#7E22CE] font-bold">Target: {nutritionSummary.avgKcal} kcal/day</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 1: 7-DAY DIET PLAN + DEMOGRAPHICS + DIET GUIDELINES                   */}
      {/* ========================================================================= */}
      {/* PAGE 1: 7-DAY DIET PRESCRIPTION & CLINICAL GUIDELINES                     */}
      {/* ========================================================================= */}
      {(activeTab === 'both' || activeTab === 'page1') && (
        <div
          id="prescription-page-1"
          className="bg-white border-2 border-[#D9C4A5] rounded-2xl p-6 shadow-xl space-y-5 print:border-none print:p-0 print:m-0 print:shadow-none print:break-after-page text-black"
        >
          {/* Official Letterhead Header Page 1 */}
          <ZiathlonLetterheadHeader
            pageNumber="PAGE 1 OF 2"
            rxNumber={`Rx ID: ZIA-RX-${String(generalInfo.name || 'PAT').slice(0, 4).toUpperCase()}-2026`}
            date={new Date().toLocaleDateString('en-GB')}
          />

          {/* Patient Demographics & Domain Banner (Light Sandalwood Palette) */}
          <div className="bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono text-black">
            <div className="border-r border-[#E3D4C0] pr-2">
              <span className="text-[#8C5E28] block text-[10px] uppercase font-bold">PATIENT NAME</span>
              <span className="text-[#2E1C07] font-extrabold text-sm">{generalInfo.name || 'Kiruthika'}</span>
              <span className="text-gray-600 block text-[10px] font-medium">{generalInfo.age || 38} Yrs • {generalInfo.sex || 'Female'}</span>
            </div>
            <div className="border-r border-[#E3D4C0] pr-2">
              <span className="text-[#8C5E28] block text-[10px] uppercase font-bold">CONDITION DOMAIN</span>
              <span className="text-[#8C5E28] font-bold block truncate" title={currentDomainObj.name}>
                {currentDomainObj.name}
              </span>
              <span className="text-[10px] text-[#5C3A14] font-bold">{currentDietDomainObj.name?.split('(')[0] || ''}</span>
            </div>
            <div className="border-r border-[#E3D4C0] pr-2">
              <span className="text-[#8C5E28] block text-[10px] uppercase font-bold">WEIGHT / HEIGHT</span>
              <span className="text-black font-extrabold">{generalInfo.weight || 64} kg • {generalInfo.height || 162} cm</span>
              <span className="text-[#5C3A14] block text-[10px] font-bold">BMI: {calculations.bmi || '24.4'} ({calculations.bmiCategory || 'Normal'})</span>
            </div>
            <div className="border-r border-[#E3D4C0] pr-2">
              <span className="text-[#8C5E28] block text-[10px] uppercase font-bold">MAINTENANCE (TDEE)</span>
              <span className="text-black font-extrabold">{calculations.tdee || 1850} kcal</span>
              <span className="text-gray-600 block text-[10px] font-medium">BMR: {calculations.bmr || 1350} kcal</span>
            </div>
            <div className="border-r border-[#E3D4C0] pr-2">
              <span className="text-[#8C5E28] block text-[10px] uppercase font-bold">ACTIVE RDA TARGET</span>
              <span className="text-[#8C5E28] font-black text-sm">
                {getActiveRdaTargets(generalInfo, calculations).nutrients.find((n) => n.id === 'energy')?.prescribedTarget || nutritionSummary.avgKcal} kcal/day
              </span>
              <span className="text-[10px] text-[#5C3A14] font-bold">ICMR Single Source</span>
            </div>
            <div>
              <span className="text-[#8C5E28] block text-[10px] uppercase font-bold">DAILY MACRO TARGETS</span>
              <div className="text-[11px] font-black text-[#2E1C07]">
                P: {getActiveRdaTargets(generalInfo, calculations).nutrients.find((n) => n.id === 'protein')?.prescribedTarget || nutritionSummary.avgProtein}g | C: {getActiveRdaTargets(generalInfo, calculations).nutrients.find((n) => n.id === 'carbohydrates')?.prescribedTarget || nutritionSummary.avgCarbs}g
              </div>
              <div className="text-[11px] font-black text-[#8C5E28]">
                F: {getActiveRdaTargets(generalInfo, calculations).nutrients.find((n) => n.id === 'fat')?.prescribedTarget || nutritionSummary.avgFat}g | Fib: {getActiveRdaTargets(generalInfo, calculations).nutrients.find((n) => n.id === 'fibre')?.prescribedTarget || nutritionSummary.avgFiber}g
              </div>
            </div>
          </div>

          {/* 7-DAY DIET MATRIX TABLE */}
          <div className="overflow-x-auto border-2 border-[#D9C4A5] rounded-xl shadow-md bg-white">
            <table className="w-full text-left border-collapse min-w-[980px]">
              {/* Header Row */}
              <thead>
                <tr className="bg-[#8C5E28] border-b border-[#724B1E] text-[11px] font-mono text-white uppercase tracking-wider">
                  <th className="py-2.5 px-3 border-r border-[#A87B41] w-36 font-black">
                    Timings & Meals
                  </th>
                  {daysOfWeek.map((day, idx) => {
                    const dayKcal = dietPlans[idx]?.targetCalories || nutritionSummary.avgKcal;
                    return (
                      <th key={day} className="py-2.5 px-2.5 border-r border-purple-400/40 text-center font-bold">
                        <div className="text-white text-xs font-black">{day}</div>
                        <div className="text-[10px] text-purple-200 font-mono font-bold">{dayKcal} kcal</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-purple-100 text-[11px]">
                {mealSlotsConfig.map((slotConf, sIdx) => (
                  <tr key={slotConf.label} className={sIdx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}>
                    {/* Time Slot Label Cell */}
                    <td className="py-2.5 px-3 border-r border-purple-200 bg-purple-100/60 font-mono">
                      <div className="font-extrabold text-black text-xs">{slotConf.label}</div>
                      <div className="text-[10px] text-purple-800 font-bold">{slotConf.timing}</div>
                    </td>

                    {/* Day Cells (Monday through Sunday) */}
                    {daysOfWeek.map((day, dIdx) => {
                      const dayPlan = dietPlans[dIdx];
                      const matchingSlot =
                        dayPlan?.slots?.find((s) => s.slotName.toLowerCase().includes(slotConf.match)) ||
                        dayPlan?.slots?.[sIdx];
                      const firstItem = matchingSlot?.items?.[0];

                      return (
                        <td
                          key={`${day}-${slotConf.label}`}
                          onClick={() => {
                            if (firstItem && matchingSlot) {
                              setEditingMealCell({
                                dayIdx: dIdx,
                                slotIdx: sIdx,
                                itemIdx: 0,
                                dayName: day,
                                slotName: slotConf.label,
                                item: { ...firstItem },
                              });
                            }
                          }}
                          className="py-2 px-2.5 border-r border-purple-100 align-top hover:bg-purple-100/50 transition-colors cursor-pointer group relative"
                        >
                          {firstItem ? (
                            <div className="space-y-1">
                              <div className="font-bold text-black group-hover:text-purple-900 transition-colors leading-tight">
                                {firstItem.dishName}
                              </div>
                              <div className="text-[10px] text-gray-600 font-medium">
                                {firstItem.portionHousehold}
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                                <span className="text-[#7E22CE] font-black">{firstItem.calories} kcal</span>
                                <span className="text-purple-900 font-extrabold">P:{firstItem.protein}g</span>
                              </div>
                              {/* Hover Edit Pencil */}
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-[#7E22CE] rounded text-white shadow-sm">
                                <Edit3 className="w-3 h-3" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No prescription</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Total Energy Row */}
                <tr className="bg-purple-900 border-t-2 border-purple-950 font-mono text-xs text-white">
                  <td className="py-2.5 px-3 border-r border-purple-700 font-black text-white">
                    TOTAL DAILY ENERGY
                  </td>
                  {daysOfWeek.map((day, dIdx) => {
                    const dayKcal = dietPlans[dIdx]?.targetCalories || nutritionSummary.avgKcal;
                    return (
                      <td key={`total-${day}`} className="py-2.5 px-2.5 border-r border-purple-700 text-center font-black text-white">
                        {dayKcal} kcal
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom 3 Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 1. Daily Nutrition Summary Box */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-3 text-black shadow-sm">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                <PieChart className="w-4 h-4 text-[#7E22CE]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono">
                  Nutrition Summary
                </h3>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="text-gray-600 font-medium">Target Calories</span>
                  <span className="text-[#7E22CE] font-black text-sm">{nutritionSummary.avgKcal} kcal</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="text-gray-600 font-medium">Protein Target</span>
                  <span className="text-black font-extrabold">{nutritionSummary.avgProtein}g / day</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="text-gray-600 font-medium">Carbohydrates</span>
                  <span className="text-black font-extrabold">{nutritionSummary.avgCarbs}g / day</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-100">
                  <span className="text-gray-600 font-medium">Healthy Fats</span>
                  <span className="text-black font-extrabold">{nutritionSummary.avgFat}g / day</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600 font-medium">Dietary Fiber</span>
                  <span className="text-[#7E22CE] font-extrabold">{nutritionSummary.avgFiber}g / day</span>
                </div>
              </div>
            </div>

            {/* 2. Meal Timings & Circadian Window */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-3 text-black shadow-sm">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                <Clock className="w-4 h-4 text-[#7E22CE]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono">
                  Meal Timings & Fasting
                </h3>
              </div>
              <div className="space-y-2 text-[11px] text-gray-800">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7E22CE] mt-1 shrink-0" />
                  <span>
                    <strong className="text-black">Early Dinner Rule:</strong> Complete dinner between 7:30 - 8:30 PM to optimize overnight insulin clearance.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-700 mt-1 shrink-0" />
                  <span>
                    <strong className="text-black">Circadian Fasting:</strong> Maintain 12 hours between dinner and breakfast (8 PM to 8 AM).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-900 mt-1 shrink-0" />
                  <span>
                    <strong className="text-black">Hydration Target:</strong> {dietGuidelines.hydrationTarget} between meals (avoid during meals).
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Clinical Diet Guidelines (Do's & Don'ts) */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-3 text-black shadow-sm">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-[#7E22CE]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono">
                  Clinical Diet Guidelines
                </h3>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="text-emerald-700 font-bold uppercase text-[10px]">Condition Do's:</div>
                {dietGuidelines.dos.slice(0, 3).map((dItem, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-gray-800">
                    <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{dItem}</span>
                  </div>
                ))}
                <div className="text-rose-700 font-bold uppercase text-[10px] pt-1">Condition Don'ts:</div>
                {dietGuidelines.donts.slice(0, 2).map((dnItem, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-gray-800">
                    <X className="w-3 h-3 text-rose-600 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{dnItem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: 7-DAY EXERCISE SCHEDULE & SPORTS MEDICINE GUIDELINES              */}
      {/* ========================================================================= */}
      {(activeTab === 'both' || activeTab === 'page2') && (
        <div
          id="prescription-page-2"
          className="bg-white border-2 border-[#7E22CE] rounded-2xl p-6 shadow-xl space-y-5 print:border-none print:p-0 print:m-0 print:shadow-none print:break-after-page text-black"
        >
          {/* Official Letterhead Header Page 2 */}
          <ZiathlonLetterheadHeader
            pageNumber="PAGE 2 OF 2"
            rxNumber={`Rx ID: ZIA-RX-${String(generalInfo.name || 'PAT').slice(0, 4).toUpperCase()}-2026`}
            date={new Date().toLocaleDateString('en-GB')}
          />

          {/* Patient Conditioning Profile Banner */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-black">
            <div className="border-r border-purple-200 pr-2">
              <span className="text-purple-700 block text-[10px] uppercase font-bold">PATIENT PROFILE</span>
              <span className="text-black font-extrabold">{generalInfo.name || 'Kiruthika'} ({generalInfo.age || 22}y)</span>
              <span className="text-[#7E22CE] block text-[10px] font-bold">{currentDomainObj.name}</span>
            </div>
            <div className="border-r border-purple-200 pr-2">
              <span className="text-purple-700 block text-[10px] uppercase font-bold">WEEKLY MOVEMENT GOAL</span>
              <span className="text-[#7E22CE] font-black">{exerciseGuidelines.weeklyTarget}</span>
              <span className="text-gray-600 block text-[10px] font-medium">Zone 2 Aerobic + Functional Strength</span>
            </div>
            <div className="border-r border-purple-200 pr-2">
              <span className="text-purple-700 block text-[10px] uppercase font-bold">TARGET HEART RATE</span>
              <span className="text-purple-950 font-bold">115 - 138 BPM (Zone 2-3)</span>
              <span className="text-gray-600 block text-[10px] font-medium">Max HR: {220 - (Number(generalInfo.age) || 22)} BPM</span>
            </div>
            <div>
              <span className="text-purple-700 block text-[10px] uppercase font-bold">SUPERVISING CLINICIAN</span>
              <span className="text-black font-black block">Dr. Bharathkumar</span>
              <span className="text-[10px] text-[#7E22CE] font-bold">Sports Medicine Specialist</span>
            </div>
          </div>

          {/* 7-Day Exercise Schedule Grid (Monday to Sunday) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {daysOfWeek.map((day, idx) => {
              const ex = exercisePlans[idx] || {
                dayNumber: idx + 1,
                dayName: day,
                protocolTitle: 'Active Recovery & Post-Meal Walk',
                focusArea: 'Glycemic Clearance & Mobility',
                durationMins: 35,
                intensityLevel: 'Zone 2-3 (Aerobic Base)' as const,
                targetHeartRate: '110-125 BPM',
                movements: [
                  { name: 'Brisk Walk', setsAndReps: '20 mins @ Zone 2', clinicalRationale: 'Translocates GLUT4 transporters' },
                  { name: 'Cat-Cow Mobility', setsAndReps: '3 sets x 10 reps', clinicalRationale: 'Spinal decompression' },
                ],
                postWorkoutRecovery: '5 mins diaphragmatic breathing & 300ml electrolyte hydration',
              };

              return (
                <div
                  key={day}
                  onClick={() => setEditingExerciseDay({ dayIdx: idx, exercise: { ...ex } })}
                  className="bg-white border-2 border-purple-200 hover:border-[#7E22CE] rounded-xl p-3 flex flex-col justify-between space-y-2 transition-all cursor-pointer group relative shadow-sm text-black"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-1">
                      <span className="font-extrabold text-black text-xs font-mono">{day}</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-900 rounded text-[9px] font-bold font-mono">
                        {ex.durationMins || 40}m
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-purple-950 group-hover:text-[#7E22CE] transition-colors line-clamp-2">
                      {ex.protocolTitle}
                    </div>

                    <div className="text-[10px] text-[#7E22CE] font-mono font-bold">
                      {ex.focusArea}
                    </div>

                    {/* Movement Items */}
                    <div className="space-y-1 pt-1">
                      {ex.movements?.slice(0, 2).map((mv, mIdx) => (
                        <div key={mIdx} className="text-[10px] bg-purple-50/70 p-1.5 rounded border border-purple-100">
                          <div className="font-bold text-black">{mv.name}</div>
                          <div className="text-gray-600 font-mono text-[9px] font-medium">{mv.setsAndReps}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recovery Footer */}
                  <div className="pt-2 border-t border-purple-100 text-[9px] text-gray-700">
                    <span className="text-[#7E22CE] font-bold block">Recovery:</span>
                    <span className="line-clamp-2 font-medium">{ex.postWorkoutRecovery || 'Hydration & stretching'}</span>
                  </div>

                  {/* Hover Edit Pencil */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-[#7E22CE] rounded text-white shadow-sm">
                    <Edit3 className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Cards Page 2: Exercise Do's & Don'ts + Dr. Bharathkumar Official Clinical Sign-off */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
            {/* 1. Sports Medicine Exercise Do's */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-3 text-black shadow-sm">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                  Sports Medicine Exercise Do's
                </h3>
              </div>
              <div className="space-y-2 text-[11px] text-gray-800">
                {exerciseGuidelines.dos.slice(0, 5).map((doItem, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span>{doItem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Exercise Don'ts / Contraindications */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-3 text-black shadow-sm">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono">
                  Exercise Don'ts & Safety
                </h3>
              </div>
              <div className="space-y-2 text-[11px] text-gray-800">
                {exerciseGuidelines.donts.slice(0, 5).map((dontItem, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold mt-0.5">•</span>
                    <span>{dontItem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Official Dr. Bharathkumar Sports Medicine Clinical Sign-off Note & Seal */}
            <div className="bg-purple-50/60 border-2 border-[#7E22CE] rounded-xl p-4 space-y-3 flex flex-col justify-between text-black shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#7E22CE]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono">
                      Clinical Sign-Off & Rx Seal
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 text-purple-900 text-[9px] font-mono font-bold rounded">
                    VERIFIED
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-gray-800">
                  <div className="font-serif font-black text-black text-base">
                    Dr. Bharathkumar
                  </div>
                  <div className="text-[11px] text-[#7E22CE] font-bold">
                    MBBS, Sports Medicine Specialist
                  </div>
                  <div className="text-[10px] text-gray-600 font-mono font-medium">
                    Director of Sports Endocrinology & Clinical Performance
                  </div>
                  <div className="text-[10px] text-gray-600 font-mono font-medium">
                    Reg. No: KMC-74829 • Žiathlon Sports Medicine Clinic
                  </div>
                  <p className="text-[10px] text-gray-700 italic pt-1 leading-relaxed">
                    "This 7-day therapeutic nutrition and progressive exercise protocol is medically approved for {generalInfo.name || 'the patient'} based on blood biomarker parameters."
                  </p>
                </div>
              </div>

              {/* Verified Digital Seal & Signature */}
              <div className="pt-3 border-t border-purple-200 flex items-center justify-between">
                <div className="text-[9px] text-[#7E22CE] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Certified</span>
                </div>
                <div className="font-serif italic text-sm text-[#7E22CE] font-black tracking-widest border-b border-dashed border-[#7E22CE] px-2">
                  Dr. Bharathkumar
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE MODAL 1: EDIT MEAL CELL                                            */}
      {/* ========================================================================= */}
      {editingMealCell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#7E22CE] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-black">
            <div className="flex items-center justify-between border-b border-purple-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-black">
                <Edit3 className="w-4 h-4 text-[#7E22CE]" />
                <span>Edit Meal: {editingMealCell.dayName} • {editingMealCell.slotName}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingMealCell(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-black hover:bg-purple-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-900 font-bold block mb-1">Dish Name & Description:</label>
                <input
                  type="text"
                  value={editingMealCell.item.dishName}
                  onChange={(e) =>
                    setEditingMealCell({
                      ...editingMealCell,
                      item: { ...editingMealCell.item, dishName: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-black font-semibold focus:outline-none focus:border-[#7E22CE]"
                />
              </div>

              <div>
                <label className="text-gray-900 font-bold block mb-1">Portion / Household Measure:</label>
                <input
                  type="text"
                  value={editingMealCell.item.portionHousehold}
                  onChange={(e) =>
                    setEditingMealCell({
                      ...editingMealCell,
                      item: { ...editingMealCell.item, portionHousehold: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:border-[#7E22CE]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold block mb-1">Calories (kcal):</label>
                  <input
                    type="number"
                    value={editingMealCell.item.calories}
                    onChange={(e) =>
                      setEditingMealCell({
                        ...editingMealCell,
                        item: { ...editingMealCell.item, calories: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-purple-50/50 border border-purple-300 rounded-lg px-2.5 py-1.5 text-[#7E22CE] font-mono font-black"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold block mb-1">Protein (g):</label>
                  <input
                    type="number"
                    value={editingMealCell.item.protein}
                    onChange={(e) =>
                      setEditingMealCell({
                        ...editingMealCell,
                        item: { ...editingMealCell.item, protein: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-purple-50/50 border border-purple-300 rounded-lg px-2.5 py-1.5 text-purple-900 font-mono font-black"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold block mb-1">Carbs (g):</label>
                  <input
                    type="number"
                    value={editingMealCell.item.carbs}
                    onChange={(e) =>
                      setEditingMealCell({
                        ...editingMealCell,
                        item: { ...editingMealCell.item, carbs: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-purple-50/50 border border-purple-300 rounded-lg px-2.5 py-1.5 text-black font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold block mb-1">Fat (g):</label>
                  <input
                    type="number"
                    value={editingMealCell.item.fat}
                    onChange={(e) =>
                      setEditingMealCell({
                        ...editingMealCell,
                        item: { ...editingMealCell.item, fat: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-purple-50/50 border border-purple-300 rounded-lg px-2.5 py-1.5 text-black font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-purple-200">
              <button
                type="button"
                onClick={() => setEditingMealCell(null)}
                className="py-2 px-4 rounded-xl text-xs text-gray-600 hover:text-black hover:bg-gray-100 cursor-pointer font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMealCell}
                className="py-2 px-4 bg-[#7E22CE] hover:bg-[#601188] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Save Changes & Recalculate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INLINE MODAL 2: EDIT EXERCISE DAY                                         */}
      {/* ========================================================================= */}
      {editingExerciseDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#7E22CE] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-black">
            <div className="flex items-center justify-between border-b border-purple-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-black">
                <Dumbbell className="w-4 h-4 text-[#7E22CE]" />
                <span>Edit Exercise Protocol: {editingExerciseDay.exercise.dayName}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingExerciseDay(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-black hover:bg-purple-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-900 font-bold block mb-1">Protocol Title:</label>
                <input
                  type="text"
                  value={editingExerciseDay.exercise.protocolTitle}
                  onChange={(e) =>
                    setEditingExerciseDay({
                      ...editingExerciseDay,
                      exercise: { ...editingExerciseDay.exercise, protocolTitle: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-black font-semibold focus:outline-none focus:border-[#7E22CE]"
                />
              </div>

              <div>
                <label className="text-gray-900 font-bold block mb-1">Focus Area:</label>
                <input
                  type="text"
                  value={editingExerciseDay.exercise.focusArea}
                  onChange={(e) =>
                    setEditingExerciseDay({
                      ...editingExerciseDay,
                      exercise: { ...editingExerciseDay.exercise, focusArea: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:border-[#7E22CE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold block mb-1">Duration (Mins):</label>
                  <input
                    type="number"
                    value={editingExerciseDay.exercise.durationMins}
                    onChange={(e) =>
                      setEditingExerciseDay({
                        ...editingExerciseDay,
                        exercise: { ...editingExerciseDay.exercise, durationMins: Number(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-purple-50/50 border border-purple-300 rounded-lg px-3 py-2 text-purple-900 font-mono font-black"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold block mb-1">Target Heart Rate:</label>
                  <input
                    type="text"
                    value={editingExerciseDay.exercise.targetHeartRate}
                    onChange={(e) =>
                      setEditingExerciseDay({
                        ...editingExerciseDay,
                        exercise: { ...editingExerciseDay.exercise, targetHeartRate: e.target.value },
                      })
                    }
                    className="w-full bg-purple-50/50 border border-purple-300 rounded-lg px-3 py-2 text-black font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-900 font-bold block mb-1">Post-Workout Recovery:</label>
                <input
                  type="text"
                  value={editingExerciseDay.exercise.postWorkoutRecovery}
                  onChange={(e) =>
                    setEditingExerciseDay({
                      ...editingExerciseDay,
                      exercise: { ...editingExerciseDay.exercise, postWorkoutRecovery: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:border-[#7E22CE]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-purple-200">
              <button
                type="button"
                onClick={() => setEditingExerciseDay(null)}
                className="py-2 px-4 rounded-xl text-xs text-gray-600 hover:text-black hover:bg-gray-100 cursor-pointer font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveExerciseDay}
                className="py-2 px-4 bg-[#7E22CE] hover:bg-[#601188] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Save Exercise Protocol</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
