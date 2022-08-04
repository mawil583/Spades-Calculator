import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import InputModal from './InputModal';
import { getDealerIdHistory, getCurrentDealerId } from '../helpers/spadesMath';

const PlayerInput = ({
  id,
  type,
  index,
  setRound,
  isCurrent,
  playerName,
  playerInput,
  roundHistory,
  currentRound,
  fieldToUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dealerIdHistory = getDealerIdHistory(roundHistory, isCurrent);
  const isDealer = getCurrentDealerId(dealerIdHistory, index, isCurrent) === id;

  const onEdit = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <InputModal
        isCurrent={isCurrent}
        playerName={playerName}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type={type}
        setRound={setRound}
        fieldToUpdate={fieldToUpdate}
        currentRound={currentRound}
      />
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px' }} htmlFor='p1Bid'>
          {playerName} {isDealer && 'Dealer!!!'}
        </label>
        {playerInput === '' ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            value={playerInput}
            id={id}
            name={id}
            size='sm'
          >
            {type}
          </Button>
        ) : (
          <div onClick={onEdit}>{playerInput}</div>
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
