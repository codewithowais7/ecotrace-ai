import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AppProvider } from '../../../context/AppContext';
import QuickActions from '../../../components/features/QuickActions';

function Wrapper({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('QuickActions component', () => {
  it('renders quick action buttons', () => {
    render(<Wrapper><QuickActions /></Wrapper>);
    expect(screen.getByText(/quick log/i)).toBeInTheDocument();
  });
  it('renders at least 4 quick action buttons', () => {
    render(<Wrapper><QuickActions /></Wrapper>);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });
  it('has accessible aria-label on each button', () => {
    render(<Wrapper><QuickActions /></Wrapper>);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-label');
    });
  });
  it('shows logged confirmation after clicking a quick action', async () => {
    render(<Wrapper><QuickActions /></Wrapper>);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);
    expect(screen.getByText(/logged/i)).toBeInTheDocument();
  });
  it('renders within an accessible section landmark', () => {
    render(<Wrapper><QuickActions /></Wrapper>);
    expect(
      screen.getByRole('region', { hidden: true }) ||
        document.querySelector('section[aria-label]')
    ).toBeTruthy();
  });
});
