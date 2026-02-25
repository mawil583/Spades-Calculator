import type { Round } from "../types";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import type { ReactNode } from "react";
import type { GlobalContextValue, Round as RoundType } from "../types";
import RoundComponent from "../components/game/Round";
import { GlobalContext } from "../helpers/context/GlobalContext";

const renderWithProviders = (
  component: ReactNode,
  contextValue: Partial<GlobalContextValue>,
) => {
  return render(
    <GlobalContext.Provider value={contextValue as GlobalContextValue}>
      {component}
    </GlobalContext.Provider>,
  );
};

describe("Round component - null safety", () => {
  beforeEach(() => {
    // minimal localStorage setup expected by Round
    localStorage.setItem(
      "names",
      JSON.stringify({ team1Name: "Team 1", team2Name: "Team 2" }),
    );
    localStorage.setItem("nilScoringRule", JSON.stringify("HELPS_TEAM_BID"));
  });

  it("does not crash when roundHistory contains null at target index", () => {
    const ctx = {
      currentRound: {
        team1BidsAndActuals: {
          p1Bid: "",
          p2Bid: "",
          p1Actual: "",
          p2Actual: "",
        },
        team2BidsAndActuals: {
          p1Bid: "",
          p2Bid: "",
          p1Actual: "",
          p2Actual: "",
        },
      } as unknown as Round,
      resetCurrentRound: vi.fn(),
      setRoundHistory: vi.fn(),
    };

    const { container } = renderWithProviders(
      <RoundComponent
        isCurrent={false}
        roundHistory={[null as unknown as RoundType]}
        roundIndex={0}
      />,
      ctx,
    );

    // Should render nothing for this invalid past round (no crash)
    expect(container.firstChild).toBeNull();
  });
});
