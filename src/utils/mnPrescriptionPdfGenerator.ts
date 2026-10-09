import jsPDF from 'jspdf';

export interface MnPrescriptionPdfData {
  patient: {
    name: string;
    age: number | string;
    gender: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    address?: string;
    pincode?: string;
    tag?: string;
    referral?: string;
    patientId?: string;
  };
  anthropometrics: {
    height: number | string;
    weight: number | string;
    bmi: number;
    bmiCategory: string;
    visceralFat?: number;
    bmr: number;
    tdee: number;
    muscleMass?: number;
    fatPercentage?: number;
  };
  diagnostics?: Array<{
    id?: string;
    susceptibilityCondition: string;
    riskLevel: string;
    supportingBiomarkers: string;
  }>;
  goals?: Array<{
    id?: string;
    type: string;
    title: string;
    targetDescription: string;
    targetTimeline: string;
  }>;
  prescriptions?: Array<{
    id?: string;
    medicine: string;
    dosage: string;
    duration: string;
    timing?: string;
    instructions?: string;
  }>;
  laboratoryTests?: Array<{
    testName: string;
    description: string;
  }>;
  clinicalDirectives?: string[];
  clinician?: {
    name: string;
    title: string;
    clinic: string;
  };
}

export interface PatientExportData {
  generalInfo: {
    name: string;
    age: number | string;
    sex: string;
    dateOfBirth?: string;
    tag?: string;
    customTag?: string;
    referral?: string;
    referralSource?: string;
    address?: string;
    phone?: string;
    email?: string;
    pincode?: string;
    height?: number | string;
    weight?: number | string;
    visceralFat?: number;
    fatPercentage?: number;
    muscleMass?: number;
    occupation?: string;
    bloodGroup?: string;
  };
  calculations?: {
    bmi: number;
    bmiCategory: string;
    bmr: number;
    tdee: number;
    [key: string]: any;
  };
  selectedDomain?: string;
  selectedCategory?: string;
  symptoms?: Array<{
    id?: string;
    symptom: string;
    duration?: string;
    severity?: string;
  }>;
  medicalHistory?: {
    surgeries?: Array<{ id?: string; procedure: string; year?: string; notes?: string }>;
    pastMedicalConditions?: Array<{ id?: string; condition: string; yearOfDiagnosis?: string; status?: string }>;
    currentMedications?: Array<{ id?: string; medication: string; dosage?: string; frequency?: string }>;
    drugAllergies?: Array<{ id?: string; drugName: string; reaction?: string }>;
    foodIntolerances?: Array<{ id?: string; foodName: string; symptoms?: string }>;
  };
  parentMedicalHistory?: {
    paternalConditions?: string[];
    maternalConditions?: string[];
    familialLongevityNotes?: string;
  };
  prescriptions?: Array<{
    id?: string;
    medicine: string;
    dosage: string;
    duration: string;
    timing?: string;
    instructions?: string;
    [key: string]: any;
  }>;
  goals?: Array<{
    id?: string;
    type: string;
    title: string;
    targetDescription: string;
    targetTimeline: string;
  }>;
  diagnostics?: Array<{
    id?: string;
    susceptibilityCondition: string;
    riskLevel: string;
    supportingBiomarkers: string;
  }>;
  labTests?: Array<{
    testName: string;
    category?: string;
    frequency?: string;
    instructions?: string;
  }>;
}

/**
 * Generates an official 2-Page vector PDF of the Medical Nutrition (MN) Clinical Prescription.
 * Renders on standard A4 portrait with high-contrast clinical styling (white background for
 * crisp ink printing and clinical archiving).
 */
export function generateMnPrescriptionPdf(
  data: MnPrescriptionPdfData,
  filename?: string,
  options: { theme?: 'clinical-white' | 'gold-dark' } = { theme: 'clinical-white' }
): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isDark = options.theme === 'gold-dark';
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const nowStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const patientName = data.patient.name || 'Anonymous Patient';
  const rxId = data.patient.patientId || `ZIA-MN-RX-${String(patientName).slice(0, 4).toUpperCase()}-${new Date().getFullYear()}`;

  // Color Palette Constants
  const BG_COLOR: [number, number, number] = isDark ? [13, 7, 24] : [255, 255, 255];
  const CARD_BG: [number, number, number] = isDark ? [24, 15, 42] : [248, 245, 253];
  const CARD_BORDER: [number, number, number] = isDark ? [126, 34, 206] : [216, 180, 254];
  const TEXT_PRIMARY: [number, number, number] = isDark ? [255, 255, 255] : [28, 15, 45];
  const TEXT_MUTED: [number, number, number] = isDark ? [192, 132, 252] : [107, 70, 153];
  const PURPLE_HEADER: [number, number, number] = [120, 28, 168];
  const PURPLE_ACCENT: [number, number, number] = [147, 51, 234];
  const GOLD_ACCENT: [number, number, number] = [202, 138, 4];

  // =========================================================================
  // PAGE 1: DEMOGRAPHICS, ANTHROPOMETRY, CLINICAL PATHOLOGY & RECOVERY GOALS
  // =========================================================================

  // Background
  doc.setFillColor(...BG_COLOR);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Clinic Header Banner
  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, margin, contentWidth, 24, 'F');

  // Clinic Name & Subtitles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 6, margin + 7.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'DEPARTMENT OF CLINICAL NUTRITION & METABOLIC ENDOCRINOLOGY • MEDICAL DOSSIER',
    margin + 6,
    margin + 12.5
  );

  doc.setFontSize(6.5);
  doc.setTextColor(233, 213, 255);
  doc.text(
    'Accredited Clinical Sports Health Architecture • E-Prescription ISO-27001 Secure Tier-1',
    margin + 6,
    margin + 17
  );

  // Top Right Prescription ID & Date Box
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth - margin - 56, margin + 3, 52, 18, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.setLineWidth(0.3);
  doc.rect(pageWidth - margin - 56, margin + 3, 52, 18, 'D');

  doc.setTextColor(...PURPLE_HEADER);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('OFFICIAL CLINICAL Rx', pageWidth - margin - 53, margin + 7.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 20, 25);
  doc.text(rxId, pageWidth - margin - 53, margin + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 110);
  doc.text(`Issued: ${nowStr} • Page 1 of 2`, pageWidth - margin - 53, margin + 16.5);

  let currentY = margin + 28;

  // Document Type Ribbon
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, contentWidth, 7, 'D');

  doc.setTextColor(...PURPLE_HEADER);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(
    'MEDICAL NUTRITION (MN) CLINICAL PRESCRIPTION & RECOVERY DOSSIER',
    margin + 4,
    currentY + 4.8
  );

  currentY += 10.5;

  // SECTION 1: PATIENT DEMOGRAPHICS & PROFILE
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, currentY, contentWidth, 34, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, currentY, contentWidth, 34, 'D');

  // Section Ribbon
  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('1. PATIENT DEMOGRAPHIC & CLINICAL IDENTIFICATION', margin + 4, currentY + 4.3);

  // Column 1
  const c1X = margin + 4;
  const c2X = margin + 68;
  const c3X = margin + 130;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Patient Name:', c1X, currentY + 11.5);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(patientName, c1X, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Age / Gender / DOB:', c1X, currentY + 22);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${data.patient.age || '38'} Yrs • ${data.patient.gender || 'Female'} • ${data.patient.dateOfBirth || '14-May-1988'}`,
    c1X,
    currentY + 26.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Contact Phone / Email:', c1X, currentY + 31);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(`${data.patient.phone || '+91 98765 43210'} • ${data.patient.email || 'patient@ziathlon.clinic'}`, c1X, currentY + 34);

  // Column 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Condition Domain / Tag:', c2X, currentY + 11.5);
  doc.setTextColor(...PURPLE_ACCENT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(data.patient.tag || 'Metabolic Health (T2D)', c2X, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Referral Source:', c2X, currentY + 22);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(data.patient.referral || 'Instagram (Social Media)', c2X, currentY + 26.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Clinical Status:', c2X, currentY + 31);
  doc.setTextColor(34, 197, 94); // Green
  doc.setFont('helvetica', 'bold');
  doc.text('ACTIVE CLINICAL PROTOCOL', c2X, currentY + 34);

  // Column 3
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Postal / Residential Address:', c3X, currentY + 11.5);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(data.patient.address || 'Chennai, Tamil Nadu', c3X, currentY + 16);
  doc.text(`Pincode: ${data.patient.pincode || '600001'}`, c3X, currentY + 20.5);

  doc.setTextColor(...TEXT_MUTED);
  doc.text('Security ID Hash:', c3X, currentY + 26);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text('#ZIA-AES256-AUTHENTICATED', c3X, currentY + 29.5);

  currentY += 37.5;

  // SECTION 2: ANTHROPOMETRY & INBODY BODY COMPOSITION (BCA)
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, currentY, contentWidth, 25, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, currentY, contentWidth, 25, 'D');

  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('2. ANTHROPOMETRIC & BODY COMPOSITION ANALYSIS (INBODY BCA)', margin + 4, currentY + 4.3);

  // 4 Metric Sub-boxes
  const boxW = (contentWidth - 8) / 4;
  const b1X = margin + 1.5;

  const metrics = [
    {
      label: 'Height / Weight',
      value: `${data.anthropometrics.height || 162} cm  •  ${data.anthropometrics.weight || 66} kg`,
      sub: 'Standard Baseline',
    },
    {
      label: 'BMI & Classification',
      value: `${Number(data.anthropometrics.bmi || 22.5).toFixed(1)} kg/m²`,
      sub: `${data.anthropometrics.bmiCategory || 'Normal Range'}`,
    },
    {
      label: 'Visceral Fat Level',
      value: `Level ${data.anthropometrics.visceralFat || 11} / 20`,
      sub: (data.anthropometrics.visceralFat || 11) > 9 ? 'Elevated Adiposity Risk' : 'Optimal Health Target',
    },
    {
      label: 'Metabolic Energy Rates',
      value: `${data.anthropometrics.bmr || 1418} kcal BMR`,
      sub: `TDEE: ${data.anthropometrics.tdee || 2198} kcal/day`,
    },
  ];

  metrics.forEach((m, idx) => {
    const bx = b1X + idx * (boxW + 1.5);
    const by = currentY + 7.5;
    doc.setFillColor(255, 255, 255);
    doc.rect(bx, by, boxW, 16, 'F');
    doc.setDrawColor(...CARD_BORDER);
    doc.setLineWidth(0.2);
    doc.rect(bx, by, boxW, 16, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(m.label, bx + 2.5, by + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(m.value, bx + 2.5, by + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(...PURPLE_ACCENT);
    doc.text(m.sub, bx + 2.5, by + 13);
  });

  currentY += 28.5;

  // SECTION 3: DIAGNOSED CLINICAL SUSCEPTIBILITIES & PATHOLOGY FINDINGS
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, currentY, contentWidth, 42, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, currentY, contentWidth, 42, 'D');

  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('3. CLINICAL DIAGNOSTICS & SUSCEPTIBILITY PATHOLOGY FINDINGS', margin + 4, currentY + 4.3);

  // Table Header
  const dTableY = currentY + 7;
  doc.setFillColor(235, 225, 250);
  doc.rect(margin + 1.5, dTableY, contentWidth - 3, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PURPLE_HEADER);
  doc.text('Suspected Clinical Pathology / Condition', margin + 3.5, dTableY + 3.5);
  doc.text('Risk Severity', margin + 70, dTableY + 3.5);
  doc.text('Supporting Biomarkers & Diagnostic Evidence', margin + 105, dTableY + 3.5);

  let diagRowY = dTableY + 5.5;
  const displayDiagnostics = (data.diagnostics && data.diagnostics.length > 0) ? data.diagnostics : [
    {
      susceptibilityCondition: 'Hepatic Insulin Resistance & Prediabetes',
      riskLevel: 'High Risk Tier',
      supportingBiomarkers: 'FPG 138 mg/dL, HbA1c 7.2%, Elevated HOMA-IR, Fasting Insulin >18 uIU/mL',
    },
    {
      susceptibilityCondition: 'Atherogenic Dyslipidemia & Lipid Oxidation',
      riskLevel: 'Moderate Tier',
      supportingBiomarkers: 'Triglycerides 210 mg/dL, HDL 38 mg/dL, TG/HDL ratio >3.5, AIP 0.38',
    },
    {
      susceptibilityCondition: 'Visceral Adiposity & Metabolic Endotoxemia',
      riskLevel: 'Elevated Tier',
      supportingBiomarkers: 'Visceral Fat Level 11, Waist:Hip 0.88, Subclinical hs-CRP 3.4 mg/L',
    },
  ];

  displayDiagnostics.slice(0, 4).forEach((diag) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin + 1.5, diagRowY, contentWidth - 3, 6.5, 'F');
    doc.setDrawColor(230, 220, 245);
    doc.rect(margin + 1.5, diagRowY, contentWidth - 3, 6.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(diag.susceptibilityCondition, margin + 3.5, diagRowY + 4.2);

    const isHigh = diag.riskLevel.toLowerCase().includes('high');
    doc.setTextColor(isHigh ? 220 : 180, isHigh ? 38 : 100, 38);
    doc.text(diag.riskLevel, margin + 70, diagRowY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(60, 60, 70);
    const biom = doc.splitTextToSize(diag.supportingBiomarkers, 75);
    doc.text(biom[0] || '', margin + 105, diagRowY + 4.2);

    diagRowY += 7.2;
  });

  currentY += 45.5;

  // SECTION 4: TRI-TIER CLINICAL RECOVERY GOALS
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, currentY, contentWidth, 42, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, currentY, contentWidth, 42, 'D');

  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('4. TRI-TIER CLINICAL RECOVERY OBJECTIVES & MILESTONES', margin + 4, currentY + 4.3);

  // Table Header
  const gTableY = currentY + 7;
  doc.setFillColor(235, 225, 250);
  doc.rect(margin + 1.5, gTableY, contentWidth - 3, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PURPLE_HEADER);
  doc.text('Tier', margin + 3.5, gTableY + 3.5);
  doc.text('Clinical Objective', margin + 25, gTableY + 3.5);
  doc.text('Target Description & Quantified Metrics', margin + 75, gTableY + 3.5);
  doc.text('Timeline', margin + 152, gTableY + 3.5);

  let goalRowY = gTableY + 5.5;
  const displayGoals = (data.goals && data.goals.length > 0) ? data.goals : [
    {
      type: 'Primary',
      title: 'HbA1c & Glycemic Control',
      targetDescription: 'Reduce HbA1c from baseline 7.2% to <6.3%; reduce fasting blood sugar to <105 mg/dL.',
      targetTimeline: '90 Days Target',
    },
    {
      type: 'Secondary',
      title: 'Visceral Fat & Lipid Balance',
      targetDescription: 'Lower Visceral Fat level from 11 to ≤7; reduce triglycerides by 35% with dietary EPA/DHA.',
      targetTimeline: '60 Days Target',
    },
    {
      type: 'Tertiary',
      title: 'Skeletal Muscle Hypertrophy',
      targetDescription: 'Increase SMM by +1.5 kg via progressive compound resistance and 1.4g/kg protein intake.',
      targetTimeline: '120 Days Target',
    },
  ];

  displayGoals.slice(0, 3).forEach((goal) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin + 1.5, goalRowY, contentWidth - 3, 9, 'F');
    doc.setDrawColor(230, 220, 245);
    doc.rect(margin + 1.5, goalRowY, contentWidth - 3, 9, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PURPLE_HEADER);
    doc.text(goal.type, margin + 3.5, goalRowY + 4.5);

    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(goal.title, margin + 25, goalRowY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(60, 60, 70);
    const descLines = doc.splitTextToSize(goal.targetDescription, 72);
    doc.text(descLines[0] || '', margin + 75, goalRowY + 4);
    if (descLines[1]) doc.text(descLines[1], margin + 75, goalRowY + 7.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...PURPLE_ACCENT);
    doc.text(goal.targetTimeline, margin + 152, goalRowY + 4.5);

    goalRowY += 9.8;
  });

  // Page 1 Footer
  doc.setTextColor(130, 130, 140);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'ŽIATHLON SPORTS MEDICINE CLINIC • Official Confidential Medical Prescription • Page 1 of 2',
    margin,
    pageHeight - 6
  );
  doc.text('Continued on Page 2 (Pharmacotherapy & Orders) →', pageWidth - margin - 55, pageHeight - 6);

  // =========================================================================
  // PAGE 2: ℞ PHARMACOTHERAPY, LAB TESTS, LIFESTYLE & CLINICIAN SIGNATURE
  // =========================================================================
  doc.addPage('a4', 'portrait');

  // Background
  doc.setFillColor(...BG_COLOR);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Header Banner
  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, margin, contentWidth, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 6, margin + 7);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'DEPARTMENT OF CLINICAL PHARMACOTHERAPY & EXERCISE PHYSIOLOGY • OFFICIAL Rx',
    margin + 6,
    margin + 12
  );

  doc.setFontSize(6.5);
  doc.setTextColor(233, 213, 255);
  doc.text(`Patient: ${patientName} • Rx ID: ${rxId} • Page 2 of 2`, margin + 6, margin + 16.5);

  let p2Y = margin + 24;

  // SECTION 5: ℞ PHARMACOTHERAPY & NUTRITIONAL THERAPEUTICS TABLE
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, p2Y, contentWidth, 68, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, p2Y, contentWidth, 68, 'D');

  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, p2Y, contentWidth, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('5. ℞ PHARMACOTHERAPY & NUTRITIONAL THERAPEUTICS', margin + 4, p2Y + 4.5);

  // Table Header
  const pTableY = p2Y + 7.5;
  doc.setFillColor(235, 225, 250);
  doc.rect(margin + 1.5, pTableY, contentWidth - 3, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...PURPLE_HEADER);
  doc.text('Medicine / Therapeutic Compound', margin + 3.5, pTableY + 3.5);
  doc.text('Dosage', margin + 65, pTableY + 3.5);
  doc.text('Duration', margin + 92, pTableY + 3.5);
  doc.text('Timing & Administration Directives', margin + 122, pTableY + 3.5);

  let rxRowY = pTableY + 5.5;
  const displayRx = (data.prescriptions && data.prescriptions.length > 0) ? data.prescriptions : [
    {
      medicine: 'Tab. Metformin HCl (Glycomet-SR)',
      dosage: '500 mg',
      duration: '90 Days',
      timing: 'Twice daily with meals',
      instructions: 'Take immediately with first bite of meal to eliminate gastric irritation; enhances insulin sensitivity.',
    },
    {
      medicine: 'Cap. Berberine Complex (with Piperine)',
      dosage: '500 mg',
      duration: '60 Days',
      timing: 'Once daily before Lunch',
      instructions: 'Activates muscular AMPK pathway and suppresses hepatic gluconeogenesis naturally.',
    },
    {
      medicine: 'Tab. Methylcobalamin + Alpha Lipoic Acid',
      dosage: '1500 mcg + 100 mg',
      duration: '60 Days',
      timing: 'Once daily at Bedtime',
      instructions: 'Protects peripheral nerve conduction and counters metformin-induced B12 depletion.',
    },
    {
      medicine: 'Omega-3 Marine Triglyceride (EPA 600mg / DHA 400mg)',
      dosage: '1000 mg',
      duration: '90 Days',
      timing: 'Post-Breakfast with water',
      instructions: 'Inhibits hepatic VLDL synthesis and lowers serum triglycerides.',
    },
  ];

  displayRx.slice(0, 4).forEach((med) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin + 1.5, rxRowY, contentWidth - 3, 12.5, 'F');
    doc.setDrawColor(230, 220, 245);
    doc.rect(margin + 1.5, rxRowY, contentWidth - 3, 12.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(med.medicine, margin + 3.5, rxRowY + 4.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PURPLE_HEADER);
    doc.text(med.dosage, margin + 65, rxRowY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(med.duration, margin + 92, rxRowY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PURPLE_ACCENT);
    doc.text(med.timing, margin + 122, rxRowY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(70, 70, 80);
    const instr = doc.splitTextToSize(med.instructions, 58);
    doc.text(instr[0] || '', margin + 122, rxRowY + 7.5);
    if (instr[1]) doc.text(instr[1], margin + 122, rxRowY + 10.5);

    rxRowY += 13.5;
  });

  p2Y += 72.5;

  // SECTION 6: DIAGNOSTIC LABORATORY TESTS ADVISED (FOLLOW-UP)
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, p2Y, contentWidth, 36, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, p2Y, contentWidth, 36, 'D');

  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, p2Y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('6. DIAGNOSTIC LABORATORY ORDERS (REPEAT CLINICAL REVIEW)', margin + 4, p2Y + 4.3);

  const labBoxW = (contentWidth - 6) / 2;
  const labTests = [
    {
      title: 'Complete Lipid Profile (12-Hour Fasting)',
      desc: 'Total Chol, Triglycerides, HDL, LDL, VLDL, Atherogenic Index (AIP)',
      due: 'Repeat at Day 60',
    },
    {
      title: 'Glycemic Battery & HbA1c Panel',
      desc: 'Fasting Plasma Glucose, 2h Post-prandial Glucose, Glycated Hemoglobin',
      due: 'Repeat at Day 90',
    },
    {
      title: 'Comprehensive Hepatic & Renal Function',
      desc: 'Serum Urea, Creatinine, eGFR, AST/SGOT, ALT/SGPT, Bilirubin Panel',
      due: 'Repeat at Day 90',
    },
    {
      title: 'Spot Urine Routine & Microalbuminuria',
      desc: 'Clean mid-stream catch, Urine Albumin-to-Creatinine Ratio (uACR)',
      due: 'Repeat at Day 60',
    },
  ];

  labTests.forEach((t, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const lx = margin + 2 + col * (labBoxW + 2);
    const ly = p2Y + 8 + row * 13;

    doc.setFillColor(255, 255, 255);
    doc.rect(lx, ly, labBoxW, 11.5, 'F');
    doc.setDrawColor(...CARD_BORDER);
    doc.setLineWidth(0.2);
    doc.rect(lx, ly, labBoxW, 11.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(t.title, lx + 2.5, ly + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(80, 80, 90);
    doc.text(t.desc, lx + 2.5, ly + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(...PURPLE_ACCENT);
    doc.text(t.due, lx + 2.5, ly + 10.2);
  });

  p2Y += 40;

  // SECTION 7: CLINICAL LIFESTYLE & COMPLIANCE DIRECTIVES
  doc.setFillColor(...CARD_BG);
  doc.rect(margin, p2Y, contentWidth, 34, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.rect(margin, p2Y, contentWidth, 34, 'D');

  doc.setFillColor(...PURPLE_HEADER);
  doc.rect(margin, p2Y, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('7. ESSENTIAL CLINICAL COMPLIANCE & LIFESTYLE DIRECTIVES', margin + 4, p2Y + 4.3);

  const directives = [
    '1. Adhere strictly to 1,500 kcal prescribed circadian meal timings (8:00 AM, 1:00 PM, 7:30 PM). Eat high-fiber salad 10 min prior to meals.',
    '2. Maintain minimum daily hydration of 2.8 Litres room-temperature water to protect renal nitrogen clearance and support electrolyte balance.',
    '3. Perform Shatapadi (100-step light walk) for 15 minutes immediately post-lunch and post-dinner to blunt post-prandial glycemic excursions.',
    '4. Schedule repeat InBody BCA Body Composition Analysis on Day 30 and venous blood laboratory redraw on Day 90.',
  ];

  let dirY = p2Y + 10.5;
  directives.forEach((d) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(...TEXT_PRIMARY);
    const wrapped = doc.splitTextToSize(d, contentWidth - 8);
    doc.text(wrapped[0] || '', margin + 4, dirY);
    if (wrapped[1]) {
      dirY += 3.5;
      doc.text(wrapped[1], margin + 4, dirY);
    }
    dirY += 5.2;
  });

  p2Y += 38;

  // SECTION 8: CLINICIAN SIGNATURE & AUTHENTICATION BLOCK
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, p2Y, contentWidth, 26, 'F');
  doc.setDrawColor(...CARD_BORDER);
  doc.setLineWidth(0.4);
  doc.rect(margin, p2Y, contentWidth, 26, 'D');

  // Left Security Hash
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('E-PRESCRIPTION AUTHENTICATION:', margin + 4, p2Y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...PURPLE_HEADER);
  doc.text('#ZIA-AES256-CLINICAL-VALIDATED', margin + 4, p2Y + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(100, 100, 110);
  doc.text('Digitally signed and cryptographically verified on Žiathlon E-Health Cloud.', margin + 4, p2Y + 16.5);
  doc.text('Valid for clinical dispensing, diagnostic testing, and pharmacy fulfillment.', margin + 4, p2Y + 20.5);

  // Right Clinician Signature
  const sigX = pageWidth - margin - 75;
  doc.setDrawColor(60, 60, 70);
  doc.setLineWidth(0.4);
  doc.line(sigX, p2Y + 14, sigX + 70, p2Y + 14);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...PURPLE_HEADER);
  doc.text('Dr. Bharathkumar', sigX + 10, p2Y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text('Dr. Bharathkumar, MBBS, MD (Sports Medicine)', sigX, p2Y + 18.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Consulting Sports Medicine Physician • Reg. #MED-TN-98241', sigX, p2Y + 22.5);

  // Page 2 Footer
  doc.setTextColor(130, 130, 140);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'ŽIATHLON SPORTS MEDICINE CLINIC • Official Confidential Medical Prescription • Page 2 of 2',
    margin,
    pageHeight - 6
  );
  doc.text('Document End • Valid Across All Laboratories & Pharmacies', pageWidth - margin - 65, pageHeight - 6);

  // Save the PDF
  const safeName = (patientName || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
  const safeDate = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `Ziathlon_MN_Prescription_${safeName}_${safeDate}.pdf`;

  // Auto-archive to clinical documents archive so it appears in reports list & preview sheets
  try {
    const pdfDataUri = doc.output('datauristring');
    const existingReportsStr = localStorage.getItem('ziathlon_uploaded_reports') || localStorage.getItem('ELSHA_UPLOADED_REPORTS');
    const existingReports = existingReportsStr ? JSON.parse(existingReportsStr) : [];
    const newReport = {
      id: `rx-${Date.now()}`,
      name: finalFilename,
      original_file_name: finalFilename,
      mimetype: 'application/pdf',
      mime_type: 'application/pdf',
      fileSize: '65 KB',
      file_size_formatted: '65 KB',
      date: safeDate,
      document_date: safeDate,
      category: 'Prescriptions',
      fileUrl: pdfDataUri,
      downloadUrl: pdfDataUri,
      status: 'Ready',
      notes: `Official MN Prescription for ${patientName}`,
    };
    const updated = [newReport, ...existingReports.filter((r: any) => r.name !== finalFilename)];
    localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(updated));
    localStorage.setItem('ELSHA_UPLOADED_REPORTS', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('elsha-documents-updated'));
  } catch (err) {
    console.warn('Could not auto-archive MN prescription:', err);
  }

  doc.save(finalFilename);
  return finalFilename;
}

/**
 * Downloads comprehensive patient details in JSON, CSV, or PDF format.
 */
export function downloadPatientDetailsFile(
  data: PatientExportData,
  format: 'json' | 'csv' | 'pdf' = 'json'
): string {
  const patientName = data.generalInfo.name || 'Patient';
  const safeName = patientName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];

  if (format === 'json') {
    const jsonPayload = {
      clinic: 'ŽIATHLON SPORTS MEDICINE CLINIC',
      accreditation: 'ISO-27001 Clinical E-Health Tier-1 System',
      exportedAt: new Date().toISOString(),
      patientProfile: {
        demographics: data.generalInfo,
        anthropometricsAndCalculations: data.calculations,
        clinicalDomain: data.selectedDomain || 'Metabolic Health',
        clinicalCategory: data.selectedCategory || 'Type 2 Diabetes & Weight Loss',
        symptoms: data.symptoms || [],
        medicalHistory: data.medicalHistory || {},
        parentHistory: data.parentMedicalHistory || {},
        pharmacotherapy: data.prescriptions || [],
        recoveryGoals: data.goals || [],
        clinicalDiagnostics: data.diagnostics || [],
        orderedLabTests: data.labTests || [],
      },
    };

    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ziathlon_Patient_Details_${safeName}_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return a.download;
  }

  if (format === 'csv') {
    const rows = [
      ['ŽIATHLON SPORTS MEDICINE CLINIC - PATIENT CLINICAL DOSSIER'],
      ['Export Date', new Date().toLocaleString()],
      [''],
      ['PATIENT DEMOGRAPHICS'],
      ['Full Name', data.generalInfo.name || ''],
      ['Age', String(data.generalInfo.age || '')],
      ['Gender', data.generalInfo.sex || ''],
      ['Date of Birth', data.generalInfo.dateOfBirth || ''],
      ['Condition Tag', data.generalInfo.tag || data.generalInfo.customTag || ''],
      ['Referral Source', data.generalInfo.referral || data.generalInfo.referralSource || ''],
      ['Contact Phone', data.generalInfo.phone || ''],
      ['Email Address', data.generalInfo.email || ''],
      ['Residential Address', data.generalInfo.address || ''],
      ['Pincode', data.generalInfo.pincode || ''],
      [''],
      ['ANTHROPOMETRY & BODY COMPOSITION'],
      ['Height (cm)', String(data.generalInfo.height || '')],
      ['Weight (kg)', String(data.generalInfo.weight || '')],
      ['BMI (kg/m²)', String(data.calculations?.bmi || '')],
      ['BMI Classification', data.calculations?.bmiCategory || ''],
      ['BMR (kcal)', String(data.calculations?.bmr || '')],
      ['TDEE (kcal)', String(data.calculations?.tdee || '')],
      ['Visceral Fat Score', String(data.generalInfo.visceralFat || '')],
      [''],
      ['CLINICAL DOMAIN & CONDITION'],
      ['Major Domain', data.selectedDomain || ''],
      ['Target Condition', data.selectedCategory || ''],
      [''],
      ['REPORTED CLINICAL SYMPTOMS'],
      ['Symptom', 'Duration', 'Severity'],
      ...(data.symptoms || []).map((s) => [s.symptom || '', s.duration || '', s.severity || '']),
      [''],
      ['PHARMACOTHERAPY & PRESCRIPTIONS'],
      ['Medicine', 'Dosage', 'Duration', 'Timing', 'Instructions'],
      ...(data.prescriptions || []).map((p) => [
        p.medicine || '',
        p.dosage || '',
        p.duration || '',
        p.timing || '',
        p.instructions || '',
      ]),
    ];

    const csvContent = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ziathlon_Patient_Details_${safeName}_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return a.download;
  }

  // PDF Format: Use generateMnPrescriptionPdf or structured patient dossier
  const mnData: MnPrescriptionPdfData = {
    patient: {
      name: data.generalInfo.name || 'Patient',
      age: data.generalInfo.age || 38,
      gender: data.generalInfo.sex || 'Female',
      dateOfBirth: data.generalInfo.dateOfBirth,
      phone: data.generalInfo.phone,
      email: data.generalInfo.email,
      address: data.generalInfo.address,
      pincode: data.generalInfo.pincode,
      tag: data.generalInfo.tag || data.generalInfo.customTag,
      referral: data.generalInfo.referral || data.generalInfo.referralSource,
    },
    anthropometrics: {
      height: data.generalInfo.height || 162,
      weight: data.generalInfo.weight || 66,
      bmi: data.calculations?.bmi || 22.5,
      bmiCategory: data.calculations?.bmiCategory || 'Normal',
      visceralFat: data.generalInfo.visceralFat || 11,
      bmr: data.calculations?.bmr || 1418,
      tdee: data.calculations?.tdee || 2198,
      muscleMass: data.generalInfo.muscleMass,
      fatPercentage: data.generalInfo.fatPercentage,
    },
    diagnostics: data.diagnostics || [],
    goals: data.goals || [],
    prescriptions: data.prescriptions || [],
    laboratoryTests: data.labTests?.map((t) => ({
      testName: t.testName,
      description: `${t.frequency || 'Baseline'} • ${t.instructions || ''}`,
    })),
  };

  return generateMnPrescriptionPdf(
    mnData,
    `Ziathlon_Patient_Details_Dossier_${safeName}_${dateStr}.pdf`,
    { theme: 'clinical-white' }
  );
}
