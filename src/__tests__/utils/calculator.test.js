import { describe, it, expect } from 'vitest';
import {
  calculateEmission,
  calculateTotal,
  groupByCategory,
  annualize,
  formatEmission,
} from '../../utils/calculator';

describe('calculateEmission', () => {
  it('calculates petrol car emissions correctly', () => {
    expect(calculateEmission('car_petrol', 100)).toBe(19.2);
  });

  it('returns 0 for zero-factor activities (walking)', () => {
    expect(calculateEmission('walking', 50)).toBe(0);
  });

  it('throws on unknown subcategoryId', () => {
    expect(() => calculateEmission('unknown_id', 10)).toThrow();
  });

  it('throws on negative quantity', () => {
    expect(() => calculateEmission('car_petrol', -1)).toThrow();
  });

  it('throws on NaN quantity', () => {
    expect(() => calculateEmission('car_petrol', NaN)).toThrow();
  });
});

describe('calculateTotal', () => {
  it('sums multiple entries correctly', () => {
    const entries = [
      { subcategoryId: 'car_petrol', quantity: 100 },
      { subcategoryId: 'bus', quantity: 100 },
    ];
    const total = calculateTotal(entries);
    expect(total).toBeCloseTo(19.2 + 8.9, 1);
  });

  it('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe('groupByCategory', () => {
  it('groups entries by category', () => {
    const entries = [
      { category: 'transport', emissions: 10 },
      { category: 'transport', emissions: 5 },
      { category: 'energy', emissions: 20 },
    ];
    const result = groupByCategory(entries);
    expect(result.transport).toBe(15);
    expect(result.energy).toBe(20);
  });
});

describe('annualize', () => {
  it('annualizes weekly emissions correctly', () => {
    expect(annualize(10, 'week')).toBe(520);
  });

  it('annualizes monthly emissions correctly', () => {
    expect(annualize(100, 'month')).toBe(1200);
  });

  it('throws on unknown period', () => {
    expect(() => annualize(10, 'quarter')).toThrow();
  });
});

describe('formatEmission', () => {
  it('formats kg values under 1000', () => {
    expect(formatEmission(500)).toBe('500.0 kg CO₂e');
  });

  it('formats values over 1000 as tonnes', () => {
    expect(formatEmission(2500)).toBe('2.50 tonnes CO₂e');
  });
});
