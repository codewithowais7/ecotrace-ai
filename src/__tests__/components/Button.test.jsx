import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Button from '../../components/ui/Button';

describe('Button', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders children text correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders with default type="button"', () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('renders with correct type attribute when overridden', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies ariaLabel to the button element', () => {
    render(<Button ariaLabel="Save the form">Save</Button>);
    expect(screen.getByRole('button', { name: 'Save the form' })).toBeInTheDocument();
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} loading>
        Click
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is keyboard accessible via Enter key', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press Enter</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it('shows loading state with aria-busy="true"', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('shows sr-only loading text for screen readers', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading, please wait')).toBeInTheDocument();
  });

  it('non-loading button does not have aria-busy="true"', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy', 'true');
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('button is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in loading state', async () => {
    const { container } = render(
      <Button loading ariaLabel="Loading save">
        Save
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in disabled state', async () => {
    const { container } = render(<Button disabled>Disabled action</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
