import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/insights', label: 'AI Insights' },
];

/**
 * Application header with navigation and skip link target
 */
function Header({ totalEmissions }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          aria-label="EcoTrace AI — Home"
        >
          <span aria-hidden="true">🌱</span>
          <span>EcoTrace AI</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 list-none p-0 m-0">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-surface-card',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Emissions summary chip */}
        {totalEmissions > 0 && (
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-surface-card border border-surface-border px-3 py-1.5 text-xs"
            aria-label={`Current total: ${totalEmissions.toFixed(1)} kg CO₂e`}
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" aria-hidden="true" />
            <span className="text-slate-300">
              {totalEmissions >= 1000
                ? `${(totalEmissions / 1000).toFixed(2)}t`
                : `${totalEmissions.toFixed(1)} kg`}{' '}
              CO₂e
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  totalEmissions: PropTypes.number,
};

Header.defaultProps = {
  totalEmissions: 0,
};

export default Header;
