// Client-side authentication and folder security service
// Manages authentication state in memory and sessionStorage, providing secure API wrappers.

export interface FolderSecurityItem {
  id: string;
  name: string;
  category: string;
  isUnlocked: boolean;
  isConfigured: boolean;
}

export interface SecurityStatusResponse {
  success: boolean;
  isAuthenticated: boolean;
  mustChangePassword?: boolean;
  unlockedFolders: string[];
  foldersList: FolderSecurityItem[];
}

export interface SecuritySettingsData {
  success: boolean;
  appPasswordConfigured: boolean;
  appPasswordUpdatedAt: string;
  folders: {
    id: string;
    name: string;
    category: string;
    isConfigured: boolean;
    updatedAt: string;
  }[];
  recentAuditLogs: {
    id: string;
    event: string;
    details: string;
    timestamp: string;
  }[];
}

const SESSION_STORAGE_KEY = 'ELSHA_AUTH_SESSION_TOKEN';

class ElshaSecurityClient {
  private sessionToken: string | null = null;
  private unlockedFoldersSet = new Set<string>();

  constructor() {
    // Restore session from sessionStorage if user merely refreshed the page
    try {
      this.sessionToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      this.sessionToken = null;
    }
  }

  public getSessionToken(): string | null {
    return this.sessionToken;
  }

  public isAuthenticated(): boolean {
    return !!this.sessionToken;
  }

  public isFolderUnlocked(folderId: string): boolean {
    return this.unlockedFoldersSet.has(folderId);
  }

  public getUnlockedFolders(): string[] {
    return Array.from(this.unlockedFoldersSet);
  }

  // Helper to attach authorization header to fetch calls
  public getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
    }
    return headers;
  }

  // 1. Check Authentication Status from Backend
  public async checkStatus(): Promise<SecurityStatusResponse> {
    try {
      const res = await fetch('/api/security/status', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data: SecurityStatusResponse = await res.json();
        if (data.isAuthenticated) {
          this.unlockedFoldersSet = new Set(data.unlockedFolders || []);
        } else {
          this.clearSession();
        }
        return data;
      }
    } catch (err) {
      console.warn('Security status check failed:', err);
    }
    return {
      success: false,
      isAuthenticated: false,
      unlockedFolders: [],
      foldersList: [],
    };
  }

  // 2. Perform Main Application Login
  public async login(password: string): Promise<{
    success: boolean;
    error?: string;
    isLocked?: boolean;
    waitSeconds?: number;
    mustChangePassword?: boolean;
  }> {
    try {
      const res = await fetch('/api/security/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.sessionId) {
        this.sessionToken = data.sessionId;
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
        } catch {}
        this.unlockedFoldersSet.clear();
        return {
          success: true,
          mustChangePassword: data.mustChangePassword,
        };
      }

      return {
        success: false,
        error: data.error || 'Authentication failed. Please try again.',
        isLocked: !!data.isLocked,
        waitSeconds: data.waitSeconds,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error connecting to security service.',
      };
    }
  }

  // 3. Perform Explicit Logout (Invalidates session on server and client)
  public async logout(): Promise<void> {
    try {
      if (this.sessionToken) {
        await fetch('/api/security/logout', {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }
    } catch {}

    this.clearSession();
  }

  public clearSession(): void {
    this.sessionToken = null;
    this.unlockedFoldersSet.clear();
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}
  }

  // 4. Verify & Unlock Specific Folder
  public async unlockFolder(
    folderId: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: string;
    isLocked?: boolean;
    waitSeconds?: number;
  }> {
    try {
      const res = await fetch('/api/security/folder/verify', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ folderId, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.unlockedFoldersSet.add(folderId);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Incorrect folder password.',
        isLocked: !!data.isLocked,
        waitSeconds: data.waitSeconds,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to verify folder password.',
      };
    }
  }

  // 5. Lock Specific Folder (when navigating away)
  public async lockFolder(folderId: string): Promise<void> {
    this.unlockedFoldersSet.delete(folderId);
    try {
      if (this.sessionToken) {
        await fetch('/api/security/folder/lock', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ folderId }),
        });
      }
    } catch {}
  }

  // 6. Lock All Folders
  public async lockAllFolders(): Promise<void> {
    this.unlockedFoldersSet.clear();
    try {
      if (this.sessionToken) {
        await fetch('/api/security/folder/lock-all', {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }
    } catch {}
  }

  // 7. Fetch Security Settings
  public async getSecuritySettings(): Promise<SecuritySettingsData | null> {
    try {
      const res = await fetch('/api/security/settings', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }

  // 8. Change Main App Password
  public async changeAppPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/security/change-app-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to change password.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  }

  // 9. Change Individual Folder Password
  public async changeFolderPassword(
    folderId: string,
    adminPassword: string,
    newFolderPassword: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/security/change-folder-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ folderId, adminPassword, newFolderPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also remove local unlocked cache for this folder so new password is required
        this.unlockedFoldersSet.delete(folderId);
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to change folder password.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  }
}

export const elshaSecurity = new ElshaSecurityClient();
