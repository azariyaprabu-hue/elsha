import React, { useState, useEffect, useMemo } from 'react';
import { GeneralInfo, Calculations, DietDayPlan, DiabetesGuidelines } from '../types';
import { ZiathlonLogo } from './ZiathlonLogo';
import {
  Printer,
  Calendar,
  Clock,
  HeartPulse,
  Dumbbell,
  Check,
  X,
  User,
  ChevronRight,
  Flame,
  PieChart,
  Lightbulb,
  ShieldCheck,
  Award,
  Layers,
  FileSpreadsheet,
  Save,
  CheckCircle,
  FileDown,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import {
  CustomDayPlan,
  INITIAL_7_DAY_STUDIO_PLAN,
} from '../data/customStudio7DayPlans';
import {
  generateDomainDietAndExercisePlan,
  ExerciseDayItem,
} from '../utils/aiDomainDietExerciseGenerator';
import { Unified7DayClinicalDietTable } from './Unified7DayClinicalDietTable';
import { ZiathlonLetterheadHeader } from './ZiathlonLetterheadHeader';
import { OfficialClinicalPrescriptionTable } from './OfficialClinicalPrescriptionTable';
import {
  generateConditionSpecificIngredientGuidelines,
  ConditionIngredientGuidelines,
} from '../data/conditionAdaptiveIngredientsEngine';
import {
  downloadHtmlAsPdf,
  generateComplete2PagePlanPdf,
  generateGoldAndBlackPrescriptionPdf,
  Complete2PagePlanPdfData,
} from '../utils/pdfGenerator';

interface NutritionPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  generalInfo: GeneralInfo;
  calculations: Calculations;
  dayPlan?: DietDayPlan;
  guidelines?: DiabetesGuidelines;
  plans?: CustomDayPlan[];
  onUpdatePlans?: (newPlans: CustomDayPlan[]) => void;
  condition?: string;
}

export const NutritionPrescriptionModal: React.FC<NutritionPrescriptionModalProps> = ({
  isOpen,
  onClose,
  generalInfo,
  calculations,
  plans,
  onUpdatePlans,
  condition,
}) => {
  // Active View Tab in Modal: 'page1' | 'page2' | 'both' | 'guidelines'
  const [activePageView, setActivePageView] = useState<'page1' | 'page2' | 'both' | 'guidelines'>('both');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [prescriptionTheme, setPrescriptionTheme] = useState<'purple-white' | 'gold-black'>('purple-white');
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Patient / Clinical Details
  const [patientName, setPatientName] = useState(generalInfo.name || 'Patient');
  const [patientAge, setPatientAge] = useState(generalInfo.age ? String(generalInfo.age) : '28');
  const [patientGender, setPatientGender] = useState(generalInfo.sex || 'Female');
  const [conditionDomain, setConditionDomain] = useState(() => {
    try {
      const savedCat = localStorage.getItem('CLINICAL_SELECTED_CATEGORY') || localStorage.getItem('ELSHA_SELECTED_CATEGORY');
      if (savedCat) return savedCat;
    } catch {}
    return condition || 'Weight Management';
  });

  // Unique 90 Condition Ingredients
  const conditionIngredients = useMemo(() => {
    return generateConditionSpecificIngredientGuidelines(conditionDomain);
  }, [conditionDomain]);

  // Manual 7-Day Plans from Custom7DayPlanStudio
  const [customPlans, setCustomPlans] = useState<CustomDayPlan[]>(INITIAL_7_DAY_STUDIO_PLAN);

  // 7-Day Exercise Plans loaded dynamically from Exercise folder guidelines in localStorage
  const DEFAULT_EXERCISE_SCHEDULE: ExerciseDayItem[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('ELSHA_7DAY_EXERCISE_GUIDELINES');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            dayNumber: item.dayNumber || idx + 1,
            dayName: item.dayName || `Day ${idx + 1}`,
            protocolTitle: item.protocolFocus || 'Clinical Exercise Protocol',
            focusArea: item.exercises || 'General conditioning',
            durationMins: 45,
            intensityLevel: item.hrZoneIntensity || 'Zone 2',
            targetHeartRate: '115 - 130 bpm',
            movements: [
              { name: item.exercises || 'Custom Movement', setsAndReps: item.setsReps || '3 sets x 12 reps', clinicalRationale: item.protocolFocus || 'Glycemic regulation' }
            ],
            postWorkoutRecovery: item.recoveryNote || 'Hydrate post workout.',
          }));
        }
      }
    } catch {}
    return [
    {
      dayNumber: 1,
      dayName: 'Monday',
      protocolTitle: 'Push & Upper Body Hypertrophy',
      focusArea: 'Chest, Anterior Deltoids, Triceps',
      durationMins: 50,
      intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
      targetHeartRate: '125 - 140 bpm',
      movements: [
        { name: 'Barbell / Dumbbell Bench Press', setsAndReps: '4 sets x 8-10 reps', clinicalRationale: 'Upper body anterior push.' },
        { name: 'Incline Dumbbell Flyes', setsAndReps: '3 sets x 12 reps', clinicalRationale: 'Pectoral stretch and muscle fiber recruitment.' },
        { name: 'Incline Brisk Walk', setsAndReps: '20 mins @ Zone 2', clinicalRationale: 'Cardiovascular glycemic clearance.' },
      ],
      postWorkoutRecovery: 'Hydrate with 500ml water and electrolytes.',
    },
    {
      dayNumber: 2,
      dayName: 'Tuesday',
      protocolTitle: 'Pull & Posterior Kinetic Chain',
      focusArea: 'Latissimus Dorsi, Rhomboids, Biceps',
      durationMins: 50,
      intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
      targetHeartRate: '125 - 140 bpm',
      movements: [
        { name: 'Lat Pulldowns / Cable Rows', setsAndReps: '4 sets x 10 reps', clinicalRationale: 'Scapular retraction.' },
        { name: 'Face Pulls with Resistance Band', setsAndReps: '3 sets x 15 reps', clinicalRationale: 'Rotator cuff stabilization.' },
        { name: 'Brisk Walk', setsAndReps: '20 mins continuous', clinicalRationale: 'Zone 2 aerobic base.' },
      ],
      postWorkoutRecovery: 'Foam roll thoracic spine and rehydrate.',
    },
    {
      dayNumber: 3,
      dayName: 'Wednesday',
      protocolTitle: 'Cardiovascular Aerobic Base & Mobility',
      focusArea: 'Zone 2 Endurance, Spinal Flow',
      durationMins: 40,
      intensityLevel: 'Zone 1-2 (Light-Moderate)',
      targetHeartRate: '105 - 120 bpm',
      movements: [
        { name: 'Zone 2 Steady State Cycling / Walk', setsAndReps: '25 mins steady pace', clinicalRationale: 'Mitochondrial biogenesis.' },
        { name: 'Cat-Cow & Thoracic Thread-the-Needle', setsAndReps: '10 slow cycles', clinicalRationale: 'Intervertebral disc hydration.' },
        { name: '90/90 Hip Flow', setsAndReps: '3 sets x 45s each', clinicalRationale: 'Pelvic alignment.' },
      ],
      postWorkoutRecovery: '15 mins diaphragmatic breathing.',
    },
    {
      dayNumber: 4,
      dayName: 'Thursday',
      protocolTitle: 'Lower Body & Compound Leg Strength',
      focusArea: 'Quadriceps, Hamstrings, Glutes',
      durationMins: 55,
      intensityLevel: 'Zone 4-5 (Peak Performance)',
      targetHeartRate: '135 - 150 bpm',
      movements: [
        { name: 'Goblet Squats / Barbell Squats', setsAndReps: '4 sets x 10 reps', clinicalRationale: 'GLUT4 translocation in major muscle mass.' },
        { name: 'Romanian Deadlifts (RDL)', setsAndReps: '3 sets x 10-12 reps', clinicalRationale: 'Posterior chain eccentric loading.' },
        { name: 'Stationary Cycling Cool-Down', setsAndReps: '15 mins low cadence', clinicalRationale: 'Lactic clearance.' },
      ],
      postWorkoutRecovery: 'Post-workout protein hydration.',
    },
    {
      dayNumber: 5,
      dayName: 'Friday',
      protocolTitle: 'Functional Core & Kinetic Strength',
      focusArea: 'Transverse Abdominis, Glute Medius',
      durationMins: 45,
      intensityLevel: 'Zone 2-3 (Aerobic Base)',
      targetHeartRate: '120 - 135 bpm',
      movements: [
        { name: 'Farmer Carries with Kettlebells', setsAndReps: '3 sets x 40m', clinicalRationale: 'Postural and core endurance.' },
        { name: 'Plank Holds & Bird-Dog', setsAndReps: '3 sets x 35s', clinicalRationale: 'Core stability.' },
        { name: 'Incline Treadmill Walk', setsAndReps: '20 mins @ Zone 2', clinicalRationale: 'Aerobic recovery.' },
      ],
      postWorkoutRecovery: 'Epsom salt warm soak.',
    },
    {
      dayNumber: 6,
      dayName: 'Saturday',
      protocolTitle: 'Aerobic Glycemic Flush & Outdoor Flow',
      focusArea: 'Cardiorespiratory Endurance',
      durationMins: 45,
      intensityLevel: 'Zone 2-3 (Aerobic Base)',
      targetHeartRate: '115 - 130 bpm',
      movements: [
        { name: 'Brisk Walk or Nature Hike', setsAndReps: '30 mins continuous', clinicalRationale: 'Insulin-independent glucose clearance.' },
        { name: 'Bodyweight Step-Ups', setsAndReps: '3 sets x 12 per leg', clinicalRationale: 'Unilateral joint balance.' },
      ],
      postWorkoutRecovery: 'Light myofascial release.',
    },
    {
      dayNumber: 7,
      dayName: 'Sunday',
      protocolTitle: 'Active Recovery & Parasympathetic Restoration',
      focusArea: 'Rest & Cellular Repair',
      durationMins: 30,
      intensityLevel: 'Restorative',
      targetHeartRate: '< 70 bpm baseline',
      movements: [
        { name: 'Diaphragmatic 4-7-8 Breathing', setsAndReps: '15 mins', clinicalRationale: 'Vagus nerve tone optimization.' },
        { name: 'Gentle Stroll & Foam Rolling', setsAndReps: '15 mins relaxed', clinicalRationale: 'Fascial hydration.' },
      ],
      postWorkoutRecovery: 'Restorative sleep and hydration.',
    },
    ];
  }, []);

  const [exercisePlans, setExercisePlans] = useState<ExerciseDayItem[]>(DEFAULT_EXERCISE_SCHEDULE);
  const [domainDos, setDomainDos] = useState<string[]>([
    'Stay hydrated (2.5 - 3.0 L water daily)',
    'Include fibre rich foods (vegetables, salads, whole millets)',
    'Eat on time following circadian meal rhythm',
    'Choose home cooked meals prepared with cold-pressed oils',
    'Maintain portion control and chew mindfully',
  ]);
  const [domainDonts, setDomainDonts] = useState<string[]>([
    'Avoid sugary drinks, sodas, and sweetened beverages',
    'Avoid deep fried foods and trans-fat cooking oils',
    'Avoid packaged snacks and ultra-processed foods',
    'Avoid excess salt and preserved sodium items',
    'Avoid late night eating past 8:30 PM',
  ]);

  // Load manual 7-day plan from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const savedDiet = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
        if (savedDiet) {
          const parsed = JSON.parse(savedDiet);
          if (Array.isArray(parsed) && parsed.length >= 7) {
            setCustomPlans((prev) => {
              if (JSON.stringify(prev) !== savedDiet) return parsed;
              return prev;
            });
          }
        } else if (plans && plans.length >= 7) {
          setCustomPlans(plans);
        }

        const savedCat = localStorage.getItem('CLINICAL_SELECTED_CATEGORY') || localStorage.getItem('ELSHA_SELECTED_CATEGORY');
        if (savedCat && savedCat !== conditionDomain) {
          setConditionDomain(savedCat);
        }
      } catch (e) {
        console.error('Error loading 7-day plan in modal:', e);
      }
    }
  }, [isOpen, plans, conditionDomain]);

  // Generate 7-day exercise plans for the condition
  useEffect(() => {
    try {
      const generated = generateDomainDietAndExercisePlan(conditionDomain, generalInfo, calculations);
      if (generated && generated.exercisePlans) {
        setExercisePlans(generated.exercisePlans);
      }
      if (generated && generated.dos) {
        setDomainDos(generated.dos);
      }
      if (generated && generated.donts) {
        setDomainDonts(generated.donts);
      }
    } catch (e) {
      console.error('Failed to generate exercise plan:', e);
    }
  }, [conditionDomain, generalInfo, calculations]);

  // Listen for storage events
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedDiet = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
        if (savedDiet) {
          const parsed = JSON.parse(savedDiet);
          if (Array.isArray(parsed) && parsed.length >= 7) {
            setCustomPlans(parsed);
          }
        }
      } catch {}
    };
    window.addEventListener('elsha-plan-updated', handleSync);
    return () => window.removeEventListener('elsha-plan-updated', handleSync);
  }, []);

  // Calculate totals
  const currentPlan = customPlans[selectedDayIdx] || customPlans[0] || INITIAL_7_DAY_STUDIO_PLAN[0];

  const totalDayCalories = useMemo(() => {
    if (!currentPlan?.slots) return 1650;
    return currentPlan.slots.reduce((acc, slot) => {
      return (
        acc +
        slot.items.reduce((sAcc, it) => sAcc + (it.calories || 0), 0)
      );
    }, 0);
  }, [currentPlan]);

  const totalDayProtein = useMemo(() => {
    if (!currentPlan?.slots) return 72;
    return Math.round(
      currentPlan.slots.reduce((acc, slot) => {
        return acc + slot.items.reduce((sAcc, it) => sAcc + (it.protein || 0), 0);
      }, 0)
    );
  }, [currentPlan]);

  const totalDayFat = useMemo(() => {
    if (!currentPlan?.slots) return 42;
    return Math.round(
      currentPlan.slots.reduce((acc, slot) => {
        return acc + slot.items.reduce((sAcc, it) => sAcc + (it.fat || 0), 0);
      }, 0)
    );
  }, [currentPlan]);

  const totalDayCarbs = useMemo(() => {
    if (!currentPlan?.slots) return 195;
    return Math.round(
      currentPlan.slots.reduce((acc, slot) => {
        return acc + slot.items.reduce((sAcc, it) => sAcc + (it.carbs || 0), 0);
      }, 0)
    );
  }, [currentPlan]);

  const totalDayFiber = useMemo(() => {
    if (!currentPlan?.slots) return 32;
    return Math.round(
      currentPlan.slots.reduce((acc, slot) => {
        return acc + slot.items.reduce((sAcc, it) => sAcc + (it.fiber || 0), 0);
      }, 0)
    );
  }, [currentPlan]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadGoldBlackPdf = async (includeFormulary = false) => {
    setIsGeneratingPdf(true);
    setStatusMessage('Generating High-Resolution Gold & Black Clinical Prescription PDF...');
    setShowExportMenu(false);

    try {
      const pdfData: Complete2PagePlanPdfData = {
        patient: {
          name: patientName,
          age: patientAge,
          gender: patientGender,
          targetCalories: totalDayCalories,
          patientId: `ZT-RX-${Date.now().toString().slice(-6)}`,
        },
        conditionDomain,
        dietDomain: `${conditionDomain} Clinical Diet Protocol`,
        macros: {
          protein: `${totalDayProtein}g`,
          carbs: `${totalDayCarbs}g`,
          fat: `${totalDayFat}g`,
          fiber: `${totalDayFiber}g`,
        },
        dietGuidelines: {
          clinicalRationale: `Therapeutic clinical nutrition calibrated for ${conditionDomain}.`,
          dos: domainDos,
          donts: domainDonts,
          hydrationTarget: '2.5 - 3.0 Litres water daily',
          timingGuidance: 'Circadian rhythm: 6:00 AM, 8:00 AM, 1:00 PM, 8:00 PM',
        },
        dietPlans: customPlans,
        exerciseGuidelines: {
          sportsMedicineRationale: 'Zone 2 aerobic training & compound resistance stimulate GLUT4 glucose uptake.',
          weeklyTarget: '150 mins aerobic + 2-3 resistance sessions',
          dos: domainDos,
          donts: domainDonts,
          drBharathkumarSignOff: 'Dr. Bharathkumar (MBBS, MD Sports Medicine Specialist)',
        },
        exercisePlans,
        conditionIngredients,
      };

      const safeName = (patientName || 'Patient').replace(/\s+/g, '_');
      const suffix = includeFormulary ? 'Complete_Rx_90Foods' : '2Page_Rx';
      const filename = `Ziathlon_Prescription_${safeName}_${conditionDomain.replace(/\s+/g, '_')}_Gold_Black_${suffix}.pdf`;

      generateGoldAndBlackPrescriptionPdf(pdfData, filename, { includeFormulary });
      setStatusMessage(`✓ Gold & Black Prescription Exported: ${filename}`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (e: any) {
      console.error('Gold & Black PDF generation failed:', e);
      setStatusMessage('Vector PDF export failed. Triggering browser print view...');
      setTimeout(() => {
        window.print();
        setStatusMessage(null);
      }, 1000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadVectorPdf = async () => {
    if (prescriptionTheme === 'gold-black') {
      return handleDownloadGoldBlackPdf(false);
    }
    setIsGeneratingPdf(true);
    setStatusMessage('Generating High-Resolution Clinical PDF...');

    try {
      const pdfData: Complete2PagePlanPdfData = {
        patient: {
          name: patientName,
          age: patientAge,
          gender: patientGender,
          targetCalories: totalDayCalories,
          patientId: `ZT-${Date.now().toString().slice(-6)}`,
        },
        conditionDomain,
        dietDomain: `${conditionDomain} Clinical Diet Protocol`,
        macros: {
          protein: `${totalDayProtein}g`,
          carbs: `${totalDayCarbs}g`,
          fat: `${totalDayFat}g`,
          fiber: `${totalDayFiber}g`,
        },
        dietGuidelines: {
          clinicalRationale: `Therapeutic clinical nutrition calibrated for ${conditionDomain}.`,
          dos: domainDos,
          donts: domainDonts,
          hydrationTarget: '2.5 - 3.0 Litres water daily',
          timingGuidance: 'Circadian rhythm: 6:00 AM, 8:00 AM, 1:00 PM, 8:00 PM',
        },
        dietPlans: customPlans,
        exerciseGuidelines: {
          sportsMedicineRationale: 'Zone 2 aerobic training & compound resistance stimulate GLUT4 glucose uptake.',
          weeklyTarget: '150 mins aerobic + 2-3 resistance sessions',
          dos: domainDos,
          donts: domainDonts,
          drBharathkumarSignOff: 'Dr. Bharathkumar (MBBS, MD Sports Medicine Specialist)',
        },
        exercisePlans,
        conditionIngredients,
      };

      const safeName = patientName.replace(/\s+/g, '_') || 'Patient';
      generateComplete2PagePlanPdf(pdfData, `Clinical_Nutrition_Prescription_${safeName}.pdf`);
      setStatusMessage('Prescription PDF Downloaded Successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e: any) {
      console.error('Vector PDF failed, fallback to print view', e);
      try {
        const safeName = patientName.replace(/\s+/g, '_') || 'Patient';
        await downloadHtmlAsPdf('print-area-wrapper', `Clinical_Nutrition_Prescription_${safeName}.pdf`);
        setStatusMessage('Prescription PDF Exported!');
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err) {
        setStatusMessage('Triggering print dialog for PDF export...');
        window.print();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6">
      <div
        id="print-area-wrapper"
        className={`relative w-full max-w-5xl rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col max-h-[96vh] transition-colors ${
          prescriptionTheme === 'gold-black'
            ? 'bg-[#0A0A0A] border-2 border-[#D4AF37] text-white shadow-[0_0_50px_rgba(212,175,55,0.22)]'
            : 'bg-white border-2 border-[#7E22CE] text-gray-900'
        }`}
      >
        {/* Top Control Bar (Hidden on print) */}
        <div
          className={`flex flex-wrap items-center justify-between pb-4 gap-3 no-print border-b ${
            prescriptionTheme === 'gold-black' ? 'border-[#D4AF37]/30' : 'border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-xl shadow-md ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-gradient-to-br from-[#D4AF37] via-[#F5D76E] to-[#996515] text-black border border-[#D4AF37]'
                  : 'bg-[#7E22CE] text-white'
              }`}
            >
              ℞
            </div>
            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                  prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-purple-700'
                }`}
              >
                Clinical Nutrition Prescription
              </span>
              <h2
                className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-2 ${
                  prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'
                }`}
              >
                <span>Prescription Document</span>
                <span
                  className={`text-xs py-0.5 px-2.5 rounded-full font-mono font-bold ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#181610] text-[#F5D76E] border border-[#D4AF37]/50'
                      : 'bg-purple-50 text-[#7E22CE] border border-purple-300'
                  }`}
                >
                  {conditionDomain}
                </span>
              </h2>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div
            className={`flex items-center gap-1.5 p-1 rounded-xl text-xs border ${
              prescriptionTheme === 'gold-black'
                ? 'bg-[#141418] border-[#D4AF37]/30'
                : 'bg-purple-50/80 border border-purple-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActivePageView('page1')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePageView === 'page1'
                  ? prescriptionTheme === 'gold-black'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-black shadow-md'
                    : 'bg-[#7E22CE] text-white shadow-sm'
                  : prescriptionTheme === 'gold-black'
                  ? 'text-gray-300 hover:text-white hover:bg-white/5'
                  : 'text-gray-700 hover:text-black hover:bg-purple-100/60'
              }`}
            >
              Page 1: 7-Day Diet
            </button>
            <button
              type="button"
              onClick={() => setActivePageView('page2')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePageView === 'page2'
                  ? prescriptionTheme === 'gold-black'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-black shadow-md'
                    : 'bg-[#7E22CE] text-white shadow-sm'
                  : prescriptionTheme === 'gold-black'
                  ? 'text-gray-300 hover:text-white hover:bg-white/5'
                  : 'text-gray-700 hover:text-black hover:bg-purple-100/60'
              }`}
            >
              Page 2: Exercise Protocol
            </button>
            <button
              type="button"
              onClick={() => setActivePageView('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePageView === 'both'
                  ? prescriptionTheme === 'gold-black'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-black shadow-md'
                    : 'bg-[#7E22CE] text-white shadow-sm'
                  : prescriptionTheme === 'gold-black'
                  ? 'text-gray-300 hover:text-white hover:bg-white/5'
                  : 'text-gray-700 hover:text-black hover:bg-purple-100/60'
              }`}
            >
              Both Pages
            </button>
            <button
              type="button"
              onClick={() => setActivePageView('guidelines')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePageView === 'guidelines'
                  ? prescriptionTheme === 'gold-black'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-black shadow-md'
                    : 'bg-[#7E22CE] text-white shadow-sm'
                  : prescriptionTheme === 'gold-black'
                  ? 'text-gray-300 hover:text-white hover:bg-white/5'
                  : 'text-gray-700 hover:text-black hover:bg-purple-100/60'
              }`}
            >
              90 Foods
            </button>
          </div>

          {/* Actions & Theme Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setPrescriptionTheme(prescriptionTheme === 'gold-black' ? 'purple-white' : 'gold-black')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#1C1810] border-[#D4AF37] text-[#F5D76E] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                  : 'bg-purple-100/80 border-purple-300 text-purple-900'
              }`}
              title="Toggle between Clinical Gold & Black and Royal Purple & White theme"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{prescriptionTheme === 'gold-black' ? 'Theme: Gold & Black' : 'Theme: Purple & White'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm border ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#141418] hover:bg-[#1E1E24] text-gray-200 border-[#D4AF37]/40'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-300'
              }`}
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print</span>
            </button>

            {/* Split PDF Export Button with Dropdown Options */}
            <div className="relative">
              <div className="flex items-center">
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={() => handleDownloadGoldBlackPdf(false)}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8860B] hover:brightness-110 text-black rounded-l-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.35)] cursor-pointer disabled:opacity-50"
                  title="Export High-Resolution 2-Page Gold & Black Prescription PDF"
                >
                  <FileDown className="w-4 h-4 text-black" />
                  <span>{isGeneratingPdf ? 'Generating...' : 'Export Gold & Black PDF'}</span>
                </button>
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-2 py-2 bg-[#B8860B] hover:brightness-110 text-black rounded-r-lg text-xs font-black border-l border-black/20 transition-all cursor-pointer disabled:opacity-50"
                  title="Export Options"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#141418] border-2 border-[#D4AF37] rounded-xl shadow-2xl p-1.5 z-50 space-y-1 text-xs text-white">
                  <button
                    type="button"
                    onClick={() => handleDownloadGoldBlackPdf(false)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#252014] text-[#F5D76E] font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <div className="text-white font-bold">2-Page Rx PDF (Gold & Black)</div>
                      <div className="text-[10px] text-gray-400">Diet Plan + Exercise Protocol</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadGoldBlackPdf(true)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#252014] text-[#F5D76E] font-bold flex items-center gap-2 cursor-pointer border-t border-[#D4AF37]/20 pt-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <div className="text-white font-bold">Complete 3-Page Dossier (Gold & Black)</div>
                      <div className="text-[10px] text-gray-400">Includes 90 Foods Clinical Formulary</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleDownloadVectorPdf();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 font-bold flex items-center gap-2 cursor-pointer border-t border-zinc-800 pt-2"
                  >
                    <Save className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-gray-200">Classic Light PDF (Purple & White)</div>
                      <div className="text-[10px] text-gray-400">Standard White Paper Format</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                prescriptionTheme === 'gold-black'
                  ? 'text-gray-400 hover:text-white hover:bg-white/10 border-zinc-700'
                  : 'text-gray-500 hover:text-black hover:bg-gray-100 border-gray-200'
              }`}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`my-2 p-2.5 rounded-lg text-xs font-bold flex items-center gap-2 no-print border ${
              prescriptionTheme === 'gold-black'
                ? 'bg-[#1C1810] border-[#D4AF37] text-[#F5D76E]'
                : 'bg-purple-50 border-purple-300 text-purple-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Prescription Paper Content: Dynamic Gold & Black or Purple & White Theme */}
        <div className="print-area overflow-y-auto pr-1.5 flex-1 space-y-8 pt-4 text-xs font-sans">
          {/* ========================================================================= */}
          {/* PAGE 1: 7-DAY DIET PLAN PRESCRIPTION                                      */}
          {/* ========================================================================= */}
          {(activePageView === 'page1' || activePageView === 'both') && (
            <div
              className={`prescription-page page-1 relative rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl transition-colors ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#0E0E12] border-2 border-[#D4AF37] text-white shadow-[0_0_40px_rgba(212,175,55,0.18)]'
                  : 'bg-white border-2 border-[#7E22CE] text-gray-900'
              }`}
            >
              {/* Official Letterhead Header matching Clinical Stationery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between no-print">
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 px-3 rounded-lg text-xs font-bold text-purple-700 hover:text-purple-950 hover:bg-purple-50 flex items-center gap-1 cursor-pointer"
                  >
                    ‹ Close Prescription
                  </button>
                  <span className="py-1 px-3 rounded-lg text-xs font-black bg-[#7E22CE] text-white flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span>7-Day Plan • Page 1 of 2</span>
                  </span>
                </div>

                <ZiathlonLetterheadHeader
                  pageNumber="PAGE 1 OF 2"
                  rxNumber={`Rx ID: ZIA-RX-${String(patientName).slice(0, 4).toUpperCase()}-2026`}
                  date={new Date().toLocaleDateString('en-GB')}
                />
              </div>

              {/* Title Banner with Patient Details (Name, Age, Gender, Condition) */}
              <div
                className={`rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
                  prescriptionTheme === 'gold-black'
                    ? 'bg-[#16161B] border-[#D4AF37]/40 text-white'
                    : 'bg-purple-50/80 border border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      prescriptionTheme === 'gold-black'
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#996515] text-black'
                        : 'bg-[#7E22CE] text-white'
                    }`}
                  >
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-black tracking-tight ${
                        prescriptionTheme === 'gold-black' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      7 Day Diet Plan
                    </h2>
                    <p
                      className={`text-xs font-semibold ${
                        prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-purple-800'
                      }`}
                    >
                      Personalized nutrition plan for your health goals
                    </p>
                  </div>
                </div>

                {/* Patient Information Table */}
                <div
                  className={`rounded-lg px-4 py-2.5 text-xs grid grid-cols-2 gap-x-6 gap-y-1 font-sans shadow-sm border ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#141418] border-[#D4AF37]/30 text-gray-300'
                      : 'bg-white border border-purple-200'
                  }`}
                >
                  <div className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-gray-600 font-bold'}>
                    Name <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'}`}>
                    {patientName}
                  </div>

                  <div className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-gray-600 font-bold'}>
                    Age <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'}`}>
                    {patientAge}
                  </div>

                  <div className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-gray-600 font-bold'}>
                    Gender <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'}`}>
                    {patientGender}
                  </div>

                  <div className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-gray-600 font-bold'}>
                    Condition <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className={`font-black ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#7E22CE]'}`}>
                    {conditionDomain}
                  </div>
                </div>
              </div>

              {/* CONSOLIDATED 7-DAY DIET PLAN TABLE */}
              <div className="space-y-2">
                <Unified7DayClinicalDietTable
                  plans={customPlans}
                  onUpdatePlans={(newPlans) => {
                    setCustomPlans(newPlans);
                    if (onUpdatePlans) onUpdatePlans(newPlans);
                    try {
                      localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(newPlans));
                      window.dispatchEvent(new Event('elsha-plan-updated'));
                    } catch {}
                  }}
                  clinicTitle="SPORTS MEDICINE CLINIC"
                  sourceBadge="CLINICAL 7-DAY DIET PLAN"
                  categoryTag={`${conditionDomain.toUpperCase()} • THERAPEUTIC NUTRITION`}
                  readOnly={false}
                  variant={prescriptionTheme === 'gold-black' ? 'dark' : 'purple-white'}
                />
              </div>

              {/* Bottom 3 Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Nutrition Summary */}
                <div
                  className={`rounded-xl p-3.5 space-y-2 border-2 ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#141418] border-[#D4AF37]/50 text-white shadow-lg'
                      : 'bg-white border-purple-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-black uppercase pb-1.5 border-b ${
                      prescriptionTheme === 'gold-black'
                        ? 'text-[#D4AF37] border-[#D4AF37]/20'
                        : 'text-[#601188] border-purple-100'
                    }`}
                  >
                    <PieChart className="w-4 h-4 text-[#D4AF37]" />
                    <span>Nutrition Summary</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Energy:</span>
                      <span className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'}`}>
                        {totalDayCalories} kcal
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Protein:</span>
                      <span
                        className={`font-extrabold ${
                          prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'
                        }`}
                      >
                        {totalDayProtein} g
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Fat:</span>
                      <span
                        className={`font-extrabold ${
                          prescriptionTheme === 'gold-black' ? 'text-amber-400' : 'text-amber-700'
                        }`}
                      >
                        {totalDayFat} g
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Carbohydrate:</span>
                      <span className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'}`}>
                        {totalDayCarbs} g
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Fibre:</span>
                      <span
                        className={`font-extrabold ${
                          prescriptionTheme === 'gold-black' ? 'text-emerald-400' : 'text-emerald-700'
                        }`}
                      >
                        {totalDayFiber} g
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Meal Timings */}
                <div
                  className={`rounded-xl p-3.5 space-y-2 border-2 ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#141418] border-[#D4AF37]/50 text-white shadow-lg'
                      : 'bg-white border-purple-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-black uppercase pb-1.5 border-b ${
                      prescriptionTheme === 'gold-black'
                        ? 'text-[#D4AF37] border-[#D4AF37]/20'
                        : 'text-[#601188] border-purple-100'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Meal Timings</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Early Morning:</span>
                      <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'}`}>
                        6:00 AM
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Breakfast:</span>
                      <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'}`}>
                        8:00 AM
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Mid-Morning:</span>
                      <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'}`}>
                        10:30 AM
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Lunch:</span>
                      <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'}`}>
                        1:00 PM
                      </span>
                    </div>
                    <div
                      className={`flex justify-between py-0.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-50'
                      }`}
                    >
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Evening:</span>
                      <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'}`}>
                        5:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}>Dinner:</span>
                      <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'}`}>
                        8:00 PM
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Do's & Don'ts */}
                <div
                  className={`rounded-xl p-3.5 space-y-2 border-2 ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#141418] border-[#D4AF37]/50 text-white shadow-lg'
                      : 'bg-white border-purple-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-black uppercase pb-1.5 border-b ${
                      prescriptionTheme === 'gold-black'
                        ? 'text-[#D4AF37] border-[#D4AF37]/20'
                        : 'text-[#601188] border-purple-100'
                    }`}
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Do's & Don'ts</span>
                  </div>
                  <div className="space-y-1 text-[10.5px]">
                    <div
                      className={`font-bold uppercase tracking-wider text-[9.5px] ${
                        prescriptionTheme === 'gold-black' ? 'text-emerald-400' : 'text-emerald-700'
                      }`}
                    >
                      Do's
                    </div>
                    {(domainDos || []).slice(0, 3).map((d, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-1 font-medium ${
                          prescriptionTheme === 'gold-black' ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{d}</span>
                      </div>
                    ))}

                    <div
                      className={`font-bold uppercase tracking-wider text-[9.5px] pt-1 ${
                        prescriptionTheme === 'gold-black' ? 'text-red-400' : 'text-red-600'
                      }`}
                    >
                      Don'ts
                    </div>
                    {(domainDonts || []).slice(0, 3).map((d, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-1 font-medium ${
                          prescriptionTheme === 'gold-black' ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        <span className="text-red-400 font-bold">✕</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Nutrition Tip Card */}
              <div
                className={`rounded-xl p-3.5 flex items-center justify-between gap-4 border ${
                  prescriptionTheme === 'gold-black'
                    ? 'bg-[#1B1812] border-[#D4AF37]/50 text-white'
                    : 'bg-purple-50/90 border border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      prescriptionTheme === 'gold-black' ? 'bg-[#D4AF37] text-black' : 'bg-[#7E22CE] text-white'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-black uppercase tracking-wider ${
                        prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-gray-900'
                      }`}
                    >
                      Nutrition Tip
                    </h4>
                    <p
                      className={`text-[11px] font-medium ${
                        prescriptionTheme === 'gold-black' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Eat slowly and mindfully. This helps in better digestion, enhances satiety, and prevents glycemic surges.
                    </p>
                  </div>
                </div>

                <div
                  className={`font-serif italic text-base sm:text-lg font-bold select-none text-right flex-shrink-0 ${
                    prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'
                  }`}
                >
                  Healthy Choices Today...
                </div>
              </div>

              {/* Official Clinical Pharmacotherapy / Nutritional Prescription Table */}
              <div className="pt-4 border-t-2 border-[#E5DECE] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-serif font-black text-[#7E22CE]">℞</span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A]">
                      Clinical Prescription Table (Medicines, Dose, Frequency, Duration)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-900 bg-[#F7F3EA] px-2.5 py-1 rounded border border-[#E5DECE]">
                    Validated Medical Regimen
                  </span>
                </div>
                <OfficialClinicalPrescriptionTable
                  patientName={patientName}
                />
              </div>

              {/* Page 1 Footer */}
              <div
                className={`pt-2 flex items-center justify-between text-[10px] font-mono border-t ${
                  prescriptionTheme === 'gold-black'
                    ? 'border-[#D4AF37]/30 text-gray-400'
                    : 'border-purple-200 text-gray-600'
                }`}
              >
                <span>Page 1 of 2 • Official Clinical Nutrition Prescription</span>
                <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-[#601188]'}`}>
                  Prescription ID: #RX-2026-NUTRITION-01
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: 7-DAY EXERCISE PROTOCOL & CLINICAL SIGN-OFF                        */}
          {/* ========================================================================= */}
          {(activePageView === 'page2' || activePageView === 'both') && (
            <div
              className={`prescription-page page-2 relative rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl transition-colors ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#0E0E12] border-2 border-[#D4AF37] text-white shadow-[0_0_40px_rgba(212,175,55,0.18)]'
                  : 'bg-white border-2 border-[#7E22CE] text-gray-900'
              }`}
            >
              {/* Official Letterhead Header matching Physical Paper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between no-print">
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 px-3 rounded-lg text-xs font-bold text-purple-700 hover:text-purple-950 hover:bg-purple-50 flex items-center gap-1 cursor-pointer"
                  >
                    ‹ Close Prescription
                  </button>
                  <span className="py-1 px-3 rounded-lg text-xs font-black bg-[#7E22CE] text-white flex items-center gap-1.5 shadow-sm">
                    <Dumbbell className="w-3.5 h-3.5 text-white" />
                    <span>Exercise Protocol • Page 2 of 2</span>
                  </span>
                </div>

                <ZiathlonLetterheadHeader
                  pageNumber="PAGE 2 OF 2"
                  rxNumber={`Rx ID: ZIA-RX-${String(patientName).slice(0, 4).toUpperCase()}-2026`}
                  date={new Date().toLocaleDateString('en-GB')}
                />
              </div>

              {/* Page 2 Title & Patient Conditioning Profile */}
              <div
                className={`rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
                  prescriptionTheme === 'gold-black'
                    ? 'bg-[#16161B] border-[#D4AF37]/40 text-white'
                    : 'bg-purple-50/80 border border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      prescriptionTheme === 'gold-black'
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#996515] text-black'
                        : 'bg-[#7E22CE] text-white'
                    }`}
                  >
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-black tracking-tight ${
                        prescriptionTheme === 'gold-black' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      7-Day Clinical Exercise Guidelines
                    </h2>
                    <p
                      className={`text-xs font-semibold ${
                        prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-purple-800'
                      }`}
                    >
                      Physiological exercise prescription calibrated to metabolic biomarkers & {conditionDomain}
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-lg px-4 py-2.5 text-xs grid grid-cols-2 gap-x-6 gap-y-1 font-sans shadow-sm border ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#141418] border-[#D4AF37]/30 text-gray-300'
                      : 'bg-white border border-purple-200'
                  }`}
                >
                  <div className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-gray-600 font-bold'}>
                    Patient:
                  </div>
                  <div className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-white' : 'text-black'}`}>
                    {patientName}
                  </div>
                  <div className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-gray-600 font-bold'}>
                    Target Zone:
                  </div>
                  <div className={`font-extrabold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#7E22CE]'}`}>
                    Zone 2 Aerobic + Functional
                  </div>
                </div>
              </div>

              {/* 7 Days Exercise Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(exercisePlans && exercisePlans.length > 0 ? exercisePlans : DEFAULT_EXERCISE_SCHEDULE).slice(0, 6).map((ex) => {
                  const durationText = ex.duration || (ex.durationMins ? `${ex.durationMins} mins` : '45 mins');
                  const focusText = ex.focus || ex.protocolTitle || ex.focusArea || 'Conditioning Session';
                  const movementsList = (ex.movements && ex.movements.length > 0)
                    ? ex.movements
                    : (ex.exercises && ex.exercises.length > 0)
                    ? ex.exercises
                    : [
                        { name: 'Aerobic Base Conditioning', setsAndReps: '20 mins @ Zone 2' },
                        { name: 'Targeted Muscle Group Mobility', setsAndReps: '3 sets x 12 reps' },
                      ];

                  return (
                    <div
                      key={ex.dayNumber}
                      className={`p-3.5 rounded-xl space-y-2 border-2 ${
                        prescriptionTheme === 'gold-black'
                          ? 'bg-[#141418] border-[#D4AF37]/40 text-white shadow-md'
                          : 'bg-white border-purple-200 text-gray-900 shadow-sm'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between pb-1.5 border-b ${
                          prescriptionTheme === 'gold-black' ? 'border-[#D4AF37]/20' : 'border-purple-100'
                        }`}
                      >
                        <span
                          className={`font-black text-xs ${
                            prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'
                          }`}
                        >
                          Day {ex.dayNumber} • {ex.dayName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            prescriptionTheme === 'gold-black'
                              ? 'bg-[#241E12] text-[#F5D76E] border border-[#D4AF37]/50'
                              : 'bg-purple-100 text-[#601188]'
                          }`}
                        >
                          {durationText}
                        </span>
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          prescriptionTheme === 'gold-black' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {focusText}
                      </div>
                      <div
                        className={`space-y-1 text-[11px] ${
                          prescriptionTheme === 'gold-black' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {movementsList.slice(0, 3).map((item: any, idx: number) => {
                          const itemName = typeof item === 'string' ? item : item?.name || 'Movement';
                          const itemDetail = typeof item === 'object' && item?.setsAndReps ? ` (${item.setsAndReps})` : '';
                          return (
                            <div key={idx} className="flex items-start gap-1">
                              <span className={prescriptionTheme === 'gold-black' ? 'text-[#D4AF37] font-bold' : 'text-[#7E22CE] font-bold'}>
                                •
                              </span>
                              <span>{itemName}{itemDetail}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div
                        className={`pt-1 text-[10px] font-mono border-t ${
                          prescriptionTheme === 'gold-black'
                            ? 'text-sky-300 border-[#D4AF37]/20'
                            : 'text-purple-800 border-purple-50'
                        }`}
                      >
                        Target HR: {ex.targetHeartRate || '120 - 135 bpm'}
                      </div>
                    </div>
                  );
                })}

                {/* Day 7 / Rest & Recovery Card */}
                <div
                  className={`p-3.5 rounded-xl space-y-2 border-2 ${
                    prescriptionTheme === 'gold-black'
                      ? 'bg-[#0D1A14] border-emerald-500/50 text-white shadow-md'
                      : 'bg-purple-50/70 border-purple-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between pb-1.5 border-b ${
                      prescriptionTheme === 'gold-black' ? 'border-emerald-500/30' : 'border-purple-100'
                    }`}
                  >
                    <span
                      className={`font-black text-xs ${
                        prescriptionTheme === 'gold-black' ? 'text-emerald-400' : 'text-[#601188]'
                      }`}
                    >
                      Day 7 • Active Recovery
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        prescriptionTheme === 'gold-black'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Rest & Repair
                    </span>
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      prescriptionTheme === 'gold-black' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Parasympathetic Restoration
                  </div>
                  <div
                    className={`space-y-1 text-[11px] ${
                      prescriptionTheme === 'gold-black' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-1">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Diaphragmatic Breathing (4-7-8 rhythm, 15 mins)</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Light Nature Stroll / Gentle Myofascial Foam Rolling</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Epsom Salt Warm Bath for Magnesium Transdermal Uptake</span>
                    </div>
                  </div>
                  <div
                    className={`pt-1 text-[10px] font-mono border-t ${
                      prescriptionTheme === 'gold-black'
                        ? 'text-emerald-400 border-emerald-500/30'
                        : 'text-emerald-800 border-purple-100'
                    }`}
                  >
                    HR: Resting Baseline (&lt;70 bpm)
                  </div>
                </div>
              </div>

              {/* Clinical Note Card */}
              <div
                className={`rounded-xl p-3.5 flex items-center justify-between gap-4 border ${
                  prescriptionTheme === 'gold-black'
                    ? 'bg-[#1B1812] border-[#D4AF37]/50 text-white'
                    : 'bg-purple-50/90 border border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      prescriptionTheme === 'gold-black' ? 'bg-[#D4AF37] text-black' : 'bg-[#7E22CE] text-white'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-black uppercase tracking-wider ${
                        prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-gray-900'
                      }`}
                    >
                      Sports Medicine Clinical Note
                    </h4>
                    <p
                      className={`text-[11px] font-medium ${
                        prescriptionTheme === 'gold-black' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Skeletal muscle is the body's primary endocrine metabolic sink. Zone 2 aerobic pacing and compound resistance training stimulate GLUT4 glucose uptake independently of insulin.
                    </p>
                  </div>
                </div>

                <div
                  className={`font-serif italic text-base sm:text-lg font-bold select-none text-right flex-shrink-0 ${
                    prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-[#601188]'
                  }`}
                >
                  Peak Vitality Today...
                </div>
              </div>

              {/* Certified Clinical Signature Block */}
              <div
                className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border-2 ${
                  prescriptionTheme === 'gold-black'
                    ? 'border-[#D4AF37]/60 bg-[#16161B] text-white shadow-md'
                    : 'border-purple-200 bg-purple-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-black text-xl shadow-sm ${
                      prescriptionTheme === 'gold-black'
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#996515] text-black'
                        : 'bg-[#7E22CE] text-white'
                    }`}
                  >
                    ℞
                  </div>
                  <div>
                    <div
                      className={`text-xs font-black uppercase tracking-wide ${
                        prescriptionTheme === 'gold-black' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      ŽIATHLON SPORTS MEDICINE CLINIC
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-purple-900'
                      }`}
                    >
                      Department of Sports Endocrinology & Clinical Nutrition
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-serif italic font-bold ${
                      prescriptionTheme === 'gold-black' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Authorized Clinical Prescription
                  </div>
                  <div
                    className={`text-[10px] font-mono ${
                      prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-gray-600'
                    }`}
                  >
                    Certification ID: #RX-2026-MEDICINE
                  </div>
                </div>
              </div>

              {/* Page 2 Footer */}
              <div
                className={`pt-2 flex items-center justify-between text-[10px] font-mono border-t ${
                  prescriptionTheme === 'gold-black'
                    ? 'border-[#D4AF37]/30 text-gray-400'
                    : 'border-purple-200 text-gray-600'
                }`}
              >
                <span>Page 2 of 2 • Official Clinical Exercise Prescription</span>
                <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-[#601188]'}`}>
                  Consultant: Dr. Bharathkumar (MD Sports Medicine)
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 90 CONDITION-SPECIFIC INGREDIENT GUIDELINES                               */}
          {/* ========================================================================= */}
          {activePageView === 'guidelines' && (
            <div
              className={`prescription-page page-guidelines relative rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl transition-colors ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#0E0E12] border-2 border-[#D4AF37] text-white shadow-[0_0_40px_rgba(212,175,55,0.18)]'
                  : 'bg-white border-2 border-[#7E22CE] text-gray-900'
              }`}
            >
              {/* Official Letterhead Header */}
              <div className="space-y-2">
                <ZiathlonLetterheadHeader
                  pageNumber="FORMULARY & INGREDIENTS"
                  rxNumber={`Rx ID: ZIA-RX-${String(patientName).slice(0, 4).toUpperCase()}-2026`}
                  date={new Date().toLocaleDateString('en-GB')}
                />
              </div>

              <div
                className={`p-3.5 rounded-xl text-xs space-y-1 border ${
                  prescriptionTheme === 'gold-black'
                    ? 'bg-[#16161B] border-[#D4AF37]/40 text-white'
                    : 'bg-purple-50/80 border border-purple-200'
                }`}
              >
                <div className="font-medium">
                  <span className={prescriptionTheme === 'gold-black' ? 'text-[#F5D76E] font-bold' : 'text-[#601188] font-bold'}>
                    Mechanism:{' '}
                  </span>
                  {conditionIngredients.clinicalTagline}
                </div>
                <div
                  className={`font-mono text-[11px] ${
                    prescriptionTheme === 'gold-black' ? 'text-emerald-400' : 'text-emerald-800'
                  }`}
                >
                  <span className={prescriptionTheme === 'gold-black' ? 'text-gray-400 font-bold' : 'text-gray-700 font-bold'}>
                    Health Target:{' '}
                  </span>
                  {conditionIngredients.primaryGoal}
                </div>
              </div>

              {/* 8 Categories Grid */}
              <div className="space-y-4 text-xs">
                {[
                  { title: '🌾 15 Cereals', items: conditionIngredients?.cereals || [], color: 'text-amber-500' },
                  { title: '🫘 15 Pulses', items: conditionIngredients?.pulses || [], color: 'text-emerald-400' },
                  { title: '🥦 15 Vegetables', items: conditionIngredients?.vegetables || [], color: 'text-green-400' },
                  { title: '🍎 15 Fruits', items: conditionIngredients?.fruits || [], color: 'text-rose-400' },
                  { title: '🥜 10 Nuts & Seeds', items: conditionIngredients?.nutsAndSeeds || [], color: 'text-orange-400' },
                  { title: '🥛 5 Dairy Foods', items: conditionIngredients?.dairyFoods || [], color: 'text-cyan-400' },
                  { title: '🌿 5 Ayurvedic Foods', items: conditionIngredients?.ayurvedicFoods || [], color: 'text-purple-400' },
                  { title: '⚡ 10 Functional Foods', items: conditionIngredients?.functionalFoods || [], color: 'text-yellow-400' },
                ].map((cat, ci) => (
                  <div
                    key={ci}
                    className={`rounded-xl p-3.5 space-y-2 border ${
                      prescriptionTheme === 'gold-black'
                        ? 'bg-[#141418] border-[#D4AF37]/30 text-white shadow-md'
                        : 'bg-white border-purple-200 shadow-sm'
                    }`}
                  >
                    <div
                      className={`font-black uppercase tracking-wider text-xs ${cat.color} flex items-center justify-between pb-1.5 border-b ${
                        prescriptionTheme === 'gold-black' ? 'border-zinc-800' : 'border-purple-100'
                      }`}
                    >
                      <span>{cat.title}</span>
                      <span className="text-[10px] font-mono text-gray-400 font-normal">
                        {(cat.items || []).length} Items
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {(cat.items || []).map((it) => (
                        <div
                          key={it.id}
                          className={`p-2.5 rounded text-[11px] space-y-1 border ${
                            prescriptionTheme === 'gold-black'
                              ? 'bg-[#1A1A22] border-zinc-800 text-white'
                              : 'bg-purple-50/40 border-purple-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#F5D76E]' : 'text-gray-900'}`}>
                              #{it.rank} {it.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                it.status === 'Recommended'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : it.status === 'Caution'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {it.status}
                            </span>
                          </div>
                          <div className={`text-[10px] ${prescriptionTheme === 'gold-black' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Portion: {it.portion}
                          </div>
                          <div
                            className={`text-[10px] leading-tight line-clamp-2 ${
                              prescriptionTheme === 'gold-black' ? 'text-gray-300' : 'text-purple-950'
                            }`}
                          >
                            {it.therapeuticMechanism}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Guidelines Footer */}
              <div
                className={`pt-2 flex items-center justify-between text-[10px] font-mono border-t ${
                  prescriptionTheme === 'gold-black'
                    ? 'border-[#D4AF37]/30 text-gray-400'
                    : 'border-purple-200 text-gray-600'
                }`}
              >
                <span>Certified Clinical Ingredient Formulary</span>
                <span className={`font-bold ${prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-[#601188]'}`}>
                  Žiathlon Sports Medicine Clinic
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer (Hidden on print) */}
        <div
          className={`mt-3 pt-3 flex items-center justify-between no-print border-t ${
            prescriptionTheme === 'gold-black' ? 'border-[#D4AF37]/30' : 'border-purple-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold ${
                prescriptionTheme === 'gold-black' ? 'text-[#D4AF37]' : 'text-purple-900'
              }`}
            >
              Clinical Nutrition Prescription • Synchronized with 7-Day Studio
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#1C1810] text-[#F5D76E] border border-[#D4AF37]/40'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {prescriptionTheme === 'gold-black' ? 'Gold & Black Rx' : 'Royal Purple Rx'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={() => handleDownloadGoldBlackPdf(false)}
              className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 text-black text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5 text-black" />
              <span>{isGeneratingPdf ? 'Exporting...' : 'Export Gold & Black PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm ${
                prescriptionTheme === 'gold-black'
                  ? 'bg-[#1E1E24] hover:bg-[#2A2A32] text-white border border-zinc-700'
                  : 'bg-[#7E22CE] hover:bg-[#601188] text-white'
              }`}
            >
              Close Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
