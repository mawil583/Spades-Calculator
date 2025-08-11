import {
  getActualsErrorText,
  getUnclaimedText,
  sIfPlural,
  getButtonValues,
  updateInput,
  getEditedRoundHistory,
} from '../helpers/utils/helperFunctions';

describe('getActualsErrorText', () => {
  it('returns correct error message for total of 14', () => {
    const result = getActualsErrorText(14);
    expect(result).toBe(
      'The total amount of hands must always add up to 13. Yours totaled 14. Correct this before moving on.'
    );
  });

  it('returns correct error message for total of 12', () => {
    const result = getActualsErrorText(12);
    expect(result).toBe(
      'The total amount of hands must always add up to 13. Yours totaled 12. Correct this before moving on.'
    );
  });

  it('returns correct error message for total of 0', () => {
    const result = getActualsErrorText(0);
    expect(result).toBe(
      'The total amount of hands must always add up to 13. Yours totaled 0. Correct this before moving on.'
    );
  });

  it('returns correct error message for total of 13 (edge case)', () => {
    const result = getActualsErrorText(13);
    expect(result).toBe(
      'The total amount of hands must always add up to 13. Yours totaled 13. Correct this before moving on.'
    );
  });
});

describe('sIfPlural', () => {
  it('returns empty string for 1', () => {
    expect(sIfPlural(1)).toBe('');
  });

  it('returns "s" for 2', () => {
    expect(sIfPlural(2)).toBe('s');
  });

  it('returns empty string for 0', () => {
    expect(sIfPlural(0)).toBe('');
  });

  it('returns empty string for negative numbers', () => {
    expect(sIfPlural(-1)).toBe('');
  });
});

describe('getUnclaimedText', () => {
  it('returns unclaimed text for positive numbers', () => {
    expect(getUnclaimedText(3)).toBe('Unclaimed: 3');
    expect(getUnclaimedText(0)).toBe('Unclaimed: 0');
  });

  it('returns overbid text for negative numbers', () => {
    expect(getUnclaimedText(-1)).toBe("1 overbid! Someone's getting set!");
    expect(getUnclaimedText(-2)).toBe("2 overbids! Someone's getting set!");
  });

  it('handles edge case of exactly 0', () => {
    expect(getUnclaimedText(0)).toBe('Unclaimed: 0');
  });
});

describe('getButtonValues', () => {
  it('returns possibleBids for Bid type', () => {
    const result = getButtonValues('Bid');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns possibleActuals for Actual type', () => {
    const result = getButtonValues('Actual');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns possibleActuals for any other type', () => {
    const result = getButtonValues('Other');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('updateInput', () => {
  const mockCurrentRound = {
    team1BidsAndActuals: {
      p1Bid: 3,
      p2Bid: 4,
      p1Actual: null,
      p2Actual: null,
    },
    team2BidsAndActuals: {
      p1Bid: 2,
      p2Bid: 3,
      p1Actual: null,
      p2Actual: null,
    },
  };

  it('updates team1BidsAndActuals.p1Bid correctly', () => {
    const result = updateInput({
      input: 5,
      currentRound: mockCurrentRound,
      fieldToUpdate: 'team1BidsAndActuals.p1Bid',
    });

    expect(result.team1BidsAndActuals.p1Bid).toBe(5);
    expect(result.team1BidsAndActuals.p2Bid).toBe(4); // unchanged
    expect(result.team2BidsAndActuals.p1Bid).toBe(2); // unchanged
  });

  it('updates team2BidsAndActuals.p2Actual correctly', () => {
    const result = updateInput({
      input: 6,
      currentRound: mockCurrentRound,
      fieldToUpdate: 'team2BidsAndActuals.p2Actual',
    });

    expect(result.team2BidsAndActuals.p2Actual).toBe(6);
    expect(result.team1BidsAndActuals.p1Bid).toBe(3); // unchanged
    expect(result.team2BidsAndActuals.p1Bid).toBe(2); // unchanged
  });

  it('does not mutate the original object', () => {
    const original = JSON.parse(JSON.stringify(mockCurrentRound));
    updateInput({
      input: 5,
      currentRound: mockCurrentRound,
      fieldToUpdate: 'team1BidsAndActuals.p1Bid',
    });

    expect(mockCurrentRound).toEqual(original);
  });

  it('handles null input values', () => {
    const result = updateInput({
      input: null,
      currentRound: mockCurrentRound,
      fieldToUpdate: 'team1BidsAndActuals.p1Actual',
    });

    expect(result.team1BidsAndActuals.p1Actual).toBe(null);
  });
});

describe('getEditedRoundHistory', () => {
  const mockRoundHistory = [
    {
      team1BidsAndActuals: { p1Bid: 3, p2Bid: 4 },
      team2BidsAndActuals: { p1Bid: 2, p2Bid: 3 },
    },
    {
      team1BidsAndActuals: { p1Bid: 1, p2Bid: 2 },
      team2BidsAndActuals: { p1Bid: 3, p2Bid: 4 },
    },
  ];

  it('updates round at specified index', () => {
    const updatedRound = {
      team1BidsAndActuals: { p1Bid: 5, p2Bid: 6 },
      team2BidsAndActuals: { p1Bid: 7, p2Bid: 8 },
    };

    const result = getEditedRoundHistory({
      index: 0,
      updatedRound,
      roundHistory: mockRoundHistory,
    });

    expect(result[0]).toEqual(updatedRound);
    expect(result[1]).toEqual(mockRoundHistory[1]); // unchanged
  });

  it('does not mutate the original array', () => {
    const original = JSON.parse(JSON.stringify(mockRoundHistory));
    const updatedRound = {
      team1BidsAndActuals: { p1Bid: 5, p2Bid: 6 },
      team2BidsAndActuals: { p1Bid: 7, p2Bid: 8 },
    };

    getEditedRoundHistory({
      index: 0,
      updatedRound,
      roundHistory: mockRoundHistory,
    });

    expect(mockRoundHistory).toEqual(original);
  });

  it('handles empty roundHistory array', () => {
    const updatedRound = {
      team1BidsAndActuals: { p1Bid: 5, p2Bid: 6 },
      team2BidsAndActuals: { p1Bid: 7, p2Bid: 8 },
    };

    const result = getEditedRoundHistory({
      index: 0,
      updatedRound,
      roundHistory: [],
    });

    expect(result[0]).toEqual(updatedRound);
    expect(result.length).toBe(1);
  });

  it('handles null roundHistory by converting to empty array', () => {
    const updatedRound = {
      team1BidsAndActuals: { p1Bid: 5, p2Bid: 6 },
      team2BidsAndActuals: { p1Bid: 7, p2Bid: 8 },
    };

    const result = getEditedRoundHistory({
      index: 0,
      updatedRound,
      roundHistory: null,
    });

    expect(result[0]).toEqual(updatedRound);
    expect(result.length).toBe(1);
  });

  it('handles undefined roundHistory by converting to empty array', () => {
    const updatedRound = {
      team1BidsAndActuals: { p1Bid: 5, p2Bid: 6 },
      team2BidsAndActuals: { p1Bid: 7, p2Bid: 8 },
    };

    const result = getEditedRoundHistory({
      index: 0,
      updatedRound,
      roundHistory: undefined,
    });

    expect(result[0]).toEqual(updatedRound);
    expect(result.length).toBe(1);
  });
});
