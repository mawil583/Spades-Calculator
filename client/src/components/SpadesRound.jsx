import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";

import { calculateRoundScore } from "../helpers/spadesMath";

function SpadesRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const inputRef = useRef();

  function moveFocusToCurrentRound() {
    inputRef.current.focus();
  }

  const formik = useFormik({
    // TODO: change objects from bids and actuals to team1 and team2
    initialValues: {
      bids: { t1p1Bid: "", t1p2Bid: "", t2p1Bid: "", t2p2Bid: "" },
      actuals: {
        t1p1Actual: "",
        t1p2Actual: "",
        t2p1Actual: "",
        t2p2Actual: "",
      },
      roundIsOver: false,
    },
  });

  useEffect(() => {
    moveFocusToCurrentRound();
  }, []);

  useEffect(() => {
    const allBidsCompleted = Object.entries(formik.values.bids).every(
      (bid) => bid[1] !== ""
    );
    const allActualsCompleted = Object.entries(formik.values.actuals).every(
      (actual) => actual[1] !== ""
    );
    const allInputsCompleted = allBidsCompleted && allActualsCompleted;
    if (allInputsCompleted) {
      props.setRoundData([...props.roundData, { ...formik.values.bids }]);
      // calculateRoundScore(formik.values.bids, formik.values.actuals);
    }
  }, [formik.values.bids, formik.values.actuals]);

  return (
    <div>
      <h1>Round {props.roundNumber}</h1>

      <form>
        <div>
          <h2>{team1Name}</h2>
          <label htmlFor="t1p1Bid">{t1p1Name} Bid: </label>
          <input
            ref={inputRef}
            type="text"
            value={formik.values.bids.t1p1Bid}
            onChange={formik.handleChange}
            // TODO: attributes id and name have to be the same because Formik maps them to initialValues. This is bad practice. Try not to nest anything within initialValues
            id="bids.t1p1Bid"
            name="bids.t1p1Bid"
          />

          <label htmlFor="t1p2Bid">{t1p2Name} Bid: </label>
          <input
            type="text"
            value={formik.values.bids.t1p2Bid}
            onChange={formik.handleChange}
            id="bids.t1p2Bid"
            name="bids.t1p2Bid"
          />
          <br />
          <label htmlFor="t1p1Actual">{t1p1Name} Actual: </label>
          <input
            type="text"
            value={formik.values.actuals.t1p1Actual}
            onChange={formik.handleChange}
            id="actuals.t1p1Actual"
            name="actuals.t1p1Actual"
          />
          <label htmlFor="t1p2Actual">{t1p2Name} Actual: </label>
          <input
            type="text"
            value={formik.values.actuals.t1p2Actual}
            onChange={formik.handleChange}
            id="actuals.t1p2Actual"
            name="actuals.t1p2Actual"
          />
        </div>
        <div>
          <h2>{team2Name}</h2>
          <label htmlFor="t2p1Bid">{t2p1Name} Bid: </label>
          <input
            type="text"
            value={formik.values.bids.t2p1Bid}
            onChange={formik.handleChange}
            id="bids.t2p1Bid"
            name="bids.t2p1Bid"
          />

          <label htmlFor="t2p2Bid">{t2p2Name} Bid: </label>
          <input
            type="text"
            value={formik.values.bids.t2p2Bid}
            onChange={formik.handleChange}
            id="bids.t2p2Bid"
            name="bids.t2p2Bid"
          />
          <br />
          <label htmlFor="t2p1Actual">{t2p1Name} Actual: </label>
          <input
            type="text"
            value={formik.values.actuals.t2p1Actual}
            onChange={formik.handleChange}
            id="actuals.t2p1Actual"
            name="actuals.t2p1Actual"
          />
          <label htmlFor="t2p2Actual">{t2p2Name} Actual: </label>
          <input
            type="text"
            value={formik.values.actuals.t2p2Actual}
            onChange={formik.handleChange}
            id="actuals.t2p2Actual"
            name="actuals.t2p2Actual"
          />
        </div>
      </form>
    </div>
  );
}

export default SpadesRound;
