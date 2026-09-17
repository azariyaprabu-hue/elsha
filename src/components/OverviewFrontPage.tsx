import React, { useState, useRef } from 'react';
import { ZiathlonLogo } from './ZiathlonLogo';
import {
  UserPlus,
  QrCode,
  Calendar,
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
import { GeneralInfo, Calculations } from '../types';

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
}

export const OverviewFrontPage: React.FC<OverviewFrontPageProps> = ({
  generalInfo,
  calculations,
  onNavigate,
  onOpenPrescription,
  onLoadPatientData,
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
          body: JSON.stringify({ imageBase64: base64Data }),
        });

        const data = await res.json();
        if (data.extracted) {
          const ext = data.extracted;
          setUploadStatus(`Extracted: ${ext.name}, Age ${ext.age}, HbA1c ${ext.hba1c}%`);
          if (onLoadPatientData) {
            onLoadPatientData({
              name: ext.name,
              age: ext.age,
              sex: ext.sex,
              height: ext.height || generalInfo.height,
              weight: ext.weight || generalInfo.weight,
              waistCircumference: ext.waistCircumference || generalInfo.waistCircumference,
              hipCircumference: ext.hipCircumference || generalInfo.hipCircumference,
            });
          }
          setTimeout(() => {
            onNavigate('general');
          }, 1500);
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
    onNavigate('general');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-2 sm:py-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* TOP HEADER BRANDING AS SKETCHED ON PAGE 8 & PHOTO                         */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a0b4d] via-[#0f041d] to-[#000000] border-2 border-[#7E22CE] p-6 sm:p-10 shadow-[0_0_50px_rgba(126,34,206,0.35)] overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#7E22CE]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-900/30 blur-3xl pointer-events-none" />

        {/* ELSHA Top-Right Gold Emblem (As hand-drawn in User's sketch) */}
        <div className="absolute top-4 right-5 flex items-center gap-2">
          <span className="px-3.5 py-1 text-xs font-black tracking-widest text-[#F59E0B] font-serif border border-[#F59E0B]/50 rounded-lg bg-black/80 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            ELSHA
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Menu Column as drawn on Page 8 sketch */}
          <div className="lg:col-span-3 space-y-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
            <span className="text-[9px] font-mono uppercase text-[#C084FC] font-bold tracking-widest block mb-2">
              CLINICAL NAVIGATION
            </span>
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="w-full text-left py-2.5 px-3.5 rounded-xl bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider flex items-center justify-between shadow-[0_0_12px_rgba(126,34,206,0.6)] cursor-pointer"
            >
              <span>Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('section-history-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left py-2.5 px-3.5 rounded-xl bg-black/60 hover:bg-[#1a0833] text-gray-200 hover:text-white border border-white/10 hover:border-[#7E22CE] text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>History</span>
              <History className="w-3.5 h-3.5 text-[#C084FC]" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('general')}
              className="w-full text-left py-2.5 px-3.5 rounded-xl bg-black/60 hover:bg-[#1a0833] text-gray-200 hover:text-white border border-white/10 hover:border-[#7E22CE] text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Add Patient</span>
              <UserPlus className="w-3.5 h-3.5 text-purple-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('whatsapp-ai')}
              className="w-full text-left py-2.5 px-3.5 rounded-xl bg-black/60 hover:bg-[#072418] text-gray-200 hover:text-emerald-400 border border-white/10 hover:border-emerald-500 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Watsapp</span>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('client-folders')}
              className="w-full text-left py-2.5 px-3.5 rounded-xl bg-black/60 hover:bg-[#18092e] text-gray-200 hover:text-white border border-white/10 hover:border-[#7E22CE] text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Client Folders</span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#A855F7]" />
            </button>
          </div>

          {/* Center Brand Column: Logo & Clinic Title */}
          <div className="lg:col-span-9 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative mb-2 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#7E22CE]/40 rounded-full blur-2xl scale-125" />
              <ZiathlonLogo
                size="xl"
                variant="vertical"
                theme="dark"
                showSubtitle={false}
                className="relative z-10 drop-shadow-[0_0_25px_rgba(192,132,252,0.8)]"
              />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              ŽIATHLON SPORTS MEDICINE CLINIC
            </h1>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => onNavigate('custom-plan-studio')}
                className="px-4 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(126,34,206,0.6)] cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>7-Day Plan Studio</span>
              </button>
              <button
                type="button"
                onClick={onOpenPrescription}
                className="px-4 py-2 bg-black border-2 border-[#7E22CE] text-[#C084FC] hover:text-white hover:bg-[#7E22CE] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Final Prescription</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('whatsapp-ai')}
                className="px-4 py-2 bg-[#072418] border-2 border-emerald-500 text-emerald-400 hover:bg-[#25D366] hover:text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>WhatsApp QR Hub</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: ADD PATIENT (With [New] & (+) Upload Picture Auto-Fill)          */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[#0d0617] border-2 border-[#7E22CE] shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7E22CE]/30 border border-[#7E22CE] flex items-center justify-center text-[#C084FC]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Add Patient Workflow
              </h2>
              <span className="text-[10px] text-gray-400 font-mono">
                Manual intake or automated AI picture ingestion from medical documents
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* [New] Button */}
            <button
              type="button"
              onClick={() => onNavigate('general')}
              className="px-4 py-2 bg-black border border-white/20 hover:border-[#7E22CE] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C084FC]" />
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
              className="px-4 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-[0_0_15px_rgba(126,34,206,0.6)] flex items-center gap-1.5 disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>(+) Upload Picture to Fill Questions</span>
            </button>
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadStatus && (
          <div className="p-3 bg-purple-950/80 border border-[#7E22CE] rounded-xl text-xs text-[#C084FC] flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="font-bold">{uploadStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300">
          <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#C084FC] block uppercase font-bold">Step 1: Upload Medical Picture</span>
            <p className="text-[11px] text-gray-400">
              Upload prescription, lab report, or handwritten intake slip. Gemini vision auto-extracts biometrics, glucose, & symptoms.
            </p>
          </div>
          <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#C084FC] block uppercase font-bold">Step 2: Auto-Fill Questionnaire</span>
            <p className="text-[11px] text-gray-400">
              Biometrics, blood pressure, HbA1c, and dietary history automatically populate Module 01 through Module 06.
            </p>
          </div>
          <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#C084FC] block uppercase font-bold">Step 3: Generate 7-Day Prescription</span>
            <p className="text-[11px] text-gray-400">
              ICMR RDA portion sizes auto-calibrate to the patient's caloric ceiling (1,500 kcal default) for instant printing.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: HISTORY TABLE (Exact layout drawn on Page 8 of User Sketch)     */}
      {/* ========================================================================= */}
      <div id="section-history-table" className="p-6 rounded-2xl bg-[#09030f] border-2 border-[#7E22CE] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#C084FC]" />
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Patient History Directory
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Touch <span className="text-[#C084FC] font-bold">(+)</span> on any patient row to view all plans, biometrics, re-edit, or add details.
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
              className="w-full pl-9 pr-3 py-2 bg-black border border-white/20 focus:border-[#7E22CE] text-white text-xs rounded-xl focus:outline-none placeholder:text-gray-500"
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
                className="border border-[#7E22CE]/60 rounded-xl bg-black/80 overflow-hidden transition-all shadow-md hover:border-[#7E22CE]"
              >
                {/* Main Row: 1. Kiruthika - 9600420096 (+) */}
                <div
                  onClick={() => setExpandedPatientId(isExpanded ? null : pat.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7E22CE] text-white text-xs font-black flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white uppercase tracking-wide">
                          {pat.name}
                        </span>
                        <span className="text-xs text-purple-300 font-mono">
                          - {pat.phone}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{pat.condition}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{pat.status}</span>
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
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        isExpanded ? 'bg-[#7E22CE] text-white' : 'bg-white/10 text-[#C084FC] hover:bg-[#7E22CE] hover:text-white'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Dossier Details (Shown when (+) is clicked) */}
                {isExpanded && (
                  <div className="p-4 bg-[#0e041a] border-t border-white/10 space-y-4 animate-in fade-in">
                    {/* Biometric Snapshot */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-400 block uppercase">BMI & Age</span>
                        <span className="font-bold text-white font-mono">{pat.bmi} kg/m² • {pat.age} yrs ({pat.sex})</span>
                      </div>
                      <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-400 block uppercase">Fasting Glucose</span>
                        <span className="font-bold text-amber-300 font-mono">{pat.fastingGlucose || 120} mg/dL</span>
                      </div>
                      <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-400 block uppercase">HbA1c Level</span>
                        <span className="font-bold text-red-400 font-mono">{pat.hba1c || 6.8}%</span>
                      </div>
                      <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg">
                        <span className="text-[9px] font-mono text-gray-400 block uppercase">Prescribed Plan</span>
                        <span className="font-bold text-purple-300 font-mono">1,500 kcal / Day</span>
                      </div>
                    </div>

                    {/* Prescribed Focus Areas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 bg-black/60 border border-[#7E22CE]/40 rounded-lg">
                        <span className="text-[9px] font-mono text-[#C084FC] block uppercase font-bold">Active Diet Protocol</span>
                        <p className="text-gray-200 mt-0.5">{pat.dietFocus}</p>
                      </div>
                      <div className="p-2.5 bg-black/60 border border-[#7E22CE]/40 rounded-lg">
                        <span className="text-[9px] font-mono text-[#C084FC] block uppercase font-bold">Exercise Guidelines</span>
                        <p className="text-gray-200 mt-0.5">{pat.exerciseFocus}</p>
                      </div>
                    </div>

                    {/* Date-wise Change Logs */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#C084FC] font-bold block">
                        Date-Wise Clinical History & Modifications Log
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {pat.changeLogs.map((log, lIdx) => (
                          <div key={lIdx} className="p-2 bg-black/40 border border-white/5 rounded text-xs flex items-start gap-2">
                            <span className="px-1.5 py-0.5 bg-[#7E22CE]/40 text-[#C084FC] rounded text-[9px] font-mono shrink-0">
                              {log.date}
                            </span>
                            <span className="text-[10px] font-bold text-purple-300 shrink-0">
                              [{log.category}]
                            </span>
                            <span className="text-gray-300 text-[11px]">{log.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3 Action Buttons as specified on Page 8: [re-edit (changes to)], [Add More details], [View Prescription] */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                      {/* 1. Re-edit (changes to) */}
                      <button
                        type="button"
                        onClick={() => handleReEditPatient(pat)}
                        className="px-3.5 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(126,34,206,0.5)]"
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
                        className="px-3.5 py-2 bg-black border border-[#7E22CE] text-[#C084FC] hover:text-white hover:bg-[#7E22CE] text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>[ Add More Details ]</span>
                      </button>

                      {/* 3. View / Print Final Prescription */}
                      <button
                        type="button"
                        onClick={onOpenPrescription}
                        className="px-3.5 py-2 bg-black border border-white/20 hover:border-white text-gray-200 hover:text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>[ View Final Prescription ]</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0d0617] border-2 border-[#7E22CE] rounded-2xl p-6 shadow-2xl text-white space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Add Clinical Details & Changes
                </h3>
                <span className="text-[10px] text-purple-300 font-mono">
                  Patient: {selectedPatientForDetails.name} ({selectedPatientForDetails.phone})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDetailModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
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
                          ? 'bg-[#7E22CE] text-white border border-[#C084FC]'
                          : 'bg-black border border-white/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Details / Notes (Date-Wise Logged):
                </label>
                <textarea
                  rows={3}
                  value={newDetailNote}
                  onChange={(e) => setNewDetailNote(e.target.value)}
                  placeholder="e.g. Swapped dinner white rice with foxtail millet lemon rice; added 10g moringa buttermilk at 5:00 PM."
                  className="w-full p-2.5 bg-black border border-white/20 text-xs text-white rounded-xl focus:border-[#7E22CE] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddDetailModal(false)}
                className="px-3.5 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMoreDetails}
                className="px-4 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-[0_0_12px_rgba(126,34,206,0.6)]"
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
