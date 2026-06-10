/**
 * @fileoverview ActivityList component — scrollable list of today's logged activities with removal.
 * Extracted from DashboardPage to give this block a single, clear responsibility.
 * @module components/features/ActivityList
 */

import PropTypes from 'prop-types';
import Card from '../ui/Card';

/**
 * Renders a scrollable list of today's logged activities.
 * Each row shows the activity type, quantity/unit, and a remove button.
 * Announces removals to screen readers via the provided callback.
 *
 * @param {Object} props
 * @param {Array<import('../../utils/types').Activity>} props.activities - Logged activities for today
 * @param {Function} props.onRemove - Callback invoked with the activity id to remove
 * @param {Function} props.onAnnounce - Screen reader announcement callback from useAccessibility
 * @returns {JSX.Element} The rendered activity list card
 */
export default function ActivityList({ activities, onRemove, onAnnounce }) {
  return (
    <section aria-label="Today's logged activities">
      <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Log</h2>
      <Card>
        {activities.length === 0 ? (
          <p className="text-slate-400">No activities logged yet. Add your first one above.</p>
        ) : (
          <ul aria-label="List of today's activities" className="divide-y divide-[#0f3460]">
            {activities.map((act) => {
              // Humanize the snake_case activityType for display (e.g. 'car_petrol' → 'car petrol')
              const displayType = act.activityType?.replace(/_/g, ' ');

              /**
               * Handles the remove button click — dispatches removal and announces to screen readers.
               */
              function handleRemove() {
                onRemove(act.id);
                onAnnounce(`Removed ${displayType} activity`);
              }

              return (
                <li key={act.id} className="flex justify-between items-center py-3">
                  <div>
                    <span className="text-slate-200 capitalize">{displayType}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      {act.quantity} {act.unit}
                    </span>
                  </div>
                  <button
                    onClick={handleRemove}
                    aria-label={`Remove ${displayType} activity`}
                    className="text-red-400 hover:text-red-300 text-sm focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded px-2 py-1 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </section>
  );
}

ActivityList.displayName = 'ActivityList';

ActivityList.propTypes = {
  /** Array of logged activity objects for today */
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      activityType: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      unit: PropTypes.string,
    })
  ).isRequired,
  /** Callback invoked with the activity id to remove */
  onRemove: PropTypes.func.isRequired,
  /** Screen reader announcement callback */
  onAnnounce: PropTypes.func.isRequired,
};
