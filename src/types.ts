export type Sex = 'Male' | 'Female' | 'Other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export interface GeneralInfo {
  name: string;
  age: number | string;
  sex: Sex;
  height: number | string; // in cm
  weight: number | string; // in kg
  activityLevel: ActivityLevel;
  fatMass?: number;
  fatPercentage?: number;
  muscleMass?: number;
  ffm?: number;
  visceralFat?: number;
  waistCircumference?: number;
  hipCircumference?: number;
  waist?: number;
  hip?: number;
  bodyFat?: number;
  metabolicAge?: number;
  skeletalMuscle?: number;
  occupation?: string;
  maritalStatus?: string;
  livingCircumstances?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  place?: string;
  tag?: string;
  customTag?: string;
  referral?: string; // 'Insta' | 'Friends' | custom
  referralSource?: string; // 'Insta' | 'Friends' | custom
  address?: string;
  pincode?: string;
  previousReports?: Array<{
    id: string;
    name: string;
    date: string;
    url?: string;
    size?: string;
    type?: string;
  }>;
  orderedLabTests?: OrderedLabTestItem[];
  informantName?: string;
  bodyTemperature?: string;
  pulseRate?: string;
  bloodPressure?: string;
  spo2?: string;
}

export interface Calculations {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bmr: number;
  tdee: number;
  waistToHipRatio?: number;
  idealCalories?: number;
}

export type MajorDomainId = 'diseases' | 'disorders' | 'performance' | 'fitness';

export interface DomainCategory {
  id: string;
  name: string;
  description?: string;
  tag?: string;
}

export interface MajorDomain {
  id: MajorDomainId;
  name: string;
  code: string;
  categories: string[];
}

export type SymptomSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Often';

export interface SymptomAssessmentItem {
  id: string;
  symptom: string;
  duration: string;
  severity: SymptomSeverity | '';
  selected?: boolean;
}

export type LifestyleAssessmentRating = 'Good' | 'Moderate' | 'Poor' | 'High';

export interface LifestyleAssessmentItem {
  id: string;
  factor: string;
  patientResponse: string;
  assessment: LifestyleAssessmentRating;
  assessmentOptions: LifestyleAssessmentRating[];
}

export interface DailyRoutineItem {
  id: string;
  activity: string;
  patientResponseTime: string;
}

export interface SurgicalHistoryItem {
  id: string;
  procedure: string;
  date?: string;
  year?: string;
  hospital?: string;
  notes?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  howLongTaken?: string;
  frequency?: string;
  timing?: string;
  purpose?: string;
}

export interface FamilyHistoryItem {
  id: string;
  condition: string;
  whoHasIt: string;
  year: string;
  status?: string;
  notes?: string;
}

export interface MedicalHistory {
  surgeries: SurgicalHistoryItem[];
  medications: MedicationItem[];
  familyHistory: FamilyHistoryItem[];
  medicalConditions?: Array<{ condition: string; notes?: string; status?: string }>;
  allergies?: string;
}

export interface ExtractedPatientDossier {
  name?: string;
  age?: number | string;
  sex?: Sex;
  dateOfBirth?: string;
  place?: string;
  phone?: string;
  email?: string;
  height?: number | string;
  weight?: number | string;
  waistCircumference?: number;
  hipCircumference?: number;
  bmi?: number;
  bloodPressure?: string;
  hba1c?: string;
  fastingGlucose?: string;
  clinicalSummary?: string;
  tag?: string;
  customTag?: string;
  activityLevel?: ActivityLevel;
  domain?: string;
  category?: string;
  symptoms?: Array<{
    id?: string;
    symptom: string;
    duration?: string;
    severity?: SymptomSeverity | string;
    notes?: string;
    icdCode?: string;
  }>;
  patientMedicalHistory?: Array<{
    id?: string;
    condition: string;
    status?: string;
    duration?: string;
    durationOrYear?: string;
    diagnosisYear?: string;
    treatmentStatus?: string;
    notes?: string;
  }>;
  familyHistory?: Array<{
    id?: string;
    relation: string;
    conditions: string[];
    ageOfOnset?: string;
    status?: string;
    medications?: string;
    lifestyleNotes?: string;
  }>;
  medications?: Array<{
    id?: string;
    name: string;
    dosage?: string;
    frequency?: string;
    timing?: string;
    purpose?: string;
    duration?: string;
  }>;
  lifestyleHabits?: {
    diet?: string;
    exercise?: string;
    exerciseRoutine?: string;
    sleep?: string;
    sleepDuration?: string;
    stress?: string;
    stressLevel?: string;
    smoking?: string;
    alcohol?: string;
    hydration?: string;
    waterIntake?: string;
  };
  dailyRoutine?: Array<{
    id?: string;
    time: string;
    activity: string;
  }>;
  dietaryRecall?: Array<{
    id?: string;
    mealTime: string;
    foodItemsConsumed: string;
    quantity: string;
    householdMeasure?: string;
  }>;
  workingDiagnoses?: string[];
  diagnosticsToBeDone?: string[];
  selectedDomain?: string;
  selectedCategory?: string;
  clinicalNotes?: string;
}

export interface GutHealthQuestion {
  id: string;
  question: string;
  patientResponse: string;
  type: 'frequency' | 'times_per_day' | 'relief' | 'consistency' | 'change' | 'text' | 'cravings' | 'probiotic' | 'yes_no';
  options?: string[];
  severity?: string;
  impactScore: number; // weight for gut health calculation
}

export interface UploadedReport {
  id: string;
  name: string;
  type: 'image' | 'document';
  dataUrl?: string;
  date: string;
  size: string;
  encryptedHash: string;
  category: string;
}

export interface FoodHabits {
  dietaryPattern: string;
  vegetarianStatus: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | string;
  preferredFoods: string;
  dislikedFoods: string;
  foodAllergies: string;
  foodIntolerances: string;
  foodsAvoided: string;
  appetite: 'Good' | 'Moderate' | 'Poor';
  mealFrequency: number | string;
  eatingOutside: 'Rarely' | 'Sometimes' | 'Often';
  addedSugarIntake: 'Low' | 'Moderate' | 'High';
  processedFoodIntake: 'Low' | 'Moderate' | 'High';
}

export interface FoodFrequencyItem {
  id: string;
  name: string;
  frequency: string; // e.g., 'Daily', '2-3x/week', 'Weekly', 'Rarely', 'Never', or count
}

export interface FoodFrequencyCategory {
  id: string;
  title: string;
  items: FoodFrequencyItem[];
}

export type IcmrCookingMethod =
  | 'Raw'
  | 'Boiled / Simmered'
  | 'Steamed'
  | 'Dry Roasted / Puffed'
  | 'Pressure Cooked'
  | 'Sautéed / Tadka'
  | 'Shallow Fried / Pan Fried'
  | 'Deep Fried'
  | 'Fermented'
  | 'Baked';

export interface CustomRecipeIngredient {
  id: string;
  foodCode?: string;
  name: string;
  quantityGrams: number;
  cookingMethod: IcmrCookingMethod;
  per100g?: {
    energyKj?: number;
    energyKcal: number;
    proteinG: number;
    fatG: number;
    carbsG: number;
    fiberG: number;
    calciumMg?: number;
    ironMg?: number;
  };
  calculated: {
    energyKj: number;
    energyKcal: number;
    proteinG: number;
    fatG: number;
    carbsG: number;
    fiberG: number;
    calciumMg: number;
    ironMg: number;
    cookingAdjustmentNote?: string;
  };
}

export interface DietaryRecallItem {
  id: string;
  mealTime: string;
  foodItemsConsumed?: string;
  foodBeverage?: string;
  quantity: string;
  unitMeasure?: string;
  preparationMethod?: string;
  cookingMethod?: IcmrCookingMethod;
  customIngredients?: CustomRecipeIngredient[];
  hasCustomIngredients?: boolean;
}

export interface DietaryRecallEntry {
  id: string;
  mealTime: string;
  foodBeverage: string;
  foodItemsConsumed?: string;
  quantity: string;
  unitMeasure?: string;
  preparationMethod?: string;
  cookingMethod?: IcmrCookingMethod;
  customIngredients?: CustomRecipeIngredient[];
  hasCustomIngredients?: boolean;
}

export interface NutrientGapItem {
  nutrient: string;
  patientIntake: number;
  recommendedNeed: number;
  unit: string;
  gapExcess: number;
  status: 'Low' | 'Adequate' | 'Excess' | 'Slightly High';
}

export interface NutrientGapAnalysis {
  calories: { actual: number; target: number; gap: number };
  protein: { actual: number; target: number; gap: number };
  carbs: { actual: number; target: number; gap: number };
  fiber: { actual: number; target: number; gap: number };
  fats: { actual: number; target: number; gap: number };
}

export interface FunctionalFood {
  id: string;
  name: string;
  tamilCommonName?: string;
  benefit?: string;
  mechanism?: string;
  dosage?: string;
  prescribedDose?: string;
  active: boolean;
}

export interface NutrientBreakdown {
  calories: number; // kcal
  carbs: number; // g
  protein: number; // g
  fat: number; // g
  fiber: number; // g
  calcium: number; // mg
  iron: number; // mg
  zinc: number; // mg
  magnesium: number; // mg
  sodium: number; // mg
  potassium: number; // mg
  vitaminA: number; // mcg
  vitaminC: number; // mg
  vitaminD: number; // mcg
  folate: number; // mcg
  vitaminB12: number; // mcg
}

export interface IcmrRdaBenchmark {
  energy: { target: number; unit: 'kcal'; note: string };
  protein: { target: number; unit: 'g'; note: string };
  carbohydrate: { target: number; unit: 'g'; minPercent: number; maxPercent: number; note: string };
  fat: { target: number; unit: 'g'; minPercent: number; maxPercent: number; note: string };
  fiber: { target: number; unit: 'g'; note: string };
  calcium: { target: number; unit: 'mg'; note: string };
  iron: { target: number; unit: 'mg'; note: string };
  zinc: { target: number; unit: 'mg'; note: string };
  magnesium: { target: number; unit: 'mg'; note: string };
  sodium: { maxSafe: number; unit: 'mg'; note: string };
  potassium: { target: number; unit: 'mg'; note: string };
  vitaminA: { target: number; unit: 'mcg'; note: string };
  vitaminC: { target: number; unit: 'mg'; note: string };
  vitaminD: { target: number; unit: 'mcg'; note: string };
  folate: { target: number; unit: 'mcg'; note: string };
  vitaminB12: { target: number; unit: 'mcg'; note: string };
}

export type IngredientCategory =
  | 'Millets & Cereals'
  | 'Pulses & Legumes'
  | 'Vegetables & Keerai'
  | 'Dairy & Plant Protein'
  | 'Nuts & Oilseeds'
  | 'Fruits'
  | 'Oils & Healthy Fats'
  | 'Functional & Spices';

export interface IcmrIngredient {
  id: string;
  name: string;
  regionalName?: string;
  category: IngredientCategory;
  per100g: NutrientBreakdown;
  defaultUnit: string;
  gramsPerUnit: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  clinicalHighlight?: string;
}

export interface RecipeIngredientItem {
  id: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  weightGrams: number;
  nutrients: NutrientBreakdown;
}

export interface ClinicalRecipe {
  id: string;
  name: string;
  servings: number;
  preparationNote?: string;
  ingredients: RecipeIngredientItem[];
  nutrients: NutrientBreakdown;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  icmrVerified: boolean;
}

export interface DiabetesGuidelines {
  foodsToInclude: string[];
  foodsInModeration: string[];
  foodsToMinimize: string[];
  functionalFoods: {
    id: string;
    name: string;
    dosage: string;
    mechanism: string;
  }[];
  generalInstructions: string[];
}

export interface MealPlanItem {
  id: string;
  mealName: string;
  time: string;
  items: { name: string; portion: string }[];
  glycemicIndicator: 'green' | 'yellow' | 'red';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  clinicalNotes?: string;
  nutrients?: NutrientBreakdown;
  ingredients?: RecipeIngredientItem[];
  recipes?: ClinicalRecipe[];
}

export interface DietDayPlan {
  dayNumber: number;
  dayName: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalFiber: number;
  meals: MealPlanItem[];
  totalNutrients?: NutrientBreakdown;
}

export type MealPlanDay = DietDayPlan;

export interface ExerciseDayPlan {
  dayNumber: number;
  dayName: string;
  focus: string;
  activity: string;
  duration: string;
  intensity: 'Light' | 'Moderate' | 'High';
  exercises: string[];
}

export interface IngredientGuidelinesCategory {
  categoryName: string;
  items: string[];
}

export interface DietMealItem {
  id: string;
  mealName: string;
  suggestedFood: string;
  portionSize: string;
  validationStatus: 'green' | 'yellow' | 'red';
  validationNote: string;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  caloriesEst: number;
}

export interface DayDietPlan {
  dayNumber: number;
  saved: boolean;
  notes?: string;
  meals: DietMealItem[];
}

export interface WeeklyFitnessDay {
  day: string;
  guideline: string;
  focus: string;
  completed?: boolean;
}

export interface NutritionPrescription {
  patientName: string;
  patientId: string;
  date: string;
  condition: string;
  goal: string;
  meals: {
    mealTime: string;
    prescribedDiet: string;
    portion: string;
  }[];
  macros: {
    energy: number;
    protein: number;
    carbohydrate: number;
    fat: number;
    fibre: number;
  };
  fitnessGuidelines: WeeklyFitnessDay[];
  foodsToMinimize: string[];
  clinicianNotes?: string;
  clinicianSignature: string;
}

export interface EncryptedVaultMeta {
  isEncrypted: boolean;
  algorithm: string;
  keyFingerprint: string;
  lastEncryptedAt: string;
  auditTrail: {
    timestamp: string;
    action: string;
    details: string;
  }[];
}

export type PlatformView = 'responsive' | 'ios' | 'android';

export type ConsultationType =
  | 'Initial Assessment'
  | 'Follow-up Consultation'
  | 'Glycemic & Lab Review'
  | 'Dietary Recalibration'
  | 'Acute / SOS Intervention';

export type PatientAdherenceLevel =
  | 'High (80-100%)'
  | 'Moderate (50-79%)'
  | 'Low (<50%)'
  | 'Non-Compliant';

export type NoteCategoryTag =
  | 'Initial Assessment'
  | 'Follow-up'
  | 'Dietary Adjustment'
  | 'Glycemic & Lab Review'
  | 'Acute / SOS';

export interface ObjectiveVitalsFindings {
  bloodGlucoseFasting?: string;
  bloodGlucosePostPrandial?: string;
  bloodPressure?: string;
  currentWeight?: string;
  ketonesLevel?: string;
  hba1cEst?: string;
}

export interface ClinicalConsultationNote {
  id: string;
  sessionDate: string;
  sessionTime: string;
  clinicianName: string;
  consultationType: ConsultationType;
  categoryTag: NoteCategoryTag;
  patientAdherence: PatientAdherenceLevel;
  chiefComplaintsObservations: string;
  objectiveVitalsFindings: ObjectiveVitalsFindings;
  dietaryComplianceNotes: string;
  privateClinicalAssessment: string;
  actionPlanNextSteps: string;
  isConfidential: boolean;
  encryptedAt?: string;
}

export interface NutritionChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  imagePreview?: string;
  glycemicImpact?: 'Low GI' | 'Medium GI' | 'High GI Spike Warning' | 'Balanced';
  suggestedActions?: string[];
  keyMacros?: {
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    fiber?: number;
  };
}

export interface PlateAnalysisItem {
  name: string;
  portion: string;
  calories: number;
  carbs: number;
  protein: number;
  fat?: number;
  gi?: string;
}

export interface PlateAnalysisData {
  mealType?: string;
  identifiedItems: PlateAnalysisItem[];
  totalEstimatedCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalFiber: number;
  overallGlycemicScore: string;
  diabeticSuitability: string;
  recommendations: string[];
}

export interface MealSwapRecommendation {
  original: string;
  healthySwap: string;
  calories: number;
  glycemicIndex: string;
  carbsSaved: string;
  proteinBoost: string;
  clinicalBenefit: string;
  quickRecipeTip: string;
}

// Lab Test Ordered under Profile Prescription Folder
export interface OrderedLabTestItem {
  id: string;
  testName: string; // e.g. "Blood Test (Fasting Glucose)", "Lipid Profile", "Urine Routine"
  category: 'Blood Test' | 'Lipid Test' | 'Urine Test' | 'Thyroid' | 'Renal' | 'Other';
  instructions: string;
  fastingRequired: boolean;
  orderedDate: string;
  status: 'Ordered' | 'Sample Collected' | 'Report Verified';
}

// Medicinal Prescription Table: Medicine | Dosage | Duration
export interface MedicinalPrescriptionDrug {
  id: string;
  medicine: string;
  dosage: string;
  duration: string;
  timing?: string; // e.g., "After Breakfast", "Before Bed"
  instructions?: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
}

// Medicinal Goals Table: Primary | Secondary | Tertiary
export interface ClinicalGoalItem {
  id: string;
  type: 'Primary' | 'Secondary' | 'Tertiary';
  title: string;
  targetDescription: string;
  targetTimeline: string;
  status: 'In Progress' | 'Active Target' | 'Achieved';
}

// Medicinal Diagnostics Table: Susceptibility and Diagnostics
export interface DiagnosticFindingItem {
  id: string;
  susceptibilityCondition: string; // e.g. "Susceptible to Liver Diseases (NAFLD)", "Susceptible to Type 2 Diabetes"
  riskLevel: 'High Risk' | 'Moderate Risk' | 'Mild Susceptibility' | 'Elevated';
  supportingBiomarkers: string;
  clinicalIntervention: string;
  diagnosedDate: string;
}

// Blood Report Ranges Table: Value | Normal Range & Color Reasons
export interface BloodReportRangeItem {
  id: string;
  testName: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'borderline' | 'abnormal'; // normal -> green, borderline -> orange, abnormal -> red
  reason: string;
}

// Exercise Table & Guidelines: AI 7-Day & Manual Typing
export interface ExerciseDayGuideline {
  dayNumber: number;
  dayName: string;
  protocolFocus: string;
  exercises: string;
  setsReps: string;
  hrZoneIntensity: string;
  recoveryNote: string;
}

// Medical Folder & Past Visit Types
export interface PatientRecord {
  id: string;
  name: string;
  age?: number;
  sex?: string;
  dob?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  tag?: string;
  created_at?: string;
}

export interface PatientSections {
  patient_id: string;
  symptoms: string;
  symptom_duration?: string;
  patient_history: string;
  medication: string;
  family_history: string;
  diagnostics: string;
  notes?: string;
}

export interface PastVisitRecord {
  id: string;
  patient_id: string;
  visit_date: string;
  visit_display_date: string;
  doctor_name: string;
  doctor_title?: string;
  visit_type?: string;
  summary_tag?: string;
  symptoms: string;
  symptom_duration?: string;
  patient_history: string;
  medication: string;
  family_history: string;
  diagnostics: string;
  notes?: string;
  created_at: string;
}

export interface MedicalDocumentItem {
  id: string;
  patient_id: string;
  file_name?: string;
  original_file_name?: string;
  mime_type: string;
  file_size: number;
  category: string;
  notes?: string;
  document_date: string;
  visit_id?: string;
  uploaded_at: string;
  view_url: string;
  download_url: string;
}


