export const possibleBids = [
  'Blind Nil',
  'Nil',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
];

export const possibleActuals = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
];

export const initialNames = {
  t1p1Name: '',
  t1p2Name: '',
  t2p1Name: '',
  t2p2Name: '',
  team1Name: 'Team 1',
  team2Name: 'Team 2',
};

export const initialCurrentRound = {
  team1BidsAndActuals: {
    p1Bid: '',
    p2Bid: '',
    p1Actual: '',
    p2Actual: '',
  },
  team2BidsAndActuals: {
    p1Bid: '',
    p2Bid: '',
    p1Actual: '',
    p2Actual: '',
  },
};

export const BLIND_NIL = 'Blind Nil';
export const NIL = 'Nil';
export const TEAM1 = 'team1BidsAndActuals';
export const TEAM2 = 'team2BidsAndActuals';
export const TAKES_BAGS = 'takesBags';
export const HELPS_TEAM_BID = 'helpsTeamBid';
export const NO_BAGS_NO_HELP = 'noBagsNoHelp';

const t1p1ID = 'team1BidsAndActuals.p1Bid';
const t1p2ID = 'team1BidsAndActuals.p2Bid';
const t2p1ID = 'team2BidsAndActuals.p1Bid';
const t2p2ID = 'team2BidsAndActuals.p2Bid';
export const initialFirstDealerOrder = [t1p1ID, t2p1ID, t1p2ID, t2p2ID];

export const team1Styles = {
  color: 'var(--app-team1)',
  borderColor: 'var(--app-team1)',
};
export const team2Styles = {
  color: 'var(--app-team2)',
  borderColor: 'var(--app-team2)',
};
