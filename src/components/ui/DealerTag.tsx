import { useContext, useMemo, useState } from 'react';
import {
  getDealerIdHistory,
  getCurrentDealerId,
} from '../../helpers/math/spadesMath';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import { Badge } from '../ui';
import { initialFirstDealerOrder } from '../../helpers/utils/constants';
import { DealerSelectionModal } from '../modals';

const DealerTag = ({ id, index, isCurrent, roundHistory, ...props }) => {
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

  const handleBadgeClick = (e) => {
    e.stopPropagation();
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
          cursor={isCurrent ? 'pointer' : 'default'}
          variant="dealer"
          mx="2px"
          {...props}
        >
          D
        </Badge>
        <DealerSelectionModal
          isOpen={isOpen}
          onClose={setIsOpen}
          dealerOptions={dealerOptions}
          onSelectDealer={onSelectDealer}
        />
      </>
    )
  );
};

export default DealerTag;
