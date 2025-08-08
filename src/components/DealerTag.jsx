import React, { useContext, useMemo, useState } from 'react';
import {
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
} from '@chakra-ui/react';

import { getDealerIdHistory, getCurrentDealerId } from '../helpers/spadesMath';
import { GlobalContext } from '../helpers/GlobalContext';
import { initialFirstDealerOrder } from '../helpers/constants';

const DealerTag = ({ id, index, isCurrent, roundHistory }) => {
  const { firstDealerOrder, setFirstDealerOrder } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);
  const dealerIdHistory = getDealerIdHistory(roundHistory, firstDealerOrder);
  const isDealer =
    getCurrentDealerId({
      dealerIdHistory,
      index,
      isCurrent,
      firstDealerOrder,
    }) === id;

  const dealerOptions = useMemo(() => {
    const names = JSON.parse(localStorage.getItem('names')) || {};
    const getNameForId = (playerId) => {
      const isTeam1 = playerId.includes('team1BidsAndActuals');
      const isP1 = playerId.includes('p1Bid');
      if (isTeam1 && isP1) return names.t1p1Name || 'Team 1 - P1';
      if (isTeam1 && !isP1) return names.t1p2Name || 'Team 1 - P2';
      if (!isTeam1 && isP1) return names.t2p1Name || 'Team 2 - P1';
      return names.t2p2Name || 'Team 2 - P2';
    };
    return initialFirstDealerOrder.map((optId) => ({
      id: optId,
      label: getNameForId(optId),
    }));
  }, []);

  const onSelectDealer = (selectedId) => {
    const base = [...initialFirstDealerOrder];
    const startIdx = base.indexOf(selectedId);
    const rotated = [...base.slice(startIdx), ...base.slice(0, startIdx)];
    setFirstDealerOrder(rotated);
    setIsOpen(false);
  };

  return (
    isDealer && (
      <>
        <Badge
          data-cy="dealerBadge"
          onClick={() => setIsOpen(true)}
          colorScheme="purple"
        >
          D
        </Badge>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent data-cy="dealerSelectionModal">
            <ModalHeader>Select the dealer</ModalHeader>
            <ModalBody>
              <VStack align="stretch" spacing={3}>
                {dealerOptions.map((opt) => (
                  <Button
                    key={opt.id}
                    data-cy="dealerOptionButton"
                    data-player-id={opt.id}
                    onClick={() => onSelectDealer(opt.id)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                data-cy="dealerCancelButton"
                variant="ghost"
                mr={3}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default DealerTag;
