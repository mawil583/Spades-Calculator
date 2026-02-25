import type { Round } from "../types";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "../components/ui/provider";
import SpadesCalculator from "../pages/SpadesCalculator";
import { GlobalContext } from "../helpers/context/GlobalContext";

import { vi } from "vitest";
import type { ReactNode } from "react";
import type { GlobalContextValue } from "../types";

// Mock the math functions to control scoring
const { mockCalculateTeamScoreFromRoundHistory } = vi.hoisted(() => ({
  mockCalculateTeamScoreFromRoundHistory: vi.fn(),
}));

vi.mock("../helpers/math/spadesMath", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    calculateTeamScoreFromRoundHistory: mockCalculateTeamScoreFromRoundHistory,
  };
});

const renderWithProviders = (
  component: ReactNode,
  contextValue: Partial<GlobalContextValue>,
) => {
  return render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue as GlobalContextValue}>
          {component}
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );
};

describe("Independent Team Scoring", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockImplementation((key) => {
          if (key === "names")
            return JSON.stringify({
              team1Name: "Team Alpha",
              team2Name: "Team Beta",
            });
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    mockCalculateTeamScoreFromRoundHistory.mockReturnValue({
      teamScore: 0,
      teamBags: 0,
    });
  });

  describe("when only one team completes their actuals", () => {
    it("should update only that team's score when they complete their actuals", async () => {
      const mockSetRoundHistory = vi.fn();
      const mockResetCurrentRound = vi.fn();

      const contextValue = {
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "", // Team 2 hasn't finished
          },
        } as unknown as Round,
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          "team1BidsAndActuals.p1Bid",
          "team2BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
          "team2BidsAndActuals.p2Bid",
        ],
        setFirstDealerOrder: vi.fn(),
      };

      // Mock the score calculation to return different values
      mockCalculateTeamScoreFromRoundHistory.mockImplementation(
        (_, teamName) => {
          if (teamName === "Team Alpha") return { teamScore: 70, teamBags: 0 };
          return { teamScore: 0, teamBags: 0 };
        },
      );

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.findAllByText("Team Alpha")).resolves.toHaveLength(2); // Game Score + Team Total
      });

      // Team 1 should have their score updated (70 points)
      expect(screen.getByText("70")).toBeInTheDocument();

      // Team 2 should still show 0 since they haven't finished
      expect(screen.getByText("0")).toBeInTheDocument();

      // Round should not be completed yet since Team 2 hasn't finished
      expect(mockSetRoundHistory).not.toHaveBeenCalled();
      expect(mockResetCurrentRound).not.toHaveBeenCalled();
    });

    it("should not allow progression to next round until both teams complete actuals", async () => {
      const mockSetRoundHistory = vi.fn();
      const mockResetCurrentRound = vi.fn();

      const contextValue = {
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "", // Team 2 hasn't finished
          },
        } as unknown as Round,
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          "team1BidsAndActuals.p1Bid",
          "team2BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
          "team2BidsAndActuals.p2Bid",
        ],
        setFirstDealerOrder: vi.fn(),
      };

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.findAllByText("Team Alpha")).resolves.toHaveLength(2); // Game Score + Team Total
      });

      // Round should not be completed since Team 2 hasn't finished
      expect(mockSetRoundHistory).not.toHaveBeenCalled();
      expect(mockResetCurrentRound).not.toHaveBeenCalled();
    });
  });

  describe("when both teams complete their actuals", () => {
    it("should complete the round and allow progression when both teams finish", async () => {
      const mockSetRoundHistory = vi.fn();
      const mockResetCurrentRound = vi.fn();

      const contextValue = {
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "4",
          },
        } as unknown as Round,
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          "team1BidsAndActuals.p1Bid",
          "team2BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
          "team2BidsAndActuals.p2Bid",
        ],
        setFirstDealerOrder: vi.fn(),
      };

      // Mock the score calculation
      mockCalculateTeamScoreFromRoundHistory.mockImplementation((_, name) => {
        if (name === "Team Alpha") return { teamScore: 70, teamBags: 0 };
        if (name === "Team Beta") return { teamScore: 51, teamBags: 0 };
        return { teamScore: 0, teamBags: 0 };
      });

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.findAllByText("Team Alpha")).resolves.toHaveLength(2); // Game Score + Team Total
      });

      // Both teams should have their scores updated
      expect(screen.getByText("70")).toBeInTheDocument(); // Team 1
      expect(screen.getByText("51")).toBeInTheDocument(); // Team 2

      // Round should be completed since both teams finished
      expect(mockSetRoundHistory).toHaveBeenCalledWith([
        expect.objectContaining({
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "4",
          },
        } as unknown as Round),
      ]);
      expect(mockResetCurrentRound).toHaveBeenCalled();
    });
  });

  describe("score calculation timing", () => {
    it("should calculate team scores independently as each team completes", async () => {
      const mockSetRoundHistory = vi.fn();
      const mockResetCurrentRound = vi.fn();

      // Start with Team 1 complete, Team 2 incomplete
      const contextValue = {
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "", // Team 2 hasn't finished
          },
        } as unknown as Round,
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          "team1BidsAndActuals.p1Bid",
          "team2BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
          "team2BidsAndActuals.p2Bid",
        ],
        setFirstDealerOrder: vi.fn(),
      };

      // Mock initial score calculation
      mockCalculateTeamScoreFromRoundHistory.mockImplementation((_, name) => {
        if (name === "Team Alpha") return { teamScore: 70, teamBags: 0 };
        return { teamScore: 0, teamBags: 0 };
      });

      const { rerender } = renderWithProviders(
        <SpadesCalculator />,
        contextValue,
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.findAllByText("Team Alpha")).resolves.toHaveLength(2); // Game Score + Team Total
      });

      // Team 1 should have score, Team 2 should not
      expect(screen.getByText("70")).toBeInTheDocument(); // Team 1
      expect(screen.getByText("0")).toBeInTheDocument(); // Team 2

      // Now complete Team 2's actuals
      const updatedContextValue = {
        ...contextValue,
        currentRound: {
          ...contextValue.currentRound,
          team2BidsAndActuals: {
            ...contextValue.currentRound.team2BidsAndActuals,
            p2Actual: "4", // Team 2 now complete (2+4=6 actuals, total = 7+6=13)
          },
        } as unknown as Round,
      };

      // Mock updated score calculation
      mockCalculateTeamScoreFromRoundHistory.mockImplementation((_, name) => {
        if (name === "Team Alpha") return { teamScore: 70, teamBags: 0 };
        if (name === "Team Beta") return { teamScore: 51, teamBags: 0 };
        return { teamScore: 0, teamBags: 0 };
      });

      rerender(
        <BrowserRouter>
          <Provider>
            <GlobalContext.Provider
              value={updatedContextValue as unknown as GlobalContextValue}
            >
              <SpadesCalculator />
            </GlobalContext.Provider>
          </Provider>
        </BrowserRouter>,
      );

      // Wait for update
      await waitFor(() => {
        expect(screen.getByText("51")).toBeInTheDocument(); // Team 2 now has score
      });

      // Both teams should now have scores
      expect(screen.getByText("70")).toBeInTheDocument(); // Team 1
      expect(screen.getByText("51")).toBeInTheDocument(); // Team 2

      // Round should now be completed
      expect(mockSetRoundHistory).toHaveBeenCalled();
      expect(mockResetCurrentRound).toHaveBeenCalled();
    });
  });

  describe("validation still works", () => {
    it("should still validate that total actuals equal 13 before completing round", async () => {
      const mockSetRoundHistory = vi.fn();
      const mockResetCurrentRound = vi.fn();

      const contextValue = {
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "4", // This makes total 13, but Team 2 should still be able to complete
          },
        } as unknown as Round,
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          "team1BidsAndActuals.p1Bid",
          "team2BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
          "team2BidsAndActuals.p2Bid",
        ],
        setFirstDealerOrder: vi.fn(),
      };

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.findAllByText("Team Alpha")).resolves.toHaveLength(2); // Game Score + Team Total
      });

      // Round should be completed since total actuals = 13
      expect(mockSetRoundHistory).toHaveBeenCalled();
      expect(mockResetCurrentRound).toHaveBeenCalled();
    });

    it("should not complete round if total actuals do not equal 13", async () => {
      const mockSetRoundHistory = vi.fn();
      const mockResetCurrentRound = vi.fn();

      const contextValue = {
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
        currentRound: {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "4",
            p1Actual: "3",
            p2Actual: "4",
          },
          team2BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "5", // This makes total 14, which is invalid
          },
        } as unknown as Round,
        roundHistory: [],
        setRoundHistory: mockSetRoundHistory,
        resetCurrentRound: mockResetCurrentRound,
        firstDealerOrder: [
          "team1BidsAndActuals.p1Bid",
          "team2BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
          "team2BidsAndActuals.p2Bid",
        ],
        setFirstDealerOrder: vi.fn(),
      };

      renderWithProviders(<SpadesCalculator />, contextValue);

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.findAllByText("Team Alpha")).resolves.toHaveLength(2); // Game Score + Team Total
      });

      // Round should not be completed since total actuals ≠ 13
      expect(mockSetRoundHistory).not.toHaveBeenCalled();
      expect(mockResetCurrentRound).not.toHaveBeenCalled();
    });
  });
});
