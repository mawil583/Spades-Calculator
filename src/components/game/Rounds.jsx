import React, { useContext } from 'react';
import { Round } from './';
import { GlobalContext } from '../../helpers/context/GlobalContext';

function Rounds() {
  const { roundHistory } = useContext(GlobalContext);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Round
        isCurrent
        roundHistory={roundHistory}
        roundIndex={roundHistory.length}
      />
      {roundHistory.length > 0 &&
        roundHistory
          .map((round, i) => ({ round, i }))
          .filter(({ round }) => !!round)
          .map(({ i }) => (
            <Round roundHistory={roundHistory} roundIndex={i} key={i} />
          ))
          .reverse()}
    </div>
  );
}

export default Rounds;
