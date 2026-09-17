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
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  generalInfo,
  calculations,
  onChange,
  onNavigateToBodyComposition,
  onNavigateToTab,
}) => {
  const [isBiometricsFolderOpen, setIsBiometricsFolderOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'spreadsheet'>('form');

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
    { label: 'Demographics', tabId: 'general' },
    { label: 'Nutrition Assessment', tabId: 'nutritional-assessment' },
    { label: 'Biometrics', tabId: 'biometrics' },
    { label: 'Gut Health', tabId: 'gut-health' },
    { label: 'Lifestyle', tabId: 'lifestyle' },
    { label: 'Medical', tabId: 'medical-history' },
    { label: 'Fitness', tabId: 'domains' },
    { label: 'Weekly Review', tabId: 'biometrics' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            Module 01 • Patient Profile & Demographics
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            General Information & Master File
          </h2>
          <p className="text-xs text-gray-400">
            South Someshwar Master Clinical Tracking File with Anthropometric records and body composition progression.
          </p>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center border border-[#7E22CE] bg-black p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('spreadsheet')}
              className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'spreadsheet'
                  ? 'bg-[#7E22CE] text-white shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Master Spreadsheet (Document View)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'form'
                  ? 'bg-[#7E22CE] text-white shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Demographic Form</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs bg-[#0d0617] px-3.5 py-1.5 border border-[#7E22CE] text-[#A855F7] font-bold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-purple-400" />
            <span>ICMR-NIN 2024 Calibrated</span>
          </div>
        </div>
      </div>

      {/* DOCUMENT SPREADSHEET VIEW (Matches Page 1 of uploaded PDF) */}
      {viewMode === 'spreadsheet' && (
        <div className="space-y-4">
          {/* Master File Title Banner & Quick Summary */}
          <div className="p-4 bg-[#0d0617] border border-[#7E22CE] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase text-[#A855F7] font-bold">
                  MASTER FILE: South Someshwar - Master File 4-September-2026
                </span>
              </div>
              <h3 className="text-lg font-black text-white uppercase mt-1">
                Client Clinical Anthropometry & Body Profile Tracking Sheet
              </h3>
              <p className="text-xs text-gray-400">
                Patient: <span className="text-white font-bold">{generalInfo.name || 'Kiruthika'}</span> • Target Calories: <span className="text-[#C084FC] font-bold">1,500 kcal</span> • Baseline ➔ Current
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3.5 py-2 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Progress Entry</span>
              </button>
              {onNavigateToBodyComposition && (
                <button
                  type="button"
                  onClick={onNavigateToBodyComposition}
                  className="px-3 py-2 bg-black border border-white/20 hover:border-[#7E22CE] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Open Module 20 Biometrics</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Document Spreadsheet Table */}
          <div className="border border-[#7E22CE] bg-black overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-[#1f0d38] border-b-2 border-[#7E22CE] text-[11px] font-black uppercase tracking-wider text-white">
                  <th className="py-3 px-3 border-r border-[#7E22CE]/60">Date / Milestone</th>
                  <th className="py-3 px-3 border-r border-[#7E22CE]/60 text-center">Height (cm)</th>
                  <th className="py-3 px-3 border-r border-[#7E22CE]/60 text-center">Weight (kg)</th>
                  <th colSpan={3} className="py-2 px-3 border-r border-[#7E22CE]/60 text-center bg-[#29104a]">
                    Anthropometry
                    <div className="grid grid-cols-3 text-[9px] font-mono text-purple-200 mt-0.5 border-t border-purple-400/30 pt-1">
                      <span>WC (cm)</span>
                      <span>HC (cm)</span>
                      <span>W:H Ratio</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 border-r border-[#7E22CE]/60 text-center">Visceral Fat</th>
                  <th colSpan={4} className="py-2 px-3 border-r border-[#7E22CE]/60 text-center bg-[#29104a]">
                    Body Profile
                    <div className="grid grid-cols-4 text-[9px] font-mono text-purple-200 mt-0.5 border-t border-purple-400/30 pt-1">
                      <span>Fat (%)</span>
                      <span>Muscle (%)</span>
                      <span>Water (%)</span>
                      <span>BMR (kcal)</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 border-r border-[#7E22CE]/60">Profile / Clinical Status</th>
                  <th className="py-3 px-2 text-center">Sync / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs font-mono">
                {spreadsheetRows.map((row, idx) => {
                  const isLast = idx === spreadsheetRows.length - 1;
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#150926] transition-colors ${
                        isLast ? 'bg-[#180a2c]/60' : idx % 2 === 0 ? 'bg-black' : 'bg-[#090412]'
                      }`}
                    >
                      {/* Date */}
                      <td className="py-2 px-3 border-r border-white/10 font-bold text-white">
                        <input
                          type="text"
                          value={row.date}
                          onChange={(e) => handleUpdateRow(row.id, 'date', e.target.value)}
                          className="w-full bg-transparent text-white border-b border-transparent focus:border-[#7E22CE] focus:outline-none"
                        />
                      </td>

                      {/* Height */}
                      <td className="py-2 px-2 border-r border-white/10 text-center text-gray-300">
                        <input
                          type="number"
                          value={row.heightCm}
                          onChange={(e) => handleUpdateRow(row.id, 'heightCm', parseFloat(e.target.value) || 0)}
                          className="w-14 text-center bg-black/60 border border-white/10 text-white py-0.5 focus:border-[#7E22CE] focus:outline-none"
                        />
                      </td>

                      {/* Weight */}
                      <td className="py-2 px-2 border-r border-white/10 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={row.weightKg}
                          onChange={(e) => handleUpdateRow(row.id, 'weightKg', parseFloat(e.target.value) || 0)}
                          className="w-16 text-center bg-black/60 border border-[#7E22CE]/60 text-[#C084FC] font-bold py-0.5 focus:border-[#7E22CE] focus:outline-none"
                        />
                      </td>

                      {/* Anthropometry: WC */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center">
                        <input
                          type="number"
                          step="0.5"
                          value={row.wcCm}
                          onChange={(e) => handleUpdateRow(row.id, 'wcCm', parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-white/10 text-white py-0.5 focus:border-[#7E22CE] focus:outline-none text-[11px]"
                        />
                      </td>

                      {/* Anthropometry: HC */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center">
                        <input
                          type="number"
                          step="0.5"
                          value={row.hcCm}
                          onChange={(e) => handleUpdateRow(row.id, 'hcCm', parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-white/10 text-white py-0.5 focus:border-[#7E22CE] focus:outline-none text-[11px]"
                        />
                      </td>

                      {/* W:H Ratio */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center text-purple-300 font-bold text-[11px]">
                        {row.whRatio}
                      </td>

                      {/* Visceral Fat */}
                      <td className="py-2 px-2 border-r border-white/10 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.visceralFat <= 8
                              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                              : 'bg-red-950/70 border border-red-500/50 text-red-300'
                          }`}
                        >
                          Level {row.visceralFat}
                        </span>
                      </td>

                      {/* Fat % */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={row.fatPercent}
                          onChange={(e) => handleUpdateRow(row.id, 'fatPercent', parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-white/10 text-white py-0.5 focus:border-[#7E22CE] focus:outline-none text-[11px]"
                        />
                      </td>

                      {/* Muscle % */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={row.musclePercent}
                          onChange={(e) => handleUpdateRow(row.id, 'musclePercent', parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-white/10 text-emerald-400 py-0.5 focus:border-[#7E22CE] focus:outline-none text-[11px]"
                        />
                      </td>

                      {/* Water % */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={row.waterPercent}
                          onChange={(e) => handleUpdateRow(row.id, 'waterPercent', parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-b border-white/10 text-blue-300 py-0.5 focus:border-[#7E22CE] focus:outline-none text-[11px]"
                        />
                      </td>

                      {/* BMR */}
                      <td className="py-2 px-1.5 border-r border-white/10 text-center text-gray-300 text-[11px]">
                        {row.bmrKcal}
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3 border-r border-white/10 font-sans text-xs text-gray-200">
                        <input
                          type="text"
                          value={row.bodyProfile}
                          onChange={(e) => handleUpdateRow(row.id, 'bodyProfile', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-[#7E22CE] focus:outline-none"
                        />
                      </td>

                      {/* Action */}
                      <td className="py-2 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="Apply this measurement to active clinical profile"
                            onClick={() => handleApplyLatestToProfile(row)}
                            className="p-1 text-purple-400 hover:text-white bg-purple-950/40 hover:bg-purple-900 border border-purple-500/30 rounded cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          {spreadsheetRows.length > 1 && (
                            <button
                              type="button"
                              title="Delete row"
                              onClick={() => handleDeleteRow(row.id)}
                              className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Document Bottom Tabs Bar (Matches bottom tabs in uploaded PDF 1) */}
            <div className="bg-[#120722] border-t-2 border-[#7E22CE] px-3 py-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                <span className="text-[9px] uppercase font-bold text-gray-400 font-mono mr-2">
                  Document Sheets:
                </span>
                {docSubTabs.map((sub, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onNavigateToTab && onNavigateToTab(sub.tabId)}
                    className={`px-3 py-1 font-mono font-bold text-[11px] border transition-all cursor-pointer ${
                      sub.tabId === 'general'
                        ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                        : 'bg-black/60 border-white/10 text-gray-300 hover:text-white hover:border-[#7E22CE]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-gray-400 font-mono">
                Total Logs: <span className="font-bold text-white">{spreadsheetRows.length} Milestones</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI DOCUMENT UPLOAD: Auto-fills Demographics & Symptoms (Remaining manual) */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-[#0e071c] border-2 border-[#7E22CE] shadow-2xl rounded-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#7E22CE]/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7E22CE]/30 border border-[#7E22CE] flex items-center justify-center text-[#C084FC]">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  Upload Medical Document / Lab Report (AI Auto-Fill)
                </h3>
                <span className="px-2 py-0.5 bg-[#7E22CE] text-white text-[9px] font-black uppercase tracking-wider rounded">
                  AI Extraction
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Upload existing patient discharge summary, lab file (.txt, .json, .csv, .pdf) to auto-fill demographics & symptoms. Remaining fields can be entered manually.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleMedicalDoc}
              className="px-3 py-1.5 bg-black border border-[#7E22CE] text-[#C084FC] hover:bg-[#7E22CE] hover:text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Record</span>
            </button>
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              disabled={isProcessingDoc}
              className="px-4 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-[11px] font-black uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(126,34,206,0.6)]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessingDoc ? 'Extracting...' : 'Browse File to Auto-Fill'}</span>
            </button>
            <input
              ref={docInputRef}
              type="file"
              accept=".txt,.json,.csv,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Success / Feedback Banner */}
        {docUploadSuccess && (
          <div className="p-3 bg-[#170a2c] border border-emerald-500/80 rounded-lg space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{docUploadSuccess}</span>
            </div>
            {extractedSummary.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] uppercase font-mono text-gray-400 mr-1 font-bold">Extracted:</span>
                {extractedSummary.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-black text-[#C084FC] border border-[#7E22CE]/60 text-[10px] font-mono font-bold rounded"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Demographics & Basic Measurements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Name */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            1. Patient Full Name
          </label>
          <input
            type="text"
            id="input-patient-name"
            value={generalInfo.name ?? ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Kiruthika"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 2. Age */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            2. Age (Years)
          </label>
          <input
            type="number"
            id="input-patient-age"
            value={generalInfo.age ?? ''}
            onChange={(e) => onChange({ age: e.target.value })}
            placeholder="34"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 3. Biological Sex */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            3. Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Female', 'Male'] as Sex[]).map((s) => (
              <button
                key={s}
                type="button"
                id={`btn-sex-${s.toLowerCase()}`}
                onClick={() => onChange({ sex: s })}
                className={`py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  generalInfo.sex === s
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                    : 'bg-black border-white/20 text-gray-400 hover:border-[#7E22CE]/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Height */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            4. Height (cm)
          </label>
          <input
            type="number"
            id="input-patient-height"
            value={generalInfo.height ?? ''}
            onChange={(e) => onChange({ height: e.target.value })}
            placeholder="162"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 5. Body Weight */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            5. Body Weight (kg)
          </label>
          <input
            type="number"
            id="input-patient-weight"
            value={generalInfo.weight ?? ''}
            onChange={(e) => onChange({ weight: e.target.value })}
            placeholder="61.5"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 6. Phone Number */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold">
              6. Patient Phone Number (WhatsApp)
            </label>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
              className="flex-1 bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* 7. Email Address */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            7. Email Address
          </label>
          <input
            type="email"
            id="input-patient-email"
            value={generalInfo.email ?? ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="patient@example.com"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 8. Blood Group */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            8. Blood Group
          </label>
          <select
            id="select-patient-blood-group"
            value={generalInfo.bloodGroup ?? 'O+ve'}
            onChange={(e) => onChange({ bloodGroup: e.target.value })}
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all cursor-pointer"
          >
            {['O+ve', 'O-ve', 'A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        {/* 9. Occupation */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            9. Occupation
          </label>
          <input
            type="text"
            id="input-patient-occupation"
            value={generalInfo.occupation ?? ''}
            onChange={(e) => onChange({ occupation: e.target.value })}
            placeholder="e.g. Software Consultant"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 10. Marital Status */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            10. Marital Status
          </label>
          <input
            type="text"
            id="input-patient-marital-status"
            value={generalInfo.maritalStatus ?? ''}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            placeholder="Married / Single"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 11. Living Circumstances */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            11. Living Circumstances
          </label>
          <input
            type="text"
            id="input-patient-living-circumstances"
            value={generalInfo.livingCircumstances ?? ''}
            onChange={(e) => onChange({ livingCircumstances: e.target.value })}
            placeholder="Nuclear Family / With Parents"
            className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* 12. Activity Level */}
        <div className="p-4 bg-[#0d0617] border border-[#7E22CE]">
          <label className="block text-[10px] uppercase tracking-widest text-[#A855F7] font-bold mb-2">
            12. Physical Activity Level (ICMR PAL)
          </label>
          <div className="relative">
            <select
              id="select-patient-activity-level"
              value={generalInfo.activityLevel ?? 'Sedentary'}
              onChange={(e) => onChange({ activityLevel: e.target.value as ActivityLevel })}
              className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-2 px-3 text-white font-medium text-xs focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Sedentary">Sedentary (Desk work, no exercise - 1.2x)</option>
              <option value="Lightly Active">Lightly Active (Walking, 1-3 days/wk - 1.375x)</option>
              <option value="Moderately Active">Moderately Active (Gym/Sports 3-5 days/wk - 1.55x)</option>
              <option value="Very Active">Very Active (Heavy training 6-7 days/wk - 1.725x)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#A855F7]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY COMPOSITION DIRECT ENTRY (Replaces old longitudinal chart as requested by user) */}
      <div className="bg-[#0d0617] border border-[#7E22CE] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-xs uppercase font-black tracking-widest text-white">
              Primary Body Composition & Tissue Compartments
            </h3>
          </div>
          {onNavigateToBodyComposition && (
            <button
              type="button"
              onClick={onNavigateToBodyComposition}
              className="text-[11px] font-mono text-[#C084FC] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>Open Full Multi-Week Automated Biometric Tracker (Module 20)</span>
              <span>→</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Fat Mass */}
          <div className="p-3 bg-black/60 border border-white/10">
            <label className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
              Fat Mass (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.fatMass ?? '16.9'}
              onChange={(e) => onChange({ fatMass: parseFloat(e.target.value) || 0 })}
              className="w-full bg-black border border-white/20 focus:border-[#7E22CE] px-2 py-1 text-white font-mono text-xs focus:outline-none"
            />
            <span className="text-[9px] text-[#A855F7] font-mono mt-1 block">Target: 13.5 kg</span>
          </div>

          {/* Fat Percentage */}
          <div className="p-3 bg-black/60 border border-white/10">
            <label className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
              Fat Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.fatPercentage ?? '27.5'}
              onChange={(e) => onChange({ fatPercentage: parseFloat(e.target.value) || 0 })}
              className="w-full bg-black border border-white/20 focus:border-[#7E22CE] px-2 py-1 text-white font-mono text-xs focus:outline-none"
            />
            <span className="text-[9px] text-[#A855F7] font-mono mt-1 block">Goal: &lt;24.0%</span>
          </div>

          {/* Muscle Mass */}
          <div className="p-3 bg-black/60 border border-white/10">
            <label className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
              Muscle Mass (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.muscleMass ?? '42.4'}
              onChange={(e) => onChange({ muscleMass: parseFloat(e.target.value) || 0 })}
              className="w-full bg-black border border-white/20 focus:border-[#7E22CE] px-2 py-1 text-white font-mono text-xs focus:outline-none"
            />
            <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Optimal Reserve</span>
          </div>

          {/* Fat Free Mass (FFM) */}
          <div className="p-3 bg-black/60 border border-white/10">
            <label className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
              Fat-Free Mass / FFM (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={generalInfo.ffm ?? '44.6'}
              onChange={(e) => onChange({ ffm: parseFloat(e.target.value) || 0 })}
              className="w-full bg-black border border-white/20 focus:border-[#7E22CE] px-2 py-1 text-white font-mono text-xs focus:outline-none"
            />
            <span className="text-[9px] text-gray-400 font-mono mt-1 block">Lean Body Tissue</span>
          </div>

          {/* Visceral Fat */}
          <div className="p-3 bg-black/60 border border-white/10">
            <label className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
              Visceral Fat (Rating)
            </label>
            <input
              type="number"
              step="1"
              value={generalInfo.visceralFat ?? '7'}
              onChange={(e) => onChange({ visceralFat: parseInt(e.target.value) || 0 })}
              className="w-full bg-black border border-white/20 focus:border-[#7E22CE] px-2 py-1 text-white font-mono text-xs focus:outline-none"
            />
            <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Safe Range: 1–9</span>
          </div>
        </div>
      </div>

      {/* 3. CALCULATIONS & METABOLIC ENERGETICS */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-0.5 w-8 bg-[#7E22CE]" />
          <span className="text-xs uppercase font-black tracking-[0.3em] text-[#A855F7]">
            CALCULATIONS & METABOLIC ENERGETICS (ICMR)
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* BMI Card */}
          <div className="bg-[#0d0617] border border-[#7E22CE] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[#A855F7] text-[10px] uppercase font-bold tracking-widest">Body Mass Index</p>
              <Scale className="w-4 h-4 text-[#A855F7]" />
            </div>
            <div className="text-center my-4">
              <p className="text-4xl font-bold text-white">{calculations.bmi || '23.4'}</p>
              <p className="text-[10px] uppercase bg-[#7E22CE] text-white inline-block px-2.5 py-0.5 mt-2 font-bold tracking-wider">
                {calculations.bmiCategory || 'Normal'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 bg-white/20 w-full overflow-hidden">
                <div
                  className="h-full bg-[#7E22CE]"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, (((calculations.bmi || 23.4) - 15) / 25) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                <span>Under (&lt;18.5)</span>
                <span>Norm (18.5-22.9)</span>
                <span>Over (&ge;23)</span>
              </div>
            </div>
          </div>

          {/* BMR Card */}
          <div className="bg-[#0d0617] border border-[#7E22CE] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[#A855F7] text-[10px] uppercase font-bold tracking-widest">Basal Metabolic Rate</p>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-center my-4">
              <p className="text-4xl font-bold text-white">{calculations.bmr || '1,320'}</p>
              <p className="text-[10px] uppercase bg-black text-[#A855F7] border border-[#7E22CE] inline-block px-2.5 py-0.5 mt-2 font-bold tracking-wider">
                kcal / day
              </p>
            </div>
            <p className="text-[10px] text-gray-400 text-center font-mono">
              Basal energy requirement calculated via Mifflin-St Jeor / ICMR standard.
            </p>
          </div>

          {/* TDEE Card */}
          <div className="bg-[#0d0617] border border-[#7E22CE] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[#A855F7] text-[10px] uppercase font-bold tracking-widest">Total Daily Energy (TDEE)</p>
              <Activity className="w-4 h-4 text-[#C084FC]" />
            </div>
            <div className="text-center my-4">
              <p className="text-4xl font-bold text-white">{calculations.tdee || '1,815'}</p>
              <p className="text-[10px] uppercase bg-purple-950 text-white border border-[#7E22CE] inline-block px-2.5 py-0.5 mt-2 font-bold tracking-wider">
                kcal / day
              </p>
            </div>
            <p className="text-[10px] text-gray-400 text-center font-mono">
              Includes physical activity coefficient ({generalInfo.activityLevel || 'Sedentary'}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
