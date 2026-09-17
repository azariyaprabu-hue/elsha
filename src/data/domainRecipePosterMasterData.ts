export interface RecipePosterMealItem {
  id: string;
  number: number;
  name: string;
  portionOrNote?: string;
  imageKeyword?: string;
  imageUrl?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  therapeuticBenefit?: string;
}

export interface ConditionRecipePosterData {
  conditionKey: string;
  displayName: string;
  title: string;
  domainType: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains';
  subtitleTags: string[];
  dietTips: string[];
  foodsToInclude: string;
  foodsToAvoid: string;
  breakfast: RecipePosterMealItem[];
  lunch: RecipePosterMealItem[];
  snacks: RecipePosterMealItem[];
  dinner: RecipePosterMealItem[];
  bedtime: RecipePosterMealItem[];
  noteFooter?: string;
}

// Curated reliable food imagery mapping
export const FOOD_IMAGE_MAP: Record<string, string> = {
  porridge: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=120&auto=format&fit=crop&q=80',
  oats: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=120&auto=format&fit=crop&q=80',
  chilla: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=120&auto=format&fit=crop&q=80',
  upma: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=120&auto=format&fit=crop&q=80',
  ragi: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=120&auto=format&fit=crop&q=80',
  salad: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80',
  poha: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=120&auto=format&fit=crop&q=80',
  idli: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=120&auto=format&fit=crop&q=80',
  thepla: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=120&auto=format&fit=crop&q=80',
  egg: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=120&auto=format&fit=crop&q=80',
  yogurt: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&auto=format&fit=crop&q=80',
  rice_dal: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&auto=format&fit=crop&q=80',
  roti: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=120&auto=format&fit=crop&q=80',
  quinoa: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=120&auto=format&fit=crop&q=80',
  millets: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&auto=format&fit=crop&q=80',
  khichdi: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&auto=format&fit=crop&q=80',
  chicken: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=120&auto=format&fit=crop&q=80',
  fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&auto=format&fit=crop&q=80',
  rajma: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&auto=format&fit=crop&q=80',
  paneer: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=120&auto=format&fit=crop&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=120&auto=format&fit=crop&q=80',
  nuts: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80',
  chana: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=120&auto=format&fit=crop&q=80',
  buttermilk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=120&auto=format&fit=crop&q=80',
  sprouts: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80',
  seeds: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80',
  tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=120&auto=format&fit=crop&q=80',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=120&auto=format&fit=crop&q=80',
  dark_chocolate: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=120&auto=format&fit=crop&q=80',
};

// -------------------------------------------------------------
// 1. DIABETES MELLITUS (Exact match to User's WhatsApp Image)
// -------------------------------------------------------------
export const DIABETES_RECIPE_POSTER: ConditionRecipePosterData = {
  conditionKey: 'Diabetes Mellitus',
  displayName: 'Diabetes Mellitus',
  title: 'DIABETES FRIENDLY – 20 OPTIONS EACH MEAL',
  domainType: 'diseases',
  subtitleTags: ['Low GI', 'High Fibre', 'Balanced Carbs', 'Protein Rich', 'Heart Healthy'],
  dietTips: [
    'Eat in fixed time',
    'Include fibre in every meal',
    'Choose whole grains',
    'Avoid sugar & refined foods',
    'Stay hydrated',
    'Monitor portion size',
  ],
  foodsToInclude:
    'Whole grains, Millets, Lentils, Beans, Green leafy vegetables, Nuts, Seeds, Low GI fruits (Apple, Guava, Pear, Citrus), Lean protein (Paneer, Tofu, Fish, Chicken)',
  foodsToAvoid:
    'White rice, Maida, Sugary drinks, Deep fried foods, Sweets, Bakery items, High salt processed foods',
  noteFooter: 'Note: Portions should be as per Individual Calorie & Medical Condition. Consult your Dietitian for Personalized Plan.',
  breakfast: [
    { id: 'dia-bf-1', number: 1, name: 'Oats Vegetable Porridge', imageKeyword: 'oats' },
    { id: 'dia-bf-2', number: 2, name: 'Moong Dal Chilla with Mint Chutney', imageKeyword: 'chilla' },
    { id: 'dia-bf-3', number: 3, name: 'Besan Chilla with Veggies', imageKeyword: 'chilla' },
    { id: 'dia-bf-4', number: 4, name: 'Vegetable Upma (Rawa)', imageKeyword: 'upma' },
    { id: 'dia-bf-5', number: 5, name: 'Ragi Malt / Ragi Porridge', imageKeyword: 'ragi' },
    { id: 'dia-bf-6', number: 6, name: 'Multigrain Dosa with Sambar', imageKeyword: 'dosa' },
    { id: 'dia-bf-7', number: 7, name: 'Sprouted Moong Salad', imageKeyword: 'sprouts' },
    { id: 'dia-bf-8', number: 8, name: 'Vegetable Poha (Flattened Rice)', imageKeyword: 'poha' },
    { id: 'dia-bf-9', number: 9, name: 'Idli with Sambar (2 Nos)', imageKeyword: 'idli' },
    { id: 'dia-bf-10', number: 10, name: 'Oats + Chia Seeds Porridge', imageKeyword: 'oats' },
    { id: 'dia-bf-11', number: 11, name: 'Dalia (Broken Wheat) Upma', imageKeyword: 'upma' },
    { id: 'dia-bf-12', number: 12, name: 'Methi Thepla (2 Small)', imageKeyword: 'thepla' },
    { id: 'dia-bf-13', number: 13, name: 'Vegetable Oats Dosa', imageKeyword: 'dosa' },
    { id: 'dia-bf-14', number: 14, name: 'Boiled Moong with Veggies', imageKeyword: 'sprouts' },
    { id: 'dia-bf-15', number: 15, name: 'Brown Rice Idli (2 Nos)', imageKeyword: 'idli' },
    { id: 'dia-bf-16', number: 16, name: 'Barley Porridge with Nuts', imageKeyword: 'porridge' },
    { id: 'dia-bf-17', number: 17, name: 'Vegetable Suji Cheela', imageKeyword: 'chilla' },
    { id: 'dia-bf-18', number: 18, name: 'Sprouted Ragi Porridge', imageKeyword: 'ragi' },
    { id: 'dia-bf-19', number: 19, name: 'Egg White Omelette + Veggies', imageKeyword: 'egg' },
    { id: 'dia-bf-20', number: 20, name: 'Greek Yogurt with Flaxseeds & Berries', imageKeyword: 'yogurt' },
  ],
  lunch: [
    { id: 'dia-lu-1', number: 1, name: 'Brown Rice + Dal + Veg Poriyal', imageKeyword: 'rice_dal' },
    { id: 'dia-lu-2', number: 2, name: '2 Phulka + Mix Veg + Dal', imageKeyword: 'roti' },
    { id: 'dia-lu-3', number: 3, name: 'Quinoa Pulao + Raita', imageKeyword: 'quinoa' },
    { id: 'dia-lu-4', number: 4, name: 'Millets (Foxtail/Little Millet) + Sambar', imageKeyword: 'millets' },
    { id: 'dia-lu-5', number: 5, name: 'Brown Rice + Rajma + Cabbage Poriyal', imageKeyword: 'rajma' },
    { id: 'dia-lu-6', number: 6, name: 'Khichdi (Moong Dal + Brown Rice) + Salad', imageKeyword: 'khichdi' },
    { id: 'dia-lu-7', number: 7, name: '2 Phulka + Chana Dal + Lauki Sabzi', imageKeyword: 'roti' },
    { id: 'dia-lu-8', number: 8, name: 'Vegetable Sambar + Red Rice + Salad', imageKeyword: 'rice_dal' },
    { id: 'dia-lu-9', number: 9, name: 'Grilled Chicken / Paneer + Veg + Dal', imageKeyword: 'paneer' },
    { id: 'dia-lu-10', number: 10, name: 'Jeera Brown Rice + Palak Dal + Salad', imageKeyword: 'rice_dal' },
    { id: 'dia-lu-11', number: 11, name: 'Bajra Roti + Mix Veg + Dal', imageKeyword: 'roti' },
    { id: 'dia-lu-12', number: 12, name: 'Brown Rice + Kadhi + Veg Stir Fry', imageKeyword: 'rice_dal' },
    { id: 'dia-lu-13', number: 13, name: 'Lobiya (Black Eyed Peas) Curry + Rice + Salad', imageKeyword: 'rajma' },
    { id: 'dia-lu-14', number: 14, name: '2 Phulka + Bhindi Sabzi + Dal', imageKeyword: 'roti' },
    { id: 'dia-lu-15', number: 15, name: 'Vegetable Biryani (Millets/Brown Rice) + Raita', imageKeyword: 'millets' },
    { id: 'dia-lu-16', number: 16, name: 'Moong Dal Khichdi + Veg Curd', imageKeyword: 'khichdi' },
    { id: 'dia-lu-17', number: 17, name: 'Grilled Fish + Quinoa + Veg', imageKeyword: 'fish' },
    { id: 'dia-lu-18', number: 18, name: 'Brown Rice + Chole + Salad', imageKeyword: 'rajma' },
    { id: 'dia-lu-19', number: 19, name: '2 Ragi Roti + Veg Kurma', imageKeyword: 'roti' },
    { id: 'dia-lu-20', number: 20, name: 'Red Rice + Toor Dal + Beans Poriyal', imageKeyword: 'rice_dal' },
  ],
  snacks: [
    { id: 'dia-sn-1', number: 1, name: 'Roasted Chana', imageKeyword: 'chana' },
    { id: 'dia-sn-2', number: 2, name: 'Handful of Nuts (Almonds, Walnuts)', imageKeyword: 'nuts' },
    { id: 'dia-sn-3', number: 3, name: 'Buttermilk (Spiced)', imageKeyword: 'buttermilk' },
    { id: 'dia-sn-4', number: 4, name: 'Guava Slices (with Chaat Masala)', imageKeyword: 'fruits' },
    { id: 'dia-sn-5', number: 5, name: 'Cucumber + Carrot Sticks', imageKeyword: 'salad' },
    { id: 'dia-sn-6', number: 6, name: 'Sprouts Chaat (No Onion)', imageKeyword: 'sprouts' },
    { id: 'dia-sn-7', number: 7, name: 'Apple with Peanut Butter', imageKeyword: 'fruits' },
    { id: 'dia-sn-8', number: 8, name: 'Greek Yogurt (Unsweetened)', imageKeyword: 'yogurt' },
    { id: 'dia-sn-9', number: 9, name: 'Boiled Corn (1 Small Cup)', imageKeyword: 'fruits' },
    { id: 'dia-sn-10', number: 10, name: 'Flaxseeds + Pumpkin Seeds Mix', imageKeyword: 'seeds' },
    { id: 'dia-sn-11', number: 11, name: 'Tomato Soup (Homemade)', imageKeyword: 'soup' },
    { id: 'dia-sn-12', number: 12, name: 'Bhel (Diabetic Friendly - No Sev, More Veg)', imageKeyword: 'chana' },
    { id: 'dia-sn-13', number: 13, name: 'Pear Slices', imageKeyword: 'fruits' },
    { id: 'dia-sn-14', number: 14, name: 'Makhana (Roasted)', imageKeyword: 'nuts' },
    { id: 'dia-sn-15', number: 15, name: 'Vegetable Clear Soup', imageKeyword: 'soup' },
    { id: 'dia-sn-16', number: 16, name: 'Chia Pudding (Unsweetened)', imageKeyword: 'yogurt' },
    { id: 'dia-sn-17', number: 17, name: 'Roasted Edamame or Soya Nuts', imageKeyword: 'nuts' },
    { id: 'dia-sn-18', number: 18, name: 'Orange / Mosambi (1 Medium)', imageKeyword: 'fruits' },
    { id: 'dia-sn-19', number: 19, name: 'Chia Seeds + Buttermilk', imageKeyword: 'buttermilk' },
    { id: 'dia-sn-20', number: 20, name: 'Dark Chocolate (1-2 Small Pieces)', imageKeyword: 'dark_chocolate' },
  ],
  dinner: [
    { id: 'dia-dn-1', number: 1, name: 'Vegetable Soup + Grilled Paneer', imageKeyword: 'paneer' },
    { id: 'dia-dn-2', number: 2, name: '2 Phulka + Mix Veg + Dal Soup', imageKeyword: 'roti' },
    { id: 'dia-dn-3', number: 3, name: 'Moong Dal Soup + Veg Stir Fry', imageKeyword: 'soup' },
    { id: 'dia-dn-4', number: 4, name: 'Lauki / Bottle Gourd Soup + Salad', imageKeyword: 'soup' },
    { id: 'dia-dn-5', number: 5, name: '2 Ragi Roti + Palak Paneer', imageKeyword: 'roti' },
    { id: 'dia-dn-6', number: 6, name: 'Grilled Fish / Tofu + Steamed Veg', imageKeyword: 'fish' },
    { id: 'dia-dn-7', number: 7, name: 'Vegetable Clear Soup + Quinoa Salad', imageKeyword: 'soup' },
    { id: 'dia-dn-8', number: 8, name: '2 Phulka + Tinda Sabzi + Dal', imageKeyword: 'roti' },
    { id: 'dia-dn-9', number: 9, name: 'Mixed Veg Soup + Sprouts Salad', imageKeyword: 'soup' },
    { id: 'dia-dn-10', number: 10, name: 'Paneer Bhurji + 2 Phulka', imageKeyword: 'paneer' },
    { id: 'dia-dn-11', number: 11, name: 'Oats Vegetable Soup + Steamed Broccoli', imageKeyword: 'soup' },
    { id: 'dia-dn-12', number: 12, name: '2 Phulka + Bhindi Sabzi', imageKeyword: 'roti' },
    { id: 'dia-dn-13', number: 13, name: 'Tomato Soup + Veg Omelette', imageKeyword: 'egg' },
    { id: 'dia-dn-14', number: 14, name: 'Vegetable Khichdi (Moong Dal)', imageKeyword: 'khichdi' },
    { id: 'dia-dn-15', number: 15, name: 'Soya Chunks Curry + 2 Phulka', imageKeyword: 'roti' },
    { id: 'dia-dn-16', number: 16, name: 'Clear Soup + Grilled Chicken', imageKeyword: 'chicken' },
    { id: 'dia-dn-17', number: 17, name: '2 Phulka + Cabbage Sabzi + Dal', imageKeyword: 'roti' },
    { id: 'dia-dn-18', number: 18, name: 'Zucchini / Veg Soup + Paneer Cubes', imageKeyword: 'soup' },
    { id: 'dia-dn-19', number: 19, name: 'Red Rice + Vegetable Sambar', imageKeyword: 'rice_dal' },
    { id: 'dia-dn-20', number: 20, name: 'Light Dal Soup + Steamed Veg', imageKeyword: 'soup' },
  ],
  bedtime: [
    { id: 'dia-bt-1', number: 1, name: 'Warm Milk (Unsweetened)', imageKeyword: 'milk' },
    { id: 'dia-bt-2', number: 2, name: 'Turmeric Milk (Skimmed)', imageKeyword: 'milk' },
    { id: 'dia-bt-3', number: 3, name: 'Chamomile Tea', imageKeyword: 'tea' },
    { id: 'dia-bt-4', number: 4, name: 'Cinnamon Tea', imageKeyword: 'tea' },
    { id: 'dia-bt-5', number: 5, name: 'Flaxseeds Soaked in Water', imageKeyword: 'water' },
    { id: 'dia-bt-6', number: 6, name: 'Warm Almond Milk (Unsweetened)', imageKeyword: 'milk' },
    { id: 'dia-bt-7', number: 7, name: 'Fenugreek Seeds Soaked Water', imageKeyword: 'water' },
    { id: 'dia-bt-8', number: 8, name: 'Jeera Water (Warm)', imageKeyword: 'water' },
    { id: 'dia-bt-9', number: 9, name: 'Green Tea', imageKeyword: 'tea' },
    { id: 'dia-bt-10', number: 10, name: 'Ashwagandha Milk (If Suitable)', imageKeyword: 'milk' },
    { id: 'dia-bt-11', number: 11, name: 'Warm Milk with Nutmeg (Pinch)', imageKeyword: 'milk' },
    { id: 'dia-bt-12', number: 12, name: 'Herbal Tea (Sugar Free)', imageKeyword: 'tea' },
    { id: 'dia-bt-13', number: 13, name: 'Basil (Tulsi) Tea', imageKeyword: 'tea' },
    { id: 'dia-bt-14', number: 14, name: 'Warm Water', imageKeyword: 'water' },
    { id: 'dia-bt-15', number: 15, name: 'Methi Seed Water (Overnight Soaked)', imageKeyword: 'water' },
    { id: 'dia-bt-16', number: 16, name: 'Saffron Milk (Skimmed)', imageKeyword: 'milk' },
    { id: 'dia-bt-17', number: 17, name: 'Warm Milk with Cinnamon (Pinch)', imageKeyword: 'milk' },
    { id: 'dia-bt-18', number: 18, name: 'Lemon Balm Tea', imageKeyword: 'tea' },
    { id: 'dia-bt-19', number: 19, name: 'Warm Milk with Chia Seeds', imageKeyword: 'milk' },
    { id: 'dia-bt-20', number: 20, name: 'Probiotic Buttermilk (Unsweetened)', imageKeyword: 'buttermilk' },
  ],
};

import { buildDynamicConditionPoster } from '../utils/dynamicRecipeGenerator';

// Helper generator for generating comprehensive 20x5 matrices for ANY other disease, disorder, fitness, or performance domain
export function generateConditionPosterData(
  conditionName: string,
  domainType: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains' = 'diseases'
): ConditionRecipePosterData {
  const norm = conditionName.trim().toLowerCase();

  // If diabetes, return the exact calibrated dataset
  if (norm.includes('diabet')) {
    return DIABETES_RECIPE_POSTER;
  }

  // Use the advanced clinical dynamic recipe generator
  return buildDynamicConditionPoster(conditionName, domainType);
}

// Legacy fallback helper (preserved for compatibility)
function _legacyGenerateConditionPosterData(
  conditionName: string,
  domainType: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains' = 'diseases'
): ConditionRecipePosterData {
  const norm = conditionName.trim().toLowerCase();
  let subtitleTags = ['Metabolic Health', 'Nutrient Dense', 'Clinical Formulated', 'Custom Macros', 'Therapeutic'];
  let dietTips = [
    'Maintain regular meal scheduling and circadian timing',
    'Prioritize clean whole foods over ultra-processed foods',
    'Adequate hydration (2.5 - 3.0 Liters daily)',
    'Balance protein, healthy fats, and targeted carbohydrates',
    'Follow mindful eating and chewing practices',
    'Monitor individualized clinical tolerance',
  ];
  let foodsToInclude =
    'Seasonal greens, sprouted legumes, therapeutic millets, cold-pressed oils, unrefined nuts, functional seeds, clean lean proteins';
  let foodsToAvoid =
    'Refined sugars, excess sodium, deep-fried snacks, processed meats, trans-fats, artificial colorants, commercial baked confectioneries';

  // Condition specific tweaks
  if (norm.includes('hyperten') || norm.includes('blood pressure')) {
    subtitleTags = ['Low Sodium (<1500mg)', 'High Potassium', 'DASH Compliant', 'Nitric Oxide Rich', 'Cardioprotective'];
    dietTips = [
      'Strictly avoid table salt shaker and high-sodium packaged snacks',
      'Increase potassium-rich vegetables (spinach, pumpkin, bottle gourd)',
      'Include garlic and beetroot daily to stimulate nitric oxide vasodilation',
      'Avoid pickles, appalams/papads, bakery bread, and processed cheese',
      'Maintain 30 minutes of aerobic brisk walking daily',
      'Consume hibiscus or moringa tea before bedtime',
    ];
    foodsToInclude =
      'Garlic cloves, beetroot, tender coconut water, pomegranate, bottle gourd, unpolished millets, unsalted walnuts, steamed fish/paneer';
    foodsToAvoid =
      'Pickles, salted nuts, chips, papad, soy sauce, processed cheese, bakery items, caffeinated energy drinks';
  } else if (norm.includes('cardio') || norm.includes('heart') || norm.includes('lipid') || norm.includes('cholesterol')) {
    subtitleTags = ['Zero Trans-Fat', 'Omega-3 Rich', 'Plaque Stabilizing', 'High Soluble Fiber', 'Endothelial Defense'];
    dietTips = [
      'Prioritize soluble fiber (oats beta-glucan, isabgol, methi) to bind bile acids',
      'Replace butter and hydrogenated oils with cold-pressed mustard or olive oil',
      'Consume 30g soaked walnuts and chia seeds daily for ALA omega-3s',
      'Limit egg yolks to 2-3 per week; prefer egg whites and legumes',
      'Avoid all commercial bakery puffs, biscuits, and re-used cooking oils',
      'Have garlic tea or amla juice first thing in the morning',
    ];
    foodsToInclude =
      'Rolled oats, methi leaves, walnuts, flaxseeds, salmon/sardines, steamed beans, amla, barley, apple pectin';
    foodsToAvoid =
      'Palm oil, deep-fried snacks, red meat, butter, vanaspati/dalda, full-fat condensed milk, sodium-rich gravies';
  } else if (norm.includes('pcos') || norm.includes('pcod')) {
    subtitleTags = ['Insulin Sensitizing', 'Anti-Androgenic', 'Hormone Balancing', 'Low Glycemic', 'Anti-Inflammatory'];
    dietTips = [
      'Always combine complex carbohydrates with protein to blunt insulin surge',
      'Drink 2 cups of organic spearmint tea daily to reduce free testosterone',
      'Practice seed cycling (Flax + Pumpkin in follicular, Sesame + Sunflower in luteal)',
      'Strictly eliminate dairy and refined sugar to downregulate IGF-1 levels',
      'Take 15-minute post-meal walks to stimulate GLUT4 glucose clearance',
      'Prioritize 8 hours of restorative sleep to balance cortisol and leptin',
    ];
    foodsToInclude =
      'Spearmint tea, pumpkin seeds, cinnamon, avocado, fenugreek greens, sprouted moong, wild salmon, cruciferous veggies';
    foodsToAvoid =
      'Commercial cow milk, refined sugar, high-fructose juices, white maida, trans-fat bakery items, soy isolates';
  } else if (norm.includes('weight loss') || norm.includes('fat loss')) {
    subtitleTags = ['Caloric Deficit', 'High Satiety', 'Protein Spared', 'Visceral Fat Blitz', 'Metabolic Boost'];
    dietTips = [
      'Drink 500ml water 20 minutes before meals to promote gastric stretch satiety',
      'Eat salads and clear soup before touching complex carbohydrates',
      'Aim for minimum 1.2 - 1.6g protein per kg target body weight',
      'Maintain an unbroken 12-14 hour overnight circadian fasting window',
      'Eliminate liquid calories, sweetened coffees, and commercial dressings',
      'Sleep by 10:30 PM to suppress nocturnal ghrelin and cortisol elevations',
    ];
    foodsToInclude =
      'Cucumber, bottle gourd, egg whites, soya chunks, Greek yogurt, black coffee/green tea, chia seeds, steamed sprouts';
    foodsToAvoid =
      'Sugary lattes, alcohol, samosas, potato crisps, creamy gravies, sweetened breakfast cereals, late-night snacking';
  } else if (norm.includes('endurance') || norm.includes('sport') || norm.includes('performance')) {
    subtitleTags = ['Glycogen Sparing', 'Electrolyte Balanced', 'Mitochondrial Density', 'Rapid Digestion', 'Nitric Oxide'];
    dietTips = [
      'Time carbohydrates around training sessions (intra and post-workout)',
      'Maintain electrolyte balance with sodium, potassium, and magnesium',
      'Ingest 20-30g rapidly absorbable protein within 45 minutes of training',
      'Consume beetroot juice 2.5 hours prior to high-intensity endurance bouts',
      'Hydrate with 500-750ml fluid per hour of heavy exertion',
      'Consume tart cherry juice or turmeric milk before sleep for myofibrillar repair',
    ];
    foodsToInclude =
      'Sweet potatoes, bananas, tender coconut water, oats, eggs, whey isolate, beetroot, dates, peanut butter';
    foodsToAvoid =
      'Heavy high-fat meals right before training, carbonated sodas, dehydration, alcohol, unhygienic raw street food';
  } else if (norm.includes('gut cleanse') || norm.includes('elimination') || norm.includes('digestive') || norm.includes('ibs')) {
    subtitleTags = ['Mucosal Healing', 'Dysbiosis Resolution', 'Low FODMAP', 'Hypoallergenic', 'Soothe & Restore'];
    dietTips = [
      'Chew every mouthful 25-30 times to maximize salivary amylase breakdown',
      'Avoid ice-cold beverages; sip warm cumin-fennel infusion post-meal',
      'Follow 12-day sequential reintroduction of potential dietary triggers',
      'Incorporate bone broth or glutamine-rich vegetable stew for enterocyte repair',
      'Avoid raw cruciferous salads if experiencing acute gas or bloating; prefer steamed',
      'Consume probiotic buttermilk with hing and curry leaves at noon',
    ];
    foodsToInclude =
      'Steamed ash gourd, yellow moong dal, ginger, cumin, fresh homemade neer mor, stewed apples, peppermint tea, bone broth';
    foodsToAvoid =
      'Gluten, commercial cow dairy, artificial sweeteners, deep-fried snacks, carbonated drinks, onions/garlic during acute flare';
  } else if (norm.includes('renal') || norm.includes('kidney')) {
    subtitleTags = ['Low Potassium', 'Controlled Phosphorus', 'Glomerular Protective', 'Precision Protein', 'Electrolyte Guard'];
    dietTips = [
      'Leach vegetables (double-boil and discard water) to lower potassium',
      'Strictly cap sodium to 1500mg daily to protect glomerular filtration rate',
      'Calibrate protein to 0.6 - 0.8g/kg in non-dialysis stages to reduce nitrogenous waste',
      'Avoid dark colas, nuts, and processed meats high in inorganic phosphorus',
      'Track strict daily fluid allowance as prescribed by nephrology team',
      'Monitor serum potassium and avoid high-potassium fruits (bananas, mangoes, oranges)',
    ];
    foodsToInclude =
      'Apple, pear, cabbage, bottle gourd, white rice, egg white, leached vegetables, ginger tea';
    foodsToAvoid =
      'Dark colas, chocolate, bananas, tomatoes, spinach, organ meats, excessive dairy, packaged snacks with phosphate additives';
  } else if (norm.includes('keto')) {
    subtitleTags = ['Ketogenic (<30g Net Carbs)', 'High Healthy Fats', 'Ketone Body Fuel', 'Zero Sugar', 'Visceral Mobilization'];
    dietTips = [
      'Keep net carbohydrates strictly under 25-30g daily to sustain nutritional ketosis',
      'Supplement sodium (3-5g) and magnesium to prevent keto-flu electrolyte depletion',
      'Prioritize monounsaturated fats (olive oil, avocados) and MCT oils',
      'Ensure adequate leafy greens (spinach, methi) for bowel regularity',
      'Drink 3-4 liters of water to aid renal ketone excretion',
      'Test blood beta-hydroxybutyrate levels weekly to verify 0.5 - 3.0 mmol/L range',
    ];
    foodsToInclude =
      'Paneer, eggs, chicken/fish, avocado, extra virgin olive oil, walnuts, spinach, coconut oil, almonds';
    foodsToAvoid =
      'All grains (rice, wheat, millets), starchy tubers (potatoes), sugar, honey, high-sugar fruits, beer, pulses';
  }

  // Generate 20 Breakfast options tailored to the condition
  const breakfast = [
    { id: `${norm}-bf-1`, number: 1, name: `${conditionName} Targeted Oats Porridge`, imageKeyword: 'oats' },
    { id: `${norm}-bf-2`, number: 2, name: 'Sprouted Green Moong Dal Chilla', imageKeyword: 'chilla' },
    { id: `${norm}-bf-3`, number: 3, name: 'Steamed Vegetable Idli with Herbal Sambar', imageKeyword: 'idli' },
    { id: `${norm}-bf-4`, number: 4, name: 'Foxtail Millet & Vegetable Upma', imageKeyword: 'upma' },
    { id: `${norm}-bf-5`, number: 5, name: 'Sprouted Ragi Malt (Sugar-Free)', imageKeyword: 'ragi' },
    { id: `${norm}-bf-6`, number: 6, name: 'Multigrain Methi Thepla with Fresh Curd', imageKeyword: 'thepla' },
    { id: `${norm}-bf-7`, number: 7, name: 'Protein Egg White Omelette with Baby Spinach', imageKeyword: 'egg' },
    { id: `${norm}-bf-8`, number: 8, name: 'Brown Rice Poha with Roasted Peanuts', imageKeyword: 'poha' },
    { id: `${norm}-bf-9`, number: 9, name: 'Crispy Oats & Flaxseeds Dosa', imageKeyword: 'dosa' },
    { id: `${norm}-bf-10`, number: 10, name: 'Chia & Greek Yogurt Bowl with Crushed Walnuts', imageKeyword: 'yogurt' },
    { id: `${norm}-bf-11`, number: 11, name: 'Broken Wheat (Dalia) Vegetable Khichdi', imageKeyword: 'khichdi' },
    { id: `${norm}-bf-12`, number: 12, name: 'Besan & Grated Zucchini Cheela', imageKeyword: 'chilla' },
    { id: `${norm}-bf-13`, number: 13, name: 'Sprouted Horsegram Sundal with Coconut Grating', imageKeyword: 'sprouts' },
    { id: `${norm}-bf-14`, number: 14, name: 'Steamed Kuthiraivali (Barnyard Millet) Pongal', imageKeyword: 'millets' },
    { id: `${norm}-bf-15`, number: 15, name: 'Avocado on Whole Grain Toast with Pumpkin Seeds', imageKeyword: 'salad' },
    { id: `${norm}-bf-16`, number: 16, name: 'Steel-Cut Barley Porridge with Cinnamon', imageKeyword: 'porridge' },
    { id: `${norm}-bf-17`, number: 17, name: 'Boiled Moong & Pomegranate Clinical Salad', imageKeyword: 'sprouts' },
    { id: `${norm}-bf-18`, number: 18, name: 'Tofu Bhurji with 1 Multigrain Roti', imageKeyword: 'paneer' },
    { id: `${norm}-bf-19`, number: 19, name: 'Quinoa Breakfast Bowl with Steamed Beans', imageKeyword: 'quinoa' },
    { id: `${norm}-bf-20`, number: 20, name: 'Therapeutic Protein Green Smoothie', imageKeyword: 'fruits' },
  ];

  // Generate 20 Lunch options tailored to the condition
  const lunch = [
    { id: `${norm}-lu-1`, number: 1, name: 'Brown Rice + Yellow Moong Dal + Sautéed Beans', imageKeyword: 'rice_dal' },
    { id: `${norm}-lu-2`, number: 2, name: '2 Phulka Rotis + Mix Veg Sabzi + Spiced Dal', imageKeyword: 'roti' },
    { id: `${norm}-lu-3`, number: 3, name: 'Barnyard Millet Bisi Bele Bath + Cucumber Raita', imageKeyword: 'millets' },
    { id: `${norm}-lu-4`, number: 4, name: 'Herbal Quinoa Pulao + Sprouted Dal Curry', imageKeyword: 'quinoa' },
    { id: `${norm}-lu-5`, number: 5, name: 'Brown Rice + Rajma Masala + Cabbage Poriyal', imageKeyword: 'rajma' },
    { id: `${norm}-lu-6`, number: 6, name: 'Moong Dal & Vegetable Khichdi + Mint Chutney', imageKeyword: 'khichdi' },
    { id: `${norm}-lu-7`, number: 7, name: '2 Jowar Rotis + Palak Paneer + Tomato Salad', imageKeyword: 'roti' },
    { id: `${norm}-lu-8`, number: 8, name: 'Red Rice + Drumstick Sambar + Beetroot Poriyal', imageKeyword: 'rice_dal' },
    { id: `${norm}-lu-9`, number: 9, name: 'Grilled Herb Chicken / Tofu + Steamed Broccoli', imageKeyword: 'chicken' },
    { id: `${norm}-lu-10`, number: 10, name: 'Bajra Roti + Baingan Bharta + Chana Dal', imageKeyword: 'roti' },
    { id: `${norm}-lu-11`, number: 11, name: 'Jeera Brown Rice + Methi Dal + Carrot Slices', imageKeyword: 'rice_dal' },
    { id: `${norm}-lu-12`, number: 12, name: 'Lauki Kofta Curry (Unfried) + 2 Phulkas', imageKeyword: 'roti' },
    { id: `${norm}-lu-13`, number: 13, name: 'Black-Eyed Pea (Lobiya) Curry + Millets', imageKeyword: 'rajma' },
    { id: `${norm}-lu-14`, number: 14, name: 'Steamed Fish Curry (Omega-3) + Red Rice', imageKeyword: 'fish' },
    { id: `${norm}-lu-15`, number: 15, name: '2 Ragi Phulkas + Bhindi Masala + Dal Tadka', imageKeyword: 'roti' },
    { id: `${norm}-lu-16`, number: 16, name: 'Vegetable Millet Biryani + Pomegranate Raita', imageKeyword: 'millets' },
    { id: `${norm}-lu-17`, number: 17, name: 'Chickpea (Chole) Curry + Brown Rice + Salad', imageKeyword: 'rajma' },
    { id: `${norm}-lu-18`, number: 18, name: 'Paneer Tikka (Tandoori) + Quinoa Salad', imageKeyword: 'paneer' },
    { id: `${norm}-lu-19`, number: 19, name: 'Toor Dal + Steamed Spinach + Foxtail Rice', imageKeyword: 'rice_dal' },
    { id: `${norm}-lu-20`, number: 20, name: 'Soya Chunks Stir Fry + 2 Multigrain Rotis', imageKeyword: 'roti' },
  ];

  // Generate 20 Snacks options tailored to the condition
  const snacks = [
    { id: `${norm}-sn-1`, number: 1, name: 'Roasted Bengal Gram (Chana)', imageKeyword: 'chana' },
    { id: `${norm}-sn-2`, number: 2, name: 'Handful of Soaked Almonds & Walnuts', imageKeyword: 'nuts' },
    { id: `${norm}-sn-3`, number: 3, name: 'Spiced Buttermilk (Neer Mor) with Curry Leaves', imageKeyword: 'buttermilk' },
    { id: `${norm}-sn-4`, number: 4, name: 'Fresh Guava Slices with Black Pepper', imageKeyword: 'fruits' },
    { id: `${norm}-sn-5`, number: 5, name: 'Roasted Foxnuts (Makhana) with Turmeric', imageKeyword: 'nuts' },
    { id: `${norm}-sn-6`, number: 6, name: 'Sprouted Moong & Cucumber Chaat', imageKeyword: 'sprouts' },
    { id: `${norm}-sn-7`, number: 7, name: 'Green Apple with Roasted Peanut Butter', imageKeyword: 'fruits' },
    { id: `${norm}-sn-8`, number: 8, name: 'Steamed Edamame Pods with Rock Salt', imageKeyword: 'nuts' },
    { id: `${norm}-sn-9`, number: 9, name: 'Warm Homemade Tomato & Basil Soup', imageKeyword: 'soup' },
    { id: `${norm}-sn-10`, number: 10, name: 'Pumpkin, Sunflower & Flaxseed Trail Mix', imageKeyword: 'seeds' },
    { id: `${norm}-sn-11`, number: 11, name: 'Boiled Sweet Corn with Lemon Juice', imageKeyword: 'fruits' },
    { id: `${norm}-sn-12`, number: 12, name: 'Unsweetened Greek Yogurt with Cinnamon', imageKeyword: 'yogurt' },
    { id: `${norm}-sn-13`, number: 13, name: 'Papaya Cubes with Chia Seeds', imageKeyword: 'fruits' },
    { id: `${norm}-sn-14`, number: 14, name: 'Vegetable Clear Soup with Coriander', imageKeyword: 'soup' },
    { id: `${norm}-sn-15`, number: 15, name: 'Boiled Egg Whites (2 Nos) with Chaat Masala', imageKeyword: 'egg' },
    { id: `${norm}-sn-16`, number: 16, name: 'Healthy Sprouts Bhel (Zero Sev)', imageKeyword: 'sprouts' },
    { id: `${norm}-sn-17`, number: 17, name: 'Chia Pudding with Unsweetened Almond Milk', imageKeyword: 'yogurt' },
    { id: `${norm}-sn-18`, number: 18, name: 'Fresh Amla Juice / Slices with Pinch of Salt', imageKeyword: 'fruits' },
    { id: `${norm}-sn-19`, number: 19, name: 'Tender Coconut Water (Fresh)', imageKeyword: 'water' },
    { id: `${norm}-sn-20`, number: 20, name: 'Dark Chocolate (85% Cacao, 1-2 Squares)', imageKeyword: 'dark_chocolate' },
  ];

  // Generate 20 Dinner options tailored to the condition
  const dinner = [
    { id: `${norm}-dn-1`, number: 1, name: 'Vegetable Clear Soup + Grilled Herb Paneer', imageKeyword: 'paneer' },
    { id: `${norm}-dn-2`, number: 2, name: '2 Light Phulkas + Bottle Gourd (Lauki) Sabzi', imageKeyword: 'roti' },
    { id: `${norm}-dn-3`, number: 3, name: 'Yellow Moong Dal Soup + Stir Fried Broccoli', imageKeyword: 'soup' },
    { id: `${norm}-dn-4`, number: 4, name: 'Steamed Vegetable Salad + Boiled Moong', imageKeyword: 'salad' },
    { id: `${norm}-dn-5`, number: 5, name: '2 Ragi Rotis + Palak Dal + Radish Salad', imageKeyword: 'roti' },
    { id: `${norm}-dn-6`, number: 6, name: 'Grilled Fish / Tofu Steak + Sautéed Beans', imageKeyword: 'fish' },
    { id: `${norm}-dn-7`, number: 7, name: 'Tomato Garlic Soup + Egg White Scramble', imageKeyword: 'egg' },
    { id: `${norm}-dn-8`, number: 8, name: '2 Phulkas + Ridge Gourd (Peerkangai) Kootu', imageKeyword: 'roti' },
    { id: `${norm}-dn-9`, number: 9, name: 'Light Moong Khichdi with Steamed Zucchini', imageKeyword: 'khichdi' },
    { id: `${norm}-dn-10`, number: 10, name: 'Paneer Bhurji + 2 Multigrain Rotis', imageKeyword: 'paneer' },
    { id: `${norm}-dn-11`, number: 11, name: 'Oats & Vegetable Broth + Steamed Carrots', imageKeyword: 'soup' },
    { id: `${norm}-dn-12`, number: 12, name: '2 Phulkas + Kundru / Tinda Masala + Dal', imageKeyword: 'roti' },
    { id: `${norm}-dn-13`, number: 13, name: 'Spinach & Mushroom Clear Soup + Tofu Cubes', imageKeyword: 'soup' },
    { id: `${norm}-dn-14`, number: 14, name: 'Sprouted Green Gram Khichdi + Curd', imageKeyword: 'khichdi' },
    { id: `${norm}-dn-15`, number: 15, name: 'Soya Chunks Curry + 2 Whole Wheat Phulkas', imageKeyword: 'roti' },
    { id: `${norm}-dn-16`, number: 16, name: 'Herb Grilled Chicken Breast + Green Salad', imageKeyword: 'chicken' },
    { id: `${norm}-dn-17`, number: 17, name: '2 Phulkas + Cabbage Green Peas Poriyal', imageKeyword: 'roti' },
    { id: `${norm}-dn-18`, number: 18, name: 'Drumstick (Murungai) Soup + Grilled Veggies', imageKeyword: 'soup' },
    { id: `${norm}-dn-19`, number: 19, name: 'Little Millet Pongal + Spiced Pepper Sambar', imageKeyword: 'millets' },
    { id: `${norm}-dn-20`, number: 20, name: 'Ash Gourd Soup + Sautéed Paneer & Bell Peppers', imageKeyword: 'soup' },
  ];

  // Generate 20 Bed Time options tailored to the condition
  const bedtime = [
    { id: `${norm}-bt-1`, number: 1, name: 'Warm Golden Turmeric Milk (Skimmed)', imageKeyword: 'milk' },
    { id: `${norm}-bt-2`, number: 2, name: 'Pure Chamomile Tea (Caffeine-Free)', imageKeyword: 'tea' },
    { id: `${norm}-bt-3`, number: 3, name: 'Ceylon Cinnamon Infused Warm Water', imageKeyword: 'water' },
    { id: `${norm}-bt-4`, number: 4, name: 'Warm Almond Milk (Unsweetened)', imageKeyword: 'milk' },
    { id: `${norm}-bt-5`, number: 5, name: 'Overnight Soaked Fenugreek (Methi) Water', imageKeyword: 'water' },
    { id: `${norm}-bt-6`, number: 6, name: 'Warm Cumin (Jeera) & Ajwain Water', imageKeyword: 'water' },
    { id: `${norm}-bt-7`, number: 7, name: 'Ashwagandha Milk with a Pinch of Cardamom', imageKeyword: 'milk' },
    { id: `${norm}-bt-8`, number: 8, name: 'Soaked Flaxseeds in Warm Water', imageKeyword: 'water' },
    { id: `${norm}-bt-9`, number: 9, name: 'Holy Basil (Tulsi) & Ginger Tea', imageKeyword: 'tea' },
    { id: `${norm}-bt-10`, number: 10, name: 'Warm Nutmeg Milk (Supports Deep Sleep)', imageKeyword: 'milk' },
    { id: `${norm}-bt-11`, number: 11, name: 'Organic Lemon Balm / Mint Infusion', imageKeyword: 'tea' },
    { id: `${norm}-bt-12`, number: 12, name: 'Warm Saffron Milk (Skimmed)', imageKeyword: 'milk' },
    { id: `${norm}-bt-13`, number: 13, name: 'Fennel (Saunf) Decoction for Digestion', imageKeyword: 'water' },
    { id: `${norm}-bt-14`, number: 14, name: 'Tart Cherry Juice / Tea (Melatonin Boost)', imageKeyword: 'tea' },
    { id: `${norm}-bt-15`, number: 15, name: 'Warm Water with Overnight Soaked Sabja / Chia', imageKeyword: 'water' },
    { id: `${norm}-bt-16`, number: 16, name: 'Hibiscus Herbal Tisane (Antioxidant)', imageKeyword: 'tea' },
    { id: `${norm}-bt-17`, number: 17, name: 'Warm Skimmed Milk with Ground Cardamom', imageKeyword: 'milk' },
    { id: `${norm}-bt-18`, number: 18, name: 'Brahmi Infused Herbal Night Tea', imageKeyword: 'tea' },
    { id: `${norm}-bt-19`, number: 19, name: 'Warm Ginger & Black Pepper Decoction', imageKeyword: 'tea' },
    { id: `${norm}-bt-20`, number: 20, name: 'Probiotic Spiced Buttermilk (100ml)', imageKeyword: 'buttermilk' },
  ];

  return {
    conditionKey: conditionName,
    displayName: conditionName,
    title: `${conditionName.toUpperCase()} FRIENDLY – 20 OPTIONS EACH MEAL`,
    domainType,
    subtitleTags,
    dietTips,
    foodsToInclude,
    foodsToAvoid,
    noteFooter: 'Note: Portions should be as per Individual Calorie & Medical Condition. Consult your Dietitian for Personalized Plan.',
    breakfast,
    lunch,
    snacks,
    dinner,
    bedtime,
  };
}

// Master list of all selectable groups matching screenshot 1, 2, 3
export interface DomainCategoryGroup {
  groupId: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains';
  groupName: string;
  badgeCode: string;
  items: string[];
}

export const MASTER_DOMAIN_CATEGORY_GROUPS: DomainCategoryGroup[] = [
  {
    groupId: 'diseases',
    groupName: 'DISEASES',
    badgeCode: '01',
    items: [
      'Diabetes Mellitus',
      'Hypertension',
      'Cardiovascular Diseases',
      'PCOS',
      'Thyroid Conditions',
      'Kidney Diseases',
      'Liver Diseases',
      'Gastrointestinal Diseases',
      'Endocrine Diseases',
      'Neurological Diseases',
      'Respiratory Diseases',
      'Cancer',
    ],
  },
  {
    groupId: 'disorders',
    groupName: 'DISORDERS',
    badgeCode: '02',
    items: [
      'Metabolic Disorders',
      'Lipid Disorders',
      'Nutrient Deficiency Disorders',
      'Digestive Disorders',
      'Eating Disorders',
      'Food Intolerance',
      'Food Allergy',
      'Malnutrition',
      'Obesity',
    ],
  },
  {
    groupId: 'performance',
    groupName: 'PERFORMANCE',
    badgeCode: '03',
    items: [
      'Sports Nutrition',
      'Endurance',
      'Strength & Conditioning',
      'Pre-Workout Nutrition',
      'Post-Workout Nutrition',
      'Recovery Nutrition',
      'Hydration & Electrolytes',
      'Competition Nutrition',
      'Performance Nutrition',
    ],
  },
  {
    groupId: 'fitness',
    groupName: 'FITNESS',
    badgeCode: '04',
    items: [
      'Weight Loss',
      'Weight Gain',
      'Weight Maintenance',
      'Fat Loss',
      'Muscle Gain',
      'Body Recomposition',
      'General Fitness',
      'Healthy Lifestyle',
    ],
  },
  {
    groupId: 'diet_domains',
    groupName: 'DIET DOMAINS',
    badgeCode: '05',
    items: [
      'Gut Cleanse & Elimination Diet',
      'Balanced Diet',
      'Low Carbs Diet',
      'Bland Diet (Blanded Diet)',
      'Keto Diet (Therapeutic Ketogenic)',
      'Soft Diet',
      'Fluid & Clear Fluid Diet',
      'Renal Diet (CKD Stage 1-4)',
      'Cardiac Diet',
      'Low Sodium Diet (DASH Model)',
    ],
  },
];
