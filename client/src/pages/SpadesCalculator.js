import React from 'react';
import { useNavigate } from 'react-router-dom';

import GameScore from '../components/GameScore';
import Rounds from '../components/Rounds';
import { useRedirectWhenFalsey } from '../helpers/hooks';

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = JSON.parse(localStorage.getItem('names'));
  useRedirectWhenFalsey(names, navigate);

  return (
    <div className='App'>
      {names && (
        <>
          <GameScore />
          <Rounds />
        </>
      )}
    </div>
  );
}

export default SpadesCalculator;
