import { SymptomAssessmentItem } from '../types';

export const domainSpecificSymptoms: Record<string, SymptomAssessmentItem[]> = {
  // Eating Disorders (Matching User's PDF 1 Page 2 & 3)
  'Eating Disorders': [
    { id: 'ed1', symptom: 'Restriction or skipped meals', duration: '3 months', severity: 'Severe' },
    { id: 'ed2', symptom: 'Binge episodes', duration: '2 months', severity: 'Moderate' },
    { id: 'ed3', symptom: 'Fear of weight gain', duration: '6 months', severity: 'Often' },
    { id: 'ed4', symptom: 'Eating in secret', duration: '2 months', severity: 'Moderate' },
    { id: 'ed5', symptom: 'Guilt after eating', duration: '4 months', severity: 'Often' },
    { id: 'ed6', symptom: 'Body image distress', duration: '6 months', severity: 'Severe' },
    { id: 'ed7', symptom: 'Compulsive exercise', duration: '1 month', severity: 'Mild' },
    { id: 'ed8', symptom: 'Dizziness / Lightheadedness', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ed9', symptom: 'Menstrual changes / Amenorrhea', duration: '4 months', severity: 'Severe' },
    { id: 'ed10', symptom: 'Social withdrawal during mealtimes', duration: '2 months', severity: 'Moderate' },
  ],

  // Diabetes Mellitus
  'Diabetes Mellitus': [
    { id: 'dm1', symptom: 'Frequent Urination (Polyuria)', duration: '3 weeks', severity: 'Moderate' },
    { id: 'dm2', symptom: 'Excessive Thirst (Polydipsia)', duration: '1 month', severity: 'Severe' },
    { id: 'dm3', symptom: 'Excessive Hunger (Polyphagia)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'dm4', symptom: 'Unexplained Weight Fluctuations', duration: '2 months', severity: 'Mild' },
    { id: 'dm5', symptom: 'Post-prandial Fatigue / Lethargy', duration: '6 weeks', severity: 'Moderate' },
    { id: 'dm6', symptom: 'Blurred or Fluctuating Vision', duration: 'Intermittent', severity: 'Mild' },
    { id: 'dm7', symptom: 'Slow-Healing Wounds / Cuts', duration: '1 month', severity: 'Mild' },
    { id: 'dm8', symptom: 'Peripheral Neuropathy (Foot Tingling)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'dm9', symptom: 'Acanthosis Nigricans (Dark neck folds)', duration: '1 year', severity: 'Moderate' },
    { id: 'dm10', symptom: 'Sugar Cravings after Meals', duration: 'Daily', severity: 'Often' },
  ],

  // Hypertension
  'Hypertension': [
    { id: 'ht1', symptom: 'Occipital Morning Headaches', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ht2', symptom: 'Dizziness or Vertigo Episodes', duration: '1 month', severity: 'Mild' },
    { id: 'ht3', symptom: 'Heart Palpitations during Stress', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ht4', symptom: 'Shortness of Breath on Exertion', duration: '2 months', severity: 'Mild' },
    { id: 'ht5', symptom: 'Epistaxis (Nosebleeds)', duration: 'Rare', severity: 'Mild' },
    { id: 'ht6', symptom: 'Visual Disturbances / Floaters', duration: 'Intermittent', severity: 'Mild' },
    { id: 'ht7', symptom: 'Ankle / Pedal Edema (Fluid retention)', duration: 'Evening', severity: 'Moderate' },
    { id: 'ht8', symptom: 'Sleep Apnea or Snoring', duration: '6 months', severity: 'Moderate' },
    { id: 'ht9', symptom: 'High Salt Cravings', duration: 'Chronic', severity: 'Often' },
    { id: 'ht10', symptom: 'Restlessness / Hyper-arousal', duration: '1 month', severity: 'Moderate' },
  ],

  // PCOS (Polycystic Ovarian Syndrome)
  'PCOS': [
    { id: 'pc1', symptom: 'Oligomenorrhea (Irregular cycles >35d)', duration: '8 months', severity: 'Severe' },
    { id: 'pc2', symptom: 'Hirsutism (Excess facial/body hair)', duration: '1 year', severity: 'Moderate' },
    { id: 'pc3', symptom: 'Cystic Acne along Jawline', duration: '4 months', severity: 'Moderate' },
    { id: 'pc4', symptom: 'Androgenic Alopecia (Crown hair thinning)', duration: '6 months', severity: 'Mild' },
    { id: 'pc5', symptom: 'Central / Visceral Adiposity', duration: '1 year', severity: 'Moderate' },
    { id: 'pc6', symptom: 'Intense Sugar / Carb Cravings', duration: 'Daily 4 PM', severity: 'Often' },
    { id: 'pc7', symptom: 'Mood Swings & Premenstrual Dysphoria', duration: 'Monthly', severity: 'Severe' },
    { id: 'pc8', symptom: 'Extreme Fatigue after Carbohydrates', duration: '3 months', severity: 'Moderate' },
    { id: 'pc9', symptom: 'Pelvic Aching / Ovulatory Pain', duration: 'Cyclic', severity: 'Moderate' },
    { id: 'pc10', symptom: 'Difficulty Losing Weight despite Deficit', duration: '1 year', severity: 'Severe' },
  ],

  // Thyroid Conditions (Hypothyroidism / Hashimoto's)
  'Thyroid Conditions': [
    { id: 'th1', symptom: 'Persistent Fatigue & Brain Fog', duration: '6 months', severity: 'Severe' },
    { id: 'th2', symptom: 'Cold Intolerance (Chilly hands/feet)', duration: '4 months', severity: 'Moderate' },
    { id: 'th3', symptom: 'Unexplained Weight Gain with Low Appetite', duration: '5 months', severity: 'Severe' },
    { id: 'th4', symptom: 'Dry, Coarse Skin & Brittle Nails', duration: '3 months', severity: 'Moderate' },
    { id: 'th5', symptom: 'Chronic Constipation (<3x / week)', duration: '6 months', severity: 'Moderate' },
    { id: 'th6', symptom: 'Diffuse Hair Shedding / Outer Eyebrow Loss', duration: '4 months', severity: 'Moderate' },
    { id: 'th7', symptom: 'Muscle Weakness & Joint Aches', duration: '2 months', severity: 'Mild' },
    { id: 'th8', symptom: 'Puffy Face / Periorbital Edema', duration: 'Morning', severity: 'Moderate' },
    { id: 'th9', symptom: 'Depressed Mood / Apathy', duration: '3 months', severity: 'Moderate' },
    { id: 'th10', symptom: 'Menorrhagia (Heavy menstrual bleeding)', duration: '4 cycles', severity: 'Moderate' },
  ],

  // Gastrointestinal Diseases (GERD, IBS, SIBO, IBD)
  'Gastrointestinal Diseases': [
    { id: 'gi1', symptom: 'Post-prandial Abdominal Bloating / Distension', duration: 'Daily', severity: 'Severe' },
    { id: 'gi2', symptom: 'Acid Reflux / Retrosternal Heartburn', duration: '4 nights/wk', severity: 'Moderate' },
    { id: 'gi3', symptom: 'Alternating Bowel Habits (Diarrhea/Constipation)', duration: '3 months', severity: 'Moderate' },
    { id: 'gi4', symptom: 'Early Satiety / Stomach Fullness', duration: '1 month', severity: 'Moderate' },
    { id: 'gi5', symptom: 'Excessive Belching or Foul Flatulence', duration: 'Daily', severity: 'Often' },
    { id: 'gi6', symptom: 'Abdominal Cramping Relieved by Defecation', duration: '2 months', severity: 'Moderate' },
    { id: 'gi7', symptom: 'Mucus in Stool / Tenesmus', duration: '3 weeks', severity: 'Mild' },
    { id: 'gi8', symptom: 'Food Intolerance (FODMAPs / Dairy / Gluten)', duration: '6 months', severity: 'Severe' },
    { id: 'gi9', symptom: 'Nausea after Fatty or Spicy Meals', duration: 'Weekly', severity: 'Moderate' },
    { id: 'gi10', symptom: 'Gurgling / Borborygmi Sounds in Gut', duration: 'Post-meal', severity: 'Often' },
  ],

  // Cardiovascular Diseases
  'Cardiovascular Diseases': [
    { id: 'cv1', symptom: 'Exertional Chest Tightness (Angina)', duration: 'Intermittent', severity: 'Moderate' },
    { id: 'cv2', symptom: 'Shortness of Breath climbing stairs', duration: '2 months', severity: 'Moderate' },
    { id: 'cv3', symptom: 'Orthopnea (Difficulty lying flat)', duration: '1 month', severity: 'Mild' },
    { id: 'cv4', symptom: 'Irregular Heartbeat / Palpitations', duration: '2 weeks', severity: 'Moderate' },
    { id: 'cv5', symptom: 'Bilateral Leg Swelling / Pitting Edema', duration: '3 weeks', severity: 'Moderate' },
    { id: 'cv6', symptom: 'Cold Clammy Extremities / Cyanosis', duration: '1 month', severity: 'Mild' },
    { id: 'cv7', symptom: 'Excessive General Exhaustion', duration: '2 months', severity: 'Moderate' },
    { id: 'cv8', symptom: 'Dizziness or Near-Syncope upon standing', duration: 'Intermittent', severity: 'Mild' },
    { id: 'cv9', symptom: 'Claudication (Calf cramping when walking)', duration: '2 months', severity: 'Mild' },
    { id: 'cv10', symptom: 'Sleep Disruption due to Breathlessness', duration: '2 weeks', severity: 'Moderate' },
  ],

  // Kidney Diseases (CKD / Renal)
  'Kidney Diseases': [
    { id: 'kd1', symptom: 'Periorbital Morning Puffiness', duration: '1 month', severity: 'Moderate' },
    { id: 'kd2', symptom: 'Foamy / Frothy Urine (Proteinuria)', duration: '2 months', severity: 'Severe' },
    { id: 'kd3', symptom: 'Nocturia (Waking >2x to urinate at night)', duration: '3 months', severity: 'Moderate' },
    { id: 'kd4', symptom: 'Metallic Taste in Mouth / Dysgeusia', duration: '3 weeks', severity: 'Mild' },
    { id: 'kd5', symptom: 'Uremic Pruritus (Generalized itchy skin)', duration: '1 month', severity: 'Moderate' },
    { id: 'kd6', symptom: 'Decreased Urine Output (Oliguria)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'kd7', symptom: 'Loss of Appetite & Morning Nausea', duration: '1 month', severity: 'Moderate' },
    { id: 'kd8', symptom: 'Muscle Twitching or Cramps (Electrolyte shift)', duration: 'Nightly', severity: 'Moderate' },
    { id: 'kd9', symptom: 'Severe Unexplained Anemic Fatigue', duration: '3 months', severity: 'Severe' },
    { id: 'kd10', symptom: 'Flank or Lower Back Dull Aching', duration: '1 month', severity: 'Mild' },
  ],

  // Liver Diseases (NAFLD / Cirrhosis)
  'Liver Diseases': [
    { id: 'ld1', symptom: 'Right Upper Quadrant Heaviness / Fullness', duration: '2 months', severity: 'Moderate' },
    { id: 'ld2', symptom: 'Chronic Fatigue & Daytime Somnolence', duration: '4 months', severity: 'Severe' },
    { id: 'ld3', symptom: 'Subtle Scleral Icterus (Yellow eyes)', duration: '1 week', severity: 'Mild' },
    { id: 'ld4', symptom: 'Dark Amber Urine', duration: '2 weeks', severity: 'Moderate' },
    { id: 'ld5', symptom: 'Pale or Clay-Colored Stools', duration: 'Intermittent', severity: 'Mild' },
    { id: 'ld6', symptom: 'Easy Bruising / Petechiae', duration: '1 month', severity: 'Mild' },
    { id: 'ld7', symptom: 'Intolerance to Greasy or Fried Foods', duration: '3 months', severity: 'Severe' },
    { id: 'ld8', symptom: 'Pruritus / Itchiness worse at night', duration: '1 month', severity: 'Moderate' },
    { id: 'ld9', symptom: 'Abdominal Distension / Early Ascites', duration: '3 weeks', severity: 'Moderate' },
    { id: 'ld10', symptom: 'Spider Angiomas / Palmar Erythema', duration: '2 months', severity: 'Mild' },
  ],

  // Sports Nutrition / Performance
  'Sports Nutrition': [
    { id: 'sn1', symptom: 'Delayed Muscle Recovery (>48-72h DOMS)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'sn2', symptom: 'Intra-Workout Energy Crash / Bonking', duration: 'Past 3 sessions', severity: 'Severe' },
    { id: 'sn3', symptom: 'Frequent Muscle Cramping during Training', duration: 'Mid-session', severity: 'Moderate' },
    { id: 'sn4', symptom: 'Elevated Morning Resting Heart Rate', duration: '1 week', severity: 'Mild' },
    { id: 'sn5', symptom: 'Post-Exercise Gastrointestinal Distress', duration: 'Long runs', severity: 'Moderate' },
    { id: 'sn6', symptom: 'Poor Sleep Quality despite Physical Fatigue', duration: '2 weeks', severity: 'Moderate' },
    { id: 'sn7', symptom: 'Recurrent Minor Soft Tissue Strains', duration: '2 months', severity: 'Moderate' },
    { id: 'sn8', symptom: 'Dehydration / Dark Morning Urine (>1.020 SG)', duration: 'Frequent', severity: 'Moderate' },
    { id: 'sn9', symptom: 'Inability to hit Peak Wattage / Pace', duration: '1 month', severity: 'Moderate' },
    { id: 'sn10', symptom: 'Persistent Soreness & Joint Inflammation', duration: '3 weeks', severity: 'Mild' },
  ],

  // Weight Loss / Fat Loss
  'Weight Loss': [
    { id: 'wl1', symptom: 'Weight Loss Plateau (>4 weeks stalled)', duration: '1 month', severity: 'Severe' },
    { id: 'wl2', symptom: 'Late-Night Emotional or Boredom Eating', duration: 'Daily', severity: 'Often' },
    { id: 'wl3', symptom: 'Metabolic Adaptation / Feeling Constantly Cold', duration: '2 months', severity: 'Moderate' },
    { id: 'wl4', symptom: 'High Hunger Hormones (Ghrelin spikes)', duration: 'Evening', severity: 'Severe' },
    { id: 'wl5', symptom: 'Low Daily Step Count / NEAT Reduction', duration: '3 weeks', severity: 'Moderate' },
    { id: 'wl6', symptom: 'Water Weight Fluctuations (>2kg overnight)', duration: 'Post-cheat', severity: 'Moderate' },
    { id: 'wl7', symptom: 'Brain Fog during Caloric Deficit', duration: 'Morning', severity: 'Moderate' },
    { id: 'wl8', symptom: 'Poor Satiety from Low-Volume Foods', duration: 'Daily', severity: 'Often' },
    { id: 'wl9', symptom: 'Carbohydrate Binges on Weekends', duration: 'Weekly', severity: 'Moderate' },
    { id: 'wl10', symptom: 'Muscle Loss rather than Pure Fat Reduction', duration: 'Last scan', severity: 'Moderate' },
  ],
  // General Fitness / Body Recomposition
  'General Fitness': [
    { id: 'gf1', symptom: 'Lethargy during daily activities', duration: '1 month', severity: 'Mild' },
    { id: 'gf2', symptom: 'Lack of muscle tone / Weakness', duration: '3 months', severity: 'Moderate' },
    { id: 'gf3', symptom: 'Stiff joints or poor flexibility', duration: '2 months', severity: 'Mild' },
    { id: 'gf4', symptom: 'Low stamina when climbing stairs', duration: '1 month', severity: 'Moderate' },
    { id: 'gf5', symptom: 'Poor sleep quality', duration: '3 weeks', severity: 'Moderate' },
    { id: 'gf6', symptom: 'Sugar cravings in the evening', duration: 'Daily', severity: 'Often' },
    { id: 'gf7', symptom: 'Frequent minor illnesses / Low immunity', duration: '2 months', severity: 'Mild' },
    { id: 'gf8', symptom: 'Difficulty maintaining weight', duration: '6 months', severity: 'Moderate' },
    { id: 'gf9', symptom: 'Slow recovery from mild exercise', duration: '2 weeks', severity: 'Moderate' },
    { id: 'gf10', symptom: 'Low energy mid-afternoon', duration: 'Daily', severity: 'Often' },
  ],

  // General Performance
  'General Performance': [
    { id: 'gp1', symptom: 'Early onset of fatigue during training', duration: '2 weeks', severity: 'Moderate' },
    { id: 'gp2', symptom: 'Muscle cramping', duration: 'Mid-session', severity: 'Moderate' },
    { id: 'gp3', symptom: 'Poor hydration / excessive thirst', duration: 'Frequent', severity: 'Moderate' },
    { id: 'gp4', symptom: 'Slow heart rate recovery post-exercise', duration: '1 month', severity: 'Mild' },
    { id: 'gp5', symptom: 'Lack of explosive power / strength stall', duration: '3 weeks', severity: 'Moderate' },
    { id: 'gp6', symptom: 'Mental fog during competition', duration: 'Intermittent', severity: 'Mild' },
    { id: 'gp7', symptom: 'Delayed onset muscle soreness (DOMS) > 48h', duration: 'Frequent', severity: 'Moderate' },
    { id: 'gp8', symptom: 'GI distress during high intensity', duration: '1 month', severity: 'Severe' },
    { id: 'gp9', symptom: 'Loss of appetite post-training', duration: '2 weeks', severity: 'Mild' },
    { id: 'gp10', symptom: 'Frequent minor injuries', duration: '3 months', severity: 'Moderate' },
  ],

  // General Disorders
  'General Disorders': [
    { id: 'gd1', symptom: 'Unexplained fatigue or weakness', duration: '1 month', severity: 'Moderate' },
    { id: 'gd2', symptom: 'Digestive discomfort / bloating', duration: 'Daily', severity: 'Often' },
    { id: 'gd3', symptom: 'Skin rashes or persistent acne', duration: '3 weeks', severity: 'Mild' },
    { id: 'gd4', symptom: 'Irregular bowel movements', duration: '2 months', severity: 'Moderate' },
    { id: 'gd5', symptom: 'Frequent mood swings', duration: 'Weekly', severity: 'Moderate' },
    { id: 'gd6', symptom: 'Food sensitivities / allergic reactions', duration: 'Intermittent', severity: 'Severe' },
    { id: 'gd7', symptom: 'Brain fog and poor concentration', duration: '2 weeks', severity: 'Moderate' },
    { id: 'gd8', symptom: 'Sleep disturbances', duration: '1 month', severity: 'Mild' },
    { id: 'gd9', symptom: 'Joint aches and stiffness', duration: '3 months', severity: 'Moderate' },
    { id: 'gd10', symptom: 'Unexplained weight changes', duration: '2 months', severity: 'Moderate' },
  ],

  // General Diseases
  'General Diseases': [
    { id: 'gdz1', symptom: 'Chronic pain or inflammation', duration: '3 months', severity: 'Moderate' },
    { id: 'gdz2', symptom: 'Persistent low-grade fever', duration: '1 week', severity: 'Mild' },
    { id: 'gdz3', symptom: 'Chronic fatigue syndrome', duration: '6 months', severity: 'Severe' },
    { id: 'gdz4', symptom: 'Shortness of breath / respiratory issues', duration: '1 month', severity: 'Moderate' },
    { id: 'gdz5', symptom: 'Neurological symptoms (tingling, numbness)', duration: '2 weeks', severity: 'Moderate' },
    { id: 'gdz6', symptom: 'Lymph node swelling', duration: '1 month', severity: 'Mild' },
    { id: 'gdz7', symptom: 'Frequent infections', duration: '3 months', severity: 'Moderate' },
    { id: 'gdz8', symptom: 'Unexplained severe weight loss', duration: '2 months', severity: 'Severe' },
    { id: 'gdz9', symptom: 'Chronic skin ulcerations', duration: '1 month', severity: 'Moderate' },
    { id: 'gdz10', symptom: 'Dizziness or frequent fainting', duration: 'Intermittent', severity: 'Severe' },
  ],
};

// Helper to get condition-specific symptoms
export function getSymptomsForCategory(categoryName: string): SymptomAssessmentItem[] {
  if (domainSpecificSymptoms[categoryName]) {
    return domainSpecificSymptoms[categoryName];
  }

  // Fallback matching
  const lower = categoryName.toLowerCase();
  
  // Specific fallbacks
  if (lower.includes('eating') || lower.includes('anorexia') || lower.includes('bulimia')) {
    return domainSpecificSymptoms['Eating Disorders'];
  }
  if (lower.includes('diabet') || lower.includes('sugar') || lower.includes('glycem') || lower.includes('endocrine')) {
    return domainSpecificSymptoms['Diabetes Mellitus'];
  }
  if (lower.includes('hyperten') || lower.includes('blood pressure') || lower.includes('bp')) {
    return domainSpecificSymptoms['Hypertension'];
  }
  if (lower.includes('pcos') || lower.includes('ovary') || lower.includes('hormon')) {
    return domainSpecificSymptoms['PCOS'];
  }
  if (lower.includes('thyroid') || lower.includes('hypo') || lower.includes('hyperthy')) {
    return domainSpecificSymptoms['Thyroid Conditions'];
  }
  if (lower.includes('gastro') || lower.includes('gut') || lower.includes('ibs') || lower.includes('digest')) {
    return domainSpecificSymptoms['Gastrointestinal Diseases'];
  }
  if (lower.includes('cardio') || lower.includes('heart')) {
    return domainSpecificSymptoms['Cardiovascular Diseases'];
  }
  if (lower.includes('kidney') || lower.includes('renal')) {
    return domainSpecificSymptoms['Kidney Diseases'];
  }
  if (lower.includes('liver') || lower.includes('hepatic')) {
    return domainSpecificSymptoms['Liver Diseases'];
  }
  if (lower.includes('sport') || lower.includes('performance') || lower.includes('endurance') || lower.includes('strength') || lower.includes('hydration') || lower.includes('competition')) {
    return domainSpecificSymptoms['Sports Nutrition'];
  }
  if (lower.includes('weight') || lower.includes('fat loss') || lower.includes('obesity') || lower.includes('gain') || lower.includes('recomposition')) {
    return domainSpecificSymptoms['Weight Loss'];
  }
  
  // Broad Domain Fallbacks
  if (lower.includes('disease') || lower.includes('cancer') || lower.includes('respiratory') || lower.includes('neurological')) {
    return domainSpecificSymptoms['General Diseases'];
  }
  if (lower.includes('disorder') || lower.includes('deficiency') || lower.includes('intolerance') || lower.includes('allergy') || lower.includes('malnutrition')) {
    return domainSpecificSymptoms['General Disorders'];
  }
  if (lower.includes('fitness') || lower.includes('lifestyle')) {
    return domainSpecificSymptoms['General Fitness'];
  }
  if (lower.includes('nutrition') || lower.includes('workout')) {
    return domainSpecificSymptoms['General Performance'];
  }

  // Absolute fallback
  return domainSpecificSymptoms['General Diseases'];
}
