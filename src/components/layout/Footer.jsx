import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Application footer
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-surface-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span aria-hidden="true">🌱</span>
            <span>
              <strong className="text-slate-300">EcoTrace AI</strong> — Carbon Footprint Awareness
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-4 list-none p-0 m-0">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/calculator', label: 'Calculator' },
                { to: '/insights', label: 'AI Insights' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-500">
            &copy; {year} EcoTrace AI. Built for a greener planet.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
