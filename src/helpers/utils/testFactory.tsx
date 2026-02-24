import { NIL } from './constants';
import type { Round, TeamBidsAndActuals } from '../../types';

export const roundHistoryWithTwelveBags: Round[] = [
  {
    team1BidsAndActuals: {
      p1Bid: '1',
      p2Bid: '1',
      p1Actual: '6',
      p2Actual: '4',
    },
    team2BidsAndActuals: {
      p1Bid: '1',
      p2Bid: '3',
      p1Actual: '3',
      p2Actual: '3',
    },
  },
  {
    team1BidsAndActuals: {
      p1Bid: '3',
      p2Bid: '3',
      p1Actual: '6',
      p2Actual: '4',
    },
    team2BidsAndActuals: {
      p1Actual: '3',
      p1Bid: '3',
      p2Actual: '1',
      p2Bid: '3',
    },
  },
];
export const roundHistoryWithBothTeamMembersMissingNil: Round[] = [
  {
    team1BidsAndActuals: {
      p1Bid: NIL,
      p2Bid: NIL,
      p1Actual: '1',
      p2Actual: '1',
    },
    team2BidsAndActuals: {
      p1Bid: '1',
      p2Bid: '3',
      p1Actual: '3',
      p2Actual: '3',
    },
  },
];
export const roundHistoryWithOneTeamMembersGoingNil: Round[] = [
  {
    team1BidsAndActuals: {
      p1Bid: NIL,
      p2Bid: '1',
      p1Actual: '1',
      p2Actual: 0,
    },
    team2BidsAndActuals: {
      p1Bid: NIL,
      p2Bid: '1',
      p1Actual: '2',
      p2Actual: 0,
    },
  },
];
export const teamHistoryWithBothTeamMembersMissingNil: TeamBidsAndActuals[] = [
  {
    p1Bid: NIL,
    p2Bid: NIL,
    p1Actual: '1',
    p2Actual: '1',
  },
];
export const teamHistoryWithBothTeamMembersBettingNonBlindNilAndOneFailing: TeamBidsAndActuals[] = [
  {
    p1Bid: NIL,
    p2Bid: NIL,
    p1Actual: 0,
    p2Actual: '1',
  },
];

export const teamRoundHistoryMakingNilWithNoBags: TeamBidsAndActuals[] = [
  {
    p1Bid: '2',
    p2Bid: NIL,
    p1Actual: '2',
    p2Actual: 0,
  },
];
export const teamRoundHistoryWithBagsNoNilNotSet: TeamBidsAndActuals[] = [
  {
    p1Bid: '2',
    p2Bid: '3',
    p1Actual: '2',
    p2Actual: '4',
  },
  {
    p1Bid: '3',
    p2Bid: '4',
    p1Actual: '4',
    p2Actual: '4',
  },
];

export const roundHistoryWithTenBags: Round[] = [
  {
    team1BidsAndActuals: {
      p1Bid: '1',
      p2Bid: '1',
      p1Actual: '6',
      p2Actual: '4',
    },
    team2BidsAndActuals: {
      p1Bid: '1',
      p2Bid: '3',
      p1Actual: '3',
      p2Actual: '3',
    },
  },
  {
    team1BidsAndActuals: {
      p1Bid: '3',
      p2Bid: '3',
      p1Actual: '4',
      p2Actual: '4',
    },
    team2BidsAndActuals: {
      p1Bid: '3',
      p2Bid: '3',
      p1Actual: '3',
      p2Actual: '1',
    },
  },
];
