// Persistent Image Storage using IndexedDB (no 5MB localStorage limit)
const DB_NAME = 'ziathlon_assets_db';
const STORE_NAME = 'front_page_images';
const KEY = 'active_front_picture';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveFrontPageImage(dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, KEY);
      req.onsuccess = () => {
        // Also save to localStorage as fallback if small enough
        try {
          if (dataUrl.length < 2000000) {
            localStorage.setItem('ziathlon_front_bg_custom', dataUrl);
          }
        } catch {
          // ignore
        }
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback to localStorage', err);
    try {
      localStorage.setItem('ziathlon_front_bg_custom', dataUrl);
    } catch {
      // ignore
    }
  }
}

export async function getFrontPageImage(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result as string);
        } else {
          // Check localStorage fallback
          resolve(localStorage.getItem('ziathlon_front_bg_custom'));
        }
      };
      req.onerror = () => {
        resolve(localStorage.getItem('ziathlon_front_bg_custom'));
      };
    });
  } catch {
    return localStorage.getItem('ziathlon_front_bg_custom');
  }
}

export async function clearFrontPageImage(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(KEY);
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem('ziathlon_front_bg_custom');
  } catch {
    // ignore
  }
}
