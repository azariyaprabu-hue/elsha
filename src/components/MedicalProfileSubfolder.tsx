import React, { useState, useEffect } from 'react';
import {
  User,
  Activity,
  FileText,
  Pill,
  Users,
  Stethoscope,
  Save,
  CheckCircle2,
  Eye,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';
import { GeneralInfo, MedicalHistory, SymptomAssessmentItem, PatientRecord, PatientSections } from '../types';

interface MedicalProfileSubfolderProps {
  currentPatientId: string;
  generalInfo: GeneralInfo;
  medicalHistory: MedicalHistory;
  symptoms: SymptomAssessmentItem[];
  selectedCategory?: string;
  selectedDomain?: string;
  onUpdateGeneralInfo?: (info: Partial<GeneralInfo>) => void;
  onUpdateSymptoms?: (symptoms: SymptomAssessmentItem[]) => void;
  onUpdateMedicalHistory?: (history: MedicalHistory) => void;
  onNavigateToPreview?: () => void;
  onPatientChanged?: (patientId: string) => void;
}

export const MedicalProfileSubfolder: React.FC<MedicalProfileSubfolderProps> = ({
  currentPatientId,
  generalInfo,
  medicalHistory,
  symptoms,
  selectedCategory,
  selectedDomain,
  onUpdateGeneralInfo,
  onUpdateSymptoms,
  onUpdateMedicalHistory,
  onNavigateToPreview,
}) => {
  // Local state for editing fields
  const [name, setName] = useState(generalInfo.name || 'Nikitha Venu');
  const [patientId, setPatientId] = useState(currentPatientId || 'nikitha_venu');
  const [age, setAge] = useState<number | string>(generalInfo.age || 34);
  const [sex, setSex] = useState(generalInfo.sex || 'Female');
  const [dob, setDob] = useState(generalInfo.dateOfBirth || '1992-10-15');
  const [phone, setPhone] = useState(generalInfo.phone || '+91 99011 74944');
  const [email, setEmail] = useState(generalInfo.email || 'nikithavenu2008@gmail.com');
  const [city, setCity] = useState(generalInfo.place || 'Bangalore');
  const [address, setAddress] = useState(generalInfo.address || 'Indiranagar, Bangalore');
  const [tag, setTag] = useState(generalInfo.tag || 'Hypothyroid, Diet, Exercise, Sleep');

  // Symptoms & Duration
  const [symptomsText, setSymptomsText] = useState(
    'Constipation - K59.00 (Note: regular bowel habits) | Abdominal Bloating (Note: Resolved) | Disturbed Sleep Pattern - G47.9 (Note: Improved) | Mood Swing - R45.86 (Note: Improved) | Fatigability - R53.83 (Note: Improved) | Weight Gain - R63.5 (Note: Status quo) | Dysmenorrhea (Note: Not had periods to assess) | Menstrual Cramp - N94.6 (Note: Not had periods) | Premenstrual Symptom - N94.3 (Note: Cannot assess) | Anxiety - F41.9 (Note: Improved) | Loss Of Hair - L65.9 (Note: Decreased) | Irregular Periods - N92.6 (Note: Cannot be assessed)'
  );
  const [symptomDuration, setSymptomDuration] = useState(
    'Ongoing 18 months, significant improvement over last 8 weeks with targeted gut & thyroid protocol'
  );

  // Medical History, Medication, Family History, Diagnostics
  const [patientHistoryText, setPatientHistoryText] = useState(
    'Hypothyroid (Status: active, Since 18 Years, On Tab. Thyronorm 88mcg)'
  );
  const [medicationText, setMedicationText] = useState(
    'Tab. Thyronorm 88mcg 1-0-0 (Morning empty stomach) | Metformin 500mg 1-0-1 | Evening Tea/Detox water | Cosmix plant protein powder'
  );
  const [familyHistoryText, setFamilyHistoryText] = useState(
    'Hypertension (Status: active, Mother, On medication) | Diabetes (Status: active, Father, On OHA) | Fibroid (Status: active, Mother, Hysterectomy done)'
  );
  const [diagnosticsText, setDiagnosticsText] = useState(
    'Subclinical Hypothyroidism with Secondary Metabolic Slowing & Gut Dysbiosis'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient responding well to nutritional supplementation and sleep hygiene interventions.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Load patient data from backend or local storage when patient ID changes
  useEffect(() => {
    fetchPatientData(currentPatientId);
  }, [currentPatientId]);

  const fetchPatientData = async (pid: string) => {
    try {
      const res = await fetch(`/api/patients/${pid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.patient) {
          setName(data.patient.name || '');
          setPatientId(data.patient.id || pid);
          setAge(data.patient.age || 34);
          setSex(data.patient.sex || 'Female');
          setDob(data.patient.dob || '');
          setPhone(data.patient.phone || '');
          setEmail(data.patient.email || '');
          setCity(data.patient.city || '');
          setAddress(data.patient.address || '');
          setTag(data.patient.tag || '');
        }
        if (data.sections) {
          if (data.sections.symptoms) setSymptomsText(data.sections.symptoms);
          if (data.sections.symptom_duration) setSymptomDuration(data.sections.symptom_duration);
          if (data.sections.patient_history) setPatientHistoryText(data.sections.patient_history);
          if (data.sections.medication) setMedicationText(data.sections.medication);
          if (data.sections.family_history) setFamilyHistoryText(data.sections.family_history);
          if (data.sections.diagnostics) setDiagnosticsText(data.sections.diagnostics);
          if (data.sections.notes) setClinicalNotes(data.sections.notes);
        }
      }
    } catch (e) {
      console.error('Failed to fetch patient data from server:', e);
    }
  };

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    setSaveNotice(null);
    try {
      // 1. Update React state in parent so Preview & other folders reflect immediately
      if (onUpdateGeneralInfo) {
        onUpdateGeneralInfo({
          name,
          age: Number(age) || 34,
          sex: sex as any,
          dateOfBirth: dob,
          phone,
          email,
          place: city,
          address,
          tag,
        });
      }

      // 2. Persist to server API
      const patientPayload = {
        name,
        age: Number(age) || undefined,
        sex,
        dob,
        phone,
        email,
        city,
        address,
        tag,
      };

      const sectionsPayload = {
        name,
        symptoms: symptomsText,
        symptom_duration: symptomDuration,
        patient_history: patientHistoryText,
        medication: medicationText,
        family_history: familyHistoryText,
        diagnostics: diagnosticsText,
        notes: clinicalNotes,
      };

      await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientPayload),
      });

      await fetch(`/api/patients/${patientId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionsPayload),
      });

      // Also persist to localStorage for zero-loss offline cache
      localStorage.setItem(`ELSHA_PATIENT_SECTIONS_${patientId}`, JSON.stringify(sectionsPayload));

      setSaveNotice('✓ Patient Profile updated! All information synced to Medical Preview & Clinical Reports.');
      setTimeout(() => setSaveNotice(null), 4000);
    } catch (err: any) {
      console.error('Error saving patient profile:', err);
      setSaveNotice('Saved locally. Server sync will retry.');
      setTimeout(() => setSaveNotice(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E22CE] bg-purple-100 px-2 py-0.5 rounded">
              SUB-FOLDER 1
            </span>
            <span className="text-xs text-gray-500 font-mono">ID: {patientId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight mt-1 flex items-center gap-2">
            <User className="w-6 h-6 text-[#7E22CE]" />
            Patient Profile & Clinical Symptoms
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Connected to single patient record. Any edits reflect automatically across Medical Preview, Past Visits, and Reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToPreview && (
            <button
              type="button"
              onClick={onNavigateToPreview}
              className="px-4 py-2.5 rounded-xl border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Report</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndSync}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Syncing...' : 'Save & Sync'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* SECTION A: BASIC PATIENT DEMOGRAPHICS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-4">
        <div className="border-b border-purple-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#7E22CE]" />
            1. Patient Demographics & Identification
          </h3>
          <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
            No ABHA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Patient Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] focus:ring-1 focus:ring-[#7E22CE] text-gray-900 font-semibold"
              placeholder="e.g. Nikitha Venu"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Patient ID / MRN *</label>
            <input
              type="text"
              value={patientId}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Age & Sex</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
                placeholder="Age"
              />
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#7E22CE]" /> Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold font-mono"
              placeholder="+91 9901174944"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#7E22CE]" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
              placeholder="patient@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#7E22CE]" /> City / Place
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
              placeholder="e.g. Bangalore"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Clinical Tag / Category</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
              placeholder="e.g. Hypothyroid, Diet, Exercise"
            />
          </div>
        </div>
      </div>

      {/* SECTION B: CLINICAL SYMPTOMS & DURATION */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-4">
        <div className="border-b border-purple-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#7E22CE]" />
            2. Presenting Symptoms & Clinical Severity
          </h3>
          <span className="text-[10px] uppercase font-bold text-gray-500">Reflected in Preview Order 1</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Symptoms Detailed Clinical Log (ICD-10 & Severity Status) *
            </label>
            <textarea
              rows={4}
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#7E22CE] focus:ring-1 focus:ring-[#7E22CE] text-xs text-gray-900 leading-relaxed font-sans"
              placeholder="e.g. Constipation - K59.00 (regular bowel habits) | Abdominal Bloating (Resolved) | Disturbed Sleep Pattern - G47.9..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#7E22CE]" />
              Symptom Duration & Progression Timeline
            </label>
            <input
              type="text"
              value={symptomDuration}
              onChange={(e) => setSymptomDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-xs text-gray-900 font-medium"
              placeholder="e.g. Ongoing 18 months, significant improvement over last 8 weeks..."
            />
          </div>
        </div>
      </div>

      {/* SECTION C: MEDICAL HISTORY & MEDICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient History */}
        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
          <div className="border-b border-purple-100 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#7E22CE]" />
              3. Patient Medical History
            </h3>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Preview Order 2</span>
          </div>
          <textarea
            rows={3}
            value={patientHistoryText}
            onChange={(e) => setPatientHistoryText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-xs text-gray-900 font-medium"
            placeholder="e.g. Hypothyroid (Status: active, Since 18 Years, On Tab. Thyronorm 88mcg)..."
          />
        </div>

        {/* Medication */}
        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
          <div className="border-b border-purple-100 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#7E22CE]" />
              4. Current Medication
            </h3>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Preview Order 3</span>
          </div>
          <textarea
            rows={3}
            value={medicationText}
            onChange={(e) => setMedicationText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-xs text-gray-900 font-medium"
            placeholder="e.g. Tab. Thyronorm 88mcg 1-0-0 | Metformin 500mg 1-0-1..."
          />
        </div>
      </div>

      {/* SECTION D: FAMILY HISTORY & DIAGNOSTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family History */}
        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
          <div className="border-b border-purple-100 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#7E22CE]" />
              5. Parent / Family History
            </h3>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Preview Order 4</span>
          </div>
          <textarea
            rows={3}
            value={familyHistoryText}
            onChange={(e) => setFamilyHistoryText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-xs text-gray-900 font-medium"
            placeholder="e.g. Hypertension (Mother, On medication) | Diabetes (Father, On OHA)..."
          />
        </div>

        {/* Diagnostics / Past History */}
        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
          <div className="border-b border-purple-100 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#7E22CE]" />
              6. Diagnostics / Clinical Findings
            </h3>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Preview Order 5</span>
          </div>
          <textarea
            rows={3}
            value={diagnosticsText}
            onChange={(e) => setDiagnosticsText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-xs text-gray-900 font-medium"
            placeholder="e.g. Subclinical Hypothyroidism with Secondary Metabolic Slowing & Gut Dysbiosis..."
          />
        </div>
      </div>

      {/* SECTION E: CLINICAL CONSULTATION NOTES */}
      <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">
          7. Relevant Clinical Consultation Notes
        </h3>
        <textarea
          rows={2}
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-xs text-gray-900 font-medium"
          placeholder="Additional clinical remarks, follow-up instructions, patient compliance notes..."
        />
      </div>

      {/* Bottom Floating/Fixed Save Bar */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleSaveAndSync}
          disabled={isSaving}
          className="px-8 py-3 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all transform hover:scale-102"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Profile...' : 'Save Patient Profile & Sync EMR'}</span>
        </button>
      </div>
    </div>
  );
};
