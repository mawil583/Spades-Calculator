import type { Round } from "../../types";
import { vi } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "../../components/ui/provider";
import SpadesCalculator from "../../pages/SpadesCalculator";
import { GlobalContext } from "../../helpers/context/GlobalContext";
import type { GlobalContextValue } from "../../types";

vi.mock("../../helpers/math/spadesMath", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    addInputs: vi.fn((a, b) => (a || 0) + (b || 0)),
    isNotDefaultValue: vi.fn((value) => value !== ""),
    calculateTeamScore: vi.fn(() => 50),
  };
});

// Mock the context values
const mockContextValue = {
  resetCurrentRound: vi.fn(),
  setRoundHistory: vi.fn(),
  setFirstDealerOrder: vi.fn(),
  firstDealerOrder: ["player1", "player2", "player3", "player4"],
  roundHistory: [],
  currentRound: {
    team1BidsAndActuals: { p1Bid: "", p2Bid: "", p1Actual: "", p2Actual: "" },
    team2BidsAndActuals: { p1Bid: "", p2Bid: "", p1Actual: "", p2Actual: "" },
  } as unknown as Round,
};

const renderApp = () => {
  return render(
    <BrowserRouter>
      <Provider>
        <GlobalContext.Provider
          value={mockContextValue as unknown as GlobalContextValue}
        >
          <SpadesCalculator />
        </GlobalContext.Provider>
      </Provider>
    </BrowserRouter>,
  );
};

describe("UI Mode Toggle Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();

    // Set up names so the app renders the main content
    window.localStorage.setItem(
      "names",
      JSON.stringify({
        t1p1Name: "Alice",
        t1p2Name: "Bob",
        t2p1Name: "Charlie",
        t2p2Name: "Diana",
        team1Name: "Team Alpha",
        team2Name: "Team Beta",
      }),
    );
  });

  it("should immediately toggle UI mode without refresh", async () => {
    renderApp();

    // 1. Verify default state (Classic Layout) -> GameScore IS present
    expect(screen.getByTestId("game-score-container")).toBeInTheDocument();

    // 2. Open Menu
    const menuButton = screen.getByLabelText("Open Menu");
    fireEvent.click(menuButton);

    // 3. Open Settings
    const settingsButton = screen.getByText("Settings");
    fireEvent.click(settingsButton);

    // 4. Verify Settings Modal is open
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();

    // 5. Find and toggle the switch
    // The switch text says "Classic Layout" or "Table Layout" depending on state
    // Initially it should say "Classic Layout"
    expect(screen.getByText("Classic Layout")).toBeInTheDocument();

    // Chakra UI Switch usually renders as a checkbox input
    const toggleSwitch = screen.getByRole("checkbox");

    // Toggle ON (Switch to Table Layout)
    fireEvent.click(toggleSwitch);

    // Verify text changed to "Table Layout"
    expect(await screen.findByText("Table Layout")).toBeInTheDocument();

    // 6. Close Modal
    // We don't need to close it to verify the background change, but let's check it's gone.
    expect(
      screen.queryByTestId("game-score-container"),
    ).not.toBeInTheDocument();

    // 7. Toggle OFF (Switch back to Classic Layout)
    fireEvent.click(toggleSwitch);

    // Verify text changed back
    expect(await screen.findByText("Classic Layout")).toBeInTheDocument();

    // 8. Verify GameScore is back
    expect(screen.getByTestId("game-score-container")).toBeInTheDocument();
  });
});
