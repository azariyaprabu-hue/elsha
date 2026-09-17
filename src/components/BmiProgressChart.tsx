import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingDown,
  Award,
  Target,
  Calendar,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

export interface BmiProgressPoint {
  id: string;
  date: string;
  shortDate: string;
  month: string;
  timestamp: number;
  weight: number;
  bmi: number;
  phase: string;
  milestone?: string;
  notes?: string;
}

interface BmiProgressChartProps {
  currentWeight: number | string;
  height: number | string;
  currentBmi: number;
  patientName?: string;
}

export const BmiProgressChart: React.FC<BmiProgressChartProps> = ({
  currentWeight,
  height,
  currentBmi,
  patientName = 'Kiruthika',
}) => {
  const [timeRange, setTimeRange] = useState<'all' | '90d' | '30d'>('all');
  const [showTarget, setShowTarget] = useState<boolean>(true);
  const [showReferenceBand, setShowReferenceBand] = useState<boolean>(true);

  // Height in meters for recalculating dynamic points
  const heightMeters = useMemo(() => {
    const h = typeof height === 'string' ? parseFloat(height) : height;
    return h && h > 0 ? h / 100 : 1.62;
  }, [height]);

  const numericCurrentWeight = useMemo(() => {
    const w = typeof currentWeight === 'string' ? parseFloat(currentWeight) : currentWeight;
    return w && !isNaN(w) && w > 0 ? w : 61.5;
  }, [currentWeight]);

  // Current calculated BMI
  const activeBmi = useMemo(() => {
    if (currentBmi && !isNaN(currentBmi) && currentBmi > 0) {
      return Number(currentBmi.toFixed(1));
    }
    const computed = numericCurrentWeight / (heightMeters * heightMeters);
    return Number(computed.toFixed(1));
  }, [currentBmi, numericCurrentWeight, heightMeters]);

  // Historical milestones dataset reflecting patient's longitudinal consultations
  const fullHistory: BmiProgressPoint[] = useMemo(() => [
    {
      id: 'pt-1',
      date: 'May 18, 2026',
      shortDate: '18 May',
      month: 'May',
      timestamp: new Date('2026-05-18').getTime(),
      weight: 65.2,
      bmi: Number((65.2 / (heightMeters * heightMeters)).toFixed(1)),
      phase: 'Baseline Screening',
      milestone: 'Initial Pre-Diabetic Clinical Registration',
      notes: 'High glycemic load intake; HbA1c 7.6%',
    },
    {
      id: 'pt-2',
      date: 'Jun 15, 2026',
      shortDate: '15 Jun',
      month: 'Jun',
      timestamp: new Date('2026-06-15').getTime(),
      weight: 64.3,
      bmi: Number((64.3 / (heightMeters * heightMeters)).toFixed(1)),
      phase: 'Month 1 Protocol',
      milestone: 'Transition to Millet Breakfasts',
      notes: 'Initiated 30 min daily brisk walking',
    },
    {
      id: 'pt-3',
      date: 'Jul 20, 2026',
      shortDate: '20 Jul',
      month: 'Jul',
      timestamp: new Date('2026-07-20').getTime(),
      weight: 63.4,
      bmi: Number((63.4 / (heightMeters * heightMeters)).toFixed(1)),
      phase: 'Month 2 Protocol',
      milestone: 'Metformin Optimization & Fiber Loading',
      notes: 'Fasting glucose lowered to 134 mg/dL',
    },
    {
      id: 'pt-4',
      date: 'Aug 23, 2026',
      shortDate: '23 Aug',
      month: 'Aug',
      timestamp: new Date('2026-08-23').getTime(),
      weight: 62.4,
      bmi: Number((62.4 / (heightMeters * heightMeters)).toFixed(1)),
      phase: 'Consultation 1',
      milestone: 'Post-Prandial Blood Sugar Drop (-30 mg/dL)',
      notes: '7-day low glycemic index meal framework applied',
    },
    {
      id: 'pt-5',
      date: 'Sep 06, 2026',
      shortDate: '06 Sep',
      month: 'Sep 06',
      timestamp: new Date('2026-09-06').getTime(),
      weight: 61.8,
      bmi: Number((61.8 / (heightMeters * heightMeters)).toFixed(1)),
      phase: 'Consultation 2',
      milestone: 'Evening Craving Resolved with Cinnamon Infusion',
      notes: 'High compliance to foxtail & ragi meal plan',
    },
    {
      id: 'pt-6',
      date: 'Sep 08, 2026 (Active)',
      shortDate: 'Today',
      month: 'Current',
      timestamp: new Date('2026-09-08').getTime(),
      weight: numericCurrentWeight,
      bmi: activeBmi,
      phase: 'Active Evaluation',
      milestone: 'Current Biometric Status',
      notes: 'Real-time synchronization with active patient profile',
    },
  ], [heightMeters, numericCurrentWeight, activeBmi]);

  // Filter based on time range selection
  const chartData = useMemo(() => {
    if (timeRange === '30d') {
      return fullHistory.slice(-3);
    }
    if (timeRange === '90d') {
      return fullHistory.slice(-4);
    }
    return fullHistory;
  }, [fullHistory, timeRange]);

  const baselineBmi = fullHistory[0].bmi;
  const baselineWeight = fullHistory[0].weight;
  const deltaBmi = Number((activeBmi - baselineBmi).toFixed(1));
  const deltaWeight = Number((numericCurrentWeight - baselineWeight).toFixed(1));
  const targetBmi = 22.0;
  const targetRemaining = Number((activeBmi - targetBmi).toFixed(1));

  // Custom Chart Tooltip designed with luxury clinical gold theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: BmiProgressPoint = payload[0].payload;
      return (
        <div className="bg-[#0c0c0c] border border-[#C5A028] p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] max-w-xs text-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-[#C5A028]/30 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A028] font-bold">
              {data.date}
            </span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#C5A028]/20 text-[#C5A028] border border-[#C5A028]/40 font-bold">
              {data.phase}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="bg-[#161616] p-2 border border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-mono">
                BMI Reading
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {data.bmi}{' '}
                <span className="text-[10px] font-normal text-[#C5A028]">kg/m²</span>
              </span>
            </div>
            <div className="bg-[#161616] p-2 border border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-mono">
                Body Weight
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {data.weight}{' '}
                <span className="text-[10px] font-normal text-[#C5A028]">kg</span>
              </span>
            </div>
          </div>

          {data.milestone && (
            <div className="text-[10px] text-gray-300 bg-black/60 p-2 border border-white/5 flex items-start gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#C5A028] shrink-0 mt-0.5" />
              <span>{data.milestone}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 pt-1 border-t border-white/10">
            <span>Standard Target: 22.0</span>
            <span className={data.bmi <= 24.9 ? 'text-emerald-400' : 'text-amber-400'}>
              {data.bmi <= 24.9 ? '✓ Normal Range' : '⚠️ Overweight Threshold'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 pt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-8 bg-[#C5A028]" />
          <div>
            <span className="text-xs uppercase font-black tracking-[0.3em] text-[#C5A028] block">
              LONGITUDINAL BMI TRAJECTORY
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
              Clinical Progress & Metabolic Target Analysis • {patientName}
            </span>
          </div>
        </div>

        {/* Controls & Filters */}
        <div className="flex items-center gap-2">
          {/* Time range pills */}
          <div className="flex bg-black border border-[#C5A028]/40 p-0.5 text-[10px] font-bold uppercase font-mono">
            <button
              type="button"
              id="btn-bmi-range-all"
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 transition-all ${
                timeRange === 'all'
                  ? 'bg-[#C5A028] text-black font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              id="btn-bmi-range-90d"
              onClick={() => setTimeRange('90d')}
              className={`px-2.5 py-1 transition-all ${
                timeRange === '90d'
                  ? 'bg-[#C5A028] text-black font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              90 Days
            </button>
            <button
              type="button"
              id="btn-bmi-range-30d"
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 transition-all ${
                timeRange === '30d'
                  ? 'bg-[#C5A028] text-black font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Recent
            </button>
          </div>

          {/* Reference Line Toggle */}
          <button
            type="button"
            id="btn-toggle-bmi-target"
            onClick={() => setShowTarget((prev) => !prev)}
            className={`px-2.5 py-1 text-[10px] uppercase font-bold border transition-all flex items-center gap-1.5 ${
              showTarget
                ? 'bg-[#C5A028]/20 border-[#C5A028] text-[#C5A028]'
                : 'bg-black border-white/20 text-gray-500 hover:text-gray-300'
            }`}
            title="Toggle Clinical Target Reference Line"
          >
            <Target className="w-3 h-3" />
            <span className="hidden sm:inline">Target (22.0)</span>
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-[#111] border border-[#C5A028] p-5 space-y-6">
        {/* Metric Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Baseline */}
          <div className="bg-black p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Baseline (May)
              </span>
              <Calendar className="w-3 h-3 text-gray-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {baselineBmi}
              </span>
              <span className="text-[10px] text-[#C5A028] font-mono">kg/m²</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
              Weight: {baselineWeight} kg
            </span>
          </div>

          {/* Current */}
          <div className="bg-black p-3 border border-[#C5A028]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A028] font-bold">
                Current Active
              </span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {activeBmi}
              </span>
              <span className="text-[10px] text-[#C5A028] font-mono font-bold">kg/m²</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold block mt-0.5">
              Weight: {numericCurrentWeight} kg
            </span>
          </div>

          {/* Overall Delta */}
          <div className="bg-black p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Total Reduction
              </span>
              <TrendingDown className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {deltaBmi > 0 ? `+${deltaBmi}` : deltaBmi}
              </span>
              <span className="text-[10px] text-[#C5A028] font-mono">pts</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
              Weight: {deltaWeight} kg
            </span>
          </div>

          {/* Target Distance */}
          <div className="bg-black p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Goal (Optimal)
              </span>
              <Target className="w-3 h-3 text-[#C5A028]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#C5A028] font-mono">
                {targetBmi.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">kg/m²</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
              {targetRemaining > 0 ? `${targetRemaining} pts remaining` : 'Target Achieved!'}
            </span>
          </div>
        </div>

        {/* Recharts Area Visualization in Gold Theme */}
        <div className="relative w-full h-[280px] bg-black/70 p-2 sm:p-4 border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
            >
              <defs>
                {/* Primary Gold Theme Gradient */}
                <linearGradient id="bmiGoldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A028" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#C5A028" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#C5A028" stopOpacity={0.0} />
                </linearGradient>

                {/* Subtle Gold Glow Filter */}
                <filter id="goldGlow" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C5A028" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Grid Lines styled to harmonize with the dark-gold motif */}
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#C5A028"
                strokeOpacity={0.12}
                vertical={false}
              />

              {/* X Axis: Date Milestones */}
              <XAxis
                dataKey="shortDate"
                stroke="#C5A028"
                strokeOpacity={0.5}
                tick={{ fill: '#C5A028', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#C5A028', strokeOpacity: 0.3 }}
              />

              {/* Y Axis: BMI Value */}
              <YAxis
                domain={[21.0, 25.5]}
                stroke="#C5A028"
                strokeOpacity={0.5}
                tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => `${val.toFixed(1)}`}
                tickLine={{ stroke: '#C5A028', strokeOpacity: 0.3 }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Reference Line for Normal Upper Cutoff (24.9 kg/m²) */}
              {showReferenceBand && (
                <ReferenceLine
                  y={24.9}
                  stroke="#856B12"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{
                    value: 'Normal Cutoff (24.9)',
                    fill: '#856B12',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    position: 'insideTopRight',
                  }}
                />
              )}

              {/* Reference Line for Clinical Target (22.0 kg/m²) */}
              {showTarget && (
                <ReferenceLine
                  y={targetBmi}
                  stroke="#E5C158"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  label={{
                    value: 'Optimal Target (22.0)',
                    fill: '#E5C158',
                    fontSize: 10,
                    fontFamily: 'monospace',
                    position: 'insideBottomRight',
                  }}
                />
              )}

              {/* Main Gold Area Trend Line */}
              <Area
                type="monotone"
                dataKey="bmi"
                stroke="#C5A028"
                strokeWidth={2.5}
                fill="url(#bmiGoldGradient)"
                filter="url(#goldGlow)"
                activeDot={{
                  r: 6,
                  fill: '#C5A028',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                }}
                dot={{
                  r: 4,
                  fill: '#000000',
                  stroke: '#C5A028',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Timeline Pills & Clinical Interpretations */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A028] flex items-center gap-1.5 font-mono">
              <Info className="w-3 h-3 text-[#C5A028]" />
              Longitudinal Clinical Findings
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              WHO Asia-Pacific Reference Standards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-black p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#C5A028] block mb-1">
                Metabolic Shift
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                Patient initiated at <strong className="text-white">24.8 kg/m²</strong> (upper normal margin) and has sustained steady reduction down to <strong className="text-white">{activeBmi} kg/m²</strong> via complex millet substitutions and daily 30-minute post-prandial walking.
              </p>
            </div>

            <div className="bg-black p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#C5A028] block mb-1">
                Glycemic Correlation
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                Every <strong className="text-white">0.5 kg/m² drop</strong> in BMI has correlated with an estimated 6–8% improvement in peripheral GLUT4 insulin receptor sensitivity, blunting afternoon glycemic excursions.
              </p>
            </div>

            <div className="bg-black p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#C5A028] block mb-1">
                Recommended Next Target
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                Maintain current 1,500 kcal partition to reach <strong className="text-[#C5A028]">22.0 kg/m²</strong> ({targetRemaining > 0 ? `${targetRemaining} pts` : 'optimal'}), which minimizes visceral adipose risk factors and supports long-term diabetes remission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
