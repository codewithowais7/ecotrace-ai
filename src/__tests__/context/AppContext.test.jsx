import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AppProvider, useAppContext } from '../../context/AppContext';

// ─── Helper: component that reads context values ──────────────────────────────

function ContextReader() {
  const {
    activities,
    onboardingComplete,
    dailyStats,
    emissionLevel,
    goalProgress,
    userProfile,
  } = useAppContext();

  return (
    <div>
      <span data-testid="activities-count">{activities.length}</span>
      <span data-testid="onboarding">{String(onboardingComplete)}</span>
      <span data-testid="total">{dailyStats.total}</span>
      <span data-testid="level">{emissionLevel}</span>
      <span data-testid="progress">{goalProgress}</span>
      <span data-testid="goal">{userProfile.dailyGoal}</span>
    </div>
  );
}

// ─── Helper: component that dispatches actions ────────────────────────────────

function ActivityAdder() {
  const { addActivity, activities } = useAppContext();
  return (
    <div>
      <span data-testid="count">{activities.length}</span>
      <button
        onClick={() =>
          addActivity({
            category: 'transport',
            activityType: 'car_petrol',
            quantity: 10,
            unit: 'km',
          })
        }
      >
        Add
      </button>
    </div>
  );
}

function OnboardingSetter() {
  const { setOnboardingComplete, onboardingComplete } = useAppContext();
  return (
    <div>
      <span data-testid="onboarding">{String(onboardingComplete)}</span>
      <button onClick={() => setOnboardingComplete(true)}>Complete</button>
    </div>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AppContext — initial state', () => {
  it('provides empty activities array by default', () => {
    render(
      <AppProvider>
        <ContextReader />
      </AppProvider>
    );
    expect(screen.getByTestId('activities-count').textContent).toBe('0');
  });

  it('sets onboardingComplete to false by default', () => {
    render(
      <AppProvider>
        <ContextReader />
      </AppProvider>
    );
    expect(screen.getByTestId('onboarding').textContent).toBe('false');
  });

  it('provides default dailyGoal of 13.4', () => {
    render(
      <AppProvider>
        <ContextReader />
      </AppProvider>
    );
    expect(screen.getByTestId('goal').textContent).toBe('13.4');
  });

  it('starts with zero total emissions', () => {
    render(
      <AppProvider>
        <ContextReader />
      </AppProvider>
    );
    expect(screen.getByTestId('total').textContent).toBe('0');
  });

  it('starts with "low" emission level', () => {
    render(
      <AppProvider>
        <ContextReader />
      </AppProvider>
    );
    expect(screen.getByTestId('level').textContent).toBe('low');
  });
});

describe('AppContext — addActivity action', () => {
  it('adds an activity and increments the count', async () => {
    render(
      <AppProvider>
        <ActivityAdder />
      </AppProvider>
    );
    expect(screen.getByTestId('count').textContent).toBe('0');

    await act(async () => {
      screen.getByRole('button', { name: /add/i }).click();
    });

    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});

describe('AppContext — setOnboardingComplete action', () => {
  it('updates onboardingComplete to true', async () => {
    render(
      <AppProvider>
        <OnboardingSetter />
      </AppProvider>
    );
    expect(screen.getByTestId('onboarding').textContent).toBe('false');

    await act(async () => {
      screen.getByRole('button', { name: /complete/i }).click();
    });

    expect(screen.getByTestId('onboarding').textContent).toBe('true');
  });
});

describe('AppContext — error boundary', () => {
  it('throws when useAppContext is called outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ContextReader />)).toThrow(
      'useAppContext must be used within an AppProvider'
    );
    spy.mockRestore();
  });
});

describe('AppContext — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <AppProvider>
        <ContextReader />
      </AppProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
