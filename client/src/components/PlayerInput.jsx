import React, { useState } from 'react';
import { Button, Flex, Badge } from '@chakra-ui/react';

import InputModal from './InputModal';
import { getDealerIdHistory, getCurrentDealerId } from '../helpers/spadesMath';
import { getTeamStyle } from '../helpers/helperFunctions';

const PlayerInput = ({
  id,
  type,
  index,
  teamName,
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
  const style = getTeamStyle(teamName);

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
        <label style={{ marginRight: '15px', ...style }} htmlFor='p1Bid'>
          {playerName} {isDealer && <Badge colorScheme='purple'>D</Badge>}
        </label>
        {playerInput === '' ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            style={style}
            variant='outline'
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
