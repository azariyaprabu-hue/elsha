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
  ExtractedPatientDossier,
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
import { FrontPageZiathlon } from './components/FrontPageZiathlon';
import { MainFoldersDashboard } from './components/MainFoldersDashboard';
import { NutritionSection } from './components/NutritionSection';
import { MedicinalSection } from './components/MedicinalSection';
import { OverviewFrontPage } from './components/OverviewFrontPage';
import { ProfileSection } from './components/ProfileSection'; // 01
import { GeneralInfoSection } from './components/GeneralInfoSection'; // 02
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
import { SportsMedicineBannerBackground } from './components/SportsMedicineBannerBackground';

// Advanced AI & Clinical Suites
import { PersonalNutritionAiSection } from './components/PersonalNutritionAiSection';
import { WhatsAppHubSection } from './components/WhatsAppHubSection';
import { AiDietPlanSection } from './components/AiDietPlanSection';
import { Custom7DayPlanStudio } from './components/Custom7DayPlanStudio';
import { ClinicalNotesSection } from './components/ClinicalNotesSection';
import { CustomDayPlan, INITIAL_7_DAY_STUDIO_PLAN } from './data/customStudio7DayPlans';
import { DocumentVerificationSection } from './components/DocumentVerificationSection';

// ELSHA Security & Access Control Suite
import { ElshaLoginScreen } from './components/ElshaLoginScreen';
import { FolderPasswordPrompt } from './components/FolderPasswordPrompt';
import { SecuritySettingsView } from './components/SecuritySettingsView';
import { elshaSecurity } from './services/elshaSecurityClient';
import { CANONICAL_FOLDERS } from './types/securityTypes';

import {
  ShieldCheck,
  Lock,
  UserCheck,
  ChevronRight,
  ChevronLeft,
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
  Calculator,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { ElshaIfctCalculatorModal } from './components/ElshaIfctCalculatorModal';

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

  // --- ELSHA Security & Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => elshaSecurity.isAuthenticated());
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [unlockedFolders, setUnlockedFolders] = useState<Set<string>>(new Set());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  // Validate server session on initial load and handle browser refresh
  useEffect(() => {
    let isMounted = true;
    elshaSecurity.checkStatus().then((status) => {
      if (!isMounted) return;
      setIsAuthenticated(status.isAuthenticated);
      setUnlockedFolders(new Set(status.unlockedFolders || []));
      setIsCheckingAuth(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Map any sub-tab or view ID to its canonical folder identifier
  const getCanonicalFolderForTab = (tabId: string): string | null => {
    if (tabId === 'overview' || tabId === 'workspace' || tabId === 'security-settings') {
      return null; // Public / Dashboard views within authenticated session
    }
    if (['profile', 'general', 'domains', 'symptoms', 'medical-history', 'parent-history', 'upload-files'].includes(tabId)) {
      return 'profile';
    }
    if (['biometrics', 'biometrics-scanner', 'biometrics-progress'].includes(tabId)) {
      return 'biometrics';
    }
    if (['medicinal'].includes(tabId)) {
      return 'medicinal';
    }
    if (tabId === 'anthropometry') return 'anthropometry';
    if (tabId === 'rda') return 'rda';
    if (['7-day-diet-plan', 'dietplan', 'custom-plan-studio'].includes(tabId)) return '7-day-diet-plan';
    if (['nutrition', 'lifestyle', 'mental-assessment', 'gut-health', 'nutritional-assessment', 'micronutrients', 'daily-routine', 'food-frequency', 'dietary-recall', 'nutritional-gap', 'diet-domains', 'ingredients-ayurveda', 'recipes-guidelines', 'nutrition-ai'].includes(tabId)) {
      return 'nutrition';
    }
    if (['exercise'].includes(tabId)) return 'exercise';
    if (['fitness-guidelines', 'physiotherapy'].includes(tabId)) return 'physiotherapy';
    if (['client-folder', 'client-folders'].includes(tabId)) return 'client-folder';
    if (['whatsapp'].includes(tabId)) return 'whatsapp';
    if (['document-verification'].includes(tabId)) return 'document-verification';
    if (['clinicalnotes'].includes(tabId)) return 'clinicalnotes';
    return null;
  };

  // Safe navigation handler that locks previously opened folder when navigating away
  const handleNavigateToTab = (newTabId: string) => {
    const currentFolder = getCanonicalFolderForTab(activeTab);
    const targetFolder = getCanonicalFolderForTab(newTabId);

    // If navigating away from a protected folder to a different folder or dashboard, remove active temporary grant
    if (currentFolder && currentFolder !== targetFolder) {
      elshaSecurity.lockFolder(currentFolder);
      setUnlockedFolders((prev) => {
        const next = new Set(prev);
        next.delete(currentFolder);
        return next;
      });
    }

    setActiveTab(newTabId);
  };

  // Perform full explicit logout
  const handleLogout = async () => {
    await elshaSecurity.logout();
    setIsAuthenticated(false);
    setUnlockedFolders(new Set());
    setActiveTab('overview');
    setShowLogoutConfirm(false);
  };

  // --- Modals & Views ---
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isE2EEOpen, setIsE2EEOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isElshaModalOpen, setIsElshaModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');

  // Purple & White Theme with Sandal & Black Accents
  const themeMode: string = 'purple-white';

  useEffect(() => {
    document.documentElement.classList.remove('theme-black-white', 'theme-purple-dark');
    document.documentElement.classList.add('theme-purple-white');
    document.body.classList.remove('theme-black-white', 'theme-purple-dark');
    document.body.classList.add('theme-purple-white');
  }, []);

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

  // --- 7 FOLDERS NAVIGATION AS SPECIFIED BY USER ---
  const navTabs = [
    { id: 'workspace', label: '📁', short: '📁' },
    { id: 'profile', label: '1 PROFILE', short: '1. PROFILE' },
    { id: 'biometrics', label: '2 BIOMETRIC', short: '2. BIOMETRIC' },
    { id: 'medicinal', label: '3 MEDICAL', short: '3. MEDICAL' },
    { id: 'nutrition', label: '4 NUTRITION', short: '4. NUTRITION' },
    { id: 'exercise', label: '5 EXERCISE', short: '5. EXERCISE' },
    { id: 'client-folder', label: '6 CLIENT FOLDER', short: '6. CLIENT FOLDER' },
    { id: 'whatsapp', label: '7 WHATSAPP', short: '7. WHATSAPP' },
    { id: 'document-verification', label: '📄 DOC VERIFICATION', short: 'DOC VERIFY' },
  ];

  // Handlers
  const handleUpdateGeneralInfo = (updated: Partial<GeneralInfo>) => {
    setGeneralInfo((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateSymptom = (id: string, updated: Partial<SymptomAssessmentItem>) => {
    setSymptoms((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
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

  // Automated Patient Ingestion from Medical Records / Lab Reports / Slips
  const handleApplyExtractedPatientDossier = (dossier: ExtractedPatientDossier) => {
    // 1. Update Profile & Demographics
    setGeneralInfo((prev) => {
      const updated = { ...prev };
      if (dossier.name) updated.name = dossier.name;
      if (dossier.age !== undefined && dossier.age !== null) updated.age = dossier.age;
      if (dossier.sex) updated.sex = dossier.sex;
      if (dossier.dateOfBirth) updated.dateOfBirth = dossier.dateOfBirth;
      if (dossier.place) updated.place = dossier.place;
      if (dossier.phone) updated.phone = dossier.phone;
      if (dossier.email) updated.email = dossier.email;
      if (dossier.height) updated.height = dossier.height;
      if (dossier.weight) updated.weight = dossier.weight;
      if (dossier.waistCircumference) updated.waistCircumference = dossier.waistCircumference;
      if (dossier.hipCircumference) updated.hipCircumference = dossier.hipCircumference;
      if (dossier.tag) updated.tag = dossier.tag;
      if (dossier.customTag) updated.customTag = dossier.customTag;
      if (dossier.activityLevel) updated.activityLevel = dossier.activityLevel;
      return updated;
    });

    // 2. Clinical Domain & Category
    if (dossier.domain && ['diseases', 'disorders', 'performance', 'fitness'].includes(dossier.domain)) {
      setSelectedDomain(dossier.domain as MajorDomainId);
    }
    if (dossier.category) setSelectedCategory(dossier.category);

    // 3. Symptoms Questionnaire Auto-Fill
    if (dossier.symptoms && Array.isArray(dossier.symptoms) && dossier.symptoms.length > 0) {
      const newSymptoms: SymptomAssessmentItem[] = dossier.symptoms.map((s, idx) => ({
        id: `sym-extracted-${Date.now()}-${idx}`,
        symptom: s.symptom,
        duration: s.duration || 'Reported on document',
        severity: (s.severity as any) || 'Moderate',
      }));
      setSymptoms(newSymptoms);
    }

    // 4. Medical History & Medications
    if (dossier.medications && Array.isArray(dossier.medications) && dossier.medications.length > 0) {
      setMedicalHistory((prev) => ({
        ...prev,
        medications: dossier.medications!.map((m, idx) => ({
          id: `med-extracted-${Date.now()}-${idx}`,
          name: m.name,
          dosage: m.dosage || 'Prescribed dose',
          frequency: m.frequency || 'Daily',
          timing: m.timing || 'Morning',
          howLongTaken: m.duration || 'Current',
        })),
      }));
    }

    // 5. Daily Routine Schedule Auto-Fill
    if (dossier.dailyRoutine && Array.isArray(dossier.dailyRoutine) && dossier.dailyRoutine.length > 0) {
      setDailyRoutine(
        dossier.dailyRoutine.map((r, idx) => ({
          id: `routine-extracted-${Date.now()}-${idx}`,
          activity: r.activity,
          patientResponseTime: r.time,
        }))
      );
    }

    // 6. 24-Hour Recall Auto-Fill
    if (dossier.dietaryRecall && Array.isArray(dossier.dietaryRecall) && dossier.dietaryRecall.length > 0) {
      setDietaryRecall(
        dossier.dietaryRecall.map((rec, idx) => ({
          id: `rec-extracted-${Date.now()}-${idx}`,
          mealTime: rec.mealTime,
          foodItemsConsumed: rec.foodItemsConsumed,
          quantity: rec.quantity,
        }))
      );
    }

    // 7. Auto-generate consultation note
    if (dossier.clinicalSummary || dossier.name) {
      const newNote: ClinicalConsultationNote = {
        id: `note-extracted-${Date.now()}`,
        sessionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        sessionTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        clinicianName: 'AI Clinical Vision Parser',
        consultationType: 'Initial Assessment',
        categoryTag: 'Initial Assessment',
        patientAdherence: 'Moderate (50-79%)',
        chiefComplaintsObservations: `Patient Intake Slip / Lab File scanned. Auto-populated details for ${dossier.name || 'Patient'}.`,
        objectiveVitalsFindings: {
          bloodPressure: dossier.bloodPressure,
          hba1cEst: dossier.hba1c,
          bloodGlucoseFasting: dossier.fastingGlucose,
          currentWeight: dossier.weight ? `${dossier.weight} kg` : undefined,
        },
        dietaryComplianceNotes: 'Baseline 24-hour recall captured and calibrated with ICMR 2024 benchmarks.',
        privateClinicalAssessment: dossier.clinicalSummary || `Identified focus: ${dossier.tag || 'Clinical Management'}.`,
        actionPlanNextSteps: `Initiate ICMR 2024 calibrated medical nutrition therapy based on extracted clinical profile.`,
        isConfidential: true,
        encryptedAt: new Date().toISOString(),
      };
      setClinicalNotes((prev) => [newNote, ...prev]);
    }

    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3500);
  };

  // Listen to cross-component dossier extraction event
  useEffect(() => {
    const handleDossierEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ExtractedPatientDossier>;
      if (customEvent.detail) {
        handleApplyExtractedPatientDossier(customEvent.detail);
      }
    };
    window.addEventListener('elsha-dossier-loaded', handleDossierEvent);
    return () => window.removeEventListener('elsha-dossier-loaded', handleDossierEvent);
  }, []);

  const currentDayPlan = dietPlanDays[0];

  // 1. UNAUTHENTICATED GATE: Dedicated ELSHA Common Password Login Screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#0B0826] flex items-center justify-center p-6 text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs uppercase tracking-widest text-purple-300 font-bold">
            Verifying ELSHA Security Credentials...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ElshaLoginScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setActiveTab('overview');
        }}
        onLogin={async (password) => {
          const res = await elshaSecurity.login(password);
          if (res.success) {
            setIsAuthenticated(true);
          }
          return res;
        }}
      />
    );
  }

  // 2. CHECK IF CURRENT TARGET TAB REQUIRES INDIVIDUAL FOLDER UNLOCK
  const activeCanonicalFolderId = getCanonicalFolderForTab(activeTab);
  const isTargetFolderLocked =
    activeCanonicalFolderId !== null && !unlockedFolders.has(activeCanonicalFolderId);
  const targetFolderMeta = CANONICAL_FOLDERS.find((f) => f.id === activeCanonicalFolderId);

  return (
    <DeviceFrame deviceMode={deviceMode} onSelectDeviceMode={setDeviceMode}>
      <div className="min-h-screen theme-purple-white bg-transparent text-[#0F172A] flex flex-col selection:bg-[#8C5E28] selection:text-white font-sans transition-colors duration-200 relative">
        {/* Fixed Sports Clinic Fullscreen Background from Folder 1 to Last Page */}
        {activeTab !== 'overview' && <SportsMedicineBannerBackground subtleOpacity={false} />}

        {/* TOP PERSISTENT CLINICAL HEADER - Žiathlon Signature Sandalwood Theme (Shown on Workspace / Clinical Folders) */}
        {activeTab !== 'overview' && (
          <header className="sticky top-0 z-40 border-b-2 border-[#D9C4A5] bg-[#FAF6ED]/95 backdrop-blur-md text-[#2E1C07] shadow-xs">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
              {/* Left Upper Corner ⌂ Symbol for Front Page & Logo */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="btn-front-page-home"
                  onClick={() => handleNavigateToTab('overview')}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center font-sans text-base font-black transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#8C5E28] text-white border-[#8C5E28] shadow-xs'
                      : 'bg-[#F7F3EA] text-[#5C3A14] border-[#D9C4A5] hover:bg-[#8C5E28] hover:text-white'
                  }`}
                  title="Front Page (⌂)"
                >
                  ⌂
                </button>

                <ZiathlonLogo
                  size="md"
                  variant="horizontal"
                  showSubtitle={true}
                  theme="light"
                  onClick={() => handleNavigateToTab('overview')}
                />
              </div>

              {/* Quick Action Clinical Toolbar */}
              <div className="flex items-center gap-2">
                {/* Official Final Nutrition Prescription */}
                <button
                  type="button"
                  id="btn-prescription-doc"
                  onClick={() => setIsPrescriptionOpen(true)}
                  className="py-1.5 px-3 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all rounded-lg"
                  title="Open Official Clinical Nutrition Prescription"
                >
                  <Printer className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Rx Prescription</span>
                </button>

                {/* 📁 Symbol Button for 7 Folders Dashboard */}
                <button
                  type="button"
                  id="btn-nav-folders"
                  onClick={() => handleNavigateToTab('workspace')}
                  className="py-1.5 px-3 bg-white border-2 border-[#8C5E28] text-[#8C5E28] hover:bg-[#8C5E28] hover:text-white text-xs font-black uppercase tracking-wider flex items-center justify-center cursor-pointer shadow-xs transition-all rounded-lg"
                  title="7 Folders Dashboard (📁)"
                >
                  📁
                </button>

                {/* Security Settings Button */}
                <button
                  type="button"
                  id="btn-security-settings"
                  onClick={() => handleNavigateToTab('security-settings')}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                    activeTab === 'security-settings'
                      ? 'bg-[#7016B7] text-white border-[#7016B7]'
                      : 'bg-purple-50 text-[#7016B7] border-purple-200 hover:bg-purple-100'
                  }`}
                  title="ELSHA Security Settings & Password Studio"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Security</span>
                </button>

                {/* Explicit Logout Button */}
                <button
                  type="button"
                  id="btn-app-logout"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="py-1.5 px-2.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  title="Logout from ELSHA"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 border md:hidden cursor-pointer bg-white border-[#D9C4A5] text-[#8C5E28]"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b-2 border-[#D9C4A5] bg-[#FAF6ED] p-4 space-y-2 z-30 transition-colors shadow-lg">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#8C5E28] mb-2 font-bold flex items-center justify-between">
              <span>Ziathlon 7 Clinical Folders</span>
              <button
                type="button"
                onClick={() => {
                  handleNavigateToTab('overview');
                  setMobileMenuOpen(false);
                }}
                className="text-[10px] text-[#8C5E28] underline uppercase"
              >
                Front Page
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    handleNavigateToTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left p-2 text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                    activeTab === tab.id
                      ? 'bg-[#8C5E28] text-white border-[#8C5E28]'
                      : 'bg-[#FFFDF9] border-[#D9C4A5] text-[#5C3A14] hover:border-[#8C5E28]'
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
          <div className="fixed bottom-6 right-6 z-50 bg-[#FAF6ED] border-2 border-[#D9C4A5] p-4 shadow-xl flex items-center gap-3 text-[#2E1C07] text-xs animate-in fade-in slide-in-from-bottom rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-[#7E22CE]">Patient Record Synchronized</div>
              <div className="text-[11px] text-gray-600 font-mono">
                AES-GCM-256 encrypted • Fingerprint: {keyFingerprint.slice(0, 14)}...
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          className={
            activeTab === 'overview'
              ? 'w-full min-h-screen h-screen p-0 m-0 overflow-hidden'
              : activeTab === 'workspace' ||
                activeTab === 'security-settings' ||
                activeTab === 'medicinal' ||
                activeTab === 'profile' ||
                activeTab === 'biometrics' ||
                activeTab === 'biometrics-scanner' ||
                activeTab === 'biometrics-progress' ||
                activeTab === 'exercise' ||
                activeTab === 'client-folder' ||
                activeTab === 'whatsapp' ||
                activeTab === 'nutrition' ||
                activeTab === 'general' ||
                activeTab === 'domains' ||
                activeTab === 'symptoms' ||
                activeTab === 'medical-history' ||
                activeTab === 'parent-history' ||
                activeTab === 'upload-files' ||
                activeTab === 'lifestyle' ||
                activeTab === 'mental-assessment' ||
                activeTab === 'gut-health' ||
                activeTab === 'nutritional-assessment' ||
                activeTab === 'micronutrients' ||
                activeTab === 'daily-routine' ||
                activeTab === 'food-frequency' ||
                activeTab === 'dietary-recall' ||
                activeTab === 'nutritional-gap' ||
                activeTab === 'diet-domains' ||
                activeTab === 'ingredients-ayurveda' ||
                activeTab === 'recipes-guidelines' ||
                activeTab === 'custom-plan-studio' ||
                activeTab === 'dietplan' ||
                activeTab === 'nutrition-ai'
              ? 'flex-1 w-full max-w-[1920px] mx-auto px-1 sm:px-3 lg:px-4 py-2 space-y-4 relative z-10'
              : 'flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-8 relative z-10'
          }
        >
          {/* INDIVIDUAL FOLDER PASSWORD GATE: SHOWN IF TARGET FOLDER IS LOCKED */}
          {isTargetFolderLocked ? (
            <FolderPasswordPrompt
              folderId={activeCanonicalFolderId!}
              folderName={targetFolderMeta?.name || 'Protected Folder'}
              categoryName={targetFolderMeta?.category}
              onUnlockSuccess={() => {
                setUnlockedFolders((prev) => new Set([...prev, activeCanonicalFolderId!]));
              }}
              onCancel={() => {
                setActiveTab('workspace');
              }}
              onUnlock={async (pwd) => {
                const res = await elshaSecurity.unlockFolder(activeCanonicalFolderId!, pwd);
                if (res.success) {
                  setUnlockedFolders((prev) => new Set([...prev, activeCanonicalFolderId!]));
                }
                return res;
              }}
            />
          ) : (
            <>
              {/* 00. FRONT PAGE: ONLY LOGO ZIATHLON SPORT MEDICINE CLINIC & ENTER BUTTON */}
              {activeTab === 'overview' && (
                <FrontPageZiathlon
                  onEnterWorkspace={() => handleNavigateToTab('workspace')}
                  onSelectFolder={(folderId) => handleNavigateToTab(folderId)}
                  themeMode={themeMode}
                />
              )}

              {/* 00-B. MAIN FOLDERS DASHBOARD (7 FOLDERS DIRECTORY) */}
              {activeTab === 'workspace' && (
                <MainFoldersDashboard
                  onSelectFolder={(folderId) => handleNavigateToTab(folderId)}
                  onBackToFrontPage={() => handleNavigateToTab('overview')}
                  onOpenSecuritySettings={() => handleNavigateToTab('security-settings')}
                  themeMode={themeMode}
                  patientName={generalInfo.name || 'Kiruthika'}
                  patientCondition={selectedCategory || 'Metabolic Health & Sports Medicine'}
                  generalInfo={generalInfo}
                  calculations={calculations}
                  medicalHistory={medicalHistory}
                />
              )}

              {/* SECURITY SETTINGS & PASSWORD MANAGEMENT VIEW */}
              {activeTab === 'security-settings' && (
                <SecuritySettingsView onBackToDashboard={() => handleNavigateToTab('workspace')} />
              )}

          {/* 1. FOLDER 1: PROFILE (Demographics, Disease Domain, Symptoms, Medical History, Parent History, Upload Folder, Prescription) */}
          {(activeTab === 'profile' ||
            activeTab === 'general' ||
            activeTab === 'domains' ||
            activeTab === 'symptoms' ||
            activeTab === 'medical-history' ||
            activeTab === 'parent-history' ||
            activeTab === 'upload-files') && (
            <ProfileSection
              generalInfo={generalInfo}
              onChange={handleUpdateGeneralInfo}
              selectedDomain={selectedDomain}
              onSelectDomain={setSelectedDomain}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              symptoms={symptoms}
              onUpdateSymptom={handleUpdateSymptom}
              onAddSymptom={handleAddSymptom}
              onDeleteSymptom={handleDeleteSymptom}
              onUpdateAllSymptoms={(items) => setSymptoms(items)}
              medicalHistory={medicalHistory}
              onUpdateMedicalHistory={(field, value) => setMedicalHistory((prev) => ({ ...prev, [field]: value }))}
              onBackToMainFolders={() => setActiveTab('workspace')}
              onNavigateToClientFolder={() => setActiveTab('client-folder')}
              onLoadExtractedDossier={handleApplyExtractedPatientDossier}
            />
          )}

          {/* 2. FOLDER 2: BIOMETRICS (ONLY TWO SUBFOLDERS: SCANNER & PROGRESS) */}
          {(activeTab === 'biometrics' || activeTab === 'biometrics-scanner' || activeTab === 'biometrics-progress') && (
            <BodyCompositionTrackerSection
              patientName={generalInfo.name || 'Kiruthika'}
              initialSubfolder={activeTab === 'biometrics-progress' ? 'progress' : 'scanner'}
              onBackToMainFolders={() => setActiveTab('workspace')}
            />
          )}

          {/* 3. FOLDER 3: MEDICAL (5 Folders: Preview, Medical Records Split Screen, Prescription, Goals, Diagnostics) */}
          {activeTab === 'medicinal' && (
            <MedicinalSection
              generalInfo={generalInfo}
              calculations={calculations}
              medicalHistory={medicalHistory}
              symptoms={symptoms}
              lifestyleItems={lifestyleItems}
              dailyRoutine={dailyRoutine}
              foodHabits={foodHabits}
              dietaryRecall={dietaryRecall}
              selectedCategory={selectedCategory}
              selectedDomain={selectedDomain}
              onBackToMainFolders={() => setActiveTab('workspace')}
              themeMode={themeMode}
              onUpdateGeneralInfo={handleUpdateGeneralInfo}
              onUpdateMedicalHistory={(field, value) => setMedicalHistory((prev) => ({ ...prev, [field]: value }))}
              onUpdateSymptoms={(items) => setSymptoms(items)}
              onUpdateCalculations={(updated) => setCalculations((prev) => ({ ...prev, ...updated }))}
            />
          )}

          {/* 4. FOLDER 4: NUTRITION (15 Folders + Nutrition History Archive) */}
          {(activeTab === 'anthropometry' ||
            activeTab === 'nutrition' ||
            activeTab === 'lifestyle' ||
            activeTab === 'rda' ||
            activeTab === 'mental-assessment' ||
            activeTab === 'gut-health' ||
            activeTab === 'nutritional-assessment' ||
            activeTab === 'micronutrients' ||
            activeTab === 'daily-routine' ||
            activeTab === 'food-frequency' ||
            activeTab === 'dietary-recall' ||
            activeTab === 'nutritional-gap' ||
            activeTab === 'diet-domains' ||
            activeTab === 'ingredients-ayurveda' ||
            activeTab === 'recipes-guidelines' ||
            activeTab === 'custom-plan-studio' ||
            activeTab === 'dietplan' ||
            activeTab === 'nutrition-ai') && (
            <NutritionSection
              generalInfo={generalInfo}
              calculations={calculations}
              selectedDomain={selectedDomain}
              onSelectDomain={setSelectedDomain}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              initialSubfolder={activeTab === 'rda' ? 'rda' : activeTab === 'lifestyle' ? 'lifestyle' : 'anthropometry'}
              lifestyleItems={lifestyleItems}
              onUpdateLifestyleItem={handleUpdateLifestyle}
              dailyRoutine={dailyRoutine}
              onUpdateDailyRoutine={handleUpdateRoutine}
              ffqCategories={ffqCategories}
              onUpdateFrequency={handleUpdateItemFrequency}
              onAddFoodItem={handleAddFoodItem}
              onRemoveFoodItem={handleRemoveFoodItem}
              dietaryRecall={dietaryRecall}
              onUpdateRecall={handleUpdateRecall}
              onAddRecallRow={handleAddRecallRow}
              onDeleteRecallRow={handleDeleteRecallRow}
              dietPlanDays={dietPlanDays}
              onRegenerateMeal={handleRegenerateMeal}
              onUpdateMealItem={handleUpdateMealItem}
              onAddIngredientToMeal={handleAddIngredientToMeal}
              onAddRecipeToMeal={handleAddRecipeToMeal}
              onRemoveIngredientFromMeal={handleRemoveIngredientFromMeal}
              onBackToMainFolders={() => setActiveTab('workspace')}
              themeMode={themeMode}
              onUpdateGeneralInfo={handleUpdateGeneralInfo}
              onUpdateCalculations={(updated) => setCalculations((prev) => ({ ...prev, ...updated }))}
            />
          )}

          {/* 5. FOLDER 5: EXERCISE (7-Day Periodized Guidelines with In-Cell Editing & AI) */}
          {(activeTab === 'exercise' || activeTab === 'fitness-guidelines') && (
            <FitnessGuidelinesSection
              exercisePlans={initialExercisePlan}
              patientName={generalInfo.name || 'Kiruthika'}
              patientCondition={selectedCategory}
              onBackToMainFolders={() => setActiveTab('workspace')}
            />
          )}

          {/* 6. FOLDER 6: CLIENT FOLDER (Dossiers, Search by Name, Re-Edit Option) */}
          {(activeTab === 'client-folder' || activeTab === 'client-folders') && (
            <ClientFolderSection
              clientName={generalInfo.name || 'Kiruthika'}
              currentPatientAge={generalInfo.age || 38}
              currentPatientGender={generalInfo.sex || 'Female'}
              currentPatientPhone={generalInfo.phone || ''}
              currentPatientEmail={generalInfo.email || ''}
              currentPatientHeight={generalInfo.height || 162}
              currentPatientWeight={generalInfo.weight || 64}
              primaryCondition={selectedCategory || 'Diabetes Mellitus'}
              currentDomain={selectedDomain}
              generalInfo={generalInfo}
              onOpenRx={() => setIsPrescriptionOpen(true)}
              onLoadClientData={handleApplyExtractedPatientDossier}
              onNavigateToProfile={() => setActiveTab('profile')}
              onBackToMainFolders={() => setActiveTab('workspace')}
            />
          )}

          {/* 7. FOLDER 7: WHATSAPP (Real WhatsApp Multi-Device Inbox) */}
          {activeTab === 'whatsapp' && (
            <WhatsAppHubSection
              patientName={generalInfo.name || 'Kiruthika'}
              phone={generalInfo.phone || ''}
              onBackToMainFolders={() => setActiveTab('workspace')}
            />
          )}

          {activeTab === 'document-verification' && (
            <DocumentVerificationSection />
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

          {/* Bottom Workflow Action Bar (Shown only inside Clinical Folders, not Front Page) */}
          {activeTab !== 'overview' && (
            <div className="pt-6 border-t-2 border-[#7E22CE] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleManualSaveEncrypted}
                  className="py-2.5 px-6 bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Encrypt & Persist Assessment
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrescriptionOpen(true)}
                  className="py-2.5 px-5 border border-[#8C5E28] text-[#8C5E28] hover:bg-[#FAF6ED] bg-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Generate Patient Prescription
                </button>
              </div>

              {/* Previous & Next Module Navigation */}
              <div className="flex items-center gap-2">
                {(() => {
                  const currentIndex = navTabs.findIndex((t) => t.id === activeTab);
                  const prevTab = currentIndex > 0 ? navTabs[currentIndex - 1] : null;
                  const nextTab = navTabs[currentIndex + 1];
                  return (
                    <div className="flex items-center gap-2">
                      {prevTab && (
                        <button
                          type="button"
                          onClick={() => handleNavigateToTab(prevTab.id)}
                          className="py-2.5 px-4 border border-[#D9C4A5] text-[#5C3A14] bg-[#FFFDF9] hover:bg-[#FAF6ED] hover:border-[#8C5E28] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4 text-[#8C5E28]" />
                          <span>Back: {prevTab.short}</span>
                        </button>
                      )}
                      {nextTab && (
                        <button
                          type="button"
                          onClick={() => handleNavigateToTab(nextTab.id)}
                          className="py-2.5 px-5 border border-[#8C5E28] bg-[#8C5E28] hover:bg-[#724B1E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <span>Proceed to {nextTab.short}</span>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          </>
          )}
        </main>

        {/* LOGOUT CONFIRMATION MODAL */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border-2 border-purple-200 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Are you sure you want to log out?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Logging out will end your session and clear all unlocked folder access.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer - Žiathlon Theme (Hidden on Front Page for Clean Full Screen Experience) */}
        {activeTab !== 'overview' && (
          <footer className="mt-16 border-t-2 border-[#D9C4A5] bg-[#FAF6ED] py-8 px-4 text-center text-xs transition-colors text-[#5C3A14]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ZiathlonLogo size="sm" variant="horizontal" showSubtitle={true} theme="light" />
              </div>

              <div className="text-[11px] font-mono text-[#5C3A14] font-semibold">
                Hardware-Accelerated AES-GCM-256 E2EE • Zero-Knowledge Clinical Architecture
              </div>

              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                © 2026 ŽIATHLON SPORTS MEDICINE CLINIC • CLINICAL INTELLIGENCE
              </div>
            </div>
          </footer>
        )}

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

        {/* Personal Nutrition AI Quick Consultation Drawer */}
        <PersonalNutritionAiDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          onOpenFullSuite={() => setActiveTab('nutrition-ai')}
          generalInfo={generalInfo}
          calculations={calculations}
          selectedCategory={selectedCategory}
        />

        {/* ELSHA IFCT 2017 Table 1 Exact Formula Calculator Modal */}
        <ElshaIfctCalculatorModal
          isOpen={isElshaModalOpen}
          onClose={() => setIsElshaModalOpen(false)}
          initialFoodCode="A015"
          initialGrams={30}
        />
      </div>
    </DeviceFrame>
  );
}
