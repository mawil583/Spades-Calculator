import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { 
  isNotDefaultValue, 
  addInputs, 
  calculateTeamScoreFromRoundHistory,
  calculateRoundScore
} from '../math/spadesMath';
import { TEAM1, TEAM2 } from './constants';

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
  }, [names, navigate]);
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

export function useIndependentTeamScoring(
  currentRound,
  resetCurrentRound,
  isNotDefaultValue,
  setRoundHistory,
  roundHistory
) {
  useEffect(() => {
    const team1InputVals = Object.values(currentRound.team1BidsAndActuals);
    const team2InputVals = Object.values(currentRound.team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
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
        (sum, actual) => sum + parseInt(actual || 0),
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
    isNotDefaultValue,
    setRoundHistory,
    roundHistory,
  ]);
}

// Helper function to calculate score for a team in the current round
function calculateCurrentRoundTeamScore(
  currentRound,
  teamKey,
  nilSetting,
  isNotDefaultValue
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
    nilSetting
  );

  return {
    teamScore: roundScore.score,
    teamBags: roundScore.bags,
  };
}

export function useGameScores() {
  const { roundHistory, currentRound } = useContext(GlobalContext);
  // We can't use localStorage inside the hook directly during render if it's not state/effect managed?
  // Actually, hooks called at top level is fine. 
  // However, localStorage might be slow or not updated? 
  // GameScore.jsx did: const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));
  // We should probably just read it once or use a hook for it.
  // For now, let's just do what GameScore did.
  
  // Safe generic read?
  const nilSetting = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('nilScoringRule')) : null;

  // Calculate scores from completed rounds
  const team1ScoreFromHistory = calculateTeamScoreFromRoundHistory(
    roundHistory,
    TEAM1,
    nilSetting
  );
  const team2ScoreFromHistory = calculateTeamScoreFromRoundHistory(
    roundHistory,
    TEAM2,
    nilSetting
  );

  // Calculate scores from current round if teams have completed their actuals
  const team1CurrentRoundScore = calculateCurrentRoundTeamScore(
    currentRound,
    TEAM1,
    nilSetting,
    isNotDefaultValue
  );
  const team2CurrentRoundScore = calculateCurrentRoundTeamScore(
    currentRound,
    TEAM2,
    nilSetting,
    isNotDefaultValue
  );

  // Combine scores from history and current round
  const team1Score = {
    teamScore:
      team1ScoreFromHistory.teamScore + team1CurrentRoundScore.teamScore,
    teamBags: team1ScoreFromHistory.teamBags + team1CurrentRoundScore.teamBags,
  };
  const team2Score = {
    teamScore:
      team2ScoreFromHistory.teamScore + team2CurrentRoundScore.teamScore,
    teamBags: team2ScoreFromHistory.teamBags + team2CurrentRoundScore.teamBags,
  };

  return { team1Score, team2Score };
}
