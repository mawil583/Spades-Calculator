import React, { useState } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';
import { addInputs, isNotDefaultValue } from '../helpers/spadesMath';
import TeamInputHeading from './TeamInputHeading';
import { useValidateActuals } from '../helpers/hooks';
import { actualsErrorText } from '../helpers/helperFunctions';

function ActualSection({
  index,
  t1p1Name,
  t1p2Name,
  t2p1Name,
  t2p2Name,
  isCurrent,
  team1Name,
  team2Name,
  roundHistory,
  currentRound,
}) {
  const { team1BidsAndActuals, team2BidsAndActuals } = currentRound;
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
      {!isValid && (
        <div
          style={{
            color: '#f95050',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}
      <SimpleGrid
        columns={2}
        className='namesContainer'
        style={{ marginTop: '5px' }}
      >
        <PlayerInput
          roundHistory={roundHistory}
          teamName={team1Name}
          index={index}
          isCurrent={isCurrent}
          type={'Actual'}
          playerName={t1p1Name}
          currentRound={currentRound}
          id='team1BidsAndActuals.p1Actual'
          fieldToUpdate={'team1BidsAndActuals.p1Actual'}
          playerInput={team1BidsAndActuals?.p1Actual}
        />
        <PlayerInput
          roundHistory={roundHistory}
          teamName={team2Name}
          index={index}
          isCurrent={isCurrent}
          currentRound={currentRound}
          id='team2BidsAndActuals.p1Actual'
          fieldToUpdate={'team2BidsAndActuals.p1Actual'}
          playerName={t2p1Name}
          playerInput={team2BidsAndActuals?.p1Actual}
          type={'Actual'}
        />
        <PlayerInput
          teamName={team1Name}
          roundHistory={roundHistory}
          index={index}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={t1p2Name}
          id='team1BidsAndActuals.p2Actual'
          fieldToUpdate={'team1BidsAndActuals.p2Actual'}
          playerInput={team1BidsAndActuals?.p2Actual}
          type={'Actual'}
        />
        <PlayerInput
          teamName={team2Name}
          roundHistory={roundHistory}
          index={index}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={t2p2Name}
          playerInput={team2BidsAndActuals?.p2Actual}
          type={'Actual'}
          id='team2BidsAndActuals.p2Actual'
          fieldToUpdate={'team2BidsAndActuals.p2Actual'}
        />
      </SimpleGrid>
    </div>
  );
}

export default ActualSection;
