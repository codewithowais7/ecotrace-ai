import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AppProvider } from '../../../context/AppContext';
import ActivityList from '../../../components/features/ActivityList';

function Wrapper({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

// Shared no-op announce helper — onAnnounce is a required prop called on removal
const noop = () => {};

describe('ActivityList component', () => {
  it('renders empty state message when no activities', () => {
    render(
      <Wrapper>
        <ActivityList activities={[]} onRemove={noop} onAnnounce={noop} />
      </Wrapper>
    );
    expect(screen.getByText(/no activities/i)).toBeInTheDocument();
  });
  it('renders activity items when activities provided', () => {
    const activities = [
      {
        id: '1',
        category: 'transport',
        activityType: 'car_petrol',
        quantity: 10,
        unit: 'km',
        timestamp: new Date().toISOString(),
      },
    ];
    render(
      <Wrapper>
        <ActivityList activities={activities} onRemove={noop} onAnnounce={noop} />
      </Wrapper>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBe(1);
  });
  it('calls onRemove when remove button is clicked', async () => {
    const onRemove = vi.fn();
    const activities = [
      {
        id: '1',
        category: 'transport',
        activityType: 'car_petrol',
        quantity: 10,
        unit: 'km',
        timestamp: new Date().toISOString(),
      },
    ];
    render(
      <Wrapper>
        <ActivityList activities={activities} onRemove={onRemove} onAnnounce={noop} />
      </Wrapper>
    );
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith('1');
  });
  it('remove button has descriptive aria-label', () => {
    const activities = [
      {
        id: '1',
        category: 'transport',
        activityType: 'car_petrol',
        quantity: 10,
        unit: 'km',
        timestamp: new Date().toISOString(),
      },
    ];
    render(
      <Wrapper>
        <ActivityList activities={activities} onRemove={noop} onAnnounce={noop} />
      </Wrapper>
    );
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    expect(removeBtn).toHaveAttribute('aria-label');
  });
});
