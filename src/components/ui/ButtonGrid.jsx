import React, { useContext } from 'react';
import { SimpleGrid, Button } from '@chakra-ui/react';
import {
  getButtonValues,
  getEditedRoundHistory,
  updateInput,
} from '../../helpers/utils/helperFunctions';
import { GlobalContext } from '../../helpers/context/GlobalContext';

function ButtonGrid({
  type,
  fieldToUpdate,
  currentRound,
  index,
  roundHistory,
  isCurrent,
  setIsModalOpen,
  onCustomUpdate,
}) {
  const { setCurrentRound, setRoundHistory } = useContext(GlobalContext);
  const buttonValues = getButtonValues(type);

  const onSelect = (input) => {
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }

    // If there's a custom update handler, use it instead of the default behavior
    if (onCustomUpdate) {
      onCustomUpdate(input);
      return;
    }

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
        roundHistory: roundHistory || [],
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
              data-cy="bidSelectionButton"
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
