import { SymptomAssessmentItem } from '../types';

export const PERFORMANCE_PRIMARY_CATEGORIES = [
  'Athlets',
  'GYM',
  'Football',
  'Cricket',
  'Sport Endurance',
  'OTHERS',
] as const;

export const PERFORMANCE_OTHER_SUBCATEGORIES = [
  'Volley Ball',
  'Basket Ball',
  'Kabaddi',
  'Badminton',
  'Kho Kho',
  'Throwball',
] as const;

export const domainCategoriesMapping: Record<'DISEASES' | 'DISORDERS' | 'PERFORMANCE' | 'FITNESS', string[]> = {
  DISEASES: [
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
  DISORDERS: [
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
  PERFORMANCE: [
    'Athlets',
    'GYM',
    'Football',
    'Cricket',
    'Sport Endurance',
    'OTHERS',
    'Volley Ball',
    'Basket Ball',
    'Kabaddi',
    'Badminton',
    'Kho Kho',
    'Throwball',
  ],
  FITNESS: [
    'Weight Loss',
    'Weight Gain',
    'Muscle Gain',
    'Fat Loss',
    'Body Recomposition',
  ],
};

export function normalizeConditionName(name: string): string {
  if (!name) return 'Diabetes Mellitus';
  const clean = name.trim().toLowerCase();
  if (clean === 'athlets' || clean === 'athletes') return 'Athlets';
  if (clean === 'gym') return 'GYM';
  if (clean === 'football') return 'Football';
  if (clean === 'cricket') return 'Cricket';
  if (clean === 'sport endurance' || clean === 'sports endurance') return 'Sport Endurance';
  if (clean === 'others' || clean === 'other') return 'OTHERS';
  if (clean === 'volley ball' || clean === 'volleyball' || clean === 'volley_ball') return 'Volley Ball';
  if (clean === 'basket ball' || clean === 'basketball' || clean === 'basket_ball') return 'Basket Ball';
  if (clean === 'kabadi' || clean === 'kabaddi') return 'Kabaddi';
  if (clean === 'badmitten' || clean === 'badminton') return 'Badminton';
  if (clean === 'kho _kho' || clean === 'kho_kho' || clean === 'kho kho' || clean === 'kho-kho') return 'Kho Kho';
  if (clean === 'throwball' || clean === 'throw ball') return 'Throwball';
  if (clean === 'weight loss') return 'Weight Loss';
  if (clean === 'weight gain') return 'Weight Gain';
  if (clean === 'muscle gain') return 'Muscle Gain';
  if (clean === 'fat loss') return 'Fat Loss';
  if (clean === 'body recombosition' || clean === 'body recomposition') return 'Body Recomposition';

  // Check matching in domainCategoriesMapping
  for (const catList of Object.values(domainCategoriesMapping)) {
    const direct = catList.find((c) => c.toLowerCase() === clean);
    if (direct) return direct;
  }
  return name.trim();
}

export const domainSpecificSymptoms: Record<string, SymptomAssessmentItem[]> = {
  // ==========================================
  // DISEASES
  // ==========================================
  'Diabetes Mellitus': [
    { id: 'dm1', symptom: 'Frequent Urination (Polyuria)', duration: '3 weeks', severity: 'Moderate' },
    { id: 'dm2', symptom: 'Excessive Thirst (Polydipsia)', duration: '1 month', severity: 'Severe' },
    { id: 'dm3', symptom: 'Excessive Hunger (Polyphagia)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'dm4', symptom: 'Unexplained Weight Fluctuations', duration: '2 months', severity: 'Mild' },
    { id: 'dm5', symptom: 'Post-prandial Fatigue & Lethargy', duration: '6 weeks', severity: 'Moderate' },
    { id: 'dm6', symptom: 'Blurred or Fluctuating Vision', duration: 'Intermittent', severity: 'Mild' },
    { id: 'dm7', symptom: 'Slow-Healing Skin Wounds / Cuts', duration: '1 month', severity: 'Mild' },
    { id: 'dm8', symptom: 'Peripheral Neuropathy (Foot Tingling)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'dm9', symptom: 'Acanthosis Nigricans (Darkened neck folds)', duration: '1 year', severity: 'Moderate' },
    { id: 'dm10', symptom: 'Intense Sugar / Carb Cravings Post-meal', duration: 'Daily', severity: 'Often' },
  ],

  'Hypertension': [
    { id: 'ht1', symptom: 'Occipital Morning Headaches', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ht2', symptom: 'Dizziness or Vertigo Episodes', duration: '1 month', severity: 'Mild' },
    { id: 'ht3', symptom: 'Heart Palpitations during Stress', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ht4', symptom: 'Shortness of Breath on Exertion', duration: '2 months', severity: 'Mild' },
    { id: 'ht5', symptom: 'Epistaxis (Spontaneous Nosebleeds)', duration: 'Rare', severity: 'Mild' },
    { id: 'ht6', symptom: 'Visual Floaters or Mild Blurring', duration: 'Intermittent', severity: 'Mild' },
    { id: 'ht7', symptom: 'Bilateral Ankle Edema (Fluid Retention)', duration: 'Evening', severity: 'Moderate' },
    { id: 'ht8', symptom: 'Sleep Apnea / Heavy Night Snoring', duration: '6 months', severity: 'Moderate' },
    { id: 'ht9', symptom: 'High Sodium / Salt Cravings', duration: 'Chronic', severity: 'Often' },
    { id: 'ht10', symptom: 'Tinnitus (Pulsatile Ear Ringing)', duration: '3 weeks', severity: 'Mild' },
  ],

  'Cardiovascular Diseases': [
    { id: 'cv1', symptom: 'Exertional Chest Tightness (Angina)', duration: 'Intermittent', severity: 'Moderate' },
    { id: 'cv2', symptom: 'Shortness of Breath Climbing Stairs', duration: '2 months', severity: 'Moderate' },
    { id: 'cv3', symptom: 'Orthopnea (Difficulty lying flat in bed)', duration: '1 month', severity: 'Mild' },
    { id: 'cv4', symptom: 'Irregular Heartbeats / Palpitations', duration: '2 weeks', severity: 'Moderate' },
    { id: 'cv5', symptom: 'Bilateral Leg Swelling / Pitting Edema', duration: '3 weeks', severity: 'Moderate' },
    { id: 'cv6', symptom: 'Cold, Clammy Extremities / Pale Nails', duration: '1 month', severity: 'Mild' },
    { id: 'cv7', symptom: 'Excessive General Exhaustion on Low Activity', duration: '2 months', severity: 'Moderate' },
    { id: 'cv8', symptom: 'Dizziness or Near-Syncope on Standing', duration: 'Intermittent', severity: 'Mild' },
    { id: 'cv9', symptom: 'Claudication (Calf cramping during walking)', duration: '2 months', severity: 'Mild' },
    { id: 'cv10', symptom: 'Paroxysmal Nocturnal Breathlessness', duration: '2 weeks', severity: 'Moderate' },
  ],

  'PCOS': [
    { id: 'pc1', symptom: 'Oligomenorrhea (Irregular cycles >35 days)', duration: '8 months', severity: 'Severe' },
    { id: 'pc2', symptom: 'Hirsutism (Excess facial / chin hair)', duration: '1 year', severity: 'Moderate' },
    { id: 'pc3', symptom: 'Cystic Acne along Jawline & Cheeks', duration: '4 months', severity: 'Moderate' },
    { id: 'pc4', symptom: 'Androgenic Alopecia (Crown hair thinning)', duration: '6 months', severity: 'Mild' },
    { id: 'pc5', symptom: 'Central / Visceral Abdominal Adiposity', duration: '1 year', severity: 'Moderate' },
    { id: 'pc6', symptom: 'Intense 4 PM Sugar / Sweet Cravings', duration: 'Daily', severity: 'Often' },
    { id: 'pc7', symptom: 'Premenstrual Dysphoria & Mood Fluctuations', duration: 'Monthly', severity: 'Severe' },
    { id: 'pc8', symptom: 'Post-Meal Carb Somnolence / Slump', duration: '3 months', severity: 'Moderate' },
    { id: 'pc9', symptom: 'Pelvic Aching / Chronic Ovulatory Pain', duration: 'Cyclic', severity: 'Moderate' },
    { id: 'pc10', symptom: 'Stagnant Weight despite Caloric Deficit', duration: '1 year', severity: 'Severe' },
  ],

  'Thyroid Conditions': [
    { id: 'th1', symptom: 'Persistent Chronic Lethargy & Brain Fog', duration: '6 months', severity: 'Severe' },
    { id: 'th2', symptom: 'Cold Intolerance (Chilly hands and feet)', duration: '4 months', severity: 'Moderate' },
    { id: 'th3', symptom: 'Unexplained Weight Gain with Low Appetite', duration: '5 months', severity: 'Severe' },
    { id: 'th4', symptom: 'Dry, Scaly Skin & Brittle Peeling Nails', duration: '3 months', severity: 'Moderate' },
    { id: 'th5', symptom: 'Chronic Obstinate Constipation (<3x/wk)', duration: '6 months', severity: 'Moderate' },
    { id: 'th6', symptom: 'Diffuse Hair Shedding / Outer Eyebrow Loss', duration: '4 months', severity: 'Moderate' },
    { id: 'th7', symptom: 'Morning Facial Puffiness & Periorbital Swelling', duration: 'Morning', severity: 'Moderate' },
    { id: 'th8', symptom: 'Myalgia & Muscle Weakness', duration: '2 months', severity: 'Mild' },
    { id: 'th9', symptom: 'Depressed Mood, Lack of Motivation', duration: '3 months', severity: 'Moderate' },
    { id: 'th10', symptom: 'Menorrhagia (Heavy prolonged menstrual flow)', duration: '4 cycles', severity: 'Moderate' },
  ],

  'Kidney Diseases': [
    { id: 'kd1', symptom: 'Periorbital Morning Swelling / Puffiness', duration: '1 month', severity: 'Moderate' },
    { id: 'kd2', symptom: 'Frothy / Foamy Urine (Microalbuminuria)', duration: '2 months', severity: 'Severe' },
    { id: 'kd3', symptom: 'Nocturia (Waking >2x nightly to urinate)', duration: '3 months', severity: 'Moderate' },
    { id: 'kd4', symptom: 'Metallic Dysgeusia (Metallic taste in mouth)', duration: '3 weeks', severity: 'Mild' },
    { id: 'kd5', symptom: 'Uremic Pruritus (Intractable skin itching)', duration: '1 month', severity: 'Moderate' },
    { id: 'kd6', symptom: 'Decreased Urine Output (Oliguria)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'kd7', symptom: 'Anorexia & Early Morning Nausea', duration: '1 month', severity: 'Moderate' },
    { id: 'kd8', symptom: 'Nocturnal Muscle Cramps & Spasms', duration: 'Nightly', severity: 'Moderate' },
    { id: 'kd9', symptom: 'Severe Anemic Pallor & Debilitating Fatigue', duration: '3 months', severity: 'Severe' },
    { id: 'kd10', symptom: 'Flank / Costovertebral Angle Dull Ache', duration: '1 month', severity: 'Mild' },
  ],

  'Liver Diseases': [
    { id: 'ld1', symptom: 'Right Upper Quadrant Heaviness / Fullness', duration: '2 months', severity: 'Moderate' },
    { id: 'ld2', symptom: 'Chronic Daytime Somnolence & Deep Fatigue', duration: '4 months', severity: 'Severe' },
    { id: 'ld3', symptom: 'Subtle Scleral Icterus (Yellow eyes)', duration: '1 week', severity: 'Mild' },
    { id: 'ld4', symptom: 'Dark Amber / Tea-Colored Urine', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ld5', symptom: 'Pale, Clay-Colored or Greasy Stools', duration: 'Intermittent', severity: 'Mild' },
    { id: 'ld6', symptom: 'Easy Ecchymosis (Bruising) & Bleeding Gums', duration: '1 month', severity: 'Mild' },
    { id: 'ld7', symptom: 'Severe Intolerance to Oily or Fatty Meals', duration: '3 months', severity: 'Severe' },
    { id: 'ld8', symptom: 'Pruritus / Generalized Itching worse at Night', duration: '1 month', severity: 'Moderate' },
    { id: 'ld9', symptom: 'Abdominal Distension / Early Fluid Retention', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ld10', symptom: 'Palmar Erythema / Spider Angiomas', duration: '2 months', severity: 'Mild' },
  ],

  'Gastrointestinal Diseases': [
    { id: 'gi1', symptom: 'Post-prandial Abdominal Distension & Bloating', duration: 'Daily', severity: 'Severe' },
    { id: 'gi2', symptom: 'Acid Reflux / Retrosternal Heartburn', duration: '4 nights/wk', severity: 'Moderate' },
    { id: 'gi3', symptom: 'Alternating Bowel Habits (Diarrhea & Constipation)', duration: '3 months', severity: 'Moderate' },
    { id: 'gi4', symptom: 'Early Satiety & Epigastric Discomfort', duration: '1 month', severity: 'Moderate' },
    { id: 'gi5', symptom: 'Foul-Smelling Flatulence & Frequent Belching', duration: 'Daily', severity: 'Often' },
    { id: 'gi6', symptom: 'Colicky Lower Abdominal Pain relieved by stool', duration: '2 months', severity: 'Moderate' },
    { id: 'gi7', symptom: 'Mucus in Stool / Tenesmus (Incomplete evacuation)', duration: '3 weeks', severity: 'Mild' },
    { id: 'gi8', symptom: 'Severe Sensitivity to FODMAPs & Dairy', duration: '6 months', severity: 'Severe' },
    { id: 'gi9', symptom: 'Nausea & Gastric Sluggishness after meals', duration: 'Weekly', severity: 'Moderate' },
    { id: 'gi10', symptom: 'Loud Hyperactive Gut Gurgling (Borborygmi)', duration: 'Post-meal', severity: 'Often' },
  ],

  'Endocrine Diseases': [
    { id: 'en1', symptom: 'Chronic Adrenal Exhaustion & Burnout', duration: '6 months', severity: 'Severe' },
    { id: 'en2', symptom: 'Temperature Dysregulation (Heat or Cold flashes)', duration: '2 months', severity: 'Moderate' },
    { id: 'en3', symptom: 'Orthostatic Dizziness upon standing quickly', duration: '3 weeks', severity: 'Moderate' },
    { id: 'en4', symptom: 'Cushingoid Facial Fullness (Moon Face)', duration: '4 months', severity: 'Mild' },
    { id: 'en5', symptom: 'Rapid Unexplained Weight Fluctuations', duration: '2 months', severity: 'Moderate' },
    { id: 'en6', symptom: 'Hyperpigmentation of Knuckles & Palmar Creases', duration: '5 months', severity: 'Mild' },
    { id: 'en7', symptom: 'Severe Electrolyte Wasting & Salt Craving', duration: '1 month', severity: 'Severe' },
    { id: 'en8', symptom: 'Heightened Anxiety & Mood Labile Responses', duration: '3 months', severity: 'Moderate' },
    { id: 'en9', symptom: 'Loss of Libido & Hormonal Fatigue', duration: '6 months', severity: 'Moderate' },
    { id: 'en10', symptom: 'Fine Tremors & Internal Jitteriness', duration: 'Intermittent', severity: 'Mild' },
  ],

  'Neurological Diseases': [
    { id: 'ne1', symptom: 'Throbbing Hemicranial Migraine Headaches', duration: 'Weekly', severity: 'Severe' },
    { id: 'ne2', symptom: 'Peripheral Paresthesia (Numbness & Tingling)', duration: '2 months', severity: 'Moderate' },
    { id: 'ne3', symptom: 'Cognitive Brain Fog & Short-Term Memory Lapses', duration: '3 months', severity: 'Moderate' },
    { id: 'ne4', symptom: 'Involuntary Muscle Fasciculations / Twitching', duration: '1 month', severity: 'Mild' },
    { id: 'ne5', symptom: 'Postural Instability / Balance Impairment', duration: '2 months', severity: 'Moderate' },
    { id: 'ne6', symptom: 'Subjective Vertigo / Vestibular Spinning', duration: 'Intermittent', severity: 'Moderate' },
    { id: 'ne7', symptom: 'Fragmented Sleep Architecture & Night Waking', duration: '4 months', severity: 'Often' },
    { id: 'ne8', symptom: 'Photophobia & Phonophobia (Light & Sound sensitivity)', duration: 'During attacks', severity: 'Severe' },
    { id: 'ne9', symptom: 'Radiculopathy (Shooting nerve pain in limbs)', duration: '6 weeks', severity: 'Moderate' },
    { id: 'ne10', symptom: 'Profound Neurological Exhaustion / Slowed Recall', duration: 'Daily', severity: 'Moderate' },
  ],

  'Respiratory Diseases': [
    { id: 're1', symptom: 'Chronic Productive Cough with Sputum', duration: '2 months', severity: 'Moderate' },
    { id: 're2', symptom: 'Exertional Breathlessness (Dyspnea on stairs)', duration: '3 months', severity: 'Severe' },
    { id: 're3', symptom: 'Audible Wheezing & Chest Tightness', duration: 'Evening/Cold', severity: 'Moderate' },
    { id: 're4', symptom: 'Nocturnal Cough Disrupting Sleep', duration: 'Nightly', severity: 'Often' },
    { id: 're5', symptom: 'Exercise-Induced Bronchoconstriction', duration: 'During workouts', severity: 'Moderate' },
    { id: 're6', symptom: 'Chronic Nasal Congestion & Post-Nasal Drip', duration: '4 months', severity: 'Mild' },
    { id: 're7', symptom: 'Frequent Upper Respiratory Tract Infections', duration: '3x in 6m', severity: 'Moderate' },
    { id: 're8', symptom: 'Shallow Apical Breathing & Intercostal Strain', duration: '1 month', severity: 'Mild' },
    { id: 're9', symptom: 'Morning Dry Throat & Hoarseness', duration: 'Daily', severity: 'Mild' },
    { id: 're10', symptom: 'Daytime Somnolence from Impaired Nocturnal SpO2', duration: '2 months', severity: 'Moderate' },
  ],

  'Cancer': [
    { id: 'ca1', symptom: 'Unintentional Rapid Weight Loss (>5% in 3m)', duration: '3 months', severity: 'Severe' },
    { id: 'ca2', symptom: 'Severe Cancer-Related Fatigue (Unrelieved by rest)', duration: '4 months', severity: 'Severe' },
    { id: 'ca3', symptom: 'Early Satiety & Profound Anorexia', duration: '2 months', severity: 'Moderate' },
    { id: 'ca4', symptom: 'Dysgeusia (Metallic / Aversive taste to protein)', duration: '1 month', severity: 'Moderate' },
    { id: 'ca5', symptom: 'Cachexia & Sarcopenic Muscle Depletion', duration: '3 months', severity: 'Severe' },
    { id: 'ca6', symptom: 'Treatment-Induced Nausea & Vomiting Tendency', duration: 'Post-cycles', severity: 'Moderate' },
    { id: 'ca7', symptom: 'Night Sweats & Intermittent Low-Grade Fevers', duration: '6 weeks', severity: 'Moderate' },
    { id: 'ca8', symptom: 'Deep Skeletal / Visceral Aching', duration: '2 months', severity: 'Moderate' },
    { id: 'ca9', symptom: 'Oral Mucositis & Difficulty Swallowing Solid Food', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ca10', symptom: 'Susceptibility to Neutropenic Infections', duration: '1 month', severity: 'Severe' },
  ],

  // ==========================================
  // DISORDERS
  // ==========================================
  'Metabolic Disorders': [
    { id: 'md1', symptom: 'Elevated Waist-to-Hip Ratio (>0.85 F / >0.90 M)', duration: '1 year', severity: 'Moderate' },
    { id: 'md2', symptom: 'Post-Prandial Reactive Hypoglycemia (Shakiness 2h post-meal)', duration: 'Daily', severity: 'Severe' },
    { id: 'md3', symptom: 'Chronic Low-Grade Systemic Inflammation', duration: '6 months', severity: 'Moderate' },
    { id: 'md4', symptom: 'Dyslipidemic Fatigue after High-Fat Meals', duration: '3 months', severity: 'Moderate' },
    { id: 'md5', symptom: 'Acanthosis Nigricans on Axilla & Neck Creases', duration: '1 year', severity: 'Moderate' },
    { id: 'md6', symptom: 'Intense Post-Lunch Brain Fog & Somnolence', duration: 'Daily', severity: 'Often' },
    { id: 'md7', symptom: 'Stubborn Visceral Adipose Accumulation', duration: '1 year', severity: 'Moderate' },
    { id: 'md8', symptom: 'Excessive Thirst with Normal Fasting Sugar', duration: '2 months', severity: 'Mild' },
    { id: 'md9', symptom: 'Fluid Retention in Ankles after Salty Meals', duration: 'Weekly', severity: 'Mild' },
    { id: 'md10', symptom: 'Hyperuricemic Joint Aches (Early Gout flares)', duration: 'Intermittent', severity: 'Moderate' },
  ],

  'Lipid Disorders': [
    { id: 'lp1', symptom: 'Elevated Serum LDL & Low Protective HDL', duration: 'Lab confirmed', severity: 'Severe' },
    { id: 'lp2', symptom: 'Post-Meal Vascular Sluggishness & Heaviness', duration: 'Daily', severity: 'Moderate' },
    { id: 'lp3', symptom: 'Cold Feet & Peripheral Circulation Delay', duration: '3 months', severity: 'Mild' },
    { id: 'lp4', symptom: 'Tendon Xanthomas or Eyelid Xanthelasma', duration: '6 months', severity: 'Mild' },
    { id: 'lp5', symptom: 'Hepatic Fat Accumulation Tendency (Grade 1 Steatosis)', duration: 'Ultrasound', severity: 'Moderate' },
    { id: 'lp6', symptom: 'Arterial Stiffness & Exertional Breathlessness', duration: '2 months', severity: 'Moderate' },
    { id: 'lp7', symptom: 'Elevated Fasting Triglycerides (>200 mg/dL)', duration: 'Lab confirmed', severity: 'Severe' },
    { id: 'lp8', symptom: 'Chest Heaviness during Vigorous Exertion', duration: 'Rare', severity: 'Moderate' },
    { id: 'lp9', symptom: 'High hs-CRP Inflammatory Biomarker Sign', duration: '3 months', severity: 'Moderate' },
    { id: 'lp10', symptom: 'Fatigue following Deep Fried Food Ingestion', duration: 'Post-meal', severity: 'Often' },
  ],

  'Nutrient Deficiency Disorders': [
    { id: 'nd1', symptom: 'Angular Cheilitis (Painful cracked mouth corners)', duration: '3 weeks', severity: 'Moderate' },
    { id: 'nd2', symptom: 'Koilonychia / Brittle Spoon-Shaped Nails', duration: '2 months', severity: 'Moderate' },
    { id: 'nd3', symptom: 'Pale Conjunctiva & Tongue (Microcytic Anemia sign)', duration: '1 month', severity: 'Severe' },
    { id: 'nd4', symptom: 'Severe Hair Shedding / Telogen Effluvium', duration: '3 months', severity: 'Severe' },
    { id: 'nd5', symptom: 'Peripheral Paresthesia & Pins/Needles (B12 deficit)', duration: '6 weeks', severity: 'Moderate' },
    { id: 'nd6', symptom: 'Deep Bone Aches & Muscle Weakness (Vitamin D deficit)', duration: '4 months', severity: 'Severe' },
    { id: 'nd7', symptom: 'Bleeding / Spongy Gums on Brushing (Vitamin C deficit)', duration: '1 month', severity: 'Mild' },
    { id: 'nd8', symptom: 'Frequent Nocturnal Leg Cramps (Magnesium deficit)', duration: 'Nightly', severity: 'Often' },
    { id: 'nd9', symptom: 'Impaired Night Vision & Xerophthalmia (Vitamin A sign)', duration: '2 months', severity: 'Mild' },
    { id: 'nd10', symptom: 'White Spots on Nails (Zinc / Mineral deficiency)', duration: 'Chronic', severity: 'Mild' },
  ],

  'Digestive Disorders': [
    { id: 'dd1', symptom: 'Obstinate Slow Colonic Transit (>72 hours)', duration: '6 months', severity: 'Severe' },
    { id: 'dd2', symptom: 'Severe Gas Entrapment & Subcostal Pressure', duration: 'Daily', severity: 'Severe' },
    { id: 'dd3', symptom: 'Incomplete Evacuation & Straining at Stool', duration: 'Daily', severity: 'Often' },
    { id: 'dd4', symptom: 'Bristol Stool Hard Pellets (Type 1-2)', duration: '4 months', severity: 'Moderate' },
    { id: 'dd5', symptom: 'Hypochlorhydria (Stomach heaviness after protein)', duration: '2 months', severity: 'Moderate' },
    { id: 'dd6', symptom: 'Undigested Food Particles in Stool', duration: '3 weeks', severity: 'Moderate' },
    { id: 'dd7', symptom: 'Epigastric Sour Regurgitation & Waterbrash', duration: 'Nightly', severity: 'Moderate' },
    { id: 'dd8', symptom: 'Intestinal Hyperpermeability (Systemic flare post-meal)', duration: '3 months', severity: 'Moderate' },
    { id: 'dd9', symptom: 'Abdominal Distension that Worsens through the Day', duration: 'Daily 6 PM', severity: 'Often' },
    { id: 'dd10', symptom: 'Post-Defecation Tenesmus & Rectal Fullness', duration: '1 month', severity: 'Mild' },
  ],

  'Eating Disorders': [
    { id: 'ed1', symptom: 'Intentional Food Restriction & Skipping Meals', duration: '3 months', severity: 'Severe' },
    { id: 'ed2', symptom: 'Recurrent Objective Binge Episodes', duration: '2 months', severity: 'Moderate' },
    { id: 'ed3', symptom: 'Intense Preoccupation with Numbers & Calorie Counting', duration: '6 months', severity: 'Often' },
    { id: 'ed4', symptom: 'Secretive Eating Habits & Hiding Food Wrappers', duration: '2 months', severity: 'Moderate' },
    { id: 'ed5', symptom: 'Acute Overwhelming Guilt & Remorse Post-Meal', duration: '4 months', severity: 'Often' },
    { id: 'ed6', symptom: 'Severe Body Image Dysmorphia & Mirror Checking', duration: '6 months', severity: 'Severe' },
    { id: 'ed7', symptom: 'Compulsive Exercise to Compensate for Caloric Intake', duration: '1 month', severity: 'Mild' },
    { id: 'ed8', symptom: 'Orthostatic Dizziness & Lightheadedness upon Standing', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ed9', symptom: 'Functional Hypothalamic Amenorrhea (Missed menses)', duration: '4 months', severity: 'Severe' },
    { id: 'ed10', symptom: 'Social Avoidance of Mealtimes and Dining Out', duration: '2 months', severity: 'Moderate' },
  ],

  'Food Intolerance': [
    { id: 'fi1', symptom: 'Immediate Bloating within 45m of Ingestion', duration: 'Daily', severity: 'Severe' },
    { id: 'fi2', symptom: 'Lactose Sensitivity (Explosive watery stool & cramps)', duration: 'After dairy', severity: 'Severe' },
    { id: 'fi3', symptom: 'Histamine Flare (Facial flushing, itchy ears, nasal drip)', duration: 'After aged food', severity: 'Moderate' },
    { id: 'fi4', symptom: 'FODMAP Malabsorption (Fermentative cramps & gas)', duration: 'Post-onions/garlic', severity: 'Severe' },
    { id: 'fi5', symptom: 'Gluten Non-Celiac Sensitivity (Brain fog & fatigue)', duration: 'After wheat', severity: 'Moderate' },
    { id: 'fi6', symptom: 'Pungent Acidic Diarrhea with Perianal Burning', duration: 'Intermittent', severity: 'Moderate' },
    { id: 'fi7', symptom: 'Transient Skin Pruritus & Mild Urticaria', duration: 'Post-meal', severity: 'Mild' },
    { id: 'fi8', symptom: 'Post-prandial Migraines triggered by specific foods', duration: 'Weekly', severity: 'Moderate' },
    { id: 'fi9', symptom: 'Gastric Stagnation & Nausea without Vomiting', duration: '1 month', severity: 'Mild' },
    { id: 'fi10', symptom: 'Water Retention & Puffy Eyelids next morning', duration: 'Post-trigger', severity: 'Moderate' },
  ],

  'Food Allergy': [
    { id: 'fa1', symptom: 'Oral Allergy Syndrome (Tingling & itching in throat/lips)', duration: 'Immediate', severity: 'Moderate' },
    { id: 'fa2', symptom: 'Acute Erythematous Urticaria (Hives on torso & neck)', duration: 'Rapid onset', severity: 'Severe' },
    { id: 'fa3', symptom: 'Angioedema (Lip, periorbital or tongue swelling)', duration: 'Immediate', severity: 'Severe' },
    { id: 'fa4', symptom: 'Inspiratory Wheezing & Bronchospasm', duration: 'Post-exposure', severity: 'Severe' },
    { id: 'fa5', symptom: 'Sudden Explosive Vomiting following allergen', duration: 'Acute', severity: 'Severe' },
    { id: 'fa6', symptom: 'Ocular Hyperemia & Conjunctival Lacrimation', duration: 'Immediate', severity: 'Moderate' },
    { id: 'fa7', symptom: 'Hypotension & Lightheadedness (Anaphylaxis risk)', duration: 'Immediate', severity: 'Severe' },
    { id: 'fa8', symptom: 'Acute Colicky Abdominal Spasms', duration: '30m post-meal', severity: 'Severe' },
    { id: 'fa9', symptom: 'Sense of Impending Doom / Rapid Tachycardia', duration: 'Immediate', severity: 'Severe' },
    { id: 'fa10', symptom: 'Requirement of Emergency Antihistamine / Epinephrine', duration: 'Documented history', severity: 'Severe' },
  ],

  'Malnutrition': [
    { id: 'mn1', symptom: 'Bitemporal Muscle Wasting & Hollow Cheeks', duration: '4 months', severity: 'Severe' },
    { id: 'mn2', symptom: 'Significant Sarcopenia & Generalized Muscle Loss', duration: '6 months', severity: 'Severe' },
    { id: 'mn3', symptom: 'Dry, Easily Pluckable Dull Hair (Flag sign)', duration: '3 months', severity: 'Moderate' },
    { id: 'mn4', symptom: 'Marked Handgrip Weakness & Inability to Lift', duration: '2 months', severity: 'Severe' },
    { id: 'mn5', symptom: 'Hypoalbuminemic Bilateral Pedal Edema', duration: '1 month', severity: 'Severe' },
    { id: 'mn6', symptom: 'Delayed Epithelialization & Poor Wound Healing', duration: '6 weeks', severity: 'Moderate' },
    { id: 'mn7', symptom: 'Frequent Low-Grade Opportunistic Infections', duration: '3 months', severity: 'Moderate' },
    { id: 'mn8', symptom: 'Subnormal Basal Body Temperature (Hypothermia tendency)', duration: 'Chronic', severity: 'Mild' },
    { id: 'mn9', symptom: 'Profound Apathy, Social Withdrawal & Depression', duration: '4 months', severity: 'Moderate' },
    { id: 'mn10', symptom: 'Glossitis & Dry Atrophic Buccal Mucosa', duration: '2 months', severity: 'Moderate' },
  ],

  'Obesity': [
    { id: 'ob1', symptom: 'Elevated BMI (>30 kg/m²) & Excess Body Fat Mass', duration: 'Chronic', severity: 'Severe' },
    { id: 'ob2', symptom: 'Exertional Breathlessness on Mild Gradients', duration: '6 months', severity: 'Moderate' },
    { id: 'ob3', symptom: 'Bilateral Knee & Lumbar Mechanical Pain', duration: '1 year', severity: 'Severe' },
    { id: 'ob4', symptom: 'Obstructive Sleep Apnea with Daytime Somnolence', duration: '8 months', severity: 'Severe' },
    { id: 'ob5', symptom: 'Intertrigo (Friction rashes in skin folds)', duration: 'Summer', severity: 'Moderate' },
    { id: 'ob6', symptom: 'Pronounced Heat Intolerance & Profuse Diaphoresis', duration: 'Daily', severity: 'Often' },
    { id: 'ob7', symptom: 'Persistent Chronic Lethargy & Sedentary Habituation', duration: '1 year', severity: 'Moderate' },
    { id: 'ob8', symptom: 'High Visceral Fat Rating (>12 InBody units)', duration: 'Biometric', severity: 'Severe' },
    { id: 'ob9', symptom: 'Metabolic Syndrome Triad (BP, Glucose & Lipids)', duration: 'Lab confirmed', severity: 'Severe' },
    { id: 'ob10', symptom: 'Weight Stigma & Psychological Stress', duration: 'Ongoing', severity: 'Moderate' },
  ],

  // ==========================================
  // PERFORMANCE
  // ==========================================
  'Athlets': [
    { id: 'ath1', symptom: 'Delayed Onset Muscle Soreness (DOMS >48-72h)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ath2', symptom: 'Mid-Session Energy Crash / Glycogen Bonking', duration: 'Past 3 sessions', severity: 'Severe' },
    { id: 'ath3', symptom: 'Involuntary Muscle Cramping & Fasciculations', duration: 'Mid-session', severity: 'Moderate' },
    { id: 'ath4', symptom: 'Elevated Morning Resting Heart Rate (>5 bpm rise)', duration: '1 week', severity: 'Mild' },
    { id: 'ath5', symptom: 'Exercise-Induced Gastrointestinal Distress', duration: 'High intensity', severity: 'Moderate' },
    { id: 'ath6', symptom: 'Sleep Disruption despite Physical Exhaustion', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ath7', symptom: 'Tendonitis & Joint Stiffness (Achilles / Patellar)', duration: '1 month', severity: 'Moderate' },
    { id: 'ath8', symptom: 'Heavy Sweat Rate with Salt Residue on Gear', duration: 'Daily', severity: 'Often' },
    { id: 'ath9', symptom: 'Drop in Peak Power Output & Sprint Speed', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ath10', symptom: 'Post-Competition Acute Dehydration & Fatigue', duration: 'Post-event', severity: 'Severe' },
  ],

  'GYM': [
    { id: 'gym1', symptom: 'Lumbar Spine Tightness & Lower Back Strain', duration: 'Post-deadlifts', severity: 'Moderate' },
    { id: 'gym2', symptom: 'Shoulder Impingement & Rotator Cuff Tenderness', duration: '3 weeks', severity: 'Moderate' },
    { id: 'gym3', symptom: 'Forearm Grip Exhaustion during Pulling Movements', duration: 'Heavy sets', severity: 'Moderate' },
    { id: 'gym4', symptom: 'Delayed Neuromuscular Recovery Between Workouts', duration: 'Leg days', severity: 'Severe' },
    { id: 'gym5', symptom: 'Pre-Workout Stimulant Jitters & Heart Flutters', duration: 'Frequent', severity: 'Severe' },
    { id: 'gym6', symptom: 'Post-Workout Nausea & Transient Lightheadedness', duration: 'Squat sessions', severity: 'Mild' },
    { id: 'gym7', symptom: 'Quadriceps & Hamstring Involuntary Spasms', duration: 'Nightly', severity: 'Moderate' },
    { id: 'gym8', symptom: 'Joint Crepitus & Knee Clicking under Load', duration: '1 month', severity: 'Mild' },
    { id: 'gym9', symptom: 'Plateaued Progressive Overload & Overtraining Fatigue', duration: '6 weeks', severity: 'Severe' },
    { id: 'gym10', symptom: 'High Lactic Acid Burning Limiting Target Rep Ranges', duration: 'Every session', severity: 'Often' },
  ],

  'Football': [
    { id: 'fb1', symptom: 'High-Velocity Sprint Hamstring Strain / Tightness', duration: '2 weeks', severity: 'Severe' },
    { id: 'fb2', symptom: 'Groin & Adductor Tenderness on Side Kicks', duration: 'Past 3 matches', severity: 'Moderate' },
    { id: 'fb3', symptom: 'Calf Muscle Cramps in Final 20 Minutes of Play', duration: 'Match days', severity: 'Severe' },
    { id: 'fb4', symptom: 'Excessive Fluid & Electrolyte Loss under Sun', duration: '90m match', severity: 'Severe' },
    { id: 'fb5', symptom: 'Ankle Joint Inversion Sprain / Lateral Laxity', duration: '1 month', severity: 'Moderate' },
    { id: 'fb6', symptom: 'Post-Match Heavy Legs & Glycogen Depletion', duration: 'Post-game', severity: 'Often' },
    { id: 'fb7', symptom: 'Impact Bruising & Contusions on Shins and Thighs', duration: 'Frequent', severity: 'Mild' },
    { id: 'fb8', symptom: 'Sudden Direction-Change Knee Strain (ACL/MCL stress)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'fb9', symptom: 'Late-Match Cognitive Reaction Lag & Sluggishness', duration: '2nd half', severity: 'Moderate' },
    { id: 'fb10', symptom: 'Post-Game Dehydration Headaches & Chills', duration: 'Evening', severity: 'Moderate' },
  ],

  'Cricket': [
    { id: 'cr1', symptom: 'Fast Bowling Lumbar Stress & Thoracic Tightness', duration: 'Bowling spells', severity: 'Severe' },
    { id: 'cr2', symptom: 'Shoulder Impingement & Rotator Cuff Soreness', duration: '3 weeks', severity: 'Moderate' },
    { id: 'cr3', symptom: 'Wicket-Keeping Meniscus Strain from Deep Squatting', duration: 'Match days', severity: 'Moderate' },
    { id: 'cr4', symptom: 'Fielding Sun Exhaustion & Heat Fatigue in Long Sessions', duration: 'Day matches', severity: 'Severe' },
    { id: 'cr5', symptom: 'Hand & Finger Impact Bruising from Hard Cricket Ball', duration: 'Catching practice', severity: 'Mild' },
    { id: 'cr6', symptom: 'Hamstring Pulls during Sudden Quick Singles', duration: '2 weeks', severity: 'Moderate' },
    { id: 'cr7', symptom: 'Forearm & Wrist Extensor Soreness from Bat Impact', duration: 'Net practice', severity: 'Mild' },
    { id: 'cr8', symptom: 'Dehydration & Low Sodium during Multi-Hour Innings', duration: 'Match days', severity: 'Severe' },
    { id: 'cr9', symptom: 'Cervical Spine / Neck Muscle Spasms from Helmet Weight', duration: 'Post-batting', severity: 'Mild' },
    { id: 'cr10', symptom: 'Delayed Musculoskeletal Recovery between Match Days', duration: 'Tournaments', severity: 'Moderate' },
  ],

  'Sport Endurance': [
    { id: 'se1', symptom: 'Severe Glycogen Depletion ("Hitting the Wall")', duration: 'Long sessions', severity: 'Severe' },
    { id: 'se2', symptom: 'Aerobic Cardiac Drift (Elevated HR at Sustained Pace)', duration: 'Past 3 weeks', severity: 'Moderate' },
    { id: 'se3', symptom: 'Hyponatremia Risk from High Sweat Rate & Plain Water', duration: 'Ultra sessions', severity: 'Severe' },
    { id: 'se4', symptom: 'Persistent Gastrointestinal Cramping & Acid Reflux', duration: 'Running efforts', severity: 'Moderate' },
    { id: 'se5', symptom: 'Runner\'s Knee & Iliotibial (IT) Band Friction Pain', duration: '1 month', severity: 'Moderate' },
    { id: 'se6', symptom: 'Achilles Tendinopathy & Morning Ankle Stiffness', duration: '3 weeks', severity: 'Moderate' },
    { id: 'se7', symptom: 'Post-Endurance Shivering & Systemic Temperature Drop', duration: 'Post-event', severity: 'Mild' },
    { id: 'se8', symptom: 'Loss of Aerobic Threshold & Early Lactate Buildup', duration: '2 weeks', severity: 'Moderate' },
    { id: 'se9', symptom: 'Suppressed Immune Function during High Mileage Blocks', duration: 'Recent training', severity: 'Mild' },
    { id: 'se10', symptom: 'Extended Muscular Recovery Time (>72 Hours)', duration: 'Chronic', severity: 'Severe' },
  ],

  'OTHERS': [
    { id: 'oth1', symptom: 'Multi-Sport Agility Fatigue & Lateral Strain', duration: 'Tournament play', severity: 'Moderate' },
    { id: 'oth2', symptom: 'High-Sweat Rate Electrolyte Depletion & Cramping', duration: 'Match sessions', severity: 'Severe' },
    { id: 'oth3', symptom: 'Overuse Tendinopathy in Knees & Ankles', duration: '1 month', severity: 'Moderate' },
    { id: 'oth4', symptom: 'Rotator Cuff & Overhead Arm Fatigue', duration: 'Weekly', severity: 'Moderate' },
    { id: 'oth5', symptom: 'Post-Practice Joint Inflammation & Tenderness', duration: 'Evening', severity: 'Moderate' },
    { id: 'oth6', symptom: 'Delayed Recovery between Back-to-Back Match Days', duration: 'Tournaments', severity: 'Severe' },
    { id: 'oth7', symptom: 'Calorie Deficit for High Athletic Workload', duration: 'Training log', severity: 'Moderate' },
    { id: 'oth8', symptom: 'Acute Lactic Acid Heaviness in Lower Extremities', duration: '2nd half', severity: 'Often' },
    { id: 'oth9', symptom: 'Plantar Fascia & Foot Arch Soreness', duration: 'Hard court', severity: 'Mild' },
    { id: 'oth10', symptom: 'Nocturnal Muscle Fasciculations & Sleep Disruption', duration: 'Nightly', severity: 'Mild' },
  ],

  'Volley Ball': [
    { id: 'vb1', symptom: 'Jumper\'s Knee (Patellar Tendinopathy from Spike Landings)', duration: '1 month', severity: 'Severe' },
    { id: 'vb2', symptom: 'Rotator Cuff Impingement from Overhead Spiking & Serving', duration: '3 weeks', severity: 'Moderate' },
    { id: 'vb3', symptom: 'Finger Sprains & Joint Jamming from Net Blocking', duration: 'Recent match', severity: 'Moderate' },
    { id: 'vb4', symptom: 'Ankle Inversion Sprain from Landing on Opponent\'s Foot', duration: '2 weeks', severity: 'Severe' },
    { id: 'vb5', symptom: 'Explosive Vertical Jump Power Drop in 4th/5th Sets', duration: 'Late sets', severity: 'Severe' },
    { id: 'vb6', symptom: 'Lumbar Hyperextension Strain during Backcourt Spiking', duration: 'Match days', severity: 'Moderate' },
    { id: 'vb7', symptom: 'Forearm Skin Bruising from Repetitive Underhand Digs', duration: 'Weekly', severity: 'Mild' },
    { id: 'vb8', symptom: 'Scapular Dynamic Fatigue & Shoulder Drop', duration: 'Tournament', severity: 'Moderate' },
    { id: 'vb9', symptom: 'Hard Court Foot Impact Shock & Heel Pain', duration: 'Indoor court', severity: 'Mild' },
    { id: 'vb10', symptom: 'Heat Exhaustion & Calf Cramps in Multi-Set Matches', duration: 'Mid-match', severity: 'Often' },
  ],

  'Basket Ball': [
    { id: 'bb1', symptom: 'Patellar Tendon Soreness from Repeated High Rebounds', duration: '3 weeks', severity: 'Moderate' },
    { id: 'bb2', symptom: 'Lateral Ankle Sprains from Rapid Directional Cutting', duration: '2 weeks', severity: 'Severe' },
    { id: 'bb3', symptom: 'Achilles Tendon Stiffness on Morning Waking', duration: '1 month', severity: 'Moderate' },
    { id: 'bb4', symptom: 'Low Back Muscle Spasms from Low Defensive Stances', duration: 'Match days', severity: 'Moderate' },
    { id: 'bb5', symptom: 'Medial Tibial Stress Syndrome (Shin Splints)', duration: 'Hard court season', severity: 'Severe' },
    { id: 'bb6', symptom: 'Quadriceps Tendon Burning on Transition Sprints', duration: '4th quarter', severity: 'Severe' },
    { id: 'bb7', symptom: 'Finger Jamming & Collateral Ligament Trauma', duration: 'Rebound play', severity: 'Mild' },
    { id: 'bb8', symptom: 'Heavy Sweat Electrolyte Loss & Involuntary Calf Twitches', duration: 'Indoor gym', severity: 'Often' },
    { id: 'bb9', symptom: 'Late-Game Free Throw Inaccuracy from Triceps Fatigue', duration: 'Final minutes', severity: 'Moderate' },
    { id: 'bb10', symptom: 'Plantar Heel Impact Soreness from Sudden Decelerations', duration: 'Post-game', severity: 'Mild' },
  ],

  'Kabaddi': [
    { id: 'kb1', symptom: 'Ankle Inversion / Eversion Sprains from Ankle Holds', duration: '2 weeks', severity: 'Severe' },
    { id: 'kb2', symptom: 'Shoulder Dislocation / AC Joint Sprains from Hard Tackles', duration: 'Past match', severity: 'Severe' },
    { id: 'kb3', symptom: 'Mat Burn & Friction Abrasions on Forearms & Knees', duration: 'Tournament', severity: 'Mild' },
    { id: 'kb4', symptom: 'Thoracic Rib Wall Contusions & Heavy Impact Bruising', duration: 'Raid impacts', severity: 'Severe' },
    { id: 'kb5', symptom: 'Hamstring & Adductor Groin Pulls during Frog Jumps', duration: '3 weeks', severity: 'Moderate' },
    { id: 'kb6', symptom: 'Severe Lactic Acid Burn in Thighs from Low Squatting Stance', duration: 'Continuous', severity: 'Often' },
    { id: 'kb7', symptom: 'Cervical Spine & Trapezius Muscle Spasms from Defensive Grips', duration: 'Match days', severity: 'Moderate' },
    { id: 'kb8', symptom: 'Thumb & Finger Hyper-Extensive Sprains during Escapes', duration: 'Recent raid', severity: 'Mild' },
    { id: 'kb9', symptom: 'Anaerobic Breath-Holding (Cant) Hypoxic Exhaustion', duration: 'Late raids', severity: 'Severe' },
    { id: 'kb10', symptom: 'Involuntary Calf & Foot Arch Cramping in 2nd Half', duration: '2nd half', severity: 'Severe' },
  ],

  'Badminton': [
    { id: 'bm1', symptom: 'Tennis / Golfer\'s Elbow (Lateral/Medial Epicondylitis)', duration: '1 month', severity: 'Moderate' },
    { id: 'bm2', symptom: 'Rotator Cuff & Supraspinatus Soreness from Full Smashing', duration: '3 weeks', severity: 'Severe' },
    { id: 'bm3', symptom: 'Achilles Tendon Strain from Rapid Forecourt Lunging', duration: '2 weeks', severity: 'Moderate' },
    { id: 'bm4', symptom: 'Patellar & Meniscus Twisting Strain on Court Recovery', duration: 'Match play', severity: 'Moderate' },
    { id: 'bm5', symptom: 'Wrist Flexor Tendinitis from Deceptive Flick Shots', duration: '3 weeks', severity: 'Mild' },
    { id: 'bm6', symptom: 'Friction Blisters & Calluses on Dominant Foot Big Toe', duration: 'Tournament', severity: 'Mild' },
    { id: 'bm7', symptom: 'Asymmetric Lumbar Muscle Spasms from One-Sided Smashing', duration: 'Weekly', severity: 'Moderate' },
    { id: 'bm8', symptom: 'Ankle Instability on Deep Backcourt Round-the-Head Shots', duration: 'Recent match', severity: 'Moderate' },
    { id: 'bm9', symptom: 'Cardiovascular Anaerobic Exhaustion in Prolonged Rallies', duration: 'High pace', severity: 'Severe' },
    { id: 'bm10', symptom: 'Dominant Trapezius & Neck Tightness Post-Tournament', duration: 'Post-match', severity: 'Often' },
  ],

  'Kho Kho': [
    { id: 'kk1', symptom: 'Sudden Acceleration Hamstring & Quadriceps Tears/Pulls', duration: '2 weeks', severity: 'Severe' },
    { id: 'kk2', symptom: 'Knee Meniscus & Ligament Strain from Rapid Diving Turns', duration: 'Match day', severity: 'Severe' },
    { id: 'kk3', symptom: 'Deep Soil / Mud Traction Ankle Rolling & Sprains', duration: '1 month', severity: 'Moderate' },
    { id: 'kk4', symptom: 'Palm, Knee & Elbow Abrasions from Low Pole Dives', duration: 'Practice', severity: 'Mild' },
    { id: 'kk5', symptom: 'Extreme Lactic Acidosis from Non-Stop Sitting & Sprints', duration: 'Mid-match', severity: 'Severe' },
    { id: 'kk6', symptom: 'Sacroiliac & Lower Back Spasms from Zigzag Chasing', duration: '3 weeks', severity: 'Moderate' },
    { id: 'kk7', symptom: 'Shin Splints & Gastrocnemius Cramps from Explosive Pole Push', duration: 'Late innings', severity: 'Often' },
    { id: 'kk8', symptom: 'Chest Wall Impact Soreness from Ground Diving Tags', duration: 'Recent match', severity: 'Mild' },
    { id: 'kk9', symptom: 'Severe Breathlessness & Aerobic Depletion in Chasing Turn', duration: 'Chasing blocks', severity: 'Severe' },
    { id: 'kk10', symptom: 'Bilateral Adductor Groin Spasms after Match Halves', duration: 'Post-match', severity: 'Moderate' },
  ],

  'Throwball': [
    { id: 'tb1', symptom: 'Overhead Throwing Shoulder Subacromial Bursitis & Ache', duration: '3 weeks', severity: 'Moderate' },
    { id: 'tb2', symptom: 'Wrist Hyperextension & Sprain from Catching Hard Balls', duration: 'Recent match', severity: 'Severe' },
    { id: 'tb3', symptom: 'Rotator Cuff Tendinitis from Powerful Jumping Throws', duration: '1 month', severity: 'Severe' },
    { id: 'tb4', symptom: 'Bilateral Knee Impact Soreness on Net Jump Landings', duration: 'Match days', severity: 'Moderate' },
    { id: 'tb5', symptom: 'Ankle Inversion Twists during Rapid Lateral Court Coverage', duration: '2 weeks', severity: 'Moderate' },
    { id: 'tb6', symptom: 'Scapular Muscle Spasms & Upper Back Stiffness', duration: 'Post-game', severity: 'Mild' },
    { id: 'tb7', symptom: 'Biceps Tendon Inflammation from Rapid Overhead Releases', duration: '3 weeks', severity: 'Mild' },
    { id: 'tb8', symptom: 'Swollen Finger Knuckles & Joint Capsule Sprains', duration: 'Practice', severity: 'Mild' },
    { id: 'tb9', symptom: 'Dehydration & Low Electrolyte Energy Drop in Long Sets', duration: '3rd set', severity: 'Often' },
    { id: 'tb10', symptom: 'Lumbar Hyperextension Ache after Backline Catches', duration: 'Evening', severity: 'Moderate' },
  ],

  'Sports Nutrition': [
    { id: 'sn1', symptom: 'Delayed Muscle Soreness (>48-72h DOMS)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'sn2', symptom: 'Mid-Session Energy Crash / Glycogen Bonking', duration: 'Past 3 sessions', severity: 'Severe' },
    { id: 'sn3', symptom: 'Exercise-Associated Muscle Cramps (EAMC)', duration: 'Mid-session', severity: 'Moderate' },
    { id: 'sn4', symptom: 'Elevated Morning Resting Heart Rate (>5 bpm rise)', duration: '1 week', severity: 'Mild' },
    { id: 'sn5', symptom: 'Exercise-Induced Gastrointestinal Ischemia/Distress', duration: 'High intensity', severity: 'Moderate' },
    { id: 'sn6', symptom: 'Poor Sleep Architecture despite Physical Exhaustion', duration: '2 weeks', severity: 'Moderate' },
    { id: 'sn7', symptom: 'Recurrent Minor Soft Tissue Strains / Tendinopathy', duration: '2 months', severity: 'Moderate' },
    { id: 'sn8', symptom: 'High Sweat Rate with Heavy Salt Crusting on Gear', duration: 'Frequent', severity: 'Moderate' },
    { id: 'sn9', symptom: 'Inability to Hit Target Training Wattage / Pace', duration: '1 month', severity: 'Moderate' },
    { id: 'sn10', symptom: 'Persistent Tendon Aching & Suboptimal Collagen Repair', duration: '3 weeks', severity: 'Mild' },
  ],

  'Endurance': [
    { id: 'en1', symptom: 'Cardiovascular Fade in Final Quarter of Long Runs', duration: 'Recent trials', severity: 'Severe' },
    { id: 'en2', symptom: 'Central Nervous System Fatigue on >90m Efforts', duration: 'Weekly', severity: 'Severe' },
    { id: 'en3', symptom: 'Heavy Sodium Sweating with Salt Residue on Skin', duration: 'Daily', severity: 'Often' },
    { id: 'en4', symptom: 'Post-Long-Run Anorexia & Nausea', duration: 'Long sessions', severity: 'Moderate' },
    { id: 'en5', symptom: 'Loss of Stride Frequency / Biomechanical Breakdown', duration: 'Late miles', severity: 'Moderate' },
    { id: 'en6', symptom: 'Acute Muscle Glycogen Depletion (Heavy Legs)', duration: 'Past 2 weeks', severity: 'Severe' },
    { id: 'en7', symptom: 'Throbbing Dehydration Headaches Post-Training', duration: 'Weekly', severity: 'Moderate' },
    { id: 'en8', symptom: 'Shivering or Chills immediately Post-Endurance', duration: 'Post-run', severity: 'Mild' },
    { id: 'en9', symptom: 'Sub-Optimal Aerobic Threshold (Early Lactate Accumulation)', duration: '1 month', severity: 'Moderate' },
    { id: 'en10', symptom: 'Depressed Cellular Immunity during Peak Mileage', duration: 'Recent block', severity: 'Mild' },
  ],

  'Strength & Conditioning': [
    { id: 'sc1', symptom: 'Stagnant 1-Rep Max / Inability to Progressive Overload', duration: '6 weeks', severity: 'Moderate' },
    { id: 'sc2', symptom: 'Grip Fatigue & Early Forearm Burnout', duration: 'Deadlift days', severity: 'Moderate' },
    { id: 'sc3', symptom: 'Excessive Intramuscular Lactic Acid Burning Early in Sets', duration: 'Heavy sets', severity: 'Moderate' },
    { id: 'sc4', symptom: 'Joint Pinching in Shoulders / Knees during Compound Lifts', duration: '3 weeks', severity: 'Mild' },
    { id: 'sc5', symptom: 'Delayed Neuromuscular Firing / Poor Mind-Muscle Focus', duration: '2 weeks', severity: 'Mild' },
    { id: 'sc6', symptom: 'Prolonged Heart Rate Recovery between Working Sets', duration: '1 month', severity: 'Moderate' },
    { id: 'sc7', symptom: 'CNS Exhaustion post Heavy Squats / Pulls', duration: 'Leg days', severity: 'Severe' },
    { id: 'sc8', symptom: 'Involuntary Muscle Fasciculations after Max Effort', duration: 'Post-lift', severity: 'Mild' },
    { id: 'sc9', symptom: 'Inadequate Intra-Cellular ATP & Creatine Saturation', duration: '2 weeks', severity: 'Moderate' },
    { id: 'sc10', symptom: 'Tendon Inflammation at Patellar / Triceps Insertions', duration: '1 month', severity: 'Moderate' },
  ],

  'Pre-Workout Nutrition': [
    { id: 'pw1', symptom: 'Reactive Hypoglycemia 15m into Workout from simple sugar timing', duration: 'Past week', severity: 'Severe' },
    { id: 'pw2', symptom: 'Gastric Heaviness & Sluggishness from high-fat pre-meal', duration: 'Leg days', severity: 'Moderate' },
    { id: 'pw3', symptom: 'Acid Reflux during Heavy Bracing & Core Compression', duration: 'Squat sessions', severity: 'Moderate' },
    { id: 'pw4', symptom: 'Feeling Muscle Flatness due to Inadequate Glycogen Priming', duration: 'Morning workouts', severity: 'Moderate' },
    { id: 'pw5', symptom: 'Early Muscle Cramping due to Poor Pre-Hydration', duration: 'Warm-up', severity: 'Moderate' },
    { id: 'pw6', symptom: 'Caffeine Jitters & Palpitations from High-Stimulant Pre-workout', duration: 'Frequent', severity: 'Severe' },
    { id: 'pw7', symptom: 'Lightheadedness during First Heavy Working Set', duration: 'Intermittent', severity: 'Mild' },
    { id: 'pw8', symptom: 'Gastrointestinal Cramping & Urgency during Warm-Up', duration: 'Weekly', severity: 'Moderate' },
    { id: 'pw9', symptom: 'Distracted Focus & Brain Sluggishness at Start of Training', duration: 'Evening sessions', severity: 'Mild' },
    { id: 'pw10', symptom: 'Excessive Belching during Inverted / Prone Exercises', duration: 'Frequent', severity: 'Mild' },
  ],

  'Post-Workout Nutrition': [
    { id: 'po1', symptom: 'Severe Post-Exercise Lethargy & Afternoon Slump', duration: 'Daily post-training', severity: 'Severe' },
    { id: 'po2', symptom: 'Missed Optimal Anabolic Protein Window (>2h delay)', duration: 'Busy days', severity: 'Moderate' },
    { id: 'po3', symptom: 'Persistent Muscle Soreness lasting beyond 48 Hours', duration: 'Weekly', severity: 'Severe' },
    { id: 'po4', symptom: 'Ravenous Uncontrolled Sugar Cravings 2h Post-Training', duration: 'Daily', severity: 'Often' },
    { id: 'po5', symptom: 'Hypoglycemic Tremors following Intense Cardio Session', duration: 'Intermittent', severity: 'Moderate' },
    { id: 'po6', symptom: 'Gastrointestinal Bloating from Fast Whey Protein Ingestion', duration: 'Post-shake', severity: 'Mild' },
    { id: 'po7', symptom: 'Persistent Dehydration despite Drinking Plain Water', duration: 'Evening', severity: 'Moderate' },
    { id: 'po8', symptom: 'Total Loss of Appetite despite Significant Caloric Burn', duration: 'Post-heavy workout', severity: 'Mild' },
    { id: 'po9', symptom: 'Nighttime Restless Legs & Twitching', duration: 'Nightly', severity: 'Moderate' },
    { id: 'po10', symptom: 'Delayed Microtrauma Repair & Stiff Joints next morning', duration: 'Chronic', severity: 'Moderate' },
  ],

  'Recovery Nutrition': [
    { id: 'rn1', symptom: 'Systemic Low-Grade Muscle Inflammation', duration: '3 weeks', severity: 'Moderate' },
    { id: 'rn2', symptom: 'Elevated Morning Cortisol & Waking Anxiety', duration: '2 weeks', severity: 'Moderate' },
    { id: 'rn3', symptom: 'Loss of Muscle Fullness between Heavy Training Blocks', duration: 'Deload week', severity: 'Moderate' },
    { id: 'rn4', symptom: 'Persistent Joint Stiffness on Waking', duration: 'Morning', severity: 'Moderate' },
    { id: 'rn5', symptom: 'Depressed Cellular Immunity (Minor sore throat after hard block)', duration: 'Monthly', severity: 'Mild' },
    { id: 'rn6', symptom: 'Suppressed Heart Rate Variability (HRV) Scores', duration: 'Tracking app', severity: 'Severe' },
    { id: 'rn7', symptom: 'Delayed Glycogen Supercompensation', duration: '3 days post-race', severity: 'Moderate' },
    { id: 'rn8', symptom: 'Slow Connective Tissue Remodeling', duration: '2 months', severity: 'Mild' },
    { id: 'rn9', symptom: 'Poor Sleep Efficiency despite 8 Hours in Bed', duration: 'Nightly', severity: 'Often' },
    { id: 'rn10', symptom: 'Lingering General Soreness Impairing Next Session', duration: 'Weekly', severity: 'Severe' },
  ],

  'Hydration & Electrolytes': [
    { id: 'he1', symptom: 'Painful Nocturnal Gastrocnemius (Calf) Muscle Spasms', duration: 'Nightly', severity: 'Severe' },
    { id: 'he2', symptom: 'Orthostatic Dizziness & Vision Dimming on Standing', duration: '3 weeks', severity: 'Moderate' },
    { id: 'he3', symptom: 'Dark Amber Morning Urine (Specific Gravity >1.025)', duration: 'Daily', severity: 'Severe' },
    { id: 'he4', symptom: 'Dry Mouth, Sticky Saliva & Chapped Lips', duration: 'Daily', severity: 'Often' },
    { id: 'he5', symptom: 'Cognitive Brain Fog & Decreased Reaction Time', duration: 'Mid-afternoon', severity: 'Moderate' },
    { id: 'he6', symptom: 'Dilutional Hyponatremia Signs (Puffy fingers, mild nausea from plain water)', duration: 'Long events', severity: 'Severe' },
    { id: 'he7', symptom: 'Intense Cravings for Salt & Savory Seasonings', duration: 'Daily', severity: 'Often' },
    { id: 'he8', symptom: 'Subnormal Sweating Rate during Warm Weather Training', duration: 'Hot days', severity: 'Moderate' },
    { id: 'he9', symptom: 'Exertional Tachycardia disproportionate to workload', duration: 'Mid-session', severity: 'Moderate' },
    { id: 'he10', symptom: 'Throbbing Temporal Post-Exercise Headache', duration: 'Post-workout', severity: 'Moderate' },
  ],

  'Competition Nutrition': [
    { id: 'cn1', symptom: 'Pre-Event Sympathetic Nervous Diarrhea & Cramping', duration: 'Morning of race', severity: 'Severe' },
    { id: 'cn2', symptom: 'Travel-Related Constipation & Circadian Disruption', duration: 'Away meets', severity: 'Moderate' },
    { id: 'cn3', symptom: 'Inability to Digest Solid Foods 3h before Start Time', duration: 'Event mornings', severity: 'Moderate' },
    { id: 'cn4', symptom: 'Gastrointestinal Sloshing from In-Race Gel / Fluid Mismatch', duration: 'Mid-race', severity: 'Severe' },
    { id: 'cn5', symptom: 'Severe Glycogen Depletion in Final Championship Heats', duration: 'Competition day', severity: 'Severe' },
    { id: 'cn6', symptom: 'Heat Cramping under Extreme Humidity & Stress', duration: 'Tournament', severity: 'Moderate' },
    { id: 'cn7', symptom: 'Post-Event Acute Dehydration & Hypovolemia', duration: 'Post-meet', severity: 'Moderate' },
    { id: 'cn8', symptom: 'Electrolyte Imbalance during Multi-Round Same-Day Events', duration: 'Tournament days', severity: 'Severe' },
    { id: 'cn9', symptom: 'Complete Loss of Appetite Post-Competition', duration: 'Evening of event', severity: 'Mild' },
    { id: 'cn10', symptom: 'Post-Weigh-in Glycogen Rebound Stomach Distension', duration: 'Weigh-in nights', severity: 'Moderate' },
  ],

  'Performance Nutrition': [
    { id: 'pn1', symptom: 'Suboptimal Power-to-Weight Ratio Impairing Agility', duration: 'Current season', severity: 'Moderate' },
    { id: 'pn2', symptom: 'Inadequate Dietary Carbohydrate Availability (<5g/kg)', duration: 'Training log', severity: 'Severe' },
    { id: 'pn3', symptom: 'Relative Energy Deficiency in Sport (RED-S Markers)', duration: '4 months', severity: 'Severe' },
    { id: 'pn4', symptom: 'Bone Stress Injury / Micro-reaction Tendency', duration: 'Shin/foot', severity: 'Moderate' },
    { id: 'pn5', symptom: 'Athletic Amenorrhea / Menstrual Disruption', duration: '3 months', severity: 'Severe' },
    { id: 'pn6', symptom: 'Frequent Upper Respiratory Illness during Heavy Phase', duration: 'Winter block', severity: 'Moderate' },
    { id: 'pn7', symptom: 'Morning Lethargy & Elevated Rating of Perceived Exertion (RPE)', duration: 'Daily', severity: 'Often' },
    { id: 'pn8', symptom: 'Sluggish Sprint Acceleration & Reaction Lag', duration: '2 weeks', severity: 'Moderate' },
    { id: 'pn9', symptom: 'Unstable Body Mass Fluctuations before Category Weigh-in', duration: 'Competition week', severity: 'Moderate' },
    { id: 'pn10', symptom: 'Macro-Nutrient Timing Misaligned with High-Intensity Blocks', duration: 'Current plan', severity: 'Mild' },
  ],

  // ==========================================
  // FITNESS
  // ==========================================
  'Weight Loss': [
    { id: 'wl1', symptom: 'Weight Loss Plateau (>4 Weeks without Scale Movement)', duration: '1 month', severity: 'Severe' },
    { id: 'wl2', symptom: 'Late-Night Emotional or Boredom Eating Cravings', duration: 'Daily 10 PM', severity: 'Often' },
    { id: 'wl3', symptom: 'Metabolic Adaptation (Feeling Constantly Cold & Low Energy)', duration: '2 months', severity: 'Moderate' },
    { id: 'wl4', symptom: 'Elevated Ghrelin Spikes & Intense Hunger Pangs', duration: 'Evening', severity: 'Severe' },
    { id: 'wl5', symptom: 'Reduced Non-Exercise Activity Thermogenesis (Low Daily NEAT)', duration: '3 weeks', severity: 'Moderate' },
    { id: 'wl6', symptom: 'Fluid Retention Masking Fat Loss Progress', duration: 'Post-cheat', severity: 'Moderate' },
    { id: 'wl7', symptom: 'Deficit-Induced Brain Fog & Low Mental Productivity', duration: 'Morning', severity: 'Moderate' },
    { id: 'wl8', symptom: 'Poor Satiety from Low-Volume or Highly Processed Foods', duration: 'Daily', severity: 'Often' },
    { id: 'wl9', symptom: 'Weekend Caloric Compensation / Binge Tendency', duration: 'Weekly', severity: 'Moderate' },
    { id: 'wl10', symptom: 'Loss of Lean Muscle Tissue instead of Pure Fat Mass', duration: 'Latest scan', severity: 'Moderate' },
  ],

  'Weight Gain': [
    { id: 'wg1', symptom: 'Early Satiety & Inability to Finish High-Calorie Portions', duration: 'Daily', severity: 'Severe' },
    { id: 'wg2', symptom: 'Chronic Hypo-Caloric Intake due to Low Natural Appetite', duration: '6 months', severity: 'Severe' },
    { id: 'wg3', symptom: 'High Basal Metabolic Rate (Ectomorphic Fast Burner)', duration: 'Lifelong', severity: 'Moderate' },
    { id: 'wg4', symptom: 'Gastric Fullness & Nausea when Attempting Caloric Surplus', duration: 'Post-large meal', severity: 'Moderate' },
    { id: 'wg5', symptom: 'Inadequate Energy Density in Meal Selections', duration: 'Diet review', severity: 'Moderate' },
    { id: 'wg6', symptom: 'Weight Stalled below Target Clinically Safe BMI', duration: '3 months', severity: 'Severe' },
    { id: 'wg7', symptom: 'Digestive Sluggishness when Increasing Food Volume', duration: '2 weeks', severity: 'Mild' },
    { id: 'wg8', symptom: 'Feeling Fatigued and Heavy After Surplus Meals', duration: 'Post-meal', severity: 'Mild' },
    { id: 'wg9', symptom: 'Difficulty Maintaining Weight during Busy Working Weeks', duration: 'Ongoing', severity: 'Moderate' },
    { id: 'wg10', symptom: 'Low Micronutrient Bioavailability from Rapid Intestinal Transit', duration: '1 month', severity: 'Mild' },
  ],

  'Weight Maintenance': [
    { id: 'wm1', symptom: 'Daily Scale Weight Fluctuations Causing Health Anxiety', duration: 'Daily', severity: 'Moderate' },
    { id: 'wm2', symptom: 'Difficulty Transitioning from Deficit to Maintenance Calories', duration: 'Post-diet', severity: 'Severe' },
    { id: 'wm3', symptom: 'Fear of Rapid Rebound Fat Gain on Normal Portions', duration: 'Daily', severity: 'Often' },
    { id: 'wm4', symptom: 'Uncalibrated Portion Drift over Weeks without Tracking', duration: '1 month', severity: 'Moderate' },
    { id: 'wm5', symptom: 'Weekend Caloric Spikes followed by Weekday Restriction', duration: 'Weekly', severity: 'Moderate' },
    { id: 'wm6', symptom: 'Activity Shifts (Desk work change) altering Calorie Needs', duration: '2 months', severity: 'Mild' },
    { id: 'wm7', symptom: 'Fluid Shifts after High-Sodium Restaurant Meals', duration: 'Intermittent', severity: 'Mild' },
    { id: 'wm8', symptom: 'Mindless Evening Snacking while Watching Screens', duration: 'Evening', severity: 'Often' },
    { id: 'wm9', symptom: 'Social Dining Anxiety regarding Untracked Meal Caloric Values', duration: 'Weekends', severity: 'Moderate' },
    { id: 'wm10', symptom: 'Lack of Sustainable Flexible Eating Framework', duration: '3 months', severity: 'Moderate' },
  ],

  'Fat Loss': [
    { id: 'fl1', symptom: 'Stubborn Adipose Retention in Lower Abdomen & Flanks', duration: 'Chronic', severity: 'Severe' },
    { id: 'fl2', symptom: 'Elevated Fasting Insulin Impairing Lipolytic Oxidation', duration: 'Lab confirmed', severity: 'Severe' },
    { id: 'fl3', symptom: 'Cortisol-Induced Water Retention Masking Visual Definition', duration: 'High stress periods', severity: 'Moderate' },
    { id: 'fl4', symptom: 'Loss of Muscle Fullness & Vascularity in Deficit', duration: '4 weeks', severity: 'Mild' },
    { id: 'fl5', symptom: 'Late Afternoon Energy Dips and Glycemic Fluctuations', duration: 'Daily 3 PM', severity: 'Often' },
    { id: 'fl6', symptom: 'High Visceral Fat Rating (>9 Bioimpedance Score)', duration: 'InBody scan', severity: 'Severe' },
    { id: 'fl7', symptom: 'Low Fatty Acid Oxidation during Zone-2 Cardiovascular Training', duration: 'Training log', severity: 'Moderate' },
    { id: 'fl8', symptom: 'Carbohydrate Sensitivity (Excessive Bloating after Carbs)', duration: 'Post-rice/wheat', severity: 'Moderate' },
    { id: 'fl9', symptom: 'Poor Sleep Quality Impairing Nocturnal Growth Hormone Lipolysis', duration: 'Nightly', severity: 'Often' },
    { id: 'fl10', symptom: 'Unplanned High-Fat High-Sugar Caloric Slip-ups on Weekends', duration: 'Weekly', severity: 'Moderate' },
  ],

  'Muscle Gain': [
    { id: 'mg1', symptom: 'Hypertrophic Plateau despite Consistent Resistance Training', duration: '2 months', severity: 'Severe' },
    { id: 'mg2', symptom: 'Suboptimal Daily Protein Intake (<1.6g/kg Bodyweight)', duration: 'Intake recall', severity: 'Severe' },
    { id: 'mg3', symptom: 'Inadequate Post-Workout Glycogen & Leucine Signaling', duration: 'Post-gym', severity: 'Moderate' },
    { id: 'mg4', symptom: 'Inability to Reach Target Training RPE/Failure from Weak Fueling', duration: 'Past 3 weeks', severity: 'Moderate' },
    { id: 'mg5', symptom: 'Excessive Adipose Accumulation during Caloric Surplus Phase', duration: 'Bulking cycle', severity: 'Moderate' },
    { id: 'mg6', symptom: 'Prolonged Soreness Hindering Muscle Group Frequency', duration: 'Weekly', severity: 'Moderate' },
    { id: 'mg7', symptom: 'Low Dietary Leucine Distribution Across Daily Meals', duration: 'Diet pattern', severity: 'Mild' },
    { id: 'mg8', symptom: 'Subjective Muscle Flatness and Low Intracellular Hydration', duration: 'Morning', severity: 'Mild' },
    { id: 'mg9', symptom: 'Low Serum Free Androgen / Anabolic Biomarkers', duration: 'Lab check', severity: 'Moderate' },
    { id: 'mg10', symptom: 'Inadequate Satiety from High-Protein Meals (Digestive Sluggishness)', duration: 'Post-meal', severity: 'Mild' },
  ],

  'Body Recomposition': [
    { id: 'br1', symptom: 'Stagnant Scale Weight Masking Underlying Fat Loss & Muscle Gain', duration: '2 months', severity: 'Severe' },
    { id: 'br2', symptom: 'Difficulty Calibrating Precise Iso-Caloric or Slight Deficit Target', duration: 'Diet planning', severity: 'Moderate' },
    { id: 'br3', symptom: 'Uneven Protein Distribution Impairing Muscle Protein Synthesis', duration: 'Daily', severity: 'Moderate' },
    { id: 'br4', symptom: 'Inadequate Resistance Stimulus to Trigger Sarcoplasmic Hypertrophy', duration: 'Training log', severity: 'Moderate' },
    { id: 'br5', symptom: 'Fluctuating Energy Levels between Training & Rest Days', duration: 'Weekly', severity: 'Mild' },
    { id: 'br6', symptom: 'Uncertainty Regarding Carbohydrate Cycling Protocols', duration: 'Meal plan', severity: 'Mild' },
    { id: 'br7', symptom: 'Slow Visual Changes leading to Motivation Drop', duration: 'Ongoing', severity: 'Often' },
    { id: 'br8', symptom: 'Post-Workout Fatigue Impairing Non-Training Daily Activity', duration: 'Afternoon', severity: 'Moderate' },
    { id: 'br9', symptom: 'Suboptimal Creatine & Phosphate Cellular Saturation', duration: '1 month', severity: 'Mild' },
    { id: 'br10', symptom: 'Insufficient Recovery Sleep for Simultaneous Anabolism & Lipolysis', duration: 'Nightly', severity: 'Moderate' },
  ],

  'General Fitness': [
    { id: 'gf1', symptom: 'Morning Lethargy & Difficulty Waking Up Refreshed', duration: 'Daily', severity: 'Often' },
    { id: 'gf2', symptom: 'Early Exertional Dyspnea on Mild Cardio (Climbing Stairs)', duration: '1 month', severity: 'Moderate' },
    { id: 'gf3', symptom: 'Postural Spinal Stiffness & Tight Hamstrings from Sitting', duration: 'Desk hours', severity: 'Moderate' },
    { id: 'gf4', symptom: 'Inconsistent Exercise Routine (<2 Workouts per week)', duration: '6 months', severity: 'Severe' },
    { id: 'gf5', symptom: 'Mid-Afternoon Mental Fog Requiring Stimulant / Tea Caffeine', duration: 'Daily 3 PM', severity: 'Often' },
    { id: 'gf6', symptom: 'Suboptimal VO2 Max & High Resting Heart Rate (>80 bpm)', duration: 'Cardio tracker', severity: 'Moderate' },
    { id: 'gf7', symptom: 'Mild Post-Prandial Abdominal Heaviness from Sedentary Lifestyle', duration: 'After meals', severity: 'Mild' },
    { id: 'gf8', symptom: 'General Joint Hypomobility & Tight Hip Flexors', duration: '3 months', severity: 'Mild' },
    { id: 'gf9', symptom: 'Frequent Low-Level Stress & Muscle Clenching in Shoulders', duration: 'Workdays', severity: 'Moderate' },
    { id: 'gf10', symptom: 'Poor Hydration Compliance (<1.5 Litres Daily Water)', duration: 'Daily', severity: 'Often' },
  ],

  'Healthy Lifestyle': [
    { id: 'hl1', symptom: 'Circadian Rhythm Disruption (Late Sleep >12:00 AM)', duration: 'Nightly', severity: 'Severe' },
    { id: 'hl2', symptom: 'Irregular Meal Timings & Constant Grazing Pattern', duration: 'Daily', severity: 'Often' },
    { id: 'hl3', symptom: 'Excessive Daily Screen Time & Digital Eye Fatigue', duration: 'Daily >8 hrs', severity: 'Often' },
    { id: 'hl4', symptom: 'Low Daily Sunlight Exposure & Low Vitamin D Biosynthesis', duration: 'Office work', severity: 'Moderate' },
    { id: 'hl5', symptom: 'High Dependency on Ultra-Processed Snacks & Sugars', duration: 'Daily', severity: 'Moderate' },
    { id: 'hl6', symptom: 'Work-Related Chronic Sympathetic Overdrive / Cortisol', duration: 'Weekdays', severity: 'Severe' },
    { id: 'hl7', symptom: 'Lack of Mindful Eating Habits (Eating while Working/Watching)', duration: 'Daily', severity: 'Often' },
    { id: 'hl8', symptom: 'Weekend Caloric / Alcohol Indulgence Disrupting Sleep', duration: 'Weekends', severity: 'Moderate' },
    { id: 'hl9', symptom: 'Inadequate Daily Fiber Consumption (<25g per day)', duration: 'Diet review', severity: 'Moderate' },
    { id: 'hl10', symptom: 'Absence of Dedicated Daily Parasympathetic Relaxation Practice', duration: 'Chronic', severity: 'Mild' },
  ],
};

// Extra suggested clinical symptoms available when clicking `+` for that condition
export const domainAdditionalSuggestedSymptoms: Record<string, string[]> = {
  'Diabetes Mellitus': [
    'Nocturnal Hypoglycemia (Night sweats)',
    'Recurrent Fungal / Candida Infections',
    'Gastroparesis (Delayed stomach emptying)',
    'Dry Itchy Skin & Xerosis',
    'Post-prandial Tachycardia',
    'Burning Sensation in Soles of Feet',
  ],
  'Hypertension': [
    'Pulsatile Neck Sensation',
    'Morning SBP Spikes upon Waking',
    'Chest Flutters during Emotional Stress',
    'Shortness of breath in Supine Position',
    'Exercise Induced SBP Rise >200 mmHg',
    'Facial Flushing on Mild Exertion',
  ],
  'Cardiovascular Diseases': [
    'Nighttime Diuresis from Elevated BNP',
    'Cold Cyanotic Finger Tips',
    'Coughing when Lying Flat',
    'Post-Exertional Delayed Recovery',
    'Palpitations on Caffeine Intake',
    'Jugular Venous Distension Fullness',
  ],
  'PCOS': [
    'Darkened Skin Tags on Armpits',
    'Pelvic Heaviness during Mid-Cycle',
    'Sleep Apnea from High Androgens',
    'Mid-Day Severe Energy Slump',
    'Intense Salty-Sweet Carb Binging',
    'Ovarian Micro-Cyst Twisting Aches',
  ],
  'Thyroid Conditions': [
    'Swollen Sensation in Anterior Neck (Goiter)',
    'Hoarse Morning Vocal Quality',
    'Puffy Eyelids on Waking',
    'Slowed Tendon Reflexes (Delayed Achilles relaxation)',
    'Cold Sensitivity in Air-Conditioned Rooms',
    'Inability to Concentrate / Mental Fatigue',
  ],
  'Kidney Diseases': [
    'Hiccups due to Uremic Toxin Irritation',
    'Bruising Easily with Low Platelet Function',
    'Restless Leg Syndrome during Dialysis Window',
    'Sub-cutaneous Itching Unrelieved by Creams',
    'High Blood Pressure Spikes from Fluid Overload',
    'Loss of Taste for Meat & Red Poultry',
  ],
  'Liver Diseases': [
    'Fetor Hepaticus (Sweet musty breath odor)',
    'Asterixis (Flapping hand tremor sign)',
    'Bleeding Gums after Brushing Teeth',
    'Swelling in Feet after Prolonged Standing',
    'Bitter Taste in Mouth on Waking',
    'Right Shoulder Blade Referred Dull Pain',
  ],
  'Gastrointestinal Diseases': [
    'Early Morning Urgent Watery Stools',
    'Pain Radiating to Mid-Back after Meals',
    'Sensation of Lump in Throat (Globus Hystericus)',
    'Excessive Salivation with Acid Reflux',
    'Abdominal Spasms Relieved by Heating Pad',
    'Stool Incontinence / Urgency',
  ],
  'Endocrine Diseases': [
    'Salt Cravings (Pickles, Soy Sauce, Chips)',
    'Hypotension after Warm Baths',
    'Sudden Episodes of Generalized Shivering',
    'Hair Thinning on Outer Arms',
    'Emotional Lability with Tearfulness',
    'Night Sweats Unrelated to Menopause',
  ],
  'Neurological Diseases': [
    'Sensory Allodynia (Scalp sensitivity to brush)',
    'Visual Aura before Headaches',
    'Electric Shock Sensations in Spine (Lhermitte sign)',
    'Muscle Weakness Climbing Stairs',
    'Tension Band Feeling Around Forehead',
    'Disturbed REM Sleep / Vivid Dreams',
  ],
  'Respiratory Diseases': [
    'Nighttime Wheezing Triggered by Dust/Pollutants',
    'Chest Tightness in Cold Weather',
    'Inability to Take a Satisfying Deep Breath',
    'Frequent Throat Clearing throughout Day',
    'Cyanotic Nail Beds on High Exertion',
    'Stridor or Audible Inspiration',
  ],
  'Cancer': [
    'Early Satiety after 3 Spoonfuls of Food',
    'Aversion to Red Meat / Metallic Aftertaste',
    'Bone Pain Waking Patient at Night',
    'Low White Blood Cell Counts on Chemotherapy',
    'Oral Dryness & Mucosal Ulcerations',
    'Rapid Fatigue on Mildest Ambulatory Movement',
  ],
  'Metabolic Disorders': [
    'Waistline Increase despite Unchanged Weight',
    'Post-Breakfast Lethargy within 60 Minutes',
    'High Uric Acid Joint Sensitivity in Big Toe',
    'Extreme Thirst after Carbohydrate Dinners',
    'Difficulty Fasting for 12 Hours',
    'High Fasting Insulin (>10 mIU/L)',
  ],
  'Lipid Disorders': [
    'Heavy Feeling in Left Chest on Strenuous Activity',
    'Corneal Arcus in Eyes',
    'Post-Dinner Sluggishness from High Triglycerides',
    'Elevated Non-HDL Cholesterol Fraction',
    'Cold Extremities due to Microvascular Sludge',
    'Difficulty Processing Fried or Ghee-Rich Meals',
  ],
  'Nutrient Deficiency Disorders': [
    'Cracking at Angles of Mouth (Riboflavin deficiency)',
    'Pica (Craving Ice, Clay, or Chalk - Iron sign)',
    'Burning Feet Sensation (B5 / B12 sign)',
    'Gingival Sponginess & Red Swelling (Vitamin C)',
    'Loss of Vibratory Sense in Toes',
    'Muscle Twitches in Eyelids (Magnesium)',
  ],
  'Digestive Disorders': [
    'Pain in Left Lower Quadrant Relieved by Gas Release',
    'Floating or Greasy Stools (Fat malabsorption)',
    'Chronic Sulfur Belching',
    'Rectal Itching or Burning',
    'Excessive Mucus Discharge with Stool',
    'Stomach Loudly Growling during Meetings',
  ],
  'Eating Disorders': [
    'Wearing Baggy Clothing to Conceal Body Shape',
    'Refusal to Eat in Front of Family or Friends',
    'Compulsive Weighing Multiple Times a Day',
    'Extreme Disturbance by Minor Caloric Surplus',
    'Excessive Water Intake before Weigh-in',
    'Chronically Low Pulse Rate (<50 bpm)',
  ],
  'Food Intolerance': [
    'Skin Itching Flare 2 Hours after Eating Seafood',
    'Instant Sneezing & Runny Nose after Red Wine / Cheese',
    'Severe Diarrhea 30 Minutes after Dairy Ice Cream',
    'Abdominal Cramping from Inulin / Chicory Root',
    'Severe Lethargy after Commercial Bakery Bread',
    'Water Retention with Tight Rings next Morning',
  ],
  'Food Allergy': [
    'Hives & Itching on Neck within 5 Minutes',
    'Throat Tightening Feeling after Tree Nuts',
    'Nausea & Immediate Stomach Cramping',
    'Lip Swelling after Shellfish Ingestion',
    'Coughing & Hoarseness after Allergen',
    'Emergency Antihistamine Dependency',
  ],
  'Malnutrition': [
    'Loose Skin Folds on Upper Thighs',
    'Temporal Muscle Depletion / Sunken Temples',
    'Cold Hands and Feet with Pale Capillary Refill',
    'Slow Wound Closure on Minor Scratches',
    'Inability to Climb 10 Steps without Stopping',
    'Sunken Eye Sockets and Dry Mucosa',
  ],
  'Obesity': [
    'Knee Joint Pain when Descending Stairs',
    'Daytime Sleepiness while Driving or Working',
    'Skin Friction Darkening between Inner Thighs',
    'Lower Back Spasms from Anterior Pelvic Tilt',
    'Shortness of Breath while Tying Shoelaces',
    'Chronic Ankle Swelling at End of Workday',
  ],
  'Sports Nutrition': [
    'Muscle Quivering at End of Second Training Session',
    'Early Lactate Build-up during Warm-up',
    'Stomach Cramping when Consuming Isotonic Drinks',
    'Salt White Stains on Cap / Workout Shirt',
    'Slow Recovery between Sprints',
    'Appetite Suppression after High Core Temperature',
  ],
  'Endurance': [
    'Late Race Cognitive Disorientation / Tunnel Vision',
    'Extreme Calf Tightness on Uphill Gradients',
    'Nausea when Ingesting Concentrated Carbohydrate Gels',
    'Heavy Leg Sensation on Day 2 of Block',
    'Post-Ride Hypothermia Shivers',
    'Dehydration Pulse Rate Elevation (>15 bpm)',
  ],
  'Strength & Conditioning': [
    'Barbell Slipping due to Forearm Grip Failure',
    'Lumbar Stiffness after Heavy Hinges',
    'Delayed CNS Recovery between Lifting Sessions',
    'Elbow Tendonitis during Bench Press',
    'Inability to Hit Target Reps on Second Compound Set',
    'Involuntary Quad Tremors after Heavy Squats',
  ],
  'Pre-Workout Nutrition': [
    'Shakiness 20 Minutes into Workout from High Glycemic Pre-meal',
    'Nausea during Inverted Core Exercises',
    'Excessive Gas during Leg Press',
    'Acidic Taste in Mouth when Straining',
    'High Jitters & Palpitations from Pre-workout Powder',
    'Sluggishness from Eating too Close to Training',
  ],
  'Post-Workout Nutrition': [
    'Headache and Weakness 1 Hour Post-Exercise',
    'Delayed Protein Digestion causing Distension',
    'Shaking Hands while Preparing Post-Workout Meal',
    'Intense Salty Craving Post-Sweat',
    'Muscle Cramping while Driving Home',
    'Inability to Fall Asleep after Night Training',
  ],
  'Recovery Nutrition': [
    'Morning Joint Stiffness Lasting >30 Minutes',
    'Low Heart Rate Variability (HRV) Warning on Wearable',
    'Sub-cutaneous Water Puffiness from Muscle Microtrauma',
    'Muscle Weakness on Consecutive Training Days',
    'Frequent Minor Head Colds during Peaking Phase',
    'Lack of Post-Workout Muscle Fullness',
  ],
  'Hydration & Electrolytes': [
    'Nightly Calf Cramps Waking Patient from Sleep',
    'Puffy Eyelids from High Sodium with Low Potassium',
    'Dry Sticky Tongue and Reduced Saliva Volume',
    'Dark Golden Yellow Urine Score 6-7',
    'Dizziness when Transitioning from Sitting to Standing',
    'Post-Sweating Throbbing Bilateral Temple Headache',
  ],
  'Competition Nutrition': [
    'Morning-of-Race Gastrointestinal Spasms',
    'Feeling Stomach Sloshing during Championship Final',
    'Acute Muscle Lock-up in Final 200m',
    'Hypoglycemic Panic in Staging Area',
    'Appetite Freeze Post-Weigh-in',
    'Dehydration Induced Cramping in Humid Venues',
  ],
  'Performance Nutrition': [
    'Bone Stress Pain in Tibia / Foot Metatarsals',
    'Low Ferritin (<30 ng/mL) despite Normal Hemoglobin',
    'Loss of Explosive First-Step Quickness',
    'Inadequate Carbohydrate Refueling between Tournaments',
    'Rapid Fatigue in Third Period / Overtime',
    'Delayed Menstrual Cycles during Peak Volume Blocks',
  ],
  'Weight Loss': [
    'Plateau Stagnant for >30 Days',
    'Midnight Kitchen Grazing Instinct',
    'Metabolic Burnout Feeling Freezing Indoors',
    'Muscle Loss on Bioimpedance Tracking',
    'Mid-Day Severe Carbohydrate Obsession',
    'Water Weight Rebound (>1.5 kg) after One Dinner',
  ],
  'Weight Gain': [
    'Stomach Fullness after 4 Bites of Rice',
    'Inability to Drink Caloric Shakes without Fullness',
    'Rapid Weight Drop on 1 Missed Meal Day',
    'High Metabolic Heat after Overfeeding',
    'Loss of Appetite during Work Stress',
    'Low Muscle Density despite Strength Work',
  ],
  'Weight Maintenance': [
    'Scale Weight Anxiety after Social Events',
    'Over-restricting on Mondays after Weekend Meals',
    'Inability to Gauge Cooked Grain Portion Sizes',
    'Unconscious Nibbling while Cooking',
    'Fluid Shifts after Salty Takeaway Foods',
    'Confusion on Daily Macro Distribution',
  ],
  'Fat Loss': [
    'Lower Belly Fat Resistant to Caloric Deficit',
    'Carbohydrate Bloating Masking Waist Measurement',
    'High Morning Cortisol Retaining Fluid',
    'Suboptimal Fat Oxidation in Zone 2 Heart Rate',
    'Loss of Deltoid & Arm Definition',
    'Uncontrolled Craving for Fried Savory Snacks',
  ],
  'Muscle Gain': [
    'Plateau in Biceps / Quad Circumference',
    'Excessive Waistline Growth during Caloric Surplus',
    'Slow Recovery Between Leg Training Sessions',
    'Low Muscle Tightness / Intramuscular Fullness',
    'Inadequate Daily Leucine Dose (<3g per meal)',
    'Digestive Sluggishness from High Protein Shakes',
  ],
  'Body Recomposition': [
    'Unchanged Scale Weight with Changing Belt Notch',
    'Low Energy during High-Rep Resistance Sets',
    'Confusion over Refeed Days vs Deficit Days',
    'Inconsistent Daily Protein Distribution',
    'Slow Progress Visualized on Body Scanning',
    'Morning Muscle Flatness followed by Evening Fullness',
  ],
  'General Fitness': [
    'Difficulty Climbing Stairs without Puffing',
    'Hamstring and Hip Flexor Tightness from Sitting',
    'Afternoon Slump Requiring Strong Coffee',
    'Waking Up Unrefreshed after 7 Hours Sleep',
    'Sub-Optimal Resting Heart Rate (>75 bpm)',
    'Low Daily Step Count (<4,000 steps)',
  ],
  'Healthy Lifestyle': [
    'Screen Blue-Light Exposure Past 11 PM',
    'Eating Heavy Dinners within 90m of Bedtime',
    'Low Daily Natural Sunlight Exposure',
    'Under-Hydration (<1.5L Plain Water Daily)',
    'High Mental Stress from Work Notifications',
    'Lack of Scheduled Mindful Walking Breaks',
  ],
  'Athlets': [
    'Drop in Peak Aerobic Power (VO2 max)',
    'Sub-Clinical Achilles Tendon Crepitus',
    'Post-Match Glycogen Bonk & Hand Tremors',
    'Sleep Architecture Degradation on Travel',
    'High Sweat Sodium Loss Staining Uniform',
    'Chronic Bilateral Hamstring Stiffness',
  ],
  'GYM': [
    'Subacromial Shoulder Pinching on Incline Press',
    'Mid-Set Forearm Extensor Cramping',
    'Lumbar Spine Fatigue during Standing OHP',
    'Patellar Tendon Soreness on Deep Back Squats',
    'Post-Heavy Lift Vagal Lightheadedness',
    'Low Intra-Muscular Glycogen Flatness',
  ],
  'Football': [
    'Adductor Longus Groin Tightness',
    'Calf Muscle Cramps in 2nd Half Extra Time',
    'Lateral Ankle Ligament Instability',
    'Shin Bone Impact Sensitivity',
    'Late-Game Visual Reaction Lag',
    'Dehydration Chills after Hot Match',
  ],
  'Cricket': [
    'Fast Bowling Lumbar Sacral Stiffness',
    'Bowling Arm Triceps / Rotator Tenderness',
    'Wicket-Keeper Deep Squat Knee Ache',
    'Multi-Session Heat Exhaustion',
    'Bat Grip Forearm Flexor Soreness',
    'Finger Knuckle Impact Swelling',
  ],
  'Sport Endurance': [
    'Glycogen "Wall" Bonk at 30km Mark',
    'Aerobic Cardiac Drift under Hot Conditions',
    'Hyponatremic Finger Puffiness & Nausea',
    'Runner\'s Gastrointestinal Cramps & Urgency',
    'IT Band Lateral Knee Friction Burn',
    'Post-Race Core Shivering & Exhaustion',
  ],
  'OTHERS': [
    'Multi-Sport Lateral Direction Fatigue',
    'Post-Match Joint Capsule Swelling',
    'Delayed Muscle Recovery between Tournaments',
    'Dehydration Headaches & Salt Loss',
    'Foot Arch & Plantar Fascial Tightness',
    'Involuntary Muscle Twitches during Sleep',
  ],
  'Volley Ball': [
    'Patellar Jumper\'s Knee Tendon Aching',
    'Rotator Cuff Impingement on Hard Spikes',
    'Net Block Finger Sprains & Swelling',
    'Landing Ankle Rolling Instability',
    'Late-Set Vertical Jump Power Decline',
    'Forearm Hematoma / Bruising from Hard Digs',
  ],
  'Basket Ball': [
    'Hard Court Shin Splints (Medial Tibial Pain)',
    'Patellar Rebound Shock Tenderness',
    'Lateral Ankle Inversion Soreness',
    'Defensive Stance Low Back Muscle Spasm',
    'Late 4th Quarter Free-Throw Fatigue',
    'Foot Plantar Heel Deceleration Bruise',
  ],
  'Kabaddi': [
    'Tackle Impact Rib Wall Contusions',
    'Ankle Hold Ligament Sprain & Swelling',
    'Mat Friction Burns on Elbows & Knees',
    'Raid Hypoxic Exhaustion (Cant Strain)',
    'Low Squatting Thigh Lactic Acid Lockup',
    'Frog Jump Adductor & Groin Pulls',
  ],
  'Badminton': [
    'Smash Arm Tennis Elbow (Epicondylitis)',
    'Forecourt Lunging Achilles Tendon Strain',
    'Rotator Cuff Supraspinatus Tendonitis',
    'Forefoot Big Toe Friction Callus Blisters',
    'Asymmetrical Spinal Muscular Tightness',
    'Court Recovery Rapid Ankle Instability',
  ],
  'Kho Kho': [
    'Pole Diving Tag Palm & Elbow Abrasions',
    'Knee Meniscus Twisting Strain on Turns',
    'Extreme Lactic Acid Exhaustion from Chasing',
    'Deep Soil Ankle Inversion Sprain',
    'Continuous Squat to Sprint Quad Burn',
    'Late Match Groin Adductor Cramping',
  ],
  'Throwball': [
    'Overhead Catching Wrist Hyperextension',
    'Jumping Throw Rotator Cuff Strain',
    'Net Landing Knee Shock Tenderness',
    'Scapular & Upper Back Muscle Spasms',
    'Finger Knuckle Capsule Swelling',
    'Biceps Tendon Overhead Release Ache',
  ],
};

// Robust retrieval helper that respects canonical names and user spellings
export function getSymptomsForCategory(categoryName: string): SymptomAssessmentItem[] {
  if (!categoryName) return domainSpecificSymptoms['Diabetes Mellitus'];

  // Direct hit
  if (domainSpecificSymptoms[categoryName]) {
    return domainSpecificSymptoms[categoryName];
  }

  // Normalized hit
  const normalized = normalizeConditionName(categoryName);
  if (domainSpecificSymptoms[normalized]) {
    return domainSpecificSymptoms[normalized];
  }

  // Fuzzy lookup
  const cleanName = categoryName.trim().toLowerCase();
  const keys = Object.keys(domainSpecificSymptoms);
  const found = keys.find(
    (k) => k.toLowerCase() === cleanName || k.toLowerCase().includes(cleanName) || cleanName.includes(k.toLowerCase())
  );
  if (found) {
    return domainSpecificSymptoms[found];
  }

  return domainSpecificSymptoms['Diabetes Mellitus'];
}
