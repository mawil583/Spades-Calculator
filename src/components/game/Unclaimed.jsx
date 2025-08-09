import React from 'react';
import { Text } from '@chakra-ui/react';
import { getUnclaimedText } from '../../helpers/utils/helperFunctions';

function Unclaimed({ numUnclaimed }) {
  const text = getUnclaimedText(numUnclaimed);
  return <Text>{text}</Text>;
}

export default Unclaimed;
