import React from 'react';
import { Button, SimpleGrid } from '@chakra-ui/react';

import { getButtonValues } from '../helpers/helperFunctions';

function ButtonGrid({
  type,
  setIsModalOpen,
  setRound,
  currentRound,
  fieldToUpdate,
}) {
  const buttonValues = getButtonValues(type);
  const getUpdatedRound = (bid, fieldToUpdate, currentRound) => {
    const clonedCurrentRound = { ...currentRound };
    const [team, player] = fieldToUpdate.split('.');
    clonedCurrentRound[team][player] = bid;
    return clonedCurrentRound;
  };

  const onSelect = (bid) => {
    const updatedRound = getUpdatedRound(bid, fieldToUpdate, currentRound);
    console.log({ updatedRound }); // always works, even after all inputs are entered
    setRound(updatedRound);
    setIsModalOpen(false);
  };

  return (
    <>
      <SimpleGrid columns={3} spacingX={2} spacingY={4}>
        {buttonValues.map((buttonVal, i) => {
          return (
            <Button
              key={i}
              onClick={() => {
                onSelect(buttonVal);
              }}
            >
              {buttonVal}
            </Button>
          );
        })}
      </SimpleGrid>
    </>
  );
}

export default ButtonGrid;
