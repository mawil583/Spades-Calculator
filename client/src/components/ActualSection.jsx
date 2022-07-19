import React, { useState } from 'react';
import { SimpleGrid, Center } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';
import { addInputs, isNotDefaultValue } from '../helpers/spadesMath';
import TeamInputHeading from './TeamInputHeading';
import { useValidateActuals } from '../helpers/hooks';
import { actualsErrorText } from '../helpers/helperFunctions';

function ActualSection({
  team1BidsAndActuals,
  team2BidsAndActuals,
  setT1p1Actual,
  t1p1Name,
  setT2p1Actual,
  t2p1Name,
  setT1p2Actual,
  t1p2Name,
  setT2p2Actual,
  t2p2Name,
}) {
  const [isValid, setIsValid] = useState(true);
  const team1Actuals = {
    p1Actual: team1BidsAndActuals?.p1Actual,
    p2Actual: team1BidsAndActuals?.p2Actual,
  };
  const team2Actuals = {
    p1Actual: team2BidsAndActuals?.p1Actual,
    p2Actual: team2BidsAndActuals?.p2Actual,
  };
  const team1ActualTotal = addInputs(
    team1Actuals.p1Actual,
    team1Actuals.p2Actual
  );
  const team2ActualTotal = addInputs(
    team2Actuals.p1Actual,
    team2Actuals.p2Actual
  );

  const roundActuals = [
    team1Actuals.p1Actual,
    team1Actuals.p2Actual,
    team2Actuals.p1Actual,
    team2Actuals.p2Actual,
  ];

  const allActualsAreSubmitted = roundActuals.every(isNotDefaultValue);
  const totalActuals = team1ActualTotal + team2ActualTotal;

  useValidateActuals(allActualsAreSubmitted, totalActuals, setIsValid);

  const errorMessage = actualsErrorText(allActualsAreSubmitted, totalActuals);

  return (
    <div>
      <TeamInputHeading
        team1Total={team1ActualTotal}
        team2Total={team2ActualTotal}
        title='Actuals'
      />
      <Center style={{ visibility: 'hidden' }}>Unclaimed</Center>
      {!isValid && (
        <div
          style={{
            color: 'red',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}
      <SimpleGrid columns={2} className='namesContainer'>
        <PlayerInput
          setValTo={setT1p1Actual}
          id='team1BidsAndActuals.p1Actual'
          playerName={t1p1Name}
          val={team1BidsAndActuals?.p1Actual}
          type={'Actual'}
        />
        <PlayerInput
          setValTo={setT2p1Actual}
          id='team2BidsAndActuals.p1Actual'
          playerName={t2p1Name}
          val={team2BidsAndActuals?.p1Actual}
          type={'Actual'}
        />
        <PlayerInput
          setValTo={setT1p2Actual}
          playerName={t1p2Name}
          id='team1BidsAndActuals.p2Actual'
          val={team1BidsAndActuals?.p2Actual}
          type={'Actual'}
        />
        <PlayerInput
          setValTo={setT2p2Actual}
          playerName={t2p2Name}
          val={team2BidsAndActuals?.p2Actual}
          type={'Actual'}
          id='team2BidsAndActuals.p2Actual'
        />
      </SimpleGrid>
    </div>
  );
}

export default ActualSection;
