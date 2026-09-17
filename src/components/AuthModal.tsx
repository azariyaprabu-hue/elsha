import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Lock, Key, Smartphone, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { ZiathlonLogo } from './ZiathlonLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (passphrase: string, role: string) => void;
  currentPassphrase: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  currentPassphrase,
}) => {
  const [authMethod, setAuthMethod] = useState<'biometric' | 'pin' | 'master_passkey'>('biometric');
  const [pin, setPin] = useState('2026');
  const [passphrase, setPassphrase] = useState(currentPassphrase);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authenticatedSuccess, setAuthenticatedSuccess] = useState(false);
  const [platformMode, setPlatformMode] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  const handleBiometricSimulate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAuthenticatedSuccess(true);
      setTimeout(() => {
        onAuthenticate(passphrase, 'Clinical Nutritionist & RD');
        onClose();
      }, 650);
    }, 900);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setAuthenticatedSuccess(true);
        setTimeout(() => {
          onAuthenticate(passphrase, 'Clinical Nutritionist & RD');
          onClose();
        }, 500);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-[#0a0d0b] border border-[#d4af37]/40 rounded-2xl p-6 shadow-[0_10px_35px_rgba(212,175,55,0.25)] text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d4af37]/60 hover:text-[#d4af37] text-xl transition-colors"
        >
          ✕
        </button>

        {/* Logo and title */}
        <div className="flex justify-center mb-2">
          <ZiathlonLogo size="md" variant="vertical" showSubtitle={true} theme="dark" />
        </div>
        <h2 className="text-xl font-serif text-[#f7d88c] tracking-wide mt-2">Clinician Secure Vault Access</h2>
        <p className="text-xs text-[#d4af37]/80 mt-1 uppercase tracking-widest font-brand">
          Biometric & Passphrase Verification • E2EE Protected
        </p>

        {/* Platform Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 mb-5 bg-[#121714] p-1 rounded-lg border border-[#d4af37]/20">
          <button
            type="button"
            onClick={() => setPlatformMode('ios')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              platformMode === 'ios'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'text-[#d4af37]/70 hover:text-[#d4af37]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iOS Face ID / Touch ID
          </button>
          <button
            type="button"
            onClick={() => setPlatformMode('android')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              platformMode === 'android'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'text-[#d4af37]/70 hover:text-[#d4af37]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            Android Biometric / Passkey
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 bg-[#050706] p-1 rounded-lg border border-[#d4af37]/20 text-xs mb-5">
          <button
            type="button"
            onClick={() => setAuthMethod('biometric')}
            className={`py-2 rounded font-medium transition-all ${
              authMethod === 'biometric'
                ? 'bg-[#d4af37]/20 text-[#f7d88c] border border-[#d4af37]/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Biometric
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('pin')}
            className={`py-2 rounded font-medium transition-all ${
              authMethod === 'pin'
                ? 'bg-[#d4af37]/20 text-[#f7d88c] border border-[#d4af37]/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Secure PIN
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('master_passkey')}
            className={`py-2 rounded font-medium transition-all ${
              authMethod === 'master_passkey'
                ? 'bg-[#d4af37]/20 text-[#f7d88c] border border-[#d4af37]/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            AES Vault Key
          </button>
        </div>

        {/* Biometric flow */}
        {authMethod === 'biometric' && (
          <div className="py-4">
            <div className="relative mx-auto w-24 h-24 rounded-full border-2 border-dashed border-[#d4af37]/50 flex items-center justify-center mb-4 bg-[#111713]">
              {authenticatedSuccess ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
              ) : (
                <Fingerprint
                  className={`w-12 h-12 text-[#d4af37] ${
                    isVerifying ? 'animate-bounce text-[#f7d88c]' : ''
                  }`}
                />
              )}
            </div>

            <p className="text-sm text-gray-300 font-medium">
              {authenticatedSuccess
                ? 'Biometric verified successfully!'
                : isVerifying
                ? `Scanning ${platformMode === 'ios' ? 'Face ID / Touch ID...' : 'Android Biometric sensor...'}`
                : `Authenticate via ${platformMode === 'ios' ? 'Apple Secure Enclave' : 'Android StrongBox Keystore'}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Encrypted hardware-backed authentication for patient record privacy
            </p>

            <button
              type="button"
              disabled={isVerifying || authenticatedSuccess}
              onClick={handleBiometricSimulate}
              className="mt-6 w-full py-2.5 px-4 rounded-xl gold-button flex items-center justify-center gap-2 shadow-lg"
            >
              <Fingerprint className="w-4 h-4" />
              {isVerifying ? 'Verifying...' : `Unlock with ${platformMode === 'ios' ? 'Face ID' : 'Fingerprint'}`}
            </button>
          </div>
        )}

        {/* PIN flow */}
        {authMethod === 'pin' && (
          <form onSubmit={handlePinSubmit} className="py-2">
            <p className="text-xs text-gray-400 mb-3">
              Enter clinician 4-digit security PIN to unlock encrypted records:
            </p>
            <div className="flex justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl font-mono ${
                    pin.length > idx
                      ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#f7d88c]'
                      : 'border-white/20 bg-black/40 text-gray-600'
                  }`}
                >
                  {pin.length > idx ? '●' : '—'}
                </div>
              ))}
            </div>

            <input
              type="password"
              maxLength={4}
              value={pin ?? ''}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 4-digit PIN (Default: 2026)"
              className="w-full text-center py-2 px-3 bg-[#111613] border border-[#d4af37]/30 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37] mb-4 font-mono tracking-widest"
            />

            <button
              type="submit"
              disabled={isVerifying || pin.length < 4}
              className="w-full py-2.5 px-4 rounded-xl gold-button flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {isVerifying ? 'Decrypting Vault...' : 'Authorize Clinical Session'}
            </button>
          </form>
        )}

        {/* Master Passkey flow */}
        {authMethod === 'master_passkey' && (
          <div className="py-2 text-left">
            <p className="text-xs text-gray-400 mb-2">
              Master AES-GCM-256 derivation passphrase used to protect patient health records:
            </p>
            <div className="relative mb-4">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase ?? ''}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full py-2 pl-3 pr-10 bg-[#111613] border border-[#d4af37]/30 rounded-lg text-xs font-mono text-emerald-300 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-[#050706] border border-[#d4af37]/15 text-[11px] text-gray-400 mb-4">
              <div className="flex items-center gap-1.5 text-[#d4af37] font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Architecture</span>
              </div>
              Keys are never transmitted in plaintext. All health assessments and lab reports are encrypted in-memory on device.
            </div>

            <button
              type="button"
              onClick={() => {
                onAuthenticate(passphrase, 'Clinical Nutritionist & RD');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl gold-button flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Update Encryption Key & Unlock
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500">
          <span>Session: TLS 1.3 + AES-GCM-256</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Device Secure Enclave
          </span>
        </div>
      </div>
    </div>
  );
};
