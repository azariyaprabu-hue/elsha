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

  // Helper for Category Tag styling in Geometric Balance palette
  const getCategoryBadge = (tag?: NoteCategoryTag | string) => {
    switch (tag) {
      case 'Initial Assessment':
        return {
          label: 'Initial Assessment',
          bg: 'bg-[#C5A028]/20 text-[#f5d77f] border-[#C5A028]/60',
          dot: 'bg-[#C5A028]',
        };
      case 'Follow-up':
        return {
          label: 'Follow-up',
          bg: 'bg-white/10 text-white border-white/20',
          dot: 'bg-white',
        };
      case 'Dietary Adjustment':
        return {
          label: 'Dietary Adjustment',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-400',
        };
      case 'Glycemic & Lab Review':
        return {
          label: 'Glycemic & Lab Review',
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
          dot: 'bg-cyan-400',
        };
      case 'Acute / SOS':
        return {
          label: 'Acute / SOS',
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          dot: 'bg-rose-400',
        };
      default:
        return {
          label: tag || 'Consultation Note',
          bg: 'bg-[#111] text-gray-300 border-white/20',
          dot: 'bg-gray-400',
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
    const auditText = `[ELSHA CLINICAL NOTE AUDIT]\nSession: ${note.sessionDate} (${note.sessionTime})\nCategory: ${note.categoryTag || note.consultationType}\nType: ${note.consultationType}\nClinician: ${note.clinicianName}\nAdherence: ${note.patientAdherence}\nFasting Glucose: ${note.objectiveVitalsFindings.bloodGlucoseFasting || 'N/A'} mg/dL\nPP Glucose: ${note.objectiveVitalsFindings.bloodGlucosePostPrandial || 'N/A'} mg/dL\nStatus: AES-GCM Encrypted / Prescription Isolated`;
    navigator.clipboard.writeText(auditText);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="border-b-2 border-[#C5A028] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#C5A028]">
            MODULE 15 • INTERNAL METABOLIC GOVERNANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase mt-0.5">
            Clinical Notes & Observations
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs bg-[#111] px-3.5 py-1.5 border border-[#C5A028] text-[#C5A028] font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Prescription Isolated • E2EE Private</span>
          </div>
          <button
            type="button"
            onClick={handleCreateNewSession}
            className="py-1.5 px-4 bg-[#C5A028] text-black text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#d8b132] transition-colors flex items-center gap-1.5"
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
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#C5A028]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#C5A028]">
                Consultation History ({notes.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
              {patientName}
            </span>
          </div>

          {/* Filter & Sort Controls */}
          <div className="p-3 bg-[#111] border border-white/10 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Category Filter Dropdown */}
              <div>
                <label className="text-[9px] uppercase font-bold tracking-wider text-[#C5A028] flex items-center gap-1 mb-1">
                  <Filter className="w-3 h-3" /> Filter by Category
                </label>
                <select
                  id="category-filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-1.5 px-2 text-white text-[11px] font-bold focus:outline-none transition-all cursor-pointer"
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
                <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                  <ArrowUpDown className="w-3 h-3" /> Sort Notes
                </label>
                <select
                  id="category-sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-1.5 px-2 text-white text-[11px] font-bold focus:outline-none transition-all cursor-pointer"
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
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#C5A028] text-black border-[#C5A028]'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
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
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1 ${
                      isTagActive
                        ? 'bg-[#C5A028] text-black border-[#C5A028] font-black'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
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
                <Search className="w-3 h-3 text-gray-500 absolute left-2 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search observation notes..."
                  className="w-full bg-[#000000] border border-white/10 focus:border-[#C5A028] py-1 pl-7 pr-2 text-white text-[10px] focus:outline-none"
                />
              </div>

              {(selectedCategory !== 'ALL' || searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-2 py-1 bg-rose-950/40 text-rose-300 border border-rose-500/30 text-[9px] font-bold uppercase tracking-wider hover:bg-rose-900/60 cursor-pointer flex items-center gap-1"
                  title="Reset Filter"
                >
                  <X className="w-2.5 h-2.5" /> Reset
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 pt-0.5">
              <span>
                Showing <strong className="text-white">{filteredAndSortedNotes.length}</strong> of{' '}
                <strong className="text-white">{notes.length}</strong> notes
              </span>
              {selectedCategory !== 'ALL' && (
                <span className="text-[#C5A028] font-bold">
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
                  className={`p-4 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#181818] border-[#C5A028]'
                      : 'bg-[#111] border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Category Tag Header Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <Tag className="w-2.5 h-2.5" />
                      <span>{badge.label}</span>
                    </span>

                    <span
                      className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 ${
                        note.patientAdherence.includes('High')
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                          : note.patientAdherence.includes('Moderate')
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {note.patientAdherence.split(' ')[0]}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A028]" />
                    <span className="text-xs font-mono font-bold text-white tracking-wide">
                      {note.sessionDate}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {note.sessionTime}
                    </span>
                  </div>

                  {/* Consultation Type Headline */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A028] mb-1">
                    {note.consultationType}
                  </h4>

                  {/* Short Snippet */}
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {note.chiefComplaintsObservations || 'No observation notes recorded.'}
                  </p>

                  {/* Vitals Summary Pill */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <div>
                      FBS:{' '}
                      <span className="text-white font-bold">
                        {note.objectiveVitalsFindings.bloodGlucoseFasting || '--'}
                      </span>{' '}
                      mg/dL
                    </div>
                    <div>
                      PPBS:{' '}
                      <span className="text-white font-bold">
                        {note.objectiveVitalsFindings.bloodGlucosePostPrandial || '--'}
                      </span>{' '}
                      mg/dL
                    </div>
                    <div>
                      Wt:{' '}
                      <span className="text-white font-bold">
                        {note.objectiveVitalsFindings.currentWeight || '--'}
                      </span>{' '}
                      kg
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedNotes.length === 0 && (
              <div className="p-8 text-center bg-[#111] border border-white/10 text-gray-400 text-xs space-y-3">
                <p>No consultation notes found matching your filter criteria.</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="py-1 px-3 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase font-bold"
                  >
                    Clear Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewSession}
                    className="py-1 px-3 bg-[#C5A028] text-black hover:bg-[#d8b132] text-[10px] uppercase font-bold"
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
            <div className="bg-[#111] border border-[#C5A028] p-6 space-y-6">
              {/* Active Session Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#000000] border border-[#C5A028]">
                    <Stethoscope className="w-5 h-5 text-[#C5A028]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A028] font-bold">
                        Consultation Note Record • ID: {activeNote.id}
                      </span>
                      {(() => {
                        const activeBadge = getCategoryBadge(activeNote.categoryTag);
                        return (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${activeBadge.bg}`}
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {activeBadge.label}
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-base font-black uppercase text-white tracking-wider">
                      {activeNote.consultationType}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAudit(activeNote)}
                    className="p-2 bg-[#000000] border border-white/20 hover:border-[#C5A028] text-gray-300 hover:text-[#C5A028] text-xs transition-colors cursor-pointer"
                    title="Copy Clinical Audit Summary"
                  >
                    {copiedId === activeNote.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteNote(activeNote.id)}
                      className="p-2 bg-[#000000] border border-rose-500/30 hover:border-rose-500 text-rose-400 text-xs transition-colors cursor-pointer"
                      title="Delete this consultation record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Tag Selector Banner */}
              <div className="p-3 bg-[#000000] border border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#C5A028] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C5A028]" />
                    Consultation Category Tag
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">
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
                        className={`p-2 text-center text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelectedTag
                            ? `${badge.bg} border-2 font-black shadow-sm ring-1 ring-[#C5A028]`
                            : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
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
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#C5A028] block mb-1.5">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={activeNote.sessionDate ?? ''}
                    onChange={(e) => onUpdateNote(activeNote.id, { sessionDate: e.target.value })}
                    className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-2 px-3 text-white font-mono text-xs focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#C5A028] block mb-1.5">
                    Session Time
                  </label>
                  <input
                    type="text"
                    value={activeNote.sessionTime ?? ''}
                    onChange={(e) => onUpdateNote(activeNote.id, { sessionTime: e.target.value })}
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-2 px-3 text-white font-mono text-xs focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#C5A028] block mb-1.5">
                    Consultation Type
                  </label>
                  <select
                    value={activeNote.consultationType ?? 'Follow-up Consultation'}
                    onChange={(e) =>
                      onUpdateNote(activeNote.id, {
                        consultationType: e.target.value as ConsultationType,
                      })
                    }
                    className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-2 px-3 text-white text-xs font-bold uppercase tracking-wider focus:outline-none transition-all cursor-pointer"
                  >
                    {consultationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#C5A028] block mb-1.5">
                    Patient Adherence Rating
                  </label>
                  <select
                    value={activeNote.patientAdherence ?? 'High (80-100%)'}
                    onChange={(e) =>
                      onUpdateNote(activeNote.id, {
                        patientAdherence: e.target.value as PatientAdherenceLevel,
                      })
                    }
                    className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-2 px-3 text-white text-xs font-bold uppercase tracking-wider focus:outline-none transition-all cursor-pointer"
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
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#C5A028] block mb-1.5">
                  Attending Clinical Nutritionist
                </label>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#000000] border border-white/10 text-[#C5A028]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={activeNote.clinicianName ?? ''}
                    onChange={(e) => onUpdateNote(activeNote.id, { clinicianName: e.target.value })}
                    placeholder="e.g. Dr. Ananya / Lead Clinical Nutritionist"
                    className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] py-2 px-3 text-white text-xs font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Section 1: Objective Metabolic Vitals Matrix */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C5A028]" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#C5A028]">
                    Objective Metabolic Vitals (Consultation Day)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="p-3 bg-[#000000] border border-white/10 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">
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
                        className="w-full bg-transparent text-white font-mono font-bold text-sm focus:outline-none border-b border-white/20 focus:border-[#C5A028]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#000000] border border-white/10 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">
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
                        className="w-full bg-transparent text-white font-mono font-bold text-sm focus:outline-none border-b border-white/20 focus:border-[#C5A028]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#000000] border border-white/10 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">
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
                        className="w-full bg-transparent text-white font-mono font-bold text-sm focus:outline-none border-b border-white/20 focus:border-[#C5A028]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">mmHg</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#000000] border border-white/10 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">
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
                        className="w-full bg-transparent text-white font-mono font-bold text-sm focus:outline-none border-b border-white/20 focus:border-[#C5A028]"
                      />
                      <span className="text-[9px] text-gray-500 font-mono">kg</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#000000] border border-white/10 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">
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
                        className="w-full bg-transparent text-white font-mono font-bold text-sm focus:outline-none border-b border-white/20 focus:border-[#C5A028]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#000000] border border-white/10 space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">
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
                        className="w-full bg-transparent text-[#C5A028] font-mono font-bold text-sm focus:outline-none border-b border-white/20 focus:border-[#C5A028]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Subjective Observations & Patient Symptoms */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#C5A028]">
                    Subjective Patient Complaints & Behavioral Observations
                  </label>
                  {/* Rapid Template Injectors */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('chief', 'Energy levels improved post-lunch; somnolence reduced by 50%.')
                      }
                      className="px-2 py-0.5 bg-[#000000] border border-white/10 hover:border-[#C5A028] text-gray-400 hover:text-white transition-colors"
                    >
                      + Energy Improved
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('chief', 'Reports dawn phenomenon with waking dry mouth.')
                      }
                      className="px-2 py-0.5 bg-[#000000] border border-white/10 hover:border-[#C5A028] text-gray-400 hover:text-white transition-colors"
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
                  className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] p-3 text-white text-xs font-medium focus:outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Section 3: Dietary Compliance & Deviations */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#C5A028] block">
                  Dietary Protocol Adherence & Cravings Log
                </label>
                <textarea
                  rows={2}
                  value={activeNote.dietaryComplianceNotes ?? ''}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, { dietaryComplianceNotes: e.target.value })
                  }
                  placeholder="Document specific food protocol deviations, carbohydrate cravings, unlogged evening snacks, hydration consistency..."
                  className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] p-3 text-white text-xs font-medium focus:outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Section 4: PRIVATE NUTRITIONIST DIFFERENTIAL ASSESSMENT (Confidential) */}
              <div className="p-4 bg-[#000000] border-2 border-[#C5A028] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#C5A028]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#C5A028]">
                      Private Clinical Assessment & Differential Hypotheses
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-[#111] px-2 py-0.5 border border-[#C5A028] text-[#C5A028] uppercase tracking-wider">
                    STRICTLY CONFIDENTIAL • NOT ON PRESCRIPTION
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 italic">
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
                  className="w-full bg-black border border-white/20 focus:border-[#C5A028] p-3 text-white text-xs font-medium focus:outline-none transition-all leading-relaxed font-mono"
                />
              </div>

              {/* Section 5: Action Plan & Next Session Directives */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#C5A028]">
                    Internal Action Plan & Next Consultation Milestones
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('plan', 'Order fasting insulin and lipid profile before next review.')
                      }
                      className="px-2 py-0.5 bg-[#000000] border border-white/10 hover:border-[#C5A028] text-gray-400 hover:text-white transition-colors"
                    >
                      + Order Lab Profile
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleInsertTemplate('plan', 'Schedule 14-day follow-up consultation for CGM sensor review.')
                      }
                      className="px-2 py-0.5 bg-[#000000] border border-white/10 hover:border-[#C5A028] text-gray-400 hover:text-white transition-colors"
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
                  className="w-full bg-[#000000] border border-white/20 focus:border-[#C5A028] p-3 text-white text-xs font-medium focus:outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Bottom Quick Save & Encrypt Button */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#C5A028]" />
                  <span>
                    Last Encrypted Snapshot:{' '}
                    <strong className="text-white">
                      {activeNote.encryptedAt
                        ? new Date(activeNote.encryptedAt).toLocaleTimeString()
                        : 'Pending Sync'}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onSaveEncrypted}
                  className="py-2 px-5 bg-[#C5A028] text-black text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#d8b132] transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypt & Save Consultation Note</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#111] border border-white/10 p-12 text-center text-gray-400 text-xs">
              Select or create a consultation session to view notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
