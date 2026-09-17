import React, { useState, useMemo } from 'react';
import { CustomDayPlan, CustomMealSlot, INITIAL_7_DAY_STUDIO_PLAN } from '../data/customStudio7DayPlans';
import { Edit3, Check, RotateCcw, Save, Calendar, Sparkles } from 'lucide-react';

interface Unified7DayClinicalDietTableProps {
  plans: CustomDayPlan[];
  onUpdatePlans?: (newPlans: CustomDayPlan[]) => void;
  clinicTitle?: string;
  sourceBadge?: string;
  categoryTag?: string;
  readOnly?: boolean;
}

interface SlotDefinition {
  key: string;
  label: string;
  timing: string;
  matcher: (slotName: string) => boolean;
}

export const Unified7DayClinicalDietTable: React.FC<Unified7DayClinicalDietTableProps> = ({
  plans,
  onUpdatePlans,
  clinicTitle = 'SPORTS MEDICINE CLINIC',
  sourceBadge = 'CLINICAL 7-DAY DIET PLAN',
  categoryTag = 'LOW GLYCEMIC FOODS',
  readOnly = false,
}) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Active plans fallback if empty
  const activePlans: CustomDayPlan[] = useMemo(() => {
    if (Array.isArray(plans) && plans.length >= 7) return plans;
    try {
      const saved = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) return parsed;
      }
    } catch {}
    return INITIAL_7_DAY_STUDIO_PLAN;
  }, [plans]);

  const [editingCell, setEditingCell] = useState<{
    dayIdx: number;
    slotKey: string;
    slotLabel: string;
    slotTime: string;
    currentValue: string;
  } | null>(null);

  const [editText, setEditText] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Define clinical meal slot order and matchers
  const slotDefinitions: SlotDefinition[] = useMemo(() => {
    const defs: SlotDefinition[] = [
      {
        key: 'early-morning',
        label: 'Early Morning',
        timing: '6:30 - 7:30 am',
        matcher: (name) => {
          const l = name.toLowerCase();
          return l.includes('early') || l.includes('wake') || l.includes('morning detox');
        },
      },
      {
        key: 'pre-workout',
        label: 'Pre-Workout (Optional)',
        timing: '7:00 am',
        matcher: (name) => name.toLowerCase().includes('pre-workout') || name.toLowerCase().includes('pre workout'),
      },
      {
        key: 'breakfast',
        label: 'Breakfast',
        timing: '8:30 - 9:00 am',
        matcher: (name) => name.toLowerCase().includes('breakfast'),
      },
      {
        key: 'mid-morning',
        label: 'Mid-Morning',
        timing: '11:00 am - 12:00 pm',
        matcher: (name) => {
          const l = name.toLowerCase();
          return l.includes('mid morning') || l.includes('mid-morning') || l.includes('mid-day');
        },
      },
      {
        key: 'post-workout',
        label: 'Post-Workout (Optional)',
        timing: '12:30 pm',
        matcher: (name) => name.toLowerCase().includes('post-workout') || name.toLowerCase().includes('post workout'),
      },
      {
        key: 'lunch',
        label: 'Lunch',
        timing: '1:30 - 2:30 pm',
        matcher: (name) => name.toLowerCase().includes('lunch'),
      },
      {
        key: 'evening',
        label: 'Evening Snack',
        timing: '5:00 - 5:30 pm',
        matcher: (name) => {
          const l = name.toLowerCase();
          return l.includes('evening') || (l.includes('snack') && !l.includes('mid'));
        },
      },
      {
        key: 'dinner',
        label: 'Dinner',
        timing: '7:30 - 8:30 pm',
        matcher: (name) => name.toLowerCase().includes('dinner'),
      },
      {
        key: 'bedtime',
        label: 'Bedtime',
        timing: '9:30 - 10:00 pm',
        matcher: (name) => {
          const l = name.toLowerCase();
          return l.includes('bed') || l.includes('night') || l.includes('sleep');
        },
      },
    ];

    // Check which optional slots actually exist in the plans
    return defs.filter((def) => {
      if (def.key === 'pre-workout' || def.key === 'post-workout') {
        return activePlans.some((day) => day.slots.some((s) => def.matcher(s.slotName)));
      }
      return true;
    });
  }, [activePlans]);

  // Helper to find a matching slot for a day
  const findDaySlot = (dayPlan: CustomDayPlan, def: SlotDefinition): CustomMealSlot | undefined => {
    return dayPlan.slots.find((s) => def.matcher(s.slotName));
  };

  // Helper to extract food text for a specific day and slot
  const getDayMealText = (dayIdx: number, def: SlotDefinition): string => {
    const day = activePlans[dayIdx];
    if (!day) return '-';
    const slot = findDaySlot(day, def);
    if (!slot || !slot.items || slot.items.length === 0) return '-';

    return slot.items
      .map((it) => {
        const portion = it.portionHousehold && !it.dishName.includes(it.portionHousehold)
          ? ` (${it.portionHousehold})`
          : '';
        return `${it.dishName}${portion}`;
      })
      .join('\n+ ');
  };

  // Get timing for the slot (from slot definition or first matching slot time)
  const getSlotTiming = (def: SlotDefinition): string => {
    for (const day of activePlans) {
      const slot = findDaySlot(day, def);
      if (slot && slot.time) return slot.time;
    }
    return def.timing;
  };

  // Start cell editing
  const handleStartEdit = (dayIdx: number, def: SlotDefinition) => {
    if (readOnly || !onUpdatePlans) return;
    const current = getDayMealText(dayIdx, def);
    setEditingCell({
      dayIdx,
      slotKey: def.key,
      slotLabel: def.label,
      slotTime: getSlotTiming(def),
      currentValue: current === '-' ? '' : current,
    });
    setEditText(current === '-' ? '' : current);
  };

  // Save edited cell
  const handleSaveEdit = () => {
    if (!editingCell || !onUpdatePlans) return;
    const { dayIdx, slotKey, slotLabel } = editingCell;
    const def = slotDefinitions.find((d) => d.key === slotKey);
    if (!def) return;

    const newPlans = activePlans.map((day, dIdx) => {
      if (dIdx !== dayIdx) return day;

      let found = false;
      const updatedSlots = day.slots.map((slot) => {
        if (def.matcher(slot.slotName)) {
          found = true;
          // Parse lines or split text to items if user typed with + or newlines
          const itemsText = editText.trim();
          return {
            ...slot,
            items: [
              {
                id: `it-${Date.now()}`,
                dishName: itemsText || 'Prescribed Meal',
                portionHousehold: 'Clinical Portion',
                weightGrams: 150,
                calories: slot.items[0]?.calories || slot.targetKcal || 200,
                protein: slot.items[0]?.protein || 10,
                fat: slot.items[0]?.fat || 5,
                carbs: slot.items[0]?.carbs || 30,
                fiber: slot.items[0]?.fiber || 5,
                glycemicStatus: 'Low GI (<55)' as const,
              },
            ],
          };
        }
        return slot;
      });

      // If slot didn't exist for that day, create it
      if (!found && editText.trim()) {
        updatedSlots.push({
          slotId: `slot-${Date.now()}-${slotKey}`,
          slotName: slotLabel,
          time: editingCell.slotTime,
          targetKcal: 200,
          items: [
            {
              id: `it-${Date.now()}`,
              dishName: editText.trim(),
              portionHousehold: 'Clinical Portion',
              weightGrams: 150,
              calories: 200,
              protein: 10,
              fat: 5,
              carbs: 30,
              fiber: 5,
              glycemicStatus: 'Low GI (<55)',
            },
          ],
        });
      }

      return {
        ...day,
        slots: updatedSlots,
      };
    });

    onUpdatePlans(newPlans);
    try {
      localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(newPlans));
      window.dispatchEvent(new Event('elsha-plan-updated'));
    } catch {}

    triggerToast(`Saved ${slotLabel} for ${dayNames[dayIdx]} to Rx Prescription & 7-Day Plan!`);
    setEditingCell(null);
    setEditText('');
  };

  // Reset to default ICMR 7-Day Plan (NOT the Karnataka photo preset)
  const handleResetToDefault7DayPlan = () => {
    if (!onUpdatePlans) return;
    const confirmed = window.confirm(
      'Reset all 7 days to the ICMR-calibrated South Indian clinical diet protocol?'
    );
    if (!confirmed) return;

    onUpdatePlans(INITIAL_7_DAY_STUDIO_PLAN);
    try {
      localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(INITIAL_7_DAY_STUDIO_PLAN));
      window.dispatchEvent(new Event('elsha-plan-updated'));
    } catch {}
    triggerToast('Reset to ICMR Clinical 7-Day Plan!');
  };

  return (
    <div className="w-full space-y-2 text-white font-sans">
      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0617] border-2 border-emerald-500 text-white p-3 rounded-xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Sub-header Controls Bar (hidden during PDF print) */}
      {!readOnly && onUpdatePlans && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 no-print">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-purple-900/60 border border-purple-400/40 text-purple-200 text-[10px] font-black uppercase tracking-wider rounded">
              {sourceBadge}
            </span>
            <span className="text-xs text-gray-300">
              One Consolidated 7-Day Table • Exact Recipes from 7-Day Diet Plan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault7DayPlan}
              className="py-1 px-3 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/50 text-purple-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Reset to the default clinical 7-day plan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-yellow-300" />
              <span>Reset to Default 7-Day Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* THE CONSOLIDATED 7-DAY TABLE: EXACT ALIGNMENT MATCHING REFERENCE CHART */}
      <div className="overflow-x-auto rounded-lg border-2 border-[#4a154b] shadow-2xl bg-[#090b14]">
        <table className="w-full text-left border-collapse min-w-[920px] table-fixed">
          {/* Column widths: Timings (12.5%), then 7 days (12.5% each) = 100% */}
          <colgroup>
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
          </colgroup>

          {/* PURPLE HEADER ROW: Timings | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday */}
          <thead>
            <tr className="bg-[#3b134d] text-white border-b-2 border-[#4a154b]">
              <th className="py-2.5 px-2.5 text-xs font-black uppercase tracking-wider border-r border-[#631f78] text-yellow-300">
                Timings & Meals
              </th>
              {dayNames.map((day, idx) => (
                <th
                  key={day}
                  className="py-2.5 px-2 text-xs font-black uppercase tracking-wider border-r border-[#631f78] last:border-r-0 text-center text-white"
                >
                  <div>Day {idx + 1}</div>
                  <div className="text-[10px] text-purple-200 font-medium lowercase tracking-normal">
                    {day}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-xs divide-y divide-[#2a133d]">
            {slotDefinitions.map((def, rowIdx) => {
              const rowBg = rowIdx % 2 === 0 ? 'bg-[#0b0312]' : 'bg-[#11061c]';
              const timing = getSlotTiming(def);

              return (
                <tr key={def.key} className={`${rowBg} hover:bg-[#180a26] transition-colors`}>
                  {/* Column 1: Timing & Meal Name */}
                  <td className="py-3 px-2.5 border-r border-[#4a154b] font-bold text-gray-200 align-top">
                    <div className="text-xs font-black text-purple-300 uppercase tracking-tight">
                      {def.label}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      {timing}
                    </div>
                  </td>

                  {/* Columns 2-8: Day 1 (Mon) to Day 7 (Sun) Exact Recipes */}
                  {dayNames.map((_, dayIdx) => {
                    const mealContent = getDayMealText(dayIdx, def);

                    return (
                      <td
                        key={dayIdx}
                        onClick={() => handleStartEdit(dayIdx, def)}
                        className={`py-2.5 px-2 border-r border-[#3a1242] last:border-r-0 align-top leading-tight text-[11px] text-gray-200 group relative ${
                          !readOnly ? 'cursor-pointer hover:bg-purple-950/50 hover:text-white' : ''
                        }`}
                        title={!readOnly ? `Click to edit Day ${dayIdx + 1} (${dayNames[dayIdx]}) ${def.label}` : undefined}
                      >
                        <div className="min-h-[52px] whitespace-pre-line break-words font-medium">
                          {mealContent}
                        </div>
                        {!readOnly && (
                          <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-purple-300 bg-purple-950/90 p-0.5 rounded border border-purple-500/40">
                            <Edit3 className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Daily Caloric & Macro Targets for each Day */}
          <tfoot>
            <tr className="bg-[#1f092b] border-t-2 border-[#4a154b] text-[10.5px] font-mono text-purple-200">
              <td className="py-2.5 px-2.5 border-r border-[#4a154b] font-bold uppercase text-yellow-300">
                Daily Totals
              </td>
              {dayNames.map((_, dayIdx) => {
                const dayPlan = activePlans[dayIdx];
                const totalKcal = dayPlan
                  ? dayPlan.slots.reduce(
                      (acc, s) => acc + s.items.reduce((iAcc, it) => iAcc + (it.calories || 0), 0),
                      0
                    )
                  : 1500;
                const totalProtein = dayPlan
                  ? Math.round(
                      dayPlan.slots.reduce(
                        (acc, s) => acc + s.items.reduce((iAcc, it) => iAcc + (it.protein || 0), 0),
                        0
                      )
                    )
                  : 65;

                return (
                  <td
                    key={dayIdx}
                    className="py-2 px-1.5 border-r border-[#4a154b] last:border-r-0 text-center"
                  >
                    <div className="font-black text-emerald-400">{totalKcal} kcal</div>
                    <div className="text-[9.5px] text-purple-300">P: {totalProtein}g</div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Direct Cell Edit Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-lg bg-[#100319] border-2 border-purple-500 rounded-2xl p-5 space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.5)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">
                  EDIT 7-DAY CLINICAL DIET TABLE
                </span>
                <h4 className="text-base font-black text-white">
                  Day {editingCell.dayIdx + 1} ({dayNames[editingCell.dayIdx]}) • {editingCell.slotLabel} ({editingCell.slotTime})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-200 mb-1.5">
                Exact Food Recipes & Portions (Will reflect in 7-Day Plan & Rx Prescription):
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl bg-black/80 border-2 border-purple-400/60 text-white text-xs focus:outline-none focus:border-purple-300 font-mono leading-relaxed"
                placeholder="e.g. Idli (3 nos) + Sambar (75g) + Coconut Chutney (2 tbsp)"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Whatever you type here is saved instantly to the 7-Day Diet Plan and displayed on Page 1 of the Rx Prescription.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-3.5 py-1.5 rounded-lg bg-black border border-white/20 text-gray-300 text-xs font-bold hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to 7-Day Diet & Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
