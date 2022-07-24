import React, { useState } from 'react';
import { SimpleGrid, Center } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';
import { useSetUnclaimed } from '../helpers/hooks';
import TeamInputHeading from './TeamInputHeading';
import { addInputs } from '../helpers/spadesMath';
import Unclaimed from './Unclaimed';

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
  const [numUnclaimed, setNumUnclaimed] = useState(13);

  const team1Bids = {
    p1Bid: team1BidsAndActuals?.p1Bid,
    p2Bid: team1BidsAndActuals?.p2Bid,
  };
  const team2Bids = {
    p1Bid: team2BidsAndActuals?.p1Bid,
    p2Bid: team2BidsAndActuals?.p2Bid,
  };
  const team1BidTotal = addInputs(team1Bids.p1Bid, team1Bids.p2Bid);
  const team2BidTotal = addInputs(team2Bids.p1Bid, team2Bids.p2Bid);

  useSetUnclaimed(team1Bids, team2Bids, setNumUnclaimed);

  return (
    <div>
      <TeamInputHeading
        team1Total={team1BidTotal}
        team2Total={team2BidTotal}
        title='Bids'
      />
      <Unclaimed numUnclaimed={numUnclaimed} />
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
