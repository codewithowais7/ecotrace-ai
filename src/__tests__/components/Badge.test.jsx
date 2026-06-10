import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../../components/ui/Badge';

describe('Badge component', () => {
  it('renders the emission level label text', () => {
    render(<Badge level="low" value="2.5 kg CO₂e" />);
    expect(screen.getByText(/low/i)).toBeInTheDocument();
  });
  it('renders the value prop when provided', () => {
    render(<Badge level="medium" value="10 kg CO₂e" />);
    expect(screen.getByText(/10 kg CO₂e/i)).toBeInTheDocument();
  });
  it('has role="status" for assistive technology', () => {
    render(<Badge level="high" value="20 kg" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('has an aria-label that includes the level name', () => {
    render(<Badge level="low" value="2 kg" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label');
    expect(badge.getAttribute('aria-label').toLowerCase()).toContain('low');
  });
  it('renders without throwing for all four valid levels', () => {
    ['low', 'medium', 'high', 'very-high'].forEach((level) => {
      expect(() => render(<Badge level={level} value="5 kg" />)).not.toThrow();
    });
  });
});
