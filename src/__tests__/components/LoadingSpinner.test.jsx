import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

describe('LoadingSpinner component', () => {
  it('renders a status role element', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('shows the custom message text', () => {
    render(<LoadingSpinner message="Calculating your footprint" size="md" />);
    expect(screen.getAllByText('Calculating your footprint')[0]).toBeInTheDocument();
  });
  it('has aria-live="polite" for non-urgent announcements', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
  it('renders sm size without error', () => {
    expect(() => render(<LoadingSpinner size="sm" />)).not.toThrow();
  });
  it('renders lg size without error', () => {
    expect(() => render(<LoadingSpinner size="lg" />)).not.toThrow();
  });
});

