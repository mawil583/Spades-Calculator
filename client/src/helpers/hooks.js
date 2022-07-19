import { useState, useEffect } from 'react';
import { BLIND_NIL, NIL } from './constants';

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export function useSetUnclaimed(team1Bids, team2Bids, setNumUnclaimed) {
  useEffect(() => {
    const claimed =
      parseInt(
        Object.values(team1Bids).reduce((accum, bid) => {
          if (bid === '' || bid === NIL || bid === BLIND_NIL) {
            return 0 + accum;
          }
          return parseInt(bid) + parseInt(accum);
        }, 0)
      ) +
      parseInt(
        Object.values(team2Bids).reduce((accum, bid) => {
          if (bid === '' || bid === NIL || bid === BLIND_NIL) {
            return 0 + accum;
          }
          return parseInt(bid) + parseInt(accum);
        }, 0)
      );
    setNumUnclaimed(13 - claimed);
  }, [setNumUnclaimed, team1Bids, team2Bids]);
}

export function useValidateActuals(
  allActualsAreSubmitted,
  totalActuals,
  setIsValid
) {
  useEffect(() => {
    if (allActualsAreSubmitted) {
      if (totalActuals !== 13) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      if (totalActuals > 13) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  }, [totalActuals, allActualsAreSubmitted, setIsValid]);
}
