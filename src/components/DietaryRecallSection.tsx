import React, { useMemo, useState } from 'react';
import { DietaryRecallItem, NutrientGapAnalysis } from '../types';
import {
  Clock,
  Plus,
  Trash2,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  Scale,
  Utensils,
  BookOpen,
  Sliders,
  CheckCircle2,
  Info,
  AlertTriangle,
  Database,
  ChevronRight,
} from 'lucide-react';
import { calculateNutritionalTotalsAndGaps } from '../utils/nutritionalCalculator';
import { IcmrRecipeIngredientEditor } from './IcmrRecipeIngredientEditor';
import { calculateCustomRecipeTotals } from '../utils/icmrCookingCalculator';
import {
  decomposeTextToIcmrIngredients,
  ICMR_RAW_INGREDIENTS,
  RecipeIngredientPortion,
  calculateIngredientsNutritionalTotals,
} from '../utils/icmrRecipeEngine';

interface DietaryRecallSectionProps {
  recallItems: DietaryRecallItem[];
  nutrientGaps?: NutrientGapAnalysis;
  onUpdateRecall: (id: string, updated: Partial<DietaryRecallItem>) => void;
  onAddRecallRow: () => void;
  onDeleteRecallRow: (id: string) => void;
  onNavigateToGap?: () => void;
}

// Popular ICMR-standard dishes for one-click verification
const QUICK_ICMR_DISHES = [
  { label: 'Idli (2 pcs: Urad Dal 30g + Rice 30g + Fenugreek 5g)', food: '2 Idlis with chutney', qty: '2 nos (60g raw grain-pulse)' },
  { label: 'Dosa (2 pcs: Rice 40g + Urad Dal 20g + Oil 5g)', food: '2 Plain Dosas', qty: '2 nos (65g raw grain-pulse)' },
  { label: 'Moong Khichdi (Moong 40g + Rice 40g + Ghee 5g)', food: 'Moong Dal Khichdi with ghee', qty: '1 medium bowl (180g cooked)' },
  { label: 'Oats Porridge (Oats 40g + Milk 150ml + Almonds 10g)', food: 'Rolled Oats Porridge with cow milk', qty: '1 bowl (200ml)' },
  { label: 'Ragi Roti (Ragi 45g + Onion 20g + Curry Leaves)', food: '2 Ragi Rotis with coriander chutney', qty: '2 rotis (50g raw flour)' },
  { label: 'Toor Dal Sambar (Toor 30g + Drumstick 40g + Spices)', food: 'Vegetable Sambar (drumstick & shallots)', qty: '1.5 katoris (150ml)' },
];

export const DietaryRecallSection: React.FC<DietaryRecallSectionProps> = ({
  recallItems,
  onUpdateRecall,
  onAddRecallRow,
  onDeleteRecallRow,
  onNavigateToGap,
}) => {
  // Expanded item state for detailed ICMR breakdown inspector
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  // Active ingredient editor state (opened via '>' symbol)
  const [ingredientEditorItemId, setIngredientEditorItemId] = useState<string | null>(null);

  // Real-time recalculated totals and nutrient gaps from the nutritionalCalculator utility
  const liveCalculation = useMemo(() => {
    return calculateNutritionalTotalsAndGaps(recallItems);
  }, [recallItems]);

  const { totals, macroRatios, gaps, summary } = liveCalculation;

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
            Module 14 • ICMR Research-Based 24-Hour Recall
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            24-Hour Dietary Recall & Scientific Recipe Engine
          </h2>
          <p className="text-xs text-gray-400 max-w-3xl mt-1">
            Automated research-based calculation: Dishes typed (e.g. <em>Idli</em>) are scientifically decomposed into exact constituent raw ingredients (<em>Urad Dal 30g + Raw Rice 30g + Fenugreek 5g + Oil 2g</em>), state (raw/fermented/cooked), cooking method, and portion scaling to feed precision ICMR 2024 gap analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToGap && (
            <button
              type="button"
              onClick={onNavigateToGap}
              className="px-3.5 py-1.5 bg-[#1a0c2e] hover:bg-[#2b154b] text-[#C084FC] border border-[#7E22CE] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>View Nutrient Gap</span>
            </button>
          )}
          <button
            type="button"
            onClick={onAddRecallRow}
            className="px-4 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.6)] cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Meal Phase</span>
          </button>
        </div>
      </div>

      {/* ICMR Calculation AI Scientific Notice */}
      <div className="p-3.5 bg-[#0e071c] border-2 border-[#7E22CE] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#270e44] border border-[#7E22CE] flex items-center justify-center text-[#C084FC] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>ICMR-NIN IFCT Precision Calculation Engine</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-black font-black rounded font-mono">
                Touch &gt; for Ingredient Table
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Strictly calculates based on food quantity and cooking method only. Avoids assumptions of other recipes. Touch the <strong className="text-amber-300 font-bold">&gt;</strong> symbol next to any meal item to open the interactive table and fill custom ingredients, grams, and cooking methods.
            </p>
          </div>
        </div>

        {/* Quick Dishes Shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-gray-400 uppercase font-bold mr-1">Quick Add:</span>
          {QUICK_ICMR_DISHES.slice(0, 3).map((dish, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (recallItems.length > 0) {
                  onUpdateRecall(recallItems[0].id, {
                    foodItemsConsumed: dish.food,
                    quantity: dish.qty,
                  });
                } else {
                  onAddRecallRow();
                }
              }}
              className="px-2 py-1 bg-black/60 hover:bg-[#7E22CE]/30 border border-purple-800/60 text-[#C084FC] hover:text-white rounded text-[10px] font-mono cursor-pointer transition-all"
              title={dish.label}
            >
              + {dish.food?.split(' ')[0] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* 24-Hour Recall Table & Interactive Row Cards */}
      <div className="space-y-3">
        {recallItems.map((item, index) => {
          const decomp = decomposeTextToIcmrIngredients(item.foodItemsConsumed || '', item.quantity || '');
          const isExpanded = expandedItemId === item.id;
          const recipe = decomp.matchedRecipe;

          return (
            <div
              key={item.id}
              className={`bg-[#0d0617] border-2 transition-all rounded-xl overflow-hidden ${
                isExpanded ? 'border-[#7E22CE] shadow-[0_0_20px_rgba(126,34,206,0.3)]' : 'border-white/10 hover:border-[#7E22CE]/60'
              }`}
            >
              {/* Primary Input Row */}
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Meal Time / Phase */}
                <div className="sm:col-span-3">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Meal Phase / Time
                  </label>
                  <div className="flex items-center gap-2 bg-black border border-white/20 p-2 rounded focus-within:border-[#7E22CE]">
                    <Clock className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
                    <input
                      type="text"
                      value={item.mealTime ?? ''}
                      onChange={(e) => onUpdateRecall(item.id, { mealTime: e.target.value })}
                      className="w-full bg-transparent text-white font-bold focus:outline-none text-xs"
                      placeholder="e.g. 08:30 AM Breakfast"
                    />
                  </div>
                </div>

                {/* Food Items Consumed */}
                <div className="sm:col-span-5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">
                      Food & Recipe Consumed
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setIngredientEditorItemId(
                          ingredientEditorItemId === item.id ? null : item.id
                        )
                      }
                      className="text-[9px] text-amber-300 hover:text-amber-200 font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <span>Touch &gt; for Ingredient Table</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={item.foodItemsConsumed ?? ''}
                      onChange={(e) => onUpdateRecall(item.id, { foodItemsConsumed: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white p-2 rounded focus:border-[#7E22CE] focus:outline-none text-xs font-semibold"
                      placeholder="e.g. Raw milled rice, or custom recipe"
                    />
                    {/* The requested > symbol button */}
                    <button
                      type="button"
                      id={`btn-open-ingredients-${item.id}`}
                      onClick={() =>
                        setIngredientEditorItemId(
                          ingredientEditorItemId === item.id ? null : item.id
                        )
                      }
                      className={`px-3 py-2 rounded border font-black text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        ingredientEditorItemId === item.id ||
                        (item.customIngredients && item.customIngredients.length > 0)
                          ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                          : 'bg-[#210c3d] hover:bg-[#7E22CE] text-amber-300 hover:text-white border-purple-600/70'
                      }`}
                      title="Touch '>' to show and fill Ingredient Table, Quantity & Cooking Methods (ICMR Based)"
                    >
                      <span className="text-base font-black">&gt;</span>
                      <span className="text-[10px] uppercase font-mono font-bold hidden md:inline">
                        {item.customIngredients && item.customIngredients.length > 0
                          ? `${item.customIngredients.length} Ingr`
                          : 'Table'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Quantity / Measure */}
                <div className="sm:col-span-3">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Portion / Household Measure
                  </label>
                  <input
                    type="text"
                    value={item.quantity ?? ''}
                    onChange={(e) => onUpdateRecall(item.id, { quantity: e.target.value })}
                    className="w-full bg-black border border-white/20 text-[#C084FC] p-2 rounded focus:border-[#7E22CE] focus:outline-none text-xs font-mono"
                    placeholder="e.g. 2 pieces (60g raw grain)"
                  />
                </div>

                {/* Action Buttons */}
                <div className="sm:col-span-1 flex items-center justify-end gap-1 pt-4 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className={`p-2 rounded border transition-all cursor-pointer ${
                      isExpanded
                        ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                        : 'bg-black/60 text-[#C084FC] border-purple-800/50 hover:bg-[#7E22CE]/20'
                    }`}
                    title="View & Edit Constituent ICMR Raw Ingredients & Cooking Method"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRecallRow(item.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Delete Row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive ICMR Recipe & Ingredient Table (Opened via '>') */}
              {ingredientEditorItemId === item.id && (
                <div className="border-t-2 border-amber-400/80 bg-[#120822] p-3 sm:p-4">
                  <IcmrRecipeIngredientEditor
                    recipeName={item.foodItemsConsumed || 'Custom Recipe'}
                    initialIngredients={item.customIngredients || []}
                    initialCookingMethod={item.cookingMethod || 'Raw'}
                    onSave={(ingredients, cookingMethod) => {
                      onUpdateRecall(item.id, {
                        customIngredients: ingredients,
                        cookingMethod: cookingMethod,
                        hasCustomIngredients: true,
                      });
                      setIngredientEditorItemId(null);
                    }}
                    onClose={() => setIngredientEditorItemId(null)}
                  />
                </div>
              )}

              {/* Scientific ICMR Ingredient Summary Strip */}
              {(() => {
                const hasCustom = Boolean(item.customIngredients && item.customIngredients.length > 0);
                const customTotals = hasCustom
                  ? calculateCustomRecipeTotals(item.customIngredients!, item.cookingMethod)
                  : null;

                return (
                  <div className="px-3 sm:px-4 py-2 bg-black/50 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded border font-bold uppercase text-[9px] tracking-wider flex items-center gap-1 ${
                          hasCustom
                            ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                            : decomp.ingredients.length > 0 || (item.foodBeverage && item.foodBeverage.toLowerCase().includes('water'))
                            ? 'bg-purple-950/80 border-purple-500/50 text-purple-200'
                            : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                        }`}
                      >
                        <Utensils className="w-3 h-3 text-[#C084FC]" />
                        {hasCustom ? `Cooking: ${item.cookingMethod || 'Raw'}` : decomp.cookingMethod}
                      </span>

                      <span className="text-gray-300 font-mono">
                        <strong className="text-white">
                          {hasCustom ? 'ICMR Table:' : 'IFCT Basis:'}
                        </strong>{' '}
                        <span
                          className={
                            hasCustom
                              ? 'text-amber-300 font-bold'
                              : decomp.ingredients.length > 0 || (item.foodBeverage && item.foodBeverage.toLowerCase().includes('water'))
                              ? 'text-[#C084FC] font-semibold'
                              : 'text-amber-400 font-semibold'
                          }
                        >
                          {hasCustom ? customTotals?.summaryText : decomp.displaySummary}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {hasCustom && customTotals ? (
                        <span className="text-gray-300 font-mono">
                          <strong className="text-emerald-400 font-bold">
                            {customTotals.energyKcal} kcal
                          </strong>{' '}
                          <span className="text-[10px] text-gray-400">({customTotals.energyKj} kJ)</span> •{' '}
                          <span className="text-purple-300 font-semibold">{customTotals.proteinG}g Protein</span> •{' '}
                          <span className="text-amber-300 font-semibold">{customTotals.carbsG}g Carbs</span> •{' '}
                          <span className="text-blue-300 font-semibold">{customTotals.fatG}g Fat</span> •{' '}
                          <span className="text-teal-300 font-semibold">{customTotals.fiberG}g Fiber</span>
                        </span>
                      ) : decomp.ingredients.length > 0 || (item.foodBeverage && item.foodBeverage.toLowerCase().includes('water')) ? (
                        <span className="text-gray-400 font-mono">
                          <strong className="text-emerald-400">{decomp.calculatedNutrients.calories} kcal</strong> •{' '}
                          <span className="text-purple-300">{decomp.calculatedNutrients.protein}g Protein</span> •{' '}
                          <span className="text-amber-300">{decomp.calculatedNutrients.carbs}g Carbs</span> •{' '}
                          <span className="text-blue-300">{decomp.calculatedNutrients.fiber}g Fiber</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-mono text-xs font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Verified nutrient data unavailable
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setIngredientEditorItemId(
                            ingredientEditorItemId === item.id ? null : item.id
                          )
                        }
                        className="text-[10px] font-bold text-amber-300 hover:text-white uppercase tracking-wider flex items-center gap-1 underline cursor-pointer"
                        title="Touch to edit ICMR Ingredient Table, quantity and cooking method"
                      >
                        <span>&gt; {hasCustom ? 'Edit Table' : 'Fill Ingredients'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="text-[10px] font-bold text-[#C084FC] hover:text-white uppercase tracking-wider flex items-center gap-1 underline"
                      >
                        {isExpanded ? 'Hide Breakdown' : 'Decompose & Audit'}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Expandable Sub-Drawer: Detailed Scientific ICMR Breakdown */}
              {isExpanded && (
                <div className="p-4 bg-[#140a24] border-t-2 border-[#7E22CE] space-y-4 animate-in fade-in duration-150">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C084FC]" />
                        <span>
                          {recipe ? recipe.dishName : item.foodItemsConsumed || 'Custom Recipe'}{' '}
                          — ICMR Ingredient Breakdown
                        </span>
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {recipe?.therapeuticMechanism ||
                          'Nutrients calculated from standard ICMR-NIN Indian Food Composition Tables (IFCT).'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Portion Multiplier:</span>
                      {[0.5, 1, 1.5, 2, 3].map((mult) => (
                        <button
                          key={mult}
                          type="button"
                          onClick={() => {
                            const newQty = `${mult} portion (${mult * (recipe?.yieldCookedWeightGrams || 100)}g)`;
                            onUpdateRecall(item.id, { quantity: newQty });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                            Math.abs(decomp.portionMultiplier - mult) < 0.1
                              ? 'bg-[#7E22CE] text-white border-purple-400'
                              : 'bg-black/60 text-gray-300 border-white/20 hover:border-purple-400'
                          }`}
                        >
                          {mult}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Constituent Raw Ingredients Table or Unverified Notice */}
                  {decomp.ingredients.length === 0 ? (
                    <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded flex items-start gap-3 text-xs">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                          Verified Nutrient Data Unavailable
                        </h5>
                        <p className="text-gray-300 mt-1 leading-relaxed">
                          The food item &quot;{item.foodBeverage}&quot; does not have an exact corresponding laboratory entry in the ICMR-NIN IFCT 2017 / NVIF 2017 database.
                          In accordance with strict clinical protocol, no AI-estimated, generic, internet, or invented values are substituted.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-purple-900/60 bg-black/60 text-[#A855F7] font-mono font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Ingredient Name (IFCT 2024)</th>
                            <th className="py-2 px-3 w-28 text-center">Raw Grams</th>
                            <th className="py-2 px-3 w-32">State</th>
                            <th className="py-2 px-3 w-36">Cooking Method</th>
                            <th className="py-2 px-2 text-right">Energy</th>
                            <th className="py-2 px-2 text-right">Protein</th>
                            <th className="py-2 px-2 text-right">Carbs</th>
                            <th className="py-2 px-2 text-right">Fiber</th>
                            <th className="py-2 px-2 text-right">Iron</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {decomp.ingredients.map((ing, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2 px-3">
                                <span className="font-bold text-white">{ing.name}</span>
                                {ing.notes && (
                                  <span className="block text-[10px] text-gray-400 font-sans">{ing.notes}</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className="px-2 py-0.5 bg-black border border-purple-500/40 text-[#C084FC] rounded font-bold">
                                  {ing.rawGrams} g
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-800 text-purple-300 text-[10px] rounded">
                                  {ing.state}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-gray-300 text-[11px]">
                                  {ing.cookingMethod || decomp.cookingMethod}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right text-emerald-400 font-bold">{ing.calories || '--'}</td>
                              <td className="py-2 px-2 text-right text-purple-300">{ing.protein || '--'}g</td>
                              <td className="py-2 px-2 text-right text-amber-300">{ing.carbs || '--'}g</td>
                              <td className="py-2 px-2 text-right text-blue-300">{ing.fiber || '--'}g</td>
                              <td className="py-2 px-2 text-right text-red-300">{ing.iron || '--'}mg</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-[#7E22CE] bg-black/80 font-mono font-bold text-white text-xs">
                            <td className="py-2.5 px-3 uppercase tracking-wider text-[#A855F7]">
                              Total Scientific Sum
                            </td>
                            <td className="py-2.5 px-3 text-center text-[#C084FC]">
                              {decomp.calculatedNutrients.totalRawGrams} g
                            </td>
                            <td colSpan={2} className="py-2.5 px-3 text-gray-400 font-sans text-[10px]">
                              Standard ICMR Yield: Raw to Cooked Ratio applied
                            </td>
                            <td className="py-2.5 px-2 text-right text-emerald-400">
                              {decomp.calculatedNutrients.calories} kcal
                            </td>
                            <td className="py-2.5 px-2 text-right text-purple-300">
                              {decomp.calculatedNutrients.protein}g
                            </td>
                            <td className="py-2.5 px-2 text-right text-amber-300">
                              {decomp.calculatedNutrients.carbs}g
                            </td>
                            <td className="py-2.5 px-2 text-right text-blue-300">
                              {decomp.calculatedNutrients.fiber}g
                            </td>
                            <td className="py-2.5 px-2 text-right text-red-300">
                              {decomp.calculatedNutrients.iron}mg
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {/* Research Footnote on Cooking Method & Biological Value */}
                  <div className="p-3 bg-black/40 border border-purple-900/50 rounded-lg flex items-start gap-2.5 text-[11px] text-gray-300">
                    <Info className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">ICMR Research Principle:</strong>{' '}
                      Cooking method substantially alters biological value. Steaming (e.g. Idli) minimizes Maillard reaction advanced glycation end-products (AGEs), protects B-vitamins, and fermentation elevates lysine bioavailability and digestible protein fraction.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Recalculated Totals & Nutrient Gaps Panel */}
      <div className="bg-[#0e071a] border-2 border-[#7E22CE] rounded-xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C084FC] animate-pulse" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Real-Time Recalculated Totals (ICMR 2024 Engine)
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#7E22CE]/40 border border-[#7E22CE] text-[#C084FC] font-mono rounded">
              Automated Summation
            </span>
          </div>
          <div className="text-[11px] text-gray-300">
            Overall Adequacy:{' '}
            <span className="font-bold text-emerald-400">{summary.overallAdequacyPct}%</span> | Critical
            Deficits: <span className="font-bold text-red-400">{summary.criticalDeficitsCount}</span>
          </div>
        </div>

        {/* Macro Totals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
          <div className="bg-black/60 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Energy</span>
            <div className="text-lg font-black text-white mt-0.5">
              {totals.calories} <span className="text-[10px] font-normal text-gray-400">kcal</span>
            </div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 1850</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">
              Protein ({macroRatios.proteinPercent}%)
            </span>
            <div className="text-lg font-black text-white mt-0.5">
              {totals.protein} <span className="text-[10px] font-normal text-gray-400">g</span>
            </div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 60g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">
              Carbs ({macroRatios.carbsPercent}%)
            </span>
            <div className="text-lg font-black text-white mt-0.5">
              {totals.carbs} <span className="text-[10px] font-normal text-gray-400">g</span>
            </div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 220g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">
              Fats ({macroRatios.fatPercent}%)
            </span>
            <div className="text-lg font-black text-white mt-0.5">
              {totals.fat} <span className="text-[10px] font-normal text-gray-400">g</span>
            </div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 45g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Fiber</span>
            <div className="text-lg font-black text-white mt-0.5">
              {totals.fiber} <span className="text-[10px] font-normal text-gray-400">g</span>
            </div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 35g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Fluid / Water</span>
            <div className="text-lg font-black text-white mt-0.5">
              {totals.fluidLiters} <span className="text-[10px] font-normal text-gray-400">L</span>
            </div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 2.8L</span>
          </div>
        </div>

        {/* Real-time Nutrient Gaps Quick Bar */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Nutrient Gaps:</span>
            {gaps.slice(0, 6).map((gap) => (
              <span
                key={gap.id}
                className={`px-2 py-0.5 font-mono border text-[10px] rounded flex items-center gap-1 ${
                  gap.status === 'Critical Deficit'
                    ? 'bg-red-950/50 border-red-500/50 text-red-300'
                    : gap.status === 'Moderate Deficit'
                    ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                    : 'bg-green-950/50 border-green-500/50 text-green-300'
                }`}
              >
                <span>{gap.nutrient}:</span>
                <span className="font-bold">
                  {gap.gap > 0 ? `+${gap.gap}` : gap.gap}
                  {gap.unit}
                </span>
                <span>({gap.adequacyPct}%)</span>
              </span>
            ))}
          </div>

          {onNavigateToGap && (
            <button
              type="button"
              onClick={onNavigateToGap}
              className="text-[11px] font-bold text-[#C084FC] hover:text-white underline transition-colors cursor-pointer"
            >
              Open Full 10-Nutrient Gap Analysis →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
