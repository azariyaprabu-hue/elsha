import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderPlus,
  Save,
  Download,
  Upload,
  Printer,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock,
  Sparkles,
  Trash2,
  Clock,
  ShieldCheck,
  FileCheck,
  Search,
  X,
  Edit3,
  ArrowLeft,
  ChevronRight,
  Activity,
  Pill,
  Utensils,
  Dumbbell,
  Eye,
} from 'lucide-react';
import { generateClientDossierPdf, downloadHtmlAsPdf } from '../../utils/pdfGenerator';
import { GeneralInfo } from '../../types';

export interface PatientVisitRecord {
  id: string;
  date: string;
  mnPrescription: {
    summary: string;
    medicines: Array<{ name: string; dosage: string; frequency: string; timing: string }>;
  };
  rxPrescription: {
    targetCalories: number;
    proteinGrams: number;
    dietTitle: string;
  };
  exercisePlan: {
    weeklyFocus: string;
    sessions: Array<{ day: string; focus: string; duration: string }>;
  };
  notes: string;
}

export interface ClientDossierFolder {
  id: string;
  clientCode: string;
  name: string;
  age: number;
  gender: string;
  createdDate: string;
  lastUpdated: string;
  primaryCondition: string;
  status: 'Active Consultation' | 'In Protocol' | 'Maintenance' | 'Archived';
  folderNotes: string;
  visits: PatientVisitRecord[];
}

const DEFAULT_FOLDERS: ClientDossierFolder[] = [
  {
    id: 'folder-1',
    clientCode: 'ZIA-2026-KIRU-01',
    name: 'Kiruthika',
    age: 38,
    gender: 'Female',
    createdDate: '12-Jan-2026',
    lastUpdated: '09-Sep-2026',
    primaryCondition: 'Type 2 Diabetes & Metabolic Syndrome',
    status: 'In Protocol',
    folderNotes: '3-Month Reversal Program. Targeting HbA1c reduction from 8.2% to <6.5%.',
    visits: [
      {
        id: 'visit-1',
        date: '2/8/2026',
        mnPrescription: {
          summary: 'Metformin 500mg BD, Vitamin D3 60000 IU weekly, Omega-3 1000mg.',
          medicines: [
            { name: 'Metformin Hydrochloride', dosage: '500mg', frequency: 'Twice daily', timing: 'Post meal' },
            { name: 'Cholecalciferol (Vitamin D3)', dosage: '60,000 IU', frequency: 'Weekly', timing: 'Morning' }
          ]
        },
        rxPrescription: { targetCalories: 1650, proteinGrams: 85, dietTitle: 'Diabetic Low-Glycemic Therapeutic Diet - Phase 1' },
        exercisePlan: { weeklyFocus: 'Zone 2 Cardio & Resistance', sessions: [{ day: 'Monday', focus: 'Brisk Treadmill Walk', duration: '45 mins' }] },
        notes: 'Baseline consultation and initial HbA1c evaluation.'
      },
      {
        id: 'visit-2',
        date: '9/9/2026',
        mnPrescription: {
          summary: 'Metformin 500mg BD, Berberine 500mg, Chromium Picolinate 200mcg.',
          medicines: [
            { name: 'Metformin Extended Release', dosage: '500mg', frequency: 'Twice daily', timing: 'With meals' },
            { name: 'Berberine Extract', dosage: '500mg', frequency: 'Twice daily', timing: 'Before meal' }
          ]
        },
        rxPrescription: { targetCalories: 1550, proteinGrams: 90, dietTitle: 'Advanced Glycemic Control & Insulin Sensitivity Diet' },
        exercisePlan: { weeklyFocus: 'HIIT & Strength Intervals', sessions: [{ day: 'Monday', focus: 'Upper Body Resistance & Core', duration: '50 mins' }] },
        notes: 'Follow-up visit. HbA1c improved to 7.1%. Adjusting micronutrient prescription.'
      }
    ]
  },
  {
    id: 'folder-2',
    clientCode: 'ZIA-2026-RAJU-02',
    name: 'Rajesh Kumar',
    age: 44,
    gender: 'Male',
    createdDate: '02-Feb-2026',
    lastUpdated: '01-Sep-2026',
    primaryCondition: 'Hypertension & Dyslipidemia',
    status: 'Active Consultation',
    folderNotes: 'Post-CABG cardiac rehabilitation diet.',
    visits: [
      {
        id: 'visit-raj-1',
        date: '7/8/2026',
        mnPrescription: {
          summary: 'Atorvastatin 20mg nocte, CoQ10 100mg, Aspirin 75mg.',
          medicines: [
            { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', timing: 'Bedtime' },
            { name: 'Coenzyme Q10', dosage: '100mg', frequency: 'Once daily', timing: 'Morning' }
          ]
        },
        rxPrescription: { targetCalories: 1800, proteinGrams: 95, dietTitle: 'Cardio-Protective Mediterranean Diet' },
        exercisePlan: { weeklyFocus: 'Low Impact Aerobic Conditioning', sessions: [{ day: 'Monday', focus: 'Stationary Cycling Zone 1-2', duration: '40 mins' }] },
        notes: 'Cardiac rehabilitation protocol initiation.'
      }
    ]
  },
  {
    id: 'folder-3',
    clientCode: 'ZIA-2026-ANAN-03',
    name: 'Ananya Sharma',
    age: 29,
    gender: 'Female',
    createdDate: '18-Feb-2026',
    lastUpdated: '28-Aug-2026',
    primaryCondition: 'PCOS & Insulin Resistance',
    status: 'In Protocol',
    folderNotes: '12-Day Elimination Protocol completed.',
    visits: [
      {
        id: 'visit-ana-1',
        date: '9/3/2027',
        mnPrescription: {
          summary: 'Myo-Inositol 2g, D-Chiro Inositol 50mg, Spearmint extract.',
          medicines: [
            { name: 'Myo-Inositol & D-Chiro Blend', dosage: '2.1g', frequency: 'Twice daily', timing: 'Empty stomach' }
          ]
        },
        rxPrescription: { targetCalories: 1500, proteinGrams: 80, dietTitle: 'Anti-Androgenic PCOS Reversal Protocol' },
        exercisePlan: { weeklyFocus: 'Pilates & Strength Training', sessions: [{ day: 'Monday', focus: 'Clinical Pilates & Glute Activation', duration: '45 mins' }] },
        notes: 'Hormonal balance and cycle regulation check.'
      }
    ]
  }
];

export interface ClientFolderSectionProps {
  currentPatientName?: string;
  clientName?: string;
  currentPatientAge?: number | string;
  currentPatientGender?: string;
  currentPatientPhone?: string;
  currentPatientEmail?: string;
  currentPatientHeight?: string | number;
  currentPatientWeight?: string | number;
  currentDomain?: string;
  primaryCondition?: string;
  generalInfo?: GeneralInfo;
  onOpenRx?: () => void;
  onLoadClientData?: (data: any) => void;
  onNavigateToProfile?: () => void;
  onBackToMainFolders?: () => void;
  onNavigateToWorkspace?: () => void;
}

export const ClientFolderSection: React.FC<ClientFolderSectionProps> = ({
  currentPatientName,
  clientName = 'Kiruthika',
  currentPatientAge = 38,
  currentPatientGender = 'Female',
  currentPatientPhone,
  currentPatientEmail,
  currentPatientHeight,
  currentPatientWeight,
  currentDomain,
  primaryCondition = 'Type 2 Diabetes Mellitus',
  generalInfo,
  onOpenRx,
  onLoadClientData,
  onNavigateToProfile,
  onBackToMainFolders,
  onNavigateToWorkspace,
}) => {
  // activeSubFolder: 'history' | 'medicine' | 'nutrition' | 'exercise' means inside that sub-folder.
  const [activeSubFolder, setActiveSubFolder] = useState<'history' | 'medicine' | 'nutrition' | 'exercise'>('history');
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<ClientDossierFolder | null>(null);
  const [selectedDateVisit, setSelectedDateVisit] = useState<PatientVisitRecord | null>(null);
  const [selectedPatientForSubFolder, setSelectedPatientForSubFolder] = useState<ClientDossierFolder | null>(null);

  const printContentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [documentType, setDocumentType] = useState<string>('Official Clinical Medical Record');
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<ClientDossierFolder[]>(() => {
    try {
      const saved = localStorage.getItem('ziathlon_client_folders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_FOLDERS;
  });

  const [activeFolderId, setActiveFolderId] = useState<string>(folders[0]?.id || '');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderNotes, setNewFolderNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ziathlon_client_folders', JSON.stringify(folders));
    } catch (e) {}
  }, [folders]);

  const filteredFolders = folders.filter(
    (f) =>
      (f.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (f.clientCode || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (f.primaryCondition || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const activeFolder = selectedPatientForSubFolder || folders.find((f) => f.id === activeFolderId) || filteredFolders[0] || folders[0];

  useEffect(() => {
    if (activeFolder && activeFolder.visits && activeFolder.visits.length > 0) {
      if (!selectedDateVisit || !activeFolder.visits.find(v => v.id === selectedDateVisit.id)) {
        setSelectedDateVisit(activeFolder.visits[activeFolder.visits.length - 1]);
      }
    }
  }, [activeFolder, folders]);

  const handleCreateNewFolder = () => {
    const code = `ZIA-${new Date().getFullYear()}-${(newFolderName || currentPatientName).slice(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const numericDateStr = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;

    const newFolder: ClientDossierFolder = {
      id: `folder-${Date.now()}`,
      clientCode: code,
      name: newFolderName.trim() || currentPatientName || 'New Patient',
      age: Number(currentPatientAge) || 38,
      gender: currentPatientGender,
      createdDate: todayStr,
      lastUpdated: todayStr,
      primaryCondition: currentDomain || primaryCondition,
      status: 'Active Consultation',
      folderNotes: newFolderNotes || 'Client folder initialized. Ready for consultation assessment.',
      visits: [
        {
          id: `visit-${Date.now()}`,
          date: numericDateStr,
          mnPrescription: {
            summary: 'Initial MN Prescription and Clinical Supplements.',
            medicines: [{ name: 'Multivitamin Complex', dosage: '1 Tab', frequency: 'Daily', timing: 'Post meal' }]
          },
          rxPrescription: { targetCalories: 1700, proteinGrams: 85, dietTitle: 'Clinical Therapeutic Nutrition Plan' },
          exercisePlan: { weeklyFocus: 'Cardio & Strength Balance', sessions: [{ day: 'Monday', focus: 'Brisk Walking & Core', duration: '45 mins' }] },
          notes: 'Initial consultation record.'
        }
      ]
    };

    setFolders((prev) => [newFolder, ...prev]);
    setActiveFolderId(newFolder.id);
    setNewFolderName('');
    setNewFolderNotes('');
    setStatusMessage(`Client Dossier Folder "${newFolder.clientCode}" successfully created!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDeletePatient = (folderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const folderToDelete = folders.find((f) => f.id === folderId);
    const updated = folders.filter((f) => f.id !== folderId);
    setFolders(updated);
    try {
      localStorage.setItem('ziathlon_client_folders', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    if (selectedPatientForModal?.id === folderId) {
      setSelectedPatientForModal(null);
    }
    if (activeFolderId === folderId) {
      setActiveFolderId(updated.length > 0 ? updated[0].id : '');
    }
    setStatusMessage(`✓ Deleted "${folderToDelete?.name || 'Patient'}" from history records.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDeleteVisit = (visitId: string, e: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeFolder) return;
    const updatedVisits = (activeFolder.visits || []).filter((v) => v.id !== visitId);
    const updatedFolders = folders.map((f) => {
      if (f.id === activeFolder.id) {
        return {
          ...f,
          visits: updatedVisits,
          lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
      }
      return f;
    });
    setFolders(updatedFolders);
    try {
      localStorage.setItem('ziathlon_client_folders', JSON.stringify(updatedFolders));
      localStorage.setItem('ZIATHLON_CLIENT_FOLDERS', JSON.stringify(updatedFolders));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    if (selectedDateVisit?.id === visitId) {
      setSelectedDateVisit(updatedVisits.length > 0 ? updatedVisits[0] : null);
    }
    setStatusMessage('✓ Visit date record removed from history.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveCurrentConsultationToFolder = () => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const numericDateStr = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;

    const newVisit: PatientVisitRecord = {
      id: `visit-${Date.now()}`,
      date: numericDateStr,
      mnPrescription: {
        summary: 'Metformin 500mg, Omega-3, Vitamin D3 protocol.',
        medicines: [
          { name: 'Metformin Hydrochloride', dosage: '500mg', frequency: 'Twice daily', timing: 'With meals' }
        ]
      },
      rxPrescription: { targetCalories: 1650, proteinGrams: 90, dietTitle: 'Updated Clinical 7-Day Master Diet Plan' },
      exercisePlan: {
        weeklyFocus: 'Custom 7-Day Master Exercise Plan',
        sessions: [
          { day: 'Monday', focus: 'Cardio & Lower Body', duration: '45 mins' },
          { day: 'Tuesday', focus: 'Upper Body & Core', duration: '45 mins' },
          { day: 'Wednesday', focus: 'Active Recovery & Yoga', duration: '30 mins' },
          { day: 'Thursday', focus: 'HIIT & Endurance', duration: '40 mins' },
          { day: 'Friday', focus: 'Strength & Agility', duration: '45 mins' }
        ]
      },
      notes: 'Re-Visit consultation and updated Rx & MN prescriptions saved as a new file.'
    };

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === activeFolderId) {
          return {
            ...f,
            lastUpdated: nowStr,
            primaryCondition: currentDomain || f.primaryCondition,
            name: currentPatientName || f.name,
            visits: [...(f.visits || []), newVisit]
          };
        }
        return f;
      })
    );
    setStatusMessage(`New visit saved as an additional file into patient dossier [${activeFolder?.clientCode}] for date ${numericDateStr}!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handlePrintMedicalRecords = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#2E1C07]">
      {/* Top Header */}
      <div className="border-b-2 border-[#D9C4A5] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMainFolders}
            className="p-2.5 rounded-xl bg-[#8C5E28] text-white hover:bg-[#724B1E] transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Folders</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#8C5E28]">
              <Folder className="w-3.5 h-3.5 text-[#8C5E28]" />
              <span>CLIENT FOLDER & ARCHIVE VAULT</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#2E1C07] uppercase mt-0.5">
              {activeSubFolder === 'history' && 'Client Folder 01: History (Patient Records)'}
              {activeSubFolder === 'medicine' && 'Client Folder 02: Medical (Date-wise Records)'}
              {activeSubFolder === 'nutrition' && 'Client Folder 03: Nutrition (Date-wise Rx)'}
              {activeSubFolder === 'exercise' && 'Client Folder 04: Exercise (Date-wise Plans)'}
            </h2>
            <p className="text-xs text-[#5C3A14]">
              Managing patient records and chronological archives with clinical precision.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSubFolder !== null && (
            <button
              type="button"
              onClick={() => setActiveSubFolder(null)}
              className="px-3 py-1.5 bg-[#FFFDF9] border border-[#D9C4A5] text-[#5C3A14] hover:bg-[#FAF6ED] text-xs font-black uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              View All 4 Sub-Folders
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveCurrentConsultationToFolder}
            className="px-4 py-2 bg-[#8C5E28] text-white text-xs font-black uppercase tracking-wider hover:bg-[#724B1E] transition-all flex items-center gap-1.5 shadow-xs rounded-lg cursor-pointer"
            title="Save current consultation as a new dated visit record"
          >
            <Save className="w-4 h-4" />
            <span>Save New Visit Record</span>
          </button>
        </div>
      </div>

      {/* Confirmation Toast */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Vertical Navigation & Active Subfolder Content Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Subfolders Selector */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 no-print">
          <div className="px-3 py-2 text-[10px] font-mono font-black uppercase tracking-widest text-[#8C5E28] border-b-2 border-[#D9C4A5] flex items-center justify-between">
            <span>CLIENT FOLDER MODULES</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#EEDEC8] text-[#5C3A14] font-black">ACTIVE</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              {
                id: 'history',
                number: '1',
                title: 'Patient History',
                desc: 'Client Registry & Options',
                icon: User,
              },
              {
                id: 'medicine',
                number: '2',
                title: 'Medical Archive',
                desc: 'Date-wise Records & Rx',
                icon: Pill,
              },
              {
                id: 'nutrition',
                number: '3',
                title: 'Nutrition Archive',
                desc: 'Date-wise Diet Plans',
                icon: Utensils,
              },
              {
                id: 'exercise',
                number: '4',
                title: 'Exercise Archive',
                desc: '7-Day Master Plans',
                icon: Dumbbell,
              },
            ].map((folder) => {
              const Icon = folder.icon;
              const isActive = activeSubFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setActiveSubFolder(folder.id as any)}
                  className={`w-full px-4 py-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between font-black tracking-wider text-xs shadow-xs ${
                    isActive
                      ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs'
                      : 'bg-[#FFFDF9] hover:bg-[#FAF6ED] text-[#2E1C07] border-[#D9C4A5]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8C5E28]'}`} />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono opacity-80">{folder.number}.</span>
                        <span className="truncate">{folder.title.toUpperCase()}</span>
                      </div>
                      <span className={`text-[10px] block truncate font-bold ${isActive ? 'text-[#FAF6ED]' : 'text-[#5C3A14]'}`}>
                        {folder.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white translate-x-1' : 'text-[#8C5E28]'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Subfolder Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* SUB-FOLDER 1: HISTORY */}
          {activeSubFolder === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FAF6ED] border border-[#D9C4A5] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[#2E1C07] uppercase tracking-wider">Patient Clinical History Registry</h3>
              <p className="text-xs text-[#5C3A14]">Click on any patient name to access Re-Edit, Re-Visit, and Go to File options.</p>
            </div>
            
            {/* Quick Add Patient */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New Patient Name..."
                className="bg-white border border-[#D9C4A5] text-xs text-[#2E1C07] px-3 py-2 rounded-lg focus:outline-none focus:border-[#8C5E28]"
              />
              <button
                type="button"
                onClick={handleCreateNewFolder}
                className="px-3.5 py-2 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase rounded-lg shadow-xs cursor-pointer whitespace-nowrap"
              >
                + Add Patient
              </button>
            </div>
          </div>

          {/* Vertical List of Patients: 5 names height with scroll and delete option */}
          <div className="bg-[#FFFDF9] border-2 border-[#D9C4A5] rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#EEDEC8] px-6 py-3 border-b border-[#D9C4A5] grid grid-cols-12 gap-2 text-[10px] font-black uppercase tracking-widest text-[#2E1C07]">
              <span className="col-span-5">Name ({filteredFolders.length})</span>
              <span className="col-span-3 text-center">Patient Number</span>
              <span className="col-span-3 text-right">Last Updated</span>
              <span className="col-span-1 text-center">Action</span>
            </div>
            {/* Scrollable container showing ~5 patients at once */}
            <div className="divide-y divide-[#E3D4C0] max-h-[340px] overflow-y-auto pr-1">
              {filteredFolders.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatientForModal(pat)}
                  className="px-6 py-3.5 grid grid-cols-12 gap-2 items-center hover:bg-[#FAF6ED] transition-all cursor-pointer group"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EEDEC8] flex items-center justify-center text-[#8C5E28] font-black text-xs shrink-0">
                      {pat.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[#2E1C07] group-hover:text-[#8C5E28] transition-colors truncate">
                      {pat.name}
                    </span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF6ED] text-[#5C3A14] font-mono text-[11px] font-bold border border-[#D9C4A5]">
                      {pat.clientCode}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-xs font-mono text-[#5C3A14]">
                    {pat.lastUpdated}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={(e) => handleDeletePatient(pat.id, e)}
                      title="Delete patient from history"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredFolders.length === 0 && (
                <div className="p-12 text-center text-gray-500 font-mono text-xs">
                  No patients found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR PATIENT OPTIONS WHEN CLICKED IN HISTORY */}
      {selectedPatientForModal && (
        <div className="fixed inset-0 z-50 bg-[#2E1C07]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFFDF9] border-2 border-[#D9C4A5] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-5 text-[#2E1C07]">
            <button
              type="button"
              onClick={() => setSelectedPatientForModal(null)}
              className="absolute right-4 top-4 text-[#8C5E28] hover:text-[#2E1C07] p-1 rounded-lg hover:bg-[#FAF6ED] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#8C5E28] tracking-widest font-bold">PATIENT CLINICAL DOSSIER</span>
              <h3 className="text-2xl font-black text-[#2E1C07] mt-0.5">{selectedPatientForModal.name}</h3>
              <p className="text-xs text-[#5C3A14] font-mono mt-1">Code: {selectedPatientForModal.clientCode} • Condition: {selectedPatientForModal.primaryCondition}</p>
            </div>

            <div className="p-3.5 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl text-xs text-[#2E1C07]">
              <span className="font-bold text-[#8C5E28] block mb-1">Select Action / Option:</span>
              <p className="text-[#5C3A14]">Choose whether to re-edit patient details in the 7 folders, start a new re-visit encounter, or open the date-wise record archive.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Option 1: Re-Edit */}
              <button
                type="button"
                onClick={() => {
                  setActiveFolderId(selectedPatientForModal.id);
                  if (onLoadClientData) {
                    onLoadClientData({
                      name: selectedPatientForModal.name,
                      age: selectedPatientForModal.age,
                      sex: selectedPatientForModal.gender,
                      tag: selectedPatientForModal.primaryCondition,
                    });
                  }
                  if (onNavigateToProfile) {
                    onNavigateToProfile();
                  }
                  setSelectedPatientForModal(null);
                }}
                className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#D9C4A5] hover:bg-[#F4ECE1] text-[#2E1C07] text-xs font-black uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-4 h-4 text-[#8C5E28]" />
                  <div className="text-left">
                    <div className="font-black text-[#2E1C07]">1. Re-Edit Patient Profile</div>
                    <div className="text-[10px] text-[#5C3A14] font-normal">Open 7 Folders to edit patient demographics & save changes</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5E28]" />
              </button>

              {/* Option 2: Re-Visit */}
              <button
                type="button"
                onClick={() => {
                  setActiveFolderId(selectedPatientForModal.id);
                  handleSaveCurrentConsultationToFolder();
                  if (onNavigateToWorkspace) {
                    onNavigateToWorkspace();
                  }
                  setSelectedPatientForModal(null);
                }}
                className="p-3.5 rounded-xl bg-[#8C5E28] border border-[#724B1E] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-white" />
                  <div className="text-left">
                    <div className="font-black">2. Re-Visit (New Encounter)</div>
                    <div className="text-[10px] text-[#F3E8D8] font-normal">Open 7 Folders; saves a 2nd/new visit file into patient records upon completion</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              {/* Option 3: Go to File */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPatientForSubFolder(selectedPatientForModal);
                  setActiveSubFolder('medicine');
                  setSelectedPatientForModal(null);
                }}
                className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#D9C4A5] hover:bg-[#FAF6ED] text-[#2E1C07] text-xs font-black uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4 text-[#8C5E28]" />
                  <div className="text-left">
                    <div className="font-black">3. Go to File (Date-Wise Archives)</div>
                    <div className="text-[10px] text-[#5C3A14] font-normal">View date-wise MN and Rx prescriptions in 2-portion split view</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C5E28]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-FOLDERS 2, 3, 4: MEDICINE, NUTRITION, EXERCISE (2-Portion Date-Wise View) */}
      {(activeSubFolder === 'medicine' || activeSubFolder === 'nutrition' || activeSubFolder === 'exercise') && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FAF6ED] border border-[#D9C4A5] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8C5E28] tracking-wider font-bold">
                  {activeSubFolder === 'medicine' && 'MEDICAL SUB-FOLDER • DATE-WISE MEDICAL RECORDS & PRESCRIPTIONS'}
                  {activeSubFolder === 'nutrition' && 'NUTRITION SUB-FOLDER • DATE-WISE RX PRESCRIPTIONS'}
                  {activeSubFolder === 'exercise' && 'EXERCISE SUB-FOLDER • DATE-WISE 7-DAY PLANS'}
                </span>
                <h3 className="text-xl font-black text-[#2E1C07] uppercase tracking-wider mt-0.5">
                  Client: {activeFolder?.name} ({activeFolder?.clientCode})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Patient Selector */}
              <select
                value={activeFolder?.id}
                onChange={(e) => {
                  const found = folders.find(f => f.id === e.target.value);
                  if (found) setSelectedPatientForSubFolder(found);
                }}
                className="bg-[#FFFDF9] border border-[#D9C4A5] text-xs text-[#2E1C07] px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
              >
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.clientCode})</option>
                ))}
              </select>

              <div className="text-xs font-mono text-[#8C5E28] bg-[#FFFDF9] px-3 py-1.5 border border-[#D9C4A5] rounded-lg hidden sm:block font-bold">
                2-Portion Split Layout
              </div>
            </div>
          </div>

          {/* 2-PORTION LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Portion: Date List (e.g. 2/8/2026, 7/8/2026, 9/3/2027) */}
            <div className="lg:col-span-4 bg-[#FFFDF9] border-2 border-[#D9C4A5] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EEDEC8] pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#8C5E28] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#8C5E28]" />
                  Visit Dates ({activeFolder?.visits?.length || 0})
                </span>
                <span className="text-[10px] font-mono text-[#7D5A2C]">Chronological</span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {activeFolder?.visits && activeFolder.visits.length > 0 ? (
                  activeFolder.visits.map((visit, vIdx) => {
                    const isSelected = selectedDateVisit?.id === visit.id;
                    return (
                      <div
                        key={visit.id || vIdx}
                        onClick={() => setSelectedDateVisit(visit)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#8C5E28] text-white border-[#724B1E] shadow-sm font-black'
                            : 'bg-[#FAF6ED]/70 hover:bg-[#F4ECE1] text-[#2E1C07] border-[#D9C4A5]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#8C5E28]'}`} />
                          <div>
                            <div className="text-sm font-mono tracking-wider font-bold">{visit.date}</div>
                            <div className={`text-[10px] truncate max-w-[180px] ${isSelected ? 'text-[#F3E8D8]' : 'text-[#5C3A14]'}`}>
                              {visit.notes || 'Clinical consultation visit'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteVisit(visit.id, e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? 'hover:bg-[#724B1E] text-[#F3E8D8] hover:text-white'
                                : 'hover:bg-red-50 text-[#8C5E28] hover:text-red-600'
                            }`}
                            title="Delete this visit from history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#8C5E28]'}`} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-[#5C3A14] font-mono">
                    No visit dates recorded yet. Click "Save New Visit Record" above.
                  </div>
                )}
              </div>
            </div>

            {/* Right Portion: Selected Date Prescription / Details */}
            <div className="lg:col-span-8 bg-[#FFFDF9] border-2 border-[#D9C4A5] rounded-2xl p-6 space-y-5 shadow-xs text-[#2E1C07]">
              {selectedDateVisit ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEDEC8] pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#8C5E28] tracking-widest font-bold">
                        ACTIVE DATE RECORD • {selectedDateVisit.date}
                      </span>
                      <h4 className="text-xl font-black text-[#2E1C07] uppercase mt-0.5">
                        {activeSubFolder === 'medicine' && 'MN Prescription & Supplement Directory'}
                        {activeSubFolder === 'nutrition' && 'Rx Prescription & 7-Day Diet Plan'}
                        {activeSubFolder === 'exercise' && 'Rx Exercise & 7-Day Master Plan'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrintMedicalRecords}
                        className="px-3 py-1.5 bg-[#FAF6ED] border border-[#D9C4A5] text-[#8C5E28] text-xs font-bold uppercase tracking-wider hover:bg-[#8C5E28] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer rounded-lg"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Date Record</span>
                      </button>
                    </div>
                  </div>

                  {/* MEDICINE SUB-FOLDER CONTENT */}
                  {activeSubFolder === 'medicine' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl space-y-2">
                        <span className="text-xs font-mono uppercase text-[#8C5E28] font-bold block">
                          MN Prescription Summary ({selectedDateVisit.date}):
                        </span>
                        <p className="text-sm font-bold text-[#2E1C07]">{selectedDateVisit.mnPrescription?.summary}</p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-xs font-black uppercase text-[#8C5E28] tracking-wider">Prescribed Medicinal Intelligence:</h5>
                        <div className="space-y-2">
                          {selectedDateVisit.mnPrescription?.medicines?.map((med, mIdx) => (
                            <div key={mIdx} className="p-3 bg-[#FAF6ED]/70 border border-[#D9C4A5] rounded-xl flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5">
                                <Pill className="w-4 h-4 text-[#8C5E28]" />
                                <div>
                                  <div className="font-bold text-[#2E1C07]">{med.name}</div>
                                  <div className="text-[10px] font-mono text-[#5C3A14]">Timing: {med.timing}</div>
                                </div>
                              </div>
                              <div className="text-right font-mono">
                                <div className="text-amber-800 font-bold">{med.dosage}</div>
                                <div className="text-[10px] text-[#5C3A14]">{med.frequency}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NUTRITION SUB-FOLDER CONTENT */}
                  {activeSubFolder === 'nutrition' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3.5 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl">
                          <span className="text-[10px] font-mono uppercase text-[#5C3A14] block">Diet Protocol Title</span>
                          <span className="text-sm font-bold text-[#2E1C07]">{selectedDateVisit.rxPrescription?.dietTitle}</span>
                        </div>
                        <div className="p-3.5 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl">
                          <span className="text-[10px] font-mono uppercase text-[#5C3A14] block">Target Daily Calories</span>
                          <span className="text-sm font-bold text-amber-800 font-mono">{selectedDateVisit.rxPrescription?.targetCalories} kcal</span>
                        </div>
                        <div className="p-3.5 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl">
                          <span className="text-[10px] font-mono uppercase text-[#5C3A14] block">Protein Requirement</span>
                          <span className="text-sm font-bold text-emerald-800 font-mono">{selectedDateVisit.rxPrescription?.proteinGrams} g / day</span>
                        </div>
                      </div>

                      <div className="p-4 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl space-y-2">
                        <span className="text-xs font-mono uppercase text-[#8C5E28] font-bold block">Clinical Nutritional Prescription Notes:</span>
                        <p className="text-xs text-[#2E1C07] leading-relaxed font-serif">
                          Prescription formulated for {activeFolder?.name} on {selectedDateVisit.date}. Balanced macronutrient distribution with micronutrient optimization for {activeFolder?.primaryCondition}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EXERCISE SUB-FOLDER CONTENT */}
                  {activeSubFolder === 'exercise' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl space-y-1">
                        <span className="text-[10px] font-mono uppercase text-[#8C5E28] font-bold block">7-Day Master Plan Weekly Focus</span>
                        <p className="text-sm font-bold text-[#2E1C07]">{selectedDateVisit.exercisePlan?.weeklyFocus}</p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-xs font-black uppercase text-[#8C5E28] tracking-wider">Dated Exercise Protocol Sessions:</h5>
                        <div className="space-y-2">
                          {selectedDateVisit.exercisePlan?.sessions?.map((sess, sIdx) => (
                            <div key={sIdx} className="p-3.5 bg-[#FAF6ED]/70 border border-[#D9C4A5] rounded-xl flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5">
                                <Dumbbell className="w-4 h-4 text-[#8C5E28]" />
                                <div>
                                  <div className="font-bold text-[#2E1C07]">{sess.day}: {sess.focus}</div>
                                  <div className="text-[10px] font-mono text-[#5C3A14]">Clinical Exercise Prescription Date: {selectedDateVisit.date}</div>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 bg-[#EEDEC8] text-[#8C5E28] border border-[#D9C4A5] rounded-md font-mono text-xs font-bold">
                                {sess.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl text-xs text-[#8C5E28] font-mono">
                    Visit Notes: {selectedDateVisit.notes}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-[#5C3A14] font-mono text-xs">
                  Select a date from the left side list to view detailed prescriptions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
