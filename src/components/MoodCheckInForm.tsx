"use client";

import { useMemo, useState } from "react";
import { TRIGGERS, type DailyCheckIn, type TriggerType } from "@/lib/wellness";

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
}

export function MoodCheckInForm({ latestCheckIn, onSubmit }: MoodCheckInFormProps) {
  const [checkIn, setCheckIn] = useState<CheckInInput>(DEFAULT_CHECKIN);
  const moodLabel = useMemo(() => {
    if (checkIn.mood >= 8) return "Great";
    if (checkIn.mood >= 6) return "Okay";
    return "Low";
  }, [checkIn.mood]);

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
      <h2 className="text-2xl font-bold text-slate-900">Daily check-in</h2>
      <p className="mt-1 text-sm text-slate-600">Log your state in under 20 seconds.</p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(checkIn);
          setCheckIn(DEFAULT_CHECKIN);
        }}
      >
        <label className="field-block">
          <span>Mood ({moodLabel})</span>
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
          <span>Stress level</span>
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
            <span>Energy (1-10)</span>
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
            <span>Sleep hours</span>
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
          <legend className="mb-2 text-sm font-semibold text-slate-700">Stress triggers</legend>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((trigger) => {
              const selected = checkIn.triggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => toggleTrigger(trigger)}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    selected
                      ? "bg-cyan-500 text-white"
                      : "bg-white/70 text-slate-700 hover:bg-cyan-100"
                  }`}
                >
                  {trigger}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="field-block">
          <span>Quick note</span>
          <input
            type="text"
            maxLength={140}
            value={checkIn.note}
            onChange={(event) =>
              setCheckIn((current) => ({ ...current, note: event.target.value }))
            }
            placeholder="What affected your day the most?"
          />
        </label>

        <label className="field-block">
          <span>Reflection</span>
          <textarea
            rows={3}
            value={checkIn.reflection}
            onChange={(event) =>
              setCheckIn((current) => ({ ...current, reflection: event.target.value }))
            }
            placeholder="What went well and what felt hard today?"
          />
        </label>

        <button className="btn-primary w-full sm:w-auto" type="submit">
          Save check-in
        </button>
      </form>

      {latestCheckIn ? (
        <p className="mt-4 text-sm text-slate-600">
          Last check-in mood: <strong>{latestCheckIn.mood}/10</strong> | Stress:{" "}
          <strong>{latestCheckIn.stress}/10</strong>
        </p>
      ) : null}
    </section>
  );
}

