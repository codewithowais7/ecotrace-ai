import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible labeled select (dropdown) component
 */
const Select = forwardRef(function Select(
  {
    id,
    label,
    value,
    onChange,
    options = [],
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    ...rest
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
          {required && (
            <span className="ml-1 text-red-400" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>
      )}

      <select
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={[
          'w-full rounded-lg border bg-surface-card px-3 py-2 text-sm text-slate-100',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-surface-border hover:border-slate-500',
        ].join(' ')}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;
