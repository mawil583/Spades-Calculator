import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  SimpleGrid,
  Center,
  Heading,
  Flex,
  Box,
  calc,
} from '@chakra-ui/react';
import PlayerInput from './PlayerInput';

import {
  calculateRoundScoreNew,
  calculateScoreFromRoundHistory,
  calculateRoundHistoryAtCurrentRound,
} from '../helpers/spadesMath';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';

function SpadesRound(props) {
  const { roundHistory, index } = props;
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const team1RoundScoreFromHistory = calculateRoundScoreNew(
    roundHistory[index].team1BidsAndActuals.p1Bid,
    roundHistory[index].team1BidsAndActuals.p2Bid,
    roundHistory[index].team1BidsAndActuals.p1Actual,
    roundHistory[index].team1BidsAndActuals.p2Actual
  );
  const team2RoundScoreFromHistory = calculateRoundScoreNew(
    roundHistory[index].team2BidsAndActuals.p1Bid,
    roundHistory[index].team2BidsAndActuals.p2Bid,
    roundHistory[index].team2BidsAndActuals.p1Actual,
    roundHistory[index].team2BidsAndActuals.p2Actual
  );

  const roundHistoryAtEndOfThisRound = calculateRoundHistoryAtCurrentRound(
    roundHistory,
    index
  );
  const gameScoreAtEndOfThisRound = calculateScoreFromRoundHistory(
    roundHistoryAtEndOfThisRound
  );

  const [team1RoundScore, setTeam1RoundScore] = useState(
    team1RoundScoreFromHistory?.score || 0
  );
  const [team2RoundScore, setTeam2RoundScore] = useState(
    team2RoundScoreFromHistory?.score || 0
  );
  const [team1GameScore, setTeam1GameScore] = useState(
    gameScoreAtEndOfThisRound.team1Score
  );
  const [team1RoundBags, setTeam1RoundBags] = useState(
    team1RoundScoreFromHistory?.bags || 0
  );
  const [team2RoundBags, setTeam2RoundBags] = useState(
    team2RoundScoreFromHistory?.bags || 0
  );
  const [team2GameScore, setTeam2GameScore] = useState(
    gameScoreAtEndOfThisRound.team2Score
  );

  const browserRounds = JSON.parse(localStorage.getItem('rounds'));
  const browserRound = browserRounds ? browserRounds[props.index] : undefined;

  const isStoredInBrowser = () => {
    if (browserRound) {
      return true;
    }
    return false;
  };

  // team 1
  const [t1p1Bid, setT1p1Bid] = useState(
    isStoredInBrowser() ? browserRound.team1BidsAndActuals.p1Bid : ''
  );
  const [t1p2Bid, setT1p2Bid] = useState(
    isStoredInBrowser() ? browserRound.team1BidsAndActuals.p2Bid : ''
  );
  const [t1p1Actual, setT1p1Actual] = useState(
    isStoredInBrowser() ? browserRound.team1BidsAndActuals.p1Actual : ''
  );
  const [t1p2Actual, setT1p2Actual] = useState(
    isStoredInBrowser() ? browserRound.team1BidsAndActuals.p2Actual : ''
  );

  // team 2
  const [t2p1Bid, setT2p1Bid] = useState(
    isStoredInBrowser() ? browserRound.team2BidsAndActuals.p1Bid : ''
  );
  const [t2p2Bid, setT2p2Bid] = useState(
    isStoredInBrowser() ? browserRound.team2BidsAndActuals.p2Bid : ''
  );
  const [t2p1Actual, setT2p1Actual] = useState(
    isStoredInBrowser() ? browserRound.team2BidsAndActuals.p1Actual : ''
  );
  const [t2p2Actual, setT2p2Actual] = useState(
    isStoredInBrowser() ? browserRound.team2BidsAndActuals.p2Actual : ''
  );

  return (
    <div>
      <RoundHeading props={props} team1Name={team1Name} team2Name={team2Name} />
      <form>
        <div>
          <Container>
            <RoundSummary
              team1RoundScore={team1RoundScore}
              team2RoundScore={team2RoundScore}
              team1GameScore={team1GameScore}
              team2GameScore={team2GameScore}
              team1RoundBags={team1RoundBags}
              team2RoundBags={team2RoundBags}
            />
            <BidSection
              setT1p1Bid={setT1p1Bid}
              t1p1Name={t1p1Name}
              props={props}
              setT2p1Bid={setT2p1Bid}
              t2p1Name={t2p1Name}
              setT1p2Bid={setT1p2Bid}
              t1p2Name={t1p2Name}
              setT2p2Bid={setT2p2Bid}
              t2p2Name={t2p2Name}
            />
            <Divider />
            <ActualSection
              setT1p1Actual={setT1p1Actual}
              t1p1Name={t1p1Name}
              props={props}
              setT2p1Actual={setT2p1Actual}
              t2p1Name={t2p1Name}
              setT1p2Actual={setT1p2Actual}
              t1p2Name={t1p2Name}
              setT2p2Actual={setT2p2Actual}
              t2p2Name={t2p2Name}
            />
          </Container>
          <div></div>
        </div>
      </form>
    </div>
  );
}

export default SpadesRound;
