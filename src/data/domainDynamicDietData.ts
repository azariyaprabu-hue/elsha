export interface DomainIngredientItem {
  id: string;
  name: string;
  category: 'Cereals & Millets' | 'Proteins & Pulses' | 'Vegetables & Greens' | 'Fruits' | 'Nuts & Healthy Fats';
  gi: 'Low' | 'Medium' | 'High' | 'Zero';
  status: 'Recommended' | 'Caution' | 'Restricted';
  clinicalBenefit: string;
  portionGuide: string;
}

export interface DomainRecipeItem {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack / Beverage';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  gi: 'Low GI' | 'Medium GI' | 'Zero GI';
  ingredients: string;
  clinicalPrepInstructions: string;
}

export interface DomainAyurSiddhaItem {
  id: string;
  herbName: string;
  botanicalOrTraditionalName: string;
  action: string;
  clinicalIndication: string;
  dosageAndTiming: string;
}

export interface DomainMealSlotBlueprint {
  slotId: string;
  slotName: string;
  timing: string;
  frequency: string;
  recommendedPrep: string;
  therapeuticRationale: string;
}

export interface ClinicalDietDomainProfile {
  domainId: string;
  domainName: string;
  tagline: string;
  clinicalIndications: string[];
  macroRatio: { carbs: number; protein: number; fat: number };
  dailyCalorieTarget: number;
  ingredients: DomainIngredientItem[];
  recipes: DomainRecipeItem[];
  ayurSiddha: DomainAyurSiddhaItem[];
  mealSlots: DomainMealSlotBlueprint[];
}

export const DYNAMIC_DOMAIN_PROFILES: Record<string, ClinicalDietDomainProfile> = {
  elimination: {
    domainId: 'elimination',
    domainName: 'Gut Cleanse & Elimination Diet',
    tagline: 'Systematic mucosal healing, dysbiosis resolution & 12-day sequential reintroduction',
    clinicalIndications: ['Leaky Gut & Dysbiosis', 'Food Intolerances & Histamine Flares', 'Autoimmune Reversal', 'IBS & Bloating'],
    macroRatio: { carbs: 50, protein: 20, fat: 30 },
    dailyCalorieTarget: 1450,
    ingredients: [
      { id: 'el-1', name: 'Hand-pounded Mappillai Samba Red Rice', category: 'Cereals & Millets', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Anthocyanin-rich, prebiotic polyphenols nourish Akkermansia muciniphila.', portionGuide: '100g cooked' },
      { id: 'el-2', name: 'Barnyard Millet (Kuthiraivali)', category: 'Cereals & Millets', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Highest digestible fiber, ultra-low allergenicity.', portionGuide: '90g cooked' },
      { id: 'el-3', name: 'Sprouted Yellow Moong Dal (Split)', category: 'Proteins & Pulses', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Phytic acid reduced via soaking; produces anti-inflammatory butyrate.', portionGuide: '1 cup cooked' },
      { id: 'el-4', name: 'Ash Gourd (Pooshnikkai)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Alkalizing, cools Pitta, heals eroded gastric mucosa.', portionGuide: '150g steamed/soup' },
      { id: 'el-5', name: 'Moringa Leaves (Murungai)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Quercetin & chlorogenic acid seal tight junctions.', portionGuide: '1 cup cooked' },
      { id: 'el-6', name: 'Desi A2 Bilona Cow Ghee', category: 'Nuts & Healthy Fats', gi: 'Zero', status: 'Recommended', clinicalBenefit: 'Pure source of Butyric acid, heals enterocyte brush borders.', portionGuide: '5ml - 10ml daily' },
      { id: 'el-7', name: 'Refined Wheat & Maida', category: 'Cereals & Millets', gi: 'High', status: 'Restricted', clinicalBenefit: 'Zonulin trigger; increases intestinal mucosal permeability.', portionGuide: 'Strictly 0g' },
      { id: 'el-8', name: 'Processed Dairy / Cheese', category: 'Proteins & Pulses', gi: 'Medium', status: 'Restricted', clinicalBenefit: 'Casein A1 and lactose trigger mucosal inflammation.', portionGuide: 'Restricted during Cleanse' },
    ],
    recipes: [
      { id: 'el-r1', name: 'Soaked Red Rice Congee with Cumin & Ghee', mealType: 'Breakfast', calories: 210, protein: 5, carbs: 38, fat: 5, fiber: 6, gi: 'Low GI', ingredients: '50g Red Rice, 1/2 tsp Jeera, 1 tsp A2 Ghee, rock salt, ginger slivers.', clinicalPrepInstructions: 'Slow pressure-cooked into velvety congee for zero digestive strain.' },
      { id: 'el-r2', name: 'Steamed Ash Gourd & Split Moong Kootu', mealType: 'Lunch', calories: 240, protein: 11, carbs: 32, fat: 4, fiber: 8, gi: 'Low GI', ingredients: '150g Ash gourd cubes, 40g yellow moong dal, curry leaves, hing, turmeric.', clinicalPrepInstructions: 'Steamed without chili peppers; tempered gently with cumin and fresh curry leaves.' },
      { id: 'el-r3', name: 'Barnyard Millet Upma with Steamed Beans', mealType: 'Dinner', calories: 230, protein: 7, carbs: 36, fat: 4, fiber: 7, gi: 'Low GI', ingredients: '50g Kuthiraivali, french beans, ginger, mustard seeds, pinch of rock salt.', clinicalPrepInstructions: 'Light evening meal taken before 7:30 PM to facilitate overnight autophagy.' },
      { id: 'el-r4', name: 'Warm Licorice & Coriander Seed Infusion', mealType: 'Snack / Beverage', calories: 15, protein: 0, carbs: 3, fat: 0, fiber: 0.5, gi: 'Zero GI', ingredients: '1 tsp Coriander seeds, 2g Yashtimadhu, crushed dry ginger in 250ml water.', clinicalPrepInstructions: 'Boiled down to half volume and sipped lukewarm between meals.' }
    ],
    ayurSiddha: [
      { id: 'as-el1', herbName: 'Triphala Churna (Amalaki, Bibhitaki, Haritaki)', botanicalOrTraditionalName: 'Terminalia chebula complex', action: 'Mild laxative, antioxidant tonification & colon mucosa rejuvenator', clinicalIndication: 'Nocturnal detox & chronic constipation', dosageAndTiming: '3g with lukewarm water at bedtime' },
      { id: 'as-el2', herbName: 'Vilvam Leaf Decoction (Bael)', botanicalOrTraditionalName: 'Aegle marmelos', action: 'Astringent, mucosal healer & IBS antispasmodic', clinicalIndication: 'Loose stools and visceral gut hypersensitivity', dosageAndTiming: '30ml decoction on empty stomach' },
      { id: 'as-el3', herbName: 'Jeeraka Rasam (Cuminum cyminum)', botanicalOrTraditionalName: 'Deepana-Pachana formulation', action: 'Kindles digestive Agni without aggravating Pitta heat', clinicalIndication: 'Post-prandial heaviness and gas', dosageAndTiming: '1 small cup with midday meal' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '5:00 AM', frequency: 'Daily', recommendedPrep: '200ml Lukewarm water with 5g A2 Bilona Cow Ghee', therapeuticRationale: 'Butyric acid lubricates mucosal lining and triggers bile flow.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '6:15 AM', frequency: 'On Activity Days', recommendedPrep: 'Saffron & holy basil (Tulsi) infused warm water + 2 soaked walnuts', therapeuticRationale: 'Anti-inflammatory vascular priming without GI distress.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '6:45 AM', frequency: 'On Activity Days', recommendedPrep: 'Tender coconut water or Himalayan pink salt electrolyte sip', therapeuticRationale: 'Natural potassium replenishment and hydration.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '7:45 AM', frequency: 'On Activity Days', recommendedPrep: 'Sprouted moong broth with cumin & pinch of black pepper', therapeuticRationale: 'Rapid amino acid uptake with minimal digestion effort.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '10:30 AM', frequency: 'Daily', recommendedPrep: '100g Stewed apple with Ceylon cinnamon', therapeuticRationale: 'Pectin prebiotic fiber feeds bifidobacteria.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:00 PM', frequency: 'Daily', recommendedPrep: 'Hand-pounded red rice + Steamed Ash Gourd Kootu + Yellow Moong Dal', therapeuticRationale: 'Balanced glycemic load with alkaline vegetable base.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '4:30 PM', frequency: 'Daily', recommendedPrep: 'Moringa leaf clear soup or roasted foxnuts (Makhana)', therapeuticRationale: 'Micronutrient dense, suppresses cortisol spikes.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:30 PM', frequency: 'Daily', recommendedPrep: 'Barnyard millet vegetable khichdi + Steamed bottle gourd', therapeuticRationale: 'High water content promotes rapid gastric emptying before sleep.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Warm water with 2g Triphala & 2 drops castor oil (optional)', therapeuticRationale: 'Clears endotoxins and regulates morning bowel transit.' },
    ]
  },

  low_carbs: {
    domainId: 'low_carbs',
    domainName: 'Low Carbs & Diabetes Reversal Diet',
    tagline: 'Precision glycemic blunting, insulin desensitization & visceral lipid mobilization',
    clinicalIndications: ['Type 2 Diabetes Mellitus', 'Prediabetes & Acanthosis Nigricans', 'PCOS & Anovulatory Cycles', 'Metabolic Syndrome'],
    macroRatio: { carbs: 25, protein: 35, fat: 40 },
    dailyCalorieTarget: 1500,
    ingredients: [
      { id: 'lc-1', name: 'Foxtail Millet (Tenai)', category: 'Cereals & Millets', gi: 'Low', status: 'Recommended', clinicalBenefit: 'High dietary fiber blunts post-prandial glycemic excursions.', portionGuide: '70g cooked' },
      { id: 'lc-2', name: 'Whole Horsegram (Kollu)', category: 'Proteins & Pulses', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Highest phenolic amylase-inhibiting content for glucose management.', portionGuide: '1 small bowl' },
      { id: 'lc-3', name: 'Paneer (A2 Fresh Cottage Cheese) / Egg Whites', category: 'Proteins & Pulses', gi: 'Zero', status: 'Recommended', clinicalBenefit: 'Pure protein and essential amino acids; zero glycemic impact.', portionGuide: '80g paneer or 3 whites' },
      { id: 'lc-4', name: 'Bitter Gourd (Pavakkai)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Contains Charantin & Polypeptide-p with plant-insulin activity.', portionGuide: '100g stir-fry' },
      { id: 'lc-5', name: 'Fenugreek Leaves (Vendhaya Keerai)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: '4-hydroxyisoleucine stimulates glucose-dependent insulin secretion.', portionGuide: '1 cup cooked' },
      { id: 'lc-6', name: 'Cold-Pressed Virgin Sesame & Mustard Oil', category: 'Nuts & Healthy Fats', gi: 'Zero', status: 'Recommended', clinicalBenefit: 'MUFA & PUFA balance enhances cell membrane insulin receptor affinity.', portionGuide: '10ml daily' },
      { id: 'lc-7', name: 'White Polished Ponni Rice', category: 'Cereals & Millets', gi: 'High', status: 'Restricted', clinicalBenefit: 'Rapidly hydrolyzes to pure maltose and glucose; causes beta-cell fatigue.', portionGuide: 'Strictly avoid' },
      { id: 'lc-8', name: 'Sugary Bakery / Biscuits / Jaggery', category: 'Cereals & Millets', gi: 'High', status: 'Restricted', clinicalBenefit: 'High glycemic spikes trigger severe hyperinsulinemia.', portionGuide: '0g permitted' },
    ],
    recipes: [
      { id: 'lc-r1', name: 'Sprouted Green Moong & Methi Chilla (2 pcs)', mealType: 'Breakfast', calories: 230, protein: 15, carbs: 26, fat: 5, fiber: 8, gi: 'Low GI', ingredients: 'Sprouted moong paste, chopped fresh methi leaves, green chili, ginger, cumin.', clinicalPrepInstructions: 'Tawa roasted with 3ml ghee. High protein to sustain satiety for 4 hours.' },
      { id: 'lc-r2', name: 'Paneer & Ivy Gourd (Kovakkai) Stir-Fry with Dal', mealType: 'Lunch', calories: 340, protein: 19, carbs: 22, fat: 12, fiber: 9, gi: 'Low GI', ingredients: '80g Fresh paneer cubes, 100g kovakkai, 1/2 cup cooked horsegram dal.', clinicalPrepInstructions: 'Sauteed with mustard seeds, curry leaves, and turmeric. Negligible glucose rise.' },
      { id: 'lc-r3', name: 'Steamed Egg White / Tofu Bhurji with Palak Keerai', mealType: 'Dinner', calories: 220, protein: 18, carbs: 12, fat: 6, fiber: 6, gi: 'Low GI', ingredients: '3 Boiled egg whites or 100g firm tofu, 150g chopped palak, onion, cumin.', clinicalPrepInstructions: 'Light dinner taken 3 hours before sleep to prevent dawn phenomenon spikes.' },
      { id: 'lc-r4', name: 'Cinnamon & Jamun Seed Powder Infusion', mealType: 'Snack / Beverage', calories: 10, protein: 0, carbs: 2, fat: 0, fiber: 1, gi: 'Zero GI', ingredients: '1/2 tsp Ceylon cinnamon, 1g Jamun seed powder steeped in warm water.', clinicalPrepInstructions: 'Drank 15 minutes prior to major meals to downregulate postprandial glucose.' }
    ],
    ayurSiddha: [
      { id: 'as-lc1', herbName: 'Njaval Kottai (Jamun Seed Powder)', botanicalOrTraditionalName: 'Syzygium cumini', action: 'Slows intestinal starch breakdown into sugars (Alpha-glucosidase inhibition)', clinicalIndication: 'High post-prandial glycemic spikes', dosageAndTiming: '2g before lunch with warm water' },
      { id: 'as-lc2', herbName: 'Sirukurinjan (Gymnema Sylvestre / Madhunashini)', botanicalOrTraditionalName: 'Gurmar - The Sugar Destroyer', action: 'Temporarily numbs sweet receptors and stimulates pancreatic beta-cells', clinicalIndication: 'Sugar cravings & elevated fasting glucose', dosageAndTiming: '1g extract morning on empty stomach' },
      { id: 'as-lc3', herbName: 'Vendhayam (Soaked Fenugreek Seeds)', botanicalOrTraditionalName: 'Trigonella foenum-graecum', action: 'Mucilaginous galactomannan delays carbohydrate absorption', clinicalIndication: 'Insulin resistance & elevated HbA1c', dosageAndTiming: '1 tsp seeds soaked overnight, chewed at dawn' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '5:00 AM', frequency: 'Daily', recommendedPrep: 'Overnight soaked fenugreek water with chewed seeds + 2 Brazil nuts', therapeuticRationale: 'Lowers dawn glucose surge and provides selenium for thyroid support.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '6:15 AM', frequency: 'Daily (5x/week)', recommendedPrep: 'Black coffee or green tea + 4 soaked peeled almonds', therapeuticRationale: 'Caffeine mobilizes free fatty acids during training.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '6:50 AM', frequency: 'Daily (5x/week)', recommendedPrep: 'Cold water with lime juice, Himalayan pink salt & chia seeds', therapeuticRationale: 'Sustained electrolyte balance without caloric load.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '7:45 AM', frequency: 'Daily (5x/week)', recommendedPrep: '25g Whey Isolate or 3 Boiled Egg Whites with black pepper', therapeuticRationale: 'Leucine stimulates muscle protein synthesis and GLUT4 translocation.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: 'Sprouted horsegram (Kollu) sundal with grated fresh coconut', therapeuticRationale: 'Sustained satiety and sustained polyphenol delivery.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:30 PM', frequency: 'Daily', recommendedPrep: 'Raw Cucumber & Tomato Salad first, then Paneer/Chicken + Palak Dal + 1 Ragi Roti', therapeuticRationale: 'Fiber-first meal sequencing blunts glucose peak by 35%.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '5:00 PM', frequency: 'Daily', recommendedPrep: 'Roasted chana (25g) + Hot green tea with cinnamon stick', therapeuticRationale: 'Prevents evening energy crash and junk cravings.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:30 PM', frequency: 'Daily', recommendedPrep: 'Methi Moong Chilla (2 pcs) + Steamed Bottle Gourd Kootu', therapeuticRationale: 'Early low-carb dinner ensures nocturnal fatty acid oxidation.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Warm water with pinch of nutmeg (Jaiphal) & turmeric', therapeuticRationale: 'Promotes deep restorative delta sleep and nocturnal cellular repair.' },
    ]
  },

  balanced: {
    domainId: 'balanced',
    domainName: 'Balanced ICMR-NIN Standard Diet',
    tagline: 'Scientific macronutrient harmony, micronutrient adequacy & vitality preservation',
    clinicalIndications: ['General Health & Wellness', 'Metabolic Maintenance', 'Longevity Protocol', 'Weight Equilibrium'],
    macroRatio: { carbs: 55, protein: 20, fat: 25 },
    dailyCalorieTarget: 1750,
    ingredients: [
      { id: 'b-1', name: 'Whole Pearl Millet (Bajra) & Ragi', category: 'Cereals & Millets', gi: 'Medium', status: 'Recommended', clinicalBenefit: 'Balanced complex carbohydrates with high calcium and iron.', portionGuide: '120g cooked' },
      { id: 'b-2', name: 'Mixed Whole Pulses (Toor, Moong, Chana)', category: 'Proteins & Pulses', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Complete vegetarian amino acid profile when paired with cereals.', portionGuide: '1.5 cups cooked' },
      { id: 'b-3', name: 'Rainbow Vegetables (Carrot, Beans, Pumpkin)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Broad spectrum carotenoids, flavonoids and fiber diversity.', portionGuide: '250g daily' },
      { id: 'b-4', name: 'Curd / Buttermilk (Probiotic)', category: 'Proteins & Pulses', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Natural lactic acid bacteria supporting diverse microbiome flora.', portionGuide: '200ml daily' },
      { id: 'b-5', name: 'Walnuts, Almonds & Flaxseeds', category: 'Nuts & Healthy Fats', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Essential Alpha-Linolenic Acid (ALA) omega-3 and vitamin E.', portionGuide: '20g daily' },
      { id: 'b-6', name: 'Ultra-Processed Fast Foods & High-Fructose Syrups', category: 'Cereals & Millets', gi: 'High', status: 'Restricted', clinicalBenefit: 'Empty calories and endocrine disrupting additives.', portionGuide: 'Avoid' }
    ],
    recipes: [
      { id: 'b-r1', name: 'Traditional Ragi Idli with Vegetable Sambar', mealType: 'Breakfast', calories: 280, protein: 11, carbs: 48, fat: 4, fiber: 7, gi: 'Medium GI', ingredients: 'Fermented ragi-urad batter, drumstick, tomato, shallots, coriander.', clinicalPrepInstructions: 'Steamed idlis with nutrient-dense lentil vegetable broth.' },
      { id: 'b-r2', name: 'Hand-Pounded Brown Rice, Keerai Kootu & Curd', mealType: 'Lunch', calories: 420, protein: 16, carbs: 65, fat: 8, fiber: 11, gi: 'Low GI', ingredients: '100g Brown rice, araikeerai kootu, 1 cup probiotic curd, cucumber salad.', clinicalPrepInstructions: 'Well-proportioned ICMR plate: 50% vegetables, 25% grain, 25% protein.' },
      { id: 'b-r3', name: 'Millet Phulka (2 pcs) with Mixed Veg Paneer Subzi', mealType: 'Dinner', calories: 310, protein: 14, carbs: 42, fat: 7, fiber: 8, gi: 'Low GI', ingredients: 'Jowar or multigrain flour, capsicum, carrot, peas, 40g fresh paneer.', clinicalPrepInstructions: 'Freshly rolled dry tawa phulkas with light spiced vegetable curry.' },
      { id: 'b-r4', name: 'Fresh Tender Coconut Water with Flesh', mealType: 'Snack / Beverage', calories: 60, protein: 1.5, carbs: 12, fat: 1, fiber: 2, gi: 'Low GI', ingredients: 'Whole tender coconut water and tender malai.', clinicalPrepInstructions: 'Consumed fresh around 11:30 AM as a natural electrolyte beverage.' }
    ],
    ayurSiddha: [
      { id: 'as-b1', herbName: 'Amla Rasayana (Indian Gooseberry)', botanicalOrTraditionalName: 'Phyllanthus emblica', action: 'Supreme source of stable natural Vitamin C & immune rejuvenation', clinicalIndication: 'Oxidative stress & collagen maintenance', dosageAndTiming: '1 fresh amla or 5g powder daily' },
      { id: 'as-b2', herbName: 'Tulsi & Cardamom Tea', botanicalOrTraditionalName: 'Ocimum sanctum & Elettaria cardamomum', action: 'Adaptogen balancing Vata, Pitta, and Kapha', clinicalIndication: 'Mental clarity and stress buffering', dosageAndTiming: '1 warm cup in early evening' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '5:30 AM', frequency: 'Daily', recommendedPrep: 'Lukewarm water with lemon juice & 1 tsp honey + 5 soaked almonds', therapeuticRationale: 'Gentle GI flush and peristalsis stimulation.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '6:30 AM', frequency: 'Workout Days (4-5x/wk)', recommendedPrep: '1 Small Banana or 2 Medjool Dates', therapeuticRationale: 'Readily available glycogen for morning exercise.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:00 AM', frequency: 'Workout Days', recommendedPrep: 'Water with pinch of pink salt and lemon', therapeuticRationale: 'Hydration and muscle cramp prevention.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:00 AM', frequency: 'Workout Days', recommendedPrep: 'Sprouted green gram sundal or 2 boiled eggs', therapeuticRationale: 'Replenishes amino acid pool and supports recovery.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: 'Seasonal low-GI fresh fruit (Papaya, Guava, or Pomegranate)', therapeuticRationale: 'Delivers active enzymes and bioflavonoids.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:30 PM', frequency: 'Daily', recommendedPrep: 'ICMR Balanced Plate: Brown Rice/Millet + Sambar + Keerai Poriyal + Curd', therapeuticRationale: 'Golden ratio macronutrient delivery.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '5:00 PM', frequency: 'Daily', recommendedPrep: 'Roasted Makhana (Foxnuts) + Ginger cardamom tea', therapeuticRationale: 'Light crunchy snack preventing overeating at dinner.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '8:00 PM', frequency: 'Daily', recommendedPrep: 'Multigrain Phulka (2) + Dal Tadka + Steamed Lauki', therapeuticRationale: 'Easily assimilated night meal.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '10:00 PM', frequency: 'Daily', recommendedPrep: '150ml Warm A2 milk with a pinch of turmeric and black pepper', therapeuticRationale: 'Tryptophan supports serotonin and natural melatonin synthesis.' }
    ]
  },

  cardiac: {
    domainId: 'cardiac',
    domainName: 'Cardiac & Cardioprotective Diet',
    tagline: 'Endothelial restoration, LDL-P reduction, soluble beta-glucans & omega-3 synergy',
    clinicalIndications: ['Coronary Artery Disease', 'Dyslipidemia (High LDL / ApoB)', 'Elevated hs-CRP & Atherosclerosis', 'Post-Stent / CABG'],
    macroRatio: { carbs: 50, protein: 25, fat: 25 },
    dailyCalorieTarget: 1550,
    ingredients: [
      { id: 'c-1', name: 'Steel-Cut Oats & Barley (Beta-Glucan)', category: 'Cereals & Millets', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Viscous fiber binds bile acids, clearing circulating LDL particles.', portionGuide: '60g cooked' },
      { id: 'c-2', name: 'Roasted Flaxseed Powder & Walnuts', category: 'Nuts & Healthy Fats', gi: 'Low', status: 'Recommended', clinicalBenefit: 'ALA Omega-3 reduces endothelial vascular inflammation and platelet aggregation.', portionGuide: '15g flax + 4 walnuts' },
      { id: 'c-3', name: 'Garlic (Raw Allium Sativum)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Allicin releases H2S gas, relaxing vascular smooth muscle.', portionGuide: '1-2 crushed cloves' },
      { id: 'c-4', name: 'Trans-Fat Fried Foods / Hydrogenated Vanaspati', category: 'Nuts & Healthy Fats', gi: 'High', status: 'Restricted', clinicalBenefit: 'Direct atherogenic agent; inflames arterial endothelium.', portionGuide: 'Strictly 0g' }
    ],
    recipes: [
      { id: 'c-r1', name: 'Steel-Cut Oats with Ground Flaxseed & Berries', mealType: 'Breakfast', calories: 250, protein: 8, carbs: 38, fat: 6, fiber: 9, gi: 'Low GI', ingredients: 'Steel-cut oats, 1 tbsp ground flaxseeds, pomegranate pearls, cinnamon.', clinicalPrepInstructions: 'Simmered in water with cinnamon; seeds added after cooking.' },
      { id: 'c-r2', name: 'Garlic-Infused Spinach Dal with Millet', mealType: 'Lunch', calories: 360, protein: 17, carbs: 55, fat: 6, fiber: 12, gi: 'Low GI', ingredients: 'Toor dal, palak, 3 crushed garlic cloves, cumin, pinch of turmeric.', clinicalPrepInstructions: 'Heart-healthy garlic added at end to preserve active allicin.' }
    ],
    ayurSiddha: [
      { id: 'as-c1', herbName: 'Arjuna Bark Powder (Terminalia arjuna)', botanicalOrTraditionalName: 'Hridya Herb', action: 'Inotropic support, strengthens cardiac myofibrils & improves ejection fraction', clinicalIndication: 'Angina, dyslipidemia & heart failure', dosageAndTiming: '3g boiled in 150ml milk/water twice daily' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '5:30 AM', frequency: 'Daily', recommendedPrep: 'Warm water with 1 crushed garlic clove & 1 tsp lemon juice', therapeuticRationale: 'Vascular dilation and arterial cleansing.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '6:30 AM', frequency: 'Daily', recommendedPrep: 'Beetroot juice (50ml) with pinch of rock salt', therapeuticRationale: 'Dietary nitrates promote nitric oxide vasodilation.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:00 AM', frequency: 'Daily', recommendedPrep: 'Hydration water with lemon slice', therapeuticRationale: 'Maintains optimal blood volume.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:00 AM', frequency: 'Daily', recommendedPrep: 'Boiled sprouted moong with pomegranate', therapeuticRationale: 'Polyphenols protect against exercise-induced oxidation.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: '4 Whole walnuts + 1 cup hibiscus tea', therapeuticRationale: 'Anthocyanins lower systolic blood pressure.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:30 PM', frequency: 'Daily', recommendedPrep: 'Barley Khichdi with garlic tadka + Steamed greens', therapeuticRationale: 'High soluble beta-glucan binds dietary cholesterol.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '5:00 PM', frequency: 'Daily', recommendedPrep: 'Roasted soy nuts or boiled edamame', therapeuticRationale: 'Soy isoflavones improve arterial elasticity.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:45 PM', frequency: 'Daily', recommendedPrep: 'Oats vegetable upma with grated pumpkin seeds', therapeuticRationale: 'Light cardiac-protective evening digestion.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:45 PM', frequency: 'Daily', recommendedPrep: 'Warm Arjuna kashayam (decoction)', therapeuticRationale: 'Nocturnal myocardial tonification.' }
    ]
  },

  renal: {
    domainId: 'renal',
    domainName: 'Renal Care Diet (CKD Stage 1-4)',
    tagline: 'Precision control of sodium, potassium, phosphorus & regulated high-BV protein',
    clinicalIndications: ['Chronic Kidney Disease Stage 1-4', 'Elevated Serum Creatinine / BUN', 'Microalbuminuria / Proteinuria', 'Renal Protection'],
    macroRatio: { carbs: 60, protein: 15, fat: 25 },
    dailyCalorieTarget: 1600,
    ingredients: [
      { id: 'rn-1', name: 'Leached Bottle Gourd & Ridge Gourd', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Double-boiled and leached to remove excess potassium ions.', portionGuide: '150g leached' },
      { id: 'rn-2', name: 'Egg White (Pure Albumin)', category: 'Proteins & Pulses', gi: 'Zero', status: 'Recommended', clinicalBenefit: 'Highest biological value (BV 100), minimal phosphorus and zero nitrogen waste.', portionGuide: '2-3 whites' },
      { id: 'rn-3', name: 'Dark Leafy Keerai / Spinach', category: 'Vegetables & Greens', gi: 'Low', status: 'Restricted', clinicalBenefit: 'High potassium and oxalates overload impaired nephrons.', portionGuide: 'Avoid' },
      { id: 'rn-4', name: 'Packaged Colas / Processed Meats', category: 'Nuts & Healthy Fats', gi: 'High', status: 'Restricted', clinicalBenefit: 'Inorganic phosphate additives are 100% absorbed, causing vascular calcification.', portionGuide: 'Strictly 0g' }
    ],
    recipes: [
      { id: 'rn-r1', name: 'Leached Ridge Gourd (Peerkangai) Rice Kanji', mealType: 'Breakfast', calories: 220, protein: 5, carbs: 45, fat: 2, fiber: 4, gi: 'Low GI', ingredients: 'Double-boiled peerkangai cubes, white rice, cumin, hing, no salt or low salt.', clinicalPrepInstructions: 'Vegetables boiled in excess water, water discarded to eliminate 60% potassium.' }
    ],
    ayurSiddha: [
      { id: 'as-rn1', herbName: 'Punarnava (Boerhavia diffusa)', botanicalOrTraditionalName: 'Renal Regenerator', action: 'Mild diuretic, reduces BUN and serum creatinine, protects tubular cells', clinicalIndication: 'Fluid retention & elevated creatinine', dosageAndTiming: '30ml decoction on empty stomach' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '6:00 AM', frequency: 'Daily', recommendedPrep: 'Punarnava decoction (30ml) or lukewarm leached coriander water', therapeuticRationale: 'Gentle renal glomerulus priming.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '7:00 AM', frequency: 'Gentle Walk Days', recommendedPrep: '1 Slice of low-sodium toasted bread with honey', therapeuticRationale: 'Clean quick carbohydrates without mineral load.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:30 AM', frequency: 'Gentle Walk Days', recommendedPrep: 'Measured fluid sip (within daily nephrologist limit)', therapeuticRationale: 'Careful fluid management.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:15 AM', frequency: 'Gentle Walk Days', recommendedPrep: '2 Boiled egg whites (Pure high-BV protein)', therapeuticRationale: 'Protects against sarcopenia without nitrogen waste.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: '1/2 Leached apple or 1/2 small guava (Low potassium portion)', therapeuticRationale: 'Restricted mineral fruit portion.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:30 PM', frequency: 'Daily', recommendedPrep: 'White rice with double-boiled leached lauki subzi + 1 egg white', therapeuticRationale: 'Low-phosphorus, controlled protein lunch.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '5:00 PM', frequency: 'Daily', recommendedPrep: 'Puffed rice (Pori) roasted with cumin & turmeric (no added salt)', therapeuticRationale: 'Zero phosphorus, mineral-safe snack.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:30 PM', frequency: 'Daily', recommendedPrep: 'Steamed rice idlis (2 pcs) with leached bottle gourd chutney', therapeuticRationale: 'Easy assimilation without nocturnal nitrogen accumulation.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Lukewarm water sip (within total daily fluid allowance)', therapeuticRationale: 'Resting nephron load.' }
    ]
  },

  low_sodium: {
    domainId: 'low_sodium',
    domainName: 'Low Sodium & DASH Antihypertensive Diet',
    tagline: 'Sodium restriction (<1,500mg), potassium-magnesium synergy & vascular relaxation',
    clinicalIndications: ['Essential Hypertension (BP >130/80)', 'Fluid Retention & Ankle Edema', 'Congestive Heart Failure', 'Stroke Prevention'],
    macroRatio: { carbs: 55, protein: 20, fat: 25 },
    dailyCalorieTarget: 1600,
    ingredients: [
      { id: 'ls-1', name: 'Fresh Amla, Lemon & Herbs (Salt Replacers)', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Citric acid and spices stimulate taste buds without sodium chloride.', portionGuide: 'Liberally' },
      { id: 'ls-2', name: 'Potassium-Rich Banana, Coconut & Sweet Potato', category: 'Fruits', gi: 'Medium', status: 'Recommended', clinicalBenefit: 'Potassium promotes renal sodium excretion and relaxes smooth muscle.', portionGuide: 'Daily 1 serving' },
      { id: 'ls-3', name: 'Papads, Pickles, Baking Soda & Salted Chips', category: 'Nuts & Healthy Fats', gi: 'High', status: 'Restricted', clinicalBenefit: 'Extreme sodium density causing severe intravascular volume expansion.', portionGuide: 'Strictly 0g' }
    ],
    recipes: [
      { id: 'ls-r1', name: 'Salt-Free Steamed Ragi Dosa with Mint Amla Chutney', mealType: 'Breakfast', calories: 240, protein: 7, carbs: 48, fat: 3, fiber: 8, gi: 'Low GI', ingredients: 'Fermented ragi batter, fresh mint, coriander, grated amla, green chili, ginger.', clinicalPrepInstructions: 'Flavored with amla and mint; zero table salt required.' }
    ],
    ayurSiddha: [
      { id: 'as-ls1', herbName: 'Sarpagandha (Rauwolfia serpentina) / Brahmi', botanicalOrTraditionalName: 'Centella asiatica', action: 'Sympathetic nervous system calming, lowers peripheral resistance', clinicalIndication: 'Stress-induced hypertension', dosageAndTiming: '1 cup Brahmi herbal tea at evening' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '5:30 AM', frequency: 'Daily', recommendedPrep: 'Fresh lemon juice in warm water with mint leaves (Zero salt)', therapeuticRationale: 'Promotes morning vascular relaxation.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '6:30 AM', frequency: 'Daily', recommendedPrep: '1 Potassium-rich small banana', therapeuticRationale: 'Prevents exercise-induced muscle cramps.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:00 AM', frequency: 'Daily', recommendedPrep: 'Fresh spring water', therapeuticRationale: 'Pure hydration without added minerals.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:00 AM', frequency: 'Daily', recommendedPrep: 'Unsalted sprouted moong with chopped cucumber & amla', therapeuticRationale: 'Rapid natural electrolyte balance.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: 'Tender coconut water (Natural potassium infusion)', therapeuticRationale: 'Competes with sodium reabsorption in renal tubules.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:30 PM', frequency: 'Daily', recommendedPrep: 'Brown rice with Palak Keerai Dal (Seasoned with lemon, hing & cumin)', therapeuticRationale: 'High magnesium and potassium; low sodium.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '5:00 PM', frequency: 'Daily', recommendedPrep: 'Unsalted roasted pumpkin seeds (15g)', therapeuticRationale: 'Rich in magnesium for vascular relaxation.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:45 PM', frequency: 'Daily', recommendedPrep: 'Jowar roti (2) with bottle gourd subzi (Citrus seasoned)', therapeuticRationale: 'Light digestion, prevents nocturnal BP surges.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:45 PM', frequency: 'Daily', recommendedPrep: 'Brahmi herbal infusion', therapeuticRationale: 'Calms sympathetic nervous outflow and regulates sleep BP.' }
    ]
  },

  bland: {
    domainId: 'bland',
    domainName: 'Bland & Gastro-Mucosal Healing Diet',
    tagline: 'Non-irritating, low-acidity, anti-ulcerogenic soothing gastrointestinal rest',
    clinicalIndications: ['Acute Gastritis', 'Peptic Ulcer Disease', 'Severe GERD & Acid Reflux', 'Post-Infectious Enteritis'],
    macroRatio: { carbs: 60, protein: 20, fat: 20 },
    dailyCalorieTarget: 1400,
    ingredients: [
      { id: 'bl-1', name: 'Steamed White Rice Kanji with A2 Ghee', category: 'Cereals & Millets', gi: 'Medium', status: 'Recommended', clinicalBenefit: 'Easily digestible starch coats irritated gastric lining.', portionGuide: '1 bowl' },
      { id: 'bl-2', name: 'Stewed Apple & Steamed Pumpkin', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Pectin and bland soluble fiber heal mucosal erosion.', portionGuide: '150g' },
      { id: 'bl-3', name: 'Raw Chilies, Tamarind, Black Pepper, Citrus', category: 'Vegetables & Greens', gi: 'Medium', status: 'Restricted', clinicalBenefit: 'Direct irritants stimulating excess HCl gastric acid secretion.', portionGuide: 'Strictly avoid' }
    ],
    recipes: [
      { id: 'bl-r1', name: 'Velvety Rice & Moong Ganji with Hing & Ghee', mealType: 'Breakfast', calories: 210, protein: 6, carbs: 40, fat: 4, fiber: 3, gi: 'Low GI', ingredients: 'Rice, yellow moong dal, pinch of hing, cumin powder, 5ml A2 ghee.', clinicalPrepInstructions: 'Pressure cooked to smooth cream consistency without any chili or spices.' }
    ],
    ayurSiddha: [
      { id: 'as-bl1', herbName: 'Yashtimadhu (Licorice Root)', botanicalOrTraditionalName: 'Glycyrrhiza glabra', action: 'Stimulates mucus production, protects stomach wall against gastric acid', clinicalIndication: 'Heartburn, gastritis & ulcerations', dosageAndTiming: '2g powder with warm water before meals' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '6:00 AM', frequency: 'Daily', recommendedPrep: 'Lukewarm water with 5g A2 cow ghee', therapeuticRationale: 'Forms protective film over gastric mucosa.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '7:00 AM', frequency: 'Gentle Walk Days', recommendedPrep: '1/2 Ripe banana (Antacid fruit)', therapeuticRationale: 'Natural mucosal protection.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:30 AM', frequency: 'Gentle Walk Days', recommendedPrep: 'Sip of room-temperature water', therapeuticRationale: 'Prevents acid regurgitation.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:15 AM', frequency: 'Gentle Walk Days', recommendedPrep: 'Steamed rice cake (Idli) without chutney', therapeuticRationale: 'Gentle fuel without acid stimulation.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: 'Stewed peeled apple with a pinch of cardamom', therapeuticRationale: 'Soothing pectin coat.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:00 PM', frequency: 'Daily', recommendedPrep: 'Soft cooked rice with diluted yellow moong dal & steamed ash gourd', therapeuticRationale: 'Neutral pH, effortless digestion.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '4:30 PM', frequency: 'Daily', recommendedPrep: 'Licorice (Yashtimadhu) infusion with cumin', therapeuticRationale: 'Neutralizes afternoon acid secretion.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:00 PM', frequency: 'Daily', recommendedPrep: 'Velvety moong rice ganji with 5ml A2 ghee', therapeuticRationale: 'Early bedtime dinner prevents nocturnal acid reflux.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Sip of warm boiled milk with pinch of cardamom (if tolerated)', therapeuticRationale: 'Buffers nocturnal stomach acid.' }
    ]
  },

  keto: {
    domainId: 'keto',
    domainName: 'Therapeutic Ketogenic Diet',
    tagline: 'Nutritional ketosis (<30g net carbs), neuroprotection & mitochondrial biogenesis',
    clinicalIndications: ['Refractory Epilepsy & Neuro-protection', 'Severe Insulin Resistance', 'Polycystic Ovarian Syndrome (PCOS)', 'Rapid Glycemic Reset'],
    macroRatio: { carbs: 5, protein: 25, fat: 70 },
    dailyCalorieTarget: 1650,
    ingredients: [
      { id: 'kt-1', name: 'Cold-Pressed Virgin Coconut Oil & MCTs', category: 'Nuts & Healthy Fats', gi: 'Zero', status: 'Recommended', clinicalBenefit: 'Directly converts to hepatic beta-hydroxybutyrate ketone bodies.', portionGuide: '20ml daily' },
      { id: 'kt-2', name: 'Fresh Paneer, Whole Eggs & Avocados', category: 'Proteins & Pulses', gi: 'Zero', status: 'Recommended', clinicalBenefit: 'High fat-to-protein ratio, zero glycogen replenishment.', portionGuide: '100g paneer / 2 eggs' },
      { id: 'kt-3', name: 'All Rice, Millets, Wheat, Sugar & Potatoes', category: 'Cereals & Millets', gi: 'High', status: 'Restricted', clinicalBenefit: 'Exits nutritional ketosis immediately by triggering insulin.', portionGuide: 'Strictly 0g' }
    ],
    recipes: [
      { id: 'kt-r1', name: 'Spiced Paneer & Spinach Keto Tawa Bhurji', mealType: 'Breakfast', calories: 340, protein: 18, carbs: 4, fat: 28, fiber: 3, gi: 'Zero GI', ingredients: '100g Paneer, 100g palak, 1 tbsp cold-pressed coconut oil, cumin, turmeric.', clinicalPrepInstructions: 'Sauteed in rich healthy fats; net carbs under 2 grams.' }
    ],
    ayurSiddha: [
      { id: 'as-kt1', herbName: 'Brahmi & Shankhpushpi Ghrita', botanicalOrTraditionalName: 'Medhya Rasayana in Ghee', action: 'Crosses blood-brain barrier with ketone bodies to calm neuronal firing', clinicalIndication: 'Neuroprotection and cognitive endurance', dosageAndTiming: '5g on empty stomach' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '6:00 AM', frequency: 'Daily', recommendedPrep: 'Bulletproof warm water with 10g A2 ghee & 5ml virgin coconut oil', therapeuticRationale: 'Kickstarts hepatic ketone synthesis.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '7:00 AM', frequency: 'Daily', recommendedPrep: 'Black coffee with 5ml MCT oil', therapeuticRationale: 'Direct cellular fuel without insulin secretion.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:45 AM', frequency: 'Daily', recommendedPrep: 'Electrolyte water with sodium, potassium, and magnesium', therapeuticRationale: 'Prevents keto-flu and mineral depletion.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:30 AM', frequency: 'Daily', recommendedPrep: 'Whole egg scramble with ghee & black pepper', therapeuticRationale: 'Anabolic recovery without carb spike.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:30 AM', frequency: 'Daily', recommendedPrep: 'Almond & walnut trail mix (25g) with pinch of rock salt', therapeuticRationale: 'High fat micronutrient density.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:30 PM', frequency: 'Daily', recommendedPrep: 'Sauteed paneer with ivygourd (kovakkai) in cold-pressed sesame oil', therapeuticRationale: 'Ketogenic macro ratio (70% fat, 25% protein).' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '5:00 PM', frequency: 'Daily', recommendedPrep: 'Green tea with coconut cream or salted macadamia nuts', therapeuticRationale: 'Sustained satiety.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:30 PM', frequency: 'Daily', recommendedPrep: 'Cabbage & mushroom stir-fry in butter/ghee + grilled tofu/chicken', therapeuticRationale: 'Ultra-low carb dinner sustains overnight ketosis.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Chamomile tea with magnesium glycinate', therapeuticRationale: 'Muscle relaxation and deep sleep.' }
    ]
  },

  soft: {
    domainId: 'soft',
    domainName: 'Soft & Mechanical Comfort Diet',
    tagline: 'Easily masticated, tender, nutrient-dense preparations for impaired dentition & convalescence',
    clinicalIndications: ['Geriatric Dentition Issues', 'Post-Oral Surgery', 'Mild Dysphagia', 'Post-Operative Recovery'],
    macroRatio: { carbs: 55, protein: 20, fat: 25 },
    dailyCalorieTarget: 1500,
    ingredients: [
      { id: 'sf-1', name: 'Steamed Idli, Pongal & Mashed Khichdi', category: 'Cereals & Millets', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Soft moist textures requiring zero strenuous chewing.', portionGuide: '150g' },
      { id: 'sf-2', name: 'Stewed Mashed Lentils & Soft Steamed Vegetables', category: 'Vegetables & Greens', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Fork-tender consistency prevents airway aspiration.', portionGuide: '1 cup' },
      { id: 'sf-3', name: 'Hard Raw Nuts, Crispy Fibers, Seeds & Tough Meats', category: 'Nuts & Healthy Fats', gi: 'Medium', status: 'Restricted', clinicalBenefit: 'Choking hazard and oral mucosa abrasion risk.', portionGuide: 'Avoid entirely' }
    ],
    recipes: [
      { id: 'sf-r1', name: 'Mashed Moong Dal & Soft Steamed Carrot Pongal', mealType: 'Breakfast', calories: 260, protein: 9, carbs: 46, fat: 5, fiber: 5, gi: 'Medium GI', ingredients: 'Rice, yellow moong dal, soft cooked carrot puree, 5ml ghee, cumin.', clinicalPrepInstructions: 'Mashed with back of spoon until completely uniform and moist.' }
    ],
    ayurSiddha: [
      { id: 'as-sf1', herbName: 'Drakshadi Kashayam (Raisin & Madhuca)', botanicalOrTraditionalName: 'Nutritive Tonic', action: 'Gentle oral mucosal soothing and metabolic nourishment', clinicalIndication: 'Oral fatigue and convalescence', dosageAndTiming: '30ml twice daily' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '6:00 AM', frequency: 'Daily', recommendedPrep: 'Warm almond milk (strained) with a pinch of cardamom', therapeuticRationale: 'Moist oral lubricant.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '7:00 AM', frequency: 'Daily', recommendedPrep: 'Mashed ripe papaya (50g)', therapeuticRationale: 'Soft, easily swallowed glucose.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '7:30 AM', frequency: 'Daily', recommendedPrep: 'Sip of lukewarm water', therapeuticRationale: 'Prevents dry mouth.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:15 AM', frequency: 'Daily', recommendedPrep: 'Soft scrambled egg or strained yellow moong soup', therapeuticRationale: 'Effortless protein assimilation.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: 'Steamed pureed apple with cinnamon', therapeuticRationale: 'Non-abrasive vitamin delivery.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:00 PM', frequency: 'Daily', recommendedPrep: 'Fork-mashed dal khichdi with tender cooked bottle gourd & curd', therapeuticRationale: 'Complete soft-texture balanced meal.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '4:30 PM', frequency: 'Daily', recommendedPrep: 'Smooth warm ragi malt with milk/water', therapeuticRationale: 'High calcium liquid nutrition.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:30 PM', frequency: 'Daily', recommendedPrep: 'Soft steamed idlis (2 pcs) soaked in mild vegetable sambar', therapeuticRationale: 'Moistened idlis ease swallowing before sleep.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Warm saffron milk with touch of ghee', therapeuticRationale: 'Nourishing sleep inducer.' }
    ]
  },

  fluid: {
    domainId: 'fluid',
    domainName: 'Fluid & Clear Fluid Clinical Diet',
    tagline: 'Zero-residue, ultra-hydrating electrolyte solutions for acute gastrointestinal rest',
    clinicalIndications: ['Pre/Post-Colonoscopy Prep', 'Severe Gastroenteritis / Dehydration', 'Post-Operative Day 1', 'Acute Gut Flare-ups'],
    macroRatio: { carbs: 70, protein: 15, fat: 15 },
    dailyCalorieTarget: 1100,
    ingredients: [
      { id: 'fl-1', name: 'Fresh Tender Coconut Water', category: 'Fruits', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Isotonic natural electrolytes (potassium, magnesium, sodium).', portionGuide: '250ml - 500ml' },
      { id: 'fl-2', name: 'Clear Strained Kanji Broth & Clear Vegetable Broths', category: 'Cereals & Millets', gi: 'Low', status: 'Recommended', clinicalBenefit: 'Supplies glucose and amino acids without any solid particulate matter.', portionGuide: '200ml' },
      { id: 'fl-3', name: 'All Solid Food, Fiber, Whole Grains, Dairy & Meat', category: 'Cereals & Millets', gi: 'Medium', status: 'Restricted', clinicalBenefit: 'Leaves intestinal residue and demands enzymatic digestion.', portionGuide: 'Strictly prohibited' }
    ],
    recipes: [
      { id: 'fl-r1', name: 'Strained Clear Mung & Cumin Broth', mealType: 'Breakfast', calories: 90, protein: 4, carbs: 16, fat: 1, fiber: 0, gi: 'Low GI', ingredients: 'Yellow moong dal boiled in 4x water with ginger and cumin, strained completely.', clinicalPrepInstructions: 'Clear transparent broth passing through fine mesh sieve.' }
    ],
    ayurSiddha: [
      { id: 'as-fl1', herbName: 'Shadangam Kashayam (6-Herb Fluid Decoction)', botanicalOrTraditionalName: 'Classical Ayurvedic Rehydration', action: 'Cools internal burning sensation, pacifies Pitta and quenches cellular thirst', clinicalIndication: 'Severe dehydration & feverish gut flares', dosageAndTiming: '50ml sipped throughout day' }
    ],
    mealSlots: [
      { slotId: 'ms-1', slotName: 'Early Morning', timing: '6:00 AM', frequency: 'Daily', recommendedPrep: 'Warm clear electrolyte water with rock salt & lemon drop', therapeuticRationale: 'Gentle rehydration.' },
      { slotId: 'ms-2', slotName: 'PRE-Workout', timing: '7:30 AM', frequency: 'Gentle Walk Days', recommendedPrep: 'Tender coconut water (150ml)', therapeuticRationale: 'Isotonic carbohydrate fluid.' },
      { slotId: 'ms-3', slotName: 'DURING-Workout', timing: '8:00 AM', frequency: 'Gentle Walk Days', recommendedPrep: 'Clear Shadangam water sip', therapeuticRationale: 'Maintains fluid homeostasis.' },
      { slotId: 'ms-4', slotName: 'POST-Workout', timing: '8:45 AM', frequency: 'Gentle Walk Days', recommendedPrep: 'Clear strained yellow moong broth (150ml)', therapeuticRationale: 'Amino acid delivery without fiber residue.' },
      { slotId: 'ms-5', slotName: 'Mid-Morning', timing: '11:00 AM', frequency: 'Daily', recommendedPrep: 'Clear strained apple juice (50% water diluted)', therapeuticRationale: 'Gentle glucose replenishment.' },
      { slotId: 'ms-6', slotName: 'Lunch', timing: '1:00 PM', frequency: 'Daily', recommendedPrep: 'Clear rice kanji water (Kanji Thanneer) with pinch of rock salt', therapeuticRationale: 'Traditional South Indian gut soothing broth.' },
      { slotId: 'ms-7', slotName: 'Evening Snack', timing: '4:30 PM', frequency: 'Daily', recommendedPrep: 'Warm clear vegetable broth with cumin and fresh mint', therapeuticRationale: 'Warm mineral replenishment.' },
      { slotId: 'ms-8', slotName: 'Dinner', timing: '7:30 PM', frequency: 'Daily', recommendedPrep: 'Clear strained moong dal broth + Tender coconut water', therapeuticRationale: 'Zero intestinal residue overnight.' },
      { slotId: 'ms-9', slotName: 'Bedtime', timing: '9:30 PM', frequency: 'Daily', recommendedPrep: 'Lukewarm coriander water sip', therapeuticRationale: 'Cooling restful sleep hydration.' }
    ]
  }
};
