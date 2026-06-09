/**
 * @fileoverview Custom React hook for Google Gemini AI API integration with rate limiting.
 * @module hooks/useGemini
 */

import { useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { checkRateLimit } from '../utils/security';
import { sanitizeApiResponse } from '../utils/sanitizers';
import { APP_CONSTANTS } from '../constants/categories';

/** @typedef {import('../utils/types').InsightTip} InsightTip */

/** Shared rate-limit store — persists across component re-renders for the module lifetime */
const rateLimitStore = new Map();

/**
 * Provides Gemini AI integration with rate limiting and safe response handling.
 *
 * @returns {{
 *   loading: boolean,
 *   error: string | null,
 *   lastResponse: InsightTip[] | null,
 *   generateTips: (emissionData: Object) => Promise<InsightTip[]>
 * }}
 */
export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  /** Lazily-initialised Gemini model — only created if API key is present */
  const model = useRef(null);

  // Initialise the model once on mount if the API key is available
  if (!model.current && import.meta.env.VITE_GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    model.current = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generate personalised, actionable carbon reduction tips for the user's
   * current emission profile. Returns an empty array on rate-limit or error.
   *
   * @param {{ total: number, breakdown: Object, level: string }} emissionData
   *   The user's current daily emission summary.
   * @returns {Promise<InsightTip[]>} Parsed array of tip objects, or [] on failure.
   */
  async function generateTips(emissionData) {
    // ── Guard: no API key configured ─────────────────────────────────────────
    if (!model.current) {
      setError('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.');
      return [];
    }

    // ── Guard: rate limit ─────────────────────────────────────────────────────
    if (!checkRateLimit(rateLimitStore, 'gemini', APP_CONSTANTS.GEMINI_RATE_LIMIT_MS)) {
      setError('Please wait a moment before requesting new insights.');
      return [];
    }

    // ── Build prompt ──────────────────────────────────────────────────────────
    const prompt = [
      'You are an environmental expert.',
      `A user has the following daily carbon footprint:`,
      `Total: ${emissionData.total.toFixed(2)} kg CO2e.`,
      `Breakdown:`,
      `  Transport ${(emissionData.breakdown.transport ?? 0).toFixed(2)} kg,`,
      `  Food ${(emissionData.breakdown.food ?? 0).toFixed(2)} kg,`,
      `  Energy ${(emissionData.breakdown.energy ?? 0).toFixed(2)} kg,`,
      `  Shopping ${(emissionData.breakdown.shopping ?? 0).toFixed(2)} kg.`,
      `Level: ${emissionData.level}.`,
      'Provide exactly 5 specific, actionable tips to reduce their carbon footprint.',
      'Respond ONLY with a JSON array, no other text:',
      '[{"tip": "...", "category": "transport|food|energy|shopping", "impact": "low|medium|high", "saving": "estimated kg CO2e saved"}]',
    ]
      .join(' ')
      .slice(0, APP_CONSTANTS.MAX_PROMPT_CHARS * 3);

    setLoading(true);
    setError(null);

    try {
      const result = await model.current.generateContent(prompt);
      const rawText = result.response.text();
      const sanitized = sanitizeApiResponse(rawText);

      // Strip markdown code fences if the model wraps its output
      const clean = sanitized.replace(/```json|```/g, '').trim();

      const tips = JSON.parse(clean);
      if (!Array.isArray(tips)) throw new Error('Invalid response format');

      setLastResponse(tips);
      return tips;
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError('Received invalid response format. Please try again.');
      } else if (error?.message?.includes('API_KEY')) {
        setError('API configuration error. Please check setup.');
      } else {
        setError('Could not generate insights. Please try again.');
      }
      return [];
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, lastResponse, generateTips };
}
