/**
 * Accessible labeled select (dropdown) component.
 * Mirrors the Input component accessibility pattern.
 */

import PropTypes from 'prop-types';

/**
 * @param {{
 *   id: string,
 *   name: string,
 *   label: string,
 *   value?: string,
 *   onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
 *   options: Array<{ value: string, label: string }>,
 *   error?: string,
 *   hint?: string,
 *   required?: boolean,
 *   placeholder?: string,
 *   className?: string
 * }} props
 */
export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  hint,
  required,
  placeholder,
  className,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {/* Label */}
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-400 ml-1">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </label>

      {/* Hint text */}
      {hint && (
        <p id={hintId} className="text-xs text-slate-400">
          {hint}
        </p>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={[
          'bg-[#0f3460] rounded-md px-3 py-2 text-white',
          'focus-visible:ring-2 focus-visible:ring-green-500 focus:outline-none',
          'transition-colors cursor-pointer',
          error ? 'border border-red-500' : 'border border-[#0f3460]',
        ].join(' ')}
      >
        {/* Empty placeholder option */}
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Inline error */}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
