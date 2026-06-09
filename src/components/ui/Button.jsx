/**
 * Reusable Button component with variant, size, loading, and full accessibility.
 */

import PropTypes from 'prop-types';

const variantClasses = {
  primary: 'bg-green-600 hover:bg-green-500 text-white',
  secondary:
    'bg-[#0f3460] hover:bg-[#16213e] text-slate-200 border border-[#0f3460]',
  danger: 'bg-red-700 hover:bg-red-600 text-white',
  ghost: 'hover:bg-white/10 text-slate-300',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

/**
 * @param {{
 *   variant?: 'primary'|'secondary'|'danger'|'ghost',
 *   size?: 'sm'|'md'|'lg',
 *   loading?: boolean,
 *   disabled?: boolean,
 *   children: React.ReactNode,
 *   onClick?: () => void,
 *   type?: 'button'|'submit'|'reset',
 *   ariaLabel?: string,
 *   className?: string
 * }} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  ariaLabel,
  className,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={[
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        className ?? '',
      ].join(' ')}
    >
      {loading && (
        <span className="mr-2 animate-spin" aria-hidden="true">
          ⟳
        </span>
      )}
      {loading && <span className="sr-only">Loading, please wait</span>}
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};


