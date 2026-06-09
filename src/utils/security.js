/**
 * @fileoverview Security utilities providing rate limiting and environment variable validation.
 * @module utils/security
 */

/**
 * Checks whether a keyed action is permitted under a minimum-interval rate limit.
 * The provided `store` Map is mutated to record the timestamp of each allowed call.
 *
 * @param {Map<string, number>} store - Shared Map that holds the last-allowed timestamp per key.
 * @param {string} key - Identifier for the action being rate-limited (e.g. 'gemini_api').
 * @param {number} limitMs - Minimum milliseconds that must elapse between allowed calls.
 * @returns {boolean} `true` if the call is allowed (and the timestamp is recorded),
 *                    `false` if the call is within the rate-limit window.
 */
export function checkRateLimit(store, key, limitMs) {
  const now = Date.now();
  const lastCall = store.get(key);

  if (lastCall !== undefined && now - lastCall < limitMs) {
    return false;
  }

  store.set(key, now);
  return true;
}

/**
 * Validates that a Vite environment variable exists and is non-empty.
 * Emits a console warning (never the value itself) when the variable is missing.
 *
 * @param {string} varName - The environment variable name (e.g. 'VITE_GEMINI_API_KEY').
 * @returns {boolean} `true` if the variable is present and non-empty, `false` otherwise.
 */
export function validateEnvVar(varName) {
  const value = import.meta.env[varName];
  if (!value || String(value).trim() === '') {
    // eslint-disable-next-line no-console
    console.warn(`Missing env var: ${varName}`);
    return false;
  }
  return true;
}

/**
 * Checks if all required environment variables are configured.
 * Logs warnings for missing vars — never exposes values.
 *
 * @returns {boolean} `true` if all required vars are configured, `false` otherwise.
 */
export function checkRequiredEnvVars() {
  const required = ['VITE_GEMINI_API_KEY'];
  const missing = required.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `EcoTrace AI: Missing environment variables: ${missing.join(', ')}. Check .env.example for setup instructions.`
    );
  }
  return missing.length === 0;
}
