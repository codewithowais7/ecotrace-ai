import '@testing-library/jest-dom';
import { expect, beforeEach, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import mockReact from 'react';

expect.extend(toHaveNoViolations);

// ---------------------------------------------------------------------------
// localStorage polyfill — jsdom does not provide a working implementation
// ---------------------------------------------------------------------------
const makeLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
};

Object.defineProperty(window, 'localStorage', {
  value: makeLocalStorageMock(),
  writable: true,
});

// Reset localStorage between every test to prevent state bleed
beforeEach(() => {
  window.localStorage.clear();
});

// Mock Recharts globally for testing in jsdom using pure JS React.createElement
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) =>
      mockReact.createElement('div', { className: 'responsive-container' }, children),
    BarChart: ({ children }) =>
      mockReact.createElement('div', { 'data-testid': 'bar-chart' }, children),
    Bar: ({ children }) => mockReact.createElement('div', { 'data-testid': 'bar' }, children),
    Cell: () => mockReact.createElement('div', { 'data-testid': 'cell' }),
    XAxis: () => mockReact.createElement('div', { 'data-testid': 'xaxis' }),
    YAxis: () => mockReact.createElement('div', { 'data-testid': 'yaxis' }),
    Tooltip: () => mockReact.createElement('div', { 'data-testid': 'tooltip' }),
    PieChart: ({ children }) =>
      mockReact.createElement('div', { 'data-testid': 'pie-chart' }, children),
    Pie: ({ children }) => mockReact.createElement('div', { 'data-testid': 'pie' }, children),
    Legend: ({ content, payload }) => {
      // Supply a non-empty default payload so that renderLegend's map callback
      // is always exercised in tests (covers EmissionsPieChart renderLegend body).
      const mockPayload =
        payload && payload.length > 0
          ? payload
          : [
              { color: '#3b82f6', value: 'Transport' },
              { color: '#f59e0b', value: 'Food' },
            ];
      if (content) {
        return mockReact.createElement(
          'div',
          { 'data-testid': 'legend' },
          content({ payload: mockPayload })
        );
      }
      return mockReact.createElement('div', { 'data-testid': 'legend' });
    },
  };
});
