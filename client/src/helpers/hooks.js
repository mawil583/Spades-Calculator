import { useState, useEffect } from 'react';

import { isNotDefaultValue, addInputs } from './spadesMath';

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
      // if localStorage value does not exist, setLocalStorage
      if (!item) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      // if localStorage does exist, then return stored localStorage value
      return JSON.parse(item);
    } catch (error) {
      // If error also return initialValue
      console.error(error);
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
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

export function useRedirectWhenFalsey(names, navigate) {
  useEffect(() => {
    if (!names) {
      navigate('/');
    } else {
      const nameVals = Object.values(names);
      if (!nameVals.every(isNotDefaultValue)) {
        navigate('/');
      }
    }
  });
}

export function useSetUnclaimed(team1Bids, team2Bids, setNumUnclaimed) {
  useEffect(() => {
    const totalClaimed = addInputs(...team1Bids, ...team2Bids);
    setNumUnclaimed(13 - totalClaimed);
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
