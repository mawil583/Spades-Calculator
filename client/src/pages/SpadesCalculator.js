import React from 'react';
import { useLocation } from 'react-router-dom';
import GameScore from '../components/GameScore';
import '../App.css';
import CurrentRound from '../components/CurrentRound';
import { calculateTeamScoreFromRoundHistory } from '../helpers/spadesMath';
import { useLocalStorage } from '../helpers/hooks';
import PastRounds from '../components/PastRounds';
import { TEAM1, TEAM2 } from '../helpers/constants';

function SpadesCalculator() {
  const location = useLocation();
  const { state: formVals } = location;
  const [roundHistory, setRoundHistory] = useLocalStorage('roundHistory', []);
  const team1Score = calculateTeamScoreFromRoundHistory(roundHistory, TEAM1);
  const team2Score = calculateTeamScoreFromRoundHistory(roundHistory, TEAM2);

  return (
    <div className='App'>
      <GameScore
        formVals={formVals}
        team1Score={team1Score.teamScore}
        team1Bags={team1Score.teamBags}
        team2Score={team2Score.teamScore}
        team2Bags={team2Score.teamBags}
        setRoundHistory={setRoundHistory}
      />
      <CurrentRound
        roundNumber={roundHistory.length + 1}
        values={formVals}
        team1GameScore={team1Score}
        team2GameScore={team2Score}
        roundHistory={roundHistory}
        setRoundHistory={setRoundHistory}
      />
      <PastRounds
        roundHistory={roundHistory}
        setRoundHistory={setRoundHistory}
      />
    </div>
  );
}

export default SpadesCalculator;
