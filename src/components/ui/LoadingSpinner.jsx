import React from 'react';
import PropTypes from 'prop-types';

/**
 * Animated loading spinner with accessible label
 */
function LoadingSpinner({ size = 'md', label = 'Loading...', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div role="status" aria-label={label} className={`flex items-center justify-center ${className}`}>
      <span
        aria-hidden="true"
        className={[
          'rounded-full border-primary-500 border-t-transparent animate-spin',
          sizes[size] || sizes.md,
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;
