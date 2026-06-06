import type { WellnessState } from "@/lib/wellness";

const STORAGE_KEY = "mental-wellness-tracker-v1";

export const emptyState: WellnessState = {
  profile: null,
  checkIns: [],
  language: "en",
};

export function loadState(): WellnessState {
  if (typeof window === "undefined") {
    return emptyState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return emptyState;
  }

  try {
    const parsed = JSON.parse(raw) as WellnessState;
    return {
      profile: parsed.profile ?? null,
      checkIns: parsed.checkIns ?? [],
      language: parsed.language ?? "en",
    };
  } catch (error) {
    console.error("Failed to parse local wellness state:", error);
    return emptyState;
  }
}

export function saveState(state: WellnessState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
