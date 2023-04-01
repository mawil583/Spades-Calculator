import React from 'react';
import PastRound from './PastRound';

function PastRounds({ roundHistory, names, style }) {
  return (
    <div style={style}>
      {roundHistory
        .map((round, i) => {
          return (
            <PastRound
              roundNumber={i + 1}
              key={i}
              index={i}
              names={names}
              roundHistory={roundHistory}
              roundAtIndex={round}
            />
          );
        })
        .reverse()}
    </div>
  );
}
export default PastRounds;
