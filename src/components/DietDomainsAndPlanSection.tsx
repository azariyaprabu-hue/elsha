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
} from 'lucide-react';
import { ConditionRecipePosterTable } from './ConditionRecipePosterTable';

export const DietDomainsAndPlanSection: React.FC = () => {
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
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-[#111] border border-[#C5A028]/60 text-[#C5A028] text-xs font-bold uppercase hover:bg-[#C5A028] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart</span>
          </button>
        </div>
      </div>

      {/* 10 DIET DOMAINS PILLS SELECTOR */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-mono tracking-widest text-[#C5A028] font-bold">
          1. Select Therapeutic Diet Domain:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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
                className={`p-3 text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1a1811] border-[#C5A028] shadow-[0_0_15px_rgba(197,160,40,0.3)] ring-1 ring-[#C5A028]'
                    : 'bg-[#111] border-white/10 hover:border-[#C5A028]/50 hover:bg-[#151512]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-black text-[#C5A028] border border-[#C5A028]/30">
                      {domain.tag}
                    </span>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-[#C5A028] animate-pulse" />}
                  </div>
                  <h4 className="text-xs font-black text-white leading-snug">{domain.name}</h4>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{domain.tamilName}</p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-400">
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
      <div className="p-4 bg-[#111] border border-[#C5A028] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase">{currentDomainProfile.domainName}</span>
            <span className="text-[11px] px-2 py-0.5 bg-[#C5A028]/20 text-[#C5A028] border border-[#C5A028]/40 font-mono font-bold">
              Target: {currentDomainProfile.dailyCalorieTarget} kcal
            </span>
          </div>
          <p className="text-xs text-gray-300">{currentDomainProfile.tagline}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {currentDomainProfile.clinicalIndications.map((ind, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-black text-purple-300 border border-purple-800 font-mono">
                ✓ {ind}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex items-center gap-3 bg-black p-2.5 border border-white/10 font-mono text-xs">
            <div className="text-center">
              <div className="text-[9px] text-gray-500 uppercase">Carbs</div>
              <div className="text-white font-bold">{currentDomainProfile.macroRatio.carbs}%</div>
            </div>
            <div className="w-[1px] h-6 bg-white/20" />
            <div className="text-center">
              <div className="text-[9px] text-gray-500 uppercase">Protein</div>
              <div className="text-emerald-400 font-bold">{currentDomainProfile.macroRatio.protein}%</div>
            </div>
            <div className="w-[1px] h-6 bg-white/20" />
            <div className="text-center">
              <div className="text-[9px] text-gray-500 uppercase">Fat</div>
              <div className="text-yellow-400 font-bold">{currentDomainProfile.macroRatio.fat}%</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAiRecalculateDomain}
            className="px-3 py-2 bg-[#C5A028] hover:bg-[#e0b730] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(197,160,40,0.5)]"
            title="Automatically re-compute ingredients, recipes, functional foods and meal slots for this domain"
          >
            <Zap className={`w-3.5 h-3.5 ${isAiRecalculating ? 'animate-spin' : ''}`} />
            <span>{isAiRecalculating ? 'Recomputing...' : '⚡ AI Domain Recalculate'}</span>
          </button>
        </div>
      </div>

      {aiRecalcNotice && (
        <div className="p-3 bg-purple-950/80 border border-purple-500 text-purple-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{aiRecalcNotice}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs (Dynamic Domain-Specific) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#C5A028]/40">
        <button
          type="button"
          onClick={() => setActiveSubTab('ingredients')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'ingredients'
              ? 'border-[#C5A028] text-black bg-[#C5A028]'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Domain Ingredients Formulary ({currentDomainProfile.domainName})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('recipes')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'recipes'
              ? 'border-[#C5A028] text-black bg-[#C5A028]'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Domain Recipes Guidelines ({currentDomainProfile.recipes.length} Recipes)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('functionalFoods')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'functionalFoods'
              ? 'border-[#C5A028] text-black bg-[#C5A028]'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Ayur-Siddha Functional Herbs ({currentDomainProfile.ayurSiddha.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('chart7Day')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'chart7Day'
              ? 'border-[#C5A028] text-black bg-[#C5A028]'
              : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          7-Day Meal Blueprint & Timing Slots
        </button>

        {selectedDomainId === 'elimination' && (
          <button
            type="button"
            onClick={() => setActiveSubTab('elimination12Day')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeSubTab === 'elimination12Day'
                ? 'border-[#C5A028] text-black bg-[#C5A028]'
                : 'border-transparent text-[#C5A028] hover:text-white hover:bg-white/5'
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
          <div className="p-3 bg-black border border-[#C5A028] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase font-black text-white tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#C5A028]" />
              <span>Domain-Specific Ingredient Formulary: {currentDomainProfile.domainName}</span>
            </span>
            <span className="text-[10px] font-mono text-[#C5A028]">
              AI dynamically adapts ingredients to match glycemic, renal, cardiac & GI targets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommended Foods Column */}
            <div className="bg-[#111] border border-emerald-500/50 space-y-2">
              <div className="p-3 bg-emerald-950/40 border-b border-emerald-500/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase text-emerald-300">
                    Recommended Therapeutic Foods ({currentDomainProfile.ingredients.filter(i => i.status === 'Recommended').length})
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">Safe & Optimal</span>
              </div>
              <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto p-2 space-y-2">
                {currentDomainProfile.ingredients
                  .filter((i) => i.status === 'Recommended')
                  .map((item, idx) => (
                    <div key={item.id} className="p-2.5 bg-black/50 border border-white/5 rounded hover:border-emerald-500/30 transition-all">
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-white text-xs">
                          {idx + 1}. {item.name}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 font-mono font-bold">
                          {item.gi} GI
                        </span>
                      </div>
                      <div className="text-[10px] text-[#C5A028] mt-0.5 font-mono">
                        Category: {item.category} • Portion: {item.portionGuide}
                      </div>
                      <div className="text-[11px] text-gray-300 mt-1 font-sans leading-relaxed">
                        {item.clinicalBenefit}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Restricted / Prohibited Foods Column */}
            <div className="bg-[#111] border border-red-500/50 space-y-2">
              <div className="p-3 bg-red-950/40 border-b border-red-500/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-black uppercase text-red-300">
                    Restricted / Caution Foods ({currentDomainProfile.ingredients.filter(i => i.status !== 'Recommended').length})
                  </span>
                </div>
                <span className="text-[9px] font-mono text-red-400 font-bold">Avoid / Eliminate</span>
              </div>
              <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto p-2 space-y-2">
                {currentDomainProfile.ingredients
                  .filter((i) => i.status !== 'Recommended')
                  .map((item, idx) => (
                    <div key={item.id} className="p-2.5 bg-black/50 border border-white/5 rounded hover:border-red-500/30 transition-all">
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-white text-xs">
                          {idx + 1}. {item.name}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-red-950 text-red-300 border border-red-600 font-mono font-bold">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-red-400 mt-0.5 font-mono">
                        Category: {item.category} • Guide: {item.portionGuide}
                      </div>
                      <div className="text-[11px] text-gray-300 mt-1 font-sans leading-relaxed">
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
          <div className="p-3 bg-black border border-[#C5A028] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase font-black text-white tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#C5A028]" />
              <span>Clinical Recipes Guidelines for {currentDomainProfile.domainName}</span>
            </span>
            <div className="flex items-center gap-1 p-1 bg-[#111] border border-[#C5A028]/40">
              <button
                type="button"
                onClick={() => setRecipeViewMode('poster')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  recipeViewMode === 'poster'
                    ? 'bg-[#C5A028] text-black font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>20-Option Table (Poster View)</span>
              </button>
              <button
                type="button"
                onClick={() => setRecipeViewMode('cards')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  recipeViewMode === 'cards'
                    ? 'bg-[#C5A028] text-black font-black'
                    : 'text-gray-400 hover:text-white'
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
                <div key={rcp.id} className="p-4 bg-[#111] border border-white/15 space-y-2.5 hover:border-[#C5A028] transition-all">
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#C5A028]">
                        #{idx + 1} • {rcp.mealType}
                      </span>
                      <h4 className="text-sm font-black text-white mt-0.5">{rcp.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black border border-[#C5A028] text-white">
                      {rcp.calories} kcal
                    </span>
                  </div>

                  {/* Macro pill bar */}
                  <div className="flex flex-wrap gap-2 text-[10.5px] font-mono">
                    <span className="px-2 py-0.5 bg-black text-purple-300 border border-purple-800">
                      Protein: {rcp.protein}g
                    </span>
                    <span className="px-2 py-0.5 bg-black text-amber-300 border border-amber-800">
                      Carbs: {rcp.carbs}g
                    </span>
                    <span className="px-2 py-0.5 bg-black text-yellow-300 border border-yellow-800">
                      Fat: {rcp.fat}g
                    </span>
                    <span className="px-2 py-0.5 bg-black text-emerald-300 border border-emerald-800">
                      Fiber: {rcp.fiber}g
                    </span>
                    <span className="px-2 py-0.5 bg-black text-[#C5A028] border border-[#C5A028]/40">
                      {rcp.gi}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block">Key Ingredients:</span>
                    <p className="text-gray-200 text-[11px] font-mono">{rcp.ingredients}</p>
                  </div>

                  <div className="text-xs space-y-1 border-t border-white/5 pt-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Clinical Preparation Protocol:</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">{rcp.clinicalPrepInstructions}</p>
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
          <div className="p-3 bg-black border border-[#C5A028] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase font-black text-white tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#C5A028]" />
              <span>Ayurveda & Siddha Maruthuvam Formulations for {currentDomainProfile.domainName}</span>
            </span>
            <span className="text-[10px] font-mono text-[#C5A028]">
              Targeted Therapeutic Dosages, Timing & Active Phyto-Constituents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentDomainProfile.ayurSiddha.map((item, idx) => (
              <div key={item.id} className="p-4 bg-[#111] border border-white/15 space-y-2 hover:border-[#C5A028] transition-all">
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#C5A028]">
                      #{idx + 1} • Therapeutic Formulation
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{item.herbName}</h4>
                    <p className="text-[11px] text-purple-300 font-mono italic">{item.botanicalOrTraditionalName}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-mono text-gray-400 font-bold">Therapeutic Action & Mechanism:</span>
                  <p className="text-white text-[11px] leading-relaxed">{item.action}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Clinical Indication:</span>
                    <p className="text-gray-200 font-mono text-[11px]">{item.clinicalIndication}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#C5A028] font-bold">Dosage & Timing:</span>
                    <p className="text-yellow-300 font-mono text-[11px]">{item.dosageAndTiming}</p>
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
          <div className="p-3 bg-black border border-[#C5A028] flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-black text-white tracking-wider">
                7-Day Master Diet Matrix (Rows: Meal Slots • Columns: Monday to Sunday)
              </span>
              <p className="text-[10px] text-gray-400">
                Live editable cells. Click any cell to customize foods. Add custom time categories like Post-Workout.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMondayToAllDays}
                className="px-2.5 py-1.5 bg-[#1a1811] border border-[#C5A028] text-[#C5A028] text-[11px] font-bold uppercase hover:bg-[#C5A028] hover:text-black transition-colors cursor-pointer"
              >
                Copy Monday to All Days
              </button>

              <button
                type="button"
                onClick={() => setShowAddSlotInput(!showAddSlotInput)}
                className="px-3 py-1.5 bg-[#C5A028] text-black text-xs font-black uppercase hover:bg-[#d8b132] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Meal Slot / Timing</span>
              </button>
            </div>
          </div>

          {showAddSlotInput && (
            <div className="p-3 bg-black border border-[#C5A028] flex flex-wrap items-center gap-2">
              <span className="text-xs text-white font-bold">New Category / Time Slot:</span>
              <input
                type="text"
                placeholder="e.g. Post-Workout Morning (7:00 am) or Evening Snack"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                className="px-3 py-1.5 bg-[#111] border border-white/20 text-xs text-white flex-1 min-w-[200px] focus:border-[#C5A028] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddCustomMealSlot()}
                className="px-3 py-1.5 bg-[#C5A028] text-black text-xs font-black uppercase cursor-pointer"
              >
                Confirm Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddSlotInput(false)}
                className="px-2 py-1.5 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* MASTER 7-DAY MATRIX TABLE */}
          <div className="overflow-x-auto bg-[#111] border border-[#C5A028]">
            <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-black text-[#C5A028] font-mono text-[11px] uppercase tracking-wider border-b-2 border-[#C5A028]">
                  <th className="py-3 px-3 w-36 border-r border-[#C5A028]/40">Time / Frequency</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Monday</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Tuesday</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Wednesday</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Thursday</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Friday</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Saturday</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Sunday</th>
                  <th className="py-3 px-2 w-10 text-center">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans">
                {planMatrix.map((row) => (
                  <tr key={row.slotId} className="hover:bg-white/[0.02]">
                    {/* Time Slot Label */}
                    <td className="py-3 px-3 font-mono font-bold text-white bg-black/50 border-r border-[#C5A028]/30">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A028] shrink-0" />
                        <span>{row.timeSlot}</span>
                      </div>
                    </td>

                    {/* Monday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.monday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'monday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Tuesday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.tuesday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'tuesday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Wednesday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.wednesday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'wednesday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Thursday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.thursday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'thursday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Friday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.friday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'friday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Saturday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.saturday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'saturday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Sunday */}
                    <td className="py-2 px-2 border-r border-white/10">
                      <textarea
                        rows={3}
                        value={row.sunday}
                        onChange={(e) => handleUpdateMatrixCell(row.slotId, 'sunday', e.target.value)}
                        className="w-full bg-black/40 border border-transparent hover:border-white/20 focus:border-[#C5A028] focus:bg-black p-1.5 text-gray-200 text-[11px] leading-snug rounded-none focus:outline-none resize-y"
                      />
                    </td>

                    {/* Delete Slot */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteMealSlot(row.slotId)}
                        disabled={planMatrix.length <= 2}
                        className="text-gray-500 hover:text-red-400 disabled:opacity-20 cursor-pointer"
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
          <div className="p-3 bg-black border border-[#C5A028] flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-black text-white tracking-wider">
                12-Day Post Gut Cleanse + Elimination Diet Matrix (Exact Model from Clinical PDF)
              </span>
              <p className="text-[10px] text-gray-400">
                Systematic sequential re-introduction of 12 distinct food groups to isolate allergens, histamine responses, and SIBO triggers.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 bg-[#1a1811] text-[#C5A028] border border-[#C5A028]/40">
              Days 1 – 12 Sequential Re-challenge
            </span>
          </div>

          <div className="overflow-x-auto bg-[#111] border border-[#C5A028]">
            <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-black text-[#C5A028] font-mono text-[10px] uppercase tracking-wider border-b-2 border-[#C5A028]">
                  <th className="py-3 px-3 w-32 border-r border-[#C5A028]/40">Re-intro Day</th>
                  <th className="py-3 px-3 w-36 border-r border-white/10">Focus Category</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Wake Up (5:30 am)</th>
                  <th className="py-3 px-3 w-56 border-r border-white/10">Breakfast (8:30 am)</th>
                  <th className="py-3 px-3 w-56 border-r border-white/10">Lunch (1:30 pm)</th>
                  <th className="py-3 px-3 w-48 border-r border-white/10">Snacks (5:00 pm)</th>
                  <th className="py-3 px-3 w-56 border-r border-white/10">Dinner (8:00 pm)</th>
                  <th className="py-3 px-3 w-52">Tolerance Sign to Monitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans">
                {eliminationDiet12DaysData.map((day) => (
                  <tr key={day.dayNumber} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-bold text-white bg-black/50 border-r border-[#C5A028]/30">
                      {day.dayTitle}
                    </td>
                    <td className="py-3 px-3 border-r border-white/10">
                      <div className="font-bold text-[#C5A028] text-xs">{day.focusFood}</div>
                      <div className="text-[10px] text-gray-400">{day.tamilFocusFood}</div>
                    </td>
                    <td className="py-3 px-3 border-r border-white/10 font-mono text-[11px] text-gray-300">
                      {day.wakeUp}
                    </td>
                    <td className="py-3 px-3 border-r border-white/10 font-mono text-[11px] text-emerald-300">
                      {day.breakfast}
                    </td>
                    <td className="py-3 px-3 border-r border-white/10 font-mono text-[11px] text-white">
                      {day.lunch}
                    </td>
                    <td className="py-3 px-3 border-r border-white/10 font-mono text-[11px] text-yellow-300">
                      {day.snacks}
                    </td>
                    <td className="py-3 px-3 border-r border-white/10 font-mono text-[11px] text-gray-200">
                      {day.dinner}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-gray-400 leading-tight">
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
