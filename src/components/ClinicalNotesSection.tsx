import React, { useState, useMemo } from 'react';
import {
  ClinicalConsultationNote,
  ConsultationType,
  PatientAdherenceLevel,
  NoteCategoryTag,
} from '../types';
import {
  Lock,
  Calendar,
  User,
  Plus,
  Trash2,
  Activity,
  ClipboardList,
  EyeOff,
  Stethoscope,
  Copy,
  Check,
  Tag,
  Filter,
  ArrowUpDown,
  Search,
  X,
} from 'lucide-react';

interface ClinicalNotesSectionProps {
  notes: ClinicalConsultationNote[];
  patientName: string;
  onAddNote: (note: ClinicalConsultationNote) => void;
  onUpdateNote: (id: string, updated: Partial<ClinicalConsultationNote>) => void;
  onDeleteNote: (id: string) => void;
  onSaveEncrypted: () => void;
}

const CATEGORY_TAGS: NoteCategoryTag[] = [
  'Initial Assessment',
  'Follow-up',
  'Dietary Adjustment',
  'Glycemic & Lab Review',
  'Acute / SOS',
];

export const ClinicalNotesSection: React.FC<ClinicalNotesSectionProps> = ({
  notes,
  patientName,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onSaveEncrypted,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    notes.length > 0 ? notes[notes.length - 1].id : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'category' | 'newest' | 'oldest' | 'adherence'>('category');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active note or fallback
  const activeNote =
    notes.find((n) => n.id === selectedNoteId) || (notes.length > 0 ? notes[0] : null);

  const consultationTypes: ConsultationType[] = [
    'Initial Assessment',
    'Follow-up Consultation',
    'Glycemic & Lab Review',
    'Dietary Recalibration',
    'Acute / SOS Intervention',
  ];

  const adherenceLevels: PatientAdherenceLevel[] = [
    'High (80-100%)',
    'Moderate (50-79%)',
    'Low (<50%)',
    'Non-Compliant',
  ];

  // Helper for Category Tag styling in Pure White/Purple palette
  const getCategoryBadge = (tag?: NoteCategoryTag | string) => {
    switch (tag) {
      case 'Initial Assessment':
        return {
          label: 'Initial Assessment',
          bg: 'bg-purple-100 text-[#7E22CE] border-purple-300',
          dot: 'bg-[#7E22CE]',
        };
      case 'Follow-up':
        return {
          label: 'Follow-up',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-600',
        };
      case 'Dietary Adjustment':
        return {
          label: 'Dietary Adjustment',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
        };
      case 'Glycemic & Lab Review':
        return {
          label: 'Glycemic & Lab Review',
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-300',
          dot: 'bg-cyan-600',
        };
      case 'Acute / SOS':
        return {
          label: 'Acute / SOS',
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
        };
      default:
        return {
          label: tag || 'Consultation Note',
          bg: 'bg-purple-50 text-gray-700 border-purple-200',
          dot: 'bg-purple-600',
        };
    }
  };

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    // Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((n) => {
        const tag = n.categoryTag || (n.consultationType.includes('Initial') ? 'Initial Assessment' : 'Follow-up');
        return tag === selectedCategory;
      });
    }

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          (n.categoryTag && n.categoryTag.toLowerCase().includes(q)) ||
          n.consultationType.toLowerCase().includes(q) ||
          n.chiefComplaintsObservations.toLowerCase().includes(q) ||
          n.privateClinicalAssessment.toLowerCase().includes(q) ||
          n.sessionDate.includes(q) ||
          n.clinicianName.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortOrder === 'category') {
      result.sort((a, b) => {
        const catA = a.categoryTag || a.consultationType;
        const catB = b.categoryTag || b.consultationType;
        return catA.localeCompare(catB);
      });
    } else if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
    } else if (sortOrder === 'adherence') {
      result.sort((a, b) => a.patientAdherence.localeCompare(b.patientAdherence));
    }

    return result;
  }, [notes, selectedCategory, sortOrder, searchQuery]);

  const handleCreateNewSession = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultCategory: NoteCategoryTag =
      selectedCategory !== 'ALL' ? (selectedCategory as NoteCategoryTag) : 'Follow-up';

    const newNote: ClinicalConsultationNote = {
      id: `note-${Date.now()}`,
      sessionDate: today,
      sessionTime: timeStr,
      clinicianName: 'Dr. Ananya / Lead Clinical Nutritionist',
      consultationType:
        defaultCategory === 'Initial Assessment'
          ? 'Initial Assessment'
          : defaultCategory === 'Dietary Adjustment'
          ? 'Dietary Recalibration'
          : defaultCategory === 'Glycemic & Lab Review'
          ? 'Glycemic & Lab Review'
          : 'Follow-up Consultation',
      categoryTag: defaultCategory,
      patientAdherence: 'High (80-100%)',
      chiefComplaintsObservations: '',
      objectiveVitalsFindings: {
        bloodGlucoseFasting: '',
        bloodGlucosePostPrandial: '',
        bloodPressure: '120/80',
        currentWeight: '',
        ketonesLevel: 'Negative',
        hba1cEst: '',
      },
      dietaryComplianceNotes: '',
      privateClinicalAssessment: '',
      actionPlanNextSteps: '',
      isConfidential: true,
      encryptedAt: new Date().toISOString(),
    };

    onAddNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleInsertTemplate = (field: 'chief' | 'assessment' | 'plan', templateText: string) => {
    if (!activeNote) return;

    if (field === 'chief') {
      const current = activeNote.chiefComplaintsObservations || '';
      const updated = current ? `${current}\n• ${templateText}` : `• ${templateText}`;
      onUpdateNote(activeNote.id, { chiefComplaintsObservations: updated });
    } else if (field === 'assessment') {
      const current = activeNote.privateClinicalAssessment || '';
      const updated = current ? `${current}\n• ${templateText}` : `• ${templateText}`;
      onUpdateNote(activeNote.id, { privateClinicalAssessment: updated });
    } else if (field === 'plan') {
      const current = activeNote.actionPlanNextSteps || '';
      const updated = current ? `${current}\n• ${templateText}` : `• ${templateText}`;
      onUpdateNote(activeNote.id, { actionPlanNextSteps: updated });
    }
  };

  const handleCopyAudit = (note: ClinicalConsultationNote) => {
    const auditText = `[ŽIATHLON CLINICAL NOTE AUDIT]\nSession: ${note.sessionDate} (${note.sessionTime})\nCategory: ${note.categoryTag || note.consultationType}\nType: ${note.consultationType}\nClinician: ${note.clinicianName}\nAdherence: ${note.patientAdherence}\nFasting Glucose: ${note.objectiveVitalsFindings.bloodGlucoseFasting || 'N/A'} mg/dL\nPP Glucose: ${note.objectiveVitalsFindings.bloodGlucosePostPrandial || 'N/A'} mg/dL\nStatus: AES-GCM Encrypted / Prescription Isolated`;
    navigator.clipboard.writeText(auditText);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 text-gray-900">
      {/* Module Header */}
      <div className="border-b-2 border-purple-200 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            MODULE 15 • INTERNAL METABOLIC GOVERNANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Clinical Notes & Observations
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs bg-purple-50 px-3.5 py-1.5 border border-purple-200 text-[#7E22CE] font-bold uppercase tracking-wider rounded-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>Prescription Isolated • E2EE Private</span>
          </div>
          <button
            type="button"
            onClick={handleCreateNewSession}
            className="py-1.5 px-4 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#6b1dae] transition-colors flex items-center gap-1.5 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Session Timeline on Left, Detailed Session Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Consultation Sessions Timeline (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-200">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#7E22CE]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#7E22CE]">
                Consultation History ({notes.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-wider">
              {patientName}
            </span>
          </div>

          {/* Filter & Sort Controls */}
          <div className="p-3.5 bg-purple-50 border-2 border-purple-200 rounded-xl space-y-2.5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Category Filter Dropdown */}
              <div>
                <label className="text-[9px] uppercase font-bold tracking-wider text-[#7E22CE] flex items-center gap-1 mb-1">
                  <Filter className="w-3 h-3" /> Filter by Category
                </label>
                <select
                  id="category-filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-2 text-gray-950 text-[11px] font-bold focus:outline-none transition-all cursor-pointer rounded-lg"
                >
                  <option value="ALL">All Categories ({notes.length})</option>
                  {CATEGORY_TAGS.map((tag) => {
                    const count = notes.filter((n) => (n.categoryTag || (n.consultationType.includes('Initial') ? 'Initial Assessment' : 'Follow-up')) === tag).length;
                    return (
                      <option key={tag} value={tag}>
                        {tag} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Sort Order Dropdown */}
              <div>
                <label className="text-[9px] uppercase font-bold tracking-wider text-gray-600 flex items-center gap-1 mb-1">
                  <ArrowUpDown className="w-3 h-3" /> Sort Notes
                </label>
                <select
                  id="category-sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-2 text-gray-950 text-[11px] font-bold focus:outline-none transition-all cursor-pointer rounded-lg"
                >
                  <option value="category">Sort by: Category (A-Z)</option>
                  <option value="newest">Sort by: Newest Date</option>
                  <option value="oldest">Sort by: Oldest Date</option>
                  <option value="adherence">Sort by: Adherence</option>
                </select>
              </div>
            </div>

            {/* Quick-filter Tag Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded transition-colors cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                    : 'bg-white border-purple-200 text-gray-700 hover:text-gray-950 hover:border-[#7E22CE]'
                }`}
              >
                All ({notes.length})
              </button>
              {CATEGORY_TAGS.map((tag) => {
                const count = notes.filter((n) => (n.categoryTag || (n.consultationType.includes('Initial') ? 'Initial Assessment' : 'Follow-up')) === tag).length;
                const isTagActive = selectedCategory === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedCategory(tag)}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded transition-colors cursor-pointer flex items-center gap-1 ${
                      isTagActive
                        ? 'bg-[#7E22CE] text-white border-[#7E22CE] font-black'
                        : 'bg-white border-purple-200 text-gray-700 hover:text-gray-950 hover:border-[#7E22CE]'
                    }`}
                  >
                    <span>{tag}</span>
                    <span className="text-[8px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar & Active Filter Indicator */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-3 h-3 text-gray-400 absolute left-2 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search observation notes..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1 pl-7 pr-2 text-gray-950 text-[10px] focus:outline-none rounded-lg"
                />
              </div>

              {(selectedCategory !== 'ALL' || searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-2 py-1 bg-rose-50 text-rose-800 border border-rose-200 text-[9px] font-bold uppercase tracking-wider hover:bg-rose-100 cursor-pointer flex items-center gap-1 rounded"
                  title="Reset Filter"
                >
                  <X className="w-2.5 h-2.5" /> Reset
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-gray-600 pt-0.5">
              <span>
                Showing <strong className="text-gray-950">{filteredAndSortedNotes.length}</strong> of{' '}
                <strong className="text-gray-950">{notes.length}</strong> notes
              </span>
              {selectedCategory !== 'ALL' && (
                <span className="text-[#7E22CE] font-bold">
                  Filtered by: {selectedCategory}
                </span>
              )}
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2.5">
            {filteredAndSortedNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              const tagValue = note.categoryTag || (note.consultationType.includes('Initial') ? 'Initial Assessment' : 'Follow-up');
              const badge = getCategoryBadge(tagValue);

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-4 border-2 rounded-xl transition-all cursor-pointer relative shadow-2xs ${
                    isSelected
                      ? 'bg-purple-100/70 border-[#7E22CE] ring-1 ring-[#7E22CE]/30'
                      : 'bg-white border-purple-200 hover:border-[#7E22CE]'
                  }`}
                >
                  {/* Category Tag Header Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border rounded ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <Tag className="w-2.5 h-2.5" />
                      <span>{badge.label}</span>
                    </span>

                    <span
                      className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        note.patientAdherence.includes('High')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : note.patientAdherence.includes('Moderate')
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {note.patientAdherence?.split(' ')[0] || ''}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7E22CE]" />
                    <span className="text-xs font-mono font-bold text-gray-950 tracking-wide">
                      {note.sessionDate}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {note.sessionTime}
                    </span>
                  </div>

                  {/* Consultation Type Headline */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E22CE] mb-1">
                    {note.consultationType}
                  </h4>

                  {/* Short Snippet */}
                  <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {note.chiefComplaintsObservations || 'No observation notes recorded.'}
                  </p>

                  {/* Vitals Summary Pill */}
                  <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-[10px] font-mono text-gray-600">
                    <div>
                      FBS:{' '}
                      <span className="text-gray-950 font-bold">
                        {note.objectiveVitalsFindings.bloodGlucoseFasting || '--'}
                      </span>{' '}
                      mg/dL
                    </div>
                    <div>
                      PPBS:{' '}
                      <span className="text-gray-950 font-bold">
                        {note.objectiveVitalsFindings.bloodGlucosePostPrandial || '--'}
                      </span>{' '}
                      mg/dL
                    </div>
                    <div>
                      Wt:{' '}
                      <span className="text-gray-950 font-bold">
                        {note.objectiveVitalsFindings.currentWeight || '--'}
                      </span>{' '}
                      kg
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedNotes.length === 0 && (
              <div className="p-8 text-center bg-purple-50 border-2 border-purple-200 rounded-xl text-gray-600 text-xs space-y-3">
                <p>No consultation notes found matching your filter criteria.</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="py-1 px-3 bg-white border border-purple-200 hover:border-[#7E22CE] text-gray-800 text-[10px] uppercase font-bold rounded-lg"
                  >
                    Clear Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewSession}
                    className="py-1 px-3 bg-[#7E22CE] text-white hover:bg-[#6b1dae] text-[10px] uppercase font-bold rounded-lg"
                  >
                    + Create New Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Session Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeNote ? (
            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-xs space-y-6">
              {/* Active Session Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-[#7E22CE]">
                    <Stethoscope className="w-5 h-5 text-[#7E22CE]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E22CE] font-bold">
                        Consultation Note Record • ID: {activeNote.id}
                      </span>
                      {(() => {
                        const activeBadge = getCategoryBadge(activeNote.categoryTag);
                        return (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border rounded ${activeBadge.bg}`}
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {activeBadge.label}
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-base font-black uppercase text-gray-950 tracking-wider">
                      {activeNote.consultationType}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAudit(activeNote)}
                    className="p-2 bg-purple-50 border border-purple-200 hover:border-[#7E22CE] text-gray-700 hover:text-[#7E22CE] text-xs transition-colors cursor-pointer rounded-lg"
                    title="Copy Clinical Audit Summary"
                  >
                    {copiedId === activeNote.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteNote(activeNote.id)}
                      className="p-2 bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-600 text-xs transition-colors cursor-pointer rounded-lg"
                      title="Delete this consultation record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Tag Selector Banner */}
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#7E22CE] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#7E22CE]" />
                    Consultation Category Tag
                  </label>
                  <span className="text-[10px] text-gray-600 font-mono">
                    Select note classification tag for filtering & analytics
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {CATEGORY_TAGS.map((tag) => {
                    const isSelectedTag = (activeNote.categoryTag || 'Follow-up') === tag;
                    const badge = getCategoryBadge(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onUpdateNote(activeNote.id, { categoryTag: tag })}
                        className={`p-2 text-center text-xs font-bold uppercase tracking-wider border rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelectedTag
                            ? `${badge.bg} border-2 font-black shadow-xs ring-1 ring-[#7E22CE]`
                            : 'bg-white border-purple-200 text-gray-700 hover:text-gray-950 hover:border-[#7E22CE]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 text-[10px]">
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                          {tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Session Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7E22CE] block mb-1.5">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={activeNote.sessionDate ?? ''}
                    onChange={(e) => onUpdateNote(activeNote.id, { sessionDate: e.target.value })}
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-mono text-xs focus:outline-none transition-all rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7E22CE] block mb-1.5">
                    Session Time
                  </label>
                  <input
                    type="text"
                    value={activeNote.sessionTime ?? ''}
                    onChange={(e) => onUpdateNote(activeNote.id, { sessionTime: e.target.value })}
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 font-mono text-xs focus:outline-none transition-all rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7E22CE] block mb-1.5">
                    Consultation Type
                  </label>
                  <select
                    value={activeNote.consultationType ?? 'Follow-up Consultation'}
                    onChange={(e) =>
                      onUpdateNote(activeNote.id, {
                        consultationType: e.target.value as ConsultationType,
                      })
                    }
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 text-xs font-bold uppercase tracking-wider focus:outline-none transition-all cursor-pointer rounded-lg"
                  >
                    {consultationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7E22CE] block mb-1.5">
                    Patient Adherence Rating
                  </label>
                  <select
                    value={activeNote.patientAdherence ?? 'High (80-100%)'}
                    onChange={(e) =>
                      onUpdateNote(activeNote.id, {
                        patientAdherence: e.target.value as PatientAdherenceLevel,
                      })
                    }
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 text-xs font-bold uppercase tracking-wider focus:outline-none transition-all cursor-pointer rounded-lg"
                  >
                    {adherenceLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clinician Attending Name */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#7E22CE] block mb-1.5">
                  Attending Clinical Nutritionist
                </label>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 border border-purple-200 text-[#7E22CE] rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={activeNote.clinicianName ?? ''}
                    onChange={(e) => onUpdateNote(activeNote.id, { clinicianName: e.target.value })}
                    placeholder="e.g. Dr. Ananya / Lead Clinical Nutritionist"
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-gray-950 text-xs font-medium focus:outline-none transition-all rounded-lg"
                  />
                </div>
              </div>

              {/* Section 1: Objective Metabolic Vitals Matrix */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#7E22CE]" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#7E22CE]">
                    Objective Metabolic Vitals (Consultation Day)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 font-bold block">
                      Fasting Glucose
                    </span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={activeNote.objectiveVitalsFindings.bloodGlucoseFasting ?? ''}
                        onChange={(e) =>
                          onUpdateNote(activeNote.id, {
                            objectiveVitalsFindings: {
                              ...activeNote.objectiveVitalsFindings,
                              bloodGlucoseFasting: e.target.value,
                            },
                          })
                        }
                        placeholder="126"
                        className="w-full bg-transparent text-gray-950 font-mono font-bold text-sm focus:outline-none border-b border-purple-300 focus:border-[#7E22CE]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 font-bold block">
                      Post-Prandial (2H)
                    </span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={activeNote.objectiveVitalsFindings.bloodGlucosePostPrandial ?? ''}
                        onChange={(e) =>
                          onUpdateNote(activeNote.id, {
                            objectiveVitalsFindings: {
                              ...activeNote.objectiveVitalsFindings,
                              bloodGlucosePostPrandial: e.target.value,
                            },
                          })
                        }
                        placeholder="168"
                        className="w-full bg-transparent text-gray-950 font-mono font-bold text-sm focus:outline-none border-b border-purple-300 focus:border-[#7E22CE]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 font-bold block">
                      Blood Pressure
                    </span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={activeNote.objectiveVitalsFindings.bloodPressure ?? ''}
                        onChange={(e) =>
                          onUpdateNote(activeNote.id, {
                            objectiveVitalsFindings: {
                              ...activeNote.objectiveVitalsFindings,
                              bloodPressure: e.target.value,
                            },
                          })
                        }
                        placeholder="120/80"
                        className="w-full bg-transparent text-gray-950 font-mono font-bold text-sm focus:outline-none border-b border-purple-300 focus:border-[#7E22CE]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">mmHg</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 font-bold block">
                      Current Weight
                    </span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={activeNote.objectiveVitalsFindings.currentWeight ?? ''}
                        onChange={(e) =>
                          onUpdateNote(activeNote.id, {
                            objectiveVitalsFindings: {
                              ...activeNote.objectiveVitalsFindings,
                              currentWeight: e.target.value,
                            },
                          })
                        }
                        placeholder="61.5"
                        className="w-full bg-transparent text-gray-950 font-mono font-bold text-sm focus:outline-none border-b border-purple-300 focus:border-[#7E22CE]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">kg</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 font-bold block">
                      Ketones Status
                    </span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={activeNote.objectiveVitalsFindings.ketonesLevel ?? ''}
                        onChange={(e) =>
                          onUpdateNote(activeNote.id, {
                            objectiveVitalsFindings: {
                              ...activeNote.objectiveVitalsFindings,
                              ketonesLevel: e.target.value,
                            },
                          })
                        }
                        placeholder="Neg"
                        className="w-full bg-transparent text-gray-950 font-mono font-bold text-sm focus:outline-none border-b border-purple-300 focus:border-[#7E22CE]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 font-bold block">
                      Estimated HbA1c
                    </span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={activeNote.objectiveVitalsFindings.hba1cEst ?? ''}
                        onChange={(e) =>
                          onUpdateNote(activeNote.id, {
                            objectiveVitalsFindings: {
                              ...activeNote.objectiveVitalsFindings,
                              hba1cEst: e.target.value,
                            },
                          })
                        }
                        placeholder="7.2%"
                        className="w-full bg-transparent text-[#7E22CE] font-mono font-bold text-sm focus:outline-none border-b border-purple-300 focus:border-[#7E22CE]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Subjective Observations & Patient Symptoms */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#7E22CE]">
                    Subjective Patient Complaints & Behavioral Observations
                  </label>
                  {/* Rapid Template Injectors */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('chief', 'Energy levels improved post-lunch; somnolence reduced by 50%.')
                      }
                      className="px-2 py-0.5 bg-purple-50 border border-purple-200 hover:border-[#7E22CE] text-gray-700 hover:text-gray-950 transition-colors rounded"
                    >
                      + Energy Improved
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('chief', 'Reports dawn phenomenon with waking dry mouth.')
                      }
                      className="px-2 py-0.5 bg-purple-50 border border-purple-200 hover:border-[#7E22CE] text-gray-700 hover:text-gray-950 transition-colors rounded"
                    >
                      + Dawn Spike
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={activeNote.chiefComplaintsObservations ?? ''}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, { chiefComplaintsObservations: e.target.value })
                  }
                  placeholder="Record patient-reported symptom trends, energy dips, bowel motility changes, sleep quality, and exercise tolerance..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] p-3 text-gray-950 text-xs font-medium focus:outline-none transition-all leading-relaxed rounded-xl"
                />
              </div>

              {/* Section 3: Dietary Compliance & Deviations */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#7E22CE] block">
                  Dietary Protocol Adherence & Cravings Log
                </label>
                <textarea
                  rows={2}
                  value={activeNote.dietaryComplianceNotes ?? ''}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, { dietaryComplianceNotes: e.target.value })
                  }
                  placeholder="Document specific food protocol deviations, carbohydrate cravings, unlogged evening snacks, hydration consistency..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] p-3 text-gray-950 text-xs font-medium focus:outline-none transition-all leading-relaxed rounded-xl"
                />
              </div>

              {/* Section 4: PRIVATE NUTRITIONIST DIFFERENTIAL ASSESSMENT (Confidential) */}
              <div className="p-4 bg-purple-50/70 border-2 border-purple-300 rounded-xl space-y-3 relative shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#7E22CE]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#7E22CE]">
                      Private Clinical Assessment & Differential Hypotheses
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-white px-2 py-0.5 border border-purple-300 text-[#7E22CE] uppercase tracking-wider rounded">
                    STRICTLY CONFIDENTIAL • NOT ON PRESCRIPTION
                  </span>
                </div>

                <p className="text-[11px] text-gray-600 italic">
                  Use this space for internal diagnostic considerations, behavioral psychology notes,
                  insulin resistance progression hypotheses, and guidance for future consultations.
                </p>

                <textarea
                  rows={4}
                  value={activeNote.privateClinicalAssessment ?? ''}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, { privateClinicalAssessment: e.target.value })
                  }
                  placeholder="Enter private nutritionist assessment (e.g. GLUT4 responsiveness, cortisol-driven evening snacking, psychological resistance to carbohydrate restrictions)..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] p-3 text-gray-950 text-xs font-medium focus:outline-none transition-all leading-relaxed font-mono rounded-xl"
                />
              </div>

              {/* Section 5: Action Plan & Next Session Directives */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#7E22CE]">
                    Internal Action Plan & Next Consultation Milestones
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('plan', 'Order fasting insulin and lipid profile before next review.')
                      }
                      className="px-2 py-0.5 bg-purple-50 border border-purple-200 hover:border-[#7E22CE] text-gray-700 hover:text-gray-950 transition-colors rounded"
                    >
                      + Order Lab Profile
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('plan', 'Schedule 14-day follow-up consultation for CGM sensor review.')
                      }
                      className="px-2 py-0.5 bg-purple-50 border border-purple-200 hover:border-[#7E22CE] text-gray-700 hover:text-gray-950 transition-colors rounded"
                    >
                      + Follow-up 14 Days
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={activeNote.actionPlanNextSteps ?? ''}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, { actionPlanNextSteps: e.target.value })
                  }
                  placeholder="1. Targeted micro-adjustments before next visit&#10;2. Lab profile requisitions&#10;3. Follow-up consultation target date..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] p-3 text-gray-950 text-xs font-medium focus:outline-none transition-all leading-relaxed rounded-xl"
                />
              </div>

              {/* Bottom Quick Save & Encrypt Button */}
              <div className="pt-4 border-t border-purple-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-gray-600 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#7E22CE]" />
                  <span>
                    Last Encrypted Snapshot:{' '}
                    <strong className="text-gray-950 font-bold">
                      {activeNote.encryptedAt
                        ? new Date(activeNote.encryptedAt).toLocaleTimeString()
                        : 'Pending Sync'}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onSaveEncrypted}
                  className="py-2 px-5 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#6b1dae] transition-colors flex items-center gap-2 rounded-xl shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypt & Save Consultation Note</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-12 text-center text-gray-600 text-xs">
              Select or create a consultation session to view notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
