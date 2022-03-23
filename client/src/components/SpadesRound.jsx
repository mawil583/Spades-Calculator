import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';

import { calculateRoundScore } from '../helpers/spadesMath';

function SpadesRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const inputRef = useRef();
  const [team1RoundScore, setTeam1RoundScore] = useState(0);
  const [team2RoundScore, setTeam2RoundScore] = useState(0);
  // const [team1GameScore, setTeam1GameScore] = useState(0);
  // const [team2GameScore, setTeam2GameScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  function moveFocusToCurrentRound() {
    inputRef.current.focus();
  }

  const formik = useFormik({
    initialValues: {
      team1: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
      team2: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
    },
  });

  useEffect(() => {
    moveFocusToCurrentRound();
  }, []);

  useEffect(() => {
    const team1Completed = Object.values(formik.values.team1).every(
      (field) => field !== ''
    );
    const team2Completed = Object.values(formik.values.team2).every(
      (field) => field !== ''
    );
    const allInputsCompleted = team1Completed && team2Completed;
    if (allInputsCompleted) {
      setIsRoundFinished(true);
      console.log({ roundData: props.roundData });
      props.setRoundData([...props.roundData, { ...formik.values }]);

      const roundScore = calculateRoundScore(
        formik.values.team1,
        formik.values.team2
      );
      setTeam1RoundScore(roundScore.team1RoundScore.score);
      setTeam2RoundScore(roundScore.team2RoundScore.score);
      // TODO: simplify. Maybe form an object instead of passing so many parameters
      props.addRoundScoreToGameScore(
        roundScore.team1RoundScore.score,
        roundScore.team2RoundScore.score,
        roundScore.team1RoundScore.bags,
        roundScore.team2RoundScore.bags
      );
      console.log({ team1Score: props.team1Score });
      // props.setRoundHistory([
      //   ...props.roundHistory,
      //   { team1GameScore: props.team1Score },
      // ]);
    }
  }, [formik.values]);

  console.log(props.roundHistory);
  return (
    <div>
      <div>
        <h1>Round {props.roundNumber}</h1>
      </div>

      <form>
        <div>
          <div>
            <h2>
              {team1Name}
              {/* {team1Score ? ` Score: ${team1Score}` : null} */}
            </h2>
            <h2>{team2Name}</h2>
          </div>
          {isRoundFinished ? (
            <div>
              <h1>Score</h1>
              <div className='row'>
                <div>
                  {team1Name}Round Score: {team1RoundScore}
                </div>
                <div>
                  {team2Name} Round Score: {team2RoundScore}
                </div>
              </div>
              <div className='row'>
                <div>
                  {team1Name} Game Score:{' '}
                  {/* {props.roundHistory[props.index]
                  ? props.roundHistory[props.index].team1GameScore
                  : null} */}
                </div>
                <div>{team2Name} Game Score: </div>
              </div>
              <div className='row'>
                <div>{team1Name} Bags: </div>
                <div>{team2Name} Bags: </div>
              </div>
            </div>
          ) : null}

          <div>
            <h1>Bids</h1>
            <div className='row'>
              <label htmlFor='p1Bid'>{t1p1Name}</label>
              <input
                ref={inputRef}
                type='text'
                value={formik.values.team1.p1Bid}
                onChange={formik.handleChange}
                // TODO: attributes id and name have to be the same because Formik maps them to initialValues. This is bad practice. Try not to nest anything within initialValues
                id='team1.p1Bid'
                name='team1.p1Bid'
              />

              <label htmlFor='p1Bid'>{t2p1Name}</label>
              <input
                type='text'
                value={formik.values.team2.p1Bid}
                onChange={formik.handleChange}
                id='team2.p1Bid'
                name='team2.p1Bid'
              />
            </div>
            <div className='row'>
              <label htmlFor='p2Bid'>{t1p2Name} Bid: </label>
              <input
                type='text'
                value={formik.values.team1.p2Bid}
                onChange={formik.handleChange}
                id='team1.p2Bid'
                name='team1.p2Bid'
              />

              <label htmlFor='p2Bid'>{t2p2Name} Bid: </label>
              <input
                type='text'
                value={formik.values.team2.p2Bid}
                onChange={formik.handleChange}
                id='team2.p2Bid'
                name='team2.p2Bid'
              />
            </div>
          </div>
          <div>
            <h1>Actuals</h1>
            <div className='row'>
              <label htmlFor='p1Actual'>{t1p1Name}</label>
              <input
                type='text'
                value={formik.values.team1.p1Actual}
                onChange={formik.handleChange}
                id='team1.p1Actual'
                name='team1.p1Actual'
              />

              <label htmlFor='p1Actual'>{t2p1Name} Actual: </label>
              <input
                type='text'
                value={formik.values.team2.p1Actual}
                onChange={formik.handleChange}
                id='team2.p1Actual'
                name='team2.p1Actual'
              />
            </div>
            <div className='row'>
              <label htmlFor='p2Actual'>{t1p2Name} Actual: </label>
              <input
                type='text'
                value={formik.values.team1.p2Actual}
                onChange={formik.handleChange}
                id='team1.p2Actual'
                name='team1.p2Actual'
              />

              <label htmlFor='p2Actual'>{t2p2Name} Actual: </label>
              <input
                type='text'
                value={formik.values.team2.p2Actual}
                onChange={formik.handleChange}
                id='team2.p2Actual'
                name='team2.p2Actual'
              />
            </div>
          </div>
        </div>

        {/* <div>
          <h2>
            {team2Name}
            {team2Score ? ` Score: ${team2Score}` : null}
          </h2>

          <br />
        </div> */}
      </form>
    </div>
  );
}

export default SpadesRound;
