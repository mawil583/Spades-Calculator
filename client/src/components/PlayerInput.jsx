import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import {EditIcon} from '@chakra-ui/icons';

import InputModal from './InputModal';
import DealerTag from './DealerTag';

const PlayerInput = ({
  id,
  type,
  index,
  isCurrent,
  playerName,
  playerInput,
  roundHistory,
  currentRound,
  teamClassName,
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
        fieldToUpdate={fieldToUpdate}
        currentRound={currentRound}
        index={index}
      />
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px' }} htmlFor='p1Bid'>
          {playerName}{' '}
          <DealerTag
            id={id}
            index={index}
            isCurrent={isCurrent}
            roundHistory={roundHistory}
          />
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
            borderColor={teamClassName}
            color={teamClassName}
          >
            {type}
          </Button>
        ) : (
          <Flex
            align="center"
            justify="center"
            cursor="pointer"
            onClick={onEdit}>
            <Flex
              borderColor={teamClassName}
              borderRadius="4px"
              px="0.5rem">
              {playerInput}
            </Flex>
            <EditIcon
              color={teamClassName}>
            </EditIcon>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
