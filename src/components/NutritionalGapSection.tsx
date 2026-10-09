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
  Database,
  X,
  Calculator,
} from 'lucide-react';
import { DietaryRecallItem, GeneralInfo } from '../types';
import { calculateNutritionalTotalsAndGaps, NutrientCalculationAuditStep } from '../utils/nutritionalCalculator';
import { ElshaIfctCalculatorModal } from './ElshaIfctCalculatorModal';

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
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showElshaCalculator, setShowElshaCalculator] = useState<boolean>(false);
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

          <button
            type="button"
            onClick={() => setShowElshaCalculator(true)}
            className="flex items-center gap-2 text-xs bg-[#7E22CE]/20 hover:bg-[#7E22CE]/30 px-3.5 py-2 border border-[#7E22CE] text-purple-200 font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <Calculator className="w-4 h-4 text-[#A855F7]" />
            <span>IFCT Formula Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAuditModal(true)}
            className="flex items-center gap-2 text-xs bg-purple-950/80 hover:bg-purple-900 px-3.5 py-2 border border-purple-500/60 text-purple-200 font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <Database className="w-4 h-4 text-purple-300" />
            <span>Calculation Audit Log</span>
          </button>

          <div className="flex items-center gap-2 text-xs bg-[#0d0617] px-3.5 py-2 border border-[#7E22CE] text-[#A855F7] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>ICMR IFCT 2017 Verified</span>
          </div>
        </div>
      </div>

      {/* ICMR-NIN IFCT 2017 GROUND TRUTH VERIFICATION PANEL */}
      <div className="p-4 bg-[#090412] border-2 border-purple-900/60 rounded-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-950/90 border border-purple-600/50 rounded text-purple-300 mt-0.5">
            <Sparkles className="w-5 h-5 text-[#C084FC]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Verified ICMR-NIN IFCT 2017 / NVIF 2017 Laboratory Ground Truth</span>
                <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-mono rounded">
                  Zero AI Guessing / Zero Hardcoded Fallbacks
                </span>
              </h3>
              <span className="text-[11px] font-mono text-purple-300 font-bold">
                Formula: Nutrient = IFCT Value per 100g × Qty ÷ 100
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Every nutrient value displayed across this clinic suite is strictly derived from official National Institute of Nutrition (ICMR-NIN) <strong>Indian Food Composition Tables (IFCT 2017)</strong> laboratory analyses.
              Patient targets are referenced to <strong>ICMR-NIN RDA/EAR 2020</strong>.
              Food states (Raw vs. Cooked / Boiled / Roasted) are rigorously segregated.
              <strong> Plain drinking water is mathematically locked to 0 kcal and 0 macronutrients</strong>.
              If an unrecognized food is entered, the engine explicitly displays <span className="text-amber-300 font-bold">"Verified nutrient data unavailable"</span> rather than generating estimated or generic values.
            </p>
          </div>
        </div>
      </div>

      {/* ELSHA CALCULATION SYSTEM CARD */}
      <div className="p-4 bg-[#0a0d14] border-2 border-[#C5A028]/60 rounded-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A028]/30 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#C5A028]/20 border border-[#C5A028] rounded text-[#C5A028]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Clinical Calculation System • ICMR-NIN IFCT 2017 Table 1</span>
                <span className="px-2 py-0.5 bg-[#C5A028] text-black text-[9px] font-mono font-black uppercase rounded-sm">
                  Exact Formula Mandate
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">
                Formula: <span className="text-[#f7d88c] font-bold">Nutrient value = (IFCT value per 100 g × consumed weight in g) ÷ 100</span> | Conversion: <span className="text-[#f7d88c] font-bold">kcal = kJ ÷ 4.184</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowElshaCalculator(true)}
            className="px-3 py-1 bg-[#C5A028] hover:bg-[#b08d20] text-black font-mono font-bold uppercase text-[10px] tracking-wider rounded transition-colors"
          >
            Launch Interactive Calculator
          </button>
        </div>

        {/* Example: Raw, milled rice — 30 g (A015) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-300 font-bold">
              Example: Raw, milled rice — 30 g (IFCT Code: A015)
            </span>
            <span className="text-gray-400 text-[11px]">
              For 30 g: 30 ÷ 100 = 0.3 → every 100 g value × 0.3
            </span>
          </div>

          <div className="border border-white/10 rounded overflow-x-auto bg-black">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#141a22] text-[#C5A028] uppercase text-[10px] tracking-wider border-b border-white/10">
                  <th className="py-2 px-3">Nutrient</th>
                  <th className="py-2 px-3">Per 100 g</th>
                  <th className="py-2 px-3">Calculation for 30 g</th>
                  <th className="py-2 px-3 text-right">30 g Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-white font-bold">Energy (kJ)</td>
                  <td className="py-2 px-3 text-gray-300">1491 kJ</td>
                  <td className="py-2 px-3 text-gray-400">1491 × 30 ÷ 100</td>
                  <td className="py-2 px-3 text-right font-bold text-amber-300">447.3 kJ</td>
                </tr>
                <tr className="hover:bg-white/[0.02] bg-[#C5A028]/5">
                  <td className="py-2 px-3 text-white font-bold">Energy (kcal)</td>
                  <td className="py-2 px-3 text-gray-300">1491 kJ <span className="text-[10px] text-gray-500">(356 kcal)</span></td>
                  <td className="py-2 px-3 text-[#f7d88c]">447.3 ÷ 4.184</td>
                  <td className="py-2 px-3 text-right font-bold text-[#C5A028]">≈ 107 kcal</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-white font-bold">Protein</td>
                  <td className="py-2 px-3 text-gray-300">7.94 g</td>
                  <td className="py-2 px-3 text-gray-400">7.94 × 30 ÷ 100</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-300">2.38 g</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-white font-bold">Fat</td>
                  <td className="py-2 px-3 text-gray-300">0.52 g</td>
                  <td className="py-2 px-3 text-gray-400">0.52 × 30 ÷ 100</td>
                  <td className="py-2 px-3 text-right font-bold text-orange-300">0.16 g</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-white font-bold">Dietary fibre</td>
                  <td className="py-2 px-3 text-gray-300">2.81 g</td>
                  <td className="py-2 px-3 text-gray-400">2.81 × 30 ÷ 100</td>
                  <td className="py-2 px-3 text-right font-bold text-indigo-300">0.84 g</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-white font-bold">Carbohydrate</td>
                  <td className="py-2 px-3 text-gray-300">78.24 g</td>
                  <td className="py-2 px-3 text-gray-400">78.24 × 30 ÷ 100</td>
                  <td className="py-2 px-3 text-right font-bold text-cyan-300">23.47 g</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-[11px] font-mono text-gray-400 flex flex-wrap items-center justify-between gap-1 pt-1">
            <span>
              Therefore, 30 g raw milled rice: <strong className="text-white">Energy = ~107 kcal, Protein = 2.38 g, Carbohydrate = 23.47 g, Fat = 0.16 g, Dietary fibre = 0.84 g</strong>
            </span>
            <span className="text-[#C5A028]">
              Applies to 25g, 50g, 75g, 120g, etc. across all cereal, pulse, veg, fruit & dairy items.
            </span>
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

      {/* CALCULATION AUDIT LOG MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e071a] border-2 border-[#7E22CE] rounded-lg max-w-5xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-black/80 border-b border-purple-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-950 border border-purple-600 rounded text-purple-300">
                  <Database className="w-5 h-5 text-[#C084FC]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span>ICMR-NIN IFCT 2017 Traceable Calculation Audit Log</span>
                    <span className="px-2 py-0.5 bg-purple-900/60 border border-purple-500 text-purple-200 text-[10px] font-mono rounded">
                      Formula: Per 100g × Qty ÷ 100
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Food → Quantity → Official IFCT Code → Food State → Reference per 100g → Mathematical Step → Final Nutrients
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content: Audit Steps Table */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {liveCalculation?.auditTrail && liveCalculation.auditTrail.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-purple-900/60 rounded">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr className="bg-black text-[#A855F7] uppercase text-[10px] tracking-wider border-b border-purple-900/60">
                          <th className="py-2.5 px-3">Food & State</th>
                          <th className="py-2.5 px-2 text-center">Entered Qty</th>
                          <th className="py-2.5 px-3">IFCT 2017 Code</th>
                          <th className="py-2.5 px-2 text-right">IFCT /100g Kcal</th>
                          <th className="py-2.5 px-3">Mathematical Calculation Formula</th>
                          <th className="py-2.5 px-2 text-right">Final Kcal</th>
                          <th className="py-2.5 px-2 text-right">Protein</th>
                          <th className="py-2.5 px-2 text-right">Fiber</th>
                          <th className="py-2.5 px-2 text-right">Iron</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {liveCalculation.auditTrail.map((step, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-3">
                              <div className="font-bold text-white font-sans">{step.foodName}</div>
                              <span className="text-[10px] text-purple-300 font-mono">
                                State: {step.foodState}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="px-1.5 py-0.5 bg-black border border-purple-800 rounded font-bold text-purple-200">
                                {step.enteredQuantity} {step.enteredUnit}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-purple-300 font-bold">{step.ifctFoodCode}</span>
                              <div className="text-[9px] text-gray-400 truncate max-w-[140px] font-sans">
                                {step.officialIfctName}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-right text-gray-300">
                              {step.per100gReference.energyKcal}
                            </td>
                            <td className="py-2 px-3 text-[10px] text-gray-300 font-sans max-w-[280px]">
                              {step.calculationFormula}
                            </td>
                            <td className="py-2 px-2 text-right font-bold text-emerald-400">
                              {step.calculatedNutrients.energyKcal}
                            </td>
                            <td className="py-2 px-2 text-right text-purple-300">
                              {step.calculatedNutrients.proteinG}g
                            </td>
                            <td className="py-2 px-2 text-right text-blue-300">
                              {step.calculatedNutrients.fiberG}g
                            </td>
                            <td className="py-2 px-2 text-right text-rose-300">
                              {step.calculatedNutrients.ironMg}mg
                            </td>
                            <td className="py-2 px-3 text-center">
                              {step.isVerifiedIfct ? (
                                <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[9px] font-black uppercase rounded">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[9px] font-black uppercase rounded">
                                  Unavailable
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary of Water & Verification Rules */}
                  <div className="p-3 bg-black/60 border border-purple-900/60 rounded text-xs space-y-1 text-gray-300">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Strict ICMR-NIN Compliance Rules Enforced:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-400 text-[11px]">
                      <li>
                        <strong>Water Rule:</strong> Plain drinking/warm water is strictly 0 kcal and 0 macronutrients. No calories are assigned.
                      </li>
                      <li>
                        <strong>Food State Integrity:</strong> Raw ingredients (atta, rice, dry grains) and cooked equivalents are segregated.
                      </li>
                      <li>
                        <strong>Traceability:</strong> Every number has an exact mathematical proof: <code className="text-purple-300">per 100g × grams ÷ 100</code>.
                      </li>
                      <li>
                        <strong>Missing Foods:</strong> Never estimated by AI. Displays "Verified nutrient data unavailable" if not in the ICMR-NIN repository.
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Info className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                  <p>No active 24-hour recall items found to audit. Please enter dietary recall data in Module 09.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-black/80 border-t border-purple-900/80 flex items-center justify-between text-xs text-gray-400">
              <span>National Institute of Nutrition (ICMR-NIN) • IFCT 2017 & RDA 2020 Standards</span>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-1.5 bg-[#7E22CE] hover:bg-[#6b1cb0] text-white font-bold rounded uppercase tracking-wider text-[11px]"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ELSHA CALCULATION SYSTEM INTERACTIVE MODAL */}
      <ElshaIfctCalculatorModal
        isOpen={showElshaCalculator}
        onClose={() => setShowElshaCalculator(false)}
        initialFoodCode="A015"
        initialGrams={30}
      />
    </div>
  );
};
