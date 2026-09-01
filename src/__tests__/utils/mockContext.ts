import { vi } from 'vitest';
import type { GlobalContextValue, Round } from '../../types';

/**
 * Creates a complete GlobalContextValue with default mocked functions and empty state.
 * This ensures that if the GlobalContext interface is updated, the compiler will catch
 * any missing properties here, and all test files will inherit the new properties automatically
 * without throwing "undefined is not a function" errors at runtime.
 *
 * Viewer-perspective fields (viewCurrentRound, viewRoundHistory, displayNames) are derived
 * from the merged state AFTER applying overrides, so tests that only pass currentRound/
 * roundHistory get the correct viewer fields automatically.
 */
export const createMockGlobalContext = (
  overrides?: Partial<GlobalContextValue>,
): GlobalContextValue => {
  const base: GlobalContextValue = {
    names: {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    },
    nilScoringRule: 'takesBags',
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
    scoreLimit: null,
    setScoreLimit: vi.fn(),
    startNewGame: vi.fn(),
    winAcknowledged: null,
    setWinAcknowledged: vi.fn(),
    role: 'local' as const,
    sessionId: null,
    seat: 't1p1' as const,
    isViewerSynced: false,
    startLeaderSession: vi.fn(),
    joinSession: vi.fn(),
    setSeat: vi.fn(),
    endSession: vi.fn(),

    // Viewer perspective — placeholders, derived below after merge
    displayNames: overrides?.displayNames ?? (overrides?.names ?? {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    }),
    viewCurrentRound: {} as Round,
    viewRoundHistory: [],
  };

  const merged: GlobalContextValue = {
    ...base,
    ...overrides,
  };

  // Derive viewer-perspective fields from the merged raw state if not explicitly overridden.
  // This is critical: tests that pass currentRound/roundHistory without also passing
  // viewCurrentRound/viewRoundHistory still get the correct viewer fields.
  if (!overrides?.viewCurrentRound) {
    merged.viewCurrentRound = merged.currentRound;
  }
  if (!overrides?.viewRoundHistory) {
    merged.viewRoundHistory = merged.roundHistory;
  }

  return merged;
};