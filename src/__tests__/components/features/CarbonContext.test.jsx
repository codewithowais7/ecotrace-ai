import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CarbonContext from '../../../components/features/CarbonContext';

describe('CarbonContext component', () => {
  it('renders the "What This Means" heading', () => {
    render(<CarbonContext totalKgCO2e={10} level="medium" />);
    expect(screen.getByText(/what this means/i)).toBeInTheDocument();
  });
  it('renders equivalency items for positive emissions', () => {
    render(<CarbonContext totalKgCO2e={10} level="medium" />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });
  it('shows motivational message for low level', () => {
    render(<CarbonContext totalKgCO2e={2} level="low" />);
    expect(screen.getByText(/great job/i)).toBeInTheDocument();
  });
  it('shows context message for high level', () => {
    render(<CarbonContext totalKgCO2e={20} level="high" />);
    expect(screen.getByText(/above average/i)).toBeInTheDocument();
  });
  it('renders without throwing for all four levels', () => {
    ['low', 'medium', 'high', 'very-high'].forEach((level) => {
      expect(() =>
        render(<CarbonContext totalKgCO2e={10} level={level} />)
      ).not.toThrow();
    });
  });
  it('shows India and global averages as reference', () => {
    render(<CarbonContext totalKgCO2e={5} level="low" />);
    expect(screen.getByText(/india avg/i)).toBeInTheDocument();
  });
});
