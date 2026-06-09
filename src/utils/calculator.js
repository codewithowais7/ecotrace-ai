/**
 * Carbon emissions calculator utilities for EcoTrace AI.
 * All calculations use IPCC AR6 / EPA / CEA India 2023 emission factors.
 */

import { EMISSION_FACTORS } from '../constants/emissionFactors';
import { EMISSION_LEVEL_CONFIG } from '../constants/categories';
import { sanitizeNumber } from './sanitizers';

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param {number} value
 * @param {number} [decimals=3]
 * @returns {number}
 */
function round(value, decimals = 3) {
  return parseFloat(value.toFixed(decimals));
}

/**
 * Calculates CO2e emissions from a transport activity.
 *
 * @param {string} transportType - Key from EMISSION_FACTORS.TRANSPORT (e.g. 'car_petrol').
 * @param {number} distanceKm - Distance travelled in kilometres.
 * @returns {number} Emissions in kg CO2e, rounded to 3 decimal places.
 *                   Returns 0 for unknown transport types.
 */
export function calculateTransportEmissions(transportType, distanceKm) {
  const distance = sanitizeNumber(distanceKm);
  const factor = EMISSION_FACTORS.TRANSPORT[transportType];
  if (factor === undefined) return 0;
  return round(factor * distance);
}

/**
 * Calculates CO2e emissions from a food activity.
 *
 * @param {string} foodType - Key from EMISSION_FACTORS.FOOD (e.g. 'beef').
 * @param {number} quantity - Amount consumed (kg for food items, count for meals).
 * @returns {number} Emissions in kg CO2e, rounded to 3 decimal places.
 *                   Returns 0 for unknown food types.
 */
export function calculateFoodEmissions(foodType, quantity) {
  const qty = sanitizeNumber(quantity);
  const factor = EMISSION_FACTORS.FOOD[foodType];
  if (factor === undefined) return 0;
  return round(factor * qty);
}

/**
 * Calculates CO2e emissions from a home energy activity.
 *
 * @param {string} energyType - Key from EMISSION_FACTORS.ENERGY (e.g. 'electricity_india').
 * @param {number} amount - Amount consumed (kWh, cubic metres, or kg depending on type).
 * @returns {number} Emissions in kg CO2e, rounded to 3 decimal places.
 *                   Returns 0 for unknown energy types.
 */
export function calculateEnergyEmissions(energyType, amount) {
  const qty = sanitizeNumber(amount);
  const factor = EMISSION_FACTORS.ENERGY[energyType];
  if (factor === undefined) return 0;
  return round(factor * qty);
}

/**
 * Calculates CO2e emissions from a shopping activity.
 *
 * @param {string} itemType - Key from EMISSION_FACTORS.SHOPPING (e.g. 'clothing').
 * @param {number} quantity - Number of items purchased.
 * @returns {number} Emissions in kg CO2e, rounded to 3 decimal places.
 *                   Returns 0 for unknown item types.
 */
export function calculateShoppingEmissions(itemType, quantity) {
  const qty = sanitizeNumber(quantity);
  const factor = EMISSION_FACTORS.SHOPPING[itemType];
  if (factor === undefined) return 0;
  return round(factor * qty);
}

/**
 * Calculates total CO2e emissions from an array of activity records,
 * returning both the overall total and a per-category breakdown.
 *
 * @param {Array<{ category: string, activityType: string, quantity: number }>} activities
 *   Array of activity objects. Unknown categories contribute 0 to the total.
 * @returns {{ total: number, breakdown: { transport: number, food: number, energy: number, shopping: number } }}
 */
export function calculateTotalEmissions(activities) {
  const breakdown = { transport: 0, food: 0, energy: 0, shopping: 0 };

  if (!Array.isArray(activities)) {
    return { total: 0, breakdown };
  }

  for (const activity of activities) {
    const { category, activityType, quantity } = activity;
    let emissions = 0;

    switch (category) {
      case 'transport':
        emissions = calculateTransportEmissions(activityType, quantity);
        breakdown.transport = round(breakdown.transport + emissions);
        break;
      case 'food':
        emissions = calculateFoodEmissions(activityType, quantity);
        breakdown.food = round(breakdown.food + emissions);
        break;
      case 'energy':
        emissions = calculateEnergyEmissions(activityType, quantity);
        breakdown.energy = round(breakdown.energy + emissions);
        break;
      case 'shopping':
        emissions = calculateShoppingEmissions(activityType, quantity);
        breakdown.shopping = round(breakdown.shopping + emissions);
        break;
      default:
        break;
    }
  }

  const total = round(breakdown.transport + breakdown.food + breakdown.energy + breakdown.shopping);

  return { total, breakdown };
}

/**
 * Determines the emission level category for a given total.
 * Thresholds: low < 5, medium 5–15, high 15–30, very-high > 30.
 *
 * @param {number} totalKgCO2e - Total emissions in kg CO2e.
 * @returns {'low' | 'medium' | 'high' | 'very-high'}
 */
export function getEmissionLevel(totalKgCO2e) {
  const value = sanitizeNumber(totalKgCO2e);
  for (const [level, config] of Object.entries(EMISSION_LEVEL_CONFIG)) {
    if (value < config.max) return level;
  }
  return 'very-high';
}

/**
 * Formats an emission value for human-readable display.
 * Values >= 1000 kg are displayed as tonnes; others as kg.
 *
 * @param {number} kgCO2e - Emission value in kg CO2e.
 * @returns {string} Formatted string, e.g. "1.5 tonnes CO₂e" or "12.34 kg CO₂e".
 */
export function formatEmissions(kgCO2e) {
  const value = sanitizeNumber(kgCO2e);
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} tonnes CO₂e`;
  }
  return `${value.toFixed(2)} kg CO₂e`;
}

/**
 * Calculates what percentage of the daily goal has been reached.
 * The result is capped at 200% to prevent oversized progress bars.
 *
 * @param {number} current - Current emission total in kg CO2e.
 * @param {number} goal - Daily emission goal in kg CO2e.
 * @returns {number} Percentage (0–200), or 0 if goal is 0.
 */
export function calculateGoalPercentage(current, goal) {
  const c = sanitizeNumber(current);
  const g = sanitizeNumber(goal);
  if (g <= 0) return 0;
  return Math.min(200, round((c / g) * 100, 1));
}
