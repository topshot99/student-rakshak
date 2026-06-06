export const EXAM_TYPES = [
  "NEET",
  "JEE",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Board Exams",
] as const;

export const TRIGGERS = [
  "Mock Test Score",
  "Family Pressure",
  "Comparison",
  "Sleep Loss",
  "Syllabus Backlog",
  "Uncertain Results",
] as const;

export type ExamType = (typeof EXAM_TYPES)[number];
export type TriggerType = (typeof TRIGGERS)[number];

export type Language = "en" | "hi";

export const EXAM_EMOJI: Record<ExamType, string> = {
  NEET: "🩺",
  JEE: "⚙️",
  CUET: "🎓",
  CAT: "📊",
  GATE: "🔬",
  UPSC: "🏛️",
  "Board Exams": "📚",
};

export const TRIGGER_META: Record<
  TriggerType,
  { emoji: string; en: string; hi: string }
> = {
  "Mock Test Score": { emoji: "📉", en: "Mock Test Score", hi: "मॉक टेस्ट स्कोर" },
  "Family Pressure": { emoji: "👨‍👩‍👧", en: "Family Pressure", hi: "परिवार का दबाव" },
  Comparison: { emoji: "⚖️", en: "Comparison", hi: "दूसरों से तुलना" },
  "Sleep Loss": { emoji: "😴", en: "Sleep Loss", hi: "नींद की कमी" },
  "Syllabus Backlog": { emoji: "📚", en: "Syllabus Backlog", hi: "सिलेबस बैकलॉग" },
  "Uncertain Results": { emoji: "❓", en: "Uncertain Results", hi: "नतीजों की चिंता" },
};

export function triggerLabel(trigger: TriggerType, lang: Language): string {
  const meta = TRIGGER_META[trigger];
  return lang === "hi" ? meta.hi : meta.en;
}

export interface WellnessProfile {
  studentName: string;
  examType: ExamType;
  reminderTime: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  mood: number;
  stress: number;
  energy: number;
  sleepHours: number;
  triggers: TriggerType[];
  note: string;
  reflection: string;
}

export interface WellnessState {
  profile: WellnessProfile | null;
  checkIns: DailyCheckIn[];
  language: Language;
}

export type RiskLevel = "Low" | "Moderate" | "High";

export interface SupportSuggestion {
  id: string;
  emoji: string;
  text: string;
}

const SUGGESTIONS = {
  sos: {
    emoji: "🆘",
    en: "Please pause right now — take 10 slow breaths and message someone you trust. You don't have to carry this alone.",
    hi: "अभी रुकिए — 10 गहरी साँसें लें और किसी भरोसेमंद इंसान से बात करें। यह बोझ अकेले उठाने की ज़रूरत नहीं।",
  },
  highBreath: {
    emoji: "🌬️",
    en: "Today feels heavy, and that's okay. Step away for 5 minutes, breathe slowly, and let your shoulders drop.",
    hi: "आज थोड़ा भारी लग रहा है, और यह ठीक है। 5 मिनट के लिए हटें, धीरे साँस लें और कंधे ढीले छोड़ें।",
  },
  highScope: {
    emoji: "🎯",
    en: "Don't aim for everything at once. Pick one small topic, finish just that, and count it as a win.",
    hi: "सब कुछ एक साथ करने की मत सोचिए। बस एक छोटा टॉपिक चुनें, उसे पूरा करें — वही आज की जीत है।",
  },
  lowMood: {
    emoji: "💛",
    en: "Be a little gentle with yourself today. You're a person first and an aspirant second.",
    hi: "आज ख़ुद के साथ थोड़ी नरमी बरतें। आप पहले एक इंसान हैं, उसके बाद विद्यार्थी।",
  },
  sleepFirst: {
    emoji: "😴",
    en: "Your brain actually learns while you sleep. Aim for 7 hours tonight — tomorrow-you will thank you.",
    hi: "नींद में दिमाग़ सचमुच सीखता है। आज 7 घंटे सोने का लक्ष्य रखें — कल आपको फ़र्क महसूस होगा।",
  },
  lowEnergy: {
    emoji: "🔋",
    en: "Running on empty? Drink some water, eat something, and take a 10-minute walk before you study again.",
    hi: "थकान महसूस हो रही है? पानी पिएँ, कुछ खाएँ और दोबारा पढ़ने से पहले 10 मिनट टहलें।",
  },
  comparison: {
    emoji: "🌱",
    en: "Someone else's rank isn't your story. Look at how far you've come, not where others are.",
    hi: "किसी और की रैंक आपकी कहानी नहीं है। देखिए आप कितना आगे आए हैं, दूसरों को नहीं।",
  },
  backlog: {
    emoji: "🧩",
    en: "A backlog feels scary as one big pile. Split it into 3 tasks: one urgent, one important, one quick win.",
    hi: "बैकलॉग एक बड़ा ढेर लगे तो डराता है। इसे 3 कामों में बाँटें: एक ज़रूरी, एक महत्वपूर्ण, एक झटपट।",
  },
  mockScore: {
    emoji: "📈",
    en: "A low mock score is feedback, not your final result. Note your top 3 mistakes and let the rest go.",
    hi: "मॉक का कम स्कोर सीख है, आख़िरी नतीजा नहीं। अपनी 3 बड़ी ग़लतियाँ नोट करें और बाक़ी छोड़ दें।",
  },
  familyPressure: {
    emoji: "🫂",
    en: "Family expectations usually come from worry, not blame. Share one honest feeling with them today.",
    hi: "घरवालों की उम्मीदें अक्सर चिंता से आती हैं, ताने से नहीं। आज उनसे एक सच्ची बात साझा करें।",
  },
  uncertainResults: {
    emoji: "🧭",
    en: "You can't control the result, only today's effort. Choose the next right step and trust it.",
    hi: "नतीजा आपके हाथ में नहीं, बस आज की मेहनत है। अगला सही कदम चुनें और उस पर भरोसा रखें।",
  },
  celebrate: {
    emoji: "🎉",
    en: "Great headspace today! Lock in this momentum and reward yourself with a short break you enjoy.",
    hi: "आज मन अच्छा है! इस लय को बनाए रखें और अपनी पसंद का छोटा ब्रेक लेकर ख़ुद को इनाम दें।",
  },
  steady: {
    emoji: "✅",
    en: "Nice and steady. Keep your rhythm and take a small break every 50 minutes.",
    hi: "बढ़िया, सब संतुलित है। यही लय बनाए रखें और हर 50 मिनट पर छोटा ब्रेक लें।",
  },
  welcomeStart: {
    emoji: "👋",
    en: "Welcome! Do your first quick check-in and I'll tailor support just for you.",
    hi: "स्वागत है! पहला छोटा चेक-इन करें और मैं आपके लिए ख़ास सुझाव तैयार करूँगा।",
  },
  welcomeBreath: {
    emoji: "🧘",
    en: "Before your first study block, try a calm 2-minute breathing reset.",
    hi: "पहली पढ़ाई से पहले 2 मिनट का शांत साँस अभ्यास करें।",
  },
} as const;

type SuggestionId = keyof typeof SUGGESTIONS;

function suggestion(id: SuggestionId, lang: Language): SupportSuggestion {
  const item = SUGGESTIONS[id];
  return { id, emoji: item.emoji, text: lang === "hi" ? item.hi : item.en };
}

export function computeRiskLevel(recent: DailyCheckIn[]): RiskLevel {
  if (!recent.length) {
    return "Low";
  }

  const avgStress =
    recent.reduce((sum, item) => sum + item.stress, 0) / recent.length;
  const avgMood = recent.reduce((sum, item) => sum + item.mood, 0) / recent.length;
  const avgSleep =
    recent.reduce((sum, item) => sum + item.sleepHours, 0) / recent.length;
  const highStressDays = recent.filter((item) => item.stress >= 8).length;

  if (highStressDays >= 3 || (avgStress >= 7.5 && avgMood <= 4.5) || avgSleep < 5.5) {
    return "High";
  }
  if (avgStress >= 6 || avgMood <= 5.5 || avgSleep < 6.5) {
    return "Moderate";
  }
  return "Low";
}

export function topTriggers(checkIns: DailyCheckIn[]): Array<[TriggerType, number]> {
  const counts = new Map<TriggerType, number>();
  for (const checkIn of checkIns) {
    for (const trigger of checkIn.triggers) {
      counts.set(trigger, (counts.get(trigger) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

export function buildSupportPlan(
  latest: DailyCheckIn | null,
  recent: DailyCheckIn[],
  lang: Language = "en",
): SupportSuggestion[] {
  if (!latest) {
    return [suggestion("welcomeStart", lang), suggestion("welcomeBreath", lang)];
  }

  const ids: SuggestionId[] = [];
  const risk = computeRiskLevel(recent);
  const has = (trigger: TriggerType) => latest.triggers.includes(trigger);

  if (latest.stress >= 8) {
    ids.push("sos");
  }
  if (risk === "High") {
    ids.push("highBreath", "highScope");
  }
  if (latest.mood <= 3) {
    ids.push("lowMood");
  }
  if (latest.sleepHours < 6 || has("Sleep Loss")) {
    ids.push("sleepFirst");
  }
  if (latest.energy <= 3) {
    ids.push("lowEnergy");
  }
  if (has("Comparison")) {
    ids.push("comparison");
  }
  if (has("Syllabus Backlog")) {
    ids.push("backlog");
  }
  if (has("Mock Test Score")) {
    ids.push("mockScore");
  }
  if (has("Family Pressure")) {
    ids.push("familyPressure");
  }
  if (has("Uncertain Results")) {
    ids.push("uncertainResults");
  }
  if (latest.mood >= 8 && latest.stress <= 4) {
    ids.push("celebrate");
  }

  if (!ids.length) {
    ids.push("steady");
  }

  const unique = Array.from(new Set(ids)).slice(0, 5);
  return unique.map((id) => suggestion(id, lang));
}

export function getRecentCheckIns(checkIns: DailyCheckIn[], count = 7): DailyCheckIn[] {
  return [...checkIns]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-count);
}

function toUtcDayKey(input: string): string {
  const date = new Date(input);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getStreakDays(checkIns: DailyCheckIn[]): number {
  if (!checkIns.length) {
    return 0;
  }

  const uniqueDays = Array.from(new Set(checkIns.map((item) => toUtcDayKey(item.date)))).sort();
  let streak = 1;

  for (let index = uniqueDays.length - 1; index > 0; index -= 1) {
    const current = new Date(`${uniqueDays[index]}T00:00:00.000Z`).getTime();
    const previous = new Date(`${uniqueDays[index - 1]}T00:00:00.000Z`).getTime();
    const diffDays = (current - previous) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function getWellnessScore(latest: DailyCheckIn | null): number {
  if (!latest) {
    return 60;
  }

  const sleepScore = Math.min((latest.sleepHours / 8) * 10, 10);
  const weighted =
    latest.mood * 0.35 +
    latest.energy * 0.25 +
    (10 - latest.stress) * 0.25 +
    sleepScore * 0.15;
  return Math.round((weighted / 10) * 100);
}
