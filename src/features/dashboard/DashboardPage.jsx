/**
 * @fileoverview Dashboard page — assembles today's emission summary, charts, activity form, and log.
 * Each section delegates to a focused sub-component: DailySummaryCard, CarbonContext,
 * QuickActions, ActivityForm, and ActivityList.
 * @module features/dashboard/DashboardPage
 */

import { useContext, useMemo } from 'react';
import AppContext from '../../context/AppContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useAccessibility } from '../../hooks/useAccessibility';
import { ACTIVITY_CATEGORIES } from '../../constants/categories';

import Card from '../../components/ui/Card';
import ActivityForm from '../../components/forms/ActivityForm';
import EmissionsBarChart from '../../components/charts/EmissionsBarChart';
import EmissionsPieChart from '../../components/charts/EmissionsPieChart';
import DailySummaryCard from '../../components/features/DailySummaryCard';
import CarbonContext from '../../components/features/CarbonContext';
import QuickActions from '../../components/features/QuickActions';
import ActivityList from '../../components/features/ActivityList';

/**
 * Dashboard page — assembles all daily tracking sections into a single scrollable layout.
 * Delegates rendering responsibility to focused sub-components for maintainability.
 *
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function DashboardPage() {
  const { userProfile, emissionLevel, goalProgress, dailyStats } = useContext(AppContext);
  const { activities, removeActivity } = useCalculator();
  const { announceToScreenReader } = useAccessibility();

  // Build chart data from category breakdown — memoized to avoid recomputation on unrelated updates
  const chartData = useMemo(
    () =>
      ACTIVITY_CATEGORIES.map((cat) => ({
        category: cat.label,
        value: dailyStats.breakdown[cat.id] || 0,
        color: cat.color,
      })),
    [dailyStats]
  );

  return (
    <main
      id="main-content"
      aria-label="Carbon footprint dashboard"
      className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8"
    >
      <h1 className="sr-only">Dashboard — Your Carbon Footprint</h1>

      {/* ── Section 1: Today's Summary ─────────────────────────────────────── */}
      <section aria-label="Today's emissions summary">
        <DailySummaryCard
          dailyStats={dailyStats}
          emissionLevel={emissionLevel}
          goalProgress={goalProgress}
          userProfile={userProfile}
        />
      </section>

      {/* ── Section 1b: Carbon Context (understand what the number means) ──── */}
      <section aria-label="What your carbon footprint means">
        <Card>
          <CarbonContext totalKgCO2e={dailyStats.total} level={emissionLevel} />
        </Card>
      </section>

      {/* ── Section 2: Charts (only when activities exist) ─────────────────── */}
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

      {/* ── Section 3: Log Activity (QuickActions + custom form) ───────────── */}
      <section aria-label="Log carbon footprint activities">
        {/* Quick one-click buttons for common daily activities */}
        <Card>
          <QuickActions />
          <div className="mt-5 pt-4 border-t border-[#0f3460]">
            <h2 className="text-lg font-semibold text-white mb-3">Log Custom Activity</h2>
            <ActivityForm
              onSuccess={() => announceToScreenReader('Activity added to your log')}
            />
          </div>
        </Card>
      </section>

      {/* ── Section 4: Activity List ───────────────────────────────────────── */}
      <ActivityList
        activities={activities}
        onRemove={removeActivity}
        onAnnounce={announceToScreenReader}
      />
    </main>
  );
}

DashboardPage.displayName = 'DashboardPage';
