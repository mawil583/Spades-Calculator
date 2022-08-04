import React, { createContext, useReducer } from 'react';
import rootReducer, { initialState } from '../helpers/rootReducer';

export const GlobalContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const setCurrentRound = (input, fieldToUpdate) => {
    const [team, player] = fieldToUpdate.split('.');
    const clonedCurrentRound = { ...state.currentRound };
    clonedCurrentRound[team][player] = input;
    dispatch({
      type: 'SET_CURRENT_ROUND',
      payload: {
        currentRound: clonedCurrentRound,
      },
    });
  };

  const resetCurrentRound = () => {
    dispatch({
      type: 'RESET_CURRENT_ROUND',
    });
  };

  const value = {
    setCurrentRound,
    currentRound: state.currentRound,
    resetCurrentRound,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
