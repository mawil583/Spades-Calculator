import React, { useEffect } from "react";

import { useFormik } from "formik";

function SpadesRound(props) {
  const {
    team1Name,
    team2Name,
    t1p1Name,
    t1p2Name,
    t2p1Name,
    t2p2Name,
    roundNumber,
  } = props.values;

  const formik = useFormik({
    initialValues: {
      bids: { t1p1Bid: 0, t1p2Bid: 0, t2p1Bid: 0, t2p2Bid: 0 },
      roundIsOver: false,
    },
  });

  return (
    <div>
      Round {roundNumber}
      <form>
        <div>
          <h1>{team1Name}</h1>
          <label htmlFor="t1p1Bid">{t1p1Name} Bid: </label>
          <input
            type="text"
            value={formik.values.bids.t1p1Bid}
            onChange={formik.handleChange}
            // TODO: id and name have to be the same, and they have to refer to initialValues, meaning you need to use dot notation to communicate to Fromik. This is bad practice. Try not to nest anything within initialValues
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
        </div>
        <div>
          <h1>{team2Name}</h1>
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
        </div>
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default SpadesRound;
