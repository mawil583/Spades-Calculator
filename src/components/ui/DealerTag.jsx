import { useContext, useMemo, useState } from 'react';
import {
  getDealerIdHistory,
  getCurrentDealerId,
} from '../../helpers/math/spadesMath';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import { initialFirstDealerOrder } from '../../helpers/utils/constants';
import { DealerSelectionModal } from '../modals';

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
        <div
          data-cy="dealerBadge"
          data-testid="dealerBadge"
          onClick={handleBadgeClick}
          style={{
            cursor: isCurrent ? 'pointer' : 'default',
            marginLeft: '8px',
            marginRight: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            backgroundColor: 'dealerBadge',
            color: 'offWhite',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            verticalAlign: 'middle',
          }}
        >
          D
        </div>
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
