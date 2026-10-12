import React, { useState } from 'react';
import {
  Sparkles,
  Languages,
  FileText,
  Bot,
  Send,
  Copy,
  Check,
  Loader2,
  X,
  Sliders,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

interface ZionAiToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeChatText?: string;
  onInsertToChat?: (text: string) => void;
}

export const ZionAiToolsDrawer: React.FC<ZionAiToolsDrawerProps> = ({
  isOpen,
  onClose,
  activeChatText = '',
  onInsertToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'translate' | 'summarize' | 'reply' | 'autoReply'>('translate');

  // Translation State
  const [transInput, setTransInput] = useState('');
  const [targetLang, setTargetLang] = useState<'ta' | 'en'>('ta');
  const [transResult, setTransResult] = useState<string | null>(null);
  const [phoneticResult, setPhoneticResult] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Summarize State
  const [summaryInput, setSummaryInput] = useState(activeChatText);
  const [summaryResult, setSummaryResult] = useState<{
    overview?: string;
    keyPoints?: string[];
    actionItems?: string[];
  } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Reply Drafter State
  const [replyInput, setReplyInput] = useState('');
  const [replyTone, setReplyTone] = useState<'professional' | 'friendly' | 'concise'>('professional');
  const [generatedReply, setGeneratedReply] = useState<string | null>(null);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Auto-Responder State
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoMessage, setAutoMessage] = useState('Hi! I am away from desk right now. ZION AI is automatically taking note of your message.');
  const [isSavingAuto, setIsSavingAuto] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Perform Translation
  const handleTranslate = async () => {
    if (!transInput.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/zion/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transInput, targetLang }),
      });
      const data = await res.json();
      if (data.success) {
        setTransResult(data.translatedText);
        setPhoneticResult(data.phonetic || null);
      }
    } catch (err) {
      console.warn('Translation notice:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Perform Summarize
  const handleSummarize = async () => {
    if (!summaryInput.trim()) return;
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/zion/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messagesText: summaryInput }),
      });
      const data = await res.json();
      if (data.success) {
        setSummaryResult({
          overview: data.overview,
          keyPoints: data.keyPoints,
          actionItems: data.actionItems,
        });
      }
    } catch (err) {
      console.warn('Summarize notice:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Perform Reply Drafter
  const handleGenerateReply = async () => {
    if (!replyInput.trim()) return;
    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/zion/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: replyInput, tone: replyTone }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedReply(data.reply);
      }
    } catch (err) {
      console.warn('Reply generator notice:', err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Update Auto-Responder
  const handleSaveAutoResponder = async () => {
    setIsSavingAuto(true);
    try {
      await fetch('/api/zion/ai/auto-responder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: autoEnabled, customMessage: autoMessage }),
      });
    } catch (err) {
      console.warn('Auto responder notice:', err);
    } finally {
      setIsSavingAuto(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white dark:bg-[#0B0826] border-l border-purple-200 dark:border-purple-900 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 select-none animate-in slide-in-from-right duration-250">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 dark:border-purple-950 bg-purple-50/60 dark:bg-purple-950/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>ZION AI Tools</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Translate, summarize, and draft replies instantly
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black tracking-wider uppercase">
        <button
          onClick={() => setActiveTab('translate')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'translate'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Translate</span>
        </button>

        <button
          onClick={() => setActiveTab('summarize')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'summarize'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Summarize</span>
        </button>

        <button
          onClick={() => setActiveTab('reply')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'reply'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Reply</span>
        </button>

        <button
          onClick={() => setActiveTab('autoReply')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            activeTab === 'autoReply'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Auto Resp</span>
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* ======================================================================= */}
        {/* 1. TAMIL ⇄ ENGLISH TRANSLATOR                                           */}
        {/* ======================================================================= */}
        {activeTab === 'translate' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Direction
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-purple-950/50 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTargetLang('ta')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    targetLang === 'ta'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                  }`}
                >
                  English → Tamil (தமிழ்)
                </button>
                <button
                  onClick={() => setTargetLang('en')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    targetLang === 'en'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                  }`}
                >
                  Tamil → English
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Input Text (Type in English, Tamil, or Tanglish)
              </label>
              <textarea
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                placeholder={targetLang === 'ta' ? 'Type English text e.g. "Please confirm the appointment tomorrow"' : 'Type Tamil or Tanglish e.g. "நாளைக்கு மீட்டிங் இருக்கா?"'}
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleTranslate}
              disabled={isTranslating || !transInput.trim()}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  <span>Translate Now</span>
                </>
              )}
            </button>

            {transResult && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Translation Result
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(transResult, 'trans')}
                      className="p-1 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 rounded"
                      title="Copy"
                    >
                      {copiedKey === 'trans' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {onInsertToChat && (
                      <button
                        onClick={() => onInsertToChat(transResult)}
                        className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1"
                      >
                        <Send className="w-2.5 h-2.5" />
                        <span>Send in Chat</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {transResult}
                </p>

                {phoneticResult && (
                  <div className="pt-2 border-t border-purple-200/60 dark:border-purple-800/60">
                    <span className="text-[9.5px] font-mono text-purple-600 dark:text-purple-400 uppercase font-bold block mb-0.5">
                      Tanglish Phonics:
                    </span>
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                      {phoneticResult}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* 2. CONVERSATION SUMMARIZER                                              */}
        {/* ======================================================================= */}
        {activeTab === 'summarize' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Chat Transcript / Message Content
                </label>
                {activeChatText && (
                  <button
                    onClick={() => setSummaryInput(activeChatText)}
                    className="text-[10px] font-bold text-purple-700 dark:text-purple-400 hover:underline"
                  >
                    Load Current Chat
                  </button>
                )}
              </div>
              <textarea
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="Paste or type conversation messages to summarize..."
                rows={5}
                className="w-full p-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleSummarize}
              disabled={isSummarizing || !summaryInput.trim()}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Summary...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Summarize Transcript</span>
                </>
              )}
            </button>

            {summaryResult && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
                {summaryResult.overview && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                      Overview
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {summaryResult.overview}
                    </p>
                  </div>
                )}

                {summaryResult.keyPoints && summaryResult.keyPoints.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                      Key Highlights
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {summaryResult.keyPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summaryResult.actionItems && summaryResult.actionItems.length > 0 && (
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                      Action Items
                    </span>
                    <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {summaryResult.actionItems.map((act, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* 3. AI REPLY DRAFTER                                                     */}
        {/* ======================================================================= */}
        {activeTab === 'reply' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Incoming Message / Topic
              </label>
              <textarea
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Paste incoming message or describe what you want to say..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Desired Tone
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['professional', 'friendly', 'concise'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReplyTone(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      replyTone === t
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-purple-950/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-900 hover:border-purple-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateReply}
              disabled={isGeneratingReply || !replyInput.trim()}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingReply ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Reply...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Generate Reply</span>
                </>
              )}
            </button>

            {generatedReply && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Drafted Response ({replyTone})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(generatedReply, 'reply')}
                      className="p-1 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 rounded"
                      title="Copy"
                    >
                      {copiedKey === 'reply' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {onInsertToChat && (
                      <button
                        onClick={() => onInsertToChat(generatedReply)}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Insert in Chat</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-900 dark:text-white leading-relaxed font-medium bg-white dark:bg-purple-950/60 p-3 rounded-lg border border-purple-100 dark:border-purple-900">
                  {generatedReply}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* 4. AI AUTO-RESPONDER SETTINGS                                           */}
        {/* ======================================================================= */}
        {activeTab === 'autoReply' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  Automatic Response Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Replies automatically when you are busy or offline
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEnabled}
                  onChange={(e) => setAutoEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Auto-Reply Message
              </label>
              <textarea
                value={autoMessage}
                onChange={(e) => setAutoMessage(e.target.value)}
                rows={4}
                className="w-full p-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                This message will be dispatched when incoming messages arrive while auto-reply is toggled on.
              </p>
            </div>

            <button
              onClick={handleSaveAutoResponder}
              disabled={isSavingAuto}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              {isSavingAuto ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <span>Save Auto-Responder Settings</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-purple-950/10 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>User Consent & Privacy Preserved</span>
        </span>
        <button
          onClick={onClose}
          className="font-bold text-purple-700 dark:text-purple-400 hover:underline"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
