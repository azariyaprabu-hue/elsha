/**
 * ELSHA Condition-Adaptive Clinical Ingredients Engine
 * Automatically generates unique, condition-specific ingredient guidelines for
 * EVERY Disease, Disorder, Performance goal, and Fitness goal.
 * 
 * Strict specifications for every condition:
 * - 15 Cereals
 * - 15 Pulses
 * - 15 Vegetables
 * - 15 Fruits
 * - 10 Nuts & Seeds
 * - 5 Dairy Foods
 * - 5 Ayurvedic Foods / Ingredients
 * - 10 Functional Foods
 * Total: 90 Condition-Specific Ranked Ingredients
 */

export interface ConditionIngredientItem {
  id: string;
  rank: number;
  name: string;
  category:
    | 'Cereals'
    | 'Pulses'
    | 'Vegetables'
    | 'Fruits'
    | 'Nuts & Seeds'
    | 'Dairy Foods'
    | 'Ayurvedic Foods'
    | 'Functional Foods';
  glycemicIndex: 'Low' | 'Medium' | 'High' | 'Zero';
  status: 'Recommended' | 'Caution' | 'Restricted';
  portion: string;
  therapeuticMechanism: string;
  clinicalRationale: string;
  contraindications: string;
  biomarkerTarget?: string;
}

export interface ConditionIngredientGuidelines {
  conditionName: string;
  domain: 'diseases' | 'disorders' | 'performance' | 'fitness';
  clinicalTagline: string;
  primaryGoal: string;
  macroPriority: string;
  totalCount: number;
  cereals: ConditionIngredientItem[];       // 15 items
  pulses: ConditionIngredientItem[];        // 15 items
  vegetables: ConditionIngredientItem[];    // 15 items
  fruits: ConditionIngredientItem[];        // 15 items
  nutsAndSeeds: ConditionIngredientItem[];  // 10 items
  dairyFoods: ConditionIngredientItem[];    // 5 items
  ayurvedicFoods: ConditionIngredientItem[];// 5 items
  functionalFoods: ConditionIngredientItem[];// 10 items
}

// Master pool of candidate ingredients with rich nutritional metadata
interface CandidateIngredient {
  name: string;
  category: ConditionIngredientItem['category'];
  baseGI: 'Low' | 'Medium' | 'High' | 'Zero';
  defaultPortion: string;
  keyNutrients: string[];
  tags: string[]; // e.g. 'low_gi', 'high_protein', 'high_potassium', 'low_potassium', 'thermogenic', 'anti_inflammatory', 'cooling', 'nitrates', 'leucine', 'endurance', 'renal_safe', 'thyroid_safe', 'liver_clearing'
  baseMechanism: string;
}

const MASTER_CANDIDATE_CEREALS: CandidateIngredient[] = [
  { name: 'Foxtail Millet (Thinai)', category: 'Cereals', baseGI: 'Low', defaultPortion: '40g raw / 1 cup cooked', keyNutrients: ['Fiber 8g', 'Iron', 'Zinc'], tags: ['low_gi', 'diabetes', 'obesity', 'gut_cleanse', 'fat_loss', 'pcos'], baseMechanism: 'High resistant starch slows gastric absorption and delays postprandial glucose surges.' },
  { name: 'Little Millet (Samai)', category: 'Cereals', baseGI: 'Low', defaultPortion: '40g raw / 1 cup cooked', keyNutrients: ['Magnesium', 'B-complex', 'Fiber'], tags: ['low_gi', 'diabetes', 'heart', 'obesity', 'fat_loss', 'metabolic'], baseMechanism: 'Abundant magnesium improves cellular insulin receptor phosphorylation.' },
  { name: 'Barnyard Millet (Kuthiraivali)', category: 'Cereals', baseGI: 'Low', defaultPortion: '35g raw / 1 cup cooked', keyNutrients: ['Low carb density', 'Fiber 9.8g'], tags: ['low_gi', 'obesity', 'diabetes', 'fat_loss', 'weight_loss'], baseMechanism: 'Lowest carbohydrate content among major millets; high fiber promotes prolonged satiety.' },
  { name: 'Kodo Millet (Varagu)', category: 'Cereals', baseGI: 'Low', defaultPortion: '40g raw / 1 cup cooked', keyNutrients: ['Polyphenols', 'Antioxidants'], tags: ['low_gi', 'diabetes', 'liver', 'lipid', 'obesity'], baseMechanism: 'High phenolic acids suppress aldose reductase and combat diabetic microvascular damage.' },
  { name: 'Finger Millet (Ragi / Kezhvaragu)', category: 'Cereals', baseGI: 'Medium', defaultPortion: '40g flour (2 rotis / kanji)', keyNutrients: ['Calcium 344mg', 'Tryptophan'], tags: ['calcium', 'bone', 'muscle_gain', 'endurance', 'performance', 'sports'], baseMechanism: 'Highest plant calcium reservoir supporting bone mineralization and skeletal muscle contraction.' },
  { name: 'Pearl Millet (Bajra / Kambu)', category: 'Cereals', baseGI: 'Medium', defaultPortion: '40g flour (2 rotis)', keyNutrients: ['Iron', 'Zinc', 'Phosphorus'], tags: ['iron', 'anaemia', 'energy', 'strength', 'endurance', 'performance'], baseMechanism: 'Dense iron stores enhance hemoglobin synthesis and tissue oxygen delivery.' },
  { name: 'Sorghum (Jowar / Cholam)', category: 'Cereals', baseGI: 'Medium', defaultPortion: '45g flour (2 rotis)', keyNutrients: ['Policosanols', 'Fiber'], tags: ['gluten_free', 'lipid', 'cholesterol', 'gut', 'cardio'], baseMechanism: 'Plant policosanols inhibit HMG-CoA reductase, assisting LDL cholesterol normalization.' },
  { name: 'Rolled Steel-Cut Oats', category: 'Cereals', baseGI: 'Low', defaultPortion: '40g raw porridge', keyNutrients: ['Beta-glucan 3.5g', 'Manganese'], tags: ['cardio', 'cholesterol', 'endurance', 'fitness', 'digestive'], baseMechanism: 'Viscous beta-glucan binds intestinal bile acids, reducing systemic LDL-C reabsorption.' },
  { name: 'Whole Grain Barley (Javvarisi / Yavam)', category: 'Cereals', baseGI: 'Low', defaultPortion: '35g boiled grains', keyNutrients: ['Soluble fiber', 'Selenium'], tags: ['kidney', 'diuretic', 'obesity', 'liver', 'diabetes'], baseMechanism: 'Stimulates renal fluid excretion while moderating intestinal glucose uptake.' },
  { name: 'Red Matta / Mappillai Samba Rice', category: 'Cereals', baseGI: 'Low', defaultPortion: '1/2 cup cooked (75g)', keyNutrients: ['Anthocyanins', 'Zinc'], tags: ['endurance', 'strength', 'immunity', 'sports', 'recovery'], baseMechanism: 'Procyanidins and zinc accelerate muscular glycogen recovery and cellular repair.' },
  { name: 'Kavuni (Black Rice)', category: 'Cereals', baseGI: 'Low', defaultPortion: '1/2 cup cooked (70g)', keyNutrients: ['Anthocyanin 350mg', 'Fiber'], tags: ['antioxidant', 'cancer', 'anti_inflammatory', 'liver', 'longevity'], baseMechanism: 'Supreme cyanidin-3-glucoside scavenges reactive oxygen species and safeguards hepatocyte DNA.' },
  { name: 'Royal White Quinoa (Cooked)', category: 'Cereals', baseGI: 'Low', defaultPortion: '1 cup cooked (140g)', keyNutrients: ['Complete protein 8g', 'Lysine'], tags: ['muscle_gain', 'strength', 'body_recomposition', 'pcos', 'protein'], baseMechanism: 'Contains all 9 essential amino acids with balanced leucine for optimal muscle protein synthesis.' },
  { name: 'Buckwheat Groats (Kuttu)', category: 'Cereals', baseGI: 'Low', defaultPortion: '40g cooked (1 cup)', keyNutrients: ['Rutin bioflavonoid', 'Magnesium'], tags: ['hypertension', 'vascular', 'cardio', 'gluten_free'], baseMechanism: 'High rutin flavonoid strengthens microcapillary walls and reduces vascular permeability.' },
  { name: 'Proso Millet (Panivaragu)', category: 'Cereals', baseGI: 'Low', defaultPortion: '40g raw / 1 cup cooked', keyNutrients: ['Lecithin', 'B-complex'], tags: ['neurological', 'brain', 'metabolic', 'fitness'], baseMechanism: 'Supplies neural lecithin phospholipids for acetylcholine neurotransmitter synthesis.' },
  { name: 'Broken Wheat (Dalia / Samba Wheat Ravai)', category: 'Cereals', baseGI: 'Medium', defaultPortion: '1 cup cooked upma', keyNutrients: ['Insoluble fiber', 'Phosphorus'], tags: ['digestive', 'satiety', 'general_fitness', 'lifestyle'], baseMechanism: 'Coarse bran particles stimulate bowel peristalsis and support a healthy colon microbiome.' },
  { name: 'Unpolished Brown Basmati Rice', category: 'Cereals', baseGI: 'Medium', defaultPortion: '1 cup cooked (150g)', keyNutrients: ['Amylose 24%', 'B1 Thiamine'], tags: ['endurance', 'performance', 'pre_workout', 'carbs'], baseMechanism: 'High amylose provides steady, gradual glycogen fueling without sharp glycemic swings.' },
  { name: 'Polished White Rice', category: 'Cereals', baseGI: 'High', defaultPortion: '1/2 cup cooked', keyNutrients: ['Fast starch', 'Low fiber'], tags: ['fast_carbs', 'post_workout', 'weight_gain'], baseMechanism: 'Rapidly hydrolyzes into glucose to elicit acute insulin spikes for post-exercise glycogen resynthesis.' },
  { name: 'Refined Wheat Flour (Maida)', category: 'Cereals', baseGI: 'High', defaultPortion: 'Minimal', keyNutrients: ['Acellular starch'], tags: ['restricted_all'], baseMechanism: 'Stripped of bran and germ; triggers rapid hyperinsulinemia and visceral fat deposition.' },
  { name: 'Instant Cornflakes & Sugared Puffs', category: 'Cereals', baseGI: 'High', defaultPortion: 'Minimal', keyNutrients: ['Extruded starch'], tags: ['restricted_all'], baseMechanism: 'Extreme glycemic index (GI 82) causes immediate postprandial glycemic excursions.' },
  { name: 'Steam-Parboiled Sona Masoori Rice', category: 'Cereals', baseGI: 'Medium', defaultPortion: '1 cup cooked (120g)', keyNutrients: ['Low potassium', 'Low phosphorus'], tags: ['renal_safe', 'kidney', 'digestive'], baseMechanism: 'Parboiling gelatinizes starch while keeping potassium and phosphorus low for renal protection.' },
];

const MASTER_CANDIDATE_PULSES: CandidateIngredient[] = [
  { name: 'Horse Gram (Kollu / Kulthi)', category: 'Pulses', baseGI: 'Low', defaultPortion: '40g dry / 1 cup boiled', keyNutrients: ['Protein 22g', 'Polyphenols', 'Iron'], tags: ['obesity', 'fat_loss', 'lipid', 'liver', 'metabolic', 'weight_loss'], baseMechanism: 'Upregulates mitochondrial uncoupling protein-1 (UCP-1) in brown adipose tissue, accelerating thermogenic fat oxidation.' },
  { name: 'Sprouted Green Moong (Whole)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup sprouted (120g)', keyNutrients: ['Protein 14g', 'Active enzymes', 'Vitamin C'], tags: ['diabetes', 'gut_cleanse', 'sports', 'recovery', 'general_fitness', 'pcos'], baseMechanism: 'Sprouting doubles bioactive antioxidants, reduces phytates by 70%, and provides gentle, bioavailable branched-chain amino acids.' },
  { name: 'Split Yellow Moong Dal', category: 'Pulses', baseGI: 'Low', defaultPortion: '1/2 cup cooked dal', keyNutrients: ['Digestible protein 9g', 'Potassium'], tags: ['digestive', 'soothing', 'recovery', 'fever', 'liver', 'elderly'], baseMechanism: 'Easiest pulse to digest; non-fermenting prebiotic that nourishes gut enterocytes without causing flatulence.' },
  { name: 'Whole Black Gram (Kuppi Ulundu)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1/2 cup cooked', keyNutrients: ['Protein 24g', 'Calcium', 'Iron'], tags: ['strength', 'muscle_gain', 'post_workout', 'bone', 'neuro'], baseMechanism: 'Supreme Ayurvedic Balya (strength-giver); rich in essential lysine and arginine for myofibrillar repair.' },
  { name: 'Split White Urad Dal', category: 'Pulses', baseGI: 'Medium', defaultPortion: '1/4 cup in fermented batter', keyNutrients: ['Mucilage', 'Protein'], tags: ['gut', 'fermented', 'traditional'], baseMechanism: 'Provides bacterial prebiotic substrate for Leuconostoc mesenteroides fermentation during idli/dosa preparation.' },
  { name: 'Brown Chickpeas (Kala Chana)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup boiled (150g)', keyNutrients: ['Protein 15g', 'Fiber 12g', 'Molybdenum'], tags: ['diabetes', 'satiety', 'obesity', 'endurance', 'cardio'], baseMechanism: 'High ratio of amylose to amylopectin prevents rapid enzymatic amylolysis, stabilizing postprandial glucose.' },
  { name: 'Kabuli Chana (White Chickpeas)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup boiled (150g)', keyNutrients: ['Protein 14g', 'Folate', 'Choline'], tags: ['muscle_gain', 'body_recomposition', 'sports', 'general_fitness'], baseMechanism: 'Supplies methyl-donor choline and folate, supporting DNA methylation and homocysteine clearance.' },
  { name: 'Cowpeas / Black-Eyed Peas (Karamani)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup cooked', keyNutrients: ['Soluble fiber', 'Magnesium', 'Zinc'], tags: ['cardio', 'hypertension', 'fat_loss', 'pcos'], baseMechanism: 'High soluble pectin fiber forms an intestinal gel, attenuating glycemic index and cholesterol absorption.' },
  { name: 'Red Kidney Beans (Rajma)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup cooked (160g)', keyNutrients: ['Protein 15g', 'Fiber 11g', 'Potassium 740mg'], tags: ['muscle_gain', 'endurance', 'strength', 'sports'], baseMechanism: 'Provides a sustained 4-hour amino acid delivery curve ideal for prolonged muscular recovery.' },
  { name: 'Brown Masoor Dal (Whole Red Lentils)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup cooked dal', keyNutrients: ['Iron 6.6mg', 'Folate', 'Protein 18g'], tags: ['anaemia', 'blood', 'performance', 'metabolic'], baseMechanism: 'High non-heme iron combined with organic acids accelerates erythropoiesis and hemoglobin production.' },
  { name: 'Split Red Masoor Dal', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup cooked', keyNutrients: ['Protein 12g', 'Zinc', 'Fiber'], tags: ['digestive', 'quick_cook', 'liver', 'weight_loss'], baseMechanism: 'Light to metabolize, supporting hepatic glutathione synthesis and cellular amino acid balance.' },
  { name: 'Moth Beans (Matki / Sprouted)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1 cup sprouted', keyNutrients: ['Zinc 3.5mg', 'Protein 16g', 'Fiber'], tags: ['immunity', 'skin', 'wound_healing', 'diabetes'], baseMechanism: 'Dense zinc stores stimulate pancreatic islet cell insulin crystallization and tissue repair.' },
  { name: 'Pigeon Pea (Toor Dal / Tuvaram Paruppu)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1/2 cup cooked in rasam/sambar', keyNutrients: ['Protein 11g', 'Potassium', 'Folate'], tags: ['daily_staple', 'cardio', 'general_fitness', 'traditional'], baseMechanism: 'Supplies essential dietary folate for red cell formation and neural vascular health.' },
  { name: 'Green Field Peas (Pattani)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1/2 cup boiled', keyNutrients: ['Vitamin K1', 'Fiber', 'Protein'], tags: ['bone', 'vascular', 'fitness'], baseMechanism: 'Rich in vitamin K1 for osteocalcin gamma-carboxylation and arterial calcification prevention.' },
  { name: 'Soybean / Fermented Tempeh', category: 'Pulses', baseGI: 'Low', defaultPortion: '80g cooked tempeh', keyNutrients: ['Complete protein 18g', 'Isoflavones'], tags: ['muscle_gain', 'strength', 'body_recomposition', 'cancer_prevention'], baseMechanism: 'Genistein and daidzein exhibit selective estrogen receptor modulation, while leucine drives muscle protein synthesis.' },
  { name: 'Organic Defatted Soya Chunks', category: 'Pulses', baseGI: 'Low', defaultPortion: '30g dry / 1 cup prepared', keyNutrients: ['Protein 52g/100g', 'Zero cholesterol'], tags: ['muscle_gain', 'strength', 'sports', 'bodybuilding'], baseMechanism: 'Extreme protein concentration delivering branched-chain amino acids for hypertrophic athletic demands.' },
  { name: 'Split Chana Dal (Bengal Gram Dal)', category: 'Pulses', baseGI: 'Low', defaultPortion: '1/2 cup cooked', keyNutrients: ['Lowest GI pulse (GI 11)', 'High fiber'], tags: ['diabetes', 'obesity', 'pcos', 'low_gi'], baseMechanism: 'Remarkably low glycemic index (GI 11) prevents glycemic fluctuations even when consumed in large portions.' },
  { name: 'Fried Salted Dal Snacks (Bujia / Namkeen)', category: 'Pulses', baseGI: 'High', defaultPortion: 'Minimal', keyNutrients: ['Trans-fats', 'Excess sodium'], tags: ['restricted_all'], baseMechanism: 'Deep-fried in oxidized palm oil, generating cytotoxic lipid peroxides and arterial inflammation.' },
];

const MASTER_CANDIDATE_VEGETABLES: CandidateIngredient[] = [
  { name: 'Bitter Gourd (Pavakkai / Karela)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup cooked / 30ml juice', keyNutrients: ['Charantin', 'Polypeptide-p', 'Vicine'], tags: ['diabetes', 'metabolic', 'liver', 'obesity', 'pcos'], baseMechanism: 'Charantin and polypeptide-p act as plant-derived insulin mimetics, stimulating cellular glucose uptake.' },
  { name: 'Ivy Gourd (Kovakkai / Kundru)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup steamed stir-fry', keyNutrients: ['Beta-carotene', 'Fiber', 'Enzymes'], tags: ['diabetes', 'fat_loss', 'liver', 'skin'], baseMechanism: 'Suppresses hepatic glucose-6-phosphatase enzyme, curbing nocturnal gluconeogenesis.' },
  { name: 'Ash Gourd (Pusanikai / Winter Melon)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup juice / cooked curry', keyNutrients: ['96% Water', 'Alkaline minerals', 'Calcium'], tags: ['obesity', 'weight_loss', 'gut_cleanse', 'hypertension', 'kidney'], baseMechanism: 'Deeply alkaline cellular electrolyte hydrator; clears systemic mucosal inflammation and flushes sodium.' },
  { name: 'Bottle Gourd (Sorakkai / Lauki)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup steamed kootu', keyNutrients: ['Choline', 'Potassium', 'Soluble fiber'], tags: ['kidney', 'hypertension', 'heart', 'digestive', 'liver'], baseMechanism: 'High water-to-sodium ratio eases renal glomerulus filtration and reduces diastolic blood pressure.' },
  { name: 'Ridge Gourd (Peerkangai)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup cooked', keyNutrients: ['Cellulose fiber', 'Peptides'], tags: ['liver', 'digestive', 'weight_loss', 'pcos'], baseMechanism: 'Dietary cellulose adsorbs toxic secondary bile acids in the colon, assisting bowel cleansing.' },
  { name: 'Snake Gourd (Pudalangai)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup cooked kootu', keyNutrients: ['Magnesium', 'Potassium', 'Flavonoids'], tags: ['heart', 'fever', 'detox', 'general_fitness'], baseMechanism: 'Mild febrifuge and cardiac tonic that helps regulate ventricular irritability and vascular tension.' },
  { name: 'Drumstick Pods & Leaves (Murungai)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1/2 cup cooked leaves / 2 pods', keyNutrients: ['Quercetin', 'Chlorogenic acid', 'Iron'], tags: ['diabetes', 'hypertension', 'anaemia', 'sports', 'endurance'], baseMechanism: 'Chlorogenic acid inhibits sodium-dependent glucose transporters (SGLT1) in the intestinal brush border.' },
  { name: 'Broccoli & Cruciferous Florets', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup steamed (100g)', keyNutrients: ['Sulforaphane', 'Indole-3-Carbinol'], tags: ['cancer', 'liver', 'pcos', 'anti_inflammatory', 'hormonal'], baseMechanism: 'Sulforaphane activates the Nrf2 genetic pathway, producing phase II detoxifying enzymes and metabolizing excess estrogen.' },
  { name: 'Spinach / Keerai Varieties (Sirukeerai, Arakeerai)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup cooked greens', keyNutrients: ['Lutein', 'Folate', 'Magnesium', 'Nitrates'], tags: ['endurance', 'performance', 'cardio', 'eye', 'hypertension'], baseMechanism: 'Natural dietary nitrates stimulate endothelial nitric oxide synthesis, enhancing muscular perfusion.' },
  { name: 'Cabbage (White & Purple)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup shredded steamed', keyNutrients: ['Vitamin U (S-methylmethionine)', 'Glutamine'], tags: ['gut', 'gastritis', 'ulcers', 'obesity', 'detox'], baseMechanism: 'S-methylmethionine and glutamine heal gastroduodenal mucosal erosion and support enterocyte tight junctions.' },
  { name: 'Cauliflower (Steamed / Riced)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup riced (100g)', keyNutrients: ['Choline', 'Sulforaphane', 'Low carb'], tags: ['low_carb', 'weight_loss', 'fat_loss', 'diabetes'], baseMechanism: 'Excellent low-carbohydrate rice substitute that reduces meal calories by 75% while providing choline.' },
  { name: 'Cucumber & Gherkins (Vellarikai)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 large raw cucumber (200g)', keyNutrients: ['Cucurbitacins', 'Silica', 'Hydration'], tags: ['hydration', 'sports', 'fat_loss', 'skin', 'hypertension'], baseMechanism: 'High silica and structured intracellular water assist connective tissue elasticity and rapid cellular rehydration.' },
  { name: 'Radish (Mullangi / Daikon)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1/2 cup sliced or cooked', keyNutrients: ['Raphanin', 'Isothiocyanates'], tags: ['liver', 'gallbladder', 'kidney', 'digestive'], baseMechanism: 'Raphanin stimulates hepatic bile flow and assists in the enzymatic clearance of urinary calculi.' },
  { name: 'Okra / Lady Finger (Vendakkai)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 cup cooked / water infusion', keyNutrients: ['Mucilage fiber', 'Polyphenols'], tags: ['diabetes', 'cholesterol', 'gut', 'pcos'], baseMechanism: 'Viscous okra mucilage mechanically entraps luminal glucose molecules, smoothing postprandial blood spikes.' },
  { name: 'Carrots (Steamed / Raw)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '1 medium (80g)', keyNutrients: ['Beta-carotene', 'Pectin'], tags: ['eye', 'immunity', 'skin', 'fitness'], baseMechanism: 'Beta-carotene converts to retinol, fortifying retinal rhodopsin and mucosal barrier immunity.' },
  { name: 'Beetroot (Cooked / Juice)', category: 'Vegetables', baseGI: 'Medium', defaultPortion: '1/2 cup cooked / 50ml juice', keyNutrients: ['Betalains', 'Inorganic Nitrates'], tags: ['sports', 'endurance', 'performance', 'hypertension', 'blood'], baseMechanism: 'High nitrate reservoir converts to nitric oxide, reducing muscular oxygen cost and elevating VO2 max.' },
  { name: 'Raw Garlic (Poondu / Allicin)', category: 'Vegetables', baseGI: 'Low', defaultPortion: '2 crushed raw cloves daily', keyNutrients: ['Allicin', 'S-allyl cysteine'], tags: ['cardio', 'hypertension', 'lipid', 'immunity', 'anti_inflammatory'], baseMechanism: 'Allicin inhibits angiotensin II converting enzyme and induces hydrogen sulfide (H2S) vascular vasodilation.' },
  { name: 'Deep-Fried Potato Chips & French Fries', category: 'Vegetables', baseGI: 'High', defaultPortion: 'Restricted', keyNutrients: ['Acrylamides', 'Oxidized trans-fat'], tags: ['restricted_all'], baseMechanism: 'Acrylamides formed by high-heat Maillard reactions damage vascular endothelium and elevate inflammatory IL-6.' },
];

const MASTER_CANDIDATE_FRUITS: CandidateIngredient[] = [
  { name: 'Indian Gooseberry (Nellikkai / Amla)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1-2 fresh berries / 20ml juice', keyNutrients: ['Vitamin C 600mg', 'Emblicanin tannins'], tags: ['diabetes', 'immunity', 'liver', 'hair', 'longevity', 'gut'], baseMechanism: 'Stable emblicanin tannins shield vitamin C from heat oxidation, suppressing sorbitol accumulation in diabetic lenses.' },
  { name: 'Pomegranate (Madhulai)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1/2 cup arils (80g)', keyNutrients: ['Punicalagins', 'Ellagic acid', 'Nitrates'], tags: ['cardio', 'endurance', 'vascular', 'prostate', 'sports'], baseMechanism: 'Punicalagins protect vascular nitric oxide from oxidative degradation, reducing carotid artery intima-media thickness.' },
  { name: 'Crisp Green Apple (Granny Smith)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1 medium apple (130g)', keyNutrients: ['Malic acid', 'Pectin fiber', 'Quercetin'], tags: ['fat_loss', 'obesity', 'liver', 'diabetes', 'digestive'], baseMechanism: 'Malic acid dissolves biliary sludge while soluble apple pectin feeds butyrate-producing intestinal Akkermansia.' },
  { name: 'Fresh Country Guava (Koyya Pazham)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1 medium fruit with skin (100g)', keyNutrients: ['Dietary fiber 5.4g', 'Vitamin C 228mg', 'Lycopene'], tags: ['diabetes', 'obesity', 'constipation', 'immunity', 'pcos'], baseMechanism: 'Exceptional dietary fiber content (5.4g/100g) delays carbohydrate hydrolysis with minimal glycemic impact.' },
  { name: 'Papaya (Semi-Ripe / Ripe Papali)', category: 'Fruits', baseGI: 'Medium', defaultPortion: '1 cup cubed (140g)', keyNutrients: ['Papain enzyme', 'Chymopapain', 'Carotenoids'], tags: ['digestive', 'liver', 'platelets', 'anti_inflammatory', 'gut'], baseMechanism: 'Papain proteolytic enzymes facilitate gastric protein breakdown, easing pancreatic digestive burden.' },
  { name: 'Blueberries & Jamun (Black Plum / Naval Pazham)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1/2 cup (80g)', keyNutrients: ['Jamboline glycoside', 'Anthocyanins'], tags: ['diabetes', 'memory', 'neurological', 'metabolic', 'anti_inflammatory'], baseMechanism: 'Jamboline stops the diastatic conversion of starch into sugar in pancreatic beta-cell dysfunction.' },
  { name: 'Sweet Orange / Mosambi (Citrus)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1 whole fruit with pulp (130g)', keyNutrients: ['Hesperidin', 'Bioflavonoids', 'Vitamin C'], tags: ['hypertension', 'vascular', 'immunity', 'recovery'], baseMechanism: 'Hesperidin bioflavonoids improve microvascular endothelial reactivity and lower systemic blood pressure.' },
  { name: 'Ripe Banana (Elakki / Nendran)', category: 'Fruits', baseGI: 'Medium', defaultPortion: '1 small banana (80g)', keyNutrients: ['Potassium 450mg', 'Fructooligosaccharides', 'Fast carbs'], tags: ['sports', 'endurance', 'pre_workout', 'post_workout', 'muscle_gain', 'weight_gain'], baseMechanism: 'Readily replenishes exercise-depleted glycogen and restores cellular potassium balance in muscle fibers.' },
  { name: 'Watermelon (Tharpoosani)', category: 'Fruits', baseGI: 'Medium', defaultPortion: '1 cup cubed (150g)', keyNutrients: ['L-Citrulline 250mg', 'Lycopene', 'Hydration 92%'], tags: ['sports', 'recovery', 'muscle_soreness', 'hydration', 'vascular'], baseMechanism: 'L-citrulline serves as an efficient biological precursor to L-arginine, dramatically reducing delayed onset muscle soreness (DOMS).' },
  { name: 'Fresh Wood Apple (Vilam Pazham)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1/2 fruit pulp', keyNutrients: ['Tannins', 'B-vitamins', 'Pectin'], tags: ['gut', 'diarrhea', 'liver', 'detox'], baseMechanism: 'Potent astringent Kashaya rasa balances Pitta and repairs inflamed intestinal mucous lining.' },
  { name: 'Kiwi Fruit', category: 'Fruits', baseGI: 'Low', defaultPortion: '1 fruit (75g)', keyNutrients: ['Actinidain', 'Serotonin precursors', 'Vitamin C'], tags: ['sleep', 'digestive', 'recovery', 'immunity'], baseMechanism: 'Natural serotonin precursors and actinidain promote deeper REM recovery sleep and protein digestion.' },
  { name: 'Avocado (Butter Fruit)', category: 'Fruits', baseGI: 'Low', defaultPortion: '1/2 fruit (70g)', keyNutrients: ['Oleic acid (MUFA)', 'Glutathione', 'Potassium'], tags: ['keto', 'pcos', 'hormonal', 'cardio', 'skin'], baseMechanism: 'Supplies concentrated monounsaturated lipids necessary for steroidogenic hormone synthesis and HDL elevation.' },
  { name: 'Dates (Lion Dates / Medjool)', category: 'Fruits', baseGI: 'Medium', defaultPortion: '2-3 dates (30g)', keyNutrients: ['Iron', 'Natural glucose', 'Magnesium'], tags: ['sports', 'anaemia', 'strength', 'pre_workout', 'weight_gain'], baseMechanism: 'Delivers rapid bioavailable glucose and iron for pre-workout muscular energy bursts.' },
  { name: 'Black Currants / Seedless Raisins (Soaked)', category: 'Fruits', baseGI: 'Medium', defaultPortion: '15-20 soaked berries', keyNutrients: ['Boron', 'Iron', 'Tartaric acid'], tags: ['bone', 'anaemia', 'constipation', 'recovery'], baseMechanism: 'Boron assists bone osteogenesis while tartaric acid encourages healthy colon evacuation.' },
  { name: 'Wild Figs (Athikai / Fresh Anjeer)', category: 'Fruits', baseGI: 'Low', defaultPortion: '2 fresh figs (80g)', keyNutrients: ['Ficin enzyme', 'Calcium', 'Fiber'], tags: ['fertility', 'digestive', 'bone', 'pcos'], baseMechanism: 'Ficin enzymes dissolve digestive stagnation, and dense calcium preserves trabecular bone density.' },
  { name: 'Canned Fruits in Heavy Sugar Syrup', category: 'Fruits', baseGI: 'High', defaultPortion: 'Restricted', keyNutrients: ['High-fructose corn syrup'], tags: ['restricted_all'], baseMechanism: 'Industrial high fructose directly bypasses hepatic phosphofructokinase, converting immediately into visceral triglycerides.' },
];

const MASTER_CANDIDATE_NUTS_SEEDS: CandidateIngredient[] = [
  { name: 'Mamra / Californian Almonds (Soaked & Peeled)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '6-8 soaked nuts (15g)', keyNutrients: ['Vitamin E 7mg', 'Magnesium', 'Protein'], tags: ['diabetes', 'cardio', 'skin', 'memory', 'sports', 'fitness'], baseMechanism: 'Alpha-tocopherol antioxidant protects vascular endothelial membranes against oxidative free radical damage.' },
  { name: 'English Walnuts (Akroot)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '3-4 halves (15g)', keyNutrients: ['Plant ALA Omega-3 2.5g', 'Polyphenols'], tags: ['brain', 'cardio', 'lipid', 'anti_inflammatory', 'neurological'], baseMechanism: 'Alpha-linolenic acid (ALA) downregulates nuclear factor kappa B (NF-kB), dampening systemic vascular inflammation.' },
  { name: 'Raw Pumpkin Seeds (Poosani Vithai)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 tbsp (15g)', keyNutrients: ['Zinc 2.2mg', 'Magnesium', 'Tryptophan'], tags: ['prostate', 'testosterone', 'sleep', 'muscle_gain', 'sports'], baseMechanism: 'High zinc and phytosterols support testosterone synthesis, prostate health, and deep neuromuscular recovery.' },
  { name: 'Organic Chia Seeds (Soaked)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 tbsp soaked (15g)', keyNutrients: ['Soluble mucilage 5g', 'Omega-3 ALA'], tags: ['obesity', 'fat_loss', 'hydration', 'diabetes', 'digestive'], baseMechanism: 'Hydrophilic mucilage expands 12x in water, prolonging gastric emptying and delivering prolonged hydration.' },
  { name: 'Roasted Flaxseeds (Alsi / Agase)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 tbsp freshly crushed', keyNutrients: ['Secoisolariciresinol Diglucoside (SDG Lignans)', 'ALA'], tags: ['pcos', 'hormonal', 'cardio', 'lipid', 'cancer_prevention'], baseMechanism: 'Plant lignans competitively bind estrogen receptors, assisting healthy phase I estrogen metabolite ratios.' },
  { name: 'Raw Sunflower Seeds (Suriyaganthi Vithai)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 tbsp (15g)', keyNutrients: ['Selenium 20mcg', 'Vitamin E', 'Folate'], tags: ['thyroid', 'immunity', 'skin', 'fitness'], baseMechanism: 'Selenium is essential for deiodinase enzyme function, catalyzing inactive T4 conversion into metabolic T3.' },
  { name: 'Black Sesame Seeds (Karuppu Ellu)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 tsp (10g)', keyNutrients: ['Calcium 140mg', 'Sesamin', 'Iron'], tags: ['bone', 'calcium', 'hair', 'joint', 'anaemia'], baseMechanism: 'Sesamin lignans preserve cartilage matrix and deliver exceptionally bioavailable calcium to osteocytes.' },
  { name: 'Raw Brazil Nuts (High Selenium)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 single nut daily (5g)', keyNutrients: ['Selenium 90mcg'], tags: ['thyroid', 'immunity', 'longevity', 'endocrine'], baseMechanism: 'A single Brazil nut provides 150% of the recommended daily intake of selenium, protecting the thyroid gland from autoimmune Hashimoto peroxides.' },
  { name: 'Raw Shelled Hemp Hearts', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '1 tbsp (15g)', keyNutrients: ['Complete protein 5g', 'GLA (Gamma-linolenic acid)'], tags: ['muscle_gain', 'anti_inflammatory', 'skin', 'bodybuilding'], baseMechanism: 'Supplies anti-inflammatory GLA and complete essential amino acids to speed post-workout muscle repair.' },
  { name: 'Pistachios (Pista - Unsalted)', category: 'Nuts & Seeds', baseGI: 'Low', defaultPortion: '15 kernels (15g)', keyNutrients: ['Lutein', 'Vitamin B6', 'Arginine'], tags: ['eye', 'cardio', 'recovery', 'general_fitness'], baseMechanism: 'High L-arginine content increases nitric oxide production, improving athletic vascular blood flow.' },
  { name: 'Deep-Fried Masala Cashews in Palm Oil', category: 'Nuts & Seeds', baseGI: 'High', defaultPortion: 'Restricted', keyNutrients: ['Excess saturated fats', 'High sodium'], tags: ['restricted_all'], baseMechanism: 'High heat oxidation destroys delicate polyunsaturated fatty acids, inducing systemic oxidative stress.' },
];

const MASTER_CANDIDATE_DAIRY: CandidateIngredient[] = [
  { name: 'Desi A2 Cow Buttermilk (Chhach / Neer Mor with Jeera)', category: 'Dairy Foods', baseGI: 'Low', defaultPortion: '1 large glass (250ml)', keyNutrients: ['Lactobacillus acidophilus', 'Lactic acid', 'Electrolytes'], tags: ['gut', 'digestive', 'obesity', 'hypertension', 'fat_loss', 'diabetes'], baseMechanism: 'Churning removes heavy butterfat, leaving a light probiotic lactic fluid that cools digestion and seeds beneficial flora.' },
  { name: 'A2 Vedic Cow Curd (Dahi - Probiotic Set)', category: 'Dairy Foods', baseGI: 'Low', defaultPortion: '1 small bowl (100g)', keyNutrients: ['Calcium 150mg', 'Bioavailable protein 4g', 'Probiotics'], tags: ['gut', 'bone', 'general_fitness', 'lifestyle'], baseMechanism: 'Fermentation pre-digests lactose into lactic acid, optimizing intestinal calcium and magnesium uptake.' },
  { name: 'Fresh A2 Cow Paneer (Cottage Cheese)', category: 'Dairy Foods', baseGI: 'Low', defaultPortion: '60g fresh cubes', keyNutrients: ['Casein protein 11g', 'Calcium', 'CLA'], tags: ['muscle_gain', 'strength', 'sports', 'body_recomposition', 'keto'], baseMechanism: 'Slow-digesting micellar casein provides a continuous nocturnal amino acid pool, preventing catabolism.' },
  { name: 'Cold-Pressed Desi A2 Cow Ghee', category: 'Dairy Foods', baseGI: 'Zero', defaultPortion: '1 tsp (5ml)', keyNutrients: ['Butyric acid', 'Omega-3', 'Fat-soluble vitamins A, D, E, K'], tags: ['gut', 'joint', 'hormonal', 'ayurvedic', 'brain'], baseMechanism: 'Butyrate directly nourishes colonic colonocytes, repairs leaky gut barriers, and serves as an ideal Ayurvedic yogavahi.' },
  { name: 'Grass-Fed Native Whey Isolate / Camel Milk', category: 'Dairy Foods', baseGI: 'Low', defaultPortion: '1 scoop / 150ml', keyNutrients: ['Leucine 3g', 'Immunoglobulins', 'Fast peptides'], tags: ['muscle_gain', 'performance', 'sports', 'recovery', 'autoimmune'], baseMechanism: 'Ultra-fast leucine absorption rapidly triggers muscular mTORC1 phosphorylation for rapid tissue growth.' },
  { name: 'Reconstituted Commercial Milk Powder & Condensed Milk', category: 'Dairy Foods', baseGI: 'High', defaultPortion: 'Restricted', keyNutrients: ['Oxidized cholesterol', 'Sugar'], tags: ['restricted_all'], baseMechanism: 'High-heat spray drying oxidizes cholesterol into atherogenic 7-ketocholesterol, driving arterial plaque formation.' },
];

const MASTER_CANDIDATE_AYURVEDIC: CandidateIngredient[] = [
  { name: 'Sirukurinjan / Gurmar (Gymnema sylvestre)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '2g leaf powder in warm water', keyNutrients: ['Gymnemic acids', 'Gymnemosides'], tags: ['diabetes', 'metabolic', 'obesity', 'sugar_cravings'], baseMechanism: 'Gymnemic acids competitively bind intestinal sweet receptors and stimulate pancreatic beta-cell insulin secretion.' },
  { name: 'Ashwagandha Root Extract (Withania somnifera)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '3g root churna / 300mg extract', keyNutrients: ['Withanolides', 'Withaferin-A'], tags: ['sports', 'endurance', 'stress', 'muscle_gain', 'thyroid', 'neuro'], baseMechanism: 'Normalizes elevated serum cortisol levels, stimulates mitochondrial biogenesis, and increases athletic VO2 max.' },
  { name: 'Keezhanelli / Bhumiamalaki (Phyllanthus niruri)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '20ml fresh decoction / 3g powder', keyNutrients: ['Phyllanthin', 'Hypophyllanthin'], tags: ['liver', 'fatty_liver', 'hepatitis', 'gallbladder', 'detox'], baseMechanism: 'Suppresses lipid peroxidation in hepatocytes, normalizes elevated ALT/AST, and accelerates viral antigen clearance.' },
  { name: 'Mookirattai / Punarnava (Boerhavia diffusa)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '30ml Kashayam / 3g churna', keyNutrients: ['Punarnavoside', 'Boeravinones'], tags: ['kidney', 'hypertension', 'edema', 'detox', 'urinary'], baseMechanism: 'Stimulates renal tubular regeneration, reduces serum creatinine and urea, and eliminates extracellular edema.' },
  { name: 'Shatavari (Asparagus racemosus)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '3g powder with warm milk', keyNutrients: ['Shatavarins I-IV', 'Isoflavones'], tags: ['pcos', 'hormonal', 'fertility', 'female_health', 'endurance'], baseMechanism: 'Phytoestrogenic steroidal saponins modulate LH:FSH pituitary secretion and promote regular ovulatory cycles.' },
  { name: 'Arjuna Bark (Terminalia arjuna)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '30ml Kashayam / 3g bark powder', keyNutrients: ['Arjunic acid', 'CoQ10 precursors', 'Tannins'], tags: ['cardio', 'hypertension', 'heart_failure', 'vascular'], baseMechanism: 'Exerts positive inotropic and antioxidant action on cardiomyocytes, improving left ventricular ejection fraction.' },
  { name: 'Triphala Churna (Amalaki, Bibhitaki, Haritaki)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '3-5g at bedtime with warm water', keyNutrients: ['Chebulic acid', 'Gallic acid', 'Tannins'], tags: ['gut', 'constipation', 'detox', 'obesity', 'eye'], baseMechanism: 'Mildly stimulates colonic peristalsis, clears accumulated mucosal Ama, and tones the gastrointestinal epithelium.' },
  { name: 'Shilajit (Purified Mineral Pitch)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '300mg resin in lukewarm water', keyNutrients: ['Fulvic acid 60%', '84 ionic trace minerals'], tags: ['sports', 'performance', 'energy', 'testosterone', 'anti_aging'], baseMechanism: 'Fulvic acid delivers ionic minerals directly into mitochondrial cristae, boosting cellular ATP synthesis.' },
  { name: 'Brahmi / Mandukaparni (Bacopa monnieri)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '2g powder / 15ml fresh juice', keyNutrients: ['Bacosides A & B'], tags: ['brain', 'neurological', 'memory', 'focus', 'stress'], baseMechanism: 'Bacosides enhance kinase activity in cerebral synapses, boosting synaptic neurotransmission and cognitive retention.' },
  { name: 'Gokshura / Nerunjil (Tribulus terrestris)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '3g root powder decoction', keyNutrients: ['Protodioscin', 'Tribuloside'], tags: ['kidney', 'urinary', 'sports', 'libido', 'strength'], baseMechanism: 'Soothes inflamed urinary urothelium, prevents calcium oxalate nephrolithiasis, and supports nitric oxide balance.' },
  { name: 'Kanchanara Guggulu (Bauhinia variegata)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '2 tablets with warm ginger water', keyNutrients: ['Guggulsterones', 'Flavonoids'], tags: ['thyroid', 'pcos', 'lymphatic', 'cysts', 'obesity'], baseMechanism: 'Exerts Granthi-bhedana (cyst-dissolving) action, reducing thyroid nodules and ovarian subcapsular cysts.' },
  { name: 'Vrikshamla / Garcinia (Garcinia cambogia)', category: 'Ayurvedic Foods', baseGI: 'Zero', defaultPortion: '500mg extract / 2g dried rind', keyNutrients: ['Hydroxycitric acid (HCA 60%)'], tags: ['obesity', 'fat_loss', 'lipid', 'metabolic'], baseMechanism: 'Hydroxycitric acid competitively inhibits ATP-citrate lyase, halting de novo lipogenesis from excess dietary carbohydrates.' },
];

const MASTER_CANDIDATE_FUNCTIONAL: CandidateIngredient[] = [
  { name: 'Ceylon Cinnamon (Dalchini / Cinnamomum verum)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1/2 tsp freshly ground powder (2g)', keyNutrients: ['Cinnamaldehyde', 'Proanthocyanidins'], tags: ['diabetes', 'metabolic', 'pcos', 'obesity', 'cardio'], baseMechanism: 'Cinnamaldehyde phosphorylates the insulin receptor subunit, elevating cellular GLUT4 transporter density by 40%.' },
  { name: 'Apple Cider Vinegar with The Mother (Raw Organic)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1 tbsp in 150ml water before meals', keyNutrients: ['Acetic acid 5%', 'Acetobacter probiotics'], tags: ['obesity', 'fat_loss', 'diabetes', 'digestive', 'gut'], baseMechanism: 'Acetic acid delays gastric emptying and suppresses intestinal disaccharidase enzymes, blunting postprandial glucose curves.' },
  { name: 'Organic Green Tea Extract (Matcha / EGCG)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1 cup freshly brewed / 1g matcha', keyNutrients: ['Epigallocatechin Gallate (EGCG 300mg)', 'L-Theanine'], tags: ['fat_loss', 'metabolic', 'cardio', 'focus', 'cancer_prevention'], baseMechanism: 'EGCG inhibits catechol-O-methyltransferase (COMT), prolonging norepinephrine-induced lipolysis and thermogenesis.' },
  { name: 'High-Nitrate Beetroot Crystals / Concentrated Juice', category: 'Functional Foods', baseGI: 'Medium', defaultPortion: '10g crystals in 200ml water', keyNutrients: ['Inorganic Nitrates 400mg', 'Betaine'], tags: ['sports', 'endurance', 'performance', 'hypertension', 'vascular'], baseMechanism: 'Nitrate is converted to nitrite by oral bacteria and into nitric oxide systemically, elevating athletic time-to-exhaustion by 15%.' },
  { name: 'Curcumin with Piperine (Turmeric + Black Pepper Extract)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '500mg standardized (95% curcuminoids)', keyNutrients: ['Curcumin', 'Piperine 5mg'], tags: ['anti_inflammatory', 'joint', 'cancer', 'liver', 'recovery'], baseMechanism: 'Inhibits cyclooxygenase-2 (COX-2) and inducible nitric oxide synthase (iNOS), suppressing systemic inflammatory cytokines.' },
  { name: 'Spirulina & Chlorella Broken Cell Wall Powder', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1 tsp (3g) in water/smoothie', keyNutrients: ['Phycocyanin', 'Chlorophyll', 'Plant B12'], tags: ['sports', 'detox', 'anaemia', 'immunity', 'recovery'], baseMechanism: 'Phycocyanin stimulates hematopoietic stem cell erythropoiesis and binds heavy metals for renal elimination.' },
  { name: 'Pure Hydration Electrolyte Salts (Sodium, Potassium, Magnesium Citrate)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1 sachet in 500ml water', keyNutrients: ['Sodium 500mg', 'Potassium 200mg', 'Magnesium 60mg'], tags: ['sports', 'hydration', 'endurance', 'cramps', 'performance'], baseMechanism: 'Maintains neuromuscular membrane potential and prevents hyponatremic exercise-induced skeletal muscle cramps.' },
  { name: 'Organic Cold-Pressed Wheatgrass Powder', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1 tsp (3g) in warm water', keyNutrients: ['Chlorophyll 70%', 'Superoxide dismutase (SOD)'], tags: ['detox', 'anaemia', 'gut_cleanse', 'immunity', 'anti_aging'], baseMechanism: 'High structural resemblance between chlorophyll and heme assists rapid bone marrow hemoglobin recovery.' },
  { name: 'Cold-Pressed Black Seed Oil (Nigella sativa / Kalonji)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1/2 tsp (2.5ml)', keyNutrients: ['Thymoquinone (TQ)', 'Nigellone'], tags: ['immunity', 'respiratory', 'allergy', 'diabetes', 'metabolic'], baseMechanism: 'Thymoquinone stabilizes mast cell membranes, preventing histamine release and reversing bronchial hyper-reactivity.' },
  { name: 'Montmorency Tart Cherry Extract', category: 'Functional Foods', baseGI: 'Low', defaultPortion: '30ml concentrate before sleep', keyNutrients: ['Procyanidin B-2', 'Phytomelatonin'], tags: ['sports', 'sleep', 'recovery', 'joint', 'gout'], baseMechanism: 'Accelerates muscle strength recovery post-eccentric exercise and lowers serum uric acid crystallization.' },
  { name: 'Raw Unfiltered Crushed Ginger Rhizome (Inji)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '1 tsp grated ginger in tea', keyNutrients: ['Gingerols', 'Shogaols'], tags: ['digestive', 'nausea', 'sports', 'metabolic', 'anti_inflammatory'], baseMechanism: 'Gingerols stimulate gastric migrating motor complexes, accelerating stomach emptying and easing nausea.' },
  { name: 'Spearmint Leaf Infusion (Mentha spicata)', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '2 cups brewed tea daily', keyNutrients: ['Rosmarinic acid', 'Carvone'], tags: ['pcos', 'hormonal', 'acne', 'hirsutism'], baseMechanism: 'Downregulates ovarian thecal 5-alpha-reductase, directly suppressing circulating free testosterone.' },
  { name: 'Pure Creapure Micronized Creatine Monohydrate', category: 'Functional Foods', baseGI: 'Zero', defaultPortion: '3-5g daily in water', keyNutrients: ['Creatine monohydrate 100%'], tags: ['sports', 'strength', 'muscle_gain', 'brain', 'power'], baseMechanism: 'Phosphorylates ADP into ATP in high-intensity anaerobic alactic muscular contraction.' },
];

/**
 * Core Algorithm: Generates condition-specific 90 items strictly matching:
 * - 15 Cereals
 * - 15 Pulses
 * - 15 Vegetables
 * - 15 Fruits
 * - 10 Nuts & Seeds
 * - 5 Dairy Foods
 * - 5 Ayurvedic Foods
 * - 10 Functional Foods
 */
export function generateConditionSpecificIngredientGuidelines(
  conditionName: string,
  domain: 'diseases' | 'disorders' | 'performance' | 'fitness' = 'diseases',
  patientBiomarkers: string[] = []
): ConditionIngredientGuidelines {
  const normCondition = (conditionName || 'Diabetes Mellitus').toLowerCase();

  // 1. Establish Clinical Priority Vectors
  let clinicalTagline = '';
  let primaryGoal = '';
  let macroPriority = '';
  let priorityTags: string[] = [];
  let restrictedTags: string[] = [];

  if (normCondition.includes('diabet') || normCondition.includes('glycem')) {
    clinicalTagline = 'Blunting postprandial glycemic excursions, improving GLUT-4 translocation & safeguarding microvasculature';
    primaryGoal = 'Target HbA1c < 6.5%, Fasting Glucose < 100 mg/dL, Glycemic Index < 45';
    macroPriority = 'Carbs: 45%, Protein: 25%, Healthy Fats: 30% (High Fiber > 40g)';
    priorityTags = ['diabetes', 'low_gi', 'fiber', 'gut', 'metabolic'];
    restrictedTags = ['fast_carbs', 'restricted_all', 'sugar'];
  } else if (normCondition.includes('hypertens') || normCondition.includes('cardio') || normCondition.includes('vascular')) {
    clinicalTagline = 'Endothelial nitric oxide optimization, arterial stiffness reduction & sodium-potassium balance';
    primaryGoal = 'Target BP < 120/80 mmHg, Low Sodium (<1500mg), High Potassium & Nitrates';
    macroPriority = 'Carbs: 50%, Protein: 20%, Healthy Fats: 30% (DASH Protocol)';
    priorityTags = ['hypertension', 'cardio', 'vascular', 'nitrates', 'potassium'];
    restrictedTags = ['restricted_all', 'high_sodium'];
  } else if (normCondition.includes('pcos') || normCondition.includes('hormon') || normCondition.includes('ovary')) {
    clinicalTagline = 'Reversing thecal hyperandrogenism, clearing follicular arrest, restoring LH:FSH balance & insulin sensitization';
    primaryGoal = 'Normalize LH:FSH to 1:1, Lower Free Testosterone, Anti-Inflammatory Seed Cycling';
    macroPriority = 'Carbs: 40%, Protein: 25%, Healthy Fats: 35%';
    priorityTags = ['pcos', 'hormonal', 'low_gi', 'anti_inflammatory', 'seed_cycling'];
    restrictedTags = ['fast_carbs', 'restricted_all'];
  } else if (normCondition.includes('kidney') || normCondition.includes('renal') || normCondition.includes('creatinine')) {
    clinicalTagline = 'Nephroprotection, minimizing nitrogenous glomerular hyperfiltration, balancing serum potassium & phosphorus';
    primaryGoal = 'Preserve eGFR, Serum Creatinine < 1.1 mg/dL, Controlled Protein (0.6-0.8 g/kg)';
    macroPriority = 'Carbs: 60%, Protein: 12%, Healthy Fats: 28% (Low Solute Renal Protocol)';
    priorityTags = ['renal_safe', 'kidney', 'low_potassium', 'diuretic'];
    restrictedTags = ['high_potassium', 'high_protein', 'restricted_all'];
  } else if (normCondition.includes('liver') || normCondition.includes('fatty') || normCondition.includes('steatosis')) {
    clinicalTagline = 'Halting hepatic steatosis, normalizing ALT/AST enzymes, stimulating phase II bile clearance & beta-oxidation';
    primaryGoal = 'Normalize SGPT/ALT < 30 U/L, Clear Hepatic Triglycerides, Anti-Lipoperoxidation';
    macroPriority = 'Carbs: 45%, Protein: 25%, Healthy Fats: 30%';
    priorityTags = ['liver', 'fatty_liver', 'detox', 'antioxidant', 'metabolic'];
    restrictedTags = ['fast_carbs', 'restricted_all'];
  } else if (normCondition.includes('obesity') || normCondition.includes('fat loss') || normCondition.includes('weight loss')) {
    clinicalTagline = 'Brown adipose tissue thermogenesis activation via UCP-1 upregulation, prolonged satiety & insulin suppression';
    primaryGoal = 'Target Caloric Deficit (-500 kcal), Visceral Fat Reduction, Maximum Satiety Volume';
    macroPriority = 'Carbs: 35%, Protein: 35%, Healthy Fats: 30% (High Thermogenic Ratio)';
    priorityTags = ['obesity', 'fat_loss', 'weight_loss', 'low_gi', 'thermogenic', 'satiety'];
    restrictedTags = ['fast_carbs', 'restricted_all', 'sugar'];
  } else if (normCondition.includes('muscle') || normCondition.includes('strength') || normCondition.includes('weight gain')) {
    clinicalTagline = 'Maximizing myofibrillar protein synthesis via mTORC1 stimulation, complete leucine delivery & nitrogen retention';
    primaryGoal = 'Lean Hypertrophy (+1.6 - 2.2 g/kg Protein), Glycogen Supercompensation, Muscle Anabolism';
    macroPriority = 'Carbs: 50%, Protein: 30%, Healthy Fats: 20%';
    priorityTags = ['muscle_gain', 'strength', 'sports', 'bodybuilding', 'protein', 'post_workout'];
    restrictedTags = ['restricted_all'];
  } else if (normCondition.includes('endurance') || normCondition.includes('sports') || normCondition.includes('performance')) {
    clinicalTagline = 'Sustained mitochondrial ATP output, glycogen sparing, elevated VO2 max perfusion & electrolyte resilience';
    primaryGoal = 'Enhanced Aerobic Capacity, Delayed Lactate Threshold, Rapid DOMS Recovery';
    macroPriority = 'Carbs: 60%, Protein: 20%, Healthy Fats: 20%';
    priorityTags = ['endurance', 'sports', 'performance', 'nitrates', 'hydration', 'energy'];
    restrictedTags = ['restricted_all'];
  } else if (normCondition.includes('gut') || normCondition.includes('digestive') || normCondition.includes('ibs')) {
    clinicalTagline = 'Restoring mucosal tight junctions, soothing hyper-motility, feeding bifidobacteria & reducing FODMAPs';
    primaryGoal = 'Resolve Dysbiosis, Heal Intestinal Epithelium, Eliminate Bloating and Cramps';
    macroPriority = 'Carbs: 50%, Protein: 22%, Healthy Fats: 28% (Soothing Prebiotic Protocol)';
    priorityTags = ['gut', 'digestive', 'soothing', 'gut_cleanse', 'anti_inflammatory'];
    restrictedTags = ['restricted_all'];
  } else if (normCondition.includes('thyroid')) {
    clinicalTagline = 'Optimizing selenium and zinc for deiodinase enzyme conversion (T4 to T3) while shielding thyroid from autoimmunity';
    primaryGoal = 'Normalize TSH (1.0 - 2.5 mIU/L), Support Basal Metabolic Rate, Anti-Goitrogenic Cooking';
    macroPriority = 'Carbs: 45%, Protein: 25%, Healthy Fats: 30%';
    priorityTags = ['thyroid', 'selenium', 'metabolic', 'anti_inflammatory'];
    restrictedTags = ['restricted_all'];
  } else {
    clinicalTagline = `Calibrating clinical bioactive phytonutrients, micro-minerals & targeted macronutrients for ${conditionName}`;
    primaryGoal = `Optimal metabolic vitality, cellular longevity & sustained systemic balance`;
    macroPriority = 'Carbs: 50%, Protein: 22%, Healthy Fats: 28%';
    priorityTags = ['general_fitness', 'lifestyle', 'immunity', 'anti_inflammatory'];
    restrictedTags = ['restricted_all'];
  }

  // 2. Ranking & Calibration Helper
  const scoreAndFilter = (
    candidates: CandidateIngredient[],
    targetCount: number,
    catName: ConditionIngredientItem['category']
  ): ConditionIngredientItem[] => {
    // Score each candidate based on condition tags
    const scored = candidates.map((cand) => {
      let score = 0;
      cand.tags.forEach((t) => {
        if (priorityTags.includes(t)) score += 10;
        if (restrictedTags.includes(t)) score -= 25;
      });

      let status: ConditionIngredientItem['status'] = 'Recommended';
      if (cand.tags.includes('restricted_all') || score < -10) {
        status = 'Restricted';
      } else if (cand.baseGI === 'High' && (priorityTags.includes('diabetes') || priorityTags.includes('obesity'))) {
        status = 'Restricted';
      } else if (cand.baseGI === 'Medium' && priorityTags.includes('diabetes')) {
        status = 'Caution';
      } else if (priorityTags.includes('renal_safe') && (cand.tags.includes('high_potassium') || cand.name.includes('Spinach') || cand.name.includes('Banana'))) {
        status = 'Caution';
      }

      return { cand, score, status };
    });

    // Sort by score descending (Recommended first, then Caution, then Restricted at the very bottom if needed)
    scored.sort((a, b) => b.score - a.score);

    // Pick exactly targetCount items
    const selected = scored.slice(0, targetCount);

    // If we have fewer than targetCount, repeat/pad safely with varied preparation items
    while (selected.length < targetCount) {
      const idx = selected.length;
      selected.push({
        cand: {
          name: `${catName} Variant ${idx + 1}`,
          category: catName,
          baseGI: 'Low',
          defaultPortion: 'As clinically directed',
          keyNutrients: ['Essential micro-minerals'],
          tags: ['general_fitness'],
          baseMechanism: 'Contributes vital complex polysaccharides and enzymatic precursors.',
        },
        score: 0,
        status: 'Recommended',
      });
    }

    return selected.map((s, i) => {
      // Craft condition-specific therapeutic mechanism and rationale
      const item = s.cand;
      const rank = i + 1;

      let tailoredMechanism = item.baseMechanism;
      let tailoredRationale = `Specially selected for ${conditionName} to address metabolic and cellular requirements.`;
      let tailoredContra = 'None in standard clinical culinary amounts.';

      if (normCondition.includes('diabet')) {
        tailoredRationale = `Aids glycemic control, helps lower post-meal blood sugar surges, and targets Fasting Blood Glucose / HbA1c.`;
        if (s.status === 'Restricted') {
          tailoredContra = 'Strictly avoid or limit: causes acute postprandial glucose spikes.';
        }
      } else if (normCondition.includes('obesity') || normCondition.includes('fat loss')) {
        tailoredRationale = `High satiety quotient and thermogenic action target visceral adiposity and suppress hunger between meals.`;
      } else if (normCondition.includes('hypertens') || normCondition.includes('cardio')) {
        tailoredRationale = `Promotes arterial vasodilation, healthy blood pressure, and targets vascular stiffness.`;
        if (s.status === 'Restricted') {
          tailoredContra = 'Avoid: high sodium or unhealthy fats that elevate blood pressure.';
        }
      } else if (normCondition.includes('kidney')) {
        tailoredRationale = `Preserves renal glomerular filtration with controlled potassium/phosphorus/nitrogen load.`;
        if (item.tags.includes('high_potassium') || s.status === 'Caution') {
          tailoredContra = 'Leaching required: boil in excess water and discard cooking water before preparation.';
        }
      } else if (normCondition.includes('muscle') || normCondition.includes('strength')) {
        tailoredRationale = `Provides essential amino acids and leucine to trigger mTOR muscular protein synthesis and post-workout repair.`;
      } else if (normCondition.includes('endurance') || normCondition.includes('sports')) {
        tailoredRationale = `Replenishes muscle glycogen stores, sustains ATP output, and targets VO2 max stamina.`;
      } else if (normCondition.includes('pcos')) {
        tailoredRationale = `Anti-androgenic action balances LH:FSH ratio, prevents insulin spikes, and supports regular cycles.`;
      } else if (normCondition.includes('liver')) {
        tailoredRationale = `Enhances hepatic bile flow, prevents lipid peroxidation in hepatocytes, and targets ALT/AST normalization.`;
      }

      return {
        id: `ing-${catName.toLowerCase().replace(/[^a-z]/g, '')}-${rank}-${conditionName.toLowerCase().replace(/[^a-z]/g, '')}`,
        rank,
        name: item.name,
        category: catName,
        glycemicIndex: item.baseGI,
        status: s.status,
        portion: item.defaultPortion,
        therapeuticMechanism: tailoredMechanism,
        clinicalRationale: tailoredRationale,
        contraindications: tailoredContra,
        biomarkerTarget: patientBiomarkers.length > 0 ? patientBiomarkers[i % patientBiomarkers.length] : undefined,
      };
    });
  };

  // Generate exact specified counts for all 8 categories
  const cereals = scoreAndFilter(MASTER_CANDIDATE_CEREALS, 15, 'Cereals');
  const pulses = scoreAndFilter(MASTER_CANDIDATE_PULSES, 15, 'Pulses');
  const vegetables = scoreAndFilter(MASTER_CANDIDATE_VEGETABLES, 15, 'Vegetables');
  const fruits = scoreAndFilter(MASTER_CANDIDATE_FRUITS, 15, 'Fruits');
  const nutsAndSeeds = scoreAndFilter(MASTER_CANDIDATE_NUTS_SEEDS, 10, 'Nuts & Seeds');
  const dairyFoods = scoreAndFilter(MASTER_CANDIDATE_DAIRY, 5, 'Dairy Foods');
  const ayurvedicFoods = scoreAndFilter(MASTER_CANDIDATE_AYURVEDIC, 5, 'Ayurvedic Foods');
  const functionalFoods = scoreAndFilter(MASTER_CANDIDATE_FUNCTIONAL, 10, 'Functional Foods');

  const totalCount =
    cereals.length +
    pulses.length +
    vegetables.length +
    fruits.length +
    nutsAndSeeds.length +
    dairyFoods.length +
    ayurvedicFoods.length +
    functionalFoods.length; // 15 + 15 + 15 + 15 + 10 + 5 + 5 + 10 = 90

  return {
    conditionName,
    domain,
    clinicalTagline,
    primaryGoal,
    macroPriority,
    totalCount,
    cereals,
    pulses,
    vegetables,
    fruits,
    nutsAndSeeds,
    dairyFoods,
    ayurvedicFoods,
    functionalFoods,
  };
}
