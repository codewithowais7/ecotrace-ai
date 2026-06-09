/* global DOMException */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
} from '../../utils/storage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Forces localStorage.getItem to throw on the next call */
function makeGetItemThrow() {
  vi.spyOn(localStorage, 'getItem').mockImplementationOnce(() => {
    throw new DOMException('QuotaExceededError');
  });
}

function makeSetItemThrow() {
  vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
    throw new DOMException('QuotaExceededError');
  });
}

function makeRemoveItemThrow() {
  vi.spyOn(localStorage, 'removeItem').mockImplementationOnce(() => {
    throw new DOMException('SecurityError');
  });
}

function makeClearThrow() {
  vi.spyOn(localStorage, 'clear').mockImplementationOnce(() => {
    throw new DOMException('SecurityError');
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('getStorageItem', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('returns defaultValue when key is absent', () => {
    expect(getStorageItem('nonexistent', 'fallback')).toBe('fallback');
  });

  it('returns null as default when no defaultValue provided and key is absent', () => {
    expect(getStorageItem('nonexistent')).toBeNull();
  });

  it('returns parsed value for an existing key', () => {
    localStorage.setItem('test_key', JSON.stringify({ a: 1 }));
    expect(getStorageItem('test_key')).toEqual({ a: 1 });
  });

  it('returns parsed primitive string value', () => {
    localStorage.setItem('str_key', JSON.stringify('hello'));
    expect(getStorageItem('str_key')).toBe('hello');
  });

  it('returns parsed numeric value', () => {
    localStorage.setItem('num_key', JSON.stringify(42));
    expect(getStorageItem('num_key')).toBe(42);
  });

  it('returns parsed boolean false', () => {
    localStorage.setItem('bool_key', JSON.stringify(false));
    expect(getStorageItem('bool_key')).toBe(false);
  });

  it('returns defaultValue when stored value is corrupted JSON', () => {
    localStorage.setItem('bad_key', 'not-valid-json{{{');
    expect(getStorageItem('bad_key', [])).toEqual([]);
  });

  it('returns defaultValue when localStorage.getItem throws', () => {
    makeGetItemThrow();
    expect(getStorageItem('any_key', 'safe')).toBe('safe');
  });
});

describe('setStorageItem', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('stores the value and returns true on success', () => {
    const result = setStorageItem('key1', { data: 'value' });
    expect(result).toBe(true);
    expect(JSON.parse(localStorage.getItem('key1'))).toEqual({ data: 'value' });
  });

  it('stores an array correctly', () => {
    const result = setStorageItem('arr_key', [1, 2, 3]);
    expect(result).toBe(true);
    expect(JSON.parse(localStorage.getItem('arr_key'))).toEqual([1, 2, 3]);
  });

  it('stores a boolean false correctly', () => {
    setStorageItem('bool_key', false);
    expect(JSON.parse(localStorage.getItem('bool_key'))).toBe(false);
  });

  it('stores a number correctly', () => {
    setStorageItem('num_key', 3.14);
    expect(JSON.parse(localStorage.getItem('num_key'))).toBe(3.14);
  });

  it('returns false when localStorage.setItem throws', () => {
    makeSetItemThrow();
    const result = setStorageItem('key_throw', { huge: 'object' });
    expect(result).toBe(false);
  });
});

describe('removeStorageItem', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('removes an existing key from localStorage', () => {
    localStorage.setItem('remove_me', 'value');
    removeStorageItem('remove_me');
    expect(localStorage.getItem('remove_me')).toBeNull();
  });

  it('does not throw when the key does not exist', () => {
    expect(() => removeStorageItem('ghost_key')).not.toThrow();
  });

  it('silently swallows errors when localStorage.removeItem throws', () => {
    makeRemoveItemThrow();
    expect(() => removeStorageItem('any_key')).not.toThrow();
  });
});

describe('clearStorage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('clears all items from localStorage', () => {
    localStorage.setItem('k1', 'v1');
    localStorage.setItem('k2', 'v2');
    clearStorage();
    expect(localStorage.length).toBe(0);
  });

  it('does not throw when localStorage is already empty', () => {
    expect(() => clearStorage()).not.toThrow();
  });

  it('silently swallows errors when localStorage.clear throws', () => {
    makeClearThrow();
    expect(() => clearStorage()).not.toThrow();
  });
});
