import {
  getCurrentDealerId,
  getDealerIdHistory,
} from "../helpers/math/spadesMath";

describe("Dealer Override Scenario Test", () => {
  const mockFirstDealerOrder = [
    "team1BidsAndActuals.p1Bid", // t1p1
    "team2BidsAndActuals.p1Bid", // t2p1
    "team1BidsAndActuals.p2Bid", // t1p2
    "team2BidsAndActuals.p2Bid", // t2p2
  ];

  test("dealer override scenario: Round 2 override should affect Round 3 but Round 3 should still show correct dealer", () => {
    // Step 1: Round 1 - no override, normal rotation
    const round1History = [
      {
        team1BidsAndActuals: {
          p1Bid: "3",
          p2Bid: "4",
          p1Actual: "3",
          p2Actual: "4",
        },
        team2BidsAndActuals: {
          p1Bid: "2",
          p2Bid: "1",
          p1Actual: "2",
          p2Actual: "1",
        },
        dealerOverride: null, // No override for round 1
      },
    ];

    // Step 2: Round 2 - with dealer override to t1p1
    const round2History = [
      ...round1History,
      {
        team1BidsAndActuals: {
          p1Bid: "2",
          p2Bid: "1",
          p1Actual: "2",
          p2Actual: "1",
        },
        team2BidsAndActuals: {
          p1Bid: "3",
          p2Bid: "4",
          p1Actual: "3",
          p2Actual: "4",
        },
        dealerOverride: "team1BidsAndActuals.p1Bid", // Override to t1p1 for round 2
      },
    ];

    // Step 3: Round 3 - should have t2p1 as dealer (normal rotation after override)
    const round3History = [
      ...round2History,
      {
        team1BidsAndActuals: {
          p1Bid: "1",
          p2Bid: "3",
          p1Actual: "1",
          p2Actual: "3",
        },
        team2BidsAndActuals: {
          p1Bid: "4",
          p2Bid: "2",
          p1Actual: "4",
          p2Actual: "2",
        },
        dealerOverride: null, // No override for round 3
      },
    ];

    // Step 4: Round 4 - should have t1p2 as dealer
    const round4History = [
      ...round3History,
      {
        team1BidsAndActuals: {
          p1Bid: "2",
          p2Bid: "1",
          p1Actual: "2",
          p2Actual: "1",
        },
        team2BidsAndActuals: {
          p1Bid: "3",
          p2Bid: "4",
          p1Actual: "3",
          p2Actual: "4",
        },
        dealerOverride: null, // No override for round 4
      },
    ];

    // Test dealer calculation for each round
    const dealerIdHistory = getDealerIdHistory(
      round4History,
      mockFirstDealerOrder,
    );

    // Round 1 should have t1p1 as dealer (first dealer)
    const round1Dealer = getCurrentDealerId({
      dealerIdHistory: dealerIdHistory.slice(0, 1),
      index: 0,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory: round1History,
    });
    expect(round1Dealer).toBe("team1BidsAndActuals.p1Bid"); // t1p1

    // Round 2 should have t1p1 as dealer (due to override)
    const round2Dealer = getCurrentDealerId({
      dealerIdHistory: dealerIdHistory.slice(0, 2),
      index: 1,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory: round2History,
    });
    expect(round2Dealer).toBe("team1BidsAndActuals.p1Bid"); // t1p1 (override)

    // Round 3 should have t2p1 as dealer (normal rotation after override)
    const round3Dealer = getCurrentDealerId({
      dealerIdHistory: dealerIdHistory.slice(0, 3),
      index: 2,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory: round3History,
    });
    expect(round3Dealer).toBe("team2BidsAndActuals.p1Bid"); // t2p1

    // Round 4 should have t1p2 as dealer (normal rotation)
    const round4Dealer = getCurrentDealerId({
      dealerIdHistory: dealerIdHistory.slice(0, 4),
      index: 3,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory: round4History,
    });
    expect(round4Dealer).toBe("team1BidsAndActuals.p2Bid"); // t1p2

    // Now test the current round (Round 5) - should have t2p2 as dealer
    const round5Dealer = getCurrentDealerId({
      dealerIdHistory: dealerIdHistory,
      index: 4,
      isCurrent: true,
      firstDealerOrder: mockFirstDealerOrder,
    });
    expect(round5Dealer).toBe("team2BidsAndActuals.p2Bid"); // t2p2

    // The key assertion: Round 3 should still show t2p1 as dealer when we navigate back to it
    // This tests that the dealer override in Round 2 doesn't permanently change the dealer order
    const round3DealerAfterNavigation = getCurrentDealerId({
      dealerIdHistory: dealerIdHistory.slice(0, 3),
      index: 2,
      isCurrent: false,
      firstDealerOrder: mockFirstDealerOrder,
      roundHistory: round3History,
    });
    expect(round3DealerAfterNavigation).toBe("team2BidsAndActuals.p1Bid"); // t2p1
  });
});
