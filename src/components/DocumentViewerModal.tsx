import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  FileText,
  FileSpreadsheet,
  File,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Search,
  ShieldCheck
} from 'lucide-react';
import { InAppPdfRenderer } from './InAppPdfRenderer';

export interface DocumentViewerItem {
  id: string;
  name: string;
  type?: string;
  mimetype?: string;
  fileSize?: string;
  date?: string;
  fileUrl?: string;
  downloadUrl?: string;
  textUrl?: string;
  pageCount?: number;
  extractedSnippet?: string;
  rawFile?: File;
}

interface DocumentViewerModalProps {
  document: DocumentViewerItem;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  onDelete,
}) => {
  // Navigation & Zoom State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(doc.pageCount && doc.pageCount > 0 ? doc.pageCount : 1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [imageRotation, setImageRotation] = useState<number>(0);

  // Status & Error State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Text, CSV, & DOCX Data State
  const [textContent, setTextContent] = useState<string>('');
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvSearch, setCsvSearch] = useState<string>('');
  const [viewCsvAsTable, setViewCsvAsTable] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Resolved URLs
  const [resolvedPreviewUrl, setResolvedPreviewUrl] = useState<string>('');
  const [resolvedDownloadUrl, setResolvedDownloadUrl] = useState<string>('');

  const modalContainerRef = useRef<HTMLDivElement>(null);

  const fileName = doc.name || 'document';
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

  const isPdf = fileExt === 'pdf' || (doc.mimetype && doc.mimetype.includes('pdf'));
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(fileExt) || (doc.mimetype && doc.mimetype.startsWith('image/'));
  const isDocx = ['docx'].includes(fileExt);
  const isDoc = ['doc'].includes(fileExt) || (doc.mimetype && (doc.mimetype.includes('word') || doc.mimetype.includes('officedocument')));
  const isTxt = fileExt === 'txt' || (doc.mimetype && doc.mimetype.includes('text/plain'));
  const isCsv = fileExt === 'csv' || (doc.mimetype && doc.mimetype.includes('csv'));

  // Escape key handler to exit document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Initialize and resolve URLs
  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    setDocxHtml(null);

    let previewUrl = doc.fileUrl || '';
    let downloadUrl = doc.downloadUrl || '';

    // Resolve canonical persistent server endpoints
    if (!previewUrl || previewUrl.startsWith('blob:')) {
      if (doc.id?.startsWith('document_') || doc.id?.startsWith('doc_') || (doc.fileUrl && doc.fileUrl.includes('medical-records'))) {
        previewUrl = `/api/medical-records/${doc.id}/view`;
        downloadUrl = `/api/medical-records/${doc.id}/download`;
      } else if (doc.id) {
        previewUrl = `/api/documents/${doc.id}/preview`;
        downloadUrl = `/api/documents/${doc.id}/download`;
      }
    }

    if (!downloadUrl || downloadUrl.startsWith('blob:')) {
      if (doc.id?.startsWith('document_') || doc.id?.startsWith('doc_') || (doc.downloadUrl && doc.downloadUrl.includes('medical-records'))) {
        downloadUrl = `/api/medical-records/${doc.id}/download`;
      } else if (doc.id) {
        downloadUrl = `/api/documents/${doc.id}/download`;
      }
    }

    setResolvedPreviewUrl(previewUrl);
    setResolvedDownloadUrl(downloadUrl);

    // Load content based on document type
    const loadContent = async () => {
      try {
        // 1. DOCX: Fetch converted HTML
        if (isDocx || isDoc) {
          try {
            const docxEndpoint = doc.id?.startsWith('doc_')
              ? `/api/medical-records/${doc.id}/docx-html`
              : `/api/documents/${doc.id}/docx-html`;
            const docxRes = await fetch(docxEndpoint);
            if (docxRes.ok) {
              const docxData = await docxRes.json();
              if (docxData.success && docxData.html) {
                setDocxHtml(docxData.html);
                setIsLoading(false);
                return;
              }
            }
          } catch (e) {
            console.warn('DOCX conversion endpoint not reachable, falling back to text:', e);
          }
        }

        // 2. TXT / CSV: Read text
        if (isTxt || isCsv || isDocx || isDoc) {
          if (doc.rawFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = (e.target?.result as string) || '';
              handleTextLoaded(text);
              setIsLoading(false);
            };
            reader.onerror = () => {
              throw new Error('Failed to read file content.');
            };
            reader.readAsText(doc.rawFile);
          } else {
            const textEndpoint = doc.textUrl || `/api/documents/${doc.id}/text`;
            try {
              const textRes = await fetch(textEndpoint);
              if (textRes.ok) {
                const textData = await textRes.json();
                if (textData.text) {
                  handleTextLoaded(textData.text);
                } else if (doc.extractedSnippet) {
                  handleTextLoaded(doc.extractedSnippet);
                }
              } else if (doc.extractedSnippet) {
                handleTextLoaded(doc.extractedSnippet);
              }
            } catch (te) {
              if (doc.extractedSnippet) {
                handleTextLoaded(doc.extractedSnippet);
              }
            }
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Document Viewer Error:', err);
        setLoadError(err.message || 'Unable to open this document.');
        setIsLoading(false);
      }
    };

    loadContent();
  }, [doc, isPdf, isImage, isDocx, isDoc, isTxt, isCsv]);

  const handleTextLoaded = (text: string) => {
    setTextContent(text);
    if (isCsv) {
      const rows = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          const cells: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cells.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          cells.push(current.trim());
          return cells;
        });
      setCsvRows(rows);
    }
  };

  // Programmatic direct file download (NO new tab, NO window.open, NO redirect)
  const handleProgrammaticDownload = () => {
    const targetUrl = resolvedDownloadUrl || resolvedPreviewUrl;
    if (!targetUrl) return;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(textContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Filtered CSV Rows for Search
  const filteredCsvRows = csvRows.filter((row, idx) => {
    if (idx === 0) return true;
    if (!csvSearch) return true;
    return row.some((cell) => cell.toLowerCase().includes(csvSearch.toLowerCase()));
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="In-App Medical Document Viewer"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-3 animate-in fade-in duration-200"
    >
      <div
        ref={modalContainerRef}
        className={`bg-gray-950 flex flex-col overflow-hidden shadow-2xl transition-all duration-200 border border-purple-900/60 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-full sm:h-[92vh] sm:rounded-2xl'
        }`}
      >
        {/* ========================================================================= */}
        {/* 1. TOP HEADER: Back Button, Document Title, Metadata & Actions            */}
        {/* ========================================================================= */}
        <div className="bg-gray-900 border-b border-purple-900/40 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Prominent Back Button (Always visible on mobile & desktop) */}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6b1dae] hover:to-[#7E22CE] text-white flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 shrink-0 border border-purple-400 ring-2 ring-purple-500/30"
              title="Back (Exit Document)"
            >
              <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
              <span className="font-black">Back</span>
            </button>

            {/* Document Icon & Title */}
            <div className="p-2 rounded-lg bg-purple-950/80 border border-[#7E22CE]/60 shrink-0">
              {isPdf ? (
                <FileText className="w-5 h-5 text-red-400" />
              ) : isImage ? (
                <ImageIcon className="w-5 h-5 text-indigo-400" />
              ) : isCsv ? (
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              ) : (
                <File className="w-5 h-5 text-[#C084FC]" />
              )}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A855F7] bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {doc.type || (isPdf ? 'PDF Record' : isImage ? 'Medical Image' : isDocx ? 'Word Document' : 'Document')}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 hidden sm:inline-flex">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  In-App Viewer
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-black text-white truncate max-w-[280px] sm:max-w-md" title={fileName}>
                {fileName}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Download Button (Programmatic, NO new tab) */}
            <button
              type="button"
              onClick={handleProgrammaticDownload}
              className="px-3.5 py-1.5 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close / Exit Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-red-950/90 hover:bg-red-900 border border-red-800 text-red-200 hover:text-white flex items-center gap-1 text-xs font-bold uppercase transition-colors cursor-pointer ml-1 active:scale-95"
              title="Exit Document"
            >
              <X className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. VIEWER CANVAS / CONTENT BODY                                           */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-gray-950 overflow-hidden relative flex flex-col">
          {loadError ? (
            /* Error Display */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 my-auto">
              <div className="p-4 rounded-full bg-red-950/80 border border-red-500 text-red-400">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Unable to open this document</h3>
              <p className="text-xs text-gray-400 max-w-md">
                {loadError}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoadError(null);
                    setIsLoading(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Retry
                </button>
                <button
                  type="button"
                  onClick={handleProgrammaticDownload}
                  className="px-4 py-2 rounded-xl bg-[#7E22CE] hover:bg-[#6b1dae] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 inline mr-1" /> Download Document
                </button>
              </div>
            </div>
          ) : isPdf ? (
            /* ============================================================= */
            /* 2A. IN-APP PDF VIEWER (HTML5 CANVAS, NO IFRAME, NO CHROME BLOCK) */
            /* ============================================================= */
            <InAppPdfRenderer
              fileUrl={resolvedPreviewUrl}
              fileName={fileName}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              downloadUrl={resolvedDownloadUrl}
              rawFile={doc.rawFile}
            />
          ) : isImage ? (
            /* ============================================================= */
            /* 2B. IN-APP IMAGE VIEWER (JPG, JPEG, PNG, WEBP)                */
            /* ============================================================= */
            <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
              {/* Image Controls Toolbar */}
              <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between gap-3 text-xs text-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(30, z - 20))}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-gray-300 font-bold min-w-[45px] text-center">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(300, z + 20))}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-gray-300 cursor-pointer"
                  >
                    Fit Screen
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center gap-1 cursor-pointer"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Rotate</span>
                  </button>
                </div>
              </div>

              {/* Image Canvas */}
              <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center bg-gray-950">
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${imageRotation}deg)`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="flex flex-col items-center max-w-full"
                >
                  <img
                    src={resolvedPreviewUrl}
                    alt={fileName}
                    className="max-w-full h-auto object-contain rounded-xl shadow-2xl border border-gray-800 bg-white/5"
                    onError={() => {
                      setLoadError('Unable to load image file.');
                    }}
                  />
                </div>
              </div>
            </div>
          ) : docxHtml ? (
            /* ============================================================= */
            /* 2C. CONVERTED DOCX IN-APP VIEWER                              */
            /* ============================================================= */
            <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="font-bold">Word Document Converted for In-App Reading</span>
                </div>
                <button
                  type="button"
                  onClick={handleProgrammaticDownload}
                  className="text-purple-300 hover:text-white font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download Original (.docx)
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-gray-950">
                <div className="max-w-3xl w-full bg-white text-gray-900 p-8 sm:p-12 rounded-xl shadow-2xl space-y-4 prose prose-purple max-h-full overflow-y-auto">
                  <div
                    dangerouslySetInnerHTML={{ __html: docxHtml }}
                    className="docx-rendered-content text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>
          ) : isCsv ? (
            /* ============================================================= */
            /* 2D. CSV SPREADSHEET VIEWER                                    */
            /* ============================================================= */
            <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={csvSearch}
                    onChange={(e) => setCsvSearch(e.target.value)}
                    placeholder="Search table rows..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7E22CE]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewCsvAsTable(!viewCsvAsTable)}
                    className="px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-[11px] font-bold"
                  >
                    {viewCsvAsTable ? 'Raw CSV' : 'Table View'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 bg-gray-950">
                {viewCsvAsTable && csvRows.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-md">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-purple-950/80 text-purple-200 border-b border-purple-800">
                          {csvRows[0].map((header, idx) => (
                            <th key={idx} className="p-3 font-black uppercase tracking-wider font-mono">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 text-gray-300 font-mono">
                        {filteredCsvRows.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-purple-950/30 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 whitespace-nowrap">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <pre className="p-4 bg-gray-900 text-purple-200 font-mono text-xs rounded-xl border border-gray-800 whitespace-pre-wrap">
                    {textContent || 'No text content available.'}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            /* ============================================================= */
            /* 2E. TEXT & GENERIC DOCUMENT VIEWER                            */
            /* ============================================================= */
            <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="font-bold">Text Document Content</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-[11px] font-bold flex items-center gap-1"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-950">
                <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl space-y-4">
                  <pre className="text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {textContent || doc.extractedSnippet || 'Binary medical record stored securely. Click Download to retrieve original file.'}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM FOOTER BAR                                                      */}
        {/* ========================================================================= */}
        <div className="bg-gray-900 border-t border-purple-900/40 px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] text-gray-400 font-mono shrink-0">
          <div className="flex items-center gap-3">
            <span>Size: {doc.fileSize || 'Standard'}</span>
            <span>•</span>
            <span>Date: {doc.date || 'Archived'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleProgrammaticDownload}
              className="text-[#C084FC] hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
