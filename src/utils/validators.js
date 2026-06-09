/**
 * Input validation utilities for EcoTrace AI.
 * All functions are pure and return structured result objects.
 */

/**
 * Validates a numeric input value against optional min/max bounds.
 *
 * @param {number|string} value - The raw input to validate.
 * @param {number} [min=0] - Minimum allowed value (inclusive).
 * @param {number} [max=10000] - Maximum allowed value (inclusive).
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateNumericInput(value, min = 0, max = 10000) {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: 'This field is required' };
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }
  if (num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }
  if (num > max) {
    return { valid: false, error: `Must be no more than ${max}` };
  }
  return { valid: true, error: null };
}

/**
 * Validates an activity form submission object.
 * Checks that all required fields are present and quantity is positive.
 *
 * @param {Object} formData - The form data to validate.
 * @param {string} formData.category - Emission category (e.g. 'transport').
 * @param {string} formData.activityType - Specific activity key (e.g. 'car_petrol').
 * @param {number|string} formData.quantity - Amount for the activity.
 * @param {string} formData.unit - Unit of measurement (e.g. 'km').
 * @returns {{ valid: boolean, errors: Object.<string, string> }}
 */
export function validateActivityForm(formData) {
  const errors = {};

  if (!formData.category || String(formData.category).trim() === '') {
    errors.category = 'Please select a category';
  }

  if (!formData.activityType || String(formData.activityType).trim() === '') {
    errors.activityType = 'Please select an activity type';
  }

  const quantityResult = validateNumericInput(formData.quantity, 0.001, 10000);
  if (!quantityResult.valid) {
    errors.quantity = quantityResult.error;
  }

  if (!formData.unit || String(formData.unit).trim() === '') {
    errors.unit = 'Unit is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates that a text field is non-empty and within the allowed length.
 *
 * @param {string} value - The text to validate.
 * @param {number} [maxLength=200] - Maximum allowed character length.
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateTextField(value, maxLength = 200) {
  if (!value || String(value).trim() === '') {
    return { valid: false, error: 'This field is required' };
  }
  if (String(value).length > maxLength) {
    return { valid: false, error: `Must be ${maxLength} characters or fewer` };
  }
  return { valid: true, error: null };
}
