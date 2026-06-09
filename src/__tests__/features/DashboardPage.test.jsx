import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import DashboardPage from '../../features/dashboard/DashboardPage';
import AppContext from '../../context/AppContext';

describe('DashboardPage component', () => {
  const mockRemoveActivity = vi.fn();
  const mockAnnounce = vi.fn();

  const mockContext = {
    userProfile: { name: 'Priya', location: 'india', dailyGoal: 10 },
    emissionLevel: 'low',
    goalProgress: 50,
    dailyStats: {
      total: 5,
      breakdown: { transport: 3, food: 2, energy: 0, shopping: 0 },
    },
    activities: [
      {
        id: '1',
        category: 'transport',
        activityType: 'car_petrol',
        quantity: 10,
        unit: 'km',
        emissions: 2.1,
      },
      {
        id: '2',
        category: 'food',
        activityType: 'meat_meal',
        quantity: 1,
        unit: 'kg',
        emissions: 2.9,
      },
    ],
    removeActivity: mockRemoveActivity,
  };

  beforeEach(() => {
    mockRemoveActivity.mockClear();
    mockAnnounce.mockClear();
  });

  it('renders today footprint summary and goal progress', () => {
    render(
      <AppContext.Provider
        value={{
          ...mockContext,
          activities: [], // Start with empty list to check empty state
        }}
      >
        <DashboardPage />
      </AppContext.Provider>
    );

    expect(screen.getByText("Today's Footprint")).toBeInTheDocument();
    expect(screen.getByText('5.00 kg CO₂e')).toBeInTheDocument();
    expect(screen.getByText('Goal: 10 kg CO₂e · 50% used')).toBeInTheDocument();
    expect(
      screen.getByText('No activities logged yet. Add your first one above.')
    ).toBeInTheDocument();
  });

  it('renders logged activities list and allows removing activity', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <DashboardPage />
      </AppContext.Provider>
    );

    expect(screen.getByText('car petrol')).toBeInTheDocument();
    expect(screen.getByText('meat meal')).toBeInTheDocument();

    // Remove second activity
    const removeButtons = screen.getAllByRole('button', { name: /Remove/ });
    expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[1]);

    expect(mockRemoveActivity).toHaveBeenCalledWith('2');
  });

  it('is accessible', async () => {
    const { container } = render(
      <AppContext.Provider value={mockContext}>
        <DashboardPage />
      </AppContext.Provider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
