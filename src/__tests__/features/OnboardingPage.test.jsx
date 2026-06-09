import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPage from '../../features/onboarding/OnboardingPage';
import { AppProvider } from '../../context/AppContext';

describe('OnboardingPage component', () => {
  it('renders Step 1 and progresses through all 3 steps', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <OnboardingPage />
        </AppProvider>
      </MemoryRouter>
    );

    // Step 1: Welcome
    expect(screen.getByRole('heading', { name: 'Welcome to EcoTrace AI' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/)).toBeInTheDocument();

    // Fill name and click next
    await userEvent.type(screen.getByLabelText(/Your Name/), 'Priya');
    await userEvent.click(screen.getByRole('button', { name: 'Next →' }));

    // Step 2: Location & Transport
    expect(screen.getByLabelText(/Your Location/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Mode of Transport/)).toBeInTheDocument();

    // Click next (defaults are set)
    await userEvent.click(screen.getByRole('button', { name: 'Next →' }));

    // Step 3: Set Your Goal
    expect(screen.getByLabelText(/Daily Carbon Goal/)).toBeInTheDocument();

    // Click Start Tracking
    await userEvent.click(screen.getByRole('button', { name: '🌍 Start Tracking' }));
  });

  it('shows error if name is empty on Step 1', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <OnboardingPage />
        </AppProvider>
      </MemoryRouter>
    );

    // Click next without filling name
    await userEvent.click(screen.getByRole('button', { name: 'Next →' }));

    expect(screen.getByText(/This field is required/)).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <AppProvider>
          <OnboardingPage />
        </AppProvider>
      </MemoryRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
