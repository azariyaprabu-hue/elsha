import React from 'react';
import {
  Plus,
  Trash2,
  Pill,
  Scissors,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { MedicationItem, SurgicalHistoryItem, FamilyHistoryItem, MedicalHistory } from '../types';

export interface PatientMedicalConditionItem {
  id?: string;
  condition: string;
  diagnosisYear?: string;
  treatmentStatus?: 'Under Active Medication' | 'Diet Controlled' | 'Resolved / Remission' | string;
  notes?: string;
  status?: string;
}

interface MedicalHistorySectionProps {
  medicalHistory?: MedicalHistory;
  onUpdateMedicalHistory?: (field: keyof MedicalHistory, value: any) => void;
  onUpdateSurgery?: (id: string, updated: Partial<SurgicalHistoryItem>) => void;
  onAddSurgery?: () => void;
  onDeleteSurgery?: (id: string) => void;
  onUpdateMedication?: (id: string, updated: Partial<MedicationItem>) => void;
  onAddMedication?: () => void;
  onDeleteMedication?: (id: string) => void;
  onUpdateFamilyHistory?: (id: string, updated: Partial<FamilyHistoryItem>) => void;
  onAddFamilyHistory?: () => void;
  onDeleteFamilyHistory?: (id: string) => void;
}

export const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  medicalHistory,
  onUpdateMedicalHistory,
}) => {
  // Use data from props or defaults
  const patientConditions: PatientMedicalConditionItem[] = (medicalHistory?.medicalConditions && medicalHistory.medicalConditions.length > 0)
    ? (medicalHistory.medicalConditions as PatientMedicalConditionItem[])
    : [];

  const surgeries: SurgicalHistoryItem[] = (medicalHistory?.surgeries && medicalHistory.surgeries.length > 0)
    ? medicalHistory.surgeries
    : [];

  const medications: MedicationItem[] = (medicalHistory?.medications && medicalHistory.medications.length > 0)
    ? medicalHistory.medications
    : [];

  const allergies: string = medicalHistory?.allergies || '';

  // 1. Condition Handlers
  const handleAddCondition = () => {
    const newCond: PatientMedicalConditionItem = {
      id: `pc-${Date.now()}`,
      condition: '',
      diagnosisYear: new Date().getFullYear().toString(),
      treatmentStatus: 'Under Active Medication',
      notes: '',
    };
    const updated = [...patientConditions, newCond];
    onUpdateMedicalHistory?.('medicalConditions', updated);
  };

  const handleUpdateCondition = (index: number, updatedFields: Partial<PatientMedicalConditionItem>) => {
    const updated = patientConditions.map((c, i) => (i === index ? { ...c, ...updatedFields } : c));
    onUpdateMedicalHistory?.('medicalConditions', updated);
  };

  const handleDeleteCondition = (index: number) => {
    const updated = patientConditions.filter((_, i) => i !== index);
    onUpdateMedicalHistory?.('medicalConditions', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.medicalConditions = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  // 2. Surgery / Past Procedure Handlers
  const handleAddSurgery = () => {
    const newSurg: SurgicalHistoryItem = {
      id: `surg-${Date.now()}`,
      procedure: '',
      year: new Date().getFullYear().toString(),
      hospital: '',
      notes: '',
    };
    const updated = [...surgeries, newSurg];
    onUpdateMedicalHistory?.('surgeries', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.surgeries = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  const handleUpdateSurgery = (index: number, updatedFields: Partial<SurgicalHistoryItem>) => {
    const updated = surgeries.map((s, i) => (i === index ? { ...s, ...updatedFields } : s));
    onUpdateMedicalHistory?.('surgeries', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.surgeries = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  const handleDeleteSurgery = (index: number) => {
    const updated = surgeries.filter((_, i) => i !== index);
    onUpdateMedicalHistory?.('surgeries', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.surgeries = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  // 3. Medication Handlers
  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: '',
      dosage: '',
      frequency: 'Once daily',
      timing: 'Post meal',
      howLongTaken: '',
      purpose: '',
    };
    const updated = [...medications, newMed];
    onUpdateMedicalHistory?.('medications', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.medications = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  const handleUpdateMedication = (index: number, updatedFields: Partial<MedicationItem>) => {
    const updated = medications.map((m, i) => (i === index ? { ...m, ...updatedFields } : m));
    onUpdateMedicalHistory?.('medications', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.medications = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  const handleDeleteMedication = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    onUpdateMedicalHistory?.('medications', updated);
    try {
      const cur = JSON.parse(localStorage.getItem('ELSHA_MED_HISTORY') || '{}');
      cur.medications = updated;
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(cur));
    } catch {}
  };

  // 4. Allergies Handler
  const handleUpdateAllergies = (val: string) => {
    onUpdateMedicalHistory?.('allergies', val);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <HeartPulse className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 04 • PERSONAL PATHOLOGY & CLINICAL INTERVENTIONS</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Medical History & Past Procedures
          </h2>
          <p className="text-xs text-gray-400">
            Details entered here instantly reflect in the Clinical Preview Sheet.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#0d0617] px-3.5 py-2 border border-[#7E22CE] text-[#A855F7] font-bold uppercase tracking-wider rounded-xl">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Live Sync With Preview Sheet</span>
        </div>
      </div>

      {/* SECTION 1: PATIENT MEDICAL CONDITIONS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              1. Patient Diagnosed Medical Conditions ({patientConditions.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddCondition}
            className="px-3.5 py-1.5 bg-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1 cursor-pointer rounded-lg shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Condition</span>
          </button>
        </div>

        {patientConditions.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-purple-900/60 bg-black/40 text-center">
            <p className="text-xs text-gray-400">No medical conditions recorded yet.</p>
            <button
              type="button"
              onClick={handleAddCondition}
              className="mt-2 text-xs font-bold text-[#C084FC] hover:underline cursor-pointer"
            >
              + Click here to add diagnosed medical conditions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patientConditions.map((cond, idx) => (
              <div
                key={cond.id || idx}
                className="bg-[#0d0617] border border-[#7E22CE]/60 hover:border-[#7E22CE] p-4 space-y-3 transition-all rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <span className="w-5 h-5 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCondition(idx)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Delete Condition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Condition Name:</label>
                  <input
                    type="text"
                    value={cond.condition}
                    placeholder="e.g. Type 2 Diabetes Mellitus"
                    onChange={(e) => handleUpdateCondition(idx, { condition: e.target.value })}
                    className="w-full bg-black border border-white/20 text-white font-bold text-xs p-1.5 rounded focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Onset / Year:</label>
                    <input
                      type="text"
                      value={cond.diagnosisYear || ''}
                      placeholder="e.g. 2021"
                      onChange={(e) => handleUpdateCondition(idx, { diagnosisYear: e.target.value })}
                      className="w-full bg-black border border-white/20 text-gray-300 text-xs p-1.5 rounded focus:border-[#7E22CE] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Current Status:</label>
                    <select
                      value={cond.treatmentStatus || 'Under Active Medication'}
                      onChange={(e) => handleUpdateCondition(idx, { treatmentStatus: e.target.value })}
                      className="w-full bg-black border border-white/20 text-[#A855F7] font-bold text-xs p-1.5 rounded focus:border-[#7E22CE] focus:outline-none"
                    >
                      <option value="Under Active Medication">Medication</option>
                      <option value="Diet Controlled">Diet Controlled</option>
                      <option value="Resolved / Remission">Remission</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Clinical Notes:</label>
                  <textarea
                    rows={2}
                    value={cond.notes || ''}
                    placeholder="e.g. HbA1c ~8.2%, on Metformin 500mg BD"
                    onChange={(e) => handleUpdateCondition(idx, { notes: e.target.value })}
                    className="w-full bg-black border border-white/20 text-gray-300 text-xs p-1.5 rounded focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: PAST PROCEDURES & SURGERIES */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              2. Past Surgeries & Procedures ({surgeries.length} Recorded)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddSurgery}
            className="px-3.5 py-1.5 bg-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1 cursor-pointer rounded-lg shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Past Procedure</span>
          </button>
        </div>

        {surgeries.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-purple-900/60 bg-black/40 text-center">
            <p className="text-xs text-gray-400">No surgical or past procedures recorded yet.</p>
            <button
              type="button"
              onClick={handleAddSurgery}
              className="mt-2 text-xs font-bold text-[#C084FC] hover:underline cursor-pointer"
            >
              + Click here to add past procedures / surgeries
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {surgeries.map((surg, idx) => (
              <div
                key={surg.id || idx}
                className="bg-[#0d0617] border border-[#7E22CE]/60 hover:border-[#7E22CE] p-4 transition-all rounded-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <span className="w-5 h-5 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={surg.procedure}
                      placeholder="e.g. Laparoscopic Cholecystectomy / Appendectomy"
                      onChange={(e) => handleUpdateSurgery(idx, { procedure: e.target.value })}
                      className="bg-black border border-white/20 text-white font-bold text-sm px-2.5 py-1 w-full focus:border-[#7E22CE] focus:outline-none rounded"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">Year/Date:</span>
                    <input
                      type="text"
                      value={surg.year || surg.date || ''}
                      placeholder="e.g. 2018"
                      onChange={(e) => handleUpdateSurgery(idx, { year: e.target.value, date: e.target.value })}
                      className="bg-black border border-white/20 text-xs text-white px-2 py-1 w-24 focus:border-[#7E22CE] focus:outline-none rounded"
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteSurgery(idx)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete Surgery"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">
                      Hospital / Facility:
                    </label>
                    <input
                      type="text"
                      value={surg.hospital || ''}
                      placeholder="e.g. Apollo Hospitals, Chennai"
                      onChange={(e) => handleUpdateSurgery(idx, { hospital: e.target.value })}
                      className="w-full bg-black border border-white/20 text-gray-300 px-2 py-1 focus:border-[#7E22CE] focus:outline-none rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">
                      Dietary & Physiological Impact:
                    </label>
                    <input
                      type="text"
                      value={surg.notes || ''}
                      placeholder="e.g. Requires lower-fat split meals"
                      onChange={(e) => handleUpdateSurgery(idx, { notes: e.target.value })}
                      className="w-full bg-black border border-white/20 text-gray-300 px-2 py-1 focus:border-[#7E22CE] focus:outline-none rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: ACTIVE MEDICATIONS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              3. Active Medications & Nutritional Supplements ({medications.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddMedication}
            className="px-3.5 py-1.5 bg-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1 cursor-pointer rounded-lg shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Medication</span>
          </button>
        </div>

        {medications.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-purple-900/60 bg-black/40 text-center">
            <p className="text-xs text-gray-400">No active medications recorded yet.</p>
            <button
              type="button"
              onClick={handleAddMedication}
              className="mt-2 text-xs font-bold text-[#C084FC] hover:underline cursor-pointer"
            >
              + Click here to add current medications
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#0d0617] border border-[#7E22CE] rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#7E22CE] bg-black text-[#A855F7] font-bold tracking-widest uppercase text-[10px]">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 w-52">Medication / Compound</th>
                  <th className="py-2.5 px-3 w-28">Dosage</th>
                  <th className="py-2.5 px-3 w-36">Frequency</th>
                  <th className="py-2.5 px-3 w-48">Timing / Food Interaction</th>
                  <th className="py-2.5 px-3">Therapeutic Purpose / Duration</th>
                  <th className="py-2.5 px-2 text-center w-12">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {medications.map((med, idx) => (
                  <tr key={med.id || idx} className="hover:bg-white/[0.03]">
                    <td className="py-2 px-3 text-center font-mono font-bold text-[#A855F7]">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={med.name}
                        placeholder="Medication name"
                        onChange={(e) => handleUpdateMedication(idx, { name: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white font-bold p-1 focus:border-[#7E22CE] focus:outline-none text-xs rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={med.dosage}
                        placeholder="500 mg"
                        onChange={(e) => handleUpdateMedication(idx, { dosage: e.target.value })}
                        className="w-full bg-black border border-white/20 text-gray-300 p-1 focus:border-[#7E22CE] focus:outline-none text-xs font-mono rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={med.frequency || ''}
                        placeholder="Twice daily (BD)"
                        onChange={(e) => handleUpdateMedication(idx, { frequency: e.target.value })}
                        className="w-full bg-black border border-white/20 text-[#C084FC] p-1 focus:border-[#7E22CE] focus:outline-none text-xs rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={med.timing || ''}
                        placeholder="Post meal"
                        onChange={(e) => handleUpdateMedication(idx, { timing: e.target.value })}
                        className="w-full bg-black border border-white/20 text-gray-300 p-1 focus:border-[#7E22CE] focus:outline-none text-xs rounded"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={med.purpose || med.howLongTaken || ''}
                        placeholder="Purpose & duration"
                        onChange={(e) => handleUpdateMedication(idx, { purpose: e.target.value, howLongTaken: e.target.value })}
                        className="w-full bg-black border border-white/20 text-gray-300 p-1 focus:border-[#7E22CE] focus:outline-none text-xs rounded"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteMedication(idx)}
                        className="text-gray-500 hover:text-red-400 p-1"
                        title="Delete Medication"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 4: ALLERGIES & FOOD INTOLERANCES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <AlertTriangle className="w-4 h-4 text-[#A855F7]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            4. Allergies & Adverse Reactions
          </h3>
        </div>

        <div className="bg-[#0d0617] border border-[#7E22CE]/60 p-4 rounded-xl space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase block">
            Known Drug Allergies, Food Intolerances & Environmental Hypersensitivities:
          </label>
          <input
            type="text"
            value={allergies}
            placeholder="e.g. Penicillin, Shellfish, Lactose Intolerance, Dust/Pollen (or None known)"
            onChange={(e) => handleUpdateAllergies(e.target.value)}
            className="w-full bg-black border border-white/20 text-white font-medium text-xs p-2 rounded focus:border-[#7E22CE] focus:outline-none"
          />
          <p className="text-[10px] text-gray-400">
            This entry will automatically display under "Other Allergies" on the Clinical Preview Sheet.
          </p>
        </div>
      </div>
    </div>
  );
};
