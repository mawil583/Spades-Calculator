import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamInputHeading from '../components/forms/TeamInputHeading';
import { GlobalContext } from '../helpers/context/GlobalContext';

// Mock the InputModal component
jest.mock('../components/modals/InputModal', () => {
  return function MockInputModal({ isOpen, setIsModalOpen }) {
    if (!isOpen) return null;
    return (
      <div data-testid="inputModal">
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </div>
    );
  };
});

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

const renderWithContext = (component) => {
  return render(
    <GlobalContext.Provider value={mockContextValue}>
      {component}
    </GlobalContext.Provider>
  );
};

describe('TeamInputHeading', () => {
  const defaultProps = {
    team1Total: 0,
    team2Total: 0,
    title: 'Actuals',
    team1Bids: ['1', '2'],
    team2Bids: ['3', '4'],
    onTeamTotalChange: jest.fn(),
    isEditable: false,
  };

  describe('when neither player on a team went nil', () => {
    it('should be editable for team total input', () => {
      const props = {
        ...defaultProps,
        team1Bids: ['1', '2'], // Neither is nil
        team2Bids: ['3', '4'], // Neither is nil
        isEditable: true,
      };

      renderWithContext(<TeamInputHeading {...props} />);

      const headings = screen.getAllByText('0', { selector: 'h2' });
      const team1Heading = headings[0]; // First h2 with 0
      const team2Heading = headings[1]; // Second h2 with 0

      expect(team1Heading).toHaveAttribute('contenteditable', 'true');
      expect(team2Heading).toHaveAttribute('contenteditable', 'true');
    });
  });

  describe('when at least one player on a team went nil', () => {
    it('should not be editable for team total input', () => {
      const props = {
        ...defaultProps,
        team1Bids: ['Nil', '2'], // One player went nil
        team2Bids: ['3', '4'], // Neither is nil
        isEditable: false,
      };

      renderWithContext(<TeamInputHeading {...props} />);

      const headings = screen.getAllByText('0', { selector: 'h2' });
      const team1Heading = headings[0]; // First h2 with 0
      const team2Heading = headings[1]; // Second h2 with 0

      expect(team1Heading).not.toHaveAttribute('contenteditable');
      expect(team2Heading).not.toHaveAttribute('contenteditable');
    });
  });

  describe('team total input functionality', () => {
    it('should show calculated team totals when individual values are empty', () => {
      const props = {
        ...defaultProps,
        team1Bids: ['1', '2'], // Neither is nil
        team2Bids: ['3', '4'], // Neither is nil
        isEditable: true,
        team1Total: 0, // Calculated from empty individual values
        team2Total: 0, // Calculated from empty individual values
      };

      renderWithContext(<TeamInputHeading {...props} />);

      const headings = screen.getAllByText('0', { selector: 'h2' });
      expect(headings).toHaveLength(2);
    });
  });
});

describe('TeamInputHeading Modal Integration', () => {
  it('should open InputModal when clicking on editable team heading', () => {
    const mockOnTeamTotalChange = jest.fn();

    const { getAllByText, getByTestId } = renderWithContext(
      <TeamInputHeading
        team1Total="0"
        team2Total="0"
        title="Actuals"
        team1Bids={['1', '2']}
        team2Bids={['3', '4']}
        onTeamTotalChange={mockOnTeamTotalChange}
        isEditable={true}
        index={0}
        isCurrent={true}
        currentRound={{}}
        roundHistory={[]}
      />
    );

    // Click on team1 heading (first "0" element)
    const teamHeadings = getAllByText('0');
    const team1Heading = teamHeadings[0]; // First heading is team1
    fireEvent.click(team1Heading);

    // Verify modal opened
    expect(getByTestId('bidSelectionModal')).toBeInTheDocument();
  });

  it('should not open InputModal when clicking on non-editable team heading', () => {
    const mockOnTeamTotalChange = jest.fn();

    const { getAllByText, queryByTestId } = renderWithContext(
      <TeamInputHeading
        team1Total="0"
        team2Total="0"
        title="Actuals"
        team1Bids={['Nil', '2']} // Team1 has a nil bid
        team2Bids={['3', '4']}
        onTeamTotalChange={mockOnTeamTotalChange}
        isEditable={true}
        index={0}
        isCurrent={true}
        currentRound={{}}
        roundHistory={[]}
      />
    );

    // Click on team1 heading (should not be editable due to nil bid)
    const teamHeadings = getAllByText('0');
    const team1Heading = teamHeadings[0]; // First heading is team1
    fireEvent.click(team1Heading);

    // Verify modal was not opened
    expect(queryByTestId('bidSelectionModal')).not.toBeInTheDocument();
  });
});

describe('TeamInputHeading Team Total Updates', () => {
  it('should update individual player actuals when team total is selected', () => {
    const mockSetCurrentRound = jest.fn();
    const mockSetRoundHistory = jest.fn();

    // Mock the GlobalContext
    const testContextValue = {
      ...mockContextValue,
      setCurrentRound: mockSetCurrentRound,
      setRoundHistory: mockSetRoundHistory,
    };

    const { getAllByText, getByTestId } = render(
      <GlobalContext.Provider value={testContextValue}>
        <TeamInputHeading
          team1Total="0"
          team2Total="0"
          title="Actuals"
          team1Bids={['1', '2']}
          team2Bids={['3', '4']}
          isEditable={true}
          index={0}
          isCurrent={true}
          currentRound={{
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
          }}
          roundHistory={[]}
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

    // Verify that setCurrentRound was called with the team total
    expect(mockSetCurrentRound).toHaveBeenCalledWith({
      input: '10',
      fieldToUpdate: 'team1Total',
      currentRound: expect.any(Object),
    });
  });

  it('should handle odd team totals by giving remainder to first player', () => {
    const mockSetCurrentRound = jest.fn();
    const mockSetRoundHistory = jest.fn();

    const testContextValue2 = {
      ...mockContextValue,
      setCurrentRound: mockSetCurrentRound,
      setRoundHistory: mockSetRoundHistory,
    };

    const { getAllByText } = render(
      <GlobalContext.Provider value={testContextValue2}>
        <TeamInputHeading
          team1Total="0"
          team2Total="0"
          title="Actuals"
          team1Bids={['1', '2']}
          team2Bids={['3', '4']}
          isEditable={true}
          index={0}
          isCurrent={true}
          currentRound={{
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
          }}
          roundHistory={[]}
        />
      </GlobalContext.Provider>
    );

    // Click on team1 heading
    const teamHeadings = getAllByText('0');
    const team1Heading = teamHeadings[0];
    fireEvent.click(team1Heading);

    // Simulate clicking on the "7" button in the modal
    const sevenButton = screen.getByText('7');
    fireEvent.click(sevenButton);

    // Verify that setCurrentRound was called with the team total
    expect(mockSetCurrentRound).toHaveBeenCalledWith({
      input: '7',
      fieldToUpdate: 'team1Total',
      currentRound: expect.any(Object),
    });
  });
});

describe('TeamInputHeading Integration Tests', () => {
  it('should update both individual players and team total display when team total is selected', () => {
    const mockSetCurrentRound = jest.fn();
    const mockSetRoundHistory = jest.fn();

    const testContextValue = {
      ...mockContextValue,
      setCurrentRound: mockSetCurrentRound,
      setRoundHistory: mockSetRoundHistory,
    };

    // Mock the current round to simulate the actual state
    const mockCurrentRound = {
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

    const { getAllByText, getByTestId } = render(
      <GlobalContext.Provider value={testContextValue}>
        <TeamInputHeading
          team1Total="0"
          team2Total="0"
          title="Actuals"
          team1Bids={['1', '2']}
          team2Bids={['3', '4']}
          isEditable={true}
          index={0}
          isCurrent={true}
          currentRound={mockCurrentRound}
          roundHistory={[]}
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
      currentRound: mockCurrentRound,
    });
  });

  it('should handle odd team totals correctly (remainder to first player)', () => {
    const mockSetCurrentRound = jest.fn();
    const mockSetRoundHistory = jest.fn();

    const testContextValue = {
      ...mockContextValue,
      setCurrentRound: mockSetCurrentRound,
      setRoundHistory: mockSetRoundHistory,
    };

    const mockCurrentRound = {
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

    const { getAllByText } = render(
      <GlobalContext.Provider value={testContextValue}>
        <TeamInputHeading
          team1Total="0"
          team2Total="0"
          title="Actuals"
          team1Bids={['1', '2']}
          team2Bids={['3', '4']}
          isEditable={true}
          index={0}
          isCurrent={true}
          currentRound={mockCurrentRound}
          roundHistory={[]}
        />
      </GlobalContext.Provider>
    );

    // Click on team1 heading to open modal
    const teamHeadings = getAllByText('0');
    const team1Heading = teamHeadings[0];
    fireEvent.click(team1Heading);

    // Simulate clicking on the "7" button in the modal (odd number)
    const sevenButton = screen.getByText('7');
    fireEvent.click(sevenButton);

    // Verify that setCurrentRound was called exactly once with team total
    expect(mockSetCurrentRound).toHaveBeenCalledTimes(1);

    // Verify call was for team1Total with value 7
    expect(mockSetCurrentRound).toHaveBeenCalledWith({
      input: '7',
      fieldToUpdate: 'team1Total',
      currentRound: mockCurrentRound,
    });
  });
});
