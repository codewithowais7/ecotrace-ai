/**
 * @fileoverview Reusable Button component with variant, size, loading, and full accessibility support.
 * @module components/ui/Button
 */

import PropTypes from 'prop-types';

const variantClasses = {
  primary: 'bg-green-600 hover:bg-green-500 text-white',
  secondary: 'bg-[#0f3460] hover:bg-[#16213e] text-slate-200 border border-[#0f3460]',
  danger: 'bg-red-700 hover:bg-red-600 text-white',
  ghost: 'hover:bg-white/10 text-slate-300',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Accessible button supporting multiple visual variants and an optional loading state.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'} props.variant - Visual style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.loading - Displays a spinner and disables interaction when true
 * @param {boolean} props.disabled - Disables the button when true
 * @param {React.ReactNode} props.children - Button label or content
 * @param {Function} [props.onClick] - Click handler
 * @param {'button'|'submit'|'reset'} props.type - Native HTML button type
 * @param {string} [props.ariaLabel] - Accessible label override for icon-only buttons
 * @param {string} [props.className] - Additional CSS class names
 * @returns {JSX.Element} The rendered button element
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

Button.displayName = 'Button';
