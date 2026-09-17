import { GeneralInfo, Calculations } from '../types';
import { CustomDayPlan } from '../data/customStudio7DayPlans';

export interface ExerciseDayItem {
  dayNumber: number;
  dayName: string;
  protocolTitle: string;
  focusArea: string;
  durationMins: number;
  intensityLevel: 'Zone 1-2 (Light-Moderate)' | 'Zone 2-3 (Aerobic Base)' | 'Zone 3-4 (Metabolic Threshold)' | 'Zone 4-5 (Peak Performance)' | 'Restorative';
  targetHeartRate: string;
  movements: {
    name: string;
    setsAndReps: string;
    clinicalRationale: string;
  }[];
  postWorkoutRecovery: string;
  day?: string | number;
  duration?: string;
  focus?: string;
  activity?: string;
  guideline?: string;
  exercises?: any[];
  intensity?: string;
}

export interface DomainPlanPackage {
  domainId: string;
  domainName: string;
  conditionDescription: string;
  caloricTarget: number;
  macroRatio: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
    fiberGrams: number;
  };
  dietPlans: CustomDayPlan[];
  exercisePlans: ExerciseDayItem[];
  dos: string[];
  donts: string[];
  nutritionTip: string;
  exerciseTip: string;
}

export const CLINICAL_DOMAINS_LIST = [
  // Diseases & Disorders
  { id: 'diabetes', name: 'Type 2 Diabetes Mellitus & Metabolic Syndrome', group: 'Diseases & Disorders' },
  { id: 'hypertension', name: 'Hypertension & Cardiovascular Health (DASH)', group: 'Diseases & Disorders' },
  { id: 'pcos', name: 'PCOS / PCOD & Hormonal Balance', group: 'Diseases & Disorders' },
  { id: 'fatty_liver', name: 'NAFLD (Non-Alcoholic Fatty Liver Disease)', group: 'Diseases & Disorders' },
  { id: 'dyslipidemia', name: 'Dyslipidemia & High Cholesterol', group: 'Diseases & Disorders' },
  { id: 'hypothyroid', name: 'Hypothyroidism & Hashimoto\'s Metabolic Pacing', group: 'Diseases & Disorders' },
  { id: 'gut_cleanse', name: 'Gut Cleanse & 12-Day Elimination (IBS/SIBO)', group: 'Diseases & Disorders' },
  { id: 'renal', name: 'Chronic Kidney Disease (Stage 1-2 Renal Spared)', group: 'Diseases & Disorders' },
  // Performance & Fitness
  { id: 'hypertrophy', name: 'Athletic Muscle Hypertrophy & Bodybuilding', group: 'Performance & Fitness' },
  { id: 'endurance', name: 'Marathon & Long-Distance Endurance Running', group: 'Performance & Fitness' },
  { id: 'fat_loss', name: 'Caloric Deficit Fat Loss & Athletic Shred', group: 'Performance & Fitness' },
  { id: 'combat_sports', name: 'Combat Sports, Boxing & Weight Category Cutting', group: 'Performance & Fitness' },
  { id: 'desk_worker', name: 'Desk Worker Postural Reset & Metabolic Vitality', group: 'Performance & Fitness' },
  { id: 'functional_sports', name: 'Functional Sports Conditioning (Cricket/Football/Badminton)', group: 'Performance & Fitness' },
];

export function generateDomainDietAndExercisePlan(
  domainId: string,
  generalInfo: GeneralInfo,
  calculations: Calculations
): DomainPlanPackage {
  const weight = typeof generalInfo.weight === 'number' ? generalInfo.weight : parseFloat(String(generalInfo.weight)) || 62;
  const isFemale = generalInfo.sex === 'Female';
  const tdee = calculations.tdee || 2000;

  // Domain-specific baseline calibration
  let targetKcal = 1600;
  let proteinFactor = 1.0; // g/kg
  let conditionDesc = 'Personalized nutrition & exercise plan for metabolic health.';
  let dos: string[] = [];
  let donts: string[] = [];
  let nutritionTip = 'Eat slowly and mindfully. This helps in better digestion and prevents overeating.';
  let exerciseTip = 'Consistent Zone 2 aerobic pacing improves mitochondrial efficiency and insulin sensitivity.';

  switch (domainId) {
    case 'diabetes':
      targetKcal = Math.round(tdee * 0.82); // gentle 18% deficit
      proteinFactor = 1.1;
      conditionDesc = 'Low-GI glycemic stabilization, post-meal glucose blunting & mucosal priming';
      dos = [
        'Stay hydrated (2.5 - 3.0 L water with electrolytes)',
        'Include fibre-rich whole millets & salads before carbs',
        'Eat on time following a 12-14 hour nocturnal fasting window',
        'Choose home-cooked meals prepared with cold-pressed oils',
        'Take a 15-minute gentle walk within 30 minutes after lunch and dinner',
      ];
      donts = [
        'Avoid sugary drinks, sodas, and sweetened fruit juices',
        'Avoid deep-fried snacks, trans fats, and refined maida',
        'Avoid packaged ultra-processed biscuits and mixtures',
        'Avoid excess sodium and table salt additions',
        'Avoid late-night eating past 8:30 PM',
      ];
      nutritionTip = 'Consuming fiber and vegetable salads 10 minutes before grains slows carbohydrate digestion by 35%.';
      exerciseTip = 'Skeletal muscle contractions act as an insulin-independent glucose transporter (GLUT4 translocation).';
      break;

    case 'hypertension':
      targetKcal = Math.round(tdee * 0.85);
      proteinFactor = 1.05;
      conditionDesc = 'DASH protocol, high potassium/magnesium, low-sodium endothelial preservation';
      dos = [
        'Keep sodium intake under 1,500mg daily; use herbs and lemon for flavor',
        'Consume potassium-rich foods (tender coconut, spinach, papaya, pomegranate)',
        'Include magnesium-rich pumpkin seeds and almonds daily',
        'Maintain daily cardiovascular activity for blood pressure regulation',
        'Practice 15 minutes of slow diaphragmatic pranayama daily',
      ];
      donts = [
        'Avoid pickles, papads, commercial sauces, and canned foods',
        'Avoid table salt shakers during meals',
        'Avoid energy drinks, excessive caffeine, and liquorice',
        'Avoid highly strenuous isometric breath-holding (Valsalva maneuver)',
        'Avoid smoking and secondary tobacco smoke exposure',
      ];
      nutritionTip = 'Dietary potassium and natural beetroot nitrates expand endothelial nitric oxide and lower systolic BP.';
      exerciseTip = 'Moderate aerobic exercise induces post-exercise hypotension lasting up to 22 hours.';
      break;

    case 'pcos':
      targetKcal = Math.round(tdee * 0.85);
      proteinFactor = 1.2;
      conditionDesc = 'Anti-inflammatory, androgen-lowering, inositol-rich metabolic endocrine reset';
      dos = [
        'Drink 2 cups of organic spearmint tea daily to reduce free testosterone',
        'Pair every carbohydrate with healthy protein or fats to prevent LH spikes',
        'Incorporate sprouted seeds (pumpkin, flax, sesame) matching menstrual phases',
        'Perform compound resistance training 3-4 days a week for insulin sensitivity',
        'Prioritize 8 hours of deep restorative sleep in a pitch-black room',
      ];
      donts = [
        'Avoid commercial non-organic dairy with exogenous hormones',
        'Avoid refined sugars, pastries, and high-fructose corn syrups',
        'Avoid prolonged high-intensity chronic cardio that elevates cortisol',
        'Avoid skipping breakfast; eat within 90 minutes of waking',
        'Avoid chemical endocrine disruptors and plastic food containers',
      ];
      nutritionTip = 'Myo-inositol rich foods like cantaloupe, citrus, and soaked legumes restore ovarian follicular sensitivity.';
      exerciseTip = 'Resistance training builds lean muscle mass which clears circulating glucose without taxing adrenals.';
      break;

    case 'fatty_liver':
      targetKcal = Math.round(tdee * 0.80);
      proteinFactor = 1.25;
      conditionDesc = 'Hepatic lipogenesis reversal, choline & glutathione rich liver detox';
      dos = [
        'Include sulfur-rich cruciferous vegetables (broccoli, cabbage, radish) daily',
        'Drink black coffee without sugar (2 cups/day) for hepatic fibrosis reduction',
        'Consume omega-3 rich walnuts, chia seeds, and fatty cold-water fish',
        'Engage in brisk walking or cycling for 45 minutes daily',
        'Stay strictly hydrated with warm lemon water and green tea',
      ];
      donts = [
        'Avoid high-fructose corn syrup, packaged fruit juices, and sweets',
        'Avoid all alcoholic beverages and sugary mocktails',
        'Avoid red meats, hydrogenated vegetable oils, and vanaspati',
        'Avoid excessive paracetamol or unnecessary NSAID medication',
        'Avoid heavy dinners eaten less than 3 hours before bed',
      ];
      nutritionTip = 'Fructose is metabolized exclusively by hepatocytes into intrahepatic triglycerides; eliminating liquid fructose halts fatty liver progression.';
      exerciseTip = 'Both aerobic and resistance training independently deplete intrahepatic lipid droplets by 25-30%.';
      break;

    case 'hypertrophy':
      targetKcal = Math.round(tdee * 1.12); // clean surplus
      proteinFactor = 1.8;
      conditionDesc = 'Lean muscle protein synthesis, progressive overload support & recovery';
      dos = [
        'Target 1.8g - 2.0g protein per kg bodyweight divided across 4-5 meals',
        'Consume 25-30g high-quality protein within 45 minutes post-workout',
        'Hydrate with 3.5 - 4.0 L water with intra-workout electrolytes',
        'Progressively overload compound lifts (Squat, Bench, Deadlift, Overhead Press)',
        'Sleep 8 - 9 hours every night for maximal growth hormone release',
      ];
      donts = [
        'Avoid empty junk calories (dirty bulking) that accumulate visceral fat',
        'Avoid training without proper muscular warm-up and rotator cuff activation',
        'Avoid neglecting carbohydrate intake, which spares muscle protein breakdown',
        'Avoid training the same muscle group within 48 hours of heavy eccentric soreness',
        'Avoid relying solely on supplements without whole-food nutritional foundation',
      ];
      nutritionTip = 'Leucine threshold (2.7 - 3.2g per meal) must be reached to activate mTOR pathway and trigger myofibrillar protein synthesis.';
      exerciseTip = 'Focus on mechanical tension with controlled 3-second eccentric tempo and training 1-2 reps shy of technical failure.';
      break;

    case 'endurance':
      targetKcal = Math.round(tdee * 1.15);
      proteinFactor = 1.35;
      conditionDesc = 'Mitochondrial biogenesis, muscle glycogen re-synthesis & electrolyte balance';
      dos = [
        'Maintain carbohydrate intake at 55-60% of total energy from complex millets and tubers',
        'Practice intra-run fueling (30-60g carbs/hr for sessions over 75 mins)',
        'Replenish sodium (500-700mg/L) during heavy perspiration sessions',
        'Include tart cherry juice and turmeric post-run for delayed onset muscle soreness',
        'Perform dedicated weekly mobility, foam rolling, and calf/achilles care',
      ];
      donts = [
        'Avoid trying new unfamiliar gels or foods on long race/training days',
        'Avoid dehydration leading to >2% body mass fluid deficit',
        'Avoid neglecting strength training for hips, glutes, and core stability',
        'Avoid high-fiber gas-producing meals within 2 hours of high-effort running',
        'Avoid ignoring early signs of plantar fasciitis or shin splints',
      ];
      nutritionTip = 'Glycogen synthase enzyme peaks within 30 minutes post-run; replenishing with a 3:1 carb-to-protein ratio doubles glycogen storage rates.';
      exerciseTip = '80% of running volume must remain in Zone 2 to maximize capillary density and fatty acid oxidation capacity.';
      break;

    case 'fat_loss':
      targetKcal = Math.round(tdee * 0.78); // 22% deficit
      proteinFactor = 1.6; // high protein to spare muscle
      conditionDesc = 'Sustainable fat loss, lean muscle preservation & metabolic rate protection';
      dos = [
        'Maintain high protein intake (1.6g/kg) to maximize thermic effect of food (TEF) and satiety',
        'Eat 35g+ dietary fiber daily from green vegetables and whole pulses',
        'Aim for 10,000 to 12,000 steps daily (Non-Exercise Activity Thermogenesis / NEAT)',
        'Prioritize heavy resistance training to signal body to burn fat instead of muscle',
        'Drink 500ml water 20 minutes before each meal to promote satiety',
      ];
      donts = [
        'Avoid crash dieting under 1,200 kcal which crashes thyroid and metabolic rate',
        'Avoid liquid calories, sugar syrups, creamy dressings, and hidden oils',
        'Avoid mindless snacking while watching TV or scrolling on smartphones',
        'Avoid chronic cardio without weight training (causes skinny-fat physique)',
        'Avoid chronic sleep deprivation which spikes ghrelin (hunger hormone) by 28%',
      ];
      nutritionTip = 'Protein has a 20-30% thermic effect, meaning 25 calories out of every 100 protein calories are burned simply during digestion.';
      exerciseTip = 'Lifting weights in a caloric deficit preserves Type II muscle fibers, ensuring that 85%+ of weight lost is pure adipose tissue.';
      break;

    default: // Weight Management / General Metabolic
      targetKcal = Math.round(tdee * 0.84);
      proteinFactor = 1.1;
      conditionDesc = 'Personalized nutrition plan for your health goals & metabolic vitality';
      dos = [
        'Stay hydrated (2.5 - 3 L water daily)',
        'Include fibre rich foods (vegetables, salads, whole pulses)',
        'Eat on time following balanced circadian intervals',
        'Choose home-cooked meals prepared with mindful portioning',
        'Maintain portion control and chew each bite mindfully',
      ];
      donts = [
        'Avoid sugary drinks, sodas, and sweetened beverages',
        'Avoid deep-fried foods and trans-fat cooking oils',
        'Avoid packaged snacks and ultra-processed foods',
        'Avoid excess salt and preserved sodium items',
        'Avoid late-night eating past 8:30 PM',
      ];
      nutritionTip = 'Eat slowly and mindfully. This helps in better digestion and prevents overeating.';
      exerciseTip = 'Consistent daily movement and moderate aerobic pacing improve insulin sensitivity and cardiovascular health.';
      break;
  }

  // Calculate macros
  const proteinGrams = Math.round(weight * proteinFactor);
  const fatGrams = Math.round((targetKcal * 0.25) / 9);
  const carbsGrams = Math.round((targetKcal - (proteinGrams * 4 + fatGrams * 9)) / 4);
  const fiberGrams = Math.max(32, Math.round(weight * 0.5));

  // Build 7-Day Diet Plans (Days 1 to 7)
  const dietPlans: CustomDayPlan[] = build7DayDietPlanForDomain(domainId, targetKcal, proteinGrams, fatGrams, carbsGrams, fiberGrams);

  // Build 7-Day Exercise Plans (Days 1 to 7)
  const exercisePlans: ExerciseDayItem[] = build7DayExercisePlanForDomain(domainId, generalInfo);

  return {
    domainId,
    domainName: CLINICAL_DOMAINS_LIST.find((d) => d.id === domainId)?.name || 'Custom Metabolic Domain',
    conditionDescription: conditionDesc,
    caloricTarget: targetKcal,
    macroRatio: {
      carbsGrams,
      proteinGrams,
      fatGrams,
      fiberGrams,
    },
    dietPlans,
    exercisePlans,
    dos,
    donts,
    nutritionTip,
    exerciseTip,
  };
}

// Helper to construct domain-specific 7 days of diet
function build7DayDietPlanForDomain(
  domainId: string,
  targetKcal: number,
  protein: number,
  fat: number,
  carbs: number,
  fiber: number
): CustomDayPlan[] {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const templates: Record<string, { breakfast: string; lunch: string; evening: string; dinner: string }> = {
    diabetes: {
      breakfast: 'Methi Moong Dal Dosa (2 pcs) + Mint Coriander Chutney (2 tbsp)',
      lunch: 'Brown Rice (1 cup) + Drumstick Sambar (1 cup) + Bottle Gourd Poriyal + Low-Fat Curd (1/2 cup)',
      evening: 'Sprouted Kala Chana Sundal (1 cup) + Cinnamon Green Tea',
      dinner: 'Barnyard Millet Vegetable Khichdi (1 bowl) + Steamed Palak Soup',
    },
    hypertension: {
      breakfast: 'Ragi Idli (3 pcs) + Tomato Onion Sambar (Low Sodium) + 5 Soaked Almonds',
      lunch: 'Steamed Red Rice (1 cup) + Spinach Dal (1 cup) + Roasted Beetroot & Carrot Poriyal + Spiced Buttermilk',
      evening: 'Unsalted Roasted Pumpkin & Sunflower Seeds (2 tbsp) + Tender Coconut Water',
      dinner: 'Foxtail Millet Pongal (1 bowl) + Steamed Bottle Gourd Kootu',
    },
    pcos: {
      breakfast: 'Sprouted Moong Chilla (2 pcs) with Avocado Guacamole & Mint Chutney',
      lunch: 'Quinoa Bisibelebath (1 bowl) + Cucumber Mint Salad + Steamed Beans Poriyal',
      evening: 'Spearmint Tea + Roasted Makhana & Brazil Nuts (2 nos)',
      dinner: 'Grilled Paneer / Tofu (100g) with Steamed Broccoli, Zucchini & Garlic Soup',
    },
    hypertrophy: {
      breakfast: '4 Egg Whites + 1 Whole Egg Scramble (or 150g Tofu) + 2 Slices Sourdough Bread + 1 Banana',
      lunch: 'Brown Rice (1.5 cups) + Grilled Chicken Breast (150g) / Paneer Tikka (150g) + Yellow Dal + Mixed Veggies',
      evening: 'Whey Protein Isolate (1 scoop in 200ml water) + 1 Apple + 10 Almonds',
      dinner: 'Quinoa Bowl with Steamed Soy Chunks (80g) / Fish Fillet (150g) + Sauteed Greens + Lentil Soup',
    },
    fat_loss: {
      breakfast: 'Moong Dal & Spinach Cheela (2 pcs) + Fresh Coriander Chutney + 2 Boiled Egg Whites',
      lunch: 'Large Raw Salad Bowl with Cucumber & Carrots + 1 Cup Brown Rice + Sprouted Dal + Steamed Ridge Gourd',
      evening: 'Boiled Chickpea Chaat with Onion & Lemon (1 cup) + Green Tea (Zero Sugar)',
      dinner: 'Clear Vegetable Soup with Paneer Cubes (60g) + 1 Sprouted Ragi Roti with Methi Dal',
    },
  };

  const currentTemplate = templates[domainId] || templates['diabetes'];

  return dayNames.map((name, idx) => {
    const dayNum = idx + 1;
    return {
      dayNumber: dayNum,
      dayName: name,
      focus: `Day ${dayNum} - Therapeutic Protocol & Circadian Reset`,
      targetCalories: targetKcal,
      slots: [
        {
          slotId: `d${dayNum}-s1`,
          slotName: 'Early Morning',
          time: '6:00 AM',
          frequency: 'Daily',
          targetKcal: Math.round(targetKcal * 0.05),
          items: [
            {
              id: `item-${dayNum}-1`,
              dishName: 'Warm water (300ml) + 5 Soaked Almonds + 2 Walnuts',
              portionHousehold: '1 glass + 5 almonds (10g)',
              weightGrams: 310,
              calories: 58,
              protein: 2.1,
              fat: 4.8,
              carbs: 1.5,
              fiber: 1.4,
              glycemicStatus: 'Low GI (<55)',
              therapeuticNote: 'Essential fatty acids activate bile secretion and gut mucosal priming.',
            },
          ],
        },
        {
          slotId: `d${dayNum}-s2`,
          slotName: 'Breakfast',
          time: '8:00 AM',
          frequency: 'Daily',
          targetKcal: Math.round(targetKcal * 0.25),
          items: [
            {
              id: `item-${dayNum}-2`,
              dishName: currentTemplate.breakfast,
              portionHousehold: '2 medium + 2 tbsp',
              weightGrams: 220,
              calories: Math.round(targetKcal * 0.24),
              protein: Math.round(protein * 0.22),
              fat: Math.round(fat * 0.2),
              carbs: Math.round(carbs * 0.25),
              fiber: Math.round(fiber * 0.25),
              glycemicStatus: 'Low GI (<55)',
              therapeuticNote: 'High resistant starch and bioactive polyphenols ensure steady postprandial glucose.',
            },
          ],
        },
        {
          slotId: `d${dayNum}-s3`,
          slotName: 'Mid-Morning',
          time: '10:30 AM',
          frequency: 'Daily',
          targetKcal: Math.round(targetKcal * 0.08),
          items: [
            {
              id: `item-${dayNum}-3`,
              dishName: 'Fresh Whole Fruit (Guava / Papaya / Green Apple) + 1 tbsp Chia seeds',
              portionHousehold: '1 cup (150g)',
              weightGrams: 150,
              calories: 120,
              protein: 2.5,
              fat: 2.0,
              carbs: 22,
              fiber: 6.0,
              glycemicStatus: 'Low GI (<55)',
              therapeuticNote: 'Pectin and soluble fiber delay gastric emptying and nourish beneficial colon microflora.',
            },
          ],
        },
        {
          slotId: `d${dayNum}-s4`,
          slotName: 'Lunch',
          time: '1:00 PM',
          frequency: 'Daily',
          targetKcal: Math.round(targetKcal * 0.35),
          items: [
            {
              id: `item-${dayNum}-4`,
              dishName: currentTemplate.lunch,
              portionHousehold: '1 cup grains + 1 cup dal + 1 cup veg + 1/2 cup curd',
              weightGrams: 380,
              calories: Math.round(targetKcal * 0.35),
              protein: Math.round(protein * 0.35),
              fat: Math.round(fat * 0.3),
              carbs: Math.round(carbs * 0.35),
              fiber: Math.round(fiber * 0.35),
              glycemicStatus: 'Low GI (<55)',
              therapeuticNote: 'Complete amino acid profile paired with fermentable fibers prevents glucose spikes.',
            },
          ],
        },
        {
          slotId: `d${dayNum}-s5`,
          slotName: 'Evening',
          time: '5:00 PM',
          frequency: 'Daily',
          targetKcal: Math.round(targetKcal * 0.1),
          items: [
            {
              id: `item-${dayNum}-5`,
              dishName: currentTemplate.evening,
              portionHousehold: '1 bowl (100g)',
              weightGrams: 100,
              calories: 150,
              protein: Math.round(protein * 0.15),
              fat: 3.0,
              carbs: 20,
              fiber: 5.5,
              glycemicStatus: 'Low GI (<55)',
              therapeuticNote: 'Protein-fiber combination prevents late-afternoon cortisol dip and sugar cravings.',
            },
          ],
        },
        {
          slotId: `d${dayNum}-s6`,
          slotName: 'Dinner',
          time: '8:00 PM',
          frequency: 'Daily',
          targetKcal: Math.round(targetKcal * 0.28),
          items: [
            {
              id: `item-${dayNum}-6`,
              dishName: currentTemplate.dinner,
              portionHousehold: '1 bowl + 1 cup soup',
              weightGrams: 280,
              calories: Math.round(targetKcal * 0.26),
              protein: Math.round(protein * 0.25),
              fat: Math.round(fat * 0.2),
              carbs: Math.round(carbs * 0.25),
              fiber: Math.round(fiber * 0.25),
              glycemicStatus: 'Low GI (<55)',
              therapeuticNote: 'Light digestible meal eaten >2.5 hours before bedtime promotes overnight autophagy.',
            },
          ],
        },
      ],
    };
  });
}

// Helper to construct domain-specific 7 days of Exercise Guidelines
function build7DayExercisePlanForDomain(
  domainId: string,
  generalInfo: GeneralInfo
): ExerciseDayItem[] {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (domainId === 'hypertrophy') {
    return [
      {
        dayNumber: 1,
        dayName: 'Monday',
        protocolTitle: 'Push Power & Chest/Shoulder Hypertrophy',
        focusArea: 'Pectorals, Anterior Deltoids, Triceps',
        durationMins: 55,
        intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
        targetHeartRate: '125 - 145 bpm',
        movements: [
          { name: 'Barbell / DB Flat Bench Press', setsAndReps: '4 sets x 8-10 reps (RPE 8)', clinicalRationale: 'Compound horizontal pressing builds clavicular and sternal pectoral density.' },
          { name: 'Incline Dumbbell Press', setsAndReps: '3 sets x 10-12 reps', clinicalRationale: 'Upper chest recruitment with deep stretch at bottom of movement.' },
          { name: 'Dumbbell Lateral Raises', setsAndReps: '4 sets x 12-15 reps', clinicalRationale: 'Isolates medial deltoid for shoulder width and stabilization.' },
          { name: 'Cable Triceps Pushdowns', setsAndReps: '3 sets x 12-15 reps', clinicalRationale: 'Direct triceps lateral and medial head isolation.' },
        ],
        postWorkoutRecovery: 'Consume 25g whey protein + 40g carbohydrates within 45 minutes; perform light pec and lat stretches.',
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        protocolTitle: 'Pull Hypertrophy & Posterior Kinetic Chain',
        focusArea: 'Latissimus Dorsi, Rhomboids, Biceps',
        durationMins: 55,
        intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
        targetHeartRate: '125 - 145 bpm',
        movements: [
          { name: 'Wide-Grip Lat Pulldowns / Pull-Ups', setsAndReps: '4 sets x 8-10 reps', clinicalRationale: 'Vertical pulling activates lat fibers and improves scapular retraction.' },
          { name: 'Chest-Supported Dumbbell Rows', setsAndReps: '3 sets x 10-12 reps', clinicalRationale: 'Rhomboid and mid-trap thickness without lumbar axial fatigue.' },
          { name: 'Face Pulls with Resistance Band', setsAndReps: '3 sets x 15-20 reps', clinicalRationale: 'Strengthens infraspinatus and protects rotator cuff integrity.' },
          { name: 'Incline Dumbbell Bicep Curls', setsAndReps: '3 sets x 12 reps', clinicalRationale: 'Places biceps long head in passive stretch for maximum motor unit recruitment.' },
        ],
        postWorkoutRecovery: 'Hydrate with 1L water with sodium and potassium; foam roll upper thoracic spine.',
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        protocolTitle: 'Active Recovery & Kinetic Mobility',
        focusArea: 'Thoracic Mobility, Hip Openers, Core',
        durationMins: 40,
        intensityLevel: 'Zone 1-2 (Light-Moderate)',
        targetHeartRate: '100 - 115 bpm',
        movements: [
          { name: 'Low-Pace Incline Treadmill Walk', setsAndReps: '25 mins steady pace', clinicalRationale: 'Flushes metabolic lactic waste without inducing muscle breakdown.' },
          { name: '90/90 Hip Flow & Pigeon Pose', setsAndReps: '3 sets x 60s per side', clinicalRationale: 'Decompresses femoral acetabular joint and gluteal piriformis.' },
          { name: 'Cat-Cow & Thoracic Thread-the-Needle', setsAndReps: '10 slow cycles', clinicalRationale: 'Restores intervertebral disc hydration and vagal calm.' },
        ],
        postWorkoutRecovery: '20-minute Epsom salt bath to replenish transdermal magnesium; prioritize 8.5h sleep.',
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        protocolTitle: 'Legs & Lower Body Hypertrophy',
        focusArea: 'Quadriceps, Hamstrings, Glutes, Calves',
        durationMins: 60,
        intensityLevel: 'Zone 4-5 (Peak Performance)',
        targetHeartRate: '135 - 155 bpm',
        movements: [
          { name: 'Barbell Back Squat / Goblet Squat', setsAndReps: '4 sets x 8-10 reps', clinicalRationale: 'Foundational multi-joint lower extremity mass builder.' },
          { name: 'Romanian Deadlifts (RDL)', setsAndReps: '3 sets x 10-12 reps', clinicalRationale: 'Eccentric hamstring loading and gluteal activation.' },
          { name: 'Walking Dumbbell Lunges', setsAndReps: '3 sets x 12 steps per leg', clinicalRationale: 'Unilateral leg strength and pelvic stabilizer engagement.' },
          { name: 'Standing Calf Raises with 2s Pause', setsAndReps: '4 sets x 15 reps', clinicalRationale: 'Gastrocnemius and soleus hypertrophy for ankle stability.' },
        ],
        postWorkoutRecovery: 'Elevate legs against wall for 10 minutes to assist venous return; high protein meal.',
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        protocolTitle: 'Upper Body Volume & Weak-Point Polish',
        focusArea: 'Delts, Arms, Upper Back, Core',
        durationMins: 50,
        intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
        targetHeartRate: '120 - 140 bpm',
        movements: [
          { name: 'Overhead Standing Dumbbell Press', setsAndReps: '4 sets x 8-10 reps', clinicalRationale: 'Vertical pushing with serratus anterior and core activation.' },
          { name: 'Seated Cable Cable Rows', setsAndReps: '3 sets x 12 reps', clinicalRationale: 'Lats and middle back thickness with controlled squeeze.' },
          { name: 'Dips / Assisted Dips', setsAndReps: '3 sets x 10-12 reps', clinicalRationale: 'Triceps and lower chest compound loading.' },
          { name: 'Hanging Knee Raises', setsAndReps: '3 sets x 15 reps', clinicalRationale: 'Rectus abdominis and hip flexor core endurance.' },
        ],
        postWorkoutRecovery: 'Cool down with 5-minute easy cycling; stretch anterior chest and triceps.',
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        protocolTitle: 'Posterior Chain & Core Conditioning',
        focusArea: 'Glutes, Lower Back, Abdominal Wall',
        durationMins: 45,
        intensityLevel: 'Zone 2-3 (Aerobic Base)',
        targetHeartRate: '115 - 130 bpm',
        movements: [
          { name: 'Kettlebell Swings (Hip Hinge)', setsAndReps: '4 sets x 15 reps', clinicalRationale: 'Explosive hip extension and glute endurance.' },
          { name: 'Pallof Press with Cable / Band', setsAndReps: '3 sets x 12s holds per side', clinicalRationale: 'Anti-rotational core stabilization preventing lumbar shear.' },
          { name: 'Plank Variations (Forearm Plank)', setsAndReps: '3 sets x 45-60s', clinicalRationale: 'Transverse abdominis isometric strength.' },
        ],
        postWorkoutRecovery: 'Replenish electrolytes; 10-minute diaphragmatic breathing.',
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        protocolTitle: 'Complete Rest & Parasympathetic Restoration',
        focusArea: 'Nervous System, Myofascial Recovery',
        durationMins: 30,
        intensityLevel: 'Restorative',
        targetHeartRate: '85 - 100 bpm',
        movements: [
          { name: 'Mindful Leisure Nature Walk', setsAndReps: '30 mins continuous', clinicalRationale: 'Gentle aerobic stimulus with zero mechanical wear; reduces cortisol.' },
          { name: 'Gentle Diaphragmatic Pranayama (Box Breathing)', setsAndReps: '10 mins seated', clinicalRationale: 'Shifts autonomic nervous system to parasympathetic tone for deep tissue repair.' },
        ],
        postWorkoutRecovery: 'Restorative sleep of 8.5 to 9 hours; hydration with tender coconut water.',
      },
    ];
  }

  // Standard Metabolic / Disease & Disorder Prescriptions (Type 2 Diabetes, Hypertension, PCOS, Weight Management)
  return [
    {
      dayNumber: 1,
      dayName: 'Monday',
      protocolTitle: 'Aerobic Base & Zone 2 Insulin Sensitization',
      focusArea: 'Mitochondrial Density & GLUT4 Translocation',
      durationMins: 45,
      intensityLevel: 'Zone 2-3 (Aerobic Base)',
      targetHeartRate: '110 - 128 bpm',
      movements: [
        { name: 'Incline Treadmill Brisk Walk / Outdoor Walk', setsAndReps: '35 mins continuous (3.5 km/h, 3% incline)', clinicalRationale: 'Sustained Zone 2 muscle contraction burns circulating blood glucose without taxing joints.' },
        { name: 'Ankle & Calf Pumps', setsAndReps: '3 sets x 20 reps', clinicalRationale: 'Activates soleus muscle metabolism (primary glucose sink in seated posture).' },
        { name: 'Quad Foam Rolling', setsAndReps: '2 mins per leg', clinicalRationale: 'Relieves myofascial tension and boosts lower extremity circulation.' },
      ],
      postWorkoutRecovery: 'Drink 400ml water with a pinch of Himalayan pink salt; 5-min slow nasal breathing.',
    },
    {
      dayNumber: 2,
      dayName: 'Tuesday',
      protocolTitle: 'Musculoskeletal Resistance & Metabolic Strength',
      focusArea: 'Full-Body Compound Movement & Postural Core',
      durationMins: 40,
      intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
      targetHeartRate: '120 - 138 bpm',
      movements: [
        { name: 'Bodyweight Box Squats / Goblet Squats', setsAndReps: '3 sets x 12 reps', clinicalRationale: 'Recruits large quadriceps and gluteal motor units to store glycogen.' },
        { name: 'Wall Push-Ups / Incline Push-Ups', setsAndReps: '3 sets x 10 reps', clinicalRationale: 'Horizontal pushing activates chest, anterior delts and triceps.' },
        { name: 'Resistance Band Seated Rows', setsAndReps: '3 sets x 15 reps', clinicalRationale: 'Strengthens rhomboids, counters desk slouch and improves lung capacity.' },
        { name: 'Glute Bridges with 2s Peak Squeeze', setsAndReps: '3 sets x 15 reps', clinicalRationale: 'Engages gluteus maximus and stabilizes pelvic girdle.' },
      ],
      postWorkoutRecovery: 'Consume 20g protein snack within 45 mins; stretch hamstrings and chest.',
    },
    {
      dayNumber: 3,
      dayName: 'Wednesday',
      protocolTitle: 'Active Kinetic Recovery & Joint Mobility',
      focusArea: 'Synovial Fluid Circulation & Vagal Calm',
      durationMins: 35,
      intensityLevel: 'Zone 1-2 (Light-Moderate)',
      targetHeartRate: '95 - 110 bpm',
      movements: [
        { name: 'Surya Namaskar (Gentle Sun Salutations)', setsAndReps: '6 slow cycles with breath coordination', clinicalRationale: 'Synchronizes spine extension and flexion with diaphragmatic expansion.' },
        { name: 'Hamstring & Hip Flexor Stretches', setsAndReps: '3 sets x 30s per leg', clinicalRationale: 'Decompresses lower back tension caused by prolonged sitting.' },
        { name: 'Sukshma Vyayama (Gentle Joint Rotations)', setsAndReps: '5 mins for neck, shoulders, wrists, ankles', clinicalRationale: 'Stimulates synovial fluid secretion without micro-trauma.' },
      ],
      postWorkoutRecovery: 'Sip warm chamomile or green tea; perform 10 minutes of guided mindfulness.',
    },
    {
      dayNumber: 4,
      dayName: 'Thursday',
      protocolTitle: 'Zone 2 Steady-State Cardio & Fat Oxidation',
      focusArea: 'Lipid Depletion & Cardiovascular Endurance',
      durationMins: 45,
      intensityLevel: 'Zone 2-3 (Aerobic Base)',
      targetHeartRate: '115 - 130 bpm',
      movements: [
        { name: 'Stationary Recumbent Bike / Elliptical Cross-Trainer', setsAndReps: '40 mins steady moderate resistance', clinicalRationale: 'Low-impact cardiovascular stimulus maximizes fatty acid beta-oxidation.' },
        { name: 'Standing Side Bends with Breath', setsAndReps: '2 sets x 12 per side', clinicalRationale: 'Lengthens quadratus lumborum and improves ribcage mobility.' },
      ],
      postWorkoutRecovery: 'Hydrate with fresh tender coconut water; rehydrate intracellular potassium.',
    },
    {
      dayNumber: 5,
      dayName: 'Friday',
      protocolTitle: 'Posterior Chain & Core Stabilization',
      focusArea: 'Anti-Slouch Alignment & Lower Back Health',
      durationMins: 40,
      intensityLevel: 'Zone 3-4 (Metabolic Threshold)',
      targetHeartRate: '118 - 135 bpm',
      movements: [
        { name: 'Resistance Band Deadlifts / Hip Hinges', setsAndReps: '3 sets x 12 reps', clinicalRationale: 'Trains posterior kinetic chain (hamstrings, glutes, erector spinae).' },
        { name: 'Bird-Dog Contralateral Holds', setsAndReps: '3 sets x 8 per side (5s hold)', clinicalRationale: 'Activates multifidus and deep abdominal stabilizers.' },
        { name: 'Modified Knee Plank on Mat', setsAndReps: '3 sets x 30s', clinicalRationale: 'Strengthens transverse abdominis without straining lumbar spine.' },
        { name: 'Standing Calf Raises', setsAndReps: '3 sets x 20 reps', clinicalRationale: 'Enhances venous blood return from lower extremities back to heart.' },
      ],
      postWorkoutRecovery: 'Perform child\'s pose for 3 minutes; drink 500ml water.',
    },
    {
      dayNumber: 6,
      dayName: 'Saturday',
      protocolTitle: 'Functional Agility & Dynamic Mobility',
      focusArea: 'Coordination, Balance & Proprioception',
      durationMins: 40,
      intensityLevel: 'Zone 2-3 (Aerobic Base)',
      targetHeartRate: '110 - 128 bpm',
      movements: [
        { name: 'Agility Step-Ups on Low Platform (15cm)', setsAndReps: '3 sets x 15 per leg', clinicalRationale: 'Improves knee extensor strength and balance reflexes.' },
        { name: 'Resistance Band Chest Expansions', setsAndReps: '3 sets x 15 reps', clinicalRationale: 'Opens pectoral fascia and strengthens middle trapezius.' },
        { name: 'Single-Leg Balance Stork Stance', setsAndReps: '3 sets x 30s per leg', clinicalRationale: 'Trains ankle proprioceptors and neuromuscular vestibular pathways.' },
      ],
      postWorkoutRecovery: '10-minute cool-down stroll; consume high-fiber light dinner.',
    },
    {
      dayNumber: 7,
      dayName: 'Sunday',
      protocolTitle: 'Restorative Walk & Parasympathetic Nervous Recovery',
      focusArea: 'Cortisol Reduction & Circadian Rhythm Alignment',
      durationMins: 35,
      intensityLevel: 'Restorative',
      targetHeartRate: '90 - 105 bpm',
      movements: [
        { name: 'Gentle Park / Nature Walk', setsAndReps: '30 mins relaxed pace', clinicalRationale: 'Natural sunlight exposure sets master circadian clock (suprachiasmatic nucleus).' },
        { name: 'Anulom Vilom (Alternate Nostril Breathing)', setsAndReps: '10 mins seated comfortably', clinicalRationale: 'Lowers sympathetic tone, reduces resting heart rate and aids cellular repair.' },
      ],
      postWorkoutRecovery: 'Ensure 8 hours of uninterrupted nocturnal sleep in a cool, dark room.',
    },
  ];
}
