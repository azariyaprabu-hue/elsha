import React, { useState } from 'react';
import { FamilyHistoryItem } from '../types';
import {
  Users,
  Plus,
  Trash2,
  HeartPulse,
  Dna,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  X,
} from 'lucide-react';

export interface ParentHistoryRecord {
  id: string;
  relation: 'Father' | 'Mother' | 'Paternal Grandfather' | 'Paternal Grandmother' | 'Maternal Grandfather' | 'Maternal Grandmother' | 'Sibling';
  conditions: string[];
  ageOfOnset: string;
  status: 'Living with condition' | 'Deceased' | 'Controlled' | 'Not Applicable';
  medications: string;
  lifestyleNotes: string;
}

export const initialParentHistoryData: ParentHistoryRecord[] = [
  {
    id: 'ph-1',
    relation: 'Father',
    conditions: ['Type 2 Diabetes Mellitus', 'Hypertension (Stage 2)'],
    ageOfOnset: '46 years',
    status: 'Living with condition',
    medications: 'Metformin 500mg, Telmisartan 40mg',
    lifestyleNotes: 'Sedentary desk worker, high refined carbohydrate consumption',
  },
  {
    id: 'ph-2',
    relation: 'Mother',
    conditions: ['Hypothyroidism (Hashimoto)', 'Early Osteoarthritis'],
    ageOfOnset: '41 years',
    status: 'Living with condition',
    medications: 'Levothyroxine 50mcg, Calcium + D3',
    lifestyleNotes: 'Chronic low back pain, recurrent knee inflammation',
  },
  {
    id: 'ph-3',
    relation: 'Paternal Grandfather',
    conditions: ['Coronary Artery Disease (CAD)', 'Myocardial Infarction'],
    ageOfOnset: '58 years',
    status: 'Deceased',
    medications: 'Past CABG surgery at age 62',
    lifestyleNotes: 'History of heavy smoking & uncontrolled hyperlipidemia',
  },
  {
    id: 'ph-4',
    relation: 'Maternal Grandmother',
    conditions: ['Metabolic Syndrome', 'Gallbladder Stones (Cholecystectomy)'],
    ageOfOnset: '50 years',
    status: 'Deceased',
    medications: 'Surgical excision',
    lifestyleNotes: 'High abdominal adiposity, early insulin resistance',
  },
];

interface ParentMedicalHistorySectionProps {
  familyHistory?: FamilyHistoryItem[];
  onUpdateFamilyHistory?: (items: FamilyHistoryItem[]) => void;
}

export const ParentMedicalHistorySection: React.FC<ParentMedicalHistorySectionProps> = ({
  familyHistory,
  onUpdateFamilyHistory,
}) => {
  const [records, setRecords] = useState<ParentHistoryRecord[]>(() => {
    if (familyHistory && familyHistory.length > 0 && familyHistory.some(f => f.condition)) {
      return familyHistory.map((f, i) => ({
        id: f.id || `ph-${i}`,
        relation: (['Father', 'Mother', 'Paternal Grandfather', 'Paternal Grandmother', 'Maternal Grandfather', 'Maternal Grandmother', 'Sibling'].includes(f.whoHasIt) ? f.whoHasIt : 'Father') as any,
        conditions: f.condition ? f.condition.split(',').map(s => s.trim()).filter(Boolean) : ['Familial Condition'],
        ageOfOnset: f.year || '45 years',
        status: (f.status as any) || 'Living with condition',
        medications: f.notes || '',
        lifestyleNotes: '',
      }));
    }
    return initialParentHistoryData;
  });
  const [newConditionInput, setNewConditionInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalRelation, setModalRelation] = useState<'Father' | 'Mother' | 'Paternal Grandfather' | 'Paternal Grandmother' | 'Maternal Grandfather' | 'Maternal Grandmother' | 'Sibling'>('Father');
  const [modalConditions, setModalConditions] = useState<string[]>(['Type 2 Diabetes']);
  const [modalCustomCondition, setModalCustomCondition] = useState('');
  const [modalAgeOfOnset, setModalAgeOfOnset] = useState('45 years');
  const [modalStatus, setModalStatus] = useState<'Living with condition' | 'Deceased' | 'Controlled' | 'Not Applicable'>('Living with condition');
  const [modalMedications, setModalMedications] = useState('');
  const [modalNotes, setModalNotes] = useState('');

  const handleSaveModalRecord = () => {
    let finalConditions = [...modalConditions];
    if (modalCustomCondition.trim()) {
      finalConditions.push(modalCustomCondition.trim());
    }
    if (finalConditions.length === 0) {
      finalConditions = ['Familial Condition'];
    }

    const newRec: ParentHistoryRecord = {
      id: `ph-${Date.now()}`,
      relation: modalRelation,
      conditions: finalConditions,
      ageOfOnset: modalAgeOfOnset || 'Familial',
      status: modalStatus,
      medications: modalMedications || 'None recorded',
      lifestyleNotes: modalNotes || 'Standard baseline',
    };

    const updated = [...records, newRec];
    setRecords(updated);
    syncFamilyHistory(updated);
    setIsAddModalOpen(false);
    setModalCustomCondition('');
    setModalMedications('');
    setModalNotes('');
  };

  // Sync to parent familyHistory on change
  const syncFamilyHistory = (updatedRecords: ParentHistoryRecord[]) => {
    if (onUpdateFamilyHistory) {
      const converted: FamilyHistoryItem[] = updatedRecords.map((r, i) => ({
        id: r.id || `fam-${i}`,
        condition: r.conditions.join(', '),
        whoHasIt: r.relation,
        year: r.ageOfOnset || 'Familial',
        status: r.status,
        notes: r.medications ? `${r.medications} ${r.lifestyleNotes || ''}`.trim() : r.lifestyleNotes,
      }));
      onUpdateFamilyHistory(converted);
    }
  };

  const commonFamilialConditions = [
    'Type 2 Diabetes',
    'Hypertension',
    'Coronary Artery Disease',
    'Dyslipidemia',
    'Hypothyroidism',
    'PCOS',
    'Fatty Liver',
    'Colorectal / Breast Cancer',
    'Autoimmune Disease',
    'Chronic Kidney Disease',
    'Gout / Hyperuricemia',
  ];

  const handleAddRecord = () => {
    const newRecord: ParentHistoryRecord = {
      id: `ph-${Date.now()}`,
      relation: 'Father',
      conditions: ['Type 2 Diabetes'],
      ageOfOnset: '45 years',
      status: 'Living with condition',
      medications: 'Oral hypoglycemic / Anti-hypertensive',
      lifestyleNotes: 'Enter clinical observations',
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    syncFamilyHistory(updated);
  };

  const handleUpdateRecord = (id: string, updatedFields: Partial<ParentHistoryRecord>) => {
    const updated = records.map((rec) => (rec.id === id ? { ...rec, ...updatedFields } : rec));
    setRecords(updated);
    syncFamilyHistory(updated);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((rec) => rec.id !== id);
    setRecords(updated);
    syncFamilyHistory(updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.familyHistory = updated.map((r, i) => ({
        id: r.id || `fam-${i}`,
        condition: r.conditions.join(', '),
        whoHasIt: r.relation,
        year: r.ageOfOnset || 'Familial',
        status: r.status,
        notes: r.medications,
      }));
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  const handleToggleCondition = (recId: string, conditionName: string) => {
    const updated = records.map((rec) => {
      if (rec.id !== recId) return rec;
      const exists = rec.conditions.includes(conditionName);
      const newConds = exists
        ? rec.conditions.filter((c) => c !== conditionName)
        : [...rec.conditions, conditionName];
      return { ...rec, conditions: newConds };
    });
    setRecords(updated);
    syncFamilyHistory(updated);
  };

  // Genetic Hereditary Risk Assessment
  const allConditions = records.flatMap((r) => r.conditions);
  const hasDiabetesRisk = allConditions.some((c) => c.toLowerCase().includes('diabetes'));
  const hasCardioRisk = allConditions.some((c) => c.toLowerCase().includes('coronary') || c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('infarction'));
  const hasThyroidRisk = allConditions.some((c) => c.toLowerCase().includes('thyroid'));

  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="border-b-2 border-purple-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            <Dna className="w-3.5 h-3.5 text-[#7E22CE]" />
            <span>MODULE 05 • HEREDITARY & FAMILIAL GENOMIC LINEAGE</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Parent & Familial Medical History
          </h2>
          <p className="text-xs text-gray-600">
            Evaluating multi-generational hereditary predispositions for epigenetic dietary prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-add-parent-history-modal"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#6b1dae] transition-all flex items-center gap-2 shadow-md rounded-xl cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-white text-[#7E22CE] flex items-center justify-center font-black text-xs">
              +
            </span>
            <span>+ Add Parent History</span>
          </button>

          <button
            type="button"
            id="btn-quick-add-parent-history"
            onClick={handleAddRecord}
            className="px-3.5 py-2.5 border border-purple-300 hover:border-[#7E22CE] bg-white text-[#7E22CE] text-xs font-bold uppercase tracking-wider hover:bg-purple-50 transition-all flex items-center gap-1.5 shadow-2xs rounded-xl cursor-pointer"
            title="Instantly add a new blank lineage record row"
          >
            <Plus className="w-4 h-4" />
            <span>+ Quick Add</span>
          </button>
        </div>
      </div>

      {/* Genetic Risk Stratification Matrix */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-[#7E22CE] text-xs font-black uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4" />
          <span>Epigenetic & Hereditary Predisposition Scores</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Diabetes Card */}
          <div className={`p-3.5 border-2 rounded-xl ${hasDiabetesRisk ? 'bg-white border-[#7E22CE] shadow-xs' : 'bg-white/80 border-purple-200'}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-gray-950 uppercase text-[11px]">Type 2 Diabetes Risk</span>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${hasDiabetesRisk ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {hasDiabetesRisk ? 'High Familial Load (85%)' : 'Standard Baseline'}
              </span>
            </div>
            <p className="text-[11px] text-gray-700 mt-1">
              {hasDiabetesRisk
                ? 'Strong maternal or paternal penetrance. Strict glycemic control, fiber threshold >35g/day, and chromium/magnesium repletion required.'
                : 'No immediate direct parental history detected.'}
            </p>
          </div>

          {/* Cardio Card */}
          <div className={`p-3.5 border-2 rounded-xl ${hasCardioRisk ? 'bg-white border-[#7E22CE] shadow-xs' : 'bg-white/80 border-purple-200'}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-gray-950 uppercase text-[11px]">Cardiovascular & HTN Risk</span>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${hasCardioRisk ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {hasCardioRisk ? 'Elevated Vascular Risk' : 'Standard Baseline'}
              </span>
            </div>
            <p className="text-[11px] text-gray-700 mt-1">
              {hasCardioRisk
                ? 'Paternal CAD / Hypertension detected. Recommend low sodium (<2000mg), rich potassium:sodium ratio, and omega-3 EPA/DHA.'
                : 'No severe early-onset coronary artery incidents in direct lineage.'}
            </p>
          </div>

          {/* Endocrine / Thyroid Card */}
          <div className={`p-3.5 border-2 rounded-xl ${hasThyroidRisk ? 'bg-white border-[#7E22CE] shadow-xs' : 'bg-white/80 border-purple-200'}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-gray-950 uppercase text-[11px]">Endocrine & Autoimmune</span>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${hasThyroidRisk ? 'bg-[#7E22CE] text-white' : 'bg-emerald-600 text-white'}`}>
                {hasThyroidRisk ? 'Maternal Predisposition' : 'Standard Baseline'}
              </span>
            </div>
            <p className="text-[11px] text-gray-700 mt-1">
              {hasThyroidRisk
                ? 'Maternal Hashimoto thyroiditis. Monitor selenium (200mcg), zinc, and anti-TPO levels; eliminate gluten if inflammatory markers spike.'
                : 'Standard baseline metabolic profile.'}
            </p>
          </div>
        </div>
      </div>

      {/* Lineage Records Table */}
      <div className="space-y-4">
        {records.map((rec, idx) => (
          <div
            key={rec.id}
            className="bg-white border-2 border-purple-200 hover:border-[#7E22CE] p-4 rounded-xl shadow-xs transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <select
                  value={rec.relation}
                  onChange={(e) => handleUpdateRecord(rec.id, { relation: e.target.value as any })}
                  className="bg-purple-50 border border-purple-200 text-gray-950 font-black text-sm px-2.5 py-1 focus:border-[#7E22CE] focus:outline-none rounded-lg"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Paternal Grandfather">Paternal Grandfather</option>
                  <option value="Paternal Grandmother">Paternal Grandmother</option>
                  <option value="Maternal Grandfather">Maternal Grandfather</option>
                  <option value="Maternal Grandmother">Maternal Grandmother</option>
                  <option value="Sibling">Sibling</option>
                </select>

                <span className="text-xs text-gray-600 font-mono">| Age of Onset:</span>
                <input
                  type="text"
                  value={rec.ageOfOnset}
                  onChange={(e) => handleUpdateRecord(rec.id, { ageOfOnset: e.target.value })}
                  placeholder="e.g. 45 years"
                  className="bg-white border border-purple-200 text-xs text-gray-950 px-2 py-1 w-24 focus:border-[#7E22CE] focus:outline-none rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={rec.status}
                  onChange={(e) => handleUpdateRecord(rec.id, { status: e.target.value as any })}
                  className={`text-xs font-bold px-2 py-1 border rounded-lg ${
                    rec.status === 'Living with condition'
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : rec.status === 'Deceased'
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  }`}
                >
                  <option value="Living with condition">Living with condition</option>
                  <option value="Controlled">Controlled / Stable</option>
                  <option value="Deceased">Deceased</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteRecord(rec.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Diagnosed Conditions Tags */}
            <div className="space-y-2 mb-3">
              <span className="text-[10px] font-mono uppercase text-[#7E22CE] font-bold">
                Associated Conditions (Click to Toggle):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonFamilialConditions.map((cond) => {
                  const isChecked = rec.conditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleToggleCondition(rec.id, cond)}
                      className={`text-xs px-2.5 py-1 border rounded-lg transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#7E22CE] text-white border-[#7E22CE] font-bold shadow-2xs'
                          : 'bg-purple-50 text-gray-700 border-purple-200 hover:border-[#7E22CE]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Medications & Notes Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-gray-600 uppercase block mb-1 font-bold">
                  Active Medications / Interventions:
                </label>
                <input
                  type="text"
                  value={rec.medications}
                  onChange={(e) => handleUpdateRecord(rec.id, { medications: e.target.value })}
                  placeholder="e.g. Metformin 500mg, Atorvastatin 10mg..."
                  className="w-full bg-white border border-purple-200 text-gray-950 px-2.5 py-1.5 focus:border-[#7E22CE] focus:outline-none rounded-lg"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-600 uppercase block mb-1 font-bold">
                  Clinical & Dietary Context:
                </label>
                <input
                  type="text"
                  value={rec.lifestyleNotes}
                  onChange={(e) => handleUpdateRecord(rec.id, { lifestyleNotes: e.target.value })}
                  placeholder="e.g. Dietary patterns, physical activity, complications..."
                  className="w-full bg-white border border-purple-200 text-gray-950 px-2.5 py-1.5 focus:border-[#7E22CE] focus:outline-none rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}

        {/* PROMINENT + OPTION: Add Parent / Familial History Record Button & Banner */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-4 px-6 border-2 border-dashed border-[#7E22CE] bg-purple-50/50 hover:bg-purple-100/70 text-[#7E22CE] hover:text-[#6b1dae] rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md group"
          >
            <span className="w-7 h-7 rounded-full bg-[#7E22CE] text-white flex items-center justify-center font-bold text-base group-hover:scale-110 transition-transform">
              +
            </span>
            <span>+ Add New Parent / Familial History Record (Father, Mother, Grandparents, Sibling)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD PARENT / FAMILIAL RECORD MODAL DIALOG                                 */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-[#7E22CE] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#7E22CE] text-white flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900 uppercase">
                    Add Parent / Familial History Record
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Track hereditary conditions, onset age & clinical medications
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-3.5 text-xs">
              {/* Relation */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1">
                  Family Relation:
                </label>
                <select
                  value={modalRelation}
                  onChange={(e) => setModalRelation(e.target.value as any)}
                  className="w-full bg-purple-50/60 border border-purple-200 text-gray-900 font-bold p-2.5 rounded-xl focus:border-[#7E22CE] focus:outline-none"
                >
                  <option value="Father">Father (Paternal)</option>
                  <option value="Mother">Mother (Maternal)</option>
                  <option value="Paternal Grandfather">Paternal Grandfather</option>
                  <option value="Paternal Grandmother">Paternal Grandmother</option>
                  <option value="Maternal Grandfather">Maternal Grandfather</option>
                  <option value="Maternal Grandmother">Maternal Grandmother</option>
                  <option value="Sibling">Sibling (Brother / Sister)</option>
                </select>
              </div>

              {/* Conditions Toggle */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1.5">
                  Select Associated Familial Conditions:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-purple-50/40 rounded-xl border border-purple-100">
                  {commonFamilialConditions.map((cond) => {
                    const isSelected = modalConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setModalConditions(modalConditions.filter((c) => c !== cond));
                          } else {
                            setModalConditions([...modalConditions, cond]);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-2xs'
                            : 'bg-white text-gray-700 border-purple-200 hover:border-purple-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Condition */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1">
                  Or Add Custom Condition:
                </label>
                <input
                  type="text"
                  value={modalCustomCondition}
                  onChange={(e) => setModalCustomCondition(e.target.value)}
                  placeholder="e.g. Early CAD at 48, Glaucoma, Renal Calculi..."
                  className="w-full bg-white border border-purple-200 p-2 rounded-xl focus:border-[#7E22CE] focus:outline-none"
                />
              </div>

              {/* Age of Onset & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1">
                    Age of Onset:
                  </label>
                  <input
                    type="text"
                    value={modalAgeOfOnset}
                    onChange={(e) => setModalAgeOfOnset(e.target.value)}
                    placeholder="e.g. 45 years"
                    className="w-full bg-white border border-purple-200 p-2 rounded-xl focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1">
                    Current Status:
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    className="w-full bg-white border border-purple-200 p-2 rounded-xl focus:border-[#7E22CE] focus:outline-none font-bold"
                  >
                    <option value="Living with condition">Living with condition</option>
                    <option value="Controlled">Controlled / Stable</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
              </div>

              {/* Medications */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1">
                  Active Medications / Surgical Record:
                </label>
                <input
                  type="text"
                  value={modalMedications}
                  onChange={(e) => setModalMedications(e.target.value)}
                  placeholder="e.g. Metformin 500mg BD, Telmisartan 40mg..."
                  className="w-full bg-white border border-purple-200 p-2 rounded-xl focus:border-[#7E22CE] focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-gray-600 block mb-1">
                  Clinical & Dietary Observations:
                </label>
                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Sedentary lifestyle, high carb intake..."
                  className="w-full bg-white border border-purple-200 p-2 rounded-xl focus:border-[#7E22CE] focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-purple-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalRecord}
                className="px-5 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Parent History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
