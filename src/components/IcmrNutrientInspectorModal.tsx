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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-purple-200 shadow-2xl rounded-2xl text-gray-950 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 bg-purple-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#7E22CE] text-white rounded-md">
                ICMR IFCT Clinical Profile
              </span>
              <span className="text-xs text-gray-600 font-mono font-bold">Portion: {weightGrams}g</span>
            </div>
            <h3 className="text-lg font-black text-gray-950 tracking-wide mt-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#7E22CE] font-mono font-semibold mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-950 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Clinical Highlight */}
          {clinicalHighlight && (
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-gray-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#7E22CE] shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-[#7E22CE]">ICMR Bioactive Mechanism: </span>
                {clinicalHighlight}
              </div>
            </div>
          )}

          {/* Quick Macro Bar */}
          <div className="p-4 bg-purple-50/40 border border-purple-200 rounded-xl grid grid-cols-5 gap-2 text-center font-mono">
            <div className="p-2 bg-white border border-purple-200 rounded-lg">
              <div className="text-[10px] text-gray-600 uppercase font-bold">Energy</div>
              <div className="text-base font-black text-gray-950">{nutrients.calories} kcal</div>
            </div>
            <div className="p-2 bg-white border border-purple-200 rounded-lg">
              <div className="text-[10px] text-gray-600 uppercase font-bold">Carbs</div>
              <div className="text-base font-black text-[#7E22CE]">{nutrients.carbs}g</div>
            </div>
            <div className="p-2 bg-white border border-purple-200 rounded-lg">
              <div className="text-[10px] text-gray-600 uppercase font-bold">Protein</div>
              <div className="text-base font-black text-emerald-800">{nutrients.protein}g</div>
            </div>
            <div className="p-2 bg-white border border-purple-200 rounded-lg">
              <div className="text-[10px] text-gray-600 uppercase font-bold">Fat</div>
              <div className="text-base font-black text-amber-800">{nutrients.fat}g</div>
            </div>
            <div className="p-2 bg-white border border-purple-200 rounded-lg">
              <div className="text-[10px] text-gray-600 uppercase font-bold">Fiber</div>
              <div className="text-base font-black text-purple-900">{nutrients.fiber}g</div>
            </div>
          </div>

          {/* Comprehensive ICMR Nutrient Audit Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-gray-600 font-bold">
                ICMR 2020/2024 Nutrient Contribution Analysis
              </span>
              <span className="text-[10px] font-mono text-[#7E22CE] font-bold">
                Patient: {generalInfo.name} ({generalInfo.sex}, {generalInfo.weight}kg)
              </span>
            </div>

            <div className="border border-purple-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-purple-200 bg-purple-50 text-[#7E22CE] text-[10px] uppercase font-bold">
                    <th className="py-2.5 px-3">Nutrient</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Daily ICMR RDA</th>
                    <th className="py-2.5 px-3 text-center">% of RDA Provided</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 text-[11px]">
                  {adequacyRows.map((row, idx) => {
                    const percentMet = Math.min(100, Math.max(0, row.percentMet));
                    return (
                      <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
                        <td className="py-2 px-3 text-gray-950 font-bold">{row.nutrient}</td>
                        <td className="py-2 px-3 text-[#7E22CE] font-black">
                          {row.consumed} {row.unit}
                        </td>
                        <td className="py-2 px-3 text-gray-600">
                          {row.target} {row.unit}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-20 bg-purple-100 h-2 rounded-full overflow-hidden border border-purple-200 hidden sm:block">
                              <div
                                className="bg-[#7E22CE] h-full rounded-full transition-all"
                                style={{ width: `${percentMet}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-gray-950 min-w-[3rem] text-right">
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
        <div className="p-4 border-t border-purple-100 bg-purple-50 flex items-center justify-between">
          <div className="text-[10px] text-gray-600 font-mono font-medium">
            Verified Indian Food Composition Tables (IFCT 2017) • ICMR-NIN Hyderabad
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
