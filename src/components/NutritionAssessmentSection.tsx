import React from 'react';
import { FoodHabits } from '../types';
import { Utensils, AlertCircle } from 'lucide-react';

interface NutritionAssessmentSectionProps {
  habits: FoodHabits;
  onUpdateHabits: (updated: Partial<FoodHabits>) => void;
}

export const NutritionAssessmentSection: React.FC<NutritionAssessmentSectionProps> = ({
  habits,
  onUpdateHabits,
}) => {
  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="border-b-2 border-purple-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#7E22CE]">
            Module 10 • Nutritional Habits & Intake Patterns
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-950 uppercase mt-0.5">
            Nutritional Assessment
          </h2>
          <p className="text-xs text-gray-600">
            Systematic survey of dietary patterns, food preferences, intolerances, and appetite dynamics.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#7E22CE] bg-purple-50 px-3.5 py-1.5 border border-purple-200 rounded-lg">
          <Utensils className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-wider">Food Habits & Dietary Preferences</span>
        </div>
      </div>

      {/* Food Habits Table */}
      <div className="overflow-x-auto bg-white border-2 border-purple-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-purple-200 bg-purple-100 text-purple-950 font-black tracking-widest uppercase text-[10px]">
              <th className="py-3 px-4 font-black w-1/3">Nutrition Assessment Factor</th>
              <th className="py-3 px-4 font-black w-2/3">Patient Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {/* Dietary Pattern */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Dietary Pattern</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={habits.dietaryPattern ?? ''}
                  onChange={(e) => onUpdateHabits({ dietaryPattern: e.target.value })}
                  placeholder="e.g. Traditional South Indian Balanced Diet"
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none rounded-lg"
                />
              </td>
            </tr>

            {/* Vegetarian / Non-Vegetarian */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Vegetarian / Non-Vegetarian Status</td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'].map((v) => {
                    const isSelected = (habits.vegetarianStatus ?? '').includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onUpdateHabits({ vegetarianStatus: v })}
                        className={`py-1 px-3 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs'
                            : 'border-purple-200 bg-purple-50 text-gray-700 hover:border-[#7E22CE]'
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>

            {/* Preferred Foods */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Preferred Foods</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={habits.preferredFoods ?? ''}
                  onChange={(e) => onUpdateHabits({ preferredFoods: e.target.value })}
                  placeholder="e.g. Millets, steamed idli, fresh greens..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none rounded-lg"
                />
              </td>
            </tr>

            {/* Disliked Foods */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Disliked Foods</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={habits.dislikedFoods ?? ''}
                  onChange={(e) => onUpdateHabits({ dislikedFoods: e.target.value })}
                  placeholder="e.g. Bitter gourd curry, raw mushrooms..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none rounded-lg"
                />
              </td>
            </tr>

            {/* Food Allergies */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Food Allergies</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={habits.foodAllergies ?? ''}
                  onChange={(e) => onUpdateHabits({ foodAllergies: e.target.value })}
                  placeholder="e.g. Peanuts, gluten, shellfish, or None reported"
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none rounded-lg"
                />
              </td>
            </tr>

            {/* Food Intolerances */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Food Intolerances</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={habits.foodIntolerances ?? ''}
                  onChange={(e) => onUpdateHabits({ foodIntolerances: e.target.value })}
                  placeholder="e.g. Lactose, dairy cream, onion, garlic..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none rounded-lg"
                />
              </td>
            </tr>

            {/* Foods Avoided */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Foods Strictly Avoided</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={habits.foodsAvoided ?? ''}
                  onChange={(e) => onUpdateHabits({ foodsAvoided: e.target.value })}
                  placeholder="e.g. Sweetened juices, white flour bakery items, deep fried items..."
                  className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none rounded-lg"
                />
              </td>
            </tr>

            {/* Appetite */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Appetite Level</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {['Good', 'Moderate', 'Poor'].map((a) => {
                    const isSelected = habits.appetite === a;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => onUpdateHabits({ appetite: a as any })}
                        className={`py-1 px-3 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs'
                            : 'border-purple-200 bg-purple-50 text-gray-700 hover:border-[#7E22CE]'
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>

            {/* Meal Frequency */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Daily Meal Frequency</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="text"
                    value={habits.mealFrequency ?? ''}
                    onChange={(e) => onUpdateHabits({ mealFrequency: e.target.value })}
                    placeholder="e.g. 3 main + 2 snacks"
                    className="w-full bg-white border border-purple-200 focus:border-[#7E22CE] py-1.5 px-3 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none font-mono rounded-lg"
                  />
                  <span className="text-gray-500 text-xs shrink-0">meals/day</span>
                </div>
              </td>
            </tr>

            {/* Eating Outside */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Eating Out Frequency</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {['Rarely', 'Sometimes', 'Often'].map((o) => {
                    const isSelected = habits.eatingOutside === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => onUpdateHabits({ eatingOutside: o as any })}
                        className={`py-1 px-3 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs'
                            : 'border-purple-200 bg-purple-50 text-gray-700 hover:border-[#7E22CE]'
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>

            {/* Added Sugar Intake */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Added Sugar Intake</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {['Low', 'Moderate', 'High'].map((s) => {
                    const isSelected = habits.addedSugarIntake === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onUpdateHabits({ addedSugarIntake: s as any })}
                        className={`py-1 px-3 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? s === 'Low'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : s === 'Moderate'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-red-600 text-white border-red-600'
                            : 'border-purple-200 bg-purple-50 text-gray-700 hover:border-[#7E22CE]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>

            {/* Processed Food Intake */}
            <tr className="hover:bg-purple-50/60 transition-colors">
              <td className="py-3 px-4 text-gray-950 font-bold">Processed / Packaged Food</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {['Low', 'Moderate', 'High'].map((p) => {
                    const isSelected = habits.processedFoodIntake === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => onUpdateHabits({ processedFoodIntake: p as any })}
                        className={`py-1 px-3 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? p === 'Low'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : p === 'Moderate'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-red-600 text-white border-red-600'
                            : 'border-purple-200 bg-purple-50 text-gray-700 hover:border-[#7E22CE]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
