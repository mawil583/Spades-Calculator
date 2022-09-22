import { setInitialRoundHistory } from './helperFunctions';

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
  roundHistory: setInitialRoundHistory(),
};

const rootReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_CURRENT_ROUND':
      return { ...state, currentRound: payload.currentRound };
    case 'RESET_CURRENT_ROUND':
      console.log({ state });
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
        const item = window.localStorage.getItem('roundHistory');
        if (!item) {
          window.localStorage.setItem('roundHistory', JSON.stringify([]));
          return { ...state, roundHistory: [] };
        }
        console.log('set round history from reducer');
        window.localStorage.setItem(
          'roundHistory',
          JSON.stringify([...payload.roundHistory])
        );
        return {
          ...state,
          roundHistory: [...payload.roundHistory],
        };
      } catch (err) {
        console.error(err);
      }
      break;
    // return {
    //   ...state,
    //   roundHistory: [...payload.roundHistory],
    // };
    default:
      // make sure to attach roundHistory to this
      // return state;
      console.log('default called');

      const item = window.localStorage.getItem('roundHistory');
      if (!item) {
        window.localStorage.setItem('roundHistory', JSON.stringify([]));
        return { ...state, roundHistory: [] };
      }
      //  return JSON.parse(item);
      return { ...state, roundHistory: JSON.parse(item) };
  }
};

export default rootReducer;
