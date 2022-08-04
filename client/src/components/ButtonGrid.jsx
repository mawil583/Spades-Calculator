import React, { useContext } from 'react';
import { Button, SimpleGrid } from '@chakra-ui/react';

import { getButtonValues } from '../helpers/helperFunctions';
import { GlobalContext } from '../helpers/GlobalContext';

function ButtonGrid({
  isCurrent,
  type,
  setIsModalOpen,
  setRound,
  currentRound,
  fieldToUpdate,
}) {
  const { setCurrentRound } = useContext(GlobalContext);
  const buttonValues = getButtonValues(type);

  const getUpdatedRound = (bid, fieldToUpdate, currentRound) => {
    const clonedCurrentRound = { ...currentRound };
    const [team, player] = fieldToUpdate.split('.');
    clonedCurrentRound[team][player] = bid;
    return clonedCurrentRound;
  };

  const onSelect = (bid) => {
    setIsModalOpen(false);
    if (isCurrent) {
      setCurrentRound(bid, fieldToUpdate);
    } else {
      const updatedRound = getUpdatedRound(bid, fieldToUpdate, currentRound);
      setRound(updatedRound);
    }
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
