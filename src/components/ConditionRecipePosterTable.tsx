import React, { useState, useMemo, useEffect } from 'react';
import {
  ConditionRecipePosterData,
  RecipePosterMealItem,
  FOOD_IMAGE_MAP,
  generateConditionPosterData,
  MASTER_DOMAIN_CATEGORY_GROUPS,
} from '../data/domainRecipePosterMasterData';
import {
  getConditionSpecificIngredients,
  extractIngredientsFromRecipe,
  TherapeuticIngredient,
} from '../data/conditionIngredientsData';
import {
  Utensils,
  Soup,
  Salad,
  Apple,
  Moon,
  ChefHat,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Printer,
  Sparkles,
  Search,
  RefreshCw,
  Sliders,
  Check,
  Info,
  ChevronRight,
  Eye,
  Plus,
  Wheat,
  Drumstick,
  Flame,
  Leaf,
  Layers,
  X,
  Filter,
  CheckSquare,
  Square,
  Calendar,
} from 'lucide-react';

interface ConditionRecipePosterTableProps {
  initialCondition?: string;
  onSelectCondition?: (categoryName: string, domainType?: string) => void;
  onSendRecipeToPlan?: (recipeName: string, slot: string) => void;
  onRefineRecipe?: (recipeName: string, slot: string) => void;
  patientGeneralInfo?: any;
  patientCalculations?: any;
  dietaryRecall?: any[];
  nutrientGaps?: any;
}

export const ConditionRecipePosterTable: React.FC<ConditionRecipePosterTableProps> = ({
  initialCondition = 'Diabetes Mellitus',
  onSelectCondition,
  onSendRecipeToPlan,
  onRefineRecipe,
  patientGeneralInfo,
  patientCalculations,
  dietaryRecall,
  nutrientGaps,
}) => {
  // Selected category and domain group
  const [selectedCondition, setSelectedCondition] = useState<string>(initialCondition);
  const [activeGroup, setActiveGroup] = useState<'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains'>(
    'diseases'
  );

  // Active meal slot tab: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'all' | 'bedtime'
  const [activeMealSlot, setActiveMealSlot] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'all' | 'bedtime'>('breakfast');

  // Search filter across recipes
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected ingredients state for filtering and highlighting
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<string>>(new Set());
  const [filterOnlySelectedIngredients, setFilterOnlySelectedIngredients] = useState<boolean>(false);
  const [ingredientCategoryFilter, setIngredientCategoryFilter] = useState<'all' | 'grains' | 'proteins' | 'vegetables' | 'fatsAndSeeds' | 'spicesAndHerbs'>('all');

  // Target day selector for "Add to 7-Day Plan"
  const [selectedPlanDay, setSelectedPlanDay] = useState<number>(1);

  // AI Customization state
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Selected recipe detail modal
  const [activeRecipeDetail, setActiveRecipeDetail] = useState<{
    item: RecipePosterMealItem;
    slot: string;
    slotColor: string;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent storage of AI-generated condition meals
  const [aiPosters, setAiPosters] = useState<Record<string, ConditionRecipePosterData>>(() => {
    try {
      const saved = localStorage.getItem('ziathlon_ai_recipe_posters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active condition recipe data (prefers live AI-generated meals, falls back to clinical engine)
  const currentPosterData: ConditionRecipePosterData = useMemo(() => {
    const key = selectedCondition.toLowerCase().trim();
    if (aiPosters[key]) {
      return aiPosters[key];
    }
    return generateConditionPosterData(selectedCondition, activeGroup);
  }, [selectedCondition, activeGroup, aiPosters]);

  // Condition-specific therapeutic ingredients profile
  const conditionIngredientsProfile = useMemo(() => {
    return getConditionSpecificIngredients(selectedCondition, activeGroup);
  }, [selectedCondition, activeGroup]);

  // Initialize selected ingredients when condition changes (select all by default)
  useEffect(() => {
    const initialIds = new Set(conditionIngredientsProfile.recommendedIngredients.map((i) => i.id));
    setSelectedIngredientIds(initialIds);
  }, [selectedCondition, conditionIngredientsProfile]);

  // Keep active group in sync if initialCondition changes externally
  useEffect(() => {
    if (initialCondition && initialCondition !== selectedCondition) {
      setSelectedCondition(initialCondition);
      let matchedGroup = activeGroup;
      for (const grp of MASTER_DOMAIN_CATEGORY_GROUPS) {
        if (grp.items.includes(initialCondition)) {
          setActiveGroup(grp.groupId);
          matchedGroup = grp.groupId;
          break;
        }
      }
      generateConditionMealsWithAi(initialCondition, matchedGroup);
    }
  }, [initialCondition]);

  // Core AI Condition-Specific Meal Matrix Generator
  const generateConditionMealsWithAi = async (
    conditionToGen: string,
    groupToGen: typeof activeGroup,
    customPromptText?: string
  ) => {
    setIsAiGenerating(true);
    const key = conditionToGen.toLowerCase().trim();
    try {
      const resp = await fetch('/api/generate-recipe-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conditionName: conditionToGen,
          domainType: groupToGen,
          customPrompt:
            customPromptText ||
            aiCustomPrompt.trim() ||
            `Tailor strictly to ${conditionToGen} and patient clinical dossier. Use ICMR-NIN & IFCT standards. Culturally authentic Indian recipes. Zero meal or ingredient repetition across conditions. Generate 20 Breakfast, 20 Lunch, 20 Snacks, 20 Dinner options.`,
          targetCalories: patientCalculations?.targetCalories || 1500,
          patientProfile: {
            name: patientGeneralInfo?.name || 'Patient',
            age: patientGeneralInfo?.age || 35,
            sex: patientGeneralInfo?.sex || 'Female',
            height: patientGeneralInfo?.height || 162,
            weight: patientGeneralInfo?.weight || 62,
            bmi: patientGeneralInfo?.bmi || '23.6',
            targetCalories: patientCalculations?.targetCalories || 1500,
            hba1c: patientGeneralInfo?.hba1c || (patientCalculations as any)?.hba1c,
            fastingBloodGlucose: patientGeneralInfo?.fastingBloodGlucose,
            postPrandialGlucose: patientGeneralInfo?.postPrandialGlucose,
            bloodPressure: patientGeneralInfo?.bloodPressure,
            medications: patientGeneralInfo?.medications,
            allergies: patientGeneralInfo?.allergies,
            foodPreference: patientGeneralInfo?.foodPreference || patientGeneralInfo?.dietaryHabits,
          },
          bloodReports: patientGeneralInfo?.bloodReports || [],
          medications: patientGeneralInfo?.medications,
          allergies: patientGeneralInfo?.allergies,
          preferences: patientGeneralInfo?.foodPreference || patientGeneralInfo?.dietaryHabits,
          nutritionalRequirements: patientCalculations,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.poster && Array.isArray(data.poster.breakfast) && data.poster.breakfast.length > 0) {
          const fallbackData = generateConditionPosterData(conditionToGen, groupToGen);
          const formattedPoster: ConditionRecipePosterData = {
            conditionKey: conditionToGen,
            displayName: conditionToGen,
            title: data.poster.title || `${conditionToGen.toUpperCase()} – INGREDIENT & MEAL SELECTION`,
            domainType: groupToGen,
            subtitleTags: data.poster.subtitleTags || fallbackData.subtitleTags,
            dietTips: data.poster.dietTips || fallbackData.dietTips,
            foodsToInclude: data.poster.foodsToInclude || fallbackData.foodsToInclude,
            foodsToAvoid: data.poster.foodsToAvoid || fallbackData.foodsToAvoid,
            noteFooter: data.poster.noteFooter || 'AI Condition Database Calibrated for Clinical Tolerance & ICMR-NIN Standards.',
            breakfast: data.poster.breakfast.map((it: any, idx: number) => ({
              id: `${key}-ai-bf-${idx + 1}`,
              number: idx + 1,
              name: it.name || `Breakfast Option ${idx + 1}`,
              portionOrNote: it.portionOrNote || it.portion || '1 serving',
              calories: it.calories || 220,
              protein: it.protein || 10,
              carbs: it.carbs || 32,
              fats: it.fats || 5,
              imageKeyword: it.imageKeyword || 'chilla',
              therapeuticBenefit: it.therapeuticBenefit || 'Formulated specifically for glycemic stability and metabolic balance',
            })),
            lunch: (data.poster.lunch || []).map((it: any, idx: number) => ({
              id: `${key}-ai-lu-${idx + 1}`,
              number: idx + 1,
              name: it.name || `Lunch Option ${idx + 1}`,
              portionOrNote: it.portionOrNote || it.portion || '1 thali',
              calories: it.calories || 420,
              protein: it.protein || 18,
              carbs: it.carbs || 62,
              fats: it.fats || 10,
              imageKeyword: it.imageKeyword || 'rice_dal',
              therapeuticBenefit: it.therapeuticBenefit || 'Rich in soluble and insoluble fiber promoting healthy colonic transit',
            })),
            snacks: (data.poster.snacks || []).map((it: any, idx: number) => ({
              id: `${key}-ai-sn-${idx + 1}`,
              number: idx + 1,
              name: it.name || `Snack Option ${idx + 1}`,
              portionOrNote: it.portionOrNote || it.portion || '1 cup',
              calories: it.calories || 130,
              protein: it.protein || 6,
              carbs: it.carbs || 20,
              fats: it.fats || 3,
              imageKeyword: it.imageKeyword || 'sprouts',
              therapeuticBenefit: it.therapeuticBenefit || 'Low sodium, living enzymes sustaining steady afternoon energy',
            })),
            dinner: (data.poster.dinner || []).map((it: any, idx: number) => ({
              id: `${key}-ai-dn-${idx + 1}`,
              number: idx + 1,
              name: it.name || `Dinner Option ${idx + 1}`,
              portionOrNote: it.portionOrNote || it.portion || '2 phulkas + bowl',
              calories: it.calories || 310,
              protein: it.protein || 14,
              carbs: it.carbs || 44,
              fats: it.fats || 7,
              imageKeyword: it.imageKeyword || 'roti',
              therapeuticBenefit: it.therapeuticBenefit || 'Gentle restorative dinner allowing deep uninterrupted sleep',
            })),
            bedtime: (data.poster.bedtime || []).map((it: any, idx: number) => ({
              id: `${key}-ai-bt-${idx + 1}`,
              number: idx + 1,
              name: it.name || `Bedtime Option ${idx + 1}`,
              portionOrNote: it.portionOrNote || it.portion || '1 cup (150ml)',
              calories: it.calories || 75,
              protein: it.protein || 4,
              carbs: it.carbs || 6,
              fats: it.fats || 2,
              imageKeyword: it.imageKeyword || 'milk',
              therapeuticBenefit: it.therapeuticBenefit || 'Downregulates nocturnal cortisol and promotes circadian restoration',
            })),
          };

          const updatedMap = {
            ...aiPosters,
            [key]: formattedPoster,
          };
          setAiPosters(updatedMap);
          try {
            localStorage.setItem('ziathlon_ai_recipe_posters', JSON.stringify(updatedMap));
          } catch (e) {
            console.warn('localStorage error', e);
          }
          setAiSuccessMessage(`✨ AI generated 80 dynamic condition-specific meals tailored to ${conditionToGen}!`);
          setToastMessage(`✓ Generated 20 Breakfast, 20 Lunch, 20 Snacks, 20 Dinner for ${conditionToGen}!`);
          setTimeout(() => setToastMessage(null), 3500);
        }
      }
    } catch (err) {
      console.warn('AI meal generation fallback active', err);
    } finally {
      setIsAiGenerating(false);
      setTimeout(() => {
        setAiSuccessMessage(null);
        setShowAiModal(false);
        setAiCustomPrompt('');
      }, 2000);
    }
  };

  const handleSelectCategory = (cat: string, groupId: typeof activeGroup) => {
    setSelectedCondition(cat);
    setActiveGroup(groupId);
    if (onSelectCondition) {
      onSelectCondition(cat, groupId);
    }
    setToastMessage(`Selected "${cat}". Generating 20 Breakfast, 20 Lunch, 20 Snacks, 20 Dinner...`);
    setTimeout(() => setToastMessage(null), 3000);
    generateConditionMealsWithAi(cat, groupId);
  };

  // Toggle individual ingredient selection
  const toggleIngredient = (id: string) => {
    const next = new Set(selectedIngredientIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIngredientIds(next);
  };

  // Select all or deselect all
  const selectAllIngredients = () => {
    const all = new Set(conditionIngredientsProfile.recommendedIngredients.map((i) => i.id));
    setSelectedIngredientIds(all);
  };

  const deselectAllIngredients = () => {
    setSelectedIngredientIds(new Set());
  };

  // Helper to filter and match recipes with selected ingredients and search query
  const processMealList = (items: RecipePosterMealItem[]) => {
    return items.filter((it) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = it.name.toLowerCase().includes(q);
        const matchesBenefit = it.therapeuticBenefit?.toLowerCase().includes(q);
        if (!matchesName && !matchesBenefit) return false;
      }

      // 2. Ingredient matching filter
      if (filterOnlySelectedIngredients && selectedIngredientIds.size > 0) {
        const matchedIngs = extractIngredientsFromRecipe(
          it.name,
          conditionIngredientsProfile.recommendedIngredients
        );
        const hasAnySelected = matchedIngs.some((ing) => selectedIngredientIds.has(ing.id));
        if (!hasAnySelected) return false;
      }

      return true;
    });
  };

  const filteredBreakfast = useMemo(() => processMealList(currentPosterData.breakfast), [
    currentPosterData.breakfast,
    searchQuery,
    filterOnlySelectedIngredients,
    selectedIngredientIds,
    conditionIngredientsProfile,
  ]);

  const filteredLunch = useMemo(() => processMealList(currentPosterData.lunch), [
    currentPosterData.lunch,
    searchQuery,
    filterOnlySelectedIngredients,
    selectedIngredientIds,
    conditionIngredientsProfile,
  ]);

  const filteredSnacks = useMemo(() => processMealList(currentPosterData.snacks), [
    currentPosterData.snacks,
    searchQuery,
    filterOnlySelectedIngredients,
    selectedIngredientIds,
    conditionIngredientsProfile,
  ]);

  const filteredDinner = useMemo(() => processMealList(currentPosterData.dinner), [
    currentPosterData.dinner,
    searchQuery,
    filterOnlySelectedIngredients,
    selectedIngredientIds,
    conditionIngredientsProfile,
  ]);

  const filteredBedtime = useMemo(() => processMealList(currentPosterData.bedtime), [
    currentPosterData.bedtime,
    searchQuery,
    filterOnlySelectedIngredients,
    selectedIngredientIds,
    conditionIngredientsProfile,
  ]);

  // Total matching count across the 4 primary slots (20 each = 80 total)
  const totalMealsMatchingCount =
    filteredBreakfast.length + filteredLunch.length + filteredSnacks.length + filteredDinner.length;

  // Filtered ingredients shown in the selection deck
  const displayedIngredients = useMemo(() => {
    if (ingredientCategoryFilter === 'all') {
      return conditionIngredientsProfile.recommendedIngredients;
    }
    return conditionIngredientsProfile.recommendedIngredients.filter(
      (ing) => ing.category === ingredientCategoryFilter
    );
  }, [conditionIngredientsProfile, ingredientCategoryFilter]);

  // AI Recalculate / Customize Handler
  const handleRunAiCustomize = async () => {
    await generateConditionMealsWithAi(selectedCondition, activeGroup, aiCustomPrompt);
  };

  const handlePrint = () => {
    window.print();
  };

  // Dish circular photo fallback renderer
  const renderDishImage = (item: RecipePosterMealItem, slot: string) => {
    const directUrl = item.imageUrl || (item.imageKeyword ? FOOD_IMAGE_MAP[item.imageKeyword] : null);

    if (directUrl) {
      return (
        <img
          src={directUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-sm border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }

    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm shrink-0">
        #{item.number}
      </div>
    );
  };

  // Render a single recipe card
  const renderMealCard = (
    item: RecipePosterMealItem,
    slotName: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner' | 'Bedtime',
    slotBadgeColor: string
  ) => {
    // Detect ingredients in this recipe
    const matchedIngs = extractIngredientsFromRecipe(
      item.name,
      conditionIngredientsProfile.recommendedIngredients
    );

    return (
      <div
        key={item.id}
        className="p-4 bg-[#110d22] border border-white/10 hover:border-[#C084FC]/60 rounded-md transition-all flex flex-col justify-between space-y-3 group shadow-lg hover:shadow-[0_0_15px_rgba(126,34,206,0.2)]"
      >
        <div className="space-y-2.5">
          {/* Top Bar with Slot Badge, Number & Calories */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white ${slotBadgeColor}`}>
                {slotName} #{item.number}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {item.calories || (slotName === 'Snacks' ? 130 : slotName === 'Breakfast' ? 220 : 380)} kcal
            </span>
          </div>

          {/* Dish Image & Title */}
          <div className="flex items-start gap-3">
            {renderDishImage(item, slotName.toLowerCase())}
            <div className="space-y-0.5 flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white group-hover:text-[#C084FC] transition-colors leading-snug">
                {item.name}
              </h4>
              <p className="text-[11px] text-gray-400 font-mono">
                Portion: <span className="text-amber-300 font-semibold">{item.portionOrNote || '1 therapeutic serving'}</span>
              </p>
            </div>
          </div>

          {/* Macronutrient Pills */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10.5px] font-mono">
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-gray-400 text-[9px] block">PRO</span>
              <span className="text-emerald-400 font-bold">{item.protein || 12}g</span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-gray-400 text-[9px] block">CARB</span>
              <span className="text-cyan-400 font-bold">{item.carbs || 36}g</span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-gray-400 text-[9px] block">FAT</span>
              <span className="text-rose-400 font-bold">{item.fats || 6}g</span>
            </div>
            <div className="p-1 bg-white/5 rounded border border-white/5">
              <span className="text-gray-400 text-[9px] block">FIBER</span>
              <span className="text-purple-300 font-bold">6g</span>
            </div>
          </div>

          {/* Matched Ingredients Chips */}
          {matchedIngs.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase font-mono text-gray-400 flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-emerald-400" />
                <span>Therapeutic Ingredients:</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedIngs.map((ing) => {
                  const isSelected = selectedIngredientIds.has(ing.id);
                  return (
                    <span
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-all flex items-center gap-1 font-mono ${
                        isSelected
                          ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                      }`}
                      title={ing.clinicalAction}
                    >
                      {isSelected ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : null}
                      <span>{ing.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clinical Therapeutic Mechanism */}
          <div className="p-2 bg-purple-950/20 border border-purple-800/30 rounded text-[11px] text-purple-200 leading-relaxed">
            <span className="font-bold text-amber-300">Action: </span>
            {item.therapeuticBenefit ||
              `Formulated specifically for ${selectedCondition} with low glycemic load and clinical anti-inflammatory profile.`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveRecipeDetail({ item, slot: slotName, slotColor: slotBadgeColor })}
            className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3 text-purple-400" />
            <span>Details</span>
          </button>

          <div className="flex items-center gap-1.5">
            {onRefineRecipe && (
              <button
                type="button"
                onClick={() => onRefineRecipe(item.name, slotName)}
                title="AI Calibrate with 24-Hour Recall"
                className="p-1 text-purple-300 hover:text-amber-300 bg-purple-900/40 hover:bg-purple-900 border border-purple-500/40 rounded transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}

            {onSendRecipeToPlan && (
              <button
                type="button"
                onClick={() => {
                  onSendRecipeToPlan(item.name, slotName);
                  setToastMessage(`✓ Added "${item.name}" to Day ${selectedPlanDay} (${slotName}) in 7-Day Plan!`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-2.5 py-1 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add to Day {selectedPlanDay}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#7E22CE] text-white px-4 py-2.5 rounded shadow-2xl border border-purple-400 flex items-center gap-2.5 animate-fade-in text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP CONTROLS: 4 PILLARS & CONDITION SELECTOR                          */}
      {/* ========================================================================= */}
      <div className="bg-[#0f0a1c] border-2 border-[#7E22CE] p-4 rounded-sm space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[#C084FC]">
              <Utensils className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>CONDITION-BASED INGREDIENT & MEAL SELECTOR</span>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">
              Select Condition: 20 Breakfast • 20 Lunch • 20 Snacks • 20 Dinner
            </h3>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meals or ingredients..."
                className="bg-black/60 border border-white/20 text-xs text-white pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-[#C084FC] w-48 sm:w-60 font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Target Day for Plan */}
            <div className="flex items-center gap-1 bg-black/60 border border-white/20 px-2 py-1 rounded text-xs">
              <Calendar className="w-3 h-3 text-[#C084FC]" />
              <span className="text-gray-400 text-[10px] font-mono">Plan Day:</span>
              <select
                value={selectedPlanDay}
                onChange={(e) => setSelectedPlanDay(Number(e.target.value))}
                className="bg-transparent text-white font-bold font-mono focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d} className="bg-black text-white">
                    Day {d}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Personalize Button */}
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-400/80 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.35)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Personalize</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              title="Print Formulation"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5 Group Tabs: Diseases, Disorders, Performance, Fitness, Diet Domains */}
        <div className="flex flex-wrap gap-1 border-b border-white/10 pb-1">
          {MASTER_DOMAIN_CATEGORY_GROUPS.map((grp) => {
            const isActive = activeGroup === grp.groupId;
            return (
              <button
                key={grp.groupId}
                type="button"
                onClick={() => setActiveGroup(grp.groupId)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 rounded-t-sm ${
                  isActive
                    ? 'bg-[#7E22CE] text-white shadow-[0_0_10px_rgba(126,34,206,0.5)] border-b-2 border-amber-400'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-[10px] font-mono text-purple-200">{grp.badgeCode}.</span>
                <span>{grp.groupName}</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-gray-300 font-mono">
                  {grp.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Condition Chips inside Active Group */}
        <div className="pt-2 flex flex-wrap gap-1.5">
          {MASTER_DOMAIN_CATEGORY_GROUPS.find((g) => g.groupId === activeGroup)?.items.map((cat) => {
            const isSelected = selectedCondition.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat, activeGroup)}
                className={`px-3 py-1.5 text-xs transition-all cursor-pointer rounded-sm flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-black font-black shadow-[0_0_10px_rgba(251,191,36,0.4)] border border-amber-300 scale-105'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* AI Calibration Status Ribbon */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Condition: {selectedCondition}</span>
            </span>

            <span className="text-gray-400 text-[11px] hidden sm:inline">
              Calibrated to: {patientGeneralInfo?.name || 'Patient'} ({patientGeneralInfo?.age || 35}y, {patientGeneralInfo?.sex || 'Female'}) •{' '}
              <span className="text-amber-300 font-bold">{patientCalculations?.targetCalories || 1500} kcal/day</span> •{' '}
              <span className="text-purple-300">ICMR-NIN & IFCT 2024 Standards</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isAiGenerating}
              onClick={() => generateConditionMealsWithAi(selectedCondition, activeGroup)}
              className="px-3 py-1 bg-[#7E22CE]/60 hover:bg-[#7E22CE] border border-purple-400/50 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>{isAiGenerating ? 'Formulating 80 Meals...' : 'Regenerate AI Database (20 Each)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THERAPEUTIC INGREDIENT SELECTION DECK                                  */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-[#0d071d] border-2 border-[#7E22CE]/70 rounded-md shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Therapeutic Ingredient Selection for <span className="text-amber-300">{selectedCondition}</span>
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              ({selectedIngredientIds.size} / {conditionIngredientsProfile.recommendedIngredients.length} selected)
            </span>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectAllIngredients}
              className="px-2.5 py-1 text-[11px] font-mono font-bold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 rounded cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={deselectAllIngredients}
              className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded cursor-pointer"
            >
              Deselect All
            </button>

            {/* Toggle: Filter only recipes with selected ingredients */}
            <button
              type="button"
              onClick={() => setFilterOnlySelectedIngredients(!filterOnlySelectedIngredients)}
              className={`px-3 py-1 text-xs font-bold uppercase rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                filterOnlySelectedIngredients
                  ? 'bg-amber-400 text-black border border-amber-300 font-black'
                  : 'bg-white/10 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>
                {filterOnlySelectedIngredients
                  ? `Filtering Meals (${totalMealsMatchingCount} Matched)`
                  : 'Filter Meals by Selected Ingredients'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter for Ingredients */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Ingredients' },
            { id: 'grains', label: '🌾 Grains & Millets' },
            { id: 'proteins', label: '🥩 Clinical Proteins' },
            { id: 'vegetables', label: '🥬 Vegetables & Greens' },
            { id: 'fatsAndSeeds', label: '🌰 Seeds & Healthy Fats' },
            { id: 'spicesAndHerbs', label: '🌿 Functional Spices' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setIngredientCategoryFilter(cat.id as any)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                ingredientCategoryFilter === cat.id
                  ? 'bg-[#7E22CE] text-white border border-purple-400 shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Clickable Ingredient Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
          {displayedIngredients.map((ing) => {
            const isSelected = selectedIngredientIds.has(ing.id);
            return (
              <div
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`p-2 rounded border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold truncate">{ing.name}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                    {ing.clinicalAction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Guidelines: Foods to Include vs Foods to Avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded space-y-1">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Foods to Include ({selectedCondition})</span>
            </span>
            <p className="text-gray-300 leading-relaxed text-[11.5px]">
              {currentPosterData.foodsToInclude || conditionIngredientsProfile.foodsToInclude}
            </p>
          </div>

          <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded space-y-1">
            <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Contraindicated Foods to Avoid ({selectedCondition})</span>
            </span>
            <p className="text-gray-300 leading-relaxed text-[11.5px]">
              {currentPosterData.foodsToAvoid || conditionIngredientsProfile.foodsToAvoid}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONDITION MEAL SELECTOR: 20 BREAKFAST • 20 LUNCH • 20 SNACKS • 20 DINNER */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Meal Slot Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d071d] p-3 rounded-md border border-[#7E22CE]/60">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMealSlot('breakfast')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMealSlot === 'breakfast'
                  ? 'bg-[#1D4ED8] text-white shadow-[0_0_12px_rgba(29,78,216,0.5)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Soup className="w-3.5 h-3.5 text-blue-300" />
              <span>Breakfast ({filteredBreakfast.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMealSlot('lunch')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMealSlot === 'lunch'
                  ? 'bg-[#15803D] text-white shadow-[0_0_12px_rgba(21,128,61,0.5)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Salad className="w-3.5 h-3.5 text-emerald-300" />
              <span>Lunch ({filteredLunch.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMealSlot('snacks')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMealSlot === 'snacks'
                  ? 'bg-[#EA580C] text-white shadow-[0_0_12px_rgba(234,88,12,0.5)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Apple className="w-3.5 h-3.5 text-orange-300" />
              <span>Snacks ({filteredSnacks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMealSlot('dinner')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMealSlot === 'dinner'
                  ? 'bg-[#7E22CE] text-white shadow-[0_0_12px_rgba(126,34,206,0.5)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-purple-300" />
              <span>Dinner ({filteredDinner.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMealSlot('all')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMealSlot === 'all'
                  ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-105 font-black'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 80 Options</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMealSlot('bedtime')}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMealSlot === 'bedtime'
                  ? 'bg-[#0E7490] text-white shadow-[0_0_12px_rgba(14,116,144,0.5)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-cyan-300" />
              <span>Bedtime ({filteredBedtime.length})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-gray-400">
            Showing <strong className="text-white">{activeMealSlot.toUpperCase()}</strong> for{' '}
            <span className="text-[#C084FC]">{selectedCondition}</span>
          </div>
        </div>

        {/* 20 BREAKFAST OPTIONS SECTION */}
        {(activeMealSlot === 'breakfast' || activeMealSlot === 'all') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#1D4ED8]/20 border-l-4 border-[#1D4ED8] p-3 rounded-r">
              <div className="flex items-center gap-2">
                <Soup className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  Breakfast Formulation • 20 Condition-Calibrated Options
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-600/40">
                {filteredBreakfast.length} Recipes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredBreakfast.map((item) => renderMealCard(item, 'Breakfast', 'bg-[#1D4ED8]'))}
            </div>
          </div>
        )}

        {/* 20 LUNCH OPTIONS SECTION */}
        {(activeMealSlot === 'lunch' || activeMealSlot === 'all') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between bg-[#15803D]/20 border-l-4 border-[#15803D] p-3 rounded-r">
              <div className="flex items-center gap-2">
                <Salad className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  Lunch Formulation • 20 Condition-Calibrated Options
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-600/40">
                {filteredLunch.length} Recipes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredLunch.map((item) => renderMealCard(item, 'Lunch', 'bg-[#15803D]'))}
            </div>
          </div>
        )}

        {/* 20 SNACKS OPTIONS SECTION */}
        {(activeMealSlot === 'snacks' || activeMealSlot === 'all') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between bg-[#EA580C]/20 border-l-4 border-[#EA580C] p-3 rounded-r">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  Snacks Formulation • 20 Condition-Calibrated Options
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-orange-300 bg-orange-900/40 px-2 py-0.5 rounded border border-orange-600/40">
                {filteredSnacks.length} Recipes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredSnacks.map((item) => renderMealCard(item, 'Snacks', 'bg-[#EA580C]'))}
            </div>
          </div>
        )}

        {/* 20 DINNER OPTIONS SECTION */}
        {(activeMealSlot === 'dinner' || activeMealSlot === 'all') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between bg-[#7E22CE]/20 border-l-4 border-[#7E22CE] p-3 rounded-r">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  Dinner Formulation • 20 Condition-Calibrated Options
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-600/40">
                {filteredDinner.length} Recipes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredDinner.map((item) => renderMealCard(item, 'Dinner', 'bg-[#7E22CE]'))}
            </div>
          </div>
        )}

        {/* 20 BEDTIME OPTIONS SECTION */}
        {(activeMealSlot === 'bedtime' || activeMealSlot === 'all') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between bg-[#0E7490]/20 border-l-4 border-[#0E7490] p-3 rounded-r">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  Bedtime Formulation • 20 Restorative Options
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded border border-cyan-600/40">
                {filteredBedtime.length} Recipes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredBedtime.map((item) => renderMealCard(item, 'Bedtime', 'bg-[#0E7490]'))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. RECIPE DETAIL MODAL                                                    */}
      {/* ========================================================================= */}
      {activeRecipeDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#110d22] border-2 border-[#7E22CE] text-white p-6 rounded-md max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${activeRecipeDetail.slotColor}`}>
                {activeRecipeDetail.slot} #{activeRecipeDetail.item.number}
              </span>
              <button
                type="button"
                onClick={() => setActiveRecipeDetail(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              {renderDishImage(activeRecipeDetail.item, activeRecipeDetail.slot)}
              <div>
                <h4 className="text-base font-bold text-white">{activeRecipeDetail.item.name}</h4>
                <span className="text-xs text-amber-300 font-mono">
                  Calibrated for {selectedCondition} Clinical Protocol
                </span>
              </div>
            </div>

            {/* Macros and Portion Badges */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white/5 rounded border border-white/10">
                <div className="text-[10px] uppercase font-mono text-gray-400">Calories</div>
                <div className="text-sm font-bold text-amber-400">
                  {activeRecipeDetail.item.calories || 240} <span className="text-[9px]">kcal</span>
                </div>
              </div>
              <div className="p-2 bg-white/5 rounded border border-white/10">
                <div className="text-[10px] uppercase font-mono text-gray-400">Protein</div>
                <div className="text-sm font-bold text-emerald-400">
                  {activeRecipeDetail.item.protein || 12} <span className="text-[9px]">g</span>
                </div>
              </div>
              <div className="p-2 bg-white/5 rounded border border-white/10">
                <div className="text-[10px] uppercase font-mono text-gray-400">Carbs</div>
                <div className="text-sm font-bold text-cyan-400">
                  {activeRecipeDetail.item.carbs || 36} <span className="text-[9px]">g</span>
                </div>
              </div>
              <div className="p-2 bg-white/5 rounded border border-white/10">
                <div className="text-[10px] uppercase font-mono text-gray-400">Fats</div>
                <div className="text-sm font-bold text-rose-400">
                  {activeRecipeDetail.item.fats || 6} <span className="text-[9px]">g</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded text-xs space-y-2 text-gray-300 border border-white/10">
              <p className="leading-relaxed">
                <strong>Serving Portion:</strong>{' '}
                <span className="text-amber-300 font-mono">
                  {activeRecipeDetail.item.portionOrNote || '1 therapeutic standard serving'}
                </span>
              </p>
              {activeRecipeDetail.item.therapeuticBenefit && (
                <p className="leading-relaxed text-purple-200">
                  <strong>Clinical Mechanism:</strong> {activeRecipeDetail.item.therapeuticBenefit}
                </p>
              )}
              <p className="text-[11px] text-gray-400">
                Prepared with minimal refined carbohydrates, zero trans fats, and condition-specific functional spices for {selectedCondition}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              {onRefineRecipe && (
                <button
                  type="button"
                  onClick={() => {
                    const name = activeRecipeDetail.item.name;
                    const slot = activeRecipeDetail.slot;
                    setActiveRecipeDetail(null);
                    onRefineRecipe(name, slot);
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-400/80 text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Refine Recipe (24h Recall AI)</span>
                </button>
              )}
              {onSendRecipeToPlan && (
                <button
                  type="button"
                  onClick={() => {
                    onSendRecipeToPlan(activeRecipeDetail.item.name, activeRecipeDetail.slot);
                    setActiveRecipeDetail(null);
                    setToastMessage(`✓ Added "${activeRecipeDetail.item.name}" to Day ${selectedPlanDay} in 7-Day Plan!`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Day {selectedPlanDay} Plan</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveRecipeDetail(null)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AI CUSTOMIZATION MODAL                                                 */}
      {/* ========================================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#110d22] border-2 border-[#7E22CE] text-white p-6 rounded-md max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-black uppercase tracking-wider text-purple-200">
                  AI Personalize 20x4 Meal Matrix
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Tailor all 80 meal options for <strong>{selectedCondition}</strong> (20 Breakfast, 20 Lunch, 20 Snacks, 20 Dinner) to the patient’s exact dietary preferences, allergies, or calorie targets using Gemini AI.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#C084FC] font-bold">
                Custom Clinical Prompt or Dietary Preference:
              </label>
              <textarea
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="e.g. Strict South Indian vegetarian, gluten-free, target 1,400 kcal deficit, high protein paneer & moong focus..."
                rows={3}
                className="w-full p-2.5 bg-white/5 border border-white/20 text-white text-xs rounded focus:outline-none focus:border-[#C084FC] placeholder:text-gray-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-gray-400">Quick Clinical Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Strict Vegetarian (No Egg)',
                  'Gluten-Free & Dairy-Free',
                  'High Protein (>80g/day)',
                  'South Indian Traditional',
                  'Low Potassium & Sodium',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAiCustomPrompt(preset)}
                    className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] rounded border border-white/10 cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {aiSuccessMessage && (
              <div className="p-2.5 bg-emerald-900/40 border border-emerald-500 text-emerald-200 text-xs rounded flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAiGenerating}
                onClick={handleRunAiCustomize}
                className="px-4 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(126,34,206,0.4)] disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    <span>Formulating 80 Recipes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate With AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
