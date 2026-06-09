/**
 * Accessible labeled text / number input component.
 * Always associates a <label> via htmlFor — never relies on aria-label alone.
 */

import PropTypes from 'prop-types';

/**
 * @param {{
 *   id: string,
 *   name: string,
 *   label: string,
 *   type?: string,
 *   value?: string|number,
 *   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   error?: string,
 *   hint?: string,
 *   required?: boolean,
 *   placeholder?: string,
 *   className?: string
 * }} props
 */
export default function Input({
  id,
  name,
  label,
  type,
  value,
  onChange,
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
      {/* Label — always present and associated via htmlFor */}
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-400 ml-1">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </label>

      {/* Hint text — referenced by aria-describedby */}
      {hint && (
        <p id={hintId} className="text-xs text-slate-400">
          {hint}
        </p>
      )}

      <input
        id={id}
        name={name}
        type={type ?? 'text'}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        placeholder={placeholder}
        className={[
          'bg-[#0f3460] rounded-md px-3 py-2 text-white placeholder-slate-500',
          'focus-visible:ring-2 focus-visible:ring-green-500 focus:outline-none',
          'transition-colors',
          error ? 'border border-red-500' : 'border border-[#0f3460]',
        ].join(' ')}
      />

      {/* Inline error — role="alert" so screen readers announce it immediately */}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
