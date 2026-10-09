// Shared Canonical Folder Definitions for ELSHA (Client & Server safe - pure TypeScript data)
export interface CanonicalFolderMeta {
  id: string;
  name: string;
  category: string;
}

export const CANONICAL_FOLDERS: CanonicalFolderMeta[] = [
  { id: 'profile', name: 'Profile', category: 'Patient Intake & Clinical History' },
  { id: 'biometrics', name: 'Biometric Data', category: 'Vitals & Body Comp' },
  { id: 'medicinal', name: 'Medical Consultation & Records', category: 'Clinical Consultation' },
  { id: 'nutrition', name: 'Nutrition', category: 'Dietary Habits & Protocols' },
  { id: 'anthropometry', name: 'Anthropometry', category: 'Body Composition & Energy' },
  { id: 'rda', name: 'RDA Requirements', category: 'ICMR-NIN Targets' },
  { id: '7-day-diet-plan', name: '7-Day Diet Plan', category: 'Clinical Meal Plans' },
  { id: 'exercise', name: 'Exercise Guidance', category: 'Performance & Strength' },
  { id: 'physiotherapy', name: 'Physiotherapy & Fitness Guidelines', category: 'Rehabilitation' },
  { id: 'client-folder', name: 'Client Folder', category: 'Dossier Directory & Vault' },
  { id: 'whatsapp', name: 'WhatsApp Hub', category: 'Patient Comms & Dispatch' },
  { id: 'document-verification', name: 'Document Verification', category: 'Clinical Integrity' },
  { id: 'clinicalnotes', name: 'Clinical Consultation Notes', category: 'Attending Physician Records' },
];
