import { vi } from 'vitest';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from '../../components/ui/provider';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { StateProvider } from '../../helpers/context/GlobalContext';
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
vi.mock('../helpers/math/spadesMath', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    addInputs: vi.fn((a, b) => (a || 0) + (b || 0)),
    isNotDefaultValue: vi.fn((value) => value !== ''),
    calculateTeamScore: vi.fn((bids: string[], actuals: string[]) => {
      const totalBid = bids.reduce((sum: number, bid: string) => sum + (parseInt(bid) || 0), 0);
      const totalActual = actuals.reduce(
        (sum: number, actual: string) => sum + (parseInt(actual) || 0),
        0
      );
      if (totalActual >= totalBid) {
        return totalBid * 10 + (totalActual - totalBid);
      } else {
        return -(totalBid * 10);
      }
    }),
  };
});

const renderWithProviders = (component: ReactNode, initialEntries = ['/']) => {
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

describe('Complete User Workflows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Basic Game Setup Workflow', () => {
    it('should complete full game setup process', async () => {
      renderWithProviders(<HomePage />);

      // Fill in team names
      // Fill in team names
      const team1Display = screen.getByText('Team 1');
      fireEvent.click(team1Display);
      const team1Input = screen.getByDisplayValue('Team 1');
      fireEvent.change(team1Input, { target: { value: 'Team A' } });
      fireEvent.blur(team1Input);

      const team2Display = screen.getByText('Team 2');
      fireEvent.click(team2Display);
      const team2Input = screen.getByDisplayValue('Team 2');
      fireEvent.change(team2Input, { target: { value: 'Team B' } });
      fireEvent.blur(team2Input);

      // Fill in player names
      const playerInputs = screen.getAllByRole('textbox');
      fireEvent.change(playerInputs[0], { target: { value: 'Player 1' } });
      fireEvent.change(playerInputs[1], { target: { value: 'Player 2' } });
      fireEvent.change(playerInputs[2], { target: { value: 'Player 3' } });
      fireEvent.change(playerInputs[3], { target: { value: 'Player 4' } });

      // Submit the form
      const startButton = screen.getByText('Start');
      fireEvent.click(startButton);

      // Verify navigation to game page
      await waitFor(() => {
        expect(screen.getByText(/Team A/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation Workflow', () => {
    it('should handle form validation errors gracefully', async () => {
      renderWithProviders(<HomePage />);

      // Try to submit without filling required fields
      const startButton = screen.getByText('Start');
      fireEvent.click(startButton);

      // Should stay on the same page and show validation errors
      await waitFor(() => {
        expect(
          screen.getByText(/SpadesCalculator/i)
        ).toBeInTheDocument();
      });
    });

    it('should handle valid form submission', async () => {
      renderWithProviders(<HomePage />);

      // Fill in form with valid data
      // Fill in form with valid data
      const team1Display = screen.getByText('Team 1');
      fireEvent.click(team1Display);
      const team1Input = screen.getByDisplayValue('Team 1');
      fireEvent.change(team1Input, { target: { value: 'Team A' } });
      fireEvent.blur(team1Input);

      const team2Display = screen.getByText('Team 2');
      fireEvent.click(team2Display);
      const team2Input = screen.getByDisplayValue('Team 2');
      fireEvent.change(team2Input, { target: { value: 'Team B' } });
      fireEvent.blur(team2Input);

      const playerInputs = screen.getAllByRole('textbox');
      fireEvent.change(playerInputs[0], { target: { value: 'Player 1' } });
      fireEvent.change(playerInputs[1], { target: { value: 'Player 2' } });
      fireEvent.change(playerInputs[2], { target: { value: 'Player 3' } });
      fireEvent.change(playerInputs[3], { target: { value: 'Player 4' } });

      // Submit the form
      const startButton = screen.getByText('Start');
      fireEvent.click(startButton);

      // Verify navigation to game page
      await waitFor(() => {
        expect(screen.getByText(/Team A/i)).toBeInTheDocument();
      });
    });
  });

  describe('PWA Integration Workflow', () => {
    it('should show and handle offline download in menu', async () => {
      renderWithProviders(<HomePage />);

      // Open menu
      const menuButton = screen.getByLabelText(/Open Menu/i);
      fireEvent.click(menuButton);

      // Verify offline download item is present
      expect(screen.getByText(/Offline Download/i)).toBeInTheDocument();

      // Click it
      fireEvent.click(screen.getByText(/Offline Download/i));
    });
  });

  describe('Settings Integration Workflow', () => {
    it('should show scoring rules in settings modal', async () => {
      renderWithProviders(<HomePage />);

      // Open settings
      const menuButton = screen.getByLabelText(/Open Menu/i);
      fireEvent.click(menuButton);
      fireEvent.click(screen.getByText(/Settings/i));

      // Verify scoring rules are present in modal
      await waitFor(() => {
        expect(
          screen.getByText(/Select your preferred scoring rules/i)
        ).toBeInTheDocument();
      });
      expect(screen.getByText(/Takes Bags/i)).toBeInTheDocument();
      expect(screen.getByText(/Helps Team Bid/i)).toBeInTheDocument();
      expect(screen.getByText(/No Bags\/No Help/i)).toBeInTheDocument();
    });

    it('should allow changing scoring rules in modal', async () => {
      renderWithProviders(<HomePage />);

      // Open settings
      const menuButton = screen.getByLabelText(/Open Menu/i);
      fireEvent.click(menuButton);
      fireEvent.click(screen.getByText(/Settings/i));

      // Click on different scoring rule
      const helpsTeamBidRadio = await waitFor(() => screen.getByLabelText(/Helps Team Bid/i));
      fireEvent.click(helpsTeamBidRadio);

      // Verify the selection was made
      expect(helpsTeamBidRadio).toBeChecked();
    });
  });
});
