import React from 'react';
import { DailyRoutineItem } from '../types';
import { Clock, Sunrise, Sun, Sunset, Moon, Plus } from 'lucide-react';

interface DailyRoutineSectionProps {
  routineItems: DailyRoutineItem[];
  onUpdateRoutine: (id: string, value: string) => void;
  onAddRoutineItem: () => void;
}

export const DailyRoutineSection: React.FC<DailyRoutineSectionProps> = ({
  routineItems,
  onUpdateRoutine,
  onAddRoutineItem,
}) => {
  const getRoutineIcon = (activity: string) => {
    const act = activity.toLowerCase();
    if (act.includes('wake') || act.includes('morning')) {
      return <Sunrise className="w-4 h-4 text-amber-300" />;
    }
    if (act.includes('lunch') || act.includes('mid-morning')) {
      return <Sun className="w-4 h-4 text-yellow-400" />;
    }
    if (act.includes('evening') || act.includes('dinner')) {
      return <Sunset className="w-4 h-4 text-orange-400" />;
    }
    if (act.includes('bed') || act.includes('sleep')) {
      return <Moon className="w-4 h-4 text-purple-300" />;
    }
    return <Clock className="w-4 h-4 text-[#A855F7]" />;
  };

  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="border-b-2 border-purple-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            Module 12 • Circadian Rhythm & Chrononutrition
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Daily Routine & Timed Habits
          </h2>
          <p className="text-xs text-gray-600">
            Map metabolic feeding windows, sleep architecture, and hydration checkpoints.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddRoutineItem}
          className="px-4 py-2 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#6b1dae] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer rounded-xl"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Schedule Event</span>
        </button>
      </div>

      {/* Routine Grid / Timeline */}
      <div className="overflow-x-auto bg-white border-2 border-purple-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-purple-200 bg-purple-100 text-purple-950 font-black tracking-widest uppercase text-[10px]">
              <th className="py-3 px-4 font-black w-1/2">Daily Routine Landmark</th>
              <th className="py-3 px-4 font-black w-1/2">Patient Response / Logged Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {routineItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-purple-50/60 transition-colors">
                <td className="py-3 px-4 text-gray-950 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-50 border border-purple-200 rounded-lg shrink-0">
                      {getRoutineIcon(item.activity)}
                    </div>
                    <span className="text-[#7E22CE] font-mono text-[10px] w-4 font-bold">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{item.activity}</span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={item.patientResponseTime ?? ''}
                    onChange={(e) => onUpdateRoutine(item.id, e.target.value)}
                    placeholder="Enter time or response (e.g. 6:30 AM, 500 ml)..."
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-2 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none transition-all font-mono rounded-lg"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700">
        <span>
          Recommended meal spacing for metabolic stability: <strong className="text-[#7E22CE]">3.5 – 4 hours</strong> between major meals to avoid glucose stacking.
        </span>
        <span className="text-[#7E22CE] font-mono font-bold uppercase text-[10px]">Circadian Synchronized</span>
      </div>
    </div>
  );
};
