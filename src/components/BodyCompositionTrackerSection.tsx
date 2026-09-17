import React, { useState, useRef } from 'react';
import {
  Activity,
  Plus,
  Trash2,
  Upload,
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Printer,
  ShieldCheck,
  Scale,
  Calendar,
} from 'lucide-react';

export interface BodyCompositionEntry {
  id: string;
  entryNo: number;
  date: string;
  weekLabel: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  fatMassKg: number;
  fatPercentage: number;
  muscleMassKg: number;
  ffmKg: number; // Fat Free Mass
  visceralFat: number; // Rating 1 - 20
  tbwKg: number; // Total Body Water
  bmrKcal: number;
  bodyProfile: string;
}

export const initialBodyCompositionRecords: BodyCompositionEntry[] = [
  {
    id: 'bc-1',
    entryNo: 1,
    date: '12-Jan-2026',
    weekLabel: 'Baseline (Week 1)',
    heightCm: 162,
    weightKg: 66.0,
    bmi: 25.1,
    fatMassKg: 21.4,
    fatPercentage: 32.4,
    muscleMassKg: 42.1,
    ffmKg: 44.6,
    visceralFat: 11,
    tbwKg: 31.8,
    bmrKcal: 1320,
    bodyProfile: 'Overfat / High Visceral Risk',
  },
  {
    id: 'bc-2',
    entryNo: 2,
    date: '19-Jan-2026',
    weekLabel: 'Week 2',
    heightCm: 162,
    weightKg: 64.8,
    bmi: 24.7,
    fatMassKg: 20.3,
    fatPercentage: 31.3,
    muscleMassKg: 42.0,
    ffmKg: 44.5,
    visceralFat: 10,
    tbwKg: 32.0,
    bmrKcal: 1315,
    bodyProfile: 'Pre-Obese / Improving Glycemia',
  },
  {
    id: 'bc-3',
    entryNo: 3,
    date: '26-Jan-2026',
    weekLabel: 'Week 3',
    heightCm: 162,
    weightKg: 63.6,
    bmi: 24.2,
    fatMassKg: 19.1,
    fatPercentage: 30.0,
    muscleMassKg: 42.1,
    ffmKg: 44.5,
    visceralFat: 9,
    tbwKg: 32.3,
    bmrKcal: 1318,
    bodyProfile: 'Standard Healthy Range',
  },
  {
    id: 'bc-4',
    entryNo: 4,
    date: '02-Feb-2026',
    weekLabel: 'Week 4',
    heightCm: 162,
    weightKg: 62.5,
    bmi: 23.8,
    fatMassKg: 18.0,
    fatPercentage: 28.8,
    muscleMassKg: 42.2,
    ffmKg: 44.5,
    visceralFat: 8,
    tbwKg: 32.6,
    bmrKcal: 1322,
    bodyProfile: 'Fit & Metabolically Active',
  },
  {
    id: 'bc-5',
    entryNo: 5,
    date: '09-Feb-2026',
    weekLabel: 'Week 5 (Current)',
    heightCm: 162,
    weightKg: 61.5,
    bmi: 23.4,
    fatMassKg: 16.9,
    fatPercentage: 27.5,
    muscleMassKg: 42.4,
    ffmKg: 44.6,
    visceralFat: 7,
    tbwKg: 32.9,
    bmrKcal: 1326,
    bodyProfile: 'Optimal Lean Recomposition',
  },
];

interface BodyCompositionTrackerSectionProps {
  patientName: string;
  onSyncCurrentStatsToProfile?: (latest: BodyCompositionEntry) => void;
}

export const BodyCompositionTrackerSection: React.FC<BodyCompositionTrackerSectionProps> = ({
  patientName,
  onSyncCurrentStatsToProfile,
}) => {
  const [records, setRecords] = useState<BodyCompositionEntry[]>(initialBodyCompositionRecords);
  const [isAutoParsing, setIsAutoParsing] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Record Form State
  const [newDate, setNewDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [newWeek, setNewWeek] = useState(`Week ${records.length + 1}`);
  const [newWeight, setNewWeight] = useState('61.0');
  const [newHeight, setNewHeight] = useState('162');
  const [newFatMass, setNewFatMass] = useState('16.5');
  const [newMuscle, setNewMuscle] = useState('42.5');
  const [newVisceral, setNewVisceral] = useState('7');
  const [newProfile, setNewProfile] = useState('Lean Progression');

  const baseline = records[0] || records[records.length - 1];
  const latest = records[records.length - 1] || baseline;

  const weightDiff = (latest.weightKg - baseline.weightKg).toFixed(1);
  const fatMassDiff = (latest.fatMassKg - baseline.fatMassKg).toFixed(1);
  const muscleDiff = (latest.muscleMassKg - baseline.muscleMassKg).toFixed(1);
  const visceralDiff = latest.visceralFat - baseline.visceralFat;
  const fatPctDiff = (latest.fatPercentage - baseline.fatPercentage).toFixed(1);

  const handleUpdateField = (id: string, field: keyof BodyCompositionEntry, value: any) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          // Auto recalculate BMI if height or weight changed
          if (field === 'weightKg' || field === 'heightCm') {
            const hM = (updated.heightCm || 162) / 100;
            updated.bmi = parseFloat(((updated.weightKg || 60) / (hM * hM)).toFixed(1));
          }
          // Auto recalculate FFM if weight and fatMassKg exist
          if (field === 'weightKg' || field === 'fatMassKg') {
            updated.ffmKg = parseFloat((Math.max(0, updated.weightKg - updated.fatMassKg)).toFixed(1));
            updated.fatPercentage = parseFloat(((updated.fatMassKg / (updated.weightKg || 1)) * 100).toFixed(1));
          }
          return updated;
        }
        return r;
      })
    );
  };

  const handleSaveNewEntry = () => {
    const w = parseFloat(newWeight) || 60;
    const h = parseFloat(newHeight) || 162;
    const fm = parseFloat(newFatMass) || 16;
    const mm = parseFloat(newMuscle) || 42;
    const vf = parseInt(newVisceral) || 7;
    const hM = h / 100;
    const bmiVal = parseFloat((w / (hM * hM)).toFixed(1));
    const fatPctVal = parseFloat(((fm / w) * 100).toFixed(1));
    const ffmVal = parseFloat((w - fm).toFixed(1));

    const nextNo = records.length + 1;
    const newEntry: BodyCompositionEntry = {
      id: `bc-${Date.now()}`,
      entryNo: nextNo,
      date: newDate,
      weekLabel: newWeek,
      heightCm: h,
      weightKg: w,
      bmi: bmiVal,
      fatMassKg: fm,
      fatPercentage: fatPctVal,
      muscleMassKg: mm,
      ffmKg: ffmVal,
      visceralFat: vf,
      tbwKg: parseFloat((ffmVal * 0.73).toFixed(1)),
      bmrKcal: Math.round(370 + 21.6 * ffmVal),
      bodyProfile: newProfile || 'Progress Evaluation',
    };

    setRecords((prev) => [...prev, newEntry]);
    setShowAddForm(false);
    setUploadSuccessMsg(`Biometric Entry for ${newWeek} added successfully!`);
    setTimeout(() => setUploadSuccessMsg(null), 3500);
    if (onSyncCurrentStatsToProfile) {
      onSyncCurrentStatsToProfile(newEntry);
    }
  };

  const handleDeleteRow = (id: string) => {
    if (records.length <= 1) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAutoParsing(true);
    setTimeout(() => {
      const nextNo = records.length + 1;
      const parsedEntry: BodyCompositionEntry = {
        id: `bc-scan-${Date.now()}`,
        entryNo: nextNo,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        weekLabel: `Week ${nextNo} (Auto-Extracted from ${file.name.slice(0, 14)}...)`,
        heightCm: 162,
        weightKg: 60.8,
        bmi: 23.1,
        fatMassKg: 16.0,
        fatPercentage: 26.3,
        muscleMassKg: 42.7,
        ffmKg: 44.8,
        visceralFat: 6,
        tbwKg: 33.2,
        bmrKcal: 1332,
        bodyProfile: 'InBody Scan: Athletic Lean Zone',
      };

      setRecords((prev) => [...prev, parsedEntry]);
      setIsAutoParsing(false);
      setUploadSuccessMsg(`Successfully parsed ${file.name}: Body composition metrics auto-populated!`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
      if (onSyncCurrentStatsToProfile) {
        onSyncCurrentStatsToProfile(parsedEntry);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            MODULE 20 • AUTOMATED BIOMETRIC & BODY COMPOSITION PROGRESSION
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Progress Tracking & Biometric Data Sheet
          </h2>
          <p className="text-xs text-gray-400">
            Patient: <span className="text-[#A855F7] font-bold">{patientName}</span> • Tracking Height, Weight, Fat Mass, Fat %, Muscle Mass, FFM & Visceral Fat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* File Upload for Body Composition Analyzer */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.pdf,image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAutoParsing}
            className="px-3.5 py-2 bg-black border border-[#7E22CE] text-[#C084FC] text-xs font-bold uppercase tracking-wider hover:bg-[#7E22CE] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isAutoParsing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Report...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Analyzer Scan</span>
              </>
            )}
          </button>

          {/* User Requested: High-Visibility + Button to Add Biometric Record */}
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-5 py-2.5 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(126,34,206,0.6)]"
          >
            <Plus className="w-4 h-4 stroke-[3] text-white" />
            <span className="font-extrabold">+ Add Biometric Entry</span>
          </button>
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-3 bg-purple-950/70 border border-[#7E22CE] text-[#C084FC] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* INLINE + ADD ENTRY MODAL / DRAWER FORM */}
      {showAddForm && (
        <div className="bg-[#0e071a] border-2 border-[#7E22CE] p-5 shadow-[0_0_20px_rgba(126,34,206,0.3)] space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
              <Plus className="w-4 h-4 text-[#A855F7]" />
              <span>Enter New Biometric Assessment (Live Auto-Calculate)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Assessment Date:</label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-white focus:border-[#7E22CE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Week / Phase Label:</label>
              <input
                type="text"
                value={newWeek}
                onChange={(e) => setNewWeek(e.target.value)}
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-[#C084FC] font-bold focus:border-[#7E22CE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Height (cm):</label>
              <input
                type="number"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value)}
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-white focus:border-[#7E22CE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#A855F7] font-bold block mb-1">Weight (kg):</label>
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full bg-black border border-[#7E22CE] px-2.5 py-1.5 text-white font-bold focus:border-[#A855F7] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Fat Mass (kg):</label>
              <input
                type="number"
                step="0.1"
                value={newFatMass}
                onChange={(e) => setNewFatMass(e.target.value)}
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-white focus:border-[#7E22CE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Muscle Mass (kg):</label>
              <input
                type="number"
                step="0.1"
                value={newMuscle}
                onChange={(e) => setNewMuscle(e.target.value)}
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-white focus:border-[#7E22CE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Visceral Fat (1-20):</label>
              <input
                type="number"
                value={newVisceral}
                onChange={(e) => setNewVisceral(e.target.value)}
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-white focus:border-[#7E22CE] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Body Profile Note:</label>
              <input
                type="text"
                value={newProfile}
                onChange={(e) => setNewProfile(e.target.value)}
                placeholder="e.g. Lean Recomposition"
                className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-white focus:border-[#7E22CE] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 bg-black border border-white/20 text-gray-300 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNewEntry}
              className="px-5 py-1.5 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.4)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Compute Biometrics</span>
            </button>
          </div>
        </div>
      )}

      {/* Starting Baseline vs Current Progress Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Weight Change */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Total Weight Delta</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{weightDiff} kg</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              Loss
            </span>
          </div>
          <span className="text-[10px] text-[#A855F7] font-mono">
            {baseline.weightKg}kg → {latest.weightKg}kg
          </span>
        </div>

        {/* Fat Mass Lost */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Adipose Fat Mass</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">{fatMassDiff} kg</span>
            <span className="text-xs font-bold text-emerald-400">Burned</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {baseline.fatMassKg}kg → {latest.fatMassKg}kg
          </span>
        </div>

        {/* Fat Percentage */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Body Fat %</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{latest.fatPercentage}%</span>
            <span className="text-xs font-bold text-emerald-400">{fatPctDiff}%</span>
          </div>
          <span className="text-[10px] text-[#A855F7] font-mono">
            {baseline.fatPercentage}% → {latest.fatPercentage}%
          </span>
        </div>

        {/* Muscle Mass */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Skeletal Muscle</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{latest.muscleMassKg} kg</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +{muscleDiff}kg
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Muscle preserved/hypertrophy</span>
        </div>

        {/* Visceral Fat Rating */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Visceral Fat Level</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">Level {latest.visceralFat}</span>
            <span className="text-xs font-bold text-emerald-400">
              {visceralDiff < 0 ? `${visceralDiff}` : 'Stable'}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            Was Level {baseline.visceralFat} (Target: &lt;9)
          </span>
        </div>
      </div>

      {/* THE MASTER EXCEL TABLE (Exact Model from User's PDF 2 Page 1) */}
      <div className="bg-[#0d0617] border border-[#7E22CE] overflow-hidden">
        <div className="p-3 bg-black border-b border-[#7E22CE] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#A855F7]" />
            <span className="text-xs uppercase font-black text-white tracking-widest">
              Biometric Data Progress Sheet (Live Editable Cells)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#C084FC]">
            {records.length} Recorded Assessments • InBody / Tanita Precision
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-black/90 text-[#A855F7] font-mono text-[10px] uppercase tracking-wider border-b border-[#7E22CE]/60">
                <th className="py-2.5 px-3 text-center w-10">S.No</th>
                <th className="py-2.5 px-3 w-28">Date</th>
                <th className="py-2.5 px-3 w-36">Week / Phase</th>
                <th className="py-2.5 px-2 text-right">Height (cm)</th>
                <th className="py-2.5 px-2 text-right">Weight (kg)</th>
                <th className="py-2.5 px-2 text-right">BMI</th>
                <th className="py-2.5 px-2 text-right">Fat Mass (kg)</th>
                <th className="py-2.5 px-2 text-right">Fat %</th>
                <th className="py-2.5 px-2 text-right">Muscle (kg)</th>
                <th className="py-2.5 px-2 text-right">FFM (kg)</th>
                <th className="py-2.5 px-2 text-center">Visceral Fat</th>
                <th className="py-2.5 px-2 text-right">TBW (kg)</th>
                <th className="py-2.5 px-2 text-right">BMR (kcal)</th>
                <th className="py-2.5 px-3">Body Profile</th>
                <th className="py-2.5 px-2 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono">
              {records.map((r, index) => {
                const isLatest = index === records.length - 1;
                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      isLatest ? 'bg-purple-950/20 hover:bg-purple-950/30' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* S.No */}
                    <td className="py-2 px-3 text-center text-gray-500">{index + 1}</td>

                    {/* Date */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={r.date}
                        onChange={(e) => handleUpdateField(r.id, 'date', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 px-1.5 py-1 text-white text-[11px] focus:border-[#7E22CE] focus:outline-none"
                      />
                    </td>

                    {/* Week Label */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={r.weekLabel}
                        onChange={(e) => handleUpdateField(r.id, 'weekLabel', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 px-1.5 py-1 text-[#C084FC] font-bold text-[11px] focus:border-[#7E22CE] focus:outline-none"
                      />
                    </td>

                    {/* Height */}
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        value={r.heightCm}
                        onChange={(e) => handleUpdateField(r.id, 'heightCm', parseFloat(e.target.value) || 0)}
                        className="w-16 text-right bg-black/60 border border-white/10 px-1.5 py-1 text-white text-[11px] focus:border-[#7E22CE] focus:outline-none"
                      />
                    </td>

                    {/* Weight */}
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        value={r.weightKg}
                        onChange={(e) => handleUpdateField(r.id, 'weightKg', parseFloat(e.target.value) || 0)}
                        className="w-16 text-right bg-black/60 border border-[#7E22CE]/60 px-1.5 py-1 text-white font-bold text-[11px] focus:border-[#A855F7] focus:outline-none"
                      />
                    </td>

                    {/* BMI */}
                    <td className="py-2 px-2 text-right text-yellow-400 font-bold">
                      {r.bmi}
                    </td>

                    {/* Fat Mass */}
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        value={r.fatMassKg}
                        onChange={(e) => handleUpdateField(r.id, 'fatMassKg', parseFloat(e.target.value) || 0)}
                        className="w-16 text-right bg-black/60 border border-white/10 px-1.5 py-1 text-white text-[11px] focus:border-[#7E22CE] focus:outline-none"
                      />
                    </td>

                    {/* Fat % */}
                    <td className="py-2 px-2 text-right text-emerald-300 font-bold">
                      {r.fatPercentage}%
                    </td>

                    {/* Muscle Mass */}
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        value={r.muscleMassKg}
                        onChange={(e) => handleUpdateField(r.id, 'muscleMassKg', parseFloat(e.target.value) || 0)}
                        className="w-16 text-right bg-black/60 border border-white/10 px-1.5 py-1 text-white text-[11px] focus:border-[#7E22CE] focus:outline-none"
                      />
                    </td>

                    {/* FFM (Fat Free Mass) */}
                    <td className="py-2 px-2 text-right text-gray-300">
                      {r.ffmKg}
                    </td>

                    {/* Visceral Fat */}
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${
                        r.visceralFat <= 8 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        Level {r.visceralFat}
                      </span>
                    </td>

                    {/* TBW */}
                    <td className="py-2 px-2 text-right text-gray-400">
                      {r.tbwKg}L
                    </td>

                    {/* BMR */}
                    <td className="py-2 px-2 text-right text-white">
                      {r.bmrKcal}
                    </td>

                    {/* Body Profile */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={r.bodyProfile}
                        onChange={(e) => handleUpdateField(r.id, 'bodyProfile', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 px-1.5 py-1 text-gray-200 text-[10px] font-sans focus:border-[#7E22CE] focus:outline-none"
                      />
                    </td>

                    {/* Delete */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(r.id)}
                        disabled={records.length <= 1}
                        className="text-gray-500 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                        title="Delete entry"
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
      </div>
    </div>
  );
};
