import { useState } from "react";
import { SimpleGrid } from "../ui";
import { PlayerInput } from "../forms";
import { useSetUnclaimed } from "../../helpers/utils/hooks";
import { TeamInputHeading } from "../forms";
import { addInputs } from "../../helpers/math/spadesMath";
import { Unclaimed } from "./";

import type { Names, Round } from "../../types";

interface BidSectionProps {
  index: number;
  names: Names;
  isCurrent: boolean;
  roundHistory: Round[];
  currentRound: Round;
}

function BidSection({
  index,
  names,
  isCurrent,
  roundHistory,
  currentRound,
}: BidSectionProps) {
  const { team1BidsAndActuals, team2BidsAndActuals } = currentRound;
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    names;

  const [numUnclaimed, setNumUnclaimed] = useState(13);

  const team1Bids = [team1BidsAndActuals.p1Bid, team1BidsAndActuals.p2Bid];
  const team2Bids = [team2BidsAndActuals.p1Bid, team2BidsAndActuals.p2Bid];

  const team1BidTotal = addInputs(...team1Bids);
  const team2BidTotal = addInputs(...team2Bids);

  useSetUnclaimed(team1Bids, team2Bids, setNumUnclaimed);

  return (
    <div data-cy="bidSection">
      <TeamInputHeading
        team1Name={team1Name}
        team2Name={team2Name}
        team1Total={team1BidTotal}
        team2Total={team2BidTotal}
        title="Bids"
      />
      <Unclaimed numUnclaimed={numUnclaimed} />
      <SimpleGrid columns={2} mb="var(--app-spacing-4)">
        <PlayerInput
          type={"Bid"}
          index={index}
          teamName={team1Name}
          playerName={t1p1Name}
          isCurrent={isCurrent}
          roundHistory={roundHistory}
          currentRound={currentRound}
          inputId="team1BidsAndActuals.p1Bid"
          dealerId="team1BidsAndActuals.p1Bid"
          playerInput={team1BidsAndActuals.p1Bid}
          fieldToUpdate="team1BidsAndActuals.p1Bid"
          teamClassName="team1"
        />
        <PlayerInput
          teamName={team2Name}
          index={index}
          roundHistory={roundHistory}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={t2p1Name}
          playerInput={team2BidsAndActuals.p1Bid}
          inputId="team2BidsAndActuals.p1Bid"
          dealerId="team2BidsAndActuals.p1Bid"
          fieldToUpdate="team2BidsAndActuals.p1Bid"
          teamClassName="team2"
          type={"Bid"}
        />
        <PlayerInput
          teamName={team1Name}
          index={index}
          roundHistory={roundHistory}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={t1p2Name}
          playerInput={team1BidsAndActuals.p2Bid}
          inputId="team1BidsAndActuals.p2Bid"
          dealerId="team1BidsAndActuals.p2Bid"
          fieldToUpdate="team1BidsAndActuals.p2Bid"
          type={"Bid"}
          teamClassName="team1"
        />
        <PlayerInput
          teamName={team2Name}
          index={index}
          roundHistory={roundHistory}
          isCurrent={isCurrent}
          currentRound={currentRound}
          playerName={t2p2Name}
          playerInput={team2BidsAndActuals.p2Bid}
          inputId="team2BidsAndActuals.p2Bid"
          dealerId="team2BidsAndActuals.p2Bid"
          fieldToUpdate="team2BidsAndActuals.p2Bid"
          teamClassName="team2"
          type={"Bid"}
        />
      </SimpleGrid>
    </div>
  );
}

export default BidSection;
