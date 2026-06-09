/**
 * @fileoverview Emission level badge using color, text, and icon — never color alone.
 * @module components/ui/Badge
 */

import PropTypes from 'prop-types';
import { EMISSION_LEVEL_CONFIG } from '../../constants/categories';

/**
 * Displays an emission level with color-coded dot, text label, and optional value.
 *
 * @param {Object} props
 * @param {'low'|'medium'|'high'|'very-high'} props.level - Emission level key
 * @param {string} props.value - Human-readable value string (e.g. '4.2 kg CO2e')
 * @returns {JSX.Element} The rendered badge span
 */
export default function Badge({ level, value }) {
  const config = EMISSION_LEVEL_CONFIG[level] ?? EMISSION_LEVEL_CONFIG.low;

  return (
    <span
      role="status"
      aria-label={`Emission level: ${config.label}, ${value}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
    >
      {/* Coloured dot — decorative reinforcement, not the sole indicator */}
      <span
        aria-hidden="true"
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {/* Text label is the primary indicator */}
      <span>{config.label}</span>
      {/* Optional value string */}
      {value && <span>· {value}</span>}
    </span>
  );
}

Badge.propTypes = {
  level: PropTypes.oneOf(['low', 'medium', 'high', 'very-high']).isRequired,
  value: PropTypes.string.isRequired,
};

Badge.displayName = 'Badge';
