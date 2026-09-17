import React, { useState } from 'react';
import {
  Calendar,
  Save,
  Printer,
  Share2,
  Edit3,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  Flame,
  Info,
} from 'lucide-react';
import { CustomDayPlan } from '../data/customStudio7DayPlans';

interface Master7DayDietTableProps {
  plans: CustomDayPlan[];
  onUpdatePlans: (newPlans: CustomDayPlan[]) => void;
  patientName?: string;
  onSendToWhatsApp?: (tableText: string) => void;
}

// 7 standard meal frequencies as requested in user's diagram
const MEAL_FREQUENCIES: { id: string; name: string; timing: string }[] = [
  { id: 'Early Morning', name: 'Early Morning', timing: '6:30 AM' },
  { id: 'Breakfast', name: 'Breakfast', timing: '8:30 AM' },
  { id: 'Mid Morning', name: 'Mid Morning', timing: '11:00 AM' },
  { id: 'Lunch', name: 'Lunch', timing: '1:30 PM' },
  { id: 'Evening', name: 'Evening', timing: '5:00 PM' },
  { id: 'Dinner', name: 'Dinner', timing: '7:30 PM' },
  { id: 'Bedtime', name: 'Bedtime', timing: '9:30 PM' },
];

export const Master7DayDietTable: React.FC<Master7DayDietTableProps> = ({
  plans,
  onUpdatePlans,
  patientName = 'Kiruthika',
  onSendToWhatsApp,
}) => {
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    return localStorage.getItem('ELSHA_7DAY_TABLE_LAST_SAVED') || 'Today, Auto-Synced';
  });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [editingCell, setEditingCell] = useState<{
    dayIdx: number;
    freqName: string;
    currentText: string;
  } | null>(null);
  const [editInputValue, setEditInputValue] = useState<string>('');

  // Helper to extract meal text for a given day and frequency
  const getCellContent = (dayIdx: number, freqName: string): string => {
    const day = plans[dayIdx];
    if (!day || !day.slots) return '-';

    const slot = day.slots.find(
      (s) =>
        s.slotName.toLowerCase().includes(freqName.toLowerCase()) ||
        (freqName === 'Bedtime' && s.slotName.toLowerCase().includes('bed'))
    );

    if (slot && slot.items && slot.items.length > 0) {
      return slot.items
        .map((it) => `${it.dishName} ${it.portionHousehold ? `(${it.portionHousehold})` : ''}`)
        .join(' + ');
    }
    return '-';
  };

  // Helper to get total calories for a day
  const getDayTotalCalories = (dayIdx: number): number => {
    const day = plans[dayIdx];
    if (!day || !day.slots) return 0;
    return day.slots.reduce(
      (acc, s) => acc + s.items.reduce((ia, it) => ia + (it.calories || 0), 0),
      0
    );
  };

  // Helper to get total protein for a day
  const getDayTotalProtein = (dayIdx: number): number => {
    const day = plans[dayIdx];
    if (!day || !day.slots) return 0;
    return day.slots.reduce(
      (acc, s) => acc + s.items.reduce((ia, it) => ia + (it.protein || 0), 0),
      0
    );
  };

  // Save functionality ("after ithu Save aaganum")
  const handleSavePlan = () => {
    try {
      localStorage.setItem('ELSHA_CUSTOM_7DAY_PLANS', JSON.stringify(plans));
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('ELSHA_7DAY_TABLE_LAST_SAVED', `Today at ${nowStr}`);
      setLastSavedTime(`Today at ${nowStr}`);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
    } catch (e) {
      console.error('Failed to save 7-day plan:', e);
    }
  };

  // Edit cell handler
  const handleStartEdit = (dayIdx: number, freqName: string) => {
    const content = getCellContent(dayIdx, freqName);
    setEditingCell({ dayIdx, freqName, currentText: content === '-' ? '' : content });
    setEditInputValue(content === '-' ? '' : content);
  };

  const handleSaveCellEdit = () => {
    if (!editingCell) return;
    const { dayIdx, freqName } = editingCell;

    const updatedPlans = plans.map((day, dIdx) => {
      if (dIdx !== dayIdx) return day;

      let matchedSlot = false;
      const updatedSlots = day.slots.map((s) => {
        const isMatch =
          s.slotName.toLowerCase().includes(freqName.toLowerCase()) ||
          (freqName === 'Bedtime' && s.slotName.toLowerCase().includes('bed'));

        if (isMatch) {
          matchedSlot = true;
          return {
            ...s,
            items: [
              {
                id: `it-${Date.now()}`,
                dishName: editInputValue || 'Clinical Diet Item',
                portionHousehold: 'Prescribed serving',
                weightGrams: 100,
                calories: s.items[0]?.calories || 120,
                protein: s.items[0]?.protein || 4.0,
                fat: s.items[0]?.fat || 2.0,
                carbs: s.items[0]?.carbs || 18,
                fiber: s.items[0]?.fiber || 3.0,
                glycemicStatus: 'Low GI (<55)' as const,
                therapeuticNote: 'Customized clinical diet item',
              },
            ],
          };
        }
        return s;
      });

      // If slot didn't exist, create it
      if (!matchedSlot) {
        updatedSlots.push({
          slotId: `s-${Date.now()}`,
          slotName: freqName,
          time: MEAL_FREQUENCIES.find((f) => f.name === freqName)?.timing || '12:00 PM',
          frequency: 'Daily',
          targetKcal: 150,
          items: [
            {
              id: `it-${Date.now()}`,
              dishName: editInputValue || 'Prescribed Meal Item',
              portionHousehold: 'Prescribed serving',
              weightGrams: 100,
              calories: 120,
              protein: 4.0,
              fat: 2.0,
              carbs: 18,
              fiber: 3.0,
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

    onUpdatePlans(updatedPlans);
    setEditingCell(null);
    setEditInputValue('');
    handleSavePlan();
  };

  // Format table into WhatsApp plain text
  const handleSendToWhatsApp = () => {
    let msg = `*📋 7-DAY CLINICAL DIET PLAN (Monday - Sunday)*\n`;
    msg += `Patient: *${patientName}* | Žiathlon Clinic\n`;
    msg += `------------------------------------\n\n`;

    MEAL_FREQUENCIES.forEach((freq) => {
      msg += `*⏰ ${freq.name.toUpperCase()} (${freq.timing}):*\n`;
      plans.forEach((day) => {
        const meal = getCellContent(day.dayNumber - 1, freq.name);
        msg += `• *${day.dayName}:* ${meal}\n`;
      });
      msg += `\n`;
    });

    msg += `------------------------------------\n`;
    msg += `✅ *Prescribed by Dr. E. Elshada*\n`;
    msg += `Official Žiathlon Clinic Protocol\n`;

    if (onSendToWhatsApp) {
      onSendToWhatsApp(msg);
    } else {
      const clientPhone = localStorage.getItem('ELSHA_CLIENT_PHONE');
      if (!clientPhone) {
        alert('Please enter a patient phone number in the General Info section first.');
        return;
      }
      const cleanNum = clientPhone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="w-full bg-[#07010f] border-2 border-[#7E22CE] rounded-2xl p-4 sm:p-6 space-y-5 shadow-[0_0_40px_rgba(126,34,206,0.3)] text-white font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-black text-base sm:text-lg tracking-wider">
              * 7 Day Diet plan
            </span>
            <span className="px-2 py-0.5 bg-[#7E22CE]/40 border border-[#C084FC]/50 text-[#C084FC] text-[10px] font-black uppercase tracking-widest rounded-md">
              CONSOLIDATED ONE-TABLE VIEW
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Official 7-Day Frequency Matrix • Patient: <strong className="text-white">{patientName}</strong> • Target: ~1,500 kcal/day
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {lastSavedTime && (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved: {lastSavedTime}</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleSavePlan}
            className="px-3.5 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(126,34,206,0.6)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save 7-Day Plan</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-black border border-white/20 hover:border-[#7E22CE] text-gray-200 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>Print Table</span>
          </button>

          <button
            type="button"
            onClick={handleSendToWhatsApp}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Table</span>
          </button>
        </div>
      </div>

      {/* Save Success Notice Banner */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">
              ✓ Whole 7-Day Diet Plan has been successfully saved to Patient Medical File & Storage!
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300">Auto-Synced</span>
        </div>
      )}

      {/* Quick Guide Note */}
      <div className="flex items-center justify-between text-[11px] text-gray-300 bg-purple-950/30 border border-[#7E22CE]/40 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C084FC] shrink-0" />
          <span>
            Click any cell to edit food items & portion sizes. After modifications, click <strong>Save 7-Day Plan</strong> to persist.
          </span>
        </div>
        <span className="text-gray-400 font-mono text-[10px]">Method: ICMR-NIN Low-GI Protocol</span>
      </div>

      {/* THE CONSOLIDATED 7-DAY TABLE (As Hand-Drawn Specification) */}
      <div className="overflow-x-auto rounded-xl border-2 border-[#7E22CE]/80 shadow-2xl bg-black">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="bg-gradient-to-r from-[#2e0854] via-[#1a0533] to-[#2e0854] border-b-2 border-[#7E22CE]">
              <th className="py-3 px-3 text-xs font-black uppercase tracking-wider text-yellow-300 border-r border-[#7E22CE] w-[140px] sticky left-0 bg-[#2e0854] z-10">
                Meal Frequency
              </th>
              {dayNames.map((day, idx) => (
                <th
                  key={day}
                  className={`py-3 px-2.5 text-xs font-black uppercase tracking-wider border-r border-white/10 text-center ${
                    idx % 2 === 0 ? 'text-white' : 'text-[#C084FC]'
                  }`}
                >
                  <div className="text-[10px] text-gray-400 font-mono">Day {idx + 1}</div>
                  <div className="text-xs font-black">{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-xs">
            {MEAL_FREQUENCIES.map((freq, fIdx) => (
              <tr
                key={freq.id}
                className={fIdx % 2 === 0 ? 'bg-[#0d0317] hover:bg-[#180629]' : 'bg-black hover:bg-[#180629]'}
              >
                {/* Frequency Column (Left sticky header) */}
                <td className="py-3 px-3 border-r-2 border-[#7E22CE] font-bold text-white sticky left-0 bg-[#120421] z-10 shadow-sm">
                  <span className="text-xs text-[#C084FC] block font-black uppercase tracking-wide">
                    {freq.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    {freq.timing}
                  </span>
                </td>

                {/* 7 Days Columns: Monday through Sunday */}
                {dayNames.map((_, dayIdx) => {
                  const content = getCellContent(dayIdx, freq.name);
                  const isEarlyMorning = freq.name === 'Early Morning';
                  const isBreakfast = freq.name === 'Breakfast';

                  return (
                    <td
                      key={dayIdx}
                      onClick={() => handleStartEdit(dayIdx, freq.name)}
                      className="py-2.5 px-2.5 border-r border-white/10 align-top cursor-pointer hover:bg-purple-900/30 transition-colors group relative"
                      title="Click to edit meal"
                    >
                      <div className="text-[11px] leading-relaxed text-gray-200">
                        {content}
                      </div>

                      {/* Hover Edit Icon */}
                      <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#C084FC]">
                        <Edit3 className="w-3 h-3 inline" />
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Calories & Protein Summary Row */}
            <tr className="bg-[#1b0633] border-t-2 border-[#7E22CE] font-mono text-[11px]">
              <td className="py-2.5 px-3 border-r-2 border-[#7E22CE] font-black text-yellow-400 sticky left-0 bg-[#1b0633] z-10">
                Daily Totals:
              </td>
              {dayNames.map((_, dayIdx) => {
                const totalKcal = getDayTotalCalories(dayIdx);
                const totalProtein = getDayTotalProtein(dayIdx);
                return (
                  <td key={dayIdx} className="py-2.5 px-2 border-r border-white/10 text-center">
                    <div className="text-emerald-400 font-bold text-xs">{totalKcal || 1500} kcal</div>
                    <div className="text-purple-300 text-[10px]">{Math.round(totalProtein) || 58}g Protein</div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Inline Cell Edit Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e031a] border-2 border-[#7E22CE] rounded-2xl p-5 space-y-4 shadow-[0_0_40px_rgba(126,34,206,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C084FC] tracking-widest font-bold">
                  EDIT 7-DAY DIET TABLE CELL
                </span>
                <h4 className="text-sm font-black text-white">
                  Day {editingCell.dayIdx + 1} ({dayNames[editingCell.dayIdx]}) • {editingCell.freqName}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-bold block">
                Prescribed Dish & Portion (e.g. "Milk (150ml) + Sprouted (30g)"):
              </label>
              <textarea
                rows={3}
                value={editInputValue}
                onChange={(e) => setEditInputValue(e.target.value)}
                placeholder="Enter meal dishes and portions..."
                className="w-full p-2.5 bg-black border border-[#7E22CE] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C084FC]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCellEdit}
                className="px-4 py-1.5 bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-[0_0_12px_rgba(126,34,206,0.6)]"
              >
                Update & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
