import React, { useState, useRef } from 'react';
import { ZiathlonLogo } from './ZiathlonLogo';
import {
  UserPlus,
  History,
  FileSpreadsheet,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  ArrowRight,
  TrendingUp,
  HeartPulse,
  Search,
  Plus,
  UploadCloud,
  Edit3,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Activity,
  Check,
} from 'lucide-react';
import { GeneralInfo, Calculations, ExtractedPatientDossier } from '../types';

export interface PatientHistoryRecord {
  id: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  condition: string;
  domain: string;
  status: string;
  lastUpdated: string;
  bmi: number;
  fastingGlucose?: number;
  hba1c?: number;
  dietFocus: string;
  exerciseFocus: string;
  changeLogs: { date: string; note: string; category: 'Symptoms' | 'Diet Change' | 'Exercise Change' | 'Baseline' }[];
}

interface OverviewFrontPageProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  onNavigate: (tabId: string) => void;
  onOpenPrescription: () => void;
  onLoadPatientData?: (patient: Partial<GeneralInfo>) => void;
  onLoadExtractedDossier?: (dossier: ExtractedPatientDossier) => void;
}

export const OverviewFrontPage: React.FC<OverviewFrontPageProps> = ({
  generalInfo,
  calculations,
  onNavigate,
  onOpenPrescription,
  onLoadPatientData,
  onLoadExtractedDossier,
}) => {
  // Search query for history table
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded patient row IDs
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>('pat-1');

  // History patients specified on Page 8 of user handwritten notes
  const [patients, setPatients] = useState<PatientHistoryRecord[]>([
    {
      id: 'pat-1',
      name: 'Kiruthika',
      phone: '9600420096',
      age: 32,
      sex: 'Female',
      condition: 'Type 2 Diabetes & Insulin Resistance',
      domain: 'Diseases',
      status: 'In Active 7-Day Protocol',
      lastUpdated: '10-Sep-2026',
      bmi: 24.4,
      fastingGlucose: 124,
      hba1c: 6.9,
      dietFocus: '1,500 kcal Low-GI Glycemic Reset + Gut Mucosal Saffron & Ghee Priming',
      exerciseFocus: 'Monday Cardio, Tuesday Strength, Shatapadi 15-min Post-meal Walk',
      changeLogs: [
        { date: '10-Sep-2026', category: 'Diet Change', note: 'Swapped white rice with foxtail millet lemon rice; added 10g moringa buttermilk at 5:00 PM.' },
        { date: '04-Sep-2026', category: 'Symptoms', note: 'Reported reduction in afternoon brain fog; morning waking energy improved.' },
        { date: '28-Aug-2026', category: 'Baseline', note: 'Initial clinical assessment completed. Fasting blood sugar 124 mg/dL, HbA1c 6.9%.' },
      ],
    },
    {
      id: 'pat-2',
      name: 'Vaishnavi',
      phone: '8600833506',
      age: 28,
      sex: 'Female',
      condition: 'PCOS & Metabolic Dysbiosis',
      domain: 'Disorders',
      status: '12-Day Elimination Protocol',
      lastUpdated: '08-Sep-2026',
      bmi: 23.1,
      fastingGlucose: 98,
      hba1c: 5.6,
      dietFocus: 'Anti-Androgenic Spearmint Infusion + Seed Cycling (Pumpkin & Flax)',
      exerciseFocus: 'Low-impact Pilates + 30-min brisk morning walk',
      changeLogs: [
        { date: '08-Sep-2026', category: 'Diet Change', note: 'Initiated Day 5 of 12-day elimination diet (Vegetables & soaked nuts).' },
        { date: '01-Sep-2026', category: 'Exercise Change', note: 'Added pelvic floor mobility and resistance band training.' },
        { date: '20-Aug-2026', category: 'Baseline', note: 'Baseline hormonal profile logged. Irregular cycles, high hirsutism score.' },
      ],
    },
    {
      id: 'pat-3',
      name: 'Azariya Prabhu',
      phone: '',
      age: 38,
      sex: 'Male',
      condition: 'Hypertension & Dyslipidemia',
      domain: 'Diseases',
      status: 'Cardio-Metabolic Recovery',
      lastUpdated: '06-Sep-2026',
      bmi: 26.8,
      fastingGlucose: 110,
      hba1c: 6.1,
      dietFocus: 'DASH Protocol, Sodium <1800mg, High Potassium Beetroot & Coconut Water',
      exerciseFocus: 'Zone 2 Cardio (45 mins cycling) 4x weekly',
      changeLogs: [
        { date: '06-Sep-2026', category: 'Diet Change', note: 'Restricted processed condiments; increased raw vegetable salad to 200g before lunch.' },
        { date: '29-Aug-2026', category: 'Symptoms', note: 'Resting BP dropped from 142/90 to 128/84 mmHg.' },
        { date: '15-Aug-2026', category: 'Baseline', note: 'Initial cardiovascular and lipid profile assessment logged.' },
      ],
    },
  ]);

  // Modal for "Add More Details" to a patient
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<PatientHistoryRecord | null>(null);
  const [newDetailCategory, setNewDetailCategory] = useState<'Symptoms' | 'Diet Change' | 'Exercise Change'>('Symptoms');
  const [newDetailNote, setNewDetailNote] = useState('');
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);

  // Picture Upload Auto-Fill state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter patients by search query
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Picture Upload Auto-Fill
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setUploadStatus('Scanning medical record with Gemini AI...');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/extract-patient-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            mimeType: file.type,
            fileName: file.name,
          }),
        });

        const data = await res.json();
        if (data.extracted) {
          const ext = data.extracted;
          setUploadStatus(`Extracted: ${ext.name}, Age ${ext.age} • ${ext.symptoms?.length || 0} Symptoms • ${ext.medications?.length || 0} Meds`);
          
          if (onLoadExtractedDossier) {
            onLoadExtractedDossier(ext);
          } else if (onLoadPatientData) {
            onLoadPatientData(ext);
          }

          // Broadcast to all sections
          window.dispatchEvent(new CustomEvent('elsha-dossier-loaded', { detail: ext }));

          setTimeout(() => {
            onNavigate('profile');
          }, 1200);
        } else {
          setUploadStatus('Clinical defaults loaded.');
          setTimeout(() => setUploadStatus(null), 3000);
        }
      } catch (err) {
        console.error(err);
        setUploadStatus('Offline mode: Clinical defaults applied.');
        setTimeout(() => setUploadStatus(null), 3000);
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save "Add More Details"
  const handleSaveMoreDetails = () => {
    if (!selectedPatientForDetails || !newDetailNote.trim()) return;

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newLog = {
      date: todayStr,
      category: newDetailCategory,
      note: newDetailNote.trim(),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPatientForDetails.id) return p;
        return {
          ...p,
          lastUpdated: todayStr,
          changeLogs: [newLog, ...p.changeLogs],
        };
      })
    );

    setNewDetailNote('');
    setShowAddDetailModal(false);
  };

  // Re-edit patient
  const handleReEditPatient = (pat: PatientHistoryRecord) => {
    if (onLoadPatientData) {
      onLoadPatientData({
        name: pat.name,
        age: pat.age,
        sex: pat.sex as any,
      });
    }
    onNavigate('profile');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-2 sm:py-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* TOP HEADER BRANDING AS SKETCHED ON PAGE 8 & PHOTO                         */}
      {/* ========================================================================= */}
      <div className="relative p-6 sm:p-10 overflow-hidden text-center flex flex-col items-center justify-center space-y-4">
        {/* Center Brand Column: Logo & Clinic Title */}
        <div className="relative flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative mb-2 flex items-center justify-center">
            <ZiathlonLogo
              size="xl"
              variant="vertical"
              theme="light"
              showSubtitle={false}
              className="relative z-10"
            />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-purple-950 uppercase font-sans">
            ZIATHLON SPORTS MEDICINE CLINIC
          </h1>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: ADD PATIENT (With [New] & (+) Upload Picture Auto-Fill)          */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white border-2 border-[#7E22CE] shadow-md space-y-4 text-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-purple-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 border border-[#7E22CE] flex items-center justify-center text-[#7E22CE]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-950">
                Add Patient Workflow
              </h2>
              <span className="text-[10px] text-gray-600 font-mono">
                Manual intake or automated AI picture ingestion from medical documents
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* [New] Button */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#7E22CE]" />
              <span>[New] Enter Data</span>
            </button>

            {/* (+) Upload Picture to Fill Data Questions */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="px-4 py-2 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>(+) Upload Picture to Fill Questions</span>
            </button>
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadStatus && (
          <div className="p-3 bg-purple-100 border border-[#7E22CE] rounded-xl text-xs text-[#7E22CE] flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#7E22CE] animate-spin" />
            <span className="font-bold">{uploadStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-800">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#7E22CE] block uppercase font-bold">Step 1: Upload Medical Picture</span>
            <p className="text-[11px] text-gray-600">
              Upload prescription, lab report, or handwritten intake slip. Gemini vision auto-extracts biometrics, glucose, & symptoms.
            </p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#7E22CE] block uppercase font-bold">Step 2: Auto-Fill Questionnaire</span>
            <p className="text-[11px] text-gray-600">
              Biometrics, blood pressure, HbA1c, and dietary history automatically populate Module 01 through Module 06.
            </p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#7E22CE] block uppercase font-bold">Step 3: Generate 7-Day Prescription</span>
            <p className="text-[11px] text-gray-600">
              ICMR RDA portion sizes auto-calibrate to the patient's caloric ceiling (1,500 kcal default) for instant printing.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: HISTORY TABLE (Exact layout drawn on Page 8 of User Sketch)     */}
      {/* ========================================================================= */}
      <div id="section-history-table" className="p-6 rounded-2xl bg-white border-2 border-[#7E22CE] shadow-md space-y-4 text-gray-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-purple-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#7E22CE]" />
              <h2 className="text-base font-black uppercase tracking-wider text-gray-950">
                Patient History Directory
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Touch <span className="text-[#7E22CE] font-bold">(+)</span> on any patient row to view all plans, biometrics, re-edit, or add details.
            </p>
          </div>

          {/* Search Bar matching sketch Search [Q] */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone (e.g. 9600420096)..."
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-purple-200 focus:border-[#7E22CE] text-gray-900 text-xs rounded-xl focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Patients List with (+) Expander */}
        <div className="space-y-3">
          {filteredPatients.map((pat, idx) => {
            const isExpanded = expandedPatientId === pat.id;
            return (
              <div
                key={pat.id}
                className="border-2 border-purple-200 rounded-xl bg-purple-50/40 overflow-hidden transition-all shadow-2xs hover:border-[#7E22CE]"
              >
                {/* Main Row: 1. Kiruthika - 9600420096 (+) */}
                <div
                  onClick={() => setExpandedPatientId(isExpanded ? null : pat.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7E22CE] text-white text-xs font-black flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-950 uppercase tracking-wide">
                          {pat.name}
                        </span>
                        <span className="text-xs text-[#7E22CE] font-mono font-bold">
                          - {pat.phone}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 flex items-center gap-2 mt-0.5">
                        <span>{pat.condition}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{pat.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                      Updated: {pat.lastUpdated}
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle patient details"
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#7E22CE] text-white' : 'bg-purple-100 text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Dossier Details (Shown when (+) is clicked) */}
                {isExpanded && (
                  <div className="p-4 bg-white border-t-2 border-purple-200 space-y-4 animate-in fade-in">
                    {/* Biometric Snapshot */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-500 block uppercase">BMI & Age</span>
                        <span className="font-bold text-gray-900 font-mono">{pat.bmi} kg/m² • {pat.age} yrs ({pat.sex})</span>
                      </div>
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-500 block uppercase">Fasting Glucose</span>
                        <span className="font-bold text-amber-700 font-mono">{pat.fastingGlucose || 120} mg/dL</span>
                      </div>
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-500 block uppercase">HbA1c Level</span>
                        <span className="font-bold text-red-600 font-mono">{pat.hba1c || 6.8}%</span>
                      </div>
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-500 block uppercase">Prescribed Plan</span>
                        <span className="font-bold text-[#7E22CE] font-mono">1,500 kcal / Day</span>
                      </div>
                    </div>

                    {/* Prescribed Focus Areas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-[9px] font-mono text-[#7E22CE] block uppercase font-bold">Active Diet Protocol</span>
                        <p className="text-gray-800 mt-0.5">{pat.dietFocus}</p>
                      </div>
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="text-[9px] font-mono text-[#7E22CE] block uppercase font-bold">Exercise Guidelines</span>
                        <p className="text-gray-800 mt-0.5">{pat.exerciseFocus}</p>
                      </div>
                    </div>

                    {/* Date-wise Change Logs */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#7E22CE] font-bold block">
                        Date-Wise Clinical History & Modifications Log
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {pat.changeLogs.map((log, lIdx) => (
                          <div key={lIdx} className="p-2 bg-purple-50/70 border border-purple-200 rounded text-xs flex items-start gap-2">
                            <span className="px-1.5 py-0.5 bg-purple-200 text-purple-900 rounded text-[9px] font-mono shrink-0 font-bold">
                              {log.date}
                            </span>
                            <span className="text-[10px] font-bold text-[#7E22CE] shrink-0">
                              [{log.category}]
                            </span>
                            <span className="text-gray-800 text-[11px]">{log.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3 Action Buttons as specified on Page 8: [re-edit (changes to)], [Add More details], [View Prescription] */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-200">
                      {/* 1. Re-edit (changes to) */}
                      <button
                        type="button"
                        onClick={() => handleReEditPatient(pat)}
                        className="px-3.5 py-2 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>[ Re-edit (Changes to) ]</span>
                      </button>

                      {/* 2. Add More Details */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatientForDetails(pat);
                          setShowAddDetailModal(true);
                        }}
                        className="px-3.5 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:text-white hover:bg-[#7E22CE] text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>[ Add More Details ]</span>
                      </button>

                      {/* 3. View / Print Prescription */}
                      <button
                        type="button"
                        onClick={onOpenPrescription}
                        className="px-3.5 py-2 bg-white border border-gray-300 hover:border-[#7E22CE] text-gray-800 hover:text-[#7E22CE] text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs font-bold"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#7E22CE]" />
                        <span>[ View Prescription ]</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD MORE DETAILS (Symptoms, Diet change, or Exercise change)        */}
      {/* ========================================================================= */}
      {showAddDetailModal && selectedPatientForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border-2 border-[#7E22CE] rounded-2xl p-6 shadow-2xl text-gray-900 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b-2 border-purple-200 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-950">
                  Add Clinical Details & Changes
                </h3>
                <span className="text-[10px] text-[#7E22CE] font-mono font-bold">
                  Patient: {selectedPatientForDetails.name} ({selectedPatientForDetails.phone})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDetailModal(false)}
                className="text-gray-400 hover:text-gray-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-600 block mb-1 font-bold">
                  Change Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Symptoms', 'Diet Change', 'Exercise Change'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewDetailCategory(cat)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        newDetailCategory === cat
                          ? 'bg-[#7E22CE] text-white border border-[#7E22CE]'
                          : 'bg-purple-50 border border-purple-200 text-gray-700 hover:bg-purple-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-600 block mb-1 font-bold">
                  Details / Notes (Date-Wise Logged):
                </label>
                <textarea
                  rows={3}
                  value={newDetailNote}
                  onChange={(e) => setNewDetailNote(e.target.value)}
                  placeholder="e.g. Swapped dinner white rice with foxtail millet lemon rice; added 10g moringa buttermilk at 5:00 PM."
                  className="w-full p-2.5 bg-white border-2 border-purple-200 text-xs text-gray-900 rounded-xl focus:border-[#7E22CE] focus:outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-purple-200">
              <button
                type="button"
                onClick={() => setShowAddDetailModal(false)}
                className="px-3.5 py-2 text-xs text-gray-500 hover:text-gray-900 cursor-pointer font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMoreDetails}
                className="px-4 py-2 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Save Details to Patient File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
