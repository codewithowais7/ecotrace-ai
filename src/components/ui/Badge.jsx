/**
 * Emission level badge — uses color + text + icon (never color alone).
 * Reads level config from EMISSION_LEVEL_CONFIG constants.
 */

import PropTypes from 'prop-types';
import { EMISSION_LEVEL_CONFIG } from '../../constants/categories';

/**
 * @param {{
 *   level: 'low'|'medium'|'high'|'very-high',
 *   value: string
 * }} props
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
