import '@testing-library/jest-dom';
import { expect, beforeEach } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// ---------------------------------------------------------------------------
// localStorage polyfill — jsdom does not provide a working implementation
// ---------------------------------------------------------------------------
const makeLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
};

Object.defineProperty(window, 'localStorage', {
  value: makeLocalStorageMock(),
  writable: true,
});

// Reset localStorage between every test to prevent state bleed
beforeEach(() => {
  window.localStorage.clear();
});
