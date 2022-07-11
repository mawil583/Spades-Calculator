import React from 'react';
import { SimpleGrid, Center, Heading } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';

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
  return (
    <div>
      <Center>
        <Heading mt={'20px'} mb={'10px'} size={'md'}>
          Actuals
        </Heading>
      </Center>
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
