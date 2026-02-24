import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "../../components/ui/provider";
import DealerSelectionModal from "../../components/modals/DealerSelectionModal";
import { vi } from "vitest";

// We need to use real timers or wait because focus might be async in some implementations,
// but usually Chakra handles it via Effects.

describe("DealerSelectionModal Focus Behavior", () => {
  it("should NOT focus the close button initially", async () => {
    const dealerOptions = [
      { id: "p1", label: "Player 1" },
      { id: "p2", label: "Player 2" },
    ];

    render(
      <Provider>
        <DealerSelectionModal
          isOpen={true}
          onClose={vi.fn()}
          dealerOptions={dealerOptions}
          onSelectDealer={vi.fn()}
        />
      </Provider>,
    );

    // Wait for modal to be visible
    const p1Button = await screen.findByText("Player 1");
    const p2Button = await screen.findByText("Player 2");
    const closeButton = await screen.findByLabelText("Close");
    const cancelButton = await screen.findByText("Cancel");

    // Assert that NO button is the active element
    // We probably want focus to be on a container or header
    await waitFor(() => {
      expect(document.activeElement).not.toBe(p1Button);
      expect(document.activeElement).not.toBe(p2Button);
      expect(document.activeElement).not.toBe(closeButton);
      expect(document.activeElement).not.toBe(cancelButton);
    });
  });
});
