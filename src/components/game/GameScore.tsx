import { Container, SimpleGrid } from '../ui';
import TeamScore from './TeamScore';
import { useGameScores } from '../../helpers/utils/hooks';
import { useContext } from 'react';
import { GlobalContext } from '../../store/GlobalContext';

const GameScore = function () {
  const { displayNames } = useContext(GlobalContext);

  const { team1Score, team2Score } = useGameScores();

  if (!displayNames) return null;

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
            teamName={displayNames.team1Name}
            scoreObj={team1Score}
          />
          <TeamScore
            teamClassName="team2"
            teamName={displayNames.team2Name}
            scoreObj={team2Score}
          />
        </SimpleGrid>
      </Container>
    </>
  );
};

export default GameScore;
