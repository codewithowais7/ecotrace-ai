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

// ─── calculateTransportEmissions ────────────────────────────────────────────

describe('calculateTransportEmissions', () => {
  it('calculates petrol car emissions correctly', () => {
    expect(calculateTransportEmissions('car_petrol', 100)).toBe(21);
  });

  it('returns 0 for zero-emission transport (cycling)', () => {
    expect(calculateTransportEmissions('cycling', 50)).toBe(0);
  });

  it('returns 0 for an unknown transport type', () => {
    expect(calculateTransportEmissions('hovercraft', 10)).toBe(0);
  });

  it('sanitizes invalid quantity to 0', () => {
    expect(calculateTransportEmissions('car_petrol', NaN)).toBe(0);
    expect(calculateTransportEmissions('car_petrol', 'abc')).toBe(0);
  });

  it('rounds to 3 decimal places', () => {
    // bus factor 0.089 × 1 = 0.089
    expect(calculateTransportEmissions('bus', 1)).toBe(0.089);
  });
});

// ─── calculateFoodEmissions ─────────────────────────────────────────────────

describe('calculateFoodEmissions', () => {
  it('calculates beef emissions correctly', () => {
    expect(calculateFoodEmissions('beef', 2)).toBe(54);
  });

  it('returns 0 for unknown food type', () => {
    expect(calculateFoodEmissions('soylent_green', 1)).toBe(0);
  });

  it('handles vegan meal factor', () => {
    expect(calculateFoodEmissions('vegan_meal', 3)).toBeCloseTo(2.1, 3);
  });
});

// ─── calculateEnergyEmissions ───────────────────────────────────────────────

describe('calculateEnergyEmissions', () => {
  it('calculates electricity (India) emissions correctly', () => {
    expect(calculateEnergyEmissions('electricity_india', 10)).toBeCloseTo(7.08, 3);
  });

  it('returns 0 for unknown energy type', () => {
    expect(calculateEnergyEmissions('fusion_reactor', 10)).toBe(0);
  });
});

// ─── calculateShoppingEmissions ─────────────────────────────────────────────

describe('calculateShoppingEmissions', () => {
  it('calculates clothing emissions correctly', () => {
    expect(calculateShoppingEmissions('clothing', 2)).toBe(66);
  });

  it('returns 0 for unknown item type', () => {
    expect(calculateShoppingEmissions('unicorn_saddle', 1)).toBe(0);
  });
});

// ─── calculateTotalEmissions ────────────────────────────────────────────────

describe('calculateTotalEmissions', () => {
  it('returns zero totals for empty array', () => {
    const result = calculateTotalEmissions([]);
    expect(result.total).toBe(0);
    expect(result.breakdown).toEqual({ transport: 0, food: 0, energy: 0, shopping: 0 });
  });

  it('returns zero totals for non-array input', () => {
    const result = calculateTotalEmissions(null);
    expect(result.total).toBe(0);
  });

  it('sums across multiple categories correctly', () => {
    const activities = [
      { category: 'transport', activityType: 'car_petrol', quantity: 10 }, // 2.1
      { category: 'food', activityType: 'beef', quantity: 1 },             // 27
      { category: 'energy', activityType: 'electricity_india', quantity: 5 }, // 3.54
      { category: 'shopping', activityType: 'clothing', quantity: 1 },     // 33
    ];
    const { total, breakdown } = calculateTotalEmissions(activities);
    expect(breakdown.transport).toBe(2.1);
    expect(breakdown.food).toBe(27);
    expect(breakdown.energy).toBeCloseTo(3.54, 2);
    expect(breakdown.shopping).toBe(33);
    expect(total).toBeCloseTo(65.64, 1);
  });

  it('ignores activities with unknown categories', () => {
    const activities = [{ category: 'teleportation', activityType: 'warp', quantity: 1 }];
    expect(calculateTotalEmissions(activities).total).toBe(0);
  });
});

// ─── getEmissionLevel ───────────────────────────────────────────────────────

describe('getEmissionLevel', () => {
  it('returns "low" for values below 5', () => {
    expect(getEmissionLevel(0)).toBe('low');
    expect(getEmissionLevel(4.99)).toBe('low');
  });

  it('returns "medium" for values 5–14.99', () => {
    expect(getEmissionLevel(5)).toBe('medium');
    expect(getEmissionLevel(14.99)).toBe('medium');
  });

  it('returns "high" for values 15–29.99', () => {
    expect(getEmissionLevel(15)).toBe('high');
    expect(getEmissionLevel(29.99)).toBe('high');
  });

  it('returns "very-high" for values 30+', () => {
    expect(getEmissionLevel(30)).toBe('very-high');
    expect(getEmissionLevel(1000)).toBe('very-high');
  });
});

// ─── formatEmissions ────────────────────────────────────────────────────────

describe('formatEmissions', () => {
  it('formats values under 1000 as kg', () => {
    expect(formatEmissions(12.5)).toBe('12.50 kg CO₂e');
  });

  it('formats values 1000+ as tonnes', () => {
    expect(formatEmissions(2500)).toBe('2.5 tonnes CO₂e');
  });

  it('handles 0 correctly', () => {
    expect(formatEmissions(0)).toBe('0.00 kg CO₂e');
  });
});

// ─── calculateGoalPercentage ────────────────────────────────────────────────

describe('calculateGoalPercentage', () => {
  it('returns 50 when at half the goal', () => {
    expect(calculateGoalPercentage(5, 10)).toBe(50);
  });

  it('returns 100 when exactly at the goal', () => {
    expect(calculateGoalPercentage(10, 10)).toBe(100);
  });

  it('caps at 200 when over double the goal', () => {
    expect(calculateGoalPercentage(30, 10)).toBe(200);
  });

  it('returns 0 when goal is 0', () => {
    expect(calculateGoalPercentage(10, 0)).toBe(0);
  });
});
