import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
  FileText,
  Plus,
  X,
  ArrowLeft,
  Bot,
  Lock,
  AlertTriangle,
  PowerOff,
  CheckCircle2,
  Loader2,
  Settings,
  Copy,
  ExternalLink,
  ShieldCheck,
  Phone,
  Building2,
  Clock,
  Key,
  Database,
  Radio,
  FileCheck,
} from 'lucide-react';

export type WhatsAppConnectionState =
  | 'NOT_CONFIGURED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'CONFIG_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'EXPIRED_TOKEN'
  | 'INVALID_PHONE_NUMBER_ID'
  | 'INVALID_WABA_ID'
  | 'WEBHOOK_VERIFY_FAILURE'
  | 'API_NETWORK_FAILURE'
  | 'DISCONNECTED';

export interface WhatsAppMessage {
  id: string;
  wamid?: string;
  conversationId: string;
  contactId: string;
  fromPhone: string;
  toPhone: string;
  direction: 'inbound' | 'outbound';
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'pdf';
  text: string;
  timestamp: string;
  timeRaw: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  mimeType?: string;
  fileName?: string;
  fileSize?: string;
  aiSuggested?: boolean;
  aiReasoning?: string;
  errorMessage?: string;
}

export interface WhatsAppConversation {
  id: string;
  contactId: string;
  phoneNumber: string;
  displayPhoneNumber: string;
  contactName: string;
  elshaPatientId?: string;
  elshaPatientName?: string;
  unreadCount: number;
  lastMessageId: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  lastMessageTimeRaw: number;
  lastMessageDirection: 'inbound' | 'outbound';
  lastMessageStatus: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  updatedAt: string;
}

export interface WhatsAppAccountInfo {
  id: string;
  platform: 'meta_cloud_api' | 'whatsapp_web_md';
  displayPhoneNumber: string;
  verifiedName: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  wabaId?: string;
  phoneNumberId?: string;
  qualityRating?: string;
  connectedAt: string | null;
  lastSyncAt: string | null;
  errorMessage?: string | null;
  autoReplyEnabled: boolean;
}

export interface WhatsAppEnvVariableInfo {
  name: string;
  isConfigured: boolean;
  description: string;
  source: 'env' | 'database' | 'missing';
}

export interface WhatsAppEnvValidation {
  allConfigured: boolean;
  missingCount: number;
  configuredCount: number;
  missingVariables: string[];
  variables: {
    phoneNumber: WhatsAppEnvVariableInfo;
    wabaId: WhatsAppEnvVariableInfo;
    accessToken: WhatsAppEnvVariableInfo;
    webhookVerifyToken: WhatsAppEnvVariableInfo;
  };
}

export interface WhatsAppHubSectionProps {
  patientName?: string;
  phone?: string;
  onBackToMainFolders?: () => void;
  onNavigateToPatientDossier?: () => void;
}

export const WhatsAppHubSection: React.FC<WhatsAppHubSectionProps> = ({
  patientName = 'Kiruthika',
  phone = '+91 98401 23456',
  onBackToMainFolders,
  onNavigateToPatientDossier,
}) => {
  // Connection state
  const [connectionState, setConnectionState] = useState<WhatsAppConnectionState>('NOT_CONFIGURED');
  const [statusLabel, setStatusLabel] = useState<string>('WhatsApp Not Configured');
  const [accountInfo, setAccountInfo] = useState<WhatsAppAccountInfo | null>(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'inbox' | 'setup' | 'details'>('inbox');
  const [isHealthChecking, setIsHealthChecking] = useState<boolean>(false);

  // Environment variables validation from server
  const [envValidation, setEnvValidation] = useState<WhatsAppEnvValidation | null>(null);

  // Configuration Modal & inline setup form state
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [configPhoneId, setConfigPhoneId] = useState<string>('');
  const [configWabaId, setConfigWabaId] = useState<string>('');
  const [configToken, setConfigToken] = useState<string>('');
  const [configVerifyToken, setConfigVerifyToken] = useState<string>('elsha_whatsapp_verify_token_2026');
  const [hasServerAccessToken, setHasServerAccessToken] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [configStatusMessage, setConfigStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // New Chat Modal state
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [newChatPhone, setNewChatPhone] = useState<string>(phone || '');
  const [newChatName, setNewChatName] = useState<string>(patientName || '');
  const [newChatMessage, setNewChatMessage] = useState<string>(
    'Hello, this is Dr. Bharath Kumar B from ŽIATHLON Sports Medicine.'
  );

  // Conversations & Messages state
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesLoadError, setMessagesLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // AI Assistant state
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConvIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  // Scroll to bottom of message list
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 80);
  };

  // 1. Fetch Backend Connection Status & Server-Side Environment Check
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      if (!res.ok) return;
      const data = await res.json();

      const backendState: WhatsAppConnectionState = data.connectionState || 'NOT_CONFIGURED';
      setConnectionState(backendState);
      setStatusLabel(data.statusLabel || (backendState === 'CONNECTED' ? 'CONNECTED & SYNCHRONIZED' : 'WhatsApp Not Configured'));

      if (data.envValidation) {
        setEnvValidation(data.envValidation);
      }

      if (data.account) {
        setAccountInfo(data.account);
      } else {
        setAccountInfo(null);
      }

      setAutoReplyEnabled(data.autoReplyEnabled || false);
      setLastError(data.lastError || null);

      if (data.config) {
        setConfigPhoneId(data.config.phoneNumberId || '');
        setConfigWabaId(data.config.wabaId || '');
        setConfigVerifyToken(data.config.webhookVerifyToken || 'elsha_whatsapp_verify_token_2026');
        setHasServerAccessToken(Boolean(data.config.hasAccessToken));
      }
    } catch (err: any) {
      console.error('Error fetching WhatsApp status:', err);
      setConnectionState('API_NETWORK_FAILURE');
      setStatusLabel('WhatsApp Service Offline');
      setLastError('Unable to reach backend messaging service.');
    }
  }, []);

  // 2. Fetch Messages for Active Conversation
  const fetchMessages = useCallback(async (convId: string) => {
    if (!convId) return;
    setIsLoadingMessages(true);
    setMessagesLoadError(null);

    try {
      const encodedId = encodeURIComponent(convId);
      const res = await fetch(`/api/whatsapp/messages/${encodedId}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        const errorText =
          data.details || data.error || `HTTP ${res.status}: Failed to load messages`;
        setMessagesLoadError(errorText);
        setMessages([]);
        return;
      }

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
        scrollToBottom('auto');
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setMessagesLoadError(err.message || 'Network error fetching messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // 3. Fetch Real Patient Conversations
  const fetchConversations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterTab !== 'all') params.append('filter', filterTab);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/whatsapp/conversations?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();

      if (Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        // Automatically select first conversation if none selected
        if (!activeConvIdRef.current && data.conversations.length > 0) {
          const firstId = data.conversations[0].id;
          setActiveConvId(firstId);
          fetchMessages(firstId);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  }, [filterTab, searchQuery, fetchMessages]);

  // 4. Live Health Check against Meta Graph API
  const handleCheckHealth = async () => {
    setIsHealthChecking(true);
    setConfigStatusMessage(null);
    try {
      const res = await fetch('/api/whatsapp/health');
      const data = await res.json();
      if (data.connectionState) {
        setConnectionState(data.connectionState);
      }
      if (data.statusLabel) {
        setStatusLabel(data.statusLabel);
      }
      if (data.envValidation) {
        setEnvValidation(data.envValidation);
      }
      if (data.account) {
        setAccountInfo(data.account);
      }
      if (data.lastError) {
        setLastError(data.lastError);
      } else {
        setLastError(null);
      }
      if (data.healthCheck?.success) {
        setConfigStatusMessage({ text: 'WhatsApp Business Cloud API connection verified successfully!', isError: false });
        fetchConversations();
      } else if (data.healthCheck?.error) {
        setConfigStatusMessage({ text: data.healthCheck.error, isError: true });
      }
    } catch (err: any) {
      console.error('Health check error:', err);
      setLastError('Failed to execute health check');
      setConfigStatusMessage({ text: 'Health check failed: ' + err.message, isError: true });
    } finally {
      setIsHealthChecking(false);
    }
  };

  // 5. Connect to Real-time SSE Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/whatsapp/events');

      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);

          if (payload.type === 'connectionState') {
            const backendState = payload.data?.connectionState || 'NOT_CONFIGURED';
            setConnectionState(backendState);
            if (payload.data?.statusLabel) {
              setStatusLabel(payload.data.statusLabel);
            }
            if (payload.data?.envValidation) {
              setEnvValidation(payload.data.envValidation);
            }
            if (payload.data?.account) {
              setAccountInfo(payload.data.account);
            }
            if (payload.data?.autoReplyEnabled !== undefined) {
              setAutoReplyEnabled(payload.data.autoReplyEnabled);
            }
            if (backendState === 'CONNECTED') {
              fetchConversations();
            }
          } else if (payload.type === 'newMessage') {
            const newMsg: WhatsAppMessage = payload.data;
            if (
              newMsg &&
              activeConvIdRef.current &&
              (newMsg.conversationId === activeConvIdRef.current ||
                newMsg.fromPhone.includes(activeConvIdRef.current.replace(/[^0-9]/g, '')))
            ) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id || (m.wamid && m.wamid === newMsg.wamid))) return prev;
                return [...prev, newMsg];
              });
              scrollToBottom('smooth');
            }
            fetchConversations();
          } else if (payload.type === 'messageStatus') {
            const { id, status } = payload.data || {};
            if (id && status) {
              setMessages((prev) =>
                prev.map((m) => (m.id === id || m.wamid === id ? { ...m, status } : m))
              );
            }
          } else if (payload.type === 'conversations') {
            fetchConversations();
          }
        } catch (err) {
          console.error('Error handling SSE message:', err);
        }
      };

      eventSource.onerror = () => {
        // SSE fallback handled by periodic polling
      };
    } catch (err) {
      console.error('SSE initialization error:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [fetchConversations]);

  // Periodic polling fallback
  useEffect(() => {
    fetchStatus();
    fetchConversations();
    const interval = setInterval(() => {
      fetchStatus();
      fetchConversations();
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchStatus, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    } else {
      setMessages([]);
    }
  }, [activeConvId, fetchMessages]);

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || !activeConvId) return;

    const activeConv = conversations.find((c) => c.id === activeConvId);
    const recipientPhone = activeConv ? activeConv.phoneNumber : activeConvId.replace(/[^0-9]/g, '');

    setIsSending(true);
    setSendError(null);

    // Optimistic message addition
    const tempId = `temp-${Date.now()}`;
    const nowTimeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const optimisticMsg: WhatsAppMessage = {
      id: tempId,
      conversationId: activeConvId,
      contactId: `contact-${recipientPhone}`,
      fromPhone: 'clinic',
      toPhone: recipientPhone,
      direction: 'outbound',
      type: 'text',
      text: content,
      timestamp: nowTimeStr,
      timeRaw: Date.now(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    if (!textToSend) setInputText('');
    scrollToBottom('smooth');

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone,
          text: content,
          patientContext: activeConv?.elshaPatientName
            ? { name: activeConv.elshaPatientName, id: activeConv.elshaPatientId }
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorText = data.message || data.error || 'Failed to dispatch WhatsApp message';
        setSendError(errorText);
        // Mark optimistic message as failed with error reason
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, status: 'failed', errorMessage: errorText } : m
          )
        );
        return;
      }

      // Update optimistic message with real WhatsApp message ID
      if (data.recordedMessage) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.recordedMessage : m))
        );
      }
      fetchConversations();
    } catch (err: any) {
      console.error('Send message error:', err);
      const errMsg = err.message || 'Network error dispatching message';
      setSendError(errMsg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: 'failed', errorMessage: errMsg } : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // Start New Chat with Patient
  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newChatPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert('Please enter a valid phone number with country code (e.g. 919840123456)');
      return;
    }

    const convId = `conv-${cleanPhone}`;
    setIsSending(true);
    setSendError(null);

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: cleanPhone,
          text: newChatMessage,
          patientContext: {
            name: newChatName || patientName,
            id: `pat-${cleanPhone}`,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSendError(data.message || data.error || 'Failed to dispatch WhatsApp message');
        return;
      }

      setShowNewChatModal(false);
      setActiveConvId(convId);
      await fetchConversations();
      await fetchMessages(convId);
    } catch (err: any) {
      setSendError(err.message || 'Failed to start chat');
    } finally {
      setIsSending(false);
    }
  };

  // Save / Update Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setConfigStatusMessage(null);

    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumberId: configPhoneId.trim(),
          wabaId: configWabaId.trim(),
          accessToken: configToken.trim() || undefined,
          webhookVerifyToken: configVerifyToken.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setConfigStatusMessage({
          text: 'Verified and connected successfully with Meta WhatsApp Business Cloud API!',
          isError: false,
        });
        setConfigToken('');
        await fetchStatus();
        await fetchConversations();
        setTimeout(() => {
          setShowConfigModal(false);
          setConfigStatusMessage(null);
        }, 1200);
      } else {
        setConfigStatusMessage({
          text: data.error || data.message || 'Failed to verify Meta Cloud API credentials.',
          isError: true,
        });
        await fetchStatus();
      }
    } catch (err: any) {
      setConfigStatusMessage({ text: err.message || 'Failed to save configuration', isError: true });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this WhatsApp Business account?')) return;
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      setConnectionState('NOT_CONFIGURED');
      setStatusLabel('WhatsApp Not Configured');
      setAccountInfo(null);
      await fetchStatus();
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // AI Suggestion generator
  const handleGenerateAiReply = async () => {
    const activeConv = conversations.find((c) => c.id === activeConvId);
    const lastInbound = [...messages].reverse().find((m) => m.direction === 'inbound');

    if (!lastInbound && messages.length === 0) {
      alert('No patient message found in this conversation to analyze.');
      return;
    }

    const patientText = lastInbound ? lastInbound.text : 'Patient consultation query';
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/whatsapp/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastPatientMessage: patientText,
          patientProfile: {
            name: activeConv?.elshaPatientName || activeConv?.contactName || 'Patient',
            condition: 'Metabolic & Sports Medicine',
          },
          clinicalData: {
            targetCalories: '1,650 kcal',
            proteinGrams: '75 g/day',
            category: 'Metabolic Optimization',
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.suggestedReply) {
        setAiSuggestion(data.suggestedReply);
        setAiReasoning(data.reasoning || null);
      } else {
        alert(data.error || 'Failed to formulate AI clinical suggestion.');
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      alert('Error formulating AI suggestion: ' + err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Toggle Auto Reply
  const handleToggleAutoReply = async () => {
    const nextState = !autoReplyEnabled;
    setAutoReplyEnabled(nextState);
    try {
      await fetch('/api/whatsapp/toggle-auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
    } catch (err) {
      console.error('Error toggling auto-reply:', err);
    }
  };

  const isConnected = connectionState === 'CONNECTED';
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/whatsapp/webhook`;

  return (
    <div className="w-full max-w-[1380px] mx-auto space-y-5 animate-in fade-in select-text">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR: STATUS & ACTION BUTTONS                                 */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {onBackToMainFolders && (
            <button
              type="button"
              onClick={onBackToMainFolders}
              className="p-2.5 rounded-xl bg-white border border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1] cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Back to Clinical Folders"
            >
              <ArrowLeft className="w-4 h-4 text-[#7016B7]" />
              <span className="hidden sm:inline">Clinical Workspace</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-md shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-[#2E1C07] tracking-tight uppercase">
                WHATSAPP BUSINESS
              </h1>

              {/* Exact Status Badges */}
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-400 text-emerald-800 text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  CONNECTED &amp; SYNCHRONIZED ({accountInfo?.displayPhoneNumber || '+91 72002 60970'})
                </span>
              ) : connectionState === 'CONFIG_ERROR' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-black uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  WHATSAPP CONFIGURATION ERROR
                </span>
              ) : connectionState === 'NOT_CONFIGURED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-black uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  WHATSAPP NOT CONFIGURED
                </span>
              ) : connectionState === 'CONNECTING' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-300 text-blue-800 text-[11px] font-black uppercase tracking-wider">
                  <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  CONNECTING &amp; VERIFYING...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-300 text-gray-800 text-[11px] font-black uppercase tracking-wider">
                  <PowerOff className="w-3.5 h-3.5 text-gray-500" />
                  DISCONNECTED
                </span>
              )}
            </div>
            <p className="text-xs text-[#8C5E28] font-medium mt-0.5">
              Official WhatsApp Business Cloud Platform • Real-Time Patient Consultations &amp; Prescription Delivery
            </p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch View Toggle */}
          <button
            type="button"
            onClick={() => {
              if (activeView === 'setup') {
                setActiveView('inbox');
              } else if (activeView === 'inbox') {
                setActiveView(isConnected ? 'details' : 'setup');
              } else {
                setActiveView('inbox');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
          >
            {activeView === 'inbox'
              ? isConnected ? 'Account Details' : 'Connect WhatsApp'
              : 'Open Inbox'}
          </button>

          {/* Cloud API Settings / Credentials Button */}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Configure WhatsApp Cloud API credentials and webhooks"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-700" />
            <span>Cloud API Settings</span>
          </button>

          {/* Test / Health Check Button */}
          <button
            type="button"
            onClick={handleCheckHealth}
            disabled={isHealthChecking}
            className="p-2.5 rounded-xl bg-white border border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1] cursor-pointer shadow-xs transition-colors"
            title="Execute live Meta Graph API verification"
          >
            <RefreshCw className={`w-4 h-4 text-[#2E1C07] ${isHealthChecking ? 'animate-spin' : ''}`} />
          </button>

          {/* AI Auto-Reply Toggle */}
          {isConnected && (
            <button
              type="button"
              onClick={handleToggleAutoReply}
              className={`px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                autoReplyEnabled
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1]'
              }`}
              title="Automated clinical response protocol"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>AI AUTO REPLY: {autoReplyEnabled ? 'ON' : 'OFF'}</span>
            </button>
          )}

          {/* Start New Chat Button */}
          {isConnected && (
            <button
              type="button"
              onClick={() => setShowNewChatModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Message</span>
            </button>
          )}

          {/* Disconnect Account */}
          {isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Disconnect WhatsApp Business account"
            >
              <PowerOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA: NOT CONFIGURED SETUP SCREEN vs LIVE INBOX            */}
      {/* ========================================================================= */}

      {!isConnected && activeView !== 'details' ? (
        /* Professional "Connect WhatsApp" Setup Screen */
        <div className="bg-white border-2 border-[#D9C4A5] rounded-3xl p-6 sm:p-8 shadow-xl max-w-[960px] mx-auto space-y-7 text-[#2E1C07] animate-in fade-in">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#2E1C07]">
                Connect WhatsApp Business Platform
              </h2>
              <p className="text-xs text-[#8C5E28] max-w-xl mx-auto mt-1">
                Official Meta WhatsApp Cloud API integration for ŽIATHLON Sports Medicine. Connect your WhatsApp Business account to enable real-time patient consultations and automatic prescription dispatch.
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
              connectionState === 'CONFIG_ERROR'
                ? 'bg-rose-50 border border-rose-300 text-rose-900'
                : 'bg-amber-50 border border-amber-300 text-amber-900'
            }`}>
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>STATUS: {statusLabel}</span>
            </div>
          </div>

          {/* Specific Backend / Meta Error Notice if any */}
          {lastError && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Configuration / Verification Notice:</p>
                <p className="text-[11.5px] text-rose-800 leading-relaxed">{lastError}</p>
              </div>
            </div>
          )}

          {/* Server-Side Environment Variables Status Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                Required Server-Side Environment Variables (4 of 4)
              </h3>
              <span className="text-[11px] font-bold text-gray-500 font-mono">
                {envValidation
                  ? `${envValidation.configuredCount} of 4 Configured`
                  : '0 of 4 Configured'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. WHATSAPP_PHONE_NUMBER */}
              <div className="p-4 rounded-2xl border-2 bg-[#FAF6ED] border-[#D9C4A5] space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-gray-900">
                    WHATSAPP_PHONE_NUMBER
                  </span>
                  {envValidation?.variables.phoneNumber.isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      <Check className="w-3 h-3" /> CONFIGURED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      <AlertCircle className="w-3 h-3" /> MISSING
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 leading-normal">
                  WhatsApp Phone Number ID registered on Meta Developer Portal (API Setup &gt; Phone number ID).
                </p>
              </div>

              {/* 2. WHATSAPP_BUSINESS_ACCOUNT_ID */}
              <div className="p-4 rounded-2xl border-2 bg-[#FAF6ED] border-[#D9C4A5] space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-gray-900">
                    WHATSAPP_BUSINESS_ACCOUNT_ID
                  </span>
                  {envValidation?.variables.wabaId.isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      <Check className="w-3 h-3" /> CONFIGURED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      <AlertCircle className="w-3 h-3" /> MISSING
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 leading-normal">
                  WhatsApp Business Account ID (WABA ID) under your Meta Business Portfolio.
                </p>
              </div>

              {/* 3. WHATSAPP_ACCESS_TOKEN */}
              <div className="p-4 rounded-2xl border-2 bg-[#FAF6ED] border-[#D9C4A5] space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-gray-900">
                    WHATSAPP_ACCESS_TOKEN
                  </span>
                  {envValidation?.variables.accessToken.isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      <Lock className="w-3 h-3" /> SECURED ON SERVER
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      <AlertCircle className="w-3 h-3" /> MISSING
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 leading-normal">
                  Permanent System User Access Token with <code className="text-gray-800 bg-white px-1 py-0.5 rounded">whatsapp_business_messaging</code> scope. Kept strictly confidential on server.
                </p>
              </div>

              {/* 4. WHATSAPP_WEBHOOK_VERIFY_TOKEN */}
              <div className="p-4 rounded-2xl border-2 bg-[#FAF6ED] border-[#D9C4A5] space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-gray-900">
                    WHATSAPP_WEBHOOK_VERIFY_TOKEN
                  </span>
                  {envValidation?.variables.webhookVerifyToken.isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      <Check className="w-3 h-3" /> CONFIGURED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      <AlertCircle className="w-3 h-3" /> MISSING
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 leading-normal">
                  Secret verification token used to establish the real-time webhook handshake with Meta servers.
                </p>
              </div>
            </div>
          </div>

          {/* Meta Webhook Endpoint Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#D9C4A5] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Live Webhook Endpoint for Real-Time Messages
              </h4>
              <span className="text-[10.5px] text-gray-500 font-medium">Field to subscribe: <code>messages</code></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-gray-600 font-bold block mb-1">
                  Callback URL (Paste into Meta Dashboard):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px] text-gray-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(webhookUrl, 'inlineWebhookUrl')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'inlineWebhookUrl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'inlineWebhookUrl' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-600 font-bold block mb-1">
                  Verify Token (Paste into Meta Dashboard):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={configVerifyToken}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px] text-gray-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(configVerifyToken, 'inlineVerifyToken')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'inlineVerifyToken' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'inlineVerifyToken' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200">
            {onBackToMainFolders && (
              <button
                type="button"
                onClick={onBackToMainFolders}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#7016B7]" />
                <span>Return to Patient Dossier</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={handleCheckHealth}
                disabled={isHealthChecking}
                className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#D9C4A5] hover:bg-[#F4ECE1] text-[#2E1C07] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                title="Perform server-side Meta WhatsApp Cloud API connection test"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isHealthChecking ? 'animate-spin' : ''}`} />
                <span>{isHealthChecking ? 'TESTING...' : 'TEST CONNECTION'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95"
                title="Configure the four server-side WhatsApp Cloud API secrets"
              >
                <Settings className="w-4 h-4" />
                <span>ENTER CREDENTIALS</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeView === 'details' ? (
        /* Account Details View */
        <div className="bg-white border-2 border-[#D9C4A5] rounded-3xl p-6 sm:p-8 shadow-xl max-w-[800px] mx-auto space-y-6 text-[#2E1C07]">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              WhatsApp Business Account Verification
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Meta Cloud API Platform (v21.0)
            </div>
          </div>

          <div className="p-5 bg-[#FAF6ED] border-2 border-[#D9C4A5] rounded-2xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" /> Verified Business Name:
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {accountInfo?.verifiedName || 'ŽIATHLON Sports Medicine'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" /> WhatsApp Business Number:
              </span>
              <span className="font-mono font-black text-gray-900 text-sm">
                {accountInfo?.displayPhoneNumber || '+91 72002 60970'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600">Phone Number ID:</span>
              <span className="font-mono text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                {configPhoneId || accountInfo?.phoneNumberId || 'Not configured'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600">WhatsApp Business Account ID (WABA):</span>
              <span className="font-mono text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                {configWabaId || accountInfo?.wabaId || 'Not configured'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600">Meta Quality Rating:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                ● {accountInfo?.qualityRating || 'GREEN (High)'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600">Access Token Status:</span>
              <span className="font-mono text-xs text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                {hasServerAccessToken ? 'Protected on Server' : 'Not configured'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#D9C4A5]">
              <span className="font-bold text-gray-600">Webhook Endpoint URL:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 truncate max-w-[280px]">
                  {webhookUrl}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(webhookUrl, 'webhookUrlDetails')}
                  className="p-1 hover:bg-gray-100 rounded text-emerald-700 cursor-pointer"
                  title="Copy webhook URL"
                >
                  {copiedField === 'webhookUrlDetails' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-600">Webhook Verification Token:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {configVerifyToken}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(configVerifyToken, 'verifyTokenDetails')}
                  className="p-1 hover:bg-gray-100 rounded text-emerald-700 cursor-pointer"
                  title="Copy verification token"
                >
                  {copiedField === 'verifyTokenDetails' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="px-4 py-2 rounded-xl bg-white border border-[#D9C4A5] text-[#2E1C07] hover:bg-[#F4ECE1] text-xs font-bold cursor-pointer"
            >
              Update Credentials
            </button>
            <button
              type="button"
              onClick={() => setActiveView('inbox')}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
            >
              Open Messaging Inbox
            </button>
          </div>
        </div>
      ) : (
        /* Real Messaging Inbox View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-2 border-[#D9C4A5] rounded-3xl overflow-hidden bg-white shadow-xl min-h-[640px]">
          {/* ===================================================================== */}
          {/* A. LEFT PANEL: PATIENT CONVERSATIONS LIST                             */}
          {/* ===================================================================== */}
          <div className="md:col-span-4 border-r border-[#D9C4A5] flex flex-col bg-[#FAF6ED]/70">
            {/* Search Box */}
            <div className="p-3.5 border-b border-[#D9C4A5] space-y-2.5 bg-[#FAF6ED]">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patient name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white rounded-xl border border-[#D9C4A5] text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Tabs: All / Unread */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D9C4A5]">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    filterTab === 'all'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('unread')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    filterTab === 'unread'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Unread ({conversations.reduce((acc, c) => acc + (c.unreadCount > 0 ? 1 : 0), 0)})
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#D9C4A5]/40 max-h-[560px]">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 space-y-3">
                  <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-xs font-bold text-gray-700">No conversations yet</p>
                  <p className="text-[11px] text-gray-500">
                    Incoming patient messages via WhatsApp webhook will appear here automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowNewChatModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700"
                  >
                    + Start First Chat
                  </button>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isActive
                          ? 'bg-[#EBF7EE] border-l-4 border-l-emerald-600'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                        {conv.contactName ? conv.contactName.slice(0, 2).toUpperCase() : 'PT'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-xs font-black text-gray-900 truncate">
                            {conv.elshaPatientName || conv.contactName || conv.displayPhoneNumber}
                          </p>
                          <span className="text-[10px] text-gray-500 font-mono shrink-0">
                            {conv.lastMessageTimestamp || ''}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500 font-mono truncate mb-1">
                          {conv.displayPhoneNumber}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-600 truncate flex-1 flex items-center gap-1">
                            {conv.lastMessageDirection === 'outbound' && (
                              <span className="shrink-0">
                                {conv.lastMessageStatus === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                                ) : conv.lastMessageStatus === 'delivered' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-gray-400 inline" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-gray-400 inline" />
                                )}
                              </span>
                            )}
                            <span className="truncate">{conv.lastMessageText || 'No messages yet'}</span>
                          </p>

                          {conv.unreadCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* B. RIGHT PANEL: ACTIVE CHAT CONVERSATION WINDOW                       */}
          {/* ===================================================================== */}
          <div className="md:col-span-8 flex flex-col bg-[#F9F7F2]">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-3.5 sm:p-4 border-b border-[#D9C4A5] bg-white flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {activeConv.contactName ? activeConv.contactName.slice(0, 2).toUpperCase() : 'PT'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-gray-900 truncate">
                          {activeConv.elshaPatientName || activeConv.contactName}
                        </h3>
                        {activeConv.elshaPatientId && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                            ELSHA PATIENT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">
                        {activeConv.displayPhoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Formulate AI Clinical Suggestion */}
                    <button
                      type="button"
                      onClick={handleGenerateAiReply}
                      disabled={isAiGenerating}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      title="Generate clinical response suggestion using patient profile and lab data"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-purple-700 ${isAiGenerating ? 'animate-spin' : ''}`} />
                      <span>{isAiGenerating ? 'Analyzing...' : 'AI Suggestion'}</span>
                    </button>

                    {onNavigateToPatientDossier && (
                      <button
                        type="button"
                        onClick={onNavigateToPatientDossier}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#D9C4A5] text-gray-800 hover:bg-[#F4ECE1] text-xs font-bold cursor-pointer transition-colors"
                      >
                        View Dossier
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Suggestion Banner if Generated */}
                {aiSuggestion && (
                  <div className="p-3 bg-purple-50 border-b border-purple-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-purple-700" />
                        Gemini AI Clinical Formulation:
                      </span>
                      <button
                        type="button"
                        onClick={() => setAiSuggestion(null)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-gray-800 bg-white p-2.5 rounded-lg border border-purple-200 italic font-medium leading-relaxed">
                      &quot;{aiSuggestion}&quot;
                    </p>
                    {aiReasoning && (
                      <p className="text-[11px] text-purple-700">
                        <strong>Clinical Reasoning:</strong> {aiReasoning}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setInputText(aiSuggestion);
                          setAiSuggestion(null);
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-700 text-white font-bold text-[11px] hover:bg-purple-800 cursor-pointer"
                      >
                        Insert Into Message
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[380px] max-h-[500px]">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                      <span className="text-xs font-medium">Synchronizing messages...</span>
                    </div>
                  ) : messagesLoadError ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2 my-6">
                      <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
                      <p className="text-xs font-bold text-rose-800">
                        Message Synchronization Issue
                      </p>
                      <p className="text-[11px] text-rose-700 font-mono">
                        {messagesLoadError}
                      </p>
                      <button
                        type="button"
                        onClick={() => fetchMessages(activeConv.id)}
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        Retry Loading
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 space-y-2">
                      <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />
                      <p className="text-xs font-bold text-gray-600">No messages yet with this patient</p>
                      <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                        Type a clinical update or prescription below to initiate communication via the official WhatsApp Business Cloud API.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOutbound = msg.direction === 'outbound';
                      return (
                        <div
                          key={msg.id || msg.wamid}
                          className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-xs text-xs relative space-y-1 ${
                              isOutbound
                                ? 'bg-[#E7FFDB] text-gray-900 border border-emerald-200 rounded-br-xs'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-xs'
                            }`}
                          >
                            {/* Document / Media attachment card if present */}
                            {msg.mediaUrl && (
                              <div className="p-2 rounded-xl bg-black/5 border border-black/10 flex items-center gap-2 mb-1">
                                <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold truncate">
                                    {msg.fileName || 'Clinical Document.pdf'}
                                  </p>
                                  <span className="text-[10px] text-gray-500">PDF Document</span>
                                </div>
                                <a
                                  href={msg.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 hover:bg-black/10 rounded text-emerald-800"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}

                            {/* Text content */}
                            {msg.text && (
                              <p className="whitespace-pre-wrap leading-relaxed text-[12.5px]">
                                {msg.text}
                              </p>
                            )}

                            {/* Meta & Ticks */}
                            <div className="flex items-center justify-end gap-1.5 pt-0.5 text-[10px] text-gray-500">
                              <span className="font-mono">{msg.timestamp}</span>

                              {isOutbound && (
                                <>
                                  {msg.status === 'sending' ? (
                                    <Clock className="w-3 h-3 text-gray-400" />
                                  ) : msg.status === 'sent' ? (
                                    <Check className="w-3.5 h-3.5 text-gray-500" />
                                  ) : msg.status === 'delivered' ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-gray-500" />
                                  ) : msg.status === 'read' ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                  ) : msg.status === 'failed' ? (
                                    <span
                                      className="inline-flex items-center gap-0.5 text-rose-600 font-bold"
                                      title={msg.errorMessage || 'Failed to dispatch'}
                                    >
                                      <AlertCircle className="w-3 h-3" /> Failed
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </div>

                            {/* Explicit error banner for failed outbound */}
                            {msg.status === 'failed' && msg.errorMessage && (
                              <p className="text-[10.5px] text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200 mt-1">
                                <strong>Error:</strong> {msg.errorMessage}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Banner when Sending Fails */}
                {sendError && (
                  <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
                    <span className="truncate"><strong>Failed:</strong> {sendError}</span>
                    <button
                      type="button"
                      onClick={() => setSendError(null)}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Message Composer */}
                <div className="p-3 sm:p-4 border-t border-[#D9C4A5] bg-white flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert('Select a clinical PDF dossier or prescription to attach.');
                    }}
                    className="p-2 rounded-xl bg-white border border-[#D9C4A5] text-gray-600 hover:text-emerald-700 hover:bg-[#F4ECE1] cursor-pointer"
                    title="Attach Clinical Document or PDF"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder="Type clinical WhatsApp message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A5] text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600"
                  />

                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={isSending || !inputText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition-transform active:scale-95"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send</span>
                  </button>
                </div>
              </>
            ) : (
              /* No Active Conversation Selected */
              <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500">
                <div className="space-y-3">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300" />
                  <p className="text-sm font-bold text-gray-700">Select a patient conversation</p>
                  <p className="text-xs text-gray-500">
                    Choose a patient from the list on the left to view messages.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowNewChatModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                  >
                    + Message Patient
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CLOUD API CREDENTIALS & ONBOARDING MODAL                               */}
      {/* ========================================================================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl border-2 border-[#D9C4A5] my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#2E1C07] uppercase tracking-tight">
                    WhatsApp Business Cloud API Setup
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Official Meta Platform Credentials &amp; Webhook Settings
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {configStatusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  configStatusMessage.isError
                    ? 'bg-rose-50 border border-rose-300 text-rose-800'
                    : 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                }`}
              >
                {configStatusMessage.isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{configStatusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="font-mono font-bold text-gray-900 block mb-1">
                  1. WHATSAPP_PHONE_NUMBER (Meta Cloud API Phone Number ID):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 109283746152431 (Phone Number ID, NOT a phone number)"
                  value={configPhoneId}
                  onChange={(e) => setConfigPhoneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
                  required
                />
                <p className="text-[10.5px] text-amber-800 font-medium mt-1">
                  ⚠️ Must contain the numeric Meta WhatsApp Cloud API Phone Number ID from Meta App Dashboard &gt; WhatsApp &gt; API Setup. Do NOT enter a regular phone number.
                </p>
              </div>

              <div>
                <label className="font-mono font-bold text-gray-900 block mb-1">
                  2. WHATSAPP_BUSINESS_ACCOUNT_ID (WABA ID):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104928374619283"
                  value={configWabaId}
                  onChange={(e) => setConfigWabaId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
                  required
                />
                <p className="text-[10.5px] text-gray-500 mt-1">
                  Found in Meta App Dashboard &gt; WhatsApp &gt; API Setup &gt; WhatsApp Business Account ID.
                </p>
              </div>

              <div>
                <label className="font-mono font-bold text-gray-900 block mb-1">
                  3. WHATSAPP_ACCESS_TOKEN (Permanent System User Token):
                </label>
                <input
                  type="password"
                  placeholder={hasServerAccessToken ? 'Currently set & protected on server — enter new value to update' : 'e.g. EAAB...'}
                  value={configToken}
                  onChange={(e) => setConfigToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[10.5px] text-gray-500 mt-1">
                  System User token with <code>whatsapp_business_messaging</code> permission. Kept strictly on the server as a secret.
                </p>
              </div>

              <div>
                <label className="font-mono font-bold text-gray-900 block mb-1">
                  4. WHATSAPP_WEBHOOK_VERIFY_TOKEN:
                </label>
                <input
                  type="text"
                  value={configVerifyToken}
                  onChange={(e) => setConfigVerifyToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
                  required
                />
                <p className="text-[10.5px] text-gray-500 mt-1">
                  Secret verification token used to establish the real-time webhook handshake with Meta servers.
                </p>
              </div>

              {/* Webhook Callback Info */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2.5">
                <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Meta Webhook Configuration
                </h4>

                <div>
                  <span className="text-[11px] text-gray-600 block">Webhook Callback URL:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg font-mono text-[11px] text-gray-700 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(webhookUrl, 'modalWebhook')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] cursor-pointer hover:bg-emerald-700"
                    >
                      {copiedField === 'modalWebhook' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSavingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Verify &amp; Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. START NEW CHAT MODAL                                                   */}
      {/* ========================================================================= */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border-2 border-[#D9C4A5]">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-black text-[#2E1C07] uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                New WhatsApp Message
              </h3>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartNewChat} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Patient Phone Number:</label>
                <input
                  type="text"
                  placeholder="+91 98401 23456"
                  value={newChatPhone}
                  onChange={(e) => setNewChatPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Patient Name (Optional):</label>
                <input
                  type="text"
                  placeholder="Kiruthika Sundar"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Initial Clinical Message:</label>
                <textarea
                  rows={3}
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {sendError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-mono">
                  {sendError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
