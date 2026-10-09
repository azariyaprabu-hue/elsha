import jsPDF from 'jspdf';

export interface ZiathlonPrescriptionItem {
  medicine: string;
  dosage?: string;
  timing?: string;
  duration?: string;
  instructions?: string;
}

export interface ZiathlonDocumentPdfData {
  patientDisplayName: string;
  patientGender: string;
  patientAge: string | number;
  patientPhone: string;
  formattedDateTime: string;
  abhaAddress?: string;
  uhid?: string;
  city?: string;
  address?: string;
  occupation?: string;
  tag?: string;
  vitals: string;
  symptoms: string;
  clinicalExamination?: string;
  diagnosticsHistory?: string;
  diagnoses?: string;
  goals?: string;
  medicalHistory?: string;
  nutritionAssessment?: string;
  nutritionPrescription?: string;
  exerciseRecommendations?: string;
  treatmentPlan?: string;
  followUp?: string;
  prescriptions?: ZiathlonPrescriptionItem[];
  consultationNote?: string;
  doctorName?: string;
  doctorQualifications?: string;
  doctorRole?: string;
  doctorRegNo?: string;
  doctorPhone?: string;
  doctorEmail?: string;
  doctorWebsite?: string;
  clinicAddressLine1?: string;
  clinicAddressLine2?: string;
  clinicAddressLine3?: string;
}

export interface GeneratedPdfResult {
  doc: jsPDF;
  blob: Blob;
  blobUrl: string;
  filename: string;
  base64: string;
  dataUrl?: string;
}

/**
 * GENERATES A 100% REAL VECTOR PDF FILE
 * - Exact 1:1 match with Ziathlon Master Template (A4 Portrait 210mm x 297mm)
 * - Zero HTML2Canvas / zero screenshot / zero screen capture
 * - Zero web-viewer / zero Adobe Acrobat wrapper
 * - Real application/pdf MIME type
 * - Pure selectable text and crisp vector geometry
 */
export function generateZiathlonDocumentPdf(data: ZiathlonDocumentPdfData): GeneratedPdfResult {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 12.6; // exact 48px at 800px width (48/800 * 210 = 12.6mm)
  const contentWidth = 184.8; // 704px at 800px width (704/800 * 210 = 184.8mm)

  // Document Colors
  const COLOR_NAVY = [11, 8, 38]; // #0B0826
  const COLOR_PURPLE = [112, 22, 183]; // #7016B7
  const COLOR_LIGHT_PURPLE = [147, 51, 234]; // #9333EA
  const COLOR_WHITE = [255, 255, 255];
  const COLOR_BORDER = [203, 213, 225]; // #CBD5E1
  const COLOR_MUTED_BG = [241, 245, 249]; // #F1F5F9

  // =========================================================================
  // 1. TOP HEADER: ZIATHLON OFFICIAL LOGO (LEFT) & ANGLED GEOMETRIC GRAPHIC (RIGHT)
  // =========================================================================

  // A. Top-Left Emblem Ribbon Vector (Exact 3 Ribbon Segments + Medical Cross)
  const emblemX = marginX;
  const emblemY = 6.8;

  // Segment 1 (Top Ribbon)
  doc.setFillColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.triangle(emblemX + 2.1, emblemY + 4.2, emblemX + 11.0, emblemY + 4.2, emblemX + 2.6, emblemY + 7.0, 'F');

  // Segment 2 (Middle Slanted Ribbon Stripe)
  doc.triangle(emblemX + 2.9, emblemY + 8.1, emblemX + 11.0, emblemY + 5.0, emblemX + 10.2, emblemY + 7.9, 'F');
  doc.triangle(emblemX + 2.9, emblemY + 8.1, emblemX + 3.7, emblemY + 10.2, emblemX + 10.2, emblemY + 7.9, 'F');

  // Segment 3 (Bottom Apex Tip)
  doc.triangle(emblemX + 4.5, emblemY + 11.2, emblemX + 9.3, emblemY + 9.6, emblemX + 6.4, emblemY + 13.5, 'F');

  // Medical Cross (+) at top right of ribbon
  doc.setFillColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.roundedRect(emblemX + 11.3, emblemY + 2.4, 2.6, 0.9, 0.2, 0.2, 'F');
  doc.roundedRect(emblemX + 12.15, emblemY + 1.55, 0.9, 2.6, 0.2, 0.2, 'F');

  // Wordmark: ZIATHLON
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text('ZIATHLON', emblemX, emblemY + 18.5);

  // Subtitle: SPORTS MEDICINE CLINIC
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.text('SPORTS MEDICINE CLINIC', emblemX, emblemY + 22.2);

  // B. Top-Right Angled Geometric Dark Navy & Purple Graphics (No Tagline Text)
  const topGraphicW = 99.75; // 380px at 800px width
  const topGraphicH = 29.4;  // 112px at 800px width
  const tgX = pageWidth - topGraphicW;
  const sx = topGraphicW / 380;
  const sy = topGraphicH / 112;

  // 1. Top dark navy triangular corner cap sitting at top-right
  doc.setFillColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.triangle(tgX + 175 * sx, 0, tgX + 380 * sx, 0, tgX + 380 * sx, 48 * sy, 'F');
  doc.triangle(tgX + 175 * sx, 0, tgX + 220 * sx, 48 * sy, tgX + 380 * sx, 48 * sy, 'F');

  // 2. Primary Royal Purple Slanted Parallelogram
  doc.setFillColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.triangle(tgX + 35 * sx, 0, tgX + 165 * sx, 0, tgX + 238 * sx, 104 * sy, 'F');
  doc.triangle(tgX + 35 * sx, 0, tgX + 108 * sx, 104 * sy, tgX + 238 * sx, 104 * sy, 'F');

  // 3. Medium Purple Layered Stripe
  doc.setFillColor(COLOR_LIGHT_PURPLE[0], COLOR_LIGHT_PURPLE[1], COLOR_LIGHT_PURPLE[2]);
  doc.triangle(tgX + 155 * sx, 0, tgX + 205 * sx, 0, tgX + 270 * sx, 104 * sy, 'F');
  doc.triangle(tgX + 155 * sx, 0, tgX + 220 * sx, 104 * sy, tgX + 270 * sx, 104 * sy, 'F');

  // 4. Dark Navy Slanted Wedge
  doc.setFillColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.triangle(tgX + 195 * sx, 0, tgX + 270 * sx, 0, tgX + 325 * sx, 86 * sy, 'F');
  doc.triangle(tgX + 195 * sx, 0, tgX + 250 * sx, 86 * sy, tgX + 325 * sx, 86 * sy, 'F');

  // 5. White separator hairline grooves
  doc.setDrawColor(COLOR_WHITE[0], COLOR_WHITE[1], COLOR_WHITE[2]);
  doc.setLineWidth(0.65);
  doc.line(tgX + 162 * sx, 0, tgX + 235 * sx, 104 * sy);
  doc.line(tgX + 202 * sx, 0, tgX + 267 * sx, 104 * sy);

  // 6. Horizontal purple baseline rule extending to right edge
  doc.setDrawColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.setLineWidth(1.0);
  doc.line(tgX + 225 * sx, 100 * sy, pageWidth, 100 * sy);

  // =========================================================================
  // 2. LOCKED FOOTER (BOTTOM-LEFT NAVY & PURPLE BANNER + BOTTOM-RIGHT DOCTOR INFO)
  // =========================================================================

  // A. Doctor Credentials (Bottom-Right, above contact info)
  const docRightX = marginX + contentWidth;
  const docBottomY = 265.0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorName || 'Dr. Bharath Kumar B', docRightX, docBottomY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(31, 41, 55);
  doc.text(data.doctorQualifications || 'MBBS, PGDSM (Sports Medicine)', docRightX, docBottomY + 3.8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(data.doctorRole || 'Medical Director | Ziathlon', docRightX, docBottomY + 7.2, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorRegNo || 'KMC#81009', docRightX, docBottomY + 10.6, { align: 'right' });

  // Contact Details (Below doctor credentials with Vertical Purple Accent Line on Right)
  const contactY = docBottomY + 14.8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorPhone || '+91 799 699 44 99', docRightX - 2.0, contactY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(data.doctorEmail || 'info@ziathlon.com', docRightX - 2.0, contactY + 3.4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorWebsite || 'www.ziathlon.com', docRightX - 2.0, contactY + 6.8, { align: 'right' });

  // Vertical Purple Accent Bar on Right Edge of Contact Info
  doc.setDrawColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.setLineWidth(0.9);
  doc.line(docRightX, contactY - 2.0, docRightX, contactY + 7.2);

  // B. Bottom Angled Geometric Banner (y = 275.5mm to 297mm, left-side only up to ~115mm)
  const bannerY = 275.5;
  const bannerH = 21.5;
  const bsx = (pageWidth * (440 / 800)) / 440;
  const bsy = bannerH / 82;

  // 1. Left Dark Navy Block
  doc.setFillColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.triangle(0, bannerY, 285 * bsx, bannerY, 330 * bsx, bannerY + bannerH, 'F');
  doc.triangle(0, bannerY, 0, bannerY + bannerH, 330 * bsx, bannerY + bannerH, 'F');

  // 2. Top Purple Accent Stripe along top of block
  doc.setFillColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.triangle(0, bannerY, 325 * bsx, bannerY, 338 * bsx, bannerY + 8 * bsy, 'F');
  doc.triangle(0, bannerY, 0, bannerY + 8 * bsy, 338 * bsx, bannerY + 8 * bsy, 'F');

  // 3. Middle Royal Purple Parallelogram Stripe
  doc.setFillColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.triangle(280 * bsx, bannerY, 360 * bsx, bannerY, 405 * bsx, bannerY + bannerH, 'F');
  doc.triangle(280 * bsx, bannerY, 325 * bsx, bannerY + bannerH, 405 * bsx, bannerY + bannerH, 'F');

  // 4. Dark Navy Wedge
  doc.setFillColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.triangle(355 * bsx, bannerY, 395 * bsx, bannerY, 440 * bsx, bannerY + bannerH, 'F');
  doc.triangle(355 * bsx, bannerY, 400 * bsx, bannerY + bannerH, 440 * bsx, bannerY + bannerH, 'F');

  // 5. White hairline separator lines
  doc.setDrawColor(COLOR_WHITE[0], COLOR_WHITE[1], COLOR_WHITE[2]);
  doc.setLineWidth(0.65);
  doc.line(278 * bsx, bannerY, 323 * bsx, bannerY + bannerH);
  doc.line(358 * bsx, bannerY, 403 * bsx, bannerY + bannerH);

  // C. Clinic Address (Inside Left Dark Navy Block)
  const addrX = marginX;
  const addrY = bannerY + 6.8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(COLOR_WHITE[0], COLOR_WHITE[1], COLOR_WHITE[2]);
  doc.text(data.clinicAddressLine1 || '#55, 4th Cross, Panduranga Nagar,', addrX, addrY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(230, 230, 230);
  doc.text(data.clinicAddressLine2 || 'Off Bannerghatta Road, Near IIM-B,', addrX, addrY + 3.6);
  doc.text(data.clinicAddressLine3 || 'Bangalore 560076', addrX, addrY + 7.2);

  // =========================================================================
  // 3. MAIN CLINICAL CONTENT AREA (CONTINUOUS CLINICAL REPORT LAYOUT)
  // =========================================================================
  let curY = 34.0;

  // 1. PATIENT INFORMATION: COMPACT READABLE LINES (NO TABLES, NO COLUMNS)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(11, 8, 38);
  const nameLine = `${data.patientDisplayName}, ${data.patientGender}, ${data.patientAge}, Phone: ${data.patientPhone}`;
  doc.text(nameLine, marginX, curY);

  // Consultation Date & Time on the right
  const dateStr = `Date: ${data.formattedDateTime.split(',')[0]?.trim() || '24/09/2026'} | Time: ${data.formattedDateTime.split(',')[1]?.trim() || '11:30 AM'}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text(dateStr, marginX + contentWidth, curY, { align: 'right' });

  curY += 4.0;

  // Line 2: City | UHID | ABHA Address | Occupation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(51, 65, 85);
  const line2 = `City: ${data.city || 'Bangalore'} | UHID: ${data.uhid || 'ZC00459'} | ABHA Address: ${data.abhaAddress || '10436404055711@abdm'} | Occupation: ${data.occupation || 'IT Sector'}`;
  doc.text(line2, marginX, curY);

  curY += 3.8;

  // Line 3: Clinical Domain | Address
  const line3 = `Clinical Domain: ${data.tag || 'Metabolic Health & Sports Medicine'} | Address: ${data.address || 'JP Nagar 7th Phase, Bangalore'}`;
  doc.text(line3, marginX, curY);

  curY += 2.5;

  // Subtle separator line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(marginX, curY, marginX + contentWidth, curY);
  curY += 4.0;

  // Helper for Clinical Label + Content (Continuous inline format with precise word-wrapping)
  const drawClinicalLine = (label: string, content?: string) => {
    if (!content) return;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
    const labelStr = `${label} `;
    const labelWidth = doc.getTextWidth(labelStr);
    doc.text(labelStr, marginX, curY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.0);
    doc.setTextColor(17, 24, 39);

    const words = content.split(' ');
    let currentLine = '';
    let isFirstLine = true;

    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const targetW = isFirstLine ? contentWidth - labelWidth : contentWidth;

      if (doc.getTextWidth(testLine) > targetW && currentLine !== '') {
        if (isFirstLine) {
          doc.text(currentLine, marginX + labelWidth, curY);
          isFirstLine = false;
        } else {
          doc.text(currentLine, marginX, curY);
        }
        curY += 3.5;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (isFirstLine) {
        doc.text(currentLine, marginX + labelWidth, curY);
      } else {
        doc.text(currentLine, marginX, curY);
      }
    }
    curY += 4.2;
  };

  // 2. Vitals (Continuous Inline Format)
  drawClinicalLine('VITALS:', data.vitals);

  // 3. Symptoms (Continuous Inline Format)
  drawClinicalLine('SYMPTOMS:', data.symptoms);

  // 4. Clinical Examination (Continuous Inline Format)
  if (data.clinicalExamination) {
    drawClinicalLine('CLINICAL EXAMINATION:', data.clinicalExamination);
  }

  // 5. Diagnostics - Past History (Continuous Inline Format)
  if (data.diagnosticsHistory) {
    drawClinicalLine('DIAGNOSTICS – PAST HISTORY:', data.diagnosticsHistory);
  }

  // 6. Working Diagnoses and Risk Factors (Continuous Inline Format)
  if (data.diagnoses) {
    drawClinicalLine('WORKING DIAGNOSES AND RISK FACTORS:', data.diagnoses);
  }

  // 7. Clinical Goals (Continuous Inline Format)
  if (data.goals) {
    drawClinicalLine('CLINICAL GOALS:', data.goals);
  }

  // 8. Medical History (Continuous Inline Format)
  if (data.medicalHistory) {
    drawClinicalLine('MEDICAL HISTORY:', data.medicalHistory);
  }

  // 9. Nutrition Assessment (Continuous Inline Format)
  if (data.nutritionAssessment) {
    drawClinicalLine('NUTRITION ASSESSMENT:', data.nutritionAssessment);
  }

  // 10. Nutrition Prescription (Continuous Inline Format)
  if (data.nutritionPrescription) {
    drawClinicalLine('NUTRITION PRESCRIPTION:', data.nutritionPrescription);
  }

  // 11. Exercise Recommendations (Continuous Inline Format)
  if (data.exerciseRecommendations) {
    drawClinicalLine('EXERCISE RECOMMENDATIONS:', data.exerciseRecommendations);
  }

  // 12. Treatment Plan / Prescription (Continuous Inline Format)
  const rxString = data.treatmentPlan || (data.prescriptions && data.prescriptions.length > 0
    ? data.prescriptions.map((p) => {
        const details = [
          p.dosage ? `Dose: ${p.dosage}` : '',
          p.timing ? `Frequency: ${p.timing}` : '',
          p.duration ? `Duration: ${p.duration}` : '',
          p.instructions ? `Instructions: ${p.instructions}` : '',
        ].filter(Boolean).join('; ');
        return details ? `${p.medicine} (${details})` : p.medicine;
      }).join(' | ')
    : 'Kapiva Shilajit (Dose: 250 mg; Frequency: 1-0-0 After Meal; Duration: 30 Days; Instructions: Take after breakfast) | Vlado\'s Himalayan Organic Probiotics 60 Billion CFU (Dose: 1 capsule; Frequency: 1-0-0 After Meal; Duration: 30 Days; Instructions: Take after breakfast) | Wellman Health Supplement (Dose: 1 tablet; Frequency: 0-0-1 After Meal; Duration: 30 Days; Instructions: Take after dinner) | Liposomal MGD3 (Dose: 1 capsule; Frequency: 0-0-1 After Meal; Duration: 30 Days; Instructions: Take after dinner)');
  drawClinicalLine('TREATMENT PLAN / PRESCRIPTION (℞):', rxString);

  // 13. Follow-up Recommendations (Continuous Inline Format)
  if (data.followUp) {
    drawClinicalLine('FOLLOW-UP RECOMMENDATIONS:', data.followUp);
  }

  // Clinical Consultation Note
  curY += 3.5;
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text(
    data.consultationNote ||
      'Clinical Consultation • Electronic EMR Record • Follow up after 30 days or earlier in case of acute symptoms',
    marginX,
    curY
  );

  // Generate Real PDF File Blob & Data
  const safeName = (data.patientDisplayName || 'Patient').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeName}_Ziathlon_Medical_Record.pdf`;
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const base64 = doc.output('datauristring');

  return {
    doc,
    blob,
    blobUrl,
    filename,
    base64,
  };
}
