import {
  defaultLocalStorage,
  setLocalStorage,
} from '../helpers/utils/helperFunctions';
import {
  initialFirstDealerOrder,
  EMPTY_ROUND,
  initialNames,
  TAKES_BAGS,
} from '../helpers/utils/constants';
import type { AppState, AppAction } from '../types';

export const getInitialState = (): AppState => ({
  currentRound: defaultLocalStorage('currentRound', EMPTY_ROUND),
  roundHistory: defaultLocalStorage('roundHistory', []),
  firstDealerOrder: defaultLocalStorage(
    'firstDealerOrder',
    initialFirstDealerOrder,
  ),
  isFirstGameAmongTeammates: defaultLocalStorage(
    'isFirstGameAmongTeammates',
    true,
  ),
  names: defaultLocalStorage('names', initialNames),
  nilScoringRule: defaultLocalStorage('nilScoringRule', TAKES_BAGS),
  scoreLimit: defaultLocalStorage('scoreLimit', null),
});

const rootReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_ROUND':
      try {
        const round = { ...action.payload.currentRound };
        setLocalStorage('currentRound', round);
        return {
          ...state,
          currentRound: round,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case 'RESET_CURRENT_ROUND':
      try {
        setLocalStorage('currentRound', EMPTY_ROUND);
        return {
          ...state,
          currentRound: EMPTY_ROUND,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case 'RESET_ROUND_HISTORY':
      return {
        ...state,
        roundHistory: [],
      };
    case 'SET_ROUND_HISTORY':
      try {
        const history = [...action.payload.roundHistory];
        setLocalStorage('roundHistory', history);
        return {
          ...state,
          roundHistory: history,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case 'SET_FIRST_DEALER_ORDER':
      try {
        const order = [...action.payload.firstDealerOrder];
        setLocalStorage('firstDealerOrder', order);
        return {
          ...state,
          firstDealerOrder: order,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case 'SET_DEALER_OVERRIDE':
      try {
        const updatedCurrentRound = {
          ...state.currentRound,
          dealerOverride: action.payload.dealerOverride,
        };

        setLocalStorage('currentRound', updatedCurrentRound);

        return {
          ...state,
          currentRound: updatedCurrentRound,
        };
      } catch (err) {
        console.error('Error in SET_DEALER_OVERRIDE:', err);
        return state;
      }
    case 'SET_NAMES':
      try {
        const names = { ...action.payload.names };
        setLocalStorage('names', names);
        return {
          ...state,
          names,
        };
      } catch (err) {
        console.error(
          'Error in SET_NAMES (localStorage quota or write error):',
          err,
        );
        return {
          ...state,
          names: action.payload.names,
        };
      }
    case 'SET_NIL_SCORING_RULE':
      try {
        const rule = action.payload.nilScoringRule;
        setLocalStorage('nilScoringRule', rule);
        return {
          ...state,
          nilScoringRule: rule,
        };
      } catch (err) {
        console.error(
          'Error in SET_NIL_SCORING_RULE (localStorage quota or write error):',
          err,
        );
        return {
          ...state,
          nilScoringRule: action.payload.nilScoringRule,
        };
      }
    case 'SET_SCORE_LIMIT':
      try {
        setLocalStorage('scoreLimit', action.payload.scoreLimit);
        return {
          ...state,
          scoreLimit: action.payload.scoreLimit,
        };
      } catch (err) {
        console.error(
          'Error in SET_SCORE_LIMIT (localStorage quota or write error):',
          err,
        );
        return {
          ...state,
          scoreLimit: action.payload.scoreLimit,
        };
      }
    case 'HYDRATE':
      // Viewer mirror: receive the full state pushed by the leader. Deliberately
      // does NOT write to localStorage (a viewer's device shouldn't clobber the
      // leader's own persisted game, and rehydrating live is the point).
      return {
        ...state,
        currentRound: action.payload.currentRound,
        roundHistory: action.payload.roundHistory,
        firstDealerOrder: action.payload.firstDealerOrder,
        isFirstGameAmongTeammates: action.payload.isFirstGameAmongTeammates,
        names: action.payload.names,
        nilScoringRule: action.payload.nilScoringRule,
        scoreLimit: action.payload.scoreLimit ?? null,
      };
    case 'RESTORE_LOCAL':
      // Leaving a viewer/leader session on a device that has its OWN local
      // game: fall back to it. HYDRATE never touched localStorage, so re-running
      // getInitialState re-reads the viewer's own persisted state — undoing the
      // leader's hydrated board.
      return getInitialState();
    case 'SEED_GAME_FROM_VIEW':
      // Leaving a viewer session on a device with NO local game: seed a fresh
      // local game pre-filled with the FULL watched game (names, rounds,
      // dealer order) already rotated to the viewer's seat by the caller. The
      // board must not appear "just started" — the leader's rounds carry over.
      // In-memory only (no localStorage write) so `hasOwnLocalGame()` stays
      // false and the leave flow lands on the name form.
      return { ...action.payload };
    default:
      if (import.meta.env.DEV) {
        console.log('default called');
      }
      return state;
  }
};

export default rootReducer;
