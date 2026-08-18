import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { GameScore, Rounds } from '../components/game';
import { Header, Box, Center, Text } from '../components/ui';
import { UpdateNotification } from '../components';
import { useRedirectWhenFalsey } from '../helpers/utils/hooks';
import { useFeatureFlag } from '../helpers/utils/useFeatureFlag';
import { FEATURE_FLAGS } from '../helpers/utils/featureFlags';
import { GlobalContext } from '../store/GlobalContext';
import { getPersistedViewerSession } from '../helpers/utils/viewerSession';

function SpadesCalculator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionParam = searchParams.get('session');

  const { names, role, sessionId, isViewerSynced, joinSession } =
    useContext(GlobalContext);

  // A viewer whose session was persisted (e.g. after navigating away and back)
  // is still a viewer even before the URL is re-synced below. Treating them as
  // one here also stops useRedirectWhenFalsey from booting them to '/' while
  // the session is being restored.
  const isViewerUrl = Boolean(sessionParam) || Boolean(getPersistedViewerSession());
  useRedirectWhenFalsey(names, navigate, !isViewerUrl);
  const [useTableRoundUI] = useFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);

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
    </div>
  );
}

export default SpadesCalculator;