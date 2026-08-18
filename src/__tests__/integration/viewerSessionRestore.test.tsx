import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useContext, useEffect } from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StateProvider, GlobalContext } from '../../store/GlobalContext';
import SpadesCalculator from '../../pages/SpadesCalculator';
import { Provider } from '../../components/ui/provider';
import type { GlobalContextValue } from '../../types';

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

function CtxHarness() {
  const value = useContext(GlobalContext);
  useEffect(() => {
    ctx = value;
  }, [value]);
  return null;
}

// Exposes the current location so tests can assert the URL was re-synced.
function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
}

const renderCalculator = (initialEntry = '/spades-calculator') => {
  render(
    <Provider>
      <StateProvider>
        <CtxHarness />
        <MemoryRouter initialEntries={[initialEntry]}>
          <LocationProbe />
          <Routes>
            <Route path="/" element={<div>home</div>} />
            <Route path="/spades-calculator" element={<SpadesCalculator />} />
          </Routes>
        </MemoryRouter>
      </StateProvider>
    </Provider>,
  );
};

describe('viewer session restore after navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribeSessionMock.mockReturnValue(() => {});
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('re-joins the persisted session and re-syncs the URL when ?session= is missing', async () => {
    // Simulate a viewer whose session was persisted before navigating away and
    // back to `/spades-calculator` without the query string.
    window.sessionStorage.setItem('viewerSessionId', 'session-restored');
    renderCalculator('/spades-calculator');

    // The viewer re-subscribes to the persisted session (joinSession -> subscribe).
    await waitFor(() => {
      expect(subscribeSessionMock).toHaveBeenCalledWith(
        'session-restored',
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      );
    });

    // The URL is made truthful again so a refresh still works.
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe(
        '/spades-calculator?session=session-restored',
      );
    });
  });

  it('does not restore when there is no persisted session', async () => {
    renderCalculator('/spades-calculator');

    // With no persisted session, a visitor with no names is redirected home.
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/');
    });
    expect(subscribeSessionMock).not.toHaveBeenCalled();
  });

  it('does not re-join after the viewer leaves (endSession)', async () => {
    renderCalculator('/spades-calculator?session=sess-1');

    // The viewer joins on the initial ?session= URL.
    await waitFor(() => expect(subscribeSessionMock).toHaveBeenCalledTimes(1));

    // Simulate "Leave": endSession flips role to 'local' synchronously, but the
    // URL still carries ?session= (navigate removes it a beat later). The
    // effect must NOT treat this as a fresh join and re-subscribe.
    act(() => ctx.endSession());

    await waitFor(() => expect(ctx.role).toBe('local'));
    expect(subscribeSessionMock).toHaveBeenCalledTimes(1);
  });
});
