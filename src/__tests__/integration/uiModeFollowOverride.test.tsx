import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { useContext, useEffect, useRef } from 'react';
import { StateProvider, GlobalContext } from '../../store/GlobalContext';
import { FEATURE_FLAGS } from '../../helpers/utils/featureFlags';
import type { GlobalContextValue } from '../../types';

// Capture the realtime layer so we can drive the onUiMode callback that
// subscribeSession would otherwise hand to the Firebase onValue listener.
const { subscribeSessionMock } = vi.hoisted(() => ({
  subscribeSessionMock: vi.fn(),
}));

vi.mock('../../firebase/realtime', () => ({
  isRealtimeEnabled: vi.fn(() => false),
  createSession: vi.fn(),
  writeSessionState: vi.fn(),
  subscribeSession: subscribeSessionMock,
}));

// Latest context value, refreshed on every render so tests can reach
// endSession / joinSession without a button-driven harness.
let ctx: GlobalContextValue;

function ViewerHarness({ id }: { id: string }) {
  const value = useContext(GlobalContext);
  const joinedRef = useRef(false);

  useEffect(() => {
    ctx = value;
  }, [value]);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;
    value.joinSession(id);
  }, [value, id]);

  return null;
}

// subscribeSession(id, onState, onError?, onUiMode?)
const onUiModeOf = (callIndex: number): ((uiMode: boolean) => void) =>
  subscribeSessionMock.mock.calls[callIndex][3];

describe('uiMode follow / override', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribeSessionMock.mockReturnValue(() => {});
    window.localStorage.clear();
  });

  it('applies the leader uiMode on first sync only', async () => {
    render(
      <StateProvider>
        <ViewerHarness id="session-1" />
      </StateProvider>,
    );

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalledTimes(1));
    const onUiMode = onUiModeOf(0);
    expect(typeof onUiMode).toBe('function');

    // First sync: leader's preference is adopted as the default.
    act(() => onUiMode(true));
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe('true');

    // Subsequent syncs must NOT overwrite the viewer's (already applied) mode.
    act(() => onUiMode(false));
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe('true');
  });

  it('re-applies the leader uiMode after endSession resets the guard', async () => {
    render(
      <StateProvider>
        <ViewerHarness id="session-a" />
      </StateProvider>,
    );

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalledTimes(1));
    act(() => onUiModeOf(0)(true));
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe('true');

    // Ending the session resets uiModeAppliedRef, so a fresh join is allowed
    // to adopt the (possibly changed) leader preference again.
    act(() => ctx.endSession());
    act(() => ctx.joinSession('session-b'));

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalledTimes(2));
    act(() => onUiModeOf(1)(false));
    expect(localStorage.getItem(FEATURE_FLAGS.TABLE_ROUND_UI)).toBe('false');
  });
});
