"use client";

import { useMemo, useState } from "react";
import { CharacterBuddy } from "@/components/CharacterBuddy";
import { MoodCheckInForm, type CheckInInput } from "@/components/MoodCheckInForm";
import { WellnessDashboard } from "@/components/WellnessDashboard";
import { emptyState, loadState, saveState } from "@/lib/storage";
import { EXAM_TYPES, type DailyCheckIn, type ExamType, type WellnessProfile } from "@/lib/wellness";

function makeCheckIn(input: CheckInInput): DailyCheckIn {
  return {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    ...input,
  };
}

export default function Home() {
  const [state, setState] = useState(() => loadState());
  const [onboarding, setOnboarding] = useState<WellnessProfile>(
    state.profile ?? {
      studentName: "",
      examType: "JEE",
      reminderTime: "20:30",
    },
  );

  const recentCheckIn = useMemo(
    () => (state.checkIns.length ? state.checkIns[state.checkIns.length - 1] : null),
    [state.checkIns],
  );

  function updateState(nextCheckIns: DailyCheckIn[], profile = state.profile): void {
    const nextState = { profile, checkIns: nextCheckIns };
    setState(nextState);
    saveState(nextState);
  }

  if (!state.profile) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center p-4">
        <div className="card-soft w-full max-w-xl">
          <h1 className="text-3xl font-extrabold text-slate-900">MindBloom</h1>
          <p className="mt-2 text-slate-600">
            A calm, exam-season mental wellness tracker for students.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const profile = {
                ...onboarding,
                studentName: onboarding.studentName.trim() || "Student",
              };
              setState({ ...state, profile });
              saveState({ ...state, profile });
            }}
          >
            <label className="field-block">
              <span>Your name</span>
              <input
                value={onboarding.studentName}
                onChange={(event) =>
                  setOnboarding((current) => ({ ...current, studentName: event.target.value }))
                }
                placeholder="Aarav"
              />
            </label>
            <label className="field-block">
              <span>Exam goal</span>
              <select
                value={onboarding.examType}
                onChange={(event) =>
                  setOnboarding((current) => ({
                    ...current,
                    examType: event.target.value as ExamType,
                  }))
                }
                className="rounded-xl border border-sky-200 bg-white p-2"
              >
                {EXAM_TYPES.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-block">
              <span>Daily reminder time</span>
              <input
                type="time"
                value={onboarding.reminderTime}
                onChange={(event) =>
                  setOnboarding((current) => ({ ...current, reminderTime: event.target.value }))
                }
              />
            </label>
            <button type="submit" className="btn-primary w-full">
              Start tracking
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-4 pb-10">
      <header className="card-soft mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">MindBloom</h1>
          <p className="text-sm text-slate-600">
            Hi {state.profile.studentName}, you&apos;re preparing for {state.profile.examType}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CharacterBuddy mood={recentCheckIn?.mood ?? 6} />
          <button
            className="rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700"
            type="button"
            onClick={() => {
              setState(emptyState);
              saveState(emptyState);
            }}
          >
            Reset profile
          </button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <MoodCheckInForm
          latestCheckIn={recentCheckIn}
          onSubmit={(input) => updateState([...state.checkIns, makeCheckIn(input)])}
        />
        <div className="card-soft">
          <h2 className="text-2xl font-bold text-slate-900">Quick reset mode</h2>
          <p className="mt-1 text-sm text-slate-600">
            Try this whenever pressure spikes before or after mock tests.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Inhale for 4 seconds, hold for 4, exhale for 6.</li>
            <li>Repeat for 2 minutes while relaxing your jaw and shoulders.</li>
            <li>Write one tiny next action and start only that.</li>
          </ol>
        </div>
      </section>

      <div className="mt-4">
        <WellnessDashboard checkIns={state.checkIns} />
      </div>
    </main>
  );
}
