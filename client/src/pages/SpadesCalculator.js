import React from 'react';
import { useLocation } from 'react-router-dom';
import GameScore from '../components/GameScore';
import '../App.css';
import CurrentRound from '../components/CurrentRound';
import { calculateScoreFromRoundHistory } from '../helpers/spadesMath';
import { useLocalStorage } from '../helpers/hooks';
import PastRounds from '../components/PastRounds';

function SpadesCalculator() {
  const location = useLocation();
  const { state: formVals } = location;
  const [roundHistory, setRoundHistory] = useLocalStorage('roundHistory', []);
  const score = calculateScoreFromRoundHistory(roundHistory);
  const { team1Bags, team2Bags, team1Score, team2Score } = score;

  return (
    <div className='App'>
      <GameScore
        formVals={formVals}
        team1Score={team1Score}
        team1Bags={team1Bags}
        team2Score={team2Score}
        team2Bags={team2Bags}
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
