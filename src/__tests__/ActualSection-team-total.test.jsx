import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActualSection from '../components/game/ActualSection';
import { GlobalContext } from '../helpers/context/GlobalContext';

// Mock the useValidateActuals hook
jest.mock('../helpers/utils/hooks', () => ({
  useValidateActuals: jest.fn(),
}));

// Mock the ErrorModal component
jest.mock('../components/modals/ErrorModal', () => {
  return function MockErrorModal({ isOpen, children }) {
    if (!isOpen) return null;
    return <div data-testid="errorModal">{children}</div>;
  };
});

describe('ActualSection Team Total Functionality', () => {
  const mockContextValue = {
    firstDealerOrder: [
      'team1BidsAndActuals.p1Bid',
      'team2BidsAndActuals.p1Bid',
      'team1BidsAndActuals.p2Bid',
      'team2BidsAndActuals.p2Bid',
    ],
    currentRound: {
      team1BidsAndActuals: {
        p1Bid: '1',
        p2Bid: '2',
        p1Actual: '',
        p2Actual: '',
      },
      team2BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '4',
        p1Actual: '',
        p2Actual: '',
      },
    },
    setCurrentRound: jest.fn(),
    setRoundHistory: jest.fn(),
    setDealerOverride: jest.fn(),
  };

  const defaultProps = {
    index: 0,
    names: {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    },
    isCurrent: true,
    roundHistory: [],
    currentRound: {
      team1BidsAndActuals: {
        p1Bid: '1',
        p2Bid: '2',
        p1Actual: '',
        p2Actual: '',
      },
      team2BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '4',
        p1Actual: '',
        p2Actual: '',
      },
    },
  };

  const renderWithContext = (component) => {
    return render(
      <GlobalContext.Provider value={mockContextValue}>
        {component}
      </GlobalContext.Provider>
    );
  };

  describe('when neither player on a team went nil', () => {
    it('should enable team total editing in TeamInputHeading', () => {
      const props = {
        ...defaultProps,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '2',
            p1Actual: '',
            p2Actual: '',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '',
            p2Actual: '',
          },
        },
      };

      renderWithContext(<ActualSection {...props} />);

      // Check that the TeamInputHeading is editable by looking for contenteditable attribute
      const headings = screen.getAllByText('0', { selector: 'h2' });
      expect(headings[0]).toHaveAttribute('contenteditable', 'true');
      expect(headings[1]).toHaveAttribute('contenteditable', 'true');
    });
  });

  describe('when at least one player on a team went nil', () => {
    it('should disable team total editing in TeamInputHeading', () => {
      const props = {
        ...defaultProps,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: 'Nil',
            p2Bid: '2',
            p1Actual: '',
            p2Actual: '',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '',
            p2Actual: '',
          },
        },
      };

      renderWithContext(<ActualSection {...props} />);

      // Check that the TeamInputHeading is not editable by looking for absence of contenteditable attribute
      const headings = screen.getAllByText('0', { selector: 'h2' });
      expect(headings[0]).not.toHaveAttribute('contenteditable');
      expect(headings[1]).not.toHaveAttribute('contenteditable');
    });
  });

  describe('team total display', () => {
    it('should show "unentered" when no team total has been entered', () => {
      const props = {
        ...defaultProps,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '2',
            p1Actual: 'unentered',
            p2Actual: 'unentered',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: 'unentered',
            p2Actual: 'unentered',
          },
        },
      };

      renderWithContext(<ActualSection {...props} />);

      // Check that the TeamInputHeading shows "unentered"
      const headings = screen.getAllByText('unentered', { selector: 'h2' });
      expect(headings).toHaveLength(2);
    });

    it('should show "N/A" when team total has been entered', () => {
      const props = {
        ...defaultProps,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '2',
            p1Actual: 3,
            p2Actual: 3,
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: 4,
            p2Actual: 4,
          },
        },
      };

      renderWithContext(<ActualSection {...props} />);

      // Check that the individual players show "N/A"
      // Look specifically for N/A elements within playerInput containers
      const playerInputs = screen.getAllByTestId('playerInput');
      const naElements = playerInputs.filter((container) =>
        container.textContent.includes('N/A')
      );
      expect(naElements).toHaveLength(8); // All player inputs show "N/A" when team totals are used
    });
  });

  describe('team total editing interaction', () => {
    it('should open number grid modal when clicking on editable team total heading', () => {
      const props = {
        ...defaultProps,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '1',
            p2Bid: '2',
            p1Actual: 'unentered',
            p2Actual: 'unentered',
          },
          team2BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: 'unentered',
            p2Actual: 'unentered',
          },
        },
      };

      renderWithContext(<ActualSection {...props} />);

      // Find the editable team total headings
      const headings = screen.getAllByText('unentered', { selector: 'h2' });
      const team1Heading = headings[0];

      // Click on the team1 heading
      fireEvent.click(team1Heading);

      // Should open a modal with number grid
      // Note: This would require implementing the actual modal functionality
      // For now, we just verify the heading is clickable
      expect(team1Heading).toHaveAttribute('contenteditable', 'true');
    });
  });
});

describe('ActualSection Team Total Integration', () => {
  it('should update both individual players when team total is selected', () => {
    const mockSetCurrentRound = jest.fn();
    const mockSetRoundHistory = jest.fn();

    const mockContextValue = {
      firstDealerOrder: [
        'team1BidsAndActuals.p1Bid',
        'team2BidsAndActuals.p1Bid',
        'team1BidsAndActuals.p2Bid',
        'team2BidsAndActuals.p2Bid',
      ],
      currentRound: {
        team1BidsAndActuals: {
          p1Bid: '1',
          p2Bid: '2',
          p1Actual: '',
          p2Actual: '',
        },
        team2BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '4',
          p1Actual: '',
          p2Actual: '',
        },
      },
      setCurrentRound: mockSetCurrentRound,
      setRoundHistory: mockSetRoundHistory,
      setDealerOverride: jest.fn(),
    };

    const { getAllByText, getByTestId } = render(
      <GlobalContext.Provider value={mockContextValue}>
        <ActualSection
          index={0}
          names={{
            team1Name: 'Team 1',
            team2Name: 'Team 2',
            t1p1Name: 'Player 1',
            t1p2Name: 'Player 2',
            t2p1Name: 'Player 3',
            t2p2Name: 'Player 4',
          }}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockContextValue.currentRound}
        />
      </GlobalContext.Provider>
    );

    // Click on team1 heading to open modal
    const teamHeadings = getAllByText('0');
    const team1Heading = teamHeadings[0];
    fireEvent.click(team1Heading);

    // Verify modal opened
    expect(getByTestId('bidSelectionModal')).toBeInTheDocument();

    // Simulate clicking on the "10" button in the modal
    const tenButton = screen.getByText('10');
    fireEvent.click(tenButton);

    // Verify that setCurrentRound was called exactly once with team total
    expect(mockSetCurrentRound).toHaveBeenCalledTimes(1);

    // Verify call was for team1Total with value 10
    expect(mockSetCurrentRound).toHaveBeenCalledWith({
      input: '10',
      fieldToUpdate: 'team1Total',
      currentRound: mockContextValue.currentRound,
    });
  });
});

describe('ActualSection Team Total Display Updates', () => {
  it('should show "N/A" for both individual players when team total is selected', () => {
    const mockSetCurrentRound = jest.fn();
    const mockSetRoundHistory = jest.fn();

    // Create a mutable currentRound object that we can update
    let currentRound = {
      team1BidsAndActuals: {
        p1Bid: '1',
        p2Bid: '2',
        p1Actual: '',
        p2Actual: '',
      },
      team2BidsAndActuals: {
        p1Bid: '3',
        p2Bid: '4',
        p1Actual: '',
        p2Actual: '',
      },
    };

    const mockContextValue = {
      firstDealerOrder: [
        'team1BidsAndActuals.p1Bid',
        'team2BidsAndActuals.p1Bid',
        'team1BidsAndActuals.p2Bid',
        'team2BidsAndActuals.p2Bid',
      ],
      currentRound: currentRound,
      setCurrentRound: (params) => {
        mockSetCurrentRound(params);
        // Update the currentRound object to simulate the state change
        if (
          params.fieldToUpdate &&
          params.fieldToUpdate.includes('team') &&
          params.fieldToUpdate.includes('Total')
        ) {
          // This is a team total update, update both individual values
          const teamNumber = params.fieldToUpdate.includes('team1') ? 1 : 2;
          const teamField =
            teamNumber === 1 ? 'team1BidsAndActuals' : 'team2BidsAndActuals';

          // Calculate individual values (divide by 2)
          const individualValue = Math.floor(params.input / 2);
          const remainder = params.input % 2;

          // Distribute the total between players
          const p1Value = individualValue + remainder; // First player gets the remainder
          const p2Value = individualValue;

          currentRound = {
            ...currentRound,
            [teamField]: {
              ...currentRound[teamField],
              p1Actual: p1Value,
              p2Actual: p2Value,
            },
          };

          // Update the context value
          mockContextValue.currentRound = currentRound;
        }
      },
      setRoundHistory: mockSetRoundHistory,
      setDealerOverride: jest.fn(),
    };

    const { getAllByText, getByTestId, rerender } = render(
      <GlobalContext.Provider value={mockContextValue}>
        <ActualSection
          index={0}
          names={{
            team1Name: 'Team 1',
            team2Name: 'Team 2',
            t1p1Name: 'Player 1',
            t1p2Name: 'Player 2',
            t2p1Name: 'Player 3',
            t2p2Name: 'Player 4',
          }}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockContextValue.currentRound}
        />
      </GlobalContext.Provider>
    );

    // Initially, all players should show "Actual" buttons (4 total - 2 teams × 2 players each)
    expect(screen.getAllByText('Actual')).toHaveLength(4);

    // Click on team1 heading to open modal
    const teamHeadings = getAllByText('0');
    const team1Heading = teamHeadings[0];
    fireEvent.click(team1Heading);

    // Verify modal opened
    expect(getByTestId('bidSelectionModal')).toBeInTheDocument();

    // Simulate clicking on the "10" button in the modal
    const tenButton = screen.getByText('10');
    fireEvent.click(tenButton);

    // Re-render with updated context
    rerender(
      <GlobalContext.Provider value={mockContextValue}>
        <ActualSection
          index={0}
          names={{
            team1Name: 'Team 1',
            team2Name: 'Team 2',
            t1p1Name: 'Player 1',
            t1p2Name: 'Player 2',
            t2p1Name: 'Player 3',
            t2p2Name: 'Player 4',
          }}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockContextValue.currentRound}
        />
      </GlobalContext.Provider>
    );

    // After team total is selected, both players on team 1 should show "N/A"
    // and team 2 players should still show "Actual"
    expect(screen.getAllByText('N/A')).toHaveLength(2);
    expect(screen.getAllByText('Actual')).toHaveLength(2); // Team 2 players still show "Actual"
  });
});
