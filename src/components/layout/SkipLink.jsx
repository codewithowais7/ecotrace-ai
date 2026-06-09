import React from 'react';

/**
 * Skip navigation link — visible on keyboard focus for screen reader / keyboard users
 * Must be the first interactive element on the page
 */
function SkipLink() {
  return (
    <a
      href="#main-content"
      className={[
        'sr-only focus:not-sr-only',
        'fixed top-2 left-2 z-[100] rounded-lg bg-primary-500 px-4 py-2',
        'text-sm font-semibold text-white shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-surface',
        'transition-all duration-150',
      ].join(' ')}
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
