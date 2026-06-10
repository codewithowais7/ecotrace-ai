import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DailySummaryCard from '../../../components/features/DailySummaryCard';

// DailySummaryCard is a pure presentational component — it receives all data
// as props rather than reading from context, so no AppProvider wrapper is needed.
const defaultProps = {
  dailyStats: {
    total: 5,
    breakdown: { transport: 3, food: 2, energy: 0, shopping: 0 },
  },
  emissionLevel: 'low',
  goalProgress: 50,
  userProfile: { name: 'Test User', location: 'india', dailyGoal: 10 },
};

describe('DailySummaryCard component', () => {
  it('renders without crashing', () => {
    expect(() => render(<DailySummaryCard {...defaultProps} />)).not.toThrow();
  });
  it('renders a heading for today footprint', () => {
    render(<DailySummaryCard {...defaultProps} />);
    expect(screen.getByText(/today|footprint|summary/i)).toBeInTheDocument();
  });
  it('renders a progress bar with accessibility attributes', () => {
    render(<DailySummaryCard {...defaultProps} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow');
    expect(progressbar).toHaveAttribute('aria-valuemin');
    expect(progressbar).toHaveAttribute('aria-valuemax');
  });
  it('shows goal reference text', () => {
    render(<DailySummaryCard {...defaultProps} />);
    expect(screen.getAllByText(/goal/i)[0]).toBeInTheDocument();
  });
});

