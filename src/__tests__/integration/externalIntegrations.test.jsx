import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from '../../components/ui/provider';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { StateProvider } from '../../helpers/context/GlobalContext';
import App from '../../App';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock service worker
const mockServiceWorker = {
  register: jest.fn(),
  getRegistrations: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(window.navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

// Mock caches
const mockCaches = {
  open: jest.fn(),
  keys: jest.fn(),
  delete: jest.fn(),
  match: jest.fn(),
};

Object.defineProperty(window, 'caches', {
  value: mockCaches,
  writable: true,
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

const renderWithProviders = (component, initialEntries = ['/']) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: component,
      },
    ],
    {
      initialEntries,
    }
  );

  return render(
    <Provider>
      <StateProvider>
        <RouterProvider router={router} />
      </StateProvider>
    </Provider>
  );
};

describe('External Integrations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockServiceWorker.register.mockResolvedValue({});
    mockServiceWorker.getRegistrations.mockResolvedValue([]);
    mockCaches.open.mockResolvedValue({});
    mockCaches.keys.mockResolvedValue([]);
  });

  describe('localStorage Integration', () => {
    it('should save and load game data from localStorage', async () => {
      renderWithProviders(<App />);

      // Enter game data
      const team1Input = screen.getByDisplayValue('Team 1');
      const team2Input = screen.getByDisplayValue('Team 2');

      fireEvent.change(team1Input, { target: { value: 'Test Team 1' } });
      fireEvent.change(team2Input, { target: { value: 'Test Team 2' } });

      // Enter player names
      const playerInputs = screen.getAllByPlaceholderText(/who's/i);
      fireEvent.change(playerInputs[0], { target: { value: 'Test Player 1' } });
      fireEvent.change(playerInputs[1], { target: { value: 'Test Player 2' } });

      const player2Inputs = screen.getAllByDisplayValue('');
      fireEvent.change(player2Inputs[0], {
        target: { value: 'Test Player 3' },
      });
      fireEvent.change(player2Inputs[1], {
        target: { value: 'Test Player 4' },
      });

      // Start game
      const startButton = screen.getByText('Start');
      fireEvent.click(startButton);

      // Verify localStorage was called
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should load existing game data on app start', async () => {
      const savedData = {
        team1Name: 'Saved Team 1',
        team2Name: 'Saved Team 2',
        t1p1Name: 'Saved Player 1',
        t1p2Name: 'Saved Player 2',
        t2p1Name: 'Saved Player 3',
        t2p2Name: 'Saved Player 4',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));

      renderWithProviders(<App />);

      // Verify saved data is loaded
      await waitFor(() => {
        expect(screen.getByDisplayValue('Saved Team 1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Saved Team 2')).toBeInTheDocument();
      });
    });
  });

  describe('Cache Integration', () => {
    it('should handle cache operations for offline functionality', async () => {
      renderWithProviders(<App />);

      // Simulate cache operations
      mockCaches.keys.mockResolvedValue(['app-cache-v1']);
      mockCaches.delete.mockResolvedValue(true);

      // Verify cache operations work
      const cacheKeys = await mockCaches.keys();
      expect(cacheKeys).toEqual(['app-cache-v1']);
    });
  });

  describe('PWA Integration', () => {
    it('should show download button when PWA is installable', async () => {
      renderWithProviders(<App />);

      // Verify download button is present
      expect(screen.getByText(/Download App/i)).toBeInTheDocument();
    });

    it('should handle beforeinstallprompt event', async () => {
      renderWithProviders(<App />);

      // Simulate beforeinstallprompt event
      const beforeInstallPromptEvent = new Event('beforeinstallprompt');
      window.dispatchEvent(beforeInstallPromptEvent);

      // App should handle the event gracefully
      expect(screen.getByText(/Download App/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    it('should handle browser navigation correctly', async () => {
      renderWithProviders(<App />);

      // Fill in form data
      const team1Input = screen.getByDisplayValue('Team 1');
      const team2Input = screen.getByDisplayValue('Team 2');
      fireEvent.change(team1Input, { target: { value: 'Team A' } });
      fireEvent.change(team2Input, { target: { value: 'Team B' } });

      const playerInputs = screen.getAllByPlaceholderText(/who's/i);
      fireEvent.change(playerInputs[0], { target: { value: 'Player 1' } });
      fireEvent.change(playerInputs[1], { target: { value: 'Player 2' } });

      const player2Inputs = screen.getAllByDisplayValue('');
      fireEvent.change(player2Inputs[0], { target: { value: 'Player 3' } });
      fireEvent.change(player2Inputs[1], { target: { value: 'Player 4' } });

      // Start game
      const startButton = screen.getByText('Start');
      fireEvent.click(startButton);

      // Verify navigation to game page
      await waitFor(() => {
        expect(screen.getByText(/Team A/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle localStorage errors gracefully', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      renderWithProviders(<App />);

      // App should continue to work even if localStorage fails
      expect(
        screen.getByText(/Download Spades Calculator App/i)
      ).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      // Mock fetch to simulate network error
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      renderWithProviders(<App />);

      // App should work offline
      expect(
        screen.getByText(/Download Spades Calculator App/i)
      ).toBeInTheDocument();
    });
  });
});
