import React, { useState, useMemo } from 'react';
import {
  Scale,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Info,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { DietaryRecallItem, GeneralInfo } from '../types';
import { calculateNutritionalTotalsAndGaps } from '../utils/nutritionalCalculator';

export interface NutrientGapItem {
  id: string;
  nutrient: string;
  unit: string;
  icmrRda: number;
  actualIntake: number;
  gap: number;
  adequacyPct: number;
  status: 'Critical Deficit' | 'Moderate Deficit' | 'Optimal' | 'Excess';
  clinicalRisk: string;
  correctiveFoods: string[];
}

export const initialNutrientGapsData: NutrientGapItem[] = [
  {
    id: 'ng-1',
    nutrient: 'Total Energy',
    unit: 'kcal',
    icmrRda: 1850,
    actualIntake: 1480,
    gap: -370,
    adequacyPct: 80,
    status: 'Moderate Deficit',
    clinicalRisk: 'Energy restriction causing afternoon cognitive fatigue and muscle catabolism.',
    correctiveFoods: ['Soaked almonds', 'Pumpkin seeds', 'Brown rice', 'Ragi mudde'],
  },
  {
    id: 'ng-2',
    nutrient: 'Total Protein',
    unit: 'g',
    icmrRda: 60,
    actualIntake: 38,
    gap: -22,
    adequacyPct: 63,
    status: 'Critical Deficit',
    clinicalRisk: 'Loss of lean skeletal muscle mass, blunted satiety, insulin resistance exacerbation.',
    correctiveFoods: ['Sprouted green moong', 'Sattu flour', 'Paneer / Tofu', 'Egg whites', 'Edamame'],
  },
  {
    id: 'ng-3',
    nutrient: 'Dietary Fiber',
    unit: 'g',
    icmrRda: 35,
    actualIntake: 16,
    gap: -19,
    adequacyPct: 45,
    status: 'Critical Deficit',
    clinicalRisk: 'Rapid glycemic spikes, impaired short-chain fatty acid (SCFA) production, constipation.',
    correctiveFoods: ['Isabgol (Psyllium husk)', 'Flaxseeds', 'Methi leaves', 'Guava', 'Raw salads'],
  },
  {
    id: 'ng-4',
    nutrient: 'Elemental Iron',
    unit: 'mg',
    icmrRda: 19,
    actualIntake: 9,
    gap: -10,
    adequacyPct: 47,
    status: 'Critical Deficit',
    clinicalRisk: 'Subclinical microcytic anemia, cold extremities, impaired cellular oxygenation.',
    correctiveFoods: ['Garden cress seeds (Aliv)', 'Black raisins soaked', 'Beetroot juice', 'Spinach (Palak)'],
  },
  {
    id: 'ng-5',
    nutrient: 'Calcium',
    unit: 'mg',
    icmrRda: 1000,
    actualIntake: 540,
    gap: -460,
    adequacyPct: 54,
    status: 'Moderate Deficit',
    clinicalRisk: 'Bone mineral loss, osteopenia risk, muscle twitching / nocturnal leg cramps.',
    correctiveFoods: ['Ragi (Finger millet)', 'White sesame seeds (Til)', 'Curd / Yogurt', 'Moringa leaves'],
  },
  {
    id: 'ng-6',
    nutrient: 'Vitamin B12 (Cobalamin)',
    unit: 'mcg',
    icmrRda: 2.5,
    actualIntake: 0.8,
    gap: -1.7,
    adequacyPct: 32,
    status: 'Critical Deficit',
    clinicalRisk: 'Diabetic peripheral neuropathy, tingling sensations, elevated homocysteine (vascular risk).',
    correctiveFoods: ['Fortified nutritional yeast', 'Cultured Greek yogurt', 'Desi cow milk / A2 paneer', 'Eggs'],
  },
  {
    id: 'ng-7',
    nutrient: 'Vitamin D3',
    unit: 'IU',
    icmrRda: 800,
    actualIntake: 150,
    gap: -650,
    adequacyPct: 19,
    status: 'Critical Deficit',
    clinicalRisk: 'Impaired pancreatic beta-cell insulin secretion, generalized myalgia, weakened immunity.',
    correctiveFoods: ['Sun-exposed wild mushrooms', 'Fortified almond milk', 'Egg yolk', 'Weekly medical repletion'],
  },
  {
    id: 'ng-8',
    nutrient: 'Magnesium',
    unit: 'mg',
    icmrRda: 380,
    actualIntake: 210,
    gap: -170,
    adequacyPct: 55,
    status: 'Moderate Deficit',
    clinicalRisk: 'Insulin receptor desensitization, vascular constriction, sleep latency.',
    correctiveFoods: ['Pumpkin seeds', 'Almonds', 'Raw cacao nibs', 'Amaranth greens', 'Chia seeds'],
  },
  {
    id: 'ng-9',
    nutrient: 'Potassium',
    unit: 'mg',
    icmrRda: 3500,
    actualIntake: 2200,
    gap: -1300,
    adequacyPct: 62,
    status: 'Moderate Deficit',
    clinicalRisk: 'Altered Na:K balance leading to elevated systolic pressure and arterial stiffness.',
    correctiveFoods: ['Coconut water', 'Raw banana stem juice', 'Sweet potato', 'Spinach', 'Muskmelon'],
  },
  {
    id: 'ng-10',
    nutrient: 'Fluid / Water Intake',
    unit: 'L',
    icmrRda: 2.8,
    actualIntake: 1.6,
    gap: -1.2,
    adequacyPct: 57,
    status: 'Moderate Deficit',
    clinicalRisk: 'Reduced glomerular filtration rate, dry mucous membranes, false hunger pangs.',
    correctiveFoods: ['Jeera water', 'Buttermilk with mint & ginger', 'Infused cucumber water'],
  },
];

export interface NutritionalGapSectionProps {
  onNavigateToRecall?: () => void;
  dietaryRecall?: DietaryRecallItem[];
  generalInfo?: GeneralInfo;
  calculatedGaps?: NutrientGapItem[];
}

export const NutritionalGapSection: React.FC<NutritionalGapSectionProps> = ({
  onNavigateToRecall,
  dietaryRecall,
  generalInfo,
  calculatedGaps,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [dataSource, setDataSource] = useState<'recall' | 'reference'>(
    dietaryRecall && dietaryRecall.length > 0 ? 'recall' : 'reference'
  );

  // Real-time recalculated nutrient gaps from nutritionalCalculator
  const liveCalculation = useMemo(() => {
    if (!dietaryRecall || dietaryRecall.length === 0) return null;
    return calculateNutritionalTotalsAndGaps(dietaryRecall, { generalInfo });
  }, [dietaryRecall, generalInfo]);

  // Determine active item set
  const items: NutrientGapItem[] = useMemo(() => {
    if (calculatedGaps && calculatedGaps.length > 0) {
      return calculatedGaps;
    }
    if (dataSource === 'recall' && liveCalculation) {
      return liveCalculation.gaps;
    }
    return initialNutrientGapsData;
  }, [calculatedGaps, dataSource, liveCalculation]);

  const criticalGapsCount = items.filter((i) => i.status === 'Critical Deficit').length;
  const moderateGapsCount = items.filter((i) => i.status === 'Moderate Deficit').length;

  const averageAdequacy = Math.round(
    items.reduce((acc, curr) => acc + curr.adequacyPct, 0) / (items.length || 1)
  );

  const filteredItems = items.filter((i) => {
    if (filterStatus === 'All') return true;
    return i.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Scale className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 15 • 24-HR RECALL VS ICMR-NIN RDA 2024 ADEQUACY</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Nutritional Gap & Deficit Analysis
          </h2>
          <p className="text-xs text-gray-400">
            Real-time biometric gap comparison between actual 24-hour dietary intake and scientific clinical targets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {dietaryRecall && dietaryRecall.length > 0 && (
            <div className="flex items-center border border-[#7E22CE] bg-black p-1 text-xs">
              <button
                type="button"
                onClick={() => setDataSource('recall')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  dataSource === 'recall'
                    ? 'bg-[#7E22CE] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Live 24h Recall Intake
              </button>
              <button
                type="button"
                onClick={() => setDataSource('reference')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  dataSource === 'reference'
                    ? 'bg-[#7E22CE] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reference Baseline
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs bg-[#0d0617] px-3.5 py-2 border border-[#7E22CE] text-[#A855F7] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>ICMR / NIN 2024 Standard</span>
          </div>
        </div>
      </div>

      {/* COMPOSITE STATS CARD */}
      <div className="bg-[#0e071a] border border-[#7E22CE] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-black border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Overall Dietary Adequacy</span>
            <div className="text-3xl font-black text-[#A855F7] mt-1">{averageAdequacy}%</div>
            <span className="text-[10px] text-gray-400">Target: 100% Repletion</span>
          </div>

          <div className="p-3 bg-black border border-red-500/40">
            <span className="text-[10px] font-mono uppercase text-red-400 block">Critical Deficits</span>
            <div className="text-3xl font-black text-red-400 mt-1">{criticalGapsCount} Nutrients</div>
            <span className="text-[10px] text-gray-400">Requires urgent food repletion</span>
          </div>

          <div className="p-3 bg-black border border-amber-500/40">
            <span className="text-[10px] font-mono uppercase text-amber-400 block">Moderate Insufficiencies</span>
            <div className="text-3xl font-black text-amber-400 mt-1">{moderateGapsCount} Nutrients</div>
            <span className="text-[10px] text-gray-400">Subclinical shortfall</span>
          </div>

          <div className="p-3 bg-black border border-purple-500/40">
            <span className="text-[10px] font-mono uppercase text-[#C084FC] block">Key Limiting Factor</span>
            <div className="text-lg font-black text-white mt-1">
              {liveCalculation?.summary.keyLimitingFactor || 'Fiber & Protein'}
            </div>
            <span className="text-[10px] text-gray-400">Directly driving glycemic spikes</span>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="p-3 bg-[#0d0617] border border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-[#A855F7] font-bold">Filter By Gap:</span>
          {['All', 'Critical Deficit', 'Moderate Deficit'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer border ${
                filterStatus === st
                  ? 'bg-[#7E22CE] text-white border-[#A855F7]'
                  : 'bg-black text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          Tracking 10 Core Macronutrients & Micronutrients
        </span>
      </div>

      {/* GAP MATRIX TABLE */}
      <div className="overflow-x-auto bg-[#0d0617] border border-[#7E22CE]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#7E22CE] bg-black text-[#A855F7] font-bold tracking-widest uppercase text-[10px]">
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th className="py-3 px-4 w-40">Nutrient</th>
              <th className="py-3 px-3 text-center">ICMR RDA</th>
              <th className="py-3 px-3 text-center">Actual Intake</th>
              <th className="py-3 px-3 text-center">Deficit Gap</th>
              <th className="py-3 px-4 w-44">Adequacy Progress</th>
              <th className="py-3 px-3 text-center w-32">Status</th>
              <th className="py-3 px-4">Corrective Functional Food Repletion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-3 text-center font-mono font-bold text-[#A855F7]">
                  {(idx + 1).toString().padStart(2, '0')}
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{item.nutrient}</div>
                  <div className="text-[9px] text-gray-400 font-mono">Unit: {item.unit}</div>
                </td>

                <td className="py-3 px-3 text-center font-mono text-gray-300 font-medium">
                  {item.icmrRda} {item.unit}
                </td>

                <td className="py-3 px-3 text-center font-mono font-bold text-white">
                  {item.actualIntake} {item.unit}
                </td>

                <td className="py-3 px-3 text-center font-mono font-bold text-red-400">
                  {item.gap > 0 ? `+${item.gap}` : item.gap} {item.unit}
                </td>

                <td className="py-3 px-4">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                    <span>{item.adequacyPct}%</span>
                    <span>100% Target</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${
                        item.adequacyPct < 50
                          ? 'bg-red-500'
                          : item.adequacyPct < 75
                          ? 'bg-amber-400'
                          : 'bg-[#7E22CE]'
                      }`}
                      style={{ width: `${Math.min(item.adequacyPct, 100)}%` }}
                    />
                  </div>
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      item.status === 'Critical Deficit'
                        ? 'bg-red-950/60 border border-red-500 text-red-400'
                        : item.status === 'Moderate Deficit'
                        ? 'bg-amber-950/60 border border-amber-500 text-amber-300'
                        : 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.correctiveFoods.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 bg-black border border-[#7E22CE]/60 text-purple-200 text-[10px]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">
                    {item.clinicalRisk}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
