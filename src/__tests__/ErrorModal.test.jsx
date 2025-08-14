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
      // Since both players have numeric values, they show "N/A" instead of individual values
      // We need to click on the "N/A" text for the player with value 5
      const naElements = screen.getAllByText('N/A');
      // Click on the second "N/A" element (which corresponds to the player with value 5)
      fireEvent.click(naElements[1]);

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

      const playerInputs = screen.getAllByTestId('playerInput');
      playerInputs.forEach((input) => {
        expect(input).toBeInTheDocument();
      });
    });

    it('should have clickable team total headings', () => {
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

      // Team total headings should be clickable (have cursor pointer style)
      const team1Heading = screen.getByText('6');
      const team2Heading = screen.getByText('8');

      expect(team1Heading).toBeInTheDocument();
      expect(team2Heading).toBeInTheDocument();

      // Check that they have the clickable cursor style
      expect(team1Heading).toHaveStyle('cursor: pointer');
      expect(team2Heading).toHaveStyle('cursor: pointer');
    });

    it('should open team total modal when clicking on team total headings', async () => {
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

      // Click on team1 heading to open team total modal
      const team1Heading = screen.getByText('6');
      fireEvent.click(team1Heading);

      // Modal should open for team total selection
      await waitFor(() => {
        expect(screen.getByTestId('bidSelectionModal')).toBeInTheDocument();
      });

      // Click on a number in the modal (e.g., "10")
      const tenButton = screen.getByText('10');
      fireEvent.click(tenButton);

      // Verify that setCurrentRound was called with team total
      expect(mockSetCurrentRound).toHaveBeenCalledWith({
        input: '10',
        fieldToUpdate: 'team1Total',
        currentRound: mockCurrentRound,
      });
    });

    it('should not have team total headings in focus when error modal opens', () => {
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

      // Team total headings should not be focused when modal opens
      const team1Heading = screen.getByText('6');
      const team2Heading = screen.getByText('8');

      expect(team1Heading).not.toHaveFocus();
      expect(team2Heading).not.toHaveFocus();

      // Verify that no element in the TeamInputHeading has focus
      const teamInputHeading = screen
        .getByTestId('actualSection')
        .querySelector('[style*="cursor: pointer"]');
      if (teamInputHeading) {
        expect(teamInputHeading).not.toHaveFocus();
      }
    });
  });
});
