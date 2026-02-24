import { vi, type Mock } from "vitest";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "../../components/ui/provider";
import Header from "../../components/ui/Header";
import { GlobalContext } from "../../helpers/context/GlobalContext";
import type { GlobalContextValue, Round } from "../../types";
import type { ReactNode } from "react";

// Mock the context values
vi.mock("../helpers/math/spadesMath", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    hasPlayerNamesEntered: vi.fn(() => true),
    hasDataEntered: vi.fn(() => true),
  };
});

const mockContextValue: GlobalContextValue = {
  resetCurrentRound: vi.fn(),
  setRoundHistory: vi.fn(),
  setFirstDealerOrder: vi.fn(),
  firstDealerOrder: ["player1", "player2", "player3", "player4"],
  roundHistory: [],
  currentRound: {} as Round,
  isFirstGameAmongTeammates: false,
  setCurrentRound: vi.fn(),
  resetRoundHistory: vi.fn(),
  setDealerOverride: vi.fn(),
} as unknown as GlobalContextValue;

const renderWithProviders = (
  component: ReactNode,
  contextValue: GlobalContextValue = mockContextValue,
) => {
  return render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue}>
          {component}
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );
};

describe("New Game Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe("when there is no round history", () => {
    it("should show only the team selection modal when clicking New Game", async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Should show the team question directly (no data warning)
      expect(
        await screen.findByText("Would you like to keep the same teams?"),
      ).toBeInTheDocument();
      expect(screen.getByText("Different Teams")).toBeInTheDocument();
      expect(screen.getByText("Same Teams")).toBeInTheDocument();

      // Should not show the data warning
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
      expect(
        screen.queryByText("This will permanently delete your game data."),
      ).not.toBeInTheDocument();
    });

    it('should handle "Same Teams" selection from New Game button', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Wait for modal and click Same Teams
      const sameTeamsButton = await screen.findByText("Same Teams");
      fireEvent.click(sameTeamsButton);

      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it('should handle "Different Teams" selection from New Game button', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Wait for modal and click Different Teams
      const differentTeamsButton = await screen.findByText("Different Teams");
      fireEvent.click(differentTeamsButton);

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams"', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Wait for modal and click Different Teams
      const differentTeamsButton = await screen.findByText("Different Teams");
      fireEvent.click(differentTeamsButton);

      // Verify that localStorage.setItem was called with initialNames (empty player names)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "names",
        JSON.stringify({
          t1p1Name: "",
          t1p2Name: "",
          t2p1Name: "",
          t2p2Name: "",
          team1Name: "Team 1",
          team2Name: "Team 2",
        }),
      );
    });
  });

  describe("when there is round history", () => {
    it("should show data warning first, then team selection when clicking New Game", async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [
          {
            team1BidsAndActuals: { p1Bid: "1", p2Bid: "2" },
            team2BidsAndActuals: { p1Bid: "3", p2Bid: "4" },
          } as unknown as Round,
        ],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Wait for the data warning
      expect(await screen.findByText("Are you sure?")).toBeInTheDocument();
      expect(
        screen.getByText("This will permanently delete your game data."),
      ).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Continue")).toBeInTheDocument();

      // Should not show the team question yet
      expect(
        screen.queryByText("Would you like to keep the same teams?"),
      ).not.toBeInTheDocument();

      // Click Continue to proceed to the next modal
      fireEvent.click(screen.getByText("Continue"));

      // Use findByText to wait for the next step in the flow
      expect(
        await screen.findByText("Would you like to keep the same teams?"),
      ).toBeInTheDocument();
      expect(screen.getByText("Different Teams")).toBeInTheDocument();
      expect(screen.getByText("Same Teams")).toBeInTheDocument();

      // The data warning should no longer be visible
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
      expect(
        screen.queryByText("This will permanently delete your game data."),
      ).not.toBeInTheDocument();
    });

    it('should handle "Cancel" from data warning', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [
          {
            team1BidsAndActuals: { p1Bid: "1", p2Bid: "2" },
            team2BidsAndActuals: { p1Bid: "3", p2Bid: "4" },
          } as unknown as Round,
        ],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Wait for the data warning and click Cancel
      const cancelButton = await screen.findByText("Cancel");
      fireEvent.click(cancelButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Would you like to keep the same teams?"),
        ).not.toBeInTheDocument();
      });
    });

    it("should handle complete flow: Continue -> Same Teams", async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [
          {
            team1BidsAndActuals: { p1Bid: "1", p2Bid: "2" },
            team2BidsAndActuals: { p1Bid: "3", p2Bid: "4" },
          } as unknown as Round,
        ],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Click Continue
      const continueButton = await screen.findByText("Continue");
      fireEvent.click(continueButton);

      // Click Same Teams
      const sameTeamsButton = await screen.findByText("Same Teams");
      fireEvent.click(sameTeamsButton);

      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
    });

    it("should handle complete flow: Continue -> Different Teams", async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [
          {
            team1BidsAndActuals: { p1Bid: "1", p2Bid: "2" },
            team2BidsAndActuals: { p1Bid: "3", p2Bid: "4" },
          } as unknown as Round,
        ],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Click Continue
      const continueButton = await screen.findByText("Continue");
      fireEvent.click(continueButton);

      // Click Different Teams
      const differentTeamsButton = await screen.findByText("Different Teams");
      fireEvent.click(differentTeamsButton);

      expect(contextValue.setRoundHistory).toHaveBeenCalledWith([]);
      expect(contextValue.resetCurrentRound).toHaveBeenCalled();
      expect(contextValue.setFirstDealerOrder).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should reset names to empty and navigate to home when selecting "Different Teams" with round history', async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [
          {
            team1BidsAndActuals: { p1Bid: "1", p2Bid: "2" },
            team2BidsAndActuals: { p1Bid: "3", p2Bid: "4" },
          } as unknown as Round,
        ],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Click Continue
      const continueButton = await screen.findByText("Continue");
      fireEvent.click(continueButton);

      // Click Different Teams
      const differentTeamsButton = await screen.findByText("Different Teams");
      fireEvent.click(differentTeamsButton);

      // Verify that localStorage.setItem was called with initialNames (empty player names)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "names",
        JSON.stringify({
          t1p1Name: "",
          t1p2Name: "",
          t2p1Name: "",
          t2p2Name: "",
          team1Name: "Team 1",
          team2Name: "Team 2",
        }),
      );
    });
  });

  describe("modal accessibility", () => {
    it("should close modal when clicking the close button", async () => {
      const contextValue = {
        ...mockContextValue,
        roundHistory: [
          {
            team1BidsAndActuals: { p1Bid: "1", p2Bid: "2" },
            team2BidsAndActuals: { p1Bid: "3", p2Bid: "4" },
          } as unknown as Round,
        ],
      };

      // Set up some input data first
      const mockNames = {
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      };
      (window.localStorage.getItem as Mock).mockReturnValue(
        JSON.stringify(mockNames),
      );

      renderWithProviders(<Header />, contextValue);

      // Click the New Game button
      fireEvent.click(screen.getByLabelText("Open Menu"));
      fireEvent.click(screen.getByText("New Game"));

      // Find and click the close button
      const closeButton = await screen.findByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Would you like to keep the same teams?"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
