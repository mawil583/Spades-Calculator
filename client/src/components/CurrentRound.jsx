import React, { useState, useEffect } from 'react';
import { Container } from '@chakra-ui/react';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';

function CurrentRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;
  const { setRoundHistory, roundHistory, roundNumber } = props;

  // team 1
  const [t1p1Bid, setT1p1Bid] = useState('');
  const [t1p2Bid, setT1p2Bid] = useState('');
  const [t1p1Actual, setT1p1Actual] = useState('');
  const [t1p2Actual, setT1p2Actual] = useState('');
  const team1BidsAndActuals = {
    p1Bid: t1p1Bid,
    p2Bid: t1p2Bid,
    p1Actual: t1p1Actual,
    p2Actual: t1p2Actual,
  };

  // team 2
  const [t2p1Bid, setT2p1Bid] = useState('');
  const [t2p2Bid, setT2p2Bid] = useState('');
  const [t2p1Actual, setT2p1Actual] = useState('');
  const [t2p2Actual, setT2p2Actual] = useState('');
  const team2BidsAndActuals = {
    p1Bid: t2p1Bid,
    p2Bid: t2p2Bid,
    p1Actual: t2p1Actual,
    p2Actual: t2p2Actual,
  };

  const isNotDefaultValue = (value) => {
    return value !== '';
  };

  const resetRoundValues = () => {
    setT1p1Bid('');
    setT1p2Bid('');
    setT1p1Actual('');
    setT1p2Actual('');
    setT2p1Bid('');
    setT2p2Bid('');
    setT2p1Actual('');
    setT2p2Actual('');
  };

  useSetScoreWhenRoundIsFinished(
    team1BidsAndActuals,
    team2BidsAndActuals,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory,
    resetRoundValues,
    t1p1Bid,
    t1p2Bid,
    t1p1Actual,
    t1p2Actual,
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual
  );

  return (
    <>
      <RoundHeading
        roundNumber={roundNumber}
        team1Name={team1Name}
        team2Name={team2Name}
      />
      <form>
        <Container>
          <BidSection
            setT1p1Bid={setT1p1Bid}
            team1BidsAndActuals={team1BidsAndActuals}
            team2BidsAndActuals={team2BidsAndActuals}
            setT2p1Bid={setT2p1Bid}
            setT1p2Bid={setT1p2Bid}
            t1p1Name={t1p1Name}
            t1p2Name={t1p2Name}
            setT2p2Bid={setT2p2Bid}
            t2p1Name={t2p1Name}
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
            props={props}
            t2p1Name={t2p1Name}
            t1p2Name={t1p2Name}
            t2p2Name={t2p2Name}
          />
        </Container>
      </form>
    </>
  );
}

export default CurrentRound;

function useSetScoreWhenRoundIsFinished(
  team1BidsAndActuals,
  team2BidsAndActuals,
  isNotDefaultValue,
  setRoundHistory,
  roundHistory,
  resetRoundValues,
  t1p1Bid,
  t1p2Bid,
  t1p1Actual,
  t1p2Actual,
  t2p1Bid,
  t2p2Bid,
  t2p1Actual,
  t2p2Actual
) {
  useEffect(() => {
    const team1InputVals = Object.values(team1BidsAndActuals);
    const team2InputVals = Object.values(team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;
    if (allBidsAndActualsAreEntered) {
      setRoundHistory([
        ...roundHistory,
        { team1BidsAndActuals, team2BidsAndActuals },
      ]);
      resetRoundValues();
    }
  }, [
    t1p1Bid,
    t1p2Bid,
    t1p1Actual,
    t1p2Actual,
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual,
    team1BidsAndActuals,
    team2BidsAndActuals,
    isNotDefaultValue,
    resetRoundValues,
    setRoundHistory,
    roundHistory,
  ]);
}
