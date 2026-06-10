import { describe, it, expect } from 'vitest';
import { validateTextField, validateActivityForm } from '../../utils/validators';

describe('validateTextField — extended cases', () => {
  it('accepts a single character', () => {
    expect(validateTextField('A').valid).toBe(true);
  });
  it('rejects empty string', () => {
    expect(validateTextField('').valid).toBe(false);
    expect(validateTextField('').error).toBeTruthy();
  });
  it('rejects whitespace-only string', () => {
    expect(validateTextField('   ').valid).toBe(false);
  });
  it('rejects string over maxLength', () => {
    expect(validateTextField('a'.repeat(201), 200).valid).toBe(false);
  });
  it('accepts string at exactly maxLength', () => {
    expect(validateTextField('a'.repeat(200), 200).valid).toBe(true);
  });
  it('rejects null', () => {
    expect(validateTextField(null).valid).toBe(false);
  });
  it('rejects undefined', () => {
    expect(validateTextField(undefined).valid).toBe(false);
  });
  it('returns a human-readable error string', () => {
    const result = validateTextField('');
    expect(typeof result.error).toBe('string');
    expect(result.error.length).toBeGreaterThan(0);
  });
});

describe('validateActivityForm — extended cases', () => {
  it('returns valid for a complete energy activity', () => {
    const { valid } = validateActivityForm({
      category: 'energy',
      activityType: 'electricity_india',
      quantity: 5,
      unit: 'kWh',
    });
    expect(valid).toBe(true);
  });
  it('returns valid for a complete food activity', () => {
    const { valid } = validateActivityForm({
      category: 'food',
      activityType: 'vegan_meal',
      quantity: 1,
      unit: 'meal',
    });
    expect(valid).toBe(true);
  });
  it('returns invalid when activityType is missing', () => {
    const { valid, errors } = validateActivityForm({
      category: 'transport',
      quantity: 10,
      unit: 'km',
    });
    expect(valid).toBe(false);
    expect(errors.activityType).toBeTruthy();
  });
  it('returns invalid when unit is missing', () => {
    const { valid } = validateActivityForm({
      category: 'transport',
      activityType: 'car_petrol',
      quantity: 10,
    });
    expect(valid).toBe(false);
  });
  it('returns invalid for very large quantity', () => {
    const { valid } = validateActivityForm({
      category: 'transport',
      activityType: 'car_petrol',
      quantity: 99999,
      unit: 'km',
    });
    expect(valid).toBe(false);
  });
});
