import {
  DietaryRecallEntry,
  DietaryRecallItem,
  DietDayPlan,
  GeneralInfo,
  MealPlanItem,
  NutrientBreakdown,
  NutrientGapAnalysis,
  Sex,
} from '../types';
import {
  FOOD_NUTRIENT_DICTIONARY,
  FoodReferenceItem,
  ICMR_NUTRIENT_BENCHMARKS,
  NutrientRdaTarget,
  NUTRIENT_GAP_THRESHOLDS,
  PORTION_CONVERSIONS,
} from './nutritionalConstants';

/**
 * Calculated Nutrient Gap Item (compatible with both types.ts and NutritionalGapSection.tsx)
 */
export interface CalculatedNutrientGap {
  id: string;
  nutrient: string;
  unit: string;
  icmrRda: number;
  actualIntake: number;
  gap: number;
  adequacyPct: number;
  status: 'Critical Deficit' | 'Moderate Deficit' | 'Optimal' | 'Excess';
  clinicalRisk: string;
  correctiveFoods: string[];
  // Backwards compatibility properties for types.ts NutrientGapItem
  patientIntake: number;
  recommendedNeed: number;
  gapExcess: number;
}

/**
 * Recalculated nutritional totals including micronutrients & hydration
 */
export interface NutritionalTotals extends NutrientBreakdown {
  fluidLiters: number;
}

/**
 * Options to customize calculations and personalized ICMR benchmarks
 */
export interface NutritionalCalculationOptions {
  generalInfo?: Partial<GeneralInfo>;
  weightKg?: number;
  heightCm?: number;
  ageYears?: number;
  sex?: Sex;
  tdee?: number;
  customBenchmarks?: Partial<Record<string, number>>;
}

/**
 * Full calculation result returned by the nutritional calculator
 */
export interface NutritionalCalculationResult {
  totals: NutritionalTotals;
  macroRatios: {
    carbsPercent: number;
    proteinPercent: number;
    fatPercent: number;
  };
  benchmarks: Record<string, { target: number; unit: string; name: string }>;
  gaps: CalculatedNutrientGap[];
  gapAnalysis: NutrientGapAnalysis;
  summary: {
    overallAdequacyPct: number;
    criticalDeficitsCount: number;
    moderateDeficitsCount: number;
    optimalCount: number;
    excessCount: number;
    keyLimitingFactor: string;
    clinicalNotes: string;
  };
  mealBreakdowns: {
    mealTime: string;
    itemDescription: string;
    nutrients: NutritionalTotals;
  }[];
}

/**
 * Helper: Zero-initialized nutrient totals
 */
export function createEmptyNutrientTotals(): NutritionalTotals {
  return {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    zinc: 0,
    magnesium: 0,
    sodium: 0,
    potassium: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    folate: 0,
    vitaminB12: 0,
    fluidLiters: 0,
  };
}

/**
 * Helper: Sum multiple nutrient totals
 */
export function accumulateNutrients(
  target: NutritionalTotals,
  source: Partial<NutritionalTotals>
): void {
  target.calories += source.calories || 0;
  target.carbs += source.carbs || 0;
  target.protein += source.protein || 0;
  target.fat += source.fat || 0;
  target.fiber += source.fiber || 0;
  target.calcium += source.calcium || 0;
  target.iron += source.iron || 0;
  target.zinc += source.zinc || 0;
  target.magnesium += source.magnesium || 0;
  target.sodium += source.sodium || 0;
  target.potassium += source.potassium || 0;
  target.vitaminA += source.vitaminA || 0;
  target.vitaminC += source.vitaminC || 0;
  target.vitaminD += source.vitaminD || 0;
  target.folate += source.folate || 0;
  target.vitaminB12 += source.vitaminB12 || 0;
  target.fluidLiters += source.fluidLiters || 0;
}

/**
 * Extracts a numeric portion and unit from free text (e.g. "3 nos", "150g", "2.5 litres", "1 cup")
 */
export function parseQuantityAndUnit(
  qtyStr?: string,
  unitStr?: string
): { quantity: number; unit: string; totalGrams: number } {
  const combined = `${qtyStr || ''} ${unitStr || ''}`.trim().toLowerCase();
  if (!combined) {
    return { quantity: 1, unit: 'serving', totalGrams: 100 };
  }

  // Check for litres / water
  const literMatch = combined.match(/(\d+(?:\.\d+)?)\s*(?:l|liter|litres|litre)/i);
  if (literMatch) {
    const liters = parseFloat(literMatch[1]);
    return { quantity: liters, unit: 'liter', totalGrams: liters * 1000 };
  }

  // Check for grams / ml
  const gramMatch = combined.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams|ml)/i);
  if (gramMatch) {
    const g = parseFloat(gramMatch[1]);
    return { quantity: g, unit: 'g', totalGrams: g };
  }

  // Check for counts + item (e.g., "3 nos", "2 rotis", "3 idlis", "5 nuts", "1 bowl", "1 cup")
  const unitKeys = Object.keys(PORTION_CONVERSIONS);
  for (const u of unitKeys) {
    const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${u}`, 'i');
    const match = combined.match(regex);
    if (match) {
      const count = parseFloat(match[1]);
      const factor = PORTION_CONVERSIONS[u];
      return { quantity: count, unit: u, totalGrams: count * factor };
    }
  }

  // Fallback: extract leading number
  const numMatch = combined.match(/^(\d+(?:\.\d+)?)/);
  if (numMatch) {
    const count = parseFloat(numMatch[1]);
    return { quantity: count, unit: 'serving', totalGrams: count * 100 };
  }

  return { quantity: 1, unit: 'serving', totalGrams: 100 };
}

/**
 * Searches the reference dictionary for food items described in recall text
 */
export function matchFoodsInText(description: string): {
  matchedItems: FoodReferenceItem[];
  waterLiters: number;
} {
  const text = description.toLowerCase();
  const matched: FoodReferenceItem[] = [];
  let waterLiters = 0;

  // Direct water check
  if (text.includes('water') || text.includes('hydrat')) {
    const waterMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:l|liter|litres|litre)/i);
    if (waterMatch) {
      waterLiters = parseFloat(waterMatch[1]);
    } else if (text.includes('glass')) {
      const glassMatch = text.match(/(\d+)\s*glass/);
      waterLiters = (glassMatch ? parseInt(glassMatch[1], 10) : 1) * 0.25;
    } else if (text.includes('ml')) {
      const mlMatch = text.match(/(\d+)\s*ml/);
      waterLiters = (mlMatch ? parseInt(mlMatch[1], 10) : 250) / 1000;
    } else {
      waterLiters = 0.25;
    }
  }

  for (const item of FOOD_NUTRIENT_DICTIONARY) {
    for (const name of item.names) {
      if (text.includes(name)) {
        if (!matched.some((m) => m.id === item.id)) {
          matched.push(item);
        }
        break;
      }
    }
  }

  return { matchedItems: matched, waterLiters };
}

/**
 * Calculates nutrients from a single dietary recall item
 */
export function calculateSingleRecallNutrients(
  item: DietaryRecallItem | DietaryRecallEntry
): NutritionalTotals {
  const result = createEmptyNutrientTotals();
  const desc = (item.foodItemsConsumed || item.foodBeverage || '').trim();
  if (!desc) return result;

  const { totalGrams } = parseQuantityAndUnit(item.quantity, item.unitMeasure);
  const { matchedItems, waterLiters } = matchFoodsInText(desc);

  result.fluidLiters += waterLiters;

  if (matchedItems.length === 0) {
    // Heuristic fallback for unknown foods: assume balanced composite Indian meal
    const factor = (totalGrams > 0 ? totalGrams : 100) / 100;
    result.calories += Math.round(150 * factor);
    result.carbs += parseFloat((22 * factor).toFixed(1));
    result.protein += parseFloat((4.5 * factor).toFixed(1));
    result.fat += parseFloat((3.5 * factor).toFixed(1));
    result.fiber += parseFloat((2.5 * factor).toFixed(1));
    result.calcium += Math.round(40 * factor);
    result.iron += parseFloat((1.0 * factor).toFixed(1));
    result.zinc += parseFloat((0.8 * factor).toFixed(1));
    result.magnesium += Math.round(25 * factor);
    result.sodium += Math.round(150 * factor);
    result.potassium += Math.round(180 * factor);
    result.vitaminA += Math.round(20 * factor);
    result.vitaminC += Math.round(5 * factor);
    result.vitaminD += 0;
    result.folate += Math.round(15 * factor);
    result.vitaminB12 += 0.1;
    return result;
  }

  // Distribute estimated grams equally among matched components
  const gramsPerComponent = totalGrams / matchedItems.length;

  for (const food of matchedItems) {
    const scale = gramsPerComponent / 100;
    const n = food.nutrientsPer100g;

    result.calories += Math.round(n.calories * scale);
    result.carbs += parseFloat((n.carbs * scale).toFixed(1));
    result.protein += parseFloat((n.protein * scale).toFixed(1));
    result.fat += parseFloat((n.fat * scale).toFixed(1));
    result.fiber += parseFloat((n.fiber * scale).toFixed(1));
    result.calcium += Math.round(n.calcium * scale);
    result.iron += parseFloat((n.iron * scale).toFixed(2));
    result.zinc += parseFloat((n.zinc * scale).toFixed(2));
    result.magnesium += Math.round(n.magnesium * scale);
    result.sodium += Math.round(n.sodium * scale);
    result.potassium += Math.round(n.potassium * scale);
    result.vitaminA += Math.round(n.vitaminA * scale);
    result.vitaminC += parseFloat((n.vitaminC * scale).toFixed(1));
    result.vitaminD += parseFloat((n.vitaminD * scale).toFixed(1));
    result.folate += Math.round(n.folate * scale);
    result.vitaminB12 += parseFloat((n.vitaminB12 * scale).toFixed(2));
    if (n.fluidLiters) {
      result.fluidLiters += n.fluidLiters * scale;
    }
  }

  return result;
}

/**
 * Calculates nutrients from a meal plan item
 */
export function calculateSingleMealPlanNutrients(meal: MealPlanItem): NutritionalTotals {
  const result = createEmptyNutrientTotals();

  if (meal.nutrients) {
    accumulateNutrients(result, meal.nutrients);
    return result;
  }

  if (meal.ingredients && meal.ingredients.length > 0) {
    for (const ing of meal.ingredients) {
      accumulateNutrients(result, ing.nutrients);
    }
    return result;
  }

  // Fallback to explicit macro fields
  result.calories = meal.calories || 0;
  result.carbs = meal.carbs || 0;
  result.protein = meal.protein || 0;
  result.fat = meal.fat || 0;
  result.fiber = meal.fiber || 0;

  // Impute micronutrients from items text if available
  if (meal.items && meal.items.length > 0) {
    const combinedDesc = meal.items.map((i) => `${i.name} ${i.portion}`).join(' ');
    const { matchedItems } = matchFoodsInText(combinedDesc);
    for (const food of matchedItems) {
      const scale = food.defaultServingGrams / 100;
      const n = food.nutrientsPer100g;
      result.calcium += Math.round(n.calcium * scale);
      result.iron += parseFloat((n.iron * scale).toFixed(1));
      result.zinc += parseFloat((n.zinc * scale).toFixed(1));
      result.magnesium += Math.round(n.magnesium * scale);
      result.sodium += Math.round(n.sodium * scale);
      result.potassium += Math.round(n.potassium * scale);
      result.vitaminA += Math.round(n.vitaminA * scale);
      result.vitaminC += parseFloat((n.vitaminC * scale).toFixed(1));
      result.vitaminD += parseFloat((n.vitaminD * scale).toFixed(1));
      result.folate += Math.round(n.folate * scale);
      result.vitaminB12 += parseFloat((n.vitaminB12 * scale).toFixed(2));
    }
  }

  return result;
}

/**
 * Computes personalized ICMR RDA benchmarks for the patient
 */
export function getPatientBenchmarks(
  options?: NutritionalCalculationOptions
): Record<string, { target: number; unit: string; name: string; benchmark: NutrientRdaTarget }> {
  const weight = options?.weightKg || (options?.generalInfo?.weight ? parseFloat(String(options.generalInfo.weight)) : 60);
  const sex = options?.sex || options?.generalInfo?.sex || 'Male';
  const tdee = options?.tdee || 1850;

  const result: Record<string, { target: number; unit: string; name: string; benchmark: NutrientRdaTarget }> = {};

  for (const [key, b] of Object.entries(ICMR_NUTRIENT_BENCHMARKS)) {
    let target = b.defaultTarget;
    if (b.calculateForPatient) {
      target = b.calculateForPatient(weight, sex, tdee);
    }
    if (options?.customBenchmarks && options.customBenchmarks[key] !== undefined) {
      target = options.customBenchmarks[key]!;
    }
    result[key] = {
      target,
      unit: b.unit,
      name: b.name,
      benchmark: b,
    };
  }

  return result;
}

/**
 * Core Nutritional Calculator Function
 *
 * Accepts dietary inputs (either 24-hour recall items or structured meal plans)
 * and returns real-time recalculated totals, macronutrient distribution ratios,
 * and comprehensive ICMR-NIN nutrient gaps with status classifications.
 */
export function calculateNutritionalTotalsAndGaps(
  dietaryInput:
    | DietaryRecallItem[]
    | DietaryRecallEntry[]
    | MealPlanItem[]
    | DietDayPlan
    | DietDayPlan[]
    | DietaryRecallItem,
  options?: NutritionalCalculationOptions
): NutritionalCalculationResult {
  const totals = createEmptyNutrientTotals();
  const mealBreakdowns: {
    mealTime: string;
    itemDescription: string;
    nutrients: NutritionalTotals;
  }[] = [];

  // Normalize input array
  if (!Array.isArray(dietaryInput)) {
    if ('meals' in dietaryInput && Array.isArray((dietaryInput as DietDayPlan).meals)) {
      // Single DietDayPlan
      for (const meal of (dietaryInput as DietDayPlan).meals) {
        const mealNutrients = calculateSingleMealPlanNutrients(meal);
        accumulateNutrients(totals, mealNutrients);
        mealBreakdowns.push({
          mealTime: meal.time || meal.mealName,
          itemDescription: meal.mealName,
          nutrients: mealNutrients,
        });
      }
    } else {
      // Single recall item
      const itemNutrients = calculateSingleRecallNutrients(dietaryInput as DietaryRecallItem);
      accumulateNutrients(totals, itemNutrients);
      mealBreakdowns.push({
        mealTime: (dietaryInput as DietaryRecallItem).mealTime || 'Meal',
        itemDescription: (dietaryInput as DietaryRecallItem).foodItemsConsumed || 'Item',
        nutrients: itemNutrients,
      });
    }
  } else if (dietaryInput.length > 0) {
    const first = dietaryInput[0];

    if ('dayNumber' in first && 'meals' in first) {
      // Array of DietDayPlan: use the first active day or average across days
      const days = dietaryInput as DietDayPlan[];
      const activeDay = days[0];
      for (const meal of activeDay.meals) {
        const mealNutrients = calculateSingleMealPlanNutrients(meal);
        accumulateNutrients(totals, mealNutrients);
        mealBreakdowns.push({
          mealTime: meal.time || meal.mealName,
          itemDescription: meal.mealName,
          nutrients: mealNutrients,
        });
      }
    } else if ('glycemicIndicator' in first || 'mealName' in first) {
      // Array of MealPlanItem
      const meals = dietaryInput as MealPlanItem[];
      for (const meal of meals) {
        const mealNutrients = calculateSingleMealPlanNutrients(meal);
        accumulateNutrients(totals, mealNutrients);
        mealBreakdowns.push({
          mealTime: meal.time || meal.mealName,
          itemDescription: meal.mealName,
          nutrients: mealNutrients,
        });
      }
    } else {
      // Array of DietaryRecallItem / DietaryRecallEntry
      const recallItems = dietaryInput as (DietaryRecallItem | DietaryRecallEntry)[];
      for (const item of recallItems) {
        const itemNutrients = calculateSingleRecallNutrients(item);
        accumulateNutrients(totals, itemNutrients);
        mealBreakdowns.push({
          mealTime: item.mealTime || 'Interval',
          itemDescription: item.foodItemsConsumed || item.foodBeverage || 'Food intake',
          nutrients: itemNutrients,
        });
      }
    }
  }

  // Round key totals
  totals.calories = Math.round(totals.calories);
  totals.carbs = Math.round(totals.carbs);
  totals.protein = Math.round(totals.protein);
  totals.fat = Math.round(totals.fat);
  totals.fiber = Math.round(totals.fiber);
  totals.fluidLiters = parseFloat(totals.fluidLiters.toFixed(1));

  // Macronutrient caloric ratios
  const totalCal = totals.calories > 0 ? totals.calories : 1;
  const carbsCalories = totals.carbs * 4;
  const proteinCalories = totals.protein * 4;
  const fatCalories = totals.fat * 9;

  const macroRatios = {
    carbsPercent: Math.round((carbsCalories / totalCal) * 100),
    proteinPercent: Math.round((proteinCalories / totalCal) * 100),
    fatPercent: Math.round((fatCalories / totalCal) * 100),
  };

  // Obtain patient benchmarks
  const benchmarkMap = getPatientBenchmarks(options);

  // Compile 10 Core Gaps matching NutritionalGapSection.tsx matrix
  const evaluatedKeys = [
    { key: 'calories', id: 'ng-1', label: 'Total Energy' },
    { key: 'protein', id: 'ng-2', label: 'Total Protein' },
    { key: 'fiber', id: 'ng-3', label: 'Dietary Fiber' },
    { key: 'iron', id: 'ng-4', label: 'Elemental Iron' },
    { key: 'calcium', id: 'ng-5', label: 'Calcium' },
    { key: 'vitaminB12', id: 'ng-6', label: 'Vitamin B12 (Cobalamin)' },
    { key: 'vitaminD', id: 'ng-7', label: 'Vitamin D3' },
    { key: 'magnesium', id: 'ng-8', label: 'Magnesium' },
    { key: 'potassium', id: 'ng-9', label: 'Potassium' },
    { key: 'fluid', id: 'ng-10', label: 'Fluid / Water Intake' },
  ];

  const gaps: CalculatedNutrientGap[] = evaluatedKeys.map((item) => {
    const b = benchmarkMap[item.key];
    const target = b ? b.target : 100;
    const unit = b ? b.unit : '';
    const actual =
      item.key === 'fluid'
        ? totals.fluidLiters
        : typeof totals[item.key as keyof NutritionalTotals] === 'number'
        ? (totals[item.key as keyof NutritionalTotals] as number)
        : 0;

    const gap = parseFloat((actual - target).toFixed(1));
    const adequacyPct = Math.min(250, Math.round((actual / (target || 1)) * 100));

    let status: 'Critical Deficit' | 'Moderate Deficit' | 'Optimal' | 'Excess' = 'Optimal';
    if (adequacyPct < NUTRIENT_GAP_THRESHOLDS.criticalDeficitPercent) {
      status = 'Critical Deficit';
    } else if (adequacyPct < NUTRIENT_GAP_THRESHOLDS.moderateDeficitPercent) {
      status = 'Moderate Deficit';
    } else if (adequacyPct > NUTRIENT_GAP_THRESHOLDS.excessPercent && (item.key === 'calories' || item.key === 'sodium' || item.key === 'carbs')) {
      status = 'Excess';
    } else {
      status = 'Optimal';
    }

    return {
      id: item.id,
      nutrient: item.label,
      unit,
      icmrRda: target,
      actualIntake: actual,
      gap,
      adequacyPct,
      status,
      clinicalRisk: b?.benchmark.clinicalRisk || 'Nutrient imbalance detected.',
      correctiveFoods: b?.benchmark.correctiveFoods || [],
      // Backwards-compatibility aliases for types.ts NutrientGapItem
      patientIntake: actual,
      recommendedNeed: target,
      gapExcess: gap,
    };
  });

  // Build standard NutrientGapAnalysis object
  const gapAnalysis: NutrientGapAnalysis = {
    calories: {
      actual: totals.calories,
      target: benchmarkMap.calories?.target || 1850,
      gap: totals.calories - (benchmarkMap.calories?.target || 1850),
    },
    protein: {
      actual: totals.protein,
      target: benchmarkMap.protein?.target || 60,
      gap: totals.protein - (benchmarkMap.protein?.target || 60),
    },
    carbs: {
      actual: totals.carbs,
      target: benchmarkMap.carbs?.target || 220,
      gap: totals.carbs - (benchmarkMap.carbs?.target || 220),
    },
    fiber: {
      actual: totals.fiber,
      target: benchmarkMap.fiber?.target || 35,
      gap: totals.fiber - (benchmarkMap.fiber?.target || 35),
    },
    fats: {
      actual: totals.fat,
      target: benchmarkMap.fat?.target || 45,
      gap: totals.fat - (benchmarkMap.fat?.target || 45),
    },
  };

  // High-level summary metrics
  const criticalDeficitsCount = gaps.filter((g) => g.status === 'Critical Deficit').length;
  const moderateDeficitsCount = gaps.filter((g) => g.status === 'Moderate Deficit').length;
  const optimalCount = gaps.filter((g) => g.status === 'Optimal').length;
  const excessCount = gaps.filter((g) => g.status === 'Excess').length;

  const overallAdequacyPct = Math.round(
    gaps.reduce((acc, curr) => acc + curr.adequacyPct, 0) / gaps.length
  );

  const primaryLimitingNutrients = gaps
    .filter((g) => g.status === 'Critical Deficit')
    .map((g) => g.nutrient);

  const keyLimitingFactor =
    primaryLimitingNutrients.length > 0
      ? primaryLimitingNutrients.slice(0, 2).join(' & ')
      : 'Optimal Macro Balance';

  let clinicalNotes = 'Nutritional intake is closely aligned with ICMR-NIN reference targets.';
  if (criticalDeficitsCount >= 3) {
    clinicalNotes = `Significant nutritional depletion detected in ${keyLimitingFactor}. Prescribe therapeutic functional food repletion.`;
  } else if (criticalDeficitsCount > 0 || moderateDeficitsCount > 0) {
    clinicalNotes = `Subclinical shortfalls noted in ${primaryLimitingNutrients.join(', ') || 'micronutrients'}. Dietary diversification recommended.`;
  }

  // Simplified benchmarks dictionary for return
  const benchmarksReturn: Record<string, { target: number; unit: string; name: string }> = {};
  for (const [k, v] of Object.entries(benchmarkMap)) {
    benchmarksReturn[k] = { target: v.target, unit: v.unit, name: v.name };
  }

  return {
    totals,
    macroRatios,
    benchmarks: benchmarksReturn,
    gaps,
    gapAnalysis,
    summary: {
      overallAdequacyPct,
      criticalDeficitsCount,
      moderateDeficitsCount,
      optimalCount,
      excessCount,
      keyLimitingFactor,
      clinicalNotes,
    },
    mealBreakdowns,
  };
}

/**
 * Functional aliases for flexible imports
 */
export const calculateDietaryNutrients = calculateNutritionalTotalsAndGaps;
export const recalculateNutritionalGaps = calculateNutritionalTotalsAndGaps;
export const calculateDietaryTotals = calculateNutritionalTotalsAndGaps;
export const calculateRecallNutrients = calculateNutritionalTotalsAndGaps;
export const calculateMealPlanNutrients = calculateNutritionalTotalsAndGaps;
