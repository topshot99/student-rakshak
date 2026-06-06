import { useSyncExternalStore } from "react";
import { emptyState, loadState, saveState } from "@/lib/storage";
import type { WellnessState } from "@/lib/wellness";

let memoryState: WellnessState | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): WellnessState {
  if (memoryState === null) {
    memoryState = loadState();
  }
  return memoryState;
}

function getServerSnapshot(): WellnessState {
  return emptyState;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setWellnessState(next: WellnessState): void {
  memoryState = next;
  saveState(next);
  for (const listener of listeners) {
    listener();
  }
}

export function useWellnessState(): WellnessState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
