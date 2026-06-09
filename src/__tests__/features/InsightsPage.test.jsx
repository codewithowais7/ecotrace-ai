import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import InsightsPage from '../../features/insights/InsightsPage';
import AppContext from '../../context/AppContext';
import { useGemini } from '../../hooks/useGemini';

vi.mock('../../hooks/useGemini', () => {
  return {
    useGemini: vi.fn(),
  };
});

describe('InsightsPage component', () => {
  const mockGenerateTips = vi.fn();
  const mockSetInsights = vi.fn();

  const mockContext = {
    dailyStats: {
      total: 15,
      breakdown: { transport: 5, food: 5, energy: 5, shopping: 0 },
    },
    emissionLevel: 'medium',
    insights: [],
    setInsights: mockSetInsights,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useGemini.mockReturnValue({
      loading: false,
      error: null,
      generateTips: mockGenerateTips,
    });
  });

  it('renders insights headers and static quick wins', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <InsightsPage />
      </AppContext.Provider>
    );

    expect(screen.getByRole('heading', { name: 'Personalized Insights' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quick Wins' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generate AI insights for my carbon footprint' })
    ).toBeInTheDocument();
  });

  it('displays generated personalized tips when they exist', () => {
    render(
      <AppContext.Provider
        value={{
          ...mockContext,
          insights: [
            { tip: 'Reduce beef intake', category: 'food', impact: 'high', saving: '1.2 kg' },
          ],
        }}
      >
        <InsightsPage />
      </AppContext.Provider>
    );

    expect(screen.getByRole('heading', { name: 'Your Personalised Tips' })).toBeInTheDocument();
    expect(screen.getByText('Reduce beef intake')).toBeInTheDocument();
    expect(screen.getByText('Impact: high')).toBeInTheDocument();
    expect(screen.getByText('~1.2 kg saved')).toBeInTheDocument();
  });

  it('shows loading spinner when generate tips is in progress', () => {
    useGemini.mockReturnValue({
      loading: true,
      error: null,
      generateTips: mockGenerateTips,
    });

    render(
      <AppContext.Provider value={mockContext}>
        <InsightsPage />
      </AppContext.Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Asking Gemini AI...')).toBeInTheDocument();
  });

  it('shows error message when gemini call fails', () => {
    useGemini.mockReturnValue({
      loading: false,
      error: 'Failed to connect to API',
      generateTips: mockGenerateTips,
    });

    render(
      <AppContext.Provider value={mockContext}>
        <InsightsPage />
      </AppContext.Provider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to connect to API')).toBeInTheDocument();
  });

  it('calls generateTips on clicking button and updates insights context', async () => {
    const tipsResponse = [
      { tip: 'Use bus', category: 'transport', impact: 'high', saving: '2 kg' },
    ];
    mockGenerateTips.mockResolvedValue(tipsResponse);

    render(
      <AppContext.Provider value={mockContext}>
        <InsightsPage />
      </AppContext.Provider>
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Generate AI insights for my carbon footprint' })
    );

    expect(mockGenerateTips).toHaveBeenCalledWith({
      total: 15,
      breakdown: { transport: 5, food: 5, energy: 5, shopping: 0 },
      level: 'medium',
    });
    expect(mockSetInsights).toHaveBeenCalledWith(tipsResponse);
  });

  it('is accessible', async () => {
    const { container } = render(
      <AppContext.Provider value={mockContext}>
        <InsightsPage />
      </AppContext.Provider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
