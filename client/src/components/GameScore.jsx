import React from 'react';
import {
  Container,
  SimpleGrid,
  Center,
  Heading,
  Button,
} from '@chakra-ui/react';
import TeamScore from './TeamScore';

function GameScore({
  formVals,
  team1Score,
  team1Bags,
  team2Score,
  team2Bags,
  setRoundHistory,
}) {
  const resetGameWithSamePlayers = () => {
    setRoundHistory([]);
  };

  return (
    <div>
      <div
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}
      >
        <Button onClick={resetGameWithSamePlayers}>New Game</Button>
      </div>
      <Container pb={10} borderBottom={'1px solid black'}>
        <Center>
          <Heading as='h2' size='lg' style={{ textDecoration: 'underline' }}>
            Score
          </Heading>
        </Center>
        <SimpleGrid columns={2}>
          <TeamScore
            teamName={formVals.team1Name}
            teamScore={team1Score}
            teamBags={team1Bags}
          />
          <TeamScore
            teamName={formVals.team2Name}
            teamScore={team2Score}
            teamBags={team2Bags}
          />
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default GameScore;
