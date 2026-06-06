import { describe, expect, it } from "vitest";
import {
  buildSupportPlan,
  computeRiskLevel,
  getStreakDays,
  getWellnessScore,
  topTriggers,
  type DailyCheckIn,
} from "@/lib/wellness";

function sample(overrides: Partial<DailyCheckIn> = {}): DailyCheckIn {
  return {
    id: "1",
    date: "2026-01-01T00:00:00.000Z",
    mood: 6,
    stress: 5,
    energy: 6,
    sleepHours: 7,
    triggers: [],
    note: "",
    reflection: "",
    ...overrides,
  };
}

describe("computeRiskLevel", () => {
  it("returns Low for empty check-ins", () => {
    expect(computeRiskLevel([])).toBe("Low");
  });

  it("returns High for sustained high stress", () => {
    const recent = [sample({ stress: 8 }), sample({ stress: 9 }), sample({ stress: 8 })];
    expect(computeRiskLevel(recent)).toBe("High");
  });

  it("returns Moderate for middling stress patterns", () => {
    const recent = [sample({ stress: 6, mood: 6 }), sample({ stress: 6, mood: 6 })];
    expect(computeRiskLevel(recent)).toBe("Moderate");
  });
});

describe("buildSupportPlan", () => {
  it("includes SOS guidance for stress 8 or above", () => {
    const latest = sample({ stress: 8 });
    const plan = buildSupportPlan(latest, [latest]);
    expect(plan.map((s) => s.id)).toContain("sos");
  });

  it("adds specific suggestions for sleep loss and comparison trigger", () => {
    const latest = sample({
      sleepHours: 5,
      triggers: ["Comparison"],
      stress: 7,
    });

    const ids = buildSupportPlan(latest, [latest]).map((s) => s.id);
    expect(ids).toContain("sleepFirst");
    expect(ids).toContain("comparison");
  });

  it("welcomes a new student with no check-in yet", () => {
    const ids = buildSupportPlan(null, []).map((s) => s.id);
    expect(ids).toContain("welcomeStart");
  });

  it("celebrates a calm, happy day", () => {
    const latest = sample({ mood: 9, stress: 3 });
    const ids = buildSupportPlan(latest, [latest]).map((s) => s.id);
    expect(ids).toContain("celebrate");
  });

  it("each suggestion carries an emoji and text", () => {
    const latest = sample({ stress: 8 });
    const plan = buildSupportPlan(latest, [latest]);
    expect(plan[0]).toMatchObject({
      id: expect.any(String),
      emoji: expect.any(String),
      text: expect.any(String),
    });
  });
});

describe("topTriggers", () => {
  it("returns top 3 triggers sorted by frequency", () => {
    const checkIns = [
      sample({ triggers: ["Comparison", "Sleep Loss"] }),
      sample({ id: "2", triggers: ["Comparison"] }),
      sample({ id: "3", triggers: ["Syllabus Backlog"] }),
      sample({ id: "4", triggers: ["Comparison", "Syllabus Backlog"] }),
      sample({ id: "5", triggers: ["Mock Test Score"] }),
      sample({ id: "6", triggers: ["Mock Test Score"] }),
      sample({ id: "7", triggers: ["Family Pressure"] }),
    ];

    expect(topTriggers(checkIns)).toEqual([
      ["Comparison", 3],
      ["Syllabus Backlog", 2],
      ["Mock Test Score", 2],
    ]);
  });
});

describe("engagement helpers", () => {
  it("computes streak across consecutive days", () => {
    const checkIns = [
      sample({ date: "2026-01-10T10:00:00.000Z" }),
      sample({ id: "2", date: "2026-01-11T10:00:00.000Z" }),
      sample({ id: "3", date: "2026-01-12T10:00:00.000Z" }),
    ];
    expect(getStreakDays(checkIns)).toBe(3);
  });

  it("returns default score for empty latest check-in", () => {
    expect(getWellnessScore(null)).toBe(60);
  });
});
