
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import { MemoryRouter } from 'react-router-dom';
import { GlobalContext } from '../helpers/context/GlobalContext';
import NameForm from '../components/forms/NameForm';
import { initialNames } from '../helpers/utils/constants';

// Mock mocks using vi.hoisted
const { mockUseLocalStorage, mockedNavigate } = vi.hoisted(() => {
  return {
    mockUseLocalStorage: vi.fn(),
    mockedNavigate: vi.fn(),
  };
});

// Mock localStorage
const mockLocalStorage = (function () {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

vi.mock('../helpers/utils/hooks', () => ({
  useLocalStorage: mockUseLocalStorage,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock WarningModal
vi.mock('../components/modals', () => ({
  WarningModal: ({ isOpen }) => (
    isOpen ? <div data-testid="warning-modal">Warning Modal</div> : null
  ),
}));

// Mock math helpers
vi.mock('../helpers/math/spadesMath', () => ({
  isNotDefaultValue: vi.fn((val) => val !== '' && val !== undefined && val !== null),
}));


const renderWithProviders = (component, contextValue) => {
  return render(
    <Provider>
      <GlobalContext.Provider value={contextValue}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </GlobalContext.Provider>
    </Provider>
  );
};

  describe('NameForm Button Logic', () => {
    const defaultContext = {
      roundHistory: [],
      currentRound: null,
      resetCurrentRound: vi.fn(),
      setRoundHistory: vi.fn(),
      setFirstDealerOrder: vi.fn(),
      firstDealerOrder: [],
    };
  
    beforeEach(() => {
      vi.clearAllMocks();
      mockLocalStorage.clear();
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialNames));
      mockUseLocalStorage.mockReturnValue([initialNames, vi.fn()]);
    });

  it('should render "Start" button when no game data exists', () => {
    renderWithProviders(<NameForm />, defaultContext);
    
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(screen.queryByText('New Game')).not.toBeInTheDocument();
  });

  it('should render "Continue" and "New Game" buttons when round history exists', () => {
    const contextWithHistory = {
      ...defaultContext,
      roundHistory: [{ someData: 'test' }],
    };

    renderWithProviders(<NameForm />, contextWithHistory);

    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('should render "Continue" and "New Game" buttons when current round has data', () => {
    // We need to simulate isNotDefaultValue returning true for some fields
    const contextWithCurrentRound = {
      ...defaultContext,
      currentRound: {
        team1BidsAndActuals: { p1Bid: '1' }, // Has some data
      },
    };
    
    // We need to make sure the component logic detects this data.
    // Since we'll implement the check using isNotDefaultValue, 
    // we need to make sure our mock enables that path, OR we can just rely on
    // how the component will likely interpret "currentRound".
    // For now let's assume checking if currentRound has values.
    
    // BUT since we haven't implemented it yet, we just pass the context.
    // The implementation should verify if currentRound has meaningful data.

    renderWithProviders(<NameForm />, contextWithCurrentRound);

    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('should render "Continue" and "New Game" buttons when names are modified', () => {
    mockUseLocalStorage.mockReturnValue([{
      team1Name: 'Modified Team',
      team2Name: 'Team 2',
      t1p1Name: '',
      t1p2Name: '',
      t2p1Name: '',
      t2p2Name: '',
    }, vi.fn()]);

    renderWithProviders(<NameForm />, defaultContext);

    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });



  it('should open WarningModal when "New Game" is clicked', async () => {
     const contextWithHistory = {
      ...defaultContext,
      roundHistory: [{ someData: 'test' }],
    };

    renderWithProviders(<NameForm />, contextWithHistory);
    
    const newGameBtn = screen.getByText('New Game');
    expect(newGameBtn).toBeEnabled();
    fireEvent.click(newGameBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('warning-modal')).toBeInTheDocument();
    });
  });
  
  it('should navigate when "Continue" is clicked', async () => {
    // Provide valid player names so form validation passes
    const validNames = {
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: 'Alice',
      t1p2Name: 'Bob',
      t2p1Name: 'Charlie',
      t2p2Name: 'Diana',
    };
    mockUseLocalStorage.mockReturnValue([validNames, vi.fn()]);

    const contextWithHistory = {
      ...defaultContext,
      roundHistory: [{ someData: 'test' }],
    };

    renderWithProviders(<NameForm />, contextWithHistory);

    const continueBtn = screen.getByText('Continue');
    expect(continueBtn).toBeEnabled();
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/spades-calculator', expect.any(Object));
    });
  });
});
