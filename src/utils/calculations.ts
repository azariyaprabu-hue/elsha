import { ActivityLevel, Calculations, Sex } from '../types';

export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
} {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Normal' };
  }
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' = 'Normal';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi <= 24.9) {
    category = 'Normal';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return { bmi, category };
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: Sex
): number {
  if (!weightKg || !heightCm || !ageYears) return 0;
  // Mifflin-St Jeor Equation
  if (sex === 'Male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161);
  }
}

export function getActivityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case 'sedentary':
      return 1.2; // Little or no exercise, desk job
    case 'lightly_active':
      return 1.375; // Light exercise 1-3 days/week
    case 'moderately_active':
      return 1.55; // Moderate exercise 3-5 days/week
    case 'very_active':
      return 1.725; // Hard exercise 6-7 days/week
    case 'extra_active':
      return 1.9; // Very hard exercise & physical job
    default:
      return 1.55;
  }
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = getActivityMultiplier(activityLevel);
  return Math.round(bmr * multiplier);
}

export function getCompleteCalculations(
  weight: number | string,
  height: number | string,
  age: number | string,
  sex: Sex,
  activityLevel: ActivityLevel
): Calculations {
  const w = typeof weight === 'string' ? parseFloat(weight) || 0 : weight;
  const h = typeof height === 'string' ? parseFloat(height) || 0 : height;
  const a = typeof age === 'string' ? parseFloat(age) || 0 : age;

  const { bmi, category } = calculateBMI(w, h);
  const bmr = calculateBMR(w, h, a, sex);
  const tdee = calculateTDEE(bmr, activityLevel);

  return {
    bmi,
    bmiCategory: category,
    bmr,
    tdee,
  };
}

/**
 * Calculates Gut Health Score out of 100 based on the 26 questions
 */
export function calculateGutHealthScore(
  responses: Record<string, string>
): { score: number; rating: 'Excellent' | 'Good' | 'Moderate Dysbiosis' | 'High Gastrointestinal Risk'; notes: string } {
  let score = 85; // baseline healthy score

  // Negative symptoms check
  const negativeKeys = [
    'bloating',
    'gas',
    'burping',
    'abdominal_pain',
    'constipation',
    'loose_stools',
    'straining',
    'acidity',
    'urgency',
    'foul_smell',
    'excessive_fullness',
  ];

  negativeKeys.forEach((k) => {
    const val = responses[k];
    if (val === 'Often') score -= 5;
    else if (val === 'Sometimes') score -= 2;
  });

  // Bowel change
  if (responses['bowel_change'] === 'Significant') score -= 8;
  else if (responses['bowel_change'] === 'Mild') score -= 3;

  // Stool consistency
  if (responses['consistency'] === 'Hard' || responses['consistency'] === 'Loose') {
    score -= 4;
  }

  // Relief
  if (responses['complete_relief'] === 'Never') score -= 8;
  else if (responses['complete_relief'] === 'Sometimes') score -= 3;
  else if (responses['complete_relief'] === 'Always') score += 5;

  // Probiotic intake
  if (responses['probiotic_foods'] === 'Daily') score += 6;
  else if (responses['probiotic_foods'] === 'Rarely') score -= 4;

  // Fibre intake
  if (responses['fibre_foods'] === 'Daily') score += 6;
  else if (responses['fibre_foods'] === 'Rarely') score -= 5;

  // Red flags
  if (responses['blood_in_stool'] === 'Yes') score -= 20;
  if (responses['unexplained_weight_loss'] === 'Yes') score -= 12;
  if (responses['symptoms_over_4_weeks'] === 'Yes') score -= 7;
  if (responses['recent_antibiotics'] && responses['recent_antibiotics'].trim().length > 1) {
    score -= 5;
  }

  // Bound between 15 and 98
  score = Math.max(15, Math.min(98, score));

  let rating: 'Excellent' | 'Good' | 'Moderate Dysbiosis' | 'High Gastrointestinal Risk' = 'Good';
  let notes = 'Bowel motility and digestive biome function are well regulated.';

  if (score >= 82) {
    rating = 'Excellent';
    notes = 'Robust microbial diversity, healthy mucosal barrier, and optimal digestive transit.';
  } else if (score >= 70) {
    rating = 'Good';
    notes = 'Favorable digestive health with mild post-prandial sensitivity. Probiotic optimization advised.';
  } else if (score >= 50) {
    rating = 'Moderate Dysbiosis';
    notes = 'Indicators of intestinal fermentation, sluggish motility, or dietary trigger sensitivity present.';
  } else {
    rating = 'High Gastrointestinal Risk';
    notes = 'Clinical alert: persistent GI complaints noted. Review with medical gastroenterologist recommended.';
  }

  return { score, rating, notes };
}

export * from './icmrCalculator';
export * from './nutritionalConstants';
export * from './nutritionalCalculator';
