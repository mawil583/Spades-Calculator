import React, { useState } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import PlayerInput from './PlayerInput';
import { useSetUnclaimed } from '../helpers/hooks';
import TeamInputHeading from './TeamInputHeading';
import { addInputs } from '../helpers/spadesMath';
import Unclaimed from './Unclaimed';

function BidSection({
  isCurrent,
  setRound,
  currentRound,
  t1p1Name,
  t1p2Name,
  t2p1Name,
  t2p2Name,
}) {
  const { team1BidsAndActuals, team2BidsAndActuals } = currentRound;
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
          isCurrent={isCurrent}
          type={'Bid'}
          setRound={setRound}
          playerName={t1p1Name}
          currentRound={currentRound}
          id='team1BidsAndActuals.p1Bid'
          playerInput={team1BidsAndActuals?.p1Bid}
          fieldToUpdate='team1BidsAndActuals.p1Bid'
        />
        <PlayerInput
          isCurrent={isCurrent}
          setRound={setRound}
          currentRound={currentRound}
          playerName={t2p1Name}
          playerInput={team2BidsAndActuals?.p1Bid}
          id='team2BidsAndActuals.p1Bid'
          fieldToUpdate='team2BidsAndActuals.p1Bid'
          type={'Bid'}
        />
        <PlayerInput
          isCurrent={isCurrent}
          setRound={setRound}
          currentRound={currentRound}
          playerName={t1p2Name}
          playerInput={team1BidsAndActuals?.p2Bid}
          id='team1BidsAndActuals.p2Bid'
          fieldToUpdate='team1BidsAndActuals.p2Bid'
          type={'Bid'}
        />
        <PlayerInput
          isCurrent={isCurrent}
          setRound={setRound}
          currentRound={currentRound}
          playerName={t2p2Name}
          playerInput={team2BidsAndActuals?.p2Bid}
          id='team2BidsAndActuals.p2Bid'
          fieldToUpdate='team2BidsAndActuals.p2Bid'
          type={'Bid'}
        />
      </SimpleGrid>
    </div>
  );
}

export default BidSection;
