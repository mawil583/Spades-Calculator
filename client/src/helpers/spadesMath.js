function calculateRoundScore(team1, team2) {
  const team1Bid = parseInt(team1.p1Bid) + parseInt(team1.p2Bid);
  const team1Actual = parseInt(team1.p1Actual) + parseInt(team1.p2Actual);

  const gotSet = team1Actual < team1Bid;

  let team1RoundScore;
  if (gotSet) {
    team1RoundScore = team1Bid * -10;
  } else {
    let bags = team1Actual % team1Bid;
    team1RoundScore = team1Bid * 10 + bags;
  }

  console.log({ team1RoundScore });
}

export { calculateRoundScore };
