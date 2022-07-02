import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import InputModal from './InputModal';

const PlayerInput = ({ playerName, val, id, type, setValTo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <InputModal
        playerName={playerName}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type={type}
        setValTo={setValTo}
      />
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px' }} htmlFor='p1Bid'>
          {playerName}
        </label>
        {val === '' ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            value={val}
            id={id}
            name={id}
          >
            {type}
          </Button>
        ) : (
          val
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
