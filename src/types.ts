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
  occupation?: string;
  maritalStatus?: string;
  livingCircumstances?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
}

export interface Calculations {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bmr: number;
  tdee: number;
  waistToHipRatio?: number;
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
}

export interface MedicalHistory {
  surgeries: SurgicalHistoryItem[];
  medications: MedicationItem[];
  familyHistory: FamilyHistoryItem[];
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

export interface DietaryRecallItem {
  id: string;
  mealTime: string;
  foodItemsConsumed?: string;
  foodBeverage?: string;
  quantity: string;
  unitMeasure?: string;
  preparationMethod?: string;
}

export interface DietaryRecallEntry {
  id: string;
  mealTime: string;
  foodBeverage: string;
  foodItemsConsumed?: string;
  quantity: string;
  unitMeasure?: string;
  preparationMethod?: string;
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

