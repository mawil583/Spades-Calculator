import { useState, useEffect, useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import {
  isNotDefaultValue,
  addInputs,
  calculateTeamScoreFromRoundHistory,
  calculateRoundScore
} from '../math/spadesMath';
import { TEAM1, TEAM2 } from './constants';

import type { Names, Round, NilSetting, TeamKey, InputValue } from '../../types';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
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
  const setValue = (value: T | ((val: T) => T)) => {
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

export function useRedirectWhenFalsey(names: Names | null, navigate: (path: string) => void) {
  useEffect(() => {
    if (!names) {
      navigate('/');
    } else {
      const nameVals = Object.values(names);
      if (!nameVals.every(isNotDefaultValue)) {
        navigate('/');
      }
    }
  }, [names, navigate]);
}

export function useSetUnclaimed(team1Bids: (string | number)[], team2Bids: (string | number)[], setNumUnclaimed: (num: number) => void) {
  useEffect(() => {
    const totalClaimed: number = addInputs(...team1Bids, ...team2Bids);
    const unclaimed = 13 - totalClaimed;
    setNumUnclaimed(unclaimed);
  }, [setNumUnclaimed, team1Bids, team2Bids]);
}

export function useValidateActuals(
  allActualsAreSubmitted: boolean,
  totalActuals: number,
  setIsValid: (isValid: boolean | ((prev: boolean) => boolean)) => void
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

export function useIndependentTeamScoring(
  currentRound: Round,
  resetCurrentRound: () => void,
  isNotDefaultValueFn: (val: InputValue) => boolean,
  setRoundHistory: (history: Round[]) => void,
  roundHistory: Round[]
) {
  useEffect(() => {
    const team1InputVals = Object.values(currentRound.team1BidsAndActuals);
    const team2InputVals = Object.values(currentRound.team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValueFn);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValueFn);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;

    if (allBidsAndActualsAreEntered) {
      // Validate that actuals add up to 13 before completing the round
      const team1Actuals = [
        currentRound.team1BidsAndActuals.p1Actual,
        currentRound.team1BidsAndActuals.p2Actual,
      ];
      const team2Actuals = [
        currentRound.team2BidsAndActuals.p1Actual,
        currentRound.team2BidsAndActuals.p2Actual,
      ];

      const totalActuals = [...team1Actuals, ...team2Actuals].reduce(
        (sum: number, actual) => sum + parseInt(String(actual) || "0"),
        0
      );

      // Only complete the round if actuals are valid (add up to 13)
      if (totalActuals === 13) {
        // Preserve the dealer override when adding to round history
        const roundToAdd = { ...currentRound };
        setRoundHistory([...roundHistory, roundToAdd]);
        resetCurrentRound();
      }
    }
  }, [
    currentRound,
    resetCurrentRound,
    isNotDefaultValueFn,
    setRoundHistory,
    roundHistory,
  ]);
}

// Helper function to calculate score for a team in the current round
function calculateCurrentRoundTeamScore(
  currentRound: Round | null,
  teamKey: TeamKey,
  nilSetting: NilSetting | null,
  isNotDefaultValue: (val: InputValue) => boolean
) {
  if (!currentRound) {
    return { teamScore: 0, teamBags: 0 };
  }

  const teamData = currentRound[teamKey];
  if (!teamData) {
    return { teamScore: 0, teamBags: 0 };
  }

  // Check if this team has completed their actuals
  const teamInputVals = Object.values(teamData);
  const teamInputsAreEntered = teamInputVals.every(isNotDefaultValue);

  if (!teamInputsAreEntered) {
    return { teamScore: 0, teamBags: 0 };
  }

  // Calculate the round score for this team
  const roundScore = calculateRoundScore(
    teamData.p1Bid,
    teamData.p2Bid,
    teamData.p1Actual,
    teamData.p2Actual,
    nilSetting ?? undefined
  );

  return {
    teamScore: roundScore.score,
    teamBags: roundScore.bags,
  };
}

export function useGameScores() {
  const context = useContext(GlobalContext);
  const roundHistory = context?.roundHistory;
  const currentRound = context?.currentRound || null;

  // Safe generic read?
  const nilSettingStr = typeof window !== 'undefined' ? localStorage.getItem('nilScoringRule') : null;
  const nilSetting: NilSetting | null = nilSettingStr ? JSON.parse(nilSettingStr) : null;

  // Memoize history score calculation
  const historyScores = useMemo(() => {
    const history = roundHistory || [];
    const team1 = calculateTeamScoreFromRoundHistory(
      history,
      TEAM1,
      nilSetting
    );
    const team2 = calculateTeamScoreFromRoundHistory(
      history,
      TEAM2,
      nilSetting
    );
    return { team1, team2 };
  }, [roundHistory, nilSetting]);

  // Memoize current round score calculation
  const currentScores = useMemo(() => {
    const team1 = calculateCurrentRoundTeamScore(
      currentRound,
      TEAM1,
      nilSetting,
      isNotDefaultValue
    );
    const team2 = calculateCurrentRoundTeamScore(
      currentRound,
      TEAM2,
      nilSetting,
      isNotDefaultValue
    );
    return { team1, team2 };
  }, [currentRound, nilSetting]);

  // Memoize final result
  return useMemo(() => {
    const team1Score = {
      teamScore: historyScores.team1.teamScore + currentScores.team1.teamScore,
      teamBags: historyScores.team1.teamBags + currentScores.team1.teamBags,
    };

    const team2Score = {
      teamScore: historyScores.team2.teamScore + currentScores.team2.teamScore,
      teamBags: historyScores.team2.teamBags + currentScores.team2.teamBags,
    };

    return { team1Score, team2Score };
  }, [historyScores, currentScores]);
}
