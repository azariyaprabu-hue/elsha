import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { CANONICAL_FOLDERS, CanonicalFolderMeta } from '../types/securityTypes';
export { CANONICAL_FOLDERS, CanonicalFolderMeta };

export interface FolderSecurityConfig {
  id: string;
  name: string;
  category: string;
  salt: string;
  passwordHash: string;
  isConfigured: boolean;
  updatedAt: string;
}

export interface SecurityDbSchema {
  version: number;
  appPassword: {
    salt: string;
    passwordHash: string;
    isConfigured: boolean;
    updatedAt: string;
    mustChangePassword?: boolean;
  };
  folders: Record<string, FolderSecurityConfig>;
  securityAuditLogs: {
    id: string;
    event: 'APP_LOGIN_SUCCESS' | 'APP_LOGIN_FAIL' | 'FOLDER_UNLOCK_SUCCESS' | 'FOLDER_UNLOCK_FAIL' | 'PASSWORD_CHANGED' | 'APP_LOGOUT' | 'SECURITY_RESET';
    details: string;
    timestamp: string;
    ip?: string;
  }[];
}

const SECURITY_DIR = path.join(process.cwd(), 'uploads', 'security');
const SECURITY_FILE = path.join(SECURITY_DIR, 'elsha_security_config.json');

// Memory storage for rate-limiting failed attempts
interface RateLimitBucket {
  count: number;
  firstAttempt: number;
  lockedUntil: number;
}
const failedAttemptsMap = new Map<string, RateLimitBucket>();

// Password Hashing with Salt using scrypt (Node crypto)
export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { salt: actualSalt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  if (!password || !salt || !storedHash) return false;
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const computedBuf = Buffer.from(computedHash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (computedBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, storedBuf);
  } catch (err) {
    console.error('Password verification failure:', err);
    return false;
  }
}

// Rate Limiting helper: max 5 failed attempts within 5 minutes => 5-minute lockout
export function checkRateLimit(key: string): { isLocked: boolean; waitSeconds?: number } {
  const now = Date.now();
  const bucket = failedAttemptsMap.get(key);
  if (!bucket) return { isLocked: false };

  if (bucket.lockedUntil > now) {
    const waitSeconds = Math.ceil((bucket.lockedUntil - now) / 1000);
    return { isLocked: true, waitSeconds };
  }

  // Reset if window expired (5 minutes)
  if (now - bucket.firstAttempt > 5 * 60 * 1000) {
    failedAttemptsMap.delete(key);
    return { isLocked: false };
  }

  return { isLocked: false };
}

export function recordFailedAttempt(key: string): { isLocked: boolean; waitSeconds?: number } {
  const now = Date.now();
  let bucket = failedAttemptsMap.get(key);
  if (!bucket || now - bucket.firstAttempt > 5 * 60 * 1000) {
    bucket = { count: 1, firstAttempt: now, lockedUntil: 0 };
  } else {
    bucket.count += 1;
  }

  if (bucket.count >= 5) {
    bucket.lockedUntil = now + 5 * 60 * 1000; // 5 min lockout
    failedAttemptsMap.set(key, bucket);
    return { isLocked: true, waitSeconds: 300 };
  }

  failedAttemptsMap.set(key, bucket);
  return { isLocked: false };
}

export function resetFailedAttempts(key: string) {
  failedAttemptsMap.delete(key);
}

// Security Configuration DB management
export function loadSecurityConfig(): SecurityDbSchema {
  if (!fs.existsSync(SECURITY_DIR)) {
    fs.mkdirSync(SECURITY_DIR, { recursive: true });
  }

  if (fs.existsSync(SECURITY_FILE)) {
    try {
      const raw = fs.readFileSync(SECURITY_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data && data.appPassword && data.folders) {
        // Ensure all canonical folders exist in config
        let updated = false;
        CANONICAL_FOLDERS.forEach((f) => {
          if (!data.folders[f.id]) {
            const defHash = hashPassword(`Elsha@${f.id}2026`);
            data.folders[f.id] = {
              id: f.id,
              name: f.name,
              category: f.category,
              salt: defHash.salt,
              passwordHash: defHash.hash,
              isConfigured: true,
              updatedAt: new Date().toISOString(),
            };
            updated = true;
          }
        });
        if (updated) {
          saveSecurityConfig(data);
        }
        return data;
      }
    } catch (e) {
      console.error('Error reading elsha_security_config.json:', e);
    }
  }

  // Initial provision: Secure default configuration
  const defaultAppPass = hashPassword('Elsha@2026');
  const foldersConfig: Record<string, FolderSecurityConfig> = {};

  CANONICAL_FOLDERS.forEach((f) => {
    const fHash = hashPassword(`Elsha@${f.id}2026`);
    foldersConfig[f.id] = {
      id: f.id,
      name: f.name,
      category: f.category,
      salt: fHash.salt,
      passwordHash: fHash.hash,
      isConfigured: true,
      updatedAt: new Date().toISOString(),
    };
  });

  const initialConfig: SecurityDbSchema = {
    version: 1,
    appPassword: {
      salt: defaultAppPass.salt,
      passwordHash: defaultAppPass.hash,
      isConfigured: true,
      updatedAt: new Date().toISOString(),
      mustChangePassword: false,
    },
    folders: foldersConfig,
    securityAuditLogs: [
      {
        id: `audit-${Date.now()}`,
        event: 'SECURITY_RESET',
        details: 'Initial ELSHA Security System provisioned with salted scrypt hashing.',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  saveSecurityConfig(initialConfig);
  return initialConfig;
}

export function saveSecurityConfig(config: SecurityDbSchema) {
  try {
    if (!fs.existsSync(SECURITY_DIR)) {
      fs.mkdirSync(SECURITY_DIR, { recursive: true });
    }
    fs.writeFileSync(SECURITY_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save security config:', err);
  }
}

export function addAuditLog(
  event: SecurityDbSchema['securityAuditLogs'][0]['event'],
  details: string,
  ip?: string
) {
  try {
    const config = loadSecurityConfig();
    config.securityAuditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      event,
      details,
      timestamp: new Date().toISOString(),
      ip,
    });
    // Keep max 200 logs
    if (config.securityAuditLogs.length > 200) {
      config.securityAuditLogs = config.securityAuditLogs.slice(0, 200);
    }
    saveSecurityConfig(config);
  } catch (e) {
    console.error('Audit log error:', e);
  }
}
