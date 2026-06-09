import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce hook', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('updates the value only after the delay', () => {
    vi.useFakeTimers();
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebounce(value, 300));

    expect(result.current).toBe('hello');

    // Change value
    value = 'world';
    rerender();

    // Value should still be old
    expect(result.current).toBe('hello');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now it should be updated
    expect(result.current).toBe('world');
    vi.useRealTimers();
  });

  it('resets the timer if value changes again before delay finishes', () => {
    vi.useFakeTimers();
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebounce(value, 300));

    value = 'world';
    rerender();

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('hello');

    value = 'universe';
    rerender();

    act(() => {
      vi.advanceTimersByTime(150); // total 300 from first change, but only 150 from second
    });
    expect(result.current).toBe('hello'); // still hello!

    act(() => {
      vi.advanceTimersByTime(150); // completes the 300ms for second change
    });
    expect(result.current).toBe('universe');
    vi.useRealTimers();
  });
});
