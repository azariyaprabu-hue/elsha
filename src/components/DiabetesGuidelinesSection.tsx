import React from 'react';
import { DiabetesGuidelines } from '../types';
import { Sparkles, CheckCircle, AlertTriangle, XCircle, ShieldCheck, Flame } from 'lucide-react';

interface DiabetesGuidelinesSectionProps {
  guidelines: DiabetesGuidelines;
}

export const DiabetesGuidelinesSection: React.FC<DiabetesGuidelinesSectionProps> = ({
  guidelines,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#d4af37]/30 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#d4af37]">
            Module 12 • Clinical Protocol & Glycemic Architecture
          </span>
          <h2 className="text-2xl font-serif text-[#f7d88c] font-bold tracking-wide">
            Žiathlon Sports Medicine Clinic Diabetes Ingredients Guidelines
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#d4af37] bg-[#121814] px-3 py-1.5 rounded-full border border-[#d4af37]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evidence-Based Nutritional Therapeutics</span>
        </div>
      </div>

      {/* Traffic Light Grid: Include (🟢), Moderate (🟡), Minimize (🔴) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 🟢 FOODS TO INCLUDE */}
        <div className="rounded-2xl bg-gradient-to-b from-[#0f1d13] to-[#0a110d] border border-emerald-500/40 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <h3 className="text-xs uppercase font-brand font-bold tracking-wider text-emerald-300">
                Foods to Include
              </h3>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>

          <p className="text-[11px] text-emerald-200/70 leading-relaxed">
            High-fiber, nutrient-dense ingredients with low glycemic index (&lt;55) that promote slow glucose absorption.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {guidelines.foodsToInclude.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 🟡 FOODS TO CONSUME IN MODERATION */}
        <div className="rounded-2xl bg-gradient-to-b from-[#1e1a0e] to-[#110e08] border border-amber-500/40 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <h3 className="text-xs uppercase font-brand font-bold tracking-wider text-amber-300">
                Foods in Moderation
              </h3>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>

          <p className="text-[11px] text-amber-200/70 leading-relaxed">
            Medium glycemic index items. Consume with measured portion control and paired with protein or fiber.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {guidelines.foodsInModeration.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 🔴 FOODS TO MINIMIZE */}
        <div className="rounded-2xl bg-gradient-to-b from-[#200f13] to-[#12080a] border border-rose-500/40 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
              <h3 className="text-xs uppercase font-brand font-bold tracking-wider text-rose-300">
                Foods to Minimize
              </h3>
            </div>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>

          <p className="text-[11px] text-rose-200/70 leading-relaxed">
            Refined carbohydrates, simple sugars, and deep-fried preparations that cause rapid postprandial glycemic spikes.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {guidelines.foodsToMinimize.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 7 FUNCTIONAL FOODS FOR DIABETES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-black/50 border border-[#d4af37]/30 text-[#d4af37]">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#f7d88c] font-brand">
              7 Functional Foods for Diabetes
            </h3>
          </div>
          <span className="text-xs text-gray-400">Nutraceutical Actives & Botanical Synergies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guidelines.functionalFoods.map((ff) => (
            <div
              key={ff.id}
              className="p-4 rounded-xl bg-[#0c100e] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#f7d88c] font-brand uppercase tracking-wider">
                    {ff.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#d4af37] bg-black/40 px-2 py-0.5 rounded border border-[#d4af37]/20">
                    Dosage: {ff.dosage}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{ff.mechanism}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Clinical Efficacy Validated</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 GENERAL INSTRUCTIONS FOR DIABETES */}
      <div className="p-6 rounded-2xl bg-[#0a0d0b] border border-[#d4af37]/40 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="text-xs uppercase font-brand font-bold tracking-[0.25em] text-[#d4af37]">
            5 General Instructions for Diabetes Management
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {guidelines.generalInstructions.map((ins, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#070908] border border-white/10 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#d4af37] font-bold">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{ins}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
