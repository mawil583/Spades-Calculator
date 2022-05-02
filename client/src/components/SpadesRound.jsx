import React, { useEffect, useState, useRef } from 'react';
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
  Divider,
  Box,
} from '@chakra-ui/react';

import { calculateRoundScore } from '../helpers/spadesMath';

function SpadesRound(props) {
  const { team1Name, team2Name, t1p1Name, t1p2Name, t2p1Name, t2p2Name } =
    props.values;

  const inputRef = useRef();
  const [team1RoundScore, setTeam1RoundScore] = useState(0);
  const [team2RoundScore, setTeam2RoundScore] = useState(0);
  const [team1GameScore, setTeam1GameScore] = useState(0);
  const [team1RoundBags, setTeam1Bags] = useState(0);
  const [team2RoundBags, setTeam2Bags] = useState(0);
  const [team2GameScore, setTeam2GameScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  function moveFocusToCurrentRound() {
    inputRef.current.focus();
  }

  const formik = useFormik({
    initialValues: {
      team1BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
      team2BidsAndActuals: { p1Bid: '', p1Actual: '', p2Bid: '', p2Actual: '' },
    },
  });
  const isNotDefaultValue = (value) => {
    return value !== '';
  };

  useEffect(() => {
    moveFocusToCurrentRound();
  }, []);

  /* 
  maybe split useEffect into 2 or 3

  1st useEffect sets IsRoundFinished

  2nd useEffect sets score and dependency is IsRoundFinished


  */

  useEffect(() => {
    const team1InputVals = Object.values(formik.values.team1BidsAndActuals);
    const team2InputVals = Object.values(formik.values.team2BidsAndActuals);
    const team1InputsAreEntered = team1InputVals.every(isNotDefaultValue);
    const team2InputsAreEntered = team2InputVals.every(isNotDefaultValue);
    const allBidsAndActualsAreEntered =
      team1InputsAreEntered && team2InputsAreEntered;
    if (allBidsAndActualsAreEntered) {
      setIsRoundFinished(true);
      console.log({ bidsAndActuals: props.bidsAndActuals });
      props.setBidsAndActuals([...props.bidsAndActuals, { ...formik.values }]);
      // set history here
      const roundScore = calculateRoundScore(
        formik.values.team1BidsAndActuals,
        formik.values.team2BidsAndActuals
      );
      // this causes infinite loop when roundScore is in dependency array
      setTeam1RoundScore(roundScore.team1RoundScore.score);
      setTeam2RoundScore(roundScore.team2RoundScore.score);
      console.log({ roundScore });
      // TODO: simplify. Maybe form an object instead of passing so many parameters
      // this also causes infinite loop when roundScore is in dependency array
      props.addRoundScoreToGameScore(
        roundScore.team1RoundScore.score,
        roundScore.team2RoundScore.score,
        roundScore.team1RoundScore.bags,
        roundScore.team2RoundScore.bags,
        // maybe pass setTeam1GameScore fn as parameter
        setTeam1GameScore,
        setTeam2GameScore,
        setTeam1Bags,
        setTeam2Bags
      );
      console.log({ roundHistory: props.roundHistory });
      console.log({ roundHistoryLength: props.roundHistory.length });

      // props.roundHistory.length === 0
      //   ? props.setRoundHistory([scoreObj])
      //   : props.setRoundHistory([...props.roundHistory, scoreObj]);
    }
  }, [formik.values]);

  const GridCardItem = ({ playerName, val, id }) => {
    return (
      <Flex my={'5px'} direction={'row'} justify={'space-around'}>
        <label style={{ marginRight: '15px' }} htmlFor='p1Bid'>
          {playerName}
        </label>
        <Input
          w={'30px'}
          size={'xs'}
          ref={inputRef}
          type='text'
          value={val}
          onChange={formik.handleChange}
          // TODO: attributes id and name have to be the same because Formik maps them to initialValues. This is bad practice. Try not to nest anything within initialValues
          // id='team1BidsAndActuals.p1Bid'
          // name='team1BidsAndActuals.p1Bid'
          id={id}
          name={id}
          mr={'15px'}
        />
      </Flex>
    );
  };

  // useEffect(() => {

  // }, [props.team1Score])

  console.log({ roundHistory: props.roundHistory });
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
            {isRoundFinished ? (
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
            ) : null}
            <Center>
              <Heading mt={'20px'} mb={'10px'} size={'md'}>
                Bids
              </Heading>
            </Center>
            <SimpleGrid columns={2} className='namesContainer'>
              <GridCardItem
                playerName={t1p1Name}
                val={formik.values.team1BidsAndActuals.p1Bid}
                id='team1BidsAndActuals.p1Bid'
              />
              <GridCardItem
                playerName={t2p1Name}
                val={formik.values.team2BidsAndActuals.p1Bid}
                id='team2BidsAndActuals.p1Bid'
              />
              <GridCardItem
                playerName={t1p2Name}
                val={formik.values.team1BidsAndActuals.p2Bid}
                id='team1BidsAndActuals.p2Bid'
              />
              <GridCardItem
                playerName={t2p2Name}
                val={formik.values.team2BidsAndActuals.p2Bid}
                id='team2BidsAndActuals.p2Bid'
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
              <GridCardItem
                id='team1BidsAndActuals.p1Actual'
                playerName={t1p1Name}
                val={formik.values.team1BidsAndActuals.p1Actual}
              />
              <GridCardItem
                id='team2BidsAndActuals.p1Actual'
                playerName={t2p1Name}
                val={formik.values.team2BidsAndActuals.p1Actual}
              />
              <GridCardItem
                playerName={t1p2Name}
                id='team1BidsAndActuals.p2Actual'
                val={formik.values.team1BidsAndActuals.p2Actual}
              />
              <GridCardItem
                playerName={t2p2Name}
                val={formik.values.team2BidsAndActuals.p2Actual}
                id='team2BidsAndActuals.p2Actual'
              />
            </SimpleGrid>
          </Container>
          <div></div>
        </div>

        {/* <div>
          <h2>
            {team2Name}
            {team2Score ? ` Score: ${team2Score}` : null}
          </h2>

          <br />
        </div> */}
      </form>
    </div>
  );
}

export default SpadesRound;
