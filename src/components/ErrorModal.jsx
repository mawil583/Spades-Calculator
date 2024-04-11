import React from 'react';
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';

import { addInputs } from '../helpers/spadesMath';
import PlayerInput from './PlayerInput';
import TeamInputHeading from './TeamInputHeading';
import { SimpleGrid } from '@chakra-ui/react';

function ErrorModal({
  isOpen,
  setIsModalOpen,
  index,
  names,
  isCurrent,
  roundHistory,
  currentRound,
  errorMessage,
}) {
  const { team1BidsAndActuals, team2BidsAndActuals } = currentRound;
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

  //   TODO: make sure that the next round's BidSection does not show up until valid actuals of current round

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
      style={{ color: '#ebf5ee', backgroundColor: '#464f51' }}
    >
      <ModalOverlay />
      <ModalContent>
        <div data-cy="actualSection">
          <TeamInputHeading
            team1Total={team1ActualTotal}
            team2Total={team2ActualTotal}
            title="Actuals"
          />
          <div
            style={{
              color: '#f95050',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {errorMessage}
          </div>
          <SimpleGrid
            columns={2}
            className="namesContainer"
            style={{ marginTop: '5px', marginBottom: '20px' }}
          >
            <PlayerInput
              roundHistory={roundHistory}
              teamName={names.team1Name}
              index={index}
              isCurrent={isCurrent}
              type={'Actual'}
              playerName={names.t1p1Name}
              currentRound={currentRound}
              id="team1BidsAndActuals.p1Actual"
              fieldToUpdate={'team1BidsAndActuals.p1Actual'}
              playerInput={team1BidsAndActuals?.p1Actual}
              teamClassName="team1"
            />
            <PlayerInput
              roundHistory={roundHistory}
              teamName={names.team2Name}
              index={index}
              isCurrent={isCurrent}
              currentRound={currentRound}
              id="team2BidsAndActuals.p1Actual"
              fieldToUpdate={'team2BidsAndActuals.p1Actual'}
              teamClassName="team2"
              playerName={names.t2p1Name}
              playerInput={team2BidsAndActuals?.p1Actual}
              type={'Actual'}
            />
            <PlayerInput
              teamName={names.team1Name}
              roundHistory={roundHistory}
              index={index}
              isCurrent={isCurrent}
              currentRound={currentRound}
              playerName={names.t1p2Name}
              id="team1BidsAndActuals.p2Actual"
              fieldToUpdate={'team1BidsAndActuals.p2Actual'}
              playerInput={team1BidsAndActuals?.p2Actual}
              type={'Actual'}
              teamClassName="team1"
            />
            <PlayerInput
              teamName={names.team2Name}
              roundHistory={roundHistory}
              index={index}
              isCurrent={isCurrent}
              currentRound={currentRound}
              playerName={names.t2p2Name}
              playerInput={team2BidsAndActuals?.p2Actual}
              type={'Actual'}
              id="team2BidsAndActuals.p2Actual"
              fieldToUpdate={'team2BidsAndActuals.p2Actual'}
              teamClassName="team2"
            />
          </SimpleGrid>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default ErrorModal;
