import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RoundSummary from "../components/game/RoundSummary";
import { Provider } from "../components/ui/provider";

// Mock props
const mockStats = {
  startScore: 100,
  endScore: 130,
  startBags: 5,
  endBags: 6,
  pointsGained: 30,
  bagPenalty: 0,
  setPenalty: 0,
  nilPenalty: 0,
  blindNilPenalty: 0,
  netChange: 30,
};

const mockStats2 = {
  startScore: 200,
  endScore: 230,
  startBags: 1,
  endBags: 2,
  pointsGained: 31,
  bagPenalty: 0,
  setPenalty: 0,
  nilPenalty: 0,
  blindNilPenalty: 0,
  netChange: 31,
};

const mockPenaltyStats = {
  startScore: 100,
  endScore: 0,
  startBags: 9,
  endBags: 10, // triggered bag penalty
  pointsGained: 0,
  bagPenalty: 100,
  setPenalty: 0,
  nilPenalty: 0,
  blindNilPenalty: 0,
  netChange: -100,
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider>{children}</Provider>
);

describe("RoundSummary", () => {
  it("renders summary and toggle button", () => {
    render(
      <TestWrapper>
        <RoundSummary
          roundNumber={1}
          team1RoundScore={30}
          team2RoundScore={31}
          team1RoundBags={1}
          team2RoundBags={1}
          team1Stats={mockStats}
          team2Stats={mockStats2}
        />
      </TestWrapper>,
    );

    expect(screen.getAllByText(/Round 1 Score/i)).toHaveLength(2);
    // 30 appears twice: Round 1 Score and Round 1 Bags (if they were the same, but here score is 30, bags is 1)
    // Wait, let's just check for existence or use getAll as needed.
    // Team 1: Round 1 Score (30). Total 1.
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle details")).toBeInTheDocument();
  });

  it("toggles drawer and shows details", () => {
    render(
      <TestWrapper>
        <RoundSummary
          roundNumber={1}
          team1RoundScore={30}
          team2RoundScore={31}
          team1RoundBags={1}
          team2RoundBags={1}
          team1Stats={mockStats}
          team2Stats={mockStats2}
        />
      </TestWrapper>,
    );

    const button = screen.getByLabelText("Toggle details");
    fireEvent.click(button);

    // Verify Section Headers (now shared/single)
    expect(screen.getAllByText("Initial to Final")).toHaveLength(1);
    expect(screen.getAllByText("Net")).toHaveLength(3); // 1 Title + 2 Labels
    expect(screen.getAllByText("Bags")).toHaveLength(1);
    // Penalties section should NOT be present in this mock (no penalties)
    expect(screen.getAllByText("Game Score")).toHaveLength(2);
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("230")).toBeInTheDocument();

    expect(screen.queryByText("Penalties")).not.toBeInTheDocument();

    expect(screen.getAllByText("Points Gained")).toHaveLength(2);
    // 30 appears thrice: Round 1 Score, Points Gained, and Net for Team 1
    expect(screen.getAllByText("30")).toHaveLength(3);

    // Check for "Points Lost" label
    expect(screen.getAllByText("Points Lost")).toHaveLength(2);

    expect(screen.getAllByText("Net")).toHaveLength(3); // 1 Title + 2 Labels

    // Check for "Carryover" instead of "Bag Reset Carryover"
    expect(screen.queryByText(/Bag Reset Carryover:/)).not.toBeInTheDocument();

    // In normal stats, we DO expect "Total Bags"
    expect(screen.getAllByText(/Total Bags/)).toHaveLength(2);

    // Check for "Game Bags" and its value
    expect(screen.getAllByText("Game Bags")).toHaveLength(2);
    expect(screen.getAllByText("5")).toHaveLength(2); // Initial Bags and Game Bags start
    expect(screen.getAllByText("6")).toHaveLength(2); // Game Bags end and Total Bags

    // Check for "Initial Bags"
    expect(screen.getAllByText("Initial Bags")).toHaveLength(2);
    expect(screen.getAllByText(/Total Bags/)).toHaveLength(2);
  });

  it('shows penalties in red and uses "Bag Reset Carryover"', () => {
    render(
      <TestWrapper>
        <RoundSummary
          roundNumber={1}
          team1RoundScore={-100}
          team2RoundScore={30}
          team1RoundBags={1}
          team2RoundBags={1}
          team1Stats={mockPenaltyStats}
          team2Stats={mockStats2}
        />
      </TestWrapper>,
    );

    const button = screen.getByLabelText("Toggle details");
    fireEvent.click(button);

    // Look for penalty label and value
    expect(screen.getByText("Bag Penalty")).toBeInTheDocument();
    // Look for penalty label and value
    expect(screen.getByText("Bag Penalty")).toBeInTheDocument();
    // -100 should be present thrice (once in Round Score, once in Bag Penalty, once in Net)
    expect(screen.getAllByText("-100")).toHaveLength(3);

    // Check for "Points Lost" label
    expect(screen.getAllByText("Points Lost")).toHaveLength(2);
    // The value 100 should be present (One in Bag Penalty, one in Points Lost)
    expect(screen.getAllByText("100")).toHaveLength(2);

    expect(screen.getAllByText("Net")).toHaveLength(3); // 1 Title + 2 Labels

    // Since mockPenaltyStats has bagPenalty: 100, we expect "Carryover"
    expect(screen.getByText(/Carryover/)).toBeInTheDocument();

    // Check for "Game Bags"
    expect(screen.getAllByText("Game Bags")).toHaveLength(2);
    // 9 appears once in Initial Bags, once in Game Bags start for Team 1
    expect(screen.getAllByText("9")).toHaveLength(2);
    // 10 appears once in Game Bags end
    expect(screen.getByText("10")).toBeInTheDocument();
    // And once in Carryover
    expect(screen.getByText(/Carryover: 10/)).toBeInTheDocument();

    // Check for "Initial Bags"
    expect(screen.getAllByText("Initial Bags")).toHaveLength(2);

    // Team 2 should have "None" in penalties
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it('shows "Bags reset to 0" when bags are cleared', () => {
    const mockResetStats = {
      ...mockPenaltyStats,
      endBags: 0, // Reset occurred, so end bags is 0
    };

    render(
      <TestWrapper>
        <RoundSummary
          roundNumber={1}
          team1RoundScore={-100}
          team2RoundScore={30}
          team1RoundBags={1}
          team2RoundBags={1}
          team1Stats={mockResetStats}
          team2Stats={mockStats2}
        />
      </TestWrapper>,
    );

    const button = screen.getByLabelText("Toggle details");
    fireEvent.click(button);

    expect(screen.getByText("Bag Penalty")).toBeInTheDocument();
    expect(screen.getByText("Reset to 0")).toBeInTheDocument();
    expect(screen.queryByText(/Carryover/)).not.toBeInTheDocument();

    // Team 2 should have "None" in penalties
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("shows Nil and Blind Nil penalties in red", () => {
    const mockNilStats = {
      ...mockStats,
      nilPenalty: 100,
      blindNilPenalty: 0,
      setPenalty: 0,
      bagPenalty: 0,
      pointsGained: 40, // e.g. Made Board 4 (+40), Failed Nil (-100). Net -60.
      netChange: -60,
    };

    const mockBlindNilStats = {
      ...mockStats2,
      nilPenalty: 0,
      blindNilPenalty: 200,
      setPenalty: 30,
      bagPenalty: 0,
      pointsGained: 0,
      netChange: -230,
    };

    render(
      <TestWrapper>
        <RoundSummary
          roundNumber={1}
          team1RoundScore={-60}
          team2RoundScore={-230}
          team1RoundBags={0}
          team2RoundBags={0}
          team1Stats={mockNilStats}
          team2Stats={mockBlindNilStats}
        />
      </TestWrapper>,
    );

    const button = screen.getByLabelText("Toggle details");
    fireEvent.click(button);

    expect(screen.getByText("Nil Penalty")).toBeInTheDocument();
    expect(screen.getByText("Blind Nil Penalty")).toBeInTheDocument();
    expect(screen.getByText("Set Penalty")).toBeInTheDocument();
    // Nil Penalty -100 (once)
    expect(screen.getByText("-100")).toBeInTheDocument();
    // Blind Nil -200 (once)
    expect(screen.getByText("-200")).toBeInTheDocument();
    // Set Penalty -30 (once)
    expect(screen.getByText("-30")).toBeInTheDocument();
    // Net -230 (twice: Round Score and Net)
    expect(screen.getAllByText("-230")).toHaveLength(2);
    // Net -60 (twice: Round Score and Net)
    expect(screen.getAllByText("-60")).toHaveLength(2);
  });
});
