import React, { useState } from "react";
import "../App.css";

function SpadesCalculator() {
  const [team1Score, setTeam1Score] = useState(0);
  const [team1Bags, setTeam1Bags] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team2Bags, setTeam2Bags] = useState(0);
  return (
    <div className="App">
      <p>This is where my spades calculator will be!</p>
      <div>
        <div>
          <h2>Team 1</h2>
          <h3>Score: {team1Score}</h3>
          <h3>Bags: {team1Bags}</h3>
        </div>
        <div>
          <h2>Team 2</h2>
          <h3>Score: {team2Score}</h3>
          <h3>Bags: {team2Bags}</h3>
        </div>
      </div>
    </div>
  );
}

export default SpadesCalculator;
