import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import InputModal from './InputModal';
import DealerTag from './DealerTag';
import { getTeamStyle } from '../helpers/helperFunctions';

const PlayerInput = ({
  id,
  type,
  index,
  teamName,
  isCurrent,
  playerName,
  playerInput,
  roundHistory,
  currentRound,
  fieldToUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        fieldToUpdate={fieldToUpdate}
        currentRound={currentRound}
        index={index}
      />
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px', ...style }} htmlFor='p1Bid'>
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
