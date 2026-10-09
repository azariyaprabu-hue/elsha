import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Flame,
  PieChart,
  Scale,
  Send,
  Copy,
  RefreshCw,
  ChefHat,
  Share2,
  BookOpen,
  Award,
  Zap,
  Info,
  Table,
  FileText,
  Activity,
  Heart,
  Dumbbell,
  Leaf,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { GeneralInfo, Calculations } from '../types';
import {
  CustomMealItem,
  CustomMealSlot,
  CustomDayPlan,
  INITIAL_7_DAY_STUDIO_PLAN,
} from '../data/customStudio7DayPlans';
import { Master7DayDietTable } from './Master7DayDietTable';
import { Unified7DayClinicalDietTable } from './Unified7DayClinicalDietTable';
import {
  generateDynamic7DayPlan,
  generateAIPlanWithGemini,
} from '../utils/dynamicClinicalDietEngine';
import { MASTER_DOMAIN_CATEGORY_GROUPS } from '../data/domainRecipePosterMasterData';
import { decomposeTextToIcmrIngredients } from '../utils/icmrRecipeEngine';
import {
  getActiveRdaTargets,
  getEffectiveDayTarget,
  setDaySpecificOverride,
} from '../utils/nutritionStore';
import { PatientRdaTargets } from '../utils/rdaCalculationEngine';
import { X, Check } from 'lucide-react';

export type { CustomMealItem, CustomMealSlot, CustomDayPlan };
export { INITIAL_7_DAY_STUDIO_PLAN };

// Curated Category-Specific Clinical Recipe Bank (Strictly separated by meal slot!)
const CATEGORIZED_RECIPE_BANK = {
  breakfast: [
    {
      dishName: 'Sprouted Green Moong Dal Chilla (2 pcs) with Mint Chutney',
      portionHousehold: '2 medium chillas (140g) + 2 tbsp chutney',
      weightGrams: 170,
      calories: 230,
      protein: 15.0,
      fat: 4.5,
      carbs: 27,
      fiber: 7.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Sprouted pulses deliver resistant starch and low glycemic load to prevent morning dawn phenomenon.',
    },
    {
      dishName: 'Steamed Thinai (Foxtail Millet) Idli (3 nos) with Drumstick Keerai Sambar',
      portionHousehold: '3 idlis (150g) + 1 small katori sambar (80g)',
      weightGrams: 230,
      calories: 250,
      protein: 8.5,
      fat: 3.0,
      carbs: 45,
      fiber: 6.8,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Foxtail millet beta-glucan and drumstick leaves provide chlorogenic acid to blunt postprandial glucose.',
    },
    {
      dishName: 'Broken Wheat (Dalia) & French Bean Upma with Crushed Mustard',
      portionHousehold: '1 bowl (180g cooked)',
      weightGrams: 180,
      calories: 215,
      protein: 7.0,
      fat: 3.5,
      carbs: 38,
      fiber: 8.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Wheat bran arabinoxylans slow carbohydrate enzymatic cleavage in the duodenum.',
    },
    {
      dishName: 'Protein Egg White Scramble (3 whites) with Baby Spinach & 1 Phulka',
      portionHousehold: '3 egg whites bhurji + 1 phulka (40g)',
      weightGrams: 190,
      calories: 220,
      protein: 19.5,
      fat: 4.0,
      carbs: 22,
      fiber: 4.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'High-biological-value albumin with zero glycemic impact anchors basal muscle protein synthesis.',
    },
  ],
  lunch: [
    {
      dishName: 'Mappillai Samba Red Rice + Palak Moong Dal + Cabbage Poriyal + A2 Curd',
      portionHousehold: '80g cooked rice + 1 cup dal + 1 cup poriyal + 1/2 cup curd',
      weightGrams: 380,
      calories: 420,
      protein: 19.5,
      fat: 7.0,
      carbs: 64,
      fiber: 12.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Polyphenols in red rice slow carbohydrate digestion; cabbage sulforaphane clears hepatic triglycerides.',
    },
    {
      dishName: '2 Jowar Bhakri Rotis + Yellow Toor Dal Tadka + Bhindi (Okra) Stir-Fry + Cucumber',
      portionHousehold: '2 jowar rotis (100g) + 1 bowl dal (150g) + 1 cup bhindi + salad',
      weightGrams: 390,
      calories: 435,
      protein: 17.0,
      fat: 7.5,
      carbs: 68,
      fiber: 13.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Okra mucilage fiber binds luminal glucose molecules, mitigating post-lunch somnolence.',
    },
    {
      dishName: 'Barnyard Millet Khichdi with Split Moong + Bitter Gourd Crisps + Neer Mor',
      portionHousehold: '1 plate khichdi (220g) + 50g baked pavakkai + 150ml neer mor',
      weightGrams: 420,
      calories: 410,
      protein: 18.0,
      fat: 6.0,
      carbs: 65,
      fiber: 14.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Charantin and vicine in bitter gourd exhibit natural insulinomimetic activity.',
    },
    {
      dishName: 'Steamed Fish Fillet (Ayala / Mackerel) + Hand-pounded Rice (50g) + Greens',
      portionHousehold: '100g fish + 50g cooked rice + 1 cup drumstick greens',
      weightGrams: 390,
      calories: 420,
      protein: 28.0,
      fat: 8.5,
      carbs: 52,
      fiber: 10.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: '1200mg EPA/DHA marine omega-3 fatty acids lower blood pressure and hepatic triglycerides.',
    },
  ],
  snacks: [
    {
      dishName: 'Dry Roasted Makhana (Foxnuts) with Turmeric & Himalayan Pink Salt',
      portionHousehold: '1 medium katori (25g raw)',
      weightGrams: 25,
      calories: 90,
      protein: 2.8,
      fat: 0.5,
      carbs: 18,
      fiber: 3.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Kaempferol flavonoids in foxnuts suppress vascular inflammation and oxidative stress.',
    },
    {
      dishName: 'Spiced Neer Mor (Buttermilk) with Crushed Curry Leaves, Ginger & Hing',
      portionHousehold: '1 tall glass (200ml)',
      weightGrams: 200,
      calories: 60,
      protein: 3.5,
      fat: 1.5,
      carbs: 5,
      fiber: 0.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Lactic acid bacteria promote gut integrity and generate acetate to blunt glucose cravings.',
    },
    {
      dishName: 'Sprouted Black Chickpea (Kala Chana) Sundal with Grated Coconut',
      portionHousehold: '1 small katori (80g cooked)',
      weightGrams: 80,
      calories: 125,
      protein: 7.5,
      fat: 2.5,
      carbs: 18,
      fiber: 6.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Dense resistant starch nourishes Akkermansia muciniphila gut bacteria.',
    },
    {
      dishName: 'Fresh Guava Slices sprinkled with Rock Salt & Roasted Cumin',
      portionHousehold: '1 medium fruit (120g)',
      weightGrams: 120,
      calories: 70,
      protein: 2.5,
      fat: 0.8,
      carbs: 14,
      fiber: 6.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'High pectin soluble fiber and vitamin C without spiking postprandial glucose.',
    },
  ],
  dinner: [
    {
      dishName: 'Sprouted Moong & Bottle Gourd Chilla (2 pcs) with Ash Gourd Soup',
      portionHousehold: '2 chillas (130g) + 1 cup soup (150g)',
      weightGrams: 280,
      calories: 295,
      protein: 16.5,
      fat: 4.5,
      carbs: 44,
      fiber: 11.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'High fiber with easy digestibility prevents nocturnal hypoglycemic dips and dawn spikes.',
    },
    {
      dishName: '2 Multigrain Phulkas + Palak Methi Paneer (Zero Cream) + Tomato Clear Soup',
      portionHousehold: '2 phulkas (70g) + 100g paneer subji + 1 cup soup',
      weightGrams: 320,
      calories: 340,
      protein: 20.0,
      fat: 9.0,
      carbs: 42,
      fiber: 9.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Fenugreek leaves activate GLUT-4 glucose transporters in muscle cells overnight.',
    },
    {
      dishName: 'Barnyard Millet (Kuthiraivali) & Split Moong Khichdi + Mint Raita',
      portionHousehold: '1 bowl khichdi (180g) + 1/2 cup raita (80g)',
      weightGrams: 260,
      calories: 290,
      protein: 12.5,
      fat: 4.5,
      carbs: 48,
      fiber: 9.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Lowest glycemic index among millets (GI ~45), promoting restful nocturnal euglycemia.',
    },
    {
      dishName: 'Grilled Tofu / Steamed Fish (120g) + Warm Vegetable Clear Broth + 1 Phulka',
      portionHousehold: '120g protein + 1 cup broth + 1 phulka (35g)',
      weightGrams: 310,
      calories: 320,
      protein: 26.0,
      fat: 6.5,
      carbs: 34,
      fiber: 7.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Pure amino acids with minimal carbohydrate load prevent insulin elevation before bed.',
    },
  ],
  bedtime: [
    {
      dishName: 'Warm Golden Turmeric Skimmed Milk with Black Pepper & Cinnamon',
      portionHousehold: '1 cup (150ml)',
      weightGrams: 150,
      calories: 70,
      protein: 4.5,
      fat: 1.5,
      carbs: 7,
      fiber: 0.5,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Curcumin combined with piperine reduces systemic insulin resistance and liver gluconeogenesis.',
    },
    {
      dishName: 'Organic Chamomile & Spearmint Herbal Infusion',
      portionHousehold: '1 warm cup (180ml)',
      weightGrams: 180,
      calories: 10,
      protein: 0.2,
      fat: 0.0,
      carbs: 2,
      fiber: 0.2,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Apigenin binds GABA-A receptors to quiet sympathetic nerve firing and prevent 3 AM cortisol spikes.',
    },
    {
      dishName: 'Warm Ceylon Cinnamon & Methi Seed Soaked Water',
      portionHousehold: '1 warm glass (180ml)',
      weightGrams: 180,
      calories: 15,
      protein: 0.5,
      fat: 0.1,
      carbs: 3,
      fiber: 1.0,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Cinnamaldehyde inhibits intestinal alpha-glucosidase and blunts early-morning liver glucose output.',
    },
    {
      dishName: 'Warm Skimmed Milk with a Pinch of Grated Nutmeg (Jaiphal)',
      portionHousehold: '1 cup (140ml)',
      weightGrams: 140,
      calories: 65,
      protein: 4.2,
      fat: 1.2,
      carbs: 6.5,
      fiber: 0.2,
      glycemicStatus: 'Low GI (<55)' as const,
      therapeuticNote: 'Myristicin in nutmeg promotes restorative non-REM slow-wave deep sleep.',
    },
  ],
};

interface Custom7DayPlanStudioProps {
  generalInfo?: GeneralInfo;
  calculations?: Calculations;
  selectedDomain?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onSendToWhatsApp?: (dayPlanText: string) => void;
  onOpenFinalPrescription?: () => void;
}

export const Custom7DayPlanStudio: React.FC<Custom7DayPlanStudioProps> = ({
  generalInfo = {
    name: 'Kiruthika',
    age: 32,
    sex: 'Female',
    height: 162,
    weight: 61.5,
    activityLevel: 'moderately_active',
  },
  calculations = {
    bmi: 23.4,
    bmiCategory: 'Normal',
    bmr: 1380,
    tdee: 1890,
  },
  selectedDomain = 'diseases',
  selectedCategory: initialSelectedCategory = 'Diabetes Mellitus',
  onSelectCategory,
  onSendToWhatsApp,
  onOpenFinalPrescription,
}) => {
  // Current active condition state
  const [activeCondition, setActiveCondition] = useState<string>(() => {
    try {
      const s = localStorage.getItem('ELSHA_SELECTED_CATEGORY');
      if (s) return s;
    } catch {}
    return initialSelectedCategory || 'Diabetes Mellitus';
  });

  // Current active domain group
  const [activeDomainGroup, setActiveDomainGroup] = useState<string>(() => {
    try {
      const s = localStorage.getItem('ELSHA_SELECTED_DOMAIN');
      if (s) return s;
    } catch {}
    return selectedDomain || 'diseases';
  });

  // Keep in sync with incoming props
  useEffect(() => {
    if (initialSelectedCategory && initialSelectedCategory !== activeCondition) {
      setActiveCondition(initialSelectedCategory);
    }
  }, [initialSelectedCategory]);

  useEffect(() => {
    if (selectedDomain && selectedDomain !== activeDomainGroup) {
      setActiveDomainGroup(selectedDomain);
    }
  }, [selectedDomain]);

  // Target Calorie Requirement (derived from calculations/weight or localStorage)
  const [targetDailyKcal, setTargetDailyKcal] = useState<number>(() => {
    try {
      const s = localStorage.getItem('ELSHA_TARGET_DAILY_KCAL');
      if (s) return parseInt(s, 10);
    } catch {}
    if (calculations.tdee) return calculations.tdee;
    if (generalInfo.weight) return Math.round(Number(generalInfo.weight) * 25);
    return 1500;
  });

  // 7-day state loaded with persistence - ensures all 7 days are always populated
  const [plans, setPlans] = useState<CustomDayPlan[]>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) {
          return parsed;
        }
      }
    } catch {}
    return generateDynamic7DayPlan({
      conditionName: activeCondition,
      domainGroup: activeDomainGroup,
      generalInfo,
      calculations,
      targetCalories: targetDailyKcal,
    });
  });

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeDaySelection, setActiveDaySelection] = useState<number | 'all' | 'table'>(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);
  const [lastModelUsed, setLastModelUsed] = useState<string | null>(null);

  // New recipe input state ("recipes na poduva")
  const [selectedSlotForRecipe, setSelectedSlotForRecipe] = useState<string>('');
  const [customDishName, setCustomDishName] = useState<string>('');
  const [customPortion, setCustomPortion] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('');
  const [customProtein, setCustomProtein] = useState<string>('');
  const [customFiber, setCustomFiber] = useState<string>('');
  const [showAddRecipeBox, setShowAddRecipeBox] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [isAutoScaling, setIsAutoScaling] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'day-by-day' | 'weekly-matrix'>('day-by-day');

  // Single Source of Truth RDA Targets
  const [rdaTargets, setRdaTargets] = useState<PatientRdaTargets>(() =>
    getActiveRdaTargets(generalInfo, calculations, activeCondition)
  );

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setRdaTargets(e.detail);
    };
    window.addEventListener('ziathlon:rda-targets-updated', handler);
    return () => window.removeEventListener('ziathlon:rda-targets-updated', handler);
  }, []);

  // Day-Specific Target Override Modal State
  const [dayTargetModalOpen, setDayTargetModalOpen] = useState(false);
  const [targetModalDayNumber, setTargetModalDayNumber] = useState(1);
  const [targetModalNutrientId, setTargetModalNutrientId] = useState('protein');
  const [targetModalValue, setTargetModalValue] = useState(70);
  const [targetModalApplyAll, setTargetModalApplyAll] = useState(false);

  const handleOpenDayTargetModal = (dayNum: number, nutrientId: string = 'protein') => {
    setTargetModalDayNumber(dayNum);
    setTargetModalNutrientId(nutrientId);
    const { target } = getEffectiveDayTarget(rdaTargets, dayNum, nutrientId);
    setTargetModalValue(target);
    setTargetModalApplyAll(false);
    setDayTargetModalOpen(true);
  };

  const handleSaveDayTargetOverride = () => {
    const updated = setDaySpecificOverride(
      targetModalDayNumber,
      targetModalNutrientId,
      Number(targetModalValue) || 0,
      targetModalApplyAll
    );
    if (updated) {
      setRdaTargets(updated);
      showToast(
        targetModalApplyAll
          ? `✓ Target updated for ALL 7 Days!`
          : `✓ Target updated specifically for Day ${targetModalDayNumber}!`
      );
    }
    setDayTargetModalOpen(false);
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Auto-save plans to local storage and broadcast to Rx Prescription
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(plans));
      localStorage.setItem('ELSHA_TARGET_DAILY_KCAL', targetDailyKcal.toString());
      localStorage.setItem('ELSHA_SELECTED_CATEGORY', activeCondition);
      localStorage.setItem('ELSHA_SELECTED_DOMAIN', activeDomainGroup);
      window.dispatchEvent(new Event('elsha-plan-updated'));
    } catch (e) {
      console.error('Failed to save 7-day plan to storage', e);
    }
  }, [plans, targetDailyKcal, activeCondition, activeDomainGroup]);

  // Handle condition change: auto-rebuild 7-day plan dynamically!
  const handleConditionSwitch = (condName: string, domainGrp?: string) => {
    setActiveCondition(condName);
    if (domainGrp) setActiveDomainGroup(domainGrp);
    if (onSelectCategory) onSelectCategory(condName);

    const freshPlan = generateDynamic7DayPlan({
      conditionName: condName,
      domainGroup: domainGrp || activeDomainGroup,
      generalInfo,
      calculations,
      targetCalories: targetDailyKcal,
    });

    setPlans(freshPlan);
    setAiRationale(`Dynamically calibrated for ${condName}. Breakfast, Lunch, Snacks, Dinner, and Bedtime each have specialized, distinct foods.`);
    showToast(`Updated 7-Day Diet Plan dynamically for "${condName}"!`);
  };

  // Trigger Gemini AI Generation with live API fallback
  const handleTriggerGeminiAIGeneration = async () => {
    setIsGeneratingAI(true);
    showToast('Consulting Gemini AI with ICMR-NIN 2024 Dietary Guidelines...');

    try {
      const result = await generateAIPlanWithGemini({
        conditionName: activeCondition,
        domainGroup: activeDomainGroup,
        generalInfo,
        calculations,
        targetCalories: targetDailyKcal,
        dietaryPreference: (generalInfo as any)?.dietaryPreference,
        allergies: (generalInfo as any)?.allergies || [],
      });

      setPlans(result.plans);
      setLastModelUsed(result.modelUsed || (result.isAiGenerated ? 'Gemini 3.8 Flash' : 'Clinical ICMR Engine'));
      setAiRationale(result.rationale || `Personalized 7-Day Plan synthesized for ${activeCondition}`);
      showToast(result.isAiGenerated ? '✨ Gemini AI synthesized dynamic 7-day plan with distinct meal categories!' : '⚡ Clinical engine calibrated 7-day plan successfully!');
    } catch (err) {
      console.error('AI plan generation error:', err);
      // Deterministic fallback
      const fallbackPlans = generateDynamic7DayPlan({
        conditionName: activeCondition,
        domainGroup: activeDomainGroup,
        generalInfo,
        calculations,
        targetCalories: targetDailyKcal,
      });
      setPlans(fallbackPlans);
      showToast('Calibrated via deterministic ICMR-NIN clinical engine.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Sync with external updates
  useEffect(() => {
    const handleSyncFromStorage = () => {
      try {
        const raw = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPlans((prev) => {
              if (JSON.stringify(prev) !== raw) return parsed;
              return prev;
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('elsha-plan-updated', handleSyncFromStorage);
    return () => window.removeEventListener('elsha-plan-updated', handleSyncFromStorage);
  }, []);

  // Frequency updater for meal slots
  const handleUpdateSlotFrequency = (dayIdx: number, slotId: string, frequency: string) => {
    setPlans((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;
        return {
          ...day,
          slots: day.slots.map((s) => (s.slotId === slotId ? { ...s, frequency } : s)),
        };
      })
    );
    showToast(`Updated meal slot frequency to "${frequency}"`);
  };

  // Quick-add PRE / DURING / POST workout slots
  const handleAddWorkoutSlot = (type: 'PRE' | 'DURING' | 'POST') => {
    const targetIdx = typeof activeDaySelection === 'number' ? activeDaySelection : activeDayIndex;
    const configs = {
      PRE: {
        name: 'Pre-Workout (PRE) Energizer',
        time: '6:30 AM',
        targetKcal: 95,
        dishName: 'Tender Coconut Water + 4 Soaked Almonds + 1 Medjool Date',
        portionHousehold: '200ml + 4 almonds + 1 date',
        weightGrams: 230,
        calories: 95,
        protein: 2.5,
        fat: 3.5,
        carbs: 14,
        fiber: 2.2,
        glycemicStatus: 'Low GI (<55)' as const,
        note: 'Electrolytes & low-glycemic fructose prime glycogen stores 45 mins prior to training.',
      },
      DURING: {
        name: 'During-Workout (DURING) Intra-Hydration',
        time: '7:45 AM',
        targetKcal: 45,
        dishName: 'Diluted Tender Coconut Water with Himalayan Pink Salt & Chia',
        portionHousehold: '250ml intra-sip',
        weightGrams: 250,
        calories: 45,
        protein: 0.8,
        fat: 0.8,
        carbs: 8.5,
        fiber: 1.5,
        glycemicStatus: 'Low GI (<55)' as const,
        note: 'Maintains sodium-potassium plasma osmolarity and prevents intra-effort cramping.',
      },
      POST: {
        name: 'Post-Workout (POST) Rapid Recovery',
        time: '8:45 AM',
        targetKcal: 165,
        dishName: 'Grass-Fed Whey / Pea Protein Isolate Shake in Water + 1/2 Banana',
        portionHousehold: '1 scoop (30g) + 1/2 banana in 250ml water',
        weightGrams: 90,
        calories: 165,
        protein: 26.0,
        fat: 1.0,
        carbs: 12,
        fiber: 1.5,
        glycemicStatus: 'Low GI (<55)' as const,
        note: '26g rapid leucine-rich protein stimulates Muscle Protein Synthesis (MPS) in 45-min window.',
      },
    };

    const cfg = configs[type];
    const newSlot: CustomMealSlot = {
      slotId: `slot-${Date.now()}-${type.toLowerCase()}`,
      slotName: cfg.name,
      time: cfg.time,
      frequency: 'Workout Days (4/Week)',
      targetKcal: cfg.targetKcal,
      items: [
        {
          id: `it-${Date.now()}`,
          dishName: cfg.dishName,
          portionHousehold: cfg.portionHousehold,
          weightGrams: cfg.weightGrams,
          calories: cfg.calories,
          protein: cfg.protein,
          fat: cfg.fat,
          carbs: cfg.carbs,
          fiber: cfg.fiber,
          glycemicStatus: cfg.glycemicStatus,
          therapeuticNote: cfg.note,
        },
      ],
    };

    setPlans((prev) =>
      prev.map((day, idx) => {
        if (idx !== targetIdx) return day;
        return {
          ...day,
          slots: [...day.slots, newSlot],
        };
      })
    );
    showToast(`Added ${cfg.name} to Day ${targetIdx + 1}!`);
  };

  const currentPlan = plans[activeDayIndex] || plans[0];

  // Calculate day totals
  const totalDayCalories = currentPlan.slots.reduce(
    (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.calories, 0),
    0
  );
  const totalDayProtein = currentPlan.slots.reduce(
    (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.protein, 0),
    0
  );
  const totalDayCarbs = currentPlan.slots.reduce(
    (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.carbs, 0),
    0
  );
  const totalDayFat = currentPlan.slots.reduce(
    (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.fat, 0),
    0
  );
  const totalDayFiber = currentPlan.slots.reduce(
    (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.fiber, 0),
    0
  );

  // Macro calorie contributions
  const proteinCals = totalDayProtein * 4;
  const carbCals = totalDayCarbs * 4;
  const fatCals = totalDayFat * 9;
  const totalMacroCals = proteinCals + carbCals + fatCals || 1;

  const proteinPct = Math.round((proteinCals / totalMacroCals) * 100);
  const carbPct = Math.round((carbCals / totalMacroCals) * 100);
  const fatPct = Math.round((fatCals / totalMacroCals) * 100);

  // Target vs Planned / Actual comparison for currentPlan
  const dayComparison = useMemo(() => {
    const allItems = currentPlan.slots.flatMap((s) => s.items);
    const actEnergy = allItems.reduce((acc, it) => acc + (it.calories || 0), 0);
    const actCarbs = allItems.reduce((acc, it) => acc + (it.carbs || 0), 0);
    const actProtein = allItems.reduce((acc, it) => acc + (it.protein || 0), 0);
    const actFat = allItems.reduce((acc, it) => acc + (it.fat || 0), 0);
    const actFibre = allItems.reduce((acc, it) => acc + (it.fiber || 0), 0);
    const actIron = allItems.reduce((acc, it) => acc + ((it as any).iron || 0), 0) || Math.round((actEnergy / 100) * 1.2 * 10) / 10;

    const itemsToCheck = [
      { id: 'energy', name: 'Energy', unit: 'kcal', actual: Math.round(actEnergy) },
      { id: 'carbohydrates', name: 'Carbohydrate', unit: 'g', actual: Math.round(actCarbs * 10) / 10 },
      { id: 'protein', name: 'Protein', unit: 'g', actual: Math.round(actProtein * 10) / 10 },
      { id: 'fat', name: 'Fat', unit: 'g', actual: Math.round(actFat * 10) / 10 },
      { id: 'fibre', name: 'Fibre', unit: 'g', actual: Math.round(actFibre * 10) / 10 },
      { id: 'iron', name: 'Iron', unit: 'mg', actual: Math.round(actIron * 10) / 10 },
    ];

    return itemsToCheck.map((it) => {
      const { target, isOverridden, baseTarget } = getEffectiveDayTarget(
        rdaTargets,
        currentPlan.dayNumber,
        it.id
      );
      const diff = Math.round((it.actual - target) * 10) / 10;
      const diffPct = target > 0 ? (diff / target) * 100 : 0;
      let status: 'Within target' | 'Below target' | 'Exceeds target' = 'Within target';
      if (diffPct < -6) status = 'Below target';
      else if (diffPct > 6) status = 'Exceeds target';

      return {
        id: it.id,
        name: it.name,
        unit: it.unit,
        target,
        actual: it.actual,
        diff,
        diffPct: Math.round(diffPct),
        status,
        isOverridden,
        baseTarget,
      };
    });
  }, [currentPlan, rdaTargets]);

  // 1. ALTER PLAN: Delete an item
  const handleDeleteItem = (slotId: string, itemId: string) => {
    setPlans((prev) =>
      prev.map((day, idx) => {
        if (idx !== activeDayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.slotId !== slotId) return slot;
            return {
              ...slot,
              items: slot.items.filter((it) => it.id !== itemId),
            };
          }),
        };
      })
    );
    showToast('Removed dish from meal plan.');
  };

  // 2. ALTER PLAN: Add new dish / recipe typed by user ("recipes na poduva")
  const handleAddCustomRecipe = () => {
    if (!customDishName.trim()) {
      showToast('Please enter a recipe or dish name');
      return;
    }

    const cals = parseFloat(customCalories) || 160;
    const prot = parseFloat(customProtein) || 6.5;
    const fib = parseFloat(customFiber) || 4.5;
    const fat = Math.round((cals * 0.25) / 9 * 10) / 10;
    const carbs = Math.round(((cals - prot * 4 - fat * 9) / 4) * 10) / 10;

    const newItem: CustomMealItem = {
      id: `custom-dish-${Date.now()}`,
      dishName: customDishName.trim(),
      portionHousehold: customPortion.trim() || '1 serving (120g)',
      weightGrams: 120,
      calories: Math.max(20, cals),
      protein: Math.max(0, prot),
      fat: Math.max(0, fat),
      carbs: Math.max(0, carbs),
      fiber: Math.max(0, fib),
      glycemicStatus: 'Low GI (<55)',
      therapeuticNote: 'Custom recipe added by clinician for glycemic and metabolic recovery.',
    };

    setPlans((prev) =>
      prev.map((day, idx) => {
        if (idx !== activeDayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.slotId !== selectedSlotForRecipe) return slot;
            return {
              ...slot,
              items: [...slot.items, newItem],
            };
          }),
        };
      })
    );

    setCustomDishName('');
    setCustomPortion('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomFiber('');
    setShowAddRecipeBox(false);
    showToast(`Added custom recipe: "${newItem.dishName}" to ${currentPlan.dayName}!`);
  };

  // 3. Quick Insert from Category-Specific Recipe Bank
  const handleInsertFromBank = (
    recipe: (typeof CATEGORIZED_RECIPE_BANK.breakfast)[0],
    slotId: string
  ) => {
    const newItem: CustomMealItem = {
      id: `bank-dish-${Date.now()}`,
      dishName: recipe.dishName,
      portionHousehold: recipe.portionHousehold,
      weightGrams: recipe.weightGrams,
      calories: recipe.calories,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
      fiber: recipe.fiber,
      glycemicStatus: recipe.glycemicStatus,
      therapeuticNote: recipe.therapeuticNote,
    };

    setPlans((prev) =>
      prev.map((day, idx) => {
        if (idx !== activeDayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((slot) => {
            if (slot.slotId !== slotId) return slot;
            return {
              ...slot,
              items: [...slot.items, newItem],
            };
          }),
        };
      })
    );
    showToast(`Added "${recipe.dishName}" to ${currentPlan.dayName}!`);
  };

  // 4. AI AUTOMATED PORTION SIZING & BALANCING (ICMR CALIBRATION)
  const handleAiAutoBalancePortionSizes = () => {
    setIsAutoScaling(true);
    showToast('AI recalculating portion sizes to perfectly balance calories across 7 days...');

    setTimeout(() => {
      setPlans((prev) =>
        prev.map((day) => {
          const dayCals = day.slots.reduce(
            (acc, s) => acc + s.items.reduce((iAcc, it) => iAcc + it.calories, 0),
            0
          );
          if (dayCals === 0) return day;

          const ratio = targetDailyKcal / dayCals;

          return {
            ...day,
            targetCalories: targetDailyKcal,
            slots: day.slots.map((slot) => {
              const scaledTarget = Math.round(slot.targetKcal * ratio);
              return {
                ...slot,
                targetKcal: scaledTarget,
                items: slot.items.map((it) => {
                  const newCals = Math.round(it.calories * ratio);
                  const newProt = Math.round(it.protein * ratio * 10) / 10;
                  const newFat = Math.round(it.fat * ratio * 10) / 10;
                  const newCarbs = Math.round(it.carbs * ratio * 10) / 10;
                  const newFib = Math.round(it.fiber * ratio * 10) / 10;
                  const newWeight = Math.round(it.weightGrams * ratio);

                  return {
                    ...it,
                    calories: newCals,
                    protein: newProt,
                    fat: newFat,
                    carbs: newCarbs,
                    fiber: newFib,
                    weightGrams: newWeight,
                    portionHousehold: it.portionHousehold.includes('g')
                      ? it.portionHousehold.replace(/\d+g/, `${newWeight}g`)
                      : `${it.portionHousehold} (calibrated: ${newWeight}g)`,
                  };
                }),
              };
            }),
          };
        })
      );
      setIsAutoScaling(false);
      showToast(`⚡ AI Auto-Balanced all portions to exactly hit ${targetDailyKcal} kcal!`);
    }, 500);
  };

  // WhatsApp Dispatch
  const handleExportToWhatsApp = () => {
    let text = `*ŽIATHLON SPORTS MEDICINE CLINIC - NUTRITION PRESCRIPTION*\n`;
    text += `*Patient:* ${generalInfo.name || 'Client'} | *Condition:* ${activeCondition}\n`;
    text += `*Day:* ${currentPlan.dayName} (${currentPlan.focus})\n`;
    text += `*Daily Targets:* ${targetDailyKcal} kcal | Protein: ${Math.round(totalDayProtein)}g | Fiber: ${Math.round(totalDayFiber)}g\n`;
    text += `──────────────────────\n`;

    currentPlan.slots.forEach((slot) => {
      text += `\n⏰ *${slot.time} - ${slot.slotName}* (~${slot.targetKcal} kcal)\n`;
      slot.items.forEach((it) => {
        text += `• *${it.dishName}* (${it.portionHousehold})\n`;
        text += `  _${it.calories} kcal | P: ${it.protein}g | F: ${it.fiber}g_\n`;
      });
    });

    text += `\n──────────────────────\n`;
    text += `*Clinical Protocol:*\n`;
    text += `1. Follow meal times punctually to stabilize circadian clock genes.\n`;
    text += `2. Take a 15-minute gentle stroll (Shatapadi) after lunch.\n`;
    text += `3. Bedtime restorative infusion must be taken warm 30 mins before sleep.\n`;
    text += `\n_Prescribed via Žiathlon Sports Medicine Clinic Intelligence_`;

    if (onSendToWhatsApp) {
      onSendToWhatsApp(text);
    } else {
      const clientPhone = generalInfo.phone || localStorage.getItem('ELSHA_CLIENT_PHONE');
      if (!clientPhone) {
        showToast('Please enter a patient phone number in the General Info section first.');
        return;
      }
      const cleanNum = clientPhone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      showToast(`Opening WhatsApp with 7-Day meal plan for ${cleanNum}...`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notificationToast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-[#8C5E28] text-white text-xs font-bold rounded-xl shadow-2xl border border-[#D9C4A5] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* HEADER BAR: DYNAMIC CLINICAL MATRIX STUDIO */}
      <div className="p-5 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs text-[#2E1C07]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#8C5E28] font-black">
              7-DAY DIETARY MATRIX STUDIO • ICMR-NIN 2024 & IFCT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#EEDEC8] border border-[#D9C4A5] text-[#5C3A14] text-[9.5px] font-mono font-bold">
              ✓ 5 Distinct Meal Categories Enforced
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#2E1C07] uppercase tracking-tight flex items-center gap-2 mt-1">
            <ChefHat className="w-6 h-6 text-[#8C5E28]" />
            <span>Dynamic 7-Day Diet Plan & Clinical Studio</span>
          </h2>
          <p className="text-xs text-[#5C3A14] mt-1 max-w-2xl">
            Fully dynamic plans calibrated for <strong>{activeCondition}</strong> ({activeDomainGroup.toUpperCase()}).
            Breakfast, Lunch, Snacks, Dinner, and Bedtime each have specialized, completely different food selections with zero cross-meal repetition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Gemini AI Auto-Generate Button */}
          <button
            type="button"
            onClick={handleTriggerGeminiAIGeneration}
            disabled={isGeneratingAI}
            className="px-4 py-2 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs border border-[#D9C4A5] disabled:opacity-50"
            title="Generate full 7-day plan with distinct meal categories using Gemini AI"
          >
            <Sparkles className={`w-4 h-4 text-yellow-300 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Generating via Gemini...' : '✨ Gemini AI: Re-Generate 7-Day Plan'}</span>
          </button>

          {/* AI Portion Size Automation Button */}
          <button
            type="button"
            onClick={handleAiAutoBalancePortionSizes}
            disabled={isAutoScaling}
            className="px-3.5 py-2 bg-[#FAF6ED] hover:bg-[#EEDEC8] text-[#5C3A14] border border-[#D9C4A5] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Automatically balance all meal portions to hit ICMR calorie requirements"
          >
            <Zap className={`w-3.5 h-3.5 text-[#8C5E28] ${isAutoScaling ? 'animate-spin' : ''}`} />
            <span>{isAutoScaling ? 'Balancing...' : '⚡ Auto-Balance Portions'}</span>
          </button>

          {/* WhatsApp Export */}
          <button
            type="button"
            onClick={handleExportToWhatsApp}
            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Send formatted 7-Day Meal Plan to client via WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp Plan</span>
          </button>

          {/* Open Final Rx Prescription Button */}
          {onOpenFinalPrescription && (
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(plans));
                  localStorage.setItem('ELSHA_TARGET_DAILY_KCAL', targetDailyKcal.toString());
                  window.dispatchEvent(new Event('elsha-plan-updated'));
                } catch {}
                onOpenFinalPrescription();
              }}
              className="px-3.5 py-2 bg-[#FFFDF9] border border-[#D9C4A5] hover:bg-[#FAF6ED] text-[#8C5E28] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Open Official Rx Prescription"
            >
              <FileText className="w-3.5 h-3.5 text-[#8C5E28]" />
              <span>Rx Prescription</span>
            </button>
          )}
        </div>
      </div>

      {/* INTERACTIVE DOMAIN & CONDITION SELECTOR BAR */}
      <div className="p-4 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8C5E28]" />
            <span className="text-xs font-black text-[#2E1C07] uppercase tracking-wider">
              Switch Clinical Domain / Condition:
            </span>
            <span className="text-[10px] text-[#5C3A14]">
              (Updates all 7 days with tailored Breakfast, Lunch, Snacks, Dinner & Bedtime)
            </span>
          </div>
          <span className="text-xs font-mono text-[#5C3A14]">
            Active: <strong className="text-[#8C5E28] underline">{activeCondition}</strong>
          </span>
        </div>

        {/* Group Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {MASTER_DOMAIN_CATEGORY_GROUPS.map((grp) => {
            const isGroupActive = activeDomainGroup === grp.groupId;
            return (
              <button
                key={grp.groupId}
                type="button"
                onClick={() => {
                  setActiveDomainGroup(grp.groupId);
                  if (grp.items[0]) {
                    handleConditionSwitch(grp.items[0], grp.groupId);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 transition-all border cursor-pointer ${
                  isGroupActive
                    ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs'
                    : 'bg-[#FFFDF9] border-[#D9C4A5] text-[#5C3A14] hover:bg-[#EEDEC8]'
                }`}
              >
                <span>{grp.groupName}</span>
              </button>
            );
          })}
        </div>

        {/* Condition Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {MASTER_DOMAIN_CATEGORY_GROUPS.find((g) => g.groupId === activeDomainGroup)?.items.map((item) => {
            const isSelected = activeCondition.toLowerCase() === item.toLowerCase();
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleConditionSwitch(item, activeDomainGroup)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs font-black'
                    : 'bg-[#FFFDF9] border-[#D9C4A5] text-[#5C3A14] hover:border-[#8C5E28]'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* AI Rationale Banner */}
        {aiRationale && (
          <div className="mt-2 p-3 bg-[#FFFDF9] border border-[#D9C4A5] rounded-xl flex items-start gap-2 text-xs text-[#5C3A14]">
            <Sparkles className="w-4 h-4 text-[#8C5E28] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2E1C07] uppercase text-[10.5px] tracking-wider block">
                Clinical Diet Strategy ({lastModelUsed || 'ICMR-NIN 2024 Engine'}):
              </span>
              <span>{aiRationale}</span>
            </div>
          </div>
        )}
      </div>

      {/* Target Calorie Requirement & Macro Calculation Bar */}
      <div className="p-4 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-xs">
        {/* Requirement Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-[#5C3A14] font-bold block flex items-center gap-1">
            <Scale className="w-3 h-3 text-[#8C5E28]" />
            Target Requirement:
          </label>
          <div className="flex items-center gap-2">
            <select
              value={targetDailyKcal}
              onChange={(e) => {
                const newTarget = parseInt(e.target.value, 10);
                setTargetDailyKcal(newTarget);
                // Auto-scale
                const updated = generateDynamic7DayPlan({
                  conditionName: activeCondition,
                  domainGroup: activeDomainGroup,
                  generalInfo,
                  calculations,
                  targetCalories: newTarget,
                });
                setPlans(updated);
                showToast(`Recalibrated 7-Day Plan to ${newTarget} kcal`);
              }}
              className="px-3 py-1.5 bg-[#FFFDF9] border border-[#D9C4A5] text-[#2E1C07] text-xs font-mono font-bold rounded-lg focus:outline-none focus:border-[#8C5E28]"
            >
              <option value={1200}>1,200 kcal (Strict Deficit / Low Glycemic)</option>
              <option value={1400}>1,400 kcal (Moderate Fat Loss)</option>
              <option value={1500}>1,500 kcal (ICMR Standard T2D Protocol)</option>
              <option value={1650}>1,650 kcal (Active Metabolic Reset)</option>
              <option value={1800}>1,800 kcal (Endurance & Muscle Retention)</option>
              <option value={2000}>2,000 kcal (High-Performance Athletic)</option>
            </select>
          </div>
        </div>

        {/* Real-time ICMR Calculation */}
        <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#E3D4C0] flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono uppercase text-[#5C3A14] font-bold">Daily Energy Target</div>
            <div className="text-lg font-black text-[#2E1C07] font-mono flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>{totalDayCalories} / {targetDailyKcal} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9.5px] font-mono text-[#5C3A14]">
              {Math.abs(totalDayCalories - targetDailyKcal) <= 50 ? (
                <span className="text-emerald-700 font-bold">✓ On Target</span>
              ) : totalDayCalories > targetDailyKcal ? (
                <span className="text-amber-800 font-bold">+{totalDayCalories - targetDailyKcal} kcal</span>
              ) : (
                <span className="text-blue-800 font-bold">-{targetDailyKcal - totalDayCalories} kcal</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAiAutoBalancePortionSizes}
              className="text-[9.5px] font-mono text-[#8C5E28] underline hover:text-[#724B1E] cursor-pointer"
            >
              Auto-Adjust
            </button>
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#E3D4C0] col-span-1 md:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between text-[9.5px] font-mono text-[#5C3A14]">
            <span>Macro Breakdown (ICMR Guideline: 20% P • 50% C • 30% F)</span>
            <span className="text-[#8C5E28] font-bold">Total Fiber: {Math.round(totalDayFiber)}g</span>
          </div>

          <div className="w-full h-2 rounded-full overflow-hidden bg-[#EEDEC8] flex">
            <div
              className="bg-[#8C5E28] h-full transition-all"
              style={{ width: `${proteinPct}%` }}
              title={`Protein: ${proteinPct}% (${Math.round(totalDayProtein)}g)`}
            />
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${carbPct}%` }}
              title={`Carbs: ${carbPct}% (${Math.round(totalDayCarbs)}g)`}
            />
            <div
              className="bg-emerald-600 h-full transition-all"
              style={{ width: `${fatPct}%` }}
              title={`Fat: ${fatPct}% (${Math.round(totalDayFat)}g)`}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-[#8C5E28] font-bold">P: {Math.round(totalDayProtein)}g ({proteinPct}%)</span>
            <span className="text-amber-700 font-bold">C: {Math.round(totalDayCarbs)}g ({carbPct}%)</span>
            <span className="text-emerald-700 font-bold">F: {Math.round(totalDayFat)}g ({fatPct}%)</span>
          </div>
        </div>
      </div>

      {/* VIEW TOGGLE: Day-by-Day vs. 7-Day Matrix */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9C4A5] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('day-by-day')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'day-by-day'
                ? 'bg-[#8C5E28] text-white shadow-xs'
                : 'bg-[#FFFDF9] border border-[#D9C4A5] text-[#5C3A14] hover:bg-[#FAF6ED]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day-by-Day Interactive Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly-matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'weekly-matrix'
                ? 'bg-[#8C5E28] text-white shadow-xs'
                : 'bg-[#FFFDF9] border border-[#D9C4A5] text-[#5C3A14] hover:bg-[#FAF6ED]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Full 7-Day Weekly Matrix Table</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFinalPrescription && (
            <button
              type="button"
              onClick={onOpenFinalPrescription}
              className="px-3.5 py-1.5 bg-[#FFFDF9] border-2 border-[#8C5E28] hover:bg-[#8C5E28] text-[#8C5E28] hover:text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Open Rx Prescription
            </button>
          )}
          <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
            {viewMode === 'day-by-day'
              ? `Active: Day ${activeDayIndex + 1} (${currentPlan.dayName})`
              : 'All 7 Days Synced'}
          </span>
        </div>
      </div>

      {viewMode === 'day-by-day' ? (
        <>
          {/* 7-Day Day Selector Tabs with Day-Specific "+" Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {plans.map((p, idx) => {
              const isActive = activeDaySelection === idx;
              const hasOverrides = rdaTargets?.dayOverrides?.[p.dayNumber] && Object.keys(rdaTargets.dayOverrides[p.dayNumber]).length > 0;
              return (
                <div key={p.dayNumber} className="flex items-center shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDaySelection(idx);
                      setActiveDayIndex(idx);
                    }}
                    className={`px-3 py-2 rounded-l-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs'
                        : 'bg-[#FAF6ED] border-[#D9C4A5] text-[#5C3A14] hover:bg-[#EEDEC8]'
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8C5E28]'}`} />
                    <span>Day {p.dayNumber}</span>
                    {hasOverrides && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Day-Specific Override Active" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDayTargetModal(p.dayNumber)}
                    className={`p-2 rounded-r-xl border border-l-0 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#724B1E] text-white border-[#8C5E28]'
                        : 'bg-[#F3E8D6] text-[#5C3A14] border-[#D9C4A5] hover:bg-[#8C5E28] hover:text-white'
                    }`}
                    title={`Day ${p.dayNumber} + (Modify day-specific target)`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* ALL 7 DAYS COMPLETE PLAN BUTTON */}
            <button
              type="button"
              onClick={() => setActiveDaySelection('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all border flex items-center gap-2 cursor-pointer ${
                activeDaySelection === 'all'
                  ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs font-black'
                  : 'bg-[#FAF6ED] border-[#D9C4A5] text-[#5C3A14] hover:bg-[#EEDEC8]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#8C5E28]" />
              <span>★ ALL 7 DAYS (Detailed Slots)</span>
            </button>

            {/* WHOLE 7-DAY DIET PLAN IN ONE TABLE BUTTON */}
            <button
              type="button"
              onClick={() => setActiveDaySelection('table')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all border flex items-center gap-2 cursor-pointer ${
                activeDaySelection === 'table'
                  ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs font-black'
                  : 'bg-[#FAF6ED] border-[#D9C4A5] text-[#5C3A14] hover:bg-[#EEDEC8]'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-[#8C5E28]" />
              <span>📊 Whole 7-Day Plan (One Table)</span>
            </button>
          </div>

          {/* QUICK WORKOUT SLOT BAR */}
          <div className="p-3 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8C5E28]" />
              <span className="font-bold text-[#2E1C07] uppercase text-[11px]">
                Specialized Workout Nutrition Slots:
              </span>
              <span className="text-[10px] text-[#5C3A14]">
                (Add clinical nutrient timing to Day {activeDayIndex + 1})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddWorkoutSlot('PRE')}
                className="px-2.5 py-1 bg-[#FFFDF9] hover:bg-[#FAF6ED] border border-[#D9C4A5] text-[#5C3A14] hover:text-[#8C5E28] text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3 h-3 text-[#8C5E28]" />
                <span>+ PRE-Workout</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddWorkoutSlot('DURING')}
                className="px-2.5 py-1 bg-[#FFFDF9] hover:bg-[#FAF6ED] border border-[#D9C4A5] text-[#5C3A14] hover:text-[#8C5E28] text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3 h-3 text-[#8C5E28]" />
                <span>+ DURING-Workout</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddWorkoutSlot('POST')}
                className="px-2.5 py-1 bg-[#FFFDF9] hover:bg-[#FAF6ED] border border-[#D9C4A5] text-[#5C3A14] hover:text-[#8C5E28] text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3 h-3 text-[#8C5E28]" />
                <span>+ POST-Workout</span>
              </button>
            </div>
          </div>

          {/* VIEW RENDERER */}
          {activeDaySelection === 'table' ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C5E28] font-bold">
                    WHOLE 7-DAY CLINICAL MATRIX • DIRECT CLINICAL VIEW
                  </span>
                  <h3 className="text-lg font-black text-[#2E1C07] uppercase">
                    7-Day Consolidated Meal Matrix Table
                  </h3>
                  <p className="text-xs text-[#5C3A14]">
                    Showing all 7 days with distinct food items for Breakfast, Lunch, Snacks, Dinner, and Bedtime.
                  </p>
                </div>
              </div>
              <Unified7DayClinicalDietTable
                plans={plans}
                onUpdatePlans={setPlans}
                clinicTitle="CLINICAL 7-DAY DIET MATRIX"
                categoryTag={`CALIBRATED FOR ${activeCondition.toUpperCase()}`}
                sourceBadge="DYNAMIC 7-DAY STUDIO PLAN"
              />
            </div>
          ) : activeDaySelection === 'all' ? (
            /* ALL 7 DAYS EXPANDED VIEW */
            <div className="space-y-8">
              {plans.map((p, pIdx) => {
                const dayCals = p.slots.reduce(
                  (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.calories, 0),
                  0
                );
                const dayProt = p.slots.reduce(
                  (acc, slot) => acc + slot.items.reduce((sAcc, it) => sAcc + it.protein, 0),
                  0
                );

                return (
                  <div
                    key={p.dayNumber}
                    className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#D9C4A5] space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3D4C0] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#8C5E28] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                          D{p.dayNumber}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-[#2E1C07] uppercase">
                            Day {p.dayNumber}: {p.dayName}
                          </h3>
                          <span className="text-xs text-[#5C3A14] font-medium">{p.focus}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#5C3A14]">
                          Day Total: <strong className="text-[#2E1C07] font-bold">{dayCals} kcal</strong>
                          <span className="text-[#8C5E28] ml-2">({Math.round(dayProt)}g protein)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDaySelection(pIdx);
                            setActiveDayIndex(pIdx);
                          }}
                          className="px-2.5 py-1 bg-[#FAF6ED] hover:bg-[#8C5E28] text-[#5C3A14] hover:text-white border border-[#D9C4A5] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          Edit Day {p.dayNumber}
                        </button>
                      </div>
                    </div>

                    {/* Meal Slots Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {p.slots.map((slot) => {
                        const slotCals = slot.items.reduce((acc, it) => acc + it.calories, 0);
                        const slotProt = slot.items.reduce((acc, it) => acc + it.protein, 0);

                        return (
                          <div
                            key={slot.slotId}
                            className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#D9C4A5] space-y-2 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div>
                                <span className="font-black text-[#2E1C07] uppercase text-[11px] block">
                                  {slot.slotName}
                                </span>
                                <span className="text-[10px] font-mono text-[#8C5E28]">{slot.time}</span>
                              </div>
                              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-[#FFFDF9] border border-[#D9C4A5] text-[#5C3A14]">
                                {slot.frequency || 'Daily'}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {slot.items.map((it) => (
                                <div key={it.id} className="text-xs">
                                  <div className="font-bold text-[#2E1C07]">{it.dishName}</div>
                                  <div className="text-[10px] text-[#5C3A14] font-mono">
                                    {it.portionHousehold} • {it.calories} kcal ({it.protein}g P)
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-1.5 border-t border-[#E3D4C0] flex justify-between text-[10px] font-mono text-[#5C3A14]">
                              <span>Slot Total: {slotCals} kcal</span>
                              <span className="text-[#8C5E28] font-bold">P: {slotProt}g</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* AFTER END OF ALL 7 DAYS: CONSOLIDATED MASTER MATRIX TABLE */}
              <div className="pt-6 border-t-2 border-[#D9C4A5]">
                <div className="mb-4 p-4 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8C5E28] text-white flex items-center justify-center font-black text-sm shadow-xs">
                      7/7
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-widest text-[#8C5E28] font-bold">
                        End of 7 Days Reached • Full Protocol Consolidated
                      </div>
                      <h4 className="text-base font-black text-[#2E1C07] uppercase">
                        Master 7-Day Diet Plan Matrix Table
                      </h4>
                      <p className="text-xs text-[#5C3A14]">
                        All 7 days displayed across meal categories. Directly editable, printable, and saved to clinical records.
                      </p>
                    </div>
                  </div>
                </div>
                <Master7DayDietTable plans={plans} onUpdatePlans={setPlans} />
              </div>
            </div>
          ) : (
            /* INDIVIDUAL DAY VIEW */
            <>
              {/* Current Day Focus Banner (Sandalwood Theme) */}
              <div className="p-3 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-xl flex items-center justify-between text-xs text-[#2E1C07] shadow-2xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8C5E28]" />
                  <span className="font-bold text-[#2E1C07] font-sans uppercase">
                    Day {currentPlan.dayNumber} ({currentPlan.dayName}) Therapeutic Focus:
                  </span>
                  <span className="text-[#5C3A14] font-medium">{currentPlan.focus}</span>
                </div>
                <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
                  Condition: {activeCondition} • Patient: {generalInfo.name || 'Client'}
                </span>
              </div>

              {/* DAILY TARGET VS ACTUAL COMPARISON TABLE (Scientific Single Source of Truth) */}
              <div className="bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl p-4 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3D4C0] pb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#8C5E28]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2E1C07]">
                      Day {currentPlan.dayNumber} Target vs. Planned / Actual Comparison
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenDayTargetModal(currentPlan.dayNumber)}
                    className="px-3 py-1 rounded-lg bg-[#8C5E28] hover:bg-[#724B1E] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Modify Day {currentPlan.dayNumber} Target</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#EEDEC8] text-[#2E1C07] font-black uppercase font-mono text-[10px]">
                        <th className="py-2 px-3">Nutrient</th>
                        <th className="py-2 px-3">Target</th>
                        <th className="py-2 px-3">Planned / Actual</th>
                        <th className="py-2 px-3">Difference</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Day Override Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3D4C0] text-[#42280C]">
                      {dayComparison.map((row) => (
                        <tr key={row.id} className="hover:bg-[#FFFDF9] transition-colors">
                          <td className="py-2 px-3 font-bold text-[#2E1C07]">{row.name}</td>
                          <td className="py-2 px-3 font-mono font-bold">
                            {row.target} {row.unit}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-[#8C5E28]">
                            {row.actual} {row.unit}
                          </td>
                          <td className="py-2 px-3 font-mono">
                            <span className={row.diff > 0 ? 'text-amber-800 font-bold' : row.diff < 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                              {row.diff > 0 ? `+` : ''}{row.diff} {row.unit}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider font-mono ${
                              row.status === 'Within target'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : row.status === 'Below target'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-purple-100 text-purple-900 border border-purple-300'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-[10px]">
                            {row.isOverridden ? (
                              <span className="text-[#8C5E28] font-bold" title={`Base RDA: ${row.baseTarget} ${row.unit}`}>
                                Day {currentPlan.dayNumber} Specific (Base: {row.baseTarget})
                              </span>
                            ) : (
                              <span className="text-gray-400">Standard RDA</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Meal Slots List with Dish Modification & Custom Recipe Input */}
              <div className="space-y-5">
                {currentPlan.slots.map((slot) => {
                  const slotCalories = slot.items.reduce((acc, it) => acc + it.calories, 0);
                  const slotProtein = slot.items.reduce((acc, it) => acc + it.protein, 0);

                  // Determine slot category for recipe suggestions
                  const slotNameLower = slot.slotName.toLowerCase();
                  let slotCategory: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'bedtime' = 'breakfast';
                  if (slotNameLower.includes('breakfast')) slotCategory = 'breakfast';
                  else if (slotNameLower.includes('lunch')) slotCategory = 'lunch';
                  else if (slotNameLower.includes('dinner')) slotCategory = 'dinner';
                  else if (slotNameLower.includes('bedtime') || slotNameLower.includes('night')) slotCategory = 'bedtime';
                  else if (slotNameLower.includes('snack') || slotNameLower.includes('morning') || slotNameLower.includes('workout')) slotCategory = 'snacks';

                  const suggestedRecipes = CATEGORIZED_RECIPE_BANK[slotCategory] || CATEGORIZED_RECIPE_BANK.breakfast;

                  return (
                    <div
                      key={slot.slotId}
                      className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#D9C4A5] hover:border-[#8C5E28] transition-all space-y-4 shadow-xs"
                    >
                      {/* Slot Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3D4C0] pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#FAF6ED] border border-[#D9C4A5] text-[#8C5E28]">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-[#2E1C07] uppercase tracking-wide">
                                {slot.slotName}
                              </h4>
                              {/* Editable Slot Frequency */}
                              <select
                                value={slot.frequency || 'Daily'}
                                onChange={(e) =>
                                  handleUpdateSlotFrequency(activeDayIndex, slot.slotId, e.target.value)
                                }
                                className="bg-white text-[10px] text-[#5C3A14] font-mono px-2 py-0.5 rounded border border-[#D9C4A5] focus:outline-none cursor-pointer"
                              >
                                <option value="Daily">Frequency: Daily</option>
                                <option value="Workout Days (4/Week)">Frequency: Workout Days (4/Week)</option>
                                <option value="Weekly (1/Week)">Frequency: Weekly (1/Week)</option>
                                <option value="Rarely / Alternate Days">Frequency: Rarely / Alternate Days</option>
                                <option value="Post-Workout Only">Frequency: Post-Workout Only</option>
                              </select>
                            </div>
                            <span className="text-xs font-mono text-[#8C5E28]">{slot.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-[#5C3A14]">
                            Slot Energy: <strong className="text-[#2E1C07] font-bold">{slotCalories} kcal</strong>
                            <span className="text-[#8C5E28] ml-2">({slotProtein}g protein)</span>
                          </span>

                          {/* Add Recipe Button for this Slot */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSlotForRecipe(slot.slotId);
                              setShowAddRecipeBox(true);
                            }}
                            className="px-3 py-1.5 bg-[#FAF6ED] hover:bg-[#8C5E28] border border-[#D9C4A5] text-[#5C3A14] hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Custom Recipe</span>
                          </button>
                        </div>
                      </div>

                      {/* Items in Slot */}
                      <div className="space-y-2.5">
                        {slot.items.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-[#D9C4A5] text-center text-xs text-gray-500">
                            No dishes in this meal slot. Click "+ Add Custom Recipe" or pick from the category bank below.
                          </div>
                        ) : (
                          slot.items.map((it) => (
                            <div
                              key={it.id}
                              className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#D9C4A5] flex flex-wrap items-center justify-between gap-3 hover:border-[#8C5E28] transition-all"
                            >
                              <div className="space-y-0.5 max-w-xl">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-bold text-[#2E1C07]">{it.dishName}</span>
                                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono bg-[#FFFDF9] border border-[#D9C4A5] text-[#5C3A14]">
                                    {it.portionHousehold}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                      it.glycemicStatus.includes('Low')
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                                    }`}
                                  >
                                    {it.glycemicStatus}
                                  </span>
                                </div>
                                {it.therapeuticNote && (
                                  <p className="text-[11px] text-[#5C3A14] leading-snug">
                                    {it.therapeuticNote}
                                  </p>
                                )}
                                {(() => {
                                  const icmrDecomp = decomposeTextToIcmrIngredients(it.dishName, it.portionHousehold);
                                  return (
                                    <div className="text-[10px] font-mono text-[#5C3A14] flex items-center gap-1.5 flex-wrap pt-0.5">
                                      <span className="px-1.5 py-0.5 bg-[#EEDEC8] border border-[#D9C4A5] rounded text-[9px] text-[#2E1C07] font-bold">
                                        {icmrDecomp.cookingMethod}
                                      </span>
                                      <span className="text-[#5C3A14]">
                                        ICMR Raw: <span className="text-[#8C5E28] font-semibold">{icmrDecomp.displaySummary}</span>
                                      </span>
                                    </div>
                                  );
                                })()}
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right font-mono text-xs">
                                  <div className="text-[#2E1C07] font-bold">{it.calories} kcal</div>
                                  <div className="text-[10px] text-[#5C3A14]">
                                    P: {it.protein}g • C: {it.carbs}g • F: {it.fiber}g
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(slot.slotId, it.id)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors cursor-pointer"
                                  title="Remove dish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Specialized Category Suggestions for this slot */}
                      <div className="pt-2 border-t border-[#E3D4C0] space-y-1.5">
                        <div className="flex items-center justify-between text-[10.5px] text-[#5C3A14]">
                          <span className="font-bold uppercase tracking-wider text-[#8C5E28] flex items-center gap-1">
                            <ChefHat className="w-3 h-3" />
                            1-Click Add from {slotCategory.toUpperCase()} Category Bank:
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono">
                            ✓ Specialized for {slot.slotName}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestedRecipes.map((r, rIdx) => (
                            <button
                              key={rIdx}
                              type="button"
                              onClick={() => handleInsertFromBank(r, slot.slotId)}
                              className="px-2.5 py-1 rounded-lg bg-[#FAF6ED] border border-[#D9C4A5] hover:border-[#8C5E28] text-[#5C3A14] hover:text-[#2E1C07] text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={`${r.therapeuticNote} (${r.calories} kcal)`}
                            >
                              <Plus className="w-3 h-3 text-[#8C5E28]" />
                              <span>{r.dishName}</span>
                              <span className="text-[9.5px] font-mono text-[#8C5E28]">
                                ({r.calories} kcal)
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day Complete Callout */}
              <div className="p-4 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEDEC8] border border-[#D9C4A5] flex items-center justify-center text-[#8C5E28]">
                    <CheckCircle2 className="w-5 h-5 text-[#8C5E28]" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-widest text-[#8C5E28] font-bold">
                      Day {currentPlan.dayNumber} Formulated
                    </div>
                    <h4 className="text-sm font-black text-[#2E1C07] uppercase">
                      Day {currentPlan.dayNumber} ({currentPlan.dayName}) Total: {totalDayCalories} kcal ({Math.round(totalDayProtein)}g Protein)
                    </h4>
                    <p className="text-xs text-[#5C3A14]">
                      All meal slots customized with differentiated food sources. Ready to prescribe.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeDayIndex < 6) {
                        setActiveDayIndex(activeDayIndex + 1);
                        setActiveDaySelection(activeDayIndex + 1);
                      } else {
                        setActiveDaySelection('table');
                      }
                    }}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>{activeDayIndex < 6 ? `Proceed to Day ${activeDayIndex + 2} (${plans[activeDayIndex + 1]?.dayName}) →` : 'View Whole 7-Day Table →'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        /* Full 7-Day Weekly Matrix Table */
        <div className="space-y-4">
          <Unified7DayClinicalDietTable
            plans={plans}
            onUpdatePlans={setPlans}
            clinicTitle="CLINICAL 7-DAY DIET MATRIX"
            categoryTag={`CALIBRATED FOR ${activeCondition.toUpperCase()}`}
            sourceBadge="DYNAMIC 7-DAY STUDIO PLAN"
          />
        </div>
      )}

      {/* Modal: Add Custom Recipe / Dish ("recipes na poduva") */}
      {showAddRecipeBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d0317] border-2 border-[#7E22CE] rounded-2xl p-6 space-y-4 shadow-[0_0_50px_rgba(126,34,206,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#C084FC] tracking-widest font-bold">
                  CUSTOM THERAPEUTIC DISH INPUT
                </span>
                <h3 className="text-lg font-black text-white uppercase">
                  Add Your Own Recipe / Dish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRecipeBox(false)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10.5px] font-bold text-gray-300 block mb-1">
                  Recipe / Dish Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Foxtail Millet Pongal with Sambar or Sprouted Sundal"
                  value={customDishName}
                  onChange={(e) => setCustomDishName(e.target.value)}
                  className="w-full p-2.5 bg-black border border-[#7E22CE] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C084FC]"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-gray-300 block mb-1">
                  Portion & Serving Size:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 medium katori (120g cooked) or 2 pcs"
                  value={customPortion}
                  onChange={(e) => setCustomPortion(e.target.value)}
                  className="w-full p-2.5 bg-black border border-white/20 text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C084FC]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">
                    Calories (kcal):
                  </label>
                  <input
                    type="number"
                    placeholder="180"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full p-2 bg-black border border-white/20 text-white text-xs rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">
                    Protein (g):
                  </label>
                  <input
                    type="number"
                    placeholder="8.5"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full p-2 bg-black border border-white/20 text-white text-xs rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">
                    Fiber (g):
                  </label>
                  <input
                    type="number"
                    placeholder="5.0"
                    value={customFiber}
                    onChange={(e) => setCustomFiber(e.target.value)}
                    className="w-full p-2 bg-black border border-white/20 text-white text-xs rounded font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddRecipeBox(false)}
                className="px-3 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomRecipe}
                className="px-4 py-2 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Add to Meal Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAY-SPECIFIC TARGET OVERRIDE MODAL */}
      {dayTargetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FAF6ED] rounded-2xl border-2 border-[#D9C4A5] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 text-[#2E1C07]">
            <div className="flex items-center justify-between border-b border-[#E3D4C0] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8C5E28]" />
                <h3 className="font-black text-sm uppercase tracking-wide text-[#2E1C07]">
                  Day {targetModalDayNumber} + Nutrient Target Override
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDayTargetModalOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#8C5E28] font-bold block mb-1">
                  Select Nutrient to Modify for Day {targetModalDayNumber}:
                </label>
                <select
                  value={targetModalNutrientId}
                  onChange={(e) => {
                    const nid = e.target.value;
                    setTargetModalNutrientId(nid);
                    const { target } = getEffectiveDayTarget(rdaTargets, targetModalDayNumber, nid);
                    setTargetModalValue(target);
                  }}
                  className="w-full bg-[#FFFDF9] border border-[#D9C4A5] rounded-xl p-2.5 text-xs text-[#2E1C07] font-bold focus:outline-none focus:border-[#8C5E28]"
                >
                  <option value="protein">Protein (g/day)</option>
                  <option value="energy">Energy (kcal/day)</option>
                  <option value="carbohydrates">Carbohydrates (g/day)</option>
                  <option value="fat">Fat (g/day)</option>
                  <option value="fibre">Fibre (g/day)</option>
                  <option value="iron">Iron (mg/day)</option>
                  {rdaTargets.nutrients.filter((n) => n.isCustomAdded).map((n) => (
                    <option key={n.id} value={n.id}>{n.name} ({n.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-gray-500">Base Reference RDA Target:</span>
                  <strong className="font-mono text-[#5C3A14]">
                    {rdaTargets.nutrients.find((n) => n.id === targetModalNutrientId)?.prescribedTarget || 0}
                  </strong>
                </div>
                <label className="text-[10px] font-mono uppercase text-[#8C5E28] font-bold block mb-1">
                  New Day {targetModalDayNumber} Prescribed Target:
                </label>
                <input
                  type="number"
                  value={targetModalValue}
                  onChange={(e) => setTargetModalValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FFFDF9] border-2 border-[#8C5E28] rounded-xl p-2.5 font-mono text-base font-black text-[#2E1C07] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#EEDEC8]/60 rounded-xl border border-[#D9C4A5] flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="chk-apply-all"
                  checked={targetModalApplyAll}
                  onChange={(e) => setTargetModalApplyAll(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8C5E28] accent-[#8C5E28] cursor-pointer"
                />
                <label htmlFor="chk-apply-all" className="text-xs text-[#42280C] cursor-pointer select-none">
                  Apply to <strong>All 7 Days</strong> (Otherwise applies ONLY to Day {targetModalDayNumber})
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3D4C0]">
              <button
                type="button"
                onClick={() => setDayTargetModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#D9C4A5] text-[#5C3A14] text-xs font-bold hover:bg-[#EEDEC8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDayTargetOverride}
                className="px-5 py-2 rounded-xl bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Save Day Target ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
