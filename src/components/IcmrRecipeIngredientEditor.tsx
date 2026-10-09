import React, { useState, useMemo } from 'react';
import { CustomRecipeIngredient, IcmrCookingMethod } from '../types';
import {
  calculateIcmrIngredientNutrients,
  calculateCustomRecipeTotals,
  searchIcmrFoodDatabase,
  IcmrFoodSearchResult,
} from '../utils/icmrCookingCalculator';
import { IFCT_TABLE1_DATABASE } from '../utils/ifctTable1Data';
import {
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Calculator,
  Search,
  AlertCircle,
  X,
  Sparkles,
  Flame,
  Info,
  Scale,
  UtensilsCrossed,
} from 'lucide-react';

interface IcmrRecipeIngredientEditorProps {
  recipeName: string;
  initialIngredients?: CustomRecipeIngredient[];
  initialCookingMethod?: IcmrCookingMethod;
  onSave: (ingredients: CustomRecipeIngredient[], cookingMethod: IcmrCookingMethod) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const COOKING_METHODS: IcmrCookingMethod[] = [
  'Raw',
  'Boiled / Simmered',
  'Steamed',
  'Dry Roasted / Puffed',
  'Pressure Cooked',
  'Sautéed / Tadka',
  'Shallow Fried / Pan Fried',
  'Deep Fried',
  'Fermented',
  'Baked',
];

export const IcmrRecipeIngredientEditor: React.FC<IcmrRecipeIngredientEditorProps> = ({
  recipeName,
  initialIngredients = [],
  initialCookingMethod = 'Steamed',
  onSave,
  onClose,
  isModal = false,
}) => {
  const [ingredients, setIngredients] = useState<CustomRecipeIngredient[]>(() => {
    if (initialIngredients.length > 0) return initialIngredients;

    // If initial is empty, provide a clean starter ingredient based on user's recipe or Raw Milled Rice (A015) 30g canonical example
    const defaultFood = recipeName.toLowerCase().includes('rice')
      ? 'A015'
      : recipeName.toLowerCase().includes('idli')
      ? 'A015'
      : 'A015';

    const calc = calculateIcmrIngredientNutrients(defaultFood, 30, initialCookingMethod);
    return [
      {
        id: `ing-${Date.now()}-1`,
        foodCode: calc.foodCode,
        name: calc.name,
        quantityGrams: 30,
        cookingMethod: initialCookingMethod,
        per100g: calc.per100g,
        calculated: calc.calculated,
      },
    ];
  });

  const [overallCookingMethod, setOverallCookingMethod] = useState<IcmrCookingMethod>(initialCookingMethod);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIngredientIndex, setActiveIngredientIndex] = useState<number | null>(null);
  const [showFormulaProof, setShowFormulaProof] = useState(true);

  // Search results for ingredient selector
  const searchResults = useMemo(() => {
    return searchIcmrFoodDatabase(searchQuery, 15);
  }, [searchQuery]);

  // Aggregate ICMR Totals
  const totals = useMemo(() => {
    return calculateCustomRecipeTotals(ingredients, overallCookingMethod);
  }, [ingredients, overallCookingMethod]);

  // Update ingredient quantity
  const handleUpdateQuantity = (index: number, newGrams: number) => {
    const safeGrams = Math.max(0, Math.round(newGrams));
    setIngredients((prev) => {
      const copy = [...prev];
      const target = copy[index];
      const recalculated = calculateIcmrIngredientNutrients(
        target.foodCode || target.name,
        safeGrams,
        target.cookingMethod
      );
      copy[index] = {
        ...target,
        quantityGrams: safeGrams,
        calculated: recalculated.calculated,
      };
      return copy;
    });
  };

  // Update ingredient cooking method
  const handleUpdateMethod = (index: number, newMethod: IcmrCookingMethod) => {
    setIngredients((prev) => {
      const copy = [...prev];
      const target = copy[index];
      const recalculated = calculateIcmrIngredientNutrients(
        target.foodCode || target.name,
        target.quantityGrams,
        newMethod
      );
      copy[index] = {
        ...target,
        cookingMethod: newMethod,
        calculated: recalculated.calculated,
      };
      return copy;
    });
  };

  // Select food from search for an ingredient
  const handleSelectFood = (index: number, food: IcmrFoodSearchResult) => {
    setIngredients((prev) => {
      const copy = [...prev];
      const target = copy[index];
      const recalculated = calculateIcmrIngredientNutrients(
        food.code,
        target.quantityGrams,
        target.cookingMethod
      );
      copy[index] = {
        ...target,
        foodCode: food.code,
        name: food.name,
        per100g: recalculated.per100g,
        calculated: recalculated.calculated,
      };
      return copy;
    });
    setActiveIngredientIndex(null);
    setSearchQuery('');
  };

  // Add new blank ingredient row
  const handleAddIngredient = () => {
    const defaultCode = 'A015'; // Raw milled rice
    const calc = calculateIcmrIngredientNutrients(defaultCode, 30, overallCookingMethod);
    setIngredients((prev) => [
      ...prev,
      {
        id: `ing-${Date.now()}-${prev.length + 1}`,
        foodCode: calc.foodCode,
        name: calc.name,
        quantityGrams: 30,
        cookingMethod: overallCookingMethod,
        per100g: calc.per100g,
        calculated: calc.calculated,
      },
    ]);
  };

  // Remove ingredient row
  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Apply overall cooking method to all rows
  const handleApplyOverallCookingMethod = (method: IcmrCookingMethod) => {
    setOverallCookingMethod(method);
    setIngredients((prev) =>
      prev.map((ing) => {
        const recalculated = calculateIcmrIngredientNutrients(
          ing.foodCode || ing.name,
          ing.quantityGrams,
          method
        );
        return {
          ...ing,
          cookingMethod: method,
          calculated: recalculated.calculated,
        };
      })
    );
  };

  const handleSaveAndApply = () => {
    onSave(ingredients, overallCookingMethod);
    if (onClose) onClose();
  };

  return (
    <div className={`space-y-4 text-xs ${isModal ? 'p-4 sm:p-6 max-h-[85vh] overflow-y-auto' : 'p-4 bg-[#120822] border-2 border-[#7E22CE] rounded-xl'}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#7E22CE] text-white text-[10px] font-black uppercase tracking-wider rounded">
              ICMR IFCT 2017
            </span>
            <span className="text-[11px] font-mono text-purple-300">
              Zero Assumptions Engine
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#C084FC]" />
            <span>Ingredient Table: {recipeName || 'Custom Recipe'}</span>
          </h3>
          <p className="text-[11px] text-gray-300 mt-0.5">
            Calculation is derived <strong className="text-amber-300">strictly</strong> from the exact food items, weights, and cooking methods you enter below. No assumptions of other recipes or unseen ingredients are made.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Recipe Cooking Method Selector */}
      <div className="p-3 bg-black/60 border border-purple-800/60 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">
              Primary Recipe Cooking Method:
            </span>
            <span className="text-xs font-bold text-white">
              {overallCookingMethod}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {COOKING_METHODS.slice(0, 6).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleApplyOverallCookingMethod(m)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                overallCookingMethod === m
                  ? 'bg-[#7E22CE] text-white shadow-[0_0_8px_rgba(126,34,206,0.6)]'
                  : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 border border-purple-800/40'
              }`}
            >
              {m.split(' ')[0]}
            </button>
          ))}
          <select
            value={overallCookingMethod}
            onChange={(e) => handleApplyOverallCookingMethod(e.target.value as IcmrCookingMethod)}
            className="px-2 py-1 bg-black border border-purple-700 text-purple-200 rounded text-[10px] font-bold focus:outline-none"
          >
            {COOKING_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Ingredient Table */}
      <div className="overflow-x-auto rounded-lg border border-purple-900/60 bg-black/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-purple-900/60 bg-[#1a0c2e] text-[#C084FC] font-mono font-bold uppercase text-[9px] tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3 min-w-[180px]">Food Ingredient (IFCT 2017)</th>
              <th className="py-2.5 px-3 w-32 text-center">Quantity (g)</th>
              <th className="py-2.5 px-3 w-40">Cooking Method</th>
              <th className="py-2.5 px-2 text-right">Energy</th>
              <th className="py-2.5 px-2 text-right">Protein</th>
              <th className="py-2.5 px-2 text-right">Fat</th>
              <th className="py-2.5 px-2 text-right">Carbs</th>
              <th className="py-2.5 px-2 text-right">Fibre</th>
              <th className="py-2.5 px-2 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-950/60 font-mono">
            {ingredients.map((ing, index) => {
              const isSearchingThis = activeIngredientIndex === index;

              return (
                <React.Fragment key={ing.id}>
                  <tr className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-2.5 px-3 text-center text-gray-500 font-bold">
                      {index + 1}
                    </td>

                    {/* Food Name & Search */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            {ing.foodCode && (
                              <span className="px-1.5 py-0.2 bg-purple-900/80 text-purple-200 text-[9px] font-bold rounded">
                                {ing.foodCode}
                              </span>
                            )}
                            <span className="font-bold text-white text-xs">
                              {ing.name}
                            </span>
                          </div>
                          {ing.calculated.cookingAdjustmentNote && (
                            <span className="text-[10px] text-gray-400 font-sans block mt-0.5">
                              {ing.calculated.cookingAdjustmentNote}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveIngredientIndex(isSearchingThis ? null : index);
                            setSearchQuery('');
                          }}
                          className="p-1 px-1.5 bg-black/60 hover:bg-[#7E22CE] text-purple-300 hover:text-white rounded border border-purple-800/40 text-[10px] flex items-center gap-1 transition-all"
                          title="Search and change IFCT food code"
                        >
                          <Search className="w-3 h-3" />
                          <span>Change</span>
                        </button>
                      </div>
                    </td>

                    {/* Quantity (Grams) */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-black border border-purple-600/50 rounded p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, ing.quantityGrams - 10)}
                          className="px-1.5 py-0.5 bg-purple-950/60 hover:bg-purple-800 text-white rounded text-[10px] font-bold"
                          title="Minus 10g"
                        >
                          -10
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={ing.quantityGrams}
                          onChange={(e) => handleUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                          className="w-14 bg-transparent text-center text-[#C084FC] font-black focus:outline-none text-xs"
                        />
                        <span className="text-gray-400 text-[10px]">g</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(index, ing.quantityGrams + 10)}
                          className="px-1.5 py-0.5 bg-purple-950/60 hover:bg-purple-800 text-white rounded text-[10px] font-bold"
                          title="Plus 10g"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Cooking Method */}
                    <td className="py-2.5 px-3">
                      <select
                        value={ing.cookingMethod}
                        onChange={(e) => handleUpdateMethod(index, e.target.value as IcmrCookingMethod)}
                        className="w-full bg-black border border-purple-800/60 text-gray-200 p-1.5 rounded text-[11px] font-semibold focus:border-[#7E22CE] focus:outline-none"
                      >
                        {COOKING_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Calculated Energy */}
                    <td className="py-2.5 px-2 text-right">
                      <span className="font-bold text-emerald-400">
                        {ing.calculated.energyKcal} kcal
                      </span>
                      <span className="block text-[9px] text-gray-400">
                        {ing.calculated.energyKj} kJ
                      </span>
                    </td>

                    {/* Calculated Protein */}
                    <td className="py-2.5 px-2 text-right text-purple-300 font-bold">
                      {ing.calculated.proteinG}g
                    </td>

                    {/* Calculated Fat */}
                    <td className="py-2.5 px-2 text-right text-amber-300 font-bold">
                      {ing.calculated.fatG}g
                    </td>

                    {/* Calculated Carbs */}
                    <td className="py-2.5 px-2 text-right text-sky-300 font-bold">
                      {ing.calculated.carbsG}g
                    </td>

                    {/* Calculated Fibre */}
                    <td className="py-2.5 px-2 text-right text-teal-300 font-bold">
                      {ing.calculated.fiberG}g
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete Ingredient"
                        disabled={ingredients.length <= 1}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>

                  {/* Dropdown Food Search Panel for this row */}
                  {isSearchingThis && (
                    <tr>
                      <td colSpan={10} className="p-3 bg-[#1e0d36] border-y border-purple-500/40">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-[#C084FC]" />
                            <input
                              type="text"
                              autoFocus
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Type food name or code (e.g., A015, rice, urad, oats, ragi, milk, oil)..."
                              className="w-full bg-black border border-purple-500 text-white p-2 rounded text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setActiveIngredientIndex(null)}
                              className="px-2 py-1 bg-black/60 text-gray-400 hover:text-white rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-purple-900/30">
                            {searchResults.map((food) => (
                              <button
                                key={food.code}
                                type="button"
                                onClick={() => handleSelectFood(index, food)}
                                className="w-full p-2 text-left hover:bg-[#7E22CE]/30 flex items-center justify-between text-xs transition-colors rounded"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-[#7E22CE] text-white font-mono text-[9px] font-bold rounded">
                                      {food.code}
                                    </span>
                                    <span className="font-bold text-white">{food.name}</span>
                                    <span className="text-[10px] text-purple-300">({food.category})</span>
                                  </div>
                                </div>
                                <div className="text-[10px] text-gray-300 font-mono">
                                  {food.energyKcal} kcal • {food.proteinG}g P • {food.carbsG}g C • {food.fatG}g F (per 100g)
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Table Totals Footer */}
          <tfoot>
            <tr className="border-t-2 border-[#7E22CE] bg-[#160a2c] font-mono font-bold text-white text-xs">
              <td colSpan={2} className="py-3 px-3 uppercase tracking-wider text-[#C084FC]">
                ICMR Scientific Sum ({ingredients.length} item{ingredients.length > 1 ? 's' : ''})
              </td>
              <td className="py-3 px-3 text-center text-[#C084FC]">
                {totals.totalRawGrams} g raw
              </td>
              <td className="py-3 px-3 text-gray-300 text-[11px]">
                {overallCookingMethod}
              </td>
              <td className="py-3 px-2 text-right text-emerald-400 font-black">
                {totals.energyKcal} kcal
                <span className="block text-[9px] text-gray-400">{totals.energyKj} kJ</span>
              </td>
              <td className="py-3 px-2 text-right text-purple-300 font-black">
                {totals.proteinG}g
              </td>
              <td className="py-3 px-2 text-right text-amber-300 font-black">
                {totals.fatG}g
              </td>
              <td className="py-3 px-2 text-right text-sky-300 font-black">
                {totals.carbsG}g
              </td>
              <td className="py-3 px-2 text-right text-teal-300 font-black">
                {totals.fiberG}g
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Action Row & Add Ingredient */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddIngredient}
            className="px-3 py-1.5 bg-[#261044] hover:bg-[#3b1968] text-purple-200 border border-[#7E22CE] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>Add Ingredient</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFormulaProof(!showFormulaProof)}
            className="px-2.5 py-1.5 bg-black/50 text-gray-400 hover:text-white rounded border border-white/10 text-[11px] font-mono flex items-center gap-1"
          >
            <Calculator className="w-3 h-3 text-amber-400" />
            <span>{showFormulaProof ? 'Hide Formula Proof' : 'Show Formula Proof'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-black/60 hover:bg-white/10 text-gray-300 rounded text-xs font-bold uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-4 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white rounded text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(126,34,206,0.6)] cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Ingredients to Recipe</span>
          </button>
        </div>
      </div>

      {/* ICMR Exact Formula Proof Breakdown */}
      {showFormulaProof && (
        <div className="p-3.5 bg-black/80 border border-amber-500/40 rounded-lg space-y-2 text-[11px]">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[10px] tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Enforced ICMR-NIN Calculation Proof (Audit Trail)</span>
          </div>

          <div className="font-mono text-gray-300 space-y-1">
            <p className="text-[#C084FC]">
              Formula: <strong>Nutrient value = (IFCT value per 100g × consumed weight in g) ÷ 100</strong>
            </p>
            <p className="text-amber-300">
              Energy Rule: <strong>kcal = kJ ÷ 4.184</strong>
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-gray-400 font-mono text-[10px]">
            {totals.auditTrail.map((line, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-purple-400">Step {idx + 1}:</span>
                <span className="text-gray-200">{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
