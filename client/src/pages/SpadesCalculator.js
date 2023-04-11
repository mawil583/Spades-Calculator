import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import GameScore from '../components/GameScore';
import CurrentRound from '../components/CurrentRound';
import PastRounds from '../components/PastRounds';
import { useRedirectWhenFalsey } from '../helpers/hooks';
import { GlobalContext } from '../helpers/GlobalContext';

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = JSON.parse(localStorage.getItem('names'));
  useRedirectWhenFalsey(names, navigate);
  const { roundHistory } = useContext(GlobalContext);

  return (
    <div className='App'>
      {names && (
        <>
          <GameScore />
          <CurrentRound
            roundNumber={roundHistory.length + 1}
            names={names}
            roundHistory={roundHistory}
          />
          <PastRounds
            names={names}
            roundHistory={roundHistory}
            style={{ paddingBottom: '40px' }}
          />
        </>
      )}
    </div>
  );
}

export default SpadesCalculator;
