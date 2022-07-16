import React from 'react';
import { useLocation } from 'react-router-dom';
import PastRound from './PastRound';

function PastRounds({ roundHistory, setRoundHistory }) {
  const location = useLocation();
  const { state: formVals } = location;
  return (
    <>
      {roundHistory
        .map((round, i) => {
          return (
            <PastRound
              roundNumber={i + 1}
              key={i}
              index={i}
              values={formVals}
              roundHistory={roundHistory}
              setRoundHistory={setRoundHistory}
              team1BidsAndActuals={roundHistory[i].team1BidsAndActuals}
              team2BidsAndActuals={roundHistory[i].team2BidsAndActuals}
            />
          );
        })
        .reverse()}
    </>
  );
}
export default PastRounds;
