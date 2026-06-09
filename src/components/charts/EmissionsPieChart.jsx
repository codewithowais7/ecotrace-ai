import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CATEGORY_COLORS } from '../../constants/categories';

/**
 * Custom tooltip for the pie chart
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];
  const total = payload[0].payload.total;
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-3 shadow-xl text-sm">
      <p className="font-medium text-slate-200">{name}</p>
      <p className="text-primary-400">
        {value >= 1000 ? `${(value / 1000).toFixed(2)}t` : `${value.toFixed(1)} kg`} CO₂e
      </p>
      <p className="text-slate-400">{pct}% of total</p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

/**
 * Pie chart showing emissions breakdown by category
 */
function EmissionsPieChart({ data, title = 'Emissions Breakdown' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 text-sm">
        No emissions data to display yet.
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map((d) => ({ ...d, total }));

  return (
    <figure aria-label={title}>
      <figcaption className="sr-only">{title}</figcaption>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={3}
          >
            {dataWithTotal.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_COLORS[entry.category] || '#22c55e'}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-slate-400">{value}</span>
            )}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </figure>
  );
}

EmissionsPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};

export default EmissionsPieChart;
