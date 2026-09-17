import React from 'react';
import { LifestyleAssessmentItem, LifestyleAssessmentRating } from '../types';
import { Clock, Info, Activity } from 'lucide-react';

interface LifestyleAssessmentSectionProps {
  lifestyleItems: LifestyleAssessmentItem[];
  onUpdateItem: (id: string, updated: Partial<LifestyleAssessmentItem>) => void;
}

export const LifestyleAssessmentSection: React.FC<LifestyleAssessmentSectionProps> = ({
  lifestyleItems,
  onUpdateItem,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            Module 07 • Behavioral Diagnostics
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Lifestyle Assessment
          </h2>
          <p className="text-xs text-gray-400">
            Systematic survey of sleep architecture, stress levels, physical activity, and environmental factors.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#A855F7] bg-[#0d0617] px-3.5 py-1.5 border border-[#7E22CE]">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-bold uppercase tracking-wider">Patient Verbatim + Clinical Rating</span>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3.5 bg-[#0d0617] border border-[#7E22CE]/60 flex items-start gap-2.5 text-xs text-gray-300">
        <Info className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
        <div>
          <span className="text-[#C084FC] font-bold">Clinical Recording Protocol: </span>
          The middle column captures the patient's verbatim statement (e.g.,{' '}
          <span className="text-white italic">"6.5 hours broken sleep, waking at 3am"</span>,{' '}
          <span className="text-white italic">"30 minutes walking 4 days/week"</span>), while the third column records the clinician's rated classification.
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#0d0617] border border-[#7E22CE]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#7E22CE] bg-black text-[#A855F7] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-4 font-bold w-1/4">Lifestyle Factor</th>
              <th className="py-3 px-4 font-bold w-1/2">Patient Response (Verbatim)</th>
              <th className="py-3 px-4 font-bold text-center w-1/4">Clinical Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {lifestyleItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 text-white font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-[#A855F7] font-mono text-[10px] w-4">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span>{item.factor}</span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={item.patientResponse ?? ''}
                    onChange={(e) => onUpdateItem(item.id, { patientResponse: e.target.value })}
                    placeholder="Enter patient's actual statement..."
                    className="w-full bg-black border border-white/20 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all"
                  />
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    {item.assessmentOptions.map((opt) => {
                      const isSelected = item.assessment === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onUpdateItem(item.id, { assessment: opt })}
                          className={`inline-flex items-center gap-1 py-1 px-2.5 border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? opt === 'Good'
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                : opt === 'Moderate'
                                ? 'bg-amber-950 border-amber-500 text-amber-300'
                                : 'bg-red-950 border-red-500 text-red-300'
                              : 'border-white/20 bg-black text-gray-400 hover:border-[#7E22CE]'
                          }`}
                        >
                          <span>{opt}</span>
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
    </div>
  );
};
