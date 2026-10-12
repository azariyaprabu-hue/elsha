import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, AlertCircle, CheckCircle2, Loader2, RefreshCw, KeyRound, Image as ImageIcon } from 'lucide-react';

interface ZionQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPairSuccess: (device: any) => void;
}

export const ZionQrScannerModal: React.FC<ZionQrScannerModalProps> = ({
  isOpen,
  onClose,
  onPairSuccess,
}) => {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairError, setPairError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Could not access device camera. Please allow camera permissions or enter code manually.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    await executePairing(manualCode.trim());
  };

  const executePairing = async (tokenOrPayload: string) => {
    setIsPairing(true);
    setPairError(null);

    let token = tokenOrPayload;
    try {
      // Check if it's JSON payload from ZION QR
      if (tokenOrPayload.startsWith('{')) {
        const parsed = JSON.parse(tokenOrPayload);
        if (parsed.token) token = parsed.token;
      }
    } catch {}

    try {
      const res = await fetch('/api/zion/devices/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Companion' : 'Browser Companion',
          platform: 'Companion Scanner',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to pair device');
      }

      stopCamera();
      onPairSuccess(data.device);
      onClose();
    } catch (err: any) {
      setPairError(err.message || 'Pairing failed. Please ensure the QR code is still valid.');
    } finally {
      setIsPairing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 dark:border-purple-950 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                Scan ZION QR Code
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Link device securely or enter pairing code
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'camera'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'manual'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Enter Code Manually
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center">
          {mode === 'camera' ? (
            <div className="w-full flex flex-col items-center">
              {/* Camera Viewport */}
              <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-purple-400 dark:border-purple-700">
                {cameraError ? (
                  <div className="p-4 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs text-slate-300">{cameraError}</p>
                    <button
                      onClick={() => setMode('manual')}
                      className="mt-2 px-4 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Use Manual Code Instead
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Overlay Frame */}
                    <div className="absolute inset-8 border-2 border-purple-500 rounded-lg pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                        <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
                      </div>
                      <div className="w-full h-0.5 bg-purple-400/80 animate-pulse shadow-sm" />
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                        <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                Point your camera at the QR code displayed on the other device.
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  ZION Pairing Token or QR Payload
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g. zion_pair_8a7b9c_172847..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/30 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Copy the active pairing token from the Linked Devices page.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPairing || !manualCode.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isPairing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Pairing...</span>
                  </>
                ) : (
                  <span>Connect & Link Device</span>
                )}
              </button>
            </form>
          )}

          {pairError && (
            <div className="mt-4 w-full p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pairError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-purple-950/10 flex items-center justify-between text-xs text-slate-500">
          <span>End-to-end encrypted device handoff</span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="font-bold text-purple-700 dark:text-purple-400 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
