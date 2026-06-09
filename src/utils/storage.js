/**
 * localStorage utilities with error handling
 */

const PREFIX = 'ecotrace_';

/**
 * Get a value from localStorage (parsed from JSON)
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Set a value in localStorage (serialized as JSON)
 * @param {string} key
 * @param {*} value
 * @returns {boolean} success
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove an item from localStorage
 * @param {string} key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

/**
 * Clear all EcoTrace entries from localStorage
 */
export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const test = '__ecotrace_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
