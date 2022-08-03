import React, { useState, useEffect } from 'react';
import { Container } from '@chakra-ui/react';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';
import { isNotDefaultValue } from '../helpers/spadesMath';
import { initialCurrentRound } from '../helpers/constants';

function CurrentRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.names;
  const { setRoundHistory, roundHistory, roundNumber } = props;

  const [currentRound, setCurrentRound] = useState(initialCurrentRound);
  console.log({ currentRound }); // undefined after all inputs are entered

  useSetScoreWhenRoundIsFinished(
    initialCurrentRound,
    currentRound,
    setCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory
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
            t1p1Name={t1p1Name}
            t1p2Name={t1p2Name}
            t2p1Name={t2p1Name}
            t2p2Name={t2p2Name}
            setRound={setCurrentRound}
            currentRound={currentRound}
          />
          <Divider />
          <ActualSection
            props={props}
            t1p1Name={t1p1Name}
            t2p1Name={t2p1Name}
            t1p2Name={t1p2Name}
            t2p2Name={t2p2Name}
            setRound={setCurrentRound}
            currentRound={currentRound}
          />
        </Container>
      </form>
    </>
  );
}

export default CurrentRound;

function useSetScoreWhenRoundIsFinished(
  initialCurrentRound,
  currentRound,
  setCurrentRound,
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
      setCurrentRound(initialCurrentRound);
    }
  }, [
    initialCurrentRound,
    currentRound,
    setCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory,
  ]);
}
