import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import InputModal from './InputModal';

const PlayerInput = ({ playerName, val, id, type, setValTo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onEdit = () => {
    setIsModalOpen(true);
  };
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
            size='sm'
          >
            {type}
          </Button>
        ) : (
          <div onClick={onEdit}>{val}</div>
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
