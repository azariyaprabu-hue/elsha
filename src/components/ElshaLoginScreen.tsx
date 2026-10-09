import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { ZiathlonLogo } from './ZiathlonLogo';

interface ElshaLoginScreenProps {
  onLoginSuccess: () => void;
  onLogin: (password: string) => Promise<{
    success: boolean;
    error?: string;
    isLocked?: boolean;
    waitSeconds?: number;
    mustChangePassword?: boolean;
  }>;
}

export const ElshaLoginScreen: React.FC<ElshaLoginScreenProps> = ({
  onLoginSuccess,
  onLogin,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await onLogin(password);
    setIsLoading(false);

    if (result.success) {
      setPassword('');
      onLoginSuccess();
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#180829] to-[#0A0414] flex flex-col justify-between items-center p-4 sm:p-6 text-white select-none">
      {/* Top Header Branding */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-purple-300 font-bold">
            ELSHA HEALTH SYSTEM • SECURE ACCESS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>AES-GCM-256 • Salted Scrypt</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="relative bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-purple-200/90 overflow-hidden">
          {/* Top Decorative Purple Gradient Strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#601188] via-[#781CA8] to-[#9228C9]" />

          {/* Logo & Headline */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <ZiathlonLogo size="md" variant="horizontal" showSubtitle={true} theme="light" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B0826] tracking-tight">
                Welcome to ELSHA
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
                Enter your password to continue.
              </p>
            </div>
          </div>

          {/* Validation Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">
                <span>{errorMessage}</span>
                {lockoutTimer !== null && (
                  <span className="block mt-1 font-mono font-bold text-rose-700">
                    Lockout active: {lockoutTimer}s remaining.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="elsha-main-password"
                className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-2"
              >
                Application Password
              </label>
              <div className="relative">
                <input
                  id="elsha-main-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isLoading || lockoutTimer !== null}
                  placeholder="Enter common app password"
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

            <button
              type="submit"
              disabled={isLoading || lockoutTimer !== null}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7016B7] to-[#8C1DBE] hover:from-[#601188] hover:to-[#781CA8] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 active:scale-[0.99] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Login to ELSHA</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy & Protected Notice */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#781CA8]" />
              Protected Health Information (PHI)
            </span>
            <span>v2.6 Secure</span>
          </div>
        </div>
      </div>

      {/* Footer Credentials Info */}
      <div className="w-full max-w-4xl text-center pb-2">
        <p className="text-[11px] text-purple-300/80 font-medium">
          Authorised Clinical & Sports Medicine Personnel Only • Zero Unauthenticated Content Exposure
        </p>
      </div>
    </div>
  );
};
