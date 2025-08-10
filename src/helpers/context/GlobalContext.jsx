import React, { createContext, useReducer } from 'react';
import rootReducer, { initialState } from '../utils/rootReducer';
import { updateInput } from '../utils/helperFunctions';

export const GlobalContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const setCurrentRound = ({ input, fieldToUpdate, currentRound }) => {
    const updatedRound = updateInput({ input, fieldToUpdate, currentRound });
    dispatch({
      type: 'SET_CURRENT_ROUND',
      payload: {
        currentRound: updatedRound,
      },
    });
  };

  const resetCurrentRound = () => {
    dispatch({
      type: 'RESET_CURRENT_ROUND',
    });
  };

  const setRoundHistory = (newRoundHistory) => {
    const clonedNewRoundHistory = [...newRoundHistory];
    dispatch({
      type: 'SET_ROUND_HISTORY',
      payload: {
        roundHistory: clonedNewRoundHistory,
      },
    });
  };

  const setFirstDealerOrder = (newFirstDealerOrder) => {
    const clonedNewFirstDealerOrder = [...newFirstDealerOrder];
    dispatch({
      type: 'SET_FIRST_DEALER_ORDER',
      payload: {
        firstDealerOrder: clonedNewFirstDealerOrder,
      },
    });
  };

  const setDealerOverride = (dealerOverride) => {
    dispatch({
      type: 'SET_DEALER_OVERRIDE',
      payload: {
        dealerOverride,
      },
    });
  };

  const resetRoundHistory = () => {
    dispatch({
      type: 'RESET_ROUND_HISTORY',
    });
  };

  const globalStore = {
    setCurrentRound,
    setRoundHistory,
    resetRoundHistory,
    resetCurrentRound,
    setFirstDealerOrder,
    setDealerOverride,
    firstDealerOrder: state.firstDealerOrder,
    currentRound: state.currentRound,
    roundHistory: state.roundHistory,
    isFirstGameAmongTeammates: state.isFirstGameAmongTeammates,
  };

  return (
    <GlobalContext.Provider value={globalStore}>
      {children}
    </GlobalContext.Provider>
  );
};
