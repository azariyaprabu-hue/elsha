import React, { useState, useEffect } from 'react';
import { SymptomAssessmentItem, SymptomSeverity } from '../types';
import {
  domainSpecificSymptoms,
  domainCategoriesMapping,
  domainAdditionalSuggestedSymptoms,
} from '../data/domainSymptomsData';
import {
  AlertCircle,
  Plus,
  CheckCircle,
  Sparkles,
  Activity,
  Trash2,
  Stethoscope,
  ShieldAlert,
  Zap,
  Dumbbell,
  Tag,
  Check,
  X,
} from 'lucide-react';

interface SymptomsAssessmentSectionProps {
  symptoms: SymptomAssessmentItem[];
  domainName: string;
  categoryName: string;
  onUpdateSymptom: (id: string, updated: Partial<SymptomAssessmentItem>) => void;
  onAddSymptom: () => void;
  onDeleteSymptom?: (id: string) => void;
  onUpdateAllSymptoms?: (symptoms: SymptomAssessmentItem[]) => void;
}

type MajorDomainTab = 'DISEASES' | 'DISORDERS' | 'PERFORMANCE' | 'FITNESS';

export const SymptomsAssessmentSection: React.FC<SymptomsAssessmentSectionProps> = ({
  symptoms: initialSymptoms,
  domainName,
  categoryName,
  onUpdateSymptom,
  onAddSymptom,
  onDeleteSymptom,
  onUpdateAllSymptoms,
}) => {
  // Determine initial major domain tab
  const getInitialTab = (catName: string): MajorDomainTab => {
    for (const [dom, cats] of Object.entries(domainCategoriesMapping)) {
      if (cats.some((c) => c.toLowerCase() === catName.toLowerCase())) {
        return dom as MajorDomainTab;
      }
    }
    return 'DISEASES';
  };

  const [activeMajorTab, setActiveMajorTab] = useState<MajorDomainTab>(() => getInitialTab(categoryName));

  // Find initial matching condition
  const availableConditions = domainCategoriesMapping[activeMajorTab];
  const initialCondition =
    availableConditions.find((c) => c.toLowerCase() === categoryName.toLowerCase()) ||
    availableConditions[0] ||
    'Diabetes Mellitus';

  const [activeCondition, setActiveCondition] = useState<string>(initialCondition);
  const [currentSymptoms, setCurrentSymptoms] = useState<SymptomAssessmentItem[]>(() => {
    if (initialSymptoms && initialSymptoms.length > 0) {
      return initialSymptoms.map((s) => ({ ...s, selected: s.selected !== false }));
    }
    const defaultSyms = domainSpecificSymptoms[initialCondition] || [];
    return defaultSyms.map((s) => ({ ...s, selected: true }));
  });

  // Master helper to sync to parent state immediately
  const syncSymptomsToParent = (newList: SymptomAssessmentItem[]) => {
    setCurrentSymptoms(newList);
    onUpdateAllSymptoms?.(newList);
  };

  // Sync if initialSymptoms prop changes externally
  useEffect(() => {
    if (initialSymptoms && initialSymptoms.length > 0) {
      setCurrentSymptoms(initialSymptoms.map((s) => ({ ...s, selected: s.selected !== false })));
    }
  }, [initialSymptoms]);

  // Modal / drawer state for adding symptoms from domain
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [customSymptomText, setCustomSymptomText] = useState<string>('');
  const [customDuration, setCustomDuration] = useState<string>('2 weeks');
  const [customSeverity, setCustomSeverity] = useState<SymptomSeverity>('Moderate');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // When major tab changes, pick first condition
  const handleSelectMajorTab = (tab: MajorDomainTab) => {
    setActiveMajorTab(tab);
    const firstCond = domainCategoriesMapping[tab][0];
    if (firstCond) {
      handleSelectCondition(firstCond);
    }
  };

  // When condition changes, load its clinical symptoms and immediately push to parent preview
  const handleSelectCondition = (cond: string) => {
    setActiveCondition(cond);
    const syms = domainSpecificSymptoms[cond] || [];
    const mapped = syms.map((s) => ({
      ...s,
      selected: true,
    }));
    syncSymptomsToParent(mapped);
    setActionNotice(`Calibrated symptoms for ${cond} (${mapped.length} loaded & synced to preview)`);
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Auto-fill symptoms listener from uploaded files
  useEffect(() => {
    const handler = (e: any) => {
      const symList: string[] = e.detail;
      if (Array.isArray(symList) && symList.length > 0) {
        const newItems: SymptomAssessmentItem[] = symList.map((sym, idx) => ({
          id: `auto-sym-${Date.now()}-${idx}`,
          symptom: typeof sym === 'string' ? sym : (sym as any).symptom || 'Clinical Symptom',
          duration: (sym as any).duration || 'Persistent',
          severity: (sym as any).severity || 'Moderate',
          selected: true,
        }));
        const updated = [...newItems, ...currentSymptoms];
        syncSymptomsToParent(updated);
        setActionNotice(`Auto-extracted ${newItems.length} symptoms and updated preview report`);
        setTimeout(() => setActionNotice(null), 3000);
      }
    };
    window.addEventListener('ELSHA_SYMPTOMS_AUTOFILLED', handler);
    return () => window.removeEventListener('ELSHA_SYMPTOMS_AUTOFILLED', handler);
  }, [currentSymptoms]);

  // Toggle single symptom checkbox selection for preview document
  const handleToggleSymptomSelection = (id: string) => {
    const updated = currentSymptoms.map((s) =>
      s.id === id ? { ...s, selected: s.selected === false ? true : false } : s
    );
    syncSymptomsToParent(updated);
    const item = updated.find((s) => s.id === id);
    setActionNotice(
      item?.selected
        ? `Added "${item.symptom}" to Preview Report`
        : `Removed "${item?.symptom}" from Preview Report`
    );
    setTimeout(() => setActionNotice(null), 1800);
  };

  // Select all or deselect all for preview document
  const handleSelectAll = (selectAll: boolean) => {
    const updated = currentSymptoms.map((s) => ({ ...s, selected: selectAll }));
    syncSymptomsToParent(updated);
    setActionNotice(
      selectAll
        ? `All ${updated.length} symptoms selected for Preview Report`
        : 'All symptoms cleared from Preview Report'
    );
    setTimeout(() => setActionNotice(null), 2000);
  };

  const handleUpdateLocalSymptom = (id: string, updated: Partial<SymptomAssessmentItem>) => {
    const newList = currentSymptoms.map((s) => (s.id === id ? { ...s, ...updated } : s));
    syncSymptomsToParent(newList);
    onUpdateSymptom(id, updated);
  };

  // Delete symptom (used both in Pathology Overview and in table)
  const handleDeleteLocalSymptom = (id: string, symptomName: string) => {
    const newList = currentSymptoms.filter((s) => s.id !== id);
    syncSymptomsToParent(newList);
    if (onDeleteSymptom) {
      onDeleteSymptom(id);
    }
    setActionNotice(`Deleted indicator: "${symptomName}" (Preview updated)`);
    setTimeout(() => setActionNotice(null), 2000);
  };

  // Add custom symptom
  const handleAddCustomSymptom = () => {
    const symName = customSymptomText.trim() || `Custom Sign (${activeCondition})`;
    const newSym: SymptomAssessmentItem = {
      id: `sym-${Date.now()}`,
      symptom: symName,
      duration: customDuration || '1 month',
      severity: customSeverity || 'Moderate',
      selected: true,
    };
    const newList = [newSym, ...currentSymptoms];
    syncSymptomsToParent(newList);
    setCustomSymptomText('');
    setShowAddMenu(false);
    setActionNotice(`Added symptom: "${symName}" and synced to preview`);
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Quick add one of the domain-suggested symptoms
  const handleAddSuggestedSymptom = (suggestedText: string) => {
    if (currentSymptoms.some((s) => s.symptom.toLowerCase() === suggestedText.toLowerCase())) {
      setActionNotice(`"${suggestedText}" is already in assessment`);
      setTimeout(() => setActionNotice(null), 2000);
      return;
    }
    const newSym: SymptomAssessmentItem = {
      id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      symptom: suggestedText,
      duration: '2 weeks',
      severity: 'Moderate',
      selected: true,
    };
    const newList = [...currentSymptoms, newSym];
    syncSymptomsToParent(newList);
    setActionNotice(`Added: "${suggestedText}" and synced to preview`);
    setTimeout(() => setActionNotice(null), 2000);
  };

  const severities: SymptomSeverity[] = ['Mild', 'Moderate', 'Severe', 'Often'];

  // Get additional suggested symptoms for current condition
  const suggestedList = domainAdditionalSuggestedSymptoms[activeCondition] || [
    'Post-exertional exhaustion',
    'Orthostatic lightheadedness',
    'Nocturnal sleep disruption',
    'Micro-nutrient depletion ache',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-purple-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            <span>03 • SYMPTOMS ASSESSMENT</span>
            <span>•</span>
            <span className="text-[#7E22CE] font-mono">{activeCondition.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Pathology & Symptom Severity Matrix
          </h2>
          <p className="text-xs text-gray-600">
            Dynamically calibrated diagnostic presentation, severity grading, and clinical indicators for Diseases, Disorders, Performance & Fitness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="px-4 py-2 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add More Symptoms ({activeCondition})</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {actionNotice && (
        <div className="p-2.5 bg-purple-50 border border-purple-300 rounded-lg flex items-center gap-2 text-xs text-[#7E22CE] font-bold animate-in fade-in shadow-xs">
          <CheckCircle className="w-4 h-4 text-[#7E22CE] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 4 MAJOR DOMAINS TABS */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['DISEASES', 'DISORDERS', 'PERFORMANCE', 'FITNESS'] as MajorDomainTab[]).map((tab) => {
            const isTabActive = activeMajorTab === tab;
            const count = domainCategoriesMapping[tab].length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleSelectMajorTab(tab)}
                className={`p-3 border rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                  isTabActive
                    ? 'bg-[#7E22CE] border-purple-700 shadow-sm text-white'
                    : 'bg-purple-50/90 border-purple-300 text-purple-950 hover:bg-purple-100 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {tab === 'DISEASES' && <Stethoscope className={`w-4 h-4 ${isTabActive ? 'text-white' : 'text-[#7E22CE]'}`} />}
                  {tab === 'DISORDERS' && <ShieldAlert className={`w-4 h-4 ${isTabActive ? 'text-white' : 'text-purple-600'}`} />}
                  {tab === 'PERFORMANCE' && <Zap className={`w-4 h-4 ${isTabActive ? 'text-white' : 'text-purple-600'}`} />}
                  {tab === 'FITNESS' && <Dumbbell className={`w-4 h-4 ${isTabActive ? 'text-white' : 'text-purple-600'}`} />}
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider">{tab}</div>
                    <div className={`text-[10px] font-mono ${isTabActive ? 'text-purple-100' : 'text-purple-800'}`}>{count} Conditions</div>
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isTabActive ? 'bg-white' : 'bg-transparent border border-purple-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* CONDITIONS UNDER ACTIVE DOMAIN */}
        <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-[#7E22CE] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7E22CE]" />
              Select Condition in {activeMajorTab} ({domainCategoriesMapping[activeMajorTab].length} Conditions):
            </span>
            <span className="text-[10px] text-gray-600 font-mono">
              Active: <span className="text-[#7E22CE] font-bold">{activeCondition}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {domainCategoriesMapping[activeMajorTab].map((cond) => {
              const isSelected = activeCondition === cond;
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => handleSelectCondition(cond)}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border rounded-lg ${
                    isSelected
                      ? 'bg-[#7E22CE] text-white border-purple-700 shadow-xs'
                      : 'bg-white text-black border-purple-300 hover:border-purple-500 hover:bg-purple-100/60'
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* OPTION `+` TO ADD MORE SYMPTOMS REGARDING THE SELECTION OF DOMAIN */}
      {showAddMenu && (
        <div className="p-4 sm:p-5 bg-white border-2 border-purple-300 shadow-lg rounded-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-[#7E22CE]">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-gray-950 uppercase tracking-wider">
                  Add Clinical Symptoms for {activeCondition}
                </h3>
                <p className="text-[11px] text-gray-600">
                  Select pre-calibrated domain signs below or input custom clinical presentation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMenu(false)}
              className="p-1 text-gray-500 hover:text-gray-950 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Suggested Domain Symptoms Chips */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono text-[#7E22CE] font-bold block">
              Pre-Calibrated Symptoms for {activeCondition} (Click + to add):
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedList.map((item, idx) => {
                const isAlreadyAdded = currentSymptoms.some((s) => s.symptom.toLowerCase() === item.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => handleAddSuggestedSymptom(item)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAlreadyAdded
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-50 hover:bg-[#7E22CE] text-[#7E22CE] hover:text-white border-purple-200 hover:border-purple-700 shadow-xs'
                    }`}
                  >
                    <span>{isAlreadyAdded ? '✓' : '+'}</span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Symptom Input Form */}
          <div className="pt-2 border-t border-purple-100 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-6 space-y-1">
              <label className="text-[10px] uppercase font-mono text-gray-700 font-bold">
                Custom Clinical Symptom / Sign:
              </label>
              <input
                type="text"
                value={customSymptomText}
                onChange={(e) => setCustomSymptomText(e.target.value)}
                placeholder={`e.g. Specific manifestation for ${activeCondition}`}
                className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-3 py-1.5 text-xs text-gray-950 placeholder:text-gray-400 rounded-lg focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] uppercase font-mono text-gray-700 font-bold">Duration:</label>
              <input
                type="text"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="e.g. 3 weeks"
                className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-3 py-1.5 text-xs text-gray-950 placeholder:text-gray-400 rounded-lg focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleAddCustomSymptom}
                className="w-full py-2 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Sign</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PATHOLOGY OVERVIEW PANEL WITH SELECTION & DELETE OPTION                   */}
      {/* ========================================================================= */}
      <section className="bg-white border-2 border-purple-200 p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-wrap justify-between items-center border-b border-purple-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-[#7E22CE]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[#7E22CE] text-sm uppercase font-black tracking-widest flex items-center gap-2">
                Pathology Overview: {activeCondition}
              </h3>
              <p className="text-[10px] text-gray-600">
                Tick checkboxes to automatically include or exclude symptoms from the Medical Record Preview Report.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-[#7E22CE] font-bold bg-purple-50 px-2.5 py-1 border border-purple-200 rounded-lg">
              {currentSymptoms.filter((s) => s.selected !== false).length} of {currentSymptoms.length} in Report
            </span>
            <button
              type="button"
              onClick={() => handleSelectAll(true)}
              className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-300 text-purple-900 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll(false)}
              className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-300 text-purple-900 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setShowAddMenu(true)}
              className="px-2.5 py-1 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>+ Add Indicator</span>
            </button>
          </div>
        </div>

        {/* Pathology Overview Grid: Each indicator features a Selection Checkbox & Delete button! */}
        {currentSymptoms.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-xs border border-dashed border-purple-200 rounded-xl bg-purple-50/30">
            No symptoms currently logged for {activeCondition}. Use the "+ Add More Symptoms" button above to populate.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentSymptoms.map((item) => {
              const isSevere = item.severity === 'Severe' || item.severity === 'Often';
              const isModerate = item.severity === 'Moderate';
              const isMild = item.severity === 'Mild';
              const isSelected = item.selected !== false;
              return (
                <div
                  key={item.id}
                  className={`p-3 border rounded-xl flex items-center justify-between gap-2 group transition-all ${
                    isSelected
                      ? 'bg-purple-50/70 border-[#7E22CE] shadow-xs'
                      : 'bg-gray-50/60 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSymptomSelection(item.id)}
                      className="w-4 h-4 rounded text-[#7E22CE] border-purple-300 focus:ring-[#7E22CE] cursor-pointer shrink-0"
                      title={isSelected ? 'Included in Preview Report (Click to exclude)' : 'Excluded from Preview Report (Click to include)'}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        onClick={() => handleToggleSymptomSelection(item.id)}
                        className="text-gray-950 text-xs font-bold truncate cursor-pointer hover:text-[#7E22CE]"
                        title={item.symptom}
                      >
                        {item.symptom}
                      </div>
                      <div className="text-[10px] text-gray-600 font-mono flex items-center gap-2 mt-0.5">
                        <span>{item.duration || 'Onset unrecorded'}</span>
                        <span>•</span>
                        <span
                          className={`font-bold uppercase tracking-wider ${
                            isSevere
                              ? 'text-rose-700'
                              : isModerate
                              ? 'text-amber-700'
                              : isMild
                              ? 'text-yellow-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {item.severity || 'None'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* USER REQUIREMENT: Delete option in Pathology Overview */}
                  <button
                    type="button"
                    onClick={() => handleDeleteLocalSymptom(item.id, item.symptom)}
                    title={`Delete "${item.symptom}" from Pathology Overview`}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-900 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* DETAILED SYMPTOMS ASSESSMENT TABLE */}
      <div className="overflow-x-auto bg-white border-2 border-purple-200 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-purple-200 bg-purple-50 text-[#7E22CE] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-3 w-16 text-center">In Report</th>
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th className="py-3 px-4 w-2/5">Symptom / Clinical Presentation</th>
              <th className="py-3 px-4 w-1/5">Duration</th>
              <th className="py-3 px-4 text-center w-1/4">Severity / Frequency</th>
              <th className="py-3 px-4 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {currentSymptoms.map((item, idx) => {
              const isSelected = item.selected !== false;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors group ${
                    isSelected ? 'hover:bg-purple-50/50' : 'bg-gray-50/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSymptomSelection(item.id)}
                      className="w-4 h-4 rounded text-[#7E22CE] border-purple-300 focus:ring-[#7E22CE] cursor-pointer"
                      title={isSelected ? 'Included in Preview Report (Click to exclude)' : 'Excluded from Preview Report (Click to include)'}
                    />
                  </td>

                  <td className="py-3 px-3 text-center text-[#7E22CE] font-mono font-bold">
                    {(idx + 1).toString().padStart(2, '0')}
                  </td>

                  <td className="py-3 px-4 text-gray-950 font-medium">
                    <input
                      type="text"
                      value={item.symptom}
                      onChange={(e) => handleUpdateLocalSymptom(item.id, { symptom: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent focus:border-[#7E22CE] py-0.5 text-gray-950 font-bold focus:outline-none"
                    />
                  </td>

                  <td className="py-3 px-4 min-w-[140px]">
                    <input
                      type="text"
                      value={item.duration ?? ''}
                      onChange={(e) => handleUpdateLocalSymptom(item.id, { duration: e.target.value })}
                      placeholder="e.g. 3 months"
                      className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-2.5 text-xs text-gray-950 placeholder:text-gray-400 rounded-lg focus:outline-none transition-all"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                      {severities.map((sev) => {
                        const isChosen = item.severity === sev;
                        return (
                          <button
                            key={sev}
                            type="button"
                            onClick={() =>
                              handleUpdateLocalSymptom(item.id, {
                                severity: isChosen ? '' : sev,
                              })
                            }
                            className={`py-1 px-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border rounded-md cursor-pointer ${
                              isChosen
                                ? sev === 'Severe' || sev === 'Often'
                                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                                  : sev === 'Moderate'
                                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                                  : 'bg-yellow-100 border-yellow-300 text-yellow-800'
                                : 'border-purple-200 bg-white text-gray-700 hover:text-gray-950 hover:bg-purple-50'
                            }`}
                          >
                            {sev}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteLocalSymptom(item.id, item.symptom)}
                      title={`Delete "${item.symptom}"`}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-600 px-2 gap-2">
        <span className="flex items-center gap-1.5 text-gray-700">
          <AlertCircle className="w-3.5 h-3.5 text-[#7E22CE]" />
          Clinical evaluation: Calibrated against ICMR-NIN guidelines & WHO ICD-11 criteria for {activeCondition}.
        </span>
        <span className="font-mono text-[#7E22CE] font-bold">
          {currentSymptoms.length} indicators evaluated for {activeCondition}
        </span>
      </div>
    </div>
  );
};
