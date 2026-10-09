import React, { useState, useMemo } from 'react';
import {
  IFCT_TABLE1_DATABASE,
  computeElshaIfctNutrients,
  IfctTable1Food,
} from '../utils/ifctTable1Data';
import {
  Calculator,
  X,
  Search,
  CheckCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  Scale,
  UtensilsCrossed,
} from 'lucide-react';
import { IcmrRecipeIngredientEditor } from './IcmrRecipeIngredientEditor';

interface ElshaIfctCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFoodCode?: string;
  initialGrams?: number;
}

export const ElshaIfctCalculatorModal: React.FC<ElshaIfctCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialFoodCode = 'A015',
  initialGrams = 30,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'recipeTable'>('single');
  const [selectedFoodCode, setSelectedFoodCode] = useState<string>(initialFoodCode);
  const [grams, setGrams] = useState<number>(initialGrams);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Preset portion weights common in dietary practice
  const presetWeights = [25, 30, 50, 75, 100, 120, 150];

  // Filter food list
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return IFCT_TABLE1_DATABASE;
    const q = searchQuery.toLowerCase().trim();
    return IFCT_TABLE1_DATABASE.filter(
      (f) =>
        f.code.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.commonAliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Selected food
  const currentFood = useMemo(() => {
    return (
      IFCT_TABLE1_DATABASE.find((f) => f.code.toUpperCase() === selectedFoodCode.toUpperCase()) ||
      IFCT_TABLE1_DATABASE.find((f) => f.code === 'A015') ||
      IFCT_TABLE1_DATABASE[0]
    );
  }, [selectedFoodCode]);

  // Computed ELSHA breakdown
  const breakdown = useMemo(() => {
    return computeElshaIfctNutrients(currentFood, grams);
  }, [currentFood, grams]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090b0e] border-2 border-[#C5A028] shadow-[0_0_50px_rgba(197,160,40,0.3)] text-white overflow-hidden my-6 max-h-[92vh] flex flex-col rounded-lg">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5A028]/40 bg-[#0d1117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C5A028]/20 border border-[#C5A028] rounded text-[#C5A028]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#7E22CE] text-white rounded-sm">
                  Žiathlon Clinical Calculation Engine
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> ICMR-NIN IFCT 2017 Table 1 Standard
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide mt-1">
                Nutrient Calculation System
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Formula: <span className="text-[#f7d88c]">Nutrient value = (IFCT value per 100 g × consumed weight in g) ÷ 100</span> | Conversion: <span className="text-[#f7d88c]">kcal = kJ ÷ 4.184</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#C5A028]/30 bg-black/60 px-4 pt-2 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 border-b-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'single'
                ? 'border-[#C5A028] text-[#f7d88c] bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Single Food Item (Table 1 Formula)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recipeTable')}
            className={`px-4 py-2 border-b-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'recipeTable'
                ? 'border-amber-400 text-amber-300 bg-white/5 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="font-black text-amber-400 text-sm">&gt;</span>
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Recipe Ingredient Table (Quantity & Cooking Method)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'recipeTable' ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg text-xs font-mono text-amber-200">
                <p>
                  <strong>No Recipe Assumptions:</strong> Fill exact food ingredients, weights in grams, and cooking methods. All calculations strictly obey ICMR-NIN IFCT 2017: <code>Nutrient = (Value per 100g × quantity) ÷ 100</code> and <code>kcal = kJ ÷ 4.184</code>.
                </p>
              </div>
              <IcmrRecipeIngredientEditor
                isModal={true}
                recipeName="Precision Custom Recipe"
                initialIngredients={[]}
                initialCookingMethod="Boiled / Simmered"
                onSave={(ing, method) => {
                  // Saved successfully
                }}
              />
            </div>
          ) : (
            <>
          {/* Official Formula Proof Banner */}
          <div className="p-4 bg-[#141a22] border border-[#C5A028]/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C5A028] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Core Mathematical Principles
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                Multiplier: {grams} ÷ 100 = <span className="text-white font-bold">{(grams / 100).toFixed(3).replace(/\.?0+$/, '')}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-black/50 border border-white/10 rounded">
                <div className="text-[#f7d88c] font-bold mb-1">1. Exact Nutrient Formula:</div>
                <div className="text-gray-300">
                  Nutrient for required quantity = <br />
                  <span className="text-emerald-400 font-bold">(Value per 100 g × Required quantity in g) ÷ 100</span>
                </div>
              </div>
              <div className="p-3 bg-black/50 border border-white/10 rounded">
                <div className="text-[#f7d88c] font-bold mb-1">2. Energy kJ to kcal Conversion:</div>
                <div className="text-gray-300">
                  When source table gives energy in kJ: <br />
                  <span className="text-amber-400 font-bold">kcal = kJ ÷ 4.184</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Food Selection & Weight Selection */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Food Selector */}
            <div className="md:col-span-7 space-y-2">
              <label className="text-xs font-mono text-gray-300 uppercase tracking-wide block">
                Select Food (IFCT 2017 Table 1):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter foods (e.g. A015, rice, atta, dal, milk)..."
                  className="w-full pl-9 pr-3 py-2 bg-black border border-white/20 rounded text-xs text-white focus:outline-none focus:border-[#C5A028]"
                />
              </div>
              <select
                value={currentFood.code}
                onChange={(e) => setSelectedFoodCode(e.target.value)}
                className="w-full py-2 px-3 bg-black border border-white/20 rounded text-xs text-white focus:outline-none focus:border-[#C5A028] font-mono"
              >
                {filteredFoods.map((f) => (
                  <option key={f.code} value={f.code}>
                    [{f.code}] {f.name} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Input & Presets */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-gray-300 uppercase tracking-wide flex items-center justify-between">
                <span>Consumed Weight (g):</span>
                <span className="text-[#C5A028] font-bold font-mono">{grams} g</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={grams}
                  onChange={(e) => setGrams(Math.max(1, Number(e.target.value) || 0))}
                  className="w-24 py-2 px-3 bg-black border border-white/20 rounded text-sm text-center text-white font-mono font-bold focus:outline-none focus:border-[#C5A028]"
                />
                <span className="text-xs font-mono text-gray-400">grams</span>
              </div>
              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {presetWeights.map((pw) => (
                  <button
                    key={pw}
                    type="button"
                    onClick={() => setGrams(pw)}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      grams === pw
                        ? 'bg-[#C5A028] text-black font-bold'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {pw}g
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Selected Food Card */}
          <div className="p-3 bg-black/60 border border-white/10 rounded flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 bg-[#C5A028]/20 border border-[#C5A028] text-[#C5A028] text-[10px] font-mono font-bold rounded">
                Code: {currentFood.code}
              </span>
              <span className="text-xs text-white font-bold ml-2">{currentFood.name}</span>
              {currentFood.scientificName && (
                <span className="text-xs text-gray-400 italic ml-1">({currentFood.scientificName})</span>
              )}
            </div>
            <div className="text-xs font-mono text-gray-300">
              Category: <span className="text-amber-300">{currentFood.category}</span>
            </div>
          </div>

          {/* Verification Table - Exact layout requested by user */}
          {breakdown && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-mono tracking-wider text-gray-300 font-bold">
                  Calculation Breakdown for {grams} g {currentFood.name}:
                </h3>
                <span className="text-xs font-mono text-[#f7d88c]">
                  Factor = {grams} ÷ 100 = {breakdown.multiplier}
                </span>
              </div>

              <div className="border border-white/20 rounded-lg overflow-hidden bg-black shadow-inner">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-[#C5A028]/50 bg-[#161c24] text-[#C5A028] text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Nutrient</th>
                      <th className="py-2.5 px-3">Per 100 g</th>
                      <th className="py-2.5 px-3">Calculation for {grams} g</th>
                      <th className="py-2.5 px-3 text-right">{grams} g Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {/* Energy kJ */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        Energy (kJ)
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">{currentFood.energyKj} kJ</td>
                      <td className="py-2.5 px-3 text-gray-300">
                        {currentFood.energyKj} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-300">
                        {breakdown.values.energyKj} kJ
                      </td>
                    </tr>

                    {/* Energy kcal (converted) */}
                    <tr className="hover:bg-white/[0.03] bg-amber-950/20">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C5A028] inline-block" />
                        Energy (kcal)
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">
                        {currentFood.energyKj} kJ <span className="text-[10px] text-gray-400">({(currentFood.energyKj / 4.184).toFixed(1)} kcal)</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#f7d88c]">
                        {breakdown.values.energyKj} ÷ 4.184
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#C5A028] text-sm">
                        ≈ {breakdown.values.energyKcal} kcal
                      </td>
                    </tr>

                    {/* Protein */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        Protein
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">{currentFood.proteinG.toFixed(2)} g</td>
                      <td className="py-2.5 px-3 text-gray-300">
                        {currentFood.proteinG} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-300 text-sm">
                        {breakdown.values.proteinG.toFixed(2)} g
                      </td>
                    </tr>

                    {/* Fat */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                        Fat
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">{currentFood.fatG.toFixed(2)} g</td>
                      <td className="py-2.5 px-3 text-gray-300">
                        {currentFood.fatG} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-orange-300 text-sm">
                        {breakdown.values.fatG.toFixed(2)} g
                      </td>
                    </tr>

                    {/* Dietary Fibre */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                        Dietary fibre (Total)
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">{currentFood.fibreTotalG.toFixed(2)} g</td>
                      <td className="py-2.5 px-3 text-gray-300">
                        {currentFood.fibreTotalG} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-indigo-300 text-sm">
                        {breakdown.values.fibreTotalG.toFixed(2)} g
                      </td>
                    </tr>

                    {/* Carbohydrate */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                        Carbohydrate
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">{currentFood.carbsG.toFixed(2)} g</td>
                      <td className="py-2.5 px-3 text-gray-300">
                        {currentFood.carbsG} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-cyan-300 text-sm">
                        {breakdown.values.carbsG.toFixed(2)} g
                      </td>
                    </tr>

                    {/* Water / Moisture */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 text-gray-400">Moisture / Water</td>
                      <td className="py-2.5 px-3 text-gray-400">{currentFood.waterG.toFixed(2)} g</td>
                      <td className="py-2.5 px-3 text-gray-400">
                        {currentFood.waterG} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-300">
                        {breakdown.values.waterG.toFixed(2)} g
                      </td>
                    </tr>

                    {/* Mineral Ash */}
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3 text-gray-400">Total Ash</td>
                      <td className="py-2.5 px-3 text-gray-400">{currentFood.ashG.toFixed(2)} g</td>
                      <td className="py-2.5 px-3 text-gray-400">
                        {currentFood.ashG} × {grams} ÷ 100
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-300">
                        {breakdown.values.ashG.toFixed(2)} g
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Exact Summary Box */}
              <div className="p-4 bg-[#0a120c] border border-emerald-500/40 rounded-lg space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Result for {grams} g {currentFood.name}:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                  <div className="p-2 bg-black/40 border border-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Energy</div>
                    <div className="text-sm font-bold text-white">~{breakdown.values.energyKcal} kcal</div>
                    <div className="text-[9px] text-gray-500">({breakdown.values.energyKj} kJ)</div>
                  </div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Protein</div>
                    <div className="text-sm font-bold text-emerald-300">{breakdown.values.proteinG.toFixed(2)} g</div>
                  </div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Carbohydrate</div>
                    <div className="text-sm font-bold text-cyan-300">{breakdown.values.carbsG.toFixed(2)} g</div>
                  </div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Fat</div>
                    <div className="text-sm font-bold text-orange-300">{breakdown.values.fatG.toFixed(2)} g</div>
                  </div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-400 uppercase">Dietary fibre</div>
                    <div className="text-sm font-bold text-indigo-300">{breakdown.values.fibreTotalG.toFixed(2)} g</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User's exact canonical raw rice reference */}
          <div className="p-3.5 bg-black/50 border border-[#C5A028]/30 rounded text-xs space-y-1.5">
            <div className="font-bold text-[#f7d88c] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C5A028]" />
              Official Verification Baseline (A015: Raw, Milled Rice — 30 g):
            </div>
            <p className="text-gray-300 leading-relaxed font-mono text-[11px]">
              30 g raw milled rice: Energy = ~107 kcal (447.3 kJ ÷ 4.184), Protein = 2.38 g, Carbohydrate = 23.47 g, Fat = 0.16 g, Dietary fibre = 0.84 g.
            </p>
          </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#0d1117] border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Source: ICMR-NIN IFCT 2017 Table 1 Proximate Principles</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#C5A028] hover:bg-[#b08d20] text-black font-bold uppercase rounded transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
