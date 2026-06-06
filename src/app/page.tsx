"use client";

import { useMemo, useState } from "react";
import { CharacterBuddy } from "@/components/CharacterBuddy";
import { MoodCheckInForm, type CheckInInput } from "@/components/MoodCheckInForm";
import { WellnessDashboard } from "@/components/WellnessDashboard";
import { emptyState } from "@/lib/storage";
import { setWellnessState, useWellnessState } from "@/lib/useWellnessStore";
import { getTranslator } from "@/lib/i18n";
import {
  EXAM_TYPES,
  EXAM_EMOJI,
  getStreakDays,
  getWellnessScore,
  type DailyCheckIn,
  type ExamType,
  type Language,
  type WellnessProfile,
  type WellnessState,
} from "@/lib/wellness";

function makeCheckIn(input: CheckInInput): DailyCheckIn {
  return {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    ...input,
  };
}

function LanguageToggle({
  language,
  onChange,
}: {
  language: Language;
  onChange: (next: Language) => void;
}) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language / भाषा">
      <button
        type="button"
        aria-pressed={language === "en"}
        className={language === "en" ? "lang-pill lang-pill-active" : "lang-pill"}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={language === "hi"}
        className={language === "hi" ? "lang-pill lang-pill-active" : "lang-pill"}
        onClick={() => onChange("hi")}
      >
        हिं
      </button>
    </div>
  );
}

export default function Home() {
  const state = useWellnessState();
  const [onboarding, setOnboarding] = useState<WellnessProfile>({
    studentName: "",
    examType: "JEE",
    reminderTime: "20:30",
  });

  const t = useMemo(() => getTranslator(state.language), [state.language]);
  const recentCheckIn = useMemo(
    () => (state.checkIns.length ? state.checkIns[state.checkIns.length - 1] : null),
    [state.checkIns],
  );
  const streakDays = useMemo(() => getStreakDays(state.checkIns), [state.checkIns]);
  const wellnessScore = useMemo(() => getWellnessScore(recentCheckIn), [recentCheckIn]);

  function persist(next: WellnessState): void {
    setWellnessState(next);
  }

  function setLanguage(language: Language): void {
    persist({ ...state, language });
  }

  function updateCheckIns(nextCheckIns: DailyCheckIn[]): void {
    persist({ ...state, checkIns: nextCheckIns });
  }

  if (!state.profile) {
    const greeting =
      state.language === "hi"
        ? "नमस्ते! आइए शुरू करें"
        : "Welcome! Let's get started";

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center p-4">
        <div className="card-soft w-full max-w-xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <CharacterBuddy mood={7} />
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">MannSathi</h1>
                <p className="mt-1 text-slate-600">{t("tagline")}</p>
              </div>
            </div>
            <LanguageToggle language={state.language} onChange={setLanguage} />
          </div>

          <p className="mt-5 text-lg font-semibold text-slate-800">{greeting}</p>

          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const profile = {
                ...onboarding,
                studentName: onboarding.studentName.trim() || "Student",
              };
              persist({ ...state, profile });
            }}
          >
            <label className="field-block">
              <span>{t("yourName")}</span>
              <input
                value={onboarding.studentName}
                onChange={(event) =>
                  setOnboarding((current) => ({ ...current, studentName: event.target.value }))
                }
                placeholder="Aarav"
              />
            </label>
            <label className="field-block">
              <span>{t("examGoal")}</span>
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
                    {EXAM_EMOJI[exam]} {exam}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-block">
              <span>{t("reminderTime")}</span>
              <input
                type="time"
                value={onboarding.reminderTime}
                onChange={(event) =>
                  setOnboarding((current) => ({ ...current, reminderTime: event.target.value }))
                }
              />
            </label>
            <button type="submit" className="btn-primary w-full">
              {t("startTracking")}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const greeting =
    state.language === "hi"
      ? `नमस्ते ${state.profile.studentName}, आप ${state.profile.examType} की तैयारी कर रहे हैं।`
      : `Hi ${state.profile.studentName}, you're preparing for ${state.profile.examType}.`;
  const streakUnit = streakDays === 1 ? t("dayUnit") : t("daysUnit");

  return (
    <main className="mx-auto w-full max-w-6xl p-4 pb-10">
      <header className="card-soft mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
        <div className="w-full min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">MannSathi</h1>
            <LanguageToggle language={state.language} onChange={setLanguage} />
          </div>
          <p className="text-sm text-slate-600 break-words">
            <span aria-hidden="true">{EXAM_EMOJI[state.profile.examType]} </span>
            {greeting}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="soft-panel">
              <p className="text-xs text-slate-600">{t("currentStreak")}</p>
              <p className="text-lg font-extrabold text-slate-900">
                🔥 {streakDays} {streakUnit}
              </p>
            </div>
            <div className="soft-panel">
              <p className="text-xs text-slate-600">{t("wellnessScore")}</p>
              <p className="text-lg font-extrabold text-slate-900">✨ {wellnessScore}/100</p>
            </div>
            <div className="soft-panel">
              <p className="text-xs text-slate-600">{t("checkinsDone")}</p>
              <p className="text-lg font-extrabold text-slate-900">📘 {state.checkIns.length}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <CharacterBuddy mood={recentCheckIn?.mood ?? 6} />
          <button
            className="rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700"
            type="button"
            onClick={() => persist({ ...emptyState, language: state.language })}
          >
            {t("resetProfile")}
          </button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <MoodCheckInForm
          latestCheckIn={recentCheckIn}
          lang={state.language}
          t={t}
          onSubmit={(input) => updateCheckIns([...state.checkIns, makeCheckIn(input)])}
        />
        <div className="card-soft">
          <h2 className="text-2xl font-bold text-slate-900">
            <span aria-hidden="true">🌬️ </span>
            {t("quickReset")}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t("quickResetSubtitle")}</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>{t("resetStep1")}</li>
            <li>{t("resetStep2")}</li>
            <li>{t("resetStep3")}</li>
          </ol>
        </div>
      </section>

      <div className="mt-4">
        <WellnessDashboard checkIns={state.checkIns} lang={state.language} t={t} />
      </div>
    </main>
  );
}
