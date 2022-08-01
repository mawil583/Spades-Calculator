import React from 'react';
import { Container } from '@chakra-ui/react';

import {
  calculateRoundScore,
  getRoundHistoryAtCurrentRound,
  calculateTeamScoreFromRoundHistory,
} from '../helpers/spadesMath';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';
import { TEAM1, TEAM2 } from '../helpers/constants';

function PastRound(props) {
  const {
    roundHistory,
    roundNumber,
    index,
    team1BidsAndActuals,
    team2BidsAndActuals,
    setRoundHistory,
    names,
  } = props;

  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    names;
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));

  const roundData = roundHistory[index];

  const roundHistoryAtEndOfThisRound = getRoundHistoryAtCurrentRound(
    roundHistory,
    index
  );

  const team1GameScoreAtEndOfThisRound = calculateTeamScoreFromRoundHistory(
    roundHistoryAtEndOfThisRound,
    TEAM1,
    nilSetting
  );

  const team2GameScoreAtEndOfThisRound = calculateTeamScoreFromRoundHistory(
    roundHistoryAtEndOfThisRound,
    TEAM2,
    nilSetting
  );

  const team1RoundScoreFromHistory = calculateRoundScore(
    roundData.team1BidsAndActuals.p1Bid,
    roundData.team1BidsAndActuals.p2Bid,
    roundData.team1BidsAndActuals.p1Actual,
    roundData.team1BidsAndActuals.p2Actual,
    nilSetting
  );
  const team2RoundScoreFromHistory = calculateRoundScore(
    roundData.team2BidsAndActuals.p1Bid,
    roundData.team2BidsAndActuals.p2Bid,
    roundData.team2BidsAndActuals.p1Actual,
    roundData.team2BidsAndActuals.p2Actual,
    nilSetting
  );

  const setT1p1Bid = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team1BidsAndActuals.p1Bid = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT1p2Bid = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team1BidsAndActuals.p2Bid = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT2p1Bid = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team2BidsAndActuals.p1Bid = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT2p2Bid = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team2BidsAndActuals.p2Bid = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT1p1Actual = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team1BidsAndActuals.p1Actual = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT1p2Actual = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team1BidsAndActuals.p2Actual = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT2p1Actual = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team2BidsAndActuals.p1Actual = val;
    setRoundHistory([...clonedRoundHistory]);
  };
  const setT2p2Actual = (val) => {
    const clonedRoundHistory = [...roundHistory];
    clonedRoundHistory[index].team2BidsAndActuals.p2Actual = val;
    setRoundHistory([...clonedRoundHistory]);
  };

  return (
    <>
      <RoundHeading
        roundNumber={roundNumber}
        team1Name={team1Name}
        team2Name={team2Name}
      />
      <form>
        <Container>
          <RoundSummary
            team1RoundScore={team1RoundScoreFromHistory?.score}
            team2RoundScore={team2RoundScoreFromHistory?.score}
            team1GameScore={team1GameScoreAtEndOfThisRound.teamScore}
            team2GameScore={team2GameScoreAtEndOfThisRound.teamScore}
            team1RoundBags={team1GameScoreAtEndOfThisRound?.teamBags}
            team2RoundBags={team2GameScoreAtEndOfThisRound?.teamBags}
          />
          <BidSection
            setT1p1Bid={setT1p1Bid}
            setT1p2Bid={setT1p2Bid}
            setT2p1Bid={setT2p1Bid}
            setT2p2Bid={setT2p2Bid}
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
            setT1p1Actual={setT1p1Actual}
            setT1p2Actual={setT1p2Actual}
            setT2p1Actual={setT2p1Actual}
            setT2p2Actual={setT2p2Actual}
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

export default PastRound;
