import React, { useMemo } from 'react';
import { DietaryRecallItem, NutrientGapAnalysis } from '../types';
import { Clock, Plus, Trash2, Zap, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { calculateNutritionalTotalsAndGaps } from '../utils/nutritionalCalculator';

interface DietaryRecallSectionProps {
  recallItems: DietaryRecallItem[];
  nutrientGaps?: NutrientGapAnalysis;
  onUpdateRecall: (id: string, updated: Partial<DietaryRecallItem>) => void;
  onAddRecallRow: () => void;
  onDeleteRecallRow: (id: string) => void;
  onNavigateToGap?: () => void;
}

export const DietaryRecallSection: React.FC<DietaryRecallSectionProps> = ({
  recallItems,
  onUpdateRecall,
  onAddRecallRow,
  onDeleteRecallRow,
  onNavigateToGap,
}) => {
  // Real-time recalculated totals and nutrient gaps from the nutritionalCalculator utility
  const liveCalculation = useMemo(() => {
    return calculateNutritionalTotalsAndGaps(recallItems);
  }, [recallItems]);

  const { totals, macroRatios, gaps, summary } = liveCalculation;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            Module 14 • Chronological Nutrition Logging
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            24-Hour Dietary Recall Method
          </h2>
          <p className="text-xs text-gray-400">
            Log precise timing, ingredient proportions, and portion sizes to feed automated ICMR nutrient gap analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToGap && (
            <button
              type="button"
              onClick={onNavigateToGap}
              className="px-3 py-2 bg-black border border-[#7E22CE] text-[#C084FC] text-xs font-bold uppercase tracking-wider hover:bg-[#7E22CE] hover:text-white transition-all cursor-pointer"
            >
              <span>View Gap Analysis →</span>
            </button>
          )}
          <button
            type="button"
            onClick={onAddRecallRow}
            className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(126,34,206,0.5)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Meal Interval</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Recall Table */}
      <div className="overflow-x-auto bg-[#0d0617] border border-[#7E22CE]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#7E22CE] bg-black text-[#A855F7] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-4 w-1/4">Meal Time / Phase</th>
              <th className="py-3 px-4 w-1/2">Food Items & Ingredients Consumed</th>
              <th className="py-3 px-4 w-1/4">Portion / Household Measure</th>
              <th className="py-3 px-2 text-center w-12">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {recallItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-2.5 px-4">
                  <input
                    type="text"
                    value={item.mealTime ?? ''}
                    onChange={(e) => onUpdateRecall(item.id, { mealTime: e.target.value })}
                    className="w-full bg-black border border-white/20 text-white font-bold p-1.5 focus:border-[#7E22CE] focus:outline-none text-xs"
                    placeholder="e.g. 08:30 AM Breakfast"
                  />
                </td>
                <td className="py-2.5 px-4">
                  <input
                    type="text"
                    value={item.foodItemsConsumed ?? ''}
                    onChange={(e) => onUpdateRecall(item.id, { foodItemsConsumed: e.target.value })}
                    className="w-full bg-black border border-white/20 text-gray-200 p-1.5 focus:border-[#7E22CE] focus:outline-none text-xs"
                    placeholder="e.g. 3 Ragi Idlis + Sambar with drumstick & shallots"
                  />
                </td>
                <td className="py-2.5 px-4">
                  <input
                    type="text"
                    value={item.quantity ?? ''}
                    onChange={(e) => onUpdateRecall(item.id, { quantity: e.target.value })}
                    className="w-full bg-black border border-white/20 text-[#C084FC] p-1.5 focus:border-[#7E22CE] focus:outline-none text-xs font-mono"
                    placeholder="e.g. 150g idli, 1.5 katori sambar"
                  />
                </td>
                <td className="py-2.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => onDeleteRecallRow(item.id)}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Real-time Recalculated Totals & Nutrient Gaps Panel */}
      <div className="bg-[#0e071a] border border-[#7E22CE] p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C084FC] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Real-Time Recalculated Totals (Live Engine)
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#7E22CE]/30 border border-[#7E22CE] text-[#C084FC] font-mono">
              ICMR-NIN 2024
            </span>
          </div>
          <div className="text-[11px] text-gray-400">
            Overall Adequacy: <span className="font-bold text-white">{summary.overallAdequacyPct}%</span> | Critical Deficits: <span className="font-bold text-red-400">{summary.criticalDeficitsCount}</span>
          </div>
        </div>

        {/* Macro Totals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
          <div className="bg-black/60 border border-white/10 p-2.5">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Energy</span>
            <div className="text-lg font-black text-white mt-0.5">{totals.calories} <span className="text-[10px] font-normal text-gray-400">kcal</span></div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 1850</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Protein ({macroRatios.proteinPercent}%)</span>
            <div className="text-lg font-black text-white mt-0.5">{totals.protein} <span className="text-[10px] font-normal text-gray-400">g</span></div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 60g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Carbs ({macroRatios.carbsPercent}%)</span>
            <div className="text-lg font-black text-white mt-0.5">{totals.carbs} <span className="text-[10px] font-normal text-gray-400">g</span></div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 220g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Fats ({macroRatios.fatPercent}%)</span>
            <div className="text-lg font-black text-white mt-0.5">{totals.fat} <span className="text-[10px] font-normal text-gray-400">g</span></div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 45g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Fiber</span>
            <div className="text-lg font-black text-white mt-0.5">{totals.fiber} <span className="text-[10px] font-normal text-gray-400">g</span></div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 35g</span>
          </div>
          <div className="bg-black/60 border border-white/10 p-2.5">
            <span className="text-[9px] font-mono uppercase text-gray-400 block">Fluid / Water</span>
            <div className="text-lg font-black text-white mt-0.5">{totals.fluidLiters} <span className="text-[10px] font-normal text-gray-400">L</span></div>
            <span className="text-[9px] text-purple-300 font-mono">Target: 2.8L</span>
          </div>
        </div>

        {/* Real-time Nutrient Gaps Quick Bar */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Nutrient Gaps:</span>
            {gaps.slice(0, 6).map((gap) => (
              <span
                key={gap.id}
                className={`px-2 py-0.5 font-mono border text-[10px] flex items-center gap-1 ${
                  gap.status === 'Critical Deficit'
                    ? 'bg-red-950/50 border-red-500/50 text-red-300'
                    : gap.status === 'Moderate Deficit'
                    ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                    : 'bg-green-950/50 border-green-500/50 text-green-300'
                }`}
              >
                <span>{gap.nutrient}:</span>
                <span className="font-bold">{gap.gap > 0 ? `+${gap.gap}` : gap.gap}{gap.unit}</span>
                <span>({gap.adequacyPct}%)</span>
              </span>
            ))}
          </div>

          {onNavigateToGap && (
            <button
              type="button"
              onClick={onNavigateToGap}
              className="text-[11px] font-bold text-[#C084FC] hover:text-white underline transition-colors cursor-pointer"
            >
              Open Full 10-Nutrient Gap Analysis →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
