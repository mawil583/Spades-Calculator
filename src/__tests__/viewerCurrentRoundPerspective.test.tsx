import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from '../components/ui/provider';
import { GlobalContext } from '../store/GlobalContext';
import Round from '../components/game/Round';
import TableRound from '../components/game/TableRound';
import { rotateNames, rotateRound } from '../helpers/utils/perspective';
import { createMockGlobalContext } from './utils/mockContext';
import type {
  Names,
  Round as RoundType,
  Seat,
  GlobalContextValue,
} from '../types';

// The leader-only side-effect hook must not run during render; the rest of the
// hooks module stays real so BidSection/ActualSection/TableRound behave.
vi.mock('../helpers/utils/hooks', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useIndependentTeamScoring: vi.fn(),
  };
});

// Leader (t1p1) is "Alice". The other three seats are the possible viewers.
const leaderNames: Names = {
  t1p1Name: 'Alice', // leader
  t1p2Name: 'Bob', // leader's partner
  t2p1Name: 'Carol', // left opponent
  t2p2Name: 'Dan', // right opponent
  team1Name: 'Team 1',
  team2Name: 'Team 2',
};

// Only the leader has entered a bid ("5"). Everything else is empty so the
// round stays in the bid phase (no actuals section, no completion timer).
const leaderRound = {
  team1BidsAndActuals: { p1Bid: '5', p2Bid: '', p1Actual: '', p2Actual: '' },
  team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
} as unknown as RoundType;

// The viewer is always rotated into the "you" (t1p1) slot, so each non-leader
// seat has a known viewer name.
const viewerCases: Array<{ seat: Seat; viewerName: string }> = [
  { seat: 't2p1', viewerName: 'Carol' },
  { seat: 't1p2', viewerName: 'Bob' },
  { seat: 't2p2', viewerName: 'Dan' },
];

// The dealer id list matches the leader's firstDealerOrder. With no dealer
// override on the current round, the dealer is the first entry (t1p1 → Alice).
const dealerOrder = [
  'team1BidsAndActuals.p1Bid',
  'team2BidsAndActuals.p1Bid',
  'team1BidsAndActuals.p2Bid',
  'team2BidsAndActuals.p2Bid',
];

const buildViewerContext = (seat: Seat): GlobalContextValue =>
  createMockGlobalContext({
    role: 'viewer',
    seat,
    names: leaderNames,
    displayNames: rotateNames(leaderNames, seat),
    currentRound: leaderRound,
    viewCurrentRound: rotateRound(leaderRound, seat),
    viewRoundHistory: [],
    roundHistory: [],
    firstDealerOrder: dealerOrder,
  });

// Classic Round: PlayerInput renders the name in a <span> and the (filled)
// value in a sibling <div data-testid="playerInput">. Return that value box.
const bidValueFor = (name: string): HTMLElement | null => {
  const nameEl = screen.getByText(name);
  const row = nameEl.parentElement?.parentElement as HTMLElement | undefined;
  return row?.querySelector('[data-testid="playerInput"]') ?? null;
};

describe('Round (classic) — current-round viewer perspective', () => {
  it.each(viewerCases)(
    'shows the leader bid under the leader name, not the viewer, for seat $seat',
    ({ seat, viewerName }) => {
      const context = buildViewerContext(seat);

      render(
        <BrowserRouter>
          <Provider>
            <GlobalContext.Provider value={context}>
              <Round isCurrent roundHistory={[]} roundIndex={0} />
            </GlobalContext.Provider>
          </Provider>
        </BrowserRouter>,
      );

      // Leader Alice's bid "5" must render under "Alice".
      expect(bidValueFor('Alice')).toHaveTextContent('5');
      // The viewer's own slot must NOT carry the leader's bid (it is empty).
      expect(bidValueFor(viewerName)).toBeNull();
    },
  );
});

describe('TableRound — current-round viewer perspective', () => {
  it('shows the leader bid under the leader name, not the viewer, for seat t2p1', () => {
    const context = buildViewerContext('t2p1');

    render(
      <BrowserRouter>
        <Provider>
          <GlobalContext.Provider value={context}>
            <TableRound isCurrent roundHistory={[]} roundIndex={0} />
          </GlobalContext.Provider>
        </Provider>
      </BrowserRouter>,
    );

    // In TableRound the filled value box and the name share one
    // data-testid="playerInput" container.
    const aliceBox = screen
      .getByText('Alice')
      .closest('[data-testid="playerInput"]');
    expect(aliceBox).toHaveTextContent('5');

    const carolBox = screen
      .getByText('Carol')
      .closest('[data-testid="playerInput"]');
    expect(carolBox).toBeNull();
  });
});

describe('Dealer tag — current-round viewer perspective', () => {
  // The dealer badge renders as a sibling of the player name inside the same
  // PlayerInput row. Report whether the named player's row carries the badge.
  const nameHasDealerBadge = (name: string): boolean => {
    const nameEl = screen.getByText(name);
    const row = nameEl.parentElement as HTMLElement | null;
    return !!row?.querySelector('[data-testid="dealerBadge"]');
  };

  it.each(viewerCases)(
    'places the dealer badge on the leader (Alice), not the viewer, for seat $seat',
    ({ seat, viewerName }) => {
      const context = buildViewerContext(seat);

      render(
        <BrowserRouter>
          <Provider>
            <GlobalContext.Provider value={context}>
              <Round isCurrent roundHistory={[]} roundIndex={0} />
            </GlobalContext.Provider>
          </Provider>
        </BrowserRouter>,
      );

      // The dealer is Alice (t1p1); after rotation her badge must sit beside
      // her name, and the viewer's own slot must NOT carry it.
      expect(nameHasDealerBadge('Alice')).toBe(true);
      expect(nameHasDealerBadge(viewerName)).toBe(false);
    },
  );
});

describe('Auto-generated actuals — viewer perspective', () => {
  // All four bids are entered (so the round is in the actuals phase), and only
  // Alice's (t1p1) actual is auto-generated. Alice's value must carry the '*'
  // marker on whatever slot she rotates into — never on the viewer.
  const roundWithAutoGen = {
    team1BidsAndActuals: { p1Bid: '3', p2Bid: '3', p1Actual: '4', p2Actual: '3' },
    team2BidsAndActuals: { p1Bid: '3', p2Bid: '4', p1Actual: '3', p2Actual: '3' },
    autoGeneratedActuals: {
      team1P1: true,
      team1P2: false,
      team2P1: false,
      team2P2: false,
    },
  } as unknown as RoundType;

  it.each(viewerCases)(
    'marks the leader (Alice) auto-generated actual with *, not the viewer, for seat $seat',
    ({ seat, viewerName }) => {
      const context = createMockGlobalContext({
        role: 'viewer',
        seat,
        names: leaderNames,
        displayNames: rotateNames(leaderNames, seat),
        currentRound: roundWithAutoGen,
        viewCurrentRound: rotateRound(roundWithAutoGen, seat),
        viewRoundHistory: [],
        roundHistory: [],
        firstDealerOrder: dealerOrder,
      });

      render(
        <BrowserRouter>
          <Provider>
            <GlobalContext.Provider value={context}>
              <TableRound isCurrent roundHistory={[]} roundIndex={0} />
            </GlobalContext.Provider>
          </Provider>
        </BrowserRouter>,
      );

      const aliceBox = screen
        .getByText('Alice')
        .closest('[data-testid="playerInput"]');
      expect(aliceBox).toHaveTextContent('*');

      const viewerBox = screen
        .getByText(viewerName)
        .closest('[data-testid="playerInput"]');
      expect(viewerBox).not.toHaveTextContent('*');
    },
  );
});
