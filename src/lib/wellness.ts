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
}

export type RiskLevel = "Low" | "Moderate" | "High";

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
): string[] {
  if (!latest) {
    return [
      "Start with a quick check-in to unlock a personalized wellness plan.",
      "Try the 2-minute breathing reset before your first study block.",
    ];
  }

  const plan: string[] = [];
  const risk = computeRiskLevel(recent);

  if (risk === "High") {
    plan.push("You are in a high-stress zone. Do a 5-minute deep breathing break now.");
    plan.push("Reduce next session scope: pick one small topic and finish only that.");
  }

  if (latest.sleepHours < 6) {
    plan.push("Sleep debt is hurting focus. Protect at least 7 hours tonight.");
  }
  if (latest.triggers.includes("Comparison")) {
    plan.push("Comparison trigger detected. Review your own progress streak, not rank lists.");
  }
  if (latest.triggers.includes("Syllabus Backlog")) {
    plan.push("Use a 3-task rescue plan: urgent, important, quick-win.");
  }
  if (latest.stress >= 8) {
    plan.push("Activate SOS mode: pause studies for 10 minutes and contact your support person.");
  }

  if (!plan.length) {
    plan.push("Nice consistency. Keep your current rhythm and take a micro-break every 50 minutes.");
  }

  return plan.slice(0, 4);
}

export function getRecentCheckIns(checkIns: DailyCheckIn[], count = 7): DailyCheckIn[] {
  return [...checkIns]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-count);
}

