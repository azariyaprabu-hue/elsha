import React from 'react';
import { ExerciseDayPlan } from '../types';
import { Dumbbell, HeartPulse, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface FitnessGuidelinesSectionProps {
  exercisePlans: any[]; // Changed to any[] to match the actual data structure being passed
}

export const FitnessGuidelinesSection: React.FC<FitnessGuidelinesSectionProps> = ({
  exercisePlans,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#C5A028] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#C5A028]">
            Module 14 • Physical Conditioning & GLUT4 Activation
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            ELSHA Fitness Guidelines (Diabetes Mellitus)
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#111] px-3 py-1.5 border border-[#C5A028] text-[#C5A028] font-bold uppercase tracking-wider">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-Insulin Mediated Glucose Uptake</span>
        </div>
      </div>

      {/* Weekly Exercise Routine Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-6 bg-[#C5A028]" />
          <h3 className="text-xs uppercase font-black tracking-[0.2em] text-[#C5A028]">
            Weekly Periodized Exercise Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercisePlans.map((ep) => (
            <div
              key={ep.dayNumber || ep.day}
              className="p-5 bg-[#111] border border-[#C5A028] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#C5A028] font-black tracking-wider">
                    DAY {ep.dayNumber || ''} • {(ep.dayName || ep.day || '').toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-black bg-[#C5A028] px-2 py-0.5 uppercase tracking-wider">
                    {ep.durationMins ? `${ep.durationMins}m` : ep.duration || ''}
                  </span>
                </div>

                <h4 className="text-sm font-black uppercase text-white tracking-wide mb-1">
                  {ep.protocolTitle || ep.focus || ''}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3 font-medium">
                  {ep.focusArea || ep.activity || ep.guideline || ''}
                </p>

                {(ep.movements || ep.exercises) && (
                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A028] block">
                      Key Prescribed Movements:
                    </span>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {(ep.movements || ep.exercises || []).map((ex: any, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 mt-1 bg-[#C5A028] flex-shrink-0" />
                          <div>
                            <span className="font-bold text-yellow-200">{ex.name || ex}</span>
                            {ex.setsAndReps && <div className="text-gray-400 font-mono text-[10px]">{ex.setsAndReps}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {(ep.intensityLevel || ep.intensity || ep.postWorkoutRecovery) && (
                <div className="pt-2 border-t border-white/10 flex flex-col gap-2 text-[10px] uppercase font-bold">
                  {(ep.intensityLevel || ep.intensity) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Intensity:</span>
                      <span
                        className={`px-2 py-0.5 ${
                          (ep.intensityLevel || ep.intensity)?.includes('Moderate') || (ep.intensityLevel || ep.intensity)?.includes('Zone 3-4')
                            ? 'text-amber-400 bg-amber-950/60 border border-amber-500/50'
                            : (ep.intensityLevel || ep.intensity)?.includes('Light') || (ep.intensityLevel || ep.intensity)?.includes('Zone 1-2') || (ep.intensityLevel || ep.intensity)?.includes('Restorative')
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/50'
                            : 'text-rose-400 bg-rose-950/60 border border-rose-500/50'
                        }`}
                      >
                        {ep.intensityLevel || ep.intensity}
                      </span>
                    </div>
                  )}
                  {ep.postWorkoutRecovery && (
                    <div className="text-[9px] text-gray-400 normal-case font-normal leading-tight">
                      <span className="text-emerald-400 font-bold uppercase">Recovery:</span> {ep.postWorkoutRecovery}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Exercise Safety Precautions */}
      <div className="p-5 bg-[#111] border border-[#C5A028] space-y-3">
        <div className="flex items-center gap-2 text-[#C5A028] font-black uppercase text-xs tracking-wider">
          <ShieldAlert className="w-4 h-4 text-[#C5A028]" />
          <span>Clinical Exercise Safety Directives for Glycemic Stability</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-300">
          <div className="p-3.5 bg-black border border-white/10">
            <strong className="text-[#C5A028] block mb-1 uppercase text-[10px] tracking-wider font-bold">1. Pre-Workout Glucose Check</strong>
            If blood sugar is &lt; 100 mg/dL, consume 15g complex carbohydrates. If &gt; 250 mg/dL with ketones, postpone vigorous exercise.
          </div>
          <div className="p-3.5 bg-black border border-white/10">
            <strong className="text-[#C5A028] block mb-1 uppercase text-[10px] tracking-wider font-bold">2. Hypoglycemia Rescue Kit</strong>
            Always carry 3–4 glucose tablets, 1/2 cup fresh juice, or 1 tablespoon honey during workouts.
          </div>
          <div className="p-3.5 bg-black border border-white/10">
            <strong className="text-[#C5A028] block mb-1 uppercase text-[10px] tracking-wider font-bold">3. Diabetic Foot Care</strong>
            Inspect feet daily, wear seamless cotton socks and properly fitted athletic footwear to prevent pressure sores.
          </div>
        </div>
      </div>
    </div>
  );
};
