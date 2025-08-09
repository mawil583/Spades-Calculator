import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GameScore } from '../components/game';
import { Rounds } from '../components/game';
import { useRedirectWhenFalsey } from '../helpers/utils/hooks';

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = JSON.parse(localStorage.getItem('names'));
  useRedirectWhenFalsey(names, navigate);

  return (
    <div className="App">
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
