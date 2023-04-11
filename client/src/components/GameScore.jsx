import React, { useContext } from 'react';
import {
  Container,
  SimpleGrid,
  Center,
  Heading,
} from '@chakra-ui/react';

import TeamScore from './TeamScore';
import { GlobalContext } from '../helpers/GlobalContext';
import Navbar from './Navbar';
import { calculateTeamScoreFromRoundHistory } from '../helpers/spadesMath';
import { TEAM1, TEAM2 } from '../helpers/constants';

const GameScore = function () {
  const names = JSON.parse(localStorage.getItem('names'));
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
    <>
      <Navbar />
      <Container pb={5} borderBottom={'1px solid #ebf5ee'}>
        <Center>
          <Heading as='h2' size='lg' style={{ textDecoration: 'underline' }}>
            Score
          </Heading>
        </Center>
        <SimpleGrid columns={2}>
          <TeamScore
            teamClassName='team1'
            teamName={names.team1Name}
            scoreObj={team1Score}
          />
          <TeamScore
            teamClassName='team2'
            teamName={names.team2Name}
            scoreObj={team2Score}
          />
        </SimpleGrid>
      </Container>
    </>
  );
};

export default GameScore;
