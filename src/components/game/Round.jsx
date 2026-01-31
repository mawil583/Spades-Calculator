import { useEffect, useContext, useState } from 'react';
import { Container, Separator } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';

import {
  calculateRoundScore,
  isNotDefaultValue,
  calculateTeamScoreFromRoundHistory,
  convertStringInputToNum,
} from '../../helpers/math/spadesMath';
import { NIL, BLIND_NIL } from '../../helpers/utils/constants';
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

      // Calculate Game State (Start/End of this round)
      const historyUpToStart = roundHistory.slice(0, roundIndex);
      const historyUpToEnd = roundHistory.slice(0, roundIndex + 1);

      const t1Start = calculateTeamScoreFromRoundHistory(
        historyUpToStart,
        'team1BidsAndActuals',
        nilSetting
      );
      const t1End = calculateTeamScoreFromRoundHistory(
        historyUpToEnd,
        'team1BidsAndActuals',
        nilSetting
      );

      const t2Start = calculateTeamScoreFromRoundHistory(
        historyUpToStart,
        'team2BidsAndActuals',
        nilSetting
      );
      const t2End = calculateTeamScoreFromRoundHistory(
        historyUpToEnd,
        'team2BidsAndActuals',
        nilSetting
      );

      // Calculation Helper
      const calculateStats = (rawScore, netChange, startScore, endScore, bidsAndActuals) => {
        let nilPenalty = 0;
        let blindNilPenalty = 0;
        let setPenalty = 0;
        let bagPenalty = 0;

        const { p1Bid, p2Bid, p1Actual, p2Actual } = bidsAndActuals;
        const p1BidVal = convertStringInputToNum(p1Bid);
        const p2BidVal = convertStringInputToNum(p2Bid);
        const p1ActVal = convertStringInputToNum(p1Actual);
        const p2ActVal = convertStringInputToNum(p2Actual);

        // Check Nil Penalties
        if (p1Bid === NIL && p1ActVal > 0) nilPenalty += 100;
        if (p2Bid === NIL && p2ActVal > 0) nilPenalty += 100;

        // Check Blind Nil Penalties
        if (p1Bid === BLIND_NIL && p1ActVal > 0) blindNilPenalty += 200;
        if (p2Bid === BLIND_NIL && p2ActVal > 0) blindNilPenalty += 200;

        // Check Set Penalty (Board)
        // Set penalty only applies to the non-nil portion of the bid.
        // If both are Nil, there is no board bid to set.
        const p1IsNil = p1Bid === NIL || p1Bid === BLIND_NIL;
        const p2IsNil = p2Bid === NIL || p2Bid === BLIND_NIL;
        
        let boardBid = 0;
        if (!p1IsNil) boardBid += p1BidVal;
        if (!p2IsNil) boardBid += p2BidVal;

        if (boardBid > 0) {
            let teamActualForBoard = 0;
            if (!p1IsNil) teamActualForBoard += p1ActVal;
            if (!p2IsNil) teamActualForBoard += p2ActVal;
            if (teamActualForBoard < boardBid) {
                setPenalty += boardBid * 10;
            }
        }
        bagPenalty = rawScore - netChange === 100 ? 100 : 0;
        
        const totalPenalties = nilPenalty + blindNilPenalty + setPenalty + bagPenalty;
        const pointsGained = netChange + totalPenalties;

        return {
           pointsGained,
           bagPenalty,
           setPenalty,
           nilPenalty,
           blindNilPenalty,
        };
      };

      // Team 1 Stats
      const t1RawScore = team1RoundScoreFromHistory.score;
      const t1NetChange = t1End.teamScore - t1Start.teamScore;
      const t1Derived = calculateStats(t1RawScore, t1NetChange, t1Start.teamScore, t1End.teamScore, team1BidsAndActuals);
      
      // Team 2 Stats
      const t2RawScore = team2RoundScoreFromHistory.score;
      const t2NetChange = t2End.teamScore - t2Start.teamScore;
      const t2Derived = calculateStats(t2RawScore, t2NetChange, t2Start.teamScore, t2End.teamScore, team2BidsAndActuals);

      return {
        team1RoundScoreFromHistory,
        team2RoundScoreFromHistory,
        t1Stats: {
          startScore: t1Start.teamScore,
          endScore: t1End.teamScore,
          startBags: t1Start.teamBags,
          endBags: t1End.teamBags,
          pointsGained: t1Derived.pointsGained,
          bagPenalty: t1Derived.bagPenalty,
          setPenalty: t1Derived.setPenalty,
          nilPenalty: t1Derived.nilPenalty,
          blindNilPenalty: t1Derived.blindNilPenalty,
          netChange: t1NetChange,
        },
        t2Stats: {
          startScore: t2Start.teamScore,
          endScore: t2End.teamScore,
          startBags: t2Start.teamBags,
          endBags: t2End.teamBags,
          pointsGained: t2Derived.pointsGained,
          bagPenalty: t2Derived.bagPenalty,
          setPenalty: t2Derived.setPenalty,
          nilPenalty: t2Derived.nilPenalty,
          blindNilPenalty: t2Derived.blindNilPenalty,
          netChange: t2NetChange,
        },
      };
    }
    return null;
  }
  const teamScores = getTeamsScoresFromHistory();

  return (
    <div className="round" data-cy="round">
      <RoundHeading roundNumber={roundIndex + 1} names={names} />
      <Container>
        {!isCurrent && (
          <>
            <RoundSummary
              team2Name={team2Name}
              team1Name={team1Name}
              roundNumber={roundIndex + 1}
              team1RoundScore={teamScores?.t1Stats?.netChange}
              team2RoundScore={teamScores?.t2Stats?.netChange}
              team1RoundBags={teamScores?.team1RoundScoreFromHistory?.bags}
              team2RoundBags={teamScores?.team2RoundScoreFromHistory?.bags}
              team1Stats={teamScores?.t1Stats}
              team2Stats={teamScores?.t2Stats}
            />
            {showActuals && <Separator className="divider-between-sections" />}
          </>
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
