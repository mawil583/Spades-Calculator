import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { GameScore, Rounds } from '../components/game';
import { Header, Box, Center, Text } from '../components/ui';
import { UpdateNotification, GameWonModal } from '../components';
import { useRedirectWhenFalsey } from '../helpers/utils/hooks';
import { useFeatureFlag } from '../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../helpers/utils/featureFlags';
import { GlobalContext } from '../store/GlobalContext';
import { getPersistedViewerSession } from '../helpers/utils/viewerSession';
import { rotateArr } from '../helpers/utils/helperFunctions';
import {
  calculateTeamScoreFromRoundHistory,
  calculateRoundScore,
  isRoundComplete,
} from '../helpers/math/spadesMath';
import { TEAM1, TEAM2 } from '../helpers/utils/constants';
import type { NilSetting } from '../types';

function SpadesCalculator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionParam = searchParams.get('session');

  const {
    names,
    role,
    sessionId,
    isViewerSynced,
    joinSession,
    scoreLimit,
    setScoreLimit,
    displayNames,
    firstDealerOrder,
    setFirstDealerOrder,
    roundHistory,
    setRoundHistory,
    resetCurrentRound,
    viewCurrentRound,
    viewRoundHistory,
    nilScoringRule,
  } = useContext(GlobalContext);

  // A viewer whose session was persisted (e.g. after navigating away and back)
  // is still a viewer even before the URL is re-synced below. Treating them as
  // one here also stops useRedirectWhenFalsey from booting them to '/' while
  // the session is being restored.
  const isViewerUrl = Boolean(sessionParam) || Boolean(getPersistedViewerSession());
  useRedirectWhenFalsey(names, navigate, !isViewerUrl);
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);

  // ── Score limit: announce the winner once a team reaches it ──
  // Only fully completed rounds count toward the win check: a round is done
  // when every bid/actual is entered and the actuals total 13. That way both
  // teams' actuals are always in before anyone is declared the winner, and if
  // both teams crossed in the same round the higher score takes the game —
  // or, on an exact tie, the players are offered overtime.
  const [isWinDismissed, setIsWinDismissed] = useState(false);
  const [dismissedTieAt, setDismissedTieAt] = useState<number | null>(null);

  const finishedGameScores = useMemo(() => {
    const nilSetting = (nilScoringRule || null) as NilSetting | null;
    const history = viewRoundHistory ?? [];
    let t1 = calculateTeamScoreFromRoundHistory(history, TEAM1, nilSetting)
      .teamScore;
    let t2 = calculateTeamScoreFromRoundHistory(history, TEAM2, nilSetting)
      .teamScore;

    if (isRoundComplete(viewCurrentRound)) {
      const { team1BidsAndActuals, team2BidsAndActuals } = viewCurrentRound;
      t1 += calculateRoundScore(
        team1BidsAndActuals.p1Bid,
        team1BidsAndActuals.p2Bid,
        team1BidsAndActuals.p1Actual,
        team1BidsAndActuals.p2Actual,
        nilSetting ?? undefined,
      ).score;
      t2 += calculateRoundScore(
        team2BidsAndActuals.p1Bid,
        team2BidsAndActuals.p2Bid,
        team2BidsAndActuals.p1Actual,
        team2BidsAndActuals.p2Actual,
        nilSetting ?? undefined,
      ).score;
    }

    return { team1: t1, team2: t2 };
  }, [viewRoundHistory, viewCurrentRound, nilScoringRule]);

  const { roundWinner, tiedAt } = useMemo<{
    roundWinner: 'team1' | 'team2' | null;
    tiedAt: number | null;
  }>(() => {
    if (scoreLimit == null) return { roundWinner: null, tiedAt: null };
    const t1 = finishedGameScores.team1;
    const t2 = finishedGameScores.team2;
    const t1Hit = t1 >= scoreLimit;
    const t2Hit = t2 >= scoreLimit;
    if (!t1Hit && !t2Hit) return { roundWinner: null, tiedAt: null };
    if (t1Hit && t2Hit) {
      if (t1 > t2) return { roundWinner: 'team1', tiedAt: null };
      if (t2 > t1) return { roundWinner: 'team2', tiedAt: null };
      return { roundWinner: null, tiedAt: t1 };
    }
    return {
      roundWinner: t1Hit ? 'team1' : 'team2',
      tiedAt: null,
    };
  }, [scoreLimit, finishedGameScores]);

  // A dismissal only suppresses the announcement while the scores that
  // produced it remain; once the game resets below the limit it clears.
  if (roundWinner === null && isWinDismissed) {
    setIsWinDismissed(false);
  }
  if (tiedAt === null && dismissedTieAt !== null) {
    setDismissedTieAt(null);
  }

  const isTie = roundWinner === null && tiedAt !== null;
  const isGameEndModalOpen =
    role !== 'viewer' &&
    ((roundWinner !== null && !isWinDismissed) ||
      (isTie && dismissedTieAt !== tiedAt));

  // "New Game" from the end-game modals always resolves the score-limit
  // prompt first: null wipes the limit, a number starts the rematch with it.
  const handleStartNewGameWithLimit = (limit: number | null) => {
    setScoreLimit(limit);
    if (roundHistory.length > 0) {
      setFirstDealerOrder(rotateArr(firstDealerOrder));
    }
    resetCurrentRound();
    setRoundHistory([]);
  };

  // A visitor whose URL carries ?session= is a viewer: subscribe to the session.
  // If the URL lost the param (navigated to landing and back), restore it from
  // persistence and re-sync the URL so a refresh still works.
  //
  // `joinedSessionRef` prevents a re-join race on "Leave": endSession flips
  // `role` to 'local' synchronously, but navigate() is a React transition that
  // removes `?session=` from the URL a beat later. Without the guard, the effect
  // re-runs with `role === 'local'` while `sessionParam` is still present and
  // immediately re-joins — bouncing the user back into viewer mode (chip stays,
  // and the homepage redirect loop traps them).
  const joinedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (sessionParam) {
      if (role !== 'viewer' && joinedSessionRef.current !== sessionParam) {
        joinedSessionRef.current = sessionParam;
        joinSession(sessionParam);
      }
      return;
    }
    const persisted = getPersistedViewerSession();
    if (!persisted) return;
    if (role !== 'viewer' || sessionId !== persisted) {
      joinSession(persisted);
    }
    navigate(`/spades-calculator?session=${persisted}`, { replace: true });
  }, [sessionParam, role, sessionId, joinSession, navigate]);

  // Keep a viewer's screen awake at the table (phones sleep otherwise).
  useEffect(() => {
    if (role !== 'viewer') return;
    let sentinel: { release: () => Promise<void> } | null = null;
    if ('wakeLock' in navigator) {
      (navigator as Navigator & {
        wakeLock: { request: (t: string) => Promise<typeof sentinel> };
      })
        .wakeLock.request('screen')
        .then((s) => (sentinel = s))
        .catch((err) => console.error('Wake lock denied:', err));
    }
    return () => {
      sentinel?.release().catch(() => undefined);
    };
  }, [role]);

  const board = (
    <>
      {useTableRoundUI ? null : <GameScore />}
      <Rounds />
    </>
  );

  // Viewer: connecting screen until the leader's state arrives.
  if (role === 'viewer' && !isViewerSynced) {
    return (
      <div className="App">
        <Center h="80vh">
          <Text>Connecting to live board…</Text>
        </Center>
      </div>
    );
  }

  return (
    <div className="App">
      <UpdateNotification />
      {/* The header stays interactive in every role so a viewer can still open
          the menu and use "Switch seat". Only the read-only board is blocked
          from pointer events for viewers. */}
      <Header />
      {names && (
        role === 'viewer' ? (
          <Box style={{ pointerEvents: 'none' }}>{board}</Box>
        ) : (
          <Box>{board}</Box>
        )
      )}
      <GameWonModal
        isOpen={isGameEndModalOpen}
        setIsModalOpen={(open) => {
          if (!open) {
            if (roundWinner) setIsWinDismissed(true);
            else if (tiedAt !== null) setDismissedTieAt(tiedAt);
          }
        }}
        isTie={isTie}
        winnerTeam={roundWinner ?? 'team1'}
        winnerName={
          roundWinner === 'team2'
            ? displayNames.team2Name
            : displayNames.team1Name
        }
        minLimit={
          roundWinner === null
            ? 0
            : roundWinner === 'team2'
              ? finishedGameScores.team2
              : finishedGameScores.team1
        }
        scoreboard={<GameScore />}
        onStartNewGameWithLimit={handleStartNewGameWithLimit}
        onSetNewLimit={(limit) => setScoreLimit(limit)}
      />
    </div>
  );
}

export default SpadesCalculator;