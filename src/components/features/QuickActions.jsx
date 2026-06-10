/**
 * @fileoverview QuickActions component for one-click carbon activity logging.
 * Provides pre-configured common daily activities as simple action buttons,
 * directly addressing the "simple actions" goal of the platform.
 * @module components/features/QuickActions
 */

import { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import { useAccessibility } from '../../hooks/useAccessibility';

const QUICK_ACTIONS = [
  {
    id: 'qa1',
    label: 'Drove to work',
    icon: '🚗',
    category: 'transport',
    activityType: 'car_petrol',
    quantity: 15,
    unit: 'km',
    description: '15km car commute',
  },
  {
    id: 'qa2',
    label: 'Took the bus',
    icon: '🚌',
    category: 'transport',
    activityType: 'bus',
    quantity: 10,
    unit: 'km',
    description: '10km bus ride',
  },
  {
    id: 'qa3',
    label: 'Ate a meat meal',
    icon: '🍖',
    category: 'food',
    activityType: 'meat_meal',
    quantity: 1,
    unit: 'meal',
    description: 'Standard meat meal',
  },
  {
    id: 'qa4',
    label: 'Vegetarian meal',
    icon: '🥗',
    category: 'food',
    activityType: 'vegetarian_meal',
    quantity: 1,
    unit: 'meal',
    description: 'Vegetarian meal',
  },
  {
    id: 'qa5',
    label: 'Used AC (4hrs)',
    icon: '❄️',
    category: 'energy',
    activityType: 'electricity_india',
    quantity: 2,
    unit: 'kWh',
    description: '2 kWh electricity',
  },
  {
    id: 'qa6',
    label: 'Bought clothing',
    icon: '👕',
    category: 'shopping',
    activityType: 'clothing',
    quantity: 1,
    unit: 'item',
    description: '1 clothing item',
  },
  {
    id: 'qa7',
    label: 'Train journey',
    icon: '🚆',
    category: 'transport',
    activityType: 'train',
    quantity: 30,
    unit: 'km',
    description: '30km train ride',
  },
  {
    id: 'qa8',
    label: 'Cooked with LPG',
    icon: '🔥',
    category: 'energy',
    activityType: 'lpg',
    quantity: 0.5,
    unit: 'kg',
    description: '0.5kg LPG cooking',
  },
];

/**
 * QuickActions component — enables simple one-click carbon footprint logging
 * for the most common daily activities individuals perform.
 *
 * @returns {JSX.Element}
 */
export default function QuickActions() {
  const { logActivity } = useCalculator();
  const { announceToScreenReader } = useAccessibility();
  const [recentlyClicked, setRecentlyClicked] = useState(null);

  /**
   * Handles quick action button click — logs activity instantly without a form.
   *
   * @param {Object} action - Pre-configured activity object from QUICK_ACTIONS
   */
  function handleQuickAction(action) {
    const result = logActivity({
      category: action.category,
      activityType: action.activityType,
      quantity: action.quantity,
      unit: action.unit,
      description: action.description,
    });

    if (result.success) {
      setRecentlyClicked(action.id);
      announceToScreenReader(`Logged: ${action.label}`);
      setTimeout(() => setRecentlyClicked(null), 2000);
    }
  }

  return (
    <section aria-label="Quick action activity buttons for simple one-click logging">
      <h2 className="text-lg font-semibold text-white mb-1">Quick Log</h2>
      <p className="text-sm text-slate-400 mb-4">
        Tap any common activity to instantly log it to your footprint — no form needed.
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_ACTIONS.map((action) => {
          const isLogged = recentlyClicked === action.id;
          return (
            <li key={action.id}>
              <button
                id={`quick-action-${action.id}`}
                onClick={() => handleQuickAction(action)}
                aria-label={`Log: ${action.label}`}
                aria-pressed={isLogged}
                className={`w-full flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 text-sm font-medium
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500
                  ${
                    isLogged
                      ? 'bg-green-900/40 border-green-500 text-green-400 scale-95'
                      : 'bg-[#16213e] border-[#0f3460] hover:border-green-600 hover:bg-[#1a2a50] text-slate-300 hover:scale-[1.02]'
                  }`}
              >
                <span aria-hidden="true" className="text-2xl leading-none">
                  {action.icon}
                </span>
                <span className="text-center leading-tight">{action.label}</span>
                {isLogged && (
                  <span className="text-xs text-green-400 font-semibold" aria-hidden="true">
                    ✓ Logged
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

QuickActions.displayName = 'QuickActions';

