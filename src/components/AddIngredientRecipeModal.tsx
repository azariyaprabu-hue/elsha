import React, { useState } from 'react';
import {
  ClinicalRecipe,
  IcmrIngredient,
  IngredientCategory,
  RecipeIngredientItem,
} from '../types';
import {
  calculateNutrientBreakdownForIngredient,
  convertUnitToGrams,
  createRecipeIngredientItem,
  ICMR_INGREDIENTS_DATABASE,
  STANDARD_CLINICAL_RECIPES,
  buildClinicalRecipe,
} from '../utils/icmrCalculator';
import {
  X,
  Plus,
  Search,
  Check,
  Calculator,
  Flame,
  Utensils,
  BookOpen,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface AddIngredientRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  mealId: string;
  mealName: string;
  onAddIngredient: (dayNumber: number, mealId: string, item: RecipeIngredientItem) => void;
  onAddRecipe: (dayNumber: number, mealId: string, recipe: ClinicalRecipe) => void;
}

export const AddIngredientRecipeModal: React.FC<AddIngredientRecipeModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  mealId,
  mealName,
  onAddIngredient,
  onAddRecipe,
}) => {
  const [activeTab, setActiveTab] = useState<'ingredient' | 'recipe'>('ingredient');

  // Ingredient form state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIngredient, setSelectedIngredient] = useState<IcmrIngredient>(
    ICMR_INGREDIENTS_DATABASE[0]
  );
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<string>('g');

  // Recipe selection state
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    STANDARD_CLINICAL_RECIPES[0].id
  );
  const [recipeServings, setRecipeServings] = useState<number>(1);

  if (!isOpen) return null;

  const categories: ('All' | IngredientCategory)[] = [
    'All',
    'Millets & Cereals',
    'Pulses & Legumes',
    'Vegetables & Keerai',
    'Dairy & Plant Protein',
    'Nuts & Oilseeds',
    'Fruits',
    'Oils & Healthy Fats',
    'Functional & Spices',
  ];

  const filteredIngredients = ICMR_INGREDIENTS_DATABASE.filter((ing) => {
    const matchesCat = selectedCategory === 'All' || ing.category === selectedCategory;
    const matchesSearch =
      ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ing.regionalName && ing.regionalName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Automated live calculation of candidate ingredient
  const candidateWeightGrams = convertUnitToGrams(quantity, unit, selectedIngredient);
  const candidateNutrients = calculateNutrientBreakdownForIngredient(
    selectedIngredient,
    candidateWeightGrams
  );

  // Selected Standard Recipe candidate
  const currentStdRecipe = STANDARD_CLINICAL_RECIPES.find((r) => r.id === selectedRecipeId) || STANDARD_CLINICAL_RECIPES[0];
  const builtCandidateRecipe = buildClinicalRecipe(
    currentStdRecipe.name,
    recipeServings,
    currentStdRecipe.ingredients.map((i) => ({
      ...i,
      quantity: i.quantity * recipeServings,
    })),
    currentStdRecipe.glycemicIndex,
    currentStdRecipe.clinicalNotes
  );

  const handleAddIngredientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    const newItem = createRecipeIngredientItem(selectedIngredient.id, quantity, unit);
    onAddIngredient(dayNumber, mealId, newItem);
    onClose();
  };

  const handleAddRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecipe(dayNumber, mealId, builtCandidateRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090d0b] border-2 border-[#C5A028] shadow-[0_0_50px_rgba(197,160,40,0.2)] text-white overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5A028]/40 bg-[#050706] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C5A028] text-black">
                ICMR-NIN Engine
              </span>
              <span className="text-xs text-gray-400 font-mono">Day {dayNumber} • {mealName}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide mt-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#C5A028]" />
              Automated ICMR Nutrient Calculator
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Add Ingredient vs Add Standard Recipe */}
        <div className="flex border-b border-white/10 bg-[#0c100e]">
          <button
            type="button"
            onClick={() => setActiveTab('ingredient')}
            className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ingredient'
                ? 'bg-[#C5A028] text-black font-black shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Add Single Ingredient (IFCT Database)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recipe')}
            className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'recipe'
                ? 'bg-[#C5A028] text-black font-black shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Add Clinical Recipe (Composite Breakdown)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'ingredient' ? (
            <div className="space-y-5">
              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                      selectedCategory === cat
                        ? 'bg-[#C5A028] text-black border-[#C5A028]'
                        : 'bg-[#111613] text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search and Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Indian staples, millets, dals, keerai..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#111613] border border-white/15 focus:border-[#C5A028] pl-9 pr-3 py-2 text-xs text-white focus:outline-none placeholder:text-gray-600"
                    />
                  </div>

                  {/* List of Ingredients */}
                  <div className="border border-white/10 max-h-48 overflow-y-auto divide-y divide-white/5 bg-[#070a08]">
                    {filteredIngredients.map((ing) => {
                      const isSelected = selectedIngredient.id === ing.id;
                      return (
                        <button
                          key={ing.id}
                          type="button"
                          onClick={() => {
                            setSelectedIngredient(ing);
                            setUnit(ing.defaultUnit);
                          }}
                          className={`w-full text-left p-2.5 text-xs transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#C5A028]/20 border-l-2 border-[#C5A028] text-white font-bold'
                              : 'hover:bg-white/5 text-gray-300'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-white">{ing.name}</div>
                            {ing.regionalName && (
                              <div className="text-[10px] text-[#C5A028] font-mono">{ing.regionalName}</div>
                            )}
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-gray-400">
                            {ing.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Highlight card for selected ingredient */}
                  {selectedIngredient.clinicalHighlight && (
                    <div className="p-2.5 bg-[#121914] border border-[#C5A028]/30 text-[11px] text-[#f7d88c] flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">ICMR Clinical Insight: </span>
                        {selectedIngredient.clinicalHighlight}
                      </div>
                    </div>
                  )}
                </div>

                {/* Portion Input & Real-time Live Calculation */}
                <div className="p-4 bg-[#111613] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs uppercase font-mono text-gray-400">Selected Item</span>
                    <span className="text-xs font-bold text-[#C5A028] font-mono">{selectedIngredient.name}</span>
                  </div>

                  {/* Quantity & Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                        className="w-full bg-black border border-white/20 focus:border-[#C5A028] px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
                        Measure Unit
                      </label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full bg-black border border-white/20 focus:border-[#C5A028] px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                      >
                        <option value="g">Grams (g)</option>
                        <option value="cup">Standard Cup (~150g)</option>
                        <option value="katori">Katori / Small Bowl (~120g)</option>
                        <option value="tbsp">Tablespoon (~15g)</option>
                        <option value="tsp">Teaspoon (~5g)</option>
                        <option value="nos">Pieces / Nos (~30g)</option>
                        <option value="nut">Nut count (~1.5g)</option>
                        <option value="ml">Milliliters (ml)</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono">
                    Computed Net Weight: <span className="text-white font-bold">{candidateWeightGrams} grams</span>
                  </div>

                  {/* Live Automated ICMR Nutrient Calculation Card */}
                  <div className="p-3 bg-black/60 border border-[#C5A028]/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#C5A028]">
                      <span>⚡ AUTOMATED NUTRIENTS</span>
                      <span className="text-white font-bold">{candidateNutrients.calories} kcal</span>
                    </div>

                    {/* Macros Grid */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                      <div className="p-1.5 bg-[#111] border border-white/5">
                        <div className="text-gray-500">Carbs</div>
                        <div className="text-[#f7d88c] font-bold">{candidateNutrients.carbs}g</div>
                      </div>
                      <div className="p-1.5 bg-[#111] border border-white/5">
                        <div className="text-gray-500">Protein</div>
                        <div className="text-emerald-400 font-bold">{candidateNutrients.protein}g</div>
                      </div>
                      <div className="p-1.5 bg-[#111] border border-white/5">
                        <div className="text-gray-500">Fat</div>
                        <div className="text-amber-400 font-bold">{candidateNutrients.fat}g</div>
                      </div>
                      <div className="p-1.5 bg-[#111] border border-white/5">
                        <div className="text-gray-500">Fiber</div>
                        <div className="text-indigo-400 font-bold">{candidateNutrients.fiber}g</div>
                      </div>
                    </div>

                    {/* Key Micros */}
                    <div className="pt-1.5 border-t border-white/10 grid grid-cols-3 gap-1.5 text-[10px] font-mono text-gray-400">
                      <div>Calcium: <span className="text-white">{candidateNutrients.calcium}mg</span></div>
                      <div>Iron: <span className="text-white">{candidateNutrients.iron}mg</span></div>
                      <div>Zinc: <span className="text-white">{candidateNutrients.zinc}mg</span></div>
                      <div>Magnesium: <span className="text-white">{candidateNutrients.magnesium}mg</span></div>
                      <div>Potassium: <span className="text-white">{candidateNutrients.potassium}mg</span></div>
                      <div>Vit C: <span className="text-white">{candidateNutrients.vitaminC}mg</span></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddIngredientSubmit}
                    className="w-full py-2.5 px-4 bg-[#C5A028] text-black font-black uppercase text-xs tracking-wider hover:bg-[#d8b235] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Ingredient to Meal
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Recipe Selection Tab */
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Recipe List */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono text-gray-400">
                    Select ICMR-Standardized Clinical Recipe
                  </label>
                  <div className="space-y-2">
                    {STANDARD_CLINICAL_RECIPES.map((recipe) => {
                      const isSelected = recipe.id === selectedRecipeId;
                      return (
                        <div
                          key={recipe.id}
                          onClick={() => setSelectedRecipeId(recipe.id)}
                          className={`p-3 border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#C5A028]/15 border-[#C5A028] text-white'
                              : 'bg-[#111613] border-white/10 hover:border-white/30 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>{recipe.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded">
                              {recipe.glycemicIndex} GI
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                            {recipe.clinicalNotes}
                          </p>
                          <div className="text-[10px] font-mono text-[#C5A028] mt-1.5">
                            {recipe.ingredients.length} measured ingredients
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recipe Composition & Live Computed Breakdown */}
                <div className="p-4 bg-[#111613] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-400">Recipe Breakdown</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{builtCandidateRecipe.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] font-mono text-gray-400">Servings:</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={recipeServings}
                        onChange={(e) => setRecipeServings(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 bg-black border border-white/20 px-2 py-0.5 text-xs text-white text-center font-mono"
                      />
                    </div>
                  </div>

                  {/* Constituent Ingredients */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-gray-400">
                      Constituent Ingredients (Scaled)
                    </span>
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                      {builtCandidateRecipe.ingredients.map((ing) => (
                        <div
                          key={ing.id}
                          className="flex items-center justify-between text-[11px] py-1 px-2 bg-black/40 border border-white/5"
                        >
                          <span className="text-gray-300 font-medium">{ing.name}</span>
                          <span className="text-[#C5A028] font-mono text-[10px]">
                            {ing.weightGrams}g ({ing.nutrients.calories} kcal)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Automated Computed Recipe Nutrients */}
                  <div className="p-3 bg-black/70 border border-[#C5A028]/40 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#C5A028]">
                      <span>TOTAL RECIPE NUTRIENTS</span>
                      <span className="text-white font-bold">{builtCandidateRecipe.nutrients.calories} kcal</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-mono">
                      <div className="p-1 bg-[#111]">
                        <div className="text-gray-500">Carbs</div>
                        <div className="text-[#f7d88c] font-bold">{builtCandidateRecipe.nutrients.carbs}g</div>
                      </div>
                      <div className="p-1 bg-[#111]">
                        <div className="text-gray-500">Protein</div>
                        <div className="text-emerald-400 font-bold">{builtCandidateRecipe.nutrients.protein}g</div>
                      </div>
                      <div className="p-1 bg-[#111]">
                        <div className="text-gray-500">Fat</div>
                        <div className="text-amber-400 font-bold">{builtCandidateRecipe.nutrients.fat}g</div>
                      </div>
                      <div className="p-1 bg-[#111]">
                        <div className="text-gray-500">Fiber</div>
                        <div className="text-indigo-400 font-bold">{builtCandidateRecipe.nutrients.fiber}g</div>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-white/10 grid grid-cols-3 gap-1.5 text-[10px] font-mono text-gray-400">
                      <div>Calcium: <span className="text-white">{builtCandidateRecipe.nutrients.calcium}mg</span></div>
                      <div>Iron: <span className="text-white">{builtCandidateRecipe.nutrients.iron}mg</span></div>
                      <div>Zinc: <span className="text-white">{builtCandidateRecipe.nutrients.zinc}mg</span></div>
                      <div>Magnesium: <span className="text-white">{builtCandidateRecipe.nutrients.magnesium}mg</span></div>
                      <div>Potassium: <span className="text-white">{builtCandidateRecipe.nutrients.potassium}mg</span></div>
                      <div>Vit C: <span className="text-white">{builtCandidateRecipe.nutrients.vitaminC}mg</span></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRecipeSubmit}
                    className="w-full py-2.5 px-4 bg-[#C5A028] text-black font-black uppercase text-xs tracking-wider hover:bg-[#d8b235] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Recipe to Meal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
