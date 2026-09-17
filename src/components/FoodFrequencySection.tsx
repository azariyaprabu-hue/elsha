import React, { useState } from 'react';
import { FoodFrequencyCategory } from '../types';
import { Plus, ListFilter, Trash2 } from 'lucide-react';

interface FoodFrequencySectionProps {
  categories: FoodFrequencyCategory[];
  onUpdateItemFrequency: (categoryId: string, itemId: string, frequency: string) => void;
  onAddFoodItem: (categoryId: string, foodName: string) => void;
  onRemoveFoodItem: (categoryId: string, itemId: string) => void;
}

export const FoodFrequencySection: React.FC<FoodFrequencySectionProps> = ({
  categories,
  onUpdateItemFrequency,
  onAddFoodItem,
  onRemoveFoodItem,
}) => {
  const [activeNewItemInput, setActiveNewItemInput] = useState<string | null>(null);
  const [newFoodName, setNewFoodName] = useState('');

  const handleAddSubmit = (categoryId: string) => {
    if (newFoodName.trim()) {
      onAddFoodItem(categoryId, newFoodName.trim());
      setNewFoodName('');
      setActiveNewItemInput(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            Module 13 • Dietary Habit Quantification
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Food Frequency Assessment (FFQ)
          </h2>
          <p className="text-xs text-gray-400">
            Audit recurring consumption frequencies across 10 major food categories.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#A855F7] bg-[#0d0617] px-3.5 py-1.5 border border-[#7E22CE]">
          <ListFilter className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-wider">10 Major Food Groups Classified</span>
        </div>
      </div>

      {/* 10 Food Group Categories */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 bg-[#0d0617] border border-[#7E22CE]/60 hover:border-[#7E22CE] space-y-4 transition-all"
          >
            {/* Category Title & Add Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#7E22CE]" />
                <h3 className="text-xs uppercase font-black tracking-widest text-white">
                  {cat.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveNewItemInput(activeNewItemInput === cat.id ? null : cat.id);
                  setNewFoodName('');
                }}
                className="py-1 px-3 border border-[#7E22CE] text-[#C084FC] hover:bg-[#7E22CE] hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ ADD FOOD</span>
              </button>
            </div>

            {/* Quick Add Inline Form */}
            {activeNewItemInput === cat.id && (
              <div className="p-3 bg-black border border-[#7E22CE] flex items-center gap-2">
                <input
                  type="text"
                  value={newFoodName ?? ''}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSubmit(cat.id);
                  }}
                  placeholder={`Enter food item for ${cat.title}...`}
                  className="flex-1 bg-[#0d0617] border border-white/20 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleAddSubmit(cat.id)}
                  className="py-1.5 px-4 bg-[#7E22CE] text-white text-xs font-bold uppercase cursor-pointer hover:bg-[#9333EA]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNewItemInput(null)}
                  className="text-gray-400 hover:text-white text-xs px-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-black border border-white/10 hover:border-[#7E22CE]/60 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[11px] font-bold text-gray-200 tracking-wider uppercase leading-tight">
                      {item.name}
                    </span>
                    {cat.items.length > 5 && (
                      <button
                        type="button"
                        onClick={() => onRemoveFoodItem(cat.id, item.id)}
                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Frequency Input & Quick Select Options */}
                  <div className="space-y-1.5 pt-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={item.frequency ?? ''}
                        onChange={(e) => onUpdateItemFrequency(cat.id, item.id, e.target.value)}
                        placeholder="Type frequency (e.g. 4/Week)..."
                        className="w-full bg-[#0d0617] border border-white/15 focus:border-[#7E22CE] py-1 px-2 text-[11px] text-[#C084FC] font-mono placeholder:text-gray-600 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Quick Options: Daily, Weekly, Rarely, 4/Week */}
                    <div className="flex flex-wrap items-center gap-1">
                      {['Daily', 'Weekly', 'Rarely', '4/Week'].map((opt) => {
                        const isSelected = (item.frequency ?? '').trim().toLowerCase() === opt.toLowerCase();
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => onUpdateItemFrequency(cat.id, item.id, opt)}
                            className={`px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-[#7E22CE] text-white border-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                                : 'bg-black/60 text-gray-400 border-white/10 hover:text-white hover:border-[#7E22CE]/60'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
