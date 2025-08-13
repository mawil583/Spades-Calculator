import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { InputModal } from '../modals';
import { DealerTag } from '../ui';

const PlayerInput = ({
  inputId,
  dealerId,
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
        roundHistory={roundHistory}
        index={index}
      />
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px' }} htmlFor={inputId}>
          {playerName}{' '}
          <DealerTag
            id={dealerId}
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
            id={inputId}
            name={inputId}
            size="sm"
            borderColor={teamClassName}
            color={teamClassName}
            data-cy="bidButton"
            data-testid="bidButton"
          >
            {type}
          </Button>
        ) : (
          <div data-cy="playerInput" data-testid="playerInput">
            <Flex
              align="center"
              justify="center"
              cursor="pointer"
              onClick={onEdit}
            >
              <Flex borderColor={teamClassName} borderRadius="4px" px="0.5rem">
                {playerInput}
              </Flex>
              <EditIcon color={teamClassName} boxSize={5} ml={'5px'}></EditIcon>
            </Flex>
          </div>
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
