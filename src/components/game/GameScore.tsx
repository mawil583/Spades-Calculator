import { Container, SimpleGrid } from '../ui';
import TeamScore from './TeamScore';
import { useGameScores } from '../../helpers/utils/hooks';
import { useContext } from 'react';
import { GlobalContext } from '../../store/GlobalContext';

const GameScore = function () {
  const { names } = useContext(GlobalContext);

  const { team1Score, team2Score } = useGameScores();

  if (!names) return null;

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

export default GameScore;
