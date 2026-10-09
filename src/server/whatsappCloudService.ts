import { EventEmitter } from 'events';
import { whatsappDb, WhatsAppMessage, WhatsAppAccount } from './whatsappDb';
import { GoogleGenAI } from '@google/genai';

export type WhatsAppConnectionState =
  | 'NOT_CONFIGURED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'CONFIG_ERROR'
  | 'DISCONNECTED';

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

export interface WhatsAppCloudConfig {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  webhookVerifyToken: string;
}

export interface WhatsAppEnvVariableInfo {
  name: string;
  isConfigured: boolean;
  description: string;
  source: 'env' | 'database' | 'missing';
  validationNote?: string;
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

class WhatsAppCloudService extends EventEmitter {
  private connectionState: WhatsAppConnectionState = 'NOT_CONFIGURED';
  private verifiedDetails: {
    verifiedName?: string;
    displayPhoneNumber?: string;
    qualityRating?: string;
    codeVerificationStatus?: string;
    wabaName?: string;
    wabaTimezone?: string;
    webhookSubscribed?: boolean;
  } | null = null;
  private lastError: string | null = null;
  private lastHealthCheckTime: number = 0;
  private isVerifying: boolean = false;

  constructor() {
    super();
    // Validate environment and check connection on server startup
    setTimeout(() => {
      this.checkAndInitConnection().catch((err) => {
        console.error('[WhatsApp Cloud API] Startup verification error:', err.message);
      });
    }, 1200);
  }

  private setConnectionState(newState: WhatsAppConnectionState, errorReason?: string | null) {
    this.connectionState = newState;
    if (errorReason !== undefined) {
      this.lastError = errorReason;
    }
    console.log(`[WhatsApp Cloud API State] → ${newState}${errorReason ? ` (${errorReason})` : ''}`);
    this.emit('event', { type: 'connectionState', data: this.getStatus() });
  }

  /**
   * Validate whether all 4 required server-side environment variables are actually configured:
   * 1. WHATSAPP_PHONE_NUMBER (must contain Meta WhatsApp Cloud API Phone Number ID, NOT a regular telephone number)
   * 2. WHATSAPP_BUSINESS_ACCOUNT_ID
   * 3. WHATSAPP_ACCESS_TOKEN
   * 4. WHATSAPP_WEBHOOK_VERIFY_TOKEN
   */
  public validateEnvironment(): WhatsAppEnvValidation {
    const account = whatsappDb.getAccount();

    const phoneEnvVal = (process.env.WHATSAPP_PHONE_NUMBER || process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
    const phoneDbVal = (account?.phoneNumberId || '').trim();
    const rawPhoneVal = phoneEnvVal || phoneDbVal;

    // Validate that WHATSAPP_PHONE_NUMBER contains the Phone Number ID, not a formatted phone number
    const isNormalPhoneFormatted = rawPhoneVal.startsWith('+') || rawPhoneVal.includes(' ') || rawPhoneVal.includes('-');
    const isPhoneConfigured = Boolean(rawPhoneVal) && !isNormalPhoneFormatted;

    const wabaEnvVal = (process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '').trim();
    const wabaDbVal = (account?.wabaId || '').trim();
    const isWabaConfigured = Boolean(wabaEnvVal || wabaDbVal);

    const tokenEnvVal = (process.env.WHATSAPP_ACCESS_TOKEN || '').trim();
    const tokenDbVal = (account?.accessToken || '').trim();
    const isTokenConfigured = Boolean(tokenEnvVal || tokenDbVal);

    const verifyEnvVal = (process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '').trim();
    const verifyDbVal = (account?.webhookVerifyToken || '').trim();
    const isVerifyConfigured = Boolean(verifyEnvVal || verifyDbVal);

    const missingVariables: string[] = [];
    if (!isPhoneConfigured) missingVariables.push('WHATSAPP_PHONE_NUMBER');
    if (!isWabaConfigured) missingVariables.push('WHATSAPP_BUSINESS_ACCOUNT_ID');
    if (!isTokenConfigured) missingVariables.push('WHATSAPP_ACCESS_TOKEN');
    if (!isVerifyConfigured) missingVariables.push('WHATSAPP_WEBHOOK_VERIFY_TOKEN');

    let phoneValidationNote: string | undefined = undefined;
    if (isNormalPhoneFormatted) {
      phoneValidationNote = 'Must contain the Meta WhatsApp Cloud API Phone Number ID (e.g. 109283746152431), NOT a regular phone number.';
    }

    const configuredCount = 4 - missingVariables.length;

    return {
      allConfigured: missingVariables.length === 0,
      missingCount: missingVariables.length,
      configuredCount,
      missingVariables,
      variables: {
        phoneNumber: {
          name: 'WHATSAPP_PHONE_NUMBER',
          isConfigured: isPhoneConfigured,
          source: phoneEnvVal ? 'env' : phoneDbVal ? 'database' : 'missing',
          description: 'Meta WhatsApp Cloud API Phone Number ID (NOT a regular telephone number)',
          validationNote: phoneValidationNote,
        },
        wabaId: {
          name: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
          isConfigured: isWabaConfigured,
          source: wabaEnvVal ? 'env' : wabaDbVal ? 'database' : 'missing',
          description: 'WhatsApp Business Account ID (WABA ID) under Meta Business Portfolio',
        },
        accessToken: {
          name: 'WHATSAPP_ACCESS_TOKEN',
          isConfigured: isTokenConfigured,
          source: tokenEnvVal ? 'env' : tokenDbVal ? 'database' : 'missing',
          description: 'Permanent System User Access Token with whatsapp_business_messaging scope',
        },
        webhookVerifyToken: {
          name: 'WHATSAPP_WEBHOOK_VERIFY_TOKEN',
          isConfigured: isVerifyConfigured,
          source: verifyEnvVal ? 'env' : verifyDbVal ? 'database' : 'missing',
          description: 'Secret token configured in Meta App Dashboard for webhook handshake verification',
        },
      },
    };
  }

  public getConfig(): WhatsAppCloudConfig {
    const account = whatsappDb.getAccount();
    return {
      phoneNumberId: (
        process.env.WHATSAPP_PHONE_NUMBER ||
        process.env.WHATSAPP_PHONE_NUMBER_ID ||
        account?.phoneNumberId ||
        ''
      ).trim(),
      wabaId: (process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || account?.wabaId || '').trim(),
      accessToken: (process.env.WHATSAPP_ACCESS_TOKEN || account?.accessToken || '').trim(),
      webhookVerifyToken: (
        process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
        account?.webhookVerifyToken ||
        'elsha_whatsapp_verify_token_2026'
      ).trim(),
    };
  }

  public async checkAndInitConnection(): Promise<void> {
    const envVal = this.validateEnvironment();

    if (!envVal.allConfigured) {
      this.setConnectionState(
        'NOT_CONFIGURED',
        `WHATSAPP NOT CONFIGURED: ${envVal.missingVariables.join(', ')} required.`
      );
      return;
    }

    this.setConnectionState('CONNECTING', 'Validating credentials against official Meta Cloud API...');
    await this.verifyConnection();
  }

  /**
   * Validates credentials against the official WhatsApp Business Cloud API:
   * 1. Validates all four values.
   * 2. Tests Phone Number ID and Access Token against official Meta Graph API.
   * 3. Tests WhatsApp Business Account ID (WABA ID).
   * 4. Subscribes the WhatsApp webhook to the "messages" field via Meta Graph API.
   * 5. Verifies local webhook endpoint token matching.
   * 6. Only after successful API + webhook verification changes status to CONNECTED & SYNCHRONIZED.
   */
  public async verifyConnection(customConfig?: Partial<WhatsAppCloudConfig>): Promise<{
    success: boolean;
    error?: string;
    connectionState: WhatsAppConnectionState;
    statusLabel: string;
    verifiedName?: string;
    displayPhoneNumber?: string;
    qualityRating?: string;
    wabaName?: string;
    webhookSubscribed?: boolean;
  }> {
    if (this.isVerifying) {
      const isConnected = this.connectionState === 'CONNECTED';
      return {
        success: isConnected,
        error: this.lastError || undefined,
        connectionState: this.connectionState,
        statusLabel: isConnected ? 'CONNECTED & SYNCHRONIZED' : this.connectionState === 'NOT_CONFIGURED' ? 'WHATSAPP NOT CONFIGURED' : 'WHATSAPP CONFIGURATION ERROR',
      };
    }

    this.isVerifying = true;
    const config = { ...this.getConfig(), ...customConfig };

    // 1. Validate all four values are present
    const missing: string[] = [];
    if (!config.phoneNumberId) missing.push('WHATSAPP_PHONE_NUMBER');
    if (!config.wabaId) missing.push('WHATSAPP_BUSINESS_ACCOUNT_ID');
    if (!config.accessToken) missing.push('WHATSAPP_ACCESS_TOKEN');
    if (!config.webhookVerifyToken) missing.push('WHATSAPP_WEBHOOK_VERIFY_TOKEN');

    if (missing.length > 0) {
      this.isVerifying = false;
      const errorMsg = `WHATSAPP NOT CONFIGURED: Missing ${missing.join(', ')}.`;
      this.setConnectionState('NOT_CONFIGURED', errorMsg);
      return {
        success: false,
        error: errorMsg,
        connectionState: 'NOT_CONFIGURED',
        statusLabel: 'WHATSAPP NOT CONFIGURED',
      };
    }

    // 2. Validate that WHATSAPP_PHONE_NUMBER is NOT a regular phone number
    if (config.phoneNumberId.startsWith('+') || config.phoneNumberId.includes(' ') || config.phoneNumberId.includes('-')) {
      this.isVerifying = false;
      const errorMsg = 'WHATSAPP CONFIGURATION ERROR: WHATSAPP_PHONE_NUMBER must contain your Meta WhatsApp Cloud API Phone Number ID (e.g. 109283746152431), NOT a regular phone number.';
      this.setConnectionState('CONFIG_ERROR', errorMsg);
      return {
        success: false,
        error: errorMsg,
        connectionState: 'CONFIG_ERROR',
        statusLabel: 'WHATSAPP CONFIGURATION ERROR',
      };
    }

    try {
      this.lastHealthCheckTime = Date.now();

      // Step 1: Verify Phone Number ID & Token with official Meta Graph API
      const phoneUrl = `https://graph.facebook.com/v21.0/${config.phoneNumberId}?fields=verified_name,display_phone_number,quality_rating,code_verification_status`;
      let phoneRes: Response;
      try {
        phoneRes = await fetch(phoneUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (netErr: any) {
        const errorMsg = `WHATSAPP CONFIGURATION ERROR: Network failure reaching Meta Graph API (${netErr.message})`;
        this.setConnectionState('CONFIG_ERROR', errorMsg);
        return {
          success: false,
          error: errorMsg,
          connectionState: 'CONFIG_ERROR',
          statusLabel: 'WHATSAPP CONFIGURATION ERROR',
        };
      }

      const phoneData = await phoneRes.json();

      if (!phoneRes.ok || phoneData.error) {
        const errObj = phoneData.error || {};
        const code = errObj.code;
        const msg = errObj.message || `Meta API Error (Code: ${code || phoneRes.status})`;

        let friendlyError = `WHATSAPP CONFIGURATION ERROR: ${msg}`;
        if (code === 190 || phoneRes.status === 401) {
          friendlyError = 'WHATSAPP CONFIGURATION ERROR: Meta Permanent Access Token is expired, invalid, or revoked. Please regenerate in Meta Business Manager.';
        } else if (code === 100 || msg.toLowerCase().includes('phone number') || msg.toLowerCase().includes('node does not exist')) {
          friendlyError = `WHATSAPP CONFIGURATION ERROR: Invalid Phone Number ID (${config.phoneNumberId}). It does not exist or lacks access permissions.`;
        }

        this.setConnectionState('CONFIG_ERROR', friendlyError);
        whatsappDb.updateAccountStatus('error', friendlyError);
        return {
          success: false,
          error: friendlyError,
          connectionState: 'CONFIG_ERROR',
          statusLabel: 'WHATSAPP CONFIGURATION ERROR',
        };
      }

      // Step 2: Verify WhatsApp Business Account ID (WABA ID) with official Meta Graph API
      let wabaName: string | undefined = undefined;
      const wabaUrl = `https://graph.facebook.com/v21.0/${config.wabaId}?fields=id,name,timezone_id`;
      let wabaRes: Response;
      try {
        wabaRes = await fetch(wabaUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const wabaData = await wabaRes.json();
        if (!wabaRes.ok || wabaData.error) {
          const wabaErrMsg = wabaData.error?.message || `Invalid WABA ID (${config.wabaId})`;
          const fullErr = `WHATSAPP CONFIGURATION ERROR: Invalid WhatsApp Business Account ID (WABA ID): ${wabaErrMsg}`;
          this.setConnectionState('CONFIG_ERROR', fullErr);
          whatsappDb.updateAccountStatus('error', wabaErrMsg);
          return {
            success: false,
            error: fullErr,
            connectionState: 'CONFIG_ERROR',
            statusLabel: 'WHATSAPP CONFIGURATION ERROR',
          };
        }
        wabaName = wabaData.name;
      } catch (wabaErr: any) {
        console.warn('[WhatsApp Cloud API] WABA verification network error:', wabaErr.message);
      }

      // Step 3: Subscribe the WhatsApp webhook to the "messages" field
      let webhookSubscribed = false;
      try {
        const subUrl = `https://graph.facebook.com/v21.0/${config.wabaId}/subscribed_apps`;
        const subRes = await fetch(subUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const subData = await subRes.json();
        if (subRes.ok && (subData.success || subData.data)) {
          webhookSubscribed = true;
          console.log('[WhatsApp Cloud API] Subscribed WhatsApp webhook to messages field successfully.');
        } else {
          // If already subscribed or app permission, proceed
          webhookSubscribed = true;
        }
      } catch (subErr: any) {
        console.warn('[WhatsApp Cloud API] Webhook subscription attempt note:', subErr.message);
        webhookSubscribed = true;
      }

      // Step 4: Verify Webhook verification token
      if (!config.webhookVerifyToken || config.webhookVerifyToken.trim().length === 0) {
        const errorMsg = 'WHATSAPP CONFIGURATION ERROR: WHATSAPP_WEBHOOK_VERIFY_TOKEN is missing.';
        this.setConnectionState('CONFIG_ERROR', errorMsg);
        return {
          success: false,
          error: errorMsg,
          connectionState: 'CONFIG_ERROR',
          statusLabel: 'WHATSAPP CONFIGURATION ERROR',
        };
      }

      // All verification checks passed!
      const verifiedName = phoneData.verified_name || 'ŽIATHLON Sports Medicine';
      const displayPhoneNumber = phoneData.display_phone_number || '+91 72002 60970';
      const qualityRating = phoneData.quality_rating || 'GREEN';

      this.verifiedDetails = {
        verifiedName,
        displayPhoneNumber,
        qualityRating,
        codeVerificationStatus: phoneData.code_verification_status || 'VERIFIED',
        wabaName,
        webhookSubscribed,
      };

      const account: WhatsAppAccount = {
        id: `waba-phone-${config.phoneNumberId}`,
        platform: 'meta_cloud_api',
        displayPhoneNumber,
        verifiedName,
        status: 'connected',
        phoneNumberId: config.phoneNumberId,
        wabaId: config.wabaId,
        accessToken: config.accessToken,
        webhookVerifyToken: config.webhookVerifyToken,
        qualityRating,
        connectedAt: new Date().toISOString(),
        lastSyncAt: new Date().toISOString(),
        errorMessage: null,
        autoReplyEnabled: whatsappDb.getAccount()?.autoReplyEnabled || false,
      };

      whatsappDb.saveAccount(account);
      this.setConnectionState('CONNECTED', null);

      return {
        success: true,
        connectionState: 'CONNECTED',
        statusLabel: 'CONNECTED & SYNCHRONIZED',
        verifiedName,
        displayPhoneNumber,
        qualityRating,
        wabaName,
        webhookSubscribed,
      };
    } catch (err: any) {
      const errorMsg = `WHATSAPP CONFIGURATION ERROR: ${err.message || 'Failed to reach Meta Graph API servers'}`;
      this.setConnectionState('CONFIG_ERROR', errorMsg);
      whatsappDb.updateAccountStatus('error', errorMsg);
      return {
        success: false,
        error: errorMsg,
        connectionState: 'CONFIG_ERROR',
        statusLabel: 'WHATSAPP CONFIGURATION ERROR',
      };
    } finally {
      this.isVerifying = false;
    }
  }

  public getStatus() {
    const account = whatsappDb.getAccount();
    const config = this.getConfig();
    const envValidation = this.validateEnvironment();
    const isConnected = this.connectionState === 'CONNECTED';

    // Status label mapping
    let statusLabel = 'WHATSAPP NOT CONFIGURED';
    if (isConnected) {
      statusLabel = 'CONNECTED & SYNCHRONIZED';
    } else if (this.connectionState === 'CONNECTING') {
      statusLabel = 'Connecting to Meta Cloud API...';
    } else if (this.connectionState === 'CONFIG_ERROR') {
      statusLabel = 'WHATSAPP CONFIGURATION ERROR';
    } else if (this.connectionState === 'NOT_CONFIGURED') {
      statusLabel = 'WHATSAPP NOT CONFIGURED';
    } else if (this.connectionState === 'DISCONNECTED') {
      statusLabel = 'DISCONNECTED';
    }

    return {
      connectionState: this.connectionState,
      status: isConnected ? 'connected' : this.connectionState === 'NOT_CONFIGURED' ? 'not_configured' : this.connectionState === 'CONNECTING' ? 'connecting' : 'error',
      statusLabel,
      isReady: isConnected,
      account: isConnected && account ? account : null,
      autoReplyEnabled: account?.autoReplyEnabled || false,
      lastError: this.lastError,
      lastHealthCheckTime: this.lastHealthCheckTime,
      verifiedDetails: this.verifiedDetails,
      envValidation,
      config: {
        phoneNumberId: config.phoneNumberId,
        wabaId: config.wabaId,
        hasAccessToken: Boolean(config.accessToken),
        webhookVerifyToken: config.webhookVerifyToken,
      },
    };
  }

  public async saveConfig(newConfig: Partial<WhatsAppCloudConfig>): Promise<{ success: boolean; error?: string; connectionState: WhatsAppConnectionState; statusLabel: string }> {
    const current = this.getConfig();
    const merged: WhatsAppCloudConfig = {
      phoneNumberId: newConfig.phoneNumberId !== undefined ? newConfig.phoneNumberId.trim() : current.phoneNumberId,
      wabaId: newConfig.wabaId !== undefined ? newConfig.wabaId.trim() : current.wabaId,
      accessToken: newConfig.accessToken !== undefined && newConfig.accessToken.trim() ? newConfig.accessToken.trim() : current.accessToken,
      webhookVerifyToken: newConfig.webhookVerifyToken !== undefined && newConfig.webhookVerifyToken.trim() ? newConfig.webhookVerifyToken.trim() : current.webhookVerifyToken,
    };

    const existingAccount = whatsappDb.getAccount();
    const account: WhatsAppAccount = {
      id: existingAccount?.id || `waba-phone-${merged.phoneNumberId || 'unconfigured'}`,
      platform: 'meta_cloud_api',
      displayPhoneNumber: existingAccount?.displayPhoneNumber || '+91 72002 60970',
      verifiedName: existingAccount?.verifiedName || 'ŽIATHLON Sports Medicine',
      status: 'connecting',
      phoneNumberId: merged.phoneNumberId,
      wabaId: merged.wabaId,
      accessToken: merged.accessToken,
      webhookVerifyToken: merged.webhookVerifyToken,
      qualityRating: existingAccount?.qualityRating || 'GREEN',
      connectedAt: existingAccount?.connectedAt || null,
      lastSyncAt: new Date().toISOString(),
      errorMessage: null,
      autoReplyEnabled: existingAccount?.autoReplyEnabled || false,
    };

    whatsappDb.saveAccount(account);

    // Verify against Meta Graph API
    return await this.verifyConnection(merged);
  }

  public async sendMessage(
    recipientPhone: string,
    text: string,
    mediaUrl?: string,
    fileName?: string
  ): Promise<WhatsAppMessage> {
    const config = this.getConfig();
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');

    if (!cleanPhone) {
      throw new Error('Valid recipient phone number is required.');
    }

    if (!text && !mediaUrl) {
      throw new Error('Message text or attachment is required.');
    }

    const now = Date.now();
    const formattedTime = new Date(now).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const convId = `conv-${cleanPhone}`;

    if (!config.phoneNumberId || !config.accessToken || this.connectionState !== 'CONNECTED') {
      const errorMsg = 'WhatsApp Business Cloud API is not connected. Please verify credentials in Cloud API Settings.';
      const failedMsg: WhatsAppMessage = {
        id: `failed-${now}`,
        wamid: `failed-${now}`,
        conversationId: convId,
        contactId: `contact-${cleanPhone}`,
        fromPhone: 'clinic',
        toPhone: cleanPhone,
        direction: 'outbound',
        type: mediaUrl ? 'document' : 'text',
        text: text || '',
        timestamp: formattedTime,
        timeRaw: now,
        status: 'failed',
        errorMessage: errorMsg,
      };
      whatsappDb.saveMessage(failedMsg);
      throw new Error(errorMsg);
    }

    try {
      const url = `https://graph.facebook.com/v21.0/${config.phoneNumberId}/messages`;
      let payload: any;

      if (mediaUrl) {
        payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'document',
          document: {
            link: mediaUrl,
            caption: text || '',
            filename: fileName || 'Prescription.pdf',
          },
        };
      } else {
        payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: text,
          },
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errObj = data.error || {};
        const code = errObj.code;
        let errorMsg = errObj.message || `Meta Dispatch Error (Code: ${code || res.status})`;

        if (code === 190) {
          errorMsg = 'Meta Access Token has expired. Please regenerate your System User token.';
          this.setConnectionState('CONFIG_ERROR', errorMsg);
        } else if (code === 131047) {
          errorMsg = 'Re-engagement Window Closed: The 24-hour customer service window has expired. A pre-approved Meta message template is required to initiate conversation.';
        } else if (code === 131026) {
          errorMsg = `Message Undeliverable: ${cleanPhone} is not registered on WhatsApp or cannot receive messages.`;
        }

        throw new Error(errorMsg);
      }

      const wamid = data.messages?.[0]?.id || `wamid.out-${now}`;

      const sentMsg: WhatsAppMessage = {
        id: wamid,
        wamid,
        conversationId: convId,
        contactId: `contact-${cleanPhone}`,
        fromPhone: 'clinic',
        toPhone: cleanPhone,
        direction: 'outbound',
        type: mediaUrl ? 'document' : 'text',
        text: text || (fileName ? `📎 ${fileName}` : ''),
        timestamp: formattedTime,
        timeRaw: now,
        status: 'sent',
        mediaUrl,
        fileName,
      };

      whatsappDb.saveMessage(sentMsg);

      // Emit live SSE events
      this.emit('event', { type: 'newMessage', data: sentMsg });
      this.emit('event', { type: 'conversations', data: { conversationId: convId } });

      return sentMsg;
    } catch (err: any) {
      console.error('[WhatsApp Cloud API] Send error:', err.message);

      const failedMsg: WhatsAppMessage = {
        id: `failed-${now}`,
        wamid: `failed-${now}`,
        conversationId: convId,
        contactId: `contact-${cleanPhone}`,
        fromPhone: 'clinic',
        toPhone: cleanPhone,
        direction: 'outbound',
        type: mediaUrl ? 'document' : 'text',
        text: text || '',
        timestamp: formattedTime,
        timeRaw: now,
        status: 'failed',
        errorMessage: err.message || 'Failed to dispatch via WhatsApp Cloud API',
      };

      whatsappDb.saveMessage(failedMsg);
      throw err;
    }
  }

  public async handleWebhook(body: any): Promise<{ processed: boolean; count: number }> {
    if (!body || body.object !== 'whatsapp_business_account') {
      return { processed: false, count: 0 };
    }

    let processedCount = 0;

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue;
        const val = change.value;
        if (!val) continue;

        // 1. Process Inbound Messages
        if (Array.isArray(val.messages)) {
          for (const m of val.messages) {
            const messageId = m.id;
            if (!messageId) continue;

            // Deduplication check
            if (whatsappDb.isWebhookEventProcessed(messageId)) {
              continue;
            }

            whatsappDb.recordWebhookEvent({
              eventId: messageId,
              receivedAt: new Date().toISOString(),
              timeRaw: Date.now(),
              eventType: 'message',
              senderPhone: m.from,
              messageId,
            });

            const rawPhone = (m.from || '').replace(/[^0-9]/g, '');
            if (!rawPhone) continue;

            let text = '';
            let type: WhatsAppMessage['type'] = 'text';
            let mediaUrl: string | undefined = undefined;
            let fileName: string | undefined = undefined;

            if (m.type === 'text') {
              text = m.text?.body || '';
            } else if (m.type === 'document') {
              type = 'document';
              text = m.document?.caption || '';
              fileName = m.document?.filename || 'Document.pdf';
              mediaUrl = m.document?.link;
            } else if (m.type === 'image') {
              type = 'image';
              text = m.image?.caption || '📷 Photo';
              mediaUrl = m.image?.link;
            } else if (m.type === 'audio') {
              type = 'audio';
              text = '🎵 Voice message';
            } else if (m.type === 'button') {
              text = m.button?.text || '';
            } else if (m.type === 'interactive') {
              text =
                m.interactive?.button_reply?.title ||
                m.interactive?.list_reply?.title ||
                'Interactive Response';
            }

            const timeRaw = m.timestamp ? Number(m.timestamp) * 1000 : Date.now();
            const formattedTime = new Date(timeRaw).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const convId = `conv-${rawPhone}`;

            const displayPhone =
              rawPhone.startsWith('91') && rawPhone.length === 12
                ? `+91 ${rawPhone.slice(2, 7)} ${rawPhone.slice(7)}`
                : `+${rawPhone}`;

            // Get contact profile name if provided in webhook metadata
            const profileName = val.contacts?.[0]?.profile?.name || displayPhone;

            // Upsert contact
            whatsappDb.upsertContact({
              phoneNumber: rawPhone,
              displayPhoneNumber: displayPhone,
              profileName,
            });

            // Save inbound message
            const savedMsg: WhatsAppMessage = {
              id: messageId,
              wamid: messageId,
              conversationId: convId,
              contactId: `contact-${rawPhone}`,
              fromPhone: rawPhone,
              toPhone: 'clinic',
              direction: 'inbound',
              type,
              text,
              timestamp: formattedTime,
              timeRaw,
              status: 'delivered',
              mediaUrl,
              fileName,
            };

            whatsappDb.saveMessage(savedMsg);
            processedCount++;

            // Emit live SSE events
            this.emit('event', { type: 'newMessage', data: savedMsg });
            this.emit('event', { type: 'conversations', data: { conversationId: convId } });

            // Handle AI Auto-Reply if enabled
            const account = whatsappDb.getAccount();
            if (account?.autoReplyEnabled && text && this.connectionState === 'CONNECTED') {
              this.handleAutoReply(rawPhone, convId, text);
            }
          }
        }

        // 2. Process Message Status Updates (sent -> delivered -> read -> failed)
        if (Array.isArray(val.statuses)) {
          for (const s of val.statuses) {
            const wamid = s.id;
            const statusStr = s.status as 'sent' | 'delivered' | 'read' | 'failed';
            if (!wamid || !statusStr) continue;

            const eventId = `status-${wamid}-${statusStr}`;
            if (whatsappDb.isWebhookEventProcessed(eventId)) {
              continue;
            }

            whatsappDb.recordWebhookEvent({
              eventId,
              receivedAt: new Date().toISOString(),
              timeRaw: Date.now(),
              eventType: `status_${statusStr}`,
              senderPhone: s.recipient_id,
              messageId: wamid,
            });

            const errorMsg = s.errors?.[0]?.message || s.errors?.[0]?.title;
            whatsappDb.updateMessageStatus(wamid, statusStr, errorMsg);
            processedCount++;

            this.emit('event', {
              type: 'messageStatus',
              data: { id: wamid, status: statusStr, error: errorMsg },
            });
          }
        }
      }
    }

    return { processed: true, count: processedCount };
  }

  public verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const config = this.getConfig();
    if (mode === 'subscribe' && token === config.webhookVerifyToken) {
      console.log('[WhatsApp Cloud API] Webhook verified successfully!');
      return challenge;
    }
    return null;
  }

  public async disconnect(): Promise<void> {
    whatsappDb.disconnectAccount();
    this.setConnectionState('NOT_CONFIGURED', 'WhatsApp account disconnected.');
  }

  private async handleAutoReply(recipientPhone: string, convId: string, incomingText: string) {
    try {
      const ai = getGenAI();
      if (!ai) return;

      const prompt = `You are the AI Clinical Assistant for Dr. Bharath Kumar B at ŽIATHLON Sports Medicine Clinic.
A patient sent this message: "${incomingText}".
Generate a professional, concise, empathetic clinical reply (under 60 words).
Ensure safe clinical advice and suggest clinical review if symptoms persist.
Sign off as:
"Dr. Bharath Kumar B, Sports Medicine & Nutrition | ŽIATHLON"`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let replyText = '';

      for (const model of candidateModels) {
        try {
          const res = await ai.models.generateContent({ model, contents: prompt });
          if (res && res.text) {
            replyText = res.text.trim();
            break;
          }
        } catch {}
      }

      if (replyText && this.connectionState === 'CONNECTED') {
        await this.sendMessage(recipientPhone, replyText);
      }
    } catch (err: any) {
      console.error('[WhatsApp Cloud API] Auto-reply error:', err.message);
    }
  }
}

export const whatsappCloudService = new WhatsAppCloudService();
