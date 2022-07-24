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
  const player1WentNil = bid1 === NIL || bid1 === BLIND_NIL;
  const bothPlayersWentNil =
    (bid1 === NIL || bid1 === BLIND_NIL) &&
    (bid2 === NIL || bid2 === BLIND_NIL);
  if (bothPlayersWentNil) {
    const player1AchievedNil = parseInt(actual1) === 0;
    const player2AchievedNil = parseInt(actual2) === 0;
    if (bid1 === NIL && bid2 === NIL) {
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
    } else if (bid1 === NIL && bid2 === BLIND_NIL) {
      if (player1AchievedNil && player2AchievedNil) {
        return {
          score: 100 + 200,
          bags: 0,
        };
      } else if (player1AchievedNil && !player2AchievedNil) {
        const bags = parseInt(actual2);
        return {
          score: 100 + -200,
          bags,
        };
      } else if (!player1AchievedNil && player2AchievedNil) {
        const bags = parseInt(actual1);
        return {
          score: -100 + 200,
          bags,
        };
      } else {
        const bags = parseInt(actual1) + parseInt(actual2);
        return {
          score: -100 + -200,
          bags,
        };
      }
    } else if (bid1 === BLIND_NIL && bid2 === NIL) {
      if (player1AchievedNil && player2AchievedNil) {
        return {
          score: 200 + 100,
          bags: 0,
        };
      } else if (player1AchievedNil && !player2AchievedNil) {
        const bags = parseInt(actual2);
        return {
          score: 200 + -100,
          bags,
        };
      } else if (!player1AchievedNil && player2AchievedNil) {
        const bags = parseInt(actual1);
        return {
          score: -200 + 100,
          bags,
        };
      } else {
        const bags = parseInt(actual1) + parseInt(actual2);
        return {
          score: -200 + -100,
          bags,
        };
      }
    } else if (bid1 === BLIND_NIL && bid2 === BLIND_NIL) {
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
          score: -200 + 200,
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
  } else if (player1WentNil) {
    const wasBlind = bid1 === BLIND_NIL;
    const achievedNil = parseInt(actual1) === 0;
    const didntGetSet = parseInt(actual1) + parseInt(actual2) >= parseInt(bid2);
    const bags =
      parseInt(actual2) + parseInt(actual1) > parseInt(bid2)
        ? parseInt(actual2) + parseInt(actual1) - parseInt(bid2)
        : 0;
    const nonNilPlayerScore = didntGetSet
      ? parseInt(bid2) * 10 + bags
      : parseInt(-bid2) * 10;

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
  } else {
    const wasBlind = bid2 === BLIND_NIL;
    const achievedNil = parseInt(actual2) === 0;
    const didntGetSet = parseInt(actual1) + parseInt(actual2) >= parseInt(bid1);
    const bags =
      parseInt(actual2) + parseInt(actual1) > parseInt(bid1)
        ? parseInt(actual1) + parseInt(actual2) - parseInt(bid1)
        : 0;
    const nonNilPlayerScore = didntGetSet
      ? parseInt(bid1) * 10 + bags
      : parseInt(-bid1) * 10;
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
