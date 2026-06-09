import { TRANSPORT_FACTORS, ENERGY_FACTORS, FOOD_FACTORS, SHOPPING_FACTORS, WASTE_FACTORS } from '../constants/emissionFactors';

const ALL_FACTORS = {
  ...TRANSPORT_FACTORS,
  ...ENERGY_FACTORS,
  ...FOOD_FACTORS,
  ...SHOPPING_FACTORS,
  ...WASTE_FACTORS,
};

/**
 * Calculate CO2e emissions for a single activity entry
 * @param {string} subcategoryId - The subcategory ID from emissionFactors
 * @param {number} quantity - The amount consumed
 * @returns {number} CO2e in kg
 */
export function calculateEmission(subcategoryId, quantity) {
  const factor = ALL_FACTORS[subcategoryId];
  if (factor === undefined) {
    throw new Error(`Unknown emission factor key: ${subcategoryId}`);
  }
  if (typeof quantity !== 'number' || isNaN(quantity) || quantity < 0) {
    throw new Error(`Invalid quantity: ${quantity}`);
  }
  return parseFloat((factor * quantity).toFixed(3));
}

/**
 * Calculate total emissions from an array of emission entries
 * @param {Array<{subcategoryId: string, quantity: number}>} entries
 * @returns {number} Total CO2e in kg
 */
export function calculateTotal(entries) {
  return entries.reduce((sum, entry) => {
    return sum + calculateEmission(entry.subcategoryId, entry.quantity);
  }, 0);
}

/**
 * Group and sum emissions by category
 * @param {Array<{category: string, emissions: number}>} entries
 * @returns {Object} Totals by category
 */
export function groupByCategory(entries) {
  return entries.reduce((acc, entry) => {
    const cat = entry.category || 'other';
    acc[cat] = (acc[cat] || 0) + (entry.emissions || 0);
    return acc;
  }, {});
}

/**
 * Annualize an emission value from a given period
 * @param {number} value - Emission in kg
 * @param {'day'|'week'|'month'|'year'} period
 * @returns {number} Annualized kg CO2e
 */
export function annualize(value, period) {
  const multipliers = { day: 365, week: 52, month: 12, year: 1 };
  const multiplier = multipliers[period];
  if (!multiplier) throw new Error(`Unknown period: ${period}`);
  return parseFloat((value * multiplier).toFixed(1));
}

/**
 * Format kg CO2e into a human-readable string
 * @param {number} kg
 * @returns {string}
 */
export function formatEmission(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} tonnes CO₂e`;
  }
  return `${kg.toFixed(1)} kg CO₂e`;
}
