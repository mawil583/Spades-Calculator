import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';

import { calculateRoundScore } from '../helpers/spadesMath';

function SpadesRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const inputRef = useRef();

  function moveFocusToCurrentRound() {
    inputRef.current.focus();
  }

  const formik = useFormik({
    initialValues: {
      // roundIsOver: false,
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
      props.setRoundData([...props.roundData, { ...formik.values }]);
      calculateRoundScore(formik.values.team1, formik.values.team2);
    }
  }, [formik.values]);

  return (
    <div>
      <h1>Round {props.roundNumber}</h1>

      <form>
        <div>
          <h2>{team1Name}</h2>
          <label htmlFor='p1Bid'>{t1p1Name} Bid: </label>
          <input
            ref={inputRef}
            type='text'
            value={formik.values.team1.p1Bid}
            onChange={formik.handleChange}
            // TODO: attributes id and name have to be the same because Formik maps them to initialValues. This is bad practice. Try not to nest anything within initialValues
            id='team1.p1Bid'
            name='team1.p1Bid'
          />

          <label htmlFor='p2Bid'>{t1p2Name} Bid: </label>
          <input
            type='text'
            value={formik.values.team1.p2Bid}
            onChange={formik.handleChange}
            id='team1.p2Bid'
            name='team1.p2Bid'
          />
          <br />
          <label htmlFor='p1Actual'>{t1p1Name} Actual: </label>
          <input
            type='text'
            value={formik.values.team1.p1Actual}
            onChange={formik.handleChange}
            id='team1.p1Actual'
            name='team1.p1Actual'
          />
          <label htmlFor='p2Actual'>{t1p2Name} Actual: </label>
          <input
            type='text'
            value={formik.values.team1.p2Actual}
            onChange={formik.handleChange}
            id='team1.p2Actual'
            name='team1.p2Actual'
          />
        </div>
        <div>
          <h2>{team2Name}</h2>

          <label htmlFor='p1Bid'>{t2p1Name} Bid: </label>
          <input
            type='text'
            value={formik.values.team2.p1Bid}
            onChange={formik.handleChange}
            id='team2.p1Bid'
            name='team2.p1Bid'
          />

          <label htmlFor='p2Bid'>{t2p2Name} Bid: </label>
          <input
            type='text'
            value={formik.values.team2.p2Bid}
            onChange={formik.handleChange}
            id='team2.p2Bid'
            name='team2.p2Bid'
          />
          <br />
          <label htmlFor='p1Actual'>{t2p1Name} Actual: </label>
          <input
            type='text'
            value={formik.values.team2.p1Actual}
            onChange={formik.handleChange}
            id='team2.p1Actual'
            name='team2.p1Actual'
          />
          <label htmlFor='p2Actual'>{t2p2Name} Actual: </label>
          <input
            type='text'
            value={formik.values.team2.p2Actual}
            onChange={formik.handleChange}
            id='team2.p2Actual'
            name='team2.p2Actual'
          />

          {/* <label htmlFor='t2p1Bid'>{t2p1Name} Bid: </label>
          <input
            type='text'
            value={formik.values.bids.t2p1Bid}
            onChange={formik.handleChange}
            id='bids.t2p1Bid'
            name='bids.t2p1Bid'
          />

          <label htmlFor='t2p2Bid'>{t2p2Name} Bid: </label>
          <input
            type='text'
            value={formik.values.bids.t2p2Bid}
            onChange={formik.handleChange}
            id='bids.t2p2Bid'
            name='bids.t2p2Bid'
          />
          <br />
          <label htmlFor='t2p1Actual'>{t2p1Name} Actual: </label>
          <input
            type='text'
            value={formik.values.actuals.t2p1Actual}
            onChange={formik.handleChange}
            id='actuals.t2p1Actual'
            name='actuals.t2p1Actual'
          />
          <label htmlFor='t2p2Actual'>{t2p2Name} Actual: </label>
          <input
            type='text'
            value={formik.values.actuals.t2p2Actual}
            onChange={formik.handleChange}
            id='actuals.t2p2Actual'
            name='actuals.t2p2Actual'
          /> */}
        </div>
      </form>
    </div>
  );
}

export default SpadesRound;
