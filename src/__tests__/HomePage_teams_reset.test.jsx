
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import { MemoryRouter } from 'react-router-dom';
import { GlobalContext } from '../helpers/context/GlobalContext';
import NameForm from '../components/forms/NameForm';
import { initialNames } from '../helpers/utils/constants'; // Should contain 'Team 1', 'Team 2'
import { vi } from 'vitest';

// Mock hooks
const { mockUseLocalStorage } = vi.hoisted(() => {
  return { mockUseLocalStorage: vi.fn() };
});

vi.mock('../helpers/utils/hooks', () => ({
  useLocalStorage: mockUseLocalStorage,
}));

// Mock WarningModal to simulate trigger
vi.mock('../components/modals/WarningModal', () => ({
  default: ({ isOpen, resetNames }) => {
    return isOpen ? (
      <div data-testid="warning-modal">
        <button 
          data-testid="trigger-reset"
          onClick={() => {
            if (resetNames) {
              // Simulate what WarningModal does: pass initialNames
              resetNames(initialNames);
            }
          }}
        >
          Reset
        </button>
      </div>
    ) : null;
  },
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

describe('Team Name Reset Verification', () => {
  const defaultContext = {
    roundHistory: [{ round: 1 }], 
    currentRound: null,
  };

  it('should reset team names to "Team 1" and "Team 2" when Different Teams is selected', async () => {
    const setNames = vi.fn();
    // Start with CUSTOM team names
    const currentNames = {
      team1Name: 'Alpha Squad',
      team2Name: 'Omega Squad',
      t1p1Name: 'Alice',
      t1p2Name: 'Bob',
      t2p1Name: 'Charlie',
      t2p2Name: 'Dave',
    };
    
    mockUseLocalStorage.mockReturnValue([currentNames, setNames]);

    renderWithProviders(<NameForm />, defaultContext);

    // Initial state check (optional, finding input values might be tricky with Editable/Hidden, 
    // but we trust setNames verification mostly)

    // Open Warning Modal
    fireEvent.click(screen.getByText('New Game'));
    await waitFor(() => {
      expect(screen.getByTestId('warning-modal')).toBeInTheDocument();
    });

    // Trigger Reset
    const triggerBtn = screen.getByTestId('trigger-reset');
    fireEvent.click(triggerBtn);

    // Verify setNames was called with initialNames, which should contain "Team 1" and "Team 2"
    expect(setNames).toHaveBeenCalledWith(expect.objectContaining({
      team1Name: 'Team 1',
      team2Name: 'Team 2',
      t1p1Name: '',
      t1p2Name: '',
      t2p1Name: '',
      t2p2Name: '',
    }));
  });
});
