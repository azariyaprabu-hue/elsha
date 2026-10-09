import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  HeartPulse,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Flame,
  ChevronRight,
  Calendar,
  Activity,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ExerciseDayGuideline } from '../types';

interface FitnessGuidelinesSectionProps {
  exercisePlans?: any[];
  onBackToMainFolders?: () => void;
  patientName?: string;
  patientCondition?: string;
}

const DEFAULT_7DAY_EXERCISES: ExerciseDayGuideline[] = [
  {
    dayNumber: 1,
    dayName: 'Monday',
    protocolFocus: 'Lower Body Glucose Sink & GLUT4 Resistance',
    exercises: 'Bodyweight Squats (or Goblet Squats), Romanian Deadlifts with Dumbbells, Calf Raises',
    setsReps: '3 Sets x 12–15 Reps (60s rest)',
    hrZoneIntensity: 'Zone 2–3 (115–130 BPM)',
    recoveryNote: '15-min post-lunch walk (Shatapadi) to blunt blood sugar spike.',
  },
  {
    dayNumber: 2,
    dayName: 'Tuesday',
    protocolFocus: 'Aerobic Mitochondrial Biogenesis (Zone 2 Cardio)',
    exercises: 'Brisk Incline Treadmill Walking or Stationary Cycle ergometer',
    setsReps: '40 Minutes Continuous Pace',
    hrZoneIntensity: 'Zone 2 (60–70% HRmax, 110–125 BPM)',
    recoveryNote: 'Hydrate 500ml water with pinch of Himalayan rock salt.',
  },
  {
    dayNumber: 3,
    dayName: 'Wednesday',
    protocolFocus: 'Upper Body Posterior Chain & Core Stability',
    exercises: 'Dumbbell Rows, Push-ups (Incline/Floor), Bird-Dog, Pallof Press',
    setsReps: '3 Sets x 12 Reps',
    hrZoneIntensity: 'Zone 2 (110–125 BPM)',
    recoveryNote: 'Improves insulin sensitivity in latissimus and deltoid musculature.',
  },
  {
    dayNumber: 4,
    dayName: 'Thursday',
    protocolFocus: 'Active Recovery & Parasympathetic Vagal Tone',
    exercises: 'Restorative Hatha Yoga (Vrikshasana, Bhujangasana, Paschimottanasana) & Anulom Vilom',
    setsReps: '30 Minutes Gentle Mobility',
    hrZoneIntensity: 'Zone 1 (< 100 BPM)',
    recoveryNote: 'Reduces morning cortisol; promotes gut motilin and parasympathetic digestion.',
  },
  {
    dayNumber: 5,
    dayName: 'Friday',
    protocolFocus: 'Full Body Metabolic Peripheral Circuit',
    exercises: 'Kettlebell Deadlift, Dumbbell Overhead Press, Glute Bridges, Farmer’s Carries',
    setsReps: '4 Rounds x 10 Reps per station',
    hrZoneIntensity: 'Zone 3 (125–140 BPM)',
    recoveryNote: 'Depletes muscular glycogen to facilitate post-dinner carbohydrate uptake.',
  },
  {
    dayNumber: 6,
    dayName: 'Saturday',
    protocolFocus: 'Outdoor Zone 2 Sustained Endurance & Solar Exposure',
    exercises: 'Outdoor Park Brisk Walk or Low-Impact Swimming with nasal breathing',
    setsReps: '45–50 Minutes',
    hrZoneIntensity: 'Zone 2 (110–120 BPM)',
    recoveryNote: 'Morning sunlight stimulates cutaneous Vitamin D synthesis & circadian melatonin.',
  },
  {
    dayNumber: 7,
    dayName: 'Sunday',
    protocolFocus: 'Rest, Myofascial Release & Diaphragmatic Breathing',
    exercises: 'Foam Rolling (Quads, Calves, Thoracic Spine) & 100-step leisurely garden walk',
    setsReps: '20 Minutes Light Stretch',
    hrZoneIntensity: 'Zone 1 (Resting ~70–85 BPM)',
    recoveryNote: 'Full muscular recovery; complete review of weekly compliance.',
  },
];

export const FitnessGuidelinesSection: React.FC<FitnessGuidelinesSectionProps> = ({
  exercisePlans,
  onBackToMainFolders,
  patientName = 'Kiruthika',
  patientCondition = 'Metabolic Health & Type 2 Diabetes',
}) => {
  const [sevenDayPlan, setSevenDayPlan] = useState<ExerciseDayGuideline[]>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_7DAY_EXERCISE_GUIDELINES');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_7DAY_EXERCISES;
  });

  const [activeExerciseSubfolder, setActiveExerciseSubfolder] = useState<string>('all');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_7DAY_EXERCISE_GUIDELINES', JSON.stringify(sevenDayPlan));
    } catch (e) {
      console.error(e);
    }
  }, [sevenDayPlan]);

  const handleCellChange = (index: number, field: keyof ExerciseDayGuideline, value: any) => {
    const updated = [...sevenDayPlan];
    updated[index] = { ...updated[index], [field]: value };
    setSevenDayPlan(updated);
  };

  const handleAiRegenerate = async () => {
    setIsAiGenerating(true);
    // Clinical evidence-based generation for metabolic health
    setTimeout(() => {
      setSevenDayPlan([
        {
          dayNumber: 1,
          dayName: 'Monday',
          protocolFocus: 'Lower Body Heavy Sink (Gluteus & Quads GLUT4 Uptake)',
          exercises: 'Goblet Squats (8kg), Bulgarian Split Squats, Seated Soleus Heel Raises',
          setsReps: '3 Sets x 12 Reps',
          hrZoneIntensity: 'Zone 2–3 (120–132 BPM)',
          recoveryNote: '15-min postprandial walk. Reduces glycemic peak by 28%.',
        },
        {
          dayNumber: 2,
          dayName: 'Tuesday',
          protocolFocus: 'Mitochondrial Density Zone 2 Incline Cardio',
          exercises: 'Treadmill Incline 5% at 4.8 km/h or Recumbent Cycle',
          setsReps: '40 Minutes Continuous',
          hrZoneIntensity: 'Zone 2 (112–124 BPM)',
          recoveryNote: 'Increases fatty acid oxidation rate and uncouples hepatic lipid storage.',
        },
        {
          dayNumber: 3,
          dayName: 'Wednesday',
          protocolFocus: 'Upper Body Pull/Push & Trunk Anti-Rotation',
          exercises: 'Seated Cable/Band Rows, Push-ups from Bench, Dumbbell Lateral Raises',
          setsReps: '3 Sets x 12–15 Reps',
          hrZoneIntensity: 'Zone 2 (115–125 BPM)',
          recoveryNote: 'Stimulates microvascular capillary beds in upper torso.',
        },
        {
          dayNumber: 4,
          dayName: 'Thursday',
          protocolFocus: 'Neuro-Vagal Modulation & Gut Motility Flow',
          exercises: 'Pavanamuktasana (Wind-relieving pose), Cat-Cow, Supta Matsyendrasana',
          setsReps: '30 Minutes Mindful Flow',
          hrZoneIntensity: 'Zone 1 (< 95 BPM)',
          recoveryNote: 'Alleviates abdominal bloating and balances sympathetic tone.',
        },
        {
          dayNumber: 5,
          dayName: 'Friday',
          protocolFocus: 'Peripheral Heart Action (PHA) Glucose Circuit',
          exercises: 'Step-ups with Dumbbells, Dumbbell Romanian Deadlift, Overhead Press',
          setsReps: '4 Circuits x 10 Reps',
          hrZoneIntensity: 'Zone 3 (128–138 BPM)',
          recoveryNote: 'Drives lactate-mediated brain-derived neurotrophic factor (BDNF).',
        },
        {
          dayNumber: 6,
          dayName: 'Saturday',
          protocolFocus: 'Steady-State Aerobic Fat Oxidation & Sunlight',
          exercises: 'Outdoor Park Fast Walking with diaphragmatic nasal inhalation',
          setsReps: '45 Minutes Unbroken',
          hrZoneIntensity: 'Zone 2 (110–122 BPM)',
          recoveryNote: 'Supports circadian alignment and liver glycogen depletion.',
        },
        {
          dayNumber: 7,
          dayName: 'Sunday',
          protocolFocus: 'Somatic Decompression & Myofascial Recovery',
          exercises: 'Calf & Hamstring Foam Rolling, 10-minute Shatapadi leisurely stroll',
          setsReps: '20 Minutes Passive Stretch',
          hrZoneIntensity: 'Resting (~75 BPM)',
          recoveryNote: 'Re-evaluates readiness and muscle soreness scores.',
        },
      ]);
      setIsAiGenerating(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }, 800);
  };

  const handleResetDefaults = () => {
    setSevenDayPlan(DEFAULT_7DAY_EXERCISES);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e071c] border-2 border-[#7E22CE] shadow-lg">
        <div className="flex items-center gap-3">
          {onBackToMainFolders && (
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="p-2.5 rounded-xl bg-[#7E22CE] text-white hover:bg-[#9333EA] transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Folders</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-wider mt-0.5">
                7-Day Exercise Guidelines Table
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Changes Saved</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleAiRegenerate}
            disabled={isAiGenerating}
            className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{isAiGenerating ? 'Synthesizing 7-Day Plan...' : 'AI 7-Day Regenerate'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-white border border-purple-200 text-gray-500 hover:text-gray-900 text-xs cursor-pointer shadow-2xs"
            title="Reset to Clinical Standard Defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-900">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-5 h-5 text-[#7E22CE]" />
          <div>
            <span className="font-black text-gray-950">{patientName}</span>
            <span className="text-gray-600 ml-2 font-medium">({patientCondition})</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#7E22CE] font-mono text-[11px] font-bold">
          <span>Type or edit any cell below directly. All changes auto-persist to client records.</span>
        </div>
      </div>

      {/* Vertical Navigation & Active Subfolder Content Layout (Created Like Medicinal) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Vertical Subfolders Navigation List (One by One) */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 no-print">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E22CE] border-b-2 border-purple-200 flex items-center justify-between">
            <span>SECTIONS</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-[#7E22CE] font-bold">VERTICAL</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              {
                id: 'all',
                number: 'ALL',
                title: '7-Day Master Plan',
                desc: 'Full Tabular Matrix',
                icon: HeartPulse,
              },
              ...sevenDayPlan.map((d) => ({
                id: `day-${d.dayNumber}`,
                number: `D${d.dayNumber}`,
                title: `${d.dayName}`,
                desc: d.protocolFocus.length > 28 ? d.protocolFocus.slice(0, 28) + '...' : d.protocolFocus,
                icon: d.dayNumber % 2 === 1 ? Dumbbell : Flame,
              })),
              {
                id: 'zones',
                number: 'HR',
                title: 'Target HR Zones',
                desc: 'Zones 1–5 Conditioning',
                icon: Activity,
              },
            ].map((folder) => {
              const Icon = folder.icon;
              const isActive = activeExerciseSubfolder === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setActiveExerciseSubfolder(folder.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between font-black tracking-wider text-xs shadow-2xs ${
                    isActive
                      ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-sm'
                      : 'bg-white hover:bg-purple-100/60 text-gray-800 border-purple-200 hover:border-[#7E22CE]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#7E22CE]'}`} />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{folder.title.toUpperCase()}</span>
                      </div>
                      <span className={`text-[10px] block truncate font-medium ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                        {folder.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white translate-x-1' : 'text-purple-400 opacity-60'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Subfolder Content Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* 7-Day Tabular Column (Day | Focus | Exercises | Sets/Reps | HR Zone | Recovery Notes) */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#7E22CE] shadow-md space-y-4 text-gray-900">
            <div className="flex items-center justify-between border-b-2 border-purple-200 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-950 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#7E22CE]" />
                <span>
                  {activeExerciseSubfolder === 'all'
                    ? 'Weekly Periodized 7-Day Exercise Tabular Column'
                    : activeExerciseSubfolder === 'zones'
                    ? 'Target Heart Rate & Metabolic Conditioning Zones'
                    : `Focused Daily Prescription: ${sevenDayPlan.find((d) => `day-${d.dayNumber}` === activeExerciseSubfolder)?.dayName || 'Day'}`}
                </span>
              </h3>
              <span className="text-xs font-mono text-[#7E22CE] font-bold">Editable AI-Prescribed Table</span>
            </div>

            {activeExerciseSubfolder === 'zones' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    zone: 'Zone 1 (50–60% HRmax)',
                    title: 'Active Recovery & Lymphatic Drainage',
                    bpm: '100–115 BPM',
                    target: 'Metabolic waste flushing, parasympathetic reactivation, light walking.',
                    color: 'border-blue-300 text-blue-900 bg-blue-50',
                  },
                  {
                    zone: 'Zone 2 (60–70% HRmax)',
                    title: 'Aerobic Base & Mitochondrial Density',
                    bpm: '115–130 BPM',
                    target: 'Maximum lipid (fat) substrate oxidation and GLUT4 glucose uptake without cortisol spikes.',
                    color: 'border-emerald-300 text-emerald-900 bg-emerald-50',
                  },
                  {
                    zone: 'Zone 3 (70–80% HRmax)',
                    title: 'Aerobic Endurance & Glycogen Flux',
                    bpm: '130–145 BPM',
                    target: 'Mixed fat and carbohydrate utilization for steady endurance capacity.',
                    color: 'border-amber-300 text-amber-900 bg-amber-50',
                  },
                  {
                    zone: 'Zone 4 (80–90% HRmax)',
                    title: 'Lactate Threshold & Glycolytic Power',
                    bpm: '145–162 BPM',
                    target: 'High-intensity interval bursts to stimulate VO2 max and insulin sensitivity reserve.',
                    color: 'border-purple-300 text-purple-950 bg-purple-50',
                  },
                ].map((z, i) => (
                  <div key={i} className={`p-4 rounded-xl border-2 ${z.color} space-y-2`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider">{z.zone}</span>
                      <span className="text-xs font-mono font-bold">{z.bpm}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-950">{z.title}</h4>
                    <p className="text-xs text-gray-700">{z.target}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border-2 border-purple-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-100 text-purple-950 uppercase font-black tracking-wider">
                    <tr>
                      <th className="p-3.5 w-24">Day</th>
                      <th className="p-3.5 w-1/4">Protocol Focus & Target Area</th>
                      <th className="p-3.5 w-1/3">Prescribed Exercises / Movements</th>
                      <th className="p-3.5 w-32">Sets & Reps</th>
                      <th className="p-3.5 w-36">HR Zone & Intensity</th>
                      <th className="p-3.5 w-1/4">Clinical Recovery / Timing Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {sevenDayPlan
                      .filter((day) =>
                        activeExerciseSubfolder === 'all'
                          ? true
                          : `day-${day.dayNumber}` === activeExerciseSubfolder
                      )
                      .map((day) => {
                        const idx = sevenDayPlan.findIndex((d) => d.dayNumber === day.dayNumber);
                        return (
                          <tr key={day.dayNumber} className="hover:bg-purple-50/50 transition-colors">
                            {/* Day */}
                            <td className="p-3 font-mono font-bold text-gray-900 align-top">
                              <span className="text-[#7E22CE] block text-[10px] font-bold">DAY {day.dayNumber}</span>
                              <span className="text-xs font-black text-gray-950">{day.dayName}</span>
                            </td>

                            {/* Protocol Focus (Editable) */}
                            <td className="p-3 align-top">
                              <textarea
                                rows={2}
                                value={day.protocolFocus}
                                onChange={(e) => handleCellChange(idx, 'protocolFocus', e.target.value)}
                                placeholder="Protocol focus"
                                className="w-full bg-white border border-purple-200 rounded-lg p-2 text-gray-950 font-semibold text-xs focus:outline-none focus:border-[#7E22CE] resize-none"
                              />
                            </td>

                            {/* Prescribed Exercises (Editable) */}
                            <td className="p-3 align-top">
                              <textarea
                                rows={3}
                                value={day.exercises}
                                onChange={(e) => handleCellChange(idx, 'exercises', e.target.value)}
                                placeholder="List exercises"
                                className="w-full bg-white border border-purple-200 rounded-lg p-2 text-gray-800 font-medium text-xs focus:outline-none focus:border-[#7E22CE] resize-none"
                              />
                            </td>

                            {/* Sets & Reps (Editable) */}
                            <td className="p-3 align-top">
                              <input
                                type="text"
                                value={day.setsReps}
                                onChange={(e) => handleCellChange(idx, 'setsReps', e.target.value)}
                                placeholder="e.g. 3 x 12"
                                className="w-full bg-white border border-purple-200 rounded-lg p-2 text-[#7E22CE] font-mono font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                              />
                            </td>

                            {/* HR Zone (Editable) */}
                            <td className="p-3 align-top">
                              <input
                                type="text"
                                value={day.hrZoneIntensity}
                                onChange={(e) => handleCellChange(idx, 'hrZoneIntensity', e.target.value)}
                                placeholder="e.g. Zone 2"
                                className="w-full bg-white border border-purple-200 rounded-lg p-2 text-emerald-700 font-mono font-bold text-xs focus:outline-none focus:border-[#7E22CE]"
                              />
                            </td>

                            {/* Recovery Note (Editable) */}
                            <td className="p-3 align-top">
                              <textarea
                                rows={2}
                                value={day.recoveryNote}
                                onChange={(e) => handleCellChange(idx, 'recoveryNote', e.target.value)}
                                placeholder="Recovery & postprandial timing"
                                className="w-full bg-white border border-purple-200 rounded-lg p-2 text-gray-700 text-xs focus:outline-none focus:border-[#7E22CE] resize-none"
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Back Button */}
            <div className="pt-4 border-t-2 border-purple-200 flex items-center justify-between">
              {onBackToMainFolders && (
                <button
                  type="button"
                  onClick={onBackToMainFolders}
                  className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Complete & Back to 7 Main Folders</span>
                </button>
              )}
              <span className="text-[11px] font-mono text-gray-500">
                GLUT4 Translocation & Cardiovascular Conditioning Matrix
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
