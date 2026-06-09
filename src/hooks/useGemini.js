import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizeAiResponse } from '../utils/sanitizers';
import { checkRateLimit } from '../utils/security';

const RATE_LIMIT_KEY = 'gemini_api';
const MAX_CALLS = 10;
const WINDOW_MS = 60_000;

/**
 * Hook for interacting with the Gemini AI API
 * @returns {{ generateInsight, loading, error, clearError }}
 */
export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  const getClient = useCallback(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not configured.');
    if (!clientRef.current) {
      clientRef.current = new GoogleGenerativeAI(apiKey);
    }
    return clientRef.current;
  }, []);

  /**
   * Generate an AI insight for the given prompt
   * @param {string} prompt
   * @returns {Promise<string>} Sanitized AI response text
   */
  const generateInsight = useCallback(
    async (prompt) => {
      if (!checkRateLimit(RATE_LIMIT_KEY, MAX_CALLS, WINDOW_MS)) {
        setError('Too many requests. Please wait a moment before trying again.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const client = getClient();
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return sanitizeAiResponse(text);
      } catch (err) {
        const message =
          err?.message?.includes('API_KEY_INVALID')
            ? 'Invalid API key. Please check your Gemini API key configuration.'
            : err?.message || 'Failed to generate AI insight. Please try again.';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getClient]
  );

  const clearError = useCallback(() => setError(null), []);

  return { generateInsight, loading, error, clearError };
}
