import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  SimpleGrid,
  Center,
  Heading,
  Flex,
  Box,
  calc,
} from '@chakra-ui/react';
import PlayerInput from './PlayerInput';

import {
  calculateRoundScoreNew,
  calculateScoreFromRoundHistory,
  calculateRoundHistoryAtCurrentRound,
} from '../helpers/spadesMath';
const hasLocalStorage =
  !!JSON.parse(localStorage.getItem('roundHistory')) &&
  JSON.parse(localStorage.getItem('roundHistory')).length > 0;

function SpadesRound(props) {
  const { roundHistory, index } = props;
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const team1RoundScoreFromHistory = calculateRoundScoreNew(
    roundHistory[index].team1BidsAndActuals.p1Bid,
    roundHistory[index].team1BidsAndActuals.p2Bid,
    roundHistory[index].team1BidsAndActuals.p1Actual,
    roundHistory[index].team1BidsAndActuals.p2Actual
  );
  const team2RoundScoreFromHistory = calculateRoundScoreNew(
    roundHistory[index].team2BidsAndActuals.p1Bid,
    roundHistory[index].team2BidsAndActuals.p2Bid,
    roundHistory[index].team2BidsAndActuals.p1Actual,
    roundHistory[index].team2BidsAndActuals.p2Actual
  );

  const roundHistoryAtEndOfThisRound = calculateRoundHistoryAtCurrentRound(
    roundHistory,
    index
  );
  const gameScoreAtEndOfThisRound = calculateScoreFromRoundHistory(
    roundHistoryAtEndOfThisRound
  );

  const inputRef = useRef();
  const [team1RoundScore, setTeam1RoundScore] = useState(
    team1RoundScoreFromHistory?.score || 0
  );
  const [team2RoundScore, setTeam2RoundScore] = useState(
    team2RoundScoreFromHistory?.score || 0
  );
  const [team1GameScore, setTeam1GameScore] = useState(
    gameScoreAtEndOfThisRound.team1Score
  );
  const [team1RoundBags, setTeam1RoundBags] = useState(
    team1RoundScoreFromHistory?.bags || 0
  );
  const [team2RoundBags, setTeam2RoundBags] = useState(
    team2RoundScoreFromHistory?.bags || 0
  );
  const [team2GameScore, setTeam2GameScore] = useState(
    gameScoreAtEndOfThisRound.team2Score
  );
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const formik = useFormik({
    initialValues: {
      team1BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
      team2BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
    },
  });

  // team 1
  // const [t1p1Bid, setT1p1Bid] = useState('');
  // console.log(
  //   JSON.parse(localStorage.getItem('rounds'))[props.index]
  //     .team1BidsAndActuals.p1Bid
  // );
  console.log(props.index);
  const sessionRounds = JSON.parse(localStorage.getItem('rounds'));
  const sessionRound = sessionRounds ? sessionRounds[props.index] : undefined;
  const isStoredInSession = () => {
    if (sessionRound) {
      return true;
    }
    return false;
  };

  const [t1p1Bid, setT1p1Bid] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p1Bid : ''
  );
  // const [t1p2Bid, setT1p2Bid] = useState('');
  const [t1p2Bid, setT1p2Bid] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p2Bid : ''
  );
  // const [t1p1Actual, setT1p1Actual] = useState('');
  const [t1p1Actual, setT1p1Actual] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p1Actual : ''
  );
  // const [t1p2Actual, setT1p2Actual] = useState('');
  const [t1p2Actual, setT1p2Actual] = useState(
    isStoredInSession() ? sessionRound.team1BidsAndActuals.p2Actual : ''
  );
  const team1BidsAndActuals = {
    p1Bid: t1p1Bid,
    p2Bid: t1p2Bid,
    p1Actual: t1p1Actual,
    p2Actual: t1p2Actual,
  };
  const team1Setters = { setT1p1Bid, setT1p2Bid, setT1p1Actual, setT1p2Actual };

  // team 2
  // const [t2p1Bid, setT2p1Bid] = useState('');
  const [t2p1Bid, setT2p1Bid] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p1Bid : ''
  );
  // const [t2p2Bid, setT2p2Bid] = useState('');
  const [t2p2Bid, setT2p2Bid] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p2Bid : ''
  );
  // const [t2p1Actual, setT2p1Actual] = useState('');
  const [t2p1Actual, setT2p1Actual] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p1Actual : ''
  );
  // const [t2p2Actual, setT2p2Actual] = useState('');
  const [t2p2Actual, setT2p2Actual] = useState(
    isStoredInSession() ? sessionRound.team2BidsAndActuals.p2Actual : ''
  );
  const team2BidsAndActuals = {
    p1Bid: t2p1Bid,
    p2Bid: t2p2Bid,
    p1Actual: t2p1Actual,
    p2Actual: t2p2Actual,
  };

  const team2Setters = { setT2p1Bid, setT2p2Bid, setT2p1Actual, setT2p2Actual };

  return (
    <div>
      <Heading as={'h3'}>Round {props.roundNumber}</Heading>
      <Box>
        <Flex direction={'row'} height={'30px'}>
          <Box
            width={'100%'}
            borderBottom={'1px solid black'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center>{team1Name}</Center>
          </Box>
          <Box
            width={'100%'}
            borderBottom={'1px solid gray'}
            mr={'5px'}
            ml={'5px'}
          >
            <Center>{team2Name}</Center>
          </Box>
        </Flex>
      </Box>

      <form>
        <div>
          <Container>
            <div>
              <Center>
                <Heading mt={'20px'} mb={'10px'} size={'lg'}>
                  Round Summary
                </Heading>
              </Center>
              <SimpleGrid columns={2} className='namesContainer'>
                <Center>Round Score: {team1RoundScore}</Center>
                <Center>Round Score: {team2RoundScore}</Center>
                <Center>Game Score: {team1GameScore}</Center>
                <Center>Game Score: {team2GameScore}</Center>
                <Center>Bags: {team1RoundBags}</Center>
                <Center>Bags: {team2RoundBags}</Center>
              </SimpleGrid>
            </div>

            <Center>
              <Heading mt={'20px'} mb={'10px'} size={'md'}>
                Bids
              </Heading>
            </Center>
            <SimpleGrid columns={2} className='namesContainer'>
              <PlayerInput
                setValTo={setT1p1Bid}
                playerName={t1p1Name}
                val={props.team1BidsAndActuals?.p1Bid}
                id='team1BidsAndActuals.p1Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT2p1Bid}
                playerName={t2p1Name}
                val={props.team2BidsAndActuals?.p1Bid}
                id='team2BidsAndActuals.p1Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT1p2Bid}
                playerName={t1p2Name}
                val={props.team1BidsAndActuals?.p2Bid}
                id='team1BidsAndActuals.p2Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT2p2Bid}
                playerName={t2p2Name}
                val={props.team2BidsAndActuals?.p2Bid}
                id='team2BidsAndActuals.p2Bid'
                type={'Bid'}
              />
            </SimpleGrid>
            <Center>
              <hr
                style={{ width: '60%', color: '#808080', margin: '10px 0' }}
              />
            </Center>
            <Center>
              <Heading mt={'20px'} mb={'10px'} size={'md'}>
                Actuals
              </Heading>
            </Center>
            <SimpleGrid columns={2} className='namesContainer'>
              <PlayerInput
                setValTo={setT1p1Actual}
                id='team1BidsAndActuals.p1Actual'
                playerName={t1p1Name}
                val={props.team1BidsAndActuals?.p1Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT2p1Actual}
                id='team2BidsAndActuals.p1Actual'
                playerName={t2p1Name}
                val={props.team2BidsAndActuals?.p1Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT1p2Actual}
                playerName={t1p2Name}
                id='team1BidsAndActuals.p2Actual'
                val={props.team1BidsAndActuals?.p2Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT2p2Actual}
                playerName={t2p2Name}
                val={props.team2BidsAndActuals?.p2Actual}
                type={'Actual'}
                id='team2BidsAndActuals.p2Actual'
              />
            </SimpleGrid>
          </Container>
          <div></div>
        </div>
      </form>
    </div>
  );
}

export default SpadesRound;

// make smaller. Split into bidsSection, ActualsSections
