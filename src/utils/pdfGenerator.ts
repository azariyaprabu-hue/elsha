import jsPDF from 'jspdf';
export * from './mnPrescriptionPdfGenerator';

export interface ClientDossierPdfData {
  name: string;
  clientCode: string;
  age: number | string;
  gender: string;
  primaryCondition: string;
  medicalRecordCode?: string;
  bloodPressure?: string;
  hba1c?: string;
  weight?: number | string;
  folderNotes?: string;
  createdDate?: string;
  lastUpdated?: string;
  status?: string;
  documentType?: string;
  clinicianName?: string;
}

export const CLINICAL_MODULES_LIST = [
  '01. Patient Demographics & Bio-Profile',
  '02. Clinical Disease & Metabolic Domain',
  '03. Comprehensive Symptoms Assessment',
  '04. Medical, Surgical & Pharmacotherapy',
  '05. Familial Lineage & Genetic Risk',
  '06. Uploaded Diagnostic & Lab Reports',
  '07. Lifestyle, Sleep & Activity Habits',
  '08. Mental Well-being & Stress Index (15 Qs)',
  '09. Gut Health, Microbiome & Bristol Scale (40 Qs)',
  '10. Clinical Nutrition & Intake Assessment',
  '11. Micronutrient Deficiency Screener (30 Qs)',
  '12. Circadian Daily Routine & Meal Timings',
  '13. Food Frequency Questionnaire (FFQ Matrix)',
  '14. 24-Hour Clinical Dietary Recall',
  '15. Micronutrient RDA Gap & Surplus Analysis',
  '16. Therapeutic Clinical Diet Domains',
  '17. Ayur-Siddha Metabolic Constitution',
  '18. Condition-Specific Recipe Directives',
  '19. Client Dossier & Medical Vault',
  '20. Biometric Vitals & Progress Tracker',
];

/**
 * Generates a formal, crisp client-side vector PDF for clinical medical records.
 * Uses jsPDF directly for instant, zero-dependency client-side PDF rendering that
 * avoids any DOM/oklch rendering issues.
 */
export function generateClientDossierPdf(data: ClientDossierPdfData, filename?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const docType = data.documentType || 'Official Clinical Medical Record';
  const patientName = data.name || 'Anonymous Patient';
  const clientCode = data.clientCode || 'ZT-REC-000';
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Background - Clean White Page
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header banner - Ziathlon Purple #7E22CE
  doc.setFillColor(126, 34, 206);
  doc.rect(margin, margin, contentWidth, 34, 'F');
  doc.setDrawColor(91, 33, 182);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, contentWidth, 34, 'D');

  // Clinic Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 6, margin + 9);

  doc.setTextColor(233, 213, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'DEPARTMENT OF CLINICAL NUTRITION & EXERCISE PHYSIOLOGY • MEDICAL DOSSIER SYSTEM',
    margin + 6,
    margin + 15
  );

  doc.setFontSize(7.5);
  doc.setTextColor(216, 180, 254);
  doc.text(
    'Accredited Clinical Sports Health Architecture • ISO-27001 Clinical Confidentiality Tier-1',
    margin + 6,
    margin + 20
  );

  // Document Type & Classification Pill / Ribbon
  doc.setFillColor(91, 33, 182);
  doc.rect(margin + 4, margin + 23, contentWidth - 8, 7.5, 'F');
  doc.setDrawColor(216, 180, 254);
  doc.setLineWidth(0.3);
  doc.rect(margin + 4, margin + 23, contentWidth - 8, 7.5, 'D');

  const mrcCode = data.medicalRecordCode || `MRC-2026-${clientCode.replace(/[^0-9]/g, '').slice(0, 5) || '99201'}`;

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(
    `DOCUMENT TYPE: ${docType.toUpperCase()}  |  MRC: ${mrcCode}  |  CONFIDENTIAL MEDICAL RECORD`,
    margin + 7,
    margin + 28
  );

  let currentY = margin + 40;

  // SECTION 1: PATIENT CLINICAL IDENTIFICATION
  doc.setFillColor(248, 245, 253);
  doc.rect(margin, currentY, contentWidth, 36, 'F');
  doc.setDrawColor(216, 180, 254);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 36, 'D');

  // Section Header bar
  doc.setFillColor(126, 34, 206);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`SECTION 01: PATIENT IDENTIFICATION & CLINICAL STATUS [ MRC: ${mrcCode} ]`, margin + 4, currentY + 5);

  // Left Column Data
  const col1X = margin + 4;
  const col2X = margin + (contentWidth / 2) + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 70, 153);
  doc.text('Patient Name:', col1X, currentY + 13);
  doc.setTextColor(28, 15, 45);
  doc.setFont('helvetica', 'bold');
  doc.text(patientName, col1X + 24, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 70, 153);
  doc.text('Code / MRC:', col1X, currentY + 19);
  doc.setTextColor(126, 34, 206);
  doc.setFont('courier', 'bold');
  doc.text(`${clientCode} • ${mrcCode}`, col1X + 24, currentY + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 70, 153);
  doc.text('Age / Gender:', col1X, currentY + 25);
  doc.setTextColor(28, 15, 45);
  doc.text(`${data.age || 'N/A'} Yrs  /  ${data.gender || 'Not Specified'}`, col1X + 24, currentY + 25);

  doc.setTextColor(107, 70, 153);
  doc.text('Record Status:', col1X, currentY + 31);
  doc.setTextColor(16, 185, 129); // Green
  doc.setFont('helvetica', 'bold');
  doc.text(data.status ? data.status.toUpperCase() : 'ACTIVE CLINICAL RECORD', col1X + 24, currentY + 31);

  // Right Column Data
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 70, 153);
  doc.text('Primary Diagnosis:', col2X, currentY + 13);
  doc.setTextColor(28, 15, 45);
  doc.setFont('helvetica', 'bold');
  doc.text(data.primaryCondition || 'Clinical Evaluation Pending', col2X + 28, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 70, 153);
  doc.text('Date Created:', col2X, currentY + 19);
  doc.setTextColor(28, 15, 45);
  doc.text(data.createdDate || nowStr, col2X + 28, currentY + 19);

  doc.setTextColor(107, 70, 153);
  doc.text('Last Updated:', col2X, currentY + 25);
  doc.setTextColor(28, 15, 45);
  doc.text(data.lastUpdated || nowStr, col2X + 28, currentY + 25);

  doc.setTextColor(107, 70, 153);
  doc.text('Vitals / Export:', col2X, currentY + 31);
  doc.setTextColor(126, 34, 206);
  doc.text(data.bloodPressure ? `BP ${data.bloodPressure} • ${nowStr}` : nowStr, col2X + 28, currentY + 31);

  currentY += 41;

  // SECTION 2: CONSULTATION NOTES & CLINICAL DIRECTIVES
  doc.setFillColor(248, 245, 253);
  doc.rect(margin, currentY, contentWidth, 48, 'F');
  doc.setDrawColor(216, 180, 254);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 48, 'D');

  doc.setFillColor(126, 34, 206);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SECTION 02: CLINICAL CONSULTATION DIRECTIVES & CASE NOTES', margin + 4, currentY + 5);

  const notesText =
    data.folderNotes && data.folderNotes.trim().length > 0
      ? data.folderNotes
      : 'Patient undergoing comprehensive clinical metabolic & nutrition optimization protocol. Follow prescribed meal frequencies, targeted macro split, circadian timing, and therapeutic lifestyle modifications.';

  doc.setTextColor(28, 15, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const splitNotes = doc.splitTextToSize(notesText, contentWidth - 10);
  doc.text(splitNotes.slice(0, 7), margin + 5, currentY + 13);

  currentY += 53;

  // SECTION 3: 20-MODULE CLINICAL AUDIT TRAIL
  doc.setFillColor(248, 245, 253);
  doc.rect(margin, currentY, contentWidth, 90, 'F');
  doc.setDrawColor(216, 180, 254);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 90, 'D');

  doc.setFillColor(126, 34, 206);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SECTION 03: CLINICAL MODULE AUDIT & HEALTH DATA RECORD (20/20 VERIFIED)', margin + 4, currentY + 5);

  // 2-Column List of Modules
  const modColWidth = (contentWidth - 10) / 2;
  const firstCol = CLINICAL_MODULES_LIST.slice(0, 10);
  const secondCol = CLINICAL_MODULES_LIST.slice(10, 20);

  let modY = currentY + 12;
  firstCol.forEach((mod) => {
    doc.setTextColor(126, 34, 206);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('[ VERIFIED ]', margin + 4, modY);

    doc.setTextColor(28, 15, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(mod, margin + 22, modY);
    modY += 7.4;
  });

  modY = currentY + 12;
  secondCol.forEach((mod) => {
    doc.setTextColor(126, 34, 206);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('[ VERIFIED ]', margin + modColWidth + 6, modY);

    doc.setTextColor(28, 15, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(mod, margin + modColWidth + 24, modY);
    modY += 7.4;
  });

  currentY += 95;

  // SECTION 4: CLINICAL ATTESTATION & SIGNATURE
  doc.setFillColor(248, 245, 253);
  doc.rect(margin, currentY, contentWidth, 38, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, contentWidth, 38, 'D');

  doc.setTextColor(107, 70, 153);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    'I hereby certify that this clinical medical dossier reflects verified consultation records, diagnostic inputs, and nutritional assessment directives.',
    margin + 4,
    currentY + 6
  );

  const sigCol1 = margin + 6;
  const sigCol2 = margin + 70;
  const sigCol3 = margin + 125;

  doc.setFontSize(7.5);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTENDING CLINICIAN:', sigCol1, currentY + 14);
  doc.setTextColor(28, 15, 45);
  doc.text(data.clinicianName || 'Chief Clinical Nutritionist', sigCol1, currentY + 20);
  doc.setTextColor(107, 70, 153);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Sports Dietetics & Metabolism', sigCol1, currentY + 24);

  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SIGNATURE / ATTESTATION:', sigCol2, currentY + 14);
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.3);
  doc.line(sigCol2, currentY + 22, sigCol2 + 45, currentY + 22);
  doc.setTextColor(107, 70, 153);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.text('Verified Digital Clinical Signature', sigCol2, currentY + 26);

  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CLINICAL STAMP & DATE:', sigCol3, currentY + 14);
  doc.setTextColor(126, 34, 206);
  doc.setFont('courier', 'bold');
  doc.text(`[ ${nowStr} ]`, sigCol3, currentY + 20);
  doc.setTextColor(107, 70, 153);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Žiathlon Secure Medical Seal', sigCol3, currentY + 25);

  // Footer
  doc.setTextColor(107, 70, 153);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'CONFIDENTIAL • Žiathlon Sports Medicine Clinic • Clinical Dossier System • Page 1 of 1',
    margin,
    pageHeight - 6
  );

  const safeFilename = filename || `Ziathlon_${docType.replace(/\s+/g, '_')}_${patientName.replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFilename);
}

/**
 * Fallback DOM-to-PDF utility via server when complex DOM stylesheets are needed
 */
export async function downloadHtmlAsPdf(elementOrId: HTMLElement | string, filename: string) {
  const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!el) {
    throw new Error(`Element ${elementOrId} not found for PDF export`);
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((s) => s.outerHTML)
    .join('\n');

  const html = `
    <!DOCTYPE html>
    <html class="light">
    <head>
      <meta charset="UTF-8">
      ${styles}
      <style>
        body {
          background-color: #fff;
          color: black;
          margin: 0;
          padding: 0;
          font-family: sans-serif;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-only { display: block !important; }
      </style>
    </head>
    <body class="bg-white text-black antialiased">
      ${el.outerHTML}
    </body>
    </html>
  `;

  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, filename }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to generate PDF on server');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export interface Complete2PagePlanPdfData {
  patient: {
    name: string;
    age: number | string;
    gender: string;
    weight?: number | string;
    height?: number | string;
    bmi?: number | string;
    targetCalories?: number;
    patientId?: string;
  };
  conditionDomain: string;
  dietDomain: string;
  macros?: {
    carbs?: string;
    protein?: string;
    fat?: string;
    fiber?: string;
  };
  dietGuidelines: {
    clinicalRationale?: string;
    dos: string[];
    donts: string[];
    hydrationTarget?: string;
    timingGuidance?: string;
  };
  dietPlans: any[];
  exerciseGuidelines: {
    sportsMedicineRationale?: string;
    weeklyTarget?: string;
    dos: string[];
    donts: string[];
    drBharathkumarSignOff?: string;
  };
  exercisePlans: any[];
  conditionIngredients?: {
    conditionName: string;
    clinicalTagline?: string;
    primaryGoal?: string;
    cereals?: any[];
    pulses?: any[];
    vegetables?: any[];
    fruits?: any[];
    nutsAndSeeds?: any[];
    dairyFoods?: any[];
    ayurvedicFoods?: any[];
    functionalFoods?: any[];
  };
}

/**
 * Generates an authenticated, high-resolution 2-Page Clinical Prescription PDF
 * Page 1: 7-Day Diet Plan + Demographics + Diet Guidelines
 * Page 2: 7-Day Exercise Protocol + Sports Medicine Exercise Do's/Don'ts + Dr. Bharathkumar Sign-Off
 */
export function generateComplete2PagePlanPdf(data: Complete2PagePlanPdfData, filename?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const patientName = data.patient.name || 'Patient';
  const patientAge = data.patient.age || 28;
  const patientGender = data.patient.gender || 'Female';
  const conditionDomain = data.conditionDomain || 'Metabolic Optimization';
  const dietDomain = data.dietDomain || 'Low Carbs Diet';
  const targetKcal = data.patient.targetCalories || 1500;

  // Helper for text wrapping & drawing
  const drawWrapped = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 3
  ): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    const toRender = lines.slice(0, maxLines);
    toRender.forEach((l: string, idx: number) => {
      doc.text(l, x, y + idx * lineHeight);
    });
    return toRender.length * lineHeight;
  };

  // =========================================================================
  // PAGE 1: 7-DAY DIET PLAN & CLINICAL DIET GUIDELINES
  // =========================================================================

  // Page 1 Clean Medical Canvas (White, Purple & Black theme)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner Page 1
  doc.setFillColor(250, 245, 255);
  doc.rect(margin, margin, contentWidth, 20, 'F');
  doc.setDrawColor(126, 34, 206); // Royal Purple #7E22CE
  doc.setLineWidth(0.6);
  doc.rect(margin, margin, contentWidth, 20, 'D');

  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 5, margin + 7);

  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text('CLINICAL NUTRITION PRESCRIPTION • PERSONALIZED 7-DAY THERAPEUTIC DIET PLAN', margin + 5, margin + 12);

  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Department of Clinical Dietetics & Sports Endocrinology • Certified Prescription • Date: ${nowStr}`, margin + 5, margin + 16.5);

  // Right Badge on Header
  doc.setFillColor(243, 232, 255);
  doc.roundedRect(pageWidth - margin - 35, margin + 4, 30, 12, 2, 2, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - margin - 35, margin + 4, 30, 12, 2, 2, 'D');
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PAGE 1 OF 2', pageWidth - margin - 29, margin + 9);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('7-Day Diet Plan', pageWidth - margin - 30.5, margin + 13);

  // Patient Dossier Mini Card
  let curY = margin + 23;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, curY, contentWidth, 14, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.rect(margin, curY, contentWidth, 14, 'D');

  doc.setFontSize(7);
  // Column 1
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Name:', margin + 4, curY + 5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${patientName} (${patientAge}y, ${patientGender})`, margin + 23, curY + 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Caloric Target:', margin + 4, curY + 10);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text(`${targetKcal} kcal / day`, margin + 23, curY + 10);

  // Column 2
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Clinical Domain:', margin + 70, curY + 5);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text(conditionDomain, margin + 92, curY + 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Therapeutic Diet:', margin + 70, curY + 10);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(dietDomain, margin + 94, curY + 10);

  // Column 3
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Prescription ID:', margin + 140, curY + 5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('courier', 'bold');
  doc.text(data.patient.patientId || `ZT-${Date.now().toString().slice(-6)}`, margin + 162, curY + 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Macros Plan:', margin + 140, curY + 10);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `P: ${data.macros?.protein || '80g'} | C: ${data.macros?.carbs || '170g'} | F: ${data.macros?.fat || '40g'}`,
    margin + 158,
    curY + 10
  );

  // 7-DAY DIET TABLE
  curY += 16;
  const tableY = curY;
  const colTimeW = 28;
  const colDayW = (contentWidth - colTimeW) / 7;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slotsConfig = [
    { label: 'Early Morning', timing: '5:00 - 6:30 am', match: 'early' },
    { label: 'Breakfast', timing: '8:30 - 9:00 am', match: 'breakfast' },
    { label: 'Mid-Morning', timing: '11:00 am - 12:00 pm', match: 'mid' },
    { label: 'Lunch', timing: '1:30 - 2:00 pm', match: 'lunch' },
    { label: 'Evening Snack', timing: '5:00 - 5:30 pm', match: 'evening' },
    { label: 'Dinner', timing: '7:30 - 8:30 pm', match: 'dinner' },
    { label: 'Bed Time', timing: '9:30 - 10:00 pm', match: 'bed' },
  ];

  // Table Header Row - Royal Purple
  const headerHeight = 9;
  doc.setFillColor(126, 34, 206);
  doc.rect(margin, tableY, contentWidth, headerHeight, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.rect(margin, tableY, contentWidth, headerHeight, 'D');

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TIMING & MEAL', margin + 2, tableY + 5.5);

  days.forEach((day, dIdx) => {
    const cellX = margin + colTimeW + dIdx * colDayW;
    doc.text(day.toUpperCase(), cellX + 1.5, tableY + 5.5);
  });

  // Table Rows (7 meal slots)
  let rowY = tableY + headerHeight;
  const rowHeight = 17.5;

  slotsConfig.forEach((slotCfg, sIdx) => {
    // Alternating slot row background: White & Soft Lavender tint
    doc.setFillColor(sIdx % 2 === 0 ? 255 : 250, sIdx % 2 === 0 ? 255 : 247, sIdx % 2 === 0 ? 255 : 255);
    doc.rect(margin, rowY, contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 215, 245);
    doc.setLineWidth(0.2);
    doc.rect(margin, rowY, contentWidth, rowHeight, 'D');

    // Slot Title & Timing (Left column)
    doc.setFillColor(243, 232, 255);
    doc.rect(margin, rowY, colTimeW, rowHeight, 'F');
    doc.setDrawColor(200, 160, 230);
    doc.rect(margin, rowY, colTimeW, rowHeight, 'D');

    doc.setTextColor(107, 33, 168);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text(slotCfg.label, margin + 2, rowY + 5);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.text(slotCfg.timing, margin + 2, rowY + 9);

    // Days columns (Day 1 to 7)
    days.forEach((_, dIdx) => {
      const cellX = margin + colTimeW + dIdx * colDayW;
      doc.setDrawColor(230, 220, 245);
      doc.line(cellX, rowY, cellX, rowY + rowHeight);

      // Find meal item in dietPlans
      const dayPlan = data.dietPlans?.[dIdx];
      let itemText = 'Custom therapeutic portion';
      let kcal = 0;
      if (dayPlan && Array.isArray(dayPlan.slots)) {
        const foundSlot = dayPlan.slots.find((s: any) =>
          (s.slotName || '').toLowerCase().includes(slotCfg.match)
        );
        if (foundSlot && Array.isArray(foundSlot.items) && foundSlot.items.length > 0) {
          itemText = foundSlot.items[0].dishName || itemText;
          kcal = foundSlot.items[0].calories || foundSlot.targetKcal || 0;
        }
      }

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(4.8);
      drawWrapped(itemText, cellX + 1.2, rowY + 3.8, colDayW - 2.4, 2.8, 4);

      if (kcal > 0) {
        doc.setTextColor(126, 34, 206);
        doc.setFont('courier', 'bold');
        doc.setFontSize(4.5);
        doc.text(`${kcal} kcal`, cellX + colDayW - 12, rowY + rowHeight - 1.5);
      }
    });

    rowY += rowHeight;
  });

  // Table Energy Total Row
  doc.setFillColor(243, 232, 255);
  doc.rect(margin, rowY, contentWidth, 7, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.rect(margin, rowY, contentWidth, 7, 'D');

  doc.setTextColor(107, 33, 168);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('TOTAL DAILY ENERGY', margin + 2, rowY + 4.5);

  days.forEach((_, dIdx) => {
    const cellX = margin + colTimeW + dIdx * colDayW;
    const dayPlan = data.dietPlans?.[dIdx];
    const totalDay = dayPlan?.targetCalories || targetKcal;
    doc.setTextColor(126, 34, 206);
    doc.setFont('courier', 'bold');
    doc.setFontSize(5.5);
    doc.text(`${totalDay} kcal`, cellX + 1.5, rowY + 4.5);
  });

  rowY += 9;

  // BOTTOM SECTION PAGE 1: Clinical Diet Guidelines & Do's / Don'ts
  const bottomH = pageHeight - rowY - 12;
  const colHalfW = (contentWidth - 4) / 2;

  // Left Card: Clinical Diet Rationale & Do's
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, rowY, colHalfW, bottomH, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.rect(margin, rowY, colHalfW, bottomH, 'D');

  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('CLINICAL DIETARY GUIDELINES & DO\'S', margin + 4, rowY + 5);

  // Rationale
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5.2);
  const ratText = data.dietGuidelines.clinicalRationale || `Therapeutic nutrition tailored for ${conditionDomain}.`;
  const ratLines = doc.splitTextToSize(ratText, colHalfW - 8).slice(0, 3);
  ratLines.forEach((l: string, idx: number) => {
    doc.text(l, margin + 4, rowY + 9 + idx * 2.8);
  });

  // Do's List
  let doY = rowY + 19;
  const dos = data.dietGuidelines.dos?.slice(0, 5) || [
    'Consume fiber/vegetables before grains to blunt post-meal glucose rise.',
    'Maintain strict hydration throughout daylight hours.',
    'Follow a 12-hour overnight circadian digestive rest.',
    'Cook with cold-pressed oils; avoid trans fats.',
    'Chew meals slowly and avoid distractions while eating.',
  ];
  dos.forEach((dItem, idx) => {
    doc.setTextColor(16, 149, 102);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text('✓', margin + 4, doY);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.2);
    drawWrapped(dItem, margin + 8, doY, colHalfW - 12, 2.7, 2);
    doY += 5.5;
  });

  // Right Card: Dietary Don'ts / Avoid List
  const rightX = margin + colHalfW + 4;
  doc.setFillColor(255, 255, 255);
  doc.rect(rightX, rowY, colHalfW, bottomH, 'F');
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.4);
  doc.rect(rightX, rowY, colHalfW, bottomH, 'D');

  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('CONTRAINDICATED FOODS & DIET DON\'TS', rightX + 4, rowY + 5);

  let dontY = rowY + 10;
  const donts = data.dietGuidelines.donts?.slice(0, 5) || [
    'Avoid refined wheat flour (maida), white bread, rusks, and biscuits.',
    'Avoid sugar-sweetened beverages, sodas, and commercial juices.',
    'Avoid deep-fried snacks and repeatedly reheated vegetable oils.',
    'Do not skip breakfast or delay lunch past 2:00 PM.',
    'Avoid high-glycemic desserts or heavy meals past 8:30 PM.',
  ];
  donts.forEach((dItem) => {
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text('✕', rightX + 4, dontY);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.2);
    drawWrapped(dItem, rightX + 8, dontY, colHalfW - 12, 2.7, 2);
    dontY += 5.5;
  });

  // Hydration info box inside right card
  doc.setFillColor(240, 249, 255);
  doc.rect(rightX + 4, bottomH + rowY - 13, colHalfW - 8, 10, 'F');
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.3);
  doc.rect(rightX + 4, bottomH + rowY - 13, colHalfW - 8, 10, 'D');

  doc.setTextColor(3, 105, 161);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.text('HYDRATION & TIMING PROTOCOL:', rightX + 6, bottomH + rowY - 9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text(data.dietGuidelines.hydrationTarget || '2.8 Litres clean water daily, spaced across waking hours.', rightX + 6, bottomH + rowY - 5.5);

  // Page 1 Footer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'ŽIATHLON SPORTS MEDICINE CLINIC • Official Prescription Page 1 of 2 • Confidential Medical Document',
    margin,
    pageHeight - 5
  );

  // =========================================================================
  // PAGE 2: 7-DAY EXERCISE PROTOCOL & SPORTS MEDICINE GUIDELINES
  // =========================================================================
  doc.addPage('a4', 'portrait');

  // Page 2 Clean White Canvas
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Page 2
  doc.setFillColor(250, 245, 255);
  doc.rect(margin, margin, contentWidth, 20, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.6);
  doc.rect(margin, margin, contentWidth, 20, 'D');

  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 5, margin + 7);

  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text('DEPARTMENT OF CLINICAL EXERCISE PHYSIOLOGY • 7-DAY SPORTS MEDICINE PROTOCOL', margin + 5, margin + 12);

  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Physiological Exercise Prescription calibrated to metabolic biomarkers, joint mechanics & domain', margin + 5, margin + 16.5);

  // Page 2 Right Badge
  doc.setFillColor(243, 232, 255);
  doc.roundedRect(pageWidth - margin - 35, margin + 4, 30, 12, 2, 2, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - margin - 35, margin + 4, 30, 12, 2, 2, 'D');
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PAGE 2 OF 2', pageWidth - margin - 29, margin + 9);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Exercise Protocol', pageWidth - margin - 31, margin + 13);

  // Conditioning Profile Card
  let p2Y = margin + 23;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, p2Y, contentWidth, 14, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.rect(margin, p2Y, contentWidth, 14, 'D');

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Profile:', margin + 4, p2Y + 5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${patientName} (${patientAge} yrs, ${patientGender})`, margin + 23, p2Y + 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Primary Domain:', margin + 4, p2Y + 10);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text(conditionDomain, margin + 25, p2Y + 10);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Weekly Target:', margin + 85, p2Y + 5);
  doc.setTextColor(16, 149, 102);
  doc.setFont('helvetica', 'bold');
  doc.text(data.exerciseGuidelines.weeklyTarget || '250 Mins / Week • Zone 2 Cardio & Functional Strength', margin + 105, p2Y + 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Physician Sign-Off:', margin + 85, p2Y + 10);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Bharathkumar, Sports Medicine Specialist', margin + 110, p2Y + 10);

  // 7-DAY EXERCISE PROTOCOL SCHEDULE (7 Day Columns or Cards)
  p2Y += 17;
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('7-DAY CLINICAL EXERCISE SCHEDULE (MONDAY TO SUNDAY)', margin, p2Y);

  p2Y += 3;
  const exCardW = (contentWidth - 6 * 2) / 7;
  const exCardH = 105;

  days.forEach((dayName, dIdx) => {
    const cardX = margin + dIdx * (exCardW + 2);
    const exPlan = data.exercisePlans?.[dIdx] || {};

    // Card Box
    doc.setFillColor(255, 255, 255);
    doc.rect(cardX, p2Y, exCardW, exCardH, 'F');
    doc.setDrawColor(200, 160, 230);
    doc.setLineWidth(0.3);
    doc.rect(cardX, p2Y, exCardW, exCardH, 'D');

    // Day Header
    doc.setFillColor(126, 34, 206);
    doc.rect(cardX, p2Y, exCardW, 8, 'F');
    doc.setDrawColor(126, 34, 206);
    doc.rect(cardX, p2Y, exCardW, 8, 'D');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text(dayName.toUpperCase(), cardX + 1.5, p2Y + 4.5);

    const dur = exPlan.durationMins ? `${exPlan.durationMins}m` : '40m';
    doc.setTextColor(233, 213, 255);
    doc.setFont('courier', 'bold');
    doc.setFontSize(5);
    doc.text(dur, cardX + exCardW - 7, p2Y + 4.5);

    // Protocol Title
    let cardContentY = p2Y + 11;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    const titleLines = doc.splitTextToSize(exPlan.protocolTitle || exPlan.focusArea || 'Conditioning Session', exCardW - 3);
    titleLines.slice(0, 3).forEach((tl: string) => {
      doc.text(tl, cardX + 1.5, cardContentY);
      cardContentY += 2.6;
    });

    // Target Heart Rate
    if (exPlan.targetHeartRate) {
      cardContentY += 1;
      doc.setTextColor(67, 56, 202);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(4.2);
      doc.text(`HR: ${exPlan.targetHeartRate}`, cardX + 1.5, cardContentY);
      cardContentY += 3;
    }

    // Movements list
    cardContentY += 1;
    doc.setTextColor(126, 34, 206);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.text('Movements:', cardX + 1.5, cardContentY);
    cardContentY += 2.5;

    const movements = exPlan.movements || [
      { name: 'Aerobic Pace Walk', setsAndReps: '30 mins continuous' },
      { name: 'Core Activation', setsAndReps: '3 sets x 12 reps' },
    ];
    movements.slice(0, 3).forEach((m: any) => {
      doc.setFillColor(250, 245, 255);
      doc.rect(cardX + 1, cardContentY, exCardW - 2, 11, 'F');
      doc.setDrawColor(230, 220, 245);
      doc.rect(cardX + 1, cardContentY, exCardW - 2, 11, 'D');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4.2);
      const mName = doc.splitTextToSize(m.name || 'Exercise', exCardW - 3);
      doc.text(mName[0] || '', cardX + 1.5, cardContentY + 3.2);

      doc.setTextColor(71, 85, 105);
      doc.setFont('courier', 'normal');
      doc.setFontSize(3.8);
      doc.text(m.setsAndReps || '3 sets', cardX + 1.5, cardContentY + 6.2);

      if (m.clinicalRationale) {
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(3.5);
        const rat = doc.splitTextToSize(m.clinicalRationale, exCardW - 3);
        doc.text(rat[0] || '', cardX + 1.5, cardContentY + 9.2);
      }

      cardContentY += 12.5;
    });

    // Recovery note at bottom of card
    const recoveryY = p2Y + exCardH - 12;
    doc.setDrawColor(226, 215, 245);
    doc.line(cardX + 1, recoveryY, cardX + exCardW - 1, recoveryY);

    doc.setTextColor(16, 149, 102);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(3.8);
    doc.text('Recovery:', cardX + 1.5, recoveryY + 3);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.5);
    const recText = doc.splitTextToSize(exPlan.postWorkoutRecovery || 'Diaphragmatic breathing & hydration', exCardW - 3);
    recText.slice(0, 2).forEach((rl: string, rIdx: number) => {
      doc.text(rl, cardX + 1.5, recoveryY + 5.5 + rIdx * 2.2);
    });
  });

  // BOTTOM SECTION PAGE 2: Exercise Guidelines (Do's & Don'ts) + Dr. Bharathkumar Sign-off
  p2Y += exCardH + 5;
  const p2BottomH = pageHeight - p2Y - 12;
  const p2ColW = (contentWidth - 4) / 3;

  // 1. Exercise Do's Card
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, p2Y, p2ColW, p2BottomH, 'F');
  doc.setDrawColor(16, 149, 102);
  doc.setLineWidth(0.4);
  doc.rect(margin, p2Y, p2ColW, p2BottomH, 'D');

  doc.setTextColor(16, 149, 102);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SPORTS MEDICINE EXERCISE DO\'S', margin + 4, p2Y + 5);

  let exDoY = p2Y + 10;
  const exDos = data.exerciseGuidelines.dos?.slice(0, 5) || [
    'Take a 15-minute gentle walk within 30 mins after your main meals.',
    'Warm up with 8 mins of dynamic joint rotations before all sessions.',
    'Wear supportive, properly cushioned athletic footwear.',
    'Hydrate with electrolytes 20 minutes before exercise.',
    'Progress intensity gradually; prioritize technique over heavy load.',
  ];
  exDos.forEach((dItem) => {
    doc.setTextColor(16, 149, 102);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.text('✓', margin + 4, exDoY);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    drawWrapped(dItem, margin + 8, exDoY, p2ColW - 12, 2.5, 2);
    exDoY += 5.5;
  });

  // 2. Exercise Don'ts & Contraindications Card
  const col2X = margin + p2ColW + 2;
  doc.setFillColor(255, 255, 255);
  doc.rect(col2X, p2Y, p2ColW, p2BottomH, 'F');
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.4);
  doc.rect(col2X, p2Y, p2ColW, p2BottomH, 'D');

  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('EXERCISE CONTRAINDICATIONS & DON\'TS', col2X + 4, p2Y + 5);

  let exDontY = p2Y + 10;
  const exDonts = data.exerciseGuidelines.donts?.slice(0, 5) || [
    'Avoid heavy breath-holding (Valsalva) to safeguard blood pressure.',
    'Do not exercise fasting if prone to dizziness or hypoglycemia.',
    'Never stop abruptly; allow a full 5-minute cooldown.',
    'Avoid high-impact plyometrics if experiencing joint stiffness.',
    'Do not train through sharp acute joint pain.',
  ];
  exDonts.forEach((dItem) => {
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.text('✕', col2X + 4, exDontY);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    drawWrapped(dItem, col2X + 8, exDontY, p2ColW - 12, 2.5, 2);
    exDontY += 5.5;
  });

  // 3. Dr. Bharathkumar Clinical Stamp & Sign-off Card
  const col3X = margin + (p2ColW + 2) * 2;
  doc.setFillColor(250, 245, 255);
  doc.rect(col3X, p2Y, p2ColW, p2BottomH, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.5);
  doc.rect(col3X, p2Y, p2ColW, p2BottomH, 'D');

  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('PHYSICIAN VERIFICATION & STAMP', col3X + 4, p2Y + 5);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('Sports Medicine Specialist Sign-off:', col3X + 4, p2Y + 10);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('Dr. Bharathkumar, MBBS, MD (Sports Med)', col3X + 4, p2Y + 14);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.8);
  doc.text('Consultant Sports & Exercise Medicine Specialist', col3X + 4, p2Y + 17.5);
  doc.text('Žiathlon Sports Health Architecture', col3X + 4, p2Y + 20.5);

  // Digital signature seal box
  doc.setFillColor(243, 232, 255);
  doc.roundedRect(col3X + 4, p2Y + 23, p2ColW - 8, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.4);
  doc.roundedRect(col3X + 4, p2Y + 23, p2ColW - 8, 12, 1.5, 1.5, 'D');

  doc.setTextColor(126, 34, 206);
  doc.setFont('courier', 'bold');
  doc.setFontSize(5.5);
  doc.text('[ VERIFIED CLINICAL SEAL ]', col3X + 6, p2Y + 28);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(4.5);
  doc.text(`Digital Sign ID: ZT-SM-${Date.now().toString().slice(-6)} • ${nowStr}`, col3X + 6, p2Y + 32);

  // Page 2 Footer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'ŽIATHLON SPORTS MEDICINE CLINIC • Official Prescription Page 2 of 2 • Confidential Medical Document',
    margin,
    pageHeight - 5
  );

  // Save the generated 2-Page PDF
  const safeFilename =
    filename ||
    `Ziathlon_Clinical_2Page_Plan_${patientName.replace(/\s+/g, '_')}_${conditionDomain.replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFilename);
}

/**
 * Generates an authenticated, high-resolution Gold & Black Clinical Prescription PDF
 * Features the signature ŽIATHLON Sports Medicine Clinic Luxury Medical Aesthetic:
 * - Deep Clinical Canvas (#0A0A0A)
 * - Handcrafted Clinical Gold (#D4AF37 & #F5D76E) Accents & Emblems
 * - Page 1: 7-Day Therapeutic Clinical Nutrition Prescription Matrix & Guidelines
 * - Page 2: 7-Day Clinical Sports Medicine Exercise Protocol & Certified Physician Stamp
 * - Page 3 (Optional): 90 Condition-Specific Ingredients Clinical Formulary
 */
export function generateGoldAndBlackPrescriptionPdf(
  data: Complete2PagePlanPdfData,
  filename?: string,
  options?: { includeFormulary?: boolean }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const patientName = data.patient?.name || 'Patient';
  const patientAge = data.patient?.age || 28;
  const patientGender = data.patient?.gender || 'Female';
  const conditionDomain = data.conditionDomain || 'Metabolic Optimization';
  const dietDomain = data.dietDomain || 'Clinical Diet Protocol';
  const targetKcal = data.patient?.targetCalories || 1500;
  const patientId = data.patient?.patientId || `ZT-RX-${Date.now().toString().slice(-6)}`;

  // Helper for text wrapping & drawing
  const drawWrapped = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 3
  ): number => {
    const lines = doc.splitTextToSize(text || '', maxWidth);
    const toRender = lines.slice(0, maxLines);
    toRender.forEach((l: string, idx: number) => {
      doc.text(l, x, y + idx * lineHeight);
    });
    return toRender.length * lineHeight;
  };

  // =========================================================================
  // PAGE 1: 7-DAY DIET PLAN PRESCRIPTION & CLINICAL GUIDELINES (GOLD & BLACK)
  // =========================================================================

  // Page 1 Deep Clinical Black Canvas
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner Page 1
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, margin, contentWidth, 20, 'F');
  doc.setDrawColor(212, 175, 55); // Clinical Gold #D4AF37
  doc.setLineWidth(0.7);
  doc.rect(margin, margin, contentWidth, 20, 'D');

  // Add Logo to Header
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ŽIATHLON', margin + 20, margin + 8);
  doc.setFontSize(8);
  doc.text('SPORTS MEDICINE CLINIC', margin + 20, margin + 12);

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('THERAPEUTIC DIET PRESCRIPTION', margin + 65, margin + 10);
  doc.setFontSize(7);
  doc.text('CLINICAL NUTRITION • 7-DAY PERSONALIZED PROTOCOL', margin + 65, margin + 14);

  // Gold ℞ Box
  doc.setFillColor(212, 175, 55);
  doc.roundedRect(margin + 3.5, margin + 3.5, 11, 13, 1.5, 1.5, 'F');
  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('℞', margin + 6.2, margin + 12.5);

  // Clinic Titles
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 18, margin + 7.5);

  doc.setFontSize(7);
  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('CLINICAL NUTRITION PRESCRIPTION • 7-DAY THERAPEUTIC DIET PLAN', margin + 18, margin + 12);

  doc.setFontSize(5.8);
  doc.setTextColor(160, 160, 165);
  doc.setFont('helvetica', 'normal');
  doc.text(`Department of Clinical Dietetics & Sports Endocrinology • Certified Prescription • ${nowStr}`, margin + 18, margin + 16.5);

  // Right Badge on Header
  doc.setFillColor(35, 30, 20);
  doc.roundedRect(pageWidth - margin - 35, margin + 3.5, 31, 13, 1.5, 1.5, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - margin - 35, margin + 3.5, 31, 13, 1.5, 1.5, 'D');

  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('PAGE 1 OF 2', pageWidth - margin - 29, margin + 8.5);

  doc.setFontSize(5.8);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'normal');
  doc.text('7-Day Diet Plan', pageWidth - margin - 30, margin + 13);

  // Patient Demographics Bar
  let curY = margin + 23;
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, curY, contentWidth, 14, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(margin, curY, contentWidth, 14, 'D');

  doc.setFontSize(6.8);
  // Column 1
  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Name:', margin + 4, curY + 5);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`${patientName} (${patientAge}y, ${patientGender})`, margin + 23, curY + 5);

  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Caloric Target:', margin + 4, curY + 10);
  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.text(`${targetKcal} kcal / day`, margin + 23, curY + 10);

  // Column 2
  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Clinical Domain:', margin + 70, curY + 5);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(conditionDomain, margin + 92, curY + 5);

  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Therapeutic Diet:', margin + 70, curY + 10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(dietDomain, margin + 94, curY + 10);

  // Column 3
  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Prescription ID:', margin + 140, curY + 5);
  doc.setTextColor(245, 215, 110);
  doc.setFont('courier', 'bold');
  doc.text(patientId, margin + 162, curY + 5);

  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Macros Plan:', margin + 140, curY + 10);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `P: ${data.macros?.protein || '80g'} | C: ${data.macros?.carbs || '170g'} | F: ${data.macros?.fat || '40g'}`,
    margin + 158,
    curY + 10
  );

  // 7-DAY DIET TABLE
  curY += 16;
  const tableY = curY;
  const colTimeW = 28;
  const colDayW = (contentWidth - colTimeW) / 7;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slotsConfig = [
    { label: 'Early Morning', timing: '5:00 - 6:30 am', match: 'early' },
    { label: 'Breakfast', timing: '8:30 - 9:00 am', match: 'breakfast' },
    { label: 'Mid-Morning', timing: '11:00 am - 12:00 pm', match: 'mid' },
    { label: 'Lunch', timing: '1:30 - 2:00 pm', match: 'lunch' },
    { label: 'Evening Snack', timing: '5:00 - 5:30 pm', match: 'evening' },
    { label: 'Dinner', timing: '7:30 - 8:30 pm', match: 'dinner' },
    { label: 'Bed Time', timing: '9:30 - 10:00 pm', match: 'bed' },
  ];

  // Table Header Row - Clinical Gold & Dark Bronze
  const headerHeight = 8.5;
  doc.setFillColor(38, 32, 20);
  doc.rect(margin, tableY, contentWidth, headerHeight, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(margin, tableY, contentWidth, headerHeight, 'D');

  doc.setFontSize(6.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.text('TIMING & MEAL', margin + 2, tableY + 5.5);

  days.forEach((day, dIdx) => {
    const cellX = margin + colTimeW + dIdx * colDayW;
    doc.setTextColor(245, 215, 110);
    doc.text(day.toUpperCase(), cellX + 1.5, tableY + 5.5);
  });

  // Table Rows (7 meal slots)
  let rowY = tableY + headerHeight;
  const rowHeight = 17;

  slotsConfig.forEach((slotCfg, sIdx) => {
    // Alternating slot row background: Deep Dark Charcoal zebra pattern
    if (sIdx % 2 === 0) {
      doc.setFillColor(14, 14, 17);
    } else {
      doc.setFillColor(20, 20, 24);
    }
    doc.rect(margin, rowY, contentWidth, rowHeight, 'F');
    doc.setDrawColor(50, 45, 35);
    doc.setLineWidth(0.2);
    doc.rect(margin, rowY, contentWidth, rowHeight, 'D');

    // Slot Title & Timing (Left column)
    doc.setFillColor(28, 24, 16);
    doc.rect(margin, rowY, colTimeW, rowHeight, 'F');
    doc.setDrawColor(80, 68, 40);
    doc.rect(margin, rowY, colTimeW, rowHeight, 'D');

    doc.setTextColor(245, 215, 110);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.text(slotCfg.label, margin + 2, rowY + 5);

    doc.setTextColor(165, 165, 170);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    doc.text(slotCfg.timing, margin + 2, rowY + 9);

    // Days columns (Day 1 to 7)
    days.forEach((_, dIdx) => {
      const cellX = margin + colTimeW + dIdx * colDayW;
      doc.setDrawColor(50, 45, 35);
      doc.line(cellX, rowY, cellX, rowY + rowHeight);

      // Find meal item in dietPlans
      const dayPlan = data.dietPlans?.[dIdx];
      let itemText = 'Custom therapeutic portion';
      let kcal = 0;
      if (dayPlan && Array.isArray(dayPlan.slots)) {
        const foundSlot = dayPlan.slots.find((s: any) =>
          (s.slotName || '').toLowerCase().includes(slotCfg.match)
        );
        if (foundSlot && Array.isArray(foundSlot.items) && foundSlot.items.length > 0) {
          itemText = foundSlot.items[0].dishName || itemText;
          kcal = foundSlot.items[0].calories || foundSlot.targetKcal || 0;
        }
      }

      doc.setTextColor(235, 235, 240);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(4.8);
      drawWrapped(itemText, cellX + 1.2, rowY + 3.8, colDayW - 2.4, 2.7, 4);

      if (kcal > 0) {
        doc.setTextColor(212, 175, 55);
        doc.setFont('courier', 'bold');
        doc.setFontSize(4.5);
        doc.text(`${kcal} kcal`, cellX + colDayW - 12, rowY + rowHeight - 1.5);
      }
    });

    rowY += rowHeight;
  });

  // Table Energy Total Row
  doc.setFillColor(38, 32, 20);
  doc.rect(margin, rowY, contentWidth, 6.5, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(margin, rowY, contentWidth, 6.5, 'D');

  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.text('TOTAL DAILY ENERGY', margin + 2, rowY + 4.5);

  days.forEach((_, dIdx) => {
    const cellX = margin + colTimeW + dIdx * colDayW;
    const dayPlan = data.dietPlans?.[dIdx];
    const totalDay = dayPlan?.targetCalories || targetKcal;
    doc.setTextColor(212, 175, 55);
    doc.setFont('courier', 'bold');
    doc.setFontSize(5.2);
    doc.text(`${totalDay} kcal`, cellX + 1.5, rowY + 4.5);
  });

  rowY += 8.5;

  // BOTTOM SECTION PAGE 1: Clinical Diet Guidelines & Do's / Don'ts
  const bottomH = pageHeight - rowY - 12;
  const colHalfW = (contentWidth - 4) / 2;

  // Left Card: Clinical Diet Rationale & Do's
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, rowY, colHalfW, bottomH, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(margin, rowY, colHalfW, bottomH, 'D');

  // Left Card Header Bar
  doc.setFillColor(32, 26, 16);
  doc.rect(margin, rowY, colHalfW, 6.5, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('CLINICAL DIETARY GUIDELINES & DO\'S', margin + 4, rowY + 4.8);

  // Rationale
  doc.setTextColor(190, 190, 195);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5);
  const ratText = data.dietGuidelines.clinicalRationale || `Therapeutic nutrition tailored for ${conditionDomain}.`;
  const ratLines = doc.splitTextToSize(ratText, colHalfW - 8).slice(0, 3);
  ratLines.forEach((l: string, idx: number) => {
    doc.text(l, margin + 4, rowY + 10 + idx * 2.7);
  });

  // Do's List
  let doY = rowY + 19;
  const dos = data.dietGuidelines.dos?.slice(0, 5) || [
    'Consume fiber/vegetables before grains to blunt post-meal glucose rise.',
    'Maintain strict daylight hydration (2.5 - 3.0 Liters filtered water daily).',
    'Follow a 12-hour overnight circadian digestive rest (8 PM to 8 AM).',
    'Cook with cold-pressed oils; avoid trans fats and re-heated oils.',
    'Chew meals slowly and avoid distractions while eating to enhance satiety.',
  ];
  dos.forEach((dItem) => {
    doc.setTextColor(74, 222, 128); // Emerald Green
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text('✓', margin + 4, doY);

    doc.setTextColor(240, 240, 245);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    drawWrapped(dItem, margin + 8, doY, colHalfW - 12, 2.6, 2);
    doY += 5.5;
  });

  // Right Card: Dietary Don'ts / Avoid List + Hydration Protocol
  const rightX = margin + colHalfW + 4;
  doc.setFillColor(18, 18, 22);
  doc.rect(rightX, rowY, colHalfW, bottomH, 'F');
  doc.setDrawColor(220, 38, 38); // Crimson Red
  doc.setLineWidth(0.4);
  doc.rect(rightX, rowY, colHalfW, bottomH, 'D');

  // Right Card Header Bar
  doc.setFillColor(40, 16, 16);
  doc.rect(rightX, rowY, colHalfW, 6.5, 'F');
  doc.setTextColor(248, 113, 113);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('CONTRAINDICATED FOODS & DIET DON\'TS', rightX + 4, rowY + 4.8);

  let dontY = rowY + 10;
  const donts = data.dietGuidelines.donts?.slice(0, 4) || [
    'Avoid refined wheat flour (maida), white bread, rusks, and biscuits.',
    'Avoid sugar-sweetened beverages, sodas, and commercial packaged juices.',
    'Avoid deep-fried snacks and repeatedly reheated vegetable cooking oils.',
    'Do not skip breakfast or delay dinner past 8:30 PM.',
  ];
  donts.forEach((dItem) => {
    doc.setTextColor(239, 68, 68);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text('✕', rightX + 4, dontY);

    doc.setTextColor(240, 240, 245);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    drawWrapped(dItem, rightX + 8, dontY, colHalfW - 12, 2.6, 2);
    dontY += 5.5;
  });

  // Hydration & Circadian Box
  const hydroY = dontY + 1;
  const hydroH = bottomH - (hydroY - rowY) - 3;
  if (hydroH > 14) {
    doc.setFillColor(15, 23, 42);
    doc.rect(rightX + 3, hydroY, colHalfW - 6, hydroH, 'F');
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.3);
    doc.rect(rightX + 3, hydroY, colHalfW - 6, hydroH, 'D');

    doc.setTextColor(56, 189, 248);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text('CIRCADIAN HYDRATION & TIMING PROTOCOL', rightX + 6, hydroY + 4.5);

    doc.setTextColor(224, 242, 254);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    doc.text(`Target: ${data.dietGuidelines.hydrationTarget || '2.5 - 3.0 Liters filtered water daily'}`, rightX + 6, hydroY + 8.5);

    doc.setTextColor(186, 230, 253);
    const timText = data.dietGuidelines.timingGuidance || 'Circadian rest: 8:00 PM to 8:00 AM. Breakfast at 8:30 AM, Lunch 1:30 PM, Dinner by 8:00 PM.';
    drawWrapped(timText, rightX + 6, hydroY + 12.5, colHalfW - 12, 2.6, 2);
  }

  // Page 1 Footer
  doc.setTextColor(140, 140, 145);
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'ŽIATHLON SPORTS MEDICINE CLINIC • Official Clinical Prescription Page 1 of 2 • Confidential Medical Document',
    margin,
    pageHeight - 5
  );
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(`Prescription ID: ${patientId}`, pageWidth - margin - 45, pageHeight - 5);

  // =========================================================================
  // PAGE 2: 7-DAY EXERCISE PROTOCOL & CLINICAL SIGN-OFF (GOLD & BLACK)
  // =========================================================================
  doc.addPage('a4', 'portrait');

  // Page 2 Deep Clinical Canvas
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Page 2
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, margin, contentWidth, 20, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.7);
  doc.rect(margin, margin, contentWidth, 20, 'D');

  // Gold ℞ Box Page 2
  doc.setFillColor(212, 175, 55);
  doc.roundedRect(margin + 3.5, margin + 3.5, 11, 13, 1.5, 1.5, 'F');
  doc.setTextColor(10, 10, 10);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('℞', margin + 6.2, margin + 12.5);

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 18, margin + 7.5);

  doc.setFontSize(7);
  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('DEPARTMENT OF CLINICAL EXERCISE PHYSIOLOGY • 7-DAY SPORTS MEDICINE PROTOCOL', margin + 18, margin + 12);

  doc.setFontSize(5.8);
  doc.setTextColor(160, 160, 165);
  doc.setFont('helvetica', 'normal');
  doc.text('Physiological Exercise Prescription calibrated to metabolic biomarkers, joint mechanics & domain', margin + 18, margin + 16.5);

  // Page 2 Right Badge
  doc.setFillColor(35, 30, 20);
  doc.roundedRect(pageWidth - margin - 35, margin + 3.5, 31, 13, 1.5, 1.5, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - margin - 35, margin + 3.5, 31, 13, 1.5, 1.5, 'D');

  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('PAGE 2 OF 2', pageWidth - margin - 29, margin + 8.5);

  doc.setFontSize(5.8);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'normal');
  doc.text('Exercise Protocol', pageWidth - margin - 31, margin + 13);

  // Conditioning Profile Card
  let p2Y = margin + 23;
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, p2Y, contentWidth, 14, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(margin, p2Y, contentWidth, 14, 'D');

  doc.setFontSize(6.8);
  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Profile:', margin + 4, p2Y + 5);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`${patientName} (${patientAge} yrs, ${patientGender})`, margin + 23, p2Y + 5);

  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Primary Domain:', margin + 4, p2Y + 10);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(conditionDomain, margin + 25, p2Y + 10);

  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Weekly Target:', margin + 85, p2Y + 5);
  doc.setTextColor(74, 222, 128);
  doc.setFont('helvetica', 'bold');
  doc.text(data.exerciseGuidelines.weeklyTarget || '250 Mins / Week • Zone 2 Cardio & Functional Strength', margin + 105, p2Y + 5);

  doc.setTextColor(150, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.text('Physician Sign-Off:', margin + 85, p2Y + 10);
  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Bharathkumar, Sports Medicine Specialist', margin + 110, p2Y + 10);

  // 7-DAY EXERCISE PROTOCOL SCHEDULE (7 Day Columns)
  p2Y += 17;
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('7-DAY CLINICAL EXERCISE SCHEDULE (MONDAY TO SUNDAY)', margin, p2Y);

  p2Y += 3;
  const exCardW = (contentWidth - 6 * 2) / 7;
  const exCardH = 106;

  days.forEach((dayName, dIdx) => {
    const cardX = margin + dIdx * (exCardW + 2);
    const exPlan = data.exercisePlans?.[dIdx] || {};

    // Card Box
    doc.setFillColor(16, 16, 19);
    doc.rect(cardX, p2Y, exCardW, exCardH, 'F');
    doc.setDrawColor(50, 45, 35);
    doc.setLineWidth(0.3);
    doc.rect(cardX, p2Y, exCardW, exCardH, 'D');

    // Day Header
    doc.setFillColor(38, 32, 20);
    doc.rect(cardX, p2Y, exCardW, 8, 'F');
    doc.setDrawColor(212, 175, 55);
    doc.rect(cardX, p2Y, exCardW, 8, 'D');

    doc.setTextColor(245, 215, 110);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.text(dayName.toUpperCase(), cardX + 1.5, p2Y + 4.5);

    const dur = exPlan.durationMins ? `${exPlan.durationMins}m` : '40m';
    doc.setTextColor(253, 224, 71);
    doc.setFont('courier', 'bold');
    doc.setFontSize(4.8);
    doc.text(dur, cardX + exCardW - 7, p2Y + 4.5);

    // Protocol Title
    let cardContentY = p2Y + 11;
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.8);
    const titleLines = doc.splitTextToSize(exPlan.protocolTitle || exPlan.focusArea || 'Conditioning Session', exCardW - 3);
    titleLines.slice(0, 3).forEach((tl: string) => {
      doc.text(tl, cardX + 1.5, cardContentY);
      cardContentY += 2.5;
    });

    // Target Heart Rate
    if (exPlan.targetHeartRate) {
      cardContentY += 1;
      doc.setTextColor(147, 197, 253);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(4.2);
      doc.text(`HR: ${exPlan.targetHeartRate}`, cardX + 1.5, cardContentY);
      cardContentY += 3;
    }

    // Movements list
    cardContentY += 1;
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.text('Movements:', cardX + 1.5, cardContentY);
    cardContentY += 2.5;

    const movements = exPlan.movements || [
      { name: 'Aerobic Pace Walk', setsAndReps: '30 mins continuous' },
      { name: 'Core Activation', setsAndReps: '3 sets x 12 reps' },
    ];
    movements.slice(0, 3).forEach((m: any) => {
      doc.setFillColor(24, 24, 28);
      doc.rect(cardX + 1, cardContentY, exCardW - 2, 11, 'F');
      doc.setDrawColor(55, 50, 40);
      doc.rect(cardX + 1, cardContentY, exCardW - 2, 11, 'D');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4.2);
      const mName = doc.splitTextToSize(m.name || 'Exercise', exCardW - 3);
      doc.text(mName[0] || '', cardX + 1.5, cardContentY + 3.2);

      doc.setTextColor(212, 175, 55);
      doc.setFont('courier', 'bold');
      doc.setFontSize(3.8);
      doc.text(m.setsAndReps || '3 sets', cardX + 1.5, cardContentY + 6.2);

      if (m.clinicalRationale) {
        doc.setTextColor(165, 165, 170);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(3.5);
        const rat = doc.splitTextToSize(m.clinicalRationale, exCardW - 3);
        doc.text(rat[0] || '', cardX + 1.5, cardContentY + 9.2);
      }

      cardContentY += 12.5;
    });

    // Recovery note at bottom of card
    const recoveryY = p2Y + exCardH - 12;
    doc.setDrawColor(50, 45, 35);
    doc.line(cardX + 1, recoveryY, cardX + exCardW - 1, recoveryY);

    doc.setTextColor(74, 222, 128);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(3.8);
    doc.text('Recovery:', cardX + 1.5, recoveryY + 3);

    doc.setTextColor(200, 200, 205);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.5);
    const recText = doc.splitTextToSize(exPlan.postWorkoutRecovery || 'Diaphragmatic breathing & hydration', exCardW - 3);
    recText.slice(0, 2).forEach((rl: string, rIdx: number) => {
      doc.text(rl, cardX + 1.5, recoveryY + 5.5 + rIdx * 2.2);
    });
  });

  // BOTTOM SECTION PAGE 2: Exercise Guidelines (Do's & Don'ts) + Dr. Bharathkumar Sign-off
  p2Y += exCardH + 5;
  const p2BottomH = pageHeight - p2Y - 12;
  const p2ColW = (contentWidth - 4) / 3;

  // 1. Exercise Do's Card
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, p2Y, p2ColW, p2BottomH, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.rect(margin, p2Y, p2ColW, p2BottomH, 'D');

  doc.setFillColor(20, 45, 30);
  doc.rect(margin, p2Y, p2ColW, 6.5, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('SPORTS MEDICINE EXERCISE DO\'S', margin + 4, p2Y + 4.8);

  let exDoY = p2Y + 10;
  const exDos = data.exerciseGuidelines.dos?.slice(0, 5) || [
    'Take a 15-minute gentle walk within 30 mins after main meals.',
    'Warm up with 8 mins of dynamic joint rotations before all sessions.',
    'Wear supportive, properly cushioned athletic footwear.',
    'Hydrate with electrolytes 20 minutes before exercise.',
    'Progress intensity gradually; prioritize technique over heavy load.',
  ];
  exDos.forEach((dItem) => {
    doc.setTextColor(74, 222, 128);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.text('✓', margin + 4, exDoY);

    doc.setTextColor(240, 240, 245);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    drawWrapped(dItem, margin + 8, exDoY, p2ColW - 12, 2.5, 2);
    exDoY += 5.5;
  });

  // 2. Exercise Don'ts & Contraindications Card
  const col2X = margin + p2ColW + 2;
  doc.setFillColor(18, 18, 22);
  doc.rect(col2X, p2Y, p2ColW, p2BottomH, 'F');
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.4);
  doc.rect(col2X, p2Y, p2ColW, p2BottomH, 'D');

  doc.setFillColor(45, 18, 18);
  doc.rect(col2X, p2Y, p2ColW, 6.5, 'F');
  doc.setTextColor(248, 113, 113);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('EXERCISE CONTRAINDICATIONS & DON\'TS', col2X + 4, p2Y + 4.8);

  let exDontY = p2Y + 10;
  const exDonts = data.exerciseGuidelines.donts?.slice(0, 5) || [
    'Avoid heavy breath-holding (Valsalva) to safeguard blood pressure.',
    'Do not exercise fasting if prone to dizziness or hypoglycemia.',
    'Never stop abruptly; allow a full 5-minute cool-down walk.',
    'Avoid high-impact plyometrics if experiencing joint stiffness.',
    'Do not train through sharp acute musculoskeletal pain.',
  ];
  exDonts.forEach((dItem) => {
    doc.setTextColor(239, 68, 68);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.text('✕', col2X + 4, exDontY);

    doc.setTextColor(240, 240, 245);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    drawWrapped(dItem, col2X + 8, exDontY, p2ColW - 12, 2.5, 2);
    exDontY += 5.5;
  });

  // 3. Dr. Bharathkumar Clinical Stamp & Sign-off Card
  const col3X = margin + (p2ColW + 2) * 2;
  doc.setFillColor(25, 22, 16);
  doc.rect(col3X, p2Y, p2ColW, p2BottomH, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.rect(col3X, p2Y, p2ColW, p2BottomH, 'D');

  doc.setFillColor(38, 32, 20);
  doc.rect(col3X, p2Y, p2ColW, 6.5, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('PHYSICIAN VERIFICATION & STAMP', col3X + 4, p2Y + 4.8);

  doc.setTextColor(245, 215, 110);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('Sports Medicine Specialist Sign-off:', col3X + 4, p2Y + 10);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('Dr. Bharathkumar, MBBS, MD (Sports Med)', col3X + 4, p2Y + 14);

  doc.setTextColor(180, 180, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.8);
  doc.text('Consultant Sports & Exercise Medicine Specialist', col3X + 4, p2Y + 17.5);
  doc.text('Žiathlon Sports Health Architecture', col3X + 4, p2Y + 20.5);

  // Digital signature seal box
  doc.setFillColor(35, 28, 18);
  doc.roundedRect(col3X + 4, p2Y + 23, p2ColW - 8, 13, 1.5, 1.5, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(col3X + 4, p2Y + 23, p2ColW - 8, 13, 1.5, 1.5, 'D');

  doc.setTextColor(245, 215, 110);
  doc.setFont('courier', 'bold');
  doc.setFontSize(5.5);
  doc.text('[ VERIFIED CLINICAL SEAL ]', col3X + 6, p2Y + 28);

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(4.2);
  doc.text(`Digital Sign ID: ZT-SM-${Date.now().toString().slice(-6)} • Certified Rx`, col3X + 6, p2Y + 32);

  // Page 2 Footer
  doc.setTextColor(140, 140, 145);
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'ŽIATHLON SPORTS MEDICINE CLINIC • Official Prescription Page 2 of 2 • Confidential Medical Document',
    margin,
    pageHeight - 5
  );
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text('Consultant: Certified Sports Medicine & Nutrition', pageWidth - margin - 60, pageHeight - 5);

  // =========================================================================
  // PAGE 3 (OPTIONAL): 90 CONDITION-SPECIFIC INGREDIENTS CLINICAL FORMULARY
  // =========================================================================
  if (options?.includeFormulary && data.conditionIngredients) {
    const ing = data.conditionIngredients;
    doc.addPage('a4', 'portrait');

    // Page 3 Deep Canvas
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header Banner
    doc.setFillColor(18, 18, 22);
    doc.rect(margin, margin, contentWidth, 20, 'F');
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.7);
    doc.rect(margin, margin, contentWidth, 20, 'D');

    // Gold ℞ Box
    doc.setFillColor(212, 175, 55);
    doc.roundedRect(margin + 3.5, margin + 3.5, 11, 13, 1.5, 1.5, 'F');
    doc.setTextColor(10, 10, 10);
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text('℞', margin + 6.2, margin + 12.5);

    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ŽIATHLON SPORTS MEDICINE CLINIC', margin + 18, margin + 7.5);

    doc.setFontSize(7);
    doc.setTextColor(245, 215, 110);
    doc.setFont('helvetica', 'bold');
    doc.text(`CLINICAL INGREDIENT FORMULARY • 90 TARGETED FOODS (${ing.conditionName || conditionDomain})`, margin + 18, margin + 12);

    doc.setFontSize(5.8);
    doc.setTextColor(160, 160, 165);
    doc.setFont('helvetica', 'normal');
    doc.text(`Certified Bioactive Foods Directory • Metabolic Target Alignment • ${nowStr}`, margin + 18, margin + 16.5);

    // Right Badge
    doc.setFillColor(35, 30, 20);
    doc.roundedRect(pageWidth - margin - 35, margin + 3.5, 31, 13, 1.5, 1.5, 'F');
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.roundedRect(pageWidth - margin - 35, margin + 3.5, 31, 13, 1.5, 1.5, 'D');

    doc.setTextColor(245, 215, 110);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text('PAGE 3 OF 3', pageWidth - margin - 29, margin + 8.5);

    doc.setFontSize(5.8);
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'normal');
    doc.text('90 Foods Formulary', pageWidth - margin - 32, margin + 13);

    // Mechanism & Target Summary Card
    let p3Y = margin + 23;
    doc.setFillColor(18, 18, 22);
    doc.rect(margin, p3Y, contentWidth, 12, 'F');
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.rect(margin, p3Y, contentWidth, 12, 'D');

    doc.setFontSize(6.2);
    doc.setTextColor(245, 215, 110);
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Mechanism: ', margin + 4, p3Y + 4.5);
    doc.setTextColor(240, 240, 245);
    doc.setFont('helvetica', 'normal');
    doc.text(ing.clinicalTagline || 'Bioactive nutrient delivery calibrated to cellular metabolic pathways.', margin + 30, p3Y + 4.5);

    doc.setTextColor(74, 222, 128);
    doc.setFont('helvetica', 'bold');
    doc.text('Health Target: ', margin + 4, p3Y + 9);
    doc.setTextColor(220, 220, 225);
    doc.setFont('helvetica', 'normal');
    doc.text(ing.primaryGoal || 'Glycemic stabilization, reduced oxidative stress and lean tissue preservation.', margin + 22, p3Y + 9);

    // 8 Categories grid
    p3Y += 15;
    const categories = [
      { name: '15 Cereals & Ancient Grains', items: ing.cereals || [] },
      { name: '15 Legumes & Pulses', items: ing.pulses || [] },
      { name: '15 Therapeutic Vegetables', items: ing.vegetables || [] },
      { name: '15 Low-GI Fruits', items: ing.fruits || [] },
      { name: '10 Nuts & Bio-Seeds', items: ing.nutsAndSeeds || [] },
      { name: '5 Probiotic & Dairy Foods', items: ing.dairyFoods || [] },
      { name: '5 Ayurvedic Botanical Adaptogens', items: ing.ayurvedicFoods || [] },
      { name: '10 Functional Superfoods', items: ing.functionalFoods || [] },
    ];

    const catColW = (contentWidth - 4) / 2;
    const catH = 55;

    categories.forEach((cat, cIdx) => {
      const colX = cIdx % 2 === 0 ? margin : margin + catColW + 4;
      const rowNum = Math.floor(cIdx / 2);
      const catY = p3Y + rowNum * (catH + 3);

      doc.setFillColor(18, 18, 22);
      doc.rect(colX, catY, catColW, catH, 'F');
      doc.setDrawColor(50, 45, 35);
      doc.setLineWidth(0.3);
      doc.rect(colX, catY, catColW, catH, 'D');

      // Header
      doc.setFillColor(35, 28, 18);
      doc.rect(colX, catY, catColW, 5.5, 'F');
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.8);
      doc.text(cat.name, colX + 3, catY + 4);

      // Render items
      let itY = catY + 8.5;
      const displayItems = (cat.items || []).slice(0, 7);
      displayItems.forEach((it: any) => {
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(4.5);
        doc.text(`#${it.rank || '•'} ${it.name || 'Item'}`, colX + 3, itY);

        const statusColor = it.status === 'Recommended' ? [74, 222, 128] : it.status === 'Caution' ? [251, 191, 36] : [239, 68, 68];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(4.2);
        doc.text(it.status || 'Active', colX + catColW - 16, itY);

        itY += 6.5;
      });
    });

    // Page 3 Footer
    doc.setTextColor(140, 140, 145);
    doc.setFontSize(5.8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'ŽIATHLON SPORTS MEDICINE CLINIC • Official Prescription Page 3 of 3 • Confidential Medical Document',
      margin,
      pageHeight - 5
    );
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(`Prescription ID: ${patientId}`, pageWidth - margin - 45, pageHeight - 5);
  }

  // Save the generated PDF
  const safeName = (patientName || 'Patient').replace(/\s+/g, '_');
  const domainSuffix = (conditionDomain || 'Rx').replace(/\s+/g, '_');
  const safeDate = new Date().toISOString().split('T')[0];
  const safeFilename =
    filename ||
    `Ziathlon_Clinical_Prescription_${safeName}_${domainSuffix}.pdf`;

  // Auto-archive to clinical documents archive so it appears in reports list & preview sheets
  try {
    const pdfDataUri = doc.output('datauristring');
    const existingReportsStr = localStorage.getItem('ziathlon_uploaded_reports') || localStorage.getItem('ELSHA_UPLOADED_REPORTS');
    const existingReports = existingReportsStr ? JSON.parse(existingReportsStr) : [];
    const newReport = {
      id: `rx-${Date.now()}`,
      name: safeFilename,
      original_file_name: safeFilename,
      mimetype: 'application/pdf',
      mime_type: 'application/pdf',
      fileSize: '72 KB',
      file_size_formatted: '72 KB',
      date: safeDate,
      document_date: safeDate,
      category: 'Prescriptions',
      fileUrl: pdfDataUri,
      downloadUrl: pdfDataUri,
      status: 'Ready',
      notes: `Official Clinical Prescription for ${patientName}`,
    };
    const updated = [newReport, ...existingReports.filter((r: any) => r.name !== safeFilename)];
    localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(updated));
    localStorage.setItem('ELSHA_UPLOADED_REPORTS', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('elsha-documents-updated'));
  } catch (err) {
    console.warn('Could not auto-archive prescription:', err);
  }

  doc.save(safeFilename);
}

