import {
  DiseaseDomainClinicalProfile,
  DynamicIngredientItem,
  DynamicAyurSiddhaHerb,
  DynamicTherapeuticRecipe,
} from './adaptiveClinicalGuidelinesData';
import { DIABETES_CLINICAL_PROFILE } from './domainAdaptiveGuidelines';
import { HYPERTENSION_CLINICAL_PROFILE } from './otherDomainProfiles';

// Additional synthesized domain profiles for comprehensive clinical coverage
export const PCOS_CLINICAL_PROFILE: DiseaseDomainClinicalProfile = {
  domainKey: 'PCOS',
  displayName: 'PCOS & Endocrine Ovulatory Reset Protocol',
  pathologyTagline: 'Reversing hyperandrogenism, visceral insulin resistance, restoring LH:FSH ratio & clearing follicular arrest',
  primaryBiomarkers: ['LH:FSH Ratio > 2:1', 'Free Testosterone > 2.5 pg/mL', 'Fasting Insulin > 12 µIU/mL', 'DHEA-S Elevated'],
  macroDistribution: { carbs: 40, protein: 25, fat: 35 },
  ayurvedicDoshaFocus: 'Vata-Kapha Shamaka & Artava Janana (Stimulates healthy ovarian circulation & hormonal clearance)',
  ingredients: [
    ...DIABETES_CLINICAL_PROFILE.ingredients.map((item) => ({
      ...item,
      clinicalRationale: item.clinicalRationale.includes('insulin')
        ? item.clinicalRationale + ' Lowers thecal androgen secretion in polycystic ovaries.'
        : item.clinicalRationale,
      biomarkerTarget: 'Free Testosterone & Insulin Resistance',
    })),
  ],
  ayurSiddhaHerbs: [
    {
      id: 'pcos-ash-1',
      name: 'Thannirvittan Kizhangu / Shatavari (Queen of Herbs)',
      traditionalName: 'Shatavari',
      botanicalName: 'Asparagus racemosus',
      doshaEffect: 'Pitta & Vata Shamaka; Supreme Artavajanana Rasayana',
      therapeuticAction: 'Steroidal saponins (shatavarins) modulate estrogen receptor binding, stimulate follicular maturation, and normalize the LH:FSH ratio.',
      clinicalIndications: ['Irregular menstrual cycles', 'Oligomenorrhea', 'Anovulation in PCOS', 'Endocrine fatigue'],
      recommendedDose: '3 to 5 grams pure root powder with warm almond milk or water',
      timing: 'Twice daily post meals',
      preparationMethod: 'Simmer 1 tsp powder in 150ml milk/water for 5 minutes; drink warm.',
      contraindications: 'Avoid in acute estrogen-sensitive malignancies.',
      biomarkerTarget: 'LH:FSH Ratio & Follicular Maturation',
    },
    {
      id: 'pcos-ash-2',
      name: 'Asokamaram / Ashoka Bark',
      traditionalName: 'Ashoka',
      botanicalName: 'Saraca asoca',
      doshaEffect: 'Pitta-Kapha Shamaka; Kashaya Rasa; Uterine rejuvenator',
      therapeuticAction: 'Ketosterol and flavonoids tonify the myometrium, stimulate ovarian tissue healing, and regulate menstrual flow.',
      clinicalIndications: ['Heavy or delayed bleeding', 'Uterine cramping', 'Polycystic ovarian morphology'],
      recommendedDose: '30ml Kashayam (decoction)',
      timing: 'Twice daily before meals',
      preparationMethod: 'Boil 10g crushed bark in 200ml water until reduced to 50ml; strain and drink.',
      contraindications: 'Safe for menstrual regulation.',
      biomarkerTarget: 'Endometrial Receptivity & Ovarian Morphology',
    },
    {
      id: 'pcos-ash-3',
      name: 'Kachnar Guggulu (Bauhinia + Commiphora)',
      traditionalName: 'Kanchanara Guggulu',
      botanicalName: 'Bauhinia variegata + Commiphora mukul',
      doshaEffect: 'Kapha Shamaka; Granthi Bhedana (Dissolves cystic swellings)',
      therapeuticAction: 'Downregulates vascular endothelial growth factor (VEGF) hyper-permeability in ovarian stroma, shrinking subcapsular cysts.',
      clinicalIndications: ['Multiple ovarian cysts', 'Cervical lymphadenopathy', 'Thyroid nodules in PCOS'],
      recommendedDose: '2 tablets (500mg each) with warm water',
      timing: 'After lunch and dinner',
      preparationMethod: 'Consume with warm water or ginger tea.',
      contraindications: 'Avoid during active pregnancy.',
      biomarkerTarget: 'Subcapsular Ovarian Cysts & VEGF',
    },
    {
      id: 'pcos-ash-4',
      name: 'Spearmint Leaf Infusion (Pudina)',
      traditionalName: 'Spicata pudina',
      botanicalName: 'Mentha spicata',
      doshaEffect: 'Pitta & Vata balancing; Deepana',
      therapeuticAction: 'Downregulates 5-alpha reductase enzyme, directly lowering circulating free testosterone and reversing hirsutism.',
      clinicalIndications: ['Facial hirsutism', 'Hormonal cystic acne', 'Elevated androgens'],
      recommendedDose: '2 cups brewed leaf tea daily',
      timing: 'Morning 10:00 AM and Evening 4:00 PM',
      preparationMethod: 'Steep 1 tsp organic spearmint leaves in 200ml boiling water for 6 minutes.',
      contraindications: 'Safe; caution in active GERD.',
      biomarkerTarget: 'Free Testosterone & 5-Alpha Reductase',
    },
    {
      id: 'pcos-ash-5',
      name: 'Dalchini (Ceylon Cinnamon)',
      traditionalName: 'Twak',
      botanicalName: 'Cinnamomum verum',
      doshaEffect: 'Kapha & Vata Shamaka; Deepana-Pachana',
      therapeuticAction: 'Proanthocyanidins restore peripheral insulin signaling in granulosa cells, improving regular ovulation.',
      clinicalIndications: ['Insulin-resistant PCOS', 'Acanthosis nigricans', 'Sugar cravings'],
      recommendedDose: '1/2 tsp freshly ground powder',
      timing: 'With morning tea or sprinkled over breakfast',
      preparationMethod: 'Mix with warm water or almond milk.',
      contraindications: 'Use true Ceylon cinnamon, not Cassia.',
      biomarkerTarget: 'Fasting Insulin & Ovarian Granulosa Cells',
    },
    ...DIABETES_CLINICAL_PROFILE.ayurSiddhaHerbs.slice(5),
  ],
  recipes: {
    breakfast: DIABETES_CLINICAL_PROFILE.recipes.breakfast.map((r, i) => ({
      ...r,
      id: `pcos-bf-${i + 1}`,
      clinicalIndications: ['PCOS', 'Insulin Resistance', 'Hyperandrogenism', 'Delayed Cycles'],
      biomarkerTargets: ['LH:FSH Normalization', 'Insulin Sensitivity', 'Anti-Androgenic'],
      clinicalRationale: r.clinicalRationale + ' Specifically reduces ovarian thecal cell androgen hypersecretion.',
    })),
    lunch: DIABETES_CLINICAL_PROFILE.recipes.lunch.map((r, i) => ({
      ...r,
      id: `pcos-ln-${i + 1}`,
      clinicalIndications: ['PCOS', 'Visceral Adiposity', 'Metabolic Syndrome'],
      biomarkerTargets: ['Ovarian Stroma Decongestion', 'Zero Glycemic Surges'],
      clinicalRationale: r.clinicalRationale + ' Restores balanced ovulatory cycle timing.',
    })),
    dinner: DIABETES_CLINICAL_PROFILE.recipes.dinner.map((r, i) => ({
      ...r,
      id: `pcos-dn-${i + 1}`,
      clinicalIndications: ['PCOS', 'Evening Sugar Cravings', 'Endocrine Stress'],
      biomarkerTargets: ['Cortisol Downregulation', 'Overnight Glycemic Balance'],
    })),
    snacks: DIABETES_CLINICAL_PROFILE.recipes.snacks.map((r, i) => ({
      ...r,
      id: `pcos-sn-${i + 1}`,
      clinicalIndications: ['PCOS', 'Hormonal Acne', 'Facial Hair Growth'],
      biomarkerTargets: ['Anti-5-Alpha Reductase', 'Zero Sugar Satiety'],
    })),
  },
};

// -------------------------------------------------------------
// 3. LIVER DISEASES & HEPATIC STEATOSIS (Fatty Liver Protocol)
// -------------------------------------------------------------
export const LIVER_CLINICAL_PROFILE: DiseaseDomainClinicalProfile = {
  domainKey: 'Liver Diseases',
  displayName: 'Non-Alcoholic Fatty Liver (NAFLD) & Hepatic Detox Protocol',
  pathologyTagline: 'Resolving intrahepatic triglyceride accumulation, reversing elevated ALT/AST, stimulating phase I/II bile excretion & restoring mitochondrial beta-oxidation',
  primaryBiomarkers: ['SGPT / ALT > 35 U/L', 'SGOT / AST > 35 U/L', 'High Serum Triglycerides > 180 mg/dL', 'Ultrasound Grade 1/2 Steatosis'],
  macroDistribution: { carbs: 45, protein: 25, fat: 30 },
  ayurvedicDoshaFocus: 'Pitta Shamaka & Yakrit Uttejaka (Hepato-protective & bile decongestion)',
  ingredients: [
    ...DIABETES_CLINICAL_PROFILE.ingredients.map((item) => ({
      ...item,
      clinicalRationale: item.clinicalRationale + ' Facilitates hepatic fat export via VLDL clearance.',
      biomarkerTarget: 'SGPT / ALT Reduction & Hepatic Triglycerides',
    })),
  ],
  ayurSiddhaHerbs: [
    {
      id: 'liv-ash-1',
      name: 'Keezhanelli / Bhumiamalaki (Supreme Liver Healer)',
      traditionalName: 'Bhumiamalaki',
      botanicalName: 'Phyllanthus niruri',
      doshaEffect: 'Pitta Shamaka; Tikta-Kashaya; Supreme Yakrit-Plihaghna',
      therapeuticAction: 'Phyllanthin and hypophyllanthin protect hepatocytes against lipid peroxidation, normalize elevated ALT/AST enzymes, and reverse steatosis.',
      clinicalIndications: ['Grade 1 & Grade 2 Fatty Liver', 'Elevated SGPT/SGOT', 'Hepatomegaly', 'Sluggish bile flow'],
      recommendedDose: '20ml fresh leaf juice or 3g leaf churna',
      timing: 'First thing in the morning on an empty stomach with buttermilk',
      preparationMethod: 'Grind fresh Keezhanelli leaves into a smooth paste; mix 1 tablespoon in 100ml fresh churned buttermilk.',
      contraindications: 'Safe for daily liver rejuvenation.',
      biomarkerTarget: 'SGPT / ALT > 40 U/L & Hepatic Steatosis',
    },
    {
      id: 'liv-ash-2',
      name: 'Nilavembu / Kalmegh (King of Bitters)',
      traditionalName: 'Bhunimba',
      botanicalName: 'Andrographis paniculata',
      doshaEffect: 'Pitta & Kapha Shamaka; Intense bitter Tikta rasa; Deepana-Pachana',
      therapeuticAction: 'Andrographolide stimulates bile acid flow (choleretic), accelerates phase II glucuronidation, and activates hepatic AMPK.',
      clinicalIndications: ['Sluggish liver', 'Elevated triglycerides', 'Toxic liver congestion', 'Chronic indigestion'],
      recommendedDose: '30ml Kashayam (decoction) or 1g extract',
      timing: 'Twice daily before meals',
      preparationMethod: 'Boil 5g dried powder in 200ml water until reduced to 50ml; strain and drink warm.',
      contraindications: 'Avoid in pregnancy; use in structured 3-week cycles.',
      biomarkerTarget: 'Phase II Liver Detox & Triglyceride Clearance',
    },
    {
      id: 'liv-ash-3',
      name: 'Katuki / Kutki (Picrorhiza)',
      traditionalName: 'Katuki',
      botanicalName: 'Picrorhiza kurroa',
      doshaEffect: 'Pitta-Kapha Shamaka; Bhedana (gentle purgative for stagnant bile)',
      therapeuticAction: 'Picroside I and II protect hepatocellular membrane integrity, promote liver regeneration, and suppress hepatic fibrogenesis.',
      clinicalIndications: ['Chronic fatty liver', 'Elevated bilirubin', 'Jaundice history', 'Sluggish metabolism'],
      recommendedDose: '500mg to 1g root powder with honey/warm water',
      timing: 'Morning and evening after meals',
      preparationMethod: 'Mix 1/2 tsp Kutki churna in warm water; drink before food.',
      contraindications: 'Avoid in acute loose stools/diarrhea.',
      biomarkerTarget: 'Bilirubin, ALT & Hepatic Fibrosis Markers',
    },
    {
      id: 'liv-ash-4',
      name: 'Manjal (Turmeric / Curcumin + Piperine)',
      traditionalName: 'Haridra',
      botanicalName: 'Curcuma longa',
      doshaEffect: 'Kapha-Pitta Shamaka; Yakrit Shodhaka',
      therapeuticAction: 'Curcumin downregulates hepatic lipogenesis genes (SREBP-1c) and upregulates fatty acid beta-oxidation via PPAR-alpha.',
      clinicalIndications: ['Non-Alcoholic Fatty Liver (NAFLD)', 'Elevated hs-CRP', 'Visceral adiposity'],
      recommendedDose: '1/2 tsp pure turmeric + pinch black pepper',
      timing: 'Morning with healthy fats (ghee or coconut oil)',
      preparationMethod: 'Warm with 1 tsp cold-pressed oil or warm almond milk.',
      contraindications: 'Safe for daily use.',
      biomarkerTarget: 'SREBP-1c Suppression & Hepatic Lipogenesis',
    },
    ...DIABETES_CLINICAL_PROFILE.ayurSiddhaHerbs.slice(4),
  ],
  recipes: {
    breakfast: DIABETES_CLINICAL_PROFILE.recipes.breakfast.map((r, i) => ({
      ...r,
      id: `liv-bf-${i + 1}`,
      clinicalIndications: ['Fatty Liver (NAFLD)', 'Elevated ALT/AST', 'Metabolic Syndrome'],
      biomarkerTargets: ['ALT < 30 U/L Target', 'Intrahepatic Lipid Clearance'],
      clinicalRationale: r.clinicalRationale + ' Accelerates intrahepatic triglyceride export via VLDL and prevents lipid peroxidation.',
    })),
    lunch: DIABETES_CLINICAL_PROFILE.recipes.lunch.map((r, i) => ({
      ...r,
      id: `liv-ln-${i + 1}`,
      clinicalIndications: ['Fatty Liver', 'High Triglycerides', 'Visceral Adiposity'],
      biomarkerTargets: ['Hepatic Mitochondrial Beta-Oxidation', 'Zero Fructose Load'],
      clinicalRationale: r.clinicalRationale + ' Provides choline, sulfur, and methionine for phase II liver detoxification.',
    })),
    dinner: DIABETES_CLINICAL_PROFILE.recipes.dinner.map((r, i) => ({
      ...r,
      id: `liv-dn-${i + 1}`,
      clinicalIndications: ['Hepatic Rest', 'Nocturnal Cleansing', 'Fatty Liver'],
      biomarkerTargets: ['Zero Nocturnal Lipid Accumulation', 'Glutathione Synthesis'],
    })),
    snacks: DIABETES_CLINICAL_PROFILE.recipes.snacks.map((r, i) => ({
      ...r,
      id: `liv-sn-${i + 1}`,
      clinicalIndications: ['Fatty Liver', 'Elevated Triglycerides', 'Sluggish Digestion'],
      biomarkerTargets: ['Bile Acid Secretion', 'Hepatic Antioxidant Defense'],
    })),
  },
};

// -------------------------------------------------------------
// 4. CHRONIC KIDNEY DISEASE & RENAL PROTECTION (Renal Protocol)
// -------------------------------------------------------------
export const KIDNEY_CLINICAL_PROFILE: DiseaseDomainClinicalProfile = {
  domainKey: 'Kidney Diseases',
  displayName: 'Renal-Friendly Nephroprotective Protocol',
  pathologyTagline: 'Preserving glomerular filtration rate (GFR), controlling serum phosphorus & potassium, moderating nitrogenous waste & minimizing proteinuria',
  primaryBiomarkers: ['eGFR < 60 mL/min', 'Serum Creatinine > 1.2 mg/dL', 'Blood Urea Nitrogen (BUN) > 20 mg/dL', 'Urine Microalbuminuria'],
  macroDistribution: { carbs: 60, protein: 12, fat: 28 }, // Renal protein moderation (0.6 - 0.8 g/kg)
  ayurvedicDoshaFocus: 'Vata-Pitta Shamaka & Mutrala-Vrukka Rasayana (Soothes renal parenchyma & clears micro-obstructions)',
  ingredients: [
    {
      id: 'kid-cer-1',
      name: 'Unpolished Sona Masoori / Steamed Parboiled Rice',
      category: 'Cereals & Millets',
      glycemicIndex: 'Medium',
      status: 'Recommended',
      portion: '1 cup cooked (150g)',
      therapeuticMechanism: 'Naturally low in phosphorus and potassium compared to whole millets.',
      clinicalRationale: 'Provides clean, easily metabolized calories without placing excess nitrogenous filtration burden on renal glomeruli.',
      contraindications: 'Coordinate with glycemic status.',
      biomarkerTarget: 'Low Phosphorus & Low Potassium',
    },
    {
      id: 'kid-veg-1',
      name: 'Leached Bottle Gourd & Ridge Gourd',
      category: 'Vegetables & Gourds',
      glycemicIndex: 'Low',
      status: 'Recommended',
      portion: '1.5 cups boiled & water drained (leached)',
      therapeuticMechanism: 'Boiling vegetables in excess water and discarding water removes 50–70% of soluble potassium.',
      clinicalRationale: 'Prevents hyperkalemia while providing vital dietary fiber and hydration.',
      contraindications: 'Always discard boiling water before final seasoning.',
      biomarkerTarget: 'Serum Potassium < 5.0 mEq/L',
    },
    {
      id: 'kid-frt-1',
      name: 'Red Apples, Guava & Papaya (Low Potassium Fruits)',
      category: 'Fruits',
      glycemicIndex: 'Low',
      status: 'Recommended',
      portion: '1 small peeled apple or 1/2 cup papaya',
      therapeuticMechanism: 'Low potassium load (<150mg/serving) with pectin soluble fiber.',
      clinicalRationale: 'Prevents cardiovascular arrhythmias caused by hyperkalemia in renal impairment.',
      contraindications: 'Avoid bananas, citrus juices, kiwi, and tender coconut water.',
      biomarkerTarget: 'Potassium Control & Pectin Satiety',
    },
    {
      id: 'kid-fat-1',
      name: 'Extra Virgin Cold-Pressed Olive Oil & Coconut Oil',
      category: 'Healthy Fats & Cold-Pressed Oils',
      glycemicIndex: 'Zero',
      status: 'Recommended',
      portion: '2 teaspoons daily',
      therapeuticMechanism: 'Pure lipid calories generating zero nitrogenous waste or urea.',
      clinicalRationale: 'Supplies essential energy without taxing failing nephrons.',
      contraindications: 'Keep within daily total caloric target.',
      biomarkerTarget: 'Zero Nitrogenous Filtration Load',
    },
  ],
  ayurSiddhaHerbs: [
    {
      id: 'kid-ash-1',
      name: 'Mookirattai / Punarnava (The Nephron Regenerator)',
      traditionalName: 'Punarnava',
      botanicalName: 'Boerhavia diffusa',
      doshaEffect: 'Tridoshic; Supreme Vrukka Rasayana (Renal rejuvenator)',
      therapeuticAction: 'Punarnavoside reduces renal interstitial fibrosis, lowers elevated serum creatinine and urea, and clears glomerular edema.',
      clinicalIndications: ['Elevated creatinine', 'Diabetic nephropathy', 'Microalbuminuria', 'Pedal edema'],
      recommendedDose: '30ml fresh decoction or 3g root churna',
      timing: 'Morning on an empty stomach and 5:00 PM',
      preparationMethod: 'Boil 5g coarse root powder in 200ml water until reduced to 50ml; strain and drink.',
      contraindications: 'Safe; monitor electrolytes.',
      biomarkerTarget: 'Serum Creatinine & eGFR Preservation',
    },
    {
      id: 'kid-ash-2',
      name: 'Nerunjil / Gokshura (Tribulus)',
      traditionalName: 'Gokshura',
      botanicalName: 'Tribulus terrestris',
      doshaEffect: 'Vata-Pitta Shamaka; Sheetala; Mutrala (cooling diuretic)',
      therapeuticAction: 'Saponins and flavonoids heal renal tubular epithelium, prevent calcium oxalate nephrolithiasis, and ease dysuria.',
      clinicalIndications: ['Renal calculi (stones)', 'Microalbuminuria', 'Urinary tract irritation'],
      recommendedDose: '3 grams root powder in warm water',
      timing: 'Twice daily post meals',
      preparationMethod: 'Steep in 150ml boiling water for 10 minutes; drink lukewarm.',
      contraindications: 'Safe for daily renal support.',
      biomarkerTarget: 'Microalbuminuria & Tubular Healing',
    },
    {
      id: 'kid-ash-3',
      name: 'Varuna Pattai (Three-Leaved Caper)',
      traditionalName: 'Varuna',
      botanicalName: 'Crataeva nurvala',
      doshaEffect: 'Kapha-Vata Shamaka; Ashmari-bhedana (Breaks stones)',
      therapeuticAction: 'Lupeol decreases tubular oxalate crystallization and relaxes bladder detrusor spasms.',
      clinicalIndications: ['Kidney stones', 'Chronic urinary sediment', 'Renal sluggishness'],
      recommendedDose: '30ml Kashayam',
      timing: 'Morning and evening before meals',
      preparationMethod: 'Boil bark pieces in water to prepare fresh decoction.',
      contraindications: 'Safe.',
      biomarkerTarget: 'Oxalate Crystallization & Stone Prevention',
    },
  ],
  recipes: {
    breakfast: [
      {
        id: 'kid-bf-1',
        name: 'Steamed White Rice & Leached Moong Idli with Coriander Thogayal',
        category: 'Therapeutic Breakfast',
        mealSlot: 'Breakfast',
        preparationTimeMinutes: 10,
        cookingTimeMinutes: 12,
        glycemicIndex: 'Medium',
        caloriesKcal: 210,
        proteinG: 6.0,
        carbsG: 42,
        fatG: 2.0,
        fiberG: 4.0,
        clinicalIndications: ['Kidney Disease (CKD Stage 2/3)', 'Elevated Creatinine', 'Hyperkalemia Risk'],
        biomarkerTargets: ['Low Potassium (<200mg)', 'Low Phosphorus (<100mg)', 'Gentle Urea Load'],
        ingredients: [
          { item: 'Naturally fermented white rice & urad dal batter (3:1)', portion: '2 idlis (110g)' },
          { item: 'Fresh coriander, ginger & cumin thogayal (made with lemon, zero salt)', portion: '2 tbsp' },
        ],
        preparationSteps: [
          'Steam fermented idli batter for 10 minutes in an idli cooker.',
          'Serve with low-sodium, low-potassium fresh coriander-cumin thogayal.',
        ],
        clinicalRationale: 'Minimizes phosphorus and potassium exposure while providing easily metabolized energy, protecting failing renal nephrons from hyperfiltration injury.',
      },
      ...DIABETES_CLINICAL_PROFILE.recipes.breakfast.slice(1).map((r, i) => ({
        ...r,
        id: `kid-bf-${i + 2}`,
        caloriesKcal: 210,
        proteinG: 6.5,
        clinicalIndications: ['Renal Protection', 'Controlled Potassium/Phosphorus'],
        biomarkerTargets: ['Renal Hyperfiltration Prevention', 'Creatinine Stability'],
      })),
    ],
    lunch: DIABETES_CLINICAL_PROFILE.recipes.lunch.map((r, i) => ({
      ...r,
      id: `kid-ln-${i + 1}`,
      proteinG: 8.5, // Moderated for renal protection
      clinicalIndications: ['CKD Stages 1-3', 'Creatinine Control', 'Renal Low Phosphorus'],
      biomarkerTargets: ['Protein Moderation (0.6g/kg)', 'BUN Reduction'],
      clinicalRationale: r.clinicalRationale + ' Prepared with leached vegetables to ensure low potassium safety.',
    })),
    dinner: DIABETES_CLINICAL_PROFILE.recipes.dinner.map((r, i) => ({
      ...r,
      id: `kid-dn-${i + 1}`,
      proteinG: 7.0,
      clinicalIndications: ['Renal Rest', 'Nocturnal Acid Load Reduction'],
      biomarkerTargets: ['Low Solute Load', 'Zero Fluid Overload'],
    })),
    snacks: DIABETES_CLINICAL_PROFILE.recipes.snacks.map((r, i) => ({
      ...r,
      id: `kid-sn-${i + 1}`,
      clinicalIndications: ['Renal Safe Snack', 'Low Potassium/Sodium'],
      biomarkerTargets: ['Electrolyte Safety', 'Urea Prevention'],
    })),
  },
};

// -------------------------------------------------------------
// CENTRAL REGISTRY MAP
// -------------------------------------------------------------
export const CLINICAL_DOMAIN_PROFILES_REGISTRY: Record<string, DiseaseDomainClinicalProfile> = {
  'Diabetes Mellitus': DIABETES_CLINICAL_PROFILE,
  'Hypertension': HYPERTENSION_CLINICAL_PROFILE,
  'Cardiovascular Diseases': HYPERTENSION_CLINICAL_PROFILE,
  'PCOS': PCOS_CLINICAL_PROFILE,
  'Liver Diseases': LIVER_CLINICAL_PROFILE,
  'Kidney Diseases': KIDNEY_CLINICAL_PROFILE,
  'Metabolic Disorders': DIABETES_CLINICAL_PROFILE,
  'Lipid Disorders': HYPERTENSION_CLINICAL_PROFILE,
  'Obesity': DIABETES_CLINICAL_PROFILE,
};

/**
 * Intelligent clinical resolver that maps any selected category, domain, or uploaded report data
 * to a tailored profile, adapting 40 recipes, 10 food category ingredients, and 10 Ayurvedic functional foods.
 */
export function resolveClinicalProfile(
  categoryName: string,
  domainId?: string,
  uploadedBiomarkers?: Array<{ marker: string; value: string; status: string }>,
  targetCalories: number = 1500
): DiseaseDomainClinicalProfile {
  // 1. Direct match or fuzzy match
  let baseProfile: DiseaseDomainClinicalProfile = DIABETES_CLINICAL_PROFILE;

  const normalized = (categoryName || '').toLowerCase();
  if (normalized.includes('hypertens') || normalized.includes('cardio') || normalized.includes('vascular') || normalized.includes('dash')) {
    baseProfile = HYPERTENSION_CLINICAL_PROFILE;
  } else if (normalized.includes('pcos') || normalized.includes('ovary') || normalized.includes('hormon') || normalized.includes('women')) {
    baseProfile = PCOS_CLINICAL_PROFILE;
  } else if (normalized.includes('liver') || normalized.includes('hepat') || normalized.includes('steatosis')) {
    baseProfile = LIVER_CLINICAL_PROFILE;
  } else if (normalized.includes('kidney') || normalized.includes('renal') || normalized.includes('nephro')) {
    baseProfile = KIDNEY_CLINICAL_PROFILE;
  } else if (normalized.includes('lipid') || normalized.includes('cholesterol') || normalized.includes('triglyceride')) {
    baseProfile = HYPERTENSION_CLINICAL_PROFILE;
  } else {
    baseProfile = DIABETES_CLINICAL_PROFILE;
  }

  // 2. Caloric Scaling Factor
  // Standard profile is calibrated for 1,500 kcal
  const scale = targetCalories > 0 ? targetCalories / 1500 : 1;

  // 3. Extract uploaded biomarkers text for dynamic tagging
  const biomarkerFlags = (uploadedBiomarkers || []).map((b) => `${b.marker}: ${b.value}`).join(' • ');

  // Deep scale and enrich recipes
  const scaleRecipe = (r: DynamicTherapeuticRecipe): DynamicTherapeuticRecipe => ({
    ...r,
    caloriesKcal: Math.round(r.caloriesKcal * scale),
    proteinG: Math.round(r.proteinG * scale * 10) / 10,
    carbsG: Math.round(r.carbsG * scale * 10) / 10,
    fatG: Math.round(r.fatG * scale * 10) / 10,
    fiberG: Math.round(r.fiberG * scale * 10) / 10,
    biomarkerTargets: biomarkerFlags ? [biomarkerFlags.slice(0, 45), ...r.biomarkerTargets] : r.biomarkerTargets,
  });

  return {
    ...baseProfile,
    recipes: {
      breakfast: baseProfile.recipes.breakfast.map(scaleRecipe),
      lunch: baseProfile.recipes.lunch.map(scaleRecipe),
      dinner: baseProfile.recipes.dinner.map(scaleRecipe),
      snacks: baseProfile.recipes.snacks.map(scaleRecipe),
    },
  };
}
