import React, { useState } from 'react';
import { MajorDomain, MajorDomainId } from '../types';
import {
  PERFORMANCE_PRIMARY_CATEGORIES,
  PERFORMANCE_OTHER_SUBCATEGORIES,
} from '../data/domainSymptomsData';
import {
  Stethoscope,
  ShieldAlert,
  Zap,
  Dumbbell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface DomainSelectorSectionProps {
  domains: MajorDomain[];
  selectedDomain: MajorDomainId;
  selectedCategory: string;
  onSelectDomain: (domainId: MajorDomainId) => void;
  onSelectCategory: (category: string) => void;
  onNavigateToRecipes?: () => void;
  onNavigateToSymptoms?: () => void;
}

export const DomainSelectorSection: React.FC<DomainSelectorSectionProps> = ({
  domains,
  selectedDomain,
  selectedCategory,
  onSelectDomain,
  onSelectCategory,
  onNavigateToRecipes,
  onNavigateToSymptoms,
}) => {
  const isSelectedSubCategory = (PERFORMANCE_OTHER_SUBCATEGORIES as readonly string[]).includes(selectedCategory);
  const [othersExpanded, setOthersExpanded] = useState<boolean>(() => {
    return selectedCategory === 'OTHERS' || isSelectedSubCategory;
  });

  const getDomainIcon = (id: MajorDomainId) => {
    switch (id) {
      case 'diseases':
        return <Stethoscope className="w-5 h-5 text-[#A855F7]" />;
      case 'disorders':
        return <ShieldAlert className="w-5 h-5 text-purple-400" />;
      case 'performance':
        return <Zap className="w-5 h-5 text-amber-300" />;
      case 'fitness':
        return <Dumbbell className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            Module 02 • Clinical Specialization
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Domain of Disease, Disorder, Fitness & Performance
          </h2>
          <p className="text-xs text-gray-400">
            Select the primary clinical domain to calibrate AI symptom assessments and therapeutic dietary guidelines.
          </p>
        </div>
        <div className="text-xs text-gray-300 font-mono bg-[#0d0617] px-3.5 py-1.5 border border-[#7E22CE] flex items-center gap-2">
          <span>Active Category:</span>
          <span className="text-[#C084FC] font-black uppercase">{selectedCategory}</span>
        </div>
      </div>

      {/* CHOOSE YOUR DOMAIN - 4 Major Domains Cards */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-bold tracking-widest text-[#A855F7]">
          Select Clinical Domain
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map((dom) => {
            const isSelected = selectedDomain === dom.id;
            return (
              <div
                key={dom.id}
                onClick={() => {
                  onSelectDomain(dom.id);
                  if (dom.id === 'performance') {
                    if (!PERFORMANCE_PRIMARY_CATEGORIES.includes(selectedCategory as any) &&
                        !PERFORMANCE_OTHER_SUBCATEGORIES.includes(selectedCategory as any)) {
                      onSelectCategory(PERFORMANCE_PRIMARY_CATEGORIES[0]);
                    }
                  } else if (!dom.categories.includes(selectedCategory)) {
                    onSelectCategory(dom.categories[0]);
                  }
                }}
                className={`relative cursor-pointer p-5 border transition-all duration-200 ${
                  isSelected
                    ? 'bg-white border-[#7E22CE] shadow-[0_0_20px_rgba(126,34,206,0.35)]'
                    : 'bg-white/80 border-purple-100 hover:border-[#7E22CE]/50 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-50 border border-purple-100">
                    {getDomainIcon(dom.id)}
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-purple-50 text-[#7E22CE] border border-purple-200 font-bold">
                    #{dom.code}
                  </span>
                </div>

                <div className="text-lg font-black tracking-wider uppercase text-black mb-3">
                  {dom.name}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[11px] text-gray-400 font-mono">
                    {dom.id === 'performance' ? '6 Disciplines + Sub-Sports' : `${dom.categories.length} Categories`}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 border transition-all ${
                      isSelected
                        ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                        : 'border-white/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-3 h-3" /> : '○'}
                    <span>{isSelected ? 'SELECTED' : 'SELECT'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOMAIN CATEGORIES Full Grid */}
      <div className="p-5 bg-[#0d0617] border border-[#7E22CE] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#A855F7]">
            Domain Categories Explorer
          </h3>
          <span className="text-[11px] text-gray-400 font-mono">
            Click any pathology or sport to calibrate symptoms assessment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {domains.map((dom) => {
            if (dom.id === 'performance') {
              return (
                <div key={dom.id} className="space-y-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                    <span className="w-2 h-2 bg-amber-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                      PERFORMANCE
                    </h4>
                  </div>
                  <div className="space-y-1">
                    {PERFORMANCE_PRIMARY_CATEGORIES.map((cat) => {
                      const isCatSelected = selectedCategory === cat;
                      if (cat === 'OTHERS') {
                        const isSubActive = (PERFORMANCE_OTHER_SUBCATEGORIES as readonly string[]).includes(selectedCategory);
                        const isOthersActive = isCatSelected || isSubActive;
                        return (
                          <div key="OTHERS" className="space-y-1 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectDomain('performance');
                                onSelectCategory('OTHERS');
                                setOthersExpanded(!othersExpanded);
                              }}
                              className={`w-full text-left py-1.5 px-2.5 text-xs transition-all flex items-center justify-between cursor-pointer rounded ${
                                isOthersActive
                                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/80 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-bold">OTHERS</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-950/80 border border-amber-600/60 text-amber-300 rounded">
                                  6 Sports
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {isOthersActive && (
                                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                )}
                                {othersExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-amber-300" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </div>
                            </button>

                            {/* OTHERS Sub-Headings Accordion Panel */}
                            {othersExpanded && (
                              <div className="pl-2 pr-1 py-1.5 bg-purple-950/60 border-l-2 border-amber-400 space-y-1 rounded-r-lg animate-in fade-in duration-150">
                                <div className="text-[9px] uppercase font-mono font-bold text-amber-300/90 tracking-wider pb-1 px-1 flex items-center justify-between border-b border-purple-800/50">
                                  <span>OTHERS Sub-Headings:</span>
                                  <span className="text-[8px] text-gray-400">Click to Select</span>
                                </div>
                                {PERFORMANCE_OTHER_SUBCATEGORIES.map((subCat) => {
                                  const isSubSelected = selectedCategory === subCat;
                                  return (
                                    <button
                                      key={subCat}
                                      type="button"
                                      onClick={() => {
                                        onSelectDomain('performance');
                                        onSelectCategory(subCat);
                                      }}
                                      className={`w-full text-left py-1 px-2 text-[11px] transition-all flex items-center justify-between cursor-pointer rounded ${
                                        isSubSelected
                                          ? 'bg-amber-400 text-black font-black shadow-md'
                                          : 'text-purple-200 hover:text-white hover:bg-purple-900/60'
                                      }`}
                                    >
                                      <span className="font-semibold uppercase tracking-wider">{subCat}</span>
                                      {isSubSelected && (
                                        <CheckCircle2 className="w-3 h-3 text-black shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            onSelectDomain('performance');
                            onSelectCategory(cat);
                          }}
                          className={`w-full text-left py-1.5 px-2.5 text-xs transition-all flex items-center justify-between cursor-pointer rounded ${
                            isCatSelected
                              ? 'bg-[#7E22CE]/40 text-white border border-[#7E22CE] font-bold shadow-[0_0_8px_rgba(126,34,206,0.3)]'
                              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          {isCatSelected && (
                            <span className="w-1.5 h-1.5 bg-[#A855F7] rounded-full animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div key={dom.id} className="space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                  <span className="w-2 h-2 bg-[#7E22CE]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#C084FC]">
                    {dom.name}
                  </h4>
                </div>
                <div className="space-y-1">
                  {dom.categories.map((cat) => {
                    const isCatSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onSelectDomain(dom.id);
                          onSelectCategory(cat);
                        }}
                        className={`w-full text-left py-1.5 px-2.5 text-xs transition-all flex items-center justify-between cursor-pointer rounded ${
                          isCatSelected
                            ? 'bg-[#7E22CE]/40 text-white border border-[#7E22CE] font-bold shadow-[0_0_8px_rgba(126,34,206,0.3)]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {isCatSelected && (
                          <span className="w-1.5 h-1.5 bg-[#A855F7] rounded-full animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-purple-950/40 p-4 border border-purple-800/60 rounded-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="text-xs text-white font-extrabold flex items-center gap-2">
                  <span>Selected Condition:</span>
                  <span className="text-amber-300 uppercase px-2 py-0.5 bg-black/60 border border-amber-400/50 rounded font-mono font-black">
                    {selectedCategory}
                  </span>
                </div>
                <div className="text-[11px] text-purple-300 font-mono">
                  Module 02 calibrated • Symptoms Assessment & Dietary Protocols ready
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {onNavigateToSymptoms && (
                <button
                  type="button"
                  onClick={onNavigateToSymptoms}
                  className="px-4 py-2 bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6b1dae] hover:to-[#7E22CE] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(126,34,206,0.5)] rounded-lg active:scale-[0.98]"
                >
                  <Activity className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Open Symptoms Assessment for {selectedCategory} →</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              )}
              {onNavigateToRecipes && (
                <button
                  type="button"
                  onClick={onNavigateToRecipes}
                  className="px-3.5 py-2 bg-black hover:bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer rounded-lg"
                >
                  <span>View Recipe Matrix →</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
