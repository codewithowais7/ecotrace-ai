import { describe, it, expect } from 'vitest';
import {
  getCarbonEquivalents,
  getMotivationalMessage,
  treesToOffset,
} from '../../utils/carbonEquivalents';

describe('getCarbonEquivalents', () => {
  it('returns array of equivalents for a positive value', () => {
    const result = getCarbonEquivalents(10);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
  it('returns empty array for zero', () => {
    expect(getCarbonEquivalents(0)).toEqual([]);
  });
  it('returns empty array for null', () => {
    expect(getCarbonEquivalents(null)).toEqual([]);
  });
  it('returns empty array for negative value', () => {
    expect(getCarbonEquivalents(-5)).toEqual([]);
  });
  it('each equivalent has icon, description, and value fields', () => {
    const result = getCarbonEquivalents(5);
    result.forEach((eq) => {
      expect(eq).toHaveProperty('icon');
      expect(eq).toHaveProperty('description');
      expect(eq).toHaveProperty('value');
    });
  });
  it('includes a tree-based equivalent for any positive value', () => {
    const result = getCarbonEquivalents(10);
    expect(result.some((e) => e.description.includes('tree'))).toBe(true);
  });
  it('scales — larger emissions produce larger km equivalent', () => {
    const low = getCarbonEquivalents(1).find((e) => e.description.includes('km'));
    const high = getCarbonEquivalents(100).find((e) => e.description.includes('km'));
    expect(parseFloat(high.value)).toBeGreaterThan(parseFloat(low.value));
  });
});

describe('getMotivationalMessage', () => {
  it('returns a non-empty string for any valid percentage', () => {
    [0, 30, 75, 100, 150].forEach((pct) => {
      expect(typeof getMotivationalMessage(pct, 'Ali')).toBe('string');
      expect(getMotivationalMessage(pct, 'Ali').length).toBeGreaterThan(0);
    });
  });
  it('uses only the first name from a full name', () => {
    const msg = getMotivationalMessage(50, 'Alice Smith');
    expect(msg).toContain('Alice');
    expect(msg).not.toContain('Smith');
  });
  it('handles undefined name without throwing', () => {
    expect(() => getMotivationalMessage(50, undefined)).not.toThrow();
  });
  it('handles null name without throwing', () => {
    expect(() => getMotivationalMessage(50, null)).not.toThrow();
  });
  it('returns a start message for zero percentage', () => {
    const msg = getMotivationalMessage(0, 'Sam');
    expect(msg).toContain('Sam');
  });
  it('returns an over-goal message for percentage above 130', () => {
    const msg = getMotivationalMessage(150, 'Jo');
    expect(typeof msg).toBe('string');
  });
});

describe('treesToOffset', () => {
  it('returns a positive integer for positive annual emissions', () => {
    const result = treesToOffset(2190);
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });
  it('returns at least 1 for any small positive value', () => {
    expect(treesToOffset(1)).toBeGreaterThanOrEqual(1);
  });
  it('returns 0 for zero', () => {
    expect(treesToOffset(0)).toBe(0);
  });
  it('returns 0 for null', () => {
    expect(treesToOffset(null)).toBe(0);
  });
  it('scales correctly — double emissions needs more trees', () => {
    expect(treesToOffset(4000)).toBeGreaterThan(treesToOffset(2000));
  });
  it('rounds up — partial trees become whole trees', () => {
    expect(treesToOffset(22)).toBe(2);
  });
});
