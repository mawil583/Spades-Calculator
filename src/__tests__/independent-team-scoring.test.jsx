import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { customTheme } from '../customTheme';
import SpadesCalculator from '../pages/SpadesCalculator';
import { GlobalContext } from '../helpers/context/GlobalContext';

// Mock the math functions to control scoring
const mockCalculateTeamScoreFromRoundHistory = jest.fn();
jest.mock('../helpers/math/spadesMath', () => ({
  ...jest.requireActual('../helpers/math/spadesMath'),
  calculateTeamScoreFromRoundHistory: mockCalculateTeamScoreFromRoundHistory,
}));

const renderWithProviders = (component, contextValue) => {
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

describe('Independent Team Scoring', () => {
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

    // Set up default names
    const mockNames = {
      t1p1Name: 'Alice',
      t1p2Name: 'Bob',
      t2p1Name: 'Charlie',
      t2p2Name: 'Diana',
      team1Name: 'Team Alpha',
      team2Name: 'Team Beta',
    };
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'names') return JSON.stringify(mockNames);
      if (key === 'nilScoringRule') return JSON.stringify('helpsTeamBid');
      return null;
    });
  });

  describe('when only one team completes their actuals', () => {
    it("should update only that team's score when they complete their actuals", async () => {
      const mockSetRoundHistory = jest.fn();
      const mockResetCurrentRound = jest.fn();

      const contextValue = {
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '', // Team 2 hasn't finished
          },
        },
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        setFirstDealerOrder: jest.fn(),
      };

      // Mock the score calculation to return different values
      mockCalculateTeamScoreFromRoundHistory
        .mockReturnValueOnce({ teamScore: 70, teamBags: 0 }) // Team 1 score
        .mockReturnValueOnce({ teamScore: 0, teamBags: 0 }); // Team 2 score

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByText('Score')).toBeInTheDocument();
      });

      // Team 1 should have their score updated (70 points)
      expect(screen.getByText('70')).toBeInTheDocument();

      // Team 2 should still show 0 since they haven't finished
      expect(screen.getByText('0')).toBeInTheDocument();

      // Round should not be completed yet since Team 2 hasn't finished
      expect(mockSetRoundHistory).not.toHaveBeenCalled();
      expect(mockResetCurrentRound).not.toHaveBeenCalled();
    });

    it('should not allow progression to next round until both teams complete actuals', async () => {
      const mockSetRoundHistory = jest.fn();
      const mockResetCurrentRound = jest.fn();

      const contextValue = {
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '', // Team 2 hasn't finished
          },
        },
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        setFirstDealerOrder: jest.fn(),
      };

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByText('Score')).toBeInTheDocument();
      });

      // Round should not be completed since Team 2 hasn't finished
      expect(mockSetRoundHistory).not.toHaveBeenCalled();
      expect(mockResetCurrentRound).not.toHaveBeenCalled();
    });
  });

  describe('when both teams complete their actuals', () => {
    it('should complete the round and allow progression when both teams finish', async () => {
      const mockSetRoundHistory = jest.fn();
      const mockResetCurrentRound = jest.fn();

      const contextValue = {
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '4',
          },
        },
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        setFirstDealerOrder: jest.fn(),
      };

      // Mock the score calculation
      mockCalculateTeamScoreFromRoundHistory
        .mockReturnValueOnce({ teamScore: 70, teamBags: 0 }) // Team 1 score
        .mockReturnValueOnce({ teamScore: 51, teamBags: 0 }); // Team 2 score (2+3=5 bids, 2+4=6 actuals = 50+1=51 points)

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByText('Score')).toBeInTheDocument();
      });

      // Both teams should have their scores updated
      expect(screen.getByText('70')).toBeInTheDocument(); // Team 1
      expect(screen.getByText('51')).toBeInTheDocument(); // Team 2

      // Round should be completed since both teams finished
      expect(mockSetRoundHistory).toHaveBeenCalledWith([
        expect.objectContaining({
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '4',
          },
        }),
      ]);
      expect(mockResetCurrentRound).toHaveBeenCalled();
    });
  });

  describe('score calculation timing', () => {
    it('should calculate team scores independently as each team completes', async () => {
      const mockSetRoundHistory = jest.fn();
      const mockResetCurrentRound = jest.fn();

      // Start with Team 1 complete, Team 2 incomplete
      const contextValue = {
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '', // Team 2 hasn't finished
          },
        },
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        setFirstDealerOrder: jest.fn(),
      };

      // Mock initial score calculation
      mockCalculateTeamScoreFromRoundHistory
        .mockReturnValueOnce({ teamScore: 70, teamBags: 0 }) // Team 1 score
        .mockReturnValueOnce({ teamScore: 0, teamBags: 0 }); // Team 2 score

      const { rerender } = renderWithProviders(
        <SpadesCalculator />,
        contextValue
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByText('Score')).toBeInTheDocument();
      });

      // Team 1 should have score, Team 2 should not
      expect(screen.getByText('70')).toBeInTheDocument(); // Team 1
      expect(screen.getByText('0')).toBeInTheDocument(); // Team 2

      // Now complete Team 2's actuals
      const updatedContextValue = {
        ...contextValue,
        currentRound: {
          ...contextValue.currentRound,
          team2BidsAndActuals: {
            ...contextValue.currentRound.team2BidsAndActuals,
            p2Actual: '4', // Team 2 now complete (2+4=6 actuals, total = 7+6=13)
          },
        },
      };

      // Mock updated score calculation - after round completion, scores come from round history
      mockCalculateTeamScoreFromRoundHistory
        .mockReturnValueOnce({ teamScore: 70, teamBags: 0 }) // Team 1 score
        .mockReturnValueOnce({ teamScore: 51, teamBags: 0 }); // Team 2 score (2+3=5 bids, 2+4=6 actuals = 50+1=51 points)

      rerender(
        <BrowserRouter>
          <ChakraProvider theme={customTheme}>
            <GlobalContext.Provider value={updatedContextValue}>
              <SpadesCalculator />
            </GlobalContext.Provider>
          </ChakraProvider>
        </BrowserRouter>
      );

      // Wait for update
      await waitFor(() => {
        expect(screen.getByText('51')).toBeInTheDocument(); // Team 2 now has score
      });

      // Both teams should now have scores
      expect(screen.getByText('70')).toBeInTheDocument(); // Team 1
      expect(screen.getByText('51')).toBeInTheDocument(); // Team 2

      // Round should now be completed
      expect(mockSetRoundHistory).toHaveBeenCalled();
      expect(mockResetCurrentRound).toHaveBeenCalled();
    });
  });

  describe('validation still works', () => {
    it('should still validate that total actuals equal 13 before completing round', async () => {
      const mockSetRoundHistory = jest.fn();
      const mockResetCurrentRound = jest.fn();

      const contextValue = {
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '4', // This makes total 13, but Team 2 should still be able to complete
          },
        },
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        setFirstDealerOrder: jest.fn(),
      };

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByText('Score')).toBeInTheDocument();
      });

      // Round should be completed since total actuals = 13
      expect(mockSetRoundHistory).toHaveBeenCalled();
      expect(mockResetCurrentRound).toHaveBeenCalled();
    });

    it('should not complete round if total actuals do not equal 13', async () => {
      const mockSetRoundHistory = jest.fn();
      const mockResetCurrentRound = jest.fn();

      const contextValue = {
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '4',
            p1Actual: '3',
            p2Actual: '4',
          },
          team2BidsAndActuals: {
            p1Bid: '2',
            p2Bid: '3',
            p1Actual: '2',
            p2Actual: '5', // This makes total 14, which is invalid
          },
        },
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          'team1BidsAndActuals.p1Bid',
          'team2BidsAndActuals.p1Bid',
          'team1BidsAndActuals.p2Bid',
          'team2BidsAndActuals.p2Bid',
        ],
        setFirstDealerOrder: jest.fn(),
      };

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByText('Score')).toBeInTheDocument();
      });

      // Round should not be completed since total actuals ≠ 13
      expect(mockSetRoundHistory).not.toHaveBeenCalled();
      expect(mockResetCurrentRound).not.toHaveBeenCalled();
    });
  });
});
