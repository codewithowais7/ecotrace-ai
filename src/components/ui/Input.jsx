import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible labeled input component
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    hint,
    required = false,
    disabled = false,
    className = '',
    ...rest
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-300"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-400" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>
      )}

      {hint && (
        <p id={hintId} className="text-xs text-slate-400">
          {hint}
        </p>
      )}

      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={[
          'w-full rounded-lg border bg-surface-card px-3 py-2 text-sm text-slate-100 placeholder-slate-500',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-surface-border hover:border-slate-500',
        ].join(' ')}
        {...rest}
      />

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
