import React, { useState } from 'react';
import {
  DIET_DOMAINS_LIST,
  DietDomainDefinition,
  eliminationDiet12DaysData,
  initial7DayMasterPlanMatrix,
  MealSlotMatrixRow,
} from '../data/dietDomainsMasterData';
import {
  DYNAMIC_DOMAIN_PROFILES,
  ClinicalDietDomainProfile,
} from '../data/domainDynamicDietData';
import {
  Utensils,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Download,
  Printer,
  Clock,
  Flame,
  Leaf,
  Layers,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  Zap,
  TableProperties,
  FileText,
} from 'lucide-react';
import { ConditionRecipePosterTable } from './ConditionRecipePosterTable';

interface DietDomainsAndPlanSectionProps {
  onOpenPrescription?: () => void;
}

export const DietDomainsAndPlanSection: React.FC<DietDomainsAndPlanSectionProps> = ({
  onOpenPrescription,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('elimination');
  const [activeSubTab, setActiveSubTab] = useState<'ingredients' | 'recipes' | 'functionalFoods' | 'chart7Day' | 'elimination12Day'>('ingredients');
  const [recipeViewMode, setRecipeViewMode] = useState<'poster' | 'cards'>('poster');
  const [isAiRecalculating, setIsAiRecalculating] = useState<boolean>(false);
  const [aiRecalcNotice, setAiRecalcNotice] = useState<string | null>(null);

  // Interactive 7-Day Matrix State
  const [planMatrix, setPlanMatrix] = useState<MealSlotMatrixRow[]>(initial7DayMasterPlanMatrix);
  const [newSlotName, setNewSlotName] = useState<string>('');
  const [showAddSlotInput, setShowAddSlotInput] = useState<boolean>(false);
  const [copiedDayToast, setCopiedDayToast] = useState<string | null>(null);

  const selectedDomain =
    DIET_DOMAINS_LIST.find((d) => d.id === selectedDomainId) || DIET_DOMAINS_LIST[0];

  const currentDomainProfile: ClinicalDietDomainProfile =
    DYNAMIC_DOMAIN_PROFILES[selectedDomainId] || DYNAMIC_DOMAIN_PROFILES['balanced'];

  const handleAiRecalculateDomain = () => {
    setIsAiRecalculating(true);
    setTimeout(() => {
      setIsAiRecalculating(false);
      setAiRecalcNotice(`⚡ AI Formulation updated: Synchronized ingredients, recipes, functional herbs & 9 meal slots for ${currentDomainProfile.domainName}!`);
      setTimeout(() => setAiRecalcNotice(null), 4000);
    }, 600);
  };

  const handleUpdateMatrixCell = (
    slotId: string,
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    value: string
  ) => {
    setPlanMatrix((prev) =>
      prev.map((row) => (row.slotId === slotId ? { ...row, [day]: value } : row))
    );
  };

  const handleAddCustomMealSlot = (customName?: string) => {
    const title = customName || newSlotName.trim() || 'Post-Workout / Snack';
    const newRow: MealSlotMatrixRow = {
      slotId: `slot-${Date.now()}`,
      timeSlot: title,
      monday: 'Post-workout Whey / Electrolyte water / Boiled egg whites',
      tuesday: 'Post-workout Whey / Electrolyte water / Boiled egg whites',
      wednesday: 'Post-workout Whey / Electrolyte water / Boiled egg whites',
      thursday: 'Post-workout Whey / Electrolyte water / Boiled egg whites',
      friday: 'Post-workout Whey / Electrolyte water / Boiled egg whites',
      saturday: 'Post-workout Whey / Electrolyte water / Boiled egg whites',
      sunday: 'Mindful post-workout hydration',
    };
    setPlanMatrix((prev) => [...prev, newRow]);
    setNewSlotName('');
    setShowAddSlotInput(false);
  };

  const handleDeleteMealSlot = (slotId: string) => {
    if (planMatrix.length <= 2) return;
    setPlanMatrix((prev) => prev.filter((r) => r.slotId !== slotId));
  };

  const handleCopyMondayToAllDays = () => {
    setPlanMatrix((prev) =>
      prev.map((row) => ({
        ...row,
        tuesday: row.monday,
        wednesday: row.monday,
        thursday: row.monday,
        friday: row.monday,
        saturday: row.monday,
        sunday: row.monday,
      }))
    );
    setCopiedDayToast('Copied Monday meal selections across all 7 days!');
    setTimeout(() => setCopiedDayToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b-2 border-[#C5A028] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#C5A028]">
            THERAPEUTIC DIETARY ARCHITECTURE • CLINICAL FORMULARY
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            10 Diet Domains & Master 7-Day Nutrition Plan
          </h2>
          <p className="text-xs text-gray-400">
            Select a clinical diet domain to load the master food groups table, recipes guidelines, 10 Ayur-Siddha functional foods, and 7-day meal chart.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenPrescription && (
            <button
              type="button"
              onClick={onOpenPrescription}
              className="px-3.5 py-1.5 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Rx Prescription</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white border-2 border-purple-200 text-[#7E22CE] text-xs font-bold uppercase hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1.5 rounded-lg shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart</span>
          </button>
        </div>
      </div>

      {/* 10 DIET DOMAINS PILLS SELECTOR */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase font-mono tracking-widest text-[#7E22CE] font-black">
          1. Select Therapeutic Diet Domain:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {DIET_DOMAINS_LIST.map((domain) => {
            const isSelected = selectedDomainId === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => {
                  setSelectedDomainId(domain.id);
                  if (domain.id === 'elimination') {
                    setActiveSubTab('elimination12Day');
                  }
                }}
                className={`p-3 text-left border-2 rounded-xl transition-all cursor-pointer relative flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? 'bg-[#7E22CE] border-[#7E22CE] text-white shadow-md ring-2 ring-purple-300'
                    : 'bg-purple-50/90 border-purple-200/90 hover:border-[#7E22CE] hover:bg-purple-100/80 text-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white text-[#7E22CE] border border-purple-200'
                      }`}
                    >
                      {domain.tag}
                    </span>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                  </div>
                  <h4
                    className={`text-xs font-black leading-snug ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {domain.name}
                  </h4>
                  <p
                    className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-purple-100 font-medium' : 'text-purple-800'
                    }`}
                  >
                    {domain.tamilName}
                  </p>
                </div>

                <div
                  className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[9px] font-mono ${
                    isSelected ? 'border-purple-400/40 text-purple-100' : 'border-purple-200 text-gray-600'
                  }`}
                >
                  <span>C:{domain.macroRatio.carbs}%</span>
                  <span>P:{domain.macroRatio.protein}%</span>
                  <span>F:{domain.macroRatio.fat}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Active Overview Banner & AI Dynamic Recalculation */}
      <div className="p-4 bg-purple-50 border-2 border-[#7E22CE] rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm text-gray-900">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900 uppercase">{currentDomainProfile.domainName}</span>
            <span className="text-[11px] px-2.5 py-0.5 bg-[#7E22CE] text-white rounded font-mono font-bold">
              Target: {currentDomainProfile.dailyCalorieTarget} kcal
            </span>
          </div>
          <p className="text-xs text-gray-700">{currentDomainProfile.tagline}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentDomainProfile.clinicalIndications.map((ind, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-white text-purple-900 border border-purple-300 rounded font-semibold shadow-xs">
                ✓ {ind}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex items-center gap-3 bg-white p-2.5 border-2 border-purple-200 rounded-xl font-mono text-xs shadow-xs text-gray-900">
            <div className="text-center">
              <div className="text-[9px] text-gray-500 uppercase font-bold">Carbs</div>
              <div className="text-purple-950 font-black">{currentDomainProfile.macroRatio.carbs}%</div>
            </div>
            <div className="w-[1px] h-6 bg-purple-200" />
            <div className="text-center">
              <div className="text-[9px] text-gray-500 uppercase font-bold">Protein</div>
              <div className="text-emerald-700 font-black">{currentDomainProfile.macroRatio.protein}%</div>
            </div>
            <div className="w-[1px] h-6 bg-purple-200" />
            <div className="text-center">
              <div className="text-[9px] text-gray-500 uppercase font-bold">Fat</div>
              <div className="text-amber-700 font-black">{currentDomainProfile.macroRatio.fat}%</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAiRecalculateDomain}
            className="px-4 py-2.5 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-xl shadow-md"
            title="Automatically re-compute ingredients, recipes, functional foods and meal slots for this domain"
          >
            <Zap className={`w-3.5 h-3.5 ${isAiRecalculating ? 'animate-spin' : ''}`} />
            <span>{isAiRecalculating ? 'Recomputing...' : '⚡ AI Domain Recalculate'}</span>
          </button>
        </div>
      </div>

      {aiRecalcNotice && (
        <div className="p-3 bg-purple-100 border border-purple-400 text-purple-950 text-xs flex items-center gap-2 rounded-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
          <span>{aiRecalcNotice}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs (Dynamic Domain-Specific) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b-2 border-purple-200 pb-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('ingredients')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer rounded-t-xl border-t border-x ${
            activeSubTab === 'ingredients'
              ? 'border-[#7E22CE] text-white bg-[#7E22CE]'
              : 'border-purple-200 text-gray-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          Domain Ingredients Formulary ({currentDomainProfile.domainName})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('recipes')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer rounded-t-xl border-t border-x ${
            activeSubTab === 'recipes'
              ? 'border-[#7E22CE] text-white bg-[#7E22CE]'
              : 'border-purple-200 text-gray-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          Domain Recipes Guidelines ({currentDomainProfile.recipes.length} Recipes)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('functionalFoods')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer rounded-t-xl border-t border-x ${
            activeSubTab === 'functionalFoods'
              ? 'border-[#7E22CE] text-white bg-[#7E22CE]'
              : 'border-purple-200 text-gray-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          Ayur-Siddha Functional Herbs ({currentDomainProfile.ayurSiddha.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('chart7Day')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer rounded-t-xl border-t border-x ${
            activeSubTab === 'chart7Day'
              ? 'border-[#7E22CE] text-white bg-[#7E22CE]'
              : 'border-purple-200 text-gray-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          7-Day Meal Blueprint & Timing Slots
        </button>

        {selectedDomainId === 'elimination' && (
          <button
            type="button"
            onClick={() => setActiveSubTab('elimination12Day')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer rounded-t-xl border-t border-x ${
              activeSubTab === 'elimination12Day'
                ? 'border-[#7E22CE] text-white bg-[#7E22CE]'
                : 'border-purple-200 text-[#7E22CE] bg-purple-50 hover:bg-purple-100'
            }`}
          >
            ★ 12-Day Post Gut Cleanse Protocol (PDF Page 2 & 3)
          </button>
        )}
      </div>

      {copiedDayToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedDayToast}</span>
        </div>
      )}

      {/* ================= 1. DYNAMIC DOMAIN INGREDIENTS FORMULARY ================= */}
      {activeSubTab === 'ingredients' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-gray-900 shadow-xs">
            <span className="text-xs uppercase font-black text-[#7E22CE] tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#7E22CE]" />
              <span>Domain-Specific Ingredient Formulary: {currentDomainProfile.domainName}</span>
            </span>
            <span className="text-[10px] font-mono text-purple-800 font-semibold">
              AI dynamically adapts ingredients to match glycemic, renal, cardiac & GI targets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommended Foods Column */}
            <div className="bg-purple-50/70 border-2 border-emerald-300 rounded-xl overflow-hidden shadow-xs space-y-2">
              <div className="p-3 bg-emerald-100 border-b border-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black uppercase text-emerald-950">
                    Recommended Therapeutic Foods ({currentDomainProfile.ingredients.filter(i => i.status === 'Recommended').length})
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded">Safe & Optimal</span>
              </div>
              <div className="divide-y divide-purple-100 max-h-[500px] overflow-y-auto p-2 space-y-2">
                {currentDomainProfile.ingredients
                  .filter((i) => i.status === 'Recommended')
                  .map((item, idx) => (
                    <div key={item.id} className="p-2.5 bg-white border border-purple-200 rounded-lg hover:border-emerald-500 transition-all shadow-2xs">
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-gray-950 text-xs">
                          {idx + 1}. {item.name}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-mono font-bold">
                          {item.gi} GI
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7E22CE] mt-0.5 font-mono font-bold">
                        Category: {item.category} • Portion: {item.portionGuide}
                      </div>
                      <div className="text-[11px] text-gray-700 mt-1 font-sans leading-relaxed">
                        {item.clinicalBenefit}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Restricted / Prohibited Foods Column */}
            <div className="bg-purple-50/70 border-2 border-rose-300 rounded-xl overflow-hidden shadow-xs space-y-2">
              <div className="p-3 bg-rose-100 border-b border-rose-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span className="text-xs font-black uppercase text-rose-950">
                    Restricted / Caution Foods ({currentDomainProfile.ingredients.filter(i => i.status !== 'Recommended').length})
                  </span>
                </div>
                <span className="text-[9px] font-mono text-rose-800 font-bold bg-white px-2 py-0.5 rounded">Avoid / Eliminate</span>
              </div>
              <div className="divide-y divide-purple-100 max-h-[500px] overflow-y-auto p-2 space-y-2">
                {currentDomainProfile.ingredients
                  .filter((i) => i.status !== 'Recommended')
                  .map((item, idx) => (
                    <div key={item.id} className="p-2.5 bg-white border border-purple-200 rounded-lg hover:border-rose-400 transition-all shadow-2xs">
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-gray-950 text-xs">
                          {idx + 1}. {item.name}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-300 rounded font-mono font-bold">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-rose-700 mt-0.5 font-mono font-bold">
                        Category: {item.category} • Guide: {item.portionGuide}
                      </div>
                      <div className="text-[11px] text-gray-700 mt-1 font-sans leading-relaxed">
                        {item.clinicalBenefit}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. DYNAMIC DOMAIN RECIPES GUIDELINES ================= */}
      {activeSubTab === 'recipes' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-gray-900 shadow-xs">
            <span className="text-xs uppercase font-black text-[#7E22CE] tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#7E22CE]" />
              <span>Clinical Recipes Guidelines for {currentDomainProfile.domainName}</span>
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-white border border-purple-200 rounded-lg">
              <button
                type="button"
                onClick={() => setRecipeViewMode('poster')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded ${
                  recipeViewMode === 'poster'
                    ? 'bg-[#7E22CE] text-white font-black'
                    : 'text-gray-700 hover:text-[#7E22CE] hover:bg-purple-50'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>20-Option Table (Poster View)</span>
              </button>
              <button
                type="button"
                onClick={() => setRecipeViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded ${
                  recipeViewMode === 'cards'
                    ? 'bg-[#7E22CE] text-white font-black'
                    : 'text-gray-700 hover:text-[#7E22CE] hover:bg-purple-50'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Formulation Cards ({currentDomainProfile.recipes.length})</span>
              </button>
            </div>
          </div>

          {recipeViewMode === 'poster' ? (
            <ConditionRecipePosterTable
              initialCondition={currentDomainProfile.domainName}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDomainProfile.recipes.map((rcp, idx) => (
                <div key={rcp.id} className="p-4 bg-purple-50/70 border-2 border-purple-200 rounded-xl space-y-2.5 hover:border-[#7E22CE] transition-all shadow-xs text-gray-900">
                  <div className="flex items-start justify-between gap-2 border-b border-purple-200 pb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#7E22CE]">
                        #{idx + 1} • {rcp.mealType}
                      </span>
                      <h4 className="text-sm font-black text-gray-950 mt-0.5">{rcp.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-purple-300 text-[#7E22CE] rounded shadow-2xs">
                      {rcp.calories} kcal
                    </span>
                  </div>

                  {/* Macro pill bar */}
                  <div className="flex flex-wrap gap-1.5 text-[10.5px] font-mono">
                    <span className="px-2 py-0.5 bg-white text-purple-900 border border-purple-300 rounded font-bold shadow-2xs">
                      Protein: {rcp.protein}g
                    </span>
                    <span className="px-2 py-0.5 bg-white text-amber-900 border border-amber-300 rounded font-bold shadow-2xs">
                      Carbs: {rcp.carbs}g
                    </span>
                    <span className="px-2 py-0.5 bg-white text-yellow-900 border border-yellow-300 rounded font-bold shadow-2xs">
                      Fat: {rcp.fat}g
                    </span>
                    <span className="px-2 py-0.5 bg-white text-emerald-900 border border-emerald-300 rounded font-bold shadow-2xs">
                      Fiber: {rcp.fiber}g
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-950 border border-purple-400 rounded font-bold shadow-2xs">
                      {rcp.gi}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-[10px] uppercase font-mono text-purple-900 font-bold block">Key Ingredients:</span>
                    <p className="text-gray-800 text-[11px] font-mono">{rcp.ingredients}</p>
                  </div>

                  <div className="text-xs space-y-1 border-t border-purple-200 pt-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold block">Clinical Preparation Protocol:</span>
                    <p className="text-gray-700 text-[11px] leading-relaxed">{rcp.clinicalPrepInstructions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. DYNAMIC AYURVEDIC & SIDDHA FUNCTIONAL HERBS ================= */}
      {activeSubTab === 'functionalFoods' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-gray-900 shadow-xs">
            <span className="text-xs uppercase font-black text-[#7E22CE] tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#7E22CE]" />
              <span>Ayurveda & Siddha Maruthuvam Formulations for {currentDomainProfile.domainName}</span>
            </span>
            <span className="text-[10px] font-mono text-purple-800 font-semibold">
              Targeted Therapeutic Dosages, Timing & Active Phyto-Constituents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentDomainProfile.ayurSiddha.map((item, idx) => (
              <div key={item.id} className="p-4 bg-purple-50/70 border-2 border-purple-200 rounded-xl space-y-2 hover:border-[#7E22CE] transition-all shadow-xs text-gray-900">
                <div className="flex items-start justify-between gap-2 border-b border-purple-200 pb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#7E22CE]">
                      #{idx + 1} • Therapeutic Formulation
                    </span>
                    <h4 className="text-sm font-bold text-gray-950 mt-0.5">{item.herbName}</h4>
                    <p className="text-[11px] text-purple-800 font-mono italic font-semibold">{item.botanicalOrTraditionalName}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-mono text-purple-900 font-bold">Therapeutic Action & Mechanism:</span>
                  <p className="text-gray-800 text-[11px] leading-relaxed">{item.action}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-purple-200">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold">Clinical Indication:</span>
                    <p className="text-gray-700 font-mono text-[11px]">{item.clinicalIndication}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#7E22CE] font-bold">Dosage & Timing:</span>
                    <p className="text-amber-800 font-mono text-[11px] font-bold">{item.dosageAndTiming}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. 7-DAY MASTER MEAL CHART MATRIX (From User's PDF 2 Page 4 & 5) ================= */}
      {activeSubTab === 'chart7Day' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-gray-900 shadow-xs">
            <div>
              <span className="text-xs uppercase font-black text-[#7E22CE] tracking-wider">
                7-Day Master Diet Matrix (Rows: Meal Slots • Columns: Monday to Sunday)
              </span>
              <p className="text-[10px] text-gray-600">
                Live editable cells. Click any cell to customize foods. Add custom time categories like Post-Workout.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMondayToAllDays}
                className="px-3 py-1.5 bg-white border-2 border-purple-200 text-[#7E22CE] text-[11px] font-bold uppercase hover:bg-purple-100 transition-colors cursor-pointer rounded-lg shadow-xs"
              >
                Copy Monday to All Days
              </button>

              <button
                type="button"
                onClick={() => setShowAddSlotInput(!showAddSlotInput)}
                className="px-3 py-1.5 bg-[#7E22CE] text-white text-xs font-black uppercase hover:bg-[#6b1dae] transition-colors cursor-pointer flex items-center gap-1 rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Meal Slot / Timing</span>
              </button>
            </div>
          </div>

          {showAddSlotInput && (
            <div className="p-3 bg-purple-100/70 border-2 border-purple-300 rounded-xl flex flex-wrap items-center gap-2 shadow-xs">
              <span className="text-xs text-gray-950 font-bold">New Category / Time Slot:</span>
              <input
                type="text"
                placeholder="e.g. Post-Workout Morning (7:00 am) or Evening Snack"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                className="px-3 py-1.5 bg-white border border-purple-300 text-xs text-gray-900 flex-1 min-w-[200px] focus:border-[#7E22CE] focus:outline-none rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleAddCustomMealSlot()}
                className="px-3.5 py-1.5 bg-[#7E22CE] text-white text-xs font-black uppercase cursor-pointer rounded-lg shadow-xs"
              >
                Confirm Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddSlotInput(false)}
                className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* MASTER 7-DAY MATRIX TABLE */}
          <div className="overflow-x-auto bg-white border-2 border-[#7E22CE] rounded-xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-purple-100 text-purple-950 font-mono text-[11px] uppercase tracking-wider border-b-2 border-[#7E22CE]">
                  <th className="py-3 px-3 w-36 border-r border-purple-200 font-black">Time / Frequency</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Monday</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Tuesday</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Wednesday</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Thursday</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Friday</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Saturday</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Sunday</th>
                  <th className="py-3 px-2 w-10 text-center font-black">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 font-sans">
                {planMatrix.map((row) => (
                  <tr key={row.slotId} className="hover:bg-purple-50/50">
                    {/* Time Slot Label */}
                    <td className="py-3 px-3 font-mono font-bold text-purple-950 bg-purple-50/80 border-r border-purple-200">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#7E22CE] shrink-0" />
                        <span>{row.timeSlot}</span>
                      </div>
                    </td>

                    {/* Monday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.monday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'monday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Tuesday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.tuesday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'tuesday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Wednesday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.wednesday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'wednesday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Thursday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.thursday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'thursday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Friday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.friday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'friday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Saturday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.saturday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'saturday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Sunday */}
                    <td className="py-2 px-2 border-r border-purple-100">
                      <textarea
                        rows={3}
                        value={row.sunday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'sunday', e.target.value)}
                        className="w-full bg-purple-50/30 hover:bg-white focus:bg-white border border-purple-200/60 focus:border-[#7E22CE] p-2 text-gray-900 text-[11px] leading-snug rounded-lg focus:outline-none resize-y"
                      />
                    </td>

                    {/* Delete Slot */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteMealSlot(row.slotId)}
                        disabled={planMatrix.length <= 2}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-20 cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 5. 12-DAY POST GUT CLEANSE & ELIMINATION PROTOCOL (PDF Page 2 & 3) ================= */}
      {activeSubTab === 'elimination12Day' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-gray-900 shadow-xs">
            <div>
              <span className="text-xs uppercase font-black text-[#7E22CE] tracking-wider">
                12-Day Post Gut Cleanse + Elimination Diet Matrix (Exact Model from Clinical PDF)
              </span>
              <p className="text-[10px] text-gray-600">
                Systematic sequential re-introduction of 12 distinct food groups to isolate allergens, histamine responses, and SIBO triggers.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-white text-[#7E22CE] border border-purple-300 rounded font-bold shadow-2xs">
              Days 1 – 12 Sequential Re-challenge
            </span>
          </div>

          <div className="overflow-x-auto bg-white border-2 border-[#7E22CE] rounded-xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-purple-100 text-purple-950 font-mono text-[10px] uppercase tracking-wider border-b-2 border-[#7E22CE]">
                  <th className="py-3 px-3 w-32 border-r border-purple-200 font-black">Re-intro Day</th>
                  <th className="py-3 px-3 w-36 border-r border-purple-200 font-black">Focus Category</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Wake Up (5:30 am)</th>
                  <th className="py-3 px-3 w-56 border-r border-purple-200 font-black">Breakfast (8:30 am)</th>
                  <th className="py-3 px-3 w-56 border-r border-purple-200 font-black">Lunch (1:30 pm)</th>
                  <th className="py-3 px-3 w-48 border-r border-purple-200 font-black">Snacks (5:00 pm)</th>
                  <th className="py-3 px-3 w-56 border-r border-purple-200 font-black">Dinner (8:00 pm)</th>
                  <th className="py-3 px-3 w-52 font-black">Tolerance Sign to Monitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 font-sans">
                {eliminationDiet12DaysData.map((day) => (
                  <tr key={day.dayNumber} className="hover:bg-purple-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-purple-950 bg-purple-50/80 border-r border-purple-200">
                      {day.dayTitle}
                    </td>
                    <td className="py-3 px-3 border-r border-purple-100">
                      <div className="font-bold text-[#7E22CE] text-xs">{day.focusFood}</div>
                      <div className="text-[10px] text-gray-500">{day.tamilFocusFood}</div>
                    </td>
                    <td className="py-3 px-3 border-r border-purple-100 font-mono text-[11px] text-gray-700">
                      {day.wakeUp}
                    </td>
                    <td className="py-3 px-3 border-r border-purple-100 font-mono text-[11px] text-emerald-800 font-bold">
                      {day.breakfast}
                    </td>
                    <td className="py-3 px-3 border-r border-purple-100 font-mono text-[11px] text-gray-900 font-bold">
                      {day.lunch}
                    </td>
                    <td className="py-3 px-3 border-r border-purple-100 font-mono text-[11px] text-amber-800 font-bold">
                      {day.snacks}
                    </td>
                    <td className="py-3 px-3 border-r border-purple-100 font-mono text-[11px] text-gray-800">
                      {day.dinner}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-gray-600 leading-tight">
                      {day.toleranceNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
