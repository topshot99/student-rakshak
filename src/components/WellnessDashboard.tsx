import {
  buildSupportPlan,
  computeRiskLevel,
  getRecentCheckIns,
  topTriggers,
  type DailyCheckIn,
} from "@/lib/wellness";

interface WellnessDashboardProps {
  checkIns: DailyCheckIn[];
}

export function WellnessDashboard({ checkIns }: WellnessDashboardProps) {
  const recent = getRecentCheckIns(checkIns, 7);
  const latest = recent.at(-1) ?? null;
  const risk = computeRiskLevel(recent);
  const supportPlan = buildSupportPlan(latest, recent);
  const triggers = topTriggers(recent);

  return (
    <section className="card-soft">
      <h2 className="text-2xl font-bold text-slate-900">Insights dashboard</h2>
      <p className="mt-1 text-sm text-slate-600">Weekly trend + stress trigger radar.</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="soft-panel">
          <h3 className="text-sm font-semibold text-slate-700">Burnout risk</h3>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{risk}</p>
          <p className="mt-1 text-xs text-slate-600">Based on stress, mood, and sleep patterns.</p>
        </article>

        <article className="soft-panel lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700">Mood trend (last 7 check-ins)</h3>
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
          <h3 className="text-sm font-semibold text-slate-700">Top stress triggers</h3>
          {triggers.length ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {triggers.map(([trigger, count]) => (
                <li key={trigger} className="flex items-center justify-between rounded-xl bg-white/80 p-2">
                  <span>{trigger}</span>
                  <strong>{count}x</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No triggers logged yet.</p>
          )}
        </article>

        <article className="soft-panel">
          <h3 className="text-sm font-semibold text-slate-700">Personalized support plan</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {supportPlan.map((item) => (
              <li key={item} className="rounded-xl bg-white/80 p-2">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
