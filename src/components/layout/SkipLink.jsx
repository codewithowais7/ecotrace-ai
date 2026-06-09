/**
 * @fileoverview Skip navigation link — first focusable element on each page for keyboard users.
 * @module components/layout/SkipLink
 */

/**
 * A "Skip to main content" anchor that becomes visible on keyboard focus.
 * Always rendered as the first focusable element so keyboard users can bypass navigation.
 *
 * @returns {JSX.Element} The rendered skip link anchor
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-md focus:text-sm focus:font-medium focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

SkipLink.displayName = 'SkipLink';

