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
  // OFFICIAL DOCUMENT BORDER: ORNATE CERTIFICATE DOSSIER LAYOUT (MATCHING REFERENCE)
  // =========================================================================
  // Background Warm Parchment Paper
  doc.setFillColor(250, 248, 245); // #FAF8F5
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 1. Outer Solid Black Border Line
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.7);
  doc.rect(3.5, 3.5, pageWidth - 7.0, pageHeight - 7.0);

  // 2. Inner Parallel Border Line with corner breaks (5.2mm inset)
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.35);
  // Top Inner Rail
  doc.line(24, 5.2, pageWidth - 24, 5.2);
  doc.circle(24, 5.2, 0.45, 'F');
  doc.circle(pageWidth - 24, 5.2, 0.45, 'F');

  // Bottom Inner Rail
  doc.line(24, pageHeight - 5.2, pageWidth - 24, pageHeight - 5.2);
  doc.circle(24, pageHeight - 5.2, 0.45, 'F');
  doc.circle(pageWidth - 24, pageHeight - 5.2, 0.45, 'F');

  // Left Inner Rail
  doc.line(5.2, 24, 5.2, pageHeight - 24);
  doc.circle(5.2, 24, 0.45, 'F');
  doc.circle(5.2, pageHeight - 24, 0.45, 'F');

  // Right Inner Rail
  doc.line(pageWidth - 5.2, 24, pageWidth - 5.2, pageHeight - 24);
  doc.circle(pageWidth - 5.2, 24, 0.45, 'F');
  doc.circle(pageWidth - 5.2, pageHeight - 24, 0.45, 'F');

  // 3. Ornate Corner Filigree Vector Accents at all 4 Corners
  const drawCornerFiligree = (cx: number, cy: number, flipX: number, flipY: number) => {
    doc.setDrawColor(17, 17, 17);
    doc.setFillColor(17, 17, 17);
    // Central corner rosette node
    doc.circle(cx + 7.5 * flipX, cy + 7.5 * flipY, 0.9, 'F');
    doc.circle(cx + 7.5 * flipX, cy + 7.5 * flipY, 1.6, 'S');

    // Diagonal vine curves
    doc.setLineWidth(0.4);
    doc.line(cx + 3.8 * flipX, cy + 16 * flipY, cx + 16 * flipX, cy + 3.8 * flipY);
    doc.line(cx + 6 * flipX, cy + 13 * flipY, cx + 13 * flipX, cy + 6 * flipY);

    // Decorative buds
    doc.circle(cx + 12 * flipX, cy + 12 * flipY, 0.6, 'F');
    doc.circle(cx + 5.5 * flipX, cy + 18 * flipY, 0.5, 'F');
    doc.circle(cx + 18 * flipX, cy + 5.5 * flipY, 0.5, 'F');
  };

  // Top-Left
  drawCornerFiligree(3.5, 3.5, 1, 1);
  // Top-Right
  drawCornerFiligree(pageWidth - 3.5, 3.5, -1, 1);
  // Bottom-Left
  drawCornerFiligree(3.5, pageHeight - 3.5, 1, -1);
  // Bottom-Right
  drawCornerFiligree(pageWidth - 3.5, pageHeight - 3.5, -1, -1);

  // =========================================================================
  // 1. TOP HEADER: ZIATHLON OFFICIAL LOGO & TITLE (SIDE-BY-SIDE LOCKUP)
  // =========================================================================

  // A. Top-Left Emblem Ribbon Vector (Exact 3 Ribbon Segments + Medical Cross)
  const emblemX = marginX + 1.0;
  const emblemY = 3.5;

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

  // Wordmark: ZIATHLON (Positioned side-by-side with emblem with generous clearance)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text('ZIATHLON', emblemX + 16.5, emblemY + 8.2);

  // Subtitle: SPORTS MEDICINE CLINIC
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.text('SPORTS MEDICINE CLINIC', emblemX + 16.7, emblemY + 12.2);

  // Top-Right: Clinical Centre Identification
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.text('OFFICIAL CLINICAL RECORD', pageWidth - marginX, emblemY + 8.0, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Centre for Sports Medicine & Metabolic Health', pageWidth - marginX, emblemY + 11.8, { align: 'right' });

  // Header Divider: One Black Line and One Purple Line (Cleanly below the header)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);
  doc.line(marginX, 21.0, pageWidth - marginX, 21.0);

  doc.setDrawColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.setLineWidth(0.5);
  doc.line(marginX, 21.6, pageWidth - marginX, 21.6);

  // =========================================================================
  // 2. LOCKED FOOTER (CLINIC ADDRESS + DOCTOR CREDENTIALS)
  // =========================================================================

  // Footer Divider: One Purple Line and One Black Line
  const footerLineY = 273.0;
  doc.setDrawColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.setLineWidth(0.5);
  doc.line(marginX, footerLineY, pageWidth - marginX, footerLineY);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);
  doc.line(marginX, footerLineY + 0.5, pageWidth - marginX, footerLineY + 0.5);

  // Notice Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(156, 163, 175);
  doc.text('Not valid for Medico Legal Purpose', marginX, footerLineY + 3.8);

  // Clinic Address (Bottom-Left on White Canvas)
  const addrX = marginX;
  const addrY = footerLineY + 7.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.clinicAddressLine1 || '#55, 4th Cross, Panduranga Nagar,', addrX, addrY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(data.clinicAddressLine2 || 'Off Bannerghatta Road, Near IIM-B,', addrX, addrY + 3.5);
  doc.text(data.clinicAddressLine3 || 'Bangalore 560076', addrX, addrY + 7.0);

  // A. Doctor Credentials (Bottom-Right, above contact info)
  const docRightX = marginX + contentWidth;
  const docBottomY = footerLineY + 7.0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorName || 'Dr. Bharath Kumar B', docRightX, docBottomY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(31, 41, 55);
  doc.text(data.doctorQualifications || 'MBBS, PGDSM (Sports Medicine)', docRightX, docBottomY + 3.4, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(data.doctorRole || 'Medical Director | Ziathlon', docRightX, docBottomY + 6.6, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorRegNo || 'KMC#81009', docRightX, docBottomY + 9.8, { align: 'right' });

  // Contact Details (Below doctor credentials with Vertical Purple Accent Line on Right)
  const contactY = docBottomY + 13.2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorPhone || '+91 799 699 44 99', docRightX - 2.0, contactY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(data.doctorEmail || 'info@ziathlon.com', docRightX - 2.0, contactY + 3.0, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.text(data.doctorWebsite || 'www.ziathlon.com', docRightX - 2.0, contactY + 6.0, { align: 'right' });

  // Vertical Purple Accent Bar on Right Edge of Contact Info
  doc.setDrawColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
  doc.setLineWidth(0.8);
  doc.line(docRightX, contactY - 1.8, docRightX, contactY + 6.4);

  // =========================================================================
  // 3. MAIN CLINICAL CONTENT AREA (CONTINUOUS CLINICAL REPORT LAYOUT)
  // =========================================================================
  let curY = 27.5;

  // 1. PATIENT INFORMATION: COMPACT READABLE LINES (NO TABLES, NO COLUMNS)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(11, 8, 38);
  const nameLine = `${data.patientDisplayName}, ${data.patientGender}, ${data.patientAge}, Phone: ${data.patientPhone}`;
  doc.text(nameLine, marginX, curY);

  // Consultation Date & Time on the right
  const dateStr = `Date: ${data.formattedDateTime.split(',')[0]?.trim() || '24/09/2026'} | Time: ${data.formattedDateTime.split(',')[1]?.trim() || '11:30 AM'}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(dateStr, marginX + contentWidth, curY, { align: 'right' });

  curY += 4.2;

  // Line 2: City | UHID | ABHA Address | Occupation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
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
    doc.setFontSize(7.8);
    doc.setTextColor(COLOR_PURPLE[0], COLOR_PURPLE[1], COLOR_PURPLE[2]);
    const labelStr = `${label} `;
    const labelWidth = doc.getTextWidth(labelStr);
    doc.text(labelStr, marginX, curY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
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
        curY += 3.6;
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
