import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeNumber,
  sanitizeFormData,
  sanitizeApiResponse,
} from '../../utils/sanitizers';

// ─── sanitizeText ─────────────────────────────────────────────────────────────

describe('sanitizeText', () => {
  it('strips script tags', () => {
    const result = sanitizeText('<script>alert("xss")</script>hello');
    expect(result).not.toContain('<script>');
    expect(result).toContain('hello');
  });

  it('strips HTML tags', () => {
    expect(sanitizeText('<b>bold</b>')).not.toContain('<b>');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('enforces max length', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeText(long, 500).length).toBeLessThanOrEqual(500);
  });

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('handles null gracefully without throwing', () => {
    expect(() => sanitizeText(null)).not.toThrow();
    expect(sanitizeText(null)).toBe('');
  });

  it('handles undefined gracefully without throwing', () => {
    expect(() => sanitizeText(undefined)).not.toThrow();
    expect(sanitizeText(undefined)).toBe('');
  });

  it('handles numeric input gracefully', () => {
    expect(() => sanitizeText(123)).not.toThrow();
  });

  it('strips inline event handlers', () => {
    const result = sanitizeText('<img src="x" onerror="alert(1)" />');
    expect(result).not.toContain('onerror');
  });

  it('returns plain text for clean input', () => {
    expect(sanitizeText('Clean text')).toBe('Clean text');
  });
});

// ─── sanitizeNumber ───────────────────────────────────────────────────────────

describe('sanitizeNumber', () => {
  it('returns parsed number for valid numeric string', () => {
    expect(sanitizeNumber('5.5')).toBe(5.5);
  });

  it('returns parsed number for integer', () => {
    expect(sanitizeNumber(10)).toBe(10);
  });

  it('returns 0 for NaN string', () => {
    expect(sanitizeNumber('abc')).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(sanitizeNumber(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(sanitizeNumber(undefined)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(sanitizeNumber(-5)).toBe(-5);
  });

  it('returns 0 for Infinity', () => {
    expect(sanitizeNumber(Infinity)).toBe(0);
  });

  it('returns 0 for -Infinity', () => {
    expect(sanitizeNumber(-Infinity)).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(sanitizeNumber('')).toBe(0);
  });
});

// ─── sanitizeFormData ─────────────────────────────────────────────────────────

describe('sanitizeFormData', () => {
  it('sanitizes string values within the object', () => {
    const result = sanitizeFormData({ name: '<b>Alice</b>' });
    expect(result.name).not.toContain('<b>');
  });

  it('sanitizes number values', () => {
    const result = sanitizeFormData({ quantity: NaN });
    expect(result.quantity).toBe(0);
  });

  it('passes through boolean values unchanged', () => {
    const result = sanitizeFormData({ active: true });
    expect(result.active).toBe(true);
  });

  it('returns empty object for non-object input', () => {
    expect(sanitizeFormData(null)).toEqual({});
    expect(sanitizeFormData('string')).toEqual({});
    expect(sanitizeFormData([])).toEqual({});
  });
});

// ─── sanitizeApiResponse ──────────────────────────────────────────────────────

describe('sanitizeApiResponse', () => {
  it('strips HTML from AI response', () => {
    const result = sanitizeApiResponse('<script>bad()</script>Good tip');
    expect(result).not.toContain('<script>');
    expect(result).toContain('Good tip');
  });

  it('enforces max length on API response', () => {
    const long = 'x'.repeat(4000);
    expect(sanitizeApiResponse(long, 3000).length).toBeLessThanOrEqual(3000);
  });

  it('handles non-string input without throwing', () => {
    expect(() => sanitizeApiResponse(null)).not.toThrow();
    expect(sanitizeApiResponse(null)).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeApiResponse('')).toBe('');
  });
});
