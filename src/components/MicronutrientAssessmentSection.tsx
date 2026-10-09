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
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="border-b-2 border-purple-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            DIAGNOSTIC MODULE 05 • 30 SCIENTIFIC CLINICAL QUESTIONS
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Scientific Micronutrient Deficiency Assessment
          </h2>
          <p className="text-xs text-gray-600">
            Domain: <span className="text-[#7E22CE] font-bold">{selectedDomain}</span> • Covers Vitamins D3, B12, Iron, Zinc, Magnesium, Folate, Chromium & Antioxidants.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-purple-50 px-3.5 py-1.5 border border-purple-200 text-[#7E22CE] font-bold uppercase tracking-wider rounded-lg">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>ICMR / NIN Biomarker Correlation</span>
        </div>
      </div>

      {/* SUMMARY SCORECARD */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest font-black text-[#7E22CE]">
              Composite Micronutrient Sufficiency Score
            </span>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-gray-950">
                {totalScore} <span className="text-sm font-normal opacity-60">/ 100</span>
              </div>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                  totalScore >= 75
                    ? 'bg-emerald-600 text-white'
                    : totalScore >= 50
                    ? 'bg-amber-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {totalScore >= 75
                  ? 'Adequate Mineral & Vitamin Stores'
                  : totalScore >= 50
                  ? 'Subclinical Multiple Deficiencies'
                  : 'Critical Multi-Micronutrient Depletion'}
              </span>
            </div>
            <p className="text-xs text-gray-700 max-w-xl">
              Identified {severeDeficiencies.length} High-Urgency Deficiencies and{' '}
              {moderateDeficiencies.length} Moderate Insufficiencies requiring targeted food and nutraceutical repletion.
            </p>
          </div>

          {/* Meter Bar */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase">
              <span>Severe Depletion (0)</span>
              <span className="text-[#7E22CE] font-bold">{totalScore}%</span>
              <span>Optimal (100)</span>
            </div>
            <div className="h-2.5 w-full bg-purple-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7E22CE] rounded-full transition-all duration-500"
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
          <div className="mt-4 pt-3 border-t border-purple-200 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-red-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> High Deficiency Signals:
            </span>
            {severeDeficiencies.map((d) => (
              <span
                key={d.id}
                className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 text-[10px] font-mono font-bold rounded"
              >
                {d.nutrient}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-3.5 bg-white border-2 border-purple-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-[#7E22CE] font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveNutrientFilter(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer border rounded-lg ${
                activeNutrientFilter === cat
                  ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-2xs'
                  : 'bg-purple-50 text-gray-700 border-purple-200 hover:border-[#7E22CE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 font-bold">
            Showing {filteredQuestions.length} of {questions.length} Questions
          </span>
        </div>
      </div>

      {/* 30 QUESTIONS MASTER TABLE WITH 3 QUESTIONS & 3 RESPONSE BOXES PER NUTRIENT */}
      <div className="overflow-x-auto bg-white border-2 border-purple-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-purple-200 bg-purple-100 text-purple-950 font-black tracking-widest uppercase text-[10px]">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3 w-48">Target Nutrient & Severity</th>
              <th className="py-3 px-4">3 Clinical Questions & 3 Response Input Boxes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100 font-sans">
            {filteredQuestions.map((q, idx) => (
              <tr key={q.id} className="hover:bg-purple-50/50 transition-colors">
                {/* Number */}
                <td className="py-3 px-3 text-center text-[#7E22CE] font-mono font-bold align-top pt-4">
                  {(idx + 1).toString().padStart(2, '0')}
                </td>

                {/* Target Nutrient & Severity */}
                <td className="py-3 px-3 align-top pt-4 space-y-2">
                  <div>
                    <div className="font-bold text-gray-950 text-xs">{q.nutrient}</div>
                    <div className="text-[9px] font-mono text-gray-500 uppercase mt-0.5">
                      {q.category}
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="text-[9px] uppercase font-mono text-gray-600 font-bold block mb-1">
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
                      className={`w-full text-[10px] font-bold uppercase tracking-wider py-1 px-1.5 bg-white border rounded-lg focus:outline-none ${
                        q.severity === 'Adequate'
                          ? 'border-emerald-500 text-emerald-800 bg-emerald-50'
                          : q.severity === 'Mild Risk'
                          ? 'border-yellow-500 text-yellow-800 bg-yellow-50'
                          : q.severity === 'Moderate Risk'
                          ? 'border-amber-500 text-amber-800 bg-amber-50'
                          : 'border-red-500 text-red-800 bg-red-50'
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
                      <div key={qIdx} className="bg-purple-50/70 border border-purple-200 p-2.5 rounded-lg space-y-1">
                        <div className="text-[11px] text-gray-900 font-medium flex items-start gap-1.5">
                          <span className="text-[#7E22CE] font-mono font-bold shrink-0">
                            Q{qIdx + 1}:
                          </span>
                          <span className="leading-tight">{subQ}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pt-0.5">
                          <span className="text-[9px] font-mono text-[#7E22CE] uppercase font-bold shrink-0">
                            Response {qIdx + 1}:
                          </span>
                          <input
                            type="text"
                            value={q.patientResponses?.[qIdx] ?? (qIdx === 0 ? q.patientResponse ?? '' : '')}
                            onChange={(e) => handleUpdateSubResponse(q.id, qIdx, e.target.value)}
                            placeholder={`Fill clinical answer for Question ${qIdx + 1}...`}
                            className="flex-1 bg-white border border-purple-200 focus:border-[#7E22CE] px-2.5 py-1 text-xs text-gray-950 focus:outline-none placeholder:text-gray-400 rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Significance & NIN Sources */}
                  <div className="pt-1 flex flex-col gap-1 border-t border-purple-100">
                    <div className="text-[10.5px] text-gray-600 italic">
                      <span className="text-[#7E22CE] font-bold not-italic">Clinical Significance: </span>
                      {q.clinicalSignificance}
                    </div>
                    <div className="text-[10.5px] text-emerald-800">
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
