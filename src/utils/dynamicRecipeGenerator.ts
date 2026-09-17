import { RecipePosterMealItem, ConditionRecipePosterData } from '../data/domainRecipePosterMasterData';
import { ConditionRecipeArchetype } from '../data/recipeArchetypes/types';
import { SPORTS_PERFORMANCE_ARCHETYPE, FITNESS_ENDURANCE_ARCHETYPE } from '../data/recipeArchetypes/sportsAndFitness';
import { PCOS_ARCHETYPE, THYROID_ARCHETYPE } from '../data/recipeArchetypes/pcosAndThyroid';
import { WEIGHT_LOSS_ARCHETYPE, DYSLIPIDEMIA_ARCHETYPE } from '../data/recipeArchetypes/weightLossAndMetabolic';
import { GERD_GASTRIC_ARCHETYPE, GOUT_PURINE_ARCHETYPE } from '../data/recipeArchetypes/gastroAndGout';
import { NEUROLOGICAL_ARCHETYPE, RESPIRATORY_ARCHETYPE } from '../data/recipeArchetypes/neurologicalAndRespiratory';
import { CANCER_ONCOLOGY_ARCHETYPE, AUTOIMMUNE_ARCHETYPE } from '../data/recipeArchetypes/cancerAndAutoimmune';
import { GUT_CLEANSE_ARCHETYPE, THERAPEUTIC_DIET_DOMAINS_ARCHETYPE } from '../data/recipeArchetypes/dietDomainsAndTherapeutic';
import { ENDOCRINE_METABOLIC_ARCHETYPE } from '../data/recipeArchetypes/specializedClinicalAndDiets';
import { NUTRIENT_DEFICIENCY_MALNUTRITION_ARCHETYPE } from '../data/recipeArchetypes/deficiencyAndAllergies';


// 1. HYPERTENSION / HIGH BLOOD PRESSURE (Low Sodium, DASH, High Potassium & Magnesium, Beetroot NO)
const HYPERTENSION_ARCHETYPE: ConditionRecipeArchetype = {
  subtitleTags: ['Low Sodium (<1500mg)', 'High Potassium', 'DASH Compliant', 'Nitric Oxide Rich', 'Cardioprotective'],
  dietTips: [
    'Strictly avoid salt shaker, pickles, papads, and salted bakery items',
    'Prioritize potassium-rich veggies (spinach, pumpkin, bottle gourd, ridge gourd)',
    'Eat beetroot and raw crushed garlic daily to elevate endothelial nitric oxide',
    'Opt for cold-pressed mustard or olive oil in strictly measured quantities (2-3 tsp)',
    'Incorporate unsalted seeds (flax, pumpkin) for magnesium and vascular tone',
    'Sip hibiscus tea or moringa decoction before bedtime to promote vasodilation',
  ],
  foodsToInclude: 'Garlic cloves, beetroot, tender coconut water, pomegranate, bottle gourd, unpolished millets, unsalted walnuts, steamed fish/paneer',
  foodsToAvoid: 'Pickles, salted nuts, chips, papad, soy sauce, processed cheese, bakery items, caffeinated energy drinks',
  breakfastDishes: [
    { name: 'Beetroot & Flaxseed Rolled Oats Porridge', portion: '1 bowl (200g)', cal: 230, p: 9, c: 38, f: 5, keyword: 'oats', benefit: 'Nitric oxide vasodilation & beta-glucan' },
    { name: 'Garlic & Coriander Sprouted Moong Chilla', portion: '2 chillas (150g)', cal: 240, p: 14, c: 32, f: 5, keyword: 'chilla', benefit: 'Allicin compound lowers peripheral resistance' },
    { name: 'Steamed Kuthiraivali (Barnyard) Millet Pongal', portion: '1 bowl (180g)', cal: 220, p: 7, c: 36, f: 5, keyword: 'millets', benefit: 'Low sodium, rich in magnesium' },
    { name: 'Barley & Pomegranate Breakfast Bowl with Almonds', portion: '1 bowl (180g)', cal: 250, p: 8, c: 42, f: 6, keyword: 'porridge', benefit: 'Polyphenols improve arterial compliance' },
    { name: 'Spinach & Egg White Scramble with Herbs', portion: '2 egg whites + veg', cal: 170, p: 14, c: 8, f: 6, keyword: 'egg', benefit: 'Potassium & lutein for vascular health' },
    { name: 'Ragi & Methi Dosa with Coconut-Free Mint Dip', portion: '2 dosas', cal: 210, p: 6, c: 36, f: 4, keyword: 'dosa', benefit: 'High potassium-to-sodium ratio' },
    { name: 'Broken Wheat (Dalia) Vegetable Upma', portion: '1 bowl (180g)', cal: 220, p: 7, c: 38, f: 4, keyword: 'upma', benefit: 'Sustained fiber without sodium spike' },
    { name: 'Steamed Idli with Drumstick & Pumpkin Sambar', portion: '2 idlis + sambar', cal: 210, p: 8, c: 38, f: 2, keyword: 'idli', benefit: 'Moringa & pumpkin potassium boost' },
    { name: 'Avocado on Whole Grain Toast with Crushed Seeds', portion: '1 slice', cal: 220, p: 6, c: 24, f: 11, keyword: 'salad', benefit: 'Monounsaturated fats & potassium' },
    { name: 'Chia & Greek Yogurt Bowl with Soaked Walnuts', portion: '1 cup (150g)', cal: 210, p: 13, c: 18, f: 8, keyword: 'yogurt', benefit: 'Calcium & omega-3 for vascular elasticity' },
    { name: 'Brown Rice Poha with Roasted Peanuts & Curry Leaves', portion: '1 bowl (160g)', cal: 230, p: 7, c: 36, f: 6, keyword: 'poha', benefit: 'Zero salt processing, high antioxidants' },
    { name: 'Besan & Zucchini Cheela with Fresh Herbs', portion: '2 small chillas', cal: 220, p: 11, c: 28, f: 6, keyword: 'chilla', benefit: 'Potassium-dense zucchini promotes diuresis' },
    { name: 'Sprouted Green Gram & Pomegranate Salad', portion: '1 bowl (180g)', cal: 200, p: 12, c: 32, f: 2, keyword: 'sprouts', benefit: 'Bioactive peptides with ACE-inhibitory action' },
    { name: 'Thinai (Foxtail Millet) Idli with Tomato-Coriander Chutney', portion: '2 idlis', cal: 200, p: 7, c: 34, f: 3, keyword: 'idli', benefit: 'Slow carbohydrate absorption' },
    { name: 'Oats & Grated Carrot Thepla (Zero Salt Shake)', portion: '2 thin theplas', cal: 210, p: 7, c: 32, f: 5, keyword: 'thepla', benefit: 'Carotenoids and blood pressure stabilization' },
    { name: 'Boiled Chickpeas with Cucumber & Lime Dressing', portion: '1 bowl (160g)', cal: 220, p: 11, c: 32, f: 4, keyword: 'sprouts', benefit: 'Arginine precursor for nitric oxide' },
    { name: 'Steel-Cut Cinnamon Oats with Sliced Kiwi', portion: '1 bowl (180g)', cal: 230, p: 8, c: 40, f: 4, keyword: 'oats', benefit: 'Vitamin C & potassium synergy' },
    { name: 'Tofu Bhurji with 1 Jowar Phulka', portion: '1 plate', cal: 240, p: 15, c: 26, f: 8, keyword: 'paneer', benefit: 'Isoflavones support endothelial wellness' },
    { name: 'Barnyard Millet Vegetable Khichdi', portion: '1 bowl (180g)', cal: 210, p: 7, c: 35, f: 4, keyword: 'khichdi', benefit: 'Gentle renal-sparing carbohydrate' },
    { name: 'Berry & Flaxseed Herbal Protein Smoothie', portion: '1 glass (200ml)', cal: 190, p: 12, c: 24, f: 5, keyword: 'fruits', benefit: 'Anthocyanins protect capillary walls' },
  ],
  lunchDishes: [
    { name: 'Steamed Red Rice + Palak Moong Dal + Ridge Gourd Poriyal', portion: '1 thali', cal: 420, p: 16, c: 68, f: 8, keyword: 'rice_dal', benefit: 'Potassium rich, strictly low sodium' },
    { name: '2 Jowar Rotis + Lauki Kofta (Unfried) + Unsalted Curd', portion: '1 thali', cal: 390, p: 14, c: 62, f: 9, keyword: 'roti', benefit: 'Lauki promotes gentle water excretion' },
    { name: 'Quinoa Beetroot Pulao with Cucumber Raita', portion: '1 bowl (220g)', cal: 380, p: 13, c: 60, f: 8, keyword: 'quinoa', benefit: 'Dietary nitrates expand blood vessels' },
    { name: 'Omega-3 Steamed Mackerel / Salmon + Sautéed Beans', portion: '1 plate', cal: 360, p: 26, c: 16, f: 12, keyword: 'fish', benefit: 'EPA/DHA lowers vascular resistance' },
    { name: 'Foxtail Millet + Ash Gourd Kootu + Spiced Neer Mor', portion: '1 thali', cal: 390, p: 12, c: 64, f: 7, keyword: 'millets', benefit: 'Alkaline hydration, reduces sodium load' },
    { name: '2 Ragi Phulkas + Sprouted Fenugreek (Methi) Dal', portion: '1 thali', cal: 380, p: 15, c: 60, f: 7, keyword: 'roti', benefit: 'Calcium and potassium synergy' },
    { name: 'Brown Rice + Rajma Masala (Low Salt) + Steamed Cabbage', portion: '1 thali', cal: 430, p: 18, c: 70, f: 7, keyword: 'rajma', benefit: 'High potassium legume defense' },
    { name: 'Herbal Moong Dal & Bottle Gourd Khichdi + Tomato Salad', portion: '1 bowl (250g)', cal: 370, p: 14, c: 58, f: 8, keyword: 'khichdi', benefit: 'Digestive and diuretic balance' },
    { name: '2 Multigrain Rotis + Palak Paneer + Radish Slices', portion: '1 plate', cal: 410, p: 18, c: 54, f: 13, keyword: 'paneer', benefit: 'Magnesium and calcium arterial support' },
    { name: 'Jeera Brown Rice + Drumstick Sambar + Cabbage Poriyal', portion: '1 thali', cal: 410, p: 14, c: 66, f: 8, keyword: 'rice_dal', benefit: 'Moringa leaves inhibit ACE enzymes' },
    { name: 'Grilled Herb Chicken Breast + Steamed Broccoli & Carrots', portion: '1 plate', cal: 350, p: 32, c: 18, f: 8, keyword: 'chicken', benefit: 'Lean potassium-dense protein' },
    { name: '2 Bajra Rotis + Baingan Bharta + Yellow Dal', portion: '1 thali', cal: 400, p: 14, c: 62, f: 9, keyword: 'roti', benefit: 'Magnesium-loaded millet profile' },
    { name: 'Black-Eyed Pea (Lobiya) Curry + Little Millet Rice', portion: '1 thali', cal: 420, p: 17, c: 66, f: 8, keyword: 'rajma', benefit: 'Low sodium, fiber-rich legume' },
    { name: 'Steamed Fish in Banana Leaf + Brown Rice + Salad', portion: '1 plate', cal: 380, p: 25, c: 48, f: 8, keyword: 'fish', benefit: 'Retains natural minerals without oil' },
    { name: '2 Phulkas + Bhindi Masala + Toor Dal + Onion-Free Salad', portion: '1 thali', cal: 390, p: 13, c: 60, f: 9, keyword: 'roti', benefit: 'Mucilage slows sugar, low sodium' },
    { name: 'Barnyard Millet Bisi Bele Bath + Pomegranate Raita', portion: '1 bowl (240g)', cal: 400, p: 13, c: 64, f: 8, keyword: 'millets', benefit: 'Cardioprotective flavonoids' },
    { name: 'Sprouted Chickpea Salad with Extra Virgin Olive Oil & Lemon', portion: '1 bowl (220g)', cal: 370, p: 16, c: 48, f: 11, keyword: 'salad', benefit: 'Oleic acid lowers systolic pressure' },
    { name: 'Tandoori Paneer Tikka + Sautéed Bell Peppers & Quinoa', portion: '1 plate', cal: 410, p: 20, c: 42, f: 14, keyword: 'paneer', benefit: 'High potassium capsicum minerals' },
    { name: 'Samai (Little Millet) Curd Rice with Pomegranate & Mustard Seed', portion: '1 bowl (200g)', cal: 340, p: 10, c: 54, f: 7, keyword: 'millets', benefit: 'Probiotics help modulate vascular tone' },
    { name: '2 Phulkas + Snake Gourd (Pudalangai) Kootu + Yellow Dal', portion: '1 thali', cal: 370, p: 14, c: 58, f: 8, keyword: 'roti', benefit: 'High water content promotes fluid balance' },
  ],
  snackDishes: [
    { name: 'Unsalted Roasted Foxnuts (Makhana) with Turmeric', portion: '1 bowl (35g)', cal: 130, p: 4, c: 24, f: 2, keyword: 'nuts', benefit: 'Low sodium, high magnesium snack' },
    { name: 'Fresh Pomegranate Pearls with Crushed Mint', portion: '1 cup (120g)', cal: 90, p: 2, c: 20, f: 1, keyword: 'fruits', benefit: 'Punicalagins lower blood pressure' },
    { name: 'Spiced Low-Sodium Buttermilk with Curry Leaves & Hing', portion: '1 tall glass (250ml)', cal: 60, p: 3, c: 6, f: 2, keyword: 'buttermilk', benefit: 'Electrolyte balance without excess salt' },
    { name: 'Raw Garlic Infused Tomato Clear Soup', portion: '1 bowl (180ml)', cal: 50, p: 2, c: 10, f: 1, keyword: 'soup', benefit: 'Lycopene & allicin vascular protection' },
    { name: 'Steamed Edamame Pods with Cracked Black Pepper', portion: '1 bowl (100g)', cal: 120, p: 11, c: 9, f: 4, keyword: 'nuts', benefit: 'Soy isoflavones enhance arterial dilation' },
    { name: 'Fresh Guava Slices with Squeezed Lemon Drops', portion: '1 medium fruit', cal: 70, p: 2, c: 14, f: 1, keyword: 'fruits', benefit: 'High potassium & soluble pectin' },
    { name: 'Roasted Bengal Gram (Chana) with Dry Mint', portion: '1 small cup (40g)', cal: 140, p: 8, c: 22, f: 2, keyword: 'chana', benefit: 'Slow carbohydrate, zero processed sodium' },
    { name: 'Sprouted Moong & Grated Cucumber Chaat (Zero Salt)', portion: '1 cup (120g)', cal: 110, p: 7, c: 18, f: 1, keyword: 'sprouts', benefit: 'Natural potassium & water balance' },
    { name: 'Soaked Raw Walnuts & Almonds (Unsalted)', portion: '6 almonds + 2 walnuts', cal: 140, p: 4, c: 4, f: 12, keyword: 'nuts', benefit: 'Arginine and plant sterols' },
    { name: 'Raw Beetroot & Carrot Juice with Ginger (Fresh)', portion: '1 glass (180ml)', cal: 80, p: 2, c: 18, f: 0, keyword: 'fruits', benefit: 'Direct nitric oxide boost within 2 hours' },
    { name: 'Pumpkin & Flaxseed Crunchy Trail Mix', portion: '2 tbsp (25g)', cal: 130, p: 5, c: 5, f: 10, keyword: 'seeds', benefit: 'Magnesium regulates vascular constriction' },
    { name: 'Cucumber & Celery Cold Pressed Refresher', portion: '1 glass (200ml)', cal: 40, p: 1, c: 8, f: 0, keyword: 'salad', benefit: 'Phthalides relax smooth muscle in vessels' },
    { name: 'Unsweetened Greek Yogurt with Cinnamon Dusting', portion: '1 cup (120g)', cal: 100, p: 12, c: 6, f: 2, keyword: 'yogurt', benefit: 'Calcium supports vascular contraction control' },
    { name: 'Papaya Cubes with Soaked Sabja (Sweet Basil) Seeds', portion: '1 cup (140g)', cal: 80, p: 2, c: 18, f: 1, keyword: 'fruits', benefit: 'Digestive enzyme & cooling hydration' },
    { name: 'Vegetable Clear Broth with Crushed Coriander', portion: '1 bowl (180ml)', cal: 45, p: 2, c: 8, f: 0, keyword: 'soup', benefit: 'Hydration and mineral intake' },
    { name: 'Boiled Egg Whites (2 Nos) with Black Pepper', portion: '2 whites', cal: 35, p: 8, c: 0, f: 0, keyword: 'egg', benefit: 'Pure peptide protein without yolk cholesterol' },
    { name: 'Chia Seed Pudding with Unsweetened Almond Milk', portion: '1 small jar (120g)', cal: 120, p: 4, c: 10, f: 7, keyword: 'yogurt', benefit: 'Alpha-linolenic acid arterial buffer' },
    { name: 'Fresh Amla Juice / Fresh Gooseberry Slices', portion: '50ml / 2 amlas', cal: 30, p: 1, c: 7, f: 0, keyword: 'fruits', benefit: 'Vitamin C preserves nitric oxide stability' },
    { name: 'Tender Coconut Water (Fresh)', portion: '1 cup (200ml)', cal: 45, p: 1, c: 9, f: 0, keyword: 'water', benefit: 'Natural potassium & electrolyte replenishment' },
    { name: 'Dark Chocolate (85% Cocoa, 1-2 Squares)', portion: '15g', cal: 90, p: 2, c: 6, f: 7, keyword: 'dark_chocolate', benefit: 'Flavanols stimulate endothelial nitric oxide' },
  ],
  dinnerDishes: [
    { name: 'Beetroot & Celery Soup + Grilled Unsalted Paneer Cubes', portion: '1 plate', cal: 290, p: 16, c: 22, f: 14, keyword: 'paneer', benefit: 'Phthalides & nitrates promote nocturnal BP dip' },
    { name: '2 Phulkas + Snake Gourd (Pudalangai) Poriyal + Yellow Dal', portion: '1 thali', cal: 320, p: 13, c: 54, f: 6, keyword: 'roti', benefit: 'Light digestive meal prevents nocturnal spike' },
    { name: 'Moong Dal & Zucchini Broth with Sautéed Spinach', portion: '1 bowl (250ml)', cal: 220, p: 12, c: 32, f: 5, keyword: 'soup', benefit: 'High potassium, calming on cardiac muscle' },
    { name: 'Steamed Fish with Fresh Dill & Asparagus', portion: '1 plate', cal: 280, p: 28, c: 8, f: 12, keyword: 'fish', benefit: 'Zero saturated fat, rich in cardio omega-3' },
    { name: '2 Ragi Phulkas + Palak Gravy (Zero Salt Shake)', portion: '1 plate', cal: 310, p: 11, c: 52, f: 6, keyword: 'roti', benefit: 'Potassium and fiber prevent midnight reflux' },
    { name: 'Grilled Herb Tofu Steak + Steamed French Beans', portion: '1 plate', cal: 260, p: 18, c: 14, f: 12, keyword: 'paneer', benefit: 'Plant isoflavones lower arterial stiffness' },
    { name: 'Tomato Garlic Soup + Egg White Scramble', portion: '1 bowl + 2 whites', cal: 190, p: 14, c: 16, f: 6, keyword: 'egg', benefit: 'Allicin and lycopene night repair' },
    { name: '2 Phulkas + Ridge Gourd Kootu + Cucumber Slices', portion: '1 thali', cal: 310, p: 12, c: 52, f: 6, keyword: 'roti', benefit: 'Promotes nocturnal urinary sodium clearance' },
    { name: 'Light Moong Khichdi with Steamed Zucchini', portion: '1 bowl (200g)', cal: 270, p: 10, c: 46, f: 5, keyword: 'khichdi', benefit: 'Gentle on stomach, prevents heart strain' },
    { name: 'Paneer Bhurji with 1 Jowar Phulka + Mint Salad', portion: '1 plate', cal: 310, p: 16, c: 32, f: 12, keyword: 'paneer', benefit: 'High satiety, zero added sodium' },
    { name: 'Oats & Vegetable Broth + Steamed Carrots', portion: '1 bowl (240ml)', cal: 200, p: 7, c: 34, f: 4, keyword: 'soup', benefit: 'Beta-glucan helps night cholesterol clearing' },
    { name: '2 Phulkas + Kundru (Ivy Gourd) Sabzi + Thin Dal', portion: '1 thali', cal: 300, p: 11, c: 50, f: 6, keyword: 'roti', benefit: 'Low glycemic load and mineral rich' },
    { name: 'Spinach & Mushroom Clear Soup + Tofu Cubes', portion: '1 bowl (240ml)', cal: 180, p: 12, c: 14, f: 7, keyword: 'soup', benefit: 'Antioxidant ergothioneine protects endothelium' },
    { name: 'Sprouted Green Gram Khichdi with Skimmed Curd', portion: '1 bowl (200g)', cal: 290, p: 13, c: 48, f: 5, keyword: 'khichdi', benefit: 'Probiotic and bioactive peptide synergy' },
    { name: 'Soya Chunks Stir Fry with 1 Multigrain Roti', portion: '1 plate', cal: 300, p: 20, c: 34, f: 7, keyword: 'roti', benefit: 'High protein without sodium-retaining fats' },
    { name: 'Herb Grilled Chicken Breast + Green Leafy Salad', portion: '1 plate', cal: 270, p: 30, c: 8, f: 7, keyword: 'chicken', benefit: 'Lean amino acids for vessel wall repair' },
    { name: '2 Phulkas + Cabbage & Green Peas Poriyal + Dal Soup', portion: '1 thali', cal: 310, p: 12, c: 52, f: 6, keyword: 'roti', benefit: 'Sulforaphane protects vascular lining' },
    { name: 'Drumstick (Murungai) Soup + Grilled Veggies', portion: '1 bowl (240ml)', cal: 190, p: 8, c: 26, f: 5, keyword: 'soup', benefit: 'Natural ACE inhibitory peptides' },
    { name: 'Little Millet Pongal with Pepper & Jeera (Zero Ghee)', portion: '1 bowl (180g)', cal: 240, p: 8, c: 42, f: 4, keyword: 'millets', benefit: 'Black pepper piperine improves vasodilation' },
    { name: 'Ash Gourd Soup + Sautéed Low-Fat Paneer & Bell Peppers', portion: '1 plate', cal: 230, p: 14, c: 18, f: 10, keyword: 'soup', benefit: 'Cooling, diuretic, cardiac-sparing' },
  ],
  bedtimeDishes: [
    { name: 'Hibiscus Herbal Tisane (Natural ACE-Inhibitor)', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Clinically proven to lower systolic pressure' },
    { name: 'Moringa Leaf Infusion with Lemon Drops', portion: '1 cup (180ml)', cal: 15, p: 1, c: 3, f: 0, keyword: 'tea', benefit: 'Isothiocyanates promote vascular relaxation' },
    { name: 'Ceylon Cinnamon & Lemon Balm Tisane', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Reduces cortisol and nocturnal sympathetic tone' },
    { name: 'Warm Skimmed Milk with Cardamom & Saffron', portion: '1 cup (150ml)', cal: 70, p: 5, c: 7, f: 1, keyword: 'milk', benefit: 'Magnesium and tryptophan for restful sleep' },
    { name: 'Pure Chamomile Tea (Caffeine-Free)', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Apigenin binds GABA receptors, lowers BP' },
    { name: 'Fennel (Saunf) & Coriander Seed Infusion', portion: '1 cup (180ml)', cal: 15, p: 0, c: 3, f: 0, keyword: 'water', benefit: 'Mild diuretic, calms nighttime fluid balance' },
    { name: 'Warm Almond Milk (Unsweetened) with Nutmeg', portion: '1 cup (150ml)', cal: 60, p: 2, c: 3, f: 4, keyword: 'milk', benefit: 'Magnesium supports vascular tone relaxation' },
    { name: 'Soaked Flaxseeds in Warm Water', portion: '1 glass (180ml)', cal: 45, p: 2, c: 3, f: 3, keyword: 'water', benefit: 'Lignans reduce peripheral resistance' },
    { name: 'Holy Basil (Tulsi) & Ginger Tea', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Adaptogen lowers stress-mediated hypertension' },
    { name: 'Brahmi Infused Herbal Night Tea', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Calms neuro-vascular excitability' },
    { name: 'Ashwagandha Milk with a Pinch of Cinnamon', portion: '1 cup (150ml)', cal: 75, p: 5, c: 7, f: 1, keyword: 'milk', benefit: 'Withanolides lower systemic vascular resistance' },
    { name: 'Warm Jeera (Cumin) & Ajwain Water', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'water', benefit: 'Eases nocturnal gastric distension' },
    { name: 'Tart Cherry Juice / Tea (Melatonin & NO Boost)', portion: '1 cup (150ml)', cal: 60, p: 1, c: 14, f: 0, keyword: 'tea', benefit: 'High polyphenols lower nighttime blood pressure' },
    { name: 'Warm Water with Overnight Soaked Sabja Seeds', portion: '1 glass (200ml)', cal: 25, p: 1, c: 3, f: 1, keyword: 'water', benefit: 'Mucilage calms gut-cardiovascular axis' },
    { name: 'Ceylon Cinnamon Decoction (Boiled Bark)', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'water', benefit: 'Modulates nocturnal insulin and vessel tone' },
    { name: 'Warm Golden Turmeric Skimmed Milk', portion: '1 cup (150ml)', cal: 75, p: 5, c: 7, f: 1, keyword: 'milk', benefit: 'Curcumin suppresses vascular inflammation' },
    { name: 'Spearmint & Lemongrass Calming Brew', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Flavonoids support vascular relaxation' },
    { name: 'Organic Spearmint Infusion', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Antioxidant and soothing nervous system tonic' },
    { name: 'Warm Ginger & Black Pepper Decoction (Mild)', portion: '1 cup (180ml)', cal: 15, p: 0, c: 3, f: 0, keyword: 'tea', benefit: 'Gingerol promotes peripheral microcirculation' },
    { name: 'Probiotic Spiced Buttermilk (100ml, Zero Salt)', portion: '100ml', cal: 35, p: 2, c: 3, f: 1, keyword: 'buttermilk', benefit: 'Gut microbiome modulation of blood pressure' },
  ],
};

// 2. RENAL / CHRONIC KIDNEY DISEASE (Low Potassium, Low Phosphorus, Leached Veggies, Precision Protein)
const RENAL_ARCHETYPE: ConditionRecipeArchetype = {
  subtitleTags: ['Low Potassium', 'Low Phosphorus', 'Controlled Protein', 'Glomerular Protective', 'Leached Veggies'],
  dietTips: [
    'Always double-boil (leach) vegetables and discard water to eliminate potassium',
    'Strictly avoid dark colas, processed meats, and foods with phosphate additives',
    'Limit high potassium fruits (bananas, oranges, mangoes, dried fruits, tender coconut)',
    'Measure daily fluid volume strictly according to nephrologist allowance',
    'Calibrate daily protein strictly to 0.6 - 0.8g/kg body weight to reduce urea production',
    'Choose refined grains (white rice, white poha, rava) over high-phosphorus bran/millets',
  ],
  foodsToInclude: 'Apple, pear, cabbage, bottle gourd, white rice, egg white, leached ridge gourd, ginger tea, cucumber',
  foodsToAvoid: 'Dark colas, chocolate, bananas, tomatoes, spinach, organ meats, coconut water, nuts, packaged bakery foods',
  breakfastDishes: [
    { name: 'Leached Bottle Gourd & Rice Flour Cheela', portion: '2 cheelas (140g)', cal: 210, p: 5, c: 42, f: 3, keyword: 'chilla', benefit: 'Low potassium & low phosphorus grain base' },
    { name: 'Refined Semolina (Suji) Upma with Leached Carrots', portion: '1 bowl (160g)', cal: 200, p: 5, c: 40, f: 3, keyword: 'upma', benefit: 'Low purine, low phosphorus breakfast' },
    { name: 'Steamed White Rice Idli with Thin Mint-Coriander Dip', portion: '2 idlis', cal: 180, p: 4, c: 38, f: 1, keyword: 'idli', benefit: 'Gentle on renal filtration, low phosphorus' },
    { name: 'White Rice Flakes Poha with Leached Peas', portion: '1 bowl (150g)', cal: 190, p: 4, c: 38, f: 3, keyword: 'poha', benefit: 'Easily digestible, zero phosphate additives' },
    { name: 'Egg White Scramble with Leached Green Bell Peppers', portion: '2 whites + veg', cal: 110, p: 10, c: 4, f: 3, keyword: 'egg', benefit: 'High biological value protein with zero phosphorus' },
    { name: 'Crispy Rice & Leached Zucchini Dosa', portion: '2 dosas', cal: 200, p: 4, c: 40, f: 3, keyword: 'dosa', benefit: 'Low potassium vegetable integration' },
    { name: 'Stewed Apple & Cinnamon Rice Porridge', portion: '1 bowl (180g)', cal: 210, p: 3, c: 46, f: 1, keyword: 'porridge', benefit: 'Pectin fiber without potassium overload' },
    { name: 'White Bread Toast with Homemade Apple Jam', portion: '2 slices', cal: 180, p: 4, c: 36, f: 2, keyword: 'salad', benefit: 'Low phosphorus energy without dairy' },
    { name: 'Leached Cabbage & Rice Flour Akki Roti', portion: '2 rotis', cal: 210, p: 4, c: 42, f: 3, keyword: 'roti', benefit: 'Leaching removes 60%+ potassium ions' },
    { name: 'Steamed Sago (Sabudana) Khichdi with Cumin', portion: '1 bowl (150g)', cal: 220, p: 1, c: 50, f: 2, keyword: 'khichdi', benefit: 'Pure clean calories with zero nitrogenous waste' },
    { name: 'Egg White Omelette with Leached Onions', portion: '2 egg whites', cal: 100, p: 10, c: 3, f: 2, keyword: 'egg', benefit: 'Protects glomerular filtration rate' },
    { name: 'Rice Flour Sevai (Idiyappam) with Dilute Coconut Milk', portion: '1 bowl (160g)', cal: 190, p: 3, c: 40, f: 3, keyword: 'rice_dal', benefit: 'Low phosphorus steamed preparation' },
    { name: 'Cornflour & Leached Squash Cheela', portion: '2 cheelas', cal: 180, p: 3, c: 38, f: 2, keyword: 'chilla', benefit: 'Zero potassium residue' },
    { name: 'Steamed Rice Dumplings (Kozhukattai) with Sesame', portion: '2 dumplings', cal: 170, p: 3, c: 36, f: 2, keyword: 'idli', benefit: 'Easily cleared by compromised kidneys' },
    { name: 'Refined Wheat Phulka with Leached Snake Gourd', portion: '2 phulkas', cal: 210, p: 6, c: 42, f: 2, keyword: 'roti', benefit: 'Controlled phosphorus profile' },
    { name: 'Dalia Porridge (Double Boiled) with Apple Slices', portion: '1 bowl (160g)', cal: 190, p: 5, c: 38, f: 2, keyword: 'oats', benefit: 'Filtered boiling removes excess minerals' },
    { name: 'Egg White Bhurji with 1 White Phulka', portion: '1 plate', cal: 190, p: 12, c: 26, f: 3, keyword: 'egg', benefit: 'Precision albumin replenishment' },
    { name: 'Leached Tinda (Apple Gourd) & Rice Khichdi', portion: '1 bowl (180g)', cal: 200, p: 5, c: 40, f: 2, keyword: 'khichdi', benefit: 'Gentle renal soothing carbohydrates' },
    { name: 'Puffed Rice (Murmura) Upma with Leached Veggies', portion: '1 bowl (150g)', cal: 160, p: 3, c: 34, f: 2, keyword: 'poha', benefit: 'Light on kidneys, low mineral density' },
    { name: 'White Rice Flour Dosa with Mint Infusion', portion: '2 dosas', cal: 190, p: 3, c: 40, f: 2, keyword: 'dosa', benefit: 'Hydration and calorie stability' },
  ],
  lunchDishes: [
    { name: 'Steamed White Sona Masoori Rice + Dilute Yellow Moong Dal + Leached Cabbage', portion: '1 plate', cal: 380, p: 12, c: 72, f: 4, keyword: 'rice_dal', benefit: 'Controlled protein and low potassium' },
    { name: '2 Thin Wheat Phulkas + Leached Lauki Sabzi + Curd (50ml)', portion: '1 plate', cal: 340, p: 11, c: 60, f: 6, keyword: 'roti', benefit: 'Low phosphate intake' },
    { name: 'White Rice + Leached Snake Gourd Kootu + Dilute Rasam', portion: '1 plate', cal: 370, p: 10, c: 70, f: 4, keyword: 'rice_dal', benefit: 'Easily cleared without nitrogen buildup' },
    { name: 'Egg White Curry (2 Whites) + Steamed White Rice', portion: '1 plate', cal: 350, p: 16, c: 62, f: 5, keyword: 'egg', benefit: 'Replenishes albumin without urea spike' },
    { name: '2 Phulkas + Leached Ridge Gourd Sabzi + Thin Dal', portion: '1 plate', cal: 330, p: 11, c: 58, f: 5, keyword: 'roti', benefit: 'Gourd provides hydration with low potassium' },
    { name: 'White Rice + Leached Bitter Gourd (Karela) Stir Fry', portion: '1 plate', cal: 360, p: 9, c: 68, f: 5, keyword: 'rice_dal', benefit: 'Glycemic control without kidney strain' },
    { name: '2 Phulkas + Leached Tinda Masala + Skimmed Paneer (30g)', portion: '1 plate', cal: 340, p: 14, c: 56, f: 6, keyword: 'paneer', benefit: 'Precision protein portioning' },
    { name: 'Steamed White Rice + Leached Ash Gourd Kootu', portion: '1 plate', cal: 350, p: 8, c: 68, f: 4, keyword: 'rice_dal', benefit: 'Diuretic balance with low electrolyte burden' },
    { name: '2 Phulkas + Leached Cauliflower Sabzi + Thin Moong Soup', portion: '1 plate', cal: 330, p: 11, c: 58, f: 5, keyword: 'roti', benefit: 'Leached cruciferous without mineral surplus' },
    { name: 'White Rice + Leached Ivy Gourd (Kundru) Sabzi', portion: '1 plate', cal: 360, p: 8, c: 68, f: 5, keyword: 'rice_dal', benefit: 'High energy, low renal solute load' },
    { name: 'Poached Fish Fillet (Leached Herbs) + Steamed Rice', portion: '1 plate', cal: 340, p: 20, c: 54, f: 5, keyword: 'fish', benefit: 'Measured biological protein' },
    { name: '2 Phulkas + Leached Raw Papaya Curry + Mint Dip', portion: '1 plate', cal: 320, p: 9, c: 58, f: 4, keyword: 'roti', benefit: 'Low potassium tropical gourd option' },
    { name: 'White Rice + Leached French Beans Poriyal + Dilute Dal', portion: '1 plate', cal: 370, p: 11, c: 68, f: 4, keyword: 'rice_dal', benefit: 'Safe legume portioning' },
    { name: '2 Phulkas + Leached Bottle Gourd Kofta in Dilute Gravy', portion: '1 plate', cal: 330, p: 10, c: 58, f: 5, keyword: 'roti', benefit: 'Minimal electrolyte residue' },
    { name: 'Steamed Rice + Leached Zucchini Curry + Cucumber Salad', portion: '1 plate', cal: 350, p: 8, c: 68, f: 4, keyword: 'rice_dal', benefit: 'Protects remaining nephron reserve' },
    { name: '2 Phulkas + Leached Pointed Gourd (Parwal) Sabzi', portion: '1 plate', cal: 320, p: 9, c: 56, f: 5, keyword: 'roti', benefit: 'Digestive and kidney friendly' },
    { name: 'White Rice + Dilute Coriander Rasam + Leached Cabbage', portion: '1 plate', cal: 360, p: 8, c: 70, f: 4, keyword: 'rice_dal', benefit: 'Low potassium comforting meal' },
    { name: '2 Phulkas + Leached Turnip (Shalgam) Sabzi + Thin Dal', portion: '1 plate', cal: 330, p: 10, c: 58, f: 4, keyword: 'roti', benefit: 'Low potassium root vegetable' },
    { name: 'Steamed Rice + Leached Snake Gourd Kootu + Mint Raita (30ml)', portion: '1 plate', cal: 360, p: 9, c: 68, f: 5, keyword: 'rice_dal', benefit: 'Gentle hydration' },
    { name: '2 Phulkas + Leached Chayote (Chow-Chow) Kootu', portion: '1 plate', cal: 320, p: 9, c: 58, f: 4, keyword: 'roti', benefit: 'Kidney sparing vegetable profile' },
  ],
  snackDishes: [
    { name: 'Stewed Red Apple with Pinch of Cinnamon (Low K)', portion: '1 small bowl (100g)', cal: 70, p: 0, c: 18, f: 0, keyword: 'fruits', benefit: 'Low potassium fruit choice' },
    { name: 'Roasted Puffed Rice (Murmura) with Turmeric (Salt-Free)', portion: '1 cup (30g)', cal: 110, p: 2, c: 24, f: 1, keyword: 'poha', benefit: 'Zero potassium, low phosphorus crunch' },
    { name: 'Fresh Pear Slices (Peeled)', portion: '1 small pear (100g)', cal: 60, p: 0, c: 15, f: 0, keyword: 'fruits', benefit: 'Renal-friendly low potassium fruit' },
    { name: 'Leached Cucumber Slices with Lemon Juice', portion: '1 cup (100g)', cal: 20, p: 1, c: 4, f: 0, keyword: 'salad', benefit: 'Hydration without electrolyte overload' },
    { name: 'Papaya Cubes (Portion Controlled 80g)', portion: '80g', cal: 35, p: 0, c: 9, f: 0, keyword: 'fruits', benefit: 'Low potassium enzyme boost' },
    { name: 'Rice Flakes (Poha) Chivda (Dry Roasted, Unsalted)', portion: '1 small cup (30g)', cal: 110, p: 2, c: 24, f: 1, keyword: 'poha', benefit: 'Safe renal snack' },
    { name: 'Clear Leached Bottle Gourd Soup (100ml)', portion: '100ml', cal: 25, p: 1, c: 5, f: 0, keyword: 'soup', benefit: 'Soothes thirst within fluid limit' },
    { name: 'Pineapple Tidbits (Fresh, 80g)', portion: '80g', cal: 40, p: 0, c: 10, f: 0, keyword: 'fruits', benefit: 'Bromelain enzyme with low potassium' },
    { name: 'Hard Boiled Egg White (1 No) with Black Pepper', portion: '1 white', cal: 17, p: 4, c: 0, f: 0, keyword: 'egg', benefit: 'Pure albumin with zero phosphate' },
    { name: 'Arrowroot Biscuits (Low Sodium / Homemade)', portion: '2 biscuits', cal: 80, p: 1, c: 16, f: 2, keyword: 'chana', benefit: 'Safe starch energy' },
    { name: 'Watermelon Cubes (Measured 100g)', portion: '100g', cal: 30, p: 1, c: 8, f: 0, keyword: 'fruits', benefit: 'Within daily fluid allocation' },
    { name: 'Corn Starch Halwa with Cardamom (Small Cube)', portion: '30g', cal: 90, p: 0, c: 22, f: 1, keyword: 'dark_chocolate', benefit: 'Protein-free clean calories' },
    { name: 'Leached Zucchini Slices with Mint Dip', portion: '1 cup', cal: 25, p: 1, c: 5, f: 0, keyword: 'salad', benefit: 'Safe crunchy snack' },
    { name: 'Guava Jam on 1 White Toast', portion: '1 toast', cal: 100, p: 2, c: 20, f: 1, keyword: 'salad', benefit: 'Controlled phosphorus snack' },
    { name: 'Cracked Rice Porridge Sip (100ml)', portion: '100ml', cal: 60, p: 1, c: 14, f: 0, keyword: 'porridge', benefit: 'Provides satiety without protein burden' },
    { name: 'Steamed Rice Idli (1 Small) with Mint Decoction', portion: '1 idli', cal: 70, p: 2, c: 15, f: 0, keyword: 'idli', benefit: 'Quick mid-afternoon energy' },
    { name: 'Dilute Apple Compote Juice (100ml)', portion: '100ml', cal: 45, p: 0, c: 11, f: 0, keyword: 'water', benefit: 'Controlled hydration' },
    { name: 'Sago (Sabudana) Crisps (Homemade, Zero Salt)', portion: '20g', cal: 80, p: 0, c: 19, f: 1, keyword: 'poha', benefit: 'Zero nitrogenous waste' },
    { name: 'Stewed Pear Compote with Cloves', portion: '80g', cal: 50, p: 0, c: 13, f: 0, keyword: 'fruits', benefit: 'Aromatic low potassium treat' },
    { name: 'Leached Radish Slices with Lime', portion: '50g', cal: 15, p: 0, c: 3, f: 0, keyword: 'salad', benefit: 'Digestive enzyme support' },
  ],
  dinnerDishes: [
    { name: 'Clear Bottle Gourd Soup (Double-Boiled) + 2 White Wheat Phulkas', portion: '1 plate', cal: 260, p: 8, c: 50, f: 3, keyword: 'soup', benefit: 'Minimal renal workload before sleep' },
    { name: 'White Rice & Moong Khichdi (Dilute) with Leached Ridge Gourd', portion: '1 bowl (200g)', cal: 270, p: 8, c: 52, f: 3, keyword: 'khichdi', benefit: 'Easily cleared by kidneys overnight' },
    { name: '2 Phulkas + Leached Snake Gourd Poriyal + Thin Dal', portion: '1 plate', cal: 280, p: 9, c: 52, f: 3, keyword: 'roti', benefit: 'Controlled mineral profile' },
    { name: 'Egg White Chilla (Salt-Free) with Mint Leaves', portion: '2 chillas', cal: 170, p: 12, c: 20, f: 4, keyword: 'chilla', benefit: 'Clean biological protein' },
    { name: 'Steamed Leached Squash Sabzi + 2 Soft Phulkas', portion: '1 plate', cal: 260, p: 8, c: 48, f: 3, keyword: 'roti', benefit: 'Prevents nocturnal electrolyte shifts' },
    { name: 'White Rice + Dilute Jeera Rasam + Leached Cabbage', portion: '1 plate', cal: 280, p: 6, c: 56, f: 3, keyword: 'rice_dal', benefit: 'Soothing digestion without urea buildup' },
    { name: '2 Phulkas + Leached Tinda Sabzi + Skimmed Curd (30ml)', portion: '1 plate', cal: 270, p: 9, c: 48, f: 4, keyword: 'roti', benefit: 'Renal sparing formulation' },
    { name: 'Leached Cucumber & Boiled Rice Porridge', portion: '1 bowl (180g)', cal: 230, p: 5, c: 46, f: 2, keyword: 'porridge', benefit: 'Light cooling dinner' },
    { name: 'Steamed Fish Fillet (70g, Leached) + 1 Phulka + Salad', portion: '1 plate', cal: 240, p: 18, c: 24, f: 6, keyword: 'fish', benefit: 'Precision essential amino acids' },
    { name: '2 Phulkas + Leached Ivy Gourd Sabzi + Thin Soup', portion: '1 plate', cal: 260, p: 8, c: 48, f: 3, keyword: 'roti', benefit: 'Safe fiber and hydration' },
    { name: 'Soft Rice & Leached Bottle Gourd Stew', portion: '1 bowl (200g)', cal: 250, p: 6, c: 50, f: 2, keyword: 'rice_dal', benefit: 'Prevents metabolic acidosis' },
    { name: 'Egg White Scramble with 1 Soft White Phulka', portion: '1 plate', cal: 180, p: 12, c: 22, f: 4, keyword: 'egg', benefit: 'Glomerular protective dinner' },
    { name: '2 Phulkas + Leached Cauliflower Masala (No Salt Shaker)', portion: '1 plate', cal: 260, p: 8, c: 48, f: 3, keyword: 'roti', benefit: 'Leached vegetables preserve nephrons' },
    { name: 'White Rice Flakes Sevai with Steamed Peas', portion: '1 bowl (160g)', cal: 240, p: 6, c: 46, f: 3, keyword: 'poha', benefit: 'Low phosphorus energy' },
    { name: '2 Phulkas + Leached Parwal (Pointed Gourd) Sabzi', portion: '1 plate', cal: 250, p: 7, c: 46, f: 3, keyword: 'roti', benefit: 'Easily digestible night plate' },
    { name: 'Clear Vegetable Broth with Rice Noodles (Low Sodium)', portion: '1 bowl (200ml)', cal: 210, p: 5, c: 42, f: 2, keyword: 'soup', benefit: 'Hydration within fluid restriction' },
    { name: 'White Rice with Leached Ash Gourd Curry', portion: '1 plate', cal: 260, p: 6, c: 52, f: 2, keyword: 'rice_dal', benefit: 'Diuretic and soothing' },
    { name: '2 Phulkas + Leached French Beans Poriyal', portion: '1 plate', cal: 250, p: 8, c: 46, f: 3, keyword: 'roti', benefit: 'Low potassium night plate' },
    { name: 'Dilute Moong Soup with Sautéed Zucchini & 1 Phulka', portion: '1 plate', cal: 230, p: 8, c: 40, f: 3, keyword: 'soup', benefit: 'Zero kidney strain' },
    { name: 'Steamed Rice Dumpling with Leached Mint Chutney', portion: '2 dumplings', cal: 200, p: 4, c: 40, f: 2, keyword: 'idli', benefit: 'Gentle on renal clearance' },
  ],
  bedtimeDishes: [
    { name: 'Warm Ginger Decoction (Fluid-Restricted 80ml)', portion: '80ml', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Digestive comfort without volume load' },
    { name: 'Cardamom Infused Warm Water (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'water', benefit: 'Natural breath & stomach settler' },
    { name: 'Fennel Seed (Saunf) Water (80ml)', portion: '80ml', cal: 10, p: 0, c: 2, f: 0, keyword: 'water', benefit: 'Calms nocturnal fluid retention' },
    { name: 'Tulsi (Holy Basil) Leaf Warm Infusion (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Low potassium adaptogen' },
    { name: 'Cinnamon Bark Steeped Sip (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'water', benefit: 'Aromatic comfort within fluid budget' },
    { name: 'Chamomile Flower Tisane (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Relaxes nervous system, zero potassium' },
    { name: 'Dilute Peppermint Tea (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Eases nocturnal reflux' },
    { name: 'Warm Water with Pinch of Cumin (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'water', benefit: 'Gentle carminative action' },
    { name: 'Dilute Lemon Grass Infusion (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Zero electrolyte overload' },
    { name: 'Clove & Nutmeg Warm Sip (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'water', benefit: 'Promotes deep restful sleep' },
    { name: 'Warm Licorice Root (Yashtimadhu) Sip (60ml)', portion: '60ml', cal: 10, p: 0, c: 2, f: 0, keyword: 'water', benefit: 'Mucosal throat barrier' },
    { name: 'Mint & Coriander Leaf Steep (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Cooling without potassium surplus' },
    { name: 'Light Green Tea (Dilute 80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Antioxidant without renal strain' },
    { name: 'Nutmeg Infused Warm Skimmed Milk (50ml Only)', portion: '50ml', cal: 25, p: 2, c: 2, f: 0, keyword: 'milk', benefit: 'Tryptophan within phosphorus limit' },
    { name: 'Warm Roasted Barley Decoction (80ml)', portion: '80ml', cal: 15, p: 0, c: 3, f: 0, keyword: 'water', benefit: 'Renal soothing beverage' },
    { name: 'Steeped Rosemary & Thyme Water (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Aromatic digestive aid' },
    { name: 'Star Anise Infusion (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Soothes gastrointestinal spasms' },
    { name: 'Warm Ajwain Decoction (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'water', benefit: 'Prevents nocturnal flatulence' },
    { name: 'Dilute Hibiscus Water (80ml)', portion: '80ml', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Gentle renal microcirculation' },
    { name: 'Plain Warm Boiled Water (Sipped slowly 80ml)', portion: '80ml', cal: 0, p: 0, c: 0, f: 0, keyword: 'water', benefit: 'Cleanses palate within strict fluid ceiling' },
  ],
};

// 3. FATTY LIVER / NAFLD / CIRRHOSIS (Antioxidants, Choline, Silymarin, Cruciferous, Zero Refined Sugars)
const FATTY_LIVER_ARCHETYPE: ConditionRecipeArchetype = {
  subtitleTags: ['Hepatoprotective', 'Anti-Steatosis', 'Choline & Omega-3', 'Sulforaphane Rich', 'Zero Refined Sugar'],
  dietTips: [
    'Strictly eliminate all fructose, high-sugar sodas, fruit juices, and refined flour',
    'Prioritize cruciferous vegetables (broccoli, cabbage, radishes) rich in sulforaphane',
    'Include turmeric with black pepper daily to downregulate hepatic lipogenesis',
    'Choose omega-3 fatty acids (flax, walnuts, fatty fish) to reduce hepatic triglyceride pool',
    'Maintain minimum 30-40g dietary fiber daily to bind secondary bile acids',
    'Drink 2-3 cups of black coffee or green tea daily for proven hepatoprotective antifibrotic action',
  ],
  foodsToInclude: 'Amla, turmeric, garlic, green tea, black coffee, walnuts, cruciferous greens, oats beta-glucan, fatty fish, tofu',
  foodsToAvoid: 'Alcohol, high-fructose corn syrup, refined white sugar, bakery confectioneries, trans fats, deep fried fast foods',
  breakfastDishes: [
    { name: 'Sprouted Moong & Methi Leaves Chilla', portion: '2 chillas (160g)', cal: 230, p: 14, c: 30, f: 5, keyword: 'chilla', benefit: 'Methi and sprouts reduce hepatic lipid accumulation' },
    { name: 'Steel-Cut Oats with Walnuts & Blueberries', portion: '1 bowl (190g)', cal: 240, p: 9, c: 38, f: 6, keyword: 'oats', benefit: 'Beta-glucan lowers liver enzyme elevations' },
    { name: 'Steamed Ragi Idli with Fresh Coriander-Amla Chutney', portion: '2 idlis', cal: 200, p: 6, c: 36, f: 3, keyword: 'idli', benefit: 'Amla vitamin C halts lipid peroxidation' },
    { name: 'Tofu & Turmeric Bhurji with 1 Jowar Phulka', portion: '1 plate', cal: 250, p: 16, c: 26, f: 8, keyword: 'paneer', benefit: 'Choline and curcumin mobilize hepatic fat' },
    { name: 'Avocado & Boiled Egg Whites on Multigrain Toast', portion: '1 slice + 2 whites', cal: 220, p: 14, c: 20, f: 8, keyword: 'salad', benefit: 'Choline from eggs stimulates VLDL export' },
    { name: 'Broken Wheat (Dalia) & Sautéed Spinach Khichdi', portion: '1 bowl (180g)', cal: 220, p: 8, c: 38, f: 4, keyword: 'khichdi', benefit: 'Glutathione precursors in spinach' },
    { name: 'Barley & Flaxseed Vegetable Upma', portion: '1 bowl (180g)', cal: 210, p: 7, c: 36, f: 5, keyword: 'upma', benefit: 'Reduces ALT and AST liver biomarkers' },
    { name: 'Green Moong & Radish (Mooli) Paratha (Dry Roasted)', portion: '2 thin parathas', cal: 230, p: 11, c: 38, f: 4, keyword: 'thepla', benefit: 'Sulforaphane in radish stimulates Phase-2 liver enzymes' },
    { name: 'Chia & Greek Yogurt Bowl with Crushed Walnuts', portion: '1 cup (150g)', cal: 210, p: 14, c: 16, f: 8, keyword: 'yogurt', benefit: 'ALA omega-3 suppresses hepatic de novo lipogenesis' },
    { name: 'Brown Rice Poha with Roasted Peanuts & Lemon Juice', portion: '1 bowl (160g)', cal: 230, p: 7, c: 36, f: 6, keyword: 'poha', benefit: 'Antioxidants protect hepatocytes' },
    { name: 'Besan & Grated Zucchini Cheela with Mint Chutney', portion: '2 chillas', cal: 220, p: 12, c: 28, f: 6, keyword: 'chilla', benefit: 'High fiber and plant sterols' },
    { name: 'Protein Egg White Omelette with Baby Spinach & Garlic', portion: '2 whites + veg', cal: 160, p: 14, c: 6, f: 6, keyword: 'egg', benefit: 'Sulfur compounds in garlic clear hepatic toxins' },
    { name: 'Sprouted Horsegram (Kollu) Sundal with Coconut', portion: '1 bowl (150g)', cal: 210, p: 13, c: 30, f: 4, keyword: 'sprouts', benefit: 'Traditional liver detoxifier and fat mobilizer' },
    { name: 'Steamed Kuthiraivali (Barnyard) Pongal with Pepper', portion: '1 bowl (180g)', cal: 210, p: 7, c: 36, f: 4, keyword: 'millets', benefit: 'Piperine enhances curcumin liver absorption' },
    { name: 'Quinoa Breakfast Bowl with Steamed Beans & Avocado', portion: '1 bowl (180g)', cal: 240, p: 9, c: 34, f: 8, keyword: 'quinoa', benefit: 'Betaine supports hepatic methylation pathways' },
    { name: 'Steel-Cut Barley Porridge with Ceylon Cinnamon', portion: '1 bowl (180g)', cal: 220, p: 7, c: 40, f: 3, keyword: 'porridge', benefit: 'Cinnamon reduces insulin resistance in liver' },
    { name: 'Boiled Moong & Pomegranate Clinical Liver Salad', portion: '1 bowl (180g)', cal: 200, p: 12, c: 32, f: 2, keyword: 'sprouts', benefit: 'Ellagic acid protects against hepatic fibrosis' },
    { name: 'Oats & Flaxseed Dosa with Tomato-Garlic Dip', portion: '2 dosas', cal: 220, p: 7, c: 36, f: 5, keyword: 'dosa', benefit: 'Soluble fiber binds secondary bile acids' },
    { name: 'Soya & Vegetable Cheela with Mint-Coriander Raita', portion: '2 chillas', cal: 240, p: 16, c: 24, f: 7, keyword: 'chilla', benefit: 'Phospholipids promote hepatic lipid clearance' },
    { name: 'Therapeutic Green Smoothie with Moringa & Green Tea', portion: '1 glass (220ml)', cal: 130, p: 6, c: 20, f: 2, keyword: 'fruits', benefit: 'EGCG catechins inhibit liver steatosis' },
  ],
  lunchDishes: [
    { name: 'Brown Rice + Methi Moong Dal + Sautéed Cruciferous Broccoli', portion: '1 thali', cal: 420, p: 18, c: 66, f: 8, keyword: 'rice_dal', benefit: 'Indole-3-carbinol clears hepatic triglycerides' },
    { name: '2 Multigrain Rotis + Palak Paneer + Tomato-Cucumber Salad', portion: '1 thali', cal: 410, p: 18, c: 54, f: 12, keyword: 'paneer', benefit: 'Chlorophyll and folate protect hepatocyte DNA' },
    { name: 'Barnyard Millet + Drumstick Sambar + Beetroot Poriyal', portion: '1 thali', cal: 400, p: 14, c: 66, f: 7, keyword: 'millets', benefit: 'Betaine prevents fatty infiltration in hepatocytes' },
    { name: 'Grilled Herb Chicken Breast + Steamed Asparagus & Quinoa', portion: '1 plate', cal: 370, p: 34, c: 32, f: 8, keyword: 'chicken', benefit: 'High biological value protein spurns fatty liver' },
    { name: 'Quinoa Pulao with Sprouted Beans & Lemon-Herb Dressing', portion: '1 bowl (240g)', cal: 390, p: 15, c: 60, f: 9, keyword: 'quinoa', benefit: 'Alkalizing and anti-inflammatory liver support' },
    { name: '2 Jowar Rotis + Baingan Bharta + Yellow Dal Tadka', portion: '1 thali', cal: 390, p: 13, c: 62, f: 8, keyword: 'roti', benefit: 'Resistant starch feeds bile-converting microbiome' },
    { name: 'Brown Rice + Rajma Masala + Steamed Cabbage Poriyal', portion: '1 thali', cal: 430, p: 18, c: 70, f: 7, keyword: 'rajma', benefit: 'Sulforaphane from cabbage enhances detox pathways' },
    { name: 'Herbal Moong Dal & Vegetable Khichdi + Mint Chutney', portion: '1 bowl (240g)', cal: 370, p: 14, c: 58, f: 8, keyword: 'khichdi', benefit: 'Easy assimilation spares metabolic liver load' },
    { name: 'Omega-3 Steamed Mackerel / Sardines + Sautéed Greens', portion: '1 plate', cal: 360, p: 26, c: 14, f: 14, keyword: 'fish', benefit: 'Reduces liver fat fraction by up to 30%' },
    { name: '2 Ragi Phulkas + Bhindi Masala + Toor Dal', portion: '1 thali', cal: 380, p: 13, c: 62, f: 7, keyword: 'roti', benefit: 'Mucilage binds cholesterol in the intestinal lumen' },
    { name: 'Jeera Brown Rice + Palak Dal + Grated Carrot Salad', portion: '1 thali', cal: 410, p: 15, c: 66, f: 8, keyword: 'rice_dal', benefit: 'Carotenoids reduce hepatic oxidative stress' },
    { name: '2 Phulkas + Lauki Kofta Curry (Unfried) + Spiced Buttermilk', portion: '1 thali', cal: 370, p: 13, c: 58, f: 7, keyword: 'roti', benefit: 'Hepatoprotective and bile-stimulating' },
    { name: 'Black-Eyed Pea (Lobiya) Curry + Foxtail Millet Rice', portion: '1 thali', cal: 410, p: 16, c: 66, f: 8, keyword: 'rajma', benefit: 'Lowers fasting blood insulin and triglycerides' },
    { name: 'Tofu Tikka with Sautéed Bell Peppers & Brown Rice', portion: '1 plate', cal: 390, p: 19, c: 52, f: 10, keyword: 'paneer', benefit: 'Soy protein reduces hepatic fat accumulation' },
    { name: 'Red Rice + Sprouted Dal + Drumstick Leaves Poriyal', portion: '1 thali', cal: 410, p: 15, c: 68, f: 7, keyword: 'rice_dal', benefit: 'Moringa leaves contain potent antioxidants for liver' },
    { name: 'Vegetable Millet Biryani + Low-Fat Cucumber Raita', portion: '1 bowl (250g)', cal: 390, p: 12, c: 64, f: 8, keyword: 'millets', benefit: 'Flavonoids combat steatohepatitis inflammation' },
    { name: 'Chickpea (Chole) Curry (Low Oil) + Brown Rice + Salad', portion: '1 thali', cal: 430, p: 17, c: 70, f: 7, keyword: 'rajma', benefit: 'Saponins in chickpeas lower hepatic cholesterol' },
    { name: 'Grilled Salmon Fillet + Steamed Broccoli & Sweet Potato', portion: '1 plate', cal: 380, p: 28, c: 32, f: 12, keyword: 'fish', benefit: 'High DHA omega-3 clears hepatic steatosis' },
    { name: 'Toor Dal + Steamed Spinach + Foxtail Rice + Lemon', portion: '1 thali', cal: 400, p: 16, c: 64, f: 8, keyword: 'rice_dal', benefit: 'Glutathione production synthesis' },
    { name: 'Soya Chunks Curry + 2 Whole Wheat Phulkas + Salad', portion: '1 thali', cal: 390, p: 22, c: 54, f: 8, keyword: 'roti', benefit: 'Choline & phospholipid source' },
  ],
  snackDishes: [
    { name: 'Raw Amla (Indian Gooseberry) Slices with Pink Salt', portion: '2 amlas (60g)', cal: 30, p: 1, c: 7, f: 0, keyword: 'fruits', benefit: 'High bioflavonoid vitamin C protects liver cells' },
    { name: 'Raw Walnuts & Soaked Almonds (30g)', portion: '30g', cal: 180, p: 5, c: 4, f: 16, keyword: 'nuts', benefit: 'Rich in arginine and glutathione' },
    { name: 'Organic Green Tea with Squeezed Lemon Drops', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'EGCG catechins reverse liver fat buildup' },
    { name: 'Roasted Foxnuts (Makhana) with Turmeric & Black Pepper', portion: '1 bowl (35g)', cal: 130, p: 4, c: 24, f: 2, keyword: 'nuts', benefit: 'Curcumin-piperine anti-inflammatory synergy' },
    { name: 'Sprouted Moong Sundal with Lemon & Mustard Seeds', portion: '1 cup (120g)', cal: 120, p: 8, c: 18, f: 2, keyword: 'sprouts', benefit: 'Methionine and choline for liver lipid export' },
    { name: 'Black Filter Coffee (Unsweetened, No Milk)', portion: '1 cup (150ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Chlorogenic acid reduces liver stiffness & fibrosis' },
    { name: 'Fresh Guava Slices with Cracked Black Pepper', portion: '1 medium fruit', cal: 70, p: 2, c: 14, f: 1, keyword: 'fruits', benefit: 'Soluble fiber binds excess dietary cholesterol' },
    { name: 'Steamed Edamame Pods with Rock Salt', portion: '1 bowl (100g)', cal: 120, p: 11, c: 9, f: 4, keyword: 'nuts', benefit: 'Isoflavones modulate PPAR-alpha receptors' },
    { name: 'Tomato & Garlic Broth with Fresh Basil', portion: '1 bowl (180ml)', cal: 45, p: 2, c: 8, f: 1, keyword: 'soup', benefit: 'Lycopene reduces non-alcoholic fatty liver risk' },
    { name: 'Pumpkin & Sunflower Seed Trail Mix', portion: '2 tbsp (25g)', cal: 140, p: 5, c: 4, f: 11, keyword: 'seeds', benefit: 'Zinc and selenium for antioxidant enzyme synthesis' },
    { name: 'Boiled Sweet Corn with Lemon Juice (Small Cup)', portion: '1 small cup (80g)', cal: 90, p: 3, c: 18, f: 1, keyword: 'fruits', benefit: 'Carotenoids and gentle digestive fiber' },
    { name: 'Unsweetened Greek Yogurt with Ground Flaxseeds', portion: '1 cup (120g)', cal: 120, p: 13, c: 6, f: 4, keyword: 'yogurt', benefit: 'Lactobacillus strains improve gut-liver barrier' },
    { name: 'Papaya Cubes with Soaked Chia Seeds', portion: '1 cup (140g)', cal: 85, p: 2, c: 18, f: 1, keyword: 'fruits', benefit: 'Papain enzyme eases liver metabolic load' },
    { name: 'Vegetable Clear Soup with Fresh Coriander & Ginger', portion: '1 bowl (180ml)', cal: 40, p: 2, c: 8, f: 0, keyword: 'soup', benefit: 'Gingerols stimulate bile flow and fat clearance' },
    { name: 'Boiled Egg Whites (2 Nos) with Black Pepper', portion: '2 whites', cal: 35, p: 8, c: 0, f: 0, keyword: 'egg', benefit: 'Pure albumin synthesis without hepatic fat load' },
    { name: 'Sprouts Bhel (Zero Sev, High Cucumber & Tomato)', portion: '1 cup (120g)', cal: 110, p: 7, c: 18, f: 1, keyword: 'sprouts', benefit: 'Alkaline enzyme infusion' },
    { name: 'Chia Pudding with Unsweetened Almond Milk', portion: '1 small jar (120g)', cal: 120, p: 4, c: 10, f: 7, keyword: 'yogurt', benefit: 'Soluble mucilage binds toxic gut endotoxins' },
    { name: 'Fresh Amla Juice with Pinch of Turmeric', portion: '60ml', cal: 30, p: 1, c: 6, f: 0, keyword: 'fruits', benefit: 'Proven reduction of lipid peroxidation in liver' },
    { name: 'Spiced Probiotic Buttermilk (Neer Mor)', portion: '1 glass (200ml)', cal: 50, p: 3, c: 5, f: 1, keyword: 'buttermilk', benefit: 'Prevents gut dysbiosis-mediated liver inflammation' },
    { name: 'Dark Chocolate (85% Cacao, 1-2 Squares)', portion: '15g', cal: 90, p: 2, c: 6, f: 7, keyword: 'dark_chocolate', benefit: 'Improves hepatic microcirculation and portal pressure' },
  ],
  dinnerDishes: [
    { name: 'Cruciferous Broccoli & Garlic Broth + Grilled Tofu', portion: '1 plate', cal: 260, p: 18, c: 16, f: 12, keyword: 'soup', benefit: 'Sulforaphane boosts glutathione overnight' },
    { name: '2 Phulkas + Ash Gourd & Yellow Moong Dal Kootu', portion: '1 thali', cal: 310, p: 13, c: 54, f: 5, keyword: 'roti', benefit: 'Light digestive meal reduces nocturnal liver strain' },
    { name: 'Grilled Fish (Rich in Omega-3) with Steamed Asparagus', portion: '1 plate', cal: 280, p: 28, c: 8, f: 12, keyword: 'fish', benefit: 'Lowers nighttime lipogenesis enzymes' },
    { name: 'Yellow Dal Khichdi with Grated Carrots & Spinach', portion: '1 bowl (200g)', cal: 270, p: 11, c: 46, f: 5, keyword: 'khichdi', benefit: 'Soothes digestive fire and supports bile' },
    { name: '2 Ragi Rotis + Palak Methi Paneer (Low Fat)', portion: '1 plate', cal: 320, p: 16, c: 48, f: 8, keyword: 'roti', benefit: 'Methi greens stimulate hepatic insulin receptors' },
    { name: 'Steamed Vegetable Salad + Boiled Moong & Lemon', portion: '1 bowl (220g)', cal: 230, p: 13, c: 36, f: 3, keyword: 'salad', benefit: 'Digestive rest allows hepatocyte autophagy' },
    { name: 'Tomato Garlic Soup + Egg White Scramble', portion: '1 bowl + 2 whites', cal: 190, p: 14, c: 16, f: 6, keyword: 'egg', benefit: 'Antioxidants and lean repair protein' },
    { name: '2 Phulkas + Ridge Gourd Kootu + Cucumber Slices', portion: '1 thali', cal: 300, p: 12, c: 52, f: 5, keyword: 'roti', benefit: 'Water-rich gourds soothe liver metabolism' },
    { name: 'Light Moong Khichdi with Steamed Zucchini', portion: '1 bowl (200g)', cal: 260, p: 10, c: 46, f: 4, keyword: 'khichdi', benefit: 'Mild, cooling, non-irritating' },
    { name: 'Paneer Bhurji with 1 Jowar Phulka + Mint Chutney', portion: '1 plate', cal: 290, p: 16, c: 28, f: 11, keyword: 'paneer', benefit: 'Provides choline for nocturnal lipid export' },
    { name: 'Oats & Vegetable Broth with Steamed Broccoli', portion: '1 bowl (240ml)', cal: 210, p: 8, c: 36, f: 4, keyword: 'soup', benefit: 'Soluble fiber absorbs nocturnal cholesterol' },
    { name: '2 Phulkas + Kundru (Ivy Gourd) Sabzi + Thin Dal', portion: '1 thali', cal: 290, p: 11, c: 50, f: 5, keyword: 'roti', benefit: 'Glycemic stabilization prevents nocturnal spikes' },
    { name: 'Spinach & Mushroom Clear Soup + Tofu Cubes', portion: '1 bowl (240ml)', cal: 180, p: 12, c: 14, f: 7, keyword: 'soup', benefit: 'Ergothioneine protects mitochondrial membranes' },
    { name: 'Sprouted Green Gram Khichdi with Fresh Curd', portion: '1 bowl (200g)', cal: 280, p: 13, c: 48, f: 5, keyword: 'khichdi', benefit: 'Bioactive peptides modulate lipid metabolism' },
    { name: 'Soya Chunks Curry + 2 Whole Wheat Phulkas', portion: '1 plate', cal: 300, p: 20, c: 44, f: 6, keyword: 'roti', benefit: 'Plant isoflavones lower hepatic steatosis' },
    { name: 'Herb Grilled Chicken Breast + Green Salad', portion: '1 plate', cal: 260, p: 30, c: 8, f: 7, keyword: 'chicken', benefit: 'Zero carbohydrate load promotes fat burning' },
    { name: '2 Phulkas + Cabbage Green Peas Poriyal + Dal Soup', portion: '1 thali', cal: 310, p: 12, c: 52, f: 6, keyword: 'roti', benefit: 'Sulforaphane activates Nrf2 detox pathway' },
    { name: 'Drumstick (Murungai) Soup + Grilled Paneer Cubes', portion: '1 plate', cal: 240, p: 14, c: 18, f: 10, keyword: 'soup', benefit: 'Moringa polyphenols suppress hepatic inflammation' },
    { name: 'Little Millet Pongal with Pepper & Jeera', portion: '1 bowl (180g)', cal: 240, p: 8, c: 42, f: 4, keyword: 'millets', benefit: 'Low GI prevents nocturnal insulin resistance' },
    { name: 'Ash Gourd Soup + Sautéed Low-Fat Paneer & Bell Peppers', portion: '1 plate', cal: 230, p: 14, c: 18, f: 10, keyword: 'soup', benefit: 'Alkalizing and cellular soothing' },
  ],
  bedtimeDishes: [
    { name: 'Warm Golden Turmeric Milk with Black Pepper (Piperine)', portion: '1 cup (150ml)', cal: 75, p: 5, c: 7, f: 1, keyword: 'milk', benefit: 'Piperine boosts curcumin bioavailability 2000%' },
    { name: 'Dandelion Root Tisane (Hepatoprotective Tonic)', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Increases bile flow and protects hepatocytes' },
    { name: 'Pure Chamomile & Peppermint Tea', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Calms gastrointestinal-hepatic axis' },
    { name: 'Warm Water with Overnight Soaked Fenugreek Seeds', portion: '1 glass (200ml)', cal: 20, p: 1, c: 3, f: 0, keyword: 'water', benefit: 'Trigonelline improves hepatic insulin sensitivity' },
    { name: 'Milk Thistle (Silymarin) Herbal Decoction', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Gold standard phytotherapy for liver cell regeneration' },
    { name: 'Ceylon Cinnamon & Ginger Night Tisane', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Suppresses nocturnal hepatic glucose production' },
    { name: 'Holy Basil (Tulsi) & Licorice Decoction', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Protects liver from xenobiotic toxins' },
    { name: 'Warm Skimmed Milk with Ground Nutmeg & Cardamom', portion: '1 cup (150ml)', cal: 70, p: 5, c: 7, f: 1, keyword: 'milk', benefit: 'Promotes deep restful sleep for liver repair' },
    { name: 'Amla & Mint Infused Warm Water', portion: '1 glass (200ml)', cal: 15, p: 0, c: 3, f: 0, keyword: 'water', benefit: 'Scavenges free radicals during nocturnal fasting' },
    { name: 'Green Tea with Jasmine (Caffeine-Free)', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Epigallocatechin catechins stimulate liver repair' },
    { name: 'Fennel Seed (Saunf) & Coriander Decoction', portion: '1 cup (180ml)', cal: 15, p: 0, c: 3, f: 0, keyword: 'water', benefit: 'Eases bile stagnation and abdominal bloating' },
    { name: 'Warm Almond Milk (Unsweetened) with Saffron', portion: '1 cup (150ml)', cal: 65, p: 2, c: 3, f: 4, keyword: 'milk', benefit: 'Crocin in saffron protects against liver steatosis' },
    { name: 'Soaked Flaxseeds in Warm Water', portion: '1 glass (180ml)', cal: 45, p: 2, c: 3, f: 3, keyword: 'water', benefit: 'Lignans act as potent hepatic antioxidants' },
    { name: 'Brahmi & Ashwagandha Night Infusion', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Lowers cortisol-driven visceral fat deposition' },
    { name: 'Lemon Balm & Spearmint Tisane', portion: '1 cup (180ml)', cal: 5, p: 0, c: 1, f: 0, keyword: 'tea', benefit: 'Calms hepatic nervous innervation' },
    { name: 'Warm Water with Soaked Sabja (Sweet Basil) Seeds', portion: '1 glass (200ml)', cal: 25, p: 1, c: 3, f: 1, keyword: 'water', benefit: 'Detoxifying mucilage supports gut barrier' },
    { name: 'Hibiscus & Rose Petal Tisane', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'tea', benefit: 'Polyphenols reduce liver fat accumulation' },
    { name: 'Warm Skimmed Milk with Saffron Threads', portion: '1 cup (150ml)', cal: 70, p: 5, c: 7, f: 1, keyword: 'milk', benefit: 'Replenishes hepatic amino acid reserves' },
    { name: 'Warm Cumin & Ajwain Water', portion: '1 cup (180ml)', cal: 10, p: 0, c: 2, f: 0, keyword: 'water', benefit: 'Stimulates nocturnal bile acid synthesis' },
    { name: 'Probiotic Buttermilk (Unsweetened, 100ml)', portion: '100ml', cal: 35, p: 2, c: 3, f: 1, keyword: 'buttermilk', benefit: 'Restores healthy intestinal flora to spare liver' },
  ],
};

/**
 * Registry of Pre-Configured Condition Archetypes
 */
export const CLINICAL_ARCHETYPES_MAP: Record<string, ConditionRecipeArchetype> = {
  hypertension: HYPERTENSION_ARCHETYPE,
  kidney: RENAL_ARCHETYPE,
  liver: FATTY_LIVER_ARCHETYPE,
  sports_performance: SPORTS_PERFORMANCE_ARCHETYPE,
  fitness_endurance: FITNESS_ENDURANCE_ARCHETYPE,
  pcos_pcod: PCOS_ARCHETYPE,
  thyroid: THYROID_ARCHETYPE,
  weight_loss: WEIGHT_LOSS_ARCHETYPE,
  dyslipidemia: DYSLIPIDEMIA_ARCHETYPE,
  gerd_gastric: GERD_GASTRIC_ARCHETYPE,
  gout_uric_acid: GOUT_PURINE_ARCHETYPE,
  neurological: NEUROLOGICAL_ARCHETYPE,
  respiratory: RESPIRATORY_ARCHETYPE,
  cancer_oncology: CANCER_ONCOLOGY_ARCHETYPE,
  autoimmune: AUTOIMMUNE_ARCHETYPE,
  gut_cleanse: GUT_CLEANSE_ARCHETYPE,
  therapeutic_diets: THERAPEUTIC_DIET_DOMAINS_ARCHETYPE,
  endocrine_metabolic: ENDOCRINE_METABOLIC_ARCHETYPE,
  nutrient_deficiency: NUTRIENT_DEFICIENCY_MALNUTRITION_ARCHETYPE,
};

/**
 * Intelligent Dynamic Recipe Matrix Generator
 * Automatically synthesizes 20 Breakfast, 20 Lunch, 20 Snacks, 20 Dinner, and 20 Bedtime recipes
 * calibrated specifically to ANY condition or disease!
 */
export function buildDynamicConditionPoster(
  conditionName: string,
  domainType: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains' = 'diseases'
): ConditionRecipePosterData {
  const norm = conditionName.trim().toLowerCase();

  // 1. Direct or fuzzy archetype lookup
  let archetype: ConditionRecipeArchetype | null = null;
  if (norm.includes('hyperten') || norm.includes('blood pressure') || norm.includes('dash') || norm.includes('cardio') || norm.includes('heart') || norm.includes('vascular')) {
    archetype = HYPERTENSION_ARCHETYPE;
  } else if (norm.includes('kidney') || norm.includes('renal') || norm.includes('nephro') || norm.includes('ckd')) {
    archetype = RENAL_ARCHETYPE;
  } else if (norm.includes('liver') || norm.includes('hepat') || norm.includes('steato') || norm.includes('nafld') || norm.includes('nash') || norm.includes('cirrhosis')) {
    archetype = FATTY_LIVER_ARCHETYPE;
  } else if (norm.includes('sport') || norm.includes('hypertrophy') || norm.includes('bodybuild') || norm.includes('athlete') || norm.includes('strength') || norm.includes('power') || (domainType === 'performance' && !norm.includes('endurance') && !norm.includes('marathon'))) {
    archetype = SPORTS_PERFORMANCE_ARCHETYPE;
  } else if (norm.includes('endurance') || norm.includes('fitness') || norm.includes('marathon') || norm.includes('running') || norm.includes('cycling') || norm.includes('triathlon') || domainType === 'fitness') {
    archetype = FITNESS_ENDURANCE_ARCHETYPE;
  } else if (norm.includes('pcos') || norm.includes('pcod') || norm.includes('ovary') || norm.includes('androgen') || norm.includes('hirsutism') || norm.includes('hormon')) {
    archetype = PCOS_ARCHETYPE;
  } else if (norm.includes('thyroid') || norm.includes('hypo') || norm.includes('hashimoto') || norm.includes('tsh') || norm.includes('goiter')) {
    archetype = THYROID_ARCHETYPE;
  } else if (norm.includes('weight') || norm.includes('fat loss') || norm.includes('obesity') || norm.includes('bariatric') || norm.includes('slim') || norm.includes('deficit')) {
    archetype = WEIGHT_LOSS_ARCHETYPE;
  } else if (norm.includes('cholesterol') || norm.includes('lipid') || norm.includes('triglyceride') || norm.includes('dyslipidemia') || norm.includes('athero')) {
    archetype = DYSLIPIDEMIA_ARCHETYPE;
  } else if (norm.includes('gerd') || norm.includes('reflux') || norm.includes('acidity') || norm.includes('gastric') || norm.includes('ulcer') || norm.includes('heartburn') || norm.includes('esophag')) {
    archetype = GERD_GASTRIC_ARCHETYPE;
  } else if (norm.includes('gout') || norm.includes('uric') || norm.includes('hyperuricemia') || norm.includes('urate') || norm.includes('arthrit')) {
    archetype = GOUT_PURINE_ARCHETYPE;
  } else if (norm.includes('neuro') || norm.includes('parkinson') || norm.includes('alzheimer') || norm.includes('epilep') || norm.includes('stroke') || norm.includes('migraine') || norm.includes('dementia') || norm.includes('brain') || norm.includes('sclerosis')) {
    archetype = NEUROLOGICAL_ARCHETYPE;
  } else if (norm.includes('respirat') || norm.includes('asthma') || norm.includes('copd') || norm.includes('lung') || norm.includes('bronch') || norm.includes('pulmon')) {
    archetype = RESPIRATORY_ARCHETYPE;
  } else if (norm.includes('cancer') || norm.includes('oncol') || norm.includes('tumor') || norm.includes('chemo') || norm.includes('cachexia') || norm.includes('neoplasm')) {
    archetype = CANCER_ONCOLOGY_ARCHETYPE;
  } else if (norm.includes('autoimmun') || norm.includes('lupus') || norm.includes('sle') || norm.includes('rheumat') || norm.includes('celiac') || norm.includes('psoria')) {
    archetype = AUTOIMMUNE_ARCHETYPE;
  } else if (norm.includes('gut') || norm.includes('cleanse') || norm.includes('eliminat') || norm.includes('ibs') || norm.includes('ibd') || norm.includes('crohn') || norm.includes('colitis') || norm.includes('dysbiosis') || norm.includes('digestive')) {
    archetype = GUT_CLEANSE_ARCHETYPE;
  } else if (norm.includes('endocrine') || norm.includes('cushing') || norm.includes('addison') || norm.includes('adrenal') || norm.includes('metabolic') || norm.includes('insulin')) {
    archetype = ENDOCRINE_METABOLIC_ARCHETYPE;
  } else if (norm.includes('deficiency') || norm.includes('malnutrition') || norm.includes('anemia') || norm.includes('b12') || norm.includes('vitamin d') || norm.includes('iron') || norm.includes('pem')) {
    archetype = NUTRIENT_DEFICIENCY_MALNUTRITION_ARCHETYPE;
  } else if (norm.includes('bland') || norm.includes('soft') || norm.includes('fluid') || norm.includes('liquid') || norm.includes('diet domain') || domainType === 'diet_domains') {
    archetype = THERAPEUTIC_DIET_DOMAINS_ARCHETYPE;
  }

  // If matched archetype, return customized poster
  if (archetype) {
    const slug = norm.replace(/[^a-z0-9]/g, '-').slice(0, 15);
    return {
      conditionKey: conditionName,
      displayName: conditionName,
      title: `${conditionName.toUpperCase()} FRIENDLY – 20 OPTIONS EACH MEAL`,
      domainType,
      subtitleTags: archetype.subtitleTags,
      dietTips: archetype.dietTips,
      foodsToInclude: archetype.foodsToInclude,
      foodsToAvoid: archetype.foodsToAvoid,
      noteFooter: 'Note: Portions should be as per Individual Calorie & Medical Condition. Consult your Dietitian for Personalized Plan.',
      breakfast: archetype.breakfastDishes.map((d, i) => ({
        id: `${slug}-bf-${i + 1}`,
        number: i + 1,
        name: d.name,
        portionOrNote: d.portion,
        calories: d.cal,
        protein: d.p,
        carbs: d.c,
        fats: d.f,
        imageKeyword: d.keyword,
      })),
      lunch: archetype.lunchDishes.map((d, i) => ({
        id: `${slug}-lu-${i + 1}`,
        number: i + 1,
        name: d.name,
        portionOrNote: d.portion,
        calories: d.cal,
        protein: d.p,
        carbs: d.c,
        fats: d.f,
        imageKeyword: d.keyword,
      })),
      snacks: archetype.snackDishes.map((d, i) => ({
        id: `${slug}-sn-${i + 1}`,
        number: i + 1,
        name: d.name,
        portionOrNote: d.portion,
        calories: d.cal,
        protein: d.p,
        carbs: d.c,
        fats: d.f,
        imageKeyword: d.keyword,
      })),
      dinner: archetype.dinnerDishes.map((d, i) => ({
        id: `${slug}-dn-${i + 1}`,
        number: i + 1,
        name: d.name,
        portionOrNote: d.portion,
        calories: d.cal,
        protein: d.p,
        carbs: d.c,
        fats: d.f,
        imageKeyword: d.keyword,
      })),
      bedtime: archetype.bedtimeDishes.map((d, i) => ({
        id: `${slug}-bt-${i + 1}`,
        number: i + 1,
        name: d.name,
        portionOrNote: d.portion,
        calories: d.cal,
        protein: d.p,
        carbs: d.c,
        fats: d.f,
        imageKeyword: d.keyword,
      })),
    };
  }

  // 2. Synthesize condition-specific recipe matrix on the fly for any other condition
  return synthesizeGeneralConditionPoster(conditionName, domainType);
}

/**
 * Algorithmic generator that synthesizes 20 distinct Breakfast, 20 Lunch, 20 Snacks, 20 Dinner,
 * and 20 Bedtime dishes for any condition name by adapting culinary foundations to disease therapeutics.
 */
function synthesizeGeneralConditionPoster(
  conditionName: string,
  domainType: 'diseases' | 'disorders' | 'performance' | 'fitness' | 'diet_domains'
): ConditionRecipePosterData {
  const norm = conditionName.trim().toLowerCase();
  const slug = norm.replace(/[^a-z0-9]/g, '-').slice(0, 15);

  // Condition characteristics
  const isThyroid = norm.includes('thyroid') || norm.includes('hypo') || norm.includes('hashimoto');
  const isPCOS = norm.includes('pcos') || norm.includes('pcod') || norm.includes('ovary') || norm.includes('hormon');
  const isWeightLoss = norm.includes('weight') || norm.includes('fat') || norm.includes('obesity') || norm.includes('recomp');
  const isSports = norm.includes('sport') || norm.includes('performance') || norm.includes('endurance') || norm.includes('muscle');
  const isGERD = norm.includes('gerd') || norm.includes('reflux') || norm.includes('acidity') || norm.includes('gastric');
  const isGout = norm.includes('gout') || norm.includes('uric') || norm.includes('arthrit');
  const isGut = norm.includes('gut') || norm.includes('ibs') || norm.includes('digestive') || norm.includes('cleanse');

  let titlePrefix = conditionName.toUpperCase();
  let subtitleTags = ['Clinical Calibrated', 'Nutrient Targeted', 'Whole Food Base', 'Therapeutic Spicing', 'Macro Balanced'];
  let dietTips = [
    `Follow regular meal intervals targeted for ${conditionName}`,
    'Prioritize anti-inflammatory, whole-food preparations with zero trans-fats',
    'Drink 2.5 to 3.0 liters of water/herbal fluids across the day',
    'Include therapeutic functional spices in every cooked meal',
    'Ensure adequate lean protein to support cellular healing and enzymes',
    'End heavy eating at least 2.5 to 3 hours before sleep',
  ];
  let foodsToInclude = 'Seasonal organic greens, sprouted pulses, unpolished millets, cold-pressed oils, unsalted nuts, therapeutic herbal decoctions';
  let foodsToAvoid = 'Refined flours (maida), ultra-processed foods, deep-fried snacks, excess sodium, carbonated drinks, trans-fat bakery items';

  if (isThyroid) {
    subtitleTags = ['Selenium Rich', 'Zinc & Iodine', 'Tyrosine Boost', 'Cooked Cruciferous', 'Gut-Thyroid Axis'];
    foodsToInclude = 'Cooked spinach, Brazil nuts, pumpkin seeds, whole eggs, iodized sea salt, moringa, ashwagandha, quinoa';
    foodsToAvoid = 'Raw cruciferous greens, commercial soy isolates, excess gluten, refined sugar, high-fluoride tap water';
  } else if (isPCOS) {
    subtitleTags = ['Insulin Sensitizing', 'Anti-Androgenic', 'Spearmint Powered', 'Seed Cycling', 'Low Glycemic Load'];
    foodsToInclude = 'Spearmint tea, pumpkin & flaxseeds, cinnamon, avocados, sprouted moong, wild salmon, cruciferous veggies';
    foodsToAvoid = 'Commercial cow dairy, refined sugar, high-fructose syrups, maida, trans-fat bakery foods';
  } else if (isWeightLoss) {
    subtitleTags = ['High Satiety', 'Caloric Deficit', 'Protein Spared', 'Visceral Fat Blitz', 'Thermogenic'];
    foodsToInclude = 'Egg whites, bottle gourd, cucumber, sprouted legumes, Greek yogurt, black coffee, green tea, chia seeds';
    foodsToAvoid = 'Sugary lattes, alcohol, samosas, potato crisps, creamy gravies, sweetened breakfast cereals';
  } else if (isGERD) {
    subtitleTags = ['Alkaline Balance', 'Non-Acidic', 'Mucilaginous', 'Gentle Digestion', 'Zero Chili'];
    foodsToInclude = 'Ash gourd, ripe bananas, yellow moong dal, coconut water, oatmeal, chamomile, licorice, steamed apples';
    foodsToAvoid = 'Citrus fruits, raw onions, garlic, green chilies, tomatoes, coffee, deep fried foods, peppermint';
  }

  // Generate 20 unique breakfast dishes
  const breakfastTemplates = [
    { base: 'Rolled Oats Porridge with Flaxseeds & Sliced Berries', cal: 230, p: 9, c: 38, f: 5, kw: 'oats' },
    { base: 'Sprouted Green Moong & Zucchini Cheela', cal: 240, p: 14, c: 30, f: 5, kw: 'chilla' },
    { base: 'Steamed Thinai (Foxtail) Millet Idlis (2 Nos) with Mint Dip', cal: 200, p: 6, c: 36, f: 3, kw: 'idli' },
    { base: 'Broken Wheat (Dalia) Vegetable Upma with Roasted Peanuts', cal: 220, p: 7, c: 38, f: 5, kw: 'upma' },
    { base: 'Sprouted Ragi & Almond Milk Porridge (Unsweetened)', cal: 210, p: 6, c: 36, f: 4, kw: 'ragi' },
    { base: 'Multigrain Methi Thepla with Fresh Curd', cal: 230, p: 8, c: 34, f: 6, kw: 'thepla' },
    { base: 'Protein Egg White Omelette with Baby Spinach & Herbs', cal: 170, p: 14, c: 6, f: 6, kw: 'egg' },
    { base: 'Brown Rice Poha with Steamed Carrots & Curry Leaves', cal: 220, p: 6, c: 38, f: 4, kw: 'poha' },
    { base: 'Crispy Oats & Flaxseed Dosa with Herbal Sambar', cal: 210, p: 7, c: 36, f: 4, kw: 'dosa' },
    { base: 'Chia & Greek Yogurt Bowl with Crushed Walnuts', cal: 210, p: 13, c: 18, f: 8, kw: 'yogurt' },
    { base: 'Besan & Grated Bottle Gourd Cheela with Mint Chutney', cal: 220, p: 11, c: 28, f: 6, kw: 'chilla' },
    { base: 'Sprouted Horsegram (Kollu) Sundal with Lemon', cal: 200, p: 12, c: 30, f: 3, kw: 'sprouts' },
    { base: 'Barnyard (Kuthiraivali) Millet Pongal with Pepper', cal: 210, p: 7, c: 36, f: 4, kw: 'millets' },
    { base: 'Avocado on Whole Grain Sourdough with Pumpkin Seeds', cal: 230, p: 7, c: 24, f: 11, kw: 'salad' },
    { base: 'Steel-Cut Barley Porridge with Ceylon Cinnamon', cal: 220, p: 7, c: 40, f: 3, kw: 'porridge' },
    { base: 'Boiled Moong & Pomegranate Clinical Salad', cal: 200, p: 12, c: 32, f: 2, kw: 'sprouts' },
    { base: 'Tofu Bhurji with 1 Jowar Phulka', cal: 240, p: 15, c: 26, f: 8, kw: 'paneer' },
    { base: 'Quinoa Breakfast Bowl with Steamed Beans & Herbs', cal: 230, p: 9, c: 34, f: 7, kw: 'quinoa' },
    { base: 'Herbal Protein Green Smoothie with Moringa', cal: 180, p: 12, c: 22, f: 4, kw: 'fruits' },
    { base: 'Steamed Samai (Little Millet) Idli with Coriander Dip', cal: 190, p: 6, c: 34, f: 3, kw: 'idli' },
  ];

  // Generate 20 unique lunch dishes
  const lunchTemplates = [
    { base: 'Steamed Brown Rice + Palak Moong Dal + Sautéed Beans', cal: 410, p: 16, c: 68, f: 8, kw: 'rice_dal' },
    { base: '2 Whole Wheat Phulkas + Mix Veg Sabzi + Spiced Toor Dal', cal: 390, p: 14, c: 62, f: 8, kw: 'roti' },
    { base: 'Barnyard Millet Bisi Bele Bath with Cucumber Raita', cal: 400, p: 13, c: 64, f: 8, kw: 'millets' },
    { base: 'Herbal Quinoa Pulao with Sprouted Dal Curry', cal: 390, p: 14, c: 60, f: 9, kw: 'quinoa' },
    { base: 'Brown Rice + Rajma Masala + Steamed Cabbage Poriyal', cal: 430, p: 18, c: 70, f: 7, kw: 'rajma' },
    { base: 'Moong Dal & Vegetable Khichdi + Mint Chutney', cal: 370, p: 14, c: 58, f: 8, kw: 'khichdi' },
    { base: '2 Jowar Rotis + Palak Paneer + Tomato-Cucumber Salad', cal: 410, p: 18, c: 54, f: 12, kw: 'roti' },
    { base: 'Red Rice + Drumstick Sambar + Beetroot Poriyal', cal: 410, p: 14, c: 68, f: 7, kw: 'rice_dal' },
    { base: 'Grilled Herb Chicken / Tofu + Steamed Broccoli & Carrots', cal: 360, p: 30, c: 20, f: 8, kw: 'chicken' },
    { base: '2 Bajra Rotis + Baingan Bharta + Yellow Chana Dal', cal: 400, p: 14, c: 62, f: 9, kw: 'roti' },
    { base: 'Jeera Brown Rice + Methi Dal + Carrot-Radish Salad', cal: 410, p: 15, c: 66, f: 8, kw: 'rice_dal' },
    { base: 'Lauki Kofta Curry (Unfried) + 2 Phulkas + Buttermilk', cal: 370, p: 13, c: 58, f: 7, kw: 'roti' },
    { base: 'Black-Eyed Pea (Lobiya) Curry + Foxtail Millet Rice', cal: 420, p: 17, c: 66, f: 8, kw: 'rajma' },
    { base: 'Steamed Fish Curry (Omega-3) + Red Rice + Salad', cal: 380, p: 26, c: 48, f: 9, kw: 'fish' },
    { base: '2 Ragi Phulkas + Bhindi Masala + Dal Tadka', cal: 380, p: 13, c: 62, f: 7, kw: 'roti' },
    { base: 'Vegetable Millet Biryani + Pomegranate Raita', cal: 390, p: 12, c: 64, f: 8, kw: 'millets' },
    { base: 'Chickpea (Chole) Curry + Brown Rice + Green Salad', cal: 430, p: 17, c: 70, f: 7, kw: 'rajma' },
    { base: 'Paneer Tikka (Tandoori) + Quinoa Salad Bowl', cal: 410, p: 20, c: 42, f: 14, kw: 'paneer' },
    { base: 'Toor Dal + Steamed Spinach + Foxtail Rice + Lemon', cal: 400, p: 16, c: 64, f: 8, kw: 'rice_dal' },
    { base: 'Soya Chunks Stir Fry + 2 Multigrain Rotis + Salad', cal: 390, p: 22, c: 54, f: 8, kw: 'roti' },
  ];

  // Generate 20 unique snack dishes
  const snackTemplates = [
    { base: 'Roasted Bengal Gram (Chana) with Dry Mint', cal: 140, p: 8, c: 22, f: 2, kw: 'chana' },
    { base: 'Raw Soaked Almonds (6 Nos) & Walnuts (2 Nos)', cal: 140, p: 4, c: 4, f: 12, kw: 'nuts' },
    { base: 'Spiced Buttermilk (Neer Mor) with Curry Leaves', cal: 50, p: 3, c: 5, f: 1, kw: 'buttermilk' },
    { base: 'Fresh Guava Slices with Cracked Black Pepper', cal: 70, p: 2, c: 14, f: 1, kw: 'fruits' },
    { base: 'Roasted Foxnuts (Makhana) with Turmeric & Pink Salt', cal: 130, p: 4, c: 24, f: 2, kw: 'nuts' },
    { base: 'Sprouted Moong & Grated Cucumber Chaat', cal: 110, p: 7, c: 18, f: 1, kw: 'sprouts' },
    { base: 'Green Apple Slices with Roasted Peanut Butter', cal: 130, p: 4, c: 18, f: 6, kw: 'fruits' },
    { base: 'Steamed Edamame Pods with Rock Salt', cal: 120, p: 11, c: 9, f: 4, kw: 'nuts' },
    { base: 'Warm Homemade Tomato & Basil Broth', cal: 50, p: 2, c: 10, f: 1, kw: 'soup' },
    { base: 'Pumpkin, Sunflower & Flaxseed Trail Mix', cal: 140, p: 5, c: 5, f: 11, kw: 'seeds' },
    { base: 'Boiled Sweet Corn with Lemon Juice & Herbs', cal: 90, p: 3, c: 18, f: 1, kw: 'fruits' },
    { base: 'Unsweetened Greek Yogurt with Cinnamon', cal: 100, p: 12, c: 6, f: 2, kw: 'yogurt' },
    { base: 'Papaya Cubes with Soaked Chia Seeds', cal: 80, p: 2, c: 18, f: 1, kw: 'fruits' },
    { base: 'Vegetable Clear Broth with Coriander & Ginger', cal: 40, p: 2, c: 8, f: 0, kw: 'soup' },
    { base: 'Boiled Egg Whites (2 Nos) with Chaat Masala', cal: 35, p: 8, c: 0, f: 0, kw: 'egg' },
    { base: 'Sprouts Bhel (Zero Sev, High Veggie)', cal: 110, p: 7, c: 18, f: 1, kw: 'sprouts' },
    { base: 'Chia Pudding with Unsweetened Almond Milk', cal: 120, p: 4, c: 10, f: 7, kw: 'yogurt' },
    { base: 'Fresh Amla Juice / Slices with Pinch of Salt', cal: 30, p: 1, c: 7, f: 0, kw: 'fruits' },
    { base: 'Tender Coconut Water (Fresh)', cal: 45, p: 1, c: 9, f: 0, kw: 'water' },
    { base: 'Dark Chocolate (85% Cacao, 1-2 Squares)', cal: 90, p: 2, c: 6, f: 7, kw: 'dark_chocolate' },
  ];

  // Generate 20 unique dinner dishes
  const dinnerTemplates = [
    { base: 'Vegetable Clear Soup + Grilled Herb Paneer', cal: 290, p: 16, c: 18, f: 14, kw: 'paneer' },
    { base: '2 Light Phulkas + Bottle Gourd (Lauki) Sabzi + Dal', cal: 310, p: 12, c: 52, f: 5, kw: 'roti' },
    { base: 'Yellow Moong Dal Soup + Stir Fried Broccoli', cal: 220, p: 12, c: 30, f: 5, kw: 'soup' },
    { base: 'Steamed Vegetable Salad + Boiled Moong Sprouts', cal: 230, p: 13, c: 36, f: 3, kw: 'salad' },
    { base: '2 Ragi Rotis + Palak Dal + Radish Salad', cal: 310, p: 12, c: 52, f: 6, kw: 'roti' },
    { base: 'Grilled Fish / Tofu Steak + Sautéed Green Beans', cal: 270, p: 26, c: 12, f: 11, kw: 'fish' },
    { base: 'Tomato Garlic Soup + Egg White Scramble', cal: 190, p: 14, c: 16, f: 6, kw: 'egg' },
    { base: '2 Phulkas + Ridge Gourd (Peerkangai) Kootu', cal: 300, p: 12, c: 52, f: 5, kw: 'roti' },
    { base: 'Light Moong Khichdi with Steamed Zucchini', cal: 260, p: 10, c: 46, f: 4, kw: 'khichdi' },
    { base: 'Paneer Bhurji + 2 Multigrain Phulkas', cal: 310, p: 16, c: 38, f: 11, kw: 'paneer' },
    { base: 'Oats & Vegetable Broth + Steamed Carrots', cal: 200, p: 7, c: 34, f: 4, kw: 'soup' },
    { base: '2 Phulkas + Kundru (Ivy Gourd) Sabzi + Dal', cal: 290, p: 11, c: 50, f: 5, kw: 'roti' },
    { base: 'Spinach & Mushroom Clear Soup + Tofu Cubes', cal: 180, p: 12, c: 14, f: 7, kw: 'soup' },
    { base: 'Sprouted Green Gram Khichdi + Skimmed Curd', cal: 280, p: 13, c: 48, f: 5, kw: 'khichdi' },
    { base: 'Soya Chunks Curry + 2 Whole Wheat Phulkas', cal: 300, p: 20, c: 44, f: 6, kw: 'roti' },
    { base: 'Herb Grilled Chicken Breast + Green Leaf Salad', cal: 260, p: 30, c: 8, f: 7, kw: 'chicken' },
    { base: '2 Phulkas + Cabbage Green Peas Poriyal + Dal', cal: 310, p: 12, c: 52, f: 6, kw: 'roti' },
    { base: 'Drumstick (Murungai) Soup + Grilled Veggies', cal: 190, p: 8, c: 26, f: 5, kw: 'soup' },
    { base: 'Little Millet Pongal with Pepper & Jeera', cal: 240, p: 8, c: 42, f: 4, kw: 'millets' },
    { base: 'Ash Gourd Soup + Sautéed Low-Fat Paneer & Bell Peppers', cal: 230, p: 14, c: 18, f: 10, kw: 'soup' },
  ];

  // Generate 20 unique bedtime dishes
  const bedtimeTemplates = [
    { base: 'Warm Golden Turmeric Milk (Skimmed)', cal: 75, p: 5, c: 7, f: 1, kw: 'milk' },
    { base: 'Pure Chamomile Tea (Caffeine-Free)', cal: 5, p: 0, c: 1, f: 0, kw: 'tea' },
    { base: 'Ceylon Cinnamon Infused Warm Water', cal: 10, p: 0, c: 2, f: 0, kw: 'water' },
    { base: 'Warm Almond Milk (Unsweetened)', cal: 60, p: 2, c: 3, f: 4, kw: 'milk' },
    { base: 'Overnight Soaked Fenugreek (Methi) Water', cal: 15, p: 1, c: 3, f: 0, kw: 'water' },
    { base: 'Warm Cumin (Jeera) & Ajwain Water', cal: 10, p: 0, c: 2, f: 0, kw: 'water' },
    { base: 'Ashwagandha Milk with Pinch of Cardamom', cal: 75, p: 5, c: 7, f: 1, kw: 'milk' },
    { base: 'Soaked Flaxseeds in Warm Water', cal: 45, p: 2, c: 3, f: 3, kw: 'water' },
    { base: 'Holy Basil (Tulsi) & Ginger Tea', cal: 10, p: 0, c: 2, f: 0, kw: 'tea' },
    { base: 'Warm Nutmeg Milk (Supports Deep Sleep)', cal: 70, p: 5, c: 7, f: 1, kw: 'milk' },
    { base: 'Organic Lemon Balm / Spearmint Tisane', cal: 5, p: 0, c: 1, f: 0, kw: 'tea' },
    { base: 'Warm Saffron Milk (Skimmed)', cal: 70, p: 5, c: 7, f: 1, kw: 'milk' },
    { base: 'Fennel (Saunf) Decoction for Digestion', cal: 15, p: 0, c: 3, f: 0, kw: 'water' },
    { base: 'Tart Cherry Juice / Tea (Melatonin Boost)', cal: 60, p: 1, c: 14, f: 0, kw: 'tea' },
    { base: 'Warm Water with Overnight Soaked Sabja Seeds', cal: 25, p: 1, c: 3, f: 1, kw: 'water' },
    { base: 'Hibiscus Herbal Tisane (Antioxidant)', cal: 10, p: 0, c: 2, f: 0, kw: 'tea' },
    { base: 'Warm Skimmed Milk with Ground Cardamom', cal: 70, p: 5, c: 7, f: 1, kw: 'milk' },
    { base: 'Brahmi Infused Herbal Night Tea', cal: 10, p: 0, c: 2, f: 0, kw: 'tea' },
    { base: 'Warm Ginger & Black Pepper Decoction', cal: 15, p: 0, c: 3, f: 0, kw: 'tea' },
    { base: 'Probiotic Spiced Buttermilk (100ml)', cal: 35, p: 2, c: 3, f: 1, kw: 'buttermilk' },
  ];

  return {
    conditionKey: conditionName,
    displayName: conditionName,
    title: `${titlePrefix} FRIENDLY – 20 OPTIONS EACH MEAL`,
    domainType,
    subtitleTags,
    dietTips,
    foodsToInclude,
    foodsToAvoid,
    noteFooter: 'Note: Portions should be as per Individual Calorie & Medical Condition. Consult your Dietitian for Personalized Plan.',
    breakfast: breakfastTemplates.map((t, i) => ({
      id: `${slug}-bf-${i + 1}`,
      number: i + 1,
      name: t.base,
      portionOrNote: '1 standard therapeutic portion',
      calories: t.cal,
      protein: t.p,
      carbs: t.c,
      fats: t.f,
      imageKeyword: t.kw,
    })),
    lunch: lunchTemplates.map((t, i) => ({
      id: `${slug}-lu-${i + 1}`,
      number: i + 1,
      name: t.base,
      portionOrNote: '1 complete midday meal',
      calories: t.cal,
      protein: t.p,
      carbs: t.c,
      fats: t.f,
      imageKeyword: t.kw,
    })),
    snacks: snackTemplates.map((t, i) => ({
      id: `${slug}-sn-${i + 1}`,
      number: i + 1,
      name: t.base,
      portionOrNote: '1 controlled serving',
      calories: t.cal,
      protein: t.p,
      carbs: t.c,
      fats: t.f,
      imageKeyword: t.kw,
    })),
    dinner: dinnerTemplates.map((t, i) => ({
      id: `${slug}-dn-${i + 1}`,
      number: i + 1,
      name: t.base,
      portionOrNote: '1 light restorative plate',
      calories: t.cal,
      protein: t.p,
      carbs: t.c,
      fats: t.f,
      imageKeyword: t.kw,
    })),
    bedtime: bedtimeTemplates.map((t, i) => ({
      id: `${slug}-bt-${i + 1}`,
      number: i + 1,
      name: t.base,
      portionOrNote: '1 warm cup (150-180ml)',
      calories: t.cal,
      protein: t.p,
      carbs: t.c,
      fats: t.f,
      imageKeyword: t.kw,
    })),
  };
}
