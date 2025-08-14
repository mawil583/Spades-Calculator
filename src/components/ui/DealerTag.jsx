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
import {
  getDealerIdHistory,
  getCurrentDealerId,
} from '../../helpers/math/spadesMath';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import { initialFirstDealerOrder } from '../../helpers/utils/constants';

const DealerTag = ({ id, index, isCurrent, roundHistory }) => {
  const { firstDealerOrder, currentRound, setDealerOverride } =
    useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);

  const dealerIdHistory = getDealerIdHistory(roundHistory, firstDealerOrder);

  const currentDealerId = getCurrentDealerId({
    dealerIdHistory,
    index,
    isCurrent,
    firstDealerOrder,
    dealerOverride: isCurrent ? currentRound?.dealerOverride : null,
    roundHistory,
  });

  const isDealer = currentDealerId === id;

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

    const options = initialFirstDealerOrder.map((optId) => ({
      id: optId,
      label: getNameForId(optId),
    }));
    return options;
  }, []);

  const onSelectDealer = (selectedId) => {
    // Only allow dealer changes for the current round (isCurrent = true)
    if (!isCurrent) {
      setIsOpen(false);
      return;
    }

    // Set the dealer override for the current round instead of changing firstDealerOrder
    setDealerOverride(selectedId);
    setIsOpen(false);
  };

  const handleBadgeClick = () => {
    if (isCurrent) {
      setIsOpen(true);
    }
  };

  return (
    isDealer && (
      <>
        <Badge
          data-cy="dealerBadge"
          data-testid="dealerBadge"
          onClick={handleBadgeClick}
          colorScheme="purple"
          style={{ cursor: isCurrent ? 'pointer' : 'default' }}
        >
          D
        </Badge>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent
            data-cy="dealerSelectionModal"
            data-testid="dealerSelectionModal"
          >
            <ModalHeader>Select the dealer</ModalHeader>
            <ModalBody>
              <VStack align="stretch" spacing={3}>
                {dealerOptions.map((opt) => (
                  <Button
                    key={opt.id}
                    data-cy="dealerOptionButton"
                    data-testid="dealerOptionButton"
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
                data-testid="dealerCancelButton"
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
