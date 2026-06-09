import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGemini } from '../../hooks/useGemini';

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockImplementation(() => {
          return {
            generateContent: mockGenerateContent,
          };
        }),
      };
    }),
  };
});

vi.mock('../../utils/security', () => {
  return {
    checkRateLimit: vi.fn().mockReturnValue(true),
    validateEnvVar: vi.fn().mockReturnValue(true),
  };
});

describe('useGemini hook', () => {
  const originalEnv = import.meta.env.VITE_GEMINI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_GEMINI_API_KEY = 'mock-api-key';
  });

  afterEach(() => {
    import.meta.env.VITE_GEMINI_API_KEY = originalEnv;
  });

  it('sets error if API key is not configured', async () => {
    import.meta.env.VITE_GEMINI_API_KEY = '';
    const { result } = renderHook(() => useGemini());

    let tips;
    await act(async () => {
      tips = await result.current.generateTips({ total: 10, breakdown: {}, level: 'low' });
    });

    expect(tips).toEqual([]);
    expect(result.current.error).toContain('Gemini API key is not configured');
  });

  it('generates tips successfully', async () => {
    const mockResponseText = JSON.stringify([
      { tip: 'Eat less beef', category: 'food', impact: 'high', saving: '5 kg' },
    ]);
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => mockResponseText,
      },
    });

    const { result } = renderHook(() => useGemini());

    let tips;
    await act(async () => {
      tips = await result.current.generateTips({
        total: 15.5,
        breakdown: { transport: 5, food: 6, energy: 4, shopping: 0.5 },
        level: 'medium',
      });
    });

    expect(tips).toHaveLength(1);
    expect(tips[0].tip).toBe('Eat less beef');
    expect(result.current.error).toBeNull();
    expect(result.current.lastResponse).toEqual(tips);
  });

  it('handles API exceptions gracefully', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useGemini());

    let tips;
    await act(async () => {
      tips = await result.current.generateTips({
        total: 15.5,
        breakdown: { transport: 5, food: 6, energy: 4, shopping: 0.5 },
        level: 'medium',
      });
    });

    expect(tips).toEqual([]);
    expect(result.current.error).toBe('Could not generate insights. Please try again.');
  });

  it('handles invalid JSON format in response', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => 'invalid-json',
      },
    });

    const { result } = renderHook(() => useGemini());

    let tips;
    await act(async () => {
      tips = await result.current.generateTips({
        total: 15.5,
        breakdown: { transport: 5, food: 6, energy: 4, shopping: 0.5 },
        level: 'medium',
      });
    });

    expect(tips).toEqual([]);
    expect(result.current.error).toBe('Received invalid response format. Please try again.');
  });
});
