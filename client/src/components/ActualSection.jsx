import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';
import { addInputs } from '../helpers/spadesMath';
import TeamInputHeading from './TeamInputHeading';

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
  const team1Actuals = {
    p1Bid: team1BidsAndActuals?.p1Actual,
    p2Bid: team1BidsAndActuals?.p2Actual,
  };
  const team2Actuals = {
    p1Bid: team2BidsAndActuals?.p1Actual,
    p2Bid: team2BidsAndActuals?.p2Actual,
  };
  const team1ActualTotal = addInputs(team1Actuals.p1Bid, team1Actuals.p2Bid);
  const team2ActualTotal = addInputs(team2Actuals.p1Bid, team2Actuals.p2Bid);
  return (
    <div>
      <TeamInputHeading
        team1Total={team1ActualTotal}
        team2Total={team2ActualTotal}
        title='Actuals'
      />
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
