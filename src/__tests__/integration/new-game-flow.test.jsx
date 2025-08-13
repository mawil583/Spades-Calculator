import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { customTheme } from '../../customTheme';
import Navbar from '../../components/ui/Navbar';
import { GlobalContext } from '../../helpers/context/GlobalContext';

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

describe('New Game Flow Integration', () => {
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
    it('should show only the team selection modal when clicking New Game', () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Should show the team question directly (no data warning)
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

    it('should handle "Same Teams" selection from New Game button', () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Same Teams
      fireEvent.click(screen.getByText('Same Teams'));

      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('should handle "Different Teams" selection from New Game button', () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Different Teams
      fireEvent.click(screen.getByText('Different Teams'));

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams"', () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Different Teams
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
    });
  });

  describe('when there is round history', () => {
    it('should show data warning first, then team selection when clicking New Game', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

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

    it('should handle "Cancel" from data warning', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Cancel
      fireEvent.click(screen.getByText('Cancel'));

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Would you like to keep the same teams?')
        ).not.toBeInTheDocument();
      });
    });

    it('should handle complete flow: Continue -> Same Teams', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Continue
      fireEvent.click(screen.getByText('Continue'));

      // Click Same Teams
      fireEvent.click(screen.getByText('Same Teams'));

      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('should handle complete flow: Continue -> Different Teams', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Continue
      fireEvent.click(screen.getByText('Continue'));

      // Click Different Teams
      fireEvent.click(screen.getByText('Different Teams'));

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams" with round history', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Click Continue
      fireEvent.click(screen.getByText('Continue'));

      // Click Different Teams
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
    });
  });

  describe('modal accessibility', () => {
    it('should close modal when clicking the close button', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(<Navbar />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByText('New Game'));

      // Find and click the close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Would you like to keep the same teams?')
        ).not.toBeInTheDocument();
      });
    });
  });
});
