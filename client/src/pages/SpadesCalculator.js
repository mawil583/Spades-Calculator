import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import GameScore from '../components/GameScore';
import CurrentRound from '../components/CurrentRound';
import { calculateTeamScoreFromRoundHistory } from '../helpers/spadesMath';
import PastRounds from '../components/PastRounds';
import { TEAM1, TEAM2 } from '../helpers/constants';
import { useRedirectWhenFalsey } from '../helpers/hooks';
import { GlobalContext } from '../helpers/GlobalContext';

function SpadesCalculator() {
  const navigate = useNavigate();
  const names = JSON.parse(localStorage.getItem('names'));
  useRedirectWhenFalsey(names, navigate);
  const { roundHistory } = useContext(GlobalContext);
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));
  const team1Score = calculateTeamScoreFromRoundHistory(
    roundHistory,
    TEAM1,
    nilSetting
  );
  const team2Score = calculateTeamScoreFromRoundHistory(
    roundHistory,
    TEAM2,
    nilSetting
  );

  return (
    <div className='App'>
      {names && (
        <>
          <GameScore
            names={names}
            team1Score={team1Score.teamScore}
            team1Bags={team1Score.teamBags}
            team2Score={team2Score.teamScore}
            team2Bags={team2Score.teamBags}
            hasRoundHistory={roundHistory.length > 0}
          />
          <CurrentRound
            roundNumber={roundHistory.length + 1}
            names={names}
            team1GameScore={team1Score}
            team2GameScore={team2Score}
            roundHistory={roundHistory}
          />
          <PastRounds names={names} roundHistory={roundHistory} />
        </>
      )}
    </div>
  );
}

export default SpadesCalculator;
