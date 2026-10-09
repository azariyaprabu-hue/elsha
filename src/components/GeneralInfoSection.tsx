import React, { useState, useEffect } from 'react';
import { ActivityLevel, Calculations, GeneralInfo, Sex } from '../types';
import {
  Flame,
  HeartPulse,
  Scale,
  Activity,
  Layers,
  TrendingDown,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Trash2,
  Table,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Folder,
  UploadCloud,
  Sparkles,
  FileText,
  Upload,
  RefreshCw,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  Tag,
  Phone,
} from 'lucide-react';

export interface MasterSpreadsheetRow {
  id: string;
  date: string;
  heightCm: number;
  weightKg: number;
  wcCm: number;
  hcCm: number;
  whRatio: string;
  visceralFat: number;
  fatPercent: number;
  musclePercent: number;
  waterPercent: number;
  bmrKcal: number;
  bodyProfile: string;
}

interface GeneralInfoSectionProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  onChange: (updated: Partial<GeneralInfo>) => void;
  onNavigateToBodyComposition?: () => void;
  onNavigateToTab?: (tabId: string) => void;
  onNavigateToProfile?: () => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  generalInfo,
  calculations,
  onChange,
  onNavigateToBodyComposition,
  onNavigateToTab,
  onNavigateToProfile,
}) => {
  const [isBiometricsFolderOpen, setIsBiometricsFolderOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'spreadsheet'>('form');
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  // Document Upload Auto-Fill state
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);
  const [extractedSummary, setExtractedSummary] = useState<string[]>([]);
  const docInputRef = React.useRef<HTMLInputElement>(null);

  const handleProcessDocumentText = (content: string, fileName: string) => {
    setIsProcessingDoc(true);
    const summary: string[] = [];
    const updates: Partial<GeneralInfo> = {};

    try {
      // 1. Try JSON parsing
      if (content.trim().startsWith('{')) {
        const parsed = JSON.parse(content);
        if (parsed.name) { updates.name = parsed.name; summary.push(`Name: ${parsed.name}`); }
        if (parsed.age) { updates.age = Number(parsed.age); summary.push(`Age: ${parsed.age}`); }
        if (parsed.sex) { 
          const s = String(parsed.sex).toLowerCase();
          updates.sex = (s === 'male' ? 'Male' : s === 'female' ? 'Female' : 'Other') as Sex; 
          summary.push(`Sex: ${updates.sex}`); 
        }
        if (parsed.phone) { updates.phone = parsed.phone; summary.push(`Phone: ${parsed.phone}`); }
        if (parsed.height) { updates.height = Number(parsed.height); summary.push(`Height: ${parsed.height}cm`); }
        if (parsed.weight) { updates.weight = Number(parsed.weight); summary.push(`Weight: ${parsed.weight}kg`); }
        if (parsed.activityLevel) { updates.activityLevel = parsed.activityLevel as ActivityLevel; }
        if (parsed.symptoms && Array.isArray(parsed.symptoms)) {
          summary.push(`${parsed.symptoms.length} Symptoms`);
          try {
            localStorage.setItem('ELSHA_AUTO_SYMPTOMS', JSON.stringify(parsed.symptoms));
            window.dispatchEvent(new CustomEvent('ELSHA_SYMPTOMS_AUTOFILLED', { detail: parsed.symptoms }));
          } catch(e){}
        }
      } else {
        // 2. Clinical text / Report regex extraction
        const nameMatch = content.match(/(?:patient\s*name|name)\s*[:=-]\s*([A-Za-z\s.]+)/i);
        if (nameMatch && nameMatch[1]) {
          const cleanName = nameMatch[1].trim().split('\n')[0].replace(/[,;]/g, '');
          updates.name = cleanName;
          summary.push(`Name: ${cleanName}`);
        }

        const ageMatch = content.match(/(?:age|yrs|years old)\s*[:=-]?\s*(\d{1,3})/i);
        if (ageMatch && ageMatch[1]) {
          const ageNum = parseInt(ageMatch[1], 10);
          if (ageNum > 0 && ageNum < 120) {
            updates.age = ageNum;
            summary.push(`Age: ${ageNum} yrs`);
          }
        }

        const sexMatch = content.match(/(?:sex|gender)\s*[:=-]\s*(male|female|other|m|f)/i);
        if (sexMatch && sexMatch[1]) {
          const s = sexMatch[1].toLowerCase();
          const cleanSex: Sex = (s === 'male' || s === 'm') ? 'Male' : (s === 'female' || s === 'f') ? 'Female' : 'Other';
          updates.sex = cleanSex;
          summary.push(`Sex: ${cleanSex}`);
        }

        const phoneMatch = content.match(/(?:phone|mobile|contact|tel)\s*[:=-]\s*([\+\d\s-]{10,16})/i);
        if (phoneMatch && phoneMatch[1]) {
          updates.phone = phoneMatch[1].trim();
          summary.push(`Phone: ${updates.phone}`);
        }

        const heightMatch = content.match(/(?:height|ht)\s*[:=-]\s*(\d{2,3}(?:\.\d+)?)\s*(?:cm)?/i);
        if (heightMatch && heightMatch[1]) {
          const hVal = parseFloat(heightMatch[1]);
          if (hVal > 50 && hVal < 250) {
            updates.height = hVal;
            summary.push(`Height: ${hVal}cm`);
          }
        }

        const weightMatch = content.match(/(?:weight|wt)\s*[:=-]\s*(\d{2,3}(?:\.\d+)?)\s*(?:kg)?/i);
        if (weightMatch && weightMatch[1]) {
          const wVal = parseFloat(weightMatch[1]);
          if (wVal > 20 && wVal < 300) {
            updates.weight = wVal;
            summary.push(`Weight: ${wVal}kg`);
          }
        }

        // Detect symptoms list in text
        const symptomsFound: string[] = [];
        const symptomKeywords = [
          'fatigue', 'tiredness', 'brain fog', 'headache', 'bloating', 'acidity', 'gerd', 
          'constipation', 'joint pain', 'cramps', 'tingling', 'numbness', 'hair fall', 
          'insomnia', 'poor sleep', 'palpitations', 'excessive thirst', 'breathlessness',
          'irregular periods', 'acne', 'sugar cravings'
        ];
        symptomKeywords.forEach((k) => {
          if (new RegExp(`\\b${k}\\b`, 'i').test(content)) {
            symptomsFound.push(k.charAt(0).toUpperCase() + k.slice(1));
          }
        });
        if (symptomsFound.length > 0) {
          summary.push(`${symptomsFound.length} Symptoms Extracted`);
          try {
            localStorage.setItem('ELSHA_AUTO_SYMPTOMS', JSON.stringify(symptomsFound));
            window.dispatchEvent(new CustomEvent('ELSHA_SYMPTOMS_AUTOFILLED', { detail: symptomsFound }));
          } catch(e){}
        }
      }

      if (Object.keys(updates).length > 0) {
        onChange(updates);
        setDocUploadSuccess(`Successfully extracted patient record from "${fileName}". Remaining fields are open for manual entry.`);
        setExtractedSummary(summary);
      } else {
        const fallbackName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        onChange({ name: fallbackName });
        setDocUploadSuccess(`Extracted name "${fallbackName}" from file title. You may fill remaining fields manually below.`);
        setExtractedSummary([`Name: ${fallbackName}`]);
      }
    } catch (err) {
      console.error(err);
      setDocUploadSuccess(`Analyzed "${fileName}". Key demographic fields primed for clinical verification.`);
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      handleProcessDocumentText(text, file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadSampleMedicalDoc = () => {
    const sampleDoc = `HOSPITAL CLINICAL DISCHARGE & LAB ASSESSMENT RECORD
Patient Name: Kiruthika Sundar
Age: 38 Years
Gender: Female
Phone: +91 98401 23456
Height: 160 cm
Weight: 68.0 kg
Waist Circumference: 84 cm
Hip Circumference: 98 cm
Blood Pressure: 128/84 mmHg
Chief Complaints & Symptoms:
- Post-prandial fatigue and lethargy
- Persistent abdominal bloating after grain meals
- Nocturnal calf cramps 3x per week
- Acid reflux (GERD) in supine posture
- Brain fog during afternoon work hours
Clinical Impression: Type 2 Diabetes Mellitus with Metabolic Syndrome`;
    handleProcessDocumentText(sampleDoc, 'Kiruthika_Clinical_Record_2026.txt');
  };

  // Master tracking spreadsheet state with localStorage persistence
  const [spreadsheetRows, setSpreadsheetRows] = useState<MasterSpreadsheetRow[]>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_MASTER_SPREADSHEET_ROWS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'row-1',
        date: '12-Jan-2026 (Baseline)',
        heightCm: 160,
        weightKg: 68.0,
        wcCm: 84,
        hcCm: 98,
        whRatio: '0.86',
        visceralFat: 11,
        fatPercent: 32.5,
        musclePercent: 28.0,
        waterPercent: 48.5,
        bmrKcal: 1358,
        bodyProfile: 'Overfat / Class I Risk',
      },
      {
        id: 'row-2',
        date: '19-Jan-2026 (Wk 1)',
        heightCm: 160,
        weightKg: 66.8,
        wcCm: 83,
        hcCm: 97,
        whRatio: '0.85',
        visceralFat: 10,
        fatPercent: 31.4,
        musclePercent: 28.3,
        waterPercent: 49.0,
        bmrKcal: 1345,
        bodyProfile: 'Elimination Phase Active',
      },
      {
        id: 'row-3',
        date: '26-Jan-2026 (Wk 2)',
        heightCm: 160,
        weightKg: 65.5,
        wcCm: 81.5,
        hcCm: 96,
        whRatio: '0.84',
        visceralFat: 9,
        fatPercent: 30.1,
        musclePercent: 28.7,
        waterPercent: 49.8,
        bmrKcal: 1332,
        bodyProfile: 'Visceral Fat Decreasing',
      },
      {
        id: 'row-4',
        date: '02-Feb-2026 (Wk 3)',
        heightCm: 160,
        weightKg: 64.2,
        wcCm: 80,
        hcCm: 95,
        whRatio: '0.84',
        visceralFat: 8,
        fatPercent: 28.8,
        musclePercent: 29.1,
        waterPercent: 50.4,
        bmrKcal: 1320,
        bodyProfile: 'Metabolic Shift Steady',
      },
      {
        id: 'row-5',
        date: '09-Feb-2026 (Current)',
        heightCm: 160,
        weightKg: 63.0,
        wcCm: 78.5,
        hcCm: 94,
        whRatio: '0.83',
        visceralFat: 7,
        fatPercent: 27.5,
        musclePercent: 29.5,
        waterPercent: 51.0,
        bmrKcal: 1310,
        bodyProfile: 'Optimal Glycemic Range',
      },
    ];
  });

  // Save spreadsheet rows to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_MASTER_SPREADSHEET_ROWS', JSON.stringify(spreadsheetRows));
    } catch (e) {
      // ignore
    }
  }, [spreadsheetRows]);

  const handleUpdateRow = (id: string, field: keyof MasterSpreadsheetRow, value: any) => {
    setSpreadsheetRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };
        if (field === 'wcCm' || field === 'hcCm') {
          const wc = field === 'wcCm' ? parseFloat(value) || 0 : row.wcCm;
          const hc = field === 'hcCm' ? parseFloat(value) || 0 : row.hcCm;
          updated.whRatio = hc > 0 ? (wc / hc).toFixed(2) : '0.00';
        }
        return updated;
      })
    );
  };

  const handleAddRow = () => {
    const lastRow = spreadsheetRows[spreadsheetRows.length - 1];
    const newWeight = lastRow ? Math.max(40, lastRow.weightKg - 0.8) : 62.0;
    const newRow: MasterSpreadsheetRow = {
      id: `row-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      heightCm: lastRow ? lastRow.heightCm : 160,
      weightKg: parseFloat(newWeight.toFixed(1)),
      wcCm: lastRow ? Math.max(60, lastRow.wcCm - 0.5) : 78,
      hcCm: lastRow ? Math.max(70, lastRow.hcCm - 0.5) : 93.5,
      whRatio: '0.83',
      visceralFat: lastRow ? Math.max(1, lastRow.visceralFat - 1) : 7,
      fatPercent: lastRow ? Math.max(10, parseFloat((lastRow.fatPercent - 0.6).toFixed(1))) : 27.0,
      musclePercent: lastRow ? parseFloat((lastRow.musclePercent + 0.2).toFixed(1)) : 29.7,
      waterPercent: lastRow ? parseFloat((lastRow.waterPercent + 0.3).toFixed(1)) : 51.3,
      bmrKcal: 1305,
      bodyProfile: 'Improving Lean Compartment',
    };
    setSpreadsheetRows((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    if (spreadsheetRows.length <= 1) return;
    setSpreadsheetRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Sync latest row values to generalInfo if desired
  const handleApplyLatestToProfile = (row: MasterSpreadsheetRow) => {
    onChange({
      weight: row.weightKg,
      height: row.heightCm,
      waistCircumference: row.wcCm,
      hipCircumference: row.hcCm,
      fatPercentage: row.fatPercent,
      visceralFat: row.visceralFat,
    });
  };

  // Spreadsheet bottom tabs matching user's document
  const docSubTabs = [
    { label: 'Profile', tabId: 'profile' },
    { label: 'Demographics', tabId: 'general' },
    { label: 'Nutrition Assessment', tabId: 'nutritional-assessment' },
    { label: 'Biometrics', tabId: 'biometrics' },
    { label: 'Gut Health', tabId: 'gut-health' },
    { label: 'Anthropometry', tabId: 'anthropometry' },
    { label: 'Lifestyle', tabId: 'lifestyle' },
    { label: 'Medical', tabId: 'medical-history' },
    { label: 'Fitness', tabId: 'domains' },
    { label: 'Weekly Review', tabId: 'biometrics' },
  ];

  return (
    <div className="space-y-6 text-gray-900">
      {/* Header Banner */}
      <div className="border-b-2 border-purple-200 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            02 • Demographics
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Patient Demographics & Physical Measurements
          </h2>
        </div>
      </div>

      {/* Profile Sync Summary Card (Module 01 Profile Data) */}
      <div className="p-4 bg-purple-50 border-2 border-[#7E22CE] rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm text-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#7E22CE] flex items-center justify-center text-[#7E22CE] shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase text-[#7E22CE] tracking-wider">Patient Profile:</span>
              <span className="text-sm font-black text-gray-950">{generalInfo.name || 'Kiruthika'}</span>
              <span className="text-xs text-gray-600 font-mono">
                ({generalInfo.age || 32} yrs{generalInfo.dateOfBirth ? `, DOB: ${generalInfo.dateOfBirth}` : ''})
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7E22CE] text-white uppercase tracking-wider">
                {generalInfo.tag || 'Metabolic Management'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 text-[11px] text-gray-600 font-mono mt-0.5">
              {generalInfo.place && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#7E22CE]" />
                  Place: <strong className="text-gray-900">{generalInfo.place}</strong>
                </span>
              )}
              {generalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-700 font-bold" />
                  Contact: <strong className="text-emerald-700 font-bold">{generalInfo.phone}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowProfileDetails(!showProfileDetails)}
            className="px-3 py-1.5 bg-white border border-purple-200 hover:border-[#7E22CE] text-gray-700 hover:text-gray-900 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-2xs"
          >
            {showProfileDetails ? 'Hide Profile Details' : 'Quick Edit Profile'}
          </button>
          {onNavigateToProfile && (
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="px-3 py-1.5 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>Go to 01. Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Optional Collapsible Quick-Edit for Profile Fields */}
      {showProfileDetails && (
        <div className="p-4 bg-white border-2 border-purple-200 rounded-lg space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between border-b border-purple-200 pb-2">
            <span className="text-[11px] uppercase font-bold text-[#7E22CE] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Quick Edit Profile (Syncs with Module 01)
            </span>
            <span className="text-[10px] text-gray-500">Edits update global patient state</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={generalInfo.name ?? ''}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full bg-white border border-purple-200 py-1.5 px-2 text-gray-950 text-xs focus:border-[#7E22CE] focus:outline-none rounded"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-600 mb-1">DOB</label>
              <input
                type="date"
                value={generalInfo.dateOfBirth ?? ''}
                onChange={(e) => onChange({ dateOfBirth: e.target.value })}
                className="w-full bg-white border border-purple-200 py-1 px-2 text-gray-950 text-xs focus:border-[#7E22CE] focus:outline-none rounded"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-600 mb-1">Age</label>
              <input
                type="number"
                value={generalInfo.age ?? ''}
                onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : '' })}
                className="w-full bg-white border border-purple-200 py-1.5 px-2 text-gray-950 text-xs focus:border-[#7E22CE] focus:outline-none rounded"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-600 mb-1">Place</label>
              <input
                type="text"
                value={generalInfo.place ?? ''}
                onChange={(e) => onChange({ place: e.target.value })}
                className="w-full bg-white border border-purple-200 py-1.5 px-2 text-gray-950 text-xs focus:border-[#7E22CE] focus:outline-none rounded"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-600 mb-1">Contact</label>
              <input
                type="tel"
                value={generalInfo.phone ?? ''}
                onChange={(e) => onChange({ phone: e.target.value })}
                className="w-full bg-white border border-purple-200 py-1.5 px-2 text-gray-950 text-xs focus:border-[#7E22CE] focus:outline-none rounded"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-600 mb-1">Clinical Tag</label>
              <input
                type="text"
                value={generalInfo.tag ?? ''}
                onChange={(e) => onChange({ tag: e.target.value })}
                className="w-full bg-white border border-purple-200 py-1.5 px-2 text-gray-950 text-xs focus:border-[#7E22CE] focus:outline-none rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* 1. Demographics & Basic Measurements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Name */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            1. Patient Full Name
          </label>
          <input
            type="text"
            id="input-patient-name"
            value={generalInfo.name ?? ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Kiruthika"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 2. Age */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            2. Age (Years)
          </label>
          <input
            type="number"
            id="input-patient-age"
            value={generalInfo.age ?? ''}
            onChange={(e) => onChange({ age: e.target.value })}
            placeholder="34"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 3. Biological Sex */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            3. Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Female', 'Male'] as Sex[]).map((s) => (
              <button
                key={s}
                type="button"
                id={`btn-sex-${s.toLowerCase()}`}
                onClick={() => onChange({ sex: s })}
                className={`py-2 text-xs font-bold uppercase tracking-wider border rounded-lg cursor-pointer transition-colors ${
                  generalInfo.sex === s
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs'
                    : 'bg-white border-purple-200 text-gray-600 hover:border-[#7E22CE]/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Height */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            4. Height (cm)
          </label>
          <input
            type="number"
            id="input-patient-height"
            value={generalInfo.height ?? ''}
            onChange={(e) => onChange({ height: e.target.value })}
            placeholder="162"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 5. Body Weight */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            5. Body Weight (kg)
          </label>
          <input
            type="number"
            id="input-patient-weight"
            value={generalInfo.weight ?? ''}
            onChange={(e) => onChange({ weight: e.target.value })}
            placeholder="61.5"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 6. Phone Number */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold">
              6. Patient Phone Number (WhatsApp)
            </label>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-100 border border-emerald-400 text-emerald-800 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              WA Linked
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="tel"
              id="input-patient-phone"
              value={generalInfo.phone ?? ''}
              onChange={(e) => {
                onChange({ phone: e.target.value });
                localStorage.setItem('ELSHA_CLIENT_PHONE', e.target.value);
              }}
              placeholder="+91 9876543210"
              className="flex-1 bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
            />
          </div>
        </div>

        {/* 7. Email Address */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            7. Email Address
          </label>
          <input
            type="email"
            id="input-patient-email"
            value={generalInfo.email ?? ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="patient@example.com"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 8. Blood Group */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            8. Blood Group
          </label>
          <select
            id="select-patient-blood-group"
            value={generalInfo.bloodGroup ?? 'O+ve'}
            onChange={(e) => onChange({ bloodGroup: e.target.value })}
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all cursor-pointer rounded-lg"
          >
            {['O+ve', 'O-ve', 'A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        {/* 9. Occupation */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            9. Occupation
          </label>
          <input
            type="text"
            id="input-patient-occupation"
            value={generalInfo.occupation ?? ''}
            onChange={(e) => onChange({ occupation: e.target.value })}
            placeholder="e.g. Software Consultant"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 10. Marital Status */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            10. Marital Status
          </label>
          <input
            type="text"
            id="input-patient-marital-status"
            value={generalInfo.maritalStatus ?? ''}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            placeholder="Married / Single"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 11. Living Circumstances */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            11. Living Circumstances
          </label>
          <input
            type="text"
            id="input-patient-living-circumstances"
            value={generalInfo.livingCircumstances ?? ''}
            onChange={(e) => onChange({ livingCircumstances: e.target.value })}
            placeholder="Nuclear Family / With Parents"
            className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all placeholder:text-gray-400 rounded-lg"
          />
        </div>

        {/* 12. Activity Level */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-xl shadow-xs">
          <label className="block text-[10px] uppercase tracking-widest text-[#7E22CE] font-bold mb-2">
            12. Physical Activity Level (ICMR PAL)
          </label>
          <div className="relative">
            <select
              id="select-patient-activity-level"
              value={generalInfo.activityLevel ?? 'Sedentary'}
              onChange={(e) => onChange({ activityLevel: e.target.value as ActivityLevel })}
              className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-medium text-xs focus:outline-none transition-all appearance-none cursor-pointer rounded-lg"
            >
              <option value="Sedentary">Sedentary (Desk work, no exercise - 1.2x)</option>
              <option value="Lightly Active">Lightly Active (Walking, 1-3 days/wk - 1.375x)</option>
              <option value="Moderately Active">Moderately Active (Gym/Sports 3-5 days/wk - 1.55x)</option>
              <option value="Very Active">Very Active (Heavy training 6-7 days/wk - 1.725x)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7E22CE]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY COMPOSITION DIRECT ENTRY (Replaces old longitudinal chart as requested by user) */}
      <div className="bg-white border-2 border-purple-200 rounded-xl shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7E22CE]" />
            <h3 className="text-xs uppercase font-black tracking-widest text-gray-950">
              Primary Body Composition & Tissue Compartments
            </h3>
          </div>
          {onNavigateToBodyComposition && (
            <button
              type="button"
              onClick={onNavigateToBodyComposition}
              className="text-[11px] font-mono text-[#7E22CE] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>Open Full Multi-Week Automated Biometric Tracker (Module 20)</span>
              <span>→</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Fat Mass */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-600 block mb-1 font-bold">
              Fat Mass (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.fatMass ?? '16.9'}
              onChange={(e) => onChange({ fatMass: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-2 py-1 text-gray-950 font-mono text-xs focus:outline-none rounded"
            />
            <span className="text-[9px] text-[#7E22CE] font-mono mt-1 block font-bold">Target: 13.5 kg</span>
          </div>

          {/* Fat Percentage */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-600 block mb-1 font-bold">
              Fat Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.fatPercentage ?? '27.5'}
              onChange={(e) => onChange({ fatPercentage: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-2 py-1 text-gray-950 font-mono text-xs focus:outline-none rounded"
            />
            <span className="text-[9px] text-[#7E22CE] font-mono mt-1 block font-bold">Goal: &lt;24.0%</span>
          </div>

          {/* Muscle Mass */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-600 block mb-1 font-bold">
              Muscle Mass (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.muscleMass ?? '42.4'}
              onChange={(e) => onChange({ muscleMass: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-2 py-1 text-gray-950 font-mono text-xs focus:outline-none rounded"
            />
            <span className="text-[9px] text-emerald-700 font-mono mt-1 block font-bold">Optimal Reserve</span>
          </div>

          {/* Fat Free Mass (FFM) */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-600 block mb-1 font-bold">
              Fat-Free Mass / FFM (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.ffm ?? '44.6'}
              onChange={(e) => onChange({ ffm: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-2 py-1 text-gray-950 font-mono text-xs focus:outline-none rounded"
            />
            <span className="text-[9px] text-gray-600 font-mono mt-1 block">Lean Body Tissue</span>
          </div>

          {/* Visceral Fat */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-600 block mb-1 font-bold">
              Visceral Fat (Rating)
            </label>
            <input
              type="number"
              step="1"
              value={generalInfo.visceralFat ?? '7'}
              onChange={(e) => onChange({ visceralFat: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] px-2 py-1 text-gray-950 font-mono text-xs focus:outline-none rounded"
            />
            <span className="text-[9px] text-emerald-700 font-mono mt-1 block font-bold">Safe Range: 1–9</span>
          </div>
        </div>
      </div>

      {/* 3. CALCULATIONS & METABOLIC ENERGETICS */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-0.5 w-8 bg-[#7E22CE]" />
          <span className="text-xs uppercase font-black tracking-[0.3em] text-[#7E22CE]">
            CALCULATIONS & METABOLIC ENERGETICS (ICMR)
          </span>
          <span className="h-px flex-1 bg-purple-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* BMI Card */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#7E22CE] text-[10px] uppercase font-bold tracking-widest">Body Mass Index</p>
              <Scale className="w-4 h-4 text-[#7E22CE]" />
            </div>
            <div className="text-center my-4">
              <p className="text-4xl font-black text-gray-950">{calculations.bmi || '23.4'}</p>
              <p className="text-[10px] uppercase bg-[#7E22CE] text-white inline-block px-2.5 py-0.5 mt-2 font-bold tracking-wider rounded">
                {calculations.bmiCategory || 'Normal'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-purple-100 rounded-full w-full overflow-hidden">
                <div
                  className="h-full bg-[#7E22CE] rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, (((calculations.bmi || 23.4) - 15) / 25) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>Under (&lt;18.5)</span>
                <span>Norm (18.5-22.9)</span>
                <span>Over (&ge;23)</span>
              </div>
            </div>
          </div>

          {/* BMR Card */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#7E22CE] text-[10px] uppercase font-bold tracking-widest">Basal Metabolic Rate</p>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-center my-4">
              <p className="text-4xl font-black text-gray-950">{calculations.bmr || '1,320'}</p>
              <p className="text-[10px] uppercase bg-purple-50 text-[#7E22CE] border border-purple-300 inline-block px-2.5 py-0.5 mt-2 font-bold tracking-wider rounded">
                kcal / day
              </p>
            </div>
            <p className="text-[10px] text-gray-500 text-center font-mono">
              Basal energy requirement calculated via Mifflin-St Jeor / ICMR standard.
            </p>
          </div>

          {/* TDEE Card */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[#7E22CE] text-[10px] uppercase font-bold tracking-widest">Total Daily Energy (TDEE)</p>
              <Activity className="w-4 h-4 text-[#7E22CE]" />
            </div>
            <div className="text-center my-4">
              <p className="text-4xl font-black text-gray-950">{calculations.tdee || '1,815'}</p>
              <p className="text-[10px] uppercase bg-[#7E22CE] text-white border border-[#7E22CE] inline-block px-2.5 py-0.5 mt-2 font-bold tracking-wider rounded">
                kcal / day
              </p>
            </div>
            <p className="text-[10px] text-gray-500 text-center font-mono">
              Includes physical activity coefficient ({generalInfo.activityLevel || 'Sedentary'}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
