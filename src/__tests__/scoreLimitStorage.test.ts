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
  winAcknowledged: null,
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

  describe('SET_WIN_ACKNOWLEDGED', () => {
    it('stores the acknowledgement in state and localStorage', () => {
      const ack = { team1: 520, team2: 480, scoreLimit: 500 };
      const nextState = rootReducer(baseState(), {
        type: 'SET_WIN_ACKNOWLEDGED',
        payload: { winAcknowledged: ack },
      });

      expect(nextState.winAcknowledged).toEqual(ack);
      expect(JSON.parse(window.localStorage.getItem('winAcknowledged') ?? '')).toEqual(
        ack,
      );
    });

    it('clears the acknowledgement when null is passed', () => {
      const stateWithAck = {
        ...baseState(),
        winAcknowledged: { team1: 520, team2: 480, scoreLimit: 500 },
      };

      const nextState = rootReducer(stateWithAck, {
        type: 'SET_WIN_ACKNOWLEDGED',
        payload: { winAcknowledged: null },
      });

      expect(nextState.winAcknowledged).toBeNull();
      expect(JSON.parse(window.localStorage.getItem('winAcknowledged') ?? '')).toBeNull();
    });
  });

  describe('START_NEW_GAME', () => {
    it('resets rounds, applies the limit and clears the acknowledgement', () => {
      const playedState: AppState = {
        ...baseState(),
        roundHistory: [
          {
            team1BidsAndActuals: {
              p1Bid: '5',
              p2Bid: '5',
              p1Actual: '5',
              p2Actual: '5',
            },
            team2BidsAndActuals: {
              p1Bid: '1',
              p2Bid: '1',
              p1Actual: '0',
              p2Actual: '0',
            },
          },
        ],
        scoreLimit: 500,
        winAcknowledged: { team1: 130, team2: -20, scoreLimit: 500 },
      };

      const nextState = rootReducer(playedState, {
        type: 'START_NEW_GAME',
        payload: { scoreLimit: 300 },
      });

      expect(nextState.scoreLimit).toBe(300);
      expect(nextState.roundHistory).toEqual([]);
      expect(nextState.currentRound).toEqual(EMPTY_ROUND);
      expect(nextState.winAcknowledged).toBeNull();
      expect(JSON.parse(window.localStorage.getItem('scoreLimit') ?? '')).toBe(300);
      expect(
        JSON.parse(window.localStorage.getItem('winAcknowledged') ?? ''),
      ).toBeNull();
    });

    it('rotates the dealer when a game was played', () => {
      const playedState: AppState = {
        ...baseState(),
        roundHistory: [
          {
            team1BidsAndActuals: {
              p1Bid: '5',
              p2Bid: '5',
              p1Actual: '5',
              p2Actual: '5',
            },
            team2BidsAndActuals: {
              p1Bid: '1',
              p2Bid: '1',
              p1Actual: '0',
              p2Actual: '0',
            },
          },
        ],
      };

      const nextState = rootReducer(playedState, {
        type: 'START_NEW_GAME',
        payload: { scoreLimit: null },
      });

      expect(nextState.firstDealerOrder).not.toEqual(initialFirstDealerOrder);
    });

    it('keeps the dealer order when no game was played', () => {
      const nextState = rootReducer(baseState(), {
        type: 'START_NEW_GAME',
        payload: { scoreLimit: null },
      });

      expect(nextState.firstDealerOrder).toEqual(initialFirstDealerOrder);
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
