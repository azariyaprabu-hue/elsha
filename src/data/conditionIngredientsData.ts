export interface TherapeuticIngredient {
  id: string;
  name: string;
  category: 'grains' | 'proteins' | 'vegetables' | 'fatsAndSeeds' | 'spicesAndHerbs';
  categoryLabel: string;
  clinicalAction: string;
  tags: string[];
}

export interface ConditionIngredientProfile {
  conditionKey: string;
  displayName: string;
  domainType: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains';
  pathologySummary: string;
  ingredients: TherapeuticIngredient[];
  foodsToInclude: string[];
  foodsToAvoid: string[];
}

// Master repository of clinical Indian therapeutic ingredients
export const MASTER_INGREDIENT_CATALOG: TherapeuticIngredient[] = [
  // 1. GRAINS & MILLETS
  {
    id: 'foxtail_millet',
    name: 'Foxtail Millet (Thinai)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Ultra-low glycemic index (GI 54), high resistant starch blunts insulin spikes',
    tags: ['diabetes', 'cardiovascular', 'pcos', 'weight_loss', 'fat_loss', 'metabolic'],
  },
  {
    id: 'barnyard_millet',
    name: 'Barnyard Millet (Kuthiraivali)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Epithelial-friendly, lowest carbohydrate density among ancient millets',
    tags: ['gut_cleanse', 'diabetes', 'gerd', 'digestive', 'soft_diet', 'obesity'],
  },
  {
    id: 'little_millet',
    name: 'Little Millet (Samai)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Abundant polyphenols, rapid gastric emptying with low fermentation index',
    tags: ['gut_cleanse', 'fatty_liver', 'diabetes', 'pcos', 'hypertension'],
  },
  {
    id: 'steel_cut_oats',
    name: 'Steel-Cut Oats',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Soluble beta-glucans sequester bile salts to clear circulating LDL cholesterol',
    tags: ['cardiovascular', 'lipid_disorders', 'hypertension', 'weight_loss', 'diabetes'],
  },
  {
    id: 'ragi',
    name: 'Finger Millet (Ragi)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Exceptional bioavailable calcium (344mg/100g) and slow-release iron',
    tags: ['osteoporosis', 'anemia', 'endurance', 'fitness', 'kidney_safe', 'malnutrition'],
  },
  {
    id: 'jowar',
    name: 'Sorghum (Jowar)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Gluten-free prodelphinidin tannins inhibit enzymatic starch breakdown',
    tags: ['diabetes', 'hypertension', 'fat_loss', 'metabolic', 'celiac'],
  },
  {
    id: 'bajra',
    name: 'Pearl Millet (Bajra)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'High magnesium and insoluble fiber promoting cardiovascular vasodilation',
    tags: ['cardiovascular', 'strength', 'performance', 'weight_loss'],
  },
  {
    id: 'brown_basmati',
    name: 'Brown Basmati Rice',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Intact bran layer provides B-complex cofactors for glycogen synthesis',
    tags: ['performance', 'endurance', 'balanced', 'sports_nutrition', 'muscle_gain'],
  },
  {
    id: 'broken_wheat',
    name: 'Broken Wheat (Dalia)',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'High prebiotic hemicellulose fostering healthy colonic short-chain fatty acids',
    tags: ['digestive', 'weight_loss', 'bland_diet', 'diabetes', 'metabolic'],
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    category: 'grains',
    categoryLabel: 'Whole Grains & Millets',
    clinicalAction: 'Complete plant amino acid profile with all 9 essential amino acids',
    tags: ['muscle_gain', 'body_recomposition', 'cancer', 'autoimmune', 'pcos'],
  },

  // 2. CLINICAL PROTEINS & PULSES
  {
    id: 'sprouted_moong',
    name: 'Sprouted Green Moong',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Germination triples antioxidant enzymes and eliminates oligosaccharide gas',
    tags: ['diabetes', 'gut_cleanse', 'fat_loss', 'fatty_liver', 'hypertension', 'gerd'],
  },
  {
    id: 'yellow_moong_dal',
    name: 'Yellow Moong Dal (Split)',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Lightest pulse on the human digestive tract, rich in restorative glutamine',
    tags: ['kidney_diseases', 'gut_cleanse', 'gerd', 'post_workout', 'bland_diet', 'soft_diet'],
  },
  {
    id: 'black_chana',
    name: 'Black Chickpeas (Kala Chana)',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Exceptionally high amylose-to-amylopectin ratio promoting extreme satiety',
    tags: ['fat_loss', 'diabetes', 'body_recomposition', 'strength', 'sports_nutrition'],
  },
  {
    id: 'paneer_a2',
    name: 'Low-Fat A2 Desi Paneer',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Pure slow-digesting micellar casein supporting nocturnal muscle preservation',
    tags: ['muscle_gain', 'strength', 'keto', 'performance', 'pcos'],
  },
  {
    id: 'organic_tofu',
    name: 'Organic Soya Tofu',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Genistein and daidzein isoflavones regulate cellular hormonal balance',
    tags: ['pcos', 'cardiovascular', 'lipid_disorders', 'cancer', 'autoimmune', 'weight_loss'],
  },
  {
    id: 'egg_whites',
    name: 'Pasture-Raised Egg Whites',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Gold standard biological value (BV 100), zero purines and zero saturated fat',
    tags: ['kidney_diseases', 'gout', 'fat_loss', 'lean_muscle', 'competition', 'sports_nutrition'],
  },
  {
    id: 'wild_fish',
    name: 'Wild Salmon / Pomfret / Rohu',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'High EPA/DHA marine omega-3 downregulates NF-kB inflammatory cascade',
    tags: ['cardiovascular', 'autoimmune', 'cancer', 'fatty_liver', 'performance', 'longevity'],
  },
  {
    id: 'chicken_breast',
    name: 'Lean Chicken Breast',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Dense leucine and creatine peptides supporting myofibrillar hypertrophy',
    tags: ['strength', 'muscle_gain', 'body_recomposition', 'sports_nutrition', 'fat_loss'],
  },
  {
    id: 'soya_chunks',
    name: 'High-Protein Soya Chunks',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: '52% biological protein density with zero cholesterol and high potassium',
    tags: ['muscle_gain', 'vegetarian', 'strength', 'weight_gain', 'fitness'],
  },
  {
    id: 'edamame',
    name: 'Steamed Edamame Pods',
    category: 'proteins',
    categoryLabel: 'Proteins & Pulses',
    clinicalAction: 'Intact legume isoflavones and intact cell wall fiber for microbiome fuel',
    tags: ['pcos', 'metabolic', 'fitness', 'weight_loss'],
  },

  // 3. HEALING VEGETABLES & GREENS
  {
    id: 'ash_gourd',
    name: 'Ash Gourd (Winter Melon / Safed Petha)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Supreme alkalizer; coats gastrointestinal mucosal walls and lowers body heat',
    tags: ['gut_cleanse', 'gerd', 'hypertension', 'kidney_diseases', 'fat_loss', 'detox'],
  },
  {
    id: 'bottle_gourd',
    name: 'Bottle Gourd (Lauki / Doodhi)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: '96% bio-water content with soluble mucilage easing hepatic and renal strain',
    tags: ['fatty_liver', 'kidney_diseases', 'hypertension', 'gerd', 'soft_diet', 'weight_loss'],
  },
  {
    id: 'bitter_gourd',
    name: 'Bitter Gourd (Karela)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Charantin, vicine, and polypeptide-p directly mimic insulin action',
    tags: ['diabetes', 'metabolic', 'pcos', 'obesity', 'lipid_disorders'],
  },
  {
    id: 'palak',
    name: 'Fresh Spinach (Palak)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Dietary nitrates convert to nitric oxide, reducing arterial systolic pressure',
    tags: ['hypertension', 'cardiovascular', 'endurance', 'performance', 'liver'],
  },
  {
    id: 'methi_leaves',
    name: 'Fenugreek Leaves (Methi)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Galactomannan and 4-hydroxyisoleucine stimulate pancreatic beta-cell insulin',
    tags: ['diabetes', 'metabolic', 'cholesterol', 'pcos', 'weight_loss'],
  },
  {
    id: 'moringa',
    name: 'Drumstick Leaves (Moringa)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Contains 7x vitamin C of oranges, quercetin and chlorogenic acid for vessels',
    tags: ['hypertension', 'autoimmune', 'cancer', 'anemia', 'longevity', 'fitness'],
  },
  {
    id: 'zucchini',
    name: 'Green Zucchini',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Low FODMAP, non-fermenting soluble pectin for irritated enteric linings',
    tags: ['gut_cleanse', 'gerd', 'digestive', 'soft_diet', 'fat_loss'],
  },
  {
    id: 'ridge_gourd',
    name: 'Ridge Gourd (Turai / Peerkangai)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Cooling digestive tonic, low calorie density with gentle bowel-moving cellulose',
    tags: ['gut_cleanse', 'fatty_liver', 'diabetes', 'gerd', 'kidney_diseases'],
  },
  {
    id: 'broccoli',
    name: 'Steamed Broccoli Florets',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Sulforaphane activates Nrf2 pathway for phase II hepatic detoxification',
    tags: ['cancer', 'fatty_liver', 'autoimmune', 'body_recomposition', 'fitness'],
  },
  {
    id: 'cucumber',
    name: 'Fresh Crisp Cucumber',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Hydrating cellular silica and caffeic acid preventing water retention',
    tags: ['hypertension', 'fat_loss', 'gout', 'hydration', 'detox'],
  },
  {
    id: 'raw_papaya',
    name: 'Raw Green Papaya',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Papain proteolytic enzyme dissolves protein debris in gastrointestinal lumen',
    tags: ['digestive', 'gut_cleanse', 'cancer', 'autoimmune', 'pcos'],
  },
  {
    id: 'ivy_gourd',
    name: 'Ivy Gourd (Kundru / Tindora)',
    category: 'vegetables',
    categoryLabel: 'Vegetables & Greens',
    clinicalAction: 'Clinically proven to reduce postprandial glucose via hepatic enzyme inhibition',
    tags: ['diabetes', 'metabolic', 'fat_loss', 'obesity'],
  },

  // 4. SEEDS, NUTS & HEALTHY FATS
  {
    id: 'walnuts',
    name: 'Raw Unroasted Walnuts',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'High alpha-linolenic acid (ALA) and polyphenols preserving endothelial elasticity',
    tags: ['cardiovascular', 'neurological', 'lipid_disorders', 'diabetes', 'longevity'],
  },
  {
    id: 'almonds',
    name: 'Soaked & Peeled Almonds',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Vitamin E alpha-tocopherol neutralizes vascular LDL oxidation',
    tags: ['cardiovascular', 'diabetes', 'fitness', 'skin_health', 'performance'],
  },
  {
    id: 'flaxseeds',
    name: 'Ground Roasted Flaxseeds',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Secoisolariciresinol diglucoside (SDG) lignans bind excess estrogen and bile',
    tags: ['pcos', 'cholesterol', 'hypertension', 'cancer', 'constipation'],
  },
  {
    id: 'chia_seeds',
    name: 'Soaked Chia Seeds',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Hydrophilic gel forms a viscous barrier in small intestine, smoothing glucose spikes',
    tags: ['diabetes', 'gut_cleanse', 'hydration', 'endurance', 'weight_loss'],
  },
  {
    id: 'pumpkin_seeds',
    name: 'Raw Pumpkin Seeds',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'High organic zinc and tryptophan supporting immune repair and restorative sleep',
    tags: ['performance', 'recovery', 'pcos', 'muscle_gain', 'metabolic'],
  },
  {
    id: 'a2_ghee',
    name: 'Pure Desi Cow A2 Ghee (Moderate)',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Short-chain butyrate directly nourishes colonocyte enterocyte junctions',
    tags: ['gut_cleanse', 'autoimmune', 'ayurvedic', 'energy', 'bland_diet'],
  },
  {
    id: 'cold_pressed_mustard_oil',
    name: 'Cold-Pressed Mustard Oil',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Ideal 1:1 Omega-6 to Omega-3 ratio; allyl isothiocyanate inhibits microbial overgrowth',
    tags: ['cardiovascular', 'traditional', 'gut_health', 'metabolic'],
  },
  {
    id: 'extra_virgin_olive_oil',
    name: 'Extra Virgin Olive Oil',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Oleocanthal acts as a natural COX-1 and COX-2 anti-inflammatory agent',
    tags: ['cardiovascular', 'autoimmune', 'cancer', 'longevity', 'hypertension'],
  },
  {
    id: 'avocado',
    name: 'Fresh Avocado Mash',
    category: 'fatsAndSeeds',
    categoryLabel: 'Seeds, Nuts & Healthy Fats',
    clinicalAction: 'Monounsaturated oleic acid and potassium assisting systemic fluid balance',
    tags: ['hypertension', 'keto', 'pcos', 'weight_loss', 'cardiovascular'],
  },

  // 5. BIOACTIVE SPICES & BOTANICALS
  {
    id: 'ceylon_cinnamon',
    name: 'Ceylon Cinnamon (Dalchini)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Methylhydroxychalcone polymer stimulates cellular glucose uptake',
    tags: ['diabetes', 'pcos', 'metabolic', 'weight_loss', 'lipid_disorders'],
  },
  {
    id: 'fenugreek_seeds',
    name: 'Fenugreek Seeds (Methi Dana)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Trigonelline and diosgenin lower fasting glucose and blood triglycerides',
    tags: ['diabetes', 'cholesterol', 'pcos', 'fatty_liver', 'metabolic'],
  },
  {
    id: 'cumin_jeera',
    name: 'Roasted Cumin (Jeera)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Cuminaldehyde stimulates pancreatic lipase and bile acid secretion',
    tags: ['digestive', 'gut_cleanse', 'gerd', 'metabolic', 'fat_loss'],
  },
  {
    id: 'ajwain',
    name: 'Carom Seeds (Ajwain)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Potent thymol compound disperses trapped intestinal gas and abdominal spasms',
    tags: ['gut_cleanse', 'gerd', 'digestive', 'bland_diet', 'colic'],
  },
  {
    id: 'fresh_amla',
    name: 'Fresh Indian Gooseberry (Amla)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Tannoid-bound ascorbic acid retains heat stability and scavenges reactive oxygen species',
    tags: ['fatty_liver', 'cardiovascular', 'diabetes', 'longevity', 'anemia', 'autoimmune'],
  },
  {
    id: 'fresh_ginger',
    name: 'Fresh Ginger Root (Adrak)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Gingerols and shogaols accelerate gastric emptying and attenuate nausea',
    tags: ['cancer', 'gerd', 'digestive', 'gut_cleanse', 'performance', 'arthritis'],
  },
  {
    id: 'pure_turmeric',
    name: 'Pure Turmeric (Curcumin) + Black Pepper',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Piperine increases curcumin bioavailability by 2000% to suppress cytokine storm',
    tags: ['autoimmune', 'cancer', 'arthritis', 'fatty_liver', 'recovery', 'cardiovascular'],
  },
  {
    id: 'tulsi',
    name: 'Holy Basil (Tulsi)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Eugenol and ursolic acid lower nocturnal cortisol and support respiratory immunity',
    tags: ['respiratory', 'stress', 'autoimmune', 'diabetes', 'longevity'],
  },
  {
    id: 'curry_leaves',
    name: 'Fresh Curry Leaves (Kadi Patta)',
    category: 'spicesAndHerbs',
    categoryLabel: 'Therapeutic Spices & Botanicals',
    clinicalAction: 'Mahanimbine carbazole alkaloid lowers blood glucose and neutralizes LDL oxidation',
    tags: ['diabetes', 'lipid_disorders', 'liver', 'hair_health', 'hypertension'],
  },
];

// Curated helper returning condition-specific ingredients
export function getConditionSpecificIngredients(
  conditionName: string,
  domainType: string
): {
  recommendedIngredients: TherapeuticIngredient[];
  foodsToInclude: string;
  foodsToAvoid: string;
} {
  const norm = conditionName.toLowerCase().trim();

  // Match tags
  let matchedTags: string[] = [];
  if (norm.includes('diabet')) matchedTags = ['diabetes', 'metabolic'];
  else if (norm.includes('hyperten') || norm.includes('blood pressure')) matchedTags = ['hypertension', 'cardiovascular'];
  else if (norm.includes('cardio') || norm.includes('heart')) matchedTags = ['cardiovascular', 'lipid_disorders'];
  else if (norm.includes('pcos') || norm.includes('pcod')) matchedTags = ['pcos', 'metabolic', 'weight_loss'];
  else if (norm.includes('kidney') || norm.includes('renal') || norm.includes('ckd')) matchedTags = ['kidney_diseases', 'kidney_safe'];
  else if (norm.includes('liver') || norm.includes('fatty')) matchedTags = ['fatty_liver', 'liver'];
  else if (norm.includes('gut') || norm.includes('cleanse') || norm.includes('digest') || norm.includes('ibs')) matchedTags = ['gut_cleanse', 'digestive', 'gerd'];
  else if (norm.includes('cancer') || norm.includes('oncol')) matchedTags = ['cancer', 'autoimmune'];
  else if (norm.includes('autoimmun') || norm.includes('arthrit')) matchedTags = ['autoimmune', 'arthritis'];
  else if (norm.includes('fat loss') || norm.includes('weight loss') || norm.includes('obesity')) matchedTags = ['fat_loss', 'weight_loss', 'metabolic'];
  else if (norm.includes('muscle') || norm.includes('strength') || norm.includes('hypertrophy')) matchedTags = ['muscle_gain', 'strength', 'performance'];
  else if (norm.includes('endurance') || norm.includes('sports') || norm.includes('athlete')) matchedTags = ['endurance', 'performance', 'sports_nutrition'];
  else if (norm.includes('gout') || norm.includes('uric')) matchedTags = ['gout', 'kidney_safe'];
  else if (domainType === 'performance') matchedTags = ['performance', 'strength', 'endurance'];
  else if (domainType === 'fitness') matchedTags = ['fitness', 'fat_loss', 'muscle_gain'];
  else matchedTags = ['diabetes', 'cardiovascular', 'gut_cleanse'];

  // Filter ingredients that match these tags or domain
  const relevant = MASTER_INGREDIENT_CATALOG.filter((ing) =>
    ing.tags.some((t) => matchedTags.includes(t))
  );

  // If list is small, supplement with balanced staples
  const allIngredients =
    relevant.length >= 10
      ? relevant
      : [
          ...relevant,
          ...MASTER_INGREDIENT_CATALOG.filter((i) => !relevant.some((r) => r.id === i.id)).slice(
            0,
            15 - relevant.length
          ),
        ];

  return {
    recommendedIngredients: allIngredients,
    foodsToInclude:
      'Ancient millets (foxtail, barnyard, little), sprouted moong, unrefined cold-pressed oils, walnuts, flaxseeds, seasonal colorful vegetables (ash gourd, lauki, karela), amla, ginger, cinnamon',
    foodsToAvoid:
      'Ultra-processed foods, refined maida, sugar, high-fructose corn syrup, trans fats, deep-fried snacks, excessive sodium, artificial preservatives',
  };
}

// Helper to detect which ingredients exist in a given recipe
export function extractIngredientsFromRecipe(
  recipeName: string,
  allIngredients: TherapeuticIngredient[]
): TherapeuticIngredient[] {
  const norm = recipeName.toLowerCase();
  const matched: TherapeuticIngredient[] = [];

  for (const ing of allIngredients) {
    const ingNameLower = ing.name.toLowerCase();
    // Keywords
    const words = ingNameLower.split(/[\s,()/-]+/).filter((w) => w.length > 3);
    const hasMatch = words.some((word) => norm.includes(word));
    if (hasMatch) {
      matched.push(ing);
    }
  }

  return matched;
}
