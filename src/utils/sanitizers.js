/**
 * Input sanitization utilities for EcoTrace AI.
 * All functions are pure and safe to call with any input type.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes user text input by stripping all HTML, trimming whitespace,
 * and enforcing a maximum character length.
 *
 * @param {string} text - Raw user input.
 * @param {number} [maxLength=500] - Maximum length of the returned string.
 * @returns {string} Sanitized, trimmed, length-capped plain text.
 */
export function sanitizeText(text, maxLength = 500) {
  if (typeof text !== 'string') return '';
  const stripped = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return stripped.trim().slice(0, maxLength);
}

/**
 * Safely parses any value into a finite number.
 * Returns 0 for invalid, NaN, Infinity, or non-numeric input.
 *
 * @param {any} value - Value to parse.
 * @returns {number} Parsed finite number, or 0.
 */
export function sanitizeNumber(value) {
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) return 0;
  return num;
}

/**
 * Sanitizes an object of form data by applying sanitizeText to string
 * values and sanitizeNumber to number values. Other types are passed through.
 *
 * @param {Object} data - Raw form data object.
 * @returns {Object} Sanitized copy of the form data.
 */
export function sanitizeFormData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, sanitizeText(value)];
      }
      if (typeof value === 'number') {
        return [key, sanitizeNumber(value)];
      }
      return [key, value];
    })
  );
}

/**
 * Sanitizes an AI API response by removing all HTML and script content,
 * and capping the output to a maximum length to prevent oversized renders.
 *
 * @param {string} text - Raw response text from the AI API.
 * @param {number} [maxLength=3000] - Maximum length of the returned string.
 * @returns {string} Sanitized plain text response.
 */
export function sanitizeApiResponse(text, maxLength = 3000) {
  if (typeof text !== 'string') return '';
  const sanitized = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return sanitized.trim().slice(0, maxLength);
}
