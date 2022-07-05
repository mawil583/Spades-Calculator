function calculateRoundScore(team1Inputs, team2Inputs) {
  const didTeam1GoNil =
    isNaN(parseInt(team1Inputs.p1Bid)) || isNaN(parseInt(team1Inputs.p2Bid));
  const didTeam2GoNil =
    isNaN(parseInt(team2Inputs.p1Bid)) || isNaN(parseInt(team2Inputs.p2Bid));

  const team1Bid = parseInt(team1Inputs.p1Bid) + parseInt(team1Inputs.p2Bid);
  const team2Bid = parseInt(team2Inputs.p1Bid) + parseInt(team2Inputs.p2Bid);
  const team1Actual =
    parseInt(team1Inputs.p1Actual) + parseInt(team1Inputs.p2Actual);
  const team2Actual =
    parseInt(team2Inputs.p1Actual) + parseInt(team2Inputs.p2Actual);
  const team1RoundScore = didTeam1GoNil
    ? nilTeamRoundScore(team1Inputs)
    : teamRoundScore(team1Bid, team1Actual);
  const team2RoundScore = didTeam2GoNil
    ? nilTeamRoundScore(team2Inputs)
    : teamRoundScore(team2Bid, team2Actual);
  return { team1RoundScore, team2RoundScore };
}

function nilTeamRoundScore(bidsAndActuals) {
  const player1WentNil = isNaN(parseInt(parseInt(bidsAndActuals.p1Bid)));
  if (player1WentNil) {
    const wasBlind = bidsAndActuals.p1Bid === 'Blind Nil';
    const achievedNil = parseInt(bidsAndActuals.p1Actual) === 0;
    const didntGetSet =
      parseInt(bidsAndActuals.p2Actual) >= parseInt(bidsAndActuals.p2Bid);
    const bags =
      parseInt(bidsAndActuals.p2Actual) > parseInt(bidsAndActuals.p2Bid)
        ? parseInt(bidsAndActuals.p2Actual) - parseInt(bidsAndActuals.p2Bid)
        : 0;
    const nonNilPlayerScore = didntGetSet
      ? parseInt(bidsAndActuals.p2Bid) * 10 +
        (parseInt(bidsAndActuals.p2Actual) - parseInt(bidsAndActuals.p2Bid))
      : parseInt(-bidsAndActuals.p2Bid) * 10;

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
    const wasBlind = bidsAndActuals.p2Bid === 'Blind Nil';
    const achievedNil = parseInt(bidsAndActuals.p1Actual) === 0;
    const didntGetSet =
      parseInt(bidsAndActuals.p1Actual) >= parseInt(bidsAndActuals.p2Bid);
    const bags =
      parseInt(bidsAndActuals.p1Actual) > parseInt(bidsAndActuals.p1Bid)
        ? parseInt(bidsAndActuals.p1Actual) - parseInt(bidsAndActuals.p1Bid)
        : 0;
    const nonNilPlayerScore = didntGetSet
      ? parseInt(bidsAndActuals.p1Bid) * 10 +
        (parseInt(bidsAndActuals.p1Actual) - parseInt(bidsAndActuals.p1Bid))
      : parseInt(-bidsAndActuals.p1Bid) * 10;
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
  console.log({ roundHistory });
  /* 

{team1score, team1Bags, team2Score, team2Bags}

*/

  const roundScores = roundHistory.map((round) => {
    const roundScore = calculateRoundScore(
      round.team1BidsAndActuals,
      round.team2BidsAndActuals
    );
    const { team1RoundScore, team2RoundScore } = roundScore;
    return {
      team1Score: team1RoundScore.score,
      team1Bags: team1RoundScore.bags,
      team2Score: team2RoundScore.score,
      team2Bags: team2RoundScore.bags,
    };
  });
  console.log({ roundScores });

  let initialScore = {
    team1Score: 0,
    team1Bags: 0,
    team2Score: 0,
    team2Bags: 0,
  };

  let gameScore = roundScores.reduce((prev, roundScore) => {
    // let { team1Score, team1Bags, team2Score, team2Bags } = prev;
    console.log({ team1Bags: prev.team1Bags });
    console.log({ team2Bags: prev.team2Bags });

    prev.team1Score += roundScore.team1Score;
    prev.team1Bags += roundScore.team1Bags;
    prev.team2Score += roundScore.team2Score;
    prev.team2Bags += roundScore.team2Bags;

    if (roundScore.team1Bags >= 10) {
      console.log({ bustBagsT1: roundScore.team1Bags });
      prev.team1Score -= 100;
      prev.team1Bags += prev.team1Bags % 10;
    }
    if (roundScore.team2Bags >= 10) {
      console.log({ bustBagsT2: roundScore.team2Bags });
      prev.team2Score -= 100;
      prev.team2Bags += prev.team2Bags % 10;
    }

    console.log({ prev });
    return prev;
  }, initialScore);
  console.log({ gameScore });
  return gameScore;
}

function calculateBagsFromRoundHistory() {}

export { calculateRoundScore, calculateScoreFromRoundHistory };
