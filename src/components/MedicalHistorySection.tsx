import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Pill,
  Scissors,
  HeartPulse,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { MedicationItem, SurgicalHistoryItem, FamilyHistoryItem } from '../types';

export interface PatientMedicalConditionItem {
  id: string;
  condition: string;
  diagnosisYear: string;
  treatmentStatus: 'Under Active Medication' | 'Diet Controlled' | 'Resolved / Remission';
  notes: string;
}

interface MedicalHistorySectionProps {
  medicalHistory?: any;
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

export const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = () => {
  // 1. Patient Medical Conditions
  const [patientConditions, setPatientConditions] = useState<PatientMedicalConditionItem[]>([
    {
      id: 'pc-1',
      condition: 'Type 2 Diabetes Mellitus',
      diagnosisYear: '2021 (5 years duration)',
      treatmentStatus: 'Under Active Medication',
      notes: 'HbA1c ~8.2%, on Metformin 500mg BD. Postprandial spikes.',
    },
    {
      id: 'pc-2',
      condition: 'Dyslipidemia (Hypertriglyceridemia)',
      diagnosisYear: '2023',
      treatmentStatus: 'Diet Controlled',
      notes: 'Serum Triglycerides 240 mg/dL, HDL 38 mg/dL.',
    },
    {
      id: 'pc-3',
      condition: 'Grade 1 Fatty Liver (Hepatic Steatosis)',
      diagnosisYear: '2024',
      treatmentStatus: 'Diet Controlled',
      notes: 'Incidental ultrasound finding; mild ALT elevation (48 U/L).',
    },
  ]);

  // 2. Past Procedures & Surgeries (3 initial + user can + to add extra)
  const [surgeries, setSurgeries] = useState<SurgicalHistoryItem[]>([
    {
      id: 'surg-1',
      procedure: 'Laparoscopic Cholecystectomy (Gallbladder Removal)',
      year: '2018',
      hospital: 'Apollo Hospitals, Chennai',
      notes: 'Symptomatic cholelithiasis. Bile digestion altered; requires lower-fat split meals.',
    },
    {
      id: 'surg-2',
      procedure: 'Diagnostic Upper GI Endoscopy & Biopsy',
      year: '2022',
      hospital: 'MIOT International',
      notes: 'Mild antral gastritis. H. Pylori negative; post-procedure PPI taken 8 weeks.',
    },
    {
      id: 'surg-3',
      procedure: 'Lower Segment Caesarean Section (LSCS)',
      year: '2015',
      hospital: 'Fortis Malar',
      notes: 'Uncomplicated delivery, healed Pfannenstiel scar. Mild core diastasis recti.',
    },
  ]);

  // 3. Active Medications
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'med-1',
      name: 'Metformin Hydrochloride',
      dosage: '500 mg',
      frequency: 'Twice daily (BD)',
      timing: 'Immediately after breakfast and dinner',
      purpose: 'Insulin sensitizer & hepatic gluconeogenesis suppression',
    },
    {
      id: 'med-2',
      name: 'Vitamin D3 (Cholecalciferol)',
      dosage: '60,000 IU',
      frequency: 'Once weekly',
      timing: 'Sunday morning with milk/healthy fat',
      purpose: 'Severe subclinical deficiency repletion (Baseline: 14 ng/mL)',
    },
    {
      id: 'med-3',
      name: 'Methylcobalamin (Active B12)',
      dosage: '1500 mcg',
      frequency: 'Once daily',
      timing: 'Morning with breakfast',
      purpose: 'Metformin-induced B12 depletion prevention & diabetic nerve support',
    },
  ]);

  // Add Handlers
  const handleAddCondition = () => {
    const newCond: PatientMedicalConditionItem = {
      id: `pc-${Date.now()}`,
      condition: 'New Diagnosed Condition',
      diagnosisYear: '2026',
      treatmentStatus: 'Under Active Medication',
      notes: 'Clinical observations and lab correlates',
    };
    setPatientConditions((prev) => [...prev, newCond]);
  };

  const handleUpdateCondition = (id: string, updated: Partial<PatientMedicalConditionItem>) => {
    setPatientConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const handleDeleteCondition = (id: string) => {
    setPatientConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddSurgery = () => {
    const newSurg: SurgicalHistoryItem = {
      id: `surg-${Date.now()}`,
      procedure: 'Procedure / Surgery Name',
      year: '2025',
      hospital: 'Hospital / Clinic',
      notes: 'Outcome, recovery details, and dietary implications',
    };
    setSurgeries((prev) => [...prev, newSurg]);
  };

  const handleUpdateSurgery = (id: string, updated: Partial<SurgicalHistoryItem>) => {
    setSurgeries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const handleDeleteSurgery = (id: string) => {
    setSurgeries((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: 'Medication Name',
      dosage: 'Dosage (e.g. 500mg)',
      frequency: 'Frequency (e.g. Once daily)',
      timing: 'Timing (e.g. Post meal)',
      purpose: 'Therapeutic Indication',
    };
    setMedications((prev) => [...prev, newMed]);
  };

  const handleUpdateMedication = (id: string, updated: Partial<MedicationItem>) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
  };

  const handleDeleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
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
            Documenting patient's chronic conditions, surgical interventions, and active pharmacological regimens.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#0d0617] px-3.5 py-2 border border-[#7E22CE] text-[#A855F7] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Patient-Specific Clinical Profile</span>
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
            className="px-3 py-1.5 bg-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(126,34,206,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Condition</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patientConditions.map((cond, idx) => (
            <div
              key={cond.id}
              className="bg-[#0d0617] border border-[#7E22CE]/60 hover:border-[#7E22CE] p-4 space-y-3 transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="w-5 h-5 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteCondition(cond.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
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
                  onChange={(e) => handleUpdateCondition(cond.id, { condition: e.target.value })}
                  className="w-full bg-black border border-white/20 text-white font-bold text-xs p-1.5 focus:border-[#7E22CE] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Onset / Duration:</label>
                  <input
                    type="text"
                    value={cond.diagnosisYear}
                    onChange={(e) => handleUpdateCondition(cond.id, { diagnosisYear: e.target.value })}
                    className="w-full bg-black border border-white/20 text-gray-300 text-xs p-1.5 focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Current Status:</label>
                  <select
                    value={cond.treatmentStatus}
                    onChange={(e) => handleUpdateCondition(cond.id, { treatmentStatus: e.target.value as any })}
                    className="w-full bg-black border border-white/20 text-[#A855F7] font-bold text-xs p-1.5 focus:border-[#7E22CE] focus:outline-none"
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
                  value={cond.notes}
                  onChange={(e) => handleUpdateCondition(cond.id, { notes: e.target.value })}
                  className="w-full bg-black border border-white/20 text-gray-300 text-xs p-1.5 focus:border-[#7E22CE] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: PAST PROCEDURES & SURGERIES (3 INITIAL + USER CAN ADD EXTRA) */}
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
            className="px-3 py-1.5 bg-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(126,34,206,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Procedure / Surgery</span>
          </button>
        </div>

        <div className="space-y-3">
          {surgeries.map((surg, idx) => (
            <div
              key={surg.id}
              className="bg-[#0d0617] border border-[#7E22CE]/60 hover:border-[#7E22CE] p-4 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={surg.procedure}
                    onChange={(e) => handleUpdateSurgery(surg.id, { procedure: e.target.value })}
                    className="bg-black border border-white/20 text-white font-bold text-sm px-2.5 py-1 w-72 sm:w-96 focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">Year:</span>
                  <input
                    type="text"
                    value={surg.year}
                    onChange={(e) => handleUpdateSurgery(surg.id, { year: e.target.value })}
                    className="bg-black border border-white/20 text-xs text-white px-2 py-1 w-20 focus:border-[#7E22CE] focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteSurgery(surg.id)}
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
                    value={surg.hospital}
                    onChange={(e) => handleUpdateSurgery(surg.id, { hospital: e.target.value })}
                    className="w-full bg-black border border-white/20 text-gray-300 px-2 py-1 focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">
                    Dietary & Physiological Impact:
                  </label>
                  <input
                    type="text"
                    value={surg.notes}
                    onChange={(e) => handleUpdateSurgery(surg.id, { notes: e.target.value })}
                    className="w-full bg-black border border-white/20 text-gray-300 px-2 py-1 focus:border-[#7E22CE] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
            className="px-3 py-1.5 bg-[#7E22CE] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(126,34,206,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Medication</span>
          </button>
        </div>

        <div className="overflow-x-auto bg-[#0d0617] border border-[#7E22CE]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#7E22CE] bg-black text-[#A855F7] font-bold tracking-widest uppercase text-[10px]">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 w-52">Medication / Compound</th>
                <th className="py-2.5 px-3 w-28">Dosage</th>
                <th className="py-2.5 px-3 w-36">Frequency</th>
                <th className="py-2.5 px-3 w-48">Timing / Food Interaction</th>
                <th className="py-2.5 px-3">Therapeutic Purpose</th>
                <th className="py-2.5 px-2 text-center w-12">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {medications.map((med, idx) => (
                <tr key={med.id} className="hover:bg-white/[0.03]">
                  <td className="py-2 px-3 text-center font-mono font-bold text-[#A855F7]">{idx + 1}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleUpdateMedication(med.id, { name: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white font-bold p-1 focus:border-[#7E22CE] focus:outline-none text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleUpdateMedication(med.id, { dosage: e.target.value })}
                      className="w-full bg-black border border-white/20 text-gray-300 p-1 focus:border-[#7E22CE] focus:outline-none text-xs font-mono"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => handleUpdateMedication(med.id, { frequency: e.target.value })}
                      className="w-full bg-black border border-white/20 text-[#C084FC] p-1 focus:border-[#7E22CE] focus:outline-none text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={med.timing}
                      onChange={(e) => handleUpdateMedication(med.id, { timing: e.target.value })}
                      className="w-full bg-black border border-white/20 text-gray-300 p-1 focus:border-[#7E22CE] focus:outline-none text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={med.purpose}
                      onChange={(e) => handleUpdateMedication(med.id, { purpose: e.target.value })}
                      className="w-full bg-black border border-white/20 text-gray-400 p-1 focus:border-[#7E22CE] focus:outline-none text-xs"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteMedication(med.id)}
                      className="text-gray-500 hover:text-red-400 p-1"
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
    </div>
  );
};
