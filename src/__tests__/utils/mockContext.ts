import { vi } from 'vitest';
import type { GlobalContextValue, Round } from '../../types';

/**
 * Creates a complete GlobalContextValue with default mocked functions and empty state.
 * This ensures that if the GlobalContext interface is updated, the compiler will catch
 * any missing properties here, and all test files will inherit the new properties automatically
 * without throwing "undefined is not a function" errors at runtime.
 */
export const createMockGlobalContext = (
  overrides?: Partial<GlobalContextValue>,
): GlobalContextValue => {
  const defaultContext: GlobalContextValue = {
    names: {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    },
    nilScoringRule: 'failed',
    setNames: vi.fn(),
    setNilScoringRule: vi.fn(),
    firstDealerOrder: ['player1', 'player2', 'player3', 'player4'],
    setFirstDealerOrder: vi.fn(),
    roundHistory: [],
    setRoundHistory: vi.fn(),
    resetRoundHistory: vi.fn(),
    currentRound: {} as Round,
    setCurrentRound: vi.fn(),
    resetCurrentRound: vi.fn(),
    isFirstGameAmongTeammates: false,
    setDealerOverride: vi.fn(),
  };

  return {
    ...defaultContext,
    ...overrides,
  };
};
