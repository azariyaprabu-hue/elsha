import {
  ClinicalRecipe,
  DietDayPlan,
  GeneralInfo,
  IcmrIngredient,
  IcmrRdaBenchmark,
  MealPlanItem,
  NutrientBreakdown,
  RecipeIngredientItem,
} from '../types';

/**
 * ICMR-NIN (National Institute of Nutrition, Indian Council of Medical Research)
 * Indian Food Composition Tables (IFCT) Database
 * Nutrient Breakdown per 100g edible portion
 */
export const ICMR_INGREDIENTS_DATABASE: IcmrIngredient[] = [
  // --- MILLETS & CEREALS ---
  {
    id: 'ing-foxtail-millet',
    name: 'Foxtail Millet',
    regionalName: 'Thinai / Kangni',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Low GI (54), rich in thiamine, magnesium, and resistant starch',
    per100g: {
      calories: 331,
      carbs: 60.9,
      protein: 12.3,
      fat: 4.3,
      fiber: 8.0,
      calcium: 31,
      iron: 2.8,
      zinc: 2.4,
      magnesium: 81,
      sodium: 4.6,
      potassium: 250,
      vitaminA: 32,
      vitaminC: 0,
      vitaminD: 0,
      folate: 15,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-finger-millet',
    name: 'Finger Millet (Ragi)',
    regionalName: 'Ragi / Kezhvaragu',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Highest calcium of all cereals (344 mg/100g), high polyphenols',
    per100g: {
      calories: 328,
      carbs: 72.0,
      protein: 7.3,
      fat: 1.3,
      fiber: 11.5,
      calcium: 344,
      iron: 3.9,
      zinc: 2.3,
      magnesium: 137,
      sodium: 11.0,
      potassium: 408,
      vitaminA: 42,
      vitaminC: 0,
      vitaminD: 0,
      folate: 18.3,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-barnyard-millet',
    name: 'Barnyard Millet',
    regionalName: 'Kuthiraivali / Sanwa',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Exceptionally high dietary fiber (13.6g) and bioavailable iron',
    per100g: {
      calories: 307,
      carbs: 65.5,
      protein: 6.2,
      fat: 2.2,
      fiber: 13.6,
      calcium: 22,
      iron: 5.0,
      zinc: 3.0,
      magnesium: 82,
      sodium: 5.0,
      potassium: 290,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 12,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-kodo-millet',
    name: 'Kodo Millet',
    regionalName: 'Varagu / Kodra',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'High antioxidant polyphenols, suppresses post-prandial hyperglycemia',
    per100g: {
      calories: 309,
      carbs: 65.9,
      protein: 8.3,
      fat: 1.4,
      fiber: 9.0,
      calcium: 27,
      iron: 1.7,
      zinc: 1.6,
      magnesium: 110,
      sodium: 4.2,
      potassium: 144,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 23,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-little-millet',
    name: 'Little Millet',
    regionalName: 'Samai / Kutki',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Fast-digesting soluble fiber, promotes gut Short Chain Fatty Acids (SCFAs)',
    per100g: {
      calories: 329,
      carbs: 67.0,
      protein: 7.7,
      fat: 4.7,
      fiber: 7.6,
      calcium: 17,
      iron: 9.3,
      zinc: 1.8,
      magnesium: 91,
      sodium: 8.0,
      potassium: 129,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 9,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-jowar-sorghum',
    name: 'Jowar (Sorghum)',
    regionalName: 'Cholam / Jowar',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Gluten-free, high resistant starch and 3-deoxyanthoxyanins',
    per100g: {
      calories: 349,
      carbs: 72.6,
      protein: 10.4,
      fat: 1.9,
      fiber: 10.2,
      calcium: 25,
      iron: 4.1,
      zinc: 1.7,
      magnesium: 133,
      sodium: 7.0,
      potassium: 363,
      vitaminA: 20,
      vitaminC: 0,
      vitaminD: 0,
      folate: 20,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-pearl-millet',
    name: 'Pearl Millet (Bajra)',
    regionalName: 'Kambu / Bajra',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Medium',
    clinicalHighlight: 'Dense in iron (8.0 mg) and zinc (3.1 mg), aids diabetic insulin sensitivity',
    per100g: {
      calories: 361,
      carbs: 67.5,
      protein: 11.6,
      fat: 5.0,
      fiber: 11.3,
      calcium: 42,
      iron: 8.0,
      zinc: 3.1,
      magnesium: 137,
      sodium: 10.9,
      potassium: 390,
      vitaminA: 132,
      vitaminC: 0,
      vitaminD: 0,
      folate: 45,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-whole-wheat-flour',
    name: 'Whole Wheat Flour (Atta)',
    regionalName: 'Godhumai Maavu',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Medium',
    clinicalHighlight: 'Traditional staple, high insoluble fiber and manganese',
    per100g: {
      calories: 320,
      carbs: 64.2,
      protein: 10.6,
      fat: 1.7,
      fiber: 11.2,
      calcium: 34,
      iron: 3.9,
      zinc: 2.2,
      magnesium: 125,
      sodium: 5.0,
      potassium: 363,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 36.6,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-rolled-oats',
    name: 'Rolled Oats',
    regionalName: 'Oats',
    category: 'Millets & Cereals',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'High beta-glucan soluble fiber that binds bile acids and blunts glucose spikes',
    per100g: {
      calories: 374,
      carbs: 60.0,
      protein: 13.6,
      fat: 6.9,
      fiber: 10.6,
      calcium: 52,
      iron: 4.7,
      zinc: 3.9,
      magnesium: 177,
      sodium: 4.0,
      potassium: 429,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 56,
      vitaminB12: 0,
    },
  },

  // --- PULSES & LEGUMES ---
  {
    id: 'ing-sprouted-moong',
    name: 'Sprouted Green Gram (Moong)',
    regionalName: 'Mulaikattiya Pasi Payiru',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Sprouting triples vitamin C, activates bio-enzymes, GI < 25',
    per100g: {
      calories: 126,
      carbs: 18.2,
      protein: 12.8,
      fat: 0.8,
      fiber: 7.2,
      calcium: 68,
      iron: 3.8,
      zinc: 1.9,
      magnesium: 84,
      sodium: 14.0,
      potassium: 420,
      vitaminA: 85,
      vitaminC: 22.0,
      vitaminD: 0,
      folate: 110,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-yellow-moong-dal',
    name: 'Yellow Moong Dal (Split)',
    regionalName: 'Pasi Paruppu',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Easiest pulse on gut microbiome transit, zero oligosaccharide bloating',
    per100g: {
      calories: 334,
      carbs: 56.8,
      protein: 24.0,
      fat: 1.3,
      fiber: 8.2,
      calcium: 75,
      iron: 3.9,
      zinc: 2.8,
      magnesium: 127,
      sodium: 28.0,
      potassium: 843,
      vitaminA: 40,
      vitaminC: 0,
      vitaminD: 0,
      folate: 140,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-toor-dal',
    name: 'Toor Dal (Pigeon Pea)',
    regionalName: 'Thuvaram Paruppu',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Traditional sambar base, excellent potassium-to-sodium ratio (30:1)',
    per100g: {
      calories: 335,
      carbs: 57.6,
      protein: 22.3,
      fat: 1.7,
      fiber: 9.1,
      calcium: 73,
      iron: 2.7,
      zinc: 2.1,
      magnesium: 104,
      sodium: 26.0,
      potassium: 1104,
      vitaminA: 44,
      vitaminC: 0,
      vitaminD: 0,
      folate: 103,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-chana-dal',
    name: 'Bengal Gram (Chana Dal)',
    regionalName: 'Kadalai Paruppu',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Ultra-low GI (8-12), high amylose starch blunts glucose peaks',
    per100g: {
      calories: 372,
      carbs: 59.8,
      protein: 20.8,
      fat: 5.6,
      fiber: 15.3,
      calcium: 56,
      iron: 5.3,
      zinc: 2.9,
      magnesium: 130,
      sodium: 38.0,
      potassium: 797,
      vitaminA: 62,
      vitaminC: 1.0,
      vitaminD: 0,
      folate: 148,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-horse-gram',
    name: 'Horse Gram',
    regionalName: 'Kollu / Kulthi',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Clinically proven alpha-amylase and glucosidase inhibitory properties',
    per100g: {
      calories: 321,
      carbs: 57.2,
      protein: 22.0,
      fat: 0.5,
      fiber: 12.0,
      calcium: 287,
      iron: 6.8,
      zinc: 2.3,
      magnesium: 142,
      sodium: 11.5,
      potassium: 780,
      vitaminA: 71,
      vitaminC: 0,
      vitaminD: 0,
      folate: 95,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-rajma',
    name: 'Rajma (Kidney Beans)',
    regionalName: 'Sivappu Karamani / Rajma',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'High soluble fermentable fiber, lowers circulating LDL-C and fasting insulin',
    per100g: {
      calories: 333,
      carbs: 60.0,
      protein: 24.0,
      fat: 1.2,
      fiber: 15.2,
      calcium: 143,
      iron: 5.1,
      zinc: 2.8,
      magnesium: 140,
      sodium: 12.0,
      potassium: 1359,
      vitaminA: 0,
      vitaminC: 4.5,
      vitaminD: 0,
      folate: 394,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-black-gram',
    name: 'Black Gram (Urad Dal)',
    regionalName: 'Ulundhu',
    category: 'Pulses & Legumes',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Rich in mucilage polysaccharides that lubricate digestive tract and slow glucose uptake',
    per100g: {
      calories: 341,
      carbs: 58.9,
      protein: 24.0,
      fat: 1.4,
      fiber: 18.3,
      calcium: 154,
      iron: 7.5,
      zinc: 3.5,
      magnesium: 130,
      sodium: 38.0,
      potassium: 983,
      vitaminA: 23,
      vitaminC: 0,
      vitaminD: 0,
      folate: 144,
      vitaminB12: 0,
    },
  },

  // --- VEGETABLES & KEERAI (GREENS) ---
  {
    id: 'ing-drumstick-leaves',
    name: 'Drumstick Leaves (Moringa)',
    regionalName: 'Murungai Keerai',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Superfood: 440 mg Calcium, 7 mg Iron, quercetin & chlorogenic acid',
    per100g: {
      calories: 92,
      carbs: 8.3,
      protein: 6.7,
      fat: 1.7,
      fiber: 6.8,
      calcium: 440,
      iron: 7.0,
      zinc: 0.6,
      magnesium: 42,
      sodium: 9.0,
      potassium: 337,
      vitaminA: 6780,
      vitaminC: 220.0,
      vitaminD: 0,
      folate: 40,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-palak-spinach',
    name: 'Spinach (Palak)',
    regionalName: 'Pasalai Keerai / Palak',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Lutein, zeaxanthin, potassium and nitrates supporting vascular elasticity',
    per100g: {
      calories: 23,
      carbs: 2.9,
      protein: 2.9,
      fat: 0.4,
      fiber: 2.2,
      calcium: 99,
      iron: 2.7,
      zinc: 0.5,
      magnesium: 79,
      sodium: 79.0,
      potassium: 558,
      vitaminA: 4690,
      vitaminC: 28.1,
      vitaminD: 0,
      folate: 194,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-methi-leaves',
    name: 'Fenugreek Leaves (Methi)',
    regionalName: 'Vendhaya Keerai',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Contains 4-hydroxyisoleucine which stimulates glucose-dependent insulin secretion',
    per100g: {
      calories: 49,
      carbs: 6.0,
      protein: 4.4,
      fat: 0.9,
      fiber: 4.9,
      calcium: 395,
      iron: 1.9,
      zinc: 0.7,
      magnesium: 59,
      sodium: 76.0,
      potassium: 510,
      vitaminA: 1900,
      vitaminC: 52.0,
      vitaminD: 0,
      folate: 84,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-bitter-gourd',
    name: 'Bitter Gourd (Karela)',
    regionalName: 'Paavakkai / Karela',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Potent Charantin, Vicine, and Polypeptide-p acting as plant insulin',
    per100g: {
      calories: 17,
      carbs: 3.7,
      protein: 1.0,
      fat: 0.2,
      fiber: 2.8,
      calcium: 19,
      iron: 0.4,
      zinc: 0.8,
      magnesium: 17,
      sodium: 5.0,
      potassium: 296,
      vitaminA: 471,
      vitaminC: 84.0,
      vitaminD: 0,
      folate: 72,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-bhindi-okra',
    name: 'Okra (Bhindi / Ladies Finger)',
    regionalName: 'Vendaikkai',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'High soluble mucilage coats intestinal villi, dampens carbohydrate absorption',
    per100g: {
      calories: 33,
      carbs: 7.5,
      protein: 1.9,
      fat: 0.2,
      fiber: 3.2,
      calcium: 82,
      iron: 0.6,
      zinc: 0.6,
      magnesium: 57,
      sodium: 7.0,
      potassium: 299,
      vitaminA: 716,
      vitaminC: 23.0,
      vitaminD: 0,
      folate: 60,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-cucumber',
    name: 'Cucumber (Skin on)',
    regionalName: 'Vellarikkai / Kheera',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: '96% structured water, sterols assist in lowering blood pressure and cholesterol',
    per100g: {
      calories: 15,
      carbs: 3.6,
      protein: 0.7,
      fat: 0.1,
      fiber: 1.0,
      calcium: 16,
      iron: 0.3,
      zinc: 0.2,
      magnesium: 13,
      sodium: 2.0,
      potassium: 147,
      vitaminA: 105,
      vitaminC: 2.8,
      vitaminD: 0,
      folate: 7,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-tomato',
    name: 'Ripe Tomatoes',
    regionalName: 'Thakkali',
    category: 'Vegetables & Keerai',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Rich in lycopene antioxidant and potassium, lowers vascular inflammatory markers',
    per100g: {
      calories: 18,
      carbs: 3.9,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.2,
      calcium: 10,
      iron: 0.3,
      zinc: 0.2,
      magnesium: 11,
      sodium: 5.0,
      potassium: 237,
      vitaminA: 833,
      vitaminC: 13.7,
      vitaminD: 0,
      folate: 15,
      vitaminB12: 0,
    },
  },

  // --- DAIRY & PLANT PROTEIN ---
  {
    id: 'ing-paneer-low-fat',
    name: 'Low-Fat Cottage Cheese (Paneer)',
    regionalName: 'Pasumpal Paneer',
    category: 'Dairy & Plant Protein',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'High biological value casein protein, 480 mg Calcium, sustains satiety',
    per100g: {
      calories: 215,
      carbs: 3.4,
      protein: 18.3,
      fat: 14.5,
      fiber: 0.0,
      calcium: 480,
      iron: 0.2,
      zinc: 2.6,
      magnesium: 25,
      sodium: 22.0,
      potassium: 95,
      vitaminA: 260,
      vitaminC: 0,
      vitaminD: 0.3,
      folate: 18,
      vitaminB12: 0.9,
    },
  },
  {
    id: 'ing-tofu-firm',
    name: 'Firm Tofu (Soy Paneer)',
    regionalName: 'Soya Paneer (Tofu)',
    category: 'Dairy & Plant Protein',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Isoflavones (daidzein, genistein), zero cholesterol, high calcium',
    per100g: {
      calories: 76,
      carbs: 1.9,
      protein: 8.2,
      fat: 4.8,
      fiber: 1.2,
      calcium: 350,
      iron: 5.4,
      zinc: 0.8,
      magnesium: 30,
      sodium: 7.0,
      potassium: 121,
      vitaminA: 85,
      vitaminC: 0.1,
      vitaminD: 0,
      folate: 19,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-skimmed-curd',
    name: 'Skimmed Probiotic Curd / Yogurt',
    regionalName: 'Aadai Neekkiya Thayir',
    category: 'Dairy & Plant Protein',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Active Lactobacillus bulgaricus cultures, enhances gut tight junction barrier',
    per100g: {
      calories: 56,
      carbs: 4.7,
      protein: 3.8,
      fat: 1.5,
      fiber: 0.0,
      calcium: 149,
      iron: 0.1,
      zinc: 0.6,
      magnesium: 15,
      sodium: 52.0,
      potassium: 180,
      vitaminA: 35,
      vitaminC: 1.0,
      vitaminD: 0.1,
      folate: 12,
      vitaminB12: 0.6,
    },
  },
  {
    id: 'ing-egg-white',
    name: 'Boiled Egg White',
    regionalName: 'Muttayin Venkaru',
    category: 'Dairy & Plant Protein',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Pure ovalbumin protein, Net Protein Utilization (NPU) = 94, zero fat/cholesterol',
    per100g: {
      calories: 52,
      carbs: 0.7,
      protein: 10.9,
      fat: 0.2,
      fiber: 0.0,
      calcium: 7,
      iron: 0.1,
      zinc: 0.1,
      magnesium: 11,
      sodium: 166.0,
      potassium: 163,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 4,
      vitaminB12: 0.1,
    },
  },

  // --- NUTS & OILSEEDS ---
  {
    id: 'ing-almonds',
    name: 'Soaked Raw Almonds',
    regionalName: 'Badam',
    category: 'Nuts & Oilseeds',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Dense in Vitamin E (alpha-tocopherol), magnesium (268 mg), and healthy MUFA',
    per100g: {
      calories: 579,
      carbs: 21.6,
      protein: 21.2,
      fat: 49.9,
      fiber: 12.5,
      calcium: 264,
      iron: 3.7,
      zinc: 3.1,
      magnesium: 268,
      sodium: 1.0,
      potassium: 705,
      vitaminA: 2,
      vitaminC: 0,
      vitaminD: 0,
      folate: 44,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-walnuts',
    name: 'Walnut Halves',
    regionalName: 'Akhrot',
    category: 'Nuts & Oilseeds',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Supreme source of plant Alpha-Linolenic Acid (ALA Omega-3: 9.1g/100g)',
    per100g: {
      calories: 654,
      carbs: 13.7,
      protein: 15.2,
      fat: 65.2,
      fiber: 6.7,
      calcium: 98,
      iron: 2.9,
      zinc: 3.1,
      magnesium: 158,
      sodium: 2.0,
      potassium: 441,
      vitaminA: 41,
      vitaminC: 1.3,
      vitaminD: 0,
      folate: 98,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-flax-seeds',
    name: 'Roasted Flax Seeds',
    regionalName: 'Aali Vidhai / Alsi',
    category: 'Nuts & Oilseeds',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Secoisolariciresinol diglucoside (SDG lignans), mucilage and ALA Omega-3',
    per100g: {
      calories: 534,
      carbs: 28.9,
      protein: 18.3,
      fat: 42.2,
      fiber: 27.3,
      calcium: 255,
      iron: 5.7,
      zinc: 4.3,
      magnesium: 392,
      sodium: 30.0,
      potassium: 813,
      vitaminA: 0,
      vitaminC: 0.6,
      vitaminD: 0,
      folate: 87,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-pumpkin-seeds',
    name: 'Roasted Pumpkin Seeds',
    regionalName: 'Poosanikai Vidhai',
    category: 'Nuts & Oilseeds',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Champion source of Zinc (7.8 mg) and Magnesium (592 mg), critical for insulin synthesis',
    per100g: {
      calories: 559,
      carbs: 10.7,
      protein: 30.2,
      fat: 49.1,
      fiber: 6.0,
      calcium: 46,
      iron: 8.8,
      zinc: 7.8,
      magnesium: 592,
      sodium: 7.0,
      potassium: 809,
      vitaminA: 16,
      vitaminC: 1.9,
      vitaminD: 0,
      folate: 58,
      vitaminB12: 0,
    },
  },

  // --- FRUITS ---
  {
    id: 'ing-guava',
    name: 'Fresh Guava (with skin)',
    regionalName: 'Koyya Pazham',
    category: 'Fruits',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'High pectin fiber, 228 mg Vitamin C, Low Glycemic Load (GL = 2)',
    per100g: {
      calories: 68,
      carbs: 14.3,
      protein: 2.6,
      fat: 0.9,
      fiber: 5.4,
      calcium: 18,
      iron: 0.3,
      zinc: 0.2,
      magnesium: 22,
      sodium: 2.0,
      potassium: 417,
      vitaminA: 624,
      vitaminC: 228.3,
      vitaminD: 0,
      folate: 49,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-papaya',
    name: 'Ripe Papaya',
    regionalName: 'Pappali Pazham',
    category: 'Fruits',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Medium',
    clinicalHighlight: 'Papain proteolytic enzyme assisting protein digestion and gut peristalsis',
    per100g: {
      calories: 43,
      carbs: 10.8,
      protein: 0.5,
      fat: 0.3,
      fiber: 1.7,
      calcium: 20,
      iron: 0.1,
      zinc: 0.1,
      magnesium: 21,
      sodium: 8.0,
      potassium: 182,
      vitaminA: 950,
      vitaminC: 60.9,
      vitaminD: 0,
      folate: 37,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-amla',
    name: 'Indian Gooseberry (Amla)',
    regionalName: 'Nellikai',
    category: 'Fruits',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'World highest natural ascorbic acid (600 mg/100g), regenerates pancreatic beta cells',
    per100g: {
      calories: 44,
      carbs: 10.2,
      protein: 0.9,
      fat: 0.6,
      fiber: 4.3,
      calcium: 25,
      iron: 1.2,
      zinc: 0.2,
      magnesium: 10,
      sodium: 1.0,
      potassium: 198,
      vitaminA: 290,
      vitaminC: 600.0,
      vitaminD: 0,
      folate: 10,
      vitaminB12: 0,
    },
  },

  // --- OILS & HEALTHY FATS ---
  {
    id: 'ing-gingelly-oil',
    name: 'Cold-Pressed Sesame (Gingelly) Oil',
    regionalName: 'Marachekku Nallennai',
    category: 'Oils & Healthy Fats',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Sesamin and sesamol lignans with synergic antihypertensive activity',
    per100g: {
      calories: 884,
      carbs: 0.0,
      protein: 0.0,
      fat: 100.0,
      fiber: 0.0,
      calcium: 0,
      iron: 0.1,
      zinc: 0.1,
      magnesium: 0,
      sodium: 0.0,
      potassium: 0,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      folate: 0,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-cow-ghee',
    name: 'A2 Cow Ghee (Pure Clarified Butter)',
    regionalName: 'Pasu Nei',
    category: 'Oils & Healthy Fats',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Rich in butyric acid feeding colonocytes and lipophilic fat-soluble vitamins (A, D, E, K)',
    per100g: {
      calories: 900,
      carbs: 0.0,
      protein: 0.0,
      fat: 99.5,
      fiber: 0.0,
      calcium: 5,
      iron: 0.0,
      zinc: 0.0,
      magnesium: 0,
      sodium: 2.0,
      potassium: 5,
      vitaminA: 650,
      vitaminC: 0,
      vitaminD: 1.2,
      folate: 0,
      vitaminB12: 0.2,
    },
  },

  // --- FUNCTIONAL & SPICES ---
  {
    id: 'ing-fenugreek-seeds',
    name: 'Fenugreek Seeds (Methi)',
    regionalName: 'Vendhayam',
    category: 'Functional & Spices',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Galactomannan soluble fiber (45%) delays gastric emptying and glucose absorption',
    per100g: {
      calories: 323,
      carbs: 58.3,
      protein: 23.0,
      fat: 6.4,
      fiber: 24.6,
      calcium: 176,
      iron: 33.5,
      zinc: 2.5,
      magnesium: 191,
      sodium: 67.0,
      potassium: 770,
      vitaminA: 60,
      vitaminC: 3.0,
      vitaminD: 0,
      folate: 57,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-turmeric',
    name: 'Organic Turmeric Powder (Curcumin)',
    regionalName: 'Manjal Thool',
    category: 'Functional & Spices',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Potent NF-kB inflammatory suppressor and insulin sensitizer',
    per100g: {
      calories: 354,
      carbs: 65.0,
      protein: 7.8,
      fat: 9.9,
      fiber: 21.1,
      calcium: 182,
      iron: 41.4,
      zinc: 4.3,
      magnesium: 193,
      sodium: 38.0,
      potassium: 2525,
      vitaminA: 0,
      vitaminC: 25.9,
      vitaminD: 0,
      folate: 39,
      vitaminB12: 0,
    },
  },
  {
    id: 'ing-cinnamon',
    name: 'Ceylon Cinnamon Powder',
    regionalName: 'Kurundhu Pattai',
    category: 'Functional & Spices',
    defaultUnit: 'g',
    gramsPerUnit: 1,
    glycemicIndex: 'Low',
    clinicalHighlight: 'Cinnamaldehyde mimics insulin and enhances cellular GLUT4 translocation',
    per100g: {
      calories: 247,
      carbs: 80.6,
      protein: 4.0,
      fat: 1.2,
      fiber: 53.1,
      calcium: 1002,
      iron: 8.3,
      zinc: 1.8,
      magnesium: 60,
      sodium: 10.0,
      potassium: 431,
      vitaminA: 295,
      vitaminC: 3.8,
      vitaminD: 0,
      folate: 6,
      vitaminB12: 0,
    },
  },
];

/**
 * Standard Clinical Recipes mapped to constituent ICMR ingredients
 */
export const STANDARD_CLINICAL_RECIPES: {
  id: string;
  name: string;
  servings: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  clinicalNotes: string;
  ingredients: { ingredientId: string; quantity: number; unit: string }[];
}[] = [
  {
    id: 'rec-foxtail-idli-sambar',
    name: 'Steamed Foxtail Millet Idli (3) + Drumstick Leaf Sambar',
    servings: 1,
    glycemicIndex: 'Low',
    clinicalNotes: 'Low glycemic load morning staple with 10g prebiotic fiber and bioavailable calcium.',
    ingredients: [
      { ingredientId: 'ing-foxtail-millet', quantity: 60, unit: 'g' },
      { ingredientId: 'ing-black-gram', quantity: 20, unit: 'g' },
      { ingredientId: 'ing-toor-dal', quantity: 25, unit: 'g' },
      { ingredientId: 'ing-drumstick-leaves', quantity: 50, unit: 'g' },
      { ingredientId: 'ing-tomato', quantity: 30, unit: 'g' },
      { ingredientId: 'ing-gingelly-oil', quantity: 4, unit: 'g' },
    ],
  },
  {
    id: 'rec-methi-nuts-detox',
    name: 'Methi Infusion + Soaked Almonds & Walnuts',
    servings: 1,
    glycemicIndex: 'Low',
    clinicalNotes: 'Triggers early morning insulin receptor priming via galactomannan and alpha-linolenic acid.',
    ingredients: [
      { ingredientId: 'ing-fenugreek-seeds', quantity: 5, unit: 'g' },
      { ingredientId: 'ing-almonds', quantity: 10, unit: 'g' },
      { ingredientId: 'ing-walnuts', quantity: 8, unit: 'g' },
    ],
  },
  {
    id: 'rec-sprouted-moong-sundal',
    name: 'Sprouted Green Gram Sundal with Lemon',
    servings: 1,
    glycemicIndex: 'Low',
    clinicalNotes: 'Sprouted legume protein rich in sulforaphane, folate, and sustained fullness.',
    ingredients: [
      { ingredientId: 'ing-sprouted-moong', quantity: 80, unit: 'g' },
      { ingredientId: 'ing-gingelly-oil', quantity: 3, unit: 'g' },
      { ingredientId: 'ing-turmeric', quantity: 1, unit: 'g' },
    ],
  },
  {
    id: 'rec-palak-tofu-jowar-phulka',
    name: 'Jowar Phulka (2) + Palak Tofu Curry',
    servings: 1,
    glycemicIndex: 'Low',
    clinicalNotes: 'Gluten-free resistant starch paired with plant isoflavones for stable nocturnal blood glucose.',
    ingredients: [
      { ingredientId: 'ing-jowar-sorghum', quantity: 60, unit: 'g' },
      { ingredientId: 'ing-palak-spinach', quantity: 100, unit: 'g' },
      { ingredientId: 'ing-tofu-firm', quantity: 60, unit: 'g' },
      { ingredientId: 'ing-tomato', quantity: 30, unit: 'g' },
      { ingredientId: 'ing-gingelly-oil', quantity: 5, unit: 'g' },
    ],
  },
  {
    id: 'rec-ragi-upma',
    name: 'Ragi & Vegetable Upma with Mint Chutney',
    servings: 1,
    glycemicIndex: 'Low',
    clinicalNotes: 'Dense in finger-millet calcium (344 mg/100g) and polyphenols to curb morning glucose surges.',
    ingredients: [
      { ingredientId: 'ing-finger-millet', quantity: 50, unit: 'g' },
      { ingredientId: 'ing-yellow-moong-dal', quantity: 20, unit: 'g' },
      { ingredientId: 'ing-bhindi-okra', quantity: 40, unit: 'g' },
      { ingredientId: 'ing-gingelly-oil', quantity: 5, unit: 'g' },
    ],
  },
  {
    id: 'rec-turmeric-golden-milk',
    name: 'Warm Skimmed Turmeric Milk with Nutmeg',
    servings: 1,
    glycemicIndex: 'Low',
    clinicalNotes: 'Aids evening neuromuscular relaxation and attenuates dawn phenomenon glucose spikes.',
    ingredients: [
      { ingredientId: 'ing-skimmed-curd', quantity: 100, unit: 'g' }, // curd/milk base
      { ingredientId: 'ing-turmeric', quantity: 2, unit: 'g' },
      { ingredientId: 'ing-cinnamon', quantity: 1, unit: 'g' },
    ],
  },
];

/**
 * Standard unit to grams converter
 */
export function convertUnitToGrams(quantity: number, unit: string, ingredient?: IcmrIngredient): number {
  const normUnit = unit.toLowerCase().trim();
  if (normUnit === 'g' || normUnit === 'gram' || normUnit === 'grams') {
    return quantity;
  }
  if (normUnit === 'kg') {
    return quantity * 1000;
  }
  if (normUnit === 'cup' || normUnit === 'cups') {
    return quantity * 150; // standard Indian clinical cup average
  }
  if (normUnit === 'katori' || normUnit === 'bowl' || normUnit === 'small bowl') {
    return quantity * 120;
  }
  if (normUnit === 'tbsp' || normUnit === 'tablespoon') {
    return quantity * 15;
  }
  if (normUnit === 'tsp' || normUnit === 'teaspoon') {
    return quantity * 5;
  }
  if (normUnit === 'ml' || normUnit === 'milliliter') {
    return quantity * 1; // approx 1g/ml for water/infusion
  }
  if (normUnit === 'nos' || normUnit === 'piece' || normUnit === 'pieces' || normUnit === 'unit') {
    return quantity * (ingredient?.gramsPerUnit || 30);
  }
  if (normUnit === 'nut' || normUnit === 'nuts') {
    return quantity * 1.5; // ~1.5g per almond/walnut
  }
  if (normUnit === 'roti' || normUnit === 'rotis' || normUnit === 'phulka' || normUnit === 'phulkas') {
    return quantity * 35; // 35g flour per roti
  }
  if (normUnit === 'idli' || normUnit === 'idlis') {
    return quantity * 40; // 40g per steamed idli
  }
  if (normUnit === 'dosa' || normUnit === 'dosas') {
    return quantity * 60; // 60g per millet dosa
  }
  return quantity;
}

/**
 * Empty zeroed nutrient object
 */
export function getZeroNutrients(): NutrientBreakdown {
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
  };
}

/**
 * Computes exact nutrient breakdown for a specific ingredient and portion weight
 */
export function calculateNutrientBreakdownForIngredient(
  ingredient: IcmrIngredient,
  weightInGrams: number
): NutrientBreakdown {
  const factor = Math.max(0, weightInGrams) / 100;
  const p = ingredient.per100g;

  return {
    calories: Math.round(p.calories * factor * 10) / 10,
    carbs: Math.round(p.carbs * factor * 10) / 10,
    protein: Math.round(p.protein * factor * 10) / 10,
    fat: Math.round(p.fat * factor * 10) / 10,
    fiber: Math.round(p.fiber * factor * 10) / 10,
    calcium: Math.round(p.calcium * factor * 10) / 10,
    iron: Math.round(p.iron * factor * 10) / 10,
    zinc: Math.round(p.zinc * factor * 10) / 10,
    magnesium: Math.round(p.magnesium * factor * 10) / 10,
    sodium: Math.round(p.sodium * factor * 10) / 10,
    potassium: Math.round(p.potassium * factor * 10) / 10,
    vitaminA: Math.round(p.vitaminA * factor * 10) / 10,
    vitaminC: Math.round(p.vitaminC * factor * 10) / 10,
    vitaminD: Math.round(p.vitaminD * factor * 100) / 100,
    folate: Math.round(p.folate * factor * 10) / 10,
    vitaminB12: Math.round(p.vitaminB12 * factor * 100) / 100,
  };
}

/**
 * Sums two or more nutrient breakdowns
 */
export function addNutrientBreakdowns(...list: (NutrientBreakdown | undefined)[]): NutrientBreakdown {
  const acc = getZeroNutrients();

  for (const item of list) {
    if (!item) continue;
    acc.calories += item.calories || 0;
    acc.carbs += item.carbs || 0;
    acc.protein += item.protein || 0;
    acc.fat += item.fat || 0;
    acc.fiber += item.fiber || 0;
    acc.calcium += item.calcium || 0;
    acc.iron += item.iron || 0;
    acc.zinc += item.zinc || 0;
    acc.magnesium += item.magnesium || 0;
    acc.sodium += item.sodium || 0;
    acc.potassium += item.potassium || 0;
    acc.vitaminA += item.vitaminA || 0;
    acc.vitaminC += item.vitaminC || 0;
    acc.vitaminD += item.vitaminD || 0;
    acc.folate += item.folate || 0;
    acc.vitaminB12 += item.vitaminB12 || 0;
  }

  // Round results
  return {
    calories: Math.round(acc.calories),
    carbs: Math.round(acc.carbs * 10) / 10,
    protein: Math.round(acc.protein * 10) / 10,
    fat: Math.round(acc.fat * 10) / 10,
    fiber: Math.round(acc.fiber * 10) / 10,
    calcium: Math.round(acc.calcium),
    iron: Math.round(acc.iron * 10) / 10,
    zinc: Math.round(acc.zinc * 10) / 10,
    magnesium: Math.round(acc.magnesium),
    sodium: Math.round(acc.sodium),
    potassium: Math.round(acc.potassium),
    vitaminA: Math.round(acc.vitaminA),
    vitaminC: Math.round(acc.vitaminC * 10) / 10,
    vitaminD: Math.round(acc.vitaminD * 100) / 100,
    folate: Math.round(acc.folate),
    vitaminB12: Math.round(acc.vitaminB12 * 100) / 100,
  };
}

/**
 * Builds a RecipeIngredientItem with automated calculations
 */
export function createRecipeIngredientItem(
  ingredientId: string,
  quantity: number,
  unit: string
): RecipeIngredientItem {
  const ing = ICMR_INGREDIENTS_DATABASE.find((i) => i.id === ingredientId) || ICMR_INGREDIENTS_DATABASE[0];
  const weightGrams = convertUnitToGrams(quantity, unit, ing);
  const nutrients = calculateNutrientBreakdownForIngredient(ing, weightGrams);

  return {
    id: `ing-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ingredientId: ing.id,
    name: ing.name,
    quantity,
    unit,
    weightGrams,
    nutrients,
  };
}

/**
 * Builds a ClinicalRecipe with automated nutrient calculation
 */
export function buildClinicalRecipe(
  name: string,
  servings: number,
  rawIngredients: { ingredientId: string; quantity: number; unit: string }[],
  glycemicIndex: 'Low' | 'Medium' | 'High' = 'Low',
  preparationNote?: string
): ClinicalRecipe {
  const ingredients: RecipeIngredientItem[] = rawIngredients.map((r) =>
    createRecipeIngredientItem(r.ingredientId, r.quantity, r.unit)
  );

  const totalNutrients = addNutrientBreakdowns(...ingredients.map((i) => i.nutrients));

  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    servings,
    preparationNote,
    ingredients,
    nutrients: totalNutrients,
    glycemicIndex,
    icmrVerified: true,
  };
}

/**
 * Dynamic ICMR 2020 / 2024 RDA Requirements based on Patient Profile
 */
export function getIcmrRdaRequirements(info: GeneralInfo): IcmrRdaBenchmark {
  const isFemale = info.sex === 'Female';
  const weightKg = typeof info.weight === 'number' ? info.weight : parseFloat(String(info.weight)) || 55;

  // ICMR 2020: 0.83 g/kg reference standard
  const rdaProtein = Math.round(weightKg * 0.83);

  // Target diabetic calories: ~1500 kcal baseline or customized to activity
  let energyTarget = 1500;
  if (info.activityLevel === 'sedentary') energyTarget = 1400;
  else if (info.activityLevel === 'moderately_active') energyTarget = 1550;
  else if (info.activityLevel === 'very_active') energyTarget = 1750;

  // Carbohydrate: 50% of energy / 4 = grams
  const targetCarbs = Math.round((energyTarget * 0.50) / 4);

  // Fat: 25% of energy / 9 = grams
  const targetFat = Math.round((energyTarget * 0.25) / 9);

  return {
    energy: {
      target: energyTarget,
      unit: 'kcal',
      note: 'ICMR EER calibrated for diabetic metabolic deficit',
    },
    protein: {
      target: rdaProtein,
      unit: 'g',
      note: `ICMR 2020 standard (0.83 g/kg for ${weightKg}kg)`,
    },
    carbohydrate: {
      target: targetCarbs,
      minPercent: 50,
      maxPercent: 55,
      unit: 'g',
      note: 'Low glycemic, complex whole grain/millet carbohydrates',
    },
    fat: {
      target: targetFat,
      minPercent: 20,
      maxPercent: 30,
      unit: 'g',
      note: '20-30g visible fats with high MUFA/PUFA ratio',
    },
    fiber: {
      target: 35,
      unit: 'g',
      note: 'ICMR recommendation > 30-40g/day for glycemic control',
    },
    calcium: {
      target: 1000,
      unit: 'mg',
      note: 'ICMR RDA 2020 adult benchmark',
    },
    iron: {
      target: isFemale ? 29 : 19,
      unit: 'mg',
      note: isFemale ? 'ICMR female menstruating RDA (29 mg)' : 'ICMR adult male RDA (19 mg)',
    },
    zinc: {
      target: isFemale ? 13.2 : 17.0,
      unit: 'mg',
      note: 'Essential cofactor for pancreatic insulin crystallization',
    },
    magnesium: {
      target: isFemale ? 370 : 440,
      unit: 'mg',
      note: 'Regulates cellular tyrosine kinase and GLUT4 signaling',
    },
    sodium: {
      maxSafe: 2000,
      unit: 'mg',
      note: 'ICMR upper safe limit (< 5g NaCl / day)',
    },
    potassium: {
      target: 3500,
      unit: 'mg',
      note: 'ICMR protective cardiovascular benchmark',
    },
    vitaminA: {
      target: 1000,
      unit: 'mcg',
      note: 'Retinol Equivalents for retinal microvasculature protection',
    },
    vitaminC: {
      target: isFemale ? 65 : 80,
      unit: 'mg',
      note: 'Enhances plant non-heme iron absorption and capillary strength',
    },
    vitaminD: {
      target: 15,
      unit: 'mcg',
      note: '600 IU daily requirement for bone mineral density',
    },
    folate: {
      target: 300,
      unit: 'mcg',
      note: 'Prevents hyperhomocysteinemia and endothelial dysfunction',
    },
    vitaminB12: {
      target: 2.2,
      unit: 'mcg',
      note: 'Critical for diabetic patients on long-term Metformin',
    },
  };
}

/**
 * Evaluates dietary intake against ICMR RDA targets
 */
export function calculateIcmrAdequacy(
  actual: NutrientBreakdown,
  rda: IcmrRdaBenchmark
): {
  nutrient: string;
  consumed: number;
  target: number;
  unit: string;
  percentMet: number;
  status: 'Optimal' | 'Adequate' | 'Deficient' | 'Excess';
  note: string;
}[] {
  const rows = [
    {
      nutrient: 'Calories (Energy)',
      consumed: actual.calories,
      target: rda.energy.target,
      unit: 'kcal',
      note: rda.energy.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Protein',
      consumed: actual.protein,
      target: rda.protein.target,
      unit: 'g',
      note: rda.protein.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Carbohydrates',
      consumed: actual.carbs,
      target: rda.carbohydrate.target,
      unit: 'g',
      note: rda.carbohydrate.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Healthy Fats',
      consumed: actual.fat,
      target: rda.fat.target,
      unit: 'g',
      note: rda.fat.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Dietary Fiber',
      consumed: actual.fiber,
      target: rda.fiber.target,
      unit: 'g',
      note: rda.fiber.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Calcium',
      consumed: actual.calcium,
      target: rda.calcium.target,
      unit: 'mg',
      note: rda.calcium.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Iron',
      consumed: actual.iron,
      target: rda.iron.target,
      unit: 'mg',
      note: rda.iron.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Zinc',
      consumed: actual.zinc,
      target: rda.zinc.target,
      unit: 'mg',
      note: rda.zinc.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Magnesium',
      consumed: actual.magnesium,
      target: rda.magnesium.target,
      unit: 'mg',
      note: rda.magnesium.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Potassium',
      consumed: actual.potassium,
      target: rda.potassium.target,
      unit: 'mg',
      note: rda.potassium.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Sodium',
      consumed: actual.sodium,
      target: rda.sodium.maxSafe,
      unit: 'mg',
      note: rda.sodium.note,
      isUpperLimit: true,
    },
    {
      nutrient: 'Vitamin C',
      consumed: actual.vitaminC,
      target: rda.vitaminC.target,
      unit: 'mg',
      note: rda.vitaminC.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Vitamin A',
      consumed: actual.vitaminA,
      target: rda.vitaminA.target,
      unit: 'mcg',
      note: rda.vitaminA.note,
      isUpperLimit: false,
    },
    {
      nutrient: 'Folate (B9)',
      consumed: actual.folate,
      target: rda.folate.target,
      unit: 'mcg',
      note: rda.folate.note,
      isUpperLimit: false,
    },
  ];

  return rows.map((r) => {
    const percentMet = Math.round((r.consumed / (r.target || 1)) * 100);
    let status: 'Optimal' | 'Adequate' | 'Deficient' | 'Excess' = 'Adequate';

    if (r.isUpperLimit) {
      if (percentMet > 100) status = 'Excess';
      else status = 'Optimal';
    } else {
      if (percentMet >= 90 && percentMet <= 115) status = 'Optimal';
      else if (percentMet >= 75) status = 'Adequate';
      else if (percentMet < 75) status = 'Deficient';
      else status = 'Excess';
    }

    return {
      nutrient: r.nutrient,
      consumed: r.consumed,
      target: r.target,
      unit: r.unit,
      percentMet,
      status,
      note: r.note,
    };
  });
}

/**
 * Intelligent helper to deduce default ingredient breakdown from meal items
 */
export function inferIngredientsForMeal(meal: MealPlanItem): RecipeIngredientItem[] {
  if (meal.ingredients && meal.ingredients.length > 0) {
    return meal.ingredients;
  }

  // Pre-seed realistic ingredients based on meal name and items
  const generated: RecipeIngredientItem[] = [];
  const text = (meal.mealName + ' ' + meal.items.map((i) => i.name + ' ' + i.portion).join(' ')).toLowerCase();

  if (text.includes('detox') || text.includes('methi')) {
    generated.push(createRecipeIngredientItem('ing-fenugreek-seeds', 5, 'g'));
    generated.push(createRecipeIngredientItem('ing-almonds', 10, 'g'));
    generated.push(createRecipeIngredientItem('ing-walnuts', 6, 'g'));
  } else if (text.includes('breakfast') || text.includes('idli') || text.includes('dosa') || text.includes('upma') || text.includes('pongal')) {
    if (text.includes('ragi')) {
      generated.push(createRecipeIngredientItem('ing-finger-millet', 60, 'g'));
    } else {
      generated.push(createRecipeIngredientItem('ing-foxtail-millet', 60, 'g'));
    }
    generated.push(createRecipeIngredientItem('ing-black-gram', 20, 'g'));
    generated.push(createRecipeIngredientItem('ing-drumstick-leaves', 40, 'g'));
    generated.push(createRecipeIngredientItem('ing-toor-dal', 20, 'g'));
    generated.push(createRecipeIngredientItem('ing-gingelly-oil', 5, 'g'));
  } else if (text.includes('lunch')) {
    generated.push(createRecipeIngredientItem('ing-barnyard-millet', 65, 'g'));
    generated.push(createRecipeIngredientItem('ing-yellow-moong-dal', 30, 'g'));
    generated.push(createRecipeIngredientItem('ing-palak-spinach', 80, 'g'));
    generated.push(createRecipeIngredientItem('ing-cucumber', 60, 'g'));
    generated.push(createRecipeIngredientItem('ing-skimmed-curd', 100, 'g'));
    generated.push(createRecipeIngredientItem('ing-gingelly-oil', 5, 'g'));
  } else if (text.includes('evening') || text.includes('sundal') || text.includes('sprout')) {
    generated.push(createRecipeIngredientItem('ing-sprouted-moong', 80, 'g'));
    generated.push(createRecipeIngredientItem('ing-flax-seeds', 5, 'g'));
    generated.push(createRecipeIngredientItem('ing-gingelly-oil', 3, 'g'));
  } else if (text.includes('dinner') || text.includes('phulka') || text.includes('roti')) {
    generated.push(createRecipeIngredientItem('ing-jowar-sorghum', 60, 'g'));
    generated.push(createRecipeIngredientItem('ing-paneer-low-fat', 50, 'g'));
    generated.push(createRecipeIngredientItem('ing-bitter-gourd', 60, 'g'));
    generated.push(createRecipeIngredientItem('ing-tomato', 40, 'g'));
    generated.push(createRecipeIngredientItem('ing-gingelly-oil', 5, 'g'));
  } else if (text.includes('snack') || text.includes('mid-morning') || text.includes('guava') || text.includes('papaya')) {
    generated.push(createRecipeIngredientItem('ing-guava', 120, 'g'));
    generated.push(createRecipeIngredientItem('ing-pumpkin-seeds', 5, 'g'));
  } else {
    // Bedtime or general soother
    generated.push(createRecipeIngredientItem('ing-skimmed-curd', 100, 'g'));
    generated.push(createRecipeIngredientItem('ing-turmeric', 2, 'g'));
    generated.push(createRecipeIngredientItem('ing-cinnamon', 1, 'g'));
  }

  return generated;
}

/**
 * Enriches an entire 7-day Diet Plan with automated ICMR nutrient calculations
 */
export function enrichDietPlanWithIcmr(days: DietDayPlan[]): DietDayPlan[] {
  return days.map((day) => {
    const enrichedMeals: MealPlanItem[] = day.meals.map((meal) => {
      const ingredients = inferIngredientsForMeal(meal);
      const computedNutrients = addNutrientBreakdowns(...ingredients.map((i) => i.nutrients));

      return {
        ...meal,
        ingredients,
        nutrients: computedNutrients,
        // Sync macros with computed if desired or preserve calibrated
        calories: computedNutrients.calories || meal.calories,
        carbs: computedNutrients.carbs || meal.carbs,
        protein: computedNutrients.protein || meal.protein,
        fat: computedNutrients.fat || meal.fat,
        fiber: computedNutrients.fiber || meal.fiber,
      };
    });

    const dayNutrients = addNutrientBreakdowns(...enrichedMeals.map((m) => m.nutrients));

    return {
      ...day,
      meals: enrichedMeals,
      totalNutrients: dayNutrients,
      totalCalories: dayNutrients.calories || day.totalCalories,
      totalCarbs: Math.round(dayNutrients.carbs),
      totalProtein: Math.round(dayNutrients.protein),
      totalFat: Math.round(dayNutrients.fat),
      totalFiber: Math.round(dayNutrients.fiber),
    };
  });
}

/**
 * Adds an ingredient to a specific meal and automatically recalculates meal and day nutrients
 */
export function addIngredientToMealPlan(
  days: DietDayPlan[],
  dayNumber: number,
  mealId: string,
  newIngredient: RecipeIngredientItem
): DietDayPlan[] {
  return days.map((day) => {
    if (day.dayNumber !== dayNumber) return day;

    const updatedMeals = day.meals.map((meal) => {
      if (meal.id !== mealId) return meal;

      const currentIngredients =
        meal.ingredients && meal.ingredients.length > 0
          ? [...meal.ingredients]
          : inferIngredientsForMeal(meal);

      const newIngredients = [...currentIngredients, newIngredient];
      const computedNutrients = addNutrientBreakdowns(
        ...newIngredients.map((i) => i.nutrients)
      );

      return {
        ...meal,
        ingredients: newIngredients,
        nutrients: computedNutrients,
        calories: computedNutrients.calories,
        carbs: computedNutrients.carbs,
        protein: computedNutrients.protein,
        fat: computedNutrients.fat,
        fiber: computedNutrients.fiber,
        items: [
          ...meal.items,
          {
            name: newIngredient.name,
            portion: `${newIngredient.quantity} ${newIngredient.unit}`,
          },
        ],
      };
    });

    const dayNutrients = addNutrientBreakdowns(
      ...updatedMeals.map(
        (m) =>
          m.nutrients ||
          addNutrientBreakdowns(...(m.ingredients || []).map((i) => i.nutrients))
      )
    );

    return {
      ...day,
      meals: updatedMeals,
      totalNutrients: dayNutrients,
      totalCalories: dayNutrients.calories,
      totalCarbs: Math.round(dayNutrients.carbs),
      totalProtein: Math.round(dayNutrients.protein),
      totalFat: Math.round(dayNutrients.fat),
      totalFiber: Math.round(dayNutrients.fiber),
    };
  });
}

/**
 * Adds a clinical recipe to a meal and automatically recalculates all macros and micros
 */
export function addRecipeToMealPlan(
  days: DietDayPlan[],
  dayNumber: number,
  mealId: string,
  recipe: ClinicalRecipe
): DietDayPlan[] {
  return days.map((day) => {
    if (day.dayNumber !== dayNumber) return day;

    const updatedMeals = day.meals.map((meal) => {
      if (meal.id !== mealId) return meal;

      const currentIngredients =
        meal.ingredients && meal.ingredients.length > 0
          ? [...meal.ingredients]
          : inferIngredientsForMeal(meal);

      const newIngredients = [...currentIngredients, ...recipe.ingredients];
      const computedNutrients = addNutrientBreakdowns(
        ...newIngredients.map((i) => i.nutrients)
      );

      return {
        ...meal,
        ingredients: newIngredients,
        nutrients: computedNutrients,
        calories: computedNutrients.calories,
        carbs: computedNutrients.carbs,
        protein: computedNutrients.protein,
        fat: computedNutrients.fat,
        fiber: computedNutrients.fiber,
        items: [
          ...meal.items,
          {
            name: recipe.name,
            portion: `${recipe.servings} serving(s)`,
          },
        ],
      };
    });

    const dayNutrients = addNutrientBreakdowns(
      ...updatedMeals.map(
        (m) =>
          m.nutrients ||
          addNutrientBreakdowns(...(m.ingredients || []).map((i) => i.nutrients))
      )
    );

    return {
      ...day,
      meals: updatedMeals,
      totalNutrients: dayNutrients,
      totalCalories: dayNutrients.calories,
      totalCarbs: Math.round(dayNutrients.carbs),
      totalProtein: Math.round(dayNutrients.protein),
      totalFat: Math.round(dayNutrients.fat),
      totalFiber: Math.round(dayNutrients.fiber),
    };
  });
}

/**
 * Removes an ingredient from a meal and recalculates
 */
export function removeIngredientFromMealPlan(
  days: DietDayPlan[],
  dayNumber: number,
  mealId: string,
  ingredientItemId: string
): DietDayPlan[] {
  return days.map((day) => {
    if (day.dayNumber !== dayNumber) return day;

    const updatedMeals = day.meals.map((meal) => {
      if (meal.id !== mealId) return meal;

      const currentIngredients =
        meal.ingredients && meal.ingredients.length > 0
          ? [...meal.ingredients]
          : inferIngredientsForMeal(meal);

      const newIngredients = currentIngredients.filter((i) => i.id !== ingredientItemId);
      const computedNutrients = addNutrientBreakdowns(
        ...newIngredients.map((i) => i.nutrients)
      );

      return {
        ...meal,
        ingredients: newIngredients,
        nutrients: computedNutrients,
        calories: computedNutrients.calories,
        carbs: computedNutrients.carbs,
        protein: computedNutrients.protein,
        fat: computedNutrients.fat,
        fiber: computedNutrients.fiber,
      };
    });

    const dayNutrients = addNutrientBreakdowns(
      ...updatedMeals.map(
        (m) =>
          m.nutrients ||
          addNutrientBreakdowns(...(m.ingredients || []).map((i) => i.nutrients))
      )
    );

    return {
      ...day,
      meals: updatedMeals,
      totalNutrients: dayNutrients,
      totalCalories: dayNutrients.calories,
      totalCarbs: Math.round(dayNutrients.carbs),
      totalProtein: Math.round(dayNutrients.protein),
      totalFat: Math.round(dayNutrients.fat),
      totalFiber: Math.round(dayNutrients.fiber),
    };
  });
}
