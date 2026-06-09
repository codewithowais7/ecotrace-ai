import { describe, it, expect } from 'vitest';
import { validateQuantity, validateApiKey, validateDate, validateTextField } from '../../utils/validators';

describe('validateQuantity', () => {
  it('accepts valid positive numbers', () => {
    expect(validateQuantity(10).valid).toBe(true);
    expect(validateQuantity('50.5').valid).toBe(true);
  });

  it('rejects empty values', () => {
    expect(validateQuantity('').valid).toBe(false);
    expect(validateQuantity(null).valid).toBe(false);
  });

  it('rejects non-numeric strings', () => {
    expect(validateQuantity('abc').valid).toBe(false);
  });

  it('rejects values below min', () => {
    expect(validateQuantity(-1).valid).toBe(false);
  });

  it('rejects values above max', () => {
    expect(validateQuantity(2_000_000).valid).toBe(false);
  });
});

describe('validateApiKey', () => {
  it('accepts valid API keys', () => {
    expect(validateApiKey('AIzaSyABCDEFGHIJKLMNOPQRSTU').valid).toBe(true);
  });

  it('rejects empty keys', () => {
    expect(validateApiKey('').valid).toBe(false);
    expect(validateApiKey(null).valid).toBe(false);
  });

  it('rejects very short keys', () => {
    expect(validateApiKey('short').valid).toBe(false);
  });
});

describe('validateDate', () => {
  it('accepts today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(validateDate(today).valid).toBe(true);
  });

  it('rejects future dates', () => {
    const future = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    expect(validateDate(future).valid).toBe(false);
  });

  it('rejects empty date', () => {
    expect(validateDate('').valid).toBe(false);
  });
});

describe('validateTextField', () => {
  it('accepts normal text', () => {
    expect(validateTextField('Hello world').valid).toBe(true);
  });

  it('rejects empty text', () => {
    expect(validateTextField('').valid).toBe(false);
  });

  it('rejects text exceeding maxLength', () => {
    expect(validateTextField('x'.repeat(501)).valid).toBe(false);
  });
});
