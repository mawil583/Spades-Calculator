import React from 'react';
import { SimpleGrid, Center, Heading } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';

function BidSection({
  setT1p1Bid,
  t1p1Name,
  team1BidsAndActuals,
  team2BidsAndActuals,
  setT2p1Bid,
  t2p1Name,
  setT1p2Bid,
  t1p2Name,
  setT2p2Bid,
  t2p2Name,
}) {
  return (
    <div>
      <Center>
        <Heading mt={'20px'} mb={'10px'} size={'md'}>
          Bids
        </Heading>
      </Center>
      <SimpleGrid columns={2} className='namesContainer'>
        <PlayerInput
          setValTo={setT1p1Bid}
          playerName={t1p1Name}
          val={team1BidsAndActuals?.p1Bid}
          id='team1BidsAndActuals.p1Bid'
          type={'Bid'}
        />
        <PlayerInput
          setValTo={setT2p1Bid}
          playerName={t2p1Name}
          val={team2BidsAndActuals?.p1Bid}
          id='team2BidsAndActuals.p1Bid'
          type={'Bid'}
        />
        <PlayerInput
          setValTo={setT1p2Bid}
          playerName={t1p2Name}
          val={team1BidsAndActuals?.p2Bid}
          id='team1BidsAndActuals.p2Bid'
          type={'Bid'}
        />
        <PlayerInput
          setValTo={setT2p2Bid}
          playerName={t2p2Name}
          val={team2BidsAndActuals?.p2Bid}
          id='team2BidsAndActuals.p2Bid'
          type={'Bid'}
        />
      </SimpleGrid>
    </div>
  );
}

export default BidSection;
