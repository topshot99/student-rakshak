import {
  buildSupportPlan,
  computeRiskLevel,
  getRecentCheckIns,
  topTriggers,
  triggerLabel,
  TRIGGER_META,
  type DailyCheckIn,
  type Language,
  type RiskLevel,
} from "@/lib/wellness";
import { getTranslator, type Translator } from "@/lib/i18n";

interface WellnessDashboardProps {
  checkIns: DailyCheckIn[];
  lang?: Language;
  t?: Translator;
}

const RISK_META: Record<RiskLevel, { emoji: string; className: string }> = {
  Low: { emoji: "🟢", className: "text-emerald-600" },
  Moderate: { emoji: "🟡", className: "text-amber-600" },
  High: { emoji: "🔴", className: "text-rose-600" },
};

function riskLabel(risk: RiskLevel, t: Translator): string {
  if (risk === "High") return t("riskHigh");
  if (risk === "Moderate") return t("riskModerate");
  return t("riskLow");
}

export function WellnessDashboard({
  checkIns,
  lang = "en",
  t = getTranslator("en"),
}: WellnessDashboardProps) {
  const recent = getRecentCheckIns(checkIns, 7);
  const latest = recent.at(-1) ?? null;
  const risk = computeRiskLevel(recent);
  const supportPlan = buildSupportPlan(latest, recent, lang);
  const triggers = topTriggers(recent);

  return (
    <section className="card-soft">
      <h2 className="text-2xl font-bold text-slate-900">{t("insightsDashboard")}</h2>
      <p className="mt-1 text-sm text-slate-600">{t("insightsSubtitle")}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="soft-panel">
          <h3 className="text-sm font-semibold text-slate-700">{t("burnoutRisk")}</h3>
          <p className={`mt-2 text-3xl font-extrabold ${RISK_META[risk].className}`}>
            <span aria-hidden="true">{RISK_META[risk].emoji}</span> {riskLabel(risk, t)}
          </p>
          <p className="mt-1 text-xs text-slate-600">{t("riskBasedOn")}</p>
        </article>

        <article className="soft-panel lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700">{t("moodTrend")}</h3>
          <div className="mt-3 flex items-end gap-2">
            {(recent.length ? recent : [{ id: "empty", mood: 0 }]).map((item) => (
              <div key={item.id} className="flex-1">
                <div
                  className="rounded-t-md bg-gradient-to-t from-cyan-500 to-indigo-500"
                  style={{ height: `${Math.max(item.mood * 10, 8)}px` }}
                />
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="soft-panel">
          <h3 className="text-sm font-semibold text-slate-700">{t("topTriggersTitle")}</h3>
          {triggers.length ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {triggers.map(([trigger, count]) => (
                <li
                  key={trigger}
                  className="flex items-center justify-between rounded-xl bg-white/80 p-2"
                >
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">{TRIGGER_META[trigger].emoji}</span>
                    {triggerLabel(trigger, lang)}
                  </span>
                  <strong>{count}x</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600">{t("noTriggers")}</p>
          )}
        </article>

        <article className="soft-panel">
          <h3 className="text-sm font-semibold text-slate-700">{t("supportPlanTitle")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {supportPlan.map((item) => (
              <li key={item.id} className="flex gap-2 rounded-xl bg-white/80 p-2">
                <span aria-hidden="true">{item.emoji}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
