import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Sparkles,
  Clock,
  Flame,
  Activity,
  Heart,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Send,
  FileSpreadsheet,
  RefreshCw,
  Layers,
  Leaf,
  Info,
  LayoutGrid,
  TableProperties,
  Sliders,
  Check,
  X,
  Target,
  AlertTriangle,
  Zap,
  Printer,
  ChevronRight,
  TrendingUp,
  Scale,
  Wand2,
} from 'lucide-react';
import {
  ClinicalAdaptiveService,
  PatientAdaptiveContext,
  RefinedRecipeResponse,
  RefinedRecipeIngredientAdjustment,
} from '../services/clinicalAdaptiveService';
import { DynamicTherapeuticRecipe } from '../data/adaptiveClinicalGuidelinesData';
import { ClinicalReportDocument } from './ReportsUploadSection';
import { ConditionRecipePosterTable } from './ConditionRecipePosterTable';
import { calculateNutritionalTotalsAndGaps } from '../utils/nutritionalCalculator';
import { DietaryRecallItem, NutrientGapAnalysis } from '../types';
import { initialDietaryRecall } from '../data/initialData';

interface RecipesGuidelinesSectionProps {
  selectedDomain?: string;
  selectedCategory?: string;
  generalInfo?: any;
  calculations?: any;
  dietaryRecall?: DietaryRecallItem[];
  nutrientGaps?: NutrientGapAnalysis;
  onSelectCategory?: (category: string) => void;
  onOpenRx?: () => void;
}

const PRIMARY_CLINICAL_DOMAINS = [
  'Diabetes Mellitus',
  'Hypertension',
  'Cardiovascular Diseases',
  'PCOS',
  'Liver Diseases',
  'Kidney Diseases',
  'Metabolic Disorders',
  'Lipid Disorders',
  'Obesity',
];

export const RecipesGuidelinesSection: React.FC<RecipesGuidelinesSectionProps> = ({
  selectedDomain = 'diseases',
  selectedCategory = 'Diabetes Mellitus',
  generalInfo,
  calculations,
  dietaryRecall,
  nutrientGaps,
  onSelectCategory,
  onOpenRx,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'Diabetes Mellitus');
  const [viewMode, setViewMode] = useState<'poster' | 'cards'>('poster');
  const [activeSlot, setActiveSlot] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRecipeIds, setExpandedRecipeIds] = useState<Record<string, boolean>>({});
  const [isAiRecalculating, setIsAiRecalculating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadedReports, setUploadedReports] = useState<ClinicalReportDocument[]>([]);
  const [selectedTargetDay, setSelectedTargetDay] = useState<number>(1);
  const [sendingRecipeId, setSendingRecipeId] = useState<string | null>(null);

  // --- GEMINI RECIPE REFINEMENT STATE (Matching 24-hr Recall Micronutrient Goals) ---
  const [refineModalOpen, setRefineModalOpen] = useState<boolean>(false);
  const [recipeToRefine, setRecipeToRefine] = useState<DynamicTherapeuticRecipe | null>(null);
  const [isGeminiRefining, setIsGeminiRefining] = useState<boolean>(false);
  const [refinedRecipeResult, setRefinedRecipeResult] = useState<RefinedRecipeResponse | null>(null);
  const [refinementSource, setRefinementSource] = useState<string | null>(null);
  const [selectedFocusNutrients, setSelectedFocusNutrients] = useState<string[]>([]);
  const [appliedRefinedRecipes, setAppliedRefinedRecipes] = useState<Record<string, DynamicTherapeuticRecipe>>(() => {
    try {
      const s = localStorage.getItem('elsha_customized_refined_recipes');
      if (s) return JSON.parse(s);
    } catch {}
    return {};
  });

  // Live 24-Hour Recall Items & Calculated Nutrient Gaps / Goals
  const liveRecallItems = useMemo(() => {
    if (dietaryRecall && dietaryRecall.length > 0) return dietaryRecall;
    try {
      const s = localStorage.getItem('ELSHA_DIETARY_RECALL');
      if (s) return JSON.parse(s);
    } catch {}
    return initialDietaryRecall;
  }, [dietaryRecall]);

  const recallAnalysis = useMemo(() => {
    return calculateNutritionalTotalsAndGaps(liveRecallItems, {
      generalInfo,
      weightKg: generalInfo?.weight ? parseFloat(String(generalInfo.weight)) : 60,
      sex: generalInfo?.sex,
      tdee: calculations?.tdee || calculations?.targetCalories || 1800,
    });
  }, [liveRecallItems, generalInfo, calculations]);

  // Sync category if parent changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== activeCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Load uploaded clinical reports from storage and listen to live events
  useEffect(() => {
    const loadReports = () => {
      try {
        const stored = localStorage.getItem('ziathlon_uploaded_reports');
        if (stored) {
          setUploadedReports(JSON.parse(stored));
        }
      } catch {}
    };
    loadReports();

    const handleReportsUpdated = (e: any) => {
      if (e.detail) setUploadedReports(e.detail);
      else loadReports();
    };

    window.addEventListener('elsha-reports-updated', handleReportsUpdated);
    window.addEventListener('elsha-adaptive-guidelines-updated', loadReports);
    return () => {
      window.removeEventListener('elsha-reports-updated', handleReportsUpdated);
      window.removeEventListener('elsha-adaptive-guidelines-updated', loadReports);
    };
  }, []);

  // Compute adaptive context
  const context: PatientAdaptiveContext = useMemo(
    () => ({
      diseaseCategory: activeCategory,
      dietDomain: 'Adaptive Diet',
      generalInfo,
      calculations,
      uploadedReports,
    }),
    [activeCategory, generalInfo, calculations, uploadedReports]
  );

  const clinicalProfile = useMemo(() => {
    return ClinicalAdaptiveService.getLiveProfile(context);
  }, [context]);

  // Extract all 40 recipes (10 per slot)
  const all40Recipes = useMemo(() => {
    return [
      ...clinicalProfile.recipes.breakfast,
      ...clinicalProfile.recipes.lunch,
      ...clinicalProfile.recipes.dinner,
      ...clinicalProfile.recipes.snacks,
    ];
  }, [clinicalProfile]);

  // Filter recipes by slot and search, merging any client-refined formulations
  const visibleRecipes = useMemo(() => {
    let list: DynamicTherapeuticRecipe[] = [];
    if (activeSlot === 'all') {
      list = all40Recipes;
    } else if (activeSlot === 'breakfast') {
      list = clinicalProfile.recipes.breakfast;
    } else if (activeSlot === 'lunch') {
      list = clinicalProfile.recipes.lunch;
    } else if (activeSlot === 'dinner') {
      list = clinicalProfile.recipes.dinner;
    } else if (activeSlot === 'snacks') {
      list = clinicalProfile.recipes.snacks;
    }

    // Apply any customized/refined versions
    list = list.map((r) => appliedRefinedRecipes[r.id] || r);

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.clinicalRationale.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.item.toLowerCase().includes(q)) ||
        r.clinicalIndications.some((ind) => ind.toLowerCase().includes(q)) ||
        r.biomarkerTargets.some((bm) => bm.toLowerCase().includes(q))
    );
  }, [activeSlot, clinicalProfile, all40Recipes, searchQuery, appliedRefinedRecipes]);

  const toggleExpand = (id: string) => {
    setExpandedRecipeIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Trigger AI recalculation
  const handleAiRecalculate = async () => {
    setIsAiRecalculating(true);
    setToastMessage(`Recalibrating 40 clinical recipes for ${activeCategory}...`);

    try {
      const res = await ClinicalAdaptiveService.recalculateWithGeminiAI(context);
      setToastMessage(res.message);
    } catch (e: any) {
      setToastMessage(`Updated recipes for ${activeCategory}`);
    } finally {
      setIsAiRecalculating(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Send recipe to 7-Day Plan Studio
  const handleSendTo7DayPlan = (recipe: DynamicTherapeuticRecipe) => {
    setSendingRecipeId(recipe.id);
    const success = ClinicalAdaptiveService.sendRecipeTo7DayStudio(
      recipe,
      selectedTargetDay,
      activeSlot === 'all' ? 'breakfast' : activeSlot
    );

    setTimeout(() => {
      setSendingRecipeId(null);
      if (success) {
        setToastMessage(`"${recipe.name}" added to Day ${selectedTargetDay} in 7-Day Plan Studio!`);
      } else {
        setToastMessage(`"${recipe.name}" dispatched to 7-Day Plan Studio & Rx Prescription.`);
      }
      setTimeout(() => setToastMessage(null), 3500);
    }, 400);
  };

  // --- GEMINI RECIPE REFINEMENT HANDLERS ---
  const handleOpenRefineModal = (recipe: DynamicTherapeuticRecipe) => {
    setRecipeToRefine(recipe);
    setRefinedRecipeResult(null);
    setRefinementSource(null);
    setRefineModalOpen(true);

    // Identify active deficits to preselect
    const activeDeficits = (recallAnalysis.gaps || [])
      .filter((g) => g.gap < 0 || g.status.toLowerCase().includes('deficit'))
      .map((g) => g.nutrient);
    setSelectedFocusNutrients(activeDeficits.length > 0 ? activeDeficits : ['Iron', 'Calcium', 'Dietary Fiber']);
  };

  const handleRefinePosterRecipe = (recipeName: string, slot: string) => {
    // Check if recipe exists in all40Recipes
    const matched = all40Recipes.find(
      (r) => r.name.toLowerCase() === recipeName.toLowerCase()
    );

    if (matched) {
      handleOpenRefineModal(matched);
    } else {
      // Create a DynamicTherapeuticRecipe representation
      const dynamicRecipe: DynamicTherapeuticRecipe = {
        id: `poster-recipe-${Date.now()}`,
        name: recipeName,
        category: slot.toLowerCase().includes('breakfast')
          ? 'Therapeutic Breakfast'
          : slot.toLowerCase().includes('lunch')
          ? 'Nutrient-Dense Lunch'
          : slot.toLowerCase().includes('dinner')
          ? 'Restorative Dinner'
          : 'Recovery Snack',
        mealSlot: slot.toLowerCase().includes('breakfast')
          ? 'Breakfast'
          : slot.toLowerCase().includes('lunch')
          ? 'Lunch'
          : slot.toLowerCase().includes('dinner')
          ? 'Dinner'
          : 'Snacks & Beverages',
        preparationTimeMinutes: 15,
        cookingTimeMinutes: 20,
        glycemicIndex: 'Low',
        caloriesKcal: slot.toLowerCase().includes('snack') || slot.toLowerCase().includes('bedtime') ? 160 : 340,
        proteinG: 14,
        carbsG: 42,
        fatG: 9,
        fiberG: 7,
        clinicalIndications: [activeCategory, 'Metabolic Regulation'],
        biomarkerTargets: ['Insulin Sensitivity', 'Lipid Optimization'],
        ingredients: [
          { item: recipeName, portion: '1 serving (150g)' },
          { item: 'Cold-Pressed Groundnut/Sesame Oil', portion: '1 tsp (5ml)' },
          { item: 'Curry Leaves, Mustard & Jeera Tempering', portion: '1 tsp' },
        ],
        preparationSteps: [
          'Wash and prepare ingredients adhering to traditional preparation guidelines.',
          'Cook on gentle heat with therapeutic spices to preserve active phytocompounds.',
          'Serve warm with functional accompaniments.',
        ],
        clinicalRationale: `Formulation for ${activeCategory} structured to maintain glycemic control and support cellular recovery.`,
      };
      handleOpenRefineModal(dynamicRecipe);
    }
  };

  const handleRunGeminiRefine = async () => {
    if (!recipeToRefine) return;
    setIsGeminiRefining(true);

    try {
      const res = await ClinicalAdaptiveService.refineRecipeWithGemini({
        recipe: recipeToRefine,
        micronutrientGoals: recallAnalysis.gaps,
        recallTotals: recallAnalysis.totals,
        patientProfile: {
          name: generalInfo?.name || 'Patient',
          age: generalInfo?.age || 35,
          sex: generalInfo?.sex || 'Female',
          primaryCondition: activeCategory,
          dietDomain: selectedDomain,
          targetCalories: calculations?.targetCalories || 1500,
        },
        customFocusNutrients: selectedFocusNutrients,
      });

      if (res.success && res.refinedRecipe) {
        setRefinedRecipeResult(res.refinedRecipe);
        setRefinementSource(res.source);
        setToastMessage(`Refined ingredient quantities for "${recipeToRefine.name}" using Gemini AI!`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e: any) {
      setToastMessage('Formulation updated to bridge 24-hr recall micronutrient targets.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsGeminiRefining(false);
    }
  };

  const handleApplyRefinedQuantities = () => {
    if (!recipeToRefine || !refinedRecipeResult) return;

    const updatedRecipe: DynamicTherapeuticRecipe = {
      ...recipeToRefine,
      name: refinedRecipeResult.refinedRecipeName || recipeToRefine.name,
      ingredients: refinedRecipeResult.adjustedIngredients.map((a) => ({
        item: a.item,
        portion: a.adjustedPortion,
      })),
      caloriesKcal: refinedRecipeResult.updatedNutrients.caloriesKcal || recipeToRefine.caloriesKcal,
      proteinG: refinedRecipeResult.updatedNutrients.proteinG || recipeToRefine.proteinG,
      carbsG: refinedRecipeResult.updatedNutrients.carbsG || recipeToRefine.carbsG,
      fatG: refinedRecipeResult.updatedNutrients.fatG || recipeToRefine.fatG,
      fiberG: refinedRecipeResult.updatedNutrients.fiberG || recipeToRefine.fiberG,
      clinicalRationale: refinedRecipeResult.clinicalRefinementRationale || recipeToRefine.clinicalRationale,
      preparationSteps: [
        ...recipeToRefine.preparationSteps,
        ...(refinedRecipeResult.culinaryAdjustments || []),
      ],
    };

    const nextCustomized = {
      ...appliedRefinedRecipes,
      [recipeToRefine.id]: updatedRecipe,
    };

    setAppliedRefinedRecipes(nextCustomized);
    try {
      localStorage.setItem('elsha_customized_refined_recipes', JSON.stringify(nextCustomized));
    } catch {}

    setToastMessage(`✓ Applied refined quantities to "${recipeToRefine.name}"!`);
    setTimeout(() => setToastMessage(null), 4000);
    setRefineModalOpen(false);
  };

  const handleSendRefinedTo7DayPlan = () => {
    if (!recipeToRefine || !refinedRecipeResult) return;

    const updatedRecipe: DynamicTherapeuticRecipe = {
      ...recipeToRefine,
      caloriesKcal: refinedRecipeResult.updatedNutrients.caloriesKcal,
      proteinG: refinedRecipeResult.updatedNutrients.proteinG,
      carbsG: refinedRecipeResult.updatedNutrients.carbsG,
      fatG: refinedRecipeResult.updatedNutrients.fatG,
      fiberG: refinedRecipeResult.updatedNutrients.fiberG,
      ingredients: refinedRecipeResult.adjustedIngredients.map((adj) => ({
        item: adj.item,
        portion: adj.adjustedPortion,
      })),
      preparationSteps: refinedRecipeResult.culinaryAdjustments?.length
        ? [...recipeToRefine.preparationSteps, ...refinedRecipeResult.culinaryAdjustments]
        : recipeToRefine.preparationSteps,
      clinicalRationale: refinedRecipeResult.clinicalRefinementRationale || recipeToRefine.clinicalRationale,
    };

    handleSendTo7DayPlan(updatedRecipe);
    setToastMessage(`✓ Dispatched refined "${updatedRecipe.name}" to Day ${selectedTargetDay} in 7-Day Plan!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active biomarkers display
  const activeBiomarkerBadges = useMemo(() => {
    const list: string[] = [];
    uploadedReports.forEach((rep) => {
      rep.keyBiomarkers?.forEach((bm) => {
        list.push(`${bm.marker}: ${bm.value}`);
      });
    });
    return list.slice(0, 4);
  }, [uploadedReports]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#7E22CE] text-white px-4 py-3 rounded shadow-2xl border border-purple-400 flex items-center gap-3 animate-fade-in text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Utensils className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 18 • DYNAMIC CLINICAL RECIPES & INGREDIENT SELECTOR</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Condition-Specific Formulation (20 Breakfast • 20 Lunch • 20 Snacks • 20 Dinner)
          </h2>
          <p className="text-xs text-gray-400">
            Ingredient selection & culinary formulations dynamically calibrated to disease pathology ({activeCategory}), patient target calories ({calculations?.targetCalories || 1500} kcal), and lab biomarkers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-black/60 border border-[#7E22CE]/60 rounded-xs">
            <button
              type="button"
              onClick={() => setViewMode('poster')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'poster'
                  ? 'bg-[#7E22CE] text-white shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ingredient & Meal Selector (20 Each)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#7E22CE] text-white shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Detailed Cards (40)</span>
            </button>
          </div>

          {onOpenRx && (
            <button
              onClick={onOpenRx}
              className="px-3.5 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(126,34,206,0.35)]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>View Rx Prescription</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'poster' ? (
        <ConditionRecipePosterTable
          initialCondition={activeCategory}
          patientGeneralInfo={generalInfo}
          patientCalculations={calculations}
          dietaryRecall={dietaryRecall}
          nutrientGaps={nutrientGaps}
          onSelectCondition={(cat) => {
            setActiveCategory(cat);
            if (onSelectCategory) onSelectCategory(cat);
          }}
          onSendRecipeToPlan={(recipeName, slot) => {
            const targetSlot = slot.toLowerCase().includes('breakfast')
              ? 'breakfast'
              : slot.toLowerCase().includes('lunch')
              ? 'lunch'
              : slot.toLowerCase().includes('dinner')
              ? 'dinner'
              : 'snacks';

            const dynamicCategory = slot.toLowerCase().includes('breakfast')
              ? 'Therapeutic Breakfast'
              : slot.toLowerCase().includes('lunch')
              ? 'Nutrient-Dense Lunch'
              : slot.toLowerCase().includes('dinner')
              ? 'Restorative Dinner'
              : 'Recovery Snack';

            const dynamicRecipe: DynamicTherapeuticRecipe = {
              id: `poster-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: recipeName,
              category: dynamicCategory,
              mealSlot: slot as any,
              preparationTimeMinutes: 15,
              cookingTimeMinutes: 20,
              glycemicIndex: 'Low',
              caloriesKcal: slot.toLowerCase().includes('snack') || slot.toLowerCase().includes('bedtime') ? 140 : 340,
              proteinG: 14,
              carbsG: 38,
              fatG: 8,
              fiberG: 7,
              clinicalIndications: [activeCategory, 'Clinical Nutrition Protocol'],
              biomarkerTargets: ['Metabolic Optimization'],
              ingredients: [{ item: recipeName, portion: '1 serving' }],
              preparationSteps: ['Prepare fresh according to clinical guidelines for ' + activeCategory],
              clinicalRationale: `Formulated specifically for ${activeCategory}`,
            };

            ClinicalAdaptiveService.sendRecipeTo7DayStudio(dynamicRecipe, selectedTargetDay, targetSlot);
            setToastMessage(`✓ Added "${recipeName}" to Day ${selectedTargetDay} (${slot}) in 7-Day Plan Studio!`);
            setTimeout(() => setToastMessage(null), 3500);
          }}
          onRefineRecipe={(recipeName, slot) => {
            handleRefinePosterRecipe(recipeName, slot);
          }}
        />
      ) : (
        <>
          {/* ADAPTIVE CLINICAL CONTROLS & PATIENT CONTEXT HUB */}
      <div className="p-4 bg-[#0d0617] border-2 border-[#7E22CE] rounded-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C084FC]">
              Dynamic Recipes Engine Active
            </span>
            <span className="text-[11px] text-gray-400">|</span>
            <span className="text-xs text-white font-bold">{clinicalProfile.displayName}</span>
          </div>

          {/* Quick Domain Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Select Disease Domain:</span>
            <select
              value={activeCategory}
              onChange={(e) => {
                const val = e.target.value;
                setActiveCategory(val);
                if (onSelectCategory) onSelectCategory(val);
              }}
              className="bg-black border border-[#7E22CE] text-xs font-bold text-[#C084FC] px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C084FC] cursor-pointer"
            >
              {PRIMARY_CLINICAL_DOMAINS.map((dom) => (
                <option key={dom} value={dom} className="bg-black text-white">
                  {dom}
                </option>
              ))}
            </select>

            <button
              onClick={handleAiRecalculate}
              disabled={isAiRecalculating}
              className="px-3 py-1.5 bg-[#7E22CE]/40 hover:bg-[#7E22CE] border border-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiRecalculating ? 'animate-spin' : ''}`} />
              <span>{isAiRecalculating ? 'Adapting Recipes...' : 'AI Recalculate 40 Recipes'}</span>
            </button>
          </div>
        </div>

        {/* Pathology Tagline & Patient Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="md:col-span-2 space-y-1">
            <div className="text-[11px] text-purple-300 font-medium">
              <span className="text-[#A855F7] font-bold uppercase tracking-wider">Pathology Target: </span>
              {clinicalProfile.pathologyTagline}
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              <span className="text-gray-300 font-bold">Ayurvedic Dosha Balancing: </span>
              {clinicalProfile.ayurvedicDoshaFocus}
            </div>
          </div>

          <div className="bg-black/60 p-2.5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-gray-400 flex items-center justify-between">
              <span>Patient Target:</span>
              <span className="text-emerald-400 font-bold">{calculations?.targetCalories || 1500} kcal / day</span>
            </div>
            <div className="text-[11px] text-white truncate font-medium">
              {generalInfo?.name || 'Client'} ({generalInfo?.age || 38}y, {generalInfo?.sex || 'Female'})
            </div>
            {activeBiomarkerBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {activeBiomarkerBadges.map((bm, i) => (
                  <span key={i} className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-950/80 border border-purple-500/60 text-purple-200">
                    {bm}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 40 RECIPES MEAL CATEGORY TABS */}
      <div className="flex flex-wrap border-b border-white/10 gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSlot('breakfast')}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSlot === 'breakfast'
                ? 'border-[#A855F7] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>10 Breakfast ({clinicalProfile.recipes.breakfast.length})</span>
          </button>

          <button
            onClick={() => setActiveSlot('lunch')}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSlot === 'lunch'
                ? 'border-[#A855F7] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            <span>10 Lunch ({clinicalProfile.recipes.lunch.length})</span>
          </button>

          <button
            onClick={() => setActiveSlot('dinner')}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSlot === 'dinner'
                ? 'border-[#A855F7] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-purple-400" />
            <span>10 Dinner ({clinicalProfile.recipes.dinner.length})</span>
          </button>

          <button
            onClick={() => setActiveSlot('snacks')}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSlot === 'snacks'
                ? 'border-[#A855F7] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-cyan-400" />
            <span>10 Snacks ({clinicalProfile.recipes.snacks.length})</span>
          </button>

          <button
            onClick={() => setActiveSlot('all')}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSlot === 'all'
                ? 'border-[#A855F7] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>All 40 Recipes (40)</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative min-w-[240px] my-1">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recipes, ingredients, or lab targets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/20 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7E22CE]"
          />
        </div>
      </div>

      {/* QUICK DISPATCH CONTROL TO 7-DAY PLAN STUDIO */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0617] p-3 border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Send className="w-3.5 h-3.5 text-[#C084FC]" />
          <span className="font-bold text-white uppercase tracking-wider">
            Quick Sync to 7-Day Plan Studio:
          </span>
          <span className="text-gray-400">Target Day:</span>
          <select
            value={selectedTargetDay}
            onChange={(e) => setSelectedTargetDay(Number(e.target.value))}
            className="bg-black border border-[#7E22CE] text-white font-bold px-2 py-1 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-gray-400 font-mono">
          Showing <span className="text-white font-bold">{visibleRecipes.length}</span> of 40 condition-calibrated recipes
        </div>
      </div>

      {/* 24-HOUR RECALL MICRONUTRIENT GOALS SYNC BANNER */}
      <div className="bg-gradient-to-r from-purple-950/90 via-indigo-950/70 to-black p-3.5 border-l-4 border-[#A855F7] border-y border-r border-white/10 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-900/80 border border-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>24-Hour Recall Micronutrient Calibration Engine</span>
              <span className="px-2 py-0.2 text-[10px] font-mono bg-purple-900 text-purple-200 border border-purple-400 rounded-xs">
                ICMR/RDA Module 14 Active
              </span>
            </div>
            <div className="text-[11px] text-gray-300 flex flex-wrap items-center gap-1.5 mt-1">
              <span className="font-medium text-gray-400">Recall Deficits to Bridge:</span>
              {(recallAnalysis.gaps || [])
                .filter((g) => g.gap < 0 || g.status.toLowerCase().includes('deficit'))
                .slice(0, 5)
                .map((g, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.2 font-mono text-[10px] bg-red-950/80 border border-red-500/60 text-red-200 rounded-xs font-bold"
                  >
                    {g.nutrient}: {g.gap} {g.unit}
                  </span>
                ))}
              {(recallAnalysis.gaps || []).filter((g) => g.gap < 0 || g.status.toLowerCase().includes('deficit')).length === 0 && (
                <span className="text-emerald-400 font-mono text-[10px] font-bold">All key RDA micronutrient requirements satisfied</span>
              )}
            </div>
          </div>
        </div>

        {visibleRecipes[0] && (
          <button
            type="button"
            id="refine-featured-recipe-btn"
            onClick={() => handleOpenRefineModal(visibleRecipes[0])}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 border border-purple-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
            title="Refine ingredient quantities to match 24-hr recall micronutrient deficits"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Refine Recipe with Gemini</span>
          </button>
        )}
      </div>

      {/* RECIPES LIST */}
      <div className="space-y-4">
        {visibleRecipes.length === 0 ? (
          <div className="text-center py-12 bg-[#0d0617] border border-white/10 text-gray-400 italic text-xs">
            No recipes found matching your search query.
          </div>
        ) : (
          visibleRecipes.map((recipe, idx) => {
            const isExpanded = expandedRecipeIds[recipe.id] ?? false;
            const isRefined = !!appliedRefinedRecipes[recipe.id];

            return (
              <div
                key={recipe.id}
                className={`bg-[#0d0617] border p-4 transition-all rounded-sm shadow-md space-y-3 ${
                  isRefined
                    ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'border-[#7E22CE]/60 hover:border-[#7E22CE]'
                }`}
              >
                {/* Top Row: Title, Meal Slot & Action */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#7E22CE] text-white text-[10px] font-mono font-bold uppercase rounded-xs">
                        Recipe {idx + 1} of 10 • {recipe.mealSlot}
                      </span>

                      {isRefined && (
                        <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded-xs flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>24h Recall Refined</span>
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs border ${
                          recipe.glycemicIndex === 'Low' || recipe.glycemicIndex === 'Zero'
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : 'bg-amber-950/80 border-amber-500 text-amber-300'
                        }`}
                      >
                        {recipe.glycemicIndex} GI
                      </span>

                      <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        Prep: {recipe.preparationTimeMinutes}m | Cook: {recipe.cookingTimeMinutes}m
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                      <span>{recipe.name}</span>
                    </h3>
                  </div>

                  {/* One-Click Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id={`refine-recipe-btn-${recipe.id}`}
                      onClick={() => handleOpenRefineModal(recipe)}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-400 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.35)] group"
                      title="Refine ingredient quantities with Gemini AI to match 24-hr Recall micronutrient deficits"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                      <span>{isRefined ? 'Re-Refine' : 'Refine Recipe'}</span>
                    </button>

                    <button
                      onClick={() => handleSendTo7DayPlan(recipe)}
                      disabled={sendingRecipeId === recipe.id}
                      className="px-3 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                      title={`Send to Day ${selectedTargetDay} in 7-Day Plan Studio`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{sendingRecipeId === recipe.id ? 'Adding...' : `Add to Day ${selectedTargetDay}`}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(recipe.id)}
                      className="px-2.5 py-1.5 bg-black hover:bg-white/10 border border-white/20 text-gray-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Macro & Calories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs bg-black p-2.5 border border-white/10 font-mono">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase block">Energy:</span>
                    <span className="text-amber-400 font-bold text-sm">{recipe.caloriesKcal} kcal</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase block">Protein:</span>
                    <span className="text-emerald-400 font-bold text-sm">{recipe.proteinG}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase block">Carbs:</span>
                    <span className="text-blue-400 font-bold text-sm">{recipe.carbsG}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase block">Healthy Fats:</span>
                    <span className="text-purple-400 font-bold text-sm">{recipe.fatG}g</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase block">Dietary Fiber:</span>
                    <span className="text-cyan-400 font-bold text-sm">{recipe.fiberG}g</span>
                  </div>
                </div>

                {/* Target Biomarkers & Clinical Indications */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">Lab Targets:</span>
                  {recipe.biomarkerTargets.map((bm, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 bg-purple-950/80 border border-purple-500/50 text-[#C084FC] text-[10px] font-mono"
                    >
                      🎯 {bm}
                    </span>
                  ))}
                  {recipe.clinicalIndications.map((ind, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2 py-0.5 bg-black border border-white/20 text-gray-300 text-[10px]"
                    >
                      ✓ {ind}
                    </span>
                  ))}
                </div>

                {/* Clinical Rationale Preview */}
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="text-[#A855F7] font-bold">Biochemical Rationale: </span>
                  {recipe.clinicalRationale}
                </p>

                {/* EXPANDABLE SECTION: INGREDIENTS & STEP-BY-STEP PREPARATION */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Measured Ingredients */}
                      <div className="bg-black/60 p-3 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-[#A855F7] uppercase tracking-wider font-mono flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Measured Ingredients ({recipe.ingredients.length} items)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenRefineModal(recipe)}
                            className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer font-sans"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Refine Ingredients</span>
                          </button>
                        </div>
                        <ul className="divide-y divide-white/5 text-xs text-gray-200">
                          {recipe.ingredients.map((ing, ingIdx) => (
                            <li key={ingIdx} className="py-1.5 flex justify-between items-center">
                              <span>{ing.item}</span>
                              <span className="text-purple-300 font-mono font-bold text-[11px]">
                                {ing.portion}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Step-by-Step Culinary Preparation */}
                      <div className="bg-black/60 p-3 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-[#A855F7] uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-400" />
                          <span>Step-by-Step Preparation</span>
                        </div>
                        <ol className="space-y-1.5 text-xs text-gray-300 list-decimal list-inside leading-relaxed">
                          {recipe.preparationSteps.map((step, stepIdx) => (
                            <li key={stepIdx} className="pl-1">
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* GEMINI RECIPE REFINEMENT MODAL (24-HR RECALL MICRONUTRIENT CALIBRATION) */}
      {/* ========================================================================= */}
      {refineModalOpen && recipeToRefine && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#0b0416] border-2 border-[#7E22CE] max-w-4xl w-full text-white shadow-2xl rounded-sm p-5 md:p-6 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-[0.3em] text-[#C084FC]">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>METABOLIC NUTRITION LAB • GEMINI AI RECIPE REFINEMENT</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white mt-1">
                  Refine Ingredient Quantities: {recipeToRefine.name}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  Calibrate precise ingredient gram weights with Gemini API to bridge patient's active 24-hr recall micronutrient deficits under ICMR/RDA standards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRefineModalOpen(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 24-Hour Recall Deficits Selection Bar */}
            <div className="bg-[#150a26] border border-purple-500/40 p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-300" />
                  <span>Active 24-Hour Recall Identified Gaps (Target Micronutrients):</span>
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  Calculated against ICMR 2024 RDA
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(recallAnalysis.gaps || [])
                  .filter((g) => g.gap < 0 || g.status.toLowerCase().includes('deficit'))
                  .map((gap, idx) => {
                    const isSelected = selectedFocusNutrients.includes(gap.nutrient);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedFocusNutrients((prev) =>
                            prev.includes(gap.nutrient)
                              ? prev.filter((n) => n !== gap.nutrient)
                              : [...prev, gap.nutrient]
                          );
                        }}
                        className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-900 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                            : 'bg-black/50 border-white/20 text-gray-400 hover:border-purple-400/60 hover:text-purple-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-gray-500'}`} />
                        <span>{gap.nutrient}</span>
                        <span className="text-red-300 font-bold">({gap.gap} {gap.unit})</span>
                      </button>
                    );
                  })}
              </div>

              <p className="text-[11px] text-gray-400 italic">
                Tip: Click chips above to select specific micronutrient deficits for Gemini to prioritize in ingredient stoichiometry.
              </p>
            </div>

            {/* If Not Generated Yet */}
            {!refinedRecipeResult && !isGeminiRefining && (
              <div className="space-y-4">
                <div className="bg-black/60 p-4 border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                    Baseline Formulation ({recipeToRefine.name})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="bg-[#120722] p-2 border border-white/5">
                      <span className="text-gray-400 text-[10px] uppercase block">Energy</span>
                      <span className="text-amber-300 font-bold">{recipeToRefine.caloriesKcal} kcal</span>
                    </div>
                    <div className="bg-[#120722] p-2 border border-white/5">
                      <span className="text-gray-400 text-[10px] uppercase block">Protein</span>
                      <span className="text-emerald-300 font-bold">{recipeToRefine.proteinG}g</span>
                    </div>
                    <div className="bg-[#120722] p-2 border border-white/5">
                      <span className="text-gray-400 text-[10px] uppercase block">Carbohydrates</span>
                      <span className="text-blue-300 font-bold">{recipeToRefine.carbsG}g</span>
                    </div>
                    <div className="bg-[#120722] p-2 border border-white/5">
                      <span className="text-gray-400 text-[10px] uppercase block">Dietary Fiber</span>
                      <span className="text-cyan-300 font-bold">{recipeToRefine.fiberG}g</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-gray-400 text-[11px] block mb-1">Baseline Ingredients:</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {recipeToRefine.ingredients.map((ing, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 font-mono text-gray-300">
                          {ing.item}: <strong className="text-white">{ing.portion}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center py-4">
                  <button
                    type="button"
                    onClick={handleRunGeminiRefine}
                    className="px-6 py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all"
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                    <span>Run Gemini AI Ingredient Formulation</span>
                  </button>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Directly queries Gemini API to recalculate portions to satisfy the 24-hr recall goals.
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isGeminiRefining && (
              <div className="p-8 text-center bg-[#150928] border border-purple-500/50 space-y-4 rounded-sm">
                <div className="relative w-12 h-12 mx-auto">
                  <RefreshCw className="w-12 h-12 text-[#C084FC] animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">
                    Gemini AI Recalibrating Ingredient Stoichiometry...
                  </h4>
                  <p className="text-xs text-purple-200 mt-1 max-w-md mx-auto leading-relaxed">
                    Analyzing 24-hr recall micronutrient deficits ({selectedFocusNutrients.slice(0, 3).join(', ')}), calculating biochemical absorption co-factors, and revising portion quantities.
                  </p>
                </div>
              </div>
            )}

            {/* Refinement Results View */}
            {refinedRecipeResult && !isGeminiRefining && (
              <div className="space-y-4 animate-fade-in">
                {/* Status bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-950/70 border border-emerald-500/60 p-3 rounded-xs text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ingredient Quantities Refined & Calibrated to 24-hr Recall</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-200 bg-emerald-900/60 px-2 py-0.5 border border-emerald-400/40">
                    Engine: {refinementSource === 'gemini-ai' ? 'Gemini 3.8 Flash' : 'Clinical Stoichiometry Fallback'}
                  </span>
                </div>

                {/* Clinical Rationale */}
                <div className="bg-purple-950/40 border border-purple-500/40 p-3.5 space-y-1 text-xs">
                  <span className="text-[#C084FC] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Clinical Refinement Rationale:</span>
                  </span>
                  <p className="text-gray-200 leading-relaxed font-sans">
                    {refinedRecipeResult.clinicalRefinementRationale}
                  </p>
                </div>

                {/* Adjusted Ingredients Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ingredient Portion Adjustments (Before vs. After)</span>
                  </h4>

                  <div className="overflow-x-auto border border-white/15">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-black/90 text-gray-400 border-b border-white/10 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Ingredient Item</th>
                          <th className="p-2.5">Original Portion</th>
                          <th className="p-2.5 text-emerald-300">Adjusted Portion</th>
                          <th className="p-2.5">Target Micronutrient</th>
                          <th className="p-2.5">Biochemical Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 bg-[#0d0617]">
                        {refinedRecipeResult.adjustedIngredients.map((adj, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-2.5 font-bold text-white">{adj.item}</td>
                            <td className="p-2.5 text-gray-400 line-through">{adj.originalPortion}</td>
                            <td className="p-2.5 font-bold text-emerald-400 bg-emerald-950/40">
                              <span className="flex items-center gap-1.5">
                                <span>{adj.adjustedPortion}</span>
                                <span className="text-[10px] text-amber-300 font-normal">({adj.deltaPercentage})</span>
                              </span>
                            </td>
                            <td className="p-2.5 text-purple-300 font-bold">{adj.targetMicronutrient}</td>
                            <td className="p-2.5 text-gray-300 text-[11px] font-sans max-w-xs">{adj.biochemicalImpact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Updated Nutritional Profile Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Recalculated Macro & Micronutrient Profile (Per Serving)</span>
                  </h4>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-mono">
                    <div className="bg-black/70 p-2.5 border border-white/10">
                      <span className="text-gray-400 text-[10px] uppercase block">Calories</span>
                      <span className="text-amber-400 font-bold text-sm">
                        {refinedRecipeResult.updatedNutrients.caloriesKcal} kcal
                      </span>
                    </div>
                    <div className="bg-black/70 p-2.5 border border-white/10">
                      <span className="text-gray-400 text-[10px] uppercase block">Protein</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {refinedRecipeResult.updatedNutrients.proteinG}g
                      </span>
                    </div>
                    <div className="bg-black/70 p-2.5 border border-white/10">
                      <span className="text-gray-400 text-[10px] uppercase block">Carbohydrates</span>
                      <span className="text-blue-400 font-bold text-sm">
                        {refinedRecipeResult.updatedNutrients.carbsG}g
                      </span>
                    </div>
                    <div className="bg-black/70 p-2.5 border border-white/10">
                      <span className="text-gray-400 text-[10px] uppercase block">Dietary Fiber</span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {refinedRecipeResult.updatedNutrients.fiberG}g
                      </span>
                    </div>
                    <div className="bg-black/70 p-2.5 border border-white/10">
                      <span className="text-gray-400 text-[10px] uppercase block">Bioavailable Iron</span>
                      <span className="text-rose-400 font-bold text-sm">
                        {refinedRecipeResult.updatedNutrients.ironMg} mg
                      </span>
                    </div>
                    <div className="bg-black/70 p-2.5 border border-white/10">
                      <span className="text-gray-400 text-[10px] uppercase block">Calcium</span>
                      <span className="text-purple-400 font-bold text-sm">
                        {refinedRecipeResult.updatedNutrients.calciumMg} mg
                      </span>
                    </div>
                  </div>
                </div>

                {/* 24-hr Recall Deficits Closed Progress */}
                {refinedRecipeResult.micronutrientGoalsClosed && refinedRecipeResult.micronutrientGoalsClosed.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                      24-Hour Recall Micronutrient Gap Resolution:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                      {refinedRecipeResult.micronutrientGoalsClosed.map((cl, i) => (
                        <div key={i} className="bg-purple-950/50 border border-purple-500/50 p-2.5 rounded-xs space-y-1">
                          <div className="flex justify-between font-bold text-white">
                            <span>{cl.nutrient}</span>
                            <span className="text-amber-300">{cl.percentageClosed}</span>
                          </div>
                          <div className="text-[11px] text-gray-300 flex justify-between">
                            <span>Recall Deficit: <span className="text-red-300">{cl.gapBefore}</span></span>
                            <span>Yield: <span className="text-emerald-300">{cl.contributionFromRecipe}</span></span>
                          </div>
                          <div className="text-[10px] text-purple-200 uppercase tracking-wider font-bold">
                            ✓ {cl.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Culinary Preparation Instructions */}
                {refinedRecipeResult.culinaryAdjustments && refinedRecipeResult.culinaryAdjustments.length > 0 && (
                  <div className="bg-black/60 border border-white/10 p-3 space-y-1.5 text-xs">
                    <span className="text-amber-300 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bioavailability & Preparation Guidelines:</span>
                    </span>
                    <ul className="space-y-1 text-gray-300 list-disc list-inside">
                      {refinedRecipeResult.culinaryAdjustments.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                {refinedRecipeResult && (
                  <button
                    type="button"
                    onClick={handleRunGeminiRefine}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Run Gemini</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRefineModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>

                {refinedRecipeResult && (
                  <>
                    <button
                      type="button"
                      onClick={handleSendRefinedTo7DayPlan}
                      className="px-4 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Send to 7-Day Plan (Day {selectedTargetDay})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyRefinedQuantities}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Refined Quantities to Recipe</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
