import React, { useState } from 'react';
import {
  Pill,
  Printer,
  Download,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  FileText,
  Share2,
} from 'lucide-react';
import { PrescriptionItem } from '../types';
import { ZiathlonLetterheadFrame } from './ZiathlonLetterheadFrame';

interface MyPrescriptionSubfolderProps {
  currentPatientId: string;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  prescriptions?: any[];
  generalInfo?: any;
  onNavigateToTab?: (tab: string) => void;
  onUpdatePrescriptions?: (items: PrescriptionItem[]) => void;
}

export const MyPrescriptionSubfolder: React.FC<MyPrescriptionSubfolderProps> = ({
  currentPatientId,
  patientName,
  patientAge = 34,
  patientSex = 'Female',
  prescriptions,
  generalInfo,
  onNavigateToTab,
  onUpdatePrescriptions,
}) => {
  const [rxList, setRxList] = useState<PrescriptionItem[]>(
    prescriptions && prescriptions.length > 0
      ? prescriptions
      : [
          {
            id: '1',
            medicineName: 'Thyronorm (Levothyroxine)',
            dosage: '88 mcg',
            frequency: '1-0-0 (Once daily)',
            timing: 'Morning Empty Stomach (30-60 mins before breakfast)',
            duration: 'Continuous / 90 Days',
            instructions: 'Take with full glass of water. Do not consume calcium/iron within 4 hours.',
          },
          {
            id: '2',
            medicineName: 'Metformin Hydrochloride',
            dosage: '500 mg',
            frequency: '1-0-1 (Twice daily)',
            timing: 'Post Lunch & Post Dinner',
            duration: '90 Days',
            instructions: 'Take immediately after food to prevent gastric irritation.',
          },
          {
            id: '3',
            medicineName: 'Vitamin D3 (Cholecalciferol)',
            dosage: '60,000 IU',
            frequency: 'Once a week',
            timing: 'Sunday Post Lunch with fatty meal',
            duration: '8 Weeks',
            instructions: 'Improves bone density and metabolic synthesis.',
          },
          {
            id: '4',
            medicineName: 'Plant-Based Protein Supplement',
            dosage: '1 Scoop (24g Protein)',
            frequency: '1-0-0',
            timing: 'Evening 5:00 PM Post-workout / Snack',
            duration: 'Ongoing',
            instructions: 'Mix in 250ml water or unsweetened almond milk.',
          },
        ]
  );

  const [doctorNotes, setDoctorNotes] = useState(
    'Please maintain regular sleep timing (10:30 PM - 6:30 AM). Repeat TSH, FT3, FT4, and HbA1c panel after 90 days. In case of any palpitation or gastric distress, consult clinic immediately.'
  );

  const [isAddingMed, setIsAddingMed] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFreq, setNewFreq] = useState('1-0-0');
  const [newTiming, setNewTiming] = useState('After food');
  const [newDuration, setNewDuration] = useState('30 Days');
  const [newInstructions, setNewInstructions] = useState('');

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    const item: PrescriptionItem = {
      id: Date.now().toString(),
      medicineName: newMedName,
      dosage: newDosage,
      frequency: newFreq,
      timing: newTiming,
      duration: newDuration,
      instructions: newInstructions,
    };
    const updated = [...rxList, item];
    setRxList(updated);
    if (onUpdatePrescriptions) onUpdatePrescriptions(updated);
    setNewMedName('');
    setNewDosage('');
    setNewInstructions('');
    setIsAddingMed(false);
  };

  const handleRemoveMed = (id: string) => {
    const updated = rxList.filter((m) => m.id !== id);
    setRxList(updated);
    if (onUpdatePrescriptions) onUpdatePrescriptions(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E22CE] bg-purple-100 px-2 py-0.5 rounded">
              SUB-FOLDER 6
            </span>
            <span className="text-xs text-gray-500 font-mono">Patient: {patientName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight mt-1 flex items-center gap-2">
            <Pill className="w-6 h-6 text-[#7E22CE]" />
            My Prescription (Patient Rx Schedule & Guidelines)
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Clear medication plan with morning, afternoon, evening timing, dietary instructions, and refill timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#7E22CE]" />
            <span>Print Prescription</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddingMed(true)}
            className="px-4 py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Add Medicine Form Modal */}
      {isAddingMed && (
        <form
          onSubmit={handleAddMed}
          className="p-5 rounded-2xl bg-purple-50 border-2 border-[#7E22CE] space-y-4 shadow-md animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-purple-200 pb-2">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider">
              Add New Prescribed Medication
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingMed(false)}
              className="text-gray-400 hover:text-gray-700 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Drug / Medicine Name *</label>
              <input
                type="text"
                required
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                placeholder="e.g. Thyronorm"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g. 88 mcg or 500 mg"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Frequency</label>
              <input
                type="text"
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value)}
                placeholder="e.g. 1-0-0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Timing / Relation to Food</label>
              <input
                type="text"
                value={newTiming}
                onChange={(e) => setNewTiming(e.target.value)}
                placeholder="e.g. Morning Empty Stomach"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="e.g. 90 Days"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Special Instructions</label>
              <input
                type="text"
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="e.g. Take with warm water"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#7E22CE] text-white text-xs font-bold uppercase hover:bg-[#6b1dae]"
            >
              Add to Prescription
            </button>
          </div>
        </form>
      )}

      {/* Official Prescription Paper View with Letterhead */}
      <div className="w-full flex justify-center">
        <ZiathlonLetterheadFrame showZoomControls={false}>
          <div className="space-y-2.5 text-gray-950 font-sans text-left">
            {/* ========================================================================= */}
            {/* 1. PATIENT INFORMATION: COMPACT READABLE LINES (NO TABLES, NO COLUMNS)    */}
            {/* ========================================================================= */}
            <div className="border-b border-purple-200/80 pb-2 mb-2 text-[10px] leading-relaxed">
              {/* Line 1: Patient Name, Gender, Age, Phone (with Date & Time on right) */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
                  <span className="font-extrabold text-[13px] text-[#0B0826] tracking-tight">{patientName}</span>
                  <span className="text-slate-400">,</span>
                  <span className="font-semibold text-slate-800">{patientSex}</span>
                  <span className="text-slate-400">,</span>
                  <span className="font-semibold text-slate-800">{patientAge} Yrs</span>
                  <span className="text-slate-400">,</span>
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {generalInfo?.mobileNumber || generalInfo?.phone || '+91 94482 88008'}
                  </span>
                </div>
                <div className="text-[9.5px] text-slate-600 font-mono shrink-0">
                  <span>Date: <strong className="text-slate-900">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</strong></span>
                  <span className="mx-1.5 text-slate-300">|</span>
                  <span>Time: <strong className="text-slate-900">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong></span>
                </div>
              </div>

              {/* Line 2: City | UHID | ABHA Address | Occupation */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[9.5px] text-slate-700">
                <span>City: <strong className="text-slate-900 font-semibold">{generalInfo?.place || generalInfo?.city || 'Bangalore'}</strong></span>
                <span className="text-slate-300">|</span>
                <span>UHID: <strong className="font-mono font-bold text-[#7016B7]">{currentPatientId || 'ZC00459'}</strong></span>
                <span className="text-slate-300">|</span>
                <span>ABHA Address: <strong className="font-mono text-slate-900">{generalInfo?.email?.includes('@') ? generalInfo.email : '10436404055711@abdm'}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Occupation: <strong className="text-slate-900 font-semibold">{generalInfo?.occupation || 'IT Sector'}</strong></span>
              </div>

              {/* Line 3: Clinical Domain | Address */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[9px] text-slate-600">
                <span>Clinical Domain: <strong className="font-bold text-[#7016B7]">{generalInfo?.tag || 'Metabolic Health & Sports Medicine'}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Address: <span className="text-slate-800">{generalInfo?.address || 'JP Nagar 7th Phase, Bangalore'}</span></span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. DIAGNOSES & CLINICAL OBJECTIVES – CONTINUOUS INLINE FORMAT             */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">PRIMARY DIAGNOSES & METABOLIC STATUS: </span>
              <span className="font-medium text-slate-900">
                Subclinical Hypothyroidism & Metabolic Protocol (Plan: Formulary Protocol; Review: 90 Days) | Clinical Objectives: TSH / FT4 Normalization, Glycemic Control, Fat Loss
              </span>
            </div>

            {/* ========================================================================= */}
            {/* 3. TREATMENT PLAN / PRESCRIPTION (℞) – CONTINUOUS INLINE FORMAT          */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">TREATMENT PLAN / PRESCRIPTION (℞): </span>
              <span className="font-medium text-slate-900">
                {rxList.length > 0
                  ? rxList.map((item) => {
                      const details = [
                        item.dosage ? `Dose: ${item.dosage}` : '',
                        item.frequency ? `Frequency: ${item.frequency}` : '',
                        item.duration ? `Duration: ${item.duration}` : '',
                        item.instructions || item.timing ? `Instructions: ${item.instructions || item.timing}` : '',
                      ].filter(Boolean).join('; ');
                      return details ? `${item.medicineName} (${details})` : item.medicineName;
                    }).join(' | ')
                  : 'Kapiva Shilajit (Dose: 250 mg; Frequency: 1-0-0 After Meal; Duration: 30 Days; Instructions: Take after breakfast) | Vlado\'s Himalayan Organic Probiotics 60 Billion CFU (Dose: 1 capsule; Frequency: 1-0-0 After Meal; Duration: 30 Days; Instructions: Take after breakfast) | Wellman Health Supplement (Dose: 1 tablet; Frequency: 0-0-1 After Meal; Duration: 30 Days; Instructions: Take after dinner) | Liposomal MGD3 (Dose: 1 capsule; Frequency: 0-0-1 After Meal; Duration: 30 Days; Instructions: Take after dinner)'}
              </span>
            </div>

            {/* ========================================================================= */}
            {/* 4. DOCTOR REMARKS & INSTRUCTIONS – CONTINUOUS INLINE FORMAT               */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">PHYSICIAN ADMINISTRATION & LIFESTYLE NOTES: </span>
              <span className="font-medium text-slate-900">{doctorNotes}</span>
            </div>

            {/* ========================================================================= */}
            {/* 5. FOLLOW-UP RECOMMENDATIONS – CONTINUOUS INLINE FORMAT                   */}
            {/* ========================================================================= */}
            <div className="text-[9.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
              <span className="font-black text-[#7016B7] uppercase tracking-wider">FOLLOW-UP RECOMMENDATIONS: </span>
              <span className="font-medium text-slate-900">
                Review in clinic after 30 days or earlier in case of acute symptoms | Repeat Thyroid Panel & Fasting Glucose in 60 days
              </span>
            </div>

            {/* ========================================================================= */}
            {/* 6. CLINICAL CONSULTATION NOTE                                             */}
            {/* ========================================================================= */}
            <div className="pt-2 text-left">
              <p className="text-[8.5px] text-gray-500 font-mono font-semibold m-0">
                Clinical Prescription • Electronic EMR Record • Follow up after 30 days or earlier in case of acute symptoms
              </p>
            </div>
          </div>
        </ZiathlonLetterheadFrame>
      </div>
    </div>
  );
};
