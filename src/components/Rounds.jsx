import React, { useContext } from "react";

import Round from "./Round";
import { GlobalContext } from "../helpers/GlobalContext";

function Rounds() {
  const { roundHistory } = useContext(GlobalContext);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <Round
        isCurrent
        roundHistory={roundHistory}
        roundIndex={roundHistory.length}
      />
      {roundHistory.length > 0 &&
        roundHistory
          .map((round, i) => {
            return <Round roundHistory={roundHistory} roundIndex={i} key={i} />;
          })
          .reverse()}
    </div>
  );
}

export default Rounds;
