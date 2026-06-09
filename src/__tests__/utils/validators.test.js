import { describe, it, expect } from 'vitest';
import {
  validateNumericInput,
  validateActivityForm,
  validateTextField,
} from '../../utils/validators';

// ─── validateNumericInput ─────────────────────────────────────────────────────

describe('validateNumericInput', () => {
  it('accepts valid number within range', () => {
    expect(validateNumericInput(5, 0, 100).valid).toBe(true);
  });

  it('rejects empty string', () => {
    const r = validateNumericInput('', 0, 100);
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('rejects NaN', () => {
    expect(validateNumericInput('abc', 0, 100).valid).toBe(false);
  });

  it('rejects below minimum', () => {
    expect(validateNumericInput(-1, 0, 100).valid).toBe(false);
  });

  it('rejects above maximum', () => {
    expect(validateNumericInput(101, 0, 100).valid).toBe(false);
  });

  it('accepts boundary values', () => {
    expect(validateNumericInput(0, 0, 100).valid).toBe(true);
    expect(validateNumericInput(100, 0, 100).valid).toBe(true);
  });

  it('rejects null', () => {
    expect(validateNumericInput(null, 0, 100).valid).toBe(false);
  });

  it('rejects undefined', () => {
    expect(validateNumericInput(undefined, 0, 100).valid).toBe(false);
  });

  it('accepts numeric string that parses correctly', () => {
    expect(validateNumericInput('42', 0, 100).valid).toBe(true);
  });

  it('returns null error on success', () => {
    expect(validateNumericInput(50, 0, 100).error).toBeNull();
  });

  it('provides descriptive error when below min', () => {
    const r = validateNumericInput(-5, 0, 100);
    expect(r.error).toMatch(/0/);
  });
});

// ─── validateActivityForm ─────────────────────────────────────────────────────

describe('validateActivityForm', () => {
  const valid = { category: 'transport', activityType: 'car_petrol', quantity: 10, unit: 'km' };

  it('returns valid for complete form data', () => {
    expect(validateActivityForm(valid).valid).toBe(true);
  });

  it('returns invalid when category missing', () => {
    const { valid: ok, errors } = validateActivityForm({ ...valid, category: '' });
    expect(ok).toBe(false);
    expect(errors.category).toBeTruthy();
  });

  it('returns invalid when quantity is zero', () => {
    expect(validateActivityForm({ ...valid, quantity: 0 }).valid).toBe(false);
  });

  it('returns invalid when activityType missing', () => {
    const { valid: ok, errors } = validateActivityForm({ ...valid, activityType: '' });
    expect(ok).toBe(false);
    expect(errors.activityType).toBeTruthy();
  });

  it('returns invalid when unit missing', () => {
    expect(validateActivityForm({ ...valid, unit: '' }).valid).toBe(false);
  });

  it('collects multiple errors simultaneously', () => {
    const r = validateActivityForm({ category: '', activityType: '', quantity: -1, unit: '' });
    expect(Object.keys(r.errors).length).toBeGreaterThan(1);
  });

  it('rejects negative quantity', () => {
    expect(validateActivityForm({ ...valid, quantity: -5 }).valid).toBe(false);
  });
});

// ─── validateTextField ────────────────────────────────────────────────────────

describe('validateTextField', () => {
  it('accepts normal text', () => {
    expect(validateTextField('Hello world').valid).toBe(true);
  });

  it('rejects empty string', () => {
    const r = validateTextField('');
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('rejects whitespace-only string', () => {
    expect(validateTextField('   ').valid).toBe(false);
  });

  it('rejects text exceeding maxLength', () => {
    const r = validateTextField('x'.repeat(201), 200);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/200/);
  });

  it('accepts text at exactly maxLength', () => {
    expect(validateTextField('x'.repeat(200), 200).valid).toBe(true);
  });

  it('returns null error on success', () => {
    expect(validateTextField('hello').error).toBeNull();
  });
});
