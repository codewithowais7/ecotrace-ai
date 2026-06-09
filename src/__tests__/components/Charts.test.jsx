import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import EmissionsBarChart from '../../components/charts/EmissionsBarChart';
import EmissionsPieChart from '../../components/charts/EmissionsPieChart';

const DATA = [
  { category: 'Transport', value: 10.5, color: '#ff0000' },
  { category: 'Food', value: 5.2, color: '#00ff00' },
];

describe('Chart components', () => {
  describe('EmissionsBarChart', () => {
    it('renders heading and the mock chart components', () => {
      render(<EmissionsBarChart data={DATA} title="Category Breakdown" />);
      expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByRole('table', { hidden: true })).toBeInTheDocument();
    });

    it('is accessible', async () => {
      const { container } = render(<EmissionsBarChart data={DATA} title="Category Breakdown" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('EmissionsPieChart', () => {
    it('renders heading, donut chart, legend and accessible table', () => {
      render(<EmissionsPieChart data={DATA} title="Emissions Distribution" />);
      expect(screen.getByText('Emissions Distribution')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
      expect(screen.getByRole('table', { hidden: true })).toBeInTheDocument();
    });

    it('is accessible', async () => {
      const { container } = render(
        <EmissionsPieChart data={DATA} title="Emissions Distribution" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
