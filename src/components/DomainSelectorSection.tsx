import React from 'react';
import { MajorDomain, MajorDomainId } from '../types';
import { Stethoscope, ShieldAlert, Zap, Dumbbell, CheckCircle2 } from 'lucide-react';

interface DomainSelectorSectionProps {
  domains: MajorDomain[];
  selectedDomain: MajorDomainId;
  selectedCategory: string;
  onSelectDomain: (domainId: MajorDomainId) => void;
  onSelectCategory: (category: string) => void;
  onNavigateToRecipes?: () => void;
}

export const DomainSelectorSection: React.FC<DomainSelectorSectionProps> = ({
  domains,
  selectedDomain,
  selectedCategory,
  onSelectDomain,
  onSelectCategory,
  onNavigateToRecipes,
}) => {
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
        <div className="text-xs text-gray-300 font-mono bg-[#0d0617] px-3.5 py-1.5 border border-[#7E22CE]">
          Active Category: <span className="text-[#C084FC] font-bold">{selectedCategory}</span>
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
                  if (!dom.categories.includes(selectedCategory)) {
                    onSelectCategory(dom.categories[0]);
                  }
                }}
                className={`relative cursor-pointer p-5 border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#0d0617] border-[#7E22CE] shadow-[0_0_20px_rgba(126,34,206,0.35)]'
                    : 'bg-black/60 border-white/10 hover:border-[#7E22CE]/50 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-black border border-white/10">
                    {getDomainIcon(dom.id)}
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-black text-[#A855F7] border border-[#7E22CE]/40 font-bold">
                    #{dom.code}
                  </span>
                </div>

                <div className="text-sm font-bold tracking-wider uppercase text-white mb-3">
                  {dom.code}. {dom.name}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[11px] text-gray-400 font-mono">
                    {dom.categories.length} Categories
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
            Click any pathology or fitness domain to calibrate symptoms assessment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((dom) => (
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
                      className={`w-full text-left py-1.5 px-2.5 text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isCatSelected
                          ? 'bg-[#7E22CE]/30 text-white border border-[#7E22CE] font-bold shadow-[0_0_8px_rgba(126,34,206,0.3)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isCatSelected && (
                        <span className="w-1.5 h-1.5 bg-[#A855F7] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-purple-950/20 p-3 border border-purple-800/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white font-bold">
                Active Selection: <span className="text-[#C084FC] uppercase">{selectedCategory}</span>
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">
                • 20-Option Recipe Poster Matrix Configured (100 Dishes)
              </span>
            </div>
            {onNavigateToRecipes && (
              <button
                type="button"
                onClick={onNavigateToRecipes}
                className="px-3 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(126,34,206,0.4)]"
              >
                <span>View {selectedCategory} 20-Option Recipe Table →</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
