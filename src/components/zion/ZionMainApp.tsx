import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  UserCheck,
  Bot,
  Laptop,
  Settings,
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Languages,
  Sparkles,
  FileText,
  Camera,
  Download,
  Trash2,
  Heart,
  ThumbsUp,
  Pin,
  Moon,
  Sun,
  X,
  ArrowLeft,
  Loader2,
  Clock,
  Radio,
  FileUp,
  Image as ImageIcon,
} from 'lucide-react';
import { ZionLogo } from './ZionLogo';
import { ZionQrScannerModal } from './ZionQrScannerModal';
import { ZionAiToolsDrawer } from './ZionAiToolsDrawer';
import { ZionNewChatModal } from './ZionNewChatModal';
import { ZionLinkedDevicesView } from './ZionLinkedDevicesView';
import { ZionSettingsModal } from './ZionSettingsModal';
import { ZionChat, ZionContact, ZionMessage, ZionUser, ZionLinkedDevice } from '../../server/zionDb';

interface ZionMainAppProps {
  onOpenClinicalPortal?: () => void;
}

export const ZionMainApp: React.FC<ZionMainAppProps> = ({ onOpenClinicalPortal }) => {
  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<'chats' | 'contacts' | 'groups' | 'ai' | 'devices' | 'settings'>('chats');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data State
  const [currentUser, setCurrentUser] = useState<ZionUser>({
    id: 'user-zion-primary',
    name: 'Prabu Azariya',
    username: 'azariyaprabu',
    phone: '+91 94482 88008',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    about: 'Building with ZION AI • Available for collaborations',
    status: 'online',
    lastSeen: 'Just now',
    createdAt: new Date().toISOString(),
  });

  const [chats, setChats] = useState<ZionChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('chat-kiruthika');
  const [messages, setMessages] = useState<ZionMessage[]>([]);
  const [contacts, setContacts] = useState<ZionContact[]>([]);
  const [linkedDevices, setLinkedDevices] = useState<ZionLinkedDevice[]>([]);

  // Input & Message Drafting
  const [inputText, setInputText] = useState('');
  const [smartReplySuggestions, setSmartReplySuggestions] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [inlineTranslations, setInlineTranslations] = useState<Record<string, string>>({});
  const [translatingMsgId, setTranslatingMsgId] = useState<string | null>(null);

  // Appearance & Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wallpaper, setWallpaper] = useState('classic');

  // Modal Triggers
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAiToolsOpen, setIsAiToolsOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Call simulation alert
  const [callAlert, setCallAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSmartRepliedMsgIdRef = useRef<string | null>(null);
  const isFetchingSmartRepliesRef = useRef<boolean>(false);

  // Initial Data Fetching
  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(refreshChatsAndMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages whenever activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      lastSmartRepliedMsgIdRef.current = null;
      fetchMessagesForChat(activeChatId);
    }
  }, [activeChatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInitialData = async () => {
    try {
      const [uRes, cRes, contRes, dRes] = await Promise.all([
        fetch('/api/zion/auth/me'),
        fetch('/api/zion/chats'),
        fetch('/api/zion/contacts'),
        fetch('/api/zion/devices'),
      ]);

      const [uData, cData, contData, dData] = await Promise.all([
        uRes.json(),
        cRes.json(),
        contRes.json(),
        dRes.json(),
      ]);

      if (uData.success) setCurrentUser(uData.user);
      if (cData.success) {
        setChats(cData.chats);
        if (cData.chats.length > 0 && !activeChatId) {
          setActiveChatId(cData.chats[0].id);
        }
      }
      if (contData.success) setContacts(contData.contacts);
      if (dData.success) setLinkedDevices(dData.devices);
    } catch (err) {
      console.warn('Initial fetch error:', err);
    }
  };

  const refreshChatsAndMessages = async () => {
    try {
      const cRes = await fetch('/api/zion/chats');
      const cData = await cRes.json();
      if (cData.success) setChats(cData.chats);

      if (activeChatId) {
        const mRes = await fetch(`/api/zion/chats/${activeChatId}/messages`);
        const mData = await mRes.json();
        if (mData.success) {
          setMessages(mData.messages);

          // Update smart replies only once for a given incoming message
          const lastMsg = mData.messages[mData.messages.length - 1];
          if (lastMsg && lastMsg.senderId !== currentUser.id && lastMsg.text) {
            if (lastSmartRepliedMsgIdRef.current !== lastMsg.id && !isFetchingSmartRepliesRef.current) {
              lastSmartRepliedMsgIdRef.current = lastMsg.id;
              fetchSmartReplies(lastMsg.text);
            }
          }
        }
      }
    } catch {}
  };

  const generateLocalSuggestions = (text: string): string[] => {
    const lower = (text || '').toLowerCase();
    if (lower.includes('வணக்கம்') || lower.includes('vanakkam')) {
      return ['வணக்கம்! எப்படி இருக்கீங்க?', 'வணக்கம், உதவ தயார்!', 'வணக்கம், மகிழ்ச்சி!'];
    }
    if (lower.includes('?') || lower.includes('when') || lower.includes('how') || lower.includes('why')) {
      return ['Yes, checking right now!', 'Let me review and confirm.', 'Will check and update!'];
    }
    if (lower.includes('thanks') || lower.includes('நன்றி') || lower.includes('thank you')) {
      return ['You are most welcome! 😊', 'Glad to help anytime.', 'No problem!'];
    }
    if (lower.includes('meeting') || lower.includes('call') || lower.includes('time')) {
      return ['Confirmed for this time.', 'Ready for the call!', 'Sounds good, see you then.'];
    }
    return ['Sounds great, thanks!', 'I will review this shortly.', 'Will update you soon.'];
  };

  const fetchMessagesForChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/zion/chats/${chatId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);

        // Check if last message warrants smart replies
        const lastMsg = data.messages[data.messages.length - 1];
        if (lastMsg && lastMsg.senderId !== currentUser.id && lastMsg.text) {
          if (lastSmartRepliedMsgIdRef.current !== lastMsg.id && !isFetchingSmartRepliesRef.current) {
            lastSmartRepliedMsgIdRef.current = lastMsg.id;
            fetchSmartReplies(lastMsg.text);
          }
        } else {
          lastSmartRepliedMsgIdRef.current = null;
          setSmartReplySuggestions([]);
        }
      }
    } catch (err) {
      console.warn('Fetch messages error:', err);
    }
  };

  const fetchSmartReplies = async (msgText: string) => {
    if (!msgText || isFetchingSmartRepliesRef.current) return;
    isFetchingSmartRepliesRef.current = true;
    try {
      const res = await fetch('/api/zion/ai/smart-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: msgText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSmartReplySuggestions(data.suggestions);
          return;
        }
      }
      setSmartReplySuggestions(generateLocalSuggestions(msgText));
    } catch {
      setSmartReplySuggestions(generateLocalSuggestions(msgText));
    } finally {
      isFetchingSmartRepliesRef.current = false;
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activeChatId) return;

    setIsSending(true);
    setInputText('');
    setSmartReplySuggestions([]);
    lastSmartRepliedMsgIdRef.current = null;

    try {
      const res = await fetch(`/api/zion/chats/${activeChatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend.trim(), type: 'text' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        refreshChatsAndMessages();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatId) return;

    setShowAttachmentMenu(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const upRes = await fetch('/api/zion/upload', {
        method: 'POST',
        body: formData,
      });
      const upData = await upRes.json();

      if (upData.success) {
        // Send message with uploaded media
        const msgRes = await fetch(`/api/zion/chats/${activeChatId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: file.name,
            type: upData.type,
            mediaUrl: upData.fileUrl,
            fileName: upData.fileName,
            fileSize: upData.fileSize,
          }),
        });
        const msgData = await msgRes.json();
        if (msgData.success) {
          setMessages((prev) => [...prev, msgData.message]);
          refreshChatsAndMessages();
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleTranslateInline = async (msgId: string, text: string) => {
    setTranslatingMsgId(msgId);
    try {
      const isTamil = /[\u0B80-\u0BFF]/.test(text);
      const targetLang = isTamil ? 'en' : 'ta';

      const res = await fetch('/api/zion/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      if (data.success) {
        setInlineTranslations((prev) => ({
          ...prev,
          [msgId]: data.translatedText,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTranslatingMsgId(null);
    }
  };

  const handleReactToMessage = async (msgId: string, emoji: string) => {
    try {
      const res = await fetch(`/api/zion/messages/${msgId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? data.message : m))
        );
      }
    } catch {}
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      await fetch(`/api/zion/messages/${msgId}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {}
  };

  const handleStartDirectChat = (contact: ZionContact) => {
    let existingChat = chats.find(
      (c) => !c.isGroup && c.participants.includes(contact.id)
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
      setActiveNavTab('chats');
    } else {
      // Create new chat
      const newChat: ZionChat = {
        id: 'chat_' + Date.now(),
        isGroup: false,
        name: contact.name,
        avatar: contact.avatar,
        participants: [currentUser.id, contact.id],
        unreadCount: 0,
        pinned: false,
        updatedAt: new Date().toISOString(),
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setActiveNavTab('chats');
    }
  };

  const handleCreateGroup = async (groupData: { name: string; participantIds: string[]; about?: string }) => {
    try {
      const res = await fetch('/api/zion/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });
      const data = await res.json();
      if (data.success) {
        setChats((prev) => [data.chat, ...prev]);
        setActiveChatId(data.chat.id);
        setActiveNavTab('chats');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddContact = async (contactData: { name: string; phone: string; about?: string }) => {
    try {
      const res = await fetch('/api/zion/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (data.success) {
        setContacts((prev) => [...prev, data.contact]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlinkDevice = async (id: string) => {
    try {
      await fetch(`/api/zion/devices/${id}`, { method: 'DELETE' });
      setLinkedDevices((prev) => prev.filter((d) => d.id !== id));
    } catch {}
  };

  const handleSimulateCall = (type: 'voice' | 'video') => {
    setCallAlert(`Initiating secure ZION ${type} call...`);
    setTimeout(() => setCallAlert(null), 3000);
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const filteredChats = chats.filter((c) => {
    if (chatFilter === 'unread' && (!c.unreadCount || c.unreadCount === 0)) return false;
    if (chatFilter === 'groups' && !c.isGroup) return false;
    if (chatFilter === 'ai' && c.id !== 'chat-zion-ai') return false;
    if (searchQuery.trim()) {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div
      className={`zion-app-root w-full h-screen flex flex-col overflow-hidden font-sans select-none ${
        isDarkMode ? 'dark bg-[#070518] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Application Header Bar */}
      <header className="h-14 px-4 bg-white dark:bg-[#0B0826] border-b border-purple-200 dark:border-purple-950 flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center gap-3">
          <ZionLogo size={32} showText={true} />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[10px] font-bold text-purple-700 dark:text-purple-300">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Encrypted Sync Active</span>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* AI Tools Trigger */}
          <button
            onClick={() => setIsAiToolsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Open ZION AI Tools Suite (Gemini 3.8)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Tools</span>
          </button>

          {/* Linked Devices & QR Code Scanner */}
          <button
            onClick={() => setActiveNavTab('devices')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeNavTab === 'devices'
                ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Linked Devices & QR Scanner"
          >
            <Laptop className="w-4 h-4" />
          </button>

          {/* Theme Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Settings & System Docs"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Clinical Portal Switcher */}
          {onOpenClinicalPortal && (
            <button
              onClick={onOpenClinicalPortal}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
              title="Open Clinical Dossier Portal"
            >
              Clinical EMR
            </button>
          )}

          {/* User Profile Avatar */}
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500 cursor-pointer hover:opacity-90 transition-opacity ml-1"
            title={currentUser.name}
          />
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ======================================================================= */}
        {/* 1. LEFT SIDEBAR (CHATS, CONTACTS, GROUPS)                                */}
        {/* ======================================================================= */}
        {activeNavTab === 'devices' ? (
          <ZionLinkedDevicesView
            onOpenScanner={() => setIsScannerOpen(true)}
            devices={linkedDevices}
            onUnlinkDevice={handleUnlinkDevice}
            onRefreshDevices={fetchInitialData}
          />
        ) : (
          <>
            {/* Chats Sidebar */}
            <div
              className={`w-full md:w-88 lg:w-96 flex flex-col shrink-0 bg-white dark:bg-[#0B0826] border-r border-purple-200 dark:border-purple-950 ${
                activeChatId && window.innerWidth < 768 ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Sidebar Header & Search */}
              <div className="p-3.5 space-y-2.5 border-b border-purple-100 dark:border-purple-950 bg-slate-50/50 dark:bg-purple-950/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-base tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">
                    {activeNavTab === 'contacts'
                      ? 'Contacts Directory'
                      : activeNavTab === 'groups'
                      ? 'Group Channels'
                      : 'Messages'}
                  </h2>
                  <button
                    onClick={() => setIsNewChatOpen(true)}
                    className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer transition-all active:scale-95"
                    title="New Chat or Group"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats, contacts, or messages..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-purple-950/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Filter Pills */}
                {activeNavTab === 'chats' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'unread', label: 'Unread' },
                      { id: 'groups', label: 'Groups' },
                      { id: 'ai', label: 'AI Bot' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setChatFilter(f.id as any)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors shrink-0 ${
                          chatFilter === f.id
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-slate-400 hover:bg-purple-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Thread List */}
              <div className="flex-1 overflow-y-auto divide-y divide-purple-50 dark:divide-purple-950/40">
                {activeNavTab === 'contacts' ? (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleStartDirectChat(contact)}
                      className="p-3.5 flex items-center justify-between hover:bg-purple-50/60 dark:hover:bg-purple-950/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-11 h-11 rounded-full object-cover ring-1 ring-purple-300 dark:ring-purple-800"
                          />
                          {contact.status === 'online' && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0B0826]" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {contact.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {contact.about}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-purple-600 font-bold">
                        Chat
                      </span>
                    </div>
                  ))
                ) : (
                  filteredChats.map((chat) => {
                    const isActive = chat.id === activeChatId;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-purple-100/70 dark:bg-purple-950/60 border-l-4 border-purple-600'
                            : 'hover:bg-purple-50/40 dark:hover:bg-purple-950/20'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-12 h-12 rounded-full object-cover ring-1 ring-purple-200 dark:ring-purple-800"
                          />
                          {chat.id === 'chat-zion-ai' && (
                            <div className="absolute -top-1 -right-1 p-0.5 bg-purple-600 text-white rounded-full">
                              <Sparkles className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-black text-xs text-slate-900 dark:text-white truncate">
                              {chat.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                              {chat.lastMessage?.timestamp || '11:00 AM'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                              {chat.lastMessage?.status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              ) : chat.lastMessage?.status === 'delivered' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="truncate">{chat.lastMessage?.text || 'No messages yet'}</span>
                            </p>

                            {chat.unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-white font-mono text-[9px] font-black shrink-0">
                                {chat.unreadCount}
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

            {/* ======================================================================= */}
            {/* 2. RIGHT CHAT WINDOW (WHATSAPP CONVERSATION CANVAS)                    */}
            {/* ======================================================================= */}
            <div
              className={`flex-1 flex flex-col h-full bg-[#EDE7F6] dark:bg-[#070518] relative ${
                !activeChatId && window.innerWidth < 768 ? 'hidden' : 'flex'
              }`}
            >
              {activeChat ? (
                <>
                  {/* Chat Top Bar */}
                  <div className="h-16 px-4 bg-white dark:bg-[#0B0826] border-b border-purple-200 dark:border-purple-950 flex items-center justify-between shrink-0 z-20 shadow-2xs">
                    <div className="flex items-center gap-3">
                      {/* Mobile Back Button */}
                      <button
                        onClick={() => setActiveChatId('')}
                        className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="relative">
                        <img
                          src={activeChat.avatar}
                          alt={activeChat.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-300 dark:ring-purple-800"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0B0826]" />
                      </div>

                      <div>
                        <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                          <span>{activeChat.name}</span>
                          {activeChat.isGroup && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                              Group
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {activeChat.id === 'chat-zion-ai'
                            ? 'Gemini 3.8 Flash • Always Online'
                            : 'Online'}
                        </p>
                      </div>
                    </div>

                    {/* Chat Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateCall('voice')}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-xl transition-colors cursor-pointer"
                        title="Voice Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSimulateCall('video')}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-xl transition-colors cursor-pointer"
                        title="Video Call"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsAiToolsOpen(true)}
                        className="p-2 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-xl transition-colors cursor-pointer"
                        title="Open AI Tools Drawer"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Call Simulation Toast */}
                  {callAlert && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-full shadow-lg animate-bounce flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>{callAlert}</span>
                    </div>
                  )}

                  {/* Chat Message Scrollable Stream */}
                  <div
                    className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 ${
                      wallpaper === 'classic'
                        ? 'bg-[#EDE7F6] dark:bg-[#070518]'
                        : wallpaper === 'purple'
                        ? 'bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-[#0B0826]'
                        : wallpaper === 'minimal'
                        ? 'bg-white dark:bg-[#070518]'
                        : 'bg-[#0B0826]'
                    }`}
                  >
                    {/* Encryption Notice Pill */}
                    <div className="flex justify-center my-2">
                      <div className="px-3.5 py-1.5 rounded-xl bg-purple-200/60 dark:bg-purple-950/60 border border-purple-300/80 dark:border-purple-800/80 text-[10.5px] text-purple-900 dark:text-purple-300 font-bold flex items-center gap-1.5 shadow-2xs">
                        <span>🔒</span>
                        <span>Messages and calls are end-to-end encrypted. Nobody outside can read them.</span>
                      </div>
                    </div>

                    {/* Messages Render Loop */}
                    {messages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      const translation = inlineTranslations[msg.id];

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-xs relative transition-all ${
                              isMe
                                ? 'bg-purple-600 text-white rounded-tr-xs'
                                : 'bg-white dark:bg-[#110D30] text-slate-900 dark:text-white rounded-tl-xs border border-purple-100 dark:border-purple-950'
                            }`}
                          >
                            {/* Group Sender Attribution */}
                            {activeChat.isGroup && !isMe && (
                              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block mb-0.5">
                                {msg.senderName}
                              </span>
                            )}

                            {/* Media Attachment: Image */}
                            {msg.type === 'image' && msg.mediaUrl && (
                              <div className="mb-2 rounded-xl overflow-hidden max-h-60 bg-black/10">
                                <img
                                  src={msg.mediaUrl}
                                  alt="Attachment"
                                  className="w-full h-auto object-cover"
                                />
                              </div>
                            )}

                            {/* Media Attachment: Document */}
                            {msg.type === 'document' && (
                              <div
                                className={`mb-2 p-2.5 rounded-xl flex items-center justify-between gap-3 ${
                                  isMe
                                    ? 'bg-purple-700/80 text-white'
                                    : 'bg-purple-50 dark:bg-purple-950/50 text-slate-900 dark:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-purple-300" />
                                  <div className="text-xs">
                                    <span className="font-bold block truncate max-w-[160px]">
                                      {msg.fileName || 'document.pdf'}
                                    </span>
                                    <span className="text-[10px] opacity-75">{msg.fileSize || '1.2 MB'}</span>
                                  </div>
                                </div>
                                {msg.mediaUrl && (
                                  <a
                                    href={msg.mediaUrl}
                                    download={msg.fileName}
                                    className="p-1 rounded bg-white/20 hover:bg-white/30"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Message Text */}
                            <p className="text-[12.5px] leading-relaxed break-words whitespace-pre-wrap font-medium">
                              {msg.text}
                            </p>

                            {/* Inline Tamil/English Translation Box */}
                            {translation && (
                              <div
                                className={`mt-2 pt-2 border-t text-xs font-semibold ${
                                  isMe
                                    ? 'border-purple-500 text-purple-100'
                                    : 'border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300'
                                }`}
                              >
                                <span className="text-[9.5px] uppercase font-bold tracking-wider block mb-0.5 opacity-80">
                                  ZION AI Translation:
                                </span>
                                <p>{translation}</p>
                              </div>
                            )}

                            {/* Message Meta: Time & Delivery Status */}
                            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75">
                              <span>{msg.timestamp}</span>
                              {isMe && (
                                <span>
                                  {msg.status === 'read' ? (
                                    <CheckCheck className="w-3 h-3 text-purple-200" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Hover Action Bar: Inline Translation, Reactions, Delete */}
                            <div
                              className={`absolute -bottom-3 ${
                                isMe ? 'right-2' : 'left-2'
                              } opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#1A1444] border border-purple-200 dark:border-purple-800 rounded-full px-2 py-0.5 shadow-md flex items-center gap-1 z-10`}
                            >
                              <button
                                onClick={() => handleTranslateInline(msg.id, msg.text)}
                                disabled={translatingMsgId === msg.id}
                                className="p-0.5 text-purple-700 dark:text-purple-400 hover:scale-110"
                                title="Translate message"
                              >
                                {translatingMsgId === msg.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Languages className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReactToMessage(msg.id, '❤️')}
                                className="p-0.5 hover:scale-125 transition-transform"
                                title="Love"
                              >
                                ❤️
                              </button>
                              <button
                                onClick={() => handleReactToMessage(msg.id, '👍')}
                                className="p-0.5 hover:scale-125 transition-transform"
                                title="Thumbs Up"
                              >
                                👍
                              </button>
                              {isMe && (
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-0.5 text-red-500 hover:scale-110"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Message Reactions Pill */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className="flex items-center gap-1 -mt-1 px-2 py-0.5 rounded-full bg-white dark:bg-[#1A1444] border border-purple-200 dark:border-purple-800 shadow-2xs text-[10px]">
                              {Object.values(msg.reactions).map((emoji, idx) => (
                                <span key={idx}>{emoji}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Smart Replies Suggestion Bar */}
                  {smartReplySuggestions.length > 0 && (
                    <div className="px-4 py-2 bg-purple-50/90 dark:bg-purple-950/40 border-t border-purple-100 dark:border-purple-900 flex items-center gap-2 overflow-x-auto">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300 shrink-0">
                        Smart Replies:
                      </span>
                      {smartReplySuggestions.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(reply)}
                          className="px-3 py-1 rounded-full bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-purple-600 shadow-2xs transition-all shrink-0 active:scale-95 cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input & Sending Dock */}
                  <div className="p-3 bg-white dark:bg-[#0B0826] border-t border-purple-200 dark:border-purple-950 flex items-center gap-2 shrink-0 relative">
                    {/* Attachment Menu Popup */}
                    {showAttachmentMenu && (
                      <div className="absolute bottom-16 left-4 z-40 bg-white dark:bg-[#0B0826] border border-purple-200 dark:border-purple-800 rounded-2xl p-2 shadow-xl flex flex-col gap-1 w-48 animate-in slide-in-from-bottom-2 duration-150">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer text-left"
                        >
                          <ImageIcon className="w-4 h-4 text-purple-600" />
                          <span>Photos & Videos</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer text-left"
                        >
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span>Document or PDF</span>
                        </button>
                        <button
                          onClick={() => setIsScannerOpen(true)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer text-left"
                        >
                          <Camera className="w-4 h-4 text-purple-600" />
                          <span>QR Camera</span>
                        </button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Attachment Trigger */}
                    <button
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="p-2.5 text-slate-500 hover:text-purple-600 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Text Input Area */}
                    <div className="flex-1 relative">
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message or Tamil text (Enter to send)..."
                        rows={1}
                        className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-purple-200 dark:border-purple-900 bg-slate-50 dark:bg-purple-950/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none max-h-24"
                      />
                      <button
                        type="button"
                        onClick={() => setIsAiToolsOpen(true)}
                        className="absolute right-2.5 top-2.5 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform cursor-pointer"
                        title="AI Tools"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={isSending || !inputText.trim()}
                      className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                      title="Send"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="p-4 bg-purple-100 dark:bg-purple-950 rounded-3xl">
                    <MessageSquare className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    ZION AI WhatsApp Communication Suite
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Select a conversation from the sidebar or click "+" to start a new chat with your contacts or ZION AI.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="h-14 md:hidden bg-white dark:bg-[#0B0826] border-t border-purple-200 dark:border-purple-950 flex items-center justify-around shrink-0 z-30">
        {[
          { id: 'chats', label: 'Chats', icon: MessageSquare },
          { id: 'contacts', label: 'Contacts', icon: UserCheck },
          { id: 'groups', label: 'Groups', icon: Users },
          { id: 'devices', label: 'Devices', icon: Laptop },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'settings') {
                  setIsSettingsOpen(true);
                } else {
                  setActiveNavTab(tab.id as any);
                }
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 font-bold'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modal Components */}
      <ZionQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onPairSuccess={(device) => {
          setLinkedDevices((prev) => [...prev, device]);
          setActiveNavTab('devices');
        }}
      />

      <ZionAiToolsDrawer
        isOpen={isAiToolsOpen}
        onClose={() => setIsAiToolsOpen(false)}
        activeChatText={messages.map((m) => `${m.senderName}: ${m.text}`).join('\n')}
        onInsertToChat={(text) => {
          setInputText(text);
          setIsAiToolsOpen(false);
        }}
      />

      <ZionNewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        contacts={contacts}
        onStartDirectChat={handleStartDirectChat}
        onCreateGroup={handleCreateGroup}
        onAddContact={handleAddContact}
      />

      <ZionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={(updates) => setCurrentUser((prev) => ({ ...prev, ...updates }))}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        wallpaper={wallpaper}
        onChangeWallpaper={(wp) => setWallpaper(wp)}
      />
    </div>
  );
};
