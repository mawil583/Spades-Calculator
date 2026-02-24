import { vi } from "vitest";

import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import { Provider } from "../components/ui/provider";
import DealerTag from "../components/ui/DealerTag";
import { GlobalContext } from "../helpers/context/GlobalContext";
import type { ReactNode } from "react";
import type { GlobalContextValue } from "../types";

// Mock the spadesMath functions
vi.mock("../helpers/math/spadesMath", () => ({
  getDealerIdHistory: vi.fn(() => []),
  getCurrentDealerId: vi.fn(() => "team1BidsAndActuals.p1Bid"),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() =>
    JSON.stringify({
      t1p1Name: "Player 1",
      t1p2Name: "Player 2",
      t2p1Name: "Player 3",
      t2p2Name: "Player 4",
    }),
  ),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockContextValue = {
  firstDealerOrder: [
    "team1BidsAndActuals.p1Bid",
    "team2BidsAndActuals.p1Bid",
    "team1BidsAndActuals.p2Bid",
    "team2BidsAndActuals.p2Bid",
  ],
  currentRound: {},
  setDealerOverride: vi.fn(),
};

const renderWithProviders = (component: ReactNode) => {
  return render(
    <Provider>
      <GlobalContext.Provider
        value={mockContextValue as unknown as GlobalContextValue}
      >
        {component}
      </GlobalContext.Provider>
    </Provider>,
  );
};

describe("DealerTag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Unit Tests", () => {
    it("should render dealer badge when player is dealer", () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />,
      );

      expect(screen.getByText("D")).toBeInTheDocument();
      expect(screen.getByTestId("dealerBadge")).toBeInTheDocument();
    });

    it("should open dealer selection modal when clicked on current round", async () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />,
      );

      const dealerBadge = screen.getByTestId("dealerBadge");
      fireEvent.click(dealerBadge);

      expect(await screen.findByText("Select the dealer")).toBeInTheDocument();
      expect(
        await screen.findByTestId("dealerSelectionModal"),
      ).toBeInTheDocument();
    });

    it("should not open modal when clicked on non-current round", async () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={false}
          roundHistory={[]}
        />,
      );

      const dealerBadge = screen.getByTestId("dealerBadge");
      fireEvent.click(dealerBadge);

      expect(screen.queryByText("Select the dealer")).not.toBeInTheDocument();
    });

    it("should call setDealerOverride when a dealer option is selected", async () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />,
      );

      const dealerBadge = screen.getByTestId("dealerBadge");
      fireEvent.click(dealerBadge);

      const dealerOption = await screen.findByText("Player 1");
      fireEvent.click(dealerOption);

      expect(mockContextValue.setDealerOverride).toHaveBeenCalledWith(
        "team1BidsAndActuals.p1Bid",
      );
    });

    it("should stop propagation when clicked", () => {
      renderWithProviders(
        <DealerTag
          id="team1BidsAndActuals.p1Bid"
          index={0}
          isCurrent={true}
          roundHistory={[]}
        />,
      );

      const dealerBadge = screen.getByTestId("dealerBadge");
      const evt = createEvent.click(dealerBadge);

      evt.stopPropagation = vi.fn();
      fireEvent(dealerBadge, evt);

      expect(evt.stopPropagation).toHaveBeenCalled();
    });
  });
});
