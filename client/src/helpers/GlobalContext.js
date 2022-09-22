import React, { createContext, useReducer } from 'react';
import rootReducer, { initialState } from '../helpers/rootReducer';
import { updateInput } from './helperFunctions';

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

  const resetRoundHistory = () => {
    dispatch({
      type: 'RESET_ROUND_HISTORY',
    });
  };

  const value = {
    setCurrentRound,
    currentRound: state.currentRound,
    roundHistory: state.roundHistory,
    resetCurrentRound,
    setRoundHistory,
    resetRoundHistory,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
