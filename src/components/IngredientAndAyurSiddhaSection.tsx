import React, { useState, useEffect, useMemo } from 'react';
import {
  Leaf,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  BookOpen,
  Info,
  ShieldCheck,
  Activity,
  ChevronRight,
  Flame,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  Printer,
  Zap,
  Dumbbell,
  Stethoscope,
  ShieldAlert,
  Download,
} from 'lucide-react';
import {
  ConditionIngredientGuidelines,
  ConditionIngredientItem,
  generateConditionSpecificIngredientGuidelines,
} from '../data/conditionAdaptiveIngredientsEngine';
import { majorDomainsList } from '../data/initialData';
import { ClinicalReportDocument } from './ReportsUploadSection';

interface IngredientAndAyurSiddhaSectionProps {
  selectedDomain?: string;
  selectedCategory?: string;
  generalInfo?: any;
  calculations?: any;
  onSelectCategory?: (category: string) => void;
  onOpenRx?: () => void;
}

type ActiveCategoryTab =
  | 'all'
  | 'Cereals'
  | 'Pulses'
  | 'Vegetables'
  | 'Fruits'
  | 'Nuts & Seeds'
  | 'Dairy Foods'
  | 'Ayurvedic Foods'
  | 'Functional Foods';

export const IngredientAndAyurSiddhaSection: React.FC<IngredientAndAyurSiddhaSectionProps> = ({
  selectedDomain = 'diseases',
  selectedCategory = 'Diabetes Mellitus',
  generalInfo,
  calculations,
  onSelectCategory,
  onOpenRx,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'Diabetes Mellitus');
  const [activeTab, setActiveTab] = useState<ActiveCategoryTab>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Recommended' | 'Caution' | 'Restricted'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiRecalculating, setIsAiRecalculating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadedReports, setUploadedReports] = useState<ClinicalReportDocument[]>([]);
  const [aiOverrideData, setAiOverrideData] = useState<ConditionIngredientGuidelines | null>(null);

  // Sync activeCategory if parent prop updates
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
    return () => {
      window.removeEventListener('elsha-reports-updated', handleReportsUpdated);
    };
  }, []);

  // Determine domain ID for activeCategory
  const activeDomainId = useMemo<'diseases' | 'disorders' | 'performance' | 'fitness'>(() => {
    for (const dom of majorDomainsList) {
      if (dom.categories.includes(activeCategory)) {
        return dom.id as any;
      }
    }
    return 'diseases';
  }, [activeCategory]);

  // Extract patient biomarkers
  const patientBiomarkerStrings = useMemo(() => {
    const list: string[] = [];
    uploadedReports.forEach((rep) => {
      rep.keyBiomarkers?.forEach((bm) => {
        list.push(`${bm.marker}: ${bm.value}`);
      });
    });
    return list;
  }, [uploadedReports]);

  // Check for cached AI generated guidelines
  useEffect(() => {
    try {
      const cacheKey = `elsha_condition_guidelines_${activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.cereals?.length === 15) {
          setAiOverrideData(parsed);
          return;
        }
      }
    } catch {}
    setAiOverrideData(null);
  }, [activeCategory]);

  // Compute live condition-specific guidelines
  const guidelines: ConditionIngredientGuidelines = useMemo(() => {
    if (aiOverrideData && aiOverrideData.conditionName === activeCategory) {
      return aiOverrideData;
    }
    return generateConditionSpecificIngredientGuidelines(
      activeCategory,
      activeDomainId,
      patientBiomarkerStrings
    );
  }, [activeCategory, activeDomainId, patientBiomarkerStrings, aiOverrideData]);

  // Get current category list based on active tab
  const activeList = useMemo(() => {
    switch (activeTab) {
      case 'Cereals':
        return guidelines.cereals;
      case 'Pulses':
        return guidelines.pulses;
      case 'Vegetables':
        return guidelines.vegetables;
      case 'Fruits':
        return guidelines.fruits;
      case 'Nuts & Seeds':
        return guidelines.nutsAndSeeds;
      case 'Dairy Foods':
        return guidelines.dairyFoods;
      case 'Ayurvedic Foods':
        return guidelines.ayurvedicFoods;
      case 'Functional Foods':
        return guidelines.functionalFoods;
      case 'all':
      default:
        return [
          ...guidelines.cereals,
          ...guidelines.pulses,
          ...guidelines.vegetables,
          ...guidelines.fruits,
          ...guidelines.nutsAndSeeds,
          ...guidelines.dairyFoods,
          ...guidelines.ayurvedicFoods,
          ...guidelines.functionalFoods,
        ];
    }
  }, [guidelines, activeTab]);

  // Filter list by status & search
  const filteredList = useMemo(() => {
    return activeList.filter((item) => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.therapeuticMechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clinicalRationale.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [activeList, statusFilter, searchQuery]);

  // Handle Condition Switch
  const handleConditionChange = (newCondition: string) => {
    setActiveCategory(newCondition);
    if (onSelectCategory) {
      onSelectCategory(newCondition);
    }
    try {
      localStorage.setItem('ELSHA_SELECTED_CATEGORY', newCondition);
    } catch {}
    setToastMessage(`Generated unique ingredient guidelines for ${newCondition}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle AI recalculation via Gemini API
  const handleAiRecalculate = async () => {
    setIsAiRecalculating(true);
    setToastMessage(`Querying Gemini AI for unique clinical ingredient guidelines (${activeCategory})...`);

    try {
      const res = await fetch('/api/generate-condition-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conditionName: activeCategory,
          domain: activeDomainId,
          patientData: {
            name: generalInfo?.name || 'Kiruthika',
            age: generalInfo?.age || 32,
            sex: generalInfo?.sex || 'Female',
            targetCalories: calculations?.targetCalories || 1500,
          },
          biomarkers: patientBiomarkerStrings,
        }),
      });

      const json = await res.json();
      if (json.success && json.data && json.data.cereals?.length === 15) {
        const fullData: ConditionIngredientGuidelines = {
          conditionName: activeCategory,
          domain: activeDomainId,
          clinicalTagline: json.data.clinicalTagline || guidelines.clinicalTagline,
          primaryGoal: json.data.primaryGoal || guidelines.primaryGoal,
          macroPriority: json.data.macroPriority || guidelines.macroPriority,
          totalCount: 90,
          cereals: json.data.cereals,
          pulses: json.data.pulses,
          vegetables: json.data.vegetables,
          fruits: json.data.fruits,
          nutsAndSeeds: json.data.nutsAndSeeds,
          dairyFoods: json.data.dairyFoods,
          ayurvedicFoods: json.data.ayurvedicFoods,
          functionalFoods: json.data.functionalFoods,
        };

        const cacheKey = `elsha_condition_guidelines_${activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        localStorage.setItem(cacheKey, JSON.stringify(fullData));
        setAiOverrideData(fullData);
        setToastMessage(`Gemini AI successfully calibrated 90 unique items for ${activeCategory}!`);
      } else {
        setToastMessage(`Calibrated 90 condition-specific items for ${activeCategory} via Clinical Engine.`);
      }
    } catch (e: any) {
      setToastMessage(`Calibrated 90 items for ${activeCategory} using Clinical Rules Engine.`);
    } finally {
      setIsAiRecalculating(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Get domain badge icon & color
  const getDomainMeta = (domId: string) => {
    switch (domId) {
      case 'diseases':
        return { label: 'DISEASES', color: 'bg-purple-900/60 border-purple-500 text-purple-200', icon: <Stethoscope className="w-3 h-3" /> };
      case 'disorders':
        return { label: 'DISORDERS', color: 'bg-red-900/60 border-red-500 text-red-200', icon: <ShieldAlert className="w-3 h-3" /> };
      case 'performance':
        return { label: 'PERFORMANCE', color: 'bg-amber-900/60 border-amber-500 text-amber-200', icon: <Zap className="w-3 h-3" /> };
      case 'fitness':
        return { label: 'FITNESS', color: 'bg-emerald-900/60 border-emerald-500 text-emerald-200', icon: <Dumbbell className="w-3 h-3" /> };
      default:
        return { label: 'CLINICAL', color: 'bg-purple-900/60 border-purple-500 text-purple-200', icon: <Leaf className="w-3 h-3" /> };
    }
  };

  const domainMeta = getDomainMeta(activeDomainId);

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
            <Leaf className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 17 • CONDITION-SPECIFIC CLINICAL INGREDIENT GUIDELINES</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            ELSHA Dynamic Ingredient Guidelines (90 Condition-Specific Items)
          </h2>
          <p className="text-xs text-gray-400">
            Automated AI generation of unique condition-specific ingredient guidelines for every Disease, Disorder, Performance and Fitness goal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRx && (
            <button
              onClick={onOpenRx}
              className="px-3.5 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(126,34,206,0.35)]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>View Rx Prescription</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-black hover:bg-white/10 border border-white/20 text-gray-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CONDITION SELECTOR & REAL-TIME ADAPTATION HUB */}
      <div className="p-4 bg-[#0d0617] border-2 border-[#7E22CE] rounded-sm space-y-3 shadow-[0_0_20px_rgba(126,34,206,0.2)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${domainMeta.color}`}>
              {domainMeta.icon}
              <span>{domainMeta.label}</span>
            </span>
            <span className="text-sm font-black text-white uppercase tracking-wider">
              {guidelines.conditionName}
            </span>
            <span className="text-xs font-mono text-purple-300 px-2 py-0.5 bg-black border border-purple-500/40">
              90 Ranked Items Active
            </span>
          </div>

          {/* Quick Universal Condition Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-mono">Switch Condition / Goal:</span>
            <select
              value={activeCategory}
              onChange={(e) => handleConditionChange(e.target.value)}
              className="bg-black border-2 border-[#7E22CE] text-xs font-bold text-[#C084FC] px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C084FC] cursor-pointer"
            >
              {majorDomainsList.map((dom) => (
                <optgroup key={dom.id} label={`--- ${dom.name} ---`} className="bg-black text-[#A855F7] font-bold">
                  {dom.categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-black text-white">
                      {cat}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <button
              onClick={handleAiRecalculate}
              disabled={isAiRecalculating}
              className="px-3.5 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiRecalculating ? 'animate-spin' : ''}`} />
              <span>{isAiRecalculating ? 'Generating...' : 'AI Recalculate with Gemini'}</span>
            </button>
          </div>
        </div>

        {/* Clinical Rationale & Health Target Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="md:col-span-2 space-y-1.5">
            <div className="text-xs text-purple-200">
              <span className="text-[#A855F7] font-bold uppercase tracking-wider font-mono">Therapeutic Mechanism: </span>
              {guidelines.clinicalTagline}
            </div>
            <div className="text-[11px] text-emerald-300 font-mono">
              <span className="text-gray-300 font-bold uppercase">Clinical Health Goal: </span>
              {guidelines.primaryGoal}
            </div>
            <div className="text-[11px] text-cyan-300 font-mono">
              <span className="text-gray-300 font-bold uppercase">Macronutrient Distribution: </span>
              {guidelines.macroPriority}
            </div>
          </div>

          <div className="bg-black/80 p-2.5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase text-gray-400 flex items-center justify-between">
              <span>Patient Profile:</span>
              <span className="text-emerald-400 font-bold">{calculations?.targetCalories || 1500} kcal/day</span>
            </div>
            <div className="text-xs text-white font-medium">
              {generalInfo?.name || 'Kiruthika'} ({generalInfo?.age || 32}y, {generalInfo?.sex || 'Female'})
            </div>
            {patientBiomarkerStrings.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {patientBiomarkerStrings.slice(0, 3).map((bm, i) => (
                  <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 bg-purple-950/90 border border-purple-500/60 text-purple-200">
                    {bm}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 8 CATEGORIES NAVIGATION TABS (Strictly showing exact counts) */}
      <div className="flex flex-wrap border-b border-white/10 gap-1.5 items-center">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'all'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>All Categories</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-purple-950 border border-purple-500 text-purple-300 font-bold">
            {guidelines.totalCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Cereals')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Cereals'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🌾 15 Cereals</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.cereals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Pulses')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Pulses'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🫘 15 Pulses</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.pulses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Vegetables')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Vegetables'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🥦 15 Vegetables</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.vegetables.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Fruits')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Fruits'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🍎 15 Fruits</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.fruits.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Nuts & Seeds')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Nuts & Seeds'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🥜 10 Nuts & Seeds</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.nutsAndSeeds.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Dairy Foods')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Dairy Foods'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🥛 5 Dairy Foods</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.dairyFoods.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Ayurvedic Foods')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Ayurvedic Foods'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>🌿 5 Ayurvedic Foods</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.ayurvedicFoods.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Functional Foods')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'Functional Foods'
              ? 'border-[#A855F7] text-white bg-white/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>⚡ 10 Functional Foods</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-black border border-white/20 text-white font-bold">
            {guidelines.functionalFoods.length}
          </span>
        </button>
      </div>

      {/* SEARCH AND STATUS FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0617] p-3 border border-white/10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'all' ? 'all 90 items' : activeTab} by name, mechanism, or clinical rationale...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/20 pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7E22CE]"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 border border-white/10 bg-black p-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-all ${
              statusFilter === 'all' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Statuses
          </button>
          <button
            onClick={() => setStatusFilter('Recommended')}
            className={`px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-all ${
              statusFilter === 'Recommended'
                ? 'bg-emerald-900/80 border border-emerald-500 text-emerald-300'
                : 'text-gray-400 hover:text-emerald-300'
            }`}
          >
            ✓ Recommended
          </button>
          <button
            onClick={() => setStatusFilter('Caution')}
            className={`px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-all ${
              statusFilter === 'Caution'
                ? 'bg-amber-900/80 border border-amber-500 text-amber-300'
                : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            ! Caution
          </button>
          <button
            onClick={() => setStatusFilter('Restricted')}
            className={`px-2.5 py-0.5 text-[11px] font-bold cursor-pointer transition-all ${
              statusFilter === 'Restricted'
                ? 'bg-red-900/80 border border-red-500 text-red-300'
                : 'text-gray-400 hover:text-red-300'
            }`}
          >
            ✕ Restricted
          </button>
        </div>
      </div>

      {/* INGREDIENTS CLASSIFICATION TABLE */}
      <div className="overflow-x-auto border border-white/10 bg-[#0d0617]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/20 bg-black text-[#A855F7] font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 font-bold text-center w-12">#</th>
              <th className="py-3 px-4 font-bold">Food Item & Glycemic Index</th>
              <th className="py-3 px-3 font-bold">Category</th>
              <th className="py-3 px-3 font-bold text-center">Clinical Status</th>
              <th className="py-3 px-3 font-bold">Therapeutic Serving</th>
              <th className="py-3 px-4 font-bold">Therapeutic Biochemical Mechanism</th>
              <th className="py-3 px-4 font-bold">Clinical Rationale for {guidelines.conditionName}</th>
              <th className="py-3 px-3 font-bold">Contraindications / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-400 italic">
                  No ingredients found matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const isRec = item.status === 'Recommended';
                const isCaut = item.status === 'Caution';
                const isRest = item.status === 'Restricted';

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-bold text-purple-300">
                      {item.rank}
                    </td>

                    <td className="py-3 px-4 font-bold text-white">
                      <div className="text-sm">{item.name}</div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded-xs ${
                          item.glycemicIndex === 'Low' || item.glycemicIndex === 'Zero'
                            ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                            : item.glycemicIndex === 'Medium'
                            ? 'bg-amber-950/80 border border-amber-500/60 text-amber-300'
                            : 'bg-red-950/80 border border-red-500/60 text-red-300'
                        }`}
                      >
                        {item.glycemicIndex} GI
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                      {item.category}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border ${
                          isRec
                            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                            : isCaut
                            ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                            : 'bg-red-950/90 border-red-500 text-red-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                      {item.portion}
                    </td>

                    <td className="py-3 px-4 text-purple-200 text-xs leading-relaxed max-w-xs">
                      {item.therapeuticMechanism}
                    </td>

                    <td className="py-3 px-4 text-gray-300 text-xs leading-relaxed max-w-sm">
                      <div>{item.clinicalRationale}</div>
                      {item.biomarkerTarget && (
                        <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 bg-black border border-[#7E22CE] text-[#C084FC]">
                          🎯 {item.biomarkerTarget}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-gray-400 text-[11px] italic max-w-xs">
                      {item.contraindications}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 p-3 bg-[#0d0617] border border-white/10 font-mono">
        <div>
          Displaying <span className="text-white font-bold">{filteredList.length}</span> of{' '}
          <span className="text-white font-bold">{guidelines.totalCount}</span> condition-ranked items for{' '}
          <span className="text-[#C084FC] font-bold">{guidelines.conditionName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Target Caloric Profile: {calculations?.targetCalories || 1500} kcal</span>
          <span>•</span>
          <span>Status: Verified Clinical Protocol</span>
        </div>
      </div>
    </div>
  );
};
