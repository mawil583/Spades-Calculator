import React, { useState, useContext } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import InputModal from './InputModal';

const PlayerInput = ({
  isCurrent,
  playerName,
  playerInput,
  id,
  type,
  setRound,
  currentRound,
  fieldToUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          {playerName}
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
