import {
  BLIND_NIL,
  NIL,
  TAKES_BAGS,
  HELPS_TEAM_BID,
  NO_BAGS_NO_HELP,
} from '../utils/constants';

import type { InputValue, NilSetting, Round, Names, TeamBidsAndActuals } from '../../types';

// p1Bid, p2Bid, p1Actual, p2Actual
export function calculateRoundScore(
  bid1: InputValue,
  bid2: InputValue,
  actual1: InputValue,
  actual2: InputValue,
  nilSetting: NilSetting = HELPS_TEAM_BID
) {
  const someoneWentNil = isTypeNil(bid1) || isTypeNil(bid2);
  const teamBid =
    convertStringInputToNum(bid1) + convertStringInputToNum(bid2);
  const teamActual =
    convertStringInputToNum(actual1) + convertStringInputToNum(actual2);
  const score = someoneWentNil
    ? nilTeamRoundScore(bid1, bid2, actual1, actual2, nilSetting)
    : teamRoundScore(teamBid, teamActual);
  return score;
}

function teamRoundScore(teamBid: number, teamActual: number) {
  const gotSet = teamActual < teamBid;
  if (gotSet) {
    return { score: teamBid * -10, bags: 0 };
  } else {
    let bags = teamActual - teamBid;
    return { score: teamBid * 10 + bags, bags };
  }
}

export function nilTeamRoundScore(
  bid1: InputValue,
  bid2: InputValue,
  actual1: InputValue,
  actual2: InputValue,
  nilSetting: NilSetting = HELPS_TEAM_BID
) {
  const score = calculateNilTeamRoundScore(
    bid1,
    bid2,
    actual1,
    actual2,
    nilSetting
  );
  const bags = calculateNilTeamRoundBags(
    bid1,
    bid2,
    actual1,
    actual2,
    nilSetting
  );
  return { score, bags };
}

export function calculateNilTeamRoundScore(
  bid1: InputValue,
  bid2: InputValue,
  actual1: InputValue,
  actual2: InputValue,
  nilSetting: NilSetting
) {
  const areP1AndP2ScoredIndependently = nilSetting !== HELPS_TEAM_BID;
  if (!areP1AndP2ScoredIndependently) {
    const bothPlayersWentNil = isTypeNil(bid1) && isTypeNil(bid2);
    if (bothPlayersWentNil) {
      const areBothNotBlind = bid1 === NIL && bid2 === NIL;
      const isOnlyOnePlayerBlind =
        (bid1 === NIL && bid2 === BLIND_NIL) ||
        (bid1 === BLIND_NIL && bid2 === NIL);
      const bothAreBlind = bid1 === BLIND_NIL && bid2 === BLIND_NIL;
      if (areBothNotBlind) {
        return calculateTeamRoundScoreWithBothNonBlindNil(
          actual1,
          actual2,
          nilSetting
        ).score;
      } else if (isOnlyOnePlayerBlind) {
        return calculateScoreForDualNilWithOneBlind(
          bid1,
          bid2,
          actual1,
          actual2,
          nilSetting
        ).score;
      } else if (bothAreBlind) {
        return calculateTeamRoundScoreWithBothBlindNil(
          actual1,
          actual2,
          nilSetting
        )!.score;
      }
    } else {
      return calculateTeamRoundScoreWithOneNilBidder(
        bid1,
        bid2,
        actual1,
        actual2,
        nilSetting
      )!.score;
    }
  }

  const p1BidValue =
    convertAchievedBidToScoreValue(bid1) +
    overPenalty(bid1, actual1, nilSetting) +
    underPenalty(bid1, actual1);

  const p2BidValue =
    convertAchievedBidToScoreValue(bid2) +
    overPenalty(bid2, actual2, nilSetting) +
    underPenalty(bid2, actual2);

  return p1BidValue + p2BidValue;
}

// bag penalty
export function overPenalty(bid: InputValue, actual: InputValue, nilSetting: string) {
  const shouldBePenalized =
    convertStringInputToNum(bid) < convertStringInputToNum(actual);
  if (!shouldBePenalized) {
    return 0;
  }
  const bags = getPlayerBags(bid, actual, nilSetting);
  const playerWentNil = isTypeNil(bid);
  let penalty = 0;
  if (playerWentNil) {
    // taking away original value, and then subtracting that amount again so that it exists as a penalty
    penalty = -convertAchievedBidToScoreValue(bid) * 2;
    penalty += bags;
    return penalty;
  }
  return bags;
}

// set penalty
export function underPenalty(bid: InputValue, actual: InputValue) {
  const playerWentNil = isTypeNil(bid);
  const gotSet = convertStringInputToNum(actual) < convertStringInputToNum(bid);
  const shouldBePenalized = !playerWentNil && gotSet;
  if (!shouldBePenalized) {
    return 0;
  }
  // taking away original value, and then subtracting that amount again so that it exists as a penalty
  const penalty = -convertAchievedBidToScoreValue(bid) * 2;
  return penalty;
}

function isTypeNil(bid: InputValue) {
  return bid === NIL || bid === BLIND_NIL;
}

export function getPlayerBags(bid: string | number, actual: string | number, nilSetting: string): number {
  let bags = 0;
  if (convertStringInputToNum(bid) >= convertStringInputToNum(actual)) {
    return bags;
  }
  switch (nilSetting) {
    case NO_BAGS_NO_HELP: {
      const didSomeoneGoNil = isTypeNil(bid);
      if (!didSomeoneGoNil) {
        bags = convertStringInputToNum(actual) - convertStringInputToNum(bid);
      }
      return bags;
    }
    case TAKES_BAGS:
      bags = convertStringInputToNum(actual) - convertStringInputToNum(bid);
      return bags;
    default:
      throw new Error(
        'This function should not be called unless setting is BLIND_NIL or TAKES_BAGS'
      );
  }
}

export function calculateNilTeamRoundBags(
  bid1: InputValue,
  bid2: InputValue,
  actual1: InputValue,
  actual2: InputValue,
  nilSetting: NilSetting
) {
  const areP1AndP2ScoredIndependently = nilSetting !== HELPS_TEAM_BID;
  if (!areP1AndP2ScoredIndependently) {
    const bothPlayersWentNil = isTypeNil(bid1) && isTypeNil(bid2);
    if (bothPlayersWentNil) {
      const areBothNotBlind = bid1 === NIL && bid2 === NIL;
      const isOnlyOnePlayerBlind =
        (bid1 === NIL && bid2 === BLIND_NIL) ||
        (bid1 === BLIND_NIL && bid2 === NIL);
      const bothAreBlind = bid1 === BLIND_NIL && bid2 === BLIND_NIL;
      if (areBothNotBlind) {
        return calculateTeamRoundScoreWithBothNonBlindNil(
          actual1,
          actual2,
          nilSetting
        ).bags;
      } else if (isOnlyOnePlayerBlind) {
        return calculateScoreForDualNilWithOneBlind(
          bid1,
          bid2,
          actual1,
          actual2,
          nilSetting
        ).bags;
      } else if (bothAreBlind) {
        return calculateTeamRoundScoreWithBothBlindNil(
          actual1,
          actual2,
          nilSetting
        )!.bags;
      }
    } else {
      return calculateTeamRoundScoreWithOneNilBidder(
        bid1,
        bid2,
        actual1,
        actual2,
        nilSetting
      )!.bags;
    }
  }
  const bags =
    getPlayerBags(bid1, actual1, nilSetting) +
    getPlayerBags(bid2, actual2, nilSetting);
  return bags;
}

// only gets called if HELPS_TEAM_BID setting
export function calculateTeamRoundScoreWithBothNonBlindNil(actual1: InputValue, actual2: InputValue, _nilSetting?: string) {
  const player1AchievedNil = convertStringInputToNum(actual1) === 0;
  const player2AchievedNil = convertStringInputToNum(actual2) === 0;
  const onlyOnePlayerAchievedNil =
    (player1AchievedNil && !player2AchievedNil) ||
    (!player1AchievedNil && player2AchievedNil);
  if (player1AchievedNil && player2AchievedNil) {
    return {
      score: 100 + 100,
      bags: 0,
    };
  } else if (onlyOnePlayerAchievedNil) {
    const actualFromPlayerWhoFailedNil = player1AchievedNil ? actual2 : actual1;
    const bags = convertStringInputToNum(actualFromPlayerWhoFailedNil);
    return {
      score: 100 + -100 + bags,
      bags,
    };
  } else {
    const bags =
      convertStringInputToNum(actual1) + convertStringInputToNum(actual2);
    return {
      score: -100 + -100 + bags,
      bags,
    };
  }
}

// only gets called if HELPS_TEAM_BID setting
export function calculateScoreForDualNilWithOneBlind(
  bid1: InputValue,
  bid2: InputValue,
  actual1: InputValue,
  actual2: InputValue,
  _nilSetting?: string
) {
  const { nilPlayerActual, blindNilPlayerActual } = whoWasBlind(
    bid1,
    bid2,
    actual1,
    actual2
  );
  const nilPlayerAchievedNil = nilPlayerActual === 0;
  const blindNilPlayerAchievedNil = blindNilPlayerActual === 0;
  if (nilPlayerAchievedNil && blindNilPlayerAchievedNil) {
    return {
      score: 100 + 200,
      bags: 0,
    };
  } else if (nilPlayerAchievedNil && !blindNilPlayerAchievedNil) {
    const bags = convertStringInputToNum(blindNilPlayerActual);
    return {
      score: 100 + -200 + bags,
      bags,
    };
  } else if (!nilPlayerAchievedNil && blindNilPlayerAchievedNil) {
    const bags = convertStringInputToNum(nilPlayerActual);
    return {
      score: -100 + 200 + bags,
      bags,
    };
  } else {
    const bags =
      convertStringInputToNum(nilPlayerActual) +
      convertStringInputToNum(blindNilPlayerActual);
    return {
      score: -100 + -200 + bags,
      bags,
    };
  }
}

// only gets called if HELPS_TEAM_BID setting
export function calculateTeamRoundScoreWithBothBlindNil(actual1: InputValue, actual2: InputValue, _nilSetting?: string) {
  const player1AchievedNil = convertStringInputToNum(actual1) === 0;
  const player2AchievedNil = convertStringInputToNum(actual2) === 0;
  const onlyOnePlayerAchievedNil =
    (player1AchievedNil && !player2AchievedNil) ||
    (!player1AchievedNil && player2AchievedNil);
  if (player1AchievedNil && player2AchievedNil) {
    return {
      score: 200 + 200,
      bags: 0,
    };
  } else if (onlyOnePlayerAchievedNil) {
    const actualFromPlayerWhoFailedNil = player1AchievedNil ? actual2 : actual1;
    const bags = convertStringInputToNum(actualFromPlayerWhoFailedNil);
    return {
      score: 200 + -200 + bags,
      bags,
    };
  } else {
    const bags =
      convertStringInputToNum(actual1) + convertStringInputToNum(actual2);
    return {
      score: -200 + -200 + bags,
      bags,
    };
  }
}

// only gets called with HELPS_TEAM_BID setting
export function calculateTeamRoundScoreWithOneNilBidder(
  bid1: InputValue,
  bid2: InputValue,
  actual1: InputValue,
  actual2: InputValue,
  _nilSetting?: string
) {
  const { nilPlayerBid, nonNilPlayerBid, nilPlayerActual } = whoWentNil(
    bid1,
    bid2,
    actual1,
    actual2
  );
  const wasBlind = nilPlayerBid === BLIND_NIL;
  const achievedNil = convertStringInputToNum(nilPlayerActual) === 0;
  const totalActuals =
    convertStringInputToNum(actual1) + convertStringInputToNum(actual2);
  const didntGetSet = totalActuals >= convertStringInputToNum(nonNilPlayerBid);
  const bags =
    totalActuals > convertStringInputToNum(nonNilPlayerBid)
      ? totalActuals - convertStringInputToNum(nonNilPlayerBid)
      : 0;
  const nonNilPlayerScore = didntGetSet
    ? convertStringInputToNum(String(nonNilPlayerBid)) * 10 + bags
    : -convertStringInputToNum(String(nonNilPlayerBid)) * 10;

  if (achievedNil && didntGetSet) {
    return {
      score: wasBlind ? 200 + nonNilPlayerScore : 100 + nonNilPlayerScore,
      bags,
    };
  } else if (!achievedNil && didntGetSet) {
    return {
      score: wasBlind ? -200 + nonNilPlayerScore : -100 + nonNilPlayerScore,
      bags,
    };
  } else if (!achievedNil && !didntGetSet) {
    return {
      score: wasBlind ? -200 + nonNilPlayerScore : -100 + nonNilPlayerScore,
      bags,
    };
  } else if (achievedNil && !didntGetSet) {
    return {
      score: wasBlind ? 200 + nonNilPlayerScore : 100 + nonNilPlayerScore,
      bags,
    };
  }
  // Default fallback if no conditions emit true
  return { score: 0, bags: 0 };
}

// consider renaming.
// also, this function assumes only one bid is NIL. that might also be a code smell. Consider refactoring into class for encapsulation
export function whoWentNil(bid1: InputValue, bid2: InputValue, actual1: InputValue, actual2: InputValue) {
  const nilPlayerBid = [bid1, bid2].find((bid) => isTypeNil(bid));
  const nonNilPlayerBid = [bid1, bid2].find((bid) => !isTypeNil(bid));
  const nilPlayerActual = bid1 === nilPlayerBid ? actual1 : actual2;
  const nonNilPlayerActual = bid1 === nonNilPlayerBid ? actual1 : actual2;

  return {
    nilPlayerBid,
    nonNilPlayerBid,
    nilPlayerActual,
    nonNilPlayerActual,
  };
}

// this function assumes both bidders went Nil but only one went blind. that might also be a code smell. Consider refactoring into class for encapsulation
export function whoWasBlind(bid1: InputValue, bid2: InputValue, actual1: InputValue, actual2: InputValue) {
  const nilPlayerBid = [bid1, bid2].find((bid) => bid === NIL);
  const blindNilPlayerBid = [bid1, bid2].find((bid) => bid === BLIND_NIL);
  const nilPlayerActual = bid1 === nilPlayerBid ? actual1 : actual2;
  const blindNilPlayerActual = bid1 === blindNilPlayerBid ? actual1 : actual2;

  return {
    nilPlayerActual,
    blindNilPlayerActual,
  };
}

export function calculateTeamRoundScoresFromTeamHistory(
  teamHistory: TeamBidsAndActuals[],
  nilSetting: NilSetting | null
) {
  // guard against null/undefined or malformed entries
  const safeHistory = (Array.isArray(teamHistory) ? teamHistory : [])
    .filter((team) => team && typeof team === 'object')
    .filter(
      (team) =>
        Object.prototype.hasOwnProperty.call(team, 'p1Bid') &&
        Object.prototype.hasOwnProperty.call(team, 'p2Bid') &&
        Object.prototype.hasOwnProperty.call(team, 'p1Actual') &&
        Object.prototype.hasOwnProperty.call(team, 'p2Actual')
    );

  return safeHistory.map((team) => {
    const teamRoundScore = calculateRoundScore(
      team.p1Bid,
      team.p2Bid,
      team.p1Actual,
      team.p2Actual,
      nilSetting || HELPS_TEAM_BID
    );
    return {
      teamScore: teamRoundScore.score,
      teamBags: teamRoundScore.bags,
    };
  });
}

export function getDealerIdHistory(roundHistory: Round[], firstDealerOrder: string[]) {
  // Safety check: ensure firstDealerOrder is an array
  if (!Array.isArray(firstDealerOrder)) {
    console.warn('firstDealerOrder is not an array:', firstDealerOrder);
    return [];
  }

  const dealerIdHistory: string[] = [];
  let currentDealerOrder = [...firstDealerOrder];

  roundHistory.forEach((round) => {
    // Check if there's a dealer override for this round
    if (round?.dealerOverride) {
      dealerIdHistory.push(round.dealerOverride);
    } else {
      // Use natural dealer rotation based on the current dealer order
      dealerIdHistory.push(currentDealerOrder[0]);
    }

    // Update the dealer order for the next round based on who actually dealt
    // This should be the dealer that was actually used for this round
    const actualDealer = round?.dealerOverride || currentDealerOrder[0];

    // Find the next dealer in the rotation after the actual dealer
    const actualDealerIndex = currentDealerOrder.indexOf(actualDealer);
    if (actualDealerIndex !== -1) {
      // Rotate the dealer order so that the next dealer comes first
      const nextDealerIndex =
        (actualDealerIndex + 1) % currentDealerOrder.length;
      const rotatedOrder = [];

      // Start from the next dealer and go around
      for (let i = 0; i < currentDealerOrder.length; i++) {
        const index = (nextDealerIndex + i) % currentDealerOrder.length;
        rotatedOrder.push(currentDealerOrder[index]);
      }

      currentDealerOrder = rotatedOrder;
    }
  });

  return dealerIdHistory;
}

// Rotate the initial dealer order by one position and return a new array
export function rotateDealerOrder(firstDealerOrder: string[]) {
  const clonedOrder = [...firstDealerOrder];
  if (clonedOrder.length === 0) return clonedOrder;
  clonedOrder.push(clonedOrder[0]);
  clonedOrder.shift();
  return clonedOrder;
}

interface GetCurrentDealerIdArgs {
  dealerIdHistory: string[];
  index: number;
  isCurrent: boolean;
  firstDealerOrder: string[];
  dealerOverride?: string | null;
  roundHistory?: Round[];
}

export function getCurrentDealerId({
  dealerIdHistory,
  index,
  isCurrent,
  firstDealerOrder,
  dealerOverride = null,
  roundHistory = [],
}: GetCurrentDealerIdArgs) {
  // If there's a dealer override for the current round, use it
  if (isCurrent && dealerOverride) {
    return dealerOverride;
  }

  // If there's a dealer override for a past round, use it
  if (!isCurrent && roundHistory[index]?.dealerOverride) {
    return roundHistory[index].dealerOverride;
  }

  // Safety check: ensure firstDealerOrder is an array
  if (!Array.isArray(firstDealerOrder)) {
    console.warn(
      'firstDealerOrder is not an array in getCurrentDealerId:',
      firstDealerOrder
    );
    return null;
  }

  if (isCurrent) {
    if (dealerIdHistory.length === 0) {
      return firstDealerOrder[0];
    }
    // For current round, calculate the next dealer based on the last dealer in history
    const lastDealer = dealerIdHistory[dealerIdHistory.length - 1];
    const lastDealerIndex = firstDealerOrder.indexOf(lastDealer);
    const nextDealerIndex = (lastDealerIndex + 1) % firstDealerOrder.length;
    return firstDealerOrder[nextDealerIndex];
  } else {
    // For past rounds, use the dealer from the dealerIdHistory array
    if (index < dealerIdHistory.length) {
      return dealerIdHistory[index];
    }
    // If we don't have enough history, fall back to the original logic
    if (index < 4) {
      return firstDealerOrder[index];
    }
    return dealerIdHistory[index - 4];
  }
}

export function getTeamHistoryFromRoundHistory(
  roundHistory: Round[],
  teamBidsAndActuals: 'team1BidsAndActuals' | 'team2BidsAndActuals'
): TeamBidsAndActuals[] {
  if (!Array.isArray(roundHistory)) return [];
  return roundHistory
    .filter((round) => round && typeof round === 'object')
    .map((round) => round[teamBidsAndActuals])
    .filter((team): team is TeamBidsAndActuals => team !== undefined && team !== null);
}

export function calculateTeamScoreFromRoundHistory(
  roundHistory: Round[],
  teamBidsAndActuals: 'team1BidsAndActuals' | 'team2BidsAndActuals',
  nilSetting: NilSetting | null
) {
  const teamRoundHistory = getTeamHistoryFromRoundHistory(
    roundHistory,
    teamBidsAndActuals
  );
  const roundScores = calculateTeamRoundScoresFromTeamHistory(
    teamRoundHistory,
    nilSetting
  );

  const initialScore = {
    teamScore: 0,
    teamBags: 0,
  };

  const gameScore = roundScores.reduce(addRounds, initialScore);
  return gameScore;
}

function addRounds(prev: { teamScore: number, teamBags: number }, roundScore: { teamScore: number, teamBags: number }) {
  prev.teamScore += roundScore.teamScore;
  prev.teamBags += roundScore.teamBags;

  const hasBagPenalty = prev.teamBags >= 10;
  if (hasBagPenalty) {
    prev.teamScore -= 100;
    prev.teamBags -= 10;
  }

  return prev;
}

export function convertAchievedBidToScoreValue(input: InputValue | undefined) {
  if (input === undefined) return 0;
  switch (String(input)) {
    case BLIND_NIL:
      return 200;
    case NIL:
      return 100;
    default:
      return parseInt(String(input)) * 10;
  }
}

export function convertStringInputToNum(input: InputValue | undefined) {
  if (input === undefined) return 0;
  switch (String(input)) {
    case BLIND_NIL:
    case NIL:
    case '':
      return 0;
    default:
      return parseInt(String(input));
  }
}

export function addInputs(...inputs: InputValue[]) {
  return inputs.reduce((acc: number, input) => {
    return acc + convertStringInputToNum(String(input));
  }, 0);
}

export const isNotDefaultValue = (value: InputValue) => {
  return value !== '';
};

export const hasPlayerNamesEntered = (names: Names | null) => {
  if (!names) return false;
  const playerFields: (keyof Names)[] = ['t1p1Name', 't1p2Name', 't2p1Name', 't2p2Name'];
  const hasPlayerNames = playerFields.some(
    (field) => names[field] && names[field] !== ''
  );
  const hasCustomTeamNames =
    (names.team1Name && names.team1Name !== 'Team 1') ||
    (names.team2Name && names.team2Name !== 'Team 2');
  return hasPlayerNames || hasCustomTeamNames;
};

export const hasRoundProgress = (roundHistory: Round[], currentRound: Round | null) => {
  const hasHistory = Array.isArray(roundHistory) && roundHistory.length > 0;
  if (hasHistory) return true;

  if (!currentRound) return false;

  const hasTeam1Progress = Object.values(
    currentRound.team1BidsAndActuals || {}
  ).some(isNotDefaultValue);
  const hasTeam2Progress = Object.values(
    currentRound.team2BidsAndActuals || {}
  ).some(isNotDefaultValue);

  return hasTeam1Progress || hasTeam2Progress;
};
