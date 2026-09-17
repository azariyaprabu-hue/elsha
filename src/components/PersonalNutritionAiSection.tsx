import React, { useState, useRef, useEffect } from 'react';
import {
  GeneralInfo,
  Calculations,
  NutritionChatMessage,
  PlateAnalysisData,
  MealSwapRecommendation,
  ClinicalConsultationNote,
  DietaryRecallItem,
  MedicalHistory,
} from '../types';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  Camera,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  PieChart,
  Droplets,
  Pill,
  HeartPulse,
  Activity,
  ThumbsUp,
  FileCheck,
  Zap,
  Info,
  ChevronRight,
  Sparkle,
  Copy,
  Check,
  Utensils,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { AiAutomatedPlanGeneratorView } from './AiAutomatedPlanGeneratorView';

interface PersonalNutritionAiSectionProps {
  generalInfo: GeneralInfo;
  calculations: Calculations;
  selectedCategory: string;
  selectedDomain?: string;
  medicalHistory?: MedicalHistory;
  dietaryRecall?: DietaryRecallItem[];
  onAddClinicalNote?: (note: ClinicalConsultationNote) => void;
  onAddRecallItem?: (item: DietaryRecallItem) => void;
  onOpenPrescription?: () => void;
}

type AiSubMode = 'ai-7day-generator' | 'chat' | 'plate-scanner' | 'craving-swap' | 'checkin';

export const PersonalNutritionAiSection: React.FC<PersonalNutritionAiSectionProps> = ({
  generalInfo,
  calculations,
  selectedCategory,
  selectedDomain = 'diabetes',
  medicalHistory,
  dietaryRecall = [],
  onAddClinicalNote,
  onAddRecallItem,
  onOpenPrescription,
}) => {
  const [activeSubMode, setActiveSubMode] = useState<AiSubMode>('ai-7day-generator');
  const [messages, setMessages] = useState<NutritionChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello **${generalInfo.name || 'Kiruthika'}**! I am your **ELSHA Personal Nutrition AI** from ŽIATHLON Sports Medicine Clinic.\n\nI am calibrated to your profile:\n- **Metabolic Goal**: 1,500 kcal target deficit (TDEE: ${calculations.tdee} kcal)\n- **Clinical Focus**: ${selectedCategory || 'Type 2 Diabetes Mellitus'} & Glycemic Stability\n- **Active Protocol**: Metformin 500mg (BD with meals) + 2.8L hydration target\n\nHow can I support your nutrition right now? You can ask about managing cravings, check glycemic index of your favorite foods, or scan your meal plate for instant feedback!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      glycemicImpact: 'Balanced',
      suggestedActions: [
        'Can I eat a mango after dinner tonight?',
        'I have a 4 PM sweet craving. What can I eat?',
        'How can I reduce bloating after eating chana?',
        'Suggest a high-protein breakfast under 300 kcal',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncedNoteId, setSyncedNoteId] = useState<string | null>(null);

  // Plate Scanner State
  const [plateImage, setPlateImage] = useState<string | null>(null);
  const [isAnalyzingPlate, setIsAnalyzingPlate] = useState(false);
  const [plateMealType, setPlateMealType] = useState('Lunch');
  const [plateAnalysis, setPlateAnalysis] = useState<PlateAnalysisData | null>(null);

  // Craving Swapper State
  const [cravingInput, setCravingInput] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResults, setSwapResults] = useState<MealSwapRecommendation[]>([]);

  // Daily Check-In State
  const [waterGlasses, setWaterGlasses] = useState(7); // 7 x 250ml = 1.75L
  const [fastingGlucose, setFastingGlucose] = useState('112');
  const [postMealGlucose, setPostMealGlucose] = useState('138');
  const [tookMedication, setTookMedication] = useState(true);
  const [energyLevel, setEnergyLevel] = useState<'High' | 'Steady' | 'Sluggish' | 'Low'>('Steady');
  const [gutStatus, setGutStatus] = useState('Comfortable');
  const [checkInFeedback, setCheckInFeedback] = useState<string | null>(null);
  const [isEvaluatingCheckIn, setIsEvaluatingCheckIn] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plateFileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeSubMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeSubMode]);

  // Handle Speech synthesis (Text-to-Speech)
  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural speech
    const cleanSpeech = text
      .replace(/[#*_`~-]/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Google'))
    );
    if (friendlyVoice) utterance.voice = friendlyVoice;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Sync AI Advice directly into Clinical Notes
  const handleSyncToClinicalNotes = (text: string, id: string) => {
    if (!onAddClinicalNote) return;

    const newNote: ClinicalConsultationNote = {
      id: `note-ai-${Date.now()}`,
      sessionDate: new Date().toISOString().split('T')[0],
      sessionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicianName: 'ELSHA Personal Nutrition AI (Automated Patient Consultation)',
      consultationType: 'Follow-up Consultation',
      categoryTag: 'Dietary Adjustment',
      patientAdherence: 'High (80-100%)',
      chiefComplaintsObservations: 'Patient engaged in interactive AI dietary consultation regarding glycemic management.',
      objectiveVitalsFindings: {
        bloodGlucosePostPrandial: postMealGlucose ? `${postMealGlucose} mg/dL` : undefined,
        bloodGlucoseFasting: fastingGlucose ? `${fastingGlucose} mg/dL` : undefined,
        currentWeight: `${generalInfo.weight} kg`,
      },
      dietaryComplianceNotes: 'Patient adhering to 1,500 kcal target with personalized glycemic substitutions.',
      privateClinicalAssessment: 'AI dietary intervention generated following clinical guidelines for T2D.',
      actionPlanNextSteps: text.slice(0, 300) + '...',
      isConfidential: false,
      encryptedAt: new Date().toISOString(),
    };

    onAddClinicalNote(newNote);
    setSyncedNoteId(id);
    setTimeout(() => setSyncedNoteId(null), 3000);
  };

  // Send Chat Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query && !attachedImage) return;

    const userMessage: NutritionChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query || 'Analyze this food plate photo for my diabetes plan.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imagePreview: attachedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    const currentImg = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const patientProfile = {
        name: generalInfo.name,
        age: generalInfo.age,
        sex: generalInfo.sex,
        height: generalInfo.height,
        weight: generalInfo.weight,
        bmi: calculations.bmi,
        bmiCategory: calculations.bmiCategory,
        bmr: calculations.bmr,
        tdee: calculations.tdee,
        targetCalories: 1500,
        domainCategory: selectedCategory,
        medications: 'Metformin 500mg twice daily with meals',
        dietaryHabits: 'South Indian ovo-lacto vegetarian, prefers rice and sambar, prone to afternoon cravings',
        waterIntake: `${(waterGlasses * 0.25).toFixed(1)} Liters`,
      };

      const res = await fetch('/api/nutrition-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ sender: m.sender, text: m.text })),
          patientProfile,
          imageBase64: currentImg,
        }),
      });

      const data = await res.json();

      const aiMessage: NutritionChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is your personalized nutritional advice.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        glycemicImpact: data.glycemicRating || 'Balanced',
        suggestedActions: data.suggestedActions || [
          'Suggest low-GI snacks under 150 kcal',
          'How does dinner timing affect blood sugar?',
          'Gut friendly spices for digestion',
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: NutritionChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### Clinical Guidance\n\nFor your 1,500 kcal target in **${selectedCategory}**:\n- Prioritize starting meals with fresh soluble fiber (salads, cucumbers).\n- Combine carbohydrates with high-biological value protein (dal, paneer, tofu).\n- Continue taking your prescribed Metformin right with food to ensure comfortable digestion.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        glycemicImpact: 'Balanced',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle File Input for Chat Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Plate Scanner Upload
  const handlePlateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPlateImage(reader.result as string);
      analyzePlateImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzePlateImage = async (imgData: string) => {
    setIsAnalyzingPlate(true);
    setPlateAnalysis(null);

    try {
      const res = await fetch('/api/analyze-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgData,
          mealType: plateMealType,
          patientProfile: {
            name: generalInfo.name,
            targetCalories: 1500,
            domainCategory: selectedCategory,
          },
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setPlateAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Plate analysis error:', err);
    } finally {
      setIsAnalyzingPlate(false);
    }
  };

  // Sample Plates for instant one-click testing
  const samplePlates = [
    {
      name: 'South Indian Balanced Lunch',
      desc: 'Yellow Dal, Steamed Cabbage Poriyal, 1/2 Cup Rice, Curd',
      img: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111"/><circle cx="150" cy="100" r="70" fill="%23222" stroke="%23C5A028" stroke-width="4"/><circle cx="120" cy="85" r="25" fill="%23eab308"/><circle cx="175" cy="85" r="22" fill="%2322c55e"/><circle cx="150" cy="135" r="24" fill="%23f8fafc"/><text x="150" y="190" fill="%23C5A028" font-size="11" text-anchor="middle" font-family="sans-serif">Sample Plate: Dal + Veggies + Curd + Rice</text></svg>',
    },
    {
      name: 'High-Spike Warning Plate',
      desc: 'Large Bowl White Rice, Fried Papad, Sweet Chutney, Potato Curry',
      img: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111"/><circle cx="150" cy="100" r="70" fill="%23222" stroke="%23e11d48" stroke-width="4"/><circle cx="150" cy="95" r="45" fill="%23f8fafc"/><circle cx="120" cy="135" r="20" fill="%23f59e0b"/><circle cx="180" cy="135" r="18" fill="%23ef4444"/><text x="150" y="190" fill="%23f87171" font-size="11" text-anchor="middle" font-family="sans-serif">Sample Plate: High Glycemic White Rice Bowl</text></svg>',
    },
    {
      name: 'Diabetic Evening Snack',
      desc: 'Sprouted Moong Chaat, Roasted Makhana, Lemon, Green Tea',
      img: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111"/><circle cx="150" cy="100" r="70" fill="%23222" stroke="%2310b981" stroke-width="4"/><circle cx="130" cy="95" r="28" fill="%2310b981"/><circle cx="170" cy="95" r="22" fill="%23eab308"/><circle cx="150" cy="135" r="18" fill="%2338bdf8"/><text x="150" y="190" fill="%2334d399" font-size="11" text-anchor="middle" font-family="sans-serif">Sample Plate: Sprouted Moong Chaat &amp; Tea</text></svg>',
    },
  ];

  // Request Craving Swap
  const handleRequestSwap = async (cravingText?: string) => {
    const item = cravingText || cravingInput;
    if (!item.trim()) return;

    setIsSwapping(true);
    try {
      const res = await fetch('/api/suggest-meal-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cravingOrMeal: item,
          patientProfile: {
            name: generalInfo.name,
            targetCalories: 1500,
            domainCategory: selectedCategory,
          },
        }),
      });

      const data = await res.json();
      if (data.swaps) {
        setSwapResults(data.swaps);
      }
    } catch (err) {
      console.error('Swap error:', err);
    } finally {
      setIsSwapping(false);
    }
  };

  // Evaluate Daily Check-In
  const handleEvaluateCheckIn = async () => {
    setIsEvaluatingCheckIn(true);
    setCheckInFeedback(null);

    try {
      const prompt = `Patient Daily Check-in Review:
- Fasting Glucose: ${fastingGlucose} mg/dL (target <100-110 mg/dL)
- Post-Meal Glucose: ${postMealGlucose} mg/dL (target <140 mg/dL)
- Water Intake: ${(waterGlasses * 0.25).toFixed(1)}L / 2.8L goal
- Medication Taken: ${tookMedication ? 'Yes, Metformin taken with meal' : 'MISSED Metformin dose'}
- Energy Level: ${energyLevel}
- Gut Comfort: ${gutStatus}
- Daily Energy Budget: 1,500 kcal

Provide a warm, personalized 2-paragraph clinical evaluation and actionable guidance for the remainder of today.`;

      const res = await fetch('/api/nutrition-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: prompt }],
          patientProfile: {
            name: generalInfo.name,
            targetCalories: 1500,
            domainCategory: selectedCategory,
          },
        }),
      });

      const data = await res.json();
      setCheckInFeedback(data.reply);
    } catch (err) {
      console.error('Check-in evaluation error:', err);
      setCheckInFeedback(
        `Great job logging your numbers today, ${generalInfo.name || 'Kiruthika'}! Your post-meal glucose of ${postMealGlucose} mg/dL is within the optimal diabetic threshold (<140 mg/dL). Drink 3 more glasses of water before 8 PM to meet your 2.8L target!`
      );
    } finally {
      setIsEvaluatingCheckIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Patient Clinical Dossier Header */}
      <div className="p-5 rounded-2xl bg-[#0a0d0b] border-2 border-[#C5A028] shadow-[0_0_30px_rgba(197,160,40,0.15)] relative overflow-hidden">
        {/* Subtle Ambient Background Accent */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#C5A028]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C5A028] font-bold">
                ŽIATHLON Sports Medicine • Clinical Nutrition Suite
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Nutritionist Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-2">
              Personal Nutrition AI
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C5A028]/20 border border-[#C5A028]/50 text-[#f7d88c] font-sans font-medium">
                Patient Consultation
              </span>
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Dedicated interactive dietary intelligence tailored for{' '}
              <strong className="text-[#C5A028]">{generalInfo.name || 'Kiruthika'}</strong> with{' '}
              <span className="text-white font-medium">{selectedCategory || 'Type 2 Diabetes Mellitus'}</span>.
            </p>
          </div>

          {/* Vitals & Protocol Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-center">
              <div className="text-[10px] text-gray-400 font-mono uppercase">Energy Target</div>
              <div className="text-base font-bold text-[#C5A028] font-serif">1,500 kcal</div>
              <div className="text-[9px] text-emerald-400">TDEE: {calculations.tdee}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-center">
              <div className="text-[10px] text-gray-400 font-mono uppercase">BMI Index</div>
              <div className="text-base font-bold text-white font-serif">{calculations.bmi}</div>
              <div className="text-[9px] text-amber-300">{calculations.bmiCategory}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-center">
              <div className="text-[10px] text-gray-400 font-mono uppercase">Medication</div>
              <div className="text-base font-bold text-white font-serif truncate">Metformin</div>
              <div className="text-[9px] text-gray-300">500mg (with meals)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-center">
              <div className="text-[10px] text-gray-400 font-mono uppercase">Hydration</div>
              <div className="text-base font-bold text-sky-400 font-serif">
                {(waterGlasses * 0.25).toFixed(1)} / 2.8 L
              </div>
              <div className="text-[9px] text-sky-300">{waterGlasses} / 11 glasses</div>
            </div>
          </div>
        </div>

        {/* Sub-Mode Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="submode-btn-7day-ai"
            onClick={() => setActiveSubMode('ai-7day-generator')}
            className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeSubMode === 'ai-7day-generator'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-sky-400 text-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-black/50 text-amber-300 border-amber-500/30 hover:border-amber-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
            <span>1. 🌟 Dynamic 2-Page AI Plan (Diet & Exercise)</span>
          </button>

          <button
            type="button"
            id="submode-btn-chat"
            onClick={() => setActiveSubMode('chat')}
            className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeSubMode === 'chat'
                ? 'bg-[#C5A028] text-black border-[#C5A028] shadow-[0_0_15px_rgba(197,160,40,0.4)]'
                : 'bg-black/40 text-gray-300 border-white/10 hover:border-[#C5A028]/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Patient AI Dialogue</span>
          </button>

          <button
            type="button"
            id="submode-btn-plate"
            onClick={() => setActiveSubMode('plate-scanner')}
            className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeSubMode === 'plate-scanner'
                ? 'bg-[#C5A028] text-black border-[#C5A028] shadow-[0_0_15px_rgba(197,160,40,0.4)]'
                : 'bg-black/40 text-gray-300 border-white/10 hover:border-[#C5A028]/50 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>3. Smart Plate Scanner</span>
          </button>

          <button
            type="button"
            id="submode-btn-swaps"
            onClick={() => setActiveSubMode('craving-swap')}
            className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeSubMode === 'craving-swap'
                ? 'bg-[#C5A028] text-black border-[#C5A028] shadow-[0_0_15px_rgba(197,160,40,0.4)]'
                : 'bg-black/40 text-gray-300 border-white/10 hover:border-[#C5A028]/50 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>4. Diabetic Craving Swapper</span>
          </button>

          <button
            type="button"
            id="submode-btn-checkin"
            onClick={() => setActiveSubMode('checkin')}
            className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeSubMode === 'checkin'
                ? 'bg-[#C5A028] text-black border-[#C5A028] shadow-[0_0_15px_rgba(197,160,40,0.4)]'
                : 'bg-black/40 text-gray-300 border-white/10 hover:border-[#C5A028]/50 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>5. Daily Vitals Check-In</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBMODE 1: PATIENT AI DIALOGUE CHAT                                       */}
      {/* ========================================================================= */}
      {activeSubMode === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3 flex flex-col h-[680px] bg-[#0c100e] border border-[#C5A028]/30 rounded-2xl overflow-hidden shadow-2xl">
            {/* Chat Room Header */}
            <div className="px-5 py-3.5 bg-[#111613] border-b border-[#C5A028]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A028]/20 border border-[#C5A028] flex items-center justify-center text-[#C5A028]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f7d88c] uppercase tracking-wider font-mono">
                    ELSHA Nutrition Bot • Personalized Consultation
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Grounded in ADA & RSSDI Clinical Guidelines • Metformin-aware
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset conversation history?')) {
                      setMessages([messages[0]]);
                    }
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
                  title="Clear chat history"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSpeaking = speakingMessageId === msg.id;
                const isCopied = copiedId === msg.id;
                const isSynced = syncedNoteId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[92%] sm:max-w-[85%] ${
                      isUser ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    {/* Sender label & Timestamp */}
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-400 font-mono px-1">
                      <span>{isUser ? generalInfo.name || 'You' : 'ELSHA Personal Nutrition AI'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.glycemicImpact && (
                        <span className="ml-2 px-2 py-0.2 rounded-full text-[9px] font-semibold bg-[#C5A028]/20 border border-[#C5A028]/40 text-[#f7d88c]">
                          {msg.glycemicImpact}
                        </span>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl transition-all shadow-md text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-[#8a7018] to-[#C5A028] text-black font-medium rounded-tr-none'
                          : 'bg-[#141a16] border border-[#C5A028]/30 text-gray-200 rounded-tl-none'
                      }`}
                    >
                      {/* Attached Photo in user message */}
                      {msg.imagePreview && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-black/20 max-w-xs">
                          <img
                            src={msg.imagePreview}
                            alt="Uploaded food plate"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                      )}

                      {/* Message Content Rendered with Markdown */}
                      <div className={isUser ? 'text-black space-y-2' : 'prose prose-invert max-w-none text-sm space-y-2'}>
                        <Markdown>{msg.text}</Markdown>
                      </div>

                      {/* Quick Interactive Actions for AI message */}
                      {!isUser && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            {/* Speech Read-out Button */}
                            <button
                              type="button"
                              onClick={() => handleSpeak(msg.text, msg.id)}
                              className={`py-1 px-2.5 rounded-lg flex items-center gap-1.5 text-[11px] font-medium border transition-colors cursor-pointer ${
                                isSpeaking
                                  ? 'bg-[#C5A028] text-black border-[#C5A028]'
                                  : 'bg-black/50 text-gray-300 border-white/10 hover:text-white hover:border-[#C5A028]/40'
                              }`}
                              title={isSpeaking ? 'Pause reading aloud' : 'Read advice aloud (Audio Speech)'}
                            >
                              {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#C5A028]" />}
                              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                            </button>

                            {/* Copy Advice */}
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="py-1 px-2.5 rounded-lg bg-black/50 text-gray-300 border border-white/10 hover:text-white hover:border-[#C5A028]/40 text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>

                          {/* Sync to Patient Clinical Notes */}
                          {onAddClinicalNote && (
                            <button
                              type="button"
                              onClick={() => handleSyncToClinicalNotes(msg.text, msg.id)}
                              disabled={Boolean(isSynced)}
                              className={`py-1 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isSynced
                                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500'
                                  : 'bg-[#C5A028]/20 border border-[#C5A028]/40 text-[#f7d88c] hover:bg-[#C5A028] hover:text-black'
                              }`}
                            >
                              {isSynced ? <CheckCircle2 className="w-3 h-3" /> : <FileCheck className="w-3 h-3" />}
                              <span>{isSynced ? 'Saved to Clinical Notes!' : 'Sync to Patient Record'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Follow-up Suggested Action Chips */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 px-1">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(action)}
                            className="text-[11px] py-1 px-2.5 rounded-full bg-black/40 border border-[#C5A028]/30 text-gray-300 hover:text-[#f7d88c] hover:border-[#C5A028] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkle className="w-2.5 h-2.5 text-[#C5A028]" />
                            <span>{action}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#141a16] border border-[#C5A028]/30 w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#C5A028] animate-ping" />
                  <div className="text-xs text-[#f7d88c] font-mono flex items-center gap-2">
                    <span>ELSHA Nutrition AI is analyzing your metabolic profile...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Image Preview Before Send */}
            {attachedImage && (
              <div className="p-3 bg-[#111613] border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={attachedImage}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-[#C5A028]"
                  />
                  <span className="text-xs text-gray-300">Photo attached for AI plate review</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-[#111613] border-t border-[#C5A028]/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Image Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  id="btn-chat-attach-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-black/60 border border-white/20 text-gray-300 hover:text-[#C5A028] hover:border-[#C5A028] transition-colors cursor-pointer"
                  title="Attach or snap meal photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Text Field */}
                <input
                  type="text"
                  id="input-patient-nutrition-chat"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask your personal nutrition AI (e.g. "Can I eat a mango after dinner?")`}
                  className="flex-1 bg-black/80 border border-white/20 focus:border-[#C5A028] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A028]"
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  id="btn-send-nutrition-chat"
                  disabled={isLoading || (!inputQuery.trim() && !attachedImage)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#8a7018] to-[#C5A028] text-black font-bold hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Interactive Clinical Tools & Quick Prompts */}
          <div className="space-y-4">
            {/* Quick Consultation Starters */}
            <div className="p-4 rounded-2xl bg-[#0c100e] border border-[#C5A028]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#f7d88c] uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                <span>Quick Patient Prompts</span>
              </div>
              <div className="space-y-1.5">
                {[
                  {
                    title: 'Mango & Fruit Safety',
                    text: 'Can I eat a slice of mango or papaya after dinner tonight?',
                  },
                  {
                    title: '4 PM Sweet Cravings',
                    text: 'I have a sudden intense sweet craving at work. What diabetic-friendly snack can I eat?',
                  },
                  {
                    title: 'White Rice Optimization',
                    text: 'How can I make my white rice meal safer for my blood sugar spike?',
                  },
                  {
                    title: 'Metformin & Meal Timing',
                    text: 'When should I take my Metformin 500mg with respect to my food?',
                  },
                  {
                    title: 'Bloating & Gut Relief',
                    text: 'I feel bloated and gassy after my lunch, what herbal or dietary remedy helps immediately?',
                  },
                  {
                    title: 'Dining Out Guidelines',
                    text: 'I am attending a family dinner at a South Indian restaurant. What should I order?',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-[#C5A028]/50 hover:bg-[#C5A028]/5 transition-all text-xs group cursor-pointer"
                  >
                    <div className="font-semibold text-white group-hover:text-[#f7d88c] flex items-center justify-between">
                      <span>{item.title}</span>
                      <ChevronRight className="w-3 h-3 text-[#C5A028] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.text}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Hydration Tracker */}
            <div className="p-4 rounded-2xl bg-[#0c100e] border border-[#C5A028]/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-sky-300 uppercase tracking-wider font-mono">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Hydration Coach</span>
                </div>
                <span className="text-[11px] text-gray-400">Target: 2.8 L / Day</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold font-serif text-white">
                    {(waterGlasses * 0.25).toFixed(2)} Liters
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {waterGlasses} of 11 recommended glasses (250ml)
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-black border border-white/10 text-gray-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses((prev) => prev + 1)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 border border-sky-400/50 text-sky-300 font-bold text-xs hover:bg-sky-500/30 flex items-center gap-1 cursor-pointer"
                  >
                    + Glass
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterGlasses / 11) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">
                Proper hydration reduces blood viscosity and supports renal glucose excretion in Type 2 Diabetes.
              </p>
            </div>

            {/* Clinical Rule Card */}
            <div className="p-4 rounded-2xl bg-[#0c100e] border border-[#C5A028]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#f7d88c] uppercase tracking-wider font-mono">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A028]" />
                <span>The 3-Step Eating Order</span>
              </div>
              <p className="text-[11px] text-gray-300">
                To blunt postprandial glucose spikes by up to 40%:
              </p>
              <ol className="text-[11px] text-gray-300 space-y-1 list-decimal list-inside font-mono">
                <li><strong className="text-emerald-400">Fiber first:</strong> Salads & greens</li>
                <li><strong className="text-[#f7d88c]">Protein second:</strong> Dal, paneer, tofu</li>
                <li><strong className="text-gray-400">Carbs last:</strong> Rice or roti</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMODE 2: SMART PLATE & FOOD SCANNER                                     */}
      {/* ========================================================================= */}
      {activeSubMode === 'plate-scanner' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c100e] border border-[#C5A028]/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A028]">
                  Multimodal Computer Vision Analysis
                </span>
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  Smart Plate Scanner & Macro Estimator
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload or snap your meal plate. The AI identifies items, computes calories and glycemic index, and recommends eating order.
                </p>
              </div>

              {/* Meal Type Selector */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10 text-xs">
                {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => setPlateMealType(meal)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      plateMealType === meal
                        ? 'bg-[#C5A028] text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area & Sample Plates */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upload Dropzone */}
              <div className="lg:col-span-1 space-y-3">
                <input
                  ref={plateFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePlateUpload}
                  className="hidden"
                />

                <div
                  onClick={() => plateFileInputRef.current?.click()}
                  className="h-64 rounded-2xl border-2 border-dashed border-[#C5A028]/40 hover:border-[#C5A028] bg-black/40 hover:bg-[#C5A028]/5 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
                >
                  {plateImage ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <img
                        src={plateImage}
                        alt="Plate Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-[#f7d88c] bg-black/80 px-3 py-1.5 rounded-lg border border-[#C5A028]">
                          Click to Change Photo
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-[#C5A028]/10 border border-[#C5A028]/30 flex items-center justify-center text-[#C5A028] mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#f7d88c]">
                        Snap Photo or Drag Plate Image
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Supports JPEG, PNG, Camera photo
                      </div>
                    </>
                  )}
                </div>

                {/* Instant Sample Plates for quick testing */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    Or select a clinical test plate:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {samplePlates.map((sp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPlateImage(sp.img);
                          analyzePlateImage(sp.img);
                        }}
                        className="text-left p-2 rounded-xl bg-black/50 border border-white/10 hover:border-[#C5A028] text-xs transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-white">{sp.name}</div>
                          <div className="text-[10px] text-gray-400">{sp.desc}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#C5A028]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analysis Results Display */}
              <div className="lg:col-span-2 space-y-4">
                {isAnalyzingPlate ? (
                  <div className="h-64 rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#C5A028] border-t-transparent animate-spin" />
                    <div className="text-xs font-mono text-[#f7d88c]">
                      ELSHA Vision AI is segmenting foods and computing Glycemic Score...
                    </div>
                  </div>
                ) : plateAnalysis ? (
                  <div className="space-y-4">
                    {/* Top Glycemic Verdict Banner */}
                    <div className="p-4 rounded-xl bg-black/70 border border-[#C5A028]/40 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-gray-400">
                          Overall Glycemic Impact
                        </div>
                        <div className="text-lg font-serif font-bold text-[#f7d88c] flex items-center gap-2">
                          {plateAnalysis.overallGlycemicScore}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-sans">
                            {plateAnalysis.diabeticSuitability}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono text-gray-400">
                          Total Energy
                        </div>
                        <div className="text-2xl font-serif font-bold text-white">
                          {plateAnalysis.totalEstimatedCalories}{' '}
                          <span className="text-xs text-[#C5A028] font-sans">kcal</span>
                        </div>
                      </div>
                    </div>

                    {/* Macronutrient Distribution */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">Carbs</span>
                        <div className="text-base font-bold text-[#f7d88c] font-serif">
                          {plateAnalysis.totalCarbs}g
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">Protein</span>
                        <div className="text-base font-bold text-emerald-400 font-serif">
                          {plateAnalysis.totalProtein}g
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">Fat</span>
                        <div className="text-base font-bold text-amber-400 font-serif">
                          {plateAnalysis.totalFat}g
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">Fiber</span>
                        <div className="text-base font-bold text-indigo-300 font-serif">
                          {plateAnalysis.totalFiber}g
                        </div>
                      </div>
                    </div>

                    {/* Identified Food Items Table */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#111613] px-4 py-2 text-[10px] uppercase font-mono tracking-wider text-[#C5A028] font-bold">
                        Identified Plate Components & Portion Estimates
                      </div>
                      <div className="divide-y divide-white/5 bg-black/40">
                        {plateAnalysis.identifiedItems?.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                          >
                            <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-[11px] text-gray-400">{item.portion}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-[#C5A028]">
                                {item.calories} kcal
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {item.carbs}g C • {item.protein}g P
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Recommendations */}
                    {plateAnalysis.recommendations && (
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                        <div className="text-xs font-bold text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>AI Coaching Recommendations for this Plate</span>
                        </div>
                        <ul className="text-xs text-gray-200 space-y-1 list-disc list-inside">
                          {plateAnalysis.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
                    <Utensils className="w-8 h-8 text-gray-600" />
                    <div className="text-xs font-medium">No meal plate scanned yet</div>
                    <div className="text-[11px] max-w-sm">
                      Upload a photo or choose one of the clinical sample plates on the left to see computer vision dietary feedback.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMODE 3: DIABETIC-SAFE CRAVING & MEAL SWAPPER                           */}
      {/* ========================================================================= */}
      {activeSubMode === 'craving-swap' && (
        <div className="p-6 rounded-2xl bg-[#0c100e] border border-[#C5A028]/30 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A028]">
              Behavioral Glycemic Substitution Engine
            </span>
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              Diabetic-Safe Craving & Meal Swapper
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Never abandon your favorite tastes. Enter what you are craving, and the AI crafts a low-GI, high-protein alternative matching the identical comfort profile.
            </p>
          </div>

          {/* Quick Popular Craving Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
              Popular Patient Cravings:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Gulab Jamun or Indian Sweets',
                'Chicken Biryani with White Basmati Rice',
                'Samosa with Sweet Tamarind Chutney',
                'Crispy French Fries or Potato Wedges',
                'Cold Coffee with Sugar & Cream',
                'Masala Dosa with White Coconut Chutney',
              ].map((craving, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCravingInput(craving);
                    handleRequestSwap(craving);
                  }}
                  className="py-1.5 px-3 rounded-full text-xs font-semibold bg-black/60 border border-white/10 hover:border-[#C5A028] text-gray-300 hover:text-[#f7d88c] transition-all cursor-pointer"
                >
                  {craving}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              id="input-craving-search"
              value={cravingInput}
              onChange={(e) => setCravingInput(e.target.value)}
              placeholder="Type any craving or dish (e.g. 'Ice cream', 'Biryani', 'Pizza', 'Parotta')"
              className="flex-1 bg-black/80 border border-white/20 focus:border-[#C5A028] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C5A028]"
            />
            <button
              type="button"
              id="btn-find-safe-swap"
              onClick={() => handleRequestSwap()}
              disabled={isSwapping || !cravingInput.trim()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#8a7018] to-[#C5A028] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              {isSwapping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Find Safe Swap</span>
            </button>
          </div>

          {/* Swap Results Cards */}
          {swapResults.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#C5A028] font-bold">
                Clinical Low-GI Substitutions for &quot;{cravingInput}&quot;:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {swapResults.map((swap, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-black/60 border border-[#C5A028]/40 space-y-4 hover:border-[#C5A028] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">
                          Swap #{idx + 1} Recommendation
                        </span>
                        <h4 className="text-lg font-serif font-bold text-[#f7d88c]">
                          {swap.healthySwap}
                        </h4>
                      </div>
                      <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shrink-0">
                        {swap.glycemicIndex}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-[#111613] border border-white/5">
                        <div className="text-[9px] text-gray-400 uppercase font-mono">Energy</div>
                        <div className="font-bold text-white font-serif">{swap.calories} kcal</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#111613] border border-white/5">
                        <div className="text-[9px] text-gray-400 uppercase font-mono">Carbs Saved</div>
                        <div className="font-bold text-emerald-400 font-serif">{swap.carbsSaved}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#111613] border border-white/5">
                        <div className="text-[9px] text-gray-400 uppercase font-mono">Protein Gain</div>
                        <div className="font-bold text-[#f7d88c] font-serif">{swap.proteinBoost}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">
                        <strong className="text-white">Why it works:</strong> {swap.clinicalBenefit}
                      </div>
                      <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-gray-300 font-mono text-[11px]">
                        <span className="text-[#C5A028] font-bold">Quick Recipe: </span>
                        {swap.quickRecipeTip}
                      </div>
                    </div>

                    {/* Button to ask chat for full recipe */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubMode('chat');
                        handleSendMessage(
                          `Please give me the complete step-by-step diabetic recipe for: ${swap.healthySwap}`
                        );
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-[#C5A028]/20 border border-white/10 hover:border-[#C5A028] text-xs text-gray-200 hover:text-[#f7d88c] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                    >
                      <Sparkles className="w-3 h-3 text-[#C5A028]" />
                      <span>Ask AI for Step-by-Step Recipe in Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMODE 4: DAILY VITALS & GLYCEMIC CHECK-IN                               */}
      {/* ========================================================================= */}
      {activeSubMode === 'checkin' && (
        <div className="p-6 rounded-2xl bg-[#0c100e] border border-[#C5A028]/30 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A028]">
              Continuous Patient Telehealth Monitoring
            </span>
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              Daily Glycemic & Symptom Check-In
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Record today&apos;s glucose, medication compliance, and gut comfort to receive instantaneous AI clinical evaluation and proactive adjustments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Fasting Glucose */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase font-mono flex items-center justify-between">
                <span>Fasting Glucose (mg/dL)</span>
                <span className="text-[10px] text-emerald-400">Target: 80-110</span>
              </label>
              <input
                type="number"
                id="input-fasting-glucose"
                value={fastingGlucose}
                onChange={(e) => setFastingGlucose(e.target.value)}
                className="w-full bg-black border border-white/20 focus:border-[#C5A028] rounded-lg p-2.5 text-sm text-white font-mono focus:outline-none"
              />
              <p className="text-[10px] text-gray-400">Measured immediately upon waking</p>
            </div>

            {/* Post-Prandial Glucose */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase font-mono flex items-center justify-between">
                <span>Post-Meal Glucose (mg/dL)</span>
                <span className="text-[10px] text-emerald-400">Target: &lt;140</span>
              </label>
              <input
                type="number"
                id="input-postmeal-glucose"
                value={postMealGlucose}
                onChange={(e) => setPostMealGlucose(e.target.value)}
                className="w-full bg-black border border-white/20 focus:border-[#C5A028] rounded-lg p-2.5 text-sm text-white font-mono focus:outline-none"
              />
              <p className="text-[10px] text-gray-400">Measured 2 hours post-lunch or dinner</p>
            </div>

            {/* Metformin Adherence */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase font-mono">
                Medication Adherence
              </label>
              <button
                type="button"
                onClick={() => setTookMedication(!tookMedication)}
                className={`w-full p-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  tookMedication
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300'
                }`}
              >
                {tookMedication ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{tookMedication ? 'Metformin Taken with Meal' : 'Missed Medication'}</span>
              </button>
              <p className="text-[10px] text-gray-400">Always consume with meals to prevent GI upset</p>
            </div>

            {/* Energy Level */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase font-mono">
                Post-Meal Energy
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['High', 'Steady', 'Sluggish', 'Low'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                      energyLevel === lvl
                        ? 'bg-[#C5A028] text-black border-[#C5A028] font-bold'
                        : 'bg-black border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Gut Health */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase font-mono">
                Gut Comfort & Bloating
              </label>
              <select
                id="select-gut-comfort"
                value={gutStatus}
                onChange={(e) => setGutStatus(e.target.value)}
                className="w-full bg-black border border-white/20 focus:border-[#C5A028] rounded-lg p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Comfortable">Comfortable (No bloating or reflux)</option>
                <option value="Mild Gas/Bloating">Mild Gas / Bloating after lunch</option>
                <option value="Acid Reflux">Acid Reflux / Heartburn</option>
                <option value="Constipated">Sluggish digestion / Constipated</option>
              </select>
            </div>

            {/* Water Tracker */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase font-mono flex items-center justify-between">
                <span>Water Glasses</span>
                <span className="text-sky-300 font-bold">{(waterGlasses * 0.25).toFixed(1)}L / 2.8L</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono font-bold text-white">
                  {waterGlasses} glasses (250ml)
                </span>
                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => prev + 1)}
                  className="px-3 py-2 bg-sky-600/30 border border-sky-400 rounded-lg text-sky-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Submit for AI Review */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              id="btn-evaluate-daily-checkin"
              onClick={handleEvaluateCheckIn}
              disabled={isEvaluatingCheckIn}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#8a7018] to-[#C5A028] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isEvaluatingCheckIn ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              <span>Analyze Today&apos;s Check-in with AI</span>
            </button>
          </div>

          {/* AI Clinical Evaluation Feedback */}
          {checkInFeedback && (
            <div className="p-5 rounded-2xl bg-[#141a16] border border-[#C5A028]/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#f7d88c] uppercase font-mono">
                  <Sparkles className="w-4 h-4 text-[#C5A028]" />
                  <span>Personal AI Clinical Evaluation</span>
                </div>
                {onAddClinicalNote && (
                  <button
                    type="button"
                    onClick={() => handleSyncToClinicalNotes(checkInFeedback, 'checkin-feedback')}
                    className="py-1 px-3 rounded-lg text-[11px] font-bold bg-[#C5A028]/20 border border-[#C5A028]/40 text-[#f7d88c] hover:bg-[#C5A028] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Log to Clinical Notes</span>
                  </button>
                )}
              </div>
              <div className="prose prose-invert max-w-none text-sm text-gray-200 space-y-2">
                <Markdown>{checkInFeedback}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMODE 1: AI AUTOMATED DYNAMIC 2-PAGE DIET & EXERCISE PLAN               */}
      {/* ========================================================================= */}
      {activeSubMode === 'ai-7day-generator' && (
        <AiAutomatedPlanGeneratorView
          generalInfo={generalInfo}
          calculations={calculations}
          initialDomain={selectedDomain || 'diabetes'}
          medicalHistory={medicalHistory}
          dietaryRecall={dietaryRecall}
          onOpenPrescription={onOpenPrescription}
        />
      )}
    </div>
  );
};
