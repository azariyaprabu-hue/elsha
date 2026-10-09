import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import {
  loadSecurityConfig,
  saveSecurityConfig,
  verifyPassword,
  hashPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
  addAuditLog,
  CANONICAL_FOLDERS,
} from './securityManager';

export const securityRouter = express.Router();

export interface ActiveSession {
  sessionId: string;
  authenticatedAt: number;
  lastActiveAt: number;
  ip: string;
  unlockedFolders: Set<string>;
}

// In-memory active authenticated sessions map (keyed by secure cryptographically random token)
export const activeSessions = new Map<string, ActiveSession>();

export function getSessionFromReq(req: Request): ActiveSession | null {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-session-id']) {
    token = String(req.headers['x-session-id']).trim();
  } else if (req.query.token) {
    token = String(req.query.token).trim();
  }

  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  // Session remains valid until explicit user logout (logout-only policy)
  session.lastActiveAt = Date.now();
  return session;
}

// Express middleware to protect routes requiring Main App Login
export function requireAppAuth(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: ELSHA App authentication required. Please login.',
      code: 'AUTH_REQUIRED',
    });
  }
  (req as any).session = session;
  next();
}

// Express middleware to protect routes requiring specific Folder Unlock
export function requireFolderAuth(folderId: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = getSessionFromReq(req);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: ELSHA App authentication required. Please login.',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!session.unlockedFolders.has(folderId)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Folder [${folderId}] is locked. Please enter folder password.`,
        code: 'FOLDER_LOCKED',
        folderId,
      });
    }

    (req as any).session = session;
    next();
  };
}

// ---------------------------------------------------------------------------
// 1. MAIN APP LOGIN / AUTH STATUS / LOGOUT
// ---------------------------------------------------------------------------

securityRouter.get('/status', (req: Request, res: Response) => {
  const session = getSessionFromReq(req);
  const config = loadSecurityConfig();

  res.json({
    success: true,
    isAuthenticated: !!session,
    mustChangePassword: config.appPassword.mustChangePassword || false,
    unlockedFolders: session ? Array.from(session.unlockedFolders) : [],
    foldersList: CANONICAL_FOLDERS.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      isUnlocked: session ? session.unlockedFolders.has(f.id) : false,
      isConfigured: !!config.folders[f.id]?.isConfigured,
    })),
  });
});

securityRouter.post('/login', (req: Request, res: Response) => {
  const { password } = req.body || {};
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Password is required.',
    });
  }

  // Rate Limiting Check
  const rateLimitKey = `app_login_${ip}`;
  const rateCheck = checkRateLimit(rateLimitKey);
  if (rateCheck.isLocked) {
    addAuditLog('APP_LOGIN_FAIL', `Temporary lockout active for IP ${ip}`, ip);
    return res.status(429).json({
      success: false,
      error: `Too many failed attempts. System temporarily locked. Try again in ${rateCheck.waitSeconds}s.`,
      isLocked: true,
      waitSeconds: rateCheck.waitSeconds,
    });
  }

  const config = loadSecurityConfig();
  const isValid = verifyPassword(password, config.appPassword.salt, config.appPassword.passwordHash);

  if (!isValid) {
    const lockResult = recordFailedAttempt(rateLimitKey);
    addAuditLog('APP_LOGIN_FAIL', `Incorrect password attempt from IP ${ip}`, ip);

    if (lockResult.isLocked) {
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Locked for ${lockResult.waitSeconds} seconds.`,
        isLocked: true,
        waitSeconds: lockResult.waitSeconds,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Incorrect password. Please try again.',
    });
  }

  // Login Success: Reset rate limit & create active session
  resetFailedAttempts(rateLimitKey);
  const sessionId = crypto.randomBytes(32).toString('hex');
  const session: ActiveSession = {
    sessionId,
    authenticatedAt: Date.now(),
    lastActiveAt: Date.now(),
    ip,
    unlockedFolders: new Set<string>(),
  };

  activeSessions.set(sessionId, session);
  addAuditLog('APP_LOGIN_SUCCESS', `Successful main app login session created`, ip);

  res.json({
    success: true,
    sessionId,
    message: 'Welcome to ELSHA. Authentication successful.',
    mustChangePassword: config.appPassword.mustChangePassword || false,
    unlockedFolders: [],
  });
});

securityRouter.post('/logout', (req: Request, res: Response) => {
  const session = getSessionFromReq(req);
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (session) {
    activeSessions.delete(session.sessionId);
    addAuditLog('APP_LOGOUT', `User explicitly logged out. Session terminated.`, ip);
  }

  res.json({
    success: true,
    message: 'Logged out successfully. All folder access grants cleared.',
  });
});

// ---------------------------------------------------------------------------
// 2. FOLDER PASSWORD VERIFICATION & UNLOCK
// ---------------------------------------------------------------------------

securityRouter.post('/folder/verify', requireAppAuth, (req: Request, res: Response) => {
  const session = (req as any).session as ActiveSession;
  const { folderId, password } = req.body || {};
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!folderId || !password) {
    return res.status(400).json({
      success: false,
      error: 'Folder ID and password are required.',
    });
  }

  const rateLimitKey = `folder_${folderId}_${ip}`;
  const rateCheck = checkRateLimit(rateLimitKey);
  if (rateCheck.isLocked) {
    return res.status(429).json({
      success: false,
      error: `Too many failed attempts on folder. Locked for ${rateCheck.waitSeconds}s.`,
      isLocked: true,
      waitSeconds: rateCheck.waitSeconds,
    });
  }

  const config = loadSecurityConfig();
  const folderConfig = config.folders[folderId];
  if (!folderConfig) {
    return res.status(404).json({
      success: false,
      error: `Folder '${folderId}' not found in security configuration.`,
    });
  }

  const isValid = verifyPassword(password, folderConfig.salt, folderConfig.passwordHash);

  if (!isValid) {
    const lockResult = recordFailedAttempt(rateLimitKey);
    addAuditLog('FOLDER_UNLOCK_FAIL', `Failed folder unlock for '${folderId}'`, ip);

    if (lockResult.isLocked) {
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Locked for ${lockResult.waitSeconds} seconds.`,
        isLocked: true,
        waitSeconds: lockResult.waitSeconds,
      });
    }

    return res.status(401).json({
      success: false,
      error: `Incorrect password for ${folderConfig.name}. Please try again.`,
    });
  }

  // Folder verified successfully: Grant access for this folder ONLY in this session
  resetFailedAttempts(rateLimitKey);
  session.unlockedFolders.add(folderId);
  addAuditLog('FOLDER_UNLOCK_SUCCESS', `Folder '${folderId}' successfully unlocked`, ip);

  res.json({
    success: true,
    folderId,
    name: folderConfig.name,
    unlockedFolders: Array.from(session.unlockedFolders),
    message: `${folderConfig.name} unlocked successfully.`,
  });
});

// Explicitly relock a folder when user navigates away or closes it
securityRouter.post('/folder/lock', requireAppAuth, (req: Request, res: Response) => {
  const session = (req as any).session as ActiveSession;
  const { folderId } = req.body || {};

  if (folderId) {
    session.unlockedFolders.delete(folderId);
  }

  res.json({
    success: true,
    folderId,
    unlockedFolders: Array.from(session.unlockedFolders),
  });
});

// Relock all folders while maintaining main app session
securityRouter.post('/folder/lock-all', requireAppAuth, (req: Request, res: Response) => {
  const session = (req as any).session as ActiveSession;
  session.unlockedFolders.clear();

  res.json({
    success: true,
    unlockedFolders: [],
  });
});

// ---------------------------------------------------------------------------
// 3. SECURITY SETTINGS & PASSWORD MANAGEMENT
// ---------------------------------------------------------------------------

// Get Security Settings list (Never exposes password hashes or salts)
securityRouter.get('/settings', requireAppAuth, (_req: Request, res: Response) => {
  const config = loadSecurityConfig();

  res.json({
    success: true,
    appPasswordConfigured: config.appPassword.isConfigured,
    appPasswordUpdatedAt: config.appPassword.updatedAt,
    folders: CANONICAL_FOLDERS.map((f) => {
      const fc = config.folders[f.id];
      return {
        id: f.id,
        name: f.name,
        category: f.category,
        isConfigured: !!fc?.isConfigured,
        updatedAt: fc?.updatedAt || config.appPassword.updatedAt,
      };
    }),
    recentAuditLogs: config.securityAuditLogs.slice(0, 30),
  });
});

// Change Main App Common Password
securityRouter.post('/change-app-password', requireAppAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body || {};
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are both required.',
    });
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters long.',
    });
  }

  const config = loadSecurityConfig();
  const isCurrentValid = verifyPassword(
    currentPassword,
    config.appPassword.salt,
    config.appPassword.passwordHash
  );

  if (!isCurrentValid) {
    return res.status(401).json({
      success: false,
      error: 'Current application password is incorrect.',
    });
  }

  const newHash = hashPassword(newPassword);
  config.appPassword = {
    salt: newHash.salt,
    passwordHash: newHash.hash,
    isConfigured: true,
    updatedAt: new Date().toISOString(),
    mustChangePassword: false,
  };

  saveSecurityConfig(config);
  addAuditLog('PASSWORD_CHANGED', `Main application password changed successfully`, ip);

  res.json({
    success: true,
    message: 'Application common password updated successfully.',
  });
});

// Change Individual Folder Password
securityRouter.post('/change-folder-password', requireAppAuth, (req: Request, res: Response) => {
  const { folderId, adminPassword, newFolderPassword } = req.body || {};
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!folderId || !adminPassword || !newFolderPassword) {
    return res.status(400).json({
      success: false,
      error: 'Folder ID, administrator password, and new folder password are required.',
    });
  }

  if (typeof newFolderPassword !== 'string' || newFolderPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New folder password must be at least 6 characters long.',
    });
  }

  const config = loadSecurityConfig();

  // Validate admin authorization using app password
  const isAdminValid = verifyPassword(
    adminPassword,
    config.appPassword.salt,
    config.appPassword.passwordHash
  );

  if (!isAdminValid) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect administrator password.',
    });
  }

  const folderMeta = CANONICAL_FOLDERS.find((f) => f.id === folderId);
  const newHash = hashPassword(newFolderPassword);

  config.folders[folderId] = {
    id: folderId,
    name: folderMeta?.name || folderId,
    category: folderMeta?.category || 'Clinical Folder',
    salt: newHash.salt,
    passwordHash: newHash.hash,
    isConfigured: true,
    updatedAt: new Date().toISOString(),
  };

  saveSecurityConfig(config);
  addAuditLog('PASSWORD_CHANGED', `Password for folder '${folderId}' updated`, ip);

  // Invalidate any active session unlocks for this specific folder so new password is required
  activeSessions.forEach((s) => s.unlockedFolders.delete(folderId));

  res.json({
    success: true,
    folderId,
    message: `Password for ${folderMeta?.name || folderId} updated successfully.`,
  });
});
