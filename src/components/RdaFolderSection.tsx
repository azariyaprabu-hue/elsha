import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Calendar,
  Printer,
  Scale,
  Activity,
  User,
  Heart,
  ChevronRight,
  Search,
} from 'lucide-react';
import { GeneralInfo, Calculations } from '../types';
import {
  getActiveRdaTargets,
  saveActiveRdaTargets,
  buildPatientRdaProfile,
} from '../utils/nutritionStore';
import {
  PatientRdaTargets,
  RdaNutrientItem,
  AVAILABLE_MICRONUTRIENT_CATALOG,
} from '../utils/rdaCalculationEngine';

export interface RdaFolderSectionProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  selectedCategory?: string;
  onNavigateToDietPlan?: () => void;
  onNavigateToPrescription?: () => void;
}

export const RdaFolderSection: React.FC<RdaFolderSectionProps> = ({
  generalInfo,
  calculations,
  selectedCategory = 'Diabetes Mellitus',
  onNavigateToDietPlan,
  onNavigateToPrescription,
}) => {
  const [rdaTargets, setRdaTargets] = useState<PatientRdaTargets>(() =>
    getActiveRdaTargets(generalInfo, calculations, selectedCategory)
  );

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [searchFilter, setSearchSearchFilter] = useState<string>('');
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Sync targets when patient demographics or selected domain change
  useEffect(() => {
    const updated = getActiveRdaTargets(generalInfo, calculations, selectedCategory);
    setRdaTargets(updated);
  }, [generalInfo.name, generalInfo.weight, generalInfo.height, generalInfo.age, generalInfo.sex, selectedCategory]);

  const profile = rdaTargets.profile || buildPatientRdaProfile(generalInfo, calculations, selectedCategory);

  // Handle target change for a specific nutrient
  const handleTargetChange = (id: string, newTargetValue: number) => {
    const updatedList = rdaTargets.nutrients.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          prescribedTarget: Math.max(0, newTargetValue),
          isEdited: newTargetValue !== item.referenceRda,
        };
      }
      return item;
    });

    const updatedTargets: PatientRdaTargets = {
      ...rdaTargets,
      nutrients: updatedList,
      lastSaved: new Date().toISOString(),
    };

    setRdaTargets(updatedTargets);
  };

  // Reset single nutrient back to reference RDA
  const handleResetNutrient = (id: string) => {
    const updatedList = rdaTargets.nutrients.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          prescribedTarget: item.referenceRda,
          isEdited: false,
        };
      }
      return item;
    });

    setRdaTargets({
      ...rdaTargets,
      nutrients: updatedList,
    });
  };

  // Add nutrient from catalog
  const handleAddNutrientFromCatalog = () => {
    if (!selectedCatalogId) return;
    const catalogItem = AVAILABLE_MICRONUTRIENT_CATALOG.find((c) => c.id === selectedCatalogId);
    if (!catalogItem) return;

    if (rdaTargets.nutrients.some((n) => n.id === catalogItem.id)) {
      alert(`${catalogItem.name} is already present in the RDA table.`);
      return;
    }

    const calculated = catalogItem.calculateRda(profile);

    const newItem: RdaNutrientItem = {
      id: catalogItem.id,
      name: catalogItem.name,
      category: catalogItem.category,
      unit: catalogItem.unit,
      referenceRda: calculated.ref,
      prescribedTarget: calculated.target,
      basisReference: calculated.basis,
      patientSpecificAdjustment: calculated.adj,
      isCustomAdded: true,
      isEdited: false,
    };

    setRdaTargets({
      ...rdaTargets,
      nutrients: [...rdaTargets.nutrients, newItem],
    });
    setSelectedCatalogId('');
  };

  // Remove nutrient from table
  const handleRemoveNutrient = (id: string) => {
    const updated = rdaTargets.nutrients.filter((n) => n.id !== id);
    setRdaTargets({
      ...rdaTargets,
      nutrients: updated,
    });
  };

  // Save targets as Single Source of Truth
  const handleSaveTargets = () => {
    saveActiveRdaTargets(rdaTargets);
    setSavedNotice('✓ Prescribed RDA targets successfully saved as Single Source of Truth!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // Reset all targets back to default ICMR 2020 calculations
  const handleResetAllToIcmr = () => {
    if (confirm('Reset all nutrient targets back to standard ICMR-NIN 2020 RDA benchmarks?')) {
      localStorage.removeItem('ZIATHLON_PATIENT_RDA_TARGETS');
      const fresh = getActiveRdaTargets(generalInfo, calculations, selectedCategory);
      setRdaTargets(fresh);
      setSavedNotice('✓ Reset all nutrients to standard ICMR-NIN 2020 reference values.');
      setTimeout(() => setSavedNotice(null), 3000);
    }
  };

  const filteredNutrients = rdaTargets.nutrients.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300 select-text">
      {/* ========================================================================= */}
      {/* 1. HEADER BANNER & PATIENT PROFILE SUMMARY CARD                           */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9C4A5]/70 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#8C5E28] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8C5E28]">
                  Folder 03 • Nutrition
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                  ICMR-NIN 2020 RDA & EAR Grounded
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#2E1C07] uppercase tracking-wider mt-0.5">
                PATIENT-SPECIFIC NUTRIENT REQUIREMENT SYSTEM (RDA)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSaveTargets}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4 text-emerald-200" />
              <span>Save Nutrient Targets</span>
            </button>
            <button
              type="button"
              onClick={handleResetAllToIcmr}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
              title="Reset all targets to default ICMR RDA calculation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Patient Profile Demographics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9C4A5]/60 space-y-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">Patient</span>
            <span className="text-xs font-black text-[#2E1C07] truncate block">
              {generalInfo.name || 'Kiruthika Sundar'}
            </span>
            <span className="text-[10px] text-gray-600 font-medium block">
              {profile.age} yrs • {profile.sex}
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9C4A5]/60 space-y-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">Height & Weight</span>
            <span className="text-xs font-black text-[#2E1C07] block font-mono">
              {profile.heightCm} cm | {profile.weightKg} kg
            </span>
            <span className="text-[10px] text-amber-800 font-bold block">
              {profile.weightKg - profile.idealBodyWeightKg > 0
                ? `+${(profile.weightKg - profile.idealBodyWeightKg).toFixed(1)} kg (Act)`
                : `${(profile.weightKg - profile.idealBodyWeightKg).toFixed(1)} kg (Act)`}
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9C4A5]/60 space-y-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">BMI</span>
            <span className="text-xs font-black text-[#2E1C07] block font-mono">
              {profile.bmi} kg/m²
            </span>
            <span className="text-[10px] text-emerald-800 font-bold block">
              {profile.bmi >= 18.5 && profile.bmi <= 22.9 ? 'Normal Range' : profile.bmi > 22.9 ? 'Overweight / Class 1' : 'Underweight'}
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9C4A5]/60 space-y-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">Ideal Wt (IBW)</span>
            <span className="text-xs font-black text-purple-900 block font-mono">
              {profile.idealBodyWeightKg} kg
            </span>
            <span className="text-[10px] text-gray-500 font-medium block">ICMR Reference</span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9C4A5]/60 space-y-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">BMR / Basal</span>
            <span className="text-xs font-black text-amber-900 block font-mono">
              {profile.bmr} kcal
            </span>
            <span className="text-[10px] text-gray-500 font-medium block">Mifflin-St Jeor</span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9C4A5]/60 space-y-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">TDEE / PAL</span>
            <span className="text-xs font-black text-emerald-900 block font-mono">
              {profile.tdee} kcal
            </span>
            <span className="text-[10px] text-gray-600 font-medium capitalize truncate block">
              {profile.activityLevel.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Clinical Domain / Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white/60 p-2.5 rounded-xl border border-[#D9C4A5]/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#8C5E28] font-mono uppercase text-[10px]">Clinical Condition & Domain:</span>
            <span className="font-black text-purple-950 bg-purple-100/80 px-2.5 py-0.5 rounded-md font-sans">
              {selectedCategory || generalInfo.tag || 'Diabetes Mellitus'}
            </span>
            <span className="text-gray-600 font-medium hidden sm:inline">
              • Fasting BG: {profile.fastingGlucose} mg/dL • Target Calibrated
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500 italic">
            Single Source of Truth across 7-Day Diet Studio & Rx Prescription
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN RDA NUTRIENTS TABLE                                               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-4">
        {/* Table Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search nutrients or categories..."
              value={searchFilter}
              onChange={(e) => setSearchSearchFilter(e.target.value)}
              className="w-full bg-white px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold text-gray-500">Filter Category:</span>
            {['ALL', 'Macronutrient', 'Mineral', 'Vitamin', 'Electrolyte', 'Fluid'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#8C5E28] text-white shadow-2xs'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#8C5E28] text-white font-extrabold text-[11px] uppercase tracking-wider font-mono">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Nutrient Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-3 text-center">Reference RDA</th>
                <th className="py-3 px-4 text-center">Prescribed Target</th>
                <th className="py-3 px-3">Clinical Rationale / Notes</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-gray-900">
              {filteredNutrients.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-amber-50/40 transition-colors ${
                    item.isEdited ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono text-gray-500 text-[10px] font-bold">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-black text-gray-950 text-xs">
                    {item.name}
                    {item.isEdited && (
                      <span className="ml-2 text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                        Customized
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 font-mono">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-600 text-xs">
                    {item.unit}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-extrabold text-gray-800 bg-gray-50/80">
                    {item.referenceRda} {item.unit}
                  </td>
                  <td className="py-2.5 px-4 text-center bg-purple-50/50">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        step={item.unit === 'g' || item.unit === 'L' ? '0.1' : '1'}
                        value={item.prescribedTarget}
                        onChange={(e) => handleTargetChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-24 text-center font-mono font-black text-xs p-1.5 border-2 border-purple-300 rounded-lg bg-white text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-[10px] font-mono text-gray-500 font-bold">{item.unit}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 text-[11px]">
                    {item.patientSpecificAdjustment || item.basisReference || 'ICMR-NIN 2020 reference standard'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.isEdited && (
                        <button
                          type="button"
                          onClick={() => handleResetNutrient(item.id)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-purple-700 cursor-pointer"
                          title="Reset to reference RDA"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveNutrient(item.id)}
                        className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 cursor-pointer"
                        title="Remove nutrient from patient table"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Micronutrient from Catalog */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/60 p-3.5 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#7016B7]" />
            <span className="text-xs font-extrabold text-purple-950 uppercase tracking-tight">
              Add Nutrient from ICMR Catalog:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <select
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
              className="w-full bg-white px-3 py-1.5 text-xs font-bold border border-purple-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">-- Select ICMR Micronutrient --</option>
              {AVAILABLE_MICRONUTRIENT_CATALOG.map((item) => {
                const calc = item.calculateRda(profile);
                return (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category}) - Ref: {calc.ref} {item.unit}
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              onClick={handleAddNutrientFromCatalog}
              disabled={!selectedCatalogId}
              className="px-4 py-1.5 rounded-lg bg-[#8C5E28] hover:bg-[#724B1E] text-white font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40 transition-all shrink-0"
            >
              + Add Nutrient
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION BUTTONS TO NEXT STAGES                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF6ED] border-2 border-[#D9C4A5] shadow-sm">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <Info className="w-4 h-4 text-[#8C5E28] shrink-0" />
          <span>
            Saving these nutrient targets calibrates the <strong>7-Day Diet Plan Studio</strong> and <strong>Rx Prescription</strong> automatically.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToDietPlan && (
            <button
              type="button"
              onClick={() => {
                handleSaveTargets();
                onNavigateToDietPlan();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#8C5E28] hover:bg-[#724B1E] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Proceed to 7-Day Diet Plan →</span>
            </button>
          )}

          {onNavigateToPrescription && (
            <button
              type="button"
              onClick={() => {
                handleSaveTargets();
                onNavigateToPrescription();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0B0826] hover:bg-[#1A1448] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4 text-purple-200" />
              <span>Open Rx Prescription →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
