import {
  calculateRoundScore,
  calculateScoreFromRoundHistory,
  calculateTeamRoundScoresFromTeamHistory,
  getTeamHistoryFromRoundHistory,
  calculateTeamScoreFromRoundHistory,
  nilTeamRoundScore,
  getRoundHistoryAtCurrentRound,
} from './spadesMath';
import { NIL, BLIND_NIL, TEAM1, TEAM2 } from './constants';
import { expect } from 'chai';
import {
  roundHistoryWithTwelveBags,
  roundHistoryWithTenBags,
  roundHistoryWithBothTeamMembersMissingNil,
  teamRoundHistoryMakingNilWithNoBags,
  teamRoundHistoryWithBagsNoNilNotSet,
  teamHistoryWithBothTeamMembersMissingNil,
} from './testFactory';

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
});

test('calculate missing nil with bags', () => {
  const result = calculateRoundScore(2, NIL, 2, 1);
  expect(result).deep.equals({ bags: 1, score: -79 });
  const result2 = calculateRoundScore(NIL, 2, 1, 2);
  expect(result2).deep.equals({ bags: 1, score: -79 });
  const result3 = calculateRoundScore(NIL, '3', '4', '3');
  expect(result3).deep.equals({ bags: 4, score: -66 });
  /* if we were playing 'takes bags', this score would be 
  the same except there would be 3 bags
  */
  const result4 = calculateRoundScore(NIL, 3, 3, 3);
  expect(result4).deep.equals({ bags: 3, score: -67 });
});

test('calculate missing nil and getting set', () => {
  const result = calculateRoundScore(2, NIL, 0, 1);
  expect(result).deep.equals({ bags: 0, score: -120 });
  const result2 = calculateRoundScore(NIL, 2, 1, 0);
  expect(result2).deep.equals({ bags: 0, score: -120 });
});

test('calculate when player 1 misses nill, player 2 getting set, but bid total equals actuals total', () => {
  /* this test demonstrates that we follow "helps team out" rule for 
  failed nil. Should maybe change this to "takes bags" as that's 
  probably more common:
  https://www.trickstercards.com/home/help/HowToPlay.aspx?game=spades
  https://www.pagat.com/auctionwhist/spades.html
  */
  const result = calculateRoundScore(NIL, 1, 1, 0);
  expect(result).deep.equals({ bags: 0, score: -90 });

  // this test should only pass when we change to "takes bags" rules:
  // const result2 = calculateRoundScore(NIL, 1, 1, 0);
  // expect(result2).deep.equals({ bags: 1, score: -109 });
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
  const result = calculateScoreFromRoundHistory(roundHistoryWithTenBags);
  expect(result).deep.equals({
    team1Score: -10,
    team1Bags: 0,
    team2Score: -18,
    team2Bags: 2,
  });
});

test('calculate reaching 12 bags', () => {
  const result = calculateScoreFromRoundHistory(roundHistoryWithTwelveBags);
  expect(result).deep.equals({
    team1Score: -8,
    team1Bags: 2,
    team2Score: -18,
    team2Bags: 2,
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
    score: -200,
    bags: 2,
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
    score: -200,
    bags: 2,
  });
});

test('test calculateTeamRoundScoresFromTeamHistory for both teams missing nil', () => {
  const result = calculateTeamRoundScoresFromTeamHistory(
    teamHistoryWithBothTeamMembersMissingNil
  );
  expect(result).deep.equals([
    {
      teamScore: -200,
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
    teamScore: -200,
    teamBags: 2,
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

test('getRoundHistoryAtCurrentRound', () => {
  const result = getRoundHistoryAtCurrentRound(roundHistoryWithTenBags, 0);
  expect(result).deep.equals([roundHistoryWithTenBags[0]]);
});
