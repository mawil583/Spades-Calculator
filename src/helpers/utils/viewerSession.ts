const VIEWER_SESSION_STORAGE_KEY = 'viewerSessionId';
const VIEWER_SEAT_STORAGE_KEY = 'viewerSeat';

/**
 * Persists the viewer's active session id so navigating away from
 * `/spades-calculator` (which strips the `?session=` query param) doesn't lose
 * the live board. sessionStorage is per-tab and survives reloads but clears
 * when the tab closes — exactly the lifetime a "watching this game" token wants.
 */
export function persistViewerSession(id: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(VIEWER_SESSION_STORAGE_KEY, id);
}

export function clearPersistedViewerSession(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(VIEWER_SESSION_STORAGE_KEY);
}

export function getPersistedViewerSession(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(VIEWER_SESSION_STORAGE_KEY);
}

/**
 * Persists the viewer's chosen seat so navigating away and back doesn't
 * re-prompt them to pick their seat again. Session-scoped like the session id.
 */
export function persistViewerSeat(seat: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(VIEWER_SEAT_STORAGE_KEY, seat);
}

export function clearPersistedViewerSeat(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(VIEWER_SEAT_STORAGE_KEY);
}

export function getPersistedViewerSeat(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(VIEWER_SEAT_STORAGE_KEY);
}
