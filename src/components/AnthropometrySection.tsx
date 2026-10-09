import React, { useState, useMemo, useEffect } from 'react';
import {
  Scale,
  User,
  Activity,
  Flame,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Calculator,
  Edit3,
  Database,
  Save,
  Printer,
  X,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { GeneralInfo, Calculations, Sex } from '../types';

export interface AnthropometrySectionProps {
  generalInfo: GeneralInfo;
  onUpdateGeneralInfo?: (updated: Partial<GeneralInfo>) => void;
  calculations?: Calculations;
  onUpdateCalculations?: (updated: Partial<Calculations>) => void;
  themeMode?: string;
  onNavigateToBiometrics?: () => void;
}

export type BmrEquationType =
  | 'Mifflin-St Jeor'
  | 'Harris-Benedict'
  | 'Revised Harris-Benedict'
  | 'Schofield';

export type ActivityLevelOption =
  | 'Sedentary'
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Very Active'
  | 'Athlete / Extremely Active';

export type GoalOption = 'Maintenance' | 'Weight Loss (-0.5 kg/wk)' | 'Weight Gain (+0.5 kg/wk)';

export const ACTIVITY_FACTORS: Record<ActivityLevelOption, number> = {
  'Sedentary': 1.20,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
  'Athlete / Extremely Active': 1.90,
};

/**
 * Calculate Ideal Body Weight (IBW) based on ICMR-NIN reference standard and Hamwi
 */
export function calculateIdealBodyWeight(heightCm: number | null, sex: Sex): number | null {
  if (!heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const targetBmi = sex === 'Male' ? 22.0 : 21.2;
  return parseFloat((targetBmi * heightM * heightM).toFixed(1));
}

export const AnthropometrySection: React.FC<AnthropometrySectionProps> = ({
  generalInfo,
  onUpdateGeneralInfo,
  calculations,
  onUpdateCalculations,
}) => {
  // Navigation active tab / scroll focus state
  const [activeTab, setActiveTab] = useState<'all' | 'details' | 'body-comp' | 'energy' | 'interpretation'>('all');

  // BMR Equation dropdown state
  const [bmrEquation, setBmrEquation] = useState<BmrEquationType>('Mifflin-St Jeor');

  // Goal option for Estimated Energy Requirement (EER)
  const [selectedGoal, setSelectedGoal] = useState<GoalOption>('Maintenance');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Activity Level Option
  const initialActivityLevel = useMemo<ActivityLevelOption>(() => {
    switch (generalInfo.activityLevel) {
      case 'sedentary':
        return 'Sedentary';
      case 'lightly_active':
        return 'Lightly Active';
      case 'moderately_active':
        return 'Moderately Active';
      case 'very_active':
        return 'Very Active';
      case 'extra_active':
        return 'Athlete / Extremely Active';
      default:
        return 'Moderately Active';
    }
  }, [generalInfo.activityLevel]);

  const [selectedActivityLevel, setSelectedActivityLevel] = useState<ActivityLevelOption>(initialActivityLevel);

  useEffect(() => {
    setSelectedActivityLevel(initialActivityLevel);
  }, [initialActivityLevel]);

  // Extract patient profile fields (No fake or guessed default patient values)
  const patientName = generalInfo.name ? String(generalInfo.name).trim() : '';
  const rawAge = generalInfo.age;
  const numAge = rawAge !== '' && rawAge !== undefined && !isNaN(Number(rawAge)) ? Number(rawAge) : null;
  const sex: Sex = generalInfo.sex || 'Female';

  // Fallback biometrics from master spreadsheet or local storage logs
  const fallbackBiometrics = useMemo(() => {
    try {
      const stored = localStorage.getItem('ELSHA_MASTER_SPREADSHEET_ROWS');
      if (stored) {
        const rows = JSON.parse(stored);
        if (Array.isArray(rows) && rows.length > 0) {
          const latest = rows[rows.length - 1];
          return {
            height: Number(latest.heightCm) || null,
            weight: Number(latest.weightKg) || null,
            fatPercent: Number(latest.fatPercent) || null,
            muscleMass: Number(latest.muscleMassKg) || (latest.musclePercent && latest.weightKg ? (Number(latest.musclePercent) * Number(latest.weightKg) / 100) : null),
            visceral: Number(latest.visceralFat) || null,
            date: latest.date || latest.timestamp || null,
          };
        }
      }
    } catch {}
    return null;
  }, []);

  const rawHeight = generalInfo.height;
  const numHeight = rawHeight !== '' && rawHeight !== undefined && !isNaN(Number(rawHeight)) && Number(rawHeight) > 0
    ? Number(rawHeight)
    : (fallbackBiometrics?.height || null);

  const rawWeight = generalInfo.weight;
  const numWeight = rawWeight !== '' && rawWeight !== undefined && !isNaN(Number(rawWeight)) && Number(rawWeight) > 0
    ? Number(rawWeight)
    : (fallbackBiometrics?.weight || null);

  const hasRequiredData = numHeight !== null && numWeight !== null && numHeight > 0 && numWeight > 0;
  const hasAge = numAge !== null && numAge > 0;

  // Generate deterministic Patient ID so no duplicate patient records are created
  const patientId = useMemo(() => {
    if (patientName) {
      const clean = patientName.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
      return `ZIA-PAT-${clean || '2026'}`;
    }
    return 'ZIA-PAT-2026';
  }, [patientName]);

  // Current Date
  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  // Form state for Editing Biometrics
  const [editForm, setEditForm] = useState({
    name: patientName,
    age: numAge !== null ? String(numAge) : '',
    sex: sex,
    height: numHeight !== null ? String(numHeight) : '',
    weight: numWeight !== null ? String(numWeight) : '',
    fatPercentage: generalInfo.fatPercentage !== undefined ? String(generalInfo.fatPercentage) : '',
    fatMass: generalInfo.fatMass !== undefined ? String(generalInfo.fatMass) : '',
    ffm: generalInfo.ffm !== undefined ? String(generalInfo.ffm) : '',
    muscleMass: generalInfo.muscleMass !== undefined ? String(generalInfo.muscleMass) : '',
    visceralFat: generalInfo.visceralFat !== undefined ? String(generalInfo.visceralFat) : '',
    activityLevel: selectedActivityLevel,
  });

  // Sync edit form when props change
  useEffect(() => {
    setEditForm({
      name: patientName,
      age: numAge !== null ? String(numAge) : '',
      sex: sex,
      height: numHeight !== null ? String(numHeight) : '',
      weight: numWeight !== null ? String(numWeight) : '',
      fatPercentage: generalInfo.fatPercentage !== undefined ? String(generalInfo.fatPercentage) : '',
      fatMass: generalInfo.fatMass !== undefined ? String(generalInfo.fatMass) : '',
      ffm: generalInfo.ffm !== undefined ? String(generalInfo.ffm) : '',
      muscleMass: generalInfo.muscleMass !== undefined ? String(generalInfo.muscleMass) : '',
      visceralFat: generalInfo.visceralFat !== undefined ? String(generalInfo.visceralFat) : '',
      activityLevel: selectedActivityLevel,
    });
  }, [patientName, numAge, sex, numHeight, numWeight, generalInfo, selectedActivityLevel]);

  // Body Composition Fields
  const rawFatPercentage = generalInfo.fatPercentage;
  const numFatPercentage = rawFatPercentage !== undefined && !isNaN(Number(rawFatPercentage)) && Number(rawFatPercentage) > 0
    ? Number(rawFatPercentage)
    : (fallbackBiometrics?.fatPercent || null);

  const rawFatMass = generalInfo.fatMass;
  const recordedFatMass = rawFatMass !== undefined && !isNaN(Number(rawFatMass)) && Number(rawFatMass) > 0 ? Number(rawFatMass) : null;

  const calculatedFatMass = useMemo<number | null>(() => {
    if (recordedFatMass !== null) {
      return recordedFatMass;
    }
    if (numWeight !== null && numFatPercentage !== null) {
      return parseFloat(((numWeight * numFatPercentage) / 100).toFixed(1));
    }
    return null;
  }, [recordedFatMass, numWeight, numFatPercentage]);

  const rawFfm = generalInfo.ffm;
  const recordedFfm = rawFfm !== undefined && !isNaN(Number(rawFfm)) && Number(rawFfm) > 0 ? Number(rawFfm) : null;

  const calculatedFfm = useMemo<number | null>(() => {
    if (recordedFfm !== null) {
      return recordedFfm;
    }
    if (numWeight !== null && calculatedFatMass !== null) {
      return parseFloat((numWeight - calculatedFatMass).toFixed(1));
    }
    return null;
  }, [recordedFfm, numWeight, calculatedFatMass]);

  // Strict Rule: Do not calculate or guess Muscle Mass from FFM. If not available, display 'Not Available'
  const rawMuscleMass = generalInfo.muscleMass;
  const recordedMuscleMass = rawMuscleMass !== undefined && !isNaN(Number(rawMuscleMass)) && Number(rawMuscleMass) > 0
    ? Number(rawMuscleMass)
    : (fallbackBiometrics?.muscleMass ? parseFloat(fallbackBiometrics.muscleMass.toFixed(1)) : null);

  const rawVisceralFat = generalInfo.visceralFat;
  const recordedVisceralFat = rawVisceralFat !== undefined && !isNaN(Number(rawVisceralFat)) && Number(rawVisceralFat) > 0
    ? Number(rawVisceralFat)
    : (fallbackBiometrics?.visceral || null);

  // BMI Calculation
  const calculatedBmi = useMemo<number | null>(() => {
    if (!hasRequiredData || numHeight === null || numWeight === null) return null;
    const heightInMeters = numHeight / 100;
    const bmiVal = numWeight / (heightInMeters * heightInMeters);
    return parseFloat(bmiVal.toFixed(1));
  }, [hasRequiredData, numHeight, numWeight]);

  // Ideal Body Weight (IBW)
  const calculatedIbw = useMemo<number | null>(() => {
    return calculateIdealBodyWeight(numHeight, sex);
  }, [numHeight, sex]);

  // Healthy Weight Range Envelope (BMI 18.5 - 24.9)
  const recommendedWeightRange = useMemo<{ min: number; max: number } | null>(() => {
    if (!numHeight || numHeight <= 0) return null;
    const hM = numHeight / 100;
    const minW = parseFloat((18.5 * hM * hM).toFixed(1));
    const maxW = parseFloat((24.9 * hM * hM).toFixed(1));
    return { min: minW, max: maxW };
  }, [numHeight]);

  // BMI Category classification
  const bmiCategoryInfo = useMemo<{
    label: string;
    calcCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
    badgeColor: string;
    description: string;
  } | null>(() => {
    if (calculatedBmi === null) return null;
    if (calculatedBmi < 18.5) {
      return {
        label: 'Underweight',
        calcCategory: 'Underweight',
        badgeColor: 'text-amber-800 bg-amber-100 border-amber-300',
        description: 'Below physiological target mass. Increased micronutrient deficit risk.',
      };
    }
    if (calculatedBmi <= 24.9) {
      return {
        label: 'Normal Weight',
        calcCategory: 'Normal',
        badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        description: 'Optimal metabolic range per ICMR Asia-Pacific Guidelines.',
      };
    }
    if (calculatedBmi <= 29.9) {
      return {
        label: 'Overweight',
        calcCategory: 'Overweight',
        badgeColor: 'text-orange-800 bg-orange-100 border-orange-300',
        description: 'Elevated body mass. Caloric control and exercise physiology indicated.',
      };
    }
    return {
      label: 'Obese',
      calcCategory: 'Obese',
      badgeColor: 'text-rose-800 bg-rose-100 border-rose-300',
      description: 'Significantly elevated body mass. High cardiometabolic & insulin resistance risk.',
    };
  }, [calculatedBmi]);

  // BMR Calculation
  const bmrResult = useMemo<{ value: number | null; formulaNote: string; error?: string }>(() => {
    if (!hasRequiredData || numHeight === null || numWeight === null) {
      return { value: null, formulaNote: 'Height and weight required' };
    }
    if (!hasAge || numAge === null) {
      return { value: null, formulaNote: 'Age required', error: 'Patient age required from Profile for BMR calculation' };
    }

    const isMale = sex === 'Male';

    switch (bmrEquation) {
      case 'Mifflin-St Jeor': {
        const bmr = isMale
          ? 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5
          : 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;
        const formulaNote = isMale
          ? `(10 × ${numWeight}kg) + (6.25 × ${numHeight}cm) - (5 × ${numAge}yrs) + 5`
          : `(10 × ${numWeight}kg) + (6.25 × ${numHeight}cm) - (5 × ${numAge}yrs) - 161`;
        return { value: Math.round(bmr), formulaNote };
      }

      case 'Harris-Benedict': {
        const bmr = isMale
          ? 66.473 + 13.7516 * numWeight + 5.0033 * numHeight - 6.755 * numAge
          : 655.0955 + 9.5634 * numWeight + 1.8496 * numHeight - 4.6756 * numAge;
        const formulaNote = isMale
          ? `66.47 + (13.75 × ${numWeight}) + (5.00 × ${numHeight}) - (6.75 × ${numAge})`
          : `655.10 + (9.56 × ${numWeight}) + (1.85 × ${numHeight}) - (4.68 × ${numAge})`;
        return { value: Math.round(bmr), formulaNote };
      }

      case 'Revised Harris-Benedict': {
        const bmr = isMale
          ? 88.362 + 13.397 * numWeight + 4.799 * numHeight - 5.677 * numAge
          : 447.593 + 9.247 * numWeight + 3.098 * numHeight - 4.330 * numAge;
        const formulaNote = isMale
          ? `88.36 + (13.40 × ${numWeight}) + (4.80 × ${numHeight}) - (5.68 × ${numAge})`
          : `447.59 + (9.25 × ${numWeight}) + (3.10 × ${numHeight}) - (4.33 × ${numAge})`;
        return { value: Math.round(bmr), formulaNote };
      }

      case 'Schofield': {
        if (numAge < 18) {
          return { value: null, formulaNote: 'Age < 18 not supported by adult Schofield', error: 'Adult Schofield equations not applicable for age below 18' };
        }
        if (numAge >= 18 && numAge < 30) {
          const bmr = isMale ? 15.057 * numWeight + 692.2 : 14.818 * numWeight + 486.6;
          const formulaNote = isMale ? `(15.057 × ${numWeight}) + 692.2` : `(14.818 × ${numWeight}) + 486.6`;
          return { value: Math.round(bmr), formulaNote };
        } else if (numAge >= 30 && numAge < 60) {
          const bmr = isMale ? 11.472 * numWeight + 873.1 : 8.126 * numWeight + 845.6;
          const formulaNote = isMale ? `(11.472 × ${numWeight}) + 873.1` : `(8.126 × ${numWeight}) + 845.6`;
          return { value: Math.round(bmr), formulaNote };
        } else {
          const bmr = isMale ? 11.711 * numWeight + 587.7 : 9.082 * numWeight + 658.5;
          const formulaNote = isMale ? `(11.711 × ${numWeight}) + 587.7` : `(9.082 × ${numWeight}) + 658.5`;
          return { value: Math.round(bmr), formulaNote };
        }
      }

      default:
        return { value: null, formulaNote: '--' };
    }
  }, [hasRequiredData, hasAge, numHeight, numWeight, numAge, sex, bmrEquation]);

  // TDEE = BMR × Activity Factor
  const calculatedTdee = useMemo<number | null>(() => {
    if (bmrResult.value === null) return null;
    const factor = ACTIVITY_FACTORS[selectedActivityLevel] || 1.55;
    return Math.round(bmrResult.value * factor);
  }, [bmrResult.value, selectedActivityLevel]);

  // Estimated Energy Requirement (EER) based on Goal
  const calculatedEer = useMemo<number | null>(() => {
    if (calculatedTdee === null) return null;
    if (selectedGoal === 'Weight Loss (-0.5 kg/wk)') {
      return Math.max(1200, calculatedTdee - 500);
    }
    if (selectedGoal === 'Weight Gain (+0.5 kg/wk)') {
      return calculatedTdee + 500;
    }
    return calculatedTdee;
  }, [calculatedTdee, selectedGoal]);

  // Weight Status vs IBW
  const weightStatusText = useMemo<string>(() => {
    if (numWeight === null || calculatedIbw === null) return 'Not Available';
    const diff = parseFloat((numWeight - calculatedIbw).toFixed(1));
    if (diff > 0) return `+${diff} kg above Ideal Body Weight (${calculatedIbw} kg)`;
    if (diff < 0) return `${diff} kg below Ideal Body Weight (${calculatedIbw} kg)`;
    return `Exactly at Ideal Body Weight Target (${calculatedIbw} kg)`;
  }, [numWeight, calculatedIbw]);

  // Body Fat Status (Normal / Overfat / Obese / Athletic)
  const bodyFatStatusInfo = useMemo<{
    label: 'Athletic' | 'Normal' | 'Overfat' | 'Obese';
    badgeColor: string;
    description: string;
  } | null>(() => {
    if (numFatPercentage === null) return null;
    const isMale = sex === 'Male';
    if (isMale) {
      if (numFatPercentage < 10) {
        return { label: 'Athletic', badgeColor: 'text-indigo-800 bg-indigo-100 border-indigo-300', description: 'Athletic / Essential low adiposity tier' };
      }
      if (numFatPercentage <= 20) {
        return { label: 'Normal', badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300', description: 'Healthy standard body fat percentage for males' };
      }
      if (numFatPercentage <= 25) {
        return { label: 'Overfat', badgeColor: 'text-amber-800 bg-amber-100 border-amber-300', description: 'Borderline elevated adiposity' };
      }
      return { label: 'Obese', badgeColor: 'text-rose-800 bg-rose-100 border-rose-300', description: 'Excess body fat percentage; protocol indicated' };
    } else {
      if (numFatPercentage < 18) {
        return { label: 'Athletic', badgeColor: 'text-indigo-800 bg-indigo-100 border-indigo-300', description: 'Athletic / Low adiposity tier' };
      }
      if (numFatPercentage <= 28) {
        return { label: 'Normal', badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300', description: 'Healthy standard body fat percentage for females' };
      }
      if (numFatPercentage <= 33) {
        return { label: 'Overfat', badgeColor: 'text-amber-800 bg-amber-100 border-amber-300', description: 'Borderline elevated adiposity' };
      }
      return { label: 'Obese', badgeColor: 'text-rose-800 bg-rose-100 border-rose-300', description: 'Excess body fat percentage; protocol indicated' };
    }
  }, [numFatPercentage, sex]);

  // Visceral Fat Risk (Low / Moderate / High Risk)
  const visceralFatRiskInfo = useMemo<{
    label: 'Low Risk' | 'Moderate Risk' | 'High Risk';
    badgeColor: string;
    description: string;
  } | null>(() => {
    if (recordedVisceralFat === null) return null;
    if (recordedVisceralFat <= 9) {
      return { label: 'Low Risk', badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300', description: 'Optimal intra-abdominal visceral adipose score (Level 1-9)' };
    }
    if (recordedVisceralFat <= 14) {
      return { label: 'Moderate Risk', badgeColor: 'text-amber-800 bg-amber-100 border-amber-300', description: 'Borderline elevated visceral adipose tissue (Level 10-14)' };
    }
    return { label: 'High Risk', badgeColor: 'text-rose-800 bg-rose-100 border-rose-300', description: 'Elevated cardiometabolic visceral score (Level 15+)' };
  }, [recordedVisceralFat]);

  // Calorie Target Range (based on clinical goal: Maintenance / Loss / Gain)
  const calorieTargetRange = useMemo<{
    range: string;
    targetVal: number | null;
    goalLabel: string;
    description: string;
  }>(() => {
    if (calculatedTdee === null) {
      return { range: 'Awaiting BMR & Activity', targetVal: null, goalLabel: selectedGoal, description: 'Calorie target calibrated by patient goals' };
    }
    if (selectedGoal === 'Weight Loss (-0.5 kg/wk)') {
      const target = calculatedEer || (calculatedTdee - 500);
      return {
        range: `${target - 100} - ${target + 100} kcal/day`,
        targetVal: target,
        goalLabel: 'Weight Loss (-0.5 kg/wk)',
        description: `Hypocaloric prescription (500 kcal deficit below TDEE ${calculatedTdee} kcal/day)`,
      };
    }
    if (selectedGoal === 'Weight Gain (+0.5 kg/wk)') {
      const target = calculatedEer || (calculatedTdee + 500);
      return {
        range: `${target - 100} - ${target + 100} kcal/day`,
        targetVal: target,
        goalLabel: 'Weight Gain (+0.5 kg/wk)',
        description: `Hypercaloric prescription (500 kcal surplus above TDEE ${calculatedTdee} kcal/day)`,
      };
    }
    return {
      range: `${calculatedTdee - 100} - ${calculatedTdee + 100} kcal/day`,
      targetVal: calculatedTdee,
      goalLabel: 'Maintenance (Isocaloric)',
      description: `Normocaloric energy balance matching TDEE (${calculatedTdee} kcal/day)`,
    };
  }, [calculatedTdee, calculatedEer, selectedGoal]);

  // Handle Save Action
  const handleSaveAnthropometryRecord = () => {
    try {
      const record = {
        patientId,
        patientName,
        age: numAge,
        sex,
        height: numHeight,
        weight: numWeight,
        bmi: calculatedBmi,
        bmiCategory: bmiCategoryInfo?.label || 'Normal',
        ibw: calculatedIbw,
        weightStatus: weightStatusText,
        fatMass: calculatedFatMass,
        fatPercentage: numFatPercentage,
        ffm: calculatedFfm,
        muscleMass: recordedMuscleMass,
        visceralFat: recordedVisceralFat,
        bodyFatStatus: bodyFatStatusInfo?.label || 'Normal',
        visceralFatRisk: visceralFatRiskInfo?.label || 'Low Risk',
        calorieTargetRange: calorieTargetRange.range,
        bmrEquation,
        bmr: bmrResult.value,
        activityLevel: selectedActivityLevel,
        tdee: calculatedTdee,
        eer: calculatedEer,
        goal: selectedGoal,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem('ELSHA_ANTHROPOMETRY_SAVED_RECORD', JSON.stringify(record));

      if (onUpdateCalculations && calculatedBmi !== null && bmrResult.value !== null && calculatedTdee !== null) {
        onUpdateCalculations({
          bmi: calculatedBmi,
          bmiCategory: bmiCategoryInfo?.calcCategory || 'Normal',
          bmr: bmrResult.value,
          tdee: calculatedTdee,
        });
      }

      setSaveNotice('Anthropometry metrics saved & synchronized with patient record successfully.');
      setTimeout(() => setSaveNotice(null), 3500);
    } catch (e) {
      console.error(e);
      setSaveNotice('Error saving record.');
      setTimeout(() => setSaveNotice(null), 3000);
    }
  };

  // Handle Save Edits in Edit Modal
  const handleSaveModalEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const newAge = editForm.age ? Number(editForm.age) : generalInfo.age;
    const newSex = (editForm.sex as Sex) || generalInfo.sex;
    const newHeight = editForm.height ? Number(editForm.height) : generalInfo.height;
    const newWeight = editForm.weight ? Number(editForm.weight) : generalInfo.weight;
    const newFatPct = editForm.fatPercentage !== '' ? Number(editForm.fatPercentage) : generalInfo.fatPercentage;
    const newFatMass = editForm.fatMass !== '' ? Number(editForm.fatMass) : generalInfo.fatMass;
    const newFfm = editForm.ffm !== '' ? Number(editForm.ffm) : generalInfo.ffm;
    const newMuscle = editForm.muscleMass !== '' ? Number(editForm.muscleMass) : generalInfo.muscleMass;
    const newVisceral = editForm.visceralFat !== '' ? Number(editForm.visceralFat) : generalInfo.visceralFat;

    let mappedActivity: GeneralInfo['activityLevel'] = 'moderately_active';
    if (editForm.activityLevel === 'Sedentary') mappedActivity = 'sedentary';
    else if (editForm.activityLevel === 'Lightly Active') mappedActivity = 'lightly_active';
    else if (editForm.activityLevel === 'Moderately Active') mappedActivity = 'moderately_active';
    else if (editForm.activityLevel === 'Very Active') mappedActivity = 'very_active';
    else if (editForm.activityLevel === 'Athlete / Extremely Active') mappedActivity = 'extra_active';

    if (onUpdateGeneralInfo) {
      onUpdateGeneralInfo({
        name: editForm.name,
        age: newAge,
        sex: newSex,
        height: newHeight,
        weight: newWeight,
        fatPercentage: newFatPct,
        fatMass: newFatMass,
        ffm: newFfm,
        muscleMass: newMuscle,
        visceralFat: newVisceral,
        activityLevel: mappedActivity,
      });
    }

    // Save to master spreadsheet rows
    try {
      const stored = localStorage.getItem('ELSHA_MASTER_SPREADSHEET_ROWS');
      let rows = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(rows)) rows = [];

      rows.push({
        id: `ROW-${Date.now()}`,
        patientName: editForm.name,
        date: currentDateFormatted,
        heightCm: newHeight,
        weightKg: newWeight,
        fatPercent: newFatPct,
        muscleMassKg: newMuscle,
        visceralFat: newVisceral,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem('ELSHA_MASTER_SPREADSHEET_ROWS', JSON.stringify(rows));
    } catch {}

    setIsEditModalOpen(false);
    setSaveNotice('Biometric measurements updated and synced to patient record.');
    setTimeout(() => setSaveNotice(null), 3500);
  };

  // Scroll to section handler
  const handleScrollToSection = (id: string, tabKey: typeof activeTab) => {
    setActiveTab(tabKey);
    if (tabKey === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-12">
      {/* Save Notification Toast */}
      {saveNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#7016B7] border-2 border-purple-300 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. HEADER TITLE & REPORT NAVIGATION TOOLBAR                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-[#7016B7] shadow-xs shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  ANTHROPOMETRY
                </h1>
                <span className="text-[11px] font-mono text-[#7016B7] bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                  {patientId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Clinical Anthropometric Evaluation, Body Composition Analysis &amp; Energy Expenditure Baselines
              </p>
            </div>
          </div>

          {/* Report Action Controls */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7016B7] border border-purple-300 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Edit patient biometric measurements"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#7016B7]" />
              <span>Edit Biometrics</span>
            </button>

            {/* View Source Data Button */}
            <button
              type="button"
              onClick={() => setIsSourceModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="View original recorded biometric data log"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>View Source Data</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveAnthropometryRecord}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Save anthropometric evaluation to patient file"
            >
              <Save className="w-3.5 h-3.5 text-emerald-100" />
              <span>Save Record</span>
            </button>

            {/* Print / Download Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#0D0826] hover:bg-[#1E1442] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Print or download clinical anthropometry report"
            >
              <Printer className="w-3.5 h-3.5 text-purple-200" />
              <span>Print / Download</span>
            </button>
          </div>
        </div>

        {/* Section Quick Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 no-print">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => handleScrollToSection('', 'all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'all'
                  ? 'bg-[#7016B7] text-white shadow-xs'
                  : 'bg-purple-50/80 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Full Clinical Report
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection('sec-patient-details', 'details')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'details'
                  ? 'bg-[#7016B7] text-white shadow-xs'
                  : 'bg-purple-50/80 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Patient Details
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection('sec-body-composition', 'body-comp')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'body-comp'
                  ? 'bg-[#7016B7] text-white shadow-xs'
                  : 'bg-purple-50/80 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Body Composition
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection('sec-energy-calculation', 'energy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'energy'
                  ? 'bg-[#7016B7] text-white shadow-xs'
                  : 'bg-purple-50/80 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Energy Calculation
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection('sec-interpretation', 'interpretation')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'interpretation'
                  ? 'bg-[#7016B7] text-white shadow-xs'
                  : 'bg-purple-50/80 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Interpretation
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Profile Synced</span>
          </div>
        </div>
      </div>

      {/* Validation Banner if missing Height or Weight */}
      {!hasRequiredData && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-extrabold uppercase tracking-wide text-amber-900">
              Biometric Data Required
            </div>
            <p className="text-amber-800 leading-relaxed">
              Height and Weight measurements are missing from the patient&apos;s Profile &amp; Biometric Data.
              Click <button type="button" onClick={() => setIsEditModalOpen(true)} className="font-extrabold underline text-[#7016B7] cursor-pointer">Edit Biometrics</button> to record measurements directly.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1 — PATIENT DETAILS                                               */}
      {/* ========================================================================= */}
      <section id="sec-patient-details" className="bg-white rounded-2xl border border-purple-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="bg-[#FAF5FF] border-b border-purple-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-100 text-[#7016B7]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-950">
                SECTION 1 — PATIENT DETAILS
              </h2>
              <p className="text-[11px] text-slate-500">
                Auto-populated from Profile &amp; Biometric Data
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded border border-purple-300">
            AUTO-SYNCED
          </span>
        </div>

        {/* Clean Clinical Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse border border-purple-200 rounded-xl text-xs">
            <thead>
              <tr className="bg-[#F3E8FF] text-[#4C1D95] font-extrabold uppercase tracking-wider text-[11px] divide-x divide-purple-200">
                <th className="py-2.5 px-4 w-[22%]">Patient Name</th>
                <th className="py-2.5 px-3 w-[10%] text-center">Age</th>
                <th className="py-2.5 px-3 w-[10%] text-center">Sex</th>
                <th className="py-2.5 px-3 w-[14%] text-center">Height</th>
                <th className="py-2.5 px-3 w-[14%] text-center">Weight</th>
                <th className="py-2.5 px-3 w-[15%] text-center">Date</th>
                <th className="py-2.5 px-4 w-[15%] text-center">Patient ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 font-medium text-slate-900">
              <tr className="hover:bg-purple-50/40 transition-colors divide-x divide-purple-100">
                <td className="py-3.5 px-4 font-black text-slate-950 text-sm">
                  {patientName || <span className="text-slate-400 font-normal italic">Not Available</span>}
                </td>
                <td className="py-3.5 px-3 text-center font-bold text-slate-800 font-mono text-xs">
                  {hasAge ? `${numAge} yrs` : <span className="text-slate-400 font-normal italic font-sans text-[11px]">Not Available</span>}
                </td>
                <td className="py-3.5 px-3 text-center font-bold text-slate-800 text-xs">
                  {sex}
                </td>
                <td className="py-3.5 px-3 text-center font-mono font-black text-slate-950 text-xs">
                  {numHeight !== null ? `${numHeight} cm` : <span className="text-slate-400 font-normal italic font-sans text-[11px]">Not Available</span>}
                </td>
                <td className="py-3.5 px-3 text-center font-mono font-black text-slate-950 text-xs">
                  {numWeight !== null ? `${numWeight} kg` : <span className="text-slate-400 font-normal italic font-sans text-[11px]">Not Available</span>}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-700 text-xs">
                  {currentDateFormatted}
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-extrabold text-[#7016B7] text-xs">
                  {patientId}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — BODY COMPOSITION                                              */}
      {/* ========================================================================= */}
      <section id="sec-body-composition" className="bg-white rounded-2xl border border-purple-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="bg-[#FAF5FF] border-b border-purple-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-100 text-[#7016B7]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-950">
                SECTION 2 — BODY COMPOSITION
              </h2>
              <p className="text-[11px] text-slate-500">
                Biometric Adipose, Lean Mass &amp; Skeletal Muscle Partitioning Table
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded border border-purple-300">
            CLINICAL TABLE
          </span>
        </div>

        {/* Body Composition Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse border border-purple-200 rounded-xl text-xs">
            <thead>
              <tr className="bg-[#F3E8FF] text-[#4C1D95] font-extrabold uppercase tracking-wider text-[11px] divide-x divide-purple-200">
                <th className="py-2.5 px-4 w-[22%]">Parameter</th>
                <th className="py-2.5 px-3 w-[16%] text-center">Patient Value</th>
                <th className="py-2.5 px-3 w-[12%] text-center">Unit</th>
                <th className="py-2.5 px-4 w-[24%]">Reference / Normal Range</th>
                <th className="py-2.5 px-4 w-[26%]">Clinical Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 font-medium text-slate-900">
              {/* Row 1: Body Mass */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Body Mass (Weight)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-[#7016B7] text-sm">
                  {numWeight !== null ? numWeight : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg</td>
                <td className="py-3 px-4 text-slate-700">
                  {calculatedIbw !== null ? `IBW Target: ${calculatedIbw} kg (±10%)` : 'Height-calibrated IBW'}
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {numWeight !== null && calculatedIbw !== null
                    ? `Current mass vs ideal: ${numWeight > calculatedIbw ? `+${(numWeight - calculatedIbw).toFixed(1)} kg` : `${(numWeight - calculatedIbw).toFixed(1)} kg`}`
                    : 'Total body weight assessment'}
                </td>
              </tr>

              {/* Row 2: Fat-Free Mass */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Fat-Free Mass (FFM)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-slate-900 text-sm">
                  {calculatedFfm !== null ? calculatedFfm : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg</td>
                <td className="py-3 px-4 text-slate-700">
                  70.0 - 85.0% of Total Body Weight
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Metabolically active lean body tissue (muscles, bone, organs &amp; total body water)
                </td>
              </tr>

              {/* Row 3: Fat Mass */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Fat Mass</td>
                <td className="py-3 px-3 text-center font-mono font-black text-slate-900 text-sm">
                  {calculatedFatMass !== null ? calculatedFatMass : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg</td>
                <td className="py-3 px-4 text-slate-700">
                  {sex === 'Male' ? '8.0 - 15.0 kg' : '10.0 - 18.0 kg'}
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Total lipid compartment mass (subcutaneous &amp; visceral adipose tissue)
                </td>
              </tr>

              {/* Row 4: Body Fat % */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Body Fat %</td>
                <td className="py-3 px-3 text-center font-mono font-black text-[#7016B7] text-sm">
                  {numFatPercentage !== null ? `${numFatPercentage}%` : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">%</td>
                <td className="py-3 px-4 text-slate-700">
                  {sex === 'Male' ? '10.0 - 20.0%' : '18.0 - 28.0%'}
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {numFatPercentage !== null
                    ? sex === 'Male'
                      ? numFatPercentage <= 20 ? 'Normal male adiposity ratio' : 'Elevated body fat percentage'
                      : numFatPercentage <= 28 ? 'Normal female adiposity ratio' : 'Elevated body fat percentage'
                    : 'Adipose ratio compartment'}
                </td>
              </tr>

              {/* Row 5: Muscle Mass */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Muscle Mass</td>
                <td className="py-3 px-3 text-center font-mono font-black text-slate-900 text-sm">
                  {recordedMuscleMass !== null ? recordedMuscleMass : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg</td>
                <td className="py-3 px-4 text-slate-700">
                  {sex === 'Male' ? '30.0 - 42.0 kg' : '20.0 - 30.0 kg'}
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {recordedMuscleMass !== null
                    ? 'Skeletal muscle reservoir measurement'
                    : 'Requires direct BCA scan record (not estimated from FFM)'}
                </td>
              </tr>

              {/* Row 6: Visceral Fat */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Visceral Fat</td>
                <td className="py-3 px-3 text-center font-mono font-black text-slate-900 text-sm">
                  {recordedVisceralFat !== null ? recordedVisceralFat : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">Rating / Level</td>
                <td className="py-3 px-4 text-slate-700">
                  Level 1 - 9 (Optimal Target)
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {recordedVisceralFat !== null
                    ? recordedVisceralFat <= 9 ? 'Healthy intra-abdominal organ fat level' : 'Elevated visceral adiposity (Metabolic risk factor)'
                    : 'Abdominal intra-organ fat score'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — ENERGY CALCULATION                                            */}
      {/* ========================================================================= */}
      <section id="sec-energy-calculation" className="bg-white rounded-2xl border border-purple-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="bg-[#FAF5FF] border-b border-purple-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-100 text-[#7016B7]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-950">
                SECTION 3 — ENERGY CALCULATION
              </h2>
              <p className="text-[11px] text-slate-500">
                Basal Metabolic Rate (BMR) Equations &amp; Total Daily Energy Expenditure (TDEE)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded border border-purple-300">
            METABOLIC EQUATIONS
          </span>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="p-4 bg-purple-50/40 border-b border-purple-100 grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
          {/* BMR Equation Selector */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase tracking-wider text-purple-950">
              Select BMR Equation
            </label>
            <select
              value={bmrEquation}
              onChange={(e) => setBmrEquation(e.target.value as BmrEquationType)}
              className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#7016B7] cursor-pointer"
            >
              <option value="Mifflin-St Jeor">Mifflin-St Jeor (Standard Clinical)</option>
              <option value="Harris-Benedict">Harris-Benedict (Original 1919)</option>
              <option value="Revised Harris-Benedict">Revised Harris-Benedict (Roza &amp; Shizgal 1984)</option>
              <option value="Schofield">Schofield (WHO / FAO Expert Consultation)</option>
            </select>
          </div>

          {/* Activity Level Selector */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase tracking-wider text-purple-950">
              Select Physical Activity Level
            </label>
            <select
              value={selectedActivityLevel}
              onChange={(e) => {
                const val = e.target.value as ActivityLevelOption;
                setSelectedActivityLevel(val);
                if (onUpdateGeneralInfo) {
                  let mapped: GeneralInfo['activityLevel'] = 'moderately_active';
                  if (val === 'Sedentary') mapped = 'sedentary';
                  else if (val === 'Lightly Active') mapped = 'lightly_active';
                  else if (val === 'Moderately Active') mapped = 'moderately_active';
                  else if (val === 'Very Active') mapped = 'very_active';
                  else if (val === 'Athlete / Extremely Active') mapped = 'extra_active';
                  onUpdateGeneralInfo({ activityLevel: mapped });
                }
              }}
              className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#7016B7] cursor-pointer"
            >
              <option value="Sedentary">Sedentary (1.20 - Desk job / no exercise)</option>
              <option value="Lightly Active">Lightly Active (1.375 - 1-3 days/week exercise)</option>
              <option value="Moderately Active">Moderately Active (1.55 - 3-5 days/week exercise)</option>
              <option value="Very Active">Very Active (1.725 - 6-7 days/week exercise)</option>
              <option value="Athlete / Extremely Active">Athlete / Extremely Active (1.90 - Intense athletic training)</option>
            </select>
          </div>

          {/* EER Goal Selector */}
          <div className="space-y-1">
            <label className="block text-[11px] font-black uppercase tracking-wider text-purple-950">
              Select Caloric Goal
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value as GoalOption)}
              className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#7016B7] cursor-pointer"
            >
              <option value="Maintenance">Maintenance (100% TDEE Balance)</option>
              <option value="Weight Loss (-0.5 kg/wk)">Weight Reduction (-500 kcal/day deficit)</option>
              <option value="Weight Gain (+0.5 kg/wk)">Weight Gain (+500 kcal/day surplus)</option>
            </select>
          </div>
        </div>

        {/* Energy Calculations Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse border border-purple-200 rounded-xl text-xs">
            <thead>
              <tr className="bg-[#F3E8FF] text-[#4C1D95] font-extrabold uppercase tracking-wider text-[11px] divide-x divide-purple-200">
                <th className="py-2.5 px-4 w-[28%]">Parameter</th>
                <th className="py-2.5 px-3 w-[18%] text-center">Value</th>
                <th className="py-2.5 px-3 w-[12%] text-center">Unit</th>
                <th className="py-2.5 px-4 w-[42%]">Formula / Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 font-medium text-slate-900">
              {/* Basal Metabolic Rate (BMR) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Basal Metabolic Rate (BMR)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-[#7016B7] text-sm">
                  {bmrResult.value !== null ? bmrResult.value : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kcal/day</td>
                <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                  {bmrResult.formulaNote}
                </td>
              </tr>

              {/* BMR Formula / Method */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">BMR Formula / Selected Method</td>
                <td className="py-3 px-3 text-center font-extrabold text-[#7016B7]">
                  {bmrEquation}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-400">--</td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed text-[11px]">
                  {bmrEquation === 'Mifflin-St Jeor' && 'Male: (10×W) + (6.25×H) - (5×A) + 5 | Female: (10×W) + (6.25×H) - (5×A) - 161'}
                  {bmrEquation === 'Harris-Benedict' && 'Male: 66.47 + (13.75×W) + (5.00×H) - (6.75×A) | Female: 655.10 + (9.56×W) + (1.85×H) - (4.68×A)'}
                  {bmrEquation === 'Revised Harris-Benedict' && 'Male: 88.36 + (13.40×W) + (4.80×H) - (5.68×A) | Female: 447.59 + (9.25×W) + (3.10×H) - (4.33×A)'}
                  {bmrEquation === 'Schofield' && 'WHO/FAO Age-bracketed linear weight equations (18-29 yrs, 30-59 yrs, 60+ yrs)'}
                </td>
              </tr>

              {/* Total Daily Energy Expenditure (TDEE) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Total Daily Energy Expenditure (TDEE)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-emerald-700 text-sm">
                  {calculatedTdee !== null ? calculatedTdee : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kcal/day</td>
                <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                  BMR ({bmrResult.value || 0} kcal) × Activity Multiplier ({ACTIVITY_FACTORS[selectedActivityLevel]})
                </td>
              </tr>

              {/* Activity Factor */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Activity Factor</td>
                <td className="py-3 px-3 text-center font-mono font-extrabold text-slate-900 text-xs">
                  {ACTIVITY_FACTORS[selectedActivityLevel]}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">Multiplier</td>
                <td className="py-3 px-4 text-slate-700 font-bold">
                  {selectedActivityLevel}
                </td>
              </tr>

              {/* Estimated Energy Requirement (EER) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Estimated Energy Requirement (EER)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-[#7016B7] text-sm">
                  {calculatedEer !== null ? calculatedEer : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kcal/day</td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Target Caloric Prescription ({selectedGoal})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — ANTHROPOMETRIC INTERPRETATION                                 */}
      {/* ========================================================================= */}
      <section id="sec-interpretation" className="bg-white rounded-2xl border border-purple-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="bg-[#FAF5FF] border-b border-purple-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-100 text-[#7016B7]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-950">
                SECTION 4 — ANTHROPOMETRIC INTERPRETATION
              </h2>
              <p className="text-[11px] text-slate-500">
                BMI Classification, Ideal Body Weight &amp; Healthy Weight Envelope Targets
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded border border-purple-300">
            CLINICAL DIAGNOSTICS
          </span>
        </div>

        {/* Structured Summary Cards (Clinical Targets & Interpretation) */}
        <div className="p-4 bg-purple-50/30 border-b border-purple-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Card 1: Nutritional Status */}
          <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Nutritional Status
              </span>
              <span className="w-2 h-2 rounded-full bg-[#7016B7]" />
            </div>
            <div>
              {bmiCategoryInfo ? (
                <span className={`px-2 py-0.5 rounded text-[11px] font-black border uppercase tracking-wide inline-block ${bmiCategoryInfo.badgeColor}`}>
                  {bmiCategoryInfo.label}
                </span>
              ) : (
                <span className="text-slate-400 font-normal italic text-xs">Not Available</span>
              )}
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                BMI: {calculatedBmi !== null ? `${calculatedBmi.toFixed(1)} kg/m²` : '--'}
              </p>
            </div>
          </div>

          {/* Card 2: Body Fat Status */}
          <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Body Fat Status
              </span>
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div>
              {bodyFatStatusInfo ? (
                <span className={`px-2 py-0.5 rounded text-[11px] font-black border uppercase tracking-wide inline-block ${bodyFatStatusInfo.badgeColor}`}>
                  {bodyFatStatusInfo.label}
                </span>
              ) : (
                <span className="text-slate-400 font-normal italic text-xs">Awaiting BCA</span>
              )}
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Fat: {numFatPercentage !== null ? `${numFatPercentage}%` : '--'}
              </p>
            </div>
          </div>

          {/* Card 3: Visceral Fat Risk */}
          <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Visceral Fat Risk
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              {visceralFatRiskInfo ? (
                <span className={`px-2 py-0.5 rounded text-[11px] font-black border uppercase tracking-wide inline-block ${visceralFatRiskInfo.badgeColor}`}>
                  {visceralFatRiskInfo.label}
                </span>
              ) : (
                <span className="text-slate-400 font-normal italic text-xs">Awaiting BCA</span>
              )}
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Level: {recordedVisceralFat !== null ? recordedVisceralFat : '--'}
              </p>
            </div>
          </div>

          {/* Card 4: Ideal Body Weight */}
          <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Ideal Body Weight (IBW)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
            <div>
              <span className="text-base font-black text-emerald-700 font-mono">
                {calculatedIbw !== null ? `${calculatedIbw} kg` : '--'}
              </span>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                {numHeight ? `For ${numHeight} cm` : 'ICMR Calibrated'}
              </p>
            </div>
          </div>

          {/* Card 5: Calorie Target Range */}
          <div className="p-3.5 rounded-xl bg-white border border-purple-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Calorie Target Range
              </span>
              <span className="w-2 h-2 rounded-full bg-[#7016B7]" />
            </div>
            <div>
              <span className="text-xs font-black text-[#7016B7] font-mono block">
                {calorieTargetRange.range}
              </span>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                {calorieTargetRange.goalLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Anthropometric Interpretation Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse border border-purple-200 rounded-xl text-xs">
            <thead>
              <tr className="bg-[#F3E8FF] text-[#4C1D95] font-extrabold uppercase tracking-wider text-[11px] divide-x divide-purple-200">
                <th className="py-2.5 px-4 w-[24%]">Parameter</th>
                <th className="py-2.5 px-3 w-[18%] text-center">Clinical Value</th>
                <th className="py-2.5 px-3 w-[12%] text-center">Unit</th>
                <th className="py-2.5 px-4 w-[22%]">Classification / Reference Range</th>
                <th className="py-2.5 px-4 w-[24%]">Clinical Interpretation &amp; Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 font-medium text-slate-900">
              {/* Row 1: Nutritional Status (BMI Classification) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Nutritional Status (BMI Classification)</td>
                <td className="py-3 px-3 text-center">
                  {bmiCategoryInfo ? (
                    <span className={`px-2.5 py-1 rounded text-xs font-black border uppercase tracking-wide inline-block ${bmiCategoryInfo.badgeColor}`}>
                      {bmiCategoryInfo.label}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal italic text-xs">Not Available</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-400">Category</td>
                <td className="py-3 px-4 text-slate-700">
                  WHO &amp; ICMR Asia-Pacific Reference
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {bmiCategoryInfo ? bmiCategoryInfo.description : 'Awaiting height and weight biometric input'}
                </td>
              </tr>

              {/* Row 2: Body Fat Status (Normal / Overfat / Obese / Athletic) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Body Fat Status</td>
                <td className="py-3 px-3 text-center">
                  {bodyFatStatusInfo ? (
                    <span className={`px-2.5 py-1 rounded text-xs font-black border uppercase tracking-wide inline-block ${bodyFatStatusInfo.badgeColor}`}>
                      {bodyFatStatusInfo.label}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal italic text-xs">Not Available</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">
                  {numFatPercentage !== null ? `${numFatPercentage}%` : '--'}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {sex === 'Male' ? 'Normal: 10 - 20% (Athletic <10%)' : 'Normal: 18 - 28% (Athletic <18%)'}
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {bodyFatStatusInfo ? bodyFatStatusInfo.description : 'Awaiting body fat percentage from biometric data'}
                </td>
              </tr>

              {/* Row 3: Visceral Fat Risk (Low / Moderate / High Risk) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Visceral Fat Risk</td>
                <td className="py-3 px-3 text-center">
                  {visceralFatRiskInfo ? (
                    <span className={`px-2.5 py-1 rounded text-xs font-black border uppercase tracking-wide inline-block ${visceralFatRiskInfo.badgeColor}`}>
                      {visceralFatRiskInfo.label}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal italic text-xs">Not Available</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">
                  {recordedVisceralFat !== null ? `Level ${recordedVisceralFat}` : '--'}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  Low Risk: Level 1 - 9 | High Risk &ge; 15
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {visceralFatRiskInfo ? visceralFatRiskInfo.description : 'Awaiting visceral fat scan score'}
                </td>
              </tr>

              {/* Row 4: Ideal Body Weight (IBW) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Ideal Body Weight (IBW)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-emerald-700 text-sm">
                  {calculatedIbw !== null ? `${calculatedIbw} kg` : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg</td>
                <td className="py-3 px-4 text-slate-700">
                  Height-Calibrated ({numHeight ? `${numHeight} cm` : 'Not recorded'})
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Midpoint weight corresponding to optimal BMI (21.5 kg/m² for Females / 22.0 kg/m² for Males)
                </td>
              </tr>

              {/* Row 5: Calorie Target Range (based on clinical goal: Maintenance / Loss / Gain) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Calorie Target Range</td>
                <td className="py-3 px-3 text-center font-mono font-black text-[#7016B7] text-xs">
                  {calorieTargetRange.range}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kcal/day</td>
                <td className="py-3 px-4 text-slate-700 font-bold">
                  {calorieTargetRange.goalLabel}
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  {calorieTargetRange.description}
                </td>
              </tr>

              {/* Row 6: Body Mass Index (BMI) */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Body Mass Index (BMI)</td>
                <td className="py-3 px-3 text-center font-mono font-black text-[#7016B7] text-sm">
                  {calculatedBmi !== null ? calculatedBmi.toFixed(1) : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg/m²</td>
                <td className="py-3 px-4 text-slate-700">
                  18.5 - 24.9 kg/m² (Normal Envelope)
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Formula: Weight (kg) / (Height in meters)²
                </td>
              </tr>

              {/* Row 7: Weight Status vs IBW */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Weight Status vs IBW</td>
                <td className="py-3 px-3 text-center font-bold text-slate-900">
                  {weightStatusText}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">Variance</td>
                <td className="py-3 px-4 text-slate-700">
                  IBW Target Envelope (±10%)
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Physiological body mass variance relative to ideal reference standard
                </td>
              </tr>

              {/* Row 8: Recommended Weight Range */}
              <tr className="hover:bg-purple-50/30 transition-colors divide-x divide-purple-100">
                <td className="py-3 px-4 font-black text-slate-950">Recommended Weight Range</td>
                <td className="py-3 px-3 text-center font-mono font-black text-slate-950 text-xs">
                  {recommendedWeightRange ? `${recommendedWeightRange.min} kg - ${recommendedWeightRange.max} kg` : <span className="text-slate-400 font-sans font-normal italic text-xs">Not Available</span>}
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">kg range</td>
                <td className="py-3 px-4 text-slate-700">
                  BMI 18.5 - 24.9 kg/m²
                </td>
                <td className="py-3 px-4 text-slate-700 leading-relaxed">
                  Calculated healthy body mass envelope for patient&apos;s height ({numHeight || '--'} cm)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT BIOMETRICS MODAL                                           */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in no-print">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 text-[#7016B7]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Edit Patient Biometric Data
                  </h3>
                  <p className="text-xs text-slate-500">
                    Updates Profile &amp; Biometric Records in real-time
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalEdits} className="space-y-4 text-xs">
              {/* Row 1: Name & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. Kiruthika Sundar"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. 25"
                  />
                </div>
              </div>

              {/* Row 2: Sex, Height, Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sex
                  </label>
                  <select
                    value={editForm.sex}
                    onChange={(e) => setEditForm({ ...editForm, sex: e.target.value as Sex })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. 161"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. 55"
                  />
                </div>
              </div>

              {/* Row 3: Body Composition Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Body Fat Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.fatPercentage}
                    onChange={(e) => setEditForm({ ...editForm, fatPercentage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. 24.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Muscle Mass (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.muscleMass}
                    onChange={(e) => setEditForm({ ...editForm, muscleMass: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. 22.0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Visceral Fat Level (1-30)
                  </label>
                  <input
                    type="number"
                    value={editForm.visceralFat}
                    onChange={(e) => setEditForm({ ...editForm, visceralFat: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="e.g. 4"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Fat-Free Mass / FFM (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.ffm}
                    onChange={(e) => setEditForm({ ...editForm, ffm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7016B7]"
                    placeholder="Auto-calculated if blank"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7016B7] hover:bg-[#5B0F96] text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Biometrics</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VIEW SOURCE DATA MODAL                                          */}
      {/* ========================================================================= */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in no-print">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-purple-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 text-[#7016B7]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Original Biometric Data Audit Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Source record synchronization vault for {patientName || 'Patient'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSourceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-[#4C1D95]">
                <p className="font-bold flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#7016B7]" />
                  Active Profile Snapshot:
                </p>
                <p className="text-[11px] text-purple-900 mt-1 font-mono">
                  Height: {numHeight !== null ? `${numHeight} cm` : 'Not recorded'} | Weight: {numWeight !== null ? `${numWeight} kg` : 'Not recorded'} | Age: {numAge !== null ? `${numAge} yrs` : 'Not recorded'} | Sex: {sex}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200">
                  Recorded Biometric Spreadsheet History:
                </div>
                <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                  {fallbackBiometrics ? (
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                      <div className="font-bold text-slate-900 flex justify-between">
                        <span>Record Date: {fallbackBiometrics.date || currentDateFormatted}</span>
                        <span className="text-[#7016B7]">Source: Biometric Vault</span>
                      </div>
                      <div>Height: {fallbackBiometrics.height} cm | Weight: {fallbackBiometrics.weight} kg</div>
                      <div>Fat%: {fallbackBiometrics.fatPercent || 'N/A'}% | Muscle Mass: {fallbackBiometrics.muscleMass || 'N/A'} kg | Visceral Fat: {fallbackBiometrics.visceral || 'N/A'}</div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic p-2">
                      No prior spreadsheet log entries. Measurements are live-sourced directly from patient profile.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsSourceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
