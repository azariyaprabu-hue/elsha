import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  FolderLock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { ZiathlonLogo } from './ZiathlonLogo';

interface FolderPasswordPromptProps {
  folderId: string;
  folderName: string;
  folderSubtitle?: string;
  categoryName?: string;
  onUnlockSuccess: () => void;
  onCancel: () => void;
  onUnlock: (password: string) => Promise<{
    success: boolean;
    error?: string;
    isLocked?: boolean;
    waitSeconds?: number;
  }>;
}

export const FolderPasswordPrompt: React.FC<FolderPasswordPromptProps> = ({
  folderId,
  folderName,
  folderSubtitle,
  categoryName,
  onUnlockSuccess,
  onCancel,
  onUnlock,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter the folder password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await onUnlock(password);
    setIsLoading(false);

    if (result.success) {
      setPassword('');
      onUnlockSuccess();
    } else {
      setErrorMessage(result.error || 'Incorrect password. Please try again.');
      if (result.isLocked && result.waitSeconds) {
        setLockoutTimer(result.waitSeconds);
        const timer = setInterval(() => {
          setLockoutTimer((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(timer);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full min-h-[580px] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border-2 border-purple-200/90 relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#601188] via-[#781CA8] to-[#9228C9]" />

        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#781CA8] transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-purple-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 text-purple-700" />
            <span>Folder Gate</span>
          </div>
        </div>

        {/* Folder Identification */}
        <div className="text-center space-y-3 mb-7">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 text-[#781CA8] flex items-center justify-center shadow-inner border border-purple-200">
            <FolderLock className="w-8 h-8" />
          </div>

          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#781CA8]">
              {categoryName || 'Protected Medical Folder'}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Folder Protected
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Enter the password to access <strong className="text-slate-900 font-bold">{folderName}</strong>.
            </p>
            {folderSubtitle && (
              <p className="text-[11px] text-slate-400 mt-0.5">{folderSubtitle}</p>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-medium">
              <span>{errorMessage}</span>
              {lockoutTimer !== null && (
                <span className="block mt-1 font-mono font-bold text-rose-700">
                  Folder locked: {lockoutTimer}s remaining.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor={`folder-password-${folderId}`}
              className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-2"
            >
              {folderName} Password
            </label>
            <div className="relative">
              <input
                id={`folder-password-${folderId}`}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isLoading || lockoutTimer !== null}
                placeholder={`Enter password for ${folderName}`}
                autoFocus
                autoComplete="current-password"
                className="w-full pl-4 pr-11 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#781CA8] focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 p-1 cursor-pointer transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || lockoutTimer !== null}
              className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-[#7016B7] to-[#8C1DBE] hover:from-[#601188] hover:to-[#781CA8] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-[0.99] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Folder...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock {folderName}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Info */}
        <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span>Isolated Folder Encryption</span>
          <span>Temporary Grant (Active View Only)</span>
        </div>
      </div>
    </div>
  );
};
