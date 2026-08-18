import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from '../components/ui/provider';
import WatchingChip from '../components/realtime/WatchingChip';

interface ChipProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onSwitchSeat?: () => void;
  onLeave?: () => void;
}

const renderChip = (overrides: ChipProps = {}) => {
  const props = {
    isOpen: false,
    onToggle: vi.fn(),
    onSwitchSeat: vi.fn(),
    onLeave: vi.fn(),
    ...overrides,
  };
  render(
    <Provider>
      <WatchingChip
        isOpen={props.isOpen}
        onToggle={props.onToggle}
        onSwitchSeat={props.onSwitchSeat}
        onLeave={props.onLeave}
      />
    </Provider>,
  );
  return props;
};

describe('WatchingChip', () => {
  it('shows the compact Watching status and hides actions when closed', () => {
    renderChip();

    expect(screen.getByText('Watching')).toBeInTheDocument();
    expect(screen.getByTestId('live-dot')).toBeInTheDocument();
    expect(screen.queryByText('Switch seat')).not.toBeInTheDocument();
    expect(screen.queryByText('Leave')).not.toBeInTheDocument();
  });

  it('renders the actions when open', () => {
    renderChip({ isOpen: true });

    expect(screen.getByText('Switch seat')).toBeInTheDocument();
    expect(screen.getByText('Leave')).toBeInTheDocument();
  });

  it('calls onToggle when the chip is tapped', () => {
    const props = renderChip();

    fireEvent.click(screen.getByTestId('watching-chip'));

    expect(props.onToggle).toHaveBeenCalledTimes(1);
  });

  it('invokes onSwitchSeat and onLeave from the open menu', () => {
    const props = renderChip({ isOpen: true });

    fireEvent.click(screen.getByTestId('switch-seat-option'));
    expect(props.onSwitchSeat).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('leave-option'));
    expect(props.onLeave).toHaveBeenCalledTimes(1);
  });
});
