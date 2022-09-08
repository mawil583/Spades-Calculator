import React, { useContext, useReducer } from 'react';
import { Button, SimpleGrid } from '@chakra-ui/react';

import { getButtonValues, updateInput } from '../helpers/helperFunctions';
import { GlobalContext } from '../helpers/GlobalContext';
import rootReducer, { initialState } from '../helpers/rootReducer';

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
  const [state] = useReducer(rootReducer, initialState);

  const onSelect = (input) => {
    setIsModalOpen(false);
    if (isCurrent) {
      setCurrentRound({
        input,
        fieldToUpdate,
        currentRound: { ...state.currentRound },
      });
    } else {
      const updatedRound = updateInput({ input, fieldToUpdate, currentRound });
      setRound(updatedRound);
    }
  };

  return (
    <>
      <SimpleGrid
        columns={3}
        spacingX={2}
        spacingY={4}
        style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
      >
        {buttonValues.map((buttonVal, i) => {
          return (
            <Button
              variant='outline'
              key={i}
              onClick={() => {
                onSelect(buttonVal);
              }}
              style={{ backgroundColor: '#464f51', color: '#ebf5ee' }}
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
