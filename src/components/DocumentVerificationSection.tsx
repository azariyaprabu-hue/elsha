import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCheck,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  FileSearch,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock,
  HardDrive
} from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

interface UploadedDoc {
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
  status: string; // 'Verified' | 'Needs Review' | 'Invalid'
  verificationMessage: string;
  isCorrect: boolean;
  extractedSnippet: string;
}

export function DocumentVerificationSection() {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [activeDoc, setActiveDoc] = useState<UploadedDoc | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewPage, setPreviewPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Fetch existing documents on mount
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

    // Validation - Support PDF, DOC, DOCX, TXT, CSV, JPG, JPEG, PNG, WEBP
    const allowedExtensions = /\.(pdf|doc|docx|txt|csv|jpg|jpeg|png|webp)$/i;
    if (!allowedExtensions.test(fileToUpload.name)) {
      setErrorMessage('⚠️ Unsupported file type. Please upload PDF, DOC, DOCX, TXT, CSV, JPG, JPEG, PNG, or WEBP.');
      return;
    }

    if (fileToUpload.size > 50 * 1024 * 1024) {
      setErrorMessage('⚠️ File is too large. Maximum allowed size is 50MB.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploading(true);
    setUploadProgress(15);

    const formData = new FormData();
    formData.append('document', fileToUpload);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 200);

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
          setDocuments((prev) => [data.document, ...prev.filter(d => d.id !== data.document.id)]);
          setActiveDoc(data.document);
          setSuccessMessage(`✓ Upload successful for "${data.document.originalFilename}"`);
          setTimeout(() => setSuccessMessage(null), 4000);
        } else {
          setErrorMessage(data.error || 'Upload failed. Please try again.');
        }
      } else {
        let errText = 'Upload failed. Please try again.';
        try {
          if (contentType && contentType.includes('application/json')) {
            const errJson = await res.json();
            errText = errJson.error || errText;
          } else {
            const text = await res.text();
            if (text && !text.includes('<!doctype')) {
              errText = text.substring(0, 120);
            }
          }
        } catch (e) {}
        setErrorMessage(errText);
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setErrorMessage('⚠️ Upload network error. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleVerifyAgain = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.document) {
        setDocuments((prev) => prev.map((d) => (d.id === docId ? data.document : d)));
        if (activeDoc?.id === docId) {
          setActiveDoc(data.document);
        }
        setSuccessMessage('✓ Document re-verified successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      setErrorMessage('Verification failed.');
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (activeDoc?.id === docId) {
        const remaining = documents.filter((d) => d.id !== docId);
        setActiveDoc(remaining.length > 0 ? remaining[0] : null);
      }
      setSuccessMessage('Document permanently removed.');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
    } catch (e) {
      setErrorMessage('Failed to delete document.');
    }
  };

  const handleDownload = (docId: string, filename: string) => {
    const a = document.createElement('a');
    a.href = `/api/documents/${docId}/download`;
    a.download = filename || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusBadge = (status: string, isCorrect: boolean) => {
    if (status === 'Verified' && isCorrect) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified & Correct
        </span>
      );
    } else if (status === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Verified Report
        </span>
      );
    } else if (status === 'Invalid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Wrong / Invalid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Needs Review
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Document Upload & Verification</h1>
              <p className="text-sm text-gray-600">Securely upload, preview, analyze, and verify clinical and nutrition documents with byte-for-byte integrity.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            Expected: Nutrition Assessment Document
          </span>
        </div>
      </div>

      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900 font-bold text-xs uppercase tracking-wider">Dismiss</button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold text-xs uppercase tracking-wider">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Uploader & Active Document Analysis */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white ${
              isDragging ? 'border-purple-500 bg-purple-50/50 scale-[1.01]' : 'border-purple-200 hover:border-purple-400'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload Clinical or Nutrition Document</h3>
                <p className="text-xs text-gray-500 mt-1">Drag and drop your files here, or click to browse</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-gray-400">
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">PDF</span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">DOC</span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">DOCX</span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">JPG</span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">PNG</span>
                <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">Max 50MB</span>
              </div>

              <div>
                <label className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm shadow-sm cursor-pointer transition-colors">
                  <span>Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium text-gray-600">
                    <span>Uploading document...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Document Analysis & Verification Card */}
          {activeDoc ? (
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Active Document Inspection</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-0.5 break-all flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                    {activeDoc.originalFilename}
                  </h2>
                </div>
                <div>{getStatusBadge(activeDoc.status, activeDoc.isCorrect)}</div>
              </div>

              {/* Document Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/75 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Document Type</span>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{activeDoc.mimetype.split('/')[1]?.toUpperCase() || 'FILE'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">File Size</span>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{activeDoc.sizeFormatted}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Pages</span>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{activeDoc.pageCount} Page{activeDoc.pageCount > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Document ID</span>
                  <p className="text-xs font-mono font-bold text-purple-700 mt-0.5 truncate">{activeDoc.id}</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Uploaded on {activeDoc.uploadDateFormatted}</span>
              </div>

              {/* Automatic Content Verification Section */}
              <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100 space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <FileSearch className="w-4 h-4 text-purple-600" />
                  <span>Automatic Document Verification System</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <span className="text-xs text-gray-500 font-medium block">Detected Document Type:</span>
                    <strong className="text-gray-900 mt-0.5 block">{activeDoc.detectedType}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <span className="text-xs text-gray-500 font-medium block">Analysis Status:</span>
                    <span className={`inline-block mt-0.5 font-semibold ${activeDoc.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {activeDoc.isCorrect ? '✓ Expected Document Match' : '⚠️ Review Required'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-700 bg-white p-3 rounded-lg border border-purple-100 leading-relaxed">
                  <strong>Verification Report:</strong> {activeDoc.verificationMessage}
                </div>
              </div>

              {/* Correct / Wrong Document Check Banner */}
              <div className={`p-4 rounded-xl border ${
                activeDoc.isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-start gap-3">
                  {activeDoc.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">
                      {activeDoc.isCorrect ? 'Is this the correct document? Yes, verified.' : '⚠️ Document may be incorrect'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {activeDoc.isCorrect
                        ? 'The uploaded file matches the expected Nutrition Assessment Document criteria.'
                        : 'Expected: Nutrition Assessment Document. Uploaded file does not appear to match the required clinical nutrition questionnaire structure.'}
                    </p>
                    {!activeDoc.isCorrect && (
                      <div className="flex items-center gap-3 pt-2">
                        <label className="text-xs font-semibold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer transition-colors shadow-xs">
                          Upload Correct Document
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp" onChange={handleFileSelect} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setPreviewOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-sm font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Eye className="w-4 h-4" /> VIEW
                </button>
                <button
                  onClick={() => handleDownload(activeDoc.id, activeDoc.originalFilename)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD
                </button>
                <button
                  onClick={() => handleVerifyAgain(activeDoc.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" /> Verify Again
                </button>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium shadow-xs cursor-pointer transition-colors">
                  <Plus className="w-4 h-4 text-gray-500" /> Replace
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp" onChange={handleFileSelect} />
                </label>
                <button
                  onClick={() => handleDelete(activeDoc.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-black uppercase tracking-wider transition-colors ml-auto cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> DELETE
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-medium text-gray-700">No document uploaded yet</p>
              <p className="text-xs text-gray-400 mt-1">Upload a PDF, Word, or Image document above to begin verification.</p>
            </div>
          )}
        </div>

        {/* Right Column: Upload History & Storage Overview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Upload History
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                {documents.length} Saved
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Previously uploaded documents remain persistently available for inspection, preview, and download.
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  History is empty. Uploaded documents will appear here.
                </div>
              ) : (
                documents.map((doc) => {
                  const isActive = activeDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setActiveDoc(doc)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-50/80 border-purple-300 shadow-xs'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{doc.originalFilename}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span>{doc.sizeFormatted}</span>
                              <span>•</span>
                              <span>{doc.pageCount}p</span>
                              <span>•</span>
                              <span>{doc.uploadDateFormatted}</span>
                            </div>
                          </div>
                        </div>
                        <div>{getStatusBadge(doc.status, doc.isCorrect)}</div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs">
                        <span className="font-mono text-gray-400">{doc.id}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDoc(doc);
                              setPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-purple-100 text-purple-700 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(doc.id, doc.originalFilename);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Download Original"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Secure Storage Badge */}
          <div className="bg-purple-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-5 h-5 text-purple-300" />
              <h4 className="font-bold text-sm tracking-tight">Persistent Cloud & Disk Storage</h4>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              All documents are stored byte-for-byte on secure server storage with cryptographic hash integrity and automatic MIME validation.
            </p>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {previewOpen && activeDoc && (
        <DocumentViewerModal
          document={{
            id: activeDoc.id,
            name: activeDoc.originalFilename,
            mimetype: activeDoc.mimetype,
            fileSize: activeDoc.sizeFormatted,
            date: activeDoc.uploadDateFormatted,
            fileUrl: `/api/documents/${activeDoc.id}/preview`,
            downloadUrl: `/api/documents/${activeDoc.id}/download`,
            textUrl: `/api/documents/${activeDoc.id}/text`,
            pageCount: activeDoc.pageCount,
            extractedSnippet: activeDoc.extractedSnippet,
          }}
          onClose={() => setPreviewOpen(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </div>
  );
}
