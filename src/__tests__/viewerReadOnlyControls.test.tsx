import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { Provider } from '../components/ui/provider';
import { GlobalContext } from '../store/GlobalContext';
import { createMockGlobalContext } from './utils/mockContext';
import { persistViewerSeat } from '../helpers/utils/viewerSession';
import ScoreSetting from '../components/game/ScoreSetting';
import Header from '../components/ui/Header';
import type { Round } from '../types';

const emptyRound = {
  team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
  team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
} as unknown as Round;

describe('viewer read-only controls', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  describe('nil scoring setting', () => {
    it('does not render the nil scoring control for a viewer', () => {
      render(
        <Provider>
          <GlobalContext.Provider
            value={createMockGlobalContext({ role: 'viewer' })}
          >
            <ScoreSetting />
          </GlobalContext.Provider>
        </Provider>,
      );

      expect(screen.queryByText('Takes Bags')).not.toBeInTheDocument();
      expect(screen.queryByText('Helps Team Bid')).not.toBeInTheDocument();
      expect(screen.queryByText('No Bags/No Help')).not.toBeInTheDocument();
    });

    it('renders the nil scoring control for a local/leader player', () => {
      render(
        <Provider>
          <GlobalContext.Provider
            value={createMockGlobalContext({ role: 'local' })}
          >
            <ScoreSetting />
          </GlobalContext.Provider>
        </Provider>,
      );

      expect(screen.getByText('Takes Bags')).toBeInTheDocument();
    });
  });

  describe('header New Game', () => {
    it('does not offer New Game to a viewer', () => {
      // Persist a seat so the seat picker doesn't auto-open and cover the menu.
      persistViewerSeat('t2p1');

      render(
        <BrowserRouter>
          <Provider>
            <GlobalContext.Provider
              value={createMockGlobalContext({
                role: 'viewer',
                currentRound: emptyRound,
              })}
            >
              <Header />
            </GlobalContext.Provider>
          </Provider>
        </BrowserRouter>,
      );

      fireEvent.click(screen.getByLabelText('Open Menu'));

      expect(screen.queryByText('New Game')).not.toBeInTheDocument();
      // Sanity: viewer-only items are still present.
      expect(screen.getByText('Switch seat')).toBeInTheDocument();
    });
  });
});
