import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../../components/ui/Card';

describe('Card component', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
  it('renders as a div by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild.tagName).toBe('DIV');
  });
  it('renders as section when as="section"', () => {
    const { container } = render(<Card as="section">Content</Card>);
    expect(container.firstChild.tagName).toBe('SECTION');
  });
  it('renders as article when as="article"', () => {
    const { container } = render(<Card as="article">Content</Card>);
    expect(container.firstChild.tagName).toBe('ARTICLE');
  });
  it('applies ariaLabel when provided', () => {
    render(<Card ariaLabel="Summary card">Content</Card>);
    expect(screen.getByLabelText('Summary card')).toBeInTheDocument();
  });
  it('applies additional className', () => {
    const { container } = render(<Card className="extra-class">Content</Card>);
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
