/**
 * nutritionStore.ts
 * 
 * Central Single Source of Truth for:
 * Patient Data → RDA Calculation Engine → Saved Nutrient Targets → 7-Day Diet Plan → Daily Food Quantity Calculation → RX Prescription.
 * 
 * Strict requirement:
 * Never maintain separate hard-coded calculations for RDA, Diet Plan and RX Prescription.
 * All sections read from this exact store.
 */

import {
  PatientRdaTargets,
  PatientRdaProfile,
  RdaNutrientItem,
  calculatePatientSpecificRda,
  calculateIdealBodyWeight,
  AVAILABLE_MICRONUTRIENT_CATALOG,
} from './rdaCalculationEngine';
import { GeneralInfo, Calculations, MealPlanDay, MealPlanItem } from '../types';
import { IFCT_2017_DATABASE, findIfctFood } from './ifct2017Database';

const STORAGE_KEY = 'ZIATHLON_PATIENT_RDA_TARGETS';

export interface DayComparisonItem {
  id: string;
  name: string;
  unit: string;
  target: number;
  actual: number;
  diff: number;
  diffPercent: number;
  status: 'Within target' | 'Below target' | 'Exceeds target';
}

/**
 * Build profile from patient data
 */
export function buildPatientRdaProfile(
  generalInfo: GeneralInfo,
  calculations: Calculations,
  selectedCategory: string = 'Diabetes Mellitus'
): PatientRdaProfile {
  const age = Number(generalInfo.age) || 38;
  const sex = generalInfo.sex || 'Female';
  const heightCm = Number(generalInfo.height) || 162;
  const weightKg = Number(generalInfo.weight) || 64;
  const bmi = calculations?.bmi || Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)) || 24.4;
  const bmr = calculations?.bmr || 1350;
  const tdee = calculations?.tdee || 1850;
  const activityLevel = generalInfo.activityLevel || 'moderately_active';
  const ibw = calculateIdealBodyWeight(heightCm, sex);

  return {
    age,
    sex,
    heightCm,
    weightKg,
    bmi,
    bmr,
    tdee,
    activityLevel,
    idealBodyWeightKg: ibw,
    diseaseCategory: selectedCategory || generalInfo.tag || 'Metabolic Health',
    clinicalDomain: selectedCategory || 'Sports Nutrition & Diabetes Reversal',
    fastingGlucose: 98,
    bloodPressureSystolic: 120,
    creatinine: 0.9,
    patientGoals: 'Improve insulin sensitivity, visceral fat reduction, maintain muscle mass',
  };
}

/**
 * Get active targets from storage or calculate fresh dynamically
 */
export function getActiveRdaTargets(
  generalInfo: GeneralInfo,
  calculations: Calculations,
  selectedCategory: string = 'Diabetes Mellitus'
): PatientRdaTargets {
  const profile = buildPatientRdaProfile(generalInfo, calculations, selectedCategory);
  const patientId = generalInfo.phone || 'patient-kiruthika';

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: PatientRdaTargets = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.nutrients) && parsed.nutrients.length >= 6) {
        // Return saved targets, updating the profile snapshot
        return {
          ...parsed,
          profile,
        };
      }
    }
  } catch (err) {
    console.warn('Error reading RDA targets from storage:', err);
  }

  // Calculate fresh patient-specific targets
  const initialNutrients = calculatePatientSpecificRda(profile);
  const initialTargets: PatientRdaTargets = {
    patientId,
    patientName: generalInfo.name || 'Kiruthika Sundar',
    profile,
    lastSaved: new Date().toISOString(),
    nutrients: initialNutrients,
    dayOverrides: {},
  };

  saveActiveRdaTargets(initialTargets);
  return initialTargets;
}

/**
 * Save active targets to localStorage and dispatch update event
 */
export function saveActiveRdaTargets(targets: PatientRdaTargets): void {
  try {
    const payload = {
      ...targets,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    // Dispatch cross-component synchronization event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ziathlon:rda-targets-updated', { detail: payload }));
    }
  } catch (err) {
    console.error('Failed saving RDA targets:', err);
  }
}

/**
 * Get effective target for a given day (with day-specific override if present)
 */
export function getEffectiveDayTarget(
  targets: PatientRdaTargets,
  dayNumber: number,
  nutrientId: string
): { target: number; isOverridden: boolean; baseTarget: number } {
  const nutrient = targets.nutrients.find((n) => n.id === nutrientId);
  const baseTarget = nutrient ? nutrient.prescribedTarget : 0;

  const dayOverride = targets.dayOverrides?.[dayNumber]?.[nutrientId];
  if (typeof dayOverride === 'number') {
    return {
      target: dayOverride,
      isOverridden: true,
      baseTarget,
    };
  }

  return {
    target: baseTarget,
    isOverridden: false,
    baseTarget,
  };
}

/**
 * Set a day-specific target override
 */
export function setDaySpecificOverride(
  dayNumber: number,
  nutrientId: string,
  newValue: number,
  applyToAllDays: boolean = false
): PatientRdaTargets {
  let targets: PatientRdaTargets;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    targets = raw ? JSON.parse(raw) : null;
  } catch {
    targets = null as any;
  }

  if (!targets) return null as any;

  if (applyToAllDays) {
    // Update base prescribed target across all days
    const nut = targets.nutrients.find((n) => n.id === nutrientId);
    if (nut) {
      nut.prescribedTarget = newValue;
      nut.isEdited = true;
    }
    // Clear individual overrides for this nutrient so all 7 days align
    if (targets.dayOverrides) {
      for (let d = 1; d <= 7; d++) {
        if (targets.dayOverrides[d]) {
          delete targets.dayOverrides[d][nutrientId];
        }
      }
    }
  } else {
    // Override ONLY for this specific day
    if (!targets.dayOverrides) {
      targets.dayOverrides = {};
    }
    if (!targets.dayOverrides[dayNumber]) {
      targets.dayOverrides[dayNumber] = {};
    }
    targets.dayOverrides[dayNumber][nutrientId] = newValue;
  }

  saveActiveRdaTargets(targets);
  return targets;
}

/**
 * Calculate actual nutritional totals for a single day's meals using the IFCT 2017 database
 */
export function calculateDayNutrientTotals(dayMeals: MealPlanItem[]): {
  energy: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  fibre: number;
  iron: number;
  calcium: number;
  potassium: number;
  sodium: number;
  vitaminC: number;
  vitaminD: number;
  vitaminB12: number;
  fluidLiters: number;
} {
  let energy = 0;
  let carbohydrates = 0;
  let protein = 0;
  let fat = 0;
  let fibre = 0;
  let iron = 0;
  let calcium = 0;
  let potassium = 0;
  let sodium = 0;
  let vitaminC = 0;
  let vitaminD = 0;
  let vitaminB12 = 0;
  let fluidLiters = 0;

  if (!dayMeals || !Array.isArray(dayMeals)) {
    return {
      energy: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      fibre: 0,
      iron: 0,
      calcium: 0,
      potassium: 0,
      sodium: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminB12: 0,
      fluidLiters: 0,
    };
  }

  for (const meal of dayMeals) {
    // If meal has custom recipe ingredients
    if (meal.ingredients && Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
      for (const ing of meal.ingredients) {
        const grams = Number(ing.weightGrams ?? (ing as any).quantityGrams ?? ing.quantity) || 50;
        const multiplier = grams / 100;
        const food = findIfctFood(ing.name);

        if (food) {
          energy += (food.energyKcal || 0) * multiplier;
          carbohydrates += (food.carbsG || 0) * multiplier;
          protein += (food.proteinG || 0) * multiplier;
          fat += (food.fatG || 0) * multiplier;
          fibre += (food.fiberG || 0) * multiplier;
          iron += (food.ironMg || 0) * multiplier;
          calcium += (food.calciumMg || 0) * multiplier;
          potassium += (food.potassiumMg || 0) * multiplier;
          sodium += (food.sodiumMg || 0) * multiplier;
          vitaminC += (food.vitaminCMg || 0) * multiplier;
          vitaminD += 0;
          vitaminB12 += 0;
          fluidLiters += ((food.waterG || 0) * multiplier) / 1000;
        } else {
          // Fallback to ingredient raw macros if not found
          const n = ing.nutrients;
          energy += (n?.calories ?? (ing as any).calories ?? 0);
          carbohydrates += (n?.carbs ?? (ing as any).carbs ?? 0);
          protein += (n?.protein ?? (ing as any).protein ?? 0);
          fat += (n?.fat ?? (ing as any).fat ?? 0);
          fibre += (n?.fiber ?? (ing as any).fiber ?? 0);
          iron += (n?.iron ?? (ing as any).iron ?? 0);
        }
      }
    } else {
      // If meal item has summary macros
      energy += Number(meal.calories) || 0;
      carbohydrates += Number(meal.carbs) || 0;
      protein += Number(meal.protein) || 0;
      fat += Number(meal.fat) || 0;
      fibre += Number(meal.fiber) || 0;
      iron += Number(meal.nutrients?.iron ?? (meal as any).iron ?? 0);
    }
  }

  return {
    energy: Math.round(energy),
    carbohydrates: Math.round(carbohydrates * 10) / 10,
    protein: Math.round(protein * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fibre: Math.round(fibre * 10) / 10,
    iron: Math.round(iron * 10) / 10,
    calcium: Math.round(calcium),
    potassium: Math.round(potassium),
    sodium: Math.round(sodium),
    vitaminC: Math.round(vitaminC * 10) / 10,
    vitaminD: Math.round(vitaminD),
    vitaminB12: Math.round(vitaminB12 * 10) / 10,
    fluidLiters: Math.round(fluidLiters * 10) / 10,
  };
}

/**
 * Compare day's actual intake against day's effective targets
 */
export function compareDayTargetVsActual(
  targets: PatientRdaTargets,
  dayNumber: number,
  dayMeals: MealPlanItem[]
): DayComparisonItem[] {
  const actuals = calculateDayNutrientTotals(dayMeals);

  const keyNutrients = [
    { id: 'energy', name: 'Energy', unit: 'kcal/day', actual: actuals.energy },
    { id: 'carbohydrates', name: 'Carbohydrates', unit: 'g/day', actual: actuals.carbohydrates },
    { id: 'protein', name: 'Protein', unit: 'g/day', actual: actuals.protein },
    { id: 'fat', name: 'Fat', unit: 'g/day', actual: actuals.fat },
    { id: 'fibre', name: 'Fibre', unit: 'g/day', actual: actuals.fibre },
    { id: 'iron', name: 'Iron', unit: 'mg/day', actual: actuals.iron },
  ];

  // Also include any user-added micronutrients
  for (const n of targets.nutrients) {
    if (n.isCustomAdded && !keyNutrients.find((k) => k.id === n.id)) {
      let act = 0;
      if (n.id === 'calcium') act = actuals.calcium;
      else if (n.id === 'potassium') act = actuals.potassium;
      else if (n.id === 'sodium') act = actuals.sodium;
      else if (n.id === 'vitamin-c') act = actuals.vitaminC;
      else if (n.id === 'vitamin-d') act = actuals.vitaminD;
      else if (n.id === 'vitamin-b12') act = actuals.vitaminB12;
      else if (n.id === 'water-fluid') act = actuals.fluidLiters;

      keyNutrients.push({
        id: n.id,
        name: n.name,
        unit: n.unit,
        actual: act,
      });
    }
  }

  return keyNutrients.map((item) => {
    const { target } = getEffectiveDayTarget(targets, dayNumber, item.id);
    const diff = Math.round((item.actual - target) * 10) / 10;
    const diffPercent = target > 0 ? (diff / target) * 100 : 0;

    let status: 'Within target' | 'Below target' | 'Exceeds target' = 'Within target';
    if (diffPercent < -6) {
      status = 'Below target';
    } else if (diffPercent > 6) {
      status = 'Exceeds target';
    }

    return {
      id: item.id,
      name: item.name,
      unit: item.unit,
      target,
      actual: item.actual,
      diff,
      diffPercent: Math.round(diffPercent),
      status,
    };
  });
}
