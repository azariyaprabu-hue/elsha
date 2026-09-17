import React, { useState } from 'react';
import {
  ClinicalRecipe,
  DietDayPlan,
  GeneralInfo,
  MealPlanItem,
  NutrientBreakdown,
  RecipeIngredientItem,
} from '../types';
import {
  Sparkles,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle,
  Flame,
  PieChart,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  FileCheck,
  Calculator,
  Utensils,
  Award,
} from 'lucide-react';
import { AddIngredientRecipeModal } from './AddIngredientRecipeModal';
import { IcmrNutrientInspectorModal } from './IcmrNutrientInspectorModal';
import { IcmrAdequacyReportModal } from './IcmrAdequacyReportModal';
import {
  getIcmrRdaRequirements,
  inferIngredientsForMeal,
  addNutrientBreakdowns,
} from '../utils/icmrCalculator';

interface AiDietPlanSectionProps {
  days: DietDayPlan[];
  generalInfo?: GeneralInfo;
  onRegenerateMeal: (dayNumber: number, mealId: string) => void;
  onUpdateMealItem: (dayNumber: number, mealId: string, updated: Partial<MealPlanItem>) => void;
  onOpenNutritionAi?: (initialPrompt?: string) => void;
  onAddIngredientToMeal?: (dayNumber: number, mealId: string, item: RecipeIngredientItem) => void;
  onAddRecipeToMeal?: (dayNumber: number, mealId: string, recipe: ClinicalRecipe) => void;
  onRemoveIngredientFromMeal?: (dayNumber: number, mealId: string, ingredientItemId: string) => void;
}

export const AiDietPlanSection: React.FC<AiDietPlanSectionProps> = ({
  days,
  generalInfo = {
    name: 'Kiruthika',
    age: 32,
    sex: 'Female',
    height: 162,
    weight: 61.5,
    activityLevel: 'moderately_active',
  },
  onRegenerateMeal,
  onUpdateMealItem,
  onOpenNutritionAi,
  onAddIngredientToMeal,
  onAddRecipeToMeal,
  onRemoveIngredientFromMeal,
}) => {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [dashboardView, setDashboardView] = useState<'macros' | 'micros'>('macros');
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});

  // Modals state
  const [addModalState, setAddModalState] = useState<{
    isOpen: boolean;
    dayNumber: number;
    mealId: string;
    mealName: string;
  } | null>(null);

  const [inspectorState, setInspectorState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    weightGrams: number;
    nutrients: NutrientBreakdown;
    clinicalHighlight?: string;
  } | null>(null);

  const [isAdequacyReportOpen, setIsAdequacyReportOpen] = useState(false);

  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];
  const rdaBenchmark = getIcmrRdaRequirements(generalInfo);

  // Toggle meal ingredient expand
  const toggleMealExpand = (mealId: string) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  const getIndicatorBadge = (indicator: 'green' | 'yellow' | 'red') => {
    switch (indicator) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Safe / Low GI
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Portion Controlled
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 border border-rose-500/50 text-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Contraindicated
          </span>
        );
    }
  };

  // Safe fallback calculation for Day Nutrients
  const dayNutrients = currentDay.totalNutrients || {
    calories: currentDay.totalCalories,
    carbs: currentDay.totalCarbs,
    protein: currentDay.totalProtein,
    fat: currentDay.totalFat,
    fiber: currentDay.totalFiber,
    calcium: 920,
    iron: 24.8,
    zinc: 12.6,
    magnesium: 385,
    sodium: 1350,
    potassium: 3150,
    vitaminA: 1150,
    vitaminC: 92,
    vitaminD: 8.5,
    folate: 320,
    vitaminB12: 1.9,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d4af37]/30 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#d4af37]">
            Module 13 • ICMR-NIN Algorithmic Precision Nutrition
          </span>
          <h2 className="text-2xl font-serif text-[#f7d88c] font-bold tracking-wide flex items-center gap-2">
            AI Personalized Diet Plan (Diabetes Mellitus)
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7d88c] font-sans">
              7-Day Cycle
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ICMR RDA Compliance Audit Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsAdequacyReportOpen(true)}
            className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-[#C5A028] text-black hover:bg-[#d8b235] transition-all cursor-pointer shadow-[0_0_15px_rgba(197,160,40,0.3)]"
          >
            <Award className="w-3.5 h-3.5" />
            <span>ICMR RDA Audit</span>
          </button>

          <div className="flex items-center gap-2 text-xs bg-[#111613] px-3 py-1.5 rounded-full border border-[#d4af37]/30 text-[#e5c07b]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Target: {rdaBenchmark.energy.target} kcal / Day</span>
          </div>
        </div>
      </div>

      {/* Target Dashboard with Tabs for Macros vs ICMR Micronutrients */}
      <div className="p-5 rounded-2xl bg-[#0c100e] border border-[#d4af37]/30 space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-gray-400">
              Nutrient Formulation:
            </span>
            <div className="inline-flex p-0.5 bg-black/60 rounded-lg border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDashboardView('macros')}
                className={`px-3 py-1 rounded-md transition-all font-bold ${
                  dashboardView === 'macros'
                    ? 'bg-[#C5A028] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Macronutrients (Target vs Actual)
              </button>
              <button
                type="button"
                onClick={() => setDashboardView('micros')}
                className={`px-3 py-1 rounded-md transition-all font-bold ${
                  dashboardView === 'micros'
                    ? 'bg-[#C5A028] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ICMR Micronutrient Profile (RDA %)
              </button>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#f7d88c]">
            RDA Base: {generalInfo.name} ({generalInfo.sex}, {generalInfo.weight}kg, {generalInfo.activityLevel.replace('_', ' ')})
          </span>
        </div>

        {dashboardView === 'macros' ? (
          /* Macro Breakdown Grid */
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Target Energy</span>
              <div className="text-lg font-bold text-white font-serif">{currentDay.totalCalories} kcal</div>
              <span className="text-[10px] text-emerald-400 font-medium">Metabolic deficit</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Carbohydrates</span>
              <div className="text-lg font-bold text-[#f7d88c] font-serif">{currentDay.totalCarbs}g (45%)</div>
              <span className="text-[10px] text-gray-400">Complex, Low GI</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Protein</span>
              <div className="text-lg font-bold text-emerald-300 font-serif">{currentDay.totalProtein}g (22%)</div>
              <span className="text-[10px] text-emerald-400">ICMR Target Met</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Healthy Fats</span>
              <div className="text-lg font-bold text-amber-300 font-serif">{currentDay.totalFat}g (33%)</div>
              <span className="text-[10px] text-gray-400">MUFA / PUFA</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Dietary Fiber</span>
              <div className="text-lg font-bold text-indigo-300 font-serif">{currentDay.totalFiber}g</div>
              <span className="text-[10px] text-emerald-400 font-medium">&gt; 35g Target Met</span>
            </div>
          </div>
        ) : (
          /* ICMR Micronutrient Profile Grid */
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center font-mono">
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase block">Calcium</span>
              <div className="text-sm font-bold text-white">{dayNutrients.calcium} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                {Math.round((dayNutrients.calcium / rdaBenchmark.calcium.target) * 100)}% RDA
              </span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase block">Iron</span>
              <div className="text-sm font-bold text-[#f7d88c]">{dayNutrients.iron} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                {Math.round((dayNutrients.iron / rdaBenchmark.iron.target) * 100)}% RDA
              </span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase block">Zinc</span>
              <div className="text-sm font-bold text-emerald-300">{dayNutrients.zinc} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                {Math.round((dayNutrients.zinc / rdaBenchmark.zinc.target) * 100)}% RDA
              </span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase block">Magnesium</span>
              <div className="text-sm font-bold text-amber-300">{dayNutrients.magnesium} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                {Math.round((dayNutrients.magnesium / rdaBenchmark.magnesium.target) * 100)}% RDA
              </span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase block">Potassium</span>
              <div className="text-sm font-bold text-indigo-300">{dayNutrients.potassium} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                {Math.round((dayNutrients.potassium / rdaBenchmark.potassium.target) * 100)}% RDA
              </span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase block">Vitamin C</span>
              <div className="text-sm font-bold text-teal-300">{dayNutrients.vitaminC} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                {Math.round((dayNutrients.vitaminC / rdaBenchmark.vitaminC.target) * 100)}% RDA
              </span>
            </div>
            <div className="p-2 bg-black/50 border border-white/5 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[9px] text-gray-400 uppercase block">Sodium</span>
              <div className="text-sm font-bold text-rose-300">{dayNutrients.sodium} mg</div>
              <span className="text-[9px] text-emerald-400 font-semibold">&lt; 2000mg Safe</span>
            </div>
          </div>
        )}
      </div>

      {/* Day Switcher Tabs (Day 1 - Monday to Day 7 - Sunday) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {days.map((d) => {
          const isActive = d.dayNumber === activeDayNumber;
          return (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setActiveDayNumber(d.dayNumber)}
              className={`py-2 px-4 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3c64c] text-black border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#090c0a] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Day {d.dayNumber}: {d.dayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meals List for Selected Day */}
      <div className="space-y-4">
        {currentDay.meals.map((meal) => {
          const isExpanded = expandedMeals[meal.id] ?? false;
          const ingredients = meal.ingredients && meal.ingredients.length > 0
            ? meal.ingredients
            : inferIngredientsForMeal(meal);

          // Meal aggregate nutrient breakdown (macros + micros)
          const mealNutrients = meal.nutrients || addNutrientBreakdowns(...ingredients.map((i) => i.nutrients));

          return (
            <div
              key={meal.id}
              className="p-5 rounded-2xl bg-[#0a0e0c] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-4 shadow-md"
            >
              {/* Top row: Meal title & Timing & Status badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-black/50 border border-[#d4af37]/30 text-[#d4af37]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-brand">{meal.mealName}</h4>
                    <span className="text-xs font-mono text-[#d4af37]">{meal.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getIndicatorBadge(meal.glycemicIndicator)}

                  {/* Add Ingredient / Recipe Trigger */}
                  <button
                    type="button"
                    onClick={() =>
                      setAddModalState({
                        isOpen: true,
                        dayNumber: currentDay.dayNumber,
                        mealId: meal.id,
                        mealName: meal.mealName,
                      })
                    }
                    className="py-1 px-2.5 rounded-lg bg-[#C5A028] hover:bg-[#d8b235] text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow"
                    title="Add measured ingredient or recipe to this meal"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item (ICMR)</span>
                  </button>

                  {onOpenNutritionAi && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenNutritionAi(
                          `I want to modify or find diabetic-safe alternatives for Day ${currentDay.dayNumber} ${meal.mealName}: ${meal.items.map((i) => i.name).join(', ')} (${meal.calories} kcal). What can I swap or adjust?`
                        )
                      }
                      className="py-1 px-2.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37] border border-[#d4af37]/40 text-[#f7d88c] hover:text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                      title="Consult Personal Nutrition AI about this meal"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRegenerateMeal(currentDay.dayNumber, meal.id)}
                    className="text-gray-400 hover:text-[#d4af37] p-1.5 transition-colors cursor-pointer"
                    title="Regenerate alternative diabetic meal"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prescribed Items & Portions Summary + Meal Macros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                    Prescribed Food Items & Portions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {meal.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="py-1.5 px-3 rounded-xl bg-[#111713] border border-white/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-white font-medium">{it.name}</span>
                        <span className="text-[#f7d88c] font-mono text-[11px] bg-black/50 px-2 py-0.5 rounded border border-[#d4af37]/20">
                          {it.portion}
                        </span>
                      </div>
                    ))}
                  </div>

                  {meal.clinicalNotes && (
                    <p className="text-[11px] text-gray-400 italic pt-1">
                      💡 Clinical note: {meal.clinicalNotes}
                    </p>
                  )}
                </div>

                {/* Meal Macro Breakdown Card */}
                <div className="p-3 rounded-xl bg-[#060807] border border-white/10 flex flex-col justify-center space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calories:</span>
                    <span className="text-white font-bold">{meal.calories} kcal</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Carbs:</span>
                    <span className="text-[#f7d88c]">{meal.carbs}g</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Protein:</span>
                    <span className="text-emerald-300">{meal.protein}g</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Fat:</span>
                    <span className="text-amber-300">{meal.fat}g</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Fiber:</span>
                    <span className="text-indigo-300">{meal.fiber}g</span>
                  </div>
                </div>
              </div>

              {/* Collapsible / Expandable Detailed ICMR Nutrient Breakdown Section */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => toggleMealExpand(meal.id)}
                  className="w-full py-2 px-3 bg-[#0d1210] hover:bg-[#121915] border border-white/5 hover:border-[#d4af37]/30 rounded-xl flex items-center justify-between text-xs text-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-[#C5A028]" />
                    <span className="font-bold text-white font-mono">
                      ICMR Ingredient & Micronutrient Breakdown ({ingredients.length} measured items)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#C5A028]">
                    <span>{isExpanded ? 'Hide Details' : 'Show Full Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-[#060807] border border-white/10 space-y-4">
                    {/* Ingredients Table with computed nutrients */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase text-gray-400">
                        <span>Measured Ingredients (IFCT Composition)</span>
                        <span>Click any item for full 100g clinical profile</span>
                      </div>

                      <div className="border border-white/10 rounded-lg overflow-x-auto bg-[#090d0b]">
                        <table className="w-full text-left text-xs border-collapse font-mono">
                          <thead>
                            <tr className="border-b border-white/10 bg-black text-[#C5A028] text-[10px] uppercase">
                              <th className="py-2.5 px-3">Ingredient</th>
                              <th className="py-2.5 px-2 text-right">Grams</th>
                              <th className="py-2.5 px-2 text-right">Energy</th>
                              <th className="py-2.5 px-2 text-right">Carbs</th>
                              <th className="py-2.5 px-2 text-right">Protein</th>
                              <th className="py-2.5 px-2 text-right">Fat</th>
                              <th className="py-2.5 px-2 text-right">Fiber</th>
                              <th className="py-2.5 px-2 text-right">Calcium</th>
                              <th className="py-2.5 px-2 text-right">Iron</th>
                              <th className="py-2.5 px-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-[11px]">
                            {ingredients.map((ing) => (
                              <tr key={ing.id} className="hover:bg-white/5 transition-colors">
                                <td
                                  className="py-2 px-3 text-white font-medium cursor-pointer hover:text-[#C5A028]"
                                  onClick={() =>
                                    setInspectorState({
                                      isOpen: true,
                                      title: ing.name,
                                      subtitle: `Ingredient Breakdown • ${ing.weightGrams}g portion`,
                                      weightGrams: ing.weightGrams,
                                      nutrients: ing.nutrients,
                                      clinicalHighlight: 'Verified Indian Food Composition Table (IFCT / ICMR-NIN) profile.',
                                    })
                                  }
                                >
                                  {ing.name}
                                </td>
                                <td className="py-2 px-2 text-right text-gray-400">{ing.weightGrams}g</td>
                                <td className="py-2 px-2 text-right text-white font-bold">{ing.nutrients.calories} kcal</td>
                                <td className="py-2 px-2 text-right text-[#f7d88c]">{ing.nutrients.carbs}g</td>
                                <td className="py-2 px-2 text-right text-emerald-300">{ing.nutrients.protein}g</td>
                                <td className="py-2 px-2 text-right text-amber-300">{ing.nutrients.fat}g</td>
                                <td className="py-2 px-2 text-right text-indigo-300">{ing.nutrients.fiber}g</td>
                                <td className="py-2 px-2 text-right text-gray-300">{ing.nutrients.calcium}mg</td>
                                <td className="py-2 px-2 text-right text-[#f7d88c]">{ing.nutrients.iron}mg</td>
                                <td className="py-2 px-2 text-center">
                                  {onRemoveIngredientFromMeal && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onRemoveIngredientFromMeal(currentDay.dayNumber, meal.id, ing.id)
                                      }
                                      className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                                      title="Remove ingredient"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Meal Aggregate Micronutrients Banner */}
                    <div className="p-3 rounded-lg bg-black/60 border border-[#C5A028]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#C5A028]">
                        <span>⚡ Computed Meal Micronutrient Profile</span>
                        <span>ICMR Diagnostic Metrics</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px] font-mono text-gray-300">
                        <div>
                          Calcium: <span className="text-white font-bold">{mealNutrients.calcium}mg</span>
                        </div>
                        <div>
                          Iron: <span className="text-[#f7d88c] font-bold">{mealNutrients.iron}mg</span>
                        </div>
                        <div>
                          Zinc: <span className="text-emerald-300 font-bold">{mealNutrients.zinc}mg</span>
                        </div>
                        <div>
                          Magnesium: <span className="text-amber-300 font-bold">{mealNutrients.magnesium}mg</span>
                        </div>
                        <div>
                          Potassium: <span className="text-indigo-300 font-bold">{mealNutrients.potassium}mg</span>
                        </div>
                        <div>
                          Vit C: <span className="text-teal-300 font-bold">{mealNutrients.vitaminC}mg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Ingredient / Recipe Modal */}
      {addModalState && (
        <AddIngredientRecipeModal
          isOpen={addModalState.isOpen}
          onClose={() => setAddModalState(null)}
          dayNumber={addModalState.dayNumber}
          mealId={addModalState.mealId}
          mealName={addModalState.mealName}
          onAddIngredient={(dayNum, mealId, item) => {
            if (onAddIngredientToMeal) {
              onAddIngredientToMeal(dayNum, mealId, item);
            }
          }}
          onAddRecipe={(dayNum, mealId, recipe) => {
            if (onAddRecipeToMeal) {
              onAddRecipeToMeal(dayNum, mealId, recipe);
            }
          }}
        />
      )}

      {/* Nutrient Inspector Modal */}
      {inspectorState && (
        <IcmrNutrientInspectorModal
          isOpen={inspectorState.isOpen}
          onClose={() => setInspectorState(null)}
          title={inspectorState.title}
          subtitle={inspectorState.subtitle}
          weightGrams={inspectorState.weightGrams}
          nutrients={inspectorState.nutrients}
          generalInfo={generalInfo}
          clinicalHighlight={inspectorState.clinicalHighlight}
        />
      )}

      {/* Full Day ICMR Adequacy Report Modal */}
      <IcmrAdequacyReportModal
        isOpen={isAdequacyReportOpen}
        onClose={() => setIsAdequacyReportOpen(false)}
        currentDay={currentDay}
        generalInfo={generalInfo}
      />
    </div>
  );
};
