import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import DealerTag from '../components/ui/DealerTag';
import { GlobalContext } from '../helpers/context/GlobalContext';

// Custom query functions for data-cy attributes
const findElementByDataCy = (container, dataCy) => {
  // Search in container first, then in document body for portal elements
  let element = container.querySelector(`[data-cy="${dataCy}"]`);
  if (!element) {
    element = document.body.querySelector(`[data-cy="${dataCy}"]`);
  }
  if (!element) {
    throw new Error(`Unable to find an element by: [data-cy="${dataCy}"]`);
  }
  return element;
};

const queryElementByDataCy = (container, dataCy) => {
  // Search in container first, then in document body for portal elements
  let element = container.querySelector(`[data-cy="${dataCy}"]`);
  if (!element) {
    element = document.body.querySelector(`[data-cy="${dataCy}"]`);
  }
  return element;
};

const findAllElementsByDataCy = (container, dataCy) => {
  // Handle case where container might be a function or undefined
  if (typeof container === 'function' || !container) {
    return Array.from(document.body.querySelectorAll(`[data-cy="${dataCy}"]`));
  }

  // Search in container first, then in document body for portal elements
  let elements = Array.from(
    container.querySelectorAll(`[data-cy="${dataCy}"]`)
  );
  if (elements.length === 0) {
    elements = Array.from(
      document.body.querySelectorAll(`[data-cy="${dataCy}"]`)
    );
  }
  return elements;
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const renderWithProviders = (component, contextValue = {}) => {
  const defaultContextValue = {
    firstDealerOrder: [
      'team1BidsAndActuals.p1Bid',
      'team1BidsAndActuals.p2Bid',
      'team2BidsAndActuals.p1Bid',
      'team2BidsAndActuals.p2Bid',
    ],
    currentRound: {},
    roundHistory: [],
    setDealerOverride: jest.fn(),
    setCurrentRound: jest.fn(),
    setRoundHistory: jest.fn(),
    resetCurrentRound: jest.fn(),
    setFirstDealerOrder: jest.fn(),
    resetRoundHistory: jest.fn(),
    isFirstGameAmongTeammates: false,
    ...contextValue,
  };

  const result = render(
    <ChakraProvider>
      <GlobalContext.Provider value={defaultContextValue}>
        {component}
      </GlobalContext.Provider>
    </ChakraProvider>
  );

  return {
    ...result,
    getByDataCy: (dataCy) => findElementByDataCy(result.container, dataCy),
    queryByDataCy: (dataCy) => queryElementByDataCy(result.container, dataCy),
    getAllByDataCy: (dataCy) =>
      findAllElementsByDataCy(result.container, dataCy),
  };
};

describe('DealerTag Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        t1p1Name: 'Alice',
        t1p2Name: 'Bob',
        t2p1Name: 'Charlie',
        t2p2Name: 'David',
      })
    );
  });

  describe('Rendering Logic', () => {
    test('renders dealer badge when isDealer is true', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(getByDataCy('dealerBadge')).toBeInTheDocument();
    });

    test('does not render when isDealer is false', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { queryByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p2Bid" // This player is not the dealer
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      expect(screen.queryByText('D')).not.toBeInTheDocument();
      expect(queryByDataCy('dealerBadge')).not.toBeInTheDocument();
    });

    test('shows cursor pointer for current round', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      const badge = getByDataCy('dealerBadge');
      expect(badge).toHaveStyle({ cursor: 'pointer' });
    });

    test('shows cursor default for past rounds', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      const badge = getByDataCy('dealerBadge');
      expect(badge).toHaveStyle({ cursor: 'default' });
    });
  });

  describe('Modal Interactions', () => {
    test('opens modal on click for current round', async () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      const badge = getByDataCy('dealerBadge');
      fireEvent.click(badge);

      await waitFor(() => {
        expect(screen.getByText('Select the dealer')).toBeInTheDocument();
        expect(getByDataCy('dealerSelectionModal')).toBeInTheDocument();
      });
    });

    test('does not open modal for past rounds', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy, queryByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      const badge = getByDataCy('dealerBadge');
      fireEvent.click(badge);

      expect(screen.queryByText('Select the dealer')).not.toBeInTheDocument();
      expect(queryByDataCy('dealerSelectionModal')).not.toBeInTheDocument();
    });

    test('calls setDealerOverride when dealer is selected', async () => {
      const mockSetDealerOverride = jest.fn();
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const result = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />,
        { setDealerOverride: mockSetDealerOverride }
      );

      // Open modal
      const badge = result.getByDataCy('dealerBadge');
      fireEvent.click(badge);

      // Select a dealer option - find the button with the correct player ID
      const dealerOptions = result.getAllByDataCy('dealerOptionButton');
      const dealerOption = dealerOptions.find(
        (option) =>
          option.getAttribute('data-player-id') === 'team2BidsAndActuals.p1Bid'
      );
      fireEvent.click(dealerOption);

      expect(mockSetDealerOverride).toHaveBeenCalledWith(
        'team2BidsAndActuals.p1Bid'
      );
    });

    test('closes modal after dealer selection', async () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const result = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      // Open modal
      const badge = result.getByDataCy('dealerBadge');
      fireEvent.click(badge);

      // Verify modal is open
      await waitFor(() => {
        expect(result.getByDataCy('dealerSelectionModal')).toBeInTheDocument();
      });

      // Select a dealer option - find the button with the correct player ID
      const dealerOptions = result.getAllByDataCy('dealerOptionButton');
      const dealerOption = dealerOptions.find(
        (option) =>
          option.getAttribute('data-player-id') === 'team2BidsAndActuals.p1Bid'
      );
      fireEvent.click(dealerOption);

      // Verify modal is closed
      await waitFor(() => {
        expect(
          result.queryByDataCy('dealerSelectionModal')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Dealer Options', () => {
    test('displays all four dealer options with correct names', async () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy, getAllByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      // Open modal
      const badge = getByDataCy('dealerBadge');
      fireEvent.click(badge);

      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
        expect(screen.getByText('David')).toBeInTheDocument();
      });

      // Verify all dealer option buttons are present
      const dealerOptions = getAllByDataCy('dealerOptionButton');
      expect(dealerOptions).toHaveLength(4);
    });

    test('uses fallback names when localStorage is empty', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy } = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      // Open modal
      const badge = getByDataCy('dealerBadge');
      fireEvent.click(badge);

      await waitFor(() => {
        expect(screen.getByText('Team 1 - P1')).toBeInTheDocument();
        expect(screen.getByText('Team 1 - P2')).toBeInTheDocument();
        expect(screen.getByText('Team 2 - P1')).toBeInTheDocument();
        expect(screen.getByText('Team 2 - P2')).toBeInTheDocument();
      });
    });
  });

  describe('Dealer Override Logic', () => {
    test('handles dealer override for current round', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      const { getByDataCy } = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p1Bid" // Charlie should be dealer due to override
          index={0}
          isCurrent={true}
          roundHistory={roundHistory}
        />,
        {
          currentRound: {
            dealerOverride: 'team2BidsAndActuals.p1Bid', // Override to Charlie
          },
        }
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(getByDataCy('dealerBadge')).toBeInTheDocument();
    });

    test('ignores dealer override for past rounds', () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: 'team2BidsAndActuals.p1Bid', // Override should be used for past rounds
        },
      ];

      const result = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p1Bid" // Should be dealer due to override in past round
          index={0}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(result.getByDataCy('dealerBadge')).toBeInTheDocument();
    });

    test('dealer rotates correctly across multiple rounds', () => {
      const roundHistory = [
        // Round 0: Alice is dealer (default)
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
        // Round 1: Bob is dealer (rotation)
        {
          team1BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '3',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '5',
            p1Actual: '3',
            p2Actual: '5',
          },
          dealerOverride: null,
        },
      ];

      // Test Round 0 (past round) - Alice should be dealer
      const round0Result = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid" // Alice
          index={0}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round0Result.getByDataCy('dealerBadge')).toBeInTheDocument();

      // Clean up for next test
      round0Result.unmount();

      // Test Round 1 (past round) - Bob should be dealer
      const round1Result = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p2Bid" // Bob
          index={1}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round1Result.getByDataCy('dealerBadge')).toBeInTheDocument();

      // Clean up for next test
      round1Result.unmount();

      // Test Round 2 (current round) - Charlie should be dealer
      const round2Result = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p1Bid" // Charlie
          index={2}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round2Result.getByDataCy('dealerBadge')).toBeInTheDocument();
    });

    test('dealer override preserves past round dealers while affecting current round', () => {
      const roundHistory = [
        // Round 0: Alice is dealer (default)
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
        // Round 1: Bob is dealer (rotation)
        {
          team1BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '3',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '5',
            p1Actual: '3',
            p2Actual: '5',
          },
          dealerOverride: null,
        },
      ];

      // Test Round 0 (past round) - Alice should still be dealer (unaffected by current override)
      const round0Result = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid" // Alice
          index={0}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round0Result.getByDataCy('dealerBadge')).toBeInTheDocument();

      // Clean up for next test
      round0Result.unmount();

      // Test Round 2 (current round) with dealer override - David should be dealer
      const round2Result = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p2Bid" // David
          index={2}
          isCurrent={true}
          roundHistory={roundHistory}
        />,
        {
          currentRound: {
            dealerOverride: 'team2BidsAndActuals.p2Bid', // Override to David
          },
        }
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round2Result.getByDataCy('dealerBadge')).toBeInTheDocument();
    });

    test('dealer override in past rounds affects only that specific round', () => {
      const roundHistory = [
        // Round 0: Alice is dealer (default)
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
        // Round 1: Charlie is dealer (override)
        {
          team1BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '3',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '5',
            p1Actual: '3',
            p2Actual: '5',
          },
          dealerOverride: 'team2BidsAndActuals.p1Bid', // Override to Charlie
        },
      ];

      // Test Round 0 (past round) - Alice should be dealer (unaffected by Round 1 override)
      const round0Result = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid" // Alice
          index={0}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round0Result.getByDataCy('dealerBadge')).toBeInTheDocument();

      // Clean up for next test
      round0Result.unmount();

      // Test Round 1 (past round) - Charlie should be dealer (due to override)
      const round1Result = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p1Bid" // Charlie
          index={1}
          isCurrent={false}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(round1Result.getByDataCy('dealerBadge')).toBeInTheDocument();
    });

    test('dealer override changes multiple times in current round', () => {
      const roundHistory = [
        // Round 0: Alice is dealer (default)
        {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
          dealerOverride: null,
        },
      ];

      // Test initial state - Bob should be dealer (normal rotation)
      const initialResult = renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p2Bid" // Bob
          index={1}
          isCurrent={true}
          roundHistory={roundHistory}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(initialResult.getByDataCy('dealerBadge')).toBeInTheDocument();

      // Clean up for next test
      initialResult.unmount();

      // Test after first override - Charlie should be dealer
      const override1Result = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p1Bid" // Charlie
          index={1}
          isCurrent={true}
          roundHistory={roundHistory}
        />,
        {
          currentRound: {
            dealerOverride: 'team2BidsAndActuals.p1Bid', // Override to Charlie
          },
        }
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(override1Result.getByDataCy('dealerBadge')).toBeInTheDocument();

      // Clean up for next test
      override1Result.unmount();

      // Test after second override - David should be dealer
      const override2Result = renderWithProviders(
        <DealerTag
          id="team2BidsAndActuals.p2Bid" // David
          index={1}
          isCurrent={true}
          roundHistory={roundHistory}
        />,
        {
          currentRound: {
            dealerOverride: 'team2BidsAndActuals.p2Bid', // Override to David
          },
        }
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(override2Result.getByDataCy('dealerBadge')).toBeInTheDocument();
    });
  });
});
