/**
 * @fileoverview CarbonContext component — educational carbon footprint awareness.
 * Transforms raw CO2e numbers into relatable real-world equivalencies,
 * helping individuals truly UNDERSTAND their environmental impact.
 * @module components/features/CarbonContext
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getCarbonEquivalents } from '../../utils/carbonEquivalents';

/** Plain-language summaries for each emission level. */
const LEVEL_MESSAGES = {
  low: 'Great job! Your footprint is below the Indian average. Keep it up!',
  medium: "You're near the Indian average. Small changes can make a big difference.",
  high: 'Your footprint is above average. Check your personalized tips below.',
  'very-high': 'High footprint detected. Your AI insights have high-impact suggestions.',
};

/**
 * CarbonContext component — displays educational context about emission levels.
 * Helps users understand what their carbon footprint means in practical terms
 * by converting the raw CO2e total into relatable real-world equivalencies.
 *
 * @param {Object} props
 * @param {number} props.totalKgCO2e - Current total emissions to contextualize
 * @param {string} props.level - Emission level category
 * @returns {JSX.Element}
 */
export default function CarbonContext({ totalKgCO2e, level }) {
  // Memoize equivalencies — only recalculate when the total changes
  const equivalencies = useMemo(() => getCarbonEquivalents(totalKgCO2e), [totalKgCO2e]);

  const message = LEVEL_MESSAGES[level] ?? LEVEL_MESSAGES.medium;

  return (
    <section aria-label="Carbon footprint educational context and equivalencies">
      <h2 className="text-lg font-semibold text-white mb-2">What This Means</h2>
      <p className="text-sm text-slate-300 mb-3">{message}</p>

      <ul
        className="grid grid-cols-2 gap-2"
        aria-label="Real-world carbon equivalencies"
        role="list"
      >
        {equivalencies.map((eq, i) => (
          <li
            key={i}
            className="flex items-start gap-2 bg-[#0f3460]/50 rounded-lg p-2 text-xs text-slate-300"
          >
            <span aria-hidden="true" className="text-base leading-tight flex-shrink-0">
              {eq.icon}
            </span>
            {/* Render value + description from the utility's structured output */}
            <span>
              <strong className="text-white">{eq.value}</strong> {eq.description}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-500 mt-3">
        India avg: 13.4 kg/day &nbsp;·&nbsp; Global avg: 12.9 kg/day &nbsp;·&nbsp; Paris goal: ~2.7
        kg/day
      </p>
    </section>
  );
}

CarbonContext.displayName = 'CarbonContext';

CarbonContext.propTypes = {
  /** Total emissions in kg CO2e to contextualize */
  totalKgCO2e: PropTypes.number.isRequired,
  /** Current emission level bucket */
  level: PropTypes.oneOf(['low', 'medium', 'high', 'very-high']).isRequired,
};
