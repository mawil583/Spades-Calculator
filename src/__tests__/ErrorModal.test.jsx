import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ErrorModal from '../components/modals/ErrorModal';
import { GlobalContext } from '../helpers/context/GlobalContext';
import customTheme from '../customTheme';

const mockContextValue = {
  team1Name: 'Team 1',
  team2Name: 'Team 2',
  t1p1Name: 'Mike',
  t1p2Name: 'Kim',
  t2p1Name: 'Mom',
  t2p2Name: 'Dad',
  setCurrentRound: jest.fn(),
};

const mockNames = {
  team1Name: 'Team 1',
  team2Name: 'Team 2',
  t1p1Name: 'Mike',
  t1p2Name: 'Kim',
  t2p1Name: 'Mom',
  t2p2Name: 'Dad',
};

const mockCurrentRound = {
  team1BidsAndActuals: {
    p1Actual: 3,
    p2Actual: 3,
  },
  team2BidsAndActuals: {
    p1Actual: 3,
    p2Actual: 5,
  },
};

const renderWithProviders = (component, contextValue) => {
  return render(
    <ChakraProvider theme={customTheme}>
      <GlobalContext.Provider value={contextValue}>
        {component}
      </GlobalContext.Provider>
    </ChakraProvider>
  );
};

describe('ErrorModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal Interaction', () => {
    it('should render modal correctly', () => {
      const mockSetIsModalOpen = jest.fn();

      renderWithProviders(
        <ErrorModal
          isOpen={true}
          setIsModalOpen={mockSetIsModalOpen}
          index={0}
          names={mockNames}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockCurrentRound}
          errorMessage="The total amount of hands must always add up to 13. Yours totaled 14."
        />,
        mockContextValue
      );

      // Modal should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should allow editing actuals from within error modal', async () => {
      const mockSetCurrentRound = jest.fn();
      const contextWithSetCurrentRound = {
        ...mockContextValue,
        setCurrentRound: mockSetCurrentRound,
      };

      renderWithProviders(
        <ErrorModal
          isOpen={true}
          setIsModalOpen={jest.fn()}
          index={0}
          names={mockNames}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockCurrentRound}
          errorMessage="The total amount of hands must always add up to 13. Yours totaled 14."
        />,
        contextWithSetCurrentRound
      );

      // Find the invalid actual (5) and click on it
      // Since both players have numeric values, they show "Total entered" instead of individual values
      // We need to click on the "Total entered" button for the player with value 5
      const totalEnteredButtons = screen.getAllByText('Total entered');
      // Click on the second "Total entered" button (which corresponds to the player with value 5)
      fireEvent.click(totalEnteredButtons[1]);

      // Modal should open for selection
      await waitFor(() => {
        expect(screen.getByTestId('bidSelectionModal')).toBeInTheDocument();
      });
    });
  });

  describe('Error Modal Content', () => {
    it('should display correct modal structure', () => {
      renderWithProviders(
        <ErrorModal
          isOpen={true}
          setIsModalOpen={jest.fn()}
          index={0}
          names={mockNames}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockCurrentRound}
          errorMessage="The total amount of hands must always add up to 13. Yours totaled 14."
        />,
        mockContextValue
      );

      // Should have actuals section
      expect(screen.getByTestId('actualSection')).toBeInTheDocument();

      // Should have team input heading
      expect(screen.getByText('Actuals')).toBeInTheDocument();
    });

    it('should display player names correctly', () => {
      renderWithProviders(
        <ErrorModal
          isOpen={true}
          setIsModalOpen={jest.fn()}
          index={0}
          names={mockNames}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockCurrentRound}
          errorMessage="The total amount of hands must always add up to 13. Yours totaled 14."
        />,
        mockContextValue
      );

      // Should display player names
      expect(screen.getByText('Mike')).toBeInTheDocument();
      expect(screen.getByText('Kim')).toBeInTheDocument();
      expect(screen.getByText('Mom')).toBeInTheDocument();
      expect(screen.getByText('Dad')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal role', () => {
      renderWithProviders(
        <ErrorModal
          isOpen={true}
          setIsModalOpen={jest.fn()}
          index={0}
          names={mockNames}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockCurrentRound}
          errorMessage="The total amount of hands must always add up to 13. Yours totaled 14."
        />,
        mockContextValue
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });

    it('should have clickable player inputs', () => {
      renderWithProviders(
        <ErrorModal
          isOpen={true}
          setIsModalOpen={jest.fn()}
          index={0}
          names={mockNames}
          isCurrent={true}
          roundHistory={[]}
          currentRound={mockCurrentRound}
          errorMessage="The total amount of hands must always add up to 13. Yours totaled 14."
        />,
        mockContextValue
      );

      const playerInputs = screen.getAllByTestId('actualButton');
      playerInputs.forEach((input) => {
        expect(input).toBeInTheDocument();
      });
    });
  });
});
