import React, { useState } from 'react';
import { initialGutHealth40Questions, GutHealthQuestion40 } from '../data/gutHealth40QuestionsData';
import { BristolStoolChart } from './BristolStoolChart';
import { Activity, ShieldCheck, AlertTriangle, Layers, Info } from 'lucide-react';

export const GutHealthSection: React.FC = () => {
  const [questions, setQuestions] = useState<GutHealthQuestion40[]>(initialGutHealth40Questions);
  const [selectedBristolType, setSelectedBristolType] = useState<number>(2);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'All' | 'Oral Digestion' | 'Gastric & Intestinal Digestion' | 'Absorption & Gut Function' | 'Elimination & Microbiome'
  >('All');

  const handleUpdateResponse = (id: string, response: string, severity: 'Optimal' | 'Mild' | 'Moderate' | 'Severe') => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const impact = severity === 'Optimal' ? 10 : severity === 'Mild' ? 7 : severity === 'Moderate' ? 4 : 2;
          return { ...q, patientResponse: response, severity, scoreImpact: impact };
        }
        return q;
      })
    );
  };

  const handleSelectBristolType = (bristol: any) => {
    setSelectedBristolType(bristol.typeNumber);
    const qId = 'g-elim-31';
    const severity =
      bristol.typeNumber === 4
        ? 'Optimal'
        : bristol.typeNumber === 3
        ? 'Mild'
        : bristol.typeNumber === 2 || bristol.typeNumber === 5
        ? 'Moderate'
        : 'Severe';
    const impact = bristol.typeNumber === 4 ? 10 : bristol.typeNumber === 3 ? 8 : bristol.typeNumber === 2 ? 4 : 2;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              patientResponse: `${bristol.title} (${bristol.transitTime} transit)`,
              severity: severity,
              scoreImpact: impact,
            }
          : q
      )
    );
  };

  // Calculate scores across the 4 domains
  const categories = [
    'Oral Digestion',
    'Gastric & Intestinal Digestion',
    'Absorption & Gut Function',
    'Elimination & Microbiome',
  ] as const;

  const categoryScores = categories.map((cat) => {
    const catQs = questions.filter((q) => q.category === cat);
    const sum = catQs.reduce((acc, q) => acc + q.scoreImpact, 0);
    const avgScore = Math.round((sum / (catQs.length * 10)) * 100);
    return {
      category: cat,
      score: avgScore,
      count: catQs.length,
      status: avgScore >= 75 ? 'Optimal' : avgScore >= 50 ? 'Moderate Dysbiosis' : 'High Dysbiosis',
    };
  });

  const totalScore = Math.round(
    questions.reduce((acc, q) => acc + q.scoreImpact, 0) / (questions.length * 10) * 100
  );

  const overallRating =
    totalScore >= 75
      ? 'Optimal Gut Health'
      : totalScore >= 50
      ? 'Moderate Gastrointestinal Dysbiosis'
      : 'Severe Gut Barrier Dysfunction';

  const filteredQuestions =
    activeCategoryFilter === 'All'
      ? questions
      : questions.filter((q) => q.category === activeCategoryFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#C5A028] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#C5A028]">
            MODULE 07 • 40 SCIENTIFIC QUESTIONS • GASTROINTESTINAL & MICROBIOME PROFILE
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Scientific Gut Health Assessment
          </h2>
          <p className="text-xs text-gray-400">
            Structured 4-zone assessment: 10 Oral, 10 Gastric/Intestinal, 10 Absorption, 10 Elimination with Bristol Stool picture chart.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#111] px-3 py-1.5 border border-[#C5A028] text-[#C5A028] font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gut-Microbiome Axis Engine</span>
        </div>
      </div>

      {/* OVERALL GUT HEALTH SCORECARD */}
      <div className="bg-[#111] border border-[#C5A028] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest font-black text-[#C5A028]">
              Composite Gut Health Score (40 Scientific Markers)
            </span>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-white">
                {totalScore} <span className="text-sm font-normal opacity-60">/ 100</span>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                totalScore >= 75 ? 'bg-emerald-500 text-black' : totalScore >= 50 ? 'bg-[#C5A028] text-black' : 'bg-red-500 text-white'
              }`}>
                {overallRating}
              </span>
            </div>
            <p className="text-xs text-gray-300 max-w-xl font-medium">
              Evaluates mechanical mastication, gastric hydrochloric acid secretion, enterocyte brush border absorption, and colonic microbiome diversity.
            </p>
          </div>

          {/* Meter bar */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase">
              <span>Severe Dysbiosis (0)</span>
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
              <span>Severe</span>
              <span>Moderate</span>
              <span>Optimal</span>
            </div>
          </div>
        </div>

        {/* 4 ZONE BREAKDOWN CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          {categoryScores.map((cat, idx) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.category)}
              className={`p-3 text-left border transition-all cursor-pointer ${
                activeCategoryFilter === cat.category
                  ? 'bg-[#181814] border-[#C5A028] ring-1 ring-[#C5A028]'
                  : 'bg-black/60 border-white/10 hover:border-[#C5A028]/60'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Zone {idx + 1} (10 Qs)</span>
                <span className="font-bold text-white">{cat.score}%</span>
              </div>
              <div className="font-bold text-xs text-white mt-1 line-clamp-1">{cat.category}</div>
              <div className="mt-1 text-[10px] font-mono text-[#C5A028]">{cat.status}</div>
            </button>
          ))}
        </div>
      </div>


      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A028]/40 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase font-mono text-[#C5A028] font-bold mr-2">
            Filter Zone:
          </span>
          {(['All', ...categories] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                activeCategoryFilter === cat
                  ? 'bg-[#C5A028] text-black border-[#C5A028]'
                  : 'bg-[#111] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All 40 Questions' : cat}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-gray-400">
          Showing {filteredQuestions.length} Questions
        </span>
      </div>

      {/* 40 QUESTIONS TABLE */}
      <div className="overflow-x-auto bg-[#111] border border-[#C5A028]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#C5A028] bg-black text-[#C5A028] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3 w-32">Zone</th>
              <th className="py-3 px-4 w-1/2">Assessment Question & Clinical Rationale</th>
              <th className="py-3 px-4 w-1/4">Patient Response</th>
              <th className="py-3 px-3 text-center w-28">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-sans">
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-white/[0.03] transition-colors">
                {/* # */}
                <td className="py-3 px-3 text-center text-[#C5A028] font-mono font-bold">
                  {q.overallNumber.toString().padStart(2, '0')}
                </td>

                {/* Zone */}
                <td className="py-3 px-3 font-mono text-[10px] text-gray-400">
                  {q.category}
                </td>

                {/* Question & Clinical Rationale */}
                <td className="py-3 px-4">
                  <div className="text-white font-medium leading-snug">{q.question}</div>
                  <div className="text-[10px] text-gray-400 mt-1 italic leading-relaxed">
                    <span className="text-[#C5A028]">Mechanism:</span> {q.clinicalRationale}
                  </div>
                  {q.isStoolConsistencyQuestion && (
                    <div className="mt-1 text-[10px] text-emerald-400 font-bold">
                      📸 Picture Based: Linked to Bristol Stool Scale above (Type {selectedBristolType} Selected)
                    </div>
                  )}
                </td>

                {/* Patient Response */}
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={q.patientResponse}
                    onChange={(e) => handleUpdateResponse(q.id, e.target.value, q.severity)}
                    className="w-full bg-black/60 border border-white/20 focus:border-[#C5A028] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </td>

                {/* Severity Selector */}
                <td className="py-3 px-3 text-center">
                  <select
                    value={q.severity}
                    onChange={(e) => handleUpdateResponse(q.id, q.patientResponse, e.target.value as any)}
                    className={`w-full text-[10px] font-bold uppercase tracking-wider py-1 px-1 bg-black border focus:outline-none ${
                      q.severity === 'Optimal'
                        ? 'border-emerald-500 text-emerald-400'
                        : q.severity === 'Mild'
                        ? 'border-yellow-500 text-yellow-400'
                        : q.severity === 'Moderate'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-red-500 text-red-400'
                    }`}
                  >
                    <option value="Optimal">Optimal</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 40 QUESTIONS COMPLETION: VISUAL BRISTOL STOOL FORM SCALE AS SPECIFIED IN USER DRAWING */}
      <div className="pt-4 border-t-2 border-[#C5A028]/60">
        <BristolStoolChart
          selectedTypeNumber={selectedBristolType}
          onSelectType={handleSelectBristolType}
        />
      </div>
    </div>
  );
};
