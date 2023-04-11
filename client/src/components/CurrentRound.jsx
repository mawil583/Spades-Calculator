import React, { useContext, useEffect } from 'react';
import { Container } from '@chakra-ui/react';

import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import Divider from './Divider';
import { isNotDefaultValue } from '../helpers/spadesMath';
import { GlobalContext } from '../helpers/GlobalContext';

function CurrentRound(props) {
  const { roundHistory, roundNumber } = props;
  console.log({props})
  const { currentRound, resetCurrentRound, setRoundHistory } =
    useContext(GlobalContext);

  const roundIndex = roundHistory.length + 1;

  // move this to hooks.js!
  useSetScoreWhenRoundIsFinished(
    currentRound,
    resetCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory
  );

  return (
    <>
      <RoundHeading
        roundNumber={roundNumber}
        names={props.names}
      />
      <form>
        <Container>
          <BidSection
            names={props.names}
            isCurrent={true}
            index={roundIndex}
            roundHistory={roundHistory}
            currentRound={currentRound}
          />
          <Divider />
          <ActualSection
            names={props.names}
            isCurrent={true}
            index={roundIndex}
            roundHistory={roundHistory}
            currentRound={currentRound}
          />
        </Container>
      </form>
    </>
  );
}

export default CurrentRound;

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
