/**
 * Security utilities for EcoTrace AI
 */

/**
 * Rate limiter — tracks calls per key and returns false if limit exceeded
 * @param {string} key - Unique identifier for the rate-limited action
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} true if call is allowed
 */
const rateLimitStore = new Map();

export function checkRateLimit(key, maxCalls = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { calls: [], blocked: false };

  // Prune old calls outside window
  record.calls = record.calls.filter((t) => now - t < windowMs);

  if (record.calls.length >= maxCalls) {
    rateLimitStore.set(key, record);
    return false;
  }

  record.calls.push(now);
  rateLimitStore.set(key, record);
  return true;
}

/**
 * Reset rate limit state for a key (useful in tests)
 * @param {string} key
 */
export function resetRateLimit(key) {
  rateLimitStore.delete(key);
}

/**
 * Mask sensitive data for logging (shows only last 4 chars)
 * @param {string} value
 * @returns {string}
 */
export function maskSensitive(value) {
  if (!value || value.length <= 4) return '****';
  return '*'.repeat(value.length - 4) + value.slice(-4);
}

/**
 * Generate a simple unique ID (not cryptographically secure — use for UI keys only)
 * @returns {string}
 */
export function generateId() {
  return `ecotrace_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
