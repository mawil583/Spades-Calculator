import React, { useContext } from 'react';
import { Badge } from '@chakra-ui/react';

import { getDealerIdHistory, getCurrentDealerId } from '../helpers/spadesMath';
import { GlobalContext } from '../helpers/GlobalContext';

const DealerTag = ({ id, index, isCurrent, roundHistory }) => {
  const { firstDealerOrder } = useContext(GlobalContext);
  const dealerIdHistory = getDealerIdHistory(roundHistory, firstDealerOrder);
  const isDealer =
    getCurrentDealerId({
      dealerIdHistory,
      index,
      isCurrent,
      firstDealerOrder,
    }) === id;

  return isDealer && <Badge colorScheme='purple'>D</Badge>;
};

export default DealerTag;
