import {
  BLIND_NIL,
  NIL,
  TAKES_BAGS,
  HELPS_TEAM_BID,
  NO_BAGS_NO_HELP,
} from '../utils/constants';

// p1Bid, p2Bid, p1Actual, p2Actual
export function calculateRoundScore(
  bid1,
  bid2,
  actual1,
  actual2,
  nilSetting = HELPS_TEAM_BID
) {
  const someoneWentNil = isTypeNil(bid1) || isTypeNil(bid2);
  const teamBid = parseInt(bid1) + parseInt(bid2);
  const teamActual = parseInt(actual1) + parseInt(actual2);
  const score = someoneWentNil
    ? nilTeamRoundScore(bid1, bid2, actual1, actual2, nilSetting)
    : teamRoundScore(teamBid, teamActual);
  return score;
}

function teamRoundScore(teamBid, teamActual) {
  const gotSet = teamActual < teamBid;
  if (gotSet) {
    return { score: teamBid * -10, bags: 0 };
  } else {
    let bags = teamActual - teamBid;
    return { score: teamBid * 10 + bags, bags };
  }
}

export function nilTeamRoundScore(
  bid1,
  bid2,
  actual1,
  actual2,
  nilSetting = HELPS_TEAM_BID
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
  bid1,
  bid2,
  actual1,
  actual2,
  nilSetting
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
        ).score;
      }
    } else {
      return calculateTeamRoundScoreWithOneNilBidder(
        bid1,
        bid2,
        actual1,
        actual2,
        nilSetting
      ).score;
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
export function overPenalty(bid, actual, nilSetting) {
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
export function underPenalty(bid, actual) {
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

function isTypeNil(bid) {
  return bid === NIL || bid === BLIND_NIL;
}

export function getPlayerBags(bid, actual, nilSetting) {
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
      return new Error(
        'This function should not be called unless setting is BLIND_NIL or TAKES_BAGS'
      );
  }
}

export function calculateNilTeamRoundBags(
  bid1,
  bid2,
  actual1,
  actual2,
  nilSetting
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
        ).bags;
      }
    } else {
      return calculateTeamRoundScoreWithOneNilBidder(
        bid1,
        bid2,
        actual1,
        actual2,
        nilSetting
      ).bags;
    }
  }
  const bags =
    getPlayerBags(bid1, actual1, nilSetting) +
    getPlayerBags(bid2, actual2, nilSetting);
  return bags;
}

// only gets called if HELPS_TEAM_BID setting
export function calculateTeamRoundScoreWithBothNonBlindNil(actual1, actual2) {
  const player1AchievedNil = parseInt(actual1) === 0;
  const player2AchievedNil = parseInt(actual2) === 0;
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
    const bags = parseInt(actualFromPlayerWhoFailedNil);
    return {
      score: 100 + -100 + bags,
      bags,
    };
  } else {
    const bags = parseInt(actual1) + parseInt(actual2);
    return {
      score: -100 + -100 + bags,
      bags,
    };
  }
}

// only gets called if HELPS_TEAM_BID setting
export function calculateScoreForDualNilWithOneBlind(
  bid1,
  bid2,
  actual1,
  actual2
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
    const bags = parseInt(blindNilPlayerActual);
    return {
      score: 100 + -200 + bags,
      bags,
    };
  } else if (!nilPlayerAchievedNil && blindNilPlayerAchievedNil) {
    const bags = parseInt(nilPlayerAchievedNil);
    return {
      score: -100 + 200 + bags,
      bags,
    };
  } else {
    const bags = parseInt(nilPlayerActual) + parseInt(blindNilPlayerActual);
    return {
      score: -100 + -200 + bags,
      bags,
    };
  }
}

// only gets called if HELPS_TEAM_BID setting
export function calculateTeamRoundScoreWithBothBlindNil(actual1, actual2) {
  const player1AchievedNil = parseInt(actual1) === 0;
  const player2AchievedNil = parseInt(actual2) === 0;
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
    const bags = parseInt(actualFromPlayerWhoFailedNil);
    return {
      score: 200 + -200 + bags,
      bags,
    };
  } else {
    const bags = parseInt(actual1) + parseInt(actual2);
    return {
      score: -200 + -200 + bags,
      bags,
    };
  }
}

// only gets called with HELPS_TEAM_BID setting
export function calculateTeamRoundScoreWithOneNilBidder(
  bid1,
  bid2,
  actual1,
  actual2
) {
  const { nilPlayerBid, nonNilPlayerBid, nilPlayerActual } = whoWentNil(
    bid1,
    bid2,
    actual1,
    actual2
  );
  const wasBlind = nilPlayerBid === BLIND_NIL;
  const achievedNil = parseInt(nilPlayerActual) === 0;
  const totalActuals = parseInt(actual1) + parseInt(actual2);
  const didntGetSet = totalActuals >= parseInt(nonNilPlayerBid);
  const bags =
    totalActuals > parseInt(nonNilPlayerBid)
      ? totalActuals - parseInt(nonNilPlayerBid)
      : 0;
  const nonNilPlayerScore = didntGetSet
    ? parseInt(nonNilPlayerBid) * 10 + bags
    : parseInt(-nonNilPlayerBid) * 10;

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
}

// consider renaming.
// also, this function assumes only one bid is NIL. that might also be a code smell. Consider refactoring into class for encapsulation
export function whoWentNil(bid1, bid2, actual1, actual2) {
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
export function whoWasBlind(bid1, bid2, actual1, actual2) {
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
  teamHistory,
  nilSetting
) {
  // guard against null/undefined or malformed entries
  const safeHistory = (Array.isArray(teamHistory) ? teamHistory : [])
    .filter((round) => round && typeof round === 'object')
    .filter(
      (round) =>
        Object.prototype.hasOwnProperty.call(round, 'p1Bid') &&
        Object.prototype.hasOwnProperty.call(round, 'p2Bid') &&
        Object.prototype.hasOwnProperty.call(round, 'p1Actual') &&
        Object.prototype.hasOwnProperty.call(round, 'p2Actual')
    );

  return safeHistory.map((round) => {
    const teamRoundScore = calculateRoundScore(
      round.p1Bid,
      round.p2Bid,
      round.p1Actual,
      round.p2Actual,
      nilSetting
    );
    return {
      teamScore: teamRoundScore.score,
      teamBags: teamRoundScore.bags,
    };
  });
}

export function getDealerIdHistory(roundHistory, firstDealerOrder) {
  // Safety check: ensure firstDealerOrder is an array
  if (!Array.isArray(firstDealerOrder)) {
    console.warn('firstDealerOrder is not an array:', firstDealerOrder);
    return [];
  }

  const clonedfirstDealerOrder = [...firstDealerOrder];
  const dealerIdHistory = [];
  roundHistory.forEach(() => {
    dealerIdHistory.push(clonedfirstDealerOrder[0]);
    clonedfirstDealerOrder.push(clonedfirstDealerOrder[0]);
    clonedfirstDealerOrder.shift();
  });
  return dealerIdHistory;
}

// Rotate the initial dealer order by one position and return a new array
export function rotateDealerOrder(firstDealerOrder) {
  const clonedOrder = [...firstDealerOrder];
  if (clonedOrder.length === 0) return clonedOrder;
  clonedOrder.push(clonedOrder[0]);
  clonedOrder.shift();
  return clonedOrder;
}

export function getCurrentDealerId({
  dealerIdHistory,
  index,
  isCurrent,
  firstDealerOrder,
  dealerOverride = null,
  roundHistory = [],
}) {
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

  const clonedfirstDealerOrder = [...firstDealerOrder];

  if (isCurrent) {
    if (dealerIdHistory.length < 4) {
      if (dealerIdHistory.length === 0) {
        return clonedfirstDealerOrder[0];
      }
      return clonedfirstDealerOrder[index];
    }
    return dealerIdHistory[index - 4];
  } else {
    if (index < 4) {
      return clonedfirstDealerOrder[index];
    }
    return dealerIdHistory[index - 4];
  }
}

export function getTeamHistoryFromRoundHistory(
  roundHistory,
  teamBidsAndActuals
) {
  if (!Array.isArray(roundHistory)) return [];
  return roundHistory
    .filter((round) => round && typeof round === 'object')
    .map((round) => round[teamBidsAndActuals])
    .filter((team) => team && typeof team === 'object');
}

export function calculateTeamScoreFromRoundHistory(
  roundHistory,
  teamBidsAndActuals,
  nilSetting
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

function addRounds(prev, roundScore) {
  prev.teamScore += roundScore.teamScore;
  prev.teamBags += roundScore.teamBags;

  const hasBagPenalty = prev.teamBags >= 10;
  if (hasBagPenalty) {
    prev.teamScore -= 100;
    prev.teamBags -= 10;
  }

  return prev;
}

export function convertAchievedBidToScoreValue(input) {
  switch (input) {
    case BLIND_NIL:
      return 200;
    case NIL:
      return 100;
    default:
      return parseInt(input) * 10;
  }
}

export function convertStringInputToNum(input) {
  switch (input) {
    case BLIND_NIL:
    case NIL:
    case '':
      return 0;
    default:
      return parseInt(input);
  }
}

export function addInputs(...inputs) {
  return inputs.reduce((acc, input) => {
    return acc + convertStringInputToNum(input);
  }, 0);
}

export const isNotDefaultValue = (value) => {
  return value !== '';
};
