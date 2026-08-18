import { describe, it, beforeEach, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { GlobalContext } from '../store/GlobalContext';
import { createMockGlobalContext } from './utils/mockContext';
import { useLeaveSession } from '../components/realtime/useLeaveSession';
import { getPersistedViewerSeat } from '../helpers/utils/viewerSession';
import type { GlobalContextValue } from '../types';

const { navigateMock, toasterCreateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  toasterCreateMock: vi.fn(),
}));

// `useNavigate` is spied so navigation targets can be asserted directly; the
// toaster is spied so the "Undo" action's onClick can be captured and invoked.
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('../components/ui/toaster', () => ({
  toaster: { create: toasterCreateMock },
  Toaster: () => null,
}));

function renderLeave(overrides: Partial<GlobalContextValue> = {}) {
  const value = createMockGlobalContext(overrides);
  const { result } = renderHook(() => useLeaveSession(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
    ),
  });
  return { result, value };
}

/** The toast config passed to `toaster.create` (last call), if any. */
const lastToast = () =>
  toasterCreateMock.mock.calls[toasterCreateMock.mock.calls.length - 1]?.[0];

describe('useLeaveSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('is a no-op when there is no active session', () => {
    const { result, value } = renderLeave({ sessionId: null });

    act(() => result.current());

    expect(value.endSession).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(toasterCreateMock).not.toHaveBeenCalled();
  });

  it('leaves the session and lands on the name form when there is no local game', () => {
    const { result, value } = renderLeave({ sessionId: 'sess-1', seat: 't2p1' });

    act(() => result.current());

    expect(value.endSession).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/');
    expect(lastToast()).toMatchObject({ title: 'Left the live board' });
  });

  it('leaves the session and lands on the board when this device has its own game', () => {
    window.localStorage.setItem('roundHistory', JSON.stringify([{}]));

    const { result } = renderLeave({ sessionId: 'sess-1', seat: 't2p1' });

    act(() => result.current());

    expect(navigateMock).toHaveBeenCalledWith('/spades-calculator');
  });

  it('undo re-persists the seat and re-joins the session', () => {
    const { result, value } = renderLeave({
      sessionId: 'sess-1',
      seat: 't2p2',
    });

    act(() => result.current());

    // Baseline: no persisted seat before Undo (sessionStorage was cleared in
    // beforeEach; endSession is a mocked no-op here so it can't clear it).
    expect(getPersistedViewerSeat()).toBeNull();

    const action = lastToast()?.action;
    expect(action.label).toBe('Undo');
    act(() => action.onClick());

    expect(getPersistedViewerSeat()).toBe('t2p2');
    expect(value.joinSession).toHaveBeenCalledWith('sess-1');
    expect(navigateMock).toHaveBeenLastCalledWith(
      '/spades-calculator?session=sess-1',
    );
  });
});
