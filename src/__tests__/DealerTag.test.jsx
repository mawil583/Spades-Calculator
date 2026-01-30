
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import DealerTag from '../components/ui/DealerTag';
import { GlobalContext } from '../helpers/context/GlobalContext';

// Mock the spadesMath functions
jest.mock('../helpers/math/spadesMath', () => ({
  getDealerIdHistory: jest.fn(() => []),
  getCurrentDealerId: jest.fn(() => 'team1BidsAndActuals.p1Bid'),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() =>
    JSON.stringify({
      t1p1Name: 'Player 1',
      t1p2Name: 'Player 2',
      t2p1Name: 'Player 3',
      t2p2Name: 'Player 4',
    })
  ),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockContextValue = {
  firstDealerOrder: [
    'team1BidsAndActuals.p1Bid',
    'team2BidsAndActuals.p1Bid',
    'team1BidsAndActuals.p2Bid',
    'team2BidsAndActuals.p2Bid',
  ],
  currentRound: {},
  setDealerOverride: jest.fn(),
};

const renderWithProviders = (component) => {
  return render(
    <Provider>
      <GlobalContext.Provider value={mockContextValue}>
        {component}
      </GlobalContext.Provider>
    </Provider>
  );
};

describe('DealerTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Unit Tests', () => {
    it('should render dealer badge when player is dealer', () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByTestId('dealerBadge')).toBeInTheDocument();
    });

    it('should open dealer selection modal when clicked on current round', async () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />
      );

      const dealerBadge = screen.getByTestId('dealerBadge');
      fireEvent.click(dealerBadge);

      expect(await screen.findByText('Select the dealer')).toBeInTheDocument();
      expect(await screen.findByTestId('dealerSelectionModal')).toBeInTheDocument();
    });

    it('should not open modal when clicked on non-current round', async () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={false}
          roundHistory={[]}
        />
      );

      const dealerBadge = screen.getByTestId('dealerBadge');
      fireEvent.click(dealerBadge);

      expect(screen.queryByText('Select the dealer')).not.toBeInTheDocument();
    });

    it('should call setDealerOverride when a dealer option is selected', async () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />
      );

      const dealerBadge = screen.getByTestId('dealerBadge');
      fireEvent.click(dealerBadge);

      const dealerOption = await screen.findByText('Player 1');
      fireEvent.click(dealerOption);

      expect(mockContextValue.setDealerOverride).toHaveBeenCalledWith(
        'team1BidsAndActuals.p1Bid'
      );
    });
  });
});
