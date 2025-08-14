import React, { useEffect, useContext, useState } from 'react';
import { Container } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  calculateRoundScore,
  isNotDefaultValue,
} from '../../helpers/math/spadesMath';
import RoundSummary from './RoundSummary';
import BidSection from './BidSection';
import ActualSection from './ActualSection';
import RoundHeading from './RoundHeading';
import { Divider } from '../../components/ui';
import { GlobalContext } from '../../helpers/context/GlobalContext';

function Round({ roundHistory, isCurrent = false, roundIndex }) {
  const names = JSON.parse(localStorage.getItem('names'));
  const { team1Name, team2Name } = names;
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));
  const { currentRound, resetCurrentRound, setRoundHistory } =
    useContext(GlobalContext);

  const roundAtIndex = isCurrent ? null : roundHistory?.[roundIndex] ?? null;
  const roundInputs = isCurrent ? currentRound : roundAtIndex;

  // State to control the animation
  const [showActuals, setShowActuals] = useState(false);

  // Always call hooks before any early returns
  useSetScoreWhenRoundIsFinished(
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

  // Reset showActuals when roundIndex changes (new round created) or when roundHistory becomes empty (new game)
  useEffect(() => {
    setShowActuals(false);
  }, [roundIndex, roundHistory.length]);

  // Reset showActuals when currentRound is reset (new game with same teams)
  useEffect(() => {
    if (isCurrent && currentRound) {
      const hasAnyBids = [
        currentRound.team1BidsAndActuals.p1Bid,
        currentRound.team1BidsAndActuals.p2Bid,
        currentRound.team2BidsAndActuals.p1Bid,
        currentRound.team2BidsAndActuals.p2Bid,
      ].some(isNotDefaultValue);

      if (!hasAnyBids && showActuals) {
        setShowActuals(false);
      }
    }
  }, [currentRound, isCurrent, showActuals]);

  useEffect(() => {
    if (allBidsEntered && isCurrent && !showActuals) {
      // Only trigger animation when transitioning from incomplete to complete
      // Small delay to ensure the animation triggers after the last bid is entered
      const timer = setTimeout(() => {
        setShowActuals(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    // Don't hide actuals once they're shown - this prevents contraction animations
  }, [allBidsEntered, isCurrent, showActuals]);

  // For past rounds, always show actuals
  useEffect(() => {
    if (!isCurrent && allBidsEntered) {
      setShowActuals(true);
    }
  }, [isCurrent, allBidsEntered]);

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

        {showActuals && <Divider className="divider-between-sections" />}

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

function useSetScoreWhenRoundIsFinished(
  currentRound,
  resetCurrentRound,
  isNotDefaultValue,
  setRoundHistory,
  roundHistory
) {
  useEffect(() => {
    const team1InputVals = Object.values(currentRound.team1BidsAndActuals);
    const team2InputVals = Object.values(currentRound.team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;

    if (allBidsAndActualsAreEntered) {
      // Validate that actuals add up to 13 before completing the round
      const team1Actuals = [
        currentRound.team1BidsAndActuals.p1Actual,
        currentRound.team1BidsAndActuals.p2Actual,
      ];
      const team2Actuals = [
        currentRound.team2BidsAndActuals.p1Actual,
        currentRound.team2BidsAndActuals.p2Actual,
      ];

      const totalActuals = [...team1Actuals, ...team2Actuals].reduce(
        (sum, actual) => sum + parseInt(actual || 0),
        0
      );

      // Only complete the round if actuals are valid (add up to 13)
      if (totalActuals === 13) {
        // Preserve the dealer override when adding to round history
        const roundToAdd = { ...currentRound };
        setRoundHistory([...roundHistory, roundToAdd]);
        resetCurrentRound();
      }
    }
  }, [
    currentRound,
    resetCurrentRound,
    isNotDefaultValue,
    setRoundHistory,
    roundHistory,
  ]);
}
