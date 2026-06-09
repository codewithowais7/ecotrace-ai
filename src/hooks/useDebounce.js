/**
 * Custom hook that debounces a value, delaying updates until the
 * specified number of milliseconds have elapsed without a new value.
 * Useful for deferring expensive operations (e.g. API calls, filtering)
 * until the user pauses typing.
 */

import { useState, useEffect } from 'react';

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
export function useDebounce(value, delay = 300) {
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
