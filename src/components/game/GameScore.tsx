import { useContext } from 'react';
import { Container, SimpleGrid } from '../ui';

import TeamScore from './TeamScore';
import { GlobalContext } from '../../helpers/context/GlobalContext';
import {
  calculateTeamScoreFromRoundHistory,
  calculateRoundScore,
} from '../../helpers/math/spadesMath';
import { TEAM1, TEAM2 } from '../../helpers/utils/constants';
import { isNotDefaultValue } from '../../helpers/math/spadesMath';

const GameScore = function () {
  const { roundHistory, currentRound } = useContext(GlobalContext);
  const names = JSON.parse(localStorage.getItem('names'));
  if (!names) return null;
  const nilSetting = JSON.parse(localStorage.getItem('nilScoringRule'));

  // Calculate scores from completed rounds
  const team1ScoreFromHistory = calculateTeamScoreFromRoundHistory(
    roundHistory,
    TEAM1,
    nilSetting
  );
  const team2ScoreFromHistory = calculateTeamScoreFromRoundHistory(
    roundHistory,
    TEAM2,
    nilSetting
  );

  // Calculate scores from current round if teams have completed their actuals
  const team1CurrentRoundScore = calculateCurrentRoundTeamScore(
    currentRound,
    TEAM1,
    nilSetting,
    isNotDefaultValue
  );
  const team2CurrentRoundScore = calculateCurrentRoundTeamScore(
    currentRound,
    TEAM2,
    nilSetting,
    isNotDefaultValue
  );

  // Combine scores from history and current round
  const team1Score = {
    teamScore:
      team1ScoreFromHistory.teamScore + team1CurrentRoundScore.teamScore,
    teamBags: team1ScoreFromHistory.teamBags + team1CurrentRoundScore.teamBags,
  };
  const team2Score = {
    teamScore:
      team2ScoreFromHistory.teamScore + team2CurrentRoundScore.teamScore,
    teamBags: team2ScoreFromHistory.teamBags + team2CurrentRoundScore.teamBags,
  };

  return (
    <>
      <Container 
        pb={5} 
        borderBottom="1px solid" 
        borderBottomColor="offWhite"
        data-testid="game-score-container"
      >
        <SimpleGrid columns={2}>
          <TeamScore
            teamClassName="team1"
            teamName={names.team1Name}
            scoreObj={team1Score}
          />
          <TeamScore
            teamClassName="team2"
            teamName={names.team2Name}
            scoreObj={team2Score}
          />
        </SimpleGrid>
      </Container>
    </>
  );
};

// Helper function to calculate score for a team in the current round
function calculateCurrentRoundTeamScore(
  currentRound,
  teamKey,
  nilSetting,
  isNotDefaultValue
) {
  if (!currentRound) {
    return { teamScore: 0, teamBags: 0 };
  }

  const teamData = currentRound[teamKey];
  if (!teamData) {
    return { teamScore: 0, teamBags: 0 };
  }

  // Check if this team has completed their actuals
  const teamInputVals = Object.values(teamData);
  const teamInputsAreEntered = teamInputVals.every(isNotDefaultValue);

  if (!teamInputsAreEntered) {
    return { teamScore: 0, teamBags: 0 };
  }

  // Calculate the round score for this team
  const roundScore = calculateRoundScore(
    teamData.p1Bid,
    teamData.p2Bid,
    teamData.p1Actual,
    teamData.p2Actual,
    nilSetting
  );

  return {
    teamScore: roundScore.score,
    teamBags: roundScore.bags,
  };
}

export default GameScore;
