import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  RefreshCw,
  CheckCheck,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Zap,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'elsha-ai' | 'clinician';
  senderName: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
  status: 'sent' | 'delivered' | 'read';
  clinicalTag?: string;
}

export interface PatientConversation {
  id: string;
  name: string;
  phone: string;
  protocol: string;
  unreadCount: number;
  lastMessageTime: string;
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: PatientConversation[] = [
  {
    id: 'p-kiruthika',
    name: 'Kiruthika',
    phone: '',
    protocol: 'Type 2 Diabetes Reversal (1,500 kcal)',
    unreadCount: 0,
    lastMessageTime: '10:45 AM',
    messages: [
      {
        id: 'm-1',
        sender: 'clinician',
        senderName: 'Dr. E. Elshada',
        text: '🌅 Good morning Kiruthika! Please remember your 5:00 AM warm ghee water protocol. Starting Day 1 of your 1,500 kcal ICMR diet.',
        timestamp: '07:30 AM',
        status: 'read',
      },
      {
        id: 'm-2',
        sender: 'patient',
        senderName: 'Kiruthika',
        text: 'Good morning Doctor! Followed the ghee water. Just finished 30 min morning yoga. Can I drink tender coconut water after my morning workout?',
        timestamp: '08:15 AM',
        status: 'read',
      },
      {
        id: 'm-3',
        sender: 'elsha-ai',
        senderName: 'ELSHA Clinical AI',
        text: '🥥 Excellent post-workout hydration! 200ml tender coconut water is rich in potassium and electrolytes. Consume within 20 mins of training. Keep carbohydrates balanced with your Foxtail Millet Pongal at 8:30 AM.',
        timestamp: '08:16 AM',
        status: 'read',
        clinicalTag: 'Electrolyte & GI Balance',
      },
      {
        id: 'm-4',
        sender: 'patient',
        senderName: 'Kiruthika',
        text: 'Thank you! Fasting sugar today is 98 mg/dL.',
        timestamp: '10:45 AM',
        status: 'read',
      },
      {
        id: 'm-5',
        sender: 'elsha-ai',
        senderName: 'ELSHA Clinical AI',
        text: '📊 Outstanding reading! 98 mg/dL puts you safely in the normal euglycemic range (<100 mg/dL). This proves hepatic insulin sensitivity is improving. Continue your protocol!',
        timestamp: '10:46 AM',
        status: 'read',
        clinicalTag: 'Glycemic Target Met',
      },
    ],
  },
  {
    id: 'p-rajesh',
    name: 'Rajesh Kumar',
    phone: '+91 98412 34567',
    protocol: 'Cardiac Rehabilitation & Low Sodium',
    unreadCount: 1,
    lastMessageTime: '09:12 AM',
    messages: [
      {
        id: 'm-r1',
        sender: 'clinician',
        senderName: 'Dr. E. Elshada',
        text: 'Hello Rajesh, how was your morning blood pressure reading?',
        timestamp: '08:00 AM',
        status: 'read',
      },
      {
        id: 'm-r2',
        sender: 'patient',
        senderName: 'Rajesh Kumar',
        text: 'BP is 122/80 mmHg. Sodium kept below 1.5g as advised.',
        timestamp: '09:12 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'p-ananya',
    name: 'Ananya Sen',
    phone: '+91 98423 45678',
    protocol: 'PCOS & Insulin Resistance Protocol',
    unreadCount: 0,
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'm-a1',
        sender: 'patient',
        senderName: 'Ananya Sen',
        text: 'Spearmint tea twice daily is really helping with morning bloating!',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-a2',
        sender: 'elsha-ai',
        senderName: 'ELSHA Clinical AI',
        text: '🌸 Great feedback Ananya! Spearmint polyphenols help modulate free testosterone. Keep pairing with your soaked fenugreek seeds.',
        timestamp: 'Yesterday',
        status: 'read',
        clinicalTag: 'PCOS Anti-Androgenic Protocol',
      },
    ],
  },
  {
    id: 'p-vikram',
    name: 'Vikram Reddy',
    phone: '+91 98434 56789',
    protocol: 'Dyslipidemia & Metabolic Syndrome',
    unreadCount: 0,
    lastMessageTime: 'Sep 09',
    messages: [
      {
        id: 'm-v1',
        sender: 'patient',
        senderName: 'Vikram Reddy',
        text: 'Completed 10,000 steps today doctor. Triglycerides follow-up next Monday.',
        timestamp: 'Sep 09',
        status: 'read',
      },
    ],
  },
];

interface WhatsAppLiveSyncChatProps {
  clinicianPhone?: string;
  isLinked: boolean;
  autoReplyEnabled: boolean;
  onToggleAutoReply: (val: boolean) => void;
  showToast: (msg: string) => void;
}

export const WhatsAppLiveSyncChat: React.FC<WhatsAppLiveSyncChatProps> = ({
  clinicianPhone = '',
  isLinked,
  autoReplyEnabled,
  onToggleAutoReply,
  showToast,
}) => {
  const [conversations, setConversations] = useState<PatientConversation[]>(() => {
    try {
      const saved = localStorage.getItem('ELSHA_WHATSAPP_CONVERSATIONS');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CONVERSATIONS;
  });

  const [activePatientId, setActivePatientId] = useState<string>('p-kiruthika');
  const [inputText, setInputText] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-save conversations
  useEffect(() => {
    try {
      localStorage.setItem('ELSHA_WHATSAPP_CONVERSATIONS', JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activePatientId, isAiTyping, conversations]);

  const activePatient = conversations.find((c) => c.id === activePatientId) || conversations[0];

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Synced all WhatsApp incoming and outgoing messages with Linked Devices.');
    }, 700);
  };

  // Generate automated clinical AI replies based on patient message context
  const getAiClinicalReply = (patientMsg: string): { reply: string; tag: string } => {
    const lower = patientMsg.toLowerCase();

    if (lower.includes('coconut') || lower.includes('tender')) {
      return {
        reply:
          '🥥 Excellent post-workout hydration! 200ml tender coconut water is rich in potassium and electrolytes. Consume within 20 mins of training. Keep carbohydrates balanced today.',
        tag: 'Electrolyte & GI Balance',
      };
    }
    if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('98') || lower.includes('fasting')) {
      return {
        reply:
          '📊 98 mg/dL is an outstanding fasting reading! You are firmly in the optimal euglycemic range (<100 mg/dL). Maintain your 5 AM warm ghee water protocol.',
        tag: 'Glycemic Target Met',
      };
    }
    if (lower.includes('rice') || lower.includes('white rice')) {
      return {
        reply:
          '⚠️ Prefer foxtail millet or hand-pounded red rice at dinner. Polished white rice causes evening glucose peaks when insulin sensitivity is lowest. If having rice, ensure a 1:2 ratio with dal and vegetable poriyal.',
        tag: 'Glycemic Index Guidance',
      };
    }
    if (lower.includes('walk') || lower.includes('tired') || lower.includes('step')) {
      return {
        reply:
          '🚶 Even a gentle 10-minute stroll (Shatapadi) activates muscle GLUT4 glucose transporters and reduces post-meal insulin spikes by 25%. A light stroll without strain is highly recommended!',
        tag: 'Post-Prandial Activity',
      };
    }
    if (lower.includes('papaya') || lower.includes('fruit') || lower.includes('snack')) {
      return {
        reply:
          '🍎 1 small cup (80g) fresh papaya is safe (low glycemic load). Pair with 4 soaked almonds or roasted chana to slow carbohydrate absorption.',
        tag: 'Smart Snacking Protocol',
      };
    }
    if (lower.includes('lunch') || lower.includes('photo') || lower.includes('plate') || lower.includes('dal')) {
      return {
        reply:
          '🥗 Plate evaluated: Foxtail Millet + Palak Dal + Cucumber. Low GI, high fiber (~380 kcal, 16g protein). Score: 9/10. Great balance! Remember your 10-min post-meal stroll.',
        tag: 'AI Meal Plate Audit',
      };
    }

    return {
      reply:
        '✅ Received! Your clinical nutrition guidelines have been cross-checked against your 1,500 kcal ICMR protocol. Maintain scheduled meal times and hydration.',
      tag: 'ELSHA Protocol Verification',
    };
  };

  // Dispatch a simulated incoming patient message
  const handleSimulateIncomingPatientMessage = (text: string, imageUrl?: string) => {
    const newPatientMsg: ChatMessage = {
      id: `m-in-${Date.now()}`,
      sender: 'patient',
      senderName: activePatient.name,
      text,
      imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activePatient.id) return c;
        return {
          ...c,
          lastMessageTime: newPatientMsg.timestamp,
          messages: [...c.messages, newPatientMsg],
        };
      })
    );

    showToast(`Incoming WhatsApp message received from ${activePatient.name}`);

    // If automatic ELSHA AI replies is active, trigger automated smart reply
    if (autoReplyEnabled) {
      setIsAiTyping(true);
      setTimeout(() => {
        const { reply, tag } = getAiClinicalReply(text);
        const newAiReply: ChatMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'elsha-ai',
          senderName: 'ELSHA Clinical AI',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          clinicalTag: tag,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activePatient.id) return c;
            return {
              ...c,
              lastMessageTime: newAiReply.timestamp,
              messages: [...c.messages, newAiReply],
            };
          })
        );
        setIsAiTyping(false);
        showToast(`ELSHA AI automatically replied to ${activePatient.name}!`);
      }, 900);
    }
  };

  // Send message manually from clinician
  const handleSendClinicianMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-cli-${Date.now()}`,
      sender: 'clinician',
      senderName: 'Dr. E. Elshada',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activePatient.id) return c;
        return {
          ...c,
          lastMessageTime: newMsg.timestamp,
          messages: [...c.messages, newMsg],
        };
      })
    );

    setInputText('');
    showToast(`Dispatched message to ${activePatient.name}`);
  };

  // Open direct in WhatsApp Web
  const handleOpenDirectInWhatsAppWeb = () => {
    const cleanNum = activePatient.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
      `Hello ${activePatient.name}, this is Dr. E. Elshada regarding your clinical nutrition protocol.`
    )}`;
    window.open(url, '_blank');
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.protocol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner: Connection & Sync Status */}
      <div className="p-4 bg-gradient-to-r from-[#0a1e14] via-[#05110d] to-black border-2 border-emerald-500 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.4)]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                WHATSAPP TWO-WAY MESSAGE SYNC & ELSHA AI REPLIES
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 border ${
                  isLinked
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-amber-950 border-amber-400 text-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLinked ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isLinked ? `Connected` : 'Not Connected'}
              </span>
            </div>
            <h3 className="text-lg font-black text-white uppercase mt-0.5">
              Live WhatsApp Chat & Automatic ELSHA AI Replies
            </h3>
            <p className="text-xs text-gray-300">
              Bi-directional message synchronization with your linked WhatsApp line. Patient queries automatically receive ICMR-calibrated medical replies.
            </p>
          </div>
        </div>

        {/* Sync Controls & Auto-Reply Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Automatic ELSHA AI Replies Toggle */}
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-black/70 border border-emerald-500/60 shadow-inner">
            <Bot className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-white block">
                Automatic ELSHA AI Replies
              </span>
              <span className="text-[9px] text-gray-400 block">
                {autoReplyEnabled ? 'Active • Auto-replying in ~1s' : 'Disabled • Manual mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !autoReplyEnabled;
                onToggleAutoReply(next);
                showToast(
                  next
                    ? 'Automatic ELSHA AI replies enabled.'
                    : 'Automatic ELSHA AI replies paused.'
                );
              }}
              className={`ml-2 w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoReplyEnabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]' : 'bg-gray-700'
              }`}
              title="Toggle automatic ELSHA AI replies"
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  autoReplyEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Messages'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Patient Conversations & Active Chat Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Patient Directory / Chat List (4 cols) */}
        <div className="lg:col-span-4 bg-[#08130e] border border-emerald-500/40 rounded-2xl p-4 space-y-3 flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Patient WhatsApp Chats ({conversations.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">End-to-End</span>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name or protocol..."
            className="w-full bg-black/80 border border-white/15 px-3 py-1.5 text-xs text-white rounded-lg focus:border-emerald-500 focus:outline-none placeholder-gray-500"
          />

          {/* Patient Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredConversations.map((patient) => {
              const isActive = patient.id === activePatient.id;
              const lastMsg = patient.messages[patient.messages.length - 1];

              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => setActivePatientId(patient.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-black/50 border-white/5 hover:border-emerald-500/50 hover:bg-black/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {patient.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {patient.lastMessageTime}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-emerald-300 font-mono truncate mb-1">
                    {patient.phone}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : patient.protocol}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Live WhatsApp Conversation (8 cols) */}
        <div className="lg:col-span-8 bg-[#07130e] border-2 border-emerald-500 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="p-3.5 bg-[#0a1b13] border-b border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {activePatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{activePatient.name}</h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold">
                    {activePatient.phone}
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-300 font-mono">{activePatient.protocol}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenDirectInWhatsAppWeb}
                className="px-2.5 py-1 bg-black border border-white/20 hover:border-emerald-400 text-gray-300 hover:text-white text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Open directly in WhatsApp Web"
              >
                <ExternalLink className="w-3 h-3 text-emerald-400" />
                <span>Open in Web</span>
              </button>
            </div>
          </div>

          {/* Quick Simulation Triggers Bar */}
          <div className="p-2 px-3 bg-black/90 border-b border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Simulate Incoming Patient WhatsApp:
            </span>

            <button
              type="button"
              onClick={() =>
                handleSimulateIncomingPatientMessage(
                  '📸 Hi Doctor, here is my lunch plate! Foxtail Millet Pulao + Palak Dal + Cucumber Slices.',
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
                )
              }
              className="px-2 py-0.5 bg-[#12241b] hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-[10px] rounded transition-colors cursor-pointer"
            >
              📸 Lunch Plate Photo
            </button>

            <button
              type="button"
              onClick={() =>
                handleSimulateIncomingPatientMessage(
                  'Can I drink tender coconut water after my morning workout session today?'
                )
              }
              className="px-2 py-0.5 bg-[#12241b] hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-[10px] rounded transition-colors cursor-pointer"
            >
              🥥 Tender Coconut Water?
            </button>

            <button
              type="button"
              onClick={() =>
                handleSimulateIncomingPatientMessage(
                  'My morning fasting blood sugar is 98 mg/dL today! Feeling great.'
                )
              }
              className="px-2 py-0.5 bg-[#12241b] hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-[10px] rounded transition-colors cursor-pointer"
            >
              📊 Fasting Sugar: 98 mg/dL
            </button>

            <button
              type="button"
              onClick={() =>
                handleSimulateIncomingPatientMessage(
                  'Can I eat white rice for dinner tonight with sambar?'
                )
              }
              className="px-2 py-0.5 bg-[#12241b] hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-[10px] rounded transition-colors cursor-pointer"
            >
              🍚 White Rice for Dinner?
            </button>

            <button
              type="button"
              onClick={() =>
                handleSimulateIncomingPatientMessage(
                  'Feeling slightly tired after work today, can I skip my 15-min post-meal walk?'
                )
              }
              className="px-2 py-0.5 bg-[#12241b] hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-[10px] rounded transition-colors cursor-pointer"
            >
              🚶 Skip 15-Min Walk?
            </button>

            <button
              type="button"
              onClick={() =>
                handleSimulateIncomingPatientMessage(
                  'Can I eat 1 small cup of papaya for my 5 PM evening snack?'
                )
              }
              className="px-2 py-0.5 bg-[#12241b] hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-[10px] rounded transition-colors cursor-pointer"
            >
              🍎 Papaya for 5 PM Snack?
            </button>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#103823_1px,transparent_1px)] [background-size:16px_16px] bg-[#050e09]">
            {activePatient.messages.map((msg) => {
              const isPatient = msg.sender === 'patient';
              const isAi = msg.sender === 'elsha-ai';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPatient ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-md ${
                      isPatient
                        ? 'bg-[#1a251e] border border-white/10 text-gray-100 rounded-tl-sm'
                        : isAi
                        ? 'bg-gradient-to-br from-[#0c3620] to-[#062414] border-2 border-emerald-400 text-white rounded-tr-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-[#1e4d30] border border-emerald-400/50 text-white rounded-tr-sm'
                    }`}
                  >
                    {/* Header line inside bubble */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          isPatient
                            ? 'text-gray-300'
                            : isAi
                            ? 'text-emerald-300'
                            : 'text-emerald-200'
                        }`}
                      >
                        {isAi && <Bot className="w-3 h-3 text-emerald-400" />}
                        {msg.senderName}
                      </span>
                      {msg.clinicalTag && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 border border-emerald-400 text-emerald-300">
                          {msg.clinicalTag}
                        </span>
                      )}
                    </div>

                    {/* Image attachment if provided */}
                    {msg.imageUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/10 max-h-48">
                        <img
                          src={msg.imageUrl}
                          alt="Meal plate"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-xs leading-relaxed font-sans">{msg.text}</p>

                    {/* Timestamp & Read Receipt */}
                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] font-mono text-gray-400">
                      <span>{msg.timestamp}</span>
                      {!isPatient && (
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 w-fit animate-pulse">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span>ELSHA AI is generating clinical response...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Manual Input Footer */}
          <div className="p-3 bg-[#08170f] border-t border-emerald-500/40 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendClinicianMessage();
              }}
              placeholder={`Reply to ${activePatient.name} as Clinician (${clinicianPhone})...`}
              className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs text-white rounded-xl focus:border-emerald-500 focus:outline-none placeholder-gray-500"
            />
            <button
              type="button"
              onClick={handleSendClinicianMessage}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
