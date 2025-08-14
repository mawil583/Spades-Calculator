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

  // Determine if this player should show "N/A" (when both players have numeric values)
  const shouldShowNA = () => {
    if (type !== 'Actual') return false;

    // Check if both players on the same team have numeric values
    const isTeam1 = fieldToUpdate.includes('team1');
    const teamField = isTeam1 ? 'team1BidsAndActuals' : 'team2BidsAndActuals';

    if (currentRound && currentRound[teamField]) {
      const p1Actual = currentRound[teamField].p1Actual;
      const p2Actual = currentRound[teamField].p2Actual;

      // If both players have numeric values, show "N/A"
      return typeof p1Actual === 'number' && typeof p2Actual === 'number';
    }

    return false;
  };

  const displayValue = shouldShowNA() ? 'N/A' : playerInput;
  const showButton = displayValue === '' && !shouldShowNA();

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
        <Flex
          direction={'row'}
          align={'center'}
          style={{ marginRight: '15px' }}
        >
          <span>{playerName}</span>{' '}
          {type === 'Bid' && (
            <DealerTag
              id={dealerId}
              index={index}
              isCurrent={isCurrent}
              roundHistory={roundHistory}
            />
          )}
        </Flex>
        {showButton ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            value={displayValue}
            id={inputId}
            name={inputId}
            size="sm"
            borderColor={teamClassName}
            color={teamClassName}
            data-cy={type === 'Bid' ? 'bidButton' : 'actualButton'}
            data-testid={type === 'Bid' ? 'bidButton' : 'actualButton'}
          >
            {displayValue || type}
          </Button>
        ) : shouldShowNA() ? (
          <div data-cy="playerInput" data-testid="playerInput">
            <Flex
              align="center"
              justify="center"
              cursor="pointer"
              onClick={onEdit}
            >
              <Flex borderColor={teamClassName} borderRadius="4px" px="0.5rem">
                {displayValue}
              </Flex>
              <EditIcon
                color={teamClassName}
                boxSize={5}
                ml={'5px'}
                data-testid="editIcon"
              ></EditIcon>
            </Flex>
          </div>
        ) : (
          <div data-cy="playerInput" data-testid="playerInput">
            <Flex
              align="center"
              justify="center"
              cursor="pointer"
              onClick={onEdit}
            >
              <Flex borderColor={teamClassName} borderRadius="4px" px="0.5rem">
                {displayValue}
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
