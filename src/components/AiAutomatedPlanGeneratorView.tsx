import React from 'react';
import { GeneralInfo, Calculations, DietaryRecallItem, MedicalHistory } from '../types';
import { AiPersonalized2PagePlanView } from './AiPersonalized2PagePlanView';

export interface AiAutomatedPlanGeneratorViewProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  initialDomain?: string;
  initialDietDomain?: string;
  dietaryRecall?: DietaryRecallItem[];
  medicalHistory?: MedicalHistory;
  onOpenPrescription?: () => void;
}

export const AiAutomatedPlanGeneratorView: React.FC<AiAutomatedPlanGeneratorViewProps> = ({
  generalInfo,
  calculations,
  initialDomain = 'diabetes',
  initialDietDomain = 'low_carbs',
  dietaryRecall = [],
  medicalHistory,
  onOpenPrescription,
}) => {
  return (
    <AiPersonalized2PagePlanView
      generalInfo={generalInfo}
      calculations={calculations}
      initialDomain={initialDomain}
      initialDietDomain={initialDietDomain}
      dietaryRecall={dietaryRecall}
      medicalHistory={medicalHistory}
      onOpenPrescription={onOpenPrescription}
    />
  );
};
