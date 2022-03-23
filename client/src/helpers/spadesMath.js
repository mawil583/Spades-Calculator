function calculateRoundScore(team1, team2) {
  const didTeam1GoNil =
    isNaN(parseInt(team1.p1Bid)) || isNaN(parseInt(team1.p2Bid));
  const didTeam2GoNil =
    isNaN(parseInt(team2.p1Bid)) || isNaN(parseInt(team2.p2Bid));

  const team1Bid = parseInt(team1.p1Bid) + parseInt(team1.p2Bid);
  const team2Bid = parseInt(team2.p1Bid) + parseInt(team2.p2Bid);
  const team1Actual = parseInt(team1.p1Actual) + parseInt(team1.p2Actual);
  const team2Actual = parseInt(team2.p1Actual) + parseInt(team2.p2Actual);

  console.log({ p1Bid: parseInt(team1.p1Bid) });
  const team1RoundScore = didTeam1GoNil
    ? nilTeamRoundScore(team1)
    : teamRoundScore(team1Bid, team1Actual);
  const team2RoundScore = didTeam2GoNil
    ? nilTeamRoundScore(team2)
    : teamRoundScore(team2Bid, team2Actual);
  console.log({ team1RoundScore, team2RoundScore });
  return { team1RoundScore, team2RoundScore };
}

function nilTeamRoundScore(team) {
  const player1WentNil = isNaN(parseInt(parseInt(team.p1Bid)));
  if (player1WentNil) {
    const wasBlind = team.p1Bid === 'blindNil';
    const achievedNil = parseInt(team.p1Actual) === 0;
    const didntGetSet = parseInt(team.p2Actual) >= parseInt(team.p2Bid);
    const bags =
      parseInt(team.p2Actual) > parseInt(team.p2Bid)
        ? parseInt(team.p2Actual) - parseInt(team.p2Bid)
        : 0;
    const nonNilPlayerScore = didntGetSet
      ? parseInt(team.p2Bid) * 10 +
        (parseInt(team.p2Actual) - parseInt(team.p2Bid))
      : parseInt(-team.p2Bid) * 10;

    console.log({ nonNilPlayerScore });
    console.log({ achievedNil });
    console.log({ didntGetSet });
    if (achievedNil && didntGetSet) {
      console.log('if');
      console.log({ wasBlind });
      return {
        score: wasBlind ? 200 + nonNilPlayerScore : 100 + nonNilPlayerScore,
        bags,
      };
    } else if (!achievedNil && didntGetSet) {
      console.log('else if1');
      return {
        score: wasBlind ? -200 + nonNilPlayerScore : -100 + nonNilPlayerScore,
        bags,
      };
    } else if (!achievedNil && !didntGetSet) {
      console.log('else if2');
      return {
        score: wasBlind ? -200 + nonNilPlayerScore : -100 + nonNilPlayerScore,
        bags,
      };
    } else if (achievedNil && !didntGetSet) {
      console.log('last');

      return {
        score: wasBlind ? 200 + nonNilPlayerScore : 100 + nonNilPlayerScore,
        bags,
      };
    }
  } else {
    const wasBlind = team.p2Bid === 'blindNil';
    const achievedNil = parseInt(team.p1Actual) === 0;
    const didntGetSet = parseInt(team.p1Actual) >= parseInt(team.p2Bid);
    const bags =
      parseInt(team.p1Actual) > parseInt(team.p1Bid)
        ? parseInt(team.p1Actual) - parseInt(team.p1Bid)
        : 0;
    const nonNilPlayerScore = didntGetSet
      ? parseInt(team.p1Bid) * 10 +
        (parseInt(team.p1Actual) - parseInt(team.p1Bid))
      : parseInt(-team.p1Bid) * 10;
    if (achievedNil && didntGetSet) {
      console.log('if');
      console.log({ wasBlind });
      return {
        score: wasBlind ? 200 + nonNilPlayerScore : 100 + nonNilPlayerScore,
        bags,
      };
    } else if (!achievedNil && didntGetSet) {
      console.log('else if1');
      return {
        score: wasBlind ? -200 + nonNilPlayerScore : -100 + nonNilPlayerScore,
        bags,
      };
    } else if (!achievedNil && !didntGetSet) {
      console.log('else if2');
      return {
        score: wasBlind ? -200 + nonNilPlayerScore : -100 + nonNilPlayerScore,
        bags,
      };
    } else if (achievedNil && !didntGetSet) {
      console.log('last');

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

export { calculateRoundScore };
