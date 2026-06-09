/**
 * Insights page — generates personalised AI tips via Gemini and displays static quick wins.
 */

import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { useGemini } from '../../hooks/useGemini';
import { useAccessibility } from '../../hooks/useAccessibility';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORY_ICONS = {
  transport: '🚗',
  food: '🍽️',
  energy: '⚡',
  shopping: '🛍️',
};

const QUICK_WINS = [
  {
    id: 1,
    tip: 'Switch to LED bulbs throughout your home.',
    detail: 'Saves ~50 kg CO₂e per year.',
    icon: '💡',
    category: 'energy',
  },
  {
    id: 2,
    tip: 'Try one plant-based Monday per week.',
    detail: 'Saves ~1.5 kg CO₂e per week.',
    icon: '🥦',
    category: 'food',
  },
  {
    id: 3,
    tip: 'Skip one short-haul flight per year.',
    detail: 'Saves ~50 kg CO₂e per trip.',
    icon: '✈️',
    category: 'transport',
  },
  {
    id: 4,
    tip: 'Unplug electronics when not in use.',
    detail: 'Reduces standby energy use by ~10%.',
    icon: '🔌',
    category: 'energy',
  },
  {
    id: 5,
    tip: 'Buy locally grown produce when possible.',
    detail: 'Cuts transport-related emissions by ~90%.',
    icon: '🛒',
    category: 'food',
  },
  {
    id: 6,
    tip: 'Wash clothes in cold water.',
    detail: 'Saves ~1.5 kg CO₂e per month.',
    icon: '🧺',
    category: 'energy',
  },
];

export default function InsightsPage() {
  const { dailyStats, emissionLevel, insights, setInsights } = useContext(AppContext);
  const { loading, error, generateTips } = useGemini();
  const { announceToScreenReader } = useAccessibility();

  async function handleGetInsights() {
    announceToScreenReader('Generating personalised insights, please wait.', 'polite');
    const tips = await generateTips({
      total: dailyStats.total,
      breakdown: dailyStats.breakdown,
      level: emissionLevel,
    });
    if (tips.length > 0) {
      setInsights(tips);
      announceToScreenReader(`${tips.length} personalised tips are now available.`);
    }
  }

  return (
    <main
      id="main-content"
      aria-label="AI-powered carbon insights"
      className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Personalized Insights</h1>
        <p className="text-slate-400">Get AI-powered tips based on your actual footprint data.</p>
      </div>

      {/* ── Generate button ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleGetInsights}
          loading={loading}
          ariaLabel="Generate AI insights for my carbon footprint"
          size="lg"
          className="self-start"
        >
          {loading ? 'Generating Insights...' : '✨ Get Personalized Tips'}
        </Button>

        {loading && <LoadingSpinner message="Asking Gemini AI..." size="sm" />}

        {error && (
          <p role="alert" aria-live="assertive" className="text-red-400 text-sm">
            {error}
          </p>
        )}
      </div>

      {/* ── Dynamic AI tips — aria-live region ─────────────────────────────── */}
      <div aria-live="polite">
        {insights.length > 0 && (
          <section aria-label="Your personalised AI tips">
            <h2 className="text-lg font-semibold text-white mb-4">Your Personalised Tips</h2>
            <ul className="flex flex-col gap-4 list-none p-0">
              {insights.map((tip, i) => (
                <li key={i}>
                  <Card ariaLabel={`Tip ${i + 1}: ${tip.tip}`}>
                    <div className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-2xl flex-shrink-0">
                        {CATEGORY_ICONS[tip.category] || '💡'}
                      </span>
                      <div>
                        <p className="text-slate-200">{tip.tip}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="text-xs text-slate-400 capitalize">
                            Category: {tip.category}
                          </span>
                          <span className="text-xs text-green-400">Impact: {tip.impact}</span>
                          {tip.saving && (
                            <span className="text-xs text-slate-400">~{tip.saving} saved</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ── Static quick wins ──────────────────────────────────────────────── */}
      <section aria-label="General carbon reduction tips">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Wins</h2>
        <ul className="flex flex-col gap-3 list-none p-0">
          {QUICK_WINS.map((win) => (
            <li key={win.id}>
              <Card>
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-xl flex-shrink-0">
                    {win.icon}
                  </span>
                  <div>
                    <p className="text-slate-200">{win.tip}</p>
                    <p className="text-xs text-green-400 mt-1">{win.detail}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
