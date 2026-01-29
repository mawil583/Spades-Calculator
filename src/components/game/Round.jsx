import React, { useEffect, useContext, useState } from 'react';
import { Container, Separator } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  calculateRoundScore,
  isNotDefaultValue,
} from '../../helpers/math/spadesMath';
import { useIndependentTeamScoring } from '../../helpers/utils/hooks';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import { GlobalContext } from '../../helpers/context/GlobalContext';

function Round({ roundHistory, isCurrent = false, roundIndex }) {
  const names = JSON.parse(localStorage.getItem('names'));
  const { team1Name, team2Name } = names;
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));
  const { currentRound, resetCurrentRound, setRoundHistory } =
    useContext(GlobalContext);

  const roundAtIndex = isCurrent ? null : roundHistory?.[roundIndex] ?? null;
  const roundInputs = isCurrent ? currentRound : roundAtIndex;

  // Always call hooks before any early returns
  useIndependentTeamScoring(
    currentRound,
    resetCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory
  );

  // Check if all bids are entered and update animation state
  const roundInputBids = roundInputs
    ? [
        roundInputs.team1BidsAndActuals.p1Bid,
        roundInputs.team1BidsAndActuals.p2Bid,
        roundInputs.team2BidsAndActuals.p1Bid,
        roundInputs.team2BidsAndActuals.p2Bid,
      ]
    : ['', '', '', '']; // Default empty values if roundInputs is null
  const allBidsEntered = roundInputBids.every(isNotDefaultValue);

  // State to control the animation for the current round
  const [isActualsSectionVisible, setIsActualsSectionVisible] = useState(false);

  // Derive visibility:
  // 1. For past rounds, show if all bids are entered.
  // 2. For current round, use internal state (which has the animation delay).
  const showActuals = (!isCurrent && allBidsEntered) || isActualsSectionVisible;

  // Reset animation state if we're in the current round and bids are cleared
  if (isCurrent && isActualsSectionVisible) {
    const hasAnyBids = roundInputBids.some(isNotDefaultValue);
    if (!hasAnyBids) {
      setIsActualsSectionVisible(false);
    }
  }

  // Handle the triggered animation with delay when all bids are entered in current round
  useEffect(() => {
    if (isCurrent && allBidsEntered && !isActualsSectionVisible) {
      // Only trigger animation when transitioning from incomplete to complete
      const timer = setTimeout(() => {
        setIsActualsSectionVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [allBidsEntered, isCurrent, isActualsSectionVisible]);

  // If this is a past round and the round data is missing or malformed, skip rendering this round
  if (!isCurrent) {
    const hasValidStructure =
      roundInputs &&
      roundInputs.team1BidsAndActuals &&
      roundInputs.team2BidsAndActuals;
    if (!hasValidStructure) {
      return null;
    }
  }

  function getTeamsScoresFromHistory() {
    if (roundAtIndex) {
      const { team1BidsAndActuals, team2BidsAndActuals } = roundAtIndex;
      const team1RoundScoreFromHistory = calculateRoundScore(
        team1BidsAndActuals.p1Bid,
        team1BidsAndActuals.p2Bid,
        team1BidsAndActuals.p1Actual,
        team1BidsAndActuals.p2Actual,
        nilSetting
      );
      const team2RoundScoreFromHistory = calculateRoundScore(
        team2BidsAndActuals.p1Bid,
        team2BidsAndActuals.p2Bid,
        team2BidsAndActuals.p1Actual,
        team2BidsAndActuals.p2Actual,
        nilSetting
      );

      return { team1RoundScoreFromHistory, team2RoundScoreFromHistory };
    }
  }
  const teamScores = getTeamsScoresFromHistory();

  return (
    <div className="round" data-cy="round">
      <RoundHeading roundNumber={roundIndex + 1} names={names} />
      <Container>
        {!isCurrent && (
          <RoundSummary
            team2Name={team2Name}
            team1Name={team1Name}
            team1RoundScore={teamScores?.team1RoundScoreFromHistory?.score}
            team2RoundScore={teamScores?.team2RoundScoreFromHistory?.score}
            // add this back, but only as accordion
            // team1GameScore={team1GameScoreAtEndOfThisRound.teamScore}
            // team2GameScore={team2GameScoreAtEndOfThisRound.teamScore}
            team1RoundBags={teamScores?.team1RoundScoreFromHistory?.bags}
            team2RoundBags={teamScores?.team2RoundScoreFromHistory?.bags}
          />
        )}

        <AnimatePresence>
          {showActuals && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: { duration: 0.5, ease: 'easeInOut' },
                opacity: { duration: 0.3, delay: 0.2 },
              }}
              style={{ overflow: 'hidden' }}
            >
              <ActualSection
                names={names}
                isCurrent={isCurrent}
                index={roundIndex}
                roundHistory={roundHistory}
                currentRound={isCurrent ? currentRound : roundAtIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {showActuals && <Separator className="divider-between-sections" />}

        <BidSection
          names={names}
          isCurrent={isCurrent}
          index={roundIndex}
          roundHistory={roundHistory}
          currentRound={isCurrent ? currentRound : roundAtIndex}
        />
      </Container>
    </div>
  );
}

export default Round;
