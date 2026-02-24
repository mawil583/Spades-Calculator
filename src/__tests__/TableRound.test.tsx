import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "../components/ui/provider";
import { GlobalContext } from "../helpers/context/GlobalContext";
import type { GlobalContextValue, Round } from "../types";
import TableRound from "../components/game/TableRound";
import { vi } from "vitest";

// Explicitly mock the hooks using vi.mock
vi.mock("../helpers/utils/hooks", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useIndependentTeamScoring: vi.fn(),
    useGameScores: vi.fn(() => ({
      team1Score: { teamScore: 100, teamBags: 2 },
      team2Score: { teamScore: 80, teamBags: 5 },
    })),
    useValidateActuals: vi.fn(),
  };
});

const mockNames = {
  team1Name: "Team 1",
  team2Name: "Team 2",
  t1p1Name: "Player 1",
  t1p2Name: "Player 2",
  t2p1Name: "Player 3",
  t2p2Name: "Player 4",
};

const renderWithProviders = (contextValue: Partial<GlobalContextValue>) => {
  return render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider value={contextValue as GlobalContextValue}>
          <TableRound isCurrent={true} roundHistory={[]} roundIndex={0} />
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );
};

describe("TableRound Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("names", JSON.stringify(mockNames));
    vi.clearAllMocks();
  });

  const getBaseContext = () => ({
    currentRound: {
      team1BidsAndActuals: { p1Bid: "", p2Bid: "", p1Actual: "", p2Actual: "" },
      team2BidsAndActuals: { p1Bid: "", p2Bid: "", p1Actual: "", p2Actual: "" },
    },
    resetCurrentRound: vi.fn(),
    setRoundHistory: vi.fn(),
  });

  it("renders all 4 player sections with correct names", () => {
    renderWithProviders(getBaseContext());
    expect(screen.getByText(/Player 1/)).toBeInTheDocument();
    expect(screen.getByText(/Player 2/)).toBeInTheDocument();
    expect(screen.getByText(/Player 3/)).toBeInTheDocument();
    expect(screen.getByText(/Player 4/)).toBeInTheDocument();
  });

  it("renders game scores for both teams", () => {
    renderWithProviders(getBaseContext());
    // Expect multiple because it appears in both GameScore and TeamTotal
    expect(screen.getAllByText(/Team 1/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/^Bid$/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/2 bags/)).toBeInTheDocument();
  });

  it('shows "Bid" buttons when bids are not entered', () => {
    renderWithProviders(getBaseContext());
    const bidButtons = screen.getAllByTestId("bidButton");
    expect(bidButtons.length).toBeGreaterThanOrEqual(4);
  });

  it('shows "Actual" buttons when all bids are entered', async () => {
    const context = getBaseContext();
    context.currentRound.team1BidsAndActuals.p1Bid = "3";
    context.currentRound.team1BidsAndActuals.p2Bid = "4";
    context.currentRound.team2BidsAndActuals.p1Bid = "2";
    context.currentRound.team2BidsAndActuals.p2Bid = "3";

    renderWithProviders(context);

    await waitFor(() => {
      expect(
        screen.queryAllByTestId("actualButton").length,
      ).toBeGreaterThanOrEqual(4);
      expect(screen.getByText(/Enter Actuals/i)).toBeInTheDocument();
    });
  });

  it("shows bid pills in actuals phase", async () => {
    const context = getBaseContext();
    context.currentRound.team1BidsAndActuals.p1Bid = "3";
    context.currentRound.team1BidsAndActuals.p2Bid = "4";
    context.currentRound.team2BidsAndActuals.p1Bid = "2";
    context.currentRound.team2BidsAndActuals.p2Bid = "3";

    renderWithProviders(context);

    await waitFor(() => {
      // Use getAllBy and check length since multiple players might have same bid
      expect(screen.getAllByText(/Bid 3/i).length).toBe(2); // Player 1 and Player 4
      expect(screen.getAllByText(/Bid 4/i).length).toBe(1); // Player 2
      expect(screen.getAllByText(/Bid 2/i).length).toBe(1); // Player 3
    });
  });

  it("shows unclaimed remaining bids in center", () => {
    const context = getBaseContext();
    context.currentRound.team1BidsAndActuals.p1Bid = "3";
    context.currentRound.team1BidsAndActuals.p2Bid = "4";
    context.currentRound.team2BidsAndActuals.p1Bid = "2";
    context.currentRound.team2BidsAndActuals.p2Bid = "3";

    renderWithProviders(context);
    expect(screen.getByText(/Unclaimed: 1/)).toBeInTheDocument();
  });

  it("opens InputModal when clicking a bid/actual button", async () => {
    renderWithProviders(getBaseContext());
    const bidButtons = screen.getAllByTestId("bidButton");
    fireEvent.click(bidButtons[0]);

    // Increased robustness for modal detection
    await waitFor(
      async () => {
        const modal = screen.getByRole("dialog", { hidden: true });
        expect(modal).toBeInTheDocument();
        expect(screen.getByText(/Select Player 1's Bid/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("displays asterisks for auto-generated actuals", () => {
    const context = getBaseContext();
    context.currentRound.team1BidsAndActuals.p1Bid = "3";
    context.currentRound.team1BidsAndActuals.p2Bid = "4";
    context.currentRound.team2BidsAndActuals.p1Bid = "2";
    context.currentRound.team2BidsAndActuals.p2Bid = "3";

    // Team 1 has actuals entered
    context.currentRound.team1BidsAndActuals.p1Actual = "3";
    context.currentRound.team1BidsAndActuals.p2Actual = "4";
    (context.currentRound as Round).autoGeneratedActuals = {
      team1P1: true,
      team1P2: false,
      team2P1: false,
      team2P2: false,
    };

    renderWithProviders(context);
    expect(screen.getAllByText(/Bid:Made/i).length).toBe(1); // Only Team 1
    expect(screen.getAllByText(/^Bid$/i).length).toBe(1); // Team 2 still shows "Bid"
  });
});
