import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from '../components/ui/provider';
import { GlobalContext } from '../store/GlobalContext';
import Unclaimed from '../components/game/Unclaimed';
import BidSection from '../components/game/BidSection';
import TableRound from '../components/game/TableRound';
import { vi, beforeEach } from 'vitest';
import type { GlobalContextValue, Round } from '../types';
import { createMockGlobalContext } from './utils/mockContext';
import {
  FEATURE_FLAGS,
  setFeatureFlag,
} from '../helpers/utils/featureFlags';

// The leader-only side-effect hook and score math must not run during render;
// the rest of the hooks module stays real so ScoreLimitDisplay works.
vi.mock('../helpers/utils/hooks', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useIndependentTeamScoring: vi.fn(),
    useGameScores: vi.fn(() => ({
      team1Score: { teamScore: 0, teamBags: 0 },
      team2Score: { teamScore: 0, teamBags: 0 },
    })),
    useValidateActuals: vi.fn(),
  };
});

const mockRound = {
  team1BidsAndActuals: { p1Bid: '3', p2Bid: '2', p1Actual: '', p2Actual: '' },
  team2BidsAndActuals: { p1Bid: '4', p2Bid: '1', p1Actual: '', p2Actual: '' },
} as unknown as Round;

const mockNames = {
  team1Name: 'Team 1',
  team2Name: 'Team 2',
  t1p1Name: 'Player 1',
  t1p2Name: 'Player 2',
  t2p1Name: 'Player 3',
  t2p2Name: 'Player 4',
};

const dealerOrder = [
  'team1BidsAndActuals.p1Bid',
  'team2BidsAndActuals.p1Bid',
  'team1BidsAndActuals.p2Bid',
  'team2BidsAndActuals.p2Bid',
];

const buildContext = (
  overrides: Partial<GlobalContextValue> = {},
): GlobalContextValue =>
  createMockGlobalContext({
    names: mockNames,
    currentRound: mockRound,
    firstDealerOrder: dealerOrder,
    ...overrides,
  });

const renderWithContext = (
  ui: React.ReactNode,
  contextValue: GlobalContextValue,
) =>
  render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue}>
          {ui}
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );

describe('Unclaimed — score limit opt-in', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('does not render the score limit by default', () => {
    renderWithContext(<Unclaimed numUnclaimed={5} />, buildContext());
    expect(screen.queryByTestId('score-limit-display')).not.toBeInTheDocument();
  });

  it('renders the score limit when showScoreLimit is true', () => {
    renderWithContext(
      <Unclaimed numUnclaimed={5} showScoreLimit />,
      buildContext(),
    );
    expect(screen.getByTestId('score-limit-display')).toBeInTheDocument();
  });
});

describe('BidSection — score limit placement', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hides the score limit in the bids section in table mode (it lives on the table)', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, true);
    renderWithContext(
      <BidSection
        index={0}
        names={mockNames}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockRound}
      />,
      buildContext(),
    );
    expect(screen.getByText(/Unclaimed:/)).toBeInTheDocument();
    expect(screen.queryByTestId('score-limit-display')).not.toBeInTheDocument();
  });

  it('shows the score limit in the current round bids section in classic mode (no table there)', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, false);
    renderWithContext(
      <BidSection
        index={0}
        names={mockNames}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockRound}
      />,
      buildContext(),
    );
    expect(screen.getByText(/Unclaimed:/)).toBeInTheDocument();
    expect(screen.getByTestId('score-limit-display')).toBeInTheDocument();
  });

  it('never shows the score limit for a past round, in table mode', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, true);
    renderWithContext(
      <BidSection
        index={0}
        names={mockNames}
        isCurrent={false}
        roundHistory={[mockRound]}
        currentRound={mockRound}
      />,
      buildContext(),
    );
    expect(screen.queryByTestId('score-limit-display')).not.toBeInTheDocument();
  });

  it('never shows the score limit for a past round, in classic mode', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, false);
    renderWithContext(
      <BidSection
        index={0}
        names={mockNames}
        isCurrent={false}
        roundHistory={[mockRound]}
        currentRound={mockRound}
      />,
      buildContext(),
    );
    expect(screen.queryByTestId('score-limit-display')).not.toBeInTheDocument();
  });
});

describe('TableRound — score limit placement', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the score limit on the table for the current round', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, true);
    renderWithContext(
      <TableRound isCurrent={true} roundHistory={[]} roundIndex={0} />,
      buildContext(),
    );
    expect(screen.getByTestId('score-limit-display')).toBeInTheDocument();
  });

  it('does not show the score limit for a past round', () => {
    setFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI, true);
    renderWithContext(
      <TableRound isCurrent={false} roundHistory={[mockRound]} roundIndex={0} />,
      buildContext(),
    );
    expect(screen.queryByTestId('score-limit-display')).not.toBeInTheDocument();
  });
});
