import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from '../../hooks/useAccessibility';

describe('useAccessibility hook', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates sr-announcer element on first announcement', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.announceToScreenReader('Hello world');
    });

    const announcer = document.getElementById('sr-announcer');
    expect(announcer).not.toBeNull();
    expect(announcer.getAttribute('aria-live')).toBe('polite');
    expect(announcer.getAttribute('aria-atomic')).toBe('true');
  });

  it('updates the announcement text after timeout', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.announceToScreenReader('Hello world');
    });

    const announcer = document.getElementById('sr-announcer');
    expect(announcer.textContent).toBe('');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(announcer.textContent).toBe('Hello world');
  });

  it('reuses existing sr-announcer element', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.announceToScreenReader('First message');
    });

    const firstAnnouncer = document.getElementById('sr-announcer');

    act(() => {
      result.current.announceToScreenReader('Second message', 'assertive');
    });

    const secondAnnouncer = document.getElementById('sr-announcer');
    expect(firstAnnouncer).toBe(secondAnnouncer);
    expect(secondAnnouncer.getAttribute('aria-live')).toBe('assertive');
  });
});
