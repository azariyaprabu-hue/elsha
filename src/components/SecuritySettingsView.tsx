import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  History,
  ArrowLeft,
  Check,
} from 'lucide-react';
import {
  elshaSecurity,
  SecuritySettingsData,
} from '../services/elshaSecurityClient';
import { CANONICAL_FOLDERS } from '../types/securityTypes';

interface SecuritySettingsViewProps {
  onBackToDashboard: () => void;
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({
  onBackToDashboard,
}) => {
  const [settings, setSettings] = useState<SecuritySettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App Entrance Password Change form
  const [currentAppPassword, setCurrentAppPassword] = useState('');
  const [newAppPassword, setNewAppPassword] = useState('');
  const [confirmAppPassword, setConfirmAppPassword] = useState('');
  const [showAppPass, setShowAppPass] = useState(false);
  const [appPassStatus, setAppPassStatus] = useState<{
    type: 'success' | 'error' | null;
    msg: string;
  }>({ type: null, msg: '' });
  const [isUpdatingAppPass, setIsUpdatingAppPass] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    const data = await elshaSecurity.getSecuritySettings();
    setSettings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleUpdateAppPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppPassword) {
      setAppPassStatus({ type: 'error', msg: 'Please enter your current entrance password.' });
      return;
    }
    if (newAppPassword.length < 6) {
      setAppPassStatus({ type: 'error', msg: 'New entrance password must be at least 6 characters long.' });
      return;
    }
    if (newAppPassword !== confirmAppPassword) {
      setAppPassStatus({ type: 'error', msg: 'New entrance passwords do not match.' });
      return;
    }

    setIsUpdatingAppPass(true);
    setAppPassStatus({ type: null, msg: '' });

    const res = await elshaSecurity.changeAppPassword(currentAppPassword, newAppPassword);
    setIsUpdatingAppPass(false);

    if (res.success) {
      setAppPassStatus({
        type: 'success',
        msg: 'Entrance application password updated successfully!',
      });
      setCurrentAppPassword('');
      setNewAppPassword('');
      setConfirmAppPassword('');
      loadSettings();
    } else {
      setAppPassStatus({
        type: 'error',
        msg: res.error || 'Failed to update entrance password.',
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border-2 border-purple-200/80 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#781CA8] transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                ELSHA Security & Entrance Access Settings
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Entrance Only Protected
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Only one entrance password protects the application. All clinical folders are instantly accessible once inside.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-purple-300 text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* 1. MAIN APPLICATION ENTRANCE PASSWORD MANAGEMENT                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-purple-200/90 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#781CA8] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Application Entrance Password
              </h2>
              <p className="text-[11px] text-slate-500">
                The single password required to log into ELSHA
              </p>
            </div>
          </div>

          {appPassStatus.msg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                appPassStatus.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {appPassStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{appPassStatus.msg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateAppPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Current Entrance Password
              </label>
              <input
                type={showAppPass ? 'text' : 'password'}
                value={currentAppPassword}
                onChange={(e) => setCurrentAppPassword(e.target.value)}
                placeholder="Enter current entrance password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#781CA8] focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Entrance Password (Min. 6 chars)
              </label>
              <input
                type={showAppPass ? 'text' : 'password'}
                value={newAppPassword}
                onChange={(e) => setNewAppPassword(e.target.value)}
                placeholder="Enter new entrance password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#781CA8] focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Entrance Password
              </label>
              <input
                type={showAppPass ? 'text' : 'password'}
                value={confirmAppPassword}
                onChange={(e) => setConfirmAppPassword(e.target.value)}
                placeholder="Re-enter new entrance password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#781CA8] focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowAppPass(!showAppPass)}
                className="text-[11px] text-slate-500 hover:text-purple-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {showAppPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAppPass ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                disabled={isUpdatingAppPass}
                className="py-2.5 px-5 bg-[#781CA8] hover:bg-[#601188] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
              >
                {isUpdatingAppPass && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Update Entrance Password</span>
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with cryptographic scrypt hash & salt • Zero plaintext exposure</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DIRECT ACCESS CLINICAL FOLDERS DIRECTORY                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-purple-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Folder Direct Access
                </h3>
                <p className="text-[11px] text-slate-500">
                  No individual folder passwords required
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Unlocked
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {CANONICAL_FOLDERS.map((f) => (
              <div
                key={f.id}
                className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    📁 {f.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{f.category}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0">
                  <Check className="w-3 h-3" />
                  <span>Direct Open</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECURITY AUDIT LOGS                                                    */}
      {/* ========================================================================= */}
      {settings?.recentAuditLogs && settings.recentAuditLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-purple-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#781CA8]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Security Audit Activity (Last 30 Events)
            </h3>
          </div>

          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {settings.recentAuditLogs.map((log) => (
              <div key={log.id} className="py-2 flex items-center justify-between text-[11px] gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.event.includes('FAIL')
                        ? 'bg-rose-500'
                        : log.event.includes('SUCCESS')
                        ? 'bg-emerald-500'
                        : 'bg-purple-500'
                    }`}
                  />
                  <span className="font-bold text-slate-800">{log.event}</span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
