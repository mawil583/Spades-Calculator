import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "../components/ui/provider";
import { MemoryRouter } from "react-router-dom";
import { GlobalContext } from "../helpers/context/GlobalContext";
import NameForm from "../components/forms/NameForm";
import { initialNames } from "../helpers/utils/constants"; // Should contain 'Team 1', 'Team 2'
import { vi } from "vitest";
import React from "react";
import type { GlobalContextValue, Round } from "../types";

// Mock hooks
const { mockUseLocalStorage } = vi.hoisted(() => {
  return { mockUseLocalStorage: vi.fn() };
});

vi.mock("../helpers/utils/hooks", () => ({
  useLocalStorage: mockUseLocalStorage,
}));

// Mock WarningModal to simulate trigger
vi.mock("../components/modals/WarningModal", () => ({
  default: ({
    isOpen,
    resetNames,
  }: {
    isOpen: boolean;
    resetNames?: (names: typeof initialNames) => void;
  }) => {
    return isOpen ? (
      <div data-testid="warning-modal">
        <button
          data-testid="trigger-reset"
          onClick={() => {
            if (resetNames) {
              // Simulate what WarningModal does: pass initialNames
              resetNames(initialNames);
            }
          }}
        >
          Reset
        </button>
      </div>
    ) : null;
  },
}));

vi.mock(
  "react-router-dom",
  async (importOriginal: () => Promise<typeof import("react-router-dom")>) => {
    const actual = await importOriginal();
    // This mock is likely intended to mock specific hooks or components from react-router-dom
    // The `isNotDefaultValue` function here seems to be a copy-paste error from spadesMath mock.
    // If a specific mock for react-router-dom is needed, it should be defined here.
    // For now, we'll just return the actual module to avoid breaking existing functionality
    // unless a specific mock for react-router-dom is explicitly required by the tests.
    return {
      ...actual,
    };
  },
);

// Mock math helpers
vi.mock(
  "../helpers/math/spadesMath",
  async (
    importOriginal: () => Promise<typeof import("../helpers/math/spadesMath")>,
  ) => {
    const actual = await importOriginal();
    return {
      ...actual,
      isNotDefaultValue: vi.fn(
        (val) => val !== "" && val !== undefined && val !== null,
      ),
    };
  },
);

const renderWithProviders = (
  component: React.ReactNode,
  contextValue: Partial<GlobalContextValue>,
) => {
  return render(
    <Provider>
      <GlobalContext.Provider value={contextValue as GlobalContextValue}>
        <MemoryRouter>{component}</MemoryRouter>
      </GlobalContext.Provider>
    </Provider>,
  );
};

describe("Team Name Reset Verification", () => {
  const defaultContext: Partial<GlobalContextValue> = {
    roundHistory: [
      {
        team1BidsAndActuals: {
          p1Bid: "1",
          p2Bid: "2",
          p1Actual: "3",
          p2Actual: "4",
        },
        team2BidsAndActuals: {
          p1Bid: "1",
          p2Bid: "2",
          p1Actual: "3",
          p2Actual: "4",
        },
      } as unknown as Round as unknown as Round,
    ],
    currentRound: undefined,
  };

  it('should reset team names to "Team 1" and "Team 2" when Different Teams is selected', async () => {
    const setNames = vi.fn();
    // Start with CUSTOM team names
    const currentNames = {
      team1Name: "Alpha Squad",
      team2Name: "Omega Squad",
      t1p1Name: "Alice",
      t1p2Name: "Bob",
      t2p1Name: "Charlie",
      t2p2Name: "Dave",
    };

    mockUseLocalStorage.mockReturnValue([currentNames, setNames]);

    renderWithProviders(<NameForm />, defaultContext);

    // Initial state check (optional, finding input values might be tricky with Editable/Hidden,
    // Open Warning Modal
    fireEvent.click(screen.getByText("New Game"));
    await waitFor(() => {
      expect(screen.getByTestId("warning-modal")).toBeInTheDocument();
    });

    // Trigger Reset
    const triggerBtn = screen.getByTestId("trigger-reset");
    fireEvent.click(triggerBtn);

    // Verify setNames was called with initialNames, which should contain "Team 1" and "Team 2"
    expect(setNames).toHaveBeenCalledWith(
      expect.objectContaining({
        team1Name: "Team 1",
        team2Name: "Team 2",
        t1p1Name: "",
        t1p2Name: "",
        t2p1Name: "",
        t2p2Name: "",
      }),
    );
  });
});
