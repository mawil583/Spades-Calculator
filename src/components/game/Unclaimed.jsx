import React from 'react';
import { Text, Center } from '../ui';
import { getUnclaimedText } from '../../helpers/utils/helperFunctions';

function Unclaimed({ numUnclaimed }) {
  const text = getUnclaimedText(numUnclaimed);
  return (
    <Center>
      <Text>{text}</Text>
    </Center>
  );
}

export default Unclaimed;
