/**
 * Dashboard — shows today's emission summary, charts, activity log form, and activity list.
 */

import { useContext, useMemo } from 'react';
import AppContext from '../../context/AppContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useAccessibility } from '../../hooks/useAccessibility';
import { ACTIVITY_CATEGORIES } from '../../constants/categories';
import { formatEmissions } from '../../utils/calculator';

import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ActivityForm from '../../components/forms/ActivityForm';
import EmissionsBarChart from '../../components/charts/EmissionsBarChart';
import EmissionsPieChart from '../../components/charts/EmissionsPieChart';

export default function DashboardPage() {
  const { userProfile, emissionLevel, goalProgress, dailyStats } = useContext(AppContext);
  const { activities, removeActivity } = useCalculator();
  const { announceToScreenReader } = useAccessibility();

  // Build chart data from breakdown
  const chartData = useMemo(
    () =>
      ACTIVITY_CATEGORIES.map((cat) => ({
        category: cat.label,
        value: dailyStats.breakdown[cat.id] || 0,
        color: cat.color,
      })),
    [dailyStats]
  );

  const remaining = userProfile.dailyGoal - dailyStats.total;
  const overBy = dailyStats.total - userProfile.dailyGoal;
  const barColor =
    goalProgress > 100
      ? 'bg-red-500'
      : goalProgress > 75
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <main
      id="main-content"
      aria-label="Carbon footprint dashboard"
      className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8"
    >
      <h1 className="sr-only">Dashboard — Your Carbon Footprint</h1>

      {/* ── Section 1: Today's Summary ─────────────────────────────────────── */}
      <section aria-label="Today's emissions summary">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Footprint</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-4xl font-bold text-green-400">
              {formatEmissions(dailyStats.total)}
            </p>
            <Badge
              level={emissionLevel}
              value={formatEmissions(dailyStats.total)}
            />
          </div>

          {/* Goal progress */}
          <div className="mt-5">
            <p className="text-sm text-slate-400 mb-2">
              Goal: {userProfile.dailyGoal} kg CO₂e &nbsp;·&nbsp; {goalProgress.toFixed(0)}% used
            </p>
            <div
              role="progressbar"
              aria-valuenow={Math.min(goalProgress, 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Goal progress: ${goalProgress.toFixed(0)}% of ${userProfile.dailyGoal} kg daily goal`}
              className="h-3 bg-[#0f3460] rounded-full overflow-hidden"
            >
              <div
                className={`h-full transition-all duration-500 rounded-full ${barColor}`}
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {goalProgress <= 100
                ? `${remaining.toFixed(2)} kg remaining`
                : `${overBy.toFixed(2)} kg over goal`}
            </p>
          </div>
        </Card>
      </section>

      {/* ── Section 2: Charts ──────────────────────────────────────────────── */}
      {activities.length > 0 && (
        <section aria-label="Emissions breakdown by category">
          <h2 className="text-lg font-semibold text-white mb-4">Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <EmissionsBarChart
                data={chartData}
                title="By Category"
                ariaLabel="Bar chart showing CO2e emissions by category"
              />
            </Card>
            <Card>
              <EmissionsPieChart
                data={chartData}
                title="Distribution"
                ariaLabel="Pie chart showing emissions distribution by category"
              />
            </Card>
          </div>
        </section>
      )}

      {/* ── Section 3: Log Activity ─────────────────────────────────────────── */}
      <section aria-label="Log new activity">
        <h2 className="text-lg font-semibold text-white mb-4">Log Activity</h2>
        <Card>
          <ActivityForm
            onSuccess={() =>
              announceToScreenReader('Activity added to your log')
            }
          />
        </Card>
      </section>

      {/* ── Section 4: Activity List ───────────────────────────────────────── */}
      <section aria-label="Today's logged activities">
        <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Log</h2>
        <Card>
          {activities.length === 0 ? (
            <p className="text-slate-400">
              No activities logged yet. Add your first one above.
            </p>
          ) : (
            <ul aria-label="List of today's activities" className="divide-y divide-[#0f3460]">
              {activities.map((act) => (
                <li
                  key={act.id}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <span className="text-slate-200 capitalize">
                      {act.activityType?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 text-sm ml-2">
                      {act.quantity} {act.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      removeActivity(act.id);
                      announceToScreenReader(
                        `Removed ${act.activityType?.replace(/_/g, ' ')} activity`
                      );
                    }}
                    aria-label={`Remove ${act.activityType?.replace(/_/g, ' ')} activity`}
                    className="text-red-400 hover:text-red-300 text-sm focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded px-2 py-1 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}
