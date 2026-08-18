import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { Provider } from '../components/ui/provider';
import { GlobalContext } from '../store/GlobalContext';
import { createMockGlobalContext } from './utils/mockContext';
import { persistViewerSession } from '../helpers/utils/viewerSession';
import NameForm from '../components/forms/NameForm';

// Reports the current location so navigation can be asserted (createMemoryRouter
// throws an AbortSignal realm-mismatch on `navigate` under vitest+jsdom, so we
// use MemoryRouter + a useLocation probe instead).
function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
}

describe('viewer landing-page redirect', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('redirects a viewer from the landing page back to their live board', async () => {
    persistViewerSession('sess-123');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider>
          <GlobalContext.Provider
            value={createMockGlobalContext({ role: 'viewer' })}
          >
            <LocationProbe />
            <Routes>
              <Route path="/" element={<NameForm />} />
              <Route path="/spades-calculator" element={<div>board</div>} />
            </Routes>
          </GlobalContext.Provider>
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/spades-calculator?session=sess-123',
      );
    });
  });

  it('does not redirect a local player with no persisted viewer session', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider>
          <GlobalContext.Provider value={createMockGlobalContext()}>
            <LocationProbe />
            <Routes>
              <Route path="/" element={<NameForm />} />
              <Route path="/spades-calculator" element={<div>board</div>} />
            </Routes>
          </GlobalContext.Provider>
        </Provider>
      </MemoryRouter>,
    );

    // Stays on the landing page (the "Start"/"Continue" form is visible).
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });
});
