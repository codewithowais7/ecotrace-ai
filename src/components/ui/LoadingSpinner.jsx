/**
 * @fileoverview Loading spinner component with accessible status role and screen-reader text.
 * @module components/ui/LoadingSpinner
 */

import PropTypes from 'prop-types';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * An animated spinner with a visually hidden status message for screen readers.
 *
 * @param {Object} props
 * @param {string} [props.message='Loading...'] - Text read aloud by screen readers
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Visual size of the spinner
 * @returns {JSX.Element} The rendered spinner with accessible status
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

LoadingSpinner.displayName = 'LoadingSpinner';

