import {
  calculateRoundScore,
  calculateScoreFromRoundHistory,
} from './spadesMath';
import { NIL, BLIND_NIL } from './constants';
import { expect } from 'chai';
import {
  roundHistoryWithTwelveBags,
  roundHistoryWithTenBags,
  roundHistoryWithBothTeamMembersMissingNil,
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
});

test('calculate missing nil and getting set', () => {
  const result = calculateRoundScore(2, NIL, 0, 1);
  expect(result).deep.equals({ bags: 0, score: -120 });
  const result2 = calculateRoundScore(NIL, 2, 1, 0);
  expect(result2).deep.equals({ bags: 0, score: -120 });
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

test('calculate both teams going nil', () => {
  const result = calculateScoreFromRoundHistory(
    roundHistoryWithBothTeamMembersMissingNil
  );
  expect(result).deep.equals({
    team1Score: -200,
    team1Bags: 2,
    team2Score: 42,
    team2Bags: 2,
  });
});
