/**
 * Application header — sticky banner landmark with branding and main navigation.
 * Navigation is only rendered after onboarding is complete.
 */

import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from '../../context/AppContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/insights', label: 'AI Insights' },
];

/**
 * Sticky application header with conditional navigation.
 * Shows navigation links only once onboarding is complete.
 */
export default function Header() {
  const { onboardingComplete } = useContext(AppContext);
  const location = useLocation();

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-[#16213e] border-b border-[#0f3460]"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          aria-label="EcoTrace AI home"
          className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none rounded"
        >
          <span aria-hidden="true" className="text-xl">
            🌱
          </span>
          <span className="font-bold text-green-400 text-lg">EcoTrace AI</span>
        </Link>

        {/* Main navigation — only shown after onboarding */}
        {onboardingComplete && (
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        'focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none',
                        isActive
                          ? 'text-green-400 underline underline-offset-4'
                          : 'text-slate-300 hover:text-white hover:bg-white/10',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
