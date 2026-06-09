import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import AppContext from '../../context/AppContext';

// Mock context values
const mockAddActivity = vi.fn();
const mockRemoveActivity = vi.fn();
const mockActivities = [];
const mockDailyStats = { total: 0, breakdown: {} };

const wrapper = ({ children }) => (
  <AppContext.Provider
    value={{
      addActivity: mockAddActivity,
      removeActivity: mockRemoveActivity,
      activities: mockActivities,
      dailyStats: mockDailyStats,
      emissionLevel: 'low',
      goalProgress: 0,
    }}
  >
    {children}
  </AppContext.Provider>
);

describe('useCalculator hook', () => {
  it('returns context values', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });
    expect(result.current.activities).toBe(mockActivities);
    expect(result.current.dailyStats).toBe(mockDailyStats);
    expect(result.current.emissionLevel).toBe('low');
  });

  it('validates activity and returns errors on invalid input', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    let res;
    act(() => {
      res = result.current.logActivity({
        category: '',
        activityType: '',
        quantity: -5,
        unit: 'km',
      });
    });

    expect(res.success).toBe(false);
    expect(res.errors.category).toBeDefined();
    expect(res.errors.quantity).toBeDefined();
    expect(mockAddActivity).not.toHaveBeenCalled();
  });

  it('sanitizes, validates and logs activity on valid input', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    let res;
    act(() => {
      res = result.current.logActivity({
        category: 'transport',
        activityType: 'car_petrol',
        quantity: 10,
        unit: 'km',
      });
    });

    expect(res.success).toBe(true);
    expect(res.activity.emissions).toBeCloseTo(2.1);
    expect(mockAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'transport',
        activityType: 'car_petrol',
        quantity: 10,
        unit: 'km',
      })
    );
  });
});
