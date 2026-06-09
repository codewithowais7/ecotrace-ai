import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AppProvider, useAppContext } from '../../context/AppContext';

// Helper component to read context
function ContextConsumer() {
  const { state } = useAppContext();
  return <div data-testid="emissions-count">{state.emissions.length}</div>;
}

describe('AppContext', () => {
  it('provides initial empty emissions state', () => {
    render(
      <AppProvider>
        <ContextConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('emissions-count').textContent).toBe('0');
  });

  it('throws when useAppContext is used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ContextConsumer />)).toThrow();
    spy.mockRestore();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AppProvider>
        <ContextConsumer />
      </AppProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
