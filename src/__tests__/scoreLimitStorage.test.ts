import { describe, it, expect, beforeEach } from 'vitest';
import rootReducer, { getInitialState } from '../store/rootReducer';
import {
  EMPTY_ROUND,
  initialFirstDealerOrder,
  initialNames,
  TAKES_BAGS,
} from '../helpers/utils/constants';
import type { AppState } from '../types';

const baseState = (): AppState => ({
  currentRound: EMPTY_ROUND,
  roundHistory: [],
  firstDealerOrder: initialFirstDealerOrder,
  isFirstGameAmongTeammates: true,
  names: initialNames,
  nilScoringRule: TAKES_BAGS,
  scoreLimit: null,
});

describe('score limit storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('getInitialState', () => {
    it('defaults to no score limit', () => {
      expect(getInitialState().scoreLimit).toBeNull();
    });

    it('reads a persisted score limit from localStorage', () => {
      window.localStorage.setItem('scoreLimit', JSON.stringify(500));
      expect(getInitialState().scoreLimit).toBe(500);
    });
  });

  describe('SET_SCORE_LIMIT', () => {
    it('stores the score limit in state and localStorage', () => {
      const nextState = rootReducer(baseState(), {
        type: 'SET_SCORE_LIMIT',
        payload: { scoreLimit: 300 },
      });

      expect(nextState.scoreLimit).toBe(300);
      expect(
        JSON.parse(window.localStorage.getItem('scoreLimit') ?? ''),
      ).toBe(300);
    });

    it('clears the score limit when null is passed', () => {
      const stateWithLimit = {
        ...baseState(),
        scoreLimit: 300,
      };
      window.localStorage.setItem('scoreLimit', JSON.stringify(300));

      const nextState = rootReducer(stateWithLimit, {
        type: 'SET_SCORE_LIMIT',
        payload: { scoreLimit: null },
      });

      expect(nextState.scoreLimit).toBeNull();
      expect(JSON.parse(window.localStorage.getItem('scoreLimit') ?? '')).toBeNull();
    });
  });

  describe('HYDRATE', () => {
    it('adopts the leader score limit for viewers', () => {
      const leaderState = { ...baseState(), scoreLimit: 250 };

      const hydrated = rootReducer(baseState(), {
        type: 'HYDRATE',
        payload: leaderState,
      });

      expect(hydrated.scoreLimit).toBe(250);
    });

    it('falls back to null for sessions created before score limits existed', () => {
      const legacyLeaderState = baseState() as unknown as Record<
        string,
        unknown
      >;
      delete legacyLeaderState.scoreLimit;

      const hydrated = rootReducer(baseState(), {
        type: 'HYDRATE',
        payload: legacyLeaderState as unknown as AppState,
      });

      expect(hydrated.scoreLimit).toBeNull();
    });
  });
});
