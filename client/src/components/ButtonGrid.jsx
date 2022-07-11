import React from 'react';
import { Button, SimpleGrid } from '@chakra-ui/react';
import { possibleActuals, possibleBids } from '../helpers/constants';

function ButtonGrid({ type, setIsModalOpen, setValTo }) {
  const selectionOptions = () => {
    if (type === 'Bid') {
      return possibleBids;
    }
    return possibleActuals;
  };

  const onSelect = (bid) => {
    setValTo(bid);
    setIsModalOpen(false);
  };

  return (
    <>
      <SimpleGrid columns={3} spacingX={2} spacingY={4}>
        {selectionOptions().map((buttonVal, i) => {
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
