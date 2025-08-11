import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import { BrowserRouter } from 'react-router-dom';
import SpadesCalculator from '../../pages/SpadesCalculator';
import HomePage from '../../pages/HomePage';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the math functions
jest.mock('../../helpers/math/spadesMath', () => ({
  addInputs: jest.fn((a, b) => (a || 0) + (b || 0)),
  isNotDefaultValue: jest.fn((value) => value !== ''),
  calculateTeamScore: jest.fn((bids, actuals) => {
    const totalBid = bids.reduce((sum, bid) => sum + (parseInt(bid) || 0), 0);
    const totalActual = actuals.reduce(
      (sum, actual) => sum + (parseInt(actual) || 0),
      0
    );
    if (totalActual >= totalBid) {
      return totalBid * 10 + (totalActual - totalBid);
    } else {
      return -(totalBid * 10);
    }
  }),
}));

const renderWithProviders = (component, contextValue) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <GlobalContext.Provider value={contextValue}>
          {component}
        </GlobalContext.Provider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe('Complex State Interactions Between Unrelated Components', () => {
  let mockContextValue;
  let mockSetCurrentRound;
  let mockSetRoundHistory;
  let mockSetNames;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetCurrentRound = jest.fn();
    mockSetRoundHistory = jest.fn();
    mockSetNames = jest.fn();

    mockContextValue = {
      names: {
        team1Name: 'Team 1',
        team2Name: 'Team 2',
        t1p1Name: 'Mike',
        t1p2Name: 'Kim',
        t2p1Name: 'Mom',
        t2p2Name: 'Dad',
      },
      setNames: mockSetNames,
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
      setCurrentRound: mockSetCurrentRound,
      resetCurrentRound: jest.fn(),
      roundHistory: [],
      setRoundHistory: mockSetRoundHistory,
    };

    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(mockContextValue.names)
    );
  });

  describe('Component Rendering', () => {
    it('should render SpadesCalculator component with initial state', () => {
      renderWithProviders(<SpadesCalculator />, mockContextValue);

      // Verify component renders with team names (there are multiple instances)
      expect(screen.getAllByText(/Team 1/i)).toHaveLength(2);
      expect(screen.getAllByText(/Team 2/i)).toHaveLength(2);
    });

    it('should render HomePage component', () => {
      renderWithProviders(<HomePage />, mockContextValue);

      // Verify HomePage renders
      expect(
        screen.getByText(/Download Spades Calculator App/i)
      ).toBeInTheDocument();
    });
  });

  describe('Score Calculation State Propagation', () => {
    it('should update team scores when round is completed', async () => {
      // Set up a completed round
      const completedRoundState = {
        ...mockContextValue,
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: '3',
            p2Bid: '2',
            p1Actual: '3',
            p2Actual: '2',
          },
          team2BidsAndActuals: {
            p1Bid: '4',
            p2Bid: '4',
            p1Actual: '4',
            p2Actual: '4',
          },
        },
      };

      renderWithProviders(<SpadesCalculator />, completedRoundState);

      // The app automatically completes rounds when all actuals are entered
      // No manual button click is needed - the round completion is automatic
      // Verify that round history is updated automatically
      await waitFor(() => {
        expect(mockSetRoundHistory).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              team1BidsAndActuals: expect.objectContaining({
                p1Bid: '3',
                p2Bid: '2',
                p1Actual: '3',
                p2Actual: '2',
              }),
            }),
          ])
        );
      });
    });
  });

  describe('Context Integration', () => {
    it('should use context values correctly', () => {
      renderWithProviders(<SpadesCalculator />, mockContextValue);

      // Verify that context values are used
      expect(screen.getByText(/Mike/i)).toBeInTheDocument();
      expect(screen.getByText(/Kim/i)).toBeInTheDocument();
      expect(screen.getByText(/Mom/i)).toBeInTheDocument();
      expect(screen.getByText(/Dad/i)).toBeInTheDocument();
    });
  });
});
