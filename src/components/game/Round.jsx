import React, { useEffect, useContext } from 'react';
import { Container } from '@chakra-ui/react';

import {
  calculateRoundScore,
  isNotDefaultValue,
} from '../../helpers/math/spadesMath';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import { Divider } from '../../components/ui';
import { GlobalContext } from '../../helpers/context/GlobalContext';

function Round({ roundHistory, isCurrent = false, roundIndex }) {
  const names = JSON.parse(localStorage.getItem('names'));
  const { team1Name, team2Name } = names;
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));
  const { currentRound, resetCurrentRound, setRoundHistory } =
    useContext(GlobalContext);

  const roundAtIndex = isCurrent ? null : roundHistory?.[roundIndex] ?? null;
  const roundInputs = isCurrent ? currentRound : roundAtIndex;

  // Always call hooks before any early returns
  useSetScoreWhenRoundIsFinished(
    currentRound,
    resetCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory
  );

  // If this is a past round and the round data is missing or malformed, skip rendering this round
  if (!isCurrent) {
    const hasValidStructure =
      roundInputs &&
      roundInputs.team1BidsAndActuals &&
      roundInputs.team2BidsAndActuals;
    if (!hasValidStructure) {
      return null;
    }
  }

  const roundInputBids = [
    roundInputs.team1BidsAndActuals.p1Bid,
    roundInputs.team1BidsAndActuals.p2Bid,
    roundInputs.team2BidsAndActuals.p1Bid,
    roundInputs.team2BidsAndActuals.p2Bid,
  ];

  function getTeamsScoresFromHistory() {
    if (roundAtIndex) {
      const { team1BidsAndActuals, team2BidsAndActuals } = roundAtIndex;
      const team1RoundScoreFromHistory = calculateRoundScore(
        team1BidsAndActuals.p1Bid,
        team1BidsAndActuals.p2Bid,
        team1BidsAndActuals.p1Actual,
        team1BidsAndActuals.p2Actual,
        nilSetting
      );
      const team2RoundScoreFromHistory = calculateRoundScore(
        team2BidsAndActuals.p1Bid,
        team2BidsAndActuals.p2Bid,
        team2BidsAndActuals.p1Actual,
        team2BidsAndActuals.p2Actual,
        nilSetting
      );

      return { team1RoundScoreFromHistory, team2RoundScoreFromHistory };
    }
  }
  const teamScores = getTeamsScoresFromHistory();

  return (
    <div className="round">
      <RoundHeading roundNumber={roundIndex + 1} names={names} />
      <form>
        <Container>
          {!isCurrent && (
            <RoundSummary
              team2Name={team2Name}
              team1Name={team1Name}
              team1RoundScore={teamScores?.team1RoundScoreFromHistory?.score}
              team2RoundScore={teamScores?.team2RoundScoreFromHistory?.score}
              // add this back, but only as accordion
              // team1GameScore={team1GameScoreAtEndOfThisRound.teamScore}
              // team2GameScore={team2GameScoreAtEndOfThisRound.teamScore}
              team1RoundBags={teamScores?.team1RoundScoreFromHistory?.bags}
              team2RoundBags={teamScores?.team2RoundScoreFromHistory?.bags}
            />
          )}

          <BidSection
            names={names}
            isCurrent={isCurrent}
            index={roundIndex}
            roundHistory={roundHistory}
            currentRound={isCurrent ? currentRound : roundAtIndex}
          />
          <Divider />
          {roundInputBids.every(isNotDefaultValue) && (
            <ActualSection
              names={names}
              isCurrent={isCurrent}
              index={roundIndex}
              roundHistory={roundHistory}
              currentRound={isCurrent ? currentRound : roundAtIndex}
            />
          )}
        </Container>
      </form>
    </div>
  );
}

export default Round;

function useSetScoreWhenRoundIsFinished(
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
      setRoundHistory([...roundHistory, { ...currentRound }]);
      resetCurrentRound();
    }
  }, [
    currentRound,
    resetCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory,
  ]);
}
