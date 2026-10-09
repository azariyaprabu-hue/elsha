import fs from 'fs';
import path from 'path';

export interface WhatsAppAccount {
  id: string;
  platform: 'whatsapp_web_md' | 'meta_cloud_api';
  displayPhoneNumber: string;
  verifiedName: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  wabaId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  webhookVerifyToken?: string;
  qualityRating?: string;
  connectedAt: string | null;
  lastSyncAt: string | null;
  errorMessage?: string | null;
  autoReplyEnabled: boolean;
}

export interface WhatsAppContact {
  id: string; // e.g. contact-919840123456
  phoneNumber: string; // E.164 without plus e.g. 919840123456
  displayPhoneNumber: string; // formatted e.g. +91 98401 23456
  profileName: string;
  elshaPatientId?: string; // Linked ELSHA patient ID if matched
  elshaPatientName?: string;
  elshaPatientCondition?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppConversation {
  id: string; // conv-919840123456
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

export interface WhatsAppMessage {
  id: string; // WhatsApp wamid or msg-id
  wamid?: string;
  conversationId: string;
  contactId: string;
  fromPhone: string;
  toPhone: string;
  direction: 'inbound' | 'outbound';
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'pdf';
  text: string;
  timestamp: string; // formatted e.g. "10:45 AM" or "01/10/2026 10:45 AM"
  timeRaw: number; // unix ms
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  mimeType?: string;
  fileName?: string;
  fileSize?: string;
  aiSuggested?: boolean;
  aiReasoning?: string;
  errorMessage?: string;
}

export interface WhatsAppWebhookEvent {
  eventId: string;
  receivedAt: string;
  timeRaw: number;
  eventType: string;
  senderPhone?: string;
  messageId?: string;
}

export interface WhatsAppDatabaseSchema {
  whatsapp_accounts: WhatsAppAccount | null;
  whatsapp_contacts: WhatsAppContact[];
  whatsapp_conversations: WhatsAppConversation[];
  whatsapp_messages: WhatsAppMessage[];
  whatsapp_message_status: Array<{
    wamid: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipientPhone: string;
    error?: string;
  }>;
  whatsapp_webhook_events: WhatsAppWebhookEvent[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'whatsapp_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

// Load database from disk
function loadDb(): WhatsAppDatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);

      const rawMessages: WhatsAppMessage[] = Array.isArray(parsed.whatsapp_messages) ? parsed.whatsapp_messages : [];
      // Clean only completely corrupt entries (keep all valid text and media messages)
      const validMessages = rawMessages.filter(
        (m) => (m && typeof m === 'object' && ((m.text && m.text.trim().length > 0) || m.mediaUrl || m.fileName))
      );

      const rawConversations: WhatsAppConversation[] = Array.isArray(parsed.whatsapp_conversations)
        ? parsed.whatsapp_conversations
        : [];
      // Keep all valid conversations
      const validConversations = rawConversations.filter(
        (c) => c && typeof c === 'object' && c.id && c.phoneNumber
      );

      return {
        whatsapp_accounts: parsed.whatsapp_accounts || null,
        whatsapp_contacts: Array.isArray(parsed.whatsapp_contacts) ? parsed.whatsapp_contacts : [],
        whatsapp_conversations: validConversations,
        whatsapp_messages: validMessages,
        whatsapp_message_status: Array.isArray(parsed.whatsapp_message_status) ? parsed.whatsapp_message_status : [],
        whatsapp_webhook_events: Array.isArray(parsed.whatsapp_webhook_events) ? parsed.whatsapp_webhook_events : [],
      };
    }
  } catch (err) {
    console.error('Error reading whatsapp database, initializing empty:', err);
  }

  return {
    whatsapp_accounts: null,
    whatsapp_contacts: [],
    whatsapp_conversations: [],
    whatsapp_messages: [],
    whatsapp_message_status: [],
    whatsapp_webhook_events: [],
  };
}

// Save database atomically to disk
function saveDb(db: WhatsAppDatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save whatsapp database:', err);
  }
}

export const whatsappDb = {
  // Accounts
  getAccount(): WhatsAppAccount | null {
    const db = loadDb();
    return db.whatsapp_accounts;
  },

  saveAccount(account: WhatsAppAccount | null): void {
    const db = loadDb();
    db.whatsapp_accounts = account;
    saveDb(db);
  },

  updateAccountStatus(status: 'connected' | 'disconnected' | 'error', errorMessage?: string | null): void {
    const db = loadDb();
    if (db.whatsapp_accounts) {
      db.whatsapp_accounts.status = status;
      if (errorMessage !== undefined) {
        db.whatsapp_accounts.errorMessage = errorMessage;
      }
      db.whatsapp_accounts.lastSyncAt = new Date().toISOString();
      saveDb(db);
    }
  },

  toggleAutoReply(enabled: boolean): boolean {
    const db = loadDb();
    if (db.whatsapp_accounts) {
      db.whatsapp_accounts.autoReplyEnabled = enabled;
      saveDb(db);
      return enabled;
    }
    return false;
  },

  // Contacts
  getContacts(): WhatsAppContact[] {
    const db = loadDb();
    return db.whatsapp_contacts;
  },

  getContactByPhone(phone: string): WhatsAppContact | undefined {
    const clean = phone.replace(/[^0-9]/g, '');
    const db = loadDb();
    return db.whatsapp_contacts.find((c) => c.phoneNumber === clean || c.phoneNumber.endsWith(clean.slice(-10)));
  },

  upsertContact(contact: Partial<WhatsAppContact> & { phoneNumber: string }): WhatsAppContact {
    const db = loadDb();
    const clean = contact.phoneNumber.replace(/[^0-9]/g, '');
    const idx = db.whatsapp_contacts.findIndex((c) => c.phoneNumber === clean || c.phoneNumber.endsWith(clean.slice(-10)));
    const now = new Date().toISOString();

    if (idx >= 0) {
      db.whatsapp_contacts[idx] = {
        ...db.whatsapp_contacts[idx],
        ...contact,
        phoneNumber: clean,
        updatedAt: now,
      };
      saveDb(db);
      return db.whatsapp_contacts[idx];
    } else {
      const newContact: WhatsAppContact = {
        id: contact.id || `contact-${clean}`,
        phoneNumber: clean,
        displayPhoneNumber: contact.displayPhoneNumber || (clean.startsWith('91') && clean.length === 12 ? `+91 ${clean.slice(2, 7)} ${clean.slice(7)}` : `+${clean}`),
        profileName: contact.profileName || `+${clean}`,
        elshaPatientId: contact.elshaPatientId,
        elshaPatientName: contact.elshaPatientName,
        elshaPatientCondition: contact.elshaPatientCondition,
        createdAt: now,
        updatedAt: now,
      };
      db.whatsapp_contacts.unshift(newContact);
      saveDb(db);
      return newContact;
    }
  },

  // Conversations
  getConversations(filter: 'all' | 'unread' = 'all', searchQuery: string = ''): WhatsAppConversation[] {
    const db = loadDb();
    let list = [...db.whatsapp_conversations];

    if (filter === 'unread') {
      list = list.filter((c) => c.unreadCount > 0);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.contactName.toLowerCase().includes(q) ||
          c.phoneNumber.includes(q) ||
          c.lastMessageText.toLowerCase().includes(q) ||
          (c.elshaPatientName && c.elshaPatientName.toLowerCase().includes(q))
      );
    }

    // Sort by last message time descending
    return list.sort((a, b) => b.lastMessageTimeRaw - a.lastMessageTimeRaw);
  },

  getConversationById(id: string): WhatsAppConversation | undefined {
    const db = loadDb();
    const clean = id.replace(/^conv-/, '').replace(/[^0-9]/g, '');
    return db.whatsapp_conversations.find((c) => {
      if (c.id === id) return true;
      const cClean = c.id.replace(/^conv-/, '').replace(/[^0-9]/g, '');
      return cClean === clean || (clean.length >= 10 && cClean.endsWith(clean.slice(-10)));
    });
  },

  getConversationByPhone(phone: string): WhatsAppConversation | undefined {
    const clean = phone.replace(/[^0-9]/g, '');
    const db = loadDb();
    return db.whatsapp_conversations.find((c) => c.phoneNumber === clean || c.phoneNumber.endsWith(clean.slice(-10)));
  },

  upsertConversation(conv: Partial<WhatsAppConversation> & { phoneNumber: string }): WhatsAppConversation {
    const db = loadDb();
    const clean = conv.phoneNumber.replace(/[^0-9]/g, '');
    const id = conv.id || `conv-${clean}`;
    const idx = db.whatsapp_conversations.findIndex((c) => c.id === id || c.phoneNumber === clean);
    const now = new Date().toISOString();

    if (idx >= 0) {
      db.whatsapp_conversations[idx] = {
        ...db.whatsapp_conversations[idx],
        ...conv,
        id,
        phoneNumber: clean,
        updatedAt: now,
      };
      saveDb(db);
      return db.whatsapp_conversations[idx];
    } else {
      const newConv: WhatsAppConversation = {
        id,
        contactId: conv.contactId || `contact-${clean}`,
        phoneNumber: clean,
        displayPhoneNumber: conv.displayPhoneNumber || (clean.startsWith('91') && clean.length === 12 ? `+91 ${clean.slice(2, 7)} ${clean.slice(7)}` : `+${clean}`),
        contactName: conv.contactName || `+${clean}`,
        elshaPatientId: conv.elshaPatientId,
        elshaPatientName: conv.elshaPatientName,
        unreadCount: conv.unreadCount || 0,
        lastMessageId: conv.lastMessageId || '',
        lastMessageText: conv.lastMessageText || '',
        lastMessageTimestamp: conv.lastMessageTimestamp || 'Just now',
        lastMessageTimeRaw: conv.lastMessageTimeRaw || Date.now(),
        lastMessageDirection: conv.lastMessageDirection || 'inbound',
        lastMessageStatus: conv.lastMessageStatus || 'delivered',
        updatedAt: now,
      };
      db.whatsapp_conversations.unshift(newConv);
      saveDb(db);
      return newConv;
    }
  },

  markConversationRead(conversationId: string): void {
    const db = loadDb();
    const clean = conversationId.replace(/^conv-/, '').replace(/[^0-9]/g, '');
    const conv = db.whatsapp_conversations.find((c) => c.id === conversationId || c.phoneNumber === clean);
    if (conv) {
      conv.unreadCount = 0;
      saveDb(db);
    }
  },

  // Messages
  getMessages(conversationId: string, limit: number = 100, before?: number): WhatsAppMessage[] {
    const db = loadDb();
    if (!conversationId) return [];

    const decodedId = decodeURIComponent(conversationId).trim();
    const cleanDigits = decodedId.replace(/[^0-9]/g, '');

    let matched = (db.whatsapp_messages || []).filter((m) => {
      if (!m) return false;
      if (m.conversationId === decodedId || m.conversationId === conversationId) return true;
      const mClean = (m.conversationId || '').replace(/[^0-9]/g, '');
      if (cleanDigits && mClean === cleanDigits) return true;
      const mFrom = (m.fromPhone || '').replace(/[^0-9]/g, '');
      const mTo = (m.toPhone || '').replace(/[^0-9]/g, '');
      if (cleanDigits && (mFrom === cleanDigits || mTo === cleanDigits)) return true;
      if (cleanDigits.length >= 8 && mClean.length >= 8) {
        if (mClean.endsWith(cleanDigits.slice(-8)) || cleanDigits.endsWith(mClean.slice(-8))) return true;
      }
      return false;
    });

    if (before && before > 0) {
      matched = matched.filter((m) => m.timeRaw < before);
    }

    matched.sort((a, b) => a.timeRaw - b.timeRaw);
    if (limit && limit > 0 && matched.length > limit) {
      matched = matched.slice(-limit);
    }
    return matched;
  },

  saveMessage(message: WhatsAppMessage): WhatsAppMessage {
    const db = loadDb();
    // Check if message already exists by wamid or id
    const existingIdx = db.whatsapp_messages.findIndex(
      (m) => m.id === message.id || (message.wamid && m.wamid === message.wamid)
    );

    if (existingIdx >= 0) {
      db.whatsapp_messages[existingIdx] = {
        ...db.whatsapp_messages[existingIdx],
        ...message,
      };
    } else {
      db.whatsapp_messages.push(message);
    }

    // Also update or create parent conversation
    const cleanPhone = (message.direction === 'outbound' ? message.toPhone : message.fromPhone).replace(/[^0-9]/g, '');
    const convIdx = db.whatsapp_conversations.findIndex(
      (c) => c.id === message.conversationId || c.phoneNumber === cleanPhone
    );
    const nowTimeStr = message.timestamp || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    if (convIdx >= 0) {
      db.whatsapp_conversations[convIdx].lastMessageId = message.id;
      db.whatsapp_conversations[convIdx].lastMessageText = message.text || (message.fileName ? `📎 ${message.fileName}` : 'Media message');
      db.whatsapp_conversations[convIdx].lastMessageTimestamp = nowTimeStr;
      db.whatsapp_conversations[convIdx].lastMessageTimeRaw = message.timeRaw;
      db.whatsapp_conversations[convIdx].lastMessageDirection = message.direction;
      db.whatsapp_conversations[convIdx].lastMessageStatus = message.status;
      if (message.direction === 'inbound') {
        db.whatsapp_conversations[convIdx].unreadCount += 1;
      }
      db.whatsapp_conversations[convIdx].updatedAt = nowIso;
    } else {
      const displayPhone =
        cleanPhone.startsWith('91') && cleanPhone.length === 12
          ? `+91 ${cleanPhone.slice(2, 7)} ${cleanPhone.slice(7)}`
          : `+${cleanPhone}`;

      const newConv: WhatsAppConversation = {
        id: message.conversationId,
        contactId: message.contactId || `contact-${cleanPhone}`,
        phoneNumber: cleanPhone,
        displayPhoneNumber: displayPhone,
        contactName: displayPhone,
        unreadCount: message.direction === 'inbound' ? 1 : 0,
        lastMessageId: message.id,
        lastMessageText: message.text || (message.fileName ? `📎 ${message.fileName}` : 'Media message'),
        lastMessageTimestamp: nowTimeStr,
        lastMessageTimeRaw: message.timeRaw,
        lastMessageDirection: message.direction,
        lastMessageStatus: message.status,
        updatedAt: nowIso,
      };
      db.whatsapp_conversations.unshift(newConv);
    }

    saveDb(db);
    return message;
  },

  updateMessageStatus(wamid: string, status: 'sent' | 'delivered' | 'read' | 'failed', errorMessage?: string): void {
    const db = loadDb();
    const msg = db.whatsapp_messages.find((m) => m.wamid === wamid || m.id === wamid);
    if (msg) {
      msg.status = status;
      if (errorMessage) {
        msg.errorMessage = errorMessage;
      }
      // Update in conversation if it's the last message
      const conv = db.whatsapp_conversations.find((c) => c.id === msg.conversationId);
      if (conv && (conv.lastMessageId === msg.id || conv.lastMessageId === msg.wamid)) {
        conv.lastMessageStatus = status;
      }
    }

    db.whatsapp_message_status.push({
      wamid,
      status,
      timestamp: new Date().toISOString(),
      recipientPhone: msg?.toPhone || '',
      error: errorMessage,
    });

    saveDb(db);
  },

  // Webhooks
  isWebhookEventProcessed(eventId: string): boolean {
    const db = loadDb();
    return db.whatsapp_webhook_events.some((e) => e.eventId === eventId);
  },

  recordWebhookEvent(event: WhatsAppWebhookEvent): void {
    const db = loadDb();
    db.whatsapp_webhook_events.push(event);
    // Keep max 2,000 events to prevent bloat
    if (db.whatsapp_webhook_events.length > 2000) {
      db.whatsapp_webhook_events = db.whatsapp_webhook_events.slice(-1500);
    }
    saveDb(db);
  },

  // Disconnect / Reset
  disconnectAccount(): void {
    const db = loadDb();
    db.whatsapp_accounts = null;
    saveDb(db);
  },
};
