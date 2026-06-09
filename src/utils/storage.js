/**
 * @fileoverview Safe localStorage wrapper with graceful error handling for all operations.
 * @module utils/storage
 */

/**
 * Safely retrieves and JSON-parses an item from localStorage.
 * Returns the default value if the key is absent, parsing fails, or
 * localStorage is unavailable.
 *
 * @param {string} key - The localStorage key to read.
 * @param {*} [defaultValue=null] - Value to return when the key is not found.
 * @returns {*} The parsed value, or `defaultValue`.
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Safely serialises a value to JSON and writes it to localStorage.
 * Silently swaps to a no-op if localStorage is unavailable or quota is exceeded.
 *
 * @param {string} key - The localStorage key to write.
 * @param {*} value - Any JSON-serialisable value.
 * @returns {boolean} `true` on success, `false` on failure.
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely removes a single item from localStorage.
 *
 * @param {string} key - The localStorage key to remove.
 * @returns {void}
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage unavailable — silently ignore
  }
}

/**
 * Clears all entries from localStorage.
 * Use with care — this removes all keys, not just EcoTrace ones.
 *
 * @returns {void}
 */
export function clearStorage() {
  try {
    localStorage.clear();
  } catch {
    // Storage unavailable — silently ignore
  }
}
