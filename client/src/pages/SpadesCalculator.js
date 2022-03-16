import React, { useState } from "react";
import "../App.css";

function SpadesCalculator() {
  const [team1Score, setTeam1Score] = useState(0);
  const [team1Bags, setTeam1Bags] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team2Bags, setTeam2Bags] = useState(0);
  const [teamInfoCompleted, setTeamInfoCompleted] = useState(false);
  return (
    <div className="App">
      <div className="App-inner">
        <p>This is where my spades calculator will be!</p>
        <h1>TODO's</h1>
        <ul>
          <li>
            Make the 'Spades Calculator' landing page only ask for player names,
            with option to change team name (but defaulted to Team 1 and Team 2)
          </li>
          <li>
            When that information is entered, you are brought to a new screen
            with the Team info at the top as a sticky nav. This means I'll
            probably need to use the Provider API to share state between two
            different componenets. Alternative is to not have a different page,
            but to just update state after team information is entered and have
            conditional redering for "game round" information.
          </li>
          <li>
            Implement Formik (and maybe Yup) for easy form management, and make
            sure I'm not using both Formik form state and local state for the
            same information. Can only have one source of truth!!!
          </li>
        </ul>
        <div
          className="team-board"
          style={{
            display: "flex",
            maxWidth: "90%",
            margin: "0 auto",
          }}
        >
          <div>
            <h2>Team 1 (Have this default to "Team 1" but make it editable)</h2>
            <h3>Score: {team1Score}</h3>
            <h3>Bags: {team1Bags}</h3>
          </div>
          <div>
            <h2>Team 2 (Have this default to "Team 2" but make it editable)</h2>
            <h3>Score: {team2Score}</h3>
            <h3>Bags: {team2Bags}</h3>
          </div>
        </div>
        {/* 
      if roundInSession === true, display current editable round

      if roundHasJustFinished === true, push most recent game to completedRounds array

      for each completed round, list game round stats in reverse order
    */}
      </div>
    </div>
  );
}

export default SpadesCalculator;
