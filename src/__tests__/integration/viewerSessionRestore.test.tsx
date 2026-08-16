import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StateProvider } from '../../store/GlobalContext';
import SpadesCalculator from '../../pages/SpadesCalculator';
import { Provider } from '../../components/ui/provider';

const { subscribeSessionMock } = vi.hoisted(() => ({
  subscribeSessionMock: vi.fn(),
}));

vi.mock('../../firebase/realtime', () => ({
  isRealtimeEnabled: vi.fn(() => false),
  createSession: vi.fn(),
  writeSessionState: vi.fn(),
  subscribeSession: subscribeSessionMock,
}));

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
});
