import React, { useState, useEffect, useMemo } from 'react';
import { GeneralInfo, Calculations, DietDayPlan, DiabetesGuidelines } from '../types';
import { ElshaLogo } from './ElshaLogo';
import { DrBharathkumarSportsMedicineLogo } from './DrBharathkumarSportsMedicineLogo';
import {
  Printer,
  Calendar,
  Clock,
  Sparkles,
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
import {
  generateConditionSpecificIngredientGuidelines,
  ConditionIngredientGuidelines,
} from '../data/conditionAdaptiveIngredientsEngine';
import { downloadHtmlAsPdf, generateComplete2PagePlanPdf, Complete2PagePlanPdfData } from '../utils/pdfGenerator';

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
  const [showMatrixView, setShowMatrixView] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);


  // Patient / Clinical Details
  const [patientName, setPatientName] = useState(generalInfo.name || 'Kiruthika');
  const [patientAge, setPatientAge] = useState(generalInfo.age ? String(generalInfo.age) : '22');
  const [patientGender, setPatientGender] = useState(generalInfo.sex || 'Female');
  const [conditionDomain, setConditionDomain] = useState(() => {
    try {
      const savedCat = localStorage.getItem('ELSHA_SELECTED_CATEGORY');
      if (savedCat) return savedCat;
    } catch {}
    return 'Weight Management';
  });

  // Unique 90 Condition Ingredients
  const conditionIngredients = useMemo(() => {
    return generateConditionSpecificIngredientGuidelines(conditionDomain);
  }, [conditionDomain]);

  // Manual 7-Day Plans from Custom7DayPlanStudio
  const [customPlans, setCustomPlans] = useState<CustomDayPlan[]>(INITIAL_7_DAY_STUDIO_PLAN);

  // 7-Day Exercise Plans
  const [exercisePlans, setExercisePlans] = useState<ExerciseDayItem[]>([]);
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

  // Load manual 7-day plan from localStorage (what was done in Custom7DayPlanStudio)
  useEffect(() => {
    if (isOpen) {
      try {
        // 1. Load manual 7-day diet plan from studio
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
          setCustomPlans((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(plans)) return plans;
            return prev;
          });
        }

        // 2. Load domain and condition
        const savedCat = localStorage.getItem('ELSHA_SELECTED_CATEGORY');
        if (savedCat) {
          setConditionDomain(savedCat);
        }

        // 3. Generate exercise guidelines based on domain & patient data
        const domainPkg = generateDomainDietAndExercisePlan(
          'diabetes',
          generalInfo,
          calculations
        );
        if (domainPkg) {
          setExercisePlans(domainPkg.exercisePlans);
          if (domainPkg.dos.length > 0) setDomainDos(domainPkg.dos);
          if (domainPkg.donts.length > 0) setDomainDonts(domainPkg.donts);
        }
      } catch (e) {
        console.error('Could not load prescription data:', e);
      }
    }
  }, [isOpen, generalInfo, calculations, plans]);

  // Real-time synchronization whenever 7-Day Studio saves plans
  useEffect(() => {
    const handleSync = () => {
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
        }
      } catch (e) {
        console.error('Could not sync updated plans:', e);
      }
    };
    window.addEventListener('elsha-plan-updated', handleSync);
    return () => window.removeEventListener('elsha-plan-updated', handleSync);
  }, []);

  useEffect(() => {
    if (plans && Array.isArray(plans) && plans.length >= 7) {
      setCustomPlans((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(plans)) return plans;
        return prev;
      });
    }
  }, [plans]);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setActivePageView('both');
    
    // Allow DOM to update to 'both' view before capturing
    setTimeout(async () => {
      const element = document.querySelector('.print-area') as HTMLElement;
      if (!element) return;
      
      setIsGeneratingPdf(true);
      setStatusMessage('Generating PDF... Please wait');
      
      try {
        const originalClasses = element.className;
        element.classList.remove('overflow-y-auto', 'max-h-[96vh]');
        
        await downloadHtmlAsPdf(element, `Ziathlon_Rx_${patientName.replace(/\s+/g, '_')}.pdf`);
        
        element.className = originalClasses;
        setStatusMessage('PDF downloaded successfully!');
      } catch (err: any) {
        console.error('PDF generation error:', err);
        setStatusMessage(`PDF Error: ${err.message}`);
      } finally {
        setIsGeneratingPdf(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    }, 1000); // Increased timeout to ensure React finishes rendering both pages
  };

  const handleDownloadVectorPdf = () => {
    try {
      const pdfData: Complete2PagePlanPdfData = {
        patient: {
          name: patientName,
          age: patientAge,
          gender: patientGender,
          weight: generalInfo.weight,
          height: generalInfo.height,
          bmi: calculations.bmi,
          targetCalories: totalDayCalories,
          patientId: `ZT-${Date.now().toString().slice(-6)}`,
        },
        conditionDomain: conditionDomain,
        dietDomain: 'Therapeutic Glycemic Reset Protocol',
        macros: {
          protein: `${totalDayProtein}g`,
          carbs: `${totalDayCarbs}g`,
          fat: `${totalDayFat}g`,
          fiber: `${totalDayFiber}g`,
        },
        dietGuidelines: {
          clinicalRationale: 'Therapeutic diet calibrated to glycemic and metabolic recovery.',
          dos: domainDos.length > 0 ? domainDos : [
            'Maintain regular meal timings to promote circadian metabolic stability.',
            'Start each meal with high-fiber salad or greens before carbs.',
            'Hydrate with minimum 2.8 liters of filtered water throughout the day.',
            'Include lean protein in all 3 major meals.',
            'Complete dinner at least 2.5 hours before sleeping.',
          ],
          donts: domainDonts.length > 0 ? domainDonts : [
            'Avoid refined carbohydrates, table sugars, and sweetened juices.',
            'Do not skip meals or engage in unplanned fasts without supervision.',
            'Avoid trans fats, deep-fried snacks, and processed bakery items.',
            'Refrain from late-night carbohydrate snacking.',
            'Avoid eating within 2 hours of bedtime.',
          ],
          hydrationTarget: '2.8 - 3.0 Liters daily',
          timingGuidance: 'Circadian 12-hour fasting window (8:00 PM to 8:00 AM)',
        },
        dietPlans: customPlans,
        exerciseGuidelines: {
          sportsMedicineRationale: 'Sports Medicine exercise protocol designed to optimize GLUT-4 glucose clearance.',
          weeklyTarget: '250 Mins / Week • Zone 2 Cardio & Strength',
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
        },
        exercisePlans: exercisePlans,
      };

      generateComplete2PagePlanPdf(pdfData, `Ziathlon_2Page_Rx_${patientName.replace(/\s+/g, '_')}.pdf`);
      setStatusMessage('✓ 2-Page Vector PDF Downloaded!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Vector PDF error:', err);
      handleDownloadPdf();
    }
  };

  // Helper to format slot meal text
  const currentActivePlan = customPlans[selectedDayIdx] || customPlans[0] || INITIAL_7_DAY_STUDIO_PLAN[0];

  // Calculate day macros
  const totalDayCalories = currentActivePlan.slots.reduce((acc, s) => {
    const slotKcal = s.items.reduce((sum, it) => sum + (it.calories || 0), 0);
    return acc + (slotKcal || s.targetKcal || 0);
  }, 0) || currentActivePlan.targetCalories || 1600;

  const totalDayProtein = currentActivePlan.slots.reduce((acc, s) => {
    return acc + s.items.reduce((sum, it) => sum + (it.protein || 0), 0);
  }, 0) || 61;

  const totalDayFat = currentActivePlan.slots.reduce((acc, s) => {
    return acc + s.items.reduce((sum, it) => sum + (it.fat || 0), 0);
  }, 0) || 32;

  const totalDayCarbs = currentActivePlan.slots.reduce((acc, s) => {
    return acc + s.items.reduce((sum, it) => sum + (it.carbs || 0), 0);
  }, 0) || 212;

  const totalDayFiber = currentActivePlan.slots.reduce((acc, s) => {
    return acc + s.items.reduce((sum, it) => sum + (it.fiber || 0), 0);
  }, 0) || 32;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#060c1d] border-2 border-yellow-500/60 rounded-2xl p-3 sm:p-6 shadow-[0_0_50px_rgba(202,138,4,0.35)] text-white max-h-[96vh] flex flex-col my-auto font-sans">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-yellow-500/50 no-print">
          {/* Page Switcher Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActivePageView('page1')}
              className={`py-1.5 px-3 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePageView === 'page1'
                  ? 'bg-yellow-600 text-white shadow-[0_0_12px_rgba(202,138,4,0.6)]'
                  : 'bg-black/60 text-yellow-200 border border-yellow-500/40 hover:bg-yellow-950/40'
              }`}
            >
              Page 1: 7-Day Diet Plan & Demographics
            </button>
            <button
              type="button"
              onClick={() => setActivePageView('page2')}
              className={`py-1.5 px-3 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePageView === 'page2'
                  ? 'bg-yellow-600 text-white shadow-[0_0_12px_rgba(202,138,4,0.6)]'
                  : 'bg-black/60 text-yellow-200 border border-yellow-500/40 hover:bg-yellow-950/40'
              }`}
            >
              Page 2: 7-Day Exercise Guidelines & Dr. Bharathkumar
            </button>
            <button
              type="button"
              onClick={() => setActivePageView('guidelines')}
              className={`py-1.5 px-3 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePageView === 'guidelines'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                  : 'bg-black/60 text-purple-300 border border-purple-500/40 hover:bg-purple-950/40'
              }`}
            >
              90 Condition Ingredients
            </button>
            <button
              type="button"
              onClick={() => setActivePageView('both')}
              className={`py-1.5 px-3 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer hidden md:inline-flex ${
                activePageView === 'both'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                  : 'bg-black/60 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-950/40'
              }`}
            >
              View Both Pages (Full 2-Page Print Layout)
            </button>
          </div>

          {/* Print & Download Actions */}
          <div className="flex items-center gap-2">
            {statusMessage && (
              <span className="text-xs font-bold text-yellow-400 animate-pulse mr-2">
                {statusMessage}
              </span>
            )}
            <button
              type="button"
              onClick={handleDownloadVectorPdf}
              className="py-1.5 px-4 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(202,138,4,0.5)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF (2-Page)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white text-base rounded border border-white/20 hover:border-yellow-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Prescription Paper Content (Scrollable on screen, 2 pages printed) */}
        <div
          className="print-area overflow-y-auto pr-1.5 flex-1 space-y-8 pt-4 text-xs font-sans"
        >
          {/* ========================================================================= */}
          {/* PAGE 1: 7-DAY DIET PLAN PRESCRIPTION (EXACT LAYOUT AS ELSHADA.jpeg)       */}
          {/* ========================================================================= */}
          {(activePageView === 'page1' || activePageView === 'both') && (
            <div className="prescription-page page-1 relative bg-black border-2 border-yellow-500/50 rounded-2xl p-4 sm:p-6 space-y-5 shadow-2xl">
              
              {/* Top Header matching ELSHADA.jpeg */}
              <div className="flex items-center justify-between pb-3 border-b border-yellow-500/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-yellow-400 hover:text-white rounded-lg hover:bg-yellow-950/40 no-print"
                  title="Back"
                >
                  <span className="text-lg font-bold">‹</span>
                </button>

                {/* Centered ELSHA Logo & Tagline */}
                <div className="flex-1 flex justify-center">
                  <ElshaLogo size="md" showSubtitle={true} />
                </div>

                {/* Right 7 Day Plan Pill Button */}
                <div className="flex items-center gap-2">
                  <span className="py-1 px-3 bg-yellow-950/80 border border-yellow-400/60 rounded-lg text-yellow-200 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.25)]">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span>7 Day Plan</span>
                  </span>
                </div>
              </div>

              {/* Title Banner with Patient Details (Name, Age, Gender, Condition) */}
              <div className="bg-[#111] border border-yellow-500/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-yellow-600/30 border border-yellow-400 flex items-center justify-center text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      7 Day Diet Plan
                    </h2>
                    <p className="text-xs text-yellow-200 font-medium">
                      Personalized nutrition plan for your health goals
                    </p>
                  </div>
                </div>

                {/* Patient Information Table as in ELSHADA.jpeg */}
                <div className="bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-2.5 text-xs grid grid-cols-2 gap-x-6 gap-y-1 font-sans">
                  <div className="text-gray-400 font-medium">
                    Name <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className="text-white font-bold">{patientName}</div>

                  <div className="text-gray-400 font-medium">
                    Age <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className="text-white font-bold">{patientAge}</div>

                  <div className="text-gray-400 font-medium">
                    Gender <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className="text-white font-bold">{patientGender}</div>

                  <div className="text-gray-400 font-medium">
                    Condition <span className="float-right text-gray-500 mr-2">:</span>
                  </div>
                  <div className="text-yellow-400 font-black">{conditionDomain}</div>
                </div>
              </div>

              {/* THE CONSOLIDATED 7-DAY DIET PLAN TABLE (EXACT ONE-TABLE ALIGNMENT MATCHING CLINIC REFERENCE) */}
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
                  categoryTag={`${conditionDomain.toUpperCase()} • LOW GLYCEMIC FOODS`}
                  readOnly={false}
                />
              </div>

              {/* Bottom 3 Summary Cards matching ELSHADA.jpeg */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Nutrition Summary */}
                <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-yellow-200 pb-1.5 border-b border-yellow-500/20">
                    <PieChart className="w-4 h-4 text-yellow-400" />
                    <span>Nutrition Summary</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Energy:</span>
                      <span className="font-bold text-white">{totalDayCalories} kcal</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Protein:</span>
                      <span className="font-bold text-yellow-200">{totalDayProtein} g</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Fat:</span>
                      <span className="font-bold text-amber-300">{totalDayFat} g</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Carbohydrate:</span>
                      <span className="font-bold text-white">{totalDayCarbs} g</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-gray-400">Fibre:</span>
                      <span className="font-bold text-emerald-400">{totalDayFiber} g</span>
                    </div>
                  </div>
                </div>

                {/* 2. Meal Timings */}
                <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-yellow-200 pb-1.5 border-b border-yellow-500/20">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>Meal Timings</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Early Morning:</span>
                      <span className="font-bold text-yellow-200">6:00 AM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Breakfast:</span>
                      <span className="font-bold text-yellow-200">8:00 AM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Mid-Morning:</span>
                      <span className="font-bold text-yellow-200">10:30 AM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Lunch:</span>
                      <span className="font-bold text-yellow-200">1:00 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-white/5">
                      <span className="text-gray-400">Evening:</span>
                      <span className="font-bold text-yellow-200">5:00 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-gray-400">Dinner:</span>
                      <span className="font-bold text-yellow-200">8:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* 3. Do's & Don'ts */}
                <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-yellow-200 pb-1.5 border-b border-yellow-500/20">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Do's & Don'ts</span>
                  </div>
                  <div className="space-y-1 text-[10.5px]">
                    <div className="text-emerald-400 font-bold uppercase tracking-wider text-[9.5px]">
                      Do's
                    </div>
                    {domainDos.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-start gap-1 text-gray-200">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{d}</span>
                      </div>
                    ))}

                    <div className="text-red-400 font-bold uppercase tracking-wider text-[9.5px] pt-1">
                      Don'ts
                    </div>
                    {domainDonts.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-start gap-1 text-gray-200">
                        <span className="text-red-400 font-bold">✕</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Nutrition Tip Card matching ELSHADA.jpeg */}
              <div className="bg-[#091530] border border-yellow-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-200 flex-shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Nutrition Tip
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      Eat slowly and mindfully. This helps in better digestion and prevents overeating.
                    </p>
                  </div>
                </div>

                <div className="font-serif italic text-base sm:text-lg text-yellow-200 select-none text-right flex-shrink-0">
                  Healthy Choices Today...
                </div>
              </div>

              {/* Page 1 Footer stamp */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400 font-mono border-t border-yellow-500/20">
                <span>Page 1 of 2 • Official Clinical Nutrition Prescription</span>
                <span className="text-yellow-400 font-bold">Prescription ID: #ELSHA-2026-RX-982</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PAGE 2: 7-DAY EXERCISE PROTOCOL & DR. BHARATHKUMAR SPORTS MEDICINE SIGN-OFF */}
          {/* ========================================================================= */}
          {(activePageView === 'page2' || activePageView === 'both') && (
            <div className="prescription-page page-2 relative bg-black border-2 border-yellow-500/50 rounded-2xl p-4 sm:p-6 space-y-5 shadow-2xl">
              
              {/* Page 2 Header */}
              <div className="flex items-center justify-between pb-3 border-b border-yellow-500/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-yellow-400 hover:text-white rounded-lg hover:bg-yellow-950/40 no-print"
                  title="Back"
                >
                  <span className="text-lg font-bold">‹</span>
                </button>

                <div className="flex-1 flex justify-center">
                  <ElshaLogo size="md" showSubtitle={true} />
                </div>

                <div className="flex items-center gap-2">
                  <span className="py-1 px-3 bg-yellow-950/80 border border-yellow-400/60 rounded-lg text-yellow-200 text-xs font-bold flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-yellow-400" />
                    <span>7-Day Exercise Protocol</span>
                  </span>
                </div>
              </div>

              {/* Page 2 Title & Patient Conditioning Profile */}
              <div className="bg-[#111] border border-yellow-500/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-yellow-600/30 border border-yellow-400 flex items-center justify-center text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      7-Day Clinical Exercise Guidelines
                    </h2>
                    <p className="text-xs text-yellow-200 font-medium">
                      Physiological exercise prescription calibrated to metabolic biomarkers & domain
                    </p>
                  </div>
                </div>

                <div className="bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-2.5 text-xs grid grid-cols-2 gap-x-6 gap-y-1 font-sans">
                  <div className="text-gray-400 font-medium">Patient :</div>
                  <div className="text-white font-bold">{patientName} ({patientAge} yrs, {patientGender})</div>

                  <div className="text-gray-400 font-medium">Condition :</div>
                  <div className="text-yellow-400 font-bold">{conditionDomain}</div>

                  <div className="text-gray-400 font-medium">Weekly Target :</div>
                  <div className="text-emerald-400 font-bold">250 Mins / Week • Zone 2 Cardio & Strength</div>
                </div>
              </div>

              {/* 7-Day Exercise Protocol (Monday through Sunday) Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-yellow-500/20 pb-1.5">
                  <h3 className="text-xs uppercase font-black tracking-widest text-yellow-200 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-yellow-400" />
                    <span>7-Day Daily Movement Schedule (Monday to Sunday)</span>
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Department of Sports Medicine • Clinical Exercise Physiology
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs">
                  {exercisePlans.slice(0, 7).map((ex) => (
                    <div
                      key={ex.dayNumber || ex.day}
                      className="p-3 bg-[#0a0a0a] border border-yellow-500/30 rounded-xl space-y-2 flex flex-col justify-between hover:border-yellow-400/60 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-1 border-b border-yellow-500/20">
                          <span className="font-black text-yellow-200 uppercase text-[10.5px]">
                            {ex.dayName || ex.day}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">
                            {ex.durationMins ? `${ex.durationMins}m` : ex.duration || ''}
                          </span>
                        </div>

                        <div className="font-bold text-white text-[11px] mt-1.5 leading-snug">
                          {ex.protocolTitle || ex.focus || ''}
                        </div>

                        {ex.targetHeartRate && (
                          <p className="text-[9.5px] text-sky-200 mt-0.5">
                            Target HR: <span className="font-mono text-white font-bold">{ex.targetHeartRate}</span>
                          </p>
                        )}
                        {!ex.targetHeartRate && (ex.focusArea || ex.activity || ex.guideline) && (
                          <p className="text-[9.5px] text-sky-200 mt-0.5 leading-tight">
                            {ex.focusArea || ex.activity || ex.guideline}
                          </p>
                        )}

                        <div className="mt-2 space-y-1.5">
                          {(ex.movements || ex.exercises || []).slice(0, 2).map((m: any, mIdx: number) => (
                            <div key={mIdx} className="bg-black/40 p-1.5 rounded border border-white/5 text-[9.5px]">
                              <div className="text-yellow-200 font-bold leading-tight">{m.name || m}</div>
                              {m.setsAndReps && <div className="text-gray-300 font-mono text-[8.5px]">{m.setsAndReps}</div>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {(ex.postWorkoutRecovery || ex.intensityLevel || ex.intensity) && (
                        <div className="pt-2 border-t border-white/5 text-[8.5px] text-gray-400 leading-tight">
                          {ex.postWorkoutRecovery && (
                            <>
                              <span className="text-emerald-400 font-bold">Recovery:</span> {ex.postWorkoutRecovery}
                            </>
                          )}
                          {!ex.postWorkoutRecovery && (ex.intensityLevel || ex.intensity) && (
                            <>
                              <span className="text-emerald-400 font-bold">Intensity:</span> {ex.intensityLevel || ex.intensity}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehensive Exercise & Clinical Do's & Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DO'S */}
                <div className="bg-[#0a0a0a] border-2 border-emerald-500/60 rounded-xl p-4 space-y-2.5 shadow-lg">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Clinical & Exercise Do's (Essential Principles)
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-gray-200 font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Hydration with Electrolytes:</strong> Drink 500ml water 30 minutes before workout; replenish 2.5-3L total daily.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Post-Workout Window:</strong> Consume 20-25g protein and complex carbs within 45 minutes to optimize muscle protein synthesis.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Dynamic Warm-Up:</strong> Perform 8-10 minutes of mobility and dynamic stretches before loading any heavy compound resistance.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Controlled Cadence:</strong> Emphasize 3-second controlled eccentric descent rather than ego-lifting heavy weights.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Restorative Sleep:</strong> Prioritize 7.5 to 8.5 hours of uninterrupted nocturnal sleep for muscular glycogen replenishment.</span>
                    </li>
                  </ul>
                </div>

                {/* DON'TS */}
                <div className="bg-[#0a0a0a] border-2 border-red-500/60 rounded-xl p-4 space-y-2.5 shadow-lg">
                  <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center text-red-400">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-red-400">
                      Avoid Habits & Exercise Don'ts
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-gray-200 font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>No Fasted Training on Hypoglycemics:</strong> Never exercise on prolonged empty stomach if taking insulin or sulfonylureas.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>No Sugary Energy Drinks:</strong> Avoid commercial canned energy boosters, high-fructose juices, and liquid syrups.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>No Training Through Joint Pain:</strong> Never push through sharp joint pain, tendon inflammation, or severe dizziness.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>No Skipping Cool-Down:</strong> Never cease high-effort cardio abruptly without a 5-minute cool-down walk to prevent venous pooling.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>No Late Night Vigorous Workouts:</strong> Avoid intense training past 8:30 PM to protect melatonin onset and circadian sleep depth.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Tip */}
              <div className="bg-[#091530] border border-yellow-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-200 flex-shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Sports Medicine Clinical Note
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      Skeletal muscle is the body's largest endocrine organ. Zone 2 aerobic pacing and compound resistance training stimulate GLUT4 glucose uptake independently of insulin.
                    </p>
                  </div>
                </div>

                <div className="font-serif italic text-base sm:text-lg text-yellow-200 select-none text-right flex-shrink-0">
                  Peak Performance Today...
                </div>
              </div>

              {/* ========================================================================= */}
              {/* EXACT USER REQUIREMENT: LOGO WITH DR.BHARATHKUMAR SPORTS MEDICINE AT BOTTOM */}
              {/* ========================================================================= */}
              <div className="pt-2">
                <DrBharathkumarSportsMedicineLogo variant="full" />
              </div>

              {/* Page 2 Footer stamp */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400 font-mono border-t border-yellow-500/20">
                <span>Page 2 of 2 • Official Clinical Exercise Prescription</span>
                <span className="text-yellow-400 font-bold">Consultant: Dr. Bharathkumar • Sports Medicine</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 90 CONDITION-SPECIFIC INGREDIENT GUIDELINES (15 Cereals, 15 Pulses, etc.) */}
          {/* ========================================================================= */}
          {activePageView === 'guidelines' && (
            <div className="prescription-page page-guidelines relative bg-black border-2 border-purple-500/50 rounded-2xl p-4 sm:p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
                <ElshaLogo size="md" showSubtitle={true} />
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
                    Clinical Ingredient Guidelines
                  </span>
                  <h3 className="text-sm font-black text-white uppercase">
                    {conditionIngredients.conditionName} • 90 Items
                  </h3>
                </div>
              </div>

              <div className="bg-[#111] p-3 border border-purple-500/30 rounded-xl text-xs space-y-1">
                <div className="text-purple-200 font-medium">
                  <span className="text-purple-400 font-bold">Mechanism: </span>
                  {conditionIngredients.clinicalTagline}
                </div>
                <div className="text-emerald-300 font-mono text-[11px]">
                  <span className="text-gray-300 font-bold">Health Target: </span>
                  {conditionIngredients.primaryGoal}
                </div>
              </div>

              {/* 8 Categories Grid */}
              <div className="space-y-4 text-xs">
                {[
                  { title: '🌾 15 Cereals', items: conditionIngredients.cereals, color: 'text-amber-300' },
                  { title: '🫘 15 Pulses', items: conditionIngredients.pulses, color: 'text-emerald-300' },
                  { title: '🥦 15 Vegetables', items: conditionIngredients.vegetables, color: 'text-green-400' },
                  { title: '🍎 15 Fruits', items: conditionIngredients.fruits, color: 'text-rose-300' },
                  { title: '🥜 10 Nuts & Seeds', items: conditionIngredients.nutsAndSeeds, color: 'text-orange-300' },
                  { title: '🥛 5 Dairy Foods', items: conditionIngredients.dairyFoods, color: 'text-cyan-300' },
                  { title: '🌿 5 Ayurvedic Foods', items: conditionIngredients.ayurvedicFoods, color: 'text-purple-300' },
                  { title: '⚡ 10 Functional Foods', items: conditionIngredients.functionalFoods, color: 'text-yellow-300' },
                ].map((cat, ci) => (
                  <div key={ci} className="bg-black/60 border border-white/10 rounded-xl p-3 space-y-2">
                    <div className={`font-black uppercase tracking-wider text-xs ${cat.color} flex items-center justify-between border-b border-white/10 pb-1`}>
                      <span>{cat.title}</span>
                      <span className="text-[10px] font-mono text-gray-400 font-normal">
                        {cat.items.length} Condition Items
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {cat.items.map((it) => (
                        <div key={it.id} className="p-2 bg-[#091530] border border-white/5 rounded text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              #{it.rank} {it.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                it.status === 'Recommended'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : it.status === 'Caution'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                  : 'bg-red-950 text-red-300 border border-red-500/40'
                              }`}
                            >
                              {it.status}
                            </span>
                          </div>
                          <div className="text-gray-400 text-[10px]">Portion: {it.portion}</div>
                          <div className="text-purple-200 text-[10px] leading-tight line-clamp-2">
                            {it.therapeuticMechanism}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <DrBharathkumarSportsMedicineLogo variant="full" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer (Hidden on print) */}
        <div className="mt-3 pt-3 border-t border-yellow-500/30 flex items-center justify-between no-print">
          <span className="text-[10px] font-mono text-gray-400">
            ELSHA AI 2-Page Prescription • Synchronized with 7-Day Studio & WhatsApp Hub
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-[0_0_12px_rgba(202,138,4,0.5)]"
          >
            Close Prescription
          </button>
        </div>
      </div>
    </div>
  );
};
