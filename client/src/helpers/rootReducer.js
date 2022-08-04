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
    default:
      return state;
  }
};

export default rootReducer;
