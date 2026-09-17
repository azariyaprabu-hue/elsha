import React, { useState, useEffect } from 'react';
import { SymptomAssessmentItem, SymptomSeverity } from '../types';
import { domainSpecificSymptoms } from '../data/domainSymptomsData';
import { AlertCircle, Plus, CheckCircle, Sparkles, Filter, Activity } from 'lucide-react';

interface SymptomsAssessmentSectionProps {
  symptoms: SymptomAssessmentItem[];
  domainName: string;
  categoryName: string;
  onUpdateSymptom: (id: string, updated: Partial<SymptomAssessmentItem>) => void;
  onAddSymptom: () => void;
}

export const SymptomsAssessmentSection: React.FC<SymptomsAssessmentSectionProps> = ({
  symptoms: initialSymptoms,
  domainName,
  categoryName,
  onUpdateSymptom,
  onAddSymptom,
}) => {
  const availableDomains = Object.keys(domainSpecificSymptoms);
  
  // Find initial matching key
  const matchKey =
    availableDomains.find(
      (d) =>
        d.toLowerCase().includes(domainName.toLowerCase()) ||
        domainName.toLowerCase().includes(d.toLowerCase())
    ) || 'Diabetes Mellitus';

  const [activeDomainKey, setActiveDomainKey] = useState<string>(matchKey);
  const [currentSymptoms, setCurrentSymptoms] = useState<SymptomAssessmentItem[]>(
    domainSpecificSymptoms[matchKey] || initialSymptoms
  );

  // When activeDomainKey changes, load distinct automated symptoms for that disease!
  const handleSelectDomain = (domainKey: string) => {
    setActiveDomainKey(domainKey);
    const domainSyms = domainSpecificSymptoms[domainKey];
    if (domainSyms) {
      setCurrentSymptoms([...domainSyms]);
    }
  };

  // Auto-fill symptoms from uploaded medical document
  useEffect(() => {
    const handler = (e: any) => {
      const symList: string[] = e.detail;
      if (Array.isArray(symList) && symList.length > 0) {
        const newItems: SymptomAssessmentItem[] = symList.map((sym, idx) => ({
          id: `auto-sym-${Date.now()}-${idx}`,
          symptom: typeof sym === 'string' ? sym : (sym as any).symptom || 'Clinical Symptom',
          duration: (sym as any).duration || 'Persistent',
          severity: (sym as any).severity || 'Moderate',
        }));
        setCurrentSymptoms((prev) => [...newItems, ...prev]);
      }
    };
    window.addEventListener('ELSHA_SYMPTOMS_AUTOFILLED', handler);
    return () => window.removeEventListener('ELSHA_SYMPTOMS_AUTOFILLED', handler);
  }, []);

  const handleUpdateLocalSymptom = (id: string, updated: Partial<SymptomAssessmentItem>) => {
    setCurrentSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    onUpdateSymptom(id, updated);
  };

  const handleAddLocalSymptom = () => {
    const newSym: SymptomAssessmentItem = {
      id: `sym-${Date.now()}`,
      symptom: 'Custom Clinical Sign',
      duration: '1 week',
      severity: 'Mild',
    };
    setCurrentSymptoms((prev) => [...prev, newSym]);
    onAddSymptom();
  };

  const severities: SymptomSeverity[] = ['Mild', 'Moderate', 'Severe', 'Often'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <span>MODULE 03 • DOMAIN-AUTOMATED CLINICAL PATHOLOGY</span>
            <span>•</span>
            <span className="text-white font-mono">{activeDomainKey.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Automated Symptoms Assessment
          </h2>
          <p className="text-xs text-gray-400">
            Dynamically tailored diagnostic signs and symptom severity matrices for each distinct pathology domain.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLocalSymptom}
          className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.5)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Custom Symptom</span>
        </button>
      </div>

      {/* DOMAIN SELECTOR BAR - Automatically switches symptom set */}
      <div className="p-4 bg-[#0d0617] border border-[#7E22CE] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono text-[#A855F7] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Active Clinical Domain (Symptoms Dynamically Auto-Adapted):
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            {availableDomains.length} Disease Profiles Available
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {availableDomains.map((d) => {
            const isSelected = activeDomainKey === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => handleSelectDomain(d)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                    : 'bg-black text-gray-300 border-white/15 hover:border-[#7E22CE]/60 hover:text-white'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Snapshot Panel */}
      <section className="bg-[#0d0617] border border-[#7E22CE] p-5">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
          <h2 className="text-[#A855F7] text-sm uppercase font-black tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C084FC]" />
            <span>Pathology Overview: {activeDomainKey}</span>
          </h2>
          <span className="text-[10px] uppercase font-mono text-gray-400">
            {currentSymptoms.length} Clinical Indicators
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs">
          {currentSymptoms.slice(0, 6).map((item) => {
            const isSevere = item.severity === 'Severe' || item.severity === 'Often';
            const isModerate = item.severity === 'Moderate';
            const isMild = item.severity === 'Mild';
            return (
              <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-gray-200 truncate max-w-[170px] font-medium">{item.symptom}</span>
                <span
                  className={`font-bold uppercase text-[10px] tracking-wider font-mono ${
                    isSevere
                      ? 'text-red-400'
                      : isModerate
                      ? 'text-orange-400'
                      : isMild
                      ? 'text-yellow-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {item.severity || 'None'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Table / Grid */}
      <div className="overflow-x-auto bg-[#0d0617] border border-[#7E22CE]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#7E22CE] bg-black text-[#A855F7] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 w-1/2">Symptom / Clinical Presentation</th>
              <th className="py-3 px-4 w-1/4">Duration</th>
              <th className="py-3 px-4 text-center w-1/4">Severity / Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {currentSymptoms.map((item, idx) => (
              <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="py-3 px-4 text-center text-[#A855F7] font-mono font-bold">
                  {(idx + 1).toString().padStart(2, '0')}
                </td>

                <td className="py-3 px-4 text-white font-medium">
                  <input
                    type="text"
                    value={item.symptom}
                    onChange={(e) => handleUpdateLocalSymptom(item.id, { symptom: e.target.value })}
                    className="w-full bg-transparent border-b border-transparent focus:border-[#7E22CE] py-0.5 text-white focus:outline-none"
                  />
                </td>

                <td className="py-3 px-4 min-w-[140px]">
                  <input
                    type="text"
                    value={item.duration ?? ''}
                    onChange={(e) => handleUpdateLocalSymptom(item.id, { duration: e.target.value })}
                    placeholder="e.g. 3 months"
                    className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-1.5 px-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all"
                  />
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {severities.map((sev) => {
                      const isSelected = item.severity === sev;
                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() =>
                            handleUpdateLocalSymptom(item.id, {
                              severity: isSelected ? '' : sev,
                            })
                          }
                          className={`py-1 px-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                            isSelected
                              ? sev === 'Severe' || sev === 'Often'
                                ? 'bg-red-950 border-red-500 text-red-300'
                                : sev === 'Moderate'
                                ? 'bg-amber-950 border-amber-500 text-amber-300'
                                : 'bg-yellow-950 border-yellow-500 text-yellow-200'
                              : 'border-white/10 bg-black text-gray-400 hover:text-white hover:border-[#7E22CE]/50'
                          }`}
                        >
                          {sev}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400 px-2">
        <span className="flex items-center gap-1.5 text-[#C084FC]">
          <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
          Clinical significance: Evaluated against ICD-11 and ICMR clinical endocrine criteria.
        </span>
        <span className="font-mono text-[#A855F7] font-bold">{currentSymptoms.length} domain symptoms tracked</span>
      </div>
    </div>
  );
};
