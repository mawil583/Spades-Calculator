import React from 'react';
import { Container } from '@chakra-ui/react';

import {
  calculateRoundScore,
  calculateScoreFromRoundHistory,
  calculateRoundHistoryAtCurrentRound,
} from '../helpers/spadesMath';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';

function SpadesRound(props) {
  const { roundHistory, index, team1BidsAndActuals, team2BidsAndActuals } =
    props;
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const roundHistoryAtEndOfThisRound = calculateRoundHistoryAtCurrentRound(
    roundHistory,
    index
  );

  const gameScoreAtEndOfThisRound = calculateScoreFromRoundHistory(
    roundHistoryAtEndOfThisRound
  );

  const roundData = roundHistory[index];

  const team1RoundScoreFromHistory = calculateRoundScore(
    roundData.team1BidsAndActuals.p1Bid,
    roundData.team1BidsAndActuals.p2Bid,
    roundData.team1BidsAndActuals.p1Actual,
    roundData.team1BidsAndActuals.p2Actual
  );
  const team2RoundScoreFromHistory = calculateRoundScore(
    roundData.team2BidsAndActuals.p1Bid,
    roundData.team2BidsAndActuals.p2Bid,
    roundData.team2BidsAndActuals.p1Actual,
    roundData.team2BidsAndActuals.p2Actual
  );

  return (
    <>
      <RoundHeading props={props} team1Name={team1Name} team2Name={team2Name} />
      <form>
        <Container>
          <RoundSummary
            team1RoundScore={team1RoundScoreFromHistory?.score}
            team2RoundScore={team2RoundScoreFromHistory?.score}
            team1GameScore={gameScoreAtEndOfThisRound.team1Score}
            team2GameScore={gameScoreAtEndOfThisRound.team2Score}
            team1RoundBags={team1RoundScoreFromHistory?.bags}
            team2RoundBags={team2RoundScoreFromHistory?.bags}
          />
          <BidSection
            team1BidsAndActuals={team1BidsAndActuals}
            team2BidsAndActuals={team2BidsAndActuals}
            t1p1Name={t1p1Name}
            t2p1Name={t2p1Name}
            t1p2Name={t1p2Name}
            t2p2Name={t2p2Name}
          />
          <Divider />
          <ActualSection
            team1BidsAndActuals={team1BidsAndActuals}
            team2BidsAndActuals={team2BidsAndActuals}
            t1p1Name={t1p1Name}
            t2p1Name={t2p1Name}
            t1p2Name={t1p2Name}
            t2p2Name={t2p2Name}
          />
        </Container>
      </form>
    </>
  );
}

export default SpadesRound;
