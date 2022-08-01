import React, { useState } from 'react';
import {
  Container,
  SimpleGrid,
  Center,
  Heading,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import TeamScore from './TeamScore';
import WarningModal from './WarningModal';

function GameScore({
  names,
  team1Score,
  team1Bags,
  team2Score,
  team2Bags,
  setRoundHistory,
  hasRoundHistory,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsModalOpen] = useState(false);
  const resetGameWithSamePlayers = () => {
    setIsModalOpen(true);
  };
  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <>
      <WarningModal
        isOpen={isOpen}
        setIsModalOpen={setIsModalOpen}
        setRoundHistory={setRoundHistory}
        hasRoundHistory={hasRoundHistory}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          onClick={handleNavigateHome}
          fontSize='25px'
          style={{ width: '60px' }}
          icon={<ArrowBackIcon />}
        />
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
            teamName={names.team1Name}
            teamScore={team1Score}
            teamBags={team1Bags}
          />
          <TeamScore
            teamName={names.team2Name}
            teamScore={team2Score}
            teamBags={team2Bags}
          />
        </SimpleGrid>
      </Container>
    </>
  );
}

export default GameScore;
