import React, { useState, useEffect } from 'react';
import {
  GeneralInfo,
  Calculations,
  MajorDomainId,
  LifestyleAssessmentItem,
  DailyRoutineItem,
  FoodFrequencyCategory,
  DietaryRecallItem,
  MealPlanDay,
  MealPlanItem,
  RecipeIngredientItem,
  ClinicalRecipe,
  FoodHabits,
} from '../types';
import { initialFoodHabits } from '../data/initialData';
import { LifestyleAssessmentSection } from './LifestyleAssessmentSection';
import { MentalAssessmentSection } from './MentalAssessmentSection';
import { GutHealthSection } from './GutHealthSection';
import { NutritionAssessmentSection } from './NutritionAssessmentSection';
import { MicronutrientAssessmentSection } from './MicronutrientAssessmentSection';
import { DailyRoutineSection } from './DailyRoutineSection';
import { FoodFrequencySection } from './FoodFrequencySection';
import { DietaryRecallSection } from './DietaryRecallSection';
import { NutritionalGapSection } from './NutritionalGapSection';
import { DietDomainsAndPlanSection } from './DietDomainsAndPlanSection';
import { IngredientAndAyurSiddhaSection } from './IngredientAndAyurSiddhaSection';
import { RecipesGuidelinesSection } from './RecipesGuidelinesSection';
import { CookingMethodologySection } from './CookingMethodologySection';
import { Custom7DayPlanStudio } from './Custom7DayPlanStudio';
import { AiPersonalized2PagePlanView } from './AiPersonalized2PagePlanView';
import { AnthropometrySection } from './AnthropometrySection';
import { RdaFolderSection } from './RdaFolderSection';
import {
  ArrowLeft,
  Apple,
  Brain,
  Sparkles,
  Layers,
  Heart,
  Calendar,
  Utensils,
  History,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  Search,
  Download,
  Eye,
  Trash2,
  Clock,
  User,
  ChevronRight,
  Printer,
  Activity,
  Scale,
} from 'lucide-react';

export interface NutritionArchiveEntry {
  id: string;
  patientName: string;
  patientAge: number;
  gender: string;
  conditionTag: string;
  createdDate: string;
  createdTime: string;
  caloriesTarget: number;
  macros: { carbs: number; protein: number; fat: number };
  activeMealCount: number;
  prescribedBy: string;
  notes: string;
}

const DEFAULT_NUTRITION_ARCHIVE: NutritionArchiveEntry[] = [
  {
    id: 'nx-rec-1',
    patientName: 'Kiruthika Sundar',
    patientAge: 38,
    gender: 'Female',
    conditionTag: 'Metabolic Health (T2D & NAFLD)',
    createdDate: '21-Sep-2026',
    createdTime: '10:30 AM',
    caloriesTarget: 1500,
    macros: { carbs: 185, protein: 75, fat: 42 },
    activeMealCount: 7,
    prescribedBy: 'Dr. Bharathkumar (Sports Medicine)',
    notes: 'Prescribed Low GI Millets, Sprouted Moong, Shatapadi walking, and Glycomet-SR coordination.',
  },
  {
    id: 'nx-rec-2',
    patientName: 'Rajesh Subramaniam',
    patientAge: 44,
    gender: 'Male',
    conditionTag: 'Endurance Performance & Glycogen Sparing',
    createdDate: '19-Sep-2026',
    createdTime: '04:15 PM',
    caloriesTarget: 2400,
    macros: { carbs: 320, protein: 130, fat: 65 },
    activeMealCount: 7,
    prescribedBy: 'Dr. Bharathkumar (Sports Medicine)',
    notes: 'High complex carbohydrate carb-loading protocol for 21km half-marathon readiness.',
  },
  {
    id: 'nx-rec-3',
    patientName: 'Ananya Deshmukh',
    patientAge: 31,
    gender: 'Female',
    conditionTag: 'Gut Health (IBS-M & SIBO)',
    createdDate: '15-Sep-2026',
    createdTime: '11:45 AM',
    caloriesTarget: 1650,
    macros: { carbs: 200, protein: 70, fat: 48 },
    activeMealCount: 7,
    prescribedBy: 'Dr. Bharathkumar (Sports Medicine)',
    notes: 'Low FODMAP elimination diet with Triphala decoction and fermented kanji probiotic drinks.',
  },
];

interface NutritionSectionProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  selectedDomain: MajorDomainId;
  onSelectDomain: (domain: MajorDomainId) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  lifestyleItems: LifestyleAssessmentItem[];
  onUpdateLifestyleItem: (id: string, updated: Partial<LifestyleAssessmentItem>) => void;
  dailyRoutine: DailyRoutineItem[];
  onUpdateDailyRoutine: (id: string, val: string) => void;
  foodHabits?: FoodHabits;
  onUpdateFoodHabits?: (updated: Partial<FoodHabits>) => void;
  ffqCategories: FoodFrequencyCategory[];
  onUpdateFrequency: (catId: string, itemId: string, freq: any) => void;
  onAddFoodItem: (catId: string, foodName: string) => void;
  onRemoveFoodItem: (catId: string, itemId: string) => void;
  dietaryRecall: DietaryRecallItem[];
  onUpdateRecall: (id: string, updated: Partial<DietaryRecallItem>) => void;
  onAddRecallRow: () => void;
  onDeleteRecallRow: (id: string) => void;
  dietPlanDays: MealPlanDay[];
  onRegenerateMeal: (dayNumber: number, mealId: string) => void;
  onUpdateMealItem: (dayNumber: number, mealId: string, updated: Partial<MealPlanItem>) => void;
  onAddIngredientToMeal: (dayNumber: number, mealId: string, item: RecipeIngredientItem) => void;
  onAddRecipeToMeal: (dayNumber: number, mealId: string, recipe: ClinicalRecipe) => void;
  onRemoveIngredientFromMeal: (dayNumber: number, mealId: string, ingredientItemId: string) => void;
  onBackToMainFolders: () => void;
  themeMode?: string;
  initialSubfolder?: string;
  onUpdateGeneralInfo?: (updated: Partial<GeneralInfo>) => void;
  onUpdateCalculations?: (updated: Partial<Calculations>) => void;
}

export const NutritionSection: React.FC<NutritionSectionProps> = ({
  generalInfo,
  calculations,
  selectedDomain,
  onSelectDomain,
  selectedCategory,
  onSelectCategory,
  lifestyleItems,
  onUpdateLifestyleItem,
  dailyRoutine,
  onUpdateDailyRoutine,
  foodHabits,
  onUpdateFoodHabits,
  ffqCategories,
  onUpdateFrequency,
  onAddFoodItem,
  onRemoveFoodItem,
  dietaryRecall,
  onUpdateRecall,
  onAddRecallRow,
  onDeleteRecallRow,
  dietPlanDays,
  onRegenerateMeal,
  onUpdateMealItem,
  onAddIngredientToMeal,
  onAddRecipeToMeal,
  onRemoveIngredientFromMeal,
  onBackToMainFolders,
  themeMode = 'purple-white',
  initialSubfolder,
  onUpdateGeneralInfo,
  onUpdateCalculations,
}) => {
  // Sub-folders + Nutrition History
  const [activeSubfolder, setActiveSubfolder] = useState<string>(initialSubfolder || 'anthropometry');

  useEffect(() => {
    if (initialSubfolder) {
      setActiveSubfolder(initialSubfolder);
    }
  }, [initialSubfolder]);

  // Nutrition History Archive
  const [nutritionArchive, setNutritionArchive] = useState<NutritionArchiveEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_NUTRITION_HISTORY_ARCHIVE');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NUTRITION_ARCHIVE;
  });
  const [archiveSearch, setArchiveSearch] = useState('');

  // Persist archive
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_NUTRITION_HISTORY_ARCHIVE', JSON.stringify(nutritionArchive));
    } catch (e) {
      console.error(e);
    }
  }, [nutritionArchive]);

  // Save current patient's plan to Nutrition History
  const handleSaveCurrentToNutritionHistory = () => {
    const newEntry: NutritionArchiveEntry = {
      id: `nx-rec-${Date.now()}`,
      patientName: generalInfo.name || 'Kiruthika Sundar',
      patientAge: Number(generalInfo.age) || 38,
      gender: generalInfo.sex || 'Female',
      conditionTag: generalInfo.tag || selectedCategory || 'Metabolic Health',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      caloriesTarget: calculations.bmr ? Math.round(calculations.bmr * 1.15) : 1500,
      macros: { carbs: 185, protein: 75, fat: 42 },
      activeMealCount: 7,
      prescribedBy: 'Dr. Bharathkumar (Sports Medicine)',
      notes: `ICMR 2024 Calibrated 7-Day Plan for ${generalInfo.name || 'Patient'}. Verified glycemic index and macronutrient distribution.`,
    };
    setNutritionArchive([newEntry, ...nutritionArchive]);
    alert(`Successfully archived nutrition plan for ${newEntry.patientName} into Nutrition History!`);
  };

  const filteredArchive = nutritionArchive.filter(
    (item) =>
      item.patientName.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.conditionTag.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.createdDate.toLowerCase().includes(archiveSearch.toLowerCase())
  );

  const subfoldersList = [
    { id: 'anthropometry', number: '1', title: 'Anthropometry', desc: 'BMI, BMR, TDEE & Body Comp', icon: Scale },
    { id: 'lifestyle', number: '2', title: 'Life style', desc: 'Sleep, Stress, Vitals', icon: Heart },
    { id: 'neuro-emotional', number: '3', title: 'Neuro emotional', desc: 'Mental Assessment', icon: Brain },
    { id: 'gut-health', number: '4', title: 'Gut health', desc: 'Microbiome & Stool', icon: Activity },
    { id: 'nutritional-assessment', number: '5', title: 'Nutritional Assessment', desc: 'Clinical Survey', icon: FileSpreadsheet },
    { id: 'micronutrient-assessment', number: '6', title: 'Micronutrient Assessment', desc: 'Vitamins & Minerals', icon: Sparkles },
    { id: 'daily-routine', number: '7', title: 'Daily Routine', desc: 'Circadian Schedule', icon: Clock },
    { id: 'food-frequency', number: '8', title: 'Food Frequency', desc: 'FFQ Dietary Habits', icon: Layers },
    { id: 'cooking-methodology', number: '9', title: 'Cooking Methodology', desc: 'Cooking Techniques', icon: Utensils },
    { id: '24-recall', number: '10', title: '24 Recall Method', desc: '24-Hour Food Recall', icon: History },
    { id: 'nutrition-gap', number: '11', title: 'Nutrition Gap', desc: 'ICMR RDA Calibrator', icon: Search },
    { id: 'diet-domain', number: '12', title: 'Diet Domain', desc: 'Major Clinical Domains', icon: BookOpen },
    { id: 'ingredient-ayurveda', number: '13', title: 'Ingredient & Ayurveda', desc: 'Herbs, Spices & Siddha', icon: Apple },
    { id: 'recipes-guidelines', number: '14', title: 'Recipes Guidelines', desc: 'Therapeutic Food Formulas', icon: Utensils },
    { id: 'rda', number: '15', title: 'RDA Requirements', desc: 'Patient-Specific Dynamic Targets', icon: Sparkles },
    { id: '7-day-diet-plan', number: '16', title: '7 Day Diet Plan', desc: 'Custom Plan Studio', icon: Calendar },
    { id: 'rx-prescription', number: '17', title: 'Rx Prescription', desc: '2-Page Official PDF', icon: Printer },
    { id: 'nutrition-history', number: '18', title: 'History', desc: 'All Patient Dates Archive', icon: History },
  ];

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-2 space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Return to 7 Main Folders (Light Sandalwood Theme) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF6ED] border-2 border-[#D9C4A5] shadow-xs text-[#2E1C07]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMainFolders}
            className="p-2.5 rounded-xl bg-[#8C5E28] text-white hover:bg-[#724B1E] transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs"
            title="Return to 7 Main Folders"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Folders</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#2E1C07] uppercase tracking-wider mt-0.5">
                Clinical Nutrition Architecture
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveCurrentToNutritionHistory}
            className="px-3.5 py-2 rounded-xl bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Save Plan to History</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubfolder('nutrition-history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-2 cursor-pointer transition-all ${
              activeSubfolder === 'nutrition-history'
                ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs'
                : 'bg-[#FFFDF9] text-[#5C3A14] border-[#D9C4A5] hover:bg-[#EEDEC8]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Open Nutrition History</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Workspace: Corner Navigation + Large Opposite Canvas */}
      <div className="flex flex-col lg:flex-row items-start gap-5 w-full">
        {/* Corner Subfolders Navigation List (Corner of Full Screen) */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0 flex flex-col gap-2 no-print lg:sticky lg:top-14">
          <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF6ED] text-[11px] font-mono font-black uppercase tracking-widest text-[#5C3A14] border border-[#D9C4A5] flex items-center justify-between shadow-2xs">
            <span>NUTRITION FOLDER</span>
            <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#EEDEC8] text-[#5C3A14] font-bold">FLOW</span>
          </div>
          <div className="flex flex-col gap-1.5 max-h-[calc(100vh-210px)] overflow-y-auto pr-1 scrollbar-thin">
            {subfoldersList.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeSubfolder === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setActiveSubfolder(folder.id)}
                  className={`w-full px-3.5 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between font-black tracking-wider text-xs shadow-2xs ${
                    isActive
                      ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs scale-[1.01]'
                      : folder.id === 'nutrition-history'
                      ? 'bg-[#F6EFE3] text-[#5C3A14] border-[#D9C4A5] hover:bg-[#8C5E28] hover:text-white'
                      : 'bg-[#FFFDF9] hover:bg-[#FAF6ED] text-[#42280C] border-[#E3D4C0] hover:border-[#8C5E28]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8C5E28]'}`} />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{folder.number}. {folder.title.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white translate-x-1' : 'text-[#8C5E28] opacity-60'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Opposite Segment: Expansive Large Workspace Area */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <div className="animate-in fade-in">
        {/* 1. Anthropometry Folder */}
        {activeSubfolder === 'anthropometry' && (
          <AnthropometrySection
            generalInfo={generalInfo}
            onUpdateGeneralInfo={onUpdateGeneralInfo}
            calculations={calculations}
            onUpdateCalculations={onUpdateCalculations}
            themeMode={themeMode}
          />
        )}

        {/* 2. Life Style Folder */}
        {activeSubfolder === 'lifestyle' && (
          <LifestyleAssessmentSection
            lifestyleItems={lifestyleItems}
            onUpdateItem={onUpdateLifestyleItem}
          />
        )}

        {/* 3. RDA Requirements Folder (Patient-Specific Dynamic System) */}
        {activeSubfolder === 'rda' && (
          <RdaFolderSection
            generalInfo={generalInfo}
            calculations={calculations}
            selectedCategory={selectedCategory}
            onNavigateToDietPlan={() => setActiveSubfolder('7-day-diet-plan')}
            onNavigateToPrescription={() => setActiveSubfolder('rx-prescription')}
          />
        )}

        {/* 2. Neuro Emotional Folder (Mental Assessment) */}
        {activeSubfolder === 'neuro-emotional' && <MentalAssessmentSection />}

        {/* 3. Gut Health Folder */}
        {activeSubfolder === 'gut-health' && <GutHealthSection />}

        {/* 4. Nutritional Assessment Folder */}
        {activeSubfolder === 'nutritional-assessment' && (
          <NutritionAssessmentSection
            habits={foodHabits || initialFoodHabits}
            onUpdateHabits={onUpdateFoodHabits || (() => {})}
          />
        )}

        {/* 5. Micronutrient Assessment Folder */}
        {activeSubfolder === 'micronutrient-assessment' && (
          <MicronutrientAssessmentSection selectedDomain={selectedCategory} />
        )}

        {/* 6. Daily Routine Folder */}
        {activeSubfolder === 'daily-routine' && (
          <DailyRoutineSection
            routineItems={dailyRoutine}
            onUpdateRoutine={onUpdateDailyRoutine}
            onAddRoutineItem={() => {}}
          />
        )}

        {/* 7. Food Frequency Folder */}
        {activeSubfolder === 'food-frequency' && (
          <FoodFrequencySection
            categories={ffqCategories}
            onUpdateItemFrequency={onUpdateFrequency}
            onAddFoodItem={onAddFoodItem}
            onRemoveFoodItem={onRemoveFoodItem}
          />
        )}

        {/* 8. 24 Recall Folder */}
        {activeSubfolder === '24-recall' && (
          <DietaryRecallSection
            recallItems={dietaryRecall}
            onUpdateRecall={onUpdateRecall}
            onAddRecallRow={onAddRecallRow}
            onDeleteRecallRow={onDeleteRecallRow}
          />
        )}

        {/* 9. Nutrition Gap Folder */}
        {activeSubfolder === 'nutrition-gap' && (
          <NutritionalGapSection
            dietaryRecall={dietaryRecall}
            generalInfo={generalInfo}
          />
        )}

        {/* 10. Diet Domain Folder */}
        {activeSubfolder === 'diet-domain' && (
          <DietDomainsAndPlanSection />
        )}

        {/* 11. Ingredient and Ayurveda Guidelines Folder */}
        {activeSubfolder === 'ingredient-ayurveda' && (
          <IngredientAndAyurSiddhaSection
            selectedDomain={selectedDomain}
            selectedCategory={selectedCategory}
            generalInfo={generalInfo}
            calculations={calculations}
            onSelectCategory={onSelectCategory}
          />
        )}

        {/* 12. Recipes Guidelines Folder */}
        {activeSubfolder === 'recipes-guidelines' && (
          <RecipesGuidelinesSection
            selectedDomain={selectedDomain}
            selectedCategory={selectedCategory}
            generalInfo={generalInfo}
            calculations={calculations}
            dietaryRecall={dietaryRecall}
            onSelectCategory={onSelectCategory}
          />
        )}

        {/* 13. 7 Day Diet Plan Folder */}
        {activeSubfolder === '7-day-diet-plan' && (
          <Custom7DayPlanStudio
            generalInfo={generalInfo}
            calculations={calculations}
            selectedDomain={selectedDomain}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            onOpenFinalPrescription={() => setActiveSubfolder('rx-prescription')}
          />
        )}

        {/* 14. Cooking Methodology Folder */}
        {activeSubfolder === 'cooking-methodology' && (
          <CookingMethodologySection />
        )}

        {/* 15. Rx Prescription */}
        {activeSubfolder === 'rx-prescription' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF6ED] border-2 border-[#D9C4A5] shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-[#2E1C07]">
                # RX PRESCRIPTION
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#8C5E28] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#724B1E]"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
            <AiPersonalized2PagePlanView
              generalInfo={generalInfo}
              calculations={calculations}
              dietaryRecall={dietaryRecall}
              onOpenPrescription={() => {}}
            />
          </div>
        )}

        {/* ★ NUTRITION HISTORY: ARCHIVES ALL PATIENTS DIET PLANS WITH DATES (As explicitly requested) */}
        {activeSubfolder === 'nutrition-history' && (
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#D9C4A5] shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#E3D4C0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8C5E28] font-bold tracking-widest block">
                  CENTRAL CLINICAL ARCHIVE
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#2E1C07] uppercase tracking-wider mt-0.5">
                  Nutrition History Repository
                </h3>
                <p className="text-xs text-[#5C3A14]">
                  Every diet plan prescribed across all patients stored with exact dates, calorie targets, macros, and clinical notes.
                </p>
              </div>

              {/* Search filter */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  placeholder="Search patient name, condition, or date..."
                  className="w-full bg-[#FAF6ED] border border-[#D9C4A5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2E1C07] placeholder-gray-500 focus:outline-none focus:border-[#8C5E28]"
                />
              </div>
            </div>

            {/* Archive Table */}
            <div className="overflow-x-auto rounded-xl border-2 border-[#D9C4A5] bg-[#FFFDF9]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EEDEC8] text-[#2E1C07] uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-3.5">Prescribed Date & Time</th>
                    <th className="p-3.5">Patient Name</th>
                    <th className="p-3.5">Age / Sex</th>
                    <th className="p-3.5">Clinical Condition</th>
                    <th className="p-3.5">Target Kcal & Macros</th>
                    <th className="p-3.5">Clinical Prescription Notes</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3D4C0] text-[#42280C]">
                  {filteredArchive.map((record) => (
                    <tr key={record.id} className="hover:bg-[#FAF6ED] transition-colors">
                      <td className="p-3 font-mono text-[#2E1C07]">
                        <span className="block font-bold">{record.createdDate}</span>
                        <span className="text-[10px] text-gray-500">{record.createdTime}</span>
                      </td>
                      <td className="p-3 font-black text-[#2E1C07]">{record.patientName}</td>
                      <td className="p-3 text-gray-700">
                        {record.patientAge} Yrs • {record.gender}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#FAF6ED] text-[#8C5E28] border border-[#D9C4A5] text-[11px] font-bold">
                          {record.conditionTag}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="font-bold text-[#8C5E28] block">{record.caloriesTarget} kcal</span>
                        <span className="text-[10px] text-gray-600">
                          C: {record.macros.carbs}g • P: {record.macros.protein}g • F: {record.macros.fat}g
                        </span>
                      </td>
                      <td className="p-3 text-gray-800 max-w-xs truncate">{record.notes}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSubfolder('7-day-diet-plan');
                            alert(`Loaded diet plan for ${record.patientName} into active 7-day studio!`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#8C5E28] text-white hover:bg-[#724B1E] text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Plan</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredArchive.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500 font-mono text-xs">
                        No archived nutrition records found matching "{archiveSearch}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="pt-4 border-t-2 border-[#D9C4A5] flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToMainFolders}
          className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#8C5E28] text-[#8C5E28] hover:bg-[#8C5E28] hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to 7 Main Folders</span>
        </button>
      </div>
    </div>
  );
};
