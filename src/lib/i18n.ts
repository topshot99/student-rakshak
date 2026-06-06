export type Language = "en" | "hi";

export const LANGUAGES: Array<{ code: Language; label: string; short: string }> = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हिं" },
];

type Phrase = { en: string; hi: string };

export const STRINGS = {
  tagline: {
    en: "A calm wellness companion for your study journey.",
    hi: "आपकी पढ़ाई की यात्रा के लिए एक शांत साथी।",
  },
  chooseLanguage: { en: "Choose language", hi: "भाषा चुनें" },
  yourName: { en: "Your name", hi: "आपका नाम" },
  examGoal: { en: "Exam goal", hi: "लक्ष्य परीक्षा" },
  reminderTime: { en: "Daily reminder time", hi: "रोज़ याद दिलाने का समय" },
  startTracking: { en: "Start tracking", hi: "शुरू करें" },

  currentStreak: { en: "Current streak", hi: "लगातार दिन" },
  dayUnit: { en: "day", hi: "दिन" },
  daysUnit: { en: "days", hi: "दिन" },
  wellnessScore: { en: "Wellness score", hi: "वेलनेस स्कोर" },
  checkinsDone: { en: "Check-ins done", hi: "कुल चेक-इन" },
  resetProfile: { en: "Reset profile", hi: "प्रोफ़ाइल रीसेट" },

  dailyCheckin: { en: "Daily check-in", hi: "रोज़ का चेक-इन" },
  checkinSubtitle: {
    en: "Log how you feel in under 20 seconds.",
    hi: "20 सेकंड में अपना हाल बताइए।",
  },
  oneTapMood: { en: "Tap how you feel", hi: "अपना मूड चुनें" },
  presetFocused: { en: "Focused", hi: "एकाग्र" },
  presetOverwhelmed: { en: "Overwhelmed", hi: "घबराया" },
  presetTired: { en: "Tired", hi: "थका हुआ" },
  presetCalm: { en: "Calm", hi: "शांत" },

  moodWord: { en: "Mood", hi: "मूड" },
  moodGreat: { en: "Great", hi: "बढ़िया" },
  moodOkay: { en: "Okay", hi: "ठीक-ठाक" },
  moodLow: { en: "Low", hi: "कम" },
  stressLevel: { en: "Stress level", hi: "तनाव स्तर" },
  energyLevel: { en: "Energy (1-10)", hi: "ऊर्जा (1-10)" },
  sleepHours: { en: "Sleep hours", hi: "नींद के घंटे" },
  stressTriggers: { en: "What is bothering you?", hi: "क्या परेशान कर रहा है?" },
  quickNote: { en: "Quick note", hi: "छोटा नोट" },
  quickNotePlaceholder: {
    en: "What affected your day the most?",
    hi: "आज सबसे ज़्यादा किस बात का असर रहा?",
  },
  reflection: { en: "Reflection", hi: "मन की बात" },
  reflectionPlaceholder: {
    en: "What went well and what felt hard today?",
    hi: "आज क्या अच्छा रहा और क्या मुश्किल लगा?",
  },
  saveCheckin: { en: "Save check-in", hi: "चेक-इन सेव करें" },
  lastCheckin: { en: "Last check-in mood:", hi: "पिछला मूड:" },
  stressWord: { en: "Stress", hi: "तनाव" },

  quickReset: { en: "Quick reset mode", hi: "तुरंत शांति मोड" },
  quickResetSubtitle: {
    en: "Use this whenever pressure spikes before or after mock tests.",
    hi: "मॉक टेस्ट से पहले या बाद में घबराहट हो तो यह करें।",
  },
  resetStep1: {
    en: "Inhale for 4 seconds, hold for 4, exhale for 6.",
    hi: "4 सेकंड साँस लें, 4 रोकें, 6 में छोड़ें।",
  },
  resetStep2: {
    en: "Repeat for 2 minutes while relaxing your jaw and shoulders.",
    hi: "2 मिनट दोहराएँ, जबड़े और कंधे ढीले रखें।",
  },
  resetStep3: {
    en: "Write one tiny next action and start only that.",
    hi: "एक छोटा अगला काम लिखें और बस वही शुरू करें।",
  },

  insightsDashboard: { en: "Your insights", hi: "आपकी जानकारी" },
  insightsSubtitle: {
    en: "Weekly mood trend and stress triggers.",
    hi: "साप्ताहिक मूड और तनाव के कारण।",
  },
  burnoutRisk: { en: "Burnout risk", hi: "बर्नआउट जोखिम" },
  riskBasedOn: {
    en: "Based on stress, mood, and sleep patterns.",
    hi: "तनाव, मूड और नींद के आधार पर।",
  },
  moodTrend: { en: "Mood trend (last 7 check-ins)", hi: "मूड रुझान (पिछले 7 चेक-इन)" },
  topTriggersTitle: { en: "Top stress triggers", hi: "मुख्य तनाव कारण" },
  noTriggers: { en: "No triggers logged yet.", hi: "अभी कोई कारण दर्ज नहीं।" },
  supportPlanTitle: { en: "Your support plan", hi: "आपकी सहायता योजना" },
  riskLow: { en: "Low", hi: "कम" },
  riskModerate: { en: "Moderate", hi: "मध्यम" },
  riskHigh: { en: "High", hi: "ज़्यादा" },
} satisfies Record<string, Phrase>;

export type StringKey = keyof typeof STRINGS;

export type Translator = (key: StringKey) => string;

export function getTranslator(lang: Language): Translator {
  return (key: StringKey) => STRINGS[key][lang];
}
