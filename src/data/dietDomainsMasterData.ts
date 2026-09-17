export interface DietDomainDefinition {
  id: string;
  name: string;
  tamilName: string;
  description: string;
  clinicalIndications: string[];
  macroRatio: { carbs: number; protein: number; fat: number };
  tag: string;
  keyRule: string;
}

export const DIET_DOMAINS_LIST: DietDomainDefinition[] = [
  {
    id: 'elimination',
    name: 'Gut Cleanse & Elimination Diet',
    tamilName: '',
    description: 'Systematic 12-day sequential reintroduction protocol identifying food sensitivities, clearing endotoxins, and restoring gut mucosal integrity.',
    clinicalIndications: ['IBSLeaky Gut', 'Food Sensitivities', 'Autoimmune Flares', 'Chronic Urticaria', 'Severe Bloating'],
    macroRatio: { carbs: 50, protein: 20, fat: 30 },
    tag: 'Gastro-Therapeutic',
    keyRule: 'Start with single ancestral grains, advance gradually from rice/millets to dairy/eggs/poultry.',
  },
  {
    id: 'balanced',
    name: 'Balanced Diet',
    tamilName: '',
    description: 'Scientifically proportioned whole-food diet meeting ICMR-NIN RDA guidelines with optimal micro and macronutrient distribution.',
    clinicalIndications: ['General Wellness', 'Metabolic Maintenance', 'Healthy Weight', 'Cardiometabolic Health'],
    macroRatio: { carbs: 55, protein: 20, fat: 25 },
    tag: 'ICMR Gold Standard',
    keyRule: 'Half plate non-starchy vegetables & keerai, quarter plate millets/grains, quarter plate lean protein.',
  },
  {
    id: 'low_carbs',
    name: 'Low Carbs Diet',
    tamilName: '',
    description: 'Restricted glycemic load (<100g net carbs/day) to blunt insulin secretion, mobilize visceral fat stores, and improve HbA1c.',
    clinicalIndications: ['Type 2 Diabetes', 'Insulin Resistance', 'PCOS', 'NAFLDFatty Liver', 'Visceral Obesity'],
    macroRatio: { carbs: 25, protein: 35, fat: 40 },
    tag: 'Glycemic Control',
    keyRule: 'Replace refined grains with soaked pulses, nuts, paneer, eggs, seeds, and leafy greens.',
  },
  {
    id: 'bland',
    name: 'Bland Diet (Blanded Diet)',
    tamilName: '',
    description: 'Non-irritating, soft, easily digestible foods low in fiber, acidity, and spices to rest the inflamed gastrointestinal tract.',
    clinicalIndications: ['Acute Gastritis', 'Peptic Ulcer Disease', 'GERDReflux', 'Post-Gastroenteritis Recovery'],
    macroRatio: { carbs: 60, protein: 20, fat: 20 },
    tag: 'Gastric Mucosal Healing',
    keyRule: 'Strictly zero chilies, raw garlic, deep-fried foods, acidic citrus, or excessive black pepper.',
  },
  {
    id: 'keto',
    name: 'Keto Diet (Therapeutic Ketogenic)',
    tamilName: '',
    description: 'Very low-carbohydrate (<30g net carbs), high-healthy-fat diet shifting hepatic metabolism into nutritional ketosis (beta-hydroxybutyrate).',
    clinicalIndications: ['Refractory Epilepsy', 'Severe Insulin Resistance', 'Neurological Protection', 'Rapid Metabolic Reset'],
    macroRatio: { carbs: 5, protein: 25, fat: 70 },
    tag: 'Ketogenic Axis',
    keyRule: 'Abundant cold-pressed oils, ghee, avocados, nuts, seeds, paneer, and eggs; zero sugar or starches.',
  },
  {
    id: 'soft',
    name: 'Soft Diet',
    tamilName: '',
    description: 'Mechanically soft, tender, easy-to-chew and swallow preparations without harsh seeds, tough skins, or chewy fibers.',
    clinicalIndications: ['ElderlyDentition Issues', 'Post-Oral Surgery', 'Mild Dysphagia', 'Convalescence'],
    macroRatio: { carbs: 55, protein: 20, fat: 25 },
    tag: 'Mechanical Comfort',
    keyRule: 'Steamed, stewed, mashed, or pureed textures with adequate moisture and digestible nutrients.',
  },
  {
    id: 'fluid',
    name: 'Fluid & Clear Fluid Diet',
    tamilName: '',
    description: 'Electrolyte-rich liquid nourishment requiring zero gastrointestinal digestion, leaving negligible intestinal residue.',
    clinicalIndications: ['Pre/Post-Colonoscopy', 'Acute GI Obstruction', 'Severe Dehydration', 'Post-Op Day 1'],
    macroRatio: { carbs: 70, protein: 15, fat: 15 },
    tag: 'Clinical Acute Care',
    keyRule: 'Strained soups, tender coconut water, kanji water, electrolyte water, clear broths, herbal infusions.',
  },
  {
    id: 'renal',
    name: 'Renal Diet (CKD Stage 1-4)',
    tamilName: '',
    description: 'Precision restriction of sodium (<1500mg), potassium, phosphorus, and regulated high-biological-value protein to preserve GFR.',
    clinicalIndications: ['Chronic Kidney Disease', 'Proteinuria', 'Elevated Serum Creatinine', 'Hyperkalemia Risk'],
    macroRatio: { carbs: 60, protein: 15, fat: 25 },
    tag: 'Nephrology Protocol',
    keyRule: 'Leach high-potassium vegetables, avoid packaged preservatives (phosphate additives), limit protein to 0.8g/kg.',
  },
  {
    id: 'cardiac',
    name: 'Cardiac Diet',
    tamilName: '',
    description: 'Cardioprotective lipid-modulating protocol rich in soluble beta-glucan fibers, plant sterols, polyphenols, and omega-3 fatty acids.',
    clinicalIndications: ['Coronary Artery Disease', 'DyslipidemiaHigh LDL', 'Elevated hs-CRP', 'Post-StentCABG'],
    macroRatio: { carbs: 50, protein: 25, fat: 25 },
    tag: 'Cardiovascular Defense',
    keyRule: 'Zero trans-fats; emphasize oats, barley, flaxseed, walnuts, garlic, and wild marine omega-3s.',
  },
  {
    id: 'low_sodium',
    name: 'Low Sodium Diet (DASH Model)',
    tamilName: '',
    description: 'DASH-aligned sodium restriction (<1,500mg/day) paired with potassium, magnesium, and calcium synergy to lower systemic vascular resistance.',
    clinicalIndications: ['Hypertension (BP >130/85)', 'Congestive Heart Failure', 'Fluid RetentionEdema', 'Ascites'],
    macroRatio: { carbs: 55, protein: 20, fat: 25 },
    tag: 'Antihypertensive',
    keyRule: 'Avoid all processed seasonings, papads, pickles, baking soda; season with lemon juice, amla, and herbs.',
  },
];

// ================= MASTER INGREDIENTS COLUMNS =================
export interface FoodItemSpec {
  id: string;
  name: string;
  tamilName: string;
  domainGoal: string;
  gi: 'Low' | 'Medium' | 'High' | 'Zero';
  benefits: string;
}

export interface MasterFoodGroupsTable {
  cereals: FoodItemSpec[]; // 15
  pulses: FoodItemSpec[]; // 15
  vegetables: FoodItemSpec[]; // 15
  fruits: FoodItemSpec[]; // 15
  nutsAndSeeds: FoodItemSpec[]; // 10
  dairy: FoodItemSpec[]; // 10
  meatAndSea: FoodItemSpec[]; // 10
  oilsAndFats: FoodItemSpec[]; // 5
}

export const masterFoodGroupsData: MasterFoodGroupsTable = {
  // 15 Cereals & Millets
  cereals: [
    { id: 'c1', name: 'Foxtail Millet (Kangni)', tamilName: '', domainGoal: 'Steady Glycemia & Gut Repair', gi: 'Low', benefits: 'Rich in insoluble dietary fiber (8g/100g) and magnesium.' },
    { id: 'c2', name: 'Finger Millet (Ragi)', tamilName: '', domainGoal: 'Bone Density & Sustained Energy', gi: 'Medium', benefits: 'Highest calcium of any grain (344mg/100g); lowers post-prandial spikes.' },
    { id: 'c3', name: 'Little Millet', tamilName: '', domainGoal: 'Visceral Fat Clearance', gi: 'Low', benefits: 'High iron content (9.3mg/100g) and low glycemic index.' },
    { id: 'c4', name: 'Kodo Millet', tamilName: '', domainGoal: 'Hepatic Detox & Antioxidant', gi: 'Low', benefits: 'Phenolic polyphenols inhibit glycation end-products.' },
    { id: 'c5', name: 'Barnyard Millet', tamilName: '', domainGoal: 'Cardiometabolic & Thyroid Support', gi: 'Low', benefits: 'Highest fiber (10.1g/100g); rapid gastric satiety.' },
    { id: 'c6', name: 'Pearl Millet (Bajra)', tamilName: '', domainGoal: 'Insulin Resistance & Anemia', gi: 'Medium', benefits: 'Rich in zinc (3.1mg) and phosphorus; alkalizes systemic pH.' },
    { id: 'c7', name: 'Sorghum (Jowar)', tamilName: '', domainGoal: 'Endothelial & Lipid Regulation', gi: 'Low', benefits: 'Gluten-free, policosanols inhibit cholesterol synthesis.' },
    { id: 'c8', name: 'Steel-Cut Oats', tamilName: '', domainGoal: 'Beta-Glucan Cholesterol Clearance', gi: 'Low', benefits: 'Beta-glucan soluble fiber traps bile acids, reducing ApoB.' },
    { id: 'c9', name: 'Brown Rice (Single Polished)', tamilName: '', domainGoal: 'Colon Butyrate Production', gi: 'Medium', benefits: 'Intact aleurone layer provides B-vitamins and oryzanol.' },
    { id: 'c10', name: 'Red Rice (KattuyanamMappillai Samba)', tamilName: '', domainGoal: 'Stamina, Nerve Strength & Iron', gi: 'Low', benefits: 'Proanthocyanidins boost nitric oxide and microvascular perfusion.' },
    { id: 'c11', name: 'Barley (Jau)', tamilName: '', domainGoal: 'Renal Diuresis & Satiety', gi: 'Low', benefits: 'Alkalizing grain, aids kidney microfiltration and reduces edema.' },
    { id: 'c12', name: 'Quinoa', tamilName: '', domainGoal: 'Complete Amino Acid Profile', gi: 'Low', benefits: 'All 9 essential amino acids; high lysine for tissue rebuilding.' },
    { id: 'c13', name: 'Proso Millet', tamilName: '', domainGoal: 'Nervous System & Memory', gi: 'Low', benefits: 'High lecithin content strengthens cholinergic neural pathways.' },
    { id: 'c14', name: 'Broken Wheat (DaliaSamba Wheat)', tamilName: '', domainGoal: 'Digestive Motility & Bulking', gi: 'Medium', benefits: 'Insoluble bran increases stool volume and regular transit.' },
    { id: 'c15', name: 'Buckwheat (Kuttu)', tamilName: '', domainGoal: 'Vascular Capillary Strength', gi: 'Low', benefits: 'Rutin flavonoid prevents capillary fragility and microaneurysms.' },
  ],

  // 15 Pulses & Legumes
  pulses: [
    { id: 'p1', name: 'Whole Green Gram (Sabut Moong)', tamilName: '', domainGoal: 'Gentle Gut Cleansing & Protein', gi: 'Low', benefits: 'Most easily digestible pulse, minimal flatulence, rich in oligosaccharides.' },
    { id: 'p2', name: 'Split Yellow Moong Dal', tamilName: '', domainGoal: 'Convalescence & Gastric Rest', gi: 'Low', benefits: 'Soothes stomach mucosal lining; low sulfur gas production.' },
    { id: 'p3', name: 'Black GramUrad Dal (Skinned/Whole)', tamilName: '', domainGoal: 'Reproductive & Musculoskeletal', gi: 'Low', benefits: 'High mucilage content protects enterocyte tight junctions.' },
    { id: 'p4', name: 'Bengal GramChana Dal', tamilName: '', domainGoal: 'Sustained Glycemic Satiety', gi: 'Low', benefits: 'Extremely low GI (GI 8); blunts post-meal insulin spikes.' },
    { id: 'p5', name: 'Horse Gram (Kollu)', tamilName: '', domainGoal: 'Visceral Fat Burning & Diuresis', gi: 'Low', benefits: 'Astringent polyphenol properties clear Kapha phlegm and mobilize adipocytes.' },
    { id: 'p6', name: 'CowpeasBlack-Eyed Peas (Karamani)', tamilName: '', domainGoal: 'Cardiac Folate & Satiety', gi: 'Low', benefits: 'High folate and thiamine support homocysteine metabolism.' },
    { id: 'p7', name: 'Pigeon PeaToor Dal', tamilName: '', domainGoal: 'Core Dietary Protein Matrix', gi: 'Low', benefits: 'Essential staple providing branched chain amino acids.' },
    { id: 'p8', name: 'Kidney Beans (Rajma)', tamilName: '', domainGoal: 'Molybdenum & Phase 2 Detox', gi: 'Low', benefits: 'High resistant starch feeds beneficial butyrate producers in colon.' },
    { id: 'p9', name: 'ChickpeasKabuli Chana', tamilName: '', domainGoal: 'Serotonin & Satiety Axis', gi: 'Low', benefits: 'Rich in tryptophan and Vitamin B6 for mental tranquility.' },
    { id: 'p10', name: 'Moth Beans (Matki)', tamilName: '', domainGoal: 'Zinc Replenishment & Healing', gi: 'Low', benefits: 'Sprouted form elevates enzymatic bioavailability 300%.' },
    { id: 'p11', name: 'Soybeans (Non-GMOEdamame)', tamilName: '', domainGoal: 'Isoflavones & Muscle Mass', gi: 'Low', benefits: 'Complete protein (36g/100g); genistein regulates lipid levels.' },
    { id: 'p12', name: 'Red Lentils (Masoor Dal)', tamilName: '', domainGoal: 'Iron Delivery & Quick Digestion', gi: 'Low', benefits: 'High iron (7.6mg/100g); cooks rapidly with gentle texture.' },
    { id: 'p13', name: 'Green Peas (DryFresh Pattani)', tamilName: '', domainGoal: 'Chlorophyllin & Vitamin K', gi: 'Low', benefits: 'Coumestrol polyphenol protects gastric mucosal cells.' },
    { id: 'p14', name: 'Sprouted Mixed Legumes', tamilName: '', domainGoal: 'Digestive Enzyme Activation', gi: 'Low', benefits: 'Sprouting degrades phytates, tripling mineral absorption.' },
    { id: 'p15', name: 'Double BeansLima Beans', tamilName: '', domainGoal: 'Soluble Fiber Colonic Bulking', gi: 'Low', benefits: 'Massive prebiotic fiber fuel for Bifidobacterium species.' },
  ],

  // 15 Vegetables
  vegetables: [
    { id: 'v1', name: 'Moringa Leaves (Drumstick Keerai)', tamilName: '', domainGoal: 'Superfood Iron & Antioxidant', gi: 'Low', benefits: '28 essential bio-nutrients, 4x calcium of milk, potent anti-inflammatory.' },
    { id: 'v2', name: 'Bottle Gourd (Lauki)', tamilName: '', domainGoal: 'Electrolyte Hydration & Liver Cooling', gi: 'Low', benefits: '96% structured water; reduces systemic heat and acidic urine.' },
    { id: 'v3', name: 'Ash Gourd (White PumpkinPusanikai)', tamilName: '', domainGoal: 'Gut Cleansing & Alkalinization', gi: 'Low', benefits: 'Supreme alkalizer; sweeps GI mucosal toxins and cools Pitta.' },
    { id: 'v4', name: 'Ridge Gourd (Peerkangai)', tamilName: '', domainGoal: 'Cellulose Motility & Blood Purification', gi: 'Low', benefits: 'Dietary cellulose stimulates peristalsis without irritating colitis.' },
    { id: 'v5', name: 'Bitter Gourd (Karela)', tamilName: '', domainGoal: 'Charantin Beta-Cell Stimulation', gi: 'Low', benefits: 'Charantin and polypeptide-p act as plant insulin analogues.' },
    { id: 'v6', name: 'Ivy Gourd (KovakkaiTindora)', tamilName: '', domainGoal: 'Enzyme Glycolysis Acceleration', gi: 'Low', benefits: 'Regulates glucose-6-phosphatase; proven diabetic therapeutic.' },
    { id: 'v7', name: 'Ladies FingerOkra (Bhindi)', tamilName: '', domainGoal: 'Mucilaginous Mucosal Barrier', gi: 'Low', benefits: 'Soluble mucilage coats gastric lining, blunts sugar absorption.' },
    { id: 'v8', name: 'SpinachPalak', tamilName: '', domainGoal: 'Lutein & Folate Regeneration', gi: 'Low', benefits: 'Nitrates boost microvascular endothelial nitric oxide.' },
    { id: 'v9', name: 'Amaranth Leaves (Thandu Keerai)', tamilName: '', domainGoal: 'Calcium & Bone Re-mineralization', gi: 'Low', benefits: 'High bio-available calcium and potassium with zero sodium.' },
    { id: 'v10', name: 'Snake Gourd (Pudalangai)', tamilName: '', domainGoal: 'Fever Cooling & Bile Regulation', gi: 'Low', benefits: 'Stimulates sluggish gallbladder bile flow and reduces acidity.' },
    { id: 'v11', name: 'Fenugreek Leaves (Methi Keerai)', tamilName: '', domainGoal: 'Delayed Carbohydrate Hydrolysis', gi: 'Low', benefits: '4-hydroxyisoleucine stimulates glucose-dependent insulin release.' },
    { id: 'v12', name: 'Curry Leaves (Karuveppilai)', tamilName: '', domainGoal: 'Mahanimbine Lipid Metabolism', gi: 'Low', benefits: 'Carbazole alkaloids inhibit pancreatic lipase and protect hair roots.' },
    { id: 'v13', name: 'Raw BananaPlantain (Vazhaikkai)', tamilName: '', domainGoal: 'Resistant Starch Prebiotic Type 2', gi: 'Low', benefits: 'Passes unhydrolyzed to colon, generating acetate and butyrate.' },
    { id: 'v14', name: 'Banana Stem (Vazhaithandu)', tamilName: '', domainGoal: 'Lithotriptic Renal Stone Dissolution', gi: 'Low', benefits: 'High potassium and astringent juices dissolve kidney calculi.' },
    { id: 'v15', name: 'Broccoli & Cabbage', tamilName: '', domainGoal: 'Sulforaphane Nrf2 Phase 2 Detox', gi: 'Low', benefits: 'Glucosinolates induce antioxidant response element pathways.' },
  ],

  // 15 Fruits
  fruits: [
    { id: 'f1', name: 'Indian Gooseberry (Amla)', tamilName: '', domainGoal: 'Triphala Core Vitamin C Immunity', gi: 'Low', benefits: '600mg Vitamin C/100g; tannin-bound, heat-stable antioxidant.' },
    { id: 'f2', name: 'Guava (Koyya Pazham)', tamilName: '', domainGoal: 'Lycopene & Glycemic Satiety', gi: 'Low', benefits: '5x Vitamin C of orange; high pectin fiber stabilizes insulin.' },
    { id: 'f3', name: 'Papaya (Pappali)', tamilName: '', domainGoal: 'Papain Proteolytic Enzyme Digestion', gi: 'Medium', benefits: 'Papain enzyme cleaves tough dietary protein peptide bonds.' },
    { id: 'f4', name: 'Pomegranate (Mathulai)', tamilName: '', domainGoal: 'Punicalagin Arterial Cleansing', gi: 'Low', benefits: 'Reverses carotid intima-media arterial plaque thickness.' },
    { id: 'f5', name: 'Green Apple', tamilName: '', domainGoal: 'Malic Acid Gallbladder Softening', gi: 'Low', benefits: 'Malic acid dissolves biliary sludge; pectin feeds Akkermansia.' },
    { id: 'f6', name: 'Black Jamun (Naval Pazham)', tamilName: '', domainGoal: 'Jamboline Anti-Diabetic Seed', gi: 'Low', benefits: 'Jamboline stops pathological conversion of starch to glucose.' },
    { id: 'f7', name: 'MuskmelonCantaloupe', tamilName: '', domainGoal: 'Renal Flush & Satiety', gi: 'Medium', benefits: 'Adenosine prevents microvascular clotting; deep cellular hydration.' },
    { id: 'f8', name: 'Watermelon (with Seeds)', tamilName: '', domainGoal: 'Citrulline Vasodilation', gi: 'Medium', benefits: 'L-citrulline converts to L-arginine for endothelial nitric oxide.' },
    { id: 'f9', name: 'Wood Apple (Vilam Pazham)', tamilName: '', domainGoal: 'Gastrointestinal Dysentery Defense', gi: 'Low', benefits: 'Tannins cure chronic intestinal dysentery and tone gut sphincters.' },
    { id: 'f10', name: 'MosambiSweet Lime', tamilName: '', domainGoal: 'Citrate Alkaline Reserve', gi: 'Low', benefits: 'Potassium citrate prevents uric acid stone formation.' },
    { id: 'f11', name: 'Dragon Fruit (Pitaya)', tamilName: '', domainGoal: 'Betacyanin Colon Cleansing', gi: 'Low', benefits: 'Prebiotic oligosaccharides increase Bifidobacteria count.' },
    { id: 'f12', name: 'BlueberriesIndian Berries (Phalsa)', tamilName: '', domainGoal: 'Anthocyanin Retinopathy Protection', gi: 'Low', benefits: 'Protects retinal microvasculature from diabetic sorbitol damage.' },
    { id: 'f13', name: 'Kiwi Fruit', tamilName: '', domainGoal: 'Actinidin Enzyme & Sleep Induction', gi: 'Low', benefits: 'Rich in serotonin precursors and enzyme actinidin for bowel motility.' },
    { id: 'f14', name: 'OrangeCitrus', tamilName: '', domainGoal: 'Hesperidin Bioflavonoid Defense', gi: 'Low', benefits: 'Hesperidin lowers systemic diastolic blood pressure.' },
    { id: 'f15', name: 'Figs (FreshAnjeer)', tamilName: '', domainGoal: 'Ficin Laxative & Iron', gi: 'Medium', benefits: 'Soft soluble mucilage ensures gentle spontaneous elimination.' },
  ],

  // 10 Nuts & Seeds
  nutsAndSeeds: [
    { id: 'n1', name: 'Soaked Almonds (Badam)', tamilName: '', domainGoal: 'Vitamin E & Alpha-Tocopherol', gi: 'Low', benefits: 'Peeling soaked skin removes phytates, unleashing bioavailable zinc.' },
    { id: 'n2', name: 'Walnuts (Akhrot)', tamilName: '', domainGoal: 'Alpha-Linolenic Acid (ALA) Brain', gi: 'Low', benefits: 'Plant omega-3 lowers neuro-inflammation and serum LDL.' },
    { id: 'n3', name: 'Pumpkin Seeds (Poosani Vithai)', tamilName: '', domainGoal: 'Zinc & Tryptophan Prostate/Sleep', gi: 'Low', benefits: '7.8mg zinc/100g; vital for insulin crystallization and testosterone.' },
    { id: 'n4', name: 'White & Black Sesame Seeds (Til)', tamilName: '', domainGoal: 'Sesamin Lignans & Calcium Peak', gi: 'Low', benefits: '1,450mg calcium/100g; sesamin inhibits lipogenesis in liver.' },
    { id: 'n5', name: 'Flaxseeds (AlsiLinseeds)', tamilName: '', domainGoal: 'Secoisolariciresinol Diglucoside (SDG)', gi: 'Low', benefits: 'Rich source of mammalian lignan precursors regulating estrogen balance.' },
    { id: 'n6', name: 'Chia Seeds', tamilName: '', domainGoal: 'Hydrophilic Gel Colonic Mucin', gi: 'Low', benefits: 'Absorbs 12x water weight, slowing post-meal carbohydrate absorption.' },
    { id: 'n7', name: 'Sunflower Seeds', tamilName: '', domainGoal: 'Selenium & Folate Cellular Shield', gi: 'Low', benefits: 'Cofactor for thyroid iodothyronine deiodinase enzyme.' },
    { id: 'n8', name: 'Brazil Nuts (1-2 units/day)', tamilName: '', domainGoal: 'Targeted Therapeutic Selenium', gi: 'Low', benefits: 'Single nut provides 90mcg selenium, meeting 100% daily RDA.' },
    { id: 'n9', name: 'Pistachios (Pista)', tamilName: '', domainGoal: 'Lutein, Zeaxanthin & Arginine', gi: 'Low', benefits: 'Highest potassium of all nuts; improves arterial flow.' },
    { id: 'n10', name: 'Garden Cress Seeds (AlivHaleem)', tamilName: '', domainGoal: 'Emergency Ferritin Restorer', gi: 'Low', benefits: '100mg iron/100g; raises hemoglobin and relieves amenorrhea.' },
  ],

  // 10 Dairy & Plant Alternatives
  dairy: [
    { id: 'd1', name: 'Cultured A2 Cow Milk CurdYogurt', tamilName: '', domainGoal: 'Live Probiotics & Calcium', gi: 'Low', benefits: 'Lactobacillus casei and bulgaricus acidify gut, halting pathogen growth.' },
    { id: 'd2', name: 'Spiced Buttermilk (ChaasNeer Mor)', tamilName: '', domainGoal: 'Cooling Pitta & Microflora Fuel', gi: 'Zero', benefits: 'Diluted 1:4 with water; electrolytes quench dehydration and acidity.' },
    { id: 'd3', name: 'Fresh A2 Cow Paneer', tamilName: '', domainGoal: 'Slow-Release Micellar Casein', gi: 'Low', benefits: 'Zero carbohydrates; sustains amino acid delivery for 6 hours.' },
    { id: 'd4', name: 'A2 Desi Cow Bilona Ghee', tamilName: '', domainGoal: 'Butyric Acid Enterocyte Fuel', gi: 'Zero', benefits: 'Direct short-chain fatty acid feeding colonocyte repair without bile strain.' },
    { id: 'd5', name: 'Non-GMO Organic Tofu', tamilName: '', domainGoal: 'Soy Protein & Mineral Matrix', gi: 'Low', benefits: '100% plant protein with zero saturated fat and high calcium.' },
    { id: 'd6', name: 'Tempeh (Fermented Whole Soy)', tamilName: '', domainGoal: 'Probiotic-Cultured Pre-Digested Protein', gi: 'Low', benefits: 'Rhizopus oligosporus fermentation strips anti-nutrients.' },
    { id: 'd7', name: 'Fresh Coconut Milk (Cold-Extracted)', tamilName: '', domainGoal: 'Lauric Acid Antimicrobial', gi: 'Low', benefits: 'Monolaurin disintegrates viral and fungal bacterial lipid membranes.' },
    { id: 'd8', name: 'Almond Milk (Unsweetened Homemade)', tamilName: '', domainGoal: 'Dairy-Free Hypoallergenic Creaminess', gi: 'Zero', benefits: 'Free of lactose and casein; gentle on sensitive bowels.' },
    { id: 'd9', name: 'Oat Milk (Gluten-Free Cultured)', tamilName: '', domainGoal: 'Soluble Beta-Glucan Fluid', gi: 'Low', benefits: 'Creamy texture providing gentle prebiotics.' },
    { id: 'd10', name: 'Hemp Seed Milk', tamilName: '', domainGoal: 'Optimal 3:1 Omega 6:3 Ratio', gi: 'Zero', benefits: 'Edestin and albumin proteins ensure rapid gastric absorption.' },
  ],

  // 10 Meat, Seafood & Marine (with High-Grade Plant Options)
  meatAndSea: [
    { id: 'm1', name: 'Pastured Whole Eggs (BoiledPoached)', tamilName: '', domainGoal: 'Choline & Highest Biological Value (100 BV)', gi: 'Zero', benefits: 'Lecithin and lutein protect neurological myelin and retinas.' },
    { id: 'm2', name: 'Indian Mackerel (Ayila Meen)', tamilName: '', domainGoal: 'Direct EPA & DHA Omega-3', gi: 'Zero', benefits: 'Small pelagic fish free from heavy metals; suppresses inflammatory CRP.' },
    { id: 'm3', name: 'Sardines (MathiChaala Meen)', tamilName: '', domainGoal: 'Marine Calcium, CoQ10 & Vitamin D', gi: 'Zero', benefits: 'Eaten whole with bones; delivers 380mg calcium and 480 IU Vitamin D.' },
    { id: 'm4', name: 'Wild Anchovies (Nethili Meen)', tamilName: '', domainGoal: 'Microvascular Endothelial Protection', gi: 'Zero', benefits: 'High selenium and glycine; anti-inflammatory marine peptide profile.' },
    { id: 'm5', name: 'Organic Country Chicken Breast', tamilName: '', domainGoal: 'Lean Leucine Muscle Anabolism', gi: 'Zero', benefits: '31g protein/100g with zero carbohydrates; low subcutaneous fat.' },
    { id: 'm6', name: 'Grass-Fed Mutton Bone Broth', tamilName: '', domainGoal: 'Type II Collagen & Glutamine', gi: 'Zero', benefits: 'Rich in proline, glycine, and glutamine healing gut tight junctions.' },
    { id: 'm7', name: 'Freshwater RohuCatla (Murrel Fish)', tamilName: '', domainGoal: 'Traditional Post-Operative Tissue Healing', gi: 'Zero', benefits: 'Siddha-prescribed fish for accelerating surgical wound healing.' },
    { id: 'm8', name: 'Spirulina & Chlorella (Marine Algae)', tamilName: '', domainGoal: 'Phycocyanin Immune & Heavy Metal Chelator', gi: 'Zero', benefits: '65% protein by dry weight; binds free circulating heavy metals.' },
    { id: 'm9', name: 'PrawnsShrimps (Steamed)', tamilName: '', domainGoal: 'Astaxanthin Antioxidant Shield', gi: 'Zero', benefits: 'Astaxanthin passes blood-retinal barrier; 6,000x stronger than Vitamin C.' },
    { id: 'm10', name: 'Nutritional Yeast Flakes (B-Complex Vegan)', tamilName: '', domainGoal: 'Bio-Fermented Cobalamin & Zinc', gi: 'Zero', benefits: 'Fortified with methylation-ready B-vitamins and savory umami.' },
  ],

  // 5 Healthy Fats & Cold-Pressed Oils
  oilsAndFats: [
    { id: 'o1', name: 'Wood-Pressed Cold Sesame Oil (Gingelly)', tamilName: '', domainGoal: 'Sesamol Lignans & Thermal Stability', gi: 'Zero', benefits: 'Rich in sesamol and sesamolin; resists thermal oxidation during cooking.' },
    { id: 'o2', name: 'Extra Virgin Cold-Pressed Mustard Oil', tamilName: '', domainGoal: 'Allyl Isothiocyanate & Cardiac Flow', gi: 'Zero', benefits: 'Naturally antimicrobial; warms digestive Agni and clears sluggish bile.' },
    { id: 'o3', name: 'Cold-Pressed Virgin Coconut Oil', tamilName: '', domainGoal: 'Medium-Chain Triglycerides (MCTs)', gi: 'Zero', benefits: 'Lauric and caprylic acids absorbed straight into portal vein for instant ATP.' },
    { id: 'o4', name: 'Pure Extra Virgin Olive Oil (Raw Drizzle)', tamilName: '', domainGoal: 'Oleocanthal Anti-Inflammatory', gi: 'Zero', benefits: 'Phenolic oleocanthal mimics biological action of ibuprofen in joint relief.' },
    { id: 'o5', name: 'Cold-Pressed Flaxseed Oil (Cold Use Only)', tamilName: '', domainGoal: 'Highest Terrestrial Alpha-Linolenic Acid', gi: 'Zero', benefits: '55% ALA omega-3; keeps platelet aggregation low and blood viscosity clean.' },
  ],
};

// ================= 10 AYURVEDIC & SIDDHA FUNCTIONAL FOODS =================
export interface FunctionalFoodAyurSiddha {
  id: string;
  name: string;
  tamilName: string;
  system: 'Ayurveda' | 'Siddha' | 'Ayur-Siddha Synergy';
  dosage: string;
  methodOfPrep: string;
  timing: string;
  therapeuticBenefit: string;
  contraindications: string;
}

export const ayurSiddhaFunctionalFoods: FunctionalFoodAyurSiddha[] = [
  {
    id: 'as1',
    name: 'Methi Infusion (VendhayamFenugreek)',
    tamilName: '',
    system: 'Ayur-Siddha Synergy',
    dosage: '1 tsp (5g) whole seeds',
    methodOfPrep: 'Soaked overnight in 150ml warm water; chew swollen seeds and drink the mucilage water.',
    timing: '5:00 AM - 5:30 AM (Empty stomach on waking)',
    therapeuticBenefit: 'Stimulates pancreatic insulin synthesis via 4-hydroxyisoleucine; coats and cools inflamed stomach mucosa.',
    contraindications: 'Caution in severe active diarrhea; safe in pregnancy under 5g.',
  },
  {
    id: 'as2',
    name: 'Triphala Chooranam (Kadukkai, Nellikai, Thandrikai)',
    tamilName: '',
    system: 'Ayur-Siddha Synergy',
    dosage: '1/2 to 1 tsp (3g - 5g)',
    methodOfPrep: 'Mixed in 100ml lukewarm water or raw forest honey.',
    timing: '9:30 PM (30 minutes before bedtime)',
    therapeuticBenefit: 'Gentle colon tonic (Rasayana), stimulates downward Apana Vayu, cleanses mucosal crypts without habituation.',
    contraindications: 'Do not use during acute watery dehydrating diarrhea.',
  },
  {
    id: 'as3',
    name: 'Nilavembu & Moringa Synergy (Kasamardha)',
    tamilName: '',
    system: 'Siddha',
    dosage: '10g fresh Moringa leaves + 1/4 tsp Nilavembu',
    methodOfPrep: 'Boiled with 200ml water, crushed black pepper, and cumin until reduced to 100ml.',
    timing: '11:00 AM or 5:00 PM (Mid-morning or evening)',
    therapeuticBenefit: 'Andrographolide stimulates hepatic glutathione s-transferase; clears high Kapha toxins and blood sluggishness.',
    contraindications: 'Avoid high Nilavembu doses during early pregnancy.',
  },
  {
    id: 'as4',
    name: 'CCF Decoction (Cumin, Coriander, Fennel)',
    tamilName: '',
    system: 'Ayurveda',
    dosage: '1/2 tsp each (Jeera, Dhaniya, Saunf)',
    methodOfPrep: 'Crushed and boiled in 500ml water for 7 minutes, kept in flask and sipped warm throughout the day.',
    timing: 'Sipped between meals (10:30 AM & 4:30 PM)',
    therapeuticBenefit: 'Kindles digestive fire (Deepana) and digests metabolic endotoxins (Pachana) without aggravating Pitta heat.',
    contraindications: 'Safe for all ages; excellent for pregnancy and lactation.',
  },
  {
    id: 'as5',
    name: 'Ashwagandha Rasayana (Withania somnifera)',
    tamilName: '',
    system: 'Ayur-Siddha Synergy',
    dosage: '1/2 tsp (3g)',
    methodOfPrep: 'Blended in warm almond milk or spiced golden buttermilk with a pinch of nutmeg.',
    timing: 'Bedtime (9:00 PM)',
    therapeuticBenefit: 'Withanolides blunt evening cortisol surges, restore adrenal resilience, improve REM sleep and insulin sensitivity.',
    contraindications: 'Discontinue 2 weeks before elective surgeries; monitor in hyperthyroidism.',
  },
  {
    id: 'as6',
    name: 'Manjal & Milagu (Turmeric & Black Pepper Golden Elixir)',
    tamilName: '',
    system: 'Ayur-Siddha Synergy',
    dosage: '1/2 tsp organic turmeric + 1/8 tsp freshly ground black pepper',
    methodOfPrep: 'Simmered with 5ml A2 cow ghee or warm milk for 3 minutes to optimize curcumin lipid solubility.',
    timing: 'Early morning or Bedtime',
    therapeuticBenefit: 'Piperine increases curcumin bioavailability by 2,000%; powerful blocker of NF-kB pro-inflammatory signaling.',
    contraindications: 'Avoid therapeutic high doses if experiencing active gallstone obstruction.',
  },
  {
    id: 'as7',
    name: 'Nellikai Rasayana (Wild Indian Gooseberry Paste)',
    tamilName: '',
    system: 'Siddha',
    dosage: '1 whole fresh fruit or 1 tbsp fresh pulp',
    methodOfPrep: 'Crushed fresh with 2 curry leaves and pinch of rock salt; diluted in 50ml water.',
    timing: '7:30 AM (With or before breakfast)',
    therapeuticBenefit: 'Cooling Pitta pacifier; stabilizes mast cells, enhances iron absorption and rejuvenates vascular endothelium.',
    contraindications: 'Avoid taking cold at night if prone to sinus congestion.',
  },
  {
    id: 'as8',
    name: 'Athimadhuram (YashtimadhuLicorice Root)',
    tamilName: '',
    system: 'Siddha',
    dosage: '1/2 tsp (2g) root powder',
    methodOfPrep: 'Brewed as warm infusion in 100ml water.',
    timing: '20 minutes before lunch or dinner',
    therapeuticBenefit: 'Glycyrrhizin stimulates mucous secretion and prostaglandins, directly healing gastric ulcers and esophageal burns.',
    contraindications: 'Limit continuous use to 4 weeks if severe uncontrolled hypertension is present.',
  },
  {
    id: 'as9',
    name: 'SukkuInji Kashayam (Dry Ginger & Coriander)',
    tamilName: '',
    system: 'Siddha',
    dosage: '1/2 tsp crushed dry ginger + palm jaggery (Karupatti)',
    methodOfPrep: 'Boiled with water, tulsi leaves, and coriander seeds.',
    timing: '4:00 PM (Afternoon digestive stimulant)',
    therapeuticBenefit: 'Gingerols accelerate gastric emptying, relieve post-prandial fullness and dissipate intestinal gas.',
    contraindications: 'Avoid in severe bleeding hemorrhoids or peptic ulcer perforation.',
  },
  {
    id: 'as10',
    name: 'Karuveppilai Thuvaiyal (Medicinal Curry Leaf Paste)',
    tamilName: '',
    system: 'Siddha',
    dosage: '1 to 2 tablespoons fresh paste',
    methodOfPrep: 'One bunch of fresh curry leaves sautéed with black pepper, urad dal, and hing; ground with tamarind and rock salt.',
    timing: 'Served with lunch',
    therapeuticBenefit: 'Mahanimbine stimulates hepatic clearance of LDL; stimulates hair follicle melanin and cures morning nausea.',
    contraindications: 'None; excellent daily dietetic medicine.',
  },
];

// ================= RECIPES GUIDELINES TABLE =================
export interface RecipeGuidelinesRow {
  mealSlot: 'Early Morning' | 'Breakfast' | 'Mid-Morning' | 'Lunch' | 'Evening Snacks' | 'Dinner' | 'Bedtime';
  timing: string;
  recommendedPrep: string;
  diabeticClinicalExample: string;
  eliminationDietExample: string;
  blandDietExample: string;
  lowCarbKetoExample: string;
  calorieTarget: string;
}

export const recipeGuidelinesTableData: RecipeGuidelinesRow[] = [
  {
    mealSlot: 'Early Morning',
    timing: '5:00 AM – 6:00 AM',
    recommendedPrep: 'Lukewarm alkaline hydration with functional spices & healthy lipid carrier.',
    diabeticClinicalExample: 'Methi seed infusion (5g soaked) + 5ml A2 Ghee + 2 soaked walnuts',
    eliminationDietExample: 'Lukewarm water with 5g pure ghee + 2 soaked Brazil nuts',
    blandDietExample: 'Warm jeera (cumin) water with 1 tsp soaked chia seeds',
    lowCarbKetoExample: 'Black coffeegreen tea + 1 tsp virgin coconut oil (MCT)',
    calorieTarget: '60 – 90 kcal',
  },
  {
    mealSlot: 'Breakfast',
    timing: '7:30 AM – 8:30 AM',
    recommendedPrep: 'Steamed complex millets or fermented lentil crepes with antioxidant sambar and coconut-free chutney.',
    diabeticClinicalExample: '3 Foxtail Millet Methi Idlis + 100g drumstick sambar + tomato coriander chutney + 5ml ghee',
    eliminationDietExample: 'Plain Ragi ganji (150-200g cooked) with 5ml ghee or 2 Moong dal chillas',
    blandDietExample: 'Steamed white rice idlis with mild bottle gourd kootu (zero chili)',
    lowCarbKetoExample: '2 Whole egg scramble with spinach, mushrooms, and 40g paneer cubes',
    calorieTarget: '320 – 380 kcal',
  },
  {
    mealSlot: 'Mid-Morning',
    timing: '10:30 AM – 11:30 AM',
    recommendedPrep: 'Low glycemic whole fruit or bioavailable plant protein shake with mineral hydration.',
    diabeticClinicalExample: '100g Guava or green apple slices + 1/2 scoop whey isolate in 150ml water',
    eliminationDietExample: '1 cup Fresh tulsi water + 1/2 bowl roasted moong dal or 100g whole fruit',
    blandDietExample: '1 glass tender coconut water or stewed peeled apple puree',
    lowCarbKetoExample: 'Handful of roasted pumpkin seeds (20g) + unsweetened almond milk latte',
    calorieTarget: '110 – 160 kcal',
  },
  {
    mealSlot: 'Lunch',
    timing: '1:00 PM – 2:00 PM',
    recommendedPrep: '50% non-starchy vegetables/keerai, 25% plant/animal lean protein, 25% unpolished ancestral millets.',
    diabeticClinicalExample: '100g cucumber salad + 100g Foxtail millet + 150g Palak Dal + 100g bottle gourd palya + 5ml ghee',
    eliminationDietExample: '1 bowl thick Dal Khichdi (1 dal : 0.5 rice) or 2-3 Jowar rotis with sauteed gourds',
    blandDietExample: 'Soft mashed rice with yellow moong dal, boiled carrots, and 1 tsp ghee',
    lowCarbKetoExample: 'Cauliflower rice biryani with 150g grilled chicken/paneer, cucumber raita, and avocado',
    calorieTarget: '450 – 520 kcal',
  },
  {
    mealSlot: 'Evening Snacks',
    timing: '4:30 PM – 5:30 PM',
    recommendedPrep: 'Spiced digestive buttermilk or herbal infusion with roasted oilseeds.',
    diabeticClinicalExample: '200ml Neer Mor (Buttermilk with ginger/curry leaves) + 1 tbsp roasted pumpkin & sunflower seeds',
    eliminationDietExample: '1 cup Spearmint tea or pudina juice + 1/2 bowl roasted chana',
    blandDietExample: 'Warm chamomile infusion + 2 rice crackers with almond butter',
    lowCarbKetoExample: 'Salted cucumber and celery sticks with 2 tbsp guacamole or walnut dip',
    calorieTarget: '120 – 150 kcal',
  },
  {
    mealSlot: 'Dinner',
    timing: '7:30 PM – 8:30 PM',
    recommendedPrep: 'Light, high-fiber, easily metabolizable grain or soup to support nighttime restorative fasting.',
    diabeticClinicalExample: '2 Multi-millet vegetable uttapams with mint-coriander chutney + 1 bowl clear vegetable soup',
    eliminationDietExample: 'Jowar ganji (150-200g) with 5ml ghee or steamed lentil vegetable patties',
    blandDietExample: 'Clear bottle gourd and carrot soup with 1 soft well-cooked phulka',
    lowCarbKetoExample: 'Large bowl of sauteed broccoli, beans, and tofu/fish with olive oil and garlic',
    calorieTarget: '340 – 400 kcal',
  },
  {
    mealSlot: 'Bedtime',
    timing: '9:30 PM – 10:00 PM',
    recommendedPrep: 'Calming neuro-protective herbal decoction or warm adaptogenic infusion.',
    diabeticClinicalExample: 'Warm water with 1/2 tsp Triphala chooranam or 1 cup spearmint chamomile tea',
    eliminationDietExample: 'Lukewarm water with pinch of crushed cardamom and nutmeg',
    blandDietExample: 'Warm fennel seed (Saunf) infusion for digestive comfort',
    lowCarbKetoExample: 'Warm almond milk with 1/4 tsp Ashwagandha and pinch of cinnamon',
    calorieTarget: '20 – 40 kcal',
  },
];

// ================= 12-DAY POST GUT CLEANSE & ELIMINATION DIET (From User's PDF 2 Page 2 & 3) =================
export interface EliminationDayProtocol {
  dayNumber: number;
  dayTitle: string;
  focusFood: string;
  tamilFocusFood: string;
  wakeUp: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  toleranceNotes: string;
}

export const eliminationDiet12DaysData: EliminationDayProtocol[] = [
  {
    dayNumber: 1,
    dayTitle: 'Day 1',
    focusFood: 'Rice',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: 'Rice ganji (150 to 200 grams cooked) + 5 ml Ghee',
    lunch: 'Lemon Poha (made with organic unpolished red/brown rice flakes)',
    snacks: 'Puffed rice chivda with curry leaves (lightly roasted, no chili powder)',
    dinner: 'Brown rice with light yellow moong water broth',
    toleranceNotes: 'Assess for post-meal bloating or sugar spike after pure rice introduction.',
  },
  {
    dayNumber: 2,
    dayTitle: 'Day 2',
    focusFood: 'Millets',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: 'Ragi ganji (150 to 200 grams cooked) + 5 ml Ghee',
    lunch: 'Bajra ganji (150 to 200 grams cooked) + 5 ml Ghee',
    snacks: 'Tulsi water (Fresh holy basil boiled water)',
    dinner: 'Jowar ganji (150 to 200 grams cooked) + 5 ml Ghee',
    toleranceNotes: 'Observe bowel transit time and stool consistency with ancestral millets.',
  },
  {
    dayNumber: 3,
    dayTitle: 'Day 3',
    focusFood: 'Wheat',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: 'Plain Rava upma (150 to 200 grams cooked with mild jeera)',
    lunch: '2-3 Chapathi with Mint chutney or coriander chutney',
    snacks: 'Tulsi Water (Fresh infusion)',
    dinner: '3 Wheat dosa or wheat idly with tomato-coriander chutney',
    toleranceNotes: 'Carefully monitor for gluten sensitivity signs: brain fog, joint pain, or gas.',
  },
  {
    dayNumber: 4,
    dayTitle: 'Day 4',
    focusFood: 'Pulses',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '2-3 Moong dal dosa (Pesarattu) with ginger chutney',
    lunch: '1 bowl thick Dal khichdi (1 dal : 0.5 rice ratio)',
    snacks: '1/2 bowl Roasted moong dal',
    dinner: '1 bowl thick Dal khichdi with 5ml ghee',
    toleranceNotes: 'Check for sulfur belching or lower abdominal cramps from split pulses.',
  },
  {
    dayNumber: 5,
    dayTitle: 'Day 5',
    focusFood: 'Vegetable & Nuts',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '1 bowl Stir fried Vegetables (Carrot, radish, yam, potato, beetroot, tapioca) + Soaked Nuts',
    lunch: '1 bowl Sauteed vegetables (Ladiesfinger, ivygourd, bottlegourd, ridgegourd, ashgourd, pumpkin) + Soaked Nuts',
    snacks: '1 glass Beetroot juice + Roasted Peanuts',
    dinner: '1 bowl Boiled vegetables with rock salt and cumin',
    toleranceNotes: 'Ensure vegetable fibers are tolerated without accelerating bowel movements.',
  },
  {
    dayNumber: 6,
    dayTitle: 'Day 6',
    focusFood: 'Legumes',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '4-5 Lentil patties (steamed/shallow tawa roasted)',
    lunch: '1 bowl white boiled channa (Kondakadalai) or Rajma',
    snacks: '1/2 bowl Roasted chana with pinch of rock salt',
    dinner: '1 bowl white boiled channa or rajma soup',
    toleranceNotes: 'Crucial day: watch for colonic fermentation or flatulence odor.',
  },
  {
    dayNumber: 7,
    dayTitle: 'Day 7',
    focusFood: 'Fruits & Seeds',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '1 bowl Banana Rasayana + raw pumpkin seeds',
    lunch: '1 bowl Mixed Cut fruits + raw sunflower seeds',
    snacks: '1 glass Fruit juice (without sugar) + 1 tsp chia seeds soaked',
    dinner: '1 bowl Melon fruit bowl with mint leaves',
    toleranceNotes: 'Test fructose absorption; ensure no diarrhea or rapid water transit.',
  },
  {
    dayNumber: 8,
    dayTitle: 'Day 8',
    focusFood: 'Dairy',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '2-3 Ghee Roast Paneer slices with black pepper',
    lunch: '1 bowl paneer pulao + 1 glass cultured Buttermilk (Neer Mor)',
    snacks: '1 glass Milkshake (homemade A2 milk with dates)',
    dinner: '1 bowl Paneer burji + 1 bowl boiled vegetables',
    toleranceNotes: 'Monitor lactose tolerance: nausea, cramping, or loose stools within 2 hours.',
  },
  {
    dayNumber: 9,
    dayTitle: 'Day 9',
    focusFood: 'Egg',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '2 boiled eggs + 1 bowl of boiled vegetables (except root vegetables)',
    lunch: '1 bowl egg fried rice with spring onions and pepper',
    snacks: '1 glass pudina juice + 1 tsp sabja seeds (basil seeds)',
    dinner: '2 egg burji or omelet + 1 bowl of any vegetables (except root vegetables)',
    toleranceNotes: 'Check for albumin histamine signs: skin itchiness, hives, or eyelid swelling.',
  },
  {
    dayNumber: 10,
    dayTitle: 'Day 10',
    focusFood: 'Chicken',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '2-3 Dosa + Country chicken curry (mild spices)',
    lunch: '1 bowl chicken fried ricechicken pulao',
    snacks: '1 glass pudina juice + 1 tsp sabja seeds',
    dinner: '1 bowl chicken soup + fresh vegetable salad',
    toleranceNotes: 'Evaluate digestive fire (Agni) capacity for dense poultry protein.',
  },
  {
    dayNumber: 11,
    dayTitle: 'Day 11',
    focusFood: 'Fish',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '1 bowl fish curry + 1 bowl of boiled vegetables (except root vegetables)',
    lunch: 'Boiled Rice + fish curry (MackerelSardineMurrel)',
    snacks: '1 glass pudina juice + 1 tsp sabja seeds',
    dinner: 'Boiled Rice + fish/prawn/crab curry',
    toleranceNotes: 'Assess marine protein tolerance and absence of histamine flush.',
  },
  {
    dayNumber: 12,
    dayTitle: 'Day 12',
    focusFood: 'Meat',
    tamilFocusFood: '',
    wakeUp: 'Lukewarm water with 5g pure cow ghee in it',
    breakfast: '1 bowl mutton stew + 1 bowl of boiled vegetables (except root vegetables)',
    lunch: '1 bowl boiled rice + mutton currybone soup',
    snacks: '1 bowl mutton bone soup with black pepper and coriander',
    dinner: '1 bowl boiled rice + mutton curry',
    toleranceNotes: 'Final stage: confirms full recovery of stomach acid and gastrointestinal competence.',
  },
];

// ================= 7-DAY MEAL PLAN MATRIX (From User's PDF 2 Page 4 & 5) =================
export interface MealSlotMatrixRow {
  slotId: string;
  timeSlot: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export const initial7DayMasterPlanMatrix: MealSlotMatrixRow[] = [
  {
    slotId: 'slot-500am',
    timeSlot: '5:00 am',
    monday: 'Thyronorm (as prescribed) + 200ml warm water',
    tuesday: 'Thyronorm (as prescribed) + 200ml warm water',
    wednesday: 'Thyronorm (as prescribed) + 200ml warm water',
    thursday: 'Thyronorm (as prescribed) + 200ml warm water',
    friday: 'Thyronorm (as prescribed) + 200ml warm water',
    saturday: 'Thyronorm (as prescribed) + 200ml warm water',
    sunday: 'Thyronorm (as prescribed) + 200ml warm water',
  },
  {
    slotId: 'slot-530am',
    timeSlot: '5:30 am',
    monday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
    tuesday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
    wednesday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
    thursday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
    friday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
    saturday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
    sunday: '200ml Saffron & Ghee water (5g ghee + 3-4 saffron strands) + 2 overnight-soaked Brazil nuts',
  },
  {
    slotId: 'slot-breakfast',
    timeSlot: 'Breakfast',
    monday: '3-4 methi leaves stuffed idli with 100g cooked vegetable sambar + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
    tuesday: '2-3 Mint dosas with tomato coriander chutney + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
    wednesday: '2-3 Yellow moong vegetable chillas with mint chutney + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
    thursday: '150g Spinach palya with 2 Akki rotis + Tomato chutney + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
    friday: '2-3 Vegetable dosa with coriander chutney + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
    saturday: '2-3 Neer dosas with 150g beans coconut palya + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
    sunday: '100g Pongal with 150g drumstick sambar + 5ml ghee + 1/2 scoop (15g) Whey in 150ml water',
  },
  {
    slotId: 'slot-midmorning',
    timeSlot: '12:30 – 1:00 pm',
    monday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
    tuesday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
    wednesday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
    thursday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
    friday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
    saturday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
    sunday: '100g Whole fruit (Apple/Guava/Papaya) + 1/2 scoop (15g) Whey protein powder in 150ml water',
  },
  {
    slotId: 'slot-lunch',
    timeSlot: 'Lunch 1:30 – 2:00 pm',
    monday: '2 Ragi mudde + Soppina sarru + 100g bottle gourd palya + 5ml ghee',
    tuesday: '100g cucumber + 100-120g cooked rice with vegetable sambar + 5ml ghee',
    wednesday: '100g sauteed mixed vegetables + 150g cooked quinoa, Bisibelebath + 5ml ghee',
    thursday: '100g vegetable stir-fry + 80-100g Cooked Rice with spinach dal + 5ml ghee',
    friday: '100g beans palya + 80-100g Cooked Foxtail millet with majjige huli + 5ml ghee',
    saturday: '100g carrot beans palya + 80-100g Tomato bath (include green peas in it) + 5ml ghee',
    sunday: 'Cheat meal (Mindful portion) + 200ml fresh buttermilk',
  },
  {
    slotId: 'slot-evening',
    timeSlot: 'Evening 5:00 pm',
    monday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
    tuesday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
    wednesday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
    thursday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
    friday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
    saturday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
    sunday: '200ml Buttermilk with 8-10g Moringa leaves powder + 1 cup Spearmint tea + 1 tbsp roasted pumpkin & sunflower seeds',
  },
];
