import React from 'react';
import { Badge } from '@chakra-ui/react';

import { getDealerIdHistory, getCurrentDealerId } from '../helpers/spadesMath';

const DealerTag = ({ id, index, isCurrent, roundHistory }) => {
  const dealerIdHistory = getDealerIdHistory(roundHistory, isCurrent);
  const isDealer = getCurrentDealerId(dealerIdHistory, index, isCurrent) === id;

  return isDealer && <Badge colorScheme='purple'>D</Badge>;
};

export default DealerTag;
