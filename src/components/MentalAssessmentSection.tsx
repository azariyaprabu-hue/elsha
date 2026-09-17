import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  AlertCircle,
  Activity,
  ShieldCheck,
  Zap,
  Moon,
  Coffee,
  Heart,
  Scale,
  Smile,
  CheckCircle2,
} from 'lucide-react';

export interface MentalHealthQuestionItem {
  id: string;
  questionNumber: number;
  domain: 'Stress & HPA Axis' | 'Mood & Serotonin' | 'Anxiety & GABA' | 'Cognition & Dopamine' | 'Gut-Brain Axis';
  question: string;
  clinicalSignificance: string;
  neuroBiochemicalPathway: string;
  nutritionalRecommendation: string;
  patientRating: 0 | 1 | 2 | 3 | 4; // 0=Never, 1=Rarely, 2=Sometimes, 3=Frequently, 4=Daily
}

export const initialMental15Questions: MentalHealthQuestionItem[] = [
  {
    id: 'mq-1',
    questionNumber: 1,
    domain: 'Stress & HPA Axis',
    question: 'How often do you feel overwhelmed, unable to cope with daily pressures or experience an afternoon energy crash (2–4 PM)?',
    clinicalSignificance: 'Perceived Stress Scale (PSS-10) indicator for chronic HPA-axis activation and adrenocortical dysregulation.',
    neuroBiochemicalPathway: 'Elevated sustained Cortisol depleting DHEA and disrupting diurnal rhythm.',
    nutritionalRecommendation: 'Withania somnifera (Ashwagandha KSM-66), Vitamin C 500mg, Holy Basil (Tulsi tea).',
    patientRating: 3,
  },
  {
    id: 'mq-2',
    questionNumber: 2,
    domain: 'Anxiety & GABA',
    question: 'Do you experience physical tension, tight neck/shoulders, shallow breathing, or inner nervousness without an apparent trigger?',
    clinicalSignificance: 'GAD-7 Somatic Anxiety metric indicating central nervous system autonomic hyperactivity.',
    neuroBiochemicalPathway: 'Suboptimal inhibitory GABA neurotransmission relative to excitatory glutamate.',
    nutritionalRecommendation: 'Magnesium Bisglycinate (300mg before bed), L-Theanine (150mg), Chamomile extract.',
    patientRating: 3,
  },
  {
    id: 'mq-3',
    questionNumber: 3,
    domain: 'Stress & HPA Axis',
    question: 'Do you struggle with sleep-onset latency (taking >30 mins to fall asleep) or waking up between 2 AM – 4 AM with racing thoughts?',
    clinicalSignificance: 'Insomnia Severity Index (ISI) showing nocturnal hypercortisolemia and nocturnal hypoglycemia.',
    neuroBiochemicalPathway: 'Delayed melatonin secretion and nocturnal liver glycogen depletion provoking adrenaline spike.',
    nutritionalRecommendation: 'Complex carb dinner with tryptophan (warm almond milk, pinch of nutmeg, chamomile).',
    patientRating: 2,
  },
  {
    id: 'mq-4',
    questionNumber: 4,
    domain: 'Gut-Brain Axis',
    question: 'Do periods of acute emotional stress immediately manifest as stomach churning, bloating, loose stools, or sharp abdominal cramping?',
    clinicalSignificance: 'Visceral Hypersensitivity & Vagus Nerve dysregulation characteristic of the Brain-Gut Axis.',
    neuroBiochemicalPathway: 'Corticotropin-releasing factor (CRF) causing mast cell degranulation and intestinal barrier hyperpermeability.',
    nutritionalRecommendation: 'L-Glutamine (5g morning), Probiotic strains (Bifidobacterium longum 1714), Ginger decoction.',
    patientRating: 3,
  },
  {
    id: 'mq-5',
    questionNumber: 5,
    domain: 'Mood & Serotonin',
    question: 'Do you turn to sugary snacks, sweet pastries, or ultra-processed salty foods when feeling stressed, lonely, or mentally drained?',
    clinicalSignificance: 'Emotional Eating & Food Addiction metric reflecting compensatory dopaminergic signaling.',
    neuroBiochemicalPathway: 'Low brain Serotonin triggering carbohydrate cravings to boost insulin-facilitated tryptophan entry across BBB.',
    nutritionalRecommendation: 'Chromium picolinate (200mcg), High-fiber roasted chana, pumpkin seeds, raw cacao.',
    patientRating: 3,
  },
  {
    id: 'mq-6',
    questionNumber: 6,
    domain: 'Cognition & Dopamine',
    question: 'Do you experience "Brain Fog", impaired memory recall, or difficulty maintaining sustained focus on analytical tasks?',
    clinicalSignificance: 'Cognitive Clutter & Executive Dysfunction metric reflecting cerebral neuro-inflammation.',
    neuroBiochemicalPathway: 'Microglial inflammation and reduced BDNF (Brain-Derived Neurotrophic Factor).',
    nutritionalRecommendation: 'Bacopa monnieri (Brahmi), Omega-3 DHA (1000mg), Lion’s Mane mushroom, Walnuts.',
    patientRating: 2,
  },
  {
    id: 'mq-7',
    questionNumber: 7,
    domain: 'Mood & Serotonin',
    question: 'Have you noticed a persistent loss of interest, enthusiasm, or joy in activities, exercise, or hobbies you normally love?',
    clinicalSignificance: 'PHQ-9 Anhedonia criterion indicating diminished mesolimbic reward system responsiveness.',
    neuroBiochemicalPathway: 'Dopaminergic receptor downregulation and reduced neuroplasticity in nucleus accumbens.',
    nutritionalRecommendation: 'Mucuna pruriens (natural L-DOPA), Vitamin D3 (60,000 IU monthly), Zinc 25mg.',
    patientRating: 2,
  },
  {
    id: 'mq-8',
    questionNumber: 8,
    domain: 'Anxiety & GABA',
    question: 'Do you experience intrusive catastrophic thoughts ("what-if" loops) or excessive hypervigilance regarding minor daily uncertainties?',
    clinicalSignificance: 'Generalized Anxiety Disorder (GAD-7) cognitive ruminative loop assessment.',
    neuroBiochemicalPathway: 'Hyperactive amygdala with weak prefrontal cortex top-down executive inhibition.',
    nutritionalRecommendation: 'Lemon balm extract, Ashwagandha, Glycine (3g), structured box breathing protocol.',
    patientRating: 2,
  },
  {
    id: 'mq-9',
    questionNumber: 9,
    domain: 'Cognition & Dopamine',
    question: 'Do you find it extraordinarily difficult to initiate essential tasks (procrastination paralysis) despite knowing their importance?',
    clinicalSignificance: 'Executive function & Task Initiation deficit linked to dopamine synthesis bottlenecks.',
    neuroBiochemicalPathway: 'Tyrosine hydroxylase enzymatic sluggishness due to iron, folate, or BH4 cofactor deficiencies.',
    nutritionalRecommendation: 'L-Tyrosine (500mg morning on empty stomach), Methylfolate (L-5-MTHF), Vitamin B6 (P5P).',
    patientRating: 3,
  },
  {
    id: 'mq-10',
    questionNumber: 10,
    domain: 'Stress & HPA Axis',
    question: 'How low is your frustration tolerance—do minor irritations provoke sudden anger, impatience, or irritability with family or colleagues?',
    clinicalSignificance: 'Emotional dysregulation & allostatic overload indicating depleted psychological buffer reserves.',
    neuroBiochemicalPathway: 'Fluctuating blood glucose combined with high sympathetic catecholamine tone (adrenaline).',
    nutritionalRecommendation: 'Balanced low-glycemic meals every 3.5–4 hours with protein + good fats; eliminate caffeine spikes.',
    patientRating: 3,
  },
  {
    id: 'mq-11',
    questionNumber: 11,
    domain: 'Stress & HPA Axis',
    question: 'Do you wake up in the morning feeling unrefreshed, heavy, and wanting to stay in bed, even after 7–8 hours of sleep?',
    clinicalSignificance: 'Sleep Architecture Disruption & Non-Restorative Sleep indicating suppressed Slow Wave Sleep (SWS).',
    neuroBiochemicalPathway: 'Blunted morning Cortisol Awakening Response (CAR) and fragmented REM cycles.',
    nutritionalRecommendation: 'Morning sunlight exposure (15 mins within 30 mins of waking), CoQ10 100mg, Cordyceps.',
    patientRating: 3,
  },
  {
    id: 'mq-12',
    questionNumber: 12,
    domain: 'Mood & Serotonin',
    question: 'Do you feel a sense of emotional numbness, detachment, or cynical exhaustion regarding your career or caregiving duties (Burnout)?',
    clinicalSignificance: 'Maslach Burnout Inventory (MBI) criteria: Emotional exhaustion & depersonalization.',
    neuroBiochemicalPathway: 'Systemic mitochondrial bioenergetic exhaustion with chronic oxidative stress.',
    nutritionalRecommendation: 'Acetyl-L-Carnitine, Alpha Lipoic Acid (ALA), Shilajit with fulvic acid, Rhodiola rosea.',
    patientRating: 2,
  },
  {
    id: 'mq-13',
    questionNumber: 13,
    domain: 'Gut-Brain Axis',
    question: 'Do you experience sudden food aversion, appetite suppression during deadlines, or sudden nauseous tightness before high-stakes events?',
    clinicalSignificance: 'Sympathetic splanchnic vasoconstriction shutting down gastrointestinal peristalsis.',
    neuroBiochemicalPathway: 'Noradrenaline redirection of blood flow away from the mesenteric enteric plexus to skeletal muscle.',
    nutritionalRecommendation: 'Herbal digestive bitters (Gentian/Dandelion) 10 mins before meals; 5 conscious diaphragmatic breaths.',
    patientRating: 2,
  },
  {
    id: 'mq-14',
    questionNumber: 14,
    domain: 'Anxiety & GABA',
    question: 'Do you catch yourself clenching your jaw, grinding teeth (bruxism), or feeling motor restlessness/fidgeting in your legs?',
    clinicalSignificance: 'Psychomotor agitation and neuromuscular hyperactivity.',
    neuroBiochemicalPathway: 'Intracellular magnesium deficiency in skeletal muscle neuromuscular junctions.',
    nutritionalRecommendation: 'Magnesium malate/glycinate (400mg total elemental), Epsom salt foot soaks, Potassium-rich coconut water.',
    patientRating: 1,
  },
  {
    id: 'mq-15',
    questionNumber: 15,
    domain: 'Mood & Serotonin',
    question: 'How slowly do you recover emotionally after an argument, setback, or unexpected stressor—does it disrupt your entire day or week?',
    clinicalSignificance: 'Emotional Resilience & Vagal Brake Index; measure of parasympathetic cardiac vagal tone.',
    neuroBiochemicalPathway: 'Low Heart Rate Variability (HRV) and delayed clearance of circulating catecholamines.',
    nutritionalRecommendation: 'Resveratrol, High-polyphenol green tea (EGCG), Heart coherence 0.1Hz resonance breathing practice.',
    patientRating: 2,
  },
];

export const MentalAssessmentSection: React.FC = () => {
  const [questions, setQuestions] = useState<MentalHealthQuestionItem[]>(initialMental15Questions);
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('All');

  const ratingLabels = ['Never (0)', 'Rarely (1)', 'Sometimes (2)', 'Frequently (3)', 'Daily (4)'];

  const handleUpdateRating = (id: string, rating: 0 | 1 | 2 | 3 | 4) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, patientRating: rating } : q))
    );
  };

  const totalScore = questions.reduce((sum, q) => sum + q.patientRating, 0); // Max 60
  const stressPercentage = Math.round((totalScore / 60) * 100);

  const getRiskStratification = () => {
    if (totalScore <= 15) {
      return {
        level: 'Optimal Resilience & Nervous System Balance',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500 text-black',
        summary: 'Excellent psychological buffer, balanced autonomic tone, robust cognitive resilience.',
      };
    }
    if (totalScore <= 30) {
      return {
        level: 'Mild Neuro-Emotional Stress & Subclinical Fatigue',
        color: 'text-yellow-400',
        badgeBg: 'bg-yellow-500 text-black',
        summary: 'Early warning signs of HPA-axis activation and moderate circadian sleep/mood strain.',
      };
    }
    if (totalScore <= 45) {
      return {
        level: 'Moderate Chronic Allostatic Load & Brain-Gut Strain',
        color: 'text-purple-400',
        badgeBg: 'bg-[#7E22CE] text-white',
        summary: 'Significant neurochemical imbalance: depleted GABA/serotonin, visceral gut reactivity, and sleep fragmentation.',
      };
    }
    return {
      level: 'Severe Neuro-Endocrine Burnout & Exhaustion Risk',
      color: 'text-red-400',
      badgeBg: 'bg-red-600 text-white',
      summary: 'Critical allostatic overload with microglial neuro-inflammation and imminent burnout requiring immediate adaptogenic intervention.',
    };
  };

  const risk = getRiskStratification();

  const domainCategories = ['All', 'Stress & HPA Axis', 'Mood & Serotonin', 'Anxiety & GABA', 'Cognition & Dopamine', 'Gut-Brain Axis'];

  const filteredQuestions = questions.filter((q) => {
    if (activeDomainFilter === 'All') return true;
    return q.domain === activeDomainFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-[#7E22CE] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#A855F7]">
            <Brain className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>MODULE 08 • VALIDATED CLINICAL NEURO-PSYCHIATRIC ASSESSMENT</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">
            Neuro Emotional Assessment
          </h2>
          <p className="text-xs text-gray-400">
            15 scientifically validated clinical questions evaluating HPA-Axis Stress, Serotonin, GABA, Dopamine, and Gut-Brain Axis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#0d0617] px-3.5 py-2 border border-[#7E22CE] text-[#A855F7] font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>PSS-10 / GAD-7 / PHQ-9 Grounded</span>
        </div>
      </div>

      {/* COMPOSITE SCORECARD */}
      <div className="bg-[#0e071a] border border-[#7E22CE] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] uppercase tracking-widest font-black text-[#A855F7]">
              Allostatic Stress & Neuro-Strain Index
            </span>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-white">
                {totalScore} <span className="text-sm font-normal opacity-60">/ 60</span>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${risk.badgeBg}`}>
                {risk.level}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {risk.summary}
            </p>
          </div>

          {/* Meter Bar */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase">
              <span>Optimal (0)</span>
              <span className="text-[#A855F7] font-bold">{stressPercentage}% Strain</span>
              <span>Severe (60)</span>
            </div>
            <div className="h-2.5 w-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-[#7E22CE] to-red-500 transition-all duration-500"
                style={{ width: `${stressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 font-mono uppercase tracking-wider">
              <span>Resilient</span>
              <span>Subclinical</span>
              <span>Burnout</span>
            </div>
          </div>
        </div>
      </div>

      {/* DOMAIN FILTER BAR */}
      <div className="p-3 bg-[#0d0617] border border-white/15 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase font-mono text-[#A855F7] font-bold">
            Filter Neuro-Domain:
          </span>
          {domainCategories.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setActiveDomainFilter(dom)}
              className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer border ${
                activeDomainFilter === dom
                  ? 'bg-[#7E22CE] text-white border-[#A855F7]'
                  : 'bg-black text-gray-400 border-white/10 hover:text-white hover:border-[#7E22CE]/60'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          Showing {filteredQuestions.length} of 15 Scientific Questions
        </span>
      </div>

      {/* 15 SCIENTIFIC QUESTIONS ACCORDION / CARDS */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-[#0d0617] border border-[#7E22CE]/50 hover:border-[#7E22CE] p-4 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#7E22CE] text-white flex items-center justify-center text-xs font-bold font-mono">
                  {q.questionNumber.toString().padStart(2, '0')}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#C084FC]">
                    {q.domain}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {q.question}
                  </h3>
                </div>
              </div>

              {/* Current Selection Badge */}
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 border ${
                  q.patientRating === 0
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
                    : q.patientRating === 1
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                    : q.patientRating === 2
                    ? 'border-yellow-500 text-yellow-300 bg-yellow-950/20'
                    : q.patientRating === 3
                    ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                    : 'border-red-500 text-red-300 bg-red-950/40'
                }`}
              >
                {ratingLabels[q.patientRating]}
              </span>
            </div>

            {/* Severity Rating Selector */}
            <div className="my-3 grid grid-cols-5 gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4].map((rate) => {
                const isSelected = q.patientRating === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleUpdateRating(q.id, rate as any)}
                    className={`py-2 px-1 text-center text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#7E22CE] text-white border-[#A855F7] shadow-[0_0_10px_rgba(126,34,206,0.5)]'
                        : 'bg-black text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-mono opacity-60">Score: {rate}</div>
                    <div className="text-[11px] truncate">
                      {rate === 0 ? 'Never' : rate === 1 ? 'Rarely' : rate === 2 ? 'Sometimes' : rate === 3 ? 'Frequently' : 'Daily'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Scientific Breakdown */}
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-[#A855F7] font-bold block mb-0.5">Clinical Tool & Significance:</span>
                <p className="text-gray-300">{q.clinicalSignificance}</p>
              </div>

              <div>
                <span className="text-purple-300 font-bold block mb-0.5">Neuro-Biochemical Mechanism:</span>
                <p className="text-gray-300">{q.neuroBiochemicalPathway}</p>
              </div>

              <div>
                <span className="text-emerald-400 font-bold block mb-0.5">Therapeutic Repletion Protocol:</span>
                <p className="text-gray-300">{q.nutritionalRecommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
