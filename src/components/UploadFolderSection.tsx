import React, { useState } from 'react';
import { Activity, UploadCloud, FileText } from 'lucide-react';
import { MedicalRecordsDirectoryAndViewer } from './MedicalRecordsDirectoryAndViewer';
import { ReportsUploadSection } from './ReportsUploadSection';
import { GeneralInfo, Calculations, MedicalHistory } from '../types';

interface UploadFolderSectionProps {
  generalInfo: GeneralInfo;
  calculations?: Calculations;
  medicalHistory?: MedicalHistory;
  onBackToMainFolders?: () => void;
}

export const UploadFolderSection: React.FC<UploadFolderSectionProps> = ({
  generalInfo,
  calculations = {} as Calculations,
  medicalHistory = {} as MedicalHistory,
  onBackToMainFolders,
}) => {
  const [activeUploadTab, setActiveUploadTab] = useState<'medical-documents' | 'previous-reports'>('medical-documents');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub-Folder Tab Navigation within Upload Folder */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0d0617] border-2 border-[#7E22CE] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-[#A855F7]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#A855F7]">
              FOLDER 6 • UPLOAD REPOSITORY
            </div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              Medical Documents & Clinical Archive
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-purple-900/60">
          <button
            type="button"
            onClick={() => setActiveUploadTab('medical-documents')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeUploadTab === 'medical-documents'
                ? 'bg-[#7E22CE] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Saved Documents (Archive)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveUploadTab('previous-reports')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeUploadTab === 'previous-reports'
                ? 'bg-[#7E22CE] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload Reports & Scans</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Medical Documents Archive (Save Document Only Mode: Zero Normal Range / Pathophysiology) */}
      {activeUploadTab === 'medical-documents' && (
        <MedicalRecordsDirectoryAndViewer
          generalInfo={generalInfo}
          calculations={calculations}
          medicalHistory={medicalHistory}
          onBackToMainFolders={onBackToMainFolders}
          isUploadFolder={true}
        />
      )}

      {/* Tab 2: Previous Reports & File Attachments (Save Document Only) */}
      {activeUploadTab === 'previous-reports' && (
        <ReportsUploadSection />
      )}
    </div>
  );
};
