import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import Input from '../../components/ui/Input';

describe('Input', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders label text', () => {
    render(<Input id="test" name="test" label="Email address" value="" onChange={() => {}} />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor and id', () => {
    render(<Input id="email" name="email" label="Email" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders with given placeholder', () => {
    render(
      <Input id="t" name="t" label="Name" value="" onChange={() => {}} placeholder="Enter name" />
    );
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('renders hint text when hint prop is provided', () => {
    render(
      <Input id="t" name="t" label="Name" value="" onChange={() => {}} hint="Max 50 characters" />
    );
    expect(screen.getByText('Max 50 characters')).toBeInTheDocument();
  });

  // ── Accessibility attributes ───────────────────────────────────────────────

  it('sets aria-invalid when error is present', () => {
    render(<Input id="t" name="t" label="Name" value="" onChange={() => {}} error="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<Input id="t" name="t" label="Name" value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('sets aria-required when required prop is true', () => {
    render(<Input id="t" name="t" label="Name" value="" onChange={() => {}} required />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
  });

  it('sets aria-describedby pointing to error element', () => {
    render(
      <Input id="qty" name="qty" label="Quantity" value="" onChange={() => {}} error="Required" />
    );
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('qty-error');
  });

  it('sets aria-describedby pointing to hint element', () => {
    render(
      <Input id="qty" name="qty" label="Quantity" value="" onChange={() => {}} hint="Enter kg" />
    );
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('qty-hint');
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it('shows error message with role="alert"', () => {
    render(
      <Input
        id="test"
        name="test"
        label="Name"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('does not render error element when no error provided', () => {
    render(<Input id="t" name="t" label="Name" value="" onChange={() => {}} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── Required indicator ─────────────────────────────────────────────────────

  it('shows required asterisk in label when required', () => {
    render(<Input id="t" name="t" label="Name" value="" onChange={() => {}} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows sr-only "(required)" text when required', () => {
    render(<Input id="t" name="t" label="Name" value="" onChange={() => {}} required />);
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input id="t" name="t" label="Name" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Alice' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Input id="name" name="name" label="Your name" value="" onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with error', async () => {
    const { container } = render(
      <Input
        id="qty"
        name="qty"
        label="Quantity"
        value=""
        onChange={() => {}}
        error="Required"
        required
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
