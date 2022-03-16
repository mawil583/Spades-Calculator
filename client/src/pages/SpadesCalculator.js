import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import "../App.css";

function SpadesCalculator() {
  // const [team1Score, setTeam1Score] = useState(0);
  // const [team1Bags, setTeam1Bags] = useState(0);
  // const [team2Score, setTeam2Score] = useState(0);
  // const [team2Bags, setTeam2Bags] = useState(0);
  // const [teamInfoCompleted, setTeamInfoCompleted] = useState(false);
  console.log(JSON.parse(localStorage.getItem("initialValues")));
  const hasLocalStorage = !!localStorage.getItem("initialValues");
  const formik = useFormik({
    initialValues: {
      team1Name: hasLocalStorage
        ? JSON.parse(localStorage.getItem("initialValues")).team1Name
        : "Team 1",
      team2Name: hasLocalStorage
        ? JSON.parse(localStorage.getItem("initialValues")).team2Name
        : "Team 2",
      player1name: hasLocalStorage
        ? JSON.parse(localStorage.getItem("initialValues")).player1name
        : "",
      team2Player1: hasLocalStorage
        ? JSON.parse(localStorage.getItem("initialValues")).team2Player1
        : "",
      player2Name: hasLocalStorage
        ? JSON.parse(localStorage.getItem("initialValues")).player2Name
        : "",
      team2Player2: hasLocalStorage
        ? JSON.parse(localStorage.getItem("initialValues")).team2Player2
        : "",
      nameInfoSubmitted: false,
    },
    onSubmit: (values) => {
      console.log({ values });
      formik.setFieldValue("nameInfoSubmitted", true);
      console.log({ values: formik.values });
      localStorage.setItem("initialValues", JSON.stringify(values));
    },
  });

  useEffect(() => {
    localStorage.setItem("initialValues", JSON.stringify(formik.values));
  }, [formik.values]);

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
          <li>change local storage to session storage</li>
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
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor="team1Name">Team Name</label>
              <input
                type="text"
                value={formik.values.team1Name}
                onChange={formik.handleChange}
                id="team1Name"
                name="team1Name"
              />

              <label htmlFor="player1name">Player 1 Name</label>
              <input
                type="text"
                value={formik.values.player1name}
                onChange={formik.handleChange}
                id="player1name"
                name="player1name"
              />

              <label htmlFor="player2Name">Player 2 Name</label>
              <input
                value={formik.values.player2Name}
                onChange={formik.handleChange}
                id="player2Name"
                name="player2Name"
              />

              {/* <h3>Score: {team1Score}</h3>
                <h3>Bags: {team1Bags}</h3> */}

              <label htmlFor="team2Name">Team Name</label>
              <input
                value={formik.values.team2Name}
                onChange={formik.handleChange}
                id="team2Name"
                name="team2Name"
              />

              <label htmlFor="team2Player1">Player 1 Name</label>
              <input
                value={formik.values.team2Player1}
                onChange={formik.handleChange}
                id="team2Player1"
                name="team2Player1"
              />

              <label htmlFor="team2Player2">player 2 Name</label>
              <input
                value={formik.values.team2Player2}
                onChange={formik.handleChange}
                id="team2Player2"
                name="team2Player2"
              />

              <button type="submit">Start</button>
            </form>
            {/* <h3>Score: {team2Score}</h3>
            <h3>Bags: {team2Bags}</h3> */}
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
