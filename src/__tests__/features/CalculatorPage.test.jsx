import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import CalculatorPage from '../../features/calculator/CalculatorPage';
import { AppProvider } from '../../context/AppContext';

describe('CalculatorPage component', () => {
  it('renders title and form', () => {
    render(
      <AppProvider>
        <CalculatorPage />
      </AppProvider>
    );

    expect(screen.getByRole('heading', { name: 'Carbon Calculator' })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Log a new activity' })).toBeInTheDocument();
  });

  it('performs calculation and displays result with context', async () => {
    render(
      <AppProvider>
        <CalculatorPage />
      </AppProvider>
    );

    // Select category: Transport
    await userEvent.selectOptions(screen.getByLabelText(/Category/), 'transport');

    // Select activity type: Car (Petrol)
    await userEvent.selectOptions(screen.getByLabelText(/Activity Type/), 'car_petrol');

    // Fill quantity: 10
    const qtyInput = screen.getByLabelText(/Quantity/);
    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '10');

    // Click Log Activity
    await userEvent.click(screen.getByRole('button', { name: 'Log Activity' }));

    // Result should be shown (10 km * 0.21 = 2.1 kg)
    expect(screen.getByRole('heading', { name: 'Result' })).toBeInTheDocument();
    expect(screen.getByText('2.10 kg CO₂e')).toBeInTheDocument();
    expect(screen.getByText(/of India's daily average/)).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(
      <AppProvider>
        <CalculatorPage />
      </AppProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
