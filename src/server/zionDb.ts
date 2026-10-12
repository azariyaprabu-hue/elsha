import fs from 'fs';
import path from 'path';

export interface ZionUser {
  id: string;
  name: string;
  username: string;
  phone: string;
  avatar: string;
  about: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
  passwordHash?: string;
  createdAt: string;
}

export interface ZionContact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  status: 'online' | 'offline';
  lastSeen: string;
  unreadCount?: number;
}

export interface ZionMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  timeRaw: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'document' | 'audio';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  reactions?: Record<string, string>; // userId -> emoji
  isAiGenerated?: boolean;
}

export interface ZionChat {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  about?: string;
  participants: string[]; // user IDs
  adminIds?: string[];
  unreadCount: number;
  pinned?: boolean;
  lastMessage?: {
    text: string;
    senderName: string;
    timestamp: string;
    timeRaw: number;
    status: 'sending' | 'sent' | 'delivered' | 'read';
  };
  updatedAt: string;
}

export interface ZionLinkedDevice {
  id: string;
  name: string;
  platform: 'Chrome / macOS' | 'Firefox / Windows' | 'Safari / iOS' | 'WhatsApp Multi-Device' | 'Mobile App';
  ipAddress: string;
  lastActive: string;
  pairedAt: string;
  status: 'active' | 'revoked';
}

export interface ZionPairingSession {
  token: string;
  qrPayload: string;
  expiresAt: number; // timestamp ms
  createdAt: number;
  status: 'pending' | 'paired' | 'expired';
  pairedDeviceId?: string;
}

export interface ZionAutoResponderConfig {
  enabled: boolean;
  prompt: string;
  customMessage: string;
  respondToAll: boolean;
}

interface ZionDataStore {
  users: ZionUser[];
  contacts: ZionContact[];
  chats: ZionChat[];
  messages: ZionMessage[];
  linkedDevices: ZionLinkedDevice[];
  autoResponder: ZionAutoResponderConfig;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'zion_database.json');

class ZionDatabase {
  private data: ZionDataStore;
  private pairingSessions: Map<string, ZionPairingSession> = new Map();

  constructor() {
    this.data = this.loadDatabase();
    this.seedInitialDataIfEmpty();
  }

  private loadDatabase(): ZionDataStore {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[ZION DB] Error loading database file, initializing fresh:', e);
    }

    return {
      users: [],
      contacts: [],
      chats: [],
      messages: [],
      linkedDevices: [],
      autoResponder: {
        enabled: false,
        prompt: 'You are ZION AI assistant. Politely acknowledge the message and let them know the user is away and will reply shortly.',
        customMessage: 'Hi! I am currently away from keyboard. ZION AI is automatically logging your message.',
        respondToAll: true,
      },
    };
  }

  public save(): void {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[ZION DB] Error persisting database file:', err);
    }
  }

  private seedInitialDataIfEmpty(): void {
    if (this.data.users.length === 0) {
      const primaryUser: ZionUser = {
        id: 'user-zion-primary',
        name: 'Prabu Azariya',
        username: 'azariyaprabu',
        phone: '+91 94482 88008',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        about: 'Building with ZION AI • Available for collaborations',
        status: 'online',
        lastSeen: 'Just now',
        createdAt: new Date().toISOString(),
      };
      this.data.users.push(primaryUser);
    }

    if (this.data.contacts.length === 0) {
      this.data.contacts = [
        {
          id: 'contact-kiruthika',
          name: 'Kiruthika Sundar',
          phone: '+91 98401 22334',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
          about: 'Sports Nutritionist & Wellness Consultant',
          status: 'online',
          lastSeen: 'Online',
          unreadCount: 2,
        },
        {
          id: 'contact-dr-bharath',
          name: 'Dr. Bharath Kumar',
          phone: '+91 79969 94499',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
          about: 'Sports Medicine Director | Clinic Consultations',
          status: 'offline',
          lastSeen: 'Today at 10:15 AM',
          unreadCount: 0,
        },
        {
          id: 'contact-ananya',
          name: 'Ananya Sharma',
          phone: '+91 91234 56789',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
          about: 'Always learning • AI engineer',
          status: 'online',
          lastSeen: 'Online',
          unreadCount: 0,
        },
        {
          id: 'contact-dinesh',
          name: 'Dinesh Karthik',
          phone: '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
          about: 'Running 10k this weekend 🏃',
          status: 'offline',
          lastSeen: 'Yesterday',
          unreadCount: 0,
        },
        {
          id: 'contact-zion-ai',
          name: 'ZION AI Assistant',
          phone: 'ZION-BOT-01',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80',
          about: 'Official Intelligent AI Assistant (Gemini 3.8)',
          status: 'online',
          lastSeen: 'Always active',
          unreadCount: 0,
        },
      ];
    }

    if (this.data.chats.length === 0) {
      const now = Date.now();
      this.data.chats = [
        {
          id: 'chat-kiruthika',
          isGroup: false,
          name: 'Kiruthika Sundar',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
          participants: ['user-zion-primary', 'contact-kiruthika'],
          unreadCount: 2,
          pinned: true,
          lastMessage: {
            text: 'வணக்கம்! The patient prescription has been reviewed. Can you verify?',
            senderName: 'Kiruthika Sundar',
            timestamp: '11:42 AM',
            timeRaw: now - 1000 * 60 * 15,
            status: 'delivered',
          },
          updatedAt: new Date(now - 1000 * 60 * 15).toISOString(),
        },
        {
          id: 'chat-dr-bharath',
          isGroup: false,
          name: 'Dr. Bharath Kumar',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
          participants: ['user-zion-primary', 'contact-dr-bharath'],
          unreadCount: 0,
          pinned: false,
          lastMessage: {
            text: 'Great progress on the clinical portal. Let us sync at 3 PM.',
            senderName: 'Dr. Bharath Kumar',
            timestamp: '10:14 AM',
            timeRaw: now - 1000 * 60 * 90,
            status: 'read',
          },
          updatedAt: new Date(now - 1000 * 60 * 90).toISOString(),
        },
        {
          id: 'chat-group-sports-med',
          isGroup: true,
          name: 'ZION Sports Medicine Team',
          avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=256&h=256&q=80',
          about: 'Clinical directors, nutritionists, and EMR technicians',
          participants: ['user-zion-primary', 'contact-kiruthika', 'contact-dr-bharath', 'contact-dinesh'],
          adminIds: ['user-zion-primary', 'contact-dr-bharath'],
          unreadCount: 0,
          pinned: true,
          lastMessage: {
            text: 'Dinesh: Updated the weekly marathon training schedules.',
            senderName: 'Dinesh Karthik',
            timestamp: '09:30 AM',
            timeRaw: now - 1000 * 60 * 180,
            status: 'read',
          },
          updatedAt: new Date(now - 1000 * 60 * 180).toISOString(),
        },
        {
          id: 'chat-zion-ai',
          isGroup: false,
          name: 'ZION AI Assistant',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80',
          participants: ['user-zion-primary', 'contact-zion-ai'],
          unreadCount: 0,
          pinned: true,
          lastMessage: {
            text: 'I am ready to help you with Tamil translations, drafting replies, and chat summaries!',
            senderName: 'ZION AI Assistant',
            timestamp: '08:00 AM',
            timeRaw: now - 1000 * 60 * 300,
            status: 'read',
          },
          updatedAt: new Date(now - 1000 * 60 * 300).toISOString(),
        },
      ];
    }

    if (this.data.messages.length === 0) {
      const now = Date.now();
      this.data.messages = [
        {
          id: 'msg-k1',
          chatId: 'chat-kiruthika',
          senderId: 'user-zion-primary',
          senderName: 'Prabu Azariya',
          text: 'Hi Kiruthika, have you had a chance to check the latest lab reports for Kiruthika Sundar?',
          timestamp: '11:30 AM',
          timeRaw: now - 1000 * 60 * 25,
          status: 'read',
          type: 'text',
        },
        {
          id: 'msg-k2',
          chatId: 'chat-kiruthika',
          senderId: 'contact-kiruthika',
          senderName: 'Kiruthika Sundar',
          text: 'Yes! TSH levels have stabilized, and we updated the nutrition protocol.',
          timestamp: '11:35 AM',
          timeRaw: now - 1000 * 60 * 20,
          status: 'read',
          type: 'text',
        },
        {
          id: 'msg-k3',
          chatId: 'chat-kiruthika',
          senderId: 'contact-kiruthika',
          senderName: 'Kiruthika Sundar',
          text: 'வணக்கம்! The patient prescription has been reviewed. Can you verify?',
          timestamp: '11:42 AM',
          timeRaw: now - 1000 * 60 * 15,
          status: 'delivered',
          type: 'text',
        },
        // ZION AI Messages
        {
          id: 'msg-ai-1',
          chatId: 'chat-zion-ai',
          senderId: 'contact-zion-ai',
          senderName: 'ZION AI Assistant',
          text: 'Hello Prabu! I am your ZION AI communication copilot. You can ask me to draft professional responses, translate messages between Tamil and English, or summarize any conversation.',
          timestamp: '08:00 AM',
          timeRaw: now - 1000 * 60 * 300,
          status: 'read',
          type: 'text',
        },
      ];
    }

    if (this.data.linkedDevices.length === 0) {
      this.data.linkedDevices = [
        {
          id: 'device-current',
          name: 'MacBook Pro 16" (ZION Web)',
          platform: 'Chrome / macOS',
          ipAddress: '192.168.1.42 (Current Device)',
          lastActive: 'Active Now',
          pairedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          status: 'active',
        },
      ];
    }

    this.save();
  }

  // --- Users & Auth ---
  public getPrimaryUser(): ZionUser {
    return this.data.users[0];
  }

  public getUserById(id: string): ZionUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByUsername(username: string): ZionUser | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public createUser(user: ZionUser): ZionUser {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<ZionUser>): ZionUser | undefined {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Contacts ---
  public getContacts(): ZionContact[] {
    return this.data.contacts;
  }

  public addContact(contact: ZionContact): ZionContact {
    this.data.contacts.push(contact);
    this.save();
    return contact;
  }

  public deleteContact(id: string): boolean {
    const idx = this.data.contacts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.data.contacts.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // --- Chats ---
  public getChats(): ZionChat[] {
    return this.data.chats.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const tA = a.lastMessage?.timeRaw || 0;
      const tB = b.lastMessage?.timeRaw || 0;
      return tB - tA;
    });
  }

  public getChatById(id: string): ZionChat | undefined {
    return this.data.chats.find((c) => c.id === id);
  }

  public createChat(chat: ZionChat): ZionChat {
    this.data.chats.unshift(chat);
    this.save();
    return chat;
  }

  public updateChat(id: string, updates: Partial<ZionChat>): ZionChat | undefined {
    const chat = this.data.chats.find((c) => c.id === id);
    if (!chat) return undefined;
    Object.assign(chat, updates);
    this.save();
    return chat;
  }

  // --- Messages ---
  public getMessages(chatId: string): ZionMessage[] {
    return this.data.messages
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => a.timeRaw - b.timeRaw);
  }

  public addMessage(msg: ZionMessage): ZionMessage {
    this.data.messages.push(msg);

    // Update parent chat snippet
    const chat = this.data.chats.find((c) => c.id === msg.chatId);
    if (chat) {
      chat.lastMessage = {
        text: msg.type === 'image' ? '📷 Photo' : msg.type === 'document' ? '📄 Document' : msg.text,
        senderName: msg.senderName,
        timestamp: msg.timestamp,
        timeRaw: msg.timeRaw,
        status: msg.status,
      };
      chat.updatedAt = new Date().toISOString();
      if (msg.senderId !== 'user-zion-primary') {
        chat.unreadCount = (chat.unreadCount || 0) + 1;
      }
    }

    this.save();
    return msg;
  }

  public deleteMessage(id: string): boolean {
    const idx = this.data.messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.messages.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public reactToMessage(msgId: string, userId: string, emoji: string): ZionMessage | undefined {
    const msg = this.data.messages.find((m) => m.id === msgId);
    if (!msg) return undefined;
    if (!msg.reactions) msg.reactions = {};
    if (msg.reactions[userId] === emoji) {
      delete msg.reactions[userId];
    } else {
      msg.reactions[userId] = emoji;
    }
    this.save();
    return msg;
  }

  public markChatAsRead(chatId: string): void {
    const chat = this.data.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
      this.data.messages.forEach((m) => {
        if (m.chatId === chatId && m.senderId !== 'user-zion-primary') {
          m.status = 'read';
        }
      });
      this.save();
    }
  }

  // --- Devices & QR Pairing Sessions ---
  public getLinkedDevices(): ZionLinkedDevice[] {
    return this.data.linkedDevices;
  }

  public addLinkedDevice(device: ZionLinkedDevice): ZionLinkedDevice {
    this.data.linkedDevices.push(device);
    this.save();
    return device;
  }

  public removeLinkedDevice(id: string): boolean {
    const idx = this.data.linkedDevices.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.data.linkedDevices.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public createPairingSession(): ZionPairingSession {
    const token = 'zion_pair_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    const qrPayload = JSON.stringify({
      app: 'ZION',
      version: '2.4.0',
      token,
      url: '/api/zion/devices/pair',
      timestamp: Date.now(),
    });
    const session: ZionPairingSession = {
      token,
      qrPayload,
      expiresAt: Date.now() + 60 * 1000, // 60 seconds validity
      createdAt: Date.now(),
      status: 'pending',
    };
    this.pairingSessions.set(token, session);
    return session;
  }

  public getPairingSession(token: string): ZionPairingSession | undefined {
    const session = this.pairingSessions.get(token);
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      session.status = 'expired';
    }
    return session;
  }

  public pairSession(token: string, clientInfo?: { name?: string; platform?: string; ip?: string }): { success: boolean; device?: ZionLinkedDevice; error?: string } {
    const session = this.getPairingSession(token);
    if (!session) {
      return { success: false, error: 'Pairing code not found or invalid' };
    }
    if (session.status === 'expired' || Date.now() > session.expiresAt) {
      return { success: false, error: 'QR Code has expired. Please refresh the QR code.' };
    }
    if (session.status === 'paired') {
      return { success: false, error: 'This QR code has already been paired.' };
    }

    const newDevice: ZionLinkedDevice = {
      id: 'device-' + Date.now(),
      name: clientInfo?.name || 'Linked Browser Companion',
      platform: (clientInfo?.platform as any) || 'Mobile App',
      ipAddress: clientInfo?.ip || '192.168.1.108',
      lastActive: 'Active Now',
      pairedAt: new Date().toISOString(),
      status: 'active',
    };

    session.status = 'paired';
    session.pairedDeviceId = newDevice.id;
    this.addLinkedDevice(newDevice);

    return { success: true, device: newDevice };
  }

  // --- Auto Responder ---
  public getAutoResponder(): ZionAutoResponderConfig {
    return this.data.autoResponder;
  }

  public updateAutoResponder(updates: Partial<ZionAutoResponderConfig>): ZionAutoResponderConfig {
    Object.assign(this.data.autoResponder, updates);
    this.save();
    return this.data.autoResponder;
  }
}

export const zionDb = new ZionDatabase();
