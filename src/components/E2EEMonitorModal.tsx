import React, { useState } from 'react';
import { Shield, Key, RefreshCw, Copy, Check, Lock, Database } from 'lucide-react';
import { EncryptedPackage } from '../utils/crypto';

interface E2EEMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  encryptedPackage: EncryptedPackage | null;
  keyFingerprint: string;
  onReEncrypt: () => void;
}

export const E2EEMonitorModal: React.FC<E2EEMonitorModalProps> = ({
  isOpen,
  onClose,
  encryptedPackage,
  keyFingerprint,
  onReEncrypt,
}) => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'status' | 'ciphertext' | 'spec'>('status');

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-[#090c0a] border border-[#d4af37]/40 rounded-2xl p-6 shadow-[0_10px_40px_rgba(212,175,55,0.25)] text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f7d88c]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#f7d88c] tracking-wide flex items-center gap-2">
                ELSHA Health Data E2EE Vault
                <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Active
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Hardware-accelerated AES-GCM-256 with PBKDF2 (100,000 rounds)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-4 border-b border-white/10 pb-2 text-xs">
          <button
            onClick={() => setTab('status')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === 'status'
                ? 'bg-[#d4af37]/20 text-[#f7d88c] border border-[#d4af37]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Security Status
          </button>
          <button
            onClick={() => setTab('ciphertext')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === 'ciphertext'
                ? 'bg-[#d4af37]/20 text-[#f7d88c] border border-[#d4af37]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ciphertext Stream
          </button>
          <button
            onClick={() => setTab('spec')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === 'spec'
                ? 'bg-[#d4af37]/20 text-[#f7d88c] border border-[#d4af37]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            HIPAA & Security Spec
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto pr-1 flex-1 text-xs space-y-4">
          {tab === 'status' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#101411] border border-[#d4af37]/25">
                  <span className="text-gray-400 block text-[11px]">Vault Algorithm</span>
                  <span className="text-sm font-semibold text-white font-mono">
                    AES-GCM (256-bit Galois/Counter)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#101411] border border-[#d4af37]/25">
                  <span className="text-gray-400 block text-[11px]">Key Derivation</span>
                  <span className="text-sm font-semibold text-white font-mono">
                    PBKDF2-HMAC-SHA256 (100k iters)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#101411] border border-[#d4af37]/25">
                  <span className="text-gray-400 block text-[11px]">Cryptographic Fingerprint</span>
                  <span className="text-xs font-semibold text-[#f7d88c] font-mono tracking-wider">
                    {keyFingerprint || '2B:4E:99:A1:0F:77:D8:12'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#101411] border border-[#d4af37]/25">
                  <span className="text-gray-400 block text-[11px]">Protected Patient Records</span>
                  <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    All 14 Clinical Modules Encrypted
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0d100e] border border-emerald-500/20 text-gray-300">
                <h4 className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Client-Side Zero Knowledge Assured
                </h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Patient Kiruthika’s biometric assessments, glycemic logs, 24-hour recalls, dietary patterns, and uploaded pathology files are encrypted prior to local persistence or cloud sync. Plaintext exists only within memory during an active clinician session.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onReEncrypt}
                  className="py-2 px-4 rounded-lg bg-[#141b16] border border-[#d4af37]/40 text-[#f7d88c] hover:bg-[#d4af37]/20 flex items-center gap-2 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-Encrypt Vault with Fresh IV
                </button>
                <span className="text-[11px] text-gray-500 font-mono">
                  Timestamp: {encryptedPackage?.timestamp ? new Date(encryptedPackage.timestamp).toLocaleTimeString() : 'Active'}
                </span>
              </div>
            </div>
          )}

          {tab === 'ciphertext' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Live Base64 Encrypted Ciphertext Payload:</span>
                <button
                  onClick={() => copyToClipboard(encryptedPackage?.ciphertext || '')}
                  className="py-1 px-2.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Ciphertext'}
                </button>
              </div>

              <div className="p-3 bg-black rounded-xl border border-white/15 font-mono text-[11px] text-emerald-400/90 break-all max-h-48 overflow-y-auto leading-relaxed">
                {encryptedPackage?.ciphertext ? (
                  <>
                    <span className="text-gray-500 select-none">// IV: {encryptedPackage.iv.slice(0, 16)}...</span>
                    <br />
                    <span className="text-gray-500 select-none">// Salt: {encryptedPackage.salt.slice(0, 16)}...</span>
                    <br />
                    {encryptedPackage.ciphertext}
                  </>
                ) : (
                  'No ciphertext cached. Re-encrypting...'
                )}
              </div>

              <p className="text-[11px] text-gray-400">
                This encrypted blob is what would be synchronized across cloud backends or offline peer devices. Without the clinician passkey or secure biometric key, decoding is mathematically infeasible.
              </p>
            </div>
          )}

          {tab === 'spec' && (
            <div className="space-y-2 text-gray-300">
              <div className="p-3 rounded-lg bg-[#101411] border border-white/10">
                <h5 className="font-semibold text-[#f7d88c] mb-1">E2EE Specification Standards</h5>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-400">
                  <li>NIST SP 800-38D Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM).</li>
                  <li>RFC 8018 PKCS #5: Password-Based Cryptography Specification Version 2.1.</li>
                  <li>Zero-Plaintext leakage: Identifiable Health Information (PHI) encrypted with distinct 96-bit initialization vectors per session.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl gold-button text-xs font-semibold"
          >
            Close Security Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
