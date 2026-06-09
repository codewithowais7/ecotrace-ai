import { describe, it, expect, vi, afterEach } from 'vitest';
import { checkRateLimit, validateEnvVar, checkRequiredEnvVars } from '../../utils/security';

describe('checkRateLimit', () => {
  afterEach(() => vi.restoreAllMocks());

  it('allows the first call for a new key', () => {
    const store = new Map();
    expect(checkRateLimit(store, 'gemini', 5000)).toBe(true);
  });

  it('records the timestamp of an allowed call', () => {
    const store = new Map();
    checkRateLimit(store, 'gemini', 5000);
    expect(store.has('gemini')).toBe(true);
    expect(typeof store.get('gemini')).toBe('number');
  });

  it('blocks a second call within the rate-limit window', () => {
    const store = new Map();
    checkRateLimit(store, 'gemini', 5000);
    expect(checkRateLimit(store, 'gemini', 5000)).toBe(false);
  });

  it('allows a call after the rate-limit window has passed', () => {
    const store = new Map();
    // Seed a timestamp 10 seconds in the past
    store.set('gemini', Date.now() - 10_000);
    expect(checkRateLimit(store, 'gemini', 5000)).toBe(true);
  });

  it('blocks a call exactly at the boundary (within window)', () => {
    const store = new Map();
    store.set('gemini', Date.now() - 4999);
    expect(checkRateLimit(store, 'gemini', 5000)).toBe(false);
  });

  it('allows calls for independent keys at the same time', () => {
    const store = new Map();
    expect(checkRateLimit(store, 'key_a', 5000)).toBe(true);
    expect(checkRateLimit(store, 'key_b', 5000)).toBe(true);
  });
});

describe('validateEnvVar', () => {
  const originalEnv = { ...import.meta.env };

  afterEach(() => {
    // Restore env overrides
    Object.keys(import.meta.env).forEach((k) => delete import.meta.env[k]);
    Object.assign(import.meta.env, originalEnv);
    vi.restoreAllMocks();
  });

  it('returns true when the variable is present and non-empty', () => {
    import.meta.env.VITE_TEST_VAR = 'some-value';
    expect(validateEnvVar('VITE_TEST_VAR')).toBe(true);
  });

  it('returns false and warns when the variable is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete import.meta.env.VITE_MISSING_VAR;
    expect(validateEnvVar('VITE_MISSING_VAR')).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('VITE_MISSING_VAR'));
  });

  it('returns false and warns when the variable is an empty string', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    import.meta.env.VITE_EMPTY_VAR = '';
    expect(validateEnvVar('VITE_EMPTY_VAR')).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('returns false and warns when the variable is a whitespace-only string', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    import.meta.env.VITE_BLANK_VAR = '   ';
    expect(validateEnvVar('VITE_BLANK_VAR')).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('checkRequiredEnvVars', () => {
  const originalEnv = { ...import.meta.env };

  afterEach(() => {
    Object.keys(import.meta.env).forEach((k) => delete import.meta.env[k]);
    Object.assign(import.meta.env, originalEnv);
    vi.restoreAllMocks();
  });

  it('returns true when VITE_GEMINI_API_KEY is present', () => {
    import.meta.env.VITE_GEMINI_API_KEY = 'valid-key';
    const result = checkRequiredEnvVars();
    expect(result).toBe(true);
  });

  it('returns false and warns when VITE_GEMINI_API_KEY is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete import.meta.env.VITE_GEMINI_API_KEY;
    const result = checkRequiredEnvVars();
    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('VITE_GEMINI_API_KEY'));
  });
});
