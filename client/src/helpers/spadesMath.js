import { BLIND_NIL, NIL } from './constants';

// p1Bid, p2Bid, p1Actual, p2Actual
export function calculateRoundScore(bid1, bid2, actual1, actual2) {
  const didTeamGoNil = bid1 === NIL || bid2 === NIL;
  const didTeamGoBlindNil = bid1 === BLIND_NIL || bid2 === BLIND_NIL;
  const teamBid = parseInt(bid1) + parseInt(bid2);
  const teamActual = parseInt(actual1) + parseInt(actual2);
  const score =
    didTeamGoNil || didTeamGoBlindNil
      ? nilTeamRoundScore(bid1, bid2, actual1, actual2)
      : teamRoundScore(teamBid, teamActual);
  return score;
}

export function nilTeamRoundScore(bid1, bid2, actual1, actual2) {
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
      return calculateTeamRoundScoreWithBothNonBlindNil(actual1, actual2);
    } else if (isOnlyOnePlayerBlind) {
      return calculateScoreForDualNilWithOneBlind(bid1, bid2, actual1, actual2);
    } else if (bothAreBlind) {
      return calculateTeamRoundScoreWithBothBlindNil(actual1, actual2);
    }
  } else {
    return calculateTeamRoundScoreWithOneNilBidder(
      bid1,
      bid2,
      actual1,
      actual2
    );
  }
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

// consider renaming. Also, are unused parameters a code smell if you indirectly use them via the 'arguments' keyword?
// also, this function assumes only one bid is NIL. that might also be a code smell. Consider refactoring into class for encapsulation
export function whoWentNil(bid1, bid2, actual1, actual2) {
  const nilPlayerBid = [bid1, bid2].find(
    (bid) => bid === NIL || bid === BLIND_NIL
  );
  const nonNilPlayerBid = [bid1, bid2].find(
    (bid) => bid !== NIL && bid !== BLIND_NIL
  );
  const nilPlayerActual =
    arguments[0] === nilPlayerBid ? arguments[2] : arguments[3];
  const nonNilPlayerActual =
    arguments[0] === nonNilPlayerBid ? arguments[2] : arguments[3];

  return {
    nilPlayerBid,
    nonNilPlayerBid,
    nilPlayerActual,
    nonNilPlayerActual,
  };
}

// this function assumes both bidders went nil
// same code smell from above
export function whoWasBlind(bid1, bid2, actual1, actual2) {
  const nilPlayerBid = [bid1, bid2].find((bid) => bid === NIL);
  const blindNilPlayerBid = [bid1, bid2].find((bid) => bid === BLIND_NIL);
  const nilPlayerActual =
    arguments[0] === nilPlayerBid ? arguments[2] : arguments[3];
  const blindNilPlayerActual =
    arguments[0] === blindNilPlayerBid ? arguments[2] : arguments[3];

  return {
    nilPlayerActual,
    blindNilPlayerActual,
  };
}

export function calculateTeamRoundScoreWithBothNonBlindNil(actual1, actual2) {
  const player1AchievedNil = parseInt(actual1) === 0;
  const player2AchievedNil = parseInt(actual2) === 0;
  if (player1AchievedNil && player2AchievedNil) {
    return {
      score: 100 + 100,
      bags: 0,
    };
  } else if (player1AchievedNil && !player2AchievedNil) {
    const bags = parseInt(actual2);
    return {
      score: 100 + -100,
      bags,
    };
  } else if (!player1AchievedNil && player2AchievedNil) {
    const bags = parseInt(actual1);
    return {
      score: 100 + -100,
      bags,
    };
  } else {
    const bags = parseInt(actual1) + parseInt(actual2);
    return {
      score: -100 + -100,
      bags,
    };
  }
}

export function calculateTeamRoundScoreWithBothBlindNil(actual1, actual2) {
  const player1AchievedNil = parseInt(actual1) === 0;
  const player2AchievedNil = parseInt(actual2) === 0;
  if (player1AchievedNil && player2AchievedNil) {
    return {
      score: 200 + 200,
      bags: 0,
    };
  } else if (player1AchievedNil && !player2AchievedNil) {
    const bags = parseInt(actual2);
    return {
      score: 200 + -200,
      bags,
    };
  } else if (!player1AchievedNil && player2AchievedNil) {
    const bags = parseInt(actual1);
    return {
      score: 200 + -200,
      bags,
    };
  } else {
    const bags = parseInt(actual1) + parseInt(actual2);
    return {
      score: -200 + -200,
      bags,
    };
  }
}

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
    // notice bags do not add to score. Double check the rules on that
    return {
      score: 100 + -200,
      bags,
    };
  } else if (!nilPlayerAchievedNil && blindNilPlayerAchievedNil) {
    const bags = parseInt(nilPlayerAchievedNil);
    return {
      score: -100 + 200,
      bags,
    };
  } else {
    const bags = parseInt(nilPlayerActual) + parseInt(blindNilPlayerActual);
    return {
      score: -100 + -200,
      bags,
    };
  }
}

export function calculateTeamRoundScoreWithOneNilBidder(
  bid1,
  bid2,
  actual1,
  actual2
) {
  const { nilPlayerBid, nonNilPlayerBid, nilPlayerActual, nonNilPlayerActual } =
    whoWentNil(bid1, bid2, actual1, actual2);
  // player 1 went nil
  // const wasBlind = bid1 === BLIND_NIL;
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

export function calculateRoundScoresFromRoundHistory(roundHistory) {
  return roundHistory.map((round) => {
    const { team1BidsAndActuals, team2BidsAndActuals } = round;
    const team1RoundScore = calculateRoundScore(
      team1BidsAndActuals.p1Bid,
      team1BidsAndActuals.p2Bid,
      team1BidsAndActuals.p1Actual,
      team1BidsAndActuals.p2Actual
    );
    const team2RoundScore = calculateRoundScore(
      team2BidsAndActuals.p1Bid,
      team2BidsAndActuals.p2Bid,
      team2BidsAndActuals.p1Actual,
      team2BidsAndActuals.p2Actual
    );
    return {
      team1Score: team1RoundScore.score,
      team1Bags: team1RoundScore.bags,
      team2Score: team2RoundScore.score,
      team2Bags: team2RoundScore.bags,
    };
  });
}

export function calculateTeamRoundScoresFromTeamHistory(teamHistory) {
  return teamHistory.map((round) => {
    const teamRoundScore = calculateRoundScore(
      round.p1Bid,
      round.p2Bid,
      round.p1Actual,
      round.p2Actual
    );
    return {
      teamScore: teamRoundScore.score,
      teamBags: teamRoundScore.bags,
    };
  });
}

// this is not used anymore. Was replaced with calculateTeamScoreFromRoundHistory because one team's score does not depend on the other team's score
// make sure to remove the test that test this function before removing the function
export function calculateScoreFromRoundHistory(roundHistory) {
  const roundScores = calculateRoundScoresFromRoundHistory(roundHistory);

  let initialScore = {
    team1Score: 0,
    team1Bags: 0,
    team2Score: 0,
    team2Bags: 0,
  };

  let gameScore = roundScores.reduce((prev, roundScore) => {
    prev.team1Score += roundScore.team1Score;
    prev.team1Bags += roundScore.team1Bags;
    prev.team2Score += roundScore.team2Score;
    prev.team2Bags += roundScore.team2Bags;

    if (prev.team1Bags >= 10) {
      prev.team1Score -= 100;
      prev.team1Bags -= 10;
    }
    if (prev.team2Bags >= 10) {
      prev.team2Score -= 100;
      prev.team2Bags -= 10;
    }

    return prev;
  }, initialScore);
  return gameScore;
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
  teamBidsAndActuals
) {
  const teamRoundHistory = getTeamHistoryFromRoundHistory(
    roundHistory,
    teamBidsAndActuals
  );
  const teamScores = calculateTeamRoundScoresFromTeamHistory(teamRoundHistory);

  const initialScore = {
    teamScore: 0,
    teamBags: 0,
  };

  const gameScore = teamScores.reduce((prev, roundScore) => {
    prev.teamScore += roundScore.teamScore;
    prev.teamBags += roundScore.teamBags;

    if (prev.teamBags >= 10) {
      prev.teamScore -= 100;
      prev.teamBags -= 10;
    }

    return prev;
  }, initialScore);
  return gameScore;
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
