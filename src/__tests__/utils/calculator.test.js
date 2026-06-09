import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
  calculateTotalEmissions,
  getEmissionLevel,
  formatEmissions,
  calculateGoalPercentage,
} from '../../utils/calculator';

// ─── calculateTransportEmissions ─────────────────────────────────────────────

describe('calculateTransportEmissions', () => {
  it('calculates car petrol emissions correctly', () => {
    expect(calculateTransportEmissions('car_petrol', 10)).toBeCloseTo(2.1, 2);
  });

  it('returns 0 for cycling regardless of distance', () => {
    expect(calculateTransportEmissions('cycling', 100)).toBe(0);
  });

  it('returns 0 for walking', () => {
    expect(calculateTransportEmissions('walking', 50)).toBe(0);
  });

  it('returns 0 for unknown transport type', () => {
    expect(calculateTransportEmissions('teleportation', 10)).toBe(0);
  });

  it('handles zero distance', () => {
    expect(calculateTransportEmissions('car_petrol', 0)).toBe(0);
  });

  it('calculates train emissions less than car petrol', () => {
    expect(calculateTransportEmissions('train', 100)).toBeLessThan(
      calculateTransportEmissions('car_petrol', 100)
    );
  });

  it('calculates electric car lower than petrol car', () => {
    expect(calculateTransportEmissions('car_electric', 100)).toBeLessThan(
      calculateTransportEmissions('car_petrol', 100)
    );
  });

  it('calculates domestic flight correctly', () => {
    expect(calculateTransportEmissions('flight_domestic', 1000)).toBeCloseTo(255, 0);
  });

  it('sanitizes NaN quantity to 0', () => {
    expect(calculateTransportEmissions('car_petrol', NaN)).toBe(0);
  });

  it('sanitizes non-numeric string to 0', () => {
    expect(calculateTransportEmissions('car_petrol', 'far')).toBe(0);
  });

  it('calculates motorcycle emissions correctly', () => {
    expect(calculateTransportEmissions('motorcycle', 100)).toBeCloseTo(11, 1);
  });

  it('calculates international flight emissions correctly', () => {
    expect(calculateTransportEmissions('flight_international', 1000)).toBeCloseTo(195, 0);
  });
});

// ─── calculateFoodEmissions ───────────────────────────────────────────────────

describe('calculateFoodEmissions', () => {
  it('calculates beef emissions correctly', () => {
    expect(calculateFoodEmissions('beef', 1)).toBeCloseTo(27, 1);
  });

  it('calculates vegan meal less than meat meal', () => {
    expect(calculateFoodEmissions('vegan_meal', 1)).toBeLessThan(
      calculateFoodEmissions('meat_meal', 1)
    );
  });

  it('handles quantity of 0', () => {
    expect(calculateFoodEmissions('beef', 0)).toBe(0);
  });

  it('returns 0 for unknown food type', () => {
    expect(calculateFoodEmissions('unicorn_steak', 1)).toBe(0);
  });

  it('scales linearly with quantity', () => {
    expect(calculateFoodEmissions('chicken', 2)).toBeCloseTo(
      calculateFoodEmissions('chicken', 1) * 2,
      2
    );
  });

  it('lamb emissions are higher than chicken', () => {
    expect(calculateFoodEmissions('lamb', 1)).toBeGreaterThan(calculateFoodEmissions('chicken', 1));
  });

  it('calculates vegetarian meal emissions correctly', () => {
    expect(calculateFoodEmissions('vegetarian_meal', 1)).toBeCloseTo(1.5, 2);
  });

  it('calculates eggs emissions correctly', () => {
    expect(calculateFoodEmissions('eggs', 1)).toBeCloseTo(4.8, 2);
  });
});

// ─── calculateEnergyEmissions ─────────────────────────────────────────────────

describe('calculateEnergyEmissions', () => {
  it('calculates India electricity correctly', () => {
    expect(calculateEnergyEmissions('electricity_india', 10)).toBeCloseTo(7.08, 2);
  });

  it('handles zero consumption', () => {
    expect(calculateEnergyEmissions('electricity_india', 0)).toBe(0);
  });

  it('calculates LPG emissions correctly', () => {
    expect(calculateEnergyEmissions('lpg', 1)).toBeCloseTo(1.51, 2);
  });

  it('returns 0 for unknown energy type', () => {
    expect(calculateEnergyEmissions('fusion_reactor', 1)).toBe(0);
  });

  it('calculates natural gas emissions correctly', () => {
    expect(calculateEnergyEmissions('natural_gas', 10)).toBeCloseTo(20.4, 2);
  });
});

// ─── calculateShoppingEmissions ───────────────────────────────────────────────

describe('calculateShoppingEmissions', () => {
  it('calculates clothing emissions correctly', () => {
    // clothing factor exists in EMISSION_FACTORS.SHOPPING
    const result = calculateShoppingEmissions('clothing', 1);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  it('returns 0 for unknown shopping item', () => {
    expect(calculateShoppingEmissions('magic_carpet', 1)).toBe(0);
  });

  it('handles zero quantity', () => {
    expect(calculateShoppingEmissions('clothing', 0)).toBe(0);
  });

  it('scales linearly with quantity for shopping', () => {
    const single = calculateShoppingEmissions('clothing', 1);
    const double = calculateShoppingEmissions('clothing', 2);
    expect(double).toBeCloseTo(single * 2, 3);
  });

  it('sanitizes NaN quantity to 0 for shopping', () => {
    expect(calculateShoppingEmissions('clothing', NaN)).toBe(0);
  });
});

// ─── calculateTotalEmissions ──────────────────────────────────────────────────

describe('calculateTotalEmissions', () => {
  it('returns zero totals for empty activities array', () => {
    const result = calculateTotalEmissions([]);
    expect(result.total).toBe(0);
    expect(result.breakdown.transport).toBe(0);
    expect(result.breakdown.food).toBe(0);
  });

  it('sums activities across categories correctly', () => {
    const activities = [
      { category: 'transport', activityType: 'car_petrol', quantity: 10 },
      { category: 'food', activityType: 'beef', quantity: 1 },
    ];
    const result = calculateTotalEmissions(activities);
    expect(result.total).toBeCloseTo(2.1 + 27, 0);
  });

  it('returns breakdown with all four categories', () => {
    const result = calculateTotalEmissions([]);
    expect(result.breakdown).toHaveProperty('transport');
    expect(result.breakdown).toHaveProperty('food');
    expect(result.breakdown).toHaveProperty('energy');
    expect(result.breakdown).toHaveProperty('shopping');
  });

  it('returns zero total for non-array input', () => {
    expect(calculateTotalEmissions(null).total).toBe(0);
    expect(calculateTotalEmissions(undefined).total).toBe(0);
  });

  it('ignores unknown categories gracefully', () => {
    const result = calculateTotalEmissions([
      { category: 'teleportation', activityType: 'warp', quantity: 1 },
    ]);
    expect(result.total).toBe(0);
  });

  it('correctly isolates breakdown per energy category', () => {
    const activities = [{ category: 'energy', activityType: 'electricity_india', quantity: 10 }];
    const { breakdown } = calculateTotalEmissions(activities);
    expect(breakdown.transport).toBe(0);
    expect(breakdown.food).toBe(0);
    expect(breakdown.shopping).toBe(0);
    expect(breakdown.energy).toBeCloseTo(7.08, 1);
  });

  it('accumulates shopping category emissions in breakdown', () => {
    const activities = [{ category: 'shopping', activityType: 'clothing', quantity: 1 }];
    const { total, breakdown } = calculateTotalEmissions(activities);
    expect(breakdown.shopping).toBeGreaterThan(0);
    expect(breakdown.transport).toBe(0);
    expect(breakdown.food).toBe(0);
    expect(breakdown.energy).toBe(0);
    expect(total).toBe(breakdown.shopping);
  });

  it('accumulates all four categories simultaneously', () => {
    const activities = [
      { category: 'transport', activityType: 'car_petrol', quantity: 10 },
      { category: 'food', activityType: 'chicken', quantity: 1 },
      { category: 'energy', activityType: 'electricity_india', quantity: 5 },
      { category: 'shopping', activityType: 'clothing', quantity: 1 },
    ];
    const { breakdown, total } = calculateTotalEmissions(activities);
    expect(breakdown.transport).toBeGreaterThan(0);
    expect(breakdown.food).toBeGreaterThan(0);
    expect(breakdown.energy).toBeGreaterThan(0);
    expect(breakdown.shopping).toBeGreaterThan(0);
    expect(total).toBeCloseTo(
      breakdown.transport + breakdown.food + breakdown.energy + breakdown.shopping,
      3
    );
  });
});

// ─── getEmissionLevel ─────────────────────────────────────────────────────────

describe('getEmissionLevel', () => {
  it('returns low for values below 5', () => {
    expect(getEmissionLevel(0)).toBe('low');
    expect(getEmissionLevel(4.99)).toBe('low');
  });

  it('returns medium for 5 to 15', () => {
    expect(getEmissionLevel(5)).toBe('medium');
    expect(getEmissionLevel(14.99)).toBe('medium');
  });

  it('returns high for 15 to 30', () => {
    expect(getEmissionLevel(15)).toBe('high');
    expect(getEmissionLevel(29.99)).toBe('high');
  });

  it('returns very-high for above 30', () => {
    expect(getEmissionLevel(30.01)).toBe('very-high');
    expect(getEmissionLevel(1000)).toBe('very-high');
  });

  it('returns low for exactly 0', () => {
    expect(getEmissionLevel(0)).toBe('low');
  });

  it('sanitizes NaN to 0 and returns low', () => {
    expect(getEmissionLevel(NaN)).toBe('low');
  });

  it('returns very-high for Infinity input (sanitized to 0 → low)', () => {
    // sanitizeNumber returns 0 for Infinity, so level is low
    expect(getEmissionLevel(Infinity)).toBe('low');
  });
});

// ─── formatEmissions ──────────────────────────────────────────────────────────

describe('formatEmissions', () => {
  it('formats values below 1000 in kg', () => {
    expect(formatEmissions(5.5)).toContain('kg');
    expect(formatEmissions(5.5)).toContain('CO₂e');
  });

  it('formats values above 1000 in tonnes', () => {
    expect(formatEmissions(1500)).toContain('tonnes');
    expect(formatEmissions(1500)).toContain('CO₂e');
  });

  it('formats 0 correctly', () => {
    expect(formatEmissions(0)).toContain('0');
    expect(formatEmissions(0)).toContain('kg');
  });

  it('formats exactly 1000 as tonnes', () => {
    expect(formatEmissions(1000)).toContain('tonnes');
    expect(formatEmissions(1000)).not.toContain('kg');
  });

  it('formats 999.99 as kg, not tonnes', () => {
    expect(formatEmissions(999.99)).toContain('kg');
    expect(formatEmissions(999.99)).not.toContain('tonnes');
  });

  it('rounds kg to 2 decimal places', () => {
    expect(formatEmissions(5.555)).toMatch(/5\.5[56] kg/);
  });

  it('formats 2000 kg as 2.0 tonnes', () => {
    expect(formatEmissions(2000)).toBe('2.0 tonnes CO₂e');
  });

  it('formats 1500 kg as 1.5 tonnes', () => {
    expect(formatEmissions(1500)).toBe('1.5 tonnes CO₂e');
  });
});

// ─── calculateGoalPercentage ──────────────────────────────────────────────────

describe('calculateGoalPercentage', () => {
  it('returns 50 when halfway to goal', () => {
    expect(calculateGoalPercentage(5, 10)).toBe(50);
  });

  it('returns 100 when at goal', () => {
    expect(calculateGoalPercentage(10, 10)).toBe(100);
  });

  it('caps at 200 when over double the goal', () => {
    expect(calculateGoalPercentage(25, 10)).toBe(200);
  });

  it('returns 0 for zero current', () => {
    expect(calculateGoalPercentage(0, 10)).toBe(0);
  });

  it('returns 0 when goal is zero', () => {
    expect(calculateGoalPercentage(10, 0)).toBe(0);
  });

  it('returns 0 when both are zero', () => {
    expect(calculateGoalPercentage(0, 0)).toBe(0);
  });

  it('returns 0 for negative goal', () => {
    expect(calculateGoalPercentage(5, -10)).toBe(0);
  });

  it('rounds result correctly', () => {
    const result = calculateGoalPercentage(1, 3);
    expect(typeof result).toBe('number');
    expect(result).toBeCloseTo(33.3, 0);
  });
});
