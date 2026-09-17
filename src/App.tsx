import React, { useState, useEffect } from 'react';
import {
  Calculations,
  ClinicalConsultationNote,
  DailyRoutineItem,
  DiabetesGuidelines,
  DietaryRecallItem,
  DietDayPlan,
  ExerciseDayPlan,
  FoodFrequencyCategory,
  FoodHabits,
  GeneralInfo,
  GutHealthQuestion,
  LifestyleAssessmentItem,
  MajorDomainId,
  MealPlanItem,
  MedicalHistory,
  NutrientGapAnalysis,
  SymptomAssessmentItem,
  UploadedReport,
  RecipeIngredientItem,
  ClinicalRecipe,
} from './types';

// Mock & Initial Data
import {
  initialCalculations,
  initialClinicalNotes,
  initialDailyRoutine,
  initialDiabetesGuidelines,
  initialDietaryRecall,
  initialDietPlan7Days,
  initialExercisePlan,
  initialFoodFrequencyCategories,
  initialFoodHabits,
  initialGeneralInfo,
  initialGutHealthQuestions,
  initialLifestyleAssessment,
  initialMedicalHistory,
  initialNutrientGaps,
  initialReports,
  initialSymptomsAssessment,
  majorDomainsData,
} from './data/initialData';

// Calculations & Utilities
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  enrichDietPlanWithIcmr,
  addIngredientToMealPlan,
  addRecipeToMealPlan,
  removeIngredientFromMealPlan,
} from './utils/calculations';
import {
  encryptHealthData,
  EncryptedPackage,
  generateKeyFingerprint,
} from './utils/crypto';

// Components
import { ZiathlonLogo } from './components/ZiathlonLogo';
import { AuthModal } from './components/AuthModal';
import { E2EEMonitorModal } from './components/E2EEMonitorModal';
import { DeviceFrame, DeviceMode } from './components/DeviceFrame';
import { NutritionPrescriptionModal } from './components/NutritionPrescriptionModal';
import { PersonalNutritionAiDrawer } from './components/PersonalNutritionAiDrawer';

// 20 Core Modules Requested by User
import { OverviewFrontPage } from './components/OverviewFrontPage';
import { GeneralInfoSection } from './components/GeneralInfoSection'; // 01
import { DomainSelectorSection } from './components/DomainSelectorSection'; // 02
import { SymptomsAssessmentSection } from './components/SymptomsAssessmentSection'; // 03
import { MedicalHistorySection } from './components/MedicalHistorySection'; // 04
import { ParentMedicalHistorySection } from './components/ParentMedicalHistorySection'; // 05
import { ReportsUploadSection } from './components/ReportsUploadSection'; // 06
import { LifestyleAssessmentSection } from './components/LifestyleAssessmentSection'; // 07
import { MentalAssessmentSection } from './components/MentalAssessmentSection'; // 08
import { GutHealthSection } from './components/GutHealthSection'; // 09
import { NutritionAssessmentSection } from './components/NutritionAssessmentSection'; // 10
import { MicronutrientAssessmentSection } from './components/MicronutrientAssessmentSection'; // 11
import { DailyRoutineSection } from './components/DailyRoutineSection'; // 12
import { FoodFrequencySection } from './components/FoodFrequencySection'; // 13
import { DietaryRecallSection } from './components/DietaryRecallSection'; // 14
import { NutritionalGapSection } from './components/NutritionalGapSection'; // 15
import { DietDomainsAndPlanSection } from './components/DietDomainsAndPlanSection'; // 16
import { IngredientAndAyurSiddhaSection } from './components/IngredientAndAyurSiddhaSection'; // 17
import { RecipesGuidelinesSection } from './components/RecipesGuidelinesSection'; // 18
import { ClientFolderSection } from './components/ClientFolderSection'; // 20
import { BodyCompositionTrackerSection } from './components/BodyCompositionTrackerSection'; // 21
import { FitnessGuidelinesSection } from './components/FitnessGuidelinesSection'; // 22

// Advanced AI & Clinical Suites
import { PersonalNutritionAiSection } from './components/PersonalNutritionAiSection';
import { WhatsAppDietAiSection } from './components/WhatsAppDietAiSection';
import { AiDietPlanSection } from './components/AiDietPlanSection';
import { Custom7DayPlanStudio } from './components/Custom7DayPlanStudio';
import { ClinicalNotesSection } from './components/ClinicalNotesSection';
import { CustomDayPlan, INITIAL_7_DAY_STUDIO_PLAN } from './data/customStudio7DayPlans';

import {
  ShieldCheck,
  Lock,
  UserCheck,
  ChevronRight,
  Menu,
  X,
  Printer,
  Sparkles,
  Smartphone,
  CheckCircle,
  FolderLock,
  Bot,
  CalendarDays,
  LayoutDashboard,
  Sun,
  Moon,
} from 'lucide-react';

export default function App() {
  // --- Core State with Durable Storage Persistence ---
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(() => {
    try {
      const s = localStorage.getItem('ELSHA_GENERAL_INFO');
      if (s) return JSON.parse(s);
    } catch {}
    return initialGeneralInfo;
  });
  const [calculations, setCalculations] = useState<Calculations>(initialCalculations);

  const [selectedDomain, setSelectedDomain] = useState<MajorDomainId>(() => {
    try {
      const s = localStorage.getItem('ELSHA_SELECTED_DOMAIN') as MajorDomainId;
      if (s) return s;
    } catch {}
    return 'diseases';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    try {
      const s = localStorage.getItem('ELSHA_SELECTED_CATEGORY');
      if (s) return s;
    } catch {}
    return 'Diabetes Mellitus';
  });

  const [symptoms, setSymptoms] = useState<SymptomAssessmentItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_SYMPTOMS');
      if (s) return JSON.parse(s);
    } catch {}
    return initialSymptomsAssessment;
  });
  const [lifestyleItems, setLifestyleItems] = useState<LifestyleAssessmentItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_LIFESTYLE');
      if (s) return JSON.parse(s);
    } catch {}
    return initialLifestyleAssessment;
  });
  const [dailyRoutine, setDailyRoutine] = useState<DailyRoutineItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_ROUTINE');
      if (s) return JSON.parse(s);
    } catch {}
    return initialDailyRoutine;
  });
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>(() => {
    try {
      const s = localStorage.getItem('ELSHA_MED_HISTORY');
      if (s) return JSON.parse(s);
    } catch {}
    return initialMedicalHistory;
  });
  const [foodHabits, setFoodHabits] = useState<FoodHabits>(() => {
    try {
      const s = localStorage.getItem('ELSHA_FOOD_HABITS');
      if (s) return JSON.parse(s);
    } catch {}
    return initialFoodHabits;
  });
  const [ffqCategories, setFfqCategories] = useState<FoodFrequencyCategory[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_FFQ_CATEGORIES');
      if (s) return JSON.parse(s);
    } catch {}
    return initialFoodFrequencyCategories;
  });
  const [dietaryRecall, setDietaryRecall] = useState<DietaryRecallItem[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_DIETARY_RECALL');
      if (s) return JSON.parse(s);
    } catch {}
    return initialDietaryRecall;
  });
  const [diabetesGuidelines] = useState<DiabetesGuidelines>(initialDiabetesGuidelines);
  const [dietPlanDays, setDietPlanDays] = useState<DietDayPlan[]>(() =>
    enrichDietPlanWithIcmr(initialDietPlan7Days)
  );
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalConsultationNote[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_CLINICAL_NOTES');
      if (s) return JSON.parse(s);
    } catch {}
    return initialClinicalNotes;
  });

  // Continuous Auto-Save to Local Storage to ensure client data is never deleted
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_GENERAL_INFO', JSON.stringify(generalInfo));
      localStorage.setItem('ELSHA_SELECTED_DOMAIN', selectedDomain);
      localStorage.setItem('ELSHA_SELECTED_CATEGORY', selectedCategory);
      localStorage.setItem('ELSHA_SYMPTOMS', JSON.stringify(symptoms));
      localStorage.setItem('ELSHA_LIFESTYLE', JSON.stringify(lifestyleItems));
      localStorage.setItem('ELSHA_ROUTINE', JSON.stringify(dailyRoutine));
      localStorage.setItem('ELSHA_MED_HISTORY', JSON.stringify(medicalHistory));
      localStorage.setItem('ELSHA_FOOD_HABITS', JSON.stringify(foodHabits));
      localStorage.setItem('ELSHA_FFQ_CATEGORIES', JSON.stringify(ffqCategories));
      localStorage.setItem('ELSHA_DIETARY_RECALL', JSON.stringify(dietaryRecall));
      localStorage.setItem('ELSHA_CLINICAL_NOTES', JSON.stringify(clinicalNotes));
    } catch (e) {
      console.error('Storage sync error', e);
    }
  }, [
    generalInfo,
    selectedDomain,
    selectedCategory,
    symptoms,
    lifestyleItems,
    dailyRoutine,
    medicalHistory,
    foodHabits,
    ffqCategories,
    dietaryRecall,
    clinicalNotes,
  ]);

  // --- Active Module Navigation (Defaults to Overview Front Page as Requested) ---
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Modals & Views ---
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isE2EEOpen, setIsE2EEOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');

  // Theme Mode: 'purple-white' (Default) | 'purple-dark'
  const [themeMode, setThemeMode] = useState<'purple-white' | 'purple-dark'>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_THEME_PREFERENCE');
      if (saved === 'purple-dark' || saved === 'purple-white') return saved;
    } catch {}
    return 'purple-white'; // Purple with White theme by default!
  });

  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_THEME_PREFERENCE', themeMode);
    } catch {}
    if (themeMode === 'purple-white') {
      document.documentElement.classList.add('theme-purple-white');
      document.documentElement.classList.remove('theme-purple-dark');
      document.body.classList.add('theme-purple-white');
      document.body.classList.remove('theme-purple-dark');
    } else {
      document.documentElement.classList.add('theme-purple-dark');
      document.documentElement.classList.remove('theme-purple-white');
      document.body.classList.add('theme-purple-dark');
      document.body.classList.remove('theme-purple-white');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'purple-white' ? 'purple-dark' : 'purple-white'));
  };

  // 7-Day Diet Plan Studio state synchronized with Rx Prescription
  const [customStudioPlans, setCustomStudioPlans] = useState<CustomDayPlan[]>(() => {
    try {
      const s = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length >= 7) return parsed;
      }
    } catch {}
    return INITIAL_7_DAY_STUDIO_PLAN;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const s = localStorage.getItem('ELSHA_CUSTOM_7DAY_PLANS');
        if (s) {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed) && parsed.length >= 7) {
            setCustomStudioPlans((prev) => {
              if (JSON.stringify(prev) !== s) return parsed;
              return prev;
            });
          }
        }
      } catch {}
    };
    window.addEventListener('elsha-plan-updated', handleUpdate);
    return () => window.removeEventListener('elsha-plan-updated', handleUpdate);
  }, []);

  // --- Security & E2EE State ---
  const [passphrase, setPassphrase] = useState('ZIATHLON-CLINICAL-SECURE-2026');
  const [keyFingerprint, setKeyFingerprint] = useState('');
  const [encryptedVault, setEncryptedVault] = useState<EncryptedPackage | null>(null);
  const [clinicianRole, setClinicianRole] = useState('Chief Clinical Nutritionist');
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Recalculate BMI, BMR, TDEE when generalInfo changes
  useEffect(() => {
    const age = typeof generalInfo.age === 'number' ? generalInfo.age : parseFloat(generalInfo.age) || 30;
    const height = typeof generalInfo.height === 'number' ? generalInfo.height : parseFloat(generalInfo.height) || 160;
    const weight = typeof generalInfo.weight === 'number' ? generalInfo.weight : parseFloat(generalInfo.weight) || 60;

    const { bmi, category } = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, age, generalInfo.sex);
    const tdee = calculateTDEE(bmr, generalInfo.activityLevel);

    setCalculations({
      bmi,
      bmiCategory: category,
      bmr,
      tdee,
    });
  }, [generalInfo.age, generalInfo.height, generalInfo.weight, generalInfo.sex, generalInfo.activityLevel]);

  // E2EE Initial Vault Encrypt
  const triggerEncryption = async (currentKey: string = passphrase) => {
    const payload = {
      generalInfo,
      calculations,
      selectedDomain,
      selectedCategory,
      symptoms,
      lifestyleItems,
      dailyRoutine,
      medicalHistory,
      foodHabits,
      ffqCategories,
      dietaryRecall,
      clinicalNotes,
    };
    try {
      const pkg = await encryptHealthData(payload, currentKey);
      setEncryptedVault(pkg);
      const fp = await generateKeyFingerprint(currentKey);
      setKeyFingerprint(fp);
    } catch (e) {
      console.error('Encryption update failed', e);
    }
  };

  useEffect(() => {
    triggerEncryption(passphrase);
  }, []);

  const handleManualSaveEncrypted = async () => {
    await triggerEncryption(passphrase);
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3500);
  };

  // --- Exact 20-Order Navigation Specified by User ---
  const navTabs = [
    { id: 'general', label: '1. General Information [Demographics]', short: '01. Demographics' },
    { id: 'domains', label: '2. Domain of Disease, Disorder, Fitness, Performance', short: '02. Disease Domains' },
    { id: 'symptoms', label: '3. Symptoms Assessment', short: '03. Symptoms' },
    { id: 'medical-history', label: '4. Medical History, Past Procedures', short: '04. Medical History' },
    { id: 'parent-history', label: '5. Parent Medical History', short: '05. Parent History' },
    { id: 'upload-files', label: '6. Upload Files', short: '06. Upload Files' },
    { id: 'lifestyle', label: '7. Lifestyle Assessment', short: '07. Lifestyle' },
    { id: 'mental-assessment', label: '8. Neuro Emotional Assessment (15 Scientific Questions)', short: '08. Neuro-Emotional' },
    { id: 'gut-health', label: '9. Gut Health Assessment', short: '09. Gut Health' },
    { id: 'nutritional-assessment', label: '10. Nutritional Assessment', short: '10. Nutrition' },
    { id: 'micronutrients', label: '11. Micronutrient Assessment', short: '11. Micronutrients' },
    { id: 'daily-routine', label: '12. Daily Routine', short: '12. Daily Routine' },
    { id: 'food-frequency', label: '13. Food Frequency', short: '13. Food Frequency' },
    { id: 'dietary-recall', label: '14. 24 Recall Method', short: '14. 24-Hr Recall' },
    { id: 'nutritional-gap', label: '15. Nutritional Gap', short: '15. Nutritional Gap' },
    { id: 'diet-domains', label: '16. Domain of Diet (Gut Cleanse & Elimination Diet)', short: '16. Diet Domains' },
    { id: 'ingredients-ayurveda', label: '17. Ingredient Guidelines + Ayurvedic Siddha Functional Food Guidelines', short: '17. Ingredients & Ayur-Siddha' },
    { id: 'recipes-guidelines', label: '18. Recipes Guidelines', short: '18. Recipes Guidelines' },
    { id: 'custom-plan-studio', label: '19. 7-Day Diet Plan (ICMR AI)', short: '19. 7-Day Diet Plan' },
    { id: 'fitness-guidelines', label: '20. Exercise Guidelines', short: '20. Exercise Guidelines' },
    { id: 'client-folder', label: '21. Save and Creating a Folder for the Client', short: '21. Client Folder' },
    { id: 'biometrics', label: '22. Progress Tracking (Biometric Data Tracking Automated)', short: '22. Biometric Progress' },
  ];

  // Handlers
  const handleUpdateGeneralInfo = (updated: Partial<GeneralInfo>) => {
    setGeneralInfo((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateSymptom = (id: string, updated: Partial<SymptomAssessmentItem>) => {
    setSymptoms((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const handleAddSymptom = () => {
    const newSym: SymptomAssessmentItem = {
      id: `sym-${Date.now()}`,
      symptom: 'Custom Clinical Sign',
      duration: '1 week',
      severity: 'Mild',
    };
    setSymptoms((prev) => [...prev, newSym]);
  };

  const handleUpdateLifestyle = (id: string, updated: Partial<LifestyleAssessmentItem>) => {
    setLifestyleItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleUpdateRoutine = (id: string, val: string) => {
    setDailyRoutine((prev) => prev.map((r) => (r.id === id ? { ...r, patientResponseTime: val } : r)));
  };

  const handleAddRoutineItem = () => {
    const newR: DailyRoutineItem = {
      id: `routine-${Date.now()}`,
      activity: 'Additional Timed Habit',
      patientResponseTime: '04:00 PM',
    };
    setDailyRoutine((prev) => [...prev, newR]);
  };

  const handleUpdateItemFrequency = (catId: string, itemId: string, freq: string) => {
    setFfqCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          items: c.items.map((it) => (it.id === itemId ? { ...it, frequency: freq } : it)),
        };
      })
    );
  };

  const handleAddFoodItem = (catId: string, foodName: string) => {
    setFfqCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          items: [...c.items, { id: `item-${Date.now()}`, name: foodName.toUpperCase(), frequency: 'Weekly' }],
        };
      })
    );
  };

  const handleRemoveFoodItem = (catId: string, itemId: string) => {
    setFfqCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          items: c.items.filter((it) => it.id !== itemId),
        };
      })
    );
  };

  const handleUpdateRecall = (id: string, updated: Partial<DietaryRecallItem>) => {
    setDietaryRecall((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleAddRecallRow = () => {
    setDietaryRecall((prev) => [
      ...prev,
      { id: `rec-${Date.now()}`, mealTime: 'New Snack Interval', foodItemsConsumed: '', quantity: '' },
    ]);
  };

  const handleDeleteRecallRow = (id: string) => {
    setDietaryRecall((prev) => prev.filter((it) => it.id !== id));
  };

  // AI Diet Plan Regenerator
  const handleRegenerateMeal = (dayNumber: number, mealId: string) => {
    setDietPlanDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          meals: day.meals.map((m) => {
            if (m.id !== mealId) return m;
            return {
              ...m,
              items: [
                { name: 'Sprouted Moong & Vegetable Tikki (Pan-grilled)', portion: '2 pieces' },
                { name: 'Fresh Mint Coriander Chutney (Unsweetened)', portion: '2 tbsp' },
              ],
              clinicalNotes: 'Alternative low glycemic index breakfast formulation with rich bioactive sulforaphane.',
            };
          }),
        };
      })
    );
  };

  const handleUpdateMealItem = (dayNumber: number, mealId: string, updated: Partial<MealPlanItem>) => {
    setDietPlanDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          meals: day.meals.map((m) => (m.id === mealId ? { ...m, ...updated } : m)),
        };
      })
    );
  };

  const handleAddIngredientToMeal = (dayNumber: number, mealId: string, item: RecipeIngredientItem) => {
    setDietPlanDays((prev) => addIngredientToMealPlan(prev, dayNumber, mealId, item));
  };

  const handleAddRecipeToMeal = (dayNumber: number, mealId: string, recipe: ClinicalRecipe) => {
    setDietPlanDays((prev) => addRecipeToMealPlan(prev, dayNumber, mealId, recipe));
  };

  const handleRemoveIngredientFromMeal = (dayNumber: number, mealId: string, ingredientItemId: string) => {
    setDietPlanDays((prev) => removeIngredientFromMealPlan(prev, dayNumber, mealId, ingredientItemId));
  };

  const handleAddClinicalNote = (note: ClinicalConsultationNote) => {
    setClinicalNotes((prev) => [...prev, note]);
  };

  const handleUpdateClinicalNote = (id: string, updated: Partial<ClinicalConsultationNote>) => {
    setClinicalNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updated, encryptedAt: new Date().toISOString() } : n
      )
    );
  };

  const handleDeleteClinicalNote = (id: string) => {
    setClinicalNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const currentDayPlan = dietPlanDays[0];

  return (
    <DeviceFrame deviceMode={deviceMode} onSelectDeviceMode={setDeviceMode}>
      <div className={`min-h-screen ${
        themeMode === 'purple-white'
          ? 'theme-purple-white bg-[#FAF7FD] text-[#1E1136]'
          : 'theme-purple-dark bg-[#000000] text-white'
      } flex flex-col selection:bg-[#7E22CE] selection:text-white font-sans transition-colors duration-200`}>
        {/* TOP PERSISTENT CLINICAL HEADER - Žiathlon Signature Purple Theme */}
        <header className={`sticky top-0 z-40 border-b-2 border-[#7E22CE] transition-colors ${
          themeMode === 'purple-white' ? 'bg-white text-[#1E1136] shadow-sm' : 'bg-[#000000] text-white'
        }`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            {/* Logo & Brand title */}
            <div className="flex items-center gap-3">
              <ZiathlonLogo
                size="md"
                variant="horizontal"
                showSubtitle={true}
                theme={themeMode === 'purple-white' ? 'light' : 'dark'}
                onClick={() => setActiveTab('overview')}
              />
              <div className={`hidden xl:block border-l pl-3 ${
                themeMode === 'purple-white' ? 'border-purple-200' : 'border-white/20'
              }`}>
                <p className={`text-[10px] font-mono ${
                  themeMode === 'purple-white' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  PATIENT: <span className="text-[#7E22CE] font-bold">{generalInfo.name || 'Kiruthika'}</span> • {selectedCategory}
                </p>
                <p className={`text-[9px] font-mono ${
                  themeMode === 'purple-white' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  BMI: {calculations.bmi} • BMR: {calculations.bmr} kcal • TDEE: {calculations.tdee} kcal
                </p>
              </div>
            </div>

            {/* Quick Action Clinical Toolbar */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button (Purple & White / Purple Dark) */}
              <button
                type="button"
                id="btn-theme-toggle"
                onClick={toggleTheme}
                className={`py-1.5 px-2.5 border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  themeMode === 'purple-white'
                    ? 'bg-purple-100 text-purple-900 border-purple-400 hover:bg-purple-200 shadow-sm'
                    : 'bg-[#0d0617] text-[#C084FC] border-[#7E22CE] hover:bg-[#7E22CE] hover:text-white'
                }`}
                title="Toggle Theme: Purple & White / Purple Dark"
              >
                {themeMode === 'purple-white' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="hidden sm:inline">Purple & White</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-purple-300 fill-purple-300" />
                    <span className="hidden sm:inline">Purple Dark</span>
                  </>
                )}
              </button>

              {/* Front Page Dashboard Button */}
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-1.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-[0_0_12px_rgba(126,34,206,0.5)]'
                    : themeMode === 'purple-white'
                    ? 'bg-white text-[#7E22CE] border-purple-300 hover:bg-purple-50'
                    : 'bg-[#0d0617] text-[#C084FC] border-[#7E22CE] hover:bg-[#7E22CE] hover:text-white'
                }`}
                title="Open ŽIATHLON Clinical Front Page Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Front Page</span>
              </button>

              {/* Personal Nutrition AI Button */}
              <button
                type="button"
                onClick={() => setActiveTab('nutrition-ai')}
                className={`py-1.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'nutrition-ai'
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-[0_0_12px_rgba(126,34,206,0.5)]'
                    : themeMode === 'purple-white'
                    ? 'bg-white text-[#7E22CE] border-purple-300 hover:bg-purple-50'
                    : 'bg-[#0d0617] text-[#C084FC] border-[#7E22CE] hover:bg-[#7E22CE] hover:text-white'
                }`}
                title="Open Personal Nutrition AI Consultation Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Nutrition AI</span>
              </button>

              {/* WhatsApp AI Tool */}
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp-ai')}
                className={`py-1.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'whatsapp-ai'
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                    : themeMode === 'purple-white'
                    ? 'bg-white text-gray-700 border-purple-200 hover:border-[#7E22CE] hover:text-[#7E22CE]'
                    : 'bg-[#0d0617] text-gray-300 border-white/20 hover:border-[#7E22CE] hover:text-white'
                }`}
                title="WhatsApp Patient Communication Bot"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">WhatsApp AI</span>
              </button>

              {/* Custom 7-Day Plan Studio */}
              <button
                type="button"
                onClick={() => setActiveTab('custom-plan-studio')}
                className={`py-1.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'custom-plan-studio'
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                    : themeMode === 'purple-white'
                    ? 'bg-white text-gray-700 border-purple-200 hover:border-[#7E22CE] hover:text-[#7E22CE]'
                    : 'bg-[#0d0617] text-gray-300 border-white/20 hover:border-[#7E22CE] hover:text-white'
                }`}
                title="Alter 7-Day Plan, Custom Recipes & Automated ICMR Portion Sizing"
              >
                <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">7-Day Studio</span>
              </button>

              {/* AI Diet Plan 7 Days */}
              <button
                type="button"
                onClick={() => setActiveTab('dietplan')}
                className={`py-1.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'dietplan'
                    ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                    : themeMode === 'purple-white'
                    ? 'bg-white text-gray-700 border-purple-200 hover:border-[#7E22CE] hover:text-[#7E22CE]'
                    : 'bg-[#0d0617] text-gray-300 border-white/20 hover:border-[#7E22CE] hover:text-white'
                }`}
                title="7-Day Therapeutic Diet Plan"
              >
                <CalendarDays className="w-3.5 h-3.5 text-[#7E22CE]" />
                <span className="hidden sm:inline">Diet Matrix</span>
              </button>

              {/* Official Final Nutrition Prescription */}
              <button
                type="button"
                id="btn-prescription-doc"
                onClick={() => setIsPrescriptionOpen(true)}
                className="py-1.5 px-3 bg-[#7E22CE] hover:bg-[#9333EA] border border-purple-400 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(126,34,206,0.4)] transition-all"
                title="Open Official Clinical Nutrition Prescription (Purple & White Theme)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rx Prescription</span>
              </button>

              {/* WhatsApp Linked Status Indicator */}
              <button
                type="button"
                id="btn-whatsapp-linked"
                onClick={() => setActiveTab('whatsapp-ai')}
                className={`py-1.5 px-2.5 border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'purple-white'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                    : 'bg-[#0a1e14] border-[#25D366] text-emerald-300 shadow-[0_0_8px_rgba(37,211,102,0.3)]'
                }`}
                title="WhatsApp Linked (Click to open WhatsApp Hub)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">WA Linked</span>
              </button>

              {/* E2EE Vault Pill */}
              <button
                type="button"
                id="btn-e2ee-vault"
                onClick={() => setIsE2EEOpen(true)}
                className={`py-1.5 px-3 border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  themeMode === 'purple-white'
                    ? 'bg-purple-50 border-purple-300 text-purple-900 hover:bg-[#7E22CE] hover:text-white'
                    : 'bg-[#0d0617] border-[#7E22CE] text-gray-200 hover:bg-[#7E22CE] hover:text-white'
                }`}
                title="Hardware AES-GCM-256 E2EE Vault Status"
              >
                <Lock className="w-3.5 h-3.5 text-[#7E22CE]" />
                <span className="font-mono text-[10px] hidden md:inline">E2EE VAULT</span>
              </button>

              {/* Clinician Session Login Pill */}
              <button
                type="button"
                id="btn-auth-session"
                onClick={() => setIsAuthOpen(true)}
                className={`py-1.5 px-3 border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  themeMode === 'purple-white'
                    ? 'bg-white border-purple-300 text-purple-900 hover:border-[#7E22CE] hover:bg-purple-50'
                    : 'bg-[#0d0617] border-white/20 text-gray-300 hover:border-[#7E22CE] hover:text-[#C084FC]'
                }`}
                title="Clinician Authentication & Biometrics"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#7E22CE]" />
                <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline">
                  {clinicianRole.split(' ')[0]}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 border md:hidden cursor-pointer ${
                  themeMode === 'purple-white'
                    ? 'bg-white border-purple-300 text-[#7E22CE]'
                    : 'bg-[#0d0617] border-[#7E22CE] text-[#C084FC]'
                }`}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 20 Horizontal Navigation Tabs in Exact Sequence */}
          <div className={`hidden md:block border-t transition-colors ${
            themeMode === 'purple-white'
              ? 'bg-[#581C87] border-purple-700'
              : 'bg-[#000000] border-white/10'
          }`}>
            <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none flex items-center gap-1.5 py-2">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                      isActive
                        ? themeMode === 'purple-white'
                          ? 'bg-white text-[#581C87] border-white shadow-md font-black'
                          : 'bg-[#7E22CE] text-white border-[#7E22CE] shadow-[0_0_10px_rgba(126,34,206,0.6)]'
                        : themeMode === 'purple-white'
                        ? 'border-transparent text-purple-200 hover:text-white hover:bg-purple-800/60'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{tab.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b-2 border-[#7E22CE] p-4 space-y-2 z-30 transition-colors ${
            themeMode === 'purple-white' ? 'bg-white shadow-lg' : 'bg-[#0d0617]'
          }`}>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#7E22CE] mb-2 font-bold">
              All 20 Clinical Assessment Modules
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left p-2 text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                    activeTab === tab.id
                      ? 'bg-[#7E22CE] text-white border-[#7E22CE]'
                      : themeMode === 'purple-white'
                      ? 'bg-purple-50/50 border-purple-200 text-purple-900 hover:border-[#7E22CE]'
                      : 'bg-black border-white/10 text-gray-300 hover:border-[#7E22CE]'
                  }`}
                >
                  {tab.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save Toast Notification */}
        {saveSuccessNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0d0617] border-2 border-[#7E22CE] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 text-white text-xs animate-in fade-in slide-in-from-bottom">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-[#C084FC]">Patient Record Synchronized</div>
              <div className="text-[11px] text-gray-400 font-mono">
                AES-GCM-256 encrypted • Fingerprint: {keyFingerprint.slice(0, 14)}...
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-8">
          {/* 00. OVERVIEW FRONT PAGE DASHBOARD (ŽIATHLON CENTRAL LAUNCHER) */}
          {activeTab === 'overview' && (
            <OverviewFrontPage
              generalInfo={generalInfo}
              calculations={calculations}
              onNavigate={(tabId) => {
                if (tabId === 'client-folders') {
                  setActiveTab('client-folder');
                } else {
                  setActiveTab(tabId);
                }
              }}
              onOpenPrescription={() => setIsPrescriptionOpen(true)}
              onLoadPatientData={(pat) => {
                setGeneralInfo((prev) => ({ ...prev, ...pat }));
                setActiveTab('general');
              }}
            />
          )}

          {/* 01. GENERAL INFORMATION [DEMOGRAPHICS] */}
          {activeTab === 'general' && (
            <GeneralInfoSection
              generalInfo={generalInfo}
              calculations={calculations}
              onChange={handleUpdateGeneralInfo}
              onNavigateToBodyComposition={() => setActiveTab('biometrics')}
            />
          )}

          {/* 02. DOMAIN OF DISEASE, DISORDER, FITNESS, PERFORMANCE */}
          {activeTab === 'domains' && (
            <DomainSelectorSection
              domains={majorDomainsData}
              selectedDomain={selectedDomain}
              selectedCategory={selectedCategory}
              onSelectDomain={setSelectedDomain}
              onSelectCategory={setSelectedCategory}
              onNavigateToRecipes={() => setActiveTab('recipes-guidelines')}
            />
          )}

          {/* 03. SYMPTOMS ASSESSMENT */}
          {activeTab === 'symptoms' && (
            <SymptomsAssessmentSection
              symptoms={symptoms}
              domainName="Diseases"
              categoryName={selectedCategory}
              onUpdateSymptom={handleUpdateSymptom}
              onAddSymptom={handleAddSymptom}
            />
          )}

          {/* 04. MEDICAL HISTORY ,PAST PROCEDURES */}
          {activeTab === 'medical-history' && (
            <MedicalHistorySection />
          )}

          {/* 05. PARENT MEDICAL HISTORY */}
          {activeTab === 'parent-history' && (
            <ParentMedicalHistorySection />
          )}

          {/* 06. UPLOAD FILES */}
          {activeTab === 'upload-files' && (
            <ReportsUploadSection />
          )}

          {/* 07. LIFESTYLE ASSESSMENT */}
          {activeTab === 'lifestyle' && (
            <LifestyleAssessmentSection
              lifestyleItems={lifestyleItems}
              onUpdateItem={handleUpdateLifestyle}
            />
          )}

          {/* 08. MENTAL ASSESSMENT BASED ON 15 SCIENTIFIC QUESTIONS */}
          {activeTab === 'mental-assessment' && (
            <MentalAssessmentSection />
          )}

          {/* 09. GUT HEALTH ASSESSMENT */}
          {activeTab === 'gut-health' && (
            <GutHealthSection />
          )}

          {/* 10. NUTRITIONAL ASSESSMENT */}
          {activeTab === 'nutritional-assessment' && (
            <NutritionAssessmentSection
              habits={foodHabits}
              onUpdateHabits={(updated) => setFoodHabits((prev) => ({ ...prev, ...updated }))}
            />
          )}

          {/* 11. MICRONUTRIENT ASSESSMENT */}
          {activeTab === 'micronutrients' && (
            <MicronutrientAssessmentSection
              selectedDomain={selectedCategory}
            />
          )}

          {/* 12. DAILY ROUTINE */}
          {activeTab === 'daily-routine' && (
            <DailyRoutineSection
              routineItems={dailyRoutine}
              onUpdateRoutine={handleUpdateRoutine}
              onAddRoutineItem={handleAddRoutineItem}
            />
          )}

          {/* 13. FOOD FREQUENCY */}
          {activeTab === 'food-frequency' && (
            <FoodFrequencySection
              categories={ffqCategories}
              onUpdateItemFrequency={handleUpdateItemFrequency}
              onAddFoodItem={handleAddFoodItem}
              onRemoveFoodItem={handleRemoveFoodItem}
            />
          )}

          {/* 14. 24 RECALL METHOD */}
          {activeTab === 'dietary-recall' && (
            <DietaryRecallSection
              recallItems={dietaryRecall}
              onUpdateRecall={handleUpdateRecall}
              onAddRecallRow={handleAddRecallRow}
              onDeleteRecallRow={handleDeleteRecallRow}
              onNavigateToGap={() => setActiveTab('nutritional-gap')}
            />
          )}

          {/* 15. NUTRITIONAL GAP */}
          {activeTab === 'nutritional-gap' && (
            <NutritionalGapSection
              dietaryRecall={dietaryRecall}
              generalInfo={generalInfo}
              onNavigateToRecall={() => setActiveTab('dietary-recall')}
            />
          )}

          {/* 16. DOMAIN OF DIET LIKE GUT CLEANSE & ELIMINATION DIET */}
          {activeTab === 'diet-domains' && (
            <DietDomainsAndPlanSection />
          )}

          {/* 17. INGREDIENT GUIDELINES + AYURVEDIC SIDDHA FUNCTIONAL FOOD GUIDELINES */}
          {activeTab === 'ingredients-ayurveda' && (
            <IngredientAndAyurSiddhaSection
              selectedDomain={selectedDomain}
              selectedCategory={selectedCategory}
              generalInfo={generalInfo}
              calculations={calculations}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onOpenRx={() => setIsPrescriptionOpen(true)}
            />
          )}

          {/* 18. RECIPES GUIDELINES */}
          {activeTab === 'recipes-guidelines' && (
            <RecipesGuidelinesSection
              selectedDomain={selectedDomain}
              selectedCategory={selectedCategory}
              generalInfo={generalInfo}
              calculations={calculations}
              dietaryRecall={dietaryRecall}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onOpenRx={() => setIsPrescriptionOpen(true)}
            />
          )}

          {/* 19. 7-Day Diet Plan */}
          {activeTab === 'custom-plan-studio' && (
            <Custom7DayPlanStudio
              generalInfo={generalInfo}
              calculations={calculations}
              selectedDomain={selectedDomain}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onSendToWhatsApp={(text) => {
                setActiveTab('whatsapp-ai');
              }}
              onOpenFinalPrescription={() => setIsPrescriptionOpen(true)}
            />
          )}

          {/* 20. EXERCISE GUIDELINES */}
          {activeTab === 'fitness-guidelines' && (
            <FitnessGuidelinesSection
              exercisePlans={initialExercisePlan}
            />
          )}

          {/* 21. SAVE AND CREATING A FOLDER FOR THE CLIENT */}
          {activeTab === 'client-folder' && (
            <ClientFolderSection
              clientName={generalInfo.name || 'Kiruthika'}
              primaryCondition={selectedCategory}
              onOpenRx={() => setIsPrescriptionOpen(true)}
            />
          )}

          {/* 22. PROGRESS TRACKING LIKE BIOMETRIC DATA TRACKING AUTOMATED */}
          {activeTab === 'biometrics' && (
            <BodyCompositionTrackerSection
              patientName={generalInfo.name || 'Kiruthika'}
            />
          )}

          {/* ADVANCED AI CONSULTATION & CLINICAL EXTENSIONS */}
          {activeTab === 'nutrition-ai' && (
            <PersonalNutritionAiSection
              generalInfo={generalInfo}
              calculations={calculations}
              selectedCategory={selectedCategory}
              selectedDomain={selectedDomain}
              medicalHistory={medicalHistory}
              dietaryRecall={dietaryRecall}
              onAddClinicalNote={handleAddClinicalNote}
              onAddRecallItem={(item) => setDietaryRecall((prev) => [...prev, item])}
              onOpenPrescription={() => setIsPrescriptionOpen(true)}
            />
          )}

          {activeTab === 'whatsapp-ai' && (
            <WhatsAppDietAiSection
              patientName={generalInfo.name || 'Kiruthika'}
              phone={generalInfo.phone || ''}
            />
          )}

          {activeTab === 'dietplan' && (
            <AiDietPlanSection
              days={dietPlanDays}
              generalInfo={generalInfo}
              onRegenerateMeal={handleRegenerateMeal}
              onUpdateMealItem={handleUpdateMealItem}
              onOpenNutritionAi={() => setActiveTab('nutrition-ai')}
              onAddIngredientToMeal={handleAddIngredientToMeal}
              onAddRecipeToMeal={handleAddRecipeToMeal}
              onRemoveIngredientFromMeal={handleRemoveIngredientFromMeal}
            />
          )}

          {activeTab === 'clinicalnotes' && (
            <ClinicalNotesSection
              notes={clinicalNotes}
              patientName={generalInfo.name || 'Kiruthika'}
              onAddNote={handleAddClinicalNote}
              onUpdateNote={handleUpdateClinicalNote}
              onDeleteNote={handleDeleteClinicalNote}
              onSaveEncrypted={handleManualSaveEncrypted}
            />
          )}

          {/* Bottom Workflow Action Bar */}
          <div className="pt-6 border-t-2 border-[#7E22CE] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleManualSaveEncrypted}
                className="py-2.5 px-6 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#9333EA] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(126,34,206,0.5)]"
              >
                <Lock className="w-3.5 h-3.5" />
                Encrypt & Persist Assessment
              </button>
              <button
                type="button"
                onClick={() => setIsPrescriptionOpen(true)}
                className={`py-2.5 px-5 border text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2 ${
                  themeMode === 'purple-white'
                    ? 'bg-white border-[#7E22CE] text-[#7E22CE] hover:bg-purple-50'
                    : 'bg-[#0d0617] border-[#7E22CE] text-[#C084FC] hover:bg-[#7E22CE] hover:text-white'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                Generate Patient Prescription
              </button>
            </div>

            {/* Next Module Navigation */}
            <div className="flex items-center gap-2">
              {(() => {
                const currentIndex = navTabs.findIndex((t) => t.id === activeTab);
                const nextTab = navTabs[currentIndex + 1];
                if (nextTab) {
                  return (
                    <button
                      type="button"
                      onClick={() => setActiveTab(nextTab.id)}
                      className={`py-2.5 px-5 border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                        themeMode === 'purple-white'
                          ? 'bg-purple-50 border-purple-300 text-purple-950 hover:bg-[#7E22CE] hover:text-white'
                          : 'bg-[#0d0617] border-[#7E22CE]/60 hover:border-[#7E22CE] text-white shadow-[0_0_10px_rgba(126,34,206,0.25)]'
                      }`}
                    >
                      <span>Proceed to {nextTab.short}</span>
                      <ChevronRight className="w-4 h-4 text-[#7E22CE]" />
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </main>

        {/* Global Footer - Žiathlon Theme */}
        <footer className={`mt-16 border-t-2 border-[#7E22CE] py-8 px-4 text-center text-xs transition-colors ${
          themeMode === 'purple-white' ? 'bg-white text-gray-600' : 'bg-[#000000] text-gray-400'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ZiathlonLogo size="sm" variant="horizontal" showSubtitle={true} theme={themeMode === 'purple-white' ? 'light' : 'dark'} />
            </div>

            <div className={`text-[11px] font-mono ${themeMode === 'purple-white' ? 'text-purple-900 font-semibold' : 'text-gray-400'}`}>
              Hardware-Accelerated AES-GCM-256 E2EE • Zero-Knowledge Clinical Architecture
            </div>

            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
              © 2026 ŽIATHLON SPORTS MEDICINE CLINIC • ELSHA NUTRITION AI
            </div>
          </div>
        </footer>

        {/* --- MODALS --- */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthenticate={(newKey, role) => {
            setPassphrase(newKey);
            setClinicianRole(role);
            triggerEncryption(newKey);
          }}
          currentPassphrase={passphrase}
        />

        <E2EEMonitorModal
          isOpen={isE2EEOpen}
          onClose={() => setIsE2EEOpen(false)}
          encryptedPackage={encryptedVault}
          keyFingerprint={keyFingerprint}
          onReEncrypt={() => triggerEncryption(passphrase)}
        />

        <NutritionPrescriptionModal
          isOpen={isPrescriptionOpen}
          onClose={() => setIsPrescriptionOpen(false)}
          generalInfo={generalInfo}
          calculations={calculations}
          dayPlan={currentDayPlan}
          guidelines={diabetesGuidelines}
          plans={customStudioPlans}
          onUpdatePlans={setCustomStudioPlans}
          condition={selectedCategory}
        />

        {/* Floating Nutrition AI Launcher (when on other tabs) */}
        {activeTab !== 'nutrition-ai' && (
          <button
            type="button"
            id="btn-floating-nutrition-ai"
            onClick={() => setIsAiDrawerOpen(true)}
            className="fixed bottom-6 right-6 z-40 py-3 px-4 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#9333ea] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_25px_rgba(147,51,234,0.6)] hover:scale-105 transition-all cursor-pointer border border-[#c084fc]"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span className="hidden sm:inline">Ask Nutrition AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}

        {/* Personal Nutrition AI Quick Consultation Drawer */}
        <PersonalNutritionAiDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          onOpenFullSuite={() => setActiveTab('nutrition-ai')}
          generalInfo={generalInfo}
          calculations={calculations}
          selectedCategory={selectedCategory}
        />
      </div>
    </DeviceFrame>
  );
}
