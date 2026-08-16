import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { useContext, useEffect, useRef } from 'react';
import { StateProvider, GlobalContext } from '../store/GlobalContext';
import { getPersistedViewerSession } from '../helpers/utils/viewerSession';
import type { GlobalContextValue } from '../types';

const { subscribeSessionMock } = vi.hoisted(() => ({
  subscribeSessionMock: vi.fn(),
}));

vi.mock('../firebase/realtime', () => ({
  isRealtimeEnabled: vi.fn(() => false),
  createSession: vi.fn(),
  writeSessionState: vi.fn(),
  subscribeSession: subscribeSessionMock,
}));

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

describe('viewer session persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribeSessionMock.mockReturnValue(() => {});
    window.sessionStorage.clear();
  });

  it('persists the session id when a viewer joins', async () => {
    render(
      <StateProvider>
        <ViewerHarness id="session-persist" />
      </StateProvider>,
    );

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalled());
    expect(getPersistedViewerSession()).toBe('session-persist');
  });

  it('clears the persisted id when the session ends', async () => {
    render(
      <StateProvider>
        <ViewerHarness id="session-persist" />
      </StateProvider>,
    );

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalled());
    expect(getPersistedViewerSession()).toBe('session-persist');

    act(() => ctx.endSession());
    expect(getPersistedViewerSession()).toBeNull();
  });
});
