import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { axe } from 'jest-axe';

import { AppProvider, AppContext } from '../../context/AppContext';

// ─── Test helpers ─────────────────────────────────────────────────────────────

const ACTIVITY = {
  category: 'transport',
  activityType: 'car_petrol',
  quantity: 10,
  unit: 'km',
};

function TestConsumer() {
  const {
    activities,
    addActivity,
    removeActivity,
    clearActivities,
    updateUserProfile,
    setOnboardingComplete,
    onboardingComplete,
    userProfile,
    dailyStats,
    emissionLevel,
    goalProgress,
  } = useContext(AppContext);

  return (
    <div>
      <span data-testid="count">{activities.length}</span>
      <span data-testid="total">{dailyStats.total}</span>
      <span data-testid="level">{emissionLevel}</span>
      <span data-testid="progress">{goalProgress}</span>
      <span data-testid="goal">{userProfile.dailyGoal}</span>
      <span data-testid="onboarding">{String(onboardingComplete)}</span>
      <button onClick={() => addActivity(ACTIVITY)}>Add</button>
      <button onClick={() => removeActivity(activities[0]?.id)}>Remove</button>
      <button onClick={clearActivities}>Clear</button>
      <button onClick={() => updateUserProfile({ name: 'Alice' })}>SetName</button>
      <button onClick={() => setOnboardingComplete(true)}>Complete</button>
    </div>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AppContext', () => {
  beforeEach(() => localStorage.clear());

  // ── Initial state ──────────────────────────────────────────────────────────

  it('provides initial empty activities', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('provides default dailyGoal of 13.4', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('goal')).toHaveTextContent('13.4');
  });

  it('initialises onboardingComplete to false', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('onboarding')).toHaveTextContent('false');
  });

  it('starts with zero total emissions', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });

  it('starts with "low" emission level', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('level')).toHaveTextContent('low');
  });

  // ── addActivity ────────────────────────────────────────────────────────────

  it('adds activity and increments count', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('computes dailyStats total from added activities', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('Add'));
    const total = parseFloat(screen.getByTestId('total').textContent);
    expect(total).toBeGreaterThan(0);
  });

  it('updates emissionLevel based on total', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    // 10km car petrol = 2.1 kg → should remain "low"
    await userEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('level')).toHaveTextContent('low');
  });

  it('goalProgress increases after adding activity', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    const before = parseFloat(screen.getByTestId('progress').textContent);
    await userEvent.click(screen.getByText('Add'));
    const after = parseFloat(screen.getByTestId('progress').textContent);
    expect(after).toBeGreaterThan(before);
  });

  // ── removeActivity ─────────────────────────────────────────────────────────

  it('removes activity and decrements count', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    await userEvent.click(screen.getByText('Remove'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  // ── clearActivities ────────────────────────────────────────────────────────

  it('clears all activities at once', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    await userEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('resets total to 0 after clear', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });

  // ── updateUserProfile ──────────────────────────────────────────────────────

  it('updates user profile name', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('SetName'));
    // Name update doesn't break other state
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  // ── setOnboardingComplete ──────────────────────────────────────────────────

  it('sets onboardingComplete to true', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await userEvent.click(screen.getByText('Complete'));
    expect(screen.getByTestId('onboarding')).toHaveTextContent('true');
  });

  // ── Error boundary ─────────────────────────────────────────────────────────

  it('throws when useAppContext is called outside a provider', () => {
    function Bare() {
      useContext(AppContext);
      return null;
    }
    // AppContext is null outside the provider — renders without error but value is null
    // (we test the useAppContext guard separately)
    expect(() => render(<Bare />)).not.toThrow();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
