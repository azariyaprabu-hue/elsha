import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Camera,
  CheckCircle2,
  Trash2,
  Eye,
  Download,
  Calendar,
  FileCheck, 
  AlertTriangle,
  Maximize2,
  Minimize2,
  X,
  FileSearch,
  ExternalLink,
  FileSpreadsheet,
  File,
  Layers
} from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

export interface UploadedDoc {
  id: string;
  originalFilename: string;
  storedFilename: string;
  mimetype: string;
  size: number;
  sizeFormatted: string;
  uploadTimestamp: string;
  uploadDateFormatted: string;
  pageCount: number;
  detectedType: string;
  status: string;
  verificationMessage: string;
  isCorrect: boolean;
  extractedSnippet: string;
  rawFile?: File;
}

export interface ClinicalReportDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  fileSize: string;
  keyBiomarkers: { marker: string; value: string; status: 'Normal' | 'Borderline' | 'Elevated' | 'Critical'; normalRange?: string; whyLow?: string }[];
  clinicalSummary: string;
}

export const ReportsUploadSection: React.FC = () => {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [activeDoc, setActiveDoc] = useState<UploadedDoc | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.documents)) {
          setDocuments(data.documents);
          if (data.documents.length > 0 && !activeDoc) {
            setActiveDoc(data.documents[0]);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch documents', e);
    }
  };

  const handleFileUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;

    const allowedExtensions = /\.(pdf|doc|docx|txt|csv|jpg|jpeg|png|webp)$/i;
    if (!allowedExtensions.test(fileToUpload.name)) {
      setErrorMessage('Unable to upload this document. Please select a valid PDF, DOC, DOCX, TXT, CSV, JPG, JPEG, PNG, or WEBP file.');
      setSuccessMessage(null);
      return;
    }

    if (fileToUpload.size > 50 * 1024 * 1024) {
      setErrorMessage('Unable to upload this document. File is too large. Maximum allowed size is 50MB.');
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploading(true);
    setUploadProgress(0);

    const steps = [25, 50, 75, 100];
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setUploadProgress(steps[stepIndex]);
        stepIndex++;
      }
    }, 200);

    const formData = new FormData();
    formData.append('document', fileToUpload);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.document) {
          const permanentDoc = {
            ...data.document,
            fileUrl: `/api/documents/${data.document.id}/preview`,
            downloadUrl: `/api/documents/${data.document.id}/download`,
            textUrl: `/api/documents/${data.document.id}/text`,
            rawFile: fileToUpload,
          };
          setDocuments((prev) => [permanentDoc, ...prev.filter(d => d.id !== permanentDoc.id)]);
          setActiveDoc(permanentDoc);
          // In Upload Folder: Document save is enough! Do not automatically pop open viewer or panels.
          setSuccessMessage('✓ Document saved successfully to patient dossier');

          // Automatically save into Medical Records Folder's store as well
          try {
            const savedMedDocs = JSON.parse(localStorage.getItem('ZIATHLON_MEDICAL_RECORDS_DOCS') || '[]');
            const dObj = new Date();
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const fMonth = `${monthNames[dObj.getMonth()]} ${dObj.getFullYear()}`;
            const fDate = `${dObj.getDate()} ${monthNames[dObj.getMonth()].slice(0, 3)} '${String(dObj.getFullYear()).slice(-2)}`;
            const medRecordEntry = {
              id: permanentDoc.id,
              name: permanentDoc.originalFilename,
              category: permanentDoc.detectedType?.includes('Lab') ? 'Lab Report' : 'Medical Record',
              date: new Date().toISOString().split('T')[0],
              formattedMonth: fMonth,
              formattedDisplayDate: fDate,
              smartBadge: true,
              tag: 'Profile Uploaded',
              fileSize: permanentDoc.sizeFormatted || '2.1 MB',
              thumbnailType: permanentDoc.originalFilename?.toLowerCase().includes('tanita') ? 'tanita' : 'lab_redcliffe',
              fileUrl: permanentDoc.fileUrl,
              downloadUrl: permanentDoc.downloadUrl,
              mimetype: permanentDoc.mimetype,
              rawFile: fileToUpload
            };
            const updatedMedDocs = [medRecordEntry, ...savedMedDocs.filter((d: any) => d.id !== permanentDoc.id)];
            localStorage.setItem('ZIATHLON_MEDICAL_RECORDS_DOCS', JSON.stringify(updatedMedDocs));

            // Also sync to ziathlon_uploaded_reports
            const rawPrev = localStorage.getItem('ziathlon_uploaded_reports');
            const parsedPrev = rawPrev ? JSON.parse(rawPrev) : [];
            const newDocEntry = {
              id: permanentDoc.id,
              name: permanentDoc.originalFilename,
              type: permanentDoc.detectedType || 'Laboratory Report',
              mimetype: permanentDoc.mimetype,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              fileSize: permanentDoc.sizeFormatted || '2.1 MB',
              fileUrl: permanentDoc.fileUrl,
              downloadUrl: permanentDoc.downloadUrl,
              thumbnailUrl: permanentDoc.fileUrl,
              pageCount: permanentDoc.pageCount || 1,
            };
            const updatedProfileUploads = [newDocEntry, ...parsedPrev.filter((d: any) => d.id !== permanentDoc.id)];
            localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(updatedProfileUploads));
          } catch (e) {}

          window.dispatchEvent(new CustomEvent('medical-documents-changed'));
          window.dispatchEvent(new CustomEvent('ziathlon-medical-record-added'));
          window.dispatchEvent(new Event('storage'));
          setTimeout(() => setSuccessMessage(null), 4000);
        } else {
          setErrorMessage('✕ Upload failed');
        }
      } else {
        setErrorMessage('✕ Upload failed (server error)');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setErrorMessage('✕ Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // 1. Immediately filter out from list
      setDocuments((prev) => prev.filter(d => d.id !== id));
      if (activeDoc?.id === id) {
        const remaining = documents.filter(d => d.id !== id);
        setActiveDoc(remaining[0] || null);
      }

      // 2. Mark in deleted doc ids in local storage
      try {
        const deletedIds = JSON.parse(localStorage.getItem('ZIATHLON_DELETED_DOC_IDS') || '[]');
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          localStorage.setItem('ZIATHLON_DELETED_DOC_IDS', JSON.stringify(deletedIds));
        }

        // Also remove from ZIATHLON_MEDICAL_RECORDS_DOCS
        const medDocs = JSON.parse(localStorage.getItem('ZIATHLON_MEDICAL_RECORDS_DOCS') || '[]');
        const updatedMed = medDocs.filter((m: any) => m.id !== id);
        localStorage.setItem('ZIATHLON_MEDICAL_RECORDS_DOCS', JSON.stringify(updatedMed));
      } catch (e) {}

      // 3. Send DELETE call
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      await fetch(`/api/medical-records/${id}`, { method: 'DELETE' });

      // 4. Dispatch sync event
      window.dispatchEvent(new CustomEvent('medical-documents-changed'));
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  const handleDownload = (doc: UploadedDoc) => {
    const a = document.createElement('a');
    a.href = `/api/documents/${doc.id}/download`;
    a.download = doc.originalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Upload className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>FILE ATTACHMENTS</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            UPLOAD THE FILES (PREVIOUS REPORTS & MEDICAL RECORDS)
          </h2>
          <p className="text-xs text-gray-400">
            Securely upload, preview, and manage your previous clinical reports, lab work, and medical documents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(126,34,206,0.5)] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>+ UPLOAD PREVIOUS REPORT</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-950/70 border border-red-500 text-red-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => {
              setErrorMessage(null);
              fileInputRef.current?.click();
            }}
            className="px-2.5 py-1 bg-red-900 border border-red-400 text-white text-[11px] font-bold uppercase rounded hover:bg-red-800 transition-all cursor-pointer"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed p-8 text-center cursor-pointer transition-all bg-[#0d0617] border-[#7E22CE]/60 hover:border-[#7E22CE] hover:bg-black/60 rounded-lg"
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-[#7E22CE] flex items-center justify-center text-[#A855F7]">
            {isUploading ? (
              <span className="w-6 h-6 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Drag & Drop your medical records here'}
          </h3>
          <p className="text-xs text-gray-400">
            or <span className="text-[#C084FC] underline font-bold">Choose Files</span> (PDF, JPG, PNG, DOC/DOCX up to 50MB)
          </p>
        </div>
      </div>

      {/* Uploaded Documents Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <h3 className="text-xs font-mono font-bold uppercase text-[#A855F7] tracking-wider">
            {documents.length > 0 ? 'UPLOADED PREVIOUS REPORTS & MEDICAL RECORDS' : 'FILE ATTACHMENTS'}
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">
            {documents.length} document{documents.length === 1 ? '' : 's'} stored securely
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="bg-[#0d0617] border border-[#7E22CE]/40 p-8 text-center space-y-3 rounded-lg">
            <FileSearch className="w-10 h-10 text-purple-500 mx-auto" />
            <p className="text-sm font-bold text-white uppercase">No previous reports uploaded yet</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Click <strong className="text-[#C084FC]">+ UPLOAD PREVIOUS REPORT</strong> above or drag and drop files to attach medical records to your dossier.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const ext = doc.originalFilename.split('.').pop()?.toUpperCase() || 'FILE';
              const isPdf = ext === 'PDF';
              const isImg = ['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext);
              const isSheet = ['CSV', 'XLS', 'XLSX'].includes(ext);

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDoc(doc);
                    setPreviewDoc(doc);
                  }}
                  className={`bg-[#0d0617] border p-4 rounded-xl space-y-3 transition-all cursor-pointer shadow-md ${
                    activeDoc?.id === doc.id
                      ? 'border-[#7E22CE] shadow-[0_0_15px_rgba(126,34,206,0.3)] bg-purple-950/20'
                      : 'border-purple-900/40 hover:border-[#7E22CE]/80'
                  }`}
                >
                  {/* Card Header: FILE ICON, File Name, File Type, File Size, Upload Date */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-700/60 shrink-0">
                      {isPdf ? (
                        <FileText className="w-5 h-5 text-rose-400" />
                      ) : isImg ? (
                        <Layers className="w-5 h-5 text-indigo-400" />
                      ) : isSheet ? (
                        <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-[#C084FC]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-black text-white truncate" title={doc.originalFilename}>
                        {doc.originalFilename}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-purple-900/60 text-purple-200 border border-purple-700/50">
                          {doc.detectedType || `${ext} Document`}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {doc.sizeFormatted}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          • {doc.uploadDateFormatted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Visual Thumbnail / Document Preview Box */}
                  <div className="relative rounded-lg overflow-hidden border border-purple-900/80 bg-black/80 p-2 group/preview">
                    {isImg ? (
                      <div className="relative">
                        <img
                          src={`/api/documents/${doc.id}/preview`}
                          alt={doc.originalFilename}
                          className="w-full h-40 object-cover rounded-lg border border-purple-800/60 transition-transform group-hover/preview:scale-[1.01]"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1 bg-[#7E22CE] text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                            Click to View Full Image
                          </span>
                        </div>
                      </div>
                    ) : isPdf ? (
                      <div className="relative w-full h-48 bg-black rounded-lg border border-purple-800/60 overflow-hidden flex flex-col">
                        <object
                          data={`/api/documents/${doc.id}/preview`}
                          type="application/pdf"
                          className="w-full h-full pointer-events-none"
                        >
                          <div className="w-full h-full bg-gradient-to-br from-purple-950/40 via-black to-purple-900/20 flex flex-col items-center justify-center p-3 text-center space-y-2">
                            <FileText className="w-8 h-8 text-rose-400 animate-pulse" />
                            <div>
                              <p className="text-[11px] font-bold text-white uppercase truncate max-w-[260px]">{doc.originalFilename}</p>
                              <p className="text-[9px] text-purple-300 font-mono uppercase tracking-widest mt-0.5">PDF Document • Click VIEW to Inspect</p>
                            </div>
                          </div>
                        </object>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="px-3 py-1 bg-[#7E22CE] text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                            Click to Open Full Viewer
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-28 bg-black/60 rounded-lg border border-purple-800/40 flex flex-col items-center justify-center p-3 text-center space-y-1">
                        <FileText className="w-6 h-6 text-[#C084FC]" />
                        <p className="text-[11px] font-bold text-white uppercase truncate max-w-[260px]">{doc.originalFilename}</p>
                        <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">{ext} File • Ready for Inspection</p>
                      </div>
                    )}
                  </div>

                  {/* Buttons: VIEW, DOWNLOAD, DELETE */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewDoc(doc);
                      }}
                      className="px-3 py-1.5 bg-[#7E22CE] text-white text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-[#9333EA] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="View original document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(doc);
                      }}
                      className="px-3 py-1.5 bg-black/60 border border-[#7E22CE] text-purple-300 hover:text-white hover:bg-[#7E22CE] text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Download original document"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {documents.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-black border-2 border-dashed border-[#7E22CE] text-[#C084FC] text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#7E22CE]/10 hover:border-[#A855F7] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>+ UPLOAD ANOTHER REPORT</span>
            </button>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {previewDoc && (
        <DocumentViewerModal
          document={{
            id: previewDoc.id,
            name: previewDoc.originalFilename,
            date: previewDoc.uploadDateFormatted || new Date().toISOString().split('T')[0],
            type: previewDoc.detectedType || 'Lab Report',
            fileSize: previewDoc.sizeFormatted || '2.5 MB',
            fileUrl: `/api/documents/${previewDoc.id}/preview`,
            downloadUrl: `/api/documents/${previewDoc.id}/download`,
            mimetype: previewDoc.mimetype,
            rawFile: previewDoc.rawFile
          }}
          onClose={() => setPreviewDoc(null)}
          onDelete={async (id) => {
            setDocuments((prev) => prev.filter(d => d.id !== id));
            // Mark as deleted in local storage persistent list
            try {
              const deletedIds = JSON.parse(localStorage.getItem('ZIATHLON_DELETED_DOC_IDS') || '[]');
              if (!deletedIds.includes(id)) {
                deletedIds.push(id);
                localStorage.setItem('ZIATHLON_DELETED_DOC_IDS', JSON.stringify(deletedIds));
              }
            } catch (e) {}

            try {
              await fetch(`/api/documents/${id}`, { method: 'DELETE' });
              await fetch(`/api/medical-records/${id}`, { method: 'DELETE' });
            } catch (e) {}
            
            window.dispatchEvent(new CustomEvent('medical-documents-changed'));
          }}
        />
      )}
    </div>
  );
};
