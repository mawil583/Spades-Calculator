import {
  defaultLocalStorage,
  setLocalStorage,
  getLocalStorage,
} from './helperFunctions';
import { t1p1ID, t1p2ID, t2p1ID, t2p2ID } from './constants';

export const initialState = {
  currentRound: {
    team1BidsAndActuals: {
      p1Bid: '',
      p2Bid: '',
      p1Actual: '',
      p2Actual: '',
    },
    team2BidsAndActuals: {
      p1Bid: '',
      p2Bid: '',
      p1Actual: '',
      p2Actual: '',
    },
  },
  roundHistory: defaultLocalStorage('roundHistory', []),
  firstDealerOrder: defaultLocalStorage('firstDealerOrder', [
    t1p1ID,
    t2p1ID,
    t1p2ID,
    t2p2ID,
  ]),
  isFirstGameAmongTeammates: defaultLocalStorage(
    'isFirstGameAmongTeammates',
    true
  ),
};

const rootReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_CURRENT_ROUND':
      return { ...state, currentRound: payload.currentRound };
    case 'RESET_CURRENT_ROUND':
      return {
        ...state,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '',
            p2Bid: '',
            p1Actual: '',
            p2Actual: '',
          },
          team2BidsAndActuals: {
            p1Bid: '',
            p2Bid: '',
            p1Actual: '',
            p2Actual: '',
          },
        },
      };
    case 'RESET_ROUND_HISTORY':
      return {
        ...state,
        roundHistory: [],
      };
    case 'SET_ROUND_HISTORY':
      try {
        setLocalStorage('roundHistory', [...payload.roundHistory]);
        return {
          ...state,
          roundHistory: getLocalStorage('roundHistory'),
        };
      } catch (err) {
        console.error(err);
      }
      break;
    case 'SET_FIRST_DEALER_ORDER':
      try {
        setLocalStorage('firstDealerOrder', [...payload.firstDealerOrder]);
        return {
          ...state,
          firstDealerOrder: getLocalStorage('firstDealerOrder'),
        };
      } catch (err) {
        console.error(err);
      }
      break;
    default:
      console.log('default called');
      return state;
  }
};

export default rootReducer;
