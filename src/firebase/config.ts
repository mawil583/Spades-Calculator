export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseURL: string;
}

/**
 * Reads the Firebase web config from Vite environment variables.
 *
 * Prefers a single JSON blob `VITE_FIREBASE_CONFIG` (paste the whole
 * firebaseConfig object you copy from the console). Falls back to individual
 * `VITE_FIREBASE_*` vars if that isn't set.
 *
 * Returns null when Firebase is NOT configured, in which case the app runs as
 * a normal local-only PWA (no realtime features). This is the safe fallback so
 * the app works out of the box without any credentials.
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  const env = import.meta.env as Record<string, string | undefined>;

  let cfg: Partial<FirebaseConfig> | null = null;

  const json = env.VITE_FIREBASE_CONFIG;
  if (json) {
    try {
      const parsed = JSON.parse(json) as Partial<FirebaseConfig>;
      if (parsed?.apiKey && parsed?.projectId) {
        cfg = parsed;
      }
    } catch {
      cfg = null; // malformed JSON — fall through to individual vars
    }
  }

  if (!cfg) {
    const apiKey = env.VITE_FIREBASE_API_KEY;
    const projectId = env.VITE_FIREBASE_PROJECT_ID;
    if (!apiKey || !projectId) return null;
    cfg = {
      apiKey,
      projectId,
      databaseURL: env.VITE_FIREBASE_DATABASE_URL ?? '',
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
      appId: env.VITE_FIREBASE_APP_ID ?? '',
    };
  }

  // Realtime Database cannot initialize without a databaseURL — getDatabase()
  // throws at runtime if it's empty. A pasted firebaseConfig blob may omit it
  // (the console drops it when RTDB isn't enabled), so normalize both config
  // sources and degrade to local-only PWA with a loud warning instead of
  // crashing mid-session.
  const databaseURL = cfg.databaseURL ?? env.VITE_FIREBASE_DATABASE_URL ?? '';
  if (!databaseURL) {
    console.warn(
      'Firebase config is missing databaseURL — realtime features are disabled.',
    );
    return null;
  }

  return {
    apiKey: cfg.apiKey ?? '',
    projectId: cfg.projectId ?? '',
    databaseURL,
    authDomain: cfg.authDomain ?? `${cfg.projectId ?? ''}.firebaseapp.com`,
    storageBucket: cfg.storageBucket ?? '',
    messagingSenderId: cfg.messagingSenderId ?? '',
    appId: cfg.appId ?? '',
  };
}