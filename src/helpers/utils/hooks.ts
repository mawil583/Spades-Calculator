import { useState, useEffect, useContext, useMemo } from 'react';
import { GlobalContext } from '../../store/GlobalContext';
import {
  isNotDefaultValue,
  addInputs,
  convertStringInputToNum,
  calculateTeamScoreFromRoundHistory,
  calculateRoundScore,
  isRoundComplete,
} from '../math/spadesMath';
import { TEAM1, TEAM2 } from './constants';

import type {
  Names,
  Round,
  NilSetting,
  TeamKey,
  InputValue,
  SessionRole,
} from '../../types';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
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

export function useRedirectWhenFalsey(
  names: Names | null,
  navigate: (path: string) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    if (!names) {
      navigate('/');
    } else {
      const nameVals = Object.values(names);
      if (!nameVals.every(isNotDefaultValue)) {
        navigate('/');
      }
    }
  }, [names, navigate, enabled]);
}

export function useSetUnclaimed(
  team1Bids: InputValue[],
  team2Bids: InputValue[],
  setNumUnclaimed: (num: number) => void,
) {
  useEffect(() => {
    const totalClaimed: number = addInputs(...team1Bids, ...team2Bids);
    const unclaimed = 13 - totalClaimed;
    setNumUnclaimed(unclaimed);
  }, [setNumUnclaimed, team1Bids, team2Bids]);
}

export function useValidateActuals(
  allActualsAreSubmitted: boolean,
  totalActuals: number,
  setIsValid: (isValid: boolean | ((prev: boolean) => boolean)) => void,
) {
  useEffect(() => {
    setIsValid(
      allActualsAreSubmitted ? totalActuals === 13 : totalActuals <= 13,
    );
  }, [totalActuals, allActualsAreSubmitted, setIsValid]);
}

export function useIndependentTeamScoring(
  currentRound: Round,
  resetCurrentRound: () => void,
  isNotDefaultValueFn: (val: InputValue) => boolean,
  setRoundHistory: (history: Round[]) => void,
  roundHistory: Round[],
  role: SessionRole = 'local',
) {
  useEffect(() => {
    // A viewer mirrors the leader's board read-only. Completing a round is a
    // leader-only side effect — running it on a viewer would mutate their
    // local state (and localStorage) out from under the hydrated leader state.
    if (role === 'viewer') return;

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
        (sum: number, actual) => sum + convertStringInputToNum(actual),
        0,
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
    role,
  ]);
}

// Helper function to calculate score for a team in the current round
function calculateCurrentRoundTeamScore(
  currentRound: Round | null,
  teamKey: TeamKey,
  nilSetting: NilSetting | null,
  isNotDefaultValue: (val: InputValue) => boolean,
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
    nilSetting ?? undefined,
  );

  return {
    teamScore: roundScore.score,
    teamBags: roundScore.bags,
  };
}

export function useHistoryTeamScores(
  roundHistory: Round[] | null,
  nilSetting: NilSetting | null,
) {
  return useMemo(
    () => ({
      team1: calculateTeamScoreFromRoundHistory(
        roundHistory || [],
        TEAM1,
        nilSetting,
      ),
      team2: calculateTeamScoreFromRoundHistory(
        roundHistory || [],
        TEAM2,
        nilSetting,
      ),
    }),
    [roundHistory, nilSetting],
  );
}

export function useGameScores() {
  const context = useContext(GlobalContext);
  const roundHistory = context?.viewRoundHistory ?? context?.roundHistory;
  const currentRound = context?.viewCurrentRound || null;
  const nilSetting = context?.nilScoringRule ?? null;

  // Memoize history score calculation
  const historyScores = useHistoryTeamScores(roundHistory, nilSetting);

  // Memoize current round score calculation
  const currentScores = useMemo(() => {
    const team1 = calculateCurrentRoundTeamScore(
      currentRound,
      TEAM1,
      nilSetting,
      isNotDefaultValue,
    );
    const team2 = calculateCurrentRoundTeamScore(
      currentRound,
      TEAM2,
      nilSetting,
      isNotDefaultValue,
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

/**
 * Scores counting only COMPLETED play: banked round history plus the current
 * round once every bid/actual is entered and the actuals total 13. This is the
 * basis for win detection and the floor for replacement score limits — partial
 * rounds must never trigger (or gate) a game-end decision.
 */
export function useFinishedGameScores() {
  const context = useContext(GlobalContext);
  const roundHistory = context?.viewRoundHistory ?? context?.roundHistory;
  const currentRound = context?.viewCurrentRound || null;
  const nilSetting = context?.nilScoringRule ?? null;

  const historyScores = useHistoryTeamScores(roundHistory, nilSetting);

  return useMemo(() => {
    let team1 = historyScores.team1.teamScore;
    let team2 = historyScores.team2.teamScore;

    if (isRoundComplete(currentRound)) {
      const team1Actuals = currentRound.team1BidsAndActuals;
      const team2Actuals = currentRound.team2BidsAndActuals;
      team1 += calculateRoundScore(
        team1Actuals.p1Bid,
        team1Actuals.p2Bid,
        team1Actuals.p1Actual,
        team1Actuals.p2Actual,
        nilSetting ?? undefined,
      ).score;
      team2 += calculateRoundScore(
        team2Actuals.p1Bid,
        team2Actuals.p2Bid,
        team2Actuals.p1Actual,
        team2Actuals.p2Actual,
        nilSetting ?? undefined,
      ).score;
    }

    return { team1, team2 };
  }, [historyScores, currentRound, nilSetting]);
}
