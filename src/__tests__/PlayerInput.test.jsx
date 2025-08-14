import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerInput from '../components/forms/PlayerInput';
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

// Mock the DealerTag component
jest.mock('../components/ui/DealerTag', () => {
  return function MockDealerTag() {
    return <div data-testid="dealerTag">Dealer</div>;
  };
});

describe('PlayerInput', () => {
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
    inputId: 'testInput',
    dealerId: 'testDealer',
    type: 'Actual',
    index: 0,
    isCurrent: true,
    playerName: 'Test Player',
    playerInput: '',
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
    teamClassName: 'team1',
    fieldToUpdate: 'team1BidsAndActuals.p1Actual',
  };

  const renderWithContext = (component) => {
    return render(
      <GlobalContext.Provider value={mockContextValue}>
        {component}
      </GlobalContext.Provider>
    );
  };

  describe('when team total is being used', () => {
    it('should show "unentered" instead of "Actual" button when playerInput is "unentered"', () => {
      const props = {
        ...defaultProps,
        playerInput: 'unentered',
        type: 'Actual',
      };

      renderWithContext(<PlayerInput {...props} />);

      expect(screen.getByText('unentered')).toBeInTheDocument();
      expect(screen.queryByText('Actual')).not.toBeInTheDocument();
    });

    it('should show "unentered" instead of "Bid" button when playerInput is "unentered" and type is Bid', () => {
      const props = {
        ...defaultProps,
        playerInput: 'unentered',
        type: 'Bid',
      };

      renderWithContext(<PlayerInput {...props} />);

      expect(screen.getByText('unentered')).toBeInTheDocument();
      expect(screen.queryByText('Bid')).not.toBeInTheDocument();
    });
  });

  describe('when team total is not being used', () => {
    it('should show "Actual" button when playerInput is empty and type is Actual', () => {
      const props = {
        ...defaultProps,
        playerInput: '',
        type: 'Actual',
      };

      renderWithContext(<PlayerInput {...props} />);

      expect(screen.getByText('Actual')).toBeInTheDocument();
      expect(screen.queryByText('unentered')).not.toBeInTheDocument();
    });

    it('should show "Bid" button when playerInput is empty and type is Bid', () => {
      const props = {
        ...defaultProps,
        playerInput: '',
        type: 'Bid',
      };

      renderWithContext(<PlayerInput {...props} />);

      expect(screen.getByText('Bid')).toBeInTheDocument();
      expect(screen.queryByText('unentered')).not.toBeInTheDocument();
    });
  });

  describe('individual input override capability', () => {
    it('should allow editing individual inputs even when team total is being used', () => {
      const props = {
        ...defaultProps,
        playerInput: 'unentered',
        type: 'Actual',
      };

      renderWithContext(<PlayerInput {...props} />);

      // Should show "unentered" but still be clickable
      const unenteredElement = screen.getByText('unentered');
      expect(unenteredElement).toBeInTheDocument();

      // Should be clickable to open modal
      fireEvent.click(unenteredElement);

      // Modal should open
      expect(screen.getByTestId('bidSelectionModal')).toBeInTheDocument();
    });

    it('should show "N/A" with edit icon when team total shows "Total entered"', () => {
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
          p1Actual: 3,
          p2Actual: 3,
        },
        team2BidsAndActuals: {
          p1Bid: '3',
          p2Bid: '4',
          p1Actual: '',
          p2Actual: '',
        },
      };

      render(
        <GlobalContext.Provider value={testContextValue}>
          <PlayerInput
            teamName="Team 1"
            roundHistory={[]}
            index={0}
            isCurrent={true}
            currentRound={mockCurrentRound}
            playerName="Mike"
            inputId="team1BidsAndActuals.p1Actual"
            dealerId="team1BidsAndActuals.p1Bid"
            fieldToUpdate={'team1BidsAndActuals.p1Actual'}
            playerInput={mockCurrentRound.team1BidsAndActuals.p1Actual}
            type={'Actual'}
            teamClassName="team1"
          />
        </GlobalContext.Provider>
      );

      // Should show "N/A" text instead of "Total entered" button
      expect(screen.getByText('N/A')).toBeInTheDocument();

      // Should show edit icon
      expect(screen.getByTestId('editIcon')).toBeInTheDocument();

      // Should be clickable to open modal
      const naElement = screen.getByText('N/A');
      fireEvent.click(naElement);
      expect(screen.getByTestId('bidSelectionModal')).toBeInTheDocument();
    });
  });
});
