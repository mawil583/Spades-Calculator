import React, { useContext } from 'react';
import { Button, SimpleGrid } from '@chakra-ui/react';

import {
  getButtonValues,
  getEditedRoundHistory,
  updateInput,
} from '../helpers/helperFunctions';
import { GlobalContext } from '../helpers/GlobalContext';

function ButtonGrid({
  index,
  isCurrent,
  type,
  setIsModalOpen,
  currentRound,
  fieldToUpdate,
}) {
  const { setCurrentRound, setRoundHistory, roundHistory } =
    useContext(GlobalContext);
  const buttonValues = getButtonValues(type);

  const onSelect = (input) => {
    setIsModalOpen(false);
    if (isCurrent) {
      setCurrentRound({
        input,
        fieldToUpdate,
        currentRound: { ...currentRound },
      });
    } else {
      const updatedRound = updateInput({ input, fieldToUpdate, currentRound });
      const newRoundHistory = getEditedRoundHistory({
        index,
        updatedRound,
        roundHistory: roundHistory,
      });
      setRoundHistory([...newRoundHistory]);
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
