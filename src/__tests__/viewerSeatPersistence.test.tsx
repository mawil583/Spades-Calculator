import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { useContext, useEffect, useRef } from 'react';
import { StateProvider, GlobalContext } from '../store/GlobalContext';
import {
  getPersistedViewerSeat,
  persistViewerSeat,
} from '../helpers/utils/viewerSession';
import type { GlobalContextValue, Seat } from '../types';

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

function ViewerHarness({ id, seat }: { id: string; seat?: Seat }) {
  const value = useContext(GlobalContext);
  const joinedRef = useRef(false);
  const seatedRef = useRef(false);

  useEffect(() => {
    ctx = value;
  }, [value]);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;
    value.joinSession(id);
  }, [value, id]);

  useEffect(() => {
    if (seatedRef.current || !seat) return;
    seatedRef.current = true;
    value.setSeat(seat);
  }, [value, seat]);

  return null;
}

describe('viewer seat persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribeSessionMock.mockReturnValue(() => {});
    window.sessionStorage.clear();
  });

  it('persists the seat when a viewer chooses one', async () => {
    render(
      <StateProvider>
        <ViewerHarness id="s1" seat="t2p1" />
      </StateProvider>,
    );

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalled());
    await waitFor(() => expect(getPersistedViewerSeat()).toBe('t2p1'));
  });

  it('restores a previously persisted seat when a viewer rejoins', async () => {
    persistViewerSeat('t2p2');

    render(
      <StateProvider>
        <ViewerHarness id="s1" />
      </StateProvider>,
    );

    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalled());
    await waitFor(() => expect(ctx.seat).toBe('t2p2'));
  });

  it('clears the persisted seat when the session ends', async () => {
    render(
      <StateProvider>
        <ViewerHarness id="s1" seat="t2p1" />
      </StateProvider>,
    );

    await waitFor(() => expect(getPersistedViewerSeat()).toBe('t2p1'));

    act(() => ctx.endSession());
    expect(getPersistedViewerSeat()).toBeNull();
  });
});
