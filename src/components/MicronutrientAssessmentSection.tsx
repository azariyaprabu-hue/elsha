import React, { useState } from 'react';
import {
  initialMicronutrientQuestions,
  MicronutrientQuestion,
} from '../data/micronutrientQuestionsData';
import {
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Activity,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MicronutrientAssessmentSectionProps {
  selectedDomain?: string;
}

export const MicronutrientAssessmentSection: React.FC<MicronutrientAssessmentSectionProps> = ({
  selectedDomain = 'Diabetes Mellitus & Metabolic Syndrome',
}) => {
  const [questions, setQuestions] = useState<MicronutrientQuestion[]>(
    initialMicronutrientQuestions
  );
  const [activeNutrientFilter, setActiveNutrientFilter] = useState<string>('All');
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string>('All');

  const handleUpdateResponse = (
    id: string,
    response: string,
    severity: 'Severe Risk' | 'Moderate Risk' | 'Mild Risk' | 'Adequate' | ''
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            patientResponse: response,
            severity,
          };
        }
        return q;
      })
    );
  };

  const handleUpdateSubResponse = (id: string, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const newResponses: [string, string, string] = [
            q.patientResponses?.[0] ?? '',
            q.patientResponses?.[1] ?? '',
            q.patientResponses?.[2] ?? '',
          ];
          newResponses[index] = value;
          return {
            ...q,
            patientResponses: newResponses,
            patientResponse: newResponses.filter(Boolean).join(' | '),
          };
        }
        return q;
      })
    );
  };

  // Helper score calculator
  const getQuestionScore = (q: MicronutrientQuestion) => {
    if (q.severity === 'Adequate') return 10;
    if (q.severity === 'Mild Risk') return 7;
    if (q.severity === 'Moderate Risk') return 4;
    if (q.severity === 'Severe Risk') return 1;
    return 7;
  };

  const totalScore = Math.round(
    (questions.reduce((acc, q) => acc + getQuestionScore(q), 0) /
      (questions.length * 10)) *
      100
  );

  const severeDeficiencies = questions.filter((q) => q.severity === 'Severe Risk');
  const moderateDeficiencies = questions.filter((q) => q.severity === 'Moderate Risk');

  const categories = [
    'All',
    'Fat-Soluble',
    'Water-Soluble',
    'Major Mineral',
    'Trace Element',
    'Essential Lipid & Cofactor',
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchCategory =
      activeNutrientFilter === 'All' || q.category === activeNutrientFilter;
    const matchSeverity =
      activeSeverityFilter === 'All' || q.severity === activeSeverityFilter;
    return matchCategory && matchSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#C5A028] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#C5A028]">
            DIAGNOSTIC MODULE 05 • 30 SCIENTIFIC CLINICAL QUESTIONS
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Scientific Micronutrient Deficiency Assessment
          </h2>
          <p className="text-xs text-gray-400">
            Domain: <span className="text-[#C5A028] font-bold">{selectedDomain}</span> • Covers Vitamins D3, B12, Iron, Zinc, Magnesium, Folate, Chromium & Antioxidants.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#111] px-3 py-1.5 border border-[#C5A028] text-[#C5A028] font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>ICMR / NIN Biomarker Correlation</span>
        </div>
      </div>

      {/* SUMMARY SCORECARD */}
      <div className="bg-[#111] border border-[#C5A028] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest font-black text-[#C5A028]">
              Composite Micronutrient Sufficiency Score
            </span>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-white">
                {totalScore} <span className="text-sm font-normal opacity-60">/ 100</span>
              </div>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  totalScore >= 75
                    ? 'bg-emerald-500 text-black'
                    : totalScore >= 50
                    ? 'bg-[#C5A028] text-black'
                    : 'bg-red-500 text-white'
                }`}
              >
                {totalScore >= 75
                  ? 'Adequate Mineral & Vitamin Stores'
                  : totalScore >= 50
                  ? 'Subclinical Multiple Deficiencies'
                  : 'Critical Multi-Micronutrient Depletion'}
              </span>
            </div>
            <p className="text-xs text-gray-300 max-w-xl">
              Identified {severeDeficiencies.length} High-Urgency Deficiencies and{' '}
              {moderateDeficiencies.length} Moderate Insufficiencies requiring targeted food and nutraceutical repletion.
            </p>
          </div>

          {/* Meter Bar */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase">
              <span>Severe Depletion (0)</span>
              <span className="text-[#C5A028] font-bold">{totalScore}%</span>
              <span>Optimal (100)</span>
            </div>
            <div className="h-2 w-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-[#C5A028] transition-all duration-500"
                style={{ width: `${totalScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 font-mono uppercase tracking-wider">
              <span>Critical Depletion</span>
              <span>Borderline</span>
              <span>Replete</span>
            </div>
          </div>
        </div>

        {/* Highlighted Critical Deficiency Badges */}
        {severeDeficiencies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> High Deficiency Signals:
            </span>
            {severeDeficiencies.map((d, i) => (
              <span
                key={d.id}
                className="px-2 py-0.5 bg-red-950/60 border border-red-500/60 text-red-300 text-[10px] font-mono font-bold"
              >
                {d.nutrient}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-3 bg-[#111] border border-white/15 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-[#C5A028] font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveNutrientFilter(cat)}
              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                activeNutrientFilter === cat
                  ? 'bg-[#C5A028] text-black border-[#C5A028]'
                  : 'bg-black text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">
            Showing {filteredQuestions.length} of {questions.length} Questions
          </span>
        </div>
      </div>

      {/* 30 QUESTIONS MASTER TABLE WITH 3 QUESTIONS & 3 RESPONSE BOXES PER NUTRIENT */}
      <div className="overflow-x-auto bg-[#111] border border-[#C5A028]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#C5A028] bg-black text-[#C5A028] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3 w-48">Target Nutrient & Severity</th>
              <th className="py-3 px-4">3 Clinical Questions & 3 Response Input Boxes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-sans">
            {filteredQuestions.map((q, idx) => (
              <tr key={q.id} className="hover:bg-white/[0.03] transition-colors">
                {/* Number */}
                <td className="py-3 px-3 text-center text-[#C5A028] font-mono font-bold align-top pt-4">
                  {(idx + 1).toString().padStart(2, '0')}
                </td>

                {/* Target Nutrient & Severity */}
                <td className="py-3 px-3 align-top pt-4 space-y-2">
                  <div>
                    <div className="font-bold text-white text-xs">{q.nutrient}</div>
                    <div className="text-[9px] font-mono text-gray-400 uppercase mt-0.5">
                      {q.category}
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="text-[9px] uppercase font-mono text-gray-400 block mb-1">
                      Clinical Risk:
                    </label>
                    <select
                      value={q.severity}
                      onChange={(e) =>
                        handleUpdateResponse(
                          q.id,
                          q.patientResponse || '',
                          e.target.value as any
                        )
                      }
                      className={`w-full text-[10px] font-bold uppercase tracking-wider py-1 px-1.5 bg-black border focus:outline-none ${
                        q.severity === 'Adequate'
                          ? 'border-emerald-500 text-emerald-400'
                          : q.severity === 'Mild Risk'
                          ? 'border-yellow-500 text-yellow-400'
                          : q.severity === 'Moderate Risk'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-red-500 text-red-400'
                      }`}
                    >
                      <option value="Adequate">Adequate</option>
                      <option value="Mild Risk">Mild Risk</option>
                      <option value="Moderate Risk">Moderate Risk</option>
                      <option value="Severe Risk">Severe Risk</option>
                    </select>
                  </div>
                </td>

                {/* 3 Questions & 3 Response Boxes */}
                <td className="py-3 px-4 space-y-2.5">
                  <div className="space-y-2">
                    {(q.questions || [q.question || 'Clinical Question', 'Dietary Habitual Exposure', 'Cofactors & Interactions']).map((subQ, qIdx) => (
                      <div key={qIdx} className="bg-black/50 border border-white/10 p-2.5 rounded-lg space-y-1">
                        <div className="text-[11px] text-gray-200 font-medium flex items-start gap-1.5">
                          <span className="text-[#C5A028] font-mono font-bold shrink-0">
                            Q{qIdx + 1}:
                          </span>
                          <span className="leading-tight">{subQ}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pt-0.5">
                          <span className="text-[9px] font-mono text-[#A855F7] uppercase font-bold shrink-0">
                            Response {qIdx + 1}:
                          </span>
                          <input
                            type="text"
                            value={q.patientResponses?.[qIdx] ?? (qIdx === 0 ? q.patientResponse ?? '' : '')}
                            onChange={(e) => handleUpdateSubResponse(q.id, qIdx, e.target.value)}
                            placeholder={`Fill clinical answer for Question ${qIdx + 1}...`}
                            className="flex-1 bg-black border border-white/20 focus:border-[#C5A028] px-2.5 py-1 text-xs text-white focus:outline-none placeholder:text-gray-600 rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Significance & NIN Sources */}
                  <div className="pt-1 flex flex-col gap-1 border-t border-white/5">
                    <div className="text-[10.5px] text-gray-400 italic">
                      <span className="text-[#C5A028] font-bold not-italic">Clinical Significance: </span>
                      {q.clinicalSignificance}
                    </div>
                    <div className="text-[10.5px] text-emerald-400">
                      <span className="font-bold">NIN / ICMR Food Sources: </span>
                      {q.richFoodSources.join(', ')}
                    </div>
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
