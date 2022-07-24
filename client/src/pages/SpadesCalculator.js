import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';
import GameScore from '../components/GameScore';
import CurrentRound from '../components/CurrentRound';
import { calculateTeamScoreFromRoundHistory } from '../helpers/spadesMath';
import { useLocalStorage } from '../helpers/hooks';
import PastRounds from '../components/PastRounds';
import { TEAM1, TEAM2 } from '../helpers/constants';
import { useRedirectWhenFalsey } from '../helpers/hooks';

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = JSON.parse(localStorage.getItem('names'));
  useRedirectWhenFalsey(names, navigate);
  const [roundHistory, setRoundHistory] = useLocalStorage('roundHistory', []);
  const team1Score = calculateTeamScoreFromRoundHistory(roundHistory, TEAM1);
  const team2Score = calculateTeamScoreFromRoundHistory(roundHistory, TEAM2);

  return (
    <div className='App'>
      {names && (
        <>
          <GameScore
            formVals={names}
            team1Score={team1Score.teamScore}
            team1Bags={team1Score.teamBags}
            team2Score={team2Score.teamScore}
            team2Bags={team2Score.teamBags}
            setRoundHistory={setRoundHistory}
          />
          <CurrentRound
            roundNumber={roundHistory.length + 1}
            values={names}
            team1GameScore={team1Score}
            team2GameScore={team2Score}
            roundHistory={roundHistory}
            setRoundHistory={setRoundHistory}
          />
          <PastRounds
            names={names}
            roundHistory={roundHistory}
            setRoundHistory={setRoundHistory}
          />
        </>
      )}
    </div>
  );
}

export default SpadesCalculator;
