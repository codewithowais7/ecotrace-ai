/**
 * Pie / donut chart visualising CO2e emissions breakdown.
 * Includes a text legend (color + label) and an sr-only table fallback.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const tooltipStyle = {
  background: '#16213e',
  border: '1px solid #0f3460',
  borderRadius: '8px',
  color: '#f1f5f9',
};

/**
 * Custom legend renderer — shows color swatch + label text (never color alone).
 */
function renderLegend(props) {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 list-none p-0">
      {payload.map((entry, i) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

renderLegend.propTypes = {
  payload: PropTypes.array,
};

/**
 * @param {{
 *   data: Array<{ category: string, value: number, color: string }>,
 *   title?: string,
 *   ariaLabel?: string
 * }} props
 */
function EmissionsPieChart({ data, title, ariaLabel }) {
  const label = ariaLabel ?? `Pie chart: ${title ?? 'Emissions breakdown'}`;

  return (
    <div role="img" aria-label={label}>
      {title && <h3 className="text-sm font-medium text-slate-300 mb-2">{title}</h3>}

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [`${Number(v).toFixed(2)} kg CO₂e`, 'Emissions']}
            contentStyle={tooltipStyle}
          />
          <Legend content={renderLegend} />
        </PieChart>
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

EmissionsPieChart.propTypes = {
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

export default React.memo(EmissionsPieChart);
