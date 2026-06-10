/**
 * @fileoverview DailySummaryCard component — today's CO2e total with goal progress bar.
 * Extracted from DashboardPage to give this block a single, clear responsibility.
 * @module components/features/DailySummaryCard
 */

import PropTypes from 'prop-types';
import { formatEmissions } from '../../utils/calculator';
import { getMotivationalMessage } from '../../utils/carbonEquivalents';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * Displays the user's total daily CO2e emissions and their progress against the daily goal.
 * Uses a colour-coded progress bar: green < 75%, yellow 75–100%, red > 100%.
 *
 * @param {Object} props
 * @param {{ total: number, breakdown: Object }} props.dailyStats - Aggregated daily emission stats
 * @param {'low'|'medium'|'high'|'very-high'} props.emissionLevel - Current emission level band
 * @param {number} props.goalProgress - Goal completion percentage (0–200)
 * @param {{ name: string, location: string, dailyGoal: number }} props.userProfile - User profile data
 * @returns {JSX.Element} The rendered summary card
 */
export default function DailySummaryCard({ dailyStats, emissionLevel, goalProgress, userProfile }) {
  // Colour-code the bar: green when under 75%, yellow when approaching limit, red when over
  const barColor =
    goalProgress > 100 ? 'bg-red-500' : goalProgress > 75 ? 'bg-yellow-500' : 'bg-green-500';

  const remaining = userProfile.dailyGoal - dailyStats.total;
  const overBy = dailyStats.total - userProfile.dailyGoal;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Footprint</h2>

      {/* Total + level badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-4xl font-bold text-green-400">{formatEmissions(dailyStats.total)}</p>
        <Badge level={emissionLevel} value={formatEmissions(dailyStats.total)} />
      </div>

      {/* Goal progress bar */}
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
        {/* Personalized motivational message — adapts to current goal usage */}
        <p className="text-sm text-green-400 mt-2 italic">
          {getMotivationalMessage(goalProgress, userProfile.name)}
        </p>
      </div>
    </Card>
  );
}

DailySummaryCard.displayName = 'DailySummaryCard';

DailySummaryCard.propTypes = {
  dailyStats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    breakdown: PropTypes.object.isRequired,
  }).isRequired,
  emissionLevel: PropTypes.oneOf(['low', 'medium', 'high', 'very-high']).isRequired,
  goalProgress: PropTypes.number.isRequired,
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    dailyGoal: PropTypes.number.isRequired,
  }).isRequired,
};
