/**
 * Custom hook that provides a validated, sanitized activity logging interface
 * backed by the global AppContext and calculator utilities.
 */

import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { validateActivityForm } from '../utils/validators';
import { sanitizeFormData } from '../utils/sanitizers';

/**
 * Provides activity logging with built-in validation and sanitization,
 * plus direct access to the current emission stats from context.
 *
 * @returns {{
 *   logActivity: (formData: Object) => { success: boolean, errors: Object },
 *   activities: Array,
 *   dailyStats: { total: number, breakdown: Object },
 *   emissionLevel: string,
 *   goalProgress: number
 * }}
 */
export function useCalculator() {
  const { addActivity, activities, dailyStats, emissionLevel, goalProgress } =
    useContext(AppContext);

  /**
   * Validate and sanitize a form submission, then log it as an activity.
   * Returns a success flag and any validation errors found.
   *
   * @param {Object} formData - Raw form data from the activity entry form.
   * @param {string} formData.category - Emission category (e.g. 'transport').
   * @param {string} formData.activityType - Specific activity key (e.g. 'car_petrol').
   * @param {number|string} formData.quantity - Amount for the activity.
   * @param {string} formData.unit - Unit of measurement (e.g. 'km').
   * @param {string} [formData.description] - Optional user notes.
   * @returns {{ success: boolean, errors: Object.<string, string> }}
   */
  function logActivity(formData) {
    const sanitized = sanitizeFormData(formData);
    const { valid, errors } = validateActivityForm(sanitized);

    if (!valid) {
      return { success: false, errors };
    }

    addActivity(sanitized);
    return { success: true, errors: {} };
  }

  return {
    logActivity,
    activities,
    dailyStats,
    emissionLevel,
    goalProgress,
  };
}
