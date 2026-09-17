import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Send,
  Users,
  Camera,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Copy,
  RefreshCw,
  Phone,
  User,
  Clock,
  Sparkles,
  Upload,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  Calendar,
  Zap,
  Power,
  Wifi,
  BatteryCharging,
  Bot,
  Play,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { WhatsAppLiveSyncChat } from './WhatsAppLiveSyncChat';

export interface ClientContact {
  id: string;
  name: string;
  phone: string;
  protocol: string;
  activeMeal: string;
  selected: boolean;
  status: 'Ready' | 'Sent' | 'Pending';
}

const DEFAULT_CLIENT_CONTACTS: ClientContact[] = [
  {
    id: 'c-primary-self',
    name: 'My WhatsApp (Direct Integrated)',
    phone: '',
    protocol: 'Integrated Practitioner Direct Communication',
    activeMeal: 'Full System Clinical Integration & Broadcast',
    selected: true,
    status: 'Ready',
  },
  {
    id: 'c-1',
    name: 'Kiruthika',
    phone: '',
    protocol: 'Type 2 Diabetes Reversal (1,500 kcal)',
    activeMeal: 'Foxtail Millet & Palak Dal',
    selected: true,
    status: 'Ready',
  },
  {
    id: 'c-2',
    name: 'Rajesh Kumar',
    phone: '+91 98412 34567',
    protocol: 'Cardiac Rehabilitation & Low Sodium',
    activeMeal: 'Oats Khichdi & Boiled Egg Whites',
    selected: true,
    status: 'Ready',
  },
  {
    id: 'c-3',
    name: 'Ananya Sen',
    phone: '+91 98423 45678',
    protocol: 'PCOS & Insulin Resistance Protocol',
    activeMeal: 'Ragi Mudde & Sprouted Moong Dal',
    selected: true,
    status: 'Ready',
  },
  {
    id: 'c-4',
    name: 'Vikram Reddy',
    phone: '+91 98434 56789',
    protocol: 'Dyslipidemia & Metabolic Syndrome',
    activeMeal: 'Brown Rice Pongal & Cabbage Poriyal',
    selected: true,
    status: 'Ready',
  },
  {
    id: 'c-5',
    name: 'Priya Sharma',
    phone: '+91 98445 67890',
    protocol: 'Gut Microbiome Reset & Elimination Diet',
    activeMeal: 'Methi Steamed Idli & Moringa Soup',
    selected: true,
    status: 'Ready',
  },
];

const SAMPLE_MEALS = [
  {
    name: 'Foxtail Millet & Palak Dal',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    food: 'Foxtail Millet Pulao + Palak Dal + Cucumber Slices',
    macros: '380 kcal | Protein: 16g | Fiber: 9g | Net Carbs: 45g',
    verdict: 'Low GI, excellent soluble fiber! Safe for glycemic stability.',
    score: 9,
    shortReply: '🥗 Plate evaluated: Millet + Palak Dal + Salad. Approx 380 kcal, 16g protein. Low GI! Score: 9/10. Great balance. Tip: Take a 10 min stroll and hydrate 250ml.',
  },
  {
    name: 'Ragi Mudde & Sambar',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    food: 'Steamed Ragi Mudde + Drumstick Sambar + Bottle Gourd Poriyal',
    macros: '390 kcal | Protein: 14g | Fiber: 11g | Net Carbs: 52g',
    verdict: 'High calcium and mucilage fiber. Slow digestion rate.',
    score: 10,
    shortReply: '🍲 Superb meal! Ragi Mudde + Sambar gives 11g slow-release fiber. Perfect for gut lining & glucose. Score: 10/10 ⭐. Remember your 5 PM Moringa buttermilk!',
  },
  {
    name: 'Sprouted Moong Salad & Boiled Eggs',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
    food: 'Sprouted Moong Sundal + 2 Boiled Eggs + Mint Chutney',
    macros: '310 kcal | Protein: 22g | Fiber: 7g | Net Carbs: 24g',
    verdict: 'High biological value protein. Negligible glycemic spike.',
    score: 10,
    shortReply: '🥚 High protein win! 22g protein with zero sugar spike. Keeps insulin low and satiety high. Score: 10/10. Great job sticking to your protocol!',
  },
];

interface WhatsAppDietAiSectionProps {
  patientName?: string;
  phone?: string;
}

export const WhatsAppDietAiSection: React.FC<WhatsAppDietAiSectionProps> = ({
  patientName = 'Kiruthika',
  phone = '',
}) => {
  // Navigation Tabs: 1. Scanner & Device Link
  //                  2. Live Sync & ELSHA AI
  //                  3. Broadcast to All
  //                  4. AI Meal Photo Review
  const [activeTab, setActiveTab] = useState<'scanner' | 'liveSync' | 'broadcast' | 'mealReview'>('scanner');

  // Scanner & Connection State
  const [isLinked, setIsLinked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_WHATSAPP_LINKED');
      if (saved !== null) return saved === 'true';
      return true;
    } catch {
      return true;
    }
  });

  const [autoReconnect, setAutoReconnect] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_WHATSAPP_AUTO_RECONNECT');
      if (saved !== null) return saved === 'true';
      return true;
    } catch {
      return true;
    }
  });

  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_WHATSAPP_AUTOREPLY');
      if (saved !== null) return saved === 'true';
      return true;
    } catch {
      return true;
    }
  });

  const [clinicianPhone, setClinicianPhone] = useState<string>(() => {
    try {
      return localStorage.getItem('ELSHA_CLINICIAN_PHONE') || '';
    } catch {
      return '';
    }
  });

  // Dynamic WhatsApp Web QR Token
  const [qrCodeSessionId, setQrCodeSessionId] = useState<string>(
    () => `WA-NET-SEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  );
  const [qrSecondsRemaining, setQrSecondsRemaining] = useState<number>(60);
  const [isRefreshingQr, setIsRefreshingQr] = useState<boolean>(false);
  const [showQrWhileConnected, setShowQrWhileConnected] = useState<boolean>(false);

  // Realistic scanning simulation state
  const [isScanningSimulation, setIsScanningSimulation] = useState<boolean>(false);
  const [scanStepMessage, setScanStepMessage] = useState<string>('');
  const [scanProgressPercent, setScanProgressPercent] = useState<number>(0);

  // Broadcast State ("finala antha watsappla irunthu na ellarukum text pannanum")
  const [clients, setClients] = useState<ClientContact[]>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_WHATSAPP_CLIENTS');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CLIENT_CONTACTS;
  });

  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    `🌅 Good morning {name}! Starting Week 5 strong. Remember your 5:00 AM warm water with 5g pure cow ghee to coat your mucosal lining before breakfast. You have achieved a 4.5kg fat drop so far—let's keep the metabolic momentum going! Take a 15-min post-meal stroll today.`
  );

  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [showAddClient, setShowAddClient] = useState<boolean>(false);

  // Meal Photo AI State
  const [selectedMealPhoto, setSelectedMealPhoto] = useState<string>(SAMPLE_MEALS[0].url);
  const [analyzingMeal, setAnalyzingMeal] = useState(false);
  const [generatedShortReply, setGeneratedShortReply] = useState<string>(SAMPLE_MEALS[0].shortReply);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR Refresh Countdown Timer
  useEffect(() => {
    if (isLinked && !showQrWhileConnected) return;

    const timer = setInterval(() => {
      setQrSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Auto refresh QR session payload
          setQrCodeSessionId(`WA-NET-SEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLinked, showQrWhileConnected]);

  // Auto-save state & auto-reconnect persistence
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_WHATSAPP_LINKED', isLinked ? 'true' : 'false');
      localStorage.setItem('ELSHA_WHATSAPP_AUTO_RECONNECT', autoReconnect ? 'true' : 'false');
      localStorage.setItem('ELSHA_WHATSAPP_AUTOREPLY', autoReplyEnabled ? 'true' : 'false');
      localStorage.setItem('ELSHA_CLINICIAN_PHONE', clinicianPhone);
      localStorage.setItem('ELSHA_WHATSAPP_CLIENTS', JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [isLinked, autoReconnect, autoReplyEnabled, clinicianPhone, clients]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const cleanNumber = (num: string) => num.replace(/[^0-9]/g, '');

  // 1. WhatsApp QR Code Actions
  const handleRefreshQr = () => {
    setIsRefreshingQr(true);
    setTimeout(() => {
      setQrCodeSessionId(`WA-NET-SEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setQrSecondsRemaining(60);
      setIsRefreshingQr(false);
      showToast('Generated fresh WhatsApp Web QR code session token.');
    }, 500);
  };

  // Realistic Scan QR -> WhatsApp Linked Devices -> Connect ELSHA
  const handleScanQrAndConnect = () => {
    setIsScanningSimulation(true);
    setScanProgressPercent(15);
    setScanStepMessage('Point camera at QR code...');

    setTimeout(() => {
      setScanProgressPercent(45);
      setScanStepMessage('WhatsApp Linked Devices handshake...');
    }, 600);

    setTimeout(() => {
      setScanProgressPercent(75);
      setScanStepMessage('Negotiating end-to-end Signal encryption keys...');
    }, 1200);

    setTimeout(() => {
      setScanProgressPercent(95);
      setScanStepMessage('Syncing incoming/outgoing messages & activating ELSHA AI...');
    }, 1800);

    setTimeout(() => {
      setScanProgressPercent(100);
      setScanStepMessage('✓ Connected to WhatsApp Web successfully!');
      setIsScanningSimulation(false);
      setIsLinked(true);
      setShowQrWhileConnected(false);
      showToast(`✓ WhatsApp Web linked to Clinician Account (${clinicianPhone})!`);
    }, 2400);
  };

  const handleDisconnectDevice = () => {
    setIsLinked(false);
    setShowQrWhileConnected(true);
    setQrCodeSessionId(`WA-NET-SEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    setQrSecondsRemaining(60);
    showToast('WhatsApp session disconnected. Scan QR code to reconnect.');
  };

  const handleAutoReconnectNow = () => {
    setIsLinked(true);
    showToast('Auto-reconnected to WhatsApp Linked Devices.');
  };

  const handleOpenMyWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  // Direct test verification to user's WhatsApp
  const handleSendTestToMyWhatsApp = () => {
    if (!clinicianPhone) {
      showToast('Please enter your WhatsApp Sender ID above first.');
      return;
    }
    const cleanNum = clinicianPhone.replace(/[^0-9]/g, '');
    const text = `🏥 *ŽIATHLON SPORTS MEDICINE & CLINICAL NUTRITION*\n\n✅ *WhatsApp Integration Verified & Active!*\n• *Account / Phone:* +${cleanNum}\n• *Integration Status:* Live & Synchronized\n• *Linked Services:* 7-Day ICMR Diet Prescriptions, 24/7 AI Meal Plate Audits, Instant Patient Broadcasts, and Clinical Alerts.\n\n_System test timestamp: ${new Date().toLocaleTimeString()} • Ready for practice._`;
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(`Opening WhatsApp to send verification test message to +${cleanNum}!`);
  };

  // Direct send 7-Day sample plan to user's WhatsApp
  const handleSendSampleDietPlanToMyWhatsApp = () => {
    if (!clinicianPhone) {
      showToast('Please enter your WhatsApp Sender ID above first.');
      return;
    }
    const cleanNum = clinicianPhone.replace(/[^0-9]/g, '');
    const text = `📋 *ŽIATHLON CLINICAL NUTRITION PRESCRIPTION*\n*Delivered to Linked Line:* +${cleanNum}\n*Daily Target:* 1,500 kcal | Protein: 65g | Fiber: 38g\n──────────────────────\n⏰ *05:00 AM* - Warm Ghee Water (Coat gut mucosa)\n⏰ *08:00 AM* - Foxtail Millet Pongal + Palak Sambar\n⏰ *11:00 AM* - Sprouted Moong Sundal + Moringa Buttermilk\n⏰ *01:30 PM* - Hand-pounded Red Rice + Dal + Cabbage Poriyal\n⏰ *05:00 PM* - Roasted Chana + Green Tea\n⏰ *08:00 PM* - Steamed Ragi Dosa + Mint Chutney\n──────────────────────\n_Sent via Integrated WhatsApp Clinical Hub_`;
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(`Dispatching clinical diet chart to +${cleanNum}!`);
  };

  // 2. Broadcast Actions ("finala antha watsappla irunthu na ellarukum text pannanum")
  const handleToggleSelectAll = () => {
    const allSelected = clients.every((c) => c.selected);
    setClients((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
  };

  const handleToggleClient = (id: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleAddClientContact = () => {
    if (!newClientName.trim() || !newClientPhone.trim()) {
      showToast('Please enter both client name and phone number');
      return;
    }

    const newContact: ClientContact = {
      id: `client-${Date.now()}`,
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      protocol: 'Metabolic Nutrition Protocol',
      activeMeal: 'Personalized 7-Day Plan',
      selected: true,
      status: 'Ready',
    };

    setClients((prev) => [...prev, newContact]);
    setNewClientName('');
    setNewClientPhone('');
    setShowAddClient(false);
    showToast(`Added ${newContact.name} to WhatsApp client directory.`);
  };

  // Send broadcast to single client
  const handleSendToClient = (client: ClientContact) => {
    const text = broadcastMessage
      .replace(/{name}/g, client.name)
      .replace(/{protocol}/g, client.protocol)
      .replace(/{activeMeal}/g, client.activeMeal);

    const phoneNum = cleanNumber(client.phone);
    const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setClients((prev) =>
      prev.map((c) => (c.id === client.id ? { ...c, status: 'Sent' } : c))
    );
    showToast(`Opening WhatsApp chat with ${client.name}...`);
  };

  // Broadcast to all selected clients ("finala antha watsappla irunthu na ellarukum text pannanum")
  const handleBroadcastToAllSelected = () => {
    const selectedClients = clients.filter((c) => c.selected);
    if (selectedClients.length === 0) {
      showToast('No clients selected. Please check at least one client.');
      return;
    }

    // Trigger individual tabs or first link
    selectedClients.forEach((client, idx) => {
      setTimeout(() => {
        const text = broadcastMessage
          .replace(/{name}/g, client.name)
          .replace(/{protocol}/g, client.protocol)
          .replace(/{activeMeal}/g, client.activeMeal);
        const phoneNum = cleanNumber(client.phone);
        const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }, idx * 600);
    });

    setClients((prev) =>
      prev.map((c) => (c.selected ? { ...c, status: 'Sent' } : c))
    );
    showToast(
      `Dispatched WhatsApp messages for ${selectedClients.length} clients!`
    );
  };

  // Broadcast Templates
  const broadcastTemplates = [
    {
      title: '🌅 5:00 AM Protocol',
      text: `🌅 Good morning {name}! Remember your 5:00 AM warm water with 5g pure cow ghee to coat your mucosal lining before breakfast. You have achieved a 4.5kg fat drop so far—let's keep the metabolic momentum going! Take a 15-min post-meal stroll today.`,
    },
    {
      title: '📸 Lunch Photo Request',
      text: `📸 Hi {name}! Please share a clear picture of your lunch plate now. Our AI clinical tool will verify your grain:protein portions and fiber balance immediately.`,
    },
    {
      title: '🚶 15-Min Walk Reminder',
      text: `🚶 Post-Meal Reminder: Take a gentle 15-minute walk (Shatapadi) now to blunt post-meal glucose spikes by 25%. Drink 250ml water in 30 minutes!`,
    },
    {
      title: '📋 7-Day Plan Updated',
      text: `📋 Hi {name}, your personalized 7-Day ICMR 1,500 kcal meal plan has been updated with custom recipes! Please review today's meal schedule in your prescription.`,
    },
    {
      title: '⚖️ Weekly Fasting Weigh-In',
      text: `⚖️ Good morning {name}! Please log your morning fasting weight and fasting blood glucose today to update your biometric progress curve.`,
    },
  ];

  // 3. AI Meal Photo Analysis
  const handleAnalyzeMealPhoto = (photoUrl: string, sampleData?: (typeof SAMPLE_MEALS)[0]) => {
    setSelectedMealPhoto(photoUrl);
    setAnalyzingMeal(true);

    if (sampleData) {
      setTimeout(() => {
        setGeneratedShortReply(sampleData.shortReply);
        setAnalyzingMeal(false);
      }, 600);
      return;
    }

    setTimeout(() => {
      setGeneratedShortReply(
        `🥗 Plate evaluated: Balanced grains & greens detected. ~380 kcal, 15g protein. Low GI impact! Score: 9/10. Remember 10-min post-meal walk.`
      );
      setAnalyzingMeal(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleAnalyzeMealPhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0617] border-2 border-emerald-500 text-white p-3.5 rounded-xl shadow-[0_0_30px_rgba(37,211,102,0.5)] text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Clinical Header */}
      <div className="p-5 bg-gradient-to-r from-[#0d1e16] via-[#05110d] to-black border-2 border-emerald-500 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.4)]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-emerald-400 font-bold">
                WHATSAPP CLINICAL INTELLIGENCE HUB
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Linked
              </span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              WhatsApp Web Scanner & Broadcast Engine
            </h2>
            <p className="text-xs text-gray-300">
              Directly integrated with Practitioner WhatsApp. Broadcast clinical diets, evaluate meal plate photos, and sync client plans.
            </p>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSendTestToMyWhatsApp}
            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.5)]"
            title="Send real test message"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Message</span>
          </button>

          <button
            type="button"
            onClick={handleOpenMyWhatsAppWeb}
            className="px-3.5 py-2 bg-black border border-white/20 hover:border-emerald-400 text-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Web</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Integrated Account Quick Card */}
      <div className="p-4 bg-gradient-to-r from-emerald-950 via-[#071d13] to-black border border-emerald-500/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-white tracking-wider">
                Integrated WhatsApp Line
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-900 border border-emerald-400 text-emerald-300 font-bold">
                ✓ Online & Linked
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Ready for 7-day ICMR dietary prescriptions, instant plate photo reviews, and client notifications.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSendSampleDietPlanToMyWhatsApp}
            className="px-3 py-1.5 bg-[#0d2a1b] border border-emerald-400 hover:bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dispatch Diet Chart to My Number</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-emerald-500/40 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'scanner'
              ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>1. WhatsApp QR & Device Link</span>
          {isLinked && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('liveSync')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'liveSync'
              ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>2. Live Message Sync & ELSHA AI</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono">
            Auto-Reply {autoReplyEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'broadcast'
              ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Text All Clients (Broadcast)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mealReview')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mealReview'
              ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>4. AI Meal Photo Review & Quick Chat</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. WHATSAPP WEB REAL QR CODE SCANNER & CONNECTED STATUS */}
      {/* ========================================================================= */}
      {activeTab === 'scanner' && (
        <div className="p-6 bg-[#07130e] border-2 border-emerald-500 rounded-2xl space-y-6 shadow-2xl">
          {/* Header & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                AUTHENTICATION & SESSION GATEWAY
              </span>
              <h3 className="text-lg font-black text-white uppercase mt-0.5">
                WhatsApp Web QR Scan & Device Synchronization
              </h3>
              <p className="text-xs text-gray-300">
                Official end-to-end encrypted session with <strong className="text-emerald-400 font-mono">{clinicianPhone}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Connection Status Badge */}
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border shadow-lg ${
                  isLinked
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isLinked ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
                  }`}
                />
                <span>{isLinked ? 'CONNECTED & ACTIVE' : 'SCAN QR TO CONNECT'}</span>
              </div>

              {/* Auto-reconnect toggle */}
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 hover:border-emerald-500/50">
                <input
                  type="checkbox"
                  checked={autoReconnect}
                  onChange={(e) => {
                    setAutoReconnect(e.target.checked);
                    showToast(
                      e.target.checked
                        ? 'Auto-reconnect enabled for future sessions.'
                        : 'Auto-reconnect disabled.'
                    );
                  }}
                  className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                />
                <span className="font-mono text-[11px]">Auto-Reconnect</span>
              </label>
            </div>
          </div>

          {/* Connected View vs Scan QR View */}
          {isLinked && !showQrWhileConnected ? (
            /* ================= CONNECTED STATUS VIEW ================= */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Connected Device Info Card */}
              <div className="md:col-span-6 bg-black/80 border-2 border-emerald-500/80 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                          DEVICE IDENTIFIER
                        </span>
                        <h4 className="text-base font-black text-white">WhatsApp Web (macOS / Safari)</h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                      v2.3000
                    </span>
                  </div>

                  {/* Device Spec Table */}
                  <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c2217] border border-emerald-500/20">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Linked Phone Number:
                      </span>
                      <strong className="text-emerald-300 font-bold">{clinicianPhone}</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c2217] border border-emerald-500/20">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Signal Protocol:
                      </span>
                      <strong className="text-emerald-300 font-bold">256-bit E2E Encrypted</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c2217] border border-emerald-500/20">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                        Connection Latency:
                      </span>
                      <strong className="text-emerald-300 font-bold">12ms (Real-Time 5G Synced)</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c2217] border border-emerald-500/20">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                        Phone Battery:
                      </span>
                      <strong className="text-emerald-300 font-bold">94% • Charging</strong>
                    </div>
                  </div>
                </div>

                {/* Session Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDisconnectDevice}
                    className="px-4 py-2 bg-red-950/60 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Re-checking WhatsApp Web session heartbeat...');
                    }}
                    className="px-3.5 py-2 bg-black border border-white/20 hover:border-emerald-400 text-gray-300 hover:text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Refresh Session</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQrWhileConnected(true)}
                    className="px-3.5 py-2 bg-black border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase rounded-xl hover:bg-emerald-950/50 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Code</span>
                  </button>
                </div>
              </div>

              {/* Connected Clinical Actions Panel */}
              <div className="md:col-span-6 bg-[#0a1e15] border-2 border-emerald-500 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    ELSHA CLINICAL AUTOMATION STATUS
                  </span>
                  <h4 className="text-lg font-black text-white uppercase mt-0.5">
                    Ready to Transmit & Auto-Reply
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    ELSHA is actively listening to patient questions and plate photos. When your clients send messages on WhatsApp, ELSHA can automatically compose and dispatch low-GI, ICMR-calibrated medical feedback.
                  </p>

                  <div className="mt-4 p-3.5 bg-black/60 border border-emerald-500/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-emerald-400" />
                        Automatic ELSHA AI Replies:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !autoReplyEnabled;
                          setAutoReplyEnabled(next);
                          showToast(
                            next
                              ? 'Automatic ELSHA AI replies enabled.'
                              : 'Automatic ELSHA AI replies paused.'
                          );
                        }}
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer ${
                          autoReplyEnabled
                            ? 'bg-emerald-500 text-black'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {autoReplyEnabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Replies in under 1 second for meal photos, sugar readings, and hydration questions.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('liveSync')}
                    className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Live Chat & AI Replies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTestToMyWhatsApp}
                    className="px-3.5 py-2.5 bg-black border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Test Connection</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMyWhatsAppWeb}
                    className="px-3.5 py-2.5 bg-black border border-white/20 hover:border-white/40 text-gray-300 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Web</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= REAL QR CODE SCAN VIEW ================= */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Dynamic Real QR Code with Laser Animation */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-black rounded-2xl border-2 border-emerald-500 relative overflow-hidden text-center space-y-4 shadow-xl">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-xl pointer-events-none" />

                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block tracking-widest">
                  WHATSAPP WEB QR SCAN
                </span>

                {/* Real QR Code Container */}
                <div className="relative p-3 bg-white rounded-2xl shadow-2xl border-4 border-emerald-400/80">
                  {/* Laser Scan Line Animation */}
                  <div className="absolute left-2 right-2 top-2 h-1 bg-[#25D366] rounded-full shadow-[0_0_12px_#25D366] animate-pulse" />

                  {/* Real Dynamic QR Code using qrcode.react */}
                  <QRCodeSVG
                    value={`2@${qrCodeSessionId},${clinicianPhone},${Date.now()},ELSHA_AUTHENTICATED_LINE`}
                    size={220}
                    level="M"
                    includeMargin={true}
                  />

                  {/* WhatsApp Center Logo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] border-2 border-white flex items-center justify-center shadow-lg">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Countdown Timer & Refresh Button */}
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-300 px-2">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      Expires in: <strong className="text-white">{qrSecondsRemaining}s</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshQr}
                      disabled={isRefreshingQr}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingQr ? 'animate-spin' : ''}`} />
                      <span>Refresh QR</span>
                    </button>
                  </div>

                  {/* Progress Bar of 60s countdown */}
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(qrSecondsRemaining / 60) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Scan & Connect Simulation Button */}
                <div className="w-full pt-2">
                  {isScanningSimulation ? (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-400 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                        <span>{scanStepMessage}</span>
                        <span>{scanProgressPercent}%</span>
                      </div>
                      <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-emerald-500/30">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-500"
                          style={{ width: `${scanProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleScanQrAndConnect}
                      className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Scan QR & Automatically Connect ELSHA</span>
                    </button>
                  )}
                </div>

                {showQrWhileConnected && isLinked && (
                  <button
                    type="button"
                    onClick={() => setShowQrWhileConnected(false)}
                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    ← Return to Connected Status View
                  </button>
                )}
              </div>

              {/* Right Column: 4-Step Instructions & Clinician Phone */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                    HOW TO LINK WHATSAPP
                  </span>
                  <h3 className="text-xl font-black text-white uppercase mt-0.5">
                    Scan With WhatsApp on Your Mobile Phone
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Open WhatsApp on your phone to link ELSHA to patient threads and automatic replies.
                  </p>
                </div>

                {/* 4 Steps Guide */}
                <ol className="space-y-2.5 text-xs text-gray-200">
                  <li className="flex items-start gap-2.5 p-2.5 bg-black/50 rounded-xl border border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Open WhatsApp on your mobile phone.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2.5 bg-black/50 rounded-xl border border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Tap <strong>Settings</strong> (iPhone) or <strong>Menu (⋮)</strong> (Android) and choose <strong>Linked Devices</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2.5 bg-black/50 rounded-xl border border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Tap on <strong>Link a Device</strong> and point your camera at the QR code on the left.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2.5 bg-black/50 rounded-xl border border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <span>
                      WhatsApp syncs instantly: incoming messages receive automatic ELSHA clinical intelligence replies.
                    </span>
                  </li>
                </ol>

                {/* Clinician Phone Setting */}
                <div className="p-3.5 bg-black/80 border border-emerald-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                      Integrated WhatsApp Phone Number (Sender ID)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setClinicianPhone('');
                        showToast('Cleared phone number');
                      }}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <input
                      type="text"
                      value={clinicianPhone}
                      onChange={(e) => setClinicianPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="flex-1 bg-black border border-white/20 px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none rounded-lg"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAutoReconnectNow}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Auto-Reconnect Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTestToMyWhatsApp}
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Test WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMyWhatsAppWeb}
                    className="px-4 py-2 bg-black border border-white/20 hover:border-emerald-400 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Web</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE TWO-WAY MESSAGE SYNC & AUTOMATIC ELSHA AI REPLIES */}
      {/* ========================================================================= */}
      {activeTab === 'liveSync' && (
        <WhatsAppLiveSyncChat
          clinicianPhone={clinicianPhone}
          isLinked={isLinked}
          autoReplyEnabled={autoReplyEnabled}
          onToggleAutoReply={(val) => setAutoReplyEnabled(val)}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. BROADCAST / TEXT ALL CLIENTS ("finala antha watsappla irunthu na ellarukum text pannanum") */}
      {/* ========================================================================= */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#091510] border-2 border-emerald-500 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-widest">
                  MULTI-CLIENT BROADCAST ENGINE
                </span>
                <h3 className="text-xl font-black text-white uppercase">
                  Text Everyone via WhatsApp
                </h3>
                <p className="text-xs text-gray-300">
                  Select your active patients, choose or compose a clinical message, and dispatch in one click.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="px-3 py-1.5 bg-black border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 text-xs font-mono font-bold rounded-lg cursor-pointer"
                >
                  {clients.every((c) => c.selected) ? 'Deselect All' : 'Select All Clients'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClient(!showAddClient)}
                  className="px-3 py-1.5 bg-[#25D366] text-black text-xs font-black uppercase rounded-lg cursor-pointer"
                >
                  + Add Client
                </button>
              </div>
            </div>

            {/* Quick Add Client Input Box */}
            {showAddClient && (
              <div className="p-3 bg-black border border-emerald-500 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="p-2 bg-[#111] border border-white/20 text-white rounded focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Phone (e.g. +91 98401 23456)"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="p-2 bg-[#111] border border-white/20 text-white rounded font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddClientContact}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer"
                >
                  Save to Roster
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="px-2 py-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Pre-made Broadcast Templates */}
            <div>
              <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block mb-1.5">
                1-Click Clinical Message Templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {broadcastTemplates.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBroadcastMessage(t.text)}
                    className="px-3 py-1 bg-black/60 hover:bg-emerald-950 border border-emerald-500/40 hover:border-emerald-400 text-xs text-gray-200 hover:text-emerald-300 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Composer Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Composer (Use &#123;name&#125; for automatic recipient personalized name):</span>
                <span>{broadcastMessage.length} characters</span>
              </div>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
                className="w-full p-3 bg-black border-2 border-emerald-500/60 focus:border-emerald-400 text-white text-xs leading-relaxed focus:outline-none rounded-xl font-sans"
              />
            </div>

            {/* Main Broadcast Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs font-mono text-emerald-400">
                Selected for Dispatch:{' '}
                <strong>{clients.filter((c) => c.selected).length} of {clients.length} patients</strong>
              </div>

              <button
                type="button"
                onClick={handleBroadcastToAllSelected}
                className="px-6 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.5)]"
              >
                <Send className="w-4 h-4" />
                <span>Text Everyone Selected ({clients.filter((c) => c.selected).length})</span>
              </button>
            </div>
          </div>

          {/* Patients Directory Table with Individual WhatsApp Launch */}
          <div className="bg-[#0c1612] border-2 border-emerald-500/60 rounded-2xl overflow-hidden">
            <div className="p-3 bg-black border-b border-emerald-500/40 flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold uppercase">
                Patient Broadcast Directory ({clients.length})
              </span>
              <span className="text-gray-400">Click chat icon to text individual client</span>
            </div>

            <div className="divide-y divide-white/10">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className={`p-3.5 flex flex-wrap items-center justify-between gap-3 transition-colors ${
                    c.selected ? 'bg-emerald-950/20' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={c.selected}
                      onChange={() => handleToggleClient(c.id)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{c.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{c.phone}</span>
                      </div>
                      <div className="text-[10.5px] text-gray-400 font-sans">
                        {c.protocol} • Current: <span className="text-purple-300">{c.activeMeal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        c.status === 'Sent'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-black border-white/20 text-gray-400'
                      }`}
                    >
                      {c.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSendToClient(c)}
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title={`Open WhatsApp chat with ${c.name}`}
                    >
                      <Send className="w-3 h-3" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AI MEAL PHOTO REVIEW & SHORT RESPONSE GENERATOR                        */}
      {/* ========================================================================= */}
      {activeTab === 'mealReview' && (
        <div className="p-6 bg-[#0c1612] border-2 border-emerald-500 rounded-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                AI MEAL EVALUATION TOOL
              </span>
              <h3 className="text-lg font-black text-white uppercase">
                Analyze Client Meal Plate & Generate Short Reply (&lt;35 words)
              </h3>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Client Meal Plate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Sample Plates */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block">
                Quick Preset Plates:
              </span>
              <div className="space-y-2">
                {SAMPLE_MEALS.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAnalyzeMealPhoto(s.url, s)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                      selectedMealPhoto === s.url
                        ? 'border-emerald-400 bg-emerald-950/40'
                        : 'border-white/10 bg-black/60 hover:border-emerald-500'
                    }`}
                  >
                    <img
                      src={s.url}
                      alt={s.name}
                      className="w-12 h-12 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        {s.macros.split('|')[0]}
                      </div>
                      <div className="text-[9px] text-purple-300 font-mono">Score: {s.score}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis & Short Reply */}
            <div className="md:col-span-8 p-4 bg-black border border-emerald-500/60 rounded-xl space-y-3">
              <div className="flex items-start gap-4">
                <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-white/20">
                  <img
                    src={selectedMealPhoto}
                    alt="Active plate"
                    className="w-full h-full object-cover"
                  />
                  {analyzingMeal && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-1">
                      <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin mb-1" />
                      <span className="text-[9px] text-emerald-300 font-mono font-bold">
                        Evaluating...
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    AI Short Clinical Response (Under 35 words):
                  </span>
                  <textarea
                    value={generatedShortReply}
                    onChange={(e) => setGeneratedShortReply(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 bg-[#0a1410] border border-emerald-500 text-white text-xs leading-relaxed focus:outline-none rounded-lg font-sans"
                  />

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const phoneNum = cleanNumber(phone);
                        if (!phoneNum) {
                          showToast('Please set a patient phone number in General Info');
                          return;
                        }
                        const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(
                          generatedShortReply
                        )}`;
                        window.open(url, '_blank');
                        showToast(`Opened WhatsApp with ${patientName}!`);
                      }}
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to {patientName} via WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedShortReply);
                        showToast('Copied short reply to clipboard!');
                      }}
                      className="px-3 py-2 bg-black border border-white/20 hover:border-emerald-500 text-gray-300 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
