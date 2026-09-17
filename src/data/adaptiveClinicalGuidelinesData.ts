export interface DynamicIngredientItem {
  id: string;
  name: string;
  category:
    | 'Cereals & Millets'
    | 'Pulses & Legumes'
    | 'Vegetables & Gourds'
    | 'Green Leafy Vegetables'
    | 'Fruits'
    | 'Nuts & Oilseeds'
    | 'Dairy & Fermented Foods'
    | 'Healthy Fats & Cold-Pressed Oils'
    | 'Spices & Functional Condiments'
    | 'Plant Milks & Beverages';
  glycemicIndex: 'Low' | 'Medium' | 'High' | 'Zero';
  status: 'Recommended' | 'Caution' | 'Restricted';
  portion: string;
  therapeuticMechanism: string;
  clinicalRationale: string;
  contraindications: string;
  biomarkerTarget?: string;
}

export interface DynamicAyurSiddhaHerb {
  id: string;
  name: string;
  traditionalName: string;
  botanicalName: string;
  doshaEffect: string;
  therapeuticAction: string;
  clinicalIndications: string[];
  recommendedDose: string;
  timing: string;
  preparationMethod: string;
  contraindications: string;
  biomarkerTarget?: string;
}

export interface DynamicTherapeuticRecipe {
  id: string;
  name: string;
  category: 'Therapeutic Breakfast' | 'Nutrient-Dense Lunch' | 'Restorative Dinner' | 'Recovery Snack';
  mealSlot: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks & Beverages';
  preparationTimeMinutes: number;
  cookingTimeMinutes: number;
  glycemicIndex: 'Low' | 'Medium' | 'Zero';
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  clinicalIndications: string[];
  biomarkerTargets: string[];
  ingredients: { item: string; portion: string }[];
  preparationSteps: string[];
  clinicalRationale: string;
}

export interface DiseaseDomainClinicalProfile {
  domainKey: string;
  displayName: string;
  pathologyTagline: string;
  primaryBiomarkers: string[];
  macroDistribution: { carbs: number; protein: number; fat: number };
  ayurvedicDoshaFocus: string;
  ingredients: DynamicIngredientItem[];
  ayurSiddhaHerbs: DynamicAyurSiddhaHerb[];
  recipes: {
    breakfast: DynamicTherapeuticRecipe[];
    lunch: DynamicTherapeuticRecipe[];
    dinner: DynamicTherapeuticRecipe[];
    snacks: DynamicTherapeuticRecipe[];
  };
}
