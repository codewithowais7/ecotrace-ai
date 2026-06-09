import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import SkipLink from '../../components/layout/SkipLink';

describe('SkipLink accessibility', () => {
  it('renders a skip link', () => {
    render(
      <MemoryRouter>
        <SkipLink />
        <main id="main-content">Content</main>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
  });

  it('links to #main-content', () => {
    render(
      <MemoryRouter>
        <SkipLink />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      '#main-content'
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <SkipLink />
        <main id="main-content">Content</main>
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
