import React from 'react';
import PropTypes from 'prop-types';

const variants = {
  success: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  neutral: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

/**
 * Small status badge component
 */
function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant] || variants.neutral,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'neutral']),
  className: PropTypes.string,
};

export default Badge;
