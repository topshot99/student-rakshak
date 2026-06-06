import { describe, expect, it } from "vitest";
import {
  buildSupportPlan,
  computeRiskLevel,
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
    expect(plan.join(" ")).toContain("Activate SOS mode");
  });

  it("adds specific recommendations for sleep loss and comparison trigger", () => {
    const latest = sample({
      sleepHours: 5,
      triggers: ["Comparison"],
      stress: 7,
    });

    const plan = buildSupportPlan(latest, [latest]);
    expect(plan.join(" ")).toContain("Sleep debt");
    expect(plan.join(" ")).toContain("Comparison trigger");
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
