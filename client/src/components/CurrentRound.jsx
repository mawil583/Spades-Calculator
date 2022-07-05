import React, { useState, useEffect, createContext } from 'react';
import {
  Container,
  SimpleGrid,
  Center,
  Heading,
  Flex,
  Box,
} from '@chakra-ui/react';
import PlayerInput from './PlayerInput';

import { calculateRoundScore } from '../helpers/spadesMath';
export const SelectContext = createContext();

function CurrentRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  console.log({ team1BidsAndActuals: props.team1BidsAndActuals });

  const [team1RoundScore, setTeam1RoundScore] = useState(0);
  const [team2RoundScore, setTeam2RoundScore] = useState(0);
  const [team1GameScore, setTeam1GameScore] = useState(0);
  const [team2GameScore, setTeam2GameScore] = useState(0);
  const [team1RoundBags, setTeam1RoundBags] = useState(0);
  const [team2RoundBags, setTeam2RoundBags] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  // team 1
  const [t1p1Bid, setT1p1Bid] = useState('');
  const [t1p2Bid, setT1p2Bid] = useState('');
  const [t1p1Actual, setT1p1Actual] = useState('');
  const [t1p2Actual, setT1p2Actual] = useState('');
  const team1BidsAndActuals = {
    p1Bid: t1p1Bid,
    p2Bid: t1p2Bid,
    p1Actual: t1p1Actual,
    p2Actual: t1p2Actual,
  };
  const team1Setters = { setT1p1Bid, setT1p2Bid, setT1p1Actual, setT1p2Actual };

  // team 2
  const [t2p1Bid, setT2p1Bid] = useState('');
  const [t2p2Bid, setT2p2Bid] = useState('');
  const [t2p1Actual, setT2p1Actual] = useState('');
  const [t2p2Actual, setT2p2Actual] = useState('');
  const team2BidsAndActuals = {
    p1Bid: t2p1Bid,
    p2Bid: t2p2Bid,
    p1Actual: t2p1Actual,
    p2Actual: t2p2Actual,
  };
  const team2Setters = { setT2p1Bid, setT2p2Bid, setT2p1Actual, setT2p2Actual };

  const isNotDefaultValue = (value) => {
    return value !== '';
  };

  const resetRoundValues = () => {
    setTeam1RoundScore(0);
    setTeam2RoundScore(0);
    setTeam1RoundBags(0);
    setTeam2RoundBags(0);
    setIsRoundFinished(false);
    setT1p1Bid('');
    setT1p2Bid('');
    setT1p1Actual('');
    setT1p2Actual('');
    setT2p1Bid('');
    setT2p2Bid('');
    setT2p1Actual('');
    setT2p2Actual('');
  };

  // handleSelect happens BEFORE state has been updated.
  // const handleSelect = () => {
  //   // const team1InputVals = Object.values(team1BidsAndActuals);
  //   // const team2InputVals = Object.values(team2BidsAndActuals);
  //   console.log({ t1p1Bid });
  //   console.log({ t1p2Bid });
  //   console.log({ t1p1Actual });
  //   console.log({ t1p2Actual });
  //   const team1InputVals = [t1p1Bid, t1p2Bid, t1p1Actual, t1p2Actual];
  //   const team2InputVals = [t2p1Bid, t2p2Bid, t2p1Actual, t2p2Actual];
  //   const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
  //   const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
  //   const allBidsAndActualsAreEntered =
  //     team1InputsAreEntered && team2InputsAreEntered;
  //   console.log({ team1InputVals });
  //   console.log({ team2InputVals });
  //   console.log({ team1InputsAreEntered });
  //   console.log({ allBidsAndActualsAreEntered });
  //   if (allBidsAndActualsAreEntered) {
  //     setIsRoundFinished(true);
  //     props.setBidsAndActuals([
  //       ...props.bidsAndActuals,
  //       { ...team1BidsAndActuals, ...team2BidsAndActuals },
  //     ]);
  //     const roundScore = calculateRoundScore(
  //       team1BidsAndActuals,
  //       team2BidsAndActuals
  //     );
  //     setTeam1RoundScore(roundScore.team1RoundScore.score);
  //     setTeam2RoundScore(roundScore.team2RoundScore.score);
  //     props.addRoundScoreToGameScore(
  //       roundScore.team1RoundScore.score,
  //       roundScore.team2RoundScore.score,
  //       roundScore.team1RoundScore.bags,
  //       roundScore.team2RoundScore.bags,
  //       setTeam1GameScore,
  //       setTeam2GameScore,
  //       setTeam1RoundBags,
  //       setTeam2RoundBags
  //     );
  //     resetRoundValues();
  //     props.setCurrentRound(props.currentRound + 1);
  //   }
  // };

  useEffect(() => {
    console.log('useEffect CurrentRound');
    const team1InputVals = Object.values(team1BidsAndActuals);
    const team2InputVals = Object.values(team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;
    if (allBidsAndActualsAreEntered) {
      console.log('allInputsEntered');
      setIsRoundFinished(true);
      props.setBidsAndActuals([
        ...props.bidsAndActuals,
        { ...team1BidsAndActuals, ...team2BidsAndActuals },
      ]);

      const roundScore = calculateRoundScore(
        team1BidsAndActuals,
        team2BidsAndActuals
      );
      setTeam1RoundScore(roundScore.team1RoundScore.score);
      setTeam2RoundScore(roundScore.team2RoundScore.score);
      props.addRoundScoreToGameScore(
        roundScore.team1RoundScore.score,
        roundScore.team2RoundScore.score,
        roundScore.team1RoundScore.bags,
        roundScore.team2RoundScore.bags,
        setTeam1GameScore,
        setTeam2GameScore,
        setTeam1RoundBags,
        setTeam2RoundBags
      );
      props.setRoundHistory([
        ...props.roundHistory,
        { team1BidsAndActuals, team2BidsAndActuals },
      ]);
      localStorage.setItem(
        'roundHistory',
        JSON.stringify([
          ...props.roundHistory,
          { team1BidsAndActuals, team2BidsAndActuals },
        ])
      );
      resetRoundValues();
      // props.setCurrentRound(props.currentRound + 1);
    }
  }, [
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual,
    t2p1Bid,
    t2p2Bid,
    t2p1Actual,
    t2p2Actual,
  ]);

  return (
    // <SelectContext.Provider handleSelect={handleSelect}>
    // <SelectContext.Provider value={handleSelect}>
    <div>
      <Heading as={'h3'}>Round {props.roundHistory.length + 1}</Heading>
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
            {isRoundFinished && (
              <div>
                <Center>
                  <Heading mt={'20px'} mb={'10px'} size={'lg'}>
                    Score
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
            )}
            <Center>
              <Heading mt={'20px'} mb={'10px'} size={'md'}>
                Bids
              </Heading>
            </Center>
            <SimpleGrid columns={2} className='namesContainer'>
              <PlayerInput
                setValTo={setT1p1Bid}
                playerName={t1p1Name}
                val={t1p1Bid}
                id='team1BidsAndActuals.p1Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT2p1Bid}
                playerName={t2p1Name}
                val={t2p1Bid}
                id='team2BidsAndActuals.p1Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT1p2Bid}
                playerName={t1p2Name}
                val={t1p2Bid}
                id='team1BidsAndActuals.p2Bid'
                type={'Bid'}
              />
              <PlayerInput
                setValTo={setT2p2Bid}
                playerName={t2p2Name}
                val={t2p2Bid}
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
                val={t1p1Actual}
                // val={props.team1BidsAndActuals.p1Bid}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT2p1Actual}
                id='team2BidsAndActuals.p1Actual'
                playerName={t2p1Name}
                val={t2p1Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT1p2Actual}
                playerName={t1p2Name}
                id='team1BidsAndActuals.p2Actual'
                val={t1p2Actual}
                type={'Actual'}
              />
              <PlayerInput
                setValTo={setT2p2Actual}
                playerName={t2p2Name}
                val={t2p2Actual}
                type={'Actual'}
                id='team2BidsAndActuals.p2Actual'
              />
            </SimpleGrid>
          </Container>
          <div></div>
        </div>
      </form>
    </div>
    // </SelectContext.Provider>
  );
}

export default CurrentRound;
