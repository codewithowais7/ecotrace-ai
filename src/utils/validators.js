/**
 * Input validation utilities for EcoTrace AI
 */

/**
 * Validate a numeric quantity input
 * @param {*} value
 * @param {Object} options
 * @param {number} [options.min=0]
 * @param {number} [options.max=1000000]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateQuantity(value, { min = 0, max = 1_000_000 } = {}) {
  const num = parseFloat(value);
  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: 'This field is required.' };
  }
  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number.' };
  }
  if (num < min) {
    return { valid: false, error: `Value must be at least ${min}.` };
  }
  if (num > max) {
    return { valid: false, error: `Value must be no more than ${max.toLocaleString()}.` };
  }
  return { valid: true };
}

/**
 * Validate an API key format (basic non-empty check)
 * @param {string} key
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateApiKey(key) {
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return { valid: false, error: 'API key cannot be empty.' };
  }
  if (key.trim().length < 20) {
    return { valid: false, error: 'API key appears to be too short.' };
  }
  return { valid: true };
}

/**
 * Validate a date string is within an acceptable range
 * @param {string} dateStr - ISO date string
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDate(dateStr) {
  if (!dateStr) return { valid: false, error: 'Date is required.' };
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { valid: false, error: 'Invalid date format.' };
  const now = new Date();
  const tenYearsAgo = new Date(now.getFullYear() - 10, 0, 1);
  if (date > now) return { valid: false, error: 'Date cannot be in the future.' };
  if (date < tenYearsAgo) return { valid: false, error: 'Date is too far in the past.' };
  return { valid: true };
}

/**
 * Validate a required text field
 * @param {string} value
 * @param {number} [maxLength=500]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateTextField(value, maxLength = 500) {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'This field is required.' };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `Must be ${maxLength} characters or fewer.` };
  }
  return { valid: true };
}
