"use client";

import { useMemo, useState } from "react";
import {
  TRIGGERS,
  triggerLabel,
  type DailyCheckIn,
  type Language,
  type TriggerType,
} from "@/lib/wellness";
import { getTranslator, type Translator } from "@/lib/i18n";

export interface CheckInInput {
  mood: number;
  stress: number;
  energy: number;
  sleepHours: number;
  triggers: TriggerType[];
  note: string;
  reflection: string;
}

const DEFAULT_CHECKIN: CheckInInput = {
  mood: 6,
  stress: 5,
  energy: 6,
  sleepHours: 7,
  triggers: [],
  note: "",
  reflection: "",
};

interface MoodCheckInFormProps {
  latestCheckIn: DailyCheckIn | null;
  onSubmit: (input: CheckInInput) => void;
  lang?: Language;
  t?: Translator;
}

const QUICK_STATES: Array<{
  key: "presetFocused" | "presetOverwhelmed" | "presetTired" | "presetCalm";
  emoji: string;
  data: Pick<CheckInInput, "mood" | "stress" | "energy" | "sleepHours">;
}> = [
  { key: "presetFocused", emoji: "🚀", data: { mood: 8, stress: 4, energy: 8, sleepHours: 7.5 } },
  { key: "presetOverwhelmed", emoji: "😵", data: { mood: 4, stress: 8, energy: 4, sleepHours: 5.5 } },
  { key: "presetTired", emoji: "😴", data: { mood: 5, stress: 6, energy: 3, sleepHours: 4.5 } },
  { key: "presetCalm", emoji: "🌿", data: { mood: 7, stress: 3, energy: 6, sleepHours: 7 } },
];

const TRIGGER_EMOJI: Record<TriggerType, string> = {
  "Mock Test Score": "📉",
  "Family Pressure": "👨‍👩‍👧",
  Comparison: "⚖️",
  "Sleep Loss": "😴",
  "Syllabus Backlog": "📚",
  "Uncertain Results": "❓",
};

function moodEmoji(mood: number): string {
  if (mood >= 8) return "😄";
  if (mood >= 6) return "🙂";
  if (mood >= 4) return "😐";
  return "😟";
}

export function MoodCheckInForm({
  latestCheckIn,
  onSubmit,
  lang = "en",
  t = getTranslator("en"),
}: MoodCheckInFormProps) {
  const [checkIn, setCheckIn] = useState<CheckInInput>(DEFAULT_CHECKIN);
  const moodLabel = useMemo(() => {
    if (checkIn.mood >= 8) return t("moodGreat");
    if (checkIn.mood >= 6) return t("moodOkay");
    return t("moodLow");
  }, [checkIn.mood, t]);

  function toggleTrigger(trigger: TriggerType): void {
    setCheckIn((current) => ({
      ...current,
      triggers: current.triggers.includes(trigger)
        ? current.triggers.filter((item) => item !== trigger)
        : [...current.triggers, trigger],
    }));
  }

  return (
    <section className="card-soft">
      <h2 className="text-2xl font-bold text-slate-900">{t("dailyCheckin")}</h2>
      <p className="mt-1 text-sm text-slate-600">{t("checkinSubtitle")}</p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(checkIn);
          setCheckIn(DEFAULT_CHECKIN);
        }}
      >
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-slate-700">{t("oneTapMood")}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUICK_STATES.map((state) => (
              <button
                key={state.key}
                type="button"
                className="preset-chip"
                onClick={() => setCheckIn((current) => ({ ...current, ...state.data }))}
              >
                <span className="text-lg" aria-hidden="true">
                  {state.emoji}
                </span>
                <span>{t(state.key)}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field-block">
          <span>
            <span className="mr-1 text-lg" aria-hidden="true">
              {moodEmoji(checkIn.mood)}
            </span>
            {t("moodWord")} ({moodLabel})
          </span>
          <input
            data-testid="mood-range"
            type="range"
            min={1}
            max={10}
            value={checkIn.mood}
            onChange={(event) =>
              setCheckIn((current) => ({ ...current, mood: Number(event.target.value) }))
            }
          />
        </label>

        <label className="field-block">
          <span>{t("stressLevel")}</span>
          <input
            data-testid="stress-range"
            type="range"
            min={1}
            max={10}
            value={checkIn.stress}
            onChange={(event) =>
              setCheckIn((current) => ({ ...current, stress: Number(event.target.value) }))
            }
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="field-block">
            <span>{t("energyLevel")}</span>
            <input
              type="number"
              min={1}
              max={10}
              value={checkIn.energy}
              onChange={(event) =>
                setCheckIn((current) => ({ ...current, energy: Number(event.target.value) }))
              }
            />
          </label>
          <label className="field-block">
            <span>{t("sleepHours")}</span>
            <input
              type="number"
              min={0}
              max={12}
              step={0.5}
              value={checkIn.sleepHours}
              onChange={(event) =>
                setCheckIn((current) => ({
                  ...current,
                  sleepHours: Number(event.target.value),
                }))
              }
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-slate-700">{t("stressTriggers")}</legend>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((trigger) => {
              const selected = checkIn.triggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTrigger(trigger)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition ${
                    selected
                      ? "bg-cyan-500 text-white"
                      : "bg-white/70 text-slate-700 hover:bg-cyan-100"
                  }`}
                >
                  <span aria-hidden="true">{TRIGGER_EMOJI[trigger]}</span>
                  <span>{triggerLabel(trigger, lang)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="field-block">
          <span>{t("quickNote")}</span>
          <input
            type="text"
            maxLength={140}
            value={checkIn.note}
            onChange={(event) =>
              setCheckIn((current) => ({ ...current, note: event.target.value }))
            }
            placeholder={t("quickNotePlaceholder")}
          />
        </label>

        <label className="field-block">
          <span>{t("reflection")}</span>
          <textarea
            rows={3}
            value={checkIn.reflection}
            onChange={(event) =>
              setCheckIn((current) => ({ ...current, reflection: event.target.value }))
            }
            placeholder={t("reflectionPlaceholder")}
          />
        </label>

        <button className="btn-primary w-full sm:w-auto" type="submit">
          {t("saveCheckin")}
        </button>
      </form>

      {latestCheckIn ? (
        <p className="mt-4 text-sm text-slate-600">
          {t("lastCheckin")} <strong>{latestCheckIn.mood}/10</strong> | {t("stressWord")}:{" "}
          <strong>{latestCheckIn.stress}/10</strong>
        </p>
      ) : null}
    </section>
  );
}
