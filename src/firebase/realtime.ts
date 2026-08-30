import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  type Database,
  type Unsubscribe,
} from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirebaseConfig } from './config';
import {
  EMPTY_ROUND,
  initialNames,
  initialFirstDealerOrder,
  TAKES_BAGS,
} from '../helpers/utils/constants';
import { getFeatureFlag, FEATURE_FLAGS } from '../helpers/utils/featureFlags';
import type { AppState } from '../types';

let app: FirebaseApp | null = null;
let db: Database | null = null;
let anonymousUid: string | null = null;

/**
 * Initializes (lazily) the Firebase app from config. Returns null when
 * Firebase is not configured — the app then behaves as a normal local PWA.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  const config = getFirebaseConfig();
  if (!config) return null;
  app = initializeApp(config);
  return app;
}

/** True when the realtime layer is available (i.e. Firebase is configured). */
export function isRealtimeEnabled(): boolean {
  return getFirebaseApp() !== null;
}

function getRTDB(): Database {
  if (!db) {
    const fb = getFirebaseApp();
    if (!fb) throw new Error('Firebase is not configured');
    db = getDatabase(fb);
  }
  return db;
}

function sessionPath(id: string): string {
  return `sessions/${id}`;
}

/**
 * Coerces a state read from (or written to) Realtime Database into the full
 * AppState shape, defaulting any field that is missing/undefined. JSON
 * serialization drops `undefined`, so a brand-new session can be stored without
 * `roundHistory`, which would crash the viewer (e.g. WarningModal calls
 * `roundHistory.length`). Normalizing on both read AND write prevents that.
 */
function normalizeState(raw: AppState | null | undefined): AppState {
  return {
    currentRound: raw?.currentRound ?? EMPTY_ROUND,
    roundHistory: Array.isArray(raw?.roundHistory) ? raw!.roundHistory : [],
    firstDealerOrder: raw?.firstDealerOrder ?? initialFirstDealerOrder,
    isFirstGameAmongTeammates: raw?.isFirstGameAmongTeammates ?? true,
    names: raw?.names ?? initialNames,
    nilScoringRule: raw?.nilScoringRule ?? TAKES_BAGS,
    scoreLimit: raw?.scoreLimit ?? null,
  } as AppState;
}

/**
 * Anonymous sign-in gives the leader a stable uid. RTDB security rules use it
 * to enforce leader-only writes without requiring user accounts.
 */
async function ensureLeaderUid(): Promise<string> {
  if (anonymousUid) return anonymousUid;
  const fb = getFirebaseApp();
  if (!fb) throw new Error('Firebase is not configured');
  const auth = getAuth(fb);
  await signInAnonymously(auth);
  anonymousUid = auth.currentUser?.uid ?? null;
  if (!anonymousUid) throw new Error('Anonymous auth failed');
  return anonymousUid;
}

/**
 * Creates a new session and seeds it with the current state. The leader's
 * anonymous uid is stored on the session so rules can enforce write access.
 */
export async function createSession(state: AppState): Promise<string> {
  const uid = await ensureLeaderUid();
  const id = crypto.randomUUID();
  await set(ref(getRTDB(), sessionPath(id)), {
    leaderUid: uid,
    state: normalizeState(state),
  });
  return id;
}

/** Leader pushes the full state to an existing session, along with current UI mode. */
export async function writeSessionState(
  id: string,
  state: AppState,
): Promise<void> {
  // ensureLeaderUid() keeps the anonymous sign-in alive so auth.uid is present
  // for the security rule to compare against the session's stored leaderUid.
  await ensureLeaderUid();
  const uiMode = getFeatureFlag(FEATURE_FLAGS.TABLE_ROUND_UI);
  // update() (not set()) so leaderUid — established once at createSession() —
  // is never overwritten. Re-writing it on every push would let any client
  // claim an existing session by writing its own uid (see firebase.rules.json).
  await update(ref(getRTDB(), sessionPath(id)), {
    state: normalizeState(state),
    uiMode,
  });
}

/**
 * Subscribes (read-only) to a session. `onState` fires immediately with the
 * current state and again on every leader update. `onUiMode` fires with the
 * leader's feature-flag preference so the viewer can apply it as default.
 * Returns an unsubscribe fn.
 */
export function subscribeSession(
  id: string,
  onState: (state: AppState) => void,
  onError?: (err: Error) => void,
  onUiMode?: (uiMode: boolean) => void,
): Unsubscribe {
  const unsubscribe = onValue(
    ref(getRTDB(), sessionPath(id)),
    (snapshot) => {
      const val = snapshot.val();
      if (val && val.state) {
        onState(normalizeState(val.state as AppState));
      }
      if (val && typeof val.uiMode === 'boolean' && onUiMode) {
        onUiMode(val.uiMode);
      }
    },
    onError,
  );
  return unsubscribe;
}