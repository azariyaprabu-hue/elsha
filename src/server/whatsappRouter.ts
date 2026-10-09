import express, { Request, Response } from 'express';
import { whatsappDb } from './whatsappDb';
import { whatsappCloudService } from './whatsappCloudService';
import { GoogleGenAI } from '@google/genai';

export const whatsappRouter = express.Router();

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ============================================================================
// 1. GET /api/whatsapp/status - REAL CONNECTION STATUS & HEALTH INFO
// ============================================================================
whatsappRouter.get('/status', (req: Request, res: Response) => {
  try {
    const statusData = whatsappCloudService.getStatus();
    return res.json(statusData);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve WhatsApp status', details: err.message });
  }
});

// ============================================================================
// 1B. GET /api/whatsapp/health - LIVE HEALTH CHECK AGAINST META GRAPH API
// ============================================================================
whatsappRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const healthResult = await whatsappCloudService.verifyConnection();
    const statusData = whatsappCloudService.getStatus();
    return res.json({
      ...statusData,
      healthCheck: healthResult,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

// ============================================================================
// 1C. GET /api/whatsapp/events - SERVER-SENT EVENTS (LIVE REAL-TIME STREAM)
// ============================================================================
whatsappRouter.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial status immediately
  const initialStatus = whatsappCloudService.getStatus();
  res.write(`data: ${JSON.stringify({ type: 'connectionState', data: initialStatus })}\n\n`);

  const onEvent = (event: { type: string; data: any }) => {
    try {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    } catch {}
  };

  whatsappCloudService.on('event', onEvent);

  req.on('close', () => {
    whatsappCloudService.off('event', onEvent);
  });
});

// ============================================================================
// 2. POST /api/whatsapp/config - SECURELY UPDATE CREDENTIALS & ONBOARDING
// ============================================================================
whatsappRouter.post('/config', async (req: Request, res: Response) => {
  const { phoneNumberId, wabaId, accessToken, webhookVerifyToken } = req.body;
  try {
    const result = await whatsappCloudService.saveConfig({
      phoneNumberId,
      wabaId,
      accessToken,
      webhookVerifyToken,
    });

    const statusData = whatsappCloudService.getStatus();
    return res.json({
      success: result.success,
      message: result.success
        ? 'WhatsApp Business Cloud API credentials verified and connected successfully.'
        : `Verification issue: ${result.error || 'Check Phone Number ID and Access Token'}`,
      error: result.error,
      ...statusData,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: 'Failed to update configuration',
      details: err.message,
    });
  }
});

// ============================================================================
// 2B. POST & GET /api/whatsapp/verify - TEST LIVE META CONNECTION
// ============================================================================
whatsappRouter.all('/verify', async (req: Request, res: Response) => {
  try {
    const result = await whatsappCloudService.verifyConnection();
    const statusData = whatsappCloudService.getStatus();
    return res.json({
      ...result,
      ...statusData,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

// ============================================================================
// 3. POST /api/whatsapp/disconnect - UNLINK ACCOUNT
// ============================================================================
whatsappRouter.post('/disconnect', async (req: Request, res: Response) => {
  try {
    await whatsappCloudService.disconnect();
    return res.json({
      success: true,
      status: 'disconnected',
      message: 'WhatsApp Business account disconnected.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to disconnect WhatsApp', details: err.message });
  }
});

// ============================================================================
// 4. GET /api/whatsapp/webhook - META WEBHOOK VERIFICATION HANDSHAKE
// ============================================================================
whatsappRouter.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;
  const challenge = req.query['hub.challenge'] as string;

  if (mode && token) {
    const validChallenge = whatsappCloudService.verifyWebhook(mode, token, challenge);
    if (validChallenge) {
      return res.status(200).send(validChallenge);
    }
  }

  return res.status(403).send('Forbidden: Webhook verify token mismatch');
});

// ============================================================================
// 4B. POST /api/whatsapp/webhook - META WEBHOOK RECEIVER (INCOMING & STATUSES)
// ============================================================================
whatsappRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    // Process webhook in background so Meta receives 200 within 3 seconds
    whatsappCloudService.handleWebhook(req.body).catch((err) => {
      console.error('[WhatsApp Cloud API] Webhook processing error:', err);
    });

    return res.status(200).send('EVENT_RECEIVED');
  } catch (err: any) {
    console.error('[WhatsApp Cloud API] Webhook endpoint error:', err);
    return res.status(200).send('EVENT_RECEIVED');
  }
});

// ============================================================================
// 5. GET /api/whatsapp/conversations - REAL PATIENT CONVERSATIONS
// ============================================================================
whatsappRouter.get('/conversations', (req: Request, res: Response) => {
  try {
    const filter = (req.query.filter as 'all' | 'unread') || 'all';
    const search = (req.query.search as string) || '';

    const conversations = whatsappDb.getConversations(filter, search);
    return res.json({ conversations });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve conversations', details: err.message });
  }
});

// ============================================================================
// 6. GET /api/whatsapp/messages/:conversationId - REAL CHAT MESSAGES WITH PAGINATION
// ============================================================================
whatsappRouter.get('/messages/:conversationId', (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const before = req.query.before ? Number(req.query.before) : undefined;

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required', messages: [] });
    }

    const messages = whatsappDb.getMessages(conversationId, limit, before);
    whatsappDb.markConversationRead(conversationId);

    return res.json({
      success: true,
      conversationId,
      count: messages.length,
      messages,
    });
  } catch (err: any) {
    console.error('Error in /messages/:conversationId:', err);
    return res.status(500).json({
      success: false,
      error: 'Message Fetch Failed',
      details: err.message || 'Unable to load messages from database',
      messages: [],
    });
  }
});

// ============================================================================
// 7. POST /api/whatsapp/send - SEND REAL OUTGOING MESSAGE VIA META CLOUD API
// ============================================================================
whatsappRouter.post('/send', async (req: Request, res: Response) => {
  const { recipientPhone, text, mediaUrl, fileName, patientContext } = req.body;

  if (!recipientPhone || (!text && !mediaUrl)) {
    return res.status(400).json({ error: 'Recipient phone number and message content are required.' });
  }

  try {
    let resolvedMediaUrl = mediaUrl;
    if (resolvedMediaUrl && typeof resolvedMediaUrl === 'string' && resolvedMediaUrl.startsWith('/')) {
      resolvedMediaUrl = `${req.protocol}://${req.get('host')}${resolvedMediaUrl}`;
    }

    const sentMsg = await whatsappCloudService.sendMessage(recipientPhone, text, resolvedMediaUrl, fileName);

    if (patientContext?.name) {
      whatsappDb.upsertContact({
        phoneNumber: recipientPhone.replace(/[^0-9]/g, ''),
        profileName: patientContext.name,
        elshaPatientName: patientContext.name,
        elshaPatientId: patientContext.id,
      });
    }

    return res.json({
      success: true,
      message: 'Message dispatched through WhatsApp Business Cloud API successfully.',
      recordedMessage: sentMsg,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: 'Message Delivery Failed',
      message: err.message || 'Failed to dispatch via WhatsApp Cloud API.',
    });
  }
});

// ============================================================================
// 8. POST /api/whatsapp/ai-suggest - CLINICAL AI SUGGESTIONS
// ============================================================================
whatsappRouter.post('/ai-suggest', async (req: Request, res: Response) => {
  const { lastPatientMessage, patientProfile, clinicalData } = req.body;

  if (!lastPatientMessage) {
    return res.status(400).json({ error: 'Patient message is required to generate AI suggestion.' });
  }

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini AI service not configured.' });
    }

    const prompt = `You are the Senior Clinical Assistant for Dr. Bharath Kumar B at ŽIATHLON Sports Medicine Clinic.
The attending doctor is Dr. Bharath Kumar B (MBBS, PGDSM Sports Medicine, Medical Director | Ziathlon, KMC#81009).

PATIENT CLINICAL CONTEXT:
- Name: ${patientProfile?.name || 'Patient'}
- Age/Sex: ${patientProfile?.age || 'Adult'} / ${patientProfile?.sex || 'Unknown'}
- Primary Condition/Tag: ${patientProfile?.condition || clinicalData?.category || 'Metabolic / Sports Medicine'}
- Prescribed Calories: ${clinicalData?.targetCalories || '1,600 kcal'}
- Target Protein: ${clinicalData?.proteinGrams || '70 g/day'}
- Active Medications: ${clinicalData?.medications || 'None recorded'}

PATIENT WHATSAPP INQUIRY:
"${lastPatientMessage}"

INSTRUCTIONS:
1. Provide a scientifically grounded, clear, empathetic response.
2. Directly address their dietary, medication, or workout question based on their clinical goals.
3. Keep the suggested reply concise and directly usable in WhatsApp.
4. Provide a brief 1-line clinical reasoning for the doctor before the reply.

Respond in JSON format:
{
  "reasoning": "Clinical rationale for the physician",
  "suggestedReply": "The exact message to send to the patient, formatted nicely for WhatsApp with linebreaks and doctor signature"
}`;

    let responseText = '';
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const result = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (result && result.text) {
          responseText = result.text;
          break;
        }
      } catch (e: any) {
        lastError = e;
      }
    }

    if (!responseText) {
      throw lastError || new Error('All candidate models unavailable');
    }

    const parsed = JSON.parse(responseText || '{}');
    return res.json({
      success: true,
      reasoning: parsed.reasoning || 'Formulated based on patient clinical parameters.',
      suggestedReply: parsed.suggestedReply || 'Thank you for your message. Please proceed according to your clinical diet plan.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate AI suggestion', details: err.message });
  }
});

// ============================================================================
// 9. POST /api/whatsapp/toggle-auto-reply
// ============================================================================
whatsappRouter.post('/toggle-auto-reply', (req: Request, res: Response) => {
  const { enabled } = req.body;
  const autoReplyEnabled = whatsappDb.toggleAutoReply(Boolean(enabled));
  return res.json({ success: true, autoReplyEnabled });
});
