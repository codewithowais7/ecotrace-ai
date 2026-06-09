import { describe, it, expect } from 'vitest';
import {
  validateNumericInput,
  validateActivityForm,
  validateTextField,
} from '../../utils/validators';

// ─── validateNumericInput ───────────────────────────────────────────────────

describe('validateNumericInput', () => {
  it('accepts a valid positive number', () => {
    expect(validateNumericInput(10).valid).toBe(true);
    expect(validateNumericInput('50.5').valid).toBe(true);
  });

  it('rejects empty string', () => {
    const r = validateNumericInput('');
    expect(r.valid).toBe(false);
    expect(r.error).toBe('This field is required');
  });

  it('rejects null', () => {
    expect(validateNumericInput(null).valid).toBe(false);
  });

  it('rejects undefined', () => {
    expect(validateNumericInput(undefined).valid).toBe(false);
  });

  it('rejects non-numeric string', () => {
    const r = validateNumericInput('abc');
    expect(r.valid).toBe(false);
    expect(r.error).toBe('Must be a valid number');
  });

  it('rejects value below min', () => {
    const r = validateNumericInput(-1, 0, 100);
    expect(r.valid).toBe(false);
    expect(r.error).toBe('Must be at least 0');
  });

  it('rejects value above max', () => {
    const r = validateNumericInput(10001, 0, 10000);
    expect(r.valid).toBe(false);
    expect(r.error).toBe('Must be no more than 10000');
  });

  it('returns null error on success', () => {
    expect(validateNumericInput(5, 0, 10).error).toBeNull();
  });
});

// ─── validateActivityForm ───────────────────────────────────────────────────

describe('validateActivityForm', () => {
  const validForm = {
    category: 'transport',
    activityType: 'car_petrol',
    quantity: 10,
    unit: 'km',
  };

  it('accepts a fully valid form', () => {
    const r = validateActivityForm(validForm);
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual({});
  });

  it('rejects missing category', () => {
    const r = validateActivityForm({ ...validForm, category: '' });
    expect(r.valid).toBe(false);
    expect(r.errors.category).toBeTruthy();
  });

  it('rejects missing activityType', () => {
    const r = validateActivityForm({ ...validForm, activityType: '' });
    expect(r.valid).toBe(false);
    expect(r.errors.activityType).toBeTruthy();
  });

  it('rejects zero quantity', () => {
    const r = validateActivityForm({ ...validForm, quantity: 0 });
    expect(r.valid).toBe(false);
    expect(r.errors.quantity).toBeTruthy();
  });

  it('rejects missing unit', () => {
    const r = validateActivityForm({ ...validForm, unit: '' });
    expect(r.valid).toBe(false);
    expect(r.errors.unit).toBeTruthy();
  });

  it('collects multiple errors simultaneously', () => {
    const r = validateActivityForm({ category: '', activityType: '', quantity: -1, unit: '' });
    expect(Object.keys(r.errors).length).toBeGreaterThan(1);
  });
});

// ─── validateTextField ──────────────────────────────────────────────────────

describe('validateTextField', () => {
  it('accepts normal text', () => {
    expect(validateTextField('Hello world').valid).toBe(true);
  });

  it('rejects empty string', () => {
    const r = validateTextField('');
    expect(r.valid).toBe(false);
    expect(r.error).toBe('This field is required');
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
});
