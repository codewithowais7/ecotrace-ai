/**
 * Category and configuration constants for EcoTrace AI.
 */

/**
 * Ordered list of emission activity categories displayed in the UI.
 * @type {Array<{ id: string, label: string, icon: string, color: string, description: string }>}
 */
export const ACTIVITY_CATEGORIES = [
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚗',
    color: '#3b82f6',
    description: 'Daily travel by any mode',
  },
  {
    id: 'food',
    label: 'Food & Diet',
    icon: '🍽️',
    color: '#f59e0b',
    description: 'Meals and food purchases',
  },
  {
    id: 'energy',
    label: 'Home Energy',
    icon: '⚡',
    color: '#ef4444',
    description: 'Electricity, gas, LPG usage',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    color: '#8b5cf6',
    description: 'Clothing, electronics, furniture',
  },
];

/**
 * Emission level thresholds and display configuration.
 * `max` is the upper bound (exclusive) in kg CO2e for that band.
 * @type {Object.<string, { label: string, max: number, color: string, textColor: string, bgColor: string }>}
 */
export const EMISSION_LEVEL_CONFIG = {
  low: {
    label: 'Low',
    max: 5,
    color: '#22c55e',
    textColor: 'text-green-400',
    bgColor: 'bg-green-900/30',
  },
  medium: {
    label: 'Medium',
    max: 15,
    color: '#f59e0b',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-900/30',
  },
  high: {
    label: 'High',
    max: 30,
    color: '#f97316',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-900/30',
  },
  'very-high': {
    label: 'Very High',
    max: Infinity,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-900/30',
  },
};

/**
 * Global application-level constants.
 */
export const APP_CONSTANTS = {
  APP_NAME: 'EcoTrace AI',
  VERSION: '1.0.0',
  /** Average daily per-capita footprint for India (kg CO2e) */
  INDIA_AVERAGE_DAILY_KG: 13.4,
  /** Average daily per-capita footprint globally (kg CO2e) */
  GLOBAL_AVERAGE_DAILY_KG: 12.9,
  /** Default daily carbon goal for new users (kg CO2e) */
  DEFAULT_DAILY_GOAL_KG: 13.4,
  /** Hard cap on activities tracked per day */
  MAX_ACTIVITIES_PER_DAY: 50,
  /** Minimum milliseconds between Gemini API calls (rate limiting) */
  GEMINI_RATE_LIMIT_MS: 3000,
  /** Maximum characters sent in a single Gemini prompt */
  MAX_PROMPT_CHARS: 800,
};
