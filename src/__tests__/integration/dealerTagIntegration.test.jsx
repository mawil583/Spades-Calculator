
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from '../../components/ui/provider';
import BidSection from '../../components/game/BidSection';
import ActualSection from '../../components/game/ActualSection';
import Round from '../../components/game/Round';
import { GlobalContext } from '../../helpers/context/GlobalContext';

// Mock the spadesMath functions
jest.mock('../../helpers/math/spadesMath', () => ({
  getDealerIdHistory: jest.fn(() => []),
  getCurrentDealerId: jest.fn(() => 'team1BidsAndActuals.p1Bid'),
  addInputs: jest.fn(() => 0),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() =>
    JSON.stringify({
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
      team1Name: 'Team 1',
      team2Name: 'Team 2',
    })
  ),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockContextValue = {
  firstDealerOrder: [
    'team1BidsAndActuals.p1Bid',
    'team2BidsAndActuals.p1Bid',
    'team1BidsAndActuals.p2Bid',
    'team2BidsAndActuals.p2Bid',
  ],
  currentRound: {
    team1BidsAndActuals: { p1Bid: '', p2Bid: '' },
    team2BidsAndActuals: { p1Bid: '', p2Bid: '' },
  },
  setDealerOverride: jest.fn(),
  setCurrentRound: jest.fn(),
  setRoundHistory: jest.fn(),
};

const renderWithProviders = (component) => {
  return render(
    <Provider>
      <GlobalContext.Provider value={mockContextValue}>
        {component}
      </GlobalContext.Provider>
    </Provider>
  );
};

describe('Dealer Tag Integration at BidSection Level', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open dealer selection modal when dealer tag is clicked, not bid modal', async () => {
    const names = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    };

    renderWithProviders(
      <BidSection
        index={0}
        names={names}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockContextValue.currentRound}
      />
    );

    // Find the dealer badge (it should be visible since Player 1 is the dealer)
    const dealerBadge = screen.getByTestId('dealerBadge');
    expect(dealerBadge).toBeInTheDocument();

    // Click on the dealer badge
    fireEvent.click(dealerBadge);

    // Should open dealer selection modal, not bid modal
    expect(await screen.findByTestId('dealerSelectionModal')).toBeInTheDocument();
    expect(screen.queryByTestId('bidSelectionModal')).not.toBeInTheDocument();
  });

  it('should open bid modal when bid button is clicked, not dealer modal', async () => {
    const names = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    };

    renderWithProviders(
      <BidSection
        index={0}
        names={names}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockContextValue.currentRound}
      />
    );

    // Find the specific bid button for Player 1 (the dealer)
    const bidButtons = screen.getAllByRole('button', { name: /bid/i });
    const firstBidButton = bidButtons[0];
    expect(firstBidButton).toBeInTheDocument();

    // Click on the bid button
    fireEvent.click(firstBidButton);

    // Should open bid modal, not dealer modal
    expect(await screen.findByTestId('bidSelectionModal')).toBeInTheDocument();
    expect(
      screen.queryByTestId('dealerSelectionModal')
    ).not.toBeInTheDocument();
  });

  it('should allow both modals to work independently', async () => {
    const names = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    };

    renderWithProviders(
      <BidSection
        index={0}
        names={names}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockContextValue.currentRound}
      />
    );

    // First, open dealer modal
    const dealerBadge = screen.getByTestId('dealerBadge');
    fireEvent.click(dealerBadge);
    expect(await screen.findByTestId('dealerSelectionModal')).toBeInTheDocument();

    // Close dealer modal
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Wait for modal to close
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('dealerSelectionModal')
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Then, open bid modal (using the first bid button)
    const bidButtons = screen.getAllByRole('button', { name: /bid/i });
    const firstBidButton = bidButtons[0];
    fireEvent.click(firstBidButton);
    expect(await screen.findByTestId('bidSelectionModal')).toBeInTheDocument();

    // Close bid modal
    const closeButton = await screen.findByLabelText('Close');
    fireEvent.click(closeButton);

    // Wait for modal to close
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('bidSelectionModal')
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should not have hover state association between player name and bid button', () => {
    const names = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    };

    const { container } = renderWithProviders(
      <BidSection
        index={0}
        names={names}
        isCurrent={true}
        roundHistory={[]}
        currentRound={mockContextValue.currentRound}
      />
    );

    // Verify that the player name is a span, not a label
    const playerNameSpan = screen.getByText('Player 1');
    expect(playerNameSpan.tagName).toBe('SPAN');
    expect(playerNameSpan).not.toHaveAttribute('for');

    // Verify that there's no label element associated with the bid button
    const bidButtons = screen.getAllByRole('button', { name: /bid/i });
    const firstBidButton = bidButtons[0];
    const bidButtonId = firstBidButton.id;

    // Check that no label has htmlFor matching the bid button's id
    const labels = container.querySelectorAll('label');
    const hasAssociatedLabel = Array.from(labels).some(
      (label) => label.getAttribute('for') === bidButtonId
    );
    expect(hasAssociatedLabel).toBe(false);
  });
});

describe('Dealer Tag Visibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show dealer tag only in bid section, not in actuals section', () => {
    const names = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    };

    const currentRoundWithBids = {
      team1BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '2',
        p1Actual: '',
        p2Actual: '',
      },
      team2BidsAndActuals: {
        p1Bid: '2',
        p2Bid: '3',
        p1Actual: '',
        p2Actual: '',
      },
    };

    // Render bid section
    const { rerender } = renderWithProviders(
      <BidSection
        index={0}
        names={names}
        isCurrent={true}
        roundHistory={[]}
        currentRound={currentRoundWithBids}
      />
    );

    // Dealer tag should be visible in bid section
    const dealerBadge = screen.getByTestId('dealerBadge');
    expect(dealerBadge).toBeInTheDocument();

    // Clear the screen and render actuals section
    rerender(
      <Provider>
        <GlobalContext.Provider value={mockContextValue}>
          <ActualSection
            index={0}
            names={names}
            isCurrent={true}
            roundHistory={[]}
            currentRound={currentRoundWithBids}
          />
        </GlobalContext.Provider>
      </Provider>
    );

    // Dealer tag should NOT be visible in actuals section
    expect(screen.queryByTestId('dealerBadge')).not.toBeInTheDocument();
  });

  it('should show dealer tag only in bid section when both sections are rendered in a round', () => {
    const currentRoundWithBidsAndActuals = {
      team1BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '2',
        p1Actual: '3',
        p2Actual: '2',
      },
      team2BidsAndActuals: {
        p1Bid: '2',
        p2Bid: '3',
        p1Actual: '2',
        p2Actual: '3',
      },
    };

    // Create a context value with the current round data
    const contextWithRoundData = {
      ...mockContextValue,
      currentRound: currentRoundWithBidsAndActuals,
    };

    render(
      <Provider>
        <GlobalContext.Provider value={contextWithRoundData}>
          <Round roundHistory={[]} isCurrent={true} roundIndex={0} />
        </GlobalContext.Provider>
      </Provider>
    );

    // Dealer tag should be visible in bid section
    const dealerBadge = screen.getByTestId('dealerBadge');
    expect(dealerBadge).toBeInTheDocument();

    // Count how many dealer badges are present - should be exactly 1 (only in bid section)
    const dealerBadges = screen.getAllByTestId('dealerBadge');
    expect(dealerBadges).toHaveLength(1);
  });

  it('should maintain dealer tag functionality in bid section while ensuring it does not appear in actuals', async () => {
    const names = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    };

    const currentRoundWithBids = {
      team1BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '2',
        p1Actual: '',
        p2Actual: '',
      },
      team2BidsAndActuals: {
        p1Bid: '2',
        p2Bid: '3',
        p1Actual: '',
        p2Actual: '',
      },
    };

    renderWithProviders(
      <BidSection
        index={0}
        names={names}
        isCurrent={true}
        roundHistory={[]}
        currentRound={currentRoundWithBids}
      />
    );

    // Dealer tag should be visible and clickable in bid section
    const dealerBadge = screen.getByTestId('dealerBadge');
    expect(dealerBadge).toBeInTheDocument();

    // Click on dealer badge should open dealer selection modal
    fireEvent.click(dealerBadge);
    expect(await screen.findByTestId('dealerSelectionModal')).toBeInTheDocument();
  });
});
