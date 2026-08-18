import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Provider } from '../components/ui/provider';
import { GlobalContext } from '../store/GlobalContext';
import { createMockGlobalContext } from './utils/mockContext';
import { persistViewerSeat } from '../helpers/utils/viewerSession';
import Header from '../components/ui/Header';
import type { Round } from '../types';

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

// `useNavigate` is spied so a viewer's click can be asserted to NOT navigate.
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

const emptyRound = {
  team1BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
  team2BidsAndActuals: { p1Bid: '', p2Bid: '', p1Actual: '', p2Actual: '' },
} as unknown as Round;

const renderHeader = (role: 'viewer' | 'local') => {
  // Persist a seat so the viewer seat picker doesn't auto-open and cover the title.
  if (role === 'viewer') persistViewerSeat('t2p1');

  render(
    <MemoryRouter>
      <Provider>
        <GlobalContext.Provider
          value={createMockGlobalContext({ role, currentRound: emptyRound })}
        >
          <Header />
        </GlobalContext.Provider>
      </Provider>
    </MemoryRouter>,
  );
};

describe('header home-title navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('does not navigate home when a viewer clicks the title', () => {
    renderHeader('viewer');

    fireEvent.click(screen.getByText('SpadesCalculator'));

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('still navigates home when a local player clicks the title', () => {
    renderHeader('local');

    fireEvent.click(screen.getByText('SpadesCalculator'));

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
