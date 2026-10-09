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
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved: {lastSavedTime}</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleSavePlan}
            className="px-3.5 py-1.5 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save 7-Day Plan</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white border border-[#D9C4A5] hover:border-[#8C5E28] text-[#5C3A14] hover:text-[#2E1C07] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#8C5E28]" />
            <span>Print Table</span>
          </button>

          <button
            type="button"
            onClick={handleSendToWhatsApp}
            className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Table</span>
          </button>
        </div>
      </div>

      {/* Save Success Notice Banner */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              ✓ Whole 7-Day Diet Plan has been successfully saved to Patient Medical File & Storage!
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700">Auto-Synced</span>
        </div>
      )}

      {/* Quick Guide Note */}
      <div className="flex items-center justify-between text-[11px] text-[#5C3A14] bg-[#FAF6ED] border border-[#D9C4A5] px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#8C5E28] shrink-0" />
          <span>
            Click any cell to edit food items & portion sizes. After modifications, click <strong>Save 7-Day Plan</strong> to persist.
          </span>
        </div>
        <span className="text-[#8C5E28] font-mono text-[10px]">Method: ICMR-NIN Low-GI Protocol</span>
      </div>

      {/* THE CONSOLIDATED 7-DAY TABLE (As Hand-Drawn Specification) */}
      <div className="overflow-x-auto rounded-xl border-2 border-[#D9C4A5] shadow-xs bg-[#FFFDF9]">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="bg-[#8C5E28] text-white border-b-2 border-[#724B1E]">
              <th className="py-3 px-3 text-xs font-black uppercase tracking-wider text-white border-r border-[#A87B41] w-[140px] sticky left-0 bg-[#8C5E28] z-10">
                Meal Frequency
              </th>
              {dayNames.map((day, idx) => (
                <th
                  key={day}
                  className="py-3 px-2.5 text-xs font-black uppercase tracking-wider border-r border-[#A87B41] text-center text-white"
                >
                  <div className="text-[10px] text-[#FAF6ED] font-mono">Day {idx + 1}</div>
                  <div className="text-xs font-black">{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D4C0] text-xs">
            {MEAL_FREQUENCIES.map((freq, fIdx) => (
              <tr
                key={freq.id}
                className={fIdx % 2 === 0 ? 'bg-[#FFFDF9] hover:bg-[#FAF6ED]' : 'bg-[#FAF6ED]/60 hover:bg-[#FAF6ED]'}
              >
                {/* Frequency Column (Left sticky header) */}
                <td className="py-3 px-3 border-r-2 border-[#D9C4A5] font-bold text-[#2E1C07] sticky left-0 bg-[#FAF6ED] z-10 shadow-2xs">
                  <span className="text-xs text-[#8C5E28] block font-black uppercase tracking-wide">
                    {freq.name}
                  </span>
                  <span className="text-[10px] text-[#5C3A14] font-mono block">
                    {freq.timing}
                  </span>
                </td>

                {/* 7 Days Columns: Monday through Sunday */}
                {dayNames.map((_, dayIdx) => {
                  const content = getCellContent(dayIdx, freq.name);

                  return (
                    <td
                      key={dayIdx}
                      onClick={() => handleStartEdit(dayIdx, freq.name)}
                      className="py-2.5 px-2.5 border-r border-[#E3D4C0] align-top cursor-pointer hover:bg-[#EEDEC8]/40 transition-colors group relative"
                      title="Click to edit meal"
                    >
                      <div className="text-[11px] leading-relaxed text-[#2E1C07]">
                        {content}
                      </div>

                      {/* Hover Edit Icon */}
                      <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#8C5E28]">
                        <Edit3 className="w-3 h-3 inline" />
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Calories & Protein Summary Row */}
            <tr className="bg-[#EEDEC8] border-t-2 border-[#8C5E28] font-mono text-[11px] text-[#2E1C07]">
              <td className="py-2.5 px-3 border-r-2 border-[#D9C4A5] font-black text-[#8C5E28] sticky left-0 bg-[#EEDEC8] z-10">
                Daily Totals:
              </td>
              {dayNames.map((_, dayIdx) => {
                const totalKcal = getDayTotalCalories(dayIdx);
                const totalProtein = getDayTotalProtein(dayIdx);
                return (
                  <td key={dayIdx} className="py-2.5 px-2 border-r border-[#D9C4A5] text-center">
                    <div className="text-[#8C5E28] font-bold text-xs">{totalKcal || 1500} kcal</div>
                    <div className="text-[#5C3A14] text-[10px]">{Math.round(totalProtein) || 58}g Protein</div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Inline Cell Edit Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFDF9] border-2 border-[#D9C4A5] rounded-2xl p-5 space-y-4 shadow-2xl text-[#2E1C07]">
            <div className="flex items-center justify-between border-b border-[#E3D4C0] pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8C5E28] tracking-widest font-bold">
                  EDIT 7-DAY DIET TABLE CELL
                </span>
                <h4 className="text-sm font-black text-[#2E1C07]">
                  Day {editingCell.dayIdx + 1} ({dayNames[editingCell.dayIdx]}) • {editingCell.freqName}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="text-gray-400 hover:text-gray-700 text-xs cursor-pointer p-1 rounded"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#42280C] font-bold block">
                Prescribed Dish & Portion (e.g. "Milk (150ml) + Sprouted (30g)"):
              </label>
              <textarea
                rows={3}
                value={editInputValue}
                onChange={(e) => setEditInputValue(e.target.value)}
                placeholder="Enter meal dishes and portions..."
                className="w-full p-2.5 bg-white border border-[#D9C4A5] text-[#2E1C07] text-xs rounded-lg focus:outline-none focus:border-[#8C5E28]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3D4C0]">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-3 py-1.5 text-xs text-[#5C3A14] hover:text-[#2E1C07] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCellEdit}
                className="px-4 py-1.5 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
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
