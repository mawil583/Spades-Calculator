import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { customTheme } from '../customTheme';
import WarningModal from '../components/modals/WarningModal';
import { GlobalContext } from '../helpers/context/GlobalContext';

// Mock the context values
const mockContextValue = {
  resetCurrentRound: jest.fn(),
  setRoundHistory: jest.fn(),
  setFirstDealerOrder: jest.fn(),
  firstDealerOrder: ['player1', 'player2', 'player3', 'player4'],
  roundHistory: [],
};

const renderWithProviders = (component, contextValue = mockContextValue) => {
  return render(
    <BrowserRouter>
      <ChakraProvider theme={customTheme}>
        <GlobalContext.Provider value={contextValue}>
          {component}
        </GlobalContext.Provider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('WarningModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe('when there is no round history', () => {
    it('should show only the NewPlayerQuestion modal', () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={jest.fn()} />,
        contextValue
      );

      // Should show the team question directly
      expect(
        screen.getByText('Would you like to keep the same teams?')
      ).toBeInTheDocument();
      expect(screen.getByText('Different Teams')).toBeInTheDocument();
      expect(screen.getByText('Same Teams')).toBeInTheDocument();

      // Should not show the data warning
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
      expect(
        screen.queryByText('This will permanently delete your game data.')
      ).not.toBeInTheDocument();
    });

    it('should handle "Different Teams" selection', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(screen.getByText('Different Teams'));

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams"', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(screen.getByText('Different Teams'));

      // Verify that localStorage.setItem was called with initialNames (empty player names)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'names',
        JSON.stringify({
          t1p1Name: '',
          t1p2Name: '',
          t2p1Name: '',
          t2p2Name: '',
          team1Name: 'Team 1',
          team2Name: 'Team 2',
        })
      );
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should handle "Same Teams" selection', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(screen.getByText('Same Teams'));

      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('when there is round history', () => {
    it('should show the DataWarningQuestion first', () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={jest.fn()} />,
        contextValue
      );

      // Should show the data warning first
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(
        screen.getByText('This will permanently delete your game data.')
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();

      // Should not show the team question yet
      expect(
        screen.queryByText('Would you like to keep the same teams?')
      ).not.toBeInTheDocument();
    });

    it('should handle "Cancel" from DataWarningQuestion', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(screen.getByText('Cancel'));

      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should show NewPlayerQuestion after clicking "Continue"', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={jest.fn()} />,
        contextValue
      );

      // Click Continue to proceed to the next modal
      fireEvent.click(screen.getByText('Continue'));

      await waitFor(() => {
        expect(
          screen.getByText('Would you like to keep the same teams?')
        ).toBeInTheDocument();
        expect(screen.getByText('Different Teams')).toBeInTheDocument();
        expect(screen.getByText('Same Teams')).toBeInTheDocument();
      });

      // The data warning should no longer be visible
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
      expect(
        screen.queryByText('This will permanently delete your game data.')
      ).not.toBeInTheDocument();
    });

    it('should handle "Same Teams" selection with round history', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      // Click Continue first
      fireEvent.click(screen.getByText('Continue'));

      // Then click Same Teams
      fireEvent.click(screen.getByText('Same Teams'));

      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should handle "Different Teams" selection with round history', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      // Click Continue first
      fireEvent.click(screen.getByText('Continue'));

      // Then click Different Teams
      fireEvent.click(screen.getByText('Different Teams'));

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams" with round history', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      // Click Continue first
      fireEvent.click(screen.getByText('Continue'));

      // Then click Different Teams
      fireEvent.click(screen.getByText('Different Teams'));

      // Verify that localStorage.setItem was called with initialNames (empty player names)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'names',
        JSON.stringify({
          t1p1Name: '',
          t1p2Name: '',
          t2p1Name: '',
          t2p2Name: '',
          team1Name: 'Team 1',
          team2Name: 'Team 2',
        })
      );
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('modal state management', () => {
    it('should handle modal close', () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      // The modal should have a close button (ModalCloseButton from DataWarningQuestion)
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });
});
