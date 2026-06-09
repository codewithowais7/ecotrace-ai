/**
 * @fileoverview Custom hook that debounces a value to defer expensive operations.
 * @module hooks/useDebounce
 */

import { useState, useEffect } from 'react';
import { APP_CONSTANTS } from '../constants/categories';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. The timer resets on every new value.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} [delay=300] - Debounce delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 400);
 * useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebounce(value, delay = APP_CONSTANTS.DEBOUNCE_DELAY_MS) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the pending update if value or delay changes before it fires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
