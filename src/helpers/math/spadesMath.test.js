import {
  calculateRoundScore,
  calculateTeamRoundScoresFromTeamHistory,
  getTeamHistoryFromRoundHistory,
  calculateTeamScoreFromRoundHistory,
  nilTeamRoundScore,
  addInputs,
  whoWentNil,
  calculateTeamRoundScoreWithOneNilBidder,
  calculateTeamRoundScoreWithBothNonBlindNil,
  calculateScoreForDualNilWithOneBlind,
  calculateTeamRoundScoreWithBothBlindNil,
} from './spadesMath';
import {
  NIL,
  BLIND_NIL,
  TEAM1,
  TEAM2,
  TAKES_BAGS,
  NO_BAGS_NO_HELP,
  // Removed initialFirstDealerOrder as it's not used here anymore
} from '../utils/constants';
import { expect } from 'chai';
import {
  roundHistoryWithTwelveBags,
  roundHistoryWithTenBags,
  roundHistoryWithBothTeamMembersMissingNil,
  teamHistoryWithBothTeamMembersBettingNonBlindNilAndOneFailing,
  teamRoundHistoryMakingNilWithNoBags,
  teamRoundHistoryWithBagsNoNilNotSet,
  teamHistoryWithBothTeamMembersMissingNil,
  roundHistoryWithOneTeamMembersGoingNil,
} from '../utils/testFactory';

test('calculate when bids equals actuals', () => {
  const result = calculateRoundScore(2, 3, 2, 3);
  expect(result).deep.equals({ bags: 0, score: 50 });
});

test('calculate bags correctly', () => {
  const result = calculateRoundScore(2, 3, 3, 3);
  expect(result).deep.equals({ bags: 1, score: 51 });
});

test('calculate getting set correctly', () => {
  const result = calculateRoundScore(2, 3, 2, 2);
  expect(result).deep.equals({ bags: 0, score: -50 });
});

test('calculate making nill correctly', () => {
  const result = calculateRoundScore(2, NIL, 2, 0);
  expect(result).deep.equals({ bags: 0, score: 120 });
  const result2 = calculateRoundScore(NIL, 2, 0, 2);
  expect(result2).deep.equals({ bags: 0, score: 120 });
});

test('calculate making nil and getting set', () => {
  const result = calculateRoundScore(2, NIL, 1, 0);
  expect(result).deep.equals({ bags: 0, score: 80 });
  const result2 = calculateRoundScore(NIL, 2, 0, 1);
  expect(result2).deep.equals({ bags: 0, score: 80 });
});

test('calculate making nil with a bag', () => {
  const result = calculateRoundScore(2, NIL, 3, 0);
  expect(result).deep.equals({ bags: 1, score: 121 });
  const result2 = calculateRoundScore(NIL, 2, 0, 3);
  expect(result2).deep.equals({ bags: 1, score: 121 });
});

test('calculate missing nil without bags', () => {
  const result = calculateRoundScore(2, NIL, 1, 1);
  expect(result).deep.equals({ bags: 0, score: -80 });
  const result2 = calculateRoundScore(NIL, 2, 1, 1);
  expect(result2).deep.equals({ bags: 0, score: -80 });
  const result3 = calculateRoundScore(NIL, 1, 1, 0);
  expect(result3).deep.equals({ bags: 0, score: -90 });
});

test('calculate missing nil with bags', () => {
  const result = calculateRoundScore(2, NIL, 2, 1);
  expect(result).deep.equals({ bags: 1, score: -79 });
  const result2 = calculateRoundScore(NIL, 2, 1, 2);
  expect(result2).deep.equals({ bags: 1, score: -79 });
  const result3 = calculateRoundScore(NIL, '3', '4', '3');
  expect(result3).deep.equals({ bags: 4, score: -66 });
  const result4 = calculateRoundScore(NIL, 3, 3, 3);
  expect(result4).deep.equals({ bags: 3, score: -67 });
  const result5 = calculateRoundScore(NIL, 1, 1, 0, TAKES_BAGS);
  expect(result5).deep.equals({ bags: 1, score: -109 });
  const result9 = calculateRoundScore(NIL, '1', '1', 0, TAKES_BAGS);
  expect(result9).deep.equals({ bags: 1, score: -109 });
  const result6 = calculateRoundScore(NIL, 1, 2, 0, TAKES_BAGS);
  expect(result6).deep.equals({ bags: 2, score: -108 });
  const result7 = calculateRoundScore(NIL, 1, 2, 0);
  expect(result7).deep.equals({ bags: 1, score: -89 });
  const result8 = calculateRoundScore(NIL, 1, 3, 2, NO_BAGS_NO_HELP);
  expect(result8).deep.equals({ bags: 1, score: -89 });
  const result10 = calculateRoundScore(NIL, '1', '3', '2', NO_BAGS_NO_HELP);
  expect(result10).deep.equals({ bags: 1, score: -89 });
});

test('calculate missing nil and getting set', () => {
  const result = calculateRoundScore(2, NIL, 0, 1);
  expect(result).deep.equals({ bags: 0, score: -120 });
  const result2 = calculateRoundScore(NIL, 2, 1, 0);
  expect(result2).deep.equals({ bags: 0, score: -120 });
});

test('calculate when player 1 misses nill, player 2 getting set, but bid total equals actuals total', () => {
  const result = calculateRoundScore(NIL, 1, 1, 0);
  expect(result).deep.equals({ bags: 0, score: -90 });
  const result2 = calculateRoundScore(NIL, 1, 1, 0, TAKES_BAGS);
  expect(result2).deep.equals({ bags: 1, score: -109 });
});

test('calculate making blind nil correctly', () => {
  const result = calculateRoundScore(2, BLIND_NIL, 2, 0);
  expect(result).deep.equals({ bags: 0, score: 220 });
  const result2 = calculateRoundScore(BLIND_NIL, 2, 0, 2);
  expect(result2).deep.equals({ bags: 0, score: 220 });
});

test('calculate making blind nil and getting set', () => {
  const result = calculateRoundScore(2, BLIND_NIL, 1, 0);
  expect(result).deep.equals({ bags: 0, score: 180 });
  const result2 = calculateRoundScore(BLIND_NIL, 2, 0, 1);
  expect(result2).deep.equals({ bags: 0, score: 180 });
});

test('calculate making blind nil with a bag', () => {
  const result = calculateRoundScore(2, BLIND_NIL, 3, 0);
  expect(result).deep.equals({ bags: 1, score: 221 });
  const result2 = calculateRoundScore(BLIND_NIL, 2, 0, 3);
  expect(result2).deep.equals({ bags: 1, score: 221 });
});

test('calculate missing blind nil without bags', () => {
  const result = calculateRoundScore(2, BLIND_NIL, 1, 1);
  expect(result).deep.equals({ bags: 0, score: -180 });
  const result2 = calculateRoundScore(BLIND_NIL, 2, 1, 1);
  expect(result2).deep.equals({ bags: 0, score: -180 });
});

test('calculate missing blind nil with bags', () => {
  const result = calculateRoundScore(2, BLIND_NIL, 2, 1);
  expect(result).deep.equals({ bags: 1, score: -179 });
  const result2 = calculateRoundScore(BLIND_NIL, 2, 1, 2);
  expect(result2).deep.equals({ bags: 1, score: -179 });
});

test('calculate missing blind nil and getting set', () => {
  const result = calculateRoundScore(2, BLIND_NIL, 0, 1);
  expect(result).deep.equals({ bags: 0, score: -220 });
  const result2 = calculateRoundScore(BLIND_NIL, 2, 1, 0);
  expect(result2).deep.equals({ bags: 0, score: -220 });
});

test('calculate reaching exactly 10 bags', () => {
  /* 
  strange that calculateTeamScoreFromRoundHistory takes in history of 
  both teams but only calculates score for one of the teams. consider refactoring
  */
  const result = calculateTeamScoreFromRoundHistory(
    roundHistoryWithTenBags,
    TEAM1
  );
  expect(result).deep.equals({
    teamScore: -10,
    teamBags: 0,
  });
});

test('calculate reaching 12 bags', () => {
  const result = calculateTeamScoreFromRoundHistory(
    roundHistoryWithTwelveBags,
    TEAM1
  );
  expect(result).deep.equals({
    teamScore: -8,
    teamBags: 2,
  });
});

test('test nilTeamRoundScore for both teams missing nil', () => {
  const result = nilTeamRoundScore(
    teamHistoryWithBothTeamMembersMissingNil[0].p1Bid,
    teamHistoryWithBothTeamMembersMissingNil[0].p2Bid,
    teamHistoryWithBothTeamMembersMissingNil[0].p1Actual,
    teamHistoryWithBothTeamMembersMissingNil[0].p2Actual
  );
  expect(result).deep.equals({
    score: -198,
    bags: 2,
  });
});

test('test nilTeamRoundScore for both teams betting nonBlindNill and only one missing nil', () => {
  const result = nilTeamRoundScore(
    teamHistoryWithBothTeamMembersBettingNonBlindNilAndOneFailing[0].p1Bid,
    teamHistoryWithBothTeamMembersBettingNonBlindNilAndOneFailing[0].p2Bid,
    teamHistoryWithBothTeamMembersBettingNonBlindNilAndOneFailing[0].p1Actual,
    teamHistoryWithBothTeamMembersBettingNonBlindNilAndOneFailing[0].p2Actual
  );
  expect(result).deep.equals({
    score: 1,
    bags: 1,
  });
});

test('test calculateRoundScore for both teams missing nil', () => {
  const result = calculateRoundScore(
    teamHistoryWithBothTeamMembersMissingNil[0].p1Bid,
    teamHistoryWithBothTeamMembersMissingNil[0].p2Bid,
    teamHistoryWithBothTeamMembersMissingNil[0].p1Actual,
    teamHistoryWithBothTeamMembersMissingNil[0].p2Actual
  );
  expect(result).deep.equals({
    score: -198,
    bags: 2,
  });
});

test('test calculateTeamRoundScoresFromTeamHistory for both teams missing nil', () => {
  const result = calculateTeamRoundScoresFromTeamHistory(
    teamHistoryWithBothTeamMembersMissingNil
  );
  expect(result).deep.equals([
    {
      teamScore: -198,
      teamBags: 2,
    },
  ]);
});

test('test calculateTeamScoreFromRoundHistory for both teams missing nil', () => {
  const result = calculateTeamScoreFromRoundHistory(
    roundHistoryWithBothTeamMembersMissingNil,
    TEAM1
  );
  expect(result).deep.equals({
    teamScore: -198,
    teamBags: 2,
  });
});

test('test calculateTeamScoreFromRoundHistory for takes bags with one person going nil', () => {
  const result = calculateTeamScoreFromRoundHistory(
    roundHistoryWithOneTeamMembersGoingNil,
    TEAM1,
    TAKES_BAGS
  );
  expect(result).deep.equals({
    teamScore: -109,
    teamBags: 1,
  });
});

test('getTeamHistoryFromRoundHistory', () => {
  const result = getTeamHistoryFromRoundHistory(
    roundHistoryWithTwelveBags,
    TEAM1
  );
  expect(result).deep.equals([
    {
      p1Bid: '1',
      p2Bid: '1',
      p1Actual: '6',
      p2Actual: '4',
    },
    { p1Bid: '3', p2Bid: '3', p1Actual: '6', p2Actual: '4' },
  ]);
});

test('calculateTeamRoundScoresFromTeamHistory with nil', () => {
  const result = calculateTeamRoundScoresFromTeamHistory(
    teamRoundHistoryMakingNilWithNoBags
  );
  expect(result).deep.equals([
    {
      teamScore: 120,
      teamBags: 0,
    },
  ]);
});

test('calculateTeamRoundScoresFromTeamHistory with nil', () => {
  const result = calculateTeamRoundScoresFromTeamHistory(
    teamRoundHistoryWithBagsNoNilNotSet
  );
  expect(result).deep.equals([
    {
      teamScore: 51,
      teamBags: 1,
    },
    {
      teamScore: 71,
      teamBags: 1,
    },
  ]);
});

test('using calculateTeamRoundScoresFromTeamHistory with getTeamHistoryFromRoundHistory', () => {
  const teamHistory = getTeamHistoryFromRoundHistory(
    roundHistoryWithTenBags,
    TEAM2
  );
  const result = calculateTeamRoundScoresFromTeamHistory(teamHistory);
  expect(result).deep.equals([
    {
      teamScore: 42,
      teamBags: 2,
    },
    {
      teamScore: -60,
      teamBags: 0,
    },
  ]);
});

test('addInputs', () => {
  const result = addInputs(NIL, '3');
  expect(result).deep.equals(3);
});

test('whoWentNil', () => {
  const result = whoWentNil(NIL, '3', '1', '4');
  expect(result).deep.equals({
    nilPlayerBid: NIL,
    nonNilPlayerBid: '3',
    nilPlayerActual: '1',
    nonNilPlayerActual: '4',
  });
});

test('calculateTeamRoundScoreWithOneNilBidder', () => {
  const result = calculateTeamRoundScoreWithOneNilBidder(NIL, '3', '1', '4');
  expect(result).deep.equals({
    score: -68,
    bags: 2,
  });
});

test('calculateTeamRoundScoreWithBothNonBlindNil, one missing and the other making', () => {
  const result = calculateTeamRoundScoreWithBothNonBlindNil(0, '1');
  expect(result).deep.equals({
    score: 1,
    bags: 1,
  });
});

test('calculateScoreForDualNilWithOneBlind, one missing and the other making', () => {
  const result = calculateScoreForDualNilWithOneBlind(NIL, BLIND_NIL, 0, 1);
  expect(result).deep.equals({
    score: -99,
    bags: 1,
  });
});

test('calculateTeamRoundScoreWithBothBlindNil, one missing and the other making', () => {
  const result = calculateTeamRoundScoreWithBothBlindNil(0, 1);
  expect(result).deep.equals({
    score: 1,
    bags: 1,
  });
});

test('getTeamHistoryFromRoundHistory ignores null/undefined entries', () => {
  const round0 = roundHistoryWithTenBags[0];
  const mixedHistory = [null, round0, undefined];
  const result = getTeamHistoryFromRoundHistory(mixedHistory, TEAM1);
  expect(result).deep.equals([
    {
      p1Bid: round0.team1BidsAndActuals.p1Bid,
      p2Bid: round0.team1BidsAndActuals.p2Bid,
      p1Actual: round0.team1BidsAndActuals.p1Actual,
      p2Actual: round0.team1BidsAndActuals.p2Actual,
    },
  ]);
});

test('calculateTeamScoreFromRoundHistory tolerates null entries in history', () => {
  const round0Only = [roundHistoryWithTenBags[0]];
  const mixedHistory = [null, roundHistoryWithTenBags[0], undefined];
  const expected = calculateTeamScoreFromRoundHistory(round0Only, TEAM1);
  const result = calculateTeamScoreFromRoundHistory(mixedHistory, TEAM1);
  expect(result).deep.equals(expected);
});
