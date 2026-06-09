import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CATEGORY_COLORS } from '../../constants/categories';

/**
 * Custom tooltip for the emissions bar chart
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-3 shadow-xl text-sm">
      <p className="font-medium text-slate-200">{label}</p>
      <p className="text-primary-400">
        {value >= 1000 ? `${(value / 1000).toFixed(2)}t` : `${value.toFixed(1)} kg`} CO₂e
      </p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

/**
 * Bar chart showing emissions per category
 * @param {Array<{category: string, label: string, value: number}>} data
 */
function EmissionsBarChart({ data, title = 'Emissions by Category' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 text-sm">
        No emissions data to display yet.
      </div>
    );
  }

  return (
    <figure aria-label={title}>
      <figcaption className="sr-only">{title}</figcaption>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#0f3460' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}t` : `${v}kg`)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_COLORS[entry.category] || '#22c55e'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}

EmissionsBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default EmissionsBarChart;
