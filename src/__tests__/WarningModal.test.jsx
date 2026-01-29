import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from '../components/ui/provider';
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

const { mockedNavigate } = vi.hoisted(() => {
  return { mockedNavigate: vi.fn() };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderWithProviders = (component, contextValue = mockContextValue) => {
  return render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue}>
          {component}
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>
  );
};

describe('WarningModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedNavigate.mockClear();
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
    it('should show only the NewPlayerQuestion modal', async () => {
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
        await screen.findByText('Would you like to keep the same teams?')
      ).toBeInTheDocument();
      expect(screen.getByText('Different Teams')).toBeInTheDocument();
      expect(screen.getByText('Same Teams')).toBeInTheDocument();

      // Should not show the data warning
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
      expect(
        screen.queryByText('This will permanently delete your game data.')
      ).not.toBeInTheDocument();
    });

    it('should handle "Different Teams" selection', async () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(await screen.findByText('Different Teams'));

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams"', async () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(await screen.findByText('Different Teams'));

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
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });

    it('should handle "Same Teams" selection', async () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(await screen.findByText('Same Teams'));

      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockedNavigate).toHaveBeenCalledWith('/spades-calculator');
    });
  });

  describe('when there is round history', () => {
    it('should show the DataWarningQuestion first', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={jest.fn()} />,
        contextValue
      );

      // Should show the data warning first
      expect(await screen.findByText('Are you sure?')).toBeInTheDocument();
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

    it('should handle "Cancel" from DataWarningQuestion', async () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      fireEvent.click(await screen.findByText('Cancel'));

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
      fireEvent.click(await screen.findByText('Continue'));

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

    it('should handle "Same Teams" selection with round history', async () => {
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
      fireEvent.click(await screen.findByText('Continue'));

      // Then click Same Teams
      fireEvent.click(await screen.findByText('Same Teams'));

      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockedNavigate).toHaveBeenCalledWith('/spades-calculator');
    });

    it('should handle "Different Teams" selection with round history', async () => {
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
      fireEvent.click(await screen.findByText('Continue'));

      // Then click Different Teams
      fireEvent.click(await screen.findByText('Different Teams'));

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams" with round history', async () => {
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
      fireEvent.click(await screen.findByText('Continue'));

      // Then click Different Teams
      fireEvent.click(await screen.findByText('Different Teams'));

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
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('modal state management', () => {
    it('should handle modal close', async () => {
      const setIsModalOpen = jest.fn();
      const contextValue = {
        ...mockContextValue,
        roundHistory: [{ round: 1, bids: [1, 2, 3, 4] }],
      };

      renderWithProviders(
        <WarningModal isOpen={true} setIsModalOpen={setIsModalOpen} />,
        contextValue
      );

      // The modal should have a close button
      const closeButton = await screen.findByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(setIsModalOpen).toHaveBeenCalledWith(false);
      });
    });
  });
});
