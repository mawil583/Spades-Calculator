import React from 'react';
import { Center } from '@chakra-ui/react';

import { getUnclaimedText } from '../helpers/helperFunctions';

function Unclaimed({ numUnclaimed }) {
  const text = getUnclaimedText(numUnclaimed);
  return <Center>{text}</Center>;
}

export default Unclaimed;
