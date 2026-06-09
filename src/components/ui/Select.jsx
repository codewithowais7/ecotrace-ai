/**
 * @fileoverview Accessible labeled select dropdown component mirroring Input accessibility patterns.
 * @module components/ui/Select
 */

import PropTypes from 'prop-types';

/**
 * Accessible labeled dropdown with associated error and hint text for screen readers.
 *
 * @param {Object} props
 * @param {string} props.id - Unique element id (used for label association)
 * @param {string} props.name - Select name attribute
 * @param {string} props.label - Visible label text
 * @param {string} [props.value] - Controlled selected value
 * @param {Function} [props.onChange] - Change handler
 * @param {Array<{value: string, label: string}>} props.options - Options to render
 * @param {string} [props.error] - Validation error message
 * @param {string} [props.hint] - Hint text shown below the label
 * @param {boolean} [props.required=false] - Marks the field as required
 * @param {string} [props.placeholder] - Disabled placeholder option text
 * @param {string} [props.className] - Additional wrapper class names
 * @returns {JSX.Element} The rendered select field with label
 */
export default function Select({
  id,
  name,
  label,
  value = undefined,
  onChange = undefined,
  options,
  error = undefined,
  hint = undefined,
  required = false,
  placeholder = undefined,
  className = undefined,
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

Select.displayName = 'Select';
