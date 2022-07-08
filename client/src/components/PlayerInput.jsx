import React, { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import InputModal from './InputModal';

const PlayerInput = ({
  playerName,
  val,
  id,
  type,
  setValTo,
  roundIndex,
  setRoundHistory,
}) => {
  console.log({ id });

  console.log({ roundIndex });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRoundHistoryWithClearedValue = () => {
    const clonedRoundHistory = [
      ...JSON.parse(localStorage.getItem('roundHistory')),
    ];
    const teamBidsAndActuals = id.split('.')[0];
    console.log({ teamBidsAndActuals });
    const selection = id.split('.')[1];
    console.log({ selection });

    console.log({ clonedRoundHistory });
    const roundHistoryTillRoundBeingEdited = [];
    for (let i = 0; i < roundIndex; i++) {
      roundHistoryTillRoundBeingEdited.push(clonedRoundHistory[i]);
    }
    console.log({ roundHistoryTillRoundBeingEdited });
    const roundToBeEdited = clonedRoundHistory[roundIndex];
    console.log({ roundToBeEdited });
    // for (const property in roundToBeEdited) {
    //   roundToBeEdited[teamBidsAndActuals][selection] = '';
    // }

    roundToBeEdited[teamBidsAndActuals][selection] = '';
    console.log({ roundToBeEdited });
    const updatedRoundHistory = [
      ...roundHistoryTillRoundBeingEdited,
      roundToBeEdited,
    ];
    console.log({ updatedRoundHistory });
    console.log({ updatedRoundHistory });
    setRoundHistory(updatedRoundHistory);
    // localStorage.setItem('roundHistory', JSON.stringify(updatedRoundHistory));

    // return [...roundHistoryTillRoundBeingEdited,]
  };

  const onEditVal = () => {
    console.log('onEdit');
    getRoundHistoryWithClearedValue();
    // localStorage.setItem('roundHistory', '');
    setValTo('');
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
          >
            {type}
          </Button>
        ) : (
          <div onClick={onEditVal}>{val}</div>
        )}
      </Flex>
    </>
  );
};

export default PlayerInput;
