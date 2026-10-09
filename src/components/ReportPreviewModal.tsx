import React from 'react';
import { ClinicalReportDocument } from './ReportsUploadSection';
import { DocumentViewerModal, DocumentViewerItem } from './DocumentViewerModal';

interface ReportPreviewModalProps {
  report: ClinicalReportDocument;
  onClose: () => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ report, onClose }) => {
  const viewerDoc: DocumentViewerItem = {
    id: report.id,
    name: report.name,
    mimetype: (report as any).mimetype || (report.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : undefined),
    fileSize: report.fileSize,
    date: report.date,
    fileUrl: ((report as any).fileUrl && !(report as any).fileUrl.startsWith('blob:')) 
      ? (report as any).fileUrl 
      : `/api/documents/${report.id}/preview`,
    downloadUrl: ((report as any).downloadUrl && !(report as any).downloadUrl.startsWith('blob:')) 
      ? (report as any).downloadUrl 
      : `/api/documents/${report.id}/download`,
    extractedSnippet: report.clinicalSummary,
    pageCount: (report as any).pageCount || 1,
    rawFile: (report as any).rawFile,
  };

  return <DocumentViewerModal document={viewerDoc} onClose={onClose} />;
};
