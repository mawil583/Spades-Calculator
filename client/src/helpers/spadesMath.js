function calculateRoundScore(bids, actuals) {
  const team1Bid = parseInt(bids.t1p1Bid) + parseInt(bids.t1p2Bid);
  const team2Bid = parseInt(bids.t2p1Bid) + parseInt(bids.t2p2Bid);
  const team1Actual =
    parseInt(actuals.t1p1Actual) + parseInt(actuals.t1p2Actual);
  const team2Actual =
    parseInt(actuals.t2p1Actual) + parseInt(actuals.t2p2Actual);

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
