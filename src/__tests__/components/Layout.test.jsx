import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AppContext from '../../context/AppContext';

describe('Layout components', () => {
  describe('Header', () => {
    it('renders header branding', () => {
      render(
        <MemoryRouter>
          <AppContext.Provider value={{ onboardingComplete: false }}>
            <Header />
          </AppContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText('EcoTrace AI')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).toBeNull();
    });

    it('renders navigation links when onboarding is complete', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppContext.Provider value={{ onboardingComplete: true }}>
            <Header />
          </AppContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Calculator' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'AI Insights' })).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders footer attribution', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText(/EcoTrace AI/)).toBeInTheDocument();
      expect(screen.getByText(/Emission factors/)).toBeInTheDocument();
    });
  });
});
