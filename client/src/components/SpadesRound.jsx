import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';

import { calculateRoundScore } from '../helpers/spadesMath';

function SpadesRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const inputRef = useRef();
  const [team1RoundScore, setTeam1RoundScore] = useState(0);
  const [team2RoundScore, setTeam2RoundScore] = useState(0);
  const [team1GameScore, setTeam1GameScore] = useState(0);
  const [team1RoundBags, setTeam1Bags] = useState(0);
  const [team2RoundBags, setTeam2Bags] = useState(0);
  const [team2GameScore, setTeam2GameScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  function moveFocusToCurrentRound() {
    inputRef.current.focus();
  }

  const formik = useFormik({
    initialValues: {
      team1BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
      team2BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
    },
  });

  useEffect(() => {
    moveFocusToCurrentRound();
  }, []);

  /* 
  maybe split useEffect into 2 or 3

  1st useEffect sets IsRoundFinished

  2nd useEffect sets score and dependency is IsRoundFinished


  */

  useEffect(() => {
    const isNotDefaultValue = (value) => {
      return value !== '';
    };
    const team1InputVals = Object.values(formik.values.team1BidsAndActuals);
    const team2InputVals = Object.values(formik.values.team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;
    if (allBidsAndActualsAreEntered) {
      setIsRoundFinished(true);
      console.log({ bidsAndActuals: props.bidsAndActuals });
      props.setBidsAndActuals([...props.bidsAndActuals, { ...formik.values }]);
      // set history here
      const roundScore = calculateRoundScore(
        formik.values.team1BidsAndActuals,
        formik.values.team2BidsAndActuals
      );
      // this causes infinite loop when roundScore is in dependency array
      setTeam1RoundScore(roundScore.team1RoundScore.score);
      setTeam2RoundScore(roundScore.team2RoundScore.score);
      console.log({ roundScore });
      // TODO: simplify. Maybe form an object instead of passing so many parameters
      // this also causes infinite loop when roundScore is in dependency array
      props.addRoundScoreToGameScore(
        roundScore.team1RoundScore.score,
        roundScore.team2RoundScore.score,
        roundScore.team1RoundScore.bags,
        roundScore.team2RoundScore.bags,
        // maybe pass setTeam1GameScore fn as parameter
        setTeam1GameScore,
        setTeam2GameScore,
        setTeam1Bags,
        setTeam2Bags
      );
      console.log({ roundHistory: props.roundHistory });
      console.log({ roundHistoryLength: props.roundHistory.length });

      // props.roundHistory.length === 0
      //   ? props.setRoundHistory([scoreObj])
      //   : props.setRoundHistory([...props.roundHistory, scoreObj]);
    }
  }, [formik.values]);

  // useEffect(() => {

  // }, [props.team1Score])

  console.log({ roundHistory: props.roundHistory });
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
                  {team1Name} Game Score: {team1GameScore}
                  {/* {props.roundHistory[props.index]
                  ? props.roundHistory[props.index].team1GameScore
                  : null} */}
                </div>
                <div>
                  {team2Name} Game Score: {team2GameScore}
                </div>
              </div>
              <div className='row'>
                <div>
                  {team1Name} Bags: {team1RoundBags}{' '}
                </div>
                <div>
                  {team2Name} Bags: {team2RoundBags}
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <h1>Bids</h1>
            <div className='namesContainer'>
              <div>
                <label htmlFor='p1Bid'>{t1p1Name}</label>
                <input
                  ref={inputRef}
                  type='text'
                  value={formik.values.team1BidsAndActuals.p1Bid}
                  onChange={formik.handleChange}
                  // TODO: attributes id and name have to be the same because Formik maps them to initialValues. This is bad practice. Try not to nest anything within initialValues
                  id='team1BidsAndActuals.p1Bid'
                  name='team1BidsAndActuals.p1Bid'
                />
              </div>
              <div>
                <label htmlFor='p1Bid'>{t2p1Name}</label>
                <input
                  type='text'
                  value={formik.values.team2BidsAndActuals.p1Bid}
                  onChange={formik.handleChange}
                  id='team2BidsAndActuals.p1Bid'
                  name='team2BidsAndActuals.p1Bid'
                />
              </div>
              <div>
                <label htmlFor='p2Bid'>{t1p2Name}</label>
                <input
                  type='text'
                  value={formik.values.team1BidsAndActuals.p2Bid}
                  onChange={formik.handleChange}
                  id='team1BidsAndActuals.p2Bid'
                  name='team1BidsAndActuals.p2Bid'
                />
              </div>
              <div>
                <label htmlFor='p2Bid'>{t2p2Name}</label>
                <input
                  type='text'
                  value={formik.values.team2BidsAndActuals.p2Bid}
                  onChange={formik.handleChange}
                  id='team2BidsAndActuals.p2Bid'
                  name='team2BidsAndActuals.p2Bid'
                />
              </div>
            </div>
          </div>
          <div>
            <h1>Actuals</h1>
            <div className='row'>
              <label htmlFor='p1Actual'>{t1p1Name}</label>
              <input
                type='text'
                value={formik.values.team1BidsAndActuals.p1Actual}
                onChange={formik.handleChange}
                id='team1BidsAndActuals.p1Actual'
                name='team1BidsAndActuals.p1Actual'
              />

              <label htmlFor='p1Actual'>{t2p1Name} Actual: </label>
              <input
                type='text'
                value={formik.values.team2BidsAndActuals.p1Actual}
                onChange={formik.handleChange}
                id='team2BidsAndActuals.p1Actual'
                name='team2BidsAndActuals.p1Actual'
              />
            </div>
            <div className='row'>
              <label htmlFor='p2Actual'>{t1p2Name} Actual: </label>
              <input
                type='text'
                value={formik.values.team1BidsAndActuals.p2Actual}
                onChange={formik.handleChange}
                id='team1BidsAndActuals.p2Actual'
                name='team1BidsAndActuals.p2Actual'
              />

              <label htmlFor='p2Actual'>{t2p2Name} Actual: </label>
              <input
                type='text'
                value={formik.values.team2BidsAndActuals.p2Actual}
                onChange={formik.handleChange}
                id='team2BidsAndActuals.p2Actual'
                name='team2BidsAndActuals.p2Actual'
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
