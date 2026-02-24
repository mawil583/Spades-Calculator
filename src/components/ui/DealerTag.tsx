import { useContext, useMemo, useState } from "react";
import {
  getDealerIdHistory,
  getCurrentDealerId,
} from "../../helpers/math/spadesMath";
import { GlobalContext } from "../../helpers/context/GlobalContext";
import { Badge } from "../ui";
import { initialFirstDealerOrder } from "../../helpers/utils/constants";
import { getNames } from "../../helpers/utils/storage";
import { DealerSelectionModal } from "../modals";
import type { Round, Names } from "../../types";

export interface DealerTagProps {
  id: string;
  index?: number;
  isCurrent: boolean;
  roundHistory: Round[];
}

const DealerTag = ({
  id,
  index,
  isCurrent,
  roundHistory,
  ...props
}: DealerTagProps) => {
  const { firstDealerOrder, currentRound, setDealerOverride } =
    useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);

  const dealerIdHistory = getDealerIdHistory(roundHistory, firstDealerOrder);

  const currentDealerId = getCurrentDealerId({
    dealerIdHistory,
    index: index as number,
    isCurrent,
    firstDealerOrder,
    dealerOverride: isCurrent ? currentRound?.dealerOverride : null,
    roundHistory,
  });

  const isDealer = currentDealerId === id;

  const dealerOptions = useMemo(() => {
    const names = getNames() || ({} as Partial<Names>);

    const getNameForId = (playerId: string) => {
      const isTeam1 = playerId.includes("team1BidsAndActuals");
      const isP1 = playerId.includes("p1Bid");
      if (isTeam1 && isP1) return names.t1p1Name || "Team 1 - P1";
      if (isTeam1 && !isP1) return names.t1p2Name || "Team 1 - P2";
      if (!isTeam1 && isP1) return names.t2p1Name || "Team 2 - P1";
      return names.t2p2Name || "Team 2 - P2";
    };

    const options = initialFirstDealerOrder.map((optId) => ({
      id: optId,
      label: getNameForId(optId),
    }));
    return options;
  }, []);

  const onSelectDealer = (selectedId: string) => {
    // Only allow dealer changes for the current round (isCurrent = true)
    if (!isCurrent) {
      setIsOpen(false);
      return;
    }

    // Set the dealer override for the current round instead of changing firstDealerOrder
    setDealerOverride(selectedId);
    setIsOpen(false);
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
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
          cursor={isCurrent ? "pointer" : "default"}
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
