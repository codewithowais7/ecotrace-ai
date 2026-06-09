/**
 * @fileoverview Standalone calculator page with live emission result display after logging.
 * @module features/calculator/CalculatorPage
 */

import { useState } from 'react';

import { APP_CONSTANTS } from '../../constants/categories';
import { formatEmissions } from '../../utils/calculator';

import Card from '../../components/ui/Card';
import ActivityForm from '../../components/forms/ActivityForm';

/**
 * Calculator page providing a standalone emission entry form and showing
 * the last logged activity's emissions relative to the India daily average.
 *
 * @returns {JSX.Element} The rendered calculator page
 */
export default function CalculatorPage() {
  const [lastResult, setLastResult] = useState(null);

  const indiaPercent = lastResult
    ? ((lastResult.emissions / APP_CONSTANTS.INDIA_AVERAGE_DAILY_KG) * 100).toFixed(1)
    : null;

  return (
    <main
      id="main-content"
      aria-label="Carbon footprint calculator"
      className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Carbon Calculator</h1>
        <p className="text-slate-400">Calculate the carbon footprint of any activity.</p>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <Card>
        <ActivityForm onSuccess={(result) => setLastResult(result)} />
      </Card>

      {/* ── Live result area — aria-live so updates are announced ──────────── */}
      <div aria-live="polite">
        {lastResult && (
          <Card ariaLabel="Calculation result">
            <h2 className="text-lg font-semibold text-white mb-4">Result</h2>
            <p className="text-4xl font-bold text-green-400 mb-1">
              {formatEmissions(lastResult.emissions)}
            </p>
            <p className="text-slate-400 mb-6">
              for this{' '}
              <span className="text-slate-200 capitalize">
                {lastResult.activityType?.replace(/_/g, ' ')}
              </span>{' '}
              activity
            </p>

            <div className="pt-4 border-t border-[#0f3460]">
              <h3 className="text-sm font-medium text-slate-300 mb-3">For context:</h3>
              <ul className="text-sm text-slate-400 space-y-2 list-none p-0">
                <li>
                  🇮🇳 Indian average per day:{' '}
                  <span className="text-slate-200">
                    {APP_CONSTANTS.INDIA_AVERAGE_DAILY_KG} kg CO₂e
                  </span>
                </li>
                <li>
                  🌍 Global average per day:{' '}
                  <span className="text-slate-200">
                    {APP_CONSTANTS.GLOBAL_AVERAGE_DAILY_KG} kg CO₂e
                  </span>
                </li>
                <li>
                  This activity ={' '}
                  <span
                    className={
                      parseFloat(indiaPercent) > 50
                        ? 'text-red-400 font-medium'
                        : 'text-green-400 font-medium'
                    }
                  >
                    {indiaPercent}%
                  </span>{' '}
                  of India&apos;s daily average
                </li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

CalculatorPage.displayName = 'CalculatorPage';

