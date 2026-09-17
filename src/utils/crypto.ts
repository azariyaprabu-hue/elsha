/**
 * End-to-End Encryption (E2EE) Utility for ELSHA Health Vault
 * Uses Web Crypto API (SubtleCrypto) with AES-GCM 256-bit and PBKDF2 Key Derivation.
 * Health records are encrypted client-side before storage or transmission.
 */

export interface EncryptedPackage {
  ciphertext: string; // Base64
  iv: string;         // Base64
  salt: string;       // Base64
  algorithm: string;
  timestamp: string;
  fingerprint: string;
}

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive AES-GCM Key using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Generate key fingerprint
export async function generateKeyFingerprint(passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-256', enc.encode(passphrase));
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase();
}

/**
 * Encrypt arbitrary JSON serializable clinical health data
 */
export async function encryptHealthData(
  data: unknown,
  passphrase: string = 'ELSHA_SECURE_VAULT_KEY_2026'
): Promise<EncryptedPackage> {
  const enc = new TextEncoder();
  const jsonString = JSON.stringify(data);
  const dataBuffer = enc.encode(jsonString);

  // Generate random salt and IV
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const cryptoKey = await deriveKey(passphrase, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    dataBuffer
  );

  const fingerprint = await generateKeyFingerprint(passphrase);

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv.buffer),
    salt: bufferToBase64(salt.buffer),
    algorithm: 'AES-GCM-256-PBKDF2-SHA256',
    timestamp: new Date().toISOString(),
    fingerprint,
  };
}

/**
 * Decrypt clinical health data package
 */
export async function decryptHealthData<T>(
  encryptedPkg: EncryptedPackage,
  passphrase: string = 'ELSHA_SECURE_VAULT_KEY_2026'
): Promise<T> {
  const salt = new Uint8Array(base64ToBuffer(encryptedPkg.salt));
  const iv = new Uint8Array(base64ToBuffer(encryptedPkg.iv));
  const ciphertext = base64ToBuffer(encryptedPkg.ciphertext);

  const cryptoKey = await deriveKey(passphrase, salt);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    ciphertext
  );

  const dec = new TextDecoder();
  const jsonString = dec.decode(decryptedBuffer);
  return JSON.parse(jsonString) as T;
}
