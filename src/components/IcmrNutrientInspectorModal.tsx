import React from 'react';
import {
  GeneralInfo,
  NutrientBreakdown,
  RecipeIngredientItem,
} from '../types';
import { getIcmrRdaRequirements, calculateIcmrAdequacy } from '../utils/icmrCalculator';
import { X, ShieldCheck, Flame, Zap, Award, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface IcmrNutrientInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  weightGrams: number;
  nutrients: NutrientBreakdown;
  generalInfo: GeneralInfo;
  clinicalHighlight?: string;
}

export const IcmrNutrientInspectorModal: React.FC<IcmrNutrientInspectorModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  weightGrams,
  nutrients,
  generalInfo,
  clinicalHighlight,
}) => {
  if (!isOpen) return null;

  const rda = getIcmrRdaRequirements(generalInfo);
  const adequacyRows = calculateIcmrAdequacy(nutrients, rda);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#080c0a] border-2 border-[#C5A028] shadow-[0_0_40px_rgba(197,160,40,0.25)] text-white overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5A028]/40 bg-[#050706] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C5A028] text-black">
                ICMR IFCT Clinical Profile
              </span>
              <span className="text-xs text-gray-400 font-mono">Portion: {weightGrams}g</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide mt-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#f7d88c] font-mono mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Clinical Highlight */}
          {clinicalHighlight && (
            <div className="p-3 bg-[#111914] border border-[#C5A028]/40 text-xs text-[#f7d88c] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">ICMR Bioactive Mechanism: </span>
                {clinicalHighlight}
              </div>
            </div>
          )}

          {/* Quick Macro Bar */}
          <div className="p-4 bg-[#111613] border border-white/10 grid grid-cols-5 gap-2 text-center font-mono">
            <div className="p-2 bg-black/40 border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Energy</div>
              <div className="text-base font-bold text-white">{nutrients.calories} kcal</div>
            </div>
            <div className="p-2 bg-black/40 border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Carbs</div>
              <div className="text-base font-bold text-[#f7d88c]">{nutrients.carbs}g</div>
            </div>
            <div className="p-2 bg-black/40 border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Protein</div>
              <div className="text-base font-bold text-emerald-300">{nutrients.protein}g</div>
            </div>
            <div className="p-2 bg-black/40 border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Fat</div>
              <div className="text-base font-bold text-amber-300">{nutrients.fat}g</div>
            </div>
            <div className="p-2 bg-black/40 border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Fiber</div>
              <div className="text-base font-bold text-indigo-300">{nutrients.fiber}g</div>
            </div>
          </div>

          {/* Comprehensive ICMR Nutrient Audit Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-gray-400">
                ICMR 2020/2024 Nutrient Contribution Analysis
              </span>
              <span className="text-[10px] font-mono text-[#C5A028]">
                Patient: {generalInfo.name} ({generalInfo.sex}, {generalInfo.weight}kg)
              </span>
            </div>

            <div className="border border-white/10 overflow-hidden bg-[#070a08]">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-[#C5A028]/40 bg-black text-[#C5A028] text-[10px] uppercase">
                    <th className="py-2.5 px-3">Nutrient</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Daily ICMR RDA</th>
                    <th className="py-2.5 px-3 text-center">% of RDA Provided</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11px]">
                  {adequacyRows.map((row, idx) => {
                    const percentMet = Math.min(100, Math.max(0, row.percentMet));
                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-white font-medium">{row.nutrient}</td>
                        <td className="py-2 px-3 text-[#f7d88c] font-bold">
                          {row.consumed} {row.unit}
                        </td>
                        <td className="py-2 px-3 text-gray-400">
                          {row.target} {row.unit}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-20 bg-black h-2 rounded-full overflow-hidden border border-white/10 hidden sm:block">
                              <div
                                className="bg-[#C5A028] h-full rounded-full transition-all"
                                style={{ width: `${percentMet}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-white min-w-[3rem] text-right">
                              {row.percentMet}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#050706] flex items-center justify-between">
          <div className="text-[10px] text-gray-500 font-mono">
            Verified Indian Food Composition Tables (IFCT 2017) • ICMR-NIN Hyderabad
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
