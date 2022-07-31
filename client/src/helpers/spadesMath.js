import { BLIND_NIL, NIL } from './constants';

// p1Bid, p2Bid, p1Actual, p2Actual
export function calculateRoundScore(bid1, bid2, actual1, actual2, nilSetting) {
  const someoneWentNil = bid1 === NIL || bid2 === NIL;
  const someoneWentBlindNil = bid1 === BLIND_NIL || bid2 === BLIND_NIL;
  const teamBid = parseInt(bid1) + parseInt(bid2);
  const teamActual = parseInt(actual1) + parseInt(actual2);
  const score =
    someoneWentNil || someoneWentBlindNil
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

export function nilTeamRoundScore(bid1, bid2, actual1, actual2, nilSetting) {
  const bothPlayersWentNil =
    (bid1 === NIL || bid1 === BLIND_NIL) &&
    (bid2 === NIL || bid2 === BLIND_NIL);
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
      );
    } else if (isOnlyOnePlayerBlind) {
      return calculateScoreForDualNilWithOneBlind(
        bid1,
        bid2,
        actual1,
        actual2,
        nilSetting
      );
    } else if (bothAreBlind) {
      return calculateTeamRoundScoreWithBothBlindNil(
        actual1,
        actual2,
        nilSetting
      );
    }
  } else {
    return calculateTeamRoundScoreWithOneNilBidder(
      bid1,
      bid2,
      actual1,
      actual2,
      nilSetting
    );
  }
}

// this function should accept rulesType parameter
export function calculateTeamRoundScoreWithBothNonBlindNil(
  actual1,
  actual2,
  nilSetting
) {
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
    // rulesType
    const actualFromPlayerWhoFailedNil = player1AchievedNil ? actual2 : actual1;
    const bags = parseInt(actualFromPlayerWhoFailedNil);
    return {
      score: 100 + -100,
      bags,
    };
  } else {
    // rulesType
    const bags = parseInt(actual1) + parseInt(actual2);
    return {
      score: -100 + -100,
      bags,
    };
  }
}

// this function should accept rulesType parameter
export function calculateScoreForDualNilWithOneBlind(
  bid1,
  bid2,
  actual1,
  actual2,
  nilSetting
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
    // rulesType
    const bags = parseInt(blindNilPlayerActual);
    return {
      score: 100 + -200,
      bags,
    };
  } else if (!nilPlayerAchievedNil && blindNilPlayerAchievedNil) {
    // rulesType
    const bags = parseInt(nilPlayerAchievedNil);
    return {
      score: -100 + 200,
      bags,
    };
  } else {
    // rulesType
    const bags = parseInt(nilPlayerActual) + parseInt(blindNilPlayerActual);
    return {
      score: -100 + -200,
      bags,
    };
  }
}

// this function should accept rulesType parameter
export function calculateTeamRoundScoreWithBothBlindNil(
  actual1,
  actual2,
  nilSetting
) {
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
    // rulesType
    const bags = parseInt(actualFromPlayerWhoFailedNil);
    return {
      score: 200 + -200,
      bags,
    };
  } else {
    // rulesType
    const bags = parseInt(actual1) + parseInt(actual2);
    return {
      score: -200 + -200,
      bags,
    };
  }
}

// this function should accept rulesType parameter
export function calculateTeamRoundScoreWithOneNilBidder(
  bid1,
  bid2,
  actual1,
  actual2,
  nilSetting
) {
  const { nilPlayerBid, nonNilPlayerBid, nilPlayerActual, nonNilPlayerActual } =
    whoWentNil(bid1, bid2, actual1, actual2);
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
    // p1bid: nil, p2bid: 2, p1Actual: 1, p2Actual: 2, should be same score as:
    // p1bid: nil, p2bid: 2, p1Actual: 1, p2Actual: 0, ?
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
  const nilPlayerBid = [bid1, bid2].find(
    (bid) => bid === NIL || bid === BLIND_NIL
  );
  const nonNilPlayerBid = [bid1, bid2].find(
    (bid) => bid !== NIL && bid !== BLIND_NIL
  );
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

// this doesn't seem to be used anywhere. Remove it and everything that depends on it
export function calculateRoundScoresFromRoundHistory(roundHistory, nilSetting) {
  return roundHistory.map((round) => {
    const { team1BidsAndActuals, team2BidsAndActuals } = round;
    const team1RoundScore = calculateRoundScore(
      team1BidsAndActuals.p1Bid,
      team1BidsAndActuals.p2Bid,
      team1BidsAndActuals.p1Actual,
      team1BidsAndActuals.p2Actual,
      nilSetting
    );
    const team2RoundScore = calculateRoundScore(
      team2BidsAndActuals.p1Bid,
      team2BidsAndActuals.p2Bid,
      team2BidsAndActuals.p1Actual,
      team2BidsAndActuals.p2Actual,
      nilSetting
    );
    return {
      team1Score: team1RoundScore.score,
      team1Bags: team1RoundScore.bags,
      team2Score: team2RoundScore.score,
      team2Bags: team2RoundScore.bags,
    };
  });
}

export function calculateTeamRoundScoresFromTeamHistory(
  teamHistory,
  nilSetting
) {
  return teamHistory.map((round) => {
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

export function getTeamHistoryFromRoundHistory(
  roundHistory,
  teamBidsAndActuals
) {
  return roundHistory.map((round) => {
    return round[teamBidsAndActuals];
  });
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

  if (prev.teamBags >= 10) {
    prev.teamScore -= 100;
    prev.teamBags -= 10;
  }

  return prev;
}

export function getRoundHistoryAtCurrentRound(roundHistory, index) {
  const history = [];
  for (let i = 0; i <= index; i++) {
    history.push(roundHistory[i]);
  }
  return history;
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
