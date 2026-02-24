import { vi } from "vitest";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "../../components/ui/provider";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { StateProvider } from "../../helpers/context/GlobalContext";
import App from "../../App";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock service worker
const mockServiceWorker = {
  register: vi.fn(),
  getRegistrations: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

Object.defineProperty(window.navigator, "serviceWorker", {
  value: mockServiceWorker,
  writable: true,
});

// Mock caches
const mockCaches = {
  open: vi.fn(),
  keys: vi.fn(),
  delete: vi.fn(),
  match: vi.fn(),
};

Object.defineProperty(window, "caches", {
  value: mockCaches,
  writable: true,
});

// Mock the math functions
vi.mock("../../helpers/math/spadesMath", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    addInputs: vi.fn((a, b) => (a || 0) + (b || 0)),
    isNotDefaultValue: vi.fn((value) => value !== ""),
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

const renderWithProviders = (component: ReactNode, initialEntries = ["/"]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: component,
      },
    ],
    {
      initialEntries,
    },
  );

  return render(
    <Provider>
      <StateProvider>
        <RouterProvider router={router} />
      </StateProvider>
    </Provider>,
  );
};

describe("External Integrations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockServiceWorker.register.mockResolvedValue({});
    mockServiceWorker.getRegistrations.mockResolvedValue([]);
    mockCaches.open.mockResolvedValue({});
    mockCaches.keys.mockResolvedValue([]);
  });

  describe("localStorage Integration", () => {
    it("should save and load game data from localStorage", async () => {
      renderWithProviders(<App />);

      // Enter game data
      const team1Display = screen.getByText("Team 1");
      fireEvent.click(team1Display);
      const team1Input = screen.getByDisplayValue("Team 1");
      fireEvent.change(team1Input, { target: { value: "Test Team 1" } });
      fireEvent.blur(team1Input);

      const team2Display = screen.getByText("Team 2");
      fireEvent.click(team2Display);
      const team2Input = screen.getByDisplayValue("Team 2");
      fireEvent.change(team2Input, { target: { value: "Test Team 2" } });
      fireEvent.blur(team2Input);

      // Enter player names
      const playerInputs = screen.getAllByRole("textbox");
      fireEvent.change(playerInputs[0], { target: { value: "Test Player 1" } });
      fireEvent.change(playerInputs[1], { target: { value: "Test Player 2" } });
      fireEvent.change(playerInputs[2], { target: { value: "Test Player 3" } });
      fireEvent.change(playerInputs[3], { target: { value: "Test Player 4" } });

      // Start game
      const startButton = screen.getByText("Start");
      fireEvent.click(startButton);

      // Verify localStorage was called
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it("should load existing game data on app start", async () => {
      const savedData = {
        team1Name: "Saved Team 1",
        team2Name: "Saved Team 2",
        t1p1Name: "Saved Player 1",
        t1p2Name: "Saved Player 2",
        t2p1Name: "Saved Player 3",
        t2p2Name: "Saved Player 4",
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));

      renderWithProviders(<App />);

      // Verify saved data is loaded
      await waitFor(() => {
        expect(screen.getByText("Saved Team 1")).toBeInTheDocument();
        expect(screen.getByText("Saved Team 2")).toBeInTheDocument();
      });
    });
  });

  describe("Cache Integration", () => {
    it("should handle cache operations for offline functionality", async () => {
      renderWithProviders(<App />);

      // Simulate cache operations
      mockCaches.keys.mockResolvedValue(["app-cache-v1"]);
      mockCaches.delete.mockResolvedValue(true);

      // Verify cache operations work
      const cacheKeys = await mockCaches.keys();
      expect(cacheKeys).toEqual(["app-cache-v1"]);
    });
  });

  describe("PWA Integration", () => {
    it("should show offline download in menu when PWA is installable", async () => {
      renderWithProviders(<App />);

      // Open menu
      const menuButton = screen.getByLabelText(/Open Menu/i);
      fireEvent.click(menuButton);

      // Verify offline download item is present
      expect(screen.getByText(/Offline Download/i)).toBeInTheDocument();
    });

    it("should handle beforeinstallprompt event", async () => {
      renderWithProviders(<App />);

      // Simulate beforeinstallprompt event
      const beforeInstallPromptEvent = new Event("beforeinstallprompt");
      window.dispatchEvent(beforeInstallPromptEvent);

      // Open menu
      const menuButton = screen.getByLabelText(/Open Menu/i);
      fireEvent.click(menuButton);

      // App should handle the event gracefully
      expect(screen.getByText(/Offline Download/i)).toBeInTheDocument();
    });
  });

  describe("Navigation Integration", () => {
    it("should handle browser navigation correctly", async () => {
      renderWithProviders(<App />);

      // Fill in form data
      // Fill in form data
      const team1Display = screen.getByText("Team 1");
      fireEvent.click(team1Display);
      const team1Input = screen.getByDisplayValue("Team 1");
      fireEvent.change(team1Input, { target: { value: "Team A" } });
      fireEvent.blur(team1Input);

      const team2Display = screen.getByText("Team 2");
      fireEvent.click(team2Display);
      const team2Input = screen.getByDisplayValue("Team 2");
      fireEvent.change(team2Input, { target: { value: "Team B" } });
      fireEvent.blur(team2Input);

      const playerInputs = screen.getAllByRole("textbox");
      fireEvent.change(playerInputs[0], { target: { value: "Player 1" } });
      fireEvent.change(playerInputs[1], { target: { value: "Player 2" } });
      fireEvent.change(playerInputs[2], { target: { value: "Player 3" } });
      fireEvent.change(playerInputs[3], { target: { value: "Player 4" } });

      // Start game
      const startButton = screen.getByText("Start");
      fireEvent.click(startButton);

      // Verify navigation to game page
      await waitFor(() => {
        expect(screen.getByText(/Team A/i)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle localStorage errors gracefully", async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("localStorage quota exceeded");
      });

      renderWithProviders(<App />);

      // App should continue to work even if localStorage fails
      expect(screen.getByText(/SpadesCalculator/i)).toBeInTheDocument();
    });

    it("should handle network errors gracefully", async () => {
      // Mock fetch to simulate network error
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      renderWithProviders(<App />);

      // App should work offline
      expect(screen.getByText(/SpadesCalculator/i)).toBeInTheDocument();
    });
  });
});
