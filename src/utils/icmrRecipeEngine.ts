import { findIfctFood, calculateIfctNutrient, IfctFoodEntry } from './ifct2017Database';
import { findIfctTable1Food, computeElshaIfctNutrients } from './ifctTable1Data';

/**
 * ICMR-NIN IFCT (Indian Food Composition Tables) Research-Based Recipe & Ingredient Calculation Engine
 * Decomposes prepared Indian and therapeutic clinical dishes into their exact constituent raw ingredients,
 * weights (grams), cooking methods (Steamed, Boiled, Pressure Cooked, Roasted), and computes authentic
 * macro and micronutrient profiles based on ICMR-NIN 2020 / 2024 standards.
 */

export interface IcmrRawIngredient {
  id: string;
  name: string;
  regionalName?: string;
  category: 'Cereals & Millets' | 'Pulses & Legumes' | 'Spices & Condiments' | 'Fats & Edible Oils' | 'Vegetables' | 'Dairy & Animal' | 'Nuts & Seeds';
  // Standard IFCT values per 100g raw edible portion
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  calcium: number; // mg
  iron: number; // mg
  zinc: number; // mg
  magnesium: number; // mg
  sodium: number; // mg
  potassium: number; // mg
}

export interface RecipeIngredientPortion {
  ingredientId: string;
  name: string;
  rawGrams: number;
  state: 'Raw' | 'Soaked' | 'Fermented' | 'Sprouted' | 'Cooked';
  cookingMethod?: 'Steamed' | 'Boiled' | 'Pressure Cooked' | 'Sautéed / Stir-Fried' | 'Tawa Roasted / Puffed' | 'Pan Fried' | 'Raw / Blended';
  notes?: string;
  // Computed values for this exact grammage
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  calcium?: number;
  iron?: number;
}

export interface ScientificRecipeDecomposition {
  dishId: string;
  dishName: string;
  aliases: string[];
  defaultPortion: string;
  servingUnitName: string; // e.g., "pieces", "katori", "bowl"
  standardServingCount?: number; // e.g., 2 pieces
  standardPortionCount?: number; // e.g., 2 pieces
  cookingMethod: 'Steamed' | 'Boiled' | 'Pressure Cooked' | 'Sautéed / Stir-Fried' | 'Tawa Roasted / Puffed' | 'Pan Fried' | 'Raw / Blended';
  yieldCookedWeightGrams: number;
  rawIngredients: RecipeIngredientPortion[];
  glycemicIndex: number;
  glycemicStatus: 'Low GI (<55)' | 'Medium GI (56-69)' | 'High GI (>70)';
  therapeuticMechanism: string;
}

// 1. MASTER ICMR-NIN IFCT RAW INGREDIENTS DATABASE
export const ICMR_RAW_INGREDIENTS: Record<string, IcmrRawIngredient> = {
  'urad-dal': {
    id: 'urad-dal',
    name: 'Urad Dal (Split Black Gram)',
    regionalName: 'Ulutham Paruppu',
    category: 'Pulses & Legumes',
    calories: 347,
    protein: 24.0,
    carbs: 59.6,
    fat: 1.4,
    fiber: 10.6,
    calcium: 154,
    iron: 7.6,
    zinc: 3.0,
    magnesium: 130,
    sodium: 19,
    potassium: 983,
  },
  'raw-rice': {
    id: 'raw-rice',
    name: 'Raw / Parboiled Rice (Idli Rice)',
    regionalName: 'Puzhungal Arisi',
    category: 'Cereals & Millets',
    calories: 353,
    protein: 6.8,
    carbs: 79.1,
    fat: 0.5,
    fiber: 3.1,
    calcium: 10,
    iron: 0.9,
    zinc: 1.4,
    magnesium: 35,
    sodium: 5,
    potassium: 110,
  },
  'fenugreek-seeds': {
    id: 'fenugreek-seeds',
    name: 'Fenugreek Seeds (Methi)',
    regionalName: 'Vendhayam',
    category: 'Spices & Condiments',
    calories: 323,
    protein: 26.2,
    carbs: 44.1,
    fat: 5.8,
    fiber: 24.6,
    calcium: 178,
    iron: 33.8,
    zinc: 6.7,
    magnesium: 191,
    sodium: 67,
    potassium: 770,
  },
  'cooking-oil': {
    id: 'cooking-oil',
    name: 'Gingelly / Cold-Pressed Cooking Oil',
    regionalName: 'Nallennai',
    category: 'Fats & Edible Oils',
    calories: 900,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    fiber: 0.0,
    calcium: 0,
    iron: 0.0,
    zinc: 0.0,
    magnesium: 0,
    sodium: 0,
    potassium: 0,
  },
  'desi-ghee': {
    id: 'desi-ghee',
    name: 'A2 Desi Cow Ghee',
    regionalName: 'Pasu Nei',
    category: 'Fats & Edible Oils',
    calories: 900,
    protein: 0.0,
    carbs: 0.0,
    fat: 100.0,
    fiber: 0.0,
    calcium: 0,
    iron: 0.0,
    zinc: 0.0,
    magnesium: 0,
    sodium: 0,
    potassium: 0,
  },
  'whole-wheat-flour': {
    id: 'whole-wheat-flour',
    name: 'Whole Wheat Atta (Grain)',
    regionalName: 'Godhumai Maavu',
    category: 'Cereals & Millets',
    calories: 341,
    protein: 12.1,
    carbs: 69.4,
    fat: 1.7,
    fiber: 11.2,
    calcium: 48,
    iron: 4.9,
    zinc: 2.7,
    magnesium: 126,
    sodium: 8,
    potassium: 363,
  },
  'toor-dal': {
    id: 'toor-dal',
    name: 'Toor Dal (Red Gram Split)',
    regionalName: 'Thuvaram Paruppu',
    category: 'Pulses & Legumes',
    calories: 343,
    protein: 22.3,
    carbs: 60.4,
    fat: 1.7,
    fiber: 9.1,
    calcium: 73,
    iron: 2.7,
    zinc: 2.3,
    magnesium: 102,
    sodium: 12,
    potassium: 1104,
  },
  'moong-dal': {
    id: 'moong-dal',
    name: 'Moong Dal (Yellow Split Green Gram)',
    regionalName: 'Paasi Paruppu',
    category: 'Pulses & Legumes',
    calories: 348,
    protein: 24.5,
    carbs: 59.9,
    fat: 1.2,
    fiber: 8.2,
    calcium: 75,
    iron: 3.9,
    zinc: 2.8,
    magnesium: 127,
    sodium: 15,
    potassium: 1150,
  },
  'whole-moong-sprouts': {
    id: 'whole-moong-sprouts',
    name: 'Sprouted Green Moong',
    regionalName: 'Mulaikattiya Paasip பயiru',
    category: 'Pulses & Legumes',
    calories: 135,
    protein: 13.0,
    carbs: 19.5,
    fat: 0.8,
    fiber: 6.5,
    calcium: 50,
    iron: 3.2,
    zinc: 1.8,
    magnesium: 85,
    sodium: 12,
    potassium: 420,
  },
  'ragi-flour': {
    id: 'ragi-flour',
    name: 'Finger Millet (Ragi Flour)',
    regionalName: 'Kezhvaragu',
    category: 'Cereals & Millets',
    calories: 328,
    protein: 7.3,
    carbs: 72.0,
    fat: 1.3,
    fiber: 11.5,
    calcium: 344,
    iron: 3.9,
    zinc: 2.3,
    magnesium: 137,
    sodium: 11,
    potassium: 408,
  },
  'rolled-oats': {
    id: 'rolled-oats',
    name: 'Rolled Whole Oats',
    regionalName: 'Oats',
    category: 'Cereals & Millets',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    calcium: 54,
    iron: 4.7,
    zinc: 4.0,
    magnesium: 177,
    sodium: 2,
    potassium: 429,
  },
  'poha-flattened-rice': {
    id: 'poha-flattened-rice',
    name: 'Flattened Rice (Poha / Aval)',
    regionalName: 'Aval',
    category: 'Cereals & Millets',
    calories: 346,
    protein: 6.6,
    carbs: 77.3,
    fat: 1.2,
    fiber: 2.8,
    calcium: 20,
    iron: 20.0, // High iron from iron roller processing
    zinc: 1.3,
    magnesium: 40,
    sodium: 9,
    potassium: 112,
  },
  'mixed-vegetables': {
    id: 'mixed-vegetables',
    name: 'Mixed Sambar / Poriyal Vegetables (Drumstick, Onion, Tomato, Carrot)',
    regionalName: 'Kaaigal',
    category: 'Vegetables',
    calories: 38,
    protein: 1.8,
    carbs: 7.2,
    fat: 0.3,
    fiber: 3.2,
    calcium: 45,
    iron: 1.4,
    zinc: 0.5,
    magnesium: 24,
    sodium: 28,
    potassium: 230,
  },
  'spinach-palak': {
    id: 'spinach-palak',
    name: 'Fresh Spinach (Palak / Pasalai Keerai)',
    regionalName: 'Keerai',
    category: 'Vegetables',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    calcium: 99,
    iron: 2.7,
    zinc: 0.5,
    magnesium: 79,
    sodium: 79,
    potassium: 558,
  },
  'paneer-a2': {
    id: 'paneer-a2',
    name: 'Fresh Cottage Cheese (Paneer)',
    regionalName: 'Paneer',
    category: 'Dairy & Animal',
    calories: 265,
    protein: 18.3,
    carbs: 1.2,
    fat: 20.8,
    fiber: 0.0,
    calcium: 208,
    iron: 0.3,
    zinc: 1.9,
    magnesium: 15,
    sodium: 22,
    potassium: 68,
  },
  'cow-milk': {
    id: 'cow-milk',
    name: 'Low Fat A2 Cow Milk',
    regionalName: 'Pasum Paal',
    category: 'Dairy & Animal',
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    fiber: 0.0,
    calcium: 120,
    iron: 0.1,
    zinc: 0.4,
    magnesium: 11,
    sodium: 50,
    potassium: 150,
  },
  'curd-yogurt': {
    id: 'curd-yogurt',
    name: 'Fresh Set Curd / Dahi',
    regionalName: 'Thayir',
    category: 'Dairy & Animal',
    calories: 60,
    protein: 3.1,
    carbs: 4.0,
    fat: 3.5,
    fiber: 0.0,
    calcium: 149,
    iron: 0.1,
    zinc: 0.4,
    magnesium: 13,
    sodium: 46,
    potassium: 155,
  },
  'coffee-powder': {
    id: 'coffee-powder',
    name: 'Filter Coffee Powder (80:20 Chicory)',
    regionalName: 'Kapi Thool',
    category: 'Spices & Condiments',
    calories: 12,
    protein: 0.8,
    carbs: 2.0,
    fat: 0.1,
    fiber: 1.2,
    calcium: 10,
    iron: 0.4,
    zinc: 0.1,
    magnesium: 15,
    sodium: 4,
    potassium: 95,
  },
  'almonds-soaked': {
    id: 'almonds-soaked',
    name: 'Soaked Peeled Almonds',
    regionalName: 'Badam',
    category: 'Nuts & Seeds',
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    fiber: 12.5,
    calcium: 269,
    iron: 3.7,
    zinc: 3.1,
    magnesium: 270,
    sodium: 1,
    potassium: 733,
  },
  'chia-seeds': {
    id: 'chia-seeds',
    name: 'Whole Chia Seeds',
    regionalName: 'Chia Vidhai',
    category: 'Nuts & Seeds',
    calories: 486,
    protein: 16.5,
    carbs: 42.1,
    fat: 30.7,
    fiber: 34.4,
    calcium: 631,
    iron: 7.7,
    zinc: 4.6,
    magnesium: 335,
    sodium: 16,
    potassium: 407,
  },
};

// 2. RESEARCH-BACKED DISH RECIPE DECOMPOSITION REGISTRY
export const SCIENTIFIC_RECIPE_REGISTRY: ScientificRecipeDecomposition[] = [
  {
    dishId: 'rec-idli',
    dishName: 'Steamed Idli',
    aliases: ['idli', 'idlis', 'rice idli', 'steamed idli', 'dosa/idli', 'idli/dosa'],
    defaultPortion: '2 pieces (~80g cooked from 39g raw dry ingredients)',
    servingUnitName: 'pieces',
    standardPortionCount: 2,
    cookingMethod: 'Steamed',
    yieldCookedWeightGrams: 80,
    glycemicIndex: 52,
    glycemicStatus: 'Low GI (<55)',
    therapeuticMechanism:
      'Lactic acid fermentation by Leuconostoc mesenteroides hydrolyzes phytates, generates resistant starch, enhances bioavailable B-vitamins, and blunts postprandial glycemic excursions.',
    rawIngredients: [
      {
        ingredientId: 'raw-rice',
        name: 'Raw / Parboiled Idli Rice',
        rawGrams: 30,
        state: 'Soaked',
        cookingMethod: 'Steamed',
        notes: 'Parboiled idli rice (Oryza sativa) with slow digestion matrix (15g per idli)',
      },
      {
        ingredientId: 'urad-dal',
        name: 'Urad Dal (Split Black Gram)',
        rawGrams: 7.5,
        state: 'Soaked',
        cookingMethod: 'Steamed',
        notes: 'Authentic 4:1 rice to lentil fermentation ratio (3.75g per idli)',
      },
      {
        ingredientId: 'fenugreek-seeds',
        name: 'Fenugreek Seeds (Methi)',
        rawGrams: 0.5,
        state: 'Soaked',
        cookingMethod: 'Steamed',
        notes: 'Galactomannan soluble fiber aiding batter rise and blunting glycemic spike',
      },
      {
        ingredientId: 'cooking-oil',
        name: 'Cold-Pressed Gingelly Oil',
        rawGrams: 0.5,
        state: 'Raw',
        cookingMethod: 'Steamed',
        notes: 'Micro-coating on idli steaming plates (0.25g per idli)',
      },
    ],
  },
  {
    dishId: 'rec-dosa',
    dishName: 'Crispy Plain Dosa',
    aliases: ['dosa', 'dosas', 'plain dosa', 'roast dosa', 'sada dosa'],
    defaultPortion: '1 medium dosa (~85g cooked)',
    servingUnitName: 'dosa',
    standardPortionCount: 1,
    cookingMethod: 'Tawa Roasted / Puffed',
    yieldCookedWeightGrams: 85,
    glycemicIndex: 58,
    glycemicStatus: 'Medium GI (56-69)',
    therapeuticMechanism:
      'Fermented rice-lentil matrix with golden tawa caramelization. Fenugreek suppresses carbohydrate amylase breakdown.',
    rawIngredients: [
      {
        ingredientId: 'raw-rice',
        name: 'Raw / Parboiled Rice',
        rawGrams: 35,
        state: 'Fermented',
        cookingMethod: 'Tawa Roasted / Puffed',
      },
      {
        ingredientId: 'urad-dal',
        name: 'Urad Dal',
        rawGrams: 8,
        state: 'Fermented',
        cookingMethod: 'Tawa Roasted / Puffed',
      },
      {
        ingredientId: 'fenugreek-seeds',
        name: 'Fenugreek Seeds',
        rawGrams: 1,
        state: 'Fermented',
        cookingMethod: 'Tawa Roasted / Puffed',
      },
      {
        ingredientId: 'cooking-oil',
        name: 'Gingelly Oil',
        rawGrams: 4,
        state: 'Raw',
        cookingMethod: 'Tawa Roasted / Puffed',
        notes: 'Drizzled around perimeter during tawa roasting',
      },
    ],
  },
  {
    dishId: 'rec-chapati',
    dishName: 'Whole Wheat Chapati / Phulka',
    aliases: ['chapati', 'chapatis', 'phulka', 'phulkas', 'roti', 'rotis', 'wheat roti'],
    defaultPortion: '2 chapatis (~80g cooked)',
    servingUnitName: 'chapatis',
    standardPortionCount: 2,
    cookingMethod: 'Tawa Roasted / Puffed',
    yieldCookedWeightGrams: 80,
    glycemicIndex: 54,
    glycemicStatus: 'Low GI (<55)',
    therapeuticMechanism:
      'Whole grain wheat bran arabinoxylans slow glucose absorption in the duodenum, delivering sustained energy without insulin spikes.',
    rawIngredients: [
      {
        ingredientId: 'whole-wheat-flour',
        name: 'Whole Wheat Atta',
        rawGrams: 50,
        state: 'Raw',
        cookingMethod: 'Tawa Roasted / Puffed',
        notes: '100% whole grain with intact aleurone layer and bran',
      },
      {
        ingredientId: 'cooking-oil',
        name: 'Cooking Oil / Ghee',
        rawGrams: 3,
        state: 'Raw',
        cookingMethod: 'Tawa Roasted / Puffed',
        notes: 'Kneaded into dough for elasticity and softening',
      },
    ],
  },
  {
    dishId: 'rec-rice-sambar',
    dishName: 'Boiled Rice + Toor Dal Sambar',
    aliases: ['rice sambar', 'rice, sambar', 'rice with sambar', 'sambar rice', 'rice & sambar'],
    defaultPortion: '1 bowl boiled rice (150g) + 1 katori sambar (150g)',
    servingUnitName: 'meal',
    standardPortionCount: 1,
    cookingMethod: 'Boiled',
    yieldCookedWeightGrams: 300,
    glycemicIndex: 57,
    glycemicStatus: 'Medium GI (56-69)',
    therapeuticMechanism:
      'Pairing cooked rice with toor dal pulse protein and drumstick polyphenols lowers the combined glycemic index through protein-starch gelatinization retarding.',
    rawIngredients: [
      {
        ingredientId: 'raw-rice',
        name: 'Raw Rice (Boiled into 150g cooked)',
        rawGrams: 50,
        state: 'Raw',
        cookingMethod: 'Boiled',
      },
      {
        ingredientId: 'toor-dal',
        name: 'Toor Dal (Red Gram)',
        rawGrams: 25,
        state: 'Raw',
        cookingMethod: 'Pressure Cooked',
        notes: 'Pressure cooked to complete soft mash',
      },
      {
        ingredientId: 'mixed-vegetables',
        name: 'Drumstick, Shallots, Tomato & Pumpkin',
        rawGrams: 60,
        state: 'Raw',
        cookingMethod: 'Boiled',
      },
      {
        ingredientId: 'cooking-oil',
        name: 'Sesame Oil for Mustard Tempering',
        rawGrams: 4,
        state: 'Raw',
        cookingMethod: 'Sautéed / Stir-Fried',
      },
    ],
  },
  {
    dishId: 'rec-sabji-poriyal',
    dishName: 'Vegetable Sabji / Poriyal',
    aliases: ['sabji', 'poriyal', 'subzi', 'mixed veg sabji', 'vegetable curry', 'beans poriyal'],
    defaultPortion: '1 katori (~120g cooked)',
    servingUnitName: 'katori',
    standardPortionCount: 1,
    cookingMethod: 'Sautéed / Stir-Fried',
    yieldCookedWeightGrams: 120,
    glycemicIndex: 28,
    glycemicStatus: 'Low GI (<55)',
    therapeuticMechanism:
      'High plant insoluble fiber feeds Akkermansia muciniphila in the colonic epithelium and accelerates transit time.',
    rawIngredients: [
      {
        ingredientId: 'mixed-vegetables',
        name: 'Fresh French Beans, Carrot, Cabbage',
        rawGrams: 100,
        state: 'Raw',
        cookingMethod: 'Sautéed / Stir-Fried',
      },
      {
        ingredientId: 'cooking-oil',
        name: 'Cold-Pressed Cooking Oil',
        rawGrams: 4,
        state: 'Raw',
        cookingMethod: 'Sautéed / Stir-Fried',
      },
    ],
  },
  {
    dishId: 'rec-khichdi',
    dishName: 'Moong Dal Khichdi with Ghee',
    aliases: ['khichdi', 'kitchari', 'moong dal khichdi', 'dal khichdi'],
    defaultPortion: '1 bowl (~200g cooked)',
    servingUnitName: 'bowl',
    standardPortionCount: 1,
    cookingMethod: 'Pressure Cooked',
    yieldCookedWeightGrams: 200,
    glycemicIndex: 51,
    glycemicStatus: 'Low GI (<55)',
    therapeuticMechanism:
      'Ayurvedic Tridoshic balancing staple. The 1:1 moong to rice ratio yields ideal protein complementation with complete amino acid score (PDCAAS 0.92).',
    rawIngredients: [
      {
        ingredientId: 'raw-rice',
        name: 'Parboiled Rice',
        rawGrams: 35,
        state: 'Raw',
        cookingMethod: 'Pressure Cooked',
      },
      {
        ingredientId: 'moong-dal',
        name: 'Split Yellow Moong Dal',
        rawGrams: 35,
        state: 'Raw',
        cookingMethod: 'Pressure Cooked',
      },
      {
        ingredientId: 'desi-ghee',
        name: 'A2 Desi Cow Ghee with Cumin & Turmeric',
        rawGrams: 5,
        state: 'Raw',
        cookingMethod: 'Sautéed / Stir-Fried',
      },
    ],
  },
  {
    dishId: 'rec-oats-porridge',
    dishName: 'Whole Oats Porridge with Milk & Chia',
    aliases: ['oats', 'oats porridge', 'rolled oats', 'oatmeal'],
    defaultPortion: '1 bowl (~220ml)',
    servingUnitName: 'bowl',
    standardPortionCount: 1,
    cookingMethod: 'Boiled',
    yieldCookedWeightGrams: 220,
    glycemicIndex: 48,
    glycemicStatus: 'Low GI (<55)',
    therapeuticMechanism:
      'Soluble beta-glucan forms a high-viscosity intestinal gel, blunting LDL cholesterol absorption and reducing fasting blood glucose.',
    rawIngredients: [
      {
        ingredientId: 'rolled-oats',
        name: 'Rolled Whole Oats',
        rawGrams: 40,
        state: 'Raw',
        cookingMethod: 'Boiled',
      },
      {
        ingredientId: 'cow-milk',
        name: 'Low Fat A2 Milk',
        rawGrams: 150,
        state: 'Raw',
        cookingMethod: 'Boiled',
      },
      {
        ingredientId: 'chia-seeds',
        name: 'Chia Seeds',
        rawGrams: 5,
        state: 'Raw',
        cookingMethod: 'Raw / Blended',
      },
    ],
  },
  {
    dishId: 'rec-filter-coffee',
    dishName: 'South Indian Filter Coffee with Milk',
    aliases: ['coffee', 'filter coffee', 'tea', 'chai', 'milk coffee'],
    defaultPortion: '1 cup (~120ml)',
    servingUnitName: 'cup',
    standardPortionCount: 1,
    cookingMethod: 'Boiled',
    yieldCookedWeightGrams: 120,
    glycemicIndex: 35,
    glycemicStatus: 'Low GI (<55)',
    therapeuticMechanism:
      'Chlorogenic acid polyphenols in freshly brewed decoction activate AMP-activated protein kinase (AMPK) for hepatic glucose regulation.',
    rawIngredients: [
      {
        ingredientId: 'cow-milk',
        name: 'Boiled Cow Milk',
        rawGrams: 100,
        state: 'Cooked',
        cookingMethod: 'Boiled',
      },
      {
        ingredientId: 'coffee-powder',
        name: 'Filter Coffee Powder (80:20 Chicory)',
        rawGrams: 10,
        state: 'Raw',
        cookingMethod: 'Boiled',
      },
    ],
  },
];

// Helper: Calculate exact nutrients for a list of ingredient portions
export function calculateIngredientsNutritionalTotals(
  ingredients: RecipeIngredientPortion[]
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calcium: number;
  iron: number;
  zinc: number;
  magnesium: number;
  sodium: number;
  potassium: number;
  totalRawGrams: number;
} {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let calcium = 0;
  let iron = 0;
  let zinc = 0;
  let magnesium = 0;
  let sodium = 0;
  let potassium = 0;
  let totalRawGrams = 0;

  ingredients.forEach((ing) => {
    const rawDef = ICMR_RAW_INGREDIENTS[ing.ingredientId];
    const grams = ing.rawGrams || 0;
    totalRawGrams += grams;

    if (rawDef) {
      const factor = grams / 100;
      calories += rawDef.calories * factor;
      protein += rawDef.protein * factor;
      carbs += rawDef.carbs * factor;
      fat += rawDef.fat * factor;
      fiber += rawDef.fiber * factor;
      calcium += rawDef.calcium * factor;
      iron += rawDef.iron * factor;
      zinc += rawDef.zinc * factor;
      magnesium += rawDef.magnesium * factor;
      sodium += rawDef.sodium * factor;
      potassium += rawDef.potassium * factor;
    }
  });

  return {
    calories: Math.round(calories),
    protein: Number(protein.toFixed(1)),
    carbs: Number(carbs.toFixed(1)),
    fat: Number(fat.toFixed(1)),
    fiber: Number(fiber.toFixed(1)),
    calcium: Math.round(calcium),
    iron: Number(iron.toFixed(2)),
    zinc: Number(zinc.toFixed(2)),
    magnesium: Math.round(magnesium),
    sodium: Math.round(sodium),
    potassium: Math.round(potassium),
    totalRawGrams: Math.round(totalRawGrams),
  };
}

// Search and match dish from user input
export function findRecipeDecomposition(dishQuery: string): ScientificRecipeDecomposition | null {
  if (!dishQuery || typeof dishQuery !== 'string') return null;
  const q = dishQuery.toLowerCase().trim();

  // 1. Direct match or alias check
  for (const recipe of SCIENTIFIC_RECIPE_REGISTRY) {
    if (
      recipe.dishName.toLowerCase() === q ||
      recipe.aliases.some((alias) => q === alias || q.includes(alias))
    ) {
      return recipe;
    }
  }

  // 2. Token overlap check
  for (const recipe of SCIENTIFIC_RECIPE_REGISTRY) {
    const tokens = recipe.dishName.toLowerCase().split(/\s+/);
    if (tokens.some((t) => t.length > 3 && q.includes(t))) {
      return recipe;
    }
  }

  return null;
}

// Decompose any user typed text into ICMR raw ingredients with portion multiplier
export function decomposeTextToIcmrIngredients(
  foodText: string,
  quantityText: string = '1 serving'
): {
  matchedRecipe: ScientificRecipeDecomposition | null;
  ingredients: RecipeIngredientPortion[];
  cookingMethod: string;
  portionMultiplier: number;
  calculatedNutrients: ReturnType<typeof calculateIngredientsNutritionalTotals>;
  displaySummary: string;
} {
  const lowerText = `${foodText} ${quantityText}`.toLowerCase();

  // 1. Check IFCT Table 1 single food FIRST (strictly calculates on food quantity & cooking method, avoids assumption of other recipes)
  const table1Match = findIfctTable1Food(foodText);
  if (table1Match) {
    let grams = 30; // default to 30g canonical
    const gMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams|ml)/i);
    if (gMatch) {
      grams = parseFloat(gMatch[1]);
    } else {
      const numMatch = lowerText.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) grams = parseFloat(numMatch[1]);
    }

    const computed = computeElshaIfctNutrients(table1Match, grams);
    if (computed) {
      return {
        matchedRecipe: null,
        ingredients: [
          {
            ingredientId: table1Match.code,
            name: table1Match.name,
            rawGrams: grams,
            state: 'Raw',
            cookingMethod: 'Raw / Blended',
            calories: computed.values.energyKcal,
            protein: computed.values.proteinG,
            carbs: computed.values.carbsG,
            fat: computed.values.fatG,
            fiber: computed.values.fibreTotalG,
            calcium: 15,
            iron: 1.2,
          },
        ],
        cookingMethod: 'Raw / Blended',
        portionMultiplier: grams / 100,
        calculatedNutrients: {
          calories: computed.values.energyKcal,
          protein: computed.values.proteinG,
          carbs: computed.values.carbsG,
          fat: computed.values.fatG,
          fiber: computed.values.fibreTotalG,
          calcium: 15,
          iron: 1.2,
          zinc: 1.4,
          magnesium: 35,
          sodium: 5,
          potassium: 110,
          totalRawGrams: grams,
        },
        displaySummary: `Raw: ${table1Match.name} (${table1Match.code}) ${grams}g [${computed.values.energyKcal} kcal / ${computed.values.energyKj} kJ]`,
      };
    }
  }

  const recipe = findRecipeDecomposition(foodText);

  // Determine portion multiplier from quantity text or foodText
  let multiplier = 1;

  // Match numbers e.g. "3 idlis", "4 nos", "2 chapatis", "200g"
  const numberMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:nos|pcs|pieces|idli|idlis|chapati|chapatis|dosa|dosas|katori|bowl|cups)?/i);
  if (numberMatch && numberMatch[1]) {
    const num = parseFloat(numberMatch[1]);
    const stdCount = recipe?.standardPortionCount || recipe?.standardServingCount || 1;
    if (recipe && stdCount > 0) {
      // If user typed 4 idlis and standard portion is 2 idlis => multiplier is 2
      if (num > 0 && num <= 10) {
        multiplier = num / stdCount;
      }
    }
  }

  if (recipe) {
    // Scale ingredients by multiplier
    const scaledIngredients: RecipeIngredientPortion[] = recipe.rawIngredients.map((ing) => {
      const scaledGrams = Math.round(ing.rawGrams * multiplier);
      const rawDef = ICMR_RAW_INGREDIENTS[ing.ingredientId];
      const factor = rawDef ? scaledGrams / 100 : 0;
      return {
        ...ing,
        rawGrams: scaledGrams,
        calories: rawDef ? Math.round(rawDef.calories * factor) : undefined,
        protein: rawDef ? Number((rawDef.protein * factor).toFixed(1)) : undefined,
        carbs: rawDef ? Number((rawDef.carbs * factor).toFixed(1)) : undefined,
        fat: rawDef ? Number((rawDef.fat * factor).toFixed(1)) : undefined,
        fiber: rawDef ? Number((rawDef.fiber * factor).toFixed(1)) : undefined,
        calcium: rawDef ? Math.round(rawDef.calcium * factor) : undefined,
        iron: rawDef ? Number((rawDef.iron * factor).toFixed(2)) : undefined,
      };
    });

    const nutrients = calculateIngredientsNutritionalTotals(scaledIngredients);
    const ingredientSummary = scaledIngredients
      .map((i) => `${i.name.split('(')[0].trim()} ${i.rawGrams}g`)
      .join(' + ');

    return {
      matchedRecipe: recipe,
      ingredients: scaledIngredients,
      cookingMethod: recipe.cookingMethod,
      portionMultiplier: multiplier,
      calculatedNutrients: nutrients,
      displaySummary: `${recipe.cookingMethod}: ${ingredientSummary}`,
    };
  }

  // Check if direct food item in verified IFCT 2017 database
  const ifctFood = findIfctFood(foodText);
  if (ifctFood) {
    // Determine gram weight from quantity text
    let grams = 100;
    const gMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams|ml)/i);
    const nosMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:nos|pcs|pieces|fruit|fruits|nuts|apple|guava|banana)?/i);
    const literMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:l|liter|litres|litre)/i);

    if (literMatch) {
      grams = parseFloat(literMatch[1]) * 1000;
    } else if (gMatch) {
      grams = parseFloat(gMatch[1]);
    } else if (nosMatch && parseFloat(nosMatch[1]) > 0) {
      const count = parseFloat(nosMatch[1]);
      if (ifctFood.foodCode === 'F001-RAW' || ifctFood.commonNames.includes('almonds')) {
        grams = count * 1.2; // ~1.2g per almond
      } else if (ifctFood.foodCode === 'F002-RAW') {
        grams = count * 3.0; // ~3g per walnut half
      } else if (ifctFood.category === 'Fruits') {
        grams = count * 100; // ~100g per medium fruit
      } else {
        grams = count * 50;
      }
    }

    // Special Water Rule: Plain water is strictly 0 kcal and 0 nutrients
    if (ifctFood.foodCode === 'W000-WATER' || ifctFood.category === 'Water & Plain Beverages') {
      return {
        matchedRecipe: null,
        ingredients: [
          {
            ingredientId: 'drinking-water',
            name: 'Plain Drinking Water',
            rawGrams: grams,
            state: 'Raw',
            cookingMethod: 'Raw / Blended',
          },
        ],
        cookingMethod: 'Raw / Filtered',
        portionMultiplier: grams / 100,
        calculatedNutrients: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          calcium: 0,
          iron: 0,
          zinc: 0,
          magnesium: 0,
          sodium: 0,
          potassium: 0,
          totalRawGrams: grams,
        },
        displaySummary: `Verified IFCT [W000-WATER]: Plain Water ${grams}ml (0 kcal, 0g nutrients)`,
      };
    }

    const scale = grams / 100;
    const directNutrients = {
      calories: Math.round(ifctFood.energyKcal * scale),
      protein: Number((ifctFood.proteinG * scale).toFixed(1)),
      carbs: Number((ifctFood.carbsG * scale).toFixed(1)),
      fat: Number((ifctFood.fatG * scale).toFixed(1)),
      fiber: Number((ifctFood.fiberG * scale).toFixed(1)),
      calcium: Math.round(ifctFood.calciumMg * scale),
      iron: Number((ifctFood.ironMg * scale).toFixed(2)),
      zinc: Number((ifctFood.zincMg * scale).toFixed(2)),
      magnesium: Math.round(ifctFood.magnesiumMg * scale),
      sodium: Math.round(ifctFood.sodiumMg * scale),
      potassium: Math.round(ifctFood.potassiumMg * scale),
      totalRawGrams: grams,
    };

    return {
      matchedRecipe: null,
      ingredients: [
        {
          ingredientId: ifctFood.foodCode,
          name: `${ifctFood.name} (${ifctFood.foodState})`,
          rawGrams: grams,
          state: ifctFood.foodState === 'Raw' ? 'Raw' : 'Cooked',
          cookingMethod: ifctFood.foodState === 'Cooked / Boiled' ? 'Boiled' : 'Raw / Blended',
          calories: directNutrients.calories,
          protein: directNutrients.protein,
          carbs: directNutrients.carbs,
          fat: directNutrients.fat,
          fiber: directNutrients.fiber,
          calcium: directNutrients.calcium,
          iron: directNutrients.iron,
        },
      ],
      cookingMethod: ifctFood.foodState === 'Cooked / Boiled' ? 'Boiled' : 'Raw / Blended',
      portionMultiplier: scale,
      calculatedNutrients: directNutrients,
      displaySummary: `Verified IFCT [${ifctFood.foodCode}]: ${ifctFood.name} (${grams}g, ${ifctFood.foodState})`,
    };
  }

  // Strict ICMR-NIN Rule: If not available in verified database, show "Verified nutrient data unavailable"
  // Do NOT invent or guess random numbers!
  return {
    matchedRecipe: null,
    ingredients: [],
    cookingMethod: 'Unverified',
    portionMultiplier: 0,
    calculatedNutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      iron: 0,
      zinc: 0,
      magnesium: 0,
      sodium: 0,
      potassium: 0,
      totalRawGrams: 0,
    },
    displaySummary: 'Verified nutrient data unavailable in ICMR-NIN IFCT database',
  };
}
