import { vi, type Mock } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from '../../components/ui/provider';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import type { GlobalContextValue, Round } from '../../types';
import type { ReactNode } from 'react';
import SpadesCalculator from '../../pages/SpadesCalculator';
import HomePage from '../../pages/HomePage';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the math functions
vi.mock('../../helpers/math/spadesMath', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    addInputs: vi.fn((a, b) => (a || 0) + (b || 0)),
    isNotDefaultValue: vi.fn((value) => value !== ''),
    calculateTeamScore: vi.fn((bids: string[], actuals: string[]) => {
      const totalBid = bids.reduce(
        (sum: number, bid: string) => sum + (parseInt(bid) || 0),
        0,
      );
      const totalActual = actuals.reduce(
        (sum: number, actual: string) => sum + (parseInt(actual) || 0),
        0,
      );
      if (totalActual >= totalBid) {
        return totalBid * 10 + (totalActual - totalBid);
      } else {
        return -(totalBid * 10);
      }
    }),
  };
});

interface MockContextValue extends GlobalContextValue {
  names: Record<string, string>;
  setNames: Mock;
}

const renderWithProviders = (
  component: ReactNode,
  contextValue: GlobalContextValue,
  initialEntries = ['/'],
) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: component,
      },
    ],
    {
      initialEntries,
    },
  );

  return render(
    <Provider>
      <GlobalContext.Provider value={contextValue}>
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </Provider>,
  );
};

describe('Complex State Interactions Between Unrelated Components', () => {
  let mockContextValue: MockContextValue;
  let mockSetCurrentRound: Mock;
  let mockSetRoundHistory: Mock;
  let mockSetNames: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetCurrentRound = vi.fn();
    mockSetRoundHistory = vi.fn();
    mockSetNames = vi.fn();

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
      } as unknown as Round as Round,
      setCurrentRound: mockSetCurrentRound,
      resetCurrentRound: vi.fn(),
      roundHistory: [],
      setRoundHistory: mockSetRoundHistory,
      firstDealerOrder: [],
      isFirstGameAmongTeammates: false,
      setFirstDealerOrder: vi.fn(),
      setDealerOverride: vi.fn(),
      resetRoundHistory: vi.fn(),
    } as unknown as MockContextValue;

    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(mockContextValue.names),
    );
  });

  describe('Component Rendering', () => {
    it('should render SpadesCalculator component with initial state', () => {
      renderWithProviders(<SpadesCalculator />, mockContextValue);

      // Verify component renders with team names (there are multiple instances)
      expect(screen.getAllByText(/Team 1/i)).toHaveLength(1);
      expect(screen.getAllByText(/Team 2/i)).toHaveLength(1);
    });

    it('should render HomePage component', () => {
      renderWithProviders(<HomePage />, mockContextValue);

      // Verify HomePage renders
      expect(screen.getByText(/SpadesCalculator/i)).toBeInTheDocument();
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
        } as unknown as Round,
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
          ]),
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
