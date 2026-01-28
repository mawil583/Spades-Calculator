import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { GlobalContext } from '../helpers/context/GlobalContext';
import ButtonGrid from '../components/ui/ButtonGrid';

// Mock the helper functions
jest.mock('../helpers/utils/helperFunctions', () => ({
  getButtonValues: jest.fn(() => [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  ]),
  getEditedRoundHistory: jest.fn(() => []),
  updateInput: jest.fn(({ input, fieldToUpdate, currentRound }) => ({
    ...currentRound,
    [fieldToUpdate]: input,
  })),
}));

const renderWithProviders = (component, contextValue) => {
  return render(
    <ChakraProvider>
      <GlobalContext.Provider value={contextValue}>
        {component}
      </GlobalContext.Provider>
    </ChakraProvider>
  );
};

describe('ButtonGrid Component', () => {
  const mockContextValue = {
    setCurrentRound: jest.fn(),
    setRoundHistory: jest.fn(),
  };

  const defaultProps = {
    type: 'Bid',
    fieldToUpdate: 'team1BidsAndActuals.p1Bid',
    currentRound: {
      team1BidsAndActuals: {
        p1Bid: '',
        p2Bid: '',
        p1Actual: '',
        p2Actual: '',
      },
      team2BidsAndActuals: {
        p1Bid: '',
        p2Bid: '',
        p1Actual: '',
        p2Actual: '',
      },
    },
    index: 0,
    roundHistory: [],
    isCurrent: true,
    setIsModalOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Button Display', () => {
    it('should display all button values for Bid type', () => {
      renderWithProviders(
        <ButtonGrid {...defaultProps} type="Bid" />,
        mockContextValue
      );

      // Should display all bid values (Blind Nil, Nil, 1-13)
      expect(screen.getByText('Blind Nil')).toBeInTheDocument();
      expect(screen.getByText('Nil')).toBeInTheDocument();
      for (let i = 1; i <= 13; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should display all button values for Actual type', () => {
      renderWithProviders(
        <ButtonGrid {...defaultProps} type="Actual" />,
        mockContextValue
      );

      // Should display all actual values (0-13)
      expect(screen.getByText('0')).toBeInTheDocument();
      for (let i = 1; i <= 13; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should have correct data-cy attributes on buttons based on type', () => {
      // Test Bid type
      const { rerender } = renderWithProviders(
        <ButtonGrid {...defaultProps} type="Bid" />,
        mockContextValue
      );

      let buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-cy', 'bidSelectionButton');
      });

      // Test Actual type
      rerender(
        <ChakraProvider>
          <GlobalContext.Provider value={mockContextValue}>
            <ButtonGrid {...defaultProps} type="Actual" />
          </GlobalContext.Provider>
        </ChakraProvider>
      );

      buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-cy', 'actualSelectionButton');
      });
    });
  });

  describe('Current Round Interactions', () => {
    it('should call setCurrentRound when button is clicked for current round', () => {
      renderWithProviders(
        <ButtonGrid {...defaultProps} isCurrent={true} />,
        mockContextValue
      );

      const button3 = screen.getByText('3');
      fireEvent.click(button3);

      expect(mockContextValue.setCurrentRound).toHaveBeenCalledWith({
        input: '3',
        fieldToUpdate: 'team1BidsAndActuals.p1Bid',
        currentRound: { ...defaultProps.currentRound },
      });
    });

    it('should close modal when button is clicked', () => {
      const mockSetIsModalOpen = jest.fn();
      renderWithProviders(
        <ButtonGrid {...defaultProps} setIsModalOpen={mockSetIsModalOpen} />,
        mockContextValue
      );

      const button5 = screen.getByText('5');
      fireEvent.click(button5);

      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should handle different field updates correctly', () => {
      renderWithProviders(
        <ButtonGrid
          {...defaultProps}
          fieldToUpdate="team2BidsAndActuals.p2Actual"
        />,
        mockContextValue
      );

      const button7 = screen.getByText('7');
      fireEvent.click(button7);

      expect(mockContextValue.setCurrentRound).toHaveBeenCalledWith({
        input: '7',
        fieldToUpdate: 'team2BidsAndActuals.p2Actual',
        currentRound: { ...defaultProps.currentRound },
      });
    });
  });

  describe('Past Round Interactions', () => {
    it('should call setRoundHistory when button is clicked for past round', () => {
      renderWithProviders(
        <ButtonGrid {...defaultProps} isCurrent={false} />,
        mockContextValue
      );

      const button4 = screen.getByText('4');
      fireEvent.click(button4);

      // The component should handle the click without errors
      expect(mockContextValue.setRoundHistory).toHaveBeenCalled();
    });

    it('should close modal when button is clicked for past round', () => {
      const mockSetIsModalOpen = jest.fn();
      renderWithProviders(
        <ButtonGrid
          {...defaultProps}
          isCurrent={false}
          setIsModalOpen={mockSetIsModalOpen}
        />,
        mockContextValue
      );

      const button6 = screen.getByText('6');
      fireEvent.click(button6);

      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null setIsModalOpen gracefully', () => {
      renderWithProviders(
        <ButtonGrid {...defaultProps} setIsModalOpen={null} />,
        mockContextValue
      );

      const button2 = screen.getByText('2');
      fireEvent.click(button2);

      // Should not throw error and should still update the round
      expect(mockContextValue.setCurrentRound).toHaveBeenCalled();
    });

    it('should handle empty roundHistory for past rounds', () => {
      renderWithProviders(
        <ButtonGrid {...defaultProps} isCurrent={false} roundHistory={null} />,
        mockContextValue
      );

      const button8 = screen.getByText('8');
      fireEvent.click(button8);

      expect(mockContextValue.setRoundHistory).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have clickable buttons', () => {
      renderWithProviders(<ButtonGrid {...defaultProps} />, mockContextValue);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });

    it('should have proper button text content', () => {
      renderWithProviders(<ButtonGrid {...defaultProps} />, mockContextValue);

      const button1 = screen.getByText('1');
      const button13 = screen.getByText('13');

      expect(button1).toBeInTheDocument();
      expect(button13).toBeInTheDocument();
    });
  });
});
