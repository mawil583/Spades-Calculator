import React from 'react';
import { Container } from '@chakra-ui/react';

import { calculateRoundScore } from '../helpers/spadesMath';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';

function PastRound(props) {
  const { roundHistory, roundNumber, index, roundAtIndex, names } = props;

  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    names;
  const { team1BidsAndActuals, team2BidsAndActuals } = roundAtIndex;
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));

  // const roundHistoryAtEndOfThisRound = getRoundHistoryAtCurrentRound(
  //   roundHistory,
  //   index
  // );

  // will need to use when adding accordion feature
  // const team1GameScoreAtEndOfThisRound = calculateTeamScoreFromRoundHistory(
  //   roundHistoryAtEndOfThisRound,
  //   TEAM1,
  //   nilSetting
  // );

  // const team2GameScoreAtEndOfThisRound = calculateTeamScoreFromRoundHistory(
  //   roundHistoryAtEndOfThisRound,
  //   TEAM2,
  //   nilSetting
  // );

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

  return (
    <>
      <RoundHeading
        team1Name={team1Name}
        team2Name={team2Name}
        roundNumber={roundNumber}
      />
      <form>
        <Container>
          <RoundSummary
            team2Name={team2Name}
            team1Name={team1Name}
            team1RoundScore={team1RoundScoreFromHistory?.score}
            team2RoundScore={team2RoundScoreFromHistory?.score}
            // add this back, but only as accordion
            // team1GameScore={team1GameScoreAtEndOfThisRound.teamScore}
            // team2GameScore={team2GameScoreAtEndOfThisRound.teamScore}
            team1RoundBags={team1RoundScoreFromHistory?.bags}
            team2RoundBags={team2RoundScoreFromHistory?.bags}
          />
          <BidSection
            index={index}
            isCurrent={false}
            t1p1Name={t1p1Name}
            t2p1Name={t2p1Name}
            t1p2Name={t1p2Name}
            t2p2Name={t2p2Name}
            team1Name={team1Name}
            team2Name={team2Name}
            roundHistory={roundHistory}
            currentRound={roundAtIndex}
          />
          <Divider />
          <ActualSection
            index={index}
            isCurrent={false}
            t1p1Name={t1p1Name}
            t2p1Name={t2p1Name}
            t1p2Name={t1p2Name}
            t2p2Name={t2p2Name}
            team1Name={team1Name}
            team2Name={team2Name}
            roundHistory={roundHistory}
            currentRound={roundAtIndex}
          />
        </Container>
      </form>
    </>
  );
}

export default PastRound;
