/**
 * @fileoverview Carbon footprint real-world equivalency utilities.
 * Converts raw CO2e values into relatable comparisons to help users
 * understand their environmental impact.
 * @module carbonEquivalents
 */

/**
 * Generates real-world carbon equivalencies for a given kg CO2e value.
 *
 * @param {number} kgCO2e - Emission value in kg CO2e
 * @returns {Array<{icon: string, description: string, value: string}>}
 *   Array of equivalency objects with icon, human-readable description, and computed value string.
 *   Returns an empty array for zero or negative input.
 */
export function getCarbonEquivalents(kgCO2e) {
  if (!kgCO2e || kgCO2e <= 0) return [];
  return [
    {
      icon: '🌳',
      description: `trees needed to absorb this over a year`,
      value: (kgCO2e / 21.7).toFixed(1),
    },
    {
      icon: '📱',
      description: `smartphone charges equivalent`,
      value: Math.round(kgCO2e / 0.005).toString(),
    },
    {
      icon: '🚗',
      description: `km driven in a petrol car`,
      value: Math.round(kgCO2e / 0.21).toString(),
    },
    {
      icon: '💡',
      description: `hours powering a LED bulb`,
      value: Math.round((kgCO2e / 0.708) * 1000).toString(),
    },
  ];
}

/**
 * Returns a personalized motivational message based on goal progress percentage.
 * Uses only the user's first name to keep the message concise.
 *
 * @param {number} percentage - Goal usage percentage (0–200+)
 * @param {string|null|undefined} name - User's full name (first name extracted automatically)
 * @returns {string} Motivational message tailored to the current usage level
 */
export function getMotivationalMessage(percentage, name) {
  // Extract first name only — keeps messages short and friendly
  const firstName = name ? name.split(' ')[0] : 'there';

  if (percentage === 0) return `Ready to start tracking, ${firstName}? Log your first activity!`;
  if (percentage <= 50) return `Great start, ${firstName}! You're well within your goal.`;
  if (percentage <= 75) return `Good progress, ${firstName}! Stay mindful of your choices.`;
  if (percentage <= 100)
    return `Getting close, ${firstName}! Consider your remaining activities carefully.`;
  if (percentage <= 130)
    return `You've exceeded your goal, ${firstName}. Check your AI insights for tips.`;
  return `High footprint today, ${firstName}. Tomorrow is a new opportunity to reduce.`;
}

/**
 * Calculates the number of trees needed to offset a given annual CO2e figure.
 * Based on the average tree absorption rate of 21.7 kg CO2e per tree per year.
 *
 * @param {number|null} annualKgCO2e - Annual emissions in kg CO2e
 * @returns {number} Number of trees required (integer, rounded up); 0 for invalid/zero input
 */
export function treesToOffset(annualKgCO2e) {
  if (!annualKgCO2e || annualKgCO2e <= 0) return 0;
  // One tree absorbs ~21.7 kg CO2e per year (IPCC AR6 estimate)
  return Math.ceil(annualKgCO2e / 21.7);
}
