import React, { useState } from 'react';
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

export const ParentMedicalHistorySection: React.FC = () => {
  const [records, setRecords] = useState<ParentHistoryRecord[]>(initialParentHistoryData);
  const [newConditionInput, setNewConditionInput] = useState('');

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
    setRecords((prev) => [...prev, newRecord]);
  };

  const handleUpdateRecord = (id: string, updated: Partial<ParentHistoryRecord>) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updated } : rec))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  const handleToggleCondition = (recId: string, conditionName: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recId) return rec;
        const exists = rec.conditions.includes(conditionName);
        const newConds = exists
          ? rec.conditions.filter((c) => c !== conditionName)
          : [...rec.conditions, conditionName];
        return { ...rec, conditions: newConds };
      })
    );
  };

  // Genetic Hereditary Risk Assessment
  const allConditions = records.flatMap((r) => r.conditions);
  const hasDiabetesRisk = allConditions.some((c) => c.toLowerCase().includes('diabetes'));
  const hasCardioRisk = allConditions.some((c) => c.toLowerCase().includes('coronary') || c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('infarction'));
  const hasThyroidRisk = allConditions.some((c) => c.toLowerCase().includes('thyroid'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Dna className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 05 • HEREDITARY & FAMILIAL GENOMIC LINEAGE</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Parent & Familial Medical History
          </h2>
          <p className="text-xs text-gray-400">
            Evaluating multi-generational hereditary predispositions for epigenetic dietary prevention.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddRecord}
          className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-widest hover:bg-[#9333EA] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(126,34,206,0.4)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Lineage Record</span>
        </button>
      </div>

      {/* Genetic Risk Stratification Matrix */}
      <div className="bg-[#0e071a] border border-[#7E22CE] p-5">
        <div className="flex items-center gap-2 text-[#A855F7] text-xs font-black uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4" />
          <span>Epigenetic & Hereditary Predisposition Scores</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Diabetes Card */}
          <div className={`p-3.5 border ${hasDiabetesRisk ? 'bg-purple-950/40 border-purple-500' : 'bg-black border-white/10'}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white uppercase text-[11px]">Type 2 Diabetes Risk</span>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${hasDiabetesRisk ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`}>
                {hasDiabetesRisk ? 'High Familial Load (85%)' : 'Standard Baseline'}
              </span>
            </div>
            <p className="text-[11px] text-gray-300">
              {hasDiabetesRisk
                ? 'Strong maternal or paternal penetrance. Strict glycemic control, fiber threshold >35g/day, and chromium/magnesium repletion required.'
                : 'No immediate direct parental history detected.'}
            </p>
          </div>

          {/* Cardio Card */}
          <div className={`p-3.5 border ${hasCardioRisk ? 'bg-purple-950/40 border-purple-500' : 'bg-black border-white/10'}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white uppercase text-[11px]">Cardiovascular & HTN Risk</span>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${hasCardioRisk ? 'bg-amber-500 text-black' : 'bg-green-500 text-black'}`}>
                {hasCardioRisk ? 'Elevated Vascular Risk' : 'Standard Baseline'}
              </span>
            </div>
            <p className="text-[11px] text-gray-300">
              {hasCardioRisk
                ? 'Paternal CAD / Hypertension detected. Recommend low sodium (<2000mg), rich potassium:sodium ratio, and omega-3 EPA/DHA.'
                : 'No severe early-onset coronary artery incidents in direct lineage.'}
            </p>
          </div>

          {/* Endocrine / Thyroid Card */}
          <div className={`p-3.5 border ${hasThyroidRisk ? 'bg-purple-950/40 border-purple-500' : 'bg-black border-white/10'}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white uppercase text-[11px]">Endocrine & Autoimmune</span>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${hasThyroidRisk ? 'bg-purple-600 text-white' : 'bg-green-500 text-black'}`}>
                {hasThyroidRisk ? 'Maternal Predisposition' : 'Standard Baseline'}
              </span>
            </div>
            <p className="text-[11px] text-gray-300">
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
            className="bg-[#0d0617] border border-[#7E22CE]/60 hover:border-[#7E22CE] p-4 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <select
                  value={rec.relation}
                  onChange={(e) => handleUpdateRecord(rec.id, { relation: e.target.value as any })}
                  className="bg-black border border-white/20 text-white font-black text-sm px-2.5 py-1 focus:border-[#7E22CE] focus:outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Paternal Grandfather">Paternal Grandfather</option>
                  <option value="Paternal Grandmother">Paternal Grandmother</option>
                  <option value="Maternal Grandfather">Maternal Grandfather</option>
                  <option value="Maternal Grandmother">Maternal Grandmother</option>
                  <option value="Sibling">Sibling</option>
                </select>

                <span className="text-xs text-gray-400 font-mono">| Age of Onset:</span>
                <input
                  type="text"
                  value={rec.ageOfOnset}
                  onChange={(e) => handleUpdateRecord(rec.id, { ageOfOnset: e.target.value })}
                  placeholder="e.g. 45 years"
                  className="bg-black border border-white/20 text-xs text-white px-2 py-1 w-24 focus:border-[#7E22CE] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={rec.status}
                  onChange={(e) => handleUpdateRecord(rec.id, { status: e.target.value as any })}
                  className={`text-xs font-bold px-2 py-1 border bg-black ${
                    rec.status === 'Living with condition'
                      ? 'border-yellow-500 text-yellow-400'
                      : rec.status === 'Deceased'
                      ? 'border-red-500 text-red-400'
                      : 'border-green-500 text-green-400'
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
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Diagnosed Conditions Tags */}
            <div className="space-y-2 mb-3">
              <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold">
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
                      className={`text-xs px-2.5 py-1 border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#7E22CE] text-white border-[#A855F7] font-bold'
                          : 'bg-black text-gray-400 border-white/10 hover:border-white/30'
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
                <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                  Active Medications / Interventions:
                </label>
                <input
                  type="text"
                  value={rec.medications}
                  onChange={(e) => handleUpdateRecord(rec.id, { medications: e.target.value })}
                  placeholder="e.g. Metformin 500mg, Atorvastatin 10mg..."
                  className="w-full bg-black border border-white/20 text-white px-2.5 py-1.5 focus:border-[#7E22CE] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                  Clinical & Dietary Context:
                </label>
                <input
                  type="text"
                  value={rec.lifestyleNotes}
                  onChange={(e) => handleUpdateRecord(rec.id, { lifestyleNotes: e.target.value })}
                  placeholder="e.g. Dietary patterns, physical activity, complications..."
                  className="w-full bg-black border border-white/20 text-white px-2.5 py-1.5 focus:border-[#7E22CE] focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
