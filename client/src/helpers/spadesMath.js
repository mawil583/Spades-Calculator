import { BLIND_NIL, NIL } from './constants';

// p1Bid, p2Bid, p1Actual, p2Actual
export function calculateRoundScoreNew(bid1, bid2, actual1, actual2) {
  const didTeamGoNil = bid1 === NIL || bid2 === NIL;
  const didTeamGoBlindNil = bid1 === BLIND_NIL || bid2 === BLIND_NIL;
  const teamBid = parseInt(bid1) + parseInt(bid2);
  const teamActual = parseInt(actual1) + parseInt(actual2);
  const score =
    didTeamGoNil || didTeamGoBlindNil
      ? nilTeamRoundScoreNew(bid1, bid2, actual1, actual2)
      : teamRoundScore(teamBid, teamActual);
  return score;
}

function nilTeamRoundScoreNew(bid1, bid2, actual1, actual2) {
  const player1WentNil = bid1 === NIL || bid1 === BLIND_NIL;
  if (player1WentNil) {
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
  // TODO: make the dropdown for bidding say 'nil' but the dropdown for actuals have value of 0
  const gotSet = teamActual < teamBid;
  if (gotSet) {
    return { score: teamBid * -10, bags: 0 };
  } else {
    let bags = teamActual - teamBid;
    return { score: teamBid * 10 + bags, bags };
  }
}

function calculateScoreFromRoundHistory(roundHistory) {
  const roundScores = roundHistory.map((round) => {
    const { team1BidsAndActuals, team2BidsAndActuals } = round;
    const team1RoundScore = calculateRoundScoreNew(
      team1BidsAndActuals.p1Bid,
      team1BidsAndActuals.p2Bid,
      team1BidsAndActuals.p1Actual,
      team1BidsAndActuals.p2Actual
    );
    const team2RoundScore = calculateRoundScoreNew(
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

export function calculateRoundHistoryAtCurrentRound(roundHistory, index) {
  const history = [];
  for (let i = 0; i < index; i++) {
    history.push(roundHistory[i]);
  }
  return history;
}

export { calculateScoreFromRoundHistory };
