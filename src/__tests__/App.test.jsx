import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import App from '../App';

describe('App component', () => {
  it('renders and redirects to onboarding by default', async () => {
    render(<App />);

    // Wait for the lazy component to load
    await waitFor(
      () => {
        expect(screen.getByText('Welcome to EcoTrace AI')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('is accessible', async () => {
    const { container } = render(<App />);

    await waitFor(
      () => {
        expect(screen.getByText('Welcome to EcoTrace AI')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
