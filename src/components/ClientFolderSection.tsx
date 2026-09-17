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
} from 'lucide-react';
import { generateClientDossierPdf, downloadHtmlAsPdf } from '../utils/pdfGenerator';

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
  snapshotData?: any;
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
    folderNotes: '3-Month Reversal Program. Targeting HbA1c reduction from 8.2% to <6.5% and visceral fat reduction from 11 to 7.',
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
    folderNotes: 'Post-CABG cardiac rehabilitation diet. Low sodium <1800mg, high potassium:sodium ratio.',
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
    folderNotes: '12-Day Elimination Protocol completed. Reintroducing sprouted legumes; regular ovulatory cycle restored.',
  },
];

interface ClientFolderSectionProps {
  currentPatientName?: string;
  clientName?: string;
  currentPatientAge?: number;
  currentPatientGender?: string;
  currentDomain?: string;
  primaryCondition?: string;
  onOpenRx?: () => void;
  onLoadClientData?: (data: any) => void;
}

export const DOCUMENT_PRINT_TYPES = [
  'Official Clinical Medical Record',
  'Comprehensive Patient Dossier',
  'Clinical Nutrition & Sports Protocol',
  'Executive Health Assessment Record',
] as const;

export const ClientFolderSection: React.FC<ClientFolderSectionProps> = ({
  currentPatientName,
  clientName = 'Kiruthika',
  currentPatientAge = 38,
  currentPatientGender = 'Female',
  currentDomain,
  primaryCondition = 'Type 2 Diabetes Mellitus',
  onOpenRx,
  onLoadClientData,
}) => {
  const patientDisplayName = clientName || currentPatientName || 'Kiruthika';
  const patientDomain = primaryCondition || currentDomain || 'Type 2 Diabetes Mellitus';
  const printContentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [documentType, setDocumentType] = useState<string>('Official Clinical Medical Record');
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

  const activeFolder = folders.find((f) => f.id === activeFolderId) || folders[0];

  const handleCreateNewFolder = () => {
    const code = `ZIA-${new Date().getFullYear()}-${(newFolderName || currentPatientName).slice(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newFolder: ClientDossierFolder = {
      id: `folder-${Date.now()}`,
      clientCode: code,
      name: newFolderName.trim() || currentPatientName || 'New Patient',
      age: currentPatientAge,
      gender: currentPatientGender,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      primaryCondition: currentDomain,
      status: 'Active Consultation',
      folderNotes: newFolderNotes || 'Client folder initialized. Ready for 20-module consultation assessment.',
    };

    setFolders((prev) => [newFolder, ...prev]);
    setActiveFolderId(newFolder.id);
    setNewFolderName('');
    setNewFolderNotes('');
    setStatusMessage(`Client Dossier Folder "${newFolder.clientCode}" successfully created and opened!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSaveCurrentConsultationToFolder = () => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === activeFolderId) {
          return {
            ...f,
            lastUpdated: nowStr,
            primaryCondition: currentDomain,
            name: currentPatientName || f.name,
          };
        }
        return f;
      })
    );
    setStatusMessage(`All 20 consultation modules saved into client dossier [${activeFolder?.clientCode}]!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDeleteFolder = (id: string) => {
    if (folders.length <= 1) {
      alert('At least one client folder must remain in your clinical system.');
      return;
    }
    setFolders((prev) => prev.filter((f) => f.id !== id));
    if (activeFolderId === id) {
      setActiveFolderId(folders[0]?.id || '');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(folders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Ziathlon_Client_Folders_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintMedicalRecords = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!activeFolder) return;
    setIsGeneratingPdf(true);
    setStatusMessage(`Generating formal ${documentType} PDF...`);
    
    try {
      generateClientDossierPdf({
        name: activeFolder.name,
        clientCode: activeFolder.clientCode,
        age: activeFolder.age,
        gender: activeFolder.gender,
        primaryCondition: activeFolder.primaryCondition,
        folderNotes: activeFolder.folderNotes,
        createdDate: activeFolder.createdDate,
        lastUpdated: activeFolder.lastUpdated,
        status: activeFolder.status,
        documentType: documentType,
        clinicianName: 'Chief Clinical Nutritionist',
      });
      setStatusMessage(`PDF downloaded successfully: ${documentType}`);
    } catch (err: any) {
      console.error('PDF generation error, fallback to print/html:', err);
      if (printContentRef.current) {
        try {
          const cleanName = (activeFolder?.name || 'Patient').replace(/\s+/g, '_');
          await downloadHtmlAsPdf(printContentRef.current, `Ziathlon_Dossier_${cleanName}.pdf`);
          setStatusMessage('PDF downloaded successfully!');
        } catch (fbErr: any) {
          window.print();
        }
      } else {
        window.print();
      }
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Folder className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 19 • CLIENT DATA FOLDER & ARCHIVE VAULT</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Save & Client Dossier Folder Management
          </h2>
          <p className="text-xs text-gray-400">
            Secure client record archiving, centralized dossier generation, and local encrypted consultation storage.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Document Type Selector */}
          <div className="flex items-center gap-1.5 bg-black border border-yellow-600/60 px-2.5 py-1.5 rounded-none shadow-[0_0_8px_rgba(202,138,4,0.2)]">
            <FileCheck className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            <span className="text-[10px] font-mono uppercase text-yellow-400/90 font-bold whitespace-nowrap">
              Doc Type:
            </span>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="bg-black text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              title="Select document type for export and printing"
            >
              {DOCUMENT_PRINT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-zinc-950 text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {onOpenRx && (
            <button
              type="button"
              onClick={onOpenRx}
              className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-xs font-black uppercase tracking-wider hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(126,34,206,0.6)] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-purple-200" />
              <span>Open Official Rx Prescription</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveCurrentConsultationToFolder}
            className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.5)] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Consultation to Dossier</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 bg-black border border-yellow-500/80 text-yellow-400 text-xs font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(202,138,4,0.3)]"
            title="Download client-side PDF document"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
          
          <button
            type="button"
            onClick={handlePrintMedicalRecords}
            className="px-3.5 py-2 bg-black border border-[#7E22CE] text-[#C084FC] text-xs font-bold uppercase tracking-wider hover:bg-[#7E22CE] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print clinical records"
          >
            <Printer className="w-4 h-4" />
            <span>Print Medical Records</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-black border border-white/20 text-gray-300 text-xs font-bold uppercase tracking-wider hover:text-white hover:border-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      {/* Confirmation Toast */}
      {statusMessage && (
        <div className="p-3 bg-purple-950/70 border border-[#7E22CE] text-[#C084FC] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* CREATE NEW CLIENT FOLDER FORM */}
      <div className="bg-[#0e071a] border border-[#7E22CE] p-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-[#A855F7] tracking-wider mb-3">
          <FolderPlus className="w-4 h-4" />
          <span>Create New Client Dossier Folder</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
              Client Full Name:
            </label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={`e.g. ${currentPatientName}`}
              className="w-full bg-black border border-white/20 text-xs text-white px-2.5 py-2 focus:border-[#7E22CE] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
              Initial Clinical Focus / Protocol:
            </label>
            <input
              type="text"
              value={newFolderNotes}
              onChange={(e) => setNewFolderNotes(e.target.value)}
              placeholder="e.g. 12-Week Diabetes Reversal Protocol"
              className="w-full bg-black border border-white/20 text-xs text-white px-2.5 py-2 focus:border-[#7E22CE] focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleCreateNewFolder}
              className="w-full py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(126,34,206,0.4)]"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create Folder</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLIENT FOLDERS DIRECTORY & ACTIVE DOSSIER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Folders List */}
        <div className="bg-[#0d0617] border border-[#7E22CE]/60 p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-[#A855F7] flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              Client Folders ({folders.length})
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Encrypted</span>
          </div>

          <div className="space-y-2">
            {folders.map((folder) => {
              const isSelected = activeFolderId === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#7E22CE]/20 border-[#7E22CE] shadow-[0_0_10px_rgba(126,34,206,0.3)]'
                      : 'bg-black/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-[10px] text-[#C084FC] font-bold">
                        {folder.clientCode}
                      </div>
                      <h4 className="text-sm font-bold text-white">{folder.name}</h4>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {folder.primaryCondition}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
                        folder.status === 'In Protocol'
                          ? 'border-purple-500 text-[#C084FC] bg-purple-950/40'
                          : folder.status === 'Active Consultation'
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
                          : 'border-gray-500 text-gray-400 bg-black'
                      }`}
                    >
                      {folder.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-2 pt-2 border-t border-white/5">
                    <span>Updated: {folder.lastUpdated}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="text-gray-600 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Dossier Preview */}
        {activeFolder && (
          <div className="lg:col-span-2 bg-[#0d0617] border border-[#7E22CE] p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#A855F7] tracking-widest">
                  CLIENT DOSSIER RECORD
                </span>
                <h3 className="text-2xl font-black text-white">{activeFolder.name}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mt-1">
                  <span>CODE: <strong className="text-white">{activeFolder.clientCode}</strong></span>
                  <span>•</span>
                  <span>AGE/SEX: <strong className="text-white">{activeFolder.age} / {activeFolder.gender}</strong></span>
                  <span>•</span>
                  <span>CREATED: <strong className="text-white">{activeFolder.createdDate}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenRx && (
                  <button
                    type="button"
                    onClick={onOpenRx}
                    className="px-3 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(126,34,206,0.5)]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Official Rx</span>
                  </button>
                )}
                <span className="px-3 py-1 bg-purple-950 border border-purple-500 text-[#C084FC] text-xs font-mono font-bold">
                  {activeFolder.status}
                </span>
              </div>
            </div>

            {/* Clinical Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-gray-400">Primary Diagnosis & Domain</span>
                <p className="font-bold text-white">{activeFolder.primaryCondition}</p>
              </div>

              <div className="p-3 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-gray-400">Lead Consultant Facility</span>
                <p className="font-bold text-white">Žiathlon Sports Medicine Clinic</p>
              </div>
            </div>

            {/* Folder Clinical Notes */}
            <div className="p-3.5 bg-black border border-white/10 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold block">
                Dossier Consultation Notes & Protocol Directives:
              </span>
              <textarea
                rows={3}
                value={activeFolder.folderNotes}
                onChange={(e) => {
                  const val = e.target.value;
                  setFolders((prev) =>
                    prev.map((f) => (f.id === activeFolder.id ? { ...f, folderNotes: val } : f))
                  );
                }}
                className="w-full bg-[#0e071a] border border-white/20 text-white p-2.5 focus:border-[#7E22CE] focus:outline-none text-xs"
              />
            </div>

            {/* Included Modules Checklist */}
            <div className="p-4 bg-purple-950/20 border border-[#7E22CE]/40 space-y-2 text-xs">
              <span className="font-bold text-[#A855F7] uppercase text-[10px] tracking-wider block">
                20-Module Comprehensive Clinical Consultation Package Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-300">
                <span>✓ 01. Demographics</span>
                <span>✓ 02. Disease Domain</span>
                <span>✓ 03. Symptoms</span>
                <span>✓ 04. Medical & Surgeries</span>
                <span>✓ 05. Parent Lineage</span>
                <span>✓ 06. Upload Files</span>
                <span>✓ 07. Lifestyle</span>
                <span>✓ 08. Mental 15 Qs</span>
                <span>✓ 09. Gut 40 Qs & Bristol</span>
                <span>✓ 10. Nutrition Assessment</span>
                <span>✓ 11. Micronutrient 30 Qs</span>
                <span>✓ 12. Daily Routine</span>
                <span>✓ 13. FFQ Matrix</span>
                <span>✓ 14. 24-Hr Recall</span>
                <span>✓ 15. Nutrient Gap</span>
                <span>✓ 16. Diet Domains</span>
                <span>✓ 17. Ayur-Siddha</span>
                <span>✓ 18. Recipes Guidelines</span>
                <span>✓ 19. Client Folder</span>
                <span>✓ 20. Biometric Tracker</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Print Layout for Medical Records */}
      {activeFolder && (
        <div ref={printContentRef} className="hidden print-only print-area w-full bg-black text-white p-10 font-sans min-h-screen">
          <div className="border-b-4 border-yellow-600 pb-6 mb-8 text-center">
            <div className="inline-block px-3 py-1 bg-yellow-950/80 border border-yellow-600 text-[10px] font-mono uppercase tracking-widest text-yellow-400 font-bold mb-3">
              DOCUMENT TYPE: {documentType.toUpperCase()} • CLASSIFICATION: CONFIDENTIAL MEDICAL RECORD
            </div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-yellow-500">
              {documentType}
            </h1>
            <h2 className="text-xl font-bold text-gray-200 mt-2 uppercase">
              Žiathlon Sports Medicine Clinic
            </h2>
            <p className="text-sm text-yellow-600/80 mt-1 uppercase font-bold">
              Official Patient Dossier & Clinical Health Summary
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="border-2 border-yellow-600/50 p-4 bg-zinc-900 shadow-[0_0_15px_rgba(202,138,4,0.15)]">
              <h3 className="text-xs font-black uppercase text-yellow-600 tracking-wider mb-2">Patient Information</h3>
              <p className="text-lg font-bold text-white mb-1">{activeFolder.name}</p>
              <div className="text-sm text-gray-300 space-y-1 font-mono">
                <p>Code: <span className="text-yellow-500">{activeFolder.clientCode}</span></p>
                <p>Age/Sex: {activeFolder.age} / {activeFolder.gender}</p>
                <p>Generated: {new Date().toLocaleDateString()}</p>
                <p>Status: {activeFolder.status}</p>
              </div>
            </div>

            <div className="border-2 border-yellow-600/50 p-4 bg-zinc-900 shadow-[0_0_15px_rgba(202,138,4,0.15)]">
              <h3 className="text-xs font-black uppercase text-yellow-600 tracking-wider mb-2">Primary Diagnosis</h3>
              <p className="text-lg font-bold text-white mb-1">{activeFolder.primaryCondition}</p>
              <div className="text-sm text-gray-300 mt-4 space-y-1 font-mono">
                <p>Folder Created: {activeFolder.createdDate}</p>
                <p>Last Updated: {activeFolder.lastUpdated}</p>
              </div>
            </div>
          </div>

          <div className="border-2 border-yellow-600/50 p-5 bg-zinc-900 mb-8 min-h-[200px] shadow-[0_0_15px_rgba(202,138,4,0.15)]">
            <h3 className="text-sm font-black uppercase text-yellow-500 tracking-widest border-b-2 border-yellow-600/30 pb-2 mb-4">
              Consultation Notes & Protocol Directives
            </h3>
            <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-serif">
              {activeFolder.folderNotes || 'No specific protocol notes provided for this patient.'}
            </div>
          </div>

          <div className="border-2 border-yellow-600/50 p-5 bg-zinc-900 shadow-[0_0_15px_rgba(202,138,4,0.15)]">
            <h3 className="text-sm font-black uppercase text-yellow-500 tracking-widest border-b-2 border-yellow-600/30 pb-2 mb-4">
              Modules Completed
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono font-bold text-gray-300">
              <span><span className="text-yellow-500">[X]</span> 01. Demographics</span>
              <span><span className="text-yellow-500">[X]</span> 02. Disease Domain</span>
              <span><span className="text-yellow-500">[X]</span> 03. Symptoms</span>
              <span><span className="text-yellow-500">[X]</span> 04. Medical & Surgeries</span>
              <span><span className="text-yellow-500">[X]</span> 05. Parent Lineage</span>
              <span><span className="text-yellow-500">[X]</span> 06. Upload Files</span>
              <span><span className="text-yellow-500">[X]</span> 07. Lifestyle</span>
              <span><span className="text-yellow-500">[X]</span> 08. Mental 15 Qs</span>
              <span><span className="text-yellow-500">[X]</span> 09. Gut 40 Qs & Bristol</span>
              <span><span className="text-yellow-500">[X]</span> 10. Nutrition Assessment</span>
              <span><span className="text-yellow-500">[X]</span> 11. Micronutrient 30 Qs</span>
              <span><span className="text-yellow-500">[X]</span> 12. Daily Routine</span>
              <span><span className="text-yellow-500">[X]</span> 13. FFQ Matrix</span>
              <span><span className="text-yellow-500">[X]</span> 14. 24-Hr Recall</span>
              <span><span className="text-yellow-500">[X]</span> 15. Nutrient Gap</span>
              <span><span className="text-yellow-500">[X]</span> 16. Diet Domains</span>
              <span><span className="text-yellow-500">[X]</span> 17. Ayur-Siddha</span>
              <span><span className="text-yellow-500">[X]</span> 18. Recipes Guidelines</span>
              <span><span className="text-yellow-500">[X]</span> 19. Client Folder</span>
              <span><span className="text-yellow-500">[X]</span> 20. Biometric Tracker</span>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t-2 border-yellow-600/30 flex justify-between items-center text-xs text-gray-500 font-mono">
            <span>Powered by Elsha AI Clinical System</span>
            <span>Authorized Signature: ______________________</span>
          </div>
        </div>
      )}
    </div>
  );
};
