import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Provider } from '../components/ui/provider';
import { GlobalContext } from '../store/GlobalContext';
import type { GlobalContextValue } from '../types';
import { createMockGlobalContext } from './utils/mockContext';
import { persistViewerSeat } from '../helpers/utils/viewerSession';
import ViewerControls from '../components/realtime/ViewerControls';
import Header from '../components/ui/Header';
import type { Round } from '../types';

const emptyRound = {
  team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
  team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
} as unknown as Round;

const renderViewerControls = (
  contextValue: GlobalContextValue,
  onClose = vi.fn(),
) =>
  render(
    <Provider>
      <GlobalContext.Provider value={contextValue}>
        <ViewerControls isOpen onClose={onClose} />
      </GlobalContext.Provider>
    </Provider>,
  );

const renderHeader = (contextValue: GlobalContextValue) =>
  render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue}>
          <Header />
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );

describe('ViewerControls seat picker', () => {
  it('renders each seat as just the player name', async () => {
    renderViewerControls(createMockGlobalContext());

    expect(await screen.findByText('Your seat')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
    expect(screen.getByText('Player 4')).toBeInTheDocument();
  });

  it('does not render team labels or seat-position labels', async () => {
    renderViewerControls(createMockGlobalContext());
    await screen.findByText('Your seat');

    // Old implementation appended "· Team 1" / seat labels like "You", "Left",
    // "Partner", "Right". The buttons should show only the name.
    expect(screen.queryByText(/Team 1/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Team 2/)).not.toBeInTheDocument();
    expect(screen.queryByText('You')).not.toBeInTheDocument();
    expect(screen.queryByText('Left')).not.toBeInTheDocument();
    expect(screen.queryByText('Partner')).not.toBeInTheDocument();
    expect(screen.queryByText('Right')).not.toBeInTheDocument();
  });

  it('selects the tapped seat and closes', async () => {
    const setSeat = vi.fn();
    const onClose = vi.fn();
    renderViewerControls(createMockGlobalContext({ setSeat }), onClose);

    fireEvent.click(await screen.findByText('Player 1'));

    expect(setSeat).toHaveBeenCalledWith('t1p1');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Header viewer auto-open', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('opens the seat picker automatically for a viewer on mount', async () => {
    // A viewer mounts the Header only after the board has synced; the modal
    // should be open without any interaction (no menu tap required).
    renderHeader(
      createMockGlobalContext({ role: 'viewer', currentRound: emptyRound }),
    );

    expect(await screen.findByText('Your seat')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
  });

  it('does NOT auto-open the seat picker for a local/leader player', () => {
    renderHeader(
      createMockGlobalContext({ role: 'local', currentRound: emptyRound }),
    );

    expect(screen.queryByText('Your seat')).not.toBeInTheDocument();
  });

  it('does NOT auto-open the seat picker for a viewer who already chose a seat', () => {
    // The viewer picked a seat in a previous mount; navigating back shouldn't
    // re-prompt them.
    persistViewerSeat('t2p1');

    renderHeader(
      createMockGlobalContext({ role: 'viewer', currentRound: emptyRound }),
    );

    expect(screen.queryByText('Your seat')).not.toBeInTheDocument();
  });
});
