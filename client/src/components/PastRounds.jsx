import React from 'react';
import PastRound from './PastRound';

function PastRounds({ roundHistory, setRoundHistory, names }) {
  return (
    <>
      {roundHistory
        .map((round, i) => {
          return (
            <PastRound
              roundNumber={i + 1}
              key={i}
              index={i}
              names={names}
              roundHistory={roundHistory}
              setRoundHistory={setRoundHistory}
              roundAtIndex={round}
            />
          );
        })
        .reverse()}
    </>
  );
}
export default PastRounds;
