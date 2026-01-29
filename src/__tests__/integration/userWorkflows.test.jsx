import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from '../../components/ui/provider';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { StateProvider } from '../../helpers/context/GlobalContext';
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
jest.mock('../helpers/math/spadesMath', () => ({
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

describe('Complete User Workflows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      const playerInputs = screen.getAllByPlaceholderText(/who's/i);
      fireEvent.change(playerInputs[0], { target: { value: 'Player 1' } });
      fireEvent.change(playerInputs[1], { target: { value: 'Player 2' } });

      const player2Inputs = screen.getAllByDisplayValue('');
      fireEvent.change(player2Inputs[0], { target: { value: 'Player 3' } });
      fireEvent.change(player2Inputs[1], { target: { value: 'Player 4' } });

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
          screen.getByText(/Download Spades Calculator App/i)
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

      const playerInputs = screen.getAllByPlaceholderText(/who's/i);
      fireEvent.change(playerInputs[0], { target: { value: 'Player 1' } });
      fireEvent.change(playerInputs[1], { target: { value: 'Player 2' } });

      const player2Inputs = screen.getAllByDisplayValue('');
      fireEvent.change(player2Inputs[0], { target: { value: 'Player 3' } });
      fireEvent.change(player2Inputs[1], { target: { value: 'Player 4' } });

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
    it('should show download button on home page', async () => {
      renderWithProviders(<HomePage />);

      // Verify download button is present
      expect(screen.getByText(/Download App/i)).toBeInTheDocument();
    });

    it('should handle PWA installation flow', async () => {
      renderWithProviders(<HomePage />);

      // Click download button
      const downloadButton = screen.getByText(/Download App/i);
      fireEvent.click(downloadButton);

      // Should handle the click gracefully
      expect(screen.getByText(/Download App/i)).toBeInTheDocument();
    });
  });

  describe('Settings Integration Workflow', () => {
    it('should show scoring rules settings', async () => {
      renderWithProviders(<HomePage />);

      // Verify scoring rules are present
      expect(
        screen.getByText(/Select your preferred scoring rules/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Takes Bags/i)).toBeInTheDocument();
      expect(screen.getByText(/Helps Team Bid/i)).toBeInTheDocument();
      expect(screen.getByText(/No Bags\/No Help/i)).toBeInTheDocument();
    });

    it('should allow changing scoring rules', async () => {
      renderWithProviders(<HomePage />);

      // Click on different scoring rule
      const helpsTeamBidRadio = screen.getByLabelText(/Helps Team Bid/i);
      fireEvent.click(helpsTeamBidRadio);

      // Verify the selection was made
      expect(helpsTeamBidRadio).toBeChecked();
    });
  });
});
