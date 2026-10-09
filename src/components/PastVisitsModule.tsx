import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Activity,
  FileText,
  Pill,
  Users,
  Stethoscope,
  Plus,
  ChevronRight,
  Download,
  Eye,
  Printer,
  Share2,
  FileCheck,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { PastVisitRecord, MedicalDocumentItem, PatientRecord } from '../types';
import { DocumentViewerModal } from './DocumentViewerModal';

interface PastVisitsModuleProps {
  currentPatientId: string;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  patientPhone?: string;
  patientEmail?: string;
  patientTag?: string;
  generalInfo?: any;
  onOpenPreview?: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const PastVisitsModule: React.FC<PastVisitsModuleProps> = ({
  currentPatientId,
  patientName,
  patientAge = 34,
  patientSex = 'Female',
  patientPhone = '+91 99011 74944',
  patientEmail = 'nikithavenu2008@gmail.com',
  patientTag = 'Hypothyroid, Diet, Exercise, Sleep',
  generalInfo,
  onOpenPreview,
  onNavigateToTab,
}) => {
  const [visits, setVisits] = useState<PastVisitRecord[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<MedicalDocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'prescription' | 'notes' | 'details' | 'summary'>('prescription');

  // Modal for Recording New Visit / Revisit
  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState<boolean>(false);
  const [newVisitDate, setNewVisitDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newVisitDoctor, setNewVisitDoctor] = useState<string>('Dr. Bharath Kumar R');
  const [newVisitType, setNewVisitType] = useState<string>('Revisit');
  const [newVisitTag, setNewVisitTag] = useState<string>('Clinical Follow-up & Re-assessment');
  const [newVisitSymptoms, setNewVisitSymptoms] = useState<string>('');
  const [newVisitHistory, setNewVisitHistory] = useState<string>('');
  const [newVisitMedication, setNewVisitMedication] = useState<string>('');
  const [newVisitFamilyHistory, setNewVisitFamilyHistory] = useState<string>('');
  const [newVisitDiagnostics, setNewVisitDiagnostics] = useState<string>('');
  const [newVisitNotes, setNewVisitNotes] = useState<string>('');
  const [isSubmittingVisit, setIsSubmittingVisit] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Document Viewer Modal
  const [activeViewerDoc, setActiveViewerDoc] = useState<MedicalDocumentItem | null>(null);

  useEffect(() => {
    fetchPatientVisitsAndDocs();
  }, [currentPatientId]);

  const fetchPatientVisitsAndDocs = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch visits
      const resV = await fetch(`/api/patients/${currentPatientId}/past-visits`);
      let loadedVisits: PastVisitRecord[] = [];
      if (resV.ok) {
        const vData = await resV.json();
        loadedVisits = vData.visits || [];
        setVisits(loadedVisits);
        if (loadedVisits.length > 0 && !selectedVisitId) {
          setSelectedVisitId(loadedVisits[0].id);
        }
      }

      // 2. Fetch documents
      const resD = await fetch(`/api/patients/${currentPatientId}/medical-records`);
      if (resD.ok) {
        const dData = await resD.json();
        const allDocs: MedicalDocumentItem[] = [];
        if (dData.dates) {
          Object.values(dData.dates).forEach((arr: any) => {
            if (Array.isArray(arr)) allDocs.push(...arr);
          });
        }
        setDocuments(allDocs);
      }

      // 3. Prepopulate new visit fields from current patient sections if available
      const resP = await fetch(`/api/patients/${currentPatientId}/preview`);
      if (resP.ok) {
        const pData = await resP.json();
        if (pData.sections) {
          setNewVisitSymptoms(pData.sections.symptoms || '');
          setNewVisitHistory(pData.sections.patient_history || '');
          setNewVisitMedication(pData.sections.medication || '');
          setNewVisitFamilyHistory(pData.sections.family_history || '');
          setNewVisitDiagnostics(pData.sections.diagnostics || '');
          setNewVisitNotes(pData.sections.notes || '');
        }
      }
    } catch (e) {
      console.error('Failed to load past visits:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVisit = async (visitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/patients/${currentPatientId}/past-visits/${visitId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotification('✓ Past Visit entry deleted successfully');
        if (selectedVisitId === visitId) {
          const remaining = visits.filter(v => v.id !== visitId);
          setSelectedVisitId(remaining.length > 0 ? remaining[0].id : null);
        }
        await fetchPatientVisitsAndDocs();
        setTimeout(() => setNotification(null), 3000);
      } else {
        console.warn('Failed to delete past visit from server');
      }
    } catch (err: any) {
      console.error('Error deleting past visit:', err);
    }
  };

  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || visits[0];

  // Documents attached to selected visit date or visit ID
  const visitDocuments = selectedVisit
    ? documents.filter(
        (d) => d.visit_id === selectedVisit.id || d.document_date === selectedVisit.visit_date
      )
    : [];

  const handleCreateNewVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVisit(true);
    try {
      const payload = {
        visit_date: newVisitDate,
        doctor_name: newVisitDoctor,
        visit_type: newVisitType,
        summary_tag: newVisitTag,
        symptoms: newVisitSymptoms,
        patient_history: newVisitHistory,
        medication: newVisitMedication,
        family_history: newVisitFamilyHistory,
        diagnostics: newVisitDiagnostics,
        notes: newVisitNotes,
      };

      const res = await fetch(`/api/patients/${currentPatientId}/past-visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setNotification(`✓ Created new Past Visit entry for ${result.visit.visit_display_date}. Previous visits preserved!`);
        setIsNewVisitModalOpen(false);
        await fetchPatientVisitsAndDocs();
        if (result.visit) setSelectedVisitId(result.visit.id);
        setTimeout(() => setNotification(null), 4500);
      } else {
        alert('Failed to record visit.');
      }
    } catch (err: any) {
      alert(`Error creating visit: ${err.message}`);
    } finally {
      setIsSubmittingVisit(false);
    }
  };

  // Group visits by Month & Year (e.g. September 2026, August 2026, July 2026)
  const monthGroups: Record<string, PastVisitRecord[]> = {};
  visits.forEach((v) => {
    try {
      const d = new Date(v.visit_date);
      const mName = !isNaN(d.getTime())
        ? `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`
        : 'Other Dates';
      if (!monthGroups[mName]) monthGroups[mName] = [];
      monthGroups[mName].push(v);
    } catch {
      if (!monthGroups['Other Dates']) monthGroups['Other Dates'] = [];
      monthGroups['Other Dates'].push(v);
    }
  });

  return (
    <div className="space-y-6">
      {/* Module Title Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-purple-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E22CE] bg-purple-100 px-2 py-0.5 rounded">
              PAST VISIT MODULE
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Patient: {patientName} ({currentPatientId})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight mt-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#7E22CE]" />
            Date-Wise Past Visits & Clinical Revisit Archive
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Visits stored separately by date. Click any date to open the complete report recorded for that specific visit. Prior visits are never overwritten.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewVisitModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Visit / Revisit</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Dual-Column Layout (Matching EKA/ZIATHLON Screenshot) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT COLUMN: SEE ALL PAST VISITS BY DATE */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 no-print">
          <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <span className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">
                SEE ALL PAST VISITS
              </span>
              <span className="text-[10px] font-mono text-[#7E22CE] font-bold bg-purple-50 px-2 py-0.5 rounded">
                {visits.length} Total Visits
              </span>
            </div>

            {/* List Grouped by Month */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-gray-500">Loading visits...</div>
              ) : Object.keys(monthGroups).length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">No past visits recorded yet.</div>
              ) : (
                Object.keys(monthGroups).map((monthKey) => {
                  const monthVisits = monthGroups[monthKey];
                  return (
                    <div key={monthKey} className="space-y-2">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500 px-1">
                        {monthKey}
                      </div>

                      <div className="space-y-1.5">
                        {monthVisits.map((v) => {
                          const isSelected = selectedVisit?.id === v.id;
                          const d = new Date(v.visit_date);
                          const dayNum = !isNaN(d.getTime()) ? d.getDate() : '--';
                          const dayShort = !isNaN(d.getTime())
                            ? d.toLocaleDateString('default', { weekday: 'short' })
                            : '';

                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVisitId(v.id)}
                              className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-md ring-2 ring-purple-300'
                                  : 'bg-white hover:bg-purple-50 text-gray-900 border-gray-200 hover:border-[#7E22CE]'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Calendar Date Badge */}
                                <div
                                  className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 font-mono leading-tight ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-purple-50 text-[#7E22CE] border border-purple-200'
                                  }`}
                                >
                                  <span className="text-xs font-black">{dayNum}</span>
                                  <span className="text-[9px] font-bold uppercase opacity-80">{dayShort}</span>
                                </div>

                                <div className="min-w-0">
                                  <span
                                    className={`text-xs font-black block truncate ${
                                      isSelected ? 'text-white' : 'text-gray-950 group-hover:text-[#7E22CE]'
                                    }`}
                                  >
                                    {v.visit_display_date}
                                  </span>
                                  <span
                                    className={`text-[10px] block truncate font-medium ${
                                      isSelected ? 'text-purple-100' : 'text-gray-500'
                                    }`}
                                  >
                                    {v.summary_tag || v.doctor_name}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteVisit(v.id, e)}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    isSelected
                                      ? 'bg-purple-900/40 text-purple-200 hover:text-white hover:bg-purple-900 border-purple-400/30'
                                      : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 border-red-200'
                                  }`}
                                  title="Delete this past visit record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <ChevronRight
                                  className={`w-4 h-4 transition-transform ${
                                    isSelected ? 'text-white translate-x-1' : 'text-gray-400 group-hover:text-[#7E22CE]'
                                  }`}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsNewVisitModalOpen(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#7E22CE] text-[#7E22CE] hover:bg-purple-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record Another Visit Date</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CLINICAL REPORT GENERATED FOR THIS PARTICULAR VISIT */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {selectedVisit ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Top Action Tabs (from reference image) */}
              <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 no-print">
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { id: 'prescription', label: 'Prescription' },
                    { id: 'notes', label: 'Notes' },
                    { id: 'details', label: 'Appointment Details' },
                    { id: 'summary', label: 'Assessment Summary' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#7E22CE] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#7E22CE]" />
                    <span>Print Report</span>
                  </button>

                  <a
                    href={`/patients/${currentPatientId}/clinical-preview`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open EMR View</span>
                  </a>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* THE CLINICAL REPORT (EXACT FROM REFERENCE IMAGE • NO VITALS)              */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg p-6 sm:p-10 relative overflow-hidden space-y-6">
                
                {/* 1. TOP PURPLE BANNER & ZIATHLON BRANDING */}
                <div className="flex items-start justify-between relative border-b-2 border-purple-200 pb-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E22CE] font-bold">
                      A ZIATHLON LLP VENTURE
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#0F172A] uppercase">
                      ŻIATHLON
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.25em] text-[#7E22CE] uppercase">
                      SPORTS MEDICINE CLINIC
                    </p>
                  </div>

                  {/* Top Right Date & Visit Type */}
                  <div className="text-right space-y-1">
                    <div className="text-sm font-black text-gray-900 font-mono">
                      {selectedVisit.visit_display_date}
                    </div>
                    <span className="inline-block text-[10px] px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 font-bold uppercase">
                      {selectedVisit.visit_type || 'Clinical Visit'}
                    </span>
                    <div className="text-[11px] text-gray-500 font-medium">
                      Physician: {selectedVisit.doctor_name}
                    </div>
                  </div>
                </div>

                {/* 2. PATIENT DEMOGRAPHICS HEADER */}
                <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 text-xs text-gray-900 space-y-1">
                  <div className="font-bold text-sm text-gray-950 flex flex-wrap items-center gap-2">
                    <span>{patientName}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700">{patientAge} year(s)</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700">{patientSex}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700 font-mono">{patientPhone}</span>
                  </div>
                  <div className="text-gray-600 font-medium">
                    Email: {patientEmail} &nbsp;•&nbsp; Patient ID: {currentPatientId}
                  </div>
                  {patientTag && (
                    <div className="text-[11px] font-semibold text-[#7E22CE]">
                      Tags / Focus: {patientTag}
                    </div>
                  )}
                </div>

                {/* ========================================================================= */}
                {/* 3. CLINICAL SECTIONS IN EXACT REQUIRED ORDER:                            */}
                {/* Name -> Symptoms -> Patient History -> Medication -> Family History -> Diagnostics */}
                {/* (VITALS ARE INTENTIONALLY EXCLUDED)                                     */}
                {/* ========================================================================= */}
                <div className="space-y-4 pt-1">
                  
                  {/* 1. SYMPTOMS */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center shrink-0">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                        Symptoms
                      </h4>
                    </div>
                    <div className="min-h-[46px] rounded-xl border border-purple-200 bg-white p-3 text-xs text-gray-800 leading-relaxed shadow-2xs font-sans">
                      {selectedVisit.symptoms || 'No symptoms recorded for this visit.'}
                    </div>
                  </div>

                  {/* 2. PATIENT HISTORY */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                        Patient History
                      </h4>
                    </div>
                    <div className="min-h-[46px] rounded-xl border border-purple-200 bg-white p-3 text-xs text-gray-800 leading-relaxed shadow-2xs">
                      {selectedVisit.patient_history || 'No patient history recorded for this visit.'}
                    </div>
                  </div>

                  {/* 3. MEDICATION */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center shrink-0">
                        <Pill className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                        Medication
                      </h4>
                    </div>
                    <div className="min-h-[46px] rounded-xl border border-purple-200 bg-white p-3 text-xs text-gray-800 leading-relaxed shadow-2xs">
                      {selectedVisit.medication || 'No medication recorded for this visit.'}
                    </div>
                  </div>

                  {/* 4. PARENT / FAMILY HISTORY */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                        Parent / Family History
                      </h4>
                    </div>
                    <div className="min-h-[46px] rounded-xl border border-purple-200 bg-white p-3 text-xs text-gray-800 leading-relaxed shadow-2xs">
                      {selectedVisit.family_history || 'No family history recorded for this visit.'}
                    </div>
                  </div>

                  {/* 5. DIAGNOSTICS / PAST HISTORY */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7E22CE] text-white flex items-center justify-center shrink-0">
                        <Stethoscope className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                        Diagnostics / Clinical Findings
                      </h4>
                    </div>
                    <div className="min-h-[46px] rounded-xl border border-purple-200 bg-white p-3 text-xs text-gray-800 leading-relaxed shadow-2xs">
                      {selectedVisit.diagnostics || 'No diagnostics recorded for this visit.'}
                    </div>
                  </div>

                  {/* Visit Clinical Notes */}
                  {selectedVisit.notes && (
                    <div className="space-y-1.5 pt-1">
                      <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Consultation Remarks & Plan
                      </h4>
                      <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-xs text-gray-800 italic">
                        {selectedVisit.notes}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. DOCUMENTS ASSOCIATED WITH THIS VISIT */}
                <div className="pt-4 border-t-2 border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#7E22CE]" />
                      Reports & Uploaded Documents ({visitDocuments.length})
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Date: {selectedVisit.visit_date}
                    </span>
                  </div>

                  {visitDocuments.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                      No document files attached specifically to this visit date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {visitDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setActiveViewerDoc(doc)}
                              className="text-xs font-black text-gray-900 hover:text-[#7E22CE] text-left truncate block hover:underline"
                            >
                              📄 {doc.file_name || doc.original_file_name}
                            </button>
                            <span className="text-[10px] text-gray-500 block truncate">
                              {doc.category} • {(doc.file_size / 1024).toFixed(1)} KB
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveViewerDoc(doc)}
                              className="p-1.5 rounded-lg border border-purple-300 text-[#7E22CE] hover:bg-purple-100 text-xs"
                              title="View Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`/api/medical-records/${doc.id}/download`}
                              download
                              className="p-1.5 rounded-lg bg-[#7E22CE] text-white hover:bg-[#6b1dae] text-xs"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-end gap-2 text-xs no-print">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-[#7E22CE] text-white font-bold hover:bg-[#6b1dae] flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500">
              Select a past visit from the left column to view its clinical report.
            </div>
          )}
        </div>
      </div>

      {/* RECORD NEW VISIT MODAL */}
      {isNewVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#7E22CE] w-full max-w-2xl my-8 overflow-hidden">
            <div className="px-6 py-4 bg-[#7E22CE] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">
                  Record New Visit / Revisit
                </h3>
                <p className="text-xs text-purple-100">
                  Saves a new date entry without overwriting previous visit records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewVisitModalOpen(false)}
                className="text-white hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewVisit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={newVisitDate}
                    onChange={(e) => setNewVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Doctor / Clinician *</label>
                  <input
                    type="text"
                    required
                    value={newVisitDoctor}
                    onChange={(e) => setNewVisitDoctor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Visit Type</label>
                  <select
                    value={newVisitType}
                    onChange={(e) => setNewVisitType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900 font-semibold"
                  >
                    <option value="Revisit">Revisit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Consultation">Initial Consultation</option>
                    <option value="Routine Review">Routine Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Summary / Tag</label>
                  <input
                    type="text"
                    value={newVisitTag}
                    onChange={(e) => setNewVisitTag(e.target.value)}
                    placeholder="e.g. Weight & thyroid symptom tracking"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  1. Symptoms recorded during this visit
                </label>
                <textarea
                  rows={2}
                  value={newVisitSymptoms}
                  onChange={(e) => setNewVisitSymptoms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  2. Patient History
                </label>
                <textarea
                  rows={2}
                  value={newVisitHistory}
                  onChange={(e) => setNewVisitHistory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  3. Medication prescribed
                </label>
                <textarea
                  rows={2}
                  value={newVisitMedication}
                  onChange={(e) => setNewVisitMedication(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  4. Family History
                </label>
                <textarea
                  rows={2}
                  value={newVisitFamilyHistory}
                  onChange={(e) => setNewVisitFamilyHistory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  5. Diagnostics / Clinical findings
                </label>
                <textarea
                  rows={2}
                  value={newVisitDiagnostics}
                  onChange={(e) => setNewVisitDiagnostics(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Doctor Notes & Consultation Remarks
                </label>
                <textarea
                  rows={2}
                  value={newVisitNotes}
                  onChange={(e) => setNewVisitNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#7E22CE] text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsNewVisitModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVisit}
                  className="px-6 py-2 rounded-lg bg-[#7E22CE] text-white hover:bg-[#6b1dae] font-black uppercase tracking-wider shadow"
                >
                  {isSubmittingVisit ? 'Saving...' : 'Save Past Visit Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {activeViewerDoc && (
        <DocumentViewerModal
          document={{
            id: activeViewerDoc.id,
            name: activeViewerDoc.file_name,
            fileUrl: `/api/medical-records/${activeViewerDoc.id}/view`,
            downloadUrl: `/api/medical-records/${activeViewerDoc.id}/download`,
            date: activeViewerDoc.document_date,
            type: activeViewerDoc.category,
            fileSize: typeof activeViewerDoc.file_size === 'number'
              ? `${(activeViewerDoc.file_size / (1024 * 1024)).toFixed(2)} MB`
              : String(activeViewerDoc.file_size || ''),
          }}
          onClose={() => setActiveViewerDoc(null)}
        />
      )}
    </div>
  );
};
