import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ActivityForm from '../../components/forms/ActivityForm';
import { AppProvider } from '../../context/AppContext';

describe('ActivityForm component', () => {
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    onSuccessMock.mockClear();
  });

  it('renders and allows category selection', async () => {
    render(
      <AppProvider>
        <ActivityForm onSuccess={onSuccessMock} />
      </AppProvider>
    );

    // Initial state: only Category is shown
    expect(screen.getByRole('combobox', { name: 'Category (required)' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Activity Type' })).toBeNull();

    // Select category: Transport
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Category (required)' }),
      'transport'
    );

    // Now Activity Type and Quantity should appear
    expect(screen.getByRole('combobox', { name: 'Activity Type (required)' })).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity (km) (required)' })
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <AppProvider>
        <ActivityForm onSuccess={onSuccessMock} />
      </AppProvider>
    );

    // Try to submit directly
    await userEvent.click(screen.getByRole('button', { name: 'Log Activity' }));

    // Errors should be shown
    expect(screen.getByText('Please fix these errors:')).toBeInTheDocument();
    expect(screen.getAllByText('Please select a category').length).toBeGreaterThan(0);
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('is accessible', async () => {
    const { container } = render(
      <AppProvider>
        <ActivityForm onSuccess={onSuccessMock} />
      </AppProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
