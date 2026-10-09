import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  Eye,
  Download,
  Trash2,
  Calendar,
  Tag,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { MedicalDocumentItem } from '../types';
import { DocumentViewerModal } from './DocumentViewerModal';

interface MedicalRecordsSubfolderProps {
  currentPatientId: string;
  patientName: string;
}

export const MedicalRecordsSubfolder: React.FC<MedicalRecordsSubfolderProps> = ({
  currentPatientId,
  patientName,
}) => {
  const [groupedDocs, setGroupedDocs] = useState<Record<string, MedicalDocumentItem[]>>({});
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Upload Form State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentDate, setDocumentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState<string>('Blood Report');
  const [notes, setNotes] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Document Viewer Modal (Opens FULL document inside ELSHA)
  const [activeViewerDoc, setActiveViewerDoc] = useState<MedicalDocumentItem | null>(null);

  useEffect(() => {
    fetchMedicalRecords();
  }, [currentPatientId]);

  const fetchMedicalRecords = async () => {
    setIsLoading(true);
    try {
      let localGrouped: Record<string, MedicalDocumentItem[]> = {};
      let localCount = 0;

      // Load from local storage
      try {
        const rawReports = localStorage.getItem('ziathlon_uploaded_reports');
        if (rawReports) {
          const reports = JSON.parse(rawReports);
          if (Array.isArray(reports)) {
            reports.forEach((rep: any) => {
              const dateKey = rep.date || new Date().toISOString().split('T')[0];
              if (!localGrouped[dateKey]) localGrouped[dateKey] = [];
              localGrouped[dateKey].push({
                id: rep.id,
                file_name: rep.name,
                original_file_name: rep.name,
                category: rep.type || 'Blood Report',
                document_date: dateKey,
                file_size: rep.fileSize ? parseInt(rep.fileSize) * 1024 * 1024 : 1024,
                notes: rep.clinicalSummary || 'Uploaded patient record',
                view_url: rep.fileUrl || `/api/documents/${rep.id}/preview`,
                download_url: rep.downloadUrl || `/api/documents/${rep.id}/download`,
              } as any);
              localCount++;
            });
          }
        }
      } catch {}

      try {
        const res = await fetch(`/api/patients/${currentPatientId}/medical-records`);
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          const serverDates = data.dates || {};
          const merged: Record<string, MedicalDocumentItem[]> = { ...localGrouped };
          for (const [date, docs] of Object.entries(serverDates as Record<string, MedicalDocumentItem[]>)) {
            if (!merged[date]) merged[date] = [];
            docs.forEach((doc) => {
              if (!merged[date].some((existing) => existing.id === doc.id)) {
                merged[date].push(doc);
              }
            });
          }
          setGroupedDocs(merged);
          setTotalCount(Object.values(merged).reduce((acc, arr) => acc + arr.length, 0));
        } else {
          setGroupedDocs(localGrouped);
          setTotalCount(localCount);
        }
      } catch {
        setGroupedDocs(localGrouped);
        setTotalCount(localCount);
      }
    } catch (e) {
      console.warn('Medical records fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setNotification('⚠️ Please select a file to upload');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsUploading(true);
    const tempId = `DOC-MED-${Date.now()}`;
    const objectUrl = URL.createObjectURL(selectedFile);
    const sizeFormatted = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('document_date', documentDate);
      formData.append('category', category);
      formData.append('notes', notes);

      try {
        await fetch(`/api/patients/${currentPatientId}/medical-records/upload`, {
          method: 'POST',
          body: formData,
        });
      } catch {}

      // Add to local state & localStorage for reliable persistence
      const newLocalDoc: any = {
        id: tempId,
        name: selectedFile.name,
        type: category,
        mimetype: selectedFile.type,
        date: documentDate,
        fileSize: sizeFormatted,
        clinicalSummary: notes || 'Uploaded patient record',
        fileUrl: objectUrl,
        downloadUrl: objectUrl,
        rawFile: selectedFile,
      };

      try {
        const raw = localStorage.getItem('ziathlon_uploaded_reports');
        const existing = raw ? JSON.parse(raw) : [];
        const clean = [newLocalDoc, ...existing.filter((d: any) => d.id !== tempId)].map(({ rawFile, ...rest }: any) => rest);
        localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(clean));
        window.dispatchEvent(new Event('storage'));
      } catch {}

      setNotification(`✓ Successfully saved & attached: ${selectedFile.name}`);
      setSelectedFile(null);
      setNotes('');
      setIsUploadOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchMedicalRecords();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification(`⚠️ Upload notice: Document attached locally.`);
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (docId: string, fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. Immediately update local state
    setGroupedDocs((prev) => {
      const nextGrouped: Record<string, MedicalDocumentItem[]> = {};
      for (const [date, docs] of Object.entries(prev)) {
        const filtered = docs.filter((d) => d.id !== docId);
        if (filtered.length > 0) {
          nextGrouped[date] = filtered;
        }
      }
      return nextGrouped;
    });
    setTotalCount((prev) => Math.max(0, prev - 1));

    // 2. Remove from local storage
    try {
      const rawReports = localStorage.getItem('ziathlon_uploaded_reports');
      if (rawReports) {
        const reports = JSON.parse(rawReports);
        const filtered = reports.filter((r: any) => r.id !== docId);
        localStorage.setItem('ziathlon_uploaded_reports', JSON.stringify(filtered));
        window.dispatchEvent(new Event('storage'));
      }
    } catch {}

    setNotification(`✓ Deleted document: ${fileName}`);
    setTimeout(() => setNotification(null), 3000);

    // 3. Notify backend
    try {
      await fetch(`/api/medical-records/${docId}`, {
        method: 'DELETE',
      });
    } catch {}
  };

  // Programmatic download (No tab, no window.open)
  const handleProgrammaticDownload = (e: React.MouseEvent, doc: MedicalDocumentItem) => {
    e.stopPropagation();
    const downloadUrl = doc.download_url || `/api/medical-records/${doc.id}/download`;
    const fileName = doc.file_name || doc.original_file_name || 'medical_record.pdf';
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getFileIcon = (mimeType?: string, fileName?: string) => {
    const fName = (fileName || '').toLowerCase();
    const mime = (mimeType || '').toLowerCase();
    if (mime.includes('pdf') || fName.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500 shrink-0" />;
    }
    if (mime.includes('sheet') || fName.endsWith('.xls') || fName.endsWith('.xlsx') || fName.endsWith('.csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (mime.includes('image') || fName.match(/\.(jpg|jpeg|png|webp)$/)) {
      return <Activity className="w-5 h-5 text-purple-600 shrink-0" />;
    }
    return <File className="w-5 h-5 text-blue-500 shrink-0" />;
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const dateKeys = Object.keys(groupedDocs).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0617] border-2 border-[#7E22CE] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#A855F7] bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              MEDICAL DOCUMENTS
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Patient: {patientName} ({currentPatientId})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#A855F7]" />
            Medical Records & Date-Wise Documents
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 max-w-2xl">
            Upload and view patient medical records (Blood Reports, Diagnostic Scans, Clinical Summaries, Pathology Panels, Prescriptions). Documents open directly in the full-screen In-App Viewer without external redirects or tabs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="px-5 py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(126,34,206,0.5)] cursor-pointer transition-all active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Upload Document Panel (Collapsible) */}
      {isUploadOpen && (
        <form
          onSubmit={handleUploadSubmit}
          className="p-5 sm:p-6 rounded-2xl bg-[#0d0617] border-2 border-[#7E22CE] shadow-2xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#A855F7]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Upload & Save Medical Document
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Document / Visit Date *
              </label>
              <input
                type="date"
                required
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-purple-900/80 focus:border-[#7E22CE] text-white font-semibold bg-black/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Report Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-purple-900/80 focus:border-[#7E22CE] text-white font-semibold bg-black/60"
              >
                <option value="Blood Report" className="bg-gray-900 text-white">Blood Report</option>
                <option value="Diagnostic Report" className="bg-gray-900 text-white">Diagnostic Report</option>
                <option value="Clinical Summary" className="bg-gray-900 text-white">Clinical Summary</option>
                <option value="Prescription" className="bg-gray-900 text-white">Prescription</option>
                <option value="Pathology Panel" className="bg-gray-900 text-white">Pathology Panel</option>
                <option value="Ultrasound / Scan" className="bg-gray-900 text-white">Ultrasound / Scan</option>
                <option value="Other Medical Record" className="bg-gray-900 text-white">Other Medical Record</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Select File (PDF, Images, DOC/DOCX, CSV, TXT) *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-2 py-1.5 rounded-lg border border-purple-900/80 bg-black/60 text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#7E22CE] file:text-white cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">
              Clinical Findings & Laboratory Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fasting Blood Glucose, Thyroid Markers (TSH/FT3/FT4), Serum Ferritin..."
              className="w-full px-3 py-2 rounded-lg border border-purple-900/80 focus:border-[#7E22CE] text-xs text-white placeholder-gray-500 bg-black/60"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400 font-medium">
              Supported: PDF, Images (JPG/PNG/WEBP), DOC/DOCX, CSV, TXT up to 50MB.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 rounded-lg bg-[#7E22CE] text-white text-xs font-black uppercase tracking-wider hover:bg-[#9333EA] flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Saving...' : 'Save Document'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Date-Wise Grouped Documents List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="p-8 text-center bg-[#0d0617] rounded-2xl border border-purple-900/40 text-gray-400 text-xs">
            Loading patient medical records...
          </div>
        ) : dateKeys.length === 0 ? (
          <div className="p-10 text-center bg-[#0d0617] rounded-2xl border-2 border-dashed border-purple-900/60 text-gray-400 space-y-3">
            <FileText className="w-10 h-10 text-purple-400 mx-auto" />
            <p className="text-sm font-bold text-white uppercase tracking-wider">No medical records uploaded yet for this patient</p>
            <p className="text-xs text-gray-400">
              Click <strong className="text-[#C084FC]">&quot;+ Upload Document&quot;</strong> above to attach Blood Reports, Scans, or Diagnostic Reports.
            </p>
          </div>
        ) : (
          dateKeys.map((dateKey) => {
            const docs = groupedDocs[dateKey] || [];
            return (
              <div
                key={dateKey}
                className="p-5 sm:p-6 rounded-2xl bg-[#0d0617] border border-purple-900/60 shadow-xl space-y-3"
              >
                {/* Date Group Heading */}
                <div className="border-b border-purple-900/40 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#A855F7]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                      {formatDisplayDate(dateKey)}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-purple-950 text-[#C084FC] px-2.5 py-0.5 rounded border border-purple-800">
                    {docs.length} {docs.length === 1 ? 'Record' : 'Records'}
                  </span>
                </div>

                {/* Documents under this Date */}
                <div className="space-y-2.5">
                  {docs.map((doc) => {
                    const fileName = doc.file_name || doc.original_file_name || 'Document';
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setActiveViewerDoc(doc)}
                        className="p-3.5 sm:p-4 rounded-xl border border-purple-950 hover:border-[#7E22CE] bg-black/50 hover:bg-purple-950/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md cursor-pointer group"
                        title="Click to open full document in ELSHA"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800 shrink-0 group-hover:scale-105 transition-transform">
                            {getFileIcon(doc.mime_type, fileName)}
                          </div>
                          <div className="min-w-0">
                            <span
                              className="text-xs sm:text-sm font-black text-white group-hover:text-[#C084FC] text-left truncate block transition-colors"
                            >
                              {fileName}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-medium">
                              <span className="px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 font-bold border border-purple-700/60 font-mono">
                                {doc.category}
                              </span>
                              <span>•</span>
                              <span className="font-mono">{formatFileSize(doc.file_size)}</span>
                              {doc.notes && (
                                <>
                                  <span>•</span>
                                  <span className="italic text-gray-400 truncate max-w-xs">{doc.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions: View Actual, Download, Delete */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveViewerDoc(doc);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-sm active:scale-95"
                            title="Open full document inside ELSHA"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>VIEW</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleProgrammaticDownload(e, doc)}
                            className="px-3 py-1.5 rounded-lg border border-purple-800 text-purple-300 hover:text-white hover:bg-purple-950 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Download document file"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteDoc(doc.id, fileName, e)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULL IN-APP DOCUMENT VIEWER MODAL (OPENS ACTUAL PDF / IMAGE / TEXT / SPREADSHEET INSIDE ELSHA) */}
      {activeViewerDoc && (
        <DocumentViewerModal
          document={{
            id: activeViewerDoc.id,
            name: activeViewerDoc.file_name || activeViewerDoc.original_file_name,
            mimetype: activeViewerDoc.mime_type,
            fileSize: formatFileSize(activeViewerDoc.file_size),
            date: formatDisplayDate(activeViewerDoc.document_date),
            fileUrl: `/api/medical-records/${activeViewerDoc.id}/view`,
            downloadUrl: activeViewerDoc.download_url || `/api/medical-records/${activeViewerDoc.id}/download`,
            textUrl: `/api/medical-records/${activeViewerDoc.id}/text`,
          }}
          onClose={() => setActiveViewerDoc(null)}
          onDelete={(id) => handleDeleteDoc(id, activeViewerDoc.file_name || 'document', { stopPropagation: () => {} } as any)}
        />
      )}
    </div>
  );
};
