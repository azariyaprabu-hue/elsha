import React, { useState, useRef, useEffect } from 'react';
import { GeneralInfo, Calculations, NutritionChatMessage } from '../types';
import Markdown from 'react-markdown';
import {
  Sparkles,
  X,
  Send,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
  Sparkle,
} from 'lucide-react';

interface PersonalNutritionAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullSuite: () => void;
  generalInfo: GeneralInfo;
  calculations: Calculations;
  selectedCategory: string;
}

export const PersonalNutritionAiDrawer: React.FC<PersonalNutritionAiDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFullSuite,
  generalInfo,
  calculations,
  selectedCategory,
}) => {
  const [messages, setMessages] = useState<NutritionChatMessage[]>([
    {
      id: 'drawer-welcome',
      sender: 'ai',
      text: `Hi **${generalInfo.name || 'Kiruthika'}**, I'm right here with you! Have a quick question about your dinner, blood sugar, or a snack choice?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanSpeech = text.replace(/[#*_`~-]/g, ' ').replace(/\n+/g, '. ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: NutritionChatMessage = {
      id: `drawer-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/nutrition-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ sender: m.sender, text: m.text })),
          patientProfile: {
            name: generalInfo.name,
            targetCalories: 1500,
            tdee: calculations.tdee,
            domainCategory: selectedCategory,
          },
        }),
      });

      const data = await res.json();
      const aiMessage: NutritionChatMessage = {
        id: `drawer-ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is your nutrition advice.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        glycemicImpact: data.glycemicRating,
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `drawer-err-${Date.now()}`,
          sender: 'ai',
          text: `For your 1,500 kcal plan in ${selectedCategory}: prioritize vegetable salads before grains, and consume your Metformin with meals.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full sm:w-[420px] h-full bg-[#0c100e] border-l-2 border-[#C5A028] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#111613] border-b border-[#C5A028]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C5A028]/20 border border-[#C5A028] flex items-center justify-center text-[#C5A028]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#f7d88c] uppercase tracking-wider font-mono">
                Personal Nutrition AI
              </div>
              <div className="text-[10px] text-gray-400">
                Patient: {generalInfo.name || 'Kiruthika'} • 1,500 kcal Plan
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullSuite();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
              title="Expand to Full AI Consultation Suite"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Target Ribbon */}
        <div className="bg-black/60 px-4 py-2 border-b border-white/5 flex items-center justify-between text-[11px] font-mono">
          <span className="text-gray-400">
            Diagnosis: <strong className="text-white">{selectedCategory}</strong>
          </span>
          <span className="text-[#C5A028] font-bold">1,500 kcal/day</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSpeaking = speakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] ${
                  isUser ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div className="text-[9px] text-gray-400 font-mono mb-1">
                  {isUser ? 'You' : 'ELSHA AI'} • {msg.timestamp}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-[#8a7018] to-[#C5A028] text-black font-semibold rounded-tr-none'
                      : 'bg-[#141a16] border border-[#C5A028]/30 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <div className={isUser ? 'text-black' : 'prose prose-invert max-w-none text-xs space-y-2'}>
                    <Markdown>{msg.text}</Markdown>
                  </div>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#C5A028]" />}
                        <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isUser && msg.suggestedActions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.suggestedActions.slice(0, 2).map((act, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(act)}
                        className="text-[10px] py-1 px-2 rounded-full bg-black/40 border border-[#C5A028]/30 text-gray-300 hover:text-[#f7d88c] cursor-pointer"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#141a16] border border-[#C5A028]/30 w-fit text-xs text-[#f7d88c]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A028] animate-ping" />
              <span>Analyzing metabolic impact...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-[#111613] border-t border-[#C5A028]/30 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="input-drawer-chat"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask personal nutrition AI..."
              className="flex-1 bg-black border border-white/20 focus:border-[#C5A028] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 rounded-xl bg-[#C5A028] text-black font-bold hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullSuite();
            }}
            className="w-full py-1.5 text-[10px] font-mono text-[#f7d88c] hover:underline flex items-center justify-center gap-1"
          >
            <span>Open Full Consultation Suite (Plate Scanner &amp; Swapper)</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
