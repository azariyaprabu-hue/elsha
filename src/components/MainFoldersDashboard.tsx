import React, { useState } from 'react';
import {
  User,
  Activity,
  Stethoscope,
  Apple,
  Dumbbell,
  Folder,
  MessageSquare,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  FolderOpen,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { GeneralInfo, Calculations, MedicalHistory } from '../types';

interface MainFoldersDashboardProps {
  onSelectFolder: (folderId: string) => void;
  onBackToFrontPage?: () => void;
  onOpenSecuritySettings?: () => void;
  themeMode?: string;
  patientName?: string;
  patientCondition?: string;
  generalInfo?: GeneralInfo;
  calculations?: Calculations;
  medicalHistory?: MedicalHistory;
}

export interface FolderItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  color: string;
  subfolders: {
    name: string;
    targetId: string;
    desc: string;
  }[];
}

export const MAIN_SEVEN_FOLDERS: FolderItem[] = [
  {
    id: 'profile',
    number: '01',
    title: 'Profile',
    subtitle: 'Demographics, Disease Domain & Symptoms Assessment',
    icon: User,
    tag: 'Patient Intake',
    color: '#7E22CE',
    subfolders: [
      { name: 'Demographics', targetId: 'general', desc: 'Patient name, age, gender, contact & vital baselines' },
      { name: 'Disease Domain', targetId: 'domains', desc: 'Active clinical category & metabolic health domain' },
      { name: 'Symptoms Assessment', targetId: 'symptoms', desc: 'Scored clinical complaints & symptoms matrix' },
      { name: 'Medical History', targetId: 'medical-history', desc: 'Current conditions, surgical record & past treatments' },
      { name: 'Parent History', targetId: 'parent-history', desc: 'Genetic, hereditary & parental medical tracking' },
      { name: 'Previous Reports', targetId: 'upload-files', desc: 'Diagnostic lab tests, bloodwork & ultrasound scans' },
      { name: 'Prescription (Tests)', targetId: 'medicinal', desc: 'Clinical testing orders & letterhead medical record' },
    ],
  },
  {
    id: 'biometrics',
    number: '02',
    title: 'Biometric',
    subtitle: 'Vitals, Body Comp & Biomarkers Progress',
    icon: Activity,
    tag: 'Vitals',
    color: '#A87B41',
    subfolders: [
      { name: 'SCANNER', targetId: 'biometrics-scanner', desc: 'Upload and analyze body-composition reports' },
      { name: 'PROGRESS', targetId: 'biometrics-progress', desc: 'View saved scans, history and biometric changes' },
    ],
  },
  {
    id: 'medicinal',
    number: '03',
    title: 'Medical',
    subtitle: 'Clinical Record & Preview Document',
    icon: Stethoscope,
    tag: 'Clinical Doc',
    color: '#8C5E28',
    subfolders: [
      { name: 'Clinical Consultation Notes', targetId: 'medicinal', desc: 'Attending physician clinical observations' },
      { name: 'Medical Records Preview', targetId: 'medicinal', desc: 'Official single-page letterhead clinical dossier' },
      { name: 'Dynamic Clinical Summary', targetId: 'medicinal', desc: 'Automated 5-point clinical diagnostic summary' },
      { name: 'Prescription & Dosages', targetId: 'medicinal', desc: 'Active pharmacotherapy & nutraceutical dosages' },
    ],
  },
  {
    id: 'nutrition',
    number: '04',
    title: 'Nutrition',
    subtitle: 'Dietary Habits & Protocol Planning',
    icon: Apple,
    tag: 'Nutrition',
    color: '#8C5E28',
    subfolders: [
      { name: '1. Anthropometry', targetId: 'anthropometry', desc: 'Patient info, body composition & BMR/TDEE energy calculations' },
      { name: '2. Life style', targetId: 'lifestyle', desc: 'Sleep duration, stress, hydration & routine baselines' },
      { name: '3. Neuro emotional', targetId: 'neuro-emotional', desc: 'Mental assessment & psychosomatic stressors' },
      { name: '4. Gut health', targetId: 'gut-health', desc: 'Microbiome, digestion & gastrointestinal screening' },
      { name: '5. Nutritional Assessment', targetId: 'nutritional-assessment', desc: 'Dietary habits & clinical nutrition survey' },
      { name: '6. Micronutrient Assessment', targetId: 'micronutrient-assessment', desc: 'Vitamins, minerals & cofactors analysis' },
      { name: '7. Daily Routine', targetId: 'daily-routine', desc: 'Circadian rhythm & meal schedule tracking' },
      { name: '8. Food Frequency', targetId: 'food-frequency', desc: 'FFQ dietary recall & ingredient frequencies' },
      { name: '9. Cooking Methodology', targetId: 'cooking-methodology', desc: 'Preparation & therapeutic cooking techniques' },
      { name: '10. 24 Recall Method', targetId: '24-recall', desc: '24-hour food intake recall analysis' },
      { name: '11. Nutrition Gap', targetId: 'nutrition-gap', desc: 'ICMR 2024 macro/micronutrient deficit report' },
      { name: '12. Diet Domain', targetId: 'diet-domain', desc: 'Major clinical domains & diet selection' },
      { name: '13. Ingredient & Ayurveda', targetId: 'ingredient-ayurveda', desc: 'Herbs, spices, and integrative formulations' },
      { name: '14. Recipes Guidelines', targetId: 'recipes-guidelines', desc: 'Therapeutic food formulas & guidelines' },
      { name: '15. RDA Requirements', targetId: 'rda', desc: 'Patient-specific dynamic ICMR-NIN nutrient targets' },
      { name: '16. 7 Day Diet Plan', targetId: '7-day-diet-plan', desc: 'Day-by-day clinical meal plan studio' },
      { name: '17. Rx Prescription', targetId: 'rx-prescription', desc: 'Official Clinical Prescription & PDF letterhead' },
      { name: '18. History', targetId: 'nutrition-history', desc: 'All patient diet plan archives by date' },
    ],
  },
  {
    id: 'exercise',
    number: '05',
    title: 'Exercise',
    subtitle: 'Performance & Strength Metrics',
    icon: Dumbbell,
    tag: 'Performance',
    color: '#7A4F1D',
    subfolders: [
      { name: '7-Day Exercise Protocol', targetId: 'exercise', desc: 'Periodized cardio, resistance & mobility schedule' },
      { name: 'Strength & Mobility Score', targetId: 'fitness-guidelines', desc: 'Functional movement screening & strength targets' },
      { name: 'Zone 2 Cardio Tracking', targetId: 'fitness-guidelines', desc: 'Mitochondrial fitness & heart-rate training' },
      { name: 'Bioenergetics Protocol', targetId: 'exercise', desc: 'Athletic recovery & metabolic conditioning' },
    ],
  },
  {
    id: 'client-folder',
    number: '06',
    title: 'Client Folder',
    subtitle: 'Patient Dossier Directory & Visit Archive',
    icon: Folder,
    tag: 'Directory',
    color: '#8C5E28',
    subfolders: [
      { name: 'Encrypted Patient Vault', targetId: 'client-folder', desc: 'Secure AES-GCM-256 patient records repository' },
      { name: 'Search by Name / ID', targetId: 'client-folder', desc: 'Instant patient dossier lookup & filtering' },
      { name: 'Re-Edit Visit History', targetId: 'client-folder', desc: 'Past consultation logs & chronological visits' },
      { name: 'PDF Dossier Exports', targetId: 'client-folder', desc: 'Export full medical charts & summary packets' },
    ],
  },
  {
    id: 'whatsapp',
    number: '07',
    title: 'Whatsapp',
    subtitle: 'Direct Communication & Alerts',
    icon: MessageSquare,
    tag: 'Comms',
    color: '#059669',
    subfolders: [
      { name: 'WhatsApp Web Integration', targetId: 'whatsapp', desc: 'Live WhatsApp chat & direct synchronization' },
      { name: 'Direct Report Dispatch', targetId: 'whatsapp', desc: 'Transmit PDF prescription directly to patient' },
      { name: 'Broadcast Alerts & Reminders', targetId: 'whatsapp', desc: 'Appointment notices & meal adherence check-ins' },
      { name: 'AI Meal Photo Scoring', targetId: 'whatsapp', desc: 'Patient meal snapshot nutrition recognition' },
    ],
  },
];

export const MainFoldersDashboard: React.FC<MainFoldersDashboardProps> = ({
  onSelectFolder,
  onBackToFrontPage,
  onOpenSecuritySettings,
  patientName = 'Kiruthika',
  patientCondition = 'Metabolic Health & Sports Medicine',
  generalInfo,
  calculations,
  medicalHistory,
}) => {
  const [activeFolderId, setActiveFolderId] = useState<string>('profile');
  const activeFolder = MAIN_SEVEN_FOLDERS.find((f) => f.id === activeFolderId) || MAIN_SEVEN_FOLDERS[0];

  return (
    <div className="w-full min-h-[calc(100vh-70px)] p-1 sm:p-2 lg:p-3 flex flex-col space-y-3 animate-in fade-in duration-300 select-none">
      {/* Top Breadcrumb & Status Strip */}
      <div className="w-full bg-white/95 backdrop-blur-md border border-purple-200/80 rounded-xl px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7E22CE] text-white flex items-center justify-center font-black text-xs shadow-xs">
            EMR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase tracking-wider">
                Clinical Medical Records & Case Files
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase tracking-wider">
                7 Core Folders
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Patient:{' '}
              <span className="font-bold text-gray-900">{generalInfo?.name || patientName}</span> •{' '}
              <span className="text-purple-700 font-semibold">{generalInfo?.tag || generalInfo?.customTag || patientCondition}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSecuritySettings && (
            <button
              type="button"
              onClick={onOpenSecuritySettings}
              className="px-3 py-1.5 rounded-lg border border-purple-200 hover:border-purple-400 bg-purple-50/70 text-[11px] font-extrabold uppercase tracking-wider text-[#7E22CE] flex items-center gap-1.5 cursor-pointer transition-all hover:bg-purple-100"
              title="Security Settings & Passwords"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#7E22CE]" />
              <span>Security</span>
            </button>
          )}

          {onBackToFrontPage && (
            <button
              type="button"
              onClick={onBackToFrontPage}
              className="px-3.5 py-1.5 rounded-lg border border-purple-300 hover:border-[#7E22CE] bg-white text-[11px] font-black uppercase tracking-wider text-[#7E22CE] flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs hover:bg-purple-50"
            >
              <span>⌂</span>
              <span>Front Page</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MEDICAL CASE FILE LAYOUT: LEFT CORNER TABS + RIGHT WORKSPACE      */}
      {/* ========================================================================= */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT CORNER: 7 MEDICAL FOLDER INDEX TABS & DIRECT SUBHEADINGS             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-2 no-print">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#7E22CE]">
            <span>📁 Medical Folder Tabs (Corner Index)</span>
            <span>7 Folders</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
            {MAIN_SEVEN_FOLDERS.map((folder) => {
              const IconComp = folder.icon;
              const isActive = activeFolderId === folder.id;

              return (
                <div
                  key={folder.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isActive
                      ? 'border-[#7E22CE] bg-white shadow-md ring-2 ring-[#7E22CE]/20'
                      : 'border-purple-100/90 bg-white/90 hover:border-purple-300 hover:bg-white shadow-2xs'
                  }`}
                >
                  {/* Folder Tab Header */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFolderId(folder.id);
                    }}
                    className={`w-full p-2.5 flex items-center justify-between gap-2.5 text-left cursor-pointer transition-all ${
                      isActive ? 'bg-[#7E22CE] text-white' : 'bg-transparent text-gray-900 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Folder Number Badge */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono font-black text-xs transition-all ${
                          isActive
                            ? 'bg-white text-[#7E22CE] shadow-xs'
                            : 'bg-purple-100 text-[#7E22CE]'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider ${
                              isActive ? 'text-purple-200' : 'text-purple-600'
                            }`}
                          >
                            {folder.number}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider truncate ${
                            isActive ? 'text-purple-100' : 'text-gray-400'
                          }`}>
                            • {folder.tag}
                          </span>
                        </div>
                        <h3 className={`text-sm font-black uppercase tracking-wider leading-tight truncate ${
                          isActive ? 'text-white' : 'text-gray-950'
                        }`}>
                          {folder.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {folder.subfolders.length}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-white translate-x-0.5' : 'text-gray-300'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Direct Nested Subheadings (Like physical medical chart tab index) */}
                  {isActive && (
                    <div className="p-2 bg-purple-50/40 border-t border-purple-100 space-y-1">
                      <div className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#7E22CE]">
                        Subheadings & Workspaces:
                      </div>
                      <div className="space-y-0.5">
                        {folder.subfolders.map((sub, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectFolder(sub.targetId)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-800 hover:text-[#7E22CE] hover:bg-white hover:shadow-2xs border border-transparent hover:border-purple-200 transition-all flex items-center justify-between group cursor-pointer"
                            title={`Open ${sub.name}`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7E22CE] shrink-0" />
                              <span className="truncate">{sub.name}</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#7E22CE] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT AREA: ACTIVE MEDICAL FOLDER WORKSPACE DETAILS & SUBFOLDER DIRECTORY  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
          <div className="w-full h-full bg-white border border-purple-200/80 rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Top Folder Header Plate */}
            <div>
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#7E22CE] text-white flex items-center justify-center shadow-md shrink-0">
                    <activeFolder.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-[#7E22CE] font-mono text-[10px] font-black uppercase tracking-wider">
                        FOLDER {activeFolder.number}
                      </span>
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        {activeFolder.tag}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] uppercase tracking-tight leading-none">
                      {activeFolder.title} Folder
                    </h1>
                    <p className="text-xs sm:text-[13px] text-gray-600 font-medium mt-1">
                      {activeFolder.subtitle}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Case File Status
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Dossier
                  </span>
                </div>
              </div>

              {/* Subheadings Grid with Direct Open Actions */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7E22CE] flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>Included Medical Subheadings & Workspaces ({activeFolder.subfolders.length}):</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 hidden sm:inline">
                    Click any subfolder card to launch directly
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeFolder.subfolders.map((sub, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectFolder(sub.targetId)}
                      className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/20 hover:bg-purple-50/60 hover:border-[#7E22CE] transition-all cursor-pointer group shadow-2xs flex flex-col justify-between space-y-2 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#7E22CE] shrink-0" />
                          <h4 className="text-xs sm:text-[13px] font-black text-gray-900 uppercase tracking-tight group-hover:text-[#7E22CE] transition-colors">
                            {sub.name}
                          </h4>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#7E22CE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                      </div>

                      <p className="text-[11px] text-gray-500 font-normal leading-relaxed pl-4">
                        {sub.desc}
                      </p>

                      <div className="pt-1 flex items-center justify-end">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#7E22CE] group-hover:underline flex items-center gap-1">
                          Open Subfolder →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Primary Launch Button */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium">
                Tip: Use the corner index tabs on the left to quickly switch between all 7 medical folders.
              </div>

              <button
                type="button"
                id={`btn-launch-${activeFolder.id}`}
                onClick={() => onSelectFolder(activeFolder.id)}
                className="px-8 py-3.5 bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6B21A8] hover:to-[#7E22CE] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-md shadow-purple-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2.5"
              >
                <span>Launch {activeFolder.title} Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
