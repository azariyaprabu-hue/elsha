import React, { useState, useEffect, useRef } from 'react';
import {
  Laptop,
  Smartphone,
  QrCode,
  Camera,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Layers,
  Loader2,
  Key,
  Database,
  Radio,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ZionLinkedDevice } from '../../server/zionDb';

interface ZionLinkedDevicesViewProps {
  onOpenScanner: () => void;
  devices: ZionLinkedDevice[];
  onUnlinkDevice: (id: string) => void;
  onRefreshDevices: () => void;
}

export const ZionLinkedDevicesView: React.FC<ZionLinkedDevicesViewProps> = ({
  onOpenScanner,
  devices,
  onUnlinkDevice,
  onRefreshDevices,
}) => {
  const [activeTab, setActiveTab] = useState<'zionPairing' | 'whatsappOfficial'>('zionPairing');

  // ZION Pairing Session State
  const [pairingToken, setPairingToken] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);
  const [isQrLoading, setIsQrLoading] = useState<boolean>(false);
  const [qrStatus, setQrStatus] = useState<'active' | 'expired' | 'paired'>('active');

  // Official WhatsApp Cloud Status State
  const [waStatus, setWaStatus] = useState<any>(null);
  const [waHealth, setWaHealth] = useState<any>(null);
  const [isWaChecking, setIsWaChecking] = useState<boolean>(false);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate real QR on load or tab change
  useEffect(() => {
    if (activeTab === 'zionPairing') {
      fetchNewPairingSession();
    } else {
      fetchWhatsAppStatus();
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [activeTab]);

  // Countdown timer effect
  useEffect(() => {
    if (!pairingToken || qrStatus !== 'active') return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setQrStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pairingToken, qrStatus]);

  // Polling to detect if another device scanned the QR code
  useEffect(() => {
    if (!pairingToken || qrStatus !== 'active') return;

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/zion/devices/pairing-status/${pairingToken}`);
        const data = await res.json();
        if (data.success) {
          if (data.status === 'paired') {
            setQrStatus('paired');
            onRefreshDevices();
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          } else if (data.isExpired) {
            setQrStatus('expired');
          }
        }
      } catch (err) {
        console.warn('Poll error:', err);
      }
    }, 2500);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [pairingToken, qrStatus]);

  const fetchNewPairingSession = async () => {
    setIsQrLoading(true);
    setQrStatus('active');
    setPairingToken(null);
    setQrPayload(null);

    try {
      const res = await fetch('/api/zion/devices/generate-qr', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPairingToken(data.token);
        setQrPayload(data.qrPayload);
        setRemainingSeconds(data.remainingSeconds || 60);
      }
    } catch (err) {
      console.warn('Pairing session notice:', err);
    } finally {
      setIsQrLoading(false);
    }
  };

  const fetchWhatsAppStatus = async () => {
    setIsWaChecking(true);
    try {
      const res = await fetch('/api/whatsapp/health');
      const data = await res.json();
      setWaStatus(data);
      setWaHealth(data.healthCheck);
    } catch (err) {
      console.warn('WhatsApp status fetch error:', err);
    } finally {
      setIsWaChecking(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#070518] text-slate-900 dark:text-slate-100 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 shadow-sm">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-6 h-6 text-purple-600" />
              <span>Linked Devices & Integrations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Securely pair companion web browsers or inspect official WhatsApp integrations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScanner}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Scan QR with Camera</span>
            </button>
          </div>
        </div>

        {/* Integration Mode Switcher */}
        <div className="flex border-b border-purple-200 dark:border-purple-900 text-xs font-black tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('zionPairing')}
            className={`py-3 px-5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'zionPairing'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-[#0B0826] rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>ZION Device Linking (Live QR)</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsappOfficial')}
            className={`py-3 px-5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'whatsappOfficial'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-[#0B0826] rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Official WhatsApp Cloud Status</span>
          </button>
        </div>

        {/* TAB 1: ZION LIVE QR CODE PAIRING */}
        {activeTab === 'zionPairing' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: QR Code Display Card */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 shadow-sm flex flex-col items-center text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2">
                Live Pairing Session
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                Scan to Link Another Device
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs">
                Open ZION on your other phone or tablet and tap "Scan QR with Camera".
              </p>

              {/* QR Canvas Box */}
              <div className="relative p-4 bg-white rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-md">
                {isQrLoading ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    <span className="text-xs font-bold text-slate-500">Generating live QR...</span>
                  </div>
                ) : qrStatus === 'expired' ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-500" />
                    <span className="text-xs font-bold text-slate-700">QR Code Expired</span>
                    <button
                      onClick={fetchNewPairingSession}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-purple-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Code</span>
                    </button>
                  </div>
                ) : qrStatus === 'paired' ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                    <span className="text-xs font-black text-emerald-800">Device Linked!</span>
                    <button
                      onClick={fetchNewPairingSession}
                      className="text-[11px] font-bold text-purple-700 underline"
                    >
                      Generate New Code
                    </button>
                  </div>
                ) : qrPayload ? (
                  <div className="flex flex-col items-center">
                    <QRCodeSVG
                      value={qrPayload}
                      size={208}
                      level="H"
                      includeMargin={false}
                      fgColor="#0B0826"
                    />
                  </div>
                ) : null}
              </div>

              {/* Countdown Bar */}
              {qrStatus === 'active' && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    Expires in <strong className="font-mono text-purple-600">{remainingSeconds}s</strong>
                  </span>
                  <button
                    onClick={fetchNewPairingSession}
                    className="p-1 text-slate-400 hover:text-purple-600 rounded transition-colors ml-1"
                    title="Refresh Now"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Token Snippet */}
              {pairingToken && (
                <div className="mt-3 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[10px] font-mono text-purple-700 dark:text-purple-300 max-w-xs truncate">
                  Token: {pairingToken}
                </div>
              )}
            </div>

            {/* Right Column: Currently Linked Devices List */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Linked Devices ({devices.length})
                  </h4>
                  <button
                    onClick={onRefreshDevices}
                    className="p-1 text-slate-400 hover:text-purple-600 rounded transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-purple-900/60 bg-slate-50 dark:bg-purple-950/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                          {device.platform.includes('Mobile') ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <Laptop className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {device.name}
                            </span>
                            {device.id === 'device-current' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                This Device
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {device.platform} • {device.lastActive}
                          </p>
                        </div>
                      </div>

                      {device.id !== 'device-current' && (
                        <button
                          onClick={() => onUnlinkDevice(device.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Unlink Device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-purple-950 dark:text-purple-200 block">
                    Zero-Trust QR Authentication
                  </span>
                  <p className="text-purple-900/80 dark:text-purple-300/80 leading-relaxed text-[11.5px]">
                    ZION never displays simulated connections. Pairing tokens are single-use, digitally stamped, and time-bounded to 60 seconds with instant cryptographic invalidation upon handoff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICIAL WHATSAPP CLOUD INTEGRATION */}
        {activeTab === 'whatsappOfficial' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block">
                  Meta Graph API v22.0
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Official WhatsApp Business Cloud Service
                </h3>
              </div>
              <button
                onClick={fetchWhatsAppStatus}
                disabled={isWaChecking}
                className="px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-50 dark:hover:bg-purple-950"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isWaChecking ? 'animate-spin' : ''}`} />
                <span>Live Health Check</span>
              </button>
            </div>

            {/* Live Connection Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                waStatus?.state === 'CONNECTED'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-950 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {waStatus?.state === 'CONNECTED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
                <div>
                  <span className="font-black text-sm block">
                    Connection State: {waStatus?.state || 'DISCONNECTED'}
                  </span>
                  <span className="text-xs">
                    {waStatus?.state === 'CONNECTED'
                      ? 'Verified Meta Graph API token active. Messages sync bi-directionally.'
                      : 'Live WhatsApp credentials not active or awaiting configuration in environment variables.'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-white/80 dark:bg-black/40 font-bold">
                {waStatus?.verifiedDetails?.displayPhoneNumber || 'No Active Phone'}
              </span>
            </div>

            {/* Environment Variables Requirement Table */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Required Server Environment Variables
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                {[
                  {
                    name: 'WHATSAPP_PHONE_NUMBER',
                    desc: 'Meta Phone Number ID (e.g. 5240183920194)',
                    status: waStatus?.envValidation?.variables?.phoneNumber?.isConfigured,
                  },
                  {
                    name: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
                    desc: 'Meta WhatsApp Business Account WABA ID',
                    status: waStatus?.envValidation?.variables?.wabaId?.isConfigured,
                  },
                  {
                    name: 'WHATSAPP_ACCESS_TOKEN',
                    desc: 'System User Permanent Access Token with whatsapp_business_messaging scope',
                    status: waStatus?.envValidation?.variables?.accessToken?.isConfigured,
                  },
                  {
                    name: 'WHATSAPP_WEBHOOK_VERIFY_TOKEN',
                    desc: 'Webhook subscription verification string for Meta callbacks',
                    status: waStatus?.envValidation?.variables?.webhookVerifyToken?.isConfigured,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between bg-white dark:bg-[#0B0826]"
                  >
                    <div>
                      <span className="font-mono font-bold text-purple-700 dark:text-purple-300 block">
                        {item.name}
                      </span>
                      <span className="text-slate-500 text-[11px]">{item.desc}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.status ? 'Configured' : 'Missing in .env'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
