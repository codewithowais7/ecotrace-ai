/**
 * Loading spinner with accessible status role and screen-reader text.
 */

import PropTypes from 'prop-types';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * @param {{
 *   message?: string,
 *   size?: 'sm'|'md'|'lg'
 * }} props
 */
export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2">
      {/* Visual spinner — decorative, announcement is via sr-only text */}
      <div
        aria-hidden="true"
        className={`animate-spin rounded-full border-2 border-green-500 border-t-transparent ${sizeMap[size] ?? sizeMap.md}`}
      />
      {/* Always present for screen readers */}
      <span className="sr-only">{message}</span>
      {/* Visible label on md/lg sizes */}
      {size !== 'sm' && (
        <span className="text-slate-400 text-sm" aria-hidden="true">
          {message}
        </span>
      )}
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
