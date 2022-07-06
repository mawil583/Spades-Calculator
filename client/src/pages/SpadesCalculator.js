import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Container,
  Stack,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  Center,
  Input,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Heading,
  Flex,
  Text,
} from '@chakra-ui/react';
// Note: Chakra UI applies a border-width: 0; to the <body>, so none of the input boxes are visible

import SpadesRound from '../components/SpadesRound';
import '../App.css';
import CurrentRound from '../components/CurrentRound';
import { calculateScoreFromRoundHistory } from '../helpers/spadesMath';

const hasLocalStorage =
  !!JSON.parse(localStorage.getItem('roundHistory')) &&
  JSON.parse(localStorage.getItem('roundHistory')).length > 0;

function SpadesCalculator() {
  const location = useLocation();
  const { state: formVals } = location;
  const [team1BidsAndActuals, setTeam1BidsAndActuals] = useState([]);
  const [team2BidsAndActuals, setTeam2BidsAndActuals] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);

  const [roundHistory, setRoundHistory] = useState(
    hasLocalStorage ? JSON.parse(localStorage.getItem('roundHistory')) : []
  );
  let score = calculateScoreFromRoundHistory(roundHistory);
  const [team1Score, setTeam1Score] = useState(score.team1Score);
  const [team1Bags, setTeam1Bags] = useState(score.team1Bags);
  const [team2Score, setTeam2Score] = useState(score.team2Score);
  const [team2Bags, setTeam2Bags] = useState(score.team2Bags);

  function addRoundScoreToGameScore(
    t1Round,
    t2Round,
    t1Bags,
    t2Bags,
    setTeam1GameScore,
    setTeam2GameScore,
    setTeam1RoundBags,
    setTeam2RoundBags
  ) {
    setTeam1Score(team1Score + t1Round);
    setTeam2Score(team2Score + t2Round);
    setTeam1Bags(team1Bags + t1Bags);
    setTeam2Bags(team2Bags + t2Bags);
    setTeam1GameScore(team1Score + t1Round);
    setTeam2GameScore(team2Score + t2Round);
    setTeam1RoundBags(t1Bags);
    setTeam2RoundBags(t2Bags);
  }

  function pastRounds() {
    const rounds = [];
    for (let i = 0; i < roundHistory.length; i++) {
      rounds.push(
        <SpadesRound
          roundNumber={i + 1}
          key={i}
          index={i}
          values={formVals}
          roundHistory={roundHistory}
          setRoundHistory={setRoundHistory}
          team1BidsAndActuals={roundHistory[i].team1BidsAndActuals}
          team2BidsAndActuals={roundHistory[i].team2BidsAndActuals}
          addRoundScoreToGameScore={addRoundScoreToGameScore}
          team1Score={team1Score}
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
        />
      );
    }
    return rounds.reverse();
  }

  useEffect(() => {
    sessionStorage.setItem('initialValues', JSON.stringify(formVals));
  }, []);

  useEffect(() => {
    if (team1Bags >= 10) {
      setTeam1Bags(team1Bags - 10);
      setTeam1Score(team1Score - 100);
    }
    if (team2Bags >= 10) {
      setTeam2Bags(team2Bags - 10);
      setTeam2Score(team2Score - 100);
    }
  }, [team1Bags, team2Bags]);

  return (
    <div className='App'>
      <div className='App-inner'>
        <div className='team-board'>
          <div>
            <Container py={10} borderBottom={'1px solid black'}>
              <Center>
                <Heading
                  as='h2'
                  size='lg'
                  style={{ textDecoration: 'underline' }}
                >
                  Score
                </Heading>
              </Center>
              <SimpleGrid columns={2}>
                <Flex direction={'column'}>
                  <Center>
                    <Heading as={'h2'} size='md'>
                      {formVals.team1Name}
                    </Heading>
                  </Center>
                  <Center>
                    <Text fontSize={'5xl'}>{team1Score}</Text>
                  </Center>
                  <Center>
                    <Text fontSize={'md'}>{team1Bags} bags</Text>
                  </Center>
                </Flex>
                <Flex direction={'column'}>
                  <Center>
                    <Heading as={'h2'} size='md'>
                      {formVals.team2Name}
                    </Heading>
                  </Center>
                  <Center>
                    <Text fontSize={'5xl'}>{team2Score}</Text>
                  </Center>
                  <Center>
                    <Text fontSize={'md'}>{team2Bags} bags</Text>
                  </Center>
                </Flex>
              </SimpleGrid>
            </Container>
            <CurrentRound
              currentRound={currentRound}
              values={formVals}
              team1BidsAndActuals={team1BidsAndActuals}
              team2BidsAndActuals={team2BidsAndActuals}
              setTeam1BidsAndActuals={setTeam1BidsAndActuals}
              setTeam2BidsAndActuals={setTeam2BidsAndActuals}
              roundHistory={roundHistory}
              setRoundHistory={setRoundHistory}
              addRoundScoreToGameScore={addRoundScoreToGameScore}
              team1Score={team1Score}
            />
            {pastRounds().map((round) => round)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpadesCalculator;
