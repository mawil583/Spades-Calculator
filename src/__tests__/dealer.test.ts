import {
  getCurrentDealerId,
} from "../helpers/math/spadesMath";
import { rotateArr } from "../helpers/utils/helperFunctions";
import type { Round } from "../types";
import { initialFirstDealerOrder as appInitialFirstDealerOrder } from "../helpers/utils/constants";
import { expect } from "chai";

describe("Dealer Functionality", () => {
  describe("rotateArr", () => {
    test("returns a new array with the order rotated", () => {
      const initialOrder = ["p1", "p2", "p3", "p4"];
      const rotatedOnce = rotateArr(initialOrder);
      expect(rotatedOnce).deep.equals(["p2", "p3", "p4", "p1"]);

      const rotatedTwice = rotateArr(rotatedOnce);
      expect(rotatedTwice).deep.equals(["p3", "p4", "p1", "p2"]);

      // Check if the original array is not mutated
      expect(initialOrder).deep.equals(["p1", "p2", "p3", "p4"]);
    });

    test("handles empty array", () => {
      const emptyOrder: string[] = [];
      const rotatedEmpty = rotateArr(emptyOrder);
      expect(rotatedEmpty).deep.equals([]);
    });

    test("handles single element array", () => {
      const singleElementOrder = ["p1"];
      const rotatedSingle = rotateArr(singleElementOrder);
      expect(rotatedSingle).deep.equals(["p1"]);
    });
  });

  describe("Dealer Override Functionality", () => {
    const mockFirstDealerOrder = [
      "team1BidsAndActuals.p1Bid",
      "team1BidsAndActuals.p2Bid",
      "team2BidsAndActuals.p1Bid",
      "team2BidsAndActuals.p2Bid",
    ];

    test("dealer override for current round should not affect past rounds", () => {
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "2",
            p1Actual: "3",
            p2Actual: "2",
          },
          team2BidsAndActuals: {
            p1Bid: "4",
            p2Bid: "4",
            p1Actual: "4",
            p2Actual: "4",
          },
          dealerOverride: null, // No override for round 0
        },
        {
          team1BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "3",
          },
          team2BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "5",
            p1Actual: "3",
            p2Actual: "5",
          },
          dealerOverride: null, // No override for round 1
        },
      ];

      // Test dealer calculation for past rounds (should use normal rotation)
      const dealerForRound0 = getCurrentDealerId({
        dealerIdHistory: [
          "team1BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
        ],
        index: 0,
        isCurrent: false,
        firstDealerOrder: mockFirstDealerOrder,
        roundHistory,
      });

      const dealerForRound1 = getCurrentDealerId({
        dealerIdHistory: [
          "team1BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
        ],
        index: 1,
        isCurrent: false,
        firstDealerOrder: mockFirstDealerOrder,
        roundHistory,
      });

      // Round 0 should have the first dealer
      expect(dealerForRound0).to.equal("team1BidsAndActuals.p1Bid");
      // Round 1 should have the second dealer
      expect(dealerForRound1).to.equal("team1BidsAndActuals.p2Bid");
    });

    test("dealer override for current round should be respected", () => {
      const currentRoundWithOverride = {
        dealerOverride: "team2BidsAndActuals.p1Bid", // Override to Charlie
      };

      const dealerForCurrentRound = getCurrentDealerId({
        dealerIdHistory: [
          "team1BidsAndActuals.p1Bid",
          "team1BidsAndActuals.p2Bid",
        ],
        index: 2,
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
        dealerOverride: currentRoundWithOverride.dealerOverride,
      });

      // Current round should use the override
      expect(dealerForCurrentRound).to.equal("team2BidsAndActuals.p1Bid");
    });

    test("dealer override in round history should be respected for past rounds", () => {
      const roundHistoryWithOverride = [
        {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "2",
            p1Actual: "3",
            p2Actual: "2",
          },
          team2BidsAndActuals: {
            p1Bid: "4",
            p2Bid: "4",
            p1Actual: "4",
            p2Actual: "4",
          },
          dealerOverride: "team2BidsAndActuals.p2Bid", // Override to David for round 0
        },
      ];

      const dealerForRound0 = getCurrentDealerId({
        dealerIdHistory: ["team1BidsAndActuals.p1Bid"],
        index: 0,
        isCurrent: false,
        firstDealerOrder: mockFirstDealerOrder,
        roundHistory: roundHistoryWithOverride,
      });

      // Round 0 should use the override from history
      expect(dealerForRound0).to.equal("team2BidsAndActuals.p2Bid");
    });

    test("editing a past round should not affect dealer override of other rounds", async () => {
      // Import the updateInput function to test it directly
      const { updateInput } = await import("../helpers/utils/helperFunctions");

      // Create a round history with different dealer overrides
      const roundHistory = [
        {
          team1BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "2",
            p1Actual: "3",
            p2Actual: "2",
          },
          team2BidsAndActuals: {
            p1Bid: "4",
            p2Bid: "4",
            p1Actual: "4",
            p2Actual: "4",
          },
          dealerOverride: "team1BidsAndActuals.p2Bid", // Round 0 has Bob as dealer
        },
        {
          team1BidsAndActuals: {
            p1Bid: "2",
            p2Bid: "3",
            p1Actual: "2",
            p2Actual: "3",
          },
          team2BidsAndActuals: {
            p1Bid: "3",
            p2Bid: "5",
            p1Actual: "3",
            p2Actual: "5",
          },
          dealerOverride: "team2BidsAndActuals.p1Bid", // Round 1 has Charlie as dealer
        },
      ];

      // Edit round 0 (change a bid)
      const updatedRound0 = updateInput({
        input: "5",
        currentRound: roundHistory[0],
        fieldToUpdate: "team1BidsAndActuals.p1Bid",
      });

      // Verify that the dealer override is preserved in round 0
      expect(updatedRound0.dealerOverride).to.equal(
        "team1BidsAndActuals.p2Bid",
      );

      // Verify that round 1's dealer override is not affected
      expect(roundHistory[1].dealerOverride).to.equal(
        "team2BidsAndActuals.p1Bid",
      );

      // Edit round 1 (change an actual)
      const updatedRound1 = updateInput({
        input: "6",
        currentRound: roundHistory[1],
        fieldToUpdate: "team2BidsAndActuals.p2Actual",
      });

      // Verify that the dealer override is preserved in round 1
      expect(updatedRound1.dealerOverride).to.equal(
        "team2BidsAndActuals.p1Bid",
      );

      // Verify that round 0's dealer override is not affected
      expect(roundHistory[0].dealerOverride).to.equal(
        "team1BidsAndActuals.p2Bid",
      );
    });

    test("updateInput should preserve dealerOverride when it is null", async () => {
      const { updateInput } = await import("../helpers/utils/helperFunctions");

      const roundWithNullOverride = {
        team1BidsAndActuals: {
          p1Bid: "3",
          p2Bid: "2",
          p1Actual: "3",
          p2Actual: "2",
        },
        team2BidsAndActuals: {
          p1Bid: "4",
          p2Bid: "4",
          p1Actual: "4",
          p2Actual: "4",
        },
        dealerOverride: null,
      };

      const updatedRound = updateInput({
        input: "5",
        currentRound: roundWithNullOverride,
        fieldToUpdate: "team1BidsAndActuals.p1Bid",
      });

      // Verify that null dealerOverride is preserved
      expect(updatedRound.dealerOverride).to.equal(null);
    });

    test("updateInput should handle rounds without dealerOverride property", async () => {
      const { updateInput } = await import("../helpers/utils/helperFunctions");

      const roundWithoutOverride = {
        team1BidsAndActuals: {
          p1Bid: "3",
          p2Bid: "2",
          p1Actual: "3",
          p2Actual: "2",
        },
        team2BidsAndActuals: {
          p1Bid: "4",
          p2Bid: "4",
          p1Actual: "4",
          p2Actual: "4",
        },
        // No dealerOverride property
      };

      const updatedRound = updateInput({
        input: "5",
        currentRound: roundWithoutOverride,
        fieldToUpdate: "team1BidsAndActuals.p1Bid",
      });

      // Verify that the round is updated correctly without adding dealerOverride
      expect(updatedRound.team1BidsAndActuals.p1Bid).to.equal("5");
      expect(updatedRound).to.not.have.property("dealerOverride");
    });
  });

  describe("Dealer Calculation Logic", () => {
    const mockFirstDealerOrder = [
      "team1BidsAndActuals.p1Bid",
      "team2BidsAndActuals.p1Bid",
      "team1BidsAndActuals.p2Bid",
      "team2BidsAndActuals.p2Bid",
    ];

    test("initial dealer should be t1p1 (team1BidsAndActuals.p1Bid)", () => {
      // Test for current round with no history
      const initialDealer = getCurrentDealerId({
        dealerIdHistory: [],
        index: 0,
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
      });

      // The initial dealer should be the first player in the order: t1p1
      expect(initialDealer).to.equal("team1BidsAndActuals.p1Bid");
    });

    test("dealer calculation bug: should not use index directly when dealerIdHistory.length > 0", () => {
      // Simulate having 1 round in history (dealerIdHistory.length = 1)
      const dealerIdHistory = ["team1BidsAndActuals.p1Bid"];

      // For the current round (index 1), the dealer should be the second player: t2p1
      const currentDealer = getCurrentDealerId({
        dealerIdHistory,
        index: 1,
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
      });

      // The dealer should be t2p1, not t1p2 (which would be the case if using index directly)
      expect(currentDealer).to.equal("team2BidsAndActuals.p1Bid");
    });

    test("getDealerIdHistory should calculate dealer history correctly", async () => {
      const { getDealerIdHistory } = await import("../helpers/math/spadesMath");

      // Simulate 2 rounds in history
      const roundHistory: Round[] = [
        {
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
        },
        {
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
        },
      ];

      const dealerIdHistory = getDealerIdHistory(
        roundHistory,
        mockFirstDealerOrder,
      );

      // Round 0 should have t1p1 as dealer
      expect(dealerIdHistory[0]).to.equal("team1BidsAndActuals.p1Bid");
      // Round 1 should have t2p1 as dealer
      expect(dealerIdHistory[1]).to.equal("team2BidsAndActuals.p1Bid");
    });

    test("fresh game should show dealer tag on t1p1, not t1p2", () => {
      // Fresh game with no round history
      const dealerIdHistory: string[] = [];

      // Check dealer for each player position
      const t1p1Dealer = getCurrentDealerId({
        dealerIdHistory,
        index: 0,
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
      });

      const t1p2Dealer = getCurrentDealerId({
        dealerIdHistory,
        index: 2, // t1p2 is at index 2 in the UI
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
      });

      // t1p1 should be the dealer
      expect(t1p1Dealer).to.equal("team1BidsAndActuals.p1Bid");
      // t1p2 should NOT be the dealer
      expect(t1p2Dealer).to.not.equal("team1BidsAndActuals.p2Bid");
    });

    test("after 2 rounds, dealer should be t1p2", () => {
      // After 2 rounds, dealer should have rotated to t1p2
      const dealerIdHistory = [
        "team1BidsAndActuals.p1Bid", // Round 0
        "team2BidsAndActuals.p1Bid", // Round 1
      ];

      // For the current round (index 2), the dealer should be t1p2
      const currentDealer = getCurrentDealerId({
        dealerIdHistory,
        index: 2,
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
      });

      // The dealer should be t1p2
      expect(currentDealer).to.equal("team1BidsAndActuals.p2Bid");
    });

    test("bug demonstration: dealer calculation is wrong when dealerIdHistory.length > 0 but < 4", () => {
      // After 1 round, dealer should have rotated to t2p1
      const dealerIdHistory = [
        "team1BidsAndActuals.p1Bid", // Round 0
      ];

      // For the current round (index 1), the dealer should be t2p1
      const currentDealer = getCurrentDealerId({
        dealerIdHistory,
        index: 1,
        isCurrent: true,
        firstDealerOrder: mockFirstDealerOrder,
      });

      // The dealer should be t2p1, but the bug returns t1p2 (clonedfirstDealerOrder[1])
      expect(currentDealer).to.equal("team2BidsAndActuals.p1Bid");

      // Let's also check what the bug actually returns
      console.log("Current dealer:", currentDealer);
      console.log("Expected: team2BidsAndActuals.p1Bid");
      console.log(
        "Bug returns: team1BidsAndActuals.p2Bid (clonedfirstDealerOrder[1])",
      );
    });

    test("comprehensive dealer rotation test", () => {
      // Test all possible dealer rotations
      const testCases = [
        {
          rounds: 0,
          expectedDealer: "team1BidsAndActuals.p1Bid",
          description: "Initial dealer should be t1p1",
        },
        {
          rounds: 1,
          expectedDealer: "team2BidsAndActuals.p1Bid",
          description: "After 1 round, dealer should be t2p1",
        },
        {
          rounds: 2,
          expectedDealer: "team1BidsAndActuals.p2Bid",
          description: "After 2 rounds, dealer should be t1p2",
        },
        {
          rounds: 3,
          expectedDealer: "team2BidsAndActuals.p2Bid",
          description: "After 3 rounds, dealer should be t2p2",
        },
        {
          rounds: 4,
          expectedDealer: "team1BidsAndActuals.p1Bid",
          description: "After 4 rounds, dealer should cycle back to t1p1",
        },
      ];

      testCases.forEach(({ rounds, expectedDealer, description }) => {
        // Create dealer history based on number of rounds
        const dealerIdHistory: string[] = [];
        for (let i = 0; i < rounds; i++) {
          dealerIdHistory.push(mockFirstDealerOrder[i % 4]);
        }

        const currentDealer = getCurrentDealerId({
          dealerIdHistory,
          index: rounds,
          isCurrent: true,
          firstDealerOrder: mockFirstDealerOrder,
        });

        expect(currentDealer).to.equal(expectedDealer, description);
      });
    });

    test("application context: dealer should be correct in fresh game", () => {
      // Simulate a fresh game with no round history
      const dealerIdHistory: string[] = [];

      // For a fresh game (index 0), the dealer should be the first player in the order
      const currentDealer = getCurrentDealerId({
        dealerIdHistory,
        index: 0,
        isCurrent: true,
        firstDealerOrder: appInitialFirstDealerOrder,
      });

      // The dealer should be t1p1 (team1BidsAndActuals.p1Bid)
      expect(currentDealer).to.equal("team1BidsAndActuals.p1Bid");
      expect(currentDealer).to.equal(appInitialFirstDealerOrder[0]);
    });
  });
});
