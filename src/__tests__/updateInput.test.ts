import type { Round } from "../types";
import { updateInput } from "../helpers/utils/helperFunctions";

describe("updateInput function", () => {
  test("should preserve dealerOverride when updating a round", () => {
    const roundWithOverride = {
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
      dealerOverride: "team2BidsAndActuals.p1Bid",
    } as unknown as Round;

    const updatedRound = updateInput({
      input: "5",
      currentRound: roundWithOverride,
      fieldToUpdate: "team1BidsAndActuals.p1Bid",
    });

    // Verify the field was updated
    expect(updatedRound.team1BidsAndActuals.p1Bid).toBe("5");

    // Verify dealerOverride was preserved
    expect(updatedRound.dealerOverride).toBe("team2BidsAndActuals.p1Bid");

    // Verify other fields remain unchanged
    expect(updatedRound.team1BidsAndActuals.p2Bid).toBe("2");
    expect(updatedRound.team2BidsAndActuals.p1Bid).toBe("4");
  });

  test("should preserve null dealerOverride when updating a round", () => {
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
    } as unknown as Round;

    const updatedRound = updateInput({
      input: "6",
      currentRound: roundWithNullOverride,
      fieldToUpdate: "team2BidsAndActuals.p2Actual",
    });

    // Verify the field was updated
    expect(updatedRound.team2BidsAndActuals.p2Actual).toBe("6");

    // Verify null dealerOverride was preserved
    expect(updatedRound.dealerOverride).toBe(null);
  });

  test("should handle rounds without dealerOverride property", () => {
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
    } as unknown as Round;

    const updatedRound = updateInput({
      input: "7",
      currentRound: roundWithoutOverride,
      fieldToUpdate: "team1BidsAndActuals.p2Bid",
    });

    // Verify the field was updated
    expect(updatedRound.team1BidsAndActuals.p2Bid).toBe("7");

    // Verify no dealerOverride property was added
    expect(updatedRound).not.toHaveProperty("dealerOverride");
  });

  test("should update team2 fields correctly", () => {
    const round = {
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
      dealerOverride: "team1BidsAndActuals.p1Bid",
    } as unknown as Round;

    const updatedRound = updateInput({
      input: "8",
      currentRound: round,
      fieldToUpdate: "team2BidsAndActuals.p1Bid",
    });

    // Verify the field was updated
    expect(updatedRound.team2BidsAndActuals.p1Bid).toBe("8");

    // Verify dealerOverride was preserved
    expect(updatedRound.dealerOverride).toBe("team1BidsAndActuals.p1Bid");

    // Verify other fields remain unchanged
    expect(updatedRound.team1BidsAndActuals.p1Bid).toBe("3");
    expect(updatedRound.team2BidsAndActuals.p2Bid).toBe("4");
  });

  test("should not mutate the original round object", () => {
    const originalRound = {
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
      dealerOverride: "team2BidsAndActuals.p2Bid",
    } as unknown as Round;

    const updatedRound = updateInput({
      input: "9",
      currentRound: originalRound,
      fieldToUpdate: "team1BidsAndActuals.p1Actual",
    });

    // Verify the original round was not mutated
    expect(originalRound.team1BidsAndActuals.p1Actual).toBe("3");
    expect(originalRound.dealerOverride).toBe("team2BidsAndActuals.p2Bid");

    // Verify the updated round has the new value
    expect(updatedRound.team1BidsAndActuals.p1Actual).toBe("9");
    expect(updatedRound.dealerOverride).toBe("team2BidsAndActuals.p2Bid");
  });
});
