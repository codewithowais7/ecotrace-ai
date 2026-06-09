/**
 * Bar chart visualising CO2e emissions by category.
 * Includes an accessible screen-reader table fallback.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const tooltipStyle = {
  background: '#16213e',
  border: '1px solid #0f3460',
  borderRadius: '8px',
  color: '#f1f5f9',
};

/**
 * @param {{
 *   data: Array<{ category: string, value: number, color: string }>,
 *   title?: string,
 *   ariaLabel?: string
 * }} props
 */
function EmissionsBarChart({ data, title, ariaLabel }) {
  const label = ariaLabel ?? `Bar chart: ${title ?? 'Emissions by category'}`;

  return (
    <div role="img" aria-label={label}>
      {title && (
        <h3 className="text-sm font-medium text-slate-300 mb-2">{title}</h3>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <XAxis
            dataKey="category"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            unit=" kg"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`${Number(v).toFixed(2)} kg CO₂e`, 'Emissions']}
            contentStyle={tooltipStyle}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Screen-reader accessible table fallback */}
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Emissions (kg CO₂e)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.category}>
              <td>{d.category}</td>
              <td>{d.value?.toFixed(2) ?? '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

EmissionsBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default React.memo(EmissionsBarChart);
