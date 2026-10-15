import * as pdfjsLib from 'pdfjs-dist';
import * as pdfWorkerModule from 'pdfjs-dist/build/pdf.worker.mjs';

// Setup PDF.js worker in-memory so network worker fetching is never required
if (typeof window !== 'undefined') {
  try {
    (window as any).pdfjsWorker = pdfWorkerModule;
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).pdfjsWorker = pdfWorkerModule;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  } catch (e) {
    console.warn('PDF.js worker initialization warning:', e);
  }
}

// In-memory cache for generated thumbnails
const thumbnailMemoryCache = new Map<string, string>();

/**
 * Remove thumbnail from memory and localStorage cache
 */
export function purgeThumbnailCache(id: string): void {
  thumbnailMemoryCache.delete(id);
  try {
    localStorage.removeItem(`THUMBNAIL_${id}`);
  } catch {}
}

/**
 * Convert base64 data URI to ArrayBuffer
 */
function dataUriToArrayBuffer(dataUri: string): ArrayBuffer {
  const base64Index = dataUri.indexOf(';base64,');
  if (base64Index !== -1) {
    const base64 = dataUri.substring(base64Index + 8);
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes.buffer;
  }
  const commaIndex = dataUri.indexOf(',');
  const raw = decodeURIComponent(dataUri.substring(commaIndex + 1));
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a high-resolution first page thumbnail data URL from a PDF ArrayBuffer
 */
export async function generatePdfThumbnailFromBuffer(
  buffer: ArrayBuffer,
  targetWidth: number = 420
): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      cMapPacked: true,
    });
    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(1);

    const initialViewport = page.getViewport({ scale: 1.0 });
    const scale = targetWidth / initialViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    // Fill white background for paper simulation
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await (page.render as any)({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.88);
  } catch (err) {
    console.warn('PDF thumbnail generation from buffer failed:', err);
    throw err;
  }
}

/**
 * Generate a thumbnail from a File object (handles both Images and PDFs)
 */
export async function generateThumbnailForFile(file: File): Promise<string> {
  const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

  if (isImage) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  if (isPdf) {
    try {
      const buffer = await file.arrayBuffer();
      return await generatePdfThumbnailFromBuffer(buffer);
    } catch (e) {
      console.warn('Failed to extract PDF first page thumbnail from File:', e);
      return '';
    }
  }

  return '';
}

/**
 * Generate or retrieve cached thumbnail for any fileUrl or docId
 */
export async function getOrGenerateThumbnail(
  id: string,
  fileUrl?: string,
  downloadUrl?: string,
  rawFile?: File
): Promise<string | null> {
  if (thumbnailMemoryCache.has(id)) {
    return thumbnailMemoryCache.get(id)!;
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`THUMBNAIL_${id}`);
    if (cached && cached.startsWith('data:image')) {
      thumbnailMemoryCache.set(id, cached);
      return cached;
    }
  } catch {}

  // 1. If raw File is supplied
  if (rawFile) {
    const thumb = await generateThumbnailForFile(rawFile);
    if (thumb) {
      thumbnailMemoryCache.set(id, thumb);
      try {
        localStorage.setItem(`THUMBNAIL_${id}`, thumb);
      } catch {}
      return thumb;
    }
  }

  // 2. If fileUrl is already an image data URL
  if (fileUrl && fileUrl.startsWith('data:image')) {
    thumbnailMemoryCache.set(id, fileUrl);
    return fileUrl;
  }

  // 3. If fileUrl is PDF base64
  if (fileUrl && fileUrl.startsWith('data:application/pdf')) {
    try {
      const buffer = dataUriToArrayBuffer(fileUrl);
      const thumb = await generatePdfThumbnailFromBuffer(buffer);
      thumbnailMemoryCache.set(id, thumb);
      try {
        localStorage.setItem(`THUMBNAIL_${id}`, thumb);
      } catch {}
      return thumb;
    } catch {}
  }

  // 4. If URL is a network endpoint (fetch ArrayBuffer)
  const targetUrl = fileUrl || downloadUrl;
  if (targetUrl && (targetUrl.startsWith('/') || targetUrl.startsWith('http'))) {
    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const mime = (res.headers.get('content-type') || '').toLowerCase();
        const buf = await res.arrayBuffer();
        const uint8 = new Uint8Array(buf);

        const isPdf =
          (uint8.length >= 4 && uint8[0] === 0x25 && uint8[1] === 0x50 && uint8[2] === 0x44 && uint8[3] === 0x46) ||
          mime.includes('pdf') ||
          targetUrl.toLowerCase().endsWith('.pdf');

        const isImage =
          (uint8.length >= 3 && uint8[0] === 0xff && uint8[1] === 0xd8 && uint8[2] === 0xff) || // JPEG
          (uint8.length >= 4 && uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4e && uint8[3] === 0x47) || // PNG
          (uint8.length >= 4 && uint8[0] === 0x52 && uint8[1] === 0x49 && uint8[2] === 0x46 && uint8[3] === 0x46) || // WEBP
          (uint8.length >= 3 && uint8[0] === 0x47 && uint8[1] === 0x49 && uint8[2] === 0x46) || // GIF
          mime.includes('image');

        if (isPdf) {
          const thumb = await generatePdfThumbnailFromBuffer(buf);
          if (thumb) {
            thumbnailMemoryCache.set(id, thumb);
            try {
              localStorage.setItem(`THUMBNAIL_${id}`, thumb);
            } catch {}
            return thumb;
          }
        } else if (isImage) {
          const blob = new Blob([buf], { type: mime || 'image/jpeg' });
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
          });
          if (dataUrl) {
            thumbnailMemoryCache.set(id, dataUrl);
            try {
              localStorage.setItem(`THUMBNAIL_${id}`, dataUrl);
            } catch {}
            return dataUrl;
          }
        }
      }
    } catch (e) {
      console.warn('Network thumbnail fetch warning:', e);
    }
  }

  return null;
}
